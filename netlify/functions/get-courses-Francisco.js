const { neon } = require('@neondatabase/serverless');
exports.handler = async (event) => {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' };
  if (event.httpMethod !== 'GET') { return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }; }
  try {
    const sql = neon(process.env.DATABASE_URL);
    const url = new URL(`http://localhost${event.rawPath}?${event.rawQueryString || ''}`);
    const username = url.searchParams.get('username') || 'fconuva';
    let [user] = await sql`SELECT id FROM users WHERE username = ${username}`;
    if (!user) { [user] = await sql`INSERT INTO users (username) VALUES (${username}) RETURNING id`; }
    const courses = await sql`SELECT id, course_name, subject, period, config, students, tasks FROM courses WHERE user_id = ${user.id} ORDER BY updated_at DESC`;
    const formatted = courses.map(c => ({ id: Number(c.id), courseName: c.course_name, subject: c.subject, period: c.period, config: c.config, students: c.students, tasks: c.tasks }));
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, courses: formatted }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message, courses: [] }) };
  }
};
