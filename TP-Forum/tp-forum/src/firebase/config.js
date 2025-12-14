// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIg5br1nqhwthyg4bNyCt77Z03mdcVLtw",
  authDomain: "tp-forum-57577.firebaseapp.com",
  projectId: "tp-forum-57577",
  storageBucket: "tp-forum-57577.firebasestorage.app",
  messagingSenderId: "515100366400",
  appId: "1:515100366400:web:89447ee04fe3e8d582b1a5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const firebaseApp = app;