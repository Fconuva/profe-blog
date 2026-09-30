const fs = require('fs');
const path = require('path');
const { classifySubmissionStatus } = require('./class-submission-status');
const { readPlatform } = require('./firebase-maintenance-db');
const { GUIDED_SESSIONS } = require('../api/_simce-personal-guided-catalog');

// Clases 1 a 8 y 10 de la Unidad 3. La Clase 9 es informativa (`requiere_entrega: false`)
// y no lleva nota. El modelo del 26-ago cubría 1 a 6; el del 30-sep agrega 7, 8 y 10.
const SESSION_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 10].map(number => `sesion-u3-${number}`);
const COURSES = new Set(['2A-HC', '2B-HC']);
// Quien se incorpora después del cierre de la regularización (23-sep) no cursó la unidad.
const UNIT_ENROLLMENT_CUTOFF = Date.parse('2026-09-24T00:00:00-03:00');
// Clases que no se aplicaron a un curso: quedan sin evaluar para todo ese curso,
// también para quien alcanzó a hacerlas. Decisión de Francisco del 30-sep-2026:
// la Clase 8 (ensayo parcial) no se hizo en ninguno de los dos cursos.
const NOT_EVALUATED = { 'sesion-u3-8': ['2A-HC', '2B-HC'] };

const CONFIG = {
  'sesion-u3-1': { alternatives: 16, concepts: 0, writing: [['desarrollo', 60], ['desarrollo2', 60]] },
  'sesion-u3-2': { alternatives: 20, concepts: 0, writing: [['desarrollo', 60], ['desarrollo2', 60]] },
  'sesion-u3-3': { alternatives: 10, concepts: 18, writing: [['respuesta_abierta', 40], ['metacognicion.reconozco', 20], ['metacognicion.identifico', 20], ['metacognicion.analizo', 20], ['metacognicion.transfiero', 20], ['metacognicion.proposito', 20]] },
  'sesion-u3-4': { alternatives: 30, concepts: 12, writing: [['open', 40], ['meta.m1', 12], ['meta.m2', 12], ['meta.m3', 12]] },
  'sesion-u3-5': { alternatives: 32, concepts: 8, writing: [['openResponses.q10', 90], ['openResponses.q24', 90], ['meta.identifique', 15], ['meta.explique', 15], ['meta.mejorare', 15]] },
  'sesion-u3-6': { alternatives: 14, concepts: 0, writing: [['desarrollo', 60], ['desarrollo2', 60]] },
  // Mínimos de la propia guía (`estudiantes/js/u3s7-data.js`).
  'sesion-u3-7': { alternatives: 50, concepts: 8, writing: [['openResponses.o1', 180], ['openResponses.o2', 220], ['metaResponses.m1', 25], ['metaResponses.m2', 25], ['metaResponses.m3', 25]] },
  // Ensayo parcial: las dos preguntas metacognitivas no alteran el puntaje, pero sí la laboriosidad.
  'sesion-u3-8': { alternatives: 36, concepts: 0, writing: [['metaResponses.m1', 15], ['metaResponses.m2', 15]] },
  // Desarrollo sobre la opinión del autor y noticia propia con titular, lead, cuerpo y cierre.
  'sesion-u3-10': { alternatives: 14, concepts: 0, writing: [['desarrollo', 60], ['noticia', 300]] }
};

// Estas sesiones no tienen `titulo` en Firebase; el panel usa su respaldo estático.
const TITLE_FALLBACKS = {
  'sesion-u3-6': 'Unidad 3 · Clase 6 — Poesía II: el lenguaje figurado',
  'sesion-u3-8': 'Unidad 3 · Clase 8 — Ensayo parcial SIMCE',
  'sesion-u3-10': 'Unidad 3 · Clase 10 — Crónica y carta'
};

