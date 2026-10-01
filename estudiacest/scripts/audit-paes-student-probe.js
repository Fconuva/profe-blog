/* Compara un apellido y curso PAES con libro e intentos, sin imprimir identidad ni notas. */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { readState, scoreChecked } = require('./audit-paes-reopened-grades');
const { gradeFromScore } = require('./publish-paes-semester-grades');

const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .toUpperCase().replace(/[^A-Z0-9]/g,'');
const grade = value => {
  const n = Number(String(value ?? '').replace(',', '.'));
  return Number.isFinite(n) && n >= 1 && n <= 7 ? n.toFixed(1) : null;
};

async function main() {
  const surname = normalize(process.argv.find(arg => arg.startsWith('--surname='))?.slice(10));
  const course = normalize(process.argv.find(arg => arg.startsWith('--course='))?.slice(9));
  if (!surname || !course) throw new Error('Indica --surname y --course.');
  const source = fs.readFileSync(path.join(__dirname, '../paes/js/nominas.js'), 'utf8');
  const roster = vm.runInNewContext(source + '\nNOMINAS_PAES', {});
  const matches = roster.filter(item => !item.es_prueba && normalize(item.curso) === course &&
    normalize(item.nombre).includes(surname));
  if (matches.length !== 1) {
    const { books, responses } = await readState();
    const withOne = matches.filter(item => Object.values(books[item.rut]?.notas || {})
      .some(note => grade(note) === '1.0')).length;
    const withAttemptOne = matches.filter(item => Object.values(responses)
      .some(records => grade(records?.[item.rut]?.grade?.nota) === '1.0')).length;
    const guide17 = matches.map((item, index) => {
      const record = responses['17']?.[item.rut] || {};
      const book = books[item.rut] || {};
      const attempt = grade(record.grade?.nota);
      const note = grade(book.notas?.['17']);
      const checked = scoreChecked('17', record);
      const calculated = checked?.matches ? gradeFromScore(checked.correct, checked.total) : null;
      return { candidate:index + 1, attemptPresent:!!responses['17']?.[item.rut],
        bookIsOne:note === '1.0', attemptIsOne:attempt === '1.0',
        attemptDiffersBook:!!attempt && !!note && attempt !== note,
        calculatedAboveBook:!!calculated && !!note && Number(calculated) > Number(note),
        manualAfterSubmit:Number(record.grade?.gradedAt) > Number(record.submittedAt),
        status:record.status || null, resent:Number(record.reenviadoAt) > 0,
        reenvioDraft:!!record.reenvioBorrador };
    });
    console.log(JSON.stringify({ matchingStudents:matches.length, matchingWithAnyOne:withOne,
      matchingWithAttemptOne:withAttemptOne, guide17,
      otherSignals:matches.map((item, index) => ({
        candidate:index + 1,
        guides:Array.from({ length:21 }, (_, guide) => String(guide + 1)).flatMap(id => {
          const record = responses[id]?.[item.rut] || {};
          const note = grade(books[item.rut]?.notas?.[id]);
          const attempt = grade(record.grade?.nota);
          const checked = scoreChecked(id, record);
          const calculated = checked?.matches ? gradeFromScore(checked.correct, checked.total) : null;
          const signal = {
            id, bookIsOne:note === '1.0', attemptIsOne:attempt === '1.0',
            attemptDiffersBook:!!attempt && !!note && attempt !== note,
            calculatedAboveBook:!!calculated && !!note && Number(calculated) > Number(note),
            newWorkAfterSubmit:Number(record.lastSavedAt) > Math.max(Number(record.submittedAt) || 0,
              Number(record.reenviadoAt) || 0), reenvioDraft:!!record.reenvioBorrador
          };
          return Object.values(signal).some(value => value === true) ? [signal] : [];
        })
      })),
      message:'Se requiere nombre completo para identificar de forma única.' }));
    return;
  }
  const student = matches[0];
  const { responses, books } = await readState();
  const book = books[student.rut] || {};
  const guides = {};
  for (let id = 1; id <= 21; id++) {
    const key = String(id);
    const response = responses[key]?.[student.rut];
    const note = grade(book.notas?.[key]);
    if (!response && !note) continue;
    const checked = response && scoreChecked(key, response);
    const calc = checked?.matches ? gradeFromScore(checked.correct, checked.total) : null;
    const latestSubmit = Math.max(Number(response?.submittedAt) || 0, Number(response?.reenviadoAt) || 0);
    guides[key] = {
      noteIsOne:note === '1.0', noteMissing:!note,
      recordPresent:!!response, status:response?.status || null,
      submitted:response?.submitted === true || response?.completada === true || response?.status === 'sent',
      legacySubmitted:Number(response?.submittedAt) > 0 && Object.keys(response?.answers || {}).length > 0,
      reenvioDraft:!!response?.reenvioBorrador,
      resent:Number(response?.reenviadoAt) > 0,
      newWorkAfterSubmit:Number(response?.lastSavedAt) > latestSubmit,
      scoreValid:checked?.matches === true,
      calculatedAboveNote:!!calc && !!note && Number(calc) > Number(note),
      gradeOlderThanSubmit:!!response?.grade && latestSubmit > Number(response.grade.gradedAt)
    };
  }
  console.log(JSON.stringify({ matchingStudents:1, hasBook:!!books[student.rut], guides }, null, 2));
}

if (require.main === module) main().catch(error => {
  console.error('PROBE_FAILED: ' + error.message); process.exitCode = 1;
});
