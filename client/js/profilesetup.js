import { auth, db } from '../js/firebase-init.js';
import {
  doc,
  setDoc
} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';
import {
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';

// DOM Elements
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

let currentLanguage = 'en';
let audioContext;
let speechSynthesis;

const translations = {
  en: { /* ...same as before... */ },
  hi: { /* ...same as before... */ }
};

document.addEventListener('DOMContentLoaded', () => {
  successPopup = document.getElementById('successPopup');
  successPopup.classList.add('hidden');
  successPopup.style.display = 'none';
  init();
});

function init() {
  profileForm = document.getElementById('profileForm');
  audioOutput = document.getElementById('audioOutput');
  audioSettingsContainer = document.getElementById('audioSettingsContainer');
  languageBtn = document.getElementById('languageBtn');
  languagePopup = document.getElementById('languagePopup');
  closeLanguagePopup = document.getElementById('closeLanguagePopup');
  languageButtons = document.querySelectorAll('.language-btn');
  cancelBtn = document.getElementById('cancelBtn');
  saveBtn = document.getElementById('saveBtn'); // ✅ move this up!
  successPopup = document.getElementById('successPopup');
  successCloseBtn = document.getElementById('successCloseBtn');
  otherDiet = document.getElementById('otherDiet');
  otherDietContainer = document.getElementById('otherDietContainer');

  audioSettingsContainer.style.display = 'none';

  audioOutput.addEventListener('change', toggleAudioSettings);
  otherDiet.addEventListener('change', toggleOtherDietField);

  if (languageBtn) languageBtn.addEventListener('click', showLanguagePopup);
  if (closeLanguagePopup) closeLanguagePopup.addEventListener('click', hideLanguagePopup);

  languageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentLanguage = btn.dataset.lang;
      updateLanguage();
      hideLanguagePopup();
    });
  });

  saveBtn.addEventListener('click', (e) => {
    e.preventDefault(); // ✅ important to prevent form reload
    saveProfile();
  });

  successCloseBtn.addEventListener('click', () => {
    hideSuccessPopup();
    window.location.href = 'home.html';
  });

  cancelBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to cancel?')) resetForm();
  });

  document.addEventListener('click', (e) => {
    if (!languagePopup.classList.contains('hidden') &&
        !languagePopup.contains(e.target) &&
        e.target !== languageBtn) {
      hideLanguagePopup();
    }
  });
}

function toggleOtherDietField() {
  otherDietContainer.style.display = otherDiet.checked ? 'block' : 'none';
}

function toggleAudioSettings() {
  audioSettingsContainer.style.display = audioOutput.checked ? 'block' : 'none';
  if (audioOutput.checked) initializeAudioFeatures();
}

function initializeAudioFeatures() {
  try {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (!speechSynthesis) speechSynthesis = window.speechSynthesis;
  } catch (err) {
    console.error('Audio not supported:', err);
    alert('Audio features not supported.');
    audioOutput.checked = false;
    audioSettingsContainer.style.display = 'none';
  }
}

function speakText(text) {
  if (!speechSynthesis) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = currentLanguage === 'en' ? 'en-US' : 'hi-IN';
  utterance.rate = parseFloat(document.getElementById('audioSpeed').value);
  speechSynthesis.speak(utterance);
}

function showLanguagePopup() {
  languagePopup.classList.remove('hidden');
  const rect = languageBtn.getBoundingClientRect();
  languagePopup.style.top = rect.bottom + 10 + 'px';
  languagePopup.style.left = rect.left + 'px';
}

function hideLanguagePopup() {
  languagePopup.classList.add('hidden');
}

function showSuccessPopup() {
  successPopup.classList.remove('hidden');
  successPopup.style.display = 'flex';
}

function hideSuccessPopup() {
  successPopup.classList.add('hidden');
  successPopup.style.display = 'none';
}

function updateLanguage() {
  const trans = translations[currentLanguage];
  if (!trans) return;

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
  document.querySelector('#successPopup h3').textContent = trans.success;
  document.querySelector('#successMessage').textContent = trans.profileSaved;
  successCloseBtn.textContent = trans.ok;

  if (audioOutput.checked && speechSynthesis) {
    speakText(currentLanguage === 'en' ? 'Language changed to English' : 'भाषा हिंदी में बदल दी गई है');
  }
}

function saveProfile() {
  if (!document.getElementById('fullName').value.trim()) {
    alert(currentLanguage === 'en' ? 'Please fill in all required fields.' : 'कृपया सभी आवश्यक फ़ील्ड भरें।');
    return;
  }

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      console.log("User is not logged in");
      alert("You must be logged in to save your profile.");
      return;
    }

    const dietaryPreferences = ['vegetarian', 'vegan', 'glutenFree', 'dairyFree', 'nutFree', 'otherDiet']
      .filter(id => document.getElementById(id).checked);

    const gender = document.querySelector('input[name="gender"]:checked')?.value || '';
    const age = document.getElementById('age')?.value || '';
    const height = document.getElementById('height')?.value || '';
    const weight = document.getElementById('weight')?.value || '';
    const activityLevel = document.getElementById('activityLevel')?.value || '';

    const profileData = {
      fullName: document.getElementById('fullName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      birthdate: document.getElementById('birthdate').value,
      gender,
      age,
      height,
      weight,
      activityLevel,
      dietaryPreferences,
      otherDietText: document.getElementById('otherDietText')?.value || '',
      accessibility: {
        audioOutput: audioOutput.checked,
        audioSpeed: document.getElementById('audioSpeed').value
      },
      language: currentLanguage,
      timestamp: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'users', user.uid), profileData);
      showSuccessPopup();
      if (audioOutput.checked && speechSynthesis) {
        speakText(translations[currentLanguage].profileSaved);
      }
    } catch (err) {
      console.error('Error saving to Firestore:', err);
      alert('Something went wrong: ' + err.message);
    }
  });
}

function resetForm() {
  profileForm.reset();
  audioSettingsContainer.style.display = 'none';
  otherDietContainer.style.display = 'none';
  currentLanguage = 'en';
  updateLanguage();
}
