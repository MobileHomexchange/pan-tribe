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

  // 🔐 Auth Check
  useEffect(() => {
    if (!auth.currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a post",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [navigate, toast]);

  // 📁 Add File(s)
  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    await addFiles(Array.from(e.target.files));
  };

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
        const type: "image" | "video" = file.type.startsWith("image/") ? "image" : "video";
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
      }),
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

  // 🚀 Upload and Create Post
  const handleUpload = async () => {
    if (!media.length) return;

    const user = auth.currentUser;
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please log in to create a post",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setUploading(true);

    try {
      await user.getIdToken(true);

      const uploadedUrls: string[] = [];

      for (const item of media) {
        const storageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${item.file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, item.file);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setMedia((prev) => prev.map((m) => (m.id === item.id ? { ...m, progress } : m)));
            },
            (error) => reject(error),
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              uploadedUrls.push(downloadURL);
              setMedia((prev) =>
                prev.map((m) => (m.id === item.id ? { ...m, uploadedUrl: downloadURL, progress: 100 } : m)),
              );
              resolve();
            },
          );
        });
      }

      // ✅ Save post AFTER all uploads complete
      await addDoc(collection(db, "posts"), {
        userId: user.uid,
        author: user.email || "Anonymous",
        mediaUrls: uploadedUrls,
        createdAt: serverTimestamp(),
        likes: 0,
        shares: 0,
        comments: [],
      });

      toast({
        title: "Success!",
        description: "Your post was uploaded successfully.",
      });

      setMedia([]);
      navigate("/feed");
    } catch (error: any) {
      console.error("Error uploading:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload post.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Drop Area */}
      <div
        className={`border-2 border-dashed p-8 rounded-lg text-center cursor-pointer transition ${
          dragActive ? "border-primary bg-primary/10" : "border-border bg-background hover:bg-accent/50"
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
        className="mt-4 w-full bg-pan-green text-white hover:bg-pan-green/90"
      >
        {uploading ? "Uploading..." : "Post"}
      </Button>

      {/* Gallery */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="media-gallery" direction="horizontal">
          {(provided) => (
            <div className="flex gap-4 mt-6 overflow-x-auto pb-2" {...provided.droppableProps} ref={provided.innerRef}>
              {media.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`relative w-48 h-48 border border-border rounded-lg overflow-hidden flex-shrink-0 transition ${
                        snapshot.isDragging ? "shadow-lg" : ""
                      }`}
                    >
                      {item.type === "image" ? (
                        <img src={item.previewUrl} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <video src={item.previewUrl} controls className="w-full h-full object-cover" />
                      )}

                      {/* Upload Progress */}
                      {item.progress > 0 && item.progress < 100 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                          <span className="text-foreground font-semibold">{Math.round(item.progress)}%</span>
                        </div>
                      )}

                      {/* Remove Button */}
                      {!uploading && (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1 shadow-lg hover:bg-destructive/80 transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
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
