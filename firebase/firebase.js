import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAevoCmoh2O1IHGPqQp_aukBebTJ4gsaYg",
  authDomain: "small-talk-1613d.firebaseapp.com",
  projectId: "small-talk-1613d",
  storageBucket: "small-talk-1613d.appspot.com",
  messagingSenderId: "161153521602",
  appId: "1:161153521602:web:7f5b38568c2b72d8cfe85b"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);