const { neon } = require('@neondatabase/serverless');
exports.handler = async (event) => {
  const headers = { 
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json' 
  };
  if (event.httpMethod === 'OPTIONS') { return { statusCode: 204, headers, body: '' }; }
  if (event.httpMethod !== 'GET') { return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }; }
  try {
    const sql = neon(process.env.DATABASE_URL);
    const reservations = await sql`SELECT id, nombre, apellido, email, telefono, asistira, transporte, asiento, created_at FROM paseo_docentes_reservas WHERE transporte = 'bus' AND asiento IS NOT NULL ORDER BY asiento ASC`;
    console.log('Reservations loaded:', reservations.length);
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, reservations }) };
  } catch (error) {
    console.error('Error loading reservations:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: error.message }) };
  }
};
