/* ============================================================
   NANDI COUNTY YOUTH CONFERENCE 2026
   form.js — Modal logic, form validation, Google Sheets POST
   Handles: Conference Registration + Committee Registration
   ============================================================ */

/* ── Google Sheets endpoints ───────────────────────────────── */
// Replace these with your deployed Apps Script web app URLs.
const CONF_ENDPOINT      = 'https://script.google.com/macros/s/YOUR_CONF_SCRIPT_ID/exec';
const COMMITTEE_ENDPOINT = 'https://script.google.com/macros/s/YOUR_COMMITTEE_SCRIPT_ID/exec';

/* ── Sanitize input (prevent XSS) ─────────────────────────── */
function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML.trim();
}

/* ── Validate Kenyan phone number ──────────────────────────── */
function isValidKenyanPhone(phone) {
  return /^(0|\+254)[0-9]{9}$/.test(phone.replace(/\s+/g, ''));
}

/* ── Field error helpers ───────────────────────────────────── */
function showError(fieldId, errId) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(errId);
  if (field) field.classList.add('error');
  if (err)   err.classList.add('visible');
}

function clearError(fieldId, errId) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(errId);
  if (field) field.classList.remove('error');
  if (err)   err.classList.remove('visible');
}

function clearAllErrors(form) {
  form.querySelectorAll('.form-control.error').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('.form-error.visible').forEach(el => el.classList.remove('visible'));
}

/* ── Submit to Google Sheets ───────────────────────────────── */
async function submitToSheets(endpoint, data) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(data).toString(),
  });
  if (!response.ok) throw new Error(`Server error: ${response.status}`);
  return response;
}

/* ══════════════════════════════════════════════════════════════
   MODAL MANAGEMENT
══════════════════════════════════════════════════════════════ */

function getBackdrop() {
  return document.getElementById('modal-backdrop');
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('is-open');
  getBackdrop()?.classList.add('is-open');
  document.body.style.overflow = 'hidden';

  // Focus the first focusable element inside the modal
  const focusable = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable) setTimeout(() => focusable.focus(), 50);
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
  modal.classList.remove('is-open');
  getBackdrop()?.classList.remove('is-open');
  document.body.style.overflow = '';
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay.is-open').forEach(m => {
    m.setAttribute('aria-hidden', 'true');
    m.classList.remove('is-open');
  });
  getBackdrop()?.classList.remove('is-open');
  document.body.style.overflow = '';
}

/* Trap focus inside open modal */
function trapFocus(modal, e) {
  const focusable = modal.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];
  if (e.key === 'Tab') {
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  }
  if (e.key === 'Escape') closeAllModals();
}

/* ══════════════════════════════════════════════════════════════
   SUBMISSION STATE FLAGS
══════════════════════════════════════════════════════════════ */
let confSubmitted      = false;
let committeeSubmitted = false;

/* ══════════════════════════════════════════════════════════════
   CONFERENCE REGISTRATION FORM
══════════════════════════════════════════════════════════════ */

function validateConfForm(form) {
  clearAllErrors(form);
  let valid = true;

  const name = form.querySelector('#conf-full-name');
  if (!name.value.trim() || name.value.trim().length < 2) {
    showError('conf-full-name', 'err-conf-full-name'); valid = false;
  }

  const phone = form.querySelector('#conf-phone');
  if (!isValidKenyanPhone(phone.value)) {
    showError('conf-phone', 'err-conf-phone'); valid = false;
  }

  const gender = form.querySelector('#conf-gender');
  if (!gender.value) {
    showError('conf-gender', 'err-conf-gender'); valid = false;
  }

  const region = form.querySelector('#conf-region');
  if (!region.value) {
    showError('conf-region', 'err-conf-region'); valid = false;
  }

  const church = form.querySelector('#conf-church');
  if (!church.value.trim()) {
    showError('conf-church', 'err-conf-church'); valid = false;
  }

  return valid;
}

