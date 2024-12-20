// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNMux3YGKu6G7EjuRZAahjqRTDIbAK-hA",
  authDomain: "celebrities-42c6f.firebaseapp.com",
  databaseURL: "https://celebrities-42c6f-default-rtdb.firebaseio.com",
  projectId: "celebrities-42c6f",
  storageBucket: "celebrities-42c6f.appspot.com",
  messagingSenderId: "481275123340",
  appId: "1:481275123340:web:c36fdd5dec4c3825718da9",
  measurementId: "G-FTK1Q9HCBT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);