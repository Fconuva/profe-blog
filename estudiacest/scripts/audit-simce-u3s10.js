const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const stripHtml = value => String(value || '').replace(/<[^>]+>/g, ' ').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim();
const functionBody = (source, name) => {
  const signature = `function ${name}(`;
  const start = source.indexOf(signature);
  if (start < 0) return '';
  const open = source.indexOf('{', start);
  if (open < 0) return '';
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(open + 1, index);
    }
  }
  return '';
};

const page = read('estudiantes/guia-u3-s10-cronica-carta.html');
const dashboard = read('estudiantes/dashboard.html');
const admin = read('estudiantes/adminprofe/index.html');
const contract = JSON.parse(read('scripts/class-submission-contract.json'));
const manifest = JSON.parse(read('scripts/academic-release-manifest.json'));

const match = page.match(/const QUESTIONS\s*=\s*(\[[\s\S]*?\n  \];)/);
expect(match, 'No se encontró el arreglo QUESTIONS en la página.');
let QUESTIONS = [];
if (match) {
  const context = {};
  vm.createContext(context);
  QUESTIONS = vm.runInContext(`(${match[1].replace(/;\s*$/, '')})`, context);
}

expect(Array.isArray(QUESTIONS) && QUESTIONS.length === 14, `Se esperaban 14 reactivos y hay ${QUESTIONS.length}.`);
const ids = QUESTIONS.map(q => q.id);
expect(ids.join(',') === Array.from({ length: 14 }, (_, i) => `q${i + 1}`).join(','), 'La numeración debe cubrir q1 a q14 sin saltos.');

const skillDistribution = QUESTIONS.reduce((acc, q) => { acc[q.hab] = (acc[q.hab] || 0) + 1; return acc; }, {});
expect(JSON.stringify(skillDistribution) === JSON.stringify({ L: 4, I: 7, R: 3 }), `Distribución de habilidades inesperada: ${JSON.stringify(skillDistribution)}.`);

const DISTRACTOR_TAG = /^Trampa\s*\((cambio de foco|sobregeneralización|literalización|invención plausible|contrasentido|confusión técnica|dato de otro momento|exageración del cronista|parcialmente correcto)\)/i;
let longestKeyCues = 0;
for (const question of QUESTIONS) {
  const letters = (question.ops || []).map(o => o.l);
  expect(letters.join('') === 'ABCD', `${question.id}: alternativas incompletas o desordenadas.`);
  expect(['L', 'I', 'R'].includes(question.hab), `${question.id}: habilidad inválida.`);
  expect(['A', 'B', 'C', 'D'].includes(question.correcta), `${question.id}: letra de respuesta inválida.`);
  expect(question.why && ['A', 'B', 'C', 'D'].every(letter => typeof question.why[letter] === 'string' && question.why[letter].length >= 20), `${question.id}: faltan explicaciones por alternativa.`);
  if (question.why) {
    for (const letter of letters) {
      const text = question.why[letter] || '';
      if (letter === question.correcta) {
        expect(/^Correcta\./.test(text), `${question.id}${letter}: la explicación de la clave debe declarar explícitamente "Correcta.".`);
      } else {
        expect(DISTRACTOR_TAG.test(text), `${question.id}${letter}: el distractor no declara una falla técnica explícita (Trampa (...)).`);
      }
    }
  }
  const opByLetter = Object.fromEntries((question.ops || []).map(o => [o.l, o.t]));
  const keyLength = (opByLetter[question.correcta] || '').length;
  const otherMax = Math.max(...letters.filter(l => l !== question.correcta).map(l => (opByLetter[l] || '').length));
  if (keyLength - otherMax > 14) longestKeyCues += 1;
  expect(typeof question.cita === 'string' && question.cita.length >= 15, `${question.id}: falta la cita textual de respaldo.`);
  expect(['p1', 'p2', 'ambos'].includes(question.texto), `${question.id}: referencia un texto inexistente.`);
  const normalized = (question.ops || []).map(o => o.t.toLowerCase().replace(/[^a-záéíóúüñ0-9]+/gi, ' ').trim());
  expect(new Set(normalized).size === 4, `${question.id}: contiene alternativas duplicadas.`);
}
expect(longestKeyCues === 0, `La clave es notoriamente más larga que todos los distractores en ${longestKeyCues} reactivo(s).`);

