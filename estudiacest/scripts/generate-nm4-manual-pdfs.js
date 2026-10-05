'use strict';
// Genera los archivos imprimibles desde las mismas guías HTML, sin datos personales.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright'),{PDFDocument}=require('pdf-lib');
const root=path.resolve(__dirname,'..'),base='nm4/u3-clase7-manual-ilustrado';
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.pdf':'application/pdf'};
const completeOnly=process.argv.includes('--completa');
const requestedCourse=process.argv.find(value=>value.startsWith('--course='))?.slice(9);
const courses=['4A','4B','4C','4D','4E'];
if(requestedCourse&&!courses.includes(requestedCourse))throw new Error('Curso no válido.');
async function addReadingSheets(page,course){
 await page.evaluate(course=>{
  const item=window.MANUAL_COURSES[course],main=document.querySelector('main'),worksheets=[...main.querySelectorAll('.sheet')];
  const header=worksheets[0].querySelector('.school-letterhead'),footer=worksheets[0].querySelector('.sheet-footer');
  const node=(tag,text,className)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;};
  const sheet=(title)=>{const el=node('section',undefined,'sheet guide-sheet reading-guide');el.append(header.cloneNode(true),node('p',`Unidad 3 · Lectura y borrador · ${item.name} · Clase 1 · OA 5 y OA 6`,'sheet-meta guide-meta'),node('h1',title));return el;};
  const box=(title)=>{const el=node('section',undefined,'print-box');el.append(node('h2',title,'print-box-title'));return el;};
  const reading=sheet('Guía de lectura y borrador');
  const identification=box('Identificación del grupo');identification.classList.add('print-identification');
  const identityTable=node('table',undefined,'identity-table'),identityBody=node('tbody');
  for(let number=1;number<=3;number++){const row=node('tr'),label=node('th',`Nombre y apellido ${number}`);label.scope='row';row.append(label,node('td',undefined,'identity-name'));identityBody.append(row);}
  const details=node('tr'),courseLabel=node('th','Curso');courseLabel.scope='row';
  const fields=node('td',undefined,'identity-details');fields.append(node('strong',item.name),node('span','Fecha: ____ / ____ / ______'),node('span','Grupo: ______'));
  details.append(courseLabel,fields);identityBody.append(details);identityTable.append(identityBody);identification.append(identityTable);reading.append(identification);
  const objective=box('Objetivo');objective.classList.add('print-objective');objective.append(node('p',document.querySelector('[data-lesson-objective]').textContent));reading.append(objective);
  const instructions=box('Instrucciones');instructions.classList.add('print-instructions');
  const steps=node('ol');for(const instruction of ['Trabajen en grupos de tres. Escriban sus nombres, curso, fecha y número de grupo.','Lean el texto de esta hoja y observen los recursos de la página 2.','Completen las páginas 3, 4 y 5 con palabras propias. No copien párrafos.','Muestren el borrador al docente y guárdenlo para la clase 2. No operen equipos.'])steps.append(node('li',instruction));instructions.append(steps);reading.append(instructions);
  reading.append(node('h2',`1. Texto para leer · ${item.equipment}`,'reading-title'),node('p','Adaptación didáctica de documentación del fabricante. No es el manual original ni una autorización de uso.','reading-caption'));
  const text=node('div');text.dataset.reading='';
  for(const [title,content] of item.sections){const section=box(title);section.append(node('p',content));text.append(section);}reading.append(text);
  reading.append(node('p',`Fuente de la lectura: ${item.reference}`,'source'));
  const source=node('p',undefined,'source'),link=node('a',item.source);link.href=item.source;source.append(link);reading.append(source,footer.cloneNode(true));
  const reference=sheet('2. Observen y consulten');
  reference.append(worksheets[1].querySelector('.guide-continuation').cloneNode(true),node('p',item.equipment,'sheet-meta'),node('p','Usen el plano, las imágenes y el vocabulario para comprender la lectura y escribir sus respuestas.','guide-instructions'));
  const plan=box('Plano y partes del equipo');
  const diagram=node('img',undefined,'diagram guide-diagram');diagram.src=item.diagram;diagram.alt=`Plano de identificación de ${item.equipment}`;plan.append(diagram,node('p','Esquema sin escala. No indica conexiones ni autoriza a operar el equipo.','reading-caption'));
  const parts=node('ol',undefined,'reading-parts');parts.dataset.parts='';for(const part of item.parts)parts.append(node('li',part));plan.append(parts);reference.append(plan);
  const glossary=box('Vocabulario de apoyo');
  const vocabulary=node('table',undefined,'reading-vocabulary'),body=node('tbody');vocabulary.dataset.vocabulary='';
  for(const [word,definition] of item.vocabulary){const row=node('tr'),term=node('th',word);term.scope='row';row.append(term,node('td',definition));body.append(row);}vocabulary.append(body);glossary.append(vocabulary);reference.append(glossary);
  const visualBox=box('Imágenes para explicar');
  const images=node('div',undefined,'guide-images');
  for(const [key,alt,label] of [['photo',item.alt,'Imagen A · Equipo'],['detail',item.detailAlt,'Imagen B · Detalle']]){const figure=node('figure'),img=node('img');img.src=item[key];img.alt=alt;figure.append(img,node('figcaption',label));images.append(figure);}visualBox.append(images);reference.append(visualBox,node('p',item.credit,'source'),footer.cloneNode(true));
  // La identificación completa está al inicio; las hojas siguientes conservan grupo y nombre.
  worksheets[0].querySelector('.guide-identification').replaceWith(worksheets[1].querySelector('.guide-continuation').cloneNode(true));
  worksheets.forEach((el,index)=>{el.querySelector('.guide-meta').textContent=`Borrador · Hoja ${index+1} de 3 · ${item.name} · OA 5 y OA 6`;});
  main.replaceChildren(reading,reference,...worksheets);
  [...main.querySelectorAll('.sheet')].forEach(el=>el.classList.add('complete-guide'));
  [...main.querySelectorAll('.page-number')].forEach((el,index)=>{el.textContent=`Página ${index+1} de 5`;});
 },course);
 await page.waitForFunction(()=>[...document.images].every(img=>img.complete&&img.naturalWidth>0),{},{timeout:10000});
 const content=await page.evaluate(()=>({sections:document.querySelectorAll('[data-reading]>section').length,parts:document.querySelectorAll('.reading-parts>li').length,vocabulary:document.querySelectorAll('.reading-vocabulary tr').length,lines:document.querySelectorAll('.answer-lines>span').length,names:document.querySelector('.sheet').querySelectorAll('.identity-name').length,objective:document.querySelector('.sheet .print-objective p')?.textContent.startsWith('Reescribir '),instructions:document.querySelectorAll('.sheet:first-child .print-instructions li').length,continuations:document.querySelectorAll('.guide-continuation').length}));
 if(content.sections!==4||content.parts!==6||content.vocabulary!==4||content.lines!==60||content.names!==3||!content.objective||content.instructions!==4||content.continuations!==4)throw new Error(`${course}: identificación, lectura o respuestas incompletas ${JSON.stringify(content)}`);
}
async function main(){
 const server=http.createServer((req,res)=>{
  const target=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  if(!target.startsWith(root+path.sep)||!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404);return res.end();}
  res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream'});fs.createReadStream(target).pipe(res);
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;const generated=[];
 try{
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  const jobs=completeOnly?[['completa','plantilla.html',5]]:[['borrador','plantilla.html',3],['final','manual-final.html',6],['completa','plantilla.html',5]];
  for(const course of requestedCourse?[requestedCourse]:courses)for(const [kind,file,pages] of jobs){
   await page.goto(`http://127.0.0.1:${server.address().port}/${base}/${file}?curso=${course}`,{waitUntil:'networkidle'});
   if(kind==='completa')await addReadingSheets(page,course);
   await page.evaluate(()=>document.fonts.ready);await page.emulateMedia({media:'print'});
   const geometry=await page.evaluate(()=>({cuts:[...document.querySelectorAll('.sheet')].map(el=>({height:el.clientHeight,scroll:el.scrollHeight,footerGap:el.getBoundingClientRect().bottom-el.querySelector('.sheet-footer').getBoundingClientRect().bottom})),headers:document.querySelectorAll('.school-letterhead').length,contacts:[...document.querySelectorAll('.school-letterhead')].every(el=>el.querySelectorAll('.school-contact').length===4&&el.textContent.includes('cest@salesianostalca.cl')),footers:[...document.querySelectorAll('.sheet')].every(el=>{const footer=el.querySelector('.sheet-footer');return !!footer?.querySelector('.school-motto')&&footer.getBoundingClientRect().bottom<=el.getBoundingClientRect().bottom-parseFloat(getComputedStyle(el).paddingBottom)+2;}),images:[...document.images].every(img=>img.complete&&img.naturalWidth>0),rulers:[...document.querySelectorAll('.answer-lines>span')].every(el=>el.getBoundingClientRect().height>=26&&getComputedStyle(el).borderBottomStyle==='solid')}));
   if(geometry.headers!==pages||!geometry.contacts||!geometry.footers||!geometry.images||!geometry.rulers||geometry.cuts.some(el=>el.scroll>el.height+2))throw new Error(`${course}/${kind}: geometría inválida ${JSON.stringify(geometry)}`);
   if(kind==='completa'){
    const layout=await page.evaluate(()=>({names:[...document.querySelectorAll('.identity-name')].every(el=>el.getBoundingClientRect().height>=26&&el.getBoundingClientRect().width>=480),boxes:[...document.querySelectorAll('.print-box')].every(el=>getComputedStyle(el).borderTopStyle==='solid'),instructions:document.querySelector('.print-instructions').getBoundingClientRect().bottom<document.querySelector('[data-reading]').getBoundingClientRect().top,answers:[...document.querySelectorAll('.guide-task .answer-lines')].every(el=>el.getBoundingClientRect().width>=640)}));
    if(!layout.names||!layout.boxes||!layout.instructions||!layout.answers)throw new Error(`${course}: cuadros o espacios insuficientes ${JSON.stringify(layout)}`);
   }
   const pdf=await PDFDocument.load(await page.pdf({preferCSSPageSize:true,printBackground:false,displayHeaderFooter:false,scale:1}));
   if(pdf.getPageCount()!==pages)throw new Error(`${course}/${kind}: ${pdf.getPageCount()} páginas, se esperaban ${pages}`);
   pdf.setTitle(`Guía ${kind==='completa'?'de lectura y borrador':kind==='final'?'final':'del borrador'} del manual ilustrado · ${course} · CEST`);pdf.setAuthor('Centro Educativo Salesianos Talca · Francisco Núñez');pdf.setSubject('Lengua y Literatura · NM4 · Manual ilustrado');
   const target=path.join(root,base,'assets',`guia-${course.toLowerCase()}-${kind}.pdf`);const bytes=await pdf.save();fs.writeFileSync(target,bytes);
   generated.push({course,kind,pages,bytes:bytes.length});await page.emulateMedia({media:'screen'});
  }
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
 console.log(JSON.stringify({generated},null,2));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
