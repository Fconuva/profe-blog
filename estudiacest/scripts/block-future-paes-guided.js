'use strict';

const { spawnSync } = require('child_process');
const path = require('path');

const project = 'estudiacest';
const databasePath = '/plataforma_paes/guias_config/blocked';
const futureGuides = Object.fromEntries(Array.from({ length: 12 }, (_, index) => [`g${index + 20}`, true]));
const apply = process.argv.includes('--apply');
const firebaseCli = process.platform === 'win32'
  ? path.join(process.env.APPDATA || '', 'npm/node_modules/firebase-tools/lib/bin/firebase.js')
  : null;
const command = firebaseCli ? process.execPath : 'firebase';

function firebase(args) {
  const result = spawnSync(command, firebaseCli ? [firebaseCli, ...args] : args, { encoding: 'utf8', windowsHide: true });
  if (result.status !== 0) throw new Error((result.error && result.error.message) || result.stderr || result.stdout || 'Firebase CLI falló.');
  return result.stdout.trim();
}

function readBlocked() {
  const output = firebase(['database:get', databasePath, '--project', project]);
  const jsonLine = output.split(/\r?\n/).reverse().find((line) => line === 'null' || line.trim().startsWith('{'));
  if (!jsonLine || jsonLine === 'null') return {};
  return JSON.parse(jsonLine);
}

const before = readBlocked();
const pending = Object.keys(futureGuides).filter((guideId) => before[guideId] !== true);
console.log(`Simulación: ${pending.length} guía(s) futura(s) por bloquear; ${Object.keys(before).length} estado(s) existente(s) se conservan.`);

if (!apply) {
  console.log('Sin cambios. Ejecuta con --apply para aplicar exactamente esta simulación.');
  process.exit(0);
}

firebase(['database:update', databasePath, '--data', JSON.stringify(futureGuides), '--force', '--project', project]);
const after = readBlocked();
const missing = Object.keys(futureGuides).filter((guideId) => after[guideId] !== true);
const preserved = Object.keys(before).every((guideId) => after[guideId] === before[guideId]);
if (missing.length || !preserved) throw new Error('La verificación posterior no coincide con la simulación; revisa Firebase.');
console.log(`Aplicación confirmada: 12 guías futuras bloqueadas y ${Object.keys(before).length} estado(s) anteriores preservados.`);
