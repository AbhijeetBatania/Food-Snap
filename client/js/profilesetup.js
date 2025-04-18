// DOM elements
let profileForm;
let audioOutput;
let audioSettingsContainer;
let languageBtn;
let languagePopup;
let closeLanguagePopup;
let languageButtons;
let cancelBtn;
let saveBtn;
let successPopup;
let successCloseBtn;
let otherDiet;
let otherDietContainer;

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
    otherDiet: "Other",
    pleaseSpecify: "Please specify:",
    accessibility: "Accessibility Setup",
    audioOutput: "Enable Audio Output",
    audioSpeed: "Audio Speed",
    languagePreferences: "Language Preferences",
    changeLanguage: "Change Language",
    selectLanguage: "Select Language",
    cancel: "Skip",
    save: "Save Profile",
    close: "Close",
    success: "Success!",
    profileSaved: "Profile saved successfully!",
    ok: "OK"
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
    otherDiet: "अन्य",
    pleaseSpecify: "कृपया निर्दिष्ट करें:",
    accessibility: "पहुंच सेटअप",
    audioOutput: "ऑडियो आउटपुट सक्षम करें",
    audioSpeed: "ऑडियो गति",
    languagePreferences: "भाषा प्राथमिकताएँ",
    changeLanguage: "भाषा बदलें",
    selectLanguage: "भाषा चुनें",
    cancel: "रद्द करें",
    save: "प्रोफाइल सहेजें",
    close: "बंद करें",
    success: "सफलता!",
    profileSaved: "प्रोफ़ाइल सफलतापूर्वक सहेजी गई!",
    ok: "ठीक है"
  }
};

// Hide success popup before any DOM manipulation
document.addEventListener('DOMContentLoaded', function() {
  // Immediately hide the success popup
  const successPopup = document.getElementById('successPopup');
  if (successPopup) {
    successPopup.style.display = 'none';
    successPopup.classList.add('hidden');
  }
  
  // Continue with normal initialization
  init();
});

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
  saveBtn = document.getElementById('saveBtn');
  successPopup = document.getElementById('successPopup');
  successCloseBtn = document.getElementById('successCloseBtn');
  otherDiet = document.getElementById('otherDiet');
  otherDietContainer = document.getElementById('otherDietContainer');
  
  // Make absolutely sure the success popup is hidden on load
  // Use both CSS class and direct style property
  successPopup.classList.add('hidden');
  successPopup.style.display = 'none';
  
  // Hide audio settings by default
  audioSettingsContainer.style.display = 'none';
  
  // Event listeners
  audioOutput.addEventListener('change', toggleAudioSettings);
  languageBtn.addEventListener('click', showLanguagePopup);
  closeLanguagePopup.addEventListener('click', hideLanguagePopup);
  otherDiet.addEventListener('change', toggleOtherDietField);
  
  // Language selection
  languageButtons.forEach(button => {
    button.addEventListener('click', () => {
      currentLanguage = button.getAttribute('data-lang');
      updateLanguage();
      hideLanguagePopup();
    });
  });
  
  // Save button - this should trigger the popup
  saveBtn.addEventListener('click', saveProfile);
  
  // Success popup close button
  successCloseBtn.addEventListener('click', () => {
    hideSuccessPopup();
    // Redirect to home page after closing success popup
    window.location.href = 'home.html';
  });
  
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

// Toggle other diet text field visibility
function toggleOtherDietField() {
  otherDietContainer.style.display = otherDiet.checked ? 'block' : 'none';
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
  const rect = languageBtn.getBoundingClientRect();
  languagePopup.style.top = (rect.bottom + 10) + 'px';
  languagePopup.style.left = rect.left + 'px';
}

// Hide language popup
function hideLanguagePopup() {
  languagePopup.classList.add('hidden');
}

// Show success popup
function showSuccessPopup() {
  successPopup.classList.remove('hidden');
  successPopup.style.display = 'flex';
}

// Hide success popup
function hideSuccessPopup() {
  successPopup.classList.add('hidden');
  successPopup.style.display = 'none';
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
  document.querySelector('label[for="otherDiet"]').textContent = trans.otherDiet;
  document.querySelector('label[for="otherDietText"]').textContent = trans.pleaseSpecify;
  
  document.querySelector('label[for="audioOutput"]').textContent = trans.audioOutput;
  document.querySelector('label[for="audioSpeed"]').textContent = trans.audioSpeed;
  
  languageBtn.textContent = trans.changeLanguage;
  document.querySelector('#languagePopup h3').textContent = trans.selectLanguage;
  closeLanguagePopup.textContent = trans.close;
  
  cancelBtn.textContent = trans.cancel;
  saveBtn.textContent = trans.save;
  
  // Update success popup text
  document.querySelector('#successPopup h3').textContent = trans.success;
  document.querySelector('#successMessage').textContent = trans.profileSaved;
  successCloseBtn.textContent = trans.ok;
  
  // If audio is enabled, announce language change
  if (audioOutput.checked && speechSynthesis) {
    speakText(currentLanguage === 'en' ? 
      'Language changed to English' : 
      'भाषा हिंदी में बदल दी गई है');
  }
}

// Save profile data
function saveProfile() {
  // Validate form if required fields exist
  if (document.getElementById('fullName').value === '') {
    alert(currentLanguage === 'en' ? 
      'Please fill in all required fields.' : 
      'कृपया सभी आवश्यक फ़ील्ड भरें।');
    return;
  }

  // Get form data
  const profileData = {
    personalInfo: {
      fullName: document.getElementById('fullName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      birthdate: document.getElementById('birthdate').value
    },
    dietaryPreferences: {
      vegetarian: document.getElementById('vegetarian').checked,
      vegan: document.getElementById('vegan').checked,
      glutenFree: document.getElementById('glutenFree').checked,
      dairyFree: document.getElementById('dairyFree').checked,
      nutFree: document.getElementById('nutFree').checked,
      other: document.getElementById('otherDiet').checked,
      otherSpecified: document.getElementById('otherDietText').value
    },
    accessibility: {
      audioOutput: audioOutput.checked,
      audioSpeed: document.getElementById('audioSpeed').value
    },
    language: currentLanguage
  };
  
  // In a real application, you would send this data to the server
  console.log('Profile data:', profileData);
  
  // Show success popup
  showSuccessPopup();
  
  // If audio is enabled, announce success
  if (audioOutput.checked && speechSynthesis) {
    speakText(translations[currentLanguage].profileSaved);
  }
}

// Reset form
function resetForm() {
  profileForm.reset();
  audioSettingsContainer.style.display = 'none';
  otherDietContainer.style.display = 'none';
  currentLanguage = 'en';
  updateLanguage();
}
