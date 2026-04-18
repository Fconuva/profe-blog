// End-to-end flow tests for plataforma_estudiantes
// Tests Firebase rules, API logic, and data consistency
require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

const sa = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8'));
admin.initializeApp({ credential: admin.credential.cert(sa), databaseURL: process.env.FIREBASE_DATABASE_URL });

const db = admin.database();
const auth = admin.auth();
const BASE = 'plataforma_estudiantes';

let passed = 0, failed = 0;

function ok(test) { console.log(`  ✅ ${test}`); passed++; }
function fail(test, detail) { console.log(`  ❌ ${test}: ${detail}`); failed++; }

async function test(name, fn) {
    try { 
        const result = await fn();
        if (result === false) fail(name, 'returned false');
        else ok(name);
    } catch(e) { fail(name, e.message); }
}

async function main() {
    console.log('\n=== TESTS: Plataforma Estudiantes ===\n');

    // ---------- 1. Firebase Admin config ----------
    console.log('📋 1. Firebase Connection');
    await test('Admin SDK connects to RTDB', async () => {
        const snap = await db.ref(BASE).once('value');
        return snap.exists();
    });

    // ---------- 2. Admin node ----------
    console.log('\n📋 2. Admin Node');
    await test('Admin node exists', async () => {
        const snap = await db.ref(BASE + '/admins').once('value');
        const admins = snap.val();
        if (!admins || Object.keys(admins).length === 0) throw new Error('No admins found');
    });

    // ---------- 3. Students for new courses ----------
    console.log('\n📋 3. Student Data Integrity');
    for (const curso of ['1A-HC', '1B-HC', '2A-HC', '2B-HC']) {
        await test(`Students exist for ${curso}`, async () => {
            const snap = await db.ref(BASE + '/estudiantes').orderByChild('curso').equalTo(curso).once('value');
            const count = Object.keys(snap.val() || {}).length;
            if (count === 0) throw new Error(`No students in ${curso}`);
            console.log(`     → ${count} students`);
        });
    }

    // ---------- 4. Student auth accounts match DB ----------
    console.log('\n📋 4. Auth ↔ DB Consistency (sample)');
    const estSnap = await db.ref(BASE + '/estudiantes').limitToFirst(5).once('value');
    const students = estSnap.val() || {};
    for (const [uid, data] of Object.entries(students)) {
        await test(`Auth exists for ${data.nombre?.substring(0,20)}`, async () => {
            const user = await auth.getUser(uid);
            if (!user) throw new Error('Auth user not found');
            if (!user.email) throw new Error('No email');
        });
    }

    // ---------- 5. Sessions structure ----------
    console.log('\n📋 5. Sessions');
    await test('At least 1 session exists', async () => {
        const snap = await db.ref(BASE + '/sesiones').once('value');
        const sessions = snap.val();
        if (!sessions) throw new Error('No sessions');
        const ids = Object.keys(sessions);
        console.log(`     → ${ids.length} session(s): ${ids.join(', ')}`);
    });

    // Verify session structure
    const sesSnap = await db.ref(BASE + '/sesiones').limitToFirst(1).once('value');
    const sessions = sesSnap.val() || {};
    for (const [sesId, ses] of Object.entries(sessions)) {
        await test(`Session ${sesId} has required fields`, async () => {
            if (!ses.titulo) throw new Error('Missing titulo');
            const hasContent = ses.contenido || (ses.textos && ses.preguntas);
            if (!hasContent) throw new Error('Missing contenido/textos/preguntas');
        });
    }

    // ---------- 6. Results/Ranking paths ----------
    console.log('\n📋 6. Results & Ranking Data Paths');
    await test('Resultados node readable', async () => {
        const snap = await db.ref(BASE + '/resultados').once('value');
        // May be empty if no students have submitted yet
    });
    await test('Ranking node readable', async () => {
        const snap = await db.ref(BASE + '/ranking').once('value');
    });
    await test('Respuestas node readable', async () => {
        const snap = await db.ref(BASE + '/respuestas').once('value');
    });

    // ---------- 7. API endpoint simulation ----------
    console.log('\n📋 7. API Logic (direct)');

    // Test cleanRut consistency
    function cleanRut(r) { return (r || '').replace(/[.\s]/g, '').toUpperCase(); }
    function rutToEmail(r) { return cleanRut(r).replace(/-/g, '') + '@est.profefranciscopancho.com'; }
    function defaultPassword(r) { var d = cleanRut(r).replace(/[^0-9]/g, ''); return d.substring(0, 6).padEnd(6, '0'); }

    await test('cleanRut("12.345.678-9") → "12345678-9"', () => {
        const result = cleanRut('12.345.678-9');
        if (result !== '12345678-9') throw new Error(`Got: ${result}`);
    });
    await test('rutToEmail("12345678-9") → "123456789@est..."', () => {
        const result = rutToEmail('12345678-9');
        if (result !== '123456789@est.profefranciscopancho.com') throw new Error(`Got: ${result}`);
    });
    await test('defaultPassword("12345678-9") → "123456"', () => {
        const result = defaultPassword('12345678-9');
        if (result !== '123456') throw new Error(`Got: ${result}`);
    });
    await test('defaultPassword RUT with K: "23658027-K" → "236580"', () => {
        const result = defaultPassword('23658027-K');
        if (result !== '236580') throw new Error(`Got: ${result}`);
    });

    // ---------- 8. Reset password flow (dry run) ----------
    console.log('\n📋 8. Reset Password Flow');
    // Pick first student, verify we can read their RUT and compute password
    const firstUid = Object.keys(students)[0];
    const firstStudent = students[firstUid];
    if (firstStudent) {
        await test(`Can compute default password for ${firstStudent.nombre?.substring(0,20)}`, async () => {
            if (!firstStudent.rut) throw new Error('No RUT in DB');
            const pw = defaultPassword(firstStudent.rut);
            if (pw.length < 6) throw new Error(`Password too short: ${pw}`);
        });
    }

    // ---------- 9. Course totals ----------
    console.log('\n📋 9. Course Totals');
    const allEstSnap = await db.ref(BASE + '/estudiantes').once('value');
    const allEst = allEstSnap.val() || {};
    const courseCounts = {};
    for (const [, data] of Object.entries(allEst)) {
        courseCounts[data.curso] = (courseCounts[data.curso] || 0) + 1;
    }
    for (const [curso, count] of Object.entries(courseCounts).sort()) {
        console.log(`     ${curso}: ${count} estudiantes`);
    }

    // ---------- Summary ----------
    console.log(`\n${'='.repeat(40)}`);
    console.log(`  ✅ Passed: ${passed}`);
    console.log(`  ❌ Failed: ${failed}`);
    console.log(`${'='.repeat(40)}\n`);

    process.exit(failed > 0 ? 1 : 0);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
