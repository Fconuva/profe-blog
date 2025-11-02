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
  // Health check (GET): never error; reveal if API key is configured
  if (req.method === 'GET') {
    const hasKey = Boolean(process.env.GEMINI_API_KEY);
    res.status(200).json({ ok: true, hasKey });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Falta GEMINI_API_KEY en variables de entorno', code: 'MISSING_API_KEY' });
    return;
  }

  try {
    const { pregunta, respuestaDocente, tema } = req.body || {};
    if (!pregunta || !respuestaDocente) {
      res.status(400).json({ error: 'Faltan campos requeridos: pregunta y respuestaDocente', code: 'BAD_REQUEST' });
      return;
    }

    const plan = loadPlan();
    const iaCfg = plan?.exam?.ia_feedback || {};
    const modelName = iaCfg.model || 'gemini-1.5-flash';
    const basePrompt = iaCfg.prompt || 'Actúa como tutor pedagógico para profesores de Lenguaje.';

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const fetchMod = await import('cross-fetch');

    const genAI = new GoogleGenerativeAI(apiKey, { fetch: fetchMod.default });
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = [
      basePrompt,
      `Pregunta evaluada: ${pregunta}`,
      `Respuesta del docente: ${respuestaDocente}`,
      `Tema vinculado: ${Array.isArray(tema) ? tema.join(', ') : (tema || 'N/A')}`,
      'Entrega la retroalimentación en 3 apartados claros con títulos:',
      '1) Refuerzo de aciertos',
      '2) Corrección y explicación',
      '3) Sugerencia de profundización (cita breve del temario si procede)'
    ].join('\n');

    const result = await model.generateContent(prompt);
    const text = result?.response?.text?.() || 'No se pudo generar retroalimentación.';

    res.status(200).json({ feedback: text });
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ error: 'Error al generar retroalimentación', code: 'GENERATION_ERROR', details: String(err?.message || err) });
  }
}
