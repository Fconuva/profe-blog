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
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, attempt, released: false, answerKey: null }) });
    }
    if (action === 'submit-guia') {
      const payload = request.postDataJSON();
      if (payload.draft) {
        attempt = { answers: payload.answers, status: 'draft', submitted: false, completada: false, lastSavedAt: Date.now() };
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, status: 'draft', submitted: false, completada: false }) });
      }
      finalPayload = payload;
      const now = Date.now();
      attempt = { answers: payload.answers, status: 'sent', submitted: true, completada: true, submittedAt: now, completadaAt: now };
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, status: 'sent', submitted: true, completada: true, submittedAt: now, completadaAt: now }) });
    }
    return route.continue();
  });
  return () => finalPayload;
}

test('entrega una respuesta y confirma sin revelar la clave', async ({ page }) => {
  const finalPayload = await prepare(page);
  await page.goto('http://127.0.0.1:8765/paes/guia17.html');
  await page.locator('#rutInput').fill('23.265.991-2');
  await page.locator('#loginForm button').click();
  await expect(page.locator('#sessionSection')).toBeVisible();
  await page.locator('.option[data-q="1"][data-answer="A"]').click();
  await expect(page.locator('#answeredInfo')).toContainText('1 de 24');
  await page.locator('#submit').click();
  await expect(page.locator('#confirmDialog')).toBeVisible();
  await expect(page.locator('#submit')).toHaveText('Clase entregada');
  await expect(page.locator('#deliveryConfirmation')).toBeVisible();
  await expect(page.locator('#resultBox')).toBeHidden();
  expect(Object.keys(finalPayload().answers)).toEqual(['1']);
});

test('permite entregar sin marcar respuestas', async ({ page }) => {
  const finalPayload = await prepare(page);
  await page.goto('http://127.0.0.1:8765/paes/guia17.html');
  await page.locator('#rutInput').fill('23.218.875-8');
  await page.locator('#loginForm button').click();
  await expect(page.locator('#sessionSection')).toBeVisible();
  await page.locator('#submit').click();
  await expect(page.locator('#confirmDialog')).toBeVisible();
  await expect(page.locator('#submit')).toHaveText('Clase entregada');
  expect(finalPayload().answers).toEqual({});
});
