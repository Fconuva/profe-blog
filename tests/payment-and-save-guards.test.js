const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dashboard = fs.readFileSync(path.join(root, 'dashboard', 'index.html'), 'utf8');
const admin = fs.readFileSync(path.join(root, 'admin', 'index.html'), 'utf8');
const docenteCreador = fs.readFileSync(path.join(root, 'docente-creador', 'index.njk'), 'utf8');
const courseConfig = require(path.join(root, 'lib', 'docente-creador-config.js'));
const webhook = require(path.join(root, 'api', 'mercadopago', 'webhook.js'))._test;
const verifySource = fs.readFileSync(path.join(root, 'api', 'mercadopago', 'verify-payment.js'), 'utf8');
const preferenceSource = fs.readFileSync(path.join(root, 'api', 'mercadopago', 'create_preference.js'), 'utf8');
const verifier = require(path.join(root, 'api', 'mercadopago', 'verify-payment.js'))._test;

test('all inline dashboard scripts have valid JavaScript syntax', () => {
  const scripts = Array.from(dashboard.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi));
  assert.ok(scripts.length > 0);
  scripts.forEach((match) => new Function(match[1]));
});

test('all inline admin scripts have valid JavaScript syntax', () => {
  const scripts = Array.from(admin.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi));
  assert.ok(scripts.length > 0);
  scripts.forEach((match) => new Function(match[1]));
});

test('instalment labels use recorded money and never invent two instalments', () => {
  assert.doesNotMatch(admin, /Abono 1\/2|\$100\.000 · saldo 2ª cuota/);
  assert.doesNotMatch(dashboard, /Abono 1\/2/);
  assert.match(admin, /montoPagadoReal\(p\)/);
  assert.match(admin, /p\.abonoAcumulado/);
  assert.match(admin, /p\.montoPagado/);
  assert.match(admin, /saldoPendienteReal\(p\)/);
  assert.match(admin, /planCuotas/);
});

test('inactive users are excluded even when the baja only exists in users', () => {
  assert.match(admin, /function esClienteInactivo\(c, p\)/);
  assert.match(admin, /\['baja', 'liberado', 'archivado', 'duplicado'\]/);
  assert.match(admin, /if \(esClienteInactivo\(c, _p\)\) return false/);
});

test('all inline Docente Creador scripts have valid JavaScript syntax', () => {
  const scripts = Array.from(docenteCreador.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi));
  assert.ok(scripts.length > 0);
  scripts.forEach((match) => new Function(match[1]));
});

test('reconciled cash and no-cobrar states cannot inflate receivables', () => {
  assert.match(admin, /cartera\.fuentePago === '_gestion\/LIBRO_DE_CAJA\.jsonl'/);
  assert.match(admin, /return pagadoLibro/);
  assert.match(admin, /p\.noCobrar === true \|\| cartera\.tramoCobro === 'no_cobrar'/);
  assert.match(admin, /p\.paymentStatus === 'gratis' \|\| sinCobro/);
});

test('collection agenda uses the reconciled portfolio ledger and keeps non-collectible balances separate', () => {
  assert.match(admin, /p\.compromisoPago \|\| \{\}/);
  assert.match(admin, /_cartera\.tramoCobro/);
  assert.match(admin, /_cartera\.proximoCobroFecha/);
  assert.match(admin, /Esperar entrega M1/);
  assert.match(admin, /Cobrar ahora/);
  assert.match(admin, /Cobro pausado/);
  assert.match(admin, /Las fechas de clase grabada no influyen/);
  assert.match(admin, /_cp\.estado === 'confirmado'/);
  assert.match(admin, /_cp\.estado === 'pausado'/);
  assert.match(admin, /_cp\.estado === 'fecha-incompleta'/);
  assert.match(admin, /_cartera\.tramoCobro === 'esperar_m1'/);
  assert.match(admin, /_agendaPersonas/);
  assert.doesNotMatch(admin, /fechaGrabacion[^\n]{0,120}agenda/i);
});

