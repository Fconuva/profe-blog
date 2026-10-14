// Cierre de clases SIMCE en las guías que escriben directo en Firebase.
// Si la sesión está cerrada (`activa: false` o `respuestas_bloqueadas: true`) y el
// estudiante no tiene una excepción individual, se muestra una capa y la guía no
// carga ni guarda respuestas. Una lectura fallida no se interpreta como ausencia
// de entrega ni permite escribir sobre un intento que todavía no se restauró.
(function () {
  'use strict';

  var PANEL_URL = '/estudiantes/dashboard.html';
  var stores = new Map();
  function store(sessionId, uid) {
    var key = sessionId + '/' + uid;
    if (!stores.has(key)) {
      var saveQueue=Promise.resolve();
      stores.set(key, { loaded:false, finalizing:false, queue:saveQueue });
    }
    return stores.get(key);
  }
  function loadLayer(failed) {
    var layer = document.getElementById('simceLoadState');
    if (!layer) {
      layer = document.createElement('div'); layer.id = 'simceLoadState';
      layer.setAttribute('role','dialog'); layer.setAttribute('aria-modal','true');
      layer.style.cssText = 'position:fixed;inset:0;z-index:2147483001;display:grid;place-items:center;background:#0f172acc;padding:20px';
      document.body.appendChild(layer);
    }
    layer.innerHTML = '<div style="background:white;color:#172033;padding:24px;border-radius:16px;max-width:420px;font:16px Arial">' +
      (failed ? '<h2>No pudimos cargar tu trabajo</h2><p>No podemos comprobar tu entrega por ahora. Reintenta antes de escribir.</p><button type="button" id="simceLoadRetry">Reintentar</button>' : '<h2>Cargando tu trabajo…</h2><p>Espera mientras recuperamos tus respuestas.</p>') + '</div>';
    var retry = document.getElementById('simceLoadRetry');
    if (retry) retry.onclick = function () { window.location.reload(); };
  }
  function markLoaded(sessionId, uid) {
    store(sessionId,uid).loaded = true;
    var layer = document.getElementById('simceLoadState'); if (layer) layer.remove();
  }
  function saveDraft(db, base, sessionId, uid, data) {
    var state = store(sessionId,uid);
    if (!state.loaded) return Promise.reject(new Error('El trabajo anterior todavía no se ha cargado.'));
    if (state.finalizing) return state.queue;
    var captured = JSON.parse(JSON.stringify(data));
    state.queue = state.queue.catch(function () {}).then(async function () {
      if (state.finalizing) return;
      await db.ref(base + '/respuestas/' + sessionId + '/' + uid).transaction(function (current) {
        if (current && (current.completada === true || current.submitted === true)) return;
        return Object.assign({},current || {},captured);
      }, undefined, false);
    });
    return state.queue;
  }
  function confirmDelivery() {
    if (document.getElementById('simceDeliveryConfirmed')) return;
    var dialog = document.createElement('div'); dialog.id = 'simceDeliveryConfirmed';
    dialog.setAttribute('aria-label','Entrega confirmada');
    dialog.style.cssText = 'position:fixed;inset:0;z-index:2147483001;display:grid;place-items:center;background:#0f172acc;padding:20px';
    dialog.innerHTML = '<div role="dialog" aria-modal="true" style="background:white;color:#172033;padding:24px;border-radius:16px;max-width:420px;font:16px Arial"><h2>Entrega confirmada</h2><p>Tu trabajo quedó guardado. Aparecerá como Completada en tu panel.</p><a href="/estudiantes/dashboard.html">Volver a mi panel</a></div>';
    document.body.appendChild(dialog);
  }
  async function submit(db, BASE, sessionId, uid, response, result) {
    var state = store(sessionId,uid);
    if (!state.loaded) throw new Error('Espera a que se cargue tu trabajo antes de entregar.');
    state.finalizing = true;
    var saveQueue=state.queue.catch(function () {});
    await saveQueue;
    var ref = db.ref(BASE + '/respuestas/' + sessionId + '/' + uid);
    try {
      var previous = (await ref.once('value')).val();
      if (previous && previous.submitted === true && previous.completada === true) { confirmDelivery(); return previous; }
      var now = Date.now();
      var completed = Object.assign({},response,{submitted:true,completada:true,submittedAt:now,completadaAt:now,updatedAt:now,score:result.puntaje,total:result.total});
      var updates = {};
      updates['respuestas/' + sessionId + '/' + uid] = completed;
      updates['resultados/' + sessionId + '/' + uid] = Object.assign({},result,{submittedAt:now,completadaAt:now});
      await db.ref(BASE).update(updates);
      var flags = await Promise.all([ref.child('submitted').once('value'),ref.child('completada').once('value')]);
      if (flags.some(function (flag) {return flag.val() !== true;})) throw new Error('La plataforma aún no confirma tu entrega. Reintenta.');
      var saved = (await ref.once('value')).val();
      if (!saved || saved.submitted !== true || saved.completada !== true) throw new Error('La plataforma aún no confirma tu entrega. Reintenta.');
      confirmDelivery(); return saved;
    } catch (error) {
      var restored = (await ref.once('value').catch(function () { return {val:function () {return null;}}; })).val();
      if (restored && restored.submitted === true && restored.completada === true) { confirmDelivery(); return restored; }
      state.finalizing = false; throw error;
    }
  }

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

  function check(db, base, sessionId, uid, requireRestore) {
    if (requireRestore) loadLayer(false);
    return Promise.all([db.ref(base + '/sesiones/' + sessionId).once('value'),db.ref(base + '/respuestas/' + sessionId + '/' + uid).once('value')]).then(function (snaps) {
      var attempt = snaps[1].val();
      var closed = isClosed(snaps[0].val(), uid) && !(attempt && (attempt.completada === true || attempt.submitted === true));
      if (closed) {
        var loading = document.getElementById('simceLoadState'); if (loading) loading.remove();
        window.__simceSessionClosed = true;
        showLayer();
      }
      return closed;
    }).catch(function () {
      loadLayer(true);
      return true;
    });
  }

  window.SimceSessionGate = { check: check, isClosed: isClosed, beginLoad:function (sessionId,uid) {store(sessionId,uid).loaded=false;loadLayer(false);}, markLoaded:markLoaded, failLoad:function () {loadLayer(true);}, saveDraft:saveDraft, submit:submit };
})();
