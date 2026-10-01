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
const catalogoServidor = require(path.join(root, 'estudiantes/js/catalogo-casa.js'));

exigir(Array.isArray(catalogo) && catalogo.length >= 120,
  `El catálogo debería traer al menos 120 objetos y trae ${catalogo ? catalogo.length : 0}.`);
exigir(Array.isArray(catalogoServidor) && catalogoServidor.length === catalogo.length,
  'El servidor y el navegador deben compartir exactamente el mismo catálogo de muebles.');

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
exigir(catalogo.some(m => m.id === 'rgbPartySpeaker' && m.xp > 0),
  'El parlante RGB debe existir y mantenerse como premio del profesor.');

// Piso y muros que usa la escena
['floorFull_SE'].forEach(n => exigir(enDisco.has(n + '.png'), `Falta la baldosa base ${n}.png`));

// ---- módulo de la casa ----
const espacio = leer('estudiantes/js/mi-espacio.js');
exigir(leer('estudiantes/css/mi-espacio.css').includes('.esp-terreno[hidden], .esp-acciones[hidden]{ display:none }'),
  'Las herramientas del dueño deben permanecer ocultas durante las visitas.');
const mapasCasa = require(path.join(root, 'estudiantes/js/mapas-casa.js'));
exigir(mapasCasa.obtener('salon-l') && mapasCasa.haySuelo('salon-l', 6, 6) && !mapasCasa.haySuelo('salon-l', 6, 1),
  'El salón en L debe tener dos alas transitables y rechazar el hueco.');
for (const [id, file] of [['9x9','salon-9x9.json'],['11x11','salon-11x11.json'],['9x7','salon-9x7.json'],['salon-l-grande','salon-l-9x9.json']]) {
  const bruto = JSON.parse(leer('estudiantes/assets/mapas/' + file));
  const mapa = mapasCasa.obtener(id);
  exigir(mapa && mapa.cols === bruto.width && mapa.filas === bruto.height, 'Tamaño publicado distinto del mapa Tiled: ' + id);
  exigir(bruto.orientation === 'isometric' && bruto.infinite === false && bruto.tilewidth === 151 && bruto.tileheight === 106, 'Formato Tiled no admitido: ' + id);
  const data = bruto.layers.find(layer => layer.name === 'suelo').data;
  exigir(data.length === mapa.cols * mapa.filas && JSON.stringify(data) === JSON.stringify(mapa.suelo), 'Suelo publicado distinto del mapa Tiled: ' + id);
  const cola = [mapa.entrada], visitadas = new Set();
  while (cola.length) {
    const celda = cola.shift(), key = celda.col + ',' + celda.fila;
    if (visitadas.has(key) || !mapasCasa.haySuelo(id,celda.col,celda.fila)) continue;
    visitadas.add(key); [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dc,df]) => cola.push({col:celda.col+dc,fila:celda.fila+df}));
  }
  exigir(visitadas.size === data.filter(Boolean).length,'Mapa con casillas aisladas: ' + id);
  exigir(!mapasCasa.haySuelo(id,mapa.cols,0) && !mapasCasa.haySuelo(id,0,mapa.filas), 'El mapa debe rechazar posiciones fuera: ' + id);
}
exigir(!mapasCasa.haySuelo('salon-l-grande',8,1) && mapasCasa.haySuelo('salon-l-grande',8,8), 'La L grande debe mantener el hueco y ambas alas.');
['gymBench','gymDumbbells','gymTreadmill','gymBike','christmasTree','halloweenPumpkin','halloweenCauldron','halloweenGhost','halloweenScarecrow','halloweenCandy','halloweenLantern'].forEach(id =>
  exigir(catalogo.some(m => m.id === id && m.xp > 0),'Falta el premio nuevo: ' + id));
for (const id of ['gymBench','gymDumbbells','gymTreadmill','gymBike','christmasTree','halloweenPumpkin','halloweenCauldron','halloweenGhost','halloweenScarecrow','halloweenCandy','halloweenLantern']) {
  const hashes = new Set();
  for (const dir of DIRS) {
    const png = fs.readFileSync(path.join(dirAssets,id + '_' + dir + '.png'));
    exigir(png.readUInt32BE(16) > 8 && png.readUInt32BE(16) <= 154 && png.readUInt32BE(20) > 8 && png.readUInt32BE(20) <= 214,
      'Sprite nuevo fuera de escala: ' + id + '/' + dir);
    exigir(png[25] === 6, 'El sprite debe conservar RGBA: ' + id + '/' + dir);
    hashes.add(require('node:crypto').createHash('sha256').update(png).digest('hex'));
  }
  exigir(hashes.size === 4,'Las cuatro vistas no deben ser copias idénticas: ' + id);
}
exigir(leer('estudiantes/dashboard.html').includes('js/mapas-casa.js') && espacio.includes("id: 'salon-l'") &&
  espacio.includes('function haySuelo(') && espacio.includes('!sueloEn(o, m.col, m.fila)'),
  'El panel debe cargar el mapa irregular y evitar muebles fuera al cambiar de habitación.');
