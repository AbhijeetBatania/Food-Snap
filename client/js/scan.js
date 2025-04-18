// DOM elements
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

// State variables
let currentStep = 1;
let stream = null;
let isScanning = false;

// Initialize the scanner
async function initScanner() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: "environment",
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });
        videoPreview.srcObject = stream;
        videoPreview.style.display = 'block';
        cameraIcon.style.display = 'none';
        isScanning = true;
    } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Unable to access camera. Please make sure you've granted camera permissions or try uploading an image instead.");
    }
}

// Stop the camera stream
function stopScanner() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        videoPreview.srcObject = null;
        isScanning = false;
    }
}

// Simulate scanning process
function simulateScan() {
    if (!isScanning) return;
    
    // Hide scan button and show loading
    scanBtn.style.display = 'none';
    loading.style.display = 'block';
    
    // Simulate processing time
    setTimeout(() => {
        // Take a screenshot from video
        const canvas = document.createElement('canvas');
        canvas.width = videoPreview.videoWidth;
        canvas.height = videoPreview.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoPreview, 0, 0, canvas.width, canvas.height);
        
        // Display the captured image
        capturedImage.src = canvas.toDataURL('image/png');
        capturedImage.style.display = 'block';
        videoPreview.style.display = 'none';
        
        // Stop the camera
        stopScanner();
        
        // Hide loading and show options
        loading.style.display = 'none';
        optionsContainer.style.display = 'flex';
    }, 1500);
}

// Process uploaded image
function processUploadedImage(file) {
    if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
    }
    
    // Hide scan button and show loading
    scanBtn.style.display = 'none';
    loading.style.display = 'block';
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // Display the uploaded image
        capturedImage.src = e.target.result;
        capturedImage.style.display = 'block';
        videoPreview.style.display = 'none';
        
        // Stop any active camera
        stopScanner();
        
        // Hide loading and show options after a brief delay to simulate processing
        setTimeout(() => {
            loading.style.display = 'none';
            optionsContainer.style.display = 'flex';
        }, 1000);
    };
    
    reader.readAsDataURL(file);
}

// Reset scanner
function resetScanner() {
    capturedImage.style.display = 'none';
    optionsContainer.style.display = 'none';
    scanBtn.style.display = 'flex';
    initScanner();
}

// Update UI for the next step
function moveToNextStep() {
    currentStep = 2;
    step1.classList.remove('active');
    step2.classList.add('active');
    
    scanTitle.textContent = 'Scan Ingredients List';
    scanInstructions.textContent = 'Point your camera at the ingredients list on the food packaging for a detailed analysis.';
    
    resetScanner();
    
    // Change the next button to "Done" for the second step
    nextBtn.textContent = "Done";
}

// Handle completion of scanning process
function completeScanning() {
    window.location.href = 'analysis.html';
}

// Event listeners
scanBtn.addEventListener('click', () => {
    if (!isScanning) {
        initScanner();
    } else {
        simulateScan();
    }
});

reScanBtn.addEventListener('click', resetScanner);

nextBtn.addEventListener('click', () => {
    if (currentStep === 1) {
        moveToNextStep();
    } else {
        completeScanning();
    }
});

fileUpload.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
        processUploadedImage(e.target.files[0]);
    }
});

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    cameraIcon.style.display = 'block';
    
    // Check if running on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Adjust UI based on device
    if (!isMobile) {
        document.querySelector('.scan-text').textContent = 'Click the button below to scan or upload an image';
    }
});