// Check if user profile exists in localStorage
document.addEventListener('DOMContentLoaded', function() {
    // Load user name if available
    const savedName = localStorage.getItem('userName');
    const profileNameElement = document.getElementById('profile-name');
    
    if (savedName) {
        profileNameElement.textContent = savedName;
    } else {
        profileNameElement.textContent = 'Enter Name';
    }
    
    // Make profile name editable on click
    profileNameElement.addEventListener('click', function() {
        const currentName = this.textContent;
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = currentName === 'Enter Name' ? '' : currentName;
        nameInput.className = 'profile-name-input';
        nameInput.placeholder = 'Enter your name';
        
        this.parentNode.replaceChild(nameInput, this);
        nameInput.focus();
        
        nameInput.addEventListener('blur', function() {
            const newName = this.value.trim() || 'Enter Name';
            const nameElement = document.createElement('div');
            nameElement.id = 'profile-name';
            nameElement.className = 'profile-name';
            nameElement.textContent = newName;
            
            this.parentNode.replaceChild(nameElement, this);
            
            // Save name to localStorage
            if (newName !== 'Enter Name') {
                localStorage.setItem('userName', newName);
            }
            
            // Reattach click event
            nameElement.addEventListener('click', profileNameElement.onclick);
        });
        
        nameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                this.blur();
            }
        });
    });
    
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
    
    languageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            languageBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentLanguage = this.dataset.lang;
            localStorage.setItem('language', currentLanguage);
            updateLanguage();
        });
    });
    
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
                fontSize: "Font Size",
                language: "Language"
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
                fontSize: "फ़ॉन्ट आकार",
                language: "भाषा"
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
        document.querySelectorAll('.option-title')[0].childNodes[0].textContent = translations[currentLanguage].audioOutput;
        document.querySelector('.option-description').textContent = translations[currentLanguage].convertResults;
        document.querySelectorAll('.option-title')[1].textContent = translations[currentLanguage].fontSize;
        document.querySelectorAll('.option-title')[2].textContent = translations[currentLanguage].language;
    }
    
    // Audio output toggle
    const audioToggle = document.getElementById('audio-toggle');
    
    // Initialize audio setting
    if (localStorage.getItem('audioEnabled') === 'true') {
        audioToggle.checked = true;
    }
    
    audioToggle.addEventListener('change', function() {
        localStorage.setItem('audioEnabled', this.checked);
        console.log(`Audio output: ${this.checked ? 'enabled' : 'disabled'}`);
    });
    
    // Edit profile button
    const editBtn = document.querySelector('.edit-btn');
    
    editBtn.addEventListener('click', function() {
        // This would typically navigate to an edit profile page
        alert('Edit profile functionality would open here');
    });
});