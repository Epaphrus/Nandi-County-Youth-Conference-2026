/* ============================================================
   NANDI COUNTY YOUTH CONFERENCE 2026
   program.js — Renders day tabs and session timeline
   ============================================================ */

const SESSION_ICONS = {
  sermon:   'fa-book-bible',
  prayer:   'fa-hands-praying',
  worship:  'fa-music',
  workshop: 'fa-users',
  ceremony: 'fa-star',
  logistics:'fa-clipboard-list',
};

const SESSION_LABELS = {
  sermon:   'Sermon / Teaching',
  prayer:   'Prayer',
  worship:  'Worship',
  workshop: 'Workshop',
  ceremony: 'Ceremony',
  logistics:'Logistics',
};

function buildTabs() {
  const container = document.querySelector('.day-tabs');
  if (!container || typeof PROGRAM === 'undefined') return;

  PROGRAM.forEach((day, i) => {
    const btn = document.createElement('button');
    btn.className = 'day-tab' + (i === 0 ? ' active' : '');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.setAttribute('aria-controls', `day-panel-${i}`);
    btn.setAttribute('id', `day-tab-${i}`);
    btn.setAttribute('tabindex', i === 0 ? '0' : '-1');

    const datePart = day.date.split(',').slice(1).join(',').trim()
      .replace(/\s+\d{4}$/, ''); // strip year → "10 August"

    btn.innerHTML = `
      <span class="tab-day">${day.day}</span>
      <span class="tab-date">${datePart}</span>
      <span class="tab-theme">${day.theme}</span>
    `;
    btn.addEventListener('click', () => showDay(i));
    container.appendChild(btn);
  });
}

function buildDayPanels() {
  const content = document.getElementById('programme-content');
  if (!content || typeof PROGRAM === 'undefined') return;

  content.innerHTML = ''; // clear loading placeholder

  PROGRAM.forEach((day, di) => {
    const panel = document.createElement('div');
    panel.id        = `day-panel-${di}`;
    panel.className = 'day-panel' + (di === 0 ? ' active' : '');
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `day-tab-${di}`);
    panel.setAttribute('tabindex', '0');

    panel.innerHTML = `
      <div class="day-panel-header">
        <span class="day-theme-badge">${day.theme}</span>
        <h3 class="day-panel-title">${day.day}</h3>
        <p class="day-panel-date">${day.date}</p>
      </div>

      <div class="timeline" role="list" aria-label="Sessions for ${day.day}">
        ${day.sessions.map((s, si) => `
          <div class="timeline-item" role="listitem">
            <div class="timeline-time">
              <span>${s.time}</span>
            </div>
            <div class="timeline-dot" aria-hidden="true"></div>
            <div class="timeline-card">
              <div class="timeline-card-header">
                <div class="timeline-icon ${s.type}" aria-hidden="true">
                  <i class="fas ${SESSION_ICONS[s.type] || 'fa-circle'}"></i>
                </div>
                <div class="timeline-info">
                  <h4>${s.title}</h4>
                  ${s.speaker && !s.speaker.includes('[') ? `<p class="timeline-speaker"><i class="fas fa-microphone" aria-hidden="true"></i> ${s.speaker}</p>` : ''}
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    content.appendChild(panel);
  });
}

function showDay(index) {
  document.querySelectorAll('.day-tab').forEach((tab, i) => {
    const active = i === index;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', active ? 'true' : 'false');
    tab.setAttribute('tabindex', active ? '0' : '-1');
  });

  document.querySelectorAll('.day-panel').forEach((panel, i) => {
    panel.classList.toggle('active', i === index);
  });

  // On mobile, scroll the content panel into view
  const panel = document.getElementById(`day-panel-${index}`);
  if (panel && window.innerWidth < 768) {
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function initTabKeyboard() {
  const tabs = document.querySelectorAll('.day-tab');
  tabs.forEach((tab, i) => {
    tab.addEventListener('keydown', e => {
      let next = i;
      if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft')  next = (i - 1 + tabs.length) % tabs.length;
      if (next !== i) {
        showDay(next);
        tabs[next].focus();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof PROGRAM === 'undefined') {
    const content = document.getElementById('programme-content');
    if (content) content.innerHTML = '<p class="programme-empty">Programme details coming soon. Check back closer to the conference date.</p>';
    return;
  }
  buildTabs();
  buildDayPanels();
  initTabKeyboard();
});
