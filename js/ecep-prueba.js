/* ECEP · Runner de prueba real — rinde el examen oficial 2024 con la clave oficial,
   feedback inmediato al responder cada pregunta. Lee window.PRUEBA y monta en #ec-prueba.
   Persistencia local (localStorage) para retomar; guarda el resultado final en Firebase si hay sesión. */
(function () {
  'use strict';
  var P = window.PRUEBA;
  var mount = document.getElementById('ec-prueba');
  if (!P || !mount) return;
  var LET = ['A', 'B', 'C', 'D'];
  var KEY = 'ecep_prueba_' + P.id;
  var total = P.preguntas.length;
  var state = load();           // { resp: {n: 'A'}, idx: 0 }

  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.resp) return s; } catch (e) {}
    return { resp: {}, idx: 0 };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function answeredCount() { return Object.keys(state.resp).length; }
  function score() { var s = 0; P.preguntas.forEach(function (q) { if (state.resp[q.n] === q.correcta) s++; }); return s; }
  function esc(t) { return (t == null ? '' : String(t)).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function guardarFirebase(final) {
    try {
      if (typeof firebase === 'undefined' || !firebase.auth) return;
      var u = firebase.auth().currentUser; if (!u) return;
      firebase.database().ref('ecep_pruebas/' + u.uid + '/' + P.id).update({
        respondidas: answeredCount(), correctas: score(), total: total,
        finalizada: !!final, ts: firebase.database.ServerValue.TIMESTAMP
      });
    } catch (e) {}
  }

  // ---------- pantallas ----------
  function intro() {
    mount.innerHTML =
      '<div class="ecq-intro">' +
        '<span class="ecq-eyebrow"><i class="bi bi-ui-checks"></i> Prueba real ECEP 2024</span>' +
        '<h1>' + esc(P.titulo) + '</h1>' +
        '<p>Esta es la <strong>prueba oficial</strong> tal cual se rindió, con <strong>' + total + ' preguntas</strong> y su <strong>clave oficial</strong>. Al responder cada pregunta verás de inmediato si acertaste y cuál es la respuesta correcta.</p>' +
        '<ul class="ecq-tips"><li><i class="bi bi-check2"></i> Feedback inmediato con la clave oficial</li><li><i class="bi bi-bookmark-check"></i> Tu avance se guarda en este dispositivo</li><li><i class="bi bi-image"></i> Las preguntas con figura muestran la imagen original</li></ul>' +
        (answeredCount() ? '<div class="ecq-resume">Llevas <b>' + answeredCount() + '/' + total + '</b> respondidas.</div>' : '') +
        '<div class="ecq-introbtns">' +
          '<button class="ecq-start" id="ecq-go">' + (answeredCount() ? 'Continuar' : 'Comenzar la prueba') + '</button>' +
          (answeredCount() ? '<button class="ecq-reset" id="ecq-reset">Reiniciar</button>' : '') +
        '</div>' +
      '</div>';
    document.getElementById('ecq-go').onclick = function () { go(state.idx || 0); };
    var r = document.getElementById('ecq-reset');
    if (r) r.onclick = function () { if (confirm('¿Borrar tus respuestas y empezar de nuevo?')) { state = { resp: {}, idx: 0 }; save(); intro(); } };
  }

  function go(i) {
    state.idx = Math.max(0, Math.min(total - 1, i)); save();
    var q = P.preguntas[state.idx];
    var dada = state.resp[q.n];
    var html = '<div class="ecq-run">';
    // barra superior
    html += '<div class="ecq-top"><div class="ecq-prog"><span style="width:' + Math.round(answeredCount() / total * 100) + '%"></span></div>' +
      '<div class="ecq-meta">Pregunta <b>' + q.n + '</b> de ' + total + ' · ' + answeredCount() + ' respondidas · ' + score() + ' correctas</div></div>';
    html += '<article class="ecq-card">';
    html += '<div class="ecq-num">' + q.n + '</div>';
    if (q.textoBase) html += '<div class="ecq-texto"><span class="tt"><i class="bi bi-card-text"></i> Texto base</span><div>' + esc(q.textoBase).replace(/\n/g, '<br>') + '</div></div>';
    html += '<div class="ecq-enun">' + esc(q.enunciado).replace(/\n/g, '<br>') + '</div>';
    if (q.imagen) html += '<figure class="ecq-img"><img src="' + q.imagen + '" alt="Figura de la pregunta ' + q.n + ' (examen original)" loading="lazy"><figcaption>Figura de la pregunta en el examen original (lee las alternativas en la imagen si es necesario).</figcaption></figure>';
    html += '<div class="ecq-alts">';
    LET.forEach(function (L, k) {
      var txt = q.alternativas && q.alternativas[k] ? q.alternativas[k] : '';
      var cls = 'ecq-alt';
      if (dada) {
        if (L === q.correcta) cls += ' ok';
        else if (L === dada) cls += ' bad';
        else cls += ' dim';
      }
      html += '<button class="' + cls + '" data-l="' + L + '"' + (dada ? ' disabled' : '') + '><span class="lt">' + L + '</span><span class="tx">' + esc(txt) + '</span></button>';
    });
    html += '</div>';
    if (dada) {
      var ok = dada === q.correcta;
      html += '<div class="ecq-verdict ' + (ok ? 'ok' : 'bad') + '"><i class="bi ' + (ok ? 'bi-check-circle-fill' : 'bi-x-circle-fill') + '"></i> ' +
        (ok ? 'Correcta.' : 'Incorrecta.') + ' La respuesta oficial es <b>' + q.correcta + '</b>.</div>';
    }
    html += '<div class="ecq-nav">' +
      '<button class="ecq-prev"' + (state.idx === 0 ? ' disabled' : '') + '><i class="bi bi-arrow-left"></i> Anterior</button>' +
      '<button class="ecq-grid-btn"><i class="bi bi-grid-3x3-gap"></i> Ver todas</button>' +
      (state.idx === total - 1 ? '<button class="ecq-fin">Finalizar <i class="bi bi-flag-fill"></i></button>' : '<button class="ecq-next">Siguiente <i class="bi bi-arrow-right"></i></button>') +
      '</div>';
    html += '</article></div>';
    mount.innerHTML = html;
    window.scrollTo(0, 0);

    mount.querySelectorAll('.ecq-alt').forEach(function (b) {
      b.onclick = function () {
        if (state.resp[q.n]) return;
        state.resp[q.n] = b.getAttribute('data-l'); save(); guardarFirebase(false); go(state.idx);
      };
    });
    var pv = mount.querySelector('.ecq-prev'); if (pv) pv.onclick = function () { go(state.idx - 1); };
    var nx = mount.querySelector('.ecq-next'); if (nx) nx.onclick = function () { go(state.idx + 1); };
    var fn = mount.querySelector('.ecq-fin'); if (fn) fn.onclick = resultados;
    mount.querySelector('.ecq-grid-btn').onclick = grid;
  }

  function grid() {
    var html = '<div class="ecq-run"><h2 class="ecq-gtitle">Todas las preguntas</h2><div class="ecq-grid">';
    P.preguntas.forEach(function (q, i) {
      var d = state.resp[q.n], cls = 'g';
      if (d) cls += d === q.correcta ? ' ok' : ' bad';
      html += '<button class="' + cls + '" data-i="' + i + '">' + q.n + '</button>';
    });
    html += '</div><div class="ecq-nav"><button class="ecq-back"><i class="bi bi-arrow-left"></i> Volver</button><button class="ecq-fin">Ver resultado <i class="bi bi-flag-fill"></i></button></div></div>';
    mount.innerHTML = html;
    mount.querySelectorAll('.ecq-grid .g').forEach(function (b) { b.onclick = function () { go(+b.getAttribute('data-i')); }; });
    mount.querySelector('.ecq-back').onclick = function () { go(state.idx); };
    mount.querySelector('.ecq-fin').onclick = resultados;
  }

  function resultados() {
    guardarFirebase(true);
    var s = score(), pct = Math.round(s / total * 100);
    var nivel = pct >= 80 ? 'Excelente' : pct >= 60 ? 'Bueno' : pct >= 40 ? 'Suficiente' : 'A reforzar';
    var html = '<div class="ecq-run"><div class="ecq-result">' +
      '<span class="ecq-eyebrow"><i class="bi bi-trophy-fill"></i> Resultado</span>' +
      '<div class="ecq-big">' + s + '<span>/' + total + '</span></div>' +
      '<div class="ecq-pct ' + (pct >= 60 ? 'ok' : 'bad') + '">' + pct + '% · ' + nivel + '</div>' +
      '<p>Respondiste ' + answeredCount() + ' de ' + total + ' preguntas.</p>' +
      '<div class="ecq-nav"><button class="ecq-back">Revisar preguntas</button><button class="ecq-reset2">Reiniciar prueba</button></div>' +
      '</div></div>';
    mount.innerHTML = html;
    mount.querySelector('.ecq-back').onclick = grid;
    mount.querySelector('.ecq-reset2').onclick = function () { if (confirm('¿Borrar tus respuestas y empezar de nuevo?')) { state = { resp: {}, idx: 0 }; save(); intro(); } };
    window.scrollTo(0, 0);
  }

  // crédito de autoría (persistente, en todas las pantallas)
  var cred = document.createElement('p');
  cred.className = 'ecq-credit';
  cred.innerHTML = 'Examen oficial de la <b>Evaluación Docente (ECEP)</b>, elaborado por el <b>CPEIP · Ministerio de Educación de Chile</b>. Material de uso libre; se reproduce aquí solo con fines de estudio. No es elaboración propia.';
  if (mount.parentNode) mount.parentNode.appendChild(cred);

  intro();
})();
