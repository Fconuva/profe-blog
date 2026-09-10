'use strict';

const { test, expect } = require('@playwright/test');
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const STUDENT = { rut: '111111111', nombre: 'Estudiante de prueba', curso: '3A-HC' };
const clone = value => JSON.parse(JSON.stringify(value));
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const deferred = () => {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
};
let server, origin;

test.use({ browserName: 'chromium' });
test.setTimeout(45000);

test.beforeAll(async () => {
  // El servidor nunca reenvía API ni sirve la nómina real.
  server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep) || !pathname.startsWith('/paes/') || pathname === '/paes/js/nominas.js') {
      res.writeHead(403).end(); return;
    }
    fs.readFile(file, (error, data) => {
      if (error) { res.writeHead(404).end(); return; }
      const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png' };
      res.writeHead(200, { 'Content-Type': (mime[path.extname(file)] || 'application/octet-stream') + (path.extname(file) === '.png' ? '' : '; charset=utf-8') });
      res.end(data);
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
test.afterAll(async () => {
  if (server) {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});

async function prepare(page, options = {}) {
  const state = { attempt: null, posts: [], events: [], reads: 0, errors: [], consoleErrors: [], httpErrors: [], failed: [], external: [], released: false, ...options };
  page.on('pageerror', error => state.errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') state.consoleErrors.push(message.text()); });
  page.on('response', response => { if (response.status() >= 400) state.httpErrors.push(`${response.status()} ${response.url()}`); });
  page.on('requestfailed', req => state.failed.push(req.url()));
  page.on('dialog', dialog => dialog.accept());
  await page.route('**/*', async route => {
    const req = route.request();
    const url = new URL(req.url());
    if (url.origin !== origin) { state.external.push(req.url()); await route.abort(); return; }
    if (url.pathname === '/paes/js/nominas.js') {
      await route.fulfill({ contentType: 'application/javascript', body: `const NOMINAS_PAES = ${JSON.stringify([STUDENT])};` }); return;
    }
    if (url.pathname !== '/api/paes') { await route.continue(); return; }
    const action = url.searchParams.get('action');
    const reply = (json, status = 200) => route.fulfill({ status, json });
    if (action === 'get-nomina-extra') return reply({ success: true, nomina_extra: [] });
    if (action === 'get-guias-config') return reply({ success: true, config: { blocked: {}, allowed: {} } });
    if (action === 'get-guia-state') {
      state.reads++;
      state.events.push('readback');
      if (state.onRead && await state.onRead({ state, reply, route })) return;
      return reply({ success: true, attempt: state.attempt, released: state.released, answerKey: state.released ? { 1: 'D' } : null, feedback: state.released ? { 1: 'Retroalimentación ficticia de prueba.' } : null });
    }
    if (action === 'submit-guia') {
      const payload = req.postDataJSON();
      expect(payload.rut).toBe(STUDENT.rut);
      expect(payload.guiaId).toBe('21');
      expect(payload.total).toBe(24);
      state.posts.push(clone(payload));
      state.events.push(payload.draft ? 'draft:start' : 'final:start');
      if (state.onSubmit && await state.onSubmit({ state, payload, reply, route })) return;
      if (state.attempt?.submitted) return reply({ error: 'Entrega ya confirmada' }, 409);
      const now = Date.now();
      state.attempt = { answers: clone(payload.answers), dev: clone(payload.dev), submitted: !payload.draft, completada: !payload.draft, status: payload.draft ? 'draft' : 'sent', lastSavedAt: now, ...(payload.draft ? {} : { submittedAt: now, completadaAt: now }) };
      state.events.push(payload.draft ? 'draft:end' : 'final:end');
      return reply({ success: true, submitted: !payload.draft, completada: !payload.draft });
    }
    throw new Error(`Acción API inesperada: ${action}`);
  });
  return state;
}

async function login(page) {
  await page.locator('#rutInput').fill('11.111.111-1');
  await expect(page.locator('#loginForm button')).toBeEnabled();
  await page.locator('#loginForm button').click();
  await expect(page.locator('#session')).toBeVisible();
}
async function open(page) { await page.goto(`${origin}/paes/guia21.html`); await login(page); }
const answer = (page, n, letter = 'A') => page.locator(`#question-${n} .option[data-letter="${letter}"]`);
const review = page => page.locator('[data-tab="4"]').click();
async function submit(page) { await review(page); await page.locator('#submit').click(); }
async function concealed(page) {
  await expect(page.locator('#resultBox')).toBeHidden();
  await expect(page.locator('.option.correct, .option.wrong')).toHaveCount(0);
  await expect(page.locator('.feedback:visible')).toHaveCount(0);
  await expect(page.locator('#resultScore')).toHaveText('');
}
async function confirmed(page) {
  await expect(page.locator('#confirmDialog')).toBeVisible();
  await expect(page.locator('#submit')).toHaveText('Guía entregada');
  await page.locator('#closeDialog').click();
  await expect(page.locator('#deliveryConfirmation')).toBeVisible();
  await expect(page.locator('#submit')).toBeDisabled();
}
async function layout(page) {
  const problems = await page.evaluate(() => {
    const problems = [];
    if (document.documentElement.scrollWidth > innerWidth + 1) problems.push('desborde horizontal de página');
    for (const el of document.querySelectorAll('button, h1, h2, h3, .reading img, .tabs, .dialog')) {
      if (!el.getClientRects().length) continue;
      const rect = el.getBoundingClientRect();
      if (rect.left < -1 || rect.right > innerWidth + 1 || el.scrollWidth > el.clientWidth + 2) problems.push(`${el.tagName} ${el.id || el.className}`);
    }
    return problems;
  });
  expect(problems).toEqual([]);
}

for (const width of [390, 1440, 3840]) {
  test(`G21 ${width}px: ingreso, imágenes, 24 ítems, guardado, recarga y entrega oculta`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1080 });
    const state = await prepare(page);
    await open(page);
    await expect(page.locator('.question')).toHaveCount(24);
    await expect(page.locator('#studentName')).toHaveText(STUDENT.nombre);
    for (let tab = 1; tab <= 3; tab++) {
      await page.locator(`[data-tab="${tab}"]`).click();
      const img = page.locator(`#panel-${tab} .reading img`);
      await expect.poll(() => img.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
      await layout(page);
      await page.screenshot({ path: testInfo.outputPath(`lectura-${tab}-${width}.png`), fullPage: true });
    }
    await page.locator('[data-tab="1"]').click();
    await answer(page, 1).click();
    await page.locator('#question-1 .flag').click();
    await review(page);
    await page.locator('#evidence').fill('La evidencia del texto confirma mi respuesta de prueba.');
    await expect(page.locator('#savedState')).toHaveText('Guardado en línea');
    expect(state.attempt.answers).toEqual({ 1: 'A' });
    expect(JSON.parse(state.attempt.dev.review_flags)).toEqual({ 1: true });
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await login(page);
    await expect(answer(page, 1)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#question-1 .flag')).toHaveAttribute('aria-pressed', 'true');
    await review(page);
    await expect(page.locator('#evidence')).toHaveValue('La evidencia del texto confirma mi respuesta de prueba.');
    await layout(page);
    await concealed(page);
    await page.locator('#submit').click();
    await confirmed(page);
    await concealed(page);
    expect(state.attempt.submitted && state.attempt.completada).toBe(true);
    expect(state.events.at(-1)).toBe('readback');
    expect(state.posts.filter(p => !p.draft)).toHaveLength(1);
    await page.screenshot({ path: testInfo.outputPath(`entrega-${width}.png`), fullPage: true });
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await login(page);
    await expect(answer(page, 1)).toBeDisabled();
    await review(page);
    await expect(page.locator('#deliveryConfirmation')).toBeVisible();
    await expect(page.locator('#evidence')).toBeDisabled();
    await concealed(page);
    expect(state.errors).toEqual([]);
    expect(state.consoleErrors).toEqual([]);
    expect(state.httpErrors).toEqual([]);
    expect(state.failed).toEqual([]);
    expect(state.external).toEqual([]);
  });
}

test('G21: cola serializada espera dos borradores antes de entregar', async ({ page }) => {
  const gate = deferred();
  const state = await prepare(page, { onSubmit: async ({ payload, state }) => {
    if (payload.draft && state.posts.length === 1) await gate.promise;
    return false;
  } });
  try {
    await open(page);
    await answer(page, 1).click();
    await expect.poll(() => state.posts.length).toBe(1);
    await answer(page, 2, 'B').click();
    await page.waitForTimeout(750);
    expect(state.posts).toHaveLength(1);
    await submit(page);
    await expect(page.locator('#submit')).toHaveText('Entregando…');
    await page.waitForTimeout(150);
    expect(state.posts).toHaveLength(1);
    gate.resolve();
    await confirmed(page);
    expect(state.events.filter(e => e !== 'readback')).toEqual(['draft:start', 'draft:end', 'draft:start', 'draft:end', 'final:start', 'final:end']);
    expect(state.attempt.answers).toEqual({ 1: 'A', 2: 'B' });
    await page.waitForTimeout(800);
    expect(state.posts).toHaveLength(3);
  } finally { gate.resolve(); }
});

test('G21: error de borrador conserva avance local y reintenta con la siguiente edición', async ({ page }) => {
  let fail = true;
  const state = await prepare(page, { onSubmit: async ({ payload, route }) => {
    if (payload.draft && fail) { fail = false; await route.abort('failed'); return true; }
    return false;
  } });
  await open(page);
  await answer(page, 1).click();
  await expect(page.locator('#savedState')).toContainText('avance conservado');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('paes_g21_111111111')).answers)).toEqual({ 1: 'A' });
  await page.reload(); await login(page);
  await expect(answer(page, 1)).toHaveAttribute('aria-pressed', 'true');
  await answer(page, 2, 'B').click();
  await expect(page.locator('#savedState')).toHaveText('Guardado en línea');
  expect(state.attempt.answers).toEqual({ 1: 'A', 2: 'B' });
  await submit(page); await confirmed(page);
});

