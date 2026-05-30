/* ============================================================
   NANDI COUNTY YOUTH CONFERENCE 2026
   home.js — Homepage dynamic rendering (speakers + programme)
   ============================================================ */

function getInitials(name) {
  const words = name.replace(/^(Snr|Dab|Bishop|Dr\.?)\s+/gi, '').trim().split(/\s+/);
  return words.slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

function renderSpeakers() {
  const grid = document.getElementById('speakers-grid');
  if (!grid || typeof SPEAKERS === 'undefined') return;

  grid.innerHTML = SPEAKERS.slice(0, 4).map((s, i) => {
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
              ${s.speaker && !s.speaker.includes('[') ? `<p>${s.speaker}</p>` : ''}
            </div>
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
