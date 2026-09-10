// Guarda del reenvío PAES y del botón de enviar de las guías 11–13.
//
// Caso (10-sep-2026): en la Guía 12, 113 de 131 estudiantes quedaron en
// borrador. El botón sí enviaba, pero el servidor exige todas las preguntas y
// la página mostraba cualquier rechazo como "sin conexión". Francisco pidió
// además que desde la 12 se pueda volver a responder y enviar: eso vive en
// guias_config/reenvio y lo resuelve el servidor para las tres rutas de envío
// (guías antiguas, guías nuevas y el ensayo de la 14).

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const leer = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const fallas = [];
const exigir = (cond, msg) => { if (!cond) fallas.push(msg); };

const api = leer('api/paes.js');
const cuerpo = (nombre) => {
  const i = api.indexOf(`async function ${nombre}(`);
  return i < 0 ? '' : api.slice(i, api.indexOf('\n}\n', i));
};

exigir(/async function reenvioAbierto\(guideId\)/.test(api) && /guias_config\/reenvio\/g\$\{String\(guideId\)\}/.test(api),
  'Falta reenvioAbierto(): la marca por guía vive en guias_config/reenvio/gNN.');
exigir(/reenvio: \(v && v\.reenvio\) \|\| \{\}/.test(cuerpo('readGuiasConfig')), 'readGuiasConfig debe devolver la marca de reenvío.');

const envio = cuerpo('handleSubmitGuia');
exigir(/if \(enviado && abierto\) \{/.test(envio), 'handleSubmitGuia debe aceptar un segundo envío solo con reenvío abierto.');
exigir(/reenvioBorrador: \{ answers: safeAnswers/.test(envio),
  'Con reenvío abierto, el autoguardado va a reenvioBorrador: si no, abrir la guía deshace una entrega.');
exigir(/intentosAnteriores: archivarIntento\(current\)/.test(envio), 'Al reenviar, el intento anterior se archiva (con su nota).');
exigir(/if \(!isPaesTestRut\(rutLimpio\) && current && \(current\.status === 'sent' \|\| current\.completada === true\)\) return;/.test(envio),
  'Sin reenvío abierto, lo enviado sigue siendo inmutable (salvo la cuenta de prueba).');

exigir(/reenvioAbierto\(guideId\)/.test(cuerpo('handleGetGuiaState')) && /answerKey: null, feedback: null, reenvio: true/.test(cuerpo('handleGetGuiaState')),
  'get-guia-state debe devolver lo enviado como editable y sin pauta cuando el reenvío está abierto.');
exigir(/reenvioAbierto\(guiaId\)/.test(cuerpo('handleGetGuiaDraft')), 'get-guia-draft (guías 10–13) debe respetar el reenvío.');
// Caso (10-sep-2026): 16–21 releen el estado tras entregar y exigen completada.
exigir(/if \(attempt\.completada && !recienEntregada && await reenvioAbierto\(guideId\)\)/.test(cuerpo('handleGetGuiaState')) &&
  /const RECIEN_ENTREGADA_MS = \d+ \* 60 \* 1000;/.test(api),
  'get-guia-state debe informar como entregada una entrega recién hecha: las guías 16–21 releen el estado para confirmar.');
for (const archivo of ['paes/guia16.html', 'paes/guia17.html', 'paes/guia18.html', 'paes/guia19.html', 'paes/js/guia20.js', 'paes/js/guia21.js']) {
  exigir(/readback\.attempt\.completada\s*!==\s*true/.test(leer(archivo)), `${archivo}: cambió su relectura; revisar que el reenvío siga confirmando la entrega.`);
}
exigir(/reenvioAbierto\('14'\)/.test(cuerpo('handleSubmitGuia14')) && /ref\.child\('reenvioBorrador'\)/.test(cuerpo('handleSubmitGuia14')),
  'El ensayo de la 14 tiene su propia ruta de envío y también debe respetar el reenvío.');
exigir(/reenvioAbierto\('14'\)/.test(cuerpo('handleGetGuia14State')), 'get-guia14-state debe respetar el reenvío.');

// Guías antiguas: el motivo real del rechazo llega al estudiante.
for (const n of [11, 12, 13]) {
  const html = leer(`paes/guia${n}.html`);
  const i = html.indexOf('async function submitGuia()');
  const f = i < 0 ? '' : html.slice(i, html.indexOf('/* ============ AUTOGUARDADO', i));
  exigir(/const faltan = QUESTIONS\.filter\(q => !answers\[q\.n\]\)/.test(f), `guia${n}.html: debe avisar qué preguntas faltan antes de enviar.`);
  exigir(/data\.error \|\|/.test(f), `guia${n}.html: debe mostrar el motivo que da el servidor, no "sin conexión".`);
  exigir(!/throw new Error\('submit error'\)/.test(f), `guia${n}.html: volvió el error genérico que se mostraba como "sin conexión".`);
  exigir(new RegExp(`guiaId: "${n}"`).test(f), `guia${n}.html: el envío debe ir con guiaId ${n}.`);
}

if (fallas.length) {
  console.error('Reenvío PAES con problemas:\n- ' + fallas.join('\n- '));
  process.exit(1);
}
console.log('Reenvío PAES auditado: marca por guía, borrador aparte, intento anterior archivado en las tres rutas de envío, y guías 11–13 con aviso de preguntas faltantes y motivo real del rechazo.');
