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
const numberedScope = /\[1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12\]\.map\(number => `sesion-u3-\$\{number\}`\)/;
if (!numberedScope.test(exporter)) failures.push('Exportador: falta cobertura hasta la Clase 12.');
if (publisher && !numberedScope.test(publisher)) failures.push('Publicador: falta cobertura hasta la Clase 12.');
if (/sesion-u3-9['"]\s*:/.test(exporter)) failures.push('Exportador: la Clase 9 es informativa y no lleva nota.');
['function exclusionFor(uid, student)', 'UNIT_ENROLLMENT_CUTOFF', "sessionId.startsWith('personal-u3-')", 'function personalRouteRow(', 'LATE_COPY_GAP_MS'].forEach(fragment => {
  if (!exporter.includes(fragment)) failures.push(`Exportador: falta la regla ${fragment}.`);
});
const notEvaluatedRule = "const NOT_EVALUATED = { 'sesion-u3-8': ['2A-HC', '2B-HC'] };";
if (!exporter.includes(notEvaluatedRule)) failures.push('Exportador: falta la Clase 8 sin evaluar en 2A-HC y 2B-HC.');
if (publisher && !publisher.includes(notEvaluatedRule)) failures.push('Publicador: falta la Clase 8 sin evaluar en 2A-HC y 2B-HC.');
if (publisher && !publisher.includes("row.personalRoute === true && row.status === 'Pendiente ruta personal'")) {
  failures.push('Publicador: una nota vacía solo se admite en la ruta personal pendiente.');
}
if (exporter.includes("Object.keys(result || {}).length > 0;\n  const submitted")) {
  failures.push('Exportador: un resultado aún confirma una entrega por sí solo.');
}
if (publisher && !publisher.includes("row.status === 'Inconsistente'")) {
  failures.push('Publicador: no conserva el estado de entrega inconsistente.');
}

// Productos escritos y cierre vigentes: no confundirlos con alternativas ni
// exigir el taller retirado de la Clase 12.
const assert = require('assert');
const { CONFIG, rowFor } = require('./export-simce-labor-review');
const { buildPublication } = require('./publish-simce-labor-grades');
const student = { curso: '2A-HC' };
const full11 = { submitted:true, completada:true, answers:{} };
CONFIG['sesion-u3-11'].writing.forEach(([field, minimum]) => {
  full11.answers[field.split('.')[1]] = Array(minimum).fill('palabra').join(' ');
});
assert.strictEqual(rowFor(student, 'fixture', 'sesion-u3-11', {}, full11, {}).proposedGrade, 7);
const incomplete11 = JSON.parse(JSON.stringify(full11));
incomplete11.answers['news-body'] = 'Una noticia demasiado breve.';
assert.strictEqual(rowFor(student, 'fixture', 'sesion-u3-11', {}, incomplete11, {}).proposedGrade, 5);
const full12 = { submitted:true, completada:true, answers:Object.fromEntries(Array.from({length:24}, (_, i) => [`q${i+1}`, 'A'])), metaResponses:{m1:'Una reflexión con más de veinticinco caracteres.'} };
assert.strictEqual(rowFor(student, 'fixture', 'sesion-u3-12', {}, full12, {}).proposedGrade, 7);
const fixtureRows = [1,2,3,4,5,6,7,10,11,12].map(n => ({uid:'fixture',course:'2A-HC',sessionId:`sesion-u3-${n}`,status:'Entregada',proposedGrade:3,completion:0.5,flags:[]}));
const publication = buildPublication({rows:fixtureRows,notEvaluated:[{uid:'fixture',course:'2A-HC',sessionId:'sesion-u3-8'}]}, 'fixture-date', 1, {fixture:{'sesion-u3-7':{grade:7}}});
assert.strictEqual(publication.records['fixture/sesion-u3-7'].grade, 7);
assert.strictEqual(publication.records['fixture/sesion-u3-12'].grade, 3);
assert.strictEqual(publication.records['fixture/sesion-u3-9'], undefined);

if (failures.length) {
  console.error(`Auditoría de notas SIMCE fallida:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('Notas SIMCE auditadas: panel privado, simbología, correo, reglas y publicación determinista presentes.');

async function verifyDeliveryStore() {
  const vm = require('vm');
  const source = fs.readFileSync(path.join(root,'estudiantes/js/simce-session-gate.js'),'utf8');
  const elements = new Map();
  const document = {
    getElementById:id => elements.get(id),
    createElement:() => ({style:{},setAttribute(){},remove(){elements.delete(this.id);},focus(){}}),
    body:{appendChild(el){elements.set(el.id,el);}},documentElement:{style:{}}
  };
  const window = {location:{reload(){}}};
  vm.runInNewContext(source,{window,document,Map,Promise,JSON,Date,Error});
  const gate = window.SimceSessionGate;
  let attempt = {answers:{q1:'A'}}, result = null, failWrite = false, failRead = false, atomicWrites = 0;
  const snapshot = value => ({val:()=>value});
  const db = {ref(location){return {
    once:async()=>{if(failRead)throw Error('Sin red');return snapshot(location.includes('/sesiones/') ? {activa:true} : JSON.parse(JSON.stringify(attempt)));},
    child:key=>({once:async()=>snapshot(attempt[key])}),
    transaction:async fn=>{const value=fn(attempt);if(value!==undefined)attempt=value;return {committed:value!==undefined};},
    update:async updates=>{if(failWrite)throw Error('Sin red');atomicWrites++;const responsePath=Object.keys(updates).find(k=>k.startsWith('respuestas/'));const resultPath=Object.keys(updates).find(k=>k.startsWith('resultados/'));assert(responsePath&&resultPath);attempt=updates[responsePath];result=updates[resultPath];}
  };}};
  assert.strictEqual(await gate.check(db,'fixture','sesion-u3-1','fixture',true),false);
  await assert.rejects(gate.saveDraft(db,'fixture','sesion-u3-1','fixture',{answers:{q1:'B'}}));
  assert.strictEqual(attempt.answers.q1,'A');
  gate.markLoaded('sesion-u3-1','fixture');
  const draft = {answers:{q1:'B'},submitted:false,completada:false};
  const pending = gate.saveDraft(db,'fixture','sesion-u3-1','fixture',draft);
  draft.answers.q1='C'; await pending;
  assert.strictEqual(attempt.answers.q1,'B');
  failWrite=true;
  await assert.rejects(gate.submit(db,'fixture','sesion-u3-1','fixture',{answers:{q1:'B'}},{puntaje:1,total:1}));
  assert.strictEqual(attempt.completada,false);assert.strictEqual(result,null);
  failWrite=false;
  await gate.submit(db,'fixture','sesion-u3-1','fixture',{answers:{q1:'B'}},{puntaje:1,total:1});
  assert.strictEqual(attempt.submitted,true);assert.strictEqual(attempt.completada,true);assert.strictEqual(result.puntaje,1);
  await gate.saveDraft(db,'fixture','sesion-u3-1','fixture',{answers:{},submitted:false,completada:false});
  assert.strictEqual(attempt.answers.q1,'B');assert.strictEqual(attempt.completada,true);
  await gate.submit(db,'fixture','sesion-u3-1','fixture',{answers:{}},{puntaje:0,total:1});
  assert.strictEqual(atomicWrites,1);
  failRead=true;
  assert.strictEqual(await gate.check(db,'fixture','sesion-u3-2','fixture',true),true);
  await assert.rejects(gate.submit(db,'fixture','sesion-u3-2','fixture',{},{puntaje:0,total:1}));
  assert.strictEqual(atomicWrites,1);
  const start=dashboard.indexOf('        function classifySubmissionStatus(');
  const end=dashboard.indexOf('        function renderLaborGrades(',start);
  const context={Date,Number};vm.createContext(context);vm.runInContext(dashboard.slice(start,end),context);
  const oldGrade={sessionId:'sesion-u3-1',grade:1,status:'not_submitted',publishedAt:new Date(1000).toISOString()};
  assert.strictEqual(context.reconcileLaborGradeStatus(oldGrade,{'sesion-u3-1':{submitted:true,completada:true,submittedAt:2000}}).needsReview,true);
  assert.strictEqual(context.reconcileLaborGradeStatus(oldGrade,{'sesion-u3-1':{__readError:true}}).status,'read_error');
  const generic=fs.readFileSync(path.join(root,'estudiantes/sesion.html'),'utf8');
  const routeStart=generic.indexOf('        const simceU3Guides =');
  const routeEnd=generic.indexOf('        // Try Firebase first',routeStart);
  assert(routeStart>=0&&routeEnd>routeStart);
  const route=new Function('sessionId','studentData','window',generic.slice(routeStart,routeEnd));
  let target=null;const location={replace:value=>{target=value;}};
  route('sesion-u3-10',{curso:'2B-HC'},{location});
  assert.strictEqual(target,'/estudiantes/guia-u3-s10-cronica-carta.html');
  target=null;route('sesion-u3-10',{curso:'3A-TP'},{location});assert.strictEqual(target,null);
  console.log('Guardado SIMCE probado: carga fallida protegida, entrega atómica, reintento, confirmación, borrador tardío y nota desactualizada.');
}
verifyDeliveryStore().catch(error=>{console.error(error);process.exitCode=1;});
