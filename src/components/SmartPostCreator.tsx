import { useState, FC, FormEvent } from "react";
import { PostType } from "./PostTypeSelector";

interface SmartPostCreatorProps {
  type: PostType;
  onSubmit: (data: Record<string, any>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const SmartPostCreator: FC<SmartPostCreatorProps> = ({ type, onSubmit, onCancel, isSubmitting = false }) => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [link, setLink] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData: Record<string, any> = { content };

    if (media) formData.media = media;
    if (link) formData.link = link;
    formData.type = type;

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow rounded-xl space-y-4">
      {type === "text" && (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full border rounded p-3"
          rows={5}
          disabled={isSubmitting}
        />
      )}

      {type === "image" && (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMedia(e.target.files?.[0] || null)}
            disabled={isSubmitting}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a caption..."
            className="w-full border rounded p-3"
            rows={3}
            disabled={isSubmitting}
          />
        </>
      )}

      {type === "video" && (
        <>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setMedia(e.target.files?.[0] || null)}
            disabled={isSubmitting}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a caption..."
            className="w-full border rounded p-3"
            rows={3}
            disabled={isSubmitting}
          />
        </>
      )}

      {type === "link" && (
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Paste a link..."
          className="w-full border rounded p-3"
          disabled={isSubmitting}
        />
      )}

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Create Post"}
        </button>
      </div>
    </form>
  );
};
