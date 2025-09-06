// Year
document.getElementById('y')?.textContent = new Date().getFullYear();

// Reveal-on-scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if (e.isIntersecting){
      e.target.classList.add('show');
      io.unobserve(e.target);
    }
  });
},{threshold:0.16});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Dropdown menu logic
const btn = document.getElementById('menuButton');
const panel = document.getElementById('mainMenu');

function openMenu(){
  panel.classList.add('open');
  btn.setAttribute('aria-expanded','true');
  // Focus first item for accessibility
  const first = panel.querySelector('.menu-item');
  first && first.focus();
}
function closeMenu(){
  panel.classList.remove('open');
  btn.setAttribute('aria-expanded','false');
}
function toggleMenu(){
  const expanded = btn.getAttribute('aria-expanded') === 'true';
  expanded ? closeMenu() : openMenu();
}

btn.addEventListener('click', toggleMenu);

// Close on click outside
document.addEventListener('click', (e)=>{
  if (!panel.classList.contains('open')) return;
  if (!panel.contains(e.target) && e.target !== btn) closeMenu();
});

// Keyboard handling
document.addEventListener('keydown', (e)=>{
  if (e.key === 'Escape' && panel.classList.contains('open')) closeMenu();
});

// Mark active route in dropdown
(function markActive(){
  const path = location.pathname.replace(/\/+$/,'') || '/';
  panel.querySelectorAll('.menu-item').forEach(a=>{
    const route = (a.getAttribute('data-route') || a.getAttribute('href') || '').replace(/\/+$/,'') || '/';
    if (route === path) a.setAttribute('aria-current','page');
  });
})();
