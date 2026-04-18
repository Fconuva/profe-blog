require('dotenv').config({ path: '.env.local' });
const puppeteer = require('puppeteer');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  let credential;
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8'));
    credential = admin.credential.cert(serviceAccount);
  } else {
    credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
    });
  }

  admin.initializeApp({
    credential,
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const db = admin.database();
const auth = admin.auth();

const STUDENT_BASE = 'plataforma_estudiantes';
const LECTURAS_BASE = 'plataforma_lecturas';
const BASE_URL = process.env.LECTURAS_BASE_URL || 'http://127.0.0.1:4173/lecturas/';
const SESSION_ID = 'pedro-paramo-nm3-dil-2026';

const TEST_STUDENTS = [
  {
    label: 'Darwyn',
    rut: '23206060-3',
    initialPassword: '232060',
    newPassword: 'Darwyn2026',
    email: 'darwyn.test@salesianostalca.cl',
    phone: '+56 9 1111 1111',
    guardian: 'Apoderado Darwyn'
  },
  {
    label: 'Mahikol',
    rut: '23149788-9',
    initialPassword: '231497',
    newPassword: 'Mahikol2026',
    email: 'mahikol.test@salesianostalca.cl',
    phone: '+56 9 2222 2222',
    guardian: 'Apoderado Mahikol'
  }
];

function cleanRut(rut) {
  return String(rut || '').replace(/[.\s]/g, '').toUpperCase();
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}

async function getStudentByRut(rut) {
  const snap = await db.ref(STUDENT_BASE + '/estudiantes').once('value');
  const students = snap.val() || {};
  const normalized = cleanRut(rut);
  for (const [uid, student] of Object.entries(students)) {
    if (cleanRut(student && student.rut) === normalized) {
      return { uid, ...student };
    }
  }
  throw new Error('No se encontro estudiante con RUT ' + rut);
}

async function resetStudentForTest(testStudent) {
  const student = await getStudentByRut(testStudent.rut);
  await auth.updateUser(student.uid, {
    password: testStudent.initialPassword,
    displayName: student.nombre || testStudent.label
  });

  await db.ref(STUDENT_BASE + '/estudiantes/' + student.uid).update({
    perfil_completo: false,
    password_changed: false,
    email_institucional: null,
    telefono: null,
    nombre_apoderado: null,
    perfil_completado_at: null,
    lastLogin: null
  });

  await db.ref(LECTURAS_BASE + '/respuestas/' + SESSION_ID + '/' + student.uid).remove();
  await db.ref(LECTURAS_BASE + '/resultados/' + SESSION_ID + '/' + student.uid).remove();
  return student;
}

async function getPageSnapshot(page) {
  const bodyText = await page.evaluate(() => document.body ? document.body.innerText.slice(0, 1200) : '');
  return {
    url: page.url(),
    bodyText
  };
}

async function waitForLecturasRoute(page, expectedParts, timeout = 30000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const currentUrl = page.url();
    if (expectedParts.some(part => currentUrl.includes(part))) return currentUrl;
    await new Promise(resolve => setTimeout(resolve, 250));
  }

  const snapshot = await getPageSnapshot(page);
  throw new Error(
    'No se alcanzo ninguna ruta esperada (' + expectedParts.join(', ') + '). URL actual: '
    + snapshot.url
    + '\nContenido visible:\n'
    + snapshot.bodyText
  );
}

async function completeProfile(page, student) {
  await page.waitForSelector('#emailField', { timeout: 30000 });
  await page.$eval('#emailField', (element, value) => {
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, student.email);
  await page.$eval('#phoneField', (element, value) => {
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, student.phone);
  await page.$eval('#guardianField', (element, value) => {
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, student.guardian);
  await page.$eval('#newPass', (element, value) => {
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, student.newPassword);
  await page.$eval('#confirmPass', (element, value) => {
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, student.newPassword);
  await page.click('#saveBtn');
  try {
    await waitForLecturasRoute(page, ['dashboard.html', 'prueba.html'], 30000);
  } catch (error) {
    const bodyText = await page.evaluate(() => document.body ? document.body.innerText.slice(0, 1200) : '');
    throw new Error('No se completo el perfil o no redirigio. URL actual: ' + page.url() + '\nContenido visible:\n' + bodyText);
  }
}

async function ensureOnTestPage(page) {
  if (page.url().includes('prueba.html')) return;
  try {
    await waitForLecturasRoute(page, ['prueba.html'], 6000);
    if (page.url().includes('prueba.html')) return;
  } catch (error) {
    // Continue and try the manual path through dashboard.
  }
  try {
    await page.waitForSelector('.cta', { timeout: 30000 });
  } catch (error) {
    const bodyText = await page.evaluate(() => document.body ? document.body.innerText.slice(0, 1200) : '');
    throw new Error('No se encontro acceso a la prueba. URL actual: ' + page.url() + '\nContenido visible:\n' + bodyText);
  }
  await page.click('.cta');
  await waitForLecturasRoute(page, ['prueba.html'], 30000);
}

async function getTocOrder(page) {
  await page.waitForSelector('#tocList button', { timeout: 30000 });
  return page.$$eval('#tocList button', buttons => buttons.map(button => button.textContent.trim()));
}

async function markStrikeAndCapture(page) {
  await page.waitForSelector('.item-card .strike-toggle', { timeout: 30000 });
  const meta = await page.evaluate(() => {
    const tocButton = document.querySelector('#tocList button');
    const optionLetter = document.querySelector('.item-card .option .letter');
    const strikeButton = document.querySelector('.item-card .strike-toggle');
    const rect = strikeButton ? strikeButton.getBoundingClientRect() : null;
    const centerX = rect ? rect.left + (rect.width / 2) : null;
    const centerY = rect ? rect.top + (rect.height / 2) : null;
    const hit = (centerX !== null && centerY !== null) ? document.elementFromPoint(centerX, centerY) : null;
    return {
      itemId: tocButton ? tocButton.dataset.tocId : null,
      optionLetter: optionLetter ? optionLetter.textContent.trim() : null,
      clickProbe: {
        rect,
        hitTag: hit ? hit.tagName : null,
        hitClass: hit ? hit.className : null,
        hitText: hit ? hit.textContent.trim() : null
      }
    };
  });
  await page.click('.item-card .strike-toggle');
  const stateAfterClick = await page.evaluate(() => {
    const firstToggle = document.querySelector('.item-card .strike-toggle');
    let uiStateSnapshot = null;
    try {
      uiStateSnapshot = typeof uiState === 'undefined' ? null : JSON.parse(JSON.stringify(uiState));
    } catch (error) {
      uiStateSnapshot = { error: String(error) };
    }
    return {
      toggleActive: !!(firstToggle && firstToggle.classList.contains('active')),
      toggleText: firstToggle ? firstToggle.textContent.trim() : null,
      uiStateSnapshot
    };
  });

  let stateAfterDomClick = null;
  if (!stateAfterClick.toggleActive) {
    await page.$eval('.item-card .strike-toggle', button => button.click());
    stateAfterDomClick = await page.evaluate(() => {
      const firstToggle = document.querySelector('.item-card .strike-toggle');
      let uiStateSnapshot = null;
      try {
        uiStateSnapshot = typeof uiState === 'undefined' ? null : JSON.parse(JSON.stringify(uiState));
      } catch (error) {
        uiStateSnapshot = { error: String(error) };
      }
      return {
        toggleActive: !!(firstToggle && firstToggle.classList.contains('active')),
        toggleText: firstToggle ? firstToggle.textContent.trim() : null,
        uiStateSnapshot
      };
    });
  }

  return { ...meta, stateAfterClick, stateAfterDomClick };
}

async function answerAllItems(page) {
  await page.evaluate(() => {
    document.querySelectorAll('.item-card').forEach(card => {
      const selects = Array.from(card.querySelectorAll('select.pair-select'));
      if (selects.length) {
        const used = new Set();
        selects.forEach(select => {
          const values = Array.from(select.options).map(option => option.value).filter(Boolean);
          const nextValue = values.find(value => !used.has(value)) || values[0] || '';
          select.value = nextValue;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          used.add(nextValue);
        });
        return;
      }

      const textarea = card.querySelector('textarea.answer-box');
      if (textarea) {
        textarea.value = 'Respuesta automatica de prueba';
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        return;
      }

      const option = card.querySelector('.option .option-main');
      if (option) option.click();
    });
  });
}

async function submitTest(page) {
  const dialogs = [];
  page.on('dialog', async dialog => {
    dialogs.push(dialog.message());
    await dialog.accept();
  });
  await page.click('#submitBtn');
  await page.waitForFunction(() => {
    const pill = document.getElementById('savePill');
    return pill && pill.textContent.includes('Enviado');
  }, { timeout: 30000 });
  return dialogs;
}

async function runStudentFlow(browser, studentConfig, shouldSubmit) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  page.on('console', async message => {
    const args = [];
    for (const arg of message.args()) {
      try {
        const value = await arg.jsonValue();
        args.push(typeof value === 'object' ? JSON.stringify(value) : String(value));
      } catch (error) {
        args.push(arg.toString());
      }
    }
    const extra = args.length ? ' ' + args.join(' ') : '';
    console.log('[browser:' + studentConfig.label + ']', message.type(), message.text() + extra);
  });
  page.on('pageerror', error => {
    console.log('[pageerror:' + studentConfig.label + ']', error.message);
  });
  await page.goto(BASE_URL + 'index.html', { waitUntil: 'networkidle2' });
  await page.type('#rutInput', studentConfig.rut);
  await page.type('#passInput', studentConfig.initialPassword);
  await page.click('#loginBtn');
  await waitForLecturasRoute(page, ['perfil.html', 'dashboard.html', 'prueba.html'], 30000);

  if (page.url().includes('perfil.html')) {
    await completeProfile(page, studentConfig);
  }

  await ensureOnTestPage(page);
  const tocOrder = await getTocOrder(page);
  const strikeMeta = await markStrikeAndCapture(page);

  if (shouldSubmit) {
    await answerAllItems(page);
    const dialogs = await submitTest(page);
    await context.close();
    return { tocOrder, strikeMeta, dialogs };
  }

  await context.close();
  return { tocOrder, strikeMeta, dialogs: [] };
}

async function verifySavedData(student, strikeMeta) {
  const responseSnap = await db.ref(LECTURAS_BASE + '/respuestas/' + SESSION_ID + '/' + student.uid).once('value');
  const resultSnap = await db.ref(LECTURAS_BASE + '/resultados/' + SESSION_ID + '/' + student.uid).once('value');
  const response = responseSnap.val();
  const result = resultSnap.val();

  if (!response || !response.completada) {
    throw new Error('No se guardo correctamente la respuesta del estudiante ' + student.nombre);
  }
  if (!result) {
    throw new Error('No se guardo correctamente el resultado del estudiante ' + student.nombre);
  }
  if (!strikeMeta.itemId || !strikeMeta.optionLetter) {
    throw new Error('No se pudo capturar metadata de strike.');
  }
  if (!(response.ui_state && response.ui_state.strikes && response.ui_state.strikes[strikeMeta.itemId] && response.ui_state.strikes[strikeMeta.itemId][strikeMeta.optionLetter])) {
    throw new Error('El strike no quedo persistido en Firebase. Debug: ' + JSON.stringify(strikeMeta));
  }
}

async function main() {
  console.log('=== Test Lecturas Flow ===');
  console.log('Base URL:', BASE_URL);

  const preparedStudents = [];
  for (const config of TEST_STUDENTS) {
    const student = await resetStudentForTest(config);
    preparedStudents.push({ ...config, uid: student.uid, nombre: student.nombre || config.label });
  }

  const browser = await puppeteer.launch({ headless: true });
  try {
    const first = await runStudentFlow(browser, preparedStudents[0], true);
    const second = await runStudentFlow(browser, preparedStudents[1], false);

    await verifySavedData(preparedStudents[0], first.strikeMeta);

    const firstTop = first.tocOrder.slice(0, 5);
    const secondTop = second.tocOrder.slice(0, 5);
    const shuffleDifferent = !arraysEqual(firstTop, secondTop);

    console.log('\nOrden estudiante 1:', firstTop.join(' | '));
    console.log('Orden estudiante 2:', secondTop.join(' | '));
    console.log('Shuffle distinto:', shuffleDifferent ? 'SI' : 'NO');
    console.log('Dialogs flujo 1:', first.dialogs.join(' | '));

    if (!shuffleDifferent) {
      throw new Error('El shuffle no produjo orden distinto entre estudiantes.');
    }

    console.log('\nResultado: OK');
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error('\nResultado: ERROR');
  console.error(error);
  process.exit(1);
});