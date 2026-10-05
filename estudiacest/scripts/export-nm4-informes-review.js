'use strict';
// Revisión privada, exclusivamente de lectura. Nunca cambia entregas ni notas.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { ROWS } = require('../api/_roster_nm4_informe');
const { getAccessToken, requestJson } = require('./firebase-maintenance-db');
const ROOT = path.resolve(__dirname, '..');
const REPO = path.resolve(ROOT, '..');
const COURSES = { '4ATP': 'industrial', '4BTP': 'automotriz', '4CTP': 'electrica', '4ETP': 'electronica' };
const CONFIG = {
  industrial: ['informe_industrial_2026', 'industrial', ['4ATP']],
  automotriz: ['informe_automotriz_2026', 'automotriz', ['4BTP']],
  electrica: ['informe_tecnico_2026', 'tecnico', ['4CTP', '4ETP']],
  electronica: ['informe_electronica_2026', 'electronica', ['4ETP']],
  mecanica: ['informe_mecanica_2026', 'mecanica', ['4ATP', '4BTP']]
};
const ROSTER = ROWS.filter(row => COURSES[row[1]]).map(([, course, n, name]) => ({ course, n, name }));
const sha = value => crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const csvCell = value => {
  const text = String(value ?? '');
  return '"' + (/^[\s]*[=+@-]/.test(text) ? "'" : '') + text.replace(/"/g, '""') + '"';
};
const date = ms => ms ? new Intl.DateTimeFormat('es-CL', { timeZone:'America/Santiago', dateStyle:'short', timeStyle:'short' }).format(new Date(Number(ms))) : 'Sin registro';
function schema(version) { return require(`../nm4/u3-clase6-informe-${CONFIG[version][1]}/informe/campos`); }
function meaningful(value) {
  const text = String(value ?? '').trim();
  return Boolean(text && !/^(?:[.\-_?\s]+|no s[eé]|no se|nose|nada|ningun[oa]|pendiente|no aplica|sin respuesta)$/i.test(text) && !/^(.)\1{5,}$/.test(text));
}
function measure(version, record, reviewedUnits = {}) {
  const fields = schema(version);
  const answers = fields.sanitize(record?.answers || {});
  const required = new Set(fields.activity.requiredForSubmit || fields.questions.map(q => q.id));
  const expected = fields.questions.filter(q => required.has(q.id));
  for (const [id, unit] of Object.entries(reviewedUnits)) {
    assert.ok(expected.some(q => q.id === id), 'El ajuste debe corresponder a un campo exigido.');
    assert.ok([0, 0.5, 1].includes(unit), 'Las unidades revisadas deben ser 0, 0.5 o 1.');
  }
  const unit = q => reviewedUnits[q.id] ?? (meaningful(answers[q.id]) && fields.isComplete(q, answers[q.id]) ? 1 : meaningful(answers[q.id]) ? 0.5 : 0);
  const valid = q => unit(q) === 1;
  const units = expected.reduce((sum, q) => sum + unit(q), 0);
  const completion = units / expected.length;
  const baseGrade = completion <= 0 ? 1 : completion <= 0.5 ? 3 : completion < 0.85 ? 5 : 7;
  const written = fields.questions.filter(q => q.type === 'textarea');
  return { answers, validCount:expected.filter(valid).length, expectedCount:expected.length, units, completion, baseGrade,
    allValid:fields.questions.filter(valid).length, allCount:fields.questions.length,
    writing:written.filter(q => meaningful(answers[q.id])).length, writingTotal:written.length,
    missing:expected.filter(q => !valid(q)).map(q => q.label),
    presentSections:[...new Set(fields.questions.filter(valid).map(q => q.section))],
    hasWork:Object.values(answers).some(meaningful) };
}
function delivered(record) { return record?.submitted === true && record?.completada === true; }
function platformStatus(record) {
  if (!record) return 'Sin registro';
  if (delivered(record)) return 'Entregado';
  if (record.submitted === true || record.completada === true || record.status === 'submitted') return 'Marca de entrega inconsistente';
  return 'Borrador sin entregar';
}
function candidates(student, snapshots) {
  const found = [];
  for (const [version, config] of Object.entries(CONFIG)) {
    if (!config[2].includes(student.course)) continue;
    const data = snapshots[version] || {};
    const claim = data._claims?.[student.course]?.[student.n];
    const activeKey = typeof claim === 'string' && claim.startsWith('pair_') ? `_teams/${claim}` : `${student.course}/${student.n}`;
    const add = (record, key, kind) => {
      if (!record || typeof record !== 'object') return;
      const metrics = measure(version, record);
      const active = version === COURSES[student.course] && key === activeKey;
      found.push({ version, key, kind, record, metrics, active, shared:key.startsWith('_teams/'), sourceId:`${version}/${key}` });
    };
    add(data[student.course]?.[student.n], `${student.course}/${student.n}`, 'individual');
    for (const [key, record] of Object.entries(data._teams || {})) {
      if ((record?.team || []).some(m => m.curso === student.course && Number(m.n) === student.n)) add(record, `_teams/${key}`, 'pareja');
      else if (key === claim) throw new Error(`Pareja sin identidad verificable: ${student.course}/${student.n}`);
    }
    for (const [key, backups] of Object.entries(data._pairBackups || {})) {
      const memberKey = `${student.course}_${String(student.n).padStart(3, '0')}`;
      add(backups?.[memberKey], `_pairBackups/${key}/${memberKey}`, 'respaldo individual');
    }
  }
  return found;
}
function buildRows(snapshots, overrides) {
  return ROSTER.map(student => {
    const all = candidates(student, snapshots);
    const active = all.find(x => x.active);
    const productive = all.filter(x => x.metrics.hasWork);
    // No fusionar respuestas de distintos casos. Conservar todas las fuentes.
    const selected = productive.sort((a,b) => b.metrics.completion-a.metrics.completion || Number(b.active)-Number(a.active) || Number(b.record.updatedAt||0)-Number(a.record.updatedAt||0))[0] || active;
    const id = `${student.course}-${String(student.n).padStart(2,'0')}`;
    const metrics = measure(selected?.version || COURSES[student.course], selected?.record, overrides?.[id]?.unitsByField);
    const grade = overrides?.[id]?.grade ?? metrics.baseGrade;
    assert.ok([1,3,5,7].includes(grade));
    const flags = [];
    if (!metrics.hasWork) flags.push('Sin evidencia guardada: validar asistencia, licencia o entrega por otra vía antes de asentar un 1,0.');
    else if (metrics.units === 0) flags.push('Solo se guardó identificación; no hay desarrollo de los campos exigidos. El 1,0 es provisional: comprobar asistencia o trabajo por otra vía.');
    if (selected && !selected.active) flags.push(`Se considera evidencia conservada en ${selected.version} (${selected.kind}), sin presentarla como entrega de la versión vigente.`);
    if (active && !delivered(active.record) && metrics.hasWork && ['4CTP','4ETP'].includes(student.course)) flags.push('Avance incluido en la revisión pese a no tener entrega confirmada; no se rebaja por el fallo del botón.');
    if (active && platformStatus(active.record).includes('inconsistente')) flags.push('Revisar ambas marcas; no se cambió el estado en la plataforma.');
    const names = selected?.record.team?.filter(m => m.curso===student.course).map(m => ROSTER.find(r => r.course===m.curso && r.n===Number(m.n))?.name).filter(Boolean) || [];
    const positive = metrics.writing ? `Hay escritura guardada en ${metrics.writing} de ${metrics.writingTotal} apartados y ${metrics.validCount} de ${metrics.expectedCount} campos exigidos válidos.` : metrics.hasWork ? `Hay datos o selecciones guardados: ${metrics.validCount} de ${metrics.expectedCount} campos exigidos válidos.` : 'No se encuentra una respuesta con contenido en las fuentes revisadas.';
    const next = metrics.missing.length ? `Completar o revisar primero: ${metrics.missing.slice(0,3).join('; ')}.` : 'Releer la coherencia de los hallazgos y la conclusión; conservar el texto y confirmar la entrega cuando el sistema lo permita.';
    return { id, ...student, currentVersion:COURSES[student.course], currentStatus:platformStatus(active?.record),
      reviewedVersion:selected?.version || COURSES[student.course], source:selected?.sourceId || '', sourceKind:selected?.kind || 'Sin evidencia',
      workMode:selected?.shared ? 'Pareja' : 'Individual', partners:names.filter(n => n!==student.name), grade, reviewed:Boolean(overrides?.[id]), gradeStatus:overrides?.[id] ? (grade === 1 ? 'Revisada · 1,0 provisional' : 'Revisada') : 'Propuesta pendiente de revisión de contenido',
      ...metrics, savedAt:selected?.record.updatedAt || 0, submittedAt:active?.record.submittedAt || 0,
      flags, feedback:overrides?.[id]?.note || `${positive} ${next}`,
      allSources:all.map(c=>({version:c.version,source:c.sourceId,kind:c.kind,active:c.active,status:platformStatus(c.record),completion:c.metrics.completion,answers:c.metrics.answers})) };
  });
}
function summary(rows) {
  return Object.keys(COURSES).map(course => {
    const students = rows.filter(r => r.course===course);
    const activeSources = new Set(students.filter(r=>r.currentStatus==='Entregado').flatMap(r=>r.allSources.filter(s=>s.active).map(s=>s.source)));
    return { course, students:students.length, delivered:students.filter(r=>r.currentStatus==='Entregado').length,
      submittedWorks:activeSources.size, draftsWithWork:students.filter(r=>r.currentStatus!=='Entregado'&&r.hasWork).length,
      noEvidence:students.filter(r=>!r.hasWork).length, rescuedSources:students.filter(r=>r.hasWork&&!r.allSources.find(s=>s.active&&s.source===r.source)).length,
      grades:Object.fromEntries([7,5,3,1].map(g=>[g,students.filter(r=>r.grade===g).length])) };
  });
}
function renderHtml(rows, meta) {
  const summaries = summary(rows);
  const table = group => `<table><thead><tr><th>N°</th><th>Estudiante</th><th>Estado vigente</th><th>Trabajo revisado</th><th>Laboriosidad</th><th>Evidencia y siguiente paso</th></tr></thead><tbody>${group.map(r=>`<tr data-course="${r.course}" data-grade="${r.grade}" data-status="${esc(r.currentStatus)}"><td>${r.n}</td><td>${esc(r.name)}${r.partners.length?`<small>Pareja: ${esc(r.partners.join(' / '))}</small>`:''}</td><td>${esc(r.currentStatus)}</td><td>${esc(r.reviewedVersion)} · ${esc(r.sourceKind)}<small>${r.validCount}/${r.expectedCount} exigidos válidos · ${Math.round(r.completion*100)} % · ${r.allValid}/${r.allCount} totales</small><small>${esc(date(r.savedAt))}</small></td><td><b>${r.grade},0</b><small>${esc(r.gradeStatus)}</small></td><td>${esc(r.feedback)}${r.flags.map(f=>`<small class="warn">${esc(f)}</small>`).join('')}<details><summary>Leer respuestas y otras fuentes</summary>${r.allSources.map(s=>`<h4>${esc(s.version)} · ${esc(s.kind)} · ${esc(s.status)}${s.active?' · vigente':''}</h4><dl>${schema(s.version).questions.map(q=>`<dt>${esc(q.label)}</dt><dd>${esc(s.answers[q.id]||'— Sin respuesta —')}</dd>`).join('')}</dl>`).join('')||'Sin contenido guardado.'}</details></td></tr>`).join('')}</tbody></table>`;
  return `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Informes NM4 · Entregas y laboriosidad</title><style>body{font:15px Arial,sans-serif;color:#173347;max-width:1500px;overflow-wrap:anywhere;margin:2rem auto;padding:0 1rem}h1{font-size:1.8rem}nav{display:flex;gap:1rem;flex-wrap:wrap}table{border-collapse:collapse;width:100%;margin:1rem 0 2rem}th,td{border:1px solid #bbc8d0;padding:.65rem;text-align:left;vertical-align:top}th{background:#eff4f6}small{display:block;font-size:.82rem;line-height:1.4;margin-top:.4rem}.warn{color:#785023}details{margin-top:.8rem}summary{cursor:pointer}dt{font-weight:bold;margin-top:.8rem}dd{margin:.2rem 0;white-space:pre-wrap}.wrap{overflow:auto}.notice{background:#eff4f6;padding:1rem;line-height:1.5}input,select{padding:.5rem;margin:.5rem}h2{margin-top:2rem}@media print{nav,.filters,details{display:none}body{font-size:10pt;margin:0}h2{break-before:page}tr{break-inside:avoid}th{background:white}}</style><h1>Informes de 4°A, 4°B, 4°C y 4°E TP</h1><p>Lectura de producción: ${esc(meta.fetchedAtLocal)}. Informe privado del docente. No se modificaron entregas ni calificaciones.</p><div class="notice"><b>Laboriosidad 7–5–3–1:</b> 7: al menos 85 % del trabajo esperado; 5: más de 50 % y menos de 85 %; 3: avance de hasta 50 %; 1: sin desarrollo de los campos exigidos (incluye identificación sin respuestas), provisional hasta comprobar asistencia o trabajo por otra vía. Los campos opcionales no rebajan la nota. Un campo válido suma una unidad y un intento significativo todavía incompleto media unidad. La revisión de contenido distingue respuestas, intentos incompletos y texto situado en un apartado que no responde a la pregunta. No es una nota de exactitud técnica ni una sanción por el botón de entrega. Se conserva la mejor evidencia de cada informe sin mezclar casos.</div><nav>${summaries.map(s=>`<a href="#${s.course}">${s.course}</a>`).join('')}<a href="nomina_completa.csv">Planilla completa CSV</a></nav><div class="wrap"><table><tr><th>Curso</th><th>Nómina</th><th>Estudiantes entregados</th><th>Informes entregados</th><th>Sin entregar con trabajo revisable</th><th>Sin evidencia</th><th>7 / 5 / 3 / 1</th></tr>${summaries.map(s=>`<tr><td>${s.course}</td><td>${s.students}</td><td>${s.delivered}</td><td>${s.submittedWorks}</td><td>${s.draftsWithWork}</td><td>${s.noEvidence}</td><td>${[7,5,3,1].map(g=>s.grades[g]).join(' / ')}</td></tr>`).join('')}</table></div><div class="filters"><label>Buscar <input id="search" placeholder="Nombre, curso o estado"></label><label>Nota <select id="grade"><option value="">Todas</option>${[7,5,3,1].map(g=>`<option value="${g}">${g},0</option>`).join('')}</select></label></div>${summaries.map(s=>`<section id="${s.course}"><h2>${s.course} · ${s.delivered} estudiantes con entrega confirmada</h2><p>${s.draftsWithWork} sin entrega con trabajo revisable. ${s.noEvidence} sin evidencia. Las parejas cuentan como un informe y dos estudiantes.</p><a href="${s.course}.csv">Descargar nómina de este curso</a><div class="wrap">${table(rows.filter(r=>r.course===s.course))}</div></section>`).join('')}<script>function filter(){const text=document.getElementById('search').value.toLocaleLowerCase('es'),grade=document.getElementById('grade').value;document.querySelectorAll('tr[data-grade]').forEach(row=>row.hidden=!(row.dataset.course+' '+row.textContent).toLocaleLowerCase('es').includes(text)||(grade&&row.dataset.grade!==grade))}document.getElementById('search').addEventListener('input',filter);document.getElementById('grade').addEventListener('change',filter);</script></html>`;
}
function writeReports(out, rows, meta) {
  const fields = ['course','n','name','currentStatus','reviewedVersion','sourceKind','workMode','partners','validCount','expectedCount','completion','grade','gradeStatus','feedback','flags'];
  const labels = ['Curso','N°','Estudiante','Estado vigente','Versión revisada','Fuente','Modalidad','Compañero/a','Campos válidos','Campos exigidos','Avance','Nota laboriosidad','Revisión','Observación','Incidencias'];
  const csv = list => '\ufeff'+[labels.map(csvCell).join(';'),...list.map(r=>fields.map(f=>csvCell(Array.isArray(r[f])?r[f].join(' | '):r[f])).join(';'))].join('\r\n');
  fs.writeFileSync(path.join(out,'nomina_completa.csv'),csv(rows));
  for (const course of Object.keys(COURSES)) fs.writeFileSync(path.join(out,course+'.csv'),csv(rows.filter(r=>r.course===course)));
  fs.writeFileSync(path.join(out,'revision.json'),JSON.stringify({meta,summary:summary(rows),rows},null,2));
  fs.writeFileSync(path.join(out,'revision.html'),renderHtml(rows,meta));
}
async function main() {
  const arg = key => { const n=process.argv.indexOf(key);return n>=0?process.argv[n+1]:null; };
  const destination = arg('--out');
  if (!destination) throw new Error('Especificar --out fuera del repositorio para conservar los datos privados.');
  const out=path.resolve(destination);
  const relative = path.relative(REPO, out);
  if (!relative || (!relative.startsWith('..'+path.sep) && relative!=='..' && !path.isAbsolute(relative))) throw new Error('Los informes privados no pueden guardarse en el repositorio.');
  const snapshotPath=arg('--snapshot');const overridePath=arg('--review');
  let snapshots, meta;
  if (snapshotPath) ({snapshots,meta}=JSON.parse(fs.readFileSync(snapshotPath,'utf8')));
  else {
    const token=getAccessToken();const entries=await Promise.all(Object.entries(CONFIG).map(async([version,[base,dir]])=>{
      const health=await fetch(`https://www.estudiacest.com/api/economista?modulo=informe-tecnico&version=${version}&action=health`);
      assert.equal(health.status,200);const info=await health.json();assert.equal(info.activity,schema(version).activity.sessionId);assert.equal(info.campos,schema(version).questions.length);
      const rel=`nm4/u3-clase6-informe-${dir}/informe/campos.js`;const publicFields=await fetch('https://www.estudiacest.com/'+rel);assert.equal(publicFields.status,200);assert.equal(sha(await publicFields.text()),sha(fs.readFileSync(path.join(ROOT,rel),'utf8')));
      return [version,await requestJson('GET','plataforma_nm4/'+base,token)||{}];
    }));
    snapshots=Object.fromEntries(entries);meta={fetchedAt:new Date().toISOString(),fetchedAtLocal:date(Date.now()),source:'estudiacest-default-rtdb / plataforma_nm4',checksum:sha(snapshots),versions:Object.keys(CONFIG),readOnly:true};
  }
  const overrides=overridePath?JSON.parse(fs.readFileSync(overridePath,'utf8')):null;
  if (overrides) {
    const ids = new Set(ROSTER.map(s => `${s.course}-${String(s.n).padStart(2,'0')}`));
    for (const [id, decision] of Object.entries(overrides)) {
      assert.ok(ids.has(id), 'La revisión contiene un identificador ajeno a la nómina.');
      assert.ok(decision && [1,3,5,7].includes(decision.grade), 'La decisión debe incluir una nota 7, 5, 3 o 1.');
      assert.ok(!decision.note || typeof decision.note === 'string', 'La observación debe ser texto.');
    }
  }
  const rows=buildRows(snapshots,overrides);assert.equal(rows.length,ROSTER.length);assert.equal(new Set(rows.map(r=>r.id)).size,rows.length);
  fs.mkdirSync(out,{recursive:true});
  if (!snapshotPath) fs.writeFileSync(path.join(out,'snapshot_privado.json'),JSON.stringify({meta,snapshots},null,2),{flag:'wx'});
  writeReports(out,rows,meta);
  console.log(JSON.stringify({out,checksum:meta.checksum,summary:summary(rows),students:rows.length,reviewed:rows.filter(r=>r.reviewed).length,readOnly:true}));
}
if(require.main===module) main().catch(error=>{console.error(error.message);process.exitCode=1});
module.exports={measure,candidates,buildRows,summary,platformStatus,meaningful,renderHtml,csvCell};
