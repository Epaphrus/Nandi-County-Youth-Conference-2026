/* ============================================================
   NANDI COUNTY YOUTH CONFERENCE 2026
   main.js — Component loader, navbar, scroll utilities
   ============================================================ */

/* ── Component Loader ──────────────────────────────────────── */
async function loadComponent(id, url) {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}`);
    el.innerHTML = await res.text();
    el.dispatchEvent(new Event('component:loaded', { bubbles: true }));
  } catch (e) {
    console.warn('Component load failed:', url, e);
  }
}

/* ── Resolve component paths relative to root ─────────────── */
function getRootPath() {
  // Works whether the page is at root or a subdirectory
  const depth = (window.location.pathname.match(/\//g) || []).length - 1;
  return depth > 0 ? '../'.repeat(depth) : '';
}

/* ── Navbar behaviour ──────────────────────────────────────── */
function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const toggle  = document.getElementById('navToggle');
  const menu    = document.getElementById('navMenu');

  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
    updateScrollTopBtn();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile toggle
  if (toggle && menu) {
    const openMenu = () => {
      menu.classList.add('open');
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () => {
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Close on nav link click
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });
  }

}

function highlightActiveLink() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-menu a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/* ── Scroll-to-top button ──────────────────────────────────── */
function updateScrollTopBtn() {
  const btn = document.getElementById('scroll-top');
  if (btn) btn.classList.toggle('visible', window.scrollY > 400);
}

function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── AOS Init ──────────────────────────────────────────────── */
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-quad',
      once: true,
      offset: 60,
    });
  }
}

/* ── Smooth anchor scrolling ───────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 64;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── Bootstrap everything ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  const root = getRootPath();

  // Highlight the active link as soon as the navbar HTML is in the DOM,
  // not after the footer also resolves — avoids a race on slow connections.
  document.getElementById('navbar-placeholder')
    .addEventListener('component:loaded', highlightActiveLink, { once: true });

  await Promise.all([
    loadComponent('navbar-placeholder', `${root}components/navbar.html`),
    loadComponent('footer-placeholder', `${root}components/footer.html`),
  ]);

  initNavbar();
  initScrollTop();
  initSmoothScroll();
  initAOS();
});
