const fs = require('fs');
const html = fs.readFileSync('estudiantes/sesion.html','utf8');

const sessions = ['prueba-ingreso','sesion-1','sesion-3','sesion-4','sesion-5','sesion-6'];
sessions.forEach(sid => {
  const regex = new RegExp("'" + sid + "':\\s*\\{[\\s\\S]*?textos:\\s*\\[([\\s\\S]*?)\\],\\s*preguntas:");
  const m = html.match(regex);
  if(!m) { console.log(sid+': NO MATCH'); return; }
  const textosBlock = m[1];
  const ids = [...textosBlock.matchAll(/id:'([^']+)'/g)].map(x=>x[1]);
  const tipos = [...textosBlock.matchAll(/tipo:'([^']+)'/g)].map(x=>x[1]);
  const subtipos = [...textosBlock.matchAll(/subtipo:'([^']+)'/g)].map(x=>x[1]);
  console.log('\n=== '+sid+' ===');
  ids.forEach((id,i) => {
    console.log('  ['+i+'] '+id+' | '+tipos[i]+' | '+(subtipos[i]||''));
  });

  // Also check question order - find last textoRef
  const qRegex = new RegExp("'" + sid + "':\\s*\\{[\\s\\S]*?preguntas:\\s*\\[([\\s\\S]*?)\\]\\s*\\}");
  const qm = html.match(qRegex);
  if(qm) {
    const qBlock = qm[1];
    const qRefs = [...qBlock.matchAll(/textoRef:'([^']+)'/g)].map(x=>x[1]);
    const qIds = [...qBlock.matchAll(/id:'([^']+)'/g)].map(x=>x[1]);
    const qHabs = [...qBlock.matchAll(/habilidad:'([^']+)'/g)].map(x=>x[1]);
    
    // Show last 5 questions
    console.log('  --- Last 5 questions ---');
    const start = Math.max(0, qIds.length-5);
    for(let i=start; i<qIds.length; i++) {
      console.log('  '+qIds[i]+' -> '+qRefs[i]+' ('+qHabs[i]+')');
    }
    console.log('  Total: '+qIds.length+' questions');
    
    // Check if ticket questions are at the end
    const ticketIdx = qRefs.lastIndexOf('texto-ticket');
    const cazaIdx = qRefs.lastIndexOf('texto-caza');
    if(ticketIdx >= 0 && ticketIdx < qIds.length -1) {
      const afterTicket = qRefs.slice(ticketIdx+1);
      if(afterTicket.some(r => r !== 'texto-ticket')) {
        console.log('  ⚠️ PROBLEM: Questions AFTER ticket: ' + afterTicket.filter(r=>r!=='texto-ticket').join(', '));
      }
    }
    if(cazaIdx >= 0 && ticketIdx >= 0 && cazaIdx > ticketIdx) {
      console.log('  ⚠️ PROBLEM: Caza-Distractores AFTER Ticket de Salida!');
    }
  }
});
