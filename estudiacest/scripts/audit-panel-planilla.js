'use strict';
// Auditoría del panel «Mis notas» (estudiantes/dashboard.html) frente a la planilla del 2.º semestre.
// Corre las funciones reales del dashboard con un DOM falso y datos inventados (sin Firebase, sin red).
// Cubre los dos defectos del 25-nov-2026:
//   1. Un recálculo de la planilla no tocaba calificaciones_clase: el panel seguía en 1,0 o en
//      «pendiente de actualizar» aunque la planilla ya tuviera la nota.
//   2. El promedio parcial contaba como 1,0 las P que la planilla deja fuera (5 o menos no cuentan;
//      con más de 5 valen 1,0). Ejemplo real: panel 5,0, planilla 6,1.
// Uso: node scripts/audit-panel-planilla.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const dashboard = fs.readFileSync(path.join(root, 'estudiantes', 'dashboard.html'), 'utf8');
const manifest = fs.readFileSync(path.join(root, 'scripts', 'academic-release-manifest.json'), 'utf8');
const PlanillaPanel = require(path.join(root, 'estudiantes', 'js', 'planilla-panel.js'));
const { cleanRow, COLUMNS } = require(path.join(root, 'api', '_planilla-semestre.js'));
const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(msg); };

// --- Conexión en el dashboard ---
[
  '<script src="js/planilla-panel.js"></script>',
  "/api/estudiantes?action=planilla-semestre",
  'PlanillaPanel.appliesTo(curso) ? loadPlanillaSemestre() : null',
  'PlanillaPanel.mergeGrades(',
  'renderLaborGrades(laborGrades, respuestas, planilla)',
  'PlanillaPanel.cellStatus(item, submission)',
  'id="laborAverageLabel"',
  'id="laborSummaryCopy"',
  "not_applicable:",
  'myLaborGrade.grade !== null'
].forEach(fragment => check(dashboard.includes(fragment), `Dashboard: falta ${fragment}`));
check(manifest.includes('"path":"estudiantes/js/planilla-panel.js"'), 'Manifiesto: falta estudiantes/js/planilla-panel.js.');
check(PlanillaPanel.appliesTo('2A-HC') && PlanillaPanel.appliesTo('2B-HC') && !PlanillaPanel.appliesTo('3A-TP'), 'appliesTo: cursos equivocados.');

// --- Funciones reales del dashboard en un contexto aislado ---
function extract(name) {
  const i = dashboard.indexOf('function ' + name + '(');
  if (i < 0) throw new Error('Dashboard: no está la función ' + name);
  const start = dashboard.indexOf('{', dashboard.indexOf(')', i));
  for (let k = start, depth = 0; k < dashboard.length; k++) {
    if (dashboard[k] === '{') depth++;
    else if (dashboard[k] === '}' && --depth === 0) return dashboard.slice(i, k + 1);
  }
  throw new Error('Dashboard: función sin cerrar ' + name);
}
const ctx = { PlanillaPanel, els: {} };
ctx.document = { getElementById: id => ctx.els[id] || (ctx.els[id] = { textContent: '', innerHTML: '', classList: { add() {}, remove() {} } }) };
vm.createContext(ctx);
vm.runInContext(['escapeDashboardHtml', 'formatSchoolGrade', 'classifySubmissionStatus', 'laborStatusMeta', 'reconcileLaborGradeStatus', 'renderLaborGrades'].map(extract).join('\n'), ctx);

