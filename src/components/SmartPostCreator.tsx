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
    fields: ["content", "media"],
    layout: "basic",
    label: "General Post",
    icon: "📝",
  },
  announcement: {
    fields: ["title", "summary", "priority", "media"],
    layout: "featured",
    label: "Community Announcement",
    icon: "📢",
  },
  question: {
    fields: ["question", "details", "category", "media"],
    layout: "qna",
    label: "Ask the Community",
    icon: "❓",
  },
  idea: {
    fields: ["title", "problem", "solution", "benefits", "media"],
    layout: "structured",
    label: "Share Your Idea",
    icon: "💡",
  },
  praise: {
    fields: ["recipient", "message", "category", "media"],
    layout: "highlight",
    label: "Give Praise",
    icon: "⭐",
  },
};

// Field label map
const fieldLabels: Record<string, string> = {
  content: "What's on your mind?",
  title: "Title",
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
  media: "Upload Photo or Video",
};

interface SmartPostCreatorProps {
  type: PostType;
  onSubmit: (formData: Record<string, any>) => void;
  onCancel?: () => void;
}

// Dynamic field renderer
const renderField = (
  field: string,
  value: any,
  setValue: (
