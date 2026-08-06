(function () {
  'use strict';

  const API = '/api/odisea-cine';
  const characters = [
    { id: 'odiseo', name: 'Odiseo', cue: 'Decisiones, liderazgo y transformación', image: 'personaje-01.webp' },
    { id: 'penelope', name: 'Penélope', cue: 'Espera, inteligencia y resistencia', image: 'personaje-02.webp' },
    { id: 'telemaco', name: 'Telémaco', cue: 'Búsqueda, crecimiento y lealtad', image: 'personaje-03.webp' },
    { id: 'antinoo', name: 'Antínoo', cue: 'Ambición, poder y conflicto', image: 'personaje-04.webp' },
    { id: 'atenea', name: 'Atenea', cue: 'Orientación, conciencia y estrategia', image: 'personaje-05.webp' },
    { id: 'calipso', name: 'Calipso', cue: 'Retención, deseo y olvido', image: 'personaje-06.webp' }
  ];
  const events = [
    'Los guerreros griegos salen del caballo de madera y Troya cae.',
    'Odiseo permanece retenido en la isla de Calipso.',
    'Odiseo y su tripulación quedan atrapados en la cueva del Cíclope.',
    'Los lestrigones atacan y destruyen gran parte de la flota.',
    'Circe transforma a varios compañeros de Odiseo en cerdos.',
    'Odiseo desciende al mundo de los muertos.',
    'Odiseo escucha a las sirenas amarrado al mástil de su barco.',
    'La nave cruza entre Escila y Caribdis.',
    'La tripulación mata el ganado sagrado y provoca una catástrofe.',
    'Telémaco visita a Menelao y Helena para buscar noticias de su padre.',
    'Odiseo regresa disfrazado y se encuentra con el porquero Eumeo.',
    'El perro Argos reconoce a Odiseo pese a su disfraz.',
    'Odiseo supera la prueba del arco y enfrenta a los pretendientes.',
    'Eolo entrega a Odiseo una bolsa que contiene todos los vientos.',
    'La princesa Nausícaa encuentra a Odiseo náufrago en una playa.',
    'Poseidón aparece en persona y combate cuerpo a cuerpo con Odiseo.',
    'Hermes entrega a Odiseo una hierba mágica antes de enfrentar a Circe.',
    'Penélope ordena mover el lecho matrimonial para probar la identidad de Odiseo.'
  ];

  const $ = id => document.getElementById(id);
  let currentRut = '';
  let currentStudent = null;
  let locked = false;
  let saveTimer = null;
  let saveSequence = 0;

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function cleanRut(value) {
    return String(value || '').replace(/[^0-9kK]/g, '').toUpperCase();
  }

  function formatRut(value) {
    const clean = cleanRut(value);
    if (clean.length < 2) return clean;
    const body = clean.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return body + '-' + clean.slice(-1);
  }

  function localKey() {
    return 'odisea-cine-draft-' + currentRut;
  }

  function setSaveState(message, state) {
    $('saveState').textContent = message;
    $('saveState').dataset.state = state || '';
  }

  function renderOptions() {
    $('characterGrid').innerHTML = characters.map(character => `
      <article class="character-card" data-character-card="${character.id}">
        <label class="character-choice">
          <img src="assets/actividad-cine/${character.image}" alt="Retrato ilustrado de ${character.name}" loading="lazy">
          <span class="character-meta"><strong>${character.name}</strong><span>${character.cue}</span></span>
          <input type="checkbox" value="${character.id}" aria-label="Seleccionar a ${character.name}">
        </label>
        <div class="character-response">
          <label class="field-label" for="description-${character.id}">Describe a ${character.name}</label>
          <textarea id="description-${character.id}" maxlength="700" placeholder="Es... Esto se observa cuando..."></textarea>
        </div>
      </article>`).join('');

    $('eventGrid').innerHTML = events.map((event, index) => `
      <label class="event-card">
        <img src="assets/actividad-cine/evento-${String(index + 1).padStart(2, '0')}.webp" alt="Ilustración del acontecimiento ${index + 1}" loading="lazy">
        <span class="event-copy">${escapeHtml(event)}</span>
        <input type="checkbox" value="${index + 1}" aria-label="Marcar acontecimiento ${index + 1}">
      </label>`).join('');
  }

  function getAnswers() {
    const selectedCharacters = [...document.querySelectorAll('#characterGrid input[type="checkbox"]:checked')].map(input => ({
      id: input.value,
      description: $('description-' + input.value).value.trim()
    }));
    const selectedEvents = [...document.querySelectorAll('#eventGrid input[type="checkbox"]:checked')].map(input => Number(input.value));
    return {
      characters: selectedCharacters,
      impact: $('impactAnswer').value.trim(),
      phrase: $('phraseAnswer').value.trim(),
      events: selectedEvents
    };
  }

  function applyAnswers(answers) {
    const value = answers || {};
    const selected = new Map((Array.isArray(value.characters) ? value.characters : []).map(item => [item.id, item.description || '']));
    characters.forEach(character => {
      const checkbox = document.querySelector(`#characterGrid input[value="${character.id}"]`);
      checkbox.checked = selected.has(character.id);
      $('description-' + character.id).value = selected.get(character.id) || '';
    });
    $('impactAnswer').value = value.impact || '';
    $('phraseAnswer').value = value.phrase || '';
    const eventSet = new Set(Array.isArray(value.events) ? value.events.map(Number) : []);
    document.querySelectorAll('#eventGrid input[type="checkbox"]').forEach(input => { input.checked = eventSet.has(Number(input.value)); });
    refreshUi();
  }

  function loadLocalDraft() {
    try {
      const value = JSON.parse(localStorage.getItem(localKey()) || 'null');
      if (!value) return null;
      return value.answers ? value : { answers: value, updatedAt: 0 };
    } catch (_) { return null; }
  }

  function persistLocal() {
    if (!currentRut || locked) return;
    localStorage.setItem(localKey(), JSON.stringify({ answers: getAnswers(), updatedAt: Date.now() }));
  }

  function completedSections(answers) {
    const validCharacters = answers.characters.length === 3 && answers.characters.every(item => item.description.length >= 25);
    return [validCharacters, answers.impact.length >= 45, answers.phrase.length >= 70, answers.events.length >= 5].filter(Boolean).length;
  }

  function refreshUi() {
    const selected = [...document.querySelectorAll('#characterGrid input[type="checkbox"]:checked')];
    const atLimit = selected.length >= 3;
    document.querySelectorAll('#characterGrid input[type="checkbox"]').forEach(input => {
      input.disabled = locked || (atLimit && !input.checked);
    });
    $('characterCount').textContent = selected.length + ' de 3 seleccionados';
    $('impactCount').textContent = $('impactAnswer').value.length + ' / 1200';
    $('phraseCount').textContent = $('phraseAnswer').value.length + ' / 1400';
    const progress = completedSections(getAnswers());
    $('progressBar').style.width = (progress * 25) + '%';
  }

  function scheduleSave() {
    if (!currentRut || locked) return;
    persistLocal();
    refreshUi();
    setSaveState('Cambios pendientes', '');
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => saveDraft(false), 900);
  }

  async function request(action, options, query) {
    const params = new URLSearchParams({ action });
    Object.entries(query || {}).forEach(([key, value]) => params.set(key, value));
    const response = await fetch(API + '?' + params.toString(), {
      cache: 'no-store',
      ...options
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.error || 'No se pudo completar la solicitud.');
      error.status = response.status;
      throw error;
    }
    return data;
  }

  async function saveDraft(keepalive) {
    if (!currentRut || locked) return;
    const sequence = ++saveSequence;
    setSaveState('Guardando...', '');
    try {
      await request('save-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut: currentRut, answers: getAnswers() }),
        keepalive: keepalive === true
      });
      if (sequence === saveSequence) setSaveState('Avance guardado', 'saved');
    } catch (error) {
      if (error.status === 409) {
        lockActivity();
        setSaveState('Actividad entregada', 'saved');
      } else if (sequence === saveSequence) {
        setSaveState('Guardado local; sin conexión', 'error');
      }
    }
  }

  function clearValidation() {
    document.querySelectorAll('.invalid').forEach(element => element.classList.remove('invalid'));
    ['characterError', 'impactError', 'phraseError', 'eventError'].forEach(id => { $(id).textContent = ''; });
  }

  function validate() {
    clearValidation();
    const answers = getAnswers();
    let target = null;
    if (answers.characters.length !== 3) {
      $('characterError').textContent = 'Selecciona exactamente tres personajes.';
      $('characterGrid').classList.add('invalid');
      target = $('sectionCharacters');
    } else {
      const incomplete = answers.characters.find(item => item.description.length < 25);
      if (incomplete) {
        $('characterError').textContent = 'Describe los tres personajes con al menos 25 caracteres cada uno.';
        $('description-' + incomplete.id).classList.add('invalid');
        target = $('sectionCharacters');
      }
    }
    if (!target && answers.impact.length < 45) {
      $('impactError').textContent = 'Explica la escena y por qué te impactó.';
      $('impactAnswer').classList.add('invalid');
      target = $('sectionImpact');
    }
    if (!target && answers.phrase.length < 70) {
      $('phraseError').textContent = 'Explica las cualidades de Penélope y Telémaco con evidencia de la película.';
      $('phraseAnswer').classList.add('invalid');
      target = $('sectionPhrase');
    }
    if (!target && answers.events.length < 5) {
      $('eventError').textContent = 'Revisa todas las escenas y marca las que reconociste en la película.';
      $('eventGrid').classList.add('invalid');
      target = $('sectionEvents');
    }
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return !target;
  }

  function lockActivity() {
    locked = true;
    document.querySelectorAll('#activityForm input, #activityForm textarea').forEach(element => { element.disabled = true; });
    $('submitBar').classList.add('hidden');
    $('finalBanner').classList.remove('hidden');
    $('progressBar').style.width = '100%';
  }

  async function submitActivity() {
    if (!validate()) return;
    if (!window.confirm('¿Entregar la bitácora? Después de enviarla no podrás modificar tus respuestas.')) return;
    window.clearTimeout(saveTimer);
    $('submitButton').disabled = true;
    $('submitButton').textContent = 'Entregando...';
    setSaveState('Enviando entrega...', '');
    try {
      await request('submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut: currentRut, answers: getAnswers() })
      });
      localStorage.removeItem(localKey());
      lockActivity();
      setSaveState('Entrega confirmada', 'saved');
      $('successDialog').showModal();
    } catch (error) {
      $('submitButton').disabled = false;
      $('submitButton').textContent = 'Entregar bitácora';
      setSaveState('No se pudo entregar', 'error');
      window.alert(error.message);
    }
  }

  async function login(event) {
    event.preventDefault();
    const rut = cleanRut($('rutInput').value);
    $('loginError').textContent = '';
    if (rut.length < 8) {
      $('loginError').textContent = 'Ingresa un RUN válido.';
      return;
    }
    $('loginButton').disabled = true;
    $('loginButton').textContent = 'Verificando...';
    try {
      const data = await request('student', { method: 'GET' }, { rut });
      currentRut = rut;
      currentStudent = data.student;
      $('studentName').textContent = data.student.name;
      $('studentMeta').textContent = data.student.course + ' · ' + data.student.rut;
      const serverResponse = data.response;
      const localDraft = loadLocalDraft();
      const useLocalDraft = localDraft && (!serverResponse || serverResponse.status !== 'submitted') && localDraft.updatedAt > Number(serverResponse && serverResponse.updatedAt || 0);
      const initialAnswers = useLocalDraft ? localDraft.answers : serverResponse && serverResponse.answers;
      applyAnswers(initialAnswers || {});
      $('loginView').classList.add('hidden');
      $('activityView').classList.remove('hidden');
      document.documentElement.scrollTop = 0;
      if (serverResponse && serverResponse.status === 'submitted') {
        lockActivity();
        setSaveState('Entrega confirmada', 'saved');
      } else if (serverResponse) {
        setSaveState('Borrador recuperado', 'saved');
      } else if (useLocalDraft) {
        setSaveState('Borrador local recuperado', 'saved');
        scheduleSave();
      } else {
        setSaveState('Listo para responder', 'saved');
      }
    } catch (error) {
      $('loginError').textContent = error.message;
    } finally {
      $('loginButton').disabled = false;
      $('loginButton').textContent = 'Ingresar a la actividad';
    }
  }

  function logout() {
    window.clearTimeout(saveTimer);
    if (!locked) saveDraft(true);
    currentRut = '';
    currentStudent = null;
    locked = false;
    $('activityView').classList.add('hidden');
    $('loginView').classList.remove('hidden');
    $('rutInput').value = '';
    document.documentElement.scrollTop = 0;
  }

  renderOptions();
  $('loginForm').addEventListener('submit', login);
  $('rutInput').addEventListener('input', event => { event.target.value = formatRut(event.target.value); });
  $('activityForm').addEventListener('input', scheduleSave);
  $('activityForm').addEventListener('change', scheduleSave);
  $('submitButton').addEventListener('click', submitActivity);
  $('logoutButton').addEventListener('click', logout);
  $('closeDialog').addEventListener('click', () => $('successDialog').close());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && currentRut && !locked) {
      window.clearTimeout(saveTimer);
      persistLocal();
      saveDraft(true);
    }
  });
}());
