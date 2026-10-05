'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const exists = relative => fs.existsSync(path.join(root, relative));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const pagePath = 'estudiantes/guia-u3-s12-entrevista.html';
const page = read(pagePath);
const client = read('estudiantes/js/simce-u3s12.js');
const backend = read('api/_simce-u3s12.js');
const router = read('api/estudiantes.js');
const slides = read('estudiantes/simce-u3-clase12-entrevista/index.html');
const teacher = read('estudiantes/simce-u3-clase12-entrevista/docente.html');
const printGuide = read('estudiantes/simce-u3-clase12-entrevista/guia-imprimible.html');
const dashboard = read('estudiantes/dashboard.html');
const admin = read('estudiantes/adminprofe/index.html');
const personalIndex = read('estudiantes/apoyo-personal/index.html');
const personalClient = read('estudiantes/apoyo-personal/sesiones.js');
const personalServer = read('api/_simce-personal-guided-catalog.js');
const contract = JSON.parse(read('scripts/class-submission-contract.json'));
const manifest = JSON.parse(read('scripts/academic-release-manifest.json'));

const objective = 'Analizar cómo las preguntas y respuestas construyen el propósito, la postura y la información de una entrevista, fundamentando cada interpretación con evidencia textual.';
expect(page.includes(objective) && teacher.includes(objective), 'El objetivo no coincide entre guía y planificación.');
expect(page.includes('Miércoles 7 de octubre de 2026') && teacher.includes('Miércoles 7 de octubre de 2026'), 'Falta la fecha explícita de aplicación.');
expect(page.includes('2°A HC · 2°B HC') && teacher.includes('2°A HC y 2°B HC'), 'Faltan ambos cursos en los materiales.');
expect((page.match(/data-question="q\d+"/g) || []).length === 24, 'La guía no contiene exactamente 24 preguntas.');
expect((page.match(/class="skill">LOCALIZAR/g) || []).length === 5, 'La guía debe contener 5 ítems de Localizar.');
expect((page.match(/class="skill">INTERPRETAR/g) || []).length === 12, 'La guía debe contener 12 ítems de Interpretar.');
expect((page.match(/class="skill">REFLEXIONAR/g) || []).length === 7, 'La guía debe contener 7 ítems de Reflexionar.');
expect((page.match(/data-reading="texto\d"/g)||[]).length===3, 'La clase debe tener tres entrevistas completas, no una lectura única.');
expect(['g1','g2','a1','a2','a3','a4'].every(id=>page.includes(`id="${id}"`) && client.includes(`'${id}'`) && backend.includes(`'${id}'`)), 'Los seis productos no están integrados al guardado.');
expect(page.includes('Cita un fragmento breve de cada texto') && page.includes('Reescribe dos titulares'), 'Faltan comparación intertextual y transferencia editorial.');
expect(page.includes('Texto original de carácter ficticio creado para esta clase'), 'La entrevista no declara su carácter original y ficticio.');
expect(page.includes('ATENCIÓN') && page.includes('A falla'), 'Falta el modelamiento con análisis de distractores.');
expect(page.includes('id="m1"') && !page.includes('id="m2"') && !page.includes('id="m3"'), 'El cierre debe tener una sola pregunta.');
expect(page.includes('Confirmar y entregar') && page.includes('Entrega confirmada'), 'Faltan el botón o el mensaje inequívoco de entrega.');
expect(page.includes('prefers-reduced-motion') && page.includes('@media(max-width:760px)'), 'Faltan ajustes de accesibilidad o respuesta móvil.');
expect(page.includes('/estudiantes/assets/u3s12/entrevista-hero-ia.png') && exists('estudiantes/assets/u3s12/entrevista-hero-ia.png'), 'Falta la ilustración IA en el proyecto.');
expect(['Conceptual','Procedimental','Actitudinal','Estrategia PARA'].every(text => page.includes(text)), 'La guía no explicita los tres dominios y la estrategia PARA.');
expect(page.includes('/estudiantes/assets/u3s12/modelo-entrevista-para.mp4'), 'La guía no integra el video de modelado.');

expect(client.includes("const SESSION_ID = 'sesion-u3-12'"), 'El cliente no usa el sessionId canónico.');
expect(client.includes("callApi('simce-u3s12-save'") && client.includes("callApi('simce-u3s12-submit'"), 'Faltan guardado y entrega por API.');
expect(client.includes("attempt.submitted !== true") && client.includes("attempt.completada !== true"), 'La entrega no relee ambas marcas canónicas.');
expect(client.includes('let saveQueue = Promise.resolve()') && client.includes('await saveQueue'), 'El autoguardado no está serializado con la entrega.');
expect(client.includes('Tu avance no se perdió'), 'Falta recuperación visible ante error de entrega.');
expect(!client.includes('ANSWER_KEY'), 'La clave no puede exponerse en el cliente.');
expect(backend.includes("const SESSION_ID = 'sesion-u3-12'"), 'El backend no usa el sessionId canónico.');
expect(backend.includes("q1:'A'") && backend.includes("q12:'B'"), 'La pauta privada de 12 ítems está incompleta.');
expect(backend.includes('await db.ref(BASE).update(updates)'), 'Respuesta y resultado no se escriben atómicamente.');
expect(backend.includes("responseRef.child('submitted').once('value')") && backend.includes("responseRef.child('completada').once('value')"), 'El backend no relee ambas marcas canónicas.');
expect(backend.includes('session.resultados_visibles === true'), 'El resultado no está protegido por liberación docente.');
expect(router.includes("action.startsWith('simce-u3s12-')") && router.includes('SIMCE_U3S12.manejar'), 'La API unificada no enruta la Clase 12.');

