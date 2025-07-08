document.addEventListener('DOMContentLoaded', () => {
  // Find the marquee container and content
  const marqueeContainer = document.querySelector('.marquee-container');
  const marqueeContent = document.querySelector('.marquee-content');
  const techItems = document.querySelectorAll('.marquee-content > span:not(.divider)');
  
  if (marqueeContainer && marqueeContent && techItems.length > 0) {
    // Add perspective to the container for 3D effect
    marqueeContainer.style.perspective = '1000px';
    
    // Pause animation on hover
    marqueeContainer.addEventListener('mouseenter', () => {
      marqueeContent.style.animationPlayState = 'paused';
    });
    
    marqueeContainer.addEventListener('mouseleave', () => {
      marqueeContent.style.animationPlayState = 'running';
      
      // Reset all items to normal state
      techItems.forEach(item => {
        item.style.transform = 'translateZ(0) scale(1)';
        item.style.filter = 'none';
        item.style.zIndex = '1';
      });
    });
    
    // Add 3D effect on mousemove
    marqueeContainer.addEventListener('mousemove', (e) => {
      // Get container dimensions and mouse position
      const rect = marqueeContainer.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Apply 3D effect to each tech item based on distance from mouse
      techItems.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        const itemCenterX = itemRect.left + itemRect.width / 2 - rect.left;
        const itemCenterY = itemRect.top + itemRect.height / 2 - rect.top;
        
        // Calculate distance from mouse to item center
        const deltaX = mouseX - itemCenterX;
        const deltaY = mouseY - itemCenterY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Calculate effect intensity based on proximity (closer = stronger effect)
        const maxDistance = 150; // Maximum distance for effect in pixels
        const effectIntensity = Math.max(0, 1 - distance / maxDistance);
        
        if (effectIntensity > 0) {
          // Apply elevation, rotation and scale based on mouse position
          const elevation = effectIntensity * 50; // Max 50px elevation
          const rotateX = (deltaY / maxDistance) * -10 * effectIntensity; // Tilt based on Y distance
          const rotateY = (deltaX / maxDistance) * 10 * effectIntensity; // Tilt based on X distance
          const scale = 1 + effectIntensity * 0.2; // Max 20% scale increase
          
          // Apply 3D transform
          item.style.transform = `translateZ(${elevation}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
          
          // Add glow effect
          item.style.filter = `drop-shadow(0 0 ${effectIntensity * 10}px rgba(255, 255, 255, ${effectIntensity * 0.8}))`;
          
          // Bring elevated items to front
          item.style.zIndex = Math.floor(effectIntensity * 10) + 1;
        } else {
          // Reset items that are far from mouse
          item.style.transform = 'translateZ(0) scale(1)';
          item.style.filter = 'none';
          item.style.zIndex = '1';
        }
      });
    });
    
    // Apply initial styles to tech items for smooth transitions
    techItems.forEach(item => {
      item.style.transition = 'transform 0.15s ease-out, filter 0.15s ease-out';
      item.style.transformStyle = 'preserve-3d';
      item.style.willChange = 'transform, filter, z-index';
      item.style.position = 'relative';
      item.style.display = 'inline-block';
    });
  }
}); 
