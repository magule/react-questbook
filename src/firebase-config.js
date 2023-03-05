// Import the functions you need from the SDKs you need
import { getFirestore } from 'firebase/firestore'; //initialze database in project
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoh0F9WHPQixlWXGBoVIRD3dsZCM6qyww",
  authDomain: "blog-firebase-2f0a8.firebaseapp.com",
  projectId: "blog-firebase-2f0a8",
  storageBucket: "blog-firebase-2f0a8.appspot.com",
  messagingSenderId: "992798517152",
  appId: "1:992798517152:web:a718a170ded2559fdde6c5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//creating all the needed connections realted to firebase
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

