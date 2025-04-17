// DOM elements
let profileForm;
let audioOutput;
let audioSettingsContainer;
let languageBtn;
let languagePopup;
let closeLanguagePopup;
let languageButtons;
let cancelBtn;

// Current language
let currentLanguage = 'en';

// Audio context for accessibility feature
let audioContext;
let speechSynthesis;

// Translations
const translations = {
  en: {
    title: "Profile Setup",
    personalInfo: "Personal Information",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone Number",
    birthdate: "Date of Birth",
    dietaryPreferences: "Dietary Preferences",
    vegetarian: "Vegetarian",
    vegan: "Vegan",
    glutenFree: "Gluten Free",
    dairyFree: "Dairy Free",
    nutFree: "Nut Free",
    accessibility: "Accessibility Setup",
    audioOutput: "Enable Audio Output",
    audioSpeed: "Audio Speed",
    languagePreferences: "Language Preferences",
    changeLanguage: "Change Language",
    selectLanguage: "Select Language",
    cancel: "Cancel",
    save: "Save Profile",
    close: "Close"
  },
  hi: {
    title: "प्रोफाइल सेटअप",
    personalInfo: "व्यक्तिगत जानकारी",
    fullName: "पूरा नाम",
    email: "ईमेल",
    phone: "फोन नंबर",
    birthdate: "जन्म तिथि",
    dietaryPreferences: "आहार प्राथमिकताएँ",
    vegetarian: "शाकाहारी",
    vegan: "वीगन",
    glutenFree: "ग्लूटेन फ्री",
    dairyFree: "डेयरी फ्री",
    nutFree: "नट फ्री",
    accessibility: "पहुंच सेटअप",
    audioOutput: "ऑडियो आउटपुट सक्षम करें",
    audioSpeed: "ऑडियो गति",
    languagePreferences: "भाषा प्राथमिकताएँ",
    changeLanguage: "भाषा बदलें",
    selectLanguage: "भाषा चुनें",
    cancel: "रद्द करें",
    save: "प्रोफाइल सहेजें",
    close: "बंद करें"
  }
};

// Initialize the page
function init() {
  // Get DOM elements
  profileForm = document.getElementById('profileForm');
  audioOutput = document.getElementById('audioOutput');
  audioSettingsContainer = document.getElementById('audioSettingsContainer');
  languageBtn = document.getElementById('languageBtn');
  languagePopup = document.getElementById('languagePopup');
  closeLanguagePopup = document.getElementById('closeLanguagePopup');
  languageButtons = document.querySelectorAll('.language-btn');
  cancelBtn = document.getElementById('cancelBtn');
  
  // Hide audio settings by default
  audioSettingsContainer.style.display = 'none';
  
  // Event listeners
  audioOutput.addEventListener('change', toggleAudioSettings);
  languageBtn.addEventListener('click', showLanguagePopup);
  closeLanguagePopup.addEventListener('click', hideLanguagePopup);
  
  // Language selection
  languageButtons.forEach(button => {
    button.addEventListener('click', () => {
      currentLanguage = button.getAttribute('data-lang');
      updateLanguage();
      hideLanguagePopup();
    });
  });
  
  // Form submission
  profileForm.addEventListener('submit', saveProfile);
  
  // Cancel button
  cancelBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      resetForm();
    }
  });
  
  // Click outside language popup to close
  document.addEventListener('click', (event) => {
    if (!languagePopup.classList.contains('hidden') && 
        !languagePopup.contains(event.target) && 
        event.target !== languageBtn) {
      hideLanguagePopup();
    }
  });
}

// Toggle audio settings visibility
function toggleAudioSettings() {
  audioSettingsContainer.style.display = audioOutput.checked ? 'block' : 'none';
  
  if (audioOutput.checked) {
    initializeAudioFeatures();
  }
}

// Initialize audio features
function initializeAudioFeatures() {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (!speechSynthesis) {
      speechSynthesis = window.speechSynthesis;
    }
  } catch (error) {
    console.error('Audio features not supported:', error);
    alert('Your browser does not support audio features.');
    audioOutput.checked = false;
    audioSettingsContainer.style.display = 'none';
  }
}

// Text to speech function
function speakText(text) {
  if (!speechSynthesis) return;
  
  // Cancel any ongoing speech
  speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = currentLanguage === 'en' ? 'en-US' : 'hi-IN';
  utterance.rate = parseFloat(document.getElementById('audioSpeed').value);
  
  speechSynthesis.speak(utterance);
}

// Show language popup
function showLanguagePopup() {
  languagePopup.classList.remove('hidden');
  languagePopup.style.top = $;{languageBtn.getBoundingClientRect().bottom + 10}px;
  languagePopup.style.left = $;{languageBtn.getBoundingClientRect().left}px;
}

// Hide language popup
function hideLanguagePopup() {
  languagePopup.classList.add('hidden');
}

