document.addEventListener('DOMContentLoaded', () => {
  // Find the iPhone image
  const iphoneImage = document.querySelector('img[src="images/iphone_new_image.png"]');
  
  if (iphoneImage) {
    // Initialize variables to track animation state
    let isAnimating = false;
    let rotationX = 0;
    let rotationY = 0;
    
    // Set initial transform
    iphoneImage.style.transition = 'transform 0.2s ease-out';
    iphoneImage.style.transformStyle = 'preserve-3d';
    iphoneImage.style.willChange = 'transform';
    
    // Handle mouse enter event
    iphoneImage.addEventListener('mouseenter', () => {
      isAnimating = true;
    });
    
    // Handle mouse leave event
    iphoneImage.addEventListener('mouseleave', () => {
      isAnimating = false;
      // Reset to initial position with smooth transition
      iphoneImage.style.transition = 'transform 0.5s ease-out';
      iphoneImage.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      
      // Reset variables
      rotationX = 0;
      rotationY = 0;
      
      // Restore quick transitions after reset animation completes
      setTimeout(() => {
        iphoneImage.style.transition = 'transform 0.2s ease-out';
      }, 500);
    });
    
    // Handle mouse move event
    iphoneImage.addEventListener('mousemove', (event) => {
      if (!isAnimating) return;
      
      // Get dimensions and position of the image
      const rect = iphoneImage.getBoundingClientRect();
      
      // Calculate mouse position relative to image center
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate rotation values
      rotationY = ((event.clientX - centerX) / (rect.width / 2)) * 15;
      rotationX = -((event.clientY - centerY) / (rect.height / 2)) * 15;
      
      // Apply 3D transformation with subtle scale
      iphoneImage.style.transform = `perspective(1000px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(1.05)`;
      
      // Add dynamic shadow based on rotation
      const shadowX = -rotationY / 2;
      const shadowY = rotationX / 2;
      const shadowBlur = Math.abs(rotationX) + Math.abs(rotationY) + 10;
      iphoneImage.style.boxShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, 0.3)`;
    });
    
    // Handle touch events for mobile devices
    iphoneImage.addEventListener('touchstart', () => {
      isAnimating = true;
    });
    
    iphoneImage.addEventListener('touchend', () => {
      isAnimating = false;
      iphoneImage.style.transition = 'transform 0.5s ease-out';
      iphoneImage.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      setTimeout(() => {
        iphoneImage.style.transition = 'transform 0.2s ease-out';
      }, 500);
    });
    
    iphoneImage.addEventListener('touchmove', (event) => {
      if (!isAnimating) return;
      
      event.preventDefault();
      const touch = event.touches[0];
      
      const rect = iphoneImage.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      rotationY = ((touch.clientX - centerX) / (rect.width / 2)) * 15;
      rotationX = -((touch.clientY - centerY) / (rect.height / 2)) * 15;
      
      iphoneImage.style.transform = `perspective(1000px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(1.05)`;
    });
  }
}); 