const priorIndex = slides.indexOf('1. Conocimientos previos');
const rulesIndex = slides.indexOf('2. Reglas de trabajo');
const objectiveIndex = slides.indexOf('3. Objetivo');
expect(priorIndex >= 0 && priorIndex < rulesIndex && rulesIndex < objectiveIndex, 'Las tres diapositivas iniciales no están en el orden obligatorio.');
expect(slides.includes('I Do') && slides.includes('We Do') && slides.includes('You Do'), 'La presentación no contiene la liberación gradual de responsabilidad.');
expect(slides.includes('CFU 1') && slides.includes('CFU 2') && slides.includes('80 %'), 'La presentación no contiene controles de comprensión y umbral de avance.');
expect(slides.includes('Revisemos un distractor') && slides.includes('Lo que me llevo'), 'La presentación no cierra con revisión y sistematización.');
expect(teacher.includes('00:00–00:05') && teacher.includes('00:46–01:20') && teacher.includes('01:26–01:30'), 'La planificación no distribuye los 90 minutos de inicio a cierre.');
expect(teacher.includes('52 minutos de práctica del estudiante') && teacher.includes('18 guiados + 34 independientes'), 'La planificación no declara la práctica prevista.');
expect(teacher.includes('1784 palabras') && teacher.includes('todavía no una medición de aplicación'), 'Debe distinguir carga material comprobada de tiempo estimado.');
expect(['Conceptual','Procedimental','Actitudinal','Estrategia PARA'].every(text => teacher.includes(text)), 'La planificación no alinea dominios y procedimiento.');
expect(printGuide.includes('Nombre y apellido') && printGuide.includes('Curso') && printGuide.includes('Fecha'), 'La guía imprimible no tiene identificación completa.');
expect((printGuide.match(/Página \d+ de 17/g) || []).length === 17, 'La guía imprimible debe tener sus 17 páginas numeradas.');
expect(/min-height:\s*10mm/.test(printGuide) && /\.lines\s*\{[\s\S]*?height:\s*34mm/.test(printGuide), 'Los campos y espacios de respuesta imprimibles son insuficientes.');
expect(['Conceptual','Procedimental','Actitudinal','Precisar la tarea','Apoyar y descartar'].every(text => printGuide.includes(text)), 'La guía imprimible no enseña los dominios y PARA.');
expect(exists('estudiantes/simce-u3-clase12-entrevista/guia-imprimible.pdf'), 'Falta el PDF A4 de la guía imprimible.');

expect(dashboard.includes("'sesion-u3-12'") && dashboard.includes("fecha_aplicacion:'2026-10-07'"), 'El dashboard no registra la Clase 12.');
expect(dashboard.includes("link_guia:'/estudiantes/guia-u3-s12-entrevista.html'"), 'El dashboard no enlaza la guía correcta.');
expect(!dashboard.includes('<div class="session-num">12</div>'), 'La Clase 12 sigue duplicada como tarjeta futura.');
expect(admin.includes("'sesion-u3-12'") && admin.includes("formato_panel:'forma-p-entrevista'"), 'El admin no registra la Clase 12.');
expect(admin.includes("pregunta_orienta:'Cierre · cómo orienta una pregunta'"), 'El admin no rotula el cierre de la entrevista.');
expect(contract.files.some(entry => entry.path === pagePath && entry.storage === 'api' && entry.backend === 'api/_simce-u3s12.js'), 'La Clase 12 no está en el contrato de entrega.');
expect(manifest.criticalFiles.some(entry => entry.path === pagePath && entry.contains === 'La entrevista'), 'La guía no está protegida por el manifiesto académico.');
expect(manifest.criticalFiles.some(entry => entry.path === 'estudiantes/assets/u3s12/entrevista-hero-ia.png'), 'La ilustración no está protegida por el manifiesto académico.');
expect(manifest.criticalFiles.some(entry => entry.path === 'estudiantes/assets/u3s12/modelo-entrevista-para.mp4'), 'El video de modelado no está protegido por el manifiesto académico.');

expect(personalIndex.includes('actividad.html?sesion=12'), 'La ruta personal no muestra la Sesión 12.');
expect(personalClient.includes("version: 'simce-personal-u3-s2-s12-v1'"), 'El catálogo personal no declara cobertura hasta la Sesión 12.');
expect(personalClient.includes("sessionId: 'personal-u3-12-entrevista'"), 'Falta la actividad personal de entrevista en el cliente.');
expect(personalServer.includes("id: 'personal-u3-12-entrevista'"), 'Falta la pauta privada personal de la Sesión 12.');

for (const [name, source] of [['guía', page], ['presentación', slides]]) {
  const inlineScripts = [...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match => match[1]).filter(script => script.trim());
  inlineScripts.forEach((script, index) => { try { new Function(script); } catch (error) { failures.push(`Script ${index + 1} de ${name} inválido: ${error.message}`); } });
}

if (failures.length) {
  console.error('Auditoría SIMCE U3S12 incumplida:\n- ' + failures.join('\n- '));
  process.exit(1);
}

console.log('SIMCE U3S12 auditada: tres entrevistas, 1784 palabras, 24 ítems 5/12/7, seis productos escritos guardables, comparación y transferencia; 90 minutos previstos sin afirmar validación de aula; entrega API y PDF A4 de 17 páginas.');
