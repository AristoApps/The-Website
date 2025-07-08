// This script ensures the website's colors don't adapt to system dark mode settings
document.addEventListener('DOMContentLoaded', () => {
  // Force document to use light color scheme regardless of system preference
  document.documentElement.style.colorScheme = 'only light';
  
  // Prevent automatic dark mode adaptation in browsers that support it
  if (window.matchMedia) {
    // Listen for changes to the prefers-color-scheme media query
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Function to handle when the color scheme preference changes
    const handleColorSchemeChange = () => {
      // Force light mode regardless of system preference
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.style.colorScheme = 'only light';
      
      // Ensure all color values remain as specified in CSS
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        if (window.getComputedStyle(el).getPropertyValue('color') === 'rgba(0, 0, 0, 0)') {
          el.style.color = 'initial';
        }
      });
    };
    
    // Initial call
    handleColorSchemeChange();
    
    // Set up listener for changes
    darkModeMediaQuery.addEventListener('change', handleColorSchemeChange);
  }
}); 