test('G21: error de entrega permite reintentar sin perder respuestas', async ({ page }) => {
  let finals = 0;
  const state = await prepare(page, { onSubmit: async ({ payload, reply }) => {
    if (!payload.draft && ++finals === 1) { await reply({ error: 'Servicio ficticio no disponible' }, 503); return true; }
    return false;
  } });
  await open(page); await answer(page, 1).click(); await submit(page);
  await expect(page.locator('#sendStatus')).toContainText('No se confirmó');
  await expect(page.locator('#submit')).toBeEnabled();
  await expect(page.locator('#confirmDialog')).toBeHidden();
  await expect(page.locator('#deliveryConfirmation')).toBeHidden();
  await page.locator('#submit').click(); await confirmed(page);
  expect(finals).toBe(2); expect(state.attempt.answers).toEqual({ 1: 'A' });
});

test('G21: éxito POST sin ambas marcas no anuncia entrega; reintento con 409 relee', async ({ page }) => {
  let finals = 0;
  const state = await prepare(page, { onSubmit: async ({ payload, state, reply }) => {
    if (payload.draft) return false;
    finals++;
    state.attempt = { answers: payload.answers, submitted: finals > 1, completada: true, submittedAt: Date.now(), completadaAt: Date.now() };
    await reply(finals === 1 ? { success: true } : { error: 'Ya entregada' }, finals === 1 ? 200 : 409);
    return true;
  } });
  await open(page); await answer(page, 1).click(); await submit(page);
  await expect(page.locator('#sendStatus')).toContainText('aún no está confirmada');
  await expect(page.locator('#deliveryConfirmation')).toBeHidden();
  await page.locator('#submit').click(); await confirmed(page);
  expect(state.attempt.submitted).toBe(true); await concealed(page);
});

