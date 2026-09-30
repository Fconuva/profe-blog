const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const pagePath = 'estudiantes/guia-u3-s11-evidencia-dos-textos.html';
const page = read(pagePath);
const dashboard = read('estudiantes/dashboard.html');
const admin = read('estudiantes/adminprofe/index.html');
const contract = JSON.parse(read('scripts/class-submission-contract.json'));
const manifest = JSON.parse(read('scripts/academic-release-manifest.json'));

expect(page.includes('La evidencia cambia según el texto'), 'Falta el foco visible de la Clase 11.');
expect(page.includes('El puente de cartón') && page.includes('Mostrar el borrador, no solo el resultado'), 'No están los dos textos de trabajo.');
expect((page.match(/Texto original creado para esta clase|Columna original creada para esta clase/g) || []).length === 2, 'Los dos textos deben declarar su origen.');
expect(page.includes('Texto narrativo') && page.includes('Texto argumentativo'), 'No se explicitan los dos tipos de texto.');
expect(page.includes('evidencia narrativa') && page.includes('evidencia argumentativa'), 'Falta modelar la evidencia propia de cada tipo textual.');
expect((page.match(/Afirmación:/g) || []).length >= 2, 'Faltan modelos de afirmación en ambos textos.');
expect((page.match(/Evidencia:/g) || []).length >= 2, 'Faltan modelos de evidencia en ambos textos.');
expect((page.match(/Explicación:/g) || []).length >= 2, 'Faltan modelos de explicación en ambos textos.');

const timeValues = [...page.matchAll(/<b>(\d+) min<\/b>/g)].map(match => Number(match[1]));
expect(timeValues.reduce((sum, value) => sum + value, 0) === 90, `La ruta declarada suma ${timeValues.reduce((sum, value) => sum + value, 0)} minutos, no 90.`);

const requiredFields = ['nar-a', 'nar-e', 'nar-x', 'arg-a', 'arg-e', 'arg-x', 'close-understood', 'close-evidence', 'close-improve'];
requiredFields.forEach(id => expect(page.includes(`id="${id}"`), `Falta el campo obligatorio ${id}.`));
expect(page.includes("const QUESTIONS=[") && page.includes("{id:'narrativo'") && page.includes("{id:'argumentativo'"), 'Los dos productos no están declarados como estructura dinámica.');
expect(page.includes("const CLOSING_FIELDS=['close-understood','close-evidence','close-improve']"), 'El cierre no contiene las tres consignas canónicas.');
expect(page.includes('function validate()') && page.includes("scrollIntoView({behavior:'smooth',block:'center'})"), 'La validación no lleva al primer campo incompleto.');
expect(page.includes('score:completedCount(),total:QUESTIONS.length'), 'La entrega no calcula su avance desde los dos productos reales.');
expect(page.includes("updates['respuestas/'+SESSION_ID+'/'+currentUID]=response"), 'La entrega final no escribe la respuesta canónica.');
expect(page.includes("updates['resultados/'+SESSION_ID+'/'+currentUID]=result"), 'La entrega no deja los productos visibles para revisión docente.');
expect(page.includes('await db.ref(BASE).update(updates)'), 'Respuesta y registro formativo no se escriben atómicamente.');
expect(page.includes("child('submitted').once('value')") && page.includes("child('completada').once('value')"), 'La entrega no relee ambas marcas canónicas.');
expect(page.includes('let saveQueue=Promise.resolve()') && page.includes('await saveQueue'), 'El autoguardado no está serializado con la entrega.');
expect(page.includes('completionOnly:true,formativa:true'), 'El resultado no está marcado como formativo y de finalización.');
expect(!page.includes("updates['ranking/"), 'Una producción formativa no debe escribir ranking.');
expect(page.includes('work-telemetry.js" data-session="sesion-u3-11"'), 'Falta la telemetría de trabajo de la sesión.');
expect(page.includes("window.location.hostname==='127.0.0.1'") && page.includes("get('preview')==='1'"), 'La vista previa no está limitada explícitamente a localhost.');

expect(dashboard.includes("'sesion-u3-11'") && dashboard.includes("fecha_aplicacion:'2026-09-30'"), 'El dashboard no registra la Clase 11 con su fecha.');
expect(admin.includes("'sesion-u3-11'") && admin.includes("formato_panel:'evidencia-dos-textos'"), 'El admin no registra el formato de la Clase 11.');
expect(dashboard.includes("asignados:['2A-HC','2B-HC']"), 'La clase no está asignada a 2°A y 2°B HC.');
expect(admin.includes("texto_narrativo:'Producto 1 · respuesta al microcuento'") && admin.includes("texto_argumentativo:'Producto 2 · respuesta a la columna'"), 'El admin no rotula los dos productos escritos.');
expect(admin.includes("if(sessions[sesId]?.formativa===true) continue;"), 'Los resultados formativos pueden contaminar un promedio evaluativo.');

expect(contract.files.some(entry => entry.path === pagePath && entry.storage === 'firebase-client'), 'La página no está registrada en el contrato de entrega.');
const manifestEntry = manifest.criticalFiles.find(entry => entry.path === pagePath);
expect(manifestEntry && manifestEntry.url === '/estudiantes/guia-u3-s11-evidencia-dos-textos.html', 'La página no está protegida por el manifiesto académico.');

const inlineScripts = [...page.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match => match[1]).filter(source => source.trim());
inlineScripts.forEach((source, index) => {
  try { new Function(source); } catch (error) { failures.push(`Script embebido ${index + 1} inválido: ${error.message}`); }
});

if (failures.length) {
  console.error('Auditoría SIMCE U3S11 incumplida:\n- ' + failures.join('\n- '));
  process.exit(1);
}

console.log('SIMCE U3S11 auditada: 90 minutos, microcuento y columna originales, dos modelos A–E–E, dos productos escritos, cierre metacognitivo, autoguardado, entrega atómica, panel docente y exclusión de promedios evaluativos verificados.');
