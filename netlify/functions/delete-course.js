const { neon } = require('@neondatabase/serverless');
exports.handler = async (event) => {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
  if (event.httpMethod !== 'DELETE') { return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }; }
  try {
    const sql = neon(process.env.DATABASE_URL);
    const body = JSON.parse(event.body);
    const { courseId, username } = body;
    if (!courseId) { return { statusCode: 400, headers, body: JSON.stringify({ error: 'courseId required' }) }; }
    const effUsername = username || 'fconuva';
    let [user] = await sql`SELECT id FROM users WHERE username = ${effUsername}`;
    if (!user) { [user] = await sql`INSERT INTO users (username) VALUES (${effUsername}) RETURNING id`; }
    let result;
    try { result = await sql`DELETE FROM courses WHERE id = ${courseId}::bigint AND user_id = ${user.id} RETURNING id`; } catch (e) { result = await sql`DELETE FROM courses WHERE id = ${parseInt(courseId)} AND user_id = ${user.id} RETURNING id`; }
    if (result.length === 0) { return { statusCode: 404, headers, body: JSON.stringify({ error: 'Course not found' }) }; }
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
