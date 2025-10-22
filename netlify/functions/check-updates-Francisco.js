const { neon } = require('@neondatabase/serverless');
exports.handler = async (event) => {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' };
  if (event.httpMethod !== 'GET') { return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }; }
  try {
    const sql = neon(process.env.DATABASE_URL);
    const url = new URL(`http://localhost${event.rawPath}?${event.rawQueryString || ''}`);
    const username = url.searchParams.get('username');
    const lastSync = url.searchParams.get('lastSync');
    if (!username) { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Username required' }) }; }
    const [user] = await sql`SELECT id FROM users WHERE username = ${username}`;
    if (!user) { return { statusCode: 200, headers, body: JSON.stringify({ hasUpdates: false }) }; }
    let hasUpdates = false;
    if (lastSync) { const results = await sql`SELECT MAX(updated_at) as latest FROM courses WHERE user_id = ${user.id} AND updated_at > ${lastSync}`; if (results[0] && results[0].latest) { hasUpdates = true; } }
    return { statusCode: 200, headers, body: JSON.stringify({ hasUpdates, serverTime: new Date().toISOString() }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
