// Re-export from the new firebaseConfig.ts to maintain compatibility with existing imports
export { auth, db, storage } from "./firebaseConfig"; // Modular v9 Firebase init
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDP5e8qVmZfGOTECfAZWHUY9LOiv4qgqCg",
  authDomain: "tribe-l-pulse.firebaseapp.com",
  projectId: "tribe-l-pulse",
  storageBucket: "tribe-l-pulse.firebasestorage.app",
  messagingSenderId: "63825600323",
  appId: "1:63825600323:web:dcbf34a6f24921c20519f6",
  measurementId: "G-P01T48K595",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
