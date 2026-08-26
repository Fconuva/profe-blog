const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const dataSource = read('estudiantes/js/u3s7-data.js');
const context = { window:{} };
vm.createContext(context);
vm.runInContext(dataSource, context);
const data = context.window.SIMCE_U3S7_DATA;
const page = read('estudiantes/guia-u3-s7-discurso.html');
const api = read('api/simce-u3s7.js');
const dashboard = read('estudiantes/dashboard.html');
const admin = read('estudiantes/adminprofe/index.html');
const contract = JSON.parse(read('scripts/class-submission-contract.json'));
const manifest = JSON.parse(read('scripts/academic-release-manifest.json'));

expect(data && Array.isArray(data.units), 'No se cargó la matriz académica.');
expect(data.units.length === 8, `Se esperaban 8 lecturas y hay ${data.units.length}.`);
expect(data.questions.length === 50, `Se esperaban 50 reactivos y hay ${data.questions.length}.`);
expect(data.openQuestions.length === 2, 'Deben existir dos respuestas de desarrollo.');
expect(data.metaQuestions.length === 3, 'El cierre debe contener tres respuestas escritas.');
expect(data.concepts.length === 8, 'La activación debe contener ocho casos conceptuales.');
expect(!/\bkey\s*:|correcta\s*:|answerKey/i.test(dataSource), 'La clave de los reactivos no puede viajar en los datos del navegador.');

const ids = data.questions.map(question => question.id);
expect(ids.join(',') === Array.from({length:50},(_,index)=>`q${index+1}`).join(','), 'La numeración debe cubrir q1 a q50 sin saltos.');
const unitCounts = Object.fromEntries(data.units.map(unit => [unit.id, data.questions.filter(question => question.unit === unit.id).length]));
expect(Object.values(unitCounts).every(count => count >= 6 && count <= 7), `Cada texto debe tener 6 o 7 reactivos: ${JSON.stringify(unitCounts)}.`);

for (const question of data.questions) {
  const labels = Object.keys(question.options || {});
  expect(labels.join('') === 'ABCD', `${question.id}: alternativas incompletas o desordenadas.`);
  const normalized = Object.values(question.options || {}).map(value => value.toLowerCase().replace(/[^a-záéíóúüñ0-9]+/gi,' ').trim());
  expect(new Set(normalized).size === 4, `${question.id}: contiene alternativas duplicadas.`);
  expect(question.prompt.length >= 35 && question.prompt.length <= 180, `${question.id}: enunciado fuera del rango funcional.`);
  expect(['LOCALIZAR','INTERPRETAR','REFLEXIONAR'].includes(question.skill), `${question.id}: habilidad inválida.`);
}

const keyBody = api.match(/const ANSWER_KEY\s*=\s*\{([\s\S]*?)\n\};/)?.[1] || '';
const keys = Object.fromEntries([...keyBody.matchAll(/(q\d+)\s*:\s*'([ABCD])'/g)].map(match => [match[1],match[2]]));
expect(Object.keys(keys).length === 50, `La API contiene ${Object.keys(keys).length} claves; se esperaban 50.`);
expect(Object.keys(keys).every(id => ids.includes(id)), 'La API contiene una clave sin reactivo correspondiente.');
const distribution = Object.values(keys).reduce((acc,key)=>{acc[key]=(acc[key]||0)+1;return acc},{});
expect(JSON.stringify(distribution) === JSON.stringify({B:13,D:12,A:13,C:12}), `Distribución de claves no balanceada: ${JSON.stringify(distribution)}.`);
const hash = value => { let h=2166136261; for (const ch of String(value)) { h^=ch.charCodeAt(0); h=Math.imul(h,16777619); } return h>>>0; };
const shuffled = (entries,seed) => entries.map((item,index)=>({item,n:hash(seed+'|'+index)})).sort((a,b)=>a.n-b.n).map(entry=>entry.item);
for (const uid of ['auditoria-2a','auditoria-2b']) {
  const visibleKeys = data.questions.map(question => {
    const visible = shuffled(Object.keys(question.options), `${uid}|${question.id}`);
    return 'ABCD'[visible.indexOf(keys[question.id])];
  });
  const visibleDistribution = visibleKeys.reduce((acc,key)=>{acc[key]=(acc[key]||0)+1;return acc},{});
  expect(Object.values(visibleDistribution).every(count=>count>=8&&count<=17), `Distribución visible desequilibrada para ${uid}: ${JSON.stringify(visibleDistribution)}.`);
  expect(!/AAAA|BBBB|CCCC|DDDD/.test(visibleKeys.join('')), `Hay cuatro claves visibles consecutivas para ${uid}.`);
  expect(!/(ABCD){2}|(DCBA){2}/.test(visibleKeys.join('')), `Hay una secuencia visible mecánica para ${uid}.`);
}

