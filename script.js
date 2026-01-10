/* MVNFINHUB – Lightweight slider + theme toggle + mobile nav
   Accessible: keyboard support, aria-live announcements, indicators.
*/
(function () {
  const slidesEl = document.getElementById('slides');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const indicatorsEl = document.getElementById('slideIndicators');
  const hero = document.querySelector('.hero-slider');
  const themeToggle = document.getElementById('themeToggle');
  const mobileNavToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('primaryNav');

  let current = 0;
  let autoplayInterval = 6000;
  let autoplayId = null;
  let autoplayEnabled = true;

  // Build indicators
  function createIndicators() {
    if (!indicatorsEl) return;
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
    if (!indicatorsEl) return;
    Array.from(indicatorsEl.children).forEach((b, i) => {
      b.setAttribute('aria-selected', i === idx ? 'true' : 'false');
    });
  }

  function goTo(index, userTriggered = false) {
    if (!slidesEl) return;
    current = (index + slides.length) % slides.length;
    slidesEl.style.transform = `translateX(-${current * 100}%)`;
    updateIndicators(current);
    announceSlide(current);
    if (userTriggered) pauseAutoplayTemporarily();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    if (!autoplayEnabled || !slides.length) return;
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

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // Hover pause
  if (hero) {
    hero.addEventListener('mouseenter', stopAutoplay);
    hero.addEventListener('mouseleave', startAutoplay);
  }

  // Controls
  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  // Screen reader announcement
  const live = document.createElement('div');
  live.className = 'visually-hidden';
  live.setAttribute('aria-live', 'polite');
  document.body.appendChild(live);

  function announceSlide(idx) {
    const title = slides[idx]?.querySelector('h1, h2, h3')?.textContent || `Slide ${idx + 1}`;
    live.textContent = `Showing: ${title}`;
  }

  // Theme toggle
  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.remove('dark');
      themeToggle.textContent = '🌤️';
    } else {
      document.body.classList.add('dark');
      themeToggle.textContent = '🌙';
    }
    localStorage.setItem('mvn-theme', theme);
  }

  const savedTheme = localStorage.getItem('mvn-theme') || 'light';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark');
      applyTheme(isDark ? 'dark' : 'light');
    });
  }

  // Mobile nav toggle
  if (mobileNavToggle && mobileNav) {
    mobileNavToggle.addEventListener('click', () => {
      const expanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', String(!expanded));
      mobileNav.style.display = expanded ? 'none' : 'flex';
    });
  }

  // Init
  if (slides.length && slidesEl) {
    createIndicators();
    updateIndicators(0);
    announceSlide(0);
    startAutoplay();
  }

  // Debug
  window.mvns = { goTo, next, prev, slidesCount: slides.length };
})();