// Update language
function updateLanguage() {
  const trans = translations[currentLanguage];
  
  // Update all text elements
  document.querySelector('h1').textContent = trans.title;
  document.querySelectorAll('h2')[0].textContent = trans.personalInfo;
  document.querySelectorAll('h2')[1].textContent = trans.dietaryPreferences;
  document.querySelectorAll('h2')[2].textContent = trans.accessibility;
  document.querySelectorAll('h2')[3].textContent = trans.languagePreferences;
  
  document.querySelector('label[for="fullName"]').textContent = trans.fullName;
  document.querySelector('label[for="email"]').textContent = trans.email;
  document.querySelector('label[for="phone"]').textContent = trans.phone;
  document.querySelector('label[for="birthdate"]').textContent = trans.birthdate;
  
  document.querySelector('label[for="vegetarian"]').textContent = trans.vegetarian;
  document.querySelector('label[for="vegan"]').textContent = trans.vegan;
  document.querySelector('label[for="glutenFree"]').textContent = trans.glutenFree;
  document.querySelector('label[for="dairyFree"]').textContent = trans.dairyFree;
  document.querySelector('label[for="nutFree"]').textContent = trans.nutFree;
  
  document.querySelector('label[for="audioOutput"]').textContent = trans.audioOutput;
  document.querySelector('label[for="audioSpeed"]').textContent = trans.audioSpeed;
  
  languageBtn.textContent = trans.changeLanguage;
  document.querySelector('#languagePopup h3').textContent = trans.selectLanguage;
  closeLanguagePopup.textContent = trans.close;
  
  cancelBtn.textContent = trans.cancel;
  document.querySelector('.btn-primary').textContent = trans.save;
  
  // If audio is enabled, announce language change
  if (audioOutput.checked && speechSynthesis) {
    speakText(currentLanguage === 'en' ? 
      'Language changed to English' : 
      'भाषा हिंदी में बदल दी गई है');
  }
}

// Save profile data
function saveProfile(event) {
  event.preventDefault();
  
  // Get form data
  const formData = new FormData(profileForm);
  const profileData = {
    personalInfo: {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      birthdate: formData.get('birthdate')
    },
    dietaryPreferences: {
      vegetarian: document.getElementById('vegetarian').checked,
      vegan: document.getElementById('vegan').checked,
      glutenFree: document.getElementById('glutenFree').checked,
      dairyFree: document.getElementById('dairyFree').checked,
      nutFree: document.getElementById('nutFree').checked
    },
    accessibility: {
      audioOutput: audioOutput.checked,
      audioSpeed: formData.get('audioSpeed')
    },
    language: currentLanguage
  };
  
  // In a real application, you would send this data to the server
  console.log('Profile data:', profileData);
  
  // Show success message
  alert(currentLanguage === 'en' ? 
    'Profile saved successfully!' : 
    'प्रोफ़ाइल सफलतापूर्वक सहेजी गई!');
    
  // If audio is enabled, announce success
  if (audioOutput.checked && speechSynthesis) {
    speakText(currentLanguage === 'en' ? 
      'Profile saved successfully!' : 
      'प्रोफ़ाइल सफलतापूर्वक सहेजी गई!');
  }
  function saveProfile(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(profileForm);
    const profileData = {
      personalInfo: {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        birthdate: formData.get('birthdate')
      },
      dietaryPreferences: {
        vegetarian: document.getElementById('vegetarian').checked,
        vegan: document.getElementById('vegan').checked,
        glutenFree: document.getElementById('glutenFree').checked,
        dairyFree: document.getElementById('dairyFree').checked,
        nutFree: document.getElementById('nutFree').checked
      },
      accessibility: {
        audioOutput: audioOutput.checked,
        audioSpeed: formData.get('audioSpeed')
      },
      language: currentLanguage
    };
    
    // In a real application, you would send this data to the server
    console.log('Profile data:', profileData);
    
    // Show success message
    alert(currentLanguage === 'en' ? 
      'Profile saved successfully!' : 
      'प्रोफ़ाइल सफलतापूर्वक सहेजी गई!');
      
    // If audio is enabled, announce success
    if (audioOutput.checked && speechSynthesis) {
      speakText(currentLanguage === 'en' ? 
        'Profile saved successfully!' : 
        'प्रोफ़ाइल सफलतापूर्वक सहेजी गई!');
    }
    
    // NEW CODE: Redirect to home.html after a short delay 
    // The delay allows users to see the success message and hear the audio if enabled
    setTimeout(function() {
      window.location.href = 'home.html';
    }, 1500); // 1.5 second delay before redirect
  }
  
}

// Reset form
function resetForm() {
  profileForm.reset();
  audioSettingsContainer.style.display = 'none';
  currentLanguage = 'en';
  updateLanguage();
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', init);