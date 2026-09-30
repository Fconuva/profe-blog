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

expect(page.includes('Del relato a la noticia'), 'Falta el foco visible de transformación textual.');
expect(page.includes('El puente de cartón'), 'Falta el relato de origen.');
expect((page.match(/Texto original creado para esta clase/g) || []).length === 1, 'El relato debe declarar su origen una vez.');
expect(page.includes('<h2>1. Lee el relato</h2>') && page.includes('<h2>6. Revisa y entrega</h2>'), 'La secuencia visual no contiene los seis momentos esenciales.');
expect(page.includes('<h3>Relato</h3>') && page.includes('<h3>Noticia</h3>'), 'Falta el modelo breve de transformación.');
expect(page.includes('el hecho principal aparece primero') && page.includes('el tono es objetivo') && page.includes('la información se mantiene'), 'El modelo no explica las decisiones principales de reescritura.');
expect(page.includes('No inventes nombres, fechas, lugares ni opiniones'), 'Falta la regla explícita contra la invención de datos.');
expect(page.includes('140 y 220 palabras'), 'Falta una extensión clara para el producto final.');
expect(!page.includes('hero-badges') && !page.includes('quick-nav') && !page.includes('class="timeline"'), 'La apertura conserva elementos visuales eliminados por decisión docente.');
expect(!page.includes('id="ruta"') && !page.includes('id="comparacion"'), 'La página conserva secciones introductorias redundantes.');
expect(page.includes('<h2>3. Partes de la noticia</h2>') && page.includes('/estudiantes/assets/u3s11/partes-noticia-ia.webp'), 'Falta la sección con la infografía de las partes de la noticia.');
expect(page.includes('Infografía creada con inteligencia artificial.'), 'La infografía no declara su origen con IA.');
expect(fs.existsSync(path.join(root, 'estudiantes/assets/u3s11/partes-noticia-ia.webp')), 'Falta el archivo de la infografía IA.');

const requiredFields = ['plan-que','plan-quien','plan-donde','plan-evidencia','news-title','news-lead','news-body','close-preserved','close-transformed','close-improve'];
requiredFields.forEach(id => expect(page.includes(`id="${id}"`), `Falta el campo obligatorio ${id}.`));
expect(page.includes("const QUESTIONS=[{id:'noticia',fields:['news-title','news-lead','news-body']}];"), 'El único producto no está declarado como noticia completa.');
expect(page.includes("const PLANNING_FIELDS=['plan-que','plan-quien','plan-donde','plan-evidencia'];"), 'Falta la planificación previa de la noticia.');
expect(page.includes("const CLOSING_FIELDS=['close-preserved','close-transformed','close-improve'];"), 'Falta el cierre sobre decisiones de transformación.');
expect(page.includes('function validate()') && page.includes("scrollIntoView({behavior:'smooth',block:'center'})"), 'La validación no lleva al primer campo incompleto.');
expect(page.includes('score:completedCount(),total:QUESTIONS.length'), 'La entrega no calcula el avance desde el producto real.');
expect(page.includes("updates['respuestas/'+SESSION_ID+'/'+currentUID]=response"), 'La entrega final no escribe la respuesta canónica.');
expect(page.includes("updates['resultados/'+SESSION_ID+'/'+currentUID]=result"), 'La entrega no deja la noticia visible para revisión docente.');
expect(page.includes('await db.ref(BASE).update(updates)'), 'Respuesta y registro formativo no se escriben atómicamente.');
expect(page.includes("child('submitted').once('value')") && page.includes("child('completada').once('value')"), 'La entrega no relee ambas marcas canónicas.');
expect(page.includes('let saveQueue=Promise.resolve()') && page.includes('await saveQueue'), 'El autoguardado no está serializado con la entrega.');
expect(page.includes('completionOnly:true,formativa:true'), 'El resultado no está marcado como formativo y de finalización.');
expect(!page.includes("updates['ranking/"), 'Una producción formativa no debe escribir ranking.');
expect(page.includes('work-telemetry.js" data-session="sesion-u3-11"'), 'Falta la telemetría de trabajo de la sesión.');
expect(page.includes("window.location.hostname==='127.0.0.1'") && page.includes("get('preview')==='1'"), 'La vista previa no está limitada explícitamente a localhost.');

expect(dashboard.includes("'sesion-u3-11'") && dashboard.includes("fecha_aplicacion:'2026-09-30'"), 'El dashboard no registra la Clase 11 con su fecha.');
expect(dashboard.includes("titulo:'Unidad 3 · Clase 11 — Del relato a la noticia'"), 'El dashboard conserva el título anterior.');
expect(admin.includes("'sesion-u3-11'") && admin.includes("formato_panel:'transformacion-relato-noticia'"), 'El admin no registra el nuevo formato de la Clase 11.');
expect(dashboard.includes("asignados:['2A-HC','2B-HC']"), 'La clase no está asignada a 2°A y 2°B HC.');
expect(admin.includes("noticia_transformada:'Producto final · noticia transformada'"), 'El admin no rotula la noticia final.');
expect(admin.includes("plan_evidencia:'Planificación · hechos conservados'") && admin.includes("transformo:'Revisión · cambio de género realizado'"), 'El admin no rotula la planificación y revisión.');
expect(admin.includes("Number(r.total)===1?'producto':'productos'"), 'El admin no usa singular para el único producto.');
expect(admin.includes('if(sessions[sesId]?.formativa===true) continue;'), 'Los resultados formativos pueden contaminar un promedio evaluativo.');
expect(contract.files.some(entry => entry.path === pagePath && entry.storage === 'firebase-client'), 'La página no está registrada en el contrato de entrega.');
const manifestEntry = manifest.criticalFiles.find(entry => entry.path === pagePath);
expect(manifestEntry && manifestEntry.url === '/estudiantes/guia-u3-s11-evidencia-dos-textos.html', 'La página no está protegida por el manifiesto académico.');
expect(manifestEntry && manifestEntry.contains === 'Del relato a la noticia', 'El manifiesto no exige el nuevo contenido.');
expect(manifest.criticalFiles.some(entry => entry.path === 'estudiantes/assets/u3s11/partes-noticia-ia.webp'), 'La infografía IA no está protegida por el manifiesto académico.');

const inlineScripts = [...page.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match => match[1]).filter(source => source.trim());
inlineScripts.forEach((source, index) => {
  try { new Function(source); } catch (error) { failures.push(`Script embebido ${index + 1} inválido: ${error.message}`); }
});

if (failures.length) {
  console.error('Auditoría SIMCE U3S11 incumplida:\n- ' + failures.join('\n- '));
  process.exit(1);
}

console.log('SIMCE U3S11 auditada: apertura mínima, seis momentos, relato original, modelo breve, infografía IA, planificación, noticia completa, revisión, autoguardado, entrega atómica, panel docente y exclusión de promedios evaluativos verificados.');
