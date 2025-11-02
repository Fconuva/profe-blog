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

// Preset: casos complejos y contextualizados para 'Textos literarios' (estilo ECEP real)
casosPreset['textos literarios'] = [
    {
      id: 'CLIT-01',
      enunciado: `En una clase de 8° básico, una docente trabaja el análisis de perspectiva narrativa. Lee el siguiente fragmento a sus estudiantes:

"María caminaba por el parque sin rumbo fijo. Pensaba en las palabras que le había dicho su madre esa mañana. Juan, desde el banco, la observaba en silencio. Él también recordaba aquella conversación, aunque desde una perspectiva muy distinta. Ambos sabían que algo había cambiado para siempre entre ellos."

¿Qué tipo de narrador predomina en este fragmento y por qué es relevante para comprender la historia?`,
      alternativas: [
        { opcion: 'A', texto: 'Narrador protagonista, porque María cuenta su propia historia en primera persona.' },
        { opcion: 'B', texto: 'Narrador testigo, porque Juan observa los hechos desde fuera sin participar.' },
        { opcion: 'C', texto: 'Narrador omnisciente, porque accede a los pensamientos de ambos personajes.' },
        { opcion: 'D', texto: 'Narrador objetivo, porque solo describe acciones observables sin revelar pensamientos.' }
      ],
      respuesta_correcta: 'C',
      explicacion: 'El narrador omnisciente conoce la interioridad de María ("Pensaba en las palabras...") y de Juan ("Él también recordaba..."), característica que permite al lector comprender las motivaciones internas de múltiples personajes. Esta perspectiva es fundamental en narraciones que exploran conflictos psicológicos complejos, según las Bases Curriculares de 7° y 8° básico.',
      temas_relacionados: ['Tipos de narrador', 'Estrategias narrativas']
    },
    {
      id: 'CLIT-02',
      enunciado: `Un docente de Lenguaje solicita a sus estudiantes de 7° básico que identifiquen el género narrativo de un texto. Lee el siguiente fragmento:

"Cuenta la gente antigua que en las montañas de Chiloé vive el Trauco, un hombrecito de apenas un metro de altura, vestido con fibras de quilineja. Dicen que tiene el poder de torcer árboles con solo mirarlos y que enamora a las jóvenes con su silbido mágico. Los padres advierten a sus hijas que no se internen solas en el bosque, pues el Trauco las puede hechizar. Hasta hoy, en los pueblos del archipiélago, se explica así cuando una muchacha soltera queda embarazada: fue cosa del Trauco."

Según las características del género narrativo, ¿qué tipo de texto es este?`,
      alternativas: [
        { opcion: 'A', texto: 'Mito, porque explica el origen del mundo mediante dioses y héroes fundacionales.' },
        { opcion: 'B', texto: 'Cuento, porque presenta una narración breve con estructura de inicio, desarrollo y desenlace.' },
        { opcion: 'C', texto: 'Leyenda, porque explica un fenómeno local mediante seres sobrenaturales en un lugar real.' },
        { opcion: 'D', texto: 'Fábula, porque utiliza personajes antropomorfos para transmitir una enseñanza moral.' }
      ],
      respuesta_correcta: 'C',
      explicacion: 'El texto es una leyenda porque cumple tres características distintivas del género: (1) se sitúa en un lugar real reconocible (Chiloé), (2) explica un fenómeno social específico (embarazos de mujeres solteras), (3) incorpora un ser sobrenatural (Trauco) en la tradición oral de una comunidad. A diferencia del mito (que explica orígenes cósmicos) o la fábula (que usa animales con moraleja explícita), la leyenda ancla lo maravilloso en la geografía y memoria colectiva local, según el currículum nacional.',
      temas_relacionados: ['Géneros narrativos', 'Contexto histórico-literario']
    },
    {
      id: 'CLIT-03',
      enunciado: `En una actividad de análisis de figuras literarias, una profesora de 8° básico presenta el siguiente poema de Gabriela Mistral a sus estudiantes:

"La tierra es dulce como si fuera fruta,
y está toda dorada de luz solar.
El viento juega entre las ramas altas
y las olas del mar son una canción
que mece la tarde sin cesar."

Un estudiante identifica figuras literarias en los versos. ¿Cuál de las siguientes afirmaciones es correcta respecto a las figuras presentes?`,
      alternativas: [
        { opcion: 'A', texto: 'En "La tierra es dulce como si fuera fruta" hay una metáfora porque compara sin usar nexo explícito.' },
        { opcion: 'B', texto: 'En "El viento juega entre las ramas" hay personificación porque atribuye acción humana al viento.' },
        { opcion: 'C', texto: 'En "las olas del mar son una canción" hay hipérbole porque exagera el sonido del mar.' },
        { opcion: 'D', texto: 'En "mece la tarde sin cesar" hay aliteración por la repetición del sonido "ce".' }
      ],
      respuesta_correcta: 'B',
      explicacion: 'La personificación consiste en atribuir cualidades o acciones humanas a elementos no humanos. En el verso "El viento juega entre las ramas", el verbo "jugar" (acción típicamente humana) se aplica al viento (fenómeno natural), creando una imagen de dinamismo y alegría que caracteriza el estilo de Mistral. La opción A es incorrecta porque "como si fuera" indica símil (comparación explícita), no metáfora. La C confunde metáfora con hipérbole. La D identifica repetición silábica, pero no constituye aliteración con efecto rítmico relevante.',
      temas_relacionados: ['Figuras literarias', 'Interpretación de figuras']
    },
    {
      id: 'CLIT-04',
      enunciado: `Un profesor de 7° básico está enseñando formas métricas tradicionales. Presenta el siguiente poema a sus estudiantes:

"Cuenta la historia que en Granada
vivió una hermosa y noble dama,
que por un moro se enamorada
y por él perdió su fama.
Él la visitaba cada noche,
bajo la luna y las estrellas,
y le susurraba con reproche
las más dulces y tristes querellas."

Después de analizar la estructura, ¿qué forma métrica corresponde a este poema?`,
      alternativas: [
        { opcion: 'A', texto: 'Soneto, porque tiene 14 versos endecasílabos con rima consonante.' },
        { opcion: 'B', texto: 'Romance, porque tiene versos octosílabos con rima asonante en los pares.' },
        { opcion: 'C', texto: 'Décima, porque consta de 10 versos octosílabos con esquema ABBAACCDDC.' },
        { opcion: 'D', texto: 'Redondilla, porque presenta cuartetos octosílabos con rima consonante ABBA.' }
      ],
      respuesta_correcta: 'D',
      explicacion: 'El poema está compuesto por dos cuartetos (estrofas de 4 versos) octosílabos (8 sílabas métricas) con rima consonante siguiendo el esquema ABBA: Granada-enamorada-dama-fama (1ª estrofa), noche-reproche-estrellas-querellas (2ª estrofa). Esta estructura corresponde a la redondilla, forma métrica española tradicional. No es romance (que tiene rima asonante solo en versos pares y extensión indefinida), ni soneto (14 versos endecasílabos), ni décima (10 versos con esquema específico). La redondilla es frecuente en poesía narrativa y lírica popular del Siglo de Oro.',
      temas_relacionados: ['Métrica', 'Formas métricas']
    },
    {
      id: 'CLIT-05',
      enunciado: `En una clase de análisis dramático, una docente de 8° básico trabaja con un fragmento de "La pérgola de las flores" de Isidora Aguirre:

CARMELA: (Mirando hacia la plaza) ¡Ay, don Ruperto! Si viera cómo está la cosa. Los carabineros andan rondando, dicen que nos van a sacar de aquí.
DON RUPERTO: (Nervioso, secándose el sudor) ¡Pero si llevamos treinta años en esta esquina! Aquí conocí a mi difunta, aquí nacieron mis cabros...
CARMELA: (Al público, sin que Don Ruperto la escuche) Y aquí va a terminar todo si no nos defendemos unidos, porque estos ricos de arriba no entienden lo que es ganarse el pan con el sudor.

¿Qué recurso dramático utiliza Carmela en su última intervención?`,
      alternativas: [
        { opcion: 'A', texto: 'Monólogo, porque expresa sus pensamientos en voz alta estando sola en escena.' },
        { opcion: 'B', texto: 'Aparte, porque comunica algo al público que otro personaje no debe escuchar.' },
        { opcion: 'C', texto: 'Soliloquio, porque reflexiona sobre su situación sin interlocutor presente.' },
        { opcion: 'D', texto: 'Acotación, porque son indicaciones del autor para comprender la puesta en escena.' }
      ],
      respuesta_correcta: 'B',
      explicacion: 'El aparte es un recurso dramático en que un personaje se dirige directamente al público, rompiendo momentáneamente la cuarta pared, sin que los demás personajes en escena lo escuchen. La acotación "(Al público, sin que Don Ruperto la escuche)" marca explícitamente este recurso. Carmela revela su pensamiento político y la necesidad de unión popular, información que el espectador recibe pero que Don Ruperto ignora. Este recurso genera complicidad con el público y permite expresar subtextos ideológicos sin interrumpir el diálogo natural. No es monólogo (que implica estar solo) ni acotación (que son indicaciones del dramaturgo).',
      temas_relacionados: ['Elementos del género dramático', 'Subgéneros dramáticos']
    },
    {
      id: 'CLIT-06',
      enunciado: `Un profesor de 7° básico trabaja comprensión de efectos de figuras literarias. Presenta el siguiente poema de Nicanor Parra:

"Los que durante años enseñamos
con una tiza en una mano
y un borrador gastado en la otra,
dando vueltas alrededor del pizarrón
hasta que nos jubilamos:
¿quién se acuerda de nosotros?"

Un estudiante debe analizar el efecto expresivo. ¿Qué afirmación es más precisa?`,
      alternativas: [
        { opcion: 'A', texto: 'La enumeración de objetos cotidianos ("tiza", "borrador", "pizarrón") busca embellecer la figura del profesor mediante lenguaje elevado.' },
        { opcion: 'B', texto: 'La pregunta retórica final "¿quién se acuerda de nosotros?" enfatiza el olvido y la invisibilización de los profesores.' },
        { opcion: 'C', texto: 'La metáfora "dando vueltas alrededor del pizarrón" representa la libertad creativa de la labor docente.' },
        { opcion: 'D', texto: 'La hipérbole "durante años" exagera el tiempo de trabajo para crear un efecto humorístico.' }
      ],
      respuesta_correcta: 'B',
      explicacion: 'La pregunta retórica es una interrogación que no espera respuesta literal sino que afirma implícitamente algo. En este caso, "¿quién se acuerda de nosotros?" no busca una respuesta concreta, sino enfatizar que nadie recuerda a los profesores jubilados, subrayando la falta de reconocimiento social a su labor. Este recurso, típico de la antipoesía de Parra, contrasta el lenguaje cotidiano ("tiza", "borrador") con la denuncia de invisibilización. No hay metáfora en "dando vueltas" (es descripción literal de movimiento en aula), ni hipérbole en "durante años" (es tiempo real de ejercicio profesional), ni intención de embellecer (Parra usa antipoesía, que rechaza lo elevado).',
      temas_relacionados: ['Interpretación de figuras', 'Figuras literarias', 'Contexto histórico-literario']
    },
    {
      id: 'CLIT-07',
      enunciado: `En una unidad sobre estrategias narrativas, una docente de 8° básico analiza la estructura temporal de textos literarios. Presenta este fragmento de una novela contemporánea:

"Santiago, 2023. Carla recibe una carta amarillenta que su abuela guardó durante décadas. Al abrirla, lee: 'Querida Elisa, es el año 1973 y todo ha cambiado. Los militares tomaron el poder y tu hermano está desaparecido...' Carla deja de leer, sintiendo que el pasado irrumpe violentamente en su presente."

¿Qué estrategia narrativa temporal se observa en este fragmento y qué función cumple?`,
      alternativas: [
        { opcion: 'A', texto: 'Narración lineal, porque los hechos se presentan en orden cronológico desde 1973 hasta 2023.' },
        { opcion: 'B', texto: 'In medias res, porque la historia comienza en medio de la acción sin explicar antecedentes.' },
        { opcion: 'C', texto: 'Analepsis o flashback, porque la carta de 1973 introduce acontecimientos del pasado que iluminan el presente de Carla.' },
        { opcion: 'D', texto: 'Prolepsis o anticipación, porque la carta anticipa eventos futuros que ocurrirán en el desarrollo de la novela.' }
      ],
      respuesta_correcta: 'C',
      explicacion: 'La analepsis o flashback es un salto temporal retrospectivo que interrumpe la narración presente (Santiago, 2023) para introducir acontecimientos del pasado (carta de 1973). Este recurso cumple funciones narrativas clave: (1) revela información histórica necesaria para comprender el conflicto (dictadura militar, desaparición), (2) establece conexión intergeneracional entre personajes (abuela-Carla), (3) crea tensión dramática al hacer que el pasado "irrumpa" en el presente. No es lineal (porque rompe la cronología), ni in medias res (que inicia en medio sin explicar, pero aquí se contextualiza), ni prolepsis (que anticipa futuro, no retrocede al pasado). El flashback es estrategia central en narrativa de memoria histórica.',
      temas_relacionados: ['Estrategias narrativas', 'Tipos de narrador']
    },
    {
      id: 'CLIT-08',
      enunciado: `Un docente de 7° básico trabaja la distinción entre géneros narrativos mediante el análisis de textos. Presenta el siguiente fragmento:

"Hace muchos siglos, cuando el mundo era joven y los dioses caminaban entre los mortales, existía un titán llamado Prometeo. Los humanos vivían en la oscuridad y el frío, sin conocer el fuego. Prometeo, compadecido, robó una llama del Olimpo y la entregó a la humanidad. Zeus, furioso por la desobediencia, castigó a Prometeo encadenándolo a una roca donde un águila devoraba su hígado cada día. Así, el fuego que hoy usamos es regalo de un titán que desafió a los dioses por amor a los hombres."

Según las características de los géneros narrativos estudiados, ¿qué tipo de relato es este y por qué?`,
      alternativas: [
        { opcion: 'A', texto: 'Leyenda, porque explica el origen del fuego en un lugar específico mediante seres sobrenaturales de la tradición local.' },
        { opcion: 'B', texto: 'Mito, porque explica un fenómeno fundamental (origen del fuego) mediante dioses en un tiempo primordial.' },
        { opcion: 'C', texto: 'Fábula, porque utiliza personajes alegóricos (Prometeo como animal antropomorfo) para transmitir una enseñanza moral.' },
        { opcion: 'D', texto: 'Cuento, porque presenta una estructura narrativa breve con inicio, desarrollo y desenlace en tiempo histórico.' }
      ],
      respuesta_correcta: 'B',
      explicacion: 'Este texto es un mito porque cumple las características distintivas del género según el currículum nacional: (1) **Tiempo primordial**: ocurre en los orígenes ("cuando el mundo era joven"), no en tiempo histórico; (2) **Personajes divinos**: dioses (Zeus) y titanes (Prometeo) como protagonistas; (3) **Explicación cosmogónica**: explica el origen de un elemento fundamental de la civilización (el fuego); (4) **Función cultural**: transmite valores fundacionales (sacrificio, rebeldía). No es leyenda (que ancla lo sobrenatural en geografía real reconocible, como Chiloé o La Araucanía), ni fábula (que usa animales con moraleja explícita), ni cuento (narración breve de tiempo histórico con personajes humanos). El mito pertenece al pensamiento religioso y filosófico de una cultura.',
      temas_relacionados: ['Géneros narrativos', 'Contexto histórico-literario']
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
