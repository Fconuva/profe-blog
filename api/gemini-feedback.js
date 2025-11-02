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
    const hasHF = Boolean(process.env.HUGGINGFACE_API_KEY);
    res.status(200).json({ ok: true, hasHuggingFace: hasHF, provider: 'huggingface' });
    return;
  }

  // Only POST allowed for feedback generation
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido', code: 'METHOD_NOT_ALLOWED' });
    return;
  }

  // Use Hugging Face Inference API (free, no credit card required)
  const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || 'hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Public token works for testing
  const HF_MODEL = 'microsoft/Phi-3-mini-4k-instruct'; // Fast, free, good for Spanish

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
    const composedPrompt = `${basePrompt}

Pregunta evaluada: ${pregunta}
Respuesta del docente: ${respuestaDocente}
Tema vinculado: ${temaStr}

Entrega la retroalimentación en 3 apartados claros:
1) Refuerzo de aciertos
2) Corrección y explicación
3) Sugerencia de profundización`;

    // Use Hugging Face Inference API
    const generationPromise = (async () => {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${HF_MODEL}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HF_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: composedPrompt,
            parameters: {
              max_new_tokens: 512,
              temperature: 0.3,
              top_p: 0.9,
              return_full_text: false
            }
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HF API Error:', response.status, errorText);
        throw new Error(`Hugging Face API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different response formats
      let text = '';
      if (Array.isArray(data) && data[0]?.generated_text) {
        text = data[0].generated_text;
      } else if (data?.generated_text) {
        text = data.generated_text;
      } else if (typeof data === 'string') {
        text = data;
      } else {
        console.error('Unexpected HF response format:', data);
        text = 'Retroalimentación generada. Por favor, revisa tu respuesta considerando el tema evaluado.';
      }

      return text || 'No se pudo generar retroalimentación.';
    })();

    // Race between generation and timeout
    const text = await Promise.race([generationPromise, timeoutPromise]);
    res.status(200).json({ feedback: text, provider: 'huggingface' });

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
