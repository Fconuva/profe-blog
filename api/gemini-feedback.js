const fs = require('fs');
const path = require('path');

// Helper to load plan.json to align prompt/model
function loadPlan() {
  try {
    const planPath = path.join(process.cwd(), 'evaluaciones', 'educacion-basica', 'pruebas', '63-sc-l', 'plan.json');
    const raw = fs.readFileSync(planPath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

module.exports = async function handler(req, res) {
  // CORS headers for client-side requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Health check (GET)
  if (req.method === 'GET') {
    const hasGroq = Boolean(process.env.GROQ_API_KEY);
    res.status(200).json({ ok: true, hasGroq, provider: 'groq' });
    return;
  }

  // Only POST allowed for feedback generation
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido', code: 'METHOD_NOT_ALLOWED' });
    return;
  }

  // Use Groq API (ultra-fast, free tier generous, simple setup)
  // Get free API key at: https://console.groq.com/keys
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  
  if (!GROQ_API_KEY) {
    res.status(500).json({ 
      error: 'Falta GROQ_API_KEY en variables de entorno. Obtén una gratis en https://console.groq.com/keys', 
      code: 'MISSING_API_KEY' 
    });
    return;
  }

  // Global timeout for entire request
  const TIMEOUT_MS = 20000; // 20 seconds (Groq is very fast)
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('TIMEOUT: La generación excedió 20 segundos')), TIMEOUT_MS);
  });

  try {
    const { pregunta, respuestaDocente, tema, tipo } = req.body || {};
    if (!pregunta) {
      res.status(400).json({ error: 'Falta campo requerido: pregunta', code: 'BAD_REQUEST' });
      return;
    }

    const plan = loadPlan();
    const iaCfg = plan?.exam?.ia_feedback || {};
    const basePrompt = iaCfg.prompt || 'Eres un tutor pedagógico especializado en Lenguaje y Comunicación para docentes chilenos.';
    const temaStr = Array.isArray(tema) ? tema.join(', ') : (tema || 'N/A');
    
    const systemPrompt = basePrompt;
    
    // Detectar si es solicitud de explicación o retroalimentación de respuesta
    let userPrompt;
    if (tipo === 'explicar' || !respuestaDocente || respuestaDocente.trim() === '') {
      // Solicitud de EXPLICACIÓN del objetivo
      userPrompt = `Objetivo curricular que el profesor necesita comprender:
"${pregunta}"

Tema vinculado: ${temaStr}

Explica este objetivo pedagógicamente con:
1) Explicación conceptual clara
2) Ejemplo contextualizado con texto literario
3) Estrategias didácticas aplicables en aula`;
    } else {
      // RETROALIMENTACIÓN de respuesta del docente
      userPrompt = `Objetivo evaluado: ${pregunta}

Respuesta del docente: ${respuestaDocente}

Tema: ${temaStr}

Analiza la respuesta del docente y entrega:
1) Refuerzo de lo correcto
2) Corrección de errores conceptuales (si los hay)
3) Sugerencia de profundización`;
    }

    // Use Groq API (fastest inference, free tier)
    const generationPromise = (async () => {
      const response = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant', // Fast, good quality, free
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.3,
            max_tokens: 800,
            top_p: 0.9
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Groq API Error:', response.status, errorText);
        throw new Error(`Groq API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content || 'No se pudo generar retroalimentación.';
      return text.trim();
    })();

    // Race between generation and timeout
    const text = await Promise.race([generationPromise, timeoutPromise]);
    res.status(200).json({ feedback: text, provider: 'groq' });

  } catch (err) {
    // Check if it's a timeout error
    if (err?.message?.includes('TIMEOUT')) {
      console.error('Timeout en generación IA:', {
        message: err.message,
        timestamp: new Date().toISOString()
      });
      res.status(504).json({ 
        error: 'La generación tardó demasiado. Intenta de nuevo.', 
        code: 'TIMEOUT',
        provider: 'huggingface'
      });
      return;
    }

    // Log full error for debugging
    console.error('IA Feedback Error:', {
      message: err?.message,
      stack: err?.stack,
      timestamp: new Date().toISOString()
    });

    res.status(500).json({ 
      error: 'Error al generar retroalimentación', 
      code: 'GENERATION_ERROR', 
      details: err?.message || String(err),
      provider: 'huggingface'
    });
  }
}
