/**
 * Simple typing animation for the quote
 * Adds the effect without modifying the existing structure
 */
document.addEventListener('DOMContentLoaded', function() {
  // Find the quote element (section with the quote text)
  const quoteSection = document.querySelector('section[id="some text"] h2');
  
  if (!quoteSection) return;
  
  // Get the original text and store it
  const originalText = quoteSection.textContent;
  
  // Hide the text immediately to prevent flash of content
  quoteSection.textContent = '';
  
  // Variables for typing effect
  let displayText = '';
  let charIndex = 0;
  let isTyping = false;
  let hasTyped = false;
  
  // Create the cursor element
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  
  // Create and append style for blinking cursor (only if it doesn't exist)
  if (!document.getElementById('typing-cursor-style')) {
    const style = document.createElement('style');
    style.id = 'typing-cursor-style';
    style.textContent = `
      .typing-cursor {
        display: inline-block;
        width: 2px;
        height: 1em;
        background-color: #fff;
        margin-left: 2px;
        vertical-align: text-top;
        animation: cursor-blink 0.8s step-end infinite;
      }
      
      @keyframes cursor-blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Function to type text character by character
  function typeText() {
    if (charIndex <= originalText.length) {
      displayText = originalText.substring(0, charIndex);
      quoteSection.textContent = displayText;
      quoteSection.appendChild(cursor);
      charIndex++;
      
      // Add pause at punctuation (with faster speeds)
      const lastChar = displayText.charAt(displayText.length - 1);
      let delay = 40; // Faster typing speed (was 80ms)
      
      if (lastChar === '—') {
        delay = 200; // Shorter pause at em dash (was 400ms)
      } else if (lastChar === '.') {
        delay = 300; // Shorter pause at period (was 600ms)
      }
      
      setTimeout(typeText, delay);
    } else {
      // Done typing
      hasTyped = true;
    }
  }
  
  // Set up the intersection observer to detect when the quote is visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Start typing immediately when the element becomes visible and hasn't been typed yet
      if (entry.isIntersecting && !isTyping && !hasTyped) {
        isTyping = true;
        // Start typing immediately
        typeText();
      }
    });
  }, { threshold: 0.2 }); // Lower threshold to trigger earlier
  
  // Start observing the quote section
  observer.observe(quoteSection.parentElement);
}); 