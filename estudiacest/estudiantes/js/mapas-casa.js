/* Geometría publicada de las habitaciones diseñadas en Tiled.
 * Fuente: scripts/mi-espacio-lab/sala-en-l.json (solo suelo y entrada).
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
  function obtener(id) { return Object.prototype.hasOwnProperty.call(mapas, id) ? mapas[id] : null; }
  function haySuelo(id, col, fila) {
    var mapa = obtener(id);
    return !!(mapa && Number.isInteger(col) && Number.isInteger(fila) &&
      col >= 0 && col < mapa.cols && fila >= 0 && fila < mapa.filas &&
      mapa.suelo[fila * mapa.cols + col] === 1);
  }
  return { obtener: obtener, haySuelo: haySuelo };
});