function render(grades, respuestas, planilla) {
  ctx.els = {};
  ctx.__a = [planilla ? PlanillaPanel.mergeGrades(grades, planilla) : grades, respuestas, planilla || null];
  vm.runInContext('renderLaborGrades(...__a)', ctx);
  const rows = [...(ctx.els.laborGradesBody?.innerHTML || '').matchAll(/<tr>([\s\S]*?)<\/tr>/g)]
    .map(m => [...m[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(t => t[1].replace(/<[^>]+>/g, '').trim()));
  return { avg: ctx.els.laborAverage?.textContent, label: ctx.els.laborAverageLabel?.textContent, copy: ctx.els.laborSummaryCopy?.textContent || '', rows: Object.fromEntries(rows.map(r => [r[0], r])) };
}

// Fila de planilla inventada con la misma forma que guarda el docente y devuelve la API.
function planillaDe(curso, cells, promedioFinal) {
  const celdas = {};
  for (const k of COLUMNS) celdas[k] = cells[k] || { nota: null, pendiente: false, na: false };
  const raw = { curso, celdas, pendientes: COLUMNS.filter(k => celdas[k].pendiente).length, promedioTareas: promedioFinal, promedioFinal, piso: false };
  const row = cleanRow(raw, curso);
  if (!row) throw new Error('Fixture: la fila no pasa cleanRow.');
  return { periodo: '2026-s2', revisadaEl: '1 de enero de 2026 a las 10:00', columnas: COLUMNS, ...row };
}
const n = v => ({ nota: v, pendiente: false, na: false });
const P = { nota: null, pendiente: true, na: false };
const done = at => ({ submitted: true, completada: true, submittedAt: at });
const PUB = '2026-01-01T09:00:00.000Z', LATER = Date.parse(PUB) + 3600e3;

// Caso 1 — recálculo de la planilla sin tocar calificaciones_clase.
{
  const grades = {
    'sesion-u3-1': { sessionId: 'sesion-u3-1', classNumber: 1, grade: 1, status: 'not_submitted', statusLabel: 'Sin entrega.', publishedAt: PUB },
    'sesion-u3-2': { sessionId: 'sesion-u3-2', classNumber: 2, grade: 1, status: 'not_submitted', statusLabel: 'Sin entrega.', publishedAt: PUB }
  };
  const respuestas = { 'sesion-u3-1': done(LATER), 'sesion-u3-2': done(LATER) };
  const before = render(grades, respuestas, null);
  check(/pendiente de actualizar/i.test(before.rows['Unidad 3 · Clase 1']?.[3] || ''), 'Caso 1: la auditoría ya no reproduce el defecto viejo (control).');
  const cells = { 'sesion-u3-1': n(7), 'sesion-u3-2': n(6) };
  COLUMNS.filter(k => !cells[k] && !k.startsWith('nm2-')).forEach(k => { cells[k] = n(7); });
  const planilla = planillaDe('2B-HC', cells, 6.9);
  const after = render(grades, respuestas, planilla);
  check(after.rows['Unidad 3 · Clase 1']?.[1] === '7,0', `Caso 1: el panel muestra ${after.rows['Unidad 3 · Clase 1']?.[1]} y la planilla 7,0.`);
  check(after.rows['Unidad 3 · Clase 2']?.[1] === '6,0', 'Caso 1: la Clase 2 no muestra el 6,0 de la planilla.');
  check(!Object.values(after.rows).some(r => /pendiente de actualizar/i.test(r[3] || '')), 'Caso 1: queda «pendiente de actualizar» aunque la planilla ya tiene la nota.');
  check(after.avg === '6,9' && after.label === 'Promedio final', `Caso 1: promedio ${after.avg} (${after.label}); se esperaba 6,9 «Promedio final».`);
  check(after.rows['Unidad 4 · Miniensayo 1'] && !after.rows['NM2 · Clase 1'], 'Caso 1: miniensayos o NM2 mal rotulados.');
}

// Caso 2 — 3 P (5 o menos): no entran al promedio. Datos del ejemplo real: panel 5,0, planilla 6,1.
{
  const cells = {}; const grades = {};
  COLUMNS.forEach(k => { cells[k] = n(7); });
  ['sesion-u3-5', 'sesion-u3-7', 'sesion-u3-11'].forEach(k => { cells[k] = P; grades[k] = { sessionId: k, classNumber: Number(k.split('-').pop()), grade: 1, status: 'not_submitted', publishedAt: PUB }; });
  cells['sesion-u3-4'] = n(4); cells['sesion-u3-6'] = n(4); cells['sesion-u4-2'] = n(4); cells['nm2-1'] = n(4); cells['sesion-u3-12'] = n(5);
  const planilla = planillaDe('2B-HC', cells, 6.1);
  const before = render(grades, {}, null);
  check(before.avg === '1,0', 'Caso 2: control viejo; el promedio parcial ya no cuenta las P como 1,0.');
  const after = render(grades, {}, planilla);
  check(after.avg === '6,1', `Caso 2: promedio ${after.avg}; la planilla dice 6,1.`);
  check(['Unidad 3 · Clase 5', 'Unidad 3 · Clase 7', 'Unidad 3 · Clase 11'].every(l => after.rows[l]?.[1] === 'P' && /no entra a tu promedio/.test(after.rows[l]?.[3])), 'Caso 2: las P no se muestran como «P · no entra a tu promedio».');
  check(/Las P no entran al promedio/.test(after.copy), 'Caso 2: el resumen no explica que las P no cuentan.');
  check(Object.keys(after.rows).length === COLUMNS.length, 'Caso 2: el panel no muestra todas las columnas de la planilla (2B-HC cuenta NM2).');
  const respuestas = { 'sesion-u3-5': done(LATER) };
  const sent = render(grades, respuestas, planilla);
  check(/se suma en la próxima actualización/.test(sent.rows['Unidad 3 · Clase 5']?.[3] || '') && sent.avg === '6,1', 'Caso 2: una P ya entregada debe avisar que se suma en la próxima actualización sin mover el promedio.');
}

// Caso 3 — más de 5 P: valen 1,0, como en la planilla.
{
  const cells = {};
  COLUMNS.forEach((k, i) => { cells[k] = i < 6 ? { nota: 1, pendiente: true, na: false } : n(7); });
  const planilla = planillaDe('2B-HC', cells, 4.4);
  const after = render({}, {}, planilla);
  check(after.avg === '4,4', 'Caso 3: con más de 5 P el promedio no es el de la planilla.');
  check(after.rows['Unidad 3 · Clase 1']?.[1] === '1,0' && /vale 1,0 por tener más de 5/.test(after.rows['Unidad 3 · Clase 1']?.[3]), 'Caso 3: la P no explica que vale 1,0.');
  check(/valen 1,0 por tener más de 5/.test(after.copy), 'Caso 3: el resumen no explica las P a 1,0.');
}

// Caso 4 — 2.º A HC: NM2 no cuenta y no aparece; N/A se muestra como N/A.
{
  const cells = {};
  COLUMNS.forEach(k => { cells[k] = k === 'nm2-1' ? { nota: null, pendiente: false, na: false } : n(6); });
  cells['sesion-u3-1'] = { nota: null, pendiente: false, na: true };
  const after = render({}, {}, planillaDe('2A-HC', cells, 6));
  check(!after.rows['NM2 · Clase 1'], 'Caso 4: NM2 aparece en 2.º A HC, donde no cuenta.');
  check(after.rows['Unidad 3 · Clase 1']?.[1] === 'N/A', 'Caso 4: la clase anterior a la llegada no se muestra como N/A.');
}

// Caso 5 — sin planilla (otros cursos o API caída): el panel sigue como antes.
{
  const grades = { 'sesion-u3-1': { sessionId: 'sesion-u3-1', classNumber: 1, grade: 7, status: 'submitted' }, 'sesion-u3-2': { sessionId: 'sesion-u3-2', classNumber: 2, grade: 5, status: 'submitted' } };
  const out = render(grades, {}, null);
  check(out.avg === '6,0' && Object.keys(out.rows).length === 2, 'Caso 5: sin planilla cambió el comportamiento anterior.');
  check(PlanillaPanel.mergeGrades(grades, null) === grades && PlanillaPanel.mergeGrades(grades, { ok: true }) === grades, 'Caso 5: una respuesta sin planilla debe dejar calificaciones_clase intacto.');
}

if (failures.length) {
  console.error('audit-panel-planilla: FALLA');
  failures.forEach(f => console.error(' - ' + f));
  process.exit(1);
}
console.log('audit-panel-planilla: OK (5 casos: recálculo, P que no cuentan, P a 1,0, 2.º A HC, sin planilla)');
