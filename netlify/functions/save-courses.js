import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const body = await req.json();
    
    const { courses, username = 'profesor' } = body;
    
    if (!courses || !Array.isArray(courses)) {
      return new Response(JSON.stringify({ 
        error: 'Datos inválidos. Se esperaba un array de cursos.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Obtener el user_id
    const [user] = await sql`
      SELECT id FROM users WHERE username = ${username}
    `;
    
    if (!user) {
      // Crear el usuario si no existe
      const [newUser] = await sql`
        INSERT INTO users (username)
        VALUES (${username})
        RETURNING id
      `;
      user.id = newUser.id;
    }
    
    // Guardar o actualizar cada curso
    const savedCourses = [];
    
    for (const course of courses) {
      // Verificar si el curso ya existe
      const [existing] = await sql`
        SELECT id FROM courses 
        WHERE id = ${course.id} AND user_id = ${user.id}
      `;
      
      if (existing) {
        // Actualizar curso existente
        const [updated] = await sql`
          UPDATE courses 
          SET 
            course_name = ${course.courseName},
            subject = ${course.subject},
            period = ${course.period},
            config = ${JSON.stringify(course.config)}::jsonb,
            students = ${JSON.stringify(course.students)}::jsonb,
            tasks = ${JSON.stringify(course.tasks)}::jsonb,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${course.id} AND user_id = ${user.id}
          RETURNING id, course_name, subject, period
        `;
        savedCourses.push(updated);
      } else {
        // Insertar nuevo curso
        const [inserted] = await sql`
          INSERT INTO courses (
            id,
            user_id,
            course_name,
            subject,
            period,
            config,
            students,
            tasks
          ) VALUES (
            ${course.id},
            ${user.id},
            ${course.courseName},
            ${course.subject},
            ${course.period},
            ${JSON.stringify(course.config)}::jsonb,
            ${JSON.stringify(course.students)}::jsonb,
            ${JSON.stringify(course.tasks)}::jsonb
          )
          RETURNING id, course_name, subject, period
        `;
        savedCourses.push(inserted);
      }
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      message: `${savedCourses.length} curso(s) sincronizado(s)`,
      courses: savedCourses
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error en save-courses:', error);
    return new Response(JSON.stringify({ 
      error: 'Error al guardar cursos',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/courses/save"
};
