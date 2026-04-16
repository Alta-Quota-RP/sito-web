// ====================================
// NEW YORK ITA RP — SCRIPT.JS
// ====================================

// NAVBAR scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });
}

// HAMBURGER menu
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
  // close on link click
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );
}

// ACTIVE nav link
(function setActiveLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
})();

// ANIMATED COUNTER
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const numericTarget = parseFloat(target.replace(/[^0-9.]/g, ''));
  const suffix = target.replace(/[0-9.]/g, '');
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const val = Math.floor(progress * numericTarget);
    el.textContent = val.toLocaleString('it-IT') + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

// Trigger counters on scroll
const memberEl = document.getElementById('memberCount');
if (memberEl) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(memberEl, '1.247');
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });
  observer.observe(memberEl);
}

// TABS (used in fazioni + regolamento pages)
function initTabs() {
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });

  // auto-open from hash
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const btn = document.querySelector(`.tab-btn[data-tab="${hash}"]`);
    if (btn) btn.click();
    else if (tabBtns[0]) tabBtns[0].click();
  } else if (tabBtns[0]) {
    tabBtns[0].click();
  }
}

// Fade-in on scroll
function initFadeIn() {
  const els = document.querySelectorAll(
    '.fazione-card, .stat-card, .info-card, .rule-block, .shop-card, .step-card, .tl-item, .faz-detail-card'
  );
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`;
    observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initFadeIn();
});
