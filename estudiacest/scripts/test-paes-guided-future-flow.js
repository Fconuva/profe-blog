'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const shared = fs.readFileSync(path.join(root, 'paes/js/guia-guiada.js'), 'utf8');
const authorized = shared.match(/const AUTHORIZED_RUT = '([^']+)'/);
if (!authorized) throw new Error('No se encontró el acceso individual configurado.');

const baseUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173';
const attempts = new Map();
let blockMode = false;

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));

  if (process.env.REAL_BLOCK_ONLY === '1') {
    await page.goto(`${baseUrl}/paes/guia31-guiada.html`, { waitUntil: 'networkidle' });
    await page.fill('#rutInput', authorized[1]);
    await page.click('#loginForm button[type="submit"]');
    await page.locator('#errorBox.show').waitFor({ state: 'visible' });
    const blockedText = await page.locator('#errorBox').textContent();
    if (!/se habilitará cuando corresponda/i.test(blockedText || '')) throw new Error('La API real no mantuvo bloqueada la guía futura.');
    await browser.close();
    if (errors.length) throw new Error(`Errores de consola: ${errors.join(' | ')}`);
    console.log('OK: acceso futuro bloqueado por la API real, sin escribir respuestas.');
    return;
  }

  await page.route('**/api/paes**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const action = url.searchParams.get('action');
    if (action === 'get-nomina-extra') return route.fulfill({ json: { nomina_extra: [] } });
    if (action === 'get-guias-config') {
      const blocked = blockMode ? { g31: true } : {};
      return route.fulfill({ json: { success: true, config: { blocked, allowed: {} } } });
    }
    if (action === 'get-guia-state') {
      const guideId = url.searchParams.get('guiaId');
      return route.fulfill({ json: { success: true, attempt: attempts.get(guideId) || null, released: false } });
    }
    if (action === 'submit-guia') {
      const body = JSON.parse(request.postData() || '{}');
      if (!body.draft) {
        attempts.set(String(body.guiaId), {
          answers: body.answers,
          variant: 'guided-access-2026',
          submitted: true,
          completada: true,
          status: 'sent',
          completadaAt: Date.now()
        });
      }
      return route.fulfill({ json: body.draft ? { success: true, completada: false } : { success: true, completada: true, submittedAt: Date.now() } });
    }
    return route.fulfill({ status: 404, json: { error: 'Ruta simulada no definida' } });
  });

  await page.goto(`${baseUrl}/paes/guia20-guiada.html`, { waitUntil: 'networkidle' });
  await page.fill('#rutInput', authorized[1]);
  await page.click('#loginForm button[type="submit"]');
  await page.locator('#sessionSection').waitFor({ state: 'visible' });
  await page.locator('.guided-visual-card img').waitFor({ state: 'visible' });

  const imageLoaded = await page.locator('.guided-visual-card img').evaluate((image) => image.complete && image.naturalWidth >= 1200);
  if (!imageLoaded) throw new Error('El apoyo visual de la Guía 20 no cargó en alta resolución.');
  if (await page.locator('.read-aloud').count() < 1) throw new Error('Falta el control de lectura en voz alta.');
  if (await page.locator('.question.active').count() !== 1) throw new Error('La interfaz no presenta una sola pregunta a la vez.');

  for (let index = 0; index < 6; index += 1) {
    await page.locator('.question.active .option').first().click();
    if (index < 5) await page.click('#nextQuestion');
  }
  await page.waitForTimeout(700);
  await page.click('#submitGuide');
  await page.locator('#confirmationDialog.show').waitFor({ state: 'visible' });
  await page.locator('#deliveryConfirmation.show').waitFor({ state: 'visible' });
  if ((attempts.get('20') || {}).completada !== true) throw new Error('La lectura posterior no confirmó la entrega.');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/paes/guia24-guiada.html`, { waitUntil: 'networkidle' });
  await page.locator('#sessionSection').waitFor({ state: 'visible' });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  if (overflow) throw new Error('La Guía 24 presenta desplazamiento horizontal en celular.');
  if (await page.locator('#dataTable').count() !== 1) throw new Error('La tabla de la Guía 24 no se renderizó.');

  blockMode = true;
  await page.evaluate(() => sessionStorage.clear());
  await page.goto(`${baseUrl}/paes/guia31-guiada.html`, { waitUntil: 'networkidle' });
  await page.fill('#rutInput', authorized[1]);
  await page.click('#loginForm button[type="submit"]');
  await page.locator('#errorBox.show').waitFor({ state: 'visible' });
  const blockedText = await page.locator('#errorBox').textContent();
  if (!/se habilitará cuando corresponda/i.test(blockedText || '')) throw new Error('La guía bloqueada no informa su disponibilidad futura.');

  await browser.close();
  if (errors.length) throw new Error(`Errores de consola: ${errors.join(' | ')}`);
  console.log('OK: flujo guiado futuro probado en escritorio, celular, entrega, lectura de vuelta y bloqueo.');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
