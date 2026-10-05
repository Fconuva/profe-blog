// Prueba focalizada, sin datos personales en el código ni en sus evidencias.
// INFORME_PREVIEW_RUT se recibe solo en el entorno del proceso de prueba.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const { chromium } = require('playwright');
const handler = require('../api/_informe-tecnico-nm4.js');
const root = path.resolve(__dirname, '..');
const teacherRut = process.env.INFORME_PREVIEW_RUT;
const remote = process.env.INFORME_PREVIEW_BASE;
if (!teacherRut) throw new Error('Falta INFORME_PREVIEW_RUT en el entorno privado de prueba.');
let dbCalls = 0;
const actions = [];
const db = { ref() { dbCalls++; return { once: async () => ({ val: () => null }), update() { throw new Error('Escritura inesperada.'); }, transaction() { throw new Error('Escritura inesperada.'); } }; } };
const admin = { auth: () => ({ verifyIdToken: async () => { throw new Error('Token de prueba no autorizado.'); } }) };
const api = '/api/economista?modulo=informe-tecnico&version=industrial&action=';
const route = '/nm4/u3-clase6-informe-industrial/informe/';
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.pdf': 'application/pdf' };
const server = http.createServer(async (req, response) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/economista') {
    const chunks = []; for await (const chunk of req) chunks.push(chunk);
    let input = {}; try { input = JSON.parse(Buffer.concat(chunks).toString() || '{}'); } catch (_) {}
    actions.push(url.searchParams.get('action'));
    const res = { setHeader: (...args) => response.setHeader(...args), status(code) { response.statusCode = code; return this; }, json(value) { response.setHeader('Content-Type', 'application/json'); response.end(JSON.stringify(value)); return this; } };
    return handler({ method: req.method, query: Object.fromEntries(url.searchParams), body: input, headers: req.headers }, res, { admin, db });
  }
  const pathname = decodeURIComponent(url.pathname);
  const target = path.resolve(root, '.' + pathname, pathname.endsWith('/') ? 'index.html' : '');
  if (!target.startsWith(root + path.sep) || !fs.existsSync(target) || !fs.statSync(target).isFile()) { response.statusCode = 404; return response.end('No encontrado'); }
  response.setHeader('Content-Type', mime[path.extname(target)] || 'application/octet-stream');
  fs.createReadStream(target).pipe(response);
});
async function main() {
  if (!remote) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = remote || `http://127.0.0.1:${server.address().port}`;
  const proof = fs.mkdtempSync(path.join(os.tmpdir(), 'nm4-preview-'));
  let checks = 0;
  const check = (value, message) => { assert.ok(value, message); checks++; };
  async function request(action, version = 'industrial', method = 'POST') {
    const response = await fetch(`${base}/api/economista?modulo=informe-tecnico&version=${version}&action=${action}`, method === 'POST' ? { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rut: teacherRut, answers: {}, partnerRut: '11.111.111-1' }) } : { method });
    return { status: response.status, data: await response.json() };
  }
  const state = await request('get-guia-state');
  check(state.status === 200 && state.data.previewOnly === true, 'No reconoce la vista docente.');
  check(state.data.student.role === 'docente' && state.data.student.curso === '4ATP' && state.data.student.n === null, 'La docente se confundió con la nómina.');
  check(state.data.attempt === null && state.data.supportsPairs === false && !state.data.rows, 'El acceso incluye entregas o parejas.');
  for (const action of ['save', 'submit', 'join-pair', 'validate-partner', 'admin-pair', 'admin-reset']) check((await request(action)).status === 403, `No bloquea ${action}.`);
  for (const version of ['electrica', 'mecanica', 'automotriz', 'electronica']) check((await request('get-guia-state', version)).status === 403, `Amplía el permiso a ${version}.`);
  check((await request('admin-list', 'industrial', 'GET')).status === 401, 'La revisión privada perdió autenticación.');
  if (!remote) check(dbCalls === 0, 'La vista docente accedió a datos privados.');
  const browser = await chromium.launch({ headless: true });
  try {
    for (const width of [320, 390, 1440, 3840]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 } });
      const page = await context.newPage();
      const errors = [], failed = [], requests = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('requestfailed', request => { if (request.url().startsWith(base)) failed.push(new URL(request.url()).pathname); });
      page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) failed.push(new URL(response.url()).pathname); });
      page.on('request', request => { if (request.url().includes('/api/economista?')) requests.push(new URL(request.url()).searchParams.get('action')); });
      await page.goto(base + route);
      await page.locator('#rut').fill(teacherRut);
      await page.locator('#rutButton').click();
      await page.getByRole('button', { name: 'Ver actividad', exact: true }).click();
      await page.locator('#app').waitFor({ state: 'visible' });
      // Las fotos inferiores usan carga diferida; comprobarlas sin esperar al scroll.
      await page.locator('#report img').evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
      await page.waitForFunction(() => [...document.querySelectorAll('#report img')].every(image => image.complete && image.naturalWidth > 0));
      // No conservar la identificación en el formulario oculto de una captura.
      await page.locator('#rut').evaluate(node => { node.value = ''; });
      check(await page.locator('#report .page').count() === 12, `${width}: faltan páginas.`);
      check(await page.locator('#report [data-q]:disabled').count() === 27, `${width}: hay campos editables.`);
      check(await page.locator('#tocList a').count() === 12, `${width}: falta el índice.`);
      check(!await page.locator('#deliverBox').isVisible() && !await page.locator('#addPartner').isVisible(), `${width}: permite entregar o formar pareja.`);
      check(await page.locator('#banner').innerText().then(text => text.includes('solo lectura')), `${width}: no identifica la vista.`);
      await page.locator('#openLib').click();
      check(await page.locator('#drawer').getAttribute('aria-hidden') === 'false' && await page.locator('#libreta').innerText().then(text => text.includes('BP-04')), `${width}: libreta incompleta.`);
      await page.locator('#closeLib').click();
      check(await page.evaluate(() => [...document.querySelectorAll('#report img')].every(image => image.complete && image.naturalWidth > 0)), `${width}: imágenes rotas.`);
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: desborde horizontal.`);
      await page.evaluate(() => {
        const field = document.querySelector('#report [data-q]'); field.value = 'No debe guardarse'; field.dispatchEvent(new Event('input', { bubbles: true }));
        document.getElementById('submit').click(); document.getElementById('addPartner').click();
      });
      await page.waitForTimeout(1100);
      check(requests.every(action => action === 'get-guia-state'), `${width}: la interfaz intentó escribir.`);
      await page.reload();
      await page.locator('#app').waitFor({ state: 'visible' });
      check(await page.locator('#report [data-q]:disabled').count() === 27, `${width}: pierde el permiso al recargar.`);
      check(await page.locator('#report [data-q]').first().inputValue() === '', `${width}: recupera un borrador docente.`);
      if (width === 1440 || width === 390) await page.screenshot({ path: path.join(proof, `vista-${width}.png`) });
      check(errors.length === 0 && failed.length === 0, `${width}: errores de consola o recursos: ${JSON.stringify({ errors, failed })}`);
      await page.locator('#logout').click();
      await page.locator('#rutForm').waitFor({ state: 'visible' });
      check(!await page.locator('#app').isVisible(), `${width}: no cierra la sesión.`);
      await context.close();
    }
    if (!remote) {
      check(dbCalls === 0, 'El navegador accedió a datos de alumnos.');
      const page = await browser.newPage();
      await page.goto(base + route); await page.locator('#rut').fill('11.111.111-1'); await page.locator('#rutButton').click();
      await page.getByRole('button', { name: 'Sí, soy yo', exact: true }).click();
      await page.locator('#soloMode').click(); await page.locator('#app').waitFor({ state: 'visible' });
      check(await page.locator('#report [data-q]:enabled').count() === 27 && await page.locator('#deliverBox').isVisible(), 'Regresión del modo estudiantil ficticio.');
      await page.close();
    }
    const report = { mode: remote ? 'produccion' : 'local-con-funcion', checks, readonly: true, evidence: proof };
    fs.writeFileSync(path.join(proof, 'resultado.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report));
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => { server.close(); });
