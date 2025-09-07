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

/* ===== Voucher logic ===== */
(() => {
  // 1) Define your codes here (edit anytime)
  // amount: text only (for display). You can add expires: '2025-12-31' if you want to enforce dates.
  const VOUCHERS = {
    "LEAF250": { offer: "$250 off setup", tag: "leaf250", notes: "Applies to onboarding setup only." },
    "FIRSTMONTH10": { offer: "10% off first month", tag: "fm10" },
    "FOUNDERS": { offer: "Free 30-min planning call + cash-flow template", tag: "founders" }
  };

  const KEY = "gl_voucher";
  const qs = new URLSearchParams(location.search);
  const prefill = (qs.get("voucher") || qs.get("code") || "").toUpperCase();
  const saved = localStorage.getItem(KEY);
  const current = saved ? JSON.parse(saved) : null;

  // 2) Helpers
  const applyVoucher = (code, meta) => {
    const payload = { code, ...meta, ts: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(payload));
    renderBanner(payload);
    tagCTAs(payload);
  };
  const clearVoucher = () => {
    localStorage.removeItem(KEY);
    removeBanner();
    tagCTAs(null);
  };

  // 3) Wire up form if present
  const form = document.getElementById("voucherForm");
  const input = document.getElementById("voucherCode");
  const msg = document.getElementById("voucherMsg");

  const setMsg = (text, ok=false) => {
    if (!msg) return;
    msg.textContent = text;
    msg.classList.toggle("ok", ok);
    msg.classList.toggle("err", !ok);
  };

  if (form && input) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const code = (input.value || "").trim().toUpperCase();
      if (!code) return setMsg("Enter a code to redeem.", false);
      const meta = VOUCHERS[code];
      if (!meta) return setMsg("Invalid or expired code.", false);
      applyVoucher(code, meta);
      setMsg(`Redeemed: ${code} — ${meta.offer}`, true);
      input.blur();
    });

    if (prefill && VOUCHERS[prefill]) {
      input.value = prefill;
      form.dispatchEvent(new Event("submit"));
    }
  }

  // 4) Banner render
  function renderBanner(payload) {
    removeBanner();
    if (!payload) return;
    const bar = document.createElement("div");
    bar.className = "voucher-banner";
    bar.innerHTML = `
      <div class="inner">
        <span class="voucher-chip">Voucher: <strong>${payload.code}</strong></span>
        <span>${payload.offer || "Applied"}</span>
        <div style="display:flex; gap:8px; align-items:center">
          <a class="btn btn-ghost" href="https://calendly.com/admin-goldenleaffinancialllc/30min?utm_source=site&utm_medium=voucher&utm_content=${encodeURIComponent(payload.code)}" target="_blank" rel="noopener">Use on Call</a>
          <button class="voucher-clear" type="button" aria-label="Clear voucher">Remove</button>
        </div>
      </div>`;
    document.body.prepend(bar);
    bar.querySelector(".voucher-clear").addEventListener("click", clearVoucher);
  }

  function removeBanner() {
    document.querySelectorAll(".voucher-banner").forEach(el => el.remove());
  }

  // 5) Tag CTAs (Calendly + email) with voucher so you can see it
  function tagCTAs(payload) {
    const addParam = (href, key, val) => {
      try {
        const u = new URL(href, location.origin);
        u.searchParams.set(key, val);
        return u.toString();
      } catch { return href; }
    };

    document.querySelectorAll('a[href*="calendly.com/admin-goldenleaffinancialllc/30min"]').forEach(a => {
      const base = a.getAttribute("href");
      if (payload) a.setAttribute("href", addParam(base, "utm_content", payload.code));
      else a.setAttribute("href", base.replace(/([?&])utm_content=[^&]+/,'$1').replace(/[?&]$/,''));
    });

    document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
      const href = a.getAttribute("href");
      const url = new URL(href.replace("mailto:","mailto://noop"), location.origin);
      if (payload) {
        const subj = (url.searchParams.get("subject") || "Inquiry");
        url.searchParams.set("subject", `${subj} [Voucher: ${payload.code}]`);
      } else {
        url.searchParams.delete("subject");
      }
      a.setAttribute("href", "mailto:" + url.href.replace("mailto://noop/","").replace(location.origin,""));
    });
  }

  // 6) On load: show saved banner / tag CTAs
  if (current) {
    renderBanner(current);
    tagCTAs(current);
  }
})();
