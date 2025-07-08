// Professional Night Sky Effect
document.addEventListener('DOMContentLoaded', function() {
  const title = document.querySelector('.gradient-title');
  const canvas = document.getElementById('starsCanvas');
  
  if (!title || !canvas) return; // Exit if elements don't exist
  
  // Set canvas size to match viewport
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  // Call once on load
  resizeCanvas();
  
  // Update on window resize
  window.addEventListener('resize', resizeCanvas);
  
  const ctx = canvas.getContext('2d');
  
  // Star properties
  let shootingStars = [];
  let staticStars = [];
  const maxShootingStars = 5; // Maximum number of shooting stars
  const staticStarCount = 150; // Number of static stars
  
  // Track if we're hovering
  let isHovering = false;
  let hoverIntensity = 0.8; // Increased base intensity from 0.6 to 0.8 for more visibility when not hovering
  let lastShootingStarTime = 0; // Track when the last shooting star was created
  const minTimeBetweenStars = 3000; // Increased time between new stars when not hovering
  const hoverMinTimeBetweenStars = 800; // Faster stars when hovering
  
  // Mouse position for interactive movement
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  
  // Define direction for stars to travel (top-right to bottom-left)
  const direction = { angle: Math.PI * 0.75, name: 'top-right-to-bottom-left' }; // Diagonal from top-right to bottom-left
  
  // Initialize static stars
  function initStaticStars() {
    for (let i = 0; i < staticStarCount; i++) {
      // Highly varied blinking speeds for more natural effect
      const blinkSpeed = 0.0005 + Math.random() * 0.003;
      
      // Distribute stars evenly across the viewport
      staticStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        // Save original position for reference during movement
        originalX: Math.random() * canvas.width,
        originalY: Math.random() * canvas.height,
        size: 0.4 + Math.random() * 1.2, // Increased star size for more visibility
        blinkSpeed: blinkSpeed,
        opacity: Math.random() * 0.3 + 0.4, // Increased base opacity range from (0-1) to (0.4-0.7)
        phase: Math.random() * Math.PI * 2, // Random starting phase for asynchronous blinking
        color: 'hsla(0, 0%, 100%, 0.9)', // Brighter white stars (increased from 0.8)
        depth: Math.random() * 0.5 + 0.1 // Depth factor for parallax effect (0.1-0.6)
      });
    }
  }
  
  // Random position along the top edge of the canvas, across the full width
  function getRandomStartPosition() {
    // Position anywhere along the top of the screen
    const x = Math.random() * canvas.width;
    const y = -30; // Start slightly above the top edge
    
    return { x, y };
  }
  
  // Calculate max lifetime based on screen height and star speed
  function calculateMaxLifetime(speed) {
    // Estimate how many frames it will take to reach bottom of screen
    // Add a safety factor of 1.5 to ensure it reaches the bottom
    const distanceToBottom = canvas.height * 1.5;
    const framesNeeded = distanceToBottom / speed;
    return Math.ceil(framesNeeded) + 50; // Add additional frames as buffer
  }
  
  // Create a new shooting star
  function createShootingStar() {
    // Get random start position
    const startPos = getRandomStartPosition();
    
    // Add variation to the angle (±10 degrees)
    const angleVariation = (Math.random() - 0.5) * Math.PI/9;
    const angle = direction.angle + angleVariation;
    
    // Slower speed
    const speed = 8 + Math.random() * 1.8; // Significantly reduced speed
    
    // Calculate max lifetime based on speed and screen size
    const maxLifetime = calculateMaxLifetime(speed);
    
    return {
      x: startPos.x,
      y: startPos.y,
      size: 0.4 + Math.random() * 0.8, // Increased star thickness
      speed: speed,
      velocity: {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      },
      lifetime: 0,
      maxLifetime: maxLifetime, // Dynamic lifetime based on screen size
      trail: [],
      maxTrailLength: 8 + Math.random() * 12, // Shorter trails
      color: 'hsla(0, 0%, 100%, 0.7)', // Brighter shooting stars (increased from 0.5)
      direction: direction.name
    };
  }
  
  // Update shooting stars positions
  function updateShootingStars() {
    // Adjust hover intensity - rise quickly when hovering, fall slowly when not
    if (isHovering) {
      hoverIntensity = Math.min(1.2, hoverIntensity + 0.1); // Increase max intensity to 1.2 for extra brightness
    } else {
      // Don't let it fall below the base intensity (0.8, increased from 0.6)
      hoverIntensity = Math.max(0.8, hoverIntensity - 0.03);
    }
    
    // Current time for delay check
    const currentTime = Date.now();
    
    // Determine time between stars based on hover state
    const currentMinTimeBetweenStars = isHovering ? 
                                       hoverMinTimeBetweenStars : 
                                       minTimeBetweenStars;
    
    // Always create new stars, but at different rates depending on hover state
    if (shootingStars.length < maxShootingStars && 
        currentTime - lastShootingStarTime > currentMinTimeBetweenStars &&
        Math.random() < (isHovering ? 0.1 : 0.02)) { // Different probability based on hover
      
      shootingStars.push(createShootingStar());
      lastShootingStarTime = currentTime;
    }
    
    // Update all shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const star = shootingStars[i];
      
      // Update position
      star.x += star.velocity.x;
      star.y += star.velocity.y;
      
      // Add current position to trail
      star.trail.push({ x: star.x, y: star.y });
      
      // Trim trail if too long
      if (star.trail.length > star.maxTrailLength) {
        star.trail.shift();
      }
      
      // Increase lifetime
      star.lifetime++;
      
      // Only remove if it's definitely off the bottom of the screen
      // or way off to the sides
      if (
        star.x < -100 || 
        star.x > canvas.width + 100 ||
        star.y > canvas.height + 100 || // Only remove when below the bottom
        (star.lifetime > star.maxLifetime) // Backup condition
      ) {
        shootingStars.splice(i, 1);
      }
    }
    
    // Update static stars positions based on mouse movement - always update stars
    // Smooth transition to target
    targetX += (mouseX - targetX) * 0.1;
    targetY += (mouseY - targetY) * 0.1;
    
    // Calculate movement factors - increased from 30 to 50 for more movement
    const maxOffset = isHovering ? 100 : 30; // Maximum pixel offset for movement
    
    // Update each static star position
    staticStars.forEach(star => {
      // Create parallax effect based on star's depth
      const moveX = targetX * maxOffset * star.depth;
      const moveY = targetY * maxOffset * star.depth;
      
      // Move star from its original position
      star.x = star.originalX + moveX;
      star.y = star.originalY + moveY;
      
      // Create a subtle sinusoidal blinking effect with varied frequencies
      const time = Date.now() * star.blinkSpeed;
      star.opacity = 0.4 + (Math.sin(time + star.phase) + 1) * 0.3; // Increased min opacity from 0.2 to 0.4
    });
  }
  
  // Draw night sky effect
  function drawNightSky() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw static stars (always visible)
    staticStars.forEach(star => {
      // Calculate final opacity based on hover intensity
      const finalOpacity = star.opacity * hoverIntensity;
      
      // Draw the star with glow
      const glow = star.size * 3.0; // Increased glow size from 2.5
      const radialGradient = ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, glow
      );
      
      radialGradient.addColorStop(0, `rgba(255, 255, 255, ${finalOpacity})`);
      radialGradient.addColorStop(0.1, `rgba(225, 245, 255, ${finalOpacity * 0.9})`); // Brighter inner glow
      radialGradient.addColorStop(0.3, `rgba(180, 215, 255, ${finalOpacity * 0.4})`); // Brighter mid glow
      radialGradient.addColorStop(1, 'rgba(120, 140, 255, 0)');
      
      ctx.beginPath();
      ctx.fillStyle = radialGradient;
      ctx.arc(star.x, star.y, glow, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw shooting stars with trails
    shootingStars.forEach(star => {
      // No shooting stars if hover intensity is too low
      if (hoverIntensity < 0.4) return;
      
      // Adjust opacity based on lifetime for fade-in, fade-out effect
      const lifeProgress = star.lifetime / star.maxLifetime;
      let opacity;
      
      // Fade in quickly, stay visible for most of lifetime, then fade out near end
      if (lifeProgress < 0.1) {
        // Fade in over first 10% of lifetime
        opacity = lifeProgress * 10;
      } else if (lifeProgress > 0.85) {
        // Fade out over last 15% of lifetime
        opacity = (1 - lifeProgress) / 0.15;
      } else {
        // Full opacity for middle 75% of lifetime
        opacity = 1;
      }
      
      // Scale opacity by hover intensity
      opacity *= hoverIntensity;
      
      // Cap opacity with higher max (1.0 instead of 0.8)
      opacity = Math.min(opacity, 1.0);
      
      // No need to draw if opacity is too low
      if (opacity < 0.03) return;
      
      // Draw trail
      if (star.trail.length > 1) {
        // Create gradient for the trail
        const gradient = ctx.createLinearGradient(
          star.trail[0].x, star.trail[0].y,
          star.x, star.y
        );
        
        gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
        gradient.addColorStop(0.3, `rgba(255, 255, 255, ${opacity * 0.15})`); // Brighter trail mid-point
        gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity})`);
        
        // Draw the trail as a path
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = star.size;
        ctx.lineCap = 'round';
        
        // Draw the path through all trail points
        ctx.moveTo(star.trail[0].x, star.trail[0].y);
        for (let i = 1; i < star.trail.length; i++) {
          ctx.lineTo(star.trail[i].x, star.trail[i].y);
        }
        
        ctx.stroke();
        
        // Draw core of the star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 1.8, 0, Math.PI * 2); // Increased core size from 1.5
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`; 
        ctx.fill();
        
        // Add a subtle glow around the head
        const headGlow = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 6 // Increased glow radius from 5
        );
        
        headGlow.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.9})`); // Brighter center (0.7 to 0.9)
        headGlow.addColorStop(0.5, `rgba(220, 235, 255, ${opacity * 0.4})`); // Brighter mid glow (0.3 to 0.4)
        headGlow.addColorStop(1, 'rgba(170, 200, 255, 0)'); // Slightly brighter outer edge
        
        ctx.beginPath();
        ctx.fillStyle = headGlow;
        ctx.arc(star.x, star.y, star.size * 6, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
  
  // Function to track mouse position
  function trackMouse(e) {
    // Convert mouse position to normalized coordinates (-1 to 1)
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  }
  
  // Functions to handle hover state
  function setHovering() {
    isHovering = true;
  }
  
  function setNotHovering() {
    isHovering = false;
  }
  
  // Handle touch events
  function handleTouchStart(e) {
    isHovering = true;
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
      mouseY = (touch.clientY / window.innerHeight) * 2 - 1;
    }
  }
  
  function handleTouchMove(e) {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
      mouseY = (touch.clientY / window.innerHeight) * 2 - 1;
    }
  }
  
  function handleTouchEnd() {
    // Keep isHovering true for a short time after touch ends to avoid flickering
    setTimeout(() => {
      isHovering = false;
    }, 500);
  }
  
  // Add event listeners
  document.addEventListener('mousemove', trackMouse);
  title.addEventListener('mouseenter', setHovering);
  title.addEventListener('mouseleave', setNotHovering);
  
  // Add touch events for mobile
  title.addEventListener('touchstart', handleTouchStart);
  title.addEventListener('touchmove', handleTouchMove);
  title.addEventListener('touchend', handleTouchEnd);
  
  // Animation loop
  function animate() {
    // Only update and draw if canvas is visible in the viewport
    const rect = canvas.getBoundingClientRect();
    if (
      rect.bottom >= 0 &&
      rect.right >= 0 &&
      rect.top <= window.innerHeight &&
      rect.left <= window.innerWidth
    ) {
      updateShootingStars();
      drawNightSky();
    }
    
    requestAnimationFrame(animate);
  }
  
  // Initialize and start animation
  initStaticStars();
  animate();
}); 
