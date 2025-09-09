const { neon } = require('@neon/serverless');

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

    // Crear tabla de evaluaciones
    await sql`
      CREATE TABLE IF NOT EXISTS evaluations (
        id SERIAL PRIMARY KEY,
        student_name VARCHAR(255) NOT NULL,
        student_course VARCHAR(100) NOT NULL,
        evaluation_type VARCHAR(50) NOT NULL,
        tool_name VARCHAR(100) NOT NULL,
        questions_data JSONB NOT NULL,
        final_score DECIMAL(5,2),
        total_questions INTEGER,
        correct_answers INTEGER,
        evaluation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Crear tabla de preguntas
    await sql`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        tool_name VARCHAR(100) NOT NULL,
        question_text TEXT NOT NULL,
        question_type VARCHAR(50) NOT NULL,
        difficulty_level VARCHAR(20) DEFAULT 'medium',
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Crear tabla de estadísticas
    await sql`
      CREATE TABLE IF NOT EXISTS evaluation_stats (
        id SERIAL PRIMARY KEY,
        tool_name VARCHAR(100) NOT NULL,
        total_evaluations INTEGER DEFAULT 0,
        average_score DECIMAL(5,2) DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(tool_name)
      )
    `;

    // Insertar algunas preguntas de ejemplo para Moby Dick
    const mobyDickQuestions = [
      {
        tool_name: 'moby_dick',
        question_text: '¿Cuál es el nombre del barco en el que viaja Ismael?',
        question_type: 'multiple_choice',
        difficulty_level: 'easy',
        category: 'personajes'
      },
      {
        tool_name: 'moby_dick',
        question_text: '¿Qué representa la ballena blanca en la novela?',
        question_type: 'open_ended',
        difficulty_level: 'hard',
        category: 'simbolismo'
      },
      {
        tool_name: 'moby_dick',
        question_text: '¿Cuál es la profesión del narrador?',
        question_type: 'multiple_choice',
        difficulty_level: 'easy',
        category: 'narrador'
      }
    ];

    // Insertar preguntas de ejemplo para La Metamorfosis
    const metamorphosisQuestions = [
      {
        tool_name: 'metamorphosis',
        question_text: '¿En qué se transforma Gregorio Samsa?',
        question_type: 'multiple_choice',
        difficulty_level: 'easy',
        category: 'transformacion'
      },
      {
        tool_name: 'metamorphosis',
        question_text: '¿Cuál es la reacción inicial de la familia ante la transformación?',
        question_type: 'open_ended',
        difficulty_level: 'medium',
        category: 'familia'
      },
      {
        tool_name: 'metamorphosis',
        question_text: '¿Qué simboliza la transformación de Gregorio?',
        question_type: 'open_ended',
        difficulty_level: 'hard',
        category: 'simbolismo'
      }
    ];

    // Insertar preguntas si no existen
    for (const question of [...mobyDickQuestions, ...metamorphosisQuestions]) {
      await sql`
        INSERT INTO questions (tool_name, question_text, question_type, difficulty_level, category)
        VALUES (${question.tool_name}, ${question.question_text}, ${question.question_type}, ${question.difficulty_level}, ${question.category})
        ON CONFLICT DO NOTHING
      `;
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        message: 'Base de datos inicializada correctamente'
      })
    };

  } catch (error) {
    console.error('Error initializing database:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        success: false,
        error: 'Error al inicializar la base de datos',
        details: error.message
      })
    };
  }
};
