'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {chromium}=require('playwright'),{PDFDocument}=require('pdf-lib');
const root=path.resolve(__dirname,'..'),base='nm4/u3-clase8-correo-formal',publicMode=process.argv.includes('--public'),evidence=fs.mkdtempSync(path.join(os.tmpdir(),'nm4-correo-variants-qa-'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');let server,browser,checks=0;const check=(ok,why)=>{assert.ok(ok,why);checks++;};
async function main(){
 const read=f=>fs.readFileSync(path.join(root,base,f),'utf8'),guide=read('guia.html'),deck=read('index.html'),plan=read('PLANIFICACION.md');
 check(!/firebase|textarea|contenteditable/i.test(guide+deck),'Trabajo solo en papel');
 check(guide.includes('Todo el caso es ficticio')&&guide.includes('No debes contar experiencias personales')&&guide.includes('No se permite el uso de celular'),'Naturaleza ficticia, elección y normas');
 check(plan.includes('OA 5')&&plan.includes('OA 6')&&plan.includes('Tiempos propuestos, no pilotados')&&plan.includes('57 copias')&&plan.includes('225 hojas'),'Alineación, tiempo y papel');
 check(['Hecho:','Juicio:','Petición:','Registro:','Asunto:','Saludo:','Cuerpo:','Cierre:'].every(t=>deck.includes(t)),'Contenido enseñado');
 check(guide.includes('empuja a Mauricio')&&guide.includes('profesora jefe')&&guide.includes('director')&&guide.includes('partes íntimas')&&guide.includes('sin tu permiso'),'Cuatro situaciones solicitadas');
 check(guide.includes('resguardada')&&guide.includes('No prometas anonimato absoluto')&&guide.includes('No tienes que investigar')&&plan.includes('ni prometer secreto absoluto'),'Resguardo y ausencia de exigencia de prueba al afectado');
 const master=fs.readFileSync(path.join(root,base,'assets/guia-correo-formal-nm4.pdf'));check((await PDFDocument.load(master)).getPageCount()===8,'Maestro: cuatro versiones de dos páginas');
 for(let i=1;i<=4;i++){
  const html=read('caso-'+i+'.html'),pdf=await PDFDocument.load(fs.readFileSync(path.join(root,base,'assets/guia-caso-'+i+'-nm4.pdf')));
  check(pdf.getPageCount()===2&&pdf.getPages().every(p=>Math.abs(p.getWidth()-595.28)<1&&Math.abs(p.getHeight()-841.89)<1),'PDF '+i+': dos A4');
  check((html.match(/class="sheet"/g)||[]).length===2&&(html.match(/class="case-story"/g)||[]).length===1&&(html.match(/class="gmail-compose"/g)||[]).length===1,'Versión '+i+': solo un caso y una hoja Gmail');
  check(html.includes('Caso '+i+' · Página 1 de 2')&&html.includes('Caso '+i+' · Página 2 de 2'),'Numeración independiente '+i);
  check(html.includes('<strong>Para</strong>')&&html.includes('<strong>Asunto</strong>')&&html.includes('Cc &nbsp; Cco')&&html.includes('Enviar')&&html.includes('mail-icon')&&!html.includes('section-label'),'Gmail '+i+': campos, controles y cuerpo continuo');
 }
 const previous=require('node:child_process').execFileSync('git',['show','cab377b0:estudiacest/nm4/index.html'],{cwd:root,encoding:'utf8'}),old=[...new Set(previous.match(/href="[^"]+"/g).map(s=>s.slice(6,-1)).filter(s=>s.startsWith('/')))];
 if(!publicMode){server=http.createServer((req,res)=>{let f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end();}if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.png':'image/png','.pdf':'application/pdf','.ttf':'font/ttf'})[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f));});await new Promise(r=>server.listen(0,'127.0.0.1',r));}
 const origin=publicMode?'https://www.estudiacest.com':'http://127.0.0.1:'+server.address().port;browser=await chromium.launch();const errors=[];
 const props={'.inst-school-name':['fontFamily','fontSize','fontWeight','letterSpacing'],'.inst-school-info':['fontFamily','fontSize','lineHeight'],'.inst-doc-desc':['fontFamily','fontSize','fontWeight'],'.inst-center':['paddingLeft','paddingRight'],'.inst-left img':['width'],'.inst-right img':['width'],'.inst-header-line':['borderTopWidth'],'.footer':['fontFamily','fontSize','gap','paddingTop','borderTopWidth']};
 const r=await browser.newPage();await r.goto(require('node:url').pathToFileURL(path.join(root,'referencias/formato-institucional/plantilla-guia.html')).href);await r.emulateMedia({media:'print'});await r.evaluate(()=>document.fonts.ready);const official=await r.evaluate(props=>Object.fromEntries(Object.entries(props).map(([s,fs])=>[s,Object.fromEntries(fs.map(f=>[f,getComputedStyle(document.querySelector(s))[f]]))])),props);await r.close();
 for(const width of [320,390,1366,1440,3840]){
  const p=await browser.newPage({viewport:{width,height:width===3840?2160:width===1366?768:width===1440?900:844}});
  p.on('pageerror',e=>errors.push(e.message));p.on('requestfailed',r=>errors.push(r.url()+': '+r.failure()?.errorText));p.on('response',r=>{if(r.status()>=400)errors.push(r.url()+': '+r.status());});
  await p.goto(origin+'/'+base+'/',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
  const mirror=await p.evaluate(html=>{const d=new DOMParser().parseFromString(html,'text/html'),norm=t=>t.replace(/\s+/g,' ').trim();return {cases:[1,2,3,4].every(i=>norm([...document.querySelectorAll('[data-case-id="'+i+'"][data-case-part^="context-"] p')].map(p=>p.textContent).join(' '))===norm([...d.querySelectorAll('.case-story[data-case-id="'+i+'"] p')].map(p=>p.textContent).join(' '))&&norm(document.querySelector('.mission[data-case-id="'+i+'"]').textContent)===norm(d.querySelector('.mission[data-case-id="'+i+'"]').textContent)),objectives:[...d.querySelectorAll('.info-table')].every(t=>norm(t.querySelector('.obj-row td:nth-child(2)').textContent)===norm(document.querySelector('.objective').textContent))};},guide);
  check(mirror.cases&&mirror.objectives,width+': cuatro casos y objetivo idénticos entre guía y presentación');
  for(let i=0;i<21;i++){
   await p.locator('#jump').selectOption(String(i));const g=await p.locator('.slide.active').evaluate(s=>{const c=s.querySelector('.slide-content');return {count:document.querySelectorAll('.slide:not([hidden])').length,horizontal:document.documentElement.scrollWidth>innerWidth+1||c.scrollWidth>c.clientWidth+1,vertical:c.scrollHeight>c.clientHeight+2,counter:document.querySelector('#counter').textContent};});
   check(g.count===1&&!g.horizontal&&g.counter===(i+1)+' / 21','Pantalla '+(i+1)+', '+width+': '+JSON.stringify(g));if(width>=1000)check(!g.vertical,'Proyección sin cortes '+(i+1)+', '+width+': '+JSON.stringify(g));
   if(width===1440&&[3,5,9,13,18,19].includes(i))await p.screenshot({path:path.join(evidence,'diapositiva-'+(i+1)+'-'+width+'.png'),fullPage:true});
  }
  check(await p.locator('#next').isDisabled(),width+': límite final');await p.locator('h1:visible').focus();await p.keyboard.press('Home');check(await p.locator('#counter').innerText()==='1 / 21'&&await p.locator('#prev').isDisabled(),width+': inicio y teclado');await p.locator('#next').click();check(await p.locator('#counter').innerText()==='2 / 21',width+': avanzar');check(await p.locator('.anota-toggle').isVisible(),width+': pizarra');
  if(width===1440){await p.locator('#fullscreen').click();await p.waitForFunction(()=>!!document.fullscreenElement);check(true,'Pantalla completa');await p.evaluate(()=>document.exitFullscreen());}
  for(const i of width===1440?[1,2,3,4]:[1]){
   await p.goto(origin+'/'+base+'/caso-'+i+'.html',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth));
   check(!await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),width+': versión '+i+' sin desborde horizontal');await p.emulateMedia({media:'print'});
   const geometry=await p.locator('.sheet').evaluateAll(ss=>ss.map(s=>({page:s.dataset.page,overflow:s.scrollHeight>s.clientHeight+1,footer:s.querySelector('.footer').getBoundingClientRect().bottom<=s.getBoundingClientRect().bottom+1,logos:s.querySelectorAll('.membrete-banner img').length,lines:[...s.querySelectorAll('.answer-lines span')].every(l=>l.getBoundingClientRect().height>=30.2),fields:[...s.querySelectorAll('.write-in,.write-field,.blank')].every(l=>l.getBoundingClientRect().height>=30.2),body:[...s.querySelectorAll('.page-content p,.page-content li,.info-table td')].every(el=>getComputedStyle(el).fontFamily.startsWith('"Times New Roman"')&&Math.abs(parseFloat(getComputedStyle(el).fontSize)-16)<.02),title:[...s.querySelectorAll('h1,h2')].every(el=>Math.abs(parseFloat(getComputedStyle(el).fontSize)-18.6667)<.02)})));
   check(geometry.length===2&&geometry.every(g=>!g.overflow&&g.footer&&g.logos===2&&g.lines&&g.fields&&g.body&&g.title),width+': versión '+i+' impresión: '+JSON.stringify(geometry));
   check(await p.locator('.answer-lines span').count()===16,width+': versión '+i+' 16 renglones de 8 mm');
   const exact=await p.evaluate(({props,official})=>[...document.querySelectorAll('.sheet')].every(s=>Object.entries(props).every(([selector,fields])=>fields.every(f=>getComputedStyle(s.querySelector(selector))[f]===official[selector][f]))),{props,official});check(exact,width+': versión '+i+' membrete/pie oficiales');
   const labels=await p.locator('.info-table').innerText();check(['Nombre','RUT','Profesor','Curso','N° Lista','Asignatura','Guía N°','Revisado','Semestre','Fecha','Puntaje','Objetivo','Habilidades'].every(t=>labels.includes(t)),width+': ficha '+i);
   if(width===1440)for(const backgrounds of [false,true])check((await PDFDocument.load(await p.pdf({format:'A4',preferCSSPageSize:true,printBackground:backgrounds}))).getPageCount()===2,'Caso '+i+': PDF dos páginas, fondos='+backgrounds);
   if(width===1440)for(let n=1;n<=2;n++)await p.locator('.sheet[data-page="'+n+'"]').screenshot({path:path.join(evidence,'caso-'+i+'-pagina-'+n+'.png')});
   await p.emulateMedia({media:'screen'});
  }
  await p.close();
 }
 const p=await browser.newPage();await p.goto(origin+'/'+base+'/guia.html',{waitUntil:'networkidle'});check(await p.locator('.sheet').count()===8&&await p.locator('.toolbar a[download]').count()===4,'Selector de cuatro PDF');
 for(let i=1;i<=4;i++){const f='assets/guia-caso-'+i+'-nm4.pdf',r=await p.request.get(origin+'/'+base+'/'+f);check(r.ok()&&hash(await r.body())===hash(fs.readFileSync(path.join(root,base,f))),'Descarga PDF '+i+' idéntica');}
 await p.goto(origin+'/nm4/',{waitUntil:'networkidle'});const now=await p.locator('a[href]').evaluateAll(aa=>aa.map(a=>a.getAttribute('href')));check(old.every(h=>now.includes(h)),'Enlaces anteriores NM4 conservados');check(await p.locator('a[href="/'+base+'/guia.html"]').count()===1,'Selector accesible desde portada');
 const dl=await p.request.get(origin+'/'+base+'/assets/guia-correo-formal-nm4.pdf');check(dl.ok()&&hash(await dl.body())===hash(master),'PDF maestro descargable idéntico');
 if(publicMode){for(const f of ['index.html','guia.html','guia.css','presentacion.css','presentacion.js','caso-1.html','caso-2.html','caso-3.html','caso-4.html']){const r=await p.request.get(origin+'/'+base+'/'+f);check(r.ok()&&hash(await r.body())===hash(fs.readFileSync(path.join(root,base,f))),'HTTP/SHA '+f);}for(const f of ['PAUTA_DOCENTE.md','PLANIFICACION.md'])check((await p.request.get(origin+'/'+base+'/'+f)).status()===404,'Documento interno excluido '+f);}
 await p.close();check(!errors.length,'Sin errores JavaScript/HTTP: '+errors.join('\n'));fs.writeFileSync(path.join(evidence,'resultado.json'),JSON.stringify({origin,checks,errors,passed:true},null,2));console.log(JSON.stringify({origin,checks,errors,evidence,passed:true}));
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));});
