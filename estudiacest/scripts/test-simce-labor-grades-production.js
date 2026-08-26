const fs = require('fs');
const os = require('os');
const path = require('path');
const { chromium } = require('playwright');

const BASE = 'plataforma_estudiantes';
const DASHBOARD_URL = 'https://www.estudiacest.com/estudiantes/dashboard.html';
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCuDQ_iHDHmTd8bPeqUbsXQqdxw2SObt8w',
  authDomain: 'estudiacest.firebaseapp.com',
  databaseURL: 'https://estudiacest-default-rtdb.firebaseio.com',
  projectId: 'estudiacest'
};

async function main() {
  const sourcePath = process.argv[2] || path.join(os.tmpdir(), 'simce-u3-labor-review.json');
  const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  const rows = source.rows || [];
  const candidates = [...new Map(rows.filter(row => row.uid && row.run).map(row => [row.uid, row])).values()];
  if (!candidates.length) throw new Error('No hay una cuenta verificable en el informe privado.');

  const browserErrors = [];
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 820 } });
    const page = await context.newPage();
    page.on('console', message => {
      if (message.type() === 'error') browserErrors.push(message.text());
    });
    page.on('pageerror', error => browserErrors.push(error.message));

    await page.goto('https://www.estudiacest.com/', { waitUntil: 'domcontentloaded' });
    await page.addScriptTag({ url: 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js' });
    await page.addScriptTag({ url: 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js' });
    await page.evaluate(config => {
      if (!firebase.apps.length) firebase.initializeApp(config);
      return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    }, FIREBASE_CONFIG);

    let selected = null;
    for (const candidate of candidates.slice(0, 24)) {
      const digits = String(candidate.run).replace(/[^0-9]/g, '');
      if (digits.length < 6) continue;
      const email = String(candidate.run).replace(/[^0-9kK]/g, '').toLowerCase() + '@est.estudiacest.com';
      const authenticated = await page.evaluate(async ({ email, password }) => {
        try {
          const credential = await firebase.auth().signInWithEmailAndPassword(email, password);
          return credential.user.uid;
        } catch (error) {
          return null;
        }
      }, { email, password: digits.slice(0, 6) });
      if (authenticated === candidate.uid) {
        selected = candidate;
        break;
      }
    }
    if (!selected) throw new Error('Ninguna de las cuentas verificadas conserva la contraseña inicial; no se alteraron cuentas.');
    browserErrors.length = 0;

    const studentRows = rows.filter(row => row.uid === selected.uid);
    const expectedAverage = (studentRows.reduce((sum, row) => sum + Number(row.proposedGrade), 0) / studentRows.length)
      .toFixed(1)
      .replace('.', ',');
    await page.goto(`${DASHBOARD_URL}?labor-test=${Date.now()}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#laborGradesPanel.visible');

    const panel = page.locator('#laborGradesPanel');
    const collapsedByDefault = !(await panel.evaluate(element => element.open));
    const average = (await page.locator('#laborAverage').textContent()).trim();
    await panel.locator('summary').click();
    const renderedRows = await page.locator('#laborGradesBody tr').count();
    const panelText = await panel.textContent();
    const emailHref = await panel.locator('a[href^="mailto:"]').getAttribute('href');

    await page.setViewportSize({ width: 390, height: 844 });
    const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    const ownRead = await page.evaluate(async ({ base, uid }) => {
      const snapshot = await firebase.database().ref(`${base}/calificaciones_clase/${uid}`).once('value');
      return snapshot.numChildren();
    }, { base: BASE, uid: selected.uid });
    const crossReadDenied = await page.evaluate(async base => {
      try {
        await firebase.database().ref(`${base}/calificaciones_clase/otro-uid`).once('value');
        return false;
      } catch (error) {
        return error && error.code === 'PERMISSION_DENIED';
      }
    }, BASE);
    const ownWriteDenied = await page.evaluate(async ({ base, uid }) => {
      try {
        await firebase.database().ref(`${base}/calificaciones_clase/${uid}/sesion-u3-1/grade`).set(7);
        return false;
      } catch (error) {
        return error && error.code === 'PERMISSION_DENIED';
      }
    }, { base: BASE, uid: selected.uid });

    const unexpectedErrors = browserErrors.filter(message => !message.includes('PERMISSION_DENIED'));
    const checks = {
      collapsedByDefault,
      average: average === expectedAverage,
      rows: renderedRows === 6,
      legend: ['Sin entrega', 'Borrador', 'Escritura incompleta', 'Ajuste por coincidencia textual'].every(label => panelText.includes(label)),
      contactEmail: emailHref === 'mailto:frnunez@salesianostalca.cl',
      mobileNoPageOverflow: !mobileOverflow,
      ownRead: ownRead === 6,
      crossReadDenied,
      ownWriteDenied,
      browserConsole: unexpectedErrors.length === 0
    };
    const failures = Object.entries(checks).filter(([, value]) => value !== true).map(([key]) => key);
    if (failures.length) throw new Error(`Fallaron controles: ${failures.join(', ')}. Consola: ${unexpectedErrors.join(' | ')}`);
    console.log(JSON.stringify({ status: 'ok', checks }, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error('[test-simce-labor-grades-production]', error.message);
  process.exitCode = 1;
});
