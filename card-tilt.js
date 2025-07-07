// Card Tilting Animation
document.addEventListener('DOMContentLoaded', function() {
  // Configuration for the tilt effect
  const config = {
    max: 15, // maximum tilt rotation (degrees)
    perspective: 1000, // perspective value for 3D space
    scale: 1.05, // scale on hover
    speed: 300, // speed of the transition
    easing: 'cubic-bezier(.03,.98,.52,.99)', // easing for smooth animation
    glareMaxOpacity: 0.15 // maximum opacity of the glare effect
  };
  
  // Apply tilt effect to About section cards
  applyTiltEffect('.card', config);
  
  // Apply tilt effect to Service section cards
  applyTiltEffect('.service-box-ui, .service-box-cross, .service-box-dj, .service-box-postgres', config);
  
  // Apply tilt effect to logo
  applyTiltEffect('.logo-wrapper', {
    max: 20, // more pronounced tilt for small element
    perspective: 800,
    scale: 1.1,
    speed: 200,
    easing: 'cubic-bezier(.03,.98,.52,.99)',
    glareMaxOpacity: 0.2
  });
});

// Function to apply tilt effect to specified elements
function applyTiltEffect(selector, config) {
  const elements = document.querySelectorAll(selector);
  
  // Apply listeners to each element
  elements.forEach(element => {
    // Track if the element is currently being hovered/touched
    let isActive = false;
    
    // Initialize element transform properties
    element.style.transition = `transform ${config.speed}ms ${config.easing}`;
    element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    element.style.transformStyle = 'preserve-3d';
    
    // Mouse enter event
    element.addEventListener('mouseenter', () => {
      isActive = true;
      
      // Reset transition for smooth movement
      element.style.transition = `transform ${config.speed}ms ${config.easing}`;
    });
    
    // Mouse move event - calculate tilt
    element.addEventListener('mousemove', (e) => {
      if (!isActive) return;
      
      // Remove transition for immediate response
      element.style.transition = 'none';
      
      // Get position of cursor within element
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top; // y position within the element
      
      // Calculate rotation based on mouse position
      const xRotation = ((y / rect.height) * 2 - 1) * -config.max;
      const yRotation = ((x / rect.width) * 2 - 1) * config.max;
      
      // Apply transform to the element
      element.style.transform = `
        perspective(${config.perspective}px) 
        rotateX(${xRotation}deg) 
        rotateY(${yRotation}deg)
        scale(${config.scale})
      `;
      
      // Set border gradient rotation based on mouse position
      const angle = Math.atan2(y - rect.height / 2, x - rect.width / 2) * (180 / Math.PI);
      element.style.setProperty('--rotate', `${angle}deg`);
      element.style.setProperty('--border-opacity', '1');
    });
    
    // Touch events for mobile
    element.addEventListener('touchstart', () => {
      isActive = true;
      element.style.transform = `perspective(${config.perspective}px) scale(${config.scale})`;
      element.style.setProperty('--border-opacity', '1');
    });
    
    // Mouse leave event - reset the element
    element.addEventListener('mouseleave', () => {
      isActive = false;
      element.style.transition = `transform ${config.speed}ms ${config.easing}`;
      element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      element.style.setProperty('--border-opacity', '0');
    });
    
    // Touch end event - reset the element
    element.addEventListener('touchend', () => {
      isActive = false;
      element.style.transition = `transform ${config.speed}ms ${config.easing}`;
      element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      element.style.setProperty('--border-opacity', '0');
    });
  });
} 