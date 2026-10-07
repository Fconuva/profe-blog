const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '../dashboard/index.html'), 'utf8');
function functionSource(name) {
  const start = html.indexOf('        function ' + name + '(');
  assert.ok(start >= 0, name);
  const close = html.slice(start).match(/^        }\s*$/m);
  assert.ok(close, name);
  return html.slice(start, start + close.index + close[0].length);
}
function fixture(portfolio) {
  const nodes = {};
  const context = {
    portData: structuredClone(portfolio),
    document: { getElementById(id) {
      return nodes[id] ||= { classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {}, removeAttribute() {}, focus() {}, scrollIntoView() {} };
    } }
  };
  vm.createContext(context);
  ['modulosContratados', 'setModuloFieldError', 'clearModuloValidation', 'validateModulosFields'].forEach(name => vm.runInContext(functionSource(name), context));
  return context;
}
function scope(portfolio) {
  return JSON.parse(JSON.stringify(fixture(portfolio).modulosContratados()));
}
const valid = { modulo2: { duracionBloque: 45, restricciones: 'Sala amplia con mesas organizadas en grupos.', tipoClase: 'participativa' }, modulo3: { tieneExperiencia: 'no', colaborador: 'Docente de apoyo' } };

test('cada plan antiguo sin indicadores conserva su alcance', () => {
  const plans = { completo: [true,true,true], modulo1: [true,false,false], modulo2: [false,true,false], modulo3: [false,false,true], m1m2: [true,true,false], m1m3: [true,false,true], m2m3: [false,true,true] };
  for (const [plan, expected] of Object.entries(plans)) assert.deepEqual(Object.values(scope({plan})), expected, plan);
});
test('indicadores explícitos prevalecen y el plan completa indicadores ausentes', () => {
  assert.deepEqual(scope({plan:'completo', modulo1:{contratado:true}, modulo2:{contratado:false}, modulo3:{contratado:false}}), {m1:true,m2:false,m3:false});
  assert.deepEqual(scope({plan:'m1m2', modulo2:{contratado:false}}), {m1:true,m2:false,m3:false});
  assert.deepEqual(scope({modulo1:{contratado:false}, modulo2:{contratado:false}, modulo3:{contratado:false}}), {m1:false,m2:false,m3:false});
  assert.deepEqual(scope({modulo2:{contratado:true}}), {m1:false,m2:true,m3:false});
});
test('preinscripción sin alcance conocido conserva las tres preferencias', () => {
  for (const plan of [undefined, 'pre-inscripcion', 'desconocido', 'toString']) assert.deepEqual(scope({plan}), {m1:true,m2:true,m3:true});
});
test('M1 puede finalizar sin respuestas M2/M3, tanto con plan antiguo como con indicadores actuales', () => {
  for (const portfolio of [{plan:'modulo1'}, {plan:'modulo1', modulo1:{contratado:true}, modulo2:{contratado:false}, modulo3:{contratado:false}}]) {
    const c = {modulo1:{oa:'OA de prueba'}};
    const before = structuredClone(c);
    assert.equal(fixture(portfolio).validateModulosFields(c), true);
    assert.deepEqual(c, before);
  }
});
test('planes activos siguen exigiendo duración, sala, Otro y colaborador', () => {
  for (const plan of ['modulo2', 'm1m2', 'm2m3', 'completo']) {
    for (const change of [{duracionBloque:0}, {duracionBloque:29}, {restricciones:'breve'}, {tipoClase:'otro'}]) {
      const c = structuredClone(valid); Object.assign(c.modulo2, change);
      assert.equal(fixture({plan}).validateModulosFields(c), false, plan + JSON.stringify(change));
    }
  }
  for (const plan of ['modulo3', 'm1m3', 'm2m3', 'completo']) {
    const c = structuredClone(valid); c.modulo3.colaborador = '';
    assert.equal(fixture({plan}).validateModulosFields(c), false, plan);
    for (const tieneExperiencia of ['si', 'programa']) {
      c.modulo3 = {colaborador:'Docente de apoyo', tieneExperiencia, descripcionExperiencia:'breve'};
      assert.equal(fixture({plan}).validateModulosFields(c), false, plan);
    }
  }
});
test('todos los planes aceptan respuestas válidas y validar no modifica un borrador oculto', () => {
  for (const plan of ['modulo1', 'modulo2', 'modulo3', 'm1m2', 'm1m3', 'm2m3', 'completo']) {
    const c = structuredClone(valid), before = structuredClone(c);
    assert.equal(fixture({plan}).validateModulosFields(c), true, plan);
    assert.deepEqual(c, before);
  }
});
