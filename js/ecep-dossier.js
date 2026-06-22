/* ECEP · Dossier de estudio — interactividad
   - Auto-chequeos (revelar respuesta)
   - Progreso "estudiado" por tarjeta (persistente en localStorage)
   - Scrollspy del índice sticky
*/
(function () {
  'use strict';

  // ---- Auto-chequeos: revelar respuesta ----
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.ec-check button.reveal, .ec-caso button.reveal');
    if (btn) { var box = btn.closest('.ec-check, .ec-caso'); if (box) box.classList.add('open'); }
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
})();
