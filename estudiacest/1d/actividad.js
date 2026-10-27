(function () {
  'use strict';
  const $ = id => document.getElementById(id), KEY = 'cest-1d-amor-v1';
  const QUESTIONS = ['recibir', 'ayudar', 'comprender', 'indiferencia', 'actitud', 'accion', 'compromiso'];
  const CASES = {
    curso: 'Llega una persona nueva al curso. Cuando forman grupos, nadie la invita y queda sola. Algunos lo ven, pero siguen conversando. Una compañera piensa que podría hacer algo.',
    familia: 'Una persona adulta llega cansada a casa y todavía debe preparar la comida y ordenar. Alguien de la familia se da cuenta de que puede colaborar con una tarea que sabe hacer.',
    comunidad: 'Después de una actividad de la comunidad quedan sillas fuera de lugar y papeles en el suelo. Solo dos personas están ordenando. Un grupo de jóvenes pasa cerca y ve lo que ocurre.'
  };
  let session = null, attempt = null, saveQueue = Promise.resolve(), timer, busy = false, dirty = false, slide = 1;
  const status = (text, error = false) => { $('status').textContent = text; $('status').classList.toggle('error', error); };
  function store() { sessionStorage.setItem(KEY, JSON.stringify(session)); }
  function payload() {
    return { uid: session.uid, fullName: $('fullName').value, caseId: $('caseId').value,
      answers: Object.fromEntries(QUESTIONS.map(id => [id, $(id).value])) };
  }
  function stash() { if (session && !isDone(attempt)) { session.draft = payload(); store(); } }
  async function api(action, body) {
    const response = await fetch('/api/estudiantes?action=' + action + (!body ? '&uid=' + encodeURIComponent(session.uid) : ''), {
      method: body ? 'POST' : 'GET', cache: 'no-store', headers: { Authorization: 'Bearer ' + session.token, ...(body ? { 'Content-Type': 'application/json' } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {})
    });
    const data = await response.json();
    if (!response.ok) throw Object.assign(new Error(data.error || 'No se pudo conectar. Conserva esta pestaña y vuelve a intentarlo.'), { status: response.status });
    return data.attempt;
  }
  function isDone(record) { return record?.submitted === true && record?.completada === true; }
  function validateIdentity(record) {
    if (!record || record.uid !== session.uid || record.course !== '1D' || record.sessionId !== 'reemplazo-1d-amor-20261027') throw Error('No se pudo comprobar tu entrega. Conserva esta pestaña y vuelve a intentarlo.');
  }
  function fill(record) {
    $('fullName').value = record.fullName || '';
    $('caseId').value = record.caseId || '';
    QUESTIONS.forEach(id => { $(id).value = record.answers?.[id] || ''; });
    showCase(); progress();
  }
  function showCase() { $('caseText').textContent = CASES[$('caseId').value] || 'Elige una situación para leerla aquí.'; }
  function progress() { $('progress').textContent = QUESTIONS.filter(id => $(id).value.trim()).length + ' de ' + QUESTIONS.length + ' respuestas escritas'; }
  function render(record) {
    validateIdentity(record); attempt = record;
    $('begin').hidden = true; $('work').hidden = false;
    $('answers').disabled = isDone(record); $('fullName').disabled = isDone(record);
    $('submit').hidden = isDone(record); $('save').hidden = isDone(record);
    $('confirmation').hidden = !isDone(record);
    if (isDone(record)) {
      dirty = false; session.draft = null; store(); fill(record);
      $('receipt').textContent = record.fullName + ' · 1D · ' + new Date(record.submittedAt).toLocaleString('es-CL', { timeZone: 'America/Santiago' });
      status('Entrega confirmada. Tus respuestas quedaron registradas para revisión del profesor.');
    }
  }
  async function readBack() { const record = await api('1d-state'); validateIdentity(record); return record; }
  function queueSave() {
    if (!session || !attempt || isDone(attempt)) return saveQueue;
    const snapshot = payload();
    stash();
    const job = saveQueue.catch(() => {}).then(async () => {
      status('Guardando tus respuestas…');
      try {
        const saved = await api('1d-save', snapshot); validateIdentity(saved); attempt = saved;
        if (JSON.stringify(snapshot) === JSON.stringify(payload())) { dirty = false; session.draft = null; store(); }
        status(dirty ? 'Hay cambios pendientes de guardar.' : 'Borrador guardado. Cuando termines, pulsa Entregar actividad.');
      } catch (error) {
        if (error.status === 409) {
          const saved = await readBack();
          if (isDone(saved)) { render(saved); return; }
        }
        status('No se pudo guardar. Tu avance sigue en esta pestaña. Pulsa Guardar borrador para reintentar. ' + error.message, true);
        throw error;
      }
    });
    saveQueue = job;
    job.catch(() => {});
    return job;
  }
  function lock(value) { busy = value; $('answers').disabled = value || isDone(attempt); $('fullName').disabled = value || isDone(attempt); $('submit').disabled = value; $('save').disabled = value; $('newStudent').disabled = value; }
  async function start() {
    if (!$('fullName').reportValidity()) return;
    if ($('fullName').value.trim().split(/\s+/).length < 2) { status('Escribe tu nombre completo, con nombres y apellidos.', true); return; }
    $('start').disabled = true;
    try {
      if (!session) {
        const bytes = crypto.getRandomValues(new Uint8Array(32));
        session = { uid: crypto.randomUUID(), token: Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('') };
      }
      stash(); store();
      const record = await api('1d-start', payload());
      validateIdentity(record); fill(record); render(record);
      status('Actividad iniciada. Escribe tus respuestas: se guardarán mientras trabajas.');
      $('work').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) { status(error.message, true); }
    finally { $('start').disabled = false; }
  }
  function closeDialog() { $('confirmDialog').hidden = true; $('submit').focus(); }
  $('start').onclick = start;
  $('save').onclick = () => { clearTimeout(timer); queueSave().catch(() => {}); };
  $('answers').addEventListener('input', changed);
  $('fullName').addEventListener('input', changed);
  function changed() {
    if (!session || !attempt || busy || isDone(attempt)) return;
    dirty = true; stash(); progress(); showCase(); status('Cambios pendientes de guardar…');
    clearTimeout(timer); timer = setTimeout(() => queueSave().catch(() => {}), 900);
  }
  $('submit').onclick = () => {
    if (!$('activityForm').reportValidity()) return;
    $('dialogName').textContent = $('fullName').value.trim();
    $('confirmDialog').hidden = false; $('cancelSubmit').focus();
  };
  $('cancelSubmit').onclick = closeDialog;
  document.addEventListener('keydown', event => {
    if ($('confirmDialog').hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); closeDialog(); }
    if (event.key === 'Tab') {
      const first = $('cancelSubmit'), last = $('confirmSubmit');
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  $('confirmSubmit').onclick = async () => {
    if (busy) return;
    $('confirmDialog').hidden = true; clearTimeout(timer); lock(true); stash();
    try {
      if (dirty) queueSave();
      await saveQueue;
      if (!isDone(attempt)) await api('1d-submit', payload());
      attempt = await readBack();
      if (attempt.submitted !== true || attempt.completada !== true) throw Error('La entrega aún no está confirmada. Vuelve a intentarlo.');
      render(attempt); $('confirmation').focus(); $('confirmation').scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (error) {
      try { const record = await readBack(); if (isDone(record)) { render(record); return; } } catch (_) {}
      status('No se confirmó la entrega. Tu trabajo sigue aquí; vuelve a pulsar Entregar actividad. ' + error.message, true);
    } finally { lock(false); }
  };
  $('newStudent').onclick = async () => {
    if (busy) return;
    if (session && attempt && !isDone(attempt)) {
      status('Antes de cambiar de estudiante, entrega tu actividad. Así conservarás un comprobante. Si necesitas ayuda, avisa al profesor.', true); return;
    }
    sessionStorage.removeItem(KEY); location.reload();
  };
  function showSlide(number) {
    slide = number;
    $('slideImage').src = 'assets/slide-' + String(slide).padStart(2, '0') + '.webp';
    $('slideImage').alt = 'Diapositiva ' + slide + ': ' + document.querySelector('[data-slide="' + slide + '"] h3').textContent;
    $('slideLink').href = $('slideImage').src;
    $('slideCount').textContent = slide + ' de 8'; $('previous').disabled = slide === 1; $('next').disabled = slide === 8;
    document.querySelectorAll('[data-slide]').forEach(section => { section.hidden = Number(section.dataset.slide) !== slide; });
  }
  $('previous').onclick = () => showSlide(slide - 1);
  $('next').onclick = () => showSlide(slide + 1);
  showSlide(1);
  window.addEventListener('beforeunload', event => { if (dirty || busy) { stash(); event.preventDefault(); event.returnValue = ''; } });
  $('activityForm').onsubmit = event => event.preventDefault();
  (async () => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (!raw) return;
      session = JSON.parse(raw); $('start').disabled = true;
      let record;
      try { record = await readBack(); }
      catch (error) {
        if (error.status !== 404 || !session.draft) throw error;
        record = await api('1d-start', session.draft);
      }
      fill(record); render(record);
      if (session.draft && !isDone(record)) { fill(session.draft); dirty = true; status('Recuperamos tus respuestas de esta pestaña. Pulsa Guardar borrador para sincronizarlas.'); }
      else if (!isDone(record)) status('Borrador recuperado. Puedes continuar y entregar al terminar.');
    } catch (error) { status('No se pudo recuperar tu actividad. Conserva esta pestaña y recarga para reintentar. ' + error.message, true); $('start').disabled = true; }
  })();
})();