exigir(/RUTA = '\/estudiantes\/assets\/pieza\//.test(espacio),
  'La ruta de los sprites debe ser absoluta: si es relativa, falla al montarse desde otra carpeta.');
exigir(espacio.includes('ref.set(valor)') && espacio.includes('ref.once('),
  'El guardado debe releer después de escribir: escribir no es haber guardado.');
const avatarRules = JSON.parse(leer('firebase-rules.json')).rules.plataforma_estudiantes.avatar.$uid;
exigir(avatarRules['.write'].includes("admins')") &&
  avatarRules.$campo['.write'].includes("$campo !== 'pieza'") &&
  avatarRules.$campo['.write'].includes("$campo !== 'regalos'") &&
  espacio.includes("api('guardar-pieza', { pieza: copia })"),
  'La pieza y los regalos deben quedar bajo control del servidor, no de escrituras Firebase del estudiante.');
exigir(espacio.includes('function ruta(') && espacio.includes('bloqueada('),
  'Falta el caminar con búsqueda de ruta que rodea los muebles.');
exigir(espacio.includes('esDePared') && espacio.includes('puntoMuro'),
  'Faltan los muebles que se cuelgan del muro.');
exigir(espacio.includes("'Mi casa'") || espacio.includes('>Mi casa<'),
  'La sección debe llamarse Mi casa.');
exigir(espacio.includes('alCambiarLook'),
  'El personaje del encabezado debe actualizarse al cambiarlo.');
exigir(espacio.includes("{ id: '7x7'") && espacio.includes('aplicarTamano()') && espacio.includes('espCentrar'),
  'La habitación ampliada debe ofrecer tamaño variable y controles de cámara.');
exigir(espacio.includes('rgbPartySpeaker') && espacio.includes('m.encendido = !m.encendido'),
  'El parlante RGB debe permitir encender y apagar sus luces.');
exigir(espacio.includes('data-gesto="saludar"') && espacio.includes('data-gesto="aplaudir"') && espacio.includes('data-gesto="bailar"'),
  'Deben existir los tres gestos de personaje.');

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
exigir(salasApi.includes('posicionEnCasa(db, sala, req.body.col, req.body.fila)') &&
  salasApi.includes("tamano === '7x7'") && salasApi.includes('MAPAS_CASA.haySuelo'),
  'La presencia debe aceptar 7 × 7 y rechazar los huecos del salón en L.');
exigir(salasApi.includes('bloqueados_chat') && salasApi.includes('alertas_chat'), 'Los bloqueos y las alertas deben quedar registrados para el profesor.');
exigir(salasApi.includes('CONFIG_PATH') && salasApi.includes("accion === 'configurar'") && salasApi.includes('if (!state.enabled)'),
  'El servidor debe bloquear casas y decoración por configuración global y permitir que el admin cambie el estado.');
exigir(salasApi.includes('RECOMPENSAS_PATH') && salasApi.includes("accion === 'recompensas-guardar'") && salasApi.includes("accion === 'inventario'"),
  'El servidor debe administrar premios de muebles y calcular el inventario desde las tareas completadas.');
exigir(/submitted === true && valor\.completada === true/.test(salasApi),
  'Una sesión solo puede desbloquear muebles con las dos marcas canónicas de entrega.');

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
exigir(admin.includes('casasConfigStatus') && admin.includes('cambiarEstadoCasas(false)') && admin.includes('cambiarEstadoCasas(true)'),
  'El admin debe permitir habilitar y deshabilitar casas y decoración.');
exigir(admin.includes('mueblesTareasPanel') && admin.includes('guardarRecompensaMuebles') && admin.includes('recompensas-guardar'),
  'El admin debe permitir asociar uno o varios muebles a una tarea.');
exigir(admin.includes('regaloManualPanel') && admin.includes('entregarRegaloManual') && admin.includes('regalos-admin-entregar'),
  'El admin debe permitir revisar el inventario y regalar un mueble a un estudiante.');
exigir(admin.includes("item.tiene?'✓ Ya lo tiene':'Regalar'"),
  'El catálogo docente debe marcar los muebles que el estudiante ya posee.');
exigir(espacio.includes("api('estado')") && espacio.includes('aplicarDisponibilidad') && espacio.includes('S.housesEnabled = false'),
  'Mi espacio debe partir bloqueado y habilitar casas solo después de leer la configuración del servidor.');
exigir(/setInterval\(sincronizarDisponibilidad, 15000\)/.test(espacio),
  'El interruptor del profesor debe reflejarse en páginas ya abiertas sin exigir un nuevo inicio de sesión.');
exigir(/setInterval\(sincronizarInventario, 60000\)/.test(espacio) && espacio.includes("api('inventario')"),
  'El inventario debe releer los premios verificados por el servidor.');
exigir(!espacio.includes('<button data-p="muebles">') && espacio.includes('espMueblesBloque') && espacio.includes('esp-muebles-integrados'),
  'La casa y el catálogo de muebles deben estar en una sola vista, no en pestañas separadas.');
