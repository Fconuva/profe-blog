'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const b=require('../api/_paes-foundations');let total=0;const issues=[];
for(const g of b.guides){
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
 }
}
if(issues.length){console.error(JSON.stringify(issues,null,2));throw Error(`${issues.length} claves son la alternativa más larga o empatan: revisar editorialmente.`);}
assert.equal(total,108);console.log('PAES 1–9: 108 reactivos, 54 de acceso guiado, 18 páginas, claves privadas y longitud de alternativas: OK.');
