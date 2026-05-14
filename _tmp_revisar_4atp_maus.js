// Auditoría + auto-fix para 4A-TP en sesiones Maus NM4
// - Verifica que cada alumno del roster exista en plataforma_estudiantes/estudiantes (por RUT)
// - Verifica que tenga cuenta Auth activa
// - Determina la sesión Maus correspondiente (DIL / Intermedia / Regular)
// - Asegura asignación en plataforma_lecturas/asignaciones/<uid>/<sesId>
// - Limpia flags de cierre/pausa en respuestas y resultados (forzar_envio, cerrado_por_docente,
//   pausado_por_docente, completada, submitted_at, bloqueado_por_strikes, strikes)
// - Reporta TODO lo que falle.

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

function normalizePrivateKey(raw) {
  let key = (raw || '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  if (key.includes('\\n')) {
    key = key.replace(/\\n/g, '\n');
  }
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
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://profe-blog-default-rtdb.firebaseio.com'
  });
}

const db = admin.database();
const auth = admin.auth();

const ROSTER_FILE = 'carga_4A_TP.txt';
const COURSE = '4A-TP';
const ROOT = __dirname;

const SESSION_REGULAR    = 'maus-nm4-2026';
const SESSION_DIL        = 'maus-nm4-dil-2026';
const SESSION_INTERMEDIA = 'maus-nm4-intermedia-2026';

function cleanRut(rut) { return String(rut || '').replace(/[.\s-]/g, '').toUpperCase(); }
function rutWithDash(rut) {
  const c = cleanRut(rut);
  if (!c) return '';
  return c.slice(0, -1) + '-' + c.slice(-1);
}
function readRutSet(rel) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) return new Set();
  return new Set(fs.readFileSync(p, 'utf8').split(/\r?\n/).map(cleanRut).filter(Boolean));
}

function readRoster() {
  const lines = fs.readFileSync(path.join(ROOT, ROSTER_FILE), 'utf8').split(/\r?\n/).filter(Boolean);
  return lines.map(line => {
    const [nombre, rut, curso] = line.split(';').map(s => (s || '').trim());
    return { nombre, rut, rutClean: cleanRut(rut), curso };
  });
}

