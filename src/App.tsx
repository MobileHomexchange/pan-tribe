// src/pages/Index.tsx
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
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

      {/* Hero Section */}
      // Alternative with tighter spacing
<section className="py-8 border-b border-gray-200"> {/* Reduced padding */}
  <div className="max-w-3xl mx-auto px-4"> {/* Narrower container */}
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-snug"> {/* Smaller text, tighter leading */}
        Building Stronger Communities in the Digital Age
      </h2>
      <p className="text-lg text-gray-600 mb-6 leading-relaxed"> {/* Smaller paragraph */}
        Discover how modern tribes are forming around shared interests and values online, 
        creating meaningful connections that transcend geographical boundaries.
      </p>
      <Link
        to="/login"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
      >
        Hear the Story →
      </Link>
    </div>
  </div>
</section>

      {/* Article Meta */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-500 text-sm">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <span className="font-medium text-gray-900">Maya Sharma</span>
              <span>April 10, 2023</span>
              <span>8 min read</span>
            </div>
            <div>
              <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                Culture
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
