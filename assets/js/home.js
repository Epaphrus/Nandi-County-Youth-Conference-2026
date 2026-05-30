/* ============================================================
   NANDI COUNTY YOUTH CONFERENCE 2026
   home.js — Homepage dynamic rendering (speakers + programme)
   ============================================================ */

function renderSpeakers() {
  const grid = document.getElementById('speakers-grid');
  if (!grid || typeof SPEAKERS === 'undefined') return;

  grid.innerHTML = SPEAKERS.map((s, i) => `
    <article class="speaker-card" data-aos="fade-up" data-aos-delay="${i * 80}" aria-label="${s.name}, ${s.role}">
      ${s.image
        ? `<img src="${s.image}" alt="${s.name}" class="speaker-card-img" loading="lazy" onload="this.classList.add('loaded')" />`
        : `<div class="speaker-img-placeholder" aria-hidden="true"><i class="fas fa-user"></i></div>`
      }
      <div class="speaker-info">
        <h4>${s.name}</h4>
        <p class="speaker-role">${s.role}</p>
        <p class="speaker-bio">${s.bio}</p>
      </div>
    </article>
  `).join('');
}

function renderProgrammeTabs() {
  const tabBar = document.getElementById('prog-tabs');
  const panel  = document.getElementById('prog-panel');
  if (!tabBar || !panel || typeof PROGRAM === 'undefined') return;

  // Build tab bar
  tabBar.innerHTML = PROGRAM.map((day, i) => `
    <button
      class="prog-tab${i === 0 ? ' active' : ''}"
      role="tab"
      aria-selected="${i === 0}"
      aria-controls="prog-panel"
      data-index="${i}"
    >
      <span class="prog-tab-day">${day.day}</span>
      <span class="prog-tab-theme">${day.theme}</span>
    </button>
  `).join('');

  function showDay(index) {
    const day = PROGRAM[index];

    // Update tab states
    tabBar.querySelectorAll('.prog-tab').forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
      btn.setAttribute('aria-selected', i === index);
    });

    // Render sessions
    panel.innerHTML = `
      <div class="prog-day-header">
        <h3 class="prog-day-title">${day.day}: ${day.theme}</h3>
        <span class="prog-day-date">${day.date}</span>
      </div>
      <div class="prog-sessions">
        ${day.sessions.map(s => `
          <div class="prog-session">
            <span class="prog-session-time">${s.time}</span>
            <div class="prog-session-info">
              <h5>${s.title}</h5>
              ${s.speaker ? `<p>${s.speaker}</p>` : ''}
            </div>
            <span class="prog-session-badge prog-badge-${s.type}">${s.type}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Tab click handler
  tabBar.addEventListener('click', e => {
    const btn = e.target.closest('.prog-tab');
    if (btn) showDay(parseInt(btn.dataset.index));
  });

  // Keyboard navigation
  tabBar.addEventListener('keydown', e => {
    const tabs = [...tabBar.querySelectorAll('.prog-tab')];
    const current = tabs.findIndex(t => t.classList.contains('active'));
    if (e.key === 'ArrowRight') {
      tabs[(current + 1) % tabs.length].click();
    } else if (e.key === 'ArrowLeft') {
      tabs[(current - 1 + tabs.length) % tabs.length].click();
    }
  });

  showDay(0);
}

document.addEventListener('DOMContentLoaded', () => {
  renderSpeakers();
  renderProgrammeTabs();
});
