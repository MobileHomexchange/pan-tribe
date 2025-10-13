import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { db } from "../../src/lib/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../../src/contexts/AuthContext";

function Button({ onClick, children, className }: any) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-semibold ${className}`}
    >
      {children}
    </button>
  );
}

export default function MyTribe() {
  const router = useRouter();
  const { logout, currentUser } = useAuth();
  const [tribes, setTribes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTribe, setEditingTribe] = useState<any | null>(null);
  const [editData, setEditData] = useState({
    name: "",
    description: "",
    privacy: "public",
  });

  useEffect(() => {
    const unsubscribeTribes: (() => void)[] = [];

    const fetchTribesWithLiveUpdates = async () => {
      try {
        const tribeQuery = query(
          collection(db, "tribes"),
          orderBy("createdAt", "desc")
        );

        const tribeSnapshot = await getDocs(tribeQuery);
        const tribeData = tribeSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTribes(tribeData);

        tribeData.forEach((tribe) => {
          const unsub = onSnapshot(doc(db, "tribes", tribe.id), (snapshot) => {
            if (snapshot.exists()) {
              setTribes((prevTribes) =>
                prevTribes.map((t) =>
                  t.id === tribe.id ? { id: snapshot.id, ...snapshot.data() } : t
                )
              );
            }
          });
          unsubscribeTribes.push(unsub);
        });
      } catch (error) {
        console.error("Error fetching tribes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTribesWithLiveUpdates();
    return () => unsubscribeTribes.forEach((unsub) => unsub());
  }, []);

  const handleCreateTribe = () => router.push("/tribe/create");
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ✏️ Start editing a tribe
  const startEditing = (tribe: any) => {
    setEditingTribe(tribe);
    setEditData({
      name: tribe.name,
      description: tribe.description,
      privacy: tribe.privacy || "public",
    });
  };

  // 💾 Save edits
  const saveEdit = async () => {
    if (!editingTribe) return;
    try {
      const tribeRef = doc(db, "tribes", editingTribe.id);
      await updateDoc(tribeRef, {
        name: editData.name,
        description: editData.description,
        privacy: editData.privacy,
      });
      setEditingTribe(null);
      alert("✅ Tribe updated successfully!");
    } catch (error) {
      console.error("Error updating tribe:", error);
    }
  };

  // 🗑️ Delete tribe
  const deleteTribe = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this tribe?")) return;
    try {
      await deleteDoc(doc(db, "tribes", id));
      setTribes((prev) => prev.filter((t) => t.id !== id));
      alert("🗑️ Tribe deleted.");
    } catch (error) {
      console.error("Error deleting tribe:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center p-6">
      {/* Header / Control Center */}
      <div className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-lg border border-gray-200 mb-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          My Tribe Control Center 🌍
        </h1>

        <div className="flex flex-col gap-3">
          <Button onClick={handleCreateTribe} className="bg-green-600 hover:bg-green-700">
            ➕ Create a Tribe
          </Button>

          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            🚪 Logout
          </Button>
        </div>
      </div>

      {/* Tribe List */}
      <div className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4">🏕️ My Created Tribes</h2>

        {loading ? (
          <p className="text-gray-500">Loading tribes...</p>
        ) : tribes.length === 0 ? (
          <p className="text-gray-500">
            You haven’t created any tribes yet. Try creating one above!
          </p>
        ) : (
          <ul className="space-y-3">
            {tribes.map((tribe) => (
              <li
                key={tribe.id}
                className="p-4 border rounded-lg bg-gray-50 hover:bg-blue-50 transition"
              >
                {editingTribe && editingTribe.id === tribe.id ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="border p-2 rounded"
                      placeholder="Tribe name"
                    />
                    <textarea
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({ ...editData, description: e.target.value })
                      }
                      className="border p-2 rounded"
                      placeholder="Description"
                    />
                    <select
                      value={editData.privacy}
                      onChange={(e) =>
                        setEditData({ ...editData, privacy: e.target.value })
                      }
                      className="border p-2 rounded"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                    <div className="flex gap-2">
                      <Button
                        onClick={saveEdit}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        💾 Save
                      </Button>
                      <Button
                        onClick={() => setEditingTribe(null)}
                        className="bg-gray-500 hover:bg-gray-600"
                      >
                        ❌ Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="font-bold text-lg">{tribe.name}</div>
                    <div className="text-gray-600 text-sm mb-2">
                      {tribe.description || "No description available."}
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      Privacy: {tribe.privacy || "public"}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => startEditing(tribe)}
                        className="bg-yellow-500 hover:bg-yellow-600"
                      >
                        ✏️ Edit
                      </Button>
                      <Button
                        onClick={() => deleteTribe(tribe.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        🗑️ Delete
                      </Button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

