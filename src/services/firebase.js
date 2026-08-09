// Realtime Sync Service with Firebase & Local Storage Fallback Engine
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';

// Optional Firebase configuration template (reads from env or uses local fallback engine)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

let db = null;
let isFirebaseEnabled = false;

try {
  if (firebaseConfig.databaseURL) {
    const app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    isFirebaseEnabled = true;
    console.log("🔥 Firebase Realtime Database connected successfully.");
  }
} catch (e) {
  console.warn("Firebase initialization skipped, using local synchronized state engine.", e);
}

export function subscribeToStore(key, callback, initialValue) {
  if (isFirebaseEnabled && db) {
    const dbRef = ref(db, key);
    return onValue(dbRef, (snapshot) => {
      const val = snapshot.val();
      if (val !== null && val !== undefined) {
        callback(val);
      } else {
        callback(initialValue);
      }
    });
  } else {
    // LocalStorage with BroadcastChannel/Event sync for multi-tab support
    const handleStorage = (e) => {
      if (e.key === `mahabba_${key}` && e.newValue) {
        try {
          callback(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    // Initial load from localStorage if exists
    const stored = localStorage.getItem(`mahabba_${key}`);
    if (stored) {
      try {
        callback(JSON.parse(stored));
      } catch (e) {
        callback(initialValue);
      }
    } else {
      callback(initialValue);
    }

    return () => window.removeEventListener('storage', handleStorage);
  }
}

export function updateStore(key, data) {
  if (isFirebaseEnabled && db) {
    const dbRef = ref(db, key);
    set(dbRef, data);
  }
  // Always write to LocalStorage as well for offline persistence & instant update
  localStorage.setItem(`mahabba_${key}`, JSON.stringify(data));
  // Dispatch custom window event for same-tab reactive updates
  window.dispatchEvent(new CustomEvent(`mahabba_update_${key}`, { detail: data }));
}
