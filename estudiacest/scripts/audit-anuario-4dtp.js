const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const failures = [];

function read(relativePath) {
  const filePath = path.join(ROOT, ...relativePath.split('/'));
  if (!fs.existsSync(filePath)) {
    failures.push(`Falta ${relativePath}`);
    return '';
  }
  return fs.readFileSync(filePath, 'utf8');
}

function requireText(contents, marker, label) {
  if (!contents.includes(marker)) failures.push(`${label} no contiene: ${marker}`);
}

function requireOwnedStorageCheck(contents, functionName) {
  const start = contents.indexOf(`async function ${functionName}`);
  const end = contents.indexOf('\nasync function ', start + 1);
  const body = start >= 0 ? contents.slice(start, end >= 0 ? end : undefined) : '';
  if (!body.includes("startsWith(`${STORAGE_PREFIX}/${student.rut}/`)")) {
    failures.push(`${functionName} no valida la carpeta propietaria del estudiante.`);
  }
}

function validRut(rut) {
  const body = rut.slice(0, -1);
  const expected = rut.slice(-1);
  let sum = 0;
  let multiplier = 2;
  for (let index = body.length - 1; index >= 0; index -= 1) {
    sum += Number(body[index]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const value = 11 - (sum % 11);
  const checkDigit = value === 11 ? '0' : value === 10 ? 'K' : String(value);
  return expected === checkDigit;
}

function checkSyntax(relativePath) {
  const result = spawnSync(process.execPath, ['--check', relativePath], { cwd: ROOT, encoding: 'utf8' });
  if (result.status !== 0) failures.push(`${relativePath} tiene error de sintaxis: ${result.stderr.trim()}`);
}

const api = read('api/anuario-4dtp.js');
const app = read('4dtp/app.js');
const page = read('4dtp/index.html');
const admin = read('4dtp/admin.html');
const storageRules = read('storage.rules');
const portal = read('index.html');
const archived = read('3atp/index.html');
const vercel = JSON.parse(read('vercel.json') || '{}');

try {
  const apiModule = { exports: {} };
  vm.runInNewContext(`${api}\nmodule.exports.__quotaTest = { MAX_STUDENT_STORAGE, uploadValidation, uploadFitsStudentQuota };`, {
    require,
    module: apiModule,
    exports: apiModule.exports,
    process,
    console,
    Buffer,
    URL,
    setTimeout,
    clearTimeout
  }, { filename: 'api/anuario-4dtp.js' });
  const { MAX_STUDENT_STORAGE, uploadValidation, uploadFitsStudentQuota } = apiModule.exports.__quotaTest;
  const GB = 1024 * 1024 * 1024;
  if (MAX_STUDENT_STORAGE !== 3 * GB) failures.push('La cuota efectiva no equivale a 3 GB por estudiante.');
  if (uploadValidation({ fileId: 'archivo_grande_01', name: 'video.mp4', size: 2 * GB, category: 'other', slot: 0, contentType: 'video/mp4' })) {
    failures.push('La API rechaza un archivo válido por un límite individual fijo.');
  }
  const fullRecord = {
    files: {
      audioAnterior: { id: 'audioAnterior', size: GB },
      material: { id: 'material', size: 2 * GB }
    },
    interviews: [{ slot: 1, audioFileId: 'audioAnterior' }],
    uploadReservations: {}
  };
  if (uploadFitsStudentQuota(fullRecord, { category: 'other', slot: 0, size: 1 })) failures.push('La cuota acumulada permite superar 3 GB.');
  if (!uploadFitsStudentQuota(fullRecord, { category: 'interview_audio', slot: 1, size: GB })) failures.push('El reemplazo de un audio no descuenta el archivo anterior.');
  const reservedRecord = {
    files: { material: { id: 'material', size: 2 * GB } },
    interviews: [],
    uploadReservations: { pendiente: { size: GB / 2 } }
  };
  if (!uploadFitsStudentQuota(reservedRecord, { category: 'other', slot: 0, size: GB / 2 })) failures.push('La cuota rechaza una suma exacta de 3 GB.');
  if (uploadFitsStudentQuota(reservedRecord, { category: 'other', slot: 0, size: (GB / 2) + 1 })) failures.push('La cuota ignora bytes ya reservados.');
} catch (error) {
  failures.push(`No se pudo probar la cuota acumulada: ${error.message}`);
}

const roster = [...api.matchAll(/^\s*\['([0-9K]+)',\s*'([^']+)'\],?$/gm)].map(match => ({ rut: match[1], name: match[2] }));
if (roster.length !== 29) failures.push(`La nómina contiene ${roster.length} estudiantes; se esperaban 29.`);
if (new Set(roster.map(student => student.rut)).size !== roster.length) failures.push('Hay RUN duplicados en la nómina.');
for (const student of roster) {
  if (!validRut(student.rut)) failures.push(`RUN inválido en la nómina: ${student.rut}`);
}

requireText(api, "const INTERVIEW_TYPES = ['compañero', 'compañero', 'compañero', 'docente', 'docente'];", 'API');
requireText(api, "createCustomToken(`anuario_${student.rut}`", 'API');
requireText(api, "admin-save-evaluation", 'API');
requireText(api, "review-agent-list", 'API');
requireText(api, "hasStudentWork", 'API');
requireText(api, "ANUARIO_REVIEW_AGENT_HASH", 'API');
requireText(api, "teacherReview", 'API');
requireText(api, "MAX_STUDENT_STORAGE = 3 * 1024 * 1024 * 1024", 'API');
requireText(api, "usedBytes + reservedBytes + request.size <= MAX_STUDENT_STORAGE", 'API');
requireText(api, "uploadFitsStudentQuota(record, request)", 'API');
if (api.includes('MAX_FILE_SIZE')) failures.push('API conserva un límite fijo por archivo.');
requireText(api, "if (!Number.isInteger(request.size) || request.size <= 0)", 'API');
requireText(api, "handlePrepareUpload", 'API');
requireText(api, "uploadReservations", 'API');
requireText(api, "defaultWrittenProducts", 'API');
requireText(api, "submit-activity2", 'API');
requireText(api, "secondProgressGrade", 'API');
for (const handler of ['handleDeleteFile', 'handleFileUrl', 'handleReviewAgentFileUrl', 'handleAdminFileUrl']) {
  requireOwnedStorageCheck(api, handler);
}
requireText(app, "let saveChain = Promise.resolve(true)", 'Cliente');
requireText(app, "persistenceReady", 'Cliente');
requireText(app, "API_TIMEOUT_MS", 'Cliente');
requireText(app, "window.addEventListener('offline',updateNetworkStatus)", 'Cliente');
requireText(app, "Sin conexión a internet", 'Cliente');
requireText(app, "submitWriting", 'Cliente');
requireText(app, "renderTeacherReview", 'Cliente');
requireText(page, 'Documento editable · Actividad 1', 'Página 4DTP');
requireText(page, 'Productos escritos · Fase 1', 'Página 4DTP');
requireText(page, 'Trabajo del martes 25 de agosto', 'Página 4DTP');
requireText(page, 'Hoy debes dejar listas tus cinco entrevistas', 'Página 4DTP');
requireText(page, 'Las dos primeras ya están disponibles', 'Página 4DTP');
requireText(page, 'Textos → Memoria escolar', 'Página 4DTP');
requireText(page, '31 de octubre de 2026', 'Página 4DTP');
requireText(page, 'Revisión 1 · 4 de septiembre', 'Página 4DTP');
requireText(page, 'Revisión 2 · 25 de septiembre', 'Página 4DTP');
requireText(page, 'Ruta de producción hasta el 31 de octubre', 'Página 4DTP');
requireText(page, 'Retroalimentación', 'Página 4DTP');
// Las nueve secciones se anuncian en gris antes de abrir su formulario.
requireText(page, 'Las secciones del anuario', 'Página 4DTP');
requireText(admin, 'Calificación docente', 'Admin 4DTP');
requireText(admin, 'secondProgressGrade', 'Admin 4DTP');
requireText(admin, 'Productos escritos · Fase 1', 'Admin 4DTP');
requireText(admin, 'Retroalimentación visible', 'Admin 4DTP');
requireText(admin, 'reviewRecommendations', 'Admin 4DTP');
requireText(admin, 'Abrir carpeta', 'Admin 4DTP');
requireText(admin, 'data-open-folder-file', 'Admin 4DTP');
requireText(admin, "api('admin-file-url'", 'Admin 4DTP');
requireText(api, 'admin_scopes/anuario4dtp', 'API');
requireText(storageRules, "request.auth.token.anuario4dtp == true", 'Reglas Storage');
requireText(storageRules, "request.auth.uid == 'anuario_' + rut", 'Reglas Storage');
requireText(storageRules, 'request.auth.token.uploadFileId == fileId', 'Reglas Storage');
requireText(storageRules, 'request.auth.token.uploadFileName == fileName', 'Reglas Storage');
requireText(storageRules, 'request.resource.size <= request.auth.token.uploadMaxBytes', 'Reglas Storage');
if (storageRules.includes('request.resource.size <= 100 * 1024 * 1024')) failures.push('Storage conserva el límite antiguo de 100 MB por archivo.');
if (storageRules.includes('request.resource.size <= 3 * 1024 * 1024 * 1024')) failures.push('Storage aplica la cuota total como límite por archivo.');
if (app.includes('MAX_FILE_SIZE')) failures.push('Cliente conserva un límite fijo por archivo.');
requireText(app, 'storage:data.storage||', 'Cliente');
requireText(page, 'Cada estudiante dispone de 3 GB en total.', 'Página 4DTP');
requireText(page, 'Los 3 GB corresponden al total de tu carpeta, no a cada archivo.', 'Página 4DTP');
requireText(portal, 'href="/4dtp/"', 'Portada');
requireText(portal, 'href="/3atp/"', 'Portada');
requireText(archived, 'Proyecto archivado', 'Archivo 3ATP');

for (const student of roster) {
  if (page.includes(student.rut) || app.includes(student.rut)) failures.push(`El RUN ${student.rut} quedó expuesto en el cliente.`);
}

const heroPath = path.join(ROOT, '4dtp', 'assets', 'anuario-hero.webp');
if (!fs.existsSync(heroPath) || fs.statSync(heroPath).size < 100000) failures.push('La imagen principal del anuario falta o tiene baja resolución.');
for (const asset of ['ejemplo-portada-anuario.webp', 'ejemplo-entrevista-anuario.webp', 'ejemplo-memoria-anuario.webp', 'ejemplo-proyecto-grafica.webp', 'hojas-del-anuario-v2.webp']) {
  const assetPath = path.join(ROOT, '4dtp', 'assets', asset);
  if (!fs.existsSync(assetPath) || fs.statSync(assetPath).size < 100000) failures.push(`Falta el apoyo visual ${asset} o tiene baja resolución.`);
  if (!page.includes(`assets/${asset}`)) failures.push(`La página no utiliza el apoyo visual ${asset}.`);
}

const rewrites = Array.isArray(vercel.rewrites) ? vercel.rewrites : [];
if (!rewrites.some(rule => rule.source === '/4dtp/' && rule.destination === '/4dtp/index.html')) failures.push('Falta la ruta /4dtp/ en vercel.json.');

checkSyntax('api/anuario-4dtp.js');
checkSyntax('4dtp/app.js');

const inlineScripts = [...admin.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1].trim())
  .filter(Boolean);
for (const [index, script] of inlineScripts.entries()) {
  try { new vm.Script(script, { filename: `4dtp/admin.html#script-${index + 1}` }); }
  catch (error) { failures.push(`Admin 4DTP tiene error de sintaxis: ${error.message}`); }
}

if (failures.length) {
  console.error('\nAUDITORÍA ANUARIO 4DTP FALLIDA\n');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Anuario 4DTP auditado: ${roster.length} estudiantes, documentos, archivos, admin y reglas correctos.`);
