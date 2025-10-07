import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export type PostType = "announcement" | "question" | "idea" | "praise" | "general";

interface PostTemplate {
  fields: string[];
  layout: string;
  label: string;
  icon?: string;
}

// Post type templates
const postTemplates: Record<PostType, PostTemplate> = {
  general: {
    fields: ["content"],
    layout: "basic",
    label: "General Post",
    icon: "📝",
  },
  announcement: {
    fields: ["title", "image", "summary", "priority"],
    layout: "featured",
    label: "Community Announcement",
    icon: "📢",
  },
  question: {
    fields: ["question", "details", "category"],
    layout: "qna",
    label: "Ask the Community",
    icon: "❓",
  },
  idea: {
    fields: ["title", "problem", "solution", "benefits"],
    layout: "structured",
    label: "Share Your Idea",
    icon: "💡",
  },
  praise: {
    fields: ["recipient", "message", "category"],
    layout: "highlight",
    label: "Give Praise",
    icon: "⭐",
  },
};

// Field label map for display names
const fieldLabels: Record<string, string> = {
  content: "What's on your mind?",
  title: "Title",
  image: "Upload Image",
  summary: "Short Summary",
  priority: "Priority Level",
  question: "Your Question",
  details: "Additional Details",
  category: "Category",
  problem: "What's the Problem?",
  solution: "Your Solution",
  benefits: "Key Benefits",
  recipient: "Who Are You Praising?",
  message: "Your Message",
};

interface SmartPostCreatorProps {
  type: PostType;
  onSubmit: (formData: Record<string, any>) => void;
  onCancel?: () => void;
}

// Dynamic field renderer
const renderField = (field: string, value: any, setValue: (value: any) => void) => {
  switch (field) {
    case "media":
      return (
        <div className="space-y-3">
          <Input
            id="media"
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setValue(e.target.files?.[0] || null)}
            className="cursor-pointer"
          />

          {value && (
            <div className="mt-2 rounded-lg overflow-hidden border border-border p-2">
              {value.type.startsWith("image/") ? (
                <img src={URL.createObjectURL(value)} alt="Preview" className="max-h-60 w-auto rounded-md mx-auto" />
              ) : (
                <video controls className="max-h-60 w-auto rounded-md mx-auto" src={URL.createObjectURL(value)} />
              )}
            </div>
          )}
        </div>
      );

    case "summary":
    case "details":
    case "message":
    case "problem":
    case "solution":
    case "benefits":
    case "question":
    case "content":
      return (
        <Textarea
          placeholder={`Enter ${fieldLabels[field]}...`}
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
          className="min-h-[100px] resize-none"
        />
      );
    case "priority":
      return (
        <Select value={value || ""} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue placeholder="Select Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="normal">Normal Priority</SelectItem>
            <SelectItem value="low">Low Priority</SelectItem>
          </SelectContent>
        </Select>
      );
    case "category":
      return (
        <Select value={value || ""} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="tech">Technology</SelectItem>
            <SelectItem value="art">Art & Design</SelectItem>
            <SelectItem value="music">Music</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      );
    default:
      return (
        <Input
          type="text"
          placeholder={`Enter ${fieldLabels[field]}...`}
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
        />
      );
  }
};

// Main component
export const SmartPostCreator: React.FC<SmartPostCreatorProps> = ({ type, onSubmit, onCancel }) => {
  const template = postTemplates[type];
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!template) {
      console.error("Invalid post type:", type);
      return;
    }

    // Validate required fields
    const hasRequiredData = template.fields.some((field) => {
      const value = formData[field];
      return value && (typeof value === "string" ? value.trim() : true);
    });

    if (!hasRequiredData) {
      return;
    }

    onSubmit({ ...formData, postType: type });
  };

  if (!template) {
    return <p className="text-destructive">⚠️ Unknown post type: {type}</p>;
  }

  return (
    <motion.div
      className="w-full space-y-4"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with badge */}
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <span className="text-2xl">{template.icon}</span>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-card-foreground">{template.label}</h3>
        </div>
        <Badge variant="secondary" className="capitalize">
          {template.layout}
        </Badge>
      </div>

      {/* Dynamic form fields */}
      {template.fields.map((field) => (
        <div key={field} className="space-y-2">
          <Label htmlFor={field} className="text-sm font-medium">
            {fieldLabels[field]}
          </Label>
          {renderField(field, formData[field], (value) => handleChange(field, value))}
        </div>
      ))}

      {/* Action buttons */}
      <div className="flex gap-2 pt-4">
        <Button onClick={handleSubmit} className="flex-1">
          Post
        </Button>
        {onCancel && (
          <Button onClick={onCancel} variant="outline" className="flex-1">
            Cancel
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default SmartPostCreator;
