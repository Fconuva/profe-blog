/* Mi espacio: personaje, pieza y muebles, en tres pestañas dentro del panel.
 *
 * Guarda en Firebase, no en el navegador. El sistema anterior se sentía como que
 * "no quedaba" porque el arte era pobre; aquí además cada cambio se relee
 * después de escribirlo, así que si algo no se guardó, se avisa.
 *
 * Uso:  MiEspacio.montar({ host, db, base, uid, xp })
 */
(function (global) {
  'use strict';

  // Ruta absoluta: el módulo puede montarse desde páginas de distinta carpeta y
  // con una ruta relativa los sprites se buscarían en el lugar equivocado.
  var RUTA = '/estudiantes/assets/pieza/';
  var TW = 151, ROMBO = 106, SX = 75, SY = 53;
  var COLS = 5, FILAS = 5;
  var DIRS = ['SE', 'SW', 'NE', 'NW'];

  var CATALOGO = [
    {id:'bedSingle',        nom:'Cama',            xp:0,    motivo:'De partida',             sup:0},
    {id:'desk',             nom:'Escritorio',      xp:0,    motivo:'De partida',             sup:42},
    {id:'chairDesk',        nom:'Silla',           xp:0,    motivo:'De partida',             sup:0},
    {id:'rugRound',         nom:'Alfombra',        xp:0,    motivo:'De partida',             sup:0, plano:true},
    {id:'lampSquareFloor',  nom:'Lámpara de pie',  xp:120,  motivo:'Primera clase completa', sup:0},
    {id:'pottedPlant',      nom:'Planta',          xp:120,  motivo:'Primera clase completa', sup:0},
    {id:'bookcaseOpen',     nom:'Estante',         xp:260,  motivo:'Tres clases completas',  sup:0},
    {id:'books',            nom:'Libros',          xp:260,  motivo:'Tres clases completas',  sup:0, apila:true},
    {id:'laptop',           nom:'Notebook',        xp:420,  motivo:'Ensayo SIMCE rendido',   sup:0, apila:true},
    {id:'sideTable',        nom:'Velador',         xp:420,  motivo:'Ensayo SIMCE rendido',   sup:36},
    {id:'trashcan',         nom:'Papelero',        xp:520,  motivo:'Racha de 5 días',        sup:0},
    {id:'plantSmall1',      nom:'Suculenta',       xp:520,  motivo:'Racha de 5 días',        sup:0, apila:true},
    {id:'lampRoundTable',   nom:'Lamparita',       xp:640,  motivo:'Seis clases completas',  sup:0, apila:true},
    {id:'radio',            nom:'Radio',           xp:640,  motivo:'Seis clases completas',  sup:0, apila:true},
    {id:'bear',             nom:'Peluche',         xp:800,  motivo:'Nivel 5',                sup:0, apila:true},
    {id:'computerScreen',   nom:'Monitor',         xp:800,  motivo:'Nivel 5',                sup:0, apila:true},
    {id:'loungeSofa',       nom:'Sofá',            xp:1100, motivo:'Unidad 3 terminada',     sup:0},
    {id:'tableCoffee',      nom:'Mesa de centro',  xp:1100, motivo:'Unidad 3 terminada',     sup:30},
    {id:'televisionModern', nom:'Televisor',       xp:1500, motivo:'Nivel 8',                sup:0, apila:true},
    {id:'speaker',          nom:'Parlante',        xp:1500, motivo:'Nivel 8',                sup:0},
    {id:'bookcaseClosed',   nom:'Repisa cerrada',  xp:1900, motivo:'Nivel 10',               sup:0},
    {id:'rugSquare',        nom:'Alfombra grande', xp:1900, motivo:'Nivel 10',               sup:0, plano:true},
    {id:'coatRackStanding', nom:'Perchero',        xp:2400, motivo:'Nivel 12',               sup:0},
    {id:'kitchenFridgeSmall',nom:'Frigobar',       xp:2400, motivo:'Nivel 12',               sup:34}
  ];
  var POR_ID = {}; CATALOGO.forEach(function (m) { POR_ID[m.id] = m; });
  function ficha(id) { return POR_ID[id] || { sup: 0 }; }

  var S = {};   // estado del módulo

  function esc(t){ return String(t == null ? '' : t).replace(/[&<>"]/g, function(c){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]; }); }

  // ---------------- imágenes ----------------
  var imgs = {};
  function cargar(nombre, alListo) {
    if (imgs[nombre]) return;
    var im = new Image();
    im.onload = alListo; im.onerror = alListo;
    im.src = RUTA + nombre + '.png';
    imgs[nombre] = im;
  }

  // ---------------- geometría ----------------
  function origen() {
    var cv = S.cv, altoPiso = (COLS + FILAS) * SY;
    return {
      ox: cv.clientWidth / 2 - TW / 2 + (FILAS - COLS) / 2 * SX,
      oy: (cv.clientHeight - altoPiso) / 2 + 26
    };
  }
  function celda(col, fila) {
    var o = origen();
    return { x: o.ox + (col - fila) * SX, y: o.oy + (col + fila) * SY };
  }
  function aCelda(px, py) {
    var o = origen(), dx = px - o.ox - TW / 2, dy = py - o.oy - 53;
    return { col: Math.floor(dx / SX / 2 + dy / SY / 2 + 0.5),
             fila: Math.floor(dy / SY / 2 - dx / SX / 2 + 0.5) };
  }
  function zoomActual() {
    var cv = S.cv;
    var anchoPieza = (COLS + FILAS) * SX + TW;
    var altoPieza = (COLS + FILAS) * SY + ROMBO + 132;
    return Math.min(1, (cv.clientWidth - 16) / anchoPieza, (cv.clientHeight - 16) / altoPieza);
  }

  function ocupacion(col, fila, salvo) {
    var r = { plano: -1, base: -1, encima: -1 };
    S.pieza.forEach(function (m, i) {
      if (i === salvo || m.col !== col || m.fila !== fila) return;
      var f = ficha(m.id);
      if (f.plano) r.plano = i; else if (m.sobre) r.encima = i; else r.base = i;
    });
    return r;
  }
  function estorbo(id, col, fila, salvo) {
    var f = ficha(id), o = ocupacion(col, fila, salvo);
    if (f.plano) return o.plano >= 0 ? 'Ya hay una alfombra ahí' : null;
    if (o.base < 0) return null;
    if (!f.apila) return 'Esa baldosa ya está ocupada';
    if (!ficha(S.pieza[o.base].id).sup) return 'Encima de eso no se puede poner nada';
    if (o.encima >= 0) return 'Ya hay algo sobre ese mueble';
    return null;
  }

  // ---------------- dibujo de la pieza ----------------
  var cajas = [];
  function pintarSprite(nombre, col, fila, z) {
    var im = imgs[nombre];
    if (!im || !im.complete || !im.naturalWidth) return null;
    var p = celda(col, fila), cx = S.cx;
    var x = p.x + (TW - im.naturalWidth) / 2;
    var y = p.y + ROMBO - im.naturalHeight - (z || 0);
    cx.drawImage(im, x, y);
    return { x: x, y: y, w: im.naturalWidth, h: im.naturalHeight };
  }
  function paredes() {
    var cx = S.cx;
    var n = celda(0, 0), e = celda(COLS - 1, 0), w = celda(0, FILAS - 1);
    var N = { x: n.x + TW / 2, y: n.y }, E = { x: e.x + TW, y: e.y + ROMBO / 2 },
        W = { x: w.x, y: w.y + ROMBO / 2 }, H = 132;
    function plano(a, b, relleno, canto) {
      cx.beginPath();
      cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y);
      cx.lineTo(b.x, b.y - H); cx.lineTo(a.x, a.y - H); cx.closePath();
      cx.fillStyle = relleno; cx.fill();
      cx.beginPath();
      cx.moveTo(a.x, a.y - H); cx.lineTo(b.x, b.y - H);
      cx.lineTo(b.x, b.y - H + 7); cx.lineTo(a.x, a.y - H + 7); cx.closePath();
      cx.fillStyle = canto; cx.fill();
    }
    plano(W, N, '#cdd6e0', '#e6ecf3');
    plano(N, E, '#e3e9f0', '#f4f7fa');
    var t = 0.55, m = { x: N.x + (E.x - N.x) * t, y: N.y + (E.y - N.y) * t };
    var dx = E.x - N.x, dy = E.y - N.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, an = 62;
    cx.beginPath();
    cx.moveTo(m.x, m.y - 74); cx.lineTo(m.x + ux * an, m.y + uy * an - 74);
    cx.lineTo(m.x + ux * an, m.y + uy * an - 22); cx.lineTo(m.x, m.y - 22); cx.closePath();
    cx.fillStyle = '#9fd8ef'; cx.fill();
    cx.strokeStyle = '#fff'; cx.lineWidth = 3; cx.stroke();
  }
  function pintarPersonaje() {
    var p = celda(S.av.col, S.av.fila);
    global.AvatarLookSystem.pintar(S.cx, p.x + TW / 2, p.y + 53 + 16, S.look, 0.62);
  }

  function dibujar() {
    if (!S.cv || !S.cv.clientWidth) return;
    var cx = S.cx, dpr = global.devicePixelRatio || 1;
    var W = S.cv.clientWidth, H = S.cv.clientHeight;
    if (S.cv.width !== W * dpr || S.cv.height !== H * dpr) { S.cv.width = W * dpr; S.cv.height = H * dpr; }
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx.clearRect(0, 0, W, H);
    var z = zoomActual();
    cx.save();
    cx.translate(W / 2, H / 2); cx.scale(z, z); cx.translate(-W / 2, -H / 2);
    cx.imageSmoothingEnabled = false;
    S.zoom = z;

    var piso = imgs['floorFull_SE'];
    if (piso && piso.complete) {
      for (var f = 0; f < FILAS; f++) for (var c = 0; c < COLS; c++) {
        var p = celda(c, f); cx.drawImage(piso, p.x, p.y);
      }
    }
    paredes();

    if (S.elegido && S.hover) {
      var ph = celda(S.hover.col, S.hover.fila);
      cx.save(); cx.globalAlpha = .5; cx.fillStyle = '#38bdf8';
      cx.beginPath(); cx.moveTo(ph.x + TW / 2, ph.y); cx.lineTo(ph.x + TW, ph.y + 53);
      cx.lineTo(ph.x + TW / 2, ph.y + ROMBO); cx.lineTo(ph.x, ph.y + 53); cx.closePath();
      cx.fill(); cx.restore();
    }

    cajas = [];
    function capa(m) { var f = ficha(m.id); return f.plano ? 0 : (m.sobre ? 2 : 1); }
    var orden = S.pieza.map(function (m, i) { return { m: m, i: i }; });
    orden.sort(function (a, b) {
      var d = (a.m.col + a.m.fila) - (b.m.col + b.m.fila);
      return d !== 0 ? d : capa(a.m) - capa(b.m);
    });
    var yaAvatar = false;
    orden.forEach(function (o) {
      if (!yaAvatar && (o.m.col + o.m.fila) > (S.av.col + S.av.fila)) { pintarPersonaje(); yaAvatar = true; }
      var z2 = 0;
      if (o.m.sobre) { var oc = ocupacion(o.m.col, o.m.fila, o.i); if (oc.base >= 0) z2 = ficha(S.pieza[oc.base].id).sup || 0; }
      var caja = pintarSprite(o.m.id + '_' + o.m.dir, o.m.col, o.m.fila, z2);
      if (caja) {
        caja.idx = o.i; cajas.push(caja);
        if (o.i === S.sel) {
          cx.save(); cx.strokeStyle = '#38bdf8'; cx.lineWidth = 2; cx.setLineDash([5, 4]);
          cx.strokeRect(caja.x - 2, caja.y - 2, caja.w + 4, caja.h + 4); cx.restore();
        }
      }
    });
    if (!yaAvatar) pintarPersonaje();
    cx.restore();
  }

  // ---------------- guardado ----------------
  var pendiente = null;
  function guardar(campo, valor, alFallar) {
    if (!S.db || !S.uid) return;
    clearTimeout(pendiente);
    pendiente = setTimeout(function () {
      var ref = S.db.ref(S.base + '/avatar/' + S.uid + '/' + campo);
      ref.set(valor).then(function () {
        return ref.once('value');   // releer: escribir no es haber guardado
      }).then(function (snap) {
        var ok = snap.exists();
        marcarEstado(ok ? 'Guardado' : 'No se pudo guardar', !ok);
      }).catch(function () {
        marcarEstado('No se pudo guardar', true);
        if (alFallar) alFallar();
      });
    }, 500);
  }
  var tEstado;
  function marcarEstado(txt, malo) {
    var el = S.host.querySelector('.esp-estado');
    if (!el) return;
    el.textContent = txt;
    el.className = 'esp-estado' + (malo ? ' malo' : ' bien');
    clearTimeout(tEstado);
    tEstado = setTimeout(function () { el.textContent = ''; el.className = 'esp-estado'; }, 2500);
  }
  function avisar(msg) {
    var el = S.host.querySelector('.esp-aviso');
    if (!el) return;
    el.textContent = msg; el.style.opacity = 1;
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.style.opacity = 0; }, 2400);
  }

  // ---------------- interfaz ----------------
  function plantilla() {
    return '' +
    '<div class="esp-tabs">' +
      '<button data-p="personaje" class="on">Mi personaje</button>' +
      '<button data-p="pieza">Mi pieza</button>' +
      '<button data-p="muebles">Muebles</button>' +
      '<span class="esp-estado"></span>' +
    '</div>' +
    '<div class="esp-panel" data-panel="personaje">' +
      '<div class="esp-personaje">' +
        '<div class="esp-vista"><div class="esp-figura" id="espFigura"></div>' +
          '<button class="esp-azar" type="button">Al azar</button></div>' +
        '<div class="esp-ropero" id="espRopero"></div>' +
      '</div>' +
    '</div>' +
    '<div class="esp-panel oculto" data-panel="pieza">' +
      '<div class="esp-escena"><canvas id="espLienzo"></canvas>' +
        '<div class="esp-acciones">' +
          '<button id="espRotar" title="Girar" disabled>⟳</button>' +
          '<button id="espQuitar" title="Guardar en el cajón" disabled>✕</button>' +
        '</div>' +
        '<div class="esp-aviso"></div>' +
      '</div>' +
    '</div>' +
    '<div class="esp-panel oculto" data-panel="muebles">' +
      '<div class="esp-subtabs"><button data-f="tengo" class="on">Tengo</button>' +
        '<button data-f="faltan">Por ganar</button><span id="espCuenta"></span></div>' +
      '<div class="esp-rejilla" id="espRejilla"></div>' +
    '</div>';
  }

  function pintarRopero() {
    var cont = S.host.querySelector('#espRopero');
    var cats = global.AvatarLookSystem.getEditorCategories({ xpTotal: S.xp });
    cont.innerHTML = cats.map(function (c) {
      return '<div class="esp-cat"><h4>' + esc(c.label) + '</h4><div class="esp-ops">' +
        c.options.map(function (o) {
          var sel = S.look[c.id] === o.id ? ' sel' : '';
          var blo = o.locked ? ' blo' : '';
          var muestra = o.color
            ? '<i style="background:' + o.color + '"></i>'
            : '<span>' + esc(o.name) + '</span>';
          return '<button class="esp-op' + sel + blo + '" data-cat="' + c.id + '" data-op="' + o.id + '"' +
                 ' title="' + (o.locked ? 'Se abre con ' + o.minXp + ' XP' : esc(o.name)) + '">' +
                 muestra + (o.locked ? '<b>🔒</b>' : '') + '</button>';
        }).join('') + '</div></div>';
    }).join('');

    cont.querySelectorAll('.esp-op').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.classList.contains('blo')) {
          avisar('Se abre con ' + b.dataset.op + ': te faltan XP');
          marcarEstado('Todavía bloqueado', true);
          return;
        }
        S.look[b.dataset.cat] = b.dataset.op;
        pintarFigura(); pintarRopero(); dibujar();
        guardar('look', S.look);
      });
    });
  }
  function pintarFigura() {
    global.AvatarLookSystem.render(S.host.querySelector('#espFigura'),
      { look: S.look, xpTotal: S.xp, size: 170 });
  }

  var filtro = 'tengo';
  function pintarMuebles() {
    var cont = S.host.querySelector('#espRejilla');
    var lista = CATALOGO.filter(function (m) {
      return filtro === 'tengo' ? S.xp >= m.xp : S.xp < m.xp;
    });
    S.host.querySelector('#espCuenta').textContent =
      CATALOGO.filter(function (m) { return S.xp >= m.xp; }).length + ' de ' + CATALOGO.length;
    cont.innerHTML = lista.map(function (m) {
      var n = S.pieza.filter(function (p) { return p.id === m.id; }).length;
      return '<div class="esp-item' + (S.xp >= m.xp ? '' : ' blo') + (S.elegido === m.id ? ' sel' : '') +
        '" data-id="' + m.id + '">' +
        '<img src="' + RUTA + m.id + '_SE.png" alt="' + esc(m.nom) + '">' +
        '<div class="esp-nom">' + esc(m.nom) + '</div>' +
        (S.xp >= m.xp ? '' : '<div class="esp-req">' + esc(m.motivo) + '</div>') +
        (n ? '<span class="esp-cont">' + n + '</span>' : '') + '</div>';
    }).join('');
    cont.querySelectorAll('.esp-item').forEach(function (el) {
      el.addEventListener('click', function () {
        var m = POR_ID[el.dataset.id];
        if (S.xp < m.xp) { avisar('Se gana así: ' + m.motivo); return; }
        S.elegido = (S.elegido === m.id) ? null : m.id;
        S.sel = -1; botones(); pintarMuebles();
        if (S.elegido) { verPanel('pieza'); avisar('Ahora toca una baldosa del piso'); }
        dibujar();
      });
    });
  }

  function botones() {
    S.host.querySelector('#espRotar').disabled = S.sel < 0;
    S.host.querySelector('#espQuitar').disabled = S.sel < 0;
  }
  function verPanel(cual) {
    S.host.querySelectorAll('.esp-panel').forEach(function (p) {
      p.classList.toggle('oculto', p.dataset.panel !== cual);
    });
    S.host.querySelectorAll('.esp-tabs button').forEach(function (b) {
      b.classList.toggle('on', b.dataset.p === cual);
    });
    if (cual === 'pieza') setTimeout(dibujar, 40);
  }

  function punto(ev) {
    var r = S.cv.getBoundingClientRect();
    var t = (ev.touches && ev.touches[0]) || ev;
    var W = S.cv.clientWidth, H = S.cv.clientHeight, z = S.zoom || 1;
    return { x: (t.clientX - r.left - W / 2) / z + W / 2,
             y: (t.clientY - r.top - H / 2) / z + H / 2 };
  }
  function muebleEn(x, y) {
    for (var i = cajas.length - 1; i >= 0; i--) {
      var c = cajas[i];
      if (x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h) return c.idx;
    }
    return -1;
  }

  function conectarLienzo() {
    S.cv.addEventListener('pointermove', function (ev) {
      if (!S.elegido) return;
      var p = punto(ev), c = aCelda(p.x, p.y);
      S.hover = (c.col >= 0 && c.col < COLS && c.fila >= 0 && c.fila < FILAS) ? c : null;
      dibujar();
    });
    S.cv.addEventListener('pointerdown', function (ev) {
      var p = punto(ev), idx = muebleEn(p.x, p.y);
      if (idx >= 0 && !S.elegido) { S.sel = (S.sel === idx) ? -1 : idx; botones(); dibujar(); return; }
      var c = aCelda(p.x, p.y);
      if (c.col < 0 || c.col >= COLS || c.fila < 0 || c.fila >= FILAS) return;
      if (S.elegido) {
        var no = estorbo(S.elegido, c.col, c.fila, -1);
        if (no) { avisar(no); return; }
        var oc = ocupacion(c.col, c.fila, -1);
        S.pieza.push({ id: S.elegido, col: c.col, fila: c.fila, dir: 'SE',
                       sobre: oc.base >= 0 && !!ficha(S.elegido).apila });
        S.sel = S.pieza.length - 1; S.elegido = null; S.hover = null;
        botones(); pintarMuebles(); dibujar(); guardar('pieza', S.pieza);
        avisar('Puesto. Con ⟳ lo giras');
      } else if (S.sel >= 0) {
        var m = S.pieza[S.sel];
        var no2 = estorbo(m.id, c.col, c.fila, S.sel);
        if (no2) { avisar(no2); return; }
        var oc2 = ocupacion(c.col, c.fila, S.sel);
        m.col = c.col; m.fila = c.fila;
        m.sobre = oc2.base >= 0 && !!ficha(m.id).apila;
        dibujar(); guardar('pieza', S.pieza);
      }
    });
    S.host.querySelector('#espRotar').addEventListener('click', function () {
      if (S.sel < 0) return;
      var m = S.pieza[S.sel];
      m.dir = DIRS[(DIRS.indexOf(m.dir) + 1) % DIRS.length];
      dibujar(); guardar('pieza', S.pieza);
    });
    S.host.querySelector('#espQuitar').addEventListener('click', function () {
      if (S.sel < 0) return;
      S.pieza.splice(S.sel, 1); S.sel = -1;
      botones(); pintarMuebles(); dibujar(); guardar('pieza', S.pieza);
      avisar('Guardado en el cajón');
    });
  }

  function montar(cfg) {
    S.host = cfg.host; S.db = cfg.db; S.base = cfg.base; S.uid = cfg.uid;
    S.xp = cfg.xp || 0;
    S.look = global.AvatarLookSystem.normalizeLook(cfg.look, { xpTotal: S.xp });
    S.pieza = Array.isArray(cfg.pieza) ? cfg.pieza : [
      { id: 'rugRound', col: 2, fila: 2, dir: 'SE' },
      { id: 'bedSingle', col: 0, fila: 1, dir: 'SE' },
      { id: 'desk', col: 4, fila: 1, dir: 'SW' },
      { id: 'chairDesk', col: 3, fila: 1, dir: 'NE' }
    ];
    S.av = { col: 2, fila: 3 };
    S.sel = -1; S.elegido = null; S.hover = null;

    S.host.innerHTML = plantilla();
    S.cv = S.host.querySelector('#espLienzo');
    S.cx = S.cv.getContext('2d');

    S.host.querySelectorAll('.esp-tabs button').forEach(function (b) {
      b.addEventListener('click', function () { verPanel(b.dataset.p); });
    });
    S.host.querySelectorAll('.esp-subtabs button').forEach(function (b) {
      b.addEventListener('click', function () {
        S.host.querySelectorAll('.esp-subtabs button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on'); filtro = b.dataset.f; pintarMuebles();
      });
    });
    S.host.querySelector('.esp-azar').addEventListener('click', function () {
      S.look = global.AvatarLookSystem.randomizeLook({ xpTotal: S.xp });
      pintarFigura(); pintarRopero(); dibujar(); guardar('look', S.look);
    });

    ['floorFull_SE'].forEach(function (n) { cargar(n, dibujar); });
    CATALOGO.forEach(function (m) { DIRS.forEach(function (d) { cargar(m.id + '_' + d, dibujar); }); });

    pintarFigura(); pintarRopero(); pintarMuebles(); botones(); conectarLienzo();
    global.addEventListener('resize', dibujar);
    setTimeout(dibujar, 80);
  }

  global.MiEspacio = { montar: montar, CATALOGO: CATALOGO };
})(window);
