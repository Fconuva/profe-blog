'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto'),os=require('node:os');
const {execFileSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),base='/nm3/siddhartha-carrete/',remote=process.argv.includes('--public');
const output=fs.mkdtempSync(path.join(os.tmpdir(),'siddhartha-rubrica-'));
let count=0;function check(ok,label){if(!ok)throw Error(label);count++;}
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
async function main(){
 const data=JSON.parse(fs.readFileSync(path.join(root,base,'assets/rubrica-holistica.json'),'utf8'));
 check(data.levels.map(l=>l.level).join(',')==='5,4,3,2,1,0','Six ordered global levels');
 check(data.levels.map(l=>l.points).join(',')==='100,80,60,40,20,0','Unique global scores');
 check(data.grading.passThreshold===60,'Published pass threshold');
 for(const [points,note] of [[100,7],[80,5.5],[60,4],[40,3],[20,2],[0,1]])check(Math.round((points<=60?1+3*points/60:4+3*(points-60)/40)*10)/10===note,'Grade '+points);
 check(data.validation.status.includes('Sin pilotaje ni juicio externo'),'Honest validation scope');
 check(fs.readFileSync(path.join(root,base,'index.html'),'utf8').includes(data.objective),'Objective unchanged');
 check(sha(fs.readFileSync(path.join(root,base,'assets/pauta-siddhartha.pdf')))===sha(fs.readFileSync(path.join(root,base,'assets/rubrica-holistica-siddhartha.pdf'))),'Legacy PDF URL equals holistic rubric');
 const pdfCheck=execFileSync('py',['-3','-c',`import fitz,json,sys
from pathlib import Path
r=Path(sys.argv[1]); data=json.loads((r/'nm3/siddhartha-carrete/assets/rubrica-holistica.json').read_text(encoding='utf-8')); d=fitz.open(r/'nm3/siddhartha-carrete/assets/rubrica-holistica-siddhartha.pdf')
assert len(d)==2
text=' '.join(' '.join(p.get_text().split()) for p in d)
for l in data['levels']: assert ' '.join(l['descriptor'].split()) in text
for i,p in enumerate(d):
 assert abs(p.rect.width-595.28)<1 and abs(p.rect.height-841.89)<1
 assert 'Página '+str(i+1)+' de 2' in p.get_text()
 assert 'CENTRO EDUCATIVO SALESIANOS TALCA' in p.get_text()
 assert 'TALCA - REGIÓN DEL MAULE - CHILE' in p.get_text()
 for b in p.get_text('blocks'): assert b[1]>=26 and b[3]<=817
g=fitz.open(r/'nm3/siddhartha-carrete/assets/guia-siddhartha.pdf'); assert len(g)==6
assert 'un solo nivel' in g[0].get_text(); assert '90 puntos' not in g[0].get_text()
print(json.dumps({'rubricPages':len(d),'guidePages':len(g),'completeDescriptors':6,'a4':True,'bounds':True}))`,root],{encoding:'utf8'});
 check(JSON.parse(pdfCheck).completeDescriptors===6,'PDF A4, complete rows and footer bounds');
 // The original templates, tutorial and illustrations belong to the retained activity.
 for(const f of ['carrete.css','carrete.js','assets/plantillas-siddhartha.pdf','assets/tutorial-siddhartha.mp4',...Array.from({length:5},(_,i)=>'assets/imagen-ia-'+(i+1)+'.jpg')]){
  const original=execFileSync('git',['show','1a4751f6:estudiacest'+base+f],{maxBuffer:25*1024*1024});
  check(sha(original)===sha(fs.readFileSync(path.join(root,base,f))),'Original resource preserved '+f);
 }
 let server;let origin='https://www.estudiacest.com';
 if(!remote){server=http.createServer((req,res)=>{
  let f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f))return res.writeHead(404).end();
  const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.woff2':'font/woff2','.png':'image/png','.jpg':'image/jpeg','.pdf':'application/pdf','.mp4':'video/mp4'};
  res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');
  const size=fs.statSync(f).size,range=req.headers.range?.match(/bytes=(\d+)-(\d*)/);
  if(range){const start=+range[1],end=range[2]?+range[2]:size-1;res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});fs.createReadStream(f,{start,end}).pipe(res);}
  else res.end(fs.readFileSync(f));
 });await new Promise(r=>server.listen(0,'127.0.0.1',r));origin='http://127.0.0.1:'+server.address().port;}
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage(),errors=[],failed=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(origin))failed.push([r.status(),r.url()]);});
  for(const width of [320,390,1440,3840]){
   await page.setViewportSize({width,height:1000});await page.goto(origin+base+'rubrica.html',{waitUntil:'networkidle'});
   check(await page.locator('tr[data-level]').count()===6,'Six descriptions '+width);
   check(await page.locator('.decision').count()===1,'One global score '+width);
   check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow '+width);
   check(await page.locator('.inst-header-table img').evaluateAll(imgs=>imgs.every(im=>im.complete&&im.naturalWidth>0)),'Institution logos '+width);
   await page.screenshot({path:path.join(output,'rubrica-'+width+'.png'),fullPage:true});
  }
  await page.emulateMedia({media:'print'});
  const layout=await page.evaluate(()=>[...document.querySelectorAll('.sheet')].map(s=>{
   const footer=s.querySelector('.footer').getBoundingClientRect(),prior=s.querySelector('.scale-note,.continuation-note').getBoundingClientRect();
   return {safe:prior.bottom<footer.top,sheetHeight:s.getBoundingClientRect().height,logo:getComputedStyle(s.querySelector('.inst-left img')).width,cell:getComputedStyle(s.querySelector('.inst-left')).width,line:getComputedStyle(s.querySelector('.inst-header-line')).borderTopWidth,contentFont:getComputedStyle(s.querySelector('.rubric')).fontFamily,contentSize:getComputedStyle(s.querySelector('.rubric')).fontSize,titleSize:getComputedStyle(s.querySelector('.doc-title')).fontSize};
  }));
  // Chromium rounds a 2.5px border to a device pixel; verify both the declared
  // institutional value and its rendered value, rather than changing the model.
  check(fs.readFileSync(path.join(root,base,'rubrica.css'),'utf8').includes('border-top:2.5px solid'),'Institutional declared line 2.5px');
  for(const s of layout){check(s.safe,'Print footer does not overlap');check(s.logo==='60px'&&s.cell==='75px'&&Math.abs(parseFloat(s.line)-2.5)<=.5,'Institutional print measures');check(s.contentFont.includes('Times New Roman')&&s.contentSize==='16px','Times New Roman 12pt');check(Math.abs(parseFloat(s.titleSize)-18.6667)<.1,'Title 14pt');}
  check(await page.locator('.write-in').first().evaluate(e=>e.getBoundingClientRect().height>=8*96/25.4-.1),'Name >=8mm (layout rounding)');
  check(await page.locator('.lines span').first().evaluate(e=>e.getBoundingClientRect().height>=7*96/25.4-.1),'Response lines >=7mm');
  await page.emulateMedia({media:'screen'});
  for(const width of [390,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(origin+base,{waitUntil:'networkidle'});
   check(await page.locator('#chapters-body tr').count()===12,'Twelve chapters '+width);
   check(await page.getByRole('link',{name:/Rúbrica holística/}).getAttribute('href')==='rubrica.html','Updated class download '+width);
   check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Class width '+width);
  }
  await page.locator('#fotogramas summary').click();await page.locator('#armado summary').click();
  for(const im of await page.locator('img').all())await im.scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>[...document.images].every(im=>im.complete&&im.naturalWidth>0));check(true,'All retained class images load');
  await page.waitForFunction(()=>document.querySelector('video').readyState>=1);
  const video=await page.evaluate(async()=>{let v=document.querySelector('video');v.muted=true;await v.play();let before=v.currentTime;await new Promise(r=>setTimeout(r,1100));let advanced=v.currentTime>before;v.pause();return {advanced,duration:v.duration,error:!!v.error};});
  check(video.advanced&&Math.abs(video.duration-203.68)<1&&!video.error,'Tutorial playback preserved');
  for(const f of ['rubrica.html','rubrica.css','assets/rubrica-holistica.json','assets/rubrica-holistica-siddhartha.pdf','assets/pauta-siddhartha.pdf','assets/guia-siddhartha.pdf','assets/plantillas-siddhartha.pdf','index.html']){
   const response=await page.request.get(origin+base+f);check(response.ok(),'HTTP '+f);check(sha(await response.body())===sha(fs.readFileSync(path.join(root,base,f))),'Published bytes '+f);
  }
  await page.goto(origin+'/nm3/',{waitUntil:'networkidle'});check(await page.locator('a[href="/nm3/siddhartha-carrete/"]').count()>0,'Class card retained');
  check(errors.length===0,'No runtime errors');check(failed.length===0,'No failed page resources');
  if(remote){
   const privateResult=await page.request.get(origin+'/referencias/formato-institucional/VALIDACION_RUBRICA_HOLISTICA_SIDDHARTHA.md');check(privateResult.status()===404,'Internal report remains private');
   for(const route of ['/','/nm4/','/paes/','/3atp/','/4dtp/','/lecturas/','/estudiantes/'])check((await page.request.get(origin+route)).ok(),'Protected portal '+route);
   await page.goto(origin+'/lecturas/');check(await page.locator('input[type="password"]').count()>0,'Common login retained');
  }
  console.log(JSON.stringify({origin,checks:count,pdf:JSON.parse(pdfCheck),video,errors,failed,output}));
 }finally{await browser.close();if(server)await new Promise(r=>server.close(r));}
}
main().catch(e=>{console.error(e);process.exit(1)});
