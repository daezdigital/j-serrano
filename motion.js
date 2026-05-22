/**
 * Reformas Integrales J.Serrano — motion.js
 * Awwwards-level Motion Design: Lenis, GSAP ScrollTrigger, Custom Cursor, Magnetic Buttons
 */

function initMotion() {
  // 1. Initialize Lenis (Smooth Scroll)
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Sync GSAP ScrollTrigger with Lenis
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    lenis.on('scroll', ScrollTrigger.update);
    
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);
  }

  // 2. Custom Cursor
  const cursor = document.getElementById('custom-cursor');
  if (cursor && typeof gsap !== 'undefined') {
    // Hide default cursor globally on desktop
    document.body.classList.add('has-custom-cursor');

    // Use GSAP quickTo for performant follow with lerp
    let xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3" });
    let yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3" });

    window.addEventListener("mousemove", (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      
      // Ensure cursor is visible once mouse moves
      if (cursor.style.opacity === '0' || cursor.style.opacity === '') {
        gsap.to(cursor, { opacity: 1, duration: 0.3 });
      }
    });

    // Hover effects for links, buttons, and interactive elements
    const hoverables = document.querySelectorAll('a, button, .hacc-panel, .portfolio-item-large, .service-card');
    
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
      });
    });
  }

  // 3. Magnetic Buttons (Emil Kowalski style)
  const magneticButtons = document.querySelectorAll('.btn');
  
  magneticButtons.forEach(btn => {
    // Only apply on non-touch devices
    if(window.matchMedia("(hover: hover)").matches && typeof gsap !== 'undefined') {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate distance from center
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        
        // Move button towards cursor (subtle magnetic pull)
        gsap.to(btn, {
          x: distX * 0.2,
          y: distY * 0.2,
          duration: 0.6,
          ease: "power3.out"
        });
      });
      
      btn.addEventListener('mouseleave', () => {
        // Snap back to original position
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 1,
          ease: "elastic.out(1, 0.3)" // Spring effect on release
        });
      });
    }
  });

  // 4. Parallax Images
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const parallaxImages = document.querySelectorAll('.parallax-img, .service-detail-image img, .about-image-frame img, .hero-bg-image');
    
    parallaxImages.forEach(img => {
      // Ensure parent has overflow hidden
      if (img.parentElement) {
        img.parentElement.style.overflow = 'hidden';
      }
      
      // Initial scale
      gsap.set(img, { scale: 1.15 });
      
      gsap.to(img, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: img.parentElement,
          start: "top bottom", // when top of element hits bottom of viewport
          end: "bottom top",   // when bottom of element hits top of viewport
          scrub: true
        }
      });
    });

    // 5. Scroll-driven Text Reveals (Staggered)
    const revealElements = document.querySelectorAll('.reveal-clip-up, .reveal-fade, .service-card, .approach-item, .approach-stats');
    
    revealElements.forEach(el => {
      // Reset CSS properties that might conflict
      el.style.opacity = '0';
      el.style.animation = 'none';
      
      let startX = 0;
      let startY = 40;
      
      if (el.classList.contains('reveal-clip-left')) startX = -40;
      if (el.classList.contains('reveal-clip-right')) startX = 40;
      if (startX !== 0) startY = 0;
      
      const isClipUp = el.classList.contains('reveal-clip-up');
      
      gsap.fromTo(el, 
        { 
          opacity: 0, 
          y: startY, 
          x: startX,
          ...(isClipUp && { clipPath: "inset(0% 0% 100% 0%)" })
        },
        {
          opacity: 1, 
          y: 0,
          x: 0,
          ...(isClipUp && { clipPath: "inset(0% 0% 0% 0%)" }),
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%", 
            toggleActions: "play none none reverse",
            onEnter: () => el.classList.add('revealed'),
            onLeaveBack: () => el.classList.remove('revealed')
          }
        }
      );
    });

    // Dedicated About Image Reveal (More robust)
    const aboutImgs = document.querySelectorAll('.about-image-frame');
    aboutImgs.forEach(aboutImg => {
      aboutImg.style.opacity = '';
      aboutImg.style.transform = '';
      
      gsap.fromTo(aboutImg, 
        { opacity: 0, x: -60, clipPath: "inset(0% 100% 0% 0%)" },
        {
          opacity: 1,
          x: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.4,
          ease: "power4.out",
          scrollTrigger: {
            trigger: aboutImg,
            start: "top 95%",
            toggleActions: "play none none none",
            onEnter: () => aboutImg.classList.add('revealed')
          }
        }
      );
    });
  }

  // 6. Contact Form Handling
  const leadForm = document.getElementById('cvk-lead-form');
  const statusMsg = document.getElementById('form-status-message');

  if (leadForm && statusMsg) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = leadForm.querySelector('#submit-btn');
      const originalBtnText = submitBtn.textContent;
      
      // Visual feedback
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
      
      // Simulate API Call
      setTimeout(() => {
        statusMsg.textContent = '¡Gracias! Tu solicitud ha sido enviada. Nos pondremos en contacto contigo muy pronto.';
        statusMsg.className = 'success'; // See CSS for styling
        statusMsg.classList.remove('hidden');
        
        // Reset form
        leadForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        
        // Hide message after 5 seconds
        setTimeout(() => {
          statusMsg.classList.add('hidden');
        }, 5000);
      }, 1500);
    });
  }
}

// Initialize safely
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMotion);
} else {
  initMotion();
}
