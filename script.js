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

// Highlight current page in the nav (adds aria-current="page")
(function markActiveNav(){
  const path = location.pathname.replace(/\/+$/,'') || '/';
  document.querySelectorAll('.nav-links a.cta').forEach(a=>{
    const route = (a.getAttribute('data-route') || a.getAttribute('href') || '').replace(/\/+$/,'') || '/';
    if (route === path) a.setAttribute('aria-current','page');
  });
})();
