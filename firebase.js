// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBSyPmJrAIpUsBCkQg7BibLh5BDR6WVUKs",
    authDomain: "build-a3a10.firebaseapp.com",
    databaseURL: "https://build-a3a10.firebaseio.com",
    projectId: "build-a3a10",
    storageBucket: "build-a3a10.firebasestorage.app",
    messagingSenderId: "501028842173",
    appId: "1:501028842173:web:a377337bf40f879c22e5d4",
    measurementId: "G-NGMJ97FNF3"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);