function collectConfData(form) {
  return {
    formType:      'Conference Registration',
    timestamp:     new Date().toISOString(),
    fullName:      sanitize(form.querySelector('#conf-full-name').value.trim()),
    phone:         sanitize(form.querySelector('#conf-phone').value.trim()),
    gender:        sanitize(form.querySelector('#conf-gender').value),
    region:        sanitize(form.querySelector('#conf-region').value),
    church:        sanitize(form.querySelector('#conf-church').value.trim()),
    allergies:     sanitize(form.querySelector('#conf-allergies').value.trim()),
    specialDiet:   sanitize(form.querySelector('#conf-diet').value.trim()),
  };
}

function setConfLoading(loading) {
  const btn     = document.getElementById('conf-submit');
  const text    = document.getElementById('conf-submit-text');
  const spinner = document.getElementById('conf-submit-spinner');
  if (!btn) return;
  btn.disabled = loading;
  text.textContent = loading ? 'Registering…' : 'Complete Registration';
  spinner.style.display = loading ? 'inline' : 'none';
}

function showConfError(message) {
  const banner = document.getElementById('conf-error-banner');
  const msg    = document.getElementById('conf-error-msg');
  if (!banner) return;
  msg.textContent = message;
  banner.style.display = 'flex';
}

function hideConfError() {
  const banner = document.getElementById('conf-error-banner');
  if (banner) banner.style.display = 'none';
}

