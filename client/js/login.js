// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    const emailInput = loginForm.querySelector('input[type="email"]');
    const passwordInput = loginForm.querySelector('input[type="password"]');
    const submitBtn = document.getElementById('submitBtn');
  
    // Form submission handler
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent default form submission
      
      // Reset previous error states
      clearErrors();
      
      // Validate inputs
      let isValid = true;
      
      // Email validation
      if (!validateEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
      }
      
      // Password validation
      if (passwordInput.value.length < 6) {
        showError(passwordInput, 'Password must be at least 6 characters');
        isValid = false;
      }
      
      // If form is valid, proceed with login
      if (isValid) {
        // Show loading state on button
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Logging in...';
        submitBtn.disabled = true;
        
        // Simulate API call with timeout
        setTimeout(function() {
          // In a real application, you would make an API request here
          // For demo purposes, we're just redirecting after a delay
          window.location.href = 'home.html';
        }, 1500);
      }
    });
    
    // Input event listeners for real-time validation
    emailInput.addEventListener('input', function() {
      if (this.value && validateEmail(this.value)) {
        clearError(this);
      }
    });
    
    passwordInput.addEventListener('input', function() {
      if (this.value && this.value.length >= 6) {
        clearError(this);
      }
    });
    
    // Helper function to validate email format
    function validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    
    // Helper function to show error message
    function showError(inputElement, message) {
      inputElement.classList.add('error');
      
      // Create error message element if it doesn't exist
      let errorElement = inputElement.nextElementSibling;
      if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('div');
        errorElement.classList.add('error-message');
        inputElement.parentNode.insertBefore(errorElement, inputElement.nextElementSibling);
      }
      
      errorElement.textContent = message;
    }
    
    // Helper function to clear a specific error
    function clearError(inputElement) {
      inputElement.classList.remove('error');
      
      const errorElement = inputElement.nextElementSibling;
      if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.remove();
      }
    }
    
    // Helper function to clear all errors
    function clearErrors() {
      const inputs = loginForm.querySelectorAll('input');
      inputs.forEach(function(input) {
        clearError(input);
      });
    }
    
    // Add "remember me" functionality if needed
    const rememberMeCheckbox = document.getElementById('rememberMe');
    if (rememberMeCheckbox) {
      rememberMeCheckbox.addEventListener('change', function() {
        if (this.checked) {
          localStorage.setItem('foodSnapRememberEmail', emailInput.value);
        } else {
          localStorage.removeItem('foodSnapRememberEmail');
        }
      });
      
      // Check if we have stored email
      const savedEmail = localStorage.getItem('foodSnapRememberEmail');
      if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMeCheckbox.checked = true;
      }
    }
  });