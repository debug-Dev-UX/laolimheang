// src/firebase/config.js
// Firebase app initialization
// Reads all config from environment variables — never hardcode keys

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Validate config
const missingKeys = Object.entries(firebaseConfig)
  .filter(([, val]) => !val)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  console.warn(
    `⚠️ Missing Firebase config keys: ${missingKeys.join(", ")}.\n` +
    `Copy .env.example to .env.local and fill in your Firebase credentials.`
  );
}

// Initialize Firebase — guard against duplicate initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;