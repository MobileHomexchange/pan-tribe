import { useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function FirebaseTest() {
  useEffect(() => {
    const testWrite = async () => {
      try {
        const docRef = await addDoc(collection(db, "testCollection"), {
          name: "TribalPulse Connection Test",
          timestamp: new Date(),
        });
        console.log("✅ Firebase connected! Document written with ID:", docRef.id);
      } catch (e) {
        console.error("❌ Firebase error:", e);
      }
    };
    testWrite();
  }, []);

  return <h1>Firebase Connection Test Page</h1>;
}
