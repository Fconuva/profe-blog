import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  // Solo permitir DELETE
  if (req.method !== 'DELETE') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const body = await req.json();
    
    const { courseId } = body;
    
    if (!courseId) {
      return new Response(JSON.stringify({ 
        error: 'Se requiere courseId' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // MODO COLABORATIVO: Usar siempre 'fconuva' como usuario compartido
    const sharedUsername = 'fconuva';
    
    // Obtener el user_id del usuario compartido
    let [user] = await sql`
      SELECT id FROM users WHERE username = ${sharedUsername}
    `;
    
    if (!user) {
      // Si no existe, crearlo
      [user] = await sql`
        INSERT INTO users (username)
        VALUES (${sharedUsername})
        RETURNING id
      `;
    }
    
    // Log para debug
    console.log('Intentando eliminar curso:', { courseId, userId: user.id, username });
    
    // Primero buscar el curso para ver si existe
    const existing = await sql`
      SELECT id, course_name FROM courses 
      WHERE user_id = ${user.id}
    `;
    console.log('Cursos existentes:', existing);
    
    // Eliminar el curso (intentar con diferentes tipos de ID)
    let result;
    try {
      result = await sql`
        DELETE FROM courses 
        WHERE id = ${courseId}::bigint AND user_id = ${user.id}
        RETURNING id, course_name
      `;
    } catch (e) {
      console.error('Error con bigint, intentando con int:', e);
      result = await sql`
        DELETE FROM courses 
        WHERE id = ${parseInt(courseId)} AND user_id = ${user.id}
        RETURNING id, course_name
      `;
    }
    
    console.log('Resultado de eliminación:', result);
    
    if (result.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'Curso no encontrado',
        courseId: courseId,
        userId: user.id,
        existingCourses: existing.map(c => ({ id: c.id, name: c.course_name }))
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Curso eliminado correctamente'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error en delete-course:', error);
    return new Response(JSON.stringify({ 
      error: 'Error al eliminar curso',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/courses/delete"
};
