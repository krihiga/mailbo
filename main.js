// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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

// Google Sign-In Button
const googleSignInButton = document.getElementById("google-signin");

googleSignInButton.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("User signed in:", user);

      // Redirect after successful sign-in
      window.location.href = "form.html";
    })
    .catch((error) => {
      console.error("Sign-in error:", error.code, error.message);
    });
});