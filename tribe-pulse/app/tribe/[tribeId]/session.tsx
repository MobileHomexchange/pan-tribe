import React, { useMemo } from "react";
import { Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import TribeSession from "../../../src/components/tribe/TribeSession";

export default function TribeSessionRoute() {
  const router = useRouter();
  const { tribeId, room, subject, name } = useLocalSearchParams<{
    tribeId: string;
    room?: string;
    subject?: string;
    name?: string;
  }>();

  // Generate room name if none provided
  const roomName = useMemo(() => {
    if (typeof room === "string" && room.trim().length > 0) return room;
    return `tribe_${tribeId || "general"}_${Math.random().toString(36).slice(2, 8)}`;
  }, [room, tribeId]);

  const displayName = typeof name === "string" ? name : "Guest";
  const title = typeof subject === "string" ? subject : "Tribe Session";

  // For mobile fallback
  if (Platform.OS !== "web") {
    return (
      <div style={{ padding: 20 }}>
        <h2>Tribe Sessions (Web Preview)</h2>
        <p>
          Jitsi video calls run in the web build. Open this route in your browser (Expo web) to join:
        </p>
        <code style={{ display: "block", marginTop: 8 }}>
          /tribe/{tribeId || "your-tribe"}/session?room={roomName}
        </code>
      </div>
    );
  }

  // Web session view
  return (
    <TribeSession
      roomName={roomName}
      displayName={displayName}
      subject={title}
      onReadyToClose={() => router.back()}
    />
  );
}
