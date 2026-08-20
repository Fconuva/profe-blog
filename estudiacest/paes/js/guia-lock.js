/* guia-lock.js — Candado de guías interactivas (PAES)
 *
 * Cada página guiaN.html define su id antes de cargar este script:
 *     <script>window.GUIA_LOCK_ID = 'g10';</script>
 *     <script src="js/guia-lock.js"></script>
 *
 * El docente decide en el admin qué guías quedan disponibles. Si esta guía está
 * bloqueada, mostramos una pantalla de candado y el alumno no puede resolverla.
 * Si ya entregó y el docente publicó los resultados, puede entrar únicamente
 * en modo revisión para consultar su puntaje y sus respuestas.
 *
 * fail-open: si la config no se puede leer (API caída, sin red), NO se bloquea.
 */
(function () {
  var id = window.GUIA_LOCK_ID;
  if (!id) return;

  function showLock() {
    if (document.getElementById('guiaLockOverlay')) return;
    var overlay = document.createElement('div');
    overlay.id = 'guiaLockOverlay';
    overlay.style.cssText =
      'position:fixed; inset:0; z-index:99999; background:#060813; ' +
      'display:flex; align-items:center; justify-content:center; padding:24px; ' +
      "font-family:'Inter',system-ui,sans-serif;";
    overlay.innerHTML =
      '<div style="max-width:440px; width:100%; text-align:center; background:rgba(13,17,34,0.85); ' +
      'border:1px solid rgba(255,255,255,0.08); border-radius:28px; padding:40px; ' +
      'box-shadow:0 20px 48px rgba(0,0,0,0.5);">' +
      '<div style="font-size:48px; margin-bottom:16px;">🔒</div>' +
      '<h2 style="font-family:\'Outfit\',sans-serif; font-size:22px; font-weight:800; color:#fff; margin:0 0 10px;">Guía no disponible</h2>' +
      '<p style="font-size:14px; color:#94a3b8; line-height:1.55; margin:0 0 24px;">' +
      'Esta guía está bloqueada por el docente en este momento. Vuelve al listado para ver las guías habilitadas hoy.</p>' +
      '<a href="guias.html" style="display:inline-flex; align-items:center; gap:8px; text-decoration:none; ' +
      'padding:12px 22px; border-radius:12px; font-size:14px; font-weight:800; color:#fff; ' +
      'background:linear-gradient(135deg,#7c3aed 0%,#8b5cf6 50%,#a78bfa 100%);">← Volver a las guías</a>' +
      '</div>';
    if (document.body) {
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';
    }
  }

  function removeLock() {
    var overlay = document.getElementById('guiaLockOverlay');
    if (overlay) overlay.remove();
    if (document.body) document.body.style.overflow = '';
  }

  function guideNumber() {
    return String(id).replace(/^g/, '');
  }

  function fetchReleasedAttempt(studentRut) {
    return fetch('/api/paes?action=get-guia-state&guiaId=' +
      encodeURIComponent(guideNumber()) + '&rut=' + encodeURIComponent(studentRut))
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      });
  }

  function lockResponseControls() {
    var selectors = [
      '.opt[data-q][data-ans]', '.option[data-q]', '[data-question-id] button',
      'input[type="radio"]', 'textarea[data-save]', 'select[data-save]',
      '#btnReview', '#btnSend', '#btnReset', '#submitButton', '#submitBtn'
    ];
    document.querySelectorAll(selectors.join(',')).forEach(function (element) {
      if ('disabled' in element) element.disabled = true;
      element.setAttribute('aria-disabled', 'true');
      element.style.pointerEvents = 'none';
    });
  }

  function addReviewBanner() {
    if (document.getElementById('guiaReviewOnlyBanner')) return;
    var banner = document.createElement('div');
    banner.id = 'guiaReviewOnlyBanner';
    banner.setAttribute('role', 'status');
    banner.style.cssText =
      'position:sticky; top:0; z-index:9998; padding:13px 20px; text-align:center; ' +
      'font:700 14px/1.4 Inter,system-ui,sans-serif; color:#12372f; background:#ecfdf5; ' +
      'border-bottom:1px solid #a7f3d0; box-shadow:0 4px 14px rgba(15,23,42,.08);';
    banner.textContent = 'Resultados publicados · Modo de revisión. Puedes consultar tu puntaje y tus respuestas, pero no modificarlas.';
    document.body.insertBefore(banner, document.body.firstChild);
  }

  function renderLegacyReview(data) {
    var number = Number(guideNumber());
    if (number < 10 || number > 13) return;
    var attempts = 0;
    var timer = setInterval(function () {
      attempts += 1;
      var questions = document.querySelectorAll('.question[id^="q-"]');
      if (!questions.length && attempts < 100) return;
      clearInterval(timer);
      var answers = data.attempt.answers || {};
      var answerKey = data.answerKey || {};
      Object.keys(answerKey).forEach(function (questionId) {
        var row = document.getElementById('q-' + questionId);
        if (!row) return;
        var chosen = answers[questionId];
        var correct = answerKey[questionId];
        row.querySelectorAll('.opt[data-ans]').forEach(function (option) {
          var letter = option.getAttribute('data-ans');
          option.classList.remove('selected', 'correct', 'wrong');
          if (letter === chosen) option.classList.add('selected');
          if (letter === correct) option.classList.add('correct');
          else if (letter === chosen) option.classList.add('wrong');
        });
        var feedback = document.getElementById('fb-' + questionId);
        if (feedback) {
          var isCorrect = chosen === correct;
          var status = !chosen ? 'Sin responder' : (isCorrect ? 'Correcta' : 'Incorrecta');
          feedback.className = 'feedback show ' + (isCorrect ? 'ok' : 'no');
          feedback.innerHTML = '<div class="fb-status">' + status +
            ' · Tu respuesta: ' + (chosen || '—') + ' · Respuesta correcta: ' + correct + '.</div>';
        }
      });
      var result = data.attempt.result || {};
      var scoreBig = document.getElementById('scoreBig');
      var scoreLabel = document.getElementById('scoreLbl');
      var scoreBanner = document.getElementById('scoreBanner');
      if (scoreBig) scoreBig.textContent = (result.correct || 0) + ' / ' + (result.total || Object.keys(answerKey).length);
      if (scoreLabel) scoreLabel.textContent = (result.score || 0) + '% de logro. Revisa en verde tus aciertos y en rojo los ítems por mejorar.';
      if (scoreBanner) scoreBanner.classList.add('show');
      lockResponseControls();
    }, 50);
  }

  function enableReviewOnly(data) {
    window.PAES_GUIDE_REVIEW_ONLY = true;
    removeLock();
    function activate() {
      document.body.setAttribute('data-paes-review-only', 'true');
      addReviewBanner();
      renderLegacyReview(data);
      lockResponseControls();
      var passes = 0;
      var lockTimer = setInterval(function () {
        lockResponseControls();
        passes += 1;
        if (passes >= 40) clearInterval(lockTimer);
      }, 100);
      window.dispatchEvent(new CustomEvent('paes-review-only-ready', { detail: data }));
    }
    if (document.body) activate();
    else document.addEventListener('DOMContentLoaded', activate, { once: true });
  }

  function checkAccess(studentRut) {
    if (!studentRut) return Promise.resolve(true);
    return fetch('/api/paes?action=get-guias-config&rut=' + encodeURIComponent(studentRut))
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
      var blocked = (data && data.config && data.config.blocked) || {};
      var allowed = (data && data.config && data.config.allowed) || {};
      if (!blocked[id] || allowed[id]) {
        removeLock();
        return true;
      }
      return fetchReleasedAttempt(studentRut)
        .then(function (state) {
          if (state && state.released && state.attempt && state.attempt.completada) {
            enableReviewOnly(state);
            return true;
          }
          if (document.body) showLock();
          else document.addEventListener('DOMContentLoaded', showLock);
          return false;
        })
        .catch(function (err) {
          console.warn('[guia-lock] revisión no disponible', err);
          if (document.body) showLock();
          else document.addEventListener('DOMContentLoaded', showLock);
          return false;
        });
    })
      .catch(function (err) {
        console.warn('[guia-lock] config no disponible (fail-open)', err);
        return true;
      });
  }

  window.checkGuiaAccess = checkAccess;
  window.addEventListener('paes-student-authenticated', function (event) {
    var detail = event && event.detail;
    checkAccess(detail && detail.rut ? detail.rut : '');
  });

  // G14 conserva un inicio de sesión propio. Esperamos a que valide el RUN y
  // retire su formulario antes de aplicar el mismo candado del resto.
  if (id === 'g14') {
    document.addEventListener('submit', function (event) {
      if (!event.target || !event.target.classList.contains('g14-login-card')) return;
      var input = event.target.querySelector('#g14-rut');
      var rut = input ? input.value : '';
      var attempts = 0;
      var g14IdentityTimer = setInterval(function () {
        attempts += 1;
        if (!document.getElementById('g14-login')) {
          clearInterval(g14IdentityTimer);
          checkAccess(rut);
        } else if (attempts >= 30) {
          clearInterval(g14IdentityTimer);
        }
      }, 200);
    }, true);
  }

  var studentRut = '';
  try {
    var storedStudent = JSON.parse(sessionStorage.getItem('paes_student') || 'null');
    studentRut = storedStudent && storedStudent.rut ? storedStudent.rut : '';
  } catch (_) {}
  if (studentRut) {
    checkAccess(studentRut);
  } else {
    var attempts = 0;
    var identityTimer = setInterval(function () {
      attempts += 1;
      try {
        var current = JSON.parse(sessionStorage.getItem('paes_student') || 'null');
        if (current && current.rut) {
          clearInterval(identityTimer);
          checkAccess(current.rut);
        } else if (attempts >= 300) {
          clearInterval(identityTimer);
        }
      } catch (_) {
        if (attempts >= 300) clearInterval(identityTimer);
      }
    }, 200);
  }
})();
