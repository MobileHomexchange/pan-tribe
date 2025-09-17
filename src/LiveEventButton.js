import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./lib/firebase";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

const LiveEventButton = ({ eventId }) => {
  const [roomUrl, setRoomUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const docRef = doc(db, "liveEvents", eventId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRoomUrl(`https://meet.jit.si/${docSnap.data().roomName}`);
        } else {
          console.log("No such live event!");
        }
      } catch (error) {
        console.error("Error fetching room:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [eventId]);

  if (loading || !roomUrl) return null;

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        Start Live Event
      </Button>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div 
            style={{ 
              width: "80%", 
              height: "80%", 
              background: "#fff",
              borderRadius: "8px",
              position: "relative",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div style={{ 
              padding: "16px", 
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h2 style={{ 
                fontSize: "18px", 
                fontWeight: "600",
                margin: 0
              }}>
                Live Event
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "8px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ flex: 1, padding: "16px" }}>
              <iframe
                src={roomUrl}
                allow="camera; microphone; fullscreen; display-capture"
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  border: 0,
                  borderRadius: "4px"
                }}
                title="Live Event"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveEventButton;