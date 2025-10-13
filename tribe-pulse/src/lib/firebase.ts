// ✅ src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDP5e8qVmZfGOTECfAZWHUY9LOiv4qgqCg",
  authDomain: "tribe-l-pulse.firebaseapp.com",
  projectId: "tribe-l-pulse",
  storageBucket: "tribe-l-pulse.firebasestorage.app",
  messagingSenderId: "63825600323",
  appId: "1:63825600323:web:dcbf34a6f24921c20519f6",
  measurementId: "G-P01T48K595"
};

// ✅ Prevent Firebase from initializing multiple times
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);

// ✅ Keep users logged in on Expo web
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error("Auth persistence error:", err);
});
