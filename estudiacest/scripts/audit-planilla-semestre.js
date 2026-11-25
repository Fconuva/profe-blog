#!/usr/bin/env node
'use strict';
// Auditoría local de «Mis notas del semestre» (/paes/nm2/notas.html y la acción
// planilla-semestre). Usa datos inventados, no Firebase. Se corre a mano:
//   node scripts/audit-planilla-semestre.js
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const P = require('../api/_planilla-semestre.js');
const ROOT = path.join(__dirname, '..');

const cell = (nota, extra = {}) => ({ nota, pendiente: false, na: false, ...extra });
function fixtureRow(curso) {
  const celdas = Object.fromEntries(P.COLUMNS.map(k => [k, cell(7)]));
  celdas['sesion-u3-1'] = { nota: null, pendiente: false, na: true };
  celdas['sesion-u3-4'] = cell(3);
  celdas['sesion-u3-5'] = { nota: null, pendiente: true, na: false };
  celdas['sesion-u4-2'] = { nota: 1, pendiente: true, na: false };
  celdas['nm2-1'] = { nota: null, pendiente: true, na: false };
  return { curso, celdas, promedioTareas: 5.4, pendientes: 3, promedioFinal: 6, piso: true };
}

const DATA = {
  'plataforma_estudiantes/estudiantes/uidA': { curso: '2A-HC', nombre: 'Uno' },
  'plataforma_estudiantes/estudiantes/uidB': { curso: '2B-HC' },
  'plataforma_estudiantes/estudiantes/uidRetirado': { curso: '2B-HC', activo: false },
  'plataforma_estudiantes/estudiantes/uidOtro': { curso: '3A-HC' },
  'plataforma_estudiantes/estudiantes/uidSinFila': { curso: '2A-HC' },
  [P.NODE + '/meta']: { publicada: true, revisadaEl: '25 de noviembre de 2026' },
  [P.NODE + '/filas/uidA']: fixtureRow('2A-HC'),
  [P.NODE + '/filas/uidB']: { ...fixtureRow('2B-HC'), pendientes: 0, piso: false, celdas: Object.fromEntries(P.COLUMNS.map(k => [k, cell(6.5)])) },
  [P.NODE + '/filas/uidRetirado']: fixtureRow('2B-HC')
};
const db = { ref: p => ({ once: async () => ({ val: () => (p in DATA ? JSON.parse(JSON.stringify(DATA[p])) : null) }) }) };
const auth = { verifyIdToken: async t => { if (!t.startsWith('tok-')) throw new Error('bad'); return { uid: t.slice(4) }; } };

async function call(token, method = 'GET') {
  const out = { headers: {} };
  const res = { setHeader: (k, v) => { out.headers[k] = v; }, status(c) { out.status = c; return this; }, json(b) { out.body = b; return this; } };
  await P.manejar({ method, headers: token ? { authorization: 'Bearer ' + token } : {} }, res, db, auth);
  return out;
}

