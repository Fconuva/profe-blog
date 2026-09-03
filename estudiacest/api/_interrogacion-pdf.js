const fs = require('node:fs');
const path = require('node:path');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

const A4 = [595.28, 841.89];
const COLORS = {
  navy: rgb(0.075, 0.11, 0.29),
  blue: rgb(0.114, 0.31, 0.569),
  gold: rgb(0.965, 0.69, 0.055),
  ink: rgb(0.075, 0.125, 0.2),
  muted: rgb(0.34, 0.41, 0.5),
  line: rgb(0.82, 0.86, 0.91),
  soft: rgb(0.955, 0.972, 0.988),
  white: rgb(1, 1, 1)
};

const LEVELS = new Map([
  [1, { label: 'Completa', detail: 'Precisa, completa y fundamentada con evidencia pertinente.' }],
  [0.8, { label: 'Correcta', detail: 'Correcta; omite un detalle menor o desarrolla poco la evidencia.' }],
  [0.6, { label: 'Parcial', detail: 'Reconoce la idea central, pero deja una parte importante sin responder.' }],
  [0.4, { label: 'Con confusión', detail: 'Incluye una idea pertinente junto con un error o confusión.' }],
  [0.2, { label: 'Muy vaga', detail: 'Menciona una idea relacionada, sin precisión ni evidencia suficiente.' }],
  [0, { label: 'No lograda', detail: 'No responde, se desvía o contradice información central de la obra.' }]
]);

const INSTRUMENTS = {
  nm3: { title: 'El lugar sin límites', level: 'NM3 · Plan lector' },
  nm4: { title: 'Mocha Dick', level: 'NM4 · Plan lector' }
};

