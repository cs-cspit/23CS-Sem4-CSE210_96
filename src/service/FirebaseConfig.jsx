// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLJ1l4Y0QrwCaBNgk3zq8miVD9Uud8aD8",
  authDomain: "ai-travel-planner-77872.firebaseapp.com",
  projectId: "ai-travel-planner-77872",
  storageBucket: "ai-travel-planner-77872.firebasestorage.app",
  messagingSenderId: "1042216854383",
  appId: "1:1042216854383:web:9853508465f9a9a2357e9a",
  measurementId: "G-V0RF8KX9MM"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
// const analytics = getAnalytics(app);