'use strict';
// Pruebas ficticias: no consulta ni modifica Firebase y no imprime identidades.
const assert = require('node:assert/strict');
const { measure, buildRows, summary, platformStatus, meaningful, renderHtml, csvCell } = require('./export-nm4-informes-review');
const { ROWS } = require('../api/_roster_nm4_informe');
const dirs = { industrial:'industrial', automotriz:'automotriz', electrica:'tecnico', electronica:'electronica', mecanica:'mecanica' };
const fields = version => require(`../nm4/u3-clase6-informe-${dirs[version]}/informe/campos`);
function answers(version, count) {
  const f = fields(version), required = new Set(f.activity.requiredForSubmit || f.questions.map(q=>q.id));
  return Object.fromEntries(f.questions.filter(q=>required.has(q.id)).slice(0,count).map(q=>[q.id,
    q.type==='select' ? q.options[0] : q.type==='number' ? '0' : q.type==='date' ? '2026-10-05' : q.type==='textarea' ? 'Descripción ficticia extensa de la evidencia para comprobar el cómputo del campo.' : 'Dato ficticio'
  ]));
}
for (const version of Object.keys(dirs)) {
  const expected = fields(version).activity.requiredForSubmit?.length || 27;
  const m = measure(version,{answers:answers(version,expected)});
  assert.equal(m.expectedCount,expected);
  assert.equal(m.validCount,expected);
  assert.equal(m.baseGrade,7);
  assert.equal(measure(version,null).baseGrade,1);
}
assert.equal(measure('electronica',{answers:answers('electronica',10)}).baseGrade,3);
assert.equal(measure('electronica',{answers:answers('electronica',11)}).baseGrade,5);
assert.equal(measure('electronica',{answers:answers('electronica',16)}).baseGrade,5);
assert.equal(measure('electronica',{answers:answers('electronica',17)}).baseGrade,7);
const adjusted = measure('electronica',{answers:answers('electronica',17)},{h2Efecto:0.5});
assert.equal(adjusted.units,16.5);
assert.equal(adjusted.baseGrade,5);
assert.equal(adjusted.validCount,16);
assert.throws(()=>measure('electronica',null,{desconocido:0.5}));
assert.throws(()=>measure('electronica',null,{h2Efecto:2}));
const header = measure('electronica',{answers:{emision:'2026-10-05',especialidad:'Electrónica'}});
assert.equal(header.hasWork,true);
assert.equal(header.units,0);
assert.equal(header.baseGrade,1);
assert.equal(meaningful('0'),true);
assert.equal(meaningful('...'),false);
assert.equal(meaningful('pendiente'),false);
assert.equal(meaningful('aaaaaaaaaaaa'),false);
assert.equal(platformStatus({submitted:true,completada:true}),'Entregado');
assert.equal(platformStatus({submitted:true,completada:false}),'Marca de entrega inconsistente');
assert.equal(platformStatus({submitted:false,completada:false}),'Borrador sin entregar');
assert.equal(platformStatus(null),'Sin registro');
const pair = 'pair_4ETP_001__4ETP_002';
const snapshots = {electronica:{_claims:{'4ETP':{1:pair,2:pair}},_teams:{[pair]:{
  team:[{curso:'4ETP',n:1},{curso:'4ETP',n:2}],answers:answers('electronica',20),submitted:true,completada:true
}},'4ETP':[null,{answers:answers('electronica',5)}]}};
const rows = buildRows(snapshots,null);
assert.equal(rows.length,ROWS.filter(r=>['4ATP','4BTP','4CTP','4ETP'].includes(r[1])).length);
assert.equal(new Set(rows.map(r=>r.id)).size,rows.length);
assert.equal(rows.find(r=>r.id==='4ETP-01').source,rows.find(r=>r.id==='4ETP-02').source);
const e = summary(rows).find(r=>r.course==='4ETP');
assert.equal(e.delivered,2);
assert.equal(e.submittedWorks,1);
assert.equal(e.noEvidence,37);
assert.equal(rows.find(r=>r.id==='4ETP-03').hasWork,false);
const history = buildRows({electrica:{'4ETP':{34:{answers:answers('electrica',13)}}}},null).find(r=>r.id==='4ETP-34');
assert.equal(history.currentStatus,'Sin registro');
assert.equal(history.reviewedVersion,'electrica');
assert.equal(history.baseGrade,3);
assert.equal(history.answers.tensionFuente,undefined);
const restored = buildRows({electronica:{_pairBackups:{[pair]:{'4ETP_001':{answers:answers('electronica',11)}}}}},null).find(r=>r.id==='4ETP-01');
assert.equal(restored.sourceKind,'respaldo individual');
assert.equal(restored.baseGrade,5);
assert.equal(csvCell('=1+1'),'"\'=1+1"');
assert.equal(csvCell('Texto; con "comillas"'),'"Texto; con ""comillas"""');
const html = renderHtml([{...rows[0],name:'<script>prueba</script>',feedback:'<img src=x>'}],{fetchedAtLocal:'Prueba ficticia'});
assert.ok(!html.includes('<script>prueba</script>'));
assert.ok(html.includes('&lt;img src=x&gt;'));
console.log('PASS: escala, límites, intentos, opcionales, marcas de entrega, parejas, nulos, históricos, respaldos y escape HTML/CSV; sin escrituras académicas.');
