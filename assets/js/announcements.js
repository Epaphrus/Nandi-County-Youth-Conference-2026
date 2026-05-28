/* ============================================================
   announcements.js — Filter announcements by category
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.ann-filter-btn');
  const cards      = document.querySelectorAll('.ann-card');
  const empty      = document.getElementById('ann-empty');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update button states
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      // Show/hide cards
      let visible = 0;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
        if (match) visible++;
      });

      empty.style.display = visible === 0 ? 'block' : 'none';
    });
  });
});
