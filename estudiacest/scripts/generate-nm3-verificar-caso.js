'use strict';
// Fuente reproducible de la guía impresa: no guarda respuestas ni usa Firebase.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright'),{PDFDocument}=require('pdf-lib');
const root=path.resolve(__dirname,'..'),base='nm3/u3-clase5-verificar-caso';
const objective='Verificar afirmaciones sobre casos chilenos, contrastando imágenes, fuentes primarias y fechas, para fundamentar una conclusión responsable.';
const urls={nasa:'https://www.earthdata.nasa.gov/news/worldview-image-archive/fires-chile',armada:'https://www.directemar.cl/tras-37-horas-de-monitoreo-shoa-cancelo',servel:'https://www.servel.cl/Ch/app/200-070-vocales-designados-para-las-proximas-elecciones-regionales-y-municipales/sin-categoria/'};
const box=(title,html,cls='')=>{const domain=title.startsWith('N1.')?'earthdata.nasa.gov':title.startsWith('D1.')?'directemar.cl':title.startsWith('S1.')?'servel.cl':'';return `<section class="box ${cls} ${domain?'web-source':''}">${domain?`<div class="web-address">▣ ${domain}<span>Ficha de lectura</span></div>`:''}<h2>${title}</h2>${html}</section>`;};
const lines=n=>`<div class="answer-lines">${'<span></span>'.repeat(n)}</div>`;
const question=(number,html,n)=>`<section class="question"><p><strong>${number}.</strong> ${html}</p>${lines(n)}</section>`;
const source=(id,label,url)=>`<p class="source"><strong>${id} · ${label}.</strong> Paráfrasis de la fuente oficial, consultada el 6 de octubre de 2026. <a href="${url}">${id==='N1'?url:new URL(url).hostname+'/…'}</a></p>`;
const verdict=`<p class="verdict"><strong>Elige:</strong> <span class="check"></span>Se sostiene <span class="check"></span>Se contradice <span class="check"></span>Mezcla aciertos y errores <span class="check"></span>No se puede determinar</p>`;
const header=`<div class="membrete-banner"><table class="inst-header-table">
            <tr>
                <td class="inst-left"><img src="/estudiantes/assets/insignia_talca_1.png" alt="Insignia C.E.S.T."></td>
                <td class="inst-center">
                    <div class="inst-school-name">CENTRO EDUCATIVO SALESIANOS TALCA</div>
                    <div class="inst-school-info">
                        TÉCNICO PROFESIONAL: 2 SUR 1147 &ndash; FONOS (71) 2615416 &middot; 2615410<br>
                        B&Aacute;SICA y LICEO: 11 ORIENTE 1751 &ndash; FONOS (71) 2615454 &middot; 2615457<br>
                        www.salesianostalca.cl &ndash; cest@salesianostalca.cl &nbsp;&middot;&nbsp; <strong>TALCA - REGI&Oacute;N DEL MAULE - CHILE</strong>
                    </div>
                    <div class="inst-doc-desc">Lengua y Literatura &middot; 3&deg; Medio (NM3) &middot; Prof. Francisco Javier N&uacute;&ntilde;ez Valenzuela</div>
                </td>
                <td class="inst-right"><img src="/estudiantes/assets/sdb-logo-big.png" alt="Logo SDB"></td>
            </tr>
        </table>
        <hr class="inst-header-line">
    </div>`;
