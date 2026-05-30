/* ============================================================
   speakers.js — Renders full speakers grid from data/speakers.js
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('speakers-full-grid');
  if (!grid) return;

  if (typeof SPEAKERS === 'undefined' || SPEAKERS.length === 0) {
    grid.innerHTML = '<p class="speakers-empty">Speaker announcements coming soon. Check back closer to the conference date.</p>';
    return;
  }

  function getInitials(name) {
    const words = name.replace(/^(Snr|Dab|Bishop|Dr\.?)\s+/gi, '').trim().split(/\s+/);
    return words.slice(0, 2).map(w => w[0].toUpperCase()).join('');
  }

  grid.innerHTML = SPEAKERS.map((s, i) => {
    const isKeynote = s.role.toLowerCase().includes('keynote');
    const initials  = getInitials(s.name);

    return `
    <article
      class="speaker-card-full${isKeynote ? ' speaker-card-full--keynote' : ''}"
      data-aos="fade-up"
      data-aos-delay="${Math.min(i, 3) * 80}"
      aria-label="${s.name}, ${s.role}"
    >
      <div class="speaker-card-photo">
        ${s.image
          ? `<img src="${s.image}" alt="${s.name}" class="speaker-card-img" loading="lazy" onload="this.classList.add('loaded')" />`
          : `<div class="speaker-img-placeholder" aria-hidden="true">
               <div class="speaker-initials">${initials}</div>
             </div>`
        }
      </div>
      <div class="speaker-card-overlay" aria-hidden="true"></div>
      <div class="speaker-card-body">
        <h3 class="speaker-card-name">${s.name}</h3>
        <p class="speaker-card-role">${s.role}</p>
      </div>
    </article>`;
  }).join('');
});
