document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const scanButton = document.getElementById('scanButton');
    const videoElement = document.getElementById('videoElement');
    const scanPreview = document.querySelector('.scan-preview');
    const cancelScan = document.querySelector('.cancel-scan');
    const menuButton = document.querySelector('.menu-button');
    const nav = document.querySelector('nav ul');
    
    // Scanner state
    let scanning = false;
    let stream = null;
    
    // Mobile menu toggle functionality
    menuButton.addEventListener('click', function() {
        if (nav.style.display === 'flex') {
            nav.style.display = 'none';
        } else {
            nav.style.display = 'flex';
            nav.style.flexDirection = 'column';
            nav.style.position = 'absolute';
            nav.style.top = '70px';
            nav.style.right = '0';
            nav.style.backgroundColor = 'white';
            nav.style.width = '200px';
            nav.style.padding = '1rem';
            nav.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            nav.style.zIndex = '100';
        }
    });
    
    // Handle window resize to fix menu on larger screens
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            nav.style.display = 'flex';
            nav.style.flexDirection = 'row';
            nav.style.position = 'static';
            nav.style.width = 'auto';
            nav.style.padding = '0';
            nav.style.boxShadow = 'none';
        } else {
            nav.style.display = 'none';
        }
    });
    
    // Scan button click handler
    scanButton.addEventListener('click', startScanner);
    
    // Cancel scan button click handler
    cancelScan.addEventListener('click', stopScanner);

    /**
     * Start the barcode scanner
     * Requests camera access and displays the camera feed
     */
    function startScanner() {
        if (scanning) return;
        
        // Request camera access
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then(function(mediaStream) {
                    stream = mediaStream;
                    videoElement.srcObject = mediaStream;
                    scanPreview.classList.add('scanner-active');
                    scanning = true;

                    // Fake barcode detection simulation after 3 seconds
                    setTimeout(function() {
                        if (scanning) {
                            simulateProductFound();
                        }
                    }, 3000);
                })
                .catch(function(error) {
                    console.error('Camera access error:', error);
                    alert('Could not access the camera. Please make sure you have granted permission.');
                });
        } else {
            alert('Sorry, your browser does not support camera access.');
        }
    }

    /**
     * Stop the barcode scanner
     * Stops the camera feed and resets the UI
     */
    function stopScanner() {
        if (!scanning) return;
        
        if (stream) {
            stream.getTracks().forEach(function(track) {
                track.stop();
            });
        }
        
        videoElement.srcObject = null;
        scanPreview.classList.remove('scanner-active');
        scanning = false;
    }

    /**
     * Simulate finding a product
     * Shows a success message and product details
     */
    function simulateProductFound() {
        // Stop the scanner
        stopScanner();
        
        // Show a loading state
        scanPreview.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 2rem; margin-bottom: 10px;">✓</div>
                <div style="font-weight: bold; color: var(--primary-color);">Product Found!</div>
                <div style="margin-top: 10px; font-size: 0.9rem;">Organic Oat Milk</div>
                <div style="margin-top: 20px;">
                    <div class="button" style="margin: 0 auto; display: inline-flex;">View Details</div>
                </div>
            </div>
        `;
        
        // Reset after 3 seconds
        setTimeout(function() {
            scanPreview.innerHTML = `
                <video id="videoElement" autoplay playsinline></video>
                <div class="scan-overlay">
                    <div class="scan-icon">📷</div>
                    <p>Tap the button below to scan</p>
                </div>
                <div class="scanning-frame">
                    <div class="scanning-line"></div>
                </div>
                <button class="cancel-scan">✕</button>
            `;
            
            // Reconnect event listener to the new cancel button
            document.querySelector('.cancel-scan').addEventListener('click', stopScanner);
            
            // Reset video element reference
            videoElement = document.getElementById('videoElement');
        }, 3000);
    }

    // Footer navigation active state
    const footerIcons = document.querySelectorAll('.footer-icon');
    footerIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            footerIcons.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
});