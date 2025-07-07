// Emergency fix for navigation links
window.addEventListener('load', function() {
  // Wait for everything to load
  setTimeout(() => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const navContainer = document.querySelector('.nav-links');
    
    // Check if navigation is empty or links are not visible
    if (navContainer && (navContainer.innerText.trim() === '' || 
        navLinks.length === 0 || 
        (navLinks.length > 0 && navLinks[0].offsetHeight === 0))) {
      
      console.log("EMERGENCY: Restoring navigation links");
      
      // Hard-coded navigation structure based on the original HTML
      navContainer.innerHTML = `
        <li><a href="#about" style="background: linear-gradient(to right, #bdbdbd, #999999); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">About</a></li>
        <li><a href="#services" style="background: linear-gradient(to right, #bdbdbd, #999999); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Services</a></li>
        <li><a href="#contact" style="background: linear-gradient(to right, #bdbdbd, #999999); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Get in Touch</a></li>
      `;
      
      // Add hover effect manually
      const restoredLinks = document.querySelectorAll('.nav-links a');
      restoredLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
          link.style.background = 'linear-gradient(to right, #ffffff, #ffffff)';
          link.style.webkitBackgroundClip = 'text';
          link.style.webkitTextFillColor = 'transparent';
        });
        
        link.addEventListener('mouseleave', () => {
          link.style.background = 'linear-gradient(to right, #bdbdbd, #999999)';
          link.style.webkitBackgroundClip = 'text';
          link.style.webkitTextFillColor = 'transparent';
        });
      });
    }
  }, 1000);
}); 