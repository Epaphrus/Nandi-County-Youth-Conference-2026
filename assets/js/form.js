/* ============================================================
   NANDI COUNTY YOUTH CONFERENCE 2026
   form.js — Registration form validation + Google Sheets POST
   ============================================================ */

/* ── Google Sheets Apps Script endpoint ────────────────────── */
// Replace this URL with your deployed Apps Script web app URL.
// Setup guide: https://docs.google.com/spreadsheets → Extensions → Apps Script
const SHEETS_ENDPOINT = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

/* ── Sanitize input (prevent XSS) ─────────────────────────── */
function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML.trim();
}

/* ── Validate phone: accepts 07XX... or +2547X... ──────────── */
function isValidKenyanPhone(phone) {
  const cleaned = phone.replace(/\s+/g, '');
  return /^(0|\+254)[0-9]{9}$/.test(cleaned);
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

function clearAllErrors() {
  document.querySelectorAll('.form-control.error').forEach(el => el.classList.remove('error'));
  document.querySelectorAll('.form-error.visible').forEach(el => el.classList.remove('visible'));
}

/* ── Validate full form; returns true if valid ─────────────── */
function validateForm(form) {
  clearAllErrors();
  let valid = true;

  // Full name
  const name = form.querySelector('#full-name');
  if (!name.value.trim() || name.value.trim().length < 2) {
    showError('full-name', 'err-full-name');
    valid = false;
  }

  // Phone
  const phone = form.querySelector('#phone');
  if (!isValidKenyanPhone(phone.value)) {
    showError('phone', 'err-phone');
    valid = false;
  }

  // Email (only validate if filled)
  const email = form.querySelector('#email');
  if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    showError('email', 'err-email');
    valid = false;
  }

  // Gender
  const gender = form.querySelector('#gender');
  if (!gender.value) {
    showError('gender', 'err-gender');
    valid = false;
  }

  // Age
  const age = form.querySelector('#age');
  const ageVal = parseInt(age.value, 10);
  if (!age.value || isNaN(ageVal) || ageVal < 12 || ageVal > 35) {
    showError('age', 'err-age');
    valid = false;
  }

  // Church name
  const church = form.querySelector('#church-name');
  if (!church.value.trim()) {
    showError('church-name', 'err-church-name');
    valid = false;
  }

  // Sub-county
  const subCounty = form.querySelector('#sub-county');
  if (!subCounty.value) {
    showError('sub-county', 'err-sub-county');
    valid = false;
  }

  // Accommodation
  const accommodation = form.querySelector('input[name="accommodation"]:checked');
  if (!accommodation) {
    document.getElementById('err-accommodation').classList.add('visible');
    valid = false;
  }

  // Transport
  const transport = form.querySelector('input[name="transport"]:checked');
  if (!transport) {
    document.getElementById('err-transport').classList.add('visible');
    valid = false;
  }

  return valid;
}

/* ── Collect form data ─────────────────────────────────────── */
function collectFormData(form) {
  return {
    timestamp:      new Date().toISOString(),
    fullName:       sanitize(form.querySelector('#full-name').value.trim()),
    phone:          sanitize(form.querySelector('#phone').value.trim()),
    email:          sanitize(form.querySelector('#email').value.trim()),
    gender:         sanitize(form.querySelector('#gender').value),
    age:            sanitize(form.querySelector('#age').value),
    churchName:     sanitize(form.querySelector('#church-name').value.trim()),
    subCounty:      sanitize(form.querySelector('#sub-county').value),
    pastorName:     sanitize(form.querySelector('#pastor-name').value.trim()),
    accommodation:  form.querySelector('input[name="accommodation"]:checked')?.value || '',
    transport:      form.querySelector('input[name="transport"]:checked')?.value || '',
    prayerRequests: sanitize(form.querySelector('#prayer-requests').value.trim()),
    expectations:   sanitize(form.querySelector('#expectations').value.trim()),
  };
}

/* ── Submit to Google Sheets ───────────────────────────────── */
async function submitToSheets(data) {
  const params = new URLSearchParams(data);
  const response = await fetch(SHEETS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  if (!response.ok) throw new Error(`Server error: ${response.status}`);
  return response;
}

/* ── UI state helpers ──────────────────────────────────────── */
function setLoading(loading) {
  const btn     = document.getElementById('reg-submit');
  const text    = document.getElementById('reg-submit-text');
  const spinner = document.getElementById('reg-submit-spinner');
  if (!btn) return;
  btn.disabled = loading;
  text.textContent = loading ? 'Registering…' : 'Complete Registration';
  spinner.style.display = loading ? 'inline' : 'none';
}

function showBanner(type, message) {
  const banner = document.getElementById('reg-error-banner');
  const msg    = document.getElementById('reg-error-msg');
  if (!banner) return;
  banner.className = `alert alert-${type}`;
  msg.textContent  = message;
  banner.style.display = 'flex';
  banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hideBanner() {
  const banner = document.getElementById('reg-error-banner');
  if (banner) banner.style.display = 'none';
}

/* ── Main submit handler ───────────────────────────────────── */
async function handleSubmit(e) {
  e.preventDefault();
  hideBanner();

  const form     = document.getElementById('registration-form');
  const honeypot = form.querySelector('#website');

  // Bot check
  if (honeypot && honeypot.value.trim() !== '') {
    return; // silently reject
  }

  if (!validateForm(form)) {
    showBanner('error', 'Please fill in all required fields correctly.');
    // Scroll to first error
    const firstError = form.querySelector('.form-control.error');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const data = collectFormData(form);
  setLoading(true);

  try {
    // If no endpoint configured, skip network and show success (dev mode)
    if (SHEETS_ENDPOINT.includes('YOUR_SCRIPT_ID')) {
      await new Promise(r => setTimeout(r, 1200)); // simulate latency
    } else {
      await submitToSheets(data);
    }

    // Show success
    form.style.display = 'none';
    document.getElementById('reg-success').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (err) {
    console.error('Registration error:', err);
    showBanner('error', 'Registration failed. Please check your connection and try again.');
  } finally {
    setLoading(false);
  }
}

/* ── Live validation (clear errors on fix) ─────────────────── */
function initLiveValidation() {
  const fields = [
    ['full-name',   'err-full-name'],
    ['phone',       'err-phone'],
    ['email',       'err-email'],
    ['gender',      'err-gender'],
    ['age',         'err-age'],
    ['church-name', 'err-church-name'],
    ['sub-county',  'err-sub-county'],
  ];

  fields.forEach(([id, errId]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      if (el.value.trim()) clearError(id, errId);
    });
    el.addEventListener('change', () => {
      if (el.value.trim()) clearError(id, errId);
    });
  });
}

/* ── Init ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registration-form');
  if (!form) return;
  form.addEventListener('submit', handleSubmit);
  initLiveValidation();
});
