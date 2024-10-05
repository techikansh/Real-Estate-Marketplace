// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-e6781.firebaseapp.com",
  projectId: "real-estate-e6781",
  storageBucket: "real-estate-e6781.appspot.com",
  messagingSenderId: "953017521305",
  appId: "1:953017521305:web:0423aabfe721b8e41f1408"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