const footer=i=>`<footer class="footer"><span class="motto">EDUCAR EVANGELIZANDO Y EVANGELIZAR EDUCANDO, MEDIANTE UNA FORMACIÓN CONTINUA Y DE CALIDAD</span><span class="page-number">Página ${i} de 9</span></footer>`;
const continuation=`<p class="continuation">Nombre y apellido: <span class="blank"></span> Curso: <span class="blank short"></span></p>`;
const identity=`<table class="info-table" aria-label="Ficha institucional"><tbody><tr><td class="label">Nombre</td><td class="value write-in" colspan="2"></td><td class="label-sm">RUT</td><td class="value write-in" colspan="3"></td></tr><tr><td class="label">Profesor</td><td class="value" colspan="2">Francisco Javier Núñez Valenzuela</td><td class="label-sm">Curso</td><td class="value write-in"></td><td class="label-sm">N° Lista</td><td class="value write-in"></td></tr><tr><td class="label">Asignatura</td><td class="value" colspan="2">Lengua y Literatura</td><td class="label-sm">Guía N°</td><td class="value">5</td><td class="label-sm">Revisado</td><td class="value write-in"></td></tr><tr><td class="label">Semestre</td><td class="value">2</td><td class="label-sm">Fecha</td><td class="value write-in"></td><td class="label-sm">Puntaje</td><td class="value write-in" colspan="2"></td></tr><tr class="obj-row"><td class="label">Objetivo</td><td colspan="6">${objective}</td></tr><tr class="obj-row"><td class="label">Habilidades</td><td colspan="6">Contrastar fuentes, reconocer recursos del formato, distinguir fechas y fundamentar conclusiones.</td></tr></tbody></table>`;
const sheet=(i,title,html)=>`<section class="sheet" data-page="${i}">${header}<p class="meta">Unidad 3 · Clase 5 · Verificar un caso real · OA 4</p><h1 class="doc-title">${title}</h1>${i===1?identity:continuation}${html}${footer(i)}</section>`;
const socialHeader=(name,handle,avatar)=>`<div class="profile"><span class="avatar">${avatar}</span><div><strong>${name}</strong><span>${handle}</span></div><span class="dots">···</span></div>`;
const instagram=`<article class="social instagram" aria-label="Publicación recreada de Instagram"><div class="platform">Instagram <span>Publicación recreada</span></div>${socialHeader('Chile en imágenes','@chile_en_imagenes_ejercicio','CI')}<div class="image-date claimed-date"><span>La cuenta afirma: foto tomada hoy</span><strong>3 de febrero de <span class="year">2024</span></strong></div><img class="post-photo" src="assets/incendios-publicacion-alterada-gris.jpg" alt="Imagen satelital adjunta a la publicación"><div class="post-body"><div class="post-actions"><span>♡ &nbsp; ◯ &nbsp; ↗</span><span>▱</span></div><p class="small"><strong>1.248 Me gusta</strong></p><p><strong>chile_en_imagenes_ejercicio</strong> Esta foto fue tomada hoy en Chile. Muestra los incendios de febrero de 2024 desde el espacio. Compártanla para que nadie diga que exageramos.</p><p class="social-date">Publicado: 3 de febrero de 2024</p></div></article>`;
const chatReply=(name,message,time)=>`<div class="bubble chat-reply"><p><strong>${name}</strong> ${message}<span class="inline-time">${time}</span></p></div>`;
const whatsapp=`<article class="social whatsapp" aria-label="Conversación recreada de WhatsApp"><div class="platform">WhatsApp <span>Conversación recreada</span></div><div class="chat-head">← <span class="avatar">V</span><strong>Vecinos Talca Norte</strong><span class="dots">···</span></div><div class="chat-area"><p class="date-pill">30 de julio de 2025</p><div class="bubble"><p class="sender">Contacto del grupo</p><p class="forward">↪ Reenviado muchas veces</p><p>¡Ya está todo cancelado! El SHOA canceló a las 08:50 de hoy la amenaza de tsunami en todas las costas de Chile, después de más de 37 horas de vigilancia. El nombre de la institución y el dato exacto de la hora lo confirman.</p><p class="message-time">09:00</p></div>${chatReply('Ana:','Amén.','09:01')}${chatReply('Rosa:','¡Qué terrible todo lo que pasó!','09:02')}${chatReply('Carmen:','Menos mal, mi hija está en la playa.','09:03')}${chatReply('Diego:','¿Esa información de dónde es? ¿Tienes el enlace oficial?','09:04')}</div><div class="chat-input">Mensaje <span>◎</span></div></article>`;
const xReply=(name,handle,message,cls='')=>`<div class="reply ${cls}"><p><strong>${name}</strong> <span class="reply-handle">${handle}</span></p><p>${message}</p></div>`;
const xpost=`<article class="social xpost" aria-label="Publicación recreada de X"><div class="platform">X <span>Publicación recreada</span></div>${socialHeader('Datos para votar','@datosvotar_aula','DV')}<div class="post-body"><p>En estas elecciones puedes elegir un solo día para votar: sábado 26 o domingo 27 de octubre de 2024. Se utiliza lápiz pasta azul. Revisa tu mesa y local en <span class="post-link">consulta.servel.cl</span>.</p><p class="social-date">10:15 · 25 oct. 2024 · 8.400 visualizaciones</p><div class="post-actions"><span>◯ 18</span><span>⇄ 64</span><span>♡ 210</span><span>↗</span></div>${xReply('Comentario B','@lector_aula','Entonces queda demostrado que todas las próximas elecciones en Chile serán siempre sábado y domingo.','comment-b')}${xReply('Mario','@mario_aula','Voy a ir el sábado; el domingo estará lleno.')}${xReply('Paula','@paula_aula','Entonces, ¿se puede ir a votar los dos días?')}${xReply('René','@rene_aula','No vayan a votar, está todo arreglado.')}${xReply('Elena','@elena_aula','Voy a ir el domingo antes de las seis, porque tengo cosas que hacer.')}</div></article>`;
const verified=`<svg class="verified-badge" viewBox="0 0 20 20" role="img" aria-label="Verificado"><path fill="#111" d="M10 0 13 2 17 3 18 7 20 10 18 13 17 17 13 18 10 20 7 18 3 17 2 13 0 10 2 7 3 3 7 2Z"/><path fill="none" stroke="#fff" stroke-width="2.5" d="m5 10 3 3 7-7"/></svg>`;
const officialPost=(id,name,handle,avatar,body,date,url,domain)=>`<h2 class="case-label">${id}. Fuente primaria</h2><article class="social xpost official-post" data-source-id="${id}" aria-label="Fuente oficial en formato recreado de X"><div class="platform">X <span>Fuente oficial · Recreación</span></div>${socialHeader(name+' '+verified,handle,avatar)}<div class="post-body">${body}<p class="post-link">${domain}</p><p class="social-date">${date}</p><div class="post-actions"><span>◯</span><span>⇄</span><span>♡</span><span>↗</span></div></div></article>`;
const pages=[];
pages.push(sheet(1,'Verificar antes de compartir',
 box('Instrucciones',`<ol><li>Lee cada caso y su fuente impresa.</li><li>Responde en los renglones y usa datos del caso. La pregunta 15 se comenta oralmente al cierre.</li><li>Justifica tus conclusiones y cita la ficha: N1, D1 o S1.</li><li>Completa la guía y entrégala al docente.</li></ol><p><strong>Trabajo individual en papel. Sin celular.</strong></p>`,'instructions')+
 `<figure><img class="illustration opening-art" src="assets/estudiantes-verificando-gris.webp" alt="Dos estudiantes comparan una imagen con documentos impresos"></figure>`));
