import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// TipTap imports
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import ImageExtension from "@tiptap/extension-image";

// --- Preview Modal ---
function PreviewModal({
  open,
  onClose,
  content,
}: {
  open: boolean;
  onClose: () => void;
  content: string;
}) {
  if (!open) return null;

  const safeContent = content.replace(/<script.*?>.*?<\/script>/gi, "");

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white max-w-2xl w-full rounded-lg shadow-xl p-6 relative overflow-y-auto max-h-[80vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Post Preview</h2>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: safeContent }}
        />
      </div>
    </div>
  );
}

// --- Main Component ---
export default function CreatePost() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/feed";

  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // --- TipTap Editor Setup ---
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Color.configure({ types: ["textStyle"] }),
      TextStyle,
      ImageExtension,
    ],
    content: "",
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
  });

  // --- Media Upload ---
  const handleAddImage = async (file: File) => {
    if (!file) return;

    // Insert temporary preview
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
    editor?.chain().focus().setImage({ src: base64 }).run();

    // Compress before uploading
    const compressed = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
    });

    const fileRef = ref(
      storage,
      `posts/${currentUser?.uid}/${Date.now()}_${compressed.name}`
    );
    const uploadTask = uploadBytesResumable(fileRef, compressed);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
