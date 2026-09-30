'use strict';

const { GUIDED_VARIANT, getGuidedSession } = require('../api/_simce-personal-guided-catalog');
const { closeFirebase, readPlatform, updatePlatform } = require('./firebase-maintenance-db');

const ROUTE = '/estudiantes/apoyo-personal/';
const NUMBER = '11';
const CATALOG_SESSION = getGuidedSession(NUMBER);

function buildPlan(platform, updatedAt) {
  if (!CATALOG_SESSION) throw new Error('La Sesión 11 no existe en el catálogo privado.');
  const assigned = Object.entries(platform.estudiantes || {})
    .filter(([, student]) => student && student.ruta_personal === ROUTE)
    .map(([uid]) => uid)
    .sort();
  if (!assigned.length) throw new Error('No hay estudiantes con ruta personal para asignar.');

  const record = {
    titulo: 'Ruta personal · Sesión 11 — Transformar un relato',
    descripcion: 'Versión guiada para reconocer cómo un relato se transforma en noticia o diálogo dramático sin inventar hechos.',
    orden: 311,
    programa: 'simce',
    activa: true,
    resultados_visibles: false,
    retroalimentacion_visible: false,
    respuestas_bloqueadas: false,
    requiere_entrega: true,
    tipo: 'actividad_guiada',
    modalidad: 'ruta_personal',
    panel_unidad: 'u3',
    panel_seccion: 'plan',
    panel_orden: 11,
    fecha_aplicacion: '2026-09-30',
    link_guia: '/estudiantes/apoyo-personal/actividad.html?sesion=11',
    prefer_guia: true,
    total_preguntas: 6,
    variant: GUIDED_VARIANT,
    asignados: assigned,
    updatedAt
  };
  return { assigned, record, update: { [`sesiones/${CATALOG_SESSION.id}`]: record } };
}

async function main() {
  const apply = process.argv.includes('--apply');
  try {
    const platform = await readPlatform();
    const plan = buildPlan(platform, Date.now());
    console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', sessionId: CATALOG_SESSION.id, assignedStudents: plan.assigned.length }, null, 2));
    if (!apply) return;
    await updatePlatform(plan.update);
    const verified = await readPlatform();
    const stored = verified.sesiones && verified.sesiones[CATALOG_SESSION.id];
    if (!stored || stored.variant !== GUIDED_VARIANT || !Array.isArray(stored.asignados) || stored.asignados.length !== plan.assigned.length) {
      throw new Error('La relectura no confirmó la sesión y sus asignaciones.');
    }
    console.log(JSON.stringify({ applied: true, verified: true, assignedStudents: stored.asignados.length }, null, 2));
  } finally {
    await closeFirebase();
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(`PUBLISH_PERSONAL_SESSION_11_FAILED: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { buildPlan };
