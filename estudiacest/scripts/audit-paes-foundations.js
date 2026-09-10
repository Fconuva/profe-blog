'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const b=require('../api/_paes-foundations');let total=0;const issues=[];
const lessons=require('./paes-foundations-lessons');
const portal=fs.readFileSync(path.join(__dirname,'../paes/index.html'),'utf8');
assert(!portal.includes('<article class="ensayo-card" id="cardFundamentos">'),'Las guías iniciales no deben agruparse en una tarjeta');
const visualTitles=new Set();
const routing=JSON.parse(fs.readFileSync(path.join(__dirname,'../vercel.json'),'utf8'));
assert(routing.redirects.some(r=>r.source==='/api/_paes-foundations(.*)'&&r.destination==='/api/paes?action=private-source'&&r.permanent===false),'Falta bloqueo de descarga del banco editorial y variantes anterior al sistema de archivos');
for(const g of b.guides){
 const lesson=lessons[g.id];assert(lesson,`G${g.id}: falta enseñanza ampliada`);
 assert(JSON.stringify(lesson).split(/\s+/).length>=500,`G${g.id}: desarrollo didáctico demasiado breve`);
 assert.equal(lesson.concepts.length,3);assert.equal(lesson.strategy.length,4);
 assert(lesson.image.alt.length>80&&lesson.image.caption.length>80);
 const asset=fs.readFileSync(path.join(__dirname,`../paes/imagenes/fundamentos/guia${g.id}-estrategia.webp`));
 assert.equal(asset.toString('ascii',0,4),'RIFF');assert.equal(asset.toString('ascii',8,12),'WEBP');assert(asset.length>40000&&asset.length<300000,'Imagen ausente o peso inadecuado para celular');
 assert.equal((portal.match(new RegExp(`id="cardGuia${g.id}"`,'g'))||[]).length,1,'Cada guía debe tener una tarjeta propia');
 assert.equal(g.texts.length,2);assert.equal(g.texts[0].guided.length>0,true);
 for(const [s,t] of g.texts.entries()){
  assert.equal(t.questions.length,6);
  for(const [i,[task,stem,opts,reasons]] of t.questions.entries()){
   assert(b.tasks[task]);assert(stem.length>10);assert.equal(opts.length,4);assert.equal(new Set(opts).size,4);assert.equal(reasons.length,4);assert(reasons.every(x=>x.length>12));total++;
   if(opts[0].length>=Math.max(...opts.slice(1).map(x=>x.length)))issues.push({guide:g.id,q:s*6+i+1,options:opts});
  }
 }
 for(const guided of [false,true]){
  const publicData=b.publicGuide(g.id,guided);assert.equal(publicData.questions.length,guided?6:12);
  publicData.questions.forEach(q=>{assert.equal(Object.keys(q.opts).length,4);assert(!('answer' in q));assert(!('key' in q));assert(!('reasons' in q));});
  const html=fs.readFileSync(path.join(__dirname,`../paes/guia${g.id}${guided?'-guiada':''}.html`),'utf8');assert(html.includes('guia-foundations.js'));assert(html.includes('role="dialog"'));assert(!html.includes('undefined'));
  for(const token of ['Objetivo de la clase','¿Qué aprenderé a hacer?','Instrucciones de trabajo','reading-scheme','Activa lo que sabes','Cierre de la clase','practiceInstruction','independentInstruction'])assert(html.includes(token),`G${g.id}: falta ${token}`);
  assert.equal((html.match(/class="scheme-nodes"/g)||[]).length,1);
  for(const token of ['strategyTitle','Lee la imagen','Comprende los conceptos','Aplica la estrategia paso a paso','Sigue un ejemplo razonado','Comprueba y prepara la práctica','Pienso en voz alta','no evaluada',`imagenes/fundamentos/guia${g.id}-estrategia.webp`])assert(html.includes(token),`G${g.id}: falta ${token}`);
  assert(html.includes('width="1200" height="800" loading="lazy"'));
  assert.equal((html.match(/class="ai-teaching-figure"/g)||[]).length,1);
  assert.equal((html.match(/class="teaching-response"/g)||[]).length,2);
  assert(html.indexOf('lesson-expansion')<html.indexOf('id="practiceInstruction"'),'La enseñanza debe permanecer dentro del bloque modelado');
  if(!guided)visualTitles.add(html.match(/<figcaption>(.*?)<\/figcaption>/)[1]);
 }
}
assert.equal(visualTitles.size,9,'Cada guía necesita su propio esquema');
if(issues.length){console.error(JSON.stringify(issues,null,2));throw Error(`${issues.length} claves son la alternativa más larga o empatan: revisar editorialmente.`);}
assert.equal(total,108);console.log('PAES 1–9: 108 reactivos, 54 de acceso guiado, 18 páginas ampliadas, nueve imágenes IA, claves privadas y longitud de alternativas: OK.');