let meaningfulLengthCue = 0;
for (const question of data.questions) {
  const lengths = Object.fromEntries(Object.entries(question.options).map(([label,value])=>[label,value.length]));
  const max = Math.max(...Object.values(lengths));
  const longestDistractor = Math.max(...Object.entries(lengths).filter(([label])=>label!==keys[question.id]).map(([,length])=>length));
  if (lengths[keys[question.id]] - longestDistractor > 10) meaningfulLengthCue += 1;
}
expect(meaningfulLengthCue <= 13, `La clave supera por más de 10 caracteres a todos los distractores en ${meaningfulLengthCue}/50 reactivos.`);

expect(page.includes('50 reactivos'), 'La portada no informa los 50 reactivos.');
expect(page.includes("SESSION='sesion-u3-7'"), 'La página no usa la sesión canónica.');
expect(page.includes('Puntaje: ${confirmed.result.score} de ${confirmed.result.total}'), 'El popup no muestra puntaje sin respuestas.');
expect(!page.includes('respuesta correcta es'), 'La página no debe exponer respuestas correctas al entregar.');
expect(page.includes('saveQueue=Promise.resolve()'), 'Falta la cola serializada de autoguardado.');
expect(page.includes('await saveQueue'), 'La entrega no espera el autoguardado.');
expect(page.includes('attempt.completada !== true'), 'La entrega no relee la confirmación del servidor.');
expect(page.includes('/estudiantes/assets/u3s7/infografia-leer-discurso.png'), 'La infografía no está integrada.');
expect(fs.statSync(path.join(root,'estudiantes/assets/u3s7/infografia-leer-discurso.png')).size > 500000, 'La infografía no tiene resolución suficiente.');

expect(dashboard.includes("'sesion-u3-7'"), 'El dashboard no registra la sesión 7.');
expect(admin.includes("'sesion-u3-7'"), 'El admin no registra la sesión 7.');
expect(!dashboard.includes('<div class="session-num">7</div>'), 'La tarjeta gris de la clase 7 sigue duplicada en el plan.');
expect(contract.files.some(entry => entry.path === 'estudiantes/guia-u3-s7-discurso.html' && entry.storage === 'api'), 'La página no está en el contrato de entrega.');
expect(manifest.criticalFiles.some(entry => entry.path === 'estudiantes/guia-u3-s7-discurso.html'), 'La página no está protegida por el manifiesto.');

const inlineScripts = [...page.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match=>match[1]).filter(value=>value.trim());
inlineScripts.forEach((script,index)=>{try{new Function(script)}catch(error){failures.push(`Script embebido ${index+1} inválido: ${error.message}`)}});
try { new Function(api); } catch (error) { failures.push(`API inválida: ${error.message}`); }

if (failures.length) {
  console.error('Auditoría SIMCE U3S7 incumplida:\n- '+failures.join('\n- '));
  process.exit(1);
}
console.log(`SIMCE U3S7 auditado: 8 textos, 50 reactivos, claves internas A13/B13/C12/D12, posiciones visibles aleatorias y ${meaningfulLengthCue}/50 indicios relevantes por extensión.`);
