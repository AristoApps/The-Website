// Professional Night Sky Effect
document.addEventListener('DOMContentLoaded', function() {
  const title = document.querySelector('.gradient-title');
  const canvas = document.getElementById('starsCanvas');
  
  if (!title || !canvas) return; // Exit if elements don't exist
  
  // Check if the device is mobile - based on screen size and user agent
  const isMobileDevice = () => {
    // Check screen width (common mobile breakpoint)
    const isMobileWidth = window.innerWidth <= 768;
    
    // Also check user agent for mobile devices
    const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Check for touch capability as additional indicator
    const hasTouchScreen = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    // Consider it a mobile device if either condition is true
    return (isMobileWidth && hasTouchScreen) || isMobileUserAgent;
  };
  
  // Function to check and update canvas visibility based on device type
  function updateCanvasVisibility() {
    if (isMobileDevice()) {
      // Hide the canvas completely on mobile
      canvas.style.display = 'none';
      return true; // Return true if mobile
    } else {
      // Show canvas on non-mobile
      canvas.style.display = 'block';
      return false; // Return false if not mobile
    }
  }
  
  // Disable the canvas for mobile devices - if mobile, exit the script entirely
  if (updateCanvasVisibility()) {
    // Add listeners for orientation change and resize in case device rotates to landscape
    window.addEventListener('resize', updateCanvasVisibility);
    window.addEventListener('orientationchange', updateCanvasVisibility);
    return; // Exit the script for mobile devices
  }
  
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
  let hoverIntensity = 0.6; // Base intensity (stars always visible), max is 1.0
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
        size: 0.3 + Math.random() * 1.0, // Increased star size (was 0.2 + random * 1.0)
        blinkSpeed: blinkSpeed,
        opacity: Math.random(),
        phase: Math.random() * Math.PI * 2, // Random starting phase for asynchronous blinking
        color: 'hsla(0, 0%, 100%, 0.8)', // Pure white stars
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
      size: 0.3 + Math.random() * 0.7, // Further reduced star thickness
      speed: speed,
      velocity: {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      },
      lifetime: 0,
      maxLifetime: maxLifetime, // Dynamic lifetime based on screen size
      trail: [],
      maxTrailLength: 8 + Math.random() * 12, // Shorter trails
      color: 'hsla(0, 0%, 100%, 0.5)', // Less bright
      direction: direction.name
    };
  }
  
  // Update shooting stars positions
  function updateShootingStars() {
    // Adjust hover intensity - rise quickly when hovering, fall slowly when not
    if (isHovering) {
      hoverIntensity = Math.min(1, hoverIntensity + 0.1);
    } else {
      // Don't let it fall below the base intensity (0.6)
      hoverIntensity = Math.max(0.6, hoverIntensity - 0.03);
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
      star.opacity = 0.2 + (Math.sin(time + star.phase) + 1) * 0.4; // More pronounced blinking
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
      const glow = star.size * 2.5; // Increased glow size (was 2.0)
      const radialGradient = ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, glow
      );
      
      radialGradient.addColorStop(0, star.color.replace('0.8', finalOpacity.toString()));
      radialGradient.addColorStop(1, star.color.replace('0.8', '0'));
      
      ctx.beginPath();
      ctx.arc(star.x, star.y, glow, 0, Math.PI * 2);
      ctx.fillStyle = radialGradient;
      ctx.fill();
      
      // Draw star center
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 0.6, 0, Math.PI * 2); // Increased center size (was 0.5)
      ctx.fillStyle = star.color.replace('0.8', finalOpacity.toString());
      ctx.fill();
    });
    
    // Draw shooting stars (always visible)
    shootingStars.forEach(star => {
      // Calculate opacity based on lifetime and hover intensity
      const lifetimeOpacity = Math.min(1, (star.maxLifetime - star.lifetime) / star.maxLifetime);
      const opacity = lifetimeOpacity * hoverIntensity;
      
      // Skip if barely visible
      if (opacity < 0.05) return;
      
      // Draw trail
      if (star.trail.length > 1) {
        ctx.beginPath();
        
        // Use gradient for trail
        const gradient = ctx.createLinearGradient(
          star.trail[0].x, star.trail[0].y,
          star.x, star.y
        );
        
        const color = star.color.replace('0.5', '0');
        const endColor = star.color.replace('0.5', opacity.toString());
        
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, endColor);
        
        ctx.moveTo(star.trail[0].x, star.trail[0].y);
        
        // Draw smooth curve instead of straight lines
        for (let i = 1; i < star.trail.length; i++) {
          const point = star.trail[i];
          
          // Use quadratic curves for smoother trails
          if (i < star.trail.length - 1) {
            const nextPoint = star.trail[i+1];
            const cpX = (point.x + nextPoint.x) / 2;
            const cpY = (point.y + nextPoint.y) / 2;
            ctx.quadraticCurveTo(point.x, point.y, cpX, cpY);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        }
        
        // Set trail style
        ctx.strokeStyle = gradient;
        ctx.lineWidth = star.size * 1.0; // Thinner
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }
      
      // Draw star point with glow
      const glow = star.size * 2.2; // Reduced glow
      const radialGradient = ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, glow
      );
      
      radialGradient.addColorStop(0, star.color.replace('0.5', opacity.toString()));
      radialGradient.addColorStop(1, star.color.replace('0.5', '0'));
      
      ctx.beginPath();
      ctx.arc(star.x, star.y, glow, 0, Math.PI * 2);
      ctx.fillStyle = radialGradient;
      ctx.fill();
      
      // Draw star center
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 0.8, 0, Math.PI * 2); // Smaller center
      ctx.fillStyle = star.color.replace('0.5', opacity.toString());
      ctx.fill();
    });
  }
  
  // Main animation loop
  function animate() {
    updateShootingStars();
    drawNightSky();
    requestAnimationFrame(animate);
  }
  
  // Track hover state and mouse position on the title
  title.addEventListener('mousemove', function(e) {
    isHovering = true;
    
    // Calculate mouse position relative to title center for parallax effect
    const rect = title.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate percentage from center (-1 to 1)
    mouseX = (e.clientX - centerX) / (rect.width / 2);
    mouseY = (e.clientY - centerY) / (rect.height / 2);
  });
  
  title.addEventListener('mouseenter', function() {
    isHovering = true;
  });
  
  title.addEventListener('mouseleave', function() {
    isHovering = false;
    // Reset mouse position to center when leaving
    mouseX = 0;
    mouseY = 0;
  });
  
  // Initialize static stars
  initStaticStars();
  
  // Start animation
  animate();
}); 
