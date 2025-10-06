import React, { useState, useRef, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import imageCompression from "browser-image-compression";
import { storage, db, auth } from "@/lib/firebaseConfig";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface MediaItem {
  url: string;
  type: "image" | "video";
  id: string;
  progress: number;
}

const PostCreator = () => {
  const [files, setFiles] = useState<File[]>([]);
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
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  // Handle drag-and-drop events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  };

  // Upload files to Firebase
  const handleUpload = async () => {
    if (!files.length) return;
    
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

      for (const file of files) {
        let uploadFile = file;
        let type: "image" | "video" = "image";

        // Compress images
        if (file.type.startsWith("image/")) {
          uploadFile = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          });
          type = "image";
        } else if (file.type.startsWith("video/")) {
          type = "video";
        } else {
          console.warn("Unsupported file type", file.type);
          continue;
        }

        const storageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, uploadFile);

        // Initialize media with 0% progress
        const id = `${file.name}-${Date.now()}`;
        setMedia((prev) => [...prev, { url: "", type, id, progress: 0 }]);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setMedia((prev) =>
              prev.map((m) => (m.id === id ? { ...m, progress } : m))
            );
          },
          (error) => {
            console.error("Upload error:", error);
            setMedia((prev) => prev.filter((m) => m.id !== id));
            toast({
              title: "Upload failed",
              description: error.message,
              variant: "destructive",
            });
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Update media with final URL
            setMedia((prev) =>
              prev.map((m) => (m.id === id ? { ...m, url: downloadURL, progress: 100 } : m))
            );

            // Save post info to Firestore
            await addDoc(collection(db, "posts"), {
              userId: user.uid,
              author: user.email || 'Anonymous',
              mediaUrl: downloadURL,
              mediaType: type,
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

      setFiles([]);
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
        disabled={uploading || files.length === 0}
        className="mt-4 w-full"
      >
        {uploading ? "Uploading..." : `Post ${files.length > 0 ? `(${files.length} file${files.length > 1 ? 's' : ''})` : ''}`}
      </Button>

      {/* Media gallery */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {media.map((item) => (
          <div key={item.id} className="relative border border-border rounded-lg p-2 bg-card">
            {item.type === "image" ? (
              <img
                src={item.url || ""}
                alt="post"
                className="w-full h-48 object-cover rounded"
              />
            ) : (
              <video
                src={item.url || ""}
                controls
                className="w-full h-48 object-cover rounded"
              />
            )}

            {/* Progress overlay */}
            {item.progress < 100 && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                <span className="text-foreground font-semibold">{Math.round(item.progress)}%</span>
              </div>
            )}

            {/* Download button */}
            {item.url && (
              <a
                href={item.url}
                download
                className="absolute top-2 right-2 bg-background text-foreground px-2 py-1 text-xs rounded shadow-lg hover:bg-accent"
              >
                Download
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostCreator;
