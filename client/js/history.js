const dummyData = [
    {
      name: "Protein Bar",
      barcode: "123456789",
      date: "2025-04-15",
      verdict: "Good",
      thumbnail: "https://via.placeholder.com/60",
      nutrition: {
        calories: 180,
        fat: 6,
        saturatedFat: 1,
        sugar: 5,
        protein: 15,
        carbs: 20,
        sodium: 120,
        tip: "High protein content – great post-workout!",
        notes: "Eaten post-gym",
        tags: "Snack",
      }
    },
    {
      name: "Cola Drink",
      barcode: "987654321",
      date: "2025-04-16",
      verdict: "Bad",
      thumbnail: "https://via.placeholder.com/60",
      nutrition: {
        calories: 210,
        fat: 0,
        saturatedFat: 0,
        sugar: 44,
        protein: 0,
        carbs: 56,
        sodium: 45,
        tip: "Too much sugar – avoid daily use",
        notes: "Felt tired after",
        tags: "Drink",
      }
    }
  ];
  
  let data = [...dummyData];
  
  function renderHistory() {
    const container = document.getElementById("historyList");
    container.innerHTML = "";
  
    const query = document.getElementById("search").value.toLowerCase();
    const verdict = document.getElementById("verdictFilter").value;
    const date = document.getElementById("dateFilter").value;
  
    const filtered = data.filter(item => {
      return (
        (!query || item.name.toLowerCase().includes(query) || item.barcode.includes(query)) &&
        (!verdict || item.verdict === verdict) &&
        (!date || item.date === date)
      );
    });
  
    filtered.forEach(item => {
      const div = document.createElement("div");
      div.className = "history-item";
      div.innerHTML = `
        <strong>${item.name}</strong> - <em>${item.date}</em>
        <div>Barcode: ${item.barcode}</div>
        <div><img src="${item.thumbnail}" alt="thumb"/></div>
        <div>${item.verdict === "Good" ? "✅" : item.verdict === "Moderate" ? "⚠️" : "❌"} ${item.verdict}</div>
        <div>Calories: ${item.nutrition.calories} | Sugar: ${item.nutrition.sugar}g | Fat: ${item.nutrition.fat}g</div>
      `;
      div.onclick = () => showDetail(item);
      container.appendChild(div);
    });
  }
  
  function showDetail(item) {
    const modal = document.getElementById("detailModal");
    const detail = document.getElementById("modalDetails");
    detail.innerHTML = `
      <h2>${item.name}</h2>
      <p><strong>Barcode:</strong> ${item.barcode}</p>
      <p><strong>Calories:</strong> ${item.nutrition.calories}</p>
      <p><strong>Fat:</strong> ${item.nutrition.fat}g</p>
      <p><strong>Saturated Fat:</strong> ${item.nutrition.saturatedFat}g</p>
      <p><strong>Sugar:</strong> ${item.nutrition.sugar}g</p>
      <p><strong>Protein:</strong> ${item.nutrition.protein}g</p>
      <p><strong>Carbs:</strong> ${item.nutrition.carbs}g</p>
      <p><strong>Sodium:</strong> ${item.nutrition.sodium}mg</p>
      <p><strong>Note:</strong> ${item.nutrition.notes}</p>
      <p><strong>Tag:</strong> ${item.nutrition.tags}</p>
      <p><strong>Tip:</strong> ${item.nutrition.tip}</p>
    `;
    modal.style.display = "block";
  }
  
  function closeModal() {
    document.getElementById("detailModal").style.display = "none";
  }
  
  function exportCSV() {
    const headers = ["Name", "Barcode", "Date", "Calories", "Fat", "Sugar"];
    const rows = data.map(d =>
      [d.name, d.barcode, d.date, d.nutrition.calories, d.nutrition.fat, d.nutrition.sugar].join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "foodsnap_history.csv");
    link.click();
  }
  
  function exportPDF() {
    alert("PDF export will be implemented here using libraries like jsPDF.");
  }
  
  function renderChart() {
    const ctx = document.getElementById("summaryChart").getContext("2d");
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.name),
        datasets: [{
          label: 'Calories',
          data: data.map(d => d.nutrition.calories),
          backgroundColor: 'rgba(74, 144, 226, 0.7)'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  }
  
  document.getElementById("search").addEventListener("input", renderHistory);
  document.getElementById("verdictFilter").addEventListener("change", renderHistory);
  document.getElementById("dateFilter").addEventListener("change", renderHistory);
  
  // Initial Render
  renderHistory();
  renderChart();




