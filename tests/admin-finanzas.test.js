const test=require('node:test'), assert=require('node:assert/strict'), vm=require('node:vm');
const f=require('../admin/finanzas.js');
const {render,html}=require('./helpers/admin-dashboard.cjs');
const hoy='2026-09-10';
const agenda=(p,saldo=99990)=>f.agenda(p,{uid:'prueba',nombre:'Prueba',saldo},hoy);
test('respeta saldo cero, bajas y precios desconocidos',()=>{
 assert.equal(f.saldo({cartera:{saldo:0}},199990,0),0);
 assert.equal(f.saldo({},0,0),null);
 assert.equal(f.saldo({noCobrar:true,cartera:{saldo:99990}},199990,100000),0);
 assert.deepEqual(agenda({paymentStatus:'baja'}),[]);
});
test('la campaña no desplaza un acuerdo posterior ni fabrica promesas',()=>{
 const p={cartera:{tramoCobro:'cobrar_1_septiembre',proximoCobroFecha:'2026-09-01'},compromisoPago:{estado:'confirmado',pagos:[{fecha:'2026-09-30',monto:20000}]}};
 assert.equal(agenda(p,20000)[0].fecha,'2026-09-30');
 assert.equal(agenda({cartera:p.cartera})[0].bucket,'sin-fecha');
 p.cartera={tramoCobro:'fin_septiembre',proximoCobroFecha:'2026-09-15',actualizadoEn:'2026-09-10',estadoCobranza:'PROGRAMADO'};
 assert.equal(agenda(p,20000)[0].fecha,'2026-09-30');
});
test('acuerdo posterior sustituye cuotas antiguas y octubre tiene su tramo',()=>{
 const p={cartera:{actualizadoEn:'2026-09-09',estadoCobranza:'ESPERAR_CUOTA_ACORDADA',proximoCobroFecha:'2026-09-20',proximoCobroMonto:19990},compromisoPago:{estado:'confirmado',actualizadoEn:'2026-08-10',pagos:[{fecha:'2026-08-20',monto:30000},{fecha:'2026-08-31',monto:39990}]}};
 assert.equal(agenda(p,19990)[0].fecha,'2026-09-20');
 const cuotas={cartera:{cuotasAcordadas:[{estado:'pagada',fecha:'2026-09-05',monto:70000},{estado:'pendiente',fecha:'2026-10-05',monto:70000}]}};
 assert.equal(agenda(cuotas,70000)[0].bucket,'despues-septiembre');
 assert.equal(agenda(cuotas,70000).length,1);
});
test('pago reciente usa último abono del libro, no campos históricos',()=>{
 const p={paidAt:'2026-08-22',cartera:{fuentePago:'_gestion/LIBRO_DE_CAJA.jsonl',ultimoPagoFecha:'2026-09-09',estadoCobranza:'ESPERAR_PAGO_RECIENTE',proximoCobroFecha:'2026-09-21',proximoCobroMonto:100000}};
 assert.equal(agenda(p)[0].fecha,'2026-10-09');
 assert.equal(agenda(p)[0].estado,'calculado');
 assert.equal(agenda(p)[0].monto,99990);
});
test('antecedentes, identidad y plazo impreciso no son pago vencido',()=>{
 for(const p of [{seguimientoAntecedentes:{estado:'esperando_antecedentes',fechaCompromiso:'2026-09-11'}},{cartera:{revisionIdentidad:'pendiente'}},{compromisoPago:{estado:'fecha-incompleta',ventana:'Después del 18'}}]) {
  const e=agenda(p)[0];assert.equal(e.fecha,'');assert.equal(e.bucket,'sin-fecha');
 }
});
test('cada saldo se distribuye íntegro sin duplicar cuotas',()=>{
 const p={compromisoPago:{estado:'confirmado',pagos:[{fecha:'2026-09-20',monto:20000}]}};
 const e=agenda(p);assert.equal(e.reduce((s,x)=>s+x.monto,0),99990);assert.equal(e[1].monto,79990);assert.equal(e[1].bucket,'sin-fecha');
 p.compromisoPago.pagos=[{fecha:'2026-08-20',monto:50000},{fecha:'2026-09-20',monto:49990}];
 assert.equal(agenda(p,49990)[0].fecha,'2026-09-20');
});
test('dashboard conserva caja histórica, excluye bajas y no inventa precios',()=>{
 const p=(pagado,saldo)=>({plan:'completo',cartera:{fuentePago:'_gestion/LIBRO_DE_CAJA.jsonl',pagado,saldo,precio:199990}});
 const portfolios={a:p(100000,99990),b:p(0,0),c:{...p(100000,0),paymentStatus:'baja'},d:{...p(50000,0),noCobrar:true},e:p(0,79990)};
 const users=Object.fromEntries(['a','b','c','d','e','f'].map(k=>[k,{nombre:k,createdAt:'2026-08-01'}]));
 const {nodes,context}=render({users,portafolios:portfolios});
 assert.equal(context.window._resumenCarteraBruta.saldoTotal,179980);
 assert.equal(context.window._resumenCarteraBruta.personas,2);
 assert.match(nodes['stat-caja-historica'].textContent,/250.000/);
 assert.match(nodes['stat-valoracion'].textContent,/1 sin precio y 1 con saldo/);
 assert.equal(Object.values(context.window._agendaCobros).flat().reduce((s,e)=>s+e.monto,0),179980);
});
test('todos los scripts inline compilan',()=>{
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi))if(!/src=|ld\+json/.test(m[1]))new vm.Script(m[2]);
});
test('precio pendiente y ficha duplicada quedan fuera de la proyección sin perder a la persona',()=>{
 const p=(pagado,saldo)=>({plan:'completo',cartera:{fuentePago:'_gestion/LIBRO_DE_CAJA.jsonl',pagado,saldo,precio:199990}});
 const pendiente={plan:'pre-inscripcion',saldoPendiente:199990,cartera:{precio:199990,saldo:199990,pagado:0},revisionFinanciera:{estado:'precio-pendiente',alcance:'Módulo 3',motivo:'Sin precio comunicado'}};
 assert.equal(f.precioPendiente(pendiente),true);
 assert.equal(f.saldo(pendiente,0,0),null);
 assert.deepEqual(agenda(pendiente,null),[]);
 const dup={...p(0,199990),paymentStatus:'pendiente',duplicadoDe:'real'};
 assert.equal(f.sinCobro(dup),true);
 const portfolios={real:p(0,199990),dup,pendiente,pagado:p(100000,99990)};
 const users=Object.fromEntries(Object.keys(portfolios).map(k=>[k,{nombre:k,createdAt:'2026-09-01'}]));
 const {nodes,context}=render({users,portafolios:portfolios});
 assert.equal(context.getClientUids().includes('dup'),false);
 assert.equal(context.window._resumenCarteraBruta.saldoTotal,299980);
 assert.equal(context.window._resumenCarteraBruta.potencialPersonas,1);
 assert.match(nodes['stat-valoracion'].textContent,/1 sin pago con saldo registrado; 1 sin precio/);
 assert.match(nodes['potencial-table'].innerHTML,/Módulo 3/);
 assert.match(nodes['potencial-table'].innerHTML,/Precio por confirmar/);
 assert.equal(Object.values(context.window._agendaCobros).flat().reduce((s,e)=>s+e.monto,0),299980);
});
