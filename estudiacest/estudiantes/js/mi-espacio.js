/* Mi espacio: personaje, casa, muebles, visitas y chat, en pestañas dentro del panel.
 *
 * Guarda en Firebase, no en el navegador, y cada escritura se relee después:
 * escribir no es haber guardado.
 *
 * Presencia y chat viven en `salas/{uidDueño}`. El cliente solo LEE ese nodo;
 * todo lo que se escribe ahí pasa por api/salas.js, que revisa el mensaje con el
 * filtro de garabatos antes de publicarlo y limita la casa a 30 personas.
 *
 * Uso:  MiEspacio.montar({ host, db, auth, base, uid, curso, xp, look, pieza, personajeEn, alCambiarLook })
 */
(function (global) {
  'use strict';

  // Ruta absoluta: el módulo puede montarse desde páginas de distinta carpeta y
  // con una ruta relativa los sprites se buscarían en el lugar equivocado.
  var RUTA = '/estudiantes/assets/pieza/';
  // Las salas viven dentro de la función estudiantes (Vercel Hobby admite 12
  // funciones y ya están ocupadas): las acciones van con prefijo `salas-`.
  var API = '/api/estudiantes';
  var TW = 151, ROMBO = 106, SX = 75, SY = 53;
  var COLS = 5, FILAS = 5;
  var DIRS = ['SE', 'SW', 'NE', 'NW'];
  var LATIDO_MS = 20000, BURBUJA_MS = 6000;

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

  // Muebles en los que el personaje se puede sentar o acostar: al tocarlos, en
  // vez de rodearlos, camina hasta el lado y se sube.
  var SENTABLES = /^(chair|loungeChair|loungeSofa|bench|stoolBar|bedSingle|bedDouble|bedBunk)/;
  function esSentable(id) { return SENTABLES.test(String(id).split('__')[0]); }

  // Terreno: piso y muros. El piso sale de variantes teñidas del sprite; los
  // muros se dibujan por código, así que basta con una paleta.
  var PISOS = [
    { id:'claro',  nom:'Madera clara', xp:0 },
    { id:'roble',  nom:'Roble',        xp:200 },
    { id:'gris',   nom:'Gris',         xp:200 },
    { id:'azul',   nom:'Azul',         xp:600 },
    { id:'verde',  nom:'Verde',        xp:600 },
    { id:'rosa',   nom:'Rosa',         xp:1000 },
    { id:'morado', nom:'Morado',       xp:1000 },
    { id:'negro',  nom:'Negro',        xp:1800 }
  ];
  var MUROS = [
    { id:'blanco',  nom:'Blanco',  xp:0,    izq:'#cdd6e0', der:'#e3e9f0', canto:'#f4f7fa' },
    { id:'crema',   nom:'Crema',   xp:150,  izq:'#e0d3b8', der:'#efe6d2', canto:'#f8f3e8' },
    { id:'celeste', nom:'Celeste', xp:400,  izq:'#9fc3dc', der:'#c2dcec', canto:'#e2f0f8' },
    { id:'verde',   nom:'Verde',   xp:400,  izq:'#a9c9b4', der:'#c8e0d0', canto:'#e4f1e8' },
    { id:'lila',    nom:'Lila',    xp:800,  izq:'#bdb0d8', der:'#d6cde8', canto:'#ebe6f4' },
    { id:'gris',    nom:'Gris',    xp:800,  izq:'#9aa3ad', der:'#b9c0c8', canto:'#d6dbe0' },
    { id:'rojo',    nom:'Ladrillo',xp:1500, izq:'#b2665c', der:'#c98479', canto:'#e2aea6' },
    { id:'oscuro',  nom:'Noche',   xp:1800, izq:'#3a4557', der:'#4c586c', canto:'#66748a' }
  ];
  function pisoDe(id){ return PISOS.some(function(p){ return p.id===id; }) ? id : 'claro'; }
  function muroDe(id){ for (var i=0;i<MUROS.length;i++) if (MUROS[i].id===id) return MUROS[i]; return MUROS[0]; }

  var S = {};   // estado del módulo

  function esc(t){ return String(t == null ? '' : t).replace(/[&<>"]/g, function(c){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]; }); }
  // ---- nombre visible: primer nombre y primer apellido ----
  // Copia de api/_nombre-visible.js. La auditoría corre las dos con los mismos
  // casos: si se cambia una sin la otra, el build se detiene.
  // Los nombres vienen en orden de nómina, PATERNO MATERNO NOMBRES, y hay
  // apellidos compuestos al comienzo ("DE LA FUENTE"): la tercera palabra no
  // siempre es el nombre.
  var PARTICULAS = { DE:1, DEL:1, LA:1, LAS:1, LOS:1, SAN:1, SANTA:1, VAN:1, VON:1, DA:1, DI:1 };
  var EN_MINUSCULA = { DE:1, DEL:1, LA:1, LAS:1, LOS:1, VAN:1, VON:1, DA:1, DI:1 };
  function capital(p) {
    p = String(p || '').toLowerCase();
    if (EN_MINUSCULA[p.toUpperCase()]) return p;
    return p.replace(/(^|[-'])(\S)/g, function (m, sep, letra) { return sep + letra.toUpperCase(); });
  }
  function tomarApellido(w, i) {
    var ini = i;
    while (i < w.length - 1 && PARTICULAS[w[i].toUpperCase()]) i++;
    return [w.slice(ini, i + 1), i + 1];
  }
  function esDeNomina(n) {
    var letras = String(n || '').replace(/\s+/g, '');
    return !!letras && letras === letras.toUpperCase() && /[A-ZÁÉÍÓÚÑÜ]/.test(letras);
  }
  function nombreVisible(n) {
    var w = String(n || '').trim().split(/\s+/).filter(Boolean);
    if (!w.length) return 'Estudiante';
    if (w.length === 1) return capital(w[0]);
    var pila, apellido;
    if (esDeNomina(n)) {
      var r1 = tomarApellido(w, 0), i = r1[1];
      if (w.length - i >= 2) i = tomarApellido(w, i)[1];
      var nombres = w.slice(i);
      pila = nombres.filter(function (p) { return !PARTICULAS[p.toUpperCase()]; })[0] || nombres[0] || w[w.length - 1];
      apellido = r1[0];
    } else {
      pila = w[0];
      apellido = [w.length >= 3 ? w[w.length - 2] : w[1]];
    }
    return (capital(pila) + ' ' + apellido.map(capital).join(' ')).trim().slice(0, 40);
  }
  // Lo que llega del servidor ya viene como "Nombre Apellido" (y a veces con la
  // inicial del materno para desempatar): se muestra tal cual. Solo se procesa lo
  // que todavía viene en mayúsculas de nómina, de mensajes anteriores al cambio.
  function nombreCorto(n) {
    return esDeNomina(n) ? nombreVisible(n) : (String(n || '').trim() || 'Estudiante');
  }

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
      if (i === salvo || m.pared || m.col !== col || m.fila !== fila) return;
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

  // ---------------- muro: geometría y objetos colgados ----------------
  function esquinas() {
    var n = celda(0, 0), e = celda(COLS - 1, 0), w = celda(0, FILAS - 1);
    return {
      N: { x: n.x + TW / 2, y: n.y },
      E: { x: e.x + TW, y: e.y + ROMBO / 2 },
      W: { x: w.x, y: w.y + ROMBO / 2 }
    };
  }
  function puntoMuro(pared, pos, nivel) {
    var q = esquinas();
    var a = pared === 'izq' ? q.W : q.N;
    var b = pared === 'izq' ? q.N : q.E;
    var t = (pos + 0.5) / RANURAS;
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t - (46 + nivel * 44) };
  }
  function pintarColgado(m) {
    var im = imgs[m.id + '_' + (m.pared === 'izq' ? 'SW' : 'SE')];
    if (!im || !im.complete || !im.naturalWidth) return null;
    var p = puntoMuro(m.pared, m.pos, m.nivel);
    var x = p.x - im.naturalWidth / 2, y = p.y - im.naturalHeight / 2;
    S.cx.drawImage(im, x, y);
    return { x: x, y: y, w: im.naturalWidth, h: im.naturalHeight };
  }
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

  // ---------------- dibujo de la casa ----------------
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
    var cx = S.cx, q = esquinas(), H = 132;
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
    var mu = muroDe(S.casa.muro);
    plano(q.W, q.N, mu.izq, mu.canto);
    plano(q.N, q.E, mu.der, mu.canto);
    var t = 0.55, m = { x: q.N.x + (q.E.x - q.N.x) * t, y: q.N.y + (q.E.y - q.N.y) * t };
    var dx = q.E.x - q.N.x, dy = q.E.y - q.N.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, an = 62;
    cx.beginPath();
    cx.moveTo(m.x, m.y - 74); cx.lineTo(m.x + ux * an, m.y + uy * an - 74);
    cx.lineTo(m.x + ux * an, m.y + uy * an - 22); cx.lineTo(m.x, m.y - 22); cx.closePath();
    cx.fillStyle = '#9fd8ef'; cx.fill();
    cx.strokeStyle = '#fff'; cx.lineWidth = 3; cx.stroke();
  }

  // Un personaje parado en una celda (fraccionaria durante la caminata), con su
  // nombre y, si acaba de hablar, un globo sobre la cabeza.
  function pintarPersona(pers) {
    var cx = S.cx, p = celda(pers.col, pers.fila);
    // Sentado: un poco más arriba, sobre el asiento.
    var cxp = p.x + TW / 2, base = p.y + 53 + 16 - (pers.sentado ? 14 : 0);
    global.AvatarLookSystem.pintar(cx, cxp, base, pers.look, 0.62);
    if (pers.nombre) {
      cx.save();
      cx.font = '700 11px system-ui, sans-serif'; cx.textAlign = 'center';
      var etiqueta = pers.nombre, w = cx.measureText(etiqueta).width + 12;
      cx.fillStyle = pers.esYo ? 'rgba(56,189,248,.92)' : 'rgba(15,23,42,.78)';
      cx.beginPath(); cx.roundRect(cxp - w / 2, base + 6, w, 16, 8); cx.fill();
      cx.fillStyle = pers.esYo ? '#04263a' : '#e8edf5';
      cx.fillText(etiqueta, cxp, base + 18);
      cx.restore();
    }
    var b = S.burbujas[pers.uid];
    if (b && b.hasta > Date.now()) {
      cx.save();
      cx.font = '600 12px system-ui, sans-serif'; cx.textAlign = 'center';
      var texto = b.texto.length > 46 ? b.texto.slice(0, 44) + '…' : b.texto;
      var bw = Math.min(220, cx.measureText(texto).width + 18), bh = 24;
      var bx = cxp - bw / 2, by = base - 94 - bh;
      cx.fillStyle = '#ffffff'; cx.strokeStyle = 'rgba(28,34,44,.55)'; cx.lineWidth = 1.2;
      cx.beginPath(); cx.roundRect(bx, by, bw, bh, 9); cx.fill(); cx.stroke();
      cx.beginPath(); cx.moveTo(cxp - 5, by + bh); cx.lineTo(cxp, by + bh + 7); cx.lineTo(cxp + 5, by + bh); cx.closePath();
      cx.fill(); cx.stroke();
      cx.fillStyle = '#1f2937'; cx.fillText(texto, cxp, by + 16);
      cx.restore();
    }
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

    var idPiso = pisoDe(S.casa.piso);
    var piso = imgs[idPiso === 'claro' ? 'floorFull_SE' : 'floorFull__' + idPiso + '_SE'] || imgs['floorFull_SE'];
    if (piso && piso.complete && piso.naturalWidth) {
      for (var f = 0; f < FILAS; f++) for (var c = 0; c < COLS; c++) {
        var p = celda(c, f); cx.drawImage(piso, p.x, p.y);
      }
    }
    paredes();

    if (S.elegido && S.hover && !esDePared(S.elegido)) {
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
    if (S.elegido && esDePared(S.elegido)) {
      cx.save();
      ['izq', 'der'].forEach(function (pared) {
        for (var pos = 0; pos < RANURAS; pos++) for (var niv = 0; niv < NIVELES; niv++) {
          if (ranuraOcupada({ pared: pared, pos: pos, nivel: niv }, -1)) continue;
          var pm = puntoMuro(pared, pos, niv);
          cx.beginPath(); cx.arc(pm.x, pm.y, 13, 0, Math.PI * 2);
          cx.fillStyle = 'rgba(56,189,248,.28)'; cx.fill();
          cx.strokeStyle = 'rgba(56,189,248,.75)'; cx.lineWidth = 1.5; cx.stroke();
        }
      });
      cx.restore();
    }

    // Las alfombras son piso: van TODAS antes que cualquier cosa con volumen.
    // Si se ordenan por profundidad junto con lo demás, la alfombra de la
    // baldosa de adelante se pinta encima de las piernas del personaje.
    S.pieza.forEach(function (m, i) {
      if (m.pared || !ficha(m.id).plano) return;
      var cajaP = pintarSprite(m.id + '_' + m.dir, m.col, m.fila, 0);
      if (cajaP) {
        cajaP.idx = i; cajas.push(cajaP);
        if (i === S.sel) {
          cx.save(); cx.strokeStyle = '#38bdf8'; cx.lineWidth = 2; cx.setLineDash([5, 4]);
          cx.strokeRect(cajaP.x - 2, cajaP.y - 2, cajaP.w + 4, cajaP.h + 4); cx.restore();
        }
      }
    });

    // Muebles con volumen y personas, en una sola lista ordenada por
    // profundidad: si no, alguien parado detrás del sofá se dibuja delante.
    // Quien está sentado se pinta justo después de su silla.
    var cosas = [];
    S.pieza.forEach(function (m, i) {
      if (m.pared || ficha(m.id).plano) return;
      cosas.push({ tipo: 'mueble', prof: m.col + m.fila, capa: m.sobre ? 2 : 1, m: m, i: i });
    });
    personas().forEach(function (pe) {
      var sentado = pe.sentado ? 0.03 : 0.01;
      cosas.push({ tipo: 'persona', prof: pe.col + pe.fila + sentado, capa: 1, pe: pe });
    });
    cosas.sort(function (a, b) { return (a.prof - b.prof) || (a.capa - b.capa); });

    cosas.forEach(function (o) {
      if (o.tipo === 'persona') { pintarPersona(o.pe); return; }
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
    cx.restore();
  }

  // Yo más los demás presentes en la sala, sin duplicarme.
  function sentableEn(col, fila) {
    return S.pieza.some(function (m) { return !m.pared && m.col === col && m.fila === fila && esSentable(m.id); });
  }
  function personas() {
    var lista = [{ uid: S.uid, look: S.look, col: S.av.col, fila: S.av.fila, nombre: S.miNombre, esYo: true,
                   sentado: !caminando && sentableEn(Math.round(S.av.col), Math.round(S.av.fila)) }];
    Object.keys(S.otros).forEach(function (uid) {
      if (uid === S.uid) return;
      var o = S.otros[uid], c = Number(o.col) || 0, f = Number(o.fila) || 0;
      lista.push({ uid: uid, look: global.AvatarLookSystem.normalizeLook(o.look, { xpTotal: 99999 }),
                   col: c, fila: f, nombre: nombreCorto(o.nombre), esYo: false, sentado: sentableEn(c, f) });
    });
    return lista;
  }

  // ---------------- caminar ----------------
  function bloqueada(col, fila) {
    return S.pieza.some(function (m) {
      if (m.pared || m.col !== col || m.fila !== fila) return false;
      var f = ficha(m.id);
      return !f.plano && !m.sobre;
    });
  }
  function ruta(desde, hasta) {
    // Un asiento se puede elegir como destino: la ruta llega hasta un vecino
    // libre y el último paso es subirse.
    var asiento = sentableEn(hasta.col, hasta.fila);
    if (bloqueada(hasta.col, hasta.fila) && !asiento) return null;
    if (asiento) {
      var vecinos = [[1,0],[-1,0],[0,1],[0,-1]].map(function (d) { return { col: hasta.col + d[0], fila: hasta.fila + d[1] }; })
        .filter(function (v) { return v.col >= 0 && v.col < COLS && v.fila >= 0 && v.fila < FILAS && !bloqueada(v.col, v.fila); });
      var mejor = null;
      vecinos.forEach(function (v) {
        var r = (v.col === desde.col && v.fila === desde.fila) ? [v] : ruta(desde, v);
        if (r && (!mejor || r.length < mejor.length)) mejor = r;
      });
      return mejor ? mejor.concat([{ col: hasta.col, fila: hasta.fila }]) : null;
    }
    var clave = function (c, f) { return c + ',' + f; };
    var cola = [{ col: desde.col, fila: desde.fila }];
    var previo = {}; previo[clave(desde.col, desde.fila)] = null;
    var pasos = [[1,0],[-1,0],[0,1],[0,-1]];
    while (cola.length) {
      var act = cola.shift();
      if (act.col === hasta.col && act.fila === hasta.fila) {
        var camino = [], k = clave(act.col, act.fila);
        while (k) { var par = k.split(','); camino.unshift({ col: +par[0], fila: +par[1] }); k = previo[k]; }
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
    if (hasta.col < 0 || hasta.col >= COLS || hasta.fila < 0 || hasta.fila >= FILAS) return;
    var camino = ruta({ col: Math.round(S.av.col), fila: Math.round(S.av.fila) }, hasta);
    if (!camino || camino.length < 2) { if (!camino) avisar('Por ahí no se puede llegar'); return; }
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
          caminando = null; dibujar();
          if (!S.visitando) guardar('personajeEn', S.av);
          latido();                       // los demás me ven llegar
          return;
        }
      }
      caminando = { id: requestAnimationFrame(paso) };
    }
    caminando = { id: requestAnimationFrame(paso) };
  }

  // ---------------- guardado ----------------
  var pendiente = null;
  function guardar(campo, valor) {
    if (!S.db || !S.uid) return;
    clearTimeout(pendiente);
    pendiente = setTimeout(function () {
      var ref = S.db.ref(S.base + '/avatar/' + S.uid + '/' + campo);
      ref.set(valor).then(function () {
        return ref.once('value');   // releer: escribir no es haber guardado
      }).then(function (snap) {
        var ok = snap.exists();
        marcarEstado(ok ? 'Guardado' : 'No se pudo guardar', !ok);
      }).catch(function () { marcarEstado('No se pudo guardar', true); });
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
    el._t = setTimeout(function () { el.style.opacity = 0; }, 2600);
  }

  // ---------------- salas: presencia y chat ----------------
  function api(action, cuerpo, keepalive) {
    if (!S.auth || !S.auth.currentUser) return Promise.reject(new Error('sin sesión'));
    return S.auth.currentUser.getIdToken().then(function (token) {
      return fetch(API, {
        method: 'POST', keepalive: !!keepalive,
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify(Object.assign({ action: 'salas-' + action }, cuerpo || {}))
      });
    }).then(function (r) { return r.json(); });
  }

  var latidoTimer = null, burbujaTimer = null;
  function latido() {
    if (!S.sala) return;
    api('latido', { sala: S.sala, col: Math.round(S.av.col), fila: Math.round(S.av.fila), look: S.look })
      .then(function (r) { if (r && r.fuera) conectarSala(S.sala, true); })
      .catch(function () {});
  }

  function desconectarSala() {
    if (S.refPresentes) S.refPresentes.off();
    if (S.refChat) S.refChat.off();
    S.refPresentes = S.refChat = null;
    clearInterval(latidoTimer); latidoTimer = null;
    clearInterval(burbujaTimer); burbujaTimer = null;
    if (S.sala) api('salir', { sala: S.sala }, true).catch(function () {});
    S.sala = null; S.otros = {}; S.burbujas = {};
  }

  function conectarSala(sala, silencioso) {
    return api('entrar', { sala: sala, look: S.look, col: Math.round(S.av.col), fila: Math.round(S.av.fila) })
      .then(function (r) {
        if (!r || !r.ok) {
          avisar((r && r.error) || 'No se pudo entrar');
          return false;
        }
        S.sala = sala; S.otros = {}; S.burbujas = {};
        // El servidor devuelve cómo te ven los demás (con desempate si hace falta)
        if (r.yo) S.miNombre = r.yo;
        S.refPresentes = S.db.ref(S.base + '/salas/' + sala + '/presentes');
        S.refPresentes.on('value', function (snap) {
          S.otros = snap.val() || {};
          pintarCabecera(); dibujar();
        });
        S.refChat = S.db.ref(S.base + '/salas/' + sala + '/chat').orderByChild('ts').limitToLast(40);
        var desde = Date.now() - 2000;
        S.refChat.on('child_added', function (snap) {
          var m = snap.val(); if (!m) return;
          agregarMensaje(m);
          if (Number(m.ts) >= desde) {
            S.burbujas[m.uid] = { texto: m.texto, hasta: Number(m.ts) + BURBUJA_MS };
            dibujar();
          }
        });
        S.host.querySelector('#espChatLista').innerHTML = '';
        latidoTimer = setInterval(latido, LATIDO_MS);
        burbujaTimer = setInterval(function () {
          var hay = Object.keys(S.burbujas).some(function (u) { return S.burbujas[u].hasta > Date.now(); });
          if (hay) dibujar();
        }, 400);
        if (!silencioso) avisar(sala === S.uid ? 'Estás en tu casa' : 'Llegaste de visita');
        pintarCabecera();
        return true;
      })
      .catch(function () { avisar('Sin conexión con la sala'); return false; });
  }

  function agregarMensaje(m) {
    var lista = S.host.querySelector('#espChatLista');
    if (!lista) return;
    var div = document.createElement('div');
    div.className = 'esp-msg' + (m.uid === S.uid ? ' mio' : '');
    div.innerHTML = '<b>' + esc(nombreCorto(m.nombre)) + '</b> ' + esc(m.texto);
    lista.appendChild(div);
    while (lista.children.length > 60) lista.removeChild(lista.firstChild);
    lista.scrollTop = lista.scrollHeight;
  }

  function decir(texto) {
    texto = String(texto || '').trim();
    if (!texto || !S.sala) return;
    var input = S.host.querySelector('#espChatTexto');
    input.disabled = true;
    api('decir', { sala: S.sala, texto: texto }).then(function (r) {
      input.disabled = false;
      if (r && r.ok) { input.value = ''; input.focus(); return; }
      avisar((r && r.error) || 'No se pudo enviar');
      if (r && r.bloqueado) { input.classList.add('mal'); setTimeout(function () { input.classList.remove('mal'); }, 900); }
    }).catch(function () { input.disabled = false; avisar('No se pudo enviar'); });
  }

  // ---------------- visitas ----------------
  function pintarCabecera() {
    var cab = S.host.querySelector('#espSalaCab');
    if (!cab) return;
    var n = Object.keys(S.otros || {}).length;
    var titulo = S.visitando ? 'Casa de ' + esc(nombreCorto(S.duenoNombre)) : 'Mi casa';
    cab.innerHTML = '<span class="esp-sala-tit">' + titulo + '</span>' +
      '<span class="esp-sala-n">' + n + ' ' + (n === 1 ? 'persona' : 'personas') + '</span>' +
      (S.visitando
        ? '<button class="esp-btn-chico" id="espVolver">Volver a mi casa</button>'
        : '<button class="esp-btn-chico" id="espVisitar">Visitar</button>');
    var bv = cab.querySelector('#espVisitar'), bb = cab.querySelector('#espVolver');
    if (bv) bv.addEventListener('click', abrirVisitas);
    if (bb) bb.addEventListener('click', function () { irACasa(S.uid); });
  }

  function abrirVisitas() {
    var panel = S.host.querySelector('#espVisitas');
    panel.hidden = false;
    panel.innerHTML = '<div class="esp-vis-cab"><b>¿A quién visitas?</b><button class="esp-btn-chico" id="espCerrarVis">Cerrar</button></div><div class="esp-vis-lista">Buscando compañeros…</div>';
    panel.querySelector('#espCerrarVis').addEventListener('click', function () { panel.hidden = true; });
    // La lista la arma el servidor: el navegador no descarga perfiles ajenos,
    // que traen el RUT. Llega solo "Nombre Apellido" y cuántos hay en cada casa.
    api('lista').then(function (r) {
      var cont = panel.querySelector('.esp-vis-lista');
      if (!r || !r.ok) { cont.textContent = (r && r.error) || 'No se pudo cargar la lista.'; return; }
      var filas = r.casas || [];
      if (!filas.length) { cont.textContent = 'Todavía no hay compañeros de tu curso registrados.'; return; }
      var tope = r.tope || 30;
      cont.innerHTML = filas.map(function (f) {
        var lleno = f.n >= tope;
        return '<button class="esp-vis-item" data-uid="' + esc(f.uid) + '" data-nombre="' + esc(f.nombre) + '"' +
          (lleno ? ' disabled' : '') + '><span>' + esc(f.nombre) + '</span>' +
          '<em>' + (lleno ? 'llena' : (f.n ? f.n + ' en casa' : 'vacía')) + '</em></button>';
      }).join('');
      cont.querySelectorAll('.esp-vis-item').forEach(function (b) {
        b.addEventListener('click', function () { panel.hidden = true; irACasa(b.dataset.uid, b.dataset.nombre); });
      });
    }).catch(function () { panel.querySelector('.esp-vis-lista').textContent = 'No se pudo cargar la lista.'; });
  }

  // El nombre del dueño viene de la lista del servidor: no se lee su perfil,
  // que trae el RUT.
  function irACasa(uid, nombreDueno) {
    if (uid === S.sala) return;
    var esMia = uid === S.uid;
    var cargar = esMia
      ? Promise.resolve({ pieza: S.miPieza, nombre: S.miNombre, casa: S.miCasa })
      : S.db.ref(S.base + '/avatar/' + uid).once('value')
          .then(function (snap) { var av = snap.val() || {}; return { pieza: av.pieza, nombre: nombreDueno || 'un compañero', casa: av.casa }; });
    cargar.then(function (d) {
      desconectarSala();
      S.visitando = !esMia;
      S.duenoNombre = d.nombre || '';
      S.casa = (d.casa && typeof d.casa === 'object') ? d.casa : { piso: 'claro', muro: 'blanco' };
      S.host.querySelector('#espTerreno').hidden = !esMia;
      S.host.querySelector('#espPaleta').hidden = true;
      S.pieza = esMia ? S.miPieza : (Array.isArray(d.pieza) ? d.pieza : []);
      S.sel = -1; S.elegido = null; S.hover = null;
      if (esMia) S.av = { col: S.miAv.col, fila: S.miAv.fila }; else S.av = { col: 2, fila: 4 };
      S.host.querySelector('.esp-acciones').hidden = !esMia;
      S.host.querySelector('.esp-tabs button[data-p="muebles"]').hidden = !esMia;
      S.pieza.forEach(function (m) { DIRS.forEach(function (d2) { cargar_(m.id + '_' + d2); }); });
      botones(); pintarMuebles(); dibujar();
      return conectarSala(uid);
    }).then(function (ok) {
      if (ok === false && !esMia) irACasa(S.uid);   // llena o caída: de vuelta a la mía
    }).catch(function () { avisar('No se pudo entrar a esa casa'); });
  }
  function cargar_(n) { cargar(n, dibujar); }

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
      '<div class="esp-sala-cab" id="espSalaCab"></div>' +
      '<div class="esp-escena"><canvas id="espLienzo" tabindex="0" aria-label="Tu casa. Flechas para moverte, Tab para elegir un mueble."></canvas>' +
        '<div class="esp-acciones">' +
          '<button id="espAnt" title="Mueble anterior (Mayús+Tab)">◀</button>' +
          '<button id="espSig" title="Mueble siguiente (Tab)">▶</button>' +
          '<button id="espRotar" title="Girar (R)" disabled>⟳</button>' +
          '<button id="espQuitar" title="Guardar en el cajón (Supr)" disabled>✕</button>' +
          '<button id="espSoltar" title="Soltar (Esc)" disabled>✓</button>' +
        '</div>' +
        '<div class="esp-terreno" id="espTerreno">' +
          '<button data-t="piso" title="Cambiar piso">Piso</button>' +
          '<button data-t="muro" title="Cambiar muros">Muros</button>' +
        '</div>' +
        '<div class="esp-pad" aria-label="Moverse">' +
          '<button data-k="ArrowUp" title="Arriba">▲</button>' +
          '<button data-k="ArrowLeft" title="Izquierda">◀</button>' +
          '<button data-k="ArrowRight" title="Derecha">▶</button>' +
          '<button data-k="ArrowDown" title="Abajo">▼</button>' +
        '</div>' +
        '<div class="esp-visitas" id="espVisitas" hidden></div>' +
        '<div class="esp-visitas esp-paleta" id="espPaleta" hidden></div>' +
        '<div class="esp-aviso"></div>' +
      '</div>' +
      '<div class="esp-ayuda">Flechas o WASD: caminar · Tab: elegir mueble · con un mueble elegido, las flechas lo mueven · R gira · Supr guarda · Esc suelta</div>' +
      '<div class="esp-chat">' +
        '<div class="esp-chat-lista" id="espChatLista"></div>' +
        '<form class="esp-chat-form" id="espChatForm" autocomplete="off">' +
          '<input id="espChatTexto" maxlength="200" placeholder="Escribe algo… (sin garabatos)">' +
          '<button type="submit">Decir</button>' +
        '</form>' +
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
          var muestra = o.color ? '<i style="background:' + o.color + '"></i>' : '<span>' + esc(o.name) + '</span>';
          return '<button class="esp-op' + sel + blo + '" data-cat="' + c.id + '" data-op="' + o.id + '"' +
                 ' title="' + (o.locked ? 'Se abre con ' + o.minXp + ' XP' : esc(o.name)) + '">' +
                 muestra + (o.locked ? '<b>🔒</b>' : '') + '</button>';
        }).join('') + '</div></div>';
    }).join('');
    cont.querySelectorAll('.esp-op').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.classList.contains('blo')) { marcarEstado('Todavía bloqueado', true); return; }
        S.look[b.dataset.cat] = b.dataset.op;
        pintarFigura(); pintarRopero(); dibujar();
        avisarLook();
        guardar('look', S.look);
        latido();
      });
    });
  }
  function pintarFigura() {
    global.AvatarLookSystem.render(S.host.querySelector('#espFigura'), { look: S.look, xpTotal: S.xp, size: 170 });
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
      var n = S.miPieza.filter(function (p) { return p.id === m.id; }).length;
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
        if (S.visitando) { avisar('Los muebles se ponen en tu casa'); return; }
        S.elegido = (S.elegido === m.id) ? null : m.id;
        S.sel = -1; botones(); pintarMuebles();
        if (S.elegido) { verPanel('pieza'); avisar(esDePared(S.elegido) ? 'Toca un punto del muro' : 'Ahora toca una baldosa del piso'); }
        dibujar();
      });
    });
  }

  function botones() {
    S.host.querySelector('#espRotar').disabled = S.sel < 0;
    S.host.querySelector('#espQuitar').disabled = S.sel < 0;
    S.host.querySelector('#espSoltar').disabled = S.sel < 0 && !S.elegido;
  }

  // ---------------- teclado y pad: sin mouse ----------------
  // Las flechas van en dirección de pantalla: arriba es hacia el rincón, abajo
  // hacia el frente. Cada pulsación es una baldosa en diagonal de la grilla.
  var PASO_TECLA = { ArrowUp:[-1,-1], ArrowDown:[1,1], ArrowLeft:[-1,1], ArrowRight:[1,-1],
                     w:[-1,-1], s:[1,1], a:[-1,1], d:[1,-1] };
  function elegirMueble(delta) {
    if (S.visitando) return;
    var n = S.pieza.length; if (!n) return;
    S.elegido = null;
    S.sel = S.sel < 0 ? (delta > 0 ? 0 : n - 1) : (S.sel + delta + n) % n;
    botones(); dibujar();
    var m = S.pieza[S.sel]; avisar(ficha(m.id).nom || m.id);
  }
  function soltar() {
    if (S.sel < 0 && !S.elegido) return;
    S.sel = -1; S.elegido = null; S.hover = null;
    botones(); pintarMuebles(); dibujar();
  }
  function moverSeleccion(dc, df) {
    var m = S.pieza[S.sel]; if (!m) return;
    if (m.pared) {                                  // por el muro: pos y nivel
      var r = { pared: m.pared, pos: m.pos + (dc === df ? 0 : (dc > 0 ? 1 : -1)), nivel: m.nivel + (dc === df ? (dc < 0 ? 1 : -1) : 0) };
      if (r.pos < 0 || r.pos >= RANURAS || r.nivel < 0 || r.nivel >= NIVELES) return;
      if (ranuraOcupada(r, S.sel)) { avisar('Ahí ya hay algo colgado'); return; }
      m.pos = r.pos; m.nivel = r.nivel;
    } else {
      var c = m.col + dc, f = m.fila + df;
      if (c < 0 || c >= COLS || f < 0 || f >= FILAS) return;
      var no = estorbo(m.id, c, f, S.sel);
      if (no) { avisar(no); return; }
      var oc = ocupacion(c, f, S.sel);
      m.col = c; m.fila = f; m.sobre = oc.base >= 0 && !!ficha(m.id).apila;
    }
    dibujar(); guardar('pieza', S.pieza);
  }
  function tecla(k, ev) {
    if (k === 'Tab') { if (ev) ev.preventDefault(); elegirMueble(ev && ev.shiftKey ? -1 : 1); return; }
    if (k === 'Escape') { soltar(); return; }
    if ((k === 'r' || k === 'R') && S.sel >= 0) { S.host.querySelector('#espRotar').click(); return; }
    if ((k === 'Delete' || k === 'Backspace') && S.sel >= 0) { if (ev) ev.preventDefault(); S.host.querySelector('#espQuitar').click(); return; }
    var paso = PASO_TECLA[k] || PASO_TECLA[String(k).toLowerCase()];
    if (!paso) return;
    if (ev) ev.preventDefault();
    if (S.sel >= 0 && !S.visitando) { moverSeleccion(paso[0], paso[1]); return; }
    var c = Math.round(S.av.col) + paso[0], f = Math.round(S.av.fila) + paso[1];
    // En diagonal de pantalla se cruzan dos baldosas; si el destino se sale,
    // se prueba media diagonal para no quedarse pegado en los bordes.
    if (c < 0 || c >= COLS || f < 0 || f >= FILAS) {
      var c2 = Math.round(S.av.col) + (paso[0] !== 0 ? paso[0] : 0), f2 = Math.round(S.av.fila);
      if (c2 < 0 || c2 >= COLS) { c2 = Math.round(S.av.col); f2 = Math.round(S.av.fila) + paso[1]; }
      c = c2; f = f2;
    }
    caminar({ col: c, fila: f });
  }
  function conectarTeclado() {
    S.cv.addEventListener('keydown', function (ev) { tecla(ev.key, ev); });
    S.host.querySelectorAll('.esp-pad button').forEach(function (b) {
      b.addEventListener('click', function () { tecla(b.dataset.k, null); S.cv.focus(); });
    });
    S.host.querySelector('#espAnt').addEventListener('click', function () { elegirMueble(-1); S.cv.focus(); });
    S.host.querySelector('#espSig').addEventListener('click', function () { elegirMueble(1); S.cv.focus(); });
    S.host.querySelector('#espSoltar').addEventListener('click', function () { soltar(); S.cv.focus(); });
    S.cv.addEventListener('pointerdown', function () { S.cv.focus({ preventScroll: true }); });
  }

  // ---------------- terreno: piso y muros ----------------
  function abrirPaleta(tipo) {
    if (S.visitando) { avisar('El terreno se cambia en tu casa'); return; }
    var panel = S.host.querySelector('#espPaleta');
    var lista = tipo === 'piso' ? PISOS : MUROS;
    var actual = tipo === 'piso' ? pisoDe(S.casa.piso) : muroDe(S.casa.muro).id;
    panel.hidden = false;
    panel.innerHTML = '<div class="esp-vis-cab"><b>' + (tipo === 'piso' ? 'Piso' : 'Muros') + '</b><button class="esp-btn-chico" id="espCerrarPal">Cerrar</button></div>' +
      '<div class="esp-vis-lista">' + lista.map(function (o) {
        var blo = S.xp < o.xp;
        var muestra = tipo === 'piso'
          ? '<img src="' + RUTA + (o.id === 'claro' ? 'floorFull_SE' : 'floorFull__' + o.id + '_SE') + '.png" alt="">'
          : '<i style="background:linear-gradient(90deg,' + o.izq + ',' + o.der + ')"></i>';
        return '<button class="esp-vis-item' + (blo ? ' blo' : '') + (o.id === actual ? ' sel' : '') + '" data-id="' + o.id + '">' +
          muestra + '<span>' + esc(o.nom) + '</span><em>' + (blo ? o.xp + ' XP' : (o.id === actual ? 'actual' : '')) + '</em></button>';
      }).join('') + '</div>';
    panel.querySelector('#espCerrarPal').addEventListener('click', function () { panel.hidden = true; });
    panel.querySelectorAll('.esp-vis-item').forEach(function (b) {
      b.addEventListener('click', function () {
        var o = lista.filter(function (x) { return x.id === b.dataset.id; })[0];
        if (!o) return;
        if (S.xp < o.xp) { avisar('Se abre con ' + o.xp + ' XP'); return; }
        S.casa[tipo] = o.id; S.miCasa = S.casa;
        panel.hidden = true; dibujar(); guardar('casa', S.casa);
      });
    });
  }
  function verPanel(cual) {
    S.host.querySelectorAll('.esp-panel').forEach(function (p) { p.classList.toggle('oculto', p.dataset.panel !== cual); });
    S.host.querySelectorAll('.esp-tabs button').forEach(function (b) { b.classList.toggle('on', b.dataset.p === cual); });
    if (cual === 'pieza') setTimeout(dibujar, 40);
  }

  function punto(ev) {
    var r = S.cv.getBoundingClientRect();
    var t = (ev.touches && ev.touches[0]) || ev;
    var W = S.cv.clientWidth, H = S.cv.clientHeight, z = S.zoom || 1;
    return { x: (t.clientX - r.left - W / 2) / z + W / 2, y: (t.clientY - r.top - H / 2) / z + H / 2 };
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
      var p = punto(ev);
      // De visita solo se camina: la casa es de otro.
      if (S.visitando) {
        var cv = aCelda(p.x, p.y);
        if (cv.col >= 0 && cv.col < COLS && cv.fila >= 0 && cv.fila < FILAS) caminar(cv);
        return;
      }
      var idx = muebleEn(p.x, p.y);
      if (idx >= 0 && !S.elegido) { S.sel = (S.sel === idx) ? -1 : idx; botones(); dibujar(); return; }

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
        S.pieza.push({ id: S.elegido, col: c.col, fila: c.fila, dir: 'SE', sobre: oc.base >= 0 && !!ficha(S.elegido).apila });
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
        caminar(c);
      }
    });
    S.host.querySelector('#espRotar').addEventListener('click', function () {
      if (S.sel < 0 || S.visitando) return;
      var m = S.pieza[S.sel];
      if (m.pared) {
        m.pared = m.pared === 'izq' ? 'der' : 'izq';
        if (ranuraOcupada(m, S.sel)) { m.pared = m.pared === 'izq' ? 'der' : 'izq'; avisar('El otro muro está ocupado ahí'); return; }
      } else {
        m.dir = DIRS[(DIRS.indexOf(m.dir) + 1) % DIRS.length];
      }
      dibujar(); guardar('pieza', S.pieza);
    });
    S.host.querySelector('#espQuitar').addEventListener('click', function () {
      if (S.sel < 0 || S.visitando) return;
      S.pieza.splice(S.sel, 1); S.sel = -1;
      botones(); pintarMuebles(); dibujar(); guardar('pieza', S.pieza);
      avisar('Guardado en el cajón');
    });
    S.host.querySelector('#espChatForm').addEventListener('submit', function (ev) {
      ev.preventDefault();
      decir(S.host.querySelector('#espChatTexto').value);
    });
    S.host.querySelectorAll('#espTerreno button').forEach(function (b) {
      b.addEventListener('click', function () { abrirPaleta(b.dataset.t); });
    });
    conectarTeclado();
  }

  function montar(cfg) {
    S.host = cfg.host; S.db = cfg.db; S.auth = cfg.auth; S.base = cfg.base; S.uid = cfg.uid;
    S.curso = cfg.curso || ''; S.miNombre = nombreCorto(cfg.nombre || '');
    S.xp = cfg.xp || 0; S.alCambiarLook = cfg.alCambiarLook;
    S.look = global.AvatarLookSystem.normalizeLook(cfg.look, { xpTotal: S.xp });
    S.miPieza = Array.isArray(cfg.pieza) ? cfg.pieza : [
      { id: 'rugRound', col: 2, fila: 2, dir: 'SE' },
      { id: 'bedSingle', col: 0, fila: 1, dir: 'SE' },
      { id: 'desk', col: 4, fila: 1, dir: 'SW' },
      { id: 'chairDesk', col: 3, fila: 1, dir: 'NE' }
    ];
    S.pieza = S.miPieza;
    S.miAv = cfg.personajeEn && typeof cfg.personajeEn.col === 'number'
           ? { col: cfg.personajeEn.col, fila: cfg.personajeEn.fila } : { col: 2, fila: 3 };
    S.av = { col: S.miAv.col, fila: S.miAv.fila };
    S.miCasa = (cfg.casa && typeof cfg.casa === 'object') ? cfg.casa : { piso: 'claro', muro: 'blanco' };
    S.casa = S.miCasa;
    S.sel = -1; S.elegido = null; S.hover = null;
    S.visitando = false; S.sala = null; S.otros = {}; S.burbujas = {};

    S.host.innerHTML = plantilla();
    S.cv = S.host.querySelector('#espLienzo');
    S.cx = S.cv.getContext('2d');
    PISOS.forEach(function (p) { if (p.id !== 'claro') cargar('floorFull__' + p.id + '_SE', dibujar); });

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
      pintarFigura(); pintarRopero(); dibujar(); avisarLook(); guardar('look', S.look); latido();
    });

    ['floorFull_SE'].forEach(function (n) { cargar(n, dibujar); });
    CATALOGO.forEach(function (m) { DIRS.forEach(function (d) { cargar(m.id + '_' + d, dibujar); }); });

    pintarFigura(); pintarRopero(); pintarMuebles(); botones(); conectarLienzo(); pintarCabecera();
    global.addEventListener('resize', dibujar);
    global.addEventListener('pagehide', desconectarSala);
    setTimeout(dibujar, 80);

    // Entro a mi propia casa apenas se monta: así los que vengan me ven ahí.
    if (S.auth && S.db) conectarSala(S.uid, true);
  }

  global.MiEspacio = { montar: montar, CATALOGO: CATALOGO, PISOS: PISOS, MUROS: MUROS,
                       nombreVisible: nombreVisible, nombreCorto: nombreCorto };
})(window);
