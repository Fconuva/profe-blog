/* guia-lock.js — Candado de guías interactivas (PAES)
 *
 * Cada página guiaN.html define su id antes de cargar este script:
 *     <script>window.GUIA_LOCK_ID = 'g10';</script>
 *     <script src="js/guia-lock.js"></script>
 *
 * El docente decide en el admin qué guías quedan disponibles. Si esta guía está
 * bloqueada, mostramos una pantalla de candado y el alumno no puede resolverla.
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
      if (document.body) showLock();
      else document.addEventListener('DOMContentLoaded', showLock);
      return false;
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
