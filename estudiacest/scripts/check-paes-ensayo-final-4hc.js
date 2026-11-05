'use strict';
// Prueba en navegador real (Chrome con Playwright) del ensayo final de 4.º A y B HC.
// Solo local: usa la base simulada de audit-paes-ensayo-final-4hc.js, nunca Firebase.
// Uso: node scripts/check-paes-ensayo-final-4hc.js [carpeta-de-capturas]
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const { chromium } = require('playwright'), C = require('../api/_paes-ensayo-final-4hc-catalog'), B = require('../api/_paes-ensayo-final-4hc');
const fixtures = require('./audit-paes-ensayo-final-4hc');
const ROOT = path.resolve(__dirname, '..'), SHOTS = process.argv[2] || require('node:os').tmpdir();
let checks = 0; const check = (c, m) => { assert.ok(c, m); checks++; };
const session = uid => `window.MiniSession={restore:async()=>({user:{getIdToken:async()=>${JSON.stringify(uid)}}})};`;

async function main() {
  const db = fixtures.database();
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname === '/api/paes') {
        let raw = ''; for await (const chunk of req) raw += chunk;
        const token = String(req.headers.authorization || '').replace('Bearer ', '');
        const action = url.searchParams.get('action').replace('admin-ef4hc-', 'admin-mini-').replace('ef4hc-', 'mini-');
        const out = await fixtures.call(db, action, token, raw ? JSON.parse(raw) : null, url.searchParams.get('mode'), token === 'profesor');
        res.writeHead(out.status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(out.body)); return;
      }
      const file = path.resolve(ROOT, '.' + decodeURIComponent(url.pathname) + (url.pathname.endsWith('/') ? 'index.html' : ''));
      if (!file.startsWith(ROOT + path.sep) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
      res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html');
      res.end(fs.readFileSync(file));
    } catch (_) { res.writeHead(500); res.end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), page = await context.newPage();
    const errors = [], failed = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
    let offline = false; page.on('requestfailed', r => { if (!offline) failed.push(r.url()); });
    page.on('response', r => { if (r.status() >= 400 && !r.url().includes('/api/paes')) failed.push(r.status() + ' ' + r.url()); });
    const stub = async (pg, uid) => {
      await pg.route('https://www.gstatic.com/**', r => r.fulfill({ contentType: 'text/javascript', body: '' }));
      await pg.route('**/paes/js/student-session.js', r => r.fulfill({ contentType: 'text/javascript', body: 'window.PaesStudentSession={errorMessage:e=>e.message};' }));
      await pg.route('**/paes/ensayo-final-4hc/sesion.js', r => r.fulfill({ contentType: 'text/javascript', body: session(uid) }));
    };
    await stub(page, 'alumno');
    const regular = C.questionsFor(false), shot = name => page.screenshot({ path: path.join(SHOTS, 'ef4hc-' + name + '.png'), fullPage: true });

    // Ingreso: 90 minutos visibles antes de comenzar.
    await page.goto(origin + '/paes/ensayo-final-4hc/');
    check((await page.locator('#entry').textContent()).includes('42 preguntas'), 'la entrada anuncia 42 preguntas');
    await page.locator('#enter').click(); await page.locator('#ready').waitFor({ state: 'visible' });
    check((await page.locator('#ready').textContent()).includes('90 minutos'), '90 minutos visibles antes de comenzar');
    check(!(await db.ref(B.BASE + '/' + C.SESSION + '/alumno').once('value')).val(), 'entrar no crea el intento');
    await page.locator('#begin').click(); await page.locator('[data-answer]').first().waitFor();
    check(await page.locator('#tabs button').count() === 6, 'cinco lecturas y la revisión como pestañas');
    check(await page.locator('.question').count() === 7, 'la lectura 1 muestra sus 7 preguntas');
    check(await page.locator('.reading table').count() === 1 && await page.locator('.reading table tbody tr').count() === 3, 'la tabla de la lectura 1 aparece junto al texto');
    check(await page.locator('#timer').isVisible() && /^Tiempo restante: (8\d|90):\d\d$/.test((await page.locator('#timer').textContent()).trim()), 'reloj de 90 minutos visible');
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'móvil 390 px sin desborde horizontal');
    await shot('movil-lectura1');

    // Guardado, red interrumpida y recarga.
    await page.locator('[data-q=q1][data-answer]').first().click();
    const firstLetter = await page.locator('[data-q=q1][aria-pressed=true]').getAttribute('data-answer');
    await page.waitForFunction(() => document.getElementById('saveStatus').textContent === 'Avance guardado');
    offline = true; await context.setOffline(true);
    await page.locator('[data-q=q2][data-answer]').first().click();
    await page.waitForFunction(() => document.getElementById('saveStatus').textContent.includes('Error al guardar'));
    check(await page.locator('[data-q=q2][aria-pressed=true]').count() === 1, 'sin red el avance se conserva en pantalla');
    await context.setOffline(false); offline = false;
    await page.waitForFunction(() => document.getElementById('saveStatus').textContent === 'Avance guardado');
    const deadline = (await db.ref(B.BASE + '/' + C.SESSION + '/alumno').once('value')).val().expiresAt;
    await page.reload(); await page.locator('#enter').click(); await page.locator('#begin').click();
    await page.locator('[data-q=q1][aria-pressed=true]').waitFor();
    check(await page.locator('[data-q=q1][aria-pressed=true]').getAttribute('data-answer') === firstLetter, 'la recarga recupera la respuesta');
    check((await db.ref(B.BASE + '/' + C.SESSION + '/alumno').once('value')).val().expiresAt === deadline, 'la recarga no reinicia el reloj');

    // Responde todo con la clave y recorre las lecturas.
    for (let t = 1; t <= 5; t++) {
      await page.locator(`[data-tab="${t}"]`).click();
      check(await page.locator('.question').count() === regular.filter(q => q.textId === t).length, 'preguntas junto a la lectura ' + t);
      for (const q of regular.filter(q => q.textId === t)) {
        const order = (await db.ref('x').once('value')).val; void order;
        // La posición visible depende del orden mezclado por el servidor: se busca por data-answer (letra original).
        await page.locator(`[data-q=${q.id}][data-answer=${q.key}]`).click();
      }
    }
    await page.waitForFunction(() => document.getElementById('saveStatus').textContent === 'Avance guardado');

    // Strike: una salida de la pestaña registra un incidente.
    await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); });
    await page.waitForFunction(() => /Strikes: 1 de 3/.test(document.getElementById('strikes').textContent), null, { timeout: 8000 });
    check((await db.ref(B.BASE + '/' + C.SESSION + '/alumno').once('value')).val().strikes === 1, 'el servidor registra el primer strike');
    await page.evaluate(() => { delete document.hidden; delete document.visibilityState; document.dispatchEvent(new Event('visibilitychange')); });

    // Tercer strike por la API del mismo usuario: cierra y entrega con dos marcas.
    for (const j of [2, 3]) await fixtures.call(db, 'mini-incident', 'alumno', { ...fixtures.full(false), eventId: 'browser-event-' + j, reason: 'blur' });
    const closed = (await db.ref(B.BASE + '/' + C.SESSION + '/alumno').once('value')).val();
    check(closed.submitted && closed.completada && closed.endedBy === 'strikes' && closed.correct === 42, 'el tercer strike entrega con las dos marcas');
    await page.reload(); await page.locator('#enter').click(); await page.locator('#confirmation').waitFor({ state: 'visible' });
    const confirmation = await page.locator('#confirmation').textContent();
    check(confirmation.includes('tercer strike') && !/aciertos|Nota \d/.test(confirmation), 'lectura de vuelta: entrega confirmada sin resultado');
    await page.locator('#closeConfirmation').click();
    check(await page.locator('#results').textContent().then(t => t.includes('pendientes de publicación')), 'resultado pendiente de publicación');
    const stateBody = JSON.stringify((await fixtures.call(db, 'mini-state', 'alumno')).body);
    check(!/"(?:key|failures|evidence)":/.test(stateBody) && !stateBody.includes('CADBCBAACD'), 'lo que recibe el cliente no contiene claves');
    await shot('movil-entregado');

    // Docente quita strikes y el estudiante continúa; después entrega y se publica.
    const adminPage = await context.newPage(), adminErrors = [];
    adminPage.on('pageerror', e => adminErrors.push(e.message));
    await adminPage.route('https://www.gstatic.com/**', r => r.fulfill({ contentType: 'text/javascript', body: '' }));
    await adminPage.route('**/paes/js/student-session.js', route => route.fulfill({ contentType: 'text/javascript', body: `const qaAuth={currentUser:{getIdToken:async()=>"profesor"},setPersistence:async()=>{},onAuthStateChanged:f=>{queueMicrotask(f);return()=>{};}};window.firebase={apps:[{name:'estudiacest-admin',auth:()=>qaAuth}],auth:{Auth:{Persistence:{LOCAL:'local'}}}};window.PaesStudentSession={client:async()=>({auth:qaAuth})};` }));
    await adminPage.setViewportSize({ width: 1440, height: 900 });
    await adminPage.goto(origin + '/paes/ensayo-final-4hc/docente.html');
    await adminPage.locator('#privatePanel').waitFor({ state: 'visible' });
    check(await adminPage.locator('#course option').count() === 2, 'filtro por curso: 4.º A y 4.º B');
    check((await adminPage.locator('#keys').textContent()).includes('Clave'), 'el docente ve la pauta');
    const rowText = await adminPage.locator('#rows tr', { hasText: 'QA 4A' }).textContent();
    check(rowText.includes('42/42') && rowText.includes('100 %') && rowText.includes('7,0') && rowText.includes('3/3'), 'fila con aciertos/42, porcentaje, nota 60 % y strikes');
    adminPage.once('dialog', d => d.accept('Incidencia técnica comprobada en el equipo'));
    await adminPage.locator('#rows tr', { hasText: 'QA 4A' }).locator('[data-clear-strikes]').click();
    await adminPage.waitForFunction(() => /Corrección confirmada/.test(document.getElementById('adminStatus').textContent));
    check((await db.ref(B.BASE + '/' + C.SESSION + '/alumno').once('value')).val().strikes === 0, 'quitar strikes deja el contador en cero');
    const reopened = (await db.ref(B.BASE + '/' + C.SESSION + '/alumno').once('value')).val();
    check(!reopened.submitted && !reopened.completada && Object.keys(reopened.answers).length === 42, 'quitar strikes reabre el intento con las 42 respuestas');
    await page.reload(); await page.locator('#enter').click(); await page.locator('#begin').click(); await page.locator('[data-tab="6"]').click();
    await page.locator('#submit').click(); await page.locator('#confirmation').waitFor({ state: 'visible' });
    await page.locator('#closeConfirmation').click();
    await adminPage.locator('#refresh').click();
    await adminPage.locator('#publish').click();
    await adminPage.waitForFunction(() => /publicados/.test(document.getElementById('publication').textContent));
    await adminPage.screenshot({ path: path.join(SHOTS, 'ef4hc-docente-1440.png'), fullPage: true });
    await adminPage.locator('#course').selectOption('4B-HC');
    check((await adminPage.locator('#publication').textContent()).includes('privados'), '4.º B sigue privado al publicar 4.º A');
    check(adminErrors.length === 0, 'panel docente sin errores');
    await adminPage.close();

    // Estudiante ve el resultado publicado.
    await page.reload(); await page.locator('#enter').click();
    await page.waitForFunction(() => document.getElementById('summary') && document.getElementById('results').textContent.includes('aciertos'), null, { timeout: 8000 }).catch(() => {});
    const published = await page.locator('#results').textContent();
    check(/42 de 42 aciertos/.test(published) && /Nota 7,0/.test(published), 'tras publicar aparece puntaje y nota');
    await shot('movil-publicado');

    // Escritorio 1440 px y reloj agotado.
    await page.setViewportSize({ width: 1440, height: 900 });
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), '1440 px sin desborde');
    await shot('escritorio-1440');

    // Estudiante 4.º B: vence el reloj en el servidor.
    const pageB = await context.newPage(); await stub(pageB, 'pareja'); await pageB.setViewportSize({ width: 1440, height: 900 });
    await pageB.goto(origin + '/paes/ensayo-final-4hc/'); await pageB.locator('#enter').click(); await pageB.locator('#begin').click();
    await pageB.locator('[data-answer]').first().waitFor();
    await pageB.locator(`[data-q=q1][data-answer=${regular[0].key}]`).click();
    await pageB.waitForFunction(() => document.getElementById('saveStatus').textContent === 'Avance guardado');
    const rec = (await db.ref(B.BASE + '/' + C.SESSION + '/pareja').once('value')).val();
    await db.ref(B.BASE + '/' + C.SESSION + '/pareja').set({ ...rec, timerStartedAt: rec.timerStartedAt - 91 * 60000, expiresAt: rec.expiresAt - 91 * 60000 });
    await pageB.reload(); await pageB.locator('#enter').click();
    await pageB.locator('#confirmation').waitFor({ state: 'visible' });
    check((await pageB.locator('#confirmedMessage').textContent()).includes('Se agotaron los 90 minutos'), 'al vencer, entrega automática');
    const expired = (await db.ref(B.BASE + '/' + C.SESSION + '/pareja').once('value')).val();
    check(expired.endedBy === 'time' && Object.keys(expired.answers).length === 1, 'solo cuentan las respuestas guardadas');
    await pageB.close();

    // Ruta acompañada.
    const guidedPage = await context.newPage(); await stub(guidedPage, 'apoyo'); await guidedPage.setViewportSize({ width: 390, height: 844 });
    await guidedPage.goto(origin + '/paes/ensayo-final-4hc/'); await guidedPage.locator('#enter').click(); await guidedPage.waitForURL('**/guiada.html');
    await guidedPage.locator('#enter').click(); await guidedPage.locator('#begin').click(); await guidedPage.locator('.question').waitFor();
    check(await guidedPage.locator('.question').count() === 1 && await guidedPage.locator('#timer').isHidden() && await guidedPage.locator('#listen').isVisible(), 'acompañado: una pregunta, sin reloj, con audio');
    check(await guidedPage.locator('#tabs button').count() === 2, 'acompañado: lectura y entrega');
    await guidedPage.screenshot({ path: path.join(SHOTS, 'ef4hc-guiada-390.png'), fullPage: true });
    const gq = C.questionsFor(true);
    for (let i = 0; i < gq.length; i++) {
      await guidedPage.locator(`[data-q=${gq[i].id}][data-answer=${gq[i].key}]`).click();
      await guidedPage.locator('#next').click();
    }
    await guidedPage.locator('#submit').click(); await guidedPage.locator('#confirmation').waitFor({ state: 'visible' });
    const g = (await db.ref(B.BASE + '/' + C.SESSION + '-guiada/apoyo').once('value')).val();
    check(g.completada && g.submitted && g.total === 6 && g.correct === 6 && g.variant === 'guided-access-2026', 'la entrega acompañada se guarda aparte');
    check(await guidedPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'acompañado 390 px sin desborde');
    await guidedPage.close();

    // Un curso ajeno no obtiene el ensayo.
    check((await fixtures.call(db, 'mini-state', 'tercero')).status === 403, 'curso ajeno recibe 403');
    check(errors.length === 0, 'sin errores de consola: ' + errors.join(' | '));
    check(failed.length === 0, 'sin solicitudes fallidas: ' + failed.join(' | '));
    console.log(JSON.stringify({ ok: true, mode: 'local', checks, session: C.SESSION }));
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
}
main().catch(e => { console.error(e.name, e.message); process.exitCode = 1; });
