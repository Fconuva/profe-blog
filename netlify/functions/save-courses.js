const { neon } = require('@neondatabase/serverless');
exports.handler = async (event) => {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
  if (event.httpMethod !== 'POST') { return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }; }
  try {
    const sql = neon(process.env.DATABASE_URL);
    const body = JSON.parse(event.body);
    const { courses, username } = body;
    if (!courses || !Array.isArray(courses)) { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid format' }) }; }
    const effUsername = username || 'fconuva';
    let [user] = await sql`SELECT id FROM users WHERE username = ${effUsername}`;
    if (!user) { [user] = await sql`INSERT INTO users (username) VALUES (${effUsername}) RETURNING id`; }
    const saved = [];
    for (const course of courses) {
      const [existing] = await sql`SELECT id FROM courses WHERE id = ${course.id} AND user_id = ${user.id}`;
      if (existing) { const [updated] = await sql`UPDATE courses SET course_name = ${course.courseName}, subject = ${course.subject}, period = ${course.period}, config = ${JSON.stringify(course.config)}::jsonb, students = ${JSON.stringify(course.students)}::jsonb, tasks = ${JSON.stringify(course.tasks)}::jsonb, updated_at = CURRENT_TIMESTAMP WHERE id = ${course.id} AND user_id = ${user.id} RETURNING id`; saved.push(updated); } else { const [inserted] = await sql`INSERT INTO courses (id, user_id, course_name, subject, period, config, students, tasks) VALUES (${course.id}, ${user.id}, ${course.courseName}, ${course.subject}, ${course.period}, ${JSON.stringify(course.config)}::jsonb, ${JSON.stringify(course.students)}::jsonb, ${JSON.stringify(course.tasks)}::jsonb) RETURNING id`; saved.push(inserted); }
    }
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, saved }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
