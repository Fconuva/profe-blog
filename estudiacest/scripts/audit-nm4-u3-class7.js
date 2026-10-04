'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),base=path.join(root,'nm4/u3-clase7-manual-ilustrado');
const failures=[];const expect=(condition,message)=>{if(!condition)failures.push(message);};
const read=(file)=>fs.readFileSync(path.join(base,file),'utf8');
const main=read('index.html'),home=fs.readFileSync(path.join(root,'nm4/index.html'),'utf8');
const durations=[...main.matchAll(/data-minutes="(\d+)"/g)].map(x=>Number(x[1]));
expect(durations.length===10&&durations.reduce((a,b)=>a+b,0)===90,'La presentación debe tener diez pantallas y sumar 90 minutos.');
expect(main.includes('1 / 10'),'Contador de diez pantallas ausente.');
expect(main.includes('Esta página no recibe archivos ni registra entregas.'),'La modalidad de entrega presencial debe estar explícita.');
expect(main.includes('cuatro sesiones de 90 minutos')&&main.includes('primer borrador'),'El encargo es un proyecto extendido, no una entrega de una clase.');
const project=read('proyecto.html'),teacher=read('docente.html');
expect((project.match(/id="sesion-[1-4]"/g)||[]).length===4,'Deben estar operativas las cuatro etapas del proyecto.');
expect((teacher.match(/data-project-session="[1-4]" data-total-minutes="90"/g)||[]).length===4,'Deben existir cuatro sesiones de 90 minutos planificadas.');
const stages=[...main.matchAll(/data-stage="([a-z]+)"/g)].map(x=>x[1]);
expect(stages.join(',')==='inicio,inicio,inicio,desarrollo,desarrollo,desarrollo,desarrollo,desarrollo,desarrollo,cierre'&&durations.slice(0,3).join(',')==='5,2,3'&&durations[9]===10,'Inicio en tres pantallas, modelado/práctica y cierre deben estar visibles y sumar 10/70/10 minutos.');
const presentationSlides=[...main.matchAll(/<section class="slide(?: active)?"([^>]*)>([\s\S]*?)<\/section>/g)];
expect(presentationSlides.slice(0,3).map(slide=>(slide[1].match(/data-opening="([a-z]+)"/)||[])[1]).join(',')==='activation,norms,objective'&&presentationSlides.slice(3).every(slide=>!slide[0].includes('data-opening=')),'Activación, normas y objetivo deben ocupar tres diapositivas distintas, en ese orden.');
expect(presentationSlides[1]?.[2].includes('<li>No se permite el uso de celular.</li>')&&!main.includes('No operen equipos: hoy trabajamos con textos e imágenes.'),'La diapositiva de normas debe mostrar la prohibición de celular solicitada.');
for(const session of [...teacher.matchAll(/<section class="reading" data-project-session="([1-4])" data-total-minutes="90">([\s\S]*?)<\/section>/g)]){
 const phases=[...session[2].matchAll(/data-phase="([a-z]+)" data-minutes="(\d+)"/g)];
 expect(phases.map(x=>x[1]).join(',')==='inicio,desarrollo,cierre'&&phases.map(x=>Number(x[2])).join(',')==='10,70,10',`Clase ${session[1]}: faltan las tres fases de 90 minutos.`);
 expect(session[2].includes('Objetivo:')&&session[2].includes('Comprobación:'),`Clase ${session[1]}: falta objetivo o comprobación.`);
 expect([...session[2].matchAll(/data-opening="([a-z]+)"/g)].map(x=>x[1]).join(',')==='activation,norms,objective',`Clase ${session[1]}: el inicio debe seguir activación, normas y objetivo.`);
 expect((session[2].match(/<li data-opening="norms">([\s\S]*?)<\/li>/)||[])[1]?.includes('No se permite el uso de celular.'),`Clase ${session[1]}: falta la norma de uso de celular.`);
 expect(session[2].includes('Modelamiento')&&session[2].includes('monitoreo')&&session[2].includes('data-closing="review"')&&session[2].includes('data-closing="synthesis"'),`Clase ${session[1]}: deben explicitarse modelamiento, monitoreo, revisión y sistematización/metacognición.`);
}
expect([...main.matchAll(/data-opening="([a-z]+)"/g)].map(x=>x[1]).join(',')==='activation,norms,objective'&&main.includes('data-monitoring')&&['review','synthesis','metacognition'].every(key=>main.includes(`data-closing="${key}"`)),'La presentación debe conservar la estructura didáctica acordada.');
const lessonObjective='Reescribir información técnica para un principiante, conservando su sentido y apoyándola con imágenes.';
for(const file of ['index.html','plantilla.html','docente.html'])expect(read(file).includes(`<span data-lesson-objective>${lessonObjective}</span>`),`${file}: debe mostrar el mismo objetivo en infinitivo.`);
for(const file of ['docente.html','plantilla.html','manual-final.html']){
 const objectives=[...read(file).matchAll(/<strong>Objetivo:<\/strong>\s*(?:<span[^>]*>)?([A-Za-zÁÉÍÓÚáéíóúñÑ]+)/g)].map(x=>x[1]);
 expect(objectives.length>0&&objectives.every(word=>/r$/i.test(word)),`${file}: los objetivos deben comenzar con un verbo en infinitivo.`);
}
expect((project.match(/class="lesson-result"/g)||[]).length===4&&(project.match(/<ol class="steps">/g)||[]).length===5,'La consigna abreviada debe conservar cuatro listas de acciones, un resultado por clase y las seis páginas.');
expect(teacher.includes('w3-article-91149.html')&&teacher.includes('w3-article-91150.html')&&teacher.includes('formación general'),'La planificación debe identificar OA 5 y OA 6 de Lengua y Literatura de 4° medio.');
expect(main.includes('Completen las hojas 1 y 2')&&main.includes('Completen la hoja 3')&&main.includes('Ejemplo de respuesta individual'),'Debe explicitarse dónde escribir en las tres hojas y un ejemplo de reflexión.');
expect(read('plantilla.html').includes('Muestren el borrador al docente y guárdenlo')&&!read('plantilla.html').includes('Entreguen estas dos páginas'),'El borrador se muestra y conserva; no es la entrega final.');
const guide=read('plantilla.html');
expect((guide.match(/class="school-letterhead"/g)||[]).length===3,'Las tres hojas del borrador deben llevar membrete institucional.');
for(const logo of ['insignia_talca_1.png','sdb-logo-big.png'])expect(guide.split(`src="/estudiantes/assets/${logo}"`).length-1===3,`El logo ${logo} debe estar en las tres hojas.`);
for(const element of ['CENTRO EDUCATIVO SALESIANOS TALCA','Departamento de Lengua y Literatura','Docente: Francisco Núñez','Integrantes del grupo:','Fecha:','Grupo:','Objetivo:','Instrucciones:','OA 5 y OA 6'])expect(guide.includes(element),`La guía imprimible debe conservar ${element}`);
expect((guide.match(/class="student-line"/g)||[]).length===3,'Deben existir tres espacios para identificar a los integrantes.');
expect(!/_{3}/.test(guide.replace(/<[^>]+>/g,''))&&!guide.includes('class="writing-space"'),'El borrador no debe usar guiones bajos ni líneas como fondos de impresión.');
expect((guide.match(/class="answer-lines part-function"/g)||[]).length===6&&(guide.match(/<tr><th scope="row">[1-6]<\/th>/g)||[]).length===6,'La tabla debe conservar seis partes y espacio para explicar su función.');
expect(read('manual.css').includes('.guide-sheet .answer-lines>span{display:block;height:7mm;border-bottom:.5pt solid'),'Los renglones del borrador deben ser bordes reales separados por 7 mm.');
for(const file of ['index.html','lectura.html','proyecto.html','docente.html'])expect(!/dos (?:hojas|páginas)/.test(read(file)),`${file}: quedó una referencia al borrador antiguo de dos hojas.`);
expect(read('modelo.html').includes('no formato final')&&read('manual-final.html').includes('Usen cajas y flechas.'),'El modelo debe distinguirse del producto final y enseñar la ruta de consulta.');
expect(!/firebase|<form|localStorage|sessionStorage/.test(main+read('manual.js')),'No se autorizó un login, formulario o guardado de estudiantes en esta clase.');
for(const page of ['index.html','lectura.html','plantilla.html','modelo.html','docente.html','proyecto.html','manual-final.html']){
 const html=read(page);expect(html.includes('<script src="/assets/anotar-pizarra.js" defer></script>'),`${page}: falta el panel táctil.`);
 expect(!/(?:src|href)="[^"?#]+\.svg(?:["?#])/.test(html),`${page}: sigue usando un SVG como imagen de la clase.`);
 for(const match of html.matchAll(/(?:src|href)="([^"?#]+)[^"]*"/g)){
  const url=match[1];if(/^(https?:|#)/.test(url)||url==='/nm4/')continue;
  const target=url.startsWith('/')?path.join(root,url.slice(1)):path.join(base,url);
  expect(fs.existsSync(target),`${page}: recurso ausente ${url}`);
 }
}
expect((read('plantilla.html').match(/class="sheet(?: [^"]*)?"/g)||[]).length===3,'El borrador debe tener tres páginas con espacio de escritura.');
expect((read('modelo.html').match(/class="sheet"/g)||[]).length===2,'El modelo debe tener dos páginas.');
const finalGuide=read('manual-final.html');
expect((finalGuide.match(/class="sheet(?: [^"]*)?"/g)||[]).length===6,'La plantilla final debe tener seis páginas.');
expect((finalGuide.match(/class="school-letterhead"/g)||[]).length===6&&(finalGuide.match(/class="student-line"/g)||[]).length===3&&!finalGuide.includes('class="writing-space"'),'La guía final debe tener membrete, identificación y renglones reales.');
for(const [file,kind] of [['plantilla.html','borrador'],['manual-final.html','final']])expect(read(file).includes(`data-course-pdf="${kind}"`),`${file}: falta el PDF listo para imprimir por curso.`);
const context={window:{}};vm.runInNewContext(read('contenidos.js'),context);const data=context.window.MANUAL_COURSES;
for(const course of ['4A','4B','4C','4E']){
 const item=data[course];expect(item?.sections.length===4,`${course}: lectura incompleta.`);expect(item?.parts.length===6,`${course}: deben existir seis partes del plano.`);
 expect(item?.vocabulary.length===4,`${course}: deben estar disponibles los cuatro términos del glosario.`);
 for(const key of ['photo','detail','diagram'])expect(fs.statSync(path.join(base,item[key])).size>1000,`${course}: recurso visual incompleto.`);
 expect(item.photo.endsWith('-ia.webp')&&item.diagram.endsWith('-ia.webp')&&item.credit.includes('IA'),`${course}: deben usarse y atribuirse las ilustraciones IA.`);
 expect(fs.existsSync(path.join(base,item.originalPhoto)),`${course}: se perdió la referencia real del fabricante.`);
 expect(item.source.startsWith('https://')&&item.reference,`${course}: falta fuente primaria.`);
 expect(home.includes(`/nm4/u3-clase7-manual-ilustrado/?curso=${course}`),`${course}: falta acceso en NM4.`);
 for(const kind of ['borrador','final']){const bytes=fs.readFileSync(path.join(base,'assets',`guia-${course.toLowerCase()}-${kind}.pdf`));expect(bytes.subarray(0,5).toString()==='%PDF-'&&bytes.length>100000,`${course}/${kind}: PDF imprimible ausente o inválido.`);}
}
for(const specialty of ['industrial','automotriz','tecnico','electronica'])expect(home.includes(`/nm4/u3-clase6-informe-${specialty}/informe/`),`Se perdió el informe ${specialty}.`);
const manifest=JSON.parse(fs.readFileSync(path.join(root,'scripts/academic-release-manifest.json'),'utf8'));
for(const logo of ['insignia_talca_1.png','sdb-logo-big.png'])expect(manifest.criticalFiles.some(entry=>entry.path===`estudiantes/assets/${logo}`),`Logo institucional sin registro crítico: ${logo}`);
const receipt=JSON.parse(read('assets/imagenes-ia.json'));const hashes=new Set();
expect(receipt.provider==='image_gen'&&receipt.mode==='built-in'&&receipt.images.length===9,'Deben estar guardadas nueve imágenes generadas con IA y sus prompts.');
for(const item of receipt.images){
 const bytes=fs.readFileSync(path.join(base,'assets',item.file));
 expect(bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WEBP'&&bytes.length>=50000&&bytes.length<250000,`${item.file}: formato o peso web inválido.`);
 expect(item.prompt&&item.sourceArtifact&&item.references.length,`${item.file}: falta trazabilidad.`);
 expect(item.callouts.join(',')===(item.file.startsWith('plano-')?'1,2,3,4,5,6':item.file.startsWith('linterna-')?'1,2,3,4':''),`${item.file}: numeración declarada incompatible.`);
 hashes.add(crypto.createHash('sha256').update(bytes).digest('hex'));
}
expect(hashes.size===9,'Las nueve imágenes IA deben ser distintas.');
const files=fs.readdirSync(base,{recursive:true}).filter(file=>fs.statSync(path.join(base,file)).isFile());
for(const file of files)expect(manifest.criticalFiles.some(entry=>entry.path===`nm4/u3-clase7-manual-ilustrado/${file.replaceAll('\\','/')}`),`Recurso crítico sin registro: ${file}`);
expect(Object.keys(data).length===4,'Los cuatro cursos deben tener materiales propios.');
expect(read('manual.js').includes('Object.hasOwn(window.MANUAL_COURSES'),'La selección debe validar los cuatro cursos y evitar caer en otro curso.');
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log(`Manual ilustrado NM4 auditado: proyecto de 4 sesiones de 90 minutos, 10 pantallas con activación/normas/objetivo separados, 4 cursos, borrador de 3 páginas y manual final de 6, ${files.length} recursos y todos los informes conservados.`);
