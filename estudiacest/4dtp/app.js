(function () {
  'use strict';

  const API = '/api/anuario-4dtp';
  const API_TIMEOUT_MS = 20000;
  const MAX_FILE_SIZE = 100 * 1024 * 1024;
  const FIREBASE_CONFIG = { apiKey:'AIzaSyCuDQ_iHDHmTd8bPeqUbsXQqdxw2SObt8w', authDomain:'estudiacest.firebaseapp.com', databaseURL:'https://estudiacest-default-rtdb.firebaseio.com', projectId:'estudiacest', storageBucket:'estudiacest.firebasestorage.app', messagingSenderId:'999002169815', appId:'1:999002169815:web:51203237bc77c2e74deb92' };
  const kinds = ['Compañero 1', 'Compañero 2', 'Compañero 3', 'Docente 1', 'Docente 2'];
  const writtenFieldIds = ['interviewTitle','interviewContext','interviewQuestions','interviewQuote','memoryTitle','memoryText','memoryCaption','projectTitle','projectText','projectCaption','farewellTitle','farewellText','captions'];
  const $ = id => document.getElementById(id);

  firebase.initializeApp(FIREBASE_CONFIG);
  const auth = firebase.auth();
  const storage = firebase.storage();
  const persistenceReady = auth.setPersistence(firebase.auth.Auth.Persistence.NONE);

  let student = null;
  let state = null;
  let saveTimer = null;
  let saveChain = Promise.resolve(true);
  let activeRecorder = null;
  let activeStream = null;
  let recordingChunks = [];
  let recordingSlot = 0;
  let recordingStartedAt = 0;
  let recordingTimer = null;
  let loginPending = false;

  function cleanRut(value) { return String(value || '').replace(/[^0-9kK]/g, '').toUpperCase(); }
  function formatRut(value) { const clean=cleanRut(value);if(clean.length<2)return clean;return clean.slice(0,-1).replace(/\B(?=(\d{3})+(?!\d))/g,'.')+'-'+clean.slice(-1); }
  function escapeHtml(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character])); }
  function formatBytes(bytes) { const value=Number(bytes||0);if(value<1024)return value+' B';if(value<1048576)return (value/1024).toFixed(1)+' KB';if(value<1073741824)return (value/1048576).toFixed(1)+' MB';return (value/1073741824).toFixed(2)+' GB'; }
  function formatDate(value) { return value ? new Intl.DateTimeFormat('es-CL',{dateStyle:'short',timeStyle:'short'}).format(new Date(value)) : '—'; }
  function setSave(message, status) { $('saveState').textContent=message;$('saveState').dataset.state=status||''; }

  function friendlyError(error) {
    const message = String(error && error.message || '');
    const code = String(error && error.code || '');
    if (!navigator.onLine || code === 'OFFLINE') return 'Sin conexión a internet. Revisa la red y vuelve a intentar.';
    if (error && error.name === 'AbortError') return 'La conexión tardó demasiado. Vuelve a intentar.';
    if (error instanceof TypeError || code === 'auth/network-request-failed' || /failed to fetch|network|load failed/i.test(message)) {
      return 'No fue posible conectar con el anuario. Revisa la conexión y vuelve a intentar.';
    }
    return message || 'No se pudo completar la solicitud.';
  }

  function updateNetworkStatus() {
    const error = $('loginError');
    if (!navigator.onLine) {
      if (!student) {
        error.textContent = 'Sin conexión a internet. Revisa la red y vuelve a intentar.';
        error.dataset.state = 'offline';
      }
      $('loginButton').disabled = true;
      return;
    }
    $('loginButton').disabled = loginPending;
    if (!student && error.dataset.state === 'offline') {
      error.textContent = 'Conexión restablecida. Ya puedes ingresar.';
      error.dataset.state = 'online';
    }
  }

  async function api(action, options, query) {
    if (!navigator.onLine) {
      const error = new Error('Sin conexión a internet.');
      error.code = 'OFFLINE';
      throw error;
    }
    const params = new URLSearchParams({ action });
    Object.entries(query || {}).forEach(([key,value]) => params.set(key,value));
    const headers = { ...(options && options.headers || {}) };
    if (auth.currentUser) headers.Authorization = 'Bearer ' + await auth.currentUser.getIdToken();
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);
    let response;
    try {
      response = await fetch(API + '?' + params.toString(), { cache:'no-store', ...options, headers, signal:controller.signal });
    } catch (error) {
      const requestError = new Error(friendlyError(error));
      requestError.code = error && error.code;
      requestError.name = error && error.name || 'Error';
      throw requestError;
    } finally {
      window.clearTimeout(timeout);
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { const error=new Error(data.error||'No se pudo completar la solicitud.');error.status=response.status;throw error; }
    return data;
  }

  function defaultInterviews() {
    return kinds.map((_,index)=>({slot:index+1,kind:index<3?'compañero':'docente',interviewee:'',transcription:'',audioFileId:'',updatedAt:0}));
  }

  function defaultWrittenProducts() {
    return Object.fromEntries(writtenFieldIds.map(field=>[field,'']));
  }

  function normalizeState(value) {
    const data=value||{};
    return { profile:data.profile||{}, interviews:Array.isArray(data.interviews)&&data.interviews.length===5?data.interviews:defaultInterviews(), files:Array.isArray(data.files)?data.files:[], projectNotes:data.projectNotes||'', writtenProducts:{...defaultWrittenProducts(),...(data.writtenProducts||{})}, activity1Status:data.activity1Status==='submitted'?'submitted':'draft', activity1SubmittedAt:Number(data.activity1SubmittedAt||0), activity2Status:data.activity2Status==='submitted'?'submitted':'draft', activity2SubmittedAt:Number(data.activity2SubmittedAt||0), updatedAt:Number(data.updatedAt||0) };
  }

  function renderWrittenProducts() {
    writtenFieldIds.forEach(field=>{$(field).value=state.writtenProducts[field]||'';});
    updateWordCounts();
  }

  function renderInterviews() {
    $('interviewList').innerHTML = state.interviews.map((item,index)=>{
      const audio=state.files.find(file=>file.id===item.audioFileId);
      const questions=index<3
        ? ['¿Qué experiencia del curso o del colegio recuerdas especialmente y por qué?', '¿Qué aprendizaje te llevas de estos años y de la especialidad?', '¿Cómo describirías a nuestra generación con un ejemplo concreto?', '¿Qué persona o momento influyó en tu experiencia escolar?', '¿Qué mensaje dejarías en el anuario?']
        : ['¿Qué característica distingue a esta generación?', '¿Qué momento compartido con el curso recuerda especialmente?', '¿Qué aprendizaje considera importante que los estudiantes conserven?', '¿Qué consejo les daría para la etapa que comienza?', '¿Qué mensaje dejaría en el anuario?'];
      return `<section class="interview" data-slot="${item.slot}"><div class="interview-head"><h2>Entrevista ${item.slot} · ${kinds[index]}</h2><span class="kind">${index<3?'Compañero':'Docente'}</span></div><div class="interview-fields"><div class="field"><label for="interviewee-${item.slot}">Nombre de la persona entrevistada</label><input id="interviewee-${item.slot}" data-interviewee="${item.slot}" maxlength="140" value="${escapeHtml(item.interviewee)}" placeholder="Nombre y apellido"></div><div class="audio-controls"><button class="audio-button" type="button" data-record="${item.slot}">Grabar audio</button><button class="audio-button" type="button" data-upload-audio="${item.slot}">Subir audio</button><input class="hidden" type="file" data-audio-input="${item.slot}" accept="audio/*,.m4a,.mp3,.wav,.ogg,.webm"></div></div><span class="audio-status" id="audio-status-${item.slot}">${audio?'Audio guardado: '+escapeHtml(audio.name)+' · '+formatBytes(audio.size):'Aún no hay audio en esta entrevista.'}</span><div class="question-guide"><strong>Guion base</strong><ol>${questions.map(question=>`<li>${question}</li>`).join('')}</ol><span>Puedes formular repreguntas cuando una respuesta necesite mayor explicación.</span></div><div class="field transcription"><label for="transcription-${item.slot}">Transcripción de la entrevista</label><textarea id="transcription-${item.slot}" data-transcription="${item.slot}" maxlength="12000" placeholder="Escribe aquí la transcripción completa. Mantén las ideas de la persona entrevistada y distingue claramente preguntas y respuestas.">${escapeHtml(item.transcription)}</textarea></div></section>`;
    }).join('');
    $('projectNotes').value=state.projectNotes||'';
    document.querySelectorAll('[data-record]').forEach(button=>button.addEventListener('click',()=>toggleRecording(Number(button.dataset.record))));
    document.querySelectorAll('[data-upload-audio]').forEach(button=>button.addEventListener('click',()=>document.querySelector(`[data-audio-input="${button.dataset.uploadAudio}"]`).click()));
    document.querySelectorAll('[data-audio-input]').forEach(input=>input.addEventListener('change',()=>{const file=input.files&&input.files[0];if(file)uploadFile(file,'interview_audio',Number(input.dataset.audioInput));input.value='';}));
    document.querySelectorAll('[data-interviewee],[data-transcription]').forEach(field=>field.addEventListener('input',scheduleSave));
    $('projectNotes').addEventListener('input',scheduleSave);
    updateProgress();
  }

  function collectDocument() {
    const interviews=state.interviews.map((item,index)=>({slot:item.slot,kind:item.kind,interviewee:$('interviewee-'+(index+1)).value.trim(),transcription:$('transcription-'+(index+1)).value.trim(),audioFileId:item.audioFileId||''}));
    const writtenProducts=Object.fromEntries(writtenFieldIds.map(field=>[field,$(field).value.trim()]));
    return { interviews, projectNotes:$('projectNotes').value.trim(), writtenProducts };
  }

  function scheduleSave() { setSave('Cambios pendientes','');window.clearTimeout(saveTimer);saveTimer=window.setTimeout(saveNow,900); }
  function saveNow() {
    if(!student||!auth.currentUser)return Promise.resolve(true);
    window.clearTimeout(saveTimer);
    const documentData=collectDocument();state.interviews=documentData.interviews;state.projectNotes=documentData.projectNotes;state.writtenProducts=documentData.writtenProducts;
    const operation=async()=>{setSave('Guardando...','');try{const data=await api('save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(documentData)});state.updatedAt=data.updatedAt;setSave('Guardado en la nube','saved');updateProgress();return true;}catch(error){setSave('No se pudo guardar','error');return false;}};
    saveChain=saveChain.then(operation,operation);
    return saveChain;
  }

  function interviewComplete(item) { return Boolean(item.interviewee && item.transcription.trim().length>=80 && item.audioFileId); }
  function wordCount(value) { return String(value||'').trim().split(/\s+/).filter(Boolean).length; }
  function writtenSectionsCompleted(written) {
    return [
      written.interviewContext.length>=80&&written.interviewQuestions.length>=200,
      written.memoryText.length>=500,
      written.projectText.length>=400,
      written.farewellText.length>=300&&written.captions.length>=80
    ].filter(Boolean).length;
  }
  function updateWordCounts() {
    document.querySelectorAll('[data-count-for]').forEach(counter=>{
      const count=wordCount($(counter.dataset.countFor).value);
      counter.textContent=count+' '+(count===1?'palabra':'palabras');
      counter.dataset.state=count>=40?'target':'';
    });
  }
  function updateProgress() {
    const current=collectDocument();state.interviews=current.interviews;state.projectNotes=current.projectNotes;state.writtenProducts=current.writtenProducts;
    const completed=state.interviews.filter(interviewComplete).length;
    const writtenCompleted=writtenSectionsCompleted(state.writtenProducts);
    $('documentStatus').textContent=state.activity1Status==='submitted'?'Avance entregado · '+formatDate(state.activity1SubmittedAt):completed+' de 5 entrevistas completas';
    $('interviewTileStatus').textContent=state.activity1Status==='submitted'?'Avance entregado':completed+' de 5 completas';
    $('homeInterviewStatus').textContent=state.activity1Status==='submitted'?'Entregadas · '+formatDate(state.activity1SubmittedAt):completed+' de 5 completas';
    $('writingStatus').textContent=state.activity2Status==='submitted'?'Fase 1 entregada · '+formatDate(state.activity2SubmittedAt):writtenCompleted+' de 4 productos avanzados';
    $('writingTileStatus').textContent=state.activity2Status==='submitted'?'Fase 1 entregada':writtenCompleted+' de 4 productos';
    $('homeWritingStatus').textContent=state.activity2Status==='submitted'?'Fase 1 entregada':writtenCompleted+' de 4 avanzados';
    updateWordCounts();
    const audios=state.files.filter(file=>file.category==='interview_audio').length;
    const photos=state.files.filter(file=>file.category==='photo').length;
    const others=state.files.filter(file=>['document','other'].includes(file.category)).length;
    $('audioCount').textContent=audios+' '+(audios===1?'archivo':'archivos');$('photoCount').textContent=photos+' '+(photos===1?'archivo':'archivos');$('otherCount').textContent=others+' '+(others===1?'archivo':'archivos');
    const usedBytes=state.files.reduce((sum,file)=>sum+Number(file.size||0),0);
    $('storageSummary').textContent=state.files.length+' '+(state.files.length===1?'archivo':'archivos')+' · '+formatBytes(usedBytes)+' de 100 MB · '+formatBytes(Math.max(0,MAX_FILE_SIZE-usedBytes))+' disponibles';
    renderFiles();
  }

  function fileIcon(category){return category==='photo'?'IMG':category==='interview_audio'?'AUD':category==='document'?'DOC':'FILE';}
  function renderFiles(){
    const files=[...state.files].sort((a,b)=>b.createdAt-a.createdAt);
    $('fileList').innerHTML=files.length?files.map(file=>`<article class="file-row"><span class="tile-icon ${file.category==='interview_audio'?'audio':file.category==='photo'?'photo':'other'}">${fileIcon(file.category)}</span><div class="file-info"><strong>${escapeHtml(file.name)}</strong><span>${formatBytes(file.size)} · ${formatDate(file.createdAt)}${file.slot?' · Entrevista '+file.slot:''}</span></div><div class="file-actions"><button class="file-open" type="button" data-open-file="${escapeHtml(file.id)}">Abrir</button><button class="file-delete" type="button" data-delete-file="${escapeHtml(file.id)}">Eliminar</button></div></article>`).join(''):'<div class="empty-files">Todavía no has subido archivos a tu carpeta.</div>';
    document.querySelectorAll('[data-open-file]').forEach(button=>button.addEventListener('click',()=>openFile(button.dataset.openFile)));
    document.querySelectorAll('[data-delete-file]').forEach(button=>button.addEventListener('click',()=>deleteFile(button.dataset.deleteFile)));
  }

  function safeFileName(name){return String(name||'archivo').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9._-]+/g,'-').replace(/-+/g,'-').slice(-140);}
  function randomId(){return (crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2)).replace(/[^A-Za-z0-9_-]/g,'');}
  async function uploadFile(file,category,slot){
    if(!file||!student)return;if(file.size>MAX_FILE_SIZE){window.alert('El archivo supera el cupo total de 100 MB de la carpeta.');return;}
    const fileId=randomId();let prepared=null;
    $('uploadTitle').textContent=category==='interview_audio'?'Guardando audio':'Subiendo archivo';$('uploadFileName').textContent=file.name;$('uploadProgress').style.width='0%';$('uploadPercent').textContent='0%';$('uploadError').textContent='';$('closeUploadDialog').classList.add('hidden');$('uploadDialog').showModal();
    try{
      prepared=await api('prepare-upload',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fileId,name:file.name,size:file.size,category,slot:slot||0,contentType:file.type})});
      await auth.signInWithCustomToken(prepared.customToken);
      const path=prepared.storagePath;
      const reference=storage.ref(path);const task=reference.put(file,{contentType:file.type||'application/octet-stream',customMetadata:{ownerRut:cleanRut(student.rut),category,fileId,slot:String(slot||0)}});
      await new Promise((resolve,reject)=>task.on('state_changed',snapshot=>{const percent=Math.round(snapshot.bytesTransferred/snapshot.totalBytes*100);$('uploadProgress').style.width=percent+'%';$('uploadPercent').textContent=percent+'%';},reject,resolve));
      const data=await api('register-file',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fileId,storagePath:path,name:file.name,category,slot:slot||0,contentType:file.type})});
      if(category==='interview_audio'){state.files=state.files.filter(item=>!(item.category==='interview_audio'&&item.slot===slot));state.interviews[slot-1].audioFileId=data.file.id;$('audio-status-'+slot).textContent='Audio guardado: '+data.file.name+' · '+formatBytes(data.file.size);}state.files.push(data.file);$('uploadTitle').textContent='Archivo guardado';$('uploadPercent').textContent='100%';setTimeout(()=>$('uploadDialog').close(),650);setSave('Archivo guardado','saved');updateProgress();
    }catch(error){if(prepared)await api('cancel-upload',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fileId})}).catch(()=>{});$('uploadError').textContent=error.message||'No se pudo subir el archivo.';$('closeUploadDialog').classList.remove('hidden');setSave('Error al subir','error');}
  }

  async function openFile(fileId){try{const data=await api('file-url',{method:'GET'},{fileId});window.open(data.url,'_blank','noopener');}catch(error){window.alert(error.message);}}
  async function deleteFile(fileId){const file=state.files.find(item=>item.id===fileId);if(!file||!confirm('¿Eliminar "'+file.name+'" de tu carpeta?'))return;try{await api('delete-file',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fileId})});state.files=state.files.filter(item=>item.id!==fileId);state.interviews.forEach(item=>{if(item.audioFileId===fileId)item.audioFileId='';});renderInterviews();updateProgress();setSave('Archivo eliminado','saved');}catch(error){window.alert(error.message);}}

  async function toggleRecording(slot){
    if(activeRecorder){if(recordingSlot===slot){activeRecorder.stop();return;}window.alert('Detén la grabación actual antes de comenzar otra.');return;}
    if(!navigator.mediaDevices||!window.MediaRecorder){window.alert('Este navegador no permite grabar audio. Usa la opción Subir audio.');return;}
    try{activeStream=await navigator.mediaDevices.getUserMedia({audio:true});recordingChunks=[];recordingSlot=slot;recordingStartedAt=Date.now();activeRecorder=new MediaRecorder(activeStream);activeRecorder.ondataavailable=event=>{if(event.data.size)recordingChunks.push(event.data);};activeRecorder.onstop=finishRecording;activeRecorder.start();const button=document.querySelector(`[data-record="${slot}"]`);button.textContent='Detener grabación';button.classList.add('recording');recordingTimer=setInterval(()=>{$('audio-status-'+slot).textContent='Grabando... '+Math.floor((Date.now()-recordingStartedAt)/1000)+' s';},1000);}catch(_){window.alert('No fue posible acceder al micrófono. Revisa el permiso del navegador o sube un audio grabado con el teléfono.');}
  }
  async function finishRecording(){const slot=recordingSlot;clearInterval(recordingTimer);activeStream.getTracks().forEach(track=>track.stop());const mime=activeRecorder.mimeType||'audio/webm';const extension=mime.includes('ogg')?'ogg':mime.includes('mp4')?'m4a':'webm';const file=new File(recordingChunks,[`entrevista-${slot}-${Date.now()}.${extension}`],{type:mime});activeRecorder=null;activeStream=null;recordingSlot=0;const button=document.querySelector(`[data-record="${slot}"]`);button.textContent='Grabar audio';button.classList.remove('recording');await uploadFile(file,'interview_audio',slot);}

  async function submitActivity(){
    $('submitError').textContent='';const saved=await saveNow();if(!saved){$('submitError').textContent='No fue posible guardar los cambios. Revisa tu conexión y vuelve a intentar.';return;}const incomplete=state.interviews.find(item=>!interviewComplete(item));if(incomplete){$('submitError').textContent='Completa las cinco entrevistas con nombre, audio y una transcripción de al menos 80 caracteres.';document.querySelector(`[data-slot="${incomplete.slot}"]`).scrollIntoView({behavior:'smooth',block:'start'});return;}if(!confirm('¿Entregar este avance para revisión? Podrás continuar corrigiéndolo después.'))return;
    $('submitActivityButton').disabled=true;try{const data=await api('submit-activity1',{method:'POST'});state.activity1Status='submitted';state.activity1SubmittedAt=data.submittedAt;updateProgress();$('successTitle').textContent='Entrevistas entregadas';$('successMessage').textContent='Las cinco entrevistas quedaron registradas para revisión. Puedes continuar corrigiéndolas.';$('successDialog').showModal();setSave('Avance entregado','saved');}catch(error){$('submitError').textContent=error.message;}finally{$('submitActivityButton').disabled=false;}
  }

  async function submitWriting(){
    $('submitWritingError').textContent='';
    const saved=await saveNow();
    if(!saved){$('submitWritingError').textContent='No fue posible guardar los cambios. Revisa tu conexión y vuelve a intentar.';return;}
    if(!confirm('¿Enviar los productos escritos para revisión? Podrás continuar corrigiéndolos después.'))return;
    $('submitWritingButton').disabled=true;
    try{const data=await api('submit-activity2',{method:'POST'});state.activity2Status='submitted';state.activity2SubmittedAt=data.submittedAt;updateProgress();$('successTitle').textContent='Productos escritos entregados';$('successMessage').textContent='La fase 1 quedó registrada para revisión y para el trabajo de diagramación en Gráfica.';$('successDialog').showModal();setSave('Fase 1 entregada','saved');}
    catch(error){$('submitWritingError').textContent=error.message;}
    finally{$('submitWritingButton').disabled=false;}
  }

  function openModel(button){$('modelDialogTitle').textContent=button.dataset.modelTitle||'Modelo de página';$('modelDialogImage').src=button.dataset.modelImage;$('modelDialogImage').alt=button.dataset.modelTitle||'Modelo ampliado de página del anuario';$('modelDialog').showModal();}

  function showView(name){document.querySelectorAll('.app-view').forEach(view=>view.classList.add('hidden'));document.querySelectorAll('.tab').forEach(tab=>tab.classList.toggle('active',tab.dataset.view===name));$('view'+name.charAt(0).toUpperCase()+name.slice(1)).classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}
  async function login(event){event.preventDefault();const rut=cleanRut($('rutInput').value);$('loginError').textContent='';$('loginError').dataset.state='';if(rut.length<8){$('loginError').textContent='Ingresa un RUN válido.';return;}if(!navigator.onLine){updateNetworkStatus();return;}loginPending=true;$('loginButton').disabled=true;$('loginButton').textContent='Abriendo carpeta...';try{const data=await api('login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({rut})});await persistenceReady;await auth.signInWithCustomToken(data.customToken);student=data.student;state=normalizeState(data.state);$('studentName').textContent=student.name;$('studentMeta').textContent=student.course+' · '+student.rut;$('folderTitle').textContent='Carpeta de '+student.name.split(' ')[0].toLowerCase().replace(/^./,letter=>letter.toUpperCase());renderWrittenProducts();renderInterviews();updateProgress();$('loginView').classList.add('hidden');$('publicBar').classList.add('hidden');$('workspace').classList.remove('hidden');setSave(state.updatedAt?'Carpeta recuperada':'Carpeta creada','saved');}catch(error){$('loginError').textContent=friendlyError(error);$('loginError').dataset.state=navigator.onLine?'error':'offline';}finally{loginPending=false;$('loginButton').textContent='Ingresar a mi carpeta';updateNetworkStatus();}}
  async function logout(){window.clearTimeout(saveTimer);if(student)await saveNow().catch(()=>{});if(activeRecorder)activeRecorder.stop();await auth.signOut();student=null;state=null;$('workspace').classList.add('hidden');$('loginView').classList.remove('hidden');$('publicBar').classList.remove('hidden');$('rutInput').value='';updateNetworkStatus();window.scrollTo(0,0);}

  $('loginForm').addEventListener('submit',login);$('rutInput').addEventListener('input',event=>{event.target.value=formatRut(event.target.value);});$('logoutButton').addEventListener('click',logout);$('saveNowButton').addEventListener('click',saveNow);$('saveWritingButton').addEventListener('click',saveNow);$('submitActivityButton').addEventListener('click',submitActivity);$('submitWritingButton').addEventListener('click',submitWriting);$('generalUploadButton').addEventListener('click',()=>$('generalFileInput').click());$('generalFileInput').addEventListener('change',()=>{const file=$('generalFileInput').files&&$('generalFileInput').files[0];if(file)uploadFile(file,$('generalCategory').value,0);$('generalFileInput').value='';});$('closeUploadDialog').addEventListener('click',()=>$('uploadDialog').close());$('closeSuccessDialog').addEventListener('click',()=>$('successDialog').close());$('closeModelDialog').addEventListener('click',()=>$('modelDialog').close());$('modelDialog').addEventListener('click',event=>{if(event.target===$('modelDialog'))$('modelDialog').close();});document.querySelectorAll('[data-written]').forEach(field=>field.addEventListener('input',()=>{scheduleSave();updateWordCounts();}));document.querySelectorAll('[data-model-image]').forEach(button=>button.addEventListener('click',()=>openModel(button)));document.querySelectorAll('[data-view]').forEach(tab=>tab.addEventListener('click',()=>showView(tab.dataset.view)));document.querySelectorAll('[data-open-view]').forEach(button=>button.addEventListener('click',()=>showView(button.dataset.openView)));
  window.addEventListener('offline',updateNetworkStatus);
  window.addEventListener('online',updateNetworkStatus);
  updateNetworkStatus();
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&student){window.clearTimeout(saveTimer);saveNow();}});
}());
