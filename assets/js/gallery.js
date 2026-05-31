/* ============================================================
   gallery.js — Filter tabs + vanilla lightbox
   ============================================================ */
(function () {

  /* ── Filter ──────────────────────────────────────────────── */
  function initFilters() {
    const btns  = document.querySelectorAll('.gallery-filter');
    const items = document.querySelectorAll('.gallery-item');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        btns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed','true');

        items.forEach(item => {
          item.classList.toggle('hidden', filter !== 'all' && item.dataset.type !== filter);
        });
      });
    });
  }

  /* ── Lightbox ────────────────────────────────────────────── */
  let currentIndex = 0;
  let visibleItems = [];

  const lightbox   = document.getElementById('lightbox');
  const backdrop   = document.getElementById('lightbox-backdrop');
  const content    = document.getElementById('lightbox-content');
  const caption    = document.getElementById('lightbox-caption');
  const counter    = document.getElementById('lightbox-counter');
  const closeBtn   = document.getElementById('lightbox-close');
  const prevBtn    = document.getElementById('lightbox-prev');
  const nextBtn    = document.getElementById('lightbox-next');

  function getVisible() {
    return Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
  }

  function buildContent(item) {
    const type       = item.dataset.type;
    const cap        = item.dataset.caption || '';
    const videoUrl   = item.dataset.videoUrl;
    const imgSrc     = item.querySelector('img')?.src;

    content.innerHTML = '';

    if (type === 'video' && videoUrl) {
      const wrap = document.createElement('div');
      wrap.className = 'lb-embed';
      const iframe = document.createElement('iframe');
      iframe.src = videoUrl + '?autoplay=1';
      iframe.title = cap;
      iframe.allow = 'autoplay; encrypted-media';
      iframe.allowFullscreen = true;
      wrap.appendChild(iframe);
      content.appendChild(wrap);
    } else if (imgSrc) {
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = cap;
      content.appendChild(img);
    } else {
      // Placeholder visual
      const ph = document.createElement('div');
      ph.className = 'lb-placeholder-inner';
      const icon = item.querySelector('.gallery-placeholder i').cloneNode(true);
      const txt  = document.createElement('span');
      txt.textContent = cap;
      ph.appendChild(icon);
      ph.appendChild(txt);
      content.appendChild(ph);
    }

    caption.textContent = cap;
    counter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === visibleItems.length - 1;
  }

  function openLightbox(index) {
    visibleItems = getVisible();
    currentIndex = index;
    buildContent(visibleItems[currentIndex]);
    lightbox.style.display  = 'flex';
    backdrop.style.display  = 'block';
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    // Stop any playing video
    content.innerHTML = '';
    lightbox.style.display  = 'none';
    backdrop.style.display  = 'none';
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    visibleItems = getVisible();
    currentIndex = Math.max(0, Math.min(visibleItems.length - 1, currentIndex + dir));
    buildContent(visibleItems[currentIndex]);
  }

  function initLightbox() {
    if (!lightbox) return;

    // Open on thumb click or keyboard — index resolved at click time against visible items
    document.querySelectorAll('.gallery-thumb').forEach(thumb => {
      const item = thumb.closest('.gallery-item');
      const openAtItem = () => {
        const visible = getVisible();
        const idx = visible.indexOf(item);
        if (idx !== -1) openLightbox(idx);
      };
      thumb.addEventListener('click', openAtItem);
      thumb.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAtItem(); }
      });
    });

    closeBtn?.addEventListener('click', closeLightbox);
    backdrop?.addEventListener('click', closeLightbox);
    prevBtn?.addEventListener('click', () => navigate(-1));
    nextBtn?.addEventListener('click', () => navigate(1));

    document.addEventListener('keydown', e => {
      if (lightbox.style.display === 'none') return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });

    // Touch swipe support
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    initLightbox();
  });

})();
