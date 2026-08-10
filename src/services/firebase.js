// Realtime Cloud Sync Service with Firebase (Firestore & Realtime DB) + Local Reactive Engine
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD6t5yhImbchMG9Up7z5WEL2m-i1kGeDnY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "madrasa-arts.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://madrasa-arts-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "madrasa-arts",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "madrasa-arts.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "442563542297",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:442563542297:web:f1863c2d9570dc1d3b9988"
};

let app = null;
let rtdb = null;
let firestore = null;
let isFirebaseEnabled = false;

try {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    try {
      rtdb = getDatabase(app);
    } catch (e) {}
    try {
      firestore = getFirestore(app);
    } catch (e) {}
    isFirebaseEnabled = true;
    console.log("🔥 Firebase cloud service connected for project 'madrasa-arts'.");
  }
} catch (e) {
  console.warn("Firebase initialization warning:", e);
}

export function subscribeToStore(key, callback, initialValue) {
  let unsubRtdb = null;
  let unsubFirestore = null;

  if (isFirebaseEnabled) {
    // 1. Realtime Database Subscription
    if (rtdb) {
      try {
        const dbRef = ref(rtdb, key);
        unsubRtdb = onValue(dbRef, (snapshot) => {
          const val = snapshot.val();
          if (val !== null && val !== undefined) {
            callback(val);
          }
        }, (err) => console.warn("RTDB sync fallback:", err));
      } catch (err) {}
    }

    // 2. Firestore Subscription Fallback
    if (firestore) {
      try {
        const docRef = doc(firestore, "madrasa_store", key);
        unsubFirestore = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data && data.payload) {
              callback(data.payload);
            }
          }
        }, (err) => console.warn("Firestore sync fallback:", err));
      } catch (err) {}
    }
  }

  // 3. Multi-tab / Multi-window BroadcastChannel Sync
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
    if (typeof unsubRtdb === 'function') unsubRtdb();
    if (typeof unsubFirestore === 'function') unsubFirestore();
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
  if (isFirebaseEnabled) {
    // 1. Update Realtime Database
    if (rtdb) {
      try {
        const dbRef = ref(rtdb, key);
        set(dbRef, data).catch((e) => console.warn("RTDB set warning:", e));
      } catch (err) {}
    }

    // 2. Update Firestore Document
    if (firestore) {
      try {
        const docRef = doc(firestore, "madrasa_store", key);
        setDoc(docRef, { payload: data, updatedAt: new Date().toISOString() }).catch((e) => console.warn("Firestore set warning:", e));
      } catch (err) {}
    }
  }

  // 3. LocalStorage persistence & BroadcastChannel
  try {
    localStorage.setItem(`mahabba_${key}`, JSON.stringify(data));
  } catch (e) {}

  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(`mahabba_bc_${key}`);
      channel.postMessage(data);
      channel.close();
    }
  } catch (e) {}

  try {
    window.dispatchEvent(new CustomEvent(`mahabba_update_${key}`, { detail: data }));
  } catch (e) {}
}
