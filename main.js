/* ============================================
   main.js — Shared logic for all pages
   ============================================ */

// ── CUSTOM CURSOR
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  }
});

function animateCursorRing() {
  ringX += (mouseX - ringX) * 0.1;
  ringY += (mouseY - ringY) * 0.1;
  if (cursorRing) {
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
  }
  requestAnimationFrame(animateCursorRing);
}
animateCursorRing();

document.querySelectorAll('a, button, .card, .pitem, .service-card, .tcard, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursor) { cursor.style.width = '20px'; cursor.style.height = '20px'; }
    if (cursorRing) { cursorRing.style.width = '50px'; cursorRing.style.height = '50px'; }
  });
  el.addEventListener('mouseleave', () => {
    if (cursor) { cursor.style.width = '12px'; cursor.style.height = '12px'; }
    if (cursorRing) { cursorRing.style.width = '38px'; cursorRing.style.height = '38px'; }
  });
});

// ── NAV SCROLL
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }
}, { passive: true });

// ── HAMBURGER MENU
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.style.display = menuOpen ? 'flex' : 'none';
    mobileMenu.classList.toggle('open', menuOpen);
    hamburger.children[0].style.transform = menuOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
    hamburger.children[1].style.opacity = menuOpen ? '0' : '1';
    hamburger.children[2].style.transform = menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.style.display = 'none';
      mobileMenu.classList.remove('open');
    });
  });
}

// ── SCROLL REVEAL
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

reveals.forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 0.08 + 's';
  revealObserver.observe(el);
});

// ── COUNTER ANIMATION
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num[data-target]');
if (statNums.length) {
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, parseInt(entry.target.dataset.target));
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => statsObserver.observe(el));
}

// ── TOAST
window.showToast = function(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
};

// ── CANVAS PARTICLE GRID (hero only)
const canvas = document.getElementById('heroCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, pts = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    pts = [];
    const cols = Math.floor(W / 60);
    const rows = Math.floor(H / 60);
    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        pts.push({
          x: (i / cols) * W,
          y: (j / rows) * H,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.5,
        });
      }
    }
  }

  function drawCanvas() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = '#ed62fc';
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(232,197,71,${(1 - dist / 90) * 0.4})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawCanvas);
  }

  resize();
  window.addEventListener('resize', resize);
  drawCanvas();
}

// ── SMOOTH SCROLL for in-page anchors
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
