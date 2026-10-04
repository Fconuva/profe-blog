'use strict';
// Genera los archivos imprimibles desde las mismas guías HTML, sin datos personales.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright'),{PDFDocument}=require('pdf-lib');
const root=path.resolve(__dirname,'..'),base='nm4/u3-clase7-manual-ilustrado';
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.pdf':'application/pdf'};
const completeOnly=process.argv.includes('--completa');
async function addReadingSheets(page,course){
 await page.evaluate(course=>{
  const item=window.MANUAL_COURSES[course],main=document.querySelector('main'),worksheets=[...main.querySelectorAll('.sheet')];
  const header=worksheets[0].querySelector('.school-letterhead'),footer=worksheets[0].querySelector('.sheet-footer');
  const node=(tag,text,className)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;};
  const sheet=(title)=>{const el=node('section',undefined,'sheet guide-sheet reading-guide');el.append(header.cloneNode(true),node('p',`Unidad 3 · Lectura y borrador · ${item.name} · Clase 1 · OA 5 y OA 6`,'sheet-meta guide-meta'),node('h1',title));return el;};
  const reading=sheet('1. Lean el texto');
  const objective=node('p',undefined,'guide-objective');objective.append(node('strong','Objetivo: '),node('span',document.querySelector('[data-lesson-objective]').textContent));reading.append(objective);
  reading.append(node('h2',item.equipment),node('p','Lean las cuatro secciones. Después completen las tres hojas del borrador. Reescriban con palabras propias; no copien párrafos.','guide-instructions'),node('p','Adaptación didáctica de documentación del fabricante. No es el manual original ni una autorización de uso.','reading-caption'));
  const text=node('div');text.dataset.reading='';
  for(const [title,content] of item.sections){const section=node('section');section.append(node('h2',title),node('p',content));text.append(section);}reading.append(text);
  reading.append(node('h2','Fuente de la lectura'),node('p',item.reference,'source'));
  const source=node('p',undefined,'source'),link=node('a',item.source);link.href=item.source;source.append(link);reading.append(source,footer.cloneNode(true));
  const reference=sheet('2. Observen y consulten');
  reference.append(node('p',item.equipment,'sheet-meta'),node('p','Usen el plano, las imágenes y el vocabulario para comprender la lectura y escribir sus respuestas.','guide-instructions'));
  const diagram=node('img',undefined,'diagram guide-diagram');diagram.src=item.diagram;diagram.alt=`Plano de identificación de ${item.equipment}`;reference.append(diagram,node('p','Esquema sin escala. No indica conexiones ni autoriza a operar el equipo.','reading-caption'));
  const parts=node('ol',undefined,'reading-parts');parts.dataset.parts='';for(const part of item.parts)parts.append(node('li',part));reference.append(parts,node('h2','Vocabulario de apoyo'));
  const vocabulary=node('table',undefined,'reading-vocabulary'),body=node('tbody');vocabulary.dataset.vocabulary='';
  for(const [word,definition] of item.vocabulary){const row=node('tr'),term=node('th',word);term.scope='row';row.append(term,node('td',definition));body.append(row);}vocabulary.append(body);reference.append(vocabulary);
  const images=node('div',undefined,'guide-images');
  for(const [key,alt,label] of [['photo',item.alt,'Imagen A · Equipo'],['detail',item.detailAlt,'Imagen B · Detalle']]){const figure=node('figure'),img=node('img');img.src=item[key];img.alt=alt;figure.append(img,node('figcaption',label));images.append(figure);}reference.append(images,node('p',item.credit,'source'),footer.cloneNode(true));
  worksheets.forEach((el,index)=>{el.querySelector('.guide-meta').textContent=`Borrador · Hoja ${index+1} de 3 · ${item.name} · OA 5 y OA 6`;});
  main.replaceChildren(reading,reference,...worksheets);
  [...main.querySelectorAll('.page-number')].forEach((el,index)=>{el.textContent=`Página ${index+1} de 5`;});
 },course);
 await page.waitForFunction(()=>[...document.images].every(img=>img.complete&&img.naturalWidth>0),{},{timeout:10000});
 const content=await page.evaluate(()=>({sections:document.querySelectorAll('[data-reading]>section').length,parts:document.querySelectorAll('.reading-parts>li').length,vocabulary:document.querySelectorAll('.reading-vocabulary tr').length,lines:document.querySelectorAll('.answer-lines>span').length}));
 if(content.sections!==4||content.parts!==6||content.vocabulary!==4||content.lines!==60)throw new Error(`${course}: lectura o respuestas incompletas ${JSON.stringify(content)}`);
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
  for(const course of ['4A','4B','4C','4E'])for(const [kind,file,pages] of jobs){
   await page.goto(`http://127.0.0.1:${server.address().port}/${base}/${file}?curso=${course}`,{waitUntil:'networkidle'});
   if(kind==='completa')await addReadingSheets(page,course);
   await page.evaluate(()=>document.fonts.ready);await page.emulateMedia({media:'print'});
   const geometry=await page.evaluate(()=>({cuts:[...document.querySelectorAll('.sheet')].map(el=>({height:el.clientHeight,scroll:el.scrollHeight,footerGap:el.getBoundingClientRect().bottom-el.querySelector('.sheet-footer').getBoundingClientRect().bottom})),headers:document.querySelectorAll('.school-letterhead').length,contacts:[...document.querySelectorAll('.school-letterhead')].every(el=>el.querySelectorAll('.school-contact').length===4&&el.textContent.includes('cest@salesianostalca.cl')),footers:[...document.querySelectorAll('.sheet')].every(el=>{const footer=el.querySelector('.sheet-footer');return !!footer?.querySelector('.school-motto')&&footer.getBoundingClientRect().bottom<=el.getBoundingClientRect().bottom-parseFloat(getComputedStyle(el).paddingBottom)+2;}),images:[...document.images].every(img=>img.complete&&img.naturalWidth>0),rulers:[...document.querySelectorAll('.answer-lines>span')].every(el=>el.getBoundingClientRect().height>=26&&getComputedStyle(el).borderBottomStyle==='solid')}));
   if(geometry.headers!==pages||!geometry.contacts||!geometry.footers||!geometry.images||!geometry.rulers||geometry.cuts.some(el=>el.scroll>el.height+2))throw new Error(`${course}/${kind}: geometría inválida ${JSON.stringify(geometry)}`);
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
