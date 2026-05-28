/* ============================================================
   livestream.js — Status detection and prayer form
   ============================================================ */
(function () {
  const CONFERENCE_START = new Date('2026-08-10T19:00:00+03:00');
  const CONFERENCE_END   = new Date('2026-08-15T14:00:00+03:00');

  function updateLiveStatus() {
    const now       = new Date();
    const dot       = document.getElementById('ls-status-dot');
    const statusTxt = document.getElementById('ls-status-text');
    const placeholder = document.getElementById('ls-placeholder');
    const embedWrap   = document.getElementById('ls-embed-wrap');

    if (!dot) return;

    if (now >= CONFERENCE_START && now <= CONFERENCE_END) {
      // Conference is live
      dot.classList.add('live');
      if (statusTxt) statusTxt.textContent = '🔴 We are LIVE — Watch Now!';
      if (placeholder) placeholder.style.display = 'none';
      if (embedWrap)   embedWrap.style.display = 'block';
    } else if (now > CONFERENCE_END) {
      if (statusTxt) statusTxt.textContent = 'Conference has ended — watch recordings on our YouTube channel.';
    }
    // else: pre-conference — default placeholder text stands
  }

  /* Prayer request form */
  function initPrayerForm() {
    const form = document.getElementById('ls-prayer-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name    = form.querySelector('#ls-name').value.trim();
      const request = form.querySelector('#ls-request').value.trim();
      if (!name || !request) return;

      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending…';

      // Simulate send (replace with real endpoint)
      await new Promise(r => setTimeout(r, 900));

      form.querySelector('.form-group:nth-child(1) input').value = '';
      form.querySelector('textarea').value = '';
      btn.style.display = 'none';
      const success = document.getElementById('ls-prayer-success');
      if (success) success.style.display = 'flex';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateLiveStatus();
    initPrayerForm();
  });
})();
