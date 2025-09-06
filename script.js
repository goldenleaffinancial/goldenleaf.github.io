// === Footer Year ===
document.getElementById('y').textContent = new Date().getFullYear();

// === Reveal-on-scroll ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// === Dropdown menu ===
const btn = document.getElementById('menuButton');
const panel = document.getElementById('mainMenu');

function openMenu() {
  panel.classList.add('open');
  btn.setAttribute('aria-expanded', 'true');
}
function closeMenu() {
  panel.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
}
function toggleMenu() {
  const expanded = btn.getAttribute('aria-expanded') === 'true';
  expanded ? closeMenu() : openMenu();
}

if (btn && panel) {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener('click', (e) => {
    if (panel.classList.contains('open') && !panel.contains(e.target) && e.target !== btn) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      closeMenu();
    }
  });
}

// === Highlight active menu link ===
(function markActive() {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  document.querySelectorAll('.menu-item').forEach((a) => {
    const route = (a.getAttribute('data-route') || a.getAttribute('href') || '').replace(/\/+$/, '') || '/';
    if (route === path) a.setAttribute('aria-current', 'page');
  });
})();
