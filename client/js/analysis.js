import { auth, db } from './firebase-init.js';
import { doc, getDoc, collection, getDocs } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';

// DOM elements
const productNameElem = document.getElementById("product-name");
const productBrandElem = document.getElementById("product-brand");
const nutritionGridElem = document.getElementById("nutrition-grid");
const warningGridElem = document.getElementById("warning-grid");
const ingredientAnalysisElem = document.getElementById("ingredient-analysis");
const dietaryGridElem = document.getElementById("dietary-grid");
const ratingGradeElem = document.getElementById("rating-grade");
const ratingMarkerElem = document.getElementById("rating-marker");
const transcriptText = document.getElementById("audio-transcript-text");

const servingInput = document.getElementById("serving-input");
const servingMessage = document.getElementById("serving-message");
const warningSection = document.getElementById("warning-section");

// Audio player setup
const audioButton = document.getElementById('audioButton');
const audioPlayerContainer = document.getElementById('audioPlayerContainer');
const closeAudioPlayer = document.getElementById('closeAudioPlayer');
const overlay = document.getElementById('overlay');
const audioPlayer = document.getElementById('audioPlayer');

const GROQ_API_KEY = "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";

// Important nutrients to show
const importantNutrients = [
  { key: "energy-kcal", label: "Calories", unit: "kcal" },
  { key: "fat", label: "Total Fat", unit: "g" },
  { key: "saturated-fat", label: "Saturated Fat", unit: "g" },
  { key: "carbohydrates", label: "Carbohydrates", unit: "g" },
  { key: "sugars", label: "Sugars", unit: "g" },
  { key: "fiber", label: "Fiber", unit: "g" },
  { key: "proteins", label: "Proteins", unit: "g" },
  { key: "salt", label: "Salt", unit: "g" },
  { key: "sodium", label: "Sodium", unit: "mg" }
];

// Danger limits for warnings
const dangerLimits = {
  sugars: 25,      // grams
  sodium: 2300,    // mg
  fat: 78          // grams
};

let originalNutritionData = {};
let currentServingMultiplier = 1;

function openAudioPlayer() {
  audioPlayerContainer.classList.add('active');
  audioPlayerContainer.style.display = 'block';
  overlay.style.display = 'block';
  audioPlayer.currentTime = 0;
}

function closeAudioPlayerFunc() {
  audioPlayerContainer.classList.remove('active');
  audioPlayerContainer.style.display = 'none';
  overlay.style.display = 'none';
  audioPlayer.pause();
}

audioButton.addEventListener('click', openAudioPlayer);
closeAudioPlayer.addEventListener('click', closeAudioPlayerFunc);
overlay.addEventListener('click', closeAudioPlayerFunc);

function setRatingPosition(rating) {
  const map = { A: '90%', B: '75%', C: '50%', D: '25%', E: '10%' };
  ratingMarkerElem.style.left = map[rating] || '50%';
}

function renderNutrition(nutritionData) {
  let normalCards = "";
  let warningCards = "";

  importantNutrients.forEach(nutrient => {
    let value = nutritionData[nutrient.key];
    if (value === undefined) return;

    let adjustedValue = (value * currentServingMultiplier).toFixed(1);
    let displayUnit = nutrient.unit;
    if (nutrient.key === 'sodium') adjustedValue = (adjustedValue * 1000).toFixed(1); // mg

    const cardHTML = `
      <div class="nutrition-card ${dangerLimits[nutrient.key] && adjustedValue > dangerLimits[nutrient.key] ? 'highlight-card' : ''}">
        <div class="nutrition-name">${nutrient.label}</div>
        <div class="nutrition-value">${adjustedValue} ${displayUnit}</div>
        <div class="nutrition-context">${servingInput.value ? "Per serving" : "Enter serving"}</div>
      </div>
    `;

    if (dangerLimits[nutrient.key] && adjustedValue > dangerLimits[nutrient.key]) {
      warningCards += cardHTML;
    } else {
      normalCards += cardHTML;
    }
  });

  nutritionGridElem.innerHTML = normalCards || "<p>No nutrition facts available.</p>";
  warningGridElem.innerHTML = warningCards;

  warningSection.style.display = warningCards ? "block" : "none";
}

function validateServingInput() {
  const value = parseFloat(servingInput.value);
  if (isNaN(value) || value <= 0) {
    servingMessage.textContent = "Enter valid serving size.";
    currentServingMultiplier = 1;
  } else {
    servingMessage.textContent = "";
    currentServingMultiplier = value / 100; // Assuming original values are per 100g
  }
  renderNutrition(originalNutritionData);
}

servingInput.addEventListener("input", validateServingInput);

async function fetchLatestScan() {
  const user = auth.currentUser;
  const scansRef = collection(db, 'users', user.uid, 'scans');
  const snap = await getDocs(scansRef);
  const docs = [];
  snap.forEach(doc => docs.push({ id: doc.id, ...doc.data() }));
  docs.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);
  return docs[0];
}

