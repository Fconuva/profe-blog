exports.handler = async (event) => {
    const startTime = Date.now();
    console.log('⏱️ groq-feedback started');

    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { pregunta, respuestaDocente, tema, tipo } = JSON.parse(event.body);

        if (!pregunta) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'La pregunta es requerida' })
            };
        }

        console.log(`📥 Procesando consulta Groq: ${tipo} - ${tema}`);

        // Validar API key
        const groqApiKey = process.env.GROQ_API_KEY;
        if (!groqApiKey) {
            throw new Error('GROQ_API_KEY no configurada');
        }

        // Contexto educativo especializado
        const contextoEducativo = `
Eres Grok, un asistente especializado en Educación Especial chilena y PIE (Programa de Integración Escolar).
Tu conocimiento se basa en:
- Ley 20.845 sobre inclusión escolar
- Decreto 170/2010 sobre PIE
- Normativa MINEDUC sobre educación especial
- Estrategias pedagógicas inclusivas
- Evaluación y diagnóstico en educación especial
- Adaptaciones curriculares
- Trabajo colaborativo docente-familia
- Derechos del estudiante con necesidades educativas especiales

IMPORTANTE: Responde siempre en español, de manera clara, profesional y basada en evidencia.
Si no tienes información específica sobre un tema, indícalo claramente.
`;

        // Construir prompt según el tipo de consulta
        let prompt = '';

        switch (tipo) {
            case 'consulta_general':
                prompt = `${contextoEducativo}

Pregunta del docente: "${pregunta}"

Proporciona una respuesta completa, práctica y fundamentada en normativa chilena.
Incluye referencias a leyes o decretos cuando sea relevante.
`;
                break;

            case 'evaluacion_pie':
                prompt = `${contextoEducativo}

El docente pregunta sobre evaluación PIE: "${pregunta}"

Responde enfocándote en:
- Criterios de evaluación inclusiva
- Adaptaciones de evaluación
- Indicadores de logro
- Registro de progreso
- Participación familiar
`;
                break;

            case 'estrategias_pedagogicas':
                prompt = `${contextoEducativo}

Consulta sobre estrategias pedagógicas: "${pregunta}"

Proporciona estrategias prácticas, adaptables y fundamentadas.
Incluye ejemplos concretos de implementación.
`;
                break;

            case 'normativa':
                prompt = `${contextoEducativo}

Pregunta sobre normativa: "${pregunta}"

Cita leyes, decretos y orientaciones específicas del MINEDUC.
Explica las implicancias prácticas para el aula.
`;
                break;

            default:
                prompt = `${contextoEducativo}

Pregunta: "${pregunta}"

Responde de manera completa y útil.
`;
        }

        // Llamar a Groq API
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${groqApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    {
                        role: 'system',
                        content: 'Eres un asistente especializado en Educación Especial chilena. Responde siempre en español, de manera profesional y fundamentada.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 2000,
                temperature: 0.7,
                top_p: 0.9
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('❌ Groq API error:', response.status, errorData);
            throw new Error(`Error en API de Groq: ${response.status}`);
        }

        const groqData = await response.json();
        const feedback = groqData.choices?.[0]?.message?.content;

        if (!feedback) {
            throw new Error('No se recibió respuesta de Groq');
        }

        const elapsed = Date.now() - startTime;
        console.log(`✅ Groq response generated in ${elapsed}ms`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                feedback: feedback.trim(),
                tipo: tipo,
                tema: tema,
                elapsed: elapsed
            })
        };

    } catch (error) {
        const elapsed = Date.now() - startTime;
        console.error(`❌ Error after ${elapsed}ms:`, error.message);
        console.error('Stack:', error.stack);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: error.message || 'Error interno del servidor',
                elapsed: elapsed
            })
        };
    }
};