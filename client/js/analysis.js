// Audio Player Functionality
document.addEventListener('DOMContentLoaded', function() {
    const audioButton = document.getElementById('audioButton');
    const audioPlayerContainer = document.getElementById('audioPlayerContainer');
    const closeAudioPlayer = document.getElementById('closeAudioPlayer');
    const audioPlayer = document.getElementById('audioPlayer');
    const overlay = document.getElementById('overlay');
    
    // Function to open audio player
    function openAudioPlayer() {
        audioPlayerContainer.classList.add('active');
        overlay.style.display = 'block';
        // Reset audio to beginning
        audioPlayer.currentTime = 0;
    }
    
    // Function to close audio player
    function closeAudioPlayerFunc() {
        audioPlayerContainer.classList.remove('active');
        overlay.style.display = 'none';
        // Pause audio when closing
        audioPlayer.pause();
    }
    
    // Event listeners
    audioButton.addEventListener('click', openAudioPlayer);
    closeAudioPlayer.addEventListener('click', closeAudioPlayerFunc);
    overlay.addEventListener('click', closeAudioPlayerFunc);
    
    // Dynamic Rating Marker Position
    // This could be set based on actual product rating from API
    const ratingMarker = document.querySelector('.rating-marker');
    const ratingScore = 'B'; // This could come from an API
    
    // Set position based on rating
    function setRatingPosition(rating) {
        let position;
        switch(rating) {
            case 'A':
                position = '90%';
                break;
            case 'B':
                position = '75%';
                break;
            case 'C':
                position = '50%';
                break;
            case 'D':
                position = '25%';
                break;
            case 'E':
                position = '10%';
                break;
            default:
                position = '50%';
        }
        ratingMarker.style.left = position;
    }
    
    setRatingPosition(ratingScore);
    
    // Make audio player draggable on mobile
    let startY;
    let currentY;
    let initialY;
    let yOffset = 0;
    let isDragging = false;
    
    // Mobile touch events for dragging
    audioPlayerContainer.addEventListener('touchstart', dragStart, false);
    audioPlayerContainer.addEventListener('touchmove', drag, false);
    audioPlayerContainer.addEventListener('touchend', dragEnd, false);
    
    function dragStart(e) {
        // Only allow dragging from the header area
        if (!e.target.closest('.audio-player-header')) return;
        
        const touchY = e.touches[0].clientY;
        startY = touchY - yOffset;
        isDragging = true;
        initialY = parseInt(window.getComputedStyle(audioPlayerContainer).bottom);
    }
    
    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const touchY = e.touches[0].clientY;
        currentY = touchY - startY;
        
        // Prevent dragging too far up
        const maxDragUp = window.innerHeight - 100;
        const newBottom = initialY - currentY;
        
        if (newBottom >= 0 && newBottom <= maxDragUp) {
            audioPlayerContainer.style.bottom = `${newBottom}px`;
        }
    }
    
    function dragEnd() {
        if (!isDragging) return;
        
        initialY = currentY;
        isDragging = false;
        
        // Snap to positions
        const containerHeight = audioPlayerContainer.offsetHeight;
        const windowHeight = window.innerHeight;
        const currentBottom = parseInt(window.getComputedStyle(audioPlayerContainer).bottom);
        
        // If dragged down more than halfway, close it
        if (currentBottom < containerHeight / 2) {
            closeAudioPlayerFunc();
            audioPlayerContainer.style.bottom = '';  // Reset to CSS value
        } else {
            // Snap back to full open
            audioPlayerContainer.style.bottom = '';
            audioPlayerContainer.classList.add('active');
        }
    }
    
    // Add accessibility features
    function setupAccessibility() {
        // Make the audio button more accessible
        audioButton.setAttribute('role', 'button');
        audioButton.setAttribute('aria-label', 'Listen to audio summary');
        audioButton.setAttribute('tabindex', '0');
        
        // Allow keyboard activation
        audioButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openAudioPlayer();
            }
        });
        
        // Close button accessibility
        closeAudioPlayer.setAttribute('aria-label', 'Close audio player');
    }
    
    setupAccessibility();
    
    // Audio playback tracking with visual feedback
    audioPlayer.addEventListener('timeupdate', function() {
        // You could add a progress bar or other visual feedback here
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        // Example: update a progress indicator if you have one
        // document.querySelector('.progress-bar').style.width = progress + '%';
    });
    
    // Handle audio loading errors
    audioPlayer.addEventListener('error', function() {
        const transcript = document.querySelector('.audio-transcript');
        transcript.innerHTML = '<p class="error-message">Audio failed to load. Please try again later. You can still read the transcript below.</p>' + transcript.innerHTML;
    });
});