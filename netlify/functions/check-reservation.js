import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  // Permitir CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Manejar preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // Solo permitir POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({
      success: false,
      error: 'Method not allowed'
    }), {
      status: 405,
      headers
    });
  }

  try {
    // Parsear el body de la petición
    const data = await req.json();
    const { email } = data;

    if (!email) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Email es requerido'
      }), {
        status: 400,
        headers
      });
    }

    // Conectar a la base de datos
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // Buscar la reserva por email
    const reservation = await sql`
      SELECT id, nombre, apellido, email, telefono, asistira, transporte, asiento, created_at 
      FROM paseo_docentes_reservas 
      WHERE email = ${email}
      LIMIT 1
    `;

    if (reservation.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No se encontró ninguna reserva con este email'
      }), {
        status: 404,
        headers
      });
    }

    return new Response(JSON.stringify({
      success: true,
      reservation: reservation[0]
    }), {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Error checking reservation:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers
    });
  }
};

export const config = {
  path: "/api/check-reservation"
};
