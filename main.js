// Import Firebase modules
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVIaFaHV5e4fxL6HQeO22_TtaGEtK60CE",
  authDomain: "busy-order-111094.firebaseapp.com",
  databaseURL: "https://busy-order-111094-default-rtdb.firebaseio.com",
  projectId: "busy-order-111094",
  storageBucket: "busy-order-111094.firebasestorage.app",
  messagingSenderId: "402345046681",
  appId: "1:402345046681:web:4def93c2d5c4742b3c7e08",
  measurementId: "G-3R9FT0HKNM"
};

 // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

// Google Sign-in
const provider = new GoogleAuthProvider();

document.getElementById("google-signin").addEventListener("click", () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("User signed in:", result.user);
    // After sign-in, redirect to a new page
    window.location.href = "form.html";  
    })
      .catch((error) => {
        console.error("Error during sign-in:", error.code, error.message);
      });
  });
      
    
