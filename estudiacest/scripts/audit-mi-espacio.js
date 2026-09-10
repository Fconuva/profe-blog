/* Auditoría de Mi espacio: personaje, casa y catálogo de muebles.
 *
 * Comprueba que cada objeto del catálogo tenga sus cuatro sprites en disco, que
 * no haya nombres ni ids repetidos, que las reglas de apilado sean coherentes y
 * que el módulo siga guardando en Firebase con relectura.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const leer = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const fallos = [];
const exigir = (cond, msg) => { if (!cond) fallos.push(msg); };

// ---- catálogo ----
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(leer('estudiantes/js/catalogo-casa.js'), ctx);
const catalogo = ctx.window.CATALOGO_CASA;

exigir(Array.isArray(catalogo) && catalogo.length >= 120,
  `El catálogo debería traer al menos 120 objetos y trae ${catalogo ? catalogo.length : 0}.`);

const DIRS = ['SE', 'SW', 'NE', 'NW'];
const dirAssets = path.join(root, 'estudiantes/assets/pieza');
const enDisco = new Set(fs.readdirSync(dirAssets));

const ids = new Set();
const nombres = new Set();
let sinSprite = 0, conSuperficie = 0, apilables = 0, planos = 0;

for (const m of catalogo) {
  exigir(m.id && m.nom && m.fam, `Objeto incompleto: ${JSON.stringify(m)}`);
  exigir(!ids.has(m.id), `Id repetido en el catálogo: ${m.id}`);
  ids.add(m.id);
  exigir(!nombres.has(m.nom), `Dos objetos con el mismo nombre visible: "${m.nom}"`);
  nombres.add(m.nom);

  for (const d of DIRS) {
    if (!enDisco.has(`${m.id}_${d}.png`)) { sinSprite++; fallos.push(`Falta el sprite ${m.id}_${d}.png`); }
  }
  exigir(typeof m.xp === 'number' && m.xp >= 0, `${m.id}: XP inválido.`);
  exigir(typeof m.motivo === 'string' && m.motivo.length > 3, `${m.id}: falta el motivo de desbloqueo.`);
  // Una superficie no puede además apilarse sobre otra
  exigir(!(m.sup > 0 && m.apila), `${m.id}: es superficie y apilable a la vez.`);
  // Una alfombra no lleva cosas encima ni es superficie
  exigir(!(m.plano && (m.sup > 0 || m.apila)), `${m.id}: una alfombra no puede ser superficie ni apilarse.`);
  if (m.sup > 0) conSuperficie++;
  if (m.apila) apilables++;
  if (m.plano) planos++;
}

exigir(sinSprite === 0, `Hay ${sinSprite} sprites declarados que no están en disco.`);
exigir(conSuperficie >= 5, 'Deberían existir varias superficies donde apoyar cosas.');
exigir(apilables >= 5, 'Deberían existir varios objetos apilables.');
exigir(planos >= 4, 'Deberían existir alfombras.');

// Piso y muros que usa la escena
['floorFull_SE'].forEach(n => exigir(enDisco.has(n + '.png'), `Falta la baldosa base ${n}.png`));

// ---- módulo de la casa ----
const espacio = leer('estudiantes/js/mi-espacio.js');
exigir(/RUTA = '\/estudiantes\/assets\/pieza\//.test(espacio),
  'La ruta de los sprites debe ser absoluta: si es relativa, falla al montarse desde otra carpeta.');
exigir(espacio.includes('ref.set(valor)') && espacio.includes('ref.once('),
  'El guardado debe releer después de escribir: escribir no es haber guardado.');
exigir(espacio.includes('function ruta(') && espacio.includes('bloqueada('),
  'Falta el caminar con búsqueda de ruta que rodea los muebles.');
exigir(espacio.includes('esDePared') && espacio.includes('puntoMuro'),
  'Faltan los muebles que se cuelgan del muro.');
exigir(espacio.includes("'Mi casa'") || espacio.includes('>Mi casa<'),
  'La sección debe llamarse Mi casa.');
exigir(espacio.includes('alCambiarLook'),
  'El personaje del encabezado debe actualizarse al cambiarlo.');

// ---- personaje ----
const personaje = leer('estudiantes/js/personaje-iso.js');
const ctxP = { window: {}, devicePixelRatio: 1, document: { createElement: () => ({ getContext: () => ({ setTransform(){}, save(){}, restore(){}, beginPath(){}, fill(){}, stroke(){}, arc(){}, ellipse(){}, moveTo(){}, lineTo(){}, closePath(){}, rect(){}, roundRect(){}, drawImage(){}, fillRect(){} }), style: {}, classList: { add(){} } }) } };
vm.createContext(ctxP);
vm.runInContext(personaje, ctxP);
const ALS = ctxP.window.AvatarLookSystem;
exigir(ALS && typeof ALS.render === 'function', 'El personaje no expone la API esperada.');
exigir(ALS.ORDEN.length >= 12, `Se esperaban al menos 12 categorías de personalización y hay ${ALS.ORDEN.length}.`);
let opciones = 0;
ALS.ORDEN.forEach(cat => {
  const c = ALS.CATALOGO[cat];
  exigir(c && c.opciones.length >= 4, `La categoría ${cat} tiene muy pocas opciones.`);
  opciones += c.opciones.length;
  const idsCat = new Set();
  c.opciones.forEach(o => {
    exigir(!idsCat.has(o.id), `${cat}: opción repetida ${o.id}`);
    idsCat.add(o.id);
    if (o.color) exigir(/^#[0-9a-f]{6}$/i.test(o.color), `${cat}/${o.id}: color inválido ${o.color}`);
  });
  // cada categoría necesita al menos una opción disponible desde el comienzo
  exigir(c.opciones.some(o => !o.xp), `${cat}: ninguna opción está disponible con 0 XP.`);
});

// ---- salas y chat ----
const salasApi = leer('api/_salas.js');
exigir(salasApi.includes("require('./_filtro-garabatos.js')"), 'api/_salas.js debe pasar cada mensaje por el filtro de garabatos.');
exigir(salasApi.includes('verifyIdToken'), 'api/_salas.js debe identificar al estudiante por su token, no por lo que mande el navegador.');
exigir(!fs.existsSync(path.join(root, 'api/salas.js')), 'api/salas.js no puede existir como función propia: Vercel Hobby admite 12 y ya están ocupadas.');
exigir(leer('api/estudiantes.js').includes("require('./_salas.js')") && leer('api/estudiantes.js').includes("'salas-'"), 'api/estudiantes.js debe enrutar las acciones salas-* al módulo interno.');
exigir(espacio.includes("var API = '/api/estudiantes'") && espacio.includes("'salas-' + action"), 'El cliente debe hablar con /api/estudiantes usando acciones salas-*.');
exigir(/TOPE_SALA\s*=\s*30/.test(salasApi), 'El tope de la casa debe ser 30 personas.');
exigir(salasApi.includes('bloqueados_chat') && salasApi.includes('alertas_chat'), 'Los bloqueos y las alertas deben quedar registrados para el profesor.');

const reglas = JSON.parse(leer('firebase-rules.json')).rules.plataforma_estudiantes;
exigir(reglas.salas && reglas.salas['.write'] === false, 'El nodo salas debe tener .write en false: solo escribe el servidor.');
exigir(reglas.alertas_chat && reglas.alertas_chat['.write'] === false && /admins/.test(reglas.alertas_chat['.read'] || ''), 'alertas_chat debe ser solo lectura de admin.');
exigir(reglas.bloqueados_chat && reglas.bloqueados_chat['.write'] === false && /admins/.test(reglas.bloqueados_chat['.read'] || ''), 'bloqueados_chat debe ser solo lectura de admin.');
exigir(/estudiantes'\)\.child\(auth\.uid\)\.exists\(\)/.test(reglas.salas ? reglas.salas['.read'] : ''), 'salas: la lectura debe exigir estudiante registrado o admin, no cualquier cuenta.');

// El filtro se prueba con casos reales: si alguien lo afloja, esto lo delata.
const { revisar } = require(path.join(root, 'api/_filtro-garabatos.js'));
['weon', 'weeeón', 'w3on', 'h u e o n', 'ql', 'culiao', 'ctm', 'c.t.m', 'conchetumare', 'concha tu mare', 'maraco', 'puta', 'el pico', 'wea', 'aweonao', 'cagón', 'marica', 'imbécil', 'chupalo']
  .forEach(t => exigir(!revisar(t).ok, `El filtro dejó pasar: "${t}"`));
['computador', 'disputa', 'reputación', 'diputado', 'son las 3 y pico', 'Mongolia', 'putativo', 'conchas de mar', 'me gusta tu casa', 'cocina', 'ciencia', 'marisco']
  .forEach(t => exigir(revisar(t).ok, `El filtro bloqueó una palabra normal: "${t}"`));
['me quiero morir', 'me voy a matar', 'no quiero vivir', 'me pegan en la casa']
  .forEach(t => { const r = revisar(t); exigir(r.ok && r.alerta, `"${t}" debe pasar Y quedar como alerta, no bloquearse.`); });

exigir(espacio.includes('conectarSala') && espacio.includes("api('decir'"), 'El módulo debe conectar la sala y hablar por la API.');
exigir(espacio.includes('conectarTeclado') && espacio.includes('esp-pad'), 'Debe poder moverse con teclado y con el pad en pantalla, sin mouse.');
exigir(espacio.includes('abrirPaleta') && espacio.includes('PISOS'), 'Falta el cambio de terreno (piso y muros).');
['roble', 'gris', 'azul', 'verde', 'rosa', 'morado', 'negro'].forEach(p => exigir(enDisco.has(`floorFull__${p}_SE.png`), `Falta el piso ${p}.`));
const admin = leer('estudiantes/adminprofe/index.html');
exigir(admin.includes('sec-chatcasas') && admin.includes('alertas_chat'), 'El admin debe mostrar las alertas del chat.');

// El sistema viejo no debe seguir referenciado
const paginas = fs.readdirSync(path.join(root, 'estudiantes')).filter(f => f.endsWith('.html'));
paginas.forEach(f => {
  const html = leer('estudiantes/' + f);
  exigir(!html.includes('js/avatar-look.js'), `${f} todavía carga el sistema de avatar anterior.`);
  exigir(!/href="avatar\.html"/.test(html), `${f} enlaza a avatar.html, que ya no existe.`);
});

if (fallos.length) {
  console.error('Auditoría de Mi espacio incumplida:\n- ' + fallos.slice(0, 40).join('\n- '));
  if (fallos.length > 40) console.error(`  (y ${fallos.length - 40} más)`);
  process.exit(1);
}
console.log(`Mi espacio auditado: ${catalogo.length} muebles con sus 4 orientaciones en disco (${conSuperficie} superficies, ${apilables} apilables, ${planos} alfombras), personaje con ${ALS.ORDEN.length} categorías y ${opciones} opciones, caminar con ruta, colgado en muro y guardado con relectura.`);
