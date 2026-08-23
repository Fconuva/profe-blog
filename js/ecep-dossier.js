/* ECEP · Dossier de estudio — interactividad
   - Auto-chequeos (revelar respuesta)
   - Progreso "estudiado" por tarjeta (persistente en localStorage)
   - Scrollspy del índice sticky
*/
(function () {
  'use strict';

  // ---- Botón "Índice del dossier" en la barra sticky (siempre visible en cada dominio) ----
  var _toc = document.querySelector('.ec-toc .ec-wrap');
  if (_toc && !_toc.querySelector('.ec-toc-back')) {
    var _back = document.createElement('a');
    _back.className = 'ec-toc-back';
    _back.href = location.pathname.replace(/[^/]+\/?$/, '') || '/evaluaciones/';
    _back.innerHTML = '<i class="bi bi-grid-1x2-fill"></i> Índice';
    _toc.insertBefore(_back, _toc.firstChild);
  }

  // ---- Auto-chequeos: revelar respuesta ----
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.ec-check button.reveal, .ec-caso button.reveal');
    if (btn) { var box = btn.closest('.ec-check, .ec-caso'); if (box) box.classList.add('open'); }
  });

  // ---- Preguntas tipo CASO: responder tocando una alternativa → veredicto + retroalimentación ----
  [].slice.call(document.querySelectorAll('.ec-caso')).forEach(function (caso) {
    var aBlock = caso.querySelector('.a');
    var correct = null;
    if (aBlock) { var m = aBlock.textContent.match(/[Cc]orrecta:?\s*\(?([A-D])\)?/); if (m) correct = m[1].toUpperCase(); }
    var opts = [].slice.call(caso.querySelectorAll('ol > li'));
    if (!correct || !opts.length) return; // sin letra correcta detectable → queda el botón "ver respuesta"
    function letterOf(li) { var b = li.querySelector('b'); return b ? (b.textContent.trim().charAt(0) || '').toUpperCase() : ''; }
    var ol = caso.querySelector('ol');
    if (ol) {
      var hint = document.createElement('div'); hint.className = 'ec-caso-hint';
      hint.innerHTML = '<i class="bi bi-hand-index-fill"></i> Toca la alternativa que elijas para responder.';
      ol.parentNode.insertBefore(hint, ol);
    }
    opts.forEach(function (li) {
      li.classList.add('opt');
      li.addEventListener('click', function () {
        if (caso.classList.contains('answered')) return;
        caso.classList.add('answered', 'open');
        var chosen = letterOf(li), bien = chosen === correct;
        opts.forEach(function (o) { if (letterOf(o) === correct) o.classList.add('correcta'); });
        li.classList.add(bien ? 'elegida-bien' : 'elegida-mal');
        var v = document.createElement('div');
        v.className = 'veredicto ' + (bien ? 'ok' : 'no');
        v.innerHTML = bien
          ? '<i class="bi bi-check-circle-fill"></i> ¡Correcto! Esta es la mejor opción. Mira por qué:'
          : '<i class="bi bi-x-circle-fill"></i> Esa no es la mejor opción. La correcta es <strong>' + correct + '</strong>. Mira por qué:';
        if (aBlock) aBlock.parentNode.insertBefore(v, aBlock);
        var revealBtn = caso.querySelector('button.reveal'); if (revealBtn) revealBtn.style.display = 'none';
      });
    });
  });

  // ---- Progreso "estudiado" ----
  var KEY = 'ecep-studied:' + location.pathname;
  var done = {};
  try { done = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}

  var cards = [].slice.call(document.querySelectorAll('.ec-card[id]'));

  function paint() {
    var n = 0;
    cards.forEach(function (c) {
      var on = !!done[c.id];
      c.classList.toggle('studied', on);
      var btn = c.querySelector('.ec-done');
      if (btn) {
        btn.innerHTML = on
          ? '<i class="bi bi-check-circle-fill"></i> Estudiado'
          : '<i class="bi bi-circle"></i> Marcar como estudiado';
      }
      if (on) n++;
    });
    var pct = cards.length ? Math.round((n / cards.length) * 100) : 0;
    var fill = document.querySelector('.ec-progress .bar > span');
    var lbl = document.querySelector('.ec-progress .lbl');
    if (fill) fill.style.width = pct + '%';
    if (lbl) lbl.textContent = n + '/' + cards.length + ' estudiados';
  }

  cards.forEach(function (c) {
    var btn = c.querySelector('.ec-done');
    if (btn) {
      btn.addEventListener('click', function () {
        done[c.id] = !done[c.id];
        try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {}
        paint();
      });
    }
  });
  paint();

  // ---- Scrollspy del índice sticky ----
  var links = [].slice.call(document.querySelectorAll('.ec-toc a[href^="#"]'));
  var targets = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && targets.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var id = en.target.id;
          links.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }

  // ---- Ocultar figuras cuya imagen no carga (ej. ilustración aún no generada) ----
  // Mantiene la referencia en el HTML: cuando la imagen exista, aparece sola.
  [].slice.call(document.querySelectorAll('figure.ec-fig img, img')).forEach(function (img) {
    function hide() { var fig = img.closest('figure') || img; if (fig) fig.style.display = 'none'; }
    if (img.complete && img.naturalWidth === 0) hide();
    img.addEventListener('error', hide);
  });
})();

// ---- CTA al servicio de Portafolio (la plataforma gratuita es el enganche) ----
(function () {
  var ec = document.querySelector('.ec');
  if (!ec || document.querySelector('.ec-cta-portafolio')) return;
  var cta = document.createElement('div');
  cta.className = 'ec-cta-portafolio';
  cta.innerHTML = '<div style="max-width:900px;margin:34px auto 26px;padding:22px 24px;border-radius:16px;background:linear-gradient(135deg,#1e1b4b,#312e81);color:#fff;display:flex;align-items:center;gap:16px;flex-wrap:wrap;box-shadow:0 14px 40px -18px rgba(30,27,75,.55)">' +
    '<span style="font-size:30px">🎓</span>' +
    '<div style="flex:1;min-width:230px"><b style="font-size:16px">Este material es gratis. ¿Y tu Portafolio?</b>' +
    '<p style="margin:3px 0 0;font-size:13.5px;color:#c7d2fe">Un profesor <b style="color:#fff">tramo Experto I</b> te construye los 3 módulos personalizados, al nivel Destacado. Tú revisas primero y pagas después.</p></div>' +
    '<a href="/" style="background:#fbbf24;color:#1e1b4b;font-weight:800;padding:11px 20px;border-radius:11px;text-decoration:none;white-space:nowrap">Conocer el servicio →</a></div>';
  ec.appendChild(cta);
})();