const SUBSTANTIVE_FIELDS = {
  'sesion-u3-3': ['respuesta_abierta'],
  'sesion-u3-4': ['open'],
  'sesion-u3-5': ['openResponses.q10', 'openResponses.q24'],
  'sesion-u3-7': ['openResponses.o1', 'openResponses.o2'],
  'sesion-u3-8': [],
  'sesion-u3-10': ['desarrollo', 'noticia']
};

function readSource(snapshotPath) {
  if (snapshotPath) return Promise.resolve(JSON.parse(fs.readFileSync(path.resolve(snapshotPath), 'utf8')));
  return readPlatform();
}

// Exclusiones decididas por UID y datos, nunca por nombre: cuentas técnicas sin RUN e
// incorporaciones posteriores a la unidad.
function exclusionFor(uid, student) {
  const hasRun = Boolean(student.run || student.rut || student.RUN);
  if (!hasRun && /cuenta\s+t\S*cnica/i.test(String(student.nombre || ''))) {
    return 'Cuenta técnica de prueba';
  }
  if (Number(student.createdAt) >= UNIT_ENROLLMENT_CUTOFF) {
    return 'Incorporación posterior al cierre de la unidad';
  }
  return '';
}

// Ruta personal adaptada: número de clase → sesión personal asignada a este UID.
function personalRouteFor(uid, sessions) {
  const route = {};
  Object.entries(sessions || {}).forEach(([sessionId, session]) => {
    if (!sessionId.startsWith('personal-u3-')) return;
    if (!Array.isArray(session && session.asignados) || !session.asignados.includes(uid)) return;
    const number = Number(sessionId.split('-')[2]);
    if (Number.isInteger(number)) route[number] = sessionId;
  });
  return route;
}

function personalQuestionCount(personalSessionId, response, result) {
  const guided = GUIDED_SESSIONS[personalSessionId.split('-')[2]];
  const key = guided && guided.key;
  const fromKey = Array.isArray(key) ? key.length : Object.keys(key || {}).length;
  return fromKey || Number(result.total || response.total) || 6;
}

// La clase se califica con la mejor evidencia entre la guía estándar y la sesión
// personal. Sin evidencia en ninguna, queda pendiente mientras la ruta siga abierta.
function personalRouteRow(student, uid, sessionId, session, standard, personalSessionId, platform) {
  const standardRow = rowFor(student, uid, sessionId, session, standard.response, standard.result);
  const response = ((platform.respuestas || {})[personalSessionId] || {})[uid] || {};
  const result = ((platform.resultados || {})[personalSessionId] || {})[uid] || {};
  const personalConfig = { alternatives: personalQuestionCount(personalSessionId, response, result), concepts: 0, writing: [] };
  const personalRow = rowFor(student, uid, sessionId, session, response, result, personalConfig);
  const hasEvidence = row => row.status !== 'Sin iniciar';
  const candidates = [standardRow, personalRow].filter(hasEvidence);
  if (!candidates.length) {
    return {
      ...standardRow,
      status: 'Pendiente ruta personal',
      proposedGrade: null,
      personalRoute: true,
      evidenceSession: personalSessionId,
      flags: ['Ruta personal adaptada en curso: se califica cuando complete la sesión']
    };
  }
  const best = candidates.sort((left, right) => right.proposedGrade - left.proposedGrade || right.completion - left.completion)[0];
  return {
    ...best,
    sessionId,
    personalRoute: true,
    evidenceSession: best === personalRow ? personalSessionId : sessionId,
    flags: [...best.flags, best === personalRow ? 'Calificada con la sesión de la ruta personal adaptada' : 'Calificada con la guía estándar']
  };
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const next = argv[index + 1];
    args[token.slice(2)] = !next || next.startsWith('--') ? true : next;
    if (next && !next.startsWith('--')) index += 1;
  }
  return args;
}

function valuesOf(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return Object.values(value);
  return [];
}

