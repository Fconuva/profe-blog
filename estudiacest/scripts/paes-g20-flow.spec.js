'use strict';

const { test, expect } = require('@playwright/test');
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const STUDENT = { rut: '111111111', nombre: 'Estudiante de prueba', curso: '3A-HC' };
const clone = value => JSON.parse(JSON.stringify(value));
let server, origin;

test.use({ browserName: 'chromium' });
test.setTimeout(45000);

test.beforeAll(async () => {
  server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep) || !pathname.startsWith('/paes/') || pathname === '/paes/js/nominas.js') {
      res.writeHead(403).end(); return;
    }
    fs.readFile(file, (error, data) => {
      if (error) { res.writeHead(404).end(); return; }
      const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json' };
      res.writeHead(200, { 'Content-Type': `${mime[path.extname(file)] || 'application/octet-stream'}; charset=utf-8` });
      res.end(data);
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});

test.afterAll(async () => {
  if (!server) return;
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
});

async function prepare(page, options = {}) {
  const state = { attempt: null, posts: [], errors: [], consoleErrors: [], httpErrors: [], failed: [], external: [], released: false, ...options };
  page.on('pageerror', error => state.errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') state.consoleErrors.push(message.text()); });
  page.on('response', response => { if (response.status() >= 400) state.httpErrors.push(`${response.status()} ${response.url()}`); });
  page.on('requestfailed', request => state.failed.push(request.url()));
  page.on('dialog', dialog => dialog.accept());
  await page.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin !== origin) { state.external.push(request.url()); await route.abort(); return; }
    if (url.pathname === '/paes/js/nominas.js') {
      await route.fulfill({ contentType: 'application/javascript', body: `const NOMINAS_PAES = ${JSON.stringify([STUDENT])};` }); return;
    }
    if (url.pathname !== '/api/paes') { await route.continue(); return; }
    const action = url.searchParams.get('action');
    const reply = (json, status = 200) => route.fulfill({ status, json });
    if (action === 'get-nomina-extra') return reply({ success: true, nomina_extra: [] });
    if (action === 'get-guias-config') return reply({ success: true, config: { blocked: {}, allowed: {} } });
    if (action === 'get-guia-state') {
      const answerKey = state.released ? Object.fromEntries(Array.from({ length: 18 }, (_, index) => [index + 1, 'A'])) : null;
      const feedback = state.released ? Object.fromEntries(Array.from({ length: 18 }, (_, index) => [index + 1, `Retroalimentación de prueba ${index + 1}.`])) : null;
      return reply({ success: true, attempt: state.attempt, released: state.released, answerKey, feedback });
    }
    if (action === 'submit-guia') {
      const payload = request.postDataJSON();
      expect(payload.guiaId).toBe('20');
      expect(payload.total).toBe(18);
      state.posts.push(clone(payload));
      const now = Date.now();
      state.attempt = {
        answers: clone(payload.answers), dev: clone(payload.dev), submitted: !payload.draft,
        completada: !payload.draft, status: payload.draft ? 'draft' : 'sent', lastSavedAt: now,
        ...(payload.draft ? {} : { submittedAt: now, completadaAt: now, result: { correct: 1, total: 18 } })
      };
      return reply({ success: true, submitted: !payload.draft, completada: !payload.draft });
    }
    throw new Error(`Acción API inesperada: ${action}`);
  });
  return state;
}

async function login(page, rut = '11.111.111-1') {
  await page.locator('#rutInput').fill(rut);
  await page.locator('#loginForm button').click();
  await expect(page.locator('#session')).toBeVisible();
}

async function assertLayout(page) {
  const problems = await page.evaluate(() => {
    const found = [];
    if (document.documentElement.scrollWidth > innerWidth + 1) found.push('desborde horizontal');
    for (const element of document.querySelectorAll('button, h1, h2, h3, .reading, .tabs, .dialog')) {
      if (!element.getClientRects().length) continue;
      const rect = element.getBoundingClientRect();
      if (rect.left < -1 || rect.right > innerWidth + 1) found.push(`${element.tagName} ${element.id || element.className}`);
    }
    return found;
  });
  expect(problems).toEqual([]);
}

