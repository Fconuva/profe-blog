// Auditoría + reapertura forzada + smoke test E2E para 3A-TP en Pedro Páramo NM3
// Para cada estudiante:
//   1. Verifica Auth (puede ingresar)
//   2. Resetea TODOS los flags de cierre en /respuestas y /resultados (todas las sesiones PP NM3)
//   3. Crea custom token, intercambia por idToken, lee asignación, escribe smoke, lee back, borra
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const FB_API_KEY = 'AIzaSyCzN4xNEE_hKshXbsVqLhWSnzet1pHwRh8';
const DB_URL = 'https://profe-blog-default-rtdb.firebaseio.com';
const COURSE = '3A-TP';

function normalizePrivateKey(raw) {
  let key = (raw || '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) key = key.slice(1, -1);
  if (key.includes('\\n')) key = key.replace(/\\n/g, '\n');
  const packed = key.replace(/\s+/g, '').match(/^-+BEGINPRIVATEKEY-+([A-Za-z0-9+/=]+)-+ENDPRIVATEKEY-+$/);
  if (packed) {
    const lines = packed[1].match(/.{1,64}/g) || [];
    key = '-----BEGIN PRIVATE KEY-----\n' + lines.join('\n') + '\n-----END PRIVATE KEY-----\n';
  }
  return key;
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY)
    }),
    databaseURL: DB_URL
  });
}
const auth = admin.auth();
const db = admin.database();

async function exchangeCustomToken(customToken) {
  const r = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=' + FB_API_KEY, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ token: customToken, returnSecureToken: true })
  });
  const j = await r.json();
  if (!j.idToken) throw new Error('signInWithCustomToken: ' + JSON.stringify(j));
  return j.idToken;
}
async function rtdbGet(path, idToken){ const r=await fetch(DB_URL+path+'.json?auth='+idToken); return r.ok?r.json():null; }
async function rtdbPut(path, idToken, data){ const r=await fetch(DB_URL+path+'.json?auth='+idToken,{method:'PUT',body:JSON.stringify(data)}); return r.ok; }
async function rtdbDel(path, idToken){ const r=await fetch(DB_URL+path+'.json?auth='+idToken,{method:'DELETE'}); return r.ok; }

