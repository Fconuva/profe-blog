/* Diagnóstico de solo lectura de las guías PAES reabiertas.
 * Solo imprime conteos; no muestra RUT, nombres, notas ni respuestas.
 */
'use strict';

const { getAccessToken, requestJson } = require('./firebase-maintenance-db');
const { gradeFromScore } = require('./publish-paes-semester-grades');
const { KEYS: FOUNDATION_KEYS, GUIDED_KEYS: FOUNDATION_GUIDED_KEYS } = require('../api/_paes-foundations');
const { GUIDED_GUIDE_KEYS } = require('../api/_paes-guided-catalog');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const TEST_RUT = '111111111';
const apiSource = fs.readFileSync(path.join(__dirname, '../api/paes.js'), 'utf8');
const experimental = new Set(['q08', 'q17', 'q30', 'q48']);
function literalKey(name) {
  const match = apiSource.match(new RegExp('const ' + name + ' = (\\{[\\s\\S]*?\\n\\});'));
  if (!match) throw new Error('No se encontró la clave local ' + name);
  return vm.runInNewContext('(' + match[1] + ')');
}
const keys = { ...FOUNDATION_KEYS, 10:literalKey('G10_KEY'), 11:literalKey('G11_KEY'),
  12:literalKey('G12_KEY'), 13:literalKey('G13_KEY'), 14:literalKey('G14_KEY'),
  15:literalKey('G15_KEY'), 16:literalKey('G16_KEY'), 17:literalKey('G17_KEY'),
  18:literalKey('G18_KEY'), 19:literalKey('G19_KEY') };
function scoreChecked(id, value) {
  const key = value.variant === 'guided-access-2026'
    ? (FOUNDATION_GUIDED_KEYS[id] || GUIDED_GUIDE_KEYS[id]) : keys[id];
  if (!key) return null;
  let ids = Object.keys(key).filter(question => id !== '14' || !experimental.has(question));
  // G16 tuvo versiones históricas de 15 y 20 ítems; no se corrigen contra los 25 nuevos.
  if (id === '16' && [15, 20].includes(Number(value.total)) &&
    Object.keys(value.answers || {}).every(question => /^\d+$/.test(question) && Number(question) <= Number(value.total))) {
    ids = ids.slice(0, Number(value.total));
  }
  const correct = ids.reduce((total, question) => total + ((value.answers || {})[question] === key[question] ? 1 : 0), 0);
  return { correct, total:ids.length, matches:correct === Number(value.correct) && ids.length === Number(value.total) };
}

async function readState() {
  const token = getAccessToken();
  const [responses, books] = await Promise.all([
    requestJson('GET', 'plataforma_paes/guia_respuestas', token),
    requestJson('GET', 'plataforma_paes/libro_notas', token)
  ]);
  return { responses: responses || {}, books: books || {} };
}

function aggregate({ responses, books }) {
  const guides = {};
  for (const [id, records] of Object.entries(responses)) {
    const entries = Object.entries(records || {}).filter(([rut]) => rut !== TEST_RUT);
    const list = entries.map(([, value]) => value || {});
    const sent = value => value.status === 'sent' || value.submitted === true || value.completada === true;
    const bookNote = rut => books[rut] && books[rut].notas && books[rut].notas[id];
    const omitted = (rut, value) => id === '14' &&
      String((books[rut] && books[rut].curso) || value.curso || '').toUpperCase().replace(/[^A-Z0-9]/g, '') === '4AHC';
    const eligible = entries.filter(([rut, value]) => sent(value || {}) && !omitted(rut, value || {}));
    const expected = value => (value.grade && value.grade.nota) || gradeFromScore(value.correct, value.total);
    guides[id] = {
      records: list.length,
      sent: list.filter(sent).length,
      draft: list.filter(value => value.status === 'draft').length,
      graded: list.filter(value => value.grade && value.grade.nota).length,
      reopened: list.filter(value => value.reenviadoAt).length,
      reopenDraft: list.filter(value => value.reenvioBorrador).length,
      scoreMissing: list.filter(value => sent(value) &&
        (!Number.isFinite(Number(value.correct)) || !Number.isFinite(Number(value.total)) || Number(value.total) <= 0)).length,
      versions: [...new Set(list.map(value => value.contentVersion || value.instrumentVersion || 'legacy'))],
      g14SentWithoutVersionButCurrentShape: id === '14' ? list.filter(value => sent(value) &&
        !value.instrumentVersion && (Object.keys(value.answers || {}).some(question => /^q(?:0[1-9]|[1-4]\d)$/.test(question)) ||
          (Array.isArray(value.form) && value.form.length === 5))).length : 0,
      eligible: eligible.length,
      eligibleWithoutAttemptGrade: eligible.filter(([, value]) => !(value.grade && value.grade.nota)).length,
      eligibleWithoutBook: eligible.filter(([rut]) => bookNote(rut) == null).length,
      eligibleNonNumericBook: eligible.filter(([rut]) => bookNote(rut) != null &&
        !Number.isFinite(Number(String(bookNote(rut)).replace(',', '.')))).length,
      eligibleWithoutBookRecord: eligible.filter(([rut]) => !books[rut]).length,
      eligibleBookMismatch: eligible.filter(([rut, value]) => bookNote(rut) != null &&
        Number(bookNote(rut)) !== Number(expected(value))).length,
      manualBookMismatch: eligible.filter(([rut, value]) => value.grade && value.grade.nota &&
        bookNote(rut) != null && Number(bookNote(rut)) !== Number(value.grade.nota)).length,
      bookWithDraft: entries.filter(([rut, value]) => !sent(value || {}) && bookNote(rut) != null).length,
      guided: eligible.filter(([, value]) => value.variant === 'guided-access-2026').length,
      legacy15: eligible.filter(([, value]) => id === '16' && Number(value.total) === 15).length,
      legacy20: eligible.filter(([, value]) => id === '16' && Number(value.total) === 20).length,
      omittedSent: entries.filter(([rut, value]) => sent(value || {}) && omitted(rut, value || {})).length,
      scoreMismatch: eligible.filter(([, value]) => {
        const score = scoreChecked(id, value);
        return !score || !score.matches;
      }).length,
      mismatchReopened: eligible.filter(([rut, value]) => bookNote(rut) != null &&
        Number(bookNote(rut)) !== Number(expected(value)) && !!value.reenviadoAt).length
    };
  }
  const values = Object.values(books);
  const byGuide = {};
  for (let id = 1; id <= 21; id++) {
    byGuide[id] = values.filter(value => value && value.notas && value.notas[id] != null).length;
  }
  return { guides, books: { records:values.length, byGuide } };
}

if (require.main === module) {
  readState().then(state => console.log(JSON.stringify(aggregate(state), null, 2)))
    .catch(error => { console.error('READ_FAILED: ' + error.message); process.exitCode = 1; });
}

module.exports = { readState, aggregate, scoreChecked, TEST_RUT };
