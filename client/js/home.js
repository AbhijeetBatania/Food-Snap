// 🔵 home.html
//

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    // Health tips rotation
    const tips = [
      "Aim for at least 5 servings of fruits and vegetables daily for optimal nutrition.",
      "Stay hydrated! Drink at least 8 glasses of water per day.",
      "Choose whole grains over refined carbs for sustained energy.",
      "Limit added sugars to less than 10% of your daily calorie intake.",
      "Include protein with every meal to help maintain muscle mass.",
    ];
    
    // Display a random tip on page load
    const tipElement = document.getElementById('dailyTip');
    tipElement.textContent = tips[Math.floor(Math.random() * tips.length)];
    
    // Menu button functionality
    const menuButton = document.getElementById('menuButton');
    const menuPopup = document.getElementById('menuPopup');
    
    menuButton.addEventListener('click', () => {
      menuPopup.classList.add('active');
    });
    
  
    
    // Close popups
    const closeButtons = document.querySelectorAll('.close-popup');
    closeButtons.forEach(button => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.popup-overlay').forEach(popup => {
          popup.classList.remove('active');
        });
      });
    });
    
    // Also close popups when clicking outside
    document.querySelectorAll('.popup-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    });
    
    // Select the "View All" button
    const viewAllButton = document.getElementById('viewAllButton');

    // Add click event listener
    viewAllButton.addEventListener('click', function() {
        // Redirect to history.html
        window.location.href = '../html/history.html';
    });
    // Knowledge Hub Cards Navigation
    const articles = document.querySelectorAll('.article');
    const dots = document.querySelectorAll('.card-nav-dot');
    const prevButton = document.getElementById('prevCard');
    const nextButton = document.getElementById('nextCard');
    let currentIndex = 0;
    
    // Function to update the active card
    function updateActiveCard(index) {
      // Ensure index is within bounds
      if (index < 0) index = articles.length - 1;
      if (index >= articles.length) index = 0;
      
      currentIndex = index;
      
      // Update article positions
      articles.forEach((article, i) => {
        article.classList.remove('active');
        
        if (i === index) {
          article.style.transform = 'translateZ(0) translateX(0) scale(1)';
          article.style.zIndex = '3';
        } else if (i === (index + 1) % articles.length) {
          article.style.transform = 'translateZ(-50px) translateX(15px) scale(0.95)';
          article.style.zIndex = '2';
        } else {
          article.style.transform = 'translateZ(-100px) translateX(30px) scale(0.9)';
          article.style.zIndex = '1';
        }
      });
      
      // Update navigation dots
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }
    
    // Set up card navigation
    prevButton.addEventListener('click', () => {
      updateActiveCard((currentIndex - 1 + articles.length) % articles.length);
    });
    
    nextButton.addEventListener('click', () => {
      updateActiveCard((currentIndex + 1) % articles.length);
    });
    
    // Dots navigation
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        updateActiveCard(i);
      });
    });
    
    // Add swipe functionality for knowledge cards
    const knowledgeArticles = document.getElementById('knowledgeArticles');
    let touchStartX = 0;
    let touchEndX = 0;
    
    knowledgeArticles.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    knowledgeArticles.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
    
    function handleSwipe() {
      const threshold = 50; // minimum distance for a swipe
      if (touchEndX < touchStartX - threshold) {
        // Swipe left
        updateActiveCard((currentIndex + 1) % articles.length);
      } else if (touchEndX > touchStartX + threshold) {
        // Swipe right
        updateActiveCard((currentIndex - 1 + articles.length) % articles.length);
      }
    }
    
    // Initialize the cards
    updateActiveCard(0);
    
    // Make recently scanned items interactive
    const scannedItems = document.querySelectorAll('.scanned-item');
    scannedItems.forEach(item => {
      item.addEventListener('click', () => {
        const itemName = item.querySelector('.item-header span').textContent;
        alert(`You selected: ${itemName}`);
      });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const micButton = document.querySelector('.mic-button');
    
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        alert(`Searching for: ${searchInput.value}`);
      }
    });
    
    micButton.addEventListener('click', () => {
      alert('Voice search activated!');
    });
  });

 