/*
 * Panel para anotar sobre la pizarra táctil (regla de Estudia CEST para NM3 y NM4).
 * Lápiz, destacador y goma con el dedo, el lápiz óptico o el mouse.
 *
 * Funciona en dos modos:
 * - Presentación: si la página tiene una .deck fija con diapositivas .slide, los trazos
 *   quedan guardados por diapositiva y siguen el desplazamiento de la diapositiva visible.
 * - Página: en cualquier otra página, los trazos siguen el desplazamiento de la página.
 * Los trazos duran mientras la página esté abierta.
 */
(function () {
  'use strict';
  if (window.__anotarPizarra || !window.HTMLCanvasElement) return;
  window.__anotarPizarra = true;

  var HERRAMIENTAS = {
    lapiz: {
      colores: [['#dc2626', 'Rojo'], ['#1d4ed8', 'Azul'], ['#111827', 'Negro'], ['#15803d', 'Verde']],
      grosores: [3, 6, 11], alfa: 1
    },
    destacador: {
      colores: [['#facc15', 'Amarillo'], ['#22c55e', 'Verde'], ['#ec4899', 'Rosado'], ['#0ea5e9', 'Celeste']],
      grosores: [18, 28, 42], alfa: 0.35
    },
    goma: { colores: [], grosores: [28, 56, 100], alfa: 1 }
  };

  var estado = {
    abierto: false,
    herramienta: 'lapiz',
    color: { lapiz: '#dc2626', destacador: '#facc15' },
    grosor: 1
  };
  var trazos = {};
  var actual = null;
  var vista = { clave: '', cont: null, contClave: null, izq: 0, arriba: 0, ancho: 0, alto: 0 };

  /* ---------- Estilos ---------- */
  var css = [
    '.anota-capa{position:fixed;left:0;top:0;z-index:2147483000;pointer-events:none;touch-action:none}',
    '.anota-capa.dibujando{pointer-events:auto;cursor:crosshair}',
    '.anota-capa.dibujando.goma{cursor:cell}',
    '.anota-panel,.anota-pestana{font-size:clamp(13px,.85vw,24px)}',
    '.anota-panel{position:fixed;z-index:2147483002;top:50%;left:.9em;transform:translateY(-50%);width:11.4em;max-height:calc(100vh - 2em);overflow:auto;background:#fff;border:1px solid #cbd5e1;border-radius:1em;box-shadow:0 18px 40px rgba(15,23,42,.28);padding:.7em;display:grid;gap:.6em;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;font-weight:600;line-height:1.2;color:#142238;touch-action:manipulation;-webkit-user-select:none;user-select:none;box-sizing:border-box}',
    '.anota-panel *{box-sizing:border-box}',
    '.anota-panel button{font-family:inherit}',
    '.anota-panel[hidden]{display:none}',
    '.anota-panel.der{left:auto;right:.9em}',
    '.ap-top{display:flex;align-items:center;gap:.4em}',
    '.ap-top b{flex:1;font-size:1.05em;color:#173f70}',
    '.ap-top button{width:2.6em;height:2.6em;border-radius:.55em;border:1px solid #cbd5e1;background:#fff;color:#173f70;font-size:1.05em;font-weight:800;line-height:1;cursor:pointer;padding:0}',
    '.ap-label{font-size:.72em;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:#64748b;margin-bottom:.35em}',
    '.ap-grid{display:grid;grid-template-columns:1fr 1fr;gap:.45em}',
    '.ap-tool{height:4.4em;border-radius:.7em;border:2px solid #d4dee9;background:#f8fafc;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.2em;font-size:.85em;font-weight:700;line-height:1.1;color:#173f70;cursor:pointer;padding:0}',
    '.ap-tool span{font-size:1.7em;line-height:1}',
    '.ap-tool.on{background:#173f70;border-color:#173f70;color:#fff}',
    '.ap-colores{display:grid;grid-template-columns:repeat(4,1fr);gap:.45em}',
    '.ap-color{height:2.2em;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 1px #94a3b8;cursor:pointer;padding:0}',
    '.ap-color.on{box-shadow:0 0 0 3px #173f70}',
    '.ap-grosores{display:grid;grid-template-columns:repeat(3,1fr);gap:.45em}',
    '.ap-grosor{height:3em;border-radius:.55em;border:2px solid #d4dee9;background:#fff;display:grid;place-items:center;cursor:pointer;padding:0}',
    '.ap-grosor i{display:block;border-radius:50%}',
    '.ap-grosor.on{border-color:#173f70;background:#eef4fb}',
    '.ap-accion{height:3.2em;border-radius:.7em;border:1px solid #cbd5e1;background:#fff;font-size:.92em;font-weight:700;line-height:1;color:#173f70;cursor:pointer;padding:0 .4em}',
    '.ap-accion:disabled{opacity:.4;cursor:default}',
    '.ap-accion.peligro{color:#b84646}',
    '.ap-accion.confirmar{background:#b84646;border-color:#b84646;color:#fff}',
    '.ap-ayuda{font-size:.76em;font-weight:600;color:#64748b;line-height:1.3}',
    '.anota-pestana{position:fixed;left:0;top:50%;transform:translateY(-50%);z-index:2147483001;width:2.9em;height:3.6em;border:0;border-radius:0 .9em .9em 0;background:#173f70;color:#fff;font-size:clamp(13px,.85vw,24px);cursor:pointer;box-shadow:0 8px 20px rgba(15,23,42,.25);opacity:.88;padding:0;line-height:1}',
    '.anota-pestana span{font-size:1.45em}',
    '.anota-pestana:hover{opacity:1}',
    'body.anotando .anota-pestana{display:none}',
    '.nav-btn.anota-toggle{font-size:1.1rem}',
    '.nav-btn.anota-toggle[aria-pressed="true"]{background:#173f70;border-color:#173f70;color:#fff}',
    'body.anotando .back{display:none}',
    '@media print{.anota-capa,.anota-panel,.anota-pestana,.anota-toggle{display:none!important}}'
  ].join('\n');
  var estilo = document.createElement('style');
  estilo.setAttribute('data-anotar-pizarra', '');
  estilo.textContent = css;
  document.head.appendChild(estilo);

  /* ---------- Vista actual: diapositiva visible o página ---------- */
  var deck = document.querySelector('.deck');

  function slidesDeck() {
    if (!deck) return [];
    return Array.prototype.filter.call(deck.children, function (el) {
      return el.classList && el.classList.contains('slide');
    });
  }

  function visibles(lista) {
    return lista.filter(function (s) {
      var cs = getComputedStyle(s);
      var o = parseFloat(cs.opacity);
      return cs.display !== 'none' && cs.visibility !== 'hidden' && (isNaN(o) || o > 0.01);
    }).length;
  }

  function modoPresentacion() {
    if (!deck) return false;
    var lista = slidesDeck();
    if (lista.length < 2) return false;
    return getComputedStyle(deck).position === 'fixed' || visibles(lista) <= 1;
  }

  function pagina() { return document.scrollingElement || document.documentElement; }

  function slideVisible(lista) {
    var mejor = null, opacidad = 0;
    lista.forEach(function (s) {
      var cs = getComputedStyle(s);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      var o = parseFloat(cs.opacity);
      if (isNaN(o)) o = 1;
      if (o > opacidad) { opacidad = o; mejor = s; }
    });
    return mejor;
  }

  function esDesplazable(el) {
    if (!el || el.scrollHeight <= el.clientHeight + 2) return false;
    return /(auto|scroll)/.test(getComputedStyle(el).overflowY);
  }

  function contenedorDe(slide) {
    if (esDesplazable(slide)) return slide;
    var mejor = null, area = 0;
    Array.prototype.forEach.call(slide.querySelectorAll('*'), function (el) {
      if (!esDesplazable(el)) return;
      var a = el.clientWidth * el.clientHeight;
      if (a > area) { area = a; mejor = el; }
    });
    return mejor;
  }

  function calcularVista() {
    var v = {};
    if (modoPresentacion()) {
      var lista = slidesDeck();
      var s = slideVisible(lista);
      var fija = getComputedStyle(deck).position === 'fixed';
      var r = fija ? deck.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
      v.clave = 'd' + Math.max(0, lista.indexOf(s));
      v.slide = s;
      v.fija = fija;
      v.izq = r.left; v.arriba = r.top; v.ancho = r.width; v.alto = r.height;
    } else {
      v.clave = 'p';
      v.slide = null;
      v.izq = 0; v.arriba = 0; v.ancho = window.innerWidth; v.alto = window.innerHeight;
    }
    return v;
  }

  function desplazamiento() { return vista.cont ? vista.cont.scrollTop : 0; }

  /* ---------- Capas de dibujo ---------- */
  function crearCapa() {
    var c = document.createElement('canvas');
    c.className = 'anota-capa';
    c.setAttribute('aria-hidden', 'true');
    document.body.appendChild(c);
    return c;
  }
  var base = crearCapa();
  var vivo = crearCapa();
  var cb = base.getContext('2d');
  var cv = vivo.getContext('2d');
  var dpr = 1;

  function aplicarVista(v) {
    var cambioClave = v.clave !== vista.clave || v.slide !== vista.slide;
    vista.clave = v.clave;
    vista.slide = v.slide;
    if (cambioClave || vista.contClave !== v.clave) {
      vista.cont = v.slide ? (contenedorDe(v.slide) || (v.fija ? null : pagina())) : pagina();
      vista.contClave = v.clave;
    }
    var cambioTam = v.izq !== vista.izq || v.arriba !== vista.arriba || v.ancho !== vista.ancho || v.alto !== vista.alto;
    vista.izq = v.izq; vista.arriba = v.arriba; vista.ancho = v.ancho; vista.alto = v.alto;
    if (cambioTam) {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      [base, vivo].forEach(function (c) {
        c.style.left = vista.izq + 'px';
        c.style.top = vista.arriba + 'px';
        c.style.width = vista.ancho + 'px';
        c.style.height = vista.alto + 'px';
        c.width = Math.max(1, Math.round(vista.ancho * dpr));
        c.height = Math.max(1, Math.round(vista.alto * dpr));
      });
    }
    if (cambioClave) {
      actual = null;
      actualizarAcciones();
    }
    if (cambioClave || cambioTam) {
      redibujar();
      dibujarVivo();
    }
  }

  function revisar() { aplicarVista(calcularVista()); }

  function lista() {
    if (!trazos[vista.clave]) trazos[vista.clave] = [];
    return trazos[vista.clave];
  }

  function trazar(ctx, t) {
    var p = t.pts;
    if (!p.length) return;
    ctx.save();
    ctx.globalCompositeOperation = t.h === 'goma' ? 'destination-out' : 'source-over';
    ctx.globalAlpha = HERRAMIENTAS[t.h].alfa;
    ctx.strokeStyle = ctx.fillStyle = t.h === 'goma' ? '#000' : t.color;
    ctx.lineWidth = t.w;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    if (p.length === 1) {
      ctx.arc(p[0][0], p[0][1], t.w / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.moveTo(p[0][0], p[0][1]);
      for (var i = 1; i < p.length - 1; i++) {
        ctx.quadraticCurveTo(p[i][0], p[i][1], (p[i][0] + p[i + 1][0]) / 2, (p[i][1] + p[i + 1][1]) / 2);
      }
      ctx.lineTo(p[p.length - 1][0], p[p.length - 1][1]);
      ctx.stroke();
    }
    ctx.restore();
  }

  function redibujar() {
    cb.setTransform(1, 0, 0, 1, 0, 0);
    cb.clearRect(0, 0, base.width, base.height);
    cb.setTransform(dpr, 0, 0, dpr, 0, -desplazamiento() * dpr);
    (trazos[vista.clave] || []).forEach(function (t) { trazar(cb, t); });
  }

  function limpiarVivo() {
    cv.setTransform(1, 0, 0, 1, 0, 0);
    cv.clearRect(0, 0, vivo.width, vivo.height);
  }

  function dibujarVivo() {
    limpiarVivo();
    if (!actual) return;
    cv.setTransform(dpr, 0, 0, dpr, 0, -desplazamiento() * dpr);
    if (actual.h === 'goma') {
      var u = actual.pts[actual.pts.length - 1];
      cv.save();
      cv.strokeStyle = '#475569';
      cv.lineWidth = 2;
      cv.setLineDash([6, 4]);
      cv.beginPath();
      cv.arc(u[0], u[1], actual.w / 2, 0, Math.PI * 2);
      cv.stroke();
      cv.restore();
    } else {
      trazar(cv, actual);
    }
  }

  function pintar() {
    if (actual && actual.h === 'goma') {
      redibujar();
      trazar(cb, actual);
    }
    dibujarVivo();
  }

  /* ---------- Entrada: dedo, lápiz óptico o mouse ---------- */
  function puedeDibujar() { return estado.abierto && estado.herramienta !== 'mano'; }

  // Un toque sobre un botón de una barra fija o adherida (Siguiente, Atrás, zoom)
  // llega al botón en vez de convertirse en un trazo.
  function dentroDeFijo(el) {
    for (var n = el; n && n !== document.body && n.nodeType === 1; n = n.parentElement) {
      var pos = getComputedStyle(n).position;
      if (pos === 'fixed' || pos === 'sticky') return true;
    }
    return false;
  }
  function controlDebajo(x, y) {
    if (!document.elementsFromPoint) return null;
    var pila = document.elementsFromPoint(x, y);
    for (var i = 0; i < pila.length; i++) {
      var el = pila[i];
      if (el === base || el === vivo) continue;
      var c = el.closest('button, a[href], [role="button"], select, label');
      return c && dentroDeFijo(c) ? c : null;
    }
    return null;
  }
  var toque = null;
  function punto(e) { return [e.clientX - vista.izq, e.clientY - vista.arriba + desplazamiento()]; }

  vivo.addEventListener('pointerdown', function (e) {
    e.stopPropagation();
    if (!puedeDibujar() || !e.isPrimary || actual) return;
    e.preventDefault();
    var control = controlDebajo(e.clientX, e.clientY);
    if (control) {
      toque = { el: control, x: e.clientX, y: e.clientY, id: e.pointerId };
      return;
    }
    vista.contClave = null;
    revisar();
    try { vivo.setPointerCapture(e.pointerId); } catch (err) { /* sin captura */ }
    var h = estado.herramienta;
    actual = {
      h: h,
      color: estado.color[h] || '#000',
      w: HERRAMIENTAS[h].grosores[estado.grosor],
      pts: [punto(e)],
      id: e.pointerId
    };
    pintar();
  });

  vivo.addEventListener('pointermove', function (e) {
    e.stopPropagation();
    if (!actual || e.pointerId !== actual.id) return;
    var eventos = (e.getCoalescedEvents && e.getCoalescedEvents()) || [];
    if (!eventos.length) eventos = [e];
    eventos.forEach(function (ev) {
      var q = punto(ev);
      var u = actual.pts[actual.pts.length - 1];
      if (Math.abs(q[0] - u[0]) + Math.abs(q[1] - u[1]) >= 1.5) actual.pts.push(q);
    });
    pintar();
  });

  function terminar(e) {
    if (e) e.stopPropagation();
    if (toque && e && e.pointerId === toque.id) {
      var t = toque;
      toque = null;
      if (e.type === 'pointerup' && Math.abs(e.clientX - t.x) + Math.abs(e.clientY - t.y) < 14) t.el.click();
      return;
    }
    if (!actual || (e && e.pointerId !== actual.id)) return;
    lista().push(actual);
    actual = null;
    limpiarVivo();
    redibujar();
    actualizarAcciones();
  }
  vivo.addEventListener('pointerup', terminar);
  vivo.addEventListener('pointercancel', terminar);

  // Mientras se dibuja, deslizar el dedo no cambia de diapositiva ni mueve la página
  ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'mousedown', 'mouseup', 'click'].forEach(function (tipo) {
    vivo.addEventListener(tipo, function (e) {
      e.stopPropagation();
      if (tipo === 'touchmove') e.preventDefault();
    }, { passive: false });
  });

  // La rueda del mouse sigue desplazando el contenido
  vivo.addEventListener('wheel', function (e) {
    if (!vista.cont) return;
    vista.cont.scrollTop += e.deltaY;
    e.preventDefault();
  }, { passive: false });

  var marco = 0;
  function programar() {
    if (marco) return;
    marco = requestAnimationFrame(function () { marco = 0; redibujar(); dibujarVivo(); });
  }
  document.addEventListener('scroll', function (e) {
    var t = e.target === document ? (document.scrollingElement || document.documentElement) : e.target;
    if (t === vista.cont) programar();
  }, true);

  var esperaMedida = 0;
  window.addEventListener('resize', function () {
    clearTimeout(esperaMedida);
    esperaMedida = setTimeout(function () { vista.contClave = null; revisar(); redibujar(); }, 120);
  });
  window.addEventListener('hashchange', function () { setTimeout(revisar, 60); });
  setInterval(function () { if (estado.abierto || Object.keys(trazos).length) revisar(); }, 350);

  /* ---------- Botón y panel ---------- */
  var navBar = document.querySelector('.nav-bar');
  var pantallaCompleta = document.getElementById('fullscreen');
  var toggle;
  if (navBar && pantallaCompleta && pantallaCompleta.parentNode === navBar) {
    toggle = document.createElement('button');
    toggle.className = 'nav-btn anota-toggle';
    toggle.textContent = '✏️';
    navBar.insertBefore(toggle, pantallaCompleta);
  } else {
    toggle = document.createElement('button');
    toggle.className = 'anota-pestana';
    toggle.innerHTML = '<span>✏️</span>';
    document.body.appendChild(toggle);
  }
  toggle.type = 'button';
  toggle.title = 'Anotar en la pizarra';
  toggle.setAttribute('aria-label', 'Anotar en la pizarra');
  toggle.setAttribute('aria-pressed', 'false');

  var panel = document.createElement('div');
  panel.className = 'anota-panel';
  panel.setAttribute('role', 'toolbar');
  panel.setAttribute('aria-label', 'Herramientas para anotar');
  panel.hidden = true;
  panel.innerHTML =
    '<div class="ap-top"><b>Anotar</b>' +
      '<button type="button" data-a="lado" title="Cambiar el panel de lado" aria-label="Cambiar el panel de lado">⇄</button>' +
      '<button type="button" data-a="cerrar" title="Cerrar el panel" aria-label="Cerrar el panel">✕</button></div>' +
    '<div class="ap-grid">' +
      '<button type="button" class="ap-tool" data-h="lapiz" aria-pressed="false"><span>✏️</span>Lápiz</button>' +
      '<button type="button" class="ap-tool" data-h="destacador" aria-pressed="false"><span>🖍️</span>Destacar</button>' +
      '<button type="button" class="ap-tool" data-h="goma" aria-pressed="false"><span>🧽</span>Goma</button>' +
      '<button type="button" class="ap-tool" data-h="mano" aria-pressed="false"><span>✋</span>Página</button>' +
    '</div>' +
    '<div class="ap-seccion-color"><div class="ap-label">Color</div><div class="ap-colores"></div></div>' +
    '<div class="ap-seccion-grosor"><div class="ap-label">Grosor</div><div class="ap-grosores"></div></div>' +
    '<button type="button" class="ap-accion" data-a="deshacer">↶ Deshacer</button>' +
    '<button type="button" class="ap-accion peligro" data-a="borrar">🗑 Borrar página</button>' +
    '<div class="ap-ayuda">✋ Página: para tocar botones, el video o bajar en el texto sin dibujar.</div>';
  document.body.appendChild(panel);

  var cajaColores = panel.querySelector('.ap-colores');
  var cajaGrosores = panel.querySelector('.ap-grosores');
  var seccionColor = panel.querySelector('.ap-seccion-color');
  var seccionGrosor = panel.querySelector('.ap-seccion-grosor');
  var botonDeshacer = panel.querySelector('[data-a="deshacer"]');
  var botonBorrar = panel.querySelector('[data-a="borrar"]');

  function pintarPanel() {
    var h = estado.herramienta;
    Array.prototype.forEach.call(panel.querySelectorAll('.ap-tool'), function (b) {
      var on = b.getAttribute('data-h') === h;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    var conf = HERRAMIENTAS[h];
    seccionColor.hidden = !conf || !conf.colores.length;
    seccionGrosor.hidden = !conf;
    cajaColores.innerHTML = '';
    cajaGrosores.innerHTML = '';
    if (conf) {
      conf.colores.forEach(function (c) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'ap-color' + (estado.color[h] === c[0] ? ' on' : '');
        b.style.background = c[0];
        b.setAttribute('aria-label', c[1]);
        b.setAttribute('data-c', c[0]);
        cajaColores.appendChild(b);
      });
      conf.grosores.forEach(function (g, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'ap-grosor' + (estado.grosor === i ? ' on' : '');
        b.setAttribute('aria-label', ['Fino', 'Medio', 'Grueso'][i]);
        b.setAttribute('data-g', String(i));
        var tam = Math.max(4, Math.min(26, Math.round(g * (h === 'goma' ? 0.28 : h === 'destacador' ? 0.6 : 1.4))));
        var fondo = h === 'goma' ? '#94a3b8' : (estado.color[h] || '#173f70');
        b.innerHTML = '<i style="width:' + tam + 'px;height:' + tam + 'px;background:' + fondo + (h === 'destacador' ? ';opacity:.7' : '') + '"></i>';
        cajaGrosores.appendChild(b);
      });
    }
    vivo.classList.toggle('dibujando', puedeDibujar());
    vivo.classList.toggle('goma', h === 'goma');
    actualizarAcciones();
  }

  function actualizarAcciones() {
    if (!botonDeshacer) return;
    var hay = (trazos[vista.clave] || []).length > 0;
    botonDeshacer.disabled = !hay;
    botonBorrar.disabled = !hay;
    if (!hay) cancelarConfirmacion();
  }

  var esperaBorrar = 0;
  function cancelarConfirmacion() {
    clearTimeout(esperaBorrar);
    botonBorrar.classList.remove('confirmar');
    botonBorrar.textContent = '🗑 Borrar página';
  }

  function abrir(si) {
    estado.abierto = si;
    panel.hidden = !si;
    toggle.setAttribute('aria-pressed', si ? 'true' : 'false');
    document.body.classList.toggle('anotando', si);
    if (si) { vista.contClave = null; revisar(); }
    pintarPanel();
  }

  toggle.addEventListener('click', function () { abrir(!estado.abierto); });

  panel.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    if (b.hasAttribute('data-h')) {
      estado.herramienta = b.getAttribute('data-h');
      pintarPanel();
    } else if (b.hasAttribute('data-c')) {
      estado.color[estado.herramienta] = b.getAttribute('data-c');
      pintarPanel();
    } else if (b.hasAttribute('data-g')) {
      estado.grosor = parseInt(b.getAttribute('data-g'), 10) || 0;
      pintarPanel();
    } else {
      var a = b.getAttribute('data-a');
      if (a === 'cerrar') abrir(false);
      else if (a === 'lado') panel.classList.toggle('der');
      else if (a === 'deshacer') {
        lista().pop();
        redibujar();
        actualizarAcciones();
      } else if (a === 'borrar') {
        if (botonBorrar.classList.contains('confirmar')) {
          trazos[vista.clave] = [];
          redibujar();
          cancelarConfirmacion();
          actualizarAcciones();
        } else {
          botonBorrar.classList.add('confirmar');
          botonBorrar.textContent = '¿Borrar? Toca otra vez';
          esperaBorrar = setTimeout(cancelarConfirmacion, 3000);
        }
      }
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !estado.abierto) return;
    var modal = document.querySelector('.image-modal.open, [role="dialog"][aria-hidden="false"]');
    if (modal) return;
    abrir(false);
  });

  revisar();
  pintarPanel();
})();
