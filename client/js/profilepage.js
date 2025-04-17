document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeBtn = document.querySelector('.close-btn');
    const cancelBtn = document.getElementById('cancelBtn');
    const profileForm = document.getElementById('profileForm');
    const profilePhotoUpload = document.getElementById('profilePhotoUpload');
    const profilePreview = document.getElementById('profilePreview');
    const profileImage = document.getElementById('profileImage');
    const nameInput = document.getElementById('nameInput');
    const displayName = document.getElementById('displayName');
    const dobInput = document.getElementById('dobInput');
    const displayDOB = document.getElementById('displayDOB');
    const emailInput = document.getElementById('emailInput');
    const displayEmail = document.getElementById('displayEmail');
    const dietaryCheckboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
    const dietaryPrefsList = document.getElementById('dietaryPrefsList');
    
    // Accessibility Elements
    const darkModeToggle = document.getElementById('darkModeToggle');
    const audioOption = document.getElementById('audioOption');
    const decreaseFontBtn = document.getElementById('decreaseFontBtn');
    const resetFontBtn = document.getElementById('resetFontBtn');
    const increaseFontBtn = document.getElementById('increaseFontBtn');
    const languageSelect = document.getElementById('languageSelect');
    
    // Demo Statistics - Would normally be fetched from a database
    const stats = {
        totalScans: 42,
        monthlyScans: 12,
        redFlags: 5,
        greenFlags: 37
    };
    
    // Initialize UI
    function initUI() {
        loadUserProfile();
        updateStatistics();
        loadAccessibilitySettings();
    }

    // Load user profile from localStorage or use defaults
    function loadUserProfile() {
        const storedProfile = JSON.parse(localStorage.getItem('userProfile')) || {
            name: 'User Name',
            email: 'user@example.com',
            dob: '2000-01-01',
            photo: null,
            dietaryPrefs: ['Vegetarian']
        };
        
        // Update display elements
        displayName.textContent = storedProfile.name;
        displayEmail.textContent = storedProfile.email;
        
        // Format date for display
        const dobDate = new Date(storedProfile.dob);
        const formattedDOB = `Date of Birth: ${dobDate.toLocaleDateString()}`;
        displayDOB.textContent = formattedDOB;
        
        // Update form inputs
        nameInput.value = storedProfile.name;
        emailInput.value = storedProfile.email;
        dobInput.value = storedProfile.dob;
        
        // Set profile image if available
        if (storedProfile.photo) {
            profileImage.src = storedProfile.photo;
            profilePreview.src = storedProfile.photo;
        }
        
        // Update dietary preferences
        updateDietaryPrefsDisplay(storedProfile.dietaryPrefs);
        
        // Update checkboxes in form
        dietaryCheckboxes.forEach(checkbox => {
            checkbox.checked = storedProfile.dietaryPrefs.includes(checkbox.id.charAt(0).toUpperCase() + checkbox.id.slice(1));
        });
    }

    // Update dietary preferences display
    function updateDietaryPrefsDisplay(prefs) {
        dietaryPrefsList.innerHTML = '';
        if (prefs.length === 0) {
            dietaryPrefsList.innerHTML = '<li>None specified</li>';
            return;
        }
        
        prefs.forEach(pref => {
            const li = document.createElement('li');
            li.textContent = pref;
            dietaryPrefsList.appendChild(li);
        });
    }
    
    // Update statistics display
    function updateStatistics() {
        document.getElementById('totalScans').textContent = stats.totalScans;
        document.getElementById('monthlyScans').textContent = stats.monthlyScans;
        document.getElementById('redFlags').textContent = stats.redFlags;
        document.getElementById('greenFlags').textContent = stats.greenFlags;
    }
    
    // Load accessibility settings
    function loadAccessibilitySettings() {
        const settings = JSON.parse(localStorage.getItem('accessibilitySettings')) || {
            darkMode: false,
            audioOutput: false,
            fontSize: 'normal',
            language: 'en'
        };
        
        // Apply dark mode
        if (settings.darkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }
        
        // Set audio option
        audioOption.checked = settings.audioOutput;
        
        // Set font size
        document.body.classList.add(`font-size-${settings.fontSize}`);
        
        // Set language
        languageSelect.value = settings.language;
        
        // Apply language translations if needed
        if (settings.language === 'hi') {
            translateToHindi();
        }
    }
    
    // Save profile changes
    function saveProfile() {
        const dietaryPrefs = [];
        dietaryCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                dietaryPrefs.push(checkbox.id.charAt(0).toUpperCase() + checkbox.id.slice(1));
            }
        });
        
        const profile = {
            name: nameInput.value,
            email: emailInput.value,
            dob: dobInput.value,
            photo: profilePreview.src,
            dietaryPrefs: dietaryPrefs
        };
        
        localStorage.setItem('userProfile', JSON.stringify(profile));
        loadUserProfile();
    }
    
    // Save accessibility settings
    function saveAccessibilitySettings(settings) {
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    }
    
    // Toggle modal
    function toggleModal() {
        editProfileModal.style.display = editProfileModal.style.display === 'block' ? 'none' : 'block';
    }
    
    // Event Listeners
    
    // Edit Profile Button
    editProfileBtn.addEventListener('click', toggleModal);
    
    // Close modal
    closeBtn.addEventListener('click', toggleModal);
    cancelBtn.addEventListener('click', toggleModal);
    
    // Close modal if clicked outside
    window.addEventListener('click', function(event) {
        if (event.target === editProfileModal) {
            toggleModal();
        }
    });
    
    // Profile form submission
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProfile();
        toggleModal();
    });
    
    // Profile photo upload
    profilePhotoUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Dark mode toggle
    darkModeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode');
        const settings = JSON.parse(localStorage.getItem('accessibilitySettings')) || {};
        settings.darkMode = this.checked;
        saveAccessibilitySettings(settings);
    });
    
    // Audio option toggle
    audioOption.addEventListener('change', function() {
        const settings = JSON.parse(localStorage.getItem('accessibilitySettings')) || {};
        settings.audioOutput = this.checked;
        saveAccessibilitySettings(settings);
        
        // Demo text-to-speech when enabled
        if (this.checked) {
            speakText('Audio output is now enabled');
        }
    });
    
    // Font size controls
    decreaseFontBtn.addEventListener('click', function() {
        document.body.classList.remove('font-size-normal', 'font-size-large');
        document.body.classList.add('font-size-small');
        const settings = JSON.parse(localStorage.getItem('accessibilitySettings')) || {};
        settings.fontSize = 'small';
        saveAccessibilitySettings(settings);
    });
    
    resetFontBtn.addEventListener('click', function() {
        document.body.classList.remove('font-size-small', 'font-size-large');
        document.body.classList.add('font-size-normal');
        const settings = JSON.parse(localStorage.getItem('accessibilitySettings')) || {};
        settings.fontSize = 'normal';
        saveAccessibilitySettings(settings);
    });
    
    increaseFontBtn.addEventListener('click', function() {
        document.body.classList.remove('font-size-small', 'font-size-normal');
        document.body.classList.add('font-size-large');
        const settings = JSON.parse(localStorage.getItem('accessibilitySettings')) || {};
        settings.fontSize = 'large';
        saveAccessibilitySettings(settings);
    });
    
    // Language selection
    languageSelect.addEventListener('change', function() {
        const settings = JSON.parse(localStorage.getItem('accessibilitySettings')) || {};
        settings.language = this.value;
        saveAccessibilitySettings(settings);
        
        if (this.value === 'hi') {
            translateToHindi();
        } else {
            // Reload page to reset to English
            location.reload();
        }
    });
    
