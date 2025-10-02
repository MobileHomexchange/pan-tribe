import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWqj_9oXzyg91o7F8lCtV7_hAJdAxhhbs",
  authDomain: "crm-faith-mobile-home.firebaseapp.com",
  projectId: "crm-faith-mobile-home",
  storageBucket: "crm-faith-mobile-home.firebasestorage.app",
  messagingSenderId: "1024150165908",
  appId: "1:1024150165908:web:10e170a6f1c07b72255781",
  measurementId: "G-BVK5Q22CG8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
