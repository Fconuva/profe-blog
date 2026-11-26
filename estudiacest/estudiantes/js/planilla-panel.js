// «Mis notas» del dashboard alineado con la planilla del 2.º semestre (2.º A y B HC).
// Cuando la acción planilla-semestre devuelve la fila del estudiante, el panel y
// las tarjetas muestran exactamente esa fila: la misma nota por celda, las «P» y
// el promedio final. Así un recálculo de la planilla no deja el panel atrasado
// (25-nov-2026). Sin planilla, el dashboard sigue leyendo solo calificaciones_clase.
// Funciona en el navegador (window.PlanillaPanel) y en Node (auditoría).
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PlanillaPanel = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const COURSES = new Set(['2A-HC', '2B-HC']);
  const LABELS = {
    'sesion-u3': n => 'Unidad 3 · Clase ' + n,
    'sesion-u4': n => 'Unidad 4 · Miniensayo ' + n,
    nm2: n => 'NM2 · Clase ' + n
  };
  const BAD_STATUS = new Set(['not_submitted', 'draft', 'revision_pending', 'read_error', 'submission_inconsistent']);
  const same = (a, b) => Number.isFinite(Number(a)) && Number.isFinite(Number(b)) && Math.round(Number(a) * 10) === Math.round(Number(b) * 10);
  const fmt = x => (Math.round(x * 10) / 10).toFixed(1).replace('.', ',');

  function appliesTo(curso) { return COURSES.has(curso); }

  function isPlanilla(p) {
    return !!(p && typeof p === 'object' && Array.isArray(p.columnas) && p.celdas && typeof p.celdas === 'object');
  }

  // Mapa sessionId → registro para el panel y las tarjetas. Reemplaza las celdas
  // de calificaciones_clase por las de la planilla y deja fuera lo que la
  // planilla no cuenta (p. ej. NM2 en 2.º A HC o sesiones que no son columnas).
  function mergeGrades(grades, planilla) {
    if (!isPlanilla(planilla)) return grades || {};
    const out = {};
    planilla.columnas.forEach((key, order) => {
      const cell = planilla.celdas[key];
      if (!cell) return;
      if (key.startsWith('nm2-') && cell.nota == null && !cell.pendiente && !cell.na) return; // no cuenta en su curso
      const prev = (grades && grades[key]) || {};
      const number = Number(key.match(/-(\d+)$/)[1]);
      const label = (LABELS[key.replace(/-\d+$/, '')] || (n => 'Clase ' + n))(number);
      out[key] = {
        sessionId: key,
        classNumber: number,
        title: prev.title || label,
        rowLabel: label,
        order,
        grade: cell.na ? null : cell.nota,
        needsReview: false,
        fromPlanilla: true,
        planillaCell: { nota: cell.nota, pendiente: cell.pendiente === true, na: cell.na === true },
        previous: { grade: prev.grade, status: prev.status, statusLabel: prev.statusLabel }
      };
    });
    return out;
  }

  // Estado y texto de una celda de la planilla. `submission` es el resultado del
  // lector canónico (classifySubmissionStatus) para esa sesión.
  function cellStatus(item, submission) {
    const c = item.planillaCell, done = !!(submission && submission.completed), prev = item.previous || {};
    if (c.na) return { status: 'not_applicable', gradeText: 'N/A', statusLabel: 'Clase anterior a tu llegada: no cuenta.' };
    if (c.pendiente) {
      const base = c.nota == null ? 'Pendiente: no entra a tu promedio.' : 'Pendiente: vale ' + fmt(c.nota) + ' por tener más de 5 pendientes.';
      return done
        ? { status: 'revision_pending', gradeText: c.nota == null ? 'P' : null, statusLabel: base + ' Ya la entregaste: se suma en la próxima actualización de la planilla.' }
        : { status: 'not_submitted', gradeText: c.nota == null ? 'P' : null, statusLabel: base };
    }
    if (c.nota == null) return { status: 'not_applicable', gradeText: '—', statusLabel: 'Sin nota: no cuenta en el promedio.' };
    if (same(prev.grade, c.nota) && prev.status && !BAD_STATUS.has(prev.status)) return { status: prev.status, gradeText: null, statusLabel: prev.statusLabel || '' };
    return done
      ? { status: 'submitted', gradeText: null, statusLabel: 'Nota de tu planilla del semestre.' }
      : { status: 'manual_grade', gradeText: null, statusLabel: 'Nota asignada por el docente.' };
  }

  function summary(planilla) {
    if (!isPlanilla(planilla)) return null;
    const pend = Number(planilla.pendientes) || 0;
    return {
      average: planilla.promedioFinal,
      averageLabel: 'Promedio final',
      copy: 'Las mismas notas de tu planilla del semestre' + (planilla.revisadaEl ? ', actualizada el ' + planilla.revisadaEl : '') + '.' +
        (pend > 5 ? ' Tus pendientes valen 1,0 por tener más de 5.' : pend ? ' Las P no entran al promedio.' : '')
    };
  }

  return { COURSES, appliesTo, isPlanilla, mergeGrades, cellStatus, summary };
});
