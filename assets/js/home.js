/* ============================================================
   NANDI COUNTY YOUTH CONFERENCE 2026
   home.js — Homepage dynamic rendering (speakers + programme)
   ============================================================ */

function renderSpeakers() {
  const grid = document.getElementById('speakers-grid');
  if (!grid || typeof SPEAKERS === 'undefined') return;

  grid.innerHTML = SPEAKERS.map((s, i) => `
    <article class="speaker-card" data-aos="fade-up" data-aos-delay="${i * 80}" aria-label="${s.name}, ${s.role}">
      <div class="speaker-img-placeholder" aria-hidden="true">
        <i class="fas fa-user"></i>
      </div>
      <div class="speaker-info">
        <h4>${s.name}</h4>
        <p class="speaker-role">${s.role}</p>
        <p class="speaker-bio">${s.bio}</p>
      </div>
    </article>
  `).join('');
}

function renderProgrammePreview() {
  const grid = document.getElementById('programme-preview-grid');
  if (!grid || typeof PROGRAM === 'undefined') return;

  // Show first 3 days as preview
  const preview = PROGRAM.slice(0, 3);

  grid.innerHTML = preview.map((day, di) => `
    <div class="program-day" data-aos="fade-up" data-aos-delay="${di * 100}">
      <div class="program-day-header">
        <h4>${day.day}: ${day.theme}</h4>
        <span class="program-day-date">${day.date}</span>
      </div>
      <div class="program-sessions">
        ${day.sessions.slice(0, 4).map(s => `
          <div class="program-session">
            <span class="session-time">${s.time}</span>
            <div class="session-info">
              <h5>${s.title}</h5>
              ${s.speaker ? `<p>${s.speaker}</p>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderSpeakers();
  renderProgrammePreview();
});
