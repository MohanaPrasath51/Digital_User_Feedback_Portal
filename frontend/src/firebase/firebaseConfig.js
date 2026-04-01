// ============================================================
// Firebase Configuration
// ============================================================
// Steps to get your config:
// 1. Go to https://console.firebase.google.com
// 2. Select your project (or create one)
// 3. Click the gear icon → Project Settings
// 4. Under "Your apps", click the </> (Web) icon to register a web app
// 5. Copy the firebaseConfig object and paste the values below
// ============================================================

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDhc_a5ADr3mtPn45AZpk7Cheg-lTEjSHc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "feedbackportal-4588c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "feedbackportal-4588c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "feedbackportal-4588c.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "520526681365",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:520526681365:web:8f2396fedc277b7480851c",
};

const app = initializeApp(firebaseConfig);

export default app;
