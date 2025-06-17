document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const sectionId = this.getAttribute('href').substring(1);
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    });
});

document.addEventListener("DOMContentLoaded", () => {
const fadeElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
    if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: Stop observing after animation
        observer.unobserve(entry.target);
    }
    });
}, {
    threshold: 0.1
});

fadeElements.forEach(el => observer.observe(el));

  // Enhanced cursor tracking for cards in About section and service boxes in Services section
  const interactiveElements = [
    ...document.querySelectorAll('.card-section .card'),
    ...document.querySelectorAll('.service-box-ui, .service-box-cross, .service-box-dj, .service-box-postgres')
  ];
  
  // Track mouse position globally
  let mouseX = 0;
  let mouseY = 0;
  
  // Update mouse position on move
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Use requestAnimationFrame for smoother updates
  function updateElements() {
    // Get fresh element positions each frame for accuracy
    const elementRects = Array.from(interactiveElements).map(element => {
      return {
        element: element,
        rect: element.getBoundingClientRect()
      };
    });
    
    // Process each element
    elementRects.forEach(({element, rect}) => {
      const proximityThreshold = 150; // Increased for better detection range
      
      // Calculate distance from mouse to element center
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;
      const distanceX = mouseX - elementCenterX;
      const distanceY = mouseY - elementCenterY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      // Check if mouse is inside the element
      const isInside = mouseX >= rect.left && 
                       mouseX <= rect.right && 
                       mouseY >= rect.top && 
                       mouseY <= rect.bottom;
      
      if (isInside) {
        // Calculate angle when mouse is inside the element
        const x = mouseX - rect.left;
        const y = mouseY - rect.top;
        const angleRad = Math.atan2(y - rect.height/2, x - rect.width/2);
        const angleDeg = angleRad * (180 / Math.PI);
        
        // Apply the rotation to the border gradient - smoother transition
        element.style.setProperty('--rotate', `${angleDeg}deg`);
        element.style.setProperty('--border-opacity', '1');
      } 
      else if (distance < proximityThreshold + Math.max(rect.width, rect.height) / 2) {
        // When mouse is near but outside the element, calculate angle from center
        const angleRad = Math.atan2(distanceY, distanceX);
        const angleDeg = angleRad * (180 / Math.PI);
        
        // More responsive proximity effect
        const proximityRatio = 1 - (distance / (proximityThreshold + Math.max(rect.width, rect.height) / 2));
        const smoothedProximity = Math.pow(proximityRatio, 0.8); // Slightly smoother falloff
        
        element.style.setProperty('--rotate', `${angleDeg}deg`);
        element.style.setProperty('--border-opacity', smoothedProximity.toFixed(3));
      } else {
        // Reset when mouse is far away but with a subtle fade
        element.style.setProperty('--border-opacity', '0');
      }
    });
    
    // Continue animation loop
    requestAnimationFrame(updateElements);
  }
  
  // Start the animation loop
  requestAnimationFrame(updateElements);
});
