// src/pages/Index.tsx - UPDATED WITH BLOG LAYOUT ONLY
import React from "react";
import { Link } from "react-router-dom";
import BlogLayout from "@/components/layout/BlogLayout";

export default function Index() {
  return (
    <BlogLayout>
      {/* Blog Hero Section matching your screenshot */}
      <section className="hero-section bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Building Stronger Communities in the Digital Age
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover how modern tribes are forming around shared interests and values online, 
            creating meaningful connections that transcend geographical boundaries.
          </p>
          <Link
            to="/feed"  // This goes to your actual app
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors duration-200"
          >
            Hear the Story →
          </Link>
        </div>
      </section>

      {/* Horizontal Rule */}
      <div className="border-t border-gray-300 max-w-4xl mx-auto"></div>

      {/* Article Meta - Exactly like your screenshot */}
      <section className="max-w-4xl mx-auto px-4 py-8 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mb-4 sm:mb-0">
            <span className="font-semibold text-gray-900 text-lg">Maya Sharma</span>
            <div className="flex items-center space-x-4 text-gray-600">
              <span>April 10, 2023</span>
              <span>•</span>
              <span>8 min read</span>
            </div>
          </div>
          <div>
            <span className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium border border-gray-300">
              Culture
            </span>
          </div>
        </div>
      </section>

      {/* Additional horizontal rule */}
      <div className="border-t border-gray-300 max-w-4xl mx-auto"></div>
    </BlogLayout>
  );
}
