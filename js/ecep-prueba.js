/* ECEP · Runner de prueba real — rinde el examen oficial 2024 con la clave oficial,
   feedback inmediato al responder cada pregunta. Lee window.PRUEBA y monta en #ec-prueba.
   Persistencia local (localStorage) para retomar. Cada respuesta guarda la huella del ítem
   que se vio; si el ítem se corrige después, esa respuesta se anula y se vuelve a responder. */
(function () {
  'use strict';
  var P = window.PRUEBA;
  var mount = document.getElementById('ec-prueba');
  if (!P || !mount) return;
  var LET = ['A', 'B', 'C', 'D'];
  var KEY = 'ecep_prueba_' + P.id;
  var total = P.preguntas.length;
  var state = load();           // { resp: {n: 'A'}, h: {n: huella}, idx: 0 }
  var anuladas = conciliar();   // ítems cuya respuesta guardada era de otra versión

  var VERSION_2026 = {
    'generalista': '/evaluaciones/practica/generalista/',
    'lenguaje': '/evaluaciones/practica/lenguaje/',
    'matematica': '/evaluaciones/practica/matematica/',
    'historia': '/evaluaciones/practica/historia/',
    'ciencias': '/evaluaciones/practica/ciencias/',
    'ingles-b': '/evaluaciones/practica/ingles-b/',
    'ef-basica': '/evaluaciones/practica/ef-basica/',
    'religion': '/evaluaciones/practica/religion/',
    'tecnologia': '/evaluaciones/practica/tecnologia/',
    'musica-basica': '/evaluaciones/practica/musica-basica/',
    'artes-basica': '/evaluaciones/practica/artes-basica/',
    'parvularia': '/evaluaciones/practica/parvularia/',
    'dea': '/evaluaciones/practica/dea/',
    'di': '/evaluaciones/practica/di/',
    'tea': '/evaluaciones/practica/tea/',
    'tel': '/evaluaciones/practica/tel/',
    'media-lengua': '/evaluaciones/practica/media-lengua/',
    'media-matematica': '/evaluaciones/practica/media-matematica/',
    'media-biologia': '/evaluaciones/practica/media-biologia/',
    'media-historia': '/evaluaciones/practica/media-historia/',
    'media-fisica': '/evaluaciones/practica/media-fisica/',
    'media-quimica': '/evaluaciones/practica/media-quimica/',
    'media-ingles': '/evaluaciones/practica/media-ingles/',
    'media-musica': '/evaluaciones/practica/media-musica/',
    'media-artes': '/evaluaciones/practica/media-artes/',
    'media-edfisica': '/evaluaciones/practica/media-edfisica/',
    'media-filosofia': '/evaluaciones/practica/media-filosofia/',
    'ensayo-epja': '/evaluaciones/practica/epja/',
    'ensayo-encierro': '/evaluaciones/practica/encierro/',
    'ensayo-neep': '/evaluaciones/practica/neep/',
    'ensayo-hospitalaria': '/evaluaciones/practica/hospitalaria/',
    'ensayo-media-religion': '/evaluaciones/practica/media-religion/',
    'ensayo-media-tecnologia': '/evaluaciones/practica/media-tecnologia/',
    'ensayo-contabilidad': '/evaluaciones/practica/contabilidad/',
    'ensayo-electricidad': '/evaluaciones/practica/electricidad/'
  };

  function selectorVersiones(esEnsayo) {
    var siguiente = VERSION_2026[P.id];
    if (!siguiente) return '';
    return '<nav class="ecq-versions" aria-label="Versiones de la prueba">' +
      '<span class="ecq-version current" aria-current="page"><b>2024</b><small>' + (esEnsayo ? 'Ensayo base' : 'Prueba oficial') + '</small></span>' +
      '<a class="ecq-version" href="' + siguiente + '"><b>2026</b><small>Práctica nueva</small></a>' +
      '</nav>';
  }

  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.resp) return s; } catch (e) {}
    return { resp: {}, h: {}, idx: 0 };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  // FNV-1a de lo que la persona ve y de la clave: cambia si se corrige el ítem.
  function huella(q) {
    var t = JSON.stringify([q.enunciado, q.textoBase || '', q.alternativas, q.correcta, q.imagen || '']);
    var h = 0x811c9dc5;
    for (var i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return ('0000000' + h.toString(16)).slice(-8);
  }

  // Anula las respuestas guardadas con otra versión del ítem. Un avance anterior a las huellas
  // no sabe qué versión vio: se anulan solo los ítems que la prueba declara revisados.
  function conciliar() {
    var porN = {}, fuera = [], heredado = !state.h;
    var revisados = (P.revisados || []).map(Number);
    P.preguntas.forEach(function (q) { porN[q.n] = q; });
    if (heredado) state.h = {};
    Object.keys(state.resp).forEach(function (n) {
      var q = porN[n];
      var vigente = q && (heredado ? revisados.indexOf(Number(q.n)) < 0 : state.h[n] === huella(q));
      if (vigente) { state.h[n] = huella(q); return; }
      delete state.resp[n]; delete state.h[n];
      if (q) fuera.push(Number(q.n));
    });
    if (heredado || fuera.length) save();
    return fuera.sort(function (a, b) { return a - b; });
  }
  function answeredCount() { return Object.keys(state.resp).length; }
  function score() { var s = 0; P.preguntas.forEach(function (q) { if (state.resp[q.n] === q.correcta) s++; }); return s; }
  function esc(t) { return (t == null ? '' : String(t)).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  // ---------- pantallas ----------
  function intro() {
    var esEnsayo = String(P.id || '').indexOf('ensayo-') === 0;
    mount.innerHTML =
      '<div class="ecq-intro">' +
        '<span class="ecq-eyebrow"><i class="bi bi-ui-checks"></i> ' + (esEnsayo ? 'Ensayo de práctica tipo ECEP' : 'Prueba real ECEP 2024') + '</span>' +
        '<h1>' + esc(P.titulo) + '</h1>' +
        selectorVersiones(esEnsayo) +
        (esEnsayo
          ? '<p>Este es un <strong>ensayo de práctica</strong> elaborado por nuestro equipo con el formato de la ECEP, con <strong>' + total + ' preguntas</strong> y su pauta de corrección. Al responder cada pregunta verás de inmediato si acertaste y cuál es la respuesta correcta.</p>'
          : '<p>Esta es la <strong>prueba oficial</strong> tal cual se rindió, con <strong>' + total + ' preguntas</strong> y su <strong>clave oficial</strong>. Al responder cada pregunta verás de inmediato si acertaste y cuál es la respuesta correcta.</p>') +
        '<ul class="ecq-tips"><li><i class="bi bi-check2"></i> Feedback inmediato con la ' + (esEnsayo ? 'pauta de corrección' : 'clave oficial') + '</li><li><i class="bi bi-bookmark-check"></i> Tu avance se guarda en este dispositivo</li><li><i class="bi bi-image"></i> Las preguntas con figura muestran la imagen original</li></ul>' +
        avisoAnuladas() +
        (answeredCount() ? '<div class="ecq-resume">Llevas <b>' + answeredCount() + '/' + total + '</b> respondidas.</div>' : '') +
        '<div class="ecq-introbtns">' +
          '<button class="ecq-start" id="ecq-go">' + (answeredCount() ? 'Continuar' : 'Comenzar la prueba') + '</button>' +
          (answeredCount() ? '<button class="ecq-reset" id="ecq-reset">Reiniciar</button>' : '') +
        '</div>' +
      '</div>';
    document.getElementById('ecq-go').onclick = function () { go(state.idx || 0); };
    var r = document.getElementById('ecq-reset');
    if (r) r.onclick = function () { if (confirm('¿Borrar tus respuestas y empezar de nuevo?')) { state = { resp: {}, h: {}, idx: 0 }; anuladas = []; save(); intro(); } };
  }

  function avisoAnuladas() {
    var k = anuladas.length;
    if (!k) return '';
    var lista = k === 1 ? 'la pregunta <b>' + anuladas[0] + '</b>'
      : 'las preguntas <b>' + anuladas.slice(0, -1).join(', ') + ' y ' + anuladas[k - 1] + '</b>';
    return '<div class="ecq-resume"><i class="bi bi-info-circle"></i> Corregimos ' + lista +
      ' para que ' + (k === 1 ? 'coincida' : 'coincidan') + ' con el examen oficial. Borramos lo que habías marcado ahí: ' +
      (k === 1 ? 'respóndela' : 'respóndelas') + ' de nuevo.</div>';
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
    if (q.audio) html += '<figure class="ecq-img"><audio controls preload="none" style="width:100%;display:block;border-radius:10px"><source src="' + q.audio + '" type="audio/mpeg">Tu navegador no soporta el audio.</audio><figcaption>Audio del examen ECEP 2024 (CPEIP). Escúchalo las veces que necesites para responder.</figcaption></figure>';
    if (q.nota) html += '<div class="ecq-nota"><i class="bi bi-info-circle"></i> ' + esc(q.nota) + '</div>';
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
        (ok ? 'Correcta.' : 'Incorrecta.') + ' La respuesta ' + (String(P.id || '').indexOf('ensayo-') === 0 ? 'correcta' : 'oficial') + ' es <b>' + q.correcta + '</b>.</div>';
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
        state.resp[q.n] = b.getAttribute('data-l'); state.h[q.n] = huella(q); save(); go(state.idx);
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
    mount.querySelector('.ecq-reset2').onclick = function () { if (confirm('¿Borrar tus respuestas y empezar de nuevo?')) { state = { resp: {}, h: {}, idx: 0 }; anuladas = []; save(); intro(); } };
    window.scrollTo(0, 0);
  }

  // crédito de autoría (persistente, en todas las pantallas)
  var cred = document.createElement('p');
  cred.className = 'ecq-credit';
  cred.innerHTML = String(P.id || '').indexOf('ensayo-') === 0
    ? 'Ensayo de práctica elaborado por nuestro equipo con el formato de la ECEP. <b>No es una forma oficial del CPEIP</b>: para esta modalidad no hay pruebas oficiales liberadas.'
    : 'Examen oficial de la <b>Evaluación Docente (ECEP)</b>, elaborado por el <b>CPEIP · Ministerio de Educación de Chile</b>. Material de uso libre; se reproduce aquí solo con fines de estudio. No es elaboración propia.';
  if (mount.parentNode) mount.parentNode.appendChild(cred);

  intro();
})();