test('gross receivables are not confused with scheduled instalments', () => {
  assert.match(admin, /window\._resumenCarteraBruta/);
  assert.match(admin, /saldoTotal: pendingRevenue \+ sinPagarMonto/);
  assert.match(admin, /Cartera bruta:/);
  assert.match(admin, /no confundir esa suma operativa con el saldo total/);
  assert.match(admin, /saldos de quienes ya abonaron/);
  assert.doesNotMatch(admin, /Comprometido · te deben la 2ª cuota/);
});

test('financial potential respects each registered plan instead of inflating module-only clients', () => {
  assert.match(admin, /sinPagarMonto \+= price > 0 \? price : 199990/);
  assert.match(admin, /var potencial = totalRevenue \+ sinPagarMonto/);
  assert.match(admin, /potencial - planPaidRevenue/);
  assert.doesNotMatch(admin, /sinPagar \* 199990/);
  assert.match(admin, /según el valor de su plan/);
  assert.match(admin, /formatCLP\(x\.valor\)/);
  assert.doesNotMatch(admin, /a \$199\.990 cada uno/);
});

test('paused collections never leak into follow-up or no-response alerts', () => {
  assert.match(admin, /if \(_cp\.estado !== 'pausado'\)/);
  assert.match(admin, /_respuestaCartera === 'NO_RESPONDIO'/);
  assert.match(admin, /_respuestaCartera === 'CUBIERTO_POR_ABONO'/);
  assert.match(admin, /_respuestaCartera === 'SIN_COBRO_REGISTRADO'/);
});

