document.addEventListener('DOMContentLoaded', () => {
    console.log('FoodSnap Community Page Loaded');
  
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
  
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  });
  