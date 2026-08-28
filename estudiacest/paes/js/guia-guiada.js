(function () {
  'use strict';

  const config = window.GUIDED_GUIDE_CONFIG;
  const AUTHORIZED_RUT = '229327739';
  const VARIANT = 'guided-access-2026';
  const TOTAL = config.questions.length;
  const $ = (id) => document.getElementById(id);
  let student = null;
  let currentQuestion = 0;
  let isSubmitted = false;
  let resultReleased = false;
  let draftTimer = null;
  let saveQueue = Promise.resolve();

  function cleanRut(value) {
    return (value || '').replace(/[^0-9kK]/g, '').toUpperCase();
  }

  function formatRut(value) {
    const clean = cleanRut(value);
    if (clean.length < 2) return clean;
    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);
    return body.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv;
  }

  function validRut(value) {
    const clean = cleanRut(value);
    if (clean.length < 8 || clean.length > 9) return false;
    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);
    let sum = 0;
    let multiplier = 2;
    for (let i = body.length - 1; i >= 0; i -= 1) {
      sum += Number(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    const result = 11 - (sum % 11);
    const expected = result === 11 ? '0' : result === 10 ? 'K' : String(result);
    return dv === expected;
  }

  function storageKey() {
    return `paes_g${config.guideId}_guiada_${student.rut}`;
  }

  function freshState() {
    return { answers: {}, startedAt: Date.now(), submitted: false };
  }

  function readState() {
    let value = null;
    try { value = JSON.parse(localStorage.getItem(storageKey())); } catch (_) { value = null; }
    if (!value || typeof value !== 'object') value = freshState();
    value.answers = value.answers || {};
    return value;
  }

  function storeState(value) {
    localStorage.setItem(storageKey(), JSON.stringify(value));
  }

  function renderQuestions() {
    const host = $('questionsHost');
    host.innerHTML = '';
    config.questions.forEach((question, index) => {
      const article = document.createElement('article');
      article.className = 'question' + (index === 0 ? ' active' : '');
      article.dataset.q = String(question.n);
      article.innerHTML = `
        <div class="question-head">
          <span class="qnum">${question.n}</span>
          <h3>${question.text}</h3>
        </div>
        <div class="scan-cue">Mira ${question.cue}.</div>
        <ul class="options">
          ${Object.entries(question.options).map(([letter, text]) => `
            <li class="option" tabindex="0" role="button" aria-pressed="false" data-letter="${letter}">
              <span class="letter">${letter}</span><span class="option-text">${text}</span>
            </li>`).join('')}
        </ul>
        <div class="feedback" id="feedback-${question.n}"></div>`;
      host.appendChild(article);
    });

    document.querySelectorAll('.option').forEach((option) => {
      const choose = () => selectAnswer(option.closest('.question').dataset.q, option.dataset.letter);
      option.addEventListener('click', choose);
      option.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          choose();
        }
      });
    });
  }

  function setupReadAloud() {
    if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance !== 'function') return;
    document.querySelectorAll('.reading').forEach((reading, index) => {
      if (reading.querySelector('.read-aloud')) return;
      const controls = document.createElement('div');
      controls.className = 'reading-tools';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'read-aloud';
      button.setAttribute('aria-label', `Escuchar lectura ${index + 1}`);
      button.textContent = 'Escuchar lectura';
      controls.appendChild(button);
      reading.prepend(controls);

      button.addEventListener('click', () => {
        if (button.dataset.playing === 'true') {
          window.speechSynthesis.cancel();
          button.dataset.playing = 'false';
          button.textContent = 'Escuchar lectura';
          return;
        }
        document.querySelectorAll('.read-aloud').forEach((other) => {
          other.dataset.playing = 'false';
          other.textContent = 'Escuchar lectura';
        });
        window.speechSynthesis.cancel();
        const parts = reading.querySelectorAll('h2, .paragraph p');
        const text = Array.from(parts).map((node) => node.textContent.trim()).join('. ');
        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.lang = 'es-CL';
        utterance.rate = 0.9;
        utterance.onend = utterance.onerror = () => {
          button.dataset.playing = 'false';
          button.textContent = 'Escuchar lectura';
        };
        button.dataset.playing = 'true';
        button.textContent = 'Detener lectura';
        window.speechSynthesis.speak(utterance);
      });
    });
  }

  function selectAnswer(questionId, letter) {
    if (isSubmitted) return;
    const state = readState();
    state.answers[questionId] = letter;
    storeState(state);
    paintAnswers();
    updateProgress();
    scheduleSave();
  }

  function paintAnswers() {
    const answers = readState().answers;
    document.querySelectorAll('.question').forEach((question) => {
      question.querySelectorAll('.option').forEach((option) => {
        const selected = answers[question.dataset.q] === option.dataset.letter;
        option.classList.toggle('selected', selected);
        option.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
    });
  }

  function showQuestion(index, moveFocus) {
    currentQuestion = Math.max(0, Math.min(TOTAL - 1, index));
    document.querySelectorAll('.question').forEach((question, questionIndex) => {
      question.classList.toggle('active', questionIndex === currentQuestion);
    });
    $('questionPosition').textContent = `Pregunta ${currentQuestion + 1} de ${TOTAL}`;
    $('progressFill').style.width = `${((currentQuestion + 1) / TOTAL) * 100}%`;
    $('previousQuestion').style.visibility = currentQuestion === 0 ? 'hidden' : 'visible';
    $('nextQuestion').textContent = currentQuestion === TOTAL - 1 ? 'Volver a la primera' : 'Siguiente';
    if (moveFocus) {
      const active = document.querySelector('.question.active');
      if (active) active.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function updateProgress() {
    const answered = Object.keys(readState().answers).length;
    $('answeredStatus').textContent = `${answered} de ${TOTAL} respondidas`;
    $('answeredInfo').textContent = `${answered} de ${TOTAL} respuestas registradas`;
  }

  function setSaveStatus(text, color) {
    $('savedState').textContent = text;
    if (color) $('savedState').style.color = color;
  }

  function payload(draft) {
    const state = readState();
    return {
      rut: student.rut,
      nombre: student.nombre,
      curso: student.curso,
      guiaId: config.guideId,
      answers: state.answers,
      dev: { ruta: 'guiada', version: VARIANT },
      correct: 0,
      total: TOTAL,
      score: 0,
      draft: Boolean(draft)
    };
  }

  async function saveDraft() {
    if (!student || isSubmitted) return;
    setSaveStatus('Guardando...');
    const request = () => fetch('/api/paes?action=submit-guia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload(true))
    }).then(async (response) => {
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'No se pudo guardar');
      }
    });
    saveQueue = saveQueue.catch(() => {}).then(request);
    try {
      await saveQueue;
      setSaveStatus('Guardado en línea', 'var(--green)');
    } catch (_) {
      setSaveStatus('Guardado en este equipo', 'var(--red)');
    }
  }

  function scheduleSave() {
    clearTimeout(draftTimer);
    setSaveStatus('Guardando...');
    draftTimer = setTimeout(saveDraft, 550);
  }

  async function fetchCloudState() {
    const response = await fetch(`/api/paes?action=get-guia-state&guiaId=${config.guideId}&rut=${encodeURIComponent(student.rut)}`);
    if (!response.ok) throw new Error('No fue posible recuperar el avance');
    return response.json();
  }

  function mergeCloudState(data) {
    if (!data || !data.attempt) return;
    const attempt = data.attempt;
    if (attempt.variant !== VARIANT) return;
    const state = readState();
    state.answers = { ...(attempt.answers || {}), ...(state.answers || {}) };
    state.submitted = Boolean(attempt.completada || attempt.submitted || attempt.status === 'sent');
    storeState(state);
    isSubmitted = state.submitted;
    resultReleased = Boolean(data.released && attempt.result && data.answerKey);
    if (isSubmitted) lockSubmitted(attempt);
    if (resultReleased) showResult(attempt.result, data.answerKey, data.feedback || {});
  }

  function lockSubmitted(attempt) {
    isSubmitted = true;
    document.querySelectorAll('.option').forEach((option) => {
      option.style.pointerEvents = 'none';
      option.tabIndex = -1;
    });
    $('submitGuide').disabled = true;
    $('submitGuide').textContent = 'Guía entregada';
    $('deliveryConfirmation').classList.add('show');
    if (attempt && attempt.completadaAt) {
      $('deliveryMessage').textContent = `Entrega registrada el ${new Date(attempt.completadaAt).toLocaleString('es-CL')}.`;
    } else {
      $('deliveryMessage').textContent = 'Entrega registrada.';
    }
  }

  function showResult(result, key, feedback) {
    $('resultBox').classList.add('show');
    $('resultScore').textContent = `${result.correct} / ${result.total}`;
    Object.entries(key || {}).forEach(([questionId, correct]) => {
      const question = document.querySelector(`.question[data-q="${questionId}"]`);
      if (!question) return;
      const selected = readState().answers[questionId];
      question.querySelectorAll('.option').forEach((option) => {
        if (option.dataset.letter === correct) option.classList.add('correct');
        else if (option.dataset.letter === selected) option.classList.add('wrong');
      });
      const box = $(`feedback-${questionId}`);
      if (box) {
        box.textContent = feedback[questionId] || 'Compara la alternativa con la pista indicada y revisa la palabra que cambia su sentido.';
        box.classList.add('show');
      }
    });
  }

  async function submitGuide() {
    if (!student || isSubmitted) return;
    const answered = Object.keys(readState().answers).length;
    if (answered < TOTAL && !window.confirm(`Has respondido ${answered} de ${TOTAL}. ¿Quieres entregar de todas formas?`)) return;

    const button = $('submitGuide');
    button.disabled = true;
    button.textContent = 'Entregando...';
    $('deliveryMessage').textContent = 'Confirmando la entrega...';
    try {
      clearTimeout(draftTimer);
      await saveQueue;
      const response = await fetch('/api/paes?action=submit-guia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload(false))
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.completada !== true) throw new Error(data.error || 'La entrega no fue confirmada');
      const readback = await fetchCloudState();
      if (!readback.attempt || readback.attempt.completada !== true) throw new Error('La entrega no quedó confirmada en el registro');
      const state = readState();
      state.submitted = true;
      state.submittedAt = data.submittedAt;
      storeState(state);
      lockSubmitted(readback.attempt);
      $('confirmationDialog').classList.add('show');
      resultReleased = Boolean(readback.released && readback.attempt.result && readback.answerKey);
      if (resultReleased) showResult(readback.attempt.result, readback.answerKey, readback.feedback || {});
    } catch (error) {
      button.disabled = false;
      button.textContent = `Entregar Guía ${config.guideId}`;
      $('deliveryMessage').textContent = `No se confirmó la entrega: ${error.message}`;
    }
  }

  async function findStudent(rut) {
    let roster = typeof NOMINAS_PAES !== 'undefined' ? [...NOMINAS_PAES] : [];
    try {
      const response = await fetch('/api/paes?action=get-nomina-extra');
      if (response.ok) {
        const data = await response.json();
        roster = roster.concat(data.nomina_extra || []);
      }
    } catch (_) {}
    return roster.find((entry) => cleanRut(entry.rut) === rut) || null;
  }

  async function canOpenScheduledGuide(rut) {
    if (config.respectGuideLock !== true) return true;
    const [configResponse, stateResponse] = await Promise.all([
      fetch(`/api/paes?action=get-guias-config&rut=${encodeURIComponent(rut)}`),
      fetch(`/api/paes?action=get-guia-state&guiaId=${encodeURIComponent(config.guideId)}&rut=${encodeURIComponent(rut)}`)
    ]);
    if (!configResponse.ok || !stateResponse.ok) throw new Error('No fue posible comprobar el acceso a la guía.');
    const access = await configResponse.json();
    const state = await stateResponse.json();
    const key = `g${config.guideId}`;
    const blocked = Boolean(access && access.config && access.config.blocked && access.config.blocked[key]);
    const allowed = Boolean(access && access.config && access.config.allowed && access.config.allowed[key]);
    const review = Boolean(state && state.released && state.attempt && state.attempt.completada);
    return !blocked || allowed || review;
  }

  function showError(message) {
    $('errorBox').textContent = message;
    $('errorBox').classList.add('show');
  }

  async function login(rut) {
    if (!validRut(rut)) {
      showError('Revisa el RUT y su dígito verificador.');
      return;
    }
    if (rut !== AUTHORIZED_RUT) {
      showError('Esta ruta de trabajo está asignada a otro estudiante. Ingresa desde el portal PAES.');
      return;
    }
    try {
      if (!(await canOpenScheduledGuide(rut))) {
        showError('Esta guía está preparada y se habilitará cuando corresponda en clase.');
        return;
      }
    } catch (error) {
      showError(error.message || 'No fue posible comprobar el acceso a la guía.');
      return;
    }
    const found = await findStudent(rut);
    if (!found) {
      showError('No encontramos este RUT en la nómina PAES.');
      return;
    }
    student = { ...found, rut: cleanRut(found.rut) };
    sessionStorage.setItem('paes_student', JSON.stringify(student));
    $('studentName').textContent = student.nombre;
    $('studentCourse').textContent = student.curso;
    $('watermark').textContent = `${student.nombre} · ${formatRut(student.rut)}`;
    $('loginSection').style.display = 'none';
    $('sessionSection').style.display = 'block';
    document.body.classList.add('session-open');
    paintAnswers();
    updateProgress();
    showQuestion(0, false);
    try {
      mergeCloudState(await fetchCloudState());
    } catch (_) {
      setSaveStatus('Avance local activo', 'var(--red)');
    }
    paintAnswers();
    updateProgress();
  }

  renderQuestions();
  setupReadAloud();
  $('rutInput').addEventListener('input', (event) => { event.target.value = formatRut(event.target.value); });
  $('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    $('errorBox').classList.remove('show');
    login(cleanRut($('rutInput').value));
  });
  $('previousQuestion').addEventListener('click', () => showQuestion(currentQuestion - 1, true));
  $('nextQuestion').addEventListener('click', () => showQuestion(currentQuestion === TOTAL - 1 ? 0 : currentQuestion + 1, true));
  $('submitGuide').addEventListener('click', submitGuide);
  $('closeDialog').addEventListener('click', () => $('confirmationDialog').classList.remove('show'));
  $('logout').addEventListener('click', () => {
    sessionStorage.removeItem('paes_student');
    window.location.href = '/paes/';
  });

  const stored = sessionStorage.getItem('paes_student');
  if (stored) {
    try {
      const candidate = JSON.parse(stored);
      if (cleanRut(candidate.rut) === AUTHORIZED_RUT) login(AUTHORIZED_RUT);
    } catch (_) {
      sessionStorage.removeItem('paes_student');
    }
  }
}());
