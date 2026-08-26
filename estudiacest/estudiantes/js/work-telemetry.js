(function () {
  'use strict';

  const script = document.currentScript;
  const sessionId = script && script.dataset ? String(script.dataset.session || '').trim() : '';
  const BASE = 'plataforma_estudiantes';
  const FLUSH_INTERVAL_MS = 10000;
  const RAPID_ANSWER_MS = 1500;
  const SELECTION_THROTTLE_MS = 3000;

  if (!sessionId || !window.firebase || !firebase.auth || !firebase.database) return;
  if (new URLSearchParams(location.search).get('preview') === '1') return;

  const db = firebase.database();
  const auth = firebase.auth();
  let uid = '';
  let telemetryRef = null;
  let responseRef = null;
  let serverOffset = 0;
  let activeSince = null;
  let flushTimer = null;
  let intervalTimer = null;
  let flushChain = Promise.resolve();
  let lastAnswerAt = null;
  let lastSelectionAt = 0;
  let initialized = false;
  let submissionRecorded = false;
  let trackingStopped = false;
  let pendingActiveMs = 0;
  let pendingInteractions = 0;
  let pendingRapidAnswers = 0;
  let pendingFastestAnswerMs = null;
  const pendingQuestionIds = new Set();
  const pendingEvents = Object.create(null);

  function now() {
    return Date.now() + serverOffset;
  }

  function isActive() {
    return !document.hidden && document.hasFocus();
  }

  function beginActive() {
    if (!trackingStopped && activeSince === null && isActive()) activeSince = now();
  }

  function pauseActive() {
    if (activeSince === null) return;
    pendingActiveMs += Math.max(0, now() - activeSince);
    activeSince = null;
  }

  function eventBucket(name) {
    if (!pendingEvents[name]) {
      pendingEvents[name] = { count: 0, firstAt: null, lastAt: null, editableCount: 0, pageCount: 0 };
    }
    return pendingEvents[name];
  }

  function recordEvent(name, target) {
    if (!initialized || trackingStopped) return;
    const timestamp = now();
    const bucket = eventBucket(name);
    bucket.count += 1;
    bucket.firstAt = bucket.firstAt || timestamp;
    bucket.lastAt = timestamp;
    const editable = target && target.closest && target.closest('textarea,input,[contenteditable="true"]');
    if (editable) bucket.editableCount += 1;
    else bucket.pageCount += 1;
    scheduleFlush();
  }

  function answerId(target) {
    if (!target || !target.closest) return '';
    const owner = target.closest('[data-question],[data-q],.question,[id^="block-q"],[id^="q"]');
    if (!owner) return '';
    return String(
      owner.dataset.question || owner.dataset.q || owner.id ||
      (target.name ? target.name : '')
    ).slice(0, 80);
  }

  function recordInteraction(event) {
    if (!initialized || trackingStopped) return;
    const target = event.target;
    const isAnswer = target && target.closest && target.closest(
      '[data-question],[data-q],button.option,button.opt,input[type="radio"],input[type="checkbox"],select,textarea'
    );
    if (!isAnswer) return;

    const timestamp = now();
    pendingInteractions += 1;
    const id = answerId(target);
    if (id) pendingQuestionIds.add(id);
    if (lastAnswerAt !== null) {
      const interval = Math.max(0, timestamp - lastAnswerAt);
      if (interval < RAPID_ANSWER_MS) pendingRapidAnswers += 1;
      if (pendingFastestAnswerMs === null || interval < pendingFastestAnswerMs) {
        pendingFastestAnswerMs = interval;
      }
    }
    lastAnswerAt = timestamp;
    scheduleFlush();
  }

  function takePendingSnapshot() {
    pauseActive();
    const snapshot = {
      activeMs: pendingActiveMs,
      interactions: pendingInteractions,
      rapidAnswers: pendingRapidAnswers,
      fastestAnswerMs: pendingFastestAnswerMs,
      questionIds: Array.from(pendingQuestionIds),
      events: JSON.parse(JSON.stringify(pendingEvents))
    };
    pendingActiveMs = 0;
    pendingInteractions = 0;
    pendingRapidAnswers = 0;
    pendingFastestAnswerMs = null;
    pendingQuestionIds.clear();
    Object.keys(pendingEvents).forEach(key => delete pendingEvents[key]);
    beginActive();
    return snapshot;
  }

  function restorePending(snapshot) {
    pendingActiveMs += snapshot.activeMs || 0;
    pendingInteractions += snapshot.interactions || 0;
    pendingRapidAnswers += snapshot.rapidAnswers || 0;
    if (snapshot.fastestAnswerMs !== null && snapshot.fastestAnswerMs !== undefined) {
      pendingFastestAnswerMs = pendingFastestAnswerMs === null
        ? snapshot.fastestAnswerMs
        : Math.min(pendingFastestAnswerMs, snapshot.fastestAnswerMs);
    }
    (snapshot.questionIds || []).forEach(id => pendingQuestionIds.add(id));
    Object.entries(snapshot.events || {}).forEach(([name, value]) => {
      const bucket = eventBucket(name);
      bucket.count += value.count || 0;
      bucket.firstAt = bucket.firstAt && value.firstAt
        ? Math.min(bucket.firstAt, value.firstAt)
        : (bucket.firstAt || value.firstAt || null);
      bucket.lastAt = Math.max(bucket.lastAt || 0, value.lastAt || 0) || null;
      bucket.editableCount += value.editableCount || 0;
      bucket.pageCount += value.pageCount || 0;
    });
  }

  function mergeEvent(current, addition) {
    const value = current && typeof current === 'object' ? current : {};
    return {
      count: Number(value.count || 0) + Number(addition.count || 0),
      firstAt: value.firstAt && addition.firstAt
        ? Math.min(value.firstAt, addition.firstAt)
        : (value.firstAt || addition.firstAt || null),
      lastAt: Math.max(Number(value.lastAt || 0), Number(addition.lastAt || 0)) || null,
      editableCount: Number(value.editableCount || 0) + Number(addition.editableCount || 0),
      pageCount: Number(value.pageCount || 0) + Number(addition.pageCount || 0)
    };
  }

  function flush() {
    if (!telemetryRef || !initialized) return Promise.resolve();
    const pending = takePendingSnapshot();
    const hasEvents = Object.keys(pending.events).length > 0;
    const hasChanges = pending.activeMs || pending.interactions || pending.rapidAnswers ||
      pending.fastestAnswerMs !== null || pending.questionIds.length || hasEvents;
    if (!hasChanges) return Promise.resolve();

    flushChain = flushChain.then(() => telemetryRef.transaction(current => {
      const value = current && typeof current === 'object' ? current : {};
      value.version = 1;
      value.lastActivityAt = now();
      value.activeMs = Number(value.activeMs || 0) + Number(pending.activeMs || 0);
      value.answerInteractionCount = Number(value.answerInteractionCount || 0) + Number(pending.interactions || 0);
      value.rapidAnswerCount = Number(value.rapidAnswerCount || 0) + Number(pending.rapidAnswers || 0);
      if (pending.fastestAnswerMs !== null) {
        value.fastestAnswerIntervalMs = value.fastestAnswerIntervalMs === undefined
          ? pending.fastestAnswerMs
          : Math.min(Number(value.fastestAnswerIntervalMs), pending.fastestAnswerMs);
      }
      value.questionIds = value.questionIds && typeof value.questionIds === 'object' ? value.questionIds : {};
      pending.questionIds.forEach(id => { value.questionIds[id] = true; });
      value.events = value.events && typeof value.events === 'object' ? value.events : {};
      Object.entries(pending.events).forEach(([name, addition]) => {
        value.events[name] = mergeEvent(value.events[name], addition);
      });
      return value;
    }, undefined, false)).catch(error => {
      restorePending(pending);
      console.warn('[work-telemetry] No se pudo guardar la telemetría.', error && error.message);
    });
    return flushChain;
  }

  function scheduleFlush() {
    if (flushTimer) return;
    flushTimer = setTimeout(() => {
      flushTimer = null;
      flush();
    }, 1200);
  }

  async function markSubmission(response) {
    if (!telemetryRef || submissionRecorded) return;
    trackingStopped = true;
    pauseActive();
    await flush();
    const submittedAt = Number(
      response.submittedAt || response.completadaAt || response.submitted_at || response.timestamp || now()
    );
    await telemetryRef.transaction(current => {
      const value = current && typeof current === 'object' ? current : {};
      value.version = 1;
      value.submittedAt = value.submittedAt || submittedAt;
      value.submissionConfirmedAt = value.submissionConfirmedAt || now();
      value.submissionConfirmationCount = Number(value.submissionConfirmationCount || 0) + 1;
      if (value.startedAt) value.elapsedMsAtSubmission = Math.max(0, value.submittedAt - value.startedAt);
      else value.legacyTiming = true;
      return value;
    }, undefined, false);
    submissionRecorded = true;
    if (intervalTimer) clearInterval(intervalTimer);
    if (responseRef) responseRef.off('value', onResponseValue);
  }

  function onResponseValue(snapshot) {
    const response = snapshot.val() || {};
    if (response.completada === true || response.submitted === true) markSubmission(response).catch(() => null);
  }

  async function initialize(activeUser) {
    if (!activeUser || initialized) return;
    uid = activeUser.uid;
    telemetryRef = db.ref(`${BASE}/telemetria_clases/${sessionId}/${uid}`);
    responseRef = db.ref(`${BASE}/respuestas/${sessionId}/${uid}`);
    try {
      const offsetSnapshot = await db.ref('.info/serverTimeOffset').once('value');
      serverOffset = Number(offsetSnapshot.val() || 0);
    } catch (_) {
      serverOffset = 0;
    }

    const responseSnapshot = await responseRef.once('value');
    const response = responseSnapshot.val() || {};
    const alreadySubmitted = response.completada === true || response.submitted === true;
    const openedAt = now();
    await telemetryRef.transaction(current => {
      const value = current && typeof current === 'object' ? current : {};
      value.version = 1;
      value.sessionId = sessionId;
      value.path = location.pathname;
      value.firstPageOpenedAt = value.firstPageOpenedAt || openedAt;
      value.lastPageOpenedAt = openedAt;
      value.pageOpenCount = Number(value.pageOpenCount || 0) + 1;
      if (!alreadySubmitted) {
        value.startedAt = value.startedAt || openedAt;
        value.startedAtSource = value.startedAtSource || 'telemetry';
      } else if (!value.startedAt) {
        value.legacyTiming = true;
        value.submittedAt = value.submittedAt || Number(
          response.submittedAt || response.completadaAt || response.submitted_at || response.timestamp || openedAt
        );
      }
      return value;
    }, undefined, false);

    initialized = true;
    if (alreadySubmitted) {
      submissionRecorded = true;
      trackingStopped = true;
      return;
    }
    beginActive();
    responseRef.on('value', onResponseValue);
    intervalTimer = setInterval(flush, FLUSH_INTERVAL_MS);
  }

  document.addEventListener('copy', event => recordEvent('copy', event.target), true);
  document.addEventListener('paste', event => recordEvent('paste', event.target), true);
  document.addEventListener('cut', event => recordEvent('cut', event.target), true);
  document.addEventListener('contextmenu', event => recordEvent('contextMenu', event.target), true);
  document.addEventListener('dragstart', event => recordEvent('dragStart', event.target), true);
  document.addEventListener('selectstart', event => {
    const timestamp = now();
    if (timestamp - lastSelectionAt < SELECTION_THROTTLE_MS) return;
    lastSelectionAt = timestamp;
    recordEvent('selectionStart', event.target);
  }, true);
  document.addEventListener('keydown', event => {
    if (!(event.ctrlKey || event.metaKey)) return;
    const key = String(event.key || '').toLowerCase();
    if (key === 'c') recordEvent('shortcutCopy', event.target);
    if (key === 'v') recordEvent('shortcutPaste', event.target);
    if (key === 'x') recordEvent('shortcutCut', event.target);
    if (key === 'p') recordEvent('shortcutPrint', event.target);
  }, true);
  document.addEventListener('click', recordInteraction, true);
  document.addEventListener('change', recordInteraction, true);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      recordEvent('hidden', document.body);
      pauseActive();
      flush();
    } else {
      beginActive();
    }
  });
  window.addEventListener('blur', () => {
    recordEvent('windowBlur', document.body);
    pauseActive();
    flush();
  });
  window.addEventListener('focus', beginActive);
  window.addEventListener('beforeunload', () => {
    pauseActive();
    flush();
  });

  auth.onAuthStateChanged(user => {
    if (user) initialize(user).catch(error => {
      console.warn('[work-telemetry] No se pudo iniciar la telemetría.', error && error.message);
    });
  });
})();
