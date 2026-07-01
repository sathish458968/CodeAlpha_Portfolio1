/* =========================================================
   script.js — Sathish M Portfolio
   Handles: navbar, typed effect, scroll reveal,
            skill bars, hamburger menu
   ========================================================= */

/* ── Sticky Navbar ──────────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveLink();
});

/* ── Active Nav Link on Scroll ──────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');
    if (scrollPos >= top && scrollPos < bottom) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}

/* ── Hamburger Menu ──────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
  // Prevent body scroll when menu is open
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

// Close menu on nav link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ── Typed Text Effect ───────────────────────────────────── */
const phrases = [
  'Frontend Developer',
  'B.Tech IT Student',
  'UI/UX Enthusiast',
  'Web Creator',
];

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
let typingTimer;

function type() {
  const current = phrases[phraseIndex];
  const el      = document.getElementById('typed-text');

  if (!el) return;

  if (isDeleting) {
    el.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    el.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 55 : 95;

  if (!isDeleting && charIndex === current.length) {
    speed = 1800; // pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    speed = 400;
  }

  typingTimer = setTimeout(type, speed);
}

// Start typing after short delay
setTimeout(type, 600);

/* ── Scroll Reveal Animations ───────────────────────────── */
const revealEls = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children by index
        const delay = (i % 4) * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ── 3D Tilt Effect on Skill Cards ───────────────────────── */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
  });
});

/* ── Smooth Scroll for Anchor Links ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Download Resume Button ──────────────────────────────── */
// Shows a friendly toast since no actual resume file exists yet
const resumeBtn = document.getElementById('download-resume');
if (resumeBtn) {
  resumeBtn.addEventListener('click', (e) => {
    // If you have a resume file, change the href to point to it:
    // resumeBtn.setAttribute('href', 'resume.pdf');
    // resumeBtn.setAttribute('download', 'Sathish_M_Resume.pdf');
    // Otherwise show a toast:
    e.preventDefault();
    showToast('📄 Resume link will be added soon!');
  });
}

/* ── Toast Notification ──────────────────────────────────── */
function showToast(message) {
  // Remove any existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  // Inline styles so it works without extra CSS
  Object.assign(toast.style, {
    position:        'fixed',
    bottom:          '2rem',
    left:            '50%',
    transform:       'translateX(-50%) translateY(20px)',
    background:      'rgba(13,13,31,0.95)',
    border:          '1px solid rgba(108,99,255,0.35)',
    color:           '#f0f0ff',
    padding:         '.75rem 1.5rem',
    borderRadius:    '50px',
    fontSize:        '.9rem',
    fontFamily:      "'Space Grotesk', sans-serif",
    zIndex:          '9999',
    backdropFilter:  'blur(12px)',
    boxShadow:       '0 8px 24px rgba(0,0,0,0.4)',
    transition:      'opacity .3s ease, transform .3s ease',
    opacity:         '0',
    pointerEvents:   'none',
  });

  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity   = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  // Animate out and remove
  setTimeout(() => {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 350);
  }, 2800);
}

/* ── Project / Demo Button Toast ────────────────────────── */
document.querySelectorAll('.btn-demo').forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (btn.getAttribute('href') === '#') {
      e.preventDefault();
      showToast('🚀 Live demo link coming soon!');
    }
  });
});

/* ── Theme Toggle ───────────────────────────────────────── */
const themeToggleBtn = document.getElementById('theme-toggle');
// Set initial theme based on localStorage or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    showToast(`☀ ${newTheme === 'light' ? 'Light' : 'Dark'} mode enabled!`);
  });
}

/* ── Loading Screen Hide ─────────────────────────────────── */
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
    // Set display none after opacity animation completes
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 600);
  }
});

/* ── Custom Cursor ───────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');

if (cursor && cursorDot) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
  });

  // Expand cursor on hover of interactive elements using event delegation
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .project-card, .cert-card, .contact-card, .social-pill')) {
      cursor.classList.add('hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, .project-card, .cert-card, .contact-card, .social-pill')) {
      cursor.classList.remove('hover');
    }
  });
}

/* ── Scroll Progress Bar ─────────────────────────────────── */
window.addEventListener('scroll', () => {
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }
});

