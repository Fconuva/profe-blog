'use strict';
// Contrato de apertura didáctica: complementa las auditorías de reactivos y entrega.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {render}=require('./generate-paes-teaching');
const lessons=require('./paes-continuity-teaching');
const root=path.resolve(__dirname,'..');
let count=0;
for(let id=1;id<=21;id++)for(const guided of [false,true]){
 const file=path.join(root,`paes/guia${id}${guided?'-guiada':''}.html`);
 if(guided&&id>=10&&id<=16){assert(!fs.existsSync(file),'Actualizar la auditoría si se construye esta ruta');continue;}
 const html=fs.readFileSync(file,'utf8');count++;
 if(id<=9){
  for(const token of ['Objetivo de la clase','workInstructions','lesson-expansion','Pienso en voz alta','teaching-response'])assert(html.includes(token),`${file}: falta ${token}`);
  assert.equal((html.match(/class="lesson-chapter"/g)||[]).length,4,file);
 }else{
  assert(html.includes(render(id,guided).trim()),`${file}: enseñanza desactualizada; ejecutar generate-paes-teaching.js`);
  assert.equal((html.match(/PAES_TEACHING_START/g)||[]).length,1,file);
  assert.equal((html.match(/css\/guia-teaching.css/g)||[]).length,1,file);
  assert.equal((html.match(/class="pt-chapter"/g)||[]).length,4,file);
  assert(!html.includes('class="pt-response" open'),'La respuesta formativa empieza cerrada');
  assert.equal(lessons[id].concepts.length,3);assert.equal(lessons[id].steps.length,4);assert.equal(lessons[id].model.length,4);assert.equal(lessons[id].practice.length,2);
  const words=JSON.stringify(lessons[id]).split(/\s+/).length;assert(words>=350,`G${id}: explicación demasiado breve (${words})`);
 }
}
const exam=fs.readFileSync(path.join(root,'paes/guia14.html'),'utf8');
assert(exam.includes('<template id="paesExamPreparation">'));
const app=fs.readFileSync(path.join(root,'paes/assets/guia14/guia14-app.js'),'utf8');
assert(app.includes("login.prepend(document.getElementById('paesExamPreparation').content.cloneNode(true))"));
const g21=fs.readFileSync(path.join(root,'paes/guia21.html'),'utf8');
assert(g21.indexOf('id="loginSection"')<g21.indexOf('PAES_TEACHING_START'));
assert(g21.indexOf('PAES_TEACHING_END')<g21.indexOf('<form id="loginForm">'));
assert(fs.readFileSync(path.join(root,'paes/css/guia-teaching.css'),'utf8').includes('summary:focus-visible'));
console.log(`PAES: apertura didáctica homogénea en ${count} páginas (21 regulares y 14 guiadas), cuatro capítulos y preparación de ensayos separada: OK.`);
