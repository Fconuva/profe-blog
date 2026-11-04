const {chromium}=require('playwright');
const fs=require('node:fs');
const origin=process.argv[2]||'http://127.0.0.1:8874';
(async()=>{
 const b=await chromium.launch({headless:true});const out=[];
 try{
  for(const width of [390,1366,3840]){
   const page=await b.newPage({viewport:{width,height:950}});const errors=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
   page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});
   for(const route of ['/nm3/','/nm3/mi-dia-en-imagenes/','/nm3/mi-dia-en-imagenes/guia.html']){
    await page.goto(origin+route,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
    const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(x=>!x.complete||x.naturalWidth===0).map(x=>x.src),title:document.title}));
    if(state.overflow||state.broken.length)throw Error(JSON.stringify({width,route,...state}));
    if(route==='/nm3/'){
     await page.locator('#proyecto-mi-dia').scrollIntoViewIfNeeded();
     if(!await page.locator('#proyecto-mi-dia').innerText().then(t=>t.includes('Mi día en imágenes y voz')))throw Error('Tarjeta ausente o texto incorrecto');
    }
    if(route==='/nm3/mi-dia-en-imagenes/'){
     await page.locator('video').evaluate(v=>new Promise((res,rej)=>{if(v.readyState>=1)return res();v.onloadedmetadata=res;v.onerror=()=>rej(Error('No carga el video'));}));
     const v=await page.locator('video').evaluate(v=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight}));
     if(Math.abs(v.duration-300)>.04||v.width!==1280)throw Error(JSON.stringify(v));
     await page.locator('video').evaluate(v=>{v.muted=true;return v.play()});
     await page.waitForFunction(()=>document.querySelector('video').currentTime>0.2);
     await page.locator('video').evaluate(v=>v.pause());
    }
    await page.screenshot({path:`test-results/mi-dia/${origin.includes('127.')?'local':'publico'}-${width}-${route==='/nm3/'?'tarjetas':route.endsWith('guia.html')?'guia':'proyecto'}.png`,fullPage:route.endsWith('guia.html')?false:true});
    out.push({width,route,...state});
   }
   if(errors.length)throw Error(JSON.stringify(errors));
   await page.close();
  }
  const p=await b.newPage();
  const login=await p.goto(origin+'/lecturas/');if(!login.ok())throw Error('Ingreso habitual inaccesible');
  out.push({route:'/lecturas/',status:login.status()});
  fs.writeFileSync('test-results/mi-dia/'+(origin.includes('127.')?'local':'publico')+'.json',JSON.stringify(out,null,2));
  console.log('10 comprobaciones aprobadas: tarjetas, guía, video, ingreso y 390/1366/3840; sin errores de consola, recursos ni desbordes.');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