/* ── Particle Background Canvas ─────────────────────────── */
const pCanvas = document.getElementById('rw-particle-canvas');
if (pCanvas) {
  const ctx = pCanvas.getContext('2d');
  let particles = [];
  let w = (pCanvas.width = window.innerWidth);
  let h = (pCanvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    w = pCanvas.width = window.innerWidth;
    h = pCanvas.height = window.innerHeight;
    initParticles();
  });

  class Particle {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = Math.random() * 0.3 - 0.15;
      this.speedY = Math.random() * 0.3 - 0.15;
      this.color = Math.random() > 0.5 ? 'rgba(108, 99, 255, 0.25)' : 'rgba(56, 189, 248, 0.25)';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around edges instead of bouncing for a smoother "space drift" feel
      if (this.x < 0) this.x = w;
      if (this.x > w) this.x = 0;
      if (this.y < 0) this.y = h;
      if (this.y > h) this.y = 0;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(50, Math.floor((w * h) / 30000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();
}

/* ── Back-to-top Button ──────────────────────────────────── */
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Project Lightbox ───────────────────────────────────── */
const lightbox = document.getElementById('lightbox');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDesc = document.getElementById('lightbox-desc');
const lightboxTags = document.getElementById('lightbox-tags');
const lightboxLink = document.getElementById('lightbox-link');
const lightboxGithub = document.getElementById('lightbox-github');

if (lightbox && lightboxClose) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // If user clicked inside project-actions directly, don't trigger lightbox
      if (e.target.closest('.project-actions')) return;

      const title = card.querySelector('.project-title').textContent;
      const desc = card.querySelector('.project-desc').textContent;
      
      // Split tags by dot separator and trim
      const rawTagsText = card.querySelector('.project-tag') ? card.querySelector('.project-tag').textContent : '';
      const tags = rawTagsText.split('·').map(t => t.trim()).filter(Boolean);
      
      const demoUrl = card.querySelector('.btn-demo').getAttribute('href');
      const githubUrl = card.querySelector('.btn-github').getAttribute('href');

      // Populate lightbox
      lightboxTitle.textContent = title;
      lightboxDesc.textContent = desc;
      
      lightboxTags.innerHTML = '';
      tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'lightbox-tag';
        span.textContent = tag;
        lightboxTags.appendChild(span);
      });

      lightboxLink.setAttribute('href', demoUrl);
      lightboxGithub.setAttribute('href', githubUrl);

      // Open lightbox
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    // Restore overflow if navbar drawer is not open
    const navLinksMenu = document.getElementById('nav-links');
    if (navLinksMenu && !navLinksMenu.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  };

  lightboxClose.addEventListener('click', closeLightbox);

  // Close when clicking backdrop
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close with escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });

  // Intercept demo link inside lightbox if it is #
  if (lightboxLink) {
    lightboxLink.addEventListener('click', (e) => {
      if (lightboxLink.getAttribute('href') === '#') {
        e.preventDefault();
        showToast('🚀 Live demo link coming soon!');
      }
    });
  }
}
/* ── Hero Parallax Effect ────────────────────────────────── */
const heroSection = document.getElementById('hero');
if (heroSection) {
  const orb1 = document.querySelector('.hero-orb-1');
  const orb2 = document.querySelector('.hero-orb-2');
  const fTags = document.querySelectorAll('.ftag');
  
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    if (orb1) orb1.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
    if (orb2) orb2.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
    
    fTags.forEach((tag, i) => {
      const factor = (i + 1) * 8;
      tag.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });
  
  heroSection.addEventListener('mouseleave', () => {
    if (orb1) orb1.style.transform = '';
    if (orb2) orb2.style.transform = '';
    fTags.forEach(tag => { tag.style.transform = ''; });
  });
}

/* ── Contact Form Validation ─────────────────────────────── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const fields = [
    { id: 'form-name', errorId: 'error-name', validate: v => v.trim().length >= 2, msg: 'Name must be at least 2 characters' },
    { id: 'form-email', errorId: 'error-email', validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Please enter a valid email' },
    { id: 'form-subject', errorId: 'error-subject', validate: v => v.trim().length >= 3, msg: 'Subject must be at least 3 characters' },
    { id: 'form-message', errorId: 'error-message', validate: v => v.trim().length >= 10, msg: 'Message must be at least 10 characters' },
  ];

  // Real-time validation on blur
  fields.forEach(f => {
    const input = document.getElementById(f.id);
    const error = document.getElementById(f.errorId);
    if (input) {
      input.addEventListener('blur', () => {
        if (input.value.trim() === '') {
          input.classList.remove('error', 'success');
          error.textContent = '';
        } else if (!f.validate(input.value)) {
          input.classList.add('error');
          input.classList.remove('success');
          error.textContent = f.msg;
        } else {
          input.classList.remove('error');
          input.classList.add('success');
          error.textContent = '';
        }
      });
    }
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    fields.forEach(f => {
      const input = document.getElementById(f.id);
      const error = document.getElementById(f.errorId);
      if (!f.validate(input.value)) {
        input.classList.add('error');
        input.classList.remove('success');
        error.textContent = f.msg;
        valid = false;
      } else {
        input.classList.remove('error');
        input.classList.add('success');
        error.textContent = '';
      }
    });

    if (valid) {
      const submitBtn = document.getElementById('form-submit');
      const submitText = submitBtn.querySelector('.form-submit-text');
      submitBtn.classList.add('sent');
      submitText.textContent = '✓ Message Sent!';
      showToast('✅ Your message has been sent successfully!');

      // Reset form after 3 seconds
      setTimeout(() => {
        contactForm.reset();
        submitBtn.classList.remove('sent');
        submitText.textContent = 'Send Message';
        fields.forEach(f => {
          const input = document.getElementById(f.id);
          input.classList.remove('success', 'error');
          document.getElementById(f.errorId).textContent = '';
        });
      }, 3000);
    }
  });
}

/* ── On DOM Ready ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Trigger initial active state
  updateActiveLink();

  // Animate hero elements immediately (they start hidden via data-reveal)
  document.querySelectorAll('.hero [data-reveal]').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 100 + i * 150);
  });

  // Dynamic footer year
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});