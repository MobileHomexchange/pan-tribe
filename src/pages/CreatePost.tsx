import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import ImageExtension from "@tiptap/extension-image";

// --- Helper: sanitize incoming HTML for Preview ---
function sanitizeHTML(html: string) {
  return html.replace(/<script.*?>.*?<\/script>/gi, "").replace(/on\w+="[^"]*"/g, "");
}

// --- Preview Modal ---
function PreviewModal({ open, onClose, content }: { open: boolean; onClose: () => void; content: string }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white max-w-2xl w-full rounded-lg shadow-xl p-6 relative overflow-y-auto max-h-[80vh]">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl">
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Post Preview</h2>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }} />
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
    if (!file || !currentUser) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Src = e.target?.result as string;

      // Insert temporary image while upload happens
      editor?.chain().focus().setImage({ src: base64Src }).run();

      try {
        // Compress before uploading
        const compressed = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
        });

        const fileRef = ref(storage, `posts/${currentUser.uid}/${Date.now()}_${compressed.name}`);
        const uploadTask = uploadBytesResumable(fileRef, compressed);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error("Image upload failed:", error);
            toast.error("Image upload failed.");
            setUploadProgress(null);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            editor?.chain().focus().setImage({ src: downloadURL }).run();
            toast.success("Image uploaded successfully!");
            setUploadProgress(null);
          },
        );
      } catch (err) {
        console.error(err);
        toast.error("Image compression failed.");
      }
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleAddImage(file);
  };

  // --- Firestore Submit ---
  const handleSubmit = async () => {
    if (!currentUser) {
      toast.error("Please log in to create a post");
      navigate("/login");
      return;
    }
    if (!content.trim()) {
      toast.error("Please add some content first");
      return;
    }

    setIsSubmitting(true);

    try {
      const postData = {
        userId: currentUser.uid,
        userName: currentUser.displayName || "Anonymous",
        userAvatar: currentUser.photoURL || "",
        content,
        timestamp: serverTimestamp(),
        likes: [],
        comments: [],
      };

      await addDoc(collection(db, "posts"), postData);
      toast.success("✅ Post created successfully!");
      navigate(returnTo);
    } catch (error: any) {
      console.error("❌ Error creating post:", error);
      if (error.code === "storage/unauthorized") {
        toast.error("You don't have permission to upload.");
      } else {
        toast.error("Failed to create post. Try again.");
      }
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };

  // --- Render ---
  if (!editor) return <div className="p-6 text-center">Loading editor...</div>;

  return (
    <>
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-8">
        {/* Header */}
        <div className="bg-[#1877f2] text-white px-6 py-4 text-lg font-bold">Create a Post</div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 px-6 py-3 border-b border-gray-200 bg-gray-50 items-center">
          <button onClick={() => editor.chain().focus().undo().run()} className="p-2">
            ↺
          </button>
          <button onClick={() => editor.chain().focus().redo().run()} className="p-2">
            ↻
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 font-bold ${editor.isActive("bold") ? "bg-blue-100" : ""}`}
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 italic ${editor.isActive("italic") ? "bg-blue-100" : ""}`}
          >
            I
          </button>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="p-2">
            •
          </button>
          <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="p-2">
            1.
          </button>
          <button
            onClick={() => {
              const url = prompt("Enter link URL");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
            className="p-2"
          >
            🔗
          </button>
          <label className="cursor-pointer p-2">
            🖼️
            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
          </label>
        </div>

        {/* Editor */}
        <div className="p-6 space-y-5 min-h-[400px]">
          <div className="border border-gray-300 rounded-lg p-3 min-h-[200px]">
            <EditorContent editor={editor} />
          </div>

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
          <button onClick={() => setShowPreview(true)} className="px-4 py-2 rounded-md border font-semibold">
            Preview
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} content={content} />
    </>
  );
}
