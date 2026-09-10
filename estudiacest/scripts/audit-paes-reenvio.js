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

// Cierre automático (pedido de Francisco: cerrar el 23-sep-2026, antes de
// recalcular notas). Se prueba la regla de fechas tal como está en el código.
const fuenteVigente = (api.match(/function reenvioVigente\(marca, cierra, hoy\) \{[\s\S]*?\n\}/) || [])[0];
exigir(!!fuenteVigente, 'Falta reenvioVigente(): el reenvío tiene que poder cerrarse solo por fecha.');
if (fuenteVigente) {
  const vigente = new Function(`${fuenteVigente}; return reenvioVigente;`)();
  [
    [true, '2026-09-23', '2026-09-22', true, 'el día antes del cierre sigue abierto'],
    [true, '2026-09-23', '2026-09-23', false, 'el día del cierre ya está cerrado'],
    [true, '2026-09-23', '2026-10-01', false, 'después del cierre sigue cerrado'],
    [true, null, '2026-12-31', true, 'sin fecha de cierre, abierto'],
    [true, 'mañana', '2026-12-31', true, 'una fecha mal escrita no cierra (ni abre) por error'],
    [null, '2026-09-23', '2026-09-01', false, 'sin la marca de la guía, cerrado']
  ].forEach(([marca, cierra, hoy, esperado, caso]) => {
    exigir(vigente(marca, cierra, hoy) === esperado, `reenvioVigente: ${caso}.`);
  });
}
exigir(/guias_config\/reenvio_cierra/.test(cuerpo('reenvioAbierto')) && /America\/Santiago/.test(api),
  'reenvioAbierto debe leer guias_config/reenvio_cierra y comparar con la fecha de Chile.');

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

// ---- Bloqueo programado con cuenta regresiva (10-sep-2026) ----
// Francisco: "avisar que se bloquean hasta la 19 el 23 de septiembre".
const fuenteInicio = (api.match(/function inicioDelDiaEnChile\(fecha\) \{[\s\S]*?\n\}/) || [])[0];
const fuenteEstado = (api.match(/function estadoBloqueoProgramado\(programado, hoy\) \{[\s\S]*?\n\}/) || [])[0];
exigir(fuenteInicio && fuenteEstado, 'Faltan inicioDelDiaEnChile() y estadoBloqueoProgramado().');
if (fuenteInicio && fuenteEstado) {
  const inicio = new Function(`${fuenteInicio}; return inicioDelDiaEnChile;`)();
  const estado = new Function(`${fuenteEstado}; return estadoBloqueoProgramado;`)();
  exigir(inicio('2026-09-23') === Date.parse('2026-09-23T03:00:00Z'),
    'El 23-sep-2026 empieza a las 00:00 de Chile (03:00 UTC, horario de verano).');
  exigir(inicio('2026-07-01') === Date.parse('2026-07-01T04:00:00Z'), 'En invierno Chile está a UTC-4.');
  const p = { fecha: '2026-09-23', guias: { g12: true, g19: true, g20: false } };
  const antes = estado(p, '2026-09-22'), dia = estado(p, '2026-09-23'), ya = estado(Object.assign({}, p, { aplicado: true }), '2026-09-30');
  exigir(antes.pendiente && !antes.aplicar, 'Antes de la fecha el bloqueo está pendiente y se avisa.');
  exigir(!dia.pendiente && dia.aplicar && dia.guias.join() === 'g12,g19', 'El día de la fecha se aplica, solo a las guías marcadas.');
  exigir(!ya.pendiente && !ya.aplicar, 'Aplicado una vez, no se vuelve a aplicar: el docente puede desbloquear desde el admin.');
  exigir(!estado({ fecha: 'pronto', guias: { g12: true } }, '2026-09-30').aplicar, 'Una fecha mal escrita no bloquea nada.');
}
exigir(/estadoBloqueoProgramado\(v && v\.bloqueo_programado, hoyEnChileISO\(\)\)/.test(cuerpo('readGuiasConfig')) &&
  /cambios\[`blocked\/\$\{g\}`\] = true/.test(cuerpo('readGuiasConfig')) && /aplicado: true/.test(cuerpo('readGuiasConfig')),
  'readGuiasConfig debe aplicar el bloqueo programado una vez y marcarlo como aplicado.');
exigir(/programado: config\.programado/.test(cuerpo('handleGetGuiasConfig')), 'La configuración pública debe informar el bloqueo programado (lo usa el aviso).');
const aviso = leer('paes/js/aviso-cierre.js');
exigir(/action=get-guias-config/.test(aviso) && /data\.config\.programado/.test(aviso), 'aviso-cierre.js debe leer la fecha del servidor, no tenerla escrita.');
exigir(/guias\.indexOf\(id\) < 0\) return;/.test(aviso), 'Dentro de una guía, el aviso solo aparece si esa guía se bloquea.');
exigir(!/2026-09-23/.test(aviso), 'aviso-cierre.js no debe traer la fecha escrita: la fija el servidor.');
exigir(/aviso\.src = '\/paes\/js\/aviso-cierre\.js';/.test(leer('paes/js/guia-lock.js')), 'guia-lock.js debe cargar el aviso en cada guía.');
for (const pagina of ['paes/index.html', 'paes/guias.html']) {
  exigir(/<script src="\/paes\/js\/aviso-cierre\.js" defer><\/script>/.test(leer(pagina)), `${pagina} debe cargar el aviso de cierre.`);
}

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
