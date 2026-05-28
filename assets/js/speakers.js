/* ============================================================
   speakers.js — Renders full speakers grid from data/speakers.js
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('speakers-full-grid');
  if (!grid || typeof SPEAKERS === 'undefined') return;

  grid.innerHTML = SPEAKERS.map((s, i) => `
    <article class="speaker-card-full" data-aos="fade-up" data-aos-delay="${(i % 3) * 80}" aria-label="${s.name}, ${s.role}">
      <div class="speaker-img-placeholder" aria-hidden="true">
        <i class="fas fa-user"></i>
      </div>
      ${s.featured ? '<div class="speaker-featured-badge"><i class="fas fa-star" aria-hidden="true"></i> Featured</div>' : ''}
      <div class="speaker-card-body">
        <h3 class="speaker-card-name">${s.name}</h3>
        <p class="speaker-card-role">${s.role}</p>
        <p class="speaker-card-bio">${s.bio}</p>
      </div>
    </article>
  `).join('');
});
