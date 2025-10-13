import React, { useMemo } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

type Props = {
  roomName: string;
  displayName?: string;
  subject?: string;
  onReadyToClose?: () => void;
  domain?: string; // defaults to env
};

export default function TribeSession({
  roomName,
  displayName,
  subject = "Tribe Session",
  onReadyToClose,
  domain
}: Props) {
  const jitsiDomain = domain || import.meta.env.VITE_JITSI_DOMAIN || "meet.jit.si";

  const userInfo = useMemo(
    () => ({
      displayName: displayName || "Guest",
      email: "",
    }),
    [displayName]
  );

  return (
    <div style={{ height: "100vh", width: "100%", background: "#000" }}>
      <JitsiMeeting
        domain={jitsiDomain}
        roomName={roomName}
        configOverwrite={{
          prejoinConfig: { enabled: true },
          disableDeepLinking: true,
        }}
        interfaceConfigOverwrite={{
          HIDE_INVITE_MORE_HEADER: true,
          SHOW_JITSI_WATERMARK: false,
          SHOW_BRAND_WATERMARK: false,
        }}
        userInfo={userInfo}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "100%";
          iframeRef.style.width = "100%";
          iframeRef.setAttribute("allow", "camera; microphone; fullscreen; display-capture");
        }}
        onReadyToClose={onReadyToClose}
      />
    </div>
  );
}