test('abandoned phone-only user nodes do not inflate the client census', () => {
  assert.match(admin, /c && !_p && !\(c\.nombre \|\| c\.email \|\| c\.createdAt \|\| c\.inscripcionNum\)/);
  assert.match(admin, /Contacto \+'/);
});

test('optional payment badges never abort dashboard rendering when absent', () => {
  assert.match(admin, /var badge = document\.getElementById\('pagos-badge'\);\s*if \(badge\)/);
  assert.match(admin, /var preBadge = document\.getElementById\('preinscritos-badge'\);\s*if \(preBadge\)/);
});

test('paid drafts do not unlock the progress screen', () => {
  assert.match(
    dashboard,
    /!portData\.datosPortafolio\s*\|\|\s*!portData\.datosPortafolio\.completadoEn/
  );
});

test('critical Firebase saves suppress local value-event navigation', () => {
  assert.match(dashboard, /_suppressRender\s*\|\|\s*_criticalSaveInFlight/);
  assert.ok((dashboard.match(/beginCriticalSave\(\)/g) || []).length >= 4);
  assert.ok((dashboard.match(/verifyCompletedSave\(/g) || []).length >= 5);
  assert.match(dashboard, /_criticalSaveInFlight\s*\|\|\s*_criticalSaveFailed/);
});

test('restored drafts re-run conditional UI before preserving their values', () => {
  assert.match(dashboard, /syncRestoredConditionalUI\('pre-datos-form'\)/);
  assert.match(dashboard, /syncRestoredConditionalUI\('pre-step-modulos'\)/);
  assert.match(dashboard, /syncRestoredConditionalUI\('datos-form'\)/);
  assert.match(dashboard, /\['m2-tipo', 'm3-tiene-experiencia'\]/);
  assert.doesNotMatch(
    dashboard.match(/function syncRestoredConditionalUI[\s\S]*?\n        }/)[0],
    /bubbles:\s*true/
  );
});

test('back buttons describe the draft that is actually preserved', () => {
  assert.doesNotMatch(dashboard, /Sin guardar/);
  assert.match(dashboard, /conservar (?:el )?borrador/i);
});

test('payment timeout never redirects to an unlinked static payment URL', () => {
  assert.doesNotMatch(dashboard, /window\.location\.href\s*=\s*fallbackUrl/);
  assert.doesNotMatch(dashboard, /window\.open\(link/);
  assert.match(dashboard, /No se realizó ningún cobro/);
});

test('portfolio payment endpoints require the authenticated Firebase session', () => {
  assert.match(dashboard, /currentUser\.getIdToken\(\)/);
  assert.match(dashboard, /idToken:\s*idToken/);
  assert.match(verifySource, /verifyIdToken\(idToken\)/);
  assert.match(verifySource, /decoded\.uid\s*!==\s*uid/);
  assert.match(verifySource, /!linkedUid\s*&&\s*!linkedEmail/);
  assert.match(preferenceSource, /verifyIdToken\(idToken\)/);
  assert.doesNotMatch(preferenceSource, /json\(\{\s*error:\s*'internal_error',[^}]*stack:/);
});

test('course and ECEP webhooks require their exact CLP price', () => {
  assert.equal(courseConfig.COURSE_PRICE, 30000);
  assert.equal(webhook.isExpectedMoney({ transaction_amount: 10000, currency_id: 'CLP' }, 10000), true);
  assert.equal(webhook.isExpectedMoney({ transaction_amount: 9999, currency_id: 'CLP' }, 10000), false);
  assert.equal(webhook.isExpectedMoney({ transaction_amount: 30000, currency_id: 'USD' }, 30000), false);
});

test('webhook balance payments must match an actual pending instalment', () => {
  assert.equal(
    webhook.matchesPendingBalance(
      { paymentStatus: 'abono', saldoPendiente: 99990 },
      { transaction_amount: 99990 }
    ),
    true
  );
  assert.equal(
    webhook.matchesPendingBalance(
      { paymentStatus: 'pending', saldoPendiente: 99990 },
      { transaction_amount: 99990 }
    ),
    false
  );
  assert.equal(
    webhook.matchesPendingBalance(
      { paymentStatus: 'abono', saldoPendiente: 99990 },
      { transaction_amount: 50000 }
    ),
    false
  );
});

test('second instalment uses a server-created preference instead of a static link', () => {
  assert.match(dashboard, /iniciarPagoMP\('saldo'/);
  assert.match(preferenceSource, /portfolio\.saldoPendiente/);
  assert.match(preferenceSource, /tipo:\s*esSaldo\s*\?\s*'saldo'/);
});

test('Mercado Pago webhook accepts every supported notification id shape', () => {
  assert.equal(webhook.getNotificationId({ query: { 'data.id': '101' }, body: {} }), '101');
  assert.equal(webhook.getNotificationId({ query: { id: '102' }, body: {} }), '102');
  assert.equal(webhook.getNotificationId({ query: {}, body: { data: { id: '103' } } }), '103');
  assert.equal(webhook.getNotificationId({ query: {}, body: { payment_id: '104' } }), '104');
  assert.equal(webhook.getNotificationId({ query: {}, body: { id: 'event-1', data: { id: 'payment-1' } } }), 'payment-1');
});

test('payment classification distinguishes full payment, instalment and invalid money', () => {
  assert.deepEqual(
    webhook.classifyPortfolioPayment({ transaction_amount: 199990, currency_id: 'CLP' }, {}, 'completo'),
    { valid: true, type: 'completo', plan: 'completo' }
  );
  assert.deepEqual(
    webhook.classifyPortfolioPayment({ transaction_amount: 100000, currency_id: 'CLP' }, { tipo: 'abono' }, 'completo'),
    { valid: true, type: 'abono', plan: 'completo' }
  );
  assert.equal(
    webhook.classifyPortfolioPayment({ transaction_amount: 100000, currency_id: 'USD' }, {}, 'completo').valid,
    false
  );
  assert.equal(
    webhook.classifyPortfolioPayment({ transaction_amount: 50000, currency_id: 'CLP' }, {}, 'completo').valid,
    false
  );
  assert.deepEqual(
    webhook.classifyPortfolioPayment({ transaction_amount: 99990, currency_id: 'CLP' }, { tipo: 'saldo' }, 'completo'),
    { valid: true, type: 'saldo', plan: 'completo' }
  );
  assert.equal(
    webhook.classifyPortfolioPayment({ transaction_amount: 110001, currency_id: 'CLP' }, { tipo: 'abono' }, 'completo').valid,
    false
  );
  assert.equal(
    webhook.classifyPortfolioPayment({ transaction_amount: 100000, currency_id: 'CLP' }, { tipo: 'abono' }, 'modulo2').valid,
    false
  );
});

test('course registration creates a stable user-facing receipt', () => {
  const receipt = courseConfig.buildReceiptNumber('-Oabc1234XYZ9876', '2026-06-20');
  assert.equal(receipt, 'IA-2026-4XYZ9876');
  assert.deepEqual(Object.keys(courseConfig.DATE_OPTIONS), ['proxima-cohorte']);
  assert.match(docenteCreador, /Usuario del curso:/);
  assert.match(docenteCreador, /Comprobante de inscripción:/);
  assert.match(docenteCreador, /id="mi-inscripcion"/);
  assert.match(docenteCreador, /curso-ia-docentes\.mp4/);
});

test('an individually agreed price overrides the generic plan in admin and payments', () => {
  assert.match(admin, /function getPortfolioPrice\(portfolio\)/);
  assert.match(dashboard, /function portfolioPriceLabel\(portfolio\)/);
  assert.match(preferenceSource, /portfolio\.precioAcordado/);
  assert.deepEqual(
    webhook.classifyPortfolioPayment(
      { transaction_amount: 240000, currency_id: 'CLP' },
      {},
      'completo',
      { precioAcordado: 240000 }
    ),
    { valid: true, type: 'completo', plan: 'completo' }
  );
  assert.equal(
    webhook.classifyPortfolioPayment(
      { transaction_amount: 199990, currency_id: 'CLP' },
      {},
      'completo',
      { precioAcordado: 240000 }
    ).valid,
    false
  );

  const first = verifier.nextPortfolioPaymentState(
    { plan: 'completo', precioAcordado: 240000, paymentStatus: 'pending' },
    { id: 'especial-1', transaction_amount: 100000 },
    'completo',
    'abono',
    '2026-08-10T12:00:00.000Z'
  );
  assert.equal(first.saldoPendiente, 140000);
  const complete = verifier.nextPortfolioPaymentState(
    first,
    { id: 'especial-2', transaction_amount: 140000 },
    'completo',
    'saldo',
    '2026-08-10T12:00:00.000Z'
  );
  assert.equal(complete.paymentStatus, 'approved');
  assert.equal(complete.paymentAmount, 240000);
});

test('manual verification accumulates both instalments once and completes the portfolio', () => {
  const at = '2026-08-04T12:00:00.000Z';
  const first = verifier.nextPortfolioPaymentState(
    { plan: 'completo', paymentStatus: 'pending' },
    { id: 'pago-1', transaction_amount: 100000 },
    'completo',
    'abono',
    at
  );
  assert.equal(first.paymentStatus, 'abono');
  assert.equal(first.saldoPendiente, 99990);
  assert.equal(first.paymentAmount, 100000);

  const complete = verifier.nextPortfolioPaymentState(
    first,
    { id: 'pago-2', transaction_amount: 99990 },
    'completo',
    'saldo',
    at
  );
  assert.equal(complete.paymentStatus, 'approved');
  assert.equal(complete.paymentAmount, 199990);
  assert.equal(complete.saldoPendiente, null);
  assert.equal(complete.abonos.length, 2);

  const replay = verifier.nextPortfolioPaymentState(
    complete,
    { id: 'pago-2', transaction_amount: 99990 },
    'completo',
    'saldo',
    at
  );
  assert.deepEqual(replay, complete);
});

test('module payments are full payments and an approved portfolio is never downgraded', () => {
  assert.deepEqual(
    verifier.classifyPortfolioPayment({ transaction_amount: 99990, currency_id: 'CLP' }, {}, 'modulo2'),
    { valid: true, type: 'completo', plan: 'modulo2' }
  );
  const approved = { paymentStatus: 'approved', paymentAmount: 199990, comprobantePago: 'original' };
  const unchanged = verifier.nextPortfolioPaymentState(
    approved,
    { id: 'posterior', transaction_amount: 100000 },
    'completo',
    'abono',
    '2026-08-04T12:00:00.000Z'
  );
  assert.deepEqual(unchanged, approved);
});
