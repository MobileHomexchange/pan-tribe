import { FC } from "react";

export type PostType = "text" | "image" | "video" | "link";

interface PostTypeSelectorProps {
  onSelect: (type: PostType) => void;
}

export const PostTypeSelector: FC<PostTypeSelectorProps> = ({ onSelect }) => {
  const types: { type: PostType; label: string }[] = [
    { type: "text", label: "📝 Text Post" },
    { type: "image", label: "📸 Image Post" },
    { type: "video", label: "🎥 Video Post" },
    { type: "link", label: "🔗 Link Post" },
  ];

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold mb-4">Choose Post Type</h2>
      <div className="grid grid-cols-2 gap-4">
        {types.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
