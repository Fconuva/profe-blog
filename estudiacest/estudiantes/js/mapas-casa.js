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
  return { obtener: obtener, haySuelo: haySuelo };
});
