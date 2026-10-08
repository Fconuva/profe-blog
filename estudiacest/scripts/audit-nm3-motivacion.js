'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),base='nm3/u3-clase5-verificar-caso',publicMode=process.argv.includes('--public');
const evidence=fs.mkdtempSync(path.join(os.tmpdir(),'nm3-motivacion-qa-'));
let server,browser,checks=0;const errors=[];
const check=(ok,why)=>{assert.ok(ok,why);checks++;};
async function main(){
 const data=JSON.parse(fs.readFileSync(path.join(root,base,'assets/videos-motivacion.json'),'utf8'));
 check(data.sources.length===2&&data.fragments.length===4,'Dos fuentes y cuatro pausas');
 check(data.sources.every(s=>s.published.startsWith('2024-')&&s.url.startsWith('https://www.youtube.com/watch?v=')),'Fuentes y fechas de archivo');
 const instagram=JSON.parse(fs.readFileSync(path.join(root,base,'assets/instagram-contexto.json'),'utf8'));
 check(instagram.questions.length===6&&instagram.comments.status.includes('recreados'),'Seis preguntas y comentarios distinguidos');
 check(instagram.teacherNotes.some(x=>x.includes('No presentar como hecho'))&&instagram.teacherNotes.some(x=>x.includes('lugar de captura no está establecido')),'Reputación y lugar de la fotografía no inventados');
 check(instagram.evidence.some(x=>x.text.includes('pesos argentinos'))&&instagram.evidence.some(x=>x.text.includes('no son pronósticos propios')),'País, moneda y límites del pronóstico');
 check(instagram.sources.primary.url.endsWith('relevamiento-expectativas-mercado-2026-09.pdf'),'Fuente primaria del año correcto');
 const guideAtStart=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,base,'assets/guia-verificar-caso-nm3.pdf'))).digest('hex');
 check(guideAtStart===crypto.createHash('sha256').update(require('node:child_process').execFileSync('git',['show','1b9f1939:estudiacest/'+base+'/assets/guia-verificar-caso-nm3.pdf'],{maxBuffer:15*1024*1024})).digest('hex'),'Guía PDF aprobada conservada');
 if(!publicMode){
  server=http.createServer((req,res)=>{
   let f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
   if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
   if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');
   if(!fs.existsSync(f)){res.writeHead(404);return res.end();}
   const size=fs.statSync(f).size,range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
   res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.mp4':'video/mp4','.json':'application/json','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'})[path.extname(f)]||'application/octet-stream');
   res.setHeader('Accept-Ranges','bytes');
   if(range){const start=Number(range[1]),end=range[2]?Math.min(Number(range[2]),size-1):size-1;res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});fs.createReadStream(f,{start,end}).pipe(res);}
   else{res.setHeader('Content-Length',size);fs.createReadStream(f).pipe(res);}
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
 }
 const origin=publicMode?'https://www.estudiacest.com':`http://127.0.0.1:${server.address().port}`;
 browser=await chromium.launch({headless:true});
 for(const width of [320,390,1440,3840]){
  const page=await browser.newPage({viewport:{width,height:width>=2200?2160:width>=1000?900:844}});
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+': '+r.url());});
  const requests=[];page.on('request',r=>requests.push({url:r.url(),method:r.method()}));
  await page.goto(`${origin}/${base}/`,{waitUntil:'networkidle'});
  check(!requests.some(r=>r.url.endsWith('.mp4')),'Sin descarga anticipada '+width);
  check(await page.locator('.slide').count()===21,'Mantiene 21 diapositivas '+width);
  await page.locator('#start-motivation').click();
  await page.waitForFunction(()=>{const v=document.getElementById('motivation-video');return v.readyState>=2&&v.currentTime>.25&&!v.paused;});
  const decoded=await page.locator('video').evaluate(v=>({width:v.videoWidth,height:v.videoHeight,duration:v.duration,audio:v.webkitAudioDecodedByteCount,frames:v.getVideoPlaybackQuality().totalVideoFrames}));
  check(decoded.width===480&&decoded.height===854&&Math.abs(decoded.duration-18.72)<.08&&decoded.frames>0&&decoded.audio>0,'Primer fragmento real, audio y cuadros decodificados '+width+': '+JSON.stringify(decoded));
  const horizontal=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1||document.getElementById('motivation-dialog').scrollWidth>document.getElementById('motivation-dialog').clientWidth+1);
  check(!horizontal,'Sin desborde horizontal '+width);
  if(width===1440){
   for(let i=0;i<4;i++){
    if(i){await page.locator('#motivation-next').click();await page.waitForFunction(()=>{const v=document.getElementById('motivation-video');return v.readyState>=2&&v.currentTime>.25&&!v.paused;});}
    const clip=await page.locator('video').evaluate(v=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight}));
    check(Math.abs(clip.duration-(data.fragments[i].endSeconds-data.fragments[i].startSeconds))<.1,'Duración exacta del corte '+i);
    check(i<2?clip.width===480&&clip.height===854:clip.width===1280&&clip.height===720,'Resolución del original '+i);
    check((await page.locator('#motivation-source').innerText()).includes(data.sources[data.fragments[i].source].channel),'Fuente del fragmento '+i);
    await page.locator('video').evaluate(v=>{v.currentTime=v.duration-.15;});
    await page.waitForFunction(()=>document.getElementById('motivation-dialog').dataset.phase==='question');
    check(await page.locator('video').evaluate(v=>v.paused),'Pausa natural antes de respuesta '+i);
    check(await page.locator('#motivation-question').innerText()===data.fragments[i].question,'Pregunta intercalada correcta '+i);
    check(await page.locator('#motivation-next').isVisible(),'Docente decide continuar '+i);
    await page.screenshot({path:path.join(evidence,`pausa-${i+1}-${width}.png`),fullPage:true});
    await page.locator('video').evaluate(v=>v.dispatchEvent(new Event('ended')));
    check(await page.locator('#motivation-progress').innerText()===`Fragmento ${i+1} de 4`,'Evento duplicado no avanza '+i);
   }
   await page.locator('#motivation-next').click();
   await page.waitForFunction(()=>document.getElementById('motivation-dialog').dataset.phase==='case');
   check(await page.locator('#motivation-question').innerText()===instagram.questions[0].question,'Cuarto video conduce a Instagram');
   await page.locator('video').evaluate(v=>v.dispatchEvent(new Event('ended')));
   check(await page.locator('#motivation-dialog').getAttribute('data-phase')==='case','Evento tardío del video no interrumpe Instagram');
   for(let i=0;i<instagram.questions.length;i++){
    if(i)await page.locator('#motivation-next').click();
    check(await page.locator('#motivation-question').innerText()===instagram.questions[i].question,'Pregunta Instagram '+i);
    check(await page.locator('#motivation-case').isVisible()&&!await page.locator('video').isVisible(),'Publicación sustituye video '+i);
    check(await page.locator('.context-evidence').count()===(i>=3?3:0),'Evidencias se revelan después de discutir '+i);
    check(await page.locator('.context-comments').count()===(i===1?1:0),'Comentarios recreados solo en su pregunta '+i);
    check(await page.locator('video').evaluate(v=>v.paused&&!v.getAttribute('src')),'Sin audio residual '+i);
    await page.screenshot({path:path.join(evidence,`instagram-${i+1}-${width}.png`),fullPage:true});
   }
   await page.locator('#motivation-repeat').click();
   check(await page.locator('#motivation-dialog').getAttribute('data-case-step')==='0'&&!await page.locator('.context-evidence').count(),'Volver a publicación oculta las evidencias');
   for(let i=0;i<6;i++)await page.locator('#motivation-next').click();
   check(!await page.locator('dialog#motivation-dialog').evaluate(d=>d.open),'Instagram termina y vuelve a la clase');
   await page.locator('#start-motivation').click();
   await page.waitForFunction(()=>document.getElementById('motivation-video').currentTime>.25);
  }
  await page.locator('#motivation-comment').click();
  check(await page.locator('#motivation-question').innerText()===data.fragments[0].question&&await page.locator('video').evaluate(v=>v.paused),'Pausa manual '+width);
  await page.screenshot({path:path.join(evidence,`pregunta-${width}.png`),fullPage:true});
  await page.locator('#motivation-repeat').click();
  await page.waitForFunction(()=>{const v=document.getElementById('motivation-video');return !v.paused&&v.currentTime>.1;});
  check(await page.locator('#motivation-dialog').getAttribute('data-phase')==='playing','Repetir restablece reproducción '+width);
  await page.locator('#motivation-title').click();await page.keyboard.press('ArrowRight');
  check(await page.locator('#counter').innerText()==='1 / 21','Teclado no navega detrás del video '+width);
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>!document.getElementById('motivation-dialog').open&&!document.getElementById('motivation-video').getAttribute('src'));
  check(!await page.locator('#motivation-dialog').evaluate(d=>d.open)&&await page.locator('video').evaluate(v=>v.paused&&!v.getAttribute('src')),'Cerrar corta audio y descarga '+width);
  check(!requests.some(r=>r.method==='POST'||/youtube|firebase/.test(new URL(r.url).hostname)),'Solo proyección, sin escritura ni dependencia de YouTube '+width);
  await page.locator('#start-motivation').click();
  for(let i=0;i<4;i++){
   await page.waitForFunction(()=>document.getElementById('motivation-dialog').dataset.phase==='playing');
   await page.locator('#motivation-comment').click();await page.locator('#motivation-next').click();
  }
  await page.waitForFunction(()=>document.getElementById('motivation-dialog').dataset.phase==='case');
  for(let i=0;i<6;i++){
   check(!await page.locator('#motivation-dialog').evaluate(d=>d.scrollWidth>d.clientWidth+1),'Instagram sin desborde '+width+' '+i);
   check(await page.locator('#motivation-question').innerText()===instagram.questions[i].question,'Secuencia completa '+width+' '+i);
   if(i===1||i===3)await page.screenshot({path:path.join(evidence,`instagram-${i+1}-${width}-responsive.png`),fullPage:true});
   await page.locator('#motivation-next').click();
  }
  check(!await page.locator('#motivation-dialog').evaluate(d=>d.open),'Cierre de Instagram '+width);
  await page.close();
 }
 const p=await browser.newPage();
 await p.goto(`${origin}/${base}/`,{waitUntil:'networkidle'});
 await p.locator('#start-motivation').click();await p.waitForFunction(()=>document.getElementById('motivation-video').currentTime>.1);
 await p.locator('video').evaluate(v=>v.dispatchEvent(new Event('error')));
 check((await p.locator('#motivation-note').innerText()).includes('Abre el original')&&await p.locator('#motivation-next').isVisible(),'Fallo de video conserva fuente y preguntas');
 await p.locator('#motivation-close').click();await p.close();
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'scripts/academic-release-manifest.json'),'utf8'));
 const assets=['motivacion.js','motivacion.css','assets/videos-motivacion.json','assets/instagram-contexto.json','assets/rem-septiembre-2026-bcra.pdf',...data.fragments.map(f=>f.file)];
 for(const file of assets){
  check(manifest.criticalFiles.some(f=>f.path===base+'/'+file),'Recurso protegido '+file);
  if(publicMode){const response=await fetch(`${origin}/${base}/${file}`);check(response.ok,'Recurso público '+file);const bytes=Buffer.from(await response.arrayBuffer());check(crypto.createHash('sha256').update(bytes).digest('hex')===crypto.createHash('sha256').update(fs.readFileSync(path.join(root,base,file))).digest('hex'),'Recurso exacto '+file);}
 }
 check(errors.length===0,'Sin errores JavaScript/HTTP: '+errors.join('\n'));
 fs.writeFileSync(path.join(evidence,'resultado.json'),JSON.stringify({origin,checks,errors,passed:true},null,2));
 console.log(JSON.stringify({origin,checks,errors,evidence,passed:true}));
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));});
