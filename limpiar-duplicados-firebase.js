const admin = require('firebase-admin');
const fs = require('fs');

// Inicializar Firebase
const serviceAccount = JSON.parse(fs.readFileSync('service-account.json', 'utf8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://profe-blog-default-rtdb.firebaseio.com'
});

const db = admin.database();

async function cleanDuplicates() {
    console.log('🔍 Buscando cursos duplicados...\n');
    
    try {
        // Obtener todos los cursos del usuario francisco_fconuva
        const usersRef = db.ref('users');
        const usersSnapshot = await usersRef.once('value');
        const users = usersSnapshot.val();
        
        let franciscoUserId = null;
        for (const [uid, user] of Object.entries(users)) {
            if (user.username === 'francisco_fconuva') {
                franciscoUserId = uid;
                break;
            }
        }
        
        if (!franciscoUserId) {
            console.error('❌ Usuario francisco_fconuva no encontrado');
            return;
        }
        
        console.log('✅ Usuario encontrado:', franciscoUserId);
        
        // Obtener todos los cursos
        const coursesRef = db.ref('courses');
        const coursesSnapshot = await coursesRef.orderByChild('userId').equalTo(franciscoUserId).once('value');
        const courses = coursesSnapshot.val();
        
        if (!courses) {
            console.log('No hay cursos para limpiar');
            return;
        }
        
        const coursesArray = Object.entries(courses).map(([id, course]) => ({
            firebaseId: id,
            ...course
        }));
        
        console.log(`📦 Total de cursos encontrados: ${coursesArray.length}\n`);
        
        // Agrupar por nombre de curso
        const grouped = {};
        coursesArray.forEach(course => {
            const key = course.courseName || 'Sin nombre';
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(course);
        });
        
        // Encontrar duplicados y mantener solo el más reciente
        let deletedCount = 0;
        let keptCount = 0;
        
        for (const [courseName, duplicates] of Object.entries(grouped)) {
            if (duplicates.length > 1) {
                console.log(`\n🔴 DUPLICADOS ENCONTRADOS: "${courseName}"`);
                console.log(`   Cantidad: ${duplicates.length} copias`);
                
                // Ordenar por updatedAt (más reciente primero)
                duplicates.sort((a, b) => {
                    const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
                    const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
                    return timeB - timeA;
                });
                
                // Mantener el primero (más reciente)
                const toKeep = duplicates[0];
                const toDelete = duplicates.slice(1);
                
                console.log(`   ✅ MANTENER: ${toKeep.firebaseId} (actualizado: ${toKeep.updatedAt || toKeep.createdAt})`);
                console.log(`      - ${toKeep.students?.length || 0} estudiantes`);
                console.log(`      - ${toKeep.tasks?.length || 0} tareas`);
                
                keptCount++;
                
                // Eliminar los demás
                for (const course of toDelete) {
                    console.log(`   🗑️  ELIMINAR: ${course.firebaseId} (actualizado: ${course.updatedAt || course.createdAt})`);
                    console.log(`      - ${course.students?.length || 0} estudiantes`);
                    console.log(`      - ${course.tasks?.length || 0} tareas`);
                    
                    await coursesRef.child(course.firebaseId).remove();
                    deletedCount++;
                }
            } else {
                console.log(`\n✅ Curso único: "${courseName}"`);
                keptCount++;
            }
        }
        
        console.log(`\n\n📊 RESUMEN:`);
        console.log(`✅ Cursos mantenidos: ${keptCount}`);
        console.log(`🗑️  Cursos eliminados: ${deletedCount}`);
        console.log(`\n✨ ¡Limpieza completada!`);
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        process.exit(0);
    }
}

cleanDuplicates();
