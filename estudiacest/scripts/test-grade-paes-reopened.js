'use strict';
const assert = require('node:assert/strict');
const { buildPlan } = require('./grade-paes-reopened');

const sent = (id, total, extra = {}) => ({ guiaId:id, status:'sent', correct:0, total, answers:{}, ...extra });
const state = {
  responses: {
    11: { a:sent('11',18,{ grade:{ nota:'5.0' } }) },
    12: { b:sent('12',15,{ reenviadoAt:2 }) },
    14: { c:sent('14',45,{ instrumentVersion:'g14-2026-1', curso:'4°A HC' }),
      h:sent('14',45,{ answers:{ q01:'B' }, curso:'3°A HC' }) },
    16: { d:sent('16',15) },
    18: { e:sent('18',18), f:{ status:'draft', correct:0, total:18 } },
    20: { g:sent('20',18) }
  },
  books: {
    a:{ curso:'3°A HC', notas:{ 11:'6.0' } },
    b:{ curso:'3°A HC', notas:{ 12:'5.0' } },
    c:{ curso:'4°A HC', notas:{} },
    d:{ curso:'3°A HC', notas:{ 16:'3.0' } },
    e:{ curso:'3°A HC', notas:{} },
    f:{ curso:'3°A HC', notas:{} },
    g:{ curso:'3°A HC', notas:{} },
    h:{ curso:'3°A HC', notas:{} }
  }
};
const plan = buildPlan(state);
assert.equal(plan.skipped.existingManualConflict, 1);
assert.equal(plan.skipped.omitted14, 1);
assert.equal(plan.skipped.draft, 1);
assert.equal(plan.attempts.length, 4);
assert.equal(plan.notes.length, 3);
assert.equal(plan.notes.find(note => note.id === '12').after, '1.0');
assert.equal(plan.notes.find(note => note.id === '18').after, '1.0');
assert.ok(!plan.attempts.some(op => op.id === '20'));
assert.ok(!plan.notes.some(op => op.id === '20'));
assert.equal(plan.attempts.find(op => op.id === '16').grade, '3.0', 'La nota histórica tiene prioridad si no hubo reenvío.');
console.log('Plan PAES probado: borradores, G14 4A, G20/G21 y notas manuales protegidos.');
