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
const personalIndex = read('estudiantes/apoyo-personal/index.html');
const personalClient = read('estudiantes/apoyo-personal/sesiones.js');
const personalServer = read('api/_simce-personal-guided-catalog.js');
const contract = JSON.parse(read('scripts/class-submission-contract.json'));
const manifest = JSON.parse(read('scripts/academic-release-manifest.json'));

expect(page.includes('Noticia y diálogo dramático'), 'Falta el foco visible en las dos transformaciones textuales.');
expect(page.includes('El puente de cartón') && page.includes('La última página'), 'Faltan los dos relatos de origen.');
expect((page.match(/Texto original creado para esta clase/g) || []).length === 2, 'Cada relato debe declarar su origen.');
expect(page.includes('<h2>1. Relato para la noticia</h2>') && page.includes('<h2>4. Escribe y entrega</h2>'), 'La secuencia visual no contiene los cuatro bloques esenciales.');
expect(page.includes('<h3>Relato</h3>') && page.includes('<h3>Noticia</h3>'), 'Falta el modelo breve de transformación.');
expect(page.includes('el hecho principal aparece primero') && page.includes('el tono es objetivo') && page.includes('la información se mantiene'), 'El modelo no explica las decisiones principales de reescritura.');
expect(page.includes('No inventes nombres, fechas, lugares ni opiniones'), 'Falta la regla explícita contra la invención de datos.');
expect(page.includes('140 y 220 palabras'), 'Falta una extensión clara para el producto final.');
expect(page.includes('100 a 160 palabras') && page.includes('al menos dos acotaciones entre paréntesis') && page.includes('No uses narrador'), 'Falta la consigna completa del diálogo dramático.');
expect(!page.includes('hero-badges') && !page.includes('quick-nav') && !page.includes('class="timeline"'), 'La apertura conserva elementos visuales eliminados por decisión docente.');
expect(!page.includes('id="ruta"') && !page.includes('id="comparacion"') && !page.includes('id="planifica"'), 'La página conserva secciones introductorias o de planificación eliminadas.');
expect(!page.includes('plan-que') && !page.includes('plan-quien') && !page.includes('plan-donde') && !page.includes('plan-evidencia') && !page.includes('PLANNING_FIELDS'), 'La planificación eliminada todavía afecta la interfaz o la entrega.');
expect(page.includes('/estudiantes/assets/u3s11/partes-noticia-ia.webp'), 'Falta la infografía de las partes de la noticia.');
expect(page.includes('/estudiantes/assets/u3s11/partes-dialogo-dramatico-ia.webp'), 'Falta la infografía de las partes del diálogo dramático.');
expect((page.match(/Infografía creada con inteligencia artificial\./g) || []).length === 2, 'Las dos infografías deben declarar su origen con IA.');
expect(fs.existsSync(path.join(root, 'estudiantes/assets/u3s11/partes-noticia-ia.webp')), 'Falta el archivo de la infografía IA.');
expect(fs.existsSync(path.join(root, 'estudiantes/assets/u3s11/partes-dialogo-dramatico-ia.webp')), 'Falta el archivo de la infografía IA del diálogo dramático.');

const requiredFields = ['news-title','news-lead','news-body','drama-title','drama-body','close-preserved','close-transformed','close-improve'];
requiredFields.forEach(id => expect(page.includes(`id="${id}"`), `Falta el campo obligatorio ${id}.`));
expect(page.includes("const QUESTIONS=[{id:'noticia',fields:['news-title','news-lead','news-body']},{id:'dialogo',fields:['drama-title','drama-body']}];"), 'Los dos productos no están declarados en la entrega.');
expect(page.includes("const CLOSING_FIELDS=['close-preserved','close-transformed','close-improve'];"), 'Falta el cierre sobre decisiones de transformación.');
expect(page.includes('dialogo_dramatico:') && page.includes('noticia_transformada:'), 'El ticket docente no incluye ambos productos finales.');
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
expect(dashboard.includes("titulo:'Unidad 3 · Clase 11 — Noticia y diálogo dramático'"), 'El dashboard conserva el título anterior.');
expect(admin.includes("'sesion-u3-11'") && admin.includes("formato_panel:'transformacion-relato-generos'"), 'El admin no registra el formato de dos transformaciones de la Clase 11.');
expect(dashboard.includes("asignados:['2A-HC','2B-HC']"), 'La clase no está asignada a 2°A y 2°B HC.');
expect(admin.includes("noticia_transformada:'Producto final · noticia transformada'"), 'El admin no rotula la noticia final.');
expect(admin.includes("dialogo_dramatico:'Producto final · diálogo dramático'"), 'El admin no rotula el diálogo dramático.');
expect(admin.includes("transformo:'Revisión · cambio de género realizado'"), 'El admin no rotula la revisión de la transformación.');
expect(admin.includes("Number(r.total)===1?'producto':'productos'"), 'El admin no adapta el rótulo a la cantidad de productos.');
expect(admin.includes('if(sessions[sesId]?.formativa===true) continue;'), 'Los resultados formativos pueden contaminar un promedio evaluativo.');
expect(contract.files.some(entry => entry.path === pagePath && entry.storage === 'firebase-client'), 'La página no está registrada en el contrato de entrega.');
const manifestEntry = manifest.criticalFiles.find(entry => entry.path === pagePath);
expect(manifestEntry && manifestEntry.url === '/estudiantes/guia-u3-s11-evidencia-dos-textos.html', 'La página no está protegida por el manifiesto académico.');
expect(manifestEntry && manifestEntry.contains === 'Noticia y diálogo dramático', 'El manifiesto no exige el nuevo contenido.');
expect(manifest.criticalFiles.some(entry => entry.path === 'estudiantes/assets/u3s11/partes-noticia-ia.webp'), 'La infografía IA no está protegida por el manifiesto académico.');
expect(manifest.criticalFiles.some(entry => entry.path === 'estudiantes/assets/u3s11/partes-dialogo-dramatico-ia.webp'), 'La infografía IA del diálogo dramático no está protegida por el manifiesto académico.');
expect(personalIndex.includes('actividad.html?sesion=11'), 'La ruta personal no muestra la Sesión 11.');
expect(personalClient.includes("version: 'simce-personal-u3-s2-s11-v1'"), 'El catálogo personal no declara cobertura hasta la Sesión 11.');
expect(personalClient.includes("sessionId: 'personal-u3-11-transformacion-generos'"), 'Falta la actividad adaptada de la Sesión 11 en el cliente.');
expect(personalServer.includes("id: 'personal-u3-11-transformacion-generos'"), 'Falta la pauta privada de la Sesión 11 adaptada.');
expect(personalClient.includes('Noticia: titular, entrada y cuerpo') && personalClient.includes('Diálogo dramático: personajes, parlamentos y acotaciones'), 'La adaptación no conserva los dos géneros trabajados en la clase común.');

const inlineScripts = [...page.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match => match[1]).filter(source => source.trim());
inlineScripts.forEach((source, index) => {
  try { new Function(source); } catch (error) { failures.push(`Script embebido ${index + 1} inválido: ${error.message}`); }
});

if (failures.length) {
  console.error('Auditoría SIMCE U3S11 incumplida:\n- ' + failures.join('\n- '));
  process.exit(1);
}

console.log('SIMCE U3S11 auditada: apertura mínima, cuatro bloques, dos relatos originales, noticia, diálogo dramático, dos infografías IA, revisión, autoguardado, entrega atómica, panel docente y exclusión de promedios evaluativos verificados.');
