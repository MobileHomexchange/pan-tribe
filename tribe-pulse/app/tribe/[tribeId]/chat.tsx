import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { db } from "../../../src/lib/firebaseConfig";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

// Simple Chat Bubble component
function ChatBubble({ text, user, timestamp }: any) {
  const time = timestamp?.toDate
    ? timestamp.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";
  return (
    <div className="mb-2">
      <div className="bg-blue-100 rounded-lg p-3 inline-block">
        <div className="text-sm font-semibold">{user || "Guest"}</div>
        <div>{text}</div>
        <div className="text-xs text-gray-500 text-right">{time}</div>
      </div>
    </div>
  );
}

export default function TribeChat() {
  const { tribeId } = useLocalSearchParams<{ tribeId: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [username] = useState("Kevin"); // later we’ll use auth

  // Load messages live
  useEffect(() => {
    if (!tribeId) return;
    const q = query(
      collection(db, "tribes", tribeId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(chats);
    });

    return () => unsubscribe();
  }, [tribeId]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      await addDoc(collection(db, "tribes", tribeId, "messages"), {
        text: input,
        user: username,
        createdAt: serverTimestamp(),
      });
      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center p-6">
      <div className="bg-white w-full max-w-2xl p-4 rounded-2xl shadow-lg border border-gray-200 flex flex-col">
        <h1 className="text-2xl font-bold text-center mb-4">💬 Tribe Chat</h1>

        <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-gray-50 mb-4 h-[60vh]">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">No messages yet.</p>
          ) : (
            messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                text={msg.text}
                user={msg.user}
                timestamp={msg.createdAt}
              />
            ))
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-lg p-2"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
