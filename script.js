// Lightweight slider + theme toggle + mobile nav
(function () {
  // Slider
  const slidesEl = document.getElementById('slides');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const indicatorsEl = document.getElementById('slideIndicators');
  let current = 0;
  let autoplay = true;
  let autoplayInterval = 6000;
  let autoplayId = null;

  function createIndicators() {
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.dataset.index = i;
      btn.addEventListener('click', () => goTo(i, true));
      indicatorsEl.appendChild(btn);
    });
  }

  function updateIndicators(idx) {
    Array.from(indicatorsEl.children).forEach((b, i) => {
      b.setAttribute('aria-selected', i === idx ? 'true' : 'false');
    });
  }

  function goTo(index, userTriggered = false) {
    current = (index + slides.length) % slides.length;
    slidesEl.style.transform = `translateX(-${current * 100}%)`;
    updateIndicators(current);
    if (userTriggered) {
      pauseAutoplay();
    }
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    if (!autoplay) return;
    autoplayId = setInterval(next, autoplayInterval);
  }

  function pauseAutoplay() {
    clearInterval(autoplayId);
    autoplayId = null;
    // restart after some idle if desired
    setTimeout(() => {
      startAutoplay();
    }, 12000);
  }

  // keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // hover pause
  document.querySelector('.hero-slider').addEventListener('mouseenter', pauseAutoplay);
  document.querySelector('.hero-slider').addEventListener('mouseleave', startAutoplay);

  // controls
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // init
  createIndicators();
  startAutoplay();

  // Theme toggle (stores in localStorage)
  const themeToggle = document.getElementById('themeToggle');
  function applyTheme(t) {
    if (t === 'dark') {
      document.body.classList.add('dark');
      themeToggle.textContent = '☀️';
    } else {
      document.body.classList.remove('dark');
      themeToggle.textContent = '🌙';
    }
    localStorage.setItem('mvn-theme', t);
  }
  const saved = localStorage.getItem('mvn-theme') || 'light';
  applyTheme(saved);
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    applyTheme(isDark ? 'dark' : 'light');
  });

  // Mobile nav toggle
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNav = document.getElementById('mobileNav');
  mobileNavToggle.addEventListener('click', () => {
    const expanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
    mobileNavToggle.setAttribute('aria-expanded', String(!expanded));
    mobileNav.setAttribute('aria-hidden', String(expanded));
    mobileNav.style.display = expanded ? 'none' : 'flex';
  });

  // Accessibility: ensure slides announce changes (aria-live)
  const live = document.createElement('div');
  live.setAttribute('aria-live', 'polite');
  live.className = 'visually-hidden';
  document.body.appendChild(live);

  function announceSlide(idx) {
    const title = slides[idx].querySelector('h1')?.textContent || `Slide ${idx + 1}`;
    live.textContent = `Showing: ${title}`;
  }

  // Wire announcement on slide change
  const origGoTo = goTo;
  window.goToSlide = (i) => {
    origGoTo(i);
    announceSlide(current);
  };

  // Replace goTo to use announce
  goTo = (index, userTriggered = false) => {
    current = (index + slides.length) % slides.length;
    slidesEl.style.transform = `translateX(-${current * 100}%)`;
    updateIndicators(current);
    announceSlide(current);
    if (userTriggered) pauseAutoplay();
  };

  // Start with first slide announced
  announceSlide(current);

})();
