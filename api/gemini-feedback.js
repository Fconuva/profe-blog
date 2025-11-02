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
    const hasGemini = Boolean(process.env.GEMINI_API_KEY);
    const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
    // Determine candidate provider
    const plan = loadPlan();
    const planProv = (plan?.exam?.ia_feedback?.provider || '').toLowerCase();
    let provider = planProv || (hasGemini ? 'google-gemini' : (hasOpenAI ? 'openai' : 'none'));
    res.status(200).json({ ok: true, hasGemini, hasOpenAI, provider });
    return;
  }

  // Resolve provider and keys
  const plan = loadPlan();
  const iaCfg = plan?.exam?.ia_feedback || {};
  const requestedProvider = (iaCfg.provider || '').toLowerCase();
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  let provider = requestedProvider;
  if (!provider) provider = hasGemini ? 'google-gemini' : (hasOpenAI ? 'openai' : '');
  if (!provider) {
    res.status(500).json({ error: 'No hay proveedor de IA configurado. Define GEMINI_API_KEY o OPENAI_API_KEY en Vercel.', code: 'MISSING_PROVIDER' });
    return;
  }

  try {
    const { pregunta, respuestaDocente, tema } = req.body || {};
    if (!pregunta || !respuestaDocente) {
      res.status(400).json({ error: 'Faltan campos requeridos: pregunta y respuestaDocente', code: 'BAD_REQUEST' });
      return;
    }

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

    if (provider.includes('gemini')) {
      if (!hasGemini) {
        res.status(500).json({ error: 'Falta GEMINI_API_KEY en variables de entorno', code: 'MISSING_API_KEY' });
        return;
      }
      const modelName = iaCfg.model || 'gemini-1.5-flash';
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const fetchMod = await import('cross-fetch');
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, { fetch: fetchMod.default });
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(composedPrompt);
      const text = result?.response?.text?.() || 'No se pudo generar retroalimentación.';
      res.status(200).json({ feedback: text, provider: 'google-gemini' });
      return;
    }

    if (provider.includes('openai')) {
      if (!hasOpenAI) {
        res.status(500).json({ error: 'Falta OPENAI_API_KEY en variables de entorno', code: 'MISSING_API_KEY' });
        return;
      }
      const { OpenAI } = await import('openai');
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const modelName = iaCfg.model || 'gpt-4o-mini';
      const chat = await client.chat.completions.create({
        model: modelName,
        messages: [
          { role: 'system', content: basePrompt },
          { role: 'user', content: composedPrompt }
        ],
        temperature: 0.3
      });
      const text = chat?.choices?.[0]?.message?.content || 'No se pudo generar retroalimentación.';
      res.status(200).json({ feedback: text, provider: 'openai' });
      return;
    }

    res.status(500).json({ error: 'Proveedor de IA no soportado', code: 'UNSUPPORTED_PROVIDER' });
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ error: 'Error al generar retroalimentación', code: 'GENERATION_ERROR', details: String(err?.message || err) });
  }
}
