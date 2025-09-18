import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface LiveEventButtonProps {
  eventId: string;
}

const LiveEventButton: React.FC<LiveEventButtonProps> = ({ eventId }) => {
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
          // Generate fallback room name using eventId
          setRoomUrl(`https://meet.jit.si/${eventId}-${Date.now()}`);
          console.log("No Firebase document found, using fallback room");
        }
      } catch (error) {
        console.error("Error fetching room:", error);
        // Generate fallback room name on error
        setRoomUrl(`https://meet.jit.si/${eventId}-${Date.now()}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [eventId]);

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        variant="destructive"
        size="lg"
      >
        Start Live Event
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-full p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Live Event</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="flex-1 p-4 pt-0">
            <iframe
              src={roomUrl}
              allow="camera; microphone; fullscreen; display-capture"
              className="w-full h-[75vh] border-0 rounded-md"
              title="Live Event"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LiveEventButton;