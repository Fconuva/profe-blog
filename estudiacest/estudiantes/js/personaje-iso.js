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
      { id:'chaleco',  nom:'Chaleco',  xp:1150 }
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

  function clonar(o){ var r={}; for (var k in o) if (o.hasOwnProperty(k)) r[k]=o[k]; return r; }
  function opcion(cat,id){
    var c=CATALOGO[cat]; if(!c) return null;
    for (var i=0;i<c.opciones.length;i++) if (c.opciones[i].id===id) return c.opciones[i];
    return null;
  }
  function abierta(op,xp){ return !op.xp || (xp||0) >= op.xp; }
  function color(cat,id,fb){ var o=opcion(cat,id); return (o&&o.color)||fb; }

  function normalizeLook(look, ctx){
    var xp=(ctx&&ctx.xpTotal)||0, base=clonar(POR_DEFECTO);
    if (look) ORDEN.forEach(function(cat){
      var op=opcion(cat, look[cat]);
      if (op && abierta(op,xp)) base[cat]=op.id;
    });
    return base;
  }
  function randomizeLook(ctx){
    var xp=(ctx&&ctx.xpTotal)||0, r={};
    ORDEN.forEach(function(cat){
      var libres=CATALOGO[cat].opciones.filter(function(o){ return abierta(o,xp); });
      r[cat]=libres[Math.floor(Math.random()*libres.length)].id;
    });
    return r;
  }

  /* ---------- dibujo ----------
   * Caja de trabajo: 100 de ancho por 116 de alto, pies apoyados en baseY.
   */
  function pintar(cx, centroX, baseY, look, escala){
    var e = escala || 1;
    var piel   = color('piel', look.piel, '#f6d5bf');
    var pelo   = color('peloColor', look.peloColor, '#2b2320');
    var arriba = color('arribaColor', look.arribaColor, '#4fb0e0');
    var abajo  = color('abajoColor', look.abajoColor, '#3f5a80');
    var calza  = color('zapatosColor', look.zapatosColor, '#2c3340');
    var trazo  = 'rgba(28,34,44,.85)';

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
    cx.lineJoin='round';

    // sombra
    cx.beginPath();
    cx.ellipse(X(0), Y(1), 20*e, 6.5*e, 0, 0, Math.PI*2);
    cx.fillStyle='rgba(20,28,40,.22)'; cx.fill();

    // mochila, por detrás de todo
    if (look.accesorio==='mochila'){
      caja(-20,-58,40,30,8,'#4a5568');
      caja(-9,-52,18,12,4,'#5f6b7d');
    }

    // ---- piernas ----
    var ab = look.abajo;
    if (ab==='falda'){
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
      caja(-12,-30,10,30,3,abajo); caja(2,-30,10,30,3,abajo);
      if (ab==='buzo'){ caja(-12,-12,10,4,1.5,'#ffffff55',true); caja(2,-12,10,4,1.5,'#ffffff55',true); }
    }

    // ---- zapatos ----
    var zp = look.zapatos;
    if (zp==='botas'){ caja(-13,-12,12,12,3,calza); caja(1,-12,12,12,3,calza); }
    else if (zp==='sandalias'){ caja(-13,-4,12,4,2,calza); caja(1,-4,12,4,2,calza); }
    else if (zp==='formales'){ caja(-13,-5,13,5,1.5,calza); caja(0,-5,13,5,1.5,calza); }
    else { caja(-13,-7,12,7,3,calza); caja(1,-7,12,7,3,calza);
           caja(-13,-3,12,3,1.5,'#ffffff88',true); caja(1,-3,12,3,1.5,'#ffffff88',true); }

    // ---- torso ----
    var ar = look.arriba;
    caja(-16,-60,32,31,7,arriba);
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
    if (mangaLarga){
      caja(-23,-58,8,24,4,arriba); caja(15,-58,8,24,4,arriba);
    } else {
      caja(-23,-58,8,12,4,arriba); caja(15,-58,8,12,4,arriba);
      caja(-23,-47,8,13,4,piel);   caja(15,-47,8,13,4,piel);
    }
    caja(-23,-36,8,8,4,piel); caja(15,-36,8,8,4,piel);

    // cuello
    caja(-5,-66,10,8,2,piel);
    if (look.accesorio==='medalla'){
      cx.beginPath(); cx.arc(X(0),Y(-46),4.5*e,0,Math.PI*2);
      cx.fillStyle='#e3c15a'; cx.fill(); cx.strokeStyle=trazo; cx.lineWidth=1.1*e; cx.stroke();
      cx.beginPath(); cx.moveTo(X(-6),Y(-58)); cx.lineTo(X(0),Y(-50)); cx.lineTo(X(6),Y(-58));
      cx.strokeStyle='#c0483c'; cx.lineWidth=2*e; cx.stroke();
    }

    // ---- cabeza ----
    caja(-18,-100,36,36,13,piel);
    caja(-21,-86,5,9,2.5,piel); caja(16,-86,5,9,2.5,piel);

    // ---- pelo ----
    var p = look.pelo;
    if (p!=='rapado'){
      cx.save();
      cx.fillStyle=pelo; cx.strokeStyle=trazo; cx.lineWidth=1.2*e;
      cx.beginPath();
      if (p==='largo')        cx.roundRect(X(-20),Y(-103),40*e,19*e,10*e);
      else if (p==='colita')  cx.roundRect(X(-20),Y(-103),40*e,18*e,9*e);
      else if (p==='mono')    cx.roundRect(X(-20),Y(-103),40*e,18*e,9*e);
      else if (p==='tazon')   cx.roundRect(X(-20),Y(-103),40*e,20*e,9*e);
      else if (p==='crespo')  cx.roundRect(X(-21),Y(-105),42*e,20*e,10*e);
      else if (p==='afro')    cx.roundRect(X(-24),Y(-108),48*e,26*e,13*e);
      else if (p==='mohicano')cx.roundRect(X(-5),Y(-114),10*e,32*e,5*e);
      else                    cx.roundRect(X(-19),Y(-102),38*e,17*e,8.5*e);
      cx.fill(); cx.stroke();
      if (p==='largo'){
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
    var oj=look.ojos;
    cx.fillStyle='#232a35';
    if (oj==='serios'){
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
      var r = oj==='grandes' ? 4.2 : 2.8;
      cx.beginPath(); cx.ellipse(X(-7),Y(-80), r*e, (r+1)*e, 0,0,Math.PI*2); cx.fill();
      cx.beginPath(); cx.ellipse(X(7),Y(-80), r*e, (r+1)*e, 0,0,Math.PI*2); cx.fill();
      cx.fillStyle='rgba(255,255,255,.9)';
      var br = oj==='brillo' ? 1.7 : 1.1;
      cx.beginPath(); cx.arc(X(-6),Y(-81.5), br*e,0,Math.PI*2); cx.fill();
      cx.beginPath(); cx.arc(X(8),Y(-81.5), br*e,0,Math.PI*2); cx.fill();
    }

    // ---- boca ----
    cx.strokeStyle='#232a35'; cx.lineWidth=1.7*e;
    var bo=look.boca;
    cx.beginPath();
    if (bo==='seria'){ cx.moveTo(X(-4),Y(-72)); cx.lineTo(X(4),Y(-72)); }
    else if (bo==='media'){ cx.arc(X(2),Y(-73), 4*e, 0.15*Math.PI, 0.7*Math.PI); }
    else if (bo==='picara'){ cx.arc(X(1),Y(-73), 5*e, 0.1*Math.PI, 0.65*Math.PI); }
    else if (bo==='risa'){
      cx.arc(X(0),Y(-73), 5.5*e, 0.1*Math.PI, 0.9*Math.PI); cx.stroke();
      cx.beginPath(); cx.arc(X(0),Y(-73), 5.5*e, 0.1*Math.PI, 0.9*Math.PI);
      cx.fillStyle='#8c3f43'; cx.fill(); cx.beginPath();
    }
    else { cx.arc(X(0),Y(-72), 5*e, 0.22*Math.PI, 0.78*Math.PI); }
    cx.stroke();

    // ---- lentes ----
    var le=look.lentes;
    if (le!=='nada' && le){
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

    cx.restore();
  }

  function render(contenedor, opciones){
    if (!contenedor) return null;
    opciones = opciones || {};
    var xp = opciones.xpTotal || 0;
    var look = normalizeLook(opciones.look, { xpTotal: xp });
    var size = opciones.size || 84;
    var dpr = global.devicePixelRatio || 1;
    var cv = document.createElement('canvas');
    cv.width = size*dpr; cv.height = size*dpr;
    cv.style.width = size+'px'; cv.style.height = size+'px'; cv.style.display='block';
    var cx = cv.getContext('2d');
    cx.setTransform(dpr,0,0,dpr,0,0);
    var e = size/128;
    pintar(cx, size/2, size - 7*e, look, e);
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
                   locked:!abierta(o,xp), minXp:o.xp||0 };
        })
      };
    });
  }

  global.AvatarLookSystem = {
    getDefaultLook: function(){ return clonar(POR_DEFECTO); },
    getEditorCategories: getEditorCategories,
    getUnlockedOptions: function(cat,ctx){
      var xp=(ctx&&ctx.xpTotal)||0;
      return (CATALOGO[cat]?CATALOGO[cat].opciones:[]).filter(function(o){ return abierta(o,xp); });
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
    ORDEN: ORDEN
  };
})(window);
