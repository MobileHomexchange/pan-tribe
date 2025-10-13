import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "../../../src/lib/firebaseConfig";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "../../../src/contexts/AuthContext";
import ProtectedRoute from "../../../src/components/auth/ProtectedRoute";

// 🔘 Simple reusable button
function Button({ onClick, children, className }: any) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 font-semibold ${className}`}
    >
      {children}
    </button>
  );
}

// ✅ Protected Tribe Page
export default function TribePage() {
  return (
    <ProtectedRoute>
      <TribePageContent />
    </ProtectedRoute>
  );
}

// 🧱 Tribe Page Content (actual page logic)
function TribePageContent() {
  const router = useRouter();
  const { tribeId } = useLocalSearchParams<{ tribeId: string }>();
  const { currentUser } = useAuth();

  const [tribe, setTribe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);

  const username =
    currentUser?.displayName || currentUser?.email || "Guest";

  // 🔥 Real-time tribe listener
  useEffect(() => {
    if (!tribeId) return;

    const tribeRef = doc(db, "tribes", tribeId);
    const unsub = onSnapshot(tribeRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setTribe({ id: snapshot.id, ...data });
        setIsMember(data.members?.includes(username));
      } else {
        setTribe(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [tribeId, username]);

  // ✅ Join Tribe
  const handleJoin = async () => {
    if (!tribeId) return;
    try {
      const tribeRef = doc(db, "tribes", tribeId);
      await updateDoc(tribeRef, {
        members: arrayUnion(username),
      });
      setIsMember(true);
    } catch (err) {
      console.error("Error joining tribe:", err);
    }
  };

  // ❌ Leave Tribe
  const handleLeave = async () => {
    if (!tribeId) return;
    try {
      const tribeRef = doc(db, "tribes", tribeId);
      await updateDoc(tribeRef, {
        members: arrayRemove(username),
      });
      setIsMember(false);
    } catch (err) {
      console.error("Error leaving tribe:", err);
    }
  };

  // 🧭 Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading tribe details...
      </div>
    );
  }

  // ❓ Tribe not found
  if (!tribe) {
    return (
      <div className="flex flex-col items-center min-h-screen justify-center text-center p-6">
        <h2 className="text-2xl font-bold mb-3">Tribe not found 😕</h2>
        <Button onClick={() => router.push("/tribe/my-tribe")}>
          ← Back to My Tribes
        </Button>
      </div>
    );
  }

  // ✅ Tribe Page UI
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center p-6">
      {/* Tribe Info */}
      <div className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-lg border border-gray-200 mb-8">
        <h1 className="text-3xl font-bold mb-2 text-center">{tribe.name}</h1>
        <p className="text-gray-600 mb-4 text-center">
          {tribe.description || "No description available."}
        </p>
        <p className="text-sm text-gray-500 text-center mb-6">
          Privacy: {tribe.privacy || "public"}
        </p>

        {/* 🔘 Join/Leave Button */}
        <div className="text-center mb-6">
          {isMember ? (
            <Button
              onClick={handleLeave}
              className="bg-red-600 hover:bg-red-700"
            >
              Leave Tribe
            </Button>
          ) : (
            <Button
              onClick={handleJoin}
              className="bg-green-600 hover:bg-green-700"
            >
              Join Tribe
            </Button>
          )}
        </div>

        {/* Tribe Actions */}
        <div className="flex flex-col gap-4">
          <Button
            onClick={() =>
              router.push(`/tribe/${tribeId}/session?name=${username}`)
            }
          >
            🎥 Start Session
          </Button>
          <Button onClick={() => router.push(`/tribe/${tribeId}/conference`)}>
            🎤 Start Conference
          </Button>
          <Button onClick={() => router.push(`/tribe/${tribeId}/chat`)}>
            💬 Open Chat
          </Button>
        </div>

        <div className="text-center mt-6">
          <Button onClick={() => router.push("/tribe/my-tribe")}>
            ← Back to My Tribe
          </Button>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white w-full max-w-3xl p-4 rounded-xl shadow border border-gray-200">
        <h3 className="text-lg font-semibold mb-3">Members</h3>
        {tribe.members && tribe.members.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700">
            {tribe.members.map((m: string, i: number) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No members yet.</p>
        )}
      </div>
    </div>
  );
}
