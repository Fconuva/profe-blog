'use strict';
// La pauta de avance valora intentos guardados; no cambia respuestas ni entregas.
const CONFIG = {
  industrial: ['informe_industrial_2026', 'industrial', ['4ATP']],
  automotriz: ['informe_automotriz_2026', 'automotriz', ['4BTP']],
  electrica: ['informe_tecnico_2026', 'tecnico', ['4CTP', '4ETP']],
  electronica: ['informe_electronica_2026', 'electronica', ['4ETP']],
  mecanica: ['informe_mecanica_2026', 'mecanica', ['4ATP', '4BTP']]
};
const CURRENT = {"4ATP":'industrial',"4BTP":'automotriz',"4CTP":'electrica',"4ETP":'electronica'};
const schema = version => require(`../nm4/u3-clase6-informe-${CONFIG[version][1]}/informe/campos`);
function meaningful(value) {
  const text = String(value ?? '').trim();
  return Boolean(text && !/^(?:[.\-_?\s]+|no s[eé]|nose|nada|ningun[oa]|pendiente|no aplica|sin respuesta)$/i.test(text) && !/^(.)\1{5,}$/.test(text));
}
function measure(version, record) {
  const fields = schema(version), answers = fields.sanitize(record?.answers || {});
  const required = new Set(fields.activity.requiredForSubmit || fields.questions.map(q=>q.id));
  const expected = fields.questions.filter(q=>required.has(q.id) && !['emision','especialidad','declaracion'].includes(q.id));
  const done = expected.filter(q=>meaningful(answers[q.id])).length;
  const completion = expected.length ? done/expected.length : 0;
  return {done,total:expected.length,completion,grade:done===0?null:completion<=.5?3:completion<.85?5:7};
}
function evidence(student, snapshots) {
  const all = [];
  for (const [version,config] of Object.entries(CONFIG)) {
    if (!config[2].includes(student.course)) continue;
    const data = snapshots[version] || {}, claim = data._claims?.[student.course]?.[student.n];
    const activeKey = typeof claim==='string' && claim.startsWith('pair_') ? `_teams/${claim}` : `${student.course}/${student.n}`;
    const add = (record,key) => {
      if (!record || typeof record!=='object') return;
      all.push({...measure(version,record),active:version===CURRENT[student.course]&&key===activeKey,updatedAt:Number(record.updatedAt)||0});
    };
    add(data[student.course]?.[student.n],`${student.course}/${student.n}`);
    for (const [key,record] of Object.entries(data._teams || {})) {
      // Una clave de pareja sin identidad comprobable nunca atribuye trabajo.
      if ((Array.isArray(record?.team)?record.team:[]).some(m=>m.curso===student.course&&Number(m.n)===student.n)) add(record,`_teams/${key}`);
    }
    for (const [key,backups] of Object.entries(data._pairBackups || {})) {
      const memberKey = `${student.course}_${String(student.n).padStart(3,'0')}`;
      add(backups?.[memberKey],`_pairBackups/${key}/${memberKey}`);
    }
  }
  return all.sort((a,b)=>b.completion-a.completion||Number(b.active)-Number(a.active)||b.updatedAt-a.updatedAt)[0] || {done:0,total:0,completion:0,grade:null};
}
module.exports={CONFIG,CURRENT,measure,meaningful,evidence};
