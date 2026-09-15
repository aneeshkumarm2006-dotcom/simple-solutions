/* =========================================================
   Final Expense 2026 — eligibility quiz
   Two yes/no questions -> pre-qualified screen with a
   countdown timer. Every answer advances to the next step;
   final qualification happens on the call with the agent.
   ========================================================= */
(function () {
  'use strict';

  var TIMER_SECONDS = 5 * 60;

  function el(id) { return document.getElementById(id); }

  function showStep(step) {
    var steps = document.querySelectorAll('[data-quiz-step]');
    for (var i = 0; i < steps.length; i++) steps[i].classList.add('hidden');
    if (step) step.classList.remove('hidden');
  }

  function nextStep(current) {
    var next = current.nextElementSibling;
    while (next && !next.hasAttribute('data-quiz-step')) next = next.nextElementSibling;
    if (next) showStep(next);
    if (next && next.id === 'quizStep3') startTimer();
  }

  function bindQuiz() {
    var steps = document.querySelectorAll('[data-quiz-step]');
    if (!steps.length) return;

    for (var i = 0; i < steps.length; i++) {
      var step = steps[i];
      var buttons = step.querySelectorAll('[data-quiz-answer]');
      for (var j = 0; j < buttons.length; j++) {
        buttons[j].addEventListener('click', (function (s) {
          return function () { nextStep(s); };
        })(step));
      }
    }
  }

  function startTimer() {
    var display = el('quizTimer');
    if (!display || display.dataset.running) return;
    display.dataset.running = '1';

    var remaining = TIMER_SECONDS;

    function render() {
      var m = Math.floor(remaining / 60);
      var s = remaining % 60;
      display.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }

    render();
    var tick = setInterval(function () {
      remaining--;
      if (remaining < 0) {
        clearInterval(tick);
        return;
      }
      render();
    }, 1000);
  }

  document.addEventListener('DOMContentLoaded', bindQuiz);
})();