function nonEmpty(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

function countValues(value) {
  return valuesOf(value).filter(nonEmpty).length;
}

function getPath(source, dottedPath) {
  return dottedPath.split('.').reduce((value, key) => {
    if (value === null || value === undefined) return undefined;
    if (Array.isArray(value) && /^\d+$/.test(key)) return value[Number(key)];
    return typeof value === 'object' ? value[key] : undefined;
  }, source);
}

function textValue(response, result, field) {
  const responseValue = getPath(response || {}, field);
  if (nonEmpty(responseValue)) return String(responseValue).trim();
  const resultValue = getPath(result || {}, field);
  return nonEmpty(resultValue) ? String(resultValue).trim() : '';
}

function countConcepts(sessionId, response) {
  const concepts = response.concepts || response.concepto || {};
  if (sessionId === 'sesion-u3-3') {
    return countValues(concepts.matching) + countValues(concepts.vf || concepts.tf) +
      valuesOf(concepts.words).filter(value => value === true || nonEmpty(value)).length;
  }
  if (sessionId === 'sesion-u3-4') {
    return countValues(concepts.matching) + countValues(concepts.tf || concepts.vf);
  }
  if (sessionId === 'sesion-u3-5' || sessionId === 'sesion-u3-7') return countValues(concepts);
  return 0;
}

function countAlternatives(response) {
  return Object.values(response.answers || {}).filter(nonEmpty).length;
}

function writingScore(text, minimum) {
  if (!text) return 0;
  return text.length >= minimum ? 1 : 0.5;
}

function gradeBand(completion) {
  if (completion <= 0) return 1;
  if (completion <= 0.5) return 3;
  if (completion < 0.85) return 5;
  return 7;
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenSimilarity(left, right) {
  const a = new Set(left.split(' ').filter(Boolean));
  const b = new Set(right.split(' ').filter(Boolean));
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  a.forEach(token => { if (b.has(token)) intersection += 1; });
  return (2 * intersection) / (a.size + b.size);
}

function substantiveWriting(sessionId, response, result) {
  const fields = SUBSTANTIVE_FIELDS[sessionId] || ['desarrollo', 'desarrollo2'];
  return fields.map(field => ({ field, text: textValue(response, result, field) })).filter(item => item.text.length >= 60);
}

function rowFor(student, uid, sessionId, session, response, result, configOverride) {
  const config = configOverride || CONFIG[sessionId];
  const alternativesDone = Math.min(config.alternatives, countAlternatives(response));
  const conceptsDone = Math.min(config.concepts, countConcepts(sessionId, response));
  const writings = config.writing.map(([field, minimum]) => {
    const text = textValue(response, result, field);
    return { field, minimum, length: text.length, score: writingScore(text, minimum) };
  });
  const writingDone = writings.reduce((sum, item) => sum + item.score, 0);
  const totalUnits = config.alternatives + config.concepts + config.writing.length;
  const completedUnits = alternativesDone + conceptsDone + writingDone;
  const completion = totalUnits ? completedUnits / totalUnits : 0;
  const hasActivityEvidence = Object.keys(response || {}).length > 0 || Object.keys(result || {}).length > 0;
  const submission = classifySubmissionStatus(response, { result });
  const writingAttempted = writings.filter(item => item.length > 0).length;
  const writingComplete = writings.filter(item => item.score === 1).length;
  let proposedGrade = gradeBand(completion);
  if (config.writing.length && writingAttempted === 0 && proposedGrade >= 5) proposedGrade -= 2;
  else if (config.writing.length && writingComplete < config.writing.length && proposedGrade === 7) proposedGrade = 5;
  if (!hasActivityEvidence) proposedGrade = 1;

  const flags = [];
  if (!hasActivityEvidence) flags.push('Sin respuesta: validar asistencia, licencia o vía alternativa antes de cerrar la nota');
  else if (submission.status === 'inconsistent') flags.push('Estado de entrega inconsistente: resultado, nota o telemetría no sustituyen los indicadores canónicos');
  else if (!submission.delivered) flags.push('Borrador sin entrega confirmada');
  if (hasActivityEvidence && writingAttempted === 0) flags.push('Escritura requerida ausente');
  else if (writingComplete < config.writing.length) flags.push('Escritura requerida incompleta');
  if (!Number(response.startedAt)) flags.push('Sin tiempo inicial histórico: no aplicar rebaja por velocidad');

  return {
    uid,
    run: student.run || student.rut || student.RUN || '',
    name: student.nombre || student.name || '',
    course: String(student.curso || '').toUpperCase(),
    sessionId,
    sessionTitle: session.titulo || TITLE_FALLBACKS[sessionId] || sessionId,
    applicationDate: session.fecha_aplicacion || '',
    status: !hasActivityEvidence ? 'Sin iniciar' : submission.delivered ? 'Entregada' : submission.status === 'inconsistent' ? 'Inconsistente' : 'Borrador',
    submissionStatus: submission.status,
    alternativesDone,
    alternativesTotal: config.alternatives,
    conceptsDone,
    conceptsTotal: config.concepts,
    writingDone,
    writingTotal: config.writing.length,
    writingAttempted,
    writingComplete,
    completedUnits,
    totalUnits,
    completion: Math.round(completion * 1000) / 1000,
    proposedGrade,
    flags,
    responseTimestamp: response.submittedAt || response.completadaAt || response.submitted_at || response.updatedAt || response.last_save || null,
    resultTimestamp: result.submitted_at || result.timestamp || null,
    substantiveWriting: substantiveWriting(sessionId, response, result),
    duplicateGroups: [],
    penalizedDuplicateGroups: []
  };
}

const LATE_COPY_GAP_MS = 24 * 60 * 60 * 1000;

function submissionTime(row) {
  return Number(row.responseTimestamp || row.resultTimestamp || 0);
}

function findWritingMatches(rows) {
  const matches = [];
  let groupNumber = 0;
  SESSION_IDS.forEach(sessionId => {
    const entries = rows.filter(row => row.sessionId === sessionId).flatMap(row =>
      row.substantiveWriting.map(item => ({ row, field: item.field, text: item.text, normalized: normalizeText(item.text) }))
    );
    for (let leftIndex = 0; leftIndex < entries.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < entries.length; rightIndex += 1) {
        const left = entries[leftIndex];
        const right = entries[rightIndex];
        if (left.field !== right.field || left.row.uid === right.row.uid) continue;
        const lengthRatio = Math.min(left.normalized.length, right.normalized.length) / Math.max(left.normalized.length, right.normalized.length);
        if (lengthRatio < 0.82) continue;
        const exact = left.normalized === right.normalized;
        const similarity = exact ? 1 : tokenSimilarity(left.normalized, right.normalized);
        if (!exact && similarity <= 0.90) continue;
        groupNumber += 1;
        const groupId = `C${String(groupNumber).padStart(3, '0')}`;
        left.row.duplicateGroups.push(groupId);
        right.row.duplicateGroups.push(groupId);
        // Si un texto se entregó 24 h o más antes que el otro, quien entregó primero no
        // pudo copiar el texto posterior: el tope solo alcanza a la entrega tardía.
        const leftAt = submissionTime(left.row);
        const rightAt = submissionTime(right.row);
        const lateCopy = leftAt > 0 && rightAt > 0 && Math.abs(leftAt - rightAt) >= LATE_COPY_GAP_MS;
        if (exact || similarity > 0.90) {
          if (!lateCopy || leftAt > rightAt) left.row.penalizedDuplicateGroups.push(groupId);
          if (!lateCopy || rightAt > leftAt) right.row.penalizedDuplicateGroups.push(groupId);
        }
        matches.push({
          groupId,
          sessionId,
          field: left.field,
          lateCopy,
          exact,
          similarity: Math.round(similarity * 1000) / 1000,
          left: { uid: left.row.uid, name: left.row.name, course: left.row.course, text: left.text },
          right: { uid: right.row.uid, name: right.row.name, course: right.row.course, text: right.text }
        });
      }
    }
  });
  rows.forEach(row => {
    row.duplicateGroups = [...new Set(row.duplicateGroups)];
    row.penalizedDuplicateGroups = [...new Set(row.penalizedDuplicateGroups)];
    if (row.penalizedDuplicateGroups.length) {
      if (row.proposedGrade !== null) row.proposedGrade = Math.min(row.proposedGrade, 5);
      row.flags.push('Ajuste aplicado: coincidencia textual superior al 90 % con otro estudiante; posible uso no autorizado de IA o copia. Nota máxima 5,0');
    }
  });
  return matches;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const output = path.resolve(args.output || path.join(__dirname, '..', 'exports', 'simce-u3-labor-review.json'));
  const platform = await readSource(args.snapshot);
  const students = platform.estudiantes || {};
  const sessions = platform.sesiones || {};
  const responses = platform.respuestas || {};
  const results = platform.resultados || {};
  const rows = [];
  const excluded = [];
  const notEvaluated = [];
  Object.entries(students).forEach(([uid, student]) => {
    const course = String(student.curso || '').toUpperCase();
    if (!COURSES.has(course)) return;
    const reason = exclusionFor(uid, student);
    if (reason) {
      excluded.push({ uid, course, name: student.nombre || '', reason });
      return;
    }
    const personalRoute = personalRouteFor(uid, sessions);
    SESSION_IDS.forEach(sessionId => {
      if ((NOT_EVALUATED[sessionId] || []).includes(course)) {
        notEvaluated.push({ uid, course, sessionId });
        return;
      }
      const personalSessionId = personalRoute[Number(sessionId.split('-').pop())];
      if (personalSessionId) {
        rows.push(personalRouteRow(student, uid, sessionId, sessions[sessionId] || {}, {
          response: (responses[sessionId] || {})[uid] || {},
          result: (results[sessionId] || {})[uid] || {}
        }, personalSessionId, platform));
        return;
      }
      rows.push(rowFor(
        student,
        uid,
        sessionId,
        sessions[sessionId] || {},
        (responses[sessionId] || {})[uid] || {},
        (results[sessionId] || {})[uid] || {}
      ));
    });
  });
  rows.sort((left, right) => left.course.localeCompare(right.course, 'es') || left.name.localeCompare(right.name, 'es') || left.sessionId.localeCompare(right.sessionId));
  const matches = findWritingMatches(rows);
  const sessionState = SESSION_IDS.map(sessionId => ({
    sessionId,
    title: sessions[sessionId]?.titulo || sessionId,
    active: sessions[sessionId]?.activa !== false,
    responsesBlocked: sessions[sessionId]?.respuestas_bloqueadas === true,
    resultsVisible: sessions[sessionId]?.resultados_visibles === true,
    applicationDate: sessions[sessionId]?.fecha_aplicacion || ''
  }));
  const payload = {
    generatedAt: new Date().toISOString(),
    methodology: {
      grades: { none: 1, halfOrLess: 3, moreThanHalf: 5, almostAll: 7, almostAllThreshold: 0.85 },
      writingAdjustment: 'La escritura ausente o incompleta baja una banda cuando corresponde.',
      timing: 'No se aplica rebaja por velocidad: las clases 1 a 6 no guardaron hora inicial confiable y el criterio no se amplió a 7, 8 y 10.',
      matches: 'Toda coincidencia textual superior al 90 % deja la nota de ambos estudiantes con máximo 5,0.',
      scope: 'Clases 1 a 8 y 10; la Clase 9 es informativa y no lleva nota. La Clase 8 no se aplicó en 2A-HC ni en 2B-HC y queda sin evaluar.'
    },
    sessionState,
    rows,
    matches,
    excluded,
    notEvaluated
  };
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(payload, null, 2), 'utf8');
  const excludedByReason = excluded.reduce((counts, item) => ({ ...counts, [item.reason]: (counts[item.reason] || 0) + 1 }), {});
  console.log(JSON.stringify({ output, students: new Set(rows.map(row => row.uid)).size, rows: rows.length, matches: matches.length, excludedByReason }, null, 2));
}

main().catch(error => {
  console.error('[export-simce-labor-review]', error);
  process.exitCode = 1;
});
