// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import getAuth for authentication
import { getAnalytics } from "firebase/analytics"; // Import getAnalytics for Analytics

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVJwTXBZRTpaYXz0dRai60bhccJ_EYxJI",
  authDomain: "lhdms-b2f09.firebaseapp.com",
  projectId: "lhdms-b2f09",
  storageBucket: "lhdms-b2f09.appspot.com",
  messagingSenderId: "855736084411",
  appId: "1:855736084411:web:3e326b195db56ba2d5469e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics
const analytics = getAnalytics(app); // Ensure this line is included if you're using analytics

// Initialize Firebase Authentication
const auth = getAuth(app);

// Export the auth object for use in other parts of your app
export { auth };
