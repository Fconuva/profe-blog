// Guarda contra la divergencia de las reglas de RTDB.
//
// El caso que la origina (20 ago 2026): existian dos firebase-rules.json, el de
// este repo y el de C:\Users\franc\estudiacest-2026. Estaban divergidos y
// ninguno de los dos era una version "mas nueva" del otro: el de estudiacest-2026
// era identico a produccion, y el del repo era un borrador anterior, mas
// permisivo, que ademas no tenia los nodos 3atp_*. Desplegar el del repo habria
// apagado el guardado de 3ATP por tercera vez, y habria aflojado nueve nodos de
// "solo estudiantes registrados o admin" a "cualquier cuenta autenticada".
//
// Esta guarda no revisa estilo: revisa las tres cosas que rompieron algo real.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CANONICO = path.join(ROOT, 'firebase-rules.json');
// La copia que solia competir. Si sigue existiendo, tiene que ser identica.
const COPIA = path.join('C:', 'Users', 'franc', 'estudiacest-2026', 'firebase-rules.json');

// Nodos cuya ausencia rompio algo antes, o que protegen datos de estudiantes.
const OBLIGATORIOS = [
  ['plataforma_estudiantes', '3atp_clase1'],
  ['plataforma_estudiantes', '3atp_informe'],
  ['plataforma_estudiantes', 'admins'],
  ['plataforma_estudiantes', 'estudiantes'],
  ['plataforma_estudiantes', 'sesiones'],
  ['plataforma_estudiantes', 'respuestas'],
  ['plataforma_estudiantes', 'calificaciones_clase'],
  ['plataforma_estudiantes', 'telemetria_clases'],
  ['plataforma_estudiantes', 'resultados'],
  ['plataforma_nm1'],
  ['plataforma_nm4'],
  ['plataforma_lecturas'],
  ['plataforma_np']
];

// Nodos que NUNCA deben quedar abiertos a cualquier cuenta autenticada: si su
// .read es exactamente "auth != null" volvimos al borrador viejo.
const SIN_AUTH_PELADO = ['estudiantes', 'sesiones', 'calificaciones_clase', 'resultados', 'ranking', 'avatar', 'mensajes', 'admin_refresh'];

const fallas = [];

function leer(ruta, etiqueta) {
  if (!fs.existsSync(ruta)) return null;
  try {
    return JSON.parse(fs.readFileSync(ruta, 'utf8'));
  } catch (error) {
    fallas.push(`${etiqueta}: no es JSON valido (${error.message}).`);
    return null;
  }
}

const canonico = leer(CANONICO, 'firebase-rules.json');
if (!canonico) {
  if (!fs.existsSync(CANONICO)) fallas.push('Falta firebase-rules.json en la raiz de estudiacest.');
} else {
  const reglas = canonico.rules || {};

  if (reglas['.read'] !== false || reglas['.write'] !== false) {
    fallas.push('La raiz debe negar lectura y escritura (.read y .write en false).');
  }

  for (const camino of OBLIGATORIOS) {
    let nodo = reglas;
    let ok = true;
    for (const paso of camino) {
      if (!nodo || typeof nodo !== 'object' || !(paso in nodo)) { ok = false; break; }
      nodo = nodo[paso];
    }
    if (!ok) fallas.push(`Falta el nodo ${camino.join('/')}. Quitarlo apaga la funcion que lo usa.`);
  }

  const pe = reglas.plataforma_estudiantes || {};
  for (const nombre of SIN_AUTH_PELADO) {
    const lectura = pe[nombre] && pe[nombre]['.read'];
    if (lectura === 'auth != null') {
      fallas.push(`${nombre}: .read quedo en "auth != null", que deja entrar a cualquier cuenta. Debe exigir estudiante registrado o admin.`);
    }
  }
}

if (fs.existsSync(COPIA)) {
  const copia = leer(COPIA, 'copia en estudiacest-2026');
  if (copia && canonico && JSON.stringify(copia) !== JSON.stringify(canonico)) {
    fallas.push(
      'La copia de C:\\Users\\franc\\estudiacest-2026\\firebase-rules.json difiere de la de este repo. ' +
      'La fuente es la del repo: copiala encima antes de desplegar, o borra la copia.'
    );
  }
}

if (fallas.length) {
  console.error('Reglas de Firebase con problemas:\n- ' + fallas.join('\n- '));
  process.exit(1);
}

console.log('Reglas de Firebase verificadas: nodos obligatorios presentes, raiz cerrada y sin copia divergente.');