(async () => {
  // 1. API: solo la fila propia, sin token no, retirados y otros cursos no.
  let r = await call('');
  assert.equal(r.status, 401, 'sin token: 401');
  r = await call('malo');
  assert.equal(r.status, 401, 'token inválido: 401');
  r = await call('tok-uidA', 'POST');
  assert.equal(r.status, 405, 'solo GET');
  r = await call('tok-uidA');
  assert.equal(r.status, 200);
  assert.equal(r.headers['Cache-Control'], 'no-store');
  assert.equal(r.body.planilla.curso, '2A-HC');
  assert.equal(r.body.planilla.pendientes, 3);
  assert.deepEqual(Object.keys(r.body.planilla).sort(), ['celdas', 'columnas', 'curso', 'pendientes', 'periodo', 'piso', 'promedioFinal', 'promedioTareas', 'revisadaEl'].sort(), 'no se filtra nada más que la fila');
  assert.ok(!JSON.stringify(r.body).includes('uidB') && !JSON.stringify(r.body).includes('Uno'), 'no trae otras filas ni datos del perfil');
  for (const uid of ['uidRetirado', 'uidOtro', 'uidSinFila', 'uidNoExiste']) {
    r = await call('tok-' + uid);
    assert.equal(r.status, 200);
    assert.equal(r.body.planilla, null, uid + ': sin planilla');
  }
  // Fila con curso cruzado o conteo de pendientes inconsistente: no se muestra.
  assert.equal(P.cleanRow(fixtureRow('2A-HC'), '2B-HC'), null, 'curso cruzado');
  assert.equal(P.cleanRow({ ...fixtureRow('2A-HC'), pendientes: 2 }, '2A-HC'), null, 'pendientes inconsistentes');
  // Planilla sin publicar: nadie la ve.
  const meta = DATA[P.NODE + '/meta'];
  DATA[P.NODE + '/meta'] = { publicada: false };
  assert.equal((await call('tok-uidA')).body.planilla, null, 'sin publicar');
  DATA[P.NODE + '/meta'] = meta;
  console.log('API: 11 comprobaciones OK');

  // 2. Página en navegador: servidor local + sesión simulada.
  const { chromium } = require('playwright');
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    if (url.pathname === '/api/estudiantes') {
      const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
      const out = await call(token);
      res.writeHead(out.status, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(out.body));
    }
    const file = path.join(ROOT, decodeURIComponent(url.pathname));
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
    const type = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css' }[path.extname(file)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    res.end(fs.readFileSync(file));
  });
  await new Promise(ok => server.listen(0, ok));
  const base = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch();
  const shots = path.join(require('node:os').tmpdir(), 'audit-planilla-semestre');
  fs.mkdirSync(shots, { recursive: true });
  try {
    for (const [uid, width, height] of [['uidA', 390, 844], ['uidA', 1440, 900], ['uidA', 3840, 2160], ['uidB', 390, 844], ['uidOtro', 1440, 900], ['', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height } });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      await page.route(/gstatic\.com/, route => route.fulfill({ contentType: 'text/javascript', body: '' }));
      await page.route(/\/paes\/js\/student-session\.js$/, route => route.fulfill({ contentType: 'text/javascript', body: '' }));
      await page.route(/\/paes\/mini-invierno-2027\/sesion\.js$/, route => route.fulfill({
        contentType: 'text/javascript',
        body: `window.MiniSession={restore:async()=>${uid ? `({user:{getIdToken:async()=>'tok-${uid}'}})` : 'null'},signIn:async()=>{throw new Error('x')}};`
      }));
      await page.goto(base + '/paes/nm2/notas.html');
      if (uid === 'uidA') {
        await page.waitForSelector('#planilla:not([hidden]) .notas-resumen');
        const t = await page.textContent('#planilla');
        assert.ok(t.includes('5,4') && t.includes('6,0') && t.includes('sube a 6,0'), 'resumen con promedios y piso');
        assert.ok(t.includes('Tienes 3 tareas pendientes') && t.includes('Clase 5') && t.includes('Miniensayo 2'), 'aviso de pendientes');
        assert.equal(await page.locator('.nota.pend').count(), 3, 'tres casillas naranjas');
        assert.equal(await page.locator('.nota.na').count(), 1, 'una N/A');
        assert.equal(await page.locator('.nota.low').count(), 1, 'nota roja bajo 4');
        assert.equal(await page.locator('a[href="clase.html?clase=1"]').count(), 1, 'botón a la clase 1 de NM2');
        assert.ok((await page.textContent('#identity')).includes('2.º A HC'));
      } else if (uid === 'uidB') {
        await page.waitForSelector('#planilla:not([hidden])');
        assert.ok((await page.textContent('#planilla')).includes('No tienes tareas pendientes'));
        assert.equal(await page.locator('.nota.pend').count(), 0);
      } else if (uid === 'uidOtro') {
        await page.waitForFunction(() => document.getElementById('status').textContent.includes('2.º A y 2.º B HC'));
        assert.ok(await page.locator('#planilla').isHidden());
      } else {
        await page.waitForTimeout(300);
        assert.ok(await page.locator('#loginButton').isVisible(), 'sin sesión: botón de ingreso');
        assert.ok(await page.locator('#planilla').isHidden());
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(overflow <= 0, `sin desborde horizontal a ${width}px (${overflow})`);
      assert.deepEqual(errors, [], 'sin errores de consola');
      await page.screenshot({ path: path.join(shots, `${uid || 'sin-sesion'}-${width}.png`), fullPage: true });
      await page.close();
      console.log(`Página ${uid || 'sin sesión'} a ${width}px: OK`);
    }
    // El portal NM2 enlaza la página.
    const index = fs.readFileSync(path.join(ROOT, 'paes/nm2/index.html'), 'utf8');
    assert.ok(index.includes('href="notas.html"'), 'botón en el portal NM2');
  } finally {
    await browser.close();
    server.close();
  }
  console.log('Capturas en', shots);
  console.log('audit-planilla-semestre: OK');
})().catch(e => { console.error(e); process.exitCode = 1; });
