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
      // If confirm password field has content, validate match on password change too
      if(confirmPasswordInput.value.length > 0) {
        validatePasswordMatch();
      }
    });
    
    // Email validation on blur
    emailInput.addEventListener('blur', validateEmail);
    
    // Form submission handler
    signupForm.addEventListener('submit', function(event) {
      // Prevent the default form submission
      event.preventDefault();
      
      // Validate all fields
      const isFullNameValid = validateFullName();
      const isEmailValid = validateEmail();
      const isPasswordValid = validatePasswordStrength();
      const isPasswordMatch = validatePasswordMatch();
      
      // If all validations pass
      if(isFullNameValid && isEmailValid && isPasswordValid && isPasswordMatch) {
        // Normally this would be an AJAX call to a backend API
        console.log('Form is valid, submitting data...');
        
        // Create user object from form data
        const userData = {
          fullName: fullNameInput.value,
          email: emailInput.value,
          password: passwordInput.value
        };
        
        // For demonstration, log the data that would be sent
        console.log('User data:', userData);
        
        // Simulate successful registration and redirect
        // In a real app, this would happen after receiving successful response from server
        showSuccessMessage();
        setTimeout(() => {
          window.location.href = 'profilesetup.html';
        }, 1500);
      }
    });
    
    // Validation functions
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
      // Basic email regex pattern
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
        showError(passwordInput, 'Password must be at least ${minPasswordLength} characters');
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
    
    // UI feedback functions
    function showError(inputElement, message) {
      const formGroup = inputElement.parentElement;
      let errorElement = formGroup.querySelector('.error-message');
      
      // Create error message element if it doesn't exist
      if(!errorElement) {
        errorElement = document.createElement('p');
        errorElement.className = 'error-message validation-message';
        formGroup.appendChild(errorElement);
      }
      
      // Show error message
      errorElement.textContent = message;
      inputElement.classList.add('input-error');
    }
    
    function showSuccess(inputElement) {
      const formGroup = inputElement.parentElement;
      const errorElement = formGroup.querySelector('.error-message');
      
      // Remove error message if it exists
      if(errorElement) {
        errorElement.textContent = '';
      }
      
      inputElement.classList.remove('input-error');
    }
    
    function showSuccessMessage() {
      // Create success message element
      const successMessage = document.createElement('div');
      successMessage.className = 'success-popup';
      successMessage.innerHTML = `
        <div class="success-icon">✓</div>
        <p>Account created successfully!</p>
        <p class="redirect-text">Redirecting to profile setup...</p>
      `;
      
      // Append to container
      const container = document.querySelector('.signup-container');
      container.appendChild(successMessage);
      
      // Hide the form
      signupForm.style.display = 'none';
    }
  });