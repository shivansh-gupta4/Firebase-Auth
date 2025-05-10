// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWZw9T6qgZ6qVg68UhKlet5LLVxB1Oly4",
  authDomain: "rstown-auth.firebaseapp.com",
  projectId: "rstown-auth",
  storageBucket: "rstown-auth.firebasestorage.app",
  messagingSenderId: "384544210347",
  appId: "1:384544210347:web:39006ba2155ce288d6a6ee",
  measurementId: "G-XLGX00EGWQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { app, auth };