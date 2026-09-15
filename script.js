/* =========================================================
   Final Expense 2026 — funnel logic
   3 steps: ZIP -> age 50-80 -> US citizen/resident -> result
   ========================================================= */
(function () {
  'use strict';

  var SCREENS = ['step1', 'step2', 'step3', 'pass', 'fail'];

  var answers = { zip: '', age: null, resident: null };
  var timerStarted = false;

  function el(id) { return document.getElementById(id); }

  function show(id) {
    for (var i = 0; i < SCREENS.length; i++) {
      var node = el(SCREENS[i]);
      if (node) node.classList.add('hidden');
    }
    var target = el(id);
    if (target) target.classList.remove('hidden');

    var card = el('funnel');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ---- Step 1: ZIP ---- */
  function submitZip(e) {
    if (e) e.preventDefault();
    var input = el('zip');
    var error = el('zipErr');
    var value = (input.value || '').replace(/\D/g, '');

    if (value.length !== 5) {
      error.textContent = 'Please enter a valid 5-digit ZIP code.';
      input.focus();
      return false;
    }

    error.textContent = '';
    answers.zip = value;
    show('step2');
    return false;
  }

  /* ---- Steps 2 and 3: yes/no ---- */
  function answer(step, yes) {
    if (step === 2) {
      answers.age = yes;
      if (yes) { show('step3'); } else { show('fail'); }
      return;
    }

    answers.resident = yes;
    if (answers.age && yes) {
      var zipOut = el('zipOut');
      if (zipOut) zipOut.textContent = answers.zip;
      show('pass');
      startTimer();
    } else {
      show('fail');
    }
  }

  /* ---- 5:00 hold timer on the pre-qualify screen ---- */
  function startTimer() {
    if (timerStarted) return;
    timerStarted = true;

    var left = 300;
    var clock = el('clock');
    if (!clock) return;

    var tick = setInterval(function () {
      left--;
      if (left <= 0) { left = 0; clearInterval(tick); }
      var m = Math.floor(left / 60);
      var s = left % 60;
      clock.textContent = m + ':' + (s < 10 ? '0' + s : s);
    }, 1000);
  }

  /* ---- Wire up ---- */
  document.addEventListener('DOMContentLoaded', function () {
    var form = el('zipForm');
    if (form) form.addEventListener('submit', submitZip);

    var zip = el('zip');
    if (zip) {
      zip.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 5);
        el('zipErr').textContent = '';
      });
    }

    var buttons = document.querySelectorAll('[data-step]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {
        answer(parseInt(this.getAttribute('data-step'), 10), this.getAttribute('data-answer') === 'yes');
      });
    }

    var restart = el('restart');
    if (restart) {
      restart.addEventListener('click', function (e) {
        e.preventDefault();
        show('step1');
      });
    }
  });
})();
