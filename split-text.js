// Split Text Animation for Navigation Links
document.addEventListener('DOMContentLoaded', function() {
  // Get all navigation links
  const navLinks = document.querySelectorAll('.nav-links a');
  
  // Apply split text effect to each link
  navLinks.forEach(link => {
    // Store original text and styles
    const originalText = link.textContent;
    link.setAttribute('data-original-text', originalText);
    
    // Save original styles
    const computedStyle = window.getComputedStyle(link);
    const originalBackground = computedStyle.background;
    
    // Clear original content
    link.innerHTML = '';
    
    // Add each character in its own span
    originalText.split('').forEach((char, index) => {
      const charSpan = document.createElement('span');
      charSpan.className = 'split-char';
      charSpan.textContent = char === ' ' ? '\u00A0' : char; // Non-breaking space for spaces
      
      // Copy the original gradient styling
      charSpan.style.background = originalBackground;
      charSpan.style.webkitBackgroundClip = 'text';
      charSpan.style.webkitTextFillColor = 'transparent';
      charSpan.style.color = 'transparent';
      charSpan.style.display = 'inline-block';
      
      link.appendChild(charSpan);
    });
    
    // Add event listeners for hover animation
    link.addEventListener('mouseenter', () => {
      const charSpans = link.querySelectorAll('.split-char');
      charSpans.forEach((span, index) => {
        span.style.transition = `transform 0.3s ease ${index * 30}ms`;
        span.style.transform = 'translateY(-5px)';
        span.style.background = 'linear-gradient(to right, #ffffff, #ffffff)';
        span.style.webkitBackgroundClip = 'text';
        span.style.webkitTextFillColor = 'transparent';
      });
    });
    
    link.addEventListener('mouseleave', () => {
      const charSpans = link.querySelectorAll('.split-char');
      charSpans.forEach((span, index) => {
        span.style.transition = `transform 0.3s ease ${(charSpans.length - index - 1) * 30}ms`;
        span.style.transform = 'translateY(0)';
        span.style.background = originalBackground;
        span.style.webkitBackgroundClip = 'text';
        span.style.webkitTextFillColor = 'transparent';
      });
    });
  });
}); 