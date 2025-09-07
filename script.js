(() => {
  const byId = (id) => document.getElementById(id);
  const menuBtn = byId('menuButton');
  const menu = byId('mainMenu');

  // Toggle dropdown
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
        menu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Mark current page in menu
  const path = location.pathname.replace(/\/index\.html$/, '/');
  document.querySelectorAll('.menu-item').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    const url = new URL(href, location.origin);
    if (path.endsWith('/') && url.pathname.endsWith('/index.html')) {
      a.setAttribute('aria-current', 'page');
    } else if (url.pathname === path || url.pathname === location.pathname) {
      a.setAttribute('aria-current', 'page');
    }
  });

  // IntersectionObserver reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Footer year
  const y = document.getElementById('y') || document.querySelector('span[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();