function safeText(value) {
  return String(value == null ? '' : value)
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/[^\x20-\x7E\u00A0-\u00FF]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatNumber(value) {
  return Number(value).toFixed(1).replace('.', ',');
}

function formatCourse(value) {
  const match = String(value || '').match(/^(\d)([A-Z])(?:TP)?$/);
  if (!match) return safeText(value);
  return `${match[1]}°${match[2]}${String(value).endsWith('TP') ? ' TP' : ''}`;
}

function formatDate(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('es-CL', {
    timeZone: 'America/Santiago',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

function wrap(text, font, size, width, maxLines) {
  const words = safeText(text).split(' ').filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= width) {
      current = candidate;
      continue;
    }
    if (current) lines.push(current);
    current = word;
    if (lines.length === maxLines) break;
  }
  if (current && lines.length < maxLines) lines.push(current);
  if (words.length && lines.join(' ').length < safeText(text).length && lines.length) {
    let last = lines.length - 1;
    while (lines[last].length && font.widthOfTextAtSize(`${lines[last]}...`, size) > width) {
      lines[last] = lines[last].slice(0, -1).trimEnd();
    }
    lines[last] += '...';
  }
  return lines;
}

function drawWrapped(page, text, options) {
  const lines = wrap(text, options.font, options.size, options.width, options.maxLines || 2);
  lines.forEach((line, index) => page.drawText(line, {
    x: options.x,
    y: options.y - index * (options.lineHeight || options.size + 2),
    size: options.size,
    font: options.font,
    color: options.color || COLORS.ink
  }));
}

function filenameFor(student, instrument) {
  const clean = safeText(student.nombre)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
  return `Retroalimentacion_${instrument.toUpperCase()}_${clean || 'Estudiante'}.pdf`;
}

async function createInterrogationPdf({ instrumentId, student, grade, recording }) {
  const instrument = INSTRUMENTS[instrumentId] || INSTRUMENTS.nm4;
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Retroalimentación · ${instrument.title}`);
  pdf.setAuthor('Colegio Salesiano de Talca');
  pdf.setSubject('Retroalimentación de interrogación oral');
  pdf.setCreator('Estudia CEST');
  const page = pdf.addPage(A4);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const logoPath = path.join(__dirname, '..', 'estudiantes', 'assets', 'insignia_talca_1.png');
  const logo = await pdf.embedPng(fs.readFileSync(logoPath));

  page.drawRectangle({ x: 0, y: 754, width: A4[0], height: 88, color: COLORS.navy });
  page.drawRectangle({ x: 0, y: 750, width: A4[0], height: 4, color: COLORS.gold });
  page.drawImage(logo, { x: 38, y: 769, width: 43, height: 55 });
  page.drawText('COLEGIO SALESIANO DE TALCA', { x: 98, y: 812, size: 8.5, font: bold, color: COLORS.gold });
  page.drawText('RETROALIMENTACIÓN DE INTERROGACIÓN ORAL', { x: 98, y: 790, size: 15, font: bold, color: COLORS.white });
  page.drawText(`${instrument.level} · ${instrument.title}`, { x: 98, y: 771, size: 10, font: regular, color: rgb(0.88, 0.92, 0.98) });

  page.drawRectangle({ x: 36, y: 681, width: 523, height: 52, color: COLORS.soft, borderColor: COLORS.line, borderWidth: 0.8 });
  page.drawText('ESTUDIANTE', { x: 48, y: 716, size: 7.2, font: bold, color: COLORS.muted });
  drawWrapped(page, student.nombre, { x: 48, y: 702, width: 300, maxLines: 2, size: 10.2, lineHeight: 11, font: bold });
  page.drawText('CURSO', { x: 362, y: 716, size: 7.2, font: bold, color: COLORS.muted });
  page.drawText(formatCourse(student.curso), { x: 362, y: 700, size: 11, font: bold, color: COLORS.ink });
  page.drawText('NOTA', { x: 493, y: 716, size: 7.2, font: bold, color: COLORS.muted });
  page.drawText(formatNumber(grade.nota), { x: 493, y: 694, size: 19, font: bold, color: COLORS.blue });

  page.drawText('RÚBRICA APLICADA A LAS SIETE RESPUESTAS', { x: 36, y: 657, size: 9.3, font: bold, color: COLORS.blue });
  page.drawRectangle({ x: 36, y: 627, width: 523, height: 22, color: COLORS.blue });
  page.drawText('N°', { x: 46, y: 634, size: 7.5, font: bold, color: COLORS.white });
  page.drawText('PREGUNTA SORTEADA', { x: 74, y: 634, size: 7.5, font: bold, color: COLORS.white });
  page.drawText('NIVEL OBSERVADO', { x: 178, y: 634, size: 7.5, font: bold, color: COLORS.white });
  page.drawText('PUNTAJE', { x: 507, y: 634, size: 7.5, font: bold, color: COLORS.white });

  const questions = Array.isArray(grade.preguntas) ? grade.preguntas : [];
  const scores = grade.puntajes && typeof grade.puntajes === 'object' ? grade.puntajes : {};
  for (let index = 0; index < 7; index++) {
    const y = 585 - index * 42;
    const hasScore = Object.prototype.hasOwnProperty.call(scores, index);
    const score = hasScore ? Number(scores[index]) : null;
    const level = hasScore ? LEVELS.get(score) : { label: 'Sin puntaje', detail: 'No se registró puntaje para esta respuesta.' };
    page.drawRectangle({
      x: 36,
      y,
      width: 523,
      height: 42,
      color: index % 2 ? COLORS.soft : COLORS.white,
      borderColor: COLORS.line,
      borderWidth: 0.55
    });
    page.drawText(String(index + 1), { x: 48, y: y + 16, size: 9, font: bold, color: COLORS.blue });
    page.drawText(`Pregunta ${questions[index] || '-'} del banco`, { x: 74, y: y + 16, size: 8.2, font: regular, color: COLORS.ink });
    page.drawText(level.label, { x: 178, y: y + 24, size: 8.2, font: bold, color: COLORS.ink });
    drawWrapped(page, level.detail, { x: 178, y: y + 12, width: 310, maxLines: 2, size: 7.1, lineHeight: 8.4, font: regular, color: COLORS.muted });
    page.drawText(hasScore ? formatNumber(score) : '-', { x: 516, y: y + 16, size: 10, font: bold, color: COLORS.blue });
  }

  page.drawText('ESCALA DE REFERENCIA', { x: 36, y: 279, size: 8.8, font: bold, color: COLORS.blue });
  const scale = [...LEVELS.entries()];
  scale.forEach(([score, level], index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const x = 36 + column * 176;
    const y = 224 - row * 45;
    page.drawRectangle({ x, y, width: 171, height: 38, color: COLORS.soft, borderColor: COLORS.line, borderWidth: 0.6 });
    page.drawText(formatNumber(score), { x: x + 9, y: y + 22, size: 9, font: bold, color: COLORS.blue });
    page.drawText(level.label, { x: x + 42, y: y + 22, size: 7.8, font: bold, color: COLORS.ink });
    drawWrapped(page, level.detail, { x: x + 9, y: y + 10, width: 153, maxLines: 1, size: 6.2, lineHeight: 7, font: regular, color: COLORS.muted });
  });

  page.drawRectangle({ x: 36, y: 103, width: 523, height: 55, color: COLORS.white, borderColor: COLORS.line, borderWidth: 0.7 });
  page.drawText('RETROALIMENTACIÓN DEL DOCENTE', { x: 46, y: 143, size: 7.5, font: bold, color: COLORS.blue });
  drawWrapped(page, grade.observacion || 'Sin observaciones adicionales.', { x: 46, y: 129, width: 502, maxLines: 3, size: 7.7, lineHeight: 9.5, font: regular, color: COLORS.ink });

  const followUp = recording && grade.intentoId && recording.intentoId === grade.intentoId
    ? recording.notaDocente
    : '';
  page.drawRectangle({ x: 36, y: 52, width: 523, height: 42, color: COLORS.soft, borderColor: COLORS.line, borderWidth: 0.7 });
  page.drawText('NOTA DE SEGUIMIENTO', { x: 46, y: 80, size: 7.3, font: bold, color: COLORS.blue });
  drawWrapped(page, followUp || 'Sin nota de seguimiento.', { x: 46, y: 66, width: 502, maxLines: 2, size: 7.2, lineHeight: 8.5, font: regular, color: COLORS.ink });

  const points = Object.values(scores).reduce((sum, value) => sum + Number(value || 0), 0);
  page.drawText(`Puntaje acumulado: ${formatNumber(points)} de 7,0`, { x: 36, y: 30, size: 7.2, font: bold, color: COLORS.ink });
  const footer = `Calificado por ${safeText(grade.docente || 'docente')} · ${formatDate(grade.fecha)} · Documento 1 de 1`;
  page.drawText(footer, { x: 559 - regular.widthOfTextAtSize(footer, 6.8), y: 30, size: 6.8, font: regular, color: COLORS.muted });

  return {
    bytes: Buffer.from(await pdf.save()),
    filename: filenameFor(student, instrumentId)
  };
}

module.exports = { createInterrogationPdf, LEVELS };
