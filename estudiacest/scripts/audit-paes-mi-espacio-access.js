/* Auditoría agregada de acceso a Mi espacio para la nómina PAES.
 * No imprime identificadores ni datos de estudiantes.
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { getAccessToken, requestJson } = require('./firebase-maintenance-db');

const rosterSource = fs.readFileSync(path.join(__dirname, '../paes/js/nominas.js'), 'utf8');
const roster = vm.runInNewContext(rosterSource + '\nNOMINAS_PAES', {}).filter(student => !student.es_prueba);
const cleanRut = value => String(value || '').replace(/[^0-9kK]/g, '').toUpperCase();
const cleanCourse = value => String(value || '').replace(/[^0-9A-Z]/gi, '').toUpperCase();

async function main() {
  const token = getAccessToken();
  const [students, books] = await Promise.all([
    requestJson('GET', 'plataforma_estudiantes/estudiantes', token),
    requestJson('GET', 'plataforma_paes/libro_notas', token)
  ]);
  const studentRecords = students || {};
  const paesBooks = books || {};
  const byRut = new Map();
  for (const student of Object.values(studentRecords)) {
    const rut = cleanRut(student && student.rut);
    if (!rut) continue;
    if (!byRut.has(rut)) byRut.set(rut, []);
    byRut.get(rut).push(student);
  }
  const byCourse = {};
  for (const student of roster) {
    const group = byCourse[student.curso] ||= {
      roster:0, account:0, profileComplete:0, duplicate:0, accessOnly:0, courseMismatch:0,
      matchedCourses:{}, matchedPrograms:{}, bookCourses:{}, personalRoutes:0
    };
    group.roster++;
    const matches = byRut.get(cleanRut(student.rut)) || [];
    const bookCourse = String((paesBooks[cleanRut(student.rut)] || {}).curso || '(sin libro)');
    group.bookCourses[bookCourse] = (group.bookCourses[bookCourse] || 0) + 1;
    if (matches.length) group.account++;
    if (matches.some(match => match.perfil_completo === true)) group.profileComplete++;
    if (matches.length > 1) group.duplicate++;
    if (matches.some(match => match.access_only === true)) group.accessOnly++;
    if (matches.some(match => !!match.ruta_personal)) group.personalRoutes++;
    for (const match of matches) {
      const course = String(match.curso || '(sin curso)');
      const program = String(match.programa || '(sin programa)');
      group.matchedCourses[course] = (group.matchedCourses[course] || 0) + 1;
      group.matchedPrograms[program] = (group.matchedPrograms[program] || 0) + 1;
    }
    if (matches.length && !matches.some(match => cleanCourse(match.curso) === cleanCourse(student.curso))) {
      group.courseMismatch++;
    }
  }
  console.log(JSON.stringify({ byCourse, platformAccounts:Object.keys(studentRecords).length }, null, 2));
}

if (require.main === module) main().catch(error => {
  console.error('No fue posible auditar el acceso PAES: ' + error.message);
  process.exitCode = 1;
});
