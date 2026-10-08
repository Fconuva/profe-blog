'use strict';
// La guía aprobada es la fuente del contenido proyectado; no se regenera su PDF.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),base='nm3/u3-clase5-verificar-caso';
async function generate(){
 const guide=fs.readFileSync(path.join(root,base,'guia.html'),'utf8');
 const browser=await chromium.launch({headless:true});let data;
 try{const page=await browser.newPage();data=await page.evaluate(html=>{
  const doc=new DOMParser().parseFromString(html,'text/html');
  const at=(n,q)=>{const el=doc.querySelector(`.sheet[data-page="${n}"] ${q}`);if(!el)throw Error(`Falta página ${n}: ${q}`);return el;};
  const copy=el=>{const c=el.cloneNode(true);c.querySelectorAll('.answer-lines').forEach(x=>x.remove());c.querySelectorAll('a').forEach(a=>{a.target='_blank';a.rel='noopener';});return c.outerHTML;};
  const questions={};for(const el of doc.querySelectorAll('.question,.box')){const n=el.textContent.trim().match(/^(\d+)\./)?.[1];if(n){const c=el.cloneNode(true);c.dataset.guideQuestion=n;questions[n]=copy(c);}}
  const nasa=at(3,'.box');
  const chat=at(5,'.whatsapp').cloneNode(true);chat.querySelectorAll('.chat-reply').forEach(x=>x.remove());
  const chatReplies=at(5,'.whatsapp').cloneNode(true);chatReplies.querySelector('.bubble:not(.chat-reply)').remove();
  const x=at(7,'.xpost:not(.official-post)').cloneNode(true);x.querySelectorAll('.reply:not(.comment-b)').forEach(el=>el.remove());
  const xReplies=at(7,'.xpost:not(.official-post)').cloneNode(true);const replies=[...xReplies.querySelectorAll('.reply:not(.comment-b)')].map(copy).join('');xReplies.querySelector('.post-body').innerHTML=replies;
  return {questions,objective:at(1,'.obj-row td:nth-child(2)').innerHTML,instructions:copy(at(1,'.instructions')),opening:copy(at(1,'figure')),instagram:copy(at(2,'.instagram')),nasaPhoto:copy(nasa.querySelector('.source-capture'))+copy(nasa.querySelector('.archive-image')),nasaResource:copy(nasa.querySelector('p')),nasaDates:copy(nasa.querySelector('.evidence-table')),nasaSource:copy(at(3,'.source')),chat:copy(chat),chatReplies:copy(chatReplies),d1:copy(at(5,'.official-post'))+copy(at(5,'.source')),x:copy(x),xReplies:copy(xReplies),s1:copy(at(7,'.official-post'))+copy(at(7,'.source'))};
 },guide);}finally{await browser.close();}
 const slides=[];
 const add=(title,page,stage,content,kind='')=>slides.push({title,page,stage,content,kind});
 const q=(...numbers)=>numbers.map(n=>{if(!data.questions[n])throw Error('Falta pregunta '+n);return data.questions[n];}).join('');
 add('Antes de leer',1,'inicio','<div class="illustrated-opening"><div class="oral-opening"><p class="big-question">¿Qué hace creíble un mensaje?</p><p>Observen dos casos reales y comenten.</p><button class="motivation-launch" id="start-motivation" type="button">▶ Ver videos con pausas</button><p class="oral-note">Conversación oral · No requiere otra respuesta escrita.</p></div><figure><img src="assets/comparar-imagenes-color.webp" alt="Ilustración de una lupa sobre dos fotografías con distintas nubes"></figure></div>','opening');
 add('Trabajamos en la guía',1,'inicio',data.instructions,'instructions-slide');
 add('Verificar antes de compartir',1,'inicio',`<div class="objective-layout"><p class="objective">${data.objective}</p><figure><img class="illustration opening-art" src="assets/fuente-fecha-color.webp" alt="Ilustración de una lupa sobre un documento junto a un calendario"></figure></div>`,'objective-slide');
 add('Datos para justificar una conclusión',1,'inicio','<div class="concepts"><p><strong>Afirmación:</strong> algo que el mensaje asegura y podemos comprobar.</p><p><strong>Evidencia:</strong> un dato o registro que ayuda a comprobar una afirmación.</p><p><strong>Fuente primaria:</strong> el registro original o quien produjo el dato; revisar si es competente para ese asunto.</p><p><strong>Conclusión:</strong> lo que podemos afirmar después de comparar el mensaje con las evidencias.</p></div><aside class="oral-model"><strong>Demostración oral:</strong> una noticia escolar dice «hoy», pero la ficha de la fotografía corresponde a otro año. La fecha del registro permite contrastar esa afirmación.</aside>','concept-slide');
 add('Caso 1 · La publicación',2,'casos',data.instagram,'instagram-slide');
 add('Caso 1 · Archivo de NASA',3,'casos',data.nasaResource+data.nasaPhoto,'photo-slide');
 add('Caso 1 · Fechas del registro',3,'casos',data.nasaDates+data.nasaSource,'source-slide');
 add('Caso 1 · Preguntas 1 y 2',4,'casos',q(1,2),'questions-slide');
 add('Caso 1 · Preguntas 3 a 5',4,'casos',q(3,4,5),'questions-slide');
 add('Caso 2 · El mensaje reenviado',5,'casos',data.chat,'chat-slide');
 add('Caso 2 · Respuestas del grupo',5,'casos',data.chatReplies,'chat-slide');
 add('Caso 2 · Fuente D1',5,'casos',data.d1,'official-slide');
 add('Caso 2 · Preguntas 6 y 7',6,'casos',q(6,7),'questions-slide');
 add('Caso 2 · Preguntas 8 a 10',6,'casos',q(8,9,10),'questions-slide');
 add('Caso 3 · Publicación A y comentario B',7,'casos',data.x,'social-slide');
 add('Caso 3 · Otras respuestas',7,'casos',data.xReplies,'social-slide');
 add('Caso 3 · Fuente S1',7,'casos',data.s1,'official-slide');
 add('Caso 3 · Preguntas 11 y 12',8,'casos',q(11,12),'questions-slide');
 add('Caso 3 · Preguntas 13 y 14',8,'casos',q(13,14),'questions-slide');
 add('Compara y explica el procedimiento',9,'procedimiento',q(16,17),'questions-slide');
 add('Plenario · Pregunta 15',9,'cierre',q(15)+'<p class="synthesis">Afirmación → Fuente y fecha → Evidencia → Conclusión</p>','closing-slide');
 const stageLabels={inicio:'Inicio: 10 min',casos:'Casos: 50 min.',procedimiento:'Procedimiento y revisión: 20 min.',cierre:'Al cierre · 10 min'};
 const rendered=slides.map((s,i)=>`<section class="slide${i===0?' active':''} ${s.kind}" id="diapositiva-${i+1}" data-guide-page="${s.page}" data-stage="${s.stage}" data-stage-label="${stageLabels[s.stage]}" aria-hidden="${i!==0}"${i?' hidden':''}><header class="slide-heading"><p class="guide-page">Guía · página ${s.page}</p><h1 tabindex="-1">${s.title}</h1></header><div class="slide-content">${s.content}</div><p class="paper-cue">${s.kind==='questions-slide'?`Responde en la página ${s.page} de tu guía.`:s.stage==='cierre'?'Respuesta oral. Apóyate en tus respuestas anteriores.':s.stage==='inicio'?'Trabajo en papel · Sin celular':`Lee y compara con la página ${s.page} de tu guía.`}</p></section>`).join('\n');
 const options=slides.map((s,i)=>`<option value="${i}">${i+1}. ${s.title} · p. ${s.page}</option>`).join('');
 const html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Verificar un caso real · Presentación y guía · NM3</title><meta name="description" content="Los mismos casos, fuentes, imágenes y preguntas de la guía impresa NM3, preparados para proyectar."><link rel="icon" href="/estudiantes/assets/logo-cest.png"><link rel="stylesheet" href="/assets/fonts/cest/fonts.css"><link rel="stylesheet" href="presentacion.css"><script src="presentacion.js" defer></script></head><body><header class="utility"><a href="/nm3/" class="brand"><img src="/estudiantes/assets/insignia_talca_1.png" alt="CEST">NM3 · Unidad 3 · Clase 5</a><span class="lesson-date">Viernes 9 de octubre de 2026</span><a href="assets/guia-verificar-caso-nm3.pdf" download>Guía PDF</a><a href="guia.html" target="_blank" rel="noopener">Ver guía</a></header><main class="deck" aria-label="Presentación espejo de la guía impresa">${rendered}</main><nav class="nav-bar" aria-label="Navegación de la presentación"><button id="prev" type="button" aria-label="Diapositiva anterior">←</button><span id="counter" aria-live="polite">1 / ${slides.length}</span><button id="next" type="button" aria-label="Diapositiva siguiente">Siguiente →</button><label class="jump-label"><span class="sr-only">Ir a una diapositiva</span><select id="jump">${options}</select></label><span id="stage">${stageLabels.inicio}</span><button id="fullscreen" type="button" aria-label="Pantalla completa">⛶</button></nav><dialog class="image-modal" id="image-modal" aria-label="Imagen ampliada"><button type="button" id="close-image" aria-label="Cerrar imagen ampliada">Cerrar ×</button><img id="large-image" alt=""></dialog><noscript><p>Abre la guía PDF para consultar todos los casos y preguntas.</p></noscript><script src="/assets/anotar-pizarra.js" defer></script></body></html>`;
 const motivation=`<dialog class="motivation-dialog" id="motivation-dialog" aria-labelledby="motivation-title"><header class="motivation-header"><div><p id="motivation-progress">Motivación</p><h2 id="motivation-title">Antes de compartir</h2></div><div class="motivation-controls"><button id="motivation-fullscreen" type="button" aria-label="Pantalla completa con preguntas">⛶</button><button id="motivation-close" type="button" aria-label="Cerrar videos">Cerrar ×</button></div></header><div class="motivation-layout"><div class="motivation-media"><video id="motivation-video" controls playsinline preload="none" controlslist="nofullscreen nodownload noremoteplayback" disablepictureinpicture aria-label="Fragmento del reportaje con audio original"></video></div><div class="motivation-conversation"><p class="motivation-question" id="motivation-question" aria-live="polite">Observen y comenten.</p><p class="motivation-note" id="motivation-note">Respuesta oral.</p><div class="motivation-actions"><button id="motivation-next" type="button" hidden>Continuar video →</button><button id="motivation-comment" type="button" hidden>Pausar y comentar</button><button id="motivation-repeat" type="button" disabled>Repetir fragmento</button></div></div></div><footer class="motivation-attribution"><p><a id="motivation-source" href="https://www.youtube.com/watch?v=XVssSLNp_xA" target="_blank" rel="noopener">Fuente original</a></p><p>Fragmentos de archivo de 2024 · Edición para esta clase. <a href="https://www.youtube.com/watch?v=XVssSLNp_xA" target="_blank" rel="noopener">TVN</a> · <a href="https://www.youtube.com/watch?v=xTWlL62PHhQ" target="_blank" rel="noopener">T13</a></p></footer></dialog>`;
 const withMotivation=html.replace('</head>','<link rel="stylesheet" href="motivacion.css"><script src="motivacion.js" defer></script></head>').replace('<noscript>',motivation+'<noscript>');
 fs.writeFileSync(path.join(root,base,'index.html'),withMotivation,'utf8');
 console.log(JSON.stringify({slides:slides.length,guidePages:9,questions:Object.keys(data.questions).length,guideSha:crypto.createHash('sha256').update(guide).digest('hex')}));
 return slides.length;
}
module.exports=generate;
if(require.main===module)generate().catch(e=>{console.error(e);process.exitCode=1});
