// script.js

// Utility to get current page name
function getCurrentPage() {
  return window.location.pathname.split("/").pop();
}

// Main page controller
document.addEventListener("DOMContentLoaded", () => {
  const page = getCurrentPage();

  switch (page) {
    case "index.html":
      handleIndexPage();
      break;
    case "login.html":
      handleLoginPage();
      break;
    case "signup.html":
      handleSignupPage();
      break;
    case "home.html":
      handleHomePage();
      break;
    case "scan.html":
      handleScanPage();
      break;
    case "profile.html":
      handleProfilePage();
      break;
    case "history.html":
      handleHistoryPage();
      break;
    case "settings.html":
      handleSettingsPage();
      break;
    default:
      console.log("Page not recognized");
  }
});

//
// 🔵 index.html
//
function handleIndexPage() {
  console.log("Index page loaded");
  // Example: Button interactions
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      window.location.href = "signup.html";
    });
  }
}

//
// 🔵 login.html
//
function handleLoginPage() {
  console.log("Login page loaded");
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // Add login logic here (Firebase or custom backend)
      alert("Logged in successfully");
      window.location.href = "home.html";
    });
  }
}

//
// 🔵 signup.html
//
function handleSignupPage() {
  console.log("Signup page loaded");
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // Add signup logic here (Firebase or custom backend)
      alert("Account created successfully");
      window.location.href = "home.html";
    });
  }
}

//
// 🔵 home.html
//
function handleHomePage() {
  console.log("Home page loaded");
  const scanBtn = document.getElementById("scanBtn");
  if (scanBtn) {
    scanBtn.addEventListener("click", () => {
      window.location.href = "scan.html";
    });
  }
}

//
// 🔵 scan.html
//
function handleScanPage() {
  console.log("Scan page loaded");
  const scanInput = document.getElementById("scanInput");
  const resultBox = document.getElementById("resultBox");

  if (scanInput) {
    scanInput.addEventListener("change", () => {
      const file = scanInput.files[0];
      if (file) {
        resultBox.textContent = `Scanned file: ${file.name}`;
        // You can implement actual OCR/barcode logic here later
      }
    });
  }
}

//
// 🔵 profile.html
//
function handleProfilePage() {
  console.log("Profile page loaded");
  // Load user info from local storage or Firebase
}

//
// 🔵 history.html
//
function handleHistoryPage() {
  console.log("History page loaded");
  // Load scanned history from Firebase or local storage
}

//
// 🔵 settings.html
//
function handleSettingsPage() {
  console.log("Settings page loaded");
  // Theme toggles, preferences etc.
}
