// Minimal JS for theme toggle, mobile nav, and basic accessibility.
// - stores theme in localStorage
// - toggles mobile nav with aria-expanded
// - progressive enhancement only

(function(){
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');

  // Initialize theme from localStorage or system preference
  const saved = localStorage.getItem('mvn-theme');
  function applyTheme(name){
    if(name === 'dark'){
      document.body.classList.add('dark');
      themeToggle.textContent = '☀️';
      themeToggle.setAttribute('aria-pressed','true');
    } else {
      document.body.classList.remove('dark');
      themeToggle.textContent = '🌙';
      themeToggle.setAttribute('aria-pressed','false');
    }
    localStorage.setItem('mvn-theme', name);
  }

  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));

  themeToggle.addEventListener('click', function(){
    const isDark = document.body.classList.toggle('dark');
    applyTheme(isDark ? 'dark' : 'light');
  });

  // Mobile nav toggle
  navToggle.addEventListener('click', function(){
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    if(!expanded){
      primaryNav.style.display = 'block';
      primaryNav.querySelector('a')?.focus();
    } else {
      primaryNav.style.display = '';
    }
  });

  // Close mobile nav on outside click
  document.addEventListener('click', (e)=>{
    if(window.innerWidth < 760){
      if(!primaryNav.contains(e.target) && !navToggle.contains(e.target)){
        navToggle.setAttribute('aria-expanded','false');
        primaryNav.style.display = '';
      }
    }
  });

  // Improve keyboard accessibility for details elements
  document.querySelectorAll('details summary').forEach(s=>{
    s.addEventListener('keydown', (ev)=>{
      if(ev.key === 'Enter' || ev.key === ' '){
        ev.preventDefault();
        s.click();
      }
    });
  });

})();
