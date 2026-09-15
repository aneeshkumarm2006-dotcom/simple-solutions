/* =========================================================
   Final Expense 2026 — quote form
   Name, phone, age, ZIP, optional email -> thank-you panel.
   Nothing is posted anywhere yet: point submit() at your CRM.
   ========================================================= */
(function () {
  'use strict';

  var MIN_AGE = 50;
  var MAX_AGE = 80;

  function el(id) { return document.getElementById(id); }

  function digits(value) { return (value || '').replace(/\D/g, ''); }

  /* Ages 50-80 in the dropdown, so nobody has to guess the range */
  function fillAges() {
    var select = el('age');
    if (!select) return;

    for (var age = MIN_AGE; age <= MAX_AGE; age++) {
      var option = document.createElement('option');
      option.value = String(age);
      option.textContent = String(age);
      select.appendChild(option);
    }
  }

  function validate() {
    var name = el('name').value.trim();
    var phone = digits(el('phone').value);
    var age = el('age').value;
    var zip = digits(el('zip').value);
    var email = el('email').value.trim();

    if (name.length < 2) return 'Please enter your full name.';
    if (phone.length !== 10) return 'Please enter a 10-digit phone number.';
    if (!age) return 'Please select your age.';
    if (zip.length !== 5) return 'Please enter a 5-digit ZIP code.';
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'Please enter a valid email address, or leave it blank.';

    return '';
  }

  function submit(e) {
    if (e) e.preventDefault();

    var error = el('formErr');
    var message = validate();

    if (message) {
      error.textContent = message;
      return false;
    }

    error.textContent = '';

    el('nameOut').textContent = el('name').value.trim().split(/\s+/)[0];
    el('zipOut').textContent = digits(el('zip').value);

    el('leadForm').classList.add('hidden');
    el('thanks').classList.remove('hidden');

    var card = document.querySelector('.quote-card');
    if (card) card.classList.add('is-done');

    keepCardInView();
    return false;
  }

  /* Only scroll if the card has drifted off screen */
  function keepCardInView() {
    var card = document.querySelector('.quote-card');
    if (!card || !card.getBoundingClientRect) return;

    var box = card.getBoundingClientRect();
    if (box.top >= 0 && box.bottom <= (window.innerHeight || 0)) return;

    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* (555) 555-5555 as they type */
  function formatPhone(value) {
    var d = digits(value).slice(0, 10);
    if (d.length < 4) return d;
    if (d.length < 7) return '(' + d.slice(0, 3) + ') ' + d.slice(3);
    return '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
  }

  function clearError() { el('formErr').textContent = ''; }

  document.addEventListener('DOMContentLoaded', function () {
    fillAges();

    var form = el('leadForm');
    if (form) form.addEventListener('submit', submit);

    var phone = el('phone');
    if (phone) {
      phone.addEventListener('input', function () {
        this.value = formatPhone(this.value);
        clearError();
      });
    }

    var zip = el('zip');
    if (zip) {
      zip.addEventListener('input', function () {
        this.value = digits(this.value).slice(0, 5);
        clearError();
      });
    }

    var others = ['name', 'email', 'age'];
    for (var i = 0; i < others.length; i++) {
      var field = el(others[i]);
      if (field) field.addEventListener('input', clearError);
    }
  });
})();
