import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgZSs9HoPL54KtO8iSad_rkPVEdKC4ndI",
  authDomain: "activit-s.firebaseapp.com",
  projectId: "activit-s",
  storageBucket: "activit-s.firebasestorage.app",
  messagingSenderId: "271565414437",
  appId: "1:271565414437:web:023aae4d5ce2eec9469fcc",
  measurementId: "G-LELBLQR7C0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
