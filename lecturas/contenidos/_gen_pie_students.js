/**
 * Genera sesiones PIE individuales por estudiante a partir de las variantes base.
 * Ejecutar: node _gen_pie_students.js
 */
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const registryPath = path.join(dir, 'pie_students_2026.json');
const outDir = path.join(dir, 'pie');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

const COLORS = ['hl-blue', 'hl-pink', 'hl-orange', 'hl-purple', 'hl-red'];

const VISUAL_PRESETS = {
  'tea-max': {
    label: 'Adecuacion maxima',
    accessibility: {
      fontScale: 1.24,
      lineHeight: 2.02,
      answerBoxMinHeight: 260,
      choicePaddingY: 20,
      cardPadding: 28
    },
    introTitle: 'Trabaja paso a paso',
    introText: 'Lee primero el texto resaltado. Despues responde una pregunta a la vez. No hay barajado: el orden siempre sera el mismo.',
    promptText: 'Texto guiado y resaltado para lectura paso a paso.'
  },
  'simple-highlight': {
    label: 'Resaltado simple',
    accessibility: {
      fontScale: 1.14,
      lineHeight: 1.88,
      answerBoxMinHeight: 240,
      choicePaddingY: 16,
      cardPadding: 24
    },
    introTitle: 'Lee el texto resaltado',
    introText: 'La prueba mantiene la misma secuencia regular, pero con bloques destacados para facilitar la lectura.',
    promptText: 'Texto resaltado sin cambiar el foco de la prueba.'
  },
  'guided-highlight': {
    label: 'Resaltado guiado',
    accessibility: {
      fontScale: 1.18,
      lineHeight: 1.95,
      answerBoxMinHeight: 280,
      choicePaddingY: 18,
      cardPadding: 26
    },
    introTitle: 'Avanza en secuencia',
    introText: 'Encontraras el texto resaltado y una presentacion mas guiada. Responde en el orden en que aparece.',
    promptText: 'Texto resaltado con apoyo visual y secuencia guiada.'
  },
  'vision-highlight': {
    label: 'Apoyo visual ampliado',
    accessibility: {
      fontScale: 1.34,
      lineHeight: 2.05,
      answerBoxMinHeight: 300,
      choicePaddingY: 20,
      cardPadding: 30
    },
    introTitle: 'Texto ampliado y resaltado',
    introText: 'La prueba usa tipografia ampliada, mayor espacio entre lineas y resaltados visibles para mantener el foco.',
    promptText: 'Texto ampliado y resaltado con alto contraste.'
  }
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readJson(relativeFile) {
  return JSON.parse(fs.readFileSync(path.join(dir, relativeFile), 'utf8'));
}

function writeJson(relativeFile, data) {
  const filePath = path.join(dir, relativeFile);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeHtmlWithBreaks(value) {
  return escapeHtml(value).replace(/\n/g, '<br>');
}

function cleanCourse(course) {
  return String(course || '').replace(/-/g, ' ');
}

function buildIntroHtml(student, preset) {
  return [
    '<div class="pie-student-note">',
    '<div class="pie-note-topline">PIE individual 2026</div>',
    '<div class="pie-note-title">' + escapeHtml(preset.introTitle) + '</div>',
    '<p><strong>Estudiante:</strong> ' + escapeHtml(student.displayName) + ' · <strong>Curso:</strong> ' + escapeHtml(cleanCourse(student.course)) + '</p>',
    '<p><strong>Perfil:</strong> ' + escapeHtml(student.profileLabel) + '</p>',
    '<p>' + escapeHtml(preset.introText) + '</p>',
    '</div>'
  ].join('');
}

function decorateTextParagraph(text, index) {
  const color = COLORS[index % COLORS.length];
  return {
    html: '<p class="pie-reading-line"><span class="' + color + '">' + escapeHtmlWithBreaks(text) + '</span></p>'
  };
}

function decorateRichParagraph(html, index) {
  const toneIndex = index % COLORS.length;
  return {
    html: '<div class="pie-rich-block tone-' + (toneIndex + 1) + '">' + html + '</div>'
  };
}

function normalizeMaterialParagraphs(material) {
  if (Array.isArray(material.parrafos)) return material.parrafos;
  if (Array.isArray(material.paragraphs)) return material.paragraphs;
  return [];
}

function decorateMaterial(material, materialIndex, student, preset) {
  const next = clone(material);
  const paragraphs = normalizeMaterialParagraphs(next);
  const decoratedParagraphs = paragraphs.map((paragraph, paragraphIndex) => {
    const colorIndex = materialIndex + paragraphIndex;
    if (typeof paragraph === 'string') return decorateTextParagraph(paragraph, colorIndex);
    if (paragraph && typeof paragraph === 'object') {
      if (paragraph.html) return decorateRichParagraph(paragraph.html, colorIndex);
      return decorateTextParagraph(paragraph.texto || paragraph.text || '', colorIndex);
    }
    return decorateTextParagraph('', colorIndex);
  });

  if (next.html) {
    next.html = decorateRichParagraph(next.html, materialIndex).html;
  }
  if (materialIndex === 0) {
    next.html = buildIntroHtml(student, preset) + (next.html || '');
  }

  next.tipo = next.tipo || 'Lectura guiada';
  next.subtipo = next.subtipo || 'Texto ' + (materialIndex + 1);
  next.descripcion = preset.promptText + (next.descripcion ? ' ' + next.descripcion : '');
  next.parrafos = decoratedParagraphs;
  return next;
}

function mergeAccessibility(baseAccessibility, presetAccessibility) {
  return {
    ...clone(baseAccessibility || {}),
    ...presetAccessibility
  };
}

function buildSessionTitle(student) {
  return 'Lecturas PIE · ' + student.bookTitle + ' · ' + student.displayName;
}

function buildBookLabel(student) {
  return student.bookTitle + ' · ' + student.profileLabel;
}

function buildStudentContent(student, index) {
  const preset = VISUAL_PRESETS[student.visualPreset] || VISUAL_PRESETS['simple-highlight'];
  const source = readJson(student.sourceFile);
  const content = clone(source);
  content.meta = {
    ...(content.meta || {}),
    version: 'PIE individual 2026',
    perfil: student.profileLabel,
    sesion_sugerida: student.sessionId,
    uso_sugerido: [student.course],
    estudiante: {
      id: student.id,
      nombre: student.displayName,
      nombre_completo: student.fullName,
      rut: student.rut,
      curso: student.course,
      perfil: student.profileLabel
    },
    variante_origen: student.sourceFile,
    visualPreset: student.visualPreset
  };
  content.randomizacion = {
    mezclarItems: false,
    mezclarOpciones: false,
    shuffleItems: false,
    shuffleOptions: false
  };
  content.accesibilidad = mergeAccessibility(content.accesibilidad, preset.accessibility);
  content.estiloVisual = {
    theme: 'pie-dylan',
    preset: student.visualPreset,
    label: preset.label
  };
  content.materiales = (content.materiales || []).map((material, materialIndex) => (
    decorateMaterial(material, materialIndex, student, preset)
  ));
  content.sessionNode = {
    id: student.sessionId,
    titulo: buildSessionTitle(student),
    libro: buildBookLabel(student),
    cursosAsignados: [student.course],
    activa: false,
    orden: 500 + index,
    duracion_min: content.duracion_min || 90,
    visado: content.visado || 'Visado por EPM · Sr. Gabriel Castro · Encargado de Modalidad'
  };
  return content;
}

function main() {
  fs.mkdirSync(outDir, { recursive: true });
  registry.students.forEach((student, index) => {
    const content = buildStudentContent(student, index);
    writeJson(path.join('pie', student.sessionId + '.json'), content);
    console.log('  -> pie/' + student.sessionId + '.json');
  });
  console.log('Generadas ' + registry.students.length + ' sesiones PIE individuales.');
}

main();