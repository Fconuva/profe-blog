const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const stripHtml = value => String(value || '').replace(/<[^>]+>/g, ' ').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim();

const dataSource = read('estudiantes/js/u3s8-data.js');
const context = { window:{} };
vm.createContext(context);
vm.runInContext(dataSource, context);
const data = context.window.SIMCE_U3S8_DATA;
const page = read('estudiantes/guia-s8-evidencia-distractores.html');
const api = read('api/estudiantes.js');
const dashboard = read('estudiantes/dashboard.html');
const admin = read('estudiantes/adminprofe/index.html');
const contract = JSON.parse(read('scripts/class-submission-contract.json'));
const manifest = JSON.parse(read('scripts/academic-release-manifest.json'));

expect(data && Array.isArray(data.units), 'No se cargó la matriz académica de la Clase 8.');
expect(data.units.length === 7, `Se esperaban 7 textos y hay ${data.units.length}.`);
expect(data.questions.length === 36, `Se esperaban 36 reactivos y hay ${data.questions.length}.`);
expect(data.metaQuestions.length === 2, 'El cierre debe contener dos respuestas escritas no puntuables.');
expect(!/\bkey\s*:|correcta\s*:|answerKey|QUESTION_ANSWERS|data-correct/i.test(dataSource), 'La clave no puede viajar en los datos públicos.');

const ids = data.questions.map(question => question.id);
expect(ids.join(',') === Array.from({length:36},(_,index)=>`q${index+1}`).join(','), 'La numeración debe cubrir q1 a q36 sin saltos.');
expect(new Set(data.units.map(unit => unit.id)).size === 7, 'Los textos deben tener identificadores únicos.');
const unitCounts = Object.fromEntries(data.units.map(unit => [unit.id, data.questions.filter(question => question.unit === unit.id).length]));
expect(Object.values(unitCounts).every(count => count >= 5 && count <= 6), `Cada texto debe reunir 5 o 6 reactivos: ${JSON.stringify(unitCounts)}.`);

const wordCounts = Object.fromEntries(data.units.map(unit => [unit.id, stripHtml(unit.body).split(/\s+/).filter(Boolean).length]));
expect(wordCounts.t1 >= 350, `El relato quedó demasiado breve (${wordCounts.t1} palabras).`);
expect(wordCounts.t2 >= 300, `El artículo quedó demasiado breve (${wordCounts.t2} palabras).`);
expect(wordCounts.t3 >= 70, `El poema quedó demasiado breve (${wordCounts.t3} palabras).`);
expect(wordCounts.t5 >= 280 && wordCounts.t6 >= 280, 'Los textos argumentativo y entrevista requieren desarrollo suficiente.');
expect(/bar-chart/.test(data.units.find(unit => unit.id === 't4').body) && /data-table/.test(data.units.find(unit => unit.id === 't4').body), 'El texto discontinuo debe integrar gráfico, tabla y nota metodológica.');
expect(/DOCUMENTO A/.test(data.units.find(unit => unit.id === 't7').body) && /DOCUMENTO B/.test(data.units.find(unit => unit.id === 't7').body), 'La unidad final debe exigir relación entre dos documentos.');

for (const question of data.questions) {
  const labels = Object.keys(question.options || {});
  expect(labels.join('') === 'ABCD', `${question.id}: alternativas incompletas o desordenadas.`);
  const normalized = Object.values(question.options || {}).map(value => value.toLowerCase().replace(/[^a-záéíóúüñ0-9]+/gi,' ').trim());
  expect(new Set(normalized).size === 4, `${question.id}: contiene alternativas duplicadas.`);
  expect(question.prompt.length >= 45 && question.prompt.length <= 190, `${question.id}: enunciado fuera del rango funcional (${question.prompt.length}).`);
  expect(['LOCALIZAR','INTERPRETAR','REFLEXIONAR'].includes(question.skill), `${question.id}: habilidad inválida.`);
  expect(data.units.some(unit => unit.id === question.unit), `${question.id}: referencia un texto inexistente.`);
}

const skillDistribution = data.questions.reduce((acc,question)=>{acc[question.skill]=(acc[question.skill]||0)+1;return acc},{});
expect(JSON.stringify(skillDistribution) === JSON.stringify({LOCALIZAR:6,INTERPRETAR:18,REFLEXIONAR:12}), `Distribución de habilidades inesperada: ${JSON.stringify(skillDistribution)}.`);

const keyBody = api.match(/const U3S8_ANSWER_KEY\s*=\s*\{([\s\S]*?)\n\};/)?.[1] || '';
const keys = Object.fromEntries([...keyBody.matchAll(/(q\d+)\s*:\s*'([ABCD])'/g)].map(match => [match[1],match[2]]));
expect(Object.keys(keys).length === 36, `La API contiene ${Object.keys(keys).length} claves; se esperaban 36.`);
expect(Object.keys(keys).every(id => ids.includes(id)), 'La API contiene una clave sin reactivo correspondiente.');
const keyDistribution = Object.values(keys).reduce((acc,key)=>{acc[key]=(acc[key]||0)+1;return acc},{});
expect(JSON.stringify(keyDistribution) === JSON.stringify({B:9,D:9,A:9,C:9}), `Distribución de claves no balanceada: ${JSON.stringify(keyDistribution)}.`);

