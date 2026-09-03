#!/usr/bin/env node
'use strict';

// Acceso técnico local para revisar audios sin exponer la clave en Git. La
// transcripción o análisis posterior son apoyo al docente, nunca una nota
// automática.
const fs = require('fs');
const path = require('path');

const API = process.env.INTERROGACION_REVIEW_API || 'https://www.estudiacest.com/api/interrogacion';
const DEFAULT_TOKEN_FILE = path.join(process.env.USERPROFILE || process.env.HOME || '', '.estudiacest', 'interrogacion-review-token.txt');

function token() {
  if (process.env.INTERROGACION_REVIEW_TOKEN) return process.env.INTERROGACION_REVIEW_TOKEN.trim();
  const file = process.env.INTERROGACION_REVIEW_TOKEN_FILE || DEFAULT_TOKEN_FILE;
  if (!file || !fs.existsSync(file)) throw new Error(`Falta el token local de revisión en ${file}.`);
  return fs.readFileSync(file, 'utf8').trim();
}

function argument(name, fallback = '') {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

async function call(body) {
  const response = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Review-Key': token() },
    body: JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
  return data;
}

function safe(value) {
  return String(value || '').replace(/[^A-Za-z0-9_-]+/g, '-').slice(0, 100);
}

async function list(instrumento) {
  const data = await call({ accion: 'revision-agente-lista', instrumento });
  return data.grabaciones || [];
}

async function download(instrumento, outputDirectory) {
  const rows = await list(instrumento);
  fs.mkdirSync(outputDirectory, { recursive: true });
  const manifest = [];
  for (const row of rows) {
    const folder = path.join(outputDirectory, `${safe(row.curso)}_${safe(row.alumnoId)}_${safe(row.intentoId)}`);
    fs.mkdirSync(folder, { recursive: true });
    for (let position = 0; position < 7; position += 1) {
      const answer = row.respuestas && row.respuestas[position];
      if (!answer) continue;
      const result = await call({
        accion: 'revision-agente-audio',
        instrumento,
        alumnoId: row.alumnoId,
        intentoId: row.intentoId,
        posicion: position
      });
      const response = await fetch(result.url);
      if (!response.ok) throw new Error(`No se pudo descargar la respuesta ${position + 1}.`);
      const contentType = response.headers.get('content-type') || '';
      const extension = contentType.includes('mp4') ? 'm4a' : contentType.includes('ogg') ? 'ogg' : 'webm';
      const fileName = `respuesta-${position + 1}-pregunta-${result.pregunta}.${extension}`;
      fs.writeFileSync(path.join(folder, fileName), Buffer.from(await response.arrayBuffer()));
    }
    manifest.push({
      instrumento: row.instrumento,
      alumnoId: row.alumnoId,
      intentoId: row.intentoId,
      curso: row.curso,
      preguntas: row.preguntas,
      estado: row.estado,
      fechaEntrega: row.fechaEntrega
    });
  }
  fs.writeFileSync(path.join(outputDirectory, 'manifest.json'), JSON.stringify(manifest, null, 2));
  return rows.length;
}

async function main() {
  const instrumento = argument('--instrumento', 'nm3').toLowerCase();
  if (!['nm3', 'nm4'].includes(instrumento)) throw new Error('Usa --instrumento nm3 o --instrumento nm4.');
  const output = argument('--descargar');
  if (output) {
    const count = await download(instrumento, path.resolve(output));
    console.log(`Descargadas ${count} interrogaciones en ${path.resolve(output)}.`);
    return;
  }
  const rows = await list(instrumento);
  console.log(JSON.stringify(rows.map((row) => ({
    instrumento: row.instrumento,
    referencia: `${row.alumnoId}/${row.intentoId}`,
    curso: row.curso,
    estado: row.estado,
    respuestas: Object.keys(row.respuestas || {}).length,
    fechaEntrega: row.fechaEntrega
  })), null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
