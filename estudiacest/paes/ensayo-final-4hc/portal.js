/* Tarjeta del ensayo final de 4.º A y B HC. Solo se muestra si el servidor autoriza la cuenta. */
(function(){
 'use strict';
 const box=()=>document.getElementById('ensayoFinal4hcCard'),status=()=>document.getElementById('ensayoFinal4hcStatus'),link=()=>document.getElementById('ensayoFinal4hcLink');
 let running=false,done=false;
 async function sync(){
  const card=box();if(!card||running||done)return;running=true;
  try{
   if(typeof MiniSession==='undefined'){const s=document.createElement('script');s.src='/paes/ensayo-final-4hc/sesion.js';await new Promise((ok,fail)=>{s.onload=ok;s.onerror=fail;document.head.appendChild(s);});}
   const s=await MiniSession.restore();if(!s)return;const token=await s.user.getIdToken();
   const get=async mode=>{const r=await fetch('/api/paes?action=ef4hc-state&mode='+mode,{headers:{Authorization:'Bearer '+token}});if(r.status===403){const e=await r.json().catch(()=>({}));if(/^Este ensayo corresponde/.test(e.error||''))return null;card.hidden=false;status().textContent='Bloqueado por el docente';link().hidden=true;return null;}return r.ok?r.json():null;};
   let d=await get('regular');if(!d)return;if(d.redirect){link().href=d.redirect;d=await get('guided');}if(!d)return;
   if(d.preview)return;
   card.hidden=false;link().hidden=false;done=true;
   const a=d.attempt,finished=a?.submitted===true&&a?.completada===true;
   status().textContent=finished?'Completado · Entrega confirmada':a?`En progreso · ${Object.keys(a.answers||{}).length}/${d.activity.questions.length}`:'Disponible · 90 minutos';
   link().textContent=finished?'Ver mi entrega':a?'Continuar el ensayo':'Iniciar el ensayo';
  }catch(_){/* Sin sesión o sin conexión: la tarjeta permanece oculta. */}
  finally{running=false;}
 }
 function watch(){
  const dash=document.getElementById('dashboardSection');
  if(dash)new MutationObserver(()=>{if(dash.style.display!=='none'&&getComputedStyle(dash).display!=='none')sync();}).observe(dash,{attributes:true,attributeFilter:['style','class']});
  if(dash&&getComputedStyle(dash).display!=='none')sync();
 }
 document.addEventListener('DOMContentLoaded',watch);
})();