const p1Words = QUESTIONS.filter(q => q.texto === 'p1').length;
const p2Words = QUESTIONS.filter(q => q.texto === 'p2').length;
const ambosWords = QUESTIONS.filter(q => q.texto === 'ambos').length;
expect(p1Words === 6, `Se esperaban 6 preguntas sobre la crónica y hay ${p1Words}.`);
expect(p2Words === 5, `Se esperaban 5 preguntas sobre la carta y hay ${p2Words}.`);
expect(ambosWords === 3, `Se esperaban 3 preguntas de comparación y hay ${ambosWords}.`);

const cronicaBody = stripHtml((page.match(/La noche que el gimnasio se quedó sin luz[\s\S]*?<\/div>\s*<\/section>/)?.[0]) || '');
expect(cronicaBody.length >= 1500, 'La crónica quedó demasiado breve.');
const cartaBody = stripHtml((page.match(/Carta a la dirección del colegio[\s\S]*?<\/div>\s*<\/section>/)?.[0]) || '');
expect(cartaBody.length >= 900, 'La carta quedó demasiado breve.');

expect(page.includes('<div class="atencion">') && page.includes('ATENCIÓN'), 'Falta la caja de modelado ATENCIÓN.');
expect(/\.illus\{[^}]*width:100%/.test(page), 'Las ilustraciones de la Clase 10 pueden desbordar el ancho disponible en móvil.');
expect(page.includes('id="desarrollo"') && page.includes('id="modeloBox"'), 'Falta la pregunta de desarrollo con su respuesta modelo.');
expect(/\.modelo\{[^}]*display:none/.test(page), 'La respuesta modelo no parte oculta.');
expect(/\.retro\{[^}]*display:none/.test(page), 'Las explicaciones por alternativa no parten ocultas.');
expect(page.includes('id="noticia"') && page.includes('Escribe tu propia noticia'), 'Falta la tarea de producción de escribir una noticia.');
expect(page.includes('noticia:(document.getElementById(\'noticia\').value') || page.includes("noticia:(document.getElementById('noticia').value"), 'La noticia escrita por el estudiante no se está guardando.');
expect(page.includes('startedAt') && page.includes('elapsedMs'), 'Falta capturar el tiempo que demora el estudiante (startedAt/elapsedMs) para poder detectar entregas sospechosamente rápidas.');
expect(page.includes('SESSION_ID=\'sesion-u3-10\''), 'La página no usa la sesión canónica sesion-u3-10.');
expect(page.includes('work-telemetry.js" data-session="sesion-u3-10"'), 'Falta telemetría con la sesión correcta.');
expect(page.includes('id="submit"') && page.includes('type="button"'), 'El botón de entrega no está bien declarado.');
expect((page.match(/Entrega confirmada/g) || []).length >= 2, 'Falta el aviso de entrega confirmada en el modal.');
expect(page.includes('role="dialog"') && page.includes('aria-modal="true"'), 'Falta el diálogo accesible de confirmación.');
expect(page.includes('saveQueue=Promise.resolve()') && page.includes('await saveQueue'), 'El autoguardado no está serializado con la entrega.');
expect(page.includes("child('submitted').once('value')") && page.includes("child('completada').once('value')"), 'La entrega no relee ambos indicadores canónicos desde Firebase.');

const pickBody = functionBody(page, 'pick');
const hydrateBody = functionBody(page, 'hydrate');
const revealBody = functionBody(page, 'revealAllCorrections');
const diagBody = functionBody(page, 'updateDiag');
const submitBody = functionBody(page, 'submitGuide');
const gateBody = functionBody(page, 'canShowFeedback');
const configBody = functionBody(page, 'setFeedbackConfig');

