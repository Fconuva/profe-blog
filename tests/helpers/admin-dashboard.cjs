const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../../admin/index.html'), 'utf8');
function render(data) {
  const nodes = {};
  const context = {
    allClients: structuredClone(data.users || {}), allPortafolios: structuredClone(data.portafolios || {}),
    FinanzasAdmin: require('../../admin/finanzas.js'), window: {},
    document: {getElementById(id) {return nodes[id] ||= {textContent:'', innerHTML:'', style:{}, classList:{add(){},remove(){}}};}, querySelectorAll(){return [];}},
    mercadoPagoBaseFeeRate: 7562 / 199000, planNames: {},
    planPrices: {completo:199990, modulo1:79990, modulo2:99990, modulo3:79990, 'pre-inscripcion':0},
    pintarAgendaCobros(){}, pintarSeguimiento(){}, formatDate(x){return x;},
    escapeHtml(x){return String(x ?? '').replace(/[&<>"']/g, c => '&#'+c.charCodeAt(0)+';');}
  };
  vm.createContext(context);
  for (const name of ['formatCLP','getPlanPrice','getPortfolioPrice','montoPagadoReal','esClienteInactivo','getClientUids','renderDashboard','pintarAgendaCobros']) {
    const start = html.indexOf('        function '+name+'(');
    const end = html.indexOf('\n        function ', start + 1);
    let source = html.slice(start, end < 0 ? undefined : end);
    // Last closing brace at the function indentation, excluding comments between functions.
    const closes = [...source.matchAll(/^        }\s*$/gm)];
    source = closes.length ? source.slice(0, closes.at(-1).index + closes.at(-1)[0].length) : source.split('\n')[0];
    vm.runInContext(source, context);
  }
  context.renderDashboard();
  return {nodes, context};
}
module.exports = {render, html};
if (require.main === module) {
  const data=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
  const {nodes,context}=render(data);
  console.log(JSON.stringify({cards:Object.fromEntries(Object.entries(nodes).filter(([k])=>k.startsWith('stat-') || k.startsWith('agenda-')).map(([k,v])=>[k,v.textContent])),summary:context.window._resumenCarteraBruta},null,2));
  console.log('Sin pago y saldo cero/sin precio:',context.getClientUids().filter(uid=>context.montoPagadoReal(data.portafolios[uid])===0 && !context.FinanzasAdmin.sinCobro(data.portafolios[uid]||{}) && !(context.FinanzasAdmin.saldo(data.portafolios[uid]||{},context.getPortfolioPrice(data.portafolios[uid]),0)>0)).map(uid=>({uid,nombre:context.allClients[uid].nombre,saldo:context.FinanzasAdmin.saldo(data.portafolios[uid]||{},context.getPortfolioPrice(data.portafolios[uid]),0)})));
  const events=Object.values(context.window._agendaCobros).flat();
  if(events.reduce((s,e)=>s+e.monto,0)!==context.window._resumenCarteraBruta.saldoTotal)throw Error('Agenda no cuadra con saldos');
}
