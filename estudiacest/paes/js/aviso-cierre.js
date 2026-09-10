/* aviso-cierre.js — Cuenta regresiva del bloqueo programado de guías PAES.
 *
 * Caso (10-sep-2026): Francisco pidió avisar a los estudiantes que las guías
 * hasta la 19 se bloquean el 23 de septiembre. La fecha y las guías vienen del
 * servidor (guias_config/bloqueo_programado), el mismo que aplica el bloqueo:
 * si la fecha cambia allá, el aviso cambia solo, y cuando el bloqueo se aplica
 * el servidor deja de informarlo y el aviso desaparece.
 *
 * Se carga en el portal y en el listado de guías, y guia-lock.js lo agrega en
 * cada guía. Dentro de una guía solo aparece si esa guía es de las que se
 * bloquean. Si la API no responde, no muestra nada.
 */
(function () {
  'use strict';
  if (window.__avisoCierrePaes) return;
  window.__avisoCierrePaes = true;

  var CSS =
    '.aviso-cierre{background:#fff6e5;border-bottom:1px solid #f1c97a;color:#162638;' +
      "font-family:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;position:relative;z-index:50}" +
    '.aviso-cierre__marco{max-width:1120px;margin:0 auto;padding:14px 20px;display:flex;align-items:center;' +
      'gap:14px 28px;flex-wrap:wrap;justify-content:space-between}' +
    '.aviso-cierre__texto{flex:1 1 320px;min-width:0}' +
    ".aviso-cierre__titulo{margin:0;font-family:'Outfit','Inter',system-ui,sans-serif;font-weight:800;" +
      'font-size:clamp(15px,1.1rem + .3vw,19px);line-height:1.3;text-wrap:balance}' +
    '.aviso-cierre__detalle{margin:3px 0 0;font-size:14px;line-height:1.45;color:#4a3a1f}' +
    '.aviso-cierre__reloj{display:flex;gap:8px;flex:0 0 auto}' +
    '.aviso-cierre__unidad{min-width:58px;padding:7px 8px 6px;border-radius:12px;background:#ffffff;' +
      'border:1px solid #f1c97a;text-align:center}' +
    ".aviso-cierre__num{display:block;font-family:'Outfit','Inter',system-ui,sans-serif;font-weight:800;" +
      'font-size:24px;line-height:1;color:#8a4b00;font-variant-numeric:tabular-nums}' +
    '.aviso-cierre__lbl{display:block;margin-top:3px;font-size:11px;font-weight:600;color:#6b5429}' +
    '@media (max-width:560px){.aviso-cierre__marco{padding:12px 16px}' +
      '.aviso-cierre__reloj{width:100%;justify-content:space-between}' +
      '.aviso-cierre__unidad{flex:1 1 0;min-width:0}.aviso-cierre__num{font-size:21px}}';

  function numeroDeGuia(id) { return parseInt(String(id).replace(/\D/g, ''), 10) || 0; }
  function dos(n) { return (n < 10 ? '0' : '') + n; }
  function fechaLarga(ms) {
    return new Date(ms).toLocaleDateString('es-CL', {
      timeZone: 'America/Santiago', weekday: 'long', day: 'numeric', month: 'long'
    }).replace(',', '');
  }

  function montar(p) {
    var guias = Array.isArray(p.guias) ? p.guias : [];
    var id = window.GUIA_LOCK_ID;
    if (id && guias.indexOf(id) < 0) return;
    var limite = Number(p.limite);
    if (!limite || Date.now() >= limite || !guias.length) return;

    var ultima = Math.max.apply(null, guias.map(numeroDeGuia));
    var cierre = fechaLarga(limite);
    var ultimoDia = fechaLarga(limite - 12 * 60 * 60 * 1000);

    if (!document.getElementById('avisoCierreEstilo')) {
      var estilo = document.createElement('style');
      estilo.id = 'avisoCierreEstilo';
      estilo.textContent = CSS;
      document.head.appendChild(estilo);
    }

    var caja = document.createElement('section');
    caja.className = 'aviso-cierre';
    caja.id = 'avisoCierre';
    caja.setAttribute('aria-label', 'Aviso de cierre de guías');
    caja.innerHTML =
      '<div class="aviso-cierre__marco">' +
        '<div class="aviso-cierre__texto">' +
          '<p class="aviso-cierre__titulo">⏳ Las guías hasta la N° ' + ultima + ' se bloquean el ' + cierre + '.</p>' +
          '<p class="aviso-cierre__detalle">Tienes hasta el ' + ultimoDia + ' para responderlas o volver a enviarlas.</p>' +
        '</div>' +
        '<div class="aviso-cierre__reloj" aria-hidden="true">' +
          '<span class="aviso-cierre__unidad"><b class="aviso-cierre__num" data-u="d">0</b><span class="aviso-cierre__lbl">días</span></span>' +
          '<span class="aviso-cierre__unidad"><b class="aviso-cierre__num" data-u="h">00</b><span class="aviso-cierre__lbl">horas</span></span>' +
          '<span class="aviso-cierre__unidad"><b class="aviso-cierre__num" data-u="m">00</b><span class="aviso-cierre__lbl">min</span></span>' +
          '<span class="aviso-cierre__unidad"><b class="aviso-cierre__num" data-u="s">00</b><span class="aviso-cierre__lbl">seg</span></span>' +
        '</div>' +
      '</div>';
    document.body.insertBefore(caja, document.body.firstChild);

    var celdas = {};
    caja.querySelectorAll('[data-u]').forEach(function (el) { celdas[el.getAttribute('data-u')] = el; });
    var reloj = null;
    function pintar() {
      var falta = limite - Date.now();
      if (falta <= 0) {
        clearInterval(reloj);
        caja.querySelector('.aviso-cierre__titulo').textContent = 'Las guías hasta la N° ' + ultima + ' ya están bloqueadas.';
        caja.querySelector('.aviso-cierre__detalle').textContent = 'Si necesitas revisar algo, consulta a tu profesor.';
        caja.querySelector('.aviso-cierre__reloj').hidden = true;
        return;
      }
      var s = Math.floor(falta / 1000);
      celdas.d.textContent = String(Math.floor(s / 86400));
      celdas.h.textContent = dos(Math.floor(s % 86400 / 3600));
      celdas.m.textContent = dos(Math.floor(s % 3600 / 60));
      celdas.s.textContent = dos(s % 60);
    }
    pintar();
    reloj = setInterval(pintar, 1000);
  }

  function iniciar() {
    fetch('/api/paes?action=get-guias-config', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        var p = data && data.config && data.config.programado;
        if (p) montar(p);
      })
      .catch(function () { /* sin aviso si la API no responde */ });
  }

  if (document.body) iniciar();
  else document.addEventListener('DOMContentLoaded', iniciar, { once: true });
})();
