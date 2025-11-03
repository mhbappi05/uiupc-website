// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDc2jpK797PGU7Xso_6KtangnELub63lEk",
  authDomain: "uiu-photography-club.firebaseapp.com",
  projectId: "uiu-photography-club",
  storageBucket: "uiu-photography-club.firebasestorage.app",
  messagingSenderId: "642880858547",
  appId: "1:642880858547:web:c0da344d8497d6c8eb43c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore(app); // Database
export const auth = getAuth(app); // User Authentication
export const storage = getStorage(app); // Image/File Storage

export default app;