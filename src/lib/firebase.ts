// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDP5e8qVmZfGOTECfAZWHUY9LOiv4qgqCg",
  authDomain: "tribe-l-pulse.firebaseapp.com",
  projectId: "tribe-l-pulse",
  storageBucket: "tribe-l-pulse.appspot.com",
  messagingSenderId: "63825600323",
  appId: "1:63825600323:web:dcbf34a6f24921c20519f6",
  measurementId: "G-P01T48K595",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Keep users logged in
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("✅ Auth persistence set to local"))
  .catch((error) => console.error("❌ Error setting auth persistence:", error.code, error.message));

// ✅ Optional analytics (only runs in browser)
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        const analytics = getAnalytics(app);
        console.log("✅ Analytics initialized");
      } else {
        console.log("⚠️ Analytics not supported in this environment");
      }
    })
    .catch((err) => console.warn("⚠️ Analytics error:", err));
}

export { app, auth, db, storage };
