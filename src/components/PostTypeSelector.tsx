import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { PostType } from "./SmartPostCreator";

interface PostTypeSelectorProps {
  onSelect: (type: PostType) => void;
}

const postTypes: Array<{
  type: PostType;
  icon: string;
  label: string;
  description: string;
  color: string;
}> = [
  {
    type: "general",
    icon: "📝",
    label: "General Post",
    description: "Share your thoughts",
    color: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30",
  },
  {
    type: "announcement",
    icon: "📢",
    label: "Announcement",
    description: "Important community updates",
    color: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30",
  },
  {
    type: "question",
    icon: "❓",
    label: "Question",
    description: "Ask the community",
    color: "bg-green-500/10 hover:bg-green-500/20 border-green-500/30",
  },
  {
    type: "idea",
    icon: "💡",
    label: "Idea",
    description: "Share your innovation",
    color: "bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/30",
  },
  {
    type: "praise",
    icon: "⭐",
    label: "Praise",
    description: "Recognize someone great",
    color: "bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/30",
  },
];

export const PostTypeSelector: React.FC<PostTypeSelectorProps> = ({
  onSelect,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-card-foreground mb-2">
          Create a Post
        </h2>
        <p className="text-muted-foreground">
          Choose the type of content you'd like to share
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {postTypes.map((postType, index) => (
          <motion.div
            key={postType.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={`p-4 cursor-pointer transition-all border-2 ${postType.color}`}
              onClick={() => onSelect(postType.type)}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{postType.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground mb-1">
                    {postType.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {postType.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
