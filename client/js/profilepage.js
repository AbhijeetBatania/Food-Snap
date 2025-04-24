// profilepage.js (updated)

import { auth, db } from '../js/firebase-init.js';
import {
  doc,
  getDoc,
  setDoc
} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';
import {
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';

const editProfileBtn = document.getElementById('edit-profile-btn');
const editProfileModal = document.getElementById('edit-profile-modal');
const closeModalButtons = document.querySelectorAll('.close-modal');
const cancelBtn = document.querySelector('.cancel-btn');
const profileName = document.getElementById('profile-name');
const editNameInput = document.getElementById('edit-name');
const editEmailInput = document.getElementById('edit-email');
const editPhoneInput = document.getElementById('edit-phone');
const editDobInput = document.getElementById('edit-dob');
const fontSizeIndicator = document.getElementById('font-size');
const decreaseFontBtn = document.getElementById('decrease-font');
const increaseFontBtn = document.getElementById('increase-font');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const audioToggle = document.getElementById('audio-toggle');
const photoOverlay = document.getElementById('photo-overlay');
const photoUpload = document.getElementById('photo-upload');
const profilePhoto = document.getElementById('profile-photo');
const photoPreview = document.getElementById('photo-preview');
const languageButtons = document.querySelectorAll('.language-btn');
const supportBtn = document.getElementById('support-btn');
const supportModal = document.getElementById('support-modal');
const chatInput = document.getElementById('chat-input-field');
const sendChatBtn = document.getElementById('send-chat');
const chatMessages = document.getElementById('chat-messages');
const saveBtn = document.querySelector('.save-btn');

let currentUserId = null;

const dietaryCheckboxes = document.querySelectorAll('input[name="dietary"]');

function initializeUI() {
  // font, dark mode, etc
  const storedFont = parseInt(localStorage.getItem('fontSize')) || 16;
  fontSizeIndicator.textContent = storedFont;
  document.documentElement.style.fontSize = `${storedFont}px`;

  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
  }

  audioToggle.checked = localStorage.getItem('audioEnabled') === 'true';

  const lang = localStorage.getItem('language') || 'en';
  languageButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function openModal(modal) {
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

function fetchAndRenderProfile() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUserId = user.uid;
      const ref = doc(db, 'users', currentUserId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        profileName.textContent = data.fullName || 'Enter Name';
        editNameInput.value = data.fullName || '';
        editEmailInput.value = data.email || '';
        editPhoneInput.value = data.phone || '';
        editDobInput.value = data.birthdate || '';

        const prefs = data.dietaryPreferences || [];
        dietaryCheckboxes.forEach(cb => {
          cb.checked = prefs.includes(cb.id);
        });
      }
    }
  });
}

function saveProfileToFirestore() {
  if (!currentUserId) return;

  const dietaryPrefs = Array.from(dietaryCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.id);

  const profileData = {
    fullName: editNameInput.value,
    email: editEmailInput.value,
    phone: editPhoneInput.value,
    birthdate: editDobInput.value,
    dietaryPreferences: dietaryPrefs,
  };

  const ref = doc(db, 'users', currentUserId);
  setDoc(ref, profileData, { merge: true })
    .then(() => {
      profileName.textContent = profileData.fullName;
      closeModal(editProfileModal);
      alert('Profile updated successfully.');
    })
    .catch((err) => {
      console.error('Error updating profile:', err);
      alert('Something went wrong while updating profile.');
    });
}

editProfileBtn.addEventListener('click', () => {
  openModal(editProfileModal);
});

closeModalButtons.forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.closest('.modal')));
});

cancelBtn.addEventListener('click', () => closeModal(editProfileModal));
saveBtn.addEventListener('click', (e) => {
  e.preventDefault();
  saveProfileToFirestore();
});

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) closeModal(e.target);
});

darkModeToggle.addEventListener('change', () => {
  const isDark = darkModeToggle.checked;
  document.body.classList.toggle('dark-mode', isDark);
  localStorage.setItem('darkMode', isDark);
});

decreaseFontBtn.addEventListener('click', () => {
  let size = parseInt(fontSizeIndicator.textContent);
  if (size > 12) {
    size--;
    fontSizeIndicator.textContent = size;
    document.documentElement.style.fontSize = `${size}px`;
    localStorage.setItem('fontSize', size);
  }
});

increaseFontBtn.addEventListener('click', () => {
  let size = parseInt(fontSizeIndicator.textContent);
  if (size < 24) {
    size++;
    fontSizeIndicator.textContent = size;
    document.documentElement.style.fontSize = `${size}px`;
    localStorage.setItem('fontSize', size);
  }
});

audioToggle.addEventListener('change', () => {
  localStorage.setItem('audioEnabled', audioToggle.checked);
});

languageButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    languageButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    localStorage.setItem('language', btn.dataset.lang);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  initializeUI();
  fetchAndRenderProfile();
});
