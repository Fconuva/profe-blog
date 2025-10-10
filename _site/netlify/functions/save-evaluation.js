const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const data = JSON.parse(event.body);

    // Validar datos requeridos
    const requiredFields = ['studentName', 'studentCourse', 'evaluationType', 'toolName', 'questionsData'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type'
          },
          body: JSON.stringify({
            success: false,
            error: `Campo requerido faltante: ${field}`
          })
        };
      }
    }

    // Calcular estadísticas
    const questionsData = data.questionsData;
    const totalQuestions = questionsData.length;
    const correctAnswers = questionsData.filter(q => q.isCorrect).length;
    const finalScore = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    // Insertar evaluación
    const result = await sql`
      INSERT INTO evaluations (
        student_name,
        student_course,
        evaluation_type,
        tool_name,
        questions_data,
        final_score,
        total_questions,
        correct_answers
      ) VALUES (
        ${data.studentName},
        ${data.studentCourse},
        ${data.evaluationType},
        ${data.toolName},
        ${JSON.stringify(questionsData)},
        ${finalScore},
        ${totalQuestions},
        ${correctAnswers}
      )
      RETURNING id, evaluation_date
    `;

    // Actualizar estadísticas
    await sql`
      INSERT INTO evaluation_stats (tool_name, total_evaluations, average_score, last_updated)
      VALUES (${data.toolName}, 1, ${finalScore}, CURRENT_TIMESTAMP)
      ON CONFLICT (tool_name) DO UPDATE SET
        total_evaluations = evaluation_stats.total_evaluations + 1,
        average_score = (
          (evaluation_stats.average_score * (evaluation_stats.total_evaluations - 1) + ${finalScore})
          / evaluation_stats.total_evaluations
        ),
        last_updated = CURRENT_TIMESTAMP
    `;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        message: 'Evaluación guardada correctamente',
        evaluationId: result[0].id,
        finalScore: finalScore,
        evaluationDate: result[0].evaluation_date
      })
    };

  } catch (error) {
    console.error('Error saving evaluation:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        success: false,
        error: 'Error al guardar la evaluación',
        details: error.message
      })
    };
  }
};
