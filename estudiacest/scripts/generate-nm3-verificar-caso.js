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
const source=(id,label,url)=>`<p class="source"><strong>${id} · ${label}.</strong> Ficha en paráfrasis de la fuente oficial, consultada el 6 de octubre de 2026. <a href="${url}">${url}</a></p>`;
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
const footer=i=>`<footer class="footer"><span class="motto">EDUCAR EVANGELIZANDO Y EVANGELIZAR EDUCANDO, MEDIANTE UNA FORMACIÓN CONTINUA Y DE CALIDAD</span><span class="page-number">Página ${i} de 10</span></footer>`;
const continuation=`<p class="continuation">Nombre y apellido: <span class="blank"></span> Curso: <span class="blank short"></span></p>`;
const identity=`<table class="info-table" aria-label="Ficha institucional"><tbody><tr><td class="label">Nombre</td><td class="value write-in" colspan="2"></td><td class="label-sm">RUT</td><td class="value write-in" colspan="3"></td></tr><tr><td class="label">Profesor</td><td class="value" colspan="2">Francisco Javier Núñez Valenzuela</td><td class="label-sm">Curso</td><td class="value write-in"></td><td class="label-sm">N° Lista</td><td class="value write-in"></td></tr><tr><td class="label">Asignatura</td><td class="value" colspan="2">Lengua y Literatura</td><td class="label-sm">Guía N°</td><td class="value">5</td><td class="label-sm">Revisado</td><td class="value write-in"></td></tr><tr><td class="label">Semestre</td><td class="value">2</td><td class="label-sm">Fecha</td><td class="value write-in"></td><td class="label-sm">Puntaje</td><td class="value write-in" colspan="2"></td></tr><tr class="obj-row"><td class="label">Objetivo</td><td colspan="6">${objective}</td></tr><tr class="obj-row"><td class="label">Habilidades</td><td colspan="6">Contrastar fuentes, reconocer recursos del formato, distinguir fechas y fundamentar conclusiones.</td></tr></tbody></table>`;
const sheet=(i,title,html)=>`<section class="sheet" data-page="${i}">${header}<p class="meta">Unidad 3 · Clase 5 · Verificar un caso real · OA 4</p><h1 class="doc-title">${title}</h1>${i===1?identity:continuation}${html}${footer(i)}</section>`;
const socialHeader=(name,handle,avatar)=>`<div class="profile"><span class="avatar">${avatar}</span><div><strong>${name}</strong><span>${handle}</span></div><span class="dots">···</span></div>`;
const instagram=`<article class="social instagram" aria-label="Publicación recreada de Instagram"><div class="platform">Instagram <span>Publicación recreada</span></div>${socialHeader('Chile en imágenes','@chile_en_imagenes_ejercicio','CI')}<img class="post-photo" src="assets/incendios-chile-2017-gris.jpg" alt="Imagen satelital adjunta a la publicación"><div class="post-body"><div class="post-actions"><span>♡ &nbsp; ◯ &nbsp; ↗</span><span>▱</span></div><p class="small"><strong>1.248 Me gusta</strong></p><p><strong>chile_en_imagenes_ejercicio</strong> Esta imagen satelital fue tomada hoy en Chile. Es la prueba de cómo se ven desde el espacio los incendios de febrero de 2024. Compártanla para que nadie diga que exageramos.</p><p class="social-date">3 de febrero de 2024</p></div></article>`;
const whatsapp=`<article class="social whatsapp" aria-label="Cadena recreada de WhatsApp"><div class="platform">WhatsApp <span>Conversación recreada</span></div><div class="chat-head">← <span class="avatar">V</span><strong>Vecinos del sector</strong><span class="dots">···</span></div><div class="chat-area"><p class="date-pill">30 de julio de 2025</p><div class="bubble"><p class="sender">Contacto del grupo</p><p class="forward">↪ Reenviado muchas veces</p><p>¡Ya está todo cancelado! El SHOA canceló a las 08:50 de hoy la amenaza de tsunami en todas las costas de Chile, después de más de 37 horas de vigilancia. El nombre de la institución y el dato exacto de la hora lo confirman.</p><p class="message-time">09:00</p></div></div><div class="chat-input">Mensaje <span>◎</span></div></article>`;
const xpost=`<article class="social xpost" aria-label="Publicación recreada de X"><div class="platform">X <span>Publicación recreada</span></div>${socialHeader('Datos para votar','@datosvotar_aula','DV')}<div class="post-body"><p>En estas elecciones puedes elegir un solo día para votar: sábado 26 o domingo 27 de octubre de 2024. Se utiliza lápiz pasta azul. Revisa tu mesa y local en <span class="post-link">consulta.servel.cl</span>.</p><div class="link-preview"><strong>consulta.servel.cl</strong><span>Consulta de datos electorales</span></div><p class="social-date">10:15 · 25 oct. 2024 · 8.400 visualizaciones</p><div class="post-actions"><span>◯ 18</span><span>⇄ 64</span><span>♡ 210</span><span>↗</span></div><div class="reply">${socialHeader('Comentario B','@lector_aula','B')}<p>Entonces queda demostrado que todas las próximas elecciones en Chile serán siempre sábado y domingo.</p></div></div></article>`;
const pages=[];
pages.push(sheet(1,'Verificar antes de compartir',
 box('Instrucciones',`<ol><li>Lee cada caso y su fuente impresa.</li><li>Responde en los renglones. Usa datos de la imagen, la fuente o la fecha.</li><li>Justifica tus conclusiones y cita la ficha: N1, D1 o S1.</li><li>Completa la guía y entrégala al docente.</li></ol><p><strong>Trabajo individual en papel. Sin celular.</strong></p>`,'instructions')+
 `<figure><img class="illustration opening-art" src="assets/estudiantes-verificando-gris.webp" alt="Dos estudiantes comparan una imagen con documentos impresos"></figure>`));
