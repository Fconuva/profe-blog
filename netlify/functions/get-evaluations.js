const { neon } = require('@neon/serverless');

exports.handler = async (event, context) => {
  // Permitir GET y OPTIONS
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'OPTIONS') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Manejar preflight OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Obtener parámetros de consulta
    const toolName = event.queryStringParameters?.toolName;
    const limit = parseInt(event.queryStringParameters?.limit) || 50;
    const offset = parseInt(event.queryStringParameters?.offset) || 0;

    let evaluationsQuery = sql`
      SELECT
        id,
        student_name,
        student_course,
        evaluation_type,
        tool_name,
        final_score,
        total_questions,
        correct_answers,
        evaluation_date,
        created_at
      FROM evaluations
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Filtrar por herramienta si se especifica
    if (toolName) {
      evaluationsQuery = sql`
        SELECT
          id,
          student_name,
          student_course,
          evaluation_type,
          tool_name,
          final_score,
          total_questions,
          correct_answers,
          evaluation_date,
          created_at
        FROM evaluations
        WHERE tool_name = ${toolName}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    const evaluations = await evaluationsQuery;

    // Obtener estadísticas generales
    const stats = await sql`
      SELECT
        tool_name,
        total_evaluations,
        ROUND(average_score, 2) as average_score,
        last_updated
      FROM evaluation_stats
      ORDER BY last_updated DESC
    `;

    // Obtener estadísticas por tipo de evaluación
    const evaluationTypeStats = await sql`
      SELECT
        evaluation_type,
        COUNT(*) as count,
        ROUND(AVG(final_score), 2) as avg_score
      FROM evaluations
      GROUP BY evaluation_type
      ORDER BY count DESC
    `;

    // Obtener estadísticas por curso
    const courseStats = await sql`
      SELECT
        student_course,
        COUNT(*) as count,
        ROUND(AVG(final_score), 2) as avg_score
      FROM evaluations
      GROUP BY student_course
      ORDER BY count DESC
      LIMIT 10
    `;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        data: {
          evaluations: evaluations,
          stats: stats,
          evaluationTypeStats: evaluationTypeStats,
          courseStats: courseStats,
          pagination: {
            limit: limit,
            offset: offset,
            hasMore: evaluations.length === limit
          }
        }
      })
    };

  } catch (error) {
    console.error('Error fetching evaluations:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        success: false,
        error: 'Error al obtener las evaluaciones',
        details: error.message
      })
    };
  }
};