pages.push(sheet(2,'Caso 1 · La imagen de los incendios',
 `<h2 class="case-label">A. Observa la publicación</h2>`+instagram+
 `<p><strong>Busca la imagen en N1 (página 3).</strong> Compara la fecha que afirma la cuenta con la fecha en que se tomó la imagen.</p>`));
pages.push(sheet(3,'Caso 1 · Archivo de NASA',
 box('N1. NASA Earthdata · Archivo de imágenes',`<p><strong>Recurso:</strong> «Fires in Chile» · Incendios en Chile.</p><div class="image-date source-capture"><span>Fecha en que se tomó la imagen</span><strong>22 de enero de <span class="year">2017</span></strong></div><figure class="archive-image"><img class="case-image" src="assets/incendios-chile-2017-gris.jpg" alt="Imagen satelital completa conservada por NASA Earthdata"><figcaption>Chile · VIIRS · Satélite Suomi NPP (NASA/NOAA).</figcaption></figure><p>Compara la costa, el relieve y las nubes con la imagen de A.</p><table class="evidence-table"><tbody><tr><th>Publicación del registro</th><td>23 de enero de 2017.<br>Fecha en que NASA publicó el registro.</td></tr><tr><th>Actualización de la página</th><td>14 de mayo de 2025.<br>Fecha de actualización de la página web.</td></tr></tbody></table>`)+
 source('N1','NASA Earthdata, archivo de imagen',urls.nasa)));
