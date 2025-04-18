// Sample data for demonstration
const historyData = [
    {
        id: 1,
        name: "Organic Granola Cereal",
        image: "/api/placeholder/400/320",
        date: "2025-04-17T09:30:00",
        calories: 220,
        protein: 5,
        carbs: 36,
        fat: 8,
        tags: ["Breakfast", "Organic", "Healthy"]
    },
    {
        id: 2,
        name: "Greek Yogurt",
        image: "/api/placeholder/400/320",
        date: "2025-04-16T14:15:00",
        calories: 150,
        protein: 15,
        carbs: 9,
        fat: 5,
        tags: ["Dairy", "High Protein", "Snack"]
    },
    {
        id: 3,
        name: "Dark Chocolate Bar",
        image: "/api/placeholder/400/320",
        date: "2025-04-15T16:45:00",
        calories: 210,
        protein: 2,
        carbs: 21,
        fat: 14,
        tags: ["Dessert", "Antioxidants"]
    },
    {
        id: 4,
        name: "Almond Milk",
        image: "/api/placeholder/400/320",
        date: "2025-04-15T08:20:00",
        calories: 40,
        protein: 1,
        carbs: 2,
        fat: 3,
        tags: ["Vegan", "Dairy-Free", "Beverage"]
    },
    {
        id: 5,
        name: "Quinoa Bowl",
        image: "/api/placeholder/400/320",
        date: "2025-04-14T12:30:00",
        calories: 320,
        protein: 12,
        carbs: 54,
        fat: 7,
        tags: ["Lunch", "Gluten-Free", "Whole Grain"]
    },
    {
        id: 6,
        name: "Protein Bar",
        image: "/api/placeholder/400/320",
        date: "2025-04-13T15:10:00",
        calories: 180,
        protein: 20,
        carbs: 16,
        fat: 6,
        tags: ["Snack", "High Protein", "Pre-Workout"]
    }
  ];
  
  // Navigation functionality
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navClose = document.getElementById('navClose');
  
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('active');
  });
  
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('active');
  });
  
  // Filter dropdown functionality
  const filterBtn = document.getElementById('filterBtn');
  const filterOptions = document.getElementById('filterOptions');
  
  filterBtn.addEventListener('click', () => {
    filterOptions.classList.toggle('show');
  });
  
  document.addEventListener('click', (e) => {
    if (!filterBtn.contains(e.target) && !filterOptions.contains(e.target)) {
        filterOptions.classList.remove('show');
    }
  });
  
  // Format date function
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
  }
  
  // Create history item element
  function createHistoryItem(item) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    historyItem.innerHTML = `
        <div class="item-image">
            <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="item-content">
            <span class="item-date">${formatDate(item.date)}</span>
            <h3 class="item-title">${item.name}</h3>
            <div class="item-nutrients">
                <div class="nutrient">
                    <div class="nutrient-value">${item.calories}</div>
                    <div class="nutrient-label">Calories</div>
                </div>
                <div class="nutrient">
                    <div class="nutrient-value">${item.protein}g</div>
                    <div class="nutrient-label">Protein</div>
                </div>
                <div class="nutrient">
                    <div class="nutrient-value">${item.carbs}g</div>
                    <div class="nutrient-label">Carbs</div>
                </div>
                <div class="nutrient">
                    <div class="nutrient-value">${item.fat}g</div>
                    <div class="nutrient-label">Fat</div>
                </div>
            </div>
            <div class="item-tags">
                ${item.tags.map(tag => <span class="tag">${tag}</span>).join('')}
            </div>
        </div>
    `;
    
    return historyItem;
  }
  
  // Load history items
  function loadHistoryItems(data) {
    const historyList = document.getElementById('historyList');
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');
    
    // Clear current items
    historyList.innerHTML = '';
    
    // Show loading state
    loadingState.classList.add('show');
    emptyState.classList.remove('show');
    
    // Simulate loading delay
    setTimeout(() => {
        loadingState.classList.remove('show');
        
        if (data.length === 0) {
            emptyState.classList.add('show');
        } else {
            data.forEach(item => {
                historyList.appendChild(createHistoryItem(item));
            });
        }
        
        // Update pagination
        updatePagination(data.length);
    }, 1000);
  }
  
  // Update pagination
  function updatePagination(totalItems) {
    const pagination = document.getElementById('pagination');
    const itemsPerPage = 6;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    pagination.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    // Add previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '&lt;';
    pagination.appendChild(prevBtn);
    
    // Add page buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-btn';
        if (i === 1) pageBtn.classList.add('active');
        pageBtn.textContent = i;
        pagination.appendChild(pageBtn);
    }
    
    // Add next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '&gt;';
    pagination.appendChild(nextBtn);
  }
  
  // Search functionality
  const searchInput = document.getElementById('searchInput');
  
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredData = historyData.filter(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    loadHistoryItems(filteredData);
  });
  
  // Handle filter options
  const filterOptionElements = document.querySelectorAll('.filter-option');
  
  filterOptionElements.forEach(option => {
    option.addEventListener('click', () => {
        const filterType = option.dataset.filter;
        let sortedData = [...historyData];
        
        switch(filterType) {
            case 'recent':
                sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'health-high':
                sortedData.sort((a, b) => (b.protein / b.calories) - (a.protein / a.calories));
                break;
            case 'health-low':
                sortedData.sort((a, b) => (a.protein / a.calories) - (b.protein / b.calories));
                break;
        }
        
        loadHistoryItems(sortedData);
        document.getElementById('filterOptions').classList.remove('show');
    });
  });
  
  // Initialize the page
  document.addEventListener('DOMContentLoaded', () => {
    loadHistoryItems(historyData);
  });