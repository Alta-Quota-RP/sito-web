/* ============================================================
   INCHIOSTRO STUDIO — main2.js
   ============================================================ */

// ─── Page Router ─────────────────────────────────────────────
function navigate(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');

  document.querySelectorAll('[data-page]').forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageId);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(observeReveal, 80);

  if (pageId === 'page-about') setTimeout(initSkills, 200);
  history.pushState(null, '', '#' + pageId.replace('page-', ''));
}

document.querySelectorAll('[data-page]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navigate(link.dataset.page);
  });
});

window.addEventListener('popstate', () => {
  const h = location.hash.replace('#', '');
  const map = { services: 'page-services', about: 'page-about', contact: 'page-contact' };
  navigate(map[h] || 'page-home');
});

(function () {
  const h = location.hash.replace('#', '');
  const map = { services: 'page-services', about: 'page-about', contact: 'page-contact' };
  navigate(map[h] || 'page-home');
})();


// ─── Nav scroll ───────────────────────────────────────────────
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
});


// ─── Mobile menu ─────────────────────────────────────────────
const hamburger  = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileClose = document.querySelector('.mobile-close');
hamburger?.addEventListener('click', () => mobileMenu.classList.add('open'));
mobileClose?.addEventListener('click', () => mobileMenu.classList.remove('open'));
document.querySelectorAll('.mobile-menu a').forEach(a =>
  a.addEventListener('click', () => mobileMenu.classList.remove('open'))
);


// ─── Scroll reveal ────────────────────────────────────────────
function observeReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.transitionDelay = (i * 0.07) + 's';
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => io.observe(el));
}
observeReveal();


// ─── Portfolio filter ─────────────────────────────────────────
const filterTabs = document.querySelectorAll('.filter-tab');
const cells = document.querySelectorAll('.riso-cell[data-cat]');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.filter;
    cells.forEach(cell => {
      const match = cat === 'all' || cell.dataset.cat === cat;
      cell.style.opacity     = match ? '1' : '0.2';
      cell.style.transform   = match ? '' : 'scale(0.96)';
      cell.style.pointerEvents = match ? 'auto' : 'none';
    });
  });
});


// ─── Skill bars ───────────────────────────────────────────────
function initSkills() {
  const bars = document.querySelectorAll('.skill-bar');
  if (!bars.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        bars.forEach((b, i) => setTimeout(() => b.classList.add('animated'), i * 100));
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  const wrap = document.querySelector('.skills-list');
  if (wrap) io.observe(wrap);
}


// ─── Counter animation ────────────────────────────────────────
function countUp(el) {
  const target   = parseInt(el.dataset.target, 10);
  const suffix   = el.dataset.suffix || '';
  const duration = 1600;
  const step     = 16;
  const inc      = target / (duration / step);
  let current    = 0;
  const t        = setInterval(() => {
    current = Math.min(current + inc, target);
    el.textContent = Math.round(current) + suffix;
    if (current >= target) clearInterval(t);
  }, step);
}

const statsEl = document.querySelector('.stats-strip');
if (statsEl) {
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-target]').forEach(countUp);
      }
    });
  }, { threshold: 0.3 }).observe(statsEl);
}


// ─── Budget chips ─────────────────────────────────────────────
document.querySelectorAll('.budget-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.budget-chip').forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
  });
});


// ─── Contact form ─────────────────────────────────────────────
const form       = document.getElementById('contact-form');
const successBox = document.getElementById('success-box');

form?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('.btn-solid');
  const original = btn.textContent;
  btn.textContent = 'Invio...';
  btn.disabled    = true;
  setTimeout(() => {
    successBox.classList.add('visible');
    form.reset();
    document.querySelectorAll('.budget-chip').forEach(c => c.classList.remove('selected'));
    btn.textContent = original;
    btn.disabled    = false;
    showToast('✓ Messaggio inviato!');
    setTimeout(() => successBox.classList.remove('visible'), 5000);
  }, 1500);
});


// ─── Toast ────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}


// ─── Portfolio cell click ─────────────────────────────────────
document.querySelectorAll('.riso-cell').forEach(cell => {
  cell.addEventListener('click', () => showToast('✦ Dettaglio in arrivo!'));
});


// ─── Ticker duplication ───────────────────────────────────────
// The ticker HTML already has two copies for seamless loop.
// Nothing needed.


// ─── Magnetic hover on .btn ──────────────────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r   = btn.getBoundingClientRect();
    const cx  = r.left + r.width / 2;
    const cy  = r.top  + r.height / 2;
    const dx  = (e.clientX - cx) * 0.25;
    const dy  = (e.clientY - cy) * 0.25;
    btn.style.transform = `translate(calc(-3px + ${dx}px), calc(-3px + ${dy}px))`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});


// ─── Riso color shift on mouse move ──────────────────────────
document.addEventListener('mousemove', e => {
  const decos = document.querySelectorAll('.hero-deco-r, .hero-deco-g, .hero-deco-o');
  const x = (e.clientX / window.innerWidth  - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 15;
  decos.forEach((d, i) => {
    const f = (i + 1) * 0.5;
    d.style.transform = `translate(${x * f}px, ${y * f}px)`;
  });
});
