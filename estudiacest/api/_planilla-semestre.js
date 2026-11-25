'use strict';
// Planilla de notas del 2.º semestre de 2.º A y B HC: cada estudiante ve solo
// su fila. El nodo es una foto fija cargada por el docente (solo admin puede
// leerlo en Firebase); esta acción devuelve únicamente la fila del uid que
// trae el token. No guarda ni cambia notas.
const BASE = 'plataforma_estudiantes';
const PERIOD = '2026-s2';
const NODE = BASE + '/planillas_semestre/' + PERIOD;
const COURSES = new Set(['2A-HC', '2B-HC']);
const COLUMNS = [
  'sesion-u3-1', 'sesion-u3-2', 'sesion-u3-3', 'sesion-u3-4', 'sesion-u3-5', 'sesion-u3-6', 'sesion-u3-7',
  'sesion-u3-10', 'sesion-u3-11', 'sesion-u3-12', 'sesion-u4-1', 'sesion-u4-2', 'sesion-u4-3', 'nm2-1'
];
const fail = (status, message) => Object.assign(new Error(message), { status });
const grade = v => (typeof v === 'number' && Number.isFinite(v) && v >= 1 && v <= 7 ? Math.round(v * 10) / 10 : null);

function cleanRow(row, course) {
  if (!row || typeof row !== 'object' || row.curso !== course) return null;
  const cells = {};
  for (const key of COLUMNS) {
    const c = row.celdas && row.celdas[key];
    if (!c || typeof c !== 'object') return null;
    cells[key] = { nota: grade(c.nota), pendiente: c.pendiente === true, na: c.na === true };
  }
  const pendientes = Number.isInteger(row.pendientes) && row.pendientes >= 0 ? row.pendientes : null;
  if (pendientes === null || pendientes !== COLUMNS.filter(k => cells[k].pendiente).length) return null;
  return {
    curso: course,
    celdas: cells,
    promedioTareas: grade(row.promedioTareas),
    pendientes,
    promedioFinal: grade(row.promedioFinal),
    piso: row.piso === true
  };
}

async function manejar(req, res, db, auth) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method !== 'GET') throw fail(405, 'Método no permitido.');
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) throw fail(401, 'Inicia sesión para ver tus notas.');
    let identity;
    try { identity = await auth.verifyIdToken(token); } catch { throw fail(401, 'Inicia sesión nuevamente.'); }
    const student = (await db.ref(BASE + '/estudiantes/' + identity.uid).once('value')).val();
    if (!student || student.activo === false || !COURSES.has(student.curso)) return res.status(200).json({ ok: true, planilla: null });
    const [metaSnap, rowSnap] = await Promise.all([
      db.ref(NODE + '/meta').once('value'),
      db.ref(NODE + '/filas/' + identity.uid).once('value')
    ]);
    const meta = metaSnap.val();
    if (!meta || meta.publicada !== true) return res.status(200).json({ ok: true, planilla: null });
    const row = cleanRow(rowSnap.val(), student.curso);
    if (!row) return res.status(200).json({ ok: true, planilla: null, motivo: 'sin-fila' });
    return res.status(200).json({
      ok: true,
      planilla: { periodo: PERIOD, revisadaEl: String(meta.revisadaEl || ''), columnas: COLUMNS, ...row }
    });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.status ? error.message : 'No se pudieron cargar tus notas.' });
  }
}

module.exports = { manejar, BASE, PERIOD, NODE, COURSES, COLUMNS, cleanRow };
