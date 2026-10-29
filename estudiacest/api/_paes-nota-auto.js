'use strict';
// Nota automática PAES HC al entregar una guía (29-oct-2026, pedido de Francisco:
// «al completar se actualice a ellos y en mi libro»). Usa el modelo de laboriosidad
// del 15-oct: cuenta alternativas A–D contestadas, no correctas.
//   menos de 25 % → 1,0 · 25 % a <50 % → 3,0 · 50 % a <75 % → 5,0 · 75 % o más → 7,0
// Las mismas guardas del traspaso manual: nunca baja una nota, nunca pisa una «A»,
// no escribe un 1,0 nuevo, no toca la G14 de 4.º A HC y solo escribe en libros que ya
// existen para un curso HC (el libro lo abre la nómina, no el envío).
const BASE = 'plataforma_paes/libro_notas';
const CURSOS_HC = new Set(['3AHC', '3BHC', '4AHC', '4BHC']);
const curso = value => String(value || '').replace(/[^0-9A-Z]/gi, '').toUpperCase();
const rutLimpio = value => String(value || '').replace(/[^0-9kK]/g, '').toUpperCase();

function notaLaboriosidad(contestadas, total) {
  const c = Number(contestadas) || 0, t = Number(total) || 0;
  if (t <= 0) return null;
  return c * 4 < t ? '1.0' : c * 2 < t ? '3.0' : c * 4 < t * 3 ? '5.0' : '7.0';
}

function decidir(actual, nueva) {
  if (!nueva) return null;
  const previa = actual === undefined || actual === null ? '' : String(actual).trim();
  if (previa.toUpperCase() === 'A') return null;
  if (previa === '') return nueva === '1.0' ? null : nueva;
  const numero = Number(previa.replace(',', '.'));
  if (Number.isFinite(numero) && numero >= Number(nueva)) return null;
  return nueva;
}

async function registrar(db, { rut, guia, contestadas, total }) {
  const r = rutLimpio(rut), g = String(guia || '');
  const nueva = notaLaboriosidad(contestadas, total);
  if (!r || !/^\d+$/.test(g) || !nueva) return { escrita: false, motivo: 'sin-datos' };
  const libro = (await db.ref(BASE + '/' + r + '/curso').once('value')).val();
  const c = curso(libro);
  if (!CURSOS_HC.has(c)) return { escrita: false, motivo: 'sin-libro-hc' };
  if (g === '14' && c === '4AHC') return { escrita: false, motivo: 'g14-4ahc' };
  let escrita = null;
  const tx = await db.ref(BASE + '/' + r + '/notas/' + g).transaction(actual => {
    escrita = decidir(actual, nueva);
    return escrita === null ? undefined : escrita;
  }, undefined, false);
  if (!tx.committed || escrita === null) return { escrita: false, motivo: 'sin-cambio', nota: nueva };
  await db.ref(BASE + '/' + r).update({ updatedAt: Date.now() });
  return { escrita: true, nota: escrita };
}

module.exports = { notaLaboriosidad, decidir, registrar };
