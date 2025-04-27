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
  const tipElement = document.getElementById('dailyTip');
  tipElement.textContent = tips[Math.floor(Math.random() * tips.length)];

  // Menu button functionality
  const menuButton = document.getElementById('menuButton');
  const menuPopup = document.getElementById('menuPopup');
  menuButton.addEventListener('click', () => {
    menuPopup.classList.add('active');
  });

  // Close popups
  document.querySelectorAll('.close-popup').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.popup-overlay').forEach(popup => {
        popup.classList.remove('active');
      });
    });
  });

  // Also close popups when clicking outside
  document.querySelectorAll('.popup-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  });

  // View all button
  const viewAllButton = document.getElementById('viewAllButton');
  viewAllButton.addEventListener('click', () => {
    window.location.href = '../html/history.html';
  });

  // Knowledge Hub Cards Navigation
  const articles = document.querySelectorAll('.article');
  const dots = document.querySelectorAll('.card-nav-dot');
  const prevButton = document.getElementById('prevCard');
  const nextButton = document.getElementById('nextCard');
  let currentIndex = 0;

  function updateActiveCard(index) {
    if (index < 0) index = articles.length - 1;
    if (index >= articles.length) index = 0;
    currentIndex = index;
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
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  prevButton.addEventListener('click', () => {
    updateActiveCard(currentIndex - 1);
  });
  nextButton.addEventListener('click', () => {
    updateActiveCard(currentIndex + 1);
  });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      updateActiveCard(i);
    });
  });

  const knowledgeArticles = document.getElementById('knowledgeArticles');
  let touchStartX = 0, touchEndX = 0;
  knowledgeArticles.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  knowledgeArticles.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  function handleSwipe() {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) updateActiveCard(currentIndex + 1);
    else if (touchEndX > touchStartX + threshold) updateActiveCard(currentIndex - 1);
  }
  updateActiveCard(0);

  loadRecentItems();
  setupSearch();
});

// ========== SEARCH FUNCTIONALITY ==========
const searchInput = document.getElementById('searchInput');
const suggestionsList = document.getElementById('suggestionsList');
const clearSearchBtn = document.getElementById('clearSearch');
const micBtn = document.getElementById('micButton');

// Fetch with timeout
const fetchWithTimeout = (url, timeout = 10000) =>
  Promise.race([
    fetch(url).then(res => res.json()),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
  ]);

// Fetch product by barcode
async function fetchProductByBarcode(barcode) {
  const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
  const res = await fetch(url);
  const data = await res.json();
  return data.product ? [data.product] : [];
}

// Fetch product by name
async function fetchProductByName(query) {
  const encoded = encodeURIComponent(query);
  const indiaURL = `https://in.openfoodfacts.org/cgi/search.pl?search_terms=${encoded}&search_simple=1&action=process&json=1`;
  const globalURL = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encoded}&search_simple=1&action=process&json=1`;
  let results = [];

  try {
    const indiaData = await fetchWithTimeout(indiaURL, 10000);
    if (indiaData?.products?.length) results = indiaData.products.filter(p => p.product_name);
  } catch (err) {
    console.warn("India API failed:", err.message);
  }

  if (!results.length) {
    try {
      const globalData = await fetchWithTimeout(globalURL, 10000);
      if (globalData?.products?.length) results = globalData.products.filter(p => p.product_name);
    } catch (err) {
      console.error("Global API failed:", err.message);
    }
  }
  return results.slice(0, 10);
}

// Show suggestions
function showSuggestions(products) {
  suggestionsList.innerHTML = '';
  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${product.image_thumb_url || './assets/placeholder.png'}" alt="img">
      <span>${product.product_name}</span>
    `;
    li.onclick = () => {
      localStorage.setItem('selectedProduct', JSON.stringify(product));
      let recentItems = JSON.parse(localStorage.getItem('recentItems')) || [];
      recentItems = [product, ...recentItems.filter(p => p.product_name !== product.product_name)].slice(0, 5);
      localStorage.setItem('recentItems', JSON.stringify(recentItems));
      window.location.href = 'analysis.html';
    };
    suggestionsList.appendChild(li);
  });
  suggestionsList.style.display = 'block';
}

// Setup search
function setupSearch() {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (!query) {
      suggestionsList.innerHTML = '';
      suggestionsList.style.display = 'none';
      return;
    }
    suggestionsList.innerHTML = `<li><em>👉 Press Enter to search...</em></li>`;
    suggestionsList.style.display = 'block';
  });

  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      startSearch();
    }
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    suggestionsList.innerHTML = '';
    suggestionsList.style.display = 'none';
    searchInput.focus();
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      suggestionsList.style.display = 'none';
    }
  });

  micBtn.addEventListener('click', () => {
    alert('Voice search feature coming soon!');
  });
}

async function startSearch() {
  const query = searchInput.value.trim();
  if (!query) return;

  suggestionsList.innerHTML = `<li><em>🔍 Searching...</em></li>`;
  suggestionsList.style.display = 'block';

  const isBarcode = /^\d{8,14}$/.test(query);
  let results = [];

  try {
    results = isBarcode ? await fetchProductByBarcode(query) : await fetchProductByName(query);
  } catch (err) {
    console.error("Search error:", err);
  }

  if (!results.length) {
    suggestionsList.innerHTML = `<li><em>❌ Not found. Try scanning the product.</em></li>`;
  } else {
    showSuggestions(results);
  }
}

// Load recent items
function loadRecentItems() {
  const container = document.getElementById('recentlyScanned');
  const recentItems = JSON.parse(localStorage.getItem('recentItems')) || [];

  container.innerHTML = '';

  if (recentItems.length === 0) {
    container.innerHTML = '<p class="no-history-text">No history found.</p>';
    return;
  }

  recentItems.forEach(product => {
    const name = product.product_name || 'Unnamed Product';
    const calories = product.nutriments?.energy_kcal_100g ?? 'N/A';
    const protein = product.nutriments?.proteins_100g ?? 'N/A';
    const sugar = product.nutriments?.sugars_100g ?? 'N/A';

    const item = document.createElement('div');
    item.className = 'scanned-item';
    item.innerHTML = `
      <div class="item-header">
        <span>${name}</span>
      </div>
      <div class="item-nutrients">
        <span>Calories: ${calories}</span>
        <span>Protein: ${protein}</span>
        <span>Sugar: ${sugar}</span>
      </div>
    `;
    item.addEventListener('click', () => {
      localStorage.setItem('selectedProduct', JSON.stringify(product));
      window.location.href = 'analysis.html';
    });
    container.appendChild(item);
  });
}