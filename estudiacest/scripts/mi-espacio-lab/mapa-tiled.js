/* Adaptador mínimo del JSON isométrico de Tiled para la casa de Estudia CEST.
 * Solo acepta mapas finitos con capas de suelo en arreglo: no ejecuta scripts
 * ni usa URLs del mapa salvo la imagen del tileset en la vista de prueba.
 */
(function (raiz, fabrica) {
  var api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (raiz) raiz.MapaTiledCEST = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';
  var DIRECCIONES = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  var DIRECCIONES_MUEBLE = { SE: 1, SW: 1, NE: 1, NW: 1 };

  function propiedad(objeto, nombre) {
    var p = (objeto.properties || []).filter(function (x) { return x.name === nombre; })[0];
    return p ? p.value : undefined;
  }
  function tipoObjeto(objeto) { return objeto.type || objeto.class || ''; }
  function importar(datos) {
    if (!datos || datos.orientation !== 'isometric' || datos.infinite || !Number.isInteger(datos.width) ||
      !Number.isInteger(datos.height) || datos.width < 5 || datos.height < 5 || datos.width > 12 || datos.height > 12) {
      throw new Error('Se requiere un mapa isométrico finito de 5 a 12 casillas por lado.');
    }
    if (datos.tilewidth !== 151 || datos.tileheight !== 106) {
      throw new Error('El mapa debe usar baldosas isométricas de 151 × 106 píxeles.');
    }
    var capa = (datos.layers || []).filter(function (l) { return l.name === 'suelo' && l.type === 'tilelayer'; })[0];
    if (!capa || capa.width !== datos.width || capa.height !== datos.height ||
      !Array.isArray(capa.data) || capa.data.length !== datos.width * datos.height ||
      !capa.data.every(function (gid) { return gid === 0 || gid === 1; })) {
      throw new Error('La capa suelo debe tener un GID 1 o un hueco 0 por casilla.');
    }
    var ancho = datos.width, alto = datos.height;
    function existe(col, fila) {
      return Number.isInteger(col) && Number.isInteger(fila) && col >= 0 && col < ancho && fila >= 0 && fila < alto &&
        capa.data[fila * ancho + col] === 1;
    }
    var objetos = (datos.layers || []).filter(function (l) { return l.type === 'objectgroup' && l.name === 'objetos'; })[0];
    var lista = objetos && Array.isArray(objetos.objects) ? objetos.objects : [];
    // Tiled guarda los puntos de un mapa isométrico en espacio proyectado:
    // cada eje representa casillas cuadradas cuyo lado es tileheight.
    function casillaObjeto(o) {
      return { col: Math.floor(Number(o.x) / datos.tileheight), fila: Math.floor(Number(o.y) / datos.tileheight) };
    }
    var entrada = lista.filter(function (o) { return tipoObjeto(o) === 'entrada'; })[0];
    var inicio = entrada ? casillaObjeto(entrada) : null;
    if (!inicio || !existe(inicio.col, inicio.fila)) throw new Error('Falta una entrada sobre una casilla con suelo.');
    var muebles = lista.filter(function (o) { return tipoObjeto(o) === 'mueble'; }).map(function (o) {
      var c = casillaObjeto(o);
      return { id: propiedad(o, 'id'), dir: propiedad(o, 'dir') || 'SE', col:c.col, fila:c.fila };
    });
    muebles.forEach(function (m) {
      if (!existe(m.col, m.fila) || !/^[A-Za-z][A-Za-z0-9]{0,50}$/.test(m.id || '') || !DIRECCIONES_MUEBLE[m.dir]) {
        throw new Error('Hay un mueble fuera del suelo o con datos inválidos.');
      }
      if (m.col === inicio.col && m.fila === inicio.fila) throw new Error('La entrada está ocupada.');
    });
    function ocupado(col, fila) {
      return muebles.some(function (m) { return m.col === col && m.fila === fila; });
    }
    function pisable(col, fila) { return existe(col, fila) && !ocupado(col, fila); }
    function ruta(desde, hasta) {
      if (!pisable(desde.col, desde.fila) || !pisable(hasta.col, hasta.fila)) return null;
      var clave = function (c, f) { return c + ',' + f; };
      var cola = [desde], previo = {};
      previo[clave(desde.col, desde.fila)] = null;
      for (var i = 0; i < cola.length; i++) {
        var actual = cola[i];
        if (actual.col === hasta.col && actual.fila === hasta.fila) {
          var salida = [], k = clave(actual.col, actual.fila);
          while (k) {
            var par = k.split(','); salida.unshift({ col: +par[0], fila: +par[1] }); k = previo[k];
          }
          return salida;
        }
        DIRECCIONES.forEach(function (d) {
          var col = actual.col + d[0], fila = actual.fila + d[1], k = clave(col, fila);
          if (!pisable(col, fila) || Object.prototype.hasOwnProperty.call(previo, k)) return;
          previo[k] = clave(actual.col, actual.fila); cola.push({ col: col, fila: fila });
        });
      }
      return null;
    }
    var suelo = [];
    for (var f = 0; f < alto; f++) for (var c = 0; c < ancho; c++) if (existe(c, f)) suelo.push({ col: c, fila: f });
    if (suelo.some(function (celda) { return pisable(celda.col, celda.fila) && !ruta(inicio, celda); })) {
      throw new Error('El mapa tiene casillas transitables aisladas.');
    }
    return { ancho: ancho, alto: alto, suelo: suelo, muebles: muebles, inicio: inicio,
      existe: existe, pisable: pisable, ruta: ruta };
  }
  return { importar: importar };
});
