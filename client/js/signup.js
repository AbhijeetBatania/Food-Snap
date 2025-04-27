import { auth, db } from './firebase-init.js'; // Import auth and db
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Signup form and elements
document.addEventListener('DOMContentLoaded', function () {
  const signupForm = document.getElementById('signupForm');
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const passwordMatchMessage = document.getElementById('passwordMatchMessage');
  const signupBtn = document.getElementById('loginBtn');

  signupForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Check if passwords match
    if (passwordInput.value !== confirmPasswordInput.value) {
      passwordMatchMessage.textContent = 'Passwords do not match!';
      passwordMatchMessage.style.color = 'red';
      return;
    } else {
      passwordMatchMessage.textContent = '';
    }

    const fullName = fullNameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    signupBtn.innerHTML = '<span class="loading-spinner"></span> Signing Up...';
    signupBtn.disabled = true;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fullName: fullName,
        email: email,
        createdAt: new Date()
      });

      window.location.href = 'profilesetup.html';
    } catch (error) {
      console.error(error.message);
      alert('Error during signup. Please try again.');
      signupBtn.innerHTML = 'Sign Up';
      signupBtn.disabled = false;
    }
  });

  // Google sign up button
  const googleBtn = document.querySelector('.google-btn');
  const provider = new GoogleAuthProvider();

  googleBtn.addEventListener('click', async function () {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fullName: user.displayName || '',
        email: user.email,
        createdAt: new Date()
      });

      window.location.href = 'profilesetup.html';
    } catch (error) {
      console.error(error.message);
      alert('Error during Google sign up. Please try again.');
    }
  });
});
