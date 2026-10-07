/* El servidor de cartas autoriza la cuenta; el acceso no depende del roster de Mi espacio. */
(function(global){
 'use strict';
 async function restore(){const {auth}=await PaesStudentSession.client();return auth.currentUser?{user:auth.currentUser}:null;}
 async function signIn(rut,password){
  const normalized=String(rut||'').replace(/[^0-9kK]/g,'').toUpperCase();
  if(!/^\d{7,8}[0-9K]$/.test(normalized)||!password)throw new Error('Escribe tu RUT y tu contraseña.');
  const {auth}=await PaesStudentSession.client();let credential,response;
  try{response=await fetch('/api/lecturas-login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({rut:normalized,password})});}catch(_){/* La autenticación habitual conserva su alternativa ante un fallo de red. */}
  if(response&&[401,403].includes(response.status))throw new Error('RUT o contraseña incorrectos, o cuenta no habilitada.');
  if(response?.ok){const data=await response.json();if(data.token)credential=await auth.signInWithCustomToken(data.token);else if(!data.fallback)throw new Error('No se pudo iniciar sesión. Inténtalo nuevamente.');}
  if(!credential)credential=await auth.signInWithEmailAndPassword(normalized.toLowerCase()+'@est.estudiacest.com',password);
  return {user:credential.user};
 }
 global.CartasSession={restore,signIn};
})(window);
