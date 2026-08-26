/* ECEP · Runner de PRÁCTICA 2026 en modo examen: se responde la prueba completa
   (se puede cambiar la respuesta y navegar libre) y recién al finalizar aparece el
   puntaje y la revisión pregunta por pregunta con la respuesta correcta.
   Lee window.PRUEBA (bancos js/practica/<id>.js) y monta en #ec-prueba. */
(function () {
  'use strict';
  var P = window.PRUEBA;
  var mount = document.getElementById('ec-prueba');
  if (!P || !mount) return;
  var LET = ['A', 'B', 'C', 'D'];
  var KEY = 'ecep_practica_' + P.id;
  var total = P.preguntas.length;
  var state = load();           // { resp: {n:'A'}, idx: 0, done: false }

  // estilos propios del modo examen (selección neutra antes de corregir)
  var st = document.createElement('style');
  st.textContent = '.ecq-alt.sel{border-color:#0e7d8a;background:#e6f7f9;box-shadow:0 0 0 2px #0e7d8a33}' +
    '.ecq-alt.sel .lt{background:#0e7d8a;color:#fff}' +
    '.ecq-svg{margin:14px 0;padding:12px;background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow-x:auto}' +
    '.ecq-svg svg{max-width:100%;height:auto;display:block;margin:0 auto}' +
    '.ecq-rev-nav{position:sticky;bottom:0;background:#ffffffee;padding:8px 0}';
  document.head.appendChild(st);

  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.resp) return s; } catch (e) {}
    return { resp: {}, idx: 0, done: false };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function answeredCount() { return Object.keys(state.resp).length; }
  function score() { var s = 0; P.preguntas.forEach(function (q) { if (state.resp[q.n] === q.correcta) s++; }); return s; }
  function esc(t) { return (t == null ? '' : String(t)).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function guardarFirebase() {
    try {
      if (typeof firebase === 'undefined' || !firebase.auth) return;
      var u = firebase.auth().currentUser; if (!u) return;
      firebase.database().ref('ecep_practica/' + u.uid + '/' + P.id).update({
        respondidas: answeredCount(), correctas: score(), total: total,
        finalizada: !!state.done, ts: firebase.database.ServerValue.TIMESTAMP
      });
    } catch (e) {}
  }

  function intro() {
    mount.innerHTML =
      '<div class="ecq-intro">' +
        '<span class="ecq-eyebrow"><i class="bi bi-mortarboard-fill"></i> Práctica ECEP 2026</span>' +
        '<h1>' + esc(P.titulo) + '</h1>' +
        '<p>Prueba de práctica con <strong>' + total + ' preguntas nuevas</strong>, creadas por nuestro equipo según el <strong>temario oficial 2026</strong> y con el mismo formato del examen real. Se rinde como la ECEP: respondes toda la prueba (puedes cambiar tus respuestas y saltar entre preguntas) y <strong>al finalizar</strong> ves tu puntaje y la respuesta correcta de cada pregunta.</p>' +
        '<ul class="ecq-tips"><li><i class="bi bi-flag"></i> La corrección aparece al terminar, como en el examen real</li><li><i class="bi bi-bookmark-check"></i> Tu avance se guarda en este dispositivo</li><li><i class="bi bi-arrow-left-right"></i> Puedes cambiar cualquier respuesta antes de finalizar</li></ul>' +
        (state.done ? '<div class="ecq-resume">Ya finalizaste esta práctica: <b>' + score() + '/' + total + '</b>. Puedes revisarla o reiniciarla.</div>'
          : (answeredCount() ? '<div class="ecq-resume">Llevas <b>' + answeredCount() + '/' + total + '</b> respondidas.</div>' : '')) +
        '<div class="ecq-introbtns">' +
          '<button class="ecq-start" id="ecq-go">' + (state.done ? 'Ver mi resultado' : (answeredCount() ? 'Continuar' : 'Comenzar la práctica')) + '</button>' +
          (answeredCount() ? '<button class="ecq-reset" id="ecq-reset">Reiniciar</button>' : '') +
        '</div>' +
      '</div>';
    document.getElementById('ecq-go').onclick = function () { state.done ? resultados() : go(state.idx || 0); };
    var r = document.getElementById('ecq-reset');
    if (r) r.onclick = reiniciar;
  }

  function reiniciar() {
    if (confirm('¿Borrar tus respuestas y empezar de nuevo?')) { state = { resp: {}, idx: 0, done: false }; save(); intro(); }
  }

  function estimulos(q) {
    var h = '';
    if (q.textoBase) h += '<div class="ecq-texto"><span class="tt"><i class="bi bi-card-text"></i> Texto base</span><div>' + esc(q.textoBase).replace(/\n/g, '<br>') + '</div></div>';
    if (q.svg) h += '<div class="ecq-svg">' + q.svg + '</div>';
    if (q.nota) h += '<div class="ecq-nota"><i class="bi bi-info-circle"></i> ' + esc(q.nota) + '</div>';
    return h;
  }

  function go(i) {
    state.idx = Math.max(0, Math.min(total - 1, i)); save();
    var q = P.preguntas[state.idx];
    var dada = state.resp[q.n];
    var rev = state.done;
    var html = '<div class="ecq-run">';
    html += '<div class="ecq-top"><div class="ecq-prog"><span style="width:' + Math.round(answeredCount() / total * 100) + '%"></span></div>' +
      '<div class="ecq-meta">Pregunta <b>' + q.n + '</b> de ' + total + ' · ' + answeredCount() + ' respondidas' + (rev ? ' · revisión: ' + score() + ' correctas' : '') + '</div></div>';
    html += '<article class="ecq-card">';
    html += '<div class="ecq-num">' + q.n + '</div>';
    html += estimulos(q);
    html += '<div class="ecq-enun">' + esc(q.enunciado).replace(/\n/g, '<br>') + '</div>';
    html += '<div class="ecq-alts">';
    LET.forEach(function (L, k) {
      var txt = q.alternativas && q.alternativas[k] ? q.alternativas[k] : '';
      var cls = 'ecq-alt';
      if (rev) {
        if (L === q.correcta) cls += ' ok';
        else if (L === dada) cls += ' bad';
        else cls += ' dim';
      } else if (dada === L) cls += ' sel';
      html += '<button class="' + cls + '" data-l="' + L + '"' + (rev ? ' disabled' : '') + '><span class="lt">' + L + '</span><span class="tx">' + esc(txt) + '</span></button>';
    });
    html += '</div>';
    if (rev) {
      var ok = dada === q.correcta;
      html += '<div class="ecq-verdict ' + (ok ? 'ok' : 'bad') + '"><i class="bi ' + (ok ? 'bi-check-circle-fill' : 'bi-x-circle-fill') + '"></i> ' +
        (dada ? (ok ? 'Correcta.' : 'Incorrecta: marcaste <b>' + dada + '</b>.') : 'Sin responder.') + ' La respuesta correcta es <b>' + q.correcta + '</b>.</div>';
    }
    html += '<div class="ecq-nav' + (rev ? ' ecq-rev-nav' : '') + '">' +
      '<button class="ecq-prev"' + (state.idx === 0 ? ' disabled' : '') + '><i class="bi bi-arrow-left"></i> Anterior</button>' +
      '<button class="ecq-grid-btn"><i class="bi bi-grid-3x3-gap"></i> Ver todas</button>' +
      (state.idx === total - 1
        ? (rev ? '<button class="ecq-fin">Ver puntaje <i class="bi bi-trophy-fill"></i></button>' : '<button class="ecq-fin">Finalizar <i class="bi bi-flag-fill"></i></button>')
        : '<button class="ecq-next">Siguiente <i class="bi bi-arrow-right"></i></button>') +
      '</div>';
    html += '</article></div>';
    mount.innerHTML = html;
    window.scrollTo(0, 0);

    if (!rev) {
      mount.querySelectorAll('.ecq-alt').forEach(function (b) {
        b.onclick = function () {
          var L = b.getAttribute('data-l');
          if (state.resp[q.n] === L) delete state.resp[q.n];   // tocar de nuevo desmarca
          else state.resp[q.n] = L;
          save(); guardarFirebase();
          if (state.resp[q.n] && state.idx < total - 1) go(state.idx + 1); else go(state.idx);
        };
      });
    }
    var pv = mount.querySelector('.ecq-prev'); if (pv) pv.onclick = function () { go(state.idx - 1); };
    var nx = mount.querySelector('.ecq-next'); if (nx) nx.onclick = function () { go(state.idx + 1); };
    var fn = mount.querySelector('.ecq-fin'); if (fn) fn.onclick = rev ? resultados : finalizar;
    mount.querySelector('.ecq-grid-btn').onclick = grid;
  }

  function finalizar() {
    var faltan = total - answeredCount();
    if (faltan > 0 && !confirm('Te quedan ' + faltan + ' preguntas sin responder. ¿Finalizar igual? Las no respondidas cuentan como incorrectas.')) return;
    state.done = true; save(); guardarFirebase();
    resultados();
  }

  function grid() {
    var rev = state.done;
    var html = '<div class="ecq-run"><h2 class="ecq-gtitle">Todas las preguntas</h2><div class="ecq-grid">';
    P.preguntas.forEach(function (q, i) {
      var d = state.resp[q.n], cls = 'g';
      if (rev) { if (d === q.correcta) cls += ' ok'; else cls += ' bad'; }
      else if (d) cls += ' ok';
      html += '<button class="' + cls + '" data-i="' + i + '">' + q.n + '</button>';
    });
    html += '</div><div class="ecq-nav"><button class="ecq-back"><i class="bi bi-arrow-left"></i> Volver</button>' +
      (rev ? '<button class="ecq-fin">Ver puntaje <i class="bi bi-trophy-fill"></i></button>' : '<button class="ecq-fin">Finalizar <i class="bi bi-flag-fill"></i></button>') + '</div></div>';
    mount.innerHTML = html;
    mount.querySelectorAll('.ecq-grid .g').forEach(function (b) { b.onclick = function () { go(+b.getAttribute('data-i')); }; });
    mount.querySelector('.ecq-back').onclick = function () { go(state.idx); };
    mount.querySelector('.ecq-fin').onclick = state.done ? resultados : finalizar;
  }

  function resultados() {
    var s = score(), pct = Math.round(s / total * 100);
    var nivel = pct >= 80 ? 'Excelente' : pct >= 60 ? 'Bueno' : pct >= 40 ? 'Suficiente' : 'A reforzar';
    var html = '<div class="ecq-run"><div class="ecq-result">' +
      '<span class="ecq-eyebrow"><i class="bi bi-trophy-fill"></i> Resultado de tu práctica</span>' +
      '<div class="ecq-big">' + s + '<span>/' + total + '</span></div>' +
      '<div class="ecq-pct ' + (pct >= 60 ? 'ok' : 'bad') + '">' + pct + '% · ' + nivel + '</div>' +
      '<p>Respondiste ' + answeredCount() + ' de ' + total + '. Abajo puedes revisar cada pregunta con su respuesta correcta.</p>' +
      '<div class="ecq-nav"><button class="ecq-back">Revisar pregunta por pregunta</button><button class="ecq-reset2">Reiniciar práctica</button></div>' +
      '</div>';
    // resumen por pregunta: qué marcaste y cuál era
    html += '<h2 class="ecq-gtitle" style="margin-top:22px">Revisión rápida</h2><div class="ecq-grid">';
    P.preguntas.forEach(function (q, i) {
      var d = state.resp[q.n];
      html += '<button class="g ' + (d === q.correcta ? 'ok' : 'bad') + '" data-i="' + i + '" title="Tu respuesta: ' + (d || 'sin responder') + ' · Correcta: ' + q.correcta + '">' + q.n + '</button>';
    });
    html += '</div><p style="font-size:13px;color:#64748b;margin-top:8px">Verde = correcta, rojo = incorrecta o sin responder. Toca cualquier número para ver la pregunta con su solución.</p></div>';
    mount.innerHTML = html;
    mount.querySelectorAll('.ecq-grid .g').forEach(function (b) { b.onclick = function () { go(+b.getAttribute('data-i')); }; });
    mount.querySelector('.ecq-back').onclick = function () { go(0); };
    mount.querySelector('.ecq-reset2').onclick = reiniciar;
    window.scrollTo(0, 0);
  }

  var cred = document.createElement('p');
  cred.className = 'ecq-credit';
  cred.innerHTML = 'Prueba de práctica con preguntas nuevas elaboradas por nuestro equipo a partir del <b>temario oficial ECEP 2026</b> (CPEIP). <b>No es una forma oficial</b> ni reproduce preguntas del examen real.';
  if (mount.parentNode) mount.parentNode.appendChild(cred);

  intro();
})();
