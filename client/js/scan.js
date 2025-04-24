import { auth, db } from './firebase-init.js';
import {
  collection,
  addDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';

const videoPreview = document.getElementById('video-preview');
const capturedImage = document.getElementById('captured-image');
const scanBtn = document.getElementById('scan-btn');
const optionsContainer = document.getElementById('options-container');
const reScanBtn = document.getElementById('re-scan-btn');
const nextBtn = document.getElementById('next-btn');
const cameraIcon = document.getElementById('camera-icon');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const scanTitle = document.getElementById('scan-title');
const scanInstructions = document.getElementById('scan-instructions');
const loading = document.getElementById('loading');
const fileUpload = document.getElementById('file-upload');
const ocrResult = document.getElementById('ocr-result');
const ocrText = document.getElementById('ocr-text');
const resultHeader = document.getElementById('result-header');

let currentStep = 1;
let stream = null;
let isScanning = false;

async function initScanner() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    videoPreview.srcObject = stream;
    videoPreview.style.display = 'block';
    cameraIcon.style.display = 'none';
    isScanning = true;
  } catch (err) {
    alert("Camera access failed. Try uploading an image instead.");
    console.error(err);
  }
}

function stopScanner() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    videoPreview.srcObject = null;
    isScanning = false;
  }
}

function simulateScan() {
  if (!isScanning) return;
  scanBtn.style.display = 'none';
  loading.style.display = 'block';

  setTimeout(() => {
    const canvas = document.createElement('canvas');
    canvas.width = videoPreview.videoWidth;
    canvas.height = videoPreview.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoPreview, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];

    capturedImage.src = canvas.toDataURL('image/png');
    capturedImage.style.display = 'block';
    videoPreview.style.display = 'none';
    stopScanner();

    loading.style.display = 'none';
    optionsContainer.style.display = 'flex';

    extractTextFromImage(base64Image);
  }, 1500);
}

function processUploadedImage(file) {
  if (!file.type.match('image.*')) {
    alert('Please select an image file');
    return;
  }

  scanBtn.style.display = 'none';
  loading.style.display = 'block';

  const reader = new FileReader();
  reader.onload = function (e) {
    const base64Image = e.target.result.split(',')[1];
    capturedImage.src = e.target.result;
    capturedImage.style.display = 'block';
    videoPreview.style.display = 'none';
    stopScanner();

    setTimeout(() => {
      loading.style.display = 'none';
      optionsContainer.style.display = 'flex';
      extractTextFromImage(base64Image, true);
    }, 1000);
  };
  reader.readAsDataURL(file);
}

async function extractTextFromImage(base64Image, isUpload = false) {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [{
          role: "user",
          content: [
            { type: "text", text: "Extract the food label or nutrition values from this image." },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
          ]
        }],
        temperature: 0.3,
        max_completion_tokens: 1024
      })
    });

    const data = await response.json();
    const result = data?.choices?.[0]?.message?.content || "No readable text found.";

    const lines = result.split('\n').filter(line => line.trim().length > 0);
    ocrText.innerHTML = lines.map(line => `<div class="ocr-line">${line.trim()}</div>`).join('');
    resultHeader.textContent = currentStep === 1 ? "Label Information:" : "Nutritional Value:";
    ocrResult.style.display = 'block';

    saveScanToFirestore(`data:image/jpeg;base64,${base64Image}`, result);

    // If uploaded, show final "Done" redirection
    if (isUpload && currentStep === 2) {
      nextBtn.textContent = "Done";
    }
  } catch (error) {
    ocrText.textContent = "Error reading image. Please try again.";
    ocrResult.style.display = 'block';
    console.error(error);
  }
}

async function saveScanToFirestore(imageData, nutritionText) {
  try {
    const user = auth.currentUser;
    if (!user) return console.warn('User not logged in. Cannot save scan.');

    const scanRef = collection(db, 'users', user.uid, 'scans');
    await addDoc(scanRef, {
      image: imageData,
      nutrition: nutritionText,
      timestamp: serverTimestamp()
    });

    console.log("Scan saved to Firestore!");
  } catch (err) {
    console.error("Error saving scan to Firestore:", err);
  }
}

function resetScanner() {
  capturedImage.style.display = 'none';
  optionsContainer.style.display = 'none';
  ocrResult.style.display = 'none';
  scanBtn.style.display = 'flex';
  initScanner();
}

function moveToNextStep() {
  currentStep = 2;
  step1.classList.remove('active');
  step2.classList.add('active');
  scanTitle.textContent = 'Scan Nutritional Info';
  scanInstructions.textContent = 'Scan or upload the nutrition label for more details.';
  resetScanner();
  nextBtn.textContent = "Done";
}

function completeScanning() {
  window.location.href = 'analysis.html';
}

scanBtn.addEventListener('click', () => !isScanning ? initScanner() : simulateScan());
reScanBtn.addEventListener('click', resetScanner);
nextBtn.addEventListener('click', () => currentStep === 1 ? moveToNextStep() : completeScanning());
fileUpload.addEventListener('change', e => e.target.files[0] && processUploadedImage(e.target.files[0]));

document.addEventListener('DOMContentLoaded', () => {
  cameraIcon.style.display = 'block';
  if (!/Android|iPhone|iPad/i.test(navigator.userAgent)) {
    document.querySelector('.scan-text').textContent = 'Click the button below to scan or upload an image';
  }
});
