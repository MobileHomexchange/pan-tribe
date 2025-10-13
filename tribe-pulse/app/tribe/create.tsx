import React, { useState } from "react";
import { useRouter } from "expo-router";
import { db } from "../../src/lib/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../src/contexts/AuthContext";

// 🔘 Simple reusable button
function Button({ onClick, children, className }: any) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-3 bg-green-600 text-white hover:bg-green-700 font-semibold ${className}`}
    >
      {children}
    </button>
  );
}

export default function CreateTribe() {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🧩 Save new tribe to Firestore
  const handleCreateTribe = async () => {
    if (!name.trim() || !description.trim()) {
      setMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await addDoc(collection(db, "tribes"), {
        name,
        description,
        privacy,
        createdAt: serverTimestamp(),
        createdBy: currentUser?.email || "Anonymous",
        members: [currentUser?.email || "Anonymous"],
      });

      setMessage("✅ Tribe created successfully!");
      setName("");
      setDescription("");
      setPrivacy("public");

      // Redirect back to My Tribe page
      setTimeout(() => router.push("/tribe/my-tribe"), 1000);
    } catch (error: any) {
      console.error("Error creating tribe:", error);
      setMessage("❌ Error creating tribe. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-900 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-center">
          ✨ Create a New Tribe
        </h1>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tribe Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. The Innovators Tribe"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tribe Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what your tribe is about..."
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Privacy Level
            </label>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <Button onClick={handleCreateTribe} className="w-full">
            {loading ? "Creating..." : "Create Tribe"}
          </Button>

          {message && (
            <p
              className={`text-center text-sm ${
                message.startsWith("✅")
                  ? "text-green-600"
                  : message.startsWith("❌")
                  ? "text-red-600"
                  : "text-gray-700"
              }`}
            >
              {message}
            </p>
          )}

          <Button
            onClick={() => router.push("/tribe/my-tribe")}
            className="bg-gray-400 hover:bg-gray-500 w-full mt-2"
          >
            ← Back to My Tribes
          </Button>
        </div>
      </div>
    </div>
  );
}