pages.push(sheet(4,'Caso 1 · Escribe tu verificación',
 question('1','Escribe qué lugar y fecha afirma la publicación. Luego explica si los «Me gusta» bastan para creerle.',3)+
 question('2','Compara A con N1. Describe dos detalles que se mantienen y una diferencia en las nubes.',3)+
 question('3','Compara la fecha que A atribuye a la foto con la fecha en que se tomó según N1. ¿Coinciden? Justifica.',3)+
 box('4. Decisión sobre el mensaje A',verdict+`<p>Justifica con <strong>dos datos de N1</strong>. Explica qué cambió en la foto y si su fecha tiene respaldo.</p>`+lines(4))+
 question('5','Reescribe la publicación con la fecha correcta y el nombre de la fuente.',3)));
pages.push(sheet(5,'Caso 2 · Un mensaje sobre un tsunami',
 `<h2 class="case-label">A. Observa la cadena</h2>`+whatsapp+
 officialPost('D1','Armada de Chile','@Armada_Chile','A',`<p>El SHOA estableció la cancelación total de la amenaza de tsunami en todas las costas de Chile a las <strong>08:50 del 31 de julio de 2025</strong>, después de más de <strong>37 horas de monitoreo</strong>.</p><p>El SNAM vigiló boyas y estaciones del nivel del mar y emitió <strong>46 boletines</strong>. DIRECTEMAR, de la Armada de Chile, registra el hecho.</p>`,'Fecha del registro: jueves 31 de julio de 2025',urls.armada,'directemar.cl')+
 source('D1','DIRECTEMAR, registro oficial de 31-07-2025',urls.armada)));
pages.push(sheet(6,'Caso 2 · Escribe tu verificación',
 question('6','Escribe qué fecha de cancelación afirma A y a qué zonas de Chile dice que afecta.',4)+
 question('7','Compara la fecha y hora de la cancelación mencionada en A con las registradas en D1. Escribe qué coincide y qué cambia.',3)+
 question('8','¿El aviso «Reenviado muchas veces» identifica la fuente original? Explica por qué consultarías D1.',3)+
 box('9. Decisión sobre el mensaje A',verdict+`<p>Justifica con <strong>dos datos de D1</strong>. Señala qué parte tiene respaldo y cuál no.</p>`+lines(4))+
 question('10','Responde en dos o tres oraciones: corrige la cadena y cita la fuente.',3)));
pages.push(sheet(7,'Caso 3 · Información sobre una elección',
 `<h2 class="case-label">A. Observa la publicación y el comentario B</h2>`+xpost+
 officialPost('S1','Servicio Electoral de Chile','@ServelChile','S',`<p>Para las Elecciones Regionales y Municipales de <strong>octubre de 2024</strong>, cada persona puede escoger si vota el <strong>sábado 26 o el domingo 27 de octubre</strong>.</p><p>Se utiliza <strong>lápiz pasta azul</strong>. Revisa tu mesa y local en <strong>consulta.servel.cl</strong>.</p>`,'Proceso electoral: octubre de 2024',urls.servel,'servel.cl')+
 `<p><strong>Responde sobre A y B por separado.</strong></p>`+
 source('S1','Servel, proceso municipal y regional de 2024',urls.servel)));
