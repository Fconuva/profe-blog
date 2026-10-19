'use strict';
(()=>{
  const config={apiKey:'AIzaSyCuDQ_iHDHmTd8bPeqUbsXQqdxw2SObt8w',authDomain:'estudiacest.firebaseapp.com',databaseURL:'https://estudiacest-default-rtdb.firebaseio.com',projectId:'estudiacest',storageBucket:'estudiacest.firebasestorage.app',messagingSenderId:'999002169815',appId:'1:999002169815:web:51203237bc77c2e74deb92'};
  const $=id=>document.getElementById(id),esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const teacherApp=firebase.apps.find(a=>a.name==='estudiacest-admin')||firebase.initializeApp(config,'estudiacest-admin');
  const teacherAuth=teacherApp.auth(),sessionKey='estudiacest-nm4-consulta';
  let studentSession=null;
  try{studentSession=JSON.parse(sessionStorage.getItem(sessionKey));if(studentSession?.exp<=Date.now())studentSession=null;}catch(_){}
  if(studentSession?.course)$('course').value=studentSession.course;
  const studentUser=()=>studentSession?{uid:'nm4-consulta',getIdToken:async()=>studentSession.token}:null;
  let user=null,data=null,controller=null,retry=null,epoch=0,saving=false,dirty=false,ready=0,pendingInput=null;
  const format=n=>n===null?'':Number(n).toFixed(1).replace('.',',');
  const notice=(text,error=false)=>{$('notice').textContent=text;$('notice').classList.toggle('error',error);};
  function lockEditing(input){pendingInput=input;document.querySelectorAll('#grades input').forEach(i=>i.disabled=i!==input);document.querySelectorAll('#activityOptions input').forEach(i=>i.disabled=true);$('course').disabled=true;$('discard').hidden=false;}
  function unlockEditing(){pendingInput=null;document.querySelectorAll('#grades input,#activityOptions input').forEach(i=>i.disabled=false);$('course').disabled=false;$('discard').hidden=true;}
  function url(action){return '/api/economista?modulo=planilla-nm4&action='+action+'&course='+encodeURIComponent($('course').value);}
  async function request(action,body){
    const token=await user.getIdToken();
    const response=await fetch(url(action),{method:body?'POST':'GET',headers:{Authorization:'Bearer '+token,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),cache:'no-store'});
    const result=await response.json();if(!response.ok)throw Object.assign(new Error(result.error||'No se pudo cargar la planilla.'),{status:response.status});return result;
  }
  function render(){
    if(!data||saving||dirty||document.activeElement?.matches('#grades input'))return;
    $('editHelp').hidden=!data.canEdit;
    $('activitySettings').hidden=!data.canEdit;
    $('activityOptions').innerHTML=data.canEdit?data.activities.map(a=>`<label><input type="checkbox" data-task="${a.id}" data-version="${a.version}" ${a.applicable?'checked':''}><span>${esc(a.title)}<small>${a.applicable?'Cuenta en la nota':'Desactivada'}</small></span></label>`).join(''):'';
    $('grades').querySelector('thead').innerHTML='<tr><th class="number" scope="col">N°</th><th class="name" scope="col">Estudiante</th>'+data.activities.map(a=>`<th scope="col" class="${a.applicable?'':'inactive'}">${esc(a.title)}<small>${a.applicable?esc(a.mode):'No cuenta'}</small></th>`).join('')+'<th scope="col">Promedio<small>Trabajo en clases</small></th></tr>';
    $('grades').querySelector('tbody').innerHTML=data.rows.map(row=>'<tr data-name="'+esc(row.name.toLocaleLowerCase('es'))+'"><td class="number">'+row.n+'</td><th class="name" scope="row">'+esc(row.name)+'</th>'+data.activities.map(a=>{
      const g=row.grades[a.id],title=g.source==='avance'?`Avance guardado: ${g.done} de ${g.total} apartados.`:g.grade===null?'Pendiente de revisión.':'Nota registrada por el docente.';
      if(!g.applicable)return '<td class="na" title="Tarea desactivada para este curso; no cuenta en la nota">—</td>';
      return `<td class="${g.source==='avance'?'auto':''}" title="${esc(title)}">${data.canEdit?`<input type="text" inputmode="decimal" aria-label="${esc(row.name+' · '+a.title)}" data-n="${row.n}" data-activity="${a.id}" data-version="${g.version}" data-grade="${g.grade??''}" value="${format(g.grade)}" maxlength="4">`:g.grade===null?'<span class="pending" aria-label="Pendiente de revisión"></span>':format(g.grade)}</td>`;
    }).join('')+`<td class="average">${row.total===0?'Sin tareas activas':row.average===null?'Pendiente':format(row.average)}<small>${row.partial?'Parcial · ':''}${row.count}/${row.total} actividades</small></td></tr>`).join('');
    filter();
  }
  function filter(){const text=$('search').value.toLocaleLowerCase('es').trim();let count=0;document.querySelectorAll('#grades tbody tr').forEach(row=>{row.hidden=!row.dataset.name.includes(text);if(!row.hidden)count++;});$('count').textContent=data?`${count} de ${data.rows.length} estudiantes · Las notas se actualizan automáticamente.`:'';}
  function accept(next){if(next.course!==$('course').value)return;data=next;render();}
  function stop(){epoch++;controller?.abort();controller=null;clearTimeout(retry);}
  async function watch(id){
    if(!user||id!==epoch)return;
    controller=new AbortController();
    try{
      const response=await fetch(url('watch'),{headers:{Authorization:'Bearer '+await user.getIdToken()},signal:controller.signal,cache:'no-store'});
      if(!response.ok){const error=await response.json();if(response.status===401&&studentSession){studentSession=null;sessionStorage.removeItem(sessionKey);sessionChanged();$('rutMessage').textContent=error.error||'Ingresa nuevamente tu RUT.';return;}throw new Error(error.error||'No se pudo conectar.');}
      const reader=response.body.getReader(),decoder=new TextDecoder();let buffer='';
      while(true){const {done,value}=await reader.read();if(done)break;buffer+=decoder.decode(value,{stream:true});let split;
        while((split=buffer.indexOf('\n\n'))>=0){const event=buffer.slice(0,split);buffer=buffer.slice(split+2);if(event.startsWith('data: ')&&id===epoch){accept(JSON.parse(event.slice(6)));if(!saving&&!dirty&&!/^(Nota guardada|Tarea activada|Tarea desactivada)/.test($('notice').textContent))notice('Actualizado · conexión en vivo');}}
      }
    }catch(e){if(e.name==='AbortError')return;if(id===epoch&&!saving&&!dirty)notice('Sin conexión en vivo. Reintentando…',true);}
    if(id===epoch)retry=setTimeout(()=>watch(id),2000);
  }
  async function load(){stop();data=null;dirty=false;$('grades').querySelector('tbody').replaceChildren();notice('Cargando planilla…');const id=epoch;try{const next=await request('list');if(id!==epoch)return;accept(next);notice('Planilla actualizada');watch(id);}catch(e){if(id===epoch){notice(e.message,true);if(e.status===401&&studentSession){studentSession=null;sessionStorage.removeItem(sessionKey);sessionChanged();$('rutMessage').textContent=e.message;}}}}
  async function save(input){
    if(!data?.canEdit||saving)return;
    const text=input.value.trim().replace(',','.');const grade=text===''?null:Number(text),before=input.dataset.grade===''?null:Number(input.dataset.grade);
    if(grade===before){dirty=false;input.classList.remove('invalid');unlockEditing();render();return;}
    if(grade!==null&&(!/^\d(?:\.\d)?$/.test(text)||!Number.isFinite(grade)||grade<1||grade>7)){dirty=true;input.classList.add('invalid');lockEditing(input);notice('Escribe una nota de 1,0 a 7,0, con un decimal. Borra para dejarla pendiente.',true);return;}
    saving=true;dirty=true;document.querySelectorAll('#grades input,#activityOptions input').forEach(i=>i.disabled=true);$('course').disabled=true;notice('Guardando nota…');
    const requestId=input.dataset.requestId||crypto.randomUUID();input.dataset.requestId=requestId;
    try{
      const result=await request('save',{course:data.course,n:Number(input.dataset.n),activity:input.dataset.activity,grade,expectedVersion:Number(input.dataset.version),requestId});
      saving=false;dirty=false;data=result;render();notice('Nota guardada y confirmada.');
    }catch(e){saving=false;if(e.status===409){dirty=false;delete input.dataset.requestId;try{data=await request('list');render();}catch(_){}notice(e.message,true);}else{input.disabled=false;input.classList.add('invalid');notice(e.message+' Tu cambio sigue en la casilla. Pulsa Enter para reintentar.',true);}}
    finally{if(dirty)lockEditing(input);else unlockEditing();}
  }
  async function setActivity(input){
    if(!data?.canEdit||saving||dirty){render();return;}
    const activity=data.activities.find(a=>a.id===input.dataset.task),enabled=input.checked;
    saving=true;document.querySelectorAll('#grades input,#activityOptions input').forEach(i=>i.disabled=true);$('course').disabled=true;notice('Guardando selección de tareas…');
    try{
      data=await request('set-activity',{course:data.course,activity:activity.id,enabled,expectedVersion:activity.version,requestId:crypto.randomUUID()});
      saving=false;render();notice(`Tarea ${enabled?'activada':'desactivada'} para este curso. Las notas se conservan.`);
    }catch(e){
      // Puede haberse confirmado la escritura aunque se haya perdido la respuesta.
      try{data=await request('list');}catch(_){}
      saving=false;render();notice(e.message+' Revisa la selección y vuelve a intentarlo.',true);
    }finally{unlockEditing();}
  }
  function sessionChanged(){
    if(ready<1)return;
    const next=studentUser()||teacherAuth.currentUser;if(next?.uid===user?.uid&&next)return;stop();user=next;data=null;dirty=false;
    $('sheet').hidden=!user;$('studentLogin').hidden=Boolean(studentSession);$('studentLogout').hidden=!studentSession;$('logout').hidden=!teacherAuth.currentUser||Boolean(studentSession);
    $('teacherAccess').hidden=Boolean(teacherAuth.currentUser)&&!studentSession;$('session').textContent=studentSession?'Consulta con RUT iniciada. Selecciona un curso para ver las notas.':user?'Sesión docente iniciada. Selecciona un curso.':'Ingresa tu RUT para ver las notas. No necesitas correo ni contraseña.';
    if(user)load();
  }
  {let first=true;teacherAuth.onAuthStateChanged(()=>{if(first){ready++;first=false;}sessionChanged();});}
  $('studentLogin').addEventListener('submit',async event=>{event.preventDefault();const button=event.target.querySelector('button');button.disabled=true;$('rutMessage').textContent='Buscando tu curso…';try{const response=await fetch('/api/economista?modulo=planilla-nm4&action=rut-login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({rut:$('rutInput').value}),cache:'no-store'}),result=await response.json();if(!response.ok)throw Error(result.error||'No se pudo ingresar. Vuelve a intentarlo.');studentSession={token:result.token,course:result.course,exp:Date.now()+8*3600000};sessionStorage.setItem(sessionKey,JSON.stringify(studentSession));$('course').value=result.course;$('rutInput').value='';$('rutMessage').textContent='';sessionChanged();}catch(e){$('rutMessage').textContent=e.message;}finally{button.disabled=false;}});
  $('studentLogout').addEventListener('click',()=>{studentSession=null;sessionStorage.removeItem(sessionKey);sessionChanged();});
  $('login').addEventListener('submit',async event=>{event.preventDefault();const form=event.target,button=form.querySelector('button');button.disabled=true;$('loginMessage').textContent='Ingresando…';try{await teacherAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);await teacherAuth.signInWithEmailAndPassword(form.email.value.trim(),form.password.value);studentSession=null;sessionStorage.removeItem(sessionKey);sessionChanged();form.password.value='';$('loginMessage').textContent='';}catch(_){$('loginMessage').textContent='No se pudo ingresar. Revisa tu correo y contraseña.';}finally{button.disabled=false;}});
  $('logout').addEventListener('click',()=>teacherAuth.signOut());
  $('activityOptions').addEventListener('change',event=>{if(event.target.matches('input[type="checkbox"]'))setActivity(event.target);});
  $('discard').addEventListener('click',()=>{if(pendingInput)pendingInput.value=pendingInput.dataset.grade===''?'':format(Number(pendingInput.dataset.grade));dirty=false;unlockEditing();render();notice('Cambio descartado. Se conserva la nota registrada.');});
  $('course').addEventListener('change',load);$('search').addEventListener('input',filter);
  $('grades').addEventListener('input',event=>{if(event.target.matches('input')){dirty=true;delete event.target.dataset.requestId;}});
  $('grades').addEventListener('focusout',event=>{if(event.target.matches('input'))save(event.target);});
  $('grades').addEventListener('keydown',event=>{if(event.target.matches('input')&&event.key==='Enter'){event.preventDefault();event.target.blur();}});
  window.addEventListener('beforeunload',event=>{if(dirty||saving){event.preventDefault();event.returnValue='';}});
})();
