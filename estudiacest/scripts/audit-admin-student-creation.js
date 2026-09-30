const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const admin = read('estudiantes/adminprofe/index.html');
const api = read('api/estudiantes.js');
const login = read('lecturas/index.html');
const profile = read('lecturas/perfil.html');
const legacyDashboard = read('lecturas/dashboard.html');
const vercel = JSON.parse(read('vercel.json'));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

expect(!admin.includes('createUserWithEmailAndPassword'), 'El admin todavía intenta crear cuentas directamente desde Firebase Auth.');
expect(!admin.includes('secondaryAuth'), 'El admin conserva la aplicación secundaria de autenticación ya innecesaria.');
expect(admin.includes("adminStudentRequest('create'"), 'El alta individual no usa la API administrativa.');
expect(admin.includes("adminStudentRequest('bulk-create'"), 'El alta masiva no usa la API administrativa.');
expect(admin.includes("'Authorization':'Bearer '+token"), 'Las altas no envían el token docente a la API.');
expect(api.includes("userRecord = await auth.getUserByEmail(email)"), 'La API no recupera una cuenta cuyo correo ya existe.');
expect(api.includes('const profile = await upsertStudentProfile(userRecord.uid, student, decoded)'), 'La API no reconstruye o actualiza el perfil canónico.');
expect(api.includes('programa: programFromCourse(student.curso)'), 'La API no conserva el programa académico al crear o recuperar el perfil.');

expect(admin.includes("firebase.initializeApp(FIREBASE_CONFIG,'estudiacest-admin')"), 'El panel administrativo no tiene un contenedor Firebase exclusivo.');
expect(admin.includes('const auth=adminFirebaseApp.auth()'), 'El panel no usa la sesión administrativa aislada.');
expect(admin.includes('const db=adminFirebaseApp.database()'), 'La base del panel no está vinculada a la aplicación administrativa aislada.');
expect(admin.includes("action=admin-session-token"), 'El panel no migra de forma segura la sesión administrativa heredada.');
expect(admin.includes('await legacyAuth.signOut().catch(()=>null)'), 'La sesión administrativa heredada queda activa y puede reabrir el panel después de salir.');
expect(admin.includes('class="login-screen" id="loginScreen"'), 'No se encontró la pantalla de acceso administrativo.');
expect(admin.includes('.login-screen{display:none;'), 'El formulario de acceso vuelve a aparecer antes de resolver la sesión guardada.');
expect(admin.includes('id="authBoot"'), 'Falta el estado de espera mientras se recupera la sesión administrativa.');
expect(admin.includes('showAuthRecovery('), 'Un error temporal todavía puede reemplazar una sesión activa por el formulario de acceso.');
expect(!admin.includes('firebase.auth().currentUser'), 'Una acción del panel todavía toma el token desde la sesión Firebase compartida.');
expect(api.includes("case 'admin-session-token': return await handleAdminSessionToken(req, res, decoded)"), 'La API no intercambia la sesión heredada después de verificar el permiso administrativo.');

expect(login.includes("return '/lecturas/perfil.html'"), 'El primer ingreso todavia apunta a una ruta de perfil inexistente.');
expect(!login.includes("return '/lecturas/perfil' +"), 'El login conserva la ruta corta que producia 404 al completar el perfil.');
expect(vercel.rewrites.some(rule => rule.source === '/lecturas/perfil' && rule.destination === '/lecturas/perfil.html'), 'La ruta antigua de perfil no tiene compatibilidad para estudiantes que ya quedaron en el 404.');
expect(profile.includes("const requestedNext = sanitizeAppPath(targetParams.get('next'))"), 'El perfil de primer ingreso no conserva el destino solicitado por el login.');
expect(profile.includes("return '/estudiantes/dashboard.html'"), 'El perfil no envia a los cursos SIMCE a su dashboard de clases.');
expect(legacyDashboard.includes("window.location.replace('/estudiantes/dashboard.html')"), 'El panel antiguo de Lecturas no redirige los cursos SIMCE al dashboard correcto.');
expect(legacyDashboard.includes('window.location.replace(personalRoute)'), 'El panel antiguo de Lecturas no respeta las rutas personales.');

const inlineScripts = [...admin.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
    .map(match => match[1])
    .filter(source => source.trim());
inlineScripts.forEach((source, index) => {
    try { new Function(source); } catch (error) { failures.push(`Script embebido ${index + 1} inválido: ${error.message}`); }
});

if (failures.length) {
    console.error('Auditoría de altas de estudiantes incumplida:\n- ' + failures.join('\n- '));
    process.exit(1);
}

console.log('Admin auditado: sesión aislada de estudiantes, migración autenticada, acceso sin parpadeo y altas canónicas verificados.');
