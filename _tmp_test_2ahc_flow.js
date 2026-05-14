const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(process.cwd(), 'estudiacest', '.env.local') });
const puppeteer = require('puppeteer');
const admin = require('firebase-admin');

const BASE_URL = 'https://www.estudiacest.com';
const LOGIN_URL = BASE_URL + '/';
const GUIDE_URL = BASE_URL + '/estudiantes/guia-u2-s1-columna-opinion.html';
const DASHBOARD_URL = BASE_URL + '/estudiantes/dashboard.html';
const SESSION_ID = 'sesion-u2-1';
const BASE = 'plataforma_estudiantes';
const ORIGINAL_PASSWORD = '123456';
const TEST_RUT = '11.111.111-1';
const PROFILE_TEST_PASSWORD = 'Flujo2026';

function normalizePrivateKey(raw) {
  let key = (raw || '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  if (key.includes('\\n')) key = key.replace(/\\n/g, '\n');
  const packed = key.replace(/\s+/g, '').match(/^-+BEGINPRIVATEKEY-+([A-Za-z0-9+/=]+)-+ENDPRIVATEKEY-+$/);
  if (packed) {
    const lines = packed[1].match(/.{1,64}/g) || [];
    key = '-----BEGIN PRIVATE KEY-----\n' + lines.join('\n') + '\n-----END PRIVATE KEY-----\n';
  }
  return key;
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY)
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://estudiacest-default-rtdb.firebaseio.com'
  });
}

const db = admin.database();
const auth = admin.auth();

function cleanRut(rut) {
  return String(rut || '').replace(/[.\s]/g, '').toUpperCase();
}

async function getStudentByRut(rut) {
  const snap = await db.ref(BASE + '/estudiantes').once('value');
  const students = snap.val() || {};
  const normalized = cleanRut(rut);
  for (const [uid, student] of Object.entries(students)) {
    if (cleanRut(student && student.rut) === normalized) {
      return { uid, ...(student || {}) };
    }
  }
  throw new Error('No se encontro estudiante con RUT ' + rut);
}

async function backupState(uid, course) {
  const refs = await Promise.all([
    db.ref(BASE + '/estudiantes/' + uid).once('value'),
    db.ref(BASE + '/respuestas/' + SESSION_ID + '/' + uid).once('value'),
    db.ref(BASE + '/resultados/' + SESSION_ID + '/' + uid).once('value'),
    db.ref(BASE + '/ranking/' + SESSION_ID + '/' + course + '/' + uid).once('value'),
    db.ref(BASE + '/avatar/' + uid).once('value')
  ]);
  return {
    student: refs[0].val(),
    response: refs[1].val(),
    result: refs[2].val(),
    ranking: refs[3].val(),
    avatar: refs[4].val()
  };
}

async function restoreNode(refPath, value) {
  const ref = db.ref(refPath);
  if (value === null || value === undefined) {
    await ref.remove();
    return;
  }
  await ref.set(value);
}

async function clearSessionArtifacts(uid, course) {
  await Promise.all([
    db.ref(BASE + '/respuestas/' + SESSION_ID + '/' + uid).remove(),
    db.ref(BASE + '/resultados/' + SESSION_ID + '/' + uid).remove(),
    db.ref(BASE + '/ranking/' + SESSION_ID + '/' + course + '/' + uid).remove(),
    db.ref(BASE + '/avatar/' + uid + '/sesiones/' + SESSION_ID).remove()
  ]);
}

async function restoreState(uid, course, backup, passwordWasChanged) {
  await restoreNode(BASE + '/estudiantes/' + uid, backup.student);
  await restoreNode(BASE + '/respuestas/' + SESSION_ID + '/' + uid, backup.response);
  await restoreNode(BASE + '/resultados/' + SESSION_ID + '/' + uid, backup.result);
  await restoreNode(BASE + '/ranking/' + SESSION_ID + '/' + course + '/' + uid, backup.ranking);
  await restoreNode(BASE + '/avatar/' + uid, backup.avatar);
  if (passwordWasChanged) {
    await auth.updateUser(uid, { password: ORIGINAL_PASSWORD });
  }
}

async function waitForUrl(page, matchers, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const current = page.url();
    if (matchers.some((matcher) => current.includes(matcher))) return current;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('No se alcanzo ninguna URL esperada: ' + matchers.join(', ') + '. URL actual: ' + page.url());
}

