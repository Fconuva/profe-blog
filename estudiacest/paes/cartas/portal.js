// Estado autenticado: no usa el RUT seleccionado en el portal como identidad.
async function syncCartasProgress(){
 const status=document.getElementById('cartasStatus'),link=document.getElementById('cartasLink');
 try{
  const session=await PaesStudentSession.restore();if(!session){status.textContent='Ingresa al juego con tu cuenta para recuperar tu avance.';return;}
  const token=await session.user.getIdToken();
  const request=async mode=>{const r=await fetch('/api/paes?action=cards-state&mode='+mode,{headers:{Authorization:'Bearer '+token}});if(!r.ok)throw new Error('No se pudo comprobar el avance.');return r.json();};
  let data=await request('regular');if(data.redirect){link.href=data.redirect;data=await request('guided');}
  const attempt=data.attempt;status.textContent=attempt?.completada===true&&attempt?.submitted===true?'Completada · Entrega confirmada':attempt?`En progreso · ${Object.keys(attempt.answers||{}).length} de ${data.activity.questions.length} respuestas`:'Juego disponible';
  link.textContent=attempt?.completada&&attempt?.submitted?'Ver mi entrega':attempt?'Continuar juego':'Jugar cartas';
 }catch(e){status.textContent='Abre el juego para recuperar o comprobar tu avance.';}
}
