// src/firebase/firebase.ts

import { initializeApp } from "firebase/app";

import { 
  getAuth 
} from "firebase/auth";

import { 
  getFirestore 
} from "firebase/firestore";

import { 
  getStorage 
} from "firebase/storage";

import { 
  getAnalytics,
  isSupported
} from "firebase/analytics";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCraCwLLx8zaG6ivbTQFPocBC9gjuKQZwI",
  authDomain: "clothingvault-62c7a.firebaseapp.com",
  projectId: "clothingvault-62c7a",
  storageBucket: "clothingvault-62c7a.firebasestorage.app",
  messagingSenderId: "350978262011",
  appId: "1:350978262011:web:e7ca68c83a45cd86ec415e",
  measurementId: "G-92LWRSHD4M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Services
export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);

// Analytics Fix
let analytics: any = null;

isSupported().then((yes) => {
  if (yes) {
    analytics = getAnalytics(app);
  }
});

export { analytics };

export default app;