async function analyzeWithGroq(prompt) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_completion_tokens: 1024
    })
  });
  const result = await response.json();
  return result.choices?.[0]?.message?.content || "No insights available.";
}

async function renderIngredients(ingredientsText) {
  // 1. Show the basic ingredient list as before
  ingredientAnalysisElem.innerHTML = `
    <div class="ingredient-item">
      <div class="ingredient-header">
        <div class="ingredient-name">Ingredients</div>
        <div class="ingredient-tag tag-caution">Check</div>
      </div>
      <div class="ingredient-desc">${ingredientsText}</div>
    </div>
  `;

  try {
    // 2. Analyze the ingredients with GROQ
    const groqAnalysis = await analyzeWithGroq(`Analyze the following ingredients for health impact. For each ingredient, just return one word (Good, Moderate, Bad) with a very short reason (max 5 words):\n\n${ingredientsText}`);

    const lines = groqAnalysis.split('\n').filter(line => line.trim() !== "");
    const formattedAnalysis = lines.map(line => {
      const [ingredient, rest] = line.split(':');
      if (!ingredient || !rest) return null;

      const [status, ...reasonParts] = rest.trim().split(' ');
      const reason = reasonParts.join(' ');

      return {
        ingredient: ingredient.trim(),
        status: status.trim(), // Good / Moderate / Bad
        reason: reason.trim()
      };
    }).filter(Boolean);

    // 3. Build a new layout
    const analyzedHTML = formattedAnalysis.map(item => `
      <div class="ingredient-analysis-row">
        <div class="ingredient-name-only">${item.ingredient}</div>
        <div class="ingredient-status ${item.status.toLowerCase()}">${item.status} - ${item.reason}</div>
      </div>
    `).join('');

    // 4. Append new professional view
    ingredientAnalysisElem.innerHTML += `
      <div class="ingredient-item">
        <div class="ingredient-header">
          <div class="ingredient-name">Ingredient Analysis</div>
          <div class="ingredient-tag tag-info">Insights</div>
        </div>
        <div class="ingredient-analysis-container">
          ${analyzedHTML}
        </div>
      </div>
    `;

  } catch (error) {
    console.error("Error analyzing ingredients:", error);
  }
}

function renderDietaryMatch(preferences, ingredientsText) {
  if (!preferences?.length) {
    dietaryGridElem.innerHTML = `<p>No dietary preferences available.</p>`;
    return;
  }

  dietaryGridElem.innerHTML = preferences.map(pref => {
    const found = ingredientsText?.toLowerCase().includes(pref.toLowerCase());
    return `
      <div class="dietary-item">
        <div class="dietary-icon"><i class="fas fa-leaf"></i></div>
        <div class="dietary-name">${pref}</div>
        <div class="dietary-status ${found ? 'status-yes' : 'status-no'}">${found ? 'Yes' : 'No'}</div>
      </div>
    `;
  }).join('');
}

auth.onAuthStateChanged(async (user) => {
  if (!user) return alert("Please login first!");

  const profileDoc = await getDoc(doc(db, 'users', user.uid));
  const profile = profileDoc.exists() ? profileDoc.data() : {};

  const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct') || "null");

  if (selectedProduct) {
    localStorage.removeItem('selectedProduct');
    productNameElem.textContent = selectedProduct.product_name || "Unknown Product";
    productBrandElem.textContent = selectedProduct.brands || "";

    originalNutritionData = selectedProduct.nutriments || {};
    renderNutrition(originalNutritionData);

    if (selectedProduct.ingredients_text) {
      renderIngredients(selectedProduct.ingredients_text);
      renderDietaryMatch(profile?.dietaryPreferences, selectedProduct.ingredients_text);
    }

    if (selectedProduct.nutrition_grades_tags?.[0]) {
      const grade = selectedProduct.nutrition_grades_tags[0].toUpperCase();
      ratingGradeElem.textContent = grade;
      setRatingPosition(grade);
    }

    transcriptText.textContent = `${productNameElem.textContent} analysis complete.`;

  } else {
    const scan = await fetchLatestScan();
    const nutritionText = scan?.nutrition || "";

    productNameElem.textContent = "Custom Product";
    productBrandElem.textContent = "";

    const nutritionGroq = await analyzeWithGroq(`Analyze nutrition:\n${nutritionText}`);
    const ingredientGroq = await analyzeWithGroq(`List ingredients:\n${nutritionText}`);
    const ratingGroq = await analyzeWithGroq(`Rate this food A to E:\n${nutritionText}`);

    originalNutritionData = { "energy-kcal": 200 }; // Default if no real data
    renderNutrition(originalNutritionData);

    renderIngredients(ingredientGroq);
    renderDietaryMatch(profile?.dietaryPreferences, ingredientGroq);

    const grade = ratingGroq.trim()[0].toUpperCase();
    ratingGradeElem.textContent = grade;
    setRatingPosition(grade);

    transcriptText.textContent = `Analysis based on custom input.`;
  }
});
