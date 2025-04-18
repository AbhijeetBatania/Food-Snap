// 🔵 signup.html
/**
 * Food Snap Signup Form Validation
 * Provides real-time validation and form submission handling
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get form elements
  const signupForm = document.getElementById('signupForm');
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const passwordMatchMessage = document.getElementById('passwordMatchMessage');
  
  // Password strength requirements
  const minPasswordLength = 8;
  
  // Add event listeners for real-time validation
  confirmPasswordInput.addEventListener('input', validatePasswordMatch);
  passwordInput.addEventListener('input', function() {
    validatePasswordStrength();
    if(confirmPasswordInput.value.length > 0) {
      validatePasswordMatch();
    }
  });
  
  emailInput.addEventListener('blur', validateEmail);
  
  signupForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const isFullNameValid = validateFullName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePasswordStrength();
    const isPasswordMatch = validatePasswordMatch();
    
    if(isFullNameValid && isEmailValid && isPasswordValid && isPasswordMatch) {
      console.log('Form is valid, submitting data...');
      
      const userData = {
        fullName: fullNameInput.value,
        email: emailInput.value,
        password: passwordInput.value
      };
      
      console.log('User data:', userData);
      
      showSuccessMessage();
      setTimeout(() => {
        window.location.href = 'profilesetup.html';
      }, 1500);
    }
  });
  
  function validateFullName() {
    const value = fullNameInput.value.trim();
    if(value.length < 2) {
      showError(fullNameInput, 'Please enter your full name');
      return false;
    }
    showSuccess(fullNameInput);
    return true;
  }
  
  function validateEmail() {
    const value = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailPattern.test(value)) {
      showError(emailInput, 'Please enter a valid email address');
      return false;
    }
    showSuccess(emailInput);
    return true;
  }
  
  function validatePasswordStrength() {
    const value = passwordInput.value;
    if(value.length < minPasswordLength) {
      showError(passwordInput, `Password must be at least ${minPasswordLength} characters`);
      return false;
    }
    showSuccess(passwordInput);
    return true;
  }
  
  function validatePasswordMatch() {
    const passwordValue = passwordInput.value;
    const confirmValue = confirmPasswordInput.value;
    
    if(confirmValue === '') {
      passwordMatchMessage.textContent = '';
      passwordMatchMessage.className = 'validation-message';
      return false;
    }
    
    if(passwordValue !== confirmValue) {
      passwordMatchMessage.textContent = 'Passwords do not match';
      passwordMatchMessage.className = 'validation-message error';
      confirmPasswordInput.classList.add('input-error');
      return false;
    }
    
    passwordMatchMessage.textContent = 'Passwords match';
    passwordMatchMessage.className = 'validation-message success';
    confirmPasswordInput.classList.remove('input-error');
    return true;
  }
  
  function showError(inputElement, message) {
    const formGroup = inputElement.parentElement;
    let errorElement = formGroup.querySelector('.error-message');
    
    if(!errorElement) {
      errorElement = document.createElement('p');
      errorElement.className = 'error-message validation-message';
      formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    inputElement.classList.add('input-error');
  }
  
  function showSuccess(inputElement) {
    const formGroup = inputElement.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    
    if(errorElement) {
      errorElement.textContent = '';
    }
    
    inputElement.classList.remove('input-error');
  }
  
  function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-popup';
    successMessage.innerHTML = `
      <div class="success-icon">✓</div>
      <p>Account created successfully!</p>
      <p class="redirect-text">Redirecting to profile setup...</p>
    `;
    
    const container = document.querySelector('.signup-container');
    container.appendChild(successMessage);
    
    signupForm.style.display = 'none';
  }
});
