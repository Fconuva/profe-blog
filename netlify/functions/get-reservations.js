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

  try {
    // Conectar a la base de datos usando la variable de entorno de Netlify
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // Obtener todas las reservas de asientos
    const reservations = await sql`
      SELECT asiento, nombre, apellido 
      FROM paseo_docentes_reservas 
      WHERE transporte = 'bus' AND asiento IS NOT NULL
      ORDER BY asiento
    `;

    return new Response(JSON.stringify({
      success: true,
      reservations: reservations
    }), {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Error fetching reservations:', error);
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
  path: "/api/reservations"
};
