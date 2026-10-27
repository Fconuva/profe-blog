(async function(){
 'use strict';
 const tools=document.getElementById('studentSessionTools'),button=document.getElementById('studentLogout'),name=document.getElementById('studentSessionName'),status=document.getElementById('logoutStatus');
 let closing=false,shownUid=null,authObserved=false;
 MiniSession.onChange?.(user=>{if(!authObserved){authObserved=true;return;}if(closing)return;if((shownUid||user)&&user?.uid!==shownUid){tools.hidden=true;name.textContent='';location.reload();}}).catch(()=>{});
 button.onclick=async()=>{
  if(closing)return;closing=true;button.disabled=true;button.textContent='Cerrando…';status.textContent='';
  try{await MiniSession.signOut();tools.hidden=true;name.textContent='';location.replace('/paes/');}
  catch(error){closing=false;button.disabled=false;button.textContent='Cerrar sesión';status.textContent=PaesStudentSession.errorMessage(error);}
 };
 window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
 try{
  const session=await MiniSession.restore();if(!session||closing)return;
  shownUid=session.user.uid;
  tools.hidden=false;name.textContent=session.user.displayName||'Sesión iniciada';
  const token=await session.user.getIdToken();
  await Promise.all([1,2,3].map(async n=>{
   const r=await fetch('/api/paes?action=tp-state&client=4&sesion='+n,{headers:{Authorization:'Bearer '+token}}),d=await r.json();if(closing)return;
   if(!r.ok){document.getElementById('status'+n).textContent=d.error||'Vuelve a ingresar en la actividad.';return;}
   if(d.identity)name.textContent=d.identity.nombre+' · '+d.identity.curso;
   if(d.redirect){document.getElementById('link'+n).href=d.redirect;return;}
   const done=d.attempt?.submitted===true&&d.attempt?.completada===true;
   document.getElementById('status'+n).textContent=done?'Completada':d.attempt?'En progreso':'Pendiente';
   if(done)document.getElementById('link'+n).textContent='Ver mi resultado';
  }));
 }catch(_){/* El ingreso permanece disponible en cada actividad. */}
})();
