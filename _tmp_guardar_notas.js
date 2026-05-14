// _tmp_guardar_notas.js — guarda correcciones manuales + notas finales en RTDB
require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

function normalizePrivateKey(raw) {
  let k = (raw || '').trim();
  if ((k.startsWith('"') && k.endsWith('"')) || (k.startsWith("'") && k.endsWith("'"))) k = k.slice(1, -1);
  if (k.includes('\\n')) k = k.replace(/\\n/g, '\n');
  const m = k.replace(/\s+/g, '').match(/^-+BEGINPRIVATEKEY-+([A-Za-z0-9+/=]+)-+ENDPRIVATEKEY-+$/);
  if (m) { const lines = m[1].match(/.{1,64}/g) || []; k = '-----BEGIN PRIVATE KEY-----\n' + lines.join('\n') + '\n-----END PRIVATE KEY-----\n'; }
  return k;
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY)
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://profe-blog-default-rtdb.firebaseio.com'
});

const db = admin.database();
const SID = 'pedro-paramo-nm3-regular-2026';
const PUNTAJE_MAX = 34;
const EXIGENCIA = 0.60;

function calcularNota(pts, max, exigencia) {
  const r = pts / max;
  if (r >= exigencia) return +(4.0 + 3.0 * (r - exigencia) / (1 - exigencia)).toFixed(1);
  return +(1.0 + 3.0 * (r / exigencia)).toFixed(1);
}

const correcciones = [
  { rut: '23036159-2', nombre: 'GONZALEZ SAAVEDRA JOAQUIN ANDRES', auto: 17,
    pedro_11: { nivel: '1/3', puntos: 1, evidencia: 'Solo emociones (desesperacion, dolor); no compara la Comala de Dolores con la actual ni explica funcion del contraste.' },
    pedro_25: { nivel: '2/3', puntos: 3, evidencia: 'Menciona 3 ejes (promesa, deseo, culpa); falta evidencia textual explicita.' }
  },
  { rut: '22821466-3', nombre: 'RAMIREZ TORRES CRISTOBAL IGNACIO', auto: 19,
    pedro_11: { nivel: '2/3', puntos: 3, evidencia: 'Compara Comala prospera (Dolores) vs vacia/olvidada (Juan); no profundiza funcion del contraste.' },
    pedro_25: { nivel: '1/3', puntos: 2, evidencia: 'Habla de fragmentacion temporal (cambio de foco); toca memoria indirectamente; no aborda ejes pedidos.' }
  },
  { rut: '23178677-5', nombre: 'POBLETE MUÑOZ JOAQUIN ALEXIS', auto: 22,
    pedro_11: { nivel: '3/3', puntos: 4, evidencia: 'Contraste claro entre Comala bella de Dolores y Comala destruida de Juan; funcion: memoria vs presente.' },
    pedro_25: { nivel: '3/3', puntos: 5, evidencia: 'Articula amor/deseo (Susana), poder, culpa, ruina (pueblo), promesa (cruzar brazos) y memoria (almas en pena); multiples evidencias narrativas.' }
  },
  { rut: '23126780-8', nombre: 'RAMIREZ ARANCIBIA BENJAMIN IGNACIO', auto: 20,
    pedro_11: { nivel: '3/3', puntos: 4, evidencia: 'Contraste detallado (pueblo vivo/colorido vs desertico); explica causa (Pedro dejo al pueblo sin comer).' },
    pedro_25: { nivel: '1/3', puntos: 2, evidencia: 'Habla de tiempo no cronologico y voces fantasmas; toca memoria/ruina indirectamente; no articula ejes pedidos.' }
  },
  { rut: '23177793-8', nombre: 'RAMOS VARGAS CRISTOBAL GABRIEL', auto: 21,
    pedro_11: { nivel: '0/3', puntos: 0, evidencia: 'Caracteres aleatorios de teclado, sin contenido respondido.' },
    pedro_25: { nivel: '0/3', puntos: 0, evidencia: 'Caracteres aleatorios de teclado, sin contenido respondido.' }
  },
  { rut: '23233347-2', nombre: 'CABRERA SAN MARTIN JOSE VICENTE', auto: 15,
    pedro_11: { nivel: '1/3', puntos: 1, evidencia: 'Menciona Dolores y Pedro Paramo; frases incoherentes sin idea central clara del contraste.' },
    pedro_25: { nivel: '1/3', puntos: 2, evidencia: 'Intenta abordar muerte (ruina), mama (memoria) y relacion padre-hijo (culpa); incoherente pero con palabras clave.' }
  }
];

function cleanRut(r) { return (r || '').replace(/[.\s]/g, '').toUpperCase(); }
function rutToEmail(r) { return cleanRut(r).replace(/-/g, '') + '@est.profefranciscopancho.com'; }

(async () => {
  try {
    const planilla = [];
    for (const c of correcciones) {
      const uid = (await admin.auth().getUserByEmail(rutToEmail(c.rut))).uid;
      const ptsDesarrollo = c.pedro_11.puntos + c.pedro_25.puntos;
      const ptsTotal = c.auto + ptsDesarrollo;
      const nota = calcularNota(ptsTotal, PUNTAJE_MAX, EXIGENCIA);
      const pct = Math.round(ptsTotal * 100 / PUNTAJE_MAX);

      const correccion = {
        nombre: c.nombre, rut: c.rut, curso: '3D-TP',
        auto_puntaje: c.auto, auto_total: 25,
        pedro_11: c.pedro_11, pedro_25: c.pedro_25,
        desarrollo_puntaje: ptsDesarrollo, desarrollo_total: 9,
        puntaje_total: ptsTotal, puntaje_max: PUNTAJE_MAX,
        porcentaje: pct, nota, exigencia: EXIGENCIA,
        corregido_por: 'Francisco Nunez', corregido_at: Date.now()
      };

      await db.ref(`plataforma_lecturas/correcciones_manual/${SID}/${uid}`).set(correccion);
      // Tambien actualizar resultados con la nota final para que aparezca en el panel
      await db.ref(`plataforma_lecturas/resultados/${SID}/${uid}`).update({
        puntaje_desarrollo_manual: ptsDesarrollo,
        puntaje_total_final: ptsTotal,
        puntaje_max_final: PUNTAJE_MAX,
        porcentaje_final: pct,
        nota_final: nota,
        manual_corregido: true,
        manual_corregido_at: Date.now()
      });

      planilla.push({ nombre: c.nombre, rut: c.rut, auto: c.auto + '/25', des: ptsDesarrollo + '/9', total: ptsTotal + '/' + PUNTAJE_MAX, pct: pct + '%', nota });
      console.log('✅', c.nombre, '| auto', c.auto, '+ des', ptsDesarrollo, '=', ptsTotal, '/', PUNTAJE_MAX, '(', pct + '% )→ nota', nota);
    }
    console.log('\n📋 PLANILLA FINAL:');
    console.table(planilla);
    process.exit(0);
  } catch (e) { console.error('ERROR:', e); process.exit(1); }
})();
