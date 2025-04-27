// Optional: Highlight current nav link or add scroll animations

document.addEventListener('DOMContentLoaded', () => {
    console.log("Privacy Policy page loaded.");
    
    // Smooth scroll for anchor links if needed in the future
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
          behavior: "smooth",
        });
      });
    });
  });