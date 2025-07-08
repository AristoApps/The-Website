// Interactive 3D tilt effect for the main title
document.addEventListener('DOMContentLoaded', function() {
  const title = document.querySelector('.gradient-title');
  
  if (!title) return; // Exit if title doesn't exist
  
  // Define the maximum tilt angle (in degrees)
  const maxTilt = 15;
  const maxDistance = 20; // Maximum distance to move in px
  
  // Wait for AOS animation to complete before adding 3D effects
  setTimeout(() => {
    // Set initial properties
    title.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
    
    // Add subtle shadow to enhance 3D effect
    let initialTextShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
    title.style.textShadow = initialTextShadow;
    
    // Variables to track mouse position
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let isHovering = false;
    
    // Check if it's a touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    let animationStartTime = Date.now();
    
    // Function to update title transform based on mouse position
    function updateTransform(e) {
      isHovering = true;
      
      // Get the bounding rectangle of the title
      const rect = title.getBoundingClientRect();
      
      // Calculate center points
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate how far the mouse is from the center (in percentage)
      mouseX = (e.clientX - centerX) / (rect.width / 2);
      mouseY = (e.clientY - centerY) / (rect.height / 2);
    }
    
    // Reset transform when mouse leaves
    function resetTransform() {
      isHovering = false;
    }
    
    // Animation for touch devices (subtle floating animation)
    function touchAnimation() {
      const elapsed = (Date.now() - animationStartTime) / 1000;
      
      // Create a gentle floating motion
      mouseX = Math.sin(elapsed * 0.5) * 0.2; // Gentle horizontal movement
      mouseY = Math.cos(elapsed * 0.3) * 0.1; // Subtle vertical movement
    }
    
    // Animation frame for smooth movement
    function animateTitle() {
      // For touch devices, create a subtle animation
      if (isTouchDevice) {
        touchAnimation();
      } 
      // If not hovering and not a touch device, gradually return to center
      else if (!isHovering) {
        mouseX *= 0.9;
        mouseY *= 0.9;
        
        // If values are very small, reset to exactly zero
        if (Math.abs(mouseX) < 0.001) mouseX = 0;
        if (Math.abs(mouseY) < 0.001) mouseY = 0;
      }
      
      // Smooth lerp (linear interpolation) towards target position
      targetX += (mouseX - targetX) * 0.1;
      targetY += (mouseY - targetY) * 0.1;
      
      // Calculate tilt angles and distance based on mouse position
      const tiltX = maxTilt * targetY * -1; // Invert Y axis for natural tilt
      const tiltY = maxTilt * targetX;
      
      // Calculate X and Y movement based on mouse position
      const moveX = maxDistance * targetX;
      const moveY = maxDistance * targetY;
      
      // Enhanced shadow effect based on movement
      const shadowOffsetX = 10 * targetX;
      const shadowOffsetY = 10 * targetY;
      const shadowBlur = 30 + Math.abs(moveX + moveY) * 0.5;
      
      // Calculate intensity for glow effect based on mouse movement
      const distance = Math.sqrt(targetX * targetX + targetY * targetY);
      const glowIntensity = Math.min(0.3, distance * 0.6); // Cap at 0.3 for subtle effect
      
      title.style.textShadow = `
        ${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px rgba(0, 0, 0, 0.2),
        0 0 5px rgba(255, 255, 255, ${glowIntensity}),
        0 0 10px rgba(255, 255, 255, ${glowIntensity * 0.7}),
        0 0 15px rgba(255, 255, 255, ${glowIntensity * 0.4})
      `;
      
      // Apply the transform
      title.style.transform = `
        perspective(1000px)
        rotateX(${tiltX}deg)
        rotateY(${tiltY}deg)
        translate3d(${moveX}px, ${moveY}px, 10px)
        scale(${1 + Math.abs(targetX * 0.05)})
      `;
      
      requestAnimationFrame(animateTitle);
    }
    
    // Only add mouse events for non-touch devices
    if (!isTouchDevice) {
      // Add mousemove event listener to the title
      title.addEventListener('mousemove', updateTransform);
      
      // Reset when mouse leaves the title
      title.addEventListener('mouseleave', resetTransform);
    }
    
    // Start the animation loop
    animateTitle();
  }, 1500); // Wait 1.5 seconds for AOS animations to finish
}); 
