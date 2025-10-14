import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  // Solo permitir GET
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    
    // Obtener username desde query params o usar 'profesor' por defecto
    const url = new URL(req.url);
    const username = url.searchParams.get('username') || 'profesor';
    
    // Primero obtener el user_id
    const [user] = await sql`
      SELECT id FROM users WHERE username = ${username}
    `;
    
    if (!user) {
      return new Response(JSON.stringify({ 
        error: 'Usuario no encontrado',
        courses: []
      }), {
        status: 404,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
    }
    
    // Obtener todos los cursos del usuario
    const courses = await sql`
      SELECT 
        id,
        course_name,
        subject,
        period,
        config,
        students,
        tasks,
        created_at,
        updated_at
      FROM courses 
      WHERE user_id = ${user.id}
      ORDER BY updated_at DESC
    `;
    
    // Transformar los datos al formato esperado por el frontend
    const formattedCourses = courses.map(course => ({
      id: Number(course.id),
      courseName: course.course_name,
      subject: course.subject,
      period: course.period,
      config: course.config,
      students: course.students,
      tasks: course.tasks
    }));
    
    return new Response(JSON.stringify({ 
      success: true,
      courses: formattedCourses 
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    console.error('Error en get-courses:', error);
    return new Response(JSON.stringify({ 
      error: 'Error al obtener cursos',
      details: error.message,
      courses: []
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/courses"
};
