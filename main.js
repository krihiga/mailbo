// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { signInWithRedirect } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
signInWithRedirect(auth, provider);


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVIaFaHV5e4fxL6HQeO22_TtaGEtK60CE",
  authDomain: "https://mailbo.vercel.app",
  projectId: "busy-order-111094",
  storageBucket: "busy-order-111094.firebasestorage.app",
  messagingSenderId: "402345046681",
  appId: "1:402345046681:web:4def93c2d5c4742b3c7e08",
  measurementId: "G-3R9FT0HKNM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// Initialize the Google provider
const provider = new GoogleAuthProvider();

// Trigger the sign-in process on button click
document.getElementById("googleSignInBtn").addEventListener("click", () => {
    const auth = getAuth();
    signInWithRedirect(auth, provider);
});

// Handle the redirect result (after sign-in)
getRedirectResult(auth)
    .then((result) => {
        if (result) {
            const user = result.user;
            console.log("User signed in:", user);
        }
    })
    .catch((error) => {
        console.error("Error during sign-in:", error);
    });
