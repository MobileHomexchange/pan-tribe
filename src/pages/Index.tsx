import { useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Layout } from "@/components/layout/Layout";
import MainFeed from "@/components/feed/MainFeed";

const Index = () => {
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

  return (
    <Layout>
      <MainFeed />
    </Layout>
  );
};

export default Index;