for (const width of [390, 1440, 3840]) {
  test(`G20 ${width}px: pares, guardado, recarga y entrega confirmada`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1080 });
    const state = await prepare(page);
    await page.goto(`${origin}/paes/guia20.html`);
    await login(page);
    await expect(page.locator('.question')).toHaveCount(18);
    await expect(page.locator('.pair-grid')).toHaveCount(3);
    await expect(page.locator('.pair-grid .reading')).toHaveCount(6);
    await expect(page.locator('#studentName')).toHaveText(STUDENT.nombre);
    for (let tab = 1; tab <= 3; tab += 1) {
      await page.locator(`[data-tab="${tab}"]`).click();
      await expect(page.locator(`#panel-${tab} .reading`)).toHaveCount(2);
      await assertLayout(page);
    }
    await page.locator('[data-tab="1"]').click();
    await page.locator('#question-1 .option[data-letter="A"]').click();
    await page.locator('#question-1 .flag').click();
    await page.locator('[data-tab="4"]').click();
    await page.locator('#agreement').fill('Ambos textos coinciden en que el uso compartido requiere observar dos pistas convergentes.');
    await page.locator('#tension').fill('Difieren en el grado de programación, pero no rechazan por completo la convivencia.');
    await expect(page.locator('#savedState')).toHaveText('Guardado en línea');
    expect(state.attempt.answers).toEqual({ 1: 'A' });
    expect(JSON.parse(state.attempt.dev.review_flags)).toEqual({ 1: true });
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await login(page);
    await expect(page.locator('#question-1 .option[data-letter="A"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#question-1 .flag')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('[data-tab="4"]').click();
    await expect(page.locator('#agreement')).toHaveValue(/dos pistas convergentes/);
    await page.locator('#submit').click();
    await expect(page.locator('#confirmDialog')).toBeVisible();
    await expect(page.locator('#submit')).toHaveText('Guía entregada');
    await page.locator('#closeDialog').click();
    await expect(page.locator('#deliveryConfirmation')).toBeVisible();
    await expect(page.locator('#resultBox')).toBeHidden();
    await expect(page.locator('.option.correct, .option.wrong')).toHaveCount(0);
    expect(state.posts.filter(payload => !payload.draft)).toHaveLength(1);
    expect(state.attempt.submitted && state.attempt.completada).toBe(true);
    await assertLayout(page);
    expect(state.errors).toEqual([]);
    expect(state.consoleErrors).toEqual([]);
    expect(state.httpErrors).toEqual([]);
    expect(state.failed).toEqual([]);
    expect(state.external).toEqual([]);
  });
}

test('G20: la corrección aparece solo después de la liberación docente', async ({ page }) => {
  const state = await prepare(page);
  await page.goto(`${origin}/paes/guia20.html`);
  await login(page);
  await page.locator('#question-1 .option[data-letter="A"]').click();
  await page.locator('[data-tab="4"]').click();
  await page.locator('#submit').click();
  await page.locator('#closeDialog').click();
  await expect(page.locator('#resultBox')).toBeHidden();
  state.released = true;
  await page.reload();
  await login(page);
  await expect(page.locator('#resultBox')).toBeVisible();
  await expect(page.locator('#resultScore')).toHaveText('1 / 18');
  await expect(page.locator('#question-1 .option.correct')).toHaveCount(1);
  await expect(page.locator('#feedback-1')).toBeVisible();
});

test('G20: el estudiante de ruta individual conserva su experiencia guiada', async ({ page }) => {
  await prepare(page);
  await page.goto(`${origin}/paes/guia20.html`);
  await page.locator('#rutInput').fill('22.932.773-9');
  await page.locator('#loginForm button').click();
  await page.waitForURL(`${origin}/paes/guia20-guiada.html`);
});
