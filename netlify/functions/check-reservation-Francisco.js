const { neon } = require('@neondatabase/serverless');
exports.handler = async (event) => {
  const headers = { 
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json' 
  };
  if (event.httpMethod === 'OPTIONS') { return { statusCode: 204, headers, body: '' }; }
  if (event.httpMethod !== 'POST') { return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }; }
  try {
    const data = JSON.parse(event.body);
    const { email } = data;
    if (!email) { return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Email required' }) }; }
    const sql = neon(process.env.DATABASE_URL);
    const reservation = await sql`SELECT id, nombre, apellido, email, telefono, asistira, transporte, asiento, created_at FROM paseo_docentes_reservas WHERE email = ${email} LIMIT 1`;
    if (reservation.length === 0) { return { statusCode: 404, headers, body: JSON.stringify({ success: false, error: 'Not found' }) }; }
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, reservation: reservation[0] }) };
  } catch (error) {
    console.error('Error checking reservation:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: error.message }) };
  }
};
