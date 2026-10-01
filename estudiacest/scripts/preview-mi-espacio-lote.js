/* Vista local aislada: no toca Firebase ni publica nada. */
const { chromium } = require('playwright');
const path = require('path');

const BASE = 'http://127.0.0.1:8899';
const sprites = ['gamerChair','bedSingle','gamerDesk','whiteGamerTower','aquarium',
  'petDachshund','rugRangers','electricGuitarSet','loungeSofaThree','rgbPartySpeaker'];
const muebles = [
  { id:'gamerChair', col:2, fila:2, dir:'SE' },
  { id:'bedSingle', col:0, fila:1, dir:'SE' },
  { id:'gamerDesk', col:3, fila:1, dir:'SE' },
  { id:'whiteGamerTower', col:4, fila:1, dir:'SE' },
  { id:'aquarium', col:4, fila:3, dir:'SE' },
  { id:'petDachshund', col:1, fila:3, dir:'SE' },
  { id:'rugRangers', col:2, fila:3, dir:'SE' },
  { id:'electricGuitarSet', col:0, fila:4, dir:'SE' },
  { id:'loungeSofaThree', col:3, fila:4, dir:'SE' },
  { id:'rgbPartySpeaker', col:1, fila:1, dir:'SE' }
];
const regalos = Object.fromEntries(sprites.map(id => [id, { de:'Profesor', fecha:1 }]));

async function vista(browser, nombre, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor:1 });
  const errores = [];
  const gestos = [];
  const assets = new Set();
  page.on('pageerror', e => errores.push(e.message));
  page.on('request', r => { if (r.url().includes('/estudiantes/assets/pieza/')) assets.add(r.url()); });
  page.on('response', r => { if (r.status() >= 400 && r.url().includes('/estudiantes/assets/pieza/')) errores.push(`${r.status()} ${r.url()}`); });
  await page.route('**/api/estudiantes', async route => {
    const cuerpo = JSON.parse(route.request().postData() || '{}');
    const action = cuerpo.action;
    if (action === 'salas-latido' && cuerpo.gesto) gestos.push(cuerpo.gesto);
    const datos = action === 'salas-estado' ? { ok:true, enabled:true }
      : action === 'salas-inventario' ? { ok:true, desbloqueados:{}, requisitos:{}, regalos }
      : action === 'salas-entrar' ? { ok:true, yo:'Prueba' } : { ok:true };
    await route.fulfill({ status:200, contentType:'application/json', body:JSON.stringify(datos) });
  });
  await page.goto(`${BASE}/estudiantes/index.html`, { waitUntil:'commit' });
  await page.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#0f172a"><main id="host" style="max-width:1100px;margin:auto"></main></body></html>');
  await page.addStyleTag({ url:`${BASE}/estudiantes/css/mi-espacio.css` });
  for (const file of ['catalogo-casa','personaje-iso','mapas-casa','mi-espacio']) await page.addScriptTag({ url:`${BASE}/estudiantes/js/${file}.js` });
  await page.evaluate(({ muebles, regalos }) => {
    window.__writes = [];
    const guardado = {};
    const ref = key => ({
      once: async () => ({ val:() => guardado[key] ?? null, exists:() => guardado[key] != null }),
      on:() => {}, off:() => {},
      child: child => ref(`${key}/${child}`),
      orderByChild:() => ref(key), limitToLast:() => ref(key),
      set: async value => { guardado[key] = value; window.__writes.push({ key, value }); }
    });
    const db = { ref };
    const auth = { currentUser:{ getIdToken:async () => 'prueba' } };
    window.MiEspacio.montar({ host:document.querySelector('#host'), db, auth,
      base:'preview', uid:'prueba', nombre:'Prueba', xp:0, look:{ arriba:'camisetaRangers' },
      pieza:muebles, regalos, personajeEn:{ col:2, fila:3 } });
  }, { muebles, regalos });
  await page.locator('[data-p="pieza"]').click();
  await page.waitForTimeout(900);
  const antes = await page.locator('#espLienzo').evaluate(el => el.toDataURL());
  await page.waitForTimeout(300);
  const animacion = antes !== await page.locator('#espLienzo').evaluate(el => el.toDataURL());
  const resultado = await page.evaluate(() => ({
    muebles: document.querySelectorAll('.esp-item').length,
    canvas: [document.querySelector('#espLienzo').width, document.querySelector('#espLienzo').height],
    useDisabled: document.querySelector('#espUsar').disabled,
    overflow: document.documentElement.scrollWidth > innerWidth
  }));
  await page.locator('#espLienzo').focus();
  await page.keyboard.press('Tab');
  const usoHabilitado = await page.locator('#espUsar').isEnabled();
  await page.keyboard.press('e');
  await page.waitForTimeout(850);
  const sentado = await page.evaluate(() => window.__writes.some(w => w.key.endsWith('/personajeEn') && w.value.col === 2 && w.value.fila === 2));
  const salida = path.resolve(__dirname, `../../scratch/mi-espacio-lote-${nombre}.png`);
  await page.screenshot({ path:salida, fullPage:true });
  await page.locator('#espLienzo').focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('e');
  await page.waitForTimeout(1300);
  const acostado = await page.evaluate(() => window.__writes.some(w => w.key.endsWith('/personajeEn') && w.value.col === 0 && w.value.fila === 1));
  if (nombre === 'escritorio') await page.locator('#espLienzo').screenshot({ path:path.resolve(__dirname, '../../scratch/mi-espacio-lote-acostado.png') });
  await page.locator('#espTerreno [data-t="tamano"]').click();
  await page.locator('#espPaleta [data-id="7x7"]').click();
  await page.waitForTimeout(650);
  const salon = await page.evaluate(() => window.__writes.some(w => w.key.endsWith('/casa') && w.value.tamano === '7x7'));
  await page.locator('[data-gesto="saludar"]').click();
  await page.waitForTimeout(120);
  const saludar = gestos.includes('saludar');
  await page.locator('#espLienzo').focus();
  for (let i = 0; i < muebles.length; i++) await page.keyboard.press('Tab');
  const speakerSeleccionado = await page.locator('#espUsar').textContent();
  await page.keyboard.press('e');
  await page.waitForTimeout(650);
  const speakerEncendido = await page.evaluate(() => window.__writes.some(w =>
    w.key.endsWith('/pieza') && w.value.some(m => m.id === 'rgbPartySpeaker' && m.encendido === true)));
  await page.locator('#espLienzo').screenshot({ path:path.resolve(__dirname, `../../scratch/mi-espacio-lote-parlante-${nombre}.png`) });
  await page.locator('#espAcercar').click();
  const zoom = await page.locator('#espZoomNivel').textContent();
  await page.locator('#espPan').click();
  const rect = await page.locator('#espLienzo').boundingBox();
  const centro = { x:rect.x + rect.width / 2, y:rect.y + rect.height / 2 };
  await page.mouse.move(centro.x, centro.y);
  await page.mouse.down();
  await page.mouse.move(centro.x + 45, centro.y + 30, { steps:5 });
  await page.mouse.up();
  const panActivado = await page.locator('#espPan').getAttribute('aria-pressed');
  await page.locator('#espCentrar').click();
  const centrado = await page.locator('#espZoomNivel').textContent();
  console.log(JSON.stringify({ nombre, resultado, animacion, usoHabilitado, sentado, acostado, salon, saludar, speakerSeleccionado, speakerEncendido, zoom, panActivado, centrado, assets:assets.size, errores, salida }));
  await page.close();
  if (errores.length || !animacion || !usoHabilitado || !sentado || !acostado || !salon || !saludar || speakerSeleccionado !== 'Encender' || !speakerEncendido || zoom !== '125 %' || panActivado !== 'true' || centrado !== 'Vista completa' || assets.size >= 100 || resultado.overflow) process.exitCode = 1;
}

