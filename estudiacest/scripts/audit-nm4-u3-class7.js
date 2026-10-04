'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),base=path.join(root,'nm4/u3-clase7-manual-ilustrado');
const failures=[];const expect=(condition,message)=>{if(!condition)failures.push(message);};
const read=(file)=>fs.readFileSync(path.join(base,file),'utf8');
const main=read('index.html'),home=fs.readFileSync(path.join(root,'nm4/index.html'),'utf8');
const durations=[...main.matchAll(/data-minutes="(\d+)"/g)].map(x=>Number(x[1]));
expect(durations.length===8&&durations.reduce((a,b)=>a+b,0)===90,'La presentación debe tener ocho pantallas y sumar 90 minutos.');
expect(main.includes('1 / 8'),'Contador de ocho pantallas ausente.');
expect(main.includes('Esta página no recibe archivos ni registra entregas.'),'La modalidad de entrega presencial debe estar explícita.');
expect(!/firebase|<form|localStorage|sessionStorage/.test(main+read('manual.js')),'No se autorizó un login, formulario o guardado de estudiantes en esta clase.');
for(const page of ['index.html','lectura.html','plantilla.html','modelo.html','docente.html']){
 const html=read(page);expect(html.includes('<script src="/assets/anotar-pizarra.js" defer></script>'),`${page}: falta el panel táctil.`);
 for(const match of html.matchAll(/(?:src|href)="([^"?#]+)[^"]*"/g)){
  const url=match[1];if(/^(https?:|#)/.test(url)||url==='/nm4/')continue;
  const target=url.startsWith('/')?path.join(root,url.slice(1)):path.join(base,url);
  expect(fs.existsSync(target),`${page}: recurso ausente ${url}`);
 }
}
expect((read('plantilla.html').match(/class="sheet"/g)||[]).length===2,'La plantilla debe tener dos páginas.');
expect((read('modelo.html').match(/class="sheet"/g)||[]).length===2,'El modelo debe tener dos páginas.');
const context={window:{}};vm.runInNewContext(read('contenidos.js'),context);const data=context.window.MANUAL_COURSES;
for(const course of ['4C','4E']){
 const item=data[course];expect(item?.sections.length===4,`${course}: lectura incompleta.`);expect(item?.parts.length===6,`${course}: deben existir seis partes del plano.`);
 for(const key of ['photo','detail','diagram'])expect(fs.statSync(path.join(base,item[key])).size>1000,`${course}: recurso visual incompleto.`);
 expect(item.source.startsWith('https://')&&item.reference,`${course}: falta fuente primaria.`);
 expect(home.includes(`/nm4/u3-clase7-manual-ilustrado/?curso=${course}`),`${course}: falta acceso en NM4.`);
}
for(const specialty of ['industrial','automotriz','tecnico','electronica'])expect(home.includes(`/nm4/u3-clase6-informe-${specialty}/informe/`),`Se perdió el informe ${specialty}.`);
const manifest=JSON.parse(fs.readFileSync(path.join(root,'scripts/academic-release-manifest.json'),'utf8'));
const files=fs.readdirSync(base,{recursive:true}).filter(file=>fs.statSync(path.join(base,file)).isFile());
for(const file of files)expect(manifest.criticalFiles.some(entry=>entry.path===`nm4/u3-clase7-manual-ilustrado/${file.replaceAll('\\','/')}`),`Recurso crítico sin registro: ${file}`);
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log(`Manual ilustrado NM4 auditado: 8 pantallas, 90 minutos, 2 cursos, 2 páginas por manual, ${files.length} recursos y todos los informes conservados.`);
