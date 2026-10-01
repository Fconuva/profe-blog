(function () {
  'use strict';
  var cv = document.querySelector('#lienzo'), cx = cv.getContext('2d');
  var estado = document.querySelector('#estado'), nivel = document.querySelector('#nivel');
  var mapa, avatar, piso, sprites = {}, zoom = 1, pan = { x: 0, y: 0 }, modoArrastre = false, inicioArrastre = null;
  var TW = 151, TH = 106, SX = 75, SY = 53, animacion = null;

  function mensaje(s) { estado.textContent = s; }
  function cargarImagen(url) {
    return new Promise(function (resolve, reject) {
      var img = new Image(); img.onload = function () { resolve(img); }; img.onerror = reject; img.src = url;
    });
  }
  function escala() {
    var ancho = (mapa.ancho + mapa.alto) * SX + TW;
    var alto = (mapa.ancho + mapa.alto) * SY + TH + 100;
    return Math.min(1, (cv.clientWidth - 12) / ancho, (cv.clientHeight - 12) / alto) * zoom;
  }
  function origen() {
    return { x: cv.clientWidth / 2 - TW / 2 + (mapa.alto - mapa.ancho) / 2 * SX,
      y: (cv.clientHeight - (mapa.ancho + mapa.alto) * SY) / 2 + 48 };
  }
  function punto(col, fila) { var o = origen(); return { x: o.x + (col - fila) * SX, y: o.y + (col + fila) * SY }; }
  function casilla(x, y) {
    var o = origen(), dx = x - o.x - TW / 2, dy = y - o.y - TH / 2;
    return { col: Math.floor((dx / SX + dy / SY) / 2 + .5), fila: Math.floor((dy / SY - dx / SX) / 2 + .5) };
  }
  function coordenada(ev) {
    var r = cv.getBoundingClientRect(), z = escala();
    return { x: (ev.clientX - r.left - cv.clientWidth / 2) / z + cv.clientWidth / 2 - pan.x,
      y: (ev.clientY - r.top - cv.clientHeight / 2) / z + cv.clientHeight / 2 - pan.y };
  }
  function muro(a, b, color) {
    cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y);
    cx.lineTo(b.x, b.y - 90); cx.lineTo(a.x, a.y - 90); cx.closePath();
    cx.fillStyle = color; cx.fill(); cx.strokeStyle = '#8096ad'; cx.lineWidth = 1.5; cx.stroke();
  }
  function dibujar() {
    if (!mapa || !cv.clientWidth) return;
    var dpr = window.devicePixelRatio || 1, W = cv.clientWidth, H = cv.clientHeight;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    }
    cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, W, H);
    var z = escala(); cx.save(); cx.translate(W / 2, H / 2); cx.scale(z, z);
    cx.translate(-W / 2 + pan.x, -H / 2 + pan.y); cx.imageSmoothingEnabled = false;
    mapa.suelo.forEach(function (c) { var p = punto(c.col, c.fila); cx.drawImage(piso, p.x, p.y); });
    mapa.suelo.forEach(function (c) {
      var p = punto(c.col, c.fila);
      if (!mapa.existe(c.col - 1, c.fila)) muro({ x:p.x, y:p.y + 53 }, { x:p.x + 75, y:p.y }, '#bac7d4');
      if (!mapa.existe(c.col, c.fila - 1)) muro({ x:p.x + 75, y:p.y }, { x:p.x + 151, y:p.y + 53 }, '#d5dfe9');
    });
    var figuras = mapa.muebles.map(function (m) { return { tipo:'mueble', prof:m.col + m.fila, valor:m }; });
    figuras.push({ tipo:'avatar', prof:avatar.col + avatar.fila + .1 });
    figuras.sort(function (a, b) { return a.prof - b.prof; });
    figuras.forEach(function (figura) {
      if (figura.tipo === 'avatar') {
        var pa = punto(avatar.col, avatar.fila);
        window.AvatarLookSystem.pintar(cx, pa.x + TW / 2, pa.y + 68,
          window.AvatarLookSystem.normalizeLook({ arriba:'camisetaRangers' }, { xpTotal:99999 }), .61);
      } else {
        var m = figura.valor, pm = punto(m.col, m.fila), img = sprites[m.id + '_' + m.dir];
        if (img) cx.drawImage(img, pm.x + (TW - img.naturalWidth) / 2, pm.y + TH - img.naturalHeight);
      }
    });
    cx.restore();
  }
  function moverA(col, fila) {
    if (animacion) return false;
    var desde = { col:Math.round(avatar.col), fila:Math.round(avatar.fila) };
    var ruta = mapa.ruta(desde, { col:col, fila:fila });
    if (!ruta) { mensaje('Ahí no se puede caminar.'); return false; }
    if (ruta.length < 2) { mensaje('Ya estás en esa casilla.'); return true; }
    mensaje('Caminando entre las dos zonas…');
    var i = 0, t0 = performance.now();
    function paso(t) {
      var k = Math.min(1, (t - t0) / 180), a = ruta[i], b = ruta[i + 1];
      avatar.col = a.col + (b.col - a.col) * k; avatar.fila = a.fila + (b.fila - a.fila) * k; dibujar();
      if (k >= 1) { i++; t0 = t; if (i === ruta.length - 1) {
        avatar = { col:b.col, fila:b.fila }; animacion = null; mensaje('Llegaste a la otra zona.'); return;
      } }
      animacion = requestAnimationFrame(paso);
    }
    animacion = requestAnimationFrame(paso);
    return true;
  }
  function actualizarVista() {
    nivel.textContent = zoom === 1 ? 'Vista completa' : Math.round(zoom * 100) + ' %';
    document.querySelector('#arrastrar').setAttribute('aria-pressed', String(modoArrastre));
    document.querySelector('#arrastrar').classList.toggle('on', modoArrastre);
    cv.classList.toggle('arrastre', modoArrastre);
    dibujar();
  }
  cv.addEventListener('pointerdown', function (ev) {
    if (!mapa) return;
    if (modoArrastre) {
      inicioArrastre = { id:ev.pointerId, x:ev.clientX, y:ev.clientY, px:pan.x, py:pan.y };
      cv.setPointerCapture(ev.pointerId); return;
    }
    var p = coordenada(ev), c = casilla(p.x, p.y);
    moverA(c.col, c.fila);
  });
  cv.addEventListener('pointermove', function (ev) {
    if (!inicioArrastre || ev.pointerId !== inicioArrastre.id) return;
    var z = escala(); pan.x = inicioArrastre.px + (ev.clientX - inicioArrastre.x) / z;
    pan.y = inicioArrastre.py + (ev.clientY - inicioArrastre.y) / z; dibujar();
  });
  ['pointerup','pointercancel','lostpointercapture'].forEach(function (evento) {
    cv.addEventListener(evento, function () { inicioArrastre = null; });
  });
  document.querySelector('#acercar').addEventListener('click', function () { zoom = Math.min(2.5, zoom + .25); actualizarVista(); });
  document.querySelector('#alejar').addEventListener('click', function () { zoom = Math.max(1, zoom - .25); actualizarVista(); });
  document.querySelector('#arrastrar').addEventListener('click', function () { modoArrastre = !modoArrastre; actualizarVista(); });
  document.querySelector('#centrar').addEventListener('click', function () { zoom = 1; pan = { x:0, y:0 }; modoArrastre = false; actualizarVista(); });
  window.addEventListener('resize', dibujar);

  fetch('./sala-en-l.json').then(function (r) { if (!r.ok) throw new Error('No se cargó el mapa'); return r.json(); })
    .then(function (datos) {
      mapa = window.MapaTiledCEST.importar(datos); avatar = { col:mapa.inicio.col, fila:mapa.inicio.fila };
      var base = new URL('./sala-en-l.json', location.href);
      var sueloUrl = new URL(datos.tilesets[0].image, base).href;
      if (new URL(sueloUrl).origin !== location.origin || !new URL(sueloUrl).pathname.startsWith('/estudiantes/assets/pieza/')) {
        throw new Error('El tileset debe ser un recurso local permitido.');
      }
      var recursos = [cargarImagen(sueloUrl).then(function (img) { piso = img; })];
      mapa.muebles.forEach(function (m) {
        recursos.push(cargarImagen('../../estudiantes/assets/pieza/' + m.id + '_' + m.dir + '.png')
          .then(function (img) { sprites[m.id + '_' + m.dir] = img; }));
      });
      return Promise.all(recursos);
    }).then(function () { mensaje('Salón en L listo. Puedes caminar entre sus dos zonas.'); dibujar(); })
    .catch(function (e) { mensaje('Error del mapa: ' + e.message); });
  window.LabHabitaciones = { modelo:function () { return mapa; }, moverA:moverA,
    avatar:function () { return { col:avatar.col, fila:avatar.fila }; }, dibujar:dibujar,
    centroPantalla:function (col, fila) {
      var p = punto(col, fila), r = cv.getBoundingClientRect(), z = escala();
      return { x:r.left + cv.clientWidth / 2 + z * (p.x + TW / 2 - cv.clientWidth / 2 + pan.x),
        y:r.top + cv.clientHeight / 2 + z * (p.y + TH / 2 - cv.clientHeight / 2 + pan.y) };
    } };
})();
