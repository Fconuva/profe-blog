const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const admin = read('estudiantes/adminprofe/index.html');
const api = read('api/estudiantes.js');
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

console.log('Alta individual y masiva auditadas: API autenticada, recuperación de cuentas existentes y perfil canónico verificados.');