async function camisetas(browser) {
  const page = await browser.newPage({ viewport:{ width:1000, height:300 }, deviceScaleFactor:1 });
  await page.goto(`${BASE}/estudiantes/index.html`, { waitUntil:'commit' });
  await page.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:16px;background:#eef2f7;font:14px sans-serif"><div id="galeria" style="display:flex;gap:12px"></div></body></html>');
  await page.addScriptTag({ url:`${BASE}/estudiantes/js/personaje-iso.js` });
  await page.evaluate(() => {
    ['RealMadrid','Barcelona','ColoColo','Catolica','UChile','Rangers'].forEach(club => {
      const box = document.createElement('div');
      box.style.cssText = 'width:145px;text-align:center;background:white;border-radius:12px;padding:6px';
      const fig = document.createElement('div'); box.appendChild(fig);
      const label = document.createElement('div'); label.textContent = club; box.appendChild(label);
      document.querySelector('#galeria').appendChild(box);
      window.AvatarLookSystem.render(fig, { look:{ arriba:`camiseta${club}` }, xpTotal:0, size:128 });
    });
  });
  const salida = path.resolve(__dirname, '../../scratch/mi-espacio-lote-camisetas.png');
  await page.screenshot({ path:salida, fullPage:true });
  console.log(JSON.stringify({ camisetas:6, salida }));
  await page.close();
}

(async () => {
  const browser = await chromium.launch({ headless:true });
  try {
    await vista(browser, 'escritorio', { width:1200, height:900 });
    await vista(browser, 'celular', { width:390, height:844 });
    await camisetas(browser);
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
