// ===== NAVBAR: scroll effect & active link tracking =====
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section, .hero');

function onScroll() {
  // Add "scrolled" class to navbar
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Highlight active nav link
  let current = '';
  sections.forEach((section) => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('open');
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', !expanded);
});

// Close mobile menu when a link is clicked
navMenu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navToggle.classList.remove('active');
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

// ===== SCROLL-REVEAL ANIMATION =====
const revealElements = document.querySelectorAll(
  '.skill-category, .project-card, .timeline-item, .highlight-card, .about-text, .contact-form'
);

// Add the reveal class
revealElements.forEach((el) => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => revealObserver.observe(el));

// ===== CONTACT FORM (basic client-side handling) =====
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
  // If no real form backend is configured, prevent default and show a message
  const action = contactForm.getAttribute('action');
  if (!action || action.includes('YOUR_FORM_ID')) {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Thanks! ✓';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    // Reset after 3 seconds
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.disabled = false;
      btn.style.opacity = '1';
      contactForm.reset();
    }, 3000);
  }
});

// ===== SMOOTH SCROLL for Safari fallback =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
