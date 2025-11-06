// API endpoint para consultas IA con Groq
// Configurar GROQ_API_KEY en Vercel Environment Variables

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return res.status(500).json({ 
      error: 'API key no configurada en servidor' 
    });
  }

  try {
    const { systemPrompt, pregunta } = req.body;

    if (!pregunta || !systemPrompt) {
      return res.status(400).json({ 
        error: 'Faltan parámetros: systemPrompt y pregunta son requeridos' 
      });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: systemPrompt + ' Responde en español de Chile, de forma clara y pedagógica. Máximo 300 palabras.'
          },
          {
            role: 'user',
            content: pregunta
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ 
        error: 'Error de Groq API', 
        details: errorData 
      });
    }

    const data = await response.json();
    const respuesta = data.choices[0].message.content;

    return res.status(200).json({ respuesta });

  } catch (error) {
    console.error('Error en groq-chat:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
}
