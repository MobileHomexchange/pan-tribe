import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function CreatePost() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fontColor, setFontColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      toast.error("Please log in to create a post");
      navigate("/login");
      return;
    }

    if (!content && !media) {
      toast.error("Please add text, image, or video");
      return;
    }

    setIsSubmitting(true);
    let mediaUrl = null;

    try {
      if (media) {
        const file = media;
        const isImage = file.type.startsWith("image/");
        const uploadFile = isImage ? await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920 }) : file;

        const fileRef = ref(storage, `posts/${currentUser.uid}/${Date.now()}_${uploadFile.name}`);
        const uploadTask = uploadBytesResumable(fileRef, uploadFile);

        mediaUrl = await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => reject(error),
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            },
          );
        });
      }

      const postData = {
        userId: currentUser.uid,
        userName: currentUser.displayName || "Anonymous",
        userAvatar: currentUser.photoURL || "",
        content,
        fontColor,
        bgColor,
        mediaUrl,
        timestamp: serverTimestamp(),
        likes: [],
        comments: [],
      };

      await addDoc(collection(db, "posts"), postData);

      toast.success("✅ Post created successfully!");
      navigate("/feed");
    } catch (error: any) {
      console.error("❌ Error creating post:", error);
      toast.error("Failed to create post. Try again.");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg mt-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Create a Post</h2>

      {/* Text Input */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full border rounded-lg p-3 text-lg resize-none"
        rows={4}
        style={{ color: fontColor, backgroundColor: bgColor }}
      />

      {/* Color Pickers */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div>
            <label className="text-sm text-gray-600 block">Font Color</label>
            <input
              type="color"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
              className="w-10 h-10 border rounded-full cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 block">Background</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-10 h-10 border rounded-full cursor-pointer"
            />
          </div>
        </div>

        <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
          📸 Add Media
          <input type="file" accept="image/*,video/*" hidden onChange={handleFileChange} />
        </label>
      </div>

      {/* Media Preview */}
      {mediaPreview && (
        <div className="mt-3">
          {media?.type.startsWith("video/") ? (
            <video src={mediaPreview} controls className="w-full rounded-lg max-h-80" />
          ) : (
            <img src={mediaPreview} alt="Preview" className="w-full rounded-lg max-h-80 object-cover" />
          )}
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress !== null && (
        <div className="w-full bg-gray-200 h-2 rounded mt-2">
          <div
            className="bg-green-600 h-2 rounded transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end mt-4">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
        >
          {isSubmitting ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
}
