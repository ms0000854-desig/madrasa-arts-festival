// Realtime Sync Service with Firebase Realtime Database & Reactive Fallback Engine
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';

// Firebase configuration template (reads from env variables or fallback)
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
  if (firebaseConfig.databaseURL && firebaseConfig.apiKey) {
    const app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    isFirebaseEnabled = true;
    console.log("🔥 Firebase Realtime Database connected successfully.");
  }
} catch (e) {
  console.warn("Firebase initialization skipped or environment variables not provided. Using reactive local storage & BroadcastChannel engine.", e);
}

export function subscribeToStore(key, callback, initialValue) {
  let firebaseUnsub = null;

  if (isFirebaseEnabled && db) {
    try {
      const dbRef = ref(db, key);
      firebaseUnsub = onValue(dbRef, (snapshot) => {
        const val = snapshot.val();
        if (val !== null && val !== undefined) {
          callback(val);
        } else {
          callback(initialValue);
        }
      });
    } catch (err) {
      console.error("Firebase subscription error:", err);
    }
  }

  // Multi-tab / Multi-window BroadcastChannel Sync Engine
  let channel = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel(`mahabba_bc_${key}`);
      channel.onmessage = (e) => {
        if (e.data !== undefined && e.data !== null) {
          callback(e.data);
        }
      };
    }
  } catch (e) {}

  const handleStorage = (e) => {
    if (e.key === `mahabba_${key}` && e.newValue) {
      try {
        callback(JSON.parse(e.newValue));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCustom = (e) => {
    if (e.detail !== undefined && e.detail !== null) {
      callback(e.detail);
    }
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(`mahabba_update_${key}`, handleCustom);

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

  return () => {
    if (typeof firebaseUnsub === 'function') firebaseUnsub();
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(`mahabba_update_${key}`, handleCustom);
    if (channel) {
      try {
        channel.close();
      } catch (e) {}
    }
  };
}

export function updateStore(key, data) {
  if (isFirebaseEnabled && db) {
    try {
      const dbRef = ref(db, key);
      set(dbRef, data);
    } catch (err) {
      console.error("Firebase update error:", err);
    }
  }
  
  // Always write to LocalStorage as well for offline persistence & instant update
  try {
    localStorage.setItem(`mahabba_${key}`, JSON.stringify(data));
  } catch (e) {}

  // Dispatch BroadcastChannel for cross-tab sync
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(`mahabba_bc_${key}`);
      channel.postMessage(data);
      channel.close();
    }
  } catch (e) {}

  // Dispatch custom window event for same-tab reactive updates
  try {
    window.dispatchEvent(new CustomEvent(`mahabba_update_${key}`, { detail: data }));
  } catch (e) {}
}