async function handleConfSubmit(e) {
  e.preventDefault();
  if (confSubmitted) return;
  hideConfError();

  const form     = document.getElementById('conf-form');
  const honeypot = form.querySelector('#conf-website');
  if (honeypot && honeypot.value.trim()) return;

  if (!validateConfForm(form)) {
    showConfError('Please fill in all required fields correctly.');
    const firstError = form.querySelector('.form-control.error');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const data = collectConfData(form);
  setConfLoading(true);

  try {
    if (CONF_ENDPOINT.includes('YOUR_CONF_SCRIPT_ID')) {
      await new Promise(r => setTimeout(r, 1200));
    } else {
      await submitToSheets(CONF_ENDPOINT, data);
    }
    confSubmitted = true;
    form.style.display = 'none';
    document.getElementById('conf-success').style.display = 'block';
  } catch (err) {
    console.error('Conference registration error:', err);
    showConfError('Registration failed. Please check your connection and try again.');
  } finally {
    setConfLoading(false);
  }
}

function initConfLiveValidation(form) {
  const pairs = [
    ['conf-full-name', 'err-conf-full-name'],
    ['conf-phone',     'err-conf-phone'],
    ['conf-gender',    'err-conf-gender'],
    ['conf-region',    'err-conf-region'],
    ['conf-church',    'err-conf-church'],
  ];
  pairs.forEach(([id, errId]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input',  () => { if (el.value.trim()) clearError(id, errId); });
    el.addEventListener('change', () => { if (el.value.trim()) clearError(id, errId); });
  });
}

/* ══════════════════════════════════════════════════════════════
   COMMITTEE REGISTRATION FORM
══════════════════════════════════════════════════════════════ */

function validateCommitteeForm(form) {
  clearAllErrors(form);
  let valid = true;

  const name = form.querySelector('#committee-full-name');
  if (!name.value.trim() || name.value.trim().length < 2) {
    showError('committee-full-name', 'err-committee-full-name'); valid = false;
  }

  const phone = form.querySelector('#committee-phone');
  if (!isValidKenyanPhone(phone.value)) {
    showError('committee-phone', 'err-committee-phone'); valid = false;
  }

  const gender = form.querySelector('#committee-gender');
  if (!gender.value) {
    showError('committee-gender', 'err-committee-gender'); valid = false;
  }

  const region = form.querySelector('#committee-region');
  if (!region.value) {
    showError('committee-region', 'err-committee-region'); valid = false;
  }

  const dept = form.querySelector('#committee-department');
  if (!dept.value) {
    showError('committee-department', 'err-committee-department'); valid = false;
  }

  return valid;
}

function collectCommitteeData(form) {
  return {
    formType:   'Committee Registration',
    timestamp:  new Date().toISOString(),
    fullName:   sanitize(form.querySelector('#committee-full-name').value.trim()),
    phone:      sanitize(form.querySelector('#committee-phone').value.trim()),
    gender:     sanitize(form.querySelector('#committee-gender').value),
    region:     sanitize(form.querySelector('#committee-region').value),
    department: sanitize(form.querySelector('#committee-department').value),
  };
}

function setCommitteeLoading(loading) {
  const btn     = document.getElementById('committee-submit');
  const text    = document.getElementById('committee-submit-text');
  const spinner = document.getElementById('committee-submit-spinner');
  if (!btn) return;
  btn.disabled = loading;
  text.textContent = loading ? 'Submitting…' : 'Submit Application';
  spinner.style.display = loading ? 'inline' : 'none';
}

function showCommitteeError(message) {
  const banner = document.getElementById('committee-error-banner');
  const msg    = document.getElementById('committee-error-msg');
  if (!banner) return;
  msg.textContent = message;
  banner.style.display = 'flex';
}

function hideCommitteeError() {
  const banner = document.getElementById('committee-error-banner');
  if (banner) banner.style.display = 'none';
}

async function handleCommitteeSubmit(e) {
  e.preventDefault();
  if (committeeSubmitted) return;
  hideCommitteeError();

  const form     = document.getElementById('committee-form');
  const honeypot = form.querySelector('#committee-website');
  if (honeypot && honeypot.value.trim()) return;

  if (!validateCommitteeForm(form)) {
    showCommitteeError('Please fill in all required fields correctly.');
    const firstError = form.querySelector('.form-control.error');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const data = collectCommitteeData(form);
  setCommitteeLoading(true);

  try {
    if (COMMITTEE_ENDPOINT.includes('YOUR_COMMITTEE_SCRIPT_ID')) {
      await new Promise(r => setTimeout(r, 1200));
    } else {
      await submitToSheets(COMMITTEE_ENDPOINT, data);
    }
    committeeSubmitted = true;
    form.style.display = 'none';
    document.getElementById('committee-success').style.display = 'block';
  } catch (err) {
    console.error('Committee registration error:', err);
    showCommitteeError('Submission failed. Please check your connection and try again.');
  } finally {
    setCommitteeLoading(false);
  }
}

function initCommitteeLiveValidation(form) {
  const pairs = [
    ['committee-full-name',   'err-committee-full-name'],
    ['committee-phone',       'err-committee-phone'],
    ['committee-gender',      'err-committee-gender'],
    ['committee-region',      'err-committee-region'],
    ['committee-department',  'err-committee-department'],
  ];
  pairs.forEach(([id, errId]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input',  () => { if (el.value.trim()) clearError(id, errId); });
    el.addEventListener('change', () => { if (el.value.trim()) clearError(id, errId); });
  });
}

/* ══════════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Open buttons ── */
  document.getElementById('open-conf-modal')
    ?.addEventListener('click', () => openModal('conf-modal'));

  document.getElementById('open-committee-modal')
    ?.addEventListener('click', () => openModal('committee-modal'));

  /* ── Close buttons ── */
  document.getElementById('close-conf-modal')
    ?.addEventListener('click', () => closeModal('conf-modal'));

  document.getElementById('close-committee-modal')
    ?.addEventListener('click', () => closeModal('committee-modal'));

  document.getElementById('conf-success-close')
    ?.addEventListener('click', () => closeModal('conf-modal'));

  document.getElementById('committee-success-close')
    ?.addEventListener('click', () => closeModal('committee-modal'));

  /* ── Backdrop click closes ── */
  document.getElementById('modal-backdrop')
    ?.addEventListener('click', closeAllModals);

  /* ── Keyboard: Escape + focus trap ── */
  document.addEventListener('keydown', e => {
    const activeModal = document.querySelector('.modal-overlay.is-open');
    if (!activeModal) return;
    trapFocus(activeModal, e);
  });

  /* ── Form submission ── */
  document.getElementById('conf-form')
    ?.addEventListener('submit', handleConfSubmit);

  document.getElementById('committee-form')
    ?.addEventListener('submit', handleCommitteeSubmit);

  /* ── Live validation ── */
  const confForm      = document.getElementById('conf-form');
  const committeeForm = document.getElementById('committee-form');
  if (confForm)      initConfLiveValidation(confForm);
  if (committeeForm) initCommitteeLiveValidation(committeeForm);
});
