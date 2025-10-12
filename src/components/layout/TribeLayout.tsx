import React from "react";

export default function TribeLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content - Centered */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {children}
        </div>
      </main>

      {/* Right Sidebar - Tribe Pulse */}
      <aside className="w-64 border-l bg-white p-4">
        <h2 className="text-xl font-bold mb-6 text-green-700">Tribe Pulse</h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Your tribe activity and updates will appear here.</p>
        </div>
      </aside>
    </div>
  );
}
