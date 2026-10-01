/* Prueba local de la importación Tiled. No usa Firebase ni hace publicaciones. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');
const { importar } = require('./mapa-tiled.js');
const mapasPublicados = require('../../estudiantes/js/mapas-casa.js');

const root = path.resolve(__dirname, '../..');
const bruto = JSON.parse(fs.readFileSync(path.join(__dirname, 'sala-en-l.json'), 'utf8'));
const mapa = importar(bruto);
const publicado = mapasPublicados.obtener('salon-l');
assert.ok(publicado, 'El mapa en L debe estar disponible en Mi casa.');
assert.deepEqual(publicado.entrada, mapa.inicio, 'La entrada publicada debe coincidir con Tiled.');
for (let f = 0; f < publicado.filas; f++) for (let c = 0; c < publicado.cols; c++) {
  assert.equal(mapasPublicados.haySuelo('salon-l', c, f), mapa.existe(c, f),
    `La casilla ${c},${f} debe coincidir con Tiled.`);
}
assert.equal(mapa.suelo.length, 40);
assert.equal(mapa.pisable(6, 1), false, 'El hueco no debe permitir caminar.');
assert.equal(mapa.pisable(5, 4), false, 'El sofá debe cortar el paso.');
assert.ok(mapa.ruta(mapa.inicio, { col:6, fila:6 }).length >= 10);
assert.equal(mapa.ruta(mapa.inicio, { col:6, fila:1 }), null);
assert.throws(() => importar({ ...bruto, orientation:'orthogonal' }), /isométrico/);
const aislado = structuredClone(bruto);
for (let c = 0; c < 7; c++) aislado.layers[0].data[3 * 7 + c] = 0;
assert.throws(() => importar(aislado), /aisladas/);

const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8', '.png':'image/png', '.css':'text/css; charset=utf-8' };
const servidor = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname); }
  catch { res.writeHead(400).end(); return; }
  const archivo = path.resolve(root, '.' + pathname);
  if (!archivo.startsWith(root + path.sep) || !fs.existsSync(archivo) || !fs.statSync(archivo).isFile()) {
    res.writeHead(404).end(); return;
  }
  res.writeHead(200, { 'Content-Type':mime[path.extname(archivo)] || 'application/octet-stream' });
  fs.createReadStream(archivo).pipe(res);
});

async function vista(browser, puerto, ancho, alto) {
  const page = await browser.newPage({ viewport:{ width:ancho, height:alto }, deviceScaleFactor:1 });
  const errores = [];
  page.on('pageerror', e => errores.push(e.message));
  page.on('response', r => { if (r.status() >= 400) errores.push(r.status() + ' ' + r.url()); });
  await page.goto(`http://127.0.0.1:${puerto}/scripts/mi-espacio-lab/index.html`);
  await page.getByText('Salón en L listo. Puedes caminar entre sus dos zonas.').waitFor();
  const inicial = await page.locator('#lienzo').evaluate(el => el.toDataURL());
  const hueco = await page.evaluate(() => window.LabHabitaciones.centroPantalla(6, 1));
  await page.mouse.click(hueco.x, hueco.y);
  assert.match(await page.locator('#estado').textContent(), /no se puede caminar/);
  const destino = await page.evaluate(() => window.LabHabitaciones.centroPantalla(6, 6));
  await page.mouse.click(destino.x, destino.y);
  await page.getByText('Llegaste a la otra zona.').waitFor({ timeout:8000 });
  const final = await page.evaluate(() => window.LabHabitaciones.avatar());
  assert.deepEqual(final, { col:6, fila:6 });
  const diferente = inicial !== await page.locator('#lienzo').evaluate(el => el.toDataURL());
  assert.equal(diferente, true, 'Debe verse el movimiento del avatar.');
  await page.locator('#acercar').click();
  assert.equal(await page.locator('#nivel').textContent(), '125 %');
  await page.locator('#arrastrar').click();
  assert.equal(await page.locator('#arrastrar').getAttribute('aria-pressed'), 'true');
  const caja = await page.locator('#lienzo').boundingBox();
  await page.mouse.move(caja.x + caja.width / 2, caja.y + caja.height / 2);
  await page.mouse.down();
  await page.mouse.move(caja.x + caja.width / 2 + 50, caja.y + caja.height / 2 + 30, { steps:5 });
  await page.mouse.up();
  await page.locator('#centrar').click();
  assert.equal(await page.locator('#nivel').textContent(), 'Vista completa');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  assert.equal(overflow, false, `Desborde horizontal en ${ancho}px.`);
  assert.deepEqual(errores, []);
  const salida = path.resolve(root, `../scratch/lab-casa-tiled-${ancho}.png`);
  await page.screenshot({ path:salida, fullPage:true });
  console.log(JSON.stringify({ viewport:ancho, suelo:mapa.suelo.length, huecoRechazado:true,
    ruta:mapa.ruta(mapa.inicio, { col:6, fila:6 }).length, avatarFinal:final, overflow, errores, captura:salida }));
  await page.close();
}

async function panelReal(browser, puerto, ancho, alto, pieza, debeAceptar, avatarInicial) {
  const page = await browser.newPage({ viewport:{ width:ancho, height:alto }, deviceScaleFactor:1 });
  const errores = [];
  page.on('pageerror', e => errores.push(e.message));
  page.on('response', r => { if (r.status() >= 400 && r.url().includes('/estudiantes/assets/pieza/')) errores.push(r.status() + ' ' + r.url()); });
  await page.route('**/api/estudiantes', async route => {
    const { action } = JSON.parse(route.request().postData() || '{}');
    const dato = action === 'salas-estado' ? { ok:true, enabled:true } :
      action === 'salas-inventario' ? { ok:true, desbloqueados:{}, requisitos:{},
        regalos:Object.fromEntries(pieza.map(m => [m.id, { de:'Profesor', fecha:1 }])) } :
      action === 'salas-lista' ? { ok:true, casas:[{ uid:'amigo123', nombre:'Compañero', n:0 }] } :
      action === 'salas-entrar' ? { ok:true, yo:'Prueba' } : { ok:true };
    await route.fulfill({ status:200, contentType:'application/json', body:JSON.stringify(dato) });
  });
  await page.goto(`http://127.0.0.1:${puerto}/estudiantes/index.html`, { waitUntil:'commit' });
  await page.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#0f172a"><main id="host" style="max-width:1100px;margin:auto"></main></body></html>');
  await page.addStyleTag({ url:`http://127.0.0.1:${puerto}/estudiantes/css/mi-espacio.css` });
  for (const archivo of ['catalogo-casa', 'personaje-iso', 'mapas-casa', 'mi-espacio']) {
    await page.addScriptTag({ url:`http://127.0.0.1:${puerto}/estudiantes/js/${archivo}.js` });
  }
  await page.evaluate(({ piezaInicial, avatar }) => {
    const valores = { 'prueba/avatar/amigo123': { casa:{ tamano:'7x7', piso:'claro', muro:'blanco' }, pieza:[] },
      'prueba/avatar/amigo123/casa': { tamano:'7x7', piso:'claro', muro:'blanco' },
      'prueba/avatar/amigo123/pieza': [] };
    const subs = {};
    window.__writes = [];
    window.__subs = subs;
    window.__cambiarCasaAmigo = value => {
      valores['prueba/avatar/amigo123/casa'] = value;
      (subs['prueba/avatar/amigo123/casa'] || []).forEach(fn => fn({ val:() => value }));
    };
    const ref = key => ({
      once:async () => ({ val:() => valores[key] ?? null, exists:() => valores[key] != null }),
      on:(evento, fn) => { if (evento === 'value') {
        (subs[key] ||= []).push(fn); queueMicrotask(() => fn({ val:() => valores[key] ?? null }));
      } },
      off:() => { subs[key] = []; },
      set:async value => { valores[key] = value; window.__writes.push({ key, value:structuredClone(value) }); },
      orderByChild:() => ref(key), limitToLast:() => ref(key)
    });
    window.MiEspacio.montar({ host:document.querySelector('#host'), db:{ ref },
      auth:{ currentUser:{ getIdToken:async () => 'prueba' } }, base:'prueba', uid:'prueba',
      nombre:'Prueba', xp:0, pieza:piezaInicial, personajeEn:avatar });
  }, { piezaInicial:pieza, avatar:avatarInicial || { col:2, fila:3 } });
  await page.locator('[data-p="pieza"]').click();
  await page.locator('#espTerreno [data-t="tamano"]').click();
  if (debeAceptar) {
    await page.locator('#espPaleta [data-id="7x7"]').click();
    await page.waitForTimeout(650);
    assert.equal(await page.evaluate(() => window.__writes.some(w => w.key.endsWith('/casa') && w.value.tamano === '7x7')),
      true, 'El salón 7 × 7 anterior debe seguir guardando.');
    await page.locator('#espTerreno [data-t="tamano"]').click();
  }
  await page.locator('#espPaleta [data-id="salon-l"]').click();
  await page.waitForTimeout(700);
  const guardoCasa = await page.evaluate(() => window.__writes.some(w => w.key.endsWith('/casa') && w.value.tamano === 'salon-l'));
  assert.equal(guardoCasa, debeAceptar, 'El cambio de tamaño debe respetar los muebles existentes.');
  if (!debeAceptar) {
    assert.match(await page.locator('.esp-aviso').textContent(), /muebles que quedarían fuera/);
    await page.close();
    return;
  }
  assert.equal(await page.evaluate(() => window.__writes.some(w => w.key.endsWith('/pieza'))), false,
    'El mapa no debe regalar ni alterar muebles al seleccionarlo.');
  if (avatarInicial && avatarInicial.col === 4 && avatarInicial.fila === 1) {
    assert.equal(await page.evaluate(() => window.__writes.some(w => w.key.endsWith('/personajeEn') && w.value.col === 1 && w.value.fila === 1)),
      true, 'Al cambiar a la L, el avatar situado en el hueco debe guardarse en la entrada.');
  }
  const captura = path.resolve(root, `../scratch/mi-casa-en-l-panel-${ancho}.png`);
  await page.screenshot({ path:captura, fullPage:true });
  function centro(col, fila) {
    return page.locator('#espLienzo').evaluate((el, pos) => {
      const W = el.clientWidth, H = el.clientHeight, z = Math.min(1, (W - 16) / (14 * 75 + 151), (H - 16) / (14 * 53 + 106 + 132));
      const ox = W / 2 - 151 / 2, oy = (H - 14 * 53) / 2 + 26;
      const x = ox + (pos.col - pos.fila) * 75 + 151 / 2;
      const y = oy + (pos.col + pos.fila) * 53 + 53;
      const box = el.getBoundingClientRect();
      return { x:box.x + W / 2 + z * (x - W / 2), y:box.y + H / 2 + z * (y - H / 2) };
    }, { col, fila });
  }
  const antes = await page.evaluate(() => window.__writes.filter(w => w.key.endsWith('/personajeEn')).length);
  await page.locator('#espLienzo').focus();
  await page.keyboard.press('Tab');
  const mueblesAntes = await page.evaluate(() => window.__writes.filter(w => w.key.endsWith('/pieza')).length);
  const hueco = await centro(6, 1);
  await page.mouse.click(hueco.x, hueco.y);
  await page.waitForTimeout(650);
  assert.equal(await page.evaluate(() => window.__writes.filter(w => w.key.endsWith('/pieza')).length), mueblesAntes,
    'Tocar el hueco con un mueble seleccionado no debe colocarlo allí.');
  assert.equal(await page.evaluate(() => window.__writes.filter(w => w.key.endsWith('/personajeEn')).length), antes,
    'Un clic en el hueco no debe mover al avatar.');
  const destino = await centro(6, 6);
  await page.mouse.click(destino.x, destino.y);
  await page.waitForFunction(() => window.__writes.some(w => w.key.endsWith('/personajeEn') && w.value.col === 6 && w.value.fila === 6),
    null, { timeout:8000 });
  await page.locator('#espVisitar').click();
  await page.locator('#espVisitas [data-uid="amigo123"]').click();
  await page.waitForFunction(() => (window.__subs['prueba/avatar/amigo123/casa'] || []).length === 1);
  const salaAntes = await page.locator('#espLienzo').evaluate(el => el.toDataURL());
  await page.evaluate(() => window.__cambiarCasaAmigo({ tamano:'salon-l', piso:'claro', muro:'blanco' }));
  await page.waitForTimeout(150);
  const salaDespues = await page.locator('#espLienzo').evaluate(el => el.toDataURL());
  assert.notEqual(salaAntes, salaDespues, 'La visita debe ver el cambio de geometría del dueño.');
  assert.deepEqual(errores, []);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false,
    `El panel no debe desbordarse a ${ancho}px.`);
  console.log(JSON.stringify({ panel:ancho, casaGuardada:true, huecoRechazado:true,
    avatarFinal:{ col:6, fila:6 }, visitaSincronizada:true, captura, errores }));
  await page.close();
}

(async () => {
  await new Promise(resolve => servidor.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless:true });
  try {
    const puerto = servidor.address().port;
    await vista(browser, puerto, 390, 844);
    await vista(browser, puerto, 1200, 900);
    await vista(browser, puerto, 3840, 2160);
    await panelReal(browser, puerto, 1200, 900, [{ id:'desk', col:4, fila:1, dir:'SE' }], false);
    await panelReal(browser, puerto, 390, 844, [{ id:'rugRound', col:2, fila:2, dir:'SE' }], true);
    await panelReal(browser, puerto, 1200, 900, [{ id:'rugRound', col:2, fila:2, dir:'SE' }], true, { col:4, fila:1 });
  } finally { await browser.close(); await new Promise(resolve => servidor.close(resolve)); }
})().catch(e => { console.error(e); servidor.close(); process.exitCode = 1; });
