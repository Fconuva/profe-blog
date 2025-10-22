const fs = require('fs');
const admin = require('firebase-admin');

// Leer credenciales desde service-account.json
console.log('🔧 Inicializando Firebase...');
const serviceAccount = JSON.parse(fs.readFileSync('service-account.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://profe-blog-default-rtdb.firebaseio.com'
});

const db = admin.database();
console.log('✅ Firebase inicializado\n');

async function uploadCourses() {
  console.log('🚀 Iniciando carga de cursos...\n');
  
  // Leer CSV completo
  const csvContent = fs.readFileSync('Datos/courses.csv', 'utf8');
  const lines = csvContent.split('\n');
  
  const courses = [];
  
  // Función para parsear una línea CSV con campos complejos
  function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"' && !inQuotes) {
        inQuotes = true;
      } else if (char === '"' && inQuotes && nextChar === '"') {
        current += '"';
        i++; // skip next quote
      } else if (char === '"' && inQuotes) {
        inQuotes = false;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);
    return values;
  }
  
  // Procesar cada línea (saltar header)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    try {
      const values = parseCSVLine(line);
      
      if (values.length < 10) {
        console.warn(`⚠️  Línea ${i+1} omitida: solo ${values.length} campos`);
        continue;
      }
      
      const id = parseInt(values[0]);
      const user_id = parseInt(values[1]);
      const courseName = values[2];
      const subject = values[3];
      const period = values[4];
      const config = JSON.parse(values[5]);
      const students = JSON.parse(values[6]);
      const tasks = JSON.parse(values[7]);
      const created_at = values[8];
      const updated_at = values[9];
      
      courses.push({
        id,
        userId: user_id,
        courseName,
        subject,
        period,
        config,
        students,
        tasks,
        createdAt: created_at,
        updatedAt: updated_at
      });
    } catch (error) {
      console.error(`❌ Error en línea ${i+1}: ${error.message}`);
    }
  }
  
  console.log(`📦 ${courses.length} cursos parseados\n`);
  
  // Buscar usuario
  console.log('👤 Buscando usuario francisco_fconuva...');
  const usersRef = db.ref('users');
  const userSnapshot = await usersRef.orderByChild('username').equalTo('francisco_fconuva').once('value');
  
  let firebaseUserId;
  if (userSnapshot.exists()) {
    firebaseUserId = Object.keys(userSnapshot.val())[0];
    console.log(`✅ Usuario encontrado: ${firebaseUserId}\n`);
  } else {
    console.log('🆕 Creando usuario...');
    const newUserRef = usersRef.push();
    firebaseUserId = newUserRef.key;
    await newUserRef.set({
      username: 'francisco_fconuva',
      email: 'fconuva@example.com',
      createdAt: new Date().toISOString()
    });
    console.log(`✅ Usuario creado: ${firebaseUserId}\n`);
  }
  
  // Subir cursos
  console.log('📤 Subiendo cursos a Firebase...\n');
  const coursesRef = db.ref('courses');
  
  let created = 0, updated = 0, skipped = 0;
  
  for (const course of courses) {
    // Saltar cursos vacíos
    if (course.students.length === 0 && course.tasks.length === 0) {
      console.log(`⏭️  Omitido: "${course.courseName}" (vacío)`);
      skipped++;
      continue;
    }
    
    const courseData = { ...course, userId: firebaseUserId };
    
    // Verificar si existe
    const existingSnapshot = await coursesRef.orderByChild('id').equalTo(course.id).once('value');
    
    if (existingSnapshot.exists()) {
      const courseKey = Object.keys(existingSnapshot.val())[0];
      await coursesRef.child(courseKey).update(courseData);
      console.log(`🔄 "${course.courseName}" - ${course.students.length} estudiantes, ${course.tasks.length} tareas`);
      updated++;
    } else {
      await coursesRef.push().set(courseData);
      console.log(`✨ "${course.courseName}" - ${course.students.length} estudiantes, ${course.tasks.length} tareas`);
      created++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 ¡COMPLETADO!');
  console.log(`✅ Creados: ${created}`);
  console.log(`🔄 Actualizados: ${updated}`);
  console.log(`⏭️  Omitidos: ${skipped}`);
  console.log('='.repeat(60));
  
  process.exit(0);
}

uploadCourses().catch(error => {
  console.error('\n💥 ERROR:', error.message);
  console.error(error.stack);
  process.exit(1);
});
