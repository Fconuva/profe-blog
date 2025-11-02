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

  // Health check (GET): never error; reveal if API key is configured
  if (req.method === 'GET') {
    const hasGemini = Boolean(process.env.GEMINI_API_KEY);
    const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
    // Determine candidate provider
    const plan = loadPlan();
    const planProv = (plan?.exam?.ia_feedback?.provider || '').toLowerCase();
    let provider = planProv || (hasGemini ? 'google-gemini' : (hasOpenAI ? 'openai' : 'none'));
    res.status(200).json({ ok: true, hasGemini, hasOpenAI, provider });
    return;
  }

  // Only POST allowed for feedback generation
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido', code: 'METHOD_NOT_ALLOWED' });
    return;
  }

  // Force OpenAI only - Gemini causes 500 errors in production
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  if (!hasOpenAI) {
    res.status(500).json({ 
      error: 'Falta OPENAI_API_KEY en variables de entorno de Vercel', 
      code: 'MISSING_API_KEY' 
    });
    return;
  }

  // Global timeout for entire request
  const TIMEOUT_MS = 25000; // 25 seconds (Vercel limit is 30s)
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('TIMEOUT: La generación excedió 25 segundos')), TIMEOUT_MS);
  });

  try {
    const { pregunta, respuestaDocente, tema } = req.body || {};
    if (!pregunta || !respuestaDocente) {
      res.status(400).json({ error: 'Faltan campos requeridos: pregunta y respuestaDocente', code: 'BAD_REQUEST' });
      return;
    }

    const plan = loadPlan();
    const iaCfg = plan?.exam?.ia_feedback || {};
    const basePrompt = iaCfg.prompt || 'Actúa como tutor pedagógico para profesores de Lenguaje.';
    const temaStr = Array.isArray(tema) ? tema.join(', ') : (tema || 'N/A');
    const composedPrompt = [
      basePrompt,
      `Pregunta evaluada: ${pregunta}`,
      `Respuesta del docente: ${respuestaDocente}`,
      `Tema vinculado: ${temaStr}`,
      'Entrega la retroalimentación en 3 apartados claros con títulos:',
      '1) Refuerzo de aciertos',
      '2) Corrección y explicación',
      '3) Sugerencia de profundización (cita breve del temario si procede)'
    ].join('\n');

    // Use OpenAI exclusively
    const generationPromise = (async () => {
      const { OpenAI } = await import('openai');
      const client = new OpenAI({ 
        apiKey: process.env.OPENAI_API_KEY, 
        timeout: 20000 
      });
      const modelName = iaCfg.model || 'gpt-4o-mini';
      const chat = await client.chat.completions.create({
        model: modelName,
        messages: [
          { role: 'system', content: basePrompt },
          { role: 'user', content: composedPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1024
      });
      return chat?.choices?.[0]?.message?.content || 'No se pudo generar retroalimentación.';
    })();

    // Race between generation and timeout
    const text = await Promise.race([generationPromise, timeoutPromise]);
    res.status(200).json({ feedback: text, provider: 'openai' });

  } catch (err) {
    // Check if it's a timeout error
    if (err?.message?.includes('TIMEOUT')) {
      console.error('Timeout en generación IA:', {
        message: err.message,
        provider,
        timestamp: new Date().toISOString()
      });
      res.status(504).json({ 
        error: 'La generación tardó demasiado. Intenta de nuevo.', 
        code: 'TIMEOUT',
        provider
      });
      return;
    }

    // Log full error for debugging
    console.error('IA Feedback Error:', {
      message: err?.message,
      stack: err?.stack,
      provider,
      hasGemini,
      hasOpenAI,
      timestamp: new Date().toISOString()
    });

    res.status(500).json({ 
      error: 'Error al generar retroalimentación', 
      code: 'GENERATION_ERROR', 
      details: err?.message || String(err),
      provider,
      debug: {
        hasGemini,
        hasOpenAI,
        requestedProvider: provider
      }
    });
  }
}
