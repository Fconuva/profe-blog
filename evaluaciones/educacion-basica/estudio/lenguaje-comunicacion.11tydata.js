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
      explicacion: 'Este texto es un mito porque cumple las características distintivas del género según el currículum nacional: (1) <strong>Tiempo primordial</strong>: ocurre en los orígenes ("cuando el mundo era joven"), no en tiempo histórico; (2) <strong>Personajes divinos</strong>: dioses (Zeus) y titanes (Prometeo) como protagonistas; (3) <strong>Explicación cosmogónica</strong>: explica el origen de un elemento fundamental de la civilización (el fuego); (4) <strong>Función cultural</strong>: transmite valores fundacionales (sacrificio, rebeldía). No es leyenda (que ancla lo sobrenatural en geografía real reconocible, como Chiloé o La Araucanía), ni fábula (que usa animales con moraleja explícita), ni cuento (narración breve de tiempo histórico con personajes humanos). El mito pertenece al pensamiento religioso y filosófico de una cultura.',
      temas_relacionados: ['Géneros narrativos', 'Contexto histórico-literario']
    }
  ];

// Preset: casos complejos para 'Textos no literarios' (argumentación, multimodalidad, periodismo)
casosPreset['textos no literarios'] = [
    {
      id: 'CNOLIT-01',
      enunciado: `Una profesora de 8° básico trabaja la identificación de recursos argumentativos. Presenta este fragmento de una columna de opinión publicada en La Tercera:

"Según datos del MINEDUC, el 45% de los estudiantes de 8° básico no alcanza el nivel adecuado en comprensión lectora. Esta cifra no es casualidad: Chile invierte menos del 1% del PIB en educación pública, mientras países con mejores resultados como Finlandia invierten sobre el 7%. Como dijo la experta en educación Amanda Céspedes: 'Sin inversión real en formación docente y materiales pedagógicos, seguiremos reproduciendo desigualdad'. ¿Acaso no es obvio que necesitamos aumentar urgentemente el presupuesto educativo?"

¿Qué tipo de recurso argumentativo se utiliza al mencionar la opinión de Amanda Céspedes?`,
      alternativas: [
        { opcion: 'A', texto: 'Estadística, porque presenta datos numéricos para respaldar la tesis del autor.' },
        { opcion: 'B', texto: 'Cita de autoridad, porque recurre a la opinión de una experta reconocida en el tema.' },
        { opcion: 'C', texto: 'Pregunta retórica, porque cuestiona al lector sin esperar respuesta literal.' },
        { opcion: 'D', texto: 'Ejemplificación, porque ilustra el problema con un caso concreto de la realidad.' }
      ],
      respuesta_correcta: 'B',
      explicacion: 'La cita de autoridad es un recurso argumentativo que fortalece la tesis del emisor apelando a la credibilidad de un experto reconocido en la materia. En este caso, Amanda Céspedes (neuropsiquiatra infantil y experta en educación) respalda con su prestigio profesional la postura del columnista sobre la necesidad de inversión educativa. Este recurso apela al <em>ethos</em> (autoridad), distinto de la estadística (datos MINEDUC) que apela al <em>logos</em> (razón), y de la pregunta retórica final que apela al <em>pathos</em> (emoción). Las Bases Curriculares de 7° y 8° enfatizan la identificación de estos recursos para desarrollar lectura crítica de textos argumentativos.',
      temas_relacionados: ['Recursos argumentativos', 'Textos no literarios', 'Hecho vs opinión']
    },
    {
      id: 'CNOLIT-02',
      enunciado: `Un docente de 7° básico enseña a distinguir entre hecho y opinión en textos periodísticos. Lee este fragmento de una noticia publicada en El Mercurio:

"El pasado martes 15 de octubre, el Congreso aprobó la reforma tributaria con 85 votos a favor y 62 en contra. La iniciativa aumenta en un 2% el impuesto a las rentas superiores a $10 millones mensuales. Los expertos consideran que esta medida es insuficiente para reducir la desigualdad económica en el país. La votación se realizó después de tres meses de debate parlamentario."

¿Cuál de las siguientes afirmaciones corresponde a un hecho verificable y cuál a una opinión?`,
      alternativas: [
        { opcion: 'A', texto: 'Hecho: "El Congreso aprobó la reforma con 85 votos a favor". Opinión: "La medida es insuficiente para reducir la desigualdad".' },
        { opcion: 'B', texto: 'Hecho: "Los expertos consideran que la medida es insuficiente". Opinión: "La votación se realizó después de tres meses".' },
        { opcion: 'C', texto: 'Ambas son hechos porque provienen de una noticia publicada en un medio serio y confiable.' },
        { opcion: 'D', texto: 'Ambas son opiniones porque el periodista eligió qué información incluir en la noticia.' }
      ],
      respuesta_correcta: 'A',
      explicacion: 'Un <strong>hecho</strong> es una afirmación objetiva, verificable mediante evidencia concreta (documentos, registros, observación directa). "El Congreso aprobó con 85 votos a favor" puede corroborarse en actas parlamentarias oficiales. Una <strong>opinión</strong> es un juicio de valor, interpretación subjetiva que puede variar según perspectivas. "La medida es insuficiente" es una valoración que depende de criterios ideológicos o económicos particulares de quienes opinan. Aunque el texto dice "los expertos consideran", sigue siendo opinión porque expresa un juicio evaluativo, no un dato constatable. Esta distinción es clave para desarrollar lectura crítica de medios según el currículum nacional.',
      temas_relacionados: ['Hecho vs opinión', 'Textos informativos', 'Géneros informativos']
    },
    {
      id: 'CNOLIT-03',
      enunciado: `Una profesora de 8° básico trabaja la interpretación de textos multimodales. Muestra este afiche publicado por el MINSAL durante la campaña de vacunación 2024:

[IMAGEN: Fondo celeste con jeringa dibujada. Texto principal en rojo: "VACÚNATE YA". Texto secundario: "Protégete del COVID-19, la influenza y otras enfermedades. La vacunación es gratuita en todos los consultorios. Fecha límite: 30 de noviembre". Logo MINSAL abajo. Fotografía de familia sonriente en esquina inferior derecha.]

¿Qué función cumple la combinación del lenguaje verbal y visual en este afiche?`,
      alternativas: [
        { opcion: 'A', texto: 'Función informativa: el texto entrega datos (gratuidad, fecha) y la imagen refuerza el mensaje mediante símbolos reconocibles.' },
        { opcion: 'B', texto: 'Función narrativa: cuenta la historia de una familia que se vacunó y logró protegerse de enfermedades.' },
        { opcion: 'C', texto: 'Función expresiva: el autor manifiesta sus emociones personales sobre la importancia de vacunarse.' },
        { opcion: 'D', texto: 'Función metalingüística: explica cómo funciona el lenguaje visual de los afiches de salud pública.' }
      ],
      respuesta_correcta: 'A',
      explicacion: 'En textos multimodales, el lenguaje verbal (escrito) y el lenguaje visual (imágenes, colores, tipografía) se complementan para cumplir funciones comunicativas específicas. En este afiche de campaña de salud pública, la <strong>función informativa</strong> predomina: el texto verbal entrega información concreta (gratuidad, plazo, lugares de vacunación), mientras el lenguaje visual refuerza mediante códigos reconocibles: jeringa (símbolo de vacuna), rojo en "VACÚNATE YA" (urgencia, llamado a la acción), familia sonriente (beneficio colectivo, bienestar). No es narrativa (no relata acontecimientos en secuencia temporal), ni expresiva (no comunica emociones del emisor sino datos objetivos), ni metalingüística (no explica el lenguaje mismo). Las Bases Curriculares enfatizan la lectura crítica de textos multimodales para comprender estrategias persuasivas.',
      temas_relacionados: ['Textos multimodales', 'Interpretación de textos multimodales', 'Propósito comunicativo']
    },
    {
      id: 'CNOLIT-04',
      enunciado: `Un docente de 7° básico enseña la situación de enunciación en textos no literarios. Presenta este fragmento de un manual de instrucciones:

"Antes de encender el equipo, asegúrese de que el cable esté correctamente conectado. Presione el botón de inicio durante 3 segundos. Si aparece una luz roja intermitente, desconecte inmediatamente y contacte al servicio técnico. Mantenga el dispositivo alejado del agua y en un lugar ventilado."

¿Qué elementos de la situación de enunciación se pueden identificar en este texto?`,
      alternativas: [
        { opcion: 'A', texto: 'Emisor: fabricante anónimo. Receptor: usuario individual. Propósito: entretener mediante anécdotas técnicas. Canal: oral presencial.' },
        { opcion: 'B', texto: 'Emisor: empresa fabricante. Receptor: usuario del producto. Propósito: instruir para uso seguro. Canal: escrito (manual impreso o digital).' },
        { opcion: 'C', texto: 'Emisor: técnico especializado. Receptor: otros técnicos. Propósito: persuadir de comprar el producto. Canal: conversación informal.' },
        { opcion: 'D', texto: 'Emisor: usuario experto. Receptor: fabricante. Propósito: reclamar por fallas del producto. Canal: carta formal.' }
      ],
      respuesta_correcta: 'B',
      explicacion: 'La <strong>situación de enunciación</strong> comprende los elementos del circuito comunicativo: <em>(1) Emisor</em>: empresa fabricante (identidad institucional implícita en el género textual); <em>(2) Receptor</em>: usuario/comprador del producto (uso de "usted", instrucciones para operación); <em>(3) Propósito</em>: instruir para uso correcto y seguro (verbos imperativos: "asegúrese", "presione", "mantenga"); <em>(4) Canal</em>: escrito (manual físico o PDF digital); <em>(5) Contexto</em>: situación de instalación/uso del dispositivo; <em>(6) Código</em>: español formal con tecnicismos ("luz intermitente", "servicio técnico"). El tono imperativo ("desconecte", "contacte") es característico de textos instructivos según tipología textual del currículum. No busca entretener ni persuadir de compra, sino garantizar operación segura mediante pasos secuenciados.',
      temas_relacionados: ['Situación de enunciación', 'Adecuación a la situación comunicativa', 'Propósito comunicativo']
    },
    {
      id: 'CNOLIT-05',
      enunciado: `Una profesora de 8° básico analiza las funciones de géneros periodísticos. Presenta estos dos titulares publicados el mismo día:

<strong>Titular 1 (La Tercera):</strong> "Ministerio de Salud reporta 1.245 nuevos casos de COVID-19 en las últimas 24 horas"

<strong>Titular 2 (El Mostrador, columna de opinión):</strong> "El fracaso de la estrategia sanitaria: por qué el Gobierno debe cambiar su enfoque ante la pandemia"

¿Qué diferencia fundamental existe entre ambos textos en cuanto a su función periodística?`,
      alternativas: [
        { opcion: 'A', texto: 'Ambos cumplen función informativa porque entregan datos sobre la pandemia al público.' },
        { opcion: 'B', texto: 'El titular 1 es informativo (reporta hechos objetivos), el titular 2 es de opinión (emite juicio valorativo sobre la gestión).' },
        { opcion: 'C', texto: 'El titular 1 es interpretativo porque analiza causas, el titular 2 es informativo porque describe la estrategia.' },
        { opcion: 'D', texto: 'Ambos son de opinión porque ambos medios tienen línea editorial y eligen qué publicar.' }
      ],
      respuesta_correcta: 'B',
      explicacion: 'Los géneros periodísticos se clasifican según su función comunicativa principal: <br><br><strong>1) Informativos</strong> (noticia, reportaje): presentan hechos verificables con objetividad, separando información de opinión. El titular 1 reporta un dato oficial (1.245 casos) sin valoración. <br><br><strong>2) De opinión</strong> (columna, editorial, carta al director): expresan juicios valorativos, interpretaciones o posturas sobre hechos. El titular 2 califica la estrategia como "fracaso" (juicio de valor) y propone cambios (posicionamiento político). <br><br><strong>3) Interpretativos</strong> (crónica, entrevista, reportaje en profundidad): combinan información con análisis de contexto y causas. <br><br>Esta distinción es fundamental para desarrollar lectura crítica de medios según las Bases Curriculares de 7° y 8°: el lector debe identificar cuándo un texto informa (objetividad) y cuándo opina (subjetividad), para no confundir hechos con valoraciones ideológicas.',
      temas_relacionados: ['Funciones periodísticas', 'Géneros informativos', 'Hecho vs opinión']
    },
    {
      id: 'CNOLIT-06',
      enunciado: `Un docente de 7° básico enseña a analizar gráficos en textos informativos. Muestra este gráfico publicado en La Tercera junto a un reportaje sobre educación:

[GRÁFICO DE BARRAS: Título "Promedio de lectura de libros al año por estudiante (2020-2024)"
- 2020: 2,1 libros
- 2021: 1,8 libros
- 2022: 1,5 libros
- 2023: 1,3 libros
- 2024: 1,1 libros
Fuente: Agencia de Calidad de la Educación]

El texto del reportaje afirma: "La pandemia destruyó los hábitos de lectura en escolares chilenos".

¿Qué relación existe entre el gráfico y el texto verbal?`,
      alternativas: [
        { opcion: 'A', texto: 'El gráfico contradice el texto, porque muestra que la lectura aumentó durante la pandemia.' },
        { opcion: 'B', texto: 'El gráfico complementa el texto, proporcionando evidencia cuantitativa de la tendencia a la baja en lectura.' },
        { opcion: 'C', texto: 'El gráfico no se relaciona con el texto porque presenta datos de años diferentes a los mencionados.' },
        { opcion: 'D', texto: 'El gráfico demuestra que el texto miente, pues los números no confirman la palabra "destruyó".' }
      ],
      respuesta_correcta: 'B',
      explicacion: 'En textos informativos multimodales, el lenguaje visual (gráficos, tablas, infografías) y el lenguaje verbal se relacionan de tres formas principales: <br><br><strong>1) Complementariedad</strong>: el gráfico entrega evidencia cuantitativa que respalda la afirmación verbal. Aquí, la tendencia descendente (de 2,1 a 1,1 libros en 5 años) confirma la tesis del titular sobre deterioro de hábitos lectores. <br><br><strong>2) Contradicción</strong>: cuando los datos visuales desmienten lo afirmado verbalmente (no es el caso). <br><br><strong>3) Ampliación</strong>: cuando el gráfico aporta información adicional no mencionada en el texto. <br><br>El estudiante debe observar que: (a) el gráfico muestra caída sostenida cada año, (b) la pandemia (2020-2021) marca inicio de descenso, (c) la tendencia continúa post-pandemia. Aunque "destruyó" pueda ser valoración hiperbólica del periodista, los datos objetivos del gráfico (fuente oficial: Agencia de Calidad) respaldan la existencia de un problema real. Esta lectura integrada de códigos es clave en comprensión de textos discontinuos según el currículum nacional.',
      temas_relacionados: ['Interpretación de textos multimodales', 'Textos informativos', 'Hecho vs opinión']
    }
  ];

// Debug logging
console.log('📊 Datos exportados:');
console.log(`- casosPorTema keys: ${Object.keys(casosPorTema).length}`);
console.log(`- casosPorSubtema keys: ${Object.keys(casosPorSubtema).join(', ')}`);
console.log(`- casosPreset['textos literarios']: ${casosPreset['textos literarios']?.length || 0} casos`);
console.log(`- casosPreset['textos no literarios']: ${casosPreset['textos no literarios']?.length || 0} casos`);
if (casosPreset['textos literarios'] && casosPreset['textos literarios'][0]) {
  console.log(`- Primer caso preset literarios: ${casosPreset['textos literarios'][0].enunciado.substring(0, 50)}...`);
}
if (casosPreset['textos no literarios'] && casosPreset['textos no literarios'][0]) {
  console.log(`- Primer caso preset no literarios: ${casosPreset['textos no literarios'][0].enunciado.substring(0, 50)}...`);
}

module.exports = { plan, casosPorTema, casosPorSubtema, casosPreset };
