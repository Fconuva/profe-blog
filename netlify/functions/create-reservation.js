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
    const { nombre, apellido, email, telefono, asistira, transporte, asiento } = data;
    console.log('Creating reservation for:', email, 'seat:', asiento);
    const sql = neon(process.env.DATABASE_URL);
    const existing = await sql`SELECT id FROM paseo_docentes_reservas WHERE email = ${email}`;
    if (existing.length > 0) { 
      console.log('Email already registered:', email);
      return { statusCode: 409, headers, body: JSON.stringify({ success: false, error: 'Email already registered' }) }; 
    }
    const result = await sql`INSERT INTO paseo_docentes_reservas (nombre, apellido, email, telefono, asistira, transporte, asiento) VALUES (${nombre}, ${apellido}, ${email}, ${telefono}, ${asistira}, ${transporte}, ${asiento}) RETURNING id, nombre, apellido, email, telefono, asistira, transporte, asiento, created_at`;
    console.log('Reservation created successfully:', result[0].id);
    return { statusCode: 201, headers, body: JSON.stringify({ success: true, reservation: result[0] }) };
  } catch (error) {
    console.error('Error creating reservation:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: error.message }) };
  }
};
