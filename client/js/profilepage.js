import { auth, db } from './firebase-init.js';
import {
  doc,
  getDoc,
  setDoc
} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';
import {
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';

// DOM Elements
const profileName = document.getElementById('profile-name');
const profilePhoto = document.getElementById('profile-photo');
const photoPreview = document.getElementById('photo-preview');
const photoUpload = document.getElementById('photo-upload');
const photoOverlay = document.getElementById('photo-overlay');

const editProfileBtn = document.getElementById('edit-profile-btn');
const editProfileModal = document.getElementById('edit-profile-modal');
const closeModalButtons = document.querySelectorAll('.close-modal');
const cancelBtn = document.querySelector('.cancel-btn');
const saveBtn = document.querySelector('.save-btn');

const editNameInput = document.getElementById('edit-name');
const editEmailInput = document.getElementById('edit-email');
const editPhoneInput = document.getElementById('edit-phone');
const editDobInput = document.getElementById('edit-dob');
const editGenderInput = document.getElementById('edit-gender');
const editAgeInput = document.getElementById('edit-age');
const editHeightInput = document.getElementById('edit-height');
const editWeightInput = document.getElementById('edit-weight');
const editActivityInput = document.getElementById('edit-activity');

const fontSizeIndicator = document.getElementById('font-size');
const decreaseFontBtn = document.getElementById('decrease-font');
const increaseFontBtn = document.getElementById('increase-font');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const audioToggle = document.getElementById('audio-toggle');
const languageButtons = document.querySelectorAll('.language-btn');

const supportBtn = document.getElementById('support-btn');
const supportModal = document.getElementById('support-modal');
const closeSupport = document.getElementById('close-support');
const chatInput = document.getElementById('chat-input-field');
const sendChatBtn = document.getElementById('send-chat');
const chatMessages = document.getElementById('chat-messages');

const detailGender = document.getElementById('detail-gender');
const detailAge = document.getElementById('detail-age');
const detailHeight = document.getElementById('detail-height');
const detailWeight = document.getElementById('detail-weight');
const detailActivity = document.getElementById('detail-activity');

const needFields = {
  energy: document.getElementById('need-energy'),
  fat: document.getElementById('need-fat'),
  sodium: document.getElementById('need-sodium'),
  carbs: document.getElementById('need-carbs'),
  sugar: document.getElementById('need-sugar'),
  protein: document.getElementById('need-protein'),
  fiber: document.getElementById('need-fiber'),
  iron: document.getElementById('need-iron')
};

let uid = null;
let currentProfileData = {}; // 🔁 Used to revert modal if canceled

// Auth
onAuthStateChanged(auth, async user => {
  if (user) {
    uid = user.uid;
    const docRef = doc(db, 'users', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      loadProfile(snap.data());
    }
  }
});

// Load into UI
function loadProfile(data) {
  currentProfileData = { ...data };

  profileName.textContent = data.fullName || 'Enter Name';
  profilePhoto.src = localStorage.getItem('userPhotoUrl') || '/public/default-avatar.png';
  photoPreview.src = profilePhoto.src;

  populateEditForm(data);

  detailGender.textContent = data.gender || 'Not Set';
  detailAge.textContent = data.age || '--';
  detailHeight.textContent = data.height ? `${data.height} cm` : '-- cm';
  detailWeight.textContent = data.weight ? `${data.weight} kg` : '-- kg';
  detailActivity.textContent = data.activityLevel || 'Not Set';

  calculateNeeds(data.gender, data.age, data.height, data.weight, data.activityLevel);
}

// Populate Edit Form
function populateEditForm(data) {
  editNameInput.value = data.fullName || '';
  editEmailInput.value = data.email || '';
  editPhoneInput.value = data.phone || '';
  editDobInput.value = data.birthdate || '';
  editGenderInput.value = data.gender || '';
  editAgeInput.value = data.age || '';
  editHeightInput.value = data.height || '';
  editWeightInput.value = data.weight || '';
  editActivityInput.value = data.activityLevel || '';
}

// Daily Needs Calculation
function calculateNeeds(gender, age, height, weight, activityLevel) {
  if (!height || !weight || !age || !gender) return;

  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very-active': 1.9
  };

  const BMR = gender === 'female'
    ? 10 * weight + 6.25 * height - 5 * age - 161
    : 10 * weight + 6.25 * height - 5 * age + 5;

  const multiplier = multipliers[activityLevel] || 1.2;
  const calories = BMR * multiplier;

  function getSodiumNeed(age) {
    if (age <= 3) return 1000;
    if (age <= 8) return 1200;
    if (age <= 13) return 1500;
    return 1500; // Ideal adult sodium intake
  }  

  const dailyNeeds = {
    energy: `${Math.round(calories)} kcal`,
    protein: `${Math.round(weight * 1.6)} g`,
    fat: `${Math.round((0.25 * calories) / 9)} g`,
    sodium: `${getSodiumNeed(age)} mg`,
    carbs: `${Math.round((0.5 * calories) / 4)} g`,
    sugar: `${Math.round((0.1 * calories) / 4)} g`,
    fiber: `14 g`,
    iron: gender === 'female' ? '18 mg' : '8 mg'
  };

  Object.entries(dailyNeeds).forEach(([key, value]) => {
    if (needFields[key]) {
      needFields[key].textContent = value;
    }
  });

  // 🧠 Save to Firestore silently
  if (uid) {
    setDoc(doc(db, 'users', uid), {
      dailyNeeds: dailyNeeds,
      timestamp: new Date().toISOString()
    }, { merge: true });
  }
}

