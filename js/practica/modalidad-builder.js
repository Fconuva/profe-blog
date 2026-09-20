/* Constructor compartido para las prácticas 2026 de modalidades que no tenían banco.
   Cada banco declara 20 focos auditables. El constructor produce tres ítems por foco:
   reconocimiento conceptual, aplicación a un caso y justificación de la decisión. */
(function (global) {
  'use strict';

  var LETRAS = ['A', 'B', 'C', 'D'];

  function unicos(valores) {
    return valores.filter(function (valor, indice, lista) {
      return valor && lista.indexOf(valor) === indice;
    });
  }

  function alternativas(correcta, distractores, numero) {
    var opciones = unicos([correcta].concat(distractores)).slice(0, 4);
    if (opciones.length !== 4) throw new Error('Cada ítem debe tener cuatro alternativas únicas.');
    var posicion = (numero - 1) % 4;
    opciones.splice(opciones.indexOf(correcta), 1);
    opciones.splice(posicion, 0, correcta);
    return { alternativas: opciones, correcta: LETRAS[posicion] };
  }

  function otros(focos, indice, campo) {
    return [1, 7, 13].map(function (salto) {
      return focos[(indice + salto) % focos.length][campo];
    });
  }

  global.crearPractica2026 = function (config) {
    if (!config || !config.id || !config.titulo || !Array.isArray(config.focos)) {
      throw new Error('Configuración incompleta para la práctica 2026.');
    }
    if (config.focos.length !== 20) {
      throw new Error(config.id + ': se requieren exactamente 20 focos para construir 60 preguntas.');
    }

    var preguntas = [];

    config.focos.forEach(function (foco, indice) {
      var numero = indice + 1;
      var opcion = alternativas(foco.concepto, otros(config.focos, indice, 'concepto'), numero);
      preguntas.push({
        n: numero,
        textoBase: foco.definicion,
        enunciado: '¿A qué concepto o criterio corresponde la descripción anterior?',
        alternativas: opcion.alternativas,
        correcta: opcion.correcta
      });
    });

    config.focos.forEach(function (foco, indice) {
      var numero = indice + 21;
      var opcion = alternativas(foco.respuesta, foco.errores, numero);
      preguntas.push({
        n: numero,
        textoBase: foco.caso,
        enunciado: foco.pregunta || '¿Cuál es la decisión o interpretación más pertinente para este caso?',
        alternativas: opcion.alternativas,
        correcta: opcion.correcta
      });
    });

    config.focos.forEach(function (foco, indice) {
      var numero = indice + 41;
      var opcion = alternativas(foco.definicion, otros(config.focos, indice, 'definicion'), numero);
      preguntas.push({
        n: numero,
        textoBase: foco.respuesta,
        enunciado: '¿Qué fundamento explica mejor por qué la respuesta anterior es adecuada?',
        alternativas: opcion.alternativas,
        correcta: opcion.correcta
      });
    });

    global.PRUEBA = {
      id: config.id,
      titulo: config.titulo,
      alcance: config.alcance || '',
      preguntas: preguntas
    };
  };
})(window);
