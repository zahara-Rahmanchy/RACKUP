import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "@firebase/firestore";
import {getStorage} from "firebase/storage";
import { getAuth } from "firebase/auth";

//import firebase from "firebase";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOM,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STOREBUCK,
  messagingSenderId: process.env.REACT_APP_MSGSENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENTID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage();
export const auth = getAuth();
//const analytics = getAnalytics(app);