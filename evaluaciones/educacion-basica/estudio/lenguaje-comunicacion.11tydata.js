const fs = require('fs');
const path = require('path');

// Load plan.json robustly using absolute path to avoid require/loader issues
let plan = { study: [], exam: { preguntas: [] } };
try {
  const planPath = path.join(__dirname, '..', 'pruebas', '63-sc-l', 'plan.json');
  const raw = fs.readFileSync(planPath, 'utf-8');
  plan = JSON.parse(raw);
  console.log(`✅ Plan loaded: ${plan?.exam?.preguntas?.length || 0} preguntas`);
} catch (e) {
  console.error('❌ Error loading plan.json:', e.message);
}

const casosPorTema = {};
const casosPorSubtema = {};
const casosPreset = {};

try {
    const preguntas = plan?.exam?.preguntas || [];
    console.log(`Processing ${preguntas.length} preguntas...`);

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

// Preset: garantizar casos para 'Textos literarios' si no hay mapeo
casosPreset['textos literarios'] = [
    {
      id: 'CLIT-01',
      enunciado: 'En un cuento el narrador conoce los pensamientos de todos los personajes. ¿Qué tipo de narrador es?',
      alternativas: [
        { opcion: 'A', texto: 'Protagonista' },
        { opcion: 'B', texto: 'Testigo' },
        { opcion: 'C', texto: 'Omnisciente' },
        { opcion: 'D', texto: 'Equisciente' }
      ],
      respuesta_correcta: 'C',
      explicacion: 'El narrador omnisciente accede a la interioridad de todos los personajes.',
      temas_relacionados: ['Tipos de narrador']
    },
    {
      id: 'CLIT-02',
      enunciado: 'Una novela alterna capítulos del pasado para explicar el conflicto. ¿Qué recurso temporal predomina?',
      alternativas: [
        { opcion: 'A', texto: 'In medias res' },
        { opcion: 'B', texto: 'Anacronía retrospectiva (flashback)' },
        { opcion: 'C', texto: 'Prolepsis' },
        { opcion: 'D', texto: 'Elipsis' }
      ],
      respuesta_correcta: 'B',
      explicacion: 'El flashback introduce acontecimientos previos que iluminan el conflicto principal.',
      temas_relacionados: ['Estrategias narrativas']
    },
    {
      id: 'CLIT-03',
      enunciado: '¿Qué rasgo identifica a la fábula como género narrativo?',
      alternativas: [
        { opcion: 'A', texto: 'Describir la métrica del poema' },
        { opcion: 'B', texto: 'Animales antropomorfos y moraleja' },
        { opcion: 'C', texto: 'Monólogo interior constante' },
        { opcion: 'D', texto: 'Relato en cartas de amor' }
      ],
      respuesta_correcta: 'B',
      explicacion: 'La fábula usa animales con rasgos humanos para transmitir una enseñanza explícita.',
      temas_relacionados: ['Géneros narrativos']
    },
    {
      id: 'CLIT-04',
      enunciado: "En el verso 'El río susurra historias', ¿qué figura aparece?",
      alternativas: [
        { opcion: 'A', texto: 'Metáfora' },
        { opcion: 'B', texto: 'Hipérbole' },
        { opcion: 'C', texto: 'Personificación' },
        { opcion: 'D', texto: 'Oxímoron' }
      ],
      respuesta_correcta: 'C',
      explicacion: 'Se atribuye al río una acción humana (susurrar).',
      temas_relacionados: ['Figuras literarias']
    },
    {
      id: 'CLIT-05',
      enunciado: 'Poema de 14 versos con dos cuartetos y dos tercetos, rima consonante. Corresponde a:',
      alternativas: [
        { opcion: 'A', texto: 'Haikú' },
        { opcion: 'B', texto: 'Oda' },
        { opcion: 'C', texto: 'Soneto' },
        { opcion: 'D', texto: 'Lira' }
      ],
      respuesta_correcta: 'C',
      explicacion: 'Estructura clásica del soneto (4-4-3-3) con rima consonante.',
      temas_relacionados: ['Métrica']
    },
    {
      id: 'CLIT-06',
      enunciado: 'Una obra teatral exagera rasgos para provocar humor y crítica social. ¿Qué subgénero es?',
      alternativas: [
        { opcion: 'A', texto: 'Tragedia' },
        { opcion: 'B', texto: 'Farsa' },
        { opcion: 'C', texto: 'Drama' },
        { opcion: 'D', texto: 'Auto sacramental' }
      ],
      respuesta_correcta: 'B',
      explicacion: 'La farsa exagera equívocos y rasgos para producir comicidad y sátira.',
      temas_relacionados: ['Subgéneros dramáticos']
    },
    {
      id: 'CLIT-07',
      enunciado: 'En escena, un personaje habla al público sin que lo oigan otros personajes. Ese recurso se llama:',
      alternativas: [
        { opcion: 'A', texto: 'Monólogo' },
        { opcion: 'B', texto: 'Aparte' },
        { opcion: 'C', texto: 'Soliloquio' },
        { opcion: 'D', texto: 'Acotación' }
      ],
      respuesta_correcta: 'B',
      explicacion: 'El aparte rompe la cuarta pared para comunicar algo directamente al público.',
      temas_relacionados: ['Elementos del género dramático']
    },
    {
      id: 'CLIT-08',
      enunciado: "La metáfora 'palabras cuchillos' produce principalmente el efecto de:",
      alternativas: [
        { opcion: 'A', texto: 'Suavizar el tono' },
        { opcion: 'B', texto: 'Sugerir agresividad y daño' },
        { opcion: 'C', texto: 'Crear humor' },
        { opcion: 'D', texto: 'Neutralizar la emoción' }
      ],
      respuesta_correcta: 'B',
      explicacion: 'La comparación implícita enfatiza dureza y daño emocional.',
      temas_relacionados: ['Interpretación de figuras']
    }
  ];

// Debug logging
console.log('📊 Datos exportados:');
console.log(`- casosPorTema keys: ${Object.keys(casosPorTema).length}`);
console.log(`- casosPorSubtema keys: ${Object.keys(casosPorSubtema).join(', ')}`);
console.log(`- casosPreset['textos literarios']: ${casosPreset['textos literarios']?.length || 0} casos`);
if (casosPreset['textos literarios'] && casosPreset['textos literarios'][0]) {
  console.log(`- Primer caso preset: ${casosPreset['textos literarios'][0].enunciado.substring(0, 50)}...`);
}

module.exports = { plan, casosPorTema, casosPorSubtema, casosPreset };