test('G21: readback caído tras entrega conserva estado y se recupera con 409', async ({ page }) => {
  let failedRead = false;
  const state = await prepare(page, { onRead: async ({ state, reply }) => {
    if (state.attempt?.submitted && !failedRead) { failedRead = true; await reply({ error: 'Lectura ficticia interrumpida' }, 503); return true; }
    return false;
  } });
  await open(page); await answer(page, 1).click(); await submit(page);
  await expect(page.locator('#sendStatus')).toContainText('No se confirmó');
  await expect(page.locator('#deliveryConfirmation')).toBeHidden();
  await page.locator('#submit').click(); await confirmed(page);
  expect(state.posts.filter(p => !p.draft)).toHaveLength(2);
  expect(state.attempt.answers).toEqual({ 1: 'A' });
});

test('G21: 409 de borrador restaura la entrega canónica de otra pestaña', async ({ page }) => {
  const state = await prepare(page, { onSubmit: async ({ payload, state, reply }) => {
    if (!payload.draft) return false;
    state.attempt = { answers: { 1: 'C' }, dev: {}, submitted: true, completada: true, submittedAt: Date.now(), completadaAt: Date.now() };
    await reply({ error: 'Ya entregada desde otra pestaña' }, 409); return true;
  } });
  await open(page); await answer(page, 1).click();
  await expect(answer(page, 1, 'C')).toHaveAttribute('aria-pressed', 'true');
  await expect(answer(page, 1)).toBeDisabled();
  await review(page); await expect(page.locator('#deliveryConfirmation')).toBeVisible();
  await expect(page.locator('#submit')).toBeDisabled();
  expect(state.posts.filter(p => !p.draft)).toHaveLength(0); await concealed(page);
});