expect(Boolean(pickBody), 'No se encontró la función pick.');
expect(!pickBody.includes('revealAllCorrections') && !pickBody.includes('.correcta') && !pickBody.includes('.why') && !pickBody.includes('.cita'), 'Elegir una alternativa puede revelar pauta o explicación.');
expect(Boolean(hydrateBody), 'No se encontró la función hydrate.');
expect(!hydrateBody.includes('revealAllCorrections') && !hydrateBody.includes('scoreSummary') && !hydrateBody.includes('grade('), 'Cargar un borrador puede revelar corrección o puntaje.');
expect(hydrateBody.includes('hasConfirmedDelivery(saved)'), 'La hidratación no exige una entrega confirmada por el lector local.');
expect(page.includes('saved.submitted===true&&saved.completada===true'), 'El lector local no exige ambos indicadores canónicos de entrega.');
expect(gateBody.includes('feedbackReleased===true&&isSubmitted===true'), 'La retroalimentación no exige simultáneamente publicación y entrega confirmada.');
expect(revealBody.trimStart().startsWith('if(!canShowFeedback())'), 'La función de corrección no está protegida por la compuerta canónica.');
expect(diagBody.indexOf('if(!canShowFeedback())') >= 0 && diagBody.indexOf('if(!canShowFeedback())') < diagBody.indexOf("s[h].ok+'/'+s[h].n"), 'El diagnóstico puede mostrar aciertos antes de habilitar la retroalimentación.');
expect(configBody.includes('config.resultados_visibles===true||config.retroalimentacion_visible===true'), 'La liberación no usa exclusivamente los indicadores canónicos de la sesión.');
expect(page.includes("db.ref(BASE+'/sesiones/'+SESSION_ID).once('value')"), 'La página no lee la configuración canónica de sesion-u3-10.');
const configApplyIndex = page.indexOf('setFeedbackConfig(sessionSnap.val())');
const hydrateCallIndex = page.indexOf('hydrate(useLocal?local:remote)');
expect(configApplyIndex >= 0 && hydrateCallIndex > configApplyIndex, 'La configuración de retroalimentación debe cargarse antes de hidratar el intento.');
expect(!submitBody.includes('revealAllCorrections'), 'La entrega revela correcciones antes de confirmar la escritura.');
expect(submitBody.indexOf('applyFeedbackVisibility()') > submitBody.indexOf('isSubmitted=true'), 'La entrega intenta mostrar retroalimentación antes de quedar confirmada.');
expect(submitBody.includes('Entrega confirmada. La pauta y el puntaje se publicarán más adelante.'), 'La entrega cerrada no muestra una confirmación genérica.');
expect(page.includes('id="btnModelo" disabled aria-disabled="true"'), 'El botón de respuesta modelo no inicia bloqueado.');
const modelHandlerIndex = page.indexOf("document.getElementById('btnModelo').addEventListener");
const modelGuardIndex = page.indexOf('if(!canShowFeedback())', modelHandlerIndex);
const modelRevealIndex = page.indexOf("document.getElementById('modeloBox').classList.add('show')", modelHandlerIndex);
expect(modelHandlerIndex >= 0 && modelGuardIndex > modelHandlerIndex && modelRevealIndex > modelGuardIndex, 'La respuesta modelo puede abrirse sin pasar por la compuerta de publicación.');
expect((page.match(/modeloBox'\)\.classList\.add\('show'\)/g) || []).length === 1, 'Existe una vía adicional para mostrar la respuesta modelo.');
expect(page.includes('let answers={}, currentUID=null, studentData=null, isSubmitted=false, feedbackReleased=false'), 'La retroalimentación no está cerrada por defecto.');
expect(!page.includes('Tu resultado por eje aparece al responder las 14 preguntas'), 'La interfaz aún promete corrección inmediata al completar alternativas.');

expect(dashboard.includes("'sesion-u3-10'"), 'El dashboard no registra la Clase 10.');
expect(admin.includes("'sesion-u3-10'"), 'El admin no registra la Clase 10.');
expect(!dashboard.includes('<div class="session-num">10</div>'), 'La tarjeta gris de la Clase 10 sigue duplicada en el plan de la Unidad 3.');

expect(contract.files.some(entry => entry.path === 'estudiantes/guia-u3-s10-cronica-carta.html' && entry.storage === 'firebase-client'), 'La página no está registrada en el contrato de entrega.');
expect(manifest.criticalFiles.some(entry => entry.path === 'estudiantes/guia-u3-s10-cronica-carta.html'), 'La página no está protegida por el manifiesto.');

const inlineScripts = [...page.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match => match[1]).filter(value => value.trim());
inlineScripts.forEach((script, index) => { try { new Function(script); } catch (error) { failures.push(`Script embebido ${index + 1} inválido: ${error.message}`); } });

if (failures.length) {
  console.error('Auditoría SIMCE U3S10 incumplida:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log(`SIMCE U3S10 auditado: 2 textos (crónica y carta), 14 reactivos, habilidades ${JSON.stringify(skillDistribution)}, entrega directa a Firebase y retroalimentación cerrada hasta publicación canónica verificadas. Reglas de construcción: 4 alternativas sin duplicados, distractor con falla técnica explícita, clave nunca la más larga (${longestKeyCues} indicios) y cita textual de respaldo en todos los reactivos.`);
