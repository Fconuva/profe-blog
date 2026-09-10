// Guarda contra datos de estudiantes publicados en la web.
//
// Caso (10-sep-2026): con "outputDirectory": "." Vercel publica la carpeta
// completa, y cualquiera podía descargar el registro PIE (nombre completo, RUT
// y categoría de apoyo de 14 estudiantes), exportaciones SIMCE con 66 RUT,
// exportaciones con nombres y notas, una planilla con la lista de un curso y
// el código de la API, que traía una clave de administrador. Se bloquean con
// redirecciones de vercel.json: Vercel las aplica antes de buscar el archivo.
//
// Esta guarda revisa dos cosas: que los bloqueos sigan ahí, y que ningún
// archivo que el sitio sí entrega traiga RUT.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DESTINO = '/api/paes?action=private-source';

const BLOQUEOS = [
  '/api/:ruta(.+\\.js)',
  '/api/:ruta(.+\\.json)',
  '/scripts/:ruta(.*)',
  '/exports/:ruta(.*)',
  '/lecturas/contenidos/pie_students_2026.json',
  '/lecturas/contenidos/pie/:ruta(.*)',
  '/:ruta(.*_tmp_[^/]*)',
  '/:ruta(.+\\.md)',
  '/:ruta(.+\\.xlsx)',
  '/:archivo(firebase\\.json|firebase-rules\\.json|storage\\.rules|vercel\\.json|\\.vercelignore|package-lock\\.json)'
];

// Archivos con RUT que el sitio todavía entrega, cada uno con su motivo.
// Una entrada aquí es deuda, no permiso: se saca cuando se resuelve.
// Todas identifican al estudiante por RUT contra una nómina escrita en la página;
// el arreglo es preguntarle a la API y devolver solo el nombre de ese RUT.
const PENDIENTES = {
  'paes/js/nominas.js': 'Las guías PAES la cargan en el navegador. Sacar los RUT exige pasar la identificación a /api/paes (tarea f del 10-sep-2026).',
  'revision-triptico/index.html': 'Nómina ROSTERS "APELLIDOS NOMBRES|RUT" de 321 estudiantes para identificar por RUT.',
  '3atp/index.html': 'ROSTER_GROUPS con RUT para desbloquear la clase por RUT.',
  '3atp/informe/index.html': 'ROSTER_GROUPS con RUT para desbloquear el informe por RUT.'
};

// Carpetas que Vercel no sube (.vercelignore) o que no son del sitio.
const SALTAR = new Set(['node_modules', '.git', '.vercel', 'backups', '.cache', 'test-results']);
const EXTENSIONES = /\.(html|js|mjs|json|csv|tsv|txt)$/i;
const RUT = /\b\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]\b/g;

// Solo cuenta RUT con dígito verificador válido: los de ejemplo en los
// formularios ("12.345.678-9") casi nunca lo tienen.
function rutValido(rut) {
  const limpio = rut.replace(/[.\-]/g, '').toUpperCase();
  const cuerpo = limpio.slice(0, -1);
  let suma = 0;
  let factor = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const resto = 11 - (suma % 11);
  const dv = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
  return limpio.slice(-1) === dv;
}
const EJEMPLOS = new Set(['111111111', '222222222', '123456785', '99999999K', '999999999']);

const fallas = [];
const vercel = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
const redirecciones = Array.isArray(vercel.redirects) ? vercel.redirects : [];

for (const fuente of BLOQUEOS) {
  const regla = redirecciones.find((r) => r.source === fuente);
  if (!regla) {
    fallas.push(`vercel.json: falta el bloqueo ${fuente}. Sin él, el sitio vuelve a entregar esos archivos.`);
  } else if (regla.destination !== DESTINO || regla.permanent !== false) {
    fallas.push(`vercel.json: el bloqueo ${fuente} debe ir a ${DESTINO} con permanent en false.`);
  }
}

