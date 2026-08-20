const { test, expect } = require('@playwright/test');

test.use({ channel: 'chrome' });

async function prepare(page) {
  let attempt = null;
  let finalPayload = null;
  await page.route('**/api/paes**', async route => {
    const request = route.request();
    const url = new URL(request.url());
    const action = url.searchParams.get('action');
    if (action === 'get-nomina-extra') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, nomina_extra: [] }) });
    }
    if (action === 'get-guias-config') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, config: { blocked: {}, allowed: {} } }) });
    }
    if (action === 'get-guia-state') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, attempt, released: false, answerKey: null, feedback: null }) });
    }
    if (action === 'submit-guia') {
      const payload = request.postDataJSON();
      if (payload.draft) {
        attempt = { answers: payload.answers, dev: payload.dev, status: 'draft', submitted: false, completada: false, lastSavedAt: Date.now() };
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, status: 'draft', submitted: false, completada: false }) });
      }
      finalPayload = payload;
      const now = Date.now();
      attempt = { answers: payload.answers, dev: payload.dev, status: 'sent', submitted: true, completada: true, submittedAt: now, completadaAt: now };
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, status: 'sent', submitted: true, completada: true, submittedAt: now, completadaAt: now }) });
    }
    return route.continue();
  });
  return () => finalPayload;
}

test('Guía 18 entrega una respuesta y no revela la clave', async ({ page }) => {
  const finalPayload = await prepare(page);
  await page.goto('http://127.0.0.1:8765/paes/guia18.html');
  await page.locator('#rutInput').fill('23.265.991-2');
  await page.locator('#loginForm button').click();
  await expect(page.locator('#session')).toBeVisible();
  await page.locator('.question[data-q="1"] .option[data-letter="A"]').click();
  await expect(page.locator('#answeredInfo')).toContainText('1 de 18');
  await page.locator('#submit').click();
  await expect(page.locator('#confirmDialog')).toBeVisible();
  await expect(page.locator('#submit')).toHaveText('Guía entregada');
  await expect(page.locator('#deliveryConfirmation')).toBeVisible();
  await expect(page.locator('#resultBox')).toBeHidden();
  expect(Object.keys(finalPayload().answers)).toEqual(['1']);
});

test('Guía 18 permite entregar sin marcar alternativas', async ({ page }) => {
  const finalPayload = await prepare(page);
  await page.goto('http://127.0.0.1:8765/paes/guia18.html');
  await page.locator('#rutInput').fill('23.218.875-8');
  await page.locator('#loginForm button').click();
  await expect(page.locator('#session')).toBeVisible();
  await page.locator('#submit').click();
  await expect(page.locator('#confirmDialog')).toBeVisible();
  await expect(page.locator('#submit')).toHaveText('Guía entregada');
  expect(finalPayload().answers).toEqual({});
});

test('Guía 18 espera el autoguardado activo antes de entregar', async ({ page }) => {
  let attempt = null;
  const order = [];
  await page.route('**/api/paes**', async route => {
    const request = route.request();
    const action = new URL(request.url()).searchParams.get('action');
    if (action === 'get-nomina-extra') return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true,"nomina_extra":[]}' });
    if (action === 'get-guias-config') return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true,"config":{"blocked":{}}}' });
    if (action === 'get-guia-state') return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, attempt, released: false, answerKey: null }) });
    if (action === 'submit-guia') {
      const payload = request.postDataJSON();
      if (payload.draft) {
        order.push('draft:start');
        await new Promise(resolve => setTimeout(resolve, 350));
        order.push('draft:end');
        attempt = { answers: payload.answers, status: 'draft', submitted: false, completada: false };
        return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true,"status":"draft","completada":false}' });
      }
      order.push('final');
      const now = Date.now();
      attempt = { answers: payload.answers, status: 'sent', submitted: true, completada: true, submittedAt: now, completadaAt: now };
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, status: 'sent', submitted: true, completada: true, submittedAt: now, completadaAt: now }) });
    }
    return route.continue();
  });
  await page.goto('http://127.0.0.1:8765/paes/guia18.html');
  await page.locator('#rutInput').fill('23.265.991-2');
  await page.locator('#loginForm button').click();
  await page.locator('.question[data-q="1"] .option[data-letter="A"]').click();
  await page.waitForTimeout(720);
  await page.locator('#submit').click();
  await expect(page.locator('#confirmDialog')).toBeVisible();
  expect(order).toEqual(['draft:start', 'draft:end', 'final']);
});

test('Guía 18 conserva la respuesta y permite reintentar tras un error de red', async ({ page }) => {
  let attempt = null;
  let finals = 0;
  await page.route('**/api/paes**', async route => {
    const request = route.request();
    const action = new URL(request.url()).searchParams.get('action');
    if (action === 'get-nomina-extra') return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true,"nomina_extra":[]}' });
    if (action === 'get-guias-config') return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true,"config":{"blocked":{}}}' });
    if (action === 'get-guia-state') return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, attempt, released: false, answerKey: null }) });
    if (action === 'submit-guia') {
      const payload = request.postDataJSON();
      if (payload.draft) return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true,"status":"draft","completada":false}' });
      finals += 1;
      if (finals === 1) return route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"Servicio temporalmente no disponible"}' });
      const now = Date.now();
      attempt = { answers: payload.answers, status: 'sent', submitted: true, completada: true, submittedAt: now, completadaAt: now };
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, status: 'sent', submitted: true, completada: true, submittedAt: now, completadaAt: now }) });
    }
    return route.continue();
  });
  await page.goto('http://127.0.0.1:8765/paes/guia18.html');
  await page.locator('#rutInput').fill('23.265.991-2');
  await page.locator('#loginForm button').click();
  const option = page.locator('.question[data-q="1"] .option[data-letter="A"]');
  await option.click();
  await page.locator('#submit').click();
  await expect(page.locator('#sendStatus')).toContainText('No se confirmó la entrega');
  await expect(page.locator('#submit')).toBeEnabled();
  await expect(option).toHaveClass(/selected/);
  await page.locator('#submit').click();
  await expect(page.locator('#confirmDialog')).toBeVisible();
  expect(finals).toBe(2);
});
