// Realtime Cloud Sync Service with Firebase (Firestore & Realtime DB) + Local Reactive Engine
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';

// Production Firebase Configuration for 'madrasa-arts'
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
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
    try {
      rtdb = getDatabase(app);
    } catch (e) {
      console.warn("RTDB init warning:", e);
    }
    try {
      firestore = getFirestore(app);
    } catch (e) {
      console.warn("Firestore init warning:", e);
    }
    isFirebaseEnabled = true;
    console.log("🔥 Production Firebase Cloud Service initialized successfully.");
  }
} catch (e) {
  console.warn("Firebase initialization error:", e);
}

// Data Sanitizer: Eliminates undefined properties that break Firebase JSON serialization
function sanitizeData(data) {
  if (data === undefined) return null;
  return JSON.parse(JSON.stringify(data));
}

export function subscribeToStore(key, callback, initialValue) {
  let unsubRtdb = null;
  let unsubFirestore = null;
  let hasReceivedCloudData = false;

  // Helper to handle data received from cloud or fallback
  const handleDataUpdate = (data, source) => {
    const clean = sanitizeData(data);
    if (clean !== null && clean !== undefined) {
      hasReceivedCloudData = true;
      try {
        localStorage.setItem(`mahabba_${key}`, JSON.stringify(clean));
      } catch (e) {}
      callback(clean);
    } else if (!hasReceivedCloudData) {
      // Seed Firebase if data is empty on cloud
      if (initialValue) {
        updateStore(key, initialValue);
        callback(initialValue);
      }
    }
  };

  if (isFirebaseEnabled) {
    // 1. Firebase Realtime Database Subscription
    if (rtdb) {
      try {
        const dbRef = ref(rtdb, key);
        unsubRtdb = onValue(
          dbRef,
          (snapshot) => {
            const val = snapshot.val();
            if (val !== null && val !== undefined) {
              handleDataUpdate(val, "rtdb");
            } else if (!hasReceivedCloudData) {
              handleDataUpdate(initialValue, "rtdb_initial");
            }
          },
          (err) => {
            console.warn(`RTDB subscription error for ${key}:`, err);
          }
        );
      } catch (err) {
        console.warn("RTDB ref error:", err);
      }
    }

    // 2. Firestore Document Subscription
    if (firestore) {
      try {
        const docRef = doc(firestore, "madrasa_store", key);
        unsubFirestore = onSnapshot(
          docRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data && data.payload !== undefined && data.payload !== null) {
                handleDataUpdate(data.payload, "firestore");
              }
            } else if (!hasReceivedCloudData) {
              handleDataUpdate(initialValue, "firestore_initial");
            }
          },
          (err) => {
            console.warn(`Firestore subscription error for ${key}:`, err);
          }
        );
      } catch (err) {
        console.warn("Firestore doc error:", err);
      }
    }
  }

  // 3. Same-device Multi-tab / Multi-window BroadcastChannel Sync
  let channel = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel(`mahabba_bc_${key}`);
      channel.onmessage = (e) => {
        if (e.data !== undefined && e.data !== null) {
          handleDataUpdate(e.data, "broadcast_channel");
        }
      };
    }
  } catch (e) {}

  const handleStorage = (e) => {
    if (e.key === `mahabba_${key}` && e.newValue) {
      try {
        handleDataUpdate(JSON.parse(e.newValue), "storage_event");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCustom = (e) => {
    if (e.detail !== undefined && e.detail !== null) {
      handleDataUpdate(e.detail, "custom_event");
    }
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(`mahabba_update_${key}`, handleCustom);

  // Initial local state load while waiting for cloud snapshot
  const stored = localStorage.getItem(`mahabba_${key}`);
  if (stored && !hasReceivedCloudData) {
    try {
      callback(JSON.parse(stored));
    } catch (e) {
      callback(initialValue);
    }
  } else if (!hasReceivedCloudData) {
    callback(initialValue);
  }

  // Return unsubscription cleanup
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

export function updateStore(key, rawData) {
  const cleanData = sanitizeData(rawData);

  if (isFirebaseEnabled) {
    // 1. Write to Firebase Realtime Database
    if (rtdb) {
      try {
        const dbRef = ref(rtdb, key);
        set(dbRef, cleanData).catch((e) => console.warn(`RTDB set warning for ${key}:`, e));
      } catch (err) {
        console.warn(`RTDB write error for ${key}:`, err);
      }
    }

    // 2. Write to Firestore Document
    if (firestore) {
      try {
        const docRef = doc(firestore, "madrasa_store", key);
        setDoc(docRef, { payload: cleanData, updatedAt: new Date().toISOString() })
          .catch((e) => console.warn(`Firestore set warning for ${key}:`, e));
      } catch (err) {
        console.warn(`Firestore write error for ${key}:`, err);
      }
    }
  }

  // 3. LocalStorage persistence
  try {
    localStorage.setItem(`mahabba_${key}`, JSON.stringify(cleanData));
  } catch (e) {}

  // 4. BroadcastChannel for cross-tab sync
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(`mahabba_bc_${key}`);
      channel.postMessage(cleanData);
      channel.close();
    }
  } catch (e) {}

  // 5. Custom DOM event for same-tab updates
  try {
    window.dispatchEvent(new CustomEvent(`mahabba_update_${key}`, { detail: cleanData }));
  } catch (e) {}
}
