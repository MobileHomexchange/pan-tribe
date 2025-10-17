import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/feed";

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
      navigate(returnTo);
    } catch (error: any) {
      console.error("❌ Error creating post:", error);
      toast.error("Failed to create post. Try again.");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-8">
      {/* Header */}
      <div className="bg-[#1877f2] text-white px-6 py-4 text-lg font-bold">Create a Post</div>

      {/* Title Input */}
      <div className="px-6 py-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Write a captivating title..."
          className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 px-6 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex gap-1 border-r border-gray-300 pr-3">
          <button className="p-2 hover:bg-gray-200 rounded font-bold">B</button>
          <button className="p-2 hover:bg-gray-200 rounded italic">I</button>
          <button className="p-2 hover:bg-gray-200 rounded underline">U</button>
        </div>
        <div className="flex gap-1 border-r border-gray-300 pr-3">
          <button className="p-2 hover:bg-gray-200 rounded">Font</button>
          <button className="p-2 hover:bg-gray-200 rounded">A</button>
          <button className="p-2 hover:bg-gray-200 rounded">▢</button>
        </div>
        <div className="flex gap-1 border-r border-gray-300 pr-3">
          <button className="p-2 hover:bg-gray-200 rounded">H</button>
          <button className="p-2 hover:bg-gray-200 rounded">•</button>
          <button className="p-2 hover:bg-gray-200 rounded">1.</button>
        </div>
        <div className="flex gap-1">
          <label className="cursor-pointer p-2 hover:bg-gray-200 rounded">
            🖼️
            <input type="file" accept="image/*,video/*" hidden onChange={handleFileChange} />
          </label>
          <button className="p-2 hover:bg-gray-200 rounded">🎥</button>
          <button className="p-2 hover:bg-gray-200 rounded">📎</button>
        </div>
        <button className="ml-auto bg-[#1877f2] text-white px-3 py-1 rounded-md font-semibold">+ Add Block</button>
      </div>

      {/* Editor */}
      <div className="p-6 space-y-5 min-h-[400px]">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your post here..."
          className="w-full border border-gray-300 rounded-lg p-3 text-lg resize-none"
          rows={6}
          style={{ color: fontColor, backgroundColor: bgColor }}
        />

        {/* Color Pickers */}
        <div className="flex items-center justify-between mt-3">
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
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
        >
          {isSubmitting ? "Posting..." : "Publish"}
        </Button>
        <button className="px-4 py-2 rounded-md border font-semibold">Preview</button>
      </div>
    </div>
  );
}
