'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const origin = (process.env.SIMCE_CHECK_ORIGIN || 'https://www.estudiacest.com').replace(/\/$/, '');
const files = [
  'estudiantes/guia-u3-s12-entrevista.html',
  'estudiantes/simce-u3-clase12-entrevista/index.html',
  'estudiantes/simce-u3-clase12-entrevista/docente.html',
  'estudiantes/simce-u3-clase12-entrevista/guia-imprimible.pdf',
  'estudiantes/assets/u3s12/modelo-entrevista-para.mp4'
];
async function main() {
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
      const page = await browser.newPage({ viewport:{ width, height:width === 390 ? 844 : 1080 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${origin}/estudiantes/simce-u3-clase12-entrevista/`, { waitUntil:'networkidle' });
      assert.equal(await page.locator('.slide').count(), 15);
      for (let slide = 0; slide < 15; slide++) {
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Desborde ${width}, pantalla ${slide+1}`);
        if (slide === 5) {
          const video = page.locator('video');
          await video.evaluate(element => element.load());
          await page.waitForFunction(() => document.querySelector('video').readyState >= 2);
          const result = await video.evaluate(async element => {
            await element.play();
            await new Promise(resolve => setTimeout(resolve, 250));
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
        if (slide < 14) await page.locator('#next').click();
      }
      assert.deepEqual(errors, []);
      console.log(`Presentación pública ${width}px: 15 pantallas, sin desborde ni errores, video reproducible.`);
      await page.close();
    }
  } finally { await browser.close(); }
  console.log('Cinco recursos públicos coinciden exactamente en SHA-256 con la fuente local.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
