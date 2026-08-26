const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dashboard = fs.readFileSync(path.join(root, 'estudiantes', 'dashboard.html'), 'utf8');
const rules = JSON.parse(fs.readFileSync(path.join(root, 'firebase-rules.json'), 'utf8')).rules;
const publisherPath = path.join(root, 'scripts', 'publish-simce-labor-grades.js');
const publisher = fs.existsSync(publisherPath) ? fs.readFileSync(publisherPath, 'utf8') : null;
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
    "rows.length !== 498",
    "students.size !== 83",
    "firstChecksum !== secondChecksum",
    "appliedChecksum !== firstChecksum"
  ].forEach(fragment => {
    if (!publisher.includes(fragment)) failures.push(`Publicador: falta la guarda ${fragment}.`);
  });
}

if (failures.length) {
  console.error(`Auditoría de notas SIMCE fallida:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('Notas SIMCE auditadas: panel privado, simbología, correo, reglas y publicación determinista presentes.');
