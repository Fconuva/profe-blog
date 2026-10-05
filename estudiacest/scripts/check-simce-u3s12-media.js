'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const http = require('node:http');
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
let origin = (process.env.SIMCE_CHECK_ORIGIN || 'https://www.estudiacest.com').replace(/\/$/, '');
let server;
const files = [
  'estudiantes/guia-u3-s12-entrevista.html',
  'estudiantes/simce-u3-clase12-entrevista/index.html',
  'estudiantes/simce-u3-clase12-entrevista/docente.html',
  'estudiantes/simce-u3-clase12-entrevista/guia-imprimible.pdf',
  'estudiantes/assets/u3s12/modelo-entrevista-para.mp4',
  'estudiantes/assets/u3s12/modelo-entrevista-para.vtt'
];
async function main() {
  const probe = JSON.parse(execFileSync('ffprobe',['-v','quiet','-show_streams','-of','json',path.join(root,files[4])],{encoding:'utf8'}));
  assert.ok(probe.streams.some(stream=>stream.codec_type==='audio'&&stream.codec_name==='aac'),'Falta voz en el MP4');
  assert.equal((fs.readFileSync(path.join(root,files[5]),'utf8').match(/ --> /g)||[]).length,14);
  if(process.argv.includes('--local')) {
    server=http.createServer((req,res)=>{
      let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
      if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
      if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
      if(!fs.existsSync(file)){res.writeHead(404).end();return;}
      res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.png':'image/png','.mp4':'video/mp4','.pdf':'application/pdf'})[path.extname(file)]||'application/octet-stream');
      fs.createReadStream(file).pipe(res);
    });
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    origin=`http://127.0.0.1:${server.address().port}`;
  }
  for (const file of files) {
    const response = await fetch(`${origin}/${file}?revision=${Date.now()}`);
    assert.equal(response.status, 200, file);
    const remote = Buffer.from(await response.arrayBuffer());
    const hash = data => crypto.createHash('sha256').update(data).digest('hex');
    assert.equal(hash(remote), hash(fs.readFileSync(path.join(root, file))), `Fuente pública distinta: ${file}`);
  }
  const browser = await chromium.launch({ headless:true });
  try {
    for (const width of [390, 1440, 3840]) {
      const page = await browser.newPage({ viewport:{ width, height:width === 390 ? 844 : 1080 }, reducedMotion:'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${origin}/estudiantes/simce-u3-clase12-entrevista/`, { waitUntil:'networkidle' });
      assert.equal(await page.locator('.slide').count(), 21);
      for (let slide = 0; slide < 21; slide++) {
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Desborde ${width}, pantalla ${slide+1}`);
        if (slide === 5) {
          const video = page.locator('video');
          await video.evaluate(element => element.load());
          await page.waitForFunction(() => document.querySelector('video').readyState >= 2);
          const result = await video.evaluate(async element => {
            await element.play();
            // El decodificador de audio puede tardar más que 250 ms en iniciar.
            await new Promise((resolve,reject) => {
              const timeout=setTimeout(()=>reject(new Error('El video no avanzó en 10 segundos')),10000);
              const onTime=()=>{if(element.currentTime>0){clearTimeout(timeout);element.removeEventListener('timeupdate',onTime);resolve();}};
              element.addEventListener('timeupdate',onTime);
              onTime();
            });
            const data = { duration:element.duration, width:element.videoWidth, height:element.videoHeight, playing:!element.paused, current:element.currentTime };
            element.pause();
            return data;
          });
          assert.equal(result.duration, 35);
          assert.equal(result.width, 1920);
          assert.equal(result.height, 1080);
          assert.equal(result.playing, true);
          assert.ok(result.current > 0);
        }
        if (slide < 20) await page.locator('#next').click();
      }
      assert.deepEqual(errors, []);
      console.log(`Presentación pública ${width}px: 21 pantallas, sin desborde ni errores, video reproducible.`);
      if(server) {
        await page.goto(`${origin}/estudiantes/guia-u3-s12-entrevista.html?preview=1`,{waitUntil:'networkidle'});
        assert.equal(await page.locator('[data-reading]').count(),3);
        assert.equal(await page.locator('[data-question]').count(),24);
        assert.equal(await page.locator('textarea').count(),9);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
        for(let n=1;n<=24;n++)await page.locator(`[data-question="q${n}"] .option`).first().click();
        for(const id of ['g1','g2','a1','a2','a3','a4','m1','m2','m3'])await page.locator(`#${id}`).fill('Respuesta ficticia para verificar la interfaz y su validación: relaciona la cita y explica sus límites con detalle suficiente.');
        await page.locator('#submit').click();
        assert.match(await page.locator('#saveState').innerText(),/validación está correcta/);
        assert.match(await page.locator('#progressText').innerText(),/24\/24.*6\/6.*3\/3/);
        assert.deepEqual(errors,[]);
        console.log(`Guía local ${width}px: tres lecturas, 24 ítems, nueve campos y validación completa.`);
      }
      await page.close();
    }
  } finally { await browser.close(); }
  console.log('Seis recursos públicos coinciden en SHA-256; MP4 con audio AAC y 14 subtítulos sincronizados.');
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(()=>{if(server)server.close();});
