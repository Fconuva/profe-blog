'use strict';

const crypto = require('crypto');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { closeFirebase, readPlatform, updatePlatform } = require('./firebase-maintenance-db');

const API_KEY = 'AIzaSyCuDQ_iHDHmTd8bPeqUbsXQqdxw2SObt8w';
const SESSION_ID = 'sesion-u3-12';

async function jsonRequest(url, options = {}) {
  const response = await fetch(url, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${url} respondió HTTP ${response.status}: ${body.error?.message || body.error || 'sin detalle'}`);
  return body;
}

async function callClass(origin, idToken, action, method = 'GET', body = null) {
  return jsonRequest(`${origin}/api/estudiantes?action=${encodeURIComponent(action)}`, {
    method,
    headers:{ Authorization:`Bearer ${idToken}`, 'Content-Type':'application/json' },
    body:body ? JSON.stringify(body) : undefined
  });
}

async function main() {
  const originArg = process.argv.find(argument => argument.startsWith('--origin='));
  const origin = (originArg ? originArg.slice('--origin='.length) : 'https://www.estudiacest.com').replace(/\/$/, '');
  const suffix = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const email = `codex-u3s12-${suffix}@est.estudiacest.com`;
  const password = `Cx!${crypto.randomBytes(18).toString('base64url')}`;
  let uid = '';
  let idToken = '';
  try {
    const account = await jsonRequest(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
      method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ email, password, returnSecureToken:true })
    });
    uid = account.localId;
    idToken = account.idToken;
    await updatePlatform({
      [`estudiantes/${uid}`]:{ nombre:'CUENTA TÉCNICA PRUEBA U3S12', curso:'2A-HC', email, activa:true, perfil_completo:true, programa:'simce', createdAt:Date.now() }
    });

    const initial = await callClass(origin, idToken, 'simce-u3s12-state');
    if (!initial.session?.active || initial.attempt) throw new Error('El estado inicial no está activo y vacío.');

    const browser = await chromium.launch({ headless:true });
    try {
      const page = await browser.newPage({ viewport:{ width:390, height:844 } });
      await page.goto(`${origin}/estudiantes/`, { waitUntil:'networkidle' });
      await page.evaluate(async ({ email, password }) => {
        await firebase.auth().signInWithEmailAndPassword(email, password);
      }, { email, password });
      await page.goto(`${origin}/estudiantes/dashboard.html`, { waitUntil:'networkidle' });
      const card = page.locator('#currentSessionList a[href*="guia-u3-s12-entrevista.html"]');
      await card.waitFor({ state:'attached', timeout:30000 });
      assert.equal(await card.count(), 1, 'La Clase 12 debe aparecer una vez en la Unidad 3.');
      await page.goto(`${origin}/estudiantes/guia-u3-s12-entrevista.html`, { waitUntil:'networkidle' });
      await page.waitForFunction(() => !document.getElementById('submit').disabled);
      assert.equal(await page.locator('[data-question]').count(), 12);
      console.log('Panel estudiantil público: Clase 12 visible en Unidad 3 y guía operativa en celular.');
    } finally { await browser.close(); }

    const draftAnswers = { q1:'A', q2:'A', q3:'A', q4:'A' };
    await callClass(origin, idToken, 'simce-u3s12-save', 'POST', { answers:draftAnswers, metaResponses:{ m1:'', m2:'', m3:'' }, startedAt:Date.now() });
    const draft = await callClass(origin, idToken, 'simce-u3s12-state');
    if (!draft.attempt || draft.attempt.submitted || draft.attempt.completada || Object.keys(draft.attempt.answers || {}).length !== 4) {
      throw new Error('El autoguardado no devolvió un borrador canónico de cuatro respuestas.');
    }

    const answers = Object.fromEntries(Array.from({ length:12 }, (_, index) => [`q${index + 1}`, 'A']));
    const metaResponses = {
      m1:'La pregunta delimita el aspecto que la respuesta debe desarrollar.',
      m2:'La repregunta por el caso concreto permitió conocer un registro.',
      m3:'Revisaré la evidencia y descartaré opciones que exageran el texto.'
    };
    await callClass(origin, idToken, 'simce-u3s12-submit', 'POST', { answers, metaResponses, startedAt:Date.now() - 120000 });
    const finalState = await callClass(origin, idToken, 'simce-u3s12-state');
    if (!finalState.attempt || finalState.attempt.submitted !== true || finalState.attempt.completada !== true) {
      throw new Error('La relectura pública no confirmó submitted y completada.');
    }
    if (finalState.result !== null) throw new Error('El resultado se publicó antes de la liberación docente.');

    const platform = await readPlatform();
    const storedResponse = platform.respuestas?.[SESSION_ID]?.[uid];
    const storedResult = platform.resultados?.[SESSION_ID]?.[uid];
    if (!storedResponse?.submitted || !storedResponse?.completada || storedResult?.total !== 12 || storedResult?.score !== 3) {
      throw new Error('La verificación administrativa no coincide con la entrega controlada.');
    }
    console.log(JSON.stringify({
      origin,
      state:true,
      autosave:true,
      submitted:true,
      completada:true,
      resultHidden:true,
      storedTotal:storedResult.total,
      storedScore:storedResult.score,
      cleanupPlanned:true
    }, null, 2));
  } finally {
    if (uid) {
      await updatePlatform({
        [`estudiantes/${uid}`]:null,
        [`respuestas/${SESSION_ID}/${uid}`]:null,
        [`resultados/${SESSION_ID}/${uid}`]:null,
        [`telemetria/${SESSION_ID}/${uid}`]:null
      }).catch(error => console.error(`TEST_CLEANUP_DB_FAILED: ${error.message}`));
    }
    if (idToken) {
      await jsonRequest(`https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${API_KEY}`, {
        method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ idToken })
      }).catch(error => console.error(`TEST_CLEANUP_AUTH_FAILED: ${error.message}`));
    }
    await closeFirebase();
  }
}

if (require.main === module) main().catch(error => { console.error(`SIMCE_U3S12_PRODUCTION_CHECK_FAILED: ${error.message}`); process.exit(1); });