pages.push(sheet(8,'Caso 3 · Escribe tu verificación',
 question('11','Escribe tres datos de A y la evidencia de S1 que respalda o contradice cada uno.',5)+
 box('12. Decisión sobre A',verdict+`<p>Justifica tu decisión con <strong>dos datos de S1</strong>. Indica a qué elección se refiere.</p>`+lines(4))+
 question('13','¿S1 demuestra lo que afirma el comentario B? Explica qué permite concluir y qué información falta.',4)+
 question('14','¿El perfil, el enlace o un verificado bastan para confiar en un mensaje? Indica qué fuente y qué fecha revisarías para otra elección.',3)+
 ``));
pages.push(sheet(9,'Compara y explica el procedimiento',
 box('15. Plenario oral · Al cierre',`<p>Comenta la conclusión de cada caso y un dato que la apoye. En el caso 3, distingue A y B.</p><p><strong>Respuesta oral.</strong> Apóyate en tus respuestas anteriores.</p>`,'oral-task')+
 question('16','Elige dos elementos del formato que generen confianza o urgencia. ¿Demuestran que el mensaje es correcto? Justifica.',6)+
 question('17','Escribe tres pasos para verificar una noticia. Indica qué comprobarías en cada uno.',6)+
 ``));
async function main(){
 fs.writeFileSync(path.join(root,base,'guia.html'),`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Guía impresa · Verificar un caso real · NM3</title><link rel="stylesheet" href="/assets/fonts/cest/fonts.css"><link rel="stylesheet" href="guia.css"></head><body><nav class="toolbar"><a href="./">Volver a la tarea</a><a href="assets/guia-verificar-caso-nm3.pdf" download>Descargar PDF A4</a><button onclick="window.print()">Imprimir</button></nav><main>${pages.join('\n')}</main><script src="/assets/anotar-pizarra.js" defer></script></body></html>`,'utf8');
 const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!fs.existsSync(file)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 try{browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:1100}});await page.goto(`http://127.0.0.1:${server.address().port}/${base}/guia.html`,{waitUntil:'networkidle'});await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth));await page.evaluate(()=>document.fonts.ready);await page.emulateMedia({media:'print'});
 const layout=await page.evaluate(()=>[...document.querySelectorAll('.sheet')].map(s=>({page:s.dataset.page,overflow:s.scrollHeight>s.clientHeight+1,footer:s.querySelector('.footer').getBoundingClientRect().bottom-s.getBoundingClientRect().bottom,lines:[...s.querySelectorAll('.answer-lines span')].map(l=>l.getBoundingClientRect().height)})));
 if(layout.some(s=>s.overflow||s.footer>1||s.lines.some(h=>h<30.2)))throw new Error('Desborde o renglones inferiores a 8 mm: '+JSON.stringify(layout));
 for(const backgrounds of [false,true]){const pdf=await page.pdf({format:'A4',printBackground:backgrounds,preferCSSPageSize:true});const parsed=await PDFDocument.load(pdf);if(parsed.getPageCount()!==9)throw new Error(`PDF con ${parsed.getPageCount()} páginas, esperadas 9`);if(parsed.getPages().some(p=>Math.abs(p.getWidth()-595.28)>1||Math.abs(p.getHeight()-841.89)>1))throw new Error('Tamaño distinto de A4');if(!backgrounds)fs.writeFileSync(path.join(root,base,'assets/guia-verificar-caso-nm3.pdf'),pdf);}
 console.log(JSON.stringify({pages:9,lines:layout.reduce((n,p)=>n+p.lines.length,0),a4:true,backgrounds:'ambos aprobados',layout}));
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error);process.exitCode=1});
