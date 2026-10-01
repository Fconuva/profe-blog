/* Auditoría agregada: notas 1,0 frente a entregas PAES vigentes. Sin datos personales. */
'use strict';

const { readState, scoreChecked, TEST_RUT } = require('./audit-paes-reopened-grades');
const { gradeFromScore } = require('./publish-paes-semester-grades');
const { getAccessToken, requestJson } = require('./firebase-maintenance-db');

const grade = value => {
  const n = Number(String(value ?? '').replace(',', '.'));
  return Number.isFinite(n) && n >= 1 && n <= 7 ? n.toFixed(1) : null;
};
const submitted = (id, record) => record.status === 'sent' || record.submitted === true ||
  record.completada === true ||
  (['10','11','12','13'].includes(id) && Number(record.submittedAt) > 0 &&
    Object.keys(record.answers || {}).length > 0);

async function main() {
  const [{ responses, books }, config] = await Promise.all([
    readState(), requestJson('GET', 'plataforma_paes/guias_config', getAccessToken())
  ]);
  const results = {};
  const legacy = {};
  const confirmed = {};
  for (let number = 1; number <= 19; number++) {
    const id = String(number);
    const row = { bookOne:0, confirmedOne:0, scoreAboveOne:0, resentAboveOne:0,
      legacyConfirmedAboveOne:0, attemptManualOne:0, draftWithOne:0,
      reenvioDraftWithOne:0, invalidScore:0 };
    const old = { confirmed:0, statusDraft:0, bookMissing:0, noBookRecord:0,
      missingByCourse:{}, scoreAboveBook:0, scoreBelowBook:0,
      bookEqualsScore:0, manualGrade:0, manualDiffersScore:0, scoreInvalid:0,
      resent:0, afterBookUpdate:0, manualOlderThanSubmission:0,
      changedAfterManual:0, savedAfterSubmit:0, aboveBookSavedAfterSubmit:0,
      aboveBookWithManual:0, aboveBookWithoutManual:0 };
    const done = { submitted:0, invalidScore:0, bookMissing:0,
      missingCurrentSent:0, missingLegacyDraft:0,
      scoreAboveBook:0, scoreBelowBook:0, scoreMatchesBook:0,
      attemptGradeDiffersScore:0, submittedAfterGrade:0,
      submittedAfterGradeScoreAboveBook:0, resentScoreAboveBook:0,
      resentGradeOlderThanSubmit:0 };
    for (const [rut, record] of Object.entries(responses[id] || {})) {
      if (rut === TEST_RUT || !record || typeof record !== 'object') continue;
      const book = books[rut] || {};
      if (id === '14' && String(book.curso || record.curso || '').toUpperCase().replace(/[^A-Z0-9]/g,'') === '4AHC') continue;
      if (submitted(id, record)) {
        done.submitted++;
        const checkedDone = scoreChecked(id, record);
        if (!checkedDone || !checkedDone.matches) done.invalidScore++;
        else {
          const calc = gradeFromScore(checkedDone.correct, checkedDone.total);
          const bookGrade = grade(book.notas && book.notas[id]);
          const attemptGrade = grade(record.grade && record.grade.nota);
          const lastSubmit = Math.max(Number(record.submittedAt) || 0, Number(record.reenviadoAt) || 0);
          const staleManual = attemptGrade && Number(record.grade.gradedAt) > 0 &&
            lastSubmit > Number(record.grade.gradedAt);
          if (staleManual) done.submittedAfterGrade++;
          if (!bookGrade) {
            done.bookMissing++;
            if (record.status === 'sent' || record.submitted === true || record.completada === true) done.missingCurrentSent++;
            else done.missingLegacyDraft++;
          }
          else if (Number(calc) > Number(bookGrade)) {
            done.scoreAboveBook++;
            if (staleManual) done.submittedAfterGradeScoreAboveBook++;
            if (Number(record.reenviadoAt) > 0) done.resentScoreAboveBook++;
          } else if (Number(calc) < Number(bookGrade)) done.scoreBelowBook++;
          else done.scoreMatchesBook++;
          if (attemptGrade && attemptGrade !== calc) done.attemptGradeDiffersScore++;
          if (Number(record.reenviadoAt) > Number(record.grade && record.grade.gradedAt)) done.resentGradeOlderThanSubmit++;
        }
      }
      const legacyConfirmed = ['10','11','12','13'].includes(id) &&
        record.status !== 'sent' && record.submitted !== true && record.completada !== true &&
        submitted(id, record);
      if (legacyConfirmed) {
        old.confirmed++;
        if (!books[rut]) old.noBookRecord++;
        if (record.status === 'draft') old.statusDraft++;
        if (Number(record.reenviadoAt) > 0) old.resent++;
        if (Number(record.submittedAt) > Number(book.updatedAt)) old.afterBookUpdate++;
        const savedAfterSubmit = Number(record.lastSavedAt) > Number(record.submittedAt);
        if (savedAfterSubmit) old.savedAfterSubmit++;
        const oldBook = grade(book.notas && book.notas[id]);
        const checkedOld = scoreChecked(id, record);
        if (!checkedOld || !checkedOld.matches) old.scoreInvalid++;
        else {
          const calc = gradeFromScore(checkedOld.correct, checkedOld.total);
          if (!oldBook) {
            old.bookMissing++;
            const course = String(book.curso || record.curso || '(sin curso)');
            old.missingByCourse[course] = (old.missingByCourse[course] || 0) + 1;
          }
          else if (Number(calc) > Number(oldBook)) old.scoreAboveBook++;
          else if (Number(calc) < Number(oldBook)) old.scoreBelowBook++;
          else old.bookEqualsScore++;
          const manual = grade(record.grade && record.grade.nota);
          if (manual) {
            old.manualGrade++;
            if (manual !== calc) old.manualDiffersScore++;
            if (Number(record.submittedAt) > Number(record.grade.gradedAt)) old.manualOlderThanSubmission++;
            if (Number(record.lastSavedAt) > Number(record.grade.gradedAt)) old.changedAfterManual++;
          }
          if (oldBook && Number(calc) > Number(oldBook)) {
            old[manual ? 'aboveBookWithManual' : 'aboveBookWithoutManual']++;
            if (savedAfterSubmit) old.aboveBookSavedAfterSubmit++;
          }
        }
      }
      if (grade(book.notas && book.notas[id]) !== '1.0') continue;
      row.bookOne++;
      if (!submitted(id, record)) {
        row.draftWithOne++;
        if (record.reenvioBorrador) row.reenvioDraftWithOne++;
        continue;
      }
      row.confirmedOne++;
      const checked = scoreChecked(id, record);
      if (!checked || !checked.matches) { row.invalidScore++; continue; }
      const calculated = gradeFromScore(checked.correct, checked.total);
      if (Number(calculated) > 1) {
        row.scoreAboveOne++;
        if (Number(record.reenviadoAt) > 0) row.resentAboveOne++;
        if (record.status !== 'sent' && record.submitted !== true && record.completada !== true) row.legacyConfirmedAboveOne++;
      }
      if (grade(record.grade && record.grade.nota) === '1.0') row.attemptManualOne++;
    }
    if (row.bookOne) results[id] = row;
    if (old.confirmed) legacy[id] = old;
    if (done.submitted) confirmed[id] = done;
  }
  console.log(JSON.stringify({
    reenvio:{ cierre:config?.reenvio_cierra || null,
      habilitadas:Object.entries(config?.reenvio || {}).filter(([,on]) => on === true).map(([id])=>id) },
    bookOnes:results, legacy, confirmed
  }, null, 2));
}

if (require.main === module) main().catch(error => {
  console.error('AUDIT_FAILED: ' + error.message); process.exitCode = 1;
});

module.exports = { submitted };
