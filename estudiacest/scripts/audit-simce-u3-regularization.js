'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const regularization = require('./open-simce-u3-regularization');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

function extractFunctionSource(source, name) {
  const start = source.indexOf(`function ${name}(`);
  if (start < 0) return '';
  const openingBrace = source.indexOf('{', start);
  if (openingBrace < 0) return '';
  let depth = 0;
  for (let index = openingBrace; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  return '';
}

const dashboard = read('estudiantes/dashboard.html');
const admin = read('estudiantes/adminprofe/index.html');
const openingScript = read('scripts/open-simce-u3-regularization.js');
const packageJson = JSON.parse(read('package.json'));
const vercelIgnore = read('.vercelignore');

const expectedSessions = [
  ...Array.from({ length: 10 }, (_, index) => `sesion-u3-${index + 1}`),
  'ensayo-simce-n3-nm2-2026'
];
expect(JSON.stringify(regularization.SESSION_IDS) === JSON.stringify(expectedSessions), 'La regularización no contiene exactamente las 11 sesiones canónicas de la Unidad 3.');
expect(JSON.stringify(regularization.TARGET_COURSES) === JSON.stringify(['2A-HC', '2B-HC']), 'Los cursos de regularización deben ser 2A-HC y 2B-HC.');
expect(regularization.EXPECTED_STUDENTS === 86, 'El padrón esperado debe contener exactamente 86 estudiantes.');
expect(JSON.stringify(regularization.EXPECTED_STUDENTS_BY_COURSE) === JSON.stringify({ '2A-HC': 46, '2B-HC': 40 }), 'El padrón esperado debe conservar 46 estudiantes de 2A-HC y 40 de 2B-HC.');
expect(regularization.REGULARIZATION_UNTIL === '2026-09-23', 'El plazo visible debe ser 2026-09-23.');
expect(regularization.CLOSE_AT === Date.parse('2026-09-24T00:00:00-03:00'), 'El cierre debe ocurrir al comenzar el 24 de septiembre en Chile.');

const message = regularization.buildMessage({}, 123456789);
const update = regularization.buildAtomicUpdate(message);
expect(Object.keys(update).length === 69, `La actualización atómica debe tener 69 rutas y contiene ${Object.keys(update).length}.`);
expect(Object.keys(update).every(key => key.startsWith('sesiones/') || key === `mensajes/${regularization.MESSAGE_ID}`), 'La actualización intenta escribir fuera de sesiones y del mensaje de regularización.');
expect(update[`mensajes/${regularization.MESSAGE_ID}`].destacar_en_panel === true, 'El mensaje no queda destacado de forma persistente en el panel.');
expect(update[`mensajes/${regularization.MESSAGE_ID}`].vigente_hasta === regularization.CLOSE_AT, 'El mensaje no vence junto con la regularización.');
expect(update[`mensajes/${regularization.MESSAGE_ID}`].plazo_texto === 'Plazo: hasta el 23 de septiembre.', 'El aviso no muestra el último día disponible sin ambigüedad.');
expect(update['sesiones/sesion-u3-10/resultados_visibles'] === false, 'La Clase 10 publica resultados durante la regularización.');
expect(update['sesiones/sesion-u3-10/retroalimentacion_visible'] === false, 'La Clase 10 publica retroalimentación durante la regularización.');
for (const sessionId of expectedSessions) {
  expect(update[`sesiones/${sessionId}/activa`] === true, `${sessionId} no queda activa.`);
  expect(update[`sesiones/${sessionId}/respuestas_bloqueadas`] === false, `${sessionId} conserva las respuestas bloqueadas.`);
  expect(JSON.stringify(update[`sesiones/${sessionId}/asignados`]) === JSON.stringify(['2A-HC', '2B-HC']), `${sessionId} no queda asignada a ambos cursos.`);
  expect(update[`sesiones/${sessionId}/regularizacion_hasta`] === '2026-09-23', `${sessionId} no conserva el plazo visible.`);
  expect(update[`sesiones/${sessionId}/regularizacion_cierre_at`] === regularization.CLOSE_AT, `${sessionId} no conserva el instante de cierre.`);
}

const fixtureStudents = {};
for (let index = 0; index < 46; index += 1) fixtureStudents[`a-${index}`] = { curso: '2A-HC' };
for (let index = 0; index < 40; index += 1) fixtureStudents[`b-${index}`] = { curso: '2B-HC' };
const fixtureCounts = regularization.assertExpectedRoster(fixtureStudents);
expect(fixtureCounts.total === 86, 'La validación del padrón no reconoce los 86 estudiantes esperados.');

expect(openingScript.includes("const apply = process.argv.includes('--apply')"), 'El script no declara --apply de forma explícita.');
expect(/if \(!apply\) \{[\s\S]*?return;[\s\S]*?\}\s*\n\s*const update = buildAtomicUpdate/.test(openingScript), 'El dry-run no se detiene antes de la escritura.');
expect(openingScript.includes('await updatePlatform(update)'), 'La apertura no usa una actualización atómica mediante el SDK administrativo.');
expect(openingScript.includes('assertAppliedState(verifiedSessions, verifiedMessages, message)'), 'Falta la relectura independiente del estado aplicado.');

expect(dashboard.includes('id="courseNotice"') && dashboard.includes('id="courseNoticeText"'), 'El dashboard no contiene el aviso persistente de regularización.');
expect(dashboard.includes('listenForMessages(student.curso, programa)'), 'El listener de mensajes no recibe curso y programa del estudiante.');
expect(dashboard.includes("limitToLast(20)"), 'El listener consulta muy pocos mensajes y puede perder el aviso vigente.');
expect(dashboard.includes('messageMatchesAudience(msg, curso, programa)'), 'El dashboard no filtra mensajes por audiencia.');
expect(dashboard.includes('msg.vigente_hasta') && dashboard.includes('msg.cursos') && dashboard.includes('msg.programa'), 'El filtro no valida vigencia, curso y programa.');
expect(dashboard.includes('msg.destacar_en_panel !== true'), 'El aviso persistente no respeta destacar_en_panel.');
expect(dashboard.includes('messages.find(msg => msg.destacar_en_panel === true)'), 'El aviso persistente depende incorrectamente de ser el mensaje más reciente.');
expect(/'sesion-u3-10':\s*\{[\s\S]*?resultados_visibles:false,[\s\S]*?retroalimentacion_visible:false/.test(dashboard), 'El fallback del dashboard deja abierta la retroalimentación de la Clase 10.');

const classifierSource = extractFunctionSource(dashboard, 'classifySubmissionStatus');
const reconciliationSource = extractFunctionSource(dashboard, 'reconcileLaborGradeStatus');
expect(Boolean(classifierSource), 'El dashboard no encapsula la lectura en classifySubmissionStatus.');
expect(Boolean(reconciliationSource), 'El dashboard no reconcilia la calificación histórica con la respuesta viva.');
expect(dashboard.includes('const submissionStatus = classifySubmissionStatus(myResp);'), 'La tarjeta no reutiliza classifySubmissionStatus.');
expect(dashboard.includes('if (classifySubmissionStatus(respuestas[ses.id]).completed)'), 'El contador no reutiliza classifySubmissionStatus.');
expect(!/completada\s*===\s*true\s*\|\|[^\n]*submitted\s*===\s*true/.test(dashboard), 'Queda un OR disperso entre completada y submitted.');
expect(dashboard.includes('function renderLaborGrades(grades, respuestas)'), 'La tabla de calificaciones no recibe las respuestas vivas.');
expect(dashboard.includes('sessionId: item.sessionId || sessionId'), 'La tabla de calificaciones pierde la clave de sesión necesaria para reconciliar.');
expect(dashboard.includes('renderLaborGrades(laborGrades, respuestas);'), 'La tabla de calificaciones no se renderiza con respuestas vivas.');
const responseReadIndex = dashboard.indexOf('await Promise.all(sesiones.map(async (ses) =>');
const reconciledRenderIndex = dashboard.indexOf('renderLaborGrades(laborGrades, respuestas);', responseReadIndex);
expect(responseReadIndex >= 0 && reconciledRenderIndex > responseReadIndex, 'La tabla se renderiza antes de cargar las respuestas vivas.');

if (classifierSource && reconciliationSource) {
  const readers = new Function(
    `'use strict';\n${classifierSource}\n${reconciliationSource}\nreturn { classifySubmissionStatus, reconcileLaborGradeStatus };`
  )();
  const canonical = readers.classifySubmissionStatus({ completada: true, submitted: true });
  const legacy = readers.classifySubmissionStatus({ completada: false, submitted: true, submitted_at: 1 });
  const telemetryOnly = readers.classifySubmissionStatus({
    resultado: { porcentaje: 100 },
    nota: 7,
    grade: 7,
    telemetria: { finalizada: true }
  });
  expect(canonical.status === 'confirmed' && canonical.completed && canonical.canonical && !canonical.legacy, 'completada === true no se clasifica como entrega canónica.');
  expect(legacy.status === 'legacy_confirmed' && legacy.completed && legacy.legacy && !legacy.canonical, 'submitted === true no se clasifica como completada heredada.');
  expect(!telemetryOnly.completed && telemetryOnly.status === 'draft', 'Resultado, nota o telemetría convierten por sí solos una entrega.');

  const staleGrade = {
    sessionId: 'sesion-u3-3',
    grade: 4.2,
    status: 'not_submitted',
    statusLabel: 'Sin entrega registrada.'
  };
  const reconciledCanonical = readers.reconcileLaborGradeStatus(staleGrade, {
    'sesion-u3-3': { completada: true, submitted: true }
  });
  const reconciledLegacy = readers.reconcileLaborGradeStatus({ ...staleGrade, sessionId: 'sesion-u3-4' }, {
    'sesion-u3-4': { submitted: true, submitted_at: 1 }
  });
  const unreconciledTelemetry = readers.reconcileLaborGradeStatus(staleGrade, {
    'sesion-u3-3': { resultado: true, nota: 7, telemetria: { finalizada: true } }
  });
  expect(reconciledCanonical.status === 'submitted' && !reconciledCanonical.statusLabel.includes('Sin entrega'), 'Una respuesta canónica confirmada sigue apareciendo como Sin entrega.');
  expect(reconciledLegacy.status === 'submitted' && reconciledLegacy.statusLabel.includes('registro anterior'), 'Una respuesta heredada confirmada no aparece como entrega registrada heredada.');
  expect(reconciledCanonical.grade === staleGrade.grade && reconciledLegacy.grade === staleGrade.grade, 'La reconciliación recalcula o inventa la nota.');
  expect(unreconciledTelemetry.status === 'not_submitted' && unreconciledTelemetry.grade === staleGrade.grade, 'Nota, resultado o telemetría alteran por sí solos el estado de entrega.');
}

const adminSession = admin.match(/'sesion-u3-10':\{[^\n]+/)?.[0] || '';
expect(adminSession.includes('resultados_visibles:false') && adminSession.includes('retroalimentacion_visible:false'), 'El fallback docente real en estudiantes/adminprofe/index.html deja abierta la retroalimentación de la Clase 10.');

expect(packageJson.scripts['audit:simce-u3-regularization'] === 'node scripts/audit-simce-u3-regularization.js', 'Falta el comando audit:simce-u3-regularization en package.json.');
expect(String(packageJson.scripts.build || '').includes('node scripts/audit-simce-u3-regularization.js'), 'La auditoría de regularización no está integrada al build.');
expect(vercelIgnore.includes('!scripts/audit-simce-u3-regularization.js'), 'La auditoría nueva sigue excluida por .vercelignore y rompería el build de Vercel.');

if (failures.length) {
  console.error('Auditoría SIMCE U3 regularización incumplida:\n- ' + failures.join('\n- '));
  process.exit(1);
}

console.log('Regularización SIMCE U3 auditada: 11 sesiones, 86 estudiantes (46 de 2A-HC y 40 de 2B-HC), apertura atómica, relectura, cierre el 24 de septiembre y aviso persistente segmentado.');
