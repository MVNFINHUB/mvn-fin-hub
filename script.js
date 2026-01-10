/* Lightweight slider + theme toggle + mobile nav
   Accessible: keyboard support, aria-live announcements, indicators.
*/
(function () {
  const slidesEl = document.getElementById('slides');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const indicatorsEl = document.getElementById('slideIndicators');
  const hero = document.querySelector('.hero-slider');
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNav = document.getElementById('mobileNav');
  const themeToggle = document.getElementById('themeToggle');

  let current = 0;
  let autoplayInterval = 6000;
  let autoplayId = null;
  let autoplayEnabled = true;

  // Build indicators
  function createIndicators() {
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.setAttribute('aria-label', `Slide ${i + 1}`);
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
    announceSlide(current);
    if (userTriggered) pauseAutoplayTemporarily();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    if (!autoplayEnabled) return;
    autoplayId = setInterval(next, autoplayInterval);
  }

  function stopAutoplay() {
    clearInterval(autoplayId);
    autoplayId = null;
  }

  function pauseAutoplayTemporarily() {
    stopAutoplay();
    setTimeout(() => {
      if (autoplayEnabled) startAutoplay();
    }, 12000);
  }

  // keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // hover pause
  hero.addEventListener('mouseenter', () => stopAutoplay());
  hero.addEventListener('mouseleave', () => startAutoplay());

  // controls
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // announce slide for screen readers
  const live = document.createElement('div');
  live.className = 'visually-hidden';
  live.setAttribute('aria-live', 'polite');
  document.body.appendChild(live);

  function announceSlide(idx) {
    const title = slides[idx].querySelector('h1')?.textContent || `Slide ${idx + 1}`;
    live.textContent = `Showing: ${title}`;
  }

  // Theme toggle: toggles alien / light
  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.remove('theme-alien');
      themeToggle.textContent = '🌤️';
    } else {
      document.body.classList.add('theme-alien');
      themeToggle.textContent = '🛸';
    }
    localStorage.setItem('mvn-theme', theme);
  }
  const saved = localStorage.getItem('mvn-theme') || 'alien';
  applyTheme(saved);
  themeToggle.addEventListener('click', () => {
    const isAlien = document.body.classList.toggle('theme-alien');
    applyTheme(isAlien ? 'alien' : 'light');
  });

  // Mobile nav toggle
  mobileNavToggle.addEventListener('click', () => {
    const expanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
    mobileNavToggle.setAttribute('aria-expanded', String(!expanded));
    mobileNav.setAttribute('aria-hidden', String(expanded));
    mobileNav.style.display = expanded ? 'none' : 'flex';
  });

  // Init slider
  createIndicators();
  updateIndicators(0);
  announceSlide(0);
  startAutoplay();

  // Expose for debugging
  window.mvns = { goTo, next, prev, slidesCount: slides.length };
})();
