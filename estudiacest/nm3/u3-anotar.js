/*
 * Panel para anotar sobre las diapositivas en la pizarra táctil.
 * Lápiz, destacador y goma con el dedo, el lápiz óptico o el mouse.
 * Los trazos quedan guardados por diapositiva mientras la página esté abierta
 * y se mueven con el contenido cuando la diapositiva se desplaza.
 */
(function () {
  'use strict';

  var deck = document.querySelector('.deck');
  var navBar = document.querySelector('.nav-bar');
  var slides = Array.prototype.slice.call(document.querySelectorAll('.deck .slide'));
  if (!deck || !navBar || !slides.length || !window.HTMLCanvasElement) return;

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
  var trazos = slides.map(function () { return []; });
  var actual = null;
  var activo = indiceActivo();

  /* ---------- Estilos ---------- */
  var css = [
    '.anota-capa{position:fixed;left:0;top:0;z-index:22;pointer-events:none;touch-action:none}',
    '.anota-capa.dibujando{pointer-events:auto;cursor:crosshair}',
    '.anota-capa.dibujando.goma{cursor:cell}',
    '.anota-panel{position:fixed;z-index:45;top:50%;left:.75rem;transform:translateY(-50%);width:9.6rem;max-height:calc(100vh - 6rem);overflow:auto;background:#fff;border:1px solid #cbd5e1;border-radius:.9rem;box-shadow:0 18px 40px rgba(15,23,42,.28);padding:.6rem;display:grid;gap:.55rem;font:600 .8rem/1.2 Inter,system-ui,sans-serif;color:#142238;touch-action:manipulation;-webkit-user-select:none;user-select:none}',
    '.anota-panel[hidden]{display:none}',
    '.anota-panel.der{left:auto;right:.75rem}',
    '.ap-top{display:flex;align-items:center;gap:.35rem}',
    '.ap-top b{flex:1;font-size:.9rem;color:#173f70}',
    '.ap-top button{width:2.3rem;height:2.3rem;border-radius:.5rem;border:1px solid #cbd5e1;background:#fff;color:#173f70;font-size:1rem;font-weight:800;cursor:pointer}',
    '.ap-label{font-size:.66rem;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:#64748b}',
    '.ap-grid{display:grid;grid-template-columns:1fr 1fr;gap:.4rem}',
    '.ap-tool{height:3.9rem;border-radius:.65rem;border:2px solid #d4dee9;background:#f8fafc;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.15rem;font:700 .74rem/1.1 Inter,sans-serif;color:#173f70;cursor:pointer;padding:0}',
    '.ap-tool span{font-size:1.45rem;line-height:1}',
    '.ap-tool.on{background:#173f70;border-color:#173f70;color:#fff}',
    '.ap-colores{display:grid;grid-template-columns:repeat(4,1fr);gap:.4rem}',
    '.ap-color{height:1.9rem;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 1px #94a3b8;cursor:pointer;padding:0}',
    '.ap-color.on{box-shadow:0 0 0 3px #173f70}',
    '.ap-grosores{display:grid;grid-template-columns:repeat(3,1fr);gap:.4rem}',
    '.ap-grosor{height:2.6rem;border-radius:.5rem;border:2px solid #d4dee9;background:#fff;display:grid;place-items:center;cursor:pointer;padding:0}',
    '.ap-grosor i{display:block;border-radius:50%;background:#173f70}',
    '.ap-grosor.on{border-color:#173f70;background:#eef4fb}',
    '.ap-accion{height:2.8rem;border-radius:.65rem;border:1px solid #cbd5e1;background:#fff;font:700 .8rem/1 Inter,sans-serif;color:#173f70;cursor:pointer}',
    '.ap-accion:disabled{opacity:.4;cursor:default}',
    '.ap-accion.peligro{color:#b84646}',
    '.ap-accion.confirmar{background:#b84646;border-color:#b84646;color:#fff}',
    '.ap-ayuda{font-size:.68rem;font-weight:600;color:#64748b;line-height:1.3}',
    '.nav-btn.anota-toggle{font-size:1.1rem}',
    '.nav-btn.anota-toggle[aria-pressed="true"]{background:#173f70;border-color:#173f70;color:#fff}',
    'body.anotando .back{display:none}',
    '@media print{.anota-capa,.anota-panel,.anota-toggle{display:none!important}}'
  ].join('\n');
  var estilo = document.createElement('style');
  estilo.textContent = css;
  document.head.appendChild(estilo);

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
  var dpr = 1, izq = 0, arriba = 0, ancho = 0, alto = 0;

  function medir() {
    var r = deck.getBoundingClientRect();
    izq = r.left; arriba = r.top; ancho = r.width; alto = r.height;
    dpr = Math.max(1, window.devicePixelRatio || 1);
    [base, vivo].forEach(function (c) {
      c.style.left = izq + 'px';
      c.style.top = arriba + 'px';
      c.style.width = ancho + 'px';
      c.style.height = alto + 'px';
      c.width = Math.max(1, Math.round(ancho * dpr));
      c.height = Math.max(1, Math.round(alto * dpr));
    });
    redibujar();
    dibujarVivo();
  }

  function indiceActivo() {
    for (var i = 0; i < slides.length; i++) {
      if (slides[i].classList.contains('active')) return i;
    }
    return 0;
  }
  function desplazamiento() { return slides[activo] ? slides[activo].scrollTop : 0; }

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
    (trazos[activo] || []).forEach(function (t) { trazar(cb, t); });
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
  function punto(e) { return [e.clientX - izq, e.clientY - arriba + desplazamiento()]; }

  vivo.addEventListener('pointerdown', function (e) {
    if (!puedeDibujar() || !e.isPrimary || actual) return;
    e.preventDefault();
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
    if (!actual || e.pointerId !== actual.id) return;
    var lista = (e.getCoalescedEvents && e.getCoalescedEvents()) || [];
    if (!lista.length) lista = [e];
    lista.forEach(function (ev) {
      var q = punto(ev);
      var u = actual.pts[actual.pts.length - 1];
      if (Math.abs(q[0] - u[0]) + Math.abs(q[1] - u[1]) >= 1.5) actual.pts.push(q);
    });
    pintar();
  });

  function terminar(e) {
    if (!actual || (e && e.pointerId !== actual.id)) return;
    trazos[activo].push(actual);
    actual = null;
    limpiarVivo();
    redibujar();
    actualizarAcciones();
  }
  vivo.addEventListener('pointerup', terminar);
  vivo.addEventListener('pointercancel', terminar);

  // Mientras se dibuja, deslizar el dedo no cambia de diapositiva
  ['touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(function (tipo) {
    vivo.addEventListener(tipo, function (e) {
      e.stopPropagation();
      if (tipo === 'touchmove') e.preventDefault();
    }, { passive: false });
  });

  // La rueda del mouse sigue desplazando la diapositiva
  vivo.addEventListener('wheel', function (e) {
    var s = slides[activo];
    if (!s) return;
    s.scrollTop += e.deltaY;
    e.preventDefault();
  }, { passive: false });

  var marco = 0;
  function programar() {
    if (marco) return;
    marco = requestAnimationFrame(function () { marco = 0; redibujar(); dibujarVivo(); });
  }
  slides.forEach(function (s, i) {
    s.addEventListener('scroll', function () { if (i === activo) programar(); }, { passive: true });
  });

  if (window.MutationObserver) {
    var observador = new MutationObserver(function () {
      var i = indiceActivo();
      if (i === activo) return;
      actual = null;
      activo = i;
      limpiarVivo();
      redibujar();
      actualizarAcciones();
    });
    slides.forEach(function (s) { observador.observe(s, { attributes: true, attributeFilter: ['class'] }); });
  }

  var esperaMedida = 0;
  window.addEventListener('resize', function () {
    clearTimeout(esperaMedida);
    esperaMedida = setTimeout(medir, 120);
  });

  /* ---------- Panel ---------- */
  var toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'nav-btn anota-toggle';
  toggle.title = 'Anotar en la pizarra';
  toggle.setAttribute('aria-label', 'Anotar en la pizarra');
  toggle.setAttribute('aria-pressed', 'false');
  toggle.textContent = '✏️';
  var pantallaCompleta = document.getElementById('fullscreen');
  navBar.insertBefore(toggle, pantallaCompleta || navBar.lastElementChild);

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
      cajaGrosores.innerHTML = '';
      conf.grosores.forEach(function (g, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'ap-grosor' + (estado.grosor === i ? ' on' : '');
        b.setAttribute('aria-label', ['Fino', 'Medio', 'Grueso'][i]);
        b.setAttribute('data-g', String(i));
        var tam = Math.max(4, Math.min(26, Math.round(g * (h === 'goma' ? 0.28 : h === 'destacador' ? 0.6 : 1.4))));
        b.innerHTML = '<i style="width:' + tam + 'px;height:' + tam + 'px;' +
          (h === 'destacador' ? 'background:' + estado.color.destacador + ';opacity:.7' : h === 'lapiz' ? 'background:' + estado.color.lapiz : 'background:#94a3b8') + '"></i>';
        cajaGrosores.appendChild(b);
      });
    }
    vivo.classList.toggle('dibujando', puedeDibujar());
    vivo.classList.toggle('goma', h === 'goma');
    actualizarAcciones();
  }

  function actualizarAcciones() {
    var hay = (trazos[activo] || []).length > 0;
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
    if (si) medir();
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
        trazos[activo].pop();
        redibujar();
        actualizarAcciones();
      } else if (a === 'borrar') {
        if (botonBorrar.classList.contains('confirmar')) {
          trazos[activo] = [];
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
    if (e.key === 'Escape' && estado.abierto) {
      var modal = document.getElementById('image-modal');
      if (modal && modal.classList.contains('open')) return;
      abrir(false);
    }
  });

  medir();
  pintarPanel();
})();
