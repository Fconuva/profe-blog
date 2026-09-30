'use strict';

const { getAccessToken, requestJson, updatePlatform } = require('./firebase-maintenance-db');

const APPLY = process.argv.includes('--apply');
const RULE_ID = 'premio-sesion-sesion-u3-11';
const PATH = `configuracion/recompensas_muebles/${RULE_ID}`;
const SOURCES = ['sesion-u3-11', 'personal-u3-11-transformacion-generos'];
const FURNITURE = ['books', 'computerScreen', 'computerKeyboard', 'computerMouse', 'lampSquareTable'];

async function main() {
  const token = getAccessToken();
  const [before, standardResponses, personalResponses] = await Promise.all([
    requestJson('GET', `plataforma_estudiantes/${PATH}`, token),
    requestJson('GET', `plataforma_estudiantes/respuestas/${SOURCES[0]}`, token),
    requestJson('GET', `plataforma_estudiantes/respuestas/${SOURCES[1]}`, token)
  ]);
  const completed = new Set();
  [standardResponses || {}, personalResponses || {}].forEach(group => {
    Object.entries(group).forEach(([uid, response]) => {
      if (response && response.submitted === true && response.completada === true) completed.add(uid);
    });
  });
  const now = Date.now();
  const desired = {
    activa: true,
    tipo: 'sesion',
    fuente: SOURCES[0],
    fuentes: Object.fromEntries(SOURCES.map(id => [id, true])),
    titulo: 'Tarea 11 · Transformar un relato',
    nombreSet: 'Set de escritura',
    muebles: Object.fromEntries(FURNITURE.map(id => [id, true])),
    updatedAt: now,
    updatedBy: 'maintenance'
  };
  console.log(JSON.stringify({
    mode: APPLY ? 'apply' : 'dry-run',
    ruleId: RULE_ID,
    existed: !!before,
    sources: SOURCES,
    furniture: FURNITURE,
    studentsAlreadyEligible: completed.size
  }, null, 2));
  if (!APPLY) {
    console.log('Simulación terminada. No se escribió ningún dato.');
    return;
  }
  await updatePlatform({ [PATH]: desired });
  const after = await requestJson('GET', `plataforma_estudiantes/${PATH}`, getAccessToken());
  const furnitureAfter = Object.keys((after && after.muebles) || {}).filter(id => after.muebles[id] === true).sort();
  if (!after || after.activa !== true || after.fuente !== SOURCES[0] || JSON.stringify(furnitureAfter) !== JSON.stringify(FURNITURE.slice().sort())) {
    throw new Error('La relectura no confirmó la asignación del Set de escritura.');
  }
  console.log('Set de escritura asignado a la Tarea 11 y releído correctamente.');
}

main().catch(error => {
  console.error('ERROR:', error.message);
  process.exit(1);
});
