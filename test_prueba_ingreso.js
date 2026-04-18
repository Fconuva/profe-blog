// ============================================================
// Test: Prueba de Ingreso — Full E2E flow
// Simulates a student answering 10 questions, submitting,
// and verifies respuestas + resultados + ranking in Firebase.
// ============================================================
require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

const sa = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8'));
if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(sa), databaseURL: process.env.FIREBASE_DATABASE_URL });

const db = admin.database();
const BASE = 'plataforma_estudiantes';
const SESSION_ID = 'prueba-ingreso';

// Correct answers from the preloaded prueba de ingreso
const CORRECT_ANSWERS = {
    1: 'B',  // Cuaderno de tapas duras
    2: 'D',  // Habitación secreta = mundo interior
    3: 'C',  // "De nosotras" = refleja vínculo
    4: 'A',  // Propósito: narrar experiencia que despierta creatividad
    5: 'A',  // 15% más retención
    6: 'C',  // 7 años
    7: 'D',  // Paradoja: se abandona cuando más se necesita
    8: 'B',  // Finlandia respalda la idea
    9: 'C',  // 134 incidentes, 45% más
    10: 'B'  // Informar y persuadir sobre normas de celular
};

let passed = 0, failed = 0;
function ok(msg) { console.log(`  ✅ ${msg}`); passed++; }
function fail(msg, detail) { console.log(`  ❌ ${msg}: ${detail}`); failed++; }

