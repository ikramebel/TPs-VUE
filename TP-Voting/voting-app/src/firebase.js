// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrmkqJwl9aJrKojYvFFeqbU6HPHLWsYb0",
  authDomain: "voting-app-bcf84.firebaseapp.com",
  projectId: "voting-app-bcf84",
  storageBucket: "voting-app-bcf84.firebasestorage.app",
  messagingSenderId: "150917525036",
  appId: "1:150917525036:web:2d9e624c674fae617a6b89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const firebaseApp = app;