pages.push(sheet(2,'Caso 1 · La imagen de los incendios',
 `<h2 class="case-label">A. Observa la publicación</h2>`+instagram+
 `<p><strong>Contrasta en la página siguiente:</strong> compara esta imagen con el archivo de NASA y revisa sus fechas antes de concluir.</p>`));
pages.push(sheet(3,'Caso 1 · El rastro de la imagen',
 box('B. Expediente impreso · Rastro de la imagen',`<p>Compara la imagen del mensaje A (página 2) con el registro de NASA.</p><figure class="archive-image"><img class="case-image" src="assets/incendios-chile-2017-gris.jpg" alt="Imagen satelital completa conservada por NASA Earthdata"><figcaption>Imagen del archivo NASA Earthdata · Chile.</figcaption></figure><p>Observa la costa, el humo y las nubes en ambas imágenes.</p>`)+
 box('N1. Registro original · NASA Earthdata',`<table class="evidence-table"><tbody><tr><th>Recurso</th><td>«Fires in Chile» · Imagen de incendios en Chile.</td></tr><tr><th>Captura</th><td>22 de enero de 2017.</td></tr><tr><th>Publicación</th><td>23 de enero de 2017.</td></tr><tr><th>Actualización</th><td>14 de mayo de 2025.</td></tr><tr><th>Origen</th><td>VIIRS · Satélite Suomi NPP (NASA/NOAA).</td></tr></tbody></table>`)+
 source('N1','NASA Earthdata, archivo de imagen',urls.nasa)));
pages.push(sheet(4,'Caso 1 · Escribe tu verificación',
 question('1','Escribe qué lugar y fecha afirma la publicación. Luego explica si los «Me gusta» bastan para creerle.',3)+
 question('2','Compara las dos imágenes. Describe dos detalles que permiten reconocer si son la misma fotografía.',3)+
 question('3','¿Qué fecha de N1 permite comprobar la palabra «hoy»? Explica por qué eliges esa fecha.',3)+
 box('4. Decisión fundamentada',verdict+`<p>Justifica con <strong>dos datos de N1</strong>. Evalúa la imagen y el mensaje por separado.</p>`+lines(4))+
 question('5','Reescribe la publicación con la fecha correcta y el nombre de la fuente.',3)));
pages.push(sheet(5,'Caso 2 · Un mensaje sobre un tsunami',
 `<h2 class="case-label">A. Observa la cadena</h2>`+whatsapp+
 box('D1. Fuente primaria · DIRECTEMAR / Armada de Chile',`<p><strong>Título del documento:</strong> Tras 37 horas de monitoreo, SHOA canceló amenaza de tsunami para las costas de Chile.</p><p><strong>Fecha de publicación:</strong> jueves 31 de julio de 2025.</p><p>La autoridad marítima informa que el SHOA estableció la cancelación total a nivel nacional a las <strong>08:50 del 31 de julio</strong>, tras más de 37 horas de monitoreo. Durante el proceso se publicaron <strong>46 boletines</strong>. El SNAM mantuvo vigilancia de boyas y estaciones del nivel del mar para evaluar la evolución del evento.</p><p>Este documento registra un hecho de julio de 2025.</p>`)+
 box('Quién registra el hecho',`<p>El SHOA evalúa la amenaza mediante el Sistema Nacional de Alarma de Maremotos (SNAM). DIRECTEMAR, de la Armada de Chile, publica D1.</p>`)+
 source('D1','DIRECTEMAR, registro oficial de 31-07-2025',urls.armada)));
pages.push(sheet(6,'Caso 2 · Escribe tu verificación',
 question('6','Escribe dos afirmaciones verificables de A: una sobre la fecha y otra sobre el alcance.',2)+
 question('7','Compara la fecha y hora de A con las de D1. Escribe qué coincide y qué cambia.',3)+
 question('8','¿El aviso «Reenviado muchas veces» identifica la fuente original? Explica por qué consultarías D1.',3)+
 box('9. Decisión fundamentada',verdict+`<p>Justifica con <strong>dos datos de D1</strong>. Señala qué parte tiene respaldo y cuál no.</p>`+lines(4))+
 question('10','Responde en dos o tres oraciones: corrige la cadena y cita la fuente.',3)));
