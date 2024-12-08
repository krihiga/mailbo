// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVIaFaHV5e4fxL6HQeO22_TtaGEtK60CE",
  authDomain: "busy-order-111094.firebaseapp.com",
  databaseURL: "https://busy-order-111094-default-rtdb.firebaseio.com",
  projectId: "busy-order-111094",
  storageBucket: "busy-order-111094.firebasestorage.app",
  messagingSenderId: "402345046681",
  appId: "1:402345046681:web:4def93c2d5c4742b3c7e08",
  measurementId: "G-3R9FT0HKNM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// DOM elements
const googleSignInButton = document.getElementById('googleSignIn');
const userInfoDiv = document.getElementById('user-info');

// Google Sign-In
googleSignInButton.addEventListener('click', async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    userInfoDiv.innerHTML = `
      <h3>Welcome, ${user.displayName}!</h3>
      <img src="${user.photoURL}" alt="User Image" width="100" height="100">
      <p>Email: ${user.email}</p>
      <button id="signOut">Sign Out</button>
    `;
    window.location.href = "form.html";

    // Sign out logic
    document.getElementById('signOut').addEventListener('click', async () => {
      await signOut(auth);
      userInfoDiv.innerHTML = '';
      alert('You have signed out.');
    });
  } catch (error) {
    console.error('Error during sign-in:', error);
    alert('Failed to sign in. Please try again.');
  }
});
