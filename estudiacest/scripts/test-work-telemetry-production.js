const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const { chromium } = require('playwright');

const BASE = 'plataforma_estudiantes';
const SESSION = 'sesion-u3-7';
const DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const GUIDE_URL = 'https://www.estudiacest.com/estudiantes/guia-u3-s7-discurso.html';

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (!argv[index].startsWith('--')) continue;
    const key = argv[index].slice(2);
    const value = argv[index + 1];
    args[key] = value && !value.startsWith('--') ? value : true;
    if (value && !value.startsWith('--')) index += 1;
  }
  return args;
}

function privateKey(raw) {
  return String(raw || '').trim().replace(/\\n/g, '\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  dotenv.config({ path: path.resolve(args.env || '.env.local'), override: Boolean(args.env) });
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey(process.env.FIREBASE_PRIVATE_KEY)
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL || DATABASE_URL
  });

  const db = admin.database();
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const email = `telemetry-${suffix}@example.invalid`;
  let user = null;
  let browser = null;
  const consoleErrors = [];
  try {
    user = await admin.auth().createUser({ email, displayName: 'Estudiante de prueba telemetría' });
    await db.ref(`${BASE}/estudiantes/${user.uid}`).set({
      nombre: 'Estudiante de prueba telemetría',
      curso: '2A-HC',
      run: '00.000.000-0',
      activo: true
    });
    const token = await admin.auth().createCustomToken(user.uid);
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 820 } });
    const page = await context.newPage();
    page.on('console', message => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', error => consoleErrors.push(error.message));

    await page.goto(`${GUIDE_URL}?preview=1`, { waitUntil: 'networkidle' });
    await page.evaluate(async customToken => {
      await firebase.auth().signInWithCustomToken(customToken);
    }, token);
    await page.goto(`${GUIDE_URL}?telemetry-test=${encodeURIComponent(suffix)}`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.body.textContent.includes('Estudiante de prueba telemetría'));
    await page.waitForFunction(async ({ base, session, uid }) => {
      const snapshot = await firebase.database().ref(`${base}/telemetria_clases/${session}/${uid}`).once('value');
      return Number(snapshot.val()?.startedAt) > 0;
    }, { base: BASE, session: SESSION, uid: user.uid });
    await page.locator('[data-question]').first().click();
    await page.locator('.reading').first().dispatchEvent('copy');
    await page.locator('.reading').first().dispatchEvent('contextmenu');
    await page.locator('.reading').first().dispatchEvent('selectstart');
    await page.keyboard.press('Control+C');
    await page.evaluate(() => window.dispatchEvent(new Event('blur')));
    await page.waitForTimeout(2500);

    const submittedAt = Date.now();
    await db.ref(`${BASE}/respuestas/${SESSION}/${user.uid}`).update({
      submitted: true,
      completada: true,
      submittedAt,
      completadaAt: submittedAt,
      updatedAt: submittedAt,
      score: 0,
      total: 50
    });
    await page.waitForTimeout(2500);

    const ownRead = await page.evaluate(async ({ base, session, uid }) => {
      const snapshot = await firebase.database().ref(`${base}/telemetria_clases/${session}/${uid}`).once('value');
      return snapshot.exists();
    }, { base: BASE, session: SESSION, uid: user.uid });
    const deniedRead = await page.evaluate(async ({ base, session }) => {
      try {
        await firebase.database().ref(`${base}/telemetria_clases/${session}/otro-uid`).once('value');
        return false;
      } catch (error) {
        return error && error.code === 'PERMISSION_DENIED';
      }
    }, { base: BASE, session: SESSION });
    const deniedWrite = await page.evaluate(async ({ base, session }) => {
      try {
        await firebase.database().ref(`${base}/telemetria_clases/${session}/otro-uid`).set({ test: true });
        return false;
      } catch (error) {
        return error && error.code === 'PERMISSION_DENIED';
      }
    }, { base: BASE, session: SESSION });

    const telemetry = (await db.ref(`${BASE}/telemetria_clases/${SESSION}/${user.uid}`).once('value')).val() || {};
    const checks = {
      ownRead,
      deniedRead,
      deniedWrite,
      startedAt: Number(telemetry.startedAt) > 0,
      submittedAt: Number(telemetry.submittedAt) === submittedAt,
      elapsed: Number(telemetry.elapsedMsAtSubmission) > 0,
      activeTime: Number(telemetry.activeMs) > 0,
      answerInteractions: Number(telemetry.answerInteractionCount) > 0,
      copyEvent: Number(telemetry.events?.copy?.count) > 0,
      copyShortcut: Number(telemetry.events?.shortcutCopy?.count) > 0,
      contextMenu: Number(telemetry.events?.contextMenu?.count) > 0,
      focusEvent: Number(telemetry.events?.windowBlur?.count) > 0
    };
    const failures = Object.entries(checks).filter(([, value]) => value !== true).map(([key]) => key);
    if (consoleErrors.length) failures.push('browserConsole');
    if (failures.length) throw new Error(`Fallaron controles: ${failures.join(', ')}. Consola: ${consoleErrors.join(' | ')}`);
    console.log(JSON.stringify({ status: 'ok', checks, consoleErrors: consoleErrors.length }, null, 2));
  } finally {
    if (browser) await browser.close().catch(() => null);
    if (user) {
      await Promise.all([
        db.ref(`${BASE}/telemetria_clases/${SESSION}/${user.uid}`).remove(),
        db.ref(`${BASE}/respuestas/${SESSION}/${user.uid}`).remove(),
        db.ref(`${BASE}/resultados/${SESSION}/${user.uid}`).remove(),
        db.ref(`${BASE}/estudiantes/${user.uid}`).remove()
      ]).catch(() => null);
      await admin.auth().deleteUser(user.uid).catch(() => null);
    }
    await admin.app().delete().catch(() => null);
  }
}

main().catch(error => {
  console.error('[test-work-telemetry-production]', error.message);
  process.exitCode = 1;
});
