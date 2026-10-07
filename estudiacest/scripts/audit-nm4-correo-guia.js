'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {chromium}=require('playwright'),{PDFDocument}=require('pdf-lib');
const root=path.resolve(__dirname,'..'),base='nm4/u3-clase8-correo-formal',publicMode=process.argv.includes('--public');
const evidence=fs.mkdtempSync(path.join(os.tmpdir(),'nm4-correo-qa-'));
let server,browser,checks=0;const check=(ok,why)=>{assert.ok(ok,why);checks++;},hash=b=>crypto.createHash('sha256').update(b).digest('hex');
async function main(){
 const guide=fs.readFileSync(path.join(root,base,'guia.html'),'utf8'),deck=fs.readFileSync(path.join(root,base,'index.html'),'utf8'),plan=fs.readFileSync(path.join(root,base,'PLANIFICACION.md'),'utf8');
 check(!/firebase|textarea|contenteditable/i.test(guide+deck),'Respuestas solo en papel');
 check(guide.includes('Los casos y documentos son ficticios.')&&guide.includes('No se permite el uso de celular'),'Consignas y naturaleza de los casos');
 check(plan.includes('OA 5')&&plan.includes('OA 6')&&plan.includes('Tiempos propuestos, no pilotados'),'Alineación y límites');
 check(['Hecho:','Juicio:','Petición:','Registro:','Asunto:','Saludo:','Cuerpo:','Cierre:'].every(s=>guide.includes(s)),'Contenido disciplinar');
 check(guide.includes('24 cuadernos')&&guide.includes('18 cuadernos')&&guide.includes('09:00')&&guide.includes('09:30')&&guide.includes('sábado 17')&&guide.includes('Viernes 16'),'Casos autosuficientes');
 check(guide.includes('Ninguna indica que reemplaza a la otra')&&guide.includes('aprobación antes de imprimir'),'Incertidumbre y secuencia explícitas');
 check(!guide.includes('Faltan seis cuadernos')&&!guide.includes('clave de redacción'),'Pauta docente fuera de la guía');
 const pdfBytes=fs.readFileSync(path.join(root,base,'assets/guia-correo-formal-nm4.pdf')),pdf=await PDFDocument.load(pdfBytes);
 check(pdf.getPageCount()===6&&pdf.getPages().every(p=>Math.abs(p.getWidth()-595.28)<1&&Math.abs(p.getHeight()-841.89)<1),'PDF entregable de seis A4');
 const previous=require('node:child_process').execFileSync('git',['show','96010a9a:estudiacest/nm4/index.html'],{cwd:root,encoding:'utf8'});
 const old=[...new Set(previous.match(/href="[^"]+"/g).map(s=>s.slice(6,-1)).filter(s=>s.startsWith('/')))];
 if(!publicMode){server=http.createServer((req,res)=>{let f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end();}if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.png':'image/png','.pdf':'application/pdf','.ttf':'font/ttf'})[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f));});await new Promise(r=>server.listen(0,'127.0.0.1',r));}
 const origin=publicMode?'https://www.estudiacest.com':'http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true});const errors=[];
 const institutionalProperties={'.inst-school-name':['fontFamily','fontSize','fontWeight','letterSpacing'],'.inst-school-info':['fontFamily','fontSize','lineHeight'],'.inst-doc-desc':['fontFamily','fontSize','fontWeight'],'.inst-center':['paddingLeft','paddingRight'],'.inst-left img':['width'],'.inst-right img':['width'],'.inst-header-line':['borderTopWidth'],'.footer':['fontFamily','fontSize','gap','paddingTop','borderTopWidth']};
 const reference=await browser.newPage();await reference.goto(require('node:url').pathToFileURL(path.join(root,'referencias/formato-institucional/plantilla-guia.html')).href);await reference.emulateMedia({media:'print'});await reference.evaluate(()=>document.fonts.ready);
 const official=await reference.evaluate(props=>Object.fromEntries(Object.entries(props).map(([selector,fields])=>[selector,Object.fromEntries(fields.map(f=>[f,getComputedStyle(document.querySelector(selector))[f]]))])),institutionalProperties);await reference.close();
 for(const width of [320,390,1366,1440,3840]){
  const height=width===3840?2160:width===1366?768:width===1440?900:844,p=await browser.newPage({viewport:{width,height}});
  p.on('pageerror',e=>errors.push(e.message));p.on('requestfailed',r=>errors.push(r.url()+': '+r.failure()?.errorText));p.on('response',r=>{if(r.status()>=400)errors.push(r.url()+': '+r.status());});
  await p.goto(origin+'/'+base+'/',{waitUntil:'networkidle'});
  await p.waitForFunction(()=>[...document.images].filter(i=>i.getAttribute('src')).every(i=>i.complete&&i.naturalWidth));
  const mirror=await p.evaluate(html=>{const d=new DOMParser().parseFromString(html,'text/html'),norm=t=>t.replace(/\s+/g,' ').trim();return {questions:[...document.querySelectorAll('[data-guide-question]')].map(q=>({n:q.dataset.guideQuestion,same:norm(q.textContent)===norm(d.querySelector('[data-guide-question="'+q.dataset.guideQuestion+'"]').textContent),page:q.closest('.slide').dataset.guidePage})),objective:norm(document.querySelector('.objective').textContent)===norm(d.querySelector('.obj-row td:nth-child(2)').textContent),social:[...d.querySelectorAll('.social')].every(a=>[...document.querySelectorAll('.social')].some(b=>norm(a.textContent)===norm(b.textContent)))};},guide);
  check(mirror.questions.length===10&&new Set(mirror.questions.map(q=>q.n)).size===10&&mirror.questions.every(q=>q.same&&Number(q.page)===(Number(q.n)<=3?2:Number(q.n)<=6?3:Number(q.n)<=9?4:5)),width+': preguntas idénticas y páginas');
  check(mirror.objective&&mirror.social,width+': objetivo y casos idénticos');
  for(let i=0;i<17;i++){
   await p.locator('#jump').selectOption(String(i));const geometry=await p.locator('.slide.active').evaluate(s=>{const c=s.querySelector('.slide-content');return {visible:document.querySelectorAll('.slide:not([hidden])').length,horizontal:document.documentElement.scrollWidth>innerWidth+1||c.scrollWidth>c.clientWidth+1,vertical:c.scrollHeight>c.clientHeight+2,counter:document.querySelector('#counter').textContent};});
   check(geometry.visible===1&&!geometry.horizontal&&geometry.counter===(i+1)+' / 17','Pantalla '+(i+1)+', '+width+': '+JSON.stringify(geometry));
   if(width>=1000)check(!geometry.vertical,'Proyección sin cortes '+(i+1)+', '+width+': '+JSON.stringify(geometry));
   if(width===1440&&[3,6,8,10,14,15].includes(i))await p.screenshot({path:path.join(evidence,'diapositiva-'+(i+1)+'-'+width+'.png'),fullPage:true});
  }
  check(await p.locator('#next').isDisabled(),width+': límite final');await p.locator('h1:visible').focus();await p.keyboard.press('Home');check(await p.locator('#counter').innerText()==='1 / 17'&&await p.locator('#prev').isDisabled(),width+': teclado e inicio');await p.locator('#next').click();check(await p.locator('#counter').innerText()==='2 / 17',width+': avanzar');
  check(await p.locator('.anota-toggle').isVisible(),width+': pizarra');
  if(width===1440){await p.locator('#fullscreen').click();await p.waitForFunction(()=>!!document.fullscreenElement);check(true,'Pantalla completa');await p.evaluate(()=>document.exitFullscreen());}
  await p.goto(origin+'/'+base+'/guia.html',{waitUntil:'networkidle'});await p.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth));await p.evaluate(()=>document.fonts.ready);
  check(await p.locator('.sheet').count()===6,width+': seis hojas');check(!await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),width+': guía sin desborde horizontal');
  await p.emulateMedia({media:'print'});
  const geometry=await p.evaluate(()=>[...document.querySelectorAll('.sheet')].map(s=>({n:s.dataset.page,overflow:s.scrollHeight>s.clientHeight+1,footer:s.querySelector('.footer').getBoundingClientRect().bottom<=s.getBoundingClientRect().bottom+1,logos:s.querySelectorAll('.membrete-banner img').length,lines:[...s.querySelectorAll('.answer-lines span')].every(l=>l.getBoundingClientRect().height>=30.2),body:[...s.querySelectorAll('.page-content p,.page-content li,.info-table td')].every(el=>getComputedStyle(el).fontFamily.startsWith('"Times New Roman"')&&Math.abs(parseFloat(getComputedStyle(el).fontSize)-16)<.02),title:[...s.querySelectorAll('h1,h2')].every(el=>Math.abs(parseFloat(getComputedStyle(el).fontSize)-18.6667)<.02),fields:[...s.querySelectorAll('.write-in,.blank,.write-field,.reviewer-field')].every(el=>el.getBoundingClientRect().height>=30.2)})));
  for(const g of geometry)check(!g.overflow&&g.footer&&g.logos===2&&g.lines&&g.body&&g.title&&g.fields,'Hoja '+g.n+', '+width+': '+JSON.stringify(g));
  check(await p.locator('.answer-lines span').count()===55,width+': 55 renglones de 8 mm');
  const institution=await p.evaluate(({props,expected})=>[...document.querySelectorAll('.sheet')].every(s=>Object.entries(props).every(([selector,fields])=>fields.every(f=>getComputedStyle(s.querySelector(selector))[f]===expected[selector][f]))),{props:institutionalProperties,expected:official});check(institution,width+': membrete y pie exactos contra la plantilla oficial');
  const labels=await p.locator('.info-table').innerText();check(['Nombre','RUT','Profesor','Curso','N° Lista','Asignatura','Guía N°','Revisado','Semestre','Fecha','Puntaje','Objetivo','Habilidades'].every(t=>labels.includes(t)),width+': ficha oficial completa');
  for(const backgrounds of [false,true]){const bytes=await p.pdf({format:'A4',printBackground:backgrounds,preferCSSPageSize:true});check((await PDFDocument.load(bytes)).getPageCount()===6,width+': seis páginas, fondos='+backgrounds);}
  if(width===1440)for(let n=1;n<=6;n++)await p.locator('.sheet[data-page="'+n+'"]').screenshot({path:path.join(evidence,'guia-'+n+'.png')});
  await p.close();
 }
 const p=await browser.newPage();await p.goto(origin+'/nm4/',{waitUntil:'networkidle'});const now=await p.locator('a[href]').evaluateAll(a=>a.map(x=>x.getAttribute('href')));
 check(old.every(h=>now.includes(h)),'Conservación de todos los enlaces anteriores NM4');
 check(await p.locator('a[href="/'+base+'/"]').count()===1&&(await p.locator('#u3-clase8').locator('..').innerText()).includes('Martes 13 de octubre'),'Acceso y fecha de la clase');
 const download=await p.request.get(origin+'/'+base+'/assets/guia-correo-formal-nm4.pdf');check(download.ok()&&hash(await download.body())===hash(pdfBytes),'PDF descargable idéntico');
 if(publicMode){for(const f of ['index.html','guia.html','guia.css','presentacion.css','presentacion.js']){const r=await p.request.get(origin+'/'+base+'/'+f);check(r.ok()&&hash(await r.body())===hash(fs.readFileSync(path.join(root,base,f))),'HTTP/SHA '+f);}for(const f of ['PAUTA_DOCENTE.md','PLANIFICACION.md'])check((await p.request.get(origin+'/'+base+'/'+f)).status()===404,'Documento interno excluido '+f);}
 await p.close();check(errors.length===0,'Sin errores JavaScript/HTTP: '+errors.join('\n'));fs.writeFileSync(path.join(evidence,'resultado.json'),JSON.stringify({origin,checks,errors,passed:true},null,2));console.log(JSON.stringify({origin,checks,errors,evidence,passed:true}));
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));});
