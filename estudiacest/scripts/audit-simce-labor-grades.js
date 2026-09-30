const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dashboard = fs.readFileSync(path.join(root, 'estudiantes', 'dashboard.html'), 'utf8');
const rules = JSON.parse(fs.readFileSync(path.join(root, 'firebase-rules.json'), 'utf8')).rules;
const publisherPath = path.join(root, 'scripts', 'publish-simce-labor-grades.js');
const publisher = fs.existsSync(publisherPath) ? fs.readFileSync(publisherPath, 'utf8') : null;
const exporter = fs.readFileSync(path.join(root, 'scripts', 'export-simce-labor-review.js'), 'utf8');
const failures = [];

[
  'id="laborGradesPanel"',
  'id="laborAverage"',
  'id="laborGradesBody"',
  'calificaciones_clase/',
  'frnunez@salesianostalca.cl',
  'Sin entrega',
  'Ajuste por coincidencia textual'
].forEach(fragment => {
  if (!dashboard.includes(fragment)) failures.push(`Dashboard: falta ${fragment}.`);
});

const gradeRules = rules.plataforma_estudiantes && rules.plataforma_estudiantes.calificaciones_clase;
if (!gradeRules) failures.push('Reglas: falta calificaciones_clase.');
else {
  const studentRead = gradeRules.$uid && gradeRules.$uid['.read'];
  if (!String(studentRead || '').includes('auth.uid === $uid')) failures.push('Reglas: el estudiante no puede leer sus propias notas.');
  if (!String(gradeRules['.write'] || '').includes("admins').child(auth.uid).val() === true")) failures.push('Reglas: la escritura no está limitada al admin.');
  if (gradeRules.$uid && gradeRules.$uid['.write']) failures.push('Reglas: un estudiante no debe poder escribir calificaciones.');
}

if (publisher) {
  [
    "row.proposedGrade",
    "similarity_adjusted",
    "source.rows.length !== expectedRows",
    "students.size !== expectedStudents",
    "args['expected-students']",
    "firstChecksum !== secondChecksum",
    "args['published-at']",
    "args['verify-snapshot']",
    "appliedChecksum !== firstChecksum"
  ].forEach(fragment => {
    if (!publisher.includes(fragment)) failures.push(`Publicador: falta la guarda ${fragment}.`);
  });
}

[
  "require('./class-submission-status')",
  'classifySubmissionStatus(response, { result })',
  "submission.status === 'inconsistent'",
  "status: !hasActivityEvidence ? 'Sin iniciar'"
].forEach(fragment => {
  if (!exporter.includes(fragment)) failures.push(`Exportador: falta el lector canónico ${fragment}.`);
});
const numberedScope = /\[1, 2, 3, 4, 5, 6, 7, 8, 10\]\.map\(number => `sesion-u3-\$\{number\}`\)/;
if (!numberedScope.test(exporter)) failures.push('Exportador: el alcance debe ser las clases 1 a 8 y 10.');
if (publisher && !numberedScope.test(publisher)) failures.push('Publicador: el alcance debe ser las clases 1 a 8 y 10.');
if (/sesion-u3-9['"]\s*:/.test(exporter)) failures.push('Exportador: la Clase 9 es informativa y no lleva nota.');
['function exclusionFor(uid, student)', 'UNIT_ENROLLMENT_CUTOFF', "sessionId.startsWith('personal-u3-')", 'function personalRouteRow(', 'LATE_COPY_GAP_MS'].forEach(fragment => {
  if (!exporter.includes(fragment)) failures.push(`Exportador: falta la regla ${fragment}.`);
});
const notEvaluatedRule = "const NOT_EVALUATED = { 'sesion-u3-8': ['2A-HC'] };";
if (!exporter.includes(notEvaluatedRule)) failures.push('Exportador: falta la Clase 8 sin evaluar en 2A-HC.');
if (publisher && !publisher.includes(notEvaluatedRule)) failures.push('Publicador: falta la Clase 8 sin evaluar en 2A-HC.');
if (publisher && !publisher.includes("row.personalRoute === true && row.status === 'Pendiente ruta personal'")) {
  failures.push('Publicador: una nota vacía solo se admite en la ruta personal pendiente.');
}
if (exporter.includes("Object.keys(result || {}).length > 0;\n  const submitted")) {
  failures.push('Exportador: un resultado aún confirma una entrega por sí solo.');
}
if (publisher && !publisher.includes("row.status === 'Inconsistente'")) {
  failures.push('Publicador: no conserva el estado de entrega inconsistente.');
}

if (failures.length) {
  console.error(`Auditoría de notas SIMCE fallida:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('Notas SIMCE auditadas: panel privado, simbología, correo, reglas y publicación determinista presentes.');
