// Prueba focalizada con identidades ficticias del curso PRUEBA, sin estudiantes reales.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const { chromium } = require('playwright');
const handler = require('../api/_informe-tecnico-nm4.js');
const root = path.resolve(__dirname, '..');
const remote = process.env.INFORME_SUBMIT_BASE;
const fixtureRut = '11.111.111-1';
const store = {};
const clone = value => value == null ? null : JSON.parse(JSON.stringify(value));
const get = key => key.split('/').reduce((value, part) => value && value[part], store) ?? null;
const set = (key, value) => {
  const parts = key.split('/'); let node = store;
  for (const part of parts.slice(0, -1)) node = node[part] ||= {};
  node[parts.at(-1)] = clone(value);
};
const db = { ref(key) { return {
  once: async () => ({ val: () => clone(get(key)) }),
  transaction: async change => {
    const value = change(clone(get(key))); const committed = value !== undefined;
    if (committed) set(key, value);
    return { committed, snapshot: { val: () => clone(get(key)) } };
  },
  update: async changes => set(key, { ...get(key), ...changes })
}; } };
const admin = { auth: () => ({ verifyIdToken: async () => ({ uid: 'qa-fixture' }) }) };
set('plataforma_estudiantes/admins/qa-fixture', true);
let checks = 0, rejectSave = false;
const check = (value, label) => { assert.ok(value, label); checks++; };
async function invoke(action, version, input = {}, method = 'POST') {
  let status = 200, data;
  const res = { setHeader() {}, status(value) { status = value; return this; }, json(value) { data = value; return this; } };
  await handler({ method, query: { action, version, curso: 'PRUEBA' }, body: { rut: fixtureRut, ...input }, headers: { authorization: 'Bearer fixture-token' } }, res, { admin, db });
  return { status, data };
}
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const target = path.resolve(root, '.' + decodeURIComponent(url.pathname), url.pathname.endsWith('/') ? 'index.html' : '');
  if (!target.startsWith(root + path.sep) || !fs.existsSync(target) || !fs.statSync(target).isFile()) { res.statusCode = 404; return res.end(); }
  res.setHeader('Content-Type', mime[path.extname(target)] || 'application/octet-stream'); fs.createReadStream(target).pipe(res);
});
async function main() {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = remote || `http://127.0.0.1:${server.address().port}`;
  const proof = fs.mkdtempSync(path.join(os.tmpdir(), 'nm4-entrega-'));
  const browser = await chromium.launch({ headless: true });
  try {
    for (const version of ['industrial', 'automotriz']) {
      const fields = require(`../nm4/u3-clase6-informe-${version}/informe/campos.js`);
      const state = await invoke('get-guia-state', version);
      check(state.status === 200 && state.data.student.curso === 'PRUEBA', 'La prueba no es una identidad ficticia.');
      const recordPath = `plataforma_nm4/informe_${version}_2026/PRUEBA/${state.data.student.n}`;
      const complete = Object.fromEntries(fields.questions.map(question => [question.id, question.options?.[0] || (question.type === 'date' ? '2026-10-05' : question.type === 'number' ? '4.2' : 'Respuesta ficticia suficientemente extensa para comprobar el envío.') ]));
      const requiredAnswers = Object.fromEntries(fields.activity.requiredForSubmit.map(id => [id, complete[id]]));
      const delivered = await invoke('submit', version, { answers: requiredAnswers });
      check(delivered.status === 200 && delivered.data.attempt.submitted && delivered.data.attempt.completada, 'No entrega 20/20.');
      check(delivered.data.attempt.score === 20 && delivered.data.attempt.submittedAt > 0, 'Altera el avance o no registra la fecha.');
      check((await invoke('save', version, { answers: {} })).status === 409, 'Un autoguardado tardío reabre la entrega.');
      const reread = await invoke('get-guia-state', version);
      check(reread.data.attempt.completada && Object.keys(reread.data.attempt.answers).length === 20, 'La entrega no persiste al releer.');
      const listing = await invoke('admin-list', version, {}, 'GET');
      check(listing.data.rows.find(row => row.n === state.data.student.n).attempt.completada, 'La revisión administrativa no ve la entrega.');
      // Conservar el trabajo paralelo: una edición cambia solo su campo.
      set(recordPath, { answers: { obj2: 'Texto previo del segundo integrante.' }, revision: 3 });
      const partial = await invoke('submit', version, { answers: { resumen: 'Último cambio ficticio que todavía no se había guardado.' }, changedFields: ['resumen'] });
      check(partial.status === 200 && partial.data.attempt.completada && partial.data.attempt.score < 20, 'Bloquea la entrega incompleta.');
      check(partial.data.attempt.answers.obj2 === 'Texto previo del segundo integrante.' && partial.data.attempt.answers.resumen.includes('Último cambio'), 'Borra respuestas paralelas o pierde cambios pendientes.');
      for (const [width, failure] of [[390, false], [1440, true], [3840, false]]) {
        set(recordPath, null); rejectSave = failure;
        const context = await browser.newContext({ viewport: { width, height: 1000 } });
        const page = await context.newPage(); const errors = [], actions = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.route('**/api/economista?**', async route => {
          const request = route.request(), query = new URL(request.url()).searchParams;
          const action = query.get('action'); actions.push(action);
          const result = action === 'save' && rejectSave ? { status: 503, data: { error: 'Fallo de autoguardado simulado.' } } : await invoke(action, query.get('version'), request.postDataJSON() || {}, request.method());
          await route.fulfill({ status: result.status, contentType: 'application/json', body: JSON.stringify(result.data) });
        });
        await page.goto(`${base}/nm4/u3-clase6-informe-${version}/informe/`);
        await page.locator('#rut').fill(fixtureRut); await page.locator('#rutButton').click();
        await page.getByRole('button', { name: 'Sí, soy yo', exact: true }).click();
        await page.locator('#soloMode').click(); await page.locator('#app').waitFor({ state: 'visible' });
        check(await page.locator('#submit').isEnabled(), 'El botón está deshabilitado con campos vacíos.');
        await page.locator('#q-resumen').fill('Cambio ficticio final, enviado sin completar todas las casillas.');
        if (failure) await page.waitForFunction(() => document.getElementById('saveState').textContent.includes('Sin conexión'));
        else check(!actions.includes('save'), 'No se probó la edición anterior al autoguardado.');
        // Clic inmediato sin desplazamiento largo que dispararía el autoguardado.
        await page.locator('#submit').evaluate(button => button.click());
        await page.locator('#doneDialog').waitFor({ state: 'visible' });
        check(await page.locator('#doneDialog').innerText().then(text => text.includes('guardado y entregado')), 'No confirma la entrega flexible.');
        check(get(recordPath).answers.resumen.includes('Cambio ficticio final') && get(recordPath).completada, 'El clic no guardó la respuesta pendiente.');
        await page.locator('#doneBack').click(); await page.reload();
        await page.locator('#app').waitFor({ state: 'visible' });
        check(!await page.locator('#deliverBox').isVisible() && await page.locator('#report [data-q]:enabled').count() === 0, 'Recargar no conserva la entrega bloqueada.');
        check(await page.locator('#report').innerText().then(text => text.includes('Cambio ficticio final')), 'La respuesta no se conserva visualmente.');
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Desborde horizontal.');
        check(errors.length === 0, 'Error de JavaScript.');
        if (width === 390) await page.screenshot({ path: path.join(proof, `${version}-${width}.png`) });
        await context.close();
      }
    }
    for (const [version, folder] of [['electrica', 'tecnico'], ['electronica', 'electronica'], ['mecanica', 'mecanica']]) {
      const fields = require(`../nm4/u3-clase6-informe-${folder}/informe/campos.js`);
      const expected = fields.activity.requiredForSubmit?.length ? 400 : 200;
      check((await invoke('submit', version, { answers: {} })).status === expected, 'Se cambió la política de una versión fuera del alcance.');
    }
    const report = { mode: remote ? 'interfaz-publica-con-api-real-simulada' : 'local-con-funcion-real', checks, evidence: proof, realStudentsModified: false };
    console.log(JSON.stringify(report));
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error.stack); process.exitCode = 1; }).finally(() => server.close());
