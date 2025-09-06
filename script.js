
// footer year
document.querySelectorAll('[data-year]').forEach(n=>n.textContent=new Date().getFullYear());

// reveal
const io=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target);} });
},{threshold:.16});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// basic active nav highlighting
(function(){
  const path = location.pathname.replace(/\/+/g,'/');
  document.querySelectorAll('.nav a.cta').forEach(a=>{
    const href = a.getAttribute('href');
    if(!href) return;
    // Mark active for direct page matches
    if(path === href || path.endsWith(href)) a.classList.add('active');
  });
})();