async function main() {
    console.log('\n🧪 === TEST: Prueba de Ingreso — Flujo Completo ===\n');

    // 1. Verify session exists in Firebase
    console.log('📋 1. Verificar sesión prueba-ingreso en Firebase');
    const sesSnap = await db.ref(BASE + '/sesiones/' + SESSION_ID).once('value');
    const sesion = sesSnap.val();
    if (!sesion) {
        fail('Sesión prueba-ingreso existe', 'NO ENCONTRADA — ejecuta "Precargar Prueba de Ingreso" desde adminprofe primero');
        console.log('\n⚠️  No se puede continuar sin la sesión. Abortando.\n');
        process.exit(1);
    }
    ok('Sesión prueba-ingreso existe');

    // Verify structure
    const textos = sesion.contenido?.textos || sesion.textos;
    const preguntas = sesion.contenido?.preguntas || sesion.preguntas;
    const textosArr = Array.isArray(textos) ? textos : Object.values(textos || {});
    const preguntasArr = Array.isArray(preguntas) ? preguntas : Object.values(preguntas || {});

    if (textosArr.length === 3) ok(`3 textos encontrados`);
    else fail('3 textos', `${textosArr.length} textos`);
    if (preguntasArr.length === 10) ok(`10 preguntas encontradas`);
    else fail('10 preguntas', `${preguntasArr.length} preguntas`);

    // 2. Pick a test student
    console.log('\n📋 2. Seleccionar estudiante de prueba');
    const estSnap = await db.ref(BASE + '/estudiantes').orderByChild('curso').equalTo('2A-HC').limitToFirst(1).once('value');
    const estData = estSnap.val();
    if (!estData) {
        fail('Estudiante de 2A-HC encontrado', 'No hay estudiantes en 2A-HC');
        process.exit(1);
    }
    const testUid = Object.keys(estData)[0];
    const testStudent = estData[testUid];
    ok(`Estudiante: ${testStudent.nombre} (${testStudent.curso}) — UID: ${testUid.substring(0,8)}...`);

    // 3. Simulate answering all 10 questions (all correct)
    console.log('\n📋 3. Simular respuestas (todas correctas)');
    const answers = {};
    const detail = {};
    let correct = 0;

    preguntasArr.forEach(q => {
        const qId = q.id;
        const givenAnswer = CORRECT_ANSWERS[qId];
        answers[qId] = givenAnswer;
        const isCorrect = givenAnswer === q.correcta;
        if (isCorrect) correct++;
        detail[qId] = {
            respuesta: givenAnswer,
            correcta: q.correcta,
            esCorrecta: isCorrect,
            habilidad: q.habilidad
        };
    });

    const total = preguntasArr.length;
    const porcentaje = Math.round((correct / total) * 100);
    const nota = porcentaje < 60
        ? Math.round((1.0 + (porcentaje / 60) * 3.0) * 10) / 10
        : Math.round((4.0 + ((porcentaje - 60) / 40) * 3.0) * 10) / 10;

    console.log(`     Respuestas: ${correct}/${total} correctas (${porcentaje}%) — Nota: ${nota}`);
    ok(`10/10 respuestas generadas`);

    // 4. Write respuestas (like autoSave + submit does)
    console.log('\n📋 4. Guardar respuestas en Firebase');
    const now = Date.now();
    const tiempoMin = 12; // simulate 12 min

    const respuestasData = {
        answers: answers,
        notes: {},
        highlights: {},
        completada: true,
        submitted_at: now,
        tiempo_transcurrido: tiempoMin * 60,
        test_run: true  // flag to identify test data
    };

    try {
        await db.ref(BASE + '/respuestas/' + SESSION_ID + '/' + testUid).set(respuestasData);
        ok('respuestas/' + SESSION_ID + '/' + testUid.substring(0,8) + '... guardado');
    } catch(e) {
        fail('Guardar respuestas', e.message);
    }

    // 5. Write resultados (like submitSession does)
    console.log('\n📋 5. Guardar resultados en Firebase');
    const resultData = {
        puntaje: correct,
        total: total,
        porcentaje: porcentaje,
        nota: nota,
        es_encuesta: false,
        detalle: detail,
        notas: {},
        notas_completadas: '0/0',
        nombre: testStudent.nombre,
        curso: testStudent.curso,
        submitted_at: now,
        tiempo_min: tiempoMin,
        suspicious_flags: null,
        test_run: true
    };

    try {
        await db.ref(BASE + '/resultados/' + SESSION_ID + '/' + testUid).set(resultData);
        ok('resultados/' + SESSION_ID + '/' + testUid.substring(0,8) + '... guardado');
    } catch(e) {
        fail('Guardar resultados', e.message);
    }

    // 6. Write ranking
    console.log('\n📋 6. Guardar ranking en Firebase');
    try {
        await db.ref(BASE + '/ranking/' + SESSION_ID + '/' + testStudent.curso + '/' + testUid).set({
            nombre: testStudent.nombre,
            puntaje: correct,
            porcentaje: porcentaje,
            tiempo: tiempoMin * 60
        });
        ok('ranking/' + SESSION_ID + '/' + testStudent.curso + '/' + testUid.substring(0,8) + '... guardado');
    } catch(e) {
        fail('Guardar ranking', e.message);
    }

    // ======= VERIFICACIÓN: Leer y validar todo lo escrito =======
    console.log('\n📋 7. VERIFICACIÓN — Leer datos guardados');

    // 7a. Verify respuestas
    const respSnap = await db.ref(BASE + '/respuestas/' + SESSION_ID + '/' + testUid).once('value');
    const respVal = respSnap.val();
    if (respVal && respVal.completada === true) ok('Respuestas marcadas como completadas');
    else fail('Respuestas completadas', JSON.stringify(respVal?.completada));

    if (respVal && respVal.answers && Object.keys(respVal.answers).length === 10)
        ok('10 respuestas almacenadas en /respuestas');
    else fail('10 respuestas en /respuestas', `${Object.keys(respVal?.answers || {}).length} encontradas`);

    // 7b. Verify resultados
    const resSnap = await db.ref(BASE + '/resultados/' + SESSION_ID + '/' + testUid).once('value');
    const resVal = resSnap.val();
    if (resVal && resVal.puntaje === correct) ok(`Puntaje correcto: ${resVal.puntaje}/${resVal.total}`);
    else fail('Puntaje en resultados', JSON.stringify(resVal?.puntaje));

    if (resVal && resVal.porcentaje === porcentaje) ok(`Porcentaje correcto: ${resVal.porcentaje}%`);
    else fail('Porcentaje en resultados', JSON.stringify(resVal?.porcentaje));

    if (resVal && resVal.nota === nota) ok(`Nota correcta: ${resVal.nota}`);
    else fail('Nota en resultados', JSON.stringify(resVal?.nota));

    if (resVal && resVal.nombre === testStudent.nombre) ok(`Nombre correcto: ${resVal.nombre}`);
    else fail('Nombre en resultados', JSON.stringify(resVal?.nombre));

    if (resVal && resVal.curso === testStudent.curso) ok(`Curso correcto: ${resVal.curso}`);
    else fail('Curso en resultados', JSON.stringify(resVal?.curso));

    if (resVal && resVal.detalle) {
        const detalleKeys = Object.keys(resVal.detalle);
        if (detalleKeys.length === 10) ok('Detalle tiene 10 preguntas');
        else fail('Detalle preguntas', `${detalleKeys.length} en vez de 10`);

        // Verify each question has habilidad and esCorrecta
        let detalleOk = true;
        detalleKeys.forEach(k => {
            const d = resVal.detalle[k];
            if (!d.habilidad || d.esCorrecta === undefined) detalleOk = false;
        });
        if (detalleOk) ok('Detalle incluye habilidad y esCorrecta en cada pregunta');
        else fail('Detalle campos', 'Faltan habilidad o esCorrecta');
    } else fail('Detalle existe', 'No encontrado');

    // 7c. Verify ranking
    const rankSnap = await db.ref(BASE + '/ranking/' + SESSION_ID + '/' + testStudent.curso + '/' + testUid).once('value');
    const rankVal = rankSnap.val();
    if (rankVal && rankVal.nombre === testStudent.nombre && rankVal.puntaje === correct)
        ok(`Ranking: ${rankVal.nombre} — ${rankVal.puntaje} pts — ${rankVal.porcentaje}%`);
    else fail('Ranking', JSON.stringify(rankVal));

    // 7d. Verify habilidades distribution in detalle
    console.log('\n📋 8. Distribución de habilidades');
    if (resVal && resVal.detalle) {
        const hab = {};
        Object.values(resVal.detalle).forEach(d => {
            hab[d.habilidad] = (hab[d.habilidad] || 0) + 1;
        });
        for (const [h, c] of Object.entries(hab).sort()) {
            console.log(`     ${h}: ${c} pregunta(s)`);
        }
        if (hab.LOCALIZAR && hab.INTERPRETAR && hab.REFLEXIONAR) ok('Las 3 habilidades SIMCE están presentes');
        else fail('Habilidades SIMCE', `Solo: ${Object.keys(hab).join(', ')}`);
    }

    // 7e. Check that admin panel can read this data
    console.log('\n📋 9. Simulación de lectura desde admin');
    const allResults = await db.ref(BASE + '/resultados/' + SESSION_ID).once('value');
    const allRes = allResults.val();
    if (allRes) {
        const count = Object.keys(allRes).length;
        ok(`Admin puede leer ${count} resultado(s) de prueba-ingreso`);
        // Show all submitted students
        for (const [uid, r] of Object.entries(allRes)) {
            console.log(`     → ${r.nombre} (${r.curso}): ${r.puntaje}/${r.total} = ${r.porcentaje}% — Nota ${r.nota}`);
        }
    } else fail('Admin lectura resultados', 'Nodo vacío');

    // ======= CLEANUP: Remove test data =======
    console.log('\n📋 10. Limpieza de datos de prueba');
    try {
        await db.ref(BASE + '/respuestas/' + SESSION_ID + '/' + testUid).remove();
        await db.ref(BASE + '/resultados/' + SESSION_ID + '/' + testUid).remove();
        await db.ref(BASE + '/ranking/' + SESSION_ID + '/' + testStudent.curso + '/' + testUid).remove();
        ok('Datos de prueba eliminados correctamente');
    } catch(e) {
        fail('Limpieza', e.message);
    }

    // ======= Summary =======
    console.log(`\n${'═'.repeat(50)}`);
    console.log(`  ✅ Passed: ${passed}`);
    console.log(`  ❌ Failed: ${failed}`);
    console.log(`  📊 Resultado final: ${failed === 0 ? '¡TODO OK! El flujo completo funciona.' : 'HAY ERRORES — revisar arriba.'}`);
    console.log(`${'═'.repeat(50)}\n`);

    process.exit(failed > 0 ? 1 : 0);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
