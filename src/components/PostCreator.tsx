import React, { useState, useRef, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import imageCompression from "browser-image-compression";
import { storage, db, auth } from "@/lib/firebaseConfig";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { X } from "lucide-react";

interface MediaItem {
  file: File;
  previewUrl: string;
  type: "image" | "video";
  id: string;
  progress: number;
  uploadedUrl?: string;
}

const PostCreator = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check authentication
  useEffect(() => {
    if (!auth.currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a post",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [navigate, toast]);

  // Handle file selection (input)
  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    await addFiles(Array.from(e.target.files));
  };

  // Handle drag-and-drop events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await addFiles(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  };

  const addFiles = async (files: File[]) => {
    const newMedia: MediaItem[] = await Promise.all(
      files.map(async (file) => {
        let type: "image" | "video" = file.type.startsWith("image/") ? "image" : "video";
        let processedFile = file;

        if (type === "image") {
          processedFile = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          });
        }

        const previewUrl = URL.createObjectURL(processedFile);
        return {
          file: processedFile,
          previewUrl,
          type,
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          progress: 0,
        };
      })
    );
    setMedia((prev) => [...prev, ...newMedia]);
  };

  const removeItem = (id: string) => {
    setMedia((prev) => prev.filter((item) => item.id !== id));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(media);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setMedia(items);
  };

  // Upload files to Firebase
  const handleUpload = async () => {
    if (!media.length) return;
    
    const user = auth.currentUser;
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please log in to create a post",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    setUploading(true);

    try {
      // Force token refresh to ensure valid credentials
      await user.getIdToken(true);

      for (const item of media) {
        const storageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${item.file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, item.file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setMedia((prev) =>
              prev.map((m) => (m.id === item.id ? { ...m, progress } : m))
            );
          },
          (error) => {
            console.error("Upload error:", error);
            removeItem(item.id);
            toast({
              title: "Upload failed",
              description: error.message,
              variant: "destructive",
            });
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            setMedia((prev) =>
              prev.map((m) =>
                m.id === item.id ? { ...m, uploadedUrl: downloadURL, progress: 100 } : m
              )
            );

            await addDoc(collection(db, "posts"), {
              userId: user.uid,
              author: user.email || 'Anonymous',
              mediaUrl: downloadURL,
              mediaType: item.type,
              likes: 0,
              shares: 0,
              comments: [],
              createdAt: serverTimestamp(),
            });

            toast({
              title: "Post created!",
              description: "Your media has been shared with your tribe",
            });
          }
        );
      }
    } catch (error: any) {
      console.error("Error uploading:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload media",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Drag-and-drop area */}
      <div
        className={`border-2 border-dashed p-8 rounded-lg text-center cursor-pointer transition-colors ${
          dragActive 
            ? "border-primary bg-primary/10" 
            : "border-border bg-background hover:bg-accent/50"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <p className="text-foreground">
          {dragActive ? "Drop files here..." : "Drag & drop images/videos or click to select"}
        </p>
      </div>

      <input
        type="file"
        multiple
        accept="image/*,video/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFilesChange}
      />

      <Button
        onClick={handleUpload}
        disabled={uploading || media.length === 0}
        className="mt-4 w-full"
      >
        {uploading ? "Uploading..." : `Post ${media.length > 0 ? `(${media.length} file${media.length > 1 ? 's' : ''})` : ''}`}
      </Button>

      {/* Media gallery with drag and drop */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="media-gallery" direction="horizontal">
          {(provided) => (
            <div
              className="flex gap-4 mt-6 overflow-x-auto pb-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {media.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`relative w-48 h-48 border border-border rounded-lg overflow-hidden flex-shrink-0 transition-shadow ${
                        snapshot.isDragging ? "shadow-lg" : ""
                      }`}
                    >
                      {item.type === "image" ? (
                        <img 
                          src={item.previewUrl} 
                          alt="preview" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <video 
                          src={item.previewUrl} 
                          controls 
                          className="w-full h-full object-cover" 
                        />
                      )}

                      {/* Progress overlay */}
                      {item.progress > 0 && item.progress < 100 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                          <span className="text-foreground font-semibold">{Math.round(item.progress)}%</span>
                        </div>
                      )}

                      {/* Remove button */}
                      {!uploading && (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full p-1 shadow-lg transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}

                      {/* Download button */}
                      {item.uploadedUrl && (
                        <a
                          href={item.uploadedUrl}
                          download
                          className="absolute bottom-2 right-2 bg-background text-foreground px-2 py-1 text-xs rounded shadow-lg hover:bg-accent transition-colors"
                        >
                          Download
                        </a>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default PostCreator;