// Edit Modal
function openModal(modal) {
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeModal(modal) {
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

// Button Listeners
editProfileBtn.addEventListener('click', () => {
  populateEditForm(currentProfileData);
  openModal(editProfileModal);
});
closeModalButtons.forEach(btn =>
  btn.addEventListener('click', () => {
    populateEditForm(currentProfileData);
    closeModal(btn.closest('.modal'));
  })
);
cancelBtn.addEventListener('click', () => {
  populateEditForm(currentProfileData);
  closeModal(editProfileModal);
});

// Save Profile
saveBtn.addEventListener('click', async () => {
  const updatedData = {
    fullName: editNameInput.value,
    email: editEmailInput.value,
    phone: editPhoneInput.value,
    birthdate: editDobInput.value,
    gender: editGenderInput.value,
    age: parseFloat(editAgeInput.value),
    height: parseFloat(editHeightInput.value),
    weight: parseFloat(editWeightInput.value),
    activityLevel: editActivityInput.value
  };

  try {
    await setDoc(doc(db, 'users', uid), {
      ...updatedData,
      timestamp: new Date().toISOString()
    }, { merge: true });

    loadProfile(updatedData);
    closeModal(editProfileModal);
  } catch (err) {
    alert('Error saving profile: ' + err.message);
  }
});

// Photo Upload
photoOverlay.addEventListener('click', () => photoUpload.click());
photoUpload.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    profilePhoto.src = reader.result;
    photoPreview.src = reader.result;
    localStorage.setItem('userPhotoUrl', reader.result);
  };
  reader.readAsDataURL(file);
});

// Font & Mode
increaseFontBtn.addEventListener('click', () => adjustFont(1));
decreaseFontBtn.addEventListener('click', () => adjustFont(-1));
function adjustFont(change) {
  let size = parseInt(fontSizeIndicator.textContent);
  size = Math.min(Math.max(size + change, 12), 24);
  document.documentElement.style.fontSize = `${size}px`;
  fontSizeIndicator.textContent = size;
  localStorage.setItem('fontSize', size);
}
darkModeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode', darkModeToggle.checked);
  localStorage.setItem('darkMode', darkModeToggle.checked);
});
audioToggle.addEventListener('change', () => {
  localStorage.setItem('audioEnabled', audioToggle.checked);
});
languageButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    languageButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    localStorage.setItem('language', btn.dataset.lang);
    // Optional: implement language switching logic
  });
});

// Chat Support
supportBtn.addEventListener('click', () => openModal(supportModal));
closeSupport.addEventListener('click', () => closeModal(supportModal));
sendChatBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') sendMessage();
});
function sendMessage() {
  const msg = chatInput.value.trim();
  if (!msg) return;
  addMessage(msg, 'user');
  chatInput.value = '';
  setTimeout(() => {
    addMessage("Thanks! We'll assist you shortly.", 'support');
  }, 1000);
}
function addMessage(text, sender) {
  const div = document.createElement('div');
  div.className = 'message ' + sender;
  div.innerHTML = `<p>${text}</p><span class="message-time">${getTimeString()}</span>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function getTimeString() {
  const now = new Date();
  let h = now.getHours(), m = now.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
}