// Text-to-speech functionality (demo)
function speakText(text) {
    if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance();
        speech.text = text;
        speech.volume = 1;
        speech.rate = 1;
        speech.pitch = 1;
        
        // Set language based on current selection
        const currentLang = languageSelect.value;
        speech.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';
        
        window.speechSynthesis.speak(speech);
    }
}

// Sample Hindi translations for demo
const hindiTranslations = {
    'Profile': 'प्रोफ़ाइल',
    'Edit Profile': 'प्रोफ़ाइल संपादित करें',
    'User Name': 'उपयोगकर्ता का नाम',
    'Date of Birth': 'जन्म तिथि',
    'Dietary Preferences': 'आहार प्राथमिकताएँ',
    'Vegetarian': 'शाकाहारी',
    'Vegan': 'शुद्ध शाकाहारी',
    'Gluten Free': 'ग्लूटेन मुक्त',
    'Dairy Free': 'डेयरी मुक्त',
    'Nut Free': 'नट मुक्त',
    'Statistics': 'आँकड़े',
    'Total Scans': 'कुल स्कैन',
    'Scans This Month': 'इस महीने के स्कैन',
    'Red Flags': 'लाल झंडे',
    'Green Flags': 'हरे झंडे',
    'Accessibility Setup': 'अभिगम्यता सेटअप',
    'Audio Output': 'ऑडियो आउटपुट',
    'Font Size': 'फ़ॉन्ट आकार',
    'Language': 'भाषा',
    'Dark Mode': 'डार्क मोड',
    'Save Changes': 'परिवर्तन सहेजें',
    'Cancel': 'रद्द करें',
    'Change Photo': 'फोटो बदलें',
    'Name': 'नाम',
    'Email Address': 'ईमेल पता',
    'None specified': 'कोई निर्दिष्ट नहीं'
};

