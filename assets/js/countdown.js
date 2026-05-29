/* ============================================================
   NANDI COUNTY YOUTH CONFERENCE 2026
   countdown.js — Live countdown to 10 August 2026
   ============================================================ */

(function () {
  const CONFERENCE_DATE = new Date('2026-08-10T08:00:00+03:00');

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateCountdown() {
    const now  = new Date();
    const diff = CONFERENCE_DATE - now;

    const daysEl    = document.getElementById('cd-days');
    const hoursEl   = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');

    if (!daysEl) return;

    if (diff <= 0) {
      daysEl.textContent    = '00';
      hoursEl.textContent   = '00';
      minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';

      const label = document.getElementById('countdown-label');
      if (label) label.textContent = 'The Conference Is On — Welcome!';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent    = pad(days);
    hoursEl.textContent   = pad(hours);
    minutesEl.textContent = pad(minutes);
    if (secondsEl) secondsEl.textContent = pad(seconds);
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  });
})();
