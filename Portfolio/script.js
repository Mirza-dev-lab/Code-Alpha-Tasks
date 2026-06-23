/* ============================================
   script.js — DecodeLabs Portfolio
   Decoupled, vanilla JS, DOM manipulation
   ============================================ */

(function() {
  'use strict';

  // ----- DOM refs (js- prefix for hooks) -----
  const themeToggle = document.querySelector('.js-theme-toggle');
  const interactBtn = document.querySelector('.js-interact');
  const demoMessage = document.getElementById('demoMessage');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  // ----- 1. Dark mode toggle (state + localStorage) -----
  const DARK_CLASS = 'dark-mode';
  const STORAGE_KEY = 'dl-theme-pref';

  // check saved preference or system
  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function setTheme(isDark) {
    document.body.classList.toggle(DARK_CLASS, isDark);
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    // update toggle button text
    if (themeToggle) {
      themeToggle.textContent = isDark ? '☀️ Light mode' : '🌓 Dark mode';
    }
  }

  // init theme
  const isDark = getPreferredTheme();
  setTheme(isDark);

  // toggle on click
  if (themeToggle) {
    themeToggle.addEventListener('click', function(e) {
      const currentlyDark = document.body.classList.contains(DARK_CLASS);
      setTheme(!currentlyDark);
    });
  }

  // ----- 2. Interactive demo: update message (DOM mutation) -----
  const demoPhrases = [
    '✨ You clicked! State updated.',
    '🚀 JavaScript at work!',
    '💡 DOM manipulation is fun.',
    '🎯 Event listener triggered.',
    '⚡ Interactive element engaged.'
  ];
  let phraseIndex = 0;

  if (interactBtn && demoMessage) {
    interactBtn.addEventListener('click', function() {
      // cycle through phrases
      const next = (phraseIndex + 1) % demoPhrases.length;
      phraseIndex = next;
      // use textContent (safe, no XSS)
      demoMessage.textContent = demoPhrases[phraseIndex];
      // bonus: change color temporarily (state visual)
      demoMessage.style.color = 'var(--color-accent)';
      setTimeout(() => {
        demoMessage.style.color = '';
      }, 600);
    });
  }

  // ----- 3. Responsive navigation: Popover API / hamburger -----
  if (navToggle && navMenu) {
    // use ARIA expanded + class toggle
    navToggle.addEventListener('click', function(e) {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // close menu on link click (for better UX)
    const navLinks = navMenu.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        // update active link
        navLinks.forEach(l => l.classList.remove('is-active'));
        this.classList.add('is-active');
      });
    });

    // close on outside click (optional)
    document.addEventListener('click', function(e) {
      const isClickInside = navToggle.contains(e.target) || navMenu.contains(e.target);
      if (!isClickInside && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ----- 4. Smooth scroll for anchor links (progressive enhancement) -----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // update URL without jumping
        history.pushState(null, null, targetId);
      }
    });
  });

  // ----- 5. Active nav link on scroll (Intersection Observer) -----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.35 });

    sections.forEach(section => observer.observe(section));
  }

  // ----- 6. Console greeting (just for fun) -----
  console.log('🚀 DecodeLabs · Frontend intern');
  console.log('📐 Static · Responsive · Interactive');
  console.log('💡 "Build it well, for the frontend is the only part the world sees."');

})();