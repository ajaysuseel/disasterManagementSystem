// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUcRADNMtY4Wh7EQpjZBAfIBN9UG8XnAQ",
  authDomain: "disaster-management-fa0d1.firebaseapp.com",
  projectId: "disaster-management-fa0d1",
  storageBucket: "disaster-management-fa0d1.appspot.com",
  messagingSenderId: "57157101142",
  appId: "1:57157101142:web:3970c2c9cea400f96d7df7",
  measurementId: "G-6W55ZXBYJL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth=getAuth(app);

export {auth};