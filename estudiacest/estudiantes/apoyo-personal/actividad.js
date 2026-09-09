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
  const ROUTE = '/estudiantes/apoyo-personal/';
  const VARIANT = 'guided-access-2026';
  const params = new URLSearchParams(location.search);
  const sessionNumber = params.get('sesion') || '';
  const preview = params.get('preview') === '1' && ['localhost', '127.0.0.1'].includes(location.hostname);
  const catalog = window.SIMCE_PERSONAL_GUIDED_DATA && window.SIMCE_PERSONAL_GUIDED_DATA.sessions;
  const activity = catalog && catalog[sessionNumber];
  const $ = (id) => document.getElementById(id);
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));

  let user = null;
  let attempt = null;
  let currentQuestion = 0;
  let saveTimer = null;
  let saveQueue = Promise.resolve();
  let submitted = false;
  let submitting = false;
  const answers = {};

  if (!activity) {
    $('loading').textContent = 'Esta sesión no está disponible. Vuelve a tu ruta para elegir otra actividad.';
    return;
  }
  const TOTAL = activity.questions.length;

  if (!firebase.apps.length) firebase.initializeApp(CONFIG);
  const auth = firebase.auth();
  const db = firebase.database();
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(() => null);

  function renderActivity() {
    document.title = `${activity.title} | Estudia CEST`;
    $('sessionLabel').textContent = `Ruta personal · Sesión ${sessionNumber}`;
    $('title').textContent = activity.title;
    $('objective').textContent = activity.objective;
    $('stimulusLabel').textContent = activity.stimulusLabel;
    $('stimulusTitle').textContent = activity.stimulusTitle;
    $('steps').innerHTML = activity.steps.map((step, index) => `
      <div class="step"><span class="step-number">${index + 1}</span><p>${escapeHtml(step)}</p></div>
    `).join('');
    $('stimulus').innerHTML = activity.stimulus.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');

    if (activity.table) {
      $('tableWrap').hidden = false;
      $('tableWrap').innerHTML = `<table><thead><tr>${activity.table.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead><tbody>${activity.table.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    }

    const image = activity.image
      ? `<img src="${escapeHtml(activity.image.src)}" alt="${escapeHtml(activity.image.alt)}">`
      : '';
    $('visualSupport').innerHTML = `${image}<h3>${escapeHtml(activity.visual.title)}</h3>${activity.visual.items.map((item) => `<div class="visual-item">${escapeHtml(item)}</div>`).join('')}`;
    renderQuestion();
  }

  function renderQuestion() {
    const question = activity.questions[currentQuestion];
    $('questionNumber').textContent = `Pregunta ${currentQuestion + 1} de ${activity.questions.length}`;
    $('questionSkill').textContent = question.skill;
    $('questionHeading').textContent = question.prompt;
    $('questionCue').innerHTML = `<b>Pista de relectura:</b> ${escapeHtml(question.cue)}`;
    $('options').innerHTML = Object.entries(question.options).map(([letter, text]) => `
      <button class="option${answers[question.id] === letter ? ' selected' : ''}" type="button" role="radio" aria-checked="${answers[question.id] === letter}" data-answer="${letter}">
        <span class="letter">${letter}</span><span>${escapeHtml(text)}</span>
      </button>
    `).join('');
    $('options').querySelectorAll('[data-answer]').forEach((button) => {
      button.addEventListener('click', () => selectAnswer(question.id, button.dataset.answer));
    });
    $('previous').disabled = currentQuestion === 0 || submitted;
    $('next').hidden = currentQuestion === activity.questions.length - 1;
    $('next').disabled = !answers[question.id] || submitted;
    $('submit').hidden = currentQuestion !== activity.questions.length - 1;
    $('submit').disabled = submitted || submitting || Object.keys(answers).length !== activity.questions.length;
    updateProgress();
  }

  function selectAnswer(questionId, letter) {
    if (submitted || submitting) return;
    answers[questionId] = letter;
    hideError();
    renderQuestion();
    scheduleSave();
  }

  function updateProgress() {
    const answered = activity.questions.filter((question) => answers[question.id]).length;
    $('progressBar').style.width = `${Math.round((answered / activity.questions.length) * 100)}%`;
    $('progressText').textContent = `${answered} de ${activity.questions.length}`;
  }

  function setSaveState(message) {
    $('saveState').textContent = message;
  }

  function showError(message) {
    $('errorMessage').textContent = message;
    $('errorMessage').hidden = false;
  }

  function hideError() {
    $('errorMessage').hidden = true;
    $('errorMessage').textContent = '';
  }

  async function callApi(action, method = 'GET', body = null) {
    if (preview) {
      return { ok:true, session:{ active:true, released:false }, student:{ nombre:'Vista previa', curso:'2° Medio' }, attempt:null, result:null };
    }
    const token = await user.getIdToken();
    const response = await fetch(`${API}?action=${encodeURIComponent(action)}&sesion=${encodeURIComponent(sessionNumber)}`, {
      method,
      headers:{ Authorization:`Bearer ${token}`, 'Content-Type':'application/json' },
      body:body ? JSON.stringify({ ...body, sesion:sessionNumber }) : undefined
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(json.error || 'No fue posible conectar.');
      error.status = response.status;
      error.completada = json.completada === true;
      throw error;
    }
    return json;
  }

  function scheduleSave() {
    if (preview || submitted || submitting || !user) return;
    clearTimeout(saveTimer);
    setSaveState('Guardando…');
    saveTimer = setTimeout(() => {
      saveQueue = saveQueue
        .catch(() => null)
        .then(() => callApi('personal-guided-save', 'POST', { answers }))
        .then(() => setSaveState('Avance guardado'))
        .catch((error) => {
          setSaveState('Guardado pendiente');
          showError(error.message);
        });
    }, 500);
  }

  function restore(savedAttempt) {
    attempt = savedAttempt;
    if (!attempt || attempt.variant !== VARIANT) return;
    Object.assign(answers, attempt.answers || {});
    submitted = attempt.completada === true;
  }

  function lockCompleted(result) {
    submitted = true;
    clearTimeout(saveTimer);
    document.querySelectorAll('.option, #previous, #next, #submit').forEach((control) => { control.disabled = true; });
    setSaveState('Entrega confirmada');
    $('resultCopy').textContent = result
      ? `Resultado publicado: ${result.score} de ${result.total} respuestas correctas.`
      : 'El resultado se mostrará cuando el docente lo publique.';
    $('deliveryConfirmation').hidden = false;
  }

  async function submitActivity() {
    if (submitted) {
      $('deliveryConfirmation').hidden = false;
      return;
    }
    const missing = activity.questions.filter((question) => !answers[question.id]);
    if (missing.length) {
      showError(`Faltan ${missing.length} preguntas. Revisa las que aún no tienen alternativa.`);
      currentQuestion = activity.questions.findIndex((question) => question.id === missing[0].id);
      renderQuestion();
      return;
    }
    if (preview) {
      showError('La vista previa no registra entregas.');
      return;
    }

    submitting = true;
    hideError();
    renderQuestion();
    setSaveState('Registrando entrega…');
    clearTimeout(saveTimer);
    saveTimer = null;
    try {
      await saveQueue.catch(() => null);
      await callApi('personal-guided-submit', 'POST', { answers });
      const readback = await callApi('personal-guided-state');
      if (!readback.attempt || readback.attempt.completada !== true) throw new Error('La entrega no pudo confirmarse.');
      lockCompleted(readback.result);
    } catch (error) {
      if (error.completada) {
        const readback = await callApi('personal-guided-state');
        if (readback.attempt && readback.attempt.completada === true) {
          lockCompleted(readback.result);
          return;
        }
      }
      showError(error.message);
      setSaveState('No se pudo entregar');
    } finally {
      submitting = false;
      renderQuestion();
    }
  }

  function stopSpeech(button, label) {
    button.dataset.speaking = 'false';
    button.textContent = label;
  }

  function speak(text, button, label) {
    if (!('speechSynthesis' in window)) {
      showError('La lectura en voz alta no está disponible en este navegador.');
      return;
    }
    if (button.dataset.speaking === 'true') {
      window.speechSynthesis.cancel();
      stopSpeech(button, label);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-CL';
    utterance.rate = 0.9;
    button.dataset.speaking = 'true';
    button.textContent = '■';
    utterance.onend = () => stopSpeech(button, label);
    utterance.onerror = () => stopSpeech(button, label);
    window.speechSynthesis.speak(utterance);
  }

  async function start(activeUser) {
    user = activeUser;
    try {
      const state = await callApi('personal-guided-state');
      if (!state.session.active && !(state.attempt && state.attempt.completada)) {
        throw new Error('Esta sesión está cerrada por el docente.');
      }
      restore(state.attempt);
      $('studentLine').textContent = `${state.student.nombre} · ${state.student.curso}`;
      $('loading').hidden = true;
      $('app').hidden = false;
      renderQuestion();
      setSaveState(preview ? 'Vista previa local' : state.attempt ? 'Avance cargado' : 'Lista para comenzar');
      if (submitted) lockCompleted(state.result);
    } catch (error) {
      $('loading').textContent = error.message;
    }
  }

  renderActivity();
  $('previous').addEventListener('click', () => { if (currentQuestion > 0) { currentQuestion -= 1; renderQuestion(); $('questionTool').scrollIntoView({ behavior:'smooth', block:'start' }); } });
  $('next').addEventListener('click', () => { if (answers[activity.questions[currentQuestion].id] && currentQuestion < activity.questions.length - 1) { currentQuestion += 1; renderQuestion(); $('questionTool').scrollIntoView({ behavior:'smooth', block:'start' }); } });
  $('submit').addEventListener('click', submitActivity);
  $('readStimulus').addEventListener('click', () => speak(`${activity.stimulusTitle}. ${activity.stimulus.join(' ')}`, $('readStimulus'), 'Escuchar texto'));
  $('readQuestion').addEventListener('click', () => {
    const question = activity.questions[currentQuestion];
    const options = Object.entries(question.options).map(([letter, text]) => `${letter}. ${text}`).join(' ');
    speak(`${question.prompt} ${options}`, $('readQuestion'), '▶');
  });
  $('logout').addEventListener('click', () => auth.signOut().then(() => { location.href = '/lecturas/'; }));
  initStudentForcedRefresh({ auth, db, base:'plataforma_estudiantes' });

  if (preview) {
    start(null);
  } else {
    auth.onAuthStateChanged((activeUser) => {
      if (!activeUser) {
        const next = `${location.pathname}?sesion=${encodeURIComponent(sessionNumber)}`;
        location.replace(`/lecturas/?next=${encodeURIComponent(next)}`);
        return;
      }
      start(activeUser);
    });
  }
})();