const hash = value => { let h=2166136261; for (const ch of String(value)) { h^=ch.charCodeAt(0); h=Math.imul(h,16777619); } return h>>>0; };
const shuffled = (entries,seed) => entries.map((item,index)=>({item,n:hash(seed+'|'+index)})).sort((a,b)=>a.n-b.n).map(entry=>entry.item);
for (const uid of ['auditoria-2a','auditoria-2b','auditoria-movil']) {
  const visibleKeys = data.questions.map(question => {
    const visible = shuffled(Object.keys(question.options), `${uid}|${question.id}`);
    return 'ABCD'[visible.indexOf(keys[question.id])];
  });
  const visibleDistribution = visibleKeys.reduce((acc,key)=>{acc[key]=(acc[key]||0)+1;return acc},{});
  expect(Object.values(visibleDistribution).every(count=>count>=5&&count<=13), `Distribución visible desequilibrada para ${uid}: ${JSON.stringify(visibleDistribution)}.`);
  expect(!/(ABCD){2}|(DCBA){2}/.test(visibleKeys.join('')), `Hay una secuencia visible mecánica para ${uid}.`);
}

let lengthCues = 0;
for (const question of data.questions) {
  const lengths = Object.fromEntries(Object.entries(question.options).map(([label,value])=>[label,value.length]));
  const longestDistractor = Math.max(...Object.entries(lengths).filter(([label])=>label!==keys[question.id]).map(([,length])=>length));
  if (lengths[keys[question.id]] - longestDistractor > 14) lengthCues += 1;
}
expect(lengthCues <= 8, `La clave es notoriamente más larga que todos los distractores en ${lengthCues}/36 reactivos.`);

expect(page.includes("SESSION='sesion-u3-8'"), 'La página no usa la sesión canónica sesion-u3-8.');
expect(page.includes('7 textos') && page.includes('36 preguntas'), 'La portada no informa la extensión real.');
expect(page.includes("const API='/api/estudiantes'"), 'La página no usa la API unificada.');
expect(page.includes('simce-u3s8-state') && page.includes('simce-u3s8-save') && page.includes('simce-u3s8-submit'), 'Falta una ruta del flujo de servidor.');
expect(page.includes('Puntaje: ${confirmed.result.score} de ${confirmed.result.total}'), 'El diálogo final no muestra el puntaje sin revelar respuestas.');
expect(!/QUESTION_ANSWERS|data-correct|La correcta es|respuesta correcta es/i.test(page), 'La página expone claves o retroalimentación sumativa.');
expect(page.includes('saveQueue=Promise.resolve()') && page.includes('await saveQueue'), 'El autoguardado no está serializado con la entrega.');
expect(page.includes('attempt.completada !== true'), 'La entrega no relee la confirmación del servidor.');
expect(!/firstMissing|Faltan \$\{/.test(page), 'La entrega no debe exigir completar todas las respuestas.');
expect(page.includes('work-telemetry.js" data-session="sesion-u3-8"'), 'Falta telemetría con la sesión correcta.');
expect(page.includes("shuffled(config.units,(user&&user.uid)||'preview')"), 'Los textos no cambian de orden por estudiante.');
expect(page.includes("shuffled(Object.entries(question.options)"), 'Las alternativas no cambian de orden por estudiante.');

const s8Handler = api.match(/async function handleU3S8[\s\S]*?function resolveAllowedOrigin/)?.[0] || '';
expect(s8Handler.includes('db.ref().update(rootUpdates)'), 'La entrega final no es atómica.');
expect(!/correcta\s*:|answerKey/i.test(s8Handler), 'El handler no debe devolver la clave al navegador.');
expect(s8Handler.includes('score:scored.score') && s8Handler.includes('total:scored.total'), 'El servidor no calcula y guarda el resultado.');

expect(dashboard.includes("'sesion-u3-8'"), 'El dashboard no registra la Clase 8.');
expect(admin.includes("'sesion-u3-8'"), 'El admin no registra la Clase 8.');
expect(!dashboard.includes('<div class="session-num">8</div>'), 'La tarjeta gris de la Clase 8 sigue duplicada en el plan.');
expect(!admin.includes('preloadSession8'), 'El admin conserva el precargador antiguo que escribía sobre sesion-7.');
expect(contract.files.some(entry => entry.path === 'estudiantes/guia-s8-evidencia-distractores.html' && entry.storage === 'api'), 'La página no está registrada en el contrato de entrega.');
expect(manifest.criticalFiles.some(entry => entry.path === 'estudiantes/guia-s8-evidencia-distractores.html'), 'La página no está protegida por el manifiesto.');
expect(manifest.criticalFiles.some(entry => entry.path === 'estudiantes/js/u3s8-data.js'), 'Los datos de la clase no están protegidos por el manifiesto.');

const inlineScripts = [...page.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match=>match[1]).filter(value=>value.trim());
inlineScripts.forEach((script,index)=>{try{new Function(script)}catch(error){failures.push(`Script embebido ${index+1} inválido: ${error.message}`)}});
try { new Function(api); } catch (error) { failures.push(`API inválida: ${error.message}`); }

if (failures.length) {
  console.error('Auditoría SIMCE U3S8 incumplida:\n- '+failures.join('\n- '));
  process.exit(1);
}
console.log(`SIMCE U3S8 auditado: 7 textos, 36 reactivos, habilidades 6/18/12, claves A9/B9/C9/D9 y ${lengthCues}/36 indicios relevantes por extensión.`);
