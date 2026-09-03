(function () {
  'use strict';

  var config = window.INTERROGACION_AUDIO_CONFIG;
  if (!config) return;

  var FIREBASE_CONFIG = {
    apiKey: 'AIzaSyCuDQ_iHDHmTd8bPeqUbsXQqdxw2SObt8w',
    authDomain: 'estudiacest.firebaseapp.com',
    databaseURL: 'https://estudiacest-default-rtdb.firebaseio.com',
    projectId: 'estudiacest',
    storageBucket: 'estudiacest.firebasestorage.app',
    messagingSenderId: '999002169815',
    appId: '1:999002169815:web:51203237bc77c2e74deb92'
  };
  var MAX_DURATION_MS = 180000;
  var MIN_DURATION_MS = 800;
  var MIN_AUDIO_BYTES = 1500;
  var MIN_SIGNAL_RMS = 0.004;
  var app = firebase.initializeApp(FIREBASE_CONFIG, 'interrogacion-audio-' + config.instrumento);
  var auth = app.auth();
  var storage = app.storage();
  auth.setPersistence(firebase.auth.Auth.Persistence.NONE).catch(function () {});

  var state = { docente: docenteDesdeUrl(), nombre: '', cursos: {}, notas: {}, grabaciones: {} };
  var flow = null;
  var review = null;
  var recorder = null;
  var stream = null;
  var chunks = [];
  var localBlob = null;
  var localUrl = '';
  var recordingStartedAt = 0;
  var recordingDuration = 0;
  var timer = null;
  var discardOnStop = false;
  var audioContext = null;
  var analyser = null;
  var analyserSource = null;
  var levelFrame = null;
  var signalMonitoringAvailable = false;
  var maxSignal = 0;
  var signalFrames = 0;
  var $ = function (id) { return document.getElementById(id); };

  function docenteDesdeUrl() {
    var requested = String(new URLSearchParams(window.location.search).get('docente') || 'francisco').toLowerCase();
    return ['francisco', 'alicia', 'pia', 'joselin'].indexOf(requested) >= 0 ? requested : 'francisco';
  }

  function setNotice(id, text, type) {
    var element = $(id);
    if (!element) return;
    element.textContent = text || '';
    element.className = text ? 'aviso ver ' + (type || 'ok') : 'aviso';
  }

  async function api(body) {
    var response = await fetch(config.api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({
        instrumento: config.instrumento,
        docente: state.docente
      }, body || {}))
    });
    var data = await response.json().catch(function () { return {}; });
    if (!response.ok) throw new Error(data.error || 'No se pudo completar la operación.');
    return data;
  }

  function randomId() {
    var value = crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2);
    return String(value).replace(/[^A-Za-z0-9_-]/g, '');
  }

  function randomIndex(max) {
    if (window.crypto && window.crypto.getRandomValues) {
      var values = new Uint32Array(1);
      var limit = Math.floor(4294967296 / max) * max;
      do { window.crypto.getRandomValues(values); } while (values[0] >= limit);
      return values[0] % max;
    }
    return Math.floor(Math.random() * max);
  }

  function shuffledQuestions() {
    var pool = Array.from({ length: config.banco.length }, function (_, index) { return index + 1; });
    var result = [];
    while (result.length < 7) {
      result.push(pool.splice(randomIndex(pool.length), 1)[0]);
    }
    return result;
  }

  function selectedStudent() {
    var select = $('alumno');
    if (!select || !select.value) return null;
    for (var course of Object.keys(state.cursos)) {
      var found = (state.cursos[course] || []).find(function (student) { return student.id === select.value; });
      if (found) return Object.assign({ curso: course }, found);
    }
    return null;
  }

  function studentById(id) {
    for (var course of Object.keys(state.cursos)) {
      var found = (state.cursos[course] || []).find(function (student) { return student.id === id; });
      if (found) return Object.assign({ curso: course }, found);
    }
    return null;
  }

  function formatDate(value) {
    if (!value) return 'Sin fecha';
    return new Intl.DateTimeFormat('es-CL', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
  }

  function formatDuration(milliseconds) {
    var seconds = Math.max(0, Math.round(Number(milliseconds || 0) / 1000));
    var minutes = Math.floor(seconds / 60);
    return minutes + ':' + String(seconds % 60).padStart(2, '0');
  }

  function releaseLocalAudio() {
    if (localUrl) URL.revokeObjectURL(localUrl);
    localUrl = '';
    localBlob = null;
    recordingDuration = 0;
  }

  function stopStream() {
    if (timer) window.clearInterval(timer);
    timer = null;
    if (levelFrame) window.cancelAnimationFrame(levelFrame);
    levelFrame = null;
    if (analyserSource) {
      try { analyserSource.disconnect(); } catch (_) {}
    }
    analyserSource = null;
    analyser = null;
    if (audioContext) audioContext.close().catch(function () {});
    audioContext = null;
    if (stream) stream.getTracks().forEach(function (track) { track.stop(); });
    stream = null;
  }

  function resetMeter() {
    signalMonitoringAvailable = false;
    maxSignal = 0;
    signalFrames = 0;
    if ($('nivelMicrofonoBarra')) $('nivelMicrofonoBarra').style.width = '0%';
    if ($('nivelMicrofonoTexto')) $('nivelMicrofonoTexto').textContent = 'Habla para comprobar el micrófono';
  }

  function startMeter(inputStream) {
    resetMeter();
    var AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      audioContext = new AudioContextClass();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.65;
      analyserSource = audioContext.createMediaStreamSource(inputStream);
      analyserSource.connect(analyser);
      signalMonitoringAvailable = true;
      audioContext.resume().catch(function () {});
      var samples = new Uint8Array(analyser.fftSize);
      var measure = function () {
        if (!analyser) return;
        analyser.getByteTimeDomainData(samples);
        var sum = 0;
        for (var index = 0; index < samples.length; index++) {
          var normalized = (samples[index] - 128) / 128;
          sum += normalized * normalized;
        }
        var rms = Math.sqrt(sum / samples.length);
        maxSignal = Math.max(maxSignal, rms);
        if (rms >= MIN_SIGNAL_RMS) signalFrames += 1;
        var percent = Math.min(100, Math.max(2, Math.round(rms * 900)));
        if ($('nivelMicrofonoBarra')) $('nivelMicrofonoBarra').style.width = percent + '%';
        if ($('nivelMicrofonoTexto')) {
          $('nivelMicrofonoTexto').textContent = rms >= MIN_SIGNAL_RMS ? 'Voz detectada' : 'No se detecta voz';
        }
        levelFrame = window.requestAnimationFrame(measure);
      };
      measure();
    } catch (_) {
      signalMonitoringAvailable = false;
    }
  }

  function resetRecordingControls(message) {
    releaseLocalAudio();
    $('previewAudio').pause();
    $('previewAudio').classList.add('oculto');
    $('previewAudio').removeAttribute('src');
    $('btnGrabarAudio').classList.remove('oculto', 'recording');
    $('btnGrabarAudio').textContent = 'Grabar respuesta';
    $('btnRepetirAudio').classList.add('oculto');
    $('btnSiguienteAudio').disabled = true;
    $('estadoGrabacion').textContent = message || 'Presiona grabar cuando el estudiante esté listo.';
    $('tiempoGrabacion').textContent = '0:00 / 3:00';
    resetMeter();
  }

  function setSelectionLocked(locked) {
    ['curso', 'alumno', 'btnSortear', 'btnGrabar'].forEach(function (id) {
      if ($(id)) $(id).disabled = locked;
    });
  }

  function preferredMimeType() {
    var choices = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg;codecs=opus', 'audio/webm'];
    if (!window.MediaRecorder || !MediaRecorder.isTypeSupported) return '';
    return choices.find(function (type) { return MediaRecorder.isTypeSupported(type); }) || '';
  }

  async function beginRecording() {
    if (recorder && recorder.state === 'recording') return stopRecording();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
      setNotice('avisoAudio', 'Este navegador no permite grabar. Abre el enlace en Chrome, Edge o Safari actualizado.', 'err');
      return;
    }
    releaseLocalAudio();
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      var mimeType = preferredMimeType();
      var options = { audioBitsPerSecond: 48000 };
      if (mimeType) options.mimeType = mimeType;
      try { recorder = new MediaRecorder(stream, options); }
      catch (_) { recorder = new MediaRecorder(stream); }
      startMeter(stream);
      chunks = [];
      discardOnStop = false;
      recorder.ondataavailable = function (event) { if (event.data && event.data.size) chunks.push(event.data); };
      recorder.onstop = finishRecording;
      recordingStartedAt = Date.now();
      recorder.start(250);
      $('btnGrabarAudio').classList.add('recording');
      $('btnGrabarAudio').textContent = 'Detener grabación';
      $('estadoGrabacion').textContent = 'Grabando… habla cerca del micrófono.';
      updateTimer();
      timer = window.setInterval(function () {
        updateTimer();
        if (Date.now() - recordingStartedAt >= MAX_DURATION_MS) stopRecording();
      }, 250);
    } catch (_) {
      stopStream();
      setNotice('avisoAudio', 'No fue posible usar el micrófono. Revisa el permiso del navegador e inténtalo nuevamente.', 'err');
    }
  }

  function updateTimer() {
    var elapsed = Math.min(MAX_DURATION_MS, Date.now() - recordingStartedAt);
    $('tiempoGrabacion').textContent = formatDuration(elapsed) + ' / 3:00';
  }

  function stopRecording() {
    if (recorder && recorder.state === 'recording') recorder.stop();
  }

  function finishRecording() {
    if (discardOnStop) {
      discardOnStop = false;
      stopStream();
      recorder = null;
      chunks = [];
      return;
    }
    recordingDuration = Math.max(250, Math.min(MAX_DURATION_MS, Date.now() - recordingStartedAt));
    var type = recorder && recorder.mimeType ? recorder.mimeType : 'audio/webm';
    localBlob = new Blob(chunks, { type: type });
    var hasVoice = !signalMonitoringAvailable || signalFrames >= 2 || maxSignal >= MIN_SIGNAL_RMS * 1.5;
    var validCapture = recordingDuration >= MIN_DURATION_MS && localBlob.size >= MIN_AUDIO_BYTES && hasVoice;
    stopStream();
    recorder = null;
    chunks = [];
    if (!validCapture) {
      resetRecordingControls('No se detectó una respuesta audible. Acerca el micrófono, habla y vuelve a grabar.');
      setNotice('avisoAudio', 'El audio estaba vacío o era demasiado breve; no fue guardado.', 'err');
      return;
    }
    localUrl = URL.createObjectURL(localBlob);
    $('previewAudio').src = localUrl;
    $('previewAudio').classList.remove('oculto');
    $('btnGrabarAudio').classList.remove('recording');
    $('btnGrabarAudio').classList.add('oculto');
    $('btnRepetirAudio').classList.remove('oculto');
    $('btnSiguienteAudio').disabled = false;
    $('estadoGrabacion').textContent = 'Escucha brevemente. Si se oye bien, guarda y continúa.';
    $('tiempoGrabacion').textContent = formatDuration(recordingDuration);
  }

  async function uploadCurrentAudio() {
    if (!localBlob || !flow) return;
    if (localBlob.size < MIN_AUDIO_BYTES || recordingDuration < MIN_DURATION_MS) {
      resetRecordingControls('La grabación es demasiado breve. Vuelve a grabar la respuesta.');
      setNotice('avisoAudio', 'No se guardó un audio incompleto.', 'err');
      return;
    }
    var position = flow.position;
    var question = Number(flow.data.preguntas[position]);
    var fileId = randomId();
    var type = localBlob.type || 'audio/webm';
    var extension = type.indexOf('mp4') >= 0 ? 'm4a' : type.indexOf('ogg') >= 0 ? 'ogg' : 'webm';
    var name = 'respuesta-' + (position + 1) + '-' + Date.now() + '.' + extension;
    $('btnSiguienteAudio').disabled = true;
    $('btnRepetirAudio').disabled = true;
    $('estadoGrabacion').textContent = 'Preparando el audio…';
    var prepared = null;
    try {
      prepared = await api({
        accion: 'preparar-audio',
        alumnoId: flow.student.id,
        intentoId: flow.data.intentoId,
        posicion: position,
        pregunta: question,
        fileId: fileId,
        name: name,
        size: localBlob.size,
        contentType: type
      });
      await auth.signInWithCustomToken(prepared.customToken);
      var reference = storage.ref(prepared.storagePath);
      var task = reference.put(localBlob, {
        contentType: type,
        customMetadata: {
          instrumento: config.instrumento,
          docente: state.docente,
          alumnoId: flow.student.id,
          intentoId: flow.data.intentoId,
          posicion: String(position),
          fileId: fileId
        }
      });
      await new Promise(function (resolve, reject) {
        task.on('state_changed', function (snapshot) {
          var percent = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100);
          $('estadoGrabacion').textContent = 'Guardando audio… ' + percent + '%';
        }, reject, resolve);
      });
      var saved = await api({
        accion: 'registrar-audio',
        alumnoId: flow.student.id,
        intentoId: flow.data.intentoId,
        posicion: position,
        fileId: fileId,
        storagePath: prepared.storagePath,
        duracionMs: recordingDuration
      });
      flow.data.respuestas = flow.data.respuestas || {};
      flow.data.respuestas[position] = saved.respuesta;
      releaseLocalAudio();
      await auth.signOut().catch(function () {});
    } catch (error) {
      await auth.signOut().catch(function () {});
      $('btnSiguienteAudio').disabled = false;
      $('btnRepetirAudio').disabled = false;
      setNotice('avisoAudio', error.message, 'err');
      throw error;
    }
  }

  function firstMissing(recording) {
    for (var position = 0; position < 7; position++) {
      if (!recording.respuestas || !recording.respuestas[position]) return position;
    }
    return 7;
  }

  function renderFlow() {
    if (!flow) return;
    var position = flow.position;
    var savedCount = Object.keys(flow.data.respuestas || {}).length;
    $('audioEstudiante').textContent = flow.student.nombre + ' · ' + (config.cursoLabels[flow.student.curso] || flow.student.curso);
    $('audioProgresoTexto').textContent = Math.min(position + 1, 7) + ' de 7';
    $('audioProgresoBarra').style.width = Math.round(savedCount / 7 * 100) + '%';
    $('audioGuardadas').textContent = savedCount + ' respuesta' + (savedCount === 1 ? '' : 's') + ' guardada' + (savedCount === 1 ? '' : 's');
    if (position >= 7) return finalizeFlow();
    releaseLocalAudio();
    setNotice('avisoAudio', '', '');
    $('numeroPreguntaAudio').textContent = 'Pregunta ' + (position + 1);
    var number = Number(flow.data.preguntas[position]);
    $('textoPreguntaAudio').textContent = config.banco[number - 1];
    $('referenciaPreguntaAudio').textContent = 'Pregunta ' + number + ' del banco';
    $('previewAudio').classList.add('oculto');
    $('previewAudio').removeAttribute('src');
    $('btnGrabarAudio').classList.remove('oculto', 'recording');
    $('btnGrabarAudio').textContent = 'Grabar respuesta';
    $('btnRepetirAudio').classList.add('oculto');
    $('btnRepetirAudio').disabled = false;
    $('btnSiguienteAudio').disabled = true;
    $('btnSiguienteAudio').textContent = position === 6 ? 'Guardar y finalizar' : 'Guardar y siguiente';
    $('estadoGrabacion').textContent = 'Presiona grabar cuando el estudiante esté listo.';
    $('tiempoGrabacion').textContent = '0:00 / 3:00';
    resetMeter();
  }

  async function startFlow() {
    var student = selectedStudent();
    if (!student) return;
    var existing = state.grabaciones[student.id];
    if (existing && existing.estado === 'en_curso') {
      if (!confirm('Hay una grabación incompleta. ¿Continuar desde la primera respuesta pendiente?')) return;
      flow = { student: student, data: existing, position: firstMissing(existing) };
    } else {
      var replace = Boolean(existing);
      if (replace && !confirm('Ya existen audios de este estudiante. ¿Reemplazarlos por una nueva interrogación?')) return;
      var attemptId = randomId();
      var result = await api({
        accion: 'iniciar-grabacion',
        alumnoId: student.id,
        intentoId: attemptId,
        preguntas: shuffledQuestions(),
        reemplazar: replace
      });
      flow = { student: student, data: result.grabacion, position: 0 };
      state.grabaciones[student.id] = result.grabacion;
      if (replace) delete state.notas[student.id];
    }
    setSelectionLocked(true);
    $('cardAudio').classList.remove('oculto');
    $('cardPreg').classList.add('oculto');
    renderFlow();
    $('cardAudio').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function nextQuestion() {
    if (!flow) return;
    try {
      if (localBlob) await uploadCurrentAudio();
      if (!flow.data.respuestas || !flow.data.respuestas[flow.position]) return;
      flow.position += 1;
      renderFlow();
    } catch (_) {}
  }

  async function finalizeFlow() {
    if (!flow) return;
    $('estadoGrabacion').textContent = 'Confirmando las siete respuestas…';
    try {
      var result = await api({
        accion: 'entregar-grabacion',
        alumnoId: flow.student.id,
        intentoId: flow.data.intentoId
      });
      flow.data.estado = result.estado;
      flow.data.fechaEntrega = result.fechaEntrega;
      state.grabaciones[flow.student.id] = flow.data;
      $('audioProgresoBarra').style.width = '100%';
      renderRecordings();
      $('cardAudio').classList.add('oculto');
      setSelectionLocked(false);
      flow = null;
      $('audioExito').showModal();
    } catch (error) {
      setNotice('avisoAudio', error.message, 'err');
    }
  }

  async function cancelFlow() {
    if (!flow || !confirm('¿Descartar esta grabación y sus audios?')) return;
    if (recorder && recorder.state === 'recording') {
      discardOnStop = true;
      recorder.stop();
    }
    stopStream();
    releaseLocalAudio();
    try {
      await api({ accion: 'borrar-grabacion', alumnoId: flow.student.id });
      delete state.grabaciones[flow.student.id];
      delete state.notas[flow.student.id];
      flow = null;
      $('cardAudio').classList.add('oculto');
      setSelectionLocked(false);
      renderRecordings();
    } catch (error) {
      setNotice('avisoAudio', error.message, 'err');
    }
  }

  function scoreButtons(position, selected) {
    return config.puntos.map(function (point) {
      var active = Number(selected) === point ? ' on' : '';
      return '<button type="button" class="' + active.trim() + '" data-review-score="' + position + '" data-score="' + point + '">' + point.toFixed(1).replace('.', ',') + '</button>';
    }).join('');
  }

  function renderReview() {
    var zone = $('zonaRevisionAudio');
    zone.innerHTML = '';
    review.recording.preguntas.forEach(function (question, position) {
      var answer = review.recording.respuestas && review.recording.respuestas[position];
      var element = document.createElement('article');
      element.className = 'review-answer';
      element.innerHTML =
        '<div class="review-heading"><span>' + (position + 1) + '</span><strong>' + config.banco[Number(question) - 1] + '</strong></div>' +
        '<div class="review-controls"><button type="button" class="btn chico" data-load-audio="' + position + '">Escuchar respuesta · ' + formatDuration(answer && answer.duracionMs) + '</button>' +
        '<audio class="review-player oculto" controls preload="none" data-player="' + position + '"></audio></div>' +
        '<div class="escala review-scale">' + scoreButtons(position, review.scores[position]) + '</div>';
      zone.appendChild(element);
    });
    zone.querySelectorAll('[data-review-score]').forEach(function (button) {
      button.addEventListener('click', function () {
        review.scores[Number(button.dataset.reviewScore)] = Number(button.dataset.score);
        renderReview();
        updateReviewMarker();
      });
    });
    zone.querySelectorAll('[data-load-audio]').forEach(function (button) {
      button.addEventListener('click', function () { loadReviewAudio(Number(button.dataset.loadAudio), button); });
    });
    updateReviewMarker();
  }

  function updateReviewMarker() {
    var values = Object.values(review.scores);
    var total = values.reduce(function (sum, value) { return sum + Number(value || 0); }, 0);
    var grade = Math.max(1, Math.round(total * 10) / 10);
    $('notaRevisionAudio').textContent = values.length ? grade.toFixed(1).replace('.', ',') : '—';
    $('detalleRevisionAudio').textContent = values.length + ' de 7 respuestas puntuadas';
  }

  async function loadReviewAudio(position, button) {
    button.disabled = true;
    button.textContent = 'Cargando audio…';
    try {
      var data = await api({
        accion: 'audio-url',
        alumnoId: review.student.id,
        intentoId: review.recording.intentoId,
        posicion: position
      });
      var player = $('zonaRevisionAudio').querySelector('[data-player="' + position + '"]');
      player.src = data.url;
      player.classList.remove('oculto');
      button.textContent = 'Audio cargado';
      await player.play().catch(function () {});
    } catch (error) {
      button.disabled = false;
      button.textContent = 'Reintentar audio';
      setNotice('avisoRevisionAudio', error.message, 'err');
    }
  }

  function openReview(studentId) {
    var student = studentById(studentId);
    var recording = state.grabaciones[studentId];
    if (!student || !recording) return;
    if (recording.estado === 'en_curso') {
      $('alumno').value = studentId;
      startFlow().catch(function (error) { setNotice('avisoAudio', error.message, 'err'); });
      return;
    }
    var note = state.notas[studentId];
    review = {
      student: student,
      recording: recording,
      scores: note && note.intentoId === recording.intentoId ? Object.assign({}, note.puntajes || {}) : {}
    };
    $('revisionTitulo').textContent = 'Revisar a ' + student.nombre;
    $('obsRevisionAudio').value = note && note.intentoId === recording.intentoId ? (note.observacion || '') : '';
    setNotice('avisoRevisionAudio', '', '');
    $('cardRevisionAudio').classList.remove('oculto');
    renderReview();
    $('cardRevisionAudio').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function saveReview() {
    if (!review) return;
    var count = Object.keys(review.scores).length;
    if (count < 7 && !confirm('Faltan ' + (7 - count) + ' respuestas por puntuar. ¿Guardar igualmente?')) return;
    $('btnGuardarRevisionAudio').disabled = true;
    try {
      var result = await api({
        accion: 'guardar',
        alumnoId: review.student.id,
        preguntas: review.recording.preguntas,
        puntajes: review.scores,
        cambiada: null,
        observacion: $('obsRevisionAudio').value,
        intentoId: review.recording.intentoId
      });
      setNotice('avisoRevisionAudio', 'Calificación guardada: ' + result.nota.toFixed(1).replace('.', ',') + '.', 'ok');
      window.setTimeout(function () { window.location.reload(); }, 900);
    } catch (error) {
      setNotice('avisoRevisionAudio', error.message, 'err');
      $('btnGuardarRevisionAudio').disabled = false;
    }
  }

  async function deleteRecording(studentId) {
    var alsoGrade = state.notas[studentId] ? ' y su calificación asociada' : '';
    if (!confirm('¿Eliminar definitivamente los audios de esta interrogación' + alsoGrade + '?')) return;
    try {
      await api({ accion: 'borrar-grabacion', alumnoId: studentId });
      delete state.grabaciones[studentId];
      delete state.notas[studentId];
      renderRecordings();
      window.setTimeout(function () { window.location.reload(); }, 250);
    } catch (error) {
      window.alert(error.message);
    }
  }

  function renderRecordings() {
    var table = $('tablaGrabaciones');
    var ids = Object.keys(state.grabaciones);
    table.innerHTML = '';
    if (!ids.length) {
      table.innerHTML = '<tr><td colspan="7" class="vacio">Aún no hay respuestas grabadas.</td></tr>';
      $('subGrabaciones').textContent = 'Las grabaciones entregadas aparecerán aquí.';
      return;
    }
    ids.sort(function (a, b) {
      var one = studentById(a), two = studentById(b);
      return ((one && one.curso) + a).localeCompare((two && two.curso) + b);
    });
    var pending = ids.filter(function (id) { return state.grabaciones[id].estado === 'pendiente'; }).length;
    $('subGrabaciones').textContent = ids.length + ' registro(s) · ' + pending + ' pendiente(s) de calificación.';
    ids.forEach(function (id) {
      var recording = state.grabaciones[id];
      var student = studentById(id);
      if (!student) return;
      var count = Object.keys(recording.respuestas || {}).length;
      var statusLabel = recording.estado === 'calificada' ? 'Calificada' : recording.estado === 'pendiente' ? 'Por revisar' : 'Incompleta';
      var note = state.notas[id];
      var row = document.createElement('tr');
      row.innerHTML = '<td>' + (config.cursoLabels[student.curso] || student.curso) + '</td>' +
        '<td>' + student.n + '</td><td>' + student.nombre + '</td>' +
        '<td>' + count + '/7</td><td><span class="audio-status ' + recording.estado + '">' + statusLabel + '</span></td>' +
        '<td class="n">' + (note && note.nota != null ? Number(note.nota).toFixed(1).replace('.', ',') : '—') + '</td>' +
        '<td><div class="row-actions"><button type="button" class="btn chico" data-review="' + id + '">' + (recording.estado === 'en_curso' ? 'Continuar' : 'Revisar') + '</button>' +
        '<button type="button" class="btn chico danger" data-delete-recording="' + id + '">Eliminar</button></div></td>';
      table.appendChild(row);
    });
    table.querySelectorAll('[data-review]').forEach(function (button) {
      button.addEventListener('click', function () { openReview(button.dataset.review); });
    });
    table.querySelectorAll('[data-delete-recording]').forEach(function (button) {
      button.addEventListener('click', function () { deleteRecording(button.dataset.deleteRecording); });
    });
  }

  async function load() {
    try {
      var data = await api({ accion: 'nomina' });
      state.nombre = data.docente;
      state.cursos = data.cursos || {};
      state.notas = data.notas || {};
      state.grabaciones = data.grabaciones || {};
      $('btnGrabar').disabled = false;
      renderRecordings();
    } catch (error) {
      setNotice('avisoListaAudios', error.message, 'err');
    }
  }

  $('btnGrabar').disabled = true;
  $('btnGrabar').addEventListener('click', function () {
    startFlow().catch(function (error) { setNotice('avisoAudio', error.message, 'err'); });
  });
  $('btnGrabarAudio').addEventListener('click', beginRecording);
  $('btnRepetirAudio').addEventListener('click', function () {
    releaseLocalAudio();
    renderFlow();
  });
  $('btnSiguienteAudio').addEventListener('click', nextQuestion);
  $('btnCancelarAudio').addEventListener('click', cancelFlow);
  $('btnCerrarRevisionAudio').addEventListener('click', function () {
    review = null;
    $('cardRevisionAudio').classList.add('oculto');
  });
  $('btnGuardarRevisionAudio').addEventListener('click', saveReview);
  $('cerrarAudioExito').addEventListener('click', function () { $('audioExito').close(); });
  window.addEventListener('beforeunload', function (event) {
    if (recorder && recorder.state === 'recording') {
      event.preventDefault();
      event.returnValue = '';
    }
  });
  load();
}());