// Traduce las fuentes de vercel.json (path-to-regexp) a expresiones regulares:
// "/:nombre(patrón)" pasa a "/(patrón)"; lo demás es literal.
function aRegex(fuente) {
  let salida = '';
  let i = 0;
  while (i < fuente.length) {
    const param = fuente.slice(i).match(/^:[A-Za-z_]+\(/);
    if (param) {
      let prof = 1;
      let j = i + param[0].length;
      while (j < fuente.length && prof > 0) {
        if (fuente[j] === '\\') { j += 2; continue; }
        if (fuente[j] === '(') prof++;
        if (fuente[j] === ')') prof--;
        j++;
      }
      salida += '(?:' + fuente.slice(i + param[0].length, j - 1) + ')';
      i = j;
      continue;
    }
    salida += fuente[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    i++;
  }
  return new RegExp('^' + salida + '$');
}

const bloqueadas = redirecciones
  .filter((r) => r.destination === DESTINO)
  .map((r) => aRegex(r.source));

// Comprobación de la traducción con casos conocidos.
const CASOS = [
  ['/api/estudiantes.js', true],
  ['/api/_roster_nm4.js', true],
  ['/api/estudiantes', false],
  ['/lecturas/contenidos/pie/cualquiera.json', true],
  ['/_tmp_sesion.json', true],
  ['/REGLAS.md', true],
  ['/paes/js/nominas.js', false],
  ['/estudiantes/dashboard.html', false]
];
for (const [ruta, esperado] of CASOS) {
  const bloqueada = bloqueadas.some((r) => r.test(ruta));
  if (bloqueada !== esperado) {
    fallas.push(`La guarda traduce mal los bloqueos: ${ruta} debería ${esperado ? '' : 'no '}quedar bloqueada.`);
  }
}

let revisados = 0;
const recorrer = (dir) => {
  for (const nombre of fs.readdirSync(dir)) {
    const ruta = path.join(dir, nombre);
    const stat = fs.statSync(ruta);
    if (stat.isDirectory()) {
      if (!SALTAR.has(nombre)) recorrer(ruta);
      continue;
    }
    if (!EXTENSIONES.test(nombre) || /^\.env/.test(nombre)) continue;
    const relativa = path.relative(ROOT, ruta).split(path.sep).join('/');
    if (bloqueadas.some((r) => r.test('/' + relativa))) continue;
    revisados++;
    const texto = fs.readFileSync(ruta, 'utf8');
    const ruts = new Set((texto.match(RUT) || [])
      .map((r) => r.replace(/[.\-]/g, '').toUpperCase())
      .filter((r) => !EJEMPLOS.has(r) && rutValido(r))).size;
    if (ruts >= 3 && !PENDIENTES[relativa]) {
      fallas.push(`${relativa} trae ${ruts} RUT y el sitio lo entrega. Bloquéalo en vercel.json o saca los datos del navegador.`);
    }
  }
};
recorrer(ROOT);

// Caso (10-sep-2026): ADMIN_PASSWORD tenía un valor de respaldo escrito en el
// código, y como Vercel no definía la variable, ese era la clave vigente.
const apiDir = path.join(ROOT, 'api');
for (const nombre of fs.readdirSync(apiDir).filter((n) => n.endsWith('.js'))) {
  const texto = fs.readFileSync(path.join(apiDir, nombre), 'utf8');
  if (/process\.env\.[A-Z_]*(PASSWORD|SECRET|TOKEN|PRIVATE)[A-Z_]*\s*\|\|\s*['"`][^'"`]/.test(texto)) {
    fallas.push(`api/${nombre}: una clave o secreto tiene un valor de respaldo escrito en el código. Si falta la variable, el ingreso se apaga; no se usa un valor escrito.`);
  }
}

// Caso (10-sep-2026): el ingreso rápido entregaba sesión con la clave por
// defecto aunque el estudiante ya hubiera elegido la suya.
const ingreso = fs.readFileSync(path.join(apiDir, 'lecturas-login.js'), 'utf8');
if (!ingreso.includes('student.password_changed === true || student.perfil_completo === true')) {
  fallas.push('api/lecturas-login.js: el atajo con la clave por defecto debe negarse a quien ya eligió su clave o completó el perfil.');
}

for (const pendiente of Object.keys(PENDIENTES)) {
  if (!fs.existsSync(path.join(ROOT, pendiente))) {
    fallas.push(`${pendiente} ya no existe: saca su entrada de PENDIENTES.`);
  }
}

if (fallas.length) {
  console.error('Datos públicos con problemas:\n- ' + fallas.join('\n- '));
  process.exit(1);
}

console.log(`Datos públicos auditados: ${BLOQUEOS.length} bloqueos en vercel.json y ${revisados} archivos servidos sin RUT (${Object.keys(PENDIENTES).length} pendiente: ${Object.keys(PENDIENTES).join(', ')}).`);
