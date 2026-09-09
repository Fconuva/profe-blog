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

  // El catálogo lo genera la carga masiva y vive en js/catalogo-casa.js. Si no
  // llegó a cargarse, se usa un juego mínimo para que la casa no quede vacía.
  var CATALOGO = global.CATALOGO_CASA || [
    {id:'bedSingle', nom:'Cama',        fam:'dormitorio', xp:0, motivo:'De partida', sup:0},
    {id:'desk',      nom:'Escritorio',  fam:'estudio',    xp:0, motivo:'De partida', sup:42},
    {id:'chairDesk', nom:'Silla',       fam:'estudio',    xp:0, motivo:'De partida', sup:0},
    {id:'rugRound',  nom:'Alfombra',    fam:'alfombra',   xp:0, motivo:'De partida', sup:0, plano:true}
  ];

  var FAMILIAS = [
    { id:'todo',       nom:'Todo' },
    { id:'dormitorio', nom:'Dormitorio' },
    { id:'estudio',    nom:'Estudio' },
    { id:'living',     nom:'Living' },
    { id:'alfombra',   nom:'Alfombras' },
    { id:'deco',       nom:'Decoración' },
    { id:'cocina',     nom:'Cocina' },
    { id:'baño',       nom:'Baño' }
  ];
  // Objetos que van colgados del muro, no apoyados en el piso. En Habbo son los
  // "wallitems": el cuadro no se pone en una baldosa, se cuelga.
  var DE_PARED = {
    bathroomMirror:1, coatRack:1, lampSquareCeiling:1,
    kitchenCabinetUpper:1, kitchenCabinetUpperCorner:1,
    kitchenCabinetUpperDouble:1, kitchenCabinetUpperLow:1
  };
  var POR_ID = {}; CATALOGO.forEach(function (m) { POR_ID[m.id] = m; });
  function ficha(id) { return POR_ID[id] || { sup: 0 }; }
  function esDePared(id) { return !!DE_PARED[String(id).split('__')[0]]; }

  var RANURAS = 5, NIVELES = 2;   // por muro

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
  // ---------------- muro: geometría y objetos colgados ----------------
  function esquinas() {
    var n = celda(0, 0), e = celda(COLS - 1, 0), w = celda(0, FILAS - 1);
    return {
      N: { x: n.x + TW / 2, y: n.y },
      E: { x: e.x + TW, y: e.y + ROMBO / 2 },
      W: { x: w.x, y: w.y + ROMBO / 2 }
    };
  }
  // Punto donde se cuelga un objeto: a lo largo del muro y a cierta altura.
  function puntoMuro(pared, pos, nivel) {
    var q = esquinas();
    var a = pared === 'izq' ? q.W : q.N;
    var b = pared === 'izq' ? q.N : q.E;
    var t = (pos + 0.5) / RANURAS;
    return {
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t - (46 + nivel * 44)
    };
  }
  function pintarColgado(m) {
    var im = imgs[m.id + '_' + (m.pared === 'izq' ? 'SW' : 'SE')];
    if (!im || !im.complete || !im.naturalWidth) return null;
    var p = puntoMuro(m.pared, m.pos, m.nivel);
    var x = p.x - im.naturalWidth / 2, y = p.y - im.naturalHeight / 2;
    S.cx.drawImage(im, x, y);
    return { x: x, y: y, w: im.naturalWidth, h: im.naturalHeight };
  }
  // De un punto del lienzo saca la ranura de muro más cercana, si está cerca.
  function ranuraEn(px, py) {
    var mejor = null, dm = 46;
    ['izq', 'der'].forEach(function (pared) {
      for (var pos = 0; pos < RANURAS; pos++) for (var niv = 0; niv < NIVELES; niv++) {
        var p = puntoMuro(pared, pos, niv);
        var d = Math.hypot(p.x - px, p.y - py);
        if (d < dm) { dm = d; mejor = { pared: pared, pos: pos, nivel: niv }; }
      }
    });
    return mejor;
  }
  function ranuraOcupada(r, salvo) {
    return S.pieza.some(function (m, i) {
      return i !== salvo && m.pared === r.pared && m.pos === r.pos && m.nivel === r.nivel;
    });
  }

  function pintarPersonaje() {
    // Durante la caminata la posición es fraccionaria, entre dos baldosas.
    var p = celda(S.av.col, S.av.fila);
    global.AvatarLookSystem.pintar(S.cx, p.x + TW / 2, p.y + 53 + 16, S.look, 0.62);
  }

  // ---------------- caminar ----------------
  // Como en Habbo: se toca una baldosa libre y el personaje camina hasta ella,
  // rodeando los muebles en vez de atravesarlos.
  function bloqueada(col, fila) {
    return S.pieza.some(function (m) {
      if (m.col !== col || m.fila !== fila) return false;
      var f = ficha(m.id);
      return !f.plano && !m.sobre;      // se puede pisar una alfombra
    });
  }
  function ruta(desde, hasta) {
    if (bloqueada(hasta.col, hasta.fila)) return null;
    var clave = function (c, f) { return c + ',' + f; };
    var cola = [{ col: desde.col, fila: desde.fila }];
    var previo = {}; previo[clave(desde.col, desde.fila)] = null;
    var pasos = [[1,0],[-1,0],[0,1],[0,-1]];
    while (cola.length) {
      var act = cola.shift();
      if (act.col === hasta.col && act.fila === hasta.fila) {
        var camino = [], k = clave(act.col, act.fila);
        while (k) {
          var par = k.split(',');
          camino.unshift({ col: +par[0], fila: +par[1] });
          k = previo[k];
        }
        return camino;
      }
      for (var i = 0; i < pasos.length; i++) {
        var nc = act.col + pasos[i][0], nf = act.fila + pasos[i][1];
        if (nc < 0 || nc >= COLS || nf < 0 || nf >= FILAS) continue;
        var k2 = clave(nc, nf);
        if (previo.hasOwnProperty(k2) || bloqueada(nc, nf)) continue;
        previo[k2] = clave(act.col, act.fila);
        cola.push({ col: nc, fila: nf });
      }
    }
    return null;
  }
  var caminando = null;
  function caminar(hasta) {
    var camino = ruta({ col: Math.round(S.av.col), fila: Math.round(S.av.fila) }, hasta);
    if (!camino || camino.length < 2) {
      if (!camino) avisar('Por ahí no se puede llegar');
      return;
    }
    if (caminando) cancelAnimationFrame(caminando.id);
    var i = 0, MS = 300, t0 = performance.now();
    function paso(ahora) {
      var avance = Math.min(1, (ahora - t0) / MS);
      var a = camino[i], b = camino[i + 1];
      S.av.col = a.col + (b.col - a.col) * avance;
      S.av.fila = a.fila + (b.fila - a.fila) * avance;
      dibujar();
      if (avance >= 1) {
        i++; t0 = ahora;
        if (i >= camino.length - 1) {
          S.av.col = b.col; S.av.fila = b.fila;
          caminando = null; dibujar(); guardar('personajeEn', S.av);
          return;
        }
      }
      caminando = { id: requestAnimationFrame(paso) };
    }
    caminando = { id: requestAnimationFrame(paso) };
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

    // Lo colgado va contra el muro: se pinta antes que todo lo del piso.
    S.pieza.forEach(function (m, i) {
      if (!m.pared) return;
      var caja = pintarColgado(m);
      if (caja) {
        caja.idx = i; cajas.push(caja);
        if (i === S.sel) {
          cx.save(); cx.strokeStyle = '#38bdf8'; cx.lineWidth = 2; cx.setLineDash([5, 4]);
          cx.strokeRect(caja.x - 2, caja.y - 2, caja.w + 4, caja.h + 4); cx.restore();
        }
      }
    });
    // Ranuras libres, mientras se está colgando algo
    if (S.elegido && esDePared(S.elegido)) {
      cx.save();
      ['izq', 'der'].forEach(function (pared) {
        for (var pos = 0; pos < RANURAS; pos++) for (var niv = 0; niv < NIVELES; niv++) {
          if (ranuraOcupada({ pared: pared, pos: pos, nivel: niv }, -1)) continue;
          var p = puntoMuro(pared, pos, niv);
          cx.beginPath(); cx.arc(p.x, p.y, 13, 0, Math.PI * 2);
          cx.fillStyle = 'rgba(56,189,248,.28)'; cx.fill();
          cx.strokeStyle = 'rgba(56,189,248,.75)'; cx.lineWidth = 1.5; cx.stroke();
        }
      });
      cx.restore();
    }

    function capa(m) { var f = ficha(m.id); return f.plano ? 0 : (m.sobre ? 2 : 1); }
    var orden = S.pieza.filter(function (m) { return !m.pared; })
                       .map(function (m) { return { m: m, i: S.pieza.indexOf(m) }; });
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
      '<button data-p="pieza">Mi casa</button>' +
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
      '<div class="esp-familias" id="espFamilias">' +
        FAMILIAS.map(function (f, i) {
          return '<button data-fam="' + f.id + '"' + (i === 0 ? ' class="on"' : '') + '>' + f.nom + '</button>';
        }).join('') +
      '</div>' +
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
        avisarLook();
        guardar('look', S.look);
      });
    });
  }
  function pintarFigura() {
    global.AvatarLookSystem.render(S.host.querySelector('#espFigura'),
      { look: S.look, xpTotal: S.xp, size: 170 });
  }
  // El personaje también se muestra arriba, junto al nombre: si cambia acá,
  // tiene que cambiar allá en el mismo momento.
  function avisarLook() {
    if (typeof S.alCambiarLook === 'function') S.alCambiarLook(S.look);
  }

  var filtro = 'tengo', familia = 'todo';
  function pintarMuebles() {
    var cont = S.host.querySelector('#espRejilla');
    var lista = CATALOGO.filter(function (m) {
      if (familia !== 'todo' && m.fam !== familia) return false;
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

      // Colgar en el muro
      if (S.elegido && esDePared(S.elegido)) {
        var r = ranuraEn(p.x, p.y);
        if (!r) { avisar('Toca uno de los puntos del muro'); return; }
        if (ranuraOcupada(r, -1)) { avisar('Ahí ya hay algo colgado'); return; }
        S.pieza.push({ id: S.elegido, pared: r.pared, pos: r.pos, nivel: r.nivel });
        S.sel = S.pieza.length - 1; S.elegido = null;
        botones(); pintarMuebles(); dibujar(); guardar('pieza', S.pieza);
        avisar('Colgado en el muro');
        return;
      }
      // Mover algo ya colgado a otra ranura
      if (S.sel >= 0 && S.pieza[S.sel] && S.pieza[S.sel].pared) {
        var r2 = ranuraEn(p.x, p.y);
        if (!r2) { avisar('Toca otro punto del muro'); return; }
        if (ranuraOcupada(r2, S.sel)) { avisar('Ahí ya hay algo colgado'); return; }
        var mp = S.pieza[S.sel];
        mp.pared = r2.pared; mp.pos = r2.pos; mp.nivel = r2.nivel;
        S.sel = -1; botones(); dibujar(); guardar('pieza', S.pieza);
        return;
      }

      var c = aCelda(p.x, p.y);
      // Tocar fuera del piso suelta la selección: si no, no se puede caminar.
      if (c.col < 0 || c.col >= COLS || c.fila < 0 || c.fila >= FILAS) {
        if (S.sel >= 0 || S.elegido) { S.sel = -1; S.elegido = null; botones(); pintarMuebles(); dibujar(); }
        return;
      }
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
        // se suelta al dejarlo: el siguiente toque en el piso hace caminar
        S.sel = -1; botones(); dibujar(); guardar('pieza', S.pieza);
      } else {
        caminar(c);   // baldosa libre y nada seleccionado: el personaje camina
      }
    });
    S.host.querySelector('#espRotar').addEventListener('click', function () {
      if (S.sel < 0) return;
      var m = S.pieza[S.sel];
      if (m.pared) {                       // lo colgado cambia de muro
        m.pared = m.pared === 'izq' ? 'der' : 'izq';
        if (ranuraOcupada(m, S.sel)) { m.pared = m.pared === 'izq' ? 'der' : 'izq'; avisar('El otro muro está ocupado ahí'); return; }
      } else {
        m.dir = DIRS[(DIRS.indexOf(m.dir) + 1) % DIRS.length];
      }
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
    S.xp = cfg.xp || 0; S.alCambiarLook = cfg.alCambiarLook;
    S.look = global.AvatarLookSystem.normalizeLook(cfg.look, { xpTotal: S.xp });
    S.pieza = Array.isArray(cfg.pieza) ? cfg.pieza : [
      { id: 'rugRound', col: 2, fila: 2, dir: 'SE' },
      { id: 'bedSingle', col: 0, fila: 1, dir: 'SE' },
      { id: 'desk', col: 4, fila: 1, dir: 'SW' },
      { id: 'chairDesk', col: 3, fila: 1, dir: 'NE' }
    ];
    S.av = cfg.personajeEn && typeof cfg.personajeEn.col === 'number'
         ? { col: cfg.personajeEn.col, fila: cfg.personajeEn.fila }
         : { col: 2, fila: 3 };
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
    S.host.querySelectorAll('#espFamilias button').forEach(function (b) {
      b.addEventListener('click', function () {
        S.host.querySelectorAll('#espFamilias button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on'); familia = b.dataset.fam; pintarMuebles();
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