exigir(!/cual === 'pieza'[^\n]*cual = 'personaje'/.test(espacio) && espacio.includes('Puedes mirar tus premios'),
  'Con el uso bloqueado se debe poder abrir la vista unificada y mirar los muebles con candado.');
exigir(espacio.includes("if (!S.housesEnabled) { avisar('El uso de la casa está deshabilitado por ahora'); return; }") &&
  espacio.includes('chatInput.disabled = !S.housesEnabled'),
  'Mirar la casa bloqueada no puede permitir caminar, decorar ni chatear.');

// ---- nombre visible: "Nombre Apellido", nunca el nombre completo ni el RUT ----
// Caso (10-sep-2026): la sala guardaba el nombre completo en `presentes` y `chat`,
// que leen todos los estudiantes, y la lista de visitas descargaba el nodo
// `estudiantes` entero en el navegador: 879 de 882 perfiles traen RUT, y la
// clave inicial sale del RUT.
const { nombreVisible, visiblesDeCurso } = require(path.join(root, 'api/_nombre-visible.js'));
const casosNombre = [
  ['ALVAREZ MEJIAS BENJAMIN DYLAN', 'Benjamin Alvarez'],
  ['ÁLVAREZ MEJÍAS BENJAMÍN DYLAN', 'Benjamín Álvarez'],
  ['MUÑOZ GARRIDO FELIPE MANUEL', 'Felipe Muñoz'],
  ['DE LA FUENTE SOTO JUAN PABLO', 'Juan de la Fuente'],
  ['SOTO DE LA FUENTE JUAN', 'Juan Soto'],
  ['DEL RIO PEREZ ANA MARIA', 'Ana del Rio'],
  ['SAN MARTIN ROJAS PEDRO', 'Pedro San Martin'],
  ['PEREZ SOTO JUAN', 'Juan Perez'],
  ['PEREZ JUAN', 'Juan Perez'],
  ['GONZALEZ-COTAPOS LIRA TOMAS', 'Tomas Gonzalez-Cotapos'],
  ['PEREZ ROJAS MARIA DE LOS ANGELES', 'Maria Perez'],
  ['profe Francisco', 'Profe Francisco'],
  ['Juan Pablo Pérez Soto', 'Juan Pérez'],
  ['', 'Estudiante']
];
const ctxN = { window: {}, devicePixelRatio: 1, document: ctxP.document, Image: function () {}, setTimeout, setInterval, clearInterval, clearTimeout };
vm.createContext(ctxN);
vm.runInContext(personaje, ctxN);
vm.runInContext(leer('estudiantes/js/catalogo-casa.js'), ctxN);
vm.runInContext(espacio, ctxN);
const cliente = ctxN.window.MiEspacio;
exigir(cliente && typeof cliente.nombreVisible === 'function', 'mi-espacio.js debe exponer MiEspacio.nombreVisible para poder auditarlo.');
casosNombre.forEach(([entrada, esperado]) => {
  const s = nombreVisible(entrada);
  exigir(s === esperado, `Servidor: "${entrada}" da "${s}" y debía dar "${esperado}".`);
  if (cliente && cliente.nombreVisible) {
    const c = cliente.nombreVisible(entrada);
    exigir(c === s, `El navegador y el servidor no coinciden para "${entrada}": "${c}" / "${s}".`);
  }
});
const vc = visiblesDeCurso({ a: { nombre: 'MUÑOZ ROJAS BENJAMIN' }, b: { nombre: 'MUÑOZ SOTO BENJAMIN' }, c: { nombre: 'PEREZ LARA ANA' } });
exigir(vc.a === 'Benjamin Muñoz R.' && vc.b === 'Benjamin Muñoz S.' && vc.c === 'Ana Perez',
  `El desempate por curso no funciona: ${JSON.stringify(vc)}`);
if (cliente && cliente.nombreCorto) {
  exigir(cliente.nombreCorto('Benjamin Muñoz R.') === 'Benjamin Muñoz R.',
    'Un nombre que ya viene del servidor no se vuelve a procesar: se perdería la inicial del desempate.');
}

