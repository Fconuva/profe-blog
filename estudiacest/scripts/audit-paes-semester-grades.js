const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {
  buildPublication,
  gradeFromScore
} = require('./publish-paes-semester-grades');

const root = path.join(__dirname, '..');
const portal = fs.readFileSync(path.join(root, 'paes', 'index.html'), 'utf8');
const api = fs.readFileSync(path.join(root, 'api', 'paes.js'), 'utf8');
const roster = fs.readFileSync(path.join(root, 'paes', 'js', 'nominas.js'), 'utf8');
const admin = fs.readFileSync(path.join(root, 'paes', 'admin', 'index.html'), 'utf8');
const publisher = fs.readFileSync(path.join(root, 'scripts', 'publish-paes-semester-grades.js'), 'utf8');

assert.strictEqual(gradeFromScore(18, 18), '7.0', 'La escala debe dar 7,0 con 100 %.');
assert.strictEqual(gradeFromScore(12, 18), '4.5', 'La escala debe usar 60 % de exigencia.');
assert.strictEqual(gradeFromScore(3, 18), '1.8', 'La escala inferior debe conservar la fórmula histórica.');

const books = {
  A: { curso: '4°A HC', nombre: 'Estudiante A', notas: { 11: '6.6', 12: '2.0' } },
  B: { curso: '3°A HC', nombre: 'Estudiante B', notas: { 12: '2.0' } },
  C: { curso: '3°B HC', nombre: 'Estudiante C', notas: { 12: '7.0' } }
};
const responses = {
  11: {
    A: { status: 'sent', correct: 18, total: 18 },
    B: { status: 'sent', correct: 15, total: 18, grade: { nota: '7.0' } }
  },
  12: { B: { status: 'sent', correct: 12, total: 15 } },
  14: {
    A: { status: 'sent', instrumentVersion: 'g14-2026-1', correct: 40, total: 45 },
    B: { status: 'sent', instrumentVersion: 'g14-2026-1', correct: 27, total: 45 }
  }
};
const publication = buildPublication(books, responses, 1);

assert.strictEqual(publication.target.A.notas['11'], '6.6', 'Debe conservar la corrección vigente de G11.');
assert.strictEqual(publication.target.B.notas['11'], '7.0', 'La calificación manual debe prevalecer.');
assert.strictEqual(publication.target.B.notas['12'], '5.5', 'G12 debe recalcularse desde su propio intento.');
assert.ok(!Object.prototype.hasOwnProperty.call(publication.target.C.notas, '12'), 'Una columna antigua no puede quedar como nota nueva.');
assert.ok(!Object.prototype.hasOwnProperty.call(publication.target.A.notas, '14'), 'G14 debe omitirse para 4°A HC.');
assert.strictEqual(publication.target.B.notas['14'], '4.0', 'G14 sí debe calificarse en los demás cursos.');

const testPublication = buildPublication(
  { 111111111: { curso: 'PRUEBA PAES', nombre: 'Cuenta de prueba PAES', notas: {} } },
  { 17: { 111111111: { status: 'sent', correct: 24, total: 24 } } },
  1
);
assert.strictEqual(testPublication.students, 0, 'La cuenta de prueba no debe entrar al libro de notas.');

[
  'id="misNotasPanel"',
  'Mis notas del segundo semestre',
  'Promedio parcial',
  'const GUIAS_NOTAS = [11, 12, 13, 14, 15, 16, 17]',
  'renderMisNotas(student.rut)',
  'No aplica',
  'Sin nota',
  'frnunez@salesianostalca.cl'
].forEach(marker => assert.ok(portal.includes(marker), `Falta en el portal: ${marker}`));

assert.ok(api.includes("const SECOND_SEMESTER_GUIDES = ['11', '12', '13', '14', '15', '16', '17']"), 'La API debe limitar el período.');
assert.ok(api.includes("omitidos: isFourthA ? ['14'] : []"), 'La API debe excluir G14 para 4°A HC.');
assert.ok(!/handleGetMisNotas[\s\S]{0,800}nombre\s*:/.test(api), 'La consulta pública no debe devolver el nombre.');

[
  '"rut": "111111111"',
  '"rut_formato": "11.111.111-1"',
  '"curso": "PRUEBA PAES"',
  '"es_prueba": true'
].forEach(marker => assert.ok(roster.includes(marker), `Falta la cuenta de prueba: ${marker}`));
assert.ok(api.includes("const PAES_TEST_RUT = '111111111'"), 'La API debe reconocer la cuenta de prueba.');
assert.ok(api.includes('if (isPaesTestRut(rut))'), 'La cuenta de prueba debe omitir los bloqueos de guías.');
assert.ok(api.includes('!isPaesTestRut(rutLimpio) && current'), 'La cuenta de prueba debe poder reutilizar las guías genéricas.');
assert.ok(api.includes('!isPaesTestRut(rutLimpio) && previous.exists()'), 'La cuenta de prueba debe poder reutilizar el miniensayo.');
assert.ok(admin.includes("const PAES_TEST_RUT = '111111111'"), 'El admin debe identificar la cuenta de prueba.');
assert.ok(admin.includes('filter(([rut]) => rut !== PAES_TEST_RUT)'), 'La cuenta de prueba no debe alterar métricas.');
assert.ok(publisher.includes('allRuts.delete(TEST_RUT)'), 'La cuenta de prueba no debe publicarse en el libro de notas.');

console.log('AUDITORÍA PAES NOTAS SEMESTRE: OK');
