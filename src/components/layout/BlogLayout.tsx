// src/components/layout/BlogLayout.tsx
import React from "react";
import { Link } from "react-router-dom";

interface BlogLayoutProps {
  children: React.ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header matching your screenshot */}
      <header className="border-b border-gray-200 py-6 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Tribe Pulse</h1>
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search Tribe Pulse"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Blog content */}
      {children}
    </div>
  );
}
