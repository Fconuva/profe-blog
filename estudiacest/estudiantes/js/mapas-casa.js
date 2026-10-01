/* Geometría publicada de las habitaciones diseñadas en Tiled.
 * Fuentes: scripts/mi-espacio-lab/sala-en-l.json y estudiantes/assets/mapas/.
 * Solo suelo y entrada; la auditoría compara cada casilla con los JSON de Tiled.
 * Los objetos de muestra del laboratorio NO son muebles regalados.
 */
(function (raiz, fabrica) {
  var api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (raiz) raiz.MapasCasa = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';
  var mapas = {
    'salon-l': {
      cols: 7, filas: 7, entrada: { col: 1, fila: 1 },
      suelo: [
        1, 1, 1, 1, 0, 0, 0,
        1, 1, 1, 1, 0, 0, 0,
        1, 1, 1, 1, 0, 0, 0,
        1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1
      ]
    }
  };
  function registrar(id, cols, filas, hueco) {
    var suelo = [];
    for (var f = 0; f < filas; f++) for (var c = 0; c < cols; c++) suelo.push(hueco && hueco(c, f) ? 0 : 1);
    mapas[id] = { cols:cols, filas:filas, entrada:{col:1,fila:1}, suelo:suelo };
  }
  registrar('9x9', 9, 9);
  registrar('11x11', 11, 11);
  registrar('9x7', 9, 7);
  registrar('salon-l-grande', 9, 9, function (c, f) { return c >= 5 && f < 4; });
  function obtener(id) { return Object.prototype.hasOwnProperty.call(mapas, id) ? mapas[id] : null; }
  function haySuelo(id, col, fila) {
    var mapa = obtener(id);
    return !!(mapa && Number.isInteger(col) && Number.isInteger(fila) &&
      col >= 0 && col < mapa.cols && fila >= 0 && fila < mapa.filas &&
      mapa.suelo[fila * mapa.cols + col] === 1);
  }
  function huella(ficha, dir) {
    var h = ficha && ficha.huella || [1,1], cols = h[0], filas = h[1];
    return dir === 'SW' || dir === 'NW' ? {cols:filas,filas:cols} : {cols:cols,filas:filas};
  }
  function celdas(ficha, item) {
    var h=huella(ficha,item.dir), lista=[];
    for(var f=0;f<h.filas;f++)for(var c=0;c<h.cols;c++)lista.push({col:item.col+c,fila:item.fila+f});
    return lista;
  }
  function ocupa(ficha,item,col,fila) {
    var h=huella(ficha,item.dir);
    return !item.pared && col>=item.col && col<item.col+h.cols && fila>=item.fila && fila<item.fila+h.filas;
  }
  var HABITACIONES = ['principal', 'estudio'];
  function idHabitacion(id) { return HABITACIONES.indexOf(id || 'principal') >= 0 ? (id || 'principal') : null; }
  function habitacion(av, id) {
    av = av || {};
    var h = id === 'estudio' ? (av.habitaciones && av.habitaciones.estudio || {}) : av;
    return {casa:h.casa || {tamano:'5x5',piso:'claro',muro:'blanco'},pieza:Array.isArray(h.pieza)?h.pieza:[],personajeEn:h.personajeEn || {col:2,fila:3}};
  }
  function suelo(casa,c,f) {
    var id=casa && casa.tamano || '5x5',m=obtener(id),n=id==='7x7'?7:5;
    return m ? haySuelo(id,c,f) : Number.isInteger(c)&&Number.isInteger(f)&&c>=0&&f>=0&&c<n&&f<n;
  }
  // La puerta se apoya en una casilla libre de borde: no desplaza mobiliario heredado.
  function puerta(casa,pieza,catalogo) {
    var m=obtener(casa && casa.tamano),n=casa && casa.tamano==='7x7'?7:5;
    var cols=m?m.cols:n,filas=m?m.filas:n,libre=function(c,f){return suelo(casa,c,f)&&!(pieza||[]).some(function(p){var ficha=catalogo[p.id]||{};return !ficha.plano&&!p.sobre&&!/^pet/.test(p.id)&&ocupa(ficha,p,c,f);});};
    for(var f=0;f<filas;f++)for(var c=cols-1;c>=0;c--)if((f===0||c===0||f===filas-1||c===cols-1)&&libre(c,f))return {col:c,fila:f};
    return null;
  }
  function direccion(a,b) {
    var c=Math.sign(b.col-a.col),f=Math.sign(b.fila-a.fila);
    return c&&f ? (c===f?(c>0?'S':'N'):(c>0?'E':'W')) : c?(c>0?'SE':'NW'):f>0?'SW':'NE';
  }
  // Dijkstra: diagonales cuestan sqrt(2) y nunca atraviesan esquinas ocupadas.
  function ruta(desde,hasta,libre) {
    var key=function(p){return p.col+','+p.fila;},inicio=key(desde),fin=key(hasta);
    if(!libre(hasta.col,hasta.fila)&&inicio!==fin)return null;
    var cola=[{p:desde,d:0}],dist={},prev={};dist[inicio]=0;
    while(cola.length){
      cola.sort(function(a,b){return a.d-b.d;});var nodo=cola.shift(),p=nodo.p,k=key(p);
      if(nodo.d!==dist[k])continue;
      if(k===fin){var camino=[];while(k){var par=k.split(',');camino.unshift({col:+par[0],fila:+par[1]});k=prev[k];}return camino;}
      for(var dc=-1;dc<=1;dc++)for(var df=-1;df<=1;df++){
        if(!dc&&!df)continue;var q={col:p.col+dc,fila:p.fila+df};
        if(!libre(q.col,q.fila)||(dc&&df&&(!libre(p.col+dc,p.fila)||!libre(p.col,p.fila+df))))continue;
        var kk=key(q),dd=nodo.d+(dc&&df?Math.SQRT2:1);
        if(dist[kk]===undefined||dd<dist[kk]){dist[kk]=dd;prev[kk]=k;cola.push({p:q,d:dd});}
      }
    }
    return null;
  }
  return { obtener: obtener, haySuelo: haySuelo, huella:huella, celdas:celdas, ocupa:ocupa,
    HABITACIONES:HABITACIONES,idHabitacion:idHabitacion,habitacion:habitacion,suelo:suelo,puerta:puerta,ruta:ruta,direccion:direccion };
});
