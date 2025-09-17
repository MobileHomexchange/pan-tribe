import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyB6jCVxELlAljpufFWtUhx9uTgj-ApLLZo",
  authDomain: "tribe-connect-8c9a8.firebaseapp.com",
  projectId: "tribe-connect-8c9a8",
  storageBucket: "tribe-connect-8c9a8.firebasestorage.app",
  messagingSenderId: "148426021066",
  appId: "1:148426021066:web:5315579c44bf73126b7c33",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;