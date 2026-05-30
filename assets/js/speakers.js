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

  grid.innerHTML = SPEAKERS.map((s, i) => `
    <article class="speaker-card-full" data-aos="fade-up" data-aos-delay="${i * 80}" aria-label="${s.name}, ${s.role}">
      ${s.image
        ? `<img src="${s.image}" alt="${s.name}" class="speaker-card-img" loading="lazy" onload="this.classList.add('loaded')" />`
        : `<div class="speaker-img-placeholder" aria-hidden="true"><i class="fas fa-user"></i></div>`
      }
      <div class="speaker-card-body">
        <h3 class="speaker-card-name">${s.name}</h3>
        <p class="speaker-card-role">${s.role}</p>
        <p class="speaker-card-bio">${s.bio}</p>
      </div>
    </article>
  `).join('');
});
