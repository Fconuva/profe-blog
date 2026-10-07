/* Conducta de estudiantes/sesion.html: 200 ms oculto, 5 s sin foco,
   una incidencia por salida y tres strikes. No modifica evaluaciones anteriores. */
(function(root){
 'use strict';
 function geometry(s){
  if(s.mobile)return s.baselineWidth>0&&s.width<s.baselineWidth*.70;
  const ratio=s.width/Math.max(1,s.screenWidth),height=s.height/Math.max(1,s.screenHeight);
  // La escala corrige zoom de navegador. Nunca se decide por altura móvil (teclado).
  return ratio<.70||height<.65;
 }
 function create({active,onBlock,onIncident,screenRequired=false,mobile=false}){
  let timer=null,episode=null,counted=false,baselineWidth=innerWidth,baselineHeight=innerHeight,baselineDpr=devicePixelRatio||1,suspendedUntil=0,lastReason=null;
  function reason(){if(document.hidden)return 'hidden';if(!document.hasFocus())return 'blur';if(screenRequired&&!document.fullscreenElement)return 'fullscreen';
   const scale=window.visualViewport?.scale||1;
   if(!mobile&&document.fullscreenElement){const zoom=(devicePixelRatio||1)/baselineDpr;return geometry({mobile:false,width:innerWidth*zoom,height:innerHeight*zoom,screenWidth:baselineWidth,screenHeight:baselineHeight})?'geometry':null;}
   const width=mobile?innerWidth*scale:outerWidth,height=mobile?innerHeight:outerHeight;
   return geometry({mobile,width,height,baselineWidth,screenWidth:screen.availWidth,screenHeight:screen.availHeight})?'geometry':null;
  }
  function check(){
   if(!active()||Date.now()<suspendedUntil){clearTimeout(timer);timer=null;return;}
   const why=reason();onBlock(Boolean(why),why);
   if(!why){clearTimeout(timer);timer=null;episode=null;counted=false;lastReason=null;return;}
   if(!episode){episode=crypto.randomUUID();counted=false;}
   if(counted)return;
   if(timer&&lastReason===why)return;clearTimeout(timer);lastReason=why;
   timer=setTimeout(()=>{timer=null;if(active()&&reason()&&!counted){counted=true;onIncident({eventId:episode,reason:reason()});}},why==='hidden'?200:5000);
  }
  const events=[[document,'visibilitychange'],[document,'fullscreenchange'],[window,'blur'],[window,'focus'],[window,'resize']];events.forEach(([el,event])=>el.addEventListener(event,check));
  const poll=setInterval(check,500);
  const rotate=()=>{if(mobile){suspendedUntil=Date.now()+700;setTimeout(()=>{baselineWidth=innerWidth*(window.visualViewport?.scale||1);check();},650);}};window.addEventListener('orientationchange',rotate);
  const blocked=e=>{if(!active())return;e.preventDefault();};
  ['copy','cut','paste','contextmenu','dragstart','drop'].forEach(event=>document.addEventListener(event,blocked));
  const keys=e=>{if(active()&&(e.ctrlKey||e.metaKey)&&['c','v','x','p','s','u'].includes(e.key.toLowerCase()))e.preventDefault();};document.addEventListener('keydown',keys);
  return {check,suspend(ms=700){suspendedUntil=Date.now()+ms;clearTimeout(timer);timer=null;},resetBaseline(){baselineWidth=innerWidth*(window.visualViewport?.scale||1);},destroy(){clearInterval(poll);clearTimeout(timer);events.forEach(([el,event])=>el.removeEventListener(event,check));['copy','cut','paste','contextmenu','dragstart','drop'].forEach(event=>document.removeEventListener(event,blocked));document.removeEventListener('keydown',keys);window.removeEventListener('orientationchange',rotate);onBlock(false,null);}};
 }
 const api={geometry,create};if(typeof module==='object')module.exports=api;else root.MiniIntegrity=api;
})(typeof window==='object'?window:globalThis);
