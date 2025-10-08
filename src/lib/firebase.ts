// src/lib/firebase.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Optional analytics (guarded so it won't break in non-browser contexts)
type Analytics = any;
let analytics: Analytics | null = null;

const firebaseConfig = {
  apiKey: "AIzaSyDP5e8qVmZfGOTECfAZWHUY9LOiv4qgqCg",
  authDomain: "tribe-l-pulse.firebaseapp.com",
  projectId: "tribe-l-pulse",
  storageBucket: "tribe-l-pulse.appspot.com",
  messagingSenderId: "63825600323",
  appId: "1:63825600323:web:dcbf34a6f24921c20519f6",
  measurementId: "G-P01T48K595",
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("✅ Auth persistence set to local"))
  .catch((e) => console.error("❌ Error setting auth persistence:", e?.code, e?.message));

// Lazily init analytics only in the browser
if (typeof window !== "undefined") {
  import("firebase/analytics")
    .then(async ({ getAnalytics, isSupported }) => {
      try {
        if (await isSupported()) {
          analytics = getAnalytics(app);
          console.log("✅ Analytics initialized");
        }
      } catch (e) {
        console.warn("⚠️ Analytics not available:", e);
      }
    })
    .catch(() => {});
}

export { app, auth, db, storage, analytics };
