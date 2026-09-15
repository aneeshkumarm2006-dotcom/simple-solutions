/* =========================================================
   Final Expense 2026 — eligibility worksheet
   Fields: ZIP -> age 50-80 -> US citizen/resident -> result
   The card never leaves the first screen, so steps swap in place.
   ========================================================= */
(function () {
  'use strict';

  var SCREENS = ['step1', 'step2', 'step3', 'pass', 'fail'];

  var answers = { zip: '', age: null, resident: null };

  function el(id) { return document.getElementById(id); }

  function show(id) {
    for (var i = 0; i < SCREENS.length; i++) {
      var node = el(SCREENS[i]);
      if (node) node.classList.add('hidden');
    }
    var target = el(id);
    if (target) target.classList.remove('hidden');

    keepCardInView();
  }

  /* Only scroll if the card has drifted off screen — no jump on step 1 -> 2 */
  function keepCardInView() {
    var doc = el('funnel');
    if (!doc || !doc.getBoundingClientRect) return;

    var box = doc.getBoundingClientRect();
    var fits = box.top >= 0 && box.bottom <= (window.innerHeight || 0);
    if (fits) return;

    doc.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ---- Field 1: ZIP ---- */
  function submitZip(e) {
    if (e) e.preventDefault();

    var input = el('zip');
    var error = el('zipErr');
    var value = (input.value || '').replace(/\D/g, '');

    if (value.length !== 5) {
      error.textContent = 'Enter a 5-digit ZIP code to continue.';
      input.focus();
      return false;
    }

    error.textContent = '';
    answers.zip = value;
    show('step2');
    return false;
  }

  /* ---- Fields 2 and 3: yes / no ---- */
  function answer(step, yes) {
    if (step === 2) {
      answers.age = yes;
      show(yes ? 'step3' : 'fail');
      return;
    }

    answers.resident = yes;

    if (answers.age && yes) {
      var zipOut = el('zipOut');
      if (zipOut) zipOut.textContent = answers.zip;
      show('pass');
      pressStamp();
    } else {
      show('fail');
    }
  }

  /* ---- The stamp: one orchestrated moment, at the payoff ---- */
  function pressStamp() {
    var stamp = el('stamp');
    if (!stamp) return;

    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still) return;

    stamp.classList.remove('stamp-in');
    void stamp.offsetWidth; // restart the animation
    stamp.classList.add('stamp-in');
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
        answers = { zip: '', age: null, resident: null };
        if (zip) zip.value = '';
        show('step1');
      });
    }
  });
})();
