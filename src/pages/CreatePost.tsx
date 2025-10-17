import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Simple preview modal component
function PreviewModal({ open, onClose, content }: { open: boolean; onClose: () => void; content: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white max-w-2xl w-full rounded-lg shadow-xl p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl">
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Post Preview</h2>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}

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
  const [showPreview, setShowPreview] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  // ---------- Rich text functions ----------
  const execCmd = (cmd: string, value: string | null = null) => {
    document.execCommand(cmd, false, value);
    setContent(document.getElementById("editorArea")?.innerHTML || "");
  };

  const handleUndo = () => execCmd("undo");
  const handleRedo = () => execCmd("redo");
  const handleBold = () => execCmd("bold");
  const handleItalic = () => execCmd("italic");
  const handleUnderline = () => execCmd("underline");
  const handleHeading = () => execCmd("formatBlock", "h2");
  const handleBulletList = () => execCmd("insertUnorderedList");
  const handleNumberList = () => execCmd("insertOrderedList");
  const handleFontColor = (color: string) => execCmd("foreColor", color);
  const handleBgColor = (color: string) => execCmd("hiliteColor", color);

  const handleAddImage = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => execCmd("insertImage", e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAddVideo = (file: File) => {
    const videoURL = URL.createObjectURL(file);
    const videoTag = `<video controls style="max-width:100%;border-radius:6px;margin-top:8px;"><source src="${videoURL}" type="${file.type}"></video>`;
    document.getElementById("editorArea")!.insertAdjacentHTML("beforeend", videoTag);
    setContent(document.getElementById("editorArea")?.innerHTML || "");
  };

  const handleAddDivider = () => {
    const hr = "<hr style='border:1px solid #ddd;margin:1rem 0;' />";
    document.getElementById("editorArea")!.insertAdjacentHTML("beforeend", hr);
    setContent(document.getElementById("editorArea")?.innerHTML || "");
  };

  const handleInsertLink = () => {
    const url = prompt("Enter URL:");
    if (url) execCmd("createLink", url);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    setContent(document.getElementById("editorArea")?.innerHTML || "");
  };

  // ---------- Firestore submit ----------
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
        const uploadFile = isImage
          ? await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920 })
          : file;

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
    <>
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-8">
        {/* Header */}
        <div className="bg-[#1877f2] text-white px-6 py-4 text-lg font-bold">
          Create a Post
        </div>

        {/* Title */}
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
            <button onClick={handleUndo} className="p-2 hover:bg-gray-200 rounded">↺</button>
            <button onClick={handleRedo} className="p-2 hover:bg-gray-200 rounded">↻</button>
          </div>
          <div className="flex gap-1 border-r border-gray-300 pr-3">
            <button onClick={handleBold} className="p-2 hover:bg-gray-200 rounded font-bold">B</button>
            <button onClick={handleItalic} className="p-2 hover:bg-gray-200 rounded italic">I</button>
            <button onClick={handleUnderline} className="p-2 hover:bg-gray-200 rounded underline">U</button>
          </div>
          <div className="flex gap-1 border-r border-gray-300 pr-3">
            <button onClick={handleHeading} className="p-2 hover:bg-gray-200 rounded">H</button>
            <button onClick={handleBulletList} className="p-2 hover:bg-gray-200 rounded">•</button>
            <button onClick={handleNumberList} className="p-2 hover:bg-gray-200 rounded">1.</button>
          </div>
          <div className="flex gap-1 border-r border-gray-300 pr-3">
            <label className="cursor-pointer p-2 hover:bg-gray-200 rounded">
              🖼️
              <input type="file" accept="image/*" hidden onChange={(e) => e.target.files && handleAddImage(e.target.files[0])} />
            </label>
            <label className="cursor-pointer p-2 hover:bg-gray-200 rounded">
              🎥
              <input type="file" accept="video/*" hidden onChange={(e) => e.target.files && handleAddVideo(e.target.files[0])} />
            </label>
            <button onClick={handleInsertLink} className="p-2 hover:bg-gray-200 rounded">🔗</button>
            <button onClick={handleAddDivider} className="p-2 hover:bg-gray-200 rounded">➖</button>
          </div>
          <butto
