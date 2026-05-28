/* ============================================================
   NANDI COUNTY YOUTH CONFERENCE 2026
   program.js — Renders day tabs and session accordion
   ============================================================ */

const SESSION_ICONS = {
  sermon:   'fa-bible',
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

  container.setAttribute('role', 'tablist');
  PROGRAM.forEach((day, i) => {
    const btn = document.createElement('button');
    btn.className   = 'day-tab' + (i === 0 ? ' active' : '');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.setAttribute('aria-controls', `day-panel-${i}`);
    btn.setAttribute('id', `day-tab-${i}`);
    btn.setAttribute('tabindex', i === 0 ? '0' : '-1');
    btn.innerHTML = `<span class="tab-day">${day.day}</span><span class="tab-date">${day.date.split(',')[1]?.trim() || ''}</span>`;
    btn.addEventListener('click', () => showDay(i));
    container.appendChild(btn);
  });
}

function buildDayPanels() {
  const content = document.getElementById('programme-content');
  if (!content || typeof PROGRAM === 'undefined') return;

  PROGRAM.forEach((day, di) => {
    const panel = document.createElement('div');
    panel.id    = `day-panel-${di}`;
    panel.className = 'day-panel' + (di === 0 ? ' active' : '');
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `day-tab-${di}`);
    panel.setAttribute('tabindex', '0');

    panel.innerHTML = `
      <div class="day-panel-header" data-aos="fade-up">
        <div>
          <h2 class="day-panel-title">${day.day}: ${day.theme}</h2>
          <p class="day-panel-date">${day.date}</p>
        </div>
      </div>

      <div class="timeline" role="list" aria-label="Sessions for ${day.day}">
        ${day.sessions.map((s, si) => `
          <div class="timeline-item" data-aos="fade-up" data-aos-delay="${si * 60}" role="listitem">
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
                  ${s.speaker ? `<p class="timeline-speaker"><i class="fas fa-microphone" aria-hidden="true"></i> ${s.speaker}</p>` : ''}
                </div>
                <span class="badge ${SESSION_TYPE_COLORS[s.type] || 'badge-blue'}" aria-label="Session type: ${SESSION_LABELS[s.type] || s.type}">
                  ${SESSION_LABELS[s.type] || s.type}
                </span>
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
  // Update tabs
  document.querySelectorAll('.day-tab').forEach((tab, i) => {
    const isActive = i === index;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    tab.setAttribute('tabindex', isActive ? '0' : '-1');
  });

  // Update panels
  document.querySelectorAll('.day-panel').forEach((panel, i) => {
    panel.classList.toggle('active', i === index);
  });

  // Re-trigger AOS for newly visible items
  if (typeof AOS !== 'undefined') {
    setTimeout(() => AOS.refresh(), 50);
  }
}

/* Keyboard navigation for tabs */
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
  buildTabs();
  buildDayPanels();
  initTabKeyboard();
});
