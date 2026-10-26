'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),source=path.join(root,'referencias/metodo-gdd-sm/clase1-vlog'),dest=path.join(root,'nm3/vlog-mi-vida');
const phases=[
 ['Inicio',0,8,1],['Lectura y ejemplo',8,20,'1–2'],['Planos y ángulos',20,32,'3–4'],['Observamos el vlog',32,47,5],['Analizamos con evidencia',47,65,5],['Reconocemos y elegimos',65,73,6],['Aplicamos a una escena',73,85,7],['Revisamos y cerramos',85,90,7]
].map(([name,start,end,page],id)=>({id,name,start,end,page,seconds:(end-start)*60}));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const P=s=>`<p>${s}</p>`;
const table=(heads,rows)=>`<table><thead><tr>${heads.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const image=(file,alt)=>`<img class="zoomable" src="assets/${file}.webp" alt="${alt}" tabindex="0" role="button" aria-label="Ampliar: ${alt}">`;
async function main(){
 fs.mkdirSync(path.join(dest,'assets'),{recursive:true});
 for(const file of ['escena-desayuno.webp','tipos-plano.webp','angulos.webp','ejercicio-planos.webp','guia-clase1-vlog-nm3.pdf'])fs.copyFileSync(path.join(source,'assets',file),path.join(dest,'assets',file));
 const approved=fs.readFileSync(path.join(source,'guia.html'),'utf8');
 const browser=await chromium.launch({headless:true});let pages;
 try{const page=await browser.newPage();await page.setContent(approved,{waitUntil:'domcontentloaded'});pages=await page.locator('.sheet').evaluateAll(es=>es.map(e=>({
  paragraphs:[...e.querySelectorAll(':scope > p')].map(x=>x.innerHTML),
  questions:[...e.querySelectorAll(':scope > .question')].map(x=>x.innerHTML),
  tables:[...e.querySelectorAll(':scope > .work-table')].map(t=>({heads:[...t.querySelectorAll('thead th')].map(x=>x.innerHTML),rows:[...t.querySelectorAll('tbody tr')].map(r=>[...r.children].map(c=>c.innerHTML))})),
  instructions:e.querySelector(':scope > .instructions p')?.innerHTML||'',
  reading:[...e.querySelectorAll('.reading p')].map(x=>x.innerHTML),
  heading:e.querySelector('.page-title')?.textContent||'',
  objective:e.querySelector('.obj-row td:last-child')?.textContent||''
 })));}finally{await browser.close();}
 if(pages.length!==7)throw Error('La guía fuente debe tener siete páginas');
 const [a,b,c,d,e,f,g]=pages,slides=[];
 const add=(phase,page,title,html,cue,kind='')=>slides.push({phase,page,title,html,cue,kind});
 add(0,1,'Mi vida en cinco minutos',`<p class="hero-question">${a.paragraphs[0]}</p><p>Clase 1 · Leemos, observamos y trabajamos con la guía.</p>`,'Tengan a mano la guía impresa, el cuaderno y un lápiz.','title');
 add(0,1,'Antes de comenzar',P(a.paragraphs[1])+a.questions.map(P).join(''),'Respondan en la guía y compartan una observación.');
 add(0,1,'Acuerdos para aprender juntos',P(a.paragraphs.at(-1))+P('No se permite el uso de celular durante el análisis, salvo indicación del profesor.'),'Escuchen, fundamenten y respeten las experiencias de otras personas.');
 add(0,1,'Objetivo de la clase',P(esc(a.objective)),'Al finalizar, justificarán cómo un encuadre aporta al relato.');
 add(1,1,'¿Qué es un vlog? ¿Quién comunica?',table(a.tables[0].heads,a.tables[0].rows.slice(0,2)),'Leemos los conceptos y los relacionamos con una experiencia cotidiana.');
 add(1,1,'Tema, mensaje y propósito',table(a.tables[0].heads,a.tables[0].rows.slice(2)),'Distingan el asunto, la idea y lo que se busca lograr.');
 b.reading.forEach((p,i)=>add(1,2,['Leemos · Qué historia se contará','Leemos · El guion visual','Leemos · Revisar la relación'][i],i===0?P(b.paragraphs[0])+`<div class="reading">${P(p)}</div>`:`<div class="reading">${P(p)}</div>`,'Sigan la lectura de la página 2. Adaptación de SM, GDD tomo 1, pp. 89–90.','reading-slide'));
 add(1,2,'Una escena, distintas decisiones',`<div class="visual-model">${image('escena-desayuno','Desayuno: contexto, acción y detalle')}${table(b.tables[0].heads,b.tables[0].rows)}</div>`,'Comparen qué información aporta cada encuadre. Ilustración didáctica de IA.','model');
 add(1,2,'De las imágenes a una idea',P(b.paragraphs.at(-2))+P(b.questions[0]),'Respondan la pregunta después de leer, en la página 2.');
 add(2,3,'El plano: cuánto mostramos',P(c.paragraphs[0]),'Relacionen el encuadre con la información que deja ver.');
 add(2,3,'Tamaños de plano',image('tipos-plano','Ocho tamaños de plano'),'Observen la lámina de la página 3. Toquen la imagen para ampliarla.','image');
 add(2,3,'Del entorno al cuerpo',table(c.tables[0].heads,c.tables[0].rows.slice(0,4)),'Comparen gran plano general, general, entero y americano.');
 add(2,3,'Del rostro al detalle',table(c.tables[0].heads,c.tables[0].rows.slice(4)),'Comparen qué cambia al acercar el encuadre.');
 add(2,3,'Del nombre a la intención',P(c.paragraphs.at(-2))+P(c.questions[0]),'Respondan al final de la página 3 y justifiquen.');
 add(2,4,'El ángulo: desde dónde miramos',P(d.paragraphs[0]),'Distingan el tamaño de plano de la posición de la cámara.');
 add(2,4,'Ángulos de cámara',image('angulos','Normal, picado, contrapicado, cenital, nadir e inclinado'),'Observen la lámina de la página 4. Toquen la imagen para ampliarla.','image');
 add(2,4,'Normal, picado y contrapicado',table(d.tables[0].heads,d.tables[0].rows.slice(0,3)),'Comparen la posición de la cámara respecto del sujeto.');
 add(2,4,'Otras posiciones de cámara',table(d.tables[0].heads,d.tables[0].rows.slice(3)),'Consulten cenital, nadir e inclinado en la misma lámina.');
 add(2,4,'Una elección con sentido',P(d.paragraphs.at(-2))+P(d.questions[0]),'Respondan al final de la página 4. Expliquen qué permitiría ver.');
 add(3,5,'Observamos a Leo Bascuñán',`<div class="video-heading">${P(e.paragraphs[0])}</div><div class="video-slot" id="leo-video"><button type="button" class="load-video">Cargar video para proyectar</button><p>Observen cómo se selecciona y organiza la experiencia.</p></div><a class="video-link" href="https://www.youtube.com/watch?v=h23SJatDO74" target="_blank" rel="noopener">Abrir el video original en YouTube</a>`,'El profesor proyecta el video. Reconozcan apertura, recorrido y cierre.','video');
 const analysisRows=e.tables[0].rows.map(row=>[row[0],'','']);
 add(4,5,'Organizador · Cómo vamos a responder',P(e.instructions),'Trabajen individualmente en el cuaderno. La tabla de la guía sirve de apoyo.');
 add(4,5,'Organizador · Quién habla y qué comunica',table(e.tables[0].heads,analysisRows.slice(0,4)),'Copien y completen las ocho filas en el cuaderno.','organizer');
 add(4,5,'Organizador · Cómo construye el relato',table(e.tables[0].heads,analysisRows.slice(4)),'En cada fila, relacionen observación y escena, minuto o detalle.','organizer');
 add(4,5,'Revisamos dos filas',P(e.paragraphs.at(-1)),'En parejas: contrasten las evidencias y corrijan el organizador.');
 add(5,6,'Ejercicio · Observen A, B y C',P(f.instructions)+image('ejercicio-planos','Encuadres A, B y C de un estudiante en el colegio'),'Observen las imágenes de la página 6, sin adelantar las respuestas.','exercise-image');
 add(5,6,'Reconozcan los planos con una evidencia',table(f.tables[0].heads,f.tables[0].rows.map(row=>[row[0],'',''])),'Respondan individualmente en la tabla de la página 6.');
 add(5,6,'Elijan según lo que quieren comunicar',f.questions.map(P).join(''),'Escriban las tres respuestas y contrasten una con un compañero.');
 add(6,7,'Aplicación · Una escena cotidiana',P(g.instructions)+P(g.paragraphs[0])+P(g.paragraphs[1]),'Elijan la situación y escriban qué quieren que otra persona comprenda.');
 add(6,7,'Una escena, tres decisiones',P(g.paragraphs[2])+`<div class="storyboard-view">${['Imagen 1','Imagen 2','Imagen 3'].map(t=>`<div><h2>${t}</h2><div class="draw-preview"></div><p>Plano · Ángulo · Aporta al mensaje</p></div>`).join('')}</div>`,'Dibujen la secuencia y completen sus decisiones en la página 7.');
 add(7,7,'Revisen una decisión',P(g.paragraphs[3]),'Escuchen la sugerencia y escriban qué mantendrían o cambiarían.');
 add(7,7,'Volvemos a la pregunta de la clase',`<p class="return-question">${a.paragraphs[0]}</p>${P(g.questions[0])}`,'Respondan el cierre de la página 7 usando una decisión de su secuencia.');
 const pdfHash=crypto.createHash('sha256').update(fs.readFileSync(path.join(dest,'assets/guia-clase1-vlog-nm3.pdf'))).digest('hex');
 fs.writeFileSync(path.join(dest,'clase1.js'),`window.VlogClase1=${JSON.stringify({phases,slides,guideSha256:pdfHash},null,2)};\n`);
 const publicGuide=approved.replaceAll('../../../assets/','/assets/').replaceAll('../../../estudiantes/','/estudiantes/');fs.writeFileSync(path.join(dest,'guia.html'),publicGuide);
 const head=(title,body='')=>`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} · Estudia CEST</title><link rel="stylesheet" href="/assets/fonts/cest/fonts.css"><link rel="stylesheet" href="presentacion.css"></head><body class="${body}">`;
 const foot='<script src="/assets/anotar-pizarra.js" defer></script></body></html>';
 fs.writeFileSync(path.join(dest,'presentacion.html'),head('Clase 1 · Mi vida en cinco minutos','presentation')+`<header class="utility"><a class="brand" href="./">Mi vida en cinco minutos</a><span id="phase-label"></span><a href="assets/guia-clase1-vlog-nm3.pdf" target="_blank">Guía PDF</a></header><main class="deck" aria-label="Presentación de la clase">${slides.map((s,i)=>`<section class="slide ${s.kind}" data-index="${i}" hidden><header class="slide-heading"><p class="guide-page">Guía · Página ${s.page} · ${phases[s.phase].start}–${phases[s.phase].end} min</p><h1 tabindex="-1">${s.title}</h1></header><div class="slide-content">${s.html}</div><p class="paper-cue">${s.cue}</p></section>`).join('')}</main><nav class="nav-bar" aria-label="Controles de presentación"><button id="prev" aria-label="Diapositiva anterior">←</button><span id="counter"></span><button id="next" aria-label="Diapositiva siguiente">→</button><button id="fullscreen" type="button">Pantalla completa</button><label class="jump-label"><span class="sr-only">Ir a diapositiva</span><select id="jump">${slides.map((s,i)=>`<option value="${i}">${i+1}. P. ${s.page} · ${s.title}</option>`).join('')}</select></label><div class="timer"><span id="timer-label">Tiempo del bloque</span><output id="timer-value" aria-label="Tiempo restante del bloque"></output><button id="timer-toggle">Iniciar tiempo</button><button id="timer-reset" aria-label="Reiniciar tiempo del bloque">↺</button></div></nav><dialog id="image-modal"><button id="close-image">Cerrar imagen</button><img id="large-image" alt=""></dialog><script src="clase1.js"></script><script src="presentacion.js"></script>`+foot);
 fs.writeFileSync(path.join(dest,'index.html'),head('Mi vida en cinco minutos')+`<main class="landing"><nav><a href="/nm3/">← Lengua y Literatura · 3.º medio</a></nav><p class="eyebrow">3.º A, B y D TP · Viernes 30 de octubre</p><h1>Mi vida en cinco minutos</h1><p class="lead">Clase 1 · Leemos, observamos y trabajamos con la guía.</p><p>${a.paragraphs[0]}</p><div class="actions"><a class="primary" href="presentacion.html">Abrir presentación de la clase</a><a href="assets/guia-clase1-vlog-nm3.pdf" download>Descargar guía · 7 páginas A4</a></div><figure><img src="assets/escena-desayuno.webp" alt="Una escena cotidiana, distintos encuadres"><figcaption>Ilustración didáctica de IA.</figcaption></figure><p>La presentación sigue las mismas preguntas, imágenes y ejercicios de la guía impresa. Las respuestas quedan en la guía y en el cuaderno.</p><p>Duración prevista: 90 minutos. Cada bloque muestra su tiempo y un temporizador que el profesor puede iniciar o pausar.</p><div class="secondary-links"><a href="guia.html">Ver guía imprimible</a> · <a href="docente.html">Hoja de ruta docente</a></div></main>`+foot);
 const roles=[['Recupera una experiencia y comunica acuerdos y objetivo.','Responden la activación y comparten una observación.'],['Lee, explica y modela la relación entre imagen y mensaje.','Leen, comparan encuadres y responden después de la lectura.'],['Explica plano y ángulo mediante las láminas.','Reconocen qué se muestra y justifican una elección.'],['Proyecta el video y repite un fragmento si hace falta.','Observan y registran pistas.'],['Pide evidencia y monitorea dos filas por pareja.','Completan el organizador, contrastan y corrigen.'],['Pide reconocer, comparar y fundamentar.','Resuelven los ejercicios A/B/C.'],['Pregunta qué aporta cada imagen a la idea central.','Dibujan una escena con tres encuadres y justifican.'],['Recoge revisiones y sistematiza la relación entre selección y sentido.','Revisan una decisión y responden el cierre.']];
 const route=phases.map(p=>{const indices=slides.map((s,i)=>s.phase===p.id?i+1:null).filter(Boolean);return [p.start+'–'+p.end+' min','Guía p. '+p.page+' · diapositivas '+indices[0]+'–'+indices.at(-1),...roles[p.id]];});
 fs.writeFileSync(path.join(dest,'docente.html'),head('Hoja de ruta · Clase 1')+`<main class="teacher"><nav><a href="./">Proyecto</a> · <a href="presentacion.html">Presentación</a> · <a href="assets/guia-clase1-vlog-nm3.pdf">Guía PDF</a></nav><h1>Hoja de ruta · Clase 1</h1><p><b>Preparar:</b> siete páginas A4 por estudiante, cuaderno y lápiz, proyector, audio y conexión al video original.</p><p><b>Objetivo:</b> ${esc(a.objective)}</p>${table(['Minutos','Pantalla y guía','Qué hace el docente','Qué hacen los estudiantes'],route)}<p><b>Si falta tiempo:</b> abreviar puesta en común y resolver A/B/C oralmente, conservando lectura, una fila modelada y la aplicación final. Los tiempos son estimaciones para conducir, no duración empírica comprobada.</p><p>El reloj es manual, se conserva entre diapositivas del mismo bloque y no avanza la presentación automáticamente. Al cambiar de bloque, el anterior queda pausado. Se puede reiniciar el tiempo del bloque actual.</p><p>Lectura adaptada: SM, GDD tomo 1, Unidad 2 «Identidad», pp. 89–90 (PDF 95–96). Aplicación al vlog: CEST. La pauta detallada se mantiene en la referencia interna del proyecto.</p></main>`+foot);
 fs.writeFileSync(path.join(source,'CORRESPONDENCIA_PRESENTACION.json'),JSON.stringify({guideSha256:pdfHash,phases,slides:slides.map(({title,phase,page},index)=>({numero:index+1,title,phase,page}))},null,2)+'\n');
 console.log(`Presentación espejo: ${slides.length} diapositivas, 8 bloques, PDF ${pdfHash}.`);
}
main().catch(e=>{console.error(e);process.exitCode=1;});
