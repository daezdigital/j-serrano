/**
 * Reformas Integrales J.Serrano — app.js
 * Scroll animations, nav, testimonials
 */

// --- HERO ACCORDION ---
const haccPanels = document.querySelectorAll('.hacc-panel');
if (haccPanels.length) {
  haccPanels.forEach((panel) => {
    panel.addEventListener('mouseenter', () => {
      haccPanels.forEach(p => p.classList.remove('hacc-active'));
      panel.classList.add('hacc-active');
    });
    // Touch support
    panel.addEventListener('touchstart', () => {
      haccPanels.forEach(p => p.classList.remove('hacc-active'));
      panel.classList.add('hacc-active');
    }, { passive: true });
  });
}


// --- NAV OVERLAY ---
const menuToggle = document.getElementById('menu-toggle');
const navOverlay = document.getElementById('nav-overlay');
const overlayLinks = document.querySelectorAll('.overlay-link');

menuToggle.addEventListener('click', () => {
  const isOpen = navOverlay.classList.toggle('open');
  menuToggle.classList.toggle('menu-open', isOpen);
  header.classList.toggle('menu-open', isOpen);
  menuToggle.querySelector('.toggle-label').textContent = isOpen ? 'Cerrar' : 'Menú';
  navOverlay.setAttribute('aria-hidden', String(!isOpen));
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

overlayLinks.forEach(link => {
  link.addEventListener('click', () => {
    navOverlay.classList.remove('open');
    menuToggle.classList.remove('menu-open');
    header.classList.remove('menu-open');
    menuToggle.querySelector('.toggle-label').textContent = 'Menú';
    navOverlay.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// --- HEADER SCROLL STATE ---
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// --- SCROLL REVEAL via IntersectionObserver ---
// Handled globally by GSAP in motion.js

// --- TESTIMONIALS SLIDER ---
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let autoplayInterval;

if (slides.length > 0) {
  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  document.getElementById('prev-testimonial')?.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoplay(); });
  document.getElementById('next-testimonial')?.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoplay(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => { goToSlide(parseInt(dot.dataset.index)); resetAutoplay(); });
  });

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }
  resetAutoplay();
}

// --- TICKER pause on hover ---
const ticker = document.querySelector('.ticker-track');
if (ticker) {
  const wrap = ticker.closest('.ticker-wrap');
  wrap.addEventListener('mouseenter', () => { ticker.style.animationPlayState = 'paused'; });
  wrap.addEventListener('mouseleave', () => { ticker.style.animationPlayState = 'running'; });
}

// --- SMOOTH SCROLL for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
