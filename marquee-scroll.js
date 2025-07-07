// Enhanced Marquee scroll effect with seamless infinite animation
document.addEventListener('DOMContentLoaded', function() {
  const marqueeContent = document.querySelector('.marquee-content');
  
  if (!marqueeContent) return;
  
  // Clone the content for truly seamless looping
  function setupSeamlessScroll() {
    // Get all the children excluding any that might be clones
    const originalItems = Array.from(marqueeContent.children).filter(child => 
      !child.classList.contains('is-clone')
    );
    
    // Create enough copies to ensure smooth scrolling
    for (let i = 0; i < 2; i++) {
      originalItems.forEach(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('is-clone');
        marqueeContent.appendChild(clone);
      });
    }
    
    // Ensure we have enough content for very wide screens
    const contentWidth = marqueeContent.scrollWidth;
    const screenWidth = window.innerWidth;
    
    if (contentWidth < screenWidth * 3) {
      // Add more clones if needed
      originalItems.forEach(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('is-clone');
        marqueeContent.appendChild(clone);
      });
    }
  }
  
  // Set up initial state
  setupSeamlessScroll();
  
  // Pause animation on hover
  marqueeContent.addEventListener('mouseenter', function() {
    this.style.animationPlayState = 'paused';
  });
  
  // Resume animation when mouse leaves
  marqueeContent.addEventListener('mouseleave', function() {
    this.style.animationPlayState = 'running';
  });
  
  // Adjust animation speed based on screen width for consistent experience
  function adjustSpeed() {
    const screenWidth = window.innerWidth;
    // Faster on smaller screens, slower on larger screens
    const duration = '35s'; // Fixed duration for consistent speed
    marqueeContent.style.animationDuration = duration;
  }
  
  // Initial adjustment
  adjustSpeed();
  
  // Adjust on window resize
  window.addEventListener('resize', adjustSpeed);
}); 