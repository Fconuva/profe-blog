'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const cierre = Date.parse('2026-10-24T00:00:00-03:00');

async function main() {
  let server;
  let origin = process.env.TERMAS_CHECK_ORIGIN;
  const evidence = fs.mkdtempSync(path.join(os.tmpdir(), 'termas-plazo-'));
  if (!origin) {
    server = http.createServer((req, res) => {
      const route = new URL(req.url, 'http://localhost').pathname;
      const file = path.join(root, route === '/termas/' ? 'termas/index.html' : route.slice(1));
      if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
      const tipos = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
      res.setHeader('Content-Type', tipos[path.extname(file)] || 'application/octet-stream');
      fs.createReadStream(file).pipe(res);
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    origin = `http://127.0.0.1:${server.address().port}`;
  }
  const browser = await chromium.launch({ headless: true });
  try {
    for (const width of [320, 390, 1440, 3840]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      const errors = [];
      const failed = [];
      let escrituras = 0;
      let ahora = cierre - 10000;
      page.on('pageerror', error => errors.push(error.message));
      page.on('requestfailed', req => failed.push(req.url()));
      page.on('response', res => { if (res.status() >= 400) failed.push(`${res.status()} ${res.url()}`); });
      // Dispositivo adelantado: la hora del servidor debe recuperar el formulario.
      await page.clock.install({ time: new Date(cierre + 3600000) });
      // Solo fixtures de navegador. Ninguna petición de inscripción llega al servidor.
      await page.route('**/api/estudiantes?*', route => {
        const accion = new URL(route.request().url()).searchParams.get('action');
        if (accion === 'termas-estado') return route.fulfill({ json: { ok: true, capacidad: 45, asientos: { '7': { ocupado: true, nombre: 'Persona Ficticia' } }, cierreInscripcion: cierre, inscripcionAbierta: ahora < cierre, actualizado: ahora } });
        if (accion === 'termas-mia') return route.fulfill({ json: { ok: true, inscripcion: { nombre: 'Persona', apellido: 'Ficticia', asiste: 'si', transporte: 'personal', comida: 'ninguna' } } });
        escrituras += 1;
        return route.abort();
      });
      await page.goto(origin + '/termas/', { waitUntil: 'networkidle' });
      assert.equal(await page.locator('#plazoSegundos').innerText(), '10');
      assert.equal(await page.locator('#flujo').isVisible(), true);
      assert.equal(await page.locator('#btnConfirmar').isEnabled(), true);
      assert.equal(await page.locator('#chipAsisten, #chipLibres, #cuentaBus, #listaBus').count(), 0);
      await page.locator('label[for="asiste-si"]').click();
      await page.locator('label[for="tr-bus"]').click();
      assert.equal(await page.locator('#bus .asiento[data-n="7"]').getAttribute('aria-label'), 'Asiento 7, reservado por Persona Ficticia');
      await page.locator('#bus .asiento[data-n="8"]').click();
      assert.equal(await page.locator('#eleccionTitulo').innerText(), 'Asiento 8');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      await page.locator('.plazo').scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(evidence, `abierta-${width}.png`) });
      ahora = cierre;
      await page.clock.runFor(10000);
      assert.equal(await page.locator('#plazoTitulo').innerText(), 'Inscripciones cerradas');
      assert.equal(await page.locator('#flujo').isVisible(), false);
      assert.equal(await page.locator('#btnConfirmar').isDisabled(), true);
      assert.equal(await page.locator('#cuentaRegresiva').isVisible(), false);
      await page.evaluate(() => document.querySelector('#flujo').dispatchEvent(new Event('submit', { cancelable: true })));
      assert.equal(escrituras, 0);
      await page.screenshot({ path: path.join(evidence, `cerrada-${width}.png`) });
      await page.evaluate(() => localStorage.setItem('termas2026', JSON.stringify({ correo: 'ficticio@example.test', llave: 'solo-fixture' })));
      await page.reload({ waitUntil: 'networkidle' });
      await page.locator('#pase').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#plazoTitulo').innerText(), 'Inscripciones cerradas');
      assert.equal(await page.locator('#btnModificar').isVisible(), false);
      assert.match(await page.locator('#paseTitulo').innerText(), /Persona Ficticia/);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      assert.equal(escrituras, 0);
      assert.deepEqual(errors, []);
      assert.deepEqual(failed, []);
      console.log(`${width}px: sin totales públicos, asiento con nombre breve y selección libre; reloj, plazo, cierre, recarga y pase conservado; sin desbordes, errores ni escrituras.`);
      await page.close();
    }
    console.log(`Capturas: ${evidence}`);
  } finally {
    await browser.close();
    if (server) await new Promise(resolve => server.close(resolve));
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
