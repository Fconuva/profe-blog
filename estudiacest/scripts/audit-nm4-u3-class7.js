'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),base=path.join(root,'nm4/u3-clase7-manual-ilustrado');
const failures=[];const expect=(condition,message)=>{if(!condition)failures.push(message);};
const read=(file)=>fs.readFileSync(path.join(base,file),'utf8');
const main=read('index.html'),home=fs.readFileSync(path.join(root,'nm4/index.html'),'utf8');
const durations=[...main.matchAll(/data-minutes="(\d+)"/g)].map(x=>Number(x[1]));
expect(durations.length===9&&durations.reduce((a,b)=>a+b,0)===90,'La presentación debe tener nueve pantallas y sumar 90 minutos.');
expect(main.includes('1 / 9'),'Contador de nueve pantallas ausente.');
expect(main.includes('Trabajen en la guía impresa; no operen equipos.'),'La modalidad de trabajo presencial debe estar explícita.');
const project=read('proyecto.html'),teacher=read('docente.html');
expect((project.match(/id="sesion-[1-4]"/g)||[]).length===4,'Deben estar operativas las cuatro etapas del proyecto.');
expect((teacher.match(/data-project-session="[1-4]" data-total-minutes="90"/g)||[]).length===4,'Deben existir cuatro sesiones de 90 minutos planificadas.');
const stages=[...main.matchAll(/data-stage="([a-z]+)"/g)].map(x=>x[1]);
expect(stages.join(',')==='inicio,inicio,inicio,inicio,desarrollo,desarrollo,desarrollo,desarrollo,cierre'&&durations.join(',')==='0,5,2,3,0,5,10,55,10','Portada y separador sin tiempo adicional, inicio/modelado/actividad/cierre deben sumar 10/70/10 minutos.');
const presentationSlides=[...main.matchAll(/<section class="slide(?: [^"]*)?"([^>]*)>([\s\S]*?)<\/section>/g)];
const visibleText=html=>html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
expect(presentationSlides.length===9&&visibleText(presentationSlides[0]?.[2]||'')==='Manual ilustrado para un principiante','La primera diapositiva debe mostrar solamente el título de la clase.');
expect(presentationSlides.slice(1,4).map(slide=>(slide[1].match(/data-opening="([a-z]+)"/)||[])[1]).join(',')==='activation,norms,objective'&&presentationSlides.slice(4).every(slide=>!slide[0].includes('data-opening=')),'Después de la portada, pregunta inicial, normas y objetivo deben ocupar tres diapositivas distintas.');
expect(!visibleText(presentationSlides[1]?.[2]||'').includes('Activación')&&presentationSlides[1]?.[2].includes('¿Qué la hace entendible o fácil de comprender?')&&!main.includes('¿Qué la hace clara?'),'La segunda pantalla debe plantear la pregunta entendible sin el rótulo Activación.');
const phoneNorm='No se permite el uso de celular para juegos o redes sociales. Solo se permite para la actividad.';
expect(presentationSlides[2]?.[2].includes(`<li>${phoneNorm}</li>`)&&!main.includes('No operen equipos: hoy trabajamos con textos e imágenes.'),'La norma debe permitir el celular solamente para la actividad, no para juegos ni redes sociales.');
expect(!main.includes('Hoy harán el primer borrador')&&!main.includes('Formen tríos')&&!main.includes('Proyecto: cuatro sesiones de 90 minutos'),'Deben retirarse las instrucciones adicionales del objetivo.');
expect(visibleText(presentationSlides[4]?.[2]||'')==='ACTIVIDAD'&&presentationSlides[4]?.[1].includes('data-development="start"'),'El desarrollo debe comenzar con una diapositiva que diga solamente ACTIVIDAD.');
expect((main.match(/data-worksheet-instructions/g)||[]).length===1&&[...main.matchAll(/data-worksheet-page="([1-3])"/g)].map(x=>x[1]).join(',')==='1,2,3'&&presentationSlides[7]?.[2].includes('El docente entrega las tres hojas.'),'Las instrucciones de las hojas 1, 2 y 3 deben estar reunidas en una sola diapositiva.');
expect(!main.includes('Revisen con otro grupo')&&!main.includes('Intercambien los borradores'),'Debe retirarse la diapositiva de revisión entre grupos.');
const expectedClosure=[
 'Revisión o plenario: compartan una frase corregida. Comprueben que conserva la información y orienta al principiante.',
 'Sistematización: leer → identificar acción y riesgo → reescribir → comprobar.',
 'Metacognición: cada integrante escriba en su cuaderno qué frase cambió, por qué y cómo comprobó su sentido.',
 'Muestren las tres páginas y su duda al docente. Guarden el borrador para la clase 2.'
];
const closure=presentationSlides[8]?.[2]||'';
expect(visibleText(closure)==='Revisión y metacognición '+expectedClosure.join(' ')&&(closure.match(/<li(?:\s[^>]*)?>/g)||[]).length===4&&!/<details|<a\b|<p\b/.test(closure),'El cierre debe conservar solamente el título y las cuatro instrucciones solicitadas.');
for(const session of [...teacher.matchAll(/<section class="reading" data-project-session="([1-4])" data-total-minutes="90">([\s\S]*?)<\/section>/g)]){
 const phases=[...session[2].matchAll(/data-phase="([a-z]+)" data-minutes="(\d+)"/g)];
 expect(phases.map(x=>x[1]).join(',')==='inicio,desarrollo,cierre'&&phases.map(x=>Number(x[2])).join(',')==='10,70,10',`Clase ${session[1]}: faltan las tres fases de 90 minutos.`);
 expect(session[2].includes('Objetivo:')&&session[2].includes('Comprobación:'),`Clase ${session[1]}: falta objetivo o comprobación.`);
 expect([...session[2].matchAll(/data-opening="([a-z]+)"/g)].map(x=>x[1]).join(',')==='activation,norms,objective',`Clase ${session[1]}: el inicio debe seguir activación, normas y objetivo.`);
 expect((session[2].match(/<li data-opening="norms">([\s\S]*?)<\/li>/)||[])[1]?.includes(session[1]==='1'?phoneNorm:'No se permite el uso de celular.'),`Clase ${session[1]}: falta la norma de uso de celular correspondiente.`);
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
expect(main.includes('Completen la guía: hojas 1, 2 y 3')&&read('manual.js').includes('Anoten una duda')&&read('manual.js').includes('Registren la fuente'),'Debe explicitarse dónde escribir en las tres hojas, la duda y la fuente.');
expect(main.includes('src="guia-vistas.js"')&&main.includes('data-guide-preview')&&[...main.matchAll(/data-guide-page="([1-5])"/g)].map(x=>x[1]).join(',')==='1,2,3,4,5'&&main.includes('data-guide-markers'),'La misma diapositiva debe mostrar la guía real, sus cinco páginas y flechas numeradas.');
const previewContext={window:{}};vm.runInNewContext(read('guia-vistas.js'),previewContext);const previews=previewContext.window.MANUAL_GUIDE_PREVIEWS;
expect(previews?.generator==='pdftoppm + sharp'&&Object.keys(previews?.courses||{}).length===5,'Las vistas deben provenir de los PDF reales de los cinco cursos.');
for(const course of ['4A','4B','4C','4D','4E']){
 const item=previews?.courses[course];
 expect(item?.pages.length===5&&item.pdfSha256===crypto.createHash('sha256').update(fs.readFileSync(path.join(base,item.pdf))).digest('hex'),`${course}: la vista previa debe corresponder al PDF completo vigente.`);
 for(const [index,page] of (item?.pages||[]).entries()){
  const bytes=fs.readFileSync(path.join(base,page.file));
  expect(page.page===index+1&&page.file===`assets/guia-${course.toLowerCase()}-vista-${index+1}.webp`&&page.width===1200&&page.height>=1690&&page.height<=1700&&bytes.subarray(8,12).toString()==='WEBP'&&page.sha256===crypto.createHash('sha256').update(bytes).digest('hex'),`${course}/${index+1}: vista de página inválida o desactualizada.`);
  expect(page.markers.length===(index===0?4:3)&&page.markers.every((marker,number)=>marker.id===number+1&&marker.anchor&&marker.x>0&&marker.x<=94&&marker.y>0&&marker.y<100),`${course}/${index+1}: flechas fuera de la guía o sin sección de destino.`);
 }
}
expect(read('manual.js').includes('Lean y comprendan')&&read('manual.js').includes('Redacten las funciones')&&read('manual.js').includes('De dónde: ')&&read('manual.js').includes('No inventen un número.')&&read('manual.css').includes('.guide-pin::before'),'Debe distinguirse leer/comprender/redactar y explicar la fuente de cada respuesta mediante flechas.');
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
const institutionalContact=['TÉCNICO PROFESIONAL: 2 SUR 1147 – FONOS (71) 2615416 · 2615410','BÁSICA y LICEO: 11 ORIENTE 1751 – FONOS (71) 2615454 · 2615457','www.salesianostalca.cl – cest@salesianostalca.cl','TALCA - REGIÓN DEL MAULE - CHILE'];
const institutionalMotto='EDUCAR EVANGELIZANDO Y EVANGELIZAR EDUCANDO, MEDIANTE UNA FORMACIÓN CONTINUA Y DE CALIDAD';
for(const [file,pages] of [['plantilla.html',3],['manual-final.html',6]]){
 const html=read(file),headers=[...html.matchAll(/<header class="school-letterhead">([\s\S]*?)<\/header>/g)];
 expect(headers.length===pages&&headers.every(header=>institutionalContact.every(text=>header[1].includes(text))),`${file}: debe conservar completo el membrete del formato institucional del primer semestre.`);
 expect((html.match(/class="school-motto"/g)||[]).length===pages&&html.split(institutionalMotto).length-1===pages,`${file}: falta el lema institucional en una hoja.`);
}
expect((finalGuide.match(/class="sheet(?: [^"]*)?"/g)||[]).length===6,'La plantilla final debe tener seis páginas.');
expect((finalGuide.match(/class="school-letterhead"/g)||[]).length===6&&(finalGuide.match(/class="student-line"/g)||[]).length===3&&!finalGuide.includes('class="writing-space"'),'La guía final debe tener membrete, identificación y renglones reales.');
for(const [file,kind] of [['plantilla.html','borrador'],['manual-final.html','final']])expect(read(file).includes(`data-course-pdf="${kind}"`),`${file}: falta el PDF listo para imprimir por curso.`);
for(const file of ['lectura.html','plantilla.html'])expect(read(file).includes('data-course-pdf="completa"')&&read(file).includes('lectura y borrador (5 hojas)'),`${file}: falta la guía completa de lectura y respuestas.`);
const printGenerator=fs.readFileSync(path.join(root,'scripts/generate-nm4-manual-pdfs.js'),'utf8');
expect(fs.readFileSync(path.join(root,'.vercelignore'),'utf8').split(/\r?\n/).includes('!scripts/generate-nm4-manual-pdfs.js'),'El generador que lee la auditoría debe estar incluido explícitamente en el paquete de Vercel.');
for(const label of ['Identificación del grupo','Nombre y apellido','Fecha:','Grupo:','Objetivo','Instrucciones'])expect(printGenerator.includes(label),`La guía completa debe abrir con ${label}.`);
expect(printGenerator.includes('content.names!==3')&&printGenerator.includes('content.instructions!==4')&&printGenerator.includes('getBoundingClientRect().height>=26')&&printGenerator.includes('layout.boxes'),'La generación debe validar tres nombres, cuatro instrucciones y cuadros imprimibles con espacio de escritura.');
expect(read('manual.css').includes('.reading-guide .print-box{border:.6pt solid')&&read('manual.css').includes('.reading-guide .identity-name{height:8mm}'),'La guía completa debe tener cuadros de bordes reales y espacios de nombres de 8 mm.');
const context={window:{}};vm.runInNewContext(read('contenidos.js'),context);const data=context.window.MANUAL_COURSES;
for(const course of ['4A','4B','4C','4D','4E']){
 const item=data[course];expect(item?.sections.length===4,`${course}: lectura incompleta.`);expect(item?.parts.length===6,`${course}: deben existir seis partes del plano.`);
 expect(item?.vocabulary.length===4,`${course}: deben estar disponibles los cuatro términos del glosario.`);
 for(const key of ['photo','detail','diagram'])expect(fs.statSync(path.join(base,item[key])).size>1000,`${course}: recurso visual incompleto.`);
 expect(item.photo.endsWith('-ia.webp')&&item.diagram.endsWith('-ia.webp')&&item.credit.includes('IA'),`${course}: deben usarse y atribuirse las ilustraciones IA.`);
 expect(fs.existsSync(path.join(base,item.originalPhoto)),`${course}: se perdió la referencia real del fabricante.`);
 expect(item.source.startsWith('https://')&&item.reference,`${course}: falta fuente primaria.`);
 expect(home.includes(`/nm4/u3-clase7-manual-ilustrado/?curso=${course}`),`${course}: falta acceso en NM4.`);
 for(const kind of ['borrador','final','completa']){const bytes=fs.readFileSync(path.join(base,'assets',`guia-${course.toLowerCase()}-${kind}.pdf`));expect(bytes.subarray(0,5).toString()==='%PDF-'&&bytes.length>100000,`${course}/${kind}: PDF imprimible ausente o inválido.`);}
}
for(const specialty of ['industrial','automotriz','tecnico','electronica'])expect(home.includes(`/nm4/u3-clase6-informe-${specialty}/informe/`),`Se perdió el informe ${specialty}.`);
const manifest=JSON.parse(fs.readFileSync(path.join(root,'scripts/academic-release-manifest.json'),'utf8'));
for(const logo of ['insignia_talca_1.png','sdb-logo-big.png'])expect(manifest.criticalFiles.some(entry=>entry.path===`estudiantes/assets/${logo}`),`Logo institucional sin registro crítico: ${logo}`);
const receipt=JSON.parse(read('assets/imagenes-ia.json'));const hashes=new Set();
expect(receipt.provider==='image_gen'&&receipt.mode==='built-in'&&receipt.images.length===11,'Deben estar guardadas once imágenes generadas con IA y sus prompts.');
for(const item of receipt.images){
 const bytes=fs.readFileSync(path.join(base,'assets',item.file));
 expect(bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WEBP'&&bytes.length>=50000&&bytes.length<250000,`${item.file}: formato o peso web inválido.`);
 expect(item.prompt&&item.sourceArtifact&&item.references.length,`${item.file}: falta trazabilidad.`);
 expect(item.callouts.join(',')===(item.file.startsWith('plano-')?'1,2,3,4,5,6':item.file.startsWith('linterna-')?'1,2,3,4':''),`${item.file}: numeración declarada incompatible.`);
 hashes.add(crypto.createHash('sha256').update(bytes).digest('hex'));
}
expect(hashes.size===11,'Las once imágenes IA deben ser distintas.');
const files=fs.readdirSync(base,{recursive:true}).filter(file=>fs.statSync(path.join(base,file)).isFile());
for(const file of files)expect(manifest.criticalFiles.some(entry=>entry.path===`nm4/u3-clase7-manual-ilustrado/${file.replaceAll('\\','/')}`),`Recurso crítico sin registro: ${file}`);
expect(Object.keys(data).length===5,'Los cinco cursos deben tener materiales propios.');
expect(data['4D'].equipment.includes('Prusa MK4S')&&data['4D'].name==='4°D · Gráfica','4°D debe trabajar una impresora 3D en Gráfica.');
expect(data['4D'].parts.map(part=>part.split(':')[0]).join(',')==='Bobina de filamento,Extrusor,Boquilla,Lámina de impresión,Pantalla,Perilla de control','El plano de 4°D debe mantener la correspondencia de sus seis partes.');
expect(data['4D'].guidedAnswer.includes('seguir calientes')&&data['4D'].sections[3][1].includes('No inventen temperaturas'),'4°D debe conservar las advertencias y los límites de la adaptación.');
expect(read('manual.js').includes('Object.hasOwn(window.MANUAL_COURSES'),'La selección debe validar los cinco cursos y evitar caer en otro curso.');
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log(`Manual ilustrado NM4 auditado: proyecto de 4 sesiones de 90 minutos, 9 pantallas con portada, inicio separado, ACTIVIDAD y tres hojas en una pantalla, 5 cursos, borrador de 3 páginas y manual final de 6, ${files.length} recursos y todos los informes conservados.`);