(async () => {
  const roster = readRoster();
  const dilSet = readRutSet('lecturas/asignaciones/maus_nm4_4A_tp_dil_ruts.txt');
  const intSet = readRutSet('lecturas/asignaciones/maus_nm4_4A_tp_intermedia_ruts.txt');

  const studentsSnap = await db.ref('plataforma_estudiantes/estudiantes').once('value');
  const allStudents = studentsSnap.val() || {};
  const byRut = new Map();
  Object.entries(allStudents).forEach(([uid, s]) => {
    const r = cleanRut(s && s.rut);
    if (r) byRut.set(r, { uid, ...s });
  });

  const [respSnap, resSnap, asigSnap, sesSnap] = await Promise.all([
    db.ref('plataforma_lecturas/respuestas').once('value'),
    db.ref('plataforma_lecturas/resultados').once('value'),
    db.ref('plataforma_lecturas/asignaciones').once('value'),
    db.ref('plataforma_lecturas/sesiones').once('value')
  ]);
  const responses = respSnap.val() || {};
  const results = resSnap.val() || {};
  const asignaciones = asigSnap.val() || {};
  const sesiones = sesSnap.val() || {};

  // Verificar que las 3 sesiones estén activas
  const sesionesEstado = {};
  for (const sid of [SESSION_REGULAR, SESSION_DIL, SESSION_INTERMEDIA]) {
    const s = sesiones[sid];
    sesionesEstado[sid] = {
      existe: !!s,
      activa: !!(s && s.activa),
      titulo: s && s.titulo,
      duracion_min: s && s.duracion_min
    };
    if (s && s.activa !== true) {
      await db.ref('plataforma_lecturas/sesiones/' + sid + '/activa').set(true);
      sesionesEstado[sid].fixedActiva = true;
    }
  }

  console.log('=== ESTADO SESIONES MAUS NM4 ===');
  console.table(sesionesEstado);

  const updates = {};
  const now = Date.now();
  const reporte = [];
  const errores = [];

  for (const r of roster) {
    const row = { nombre: r.nombre, rut: r.rut, sesion: '?', auth: '?', dbStudent: '?', asignacion: '?', flagsLimpios: '-' };

    const student = byRut.get(r.rutClean);
    if (!student) {
      row.dbStudent = 'NO EXISTE';
      errores.push(`${r.nombre} (${r.rut}): no está en plataforma_estudiantes`);
      reporte.push(row);
      continue;
    }
    row.dbStudent = 'ok';
    const uid = student.uid;

    // Auth
    try {
      const u = await auth.getUser(uid);
      row.auth = u.disabled ? 'DESHABILITADO' : 'ok';
      if (u.disabled) errores.push(`${r.nombre}: cuenta Auth deshabilitada`);
    } catch (e) {
      row.auth = 'NO EXISTE';
      errores.push(`${r.nombre}: sin cuenta Auth (${e.code || e.message})`);
    }

    // Sesión correspondiente
    let sesId;
    if (dilSet.has(r.rutClean)) sesId = SESSION_DIL;
    else if (intSet.has(r.rutClean)) sesId = SESSION_INTERMEDIA;
    else sesId = SESSION_REGULAR;
    row.sesion = sesId;

    // Asignación
    const ya = asignaciones[uid] && asignaciones[uid][sesId] === true;
    if (!ya) {
      updates['plataforma_lecturas/asignaciones/' + uid + '/' + sesId] = true;
      row.asignacion = 'AGREGADA';
    } else {
      row.asignacion = 'ok';
    }

    // Limpiar flags si hay registros previos en esa sesión
    const respBase = 'plataforma_lecturas/respuestas/' + sesId + '/' + uid;
    const resBase  = 'plataforma_lecturas/resultados/' + sesId + '/' + uid;
    const hasResp = !!(responses[sesId] && responses[sesId][uid]);
    const hasRes  = !!(results[sesId] && results[sesId][uid]);
    if (hasResp || hasRes) {
      if (hasResp) {
        updates[respBase + '/strikes'] = 0;
        updates[respBase + '/bloqueado_por_strikes'] = null;
        updates[respBase + '/completada'] = false;
        updates[respBase + '/submitted_at'] = null;
        updates[respBase + '/forzar_envio'] = false;
        updates[respBase + '/cerrado_por_docente'] = null;
        updates[respBase + '/pausado_por_docente'] = false;
        updates[respBase + '/pausa_motivo'] = null;
        updates[respBase + '/pausa_at'] = null;
        updates[respBase + '/pausa_curso'] = null;
        updates[respBase + '/reopened_at'] = now;
        updates[respBase + '/reanudado_at'] = now;
      }
      if (hasRes) {
        updates[resBase + '/strikes'] = 0;
        updates[resBase + '/bloqueado_por_strikes'] = null;
        updates[resBase + '/completada'] = false;
        updates[resBase + '/submitted_at'] = null;
        updates[resBase + '/cerrado_por_docente'] = null;
        updates[resBase + '/reopened_at'] = now;
      }
      row.flagsLimpios = 'limpios';
    } else {
      row.flagsLimpios = 'sin registro';
    }

    reporte.push(row);
  }

  if (Object.keys(updates).length) {
    await db.ref().update(updates);
  }

  console.log('\n=== RESULTADO 4A-TP (' + roster.length + ' alumnos) ===');
  console.table(reporte);

  // Resumen por sesión
  const porSesion = {};
  reporte.forEach(r => {
    porSesion[r.sesion] = (porSesion[r.sesion] || 0) + 1;
  });
  console.log('\n=== ASIGNACIONES POR SESIÓN ===');
  console.table(porSesion);

  if (errores.length) {
    console.log('\n=== ⚠️  ERRORES (requieren acción manual) ===');
    errores.forEach(e => console.log('  - ' + e));
  } else {
    console.log('\n✅ Sin errores. Todos los alumnos del 4A-TP listos para ingresar a Maus.');
  }

  process.exit(0);
})().catch(e => {
  console.error('Error fatal:', e);
  process.exit(1);
});
