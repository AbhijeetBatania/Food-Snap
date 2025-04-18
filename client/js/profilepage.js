document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const profileNameElement = document.getElementById('profile-name');
    const profilePhotoElement = document.getElementById('profile-photo');
    const photoOverlay = document.getElementById('photo-overlay');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const modal = document.getElementById('edit-profile-modal');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const saveBtn = document.querySelector('.save-btn');
    const editProfileForm = document.getElementById('edit-profile-form');
    const photoPreview = document.getElementById('photo-preview');
    const photoUpload = document.getElementById('photo-upload');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    // Form fields
    const editNameInput = document.getElementById('edit-name');
    const editEmailInput = document.getElementById('edit-email');
    const editDobInput = document.getElementById('edit-dob');
    const dietaryPreferences = [
        'non-vegetarian',
        'vegetarian',
        'vegan',
        'gluten-free',
        'dairy-free',
        'nut-free'
    ];
    
    // User data object - initialize with stored values or defaults
    let userData = {
        name: localStorage.getItem('userName') || 'Enter Name',
        email: localStorage.getItem('userEmail') || '',
        dob: localStorage.getItem('userDob') || '',
        profilePhoto: localStorage.getItem('userProfilePhoto') || '../images/default-avatar.png',
        dietary: {}
    };
    
    // Initialize dietary preferences from localStorage
    dietaryPreferences.forEach(pref => {
        userData.dietary[pref] = localStorage.getItem(`dietary_${pref}`) === 'true';
    });
    
    // Initialize profile name and photo
    if (userData.name) {
        profileNameElement.textContent = userData.name;
    }
    
    if (userData.profilePhoto) {
        profilePhotoElement.src = userData.profilePhoto;
        photoPreview.src = userData.profilePhoto;
    }
    
    // Initialize dark mode
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
    
    // Dark mode toggle functionality
    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
        }
    });
    
    // Photo upload handling
    photoUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const photoData = e.target.result;
                photoPreview.src = photoData;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Open edit profile modal from profile photo click
    photoOverlay.addEventListener('click', function() {
        openEditProfileModal();
    });
    
    // Open modal when edit profile button is clicked
    editProfileBtn.addEventListener('click', function() {
        openEditProfileModal();
    });
    
    function openEditProfileModal() {
        // Populate form with current user data
        editNameInput.value = userData.name !== 'Enter Name' ? userData.name : '';
        editEmailInput.value = userData.email;
        editDobInput.value = userData.dob;
        photoPreview.src = userData.profilePhoto;
        
        // Set checkbox states
        dietaryPreferences.forEach(pref => {
            if (document.getElementById(pref)) {
                document.getElementById(pref).checked = userData.dietary[pref];
            }
        });
        
        // Show modal
        modal.classList.add('show');
    }
    
    // Close modal functions
    function closeModalFunction() {
        modal.classList.remove('show');
    }
    
    closeModal.addEventListener('click', closeModalFunction);
    
    cancelBtn.addEventListener('click', closeModalFunction);
    
    // Close modal if clicking outside the content
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModalFunction();
        }
    });
    
    // Save form data
    editProfileForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Update user data object
        userData.name = editNameInput.value.trim() || 'Enter Name';
        userData.email = editEmailInput.value;
        userData.dob = editDobInput.value;
        
        // Update profile photo if changed
        if (photoPreview.src !== userData.profilePhoto) {
            userData.profilePhoto = photoPreview.src;
            profilePhotoElement.src = photoPreview.src;
            localStorage.setItem('userProfilePhoto', userData.profilePhoto);
        }
        
        // Update dietary preferences
        dietaryPreferences.forEach(pref => {
            if (document.getElementById(pref)) {
                userData.dietary[pref] = document.getElementById(pref).checked;
            }
        });
        
        // Save to localStorage
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('userDob', userData.dob);
        
        dietaryPreferences.forEach(pref => {
            localStorage.setItem(`dietary_${pref}`, userData.dietary[pref]);
        });
        
        // Update UI
        profileNameElement.textContent = userData.name;
        
        // Close modal
        closeModalFunction();
        
        // Show success message
        showNotification('Profile updated successfully!');
    });
    
    // Show notification function
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Style notification
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = 'var(--primary-color)';
        notification.style.color = 'white';
        notification.style.padding = '12px 24px';
        notification.style.borderRadius = '25px';
        notification.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
        notification.style.zIndex = '1000';
        
        // Add to body
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
    
    // Font size adjustment
    const decreaseBtn = document.getElementById('decrease-font');
    const increaseBtn = document.getElementById('increase-font');
    const fontSizeIndicator = document.getElementById('font-size');
    let currentFontSize = localStorage.getItem('fontSize') || 16;
    currentFontSize = parseInt(currentFontSize);
    
    // Initialize font size
    fontSizeIndicator.textContent = currentFontSize;
    document.documentElement.style.fontSize = `${currentFontSize}px`;
    
    decreaseBtn.addEventListener('click', function() {
        if (currentFontSize > 12) {
            currentFontSize -= 2;
            updateFontSize();
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        if (currentFontSize < 24) {
            currentFontSize += 2;
            updateFontSize();
        }
    });
    
    function updateFontSize() {
        fontSizeIndicator.textContent = currentFontSize;
        document.documentElement.style.fontSize = `${currentFontSize}px`;
        localStorage.setItem('fontSize', currentFontSize);
    }
    
    // Language selection
    const languageBtns = document.querySelectorAll('.language-btn');
    let currentLanguage = localStorage.getItem('language') || 'en';
    
    // Initialize language
    languageBtns.forEach(btn => {
        if (btn.dataset.lang === currentLanguage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    updateLanguage();
    

            languageBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentLanguage = this.dataset.lang;
            localStorage.setItem('language', currentLanguage);
            updateLanguage();
        });
    ;
    
    function updateLanguage() {
        // Translation object
        const translations = {
            en: {
                profile: "Profile",
                editProfile: "Edit Profile",
                statistics: "Statistics",
                totalScans: "Total Scans",
                scansThisMonth: "Scans this Month",
                redFlags: "Red Flags",
                greenFlags: "Green Flags",
                accessibilitySetup: "Accessibility Setup",
                audioOutput: "Audio Output",
                convertResults: "Convert scan results to audio file",
                darkMode: "Dark Mode",
                darkModeDescription: "Enable dark color theme",
                fontSize: "Font Size",
                language: "Language",
                profilePhoto: "Profile Photo",
                changePhoto: "Change Photo",
                name: "Name",
                email: "Email Address",
                dob: "Date of Birth",
                dietaryPreferences: "Dietary Preferences",
                nonVegetarian: "Non Vegetarian",
                vegetarian: "Vegetarian",
                vegan: "Vegan",
                glutenFree: "Gluten Free",
                dairyFree: "Dairy Free",
                nutFree: "Nut Free",
                save: "Save Changes",
                cancel: "Cancel"
            },
            hi: {
                profile: "प्रोफाइल",
                editProfile: "प्रोफाइल संपादित करें",
                statistics: "आंकड़े",
                totalScans: "कुल स्कैन",
                scansThisMonth: "इस महीने के स्कैन",
                redFlags: "लाल झंडे",
                greenFlags: "हरे झंडे",
                accessibilitySetup: "पहुंच सेटअप",
                audioOutput: "ऑडियो आउटपुट",
                convertResults: "स्कैन परिणामों को ऑडियो फ़ाइल में बदलें",
                darkMode: "डार्क मोड",
                darkModeDescription: "डार्क थीम सक्षम करें",
                fontSize: "फ़ॉन्ट आकार",
                language: "भाषा",
                profilePhoto: "प्रोफाइल चित्र",
                changePhoto: "चित्र बदलें",
                name: "नाम",
                email: "ईमेल पता",
                dob: "जन्म तिथि",
                dietaryPreferences: "आहार प्राथमिकताएँ",
                nonVegetarian: "मांसाहारी",
                vegetarian: "शाकाहारी",
                vegan: "शुद्ध शाकाहारी",
                glutenFree: "ग्लूटेन मुक्त",
                dairyFree: "डेयरी मुक्त",
                nutFree: "नट मुक्त",
                save: "परिवर्तन सहेजें",
                cancel: "रद्द करें"
            }
        };
        
        // Update UI text based on selected language
        document.querySelector('header h1').textContent = translations[currentLanguage].profile;
        document.querySelector('.edit-btn').textContent = translations[currentLanguage].editProfile;
        document.querySelector('.stats-container h2').textContent = translations[currentLanguage].statistics;
        document.querySelectorAll('.stat-label')[0].textContent = translations[currentLanguage].totalScans;
        document.querySelectorAll('.stat-label')[1].textContent = translations[currentLanguage].scansThisMonth;
        document.querySelectorAll('.stat-label')[2].textContent = translations[currentLanguage].redFlags;
        document.querySelectorAll('.stat-label')[3].textContent = translations[currentLanguage].greenFlags;
        document.querySelector('.accessibility-container h2').textContent = translations[currentLanguage].accessibilitySetup;
        
        // Update accessibility options
        const optionTitles = document.querySelectorAll('.option-title');
        optionTitles[0].childNodes[0].textContent = translations[currentLanguage].audioOutput;
        document.querySelectorAll('.option-description')[0].textContent = translations[currentLanguage].convertResults;
        
        optionTitles[1].childNodes[0].textContent = translations[currentLanguage].darkMode;
        document.querySelectorAll('.option-description')[1].textContent = translations[currentLanguage].darkModeDescription;
        
        optionTitles[2].textContent = translations[currentLanguage].fontSize;
        optionTitles[3].textContent = translations[currentLanguage].language;
        
        // Update modal text
        document.querySelector('.modal-header h2').textContent = translations[currentLanguage].editProfile;
        document.querySelector('.photo-upload-container > label').textContent = translations[currentLanguage].profilePhoto;
        document.querySelector('.upload-btn').textContent = translations[currentLanguage].changePhoto;
        document.querySelector('label[for="edit-name"]').textContent = translations[currentLanguage].name;
        document.querySelector('label[for="edit-email"]').textContent = translations[currentLanguage].email;
        document.querySelector('label[for="edit-dob"]').textContent = translations[currentLanguage].dob;
        document.querySelector('.form-group:nth-child(5) > label').textContent = translations[currentLanguage].dietaryPreferences;
        
        // Update dietary preference labels
        document.querySelector('label[for="non-vegetarian"]').textContent = translations[currentLanguage].nonVegetarian;
        document.querySelector('label[for="vegetarian"]').textContent = translations[currentLanguage].vegetarian;
        document.querySelector('label[for="vegan"]').textContent = translations[currentLanguage].vegan;
        document.querySelector('label[for="gluten-free"]').textContent = translations[currentLanguage].glutenFree;
        document.querySelector('label[for="dairy-free"]').textContent = translations[currentLanguage].dairyFree;
        document.querySelector('label[for="nut-free"]').textContent = translations[currentLanguage].nutFree;
        
        document.querySelector('.cancel-btn').textContent = translations[currentLanguage].cancel;
        document.querySelector('.save-btn').textContent = translations[currentLanguage].save;
    }
    
    // Audio output toggle
    const audioToggle = document.getElementById('audio-toggle');
    
    // Initialize audio setting
    if (localStorage.getItem('audioEnabled') === 'true') {
        audioToggle.checked = true;
    }
    
    audioToggle.addEventListener('change', function() {
        localStorage.setItem('audioEnabled', this.checked);
    });

   document.addEventListener('DOMContentLoaded', () => {
  const languageButtons = document.querySelectorAll('.language-btn');

  // Apply saved language on load
  const savedLang = localStorage.getItem('language') || 'en';
  document.body.classList.toggle('hindi-mode', savedLang === 'hi');

  // Update active button state
  languageButtons.forEach(btn => {
    if (btn.dataset.lang === savedLang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Handle button click
  languageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.dataset.lang;

      // Save language preference
      localStorage.setItem('language', selectedLang);

      // Apply Hindi mode class
      document.body.classList.toggle('hindi-mode', selectedLang === 'hi');

      // Update active button styles
      languageButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      alert('Language preference saved. Navigate to other pages to see the change.');
    });
  });
});
