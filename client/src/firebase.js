// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "crowded-narrative.firebaseapp.com",
  projectId: "crowded-narrative",
  storageBucket: "crowded-narrative.appspot.com",
  messagingSenderId: "407116718690",
  appId: "1:407116718690:web:ecc859319d3fe3cb90e73b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);