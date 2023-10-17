// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDG8_Lz9ggCm-gA1UM6TftJoSnTX7m-NWw",
  authDomain: "revelationapp-390bd.firebaseapp.com",
  databaseURL: "https://revelationapp-390bd-default-rtdb.firebaseio.com",
  projectId: "revelationapp-390bd",
  storageBucket: "revelationapp-390bd.appspot.com",
  messagingSenderId: "465444417647",
  appId: "1:465444417647:web:54b90ab71cf4b21a26dd9a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
