// Re-export from the new firebaseConfig.ts to maintain compatibility with existing imports
export { auth, db } from './firebaseConfig';

// Note: storage is not exported from firebaseConfig yet, so we'll keep it commented
// If you need storage, add it to firebaseConfig.ts first
// export { storage } from './firebaseConfig';