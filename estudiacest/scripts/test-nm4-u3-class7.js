'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {chromium}=require('playwright');const {PDFDocument}=require('pdf-lib');
const root=path.resolve(__dirname,'..'),prefix='/nm4/u3-clase7-manual-ilustrado/';
const courses=['4A','4B','4C','4D','4E'];
const requestedCourse=process.argv.find(value=>value.startsWith('--course='))?.slice(9);
const selectedCourses=requestedCourse?[requestedCourse]:courses;
const requestedWidth=process.argv.find(value=>value.startsWith('--width='))?.slice(8);
const widths=requestedWidth?[Number(requestedWidth)]:[320,390,1440,3840];
if(selectedCourses.some(course=>!courses.includes(course))||widths.some(width=>![320,390,1440,3840].includes(width)))throw new Error('Curso o ancho de prueba no válido.');
const diagrams={'4A':'plano-taladro-ia.webp','4B':'plano-gato-ia.webp','4C':'plano-multimetro-ia.webp','4D':'plano-impresora3d-ia.webp','4E':'plano-estacion-ia.webp'};
const originals={'4A':'taladro.png','4B':'gato-dimensiones.png','4C':'multimetro.jpg','4D':'impresora3d.jpg','4E':'estacion-soldadura.jpg'};
const output=fs.mkdtempSync(path.join(os.tmpdir(),'nm4-manual-qa-'));
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.pdf':'application/pdf'};
let server;const requested=process.argv.find(x=>x.startsWith('--origin='));const presentationOnly=process.argv.includes('--presentation-only');
async function main(){
 let origin=requested?.slice(9);
 if(!origin){server=http.createServer((req,res)=>{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let target=path.resolve(root,'.'+pathname);if(!target.startsWith(root+path.sep)&&target!==root){res.writeHead(403);return res.end();}if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');if(!fs.existsSync(target)){res.writeHead(404);return res.end();}res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream'});fs.createReadStream(target).pipe(res);});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));origin=`http://127.0.0.1:${server.address().port}`;}
 const browser=await chromium.launch({headless:true});const failures=[];let checks=0;
 try{
  for(const width of widths){
   const page=await browser.newPage({viewport:{width,height:width===3840?2160:width===1440?900:844},acceptDownloads:true});const errors=[];
   page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.url().startsWith(origin)&&response.status()>=400)errors.push(`HTTP ${response.status()} ${new URL(response.url()).pathname}`);});
   for(const course of selectedCourses){
    const brief=['4C','4D'].includes(course),total=brief?8:9,worksheetSlide=brief?6:7,guideCounter=`${worksheetSlide+1} / ${total}`;
    await page.goto(`${origin}${prefix}?curso=${course}`,{waitUntil:'networkidle'});
    if(await page.locator('#course').inputValue()!==course)throw new Error('Curso inicial incorrecto');
    if(await page.locator('#course option').count()!==5)failures.push('No están los cinco cursos en el selector.');
    const flow=await page.evaluate(()=>[...document.querySelectorAll('.slide:not([hidden])')].map(el=>({stage:el.dataset.stage,opening:el.dataset.opening||null,minutes:Number(el.dataset.minutes),commands:el.querySelectorAll('ol.steps>li:not([hidden])').length,title:el.classList.contains('title-slide'),separator:el.classList.contains('phase-slide'),model:el.hasAttribute('data-model-comparison')})));
    const expectedStages=brief?'inicio,inicio,inicio,inicio,desarrollo,desarrollo,desarrollo,cierre':'inicio,inicio,inicio,inicio,desarrollo,desarrollo,desarrollo,desarrollo,cierre';
    if(flow.length!==total||flow.map(x=>x.stage).join(',')!==expectedStages||flow.slice(1,4).map(x=>x.opening).join(',')!=='activation,norms,objective'||flow.map(x=>x.minutes).join(',')!==(brief?'0,5,2,3,0,5,65,10':'0,5,2,3,0,5,10,55,10')||flow.reduce((total,x)=>total+x.minutes,0)!==90||flow.some(x=>!x.title&&!x.separator&&x.opening!=='objective'&&x.commands<(brief&&x.model?2:3)))failures.push(`${width}/${course}: secuencia, inicio separado o consignas incompletas`);checks++;
    const presentationContract=await page.evaluate(()=>{
     const slides=[...document.querySelectorAll('.slide:not([hidden])')],worksheet=document.querySelector('[data-worksheet-instructions]'),closing=slides.at(-1),text=el=>el.textContent.replace(/\s+/g,' ').trim(),brief=document.body.dataset.manualFlow==='brief';
     return {title:text(slides[0]),titleOnly:slides[0].querySelector('.slide-inner').children.length===1&&!!slides[0].querySelector('h1'),opening:text(slides[1]),objectiveOnly:!text(slides[3]).includes('Hoy harán')&&!text(slides[3]).includes('Formen tríos'),separator:text(slides[4]),separatorOnly:slides[4].querySelector('.slide-inner').children.length===1,worksheets:document.querySelectorAll('[data-worksheet-instructions]').length,sheets:[...worksheet.querySelectorAll('[data-worksheet-page]')].map(el=>el.dataset.worksheetPage).join(','),delivery:text(worksheet).includes(brief?'Cada grupo trabaja en su guía impresa.':'El docente entrega las tres hojas.'),closureTitle:closing.querySelector('h2').textContent,closure:[...closing.querySelectorAll('ol.steps>li:not([hidden])')].map(text),closureOnly:closing.querySelector('.slide-inner').children.length===2,peer:slides.some(el=>text(el).includes('Revisen con otro grupo')||text(el).includes('Intercambien los borradores'))};
    });
    const closure=brief?[
     'Una persona por grupo leerá sus respuestas cuando el docente lo indique.',
     'Comprueben: ¿lo entiende alguien que no conoce el equipo? Si una frase no se entiende, corríjanla.',
     'Guarden la guía para continuar en la clase 2.'
    ]:[
     'Revisión o plenario: compartan una frase corregida. Comprueben que conserva la información y orienta al principiante.',
     'Sistematización: leer → identificar acción y riesgo → reescribir → comprobar.',
     'Metacognición: cada integrante escriba en su cuaderno qué frase cambió, por qué y cómo comprobó su sentido.',
     'Muestren las tres páginas y su duda al docente. Guarden el borrador para la clase 2.'
    ];
    if(presentationContract.title!=='Manual ilustrado para un principiante'||!presentationContract.titleOnly||presentationContract.opening.includes('Activación')||!presentationContract.opening.includes('¿Qué la hace entendible o fácil de comprender?')||!presentationContract.objectiveOnly||presentationContract.separator!=='ACTIVIDAD'||!presentationContract.separatorOnly||presentationContract.worksheets!==1||presentationContract.sheets!=='1,2,3'||!presentationContract.delivery||presentationContract.closureTitle!==(brief?'Lean sus respuestas':'Revisión y metacognición')||JSON.stringify(presentationContract.closure)!==JSON.stringify(closure)||!presentationContract.closureOnly||presentationContract.peer)failures.push(`${width}/${course}: no se cumple la nueva estructura solicitada`);checks++;
    const teaching=await page.evaluate(()=>({opening:[...document.querySelectorAll('[data-opening]')].map(el=>el.dataset.opening).join(','),objective:document.querySelector('[data-lesson-objective]').textContent,monitoring:!!document.querySelector('[data-monitoring]'),closing:[...document.querySelectorAll('[data-closing]:not([hidden])')].map(el=>el.dataset.closing).join(',')}));
    if(teaching.opening!=='activation,norms,objective'||!teaching.objective.startsWith('Reescribir ')||!teaching.monitoring||teaching.closing!==(brief?'review,synthesis':'review,synthesis,metacognition'))failures.push(`${width}/${course}: estructura didáctica o infinitivo incorrectos`);checks++;
    const briefProof=await page.evaluate(()=>({scope:document.body.dataset.manualFlow,practice:!!document.querySelector('.slide[data-extended-only]:not([hidden])'),detail:!!document.querySelector('[data-model-comparison] a:not([hidden])'),audience:document.querySelector('[data-opening="objective"] [data-brief-only]')?.hidden,extra:!!document.querySelector('[data-closing="metacognition"]:not([hidden])'),clock:document.querySelector('main').textContent.includes('11:15')}));
    if(briefProof.scope!==(brief?'brief':'standard')||briefProof.practice===brief||briefProof.detail===brief||briefProof.audience===brief||briefProof.extra===brief||briefProof.clock)failures.push(`${width}/${course}: alcance o simplificación incorrectos ${JSON.stringify(briefProof)}`);checks++;
    if(await page.locator('.slide[data-opening="norms"] .steps>li').last().textContent()!=='No se permite el uso de celular para juegos o redes sociales. Solo se permite para la actividad.')failures.push(`${width}/${course}: norma de uso de celular incorrecta`);checks++;
    for(let slide=0;slide<flow.length;slide++){
     await page.locator('.slide.active').waitFor();
     await page.waitForFunction(()=>[...document.querySelectorAll('.slide.active img')].every(img=>img.complete&&img.naturalWidth>0),{},{timeout:10000});
     const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,images:[...document.querySelectorAll('.slide.active img')].every(img=>img.complete&&img.naturalWidth>0),counter:document.querySelector('#counter').textContent}));
     if(layout.overflow||!layout.images||layout.counter!==`${slide+1} / ${flow.length}`)failures.push(`${width}/${course}/pantalla ${slide+1}: ${JSON.stringify(layout)}`);
     if(slide===worksheetSlide){
      for(let guidePage=1;guidePage<=5;guidePage++){
       await page.locator(`[data-guide-page="${guidePage}"]`).click();
       await page.waitForFunction(()=>{const img=document.querySelector('[data-guide-preview]');return img.complete&&img.naturalWidth===1200;});
       const guide=await page.evaluate(()=>{
        const image=document.querySelector('[data-guide-preview]'),paper=document.querySelector('.guide-paper').getBoundingClientRect(),active=document.querySelector('.slide.active'),markers=[...document.querySelectorAll('[data-guide-marker]')];
        return {file:new URL(image.src).pathname,counter:document.querySelector('#counter').textContent,selected:[...document.querySelectorAll('[data-guide-page][aria-pressed="true"]')].map(el=>el.dataset.guidePage),parameter:new URL(location.href).searchParams.get('guia'),markers:markers.length,callouts:document.querySelectorAll('[data-guide-callout]').length,sources:[...document.querySelectorAll('.guide-source')].every(el=>el.textContent.startsWith('De dónde: ')),inside:markers.every(el=>{const r=el.getBoundingClientRect();return r.left>=paper.left&&r.right<=paper.right&&r.top>=paper.top&&r.bottom<=paper.bottom;}),arrows:markers.every(el=>getComputedStyle(el,'::before').borderRightStyle==='solid'),open:new URL(document.querySelector('[data-guide-open]').href).pathname,pdf:new URL(document.querySelector('[data-course-pdf="completa"]').href).pathname,overflow:document.documentElement.scrollWidth>innerWidth+1,fit:active.scrollHeight<=active.clientHeight+2&&active.querySelector('[data-monitoring]').getBoundingClientRect().bottom<=document.querySelector('.nav-bar').getBoundingClientRect().top};
       });
       const expected=`${prefix}assets/guia-${course.toLowerCase()}-vista-${guidePage}.webp`;
       if(guide.file!==expected||guide.open!==expected||!guide.pdf.endsWith(`guia-${course.toLowerCase()}-completa.pdf`)||guide.counter!==guideCounter||guide.selected.join(',')!==String(guidePage)||guide.parameter!==String(guidePage)||guide.markers!==(guidePage===1?4:3)||guide.callouts!==guide.markers||!guide.sources||!guide.inside||!guide.arrows||guide.overflow||(width>=1440&&!guide.fit))failures.push(`${width}/${course}/guía ${guidePage}: ${JSON.stringify(guide)}`);checks++;
       if(['4C','4D','4E'].includes(course)&&[390,1440,3840].includes(width))await page.screenshot({path:path.join(output,`${course}-${width}-guia-${guidePage}.png`),fullPage:true});
      }
      await page.reload({waitUntil:'networkidle'});
      if(await page.locator('#counter').textContent()!==guideCounter||await page.locator('[data-guide-page="5"]').getAttribute('aria-pressed')!=='true'||new URL(page.url()).searchParams.get('slide')!=='8')failures.push(`${width}/${course}: no persiste la guía dentro de la diapositiva`);checks++;
      const neighbor=courses[(courses.indexOf(course)+1)%courses.length];await page.locator('#course').selectOption(neighbor);
      if(!(await page.locator('[data-guide-preview]').getAttribute('src')).endsWith(`guia-${neighbor.toLowerCase()}-vista-5.webp`)||await page.locator('[data-guide-page="5"]').getAttribute('aria-pressed')!=='true'||await page.locator('#counter').textContent()!==( ['4C','4D'].includes(neighbor)?'7 / 8':'8 / 9'))failures.push(`${width}/${course}: el cambio de curso perdió la página de la guía`);checks++;
      await page.locator('#course').selectOption(course);await page.locator('[data-guide-page="1"]').click();
      await page.waitForFunction(()=>{const img=document.querySelector('[data-guide-preview]');return img.complete&&img.naturalWidth===1200;});
     }
     if(slide===worksheetSlide&&width>=1440){
      const fit=await page.locator('.slide.active').evaluate(el=>({scroll:el.scrollHeight,height:el.clientHeight,bottom:el.querySelector('[data-monitoring]').getBoundingClientRect().bottom,nav:document.querySelector('.nav-bar').getBoundingClientRect().top}));
      if(fit.scroll>fit.height+2||fit.bottom>fit.nav)failures.push(`${width}/${course}: las instrucciones no caben completas ${JSON.stringify(fit)}`);checks++;
     }
     const screenshotNames={0:'titulo',1:'pregunta',2:'normas',3:'objetivo',4:'actividad',5:'modelo',[worksheetSlide]:'hojas',[total-1]:'cierre'};
     if(Object.hasOwn(screenshotNames,slide)&&[390,1440,3840].includes(width))await page.screenshot({path:path.join(output,`${course}-${width}-${screenshotNames[slide]}.png`),fullPage:true});
     if(slide<flow.length-1)await page.getByRole('button',{name:'Diapositiva siguiente'}).click();checks++;
    }
    await page.reload({waitUntil:'networkidle'});if(await page.locator('#counter').textContent()!==`${total} / ${total}`)failures.push('No persiste la pantalla al recargar.');
    const other=courses[(courses.indexOf(course)+1)%courses.length];await page.locator('#course').selectOption(other);
    const otherTotal=['4C','4D'].includes(other)?8:9;
    if(!page.url().includes(`curso=${other}`)||await page.locator('#counter').textContent()!==`${otherTotal} / ${otherTotal}`)failures.push('El cambio de curso perdió la pantalla.');
    await page.getByRole('link',{name:'Las cuatro clases',exact:true}).click();
    if(!page.url().includes(`curso=${other}`)||!new URL(page.url()).pathname.endsWith('/proyecto.html'))failures.push('El enlace al proyecto perdió el curso.');checks++;
    if(presentationOnly)continue;
    for(const doc of ['lectura.html','plantilla.html','modelo.html','docente.html','proyecto.html','manual-final.html']){
     await page.goto(`${origin}${prefix}${doc}?curso=${course}`,{waitUntil:'networkidle'});
     const healthy=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1&&[...document.images].every(img=>img.complete&&img.naturalWidth>0));
     if(!healthy)failures.push(`${width}/${course}/${doc}: desborde o imagen rota`);checks++;
     const visuals=await page.evaluate(()=>({svg:[...document.images].some(img=>new URL(img.src).pathname.endsWith('.svg')),ai:[...document.images].filter(img=>img.src.includes('-ia.webp')).every(img=>img.naturalWidth===1536&&img.naturalHeight===1024)}));
     if(visuals.svg||!visuals.ai)failures.push(`${width}/${course}/${doc}: imagen antigua o dimensión IA inválida`);checks++;
     if(doc==='proyecto.html'){
      if(await page.locator('[id^="sesion-"] .lesson-result').count()!==4||await page.locator('[id^="sesion-"] ol.steps').count()!==4)failures.push('Falta una consigna o resultado de las cuatro clases.');checks++;
     }
     if(doc==='docente.html'){
      const lessons=await page.locator('[data-project-session]').evaluateAll(elements=>elements.map(el=>({objective:el.textContent.includes('Objetivo:'),check:el.textContent.includes('Comprobación:'),phases:[...el.querySelectorAll('[data-phase]')].map(x=>x.dataset.phase).join(','),minutes:[...el.querySelectorAll('[data-minutes]')].reduce((sum,x)=>sum+Number(x.dataset.minutes),0),opening:[...el.querySelectorAll('[data-opening]')].map(x=>x.dataset.opening).join(','),closing:[...el.querySelectorAll('[data-closing]')].map(x=>x.dataset.closing).join(',')})));
      if(lessons.length!==4||lessons.some(x=>!x.objective||!x.check||x.phases!=='inicio,desarrollo,cierre'||x.minutes!==90||x.opening!=='activation,norms,objective'||x.closing!=='review,synthesis'))failures.push('Planificación incompleta.');checks++;
     }
     if(doc==='lectura.html'){
      const completeDownloadPromise=page.waitForEvent('download');await page.locator('[data-course-pdf="completa"]').click();const completeDownload=await completeDownloadPromise;
      const completeBytes=fs.readFileSync(path.join(root,prefix.slice(1),'assets',`guia-${course.toLowerCase()}-completa.pdf`)),completePDF=await PDFDocument.load(completeBytes);
      if(await completeDownload.failure()||!fs.readFileSync(await completeDownload.path()).equals(completeBytes)||completePDF.getPageCount()!==5||!completePDF.getTitle().includes(course)||completePDF.getPages().some(p=>Math.abs(p.getWidth()-595.28)>1||Math.abs(p.getHeight()-841.89)>1))failures.push(`${width}/${course}: lectura y borrador no descargan la guía A4 de cinco páginas correcta`);checks++;
      if(await page.locator('[data-vocabulary]>p').count()!==4)failures.push('Glosario incompleto.');checks++;
      const reference=new URL(await page.locator('[data-original-photo]').getAttribute('href'),page.url());
      if(!reference.pathname.endsWith('/assets/'+originals[course]))failures.push('La referencia original no corresponde al curso.');checks++;
     }
     if(doc==='plantilla.html'){
      if(!(await page.locator('main').textContent()).includes('Muestren el borrador al docente y guárdenlo'))failures.push('Entrega del borrador ambigua.');checks++;
      const guide=await page.evaluate(()=>({headers:[...document.querySelectorAll('.school-letterhead')].map(el=>({school:el.textContent.includes('CENTRO EDUCATIVO SALESIANOS TALCA'),logos:[...el.querySelectorAll('img')].map(img=>new URL(img.src).pathname),loaded:[...el.querySelectorAll('img')].every(img=>img.complete&&img.naturalWidth>0)})),students:document.querySelectorAll('.student-line').length,fields:['Fecha:','Grupo:','Objetivo:','Instrucciones:','OA 5 y OA 6'].every(text=>document.querySelector('main').textContent.includes(text)),course:[...document.querySelectorAll('[data-course-name]')].every(el=>el.textContent===document.querySelector('#course option:checked').textContent)}));
      if(guide.headers.length!==3||guide.headers.some(h=>!h.school||!h.loaded||h.logos.join(',')!=='/estudiantes/assets/insignia_talca_1.png,/estudiantes/assets/sdb-logo-big.png')||guide.students!==3||!guide.fields||!guide.course)failures.push(`${width}/${course}: membrete o elementos de la guía incompletos`);checks++;
     }
     if(['plantilla.html','manual-final.html'].includes(doc)){
      const expected=doc==='plantilla.html'?3:6,kind=doc==='plantilla.html'?'borrador':'final';
      const fullLetterhead=await page.evaluate(()=>[...document.querySelectorAll('.guide-sheet')].every(sheet=>{const header=sheet.querySelector('.school-letterhead');return header?.querySelectorAll('.school-contact').length===4&&['2 SUR 1147','2615416 · 2615410','11 ORIENTE 1751','2615454 · 2615457','www.salesianostalca.cl','cest@salesianostalca.cl','TALCA - REGIÓN DEL MAULE - CHILE'].every(text=>header.textContent.includes(text))&&sheet.querySelector('.school-motto')?.textContent==='EDUCAR EVANGELIZANDO Y EVANGELIZAR EDUCANDO, MEDIANTE UNA FORMACIÓN CONTINUA Y DE CALIDAD';}));
      if(!fullLetterhead)failures.push(`${width}/${course}/${doc}: membrete del primer semestre incompleto`);checks++;
      const printable=await page.evaluate(()=>({headers:document.querySelectorAll('.school-letterhead').length,logos:[...document.querySelectorAll('.school-letterhead')].every(el=>el.querySelectorAll('img').length===2),students:document.querySelectorAll('.student-line').length,backgroundRulers:document.querySelectorAll('.writing-space').length,objective:[...document.querySelectorAll('.guide-objective')].every(el=>/Objetivo:\s*(Reescribir|Elaborar)/.test(el.textContent))}));
      if(printable.headers!==expected||!printable.logos||printable.students!==3||printable.backgroundRulers||!printable.objective)failures.push(`${width}/${course}/${doc}: no tiene formato de guía institucional`);checks++;
      const pdfDownloadPromise=page.waitForEvent('download');await page.locator(`[data-course-pdf="${kind}"]`).click();const pdfDownload=await pdfDownloadPromise;
      const localPDF=fs.readFileSync(path.join(root,prefix.slice(1),'assets',`guia-${course.toLowerCase()}-${kind}.pdf`));
      if(await pdfDownload.failure()||!fs.readFileSync(await pdfDownload.path()).equals(localPDF))failures.push(`${course}/${kind}: PDF descargado incorrecto`);
      const saved=await PDFDocument.load(localPDF);
      if(saved.getPageCount()!==expected||!saved.getTitle().includes(course)||saved.getPages().some(p=>Math.abs(p.getWidth()-595.28)>1||Math.abs(p.getHeight()-841.89)>1))failures.push(`${course}/${kind}: el PDF no es A4 o no corresponde al curso`);checks++;
     }
     if(width===1440&&['plantilla.html','modelo.html','manual-final.html'].includes(doc)){
      await page.emulateMedia({media:'print'});
      const pdf=await page.pdf({preferCSSPageSize:true,printBackground:true});fs.writeFileSync(path.join(output,`${course}-${doc.replace('.html','.pdf')}`),pdf);
      const expectedPages=doc==='manual-final.html'?6:doc==='plantilla.html'?3:2;
      if((await PDFDocument.load(pdf)).getPageCount()!==expectedPages)failures.push(`${course}/${doc}: impresión distinta de ${expectedPages} páginas`);
      const cuts=await page.evaluate(()=>[...document.querySelectorAll('.sheet')].map(el=>({overflow:el.scrollHeight>el.clientHeight+2,scroll:el.scrollHeight,height:el.clientHeight})));if(cuts.some(x=>x.overflow))failures.push(`${course}/${doc}: contenido cortado ${JSON.stringify(cuts)}`);
      if(doc==='plantilla.html'){
       const handwriting=await page.evaluate(()=>({lines:[...document.querySelectorAll('.answer-lines>span')].map(el=>({height:el.getBoundingClientRect().height,border:getComputedStyle(el).borderBottomStyle})),functions:[...document.querySelectorAll('.part-function')].map(el=>({width:el.getBoundingClientRect().width,lines:el.children.length})),full:[...document.querySelectorAll('.guide-task .answer-lines')].every(el=>el.getBoundingClientRect().width>=640),table:document.querySelector('.parts-answer-table').scrollWidth<=document.querySelector('.parts-answer-table').clientWidth+1}));
       if(handwriting.lines.length<50||handwriting.lines.some(x=>x.height<26||x.border!=='solid')||handwriting.functions.length!==6||handwriting.functions.some(x=>x.width<390||x.lines!==3)||!handwriting.full||!handwriting.table)failures.push(`${course}: espacios de escritura insuficientes ${JSON.stringify(handwriting)}`);checks++;
       const noBackground=await page.pdf({preferCSSPageSize:true,printBackground:false});fs.writeFileSync(path.join(output,`${course}-plantilla-sin-fondos.pdf`),noBackground);if((await PDFDocument.load(noBackground)).getPageCount()!==3)failures.push(`${course}: impresión sin fondos distinta de tres páginas`);checks++;
      }
      if(doc==='manual-final.html'){
       const realLines=await page.locator('.answer-lines>span').evaluateAll(els=>els.every(el=>el.getBoundingClientRect().height>=26&&getComputedStyle(el).borderBottomStyle==='solid'));
       if(!realLines)failures.push(`${course}: la guía final tiene renglones insuficientes`);
       const noBackground=await page.pdf({preferCSSPageSize:true,printBackground:false});fs.writeFileSync(path.join(output,`${course}-final-sin-fondos.pdf`),noBackground);if((await PDFDocument.load(noBackground)).getPageCount()!==6)failures.push(`${course}: guía final sin fondos distinta de seis páginas`);checks++;
      }
      await page.emulateMedia({media:'screen'});
      await page.screenshot({path:path.join(output,`${course}-${doc.replace('.html','.png')}`),fullPage:true});
     }
    }
    await page.goto(`${origin}${prefix}lectura.html?curso=${course}`,{waitUntil:'networkidle'});const downloadPromise=page.waitForEvent('download');await page.getByRole('link',{name:'Descargar plano',exact:true}).click();const download=await downloadPromise;
    const expectedFile=diagrams[course];
    if(![`${course}-diagram.webp`,expectedFile].includes(download.suggestedFilename()))failures.push('El nombre de la descarga no corresponde al curso');
    if(await download.failure())failures.push('Falló la descarga del plano');
    else if(!fs.readFileSync(await download.path()).equals(fs.readFileSync(path.join(root,'nm4/u3-clase7-manual-ilustrado/assets',expectedFile))))failures.push('El contenido del plano descargado no corresponde al curso');checks++;
   }
   if(errors.length)failures.push(...errors);await page.close();
  }
  const page=await browser.newPage();await page.goto(`${origin}/nm4/`,{waitUntil:'networkidle'});for(const course of courses)if(await page.locator(`a[href="${prefix}?curso=${course}"]`).count()!==1)failures.push(`Portada: acceso ausente ${course}`);await page.close();
 }finally{await browser.close();if(server)await new Promise(resolve=>server.close(resolve));}
 const result={origin,mode:presentationOnly?'presentation':'full',courses:selectedCourses,widths,checks,output,failures};
 fs.writeFileSync(path.join(output,'resultado.json'),JSON.stringify(result,null,2));
 console.log(JSON.stringify(result,null,2));if(failures.length)process.exitCode=1;
}
main().catch(error=>{console.error(error);if(server)server.close();process.exitCode=1;});
