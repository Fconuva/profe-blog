const fs = require('fs');
const path = require('path');

module.exports = () => {
  // Load plan.json robustly using absolute path to avoid require/loader issues
  let plan = { study: [], exam: { preguntas: [] } };
  try {
    const planPath = path.join(__dirname, '..', 'pruebas', '63-sc-l', 'plan.json');
    const raw = fs.readFileSync(planPath, 'utf-8');
    plan = JSON.parse(raw);
  } catch {}
  const casosPorTema = {};
  const casosPorSubtema = {};

  try {
    const preguntas = plan?.exam?.preguntas || [];

    // 1) Index by every tema_relacionado (exact key)
    for (const q of preguntas) {
      const temas = q.temas_relacionados || [];
      for (const t of temas) {
        const key = String(t || '').toLowerCase();
        if (!casosPorTema[key]) casosPorTema[key] = [];
        casosPorTema[key].push(q);
      }
    }

    // 2) Alias map: group related temas under each sub-tema title
    const aliasPorSubtema = {
      'textos literarios': [
        'textos literarios',
        'tipos de narrador',
        'estrategias narrativas',
        'géneros narrativos',
        'figuras literarias',
        'métrica',
        'interpretación de figuras',
        'subgéneros dramáticos',
        'elementos del género dramático',
        'cómic y recursos literarios',
        'contexto histórico-literario'
      ],
      'textos no literarios': [
        'textos no literarios',
        'textos informativos',
        'géneros informativos',
        'propósito comunicativo',
        'recursos argumentativos',
        'hecho vs opinión',
        'interpretación de textos multimodales',
        'textos multimodales',
        'situación de enunciación',
        'funciones periodísticas'
      ],
      'coherencia y cohesión': [
        'coherencia y cohesión',
        'cohesión textual',
        'coherencia',
        'cohesión'
      ],
      'adecuación a la situación comunicativa': [
        'adecuación a la situación comunicativa',
        'subordinadas',
        'adecuación comunicativa',
        'modos verbales',
        'ortografía',
        'gestión del diálogo',
        'exposición oral'
      ]
    };

    // Build aggregated cases per subtema title
    const seenIdsBySub = {};
    for (const [subLower, temasKeys] of Object.entries(aliasPorSubtema)) {
      for (const k of temasKeys) {
        const arr = casosPorTema[k] || [];
        for (const q of arr) {
          if (!seenIdsBySub[subLower]) seenIdsBySub[subLower] = new Set();
          if (!casosPorSubtema[subLower]) casosPorSubtema[subLower] = [];
          if (!seenIdsBySub[subLower].has(q.id)) {
            casosPorSubtema[subLower].push(q);
            seenIdsBySub[subLower].add(q.id);
          }
        }
      }
    }
  } catch {}

  return { plan, casosPorTema, casosPorSubtema };
};
