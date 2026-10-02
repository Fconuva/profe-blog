#!/usr/bin/env node
/*
 * Regla de Estudia CEST: toda página de NM3 y NM4 carga el panel para anotar sobre
 * la pizarra táctil (/assets/anotar-pizarra.js). Se exceptúan los paneles docentes
 * de corrección y administración: carpetas calificar/ y revisar/, y archivos *admin.html.
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const TAG = '<script src="/assets/anotar-pizarra.js" defer></script>';
const AREAS = ['nm3', 'nm4'];
const MODULO = path.join(ROOT, 'assets', 'anotar-pizarra.js');

function excluida(rel) {
  return rel.includes('/calificar/') || rel.includes('/revisar/') || rel.endsWith('admin.html');
}

function recorrer(dir, salida) {
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const ruta = path.join(dir, entrada.name);
    if (entrada.isDirectory()) recorrer(ruta, salida);
    else if (entrada.name.endsWith('.html')) salida.push(ruta);
  }
  return salida;
}

const fallas = [];
if (!fs.existsSync(MODULO)) {
  fallas.push('Falta assets/anotar-pizarra.js.');
} else {
  const modulo = fs.readFileSync(MODULO, 'utf8');
  for (const marca of ['Panel para anotar', 'anota-panel', 'destacador', 'goma', 'touchmove']) {
    if (!modulo.includes(marca)) fallas.push(`assets/anotar-pizarra.js no contiene «${marca}».`);
  }
}

let revisadas = 0;
let excluidas = 0;
for (const area of AREAS) {
  const dir = path.join(ROOT, area);
  if (!fs.existsSync(dir)) continue;
  for (const ruta of recorrer(dir, [])) {
    const rel = path.relative(ROOT, ruta).split(path.sep).join('/');
    if (excluida(rel)) { excluidas += 1; continue; }
    revisadas += 1;
    const html = fs.readFileSync(ruta, 'utf8');
    if (!html.includes(TAG)) fallas.push(`${rel}: falta ${TAG}`);
    else if (html.split(TAG).length > 2) fallas.push(`${rel}: carga el panel más de una vez`);
  }
}

if (fallas.length) {
  console.error('Regla del panel para anotar (NM3 y NM4) incumplida:');
  for (const f of fallas) console.error(`- ${f}`);
  console.error(`\nAgrega ${TAG} antes de </body> en cada página de NM3 y NM4. Solo se exceptúan calificar/, revisar/ y *admin.html.`);
  process.exit(1);
}

console.log(`Panel para anotar auditado: ${revisadas} páginas de NM3 y NM4 lo cargan; ${excluidas} paneles docentes exceptuados.`);
