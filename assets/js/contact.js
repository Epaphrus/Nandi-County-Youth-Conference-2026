/* ============================================================
   NANDI COUNTY YOUTH CONFERENCE 2026
   contact.js — Contact form validation and submission
   ============================================================ */

const CONTACT_ENDPOINT = 'https://script.google.com/macros/s/YOUR_CONTACT_SCRIPT_ID/exec';

function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML.trim();
}

function showFieldError(fieldId, errId) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(errId);
  if (field) field.classList.add('error');
  if (err)   err.classList.add('visible');
}

function clearAllErrors() {
  document.querySelectorAll('.form-control.error').forEach(el => el.classList.remove('error'));
  document.querySelectorAll('.form-error.visible').forEach(el => el.classList.remove('visible'));
}

function validateContact(form) {
  clearAllErrors();
  let valid = true;

  const name = form.querySelector('#c-name');
  if (!name.value.trim()) { showFieldError('c-name', 'err-c-name'); valid = false; }

  const phone = form.querySelector('#c-phone');
  const cleaned = phone.value.replace(/\s+/g, '');
  if (!/^(0|\+254)[0-9]{9}$/.test(cleaned)) { showFieldError('c-phone', 'err-c-phone'); valid = false; }

  const subject = form.querySelector('#c-subject');
  if (!subject.value) { showFieldError('c-subject', 'err-c-subject'); valid = false; }

  const message = form.querySelector('#c-message');
  if (!message.value.trim() || message.value.trim().length < 10) { showFieldError('c-message', 'err-c-message'); valid = false; }

  return valid;
}

async function handleContactSubmit(e) {
  e.preventDefault();
  const form      = document.getElementById('contact-form');
  const honeypot  = form.querySelector('#website2');
  const submitBtn = document.getElementById('contact-submit');
  const submitTxt = document.getElementById('contact-submit-text');

  if (honeypot && honeypot.value.trim()) return;
  if (!validateContact(form)) return;

  submitBtn.disabled = true;
  submitTxt.textContent = 'Sending…';

  const data = {
    type:      'contact',
    timestamp: new Date().toISOString(),
    name:      sanitize(form.querySelector('#c-name').value.trim()),
    phone:     sanitize(form.querySelector('#c-phone').value.trim()),
    subject:   sanitize(form.querySelector('#c-subject').value),
    message:   sanitize(form.querySelector('#c-message').value.trim()),
  };

  try {
    if (!CONTACT_ENDPOINT.includes('YOUR_CONTACT_SCRIPT_ID')) {
      await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      });
    } else {
      await new Promise(r => setTimeout(r, 1000));
    }

    form.style.display = 'none';
    document.getElementById('contact-success').style.display = 'flex';

  } catch (err) {
    console.error('Contact form error:', err);
    submitBtn.disabled = false;
    submitTxt.textContent = 'Send Message';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', handleContactSubmit);
});