// Basic translation function for demo purposes
function translateToHindi() {
    // Find all elements with text and translate if in dictionary
    document.querySelectorAll('h1, h2, h3, p, button, label, li, option').forEach(el => {
        const originalText = el.textContent.trim();
        if (hindiTranslations[originalText]) {
            el.textContent = hindiTranslations[originalText];
        }
    });
    
    // Update placeholders
    nameInput.placeholder = 'आपका नाम';
    emailInput.placeholder = 'आपका@ईमेल.com';
    
    // Update button text
    editProfileBtn.textContent = hindiTranslations['Edit Profile'];
    saveBtn.textContent = hindiTranslations['Save Changes'];
    cancelBtn.textContent = hindiTranslations['Cancel'];
    
    // Format DOB in Hindi style if needed
    const profile = JSON.parse(localStorage.getItem('userProfile')) || {};
    if (profile.dob) {
        const dobDate = new Date(profile.dob);
        displayDOB.textContent = `${hindiTranslations['Date of Birth']}: ${dobDate.toLocaleDateString('hi-IN')}`;
    }
}

// Generate audio descriptions for statistics
function generateStatsAudio() {
    if (audioOption.checked) {
        const statsText = `You have completed ${stats.totalScans} total scans, with ${stats.monthlyScans} scans this month. You have marked ${stats.redFlags} red flags and ${stats.greenFlags} green flags.`;
        speakText(statsText);
    }
}

// Add listeners for stats section to read out loud when clicked if audio is enabled
document.querySelector('.statistics-container').addEventListener('click', generateStatsAudio);

// Initialize the UI when the page loads
initUI();

// Check if service worker is supported for offline capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// Simulate loading profile data from a server
function simulateProfileFetch() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                name: 'User Name',
                email: 'user@example.com',
                dob: '2000-01-01',
                dietaryPrefs: ['Vegetarian'],
                stats: {
                    totalScans: 42,
                    monthlyScans: 12,
                    redFlags: 5,
                    greenFlags: 37
                }
            });
        }, 500);
    });
}

// Additional function to handle form validation
function validateForm() {
    let isValid = true;
    
    // Validate name
    if (nameInput.value.trim() === '') {
        showError(nameInput, 'Name is required');
        isValid = false;
    } else {
        removeError(nameInput);
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
    } else {
        removeError(emailInput);
    }
    
    // Validate DOB
    if (dobInput.value === '') {
        showError(dobInput, 'Date of Birth is required');
        isValid = false;
    } else {
        const today = new Date();
        const birthDate = new Date(dobInput.value);
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 13) {
            showError(dobInput, 'You must be at least 13 years old');
            isValid = false;
        } else {
            removeError(dobInput);
        }
    }
    
    return isValid;
}

// Show error message
function showError(input, message) {
    const formGroup = input.parentElement;
    let errorElement = formGroup.querySelector('.error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = 'var(--error-color)';
        errorElement.style.fontSize = 'var(--font-size-small)';
        errorElement.style.marginTop = '4px';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    input.style.borderColor = 'var(--error-color)';
}

// Remove error message
function removeError(input) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
        formGroup.removeChild(errorElement);
    }
    
    input.style.borderColor = '';
}

// Add validation to form submission
profileForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
        saveProfile();
        toggleModal();
        
        // Show success notification
        showNotification('Profile updated successfully!', 'success');
    }
});

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = 'var(--border-radius)';
    notification.style.backgroundColor = type === 'success' ? 'var(--success-color)' : 'var(--primary-color)';
    notification.style.color = 'white';
    notification.style.boxShadow = 'var(--shadow)';
    notification.style.zIndex = '9999';
    notification.style.transition = 'all 0.3s ease';
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
});