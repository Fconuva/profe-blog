import { neon } from '@neondatabase/serverless';

// Función para verificar si hay actualizaciones desde un timestamp dado
export default async (req, context) => {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const url = new URL(req.url);
    const username = url.searchParams.get('username');
    const lastSync = url.searchParams.get('lastSync'); // ISO timestamp
    
    if (!username) {
      return new Response(JSON.stringify({ error: 'Username requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Obtener el user_id
    const [user] = await sql`
      SELECT id FROM users WHERE username = ${username}
    `;
    
    if (!user) {
      return new Response(JSON.stringify({ 
        hasUpdates: false,
        message: 'Usuario no encontrado'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar si hay cursos actualizados después del lastSync
    let hasUpdates = false;
    let latestTimestamp = null;
    
    if (lastSync) {
      const results = await sql`
        SELECT MAX(updated_at) as latest
        FROM courses 
        WHERE user_id = ${user.id}
          AND updated_at > ${lastSync}
      `;
      
      if (results[0] && results[0].latest) {
        hasUpdates = true;
        latestTimestamp = results[0].latest;
      }
    } else {
      // Primera sincronización - siempre hay "actualizaciones"
      const results = await sql`
        SELECT MAX(updated_at) as latest
        FROM courses 
        WHERE user_id = ${user.id}
      `;
      
      if (results[0] && results[0].latest) {
        hasUpdates = true;
        latestTimestamp = results[0].latest;
      }
    }

    return new Response(JSON.stringify({ 
      hasUpdates,
      latestTimestamp,
      serverTime: new Date().toISOString()
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
    
  } catch (error) {
    console.error('Error en check-updates:', error);
    return new Response(JSON.stringify({ 
      error: 'Error al verificar actualizaciones',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/courses/check-updates"
};
