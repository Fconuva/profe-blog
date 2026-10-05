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
  var TAMANOS = [
    { id: '5x5', nom: 'Habitación 5 × 5', cols: 5, filas: 5, xp: 0 },
    { id: '7x7', nom: 'Salón 7 × 7', cols: 7, filas: 7, xp: 0 }
  ];
  if (global.MapasCasa && global.MapasCasa.obtener('salon-l')) {
    TAMANOS.push({ id: 'salon-l', nom: 'Salón en L 7 × 7', cols: 7, filas: 7, xp: 0 });
  }
  ['9x7','9x9','11x11','salon-l-grande'].forEach(function (id) {
    var mapa = global.MapasCasa && global.MapasCasa.obtener(id);
    if (mapa) TAMANOS.push({id:id, nom:id === 'salon-l-grande' ? 'Salón en L 9 × 9' :
      (id === '9x7' ? 'Salón rectangular 9 × 7' : 'Salón ' + mapa.cols + ' × ' + mapa.filas), cols:mapa.cols, filas:mapa.filas, xp:0});
  });
  function tamanoDe(id) { return TAMANOS.filter(function (t) { return t.id === id; })[0] || TAMANOS[0]; }
  function sueloEn(t, col, fila) {
    if (!Number.isInteger(col) || !Number.isInteger(fila) || col < 0 || col >= t.cols || fila < 0 || fila >= t.filas) return false;
    return !(global.MapasCasa && global.MapasCasa.obtener(t.id)) || global.MapasCasa.haySuelo(t.id, col, fila);
  }
  function haySuelo(col, fila) { return sueloEn(tamanoDe(S.casa && S.casa.tamano), col, fila); }
  function entrada() {
    return S.mapa ? { col: S.mapa.entrada.col, fila: S.mapa.entrada.fila } :
      { col: Math.min(2, COLS - 1), fila: Math.min(3, FILAS - 1) };
  }
  function aplicarTamano() {
    var t = tamanoDe(S.casa && S.casa.tamano);
    COLS = t.cols; FILAS = t.filas;
    S.mapa = global.MapasCasa ? global.MapasCasa.obtener(t.id) : null;
  }
  var DIRS = ['SE', 'SW', 'NE', 'NW'];
  var LATIDO_MS = 20000, BURBUJA_MS = 6000;

  // El catálogo compartido vive en js/catalogo-casa.js. Si no
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
    { id:'musica',     nom:'Música' },
    { id:'mascotas',   nom:'Mascotas' },
    { id:'gym',        nom:'Gimnasio' },
    { id:'navidad',    nom:'Navidad' },
    { id:'halloween',  nom:'Halloween' },
    { id:'terraza',    nom:'Terraza y jardín' },
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
  var SENTABLES = /^(chair|gamerChair|gymBench|terraceRockingChair|terraceLounger|loungeChair|loungeSofa|bench|stoolBar|bedSingle|bedDouble|bedBunk)/;
  function esSentable(id) { return SENTABLES.test(String(id).split('__')[0]); }
  function esMascota(id) { return /^pet[A-Z]/.test(String(id)); }
  function posturaEn(col, fila) {
    var m = S.pieza.find(function (item) { return !item.pared && item.col === col && item.fila === fila && esSentable(item.id); });
    if (!m) return '';
    return /^(bed|terraceLounger)/.test(m.id) ? 'acostado' : 'sentado';
  }

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
  PISOS.push({id:'pasto',nom:'Pasto de jardín',xp:9999,regalo:'terraceGrass'});
  CATALOGO.filter(function(m){return !!m.acabado;}).forEach(function(m){
    MUROS.push(Object.assign({nom:m.nom,xp:9999,regalo:m.id},m.acabado));
  });
  function pisoDe(id){ return PISOS.some(function(p){ return p.id===id; }) ? id : 'claro'; }
  function muroDe(id){ for (var i=0;i<MUROS.length;i++) if (MUROS[i].id===id) return MUROS[i]; return MUROS[0]; }

  // Placas: los logros de logros.html (emoji, nombre, rareza). Cada estudiante
  // se pone hasta 3 de los que ganó y se ven junto a su nombre en la casa. La
  // auditoría exige que esta lista calce con la de logros.html.
  var PLACAS = {
    first_session: ['🎯', 'Primer Paso', 'comun'],
    three_sessions: ['🔥', 'En Racha', 'poco_comun'],
    five_sessions: ['💪', 'Dedicación Total', 'raro'],
    all_sessions: ['🏁', 'Imparable', 'epico'],
    score_80: ['📈', 'Sobre el Promedio', 'comun'],
    score_90: ['🌟', 'Sobresaliente', 'poco_comun'],
    perfect_score: ['💎', 'Perfeccionista', 'raro'],
    above_80_three: ['📊', 'Consistente', 'poco_comun'],
    avg_90: ['🏅', 'Élite Académica', 'epico'],
    paes_debut: ['📝', 'Debut PAES', 'comun'],
    paes_500: ['🎯', 'Sobre 500 pts', 'poco_comun'],
    paes_700: ['🔥', 'Sobre 700 pts', 'raro'],
    paes_850: ['⭐', 'Sobre 850 pts', 'epico'],
    paes_900: ['👑', 'Élite Nacional', 'legendario'],
    paes_improve: ['📈', 'Mejora Continua', 'poco_comun'],
    first_mission: ['🗺️', 'Misión Cumplida', 'comun'],
    three_missions: ['⚔️', 'Explorador', 'poco_comun'],
    all_missions: ['🏆', 'Completista', 'epico'],
    story_500: ['✍️', 'Maestro Narrador', 'raro'],
    argument_treasure: ['🥇', 'Tesoro del Argumento', 'epico'],
    distractor_aura: ['⚡', 'Aura del Auditor', 'epico'],
    xp_250: ['💫', 'Primeros 250', 'comun'],
    xp_500: ['💪', 'Medio Millar', 'poco_comun'],
    xp_1000: ['⚡', 'Mil XP', 'raro'],
    level_3: ['🌿', 'Nivel 10', 'comun'],
    level_5: ['⚡', 'Nivel 30', 'raro'],
    level_max: ['👑', 'Nivel Máximo', 'legendario'],
    top5: ['🏅', 'Top 5', 'poco_comun'],
    podium: ['🥉', 'Podio', 'raro'],
    number_one: ['🥇', 'Número Uno', 'epico'],
    night_owl: ['🦉', 'Búho Nocturno', 'raro'],
    early_bird: ['🐦', 'Madrugador', 'raro'],
    title_creative: ['🎨', 'Título Creativo', 'comun'],
    weekend_warrior: ['📅', 'Guerrero de Fin de Semana', 'poco_comun'],
    arena_debut: ['⚔️', 'Debut en la Arena', 'comun'],
    arena_5_battles: ['🥊', 'Puños de Acero', 'poco_comun'],
    arena_first_win: ['🏆', 'Primera Victoria', 'comun'],
    arena_10_wins: ['💪', 'Gladiador', 'raro'],
    arena_streak_3: ['🔥', 'Racha Imparable', 'poco_comun'],
    arena_streak_5: ['⚡', 'Invicto', 'epico'],
    arena_streak_10: ['👑', 'Leyenda de la Arena', 'legendario']
  };
  var COLOR_RAREZA = { comun: '#94a3b8', poco_comun: '#22c55e', raro: '#3b82f6', epico: '#a855f7', legendario: '#f59e0b' };
  Object.assign(PLACAS, global.AvatarLookSystem.LOGROS_DOCENTES || {});
  var MAX_PLACAS = 3;
  // Solo placas conocidas, ganadas y sin repetir, hasta 3.
  function placasValidas(lista, logros) {
    var vistas = {};
    return (Array.isArray(lista) ? lista : []).filter(function (id) {
      if (!PLACAS[id] || !logros || !logros[id] || vistas[id]) return false;
      vistas[id] = true; return true;
    }).slice(0, MAX_PLACAS);
  }

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
    return Math.min(1, (cv.clientWidth - 16) / anchoPieza, (cv.clientHeight - 16) / altoPieza) * (S.zoomFactor || 1);
  }

  function ocupacion(col, fila, salvo) {
    var r = { plano: -1, base: -1, encima: -1 };
    S.pieza.forEach(function (m, i) {
      if (i === salvo || m.pared || !global.MapasCasa.ocupa(ficha(m.id),m,col,fila)) return;
      var f = ficha(m.id);
      if (f.plano) r.plano = i; else if (m.sobre) r.encima = i; else r.base = i;
    });
    return r;
  }
  function estorbo(id, col, fila, salvo, dir) {
    var cells=global.MapasCasa.celdas(ficha(id),{col:col,fila:fila,dir:dir||'SE'});
    if(!cells.every(function(c){return haySuelo(c.col,c.fila);}))return 'El mueble completo debe caber dentro del suelo';
    if(cells.length>1){
      var conflict=cells.some(function(c){var o=ocupacion(c.col,c.fila,salvo);return ficha(id).plano ? o.plano>=0 : o.base>=0;});
      return conflict ? 'Ese espacio ya está ocupado' : null;
    }
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
    var ultima = COLS - 1;
    if (S.mapa) while (ultima > 0 && !haySuelo(ultima, 0)) ultima--;
    var n = celda(0, 0), e = celda(ultima, 0), w = celda(0, FILAS - 1);
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
    return { x: x, y: y, w: im.naturalWidth, h: im.naturalHeight,imagen:m.id+'_'+(m.pared==='izq'?'SW':'SE') };
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
  function pintarSprite(nombre, col, fila, z, mueble) {
    var im = imgs[nombre];
    if (!im || !im.complete || !im.naturalWidth) return null;
    var h = global.MapasCasa.huella(mueble && ficha(mueble.id),mueble && mueble.dir);
    var p = celda(col+(h.cols-1)/2, fila+(h.filas-1)/2), cx = S.cx;
    var x = p.x + (TW - im.naturalWidth) / 2;
    var y = p.y + ROMBO + SY*(h.cols+h.filas-2)/2 - im.naturalHeight - (z || 0);
    if (mueble && esMascota(mueble.id) && S.housesEnabled) {
      var fase = (S.fxTime || 0) / 500 + col * 2 + fila;
      x += Math.sin(fase) * 7;
      y += Math.sin(fase * 2) * 2;
    }
    if (mueble && mueble.id === 'rgbPartySpeaker') {
      cx.save();
      if (!mueble.encendido) cx.filter = 'brightness(.46)';
      else {
        cx.shadowColor = Math.sin((S.fxTime || 0) / 380) > 0 ? '#22d3ee' : '#e879f9';
        cx.shadowBlur = 18 + 7 * Math.sin((S.fxTime || 0) / 240);
      }
      cx.drawImage(im, x, y);
      cx.restore();
      if (mueble.encendido && S.housesEnabled) {
        var faseLuz = (S.fxTime || 0) / 420;
        cx.save(); cx.globalCompositeOperation = 'screen';
        [['#22d3ee', .43], ['#f472b6', .68]].forEach(function (luz, i) {
          var grad = cx.createRadialGradient(x + im.naturalWidth * .5, y + im.naturalHeight * luz[1], 2,
            x + im.naturalWidth * .5, y + im.naturalHeight * luz[1], 23);
          grad.addColorStop(0, luz[0]); grad.addColorStop(1, 'transparent');
          cx.globalAlpha = .24 + .19 * (1 + Math.sin(faseLuz + i * Math.PI)) / 2;
          cx.fillStyle = grad; cx.beginPath();
          cx.arc(x + im.naturalWidth * .5, y + im.naturalHeight * luz[1], 23, 0, Math.PI * 2); cx.fill();
        });
        cx.restore();
      }
    } else {
      cx.save();
      var accion=mueble&&CATALOGO.accion(mueble.id);
      if(accion&&accion.tipo==='encender'){
        if(mueble.encendido){cx.shadowColor='#fef08a';cx.shadowBlur=18;}
        else cx.filter='brightness(.65)';
      }
      cx.drawImage(im,x,y);cx.restore();
    }
    if (mueble && mueble.id === 'aquarium' && S.housesEnabled) {
      var t = (S.fxTime || 0) / 800;
      cx.save();
      cx.beginPath(); cx.rect(x + im.naturalWidth * .12, y + im.naturalHeight * .13,
        im.naturalWidth * .76, im.naturalHeight * .30); cx.clip();
      [['#fb923c', 0], ['#60a5fa', 2.2], ['#facc15', 4.1]].forEach(function (pez) {
        var px = x + im.naturalWidth * (.18 + .56 * ((Math.sin(t + pez[1]) + 1) / 2));
        var py = y + im.naturalHeight * (.20 + .05 * Math.sin(t * 1.3 + pez[1]));
        cx.fillStyle = pez[0]; cx.beginPath(); cx.ellipse(px, py, 3.5, 2, 0, 0, Math.PI * 2); cx.fill();
        cx.beginPath(); cx.moveTo(px - 3, py); cx.lineTo(px - 6, py - 2.4); cx.lineTo(px - 6, py + 2.4); cx.closePath(); cx.fill();
      });
      cx.restore();
    }
    if(mueble && S.housesEnabled && !global.matchMedia('(prefers-reduced-motion: reduce)').matches){
      var effect=ficha(mueble.id).efecto,phase=(S.fxTime||0)/1000;
      if(effect==='agua'){
        cx.save();cx.beginPath();cx.moveTo(x+im.naturalWidth*.5,y+im.naturalHeight*.24);
        cx.lineTo(x+im.naturalWidth*.76,y+im.naturalHeight*.42);cx.lineTo(x+im.naturalWidth*.5,y+im.naturalHeight*.60);cx.lineTo(x+im.naturalWidth*.24,y+im.naturalHeight*.42);cx.closePath();cx.clip();
        cx.strokeStyle='rgba(207,250,254,.62)';cx.lineWidth=1.5;
        for(var wave=0;wave<4;wave++){var wy=y+im.naturalHeight*(.30+((phase*.035+wave*.075)% .30));cx.beginPath();cx.ellipse(x+im.naturalWidth*.5,wy,im.naturalWidth*(.12+.025*Math.sin(phase+wave)),3,0,0,Math.PI*2);cx.stroke();}
        cx.restore();
      }else if(effect==='cascada' && ['SE','SW'].indexOf(mueble.dir)>=0){
        cx.save();cx.strokeStyle='rgba(225,251,255,.72)';cx.lineWidth=2;
        for(var drop=0;drop<8;drop++){var dy=(phase*.8+drop*.13)%1,dx=x+im.naturalWidth*(.43+(drop%3)*.035);cx.beginPath();cx.moveTo(dx,y+im.naturalHeight*(.22+dy*.38));cx.lineTo(dx,y+im.naturalHeight*(.25+dy*.38));cx.stroke();}
        cx.restore();
      }
    }
    return { x: x, y: y, w: im.naturalWidth, h: im.naturalHeight,imagen:nombre };
  }
  function paredes() {
    var cx = S.cx, q = esquinas(), mu = muroDe(S.casa.muro), H = mu.alto || 132;
    function plano(a, b, relleno, canto) {
      cx.beginPath();
      cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y);
      cx.lineTo(b.x, b.y - H); cx.lineTo(a.x, a.y - H); cx.closePath();
      cx.fillStyle = relleno; cx.fill();
      if(mu.patron){
        cx.save();cx.clip();cx.transform(b.x-a.x,b.y-a.y,0,-H,a.x,a.y);
        cx.strokeStyle='rgba(30,41,59,.25)';cx.lineWidth=.006;
        var rows=mu.patron==='madera'?1:8,cols=mu.patron==='madera'?20:12;
        for(var row=0;row<=rows;row++){cx.beginPath();cx.moveTo(0,row/rows);cx.lineTo(1,row/rows);cx.stroke();}
        for(var rr=0;rr<rows;rr++)for(var cc=0;cc<cols;cc++){
          var xx=(cc+(mu.patron==='ladrillo'&&rr%2?.5:0))/cols;
          cx.beginPath();cx.moveTo(xx,rr/rows);cx.lineTo(xx,(rr+1)/rows);cx.stroke();
          if(mu.patron==='jardin'){cx.fillStyle=(rr+cc)%2?'#80b764':'#39633f';cx.beginPath();cx.ellipse(xx+.025,(rr+.5)/rows,.025,.037,-.5,0,Math.PI*2);cx.fill();}
        }
        cx.restore();
      }
      cx.beginPath();
      cx.moveTo(a.x, a.y - H); cx.lineTo(b.x, b.y - H);
      cx.lineTo(b.x, b.y - H + 7); cx.lineTo(a.x, a.y - H + 7); cx.closePath();
      cx.fillStyle = canto; cx.fill();
    }
    if (S.mapa) {
      // En un mapa irregular cada borde posterior expuesto lleva su propio tramo.
      for (var f = 0; f < FILAS; f++) for (var c = 0; c < COLS; c++) {
        if (!haySuelo(c, f)) continue;
        var p = celda(c, f), n = { x: p.x + TW / 2, y: p.y };
        if (!haySuelo(c - 1, f)) plano({ x: p.x, y: p.y + ROMBO / 2 }, n, mu.izq, mu.canto);
        if (!haySuelo(c, f - 1)) plano(n, { x: p.x + TW, y: p.y + ROMBO / 2 }, mu.der, mu.canto);
      }
    } else {
      plano(q.W, q.N, mu.izq, mu.canto);
      plano(q.N, q.E, mu.der, mu.canto);
    }
    if(H<100)return; // Una baranda de terraza no lleva una ventana flotante.
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
    var soporte = pers.postura && S.pieza.find(function(m){return !m.pared && m.col===pers.col && m.fila===pers.fila && esSentable(m.id);});
    var huella = global.MapasCasa.huella(soporte && ficha(soporte.id),soporte && soporte.dir);
    var cx = S.cx, p = celda(pers.col+(huella.cols-1)/2, pers.fila+(huella.filas-1)/2);
    var cxp = p.x + TW / 2;
    var base = p.y + 53 + 16 - (pers.postura === 'sentado' ? 14 : 0);
    if (pers.postura === 'acostado') {
      cx.save();
      cx.translate(cxp + 27, p.y + 59);
      cx.rotate(-Math.PI / 2);
      global.AvatarLookSystem.pintar(cx, 0, 0, pers.look, 0.65, '', pers.gesto, {t:Date.now()});
      cx.restore();
    } else {
      global.AvatarLookSystem.pintar(cx, cxp, base, pers.look, 0.86, pers.postura, pers.gesto,
        {dir:soporte ? soporte.dir : pers.dir, caminar:pers.caminar, t:Date.now()});
    }
    if (pers.gesto) {
      cx.save(); cx.font = '17px "Segoe UI Emoji", sans-serif'; cx.textAlign = 'center';
      var gestoMeta=global.AvatarLookSystem.GESTOS.find(function(g){return g.id===pers.gesto;});
      cx.fillText(gestoMeta ? gestoMeta.icono : '',
        cxp + 18 + Math.sin((S.fxTime || 0) / 230) * 4, base - 104);
      cx.restore();
    }
    var actividad=pers.uid===S.uid?S.actividad:(S.otros[pers.uid]&&{tipo:S.otros[pers.uid].actividad,hasta:S.otros[pers.uid].actividadHasta});
    if(actividad&&Number(actividad.hasta)>Date.now()){
      cx.save();cx.fillStyle='#fef08a';cx.font='bold 20px sans-serif';cx.textAlign='center';
      cx.fillText(actividad.tipo==='tocar'?'♫':actividad.tipo==='ejercitar'?'✦':actividad.tipo==='acariciar'?'♥':'…',cxp-26,base-80);cx.restore();
    }
    if (pers.nombre) {
      cx.save();
      cx.font = '700 11px system-ui, sans-serif'; cx.textAlign = 'center';
      var etiqueta = pers.nombre, w = cx.measureText(etiqueta).width + 12;
      // Nombre y, pegadas a su derecha, las placas; el conjunto va centrado.
      var placas = pers.placas || [], LADO = 16, SEP = 2;
      var ancho = w + (placas.length ? 4 + placas.length * (LADO + SEP) - SEP : 0);
      var x0 = cxp - ancho / 2;
      cx.fillStyle = pers.esYo ? 'rgba(56,189,248,.92)' : 'rgba(15,23,42,.78)';
      var etiquetaY = pers.postura === 'acostado' ? p.y + 20 : base + 6;
      cx.beginPath(); cx.roundRect(x0, etiquetaY, w, 16, 8); cx.fill();
      cx.fillStyle = pers.esYo ? '#04263a' : '#e8edf5';
      cx.fillText(etiqueta, x0 + w / 2, etiquetaY + 12);
      cx.font = '10px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
      placas.forEach(function (id, i) {
        var pl = PLACAS[id];
        if (!pl) return;
        var px = x0 + w + 4 + i * (LADO + SEP);
        cx.fillStyle = COLOR_RAREZA[pl[2]] || '#94a3b8';
        cx.beginPath(); cx.roundRect(px, etiquetaY, LADO, LADO, 4); cx.fill();
        cx.fillText(pl[0], px + LADO / 2, etiquetaY + 12);
      });
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
    cx.translate(W / 2, H / 2); cx.scale(z, z);
    cx.translate(-W / 2 + (S.pan ? S.pan.x : 0), -H / 2 + (S.pan ? S.pan.y : 0));
    cx.imageSmoothingEnabled = false;
    S.zoom = z;

    var idPiso = pisoDe(S.casa.piso);
    var piso = imgs[idPiso === 'claro' ? 'floorFull_SE' : 'floorFull__' + idPiso + '_SE'] || imgs['floorFull_SE'];
    if (piso && piso.complete && piso.naturalWidth) {
      for (var f = 0; f < FILAS; f++) for (var c = 0; c < COLS; c++) {
        if (!haySuelo(c, f)) continue;
        var p = celda(c, f); cx.drawImage(piso, p.x, p.y);
      }
    }
    paredes();

    if(S.decorando)for(var gf=0;gf<FILAS;gf++)for(var gc=0;gc<COLS;gc++)if(haySuelo(gc,gf))pintarCasilla({col:gc,fila:gf},'rgba(255,255,255,.03)','#64748b');
    var mover=S.elegido?{id:S.elegido,dir:'SE'}:S.pieza[S.sel];
    if (S.decorando && mover && S.hover && !esDePared(mover.id) && !mover.pared) {
      var mal=estorbo(mover.id,S.hover.col,S.hover.fila,S.elegido?-1:S.sel,mover.dir);
      global.MapasCasa.celdas(ficha(mover.id),{col:S.hover.col,fila:S.hover.fila,dir:mover.dir}).forEach(function(c){pintarCasilla(c,mal?'rgba(239,68,68,.55)':'rgba(34,197,94,.55)');});
    }else if(!S.decorando){
      (S.caminoVisible||[]).forEach(function(c){pintarCasilla(c,'rgba(56,189,248,.25)');});
      if(S.destino)pintarCasilla(S.destino,'rgba(56,189,248,.6)','#e0f2fe');
      else if(S.hover)pintarCasilla(S.hover,bloqueada(S.hover.col,S.hover.fila)?'rgba(239,68,68,.25)':'rgba(56,189,248,.25)');
    }
    pintarPuerta();

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
      var cajaP = pintarSprite(m.id + '_' + m.dir, m.col, m.fila, 0,m);
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
      var h=global.MapasCasa.huella(ficha(m.id),m.dir);
      cosas.push({ tipo: 'mueble', prof: m.col + m.fila + h.cols+h.filas-2, capa: m.sobre ? 2 : 1, m: m, i: i });
    });
    personas().forEach(function (pe) {
      var profundidad = pe.postura ? 0.03 : 0.01;
      if(pe.postura){
        var soporte=S.pieza.find(function(m){return !m.pared && m.col===pe.col && m.fila===pe.fila && esSentable(m.id);});
        var h=global.MapasCasa.huella(soporte && ficha(soporte.id),soporte && soporte.dir);
        profundidad+=h.cols+h.filas-2;
      }
      cosas.push({ tipo: 'persona', prof: pe.col + pe.fila + profundidad, capa: 1, pe: pe });
    });
    cosas.sort(function (a, b) { return (a.prof - b.prof) || (a.capa - b.capa); });

    cosas.forEach(function (o) {
      if (o.tipo === 'persona') { pintarPersona(o.pe); return; }
      var z2 = 0;
      if (o.m.sobre) { var oc = ocupacion(o.m.col, o.m.fila, o.i); if (oc.base >= 0) z2 = ficha(S.pieza[oc.base].id).sup || 0; }
      var caja = pintarSprite(o.m.id + '_' + o.m.dir, o.m.col, o.m.fila, z2, o.m);
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
  function sentableEn(col, fila) { return !!posturaEn(col, fila); }
  function personas() {
    var lista = [{ uid: S.uid, look: S.look, col: S.av.col, fila: S.av.fila, nombre: S.miNombre, esYo: true,
                   gesto: S.gesto && S.gesto.hasta > Date.now() ? S.gesto.id : '',
                   placas: S.placas, dir:S.dir || 'SE', caminar:!!caminando,
                   postura: !caminando ? posturaEn(Math.round(S.av.col), Math.round(S.av.fila)) : '' }];
    Object.keys(S.otros).forEach(function (uid) {
      if (uid === S.uid) return;
      var o = S.otros[uid], v = S.vistos[uid];
      var c = v ? v.col : (Number(o.col) || 0), f = v ? v.fila : (Number(o.fila) || 0);
      if (!haySuelo(Math.round(c), Math.round(f))) return;
      lista.push({ uid: uid, look: global.AvatarLookSystem.normalizeLook(o.look, { xpTotal: 99999 }),
                   col: c, fila: f, nombre: nombreCorto(o.nombre), esYo: false, placas: S.placasDe[uid] || [],
                   gesto: Number(o.gestoHasta) > Date.now() ? o.gesto : '', dir:v && v.dir || o.dir || 'SE', caminar:!!(v && v.camino),
                   postura: !(v && v.camino) ? posturaEn(Math.round(c), Math.round(f)) : '' });
    });
    return lista;
  }

  // Los demás caminan como en Habbo: cuando llega su nuevo destino, se les
  // dibuja recorriendo la misma ruta que haría uno, en vez de aparecer de golpe.
  function seguirOtros() {
    var ahora = performance.now();
    Object.keys(S.vistos).forEach(function (uid) { if (!S.otros[uid]) delete S.vistos[uid]; });
    Object.keys(S.otros).forEach(function (uid) {
      if (uid === S.uid) return;
      var o = S.otros[uid], meta = { col: Number(o.col) || 0, fila: Number(o.fila) || 0 };
      if (!haySuelo(meta.col, meta.fila)) meta = entrada();
      var v = S.vistos[uid];
      if (!v) { S.vistos[uid] = { col: meta.col, fila: meta.fila, meta: meta, camino: null }; cargarPlacas(uid); return; }
      if (v.meta.col === meta.col && v.meta.fila === meta.fila) return;
      v.meta = meta;
      var desde = { col: Math.round(v.col), fila: Math.round(v.fila) };
      var camino = ruta(desde, meta);
      v.col = desde.col; v.fila = desde.fila;
      if (!camino || camino.length < 2) { v.col = meta.col; v.fila = meta.fila; v.camino = null; return; }
      v.camino = camino; v.i = 0; v.t0 = ahora;
    });
    animarOtros();
  }
  // Las placas de cada visitante se leen una vez de su avatar, y solo se
  // muestran las que calzan con sus logros.
  function cargarPlacas(uid) {
    if (S.placasDe[uid]) return;
    S.placasDe[uid] = [];
    var ref = S.db.ref(S.base + '/avatar/' + uid);
    Promise.all([ref.child('placas').once('value'), ref.child('logros').once('value'),ref.child('regalos').once('value')]).then(function (r) {
      S.placasDe[uid] = placasValidas(r[0].val(), global.AvatarLookSystem.logrosConPremios(r[1].val(),r[2].val()));
      if (S.placasDe[uid].length) dibujar();
    }).catch(function () {});
  }

  var animOtros = null;
  function animarOtros() {
    if (animOtros) return;
    function tick(ahora) {
      var alguno = false;
      Object.keys(S.vistos).forEach(function (uid) {
        var v = S.vistos[uid];
        if (!v.camino) return;
        alguno = true;
        var a = v.camino[v.i], b = v.camino[v.i + 1];
        var avance = Math.min(1, (ahora - v.t0) / (PASO_MS*Math.hypot(b.col-a.col,b.fila-a.fila)));
        v.dir=direccionPaso(a,b);
        v.col = a.col + (b.col - a.col) * avance;
        v.fila = a.fila + (b.fila - a.fila) * avance;
        if (avance >= 1) {
          v.i++; v.t0 = ahora;
          if (v.i >= v.camino.length - 1) { v.col = b.col; v.fila = b.fila; v.camino = null; }
        }
      });
      dibujar();
      animOtros = alguno ? requestAnimationFrame(tick) : null;
    }
    animOtros = requestAnimationFrame(tick);
  }

  // ---------------- caminar ----------------
  function pintarCasilla(c,color,borde){
    var p=celda(c.col,c.fila),cx=S.cx;cx.save();cx.fillStyle=color;
    cx.beginPath();cx.moveTo(p.x+TW/2,p.y);cx.lineTo(p.x+TW,p.y+53);cx.lineTo(p.x+TW/2,p.y+ROMBO);cx.lineTo(p.x,p.y+53);cx.closePath();cx.fill();
    if(borde){cx.strokeStyle=borde;cx.lineWidth=1;cx.stroke();}cx.restore();
  }
  function puertaActual(){return global.MapasCasa.puerta(S.casa,S.pieza,POR_ID);}
  function pintarPuerta(){
    if(S.comun){S.cajaPuerta=null;return;}
    var puerta=puertaActual();S.cajaPuerta=null;if(!puerta)return;
    var p=celda(puerta.col,puerta.fila),cx=S.cx,x=p.x+47,y=p.y-65;
    cx.save();cx.fillStyle='#26374b';cx.strokeStyle='#94a3b8';cx.lineWidth=3;
    cx.beginPath();cx.moveTo(x,y+45);cx.lineTo(x+48,y+77);cx.lineTo(x+48,y+163);cx.lineTo(x,y+131);cx.closePath();cx.fill();cx.stroke();
    cx.fillStyle='#67e8f9';cx.beginPath();cx.arc(x+36,y+111,4,0,Math.PI*2);cx.fill();
    cx.fillStyle='#164e63';cx.fillRect(p.x+TW/2-43,y+6,86,28);
    cx.font='bold 16px sans-serif';cx.textAlign='center';cx.fillStyle='#e0f2fe';cx.fillText(S.habitacion==='estudio'?'Casa':'Estudio',p.x+TW/2,y+27);cx.restore();
    S.cajaPuerta={x:x,y:y+45,w:48,h:118};
  }
  function bloqueada(col, fila) {
    return !haySuelo(col, fila) || S.pieza.some(function (m) {
      if (m.pared || !global.MapasCasa.ocupa(ficha(m.id),m,col,fila)) return false;
      var f = ficha(m.id);
      return !f.plano && !m.sobre && !esMascota(m.id);
    });
  }
  function ruta(desde, hasta) {
    if (!haySuelo(desde.col, desde.fila) || !haySuelo(hasta.col, hasta.fila)) return null;
    if(desde.col===hasta.col&&desde.fila===hasta.fila)return [desde];
    // Un asiento se puede elegir como destino: la ruta llega hasta un vecino
    // libre y el último paso es subirse.
    var asiento = sentableEn(hasta.col, hasta.fila);
    if (bloqueada(hasta.col, hasta.fila) && !asiento) return null;
    if (asiento) {
      var vecinos = [[1,0],[-1,0],[0,1],[0,-1]].map(function (d) { return { col: hasta.col + d[0], fila: hasta.fila + d[1] }; })
        .filter(function (v) { return !bloqueada(v.col, v.fila); });
      var mejor = null;
      vecinos.forEach(function (v) {
        var r = (v.col === desde.col && v.fila === desde.fila) ? [v] : ruta(desde, v);
        if (r && (!mejor || r.length < mejor.length)) mejor = r;
      });
      return mejor ? mejor.concat([{ col: hasta.col, fila: hasta.fila }]) : null;
    }
    return global.MapasCasa.ruta(desde,hasta,function(c,f){return !bloqueada(c,f);});
  }
  var caminando = null, PASO_MS = 300;
  function direccionPaso(a,b) {
    return global.MapasCasa.direccion(a,b);
  }
  function caminar(hasta,alLlegar) {
    if (S.cambiando || !haySuelo(hasta.col, hasta.fila)) return;
    // Reorientar al terminar la casilla actual evita el salto de redondeo.
    if(caminando){caminando.siguiente={hasta:hasta,alLlegar:alLlegar};return;}
    var camino = ruta({ col: Math.round(S.av.col), fila: Math.round(S.av.fila) }, hasta);
    if (!camino || camino.length < 2) { if (!camino) avisar('Por ahí no se puede llegar');else if(alLlegar)alLlegar();return; }
    // Los demás reciben el destino al partir, así me ven caminar a la par.
    S.destino = { col: hasta.col, fila: hasta.fila };
    S.caminoVisible=camino;
    S.dir=direccionPaso(camino[0],camino[1]);
    avisarPosicion();
    var i = 0, t0 = performance.now();
    caminando={id:null};
    function terminar(b){
      caminando=null;S.caminoVisible=[];S.destino=null;S.av={col:b.col,fila:b.fila};dibujar();avisarPosicion();
      if(!S.visitando){S.miAv={col:b.col,fila:b.fila};guardar('personajeEn',S.miAv);}
    }
    function paso(ahora) {
      var a = camino[i], b = camino[i + 1];
      if(bloqueada(b.col,b.fila)&&!sentableEn(b.col,b.fila)){terminar(a);avisar('El camino está ocupado');return;}
      var MS=PASO_MS*Math.hypot(b.col-a.col,b.fila-a.fila),avance = Math.min(1, (ahora - t0) / MS);
      S.dir=direccionPaso(a,b);
      S.av.col = a.col + (b.col - a.col) * avance;
      S.av.fila = a.fila + (b.fila - a.fila) * avance;
      dibujar();
      if (avance >= 1) {
        var siguiente=caminando.siguiente,detener=caminando.detener;
        if(siguiente||detener){terminar(b);if(siguiente)caminar(siguiente.hasta,siguiente.alLlegar);return;}
        i++; t0 = ahora;
        S.caminoVisible=camino.slice(i);
        if (i >= camino.length - 1) {
          terminar(b);if(alLlegar)alLlegar();
          return;
        }
      }
      caminando.id=requestAnimationFrame(paso);
    }
    caminando.id=requestAnimationFrame(paso);
  }

  // ---------------- guardado ----------------
  // Una espera por campo: si fuera una sola, guardar las placas y enseguida el
  // look cancelaría las placas.
  var pendientes = {};
  var piezaQueue = Promise.resolve();
  function guardar(campo, valor) {
    if (!S.db || !S.uid) return;
    var h=S.habitacion||'principal',clave=campo+':'+h,copia=JSON.parse(JSON.stringify(valor));
    if(pendientes[clave])clearTimeout(pendientes[clave].timer);
    var job={run:function(){
      delete pendientes[clave];
      piezaQueue = piezaQueue.then(function () {
      if (campo === 'pieza' || campo === 'casa' || campo === 'personajeEn') {
        var cuerpo=campo==='pieza'?{pieza:copia}:campo==='casa'?{casa:copia}:copia;
        return api(campo === 'pieza' ? 'guardar-pieza' : campo==='casa'?'guardar-casa':'guardar-posicion',Object.assign({habitacion:h},cuerpo)).then(function (data) {
          if (!data || !data.ok) throw new Error((data && data.error) || 'No se pudo guardar');
          var room=S.misHabitaciones[h];
          if(campo === 'pieza'){
            room.pieza = Array.isArray(data.pieza) ? data.pieza : [];
            if (!S.visitando && S.habitacion===h) S.pieza=S.miPieza=room.pieza;
          }else if(campo==='casa'){
            room.casa=data.casa;
            if(!S.visitando && S.habitacion===h){S.casa=S.miCasa=room.casa;aplicarTamano();dibujar();}
          }else{room.personajeEn=data.personajeEn;}
          delete S.saveErrors[clave];
          pintarMuebles();marcarEstado('Guardado', false);
        });
      }
      var ref = S.db.ref(S.base + '/avatar/' + S.uid + '/' + campo);
      return ref.set(copia).then(function () {return ref.once('value');}).then(function(snap){
        if(!snap.exists())throw new Error('No se pudo confirmar el guardado');
        delete S.saveErrors[clave];
        marcarEstado('Guardado',false);
      });
      }).catch(function(error){
        S.saveErrors[clave]=error;marcarEstado(error.message||'No se pudo guardar',true);
        if(campo==='pieza'||campo==='casa'){
          return api('habitaciones',{sala:S.uid}).then(function(data){
            if(data.ok){S.misHabitaciones=data.habitaciones;if(!S.visitando)activarHabitacion(S.habitacion,S.misHabitaciones[S.habitacion],false);}
          }).catch(function(){});
        }
      });
    }};
    pendientes[clave]=job;job.timer=setTimeout(job.run,500);
  }
  function esperarGuardado(){
    Object.keys(pendientes).forEach(function(k){var job=pendientes[k];clearTimeout(job.timer);job.run();});
    return piezaQueue.then(function(){var keys=Object.keys(S.saveErrors);if(keys.length)throw S.saveErrors[keys[0]];});
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
    var payload=Object.assign({action:'salas-' + action,habitacion:S.habitacion||'principal'},cuerpo||{});
    return S.auth.currentUser.getIdToken().then(function (token) {
      return fetch(API, {
        method: 'POST', keepalive: !!keepalive,
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify(payload)
      });
    }).then(function (r) { return r.json(); });
  }

  var latidoTimer = null, burbujaTimer = null;
  function latido() {
    if (!S.sala || S.cambiando) return Promise.resolve();
    var p = S.destino || { col: Math.round(S.av.col), fila: Math.round(S.av.fila) };
    return api('latido', { sala: S.sala, col: p.col, fila: p.fila, look: S.look, dir:S.dir || 'SE',
      gesto: S.gesto && S.gesto.hasta > Date.now() ? S.gesto.id : '' })
      .then(function (r) { if (r && r.fuera) conectarSala(S.sala, true); })
      .catch(function () {});
  }
  // Un aviso de posición por segundo como máximo: con flechas se camina casilla
  // a casilla, y el último destino sale al cerrar la ventana.
  var AVISO_MS = 1000, ultimoAviso = 0, avisoTimer = null;
  function avisarPosicion() {
    if (!S.sala || avisoTimer) return;
    var espera = AVISO_MS - (Date.now() - ultimoAviso);
    avisoTimer = setTimeout(function () {
      avisoTimer = null; ultimoAviso = Date.now(); latido();
    }, Math.max(0, espera));
  }

  function desconectarSala(sinSalir) {
    if(S.refJuego)S.refJuego.off();S.refJuego=null;S.actividad=null;
    if (S.refPresentes) S.refPresentes.off();
    if (S.refChat) S.refChat.off();
    if (S.refCasaVisitada) S.refCasaVisitada.off();
    if (S.refPiezaVisitada) S.refPiezaVisitada.off();
    S.refPresentes = S.refChat = S.refCasaVisitada = S.refPiezaVisitada = null;
    clearInterval(latidoTimer); latidoTimer = null;
    clearInterval(burbujaTimer); burbujaTimer = null;
    clearTimeout(avisoTimer);avisoTimer=null;
    if (caminando){cancelAnimationFrame(caminando.id);caminando=null;}
    S.caminoVisible=[];
    if (S.sala && !sinSalir) api('salir', { sala: S.sala }, true).catch(function () {});
    S.sala = null; S.otros = {}; S.vistos = {}; S.placasDe = {}; S.destino = null; S.burbujas = {};
  }

  function conectarSala(sala, silencioso,confirmada) {
    if (!S.housesEnabled) return Promise.resolve(false);
    return (confirmada?Promise.resolve({ok:true}):api('entrar', { sala: sala, look: S.look, col: Math.round(S.av.col), fila: Math.round(S.av.fila) }))
      .then(function (r) {
        if (!r || !r.ok) {
          avisar((r && r.error) || 'No se pudo entrar');
          return false;
        }
        S.sala = sala; S.otros = {}; S.vistos = {}; S.placasDe = {}; S.destino = null; S.burbujas = {};
        // El servidor devuelve cómo te ven los demás (con desempate si hace falta)
        if (r.yo) S.miNombre = r.yo;
        var path=S.comun ? S.base+'/salas_comunes/'+sala : S.base+'/salas/'+sala+(S.habitacion==='estudio'?'/habitaciones/estudio':'');
        if(S.comun){
          S.refJuego=S.db.ref(path+'/juego');
          S.refJuego.on('value',function(snap){S.juego=snap.val()||{};Object.keys(S.juego.interacciones||{}).forEach(function(i){if(S.pieza[i])S.pieza[i].encendido=S.juego.interacciones[i].encendido===true;});pintarInteracciones();dibujar();});
        }
        S.refPresentes = S.db.ref(path+'/presentes');
        S.refPresentes.on('value', function (snap) {
          S.otros = snap.val() || {};
          seguirOtros();
          pintarCabecera(); dibujar();
        });
        S.refChat = S.db.ref(path+'/chat').orderByChild('ts').limitToLast(40);
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
    var titulo = S.comun ? esc(S.duenoNombre) : (S.visitando ? 'Casa de ' + esc(nombreCorto(S.duenoNombre)) : 'Mi casa')+' · '+(S.habitacion==='estudio'?'Estudio':'Principal');
    cab.innerHTML = '<span class="esp-sala-tit">' + titulo + '</span>' +
      '<span class="esp-sala-n">' + n + ' ' + (n === 1 ? 'persona' : 'personas') + '</span>' +
      (S.comun?'':'<button class="esp-btn-chico esp-puerta" id="espPuerta"'+(!S.housesEnabled||S.cambiando?' disabled':'')+'>🚪 '+(S.habitacion==='estudio'?'Ir a principal':'Ir al estudio')+'</button>') +
      (S.visitando
        ? (S.comun?'':'<button class="esp-btn-chico" id="espRegalar">🎁 Regalar</button>') +
          '<button class="esp-btn-chico esp-btn-junto" id="espVolver">Volver a mi casa</button>'
        : '<button class="esp-btn-chico" id="espVisitar">Visitar</button>'+(CATALOGO.idCurso(S.curso)?'<button class="esp-btn-chico" id="espCurso">Sala del curso</button>':''));
    var bc=cab.querySelector('#espCurso');if(bc)bc.addEventListener('click',function(){irACasa(CATALOGO.idCurso(S.curso));});
    var bv = cab.querySelector('#espVisitar'), bb = cab.querySelector('#espVolver'), br = cab.querySelector('#espRegalar');
    if (bv) bv.addEventListener('click', abrirVisitas);
    if (bb) bb.addEventListener('click', function () { irACasa(S.uid); });
    if (br) br.addEventListener('click', abrirRegalo);
    var bp=cab.querySelector('#espPuerta');if(bp)bp.addEventListener('click',irPorPuerta);
  }

  function activarHabitacion(h,room,llegada){
    S.habitacion=h;S.casa=room.casa;S.pieza=room.pieza;
    if(!S.visitando){S.miCasa=S.casa;S.miPieza=S.pieza;S.miAv=room.personajeEn;S.misHabitaciones[h]=room;}
    aplicarTamano();S.av=llegada?puertaActual()||entrada():room.personajeEn;
    if(!S.av||!haySuelo(S.av.col,S.av.fila))S.av=entrada();
    S.av={col:S.av.col,fila:S.av.fila};S.pan={x:0,y:0};S.zoomFactor=1;S.panMode=false;
    S.sel=-1;S.elegido=null;S.hover=null;S.destino=null;S.caminoVisible=[];S.decorando=false;
    S.host.querySelector('#espTerreno').hidden=S.visitando;
    S.host.querySelector('#espPaleta').hidden=true;
    S.host.querySelector('#espMueblesBloque').hidden=S.visitando;
    S.pieza.forEach(function(m){DIRS.forEach(function(d){cargar_(m.id+'_'+d);});});
    modoDecorar(false);actualizarVista();pintarCabecera();pintarMuebles();pintarInteracciones();botones();dibujar();
  }
  function observarHabitacion(uid){
    if(!S.visitando||S.comun)return;
    var h=S.habitacion,path=S.base+'/avatar/'+uid+(h==='estudio'?'/habitaciones/estudio':'');
    S.refCasaVisitada=S.db.ref(path+'/casa');S.refPiezaVisitada=S.db.ref(path+'/pieza');
    S.refCasaVisitada.on('value',function(snap){if(S.sala!==uid||S.habitacion!==h)return;S.casa=snap.val()||{tamano:'5x5',piso:'claro',muro:'blanco'};aplicarTamano();if(!haySuelo(Math.round(S.av.col),Math.round(S.av.fila))){if(caminando){cancelAnimationFrame(caminando.id);caminando=null;}S.av=entrada();S.destino=null;}dibujar();});
    S.refPiezaVisitada.on('value',function(snap){if(S.sala!==uid||S.habitacion!==h)return;S.pieza=Array.isArray(snap.val())?snap.val():[];S.pieza.forEach(function(m){DIRS.forEach(function(d){cargar_(m.id+'_'+d);});});dibujar();});
  }
  function irPorPuerta(){
    if(S.comun){irACasa(S.uid);return;}
    if(!S.housesEnabled||!S.sala||S.cambiando)return;
    var puerta=puertaActual();if(!puerta){avisar('Deja una casilla libre en el borde para la puerta');return;}
    modoDecorar(false);
    caminar(puerta,function(){
      var sala=S.sala,h=S.habitacion;S.cambiando=true;pintarCabecera();
      esperarGuardado().then(function(){return api('latido',{sala:sala,habitacion:h,col:puerta.col,fila:puerta.fila});})
        .then(function(r){if(!r||!r.ok)throw new Error('No se pudo confirmar tu posición');return api('pasar-puerta',{sala:sala,habitacion:h});})
        .then(function(r){if(!r||!r.ok)throw new Error(r&&r.error||'No se pudo abrir la puerta');desconectarSala(true);activarHabitacion(r.habitacion,r,false);return conectarSala(sala,true,true);})
        .then(function(ok){if(ok){observarHabitacion(sala);avisar('Llegaste '+(S.habitacion==='estudio'?'al estudio':'a la sala principal'));}})
        .catch(function(error){
          // Si se perdió la respuesta después de cruzar, recuperar la sala
          // confirmada en servidor; nunca reingresar a ciegas en la anterior.
          return api('habitaciones',{sala:sala}).then(function(data){
            if(data.ok&&data.presente&&data.presente!==h){desconectarSala(true);activarHabitacion(data.presente,data.habitaciones[data.presente],true);return conectarSala(sala,true,true).then(function(){observarHabitacion(sala);avisar('Entrada recuperada');});}
            avisar(error.message||'No se pudo pasar: sigues en esta habitación');
          }).catch(function(){avisar('Sin conexión. Reintenta la puerta cuando vuelva.');});
        })
        .finally(function(){S.cambiando=false;pintarCabecera();});
    });
  }

  function modoDecorar(on){
    S.decorando=!!on&&!S.visitando&&S.housesEnabled;
    if(S.decorando&&caminando){caminando.detener=true;caminando.siguiente=null;}
    if(!S.decorando){S.sel=-1;S.elegido=null;S.hover=null;}
    S.host.querySelector('.esp-acciones').hidden=!S.decorando;
    S.host.querySelector('#espCaminar').setAttribute('aria-pressed',String(!S.decorando));
    var b=S.host.querySelector('#espDecorar');b.disabled=S.visitando||!S.housesEnabled;b.setAttribute('aria-pressed',String(S.decorando));
    botones();dibujar();
  }
  function colocados(id){return Object.keys(S.misHabitaciones).reduce(function(n,h){return n+S.misHabitaciones[h].pieza.filter(function(p){return p.id===id;}).length;},0);}

  // ---------------- regalos ----------------
  // Un mueble que yo tengo y el dueño de la casa no. Lo escribe el servidor en
  // su avatar; aquí solo se elige.
  function tengo(m) {
    if (Number(m.xp || 0) === 0) return true;
    var requisitos = S.requisitos && S.requisitos[m.id];
    if (Array.isArray(requisitos) && requisitos.length) {
      return !!((S.recompensas && S.recompensas[m.id]) || (S.regalos && S.regalos[m.id]));
    }
    return !!(S.regalos && S.regalos[m.id]);
  }
  function requisitoDe(m) {
    var requisitos = (S.requisitos && S.requisitos[m.id]) || [];
    if (!requisitos.length) return 'Recompensa pendiente de asignación';
    var nombres = requisitos.map(function (r) { return r.titulo || r.fuente; }).filter(Boolean);
    return 'Completa ' + nombres.slice(0, 2).join(' o ');
  }
  function abrirRegalo() {
    if (!S.housesEnabled) { avisar('Las casas y la decoración están deshabilitadas'); return; }
    var panel = S.host.querySelector('#espVisitas');
    var para = S.sala, nombre = nombreCorto(S.duenoNombre) || 'tu compañero';
    panel.hidden = false;
    panel.innerHTML = '<div class="esp-vis-cab"><b>Regalo para ' + esc(nombre) + '</b>' +
      '<button class="esp-btn-chico" id="espCerrarVis">Cerrar</button></div>' +
      '<div class="esp-vis-lista">Mirando qué le falta…</div>';
    panel.querySelector('#espCerrarVis').addEventListener('click', function () { panel.hidden = true; });
    var cont = panel.querySelector('.esp-vis-lista');
    var ref = S.db.ref(S.base + '/avatar/' + para);
    Promise.all([ref.child('xp_total').once('value'), ref.child('regalos').once('value')]).then(function (r) {
      var suXp = Number(r[0].val()) || 0, suyos = r[1].val() || {};
      var opciones = CATALOGO.filter(function (m) {
        return m.xp > 0 && tengo(m) && !(S.regalos && S.regalos[m.id] && S.regalos[m.id].tipo === 'docente') &&
          !(S.requisitos && S.requisitos[m.id]) && suXp < m.xp && !suyos[m.id];
      });
      if (!opciones.length) { cont.textContent = 'Ya tiene todos los muebles que tú tienes.'; return; }
      cont.innerHTML = '<p class="esp-regalo-nota">Elige uno de tus muebles. Puedes regalar uno al día.</p>' +
        '<div class="esp-regalo-rejilla">' + opciones.map(function (m) {
          return '<button type="button" class="esp-regalo-op" data-id="' + m.id + '" title="' + esc(m.nom) + '">' +
            '<img src="' + RUTA + m.id + '_SE.png" alt=""><span>' + esc(m.nom) + '</span></button>';
        }).join('') + '</div>';
      var botonesRegalo = cont.querySelectorAll('.esp-regalo-op');
      var bloquear = function (si) { botonesRegalo.forEach(function (x) { x.disabled = si; }); };
      botonesRegalo.forEach(function (b) {
        b.addEventListener('click', function () {
          var m = POR_ID[b.dataset.id];
          if (!global.confirm('¿Regalarle «' + m.nom + '» a ' + nombre + '?')) return;
          bloquear(true);
          api('regalar', { para: para, mueble: m.id }).then(function (res) {
            if (res && res.ok) {
              delete S.regalos[m.id];
              Object.keys(S.misHabitaciones).forEach(function(h){S.misHabitaciones[h].pieza=S.misHabitaciones[h].pieza.filter(function(p){return p.id!==m.id;});});
              S.miPieza=S.misHabitaciones[S.habitacion].pieza;
              if (!S.visitando) S.pieza = S.miPieza;
              pintarMuebles(); botones(); dibujar();
              sincronizarInventario();
              panel.hidden = true;
              avisar('🎁 Le regalaste «' + m.nom + '» a ' + nombre + '. Ya no está en tus muebles.');
              return;
            }
            avisar((res && res.error) || 'No se pudo regalar');
            bloquear(false);
          }).catch(function () { avisar('No se pudo regalar'); bloquear(false); });
        });
      });
    }).catch(function () { cont.textContent = 'No se pudo cargar.'; });
  }

  // Los regalos que llegan se anuncian al tiro, y también los que llegaron
  // mientras no estaba (el último visto queda en este navegador).
  function escucharRegalos() {
    var clave = 'espRegalosVistos_' + S.uid, visto = 0;
    try { visto = Number(localStorage.getItem(clave)) || 0; } catch (e) {}
    if (S.refRegalos) S.refRegalos.off();
    S.refRegalos = S.db.ref(S.base + '/avatar/' + S.uid + '/regalos');
    S.refRegalos.on('child_added', function (snap) {
      var r = snap.val() || {}, m = POR_ID[snap.key];
      S.regalos[snap.key] = r;
      pintarMuebles();
      if (m && Number(r.ts) > visto) {
        visto = Number(r.ts);
        try { localStorage.setItem(clave, String(visto)); } catch (e) {}
        anunciar('🎁 ' + (r.de || 'Un compañero') + ' te regaló «' + m.nom + '». Ya está en tus muebles.');
      }
    });
  }
  function anunciar(texto) {
    var el = S.host.querySelector('#espAnuncio');
    if (!el) return;
    el.textContent = texto; el.hidden = false;
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.hidden = true; }, 8000);
  }

  // ---------------- placas ----------------
  function pintarPlacas() {
    var cont = S.host.querySelector('#espPlacas');
    if (!cont) return;
    var ganadas = Object.keys(PLACAS).filter(function (id) { return S.logros[id]; });
    if (!ganadas.length) {
      cont.innerHTML = '<h4>Placas</h4><p class="esp-placas-vacio">Todavía no tienes logros. ' +
        'Gánalos en <a href="logros.html">Logros</a> y ponte hasta ' + MAX_PLACAS + ' placas junto a tu nombre.</p>';
      return;
    }
    cont.innerHTML = '<h4>Placas <span>' + S.placas.length + ' de ' + MAX_PLACAS + ' puestas · se ven junto a tu nombre en la casa</span></h4>' +
      '<div class="esp-placas-lista">' + ganadas.map(function (id) {
        var pl = PLACAS[id], puesta = S.placas.indexOf(id) >= 0;
        return '<button type="button" class="esp-placa' + (puesta ? ' on' : '') + '" data-id="' + id + '"' +
          ' style="--rareza:' + (COLOR_RAREZA[pl[2]] || '#94a3b8') + '" aria-pressed="' + puesta + '">' +
          '<i>' + pl[0] + '</i><span>' + esc(pl[1]) + '</span></button>';
      }).join('') + '</div>';
    cont.querySelectorAll('.esp-placa').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.dataset.id, i = S.placas.indexOf(id);
        if (i >= 0) S.placas.splice(i, 1);
        else if (S.placas.length >= MAX_PLACAS) { marcarEstado('Máximo ' + MAX_PLACAS + ' placas: quita una primero', true); return; }
        else S.placas.push(id);
        guardar('placas', S.placas.slice());
        pintarPlacas(); dibujar();
      });
    });
  }

  function abrirVisitas() {
    if (!S.housesEnabled) { avisar('Las visitas están deshabilitadas'); return; }
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
    if (!S.housesEnabled) { avisar('Las casas están deshabilitadas'); return; }
    if (uid === S.sala || S.cargandoCasa || S.cambiando) return;
    S.cargandoCasa=true;
    var esMia = uid === S.uid;
    return esperarGuardado().then(function(){return api('habitaciones',{sala:uid});}).then(function (d) {
      if(!d||!d.ok)throw new Error(d&&d.error||'No se pudo cargar la casa');
      desconectarSala();
      S.visitando = !esMia;S.comun=d.comun===true;S.juego={};
      S.duenoNombre = d.nombre || nombreDueno || '';
      if(esMia)S.misHabitaciones=d.habitaciones;
      activarHabitacion(d.actual,d.habitaciones[d.actual],!esMia);
      return conectarSala(uid);
    }).then(function (ok) {
      if(ok)observarHabitacion(uid);
      else if(!esMia){S.cargandoCasa=false;return irACasa(S.uid);}
    }).catch(function (error) { avisar(error.message||'No se pudo entrar a esa casa'); })
      .finally(function(){S.cargandoCasa=false;});
  }
  function cargar_(n) { cargar(n, dibujar); }

  // ---------------- interfaz ----------------
  function plantilla() {
    return '' +
    '<div class="esp-tabs">' +
      '<button data-p="personaje" class="on">Mi personaje</button>' +
      '<button data-p="pieza">Mi casa</button>' +
      '<span class="esp-estado"></span>' +
    '</div>' +
    '<div class="esp-anuncio" id="espAnuncio" role="status" hidden></div>' +
    '<div id="espBloqueo" role="status" hidden style="margin:12px 0;padding:14px 16px;border:1px solid #f59e0b;background:#fffbeb;color:#78350f;font-weight:700">🔒 Casas y decoración deshabilitadas por ahora. Los muebles se entregarán por tareas completadas.</div>' +
    '<div class="esp-panel" data-panel="personaje">' +
      '<div class="esp-personaje">' +
        '<div class="esp-vista"><div class="esp-figura" id="espFigura"></div>' +
          '<button class="esp-azar" type="button">Al azar</button></div>' +
        '<div class="esp-ropero" id="espRopero"></div>' +
      '</div>' +
      '<details class="esp-kit"><summary>Probar poses y direcciones</summary>' +
        '<p>Vista previa con tu ropa. En casa, camina hasta una silla o cama para usarla.</p>' +
        '<div class="esp-kit-rejilla">' + global.AvatarLookSystem.KIT.filter(function(p){return p.tipo==='pose';}).map(function(p){
          return '<button type="button" data-pose="'+p.opcion+'" aria-pressed="false"><img loading="lazy" src="'+p.url+'" alt=""><span>'+esc(p.nombre)+'</span></button>';
        }).join('') + '</div></details>' +
      '<div class="esp-placas" id="espPlacas"></div>' +
    '</div>' +
    '<div class="esp-panel oculto" data-panel="pieza">' +
      '<div class="esp-sala-cab" id="espSalaCab"></div>' +
      '<div class="esp-modos" aria-label="Modo de la habitación"><button type="button" id="espCaminar" aria-pressed="true">Caminar</button><button type="button" id="espDecorar" aria-pressed="false">Decorar</button><button type="button" id="espDetener">Detener</button></div>' +
      '<div class="esp-escena"><canvas id="espLienzo" tabindex="0" aria-label="Tu casa. Flechas para moverte, Tab para elegir un mueble."></canvas>' +
        '<div class="esp-acciones">' +
          '<button id="espAnt" title="Mueble anterior (Mayús+Tab)">◀</button>' +
          '<button id="espSig" title="Mueble siguiente (Tab)">▶</button>' +
          '<button id="espUsar" title="Interactuar (E)" disabled>Usar</button>' +
          '<button id="espRotar" title="Girar (R)" disabled>⟳</button>' +
          '<button id="espQuitar" title="Guardar en el cajón (Supr)" disabled>✕</button>' +
          '<button id="espSoltar" title="Soltar (Esc)" disabled>✓</button>' +
        '</div>' +
        '<div class="esp-terreno" id="espTerreno">' +
          '<button data-t="piso" title="Cambiar piso">Piso</button>' +
          '<button data-t="muro" title="Cambiar muros">Muros</button>' +
          '<button data-t="tamano" title="Cambiar tamaño de la habitación">Tamaño</button>' +
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
      '<div class="esp-vista-controles" aria-label="Vista de la habitación">' +
        '<button type="button" id="espAlejar" title="Alejar vista">−</button>' +
        '<span id="espZoomNivel">Vista completa</span>' +
        '<button type="button" id="espAcercar" title="Acercar vista">+</button>' +
        '<button type="button" id="espPan" aria-pressed="false" title="Arrastra la habitación para ver otras zonas">Mover vista</button>' +
        '<button type="button" id="espCentrar" title="Volver a la vista completa">Centrar</button>' +
      '</div>' +
      '<details class="esp-kit esp-kit-gestos"><summary>Gestos del personaje</summary>' +
        '<div class="esp-gestos" aria-label="Gestos del personaje">' + global.AvatarLookSystem.GESTOS.map(function(g){
          return '<button type="button" data-gesto="'+g.id+'"><img loading="lazy" src="'+g.imagen+'" alt=""><span>'+esc(g.nombre)+'</span></button>';
        }).join('')+'</div></details>' +
      '<div class="esp-ayuda">Toca el suelo para caminar o una silla para sentarte. La puerta conecta las dos salas. En «Decorar», selecciona y mueve muebles.</div>' +
      '<div id="espReto" class="esp-reto" hidden aria-live="polite"></div>' +
      '<details class="esp-kit esp-interacciones" open><summary>Usar muebles</summary><div id="espAccionesMuebles" class="esp-acciones-muebles"></div></details>' +
      '<div class="esp-chat">' +
        '<div class="esp-chat-lista" id="espChatLista"></div>' +
        '<form class="esp-chat-form" id="espChatForm" autocomplete="off">' +
          '<input id="espChatTexto" maxlength="200" placeholder="Escribe algo… (sin garabatos)">' +
          '<button type="submit">Decir</button>' +
        '</form>' +
      '</div>' +
      '<section id="espMueblesBloque" class="esp-muebles-integrados" aria-labelledby="espMueblesTitulo">' +
        '<h3 id="espMueblesTitulo">Muebles de mi casa</h3>' +
        '<div class="esp-subtabs"><button data-f="tengo" class="on">Tengo</button>' +
          '<button data-f="faltan">Por ganar</button><span id="espCuenta"></span></div>' +
        '<div class="esp-familias" id="espFamilias">' +
          FAMILIAS.map(function (f, i) {
            return '<button data-fam="' + f.id + '"' + (i === 0 ? ' class="on"' : '') + '>' + f.nom + '</button>';
          }).join('') +
        '</div>' +
        '<div class="esp-rejilla" id="espRejilla"></div>' +
      '</section>' +
    '</div>';
  }

  function pintarRopero() {
    var cont = S.host.querySelector('#espRopero');
    var cats = global.AvatarLookSystem.getEditorCategories({ xpTotal: S.xp, regalos:S.regalos });
    cont.innerHTML = cats.map(function (c) {
      return '<div class="esp-cat"><h4>' + esc(c.label) + '</h4><div class="esp-ops">' +
        c.options.map(function (o) {
          var sel = S.look[c.id] === o.id ? ' sel' : '';
          var blo = o.locked ? ' blo' : '';
          var preview=global.AvatarLookSystem.getKitPreview(c.id,o.id);
          var muestra = o.color ? '<i style="background:' + o.color + '"></i>' :
            (preview ? '<img loading="lazy" src="'+preview+'" alt="">' : '') + '<span>' + esc(o.name) + '</span>';
          return '<button class="esp-op' + sel + blo + (preview ? ' esp-op-imagen' : '') + '" data-cat="' + c.id + '" data-op="' + o.id + '" aria-pressed="'+!!sel+'"' +
                 ' title="' + (o.locked ? 'Se abre con ' + o.minXp + ' XP' : esc(o.name)) + '">' +
                 muestra + (o.locked ? '<b>🔒</b>' : o.gifted ? '<b>🎁</b>' : '') + '</button>';
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
    var pose=S.previewPose||'reposoSE';
    global.AvatarLookSystem.render(S.host.querySelector('#espFigura'), { look: S.look, xpTotal: S.xp, regalos:S.regalos, size: 170,
      dir:pose.slice(-2), postura:pose==='sentado'||pose==='acostado' ? pose : '', caminar:pose.indexOf('paso')===0, t:Date.now() });
  }
  // El personaje también se muestra arriba, junto al nombre: si cambia acá,
  // tiene que cambiar allá en el mismo momento.
  function avisarLook() {
    if (typeof S.alCambiarLook === 'function') S.alCambiarLook(S.look,S.regalos);
  }

  var filtro = 'tengo', familia = 'todo';
  function pintarMuebles() {
    var cont = S.host.querySelector('#espRejilla');
    var lista = CATALOGO.filter(function (m) {
      if(m.acabado)return false;
      if (familia !== 'todo' && m.fam !== familia) return false;
      return filtro === 'tengo' ? tengo(m) : !tengo(m);
    });
    S.host.querySelector('#espCuenta').textContent =
      CATALOGO.filter(function(m){return !m.acabado && tengo(m);}).length + ' de ' + CATALOGO.filter(function(m){return !m.acabado;}).length;
    cont.innerHTML = lista.map(function (m) {
      var n = colocados(m.id),otra=Number(m.xp||0)>0 && Object.keys(S.misHabitaciones).find(function(h){return h!==S.habitacion&&S.misHabitaciones[h].pieza.some(function(p){return p.id===m.id;});});
      var regalo = S.regalos[m.id];
      return '<div class="esp-item' + (tengo(m) ? '' : ' blo') + (S.elegido === m.id ? ' sel' : '') +
        '" data-id="' + m.id + '">' +
        '<img loading="lazy" src="' + RUTA + m.id + '_SE.png" alt="' + esc(m.nom) + '">' +
        '<div class="esp-nom">' + esc(m.nom) + '</div>' +
        (tengo(m) ? ((S.recompensas && S.recompensas[m.id]) ? '<div class="esp-req">✓ Tarea completada</div>' : '') : '<div class="esp-req">🔒 ' + esc(requisitoDe(m)) + '</div>') +
        (regalo ? '<span class="esp-regalo" title="Regalo de ' + esc(regalo.de || 'un compañero') + '">🎁</span>' : '') +
        (n ? '<span class="esp-cont">' + n + '</span>' : '') + (otra?'<div class="esp-req">En '+(otra==='estudio'?'Estudio':'Principal')+'</div>':'')+'</div>';
    }).join('');
    cont.querySelectorAll('.esp-item').forEach(function (el) {
      el.addEventListener('click', function () {
        var m = POR_ID[el.dataset.id];
        if (!tengo(m)) { avisar(requisitoDe(m)); return; }
        if (!S.housesEnabled) { avisar('La decoración está deshabilitada por ahora'); return; }
        if (S.visitando) { avisar('Los muebles se ponen en tu casa'); return; }
        if(Number(m.xp||0)>0 && colocados(m.id) && !S.pieza.some(function(p){return p.id===m.id;})){avisar('Guárdalo primero en la otra habitación para moverlo aquí');return;}
        modoDecorar(true);
        DIRS.forEach(function (d) { cargar_(m.id + '_' + d); });
        S.elegido = (S.elegido === m.id) ? null : m.id;
        S.sel = -1; botones(); pintarMuebles();
        if (S.elegido) { verPanel('pieza'); avisar(esDePared(S.elegido) ? 'Toca un punto del muro' : 'Ahora toca una baldosa del piso'); }
        dibujar();
      });
    });
  }

  function botones() {
    var elegido = S.pieza[S.sel];
    var usar = S.host.querySelector('#espUsar');
    usar.disabled = !S.housesEnabled || !elegido || elegido.pared || !CATALOGO.accion(elegido.id);
    var accion=elegido&&CATALOGO.accion(elegido.id);
    usar.textContent = accion&&accion.tipo==='encender' ? (elegido.encendido ? 'Apagar' : 'Encender') : accion?accion.nombre:'Usar';
    S.host.querySelector('#espRotar').disabled = !S.housesEnabled || S.sel < 0;
    S.host.querySelector('#espQuitar').disabled = !S.housesEnabled || S.sel < 0;
    S.host.querySelector('#espSoltar').disabled = !S.housesEnabled || (S.sel < 0 && !S.elegido);
  }

  // ---------------- teclado y pad: sin mouse ----------------
  // Las flechas van en dirección de pantalla: arriba es hacia el rincón, abajo
  // hacia el frente. Cada pulsación es una baldosa en diagonal de la grilla.
  var PASO_TECLA = { ArrowUp:[-1,-1], ArrowDown:[1,1], ArrowLeft:[-1,1], ArrowRight:[1,-1],
                     w:[-1,-1], s:[1,1], a:[-1,1], d:[1,-1] };
  function elegirMueble(delta) {
    if (S.visitando) return;
    modoDecorar(true);
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
  function usarSeleccion() {
    if (!S.housesEnabled || S.sel < 0) return;
    var m = S.pieza[S.sel];
    if (!m || m.pared) return;
    interactuarIndice(S.sel);
  }

  function pintarInteracciones(){
    if(!S.host)return;
    var cont=S.host.querySelector('#espAccionesMuebles');if(!cont)return;
    cont.innerHTML=S.pieza.map(function(m,i){var a=CATALOGO.accion(m.id);if(!a||m.pared)return '';var disabled=!S.housesEnabled||(S.visitando&&!S.comun&&a.tipo==='encender');return '<button type="button" data-usar="'+i+'"'+(disabled?' disabled':'')+'>'+esc(ficha(m.id).nom)+(m.clave?' · '+esc(m.clave):'')+'<span>'+(a.tipo==='encender'?(m.encendido?'Apagar':'Encender'):a.nombre)+'</span></button>';}).join('')||'<p>No hay muebles con acciones en esta habitación.</p>';
    cont.querySelectorAll('[data-usar]').forEach(function(b){b.addEventListener('click',function(){interactuarIndice(Number(b.dataset.usar));});});
    pintarReto();
  }
  function pintarReto(){
    var reto=S.host.querySelector('#espReto');if(!reto)return;reto.hidden=!S.comun;
    if(S.comun){var now=Date.now(),luces=S.juego&&S.juego.luces||{},n=Object.keys(luces).filter(function(k){return now-Number(luces[k].ts)<60000;}).length;
      var changed=false;S.pieza.forEach(function(m,i){if(!m.clave)return;var on=!!luces[m.clave]&&now-Number(luces[m.clave].ts)<60000;if(m.encendido!==on){m.encendido=on;changed=true;var span=S.host.querySelector('[data-usar="'+i+'"] span');if(span)span.textContent=on?'Apagar':'Encender';}});if(changed)dibujar();
      var win=Number(S.juego&&S.juego.completadoHasta)>now;
      var texto=win?'¡Desafío completado! Tres compañeros encendieron las tres luces.':'Desafío del curso · '+n+'/3 luces. Tres compañeros deben encender una luz distinta en menos de un minuto. Cada persona mantiene una luz.';
      if(reto.textContent!==texto)reto.textContent=texto;
      reto.classList.toggle('completo',win);
    }
  }
  function interactuarIndice(i){
    var m=S.pieza[i],a=m&&CATALOGO.accion(m.id);
    if(!m||!a||!S.housesEnabled||S.cambiando||S.cargandoCasa)return;
    if(S.visitando&&!S.comun&&a.tipo==='encender'){avisar('Solo el dueño enciende los muebles');return;}
    var sala=S.sala,h=S.habitacion,destino;
    if(esSentable(m.id))destino={col:m.col,fila:m.fila};
    else {
      var from={col:Math.round(S.av.col),fila:Math.round(S.av.fila)},mejor=null;
      global.MapasCasa.celdas(ficha(m.id),m).forEach(function(c){[[1,0],[-1,0],[0,1],[0,-1]].forEach(function(d){var p={col:c.col+d[0],fila:c.fila+d[1]},r=ruta(from,p);if(r&&(!mejor||r.length<mejor.r.length))mejor={p:p,r:r};});});
      if(!mejor){avisar('Deja un espacio libre junto al mueble');return;}destino=mejor.p;
    }
    modoDecorar(false);
    caminar(destino,function(){
      if(S.sala!==sala||S.habitacion!==h)return;
      var payload={sala:sala,habitacion:h,indice:i,mueble:m.id,col:m.col,fila:m.fila,encendido:!m.encendido,operacion:global.crypto&&global.crypto.randomUUID?global.crypto.randomUUID():'accion_'+Date.now()+'_'+Math.random().toString(36).slice(2)};
      esperarGuardado().then(function(){return api('latido',{sala:sala,habitacion:h,col:destino.col,fila:destino.fila});})
        .then(function(r){if(!r||!r.ok)throw Error('No se pudo confirmar tu posición');return api('interactuar',payload);})
        .then(function(r){if(!r||!r.ok)throw Error(r&&r.error||'No se pudo confirmar la acción');if(S.sala!==sala||S.habitacion!==h)return;
          if(a.tipo==='encender'){m.encendido=payload.encendido;if(r.juego)S.juego=r.juego;avisar(m.encendido?'Encendido':'Apagado');}
          else {S.gesto={id:a.gesto||'',hasta:r.hasta};S.actividad={tipo:r.actividad,hasta:r.hasta};avisar(a.nombre+' · '+ficha(m.id).nom);}
          pintarInteracciones();botones();dibujar();
        }).catch(function(e){avisar(e.message||'Sin conexión. Puedes reintentar.');});
    });
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
      if (!haySuelo(c, f)) return;
      var no = estorbo(m.id, c, f, S.sel,m.dir);
      if (no) { avisar(no); return; }
      var oc = ocupacion(c, f, S.sel);
      m.col = c; m.fila = f; m.sobre = oc.base >= 0 && !!ficha(m.id).apila;
    }
    dibujar(); guardar('pieza', S.pieza);
  }
  function tecla(k, ev) {
    if (!S.housesEnabled || S.cambiando) return;
    if (k === 'Tab') { if (ev) ev.preventDefault(); elegirMueble(ev && ev.shiftKey ? -1 : 1); return; }
    if (k === 'Escape') { if(caminando){caminando.detener=true;caminando.siguiente=null;}modoDecorar(false);return; }
    if ((k==='e'||k==='E')&&S.sel<0){if(ev)ev.preventDefault();irPorPuerta();return;}
    if ((k === 'e' || k === 'E') && S.sel >= 0) { if (ev) ev.preventDefault(); usarSeleccion(); return; }
    if ((k === 'r' || k === 'R') && S.sel >= 0) { S.host.querySelector('#espRotar').click(); return; }
    if ((k === 'Delete' || k === 'Backspace') && S.sel >= 0) { if (ev) ev.preventDefault(); S.host.querySelector('#espQuitar').click(); return; }
    var paso = PASO_TECLA[k] || PASO_TECLA[String(k).toLowerCase()];
    if (!paso) return;
    if (ev) ev.preventDefault();
    if (S.sel >= 0 && !S.visitando) { moverSeleccion(paso[0], paso[1]); return; }
    var c = Math.round(S.av.col) + paso[0], f = Math.round(S.av.fila) + paso[1];
    // En diagonal de pantalla se cruzan dos baldosas; si el destino se sale,
    // se prueba media diagonal para no quedarse pegado en los bordes.
    if (!haySuelo(c, f)) {
      var c2 = Math.round(S.av.col) + (paso[0] !== 0 ? paso[0] : 0), f2 = Math.round(S.av.fila);
      if (!haySuelo(c2, f2)) { c2 = Math.round(S.av.col); f2 = Math.round(S.av.fila) + paso[1]; }
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
    S.host.querySelector('#espUsar').addEventListener('click', function () { usarSeleccion(); S.cv.focus(); });
    S.host.querySelector('#espSoltar').addEventListener('click', function () { soltar(); S.cv.focus(); });
    S.cv.addEventListener('pointerdown', function () { S.cv.focus({ preventScroll: true }); });
  }

  // ---------------- terreno: piso y muros ----------------
  function abrirPaleta(tipo) {
    if (!S.housesEnabled) { avisar('La decoración está deshabilitada'); return; }
    if (S.visitando) { avisar('El terreno se cambia en tu casa'); return; }
    var panel = S.host.querySelector('#espPaleta');
    var lista = tipo === 'piso' ? PISOS : (tipo === 'muro' ? MUROS : TAMANOS);
    var actual = tipo === 'piso' ? pisoDe(S.casa.piso) : (tipo === 'muro' ? muroDe(S.casa.muro).id : tamanoDe(S.casa.tamano).id);
    panel.hidden = false;
    panel.innerHTML = '<div class="esp-vis-cab"><b>' + (tipo === 'piso' ? 'Piso' : (tipo === 'muro' ? 'Muros' : 'Tamaño')) + '</b><button class="esp-btn-chico" id="espCerrarPal">Cerrar</button></div>' +
      '<div class="esp-vis-lista">' + lista.map(function (o) {
        var blo = o.regalo ? !tengo(ficha(o.regalo)) : S.xp < o.xp;
        var muestra = tipo === 'tamano' ? '<i class="esp-tamano-icono">◇</i>' : tipo === 'piso'
          ? '<img src="' + RUTA + (o.id === 'claro' ? 'floorFull_SE' : 'floorFull__' + o.id + '_SE') + '.png" alt="">'
          : o.regalo ? '<img src="'+RUTA+o.regalo+'_SE.png" alt="">' : '<i style="background:linear-gradient(90deg,' + o.izq + ',' + o.der + ')"></i>';
        return '<button class="esp-vis-item' + (blo ? ' blo' : '') + (o.id === actual ? ' sel' : '') + '" data-id="' + o.id + '">' +
          muestra + '<span>' + esc(o.nom) + '</span><em>' + (blo ? (o.regalo ? 'Premio del profesor' : o.xp + ' XP') : (o.id === actual ? 'actual' : o.regalo ? '🎁 Recibido' : '')) + '</em></button>';
      }).join('') + '</div>';
    panel.querySelector('#espCerrarPal').addEventListener('click', function () { panel.hidden = true; });
    panel.querySelectorAll('.esp-vis-item').forEach(function (b) {
      b.addEventListener('click', function () {
        var o = lista.filter(function (x) { return x.id === b.dataset.id; })[0];
        if (!o) return;
        if (o.regalo ? !tengo(ficha(o.regalo)) : S.xp < o.xp) { avisar(o.regalo ? 'Este acabado se recibe del profesor' : 'Se abre con ' + o.xp + ' XP'); return; }
        if (tipo === 'tamano' && o.id !== actual) {
          var fuera = S.pieza.some(function (m) { return !m.pared && !global.MapasCasa.celdas(ficha(m.id),m).every(function(c){return sueloEn(o,c.col,c.fila);}); });
          if (fuera) { avisar('Guarda o mueve los muebles que quedarían fuera'); return; }
          if (caminando) { avisar('Termina de caminar antes de cambiar el tamaño'); return; }
          if (Object.keys(S.otros || {}).some(function (uid) {
            if (uid === S.uid) return false;
            var v = S.otros[uid];
            return !sueloEn(o, Math.round(Number(v.col)), Math.round(Number(v.fila)));
          })) {
            avisar('Espera a que las visitas regresen al centro'); return;
          }
        }
        S.casa[tipo] = o.id; S.miCasa = S.casa;
        if (tipo === 'tamano') {
          aplicarTamano();
          if (!haySuelo(Math.round(S.av.col), Math.round(S.av.fila))) {
            S.av = entrada(); S.miAv = { col: S.av.col, fila: S.av.fila };
            S.destino = null; guardar('personajeEn', S.miAv); avisarPosicion();
          }
          S.pan = { x: 0, y: 0 }; S.zoomFactor = 1; actualizarVista();
        }
        panel.hidden = true; dibujar(); guardar('casa', S.casa);
      });
    });
  }
  function verPanel(cual) {
    S.host.querySelectorAll('.esp-panel').forEach(function (p) { p.classList.toggle('oculto', p.dataset.panel !== cual); });
    S.host.querySelectorAll('.esp-tabs button').forEach(function (b) { b.classList.toggle('on', b.dataset.p === cual); });
    if (cual === 'pieza') setTimeout(dibujar, 40);
  }

  function aplicarDisponibilidad() {
    var bloqueo = S.host.querySelector('#espBloqueo');
    if (bloqueo) bloqueo.hidden = S.housesEnabled;
    var casaButton = S.host.querySelector('.esp-tabs button[data-p="pieza"]');
    if (casaButton) casaButton.title = S.housesEnabled ? '' : 'Puedes mirar tus premios; el uso está deshabilitado por el profesor';
    var chatInput = S.host.querySelector('#espChatTexto');
    var chatButton = S.host.querySelector('#espChatForm button');
    if (chatInput) chatInput.disabled = !S.housesEnabled;
    if (chatButton) chatButton.disabled = !S.housesEnabled;
    botones();
    pintarInteracciones();
    if (!S.housesEnabled) desconectarSala();
  }

  function sincronizarDisponibilidad() {
    return api('estado').then(function (state) {
      var enabled = !!(state && state.enabled);
      var changed = enabled !== S.housesEnabled;
      S.housesEnabled = enabled;
      aplicarDisponibilidad();
      if (enabled && !S.sala) { irACasa(S.uid); escucharRegalos(); }
      if (changed) anunciar(enabled ? '🔓 Casas y decoración habilitadas.' : '🔒 Casas y decoración deshabilitadas.');
    }).catch(function () { S.housesEnabled = false; aplicarDisponibilidad(); });
  }

  function aplicarInventario(data) {
    var anteriores = S.recompensas || {};
    var regalosAnteriores = S.regalos || {};
    var primeraCarga = !S.inventoryReady;
    S.recompensas = (data && data.desbloqueados && typeof data.desbloqueados === 'object') ? data.desbloqueados : {};
    S.requisitos = (data && data.requisitos && typeof data.requisitos === 'object') ? data.requisitos : {};
    if (data && data.regalos && typeof data.regalos === 'object') S.regalos = data.regalos;
    if(data && Number.isFinite(data.xpTotal))S.xp=data.xpTotal;
    S.logros=global.AvatarLookSystem.logrosConPremios(S.logros,S.regalos);
    S.placas=placasValidas(S.placas,S.logros);
    pintarRopero(); pintarFigura(); pintarPlacas();
    S.inventoryReady = true;
    if (!S.visitando) {
      Object.keys(S.misHabitaciones).forEach(function(h){S.misHabitaciones[h].pieza=S.misHabitaciones[h].pieza.filter(function(p){return !!POR_ID[p.id]&&tengo(POR_ID[p.id]);});});
      S.miPieza=S.misHabitaciones[S.habitacion].pieza;
      S.pieza = S.miPieza;
    }
    pintarMuebles(); botones(); dibujar();
    if (!primeraCarga) {
      var nuevos = Object.keys(S.recompensas).filter(function (id) { return !anteriores[id] && POR_ID[id]; });
      if (nuevos.length) anunciar('🎁 Desbloqueaste ' + nuevos.length + (nuevos.length === 1 ? ' mueble por completar una tarea.' : ' muebles por completar una tarea.'));
      var regalosNuevos = Object.keys(S.regalos || {}).filter(function (id) { return !regalosAnteriores[id] && POR_ID[id]; });
      if (!nuevos.length && regalosNuevos.length) anunciar('🎁 Recibiste «' + POR_ID[regalosNuevos[0]].nom + '». Ya está en tus muebles.');
    }
  }

  function sincronizarInventario() {
    return api('inventario').then(function (data) {
      if (data && data.ok) aplicarInventario(data);
    }).catch(function () {
      S.recompensas = {}; S.requisitos = {}; S.inventoryReady = false;
      pintarMuebles();
    });
  }

  function punto(ev) {
    var r = S.cv.getBoundingClientRect();
    var t = (ev.touches && ev.touches[0]) || ev;
    var W = S.cv.clientWidth, H = S.cv.clientHeight, z = S.zoom || 1;
    return { x: (t.clientX - r.left - W / 2) / z + W / 2 - S.pan.x,
      y: (t.clientY - r.top - H / 2) / z + H / 2 - S.pan.y };
  }
  function actualizarVista() {
    if (!S.host) return;
    var nivel = S.host.querySelector('#espZoomNivel');
    var pan = S.host.querySelector('#espPan');
    if (nivel) nivel.textContent = S.zoomFactor === 1 ? 'Vista completa' : Math.round(S.zoomFactor * 100) + ' %';
    if (pan) { pan.classList.toggle('on', !!S.panMode); pan.setAttribute('aria-pressed', String(!!S.panMode)); }
  }
  function muebleEn(x, y) {
    for (var i = cajas.length - 1; i >= 0; i--) {
      var c = cajas[i];
      if (x < c.x || x >= c.x+c.w || y < c.y || y >= c.y+c.h)continue;
      var im=imgs[c.imagen];
      if(im&&!im.mascara){var cv=document.createElement('canvas');cv.width=c.w;cv.height=c.h;var pen=cv.getContext('2d',{willReadFrequently:true});pen.drawImage(im,0,0);im.mascara=pen.getImageData(0,0,c.w,c.h).data;}
      if(!im||!im.mascara||im.mascara[(Math.floor(y-c.y)*c.w+Math.floor(x-c.x))*4+3]>24)return c.idx;
    }
    return -1;
  }

  function conectarLienzo() {
    S.cv.addEventListener('pointermove', function (ev) {
      if (S.panStart && ev.pointerId === S.panStart.id) {
        S.pan.x = S.panStart.x + (ev.clientX - S.panStart.px) / (S.zoom || 1);
        S.pan.y = S.panStart.y + (ev.clientY - S.panStart.py) / (S.zoom || 1);
        dibujar(); return;
      }
      var p = punto(ev), c = aCelda(p.x, p.y);
      S.hover = haySuelo(c.col, c.fila) ? c : null;
      dibujar();
    });
    S.cv.addEventListener('pointerdown', function (ev) {
      if (!S.housesEnabled || S.cambiando || S.cargandoCasa) { avisar('Espera a que la habitación esté lista'); return; }
      if (S.panMode) {
        S.panStart = { id: ev.pointerId, px: ev.clientX, py: ev.clientY, x: S.pan.x, y: S.pan.y };
        S.cv.setPointerCapture(ev.pointerId); return;
      }
      var p = punto(ev);
      var door=S.cajaPuerta;
      if(!S.decorando&&door&&p.x>=door.x&&p.x<=door.x+door.w&&p.y>=door.y&&p.y<=door.y+door.h){irPorPuerta();return;}
      // De visita solo se camina: la casa es de otro.
      if (S.visitando || !S.decorando) {
        var visitado = muebleEn(p.x, p.y);
        var asientoVisita = visitado >= 0 ? S.pieza[visitado] : null;
        if(asientoVisita&&CATALOGO.accion(asientoVisita.id)){interactuarIndice(visitado);return;}
        var cv = asientoVisita && esSentable(asientoVisita.id)
          ? { col: asientoVisita.col, fila: asientoVisita.fila } : aCelda(p.x, p.y);
        if (haySuelo(cv.col, cv.fila)) caminar(cv);
        return;
      }
      var idx = muebleEn(p.x, p.y);
      if (idx >= 0 && !S.elegido) {
        if (S.sel === idx && (esSentable(S.pieza[idx].id) || S.pieza[idx].id === 'rgbPartySpeaker')) { usarSeleccion(); return; }
        S.sel = (S.sel === idx) ? -1 : idx; botones(); dibujar(); return;
      }

      if (S.elegido && esDePared(S.elegido)) {
        if (Number(ficha(S.elegido).xp || 0) > 0 && colocados(S.elegido)) {
          avisar('Solo tienes una unidad de ese mueble. Muévela en vez de duplicarla.'); return;
        }
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
      if (!haySuelo(c.col, c.fila)) {
        if (S.sel >= 0 || S.elegido) { S.sel = -1; S.elegido = null; botones(); pintarMuebles(); dibujar(); }
        return;
      }
      if (S.elegido) {
        if (Number(ficha(S.elegido).xp || 0) > 0 && colocados(S.elegido)) {
          avisar('Solo tienes una unidad de ese mueble. Muévela en vez de duplicarla.'); return;
        }
        var no = estorbo(S.elegido, c.col, c.fila, -1);
        if (no) { avisar(no); return; }
        var oc = ocupacion(c.col, c.fila, -1);
        S.pieza.push({ id: S.elegido, col: c.col, fila: c.fila, dir: 'SE', sobre: oc.base >= 0 && !!ficha(S.elegido).apila });
        S.sel = S.pieza.length - 1; S.elegido = null; S.hover = null;
        botones(); pintarMuebles(); dibujar(); guardar('pieza', S.pieza);
        avisar('Puesto. Con ⟳ lo giras');
      } else if (S.sel >= 0) {
        var m = S.pieza[S.sel];
        var no2 = estorbo(m.id, c.col, c.fila, S.sel,m.dir);
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
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (eventName) {
      S.cv.addEventListener(eventName, function () { S.panStart = null; });
    });
    S.host.querySelector('#espAcercar').addEventListener('click', function () {
      S.zoomFactor = Math.min(2.5, Math.round((S.zoomFactor + .25) * 100) / 100); actualizarVista(); dibujar();
    });
    S.host.querySelector('#espAlejar').addEventListener('click', function () {
      S.zoomFactor = Math.max(1, Math.round((S.zoomFactor - .25) * 100) / 100);
      if (S.zoomFactor === 1) S.pan = { x: 0, y: 0 };
      actualizarVista(); dibujar();
    });
    S.host.querySelector('#espPan').addEventListener('click', function () {
      S.panMode = !S.panMode; actualizarVista();
      avisar(S.panMode ? 'Arrastra la habitación para mover la vista' : 'Vista lista para caminar y decorar');
    });
    S.host.querySelector('#espCentrar').addEventListener('click', function () {
      S.pan = { x: 0, y: 0 }; S.zoomFactor = 1; S.panMode = false; actualizarVista(); dibujar();
    });
    S.host.querySelector('#espRotar').addEventListener('click', function () {
      if (!S.housesEnabled || S.sel < 0 || S.visitando) return;
      var m = S.pieza[S.sel];
      if (m.pared) {
        m.pared = m.pared === 'izq' ? 'der' : 'izq';
        if (ranuraOcupada(m, S.sel)) { m.pared = m.pared === 'izq' ? 'der' : 'izq'; avisar('El otro muro está ocupado ahí'); return; }
      } else {
        var nextDir=DIRS[(DIRS.indexOf(m.dir) + 1) % DIRS.length];
        var problem=estorbo(m.id,m.col,m.fila,S.sel,nextDir);
        if(problem){avisar(problem);return;}
        m.dir = nextDir;
      }
      dibujar(); guardar('pieza', S.pieza);
    });
    S.host.querySelector('#espQuitar').addEventListener('click', function () {
      if (!S.housesEnabled || S.sel < 0 || S.visitando) return;
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
    S.host.querySelectorAll('[data-gesto]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (!S.housesEnabled || !S.sala) { avisar('La casa está deshabilitada'); return; }
        S.gesto = { id: b.dataset.gesto, hasta: Date.now() + 3400 };
        latido(); dibujar();
        clearTimeout(S.gestoTimer);
        S.gestoTimer = setTimeout(function () { S.gesto = null; dibujar(); }, 3450);
      });
    });
    conectarTeclado();
  }

  function montar(cfg) {
    S.habitacion='principal';S.decorando=false;S.cambiando=false;S.cargandoCasa=false;S.comun=false;S.juego={};
    S.saveErrors={};
    S.host = cfg.host; S.db = cfg.db; S.auth = cfg.auth; S.base = cfg.base; S.uid = cfg.uid;
    S.curso = cfg.curso || ''; S.miNombre = nombreCorto(cfg.nombre || '');
    S.xp = cfg.xp || 0; S.alCambiarLook = cfg.alCambiarLook;
    S.regalos = (cfg.regalos && typeof cfg.regalos === 'object') ? cfg.regalos : {};
    S.logros = global.AvatarLookSystem.logrosConPremios(cfg.logros,S.regalos);
    S.placas = placasValidas(cfg.placas, S.logros);
    S.recompensas = {};
    S.requisitos = {};
    S.inventoryReady = false;
    S.housesEnabled = false;
    S.stateTimer = null;
    S.inventoryTimer = null;
    S.fxTimer = null;
    S.fxTime = 0;
    S.look = global.AvatarLookSystem.normalizeLook(cfg.look, { xpTotal: S.xp,regalos:S.regalos });
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
    S.misHabitaciones={principal:{casa:S.miCasa,pieza:S.miPieza,personajeEn:S.miAv},estudio:global.MapasCasa.habitacion({},'estudio')};
    S.casa = S.miCasa;
    aplicarTamano();
    S.pan = { x: 0, y: 0 }; S.zoomFactor = 1; S.panMode = false; S.panStart = null;
    var posicionCorregida = !haySuelo(S.miAv.col, S.miAv.fila);
    if (posicionCorregida) S.miAv = entrada();
    S.av = { col: S.miAv.col, fila: S.miAv.fila };
    S.sel = -1; S.elegido = null; S.hover = null;
    S.visitando = false; S.sala = null; S.otros = {}; S.vistos = {}; S.placasDe = {}; S.destino = null; S.burbujas = {};

    S.host.innerHTML = plantilla();
    S.cv = S.host.querySelector('#espLienzo');
    S.cx = S.cv.getContext('2d');
    S.host.querySelector('#espCaminar').addEventListener('click',function(){modoDecorar(false);});
    S.host.querySelector('#espDecorar').addEventListener('click',function(){modoDecorar(true);});
    S.host.querySelector('#espDetener').addEventListener('click',function(){if(caminando){caminando.detener=true;caminando.siguiente=null;}});
    S.cv.addEventListener('pointerleave',function(){S.hover=null;dibujar();});
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
      S.look = global.AvatarLookSystem.randomizeLook({ xpTotal: S.xp,regalos:S.regalos });
      pintarFigura(); pintarRopero(); dibujar(); avisarLook(); guardar('look', S.look); latido();
    });

    ['floorFull_SE'].forEach(function (n) { cargar(n, dibujar); });
    S.pieza.forEach(function (m) { DIRS.forEach(function (d) { cargar(m.id + '_' + d, dibujar); }); });

    S.previewPose='reposoSE';
    S.host.querySelectorAll('[data-pose]').forEach(function(b){
      b.addEventListener('click',function(){
        S.previewPose=b.dataset.pose;
        S.host.querySelectorAll('[data-pose]').forEach(function(op){op.setAttribute('aria-pressed',String(op===b));});
        pintarFigura();
      });
    });
    pintarFigura(); pintarRopero(); pintarPlacas(); pintarMuebles(); botones(); conectarLienzo(); pintarCabecera(); aplicarDisponibilidad();
    global.addEventListener('resize', dibujar);
    global.addEventListener('pagehide', function () { clearInterval(S.stateTimer); clearInterval(S.inventoryTimer); clearInterval(S.fxTimer); desconectarSala(); });
    setTimeout(dibujar, 80);
    S.fxTimer = setInterval(function () {
      if(S.comun&&Math.floor(Date.now()/1000)!==S.ultimoSegundo){S.ultimoSegundo=Math.floor(Date.now()/1000);pintarReto();}
      if (document.hidden || global.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (S.previewPose && S.previewPose.indexOf('paso')===0 && !S.host.querySelector('[data-panel="personaje"]').classList.contains('oculto')) pintarFigura();
      if (!S.housesEnabled || S.host.querySelector('[data-panel="pieza"]').classList.contains('oculto')) return;
      var gestoActivo = S.gesto && S.gesto.hasta>Date.now() || Object.keys(S.otros).some(function(uid){return Number(S.otros[uid].gestoHasta)>Date.now();});
      var animacionCambio=!!gestoActivo!==S.animacionActivaAnterior;S.animacionActivaAnterior=!!gestoActivo;
      var efecto = S.pieza.some(function (m) { return esMascota(m.id) || ficha(m.id).efecto || m.id === 'aquarium' || (m.id === 'rgbPartySpeaker' && m.encendido); });
      // El parpadeo solo requiere dos redibujos por ciclo, no un bucle continuo.
      var blink=Math.floor(Date.now()%4800/150)===0;
      if(!animacionCambio && !gestoActivo && !efecto && blink===S.blinkAnterior)return;
      S.blinkAnterior=blink;
      S.fxTime = performance.now();
      dibujar();
    }, 120);

    if (S.auth && S.db) {
      sincronizarDisponibilidad();
      sincronizarInventario();
      S.stateTimer = setInterval(sincronizarDisponibilidad, 15000);
      S.inventoryTimer = setInterval(sincronizarInventario, 60000);
    }
  }

  global.MiEspacio = { montar: montar, CATALOGO: CATALOGO, PISOS: PISOS, MUROS: MUROS,
                       nombreVisible: nombreVisible, nombreCorto: nombreCorto,
                       PLACAS: PLACAS, placasValidas: placasValidas };
})(window);