exigir(!/\/estudiantes['"]\s*\)|\/estudiantes\/['"]\s*\+/.test(espacio),
  'mi-espacio.js no puede leer perfiles del nodo estudiantes: traen el RUT. La lista la arma el servidor (salas-lista).');
exigir(/async function lista\(/.test(salasApi) && salasApi.includes("accion === 'lista'"),
  'Falta la acción salas-lista en el servidor.');
exigir(!/nombre:\s*yo\.nombre\.slice/.test(salasApi),
  'La sala y el chat no pueden guardar el nombre completo: usan el nombre visible (nombreDe).');
exigir((salasApi.match(/nombre: yo\.nombre,/g) || []).length === 2,
  'El nombre completo solo va a los dos registros del profesor (bloqueados_chat y alertas_chat).');

// Caso (10-sep-2026): los visitantes solo mandaban su posición al llegar y cada
// 20 s, y se dibujaban de golpe en la casilla nueva. Como en Habbo, el destino
// sale al empezar a caminar (a lo más uno por segundo) y cada cliente dibuja a
// los demás recorriendo la ruta.
const moverJs = leer('estudiantes/js/mi-espacio.js');
const cuerpoDe = (nombre) => { const i = moverJs.indexOf('function ' + nombre + '('); return i < 0 ? '' : moverJs.slice(i, moverJs.indexOf('\n  }\n', i)); };
exigir(/avisarPosicion\(\)/.test(cuerpoDe('caminar')) && /S\.destino\s*=/.test(cuerpoDe('caminar')),
  'caminar() debe fijar S.destino y avisarlo al partir: si no, los demás te ven aparecer cuando ya llegaste.');
exigir(/S\.destino \|\|/.test(cuerpoDe('latido')), 'latido() debe mandar el destino, no la casilla intermedia del camino.');
const avisoMs = Number((moverJs.match(/AVISO_MS = (\d+)/) || [])[1]);
exigir(avisoMs >= 1000, 'avisarPosicion necesita un tope de al menos 1000 ms entre avisos (con flechas se camina casilla a casilla).');
exigir(/ruta\(desde, meta\)/.test(cuerpoDe('seguirOtros')) && /animarOtros\(\)/.test(cuerpoDe('seguirOtros')),
  'seguirOtros() debe calcular la ruta de cada visitante y animarla.');
exigir(/v = S\.vistos\[uid\]/.test(cuerpoDe('personas')) && /var c = v \? v\.col/.test(cuerpoDe('personas')),
  'personas() debe dibujar a los demás en su posición animada (S.vistos), no en la casilla final.');
exigir(/S\.otros = snap\.val\(\) \|\| \{\};\s*seguirOtros\(\);/.test(moverJs), 'La escucha de presentes debe llamar a seguirOtros().');
exigir(!/latido\(\);\s*\/\/ los demás me ven llegar/.test(moverJs), 'El aviso al llegar quedó reemplazado por el aviso al partir.');

// Caso (10-sep-2026): toLocaleString con dateStyle y hour/minute a la vez lanza
// "Invalid option" en todos los navegadores. En el panel cortaba el aviso
// emergente y la campanita de los mensajes del profesor desde el 9-sep.
const panelHtml = leer('estudiantes/dashboard.html');
exigir(!/\bdateStyle\s*:[^{}]*\b(hour|minute)\s*:|\b(hour|minute)\s*:[^{}]*\bdateStyle\s*:/.test(panelHtml),
  'dashboard.html mezcla dateStyle con hour/minute en toLocaleString: el navegador lanza un error y los mensajes del profesor no avisan.');

// El sistema viejo no debe seguir referenciado
const paginas = fs.readdirSync(path.join(root, 'estudiantes')).filter(f => f.endsWith('.html'));
paginas.forEach(f => {
  const html = leer('estudiantes/' + f);
  exigir(!html.includes('js/avatar-look.js'), `${f} todavía carga el sistema de avatar anterior.`);
  exigir(!/href="avatar\.html"/.test(html), `${f} enlaza a avatar.html, que ya no existe.`);
});

// ---- Placas (10-sep-2026) ----
// Son los logros de logros.html: mismo id, emoji, nombre y rareza. Si alguien
// agrega un logro allá y no acá, la placa no aparece.
const logrosHtml = leer('estudiantes/logros.html');
const bloqueLogros = logrosHtml.slice(logrosHtml.indexOf('const LOGROS = ['), logrosHtml.indexOf('];', logrosHtml.indexOf('const LOGROS = [')));
const logrosPagina = {};
bloqueLogros.replace(/\{id:'([a-z0-9_]+)',\s*cat:'[^']*',\s*emoji:'([^']+)',\s*name:'([^']+)',[^}]*rarity:'([a-z_]+)'/g,
  (m, id, emoji, nombre, rareza) => { logrosPagina[id] = [emoji, nombre, rareza]; });
const PLACAS = (cliente && cliente.PLACAS) || {};
exigir(logrosHtml.includes('Object.entries(AvatarLookSystem.LOGROS_DOCENTES).forEach') && logrosHtml.includes('AvatarLookSystem.logrosConPremios(avatar.logros,avatar.regalos)'),
  'La página de Logros debe mostrar los premios docentes desde el nodo protegido.');
Object.assign(logrosPagina, ALS.LOGROS_DOCENTES);
exigir(Object.keys(logrosPagina).length >= 30, `No pude leer los logros de logros.html (leí ${Object.keys(logrosPagina).length}).`);
exigir(JSON.stringify(Object.keys(PLACAS).sort()) === JSON.stringify(Object.keys(logrosPagina).sort()),
  'Las placas de mi-espacio.js no son los mismos logros de logros.html.');
Object.keys(logrosPagina).forEach((id) => {
  exigir(JSON.stringify(PLACAS[id]) === JSON.stringify(logrosPagina[id]), `La placa ${id} no calza con logros.html.`);
});
if (cliente && cliente.placasValidas) {
  const pv = cliente.placasValidas(['xp_250', 'xp_250', 'inventada', 'podium', 'top5', 'number_one', 'paes_900'],
    { xp_250: {}, podium: {}, top5: {}, number_one: {} });
  exigir(JSON.stringify(Array.from(pv)) === JSON.stringify(['xp_250', 'podium', 'top5']),
    `placasValidas debe dejar solo placas conocidas, ganadas, sin repetir y hasta 3: dio ${JSON.stringify(pv)}.`);
  exigir(cliente.placasValidas(['top5'], {}).length === 0, 'Una placa sin su logro no se muestra.');
  exigir(cliente.placasValidas({ 0: 'top5' }, { top5: {} }).length === 0, 'placasValidas solo acepta listas.');
}
exigir(cuerpoDe('cargarPlacas').includes("ref.child('regalos').once('value')") && /placasValidas\(r\[0\]\.val\(\), global\.AvatarLookSystem\.logrosConPremios\(r\[1\]\.val\(\),r\[2\]\.val\(\)\)\)/.test(cuerpoDe('cargarPlacas')),
  'Las placas de un visitante se validan contra sus logros antes de dibujarlas.');
exigir(/placas: S\.placasDe\[uid\]/.test(cuerpoDe('personas')) && /placas: S\.placas/.test(cuerpoDe('personas')),
  'personas() debe llevar las placas propias y las de cada visitante.');
exigir(/pendientes\[campo\]/.test(cuerpoDe('guardar')),
  'guardar() espera por campo: con una sola espera, guardar el look cancela las placas.');

// ---- Regalos (10-sep-2026) ----
// El navegador solo elige; el servidor escribe en el avatar del que recibe.
exigir(/function tengo\(m\)/.test(moverJs) && moverJs.includes('S.requisitos[m.id]') && moverJs.includes('S.recompensas[m.id]'),
  'tengo(m) debe dejar los muebles iniciales y exigir una tarea completada para cada premio configurado.');
exigir(moverJs.includes('(S.regalos && S.regalos[m.id])'),
  'Un regalo manual del profesor también debe habilitar un mueble asociado a una tarea.');
exigir(/api\('regalar', \{ para: para, mueble: m\.id \}\)/.test(cuerpoDe('abrirRegalo')), 'El regalo se pide al servidor (salas-regalar).');
exigir(!/avatar\/' \+ (para|S\.sala)\)[^;]*\.(set|update|push)\(/.test(moverJs), 'El navegador no escribe en el avatar ajeno.');
exigir(/on\('child_added'/.test(cuerpoDe('escucharRegalos')) && /escucharRegalos\(\)/.test(cuerpoDe('sincronizarDisponibilidad')) && /sincronizarDisponibilidad\(\)/.test(cuerpoDe('montar')),
  'Los regalos que llegan se escuchan al habilitar Mi espacio desde la página montada.');
exigir(/logros: av\.logros, placas: av\.placas, regalos: av\.regalos/.test(panelHtml), 'dashboard.html debe pasar logros, placas y regalos a Mi espacio.');

async function probarRegalos() {
  function baseDeJuguete(inicial) {
    const datos = JSON.parse(JSON.stringify(inicial));
    const partes = (p) => p.split('/').filter(Boolean);
    const copia = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
    const leerRuta = (p) => partes(p).reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), datos);
    const escribir = (p, v) => {
      const ks = partes(p); let o = datos;
      ks.slice(0, -1).forEach((k) => { if (!o[k] || typeof o[k] !== 'object') o[k] = {}; o = o[k]; });
      if (v === null) delete o[ks[ks.length - 1]]; else o[ks[ks.length - 1]] = copia(v);
    };
    const foto = (v) => ({ val: () => (v === undefined ? null : copia(v)), exists: () => v !== undefined && v !== null });
    const ref = (p) => ({
      once: async () => foto(leerRuta(p)),
      set: async (v) => escribir(p, v),
      remove: async () => escribir(p, null),
      update: async (v) => Object.keys(v).forEach((k) => escribir(p + '/' + k, v[k])),
      transaction: async (fn) => {
        const nuevo = fn(leerRuta(p) === undefined ? null : copia(leerRuta(p)));
        if (nuevo === undefined) return { committed: false };
        escribir(p, nuevo); return { committed: true };
      },
      orderByChild: (campo) => ({ equalTo: (valor) => ({ once: async () => {
        const t = leerRuta(p) || {}, r = {};
        Object.keys(t).forEach((k) => { if (t[k] && t[k][campo] === valor) r[k] = t[k]; });
        return foto(r);
      } }) })
    });
    return { ref, leerRuta };
  }
  const SALAS = require(path.join(root, 'api/_salas.js'));
  const db = baseDeJuguete({ plataforma_estudiantes: {
    configuracion: {
      mi_espacio: { enabled: true },
      recompensas_muebles: {
        premio_s11: { activa: true, tipo: 'sesion', fuente: 'sesion-u3-11', fuentes: { 'sesion-u3-11': true },
          titulo: 'Tarea 11', nombreSet: 'Set de escritura', muebles: { computerScreen: true, computerKeyboard: true } }
      }
    },
    sesiones: { 'sesion-u3-11': { titulo: 'Tarea 11' }, 'sesion-u3-10': { titulo: 'Tarea 10' } },
    respuestas: {
      'sesion-u3-11': {
        uidAnaaaa: { submitted: true, completada: true },
        uidLuisss: { submitted: false, completada: true }
      }
    },
    estudiantes: {
      uidAnaaaa: { nombre: 'PEREZ SOTO ANA', curso: '2A-HC' },
      uidLuisss: { nombre: 'LARA ROJAS LUIS', curso: '2A-HC' },
      uidDianaa: { nombre: 'MORA VEGA DIANA', curso: '2A-HC' },
      uidFantaa: { nombre: 'PERFIL DUPLICADO', curso: '2A-HC', ocultarDeCasas: true },
      uidEvaaaa: { nombre: 'MORA DIAZ EVA', curso: '3B-HC' }
    },
    admins: { uidProfee: true, uidProfe2: true },
    docentes: { uidProfee: { superadmin: true }, uidProfe2: { superadmin: false, cursos: ['2A-HC'] } },
    avatar: {
      uidAnaaaa: { pieza: [{ id:'lampSquareFloor', col:1, fila:1, dir:'SE' }], regalos: {
        rugRound: { de: 'Alguien', ts: 1 },
        lampSquareFloor: { de: 'Alguien', ts: 1 },
        bookcaseOpen: { de: 'Alguien', ts: 1 }
      } },
      uidDianaa: { regalos: { chair: { de: 'Alguien', ts: 1 } } }
    }
  } });
  const auth = { verifyIdToken: async (t) => ({ uid: t }) };
  const pedir = async (quien, cuerpo, accion = 'regalar') => {
    const r = { status: 200, json: null };
    const res = { status(s) { r.status = s; return this; }, json(j) { r.json = j; return this; } };
    await SALAS.manejar({ method: 'POST', headers: { authorization: 'Bearer ' + quien }, body: cuerpo }, res, accion, db, auth);
    return r;
  };
  const regalo = (uid, id) => db.leerRuta(`plataforma_estudiantes/avatar/${uid}/regalos/${id}`);

  let r = await pedir('uidAnaaaa', {}, 'inventario');
  exigir(r.json && r.json.desbloqueados.computerScreen && r.json.requisitos.computerKeyboard,
    'Una entrega canónica debe desbloquear todos los muebles de su set.');
  r = await pedir('uidAnaaaa', {}, 'lista');
  exigir(r.json && r.json.casas && !r.json.casas.some(casa => casa.uid === 'uidFantaa'),
    'Un perfil duplicado oculto no debe aparecer en las casas del curso.');
  r = await pedir('uidAnaaaa', { sala:'uidFantaa' }, 'entrar');
  exigir(r.status === 404, 'Tampoco se debe entrar a una casa oculta conociendo su UID.');
  r = await pedir('uidLuisss', {}, 'inventario');
  exigir(r.json && !r.json.desbloqueados.computerScreen && r.json.requisitos.computerScreen,
    'Una sola marca de entrega no debe desbloquear el mueble.');
  r = await pedir('uidProfee', { tipo: 'sesion', fuente: 'sesion-u3-10', nombreSet: 'Premio de prueba', muebles: ['bear'] }, 'recompensas-guardar');
  exigir(r.json && r.json.ok === true && r.json.regla && r.json.regla.muebles[0] === 'bear',
    'El profesor debe poder asignar un mueble a una tarea desde el servidor.');
  r = await pedir('uidProfee', { estudiante: 'uidLuisss' }, 'regalos-admin-inventario');
  const ps5Antes = r.json && r.json.catalogo && r.json.catalogo.find(m => m.id === 'playStation5');
  exigir(r.json && r.json.ok === true && ps5Antes && ps5Antes.tiene === false,
    'El profesor debe ver la PlayStation 5 disponible antes de entregarla.');
  r = await pedir('uidProfee', { estudiante: 'uidLuisss', mueble: 'playStation5' }, 'regalos-admin-entregar');
  exigir(r.json && r.json.ok === true && regalo('uidLuisss', 'playStation5') && regalo('uidLuisss', 'playStation5').tipo === 'docente',
    'El regalo manual debe quedar en el inventario como premio del profesor.');
  r = await pedir('uidProfee', { estudiante: 'uidLuisss' }, 'regalos-admin-inventario');
  const ps5Despues = r.json && r.json.catalogo && r.json.catalogo.find(m => m.id === 'playStation5');
  exigir(ps5Despues && ps5Despues.tiene === true && /profesor/i.test(ps5Despues.origen),
    'Después de regalar, el mueble debe aparecer marcado como ya obtenido.');
  r = await pedir('uidLuisss', { pieza:[
    { id:'playStation5', col:1, fila:1, dir:'SE' },
    { id:'playStation5', col:2, fila:1, dir:'SW' }
  ] }, 'guardar-pieza');
  exigir(r.status === 409 && !db.leerRuta('plataforma_estudiantes/avatar/uidLuisss/pieza'),
    'Una PlayStation 5 recibida no se puede duplicar en la habitación.');
  r = await pedir('uidLuisss', { pieza:[{ id:'playStation5', col:1, fila:1, dir:'SE' }] }, 'guardar-pieza');
  exigir(r.json && r.json.ok === true && (db.leerRuta('plataforma_estudiantes/avatar/uidLuisss/pieza') || []).length === 1,
    'Una sola PlayStation 5 sí se puede colocar y confirmar desde el servidor.');
  r = await pedir('uidProfe2', { estudiante: 'uidEvaaaa', mueble: 'playStation5' }, 'regalos-admin-entregar');
  exigir(r.status === 403 && !regalo('uidEvaaaa', 'playStation5'),
    'Un docente no puede regalar muebles fuera de sus cursos asignados.');
  r = await pedir('uidLuisss', { para: 'uidAnaaaa', mueble: 'playStation5' });
  exigir(r.json && r.json.ok === false && /profesor/i.test(r.json.error) && !regalo('uidAnaaaa', 'playStation5'),
    'Un premio manual del profesor no se puede transferir a otro estudiante.');
  for (const id of ['gymBench','gymDumbbells','gymTreadmill','gymBike','christmasTree','halloweenPumpkin','halloweenCauldron','halloweenGhost','halloweenScarecrow','halloweenCandy','halloweenLantern']) {
    exigir(!regalo('uidLuisss',id),'Los premios nuevos no se entregan automáticamente: ' + id);
    r = await pedir('uidProfee',{estudiante:'uidLuisss',mueble:id},'regalos-admin-entregar');
    exigir(r.json && r.json.ok && regalo('uidLuisss',id)?.tipo === 'docente','Premio nuevo entregado y releído: ' + id);
    r = await pedir('uidLuisss',{para:'uidAnaaaa',mueble:id});
    exigir(r.json && r.json.ok === false && !regalo('uidAnaaaa',id),'No transferir un premio docente nuevo: ' + id);
  }

  r = await pedir('uidAnaaaa', { para: 'uidLuisss', mueble: 'lampSquareFloor' });
  exigir(r.json && r.json.ok === true && regalo('uidLuisss', 'lampSquareFloor') && regalo('uidLuisss', 'lampSquareFloor').de === 'Ana Perez',
    `Un regalo válido debe quedar en el avatar del que recibe, con el nombre visible del que regala: ${JSON.stringify(r)}.`);
  exigir(!regalo('uidAnaaaa', 'lampSquareFloor') &&
    !(db.leerRuta('plataforma_estudiantes/avatar/uidAnaaaa/pieza') || []).some(pieza => pieza.id === 'lampSquareFloor'),
    'Transferir un mueble debe quitarlo del inventario y de la casa del donante.');
  r = await pedir('uidAnaaaa', { para: 'uidLuisss', mueble: 'bookcaseOpen' });
  exigir(r.json && r.json.sinCupo === true && !regalo('uidLuisss', 'bookcaseOpen'), 'El segundo regalo del día se rechaza y no se escribe.');
  r = await pedir('uidLuisss', { para: 'uidEvaaaa', mueble: 'bookcaseOpen' });
  exigir(r.status === 404 && !regalo('uidEvaaaa', 'bookcaseOpen'), 'No se regala a otro curso.');
  r = await pedir('uidLuisss', { para: 'uidLuisss', mueble: 'bookcaseOpen' });
  exigir(r.status === 400, 'Nadie se regala a sí mismo.');
  r = await pedir('uidLuisss', { para: 'uidAnaaaa', mueble: '../admins' });
  exigir(r.status === 400, 'Un id de mueble raro se rechaza antes de tocar la base.');
  r = await pedir('uidDianaa', { para: 'uidAnaaaa', mueble: 'rugRound' });
  exigir(r.json && r.json.ok === false && regalo('uidAnaaaa', 'rugRound').de === 'Alguien', 'Un regalo repetido se rechaza y no pisa el anterior.');
  r = await pedir('uidDianaa', { para: 'uidAnaaaa', mueble: 'chair' });
  exigir(r.json && r.json.ok === true, 'El regalo repetido no gasta el cupo del día.');
  r = await pedir('uidProfee', { para: 'uidAnaaaa', mueble: 'bookcaseOpen' });
  exigir(r.status === 403, 'Los regalos son entre estudiantes.');
  r = await pedir('uidAnaaaa', { para: 'uidLuisss', mueble: 'computerScreen' });
  exigir(r.json && r.json.ok === false && !regalo('uidLuisss', 'computerScreen'),
    'Un mueble asociado a una tarea no se puede transferir a quien no la completó.');
  await db.ref('plataforma_estudiantes/avatar/uidAnaaaa/casa').set({ tamano: 'salon-l' });
  r = await pedir('uidLuisss', { sala: 'uidAnaaaa', col: 6, fila: 1 }, 'entrar');
  exigir(r.json && r.json.ok === true &&
    db.leerRuta('plataforma_estudiantes/salas/uidAnaaaa/presentes/uidLuisss/col') === 1 &&
    db.leerRuta('plataforma_estudiantes/salas/uidAnaaaa/presentes/uidLuisss/fila') === 1,
    'El servidor debe recolocar una visita que intente entrar en el hueco de la L.');
  r = await pedir('uidLuisss', { sala: 'uidAnaaaa', col: 6, fila: 6 }, 'latido');
  exigir(r.json && r.json.ok === true &&
    db.leerRuta('plataforma_estudiantes/salas/uidAnaaaa/presentes/uidLuisss/col') === 6,
    'El servidor debe permitir la segunda ala del salón en L.');
  r = await pedir('uidLuisss', { sala: 'uidAnaaaa', col: 6, fila: 1 }, 'latido');
  exigir(r.json && r.json.ok === true &&
    db.leerRuta('plataforma_estudiantes/salas/uidAnaaaa/presentes/uidLuisss/col') === 1,
    'El latido no puede persistir una posición sobre el hueco.');
  for (const [id,col,fila] of [['9x9',8,8],['11x11',10,10],['9x7',8,6],['salon-l-grande',8,8]]) {
    await db.ref('plataforma_estudiantes/avatar/uidAnaaaa/casa').set({tamano:id});
    r = await pedir('uidLuisss',{sala:'uidAnaaaa',col,fila},'latido');
    exigir(r.json && r.json.ok && db.leerRuta('plataforma_estudiantes/salas/uidAnaaaa/presentes/uidLuisss/col') === col,
      'La API debe admitir el extremo de la casa grande: ' + id);
    r = await pedir('uidAnaaaa',{pieza:[{id:'bedSingle',col,fila,dir:'SE'}]},'guardar-pieza');
    exigir(r.json && r.json.ok && db.leerRuta('plataforma_estudiantes/avatar/uidAnaaaa/pieza')[0].col === col,
      'Guardar y releer muebles en el borde de casa grande: ' + id);
    r = await pedir('uidAnaaaa',{pieza:[{id:'bedSingle',col:20,fila,dir:'SE'}]},'guardar-pieza');
    exigir(r.status === 409,'No colocar fuera de casa grande: ' + id);
  }
  r = await pedir('uidLuisss',{sala:'uidAnaaaa',col:8,fila:1},'latido');
  exigir(db.leerRuta('plataforma_estudiantes/salas/uidAnaaaa/presentes/uidLuisss/col') === 1,'La L grande recoloca las visitas que caen en el hueco.');
  await db.ref('plataforma_estudiantes/avatar/uidAnaaaa/casa').set({ tamano: '5x5' });
  r = await pedir('uidLuisss', { sala: 'uidAnaaaa', col: 6, fila: 6 }, 'latido');
  exigir(r.json && r.json.ok === true &&
    db.leerRuta('plataforma_estudiantes/salas/uidAnaaaa/presentes/uidLuisss/col') === 2 &&
    db.leerRuta('plataforma_estudiantes/salas/uidAnaaaa/presentes/uidLuisss/fila') === 3,
    'Una habitación 5 × 5 antigua debe impedir posiciones fuera de su superficie.');
  r = await pedir('uidProfee', { enabled: false }, 'configurar');
  exigir(r.json && r.json.ok === true && r.json.enabled === false, 'El profesor debe poder deshabilitar casas y decoración.');
  r = await pedir('uidAnaaaa', {}, 'estado');
  exigir(r.json && r.json.enabled === false, 'El estudiante debe recibir el estado deshabilitado.');
  r = await pedir('uidAnaaaa', { para: 'uidLuisss', mueble: 'lampSquareFloor' });
  exigir(r.json && r.json.disabled === true, 'Una acción de casa debe ser rechazada mientras el profesor la mantiene deshabilitada.');
  exigir(/REGALOS_POR_DIA = 1;/.test(salasApi) && /regalos_log\/\$\{yo\.uid\}\/\$\{hoyEnChile\(\)\}`\)\.transaction/.test(salasApi),
    'El cupo diario vive en regalos_log y se descuenta con una transacción.');
}

(async () => {
  await probarRegalos();
  if (fallos.length) {
    console.error('Auditoría de Mi espacio incumplida:\n- ' + fallos.slice(0, 40).join('\n- '));
    if (fallos.length > 40) console.error(`  (y ${fallos.length - 40} más)`);
    process.exit(1);
  }
  console.log(`Mi espacio auditado: ${catalogo.length} muebles con sus 4 orientaciones en disco (${conSuperficie} superficies, ${apilables} apilables, ${planos} alfombras), personaje con ${ALS.ORDEN.length} categorías y ${opciones} opciones, caminar con ruta, colgado en muro, guardado con relectura, ${Object.keys(PLACAS).length} placas y regalos con cupo diario.`);
})().catch((e) => { console.error('Auditoría de Mi espacio: ' + e.message); process.exit(1); });
