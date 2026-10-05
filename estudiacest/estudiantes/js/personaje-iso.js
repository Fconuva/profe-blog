/* Personaje de Estudia CEST.
 *
 * Reemplaza al sistema anterior de máscaras SVG, que se dibujaban con tres o
 * cuatro trazos y salían amorfas. Este se traza por código en un canvas, con
 * color plano y cabeza grande, para que combine con los muebles isométricos.
 *
 * La prenda y su color son opciones separadas: eso multiplica las
 * combinaciones sin multiplicar el dibujo.
 *
 * Mantiene la API pública anterior (window.AvatarLookSystem) para no romper las
 * páginas que ya la usaban.
 */
(function (global) {
  'use strict';

  var C = {   // paletas reutilizables
    pelo: [
      { id:'negro',   nom:'Negro',   color:'#2b2320' },
      { id:'castano', nom:'Castaño', color:'#5a3821' },
      { id:'claro',   nom:'Claro',   color:'#a97b46' },
      { id:'rubio',   nom:'Rubio',   color:'#d9ab5c' },
      { id:'cobre',   nom:'Cobre',   color:'#a8442a', xp:260 },
      { id:'azul',    nom:'Azul',    color:'#3a6fb0', xp:900 },
      { id:'menta',   nom:'Menta',   color:'#3f9e86', xp:900 },
      { id:'rosa',    nom:'Rosa',    color:'#c96a97', xp:1400 }
    ],
    ropa: [
      { id:'blanco',  nom:'Blanco',  color:'#f2f5f8' },
      { id:'celeste', nom:'Celeste', color:'#4fb0e0' },
      { id:'rojo',    nom:'Rojo',    color:'#d95d4a' },
      { id:'gris',    nom:'Gris',    color:'#8b96a3' },
      { id:'verde',   nom:'Verde',   color:'#5aa46a', xp:200 },
      { id:'morado',  nom:'Morado',  color:'#8663c4', xp:480 },
      { id:'naranja', nom:'Naranja', color:'#e0854a', xp:480 },
      { id:'amarillo',nom:'Amarillo',color:'#e3c15a', xp:700 },
      { id:'negro',   nom:'Negro',   color:'#333b47', xp:1000 },
      { id:'colegio', nom:'Del colegio', color:'#1e3a6d', xp:1600 }
    ],
    abajo: [
      { id:'jeans',  nom:'Jeans',  color:'#3f5a80' },
      { id:'gris',   nom:'Gris',   color:'#59636f' },
      { id:'negro',  nom:'Negro',  color:'#2f353e' },
      { id:'beige',  nom:'Beige',  color:'#b39a76', xp:340 },
      { id:'verde',  nom:'Verde',  color:'#4c6b4f', xp:340 },
      { id:'burdeo', nom:'Burdeo', color:'#7a3b45', xp:760 },
      { id:'celeste',nom:'Celeste',color:'#6f9fc4', xp:760 },
      { id:'colegio',nom:'Del colegio', color:'#26324a', xp:1600 }
    ],
    calzado: [
      { id:'negro',  nom:'Negro',  color:'#2c3340' },
      { id:'blanco', nom:'Blanco', color:'#eef2f6' },
      { id:'rojo',   nom:'Rojo',   color:'#c1503f', xp:300 },
      { id:'azul',   nom:'Azul',   color:'#3d6ca8', xp:300 },
      { id:'cafe',   nom:'Café',   color:'#7a5335', xp:650 },
      { id:'menta',  nom:'Menta',  color:'#4aa08a', xp:1200 }
    ]
  };

  var CATALOGO = {
    piel: { label:'Piel', opciones:[
      { id:'clara',  nom:'Clara',  color:'#f6d5bf' },
      { id:'miel',   nom:'Miel',   color:'#e6b184' },
      { id:'canela', nom:'Canela', color:'#c78b5c' },
      { id:'bronce', nom:'Bronce', color:'#a3673f' },
      { id:'cacao',  nom:'Cacao',  color:'#7b4a30' },
      { id:'ebano',  nom:'Ébano',  color:'#553122' }
    ]},
    pelo: { label:'Peinado', opciones:[
      { id:'corto',    nom:'Corto' },
      { id:'rapado',   nom:'Rapado' },
      { id:'tazon',    nom:'Tazón' },
      { id:'crespo',   nom:'Crespo',   xp:150 },
      { id:'largo',    nom:'Largo',    xp:320 },
      { id:'colita',   nom:'Colita',   xp:520 },
      { id:'mono',     nom:'Moño',     xp:520 },
      { id:'afro',     nom:'Afro',     xp:900 },
      { id:'mohicano', nom:'Mohicano', xp:1200 }
    ]},
    peloColor: { label:'Color de pelo', opciones: C.pelo },
    cejas: { label:'Cejas', opciones:[
      { id:'normales', nom:'Normales' },
      { id:'gruesas',  nom:'Gruesas' },
      { id:'finas',    nom:'Finas' },
      { id:'alzadas',  nom:'Alzadas', xp:260 }
    ]},
    ojos: { label:'Ojos', opciones:[
      { id:'normales', nom:'Normales' },
      { id:'grandes',  nom:'Grandes' },
      { id:'alegres',  nom:'Alegres', xp:180 },
      { id:'serios',   nom:'Serios',  xp:400 },
      { id:'brillo',   nom:'Con brillo', xp:860 }
    ]},
    boca: { label:'Boca', opciones:[
      { id:'sonrisa', nom:'Sonrisa' },
      { id:'media',   nom:'Media' },
      { id:'seria',   nom:'Seria' },
      { id:'risa',    nom:'Risa',   xp:420 },
      { id:'picara',  nom:'Pícara', xp:1000 }
    ]},
    arriba: { label:'Ropa de arriba', opciones:[
      { id:'polera',   nom:'Polera' },
      { id:'manga',    nom:'Manga larga' },
      { id:'poleron',  nom:'Polerón',  xp:380 },
      { id:'camisa',   nom:'Camisa',   xp:620 },
      { id:'chaleco',  nom:'Chaleco',  xp:1150 },
      { id:'camisetaRealMadrid', nom:'Real Madrid' },
      { id:'camisetaBarcelona', nom:'Barcelona' },
      { id:'camisetaColoColo', nom:'Colo-Colo' },
      { id:'camisetaCatolica', nom:'Universidad Católica' },
      { id:'camisetaUChile', nom:'Universidad de Chile' },
      { id:'camisetaRangers', nom:'Rangers de Talca' }
    ]},
    arribaColor: { label:'Color de arriba', opciones: C.ropa },
    abajo: { label:'Ropa de abajo', opciones:[
      { id:'pantalon', nom:'Pantalón' },
      { id:'short',    nom:'Short',   xp:240 },
      { id:'buzo',     nom:'Buzo',    xp:560 },
      { id:'falda',    nom:'Falda',   xp:560 }
    ]},
    abajoColor: { label:'Color de abajo', opciones: C.abajo },
    zapatos: { label:'Zapatos', opciones:[
      { id:'zapatillas', nom:'Zapatillas' },
      { id:'formales',   nom:'Formales' },
      { id:'botas',      nom:'Botas',      xp:700 },
      { id:'sandalias',  nom:'Sandalias',  xp:700 }
    ]},
    zapatosColor: { label:'Color de zapatos', opciones: C.calzado },
    gorro: { label:'Gorro', opciones:[
      { id:'nada',     nom:'Sin gorro' },
      { id:'jockey',   nom:'Jockey',   xp:450 },
      { id:'beanie',   nom:'Gorro de lana', xp:800 },
      { id:'cintillo', nom:'Cintillo', xp:800 },
      { id:'corona',   nom:'Corona',   xp:2200 }
    ]},
    lentes: { label:'Lentes', opciones:[
      { id:'nada',   nom:'Sin lentes' },
      { id:'ver',    nom:'De ver',   xp:400 },
      { id:'sol',    nom:'De sol',   xp:950 },
      { id:'redondos', nom:'Redondos', xp:950 }
    ]},
    accesorio: { label:'Accesorio', opciones:[
      { id:'nada',      nom:'Ninguno' },
      { id:'audifonos', nom:'Audífonos', xp:700 },
      { id:'bufanda',   nom:'Bufanda',   xp:1300 },
      { id:'mochila',   nom:'Mochila',   xp:1300 },
      { id:'medalla',   nom:'Medalla',   xp:2600 }
    ]}
  };

  var ORDEN = ['piel','pelo','peloColor','cejas','ojos','boca','arriba','arribaColor',
               'abajo','abajoColor','zapatos','zapatosColor','gorro','lentes','accesorio'];

  var POR_DEFECTO = {
    piel:'clara', pelo:'corto', peloColor:'negro', cejas:'normales', ojos:'normales',
    boca:'sonrisa', arriba:'polera', arribaColor:'celeste', abajo:'pantalon',
    abajoColor:'jeans', zapatos:'zapatillas', zapatosColor:'negro',
    gorro:'nada', lentes:'nada', accesorio:'nada'
  };
  var CAMISETAS = {
    camisetaRealMadrid: { base:'#f8f8f5', franja:'#d5b663', tipo:'hombros', insignia:'RM', tinta:'#c8a64a' },
    camisetaBarcelona: { base:'#173b8a', franja:'#8e183d', tipo:'vertical', insignia:'FCB', tinta:'#f8c548' },
    camisetaColoColo: { base:'#f6f6f2', franja:'#1f2937', tipo:'escudo', insignia:'CC', tinta:'#111827' },
    camisetaCatolica: { base:'#f7f8fa', franja:'#1657a5', tipo:'horizontal', insignia:'UC', tinta:'#1657a5' },
    camisetaUChile: { base:'#174492', franja:'#c52336', tipo:'escudo', insignia:'U', tinta:'#ef3340' },
    camisetaRangers: { base:'#bf1d2f', franja:'#171717', tipo:'vertical', insignia:'R', tinta:'#f4d35e' }
  };

  function clonar(o){ var r={}; for (var k in o) if (o.hasOwnProperty(k)) r[k]=o[k]; return r; }
  function opcion(cat,id){
    var c=CATALOGO[cat]; if(!c) return null;
    for (var i=0;i<c.opciones.length;i++) if (c.opciones[i].id===id) return c.opciones[i];
    return null;
  }
  // Los premios docentes viven bajo regalos, protegido contra escritura del alumno.
  var LOGROS_DOCENTES = {
    docente_constancia:['🔥','Constancia','raro'],
    docente_superacion:['🌱','Superación','raro'],
    docente_lectura:['📚','Lectura destacada','epico'],
    docente_evidencia:['🔎','Cazador de evidencias','epico'],
    docente_escritura:['✍️','Escritura destacada','epico'],
    docente_argumentacion:['💬','Argumentación sólida','epico'],
    docente_creatividad:['🎨','Creatividad','raro'],
    docente_colaboracion:['🤝','Buen compañero','raro'],
    docente_responsabilidad:['✅','Responsabilidad','raro'],
    docente_excelencia:['🏆','Excelencia CEST','legendario']
  };
  var ROPA_CATEGORIAS = ['arriba','arribaColor','abajo','abajoColor','zapatos','zapatosColor','gorro','lentes','accesorio'];
  function regalosDelContexto(ctx){ return (ctx && (ctx.regalos || (ctx.avatarData && ctx.avatarData.regalos))) || {}; }
  function claveRopa(cat,id){ return 'ropa__' + cat + '__' + id; }
  function abierta(op,xp,cat,ctx){ return !op.xp || (xp||0) >= op.xp || !!regalosDelContexto(ctx)[claveRopa(cat,op.id)]; }
  function logrosConPremios(logros,regalos){
    var salida=clonar(logros||{});
    Object.keys(LOGROS_DOCENTES).forEach(function(id){
      var premio=(regalos||{})['logro__'+id];
      if(premio)salida[id]=Object.assign({},premio,{timestamp:premio.timestamp||premio.ts||0});
      else delete salida[id];
    });
    return salida;
  }
  function catalogoPremios(){
    var lista=Object.keys(LOGROS_DOCENTES).map(function(id){ var p=LOGROS_DOCENTES[id];return {id:'logro__'+id,tipo:'logro',nombre:p[1],emoji:p[0],rareza:p[2]}; });
    ROPA_CATEGORIAS.forEach(function(cat){ CATALOGO[cat].opciones.forEach(function(op){
      if(op.id==='nada')return;
      lista.push({id:claveRopa(cat,op.id),tipo:'ropa',nombre:op.nom,categoria:cat,opcion:op.id,seccion:CATALOGO[cat].label,color:op.color||null});
    }); });
    return lista;
  }
  function color(cat,id,fb){ var o=opcion(cat,id); return (o&&o.color)||fb; }

  function normalizeLook(look, ctx){
    var xp=(ctx&&ctx.xpTotal)||0, base=clonar(POR_DEFECTO);
    if (look) ORDEN.forEach(function(cat){
      var op=opcion(cat, look[cat]);
      if (op && abierta(op,xp,cat,ctx)) base[cat]=op.id;
    });
    return base;
  }
  function randomizeLook(ctx){
    var xp=(ctx&&ctx.xpTotal)||0, r={};
    ORDEN.forEach(function(cat){
      var libres=CATALOGO[cat].opciones.filter(function(o){ return abierta(o,xp,cat,ctx); });
      r[cat]=libres[Math.floor(Math.random()*libres.length)].id;
    });
    return r;
  }

  /* ---------- dibujo ----------
   * Caja de trabajo: 100 de ancho por 116 de alto, pies apoyados en baseY.
   */
  function pintarVector(cx, centroX, baseY, look, escala, postura, gesto, movimiento){
    movimiento = movimiento || {};
    var tiempo = movimiento.t == null ? Date.now() : movimiento.t;
    var espalda = /^(NE|NW|N)$/.test(movimiento.dir || 'SE');
    var paso = movimiento.caminar && postura !== 'sentado' ? Math.sin(tiempo / 95) * 4 : 0;
    var e = escala || 1;
    var sentado = postura === 'sentado';
    var piel   = color('piel', look.piel, '#f6d5bf');
    var pelo   = color('peloColor', look.peloColor, '#2b2320');
    var arriba = color('arribaColor', look.arribaColor, '#4fb0e0');
    var camiseta = CAMISETAS[look.arriba];
    if (camiseta) arriba = camiseta.base;
    var abajo  = color('abajoColor', look.abajoColor, '#3f5a80');
    var calza  = color('zapatosColor', look.zapatosColor, '#2c3340');
    var trazo  = 'rgba(28,34,44,.85)';
    function capa(nombre){return !movimiento.capa||movimiento.capa===nombre;}

    function X(v){ return centroX + v*e; }
    function Y(v){ return baseY + v*e; }
    function caja(x,y,w,h,r,relleno,sinBorde){
      cx.beginPath();
      if (cx.roundRect) cx.roundRect(X(x), Y(y), w*e, h*e, r*e);
      else cx.rect(X(x), Y(y), w*e, h*e);
      cx.fillStyle=relleno; cx.fill();
      if (!sinBorde){ cx.lineWidth=1.2*e; cx.strokeStyle=trazo; cx.stroke(); }
    }

    cx.save();
    cx.lineJoin='miter';

    if(capa('fondo')){
    // sombra
    cx.beginPath();
    cx.ellipse(X(0), Y(1), 20*e, 6.5*e, 0, 0, Math.PI*2);
    cx.fillStyle='rgba(20,28,40,.22)'; cx.fill();

    // mochila, por detrás de todo
    if (look.accesorio==='mochila'){
      caja(-20,-58,40,30,8,'#4a5568');
      caja(-9,-52,18,12,4,'#5f6b7d');
    }

    }
    if(capa('piernas')){
    // ---- piernas ----
    var ab = look.abajo;
    if (sentado){
      // Muslos hacia delante: la figura se reconoce sentada y no atraviesa el asiento.
      caja(-12,-30,10,17,3,abajo); caja(2,-30,10,17,3,abajo);
      caja(-23,-15,23,9,3,abajo); caja(1,-15,23,9,3,abajo);
    } else if (ab==='falda'){
      cx.beginPath();
      cx.moveTo(X(-15), Y(-31)); cx.lineTo(X(15), Y(-31));
      cx.lineTo(X(20), Y(-10)); cx.lineTo(X(-20), Y(-10));
      cx.closePath();
      cx.fillStyle=abajo; cx.fill(); cx.lineWidth=1.2*e; cx.strokeStyle=trazo; cx.stroke();
      caja(-12,-13,10,13,3,piel); caja(2,-13,10,13,3,piel);
    } else if (ab==='short'){
      caja(-12,-30,10,16,3,abajo); caja(2,-30,10,16,3,abajo);
      caja(-12,-16,10,16,3,piel);  caja(2,-16,10,16,3,piel);
    } else {
      caja(-12,-30,10,30+paso,2,abajo); caja(2,-30,10,30-paso,2,abajo);
      if (ab==='buzo'){ caja(-12,-12,10,4,1.5,'#ffffff55',true); caja(2,-12,10,4,1.5,'#ffffff55',true); }
    }

    // ---- zapatos ----
    var zp = look.zapatos;
    if (sentado){ caja(-25,-10,13,8,3,calza); caja(12,-10,13,8,3,calza); }
    else if (zp==='botas'){ caja(-13,-12,12,12,3,calza); caja(1,-12,12,12,3,calza); }
    else if (zp==='sandalias'){ caja(-13,-4,12,4,2,calza); caja(1,-4,12,4,2,calza); }
    else if (zp==='formales'){ caja(-13,-5,13,5,1.5,calza); caja(0,-5,13,5,1.5,calza); }
    else { caja(-13,-7+paso,12,7,2,calza); caja(1,-7-paso,12,7,2,calza);
           caja(-13,-3+paso,12,3,0,'#ffffffaa',true); caja(1,-3-paso,12,3,0,'#ffffffaa',true);
           caja(-10,-6+paso,5,1,0,'#ffffff',true); caja(4,-6-paso,5,1,0,'#ffffff',true); }

    }
    if(capa('cuerpo')){
    // ---- torso ----
    var ar = look.arriba;
    caja(-16,-60,32,31,3,arriba);
    caja(-15,-58,3,25,0,'#ffffff30',true);
    caja(12,-58,3,27,0,'#00000026',true);
    caja(-12,-32,24,2,0,'#00000028',true);
    caja(-10,-28,2,16,0,'#ffffff26',true); caja(3,-28,2,16,0,'#00000028',true);
    if (camiseta && !espalda) {
      cx.save();
      cx.beginPath(); cx.roundRect(X(-16), Y(-60), 32*e, 31*e, 7*e); cx.clip();
      cx.fillStyle = camiseta.franja;
      if (camiseta.tipo === 'vertical') {
        for (var fr = -11; fr < 16; fr += 11) cx.fillRect(X(fr), Y(-60), 5*e, 31*e);
      } else if (camiseta.tipo === 'horizontal') {
        cx.fillRect(X(-16), Y(-49), 32*e, 7*e);
      } else if (camiseta.tipo === 'hombros') {
        cx.fillRect(X(-16), Y(-60), 32*e, 3*e);
        cx.fillRect(X(-16), Y(-34), 32*e, 2*e);
      }
      cx.restore();
      cx.fillStyle = camiseta.tinta;
      cx.beginPath(); cx.roundRect(X(5), Y(-55), 8*e, 9*e, 2*e); cx.fill();
      cx.font = 'bold ' + (camiseta.insignia.length > 2 ? 4.5*e : 5.5*e) + 'px sans-serif';
      cx.textAlign = 'center'; cx.fillStyle = '#ffffff';
      cx.fillText(camiseta.insignia, X(9), Y(-49));
    }
    if (ar==='camisa'){
      caja(-2,-60,4,31,1,'#00000022',true);
      cx.beginPath();
      cx.moveTo(X(-8),Y(-60)); cx.lineTo(X(0),Y(-50)); cx.lineTo(X(8),Y(-60));
      cx.strokeStyle=trazo; cx.lineWidth=1.2*e; cx.stroke();
    } else if (ar==='chaleco'){
      caja(-16,-60,7,31,6,'#00000033',true);
      caja(9,-60,7,31,6,'#00000033',true);
    } else if (ar==='poleron'){
      caja(-16,-62,32,10,6,arriba);           // capucha
      caja(-5,-40,10,3,1.5,'#00000033',true); // bolsillo
    }

    // ---- brazos ----
    var mangaLarga = (ar==='manga'||ar==='poleron'||ar==='camisa');
    if (gesto === 'saludar' || gesto === 'bailar' || gesto === 'celebrar') {
      var subeIzquierdo = gesto === 'bailar' && Math.sin(tiempo / 220) > 0;
      var bx = subeIzquierdo ? -27 : 17;
      caja(-23,-58,8,24,4,arriba);
      caja(15,-58,8,24,4,arriba);
      caja(bx, -82, 8, 29, 4, mangaLarga ? arriba : piel);
      caja(bx + (subeIzquierdo ? -2 : 2), -88, 9, 9, 4, piel);
      if (gesto === 'celebrar') {
        caja(-25,-82,8,29,2,mangaLarga ? arriba : piel);
        caja(-27,-89,9,9,2,piel);
      } else if (gesto === 'bailar') {
        var abajoX = subeIzquierdo ? 17 : -25;
        caja(abajoX, -40, 9, 9, 4, piel);
      } else caja(-23,-36,8,8,4,piel);
    } else if (gesto === 'aplaudir' || gesto === 'corazon') {
      caja(-22,-57,9,15,4,arriba); caja(13,-57,9,15,4,arriba);
      caja(-15,-48,15,8,4,piel); caja(0,-48,15,8,4,piel);
      var junta = gesto === 'aplaudir' && Math.sin(tiempo/120)<0 ? 4 : 0;
      caja(-6-junta,-51,6,10,2,piel); caja(junta,-51,6,10,2,piel);
      if (gesto === 'corazon') { caja(-3,-50,6,5,0,'#ed718f',true); }
    } else if (gesto === 'pensar' || gesto === 'reir' || gesto === 'sorprender') {
      caja(-23,-58,8,24,2,arriba); caja(-23,-36,8,8,2,piel);
      caja(15,-58,8,14,2,arriba); caja(10,-65,8,22,2,mangaLarga ? arriba : piel);
      caja(6,-71,9,9,2,piel);
      if (gesto === 'sorprender') { caja(-18,-70,8,22,2,piel); }
    } else {
      if (mangaLarga){
        caja(-23,-58,8,24,4,arriba); caja(15,-58,8,24,4,arriba);
      } else {
        caja(-23,-58,8,12,4,arriba); caja(15,-58,8,12,4,arriba);
        caja(-23,-47,8,13,4,piel);   caja(15,-47,8,13,4,piel);
      }
      caja(-23,-36,8,8,4,piel); caja(15,-36,8,8,4,piel);
    }

    // cuello
    caja(-5,-66,10,8,2,piel);
    if (look.accesorio==='medalla'){
      cx.beginPath(); cx.arc(X(0),Y(-46),4.5*e,0,Math.PI*2);
      cx.fillStyle='#e3c15a'; cx.fill(); cx.strokeStyle=trazo; cx.lineWidth=1.1*e; cx.stroke();
      cx.beginPath(); cx.moveTo(X(-6),Y(-58)); cx.lineTo(X(0),Y(-50)); cx.lineTo(X(6),Y(-58));
      cx.strokeStyle='#c0483c'; cx.lineWidth=2*e; cx.stroke();
    }

    }
    // ---- cabeza ----
    var cabeceo = gesto === 'asentir' ? Math.round(Math.sin(tiempo/140)*2) : 0;
    cx.save(); cx.translate(gesto === 'negar' ? Math.round(Math.sin(tiempo/140)*2)*e : 0, cabeceo*e);
    if(capa('rostro')){
    cx.beginPath();
    [[-16,-98],[8,-103],[19,-95],[19,-72],[12,-65],[-13,-67],[-18,-74]].forEach(function(v,i){if(i)cx.lineTo(X(v[0]),Y(v[1]));else cx.moveTo(X(v[0]),Y(v[1]));});
    cx.closePath();cx.fillStyle=piel;cx.fill();cx.strokeStyle=trazo;cx.lineWidth=1.2*e;cx.stroke();
    cx.beginPath();cx.moveTo(X(-16),Y(-98));cx.lineTo(X(-10),Y(-94));cx.lineTo(X(-10),Y(-68));cx.lineTo(X(-16),Y(-72));cx.closePath();cx.fillStyle='#00000025';cx.fill();
    caja(14,-90,3,15,0,'#ffffff25',true);
    caja(-20,-86,6,10,2,piel); caja(17,-85,3,7,1,piel);
    caja(-19,-84,2,5,0,'#00000040',true); caja(18,-83,1,3,0,'#00000030',true);

    }
    var peloClaro = '#ffffff28';
    if(capa('pelo')){
    // ---- pelo ----
    var p = look.pelo;
    if (p!=='rapado'){
      cx.save();
      cx.fillStyle=pelo; cx.strokeStyle=trazo; cx.lineWidth=1.2*e;
      cx.beginPath();
      if (p==='largo')        cx.roundRect(X(-20),Y(-104),40*e,16*e,5*e);
      else if (p==='colita')  cx.roundRect(X(-20),Y(-104),40*e,15*e,5*e);
      else if (p==='mono')    cx.roundRect(X(-20),Y(-104),40*e,15*e,5*e);
      else if (p==='tazon')   cx.roundRect(X(-20),Y(-104),40*e,17*e,6*e);
      else if (p==='crespo')  cx.roundRect(X(-21),Y(-107),42*e,18*e,6*e);
      else if (p==='afro')    cx.roundRect(X(-24),Y(-110),48*e,22*e,8*e);
      else if (p==='mohicano')cx.roundRect(X(-5),Y(-114),10*e,32*e,5*e);
      else {
        [[-19,-89],[-20,-100],[-15,-104],[-9,-105],[-7,-108],[-2,-105],[5,-107],[9,-103],[15,-104],[20,-98],[18,-90],[13,-93],[9,-88],[5,-91],[1,-88],[-3,-92],[-7,-89],[-11,-92],[-15,-88]].forEach(function(v,i){if(i)cx.lineTo(X(v[0]),Y(v[1]));else cx.moveTo(X(v[0]),Y(v[1]));});cx.closePath();
      }
      cx.fill(); cx.stroke();
      if (p==='trenzas') {
        for (var tz=0;tz<5;tz++) { caja(-22,-91+tz*5,7,6,1,pelo); caja(16,-91+tz*5,7,6,1,pelo); }
        caja(-21,-68,5,3,0,'#bd739e',true); caja(17,-68,5,3,0,'#bd739e',true);
      } else if (p==='largo'){
        cx.beginPath();
        cx.roundRect(X(-23),Y(-96),7*e,30*e,3.5*e);
        cx.roundRect(X(16),Y(-96),7*e,30*e,3.5*e);
        cx.fill(); cx.stroke();
      } else if (p==='colita'){
        cx.beginPath(); cx.roundRect(X(17),Y(-97),9*e,22*e,4.5*e); cx.fill(); cx.stroke();
      } else if (p==='mono'){
        cx.beginPath(); cx.arc(X(0),Y(-108),8*e,0,Math.PI*2); cx.fill(); cx.stroke();
      } else if (p==='crespo'){
        cx.beginPath();
        cx.arc(X(-15),Y(-100),7.5*e,0,Math.PI*2);
        cx.arc(X(0),Y(-106),8.5*e,0,Math.PI*2);
        cx.arc(X(15),Y(-100),7.5*e,0,Math.PI*2);
        cx.fill();
      } else if (p==='afro'){
        cx.beginPath();
        cx.arc(X(-18),Y(-98),10*e,0,Math.PI*2);
        cx.arc(X(0),Y(-108),12*e,0,Math.PI*2);
        cx.arc(X(18),Y(-98),10*e,0,Math.PI*2);
        cx.fill();
      }
      cx.restore();
    }
    // Mechones y volumen: pocos grupos de píxeles, no una superficie lisa.
    if (p==='rapado') { caja(-16,-99,32,8,1,pelo,true); }
    else if (p==='mohicano') { caja(-3,-112,2,17,0,peloClaro,true); }
    else {
      for (var mh=0;mh<5;mh++) {
        caja(-15+mh*6,-100-(mh%2)*3,4,2,0,peloClaro,true);
        caja(-14+mh*6,-98-(mh%2)*3,2,5,0,'#ffffff16',true);
      }
      if (p==='largo'||p==='trenzas') { caja(-21,-89,2,16,0,peloClaro,true); caja(19,-89,2,16,0,peloClaro,true); }
    }

    }
    if(capa('expresion')){
    // ---- cejas ----
    cx.strokeStyle=pelo; cx.lineCap='round';
    var cj=look.cejas;
    if (cj!=='finas'){ cx.lineWidth=(cj==='gruesas'?2.6:1.9)*e; } else { cx.lineWidth=1.2*e; }
    var subeIzq = cj==='alzadas' ? -2.5 : 0;
    cx.beginPath();
    cx.moveTo(X(-11),Y(-87+subeIzq)); cx.lineTo(X(-3),Y(-88));
    cx.moveTo(X(3),Y(-88)); cx.lineTo(X(11),Y(-87+subeIzq));
    cx.stroke();

    // ---- ojos ----
    var oj = gesto === 'reir' ? 'alegres' : gesto === 'sorprender' ? 'grandes' : look.ojos;
    var parpadeo = movimiento.parpadeo;
    cx.fillStyle='#232a35';
    if (oj==='serios' && !parpadeo){
      [-7,7].forEach(function(ex){caja(ex-3,-82,7,4,0,'#fff4e4');caja(ex,-81,2,3,0,'#232a35',true);caja(ex-4,-84,8,2,0,pelo,true);});
    } else if (oj==='dormidos' || parpadeo){
      cx.lineWidth=2.4*e; cx.strokeStyle='#232a35';
      cx.beginPath();
      cx.moveTo(X(-10),Y(-80)); cx.lineTo(X(-4),Y(-80));
      cx.moveTo(X(4),Y(-80)); cx.lineTo(X(10),Y(-80));
      cx.stroke();
    } else if (oj==='alegres'){
      cx.lineWidth=2.2*e; cx.strokeStyle='#232a35';
      cx.beginPath();
      cx.arc(X(-7),Y(-79),4*e, 1.15*Math.PI, 1.85*Math.PI);
      cx.arc(X(7),Y(-79),4*e, 1.15*Math.PI, 1.85*Math.PI);
      cx.stroke();
    } else {
      [-7,7].forEach(function(ex, index){
        if (oj==='guino' && index===0) { caja(ex-3,-80,6,2,0,'#232a35',true); return; }
        var h = oj==='grandes' ? 9 : oj==='almendrados' ? 5 : 7;
        caja(ex-3,-84,7,h,1,'#fff4e4');
        var mira = oj==='curiosos' ? 1 : 0;
        caja(ex-1+mira,-83,4,h-1,0,oj==='intensos' ? '#31556b' : '#755035',true);
        caja(ex+mira,-82,2,h-2,0,'#171e29',true);
        caja(ex+mira,-83,1,2,0,'#ffffff',true);
        if (oj==='brillo') caja(ex+2,-79,1,1,0,'#ffffff',true);
        caja(ex-3,-85,7,1,0,pelo,true);
      });
    }
    // Nariz, mejillas y barbilla, legibles también al reducir la figura.
    caja(0,-80,3,7,0,'#00000020',true); caja(1,-79,1,4,0,'#ffffff45',true);
    caja(-13,-74,4,2,0,'#d9665633',true); caja(10,-74,4,2,0,'#d9665633',true);
    caja(-7,-67,14,1,0,'#00000020',true);

    // ---- boca ----
    cx.strokeStyle='#232a35'; cx.lineWidth=1.7*e;
    var bo=gesto==='reir' ? 'risa' : gesto==='sorprender' ? 'asombro' : look.boca;
    cx.beginPath();
    if (bo==='seria'){ cx.moveTo(X(-4),Y(-72)); cx.lineTo(X(4),Y(-72)); }
    else if (bo==='concentrada'){ cx.moveTo(X(-4),Y(-72)); cx.lineTo(X(2),Y(-73)); cx.lineTo(X(4),Y(-71)); }
    else if (bo==='asombro') { caja(-2,-74,4,6,2,'#753846'); }
    else if (bo==='abierta') { caja(-4,-74,8,5,1,'#753846'); caja(-3,-73,6,1,0,'#fff2df',true); }
    else if (bo==='tranquila') { cx.moveTo(X(-3),Y(-72)); cx.lineTo(X(3),Y(-71)); }
    else if (bo==='contenta') { caja(-5,-73,10,4,1,'#7f3843'); caja(-4,-73,8,2,0,'#fff2df',true); }
    else if (bo==='media'){ cx.arc(X(2),Y(-73), 4*e, 0.15*Math.PI, 0.7*Math.PI); }
    else if (bo==='picara'){ cx.arc(X(1),Y(-73), 5*e, 0.1*Math.PI, 0.65*Math.PI); }
    else if (bo==='risa'){
      cx.arc(X(0),Y(-73), 5.5*e, 0.1*Math.PI, 0.9*Math.PI); cx.stroke();
      cx.beginPath(); cx.arc(X(0),Y(-73), 5.5*e, 0.1*Math.PI, 0.9*Math.PI);
      cx.fillStyle='#8c3f43'; cx.fill(); cx.beginPath();
    }
    else { cx.arc(X(0),Y(-72), 5*e, 0.22*Math.PI, 0.78*Math.PI); }
    cx.stroke();
    if (espalda) {
      // Vista posterior verdadera: sin ojos/boca ni accesorios de la cara.
      caja(-18,-100,36,36,4,pelo);
      caja(-14,-97,3,19,0,peloClaro,true); caja(11,-93,3,21,0,'#00000030',true);
      caja(-10,-66,20,2,0,piel,true);
    }

    }
    if(capa('accesorios')){
    // ---- lentes ----
    var le=look.lentes;
    if (le!=='nada' && le && !espalda){
      cx.lineWidth=1.8*e;
      if (le==='sol'){
        caja(-14,-85,12,10,3,'#2b3240'); caja(2,-85,12,10,3,'#2b3240');
        cx.beginPath(); cx.moveTo(X(-2),Y(-80)); cx.lineTo(X(2),Y(-80));
        cx.strokeStyle='#2b3240'; cx.stroke();
      } else if (le==='redondos'){
        cx.strokeStyle='#3a4250'; cx.beginPath();
        cx.arc(X(-7),Y(-80),5.5*e,0,Math.PI*2); cx.arc(X(7),Y(-80),5.5*e,0,Math.PI*2);
        cx.moveTo(X(-1.5),Y(-80)); cx.lineTo(X(1.5),Y(-80)); cx.stroke();
      } else {
        cx.strokeStyle='#2b3240'; cx.beginPath();
        cx.roundRect(X(-13),Y(-85),11*e,10*e,3*e);
        cx.roundRect(X(2),Y(-85),11*e,10*e,3*e);
        cx.moveTo(X(-2),Y(-80)); cx.lineTo(X(2),Y(-80)); cx.stroke();
      }
    }

    // ---- gorro ----
    var go=look.gorro;
    if (go==='jockey'){
      caja(-20,-108,40,11,5,'#d95d4a');
      caja(-24,-100,30,5,2.5,'#c04b3a');
    } else if (go==='beanie'){
      caja(-20,-110,40,15,7,'#5b7fb5');
      caja(-20,-99,40,6,3,'#4a6a9c');
    } else if (go==='cintillo'){
      caja(-20,-99,40,5,2.5,'#e07aa5');
    } else if (go==='corona'){
      cx.beginPath();
      cx.moveTo(X(-14),Y(-100)); cx.lineTo(X(-14),Y(-112)); cx.lineTo(X(-7),Y(-105));
      cx.lineTo(X(0),Y(-114)); cx.lineTo(X(7),Y(-105)); cx.lineTo(X(14),Y(-112));
      cx.lineTo(X(14),Y(-100)); cx.closePath();
      cx.fillStyle='#e3c15a'; cx.fill(); cx.strokeStyle=trazo; cx.lineWidth=1.2*e; cx.stroke();
    }

    // ---- accesorios sobre la cabeza ----
    if (look.accesorio==='audifonos'){
      cx.strokeStyle='#2b3240'; cx.lineWidth=3*e;
      cx.beginPath(); cx.arc(X(0),Y(-96),21*e,Math.PI,0); cx.stroke();
      caja(-26,-96,9,13,4,'#e0574a'); caja(17,-96,9,13,4,'#e0574a');
    } else if (look.accesorio==='bufanda'){
      caja(-15,-66,30,9,4,'#d95d4a'); caja(-4,-60,9,16,3,'#d95d4a');
    }

    }
    cx.restore(); // cabeza
    cx.restore();
  }

  // Raster de trabajo pequeño + escalado sin suavizado: píxeles reales, no
  // curvas borrosas. Caché acotada por look, orientación y fotograma.
  var fotogramas = new Map();
  var CAPAS = ['fondo','piernas','cuerpo','rostro','pelo','expresion','accesorios'];
  var CAMPOS_CAPA = {fondo:['accesorio'],piernas:['piel','abajo','abajoColor','zapatos','zapatosColor'],cuerpo:['piel','arriba','arribaColor','accesorio'],rostro:['piel'],pelo:['pelo','peloColor'],expresion:['piel','cejas','ojos','boca','peloColor'],accesorios:['gorro','lentes','accesorio','piel']};
  function pintar(cx, centroX, baseY, look, escala, postura, gesto, movimiento){
    movimiento = movimiento || {};
    var t = movimiento.t == null ? Date.now() : movimiento.t;
    var reducido = movimiento.reducido || (global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var dir = /^(SE|SW|NE|NW|N|S|E|W)$/.test(movimiento.dir) ? movimiento.dir : 'SE';
    var frame = !reducido && (gesto || movimiento.caminar) ? Math.floor(t/110)%4 : 0;
    var blink = !reducido && !/^(NE|NW|N)$/.test(dir) && t%4800<150;
    var motion = {dir:dir,t:frame*110,caminar:!reducido && !!movimiento.caminar,parpadeo:blink};
    if (!global.document || !global.document.createElement) { pintarVector(cx,centroX,baseY,look,escala,postura,gesto,motion); return; }
    var e=escala||1;
    cx.save(); cx.imageSmoothingEnabled=false;
    CAPAS.forEach(function(capa){
      var campos=CAMPOS_CAPA[capa].map(function(k){return look[k];});
      var key=JSON.stringify([capa,campos,postura,gesto,dir,frame,blink,motion.caminar]),cv=fotogramas.get(key);
      if(!cv){
        cv=global.document.createElement('canvas');cv.width=80;cv.height=132;
        var pen=cv.getContext('2d');
        if(dir==='SW'||dir==='NW'||dir==='W'){pen.translate(80,0);pen.scale(-1,1);}
        pintarVector(pen,40,124,look,1,postura,gesto,Object.assign({},motion,{capa:capa}));
        if(fotogramas.size>=448)fotogramas.delete(fotogramas.keys().next().value);
        fotogramas.set(key,cv);
      }
      cx.drawImage(cv,centroX-40*e,baseY-124*e,80*e,132*e);
    });
    cx.restore();
  }

  function render(contenedor, opciones){
    if (!contenedor) return null;
    opciones = opciones || {};
    var xp = opciones.xpTotal || 0;
    var look = normalizeLook(opciones.look, opciones);
    var size = opciones.size || 84;
    var dpr = global.devicePixelRatio || 1;
    var cv = document.createElement('canvas');
    cv.width = size*dpr; cv.height = size*dpr;
    cv.style.width = size+'px'; cv.style.height = size+'px'; cv.style.display='block';
    var cx = cv.getContext('2d');
    cx.setTransform(dpr,0,0,dpr,0,0);
    var e = size/128;
    if(opciones.postura==='acostado') {
      cx.save(); cx.translate(size/2,size/2); cx.rotate(-Math.PI/2);
      pintar(cx,0,52*e,look,e,'',opciones.gesto,{dir:opciones.dir,t:opciones.t,caminar:opciones.caminar}); cx.restore();
    } else pintar(cx, size/2, size - 7*e, look, e, opciones.postura, opciones.gesto,
      {dir:opciones.dir,t:opciones.t,caminar:opciones.caminar,reducido:opciones.reducido});
    contenedor.innerHTML='';
    contenedor.classList.add('avatar-render-host');
    contenedor.appendChild(cv);
    return look;
  }

  function getEditorCategories(ctx){
    var xp=(ctx&&ctx.xpTotal)||0;
    return ORDEN.map(function(cat){
      return {
        id:cat, label:CATALOGO[cat].label,
        options: CATALOGO[cat].opciones.map(function(o){
          return { id:o.id, name:o.nom, color:o.color||null,
                   locked:!abierta(o,xp,cat,ctx), minXp:o.xp||0, gifted:!!regalosDelContexto(ctx)[claveRopa(cat,o.id)] };
        })
      };
    });
  }

  var KIT = [
    {
      "id": "ojos-normales",
      "tipo": "ojos",
      "opcion": "normales",
      "nombre": "Ojos clásicos",
      "url": "/estudiantes/assets/avatar-kit/ojos-normales.png"
    },
    {
      "id": "ojos-grandes",
      "tipo": "ojos",
      "opcion": "grandes",
      "nombre": "Ojos grandes",
      "url": "/estudiantes/assets/avatar-kit/ojos-grandes.png"
    },
    {
      "id": "ojos-alegres",
      "tipo": "ojos",
      "opcion": "alegres",
      "nombre": "Ojos alegres",
      "url": "/estudiantes/assets/avatar-kit/ojos-alegres.png"
    },
    {
      "id": "ojos-serios",
      "tipo": "ojos",
      "opcion": "serios",
      "nombre": "Ojos serios",
      "url": "/estudiantes/assets/avatar-kit/ojos-serios.png"
    },
    {
      "id": "ojos-brillo",
      "tipo": "ojos",
      "opcion": "brillo",
      "nombre": "Ojos con brillo",
      "url": "/estudiantes/assets/avatar-kit/ojos-brillo.png"
    },
    {
      "id": "ojos-almendrados",
      "tipo": "ojos",
      "opcion": "almendrados",
      "nombre": "Ojos almendrados",
      "url": "/estudiantes/assets/avatar-kit/ojos-almendrados.png"
    },
    {
      "id": "ojos-dormidos",
      "tipo": "ojos",
      "opcion": "dormidos",
      "nombre": "Ojos soñolientos",
      "url": "/estudiantes/assets/avatar-kit/ojos-dormidos.png"
    },
    {
      "id": "ojos-guino",
      "tipo": "ojos",
      "opcion": "guino",
      "nombre": "Guiño",
      "url": "/estudiantes/assets/avatar-kit/ojos-guino.png"
    },
    {
      "id": "ojos-curiosos",
      "tipo": "ojos",
      "opcion": "curiosos",
      "nombre": "Ojos curiosos",
      "url": "/estudiantes/assets/avatar-kit/ojos-curiosos.png"
    },
    {
      "id": "ojos-intensos",
      "tipo": "ojos",
      "opcion": "intensos",
      "nombre": "Mirada intensa",
      "url": "/estudiantes/assets/avatar-kit/ojos-intensos.png"
    },
    {
      "id": "boca-sonrisa",
      "tipo": "boca",
      "opcion": "sonrisa",
      "nombre": "Sonrisa",
      "url": "/estudiantes/assets/avatar-kit/boca-sonrisa.png"
    },
    {
      "id": "boca-media",
      "tipo": "boca",
      "opcion": "media",
      "nombre": "Media sonrisa",
      "url": "/estudiantes/assets/avatar-kit/boca-media.png"
    },
    {
      "id": "boca-seria",
      "tipo": "boca",
      "opcion": "seria",
      "nombre": "Boca seria",
      "url": "/estudiantes/assets/avatar-kit/boca-seria.png"
    },
    {
      "id": "boca-risa",
      "tipo": "boca",
      "opcion": "risa",
      "nombre": "Risa",
      "url": "/estudiantes/assets/avatar-kit/boca-risa.png"
    },
    {
      "id": "boca-picara",
      "tipo": "boca",
      "opcion": "picara",
      "nombre": "Sonrisa pícara",
      "url": "/estudiantes/assets/avatar-kit/boca-picara.png"
    },
    {
      "id": "boca-abierta",
      "tipo": "boca",
      "opcion": "abierta",
      "nombre": "Boca abierta",
      "url": "/estudiantes/assets/avatar-kit/boca-abierta.png"
    },
    {
      "id": "boca-asombro",
      "tipo": "boca",
      "opcion": "asombro",
      "nombre": "Asombro",
      "url": "/estudiantes/assets/avatar-kit/boca-asombro.png"
    },
    {
      "id": "boca-tranquila",
      "tipo": "boca",
      "opcion": "tranquila",
      "nombre": "Expresión tranquila",
      "url": "/estudiantes/assets/avatar-kit/boca-tranquila.png"
    },
    {
      "id": "boca-contenta",
      "tipo": "boca",
      "opcion": "contenta",
      "nombre": "Sonrisa amplia",
      "url": "/estudiantes/assets/avatar-kit/boca-contenta.png"
    },
    {
      "id": "boca-concentrada",
      "tipo": "boca",
      "opcion": "concentrada",
      "nombre": "Concentración",
      "url": "/estudiantes/assets/avatar-kit/boca-concentrada.png"
    },
    {
      "id": "pelo-corto",
      "tipo": "pelo",
      "opcion": "corto",
      "nombre": "Pelo corto",
      "url": "/estudiantes/assets/avatar-kit/pelo-corto.png"
    },
    {
      "id": "pelo-rapado",
      "tipo": "pelo",
      "opcion": "rapado",
      "nombre": "Pelo rapado",
      "url": "/estudiantes/assets/avatar-kit/pelo-rapado.png"
    },
    {
      "id": "pelo-tazon",
      "tipo": "pelo",
      "opcion": "tazon",
      "nombre": "Pelo tazón",
      "url": "/estudiantes/assets/avatar-kit/pelo-tazon.png"
    },
    {
      "id": "pelo-crespo",
      "tipo": "pelo",
      "opcion": "crespo",
      "nombre": "Pelo crespo",
      "url": "/estudiantes/assets/avatar-kit/pelo-crespo.png"
    },
    {
      "id": "pelo-largo",
      "tipo": "pelo",
      "opcion": "largo",
      "nombre": "Pelo largo",
      "url": "/estudiantes/assets/avatar-kit/pelo-largo.png"
    },
    {
      "id": "pelo-colita",
      "tipo": "pelo",
      "opcion": "colita",
      "nombre": "Colita",
      "url": "/estudiantes/assets/avatar-kit/pelo-colita.png"
    },
    {
      "id": "pelo-mono",
      "tipo": "pelo",
      "opcion": "mono",
      "nombre": "Moño",
      "url": "/estudiantes/assets/avatar-kit/pelo-mono.png"
    },
    {
      "id": "pelo-afro",
      "tipo": "pelo",
      "opcion": "afro",
      "nombre": "Afro",
      "url": "/estudiantes/assets/avatar-kit/pelo-afro.png"
    },
    {
      "id": "pelo-mohicano",
      "tipo": "pelo",
      "opcion": "mohicano",
      "nombre": "Mohicano",
      "url": "/estudiantes/assets/avatar-kit/pelo-mohicano.png"
    },
    {
      "id": "pelo-trenzas",
      "tipo": "pelo",
      "opcion": "trenzas",
      "nombre": "Trenzas",
      "url": "/estudiantes/assets/avatar-kit/pelo-trenzas.png"
    },
    {
      "id": "gesto-saludar",
      "tipo": "gesto",
      "opcion": "saludar",
      "nombre": "Saludar",
      "url": "/estudiantes/assets/avatar-kit/gesto-saludar.png"
    },
    {
      "id": "gesto-aplaudir",
      "tipo": "gesto",
      "opcion": "aplaudir",
      "nombre": "Aplaudir",
      "url": "/estudiantes/assets/avatar-kit/gesto-aplaudir.png"
    },
    {
      "id": "gesto-bailar",
      "tipo": "gesto",
      "opcion": "bailar",
      "nombre": "Bailar",
      "url": "/estudiantes/assets/avatar-kit/gesto-bailar.png"
    },
    {
      "id": "gesto-reir",
      "tipo": "gesto",
      "opcion": "reir",
      "nombre": "Reír",
      "url": "/estudiantes/assets/avatar-kit/gesto-reir.png"
    },
    {
      "id": "gesto-pensar",
      "tipo": "gesto",
      "opcion": "pensar",
      "nombre": "Pensar",
      "url": "/estudiantes/assets/avatar-kit/gesto-pensar.png"
    },
    {
      "id": "gesto-sorprender",
      "tipo": "gesto",
      "opcion": "sorprender",
      "nombre": "Sorprenderse",
      "url": "/estudiantes/assets/avatar-kit/gesto-sorprender.png"
    },
    {
      "id": "gesto-celebrar",
      "tipo": "gesto",
      "opcion": "celebrar",
      "nombre": "Celebrar",
      "url": "/estudiantes/assets/avatar-kit/gesto-celebrar.png"
    },
    {
      "id": "gesto-corazon",
      "tipo": "gesto",
      "opcion": "corazon",
      "nombre": "Corazón",
      "url": "/estudiantes/assets/avatar-kit/gesto-corazon.png"
    },
    {
      "id": "gesto-asentir",
      "tipo": "gesto",
      "opcion": "asentir",
      "nombre": "Asentir",
      "url": "/estudiantes/assets/avatar-kit/gesto-asentir.png"
    },
    {
      "id": "gesto-negar",
      "tipo": "gesto",
      "opcion": "negar",
      "nombre": "Negar",
      "url": "/estudiantes/assets/avatar-kit/gesto-negar.png"
    },
    {
      "id": "pose-reposoSE",
      "tipo": "pose",
      "opcion": "reposoSE",
      "nombre": "Mirar al frente",
      "url": "/estudiantes/assets/avatar-kit/pose-reposoSE.png"
    },
    {
      "id": "pose-reposoSW",
      "tipo": "pose",
      "opcion": "reposoSW",
      "nombre": "Mirar a la izquierda",
      "url": "/estudiantes/assets/avatar-kit/pose-reposoSW.png"
    },
    {
      "id": "pose-reposoNE",
      "tipo": "pose",
      "opcion": "reposoNE",
      "nombre": "Mirar hacia atrás",
      "url": "/estudiantes/assets/avatar-kit/pose-reposoNE.png"
    },
    {
      "id": "pose-reposoNW",
      "tipo": "pose",
      "opcion": "reposoNW",
      "nombre": "Mirar atrás a la izquierda",
      "url": "/estudiantes/assets/avatar-kit/pose-reposoNW.png"
    },
    {
      "id": "pose-pasoSE",
      "tipo": "pose",
      "opcion": "pasoSE",
      "nombre": "Caminar al frente",
      "url": "/estudiantes/assets/avatar-kit/pose-pasoSE.png"
    },
    {
      "id": "pose-pasoSW",
      "tipo": "pose",
      "opcion": "pasoSW",
      "nombre": "Caminar a la izquierda",
      "url": "/estudiantes/assets/avatar-kit/pose-pasoSW.png"
    },
    {
      "id": "pose-pasoNE",
      "tipo": "pose",
      "opcion": "pasoNE",
      "nombre": "Caminar hacia atrás",
      "url": "/estudiantes/assets/avatar-kit/pose-pasoNE.png"
    },
    {
      "id": "pose-pasoNW",
      "tipo": "pose",
      "opcion": "pasoNW",
      "nombre": "Caminar atrás a la izquierda",
      "url": "/estudiantes/assets/avatar-kit/pose-pasoNW.png"
    },
    {
      "id": "pose-sentado",
      "tipo": "pose",
      "opcion": "sentado",
      "nombre": "Sentarse",
      "url": "/estudiantes/assets/avatar-kit/pose-sentado.png"
    },
    {
      "id": "pose-acostado",
      "tipo": "pose",
      "opcion": "acostado",
      "nombre": "Acostarse",
      "url": "/estudiantes/assets/avatar-kit/pose-acostado.png"
    }
  ];
  var GESTOS = [
    {
      "id": "saludar",
      "nombre": "Saludar",
      "icono": "👋",
      "imagen": "/estudiantes/assets/avatar-kit/gesto-saludar.png"
    },
    {
      "id": "aplaudir",
      "nombre": "Aplaudir",
      "icono": "👏",
      "imagen": "/estudiantes/assets/avatar-kit/gesto-aplaudir.png"
    },
    {
      "id": "bailar",
      "nombre": "Bailar",
      "icono": "🎵",
      "imagen": "/estudiantes/assets/avatar-kit/gesto-bailar.png"
    },
    {
      "id": "reir",
      "nombre": "Reír",
      "icono": "😄",
      "imagen": "/estudiantes/assets/avatar-kit/gesto-reir.png"
    },
    {
      "id": "pensar",
      "nombre": "Pensar",
      "icono": "💭",
      "imagen": "/estudiantes/assets/avatar-kit/gesto-pensar.png"
    },
    {
      "id": "sorprender",
      "nombre": "Sorprenderse",
      "icono": "😮",
      "imagen": "/estudiantes/assets/avatar-kit/gesto-sorprender.png"
    },
    {
      "id": "celebrar",
      "nombre": "Celebrar",
      "icono": "🙌",
      "imagen": "/estudiantes/assets/avatar-kit/gesto-celebrar.png"
    },
    {
      "id": "corazon",
      "nombre": "Corazón",
      "icono": "♥",
      "imagen": "/estudiantes/assets/avatar-kit/gesto-corazon.png"
    },
    {
      "id": "asentir",
      "nombre": "Asentir",
      "icono": "✓",
      "imagen": "/estudiantes/assets/avatar-kit/gesto-asentir.png"
    },
    {
      "id": "negar",
      "nombre": "Negar",
      "icono": "↔",
      "imagen": "/estudiantes/assets/avatar-kit/gesto-negar.png"
    }
  ];
  CATALOGO.pelo.opciones.push({id:'trenzas',nom:'Trenzas'});
  CATALOGO.ojos.opciones.push(
    {id:'almendrados',nom:'Almendrados'}, {id:'dormidos',nom:'Dormidos'},
    {id:'guino',nom:'Guiño'}, {id:'curiosos',nom:'Curiosos'}, {id:'intensos',nom:'Intensos'});
  CATALOGO.boca.opciones.push(
    {id:'abierta',nom:'Abierta'}, {id:'asombro',nom:'Asombro'}, {id:'tranquila',nom:'Tranquila'},
    {id:'contenta',nom:'Contenta'}, {id:'concentrada',nom:'Concentrada'});

  global.AvatarLookSystem = {
    KIT: KIT,
    GESTOS: GESTOS,
    CAPAS: CAPAS,
    getKitPreview: function(cat,id){
      var item=KIT.find(function(p){return p.tipo===cat && p.opcion===id;});
      return item ? item.url : '';
    },
    getDefaultLook: function(){ return clonar(POR_DEFECTO); },
    getEditorCategories: getEditorCategories,
    getUnlockedOptions: function(cat,ctx){
      var xp=(ctx&&ctx.xpTotal)||0;
      return (CATALOGO[cat]?CATALOGO[cat].opciones:[]).filter(function(o){ return abierta(o,xp,cat,ctx); });
    },
    getOptionMeta: function(cat,id){
      var o=opcion(cat,id);
      return o?{ id:o.id, name:o.nom, color:o.color||null, minXp:o.xp||0 }:null;
    },
    normalizeLook: normalizeLook,
    randomizeLook: randomizeLook,
    render: render,
    pintar: pintar,
    CATALOGO: CATALOGO,
    ORDEN: ORDEN,
    LOGROS_DOCENTES: LOGROS_DOCENTES,
    logrosConPremios: logrosConPremios,
    catalogoPremios: catalogoPremios
  };
  if(typeof module==='object' && module.exports) module.exports=global.AvatarLookSystem;
})(typeof window!=='undefined' ? window : globalThis);
