const badges = [
    {
      id: 1,
      name: "First Scan",
      img: "🥇",
      points: 10,
      earned: true,
    },
    {
      id: 2,
      name: "Healthy Streak",
      img: "💪",
      points: 30,
      earned: true,
    },
    {
      id: 3,
      name: "Nutrition Expert",
      img: "📊",
      points: 50,
      earned: false,
    },
    {
      id: 4,
      name: "7 Days In a Row",
      img: "📆",
      points: 40,
      earned: true,
    },
    {
      id: 5,
      name: "Eco Eater",
      img: "🌿",
      points: 25,
      earned: false,
    }
  ];
  
  let currentSort = "newest";
  
  const totalPointsElement = document.getElementById("totalPoints");
  const badgesGrid = document.getElementById("badgesGrid");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const sortToggle = document.getElementById("sortToggle");
  
  function renderBadges(filter = "all") {
    badgesGrid.innerHTML = "";
  
    let filteredBadges = badges;
  
    if (filter === "earned") filteredBadges = badges.filter(b => b.earned);
    if (filter === "locked") filteredBadges = badges.filter(b => !b.earned);
  
    if (currentSort === "oldest") {
      filteredBadges = [...filteredBadges].reverse();
    }
  
    filteredBadges.forEach(badge => {
      const badgeEl = document.createElement("div");
      badgeEl.className = `badge-card ${badge.earned ? "" : "locked"}`;
      badgeEl.innerHTML = `
        <div class="badge-img">${badge.img}</div>
        <div class="badge-name">${badge.name}</div>
        <div class="badge-points">${badge.points} pts</div>
      `;
      if (badge.earned) {
        badgeEl.addEventListener("click", () => {
          showCelebration(badge.name);
        });
      }
      badgesGrid.appendChild(badgeEl);
    });
  
    updatePoints();
  }
  
  function updatePoints() {
    const total = badges.reduce((sum, b) => (b.earned ? sum + b.points : sum), 0);
    totalPointsElement.textContent = total;
  }
  
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderBadges(btn.dataset.filter);
    });
  });
  
  sortToggle.addEventListener("click", () => {
    currentSort = currentSort === "newest" ? "oldest" : "newest";
    sortToggle.textContent = `Sort: ${currentSort.charAt(0).toUpperCase() + currentSort.slice(1)}`;
    renderBadges(document.querySelector(".filter-btn.active").dataset.filter);
  });
  
  function showCelebration(badgeName) {
    const modal = document.getElementById("celebrationModal");
    modal.classList.remove("hidden");
    modal.querySelector("p").textContent = `You’ve just earned the "${badgeName}" badge! 🎉`;
  }
  
  function closeCelebration() {
    document.getElementById("celebrationModal").classList.add("hidden");
  }
  
  renderBadges();
  
