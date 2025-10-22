const { neon } = require('@neondatabase/serverless');
exports.handler = async (event) => {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
  if (event.httpMethod !== 'DELETE') { return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }; }
  try {
    const data = JSON.parse(event.body);
    const { email } = data;
    if (!email) { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email required' }) }; }
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`DELETE FROM paseo_docentes_reservas WHERE email = ${email} RETURNING id`;
    if (result.length === 0) { return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) }; }
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