(async () => {
  // 1. Listar todas las sesiones Pedro Páramo NM3
  const sesSnap = await db.ref('plataforma_lecturas/sesiones').once('value');
  const sesAll = sesSnap.val() || {};
  const ppSessions = Object.keys(sesAll).filter(k => /^pedro-paramo-nm3/i.test(k));
  console.log('Sesiones Pedro Páramo NM3 detectadas:', ppSessions);

  // Activarlas todas (por si alguna está apagada)
  const sesUpdates = {};
  for (const sid of ppSessions) sesUpdates['plataforma_lecturas/sesiones/'+sid+'/activa'] = true;
  await db.ref().update(sesUpdates);
  console.log('Sesiones forzadas a activa:true');

  // 2. Listar 3A-TP
  const stuSnap = await db.ref('plataforma_estudiantes/estudiantes').once('value');
  const stuAll = stuSnap.val() || {};
  const lista = Object.entries(stuAll)
    .filter(([,s]) => String(s && s.curso || '').trim().toUpperCase() === COURSE)
    .map(([uid,s]) => ({ uid, nombre: s.nombre || uid, rut: s.rut }))
    .sort((a,b) => (a.nombre||'').localeCompare(b.nombre||''));
  console.log('Estudiantes', COURSE+':', lista.length);

  // 3. Identificar a qué sesión pertenece cada uno por asignación
  const asignSnaps = {};
  for (const sid of ppSessions) {
    asignSnaps[sid] = (await db.ref('plataforma_lecturas/asignaciones').once('value')).val() || {};
    break; // asignaciones es por uid, no por sesión-uid; lo leemos una sola vez
  }
  const asigByUid = (await db.ref('plataforma_lecturas/asignaciones').once('value')).val() || {};

  // 4. Reabrir TODOS los registros en TODAS las sesiones PP NM3
  const now = Date.now();
  const updates = {};
  let touched = 0;
  for (const sid of ppSessions) {
    const respSnap = (await db.ref('plataforma_lecturas/respuestas/'+sid).once('value')).val() || {};
    const resSnap = (await db.ref('plataforma_lecturas/resultados/'+sid).once('value')).val() || {};
    for (const stu of lista) {
      const hasResp = !!respSnap[stu.uid];
      const hasRes = !!resSnap[stu.uid];
      if (!hasResp && !hasRes) continue;
      const respBase = 'plataforma_lecturas/respuestas/'+sid+'/'+stu.uid;
      updates[respBase+'/strikes'] = 0;
      updates[respBase+'/bloqueado_por_strikes'] = null;
      updates[respBase+'/completada'] = false;
      updates[respBase+'/submitted_at'] = null;
      updates[respBase+'/forzar_envio'] = false;
      updates[respBase+'/cerrado_por_docente'] = null;
      updates[respBase+'/pausado_por_docente'] = false;
      updates[respBase+'/pausa_motivo'] = null;
      updates[respBase+'/pausa_at'] = null;
      updates[respBase+'/pausa_curso'] = null;
      updates[respBase+'/reopened_at'] = now;
      updates[respBase+'/reanudado_at'] = now;
      if (hasRes) {
        const resBase = 'plataforma_lecturas/resultados/'+sid+'/'+stu.uid;
        updates[resBase+'/strikes'] = 0;
        updates[resBase+'/bloqueado_por_strikes'] = null;
        updates[resBase+'/completada'] = false;
        updates[resBase+'/submitted_at'] = null;
        updates[resBase+'/cerrado_por_docente'] = null;
        updates[resBase+'/reopened_at'] = now;
      }
      touched++;
    }
  }
  if (Object.keys(updates).length) {
    await db.ref().update(updates);
    console.log('Flags de cierre limpiados en', touched, 'pares (estudiante, sesión).');
  } else {
    console.log('No había registros que reabrir.');
  }

  // 5. Smoke test E2E por estudiante
  const filas = [];
  for (const stu of lista) {
    const row = { nombre: stu.nombre, sesion:'-', auth:'-', login:'-', leerSesion:'-', leerAsignacion:'-', escribir:'-', limpiar:'-' };
    try {
      // Auth
      const userRecord = await auth.getUser(stu.uid).catch(()=>null);
      if (!userRecord) { row.auth = 'NO EXISTE'; filas.push(row); continue; }
      row.auth = 'ok';
      // Asignación → sesión
      const asig = asigByUid[stu.uid] || {};
      const mySid = ppSessions.find(s => asig[s]) || ppSessions[0];
      row.sesion = mySid;
      // Login
      const customTok = await auth.createCustomToken(stu.uid);
      const idToken = await exchangeCustomToken(customTok);
      row.login = 'ok';
      // Leer sesión
      const ses = await rtdbGet('/plataforma_lecturas/sesiones/'+mySid, idToken);
      row.leerSesion = (ses && ses.activa) ? 'ok' : 'sesion inactiva';
      // Leer asignación
      const myAsig = await rtdbGet('/plataforma_lecturas/asignaciones/'+stu.uid+'/'+mySid, idToken);
      row.leerAsignacion = myAsig ? 'ok' : 'sin asignacion';
      if (!myAsig) {
        // crear asignación faltante
        await db.ref('plataforma_lecturas/asignaciones/'+stu.uid+'/'+mySid).set({ asignada_at: now, curso: COURSE });
        row.leerAsignacion = 'creada';
      }
      // Escribir smoke
      const okWrite = await rtdbPut('/plataforma_lecturas/respuestas/'+mySid+'/'+stu.uid+'/_smoke_test', idToken, { at: now, by: 'admin-3atp' });
      row.escribir = okWrite ? 'ok' : 'FALLO';
      // Limpiar
      const okDel = await rtdbDel('/plataforma_lecturas/respuestas/'+mySid+'/'+stu.uid+'/_smoke_test', idToken);
      row.limpiar = okDel ? 'ok' : 'FALLO';
    } catch (e) {
      row.escribir = 'EXC: '+e.message.slice(0,80);
    }
    filas.push(row);
  }
  console.log('\n=== RESULTADO SMOKE TEST '+COURSE+' Pedro Páramo NM3 ===');
  console.table(filas);
  const fallos = filas.filter(r => [r.auth,r.login,r.leerSesion,r.leerAsignacion,r.escribir,r.limpiar].some(v => v && v !== 'ok' && v !== 'creada'));
  console.log('OK:', filas.length - fallos.length, '| FALLOS:', fallos.length);
  if (fallos.length) {
    console.log('\nFALLOS DETALLE:');
    for (const f of fallos) console.log('-', f.nombre, '|', JSON.stringify(f));
  } else {
    console.log('\n✅ Los', filas.length, 'estudiantes de '+COURSE+' están listos: pueden ingresar, leer asignación, escribir respuestas y NO están bloqueados ni marcados como completada.');
  }
  process.exit(0);
})().catch(e => { console.error('FATAL:', e); process.exit(1); });
