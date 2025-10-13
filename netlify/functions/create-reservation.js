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
    const { nombre, apellido, email, telefono, asistira, transporte, asiento } = data;

    // Validar campos requeridos
    if (!nombre || !apellido || !email || !telefono || !asistira) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Faltan campos requeridos'
      }), {
        status: 400,
        headers
      });
    }

    // Conectar a la base de datos
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // Verificar si el asiento ya está ocupado (si se seleccionó uno)
    if (asiento && transporte === 'bus') {
      const existingSeat = await sql`
        SELECT id FROM paseo_docentes_reservas 
        WHERE asiento = ${asiento} AND transporte = 'bus'
        LIMIT 1
      `;

      if (existingSeat.length > 0) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Este asiento ya está ocupado'
        }), {
          status: 409,
          headers
        });
      }
    }

    // Insertar la reserva
    const result = await sql`
      INSERT INTO paseo_docentes_reservas 
      (nombre, apellido, email, telefono, asistira, transporte, asiento, created_at)
      VALUES (
        ${nombre}, 
        ${apellido}, 
        ${email}, 
        ${telefono}, 
        ${asistira}, 
        ${transporte || null}, 
        ${asiento || null},
        NOW()
      )
      RETURNING id, nombre, apellido, asiento
    `;

    return new Response(JSON.stringify({
      success: true,
      reservation: result[0]
    }), {
      status: 201,
      headers
    });

  } catch (error) {
    console.error('Error creating reservation:', error);
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
  path: "/api/create-reservation"
};
