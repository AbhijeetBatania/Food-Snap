// Main JavaScript for NutriScan App

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Handle scanning button click
    initScanButton();
  });
  
  /**
  * Initialize staggered animations for feature cards
  */
  function initAnimations() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    // Add staggered animation delay to each feature card
    featureCards.forEach((card, index) => {
        card.style.animationDelay = $;{0.2 * (index + 1)}s;
        card.classList.add('animate-in');
    });
    
    // Add intersection observer for elements that should animate when scrolled into view
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
  
        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        animatedElements.forEach(el => el.classList.add('in-view'));
    }
  }
  
  /**
  * Initialize smooth scrolling for anchor links
  */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 60,
                    behavior: 'smooth'
                });
            }
        });
    });
  }
  
  /**
  * Set up scanning functionality and demo
  */
  function initScanButton() {
    const scanButton = document.querySelector('.scan-btn');
    
    if (scanButton) {
        scanButton.addEventListener('click', function(e) {
            // For demonstration purposes - in a real app this would redirect to scan page
            // Instead of immediately redirecting, we'll add a subtle feedback effect
            const buttonText = this.textContent;
            
            this.classList.add('scanning');
            this.textContent = 'Initializing...';
            
            // Simulate loading before redirect
            setTimeout(() => {
                window.location.href = this.getAttribute('href');
            }, 800);
            
            // Prevent default only for the demo effect
            e.preventDefault();
        });
    }
  }
  
  /**
  * Create mobile navigation menu functionality
  */
  function initMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function() {
            mobileNav.classList.toggle('open');
            this.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileNav.contains(e.target) && !menuButton.contains(e.target) && mobileNav.classList.contains('open')) {
                mobileNav.classList.remove('open');
                menuButton.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
  }
  
  /**
  * Add CSS class for scrolled state of the header
  */
  function initScrollHeader() {
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
  }
  
  /**
  * Add barcode scanning simulation for demo purposes
  */
  function initBarcodeScanDemo() {
    const demoButton = document.querySelector('.demo-scan-btn');
    
    if (demoButton) {
        demoButton.addEventListener('click', function() {
            const scannerOverlay = document.createElement('div');
            scannerOverlay.className = 'scanner-overlay';
            
            const scannerContent = document.createElement('div');
            scannerContent.className = 'scanner-content';
            
            const scannerClose = document.createElement('button');
            scannerClose.className = 'scanner-close';
            scannerClose.innerHTML = '&times;';
            
            const scannerViewfinder = document.createElement('div');
            scannerViewfinder.className = 'scanner-viewfinder';
            
            const scannerMessage = document.createElement('div');
            scannerMessage.className = 'scanner-message';
            scannerMessage.textContent = 'Position barcode in the frame';
            
            scannerContent.appendChild(scannerClose);
            scannerContent.appendChild(scannerViewfinder);
            scannerContent.appendChild(scannerMessage);
            scannerOverlay.appendChild(scannerContent);
            document.body.appendChild(scannerOverlay);
            
            // Prevent body scrolling when scanner is open
            document.body.classList.add('scanner-active');
            
            // Close scanner when clicking the close button
            scannerClose.addEventListener('click', function() {
                document.body.removeChild(scannerOverlay);
                document.body.classList.remove('scanner-active');
            });
            
            // Simulate scanning process
            setTimeout(() => {
                scannerViewfinder.classList.add('scanning');
                scannerMessage.textContent = 'Scanning...';
                
                setTimeout(() => {
                    scannerViewfinder.classList.remove('scanning');
                    scannerViewfinder.classList.add('success');
                    scannerMessage.textContent = 'Product found!';
                    
                    // Redirect to product details page after successful scan
                    setTimeout(() => {
                        window.location.href = 'product-details.html';
                    }, 1000);
                }, 2000);
            }, 1500);
        });
    }
  }
  
  /**
  * Handle form submission for newsletter or user registration
  */
  function initFormHandler() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitButton = this.querySelector('[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';
            
            // Simulate form submission
            setTimeout(() => {
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.textContent = 'Thank you! Your submission was received.';
                
                this.style.display = 'none';
                this.parentNode.appendChild(successMessage);
                
                // Reset form state after some time
                setTimeout(() => {
                    this.reset();
                    this.style.display = 'block';
                    successMessage.remove();
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }, 3000);
            }, 1000);
        });
    });
  }