test('G21: no envía borradores pendientes después de reconciliar un 409', async ({ page }) => {
  const gate = deferred();
  const state = await prepare(page, { onSubmit: async ({ payload, state, reply }) => {
    if (payload.draft && state.posts.length === 1) {
      await gate.promise;
      state.attempt = { answers: { 1: 'C' }, dev: {}, submitted: true, completada: true, submittedAt: Date.now(), completadaAt: Date.now() };
      await reply({ error: 'Ya entregada' }, 409); return true;
    }
    return false;
  } });
  try {
    await open(page); await answer(page, 1).click();
    await expect.poll(() => state.posts.length).toBe(1);
    await answer(page, 2, 'B').click(); await page.waitForTimeout(750);
    gate.resolve();
    await expect(answer(page, 1)).toBeDisabled();
    await page.waitForTimeout(800);
    expect(state.posts).toHaveLength(1);
  } finally { gate.resolve(); }
});

test('G21: entrega sin respuestas está permitida y confirmada por lectura', async ({ page }) => {
  const state = await prepare(page); await open(page); await submit(page); await confirmed(page);
  expect(state.attempt.answers).toEqual({}); await concealed(page);
});

test('G21: datos públicos no incluyen claves ni retroalimentación privada', async ({ page }) => {
  await prepare(page); await open(page);
  const data = await page.evaluate(async () => (await fetch('data/guia21.json')).json());
  const forbidden = [];
  function inspect(value, trail = '') {
    if (!value || typeof value !== 'object') return;
    for (const [key, nested] of Object.entries(value)) {
      if (/^(correct|answerKey|key|feedback|correctAnswer)$/i.test(key)) forbidden.push(trail + key);
      inspect(nested, trail + key + '.');
    }
  }
  inspect(data); expect(forbidden).toEqual([]); await concealed(page);
});

test('G21: espera el readback antes de mostrar confirmación y mantiene resultados ocultos', async ({ page }) => {
  const gate = deferred();
  const state = await prepare(page, { onRead: async ({ state }) => {
    if (state.attempt?.submitted) {
      state.attempt.result = { correct: 7, total: 24 };
      await gate.promise;
    }
    return false;
  } });
  try {
    await open(page); await answer(page, 1).click(); await submit(page);
    await expect.poll(() => state.attempt?.submitted).toBe(true);
    await expect(page.locator('#submit')).toHaveText('Entregando…');
    await expect(page.locator('#confirmDialog')).toBeHidden();
    await expect(page.locator('#deliveryConfirmation')).toBeHidden();
    gate.resolve(); await confirmed(page); await concealed(page);
  } finally { gate.resolve(); }
});

test('G21: bloquea campos de reflexión durante una entrega en curso', async ({ page }) => {
  const gate = deferred();
  const state = await prepare(page, { onSubmit: async ({ payload }) => {
    if (!payload.draft) await gate.promise;
    return false;
  } });
  try {
    await open(page); await review(page);
    await page.locator('#evidence').fill('Reflexión antes de entregar.');
    await page.locator('#submit').click();
    await expect.poll(() => state.posts.filter(p => !p.draft).length).toBe(1);
    await expect(page.locator('#submit')).toHaveText('Entregando…');
    await expect(page.locator('#evidence')).toBeDisabled();
    await expect(page.locator('#distractor')).toBeDisabled();
    gate.resolve(); await confirmed(page);
  } finally { gate.resolve(); }
});
