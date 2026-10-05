'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { closeFirebase, readPlatform, updatePlatform } = require('./firebase-maintenance-db');

const SESSION_ID = 'sesion-u3-12';
const PERSONAL_SOURCE = 'personal-u3-11-transformacion-generos';
const PERSONAL_ID = 'personal-u3-12-entrevista';
const COURSES = ['2A-HC', '2B-HC'];

function standardSession(publishedAt) {
  return {
    titulo:'Unidad 3 · Clase 12 — La entrevista',
    descripcion:'Doce preguntas para analizar cómo las preguntas y respuestas construyen propósito, postura e información.',
    orden:312,
    programa:'simce',
    activa:true,
    respuestas_bloqueadas:false,
    resultados_visibles:false,
    retroalimentacion_visible:false,
    notas_evaluadas:false,
    formativa:true,
    formato_panel:'forma-p-entrevista',
    panel_unidad:'u3',
    panel_seccion:'plan',
    panel_orden:12,
    fecha_aplicacion:'2026-10-07',
    link_guia:'/estudiantes/guia-u3-s12-entrevista.html',
    prefer_guia:true,
    asignados:COURSES,
    publicada_at:publishedAt
  };
}

function personalSession(assigned, publishedAt) {
  return {
    titulo:'Ruta personal · Sesión 12 — Preguntar y escuchar',
    descripcion:'Seis preguntas guiadas para relacionar pregunta, respuesta y evidencia.',
    orden:312,
    programa:'simce',
    activa:true,
    respuestas_bloqueadas:false,
    resultados_visibles:false,
    retroalimentacion_visible:false,
    notas_evaluadas:false,
    formativa:true,
    variante:'guided-access-2026',
    fecha_aplicacion:'2026-10-07',
    link_guia:'/estudiantes/apoyo-personal/actividad.html?sesion=12',
    prefer_guia:true,
    asignados:assigned,
    publicada_at:publishedAt
  };
}

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

function verify(actual, expected, id) {
  if (!actual) throw new Error(`No existe ${id} después de publicar.`);
  Object.entries(expected).forEach(([key, value]) => {
    if (stable(actual[key]) !== stable(value)) throw new Error(`Relectura inválida en ${id}/${key}.`);
  });
}

async function main() {
  const apply = process.argv.includes('--apply');
  const publishedAt = Date.now();
  try {
    const platform = await readPlatform();
    const sessions = platform.sesiones || {};
    const assigned = [...new Set((sessions[PERSONAL_SOURCE] && sessions[PERSONAL_SOURCE].asignados) || [])];
    if (!assigned.length) throw new Error(`La sesión fuente ${PERSONAL_SOURCE} no tiene estudiantes asignados.`);
    const desiredStandard = standardSession(publishedAt);
    const desiredPersonal = personalSession(assigned, publishedAt);
    console.log(JSON.stringify({
      mode:apply ? 'apply' : 'dry-run',
      standard:{ id:SESSION_ID, cursos:COURSES, activa:true },
      personal:{ id:PERSONAL_ID, assignedCount:assigned.length, activa:true }
    }, null, 2));
    if (!apply) {
      console.log('Sin cambios. Ejecuta con --apply después del despliegue verificado.');
      return;
    }
    const backupDir = path.join(os.tmpdir(), 'estudiacest-private-backups');
    fs.mkdirSync(backupDir, { recursive:true });
    const backupPath = path.join(backupDir, `simce-u3s12-before-publish-${publishedAt}.json`);
    fs.writeFileSync(backupPath, JSON.stringify({ [SESSION_ID]:sessions[SESSION_ID] || null, [PERSONAL_ID]:sessions[PERSONAL_ID] || null }, null, 2), 'utf8');
    await updatePlatform({ [`sesiones/${SESSION_ID}`]:desiredStandard, [`sesiones/${PERSONAL_ID}`]:desiredPersonal });
    const verified = await readPlatform();
    verify((verified.sesiones || {})[SESSION_ID], desiredStandard, SESSION_ID);
    verify((verified.sesiones || {})[PERSONAL_ID], desiredPersonal, PERSONAL_ID);
    console.log(JSON.stringify({ applied:true, verified:[SESSION_ID, PERSONAL_ID], personalAssignedCount:assigned.length, backupPath }, null, 2));
  } finally {
    await closeFirebase();
  }
}

if (require.main === module) main().catch(error => { console.error(`SIMCE_U3S12_PUBLISH_FAILED: ${error.message}`); process.exit(1); });

module.exports = { SESSION_ID, PERSONAL_ID, standardSession, personalSession };
