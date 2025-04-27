import { auth } from './firebase-init.js';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.querySelector('.login-form');
  const emailInput = loginForm.querySelector('input[type="email"]');
  const passwordInput = loginForm.querySelector('input[type="password"]');
  const submitBtn = document.getElementById('submitBtn');

  // Regular login with email and password
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    clearErrors();

    let isValid = true;

    if (!validateEmail(emailInput.value)) {
      showError(emailInput, 'Please enter a valid email address');
      isValid = false;
    }

    if (passwordInput.value.length < 6) {
      showError(passwordInput, 'Password must be at least 6 characters');
      isValid = false;
    }

    if (isValid) {
      submitBtn.innerHTML = '<span class="loading-spinner"></span> Logging in...';
      submitBtn.disabled = true;

      // Firebase login with email and password
      signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
        .then(userCredential => {
          window.location.href = 'home.html'; // Redirect to home page after successful login
        })
        .catch(error => {
          console.error(error);
          showError(passwordInput, 'Invalid email or password');
          submitBtn.innerHTML = 'Login';
          submitBtn.disabled = false;
        });
    }
  });

  // Google login functionality
  const googleLoginBtn = document.querySelector('.google-login');
  const provider = new GoogleAuthProvider();

  googleLoginBtn.addEventListener('click', function () {
    signInWithPopup(auth, provider)
      .then(result => {
        window.location.href = 'home.html'; // Redirect to home page after Google login
      })
      .catch(error => {
        console.error(error);
        showError(emailInput, 'Google login failed');
      });
  });

  emailInput.addEventListener('input', () => {
    if (validateEmail(emailInput.value)) clearError(emailInput);
  });

  passwordInput.addEventListener('input', () => {
    if (passwordInput.value.length >= 6) clearError(passwordInput);
  });

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showError(input, message) {
    input.classList.add('error');
    let error = input.nextElementSibling;
    if (!error || !error.classList.contains('error-message')) {
      error = document.createElement('div');
      error.classList.add('error-message');
      input.parentNode.insertBefore(error, input.nextElementSibling);
    }
    error.textContent = message;
  }

  function clearError(input) {
    input.classList.remove('error');
    const error = input.nextElementSibling;
    if (error && error.classList.contains('error-message')) {
      error.remove();
    }
  }

  function clearErrors() {
    [emailInput, passwordInput].forEach(clearError);
  }

  // 🟢 Handle Remember Me
  const rememberMeCheckbox = document.getElementById('rememberMe');
  if (rememberMeCheckbox) {
    rememberMeCheckbox.addEventListener('change', function () {
      if (this.checked) {
        localStorage.setItem('foodSnapRememberEmail', emailInput.value);
      } else {
        localStorage.removeItem('foodSnapRememberEmail');
      }
    });

    const savedEmail = localStorage.getItem('foodSnapRememberEmail');
    if (savedEmail) {
      emailInput.value = savedEmail;
      rememberMeCheckbox.checked = true;
    }
  }
});