pages.push(sheet(7,'Caso 3 · Información sobre una elección',
 `<h2 class="case-label">A. Observa la publicación y el comentario B</h2>`+xpost+
 box('S1. Fuente primaria · Servicio Electoral de Chile',`<p><strong>Documento:</strong> 200.070 vocales designados para las próximas Elecciones Regionales y Municipales.</p><p>En la información destinada al proceso de <strong>octubre de 2024</strong>, Servel señala que las personas pueden escoger si concurren el <strong>sábado 26 o el domingo 27 de octubre</strong>. Indica el uso de <strong>lápiz pasta azul</strong> y llama a revisar mesa y local de votación en <strong>consulta.servel.cl</strong>.</p>`)+
 `<p><strong>Responde sobre A y B por separado.</strong></p>`+
 source('S1','Servel, información del proceso municipal y regional de 2024',urls.servel)));
pages.push(sheet(8,'Caso 3 · Escribe tu verificación',
 question('11','Escribe tres datos de A y la evidencia de S1 que respalda o contradice cada uno.',5)+
 box('12. Decisión sobre A',verdict+`<p>Justifica A con <strong>dos datos de S1</strong>. Indica a qué elección se refiere.</p>`+lines(4))+
 question('13','¿S1 demuestra lo que afirma el comentario B? Explica qué permite concluir y qué información falta.',4)+
 question('14','¿El perfil y el enlace bastan para confiar en A? Indica qué fuente y qué fecha revisarías para otra elección.',3)+
 ``));
pages.push(sheet(9,'Compara y explica el procedimiento',
 question('15','Resume la conclusión de cada caso y cita un dato decisivo. En el caso 3, distingue A y B.',6)+
 question('16','Elige dos recursos del formato que generen confianza o urgencia. Explica por qué no prueban que el mensaje sea correcto.',5)+
 question('17','Escribe tres pasos para verificar una noticia. Indica qué comprobarías en cada uno.',5)+
 ``));
pages.push(sheet(10,'Informe final · De la duda a la evidencia',
 question('18','Elige un caso y escribe un informe de 80 a 110 palabras. Incluye la afirmación, dos datos con su fuente, tu conclusión y un límite de la evidencia.',15)+
 question('19','¿Cambió tu primera impresión? Explica qué evidencia influyó más en tu conclusión.',3)+
 box('Revisa tus respuestas',`<p>Comprueba que incluyas afirmación, evidencia, fuente y conclusión.</p>`)+
 `<div class="feedback">Revisión docente: <span class="field"></span> Observación: <span class="field" style="flex:1"></span></div>`));
async function main(){
 fs.writeFileSync(path.join(root,base,'guia.html'),`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Guía impresa · Verificar un caso real · NM3</title><link rel="stylesheet" href="/assets/fonts/cest/fonts.css"><link rel="stylesheet" href="guia.css"></head><body><nav class="toolbar"><a href="./">Volver a la tarea</a><a href="assets/guia-verificar-caso-nm3.pdf" download>Descargar PDF A4</a><button onclick="window.print()">Imprimir</button></nav><main>${pages.join('\n')}</main><script src="/assets/anotar-pizarra.js" defer></script></body></html>`,'utf8');
 const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!fs.existsSync(file)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 try{browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:1100}});await page.goto(`http://127.0.0.1:${server.address().port}/${base}/guia.html`,{waitUntil:'networkidle'});await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth));await page.evaluate(()=>document.fonts.ready);await page.emulateMedia({media:'print'});
 const layout=await page.evaluate(()=>[...document.querySelectorAll('.sheet')].map(s=>({page:s.dataset.page,overflow:s.scrollHeight>s.clientHeight+1,footer:s.querySelector('.footer').getBoundingClientRect().bottom-s.getBoundingClientRect().bottom,lines:[...s.querySelectorAll('.answer-lines span')].map(l=>l.getBoundingClientRect().height)})));
 if(layout.some(s=>s.overflow||s.footer>1||s.lines.some(h=>h<30.2)))throw new Error('Desborde o renglones inferiores a 8 mm: '+JSON.stringify(layout));
 for(const backgrounds of [false,true]){const pdf=await page.pdf({format:'A4',printBackground:backgrounds,preferCSSPageSize:true});const parsed=await PDFDocument.load(pdf);if(parsed.getPageCount()!==10)throw new Error(`PDF con ${parsed.getPageCount()} páginas, esperadas 10`);if(parsed.getPages().some(p=>Math.abs(p.getWidth()-595.28)>1||Math.abs(p.getHeight()-841.89)>1))throw new Error('Tamaño distinto de A4');if(!backgrounds)fs.writeFileSync(path.join(root,base,'assets/guia-verificar-caso-nm3.pdf'),pdf);}
 console.log(JSON.stringify({pages:10,lines:layout.reduce((n,p)=>n+p.lines.length,0),a4:true,backgrounds:'ambos aprobados',layout}));
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error);process.exitCode=1});
