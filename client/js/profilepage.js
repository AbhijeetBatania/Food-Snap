// DOM Elements
const editProfileBtn = document.getElementById('edit-profile-btn');
const editProfileModal = document.getElementById('edit-profile-modal');
const closeModalButtons = document.querySelectorAll('.close-modal');
const cancelBtn = document.querySelector('.cancel-btn');
const saveBtn = document.querySelector('.save-btn');
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

// User data object to store profile information
let userData = {
    name: localStorage.getItem('userName') || 'Enter Name',
    email: localStorage.getItem('userEmail') || '',
    phone: localStorage.getItem('userPhone') || '',
    dob: localStorage.getItem('userDob') || '',
    photoUrl: localStorage.getItem('userPhotoUrl') || '/public/default-avatar.png',
    fontSize: parseInt(localStorage.getItem('fontSize')) || 16,
    darkMode: localStorage.getItem('darkMode') === 'true',
    audioEnabled: localStorage.getItem('audioEnabled') === 'true',
    language: localStorage.getItem('language') || 'en'
};

// Initialize UI based on saved data
function initializeUI() {
    // Set profile data
    profileName.textContent = userData.name;
    profilePhoto.src = userData.photoUrl;
    photoPreview.src = userData.photoUrl;
    
    // Set font size
    fontSizeIndicator.textContent = userData.fontSize;
    document.documentElement.style.fontSize = `${userData.fontSize}px`;
    
    // Set dark mode
    if (userData.darkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
    
    // Set audio toggle
    audioToggle.checked = userData.audioEnabled;
    
    // Set language
    languageButtons.forEach(btn => {
        if (btn.dataset.lang === userData.language) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Set form values
    editNameInput.value = userData.name !== 'Enter Name' ? userData.name : '';
    editEmailInput.value = userData.email;
    editPhoneInput.value = userData.phone;
    editDobInput.value = userData.dob;
}

// Save user data to localStorage
function saveUserData() {
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userPhone', userData.phone);
    localStorage.setItem('userDob', userData.dob);
    localStorage.setItem('userPhotoUrl', userData.photoUrl);
    localStorage.setItem('fontSize', userData.fontSize);
    localStorage.setItem('darkMode', userData.darkMode);
    localStorage.setItem('audioEnabled', userData.audioEnabled);
    localStorage.setItem('language', userData.language);
}

// Modal functions
function openModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

function closeModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// Event Listeners
// Edit Profile Button
editProfileBtn.addEventListener('click', () => {
    // Update form fields with current values
    editNameInput.value = userData.name !== 'Enter Name' ? userData.name : '';
    editEmailInput.value = userData.email;
    editPhoneInput.value = userData.phone;
    editDobInput.value = userData.dob;
    openModal(editProfileModal);
});

// Close Modal Buttons
closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        closeModal(modal);
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target);
    }
});

// Cancel Button in Edit Profile
cancelBtn.addEventListener('click', () => {
    closeModal(editProfileModal);
});

// Save Profile Changes
document.getElementById('edit-profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Update user data
    userData.name = editNameInput.value || 'Enter Name';
    userData.email = editEmailInput.value;
    userData.phone = editPhoneInput.value;
    userData.dob = editDobInput.value;
    
    // Update UI
    profileName.textContent = userData.name;
    
    // Save to localStorage
    saveUserData();
    
    // Close modal
    closeModal(editProfileModal);
});

// Photo upload
photoOverlay.addEventListener('click', () => {
    photoUpload.click();
});

photoUpload.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const newPhotoUrl = e.target.result;
            userData.photoUrl = newPhotoUrl;
            profilePhoto.src = newPhotoUrl;
            photoPreview.src = newPhotoUrl;
            saveUserData();
        };
        
        reader.readAsDataURL(e.target.files[0]);
    }
});

// Font size controls
decreaseFontBtn.addEventListener('click', () => {
    if (userData.fontSize > 12) {
        userData.fontSize -= 1;
        fontSizeIndicator.textContent = userData.fontSize;
       document.documentElement.style.fontSize = `${userData.fontSize}px`;
        saveUserData();
    }
});

increaseFontBtn.addEventListener('click', () => {
    if (userData.fontSize < 24) {
        userData.fontSize += 1;
        fontSizeIndicator.textContent = userData.fontSize;
        document.documentElement.style.fontSize = `${userData.fontSize}px`;
        saveUserData();
    }
});

// Dark mode toggle
darkModeToggle.addEventListener('change', () => {
    userData.darkMode = darkModeToggle.checked;
    if (userData.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    saveUserData();
});

// Audio toggle
audioToggle.addEventListener('change', () => {
    userData.audioEnabled = audioToggle.checked;
    saveUserData();
});

// Language selector
languageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        languageButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        userData.language = btn.dataset.lang;
        saveUserData();
        
        // Here you would implement language change functionality
        // For example, loading translations from a JSON file
        // This is just a placeholder for demonstration
        if (userData.language === 'hi') {
            // Example of how you might update some text elements
            document.querySelector('header h1').textContent = 'प्रोफाइल';
            editProfileBtn.textContent = 'प्रोफाइल संपादित करें';
            // Add more translations as needed
        } else {
            document.querySelector('header h1').textContent = 'Profile';
            editProfileBtn.textContent = 'Edit Profile';
            // Reset other translations
        }
    });
});

// Support Chat Functionality
supportBtn.addEventListener('click', () => {
    openModal(supportModal);
});

document.getElementById('close-support').addEventListener('click', () => {
    closeModal(supportModal);
});

sendChatBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Simulate response (in a real app, this would be an API call)
        setTimeout(() => {
            const responses = [
                "Thanks for reaching out! How can I help you with Food-Snap today?",
                "I understand your concern. Let me check that for you.",
                "That's a great question about our app. The feature you're looking for can be found in the home screen.",
                "I'll escalate this issue to our technical team. They'll get back to you soon."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, 'support');
        }, 1000);
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    
    const messagePara = document.createElement('p');
    messagePara.textContent = text;
    
    const timeSpan = document.createElement('span');
    timeSpan.classList.add('message-time');
    timeSpan.textContent = getTimeString();
    
    messageDiv.appendChild(messagePara);
    messageDiv.appendChild(timeSpan);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
}

function getTimeString() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    return `${hours}:${minutes} ${ampm}`;

}

// Handle dietary preferences checkboxes
const dietaryCheckboxes = document.querySelectorAll('input[name="dietary"]');
dietaryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        // In a real app, you would store these preferences
        // For now, we'll just console.log them
        const selectedPreferences = Array.from(dietaryCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.id);
        console.log('Selected dietary preferences:', selectedPreferences);
        
        // You could store these in userData and localStorage if needed
    });
});

// Initialize the UI when the page loads
document.addEventListener('DOMContentLoaded', initializeUI);

// Handle mobile responsiveness for modals
function adjustModalForMobile() {
    const modalContents = document.querySelectorAll('.modal-content');
    if (window.innerWidth < 768) {
        modalContents.forEach(content => {
            content.style.width = '95%';
            content.style.maxHeight = '80vh';
        });
    } else {
        modalContents.forEach(content => {
            content.style.width = '90%';
            content.style.maxHeight = '90vh';
        });
    }
}

// Run on page load and window resize
window.addEventListener('resize', adjustModalForMobile);
adjustModalForMobile();