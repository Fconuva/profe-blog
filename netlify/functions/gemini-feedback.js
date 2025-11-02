const fs = require('fs');
const path = require('path');

// Try to load plan.json. If unavailable at runtime, fall back to defaults.
function loadPlan() {
  const candidates = [
    // When running from repo
    path.resolve(process.cwd(), 'evaluaciones', 'educacion-basica', 'pruebas', '63-sc-l', 'plan.json'),
    // When bundled, try relative to this file two levels up to repo root
    path.resolve(__dirname, '..', '..', 'evaluaciones', 'educacion-basica', 'pruebas', '63-sc-l', 'plan.json')
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {}
  }
  return null;
}

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Falta GEMINI_API_KEY en variables de entorno' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { pregunta, respuestaDocente, tema } = body;
    if (!pregunta || !respuestaDocente) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Faltan campos requeridos: pregunta y respuestaDocente' }) };
    }

    const plan = loadPlan();
    const iaCfg = (plan && plan.exam && plan.exam.ia_feedback) || {};
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
    const text = (result && result.response && result.response.text && result.response.text()) || 'No se pudo generar retroalimentación.';

    return { statusCode: 200, body: JSON.stringify({ feedback: text }) };
  } catch (err) {
    console.error('Gemini error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error al generar retroalimentación', details: String((err && err.message) || err) }) };
  }
};
