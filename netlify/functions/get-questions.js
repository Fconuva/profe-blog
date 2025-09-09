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
    const difficulty = event.queryStringParameters?.difficulty;
    const category = event.queryStringParameters?.category;
    const limit = parseInt(event.queryStringParameters?.limit) || 10;

    let questionsQuery = sql`
      SELECT
        id,
        tool_name,
        question_text,
        question_type,
        difficulty_level,
        category,
        created_at
      FROM questions
      ORDER BY RANDOM()
      LIMIT ${limit}
    `;

    // Aplicar filtros si se especifican
    if (toolName || difficulty || category) {
      let whereConditions = [];
      let params = [];

      if (toolName) {
        whereConditions.push('tool_name = $' + (params.length + 1));
        params.push(toolName);
      }

      if (difficulty) {
        whereConditions.push('difficulty_level = $' + (params.length + 1));
        params.push(difficulty);
      }

      if (category) {
        whereConditions.push('category = $' + (params.length + 1));
        params.push(category);
      }

      const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

      questionsQuery = sql`
        SELECT
          id,
          tool_name,
          question_text,
          question_type,
          difficulty_level,
          category,
          created_at
        FROM questions
        ${sql.unsafe(whereClause)}
        ORDER BY RANDOM()
        LIMIT ${limit}
      `;
    }

    const questions = await questionsQuery;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        data: questions,
        count: questions.length
      })
    };

  } catch (error) {
    console.error('Error fetching questions:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        success: false,
        error: 'Error al obtener las preguntas',
        details: error.message
      })
    };
  }
};
