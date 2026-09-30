// Cierre de clases SIMCE en las guías que escriben directo en Firebase.
// Si la sesión está cerrada (`activa: false` o `respuestas_bloqueadas: true`) y el
// estudiante no tiene una excepción individual, se muestra una capa y la guía no
// carga ni guarda respuestas. Si la sesión no se puede leer, la guía sigue abierta:
// un problema de red nunca impide trabajar.
(function () {
  'use strict';

  var PANEL_URL = '/estudiantes/dashboard.html';

  function isClosed(session, uid) {
    if (!session) return false;
    var exceptions = session.excepciones_desbloqueo || {};
    if (uid && exceptions[uid] === true) return false;
    return session.activa === false || session.respuestas_bloqueadas === true;
  }

  function showLayer() {
    if (document.getElementById('simceSessionClosed')) return;
    var layer = document.createElement('div');
    layer.id = 'simceSessionClosed';
    layer.setAttribute('role', 'dialog');
    layer.setAttribute('aria-modal', 'true');
    layer.setAttribute('aria-labelledby', 'simceSessionClosedTitle');
    layer.style.cssText = 'position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(15,23,42,.72)';
    layer.innerHTML =
      '<div style="width:100%;max-width:420px;background:#fff;color:#0f172a;border-radius:16px;padding:24px 20px;box-shadow:0 20px 50px rgba(0,0,0,.35);font-family:Arial,Helvetica,sans-serif;text-align:center">' +
        '<div aria-hidden="true" style="font-size:2rem;line-height:1">🔒</div>' +
        '<h2 id="simceSessionClosedTitle" style="margin:10px 0 8px;font-size:1.25rem">Clase cerrada</h2>' +
        '<p style="margin:0 0 18px;font-size:1rem;line-height:1.5;color:#334155">Esta clase ya cerró para el curso. Tu nota está en tu panel. Si faltaste con justificación, escríbele al profesor.</p>' +
        '<a id="simceSessionClosedBack" href="' + PANEL_URL + '" style="display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 20px;box-sizing:border-box;border-radius:10px;background:#1d4ed8;color:#fff;font-weight:700;text-decoration:none">Volver a mi panel</a>' +
      '</div>';
    document.body.appendChild(layer);
    document.documentElement.style.overflow = 'hidden';
    var back = document.getElementById('simceSessionClosedBack');
    if (back) back.focus();
  }

  function check(db, base, sessionId, uid) {
    return db.ref(base + '/sesiones/' + sessionId).once('value').then(function (snap) {
      var closed = isClosed(snap.val(), uid);
      if (closed) {
        window.__simceSessionClosed = true;
        showLayer();
      }
      return closed;
    }).catch(function () {
      return false;
    });
  }

  window.SimceSessionGate = { check: check, isClosed: isClosed };
})();
