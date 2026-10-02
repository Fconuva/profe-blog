// api/_termas.js
// Inscripción del paseo docente a las Termas de Panimávida (estudiacest.com/termas).
//
// No es una función de Vercel por sí misma: el plan Hobby admite 12 y ya están
// ocupadas. Se enruta desde api/estudiantes.js con las acciones `termas-estado`,
// `termas-mia`, `termas-inscribir`, `termas-admin-lista` y `termas-admin-quitar`.
//
// Los datos viven en `eventos_docentes/termas_2026`, fuera de
// `plataforma_estudiantes`. La raíz de firebase-rules.json niega lectura y
// escritura, así que ningún navegador llega a ese nodo: todo pasa por aquí con
// credenciales de servidor. Hacia afuera solo sale el nombre corto de quien
// ocupa cada asiento y los totales; correo, teléfono y contacto de emergencia
// los ve únicamente el admin.
//
// Reglas de la inscripción:
//  - Nombres, apellidos, correo (cualquier dominio), teléfono y contacto de
//    emergencia son obligatorios para todos. El nombre completo debe pertenecer
//    a la nómina vigente de docentes titulares y suplentes. Una inscripción por
//    correo.
//  - Al inscribirse por primera vez, el servidor entrega una llave que queda en
//    ese navegador y guarda solo su hash. Sin la llave no se modifica una
//    inscripción ajena. Si alguien la pierde, Francisco quita la inscripción
//    desde el admin y la persona vuelve a inscribirse.
//  - El asiento se decide dentro de una transacción sobre todas las
//    inscripciones: si dos personas eligen el mismo a la vez, gana una y la otra
//    recibe 409 con el mapa actualizado. El mapa de asientos no se guarda
//    aparte; se deduce de las inscripciones, así nunca quedan asientos huérfanos.

'use strict';

const crypto = require('crypto');

