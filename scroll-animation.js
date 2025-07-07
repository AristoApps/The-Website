// Enhanced scroll animation support for mobile devices
(() => {
  // Function to refresh AOS on scroll events
  const refreshAOS = () => {
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  };

  // Function to check if elements are in viewport and trigger animations
  const checkVisibility = () => {
    if (typeof AOS === 'undefined') return;
    
    const elements = document.querySelectorAll('[data-aos]');
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      // If element is in viewport
      if (rect.top <= windowHeight * 0.85 && rect.bottom >= 0) {
        if (!element.classList.contains('aos-animate')) {
          element.classList.add('aos-animate');
        }
      }
    });
  };

  // Add event listeners after page is fully loaded
  window.addEventListener('load', () => {
    // For desktop
    window.addEventListener('scroll', refreshAOS);
    window.addEventListener('scroll', checkVisibility);
    
    // For mobile devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.addEventListener('touchmove', refreshAOS);
      document.addEventListener('touchmove', checkVisibility);
      document.addEventListener('touchend', () => {
        setTimeout(checkVisibility, 100);
      });
    }
    
    // Initial check
    setTimeout(() => {
      refreshAOS();
      checkVisibility();
    }, 200);
  });
})();  
