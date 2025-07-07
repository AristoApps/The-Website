// Fallback to ensure navigation links are visible
document.addEventListener('DOMContentLoaded', function() {
  // Wait a short time to check if the links are visible
  setTimeout(() => {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Check if any links have become invisible
    navLinks.forEach(link => {
      // If the link has no visible text content
      if (link.offsetHeight === 0 || link.innerText.trim() === '') {
        console.log("Fixing invisible navigation link");
        
        // Get the original text from data attribute or parent element
        const originalText = link.getAttribute('data-original-text') || 
                            link.parentElement.textContent.trim();
        
        // Reset the link to its original state
        link.innerHTML = originalText;
        
        // Apply direct styling to ensure visibility
        link.style.background = 'linear-gradient(to right, #bdbdbd, #999999)';
        link.style.webkitBackgroundClip = 'text';
        link.style.webkitTextFillColor = 'transparent';
        link.style.color = 'transparent';
      }
    });
  }, 500);
}); 