async function typeValue(page, selector, value) {
  await page.waitForSelector(selector, { timeout: 30000 });
  await page.click(selector, { clickCount: 3 });
  await page.type(selector, value, { delay: 20 });
}

async function setValue(page, selector, value) {
  await page.waitForSelector(selector, { timeout: 30000 });
  await page.$eval(selector, (element, nextValue) => {
    element.value = nextValue;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

(async () => {
  const report = {
    student: null,
    backupRestored: false,
    flow: {},
    checks: {},
    firebase: {},
    browserErrors: {
      console: [],
      page: [],
      requestFailed: [],
      responseErrors: []
    }
  };

  let browser;
  let page;
  let backup;
  let passwordWasChanged = false;

  try {
    const student = await getStudentByRut(TEST_RUT);
    report.student = { uid: student.uid, nombre: student.nombre || null, curso: student.curso || null, perfil_completo: !!student.perfil_completo };
    if (String(student.curso || '').trim().toUpperCase() !== '2A-HC') {
      throw new Error('La cuenta no pertenece a 2A-HC. Curso detectado: ' + student.curso);
    }

    backup = await backupState(student.uid, student.curso);
    await clearSessionArtifacts(student.uid, student.curso);

    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 1440, height: 1200 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    page.setDefaultTimeout(30000);

    page.on('console', async (msg) => {
      if (msg.type() !== 'error') return;
      const location = msg.location();
      report.browserErrors.console.push({ text: msg.text(), location });
    });
    page.on('pageerror', (error) => {
      report.browserErrors.page.push(String(error));
    });
    page.on('requestfailed', (request) => {
      const url = request.url();
      if (!url.includes('estudiacest.com')) return;
      if (url.includes('favicon') || url.includes('google-analytics')) return;
      report.browserErrors.requestFailed.push({ url, errorText: request.failure() && request.failure().errorText });
    });
    page.on('response', async (response) => {
      const url = response.url();
      if (!url.includes('estudiacest.com')) return;
      if (response.status() < 400) return;
      if (url.includes('favicon')) return;
      report.browserErrors.responseErrors.push({ url, status: response.status() });
    });
    page.on('dialog', async (dialog) => {
      report.flow.submitDialog = dialog.message();
      await dialog.accept();
    });

    await page.goto(LOGIN_URL, { waitUntil: 'networkidle2' });
    report.flow.rootUrl = page.url();
    report.checks.rootRedirectsToLecturas = page.url().includes('/lecturas/');

    await typeValue(page, '#rutInput', TEST_RUT);
    await typeValue(page, '#passInput', ORIGINAL_PASSWORD);
    await Promise.all([
      page.click('#loginBtn'),
      waitForUrl(page, ['/estudiantes/dashboard.html', '/estudiantes/perfil.html', '/estudiantes/guia-u2-s1-columna-opinion.html'], 45000)
    ]);
    report.flow.postLoginUrl = page.url();

    if (page.url().includes('/estudiantes/perfil.html')) {
      report.flow.profileStepTriggered = true;
      await setValue(page, '#emailInst', 'test.2ahc@salesianostalca.cl');
      await setValue(page, '#telefono', '+56 9 1111 1111');
      await setValue(page, '#apoderado', 'Cuenta de prueba 2AHC');
      await page.click('#btnStep1');
      await setValue(page, '#newPass', PROFILE_TEST_PASSWORD);
      await setValue(page, '#confirmPass', PROFILE_TEST_PASSWORD);
      passwordWasChanged = true;
      await Promise.all([
        page.click('#btnStep2'),
        waitForUrl(page, ['/estudiantes/dashboard.html', '/estudiantes/guia-u2-s1-columna-opinion.html'], 45000)
      ]);
      report.flow.afterProfileUrl = page.url();
    }

    if (!page.url().includes('/estudiantes/dashboard.html')) {
      await page.goto(DASHBOARD_URL, { waitUntil: 'networkidle2' });
    }
    await page.waitForSelector('body', { timeout: 30000 });
    report.flow.dashboardUrl = page.url();
    report.checks.dashboardReached = page.url().includes('/estudiantes/dashboard.html');

    const guideLinkExists = await page.$('a.btn-guia[href*="guia-u2-s1-columna-opinion.html"]') !== null;
    report.checks.guideLinkVisibleOnDashboard = guideLinkExists;
    if (!guideLinkExists) {
      throw new Error('No se encontro el acceso a la guia de Unidad 2 en el dashboard de 2A-HC.');
    }

    await Promise.all([
      page.click('a.btn-guia[href*="guia-u2-s1-columna-opinion.html"]'),
      waitForUrl(page, ['/estudiantes/guia-u2-s1-columna-opinion.html'], 30000)
    ]);
    report.flow.guideUrl = page.url();

    await page.waitForSelector('#questionList', { timeout: 30000 });
    report.checks.extraSectionVisible = await page.$eval('#extraOpinionTextsSection', (element) => !element.hidden);
    report.checks.extraText2Visible = await page.evaluate(() => document.body.innerText.includes('Leer tambien necesita horario'));
    report.checks.extraText3Visible = await page.evaluate(() => document.body.innerText.includes('El resumen automatico no reemplaza la comprension'));
    report.checks.extraMilestonesVisible = await page.evaluate(() => {
      const text2 = document.getElementById('msText2');
      const text3 = document.getElementById('msText3');
      return !!text2 && !!text3 && !text2.hidden && !text3.hidden;
    });

    await page.click('button[data-question="q1"][data-letter="A"]');
    await page.waitForTimeout(300);
    report.checks.noImmediateFeedback = await page.evaluate(() => ({
      shownBoxes: document.querySelectorAll('.feedback-box.show').length,
      correctHighlights: document.querySelectorAll('.option-btn.correct').length,
      wrongHighlights: document.querySelectorAll('.option-btn.wrong').length
    }));

    const answers = { q1: 'B', q2: 'B', q3: 'B', q4: 'C', q5: 'A' };
    for (const [questionId, letter] of Object.entries(answers)) {
      await page.click(`button[data-question="${questionId}"][data-letter="${letter}"]`);
      await page.waitForTimeout(120);
    }

    await setValue(page, '#ticketTexto2', 'La tesis del Texto 2 es que el liceo debe proteger un horario fijo de lectura. El apoyo aparece cuando el autor explica que un habito no se consolida si depende del tiempo sobrante y agrega que la lectura continua mejora vocabulario e interpretacion.');
    await setValue(page, '#ticketTexto3', 'La objecion del Texto 3 dice que el resumen automatico puede ayudar a quienes se sienten sobrepasados. El autor concede eso, pero luego limita su alcance con un giro: explica que no puede reemplazar la lectura porque vuelve al estudiante dependiente de una interpretacion ajena.');
    await setValue(page, '#ticketTesis', 'El uso del celular deberia regularse con criterios comunes y no prohibirse por completo.');
    await setValue(page, '#ticketContra', 'Alguien podria decir que una prohibicion total evita cualquier distraccion en la sala.');
    await setValue(page, '#ticketMarkers', 'Sin embargo, por eso, en otras palabras.');
    await setValue(page, '#thesisContext1', 'El liceo deberia regular el celular con reglas compartidas porque asi protege el aprendizaje sin eliminar una herramienta util.');

    await page.click('#saveGuideBtn');
    await page.waitForFunction(() => document.getElementById('sessionSaveStatus').textContent.includes('guardado'), { timeout: 30000 });
    report.checks.manualSaveWorked = await page.$eval('#sessionSaveStatus', (element) => element.textContent);

    const savedDraft = (await db.ref(BASE + '/respuestas/' + SESSION_ID + '/' + student.uid).once('value')).val() || {};
    report.firebase.savedDraft = {
      hasAnswers: !!savedDraft.answers,
      questionCount: savedDraft.answers ? Object.keys(savedDraft.answers).length : 0,
      ticketKeys: savedDraft.ticket ? Object.keys(savedDraft.ticket).filter((key) => String(savedDraft.ticket[key] || '').trim()) : [],
      thesisContext1: savedDraft.thesisContexts && savedDraft.thesisContexts.c1 ? true : false,
      hasResultBeforeSubmit: !!(await db.ref(BASE + '/resultados/' + SESSION_ID + '/' + student.uid).once('value')).val()
    };

    await page.reload({ waitUntil: 'networkidle2' });
    await page.waitForSelector('#ticketTexto2', { timeout: 30000 });
    report.checks.reloadPreservedDraft = await page.evaluate(() => ({
      q1Selected: !!document.querySelector('button[data-question="q1"][data-letter="B"].selected'),
      text2Value: document.getElementById('ticketTexto2').value,
      extraVisible: !document.getElementById('extraOpinionTextsSection').hidden
    }));

    await page.click('#submitGuideBtn');
    await page.waitForFunction(() => document.getElementById('submittedBanner').classList.contains('show'), { timeout: 30000 });
    await page.waitForTimeout(1000);

    report.checks.postSubmit = await page.evaluate(() => ({
      submittedBanner: document.getElementById('submittedBanner').innerText,
      feedbackBoxesShown: document.querySelectorAll('.feedback-box.show').length,
      correctHighlights: document.querySelectorAll('.option-btn.correct').length,
      wrongHighlights: document.querySelectorAll('.option-btn.wrong').length,
      scorePill: document.getElementById('scorePill').textContent,
      accuracyCopy: document.getElementById('accuracyCopy').textContent,
      progressCopy: document.getElementById('progressCopy').textContent
    }));

    const responseAfterSubmit = (await db.ref(BASE + '/respuestas/' + SESSION_ID + '/' + student.uid).once('value')).val() || {};
    const resultAfterSubmit = (await db.ref(BASE + '/resultados/' + SESSION_ID + '/' + student.uid).once('value')).val() || {};
    report.firebase.afterSubmit = {
      responseTicketKeys: responseAfterSubmit.ticket ? Object.keys(responseAfterSubmit.ticket).filter((key) => String(responseAfterSubmit.ticket[key] || '').trim()) : [],
      responseHasThesisContexts: !!(responseAfterSubmit.thesisContexts && Object.values(responseAfterSubmit.thesisContexts).some((value) => String(value || '').trim())),
      gradingMode: resultAfterSubmit.grading_mode || null,
      puntaje: resultAfterSubmit.puntaje,
      total: resultAfterSubmit.total,
      puntajeAlternativas: resultAfterSubmit.puntaje_alternativas,
      totalAlternativas: resultAfterSubmit.total_alternativas,
      puntajeDesarrollo: resultAfterSubmit.puntaje_desarrollo,
      totalDesarrollo: resultAfterSubmit.total_desarrollo,
      nota: resultAfterSubmit.nota,
      porcentajeFinal: resultAfterSubmit.porcentaje_final,
      detalleDesarrolloKeys: resultAfterSubmit.detalle_desarrollo ? Object.keys(resultAfterSubmit.detalle_desarrollo) : []
    };

    await page.goto(DASHBOARD_URL, { waitUntil: 'networkidle2' });
    await page.waitForSelector('body', { timeout: 30000 });
    report.checks.dashboardAfterSubmit = await page.evaluate(() => {
      const guideLink = document.querySelector('a.btn-guia[href*="guia-u2-s1-columna-opinion.html"]');
      const card = guideLink ? guideLink.closest('.session-card') : null;
      return {
        cardFound: !!card,
        cardText: card ? card.innerText : '',
        hasNotaBadge: card ? card.innerText.includes('Nota') : false,
        hasCompletedBadge: card ? card.innerText.includes('Completada') : false
      };
    });

    report.checks.browserErrorsPresent = {
      console: report.browserErrors.console.length,
      page: report.browserErrors.page.length,
      requestFailed: report.browserErrors.requestFailed.length,
      responseErrors: report.browserErrors.responseErrors.length
    };

    console.log(JSON.stringify({ ok: true, report }, null, 2));
  } catch (error) {
    if (page) {
      try {
        const screenshotPath = path.join(process.cwd(), '_tmp_2ahc_flow_failure.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.error('[2ahc-flow] screenshot=' + screenshotPath);
      } catch (_screenshotError) {}
    }
    console.error(JSON.stringify({ ok: false, error: String(error), report }, null, 2));
    process.exitCode = 1;
  } finally {
    try {
      if (browser) await browser.close();
    } catch (_browserError) {}
    try {
      if (report.student && backup) {
        await restoreState(report.student.uid, report.student.curso, backup, passwordWasChanged);
        report.backupRestored = true;
      }
    } catch (restoreError) {
      console.error('[2ahc-flow][restore-error]', restoreError.message);
      process.exitCode = 1;
    }
  }
})();
