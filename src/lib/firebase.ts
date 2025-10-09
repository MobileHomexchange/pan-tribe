// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDP5e8qVmZfGOTECfAZWHUY9LOiv4qgqCg",
  authDomain: "tribe-l-pulse.firebaseapp.com",
  projectId: "tribe-l-pulse",
  storageBucket: "tribe-l-pulse.appspot.com",
  messagingSenderId: "63825600323",
  appId: "1:63825600323:web:dcbf34a6f24921c20519f6",
  measurementId: "G-P01T48K595",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (optional)
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Export the Firebase app instance
export default app;
