const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const cursos = [
    {
        id: 1760538035941,
        courseName: "3° Medio E - TP",
        subject: "Lenguaje y Comunicación",
        period: "2025",
        students: [],
        tasks: [],
        config: {
            minGrade: 1.0,
            maxGrade: 7.0,
            passingGrade: 4.0,
            passingPercentage: 60
        }
    },
    {
        id: 1760538421357,
        courseName: "3° Medio C - TP",
        subject: "Lenguaje y Comunicación",
        period: "2025",
        students: [],
        tasks: [],
        config: {
            minGrade: 1.0,
            maxGrade: 7.0,
            passingGrade: 4.0,
            passingPercentage: 60
        }
    },
    {
        id: 1760626934664,
        courseName: "4° Medio B - HC",
        subject: "Lenguaje y Comunicación",
        period: "2025",
        students: [],
        tasks: [],
        config: {
            minGrade: 1.0,
            maxGrade: 7.0,
            passingGrade: 4.0,
            passingPercentage: 60
        }
    },
    {
        id: 1760715434895,
        courseName: "3° Medio A - TP",
        subject: "Lenguaje y Comunicación",
        period: "2025",
        students: [],
        tasks: [],
        config: {
            minGrade: 1.0,
            maxGrade: 7.0,
            passingGrade: 4.0,
            passingPercentage: 60
        }
    },
    {
        id: 1760715443441,
        courseName: "3° Medio B - TP",
        subject: "Lenguaje y Comunicación",
        period: "2025",
        students: [],
        tasks: [],
        config: {
            minGrade: 1.0,
            maxGrade: 7.0,
            passingGrade: 4.0,
            passingPercentage: 60
        }
    }
];

async function cargarCursos() {
    try {
        console.log('🔌 Conectando a Neon Database...');
        const sql = neon(process.env.DATABASE_URL);
        
        // Obtener o crear usuario Francisco
        const username = 'francisco_fconuva';
        console.log(`👤 Buscando usuario: ${username}`);
        
        let [user] = await sql`SELECT id FROM users WHERE username = ${username}`;
        
        if (!user) {
            console.log('➕ Creando usuario...');
            [user] = await sql`INSERT INTO users (username) VALUES (${username}) RETURNING id`;
            console.log(`✅ Usuario creado con ID: ${user.id}`);
        } else {
            console.log(`✅ Usuario encontrado con ID: ${user.id}`);
        }
        
        // Verificar cursos existentes
        console.log('\n📊 Verificando cursos existentes...');
        const existingCourses = await sql`
            SELECT id, course_name 
            FROM courses 
            WHERE user_id = ${user.id}
        `;
        
        console.log(`Cursos existentes: ${existingCourses.length}`);
        existingCourses.forEach(c => {
            console.log(`  - ID: ${c.id}, Nombre: ${c.course_name}`);
        });
        
        // Cargar cada curso
        console.log('\n📚 Cargando nuevos cursos...');
        let insertados = 0;
        let actualizados = 0;
        let omitidos = 0;
        
        for (const curso of cursos) {
            const existing = existingCourses.find(c => c.id == curso.id);
            
            if (existing) {
                console.log(`⚠️  Curso ${curso.id} (${curso.courseName}) ya existe - Actualizando...`);
                
                await sql`
                    UPDATE courses 
                    SET course_name = ${curso.courseName},
                        subject = ${curso.subject},
                        period = ${curso.period},
                        config = ${JSON.stringify(curso.config)},
                        students = ${JSON.stringify(curso.students)},
                        tasks = ${JSON.stringify(curso.tasks)},
                        updated_at = NOW()
                    WHERE id = ${curso.id} AND user_id = ${user.id}
                `;
                
                actualizados++;
            } else {
                console.log(`➕ Insertando curso ${curso.id}: ${curso.courseName}`);
                
                await sql`
                    INSERT INTO courses (
                        id,
                        user_id,
                        course_name,
                        subject,
                        period,
                        config,
                        students,
                        tasks,
                        created_at,
                        updated_at
                    ) VALUES (
                        ${curso.id},
                        ${user.id},
                        ${curso.courseName},
                        ${curso.subject},
                        ${curso.period},
                        ${JSON.stringify(curso.config)},
                        ${JSON.stringify(curso.students)},
                        ${JSON.stringify(curso.tasks)},
                        NOW(),
                        NOW()
                    )
                `;
                
                insertados++;
            }
        }
        
        console.log('\n✅ PROCESO COMPLETADO');
        console.log(`   ➕ Insertados: ${insertados}`);
        console.log(`   🔄 Actualizados: ${actualizados}`);
        console.log(`   ⏭️  Omitidos: ${omitidos}`);
        
        // Verificar resultado final
        console.log('\n📋 Verificando cursos finales...');
        const finalCourses = await sql`
            SELECT id, course_name, subject, period 
            FROM courses 
            WHERE user_id = ${user.id}
            ORDER BY course_name
        `;
        
        console.log(`\n📚 Total de cursos para ${username}: ${finalCourses.length}`);
        finalCourses.forEach(c => {
            console.log(`  ✓ ${c.course_name} (${c.subject}) - ${c.period} [ID: ${c.id}]`);
        });
        
    } catch (error) {
        console.error('❌ ERROR:', error);
        console.error('Detalles:', error.message);
        process.exit(1);
    }
}

// Ejecutar
cargarCursos().then(() => {
    console.log('\n🎉 Script completado exitosamente');
    process.exit(0);
});