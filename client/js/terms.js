// Optional: Enhancements for UX

document.addEventListener('DOMContentLoaded', () => {
    console.log("Terms of Use page loaded.");
  
    // Optional: Scroll to section if using anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth"
          });
        }
      });
    });
  });