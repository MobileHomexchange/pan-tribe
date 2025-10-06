import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Camera, ImageIcon, X } from "lucide-react";

export type PostType = "announcement" | "event" | "offer" | "general";

interface SmartPostCreatorProps {
  type: PostType;
  onSubmit: (formData: Record<string, any>) => void;
  onCancel: () => void;
}

export const SmartPostCreator: React.FC<SmartPostCreatorProps> = ({
  type,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const startCamera = async () => {
    try {
      setRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Unable to access your camera. Please allow permission.");
      setRecording(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 640, 480);
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
            setImage(file);
            setPreview(URL.createObjectURL(blob));
          }
        }, "image/jpeg");
      }
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setRecording(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      image,
      postType: type,
    });
  };

  return (
    <Card className="p-6 space-y-4">
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold capitalize mb-4">{type} Post</h2>

        <Input
          placeholder="Enter a title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-3"
          required
        />

        <Textarea
          placeholder="Write something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mb-3 min-h-[100px]"
          required
        />

        {/* --- Image Upload + Camera Section --- */}
        <div className="flex flex-wrap gap-2 items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("fileInput")?.click()}
            className="flex items-center gap-2"
          >
            <ImageIcon className="w-4 h-4" /> Upload Image
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={startCamera}
            className="flex items-center gap-2"
          >
            <Camera className="w-4 h-4" /> Use Camera
          </Button>

          <input
            id="fileInput"
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </div>

        {/* --- Camera View --- */}
        {recording && (
          <div className="mt-4 space-y-2">
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
            <div className="flex gap-2">
              <Button type="button" onClick={capturePhoto} className="flex-1">
                Capture
              </Button>
              <Button type="button" onClick={stopCamera} variant="destructive" className="flex-1">
                Cancel
              </Button>
            </div>
            <canvas ref={canvasRef} width="640" height="480" hidden />
          </div>
        )}

        {/* --- Image Preview --- */}
        {preview && (
          <div className="relative mt-4">
            <img
              src={preview}
              alt="preview"
              className="w-full rounded-lg object-cover shadow-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 rounded-full"
              onClick={() => {
                setImage(null);
                setPreview(null);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Post</Button>
        </div>
      </form>
    </Card>
  );
};
