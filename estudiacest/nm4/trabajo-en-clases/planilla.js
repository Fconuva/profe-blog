'use strict';
(()=>{
  const config={apiKey:'AIzaSyCuDQ_iHDHmTd8bPeqUbsXQqdxw2SObt8w',authDomain:'estudiacest.firebaseapp.com',databaseURL:'https://estudiacest-default-rtdb.firebaseio.com',projectId:'estudiacest',storageBucket:'estudiacest.firebasestorage.app',messagingSenderId:'999002169815',appId:'1:999002169815:web:51203237bc77c2e74deb92'};
  const $=id=>document.getElementById(id),esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const defaultApp=firebase.apps.find(a=>a.name==='[DEFAULT]')||firebase.initializeApp(config);
  const teacherApp=firebase.apps.find(a=>a.name==='estudiacest-admin')||firebase.initializeApp(config,'estudiacest-admin');
  const studentAuth=defaultApp.auth(),teacherAuth=teacherApp.auth();
  let user=null,data=null,controller=null,retry=null,epoch=0,saving=false,dirty=false,ready=0,pendingInput=null;
  const format=n=>n===null?'':Number(n).toFixed(1).replace('.',',');
  const notice=(text,error=false)=>{$('notice').textContent=text;$('notice').classList.toggle('error',error);};
  function lockEditing(input){pendingInput=input;document.querySelectorAll('#grades input').forEach(i=>i.disabled=i!==input);$('course').disabled=true;$('discard').hidden=false;}
  function unlockEditing(){pendingInput=null;document.querySelectorAll('#grades input').forEach(i=>i.disabled=false);$('course').disabled=false;$('discard').hidden=true;}
  function url(action){return '/api/economista?modulo=planilla-nm4&action='+action+'&course='+encodeURIComponent($('course').value);}
  async function request(action,body){
    const token=await user.getIdToken();
    const response=await fetch(url(action),{method:body?'POST':'GET',headers:{Authorization:'Bearer '+token,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),cache:'no-store'});
    const result=await response.json();if(!response.ok)throw Object.assign(new Error(result.error||'No se pudo cargar la planilla.'),{status:response.status});return result;
  }
  function render(){
    if(!data||saving||dirty||document.activeElement?.matches('#grades input'))return;
    $('editHelp').hidden=!data.canEdit;
    $('grades').querySelector('thead').innerHTML='<tr><th class="number" scope="col">N°</th><th class="name" scope="col">Estudiante</th>'+data.activities.map(a=>`<th scope="col">${esc(a.title)}<small>${esc(a.mode)}</small></th>`).join('')+'<th scope="col">Promedio<small>Trabajo en clases</small></th></tr>';
    $('grades').querySelector('tbody').innerHTML=data.rows.map(row=>'<tr data-name="'+esc(row.name.toLocaleLowerCase('es'))+'"><td class="number">'+row.n+'</td><th class="name" scope="row">'+esc(row.name)+'</th>'+data.activities.map(a=>{
      const g=row.grades[a.id],title=g.source==='avance'?`Avance guardado: ${g.done} de ${g.total} apartados.`:g.grade===null?'Pendiente de revisión.':'Nota registrada por el docente.';
      if(!g.applicable)return '<td class="na" title="No corresponde al curso">—</td>';
      return `<td class="${g.source==='avance'?'auto':''}" title="${esc(title)}">${data.canEdit?`<input type="text" inputmode="decimal" aria-label="${esc(row.name+' · '+a.title)}" data-n="${row.n}" data-activity="${a.id}" data-version="${g.version}" data-grade="${g.grade??''}" value="${format(g.grade)}" maxlength="4">`:g.grade===null?'<span class="pending" aria-label="Pendiente de revisión"></span>':format(g.grade)}</td>`;
    }).join('')+`<td class="average">${row.average===null?'Pendiente':format(row.average)}<small>${row.partial?'Parcial · ':''}${row.count}/${row.total} actividades</small></td></tr>`).join('');
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
      if(!response.ok){const error=await response.json();throw new Error(error.error||'No se pudo conectar.');}
      const reader=response.body.getReader(),decoder=new TextDecoder();let buffer='';
      while(true){const {done,value}=await reader.read();if(done)break;buffer+=decoder.decode(value,{stream:true});let split;
        while((split=buffer.indexOf('\n\n'))>=0){const event=buffer.slice(0,split);buffer=buffer.slice(split+2);if(event.startsWith('data: ')&&id===epoch){accept(JSON.parse(event.slice(6)));if(!saving&&!dirty&&!$('notice').textContent.startsWith('Nota guardada'))notice('Actualizado · conexión en vivo');}}
      }
    }catch(e){if(e.name==='AbortError')return;if(id===epoch&&!saving&&!dirty)notice('Sin conexión en vivo. Reintentando…',true);}
    if(id===epoch)retry=setTimeout(()=>watch(id),2000);
  }
  async function load(){stop();data=null;dirty=false;$('grades').querySelector('tbody').replaceChildren();notice('Cargando planilla…');const id=epoch;try{const next=await request('list');if(id!==epoch)return;accept(next);notice('Planilla actualizada');watch(id);}catch(e){if(id===epoch)notice(e.message,true);}}
  async function save(input){
    if(!data?.canEdit||saving)return;
    const text=input.value.trim().replace(',','.');const grade=text===''?null:Number(text),before=input.dataset.grade===''?null:Number(input.dataset.grade);
    if(grade===before){dirty=false;input.classList.remove('invalid');unlockEditing();render();return;}
    if(grade!==null&&(!/^\d(?:\.\d)?$/.test(text)||!Number.isFinite(grade)||grade<1||grade>7)){dirty=true;input.classList.add('invalid');lockEditing(input);notice('Escribe una nota de 1,0 a 7,0, con un decimal. Borra para dejarla pendiente.',true);return;}
    saving=true;dirty=true;document.querySelectorAll('#grades input').forEach(i=>i.disabled=true);$('course').disabled=true;notice('Guardando nota…');
    const requestId=input.dataset.requestId||crypto.randomUUID();input.dataset.requestId=requestId;
    try{
      const result=await request('save',{course:data.course,n:Number(input.dataset.n),activity:input.dataset.activity,grade,expectedVersion:Number(input.dataset.version),requestId});
      saving=false;dirty=false;data=result;render();notice('Nota guardada y confirmada.');
    }catch(e){saving=false;if(e.status===409){dirty=false;delete input.dataset.requestId;try{data=await request('list');render();}catch(_){}notice(e.message,true);}else{input.disabled=false;input.classList.add('invalid');notice(e.message+' Tu cambio sigue en la casilla. Pulsa Enter para reintentar.',true);}}
    finally{if(dirty)lockEditing(input);else unlockEditing();}
  }
  function sessionChanged(){
    if(ready<2)return;
    const next=teacherAuth.currentUser||studentAuth.currentUser;if(next?.uid===user?.uid&&next)return;stop();user=next;data=null;dirty=false;
    $('sheet').hidden=!user;$('studentLogin').hidden=Boolean(user);$('logout').hidden=!teacherAuth.currentUser;
    $('teacherAccess').hidden=Boolean(teacherAuth.currentUser);$('session').textContent=user?'Sesión iniciada. Selecciona un curso para consultar la planilla.':'Ingresa con tu cuenta para ver las notas de tu curso.';
    if(user)load();
  }
  for(const auth of [studentAuth,teacherAuth]){let first=true;auth.onAuthStateChanged(()=>{if(first){ready++;first=false;}sessionChanged();});}
  $('login').addEventListener('submit',async event=>{event.preventDefault();const form=event.target,button=form.querySelector('button');button.disabled=true;$('loginMessage').textContent='Ingresando…';try{await teacherAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);await teacherAuth.signInWithEmailAndPassword(form.email.value.trim(),form.password.value);form.password.value='';$('loginMessage').textContent='';}catch(_){$('loginMessage').textContent='No se pudo ingresar. Revisa tu correo y contraseña.';}finally{button.disabled=false;}});
  $('logout').addEventListener('click',()=>teacherAuth.signOut());
  $('discard').addEventListener('click',()=>{if(pendingInput)pendingInput.value=pendingInput.dataset.grade===''?'':format(Number(pendingInput.dataset.grade));dirty=false;unlockEditing();render();notice('Cambio descartado. Se conserva la nota registrada.');});
  $('course').addEventListener('change',load);$('search').addEventListener('input',filter);
  $('grades').addEventListener('input',event=>{if(event.target.matches('input')){dirty=true;delete event.target.dataset.requestId;}});
  $('grades').addEventListener('focusout',event=>{if(event.target.matches('input'))save(event.target);});
  $('grades').addEventListener('keydown',event=>{if(event.target.matches('input')&&event.key==='Enter'){event.preventDefault();event.target.blur();}});
  window.addEventListener('beforeunload',event=>{if(dirty||saving){event.preventDefault();event.returnValue='';}});
})();
