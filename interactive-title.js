// Interactive 3D tilt effect for the main title
document.addEventListener('DOMContentLoaded', function() {
  const title = document.querySelector('.gradient-title');
  
  if (!title) return; // Exit if title doesn't exist
  
  // Define the maximum tilt angle (in degrees)
  const maxTilt = 15;
  const maxDistance = 20; // Maximum distance to move in px
  
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
  let isAnimating = false;
  let lastTapTime = 0;
  
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
  
  // Handle touch events
  function handleTouchStart(e) {
    e.preventDefault();
    isHovering = true;
    isAnimating = true;
    
    const currentTime = Date.now();
    if (currentTime - lastTapTime < 300) {
      // Double tap detected
      if (isAnimating) {
        isAnimating = false;
        resetTitleTransform();
      } else {
        isAnimating = true;
      }
    }
    lastTapTime = currentTime;
    
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      updateTouchPosition(touch);
    }
  }
  
  function handleTouchMove(e) {
    e.preventDefault();
    if (e.touches.length > 0 && isAnimating) {
      const touch = e.touches[0];
      updateTouchPosition(touch);
    }
  }
  
  function handleTouchEnd() {
    // Don't immediately reset to avoid jarring transition
    setTimeout(() => {
      isHovering = false;
    }, 500);
  }
  
  function updateTouchPosition(touch) {
    // Get the bounding rectangle of the title
    const rect = title.getBoundingClientRect();
    
    // Calculate center points
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate how far the touch is from the center (in percentage)
    mouseX = (touch.clientX - centerX) / (rect.width / 2);
    mouseY = (touch.clientY - centerY) / (rect.height / 2);
    
    // Clamp values to avoid extreme angles
    mouseX = Math.max(Math.min(mouseX, 1), -1);
    mouseY = Math.max(Math.min(mouseY, 1), -1);
  }
  
  // Reset title to initial position
  function resetTitleTransform() {
    title.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
    title.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0px, 0px, 10px) scale(1)';
    
    setTimeout(() => {
      title.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
    }, 500);
  }
  
  // Create automatic subtle animation when not actively interacting
  let animationStartTime = Date.now();
  function automaticAnimation() {
    if (!isHovering) {
      const elapsed = (Date.now() - animationStartTime) / 1000;
      
      // Create a gentle floating motion
      mouseX = Math.sin(elapsed * 0.5) * 0.2; // Gentle horizontal movement
      mouseY = Math.cos(elapsed * 0.3) * 0.1; // Subtle vertical movement
    } else {
      // If hovering but values close to zero, return to center slowly
      if (Math.abs(mouseX) < 0.001) mouseX = 0;
      if (Math.abs(mouseY) < 0.001) mouseY = 0;
    }
  }
  
  // Animation frame for smooth movement
  function animateTitle() {
    // Apply automatic animation when not hovering
    if (!isHovering) {
      automaticAnimation();
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
  
  // Add mouse events
  title.addEventListener('mousemove', updateTransform);
  title.addEventListener('mouseenter', function() { isHovering = true; });
  title.addEventListener('mouseleave', resetTransform);
  
  // Add touch events for mobile devices
  title.addEventListener('touchstart', handleTouchStart, { passive: false });
  title.addEventListener('touchmove', handleTouchMove, { passive: false });
  title.addEventListener('touchend', handleTouchEnd);
  
  // Start the animation loop
  animateTitle();
}); 