const BASE = process.env.TERMAS_BASE || 'eventos_docentes/termas_2026';
const INSCRIPCIONES = `${BASE}/inscripciones`;
const CAPACIDAD = 45;
const TOPE_INSCRIPCIONES = 300;
// Sin # $ [ ] / en el correo: es la clave en Firebase.
const RE_CORREO = /^[a-z0-9][a-z0-9._%+-]{0,63}@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/;
const RE_NOMBRE = /^\p{L}[\p{L}'’.\- ]{0,79}$/u;
const RE_TELEFONO = /^\+?[0-9 ()-]{8,20}$/;
const COMIDAS = new Set(['desayuno', 'once', 'ninguna']);
// Nómina recibida el 02-oct-2026: 97 registros completos. Se guardan solo
// huellas SHA-256 del nombre normalizado para no publicar el padrón en Git ni
// enviarlo al navegador. La fila final incompleta se excluye.
const HUELLAS_NOMINA = new Set(`
03aad5d67438120305dc28a8e9566ee5874e97b2e1e7b5279de6ff70748c78f1
971f2def0b2f027e3413805c29637d2a9f6145cbb1744c8fe499f56ef93efae8
629bdbcf40ec8de7928743465f782b17e9afff278624920b96a41b0f89338e5f
ef721fb7cf3a4a13e36b28c895b2b0bbc5bae2f084c77acd338ef776ddf25d19
5fd419575acd3b8e23cda962bd8586d6a9d53b10a48e2eac80b45678ff679ed4
e534b3dcd84eb408e977a11ed04673e176f6475e437a1d9410a68455b9a1b3c6
cc71c29c7e88faac4dd747a7f7731bb0b5f005e2929047145160ef14c65737d8
ad699bb474435a614469b822fd5ca06b14bf998bea7aa1df190ea44ab9791def
032a3d7944f01b874ab54f532a9506d8a63fd3d983f5ae8740023f06f85224bf
21a3394647182a4bacd9e39a67db0577443a6377136f104abda6db3dbcf39e67
f4663d80498f462feefd7c2193c61c84da0c092fcb808cb39b5d43533b01b13d
1a6a852b0bad569d6b472e50a0d261c3455512c7c112c53a0ba394225ee74550
1a778b218245467cb8e95c7619c0f91befbed19804f91141956caadc778a2348
17065e62e455b9b7c7d98871dcbac05ddfc2325cf0ca841b6e580dcfd8c36126
c7daa8dd7b351e9741faad1b871855c957151d7dffa0e0ae05afe2cdbbb7e3aa
665f1dd20e56bb431e72632cad143fe11a140c93418605b51550651b445cb10c
92297aa043db99aac631d7daff8883baf90f7b7f7d39c829cf8835b80cfa7ade
963c905a69347d3dd58a5b90846eb2759c4c5ba8edcbc0af4a171fa2a685b12d
07b13d0d74fb26ed2dfbf0ad42419365a8ca0249ffc6a4dc8b3428c500c11fe2
2638bf4b5c40328eca342bae8f649595dd39c109fd043bc7ae8a3f5b9bf72dc4
e4d68544e80244b28afa989e0afab5d6acccb4a9980bbebe09f79cf703a7bf08
cec72837d0a21fde8a62bb58cc9f224e839c6ead3018058278ed1b116f43dcc5
54f8fbffa77d3274fc4f9420326b458ea93282d2faf2c8697cce98beac7372b2
5c603a10caeb53356908545ec3fe5deeac0e76a20413809915a6f2be48b24b2d
f6cb108f7eca0c9772553cca4f0f5fdae4955caf184b57bc301ede74b131c1f1
4826968bbd56b8b891e5fe23c8ff4bcc7ac611c6178f9d7426d6023e52c6809d
65a7c9e000973cf3b66b6636896208ec56680d4d15d885450dbfc03aa4945070
90283ab6d08dc69bff4edab9e240a04cd0aff2c5694b4b288144dd591a21c513
b28ef62d6c5bf519da74d81c71a6d65de1b94eb4487e5cc803d1296e4d95189f
ff6986c2a085231da48d8363cd15cf4b34643ec9c8b7ae16a65adcc54a363474
49f3c4e8a5b328da052fdc8e43fe9a57bdfe7252976ce2657d774de0953b07ae
1374164532d2d361f04d30b8e0592bc9c526cf996ae188035cc5482970829e1a
37f0fc1fbe48988deea6798f5a941925e49820fa3254b26ef4db32811b5b16b0
8191aa1d68d942a0ab5ae7b9e2c5b093f7fb167fe0df631958a3f0d456054744
6ff643ed2c2a8c5ec8f69accbb03d18735ed1740495eaa3a75f59fcbcb480238
98ba4d605124697bbafef5b3f52d9c7b9291d377f8cecd8d400fea328fa3d1bc
8a66a54f291bc933c39cb053963f2c0d183fbf74fbf0ed49d7df1f83343a7304
8ac31efb851c5faa52e4fd03da19526c68690b71c257bf6aad5f73dc423dc9eb
e841e83936f381671a0c7367b36060a56b3d847c789bee64d86a54543d9201ec
c8efb9f17c7616fb30b67dd701698c7b443d8a7d8523a664c9fc1175a6a52899
30284f459756d8b5f35582ed4452cada26ab684a93bff78e1d10d980b2be3b50
a4981e8e6f50cf1416cfed218f153dc90bb5549072363b1ac176447456afe8f3
5705a40ee991fde420da3131dc238c616abd8d0a38883a672ddcacfb3136020d
4e8506742412fe890102a46a11a40262e92bec9338e15939eee8125effb88adb
42c31b510d6224de77584903cb8ca7ca5c86303ee556117e22c309cf894c7fd0
b0508ece5c823f7b486a8ade83087b97be896f71b851800cd7545cdb33817d6c
42b3127a43ffb824c872e936dfcb54cdf7d685202464aef26ee9029de1fc5389
8c55caaab4c020088728618d9208a95d60961f1f3b24a1bd3ad144a310692020
5d92810a209a0ff1d7a5dbf07a44c5d21eade6d98a880ed055c734eb89ca996e
df68bb0d14546b9c8a47fd8e44b49b5e0ea4e376fb8f22f6b5ddbd6cd58c07c1
7e23eb39026905cdc13b4fd56430af340161c3d2a712f0723bc38ead69924f73
ce119a8ba7d8e9a3183a3f6d5f8cfea97ac8f00073b03d0fa331a9157fcd8a07
ce9c3e2c597cbf147df73e27d4aa0d8fc60a92d192bf0e56b56cac747aa95fc8
6b346cf1172ac16498e49ccd024b4e63c8e6c51a70b0db4bbc85b1f3e1f14157
0d11a2aab205384e2f20a08eedd452863744ebea1b715960a639f27a6da6e6cd
0e1cae8fd94378603fae5031094d5e614f024c98eb658f9d7412551c393bfc5b
1e8804daf89a24372a8b17df20aced0ec1ebffbe6fef7b1babc74bd45d722885
010f5e0a6d08ab9a907ff8ada87992d3685d7a28b8ef2c2404a3dd3e1c66529c
884795aa06f1d377843cb9272741f2b7466678d035ddc4f9141677ee6f01f636
dd0c406400742f9987e1a33867724b3a4a2b52c93dd06306c149d0368b5ab099
44fd302bcd8f632b9897e6fb9a6446f4e4438a97f4028df595eee9d77ce229d1
52f348ef25475625023ff340946f9f62ea93a5862ff921db697bd938d872ec06
c436fa0552669d3dfc576661d5b7f237abd2aeff3fd14bce69f25776bbaf30ff
a797a77fafe774d485e589ce144e6ecce4daeac56a93e0e48d14aed51b5ce038
052defc25e72cbe0e900245ba82a860c7399523673ede2b071dc99a4afcb9979
c0410ebc731eff1f65dd36b8079052314685a10bcde7665aff60716ca4ae083b
117c6f3ae82b083d3b50445925acf190e17e7d0840dd56d81cb8c47fb849331f
c6766700902ebc620b3e825f5477ea86f91394cb4f266742f20ec261bf23db93
2d5d9e8422cfdf2491bd94d934db7448fdd0ecd648b068e590a36d435eff8f23
9ff47e79b63f51120841571a1b4edf1203a1073c1cae2127378594020f9f47d3
e04e6778b5aec9428dcafc18a3327c2eba5e5f2da35c88108d0fd96b13ca88d7
9b52a30a349bde1a16cf6b475139d0c265ca6eafac3547e032eb3f646a9ceac7
ac9c52224ac08d358d5e0c986d7e7e90af4edae48aff356a1aea4f0b21d84be3
f717ab06d28746795475fa1535873ede078b066eceedbb16eaac8791ff073d0d
43831d1b4162055ff585e9dc3760126accde5a416feb5f4c7fc133e4d6b139ac
15743c0a95f845637410f86b35057591c8333761b3d20b90b8a8f71a130eefd4
19c32d8993e2df86b1daf10aea722ddc8990831f2ca67b1162fb1571c1680a94
fe7e4cfc3c56e3cbdbc0c5ab4cf96abcf026ab9504447d246a2686d7691d2133
faf5afba6ad7509314da316850d247ebc98af8038d98c99113b22a1fb34d12d5
f42766c8b28395f162bfccba16f029564dd84cbaa4805bb3f149859fd19f52ee
ccd544b8d74e9d7213ccfda1403b9bf61c7e238beb8416fa0f2712b671d59a12
93814fd348b05c3f0d6826428010e45b1e6395d21534d129fd5c111f0a41de2d
6e323a9e07cdb6526a9294936d0dd5f85743f18a63174752ab099276e244d4dd
8eb8949914ed682ff9a5d3ebc0392f144567b6dfac47d7e5ccbb8cbfb793ab30
e200e37feee40e88d9b9ef2264b7b49b9471308a3868bc884f889d571b03ba61
f7605a810d43d074374c8b9951bf2e8058e411cc6bc5e12ad986bdf3c8b5276a
1b56279f69742da900c2e30f7175860ef619dc77fbd53fb1fee8f1d4e486c08f
14a7e018bd658a926d4d11784f4ab0120e34b36bc1e4b2efd247fa28f525b2f0
05e9eae1433ced2ec2e391bd7a7866b6bcfbde30c7d7ce7c25578132e2eeb843
fc1c2c6a7ffbf099428b1434086d4e110ba751dc87cfcf820d192089354c9e6f
cf21d78f169737465e5b80d4c2db91b993db11ab80069687caf1b3d606cfb007
b5265ebb4c3e8b1d00a886b625fee87d6e0210b13ec5fd731b72362010691b28
5e77a16fdff0da2ee26fc497a07fda08b5e0136d00249affb90a483f38fd7410
cbea584a400d9809e893d740f98ec1972a92b029afc711c1e200b91acb60be68
0c3e256d89308045d9e81086f4daa595fd295c5c993fa5db9ea1ea127dcc9916
838e78aa989ac70e779a97900240861a22f5d85e185200202e9331e0dfc9bbab
67f9e1f2b15977d9b58089ba3c980b11d621849c7826bc3228e2b4627667eddb
`.trim().split(/\s+/));

function fallo(status, mensaje, extra) {
    const e = new Error(mensaje);
    e.status = status;
    if (extra) e.extra = extra;
    return e;
}

function cuerpo(req) {
    if (req.body && typeof req.body === 'object') return req.body;
    try { return JSON.parse(req.body || '{}'); } catch (_) { return {}; }
}

function texto(valor, max) {
    return String(valor || '').normalize('NFC').replace(/[\u0000-\u001f<>"]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function normalizarPersona(valor) {
    return String(valor || '').normalize('NFD').replace(/\p{M}/gu, '').toUpperCase().replace(/[^A-Z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function estaEnNomina(nombre, apellido) {
    const clave = normalizarPersona(`${apellido} ${nombre}`);
    const huella = crypto.createHash('sha256').update(clave).digest('hex');
    return HUELLAS_NOMINA.has(huella);
}

// Firebase no admite puntos en las claves.
function claveDe(correo) { return correo.replace(/\./g, ','); }

function hashLlave(llave) { return crypto.createHash('sha256').update(String(llave)).digest('hex'); }

function llaveValida(guardada, llave) {
    if (!guardada || !llave) return false;
    const a = Buffer.from(String(guardada), 'hex');
    const b = Buffer.from(hashLlave(llave), 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function primeraPalabra(valor) { return String(valor || '').split(' ')[0] || ''; }

function nombreCorto(ins) { return `${primeraPalabra(ins.nombre)} ${primeraPalabra(ins.apellido)}`.trim(); }

function vaEnBus(ins) { return ins && ins.asiste === 'si' && ins.transporte === 'bus' && Number(ins.asiento) >= 1; }

function estadoPublico(inscripciones) {
    const lista = Object.values(inscripciones || {});
    const asisten = lista.filter(i => i.asiste === 'si');
    const asientos = {};
    asisten.filter(vaEnBus).forEach(i => { asientos[String(i.asiento)] = { nombre: nombreCorto(i) }; });
    return {
        capacidad: CAPACIDAD,
        asientos,
        totales: {
            asisten: asisten.length,
            noAsisten: lista.filter(i => i.asiste === 'no').length,
            bus: Object.keys(asientos).length,
            personal: asisten.filter(i => i.transporte === 'personal').length,
            libres: CAPACIDAD - Object.keys(asientos).length
        },
        actualizado: Date.now()
    };
}

function inscripcionPropia(ins) {
    if (!ins) return null;
    return {
        nombre: ins.nombre || '',
        apellido: ins.apellido || '',
        correo: ins.correo || '',
        telefono: ins.telefono || '',
        emergenciaNombre: ins.emergenciaNombre || '',
        emergenciaTelefono: ins.emergenciaTelefono || '',
        asiste: ins.asiste || '',
        transporte: ins.transporte || '',
        asiento: vaEnBus(ins) ? Number(ins.asiento) : null,
        comida: ins.comida || '',
        actualizado: ins.actualizado || null
    };
}

function validarCorreo(valor) {
    const correo = String(valor || '').trim().toLowerCase();
    if (correo.length > 100 || !RE_CORREO.test(correo)) throw fallo(400, 'Revisa tu correo: debe ser como nombre@dominio.cl.');
    return correo;
}

function validarTelefono(valor, mensaje) {
    const telefono = texto(valor, 20);
    const digitos = telefono.replace(/\D/g, '');
    if (!RE_TELEFONO.test(telefono) || digitos.length < 8 || digitos.length > 15) throw fallo(400, mensaje);
    return telefono;
}

async function estado(req, res, db) {
    const snap = await db.ref(INSCRIPCIONES).once('value');
    // El mapa se consulta cada pocos segundos: unos segundos de caché en el CDN
    // alivian las funciones sin que el mapa se vea viejo.
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=2, stale-while-revalidate=4');
    return res.status(200).json({ ok: true, ...estadoPublico(snap.val()) });
}

async function mia(req, res, db) {
    const body = cuerpo(req);
    const correo = validarCorreo(body.correo);
    const snap = await db.ref(`${INSCRIPCIONES}/${claveDe(correo)}`).once('value');
    const ins = snap.val();
    if (!ins || !llaveValida(ins.llave, body.llave)) return res.status(404).json({ error: 'No encontramos tu inscripción en este navegador.' });
    return res.status(200).json({ ok: true, inscripcion: inscripcionPropia(ins) });
}

async function inscribir(req, res, db) {
    const body = cuerpo(req);
    const nombre = texto(body.nombre, 80);
    const apellido = texto(body.apellido, 80);
    if (!RE_NOMBRE.test(nombre)) throw fallo(400, 'Escribe tus nombres.');
    if (!RE_NOMBRE.test(apellido)) throw fallo(400, 'Escribe tus apellidos.');
    if (!estaEnNomina(nombre, apellido)) throw fallo(403, 'No encontramos tus nombres y apellidos en la nómina vigente de docentes titulares y suplentes. Escríbelos completos, tal como aparecen en la nómina.');
    const correo = validarCorreo(body.correo);
    const telefono = validarTelefono(body.telefono, 'Revisa tu teléfono: por ejemplo, +56 9 1234 5678.');
    const emergenciaNombre = texto(body.emergenciaNombre, 80);
    if (emergenciaNombre.length < 2) throw fallo(400, 'Escribe el nombre de tu contacto de emergencia.');
    const emergenciaTelefono = validarTelefono(body.emergenciaTelefono, 'Revisa el teléfono de tu contacto de emergencia.');
    const asiste = String(body.asiste || '');
    if (!['si', 'no'].includes(asiste)) throw fallo(400, 'Indica si asistes.');
    const transporte = asiste === 'si' ? String(body.transporte || '') : '';
    if (asiste === 'si' && !['bus', 'personal'].includes(transporte)) throw fallo(400, 'Indica cómo llegas a las termas.');
    const asiento = transporte === 'bus' ? Number(body.asiento) : null;
    if (transporte === 'bus' && !(Number.isInteger(asiento) && asiento >= 1 && asiento <= CAPACIDAD)) throw fallo(400, 'Elige un asiento del bus.');
    const comida = asiste === 'si' ? String(body.comida || '') : '';
    if (asiste === 'si' && !COMIDAS.has(comida)) throw fallo(400, 'Elige una opción de alimentación: con desayuno, con once o solo almuerzo.');

    const clave = claveDe(correo);
    const llaveRecibida = String(body.llave || '');
    const llaveNueva = crypto.randomBytes(18).toString('base64url');
    let motivo = '';
    let llaveEntregada = '';

    const resultado = await db.ref(INSCRIPCIONES).transaction(actual => {
        motivo = '';
        llaveEntregada = '';
        const todas = actual || {};
        const previa = todas[clave];
        if (previa && !llaveValida(previa.llave, llaveRecibida)) { motivo = 'ajena'; return; }
        if (!previa && Object.keys(todas).length >= TOPE_INSCRIPCIONES) { motivo = 'tope'; return; }
        if (transporte === 'bus') {
            const ocupado = Object.entries(todas).some(([k, v]) => k !== clave && vaEnBus(v) && Number(v.asiento) === asiento);
            if (ocupado) { motivo = 'ocupado'; return; }
        }
        const ahora = Date.now();
        if (!previa) llaveEntregada = llaveNueva;
        todas[clave] = {
            nombre,
            apellido,
            correo,
            telefono,
            emergenciaNombre,
            emergenciaTelefono,
            asiste,
            transporte,
            asiento: transporte === 'bus' ? asiento : null,
            comida,
            llave: previa ? previa.llave : hashLlave(llaveNueva),
            creado: previa ? previa.creado : ahora,
            actualizado: ahora
        };
        return todas;
    });

    if (!resultado.committed) {
        const snap = await db.ref(INSCRIPCIONES).once('value');
        const mapa = estadoPublico(snap.val());
        if (motivo === 'ocupado') throw fallo(409, 'Alguien acaba de tomar ese asiento. Elige otro.', { codigo: 'ocupado', estado: mapa });
        if (motivo === 'ajena') throw fallo(409, 'Ese correo ya está inscrito desde otro navegador. Si necesitas cambiar algo, escríbele a Francisco Núñez.', { codigo: 'ajena', estado: mapa });
        if (motivo === 'tope') throw fallo(409, 'La inscripción alcanzó su tope. Escríbele a Francisco Núñez.', { codigo: 'tope', estado: mapa });
        throw fallo(500, 'No se pudo guardar la inscripción. Intenta de nuevo.');
    }

    const todas = resultado.snapshot.val() || {};
    return res.status(200).json({
        ok: true,
        llave: llaveEntregada || undefined,
        inscripcion: inscripcionPropia(todas[clave]),
        estado: estadoPublico(todas)
    });
}

async function verificarAdmin(req, db, auth) {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
    if (!token) throw fallo(401, 'Inicia sesión para continuar.');
    let decoded;
    try { decoded = await auth.verifyIdToken(token); } catch (_) { throw fallo(401, 'Sesión vencida. Vuelve a ingresar.'); }
    const snap = await db.ref(`plataforma_estudiantes/admins/${decoded.uid}`).once('value');
    if (snap.val() !== true) throw fallo(403, 'Tu cuenta no tiene acceso a esta lista.');
    return decoded;
}

async function adminLista(req, res, db, auth) {
    await verificarAdmin(req, db, auth);
    const snap = await db.ref(INSCRIPCIONES).once('value');
    const todas = snap.val() || {};
    const filas = Object.values(todas)
        .map(i => ({ ...inscripcionPropia(i), creado: i.creado || null }))
        .sort((a, b) => `${a.apellido} ${a.nombre}`.localeCompare(`${b.apellido} ${b.nombre}`, 'es'));
    return res.status(200).json({ ok: true, filas, ...estadoPublico(todas) });
}

async function adminQuitar(req, res, db, auth) {
    await verificarAdmin(req, db, auth);
    const correo = validarCorreo(cuerpo(req).correo);
    await db.ref(`${INSCRIPCIONES}/${claveDe(correo)}`).remove();
    const snap = await db.ref(INSCRIPCIONES).once('value');
    return res.status(200).json({ ok: true, ...estadoPublico(snap.val()) });
}

async function manejar(req, res, accion, db, auth) {
    try {
        if (accion === 'estado' && req.method === 'GET') return await estado(req, res, db);
        if (accion === 'admin-lista' && req.method === 'GET') return await adminLista(req, res, db, auth);
        if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
        if (accion === 'mia') return await mia(req, res, db);
        if (accion === 'inscribir') return await inscribir(req, res, db);
        if (accion === 'admin-quitar') return await adminQuitar(req, res, db, auth);
        return res.status(400).json({ error: 'Acción no válida.' });
    } catch (error) {
        const status = error.status || 500;
        if (status === 500) console.error('[_termas.js]', accion, error.message);
        return res.status(status).json({ error: status === 500 ? 'No se pudo procesar la solicitud. Intenta de nuevo.' : error.message, ...(error.extra || {}) });
    }
}

module.exports = { manejar, CAPACIDAD, estadoPublico, claveDe, normalizarPersona, estaEnNomina, NOMINA_DOCENTES_TOTAL: HUELLAS_NOMINA.size };
