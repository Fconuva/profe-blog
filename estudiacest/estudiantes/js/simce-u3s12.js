(() => {
  'use strict';

  const CONFIG = {
    apiKey:'AIzaSyCuDQ_iHDHmTd8bPeqUbsXQqdxw2SObt8w',
    authDomain:'estudiacest.firebaseapp.com',
    databaseURL:'https://estudiacest-default-rtdb.firebaseio.com',
    projectId:'estudiacest',
    appId:'1:999002169815:web:51203237bc77c2e74deb92'
  };
  const API = '/api/estudiantes';
  const SESSION_ID = 'sesion-u3-12';
  const QUESTION_IDS = Array.from({ length:24 }, (_, index) => `q${index + 1}`);
  const QUESTIONS = QUESTION_IDS;
  const WORK_IDS = ['g1', 'g2', 'a1', 'a2', 'a3', 'a4'];
  const META_IDS = [...WORK_IDS, 'm1', 'm2', 'm3'];
  const META_MIN = 25;
  const LOCAL_PREVIEW = ['localhost', '127.0.0.1'].includes(location.hostname) && new URLSearchParams(location.search).get('preview') === '1';
  const LOGIN_URL = `/lecturas/?next=${encodeURIComponent('/estudiantes/guia-u3-s12-entrevista.html')}`;
  const $ = (id) => document.getElementById(id);

  let user = null;
  let submitted = false;
  let submitting = false;
  let startedAt = Date.now();
  let saveTimer = null;
  let saveQueue = Promise.resolve();
  const answers = {};

  if (!firebase.apps.length) firebase.initializeApp(CONFIG);
  const auth = firebase.auth();
  const db = firebase.database();
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(() => null);
  if (typeof initStudentForcedRefresh === 'function') initStudentForcedRefresh({ auth, db, base:'plataforma_estudiantes' });

  function collect() {
    return {
      answers:{ ...answers },
      metaResponses:Object.fromEntries(META_IDS.map((id) => [id, $(id).value.trim()])),
      startedAt,
      total:QUESTIONS.length
    };
  }

  function localKey() {
    return `${SESSION_ID}-${user ? user.uid : 'preview'}-draft`;
  }

  function setMessage(message) {
    const span = $('saveState').querySelector('span');
    if (span) span.textContent = message;
  }

  function updateUi() {
    const answered = QUESTION_IDS.filter((id) => answers[id]).length;
    const workReady = WORK_IDS.filter((id) => $(id).value.trim().length >= 80).length;
    const metaReady = ['m1','m2','m3'].filter((id) => $(id).value.trim().length >= META_MIN).length;
    $('progressText').textContent = `${answered}/24 preguntas · ${workReady}/6 tareas · ${metaReady}/3 cierres`;
    $('progressFill').style.width = `${Math.round(((answered + workReady + metaReady) / 33) * 100)}%`;
    META_IDS.forEach((id) => { $(`count-${id}`).textContent = $(id).value.length; });
  }

  async function callApi(action, method = 'GET', body = null) {
    if (LOCAL_PREVIEW) {
      return { ok:true, student:{ nombre:'Vista previa', curso:'2° Medio' }, session:{ active:true, released:false }, attempt:null, result:null };
    }
    const token = await user.getIdToken();
    const response = await fetch(`${API}?action=${encodeURIComponent(action)}`, {
      method,
      headers:{ Authorization:`Bearer ${token}`, 'Content-Type':'application/json' },
      body:body ? JSON.stringify(body) : undefined
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(json.error || 'No fue posible conectar con la plataforma.');
      error.status = response.status;
      error.fields = json.fields || [];
      error.completada = json.completada === true;
      throw error;
    }
    return json;
  }

  function rememberLocal() {
    if (submitted) return;
    try { localStorage.setItem(localKey(), JSON.stringify({ ...collect(), savedAt:Date.now() })); } catch (_) {}
  }

  function clearLocal() {
    try { localStorage.removeItem(localKey()); } catch (_) {}
  }

  function scheduleSave() {
    if (submitted || submitting) return;
    rememberLocal();
    updateUi();
    if (LOCAL_PREVIEW || !user) {
      setMessage(LOCAL_PREVIEW ? 'Vista previa local: el envío está desactivado.' : 'Avance guardado en este dispositivo.');
      return;
    }
    clearTimeout(saveTimer);
    setMessage('Guardando avance…');
    saveTimer = setTimeout(() => {
      saveQueue = saveQueue
        .catch(() => null)
        .then(() => callApi('simce-u3s12-save', 'POST', collect()))
        .then(() => setMessage('Avance guardado automáticamente.'))
        .catch((error) => setMessage(`${error.message} Tu avance sigue en este dispositivo.`));
    }, 600);
  }

  function restore(attempt) {
    const remote = attempt || null;
    let local = null;
    try { local = JSON.parse(localStorage.getItem(localKey()) || 'null'); } catch (_) {}
    const useLocal = local && (!remote || (!remote.completada && Number(local.savedAt || 0) > Number(remote.updatedAt || 0)));
    const source = useLocal ? local : remote;
    if (!source) return;
    Object.assign(answers, source.answers || {});
    META_IDS.forEach((id) => { $(id).value = (source.metaResponses && source.metaResponses[id]) || ''; });
    startedAt = Number(source.startedAt || startedAt);
    submitted = source.submitted === true && source.completada === true;
    QUESTION_IDS.forEach((id) => {
      const selected = document.querySelector(`input[name="${id}"][value="${answers[id] || ''}"]`);
      if (selected) {
        selected.checked = true;
        selected.closest('.option').classList.add('selected');
      }
    });
    if (useLocal && !submitted) setMessage('Recuperamos el avance guardado en este dispositivo.');
  }

  function lockCompleted(showModal = false) {
    submitted = true;
    document.querySelectorAll('input[type="radio"], textarea').forEach((control) => { control.disabled = true; });
    $('submit').disabled = true;
    $('submit').textContent = 'Actividad entregada';
    $('doneBanner').style.display = 'block';
    setMessage('Entrega confirmada.');
    if (showModal) $('confirmationModal').classList.add('open');
  }

  function markMissing(fields) {
    document.querySelectorAll('.option.invalid, textarea.invalid').forEach((element) => element.classList.remove('invalid'));
    fields.forEach((id) => {
      if (id.startsWith('q')) document.querySelector(`[data-question="${id}"] .options`)?.querySelectorAll('.option').forEach((option) => option.classList.add('invalid'));
      else $(id)?.classList.add('invalid');
    });
    const first = fields[0];
    const target = first && (first.startsWith('q') ? document.querySelector(`[data-question="${first}"]`) : $(first));
    target?.scrollIntoView({ behavior:'smooth', block:'center' });
  }

  function validate() {
    const missing = QUESTION_IDS.filter((id) => !answers[id]);
    const shortMeta = META_IDS.filter((id) => $(id).value.trim().length < (WORK_IDS.includes(id) ? 80 : META_MIN));
    const fields = [...missing, ...shortMeta];
    markMissing(fields);
    if (!fields.length) return true;
    setMessage(`Faltan ${missing.length} preguntas y ${shortMeta.length} respuestas de cierre por completar.`);
    return false;
  }

  async function submit() {
    if (submitted || submitting || !validate()) return;
    if (LOCAL_PREVIEW) {
      setMessage('Vista previa local: la validación está correcta y la entrega está desactivada.');
      return;
    }
    if (!user) return;
    if (!window.confirm('¿Confirmas tus 24 respuestas, seis tareas escritas y tres cierres? Después no podrás modificarlos.')) return;
    submitting = true;
    $('submit').disabled = true;
    $('submit').textContent = 'Confirmando…';
    setMessage('Registrando y comprobando la entrega…');
    clearTimeout(saveTimer);
    try {
      await saveQueue.catch(() => null);
      await callApi('simce-u3s12-submit', 'POST', collect());
      const readback = await callApi('simce-u3s12-state');
      if (!readback.attempt || readback.attempt.submitted !== true || readback.attempt.completada !== true) {
        throw new Error('La plataforma aún no confirma ambas marcas de entrega. Puedes reintentar.');
      }
      clearLocal();
      lockCompleted(true);
    } catch (error) {
      rememberLocal();
      if (error.completada) {
        try {
          const readback = await callApi('simce-u3s12-state');
          if (readback.attempt && readback.attempt.submitted && readback.attempt.completada) {
            clearLocal();
            lockCompleted(true);
            return;
          }
        } catch (_) {}
      }
      markMissing(error.fields || []);
      setMessage(`${error.message} Tu avance no se perdió.`);
      $('submit').disabled = false;
      $('submit').textContent = 'Confirmar y entregar';
    } finally {
      submitting = false;
    }
  }

  document.querySelectorAll('.option input').forEach((input) => {
    input.addEventListener('change', () => {
      if (submitted) return;
      answers[input.name] = input.value;
      document.querySelectorAll(`input[name="${input.name}"]`).forEach((radio) => radio.closest('.option').classList.toggle('selected', radio.checked));
      document.querySelectorAll(`[data-question="${input.name}"] .option`).forEach((option) => option.classList.remove('invalid'));
      scheduleSave();
    });
  });
  META_IDS.forEach((id) => $(id).addEventListener('input', () => { $(id).classList.remove('invalid'); scheduleSave(); }));
  $('submit').addEventListener('click', submit);
  window.addEventListener('online', () => { if (!submitted) scheduleSave(); });
  updateUi();

  async function start(activeUser) {
    user = activeUser;
    try {
      const state = await callApi('simce-u3s12-state');
      if (!state.session.active && !(state.attempt && state.attempt.completada)) throw new Error('Esta clase está cerrada por el docente.');
      restore(state.attempt);
      updateUi();
    if (submitted) lockCompleted(false);
      else if (!LOCAL_PREVIEW) setMessage(`Avance disponible para ${state.student.nombre} · ${state.student.curso}.`);
    } catch (error) {
      setMessage(error.message);
      $('submit').disabled = true;
    }
  }

  if (LOCAL_PREVIEW) start(null);
  else auth.onAuthStateChanged((activeUser) => {
    if (!activeUser) {
      location.replace(LOGIN_URL);
      return;
    }
    start(activeUser);
  });
})();
