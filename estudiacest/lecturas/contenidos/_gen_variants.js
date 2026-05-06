/**
 * Genera las 6 variantes adaptadas a partir de los base.json ya corregidos.
 * Ejecutar:  node _gen_variants.js
 */
const fs = require('fs');
const path = require('path');
const dir = __dirname;

/* ─── helpers ─── */
const read = f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
const write = (f, o) => {
  fs.writeFileSync(path.join(dir, f), JSON.stringify(o, null, 2), 'utf8');
  console.log('  -> ' + f);
};
const clone = o => JSON.parse(JSON.stringify(o));

/* ═══════════════════════════════════════════════
   PEDRO PÁRAMO VARIANTS
   ═══════════════════════════════════════════════ */
const pedroBase = read('pedro_paramo_nm3_2026_base.json');

/* --- 1) VISION --- */
(() => {
  const v = clone(pedroBase);
  v.meta = {
    version: "Adecuacion visual",
    perfil: "Vision",
    sesion_sugerida: "pedro-paramo-nm3-vision-2026",
    uso_sugerido: ["3B-TP"]
  };
  v.accesibilidad = {
    fontScale: 1.3,
    lineHeight: 2,
    answerBoxMinHeight: 280,
    choicePaddingY: 20,
    cardPadding: 28
  };
  write('pedro_paramo_nm3_2026_vision.json', v);
})();

/* --- 2) LEVE --- */
(() => {
  const v = clone(pedroBase);
  v.meta = {
    version: "Adecuacion leve accesible",
    perfil: "Leve",
    sesion_sugerida: "pedro-paramo-nm3-leve-2026",
    uso_sugerido: ["3A-TP", "3B-TP"]
  };
  v.accesibilidad = {
    fontScale: 1.12,
    lineHeight: 1.85,
    answerBoxMinHeight: 240,
    choicePaddingY: 16,
    cardPadding: 24
  };
  write('pedro_paramo_nm3_2026_leve_accesible.json', v);
})();

/* --- 3) INTERMEDIA (disgrafia) --- */
(() => {
  const v = clone(pedroBase);
  v.meta = {
    version: "Adecuacion intermedia",
    perfil: "Disgrafia / Intermedia",
    sesion_sugerida: "pedro-paramo-nm3-intermedia-2026",
    uso_sugerido: ["3D-TP"]
  };
  v.accesibilidad = {
    fontScale: 1.16,
    lineHeight: 1.95,
    answerBoxMinHeight: 300,
    choicePaddingY: 18,
    cardPadding: 26
  };

  // Convert open-ended items to SM
  const replacements = {
    pedro_11: {
      tipo: "seleccion_multiple",
      enunciado: "¿De qué manera la contradicción entre lo que Dolores describe y lo que Juan encuentra al llegar a Comala constituye un recurso narrativo?",
      opciones: [
        {letra:"A", texto:"Crea un efecto de contraste entre la memoria idealizada y la realidad degradada del presente."},
        {letra:"B", texto:"Demuestra que Dolores mentía deliberadamente para engañar a Juan."},
        {letra:"C", texto:"Funciona como un dato histórico que documenta la geografía real de Comala."},
        {letra:"D", texto:"Sirve únicamente para explicar el clima del lugar y su cambio estacional."}
      ],
      correcta: "A",
      reformulacion_simple: "¿Para qué sirve el contraste entre la Comala de la madre y la que encuentra Juan?"
    },
    pedro_17: {
      tipo: "seleccion_multiple",
      enunciado: "¿Qué consecuencia tiene la frase «Me cruzaré de brazos y Comala se morirá de hambre» para la lectura del personaje de Pedro Páramo?",
      opciones: [
        {letra:"A", texto:"Revela que Pedro Páramo usa el poder económico como instrumento de castigo colectivo."},
        {letra:"B", texto:"Muestra que Pedro Páramo abandona la ambición por completo después de la muerte de Susana."},
        {letra:"C", texto:"Indica que Comala prospera gracias al desinterés del cacique."},
        {letra:"D", texto:"Prueba que Pedro Páramo solo tiene autoridad simbólica, sin poder real."}
      ],
      correcta: "A",
      reformulacion_simple: "¿Qué revela esa frase sobre el poder de Pedro Páramo?"
    },
    pedro_25: {
      tipo: "seleccion_multiple",
      enunciado: "¿Cuál de las siguientes opciones describe mejor la estructura narrativa de Pedro Páramo?",
      opciones: [
        {letra:"A", texto:"Una narración cronológica que avanza del pasado al presente sin interrupciones."},
        {letra:"B", texto:"Un montaje fragmentario de voces, tiempos y recuerdos donde no hay un orden lineal único."},
        {letra:"C", texto:"Un relato policial en el que Juan investiga la muerte de su padre."},
        {letra:"D", texto:"Un diario personal escrito por Pedro Páramo antes de morir."}
      ],
      correcta: "B",
      reformulacion_simple: "¿Cómo se organiza la narración de Pedro Páramo?"
    }
  };

  v.items = v.items.map(item => {
    if (replacements[item.id]) {
      const r = replacements[item.id];
      // Remove desarrollo/respuesta_corta specific fields
      delete item.criterios;
      delete item.puntaje;
      return { ...item, ...r };
    }
    return item;
  });

  write('pedro_paramo_nm3_2026_intermedia.json', v);
})();

/* --- 4) DIL FUERTE --- */
(() => {
  const v = {
    meta: {
      version: "Adecuacion DIL fuerte",
      perfil: "DIL / Fuerte",
      sesion_sugerida: "pedro-paramo-nm3-dil-2026",
      uso_sugerido: ["3A-TP", "3B-TP"]
    },
    accesibilidad: {
      fontScale: 1.18,
      lineHeight: 1.95,
      answerBoxMinHeight: 240,
      choicePaddingY: 18,
      cardPadding: 26
    },
    materiales: [
      {
        id: "pedro_dil_m1",
        tipo: "Apoyo simple",
        titulo: "Juan llega a Comala",
        descripcion: "Lee este apoyo antes de responder los ítems 1 al 3.",
        parrafos: [
          "Juan Preciado viaja a Comala porque su madre, antes de morir, le pidió que buscara a su padre: Pedro Páramo.",
          "En el camino, un hombre llamado Abundio lo acompaña y le da información sobre el pueblo.",
          "Cuando Juan llega, Comala está vacío y silencioso. Las casas están abandonadas. El pueblo que su madre describía con cariño ahora parece un lugar muerto."
        ]
      },
      {
        id: "pedro_dil_m2",
        tipo: "Apoyo simple",
        titulo: "Los murmullos y las voces",
        descripcion: "Lee este apoyo antes de responder los ítems 4 al 6.",
        parrafos: [
          "En Comala, Juan empieza a escuchar voces extrañas: ecos, risas viejas, pasos que no son de nadie.",
          "Eduviges lo recibe y lo sorprende diciendo que su madre «ya murió». Juan no entiende cómo ella lo sabe.",
          "Poco a poco, Juan descubre que en Comala los vivos y los muertos conviven. Las voces que escucha pertenecen a personas que ya no están."
        ]
      },
      {
        id: "pedro_dil_m3",
        tipo: "Apoyo simple",
        titulo: "Pedro Páramo: el poder y Susana",
        descripcion: "Lee este apoyo antes de responder los ítems 7 al 10.",
        parrafos: [
          "Pedro Páramo es el dueño de todas las tierras de Comala. Nadie puede oponerse a él.",
          "Desde joven, Pedro amó a Susana San Juan. Esperó 30 años para tenerla cerca. Pero cuando Susana volvió, estaba perdida en sus propios recuerdos y no pudo corresponderle.",
          "Cuando Susana murió, Pedro se vengó del pueblo entero: dejó de trabajar sus tierras y Comala murió de hambre."
        ]
      },
      {
        id: "pedro_dil_m4",
        tipo: "Apoyo simple",
        titulo: "El padre Rentería y la culpa",
        descripcion: "Lee este apoyo antes de responder los ítems 11 al 12.",
        parrafos: [
          "El padre Rentería es el sacerdote de Comala. Sabe que Pedro Páramo hace daño, pero no lo enfrenta porque depende de su dinero.",
          "El cura siente culpa por no defender a los pobres del pueblo. Se pregunta si Dios lo perdonará."
        ]
      },
      {
        id: "pedro_dil_m5",
        tipo: "Apoyo simple",
        titulo: "Vocabulario",
        descripcion: "Responde los ítems 13 y 14.",
        parrafos: [
          "Canícula: época del año con mucho calor. En la novela dice que Juan caminaba «en la canícula de agosto».",
          "Desportilladas: rotas, con partes faltantes. Se usa para describir las puertas viejas de las casas de Comala."
        ]
      }
    ],
    items: [
      {
        id: "pedro_dil_01",
        materialRef: "pedro_dil_m1",
        habilidad: "Localizar",
        tipo: "seleccion_multiple",
        enunciado: "¿Por qué Juan Preciado viaja a Comala?",
        opciones: [
          {letra:"A", texto:"Porque quiere conocer un pueblo turístico."},
          {letra:"B", texto:"Porque su madre le pidió que buscara a Pedro Páramo."},
          {letra:"C", texto:"Porque necesita trabajo en el campo."},
          {letra:"D", texto:"Porque Abundio lo invitó a vivir allí."}
        ],
        correcta: "B",
        reformulacion_simple: "¿Por qué Juan va a Comala?"
      },
      {
        id: "pedro_dil_02",
        materialRef: "pedro_dil_m1",
        habilidad: "Localizar",
        tipo: "seleccion_multiple",
        enunciado: "¿Cómo encuentra Juan el pueblo de Comala cuando llega?",
        opciones: [
          {letra:"A", texto:"Lleno de gente y con fiestas."},
          {letra:"B", texto:"Vacío, silencioso y con casas abandonadas."},
          {letra:"C", texto:"Con muchos animales y cultivos."},
          {letra:"D", texto:"Igual a como lo describía su madre."}
        ],
        correcta: "B",
        reformulacion_simple: "¿Cómo está Comala cuando Juan llega?"
      },
      {
        id: "pedro_dil_03",
        materialRef: "pedro_dil_m1",
        habilidad: "Interpretar",
        tipo: "seleccion_multiple",
        enunciado: "La madre de Juan recordaba Comala como un lugar bonito. ¿Qué diferencia hay entre su recuerdo y la realidad?",
        opciones: [
          {letra:"A", texto:"No hay diferencia: el pueblo sigue igual."},
          {letra:"B", texto:"La madre recordaba un lugar lleno de vida, pero Juan encuentra un pueblo abandonado."},
          {letra:"C", texto:"La madre nunca conoció Comala."},
          {letra:"D", texto:"Juan llega a un pueblo diferente al que buscaba."}
        ],
        correcta: "B",
        reformulacion_simple: "¿En qué se diferencia el Comala de la madre y el Comala real?"
      },
      {
        id: "pedro_dil_04",
        materialRef: "pedro_dil_m2",
        habilidad: "Localizar",
        tipo: "seleccion_multiple",
        enunciado: "¿Qué cosas extrañas escucha Juan en Comala?",
        opciones: [
          {letra:"A", texto:"Música de fiesta y campanas."},
          {letra:"B", texto:"Ecos, risas viejas y pasos que no son de nadie."},
          {letra:"C", texto:"Animales en las calles."},
          {letra:"D", texto:"Gritos de ayuda de personas atrapadas."}
        ],
        correcta: "B",
        reformulacion_simple: "¿Qué sonidos raros oye Juan?"
      },
      {
        id: "pedro_dil_05",
        materialRef: "pedro_dil_m2",
        habilidad: "Interpretar",
        tipo: "seleccion_multiple",
        enunciado: "¿Por qué es extraño que Eduviges sepa que la madre de Juan ya murió?",
        opciones: [
          {letra:"A", texto:"Porque Juan acaba de llegar y nadie debería saberlo."},
          {letra:"B", texto:"Porque Eduviges y la madre eran vecinas."},
          {letra:"C", texto:"Porque en Comala todos leen el periódico."},
          {letra:"D", texto:"Porque Juan ya se lo había contado antes."}
        ],
        correcta: "A",
        reformulacion_simple: "¿Por qué sorprende que Eduviges sepa eso?"
      },
      {
        id: "pedro_dil_06",
        materialRef: "pedro_dil_m2",
        habilidad: "Interpretar",
        tipo: "seleccion_multiple",
        enunciado: "¿Qué descubre Juan sobre Comala?",
        opciones: [
          {letra:"A", texto:"Que es un pueblo normal donde la gente vive tranquila."},
          {letra:"B", texto:"Que los vivos y los muertos conviven en el mismo espacio."},
          {letra:"C", texto:"Que solo viven ancianos que recuerdan a Pedro Páramo."},
          {letra:"D", texto:"Que las voces son un efecto del viento del desierto."}
        ],
        correcta: "B",
        reformulacion_simple: "¿Qué tiene de especial Comala?"
      },
      {
        id: "pedro_dil_07",
        materialRef: "pedro_dil_m3",
        habilidad: "Localizar",
        tipo: "seleccion_multiple",
        enunciado: "¿Quién es el dueño de las tierras de Comala?",
        opciones: [
          {letra:"A", texto:"Juan Preciado."},
          {letra:"B", texto:"El padre Rentería."},
          {letra:"C", texto:"Pedro Páramo."},
          {letra:"D", texto:"Abundio."}
        ],
        correcta: "C",
        reformulacion_simple: "¿Quién manda en Comala?"
      },
      {
        id: "pedro_dil_08",
        materialRef: "pedro_dil_m3",
        habilidad: "Interpretar",
        tipo: "seleccion_multiple",
        enunciado: "¿Por qué Pedro Páramo deja de trabajar sus tierras?",
        opciones: [
          {letra:"A", texto:"Porque se cansa de ser dueño de todo."},
          {letra:"B", texto:"Porque quiere castigar a Comala tras la muerte de Susana."},
          {letra:"C", texto:"Porque la tierra ya no produce nada."},
          {letra:"D", texto:"Porque decide mudarse a otra ciudad."}
        ],
        correcta: "B",
        reformulacion_simple: "¿Por qué Pedro abandona sus tierras?"
      },
      {
        id: "pedro_dil_09",
        materialRef: "pedro_dil_m3",
        habilidad: "Interpretar",
        tipo: "pareados",
        enunciado: "Une cada personaje con lo que hace en la historia.",
        izquierda: [
          {id:"juan", texto:"Juan Preciado"},
          {id:"pedro", texto:"Pedro Páramo"},
          {id:"susana", texto:"Susana San Juan"}
        ],
        derecha: [
          {id:"busca", texto:"Viaja a Comala buscando a su padre"},
          {id:"castiga", texto:"Controla las tierras y castiga al pueblo"},
          {id:"perdida", texto:"Está perdida en sus propios recuerdos"}
        ],
        correcta: {
          juan: "busca",
          pedro: "castiga",
          susana: "perdida"
        },
        reformulacion_simple: "Une cada personaje con su acción."
      },
      {
        id: "pedro_dil_10",
        materialRef: "pedro_dil_m3",
        habilidad: "Interpretar",
        tipo: "ordenamiento",
        enunciado: "Ordena estos hechos de la historia.",
        elementos: [
          {id:"promesa", texto:"La madre de Juan le pide que busque a Pedro Páramo"},
          {id:"viaje", texto:"Juan viaja a Comala y la encuentra vacía"},
          {id:"murmullos", texto:"Juan escucha voces y ecos de muertos"},
          {id:"muerte_comala", texto:"Pedro Páramo abandona las tierras y Comala muere de hambre"}
        ],
        correcta: ["promesa", "viaje", "murmullos", "muerte_comala"],
        reformulacion_simple: "Pon estos hechos en orden."
      },
      {
        id: "pedro_dil_11",
        materialRef: "pedro_dil_m4",
        habilidad: "Interpretar",
        tipo: "seleccion_multiple",
        enunciado: "¿Por qué el padre Rentería no enfrenta a Pedro Páramo?",
        opciones: [
          {letra:"A", texto:"Porque le tiene miedo físico."},
          {letra:"B", texto:"Porque depende del dinero que Pedro le da."},
          {letra:"C", texto:"Porque está de acuerdo con todo lo que Pedro hace."},
          {letra:"D", texto:"Porque no sabe lo que Pedro hace."}
        ],
        correcta: "B",
        reformulacion_simple: "¿Por qué el cura no se opone a Pedro?"
      },
      {
        id: "pedro_dil_12",
        materialRef: "pedro_dil_m4",
        habilidad: "Evaluar",
        tipo: "seleccion_multiple",
        enunciado: "¿Qué siente el padre Rentería por no defender a los pobres?",
        opciones: [
          {letra:"A", texto:"Orgullo, porque piensa que hizo lo correcto."},
          {letra:"B", texto:"Indiferencia, porque no le importa el pueblo."},
          {letra:"C", texto:"Culpa, porque sabe que traicionó a quienes confiaban en él."},
          {letra:"D", texto:"Alegría, porque Pedro Páramo le da protección."}
        ],
        correcta: "C",
        reformulacion_simple: "¿Cómo se siente el cura?"
      },
      {
        id: "pedro_dil_13",
        materialRef: "pedro_dil_m5",
        habilidad: "Localizar",
        tipo: "seleccion_multiple",
        enunciado: "¿Qué significa 'canícula'?",
        opciones: [
          {letra:"A", texto:"Un tipo de animal del desierto."},
          {letra:"B", texto:"La época del año con mucho calor."},
          {letra:"C", texto:"Un camino estrecho entre montañas."},
          {letra:"D", texto:"Una fiesta tradicional del pueblo."}
        ],
        correcta: "B",
        puntaje: 1,
        reformulacion_simple: "¿Qué quiere decir 'canícula'?"
      },
      {
        id: "pedro_dil_14",
        materialRef: "pedro_dil_m5",
        habilidad: "Localizar",
        tipo: "seleccion_multiple",
        enunciado: "¿Qué significa 'desportilladas'?",
        opciones: [
          {letra:"A", texto:"Pintadas de colores brillantes."},
          {letra:"B", texto:"Cerradas con llave por seguridad."},
          {letra:"C", texto:"Rotas, con partes faltantes."},
          {letra:"D", texto:"Recién construidas y nuevas."}
        ],
        correcta: "C",
        puntaje: 1,
        reformulacion_simple: "¿Qué quiere decir 'desportilladas'?"
      }
    ]
  };
  write('pedro_paramo_nm3_2026_dil_fuerte.json', v);
})();

/* ═══════════════════════════════════════════════
   MAUS VARIANTS
   ═══════════════════════════════════════════════ */
const mausBase = read('maus_nm4_2026_base.json');

/* --- 5) MAUS INTERMEDIA --- */
(() => {
  const v = clone(mausBase);
  v.meta = {
    version: "Adecuacion intermedia",
    perfil: "Intermedia",
    sesion_sugerida: "maus-nm4-intermedia-2026",
    uso_sugerido: ["4A-TP", "4B-TP"]
  };
  v.accesibilidad = {
    fontScale: 1.16,
    lineHeight: 1.92,
    answerBoxMinHeight: 300,
    choicePaddingY: 18,
    cardPadding: 26
  };

  // Convert open-ended items to SM
  const replacements = {
    maus_14: {
      tipo: "seleccion_multiple",
      enunciado: "¿Qué sucede cuando el cómic muestra personajes con máscaras que contradicen su especie?",
      opciones: [
        {letra:"A", texto:"El cómic pierde coherencia visual y confunde al lector sin propósito."},
        {letra:"B", texto:"El cómic pone en crisis sus propias categorías, mostrando que la identidad no es natural ni fija."},
        {letra:"C", texto:"El cómic confirma que las categorías animales son completamente estables y permanentes."},
        {letra:"D", texto:"El cómic cambia de género: pasa de ser novela gráfica a ser ensayo filosófico."}
      ],
      correcta: "B",
      reformulacion_simple: "¿Qué pasa con la metáfora animal cuando aparecen las máscaras?"
    },
    maus_20: {
      tipo: "seleccion_multiple",
      enunciado: "¿Cuál de las siguientes opciones evalúa mejor a Vladek como narrador del pasado?",
      opciones: [
        {letra:"A", texto:"Vladek es totalmente confiable porque vivió los hechos y los recuerda con exactitud."},
        {letra:"B", texto:"Vladek es la fuente central del relato, pero su testimonio tiene vacíos, sesgos y es filtrado por Art."},
        {letra:"C", texto:"Vladek inventa la mayor parte de su historia para ganar la simpatía del lector."},
        {letra:"D", texto:"Vladek es un narrador secundario, ya que Art es quien realmente construye todo el relato."}
      ],
      correcta: "B",
      reformulacion_simple: "¿Qué aporta y qué limita a Vladek como narrador?"
    },
    maus_26: {
      tipo: "seleccion_multiple",
      enunciado: "¿Cuál de las siguientes tesis sobre Maus integra mejor los conceptos de herencia, trauma y relato?",
      opciones: [
        {letra:"A", texto:"Maus muestra que el trauma se transmite entre generaciones y que el relato familiar revela tanto la historia como sus vacíos."},
        {letra:"B", texto:"Maus demuestra que el trauma solo afecta a quienes lo vivieron directamente y no se hereda."},
        {letra:"C", texto:"Maus prueba que un buen relato puede eliminar completamente la herencia del trauma."},
        {letra:"D", texto:"Maus ilustra que la herencia familiar es un tema exclusivamente biológico, sin relación con la memoria."}
      ],
      correcta: "A",
      reformulacion_simple: "¿Qué tesis sobre Maus une memoria, trauma y familia?"
    }
  };

  v.items = v.items.map(item => {
    if (replacements[item.id]) {
      const r = replacements[item.id];
      delete item.criterios;
      delete item.puntaje;
      return { ...item, ...r };
    }
    return item;
  });

  write('maus_nm4_2026_intermedia.json', v);
})();

/* --- 6) MAUS DIL FUERTE --- */
(() => {
  const v = {
    meta: {
      version: "Adecuacion DIL fuerte",
      perfil: "DIL / Fuerte",
      sesion_sugerida: "maus-nm4-dil-2026",
      uso_sugerido: ["4A-TP", "4D-TP", "4E-TP"]
    },
    accesibilidad: {
      fontScale: 1.18,
      lineHeight: 1.95,
      answerBoxMinHeight: 240,
      choicePaddingY: 18,
      cardPadding: 26
    },
    materiales: [
      {
        id: "maus_dil_m1",
        tipo: "Apoyo simple",
        titulo: "Art escucha a Vladek",
        descripcion: "Lee este apoyo antes de responder los ítems 1 al 3.",
        parrafos: [
          "En Maus, Art visita a su padre Vladek muchos años después de la guerra. Art graba las conversaciones para hacer un cómic.",
          "Vladek habla de lo que vivió durante el Holocausto, pero a veces se interrumpe para quejarse de su vida actual.",
          "El lector conoce el pasado a través de lo que Vladek recuerda y Art pregunta. El relato no llega completo: tiene huecos y silencios."
        ]
      },
      {
        id: "maus_dil_m2",
        tipo: "Apoyo simple",
        titulo: "La persecución paso a paso",
        descripcion: "Lee este apoyo antes de responder los ítems 4 al 6.",
        parrafos: [
          "La persecución contra los judíos no fue de un solo golpe. Primero les cerraron los negocios, luego los obligaron a usar una estrella, después los encerraron en guetos.",
          "La familia de Vladek fue enviada al gueto de Srodula. Allí se escondieron detrás de una pared de zapatos.",
          "En una selección, Vladek y Anja fueron separados. No sabían si volverían a verse. Los nazis (gatos) aparecen enormes y los judíos (ratones) muy pequeños."
        ]
      },
      {
        id: "maus_dil_m3",
        tipo: "Apoyo simple",
        titulo: "Los animales y las máscaras",
        descripcion: "Lee este apoyo antes de responder los ítems 7 al 9.",
        parrafos: [
          "En Maus, los judíos son ratones, los nazis son gatos, los polacos son cerdos y los estadounidenses son perros. Esto muestra cómo la persecución clasifica a las personas en grupos fijos.",
          "Pero a veces los personajes usan máscaras: Vladek se disfraza de cerdo (polaco) para escapar. Art se dibuja con máscara de ratón sobre un rostro humano.",
          "Las máscaras muestran que la identidad no es fija: se puede disfrazar, pero también descubrir."
        ]
      },
      {
        id: "maus_dil_m4",
        tipo: "Apoyo simple",
        titulo: "Los diarios de Anja",
        descripcion: "Lee este apoyo antes de responder los ítems 10 al 12.",
        parrafos: [
          "Anja, la madre de Art, sobrevivió a la guerra pero se suicidó en 1968. Ella había escrito diarios sobre su experiencia.",
          "Art quería usar los diarios en el cómic, pero Vladek los destruyó después de la muerte de Anja.",
          "Art le gritó «¡Asesino!» a su padre. Sin los diarios, la voz de Anja desapareció para siempre."
        ]
      }
    ],
    items: [
      {
        id: "maus_dil_01",
        materialRef: "maus_dil_m1",
        habilidad: "Localizar",
        tipo: "seleccion_multiple",
        enunciado: "¿Qué hace Art cuando visita a Vladek?",
        opciones: [
          {letra:"A", texto:"Le lleva medicinas y lo cuida."},
          {letra:"B", texto:"Graba las conversaciones para hacer un cómic."},
          {letra:"C", texto:"Lo ayuda a mudarse a otro país."},
          {letra:"D", texto:"Le muestra fotografías de la guerra."}
        ],
        correcta: "B",
        reformulacion_simple: "¿Para qué visita Art a su papá?"
      },
      {
        id: "maus_dil_02",
        materialRef: "maus_dil_m1",
        habilidad: "Interpretar",
        tipo: "seleccion_multiple",
        enunciado: "¿Por qué el relato de Vladek tiene huecos y silencios?",
        opciones: [
          {letra:"A", texto:"Porque Vladek no quiere hablar con Art."},
          {letra:"B", texto:"Porque la memoria no es perfecta y el recuerdo se interrumpe con problemas del presente."},
          {letra:"C", texto:"Porque Art borra las partes que no le gustan."},
          {letra:"D", texto:"Porque la grabadora se apaga frecuentemente."}
        ],
        correcta: "B",
        reformulacion_simple: "¿Por qué la historia no llega completa?"
      },
      {
        id: "maus_dil_03",
        materialRef: "maus_dil_m1",
        habilidad: "Localizar",
        tipo: "verdadero_falso",
        enunciado: "Vladek nunca interrumpe su relato del Holocausto.",
        correcta: "F",
        reformulacion_simple: "¿Es verdad que Vladek cuenta todo sin interrumpirse?"
      },
      {
        id: "maus_dil_04",
        materialRef: "maus_dil_m2",
        habilidad: "Interpretar",
        tipo: "ordenamiento",
        enunciado: "Ordena las etapas de la persecución.",
        elementos: [
          {id:"negocios", texto:"Les cierran los negocios a los judíos"},
          {id:"estrella", texto:"Los obligan a usar una estrella"},
          {id:"gueto", texto:"Los encierran en guetos"},
          {id:"separacion", texto:"Vladek y Anja son separados en una selección"}
        ],
        correcta: ["negocios", "estrella", "gueto", "separacion"],
        reformulacion_simple: "Pon en orden las etapas de la persecución."
      },
      {
        id: "maus_dil_05",
        materialRef: "maus_dil_m2",
        habilidad: "Interpretar",
        tipo: "seleccion_multiple",
        enunciado: "¿Qué muestra el dibujo donde los gatos son enormes y los ratones pequeños?",
        opciones: [
          {letra:"A", texto:"Que los nazis tenían más fuerza física."},
          {letra:"B", texto:"Que había una desigualdad enorme de poder entre perseguidores y perseguidos."},
          {letra:"C", texto:"Que el dibujo tiene un error de proporción."},
          {letra:"D", texto:"Que los ratones eran niños y los gatos adultos."}
        ],
        correcta: "B",
        reformulacion_simple: "¿Qué significa que los gatos sean grandes y los ratones chicos?"
      },
      {
        id: "maus_dil_06",
        materialRef: "maus_dil_m2",
        habilidad: "Localizar",
        tipo: "seleccion_multiple",
        enunciado: "¿Dónde se escondió la familia de Vladek en el gueto?",
        opciones: [
          {letra:"A", texto:"En un sótano debajo de la iglesia."},
          {letra:"B", texto:"Detrás de una pared de zapatos amontonados."},
          {letra:"C", texto:"En el techo de una fábrica abandonada."},
          {letra:"D", texto:"Dentro de un camión de reparto."}
        ],
        correcta: "B",
        reformulacion_simple: "¿Dónde se escondieron?"
      },
      {
        id: "maus_dil_07",
        materialRef: "maus_dil_m3",
        habilidad: "Localizar",
        tipo: "pareados",
        enunciado: "Une cada animal con el grupo que representa.",
        izquierda: [
          {id:"raton", texto:"Ratón"},
          {id:"gato", texto:"Gato"},
          {id:"cerdo", texto:"Cerdo"}
        ],
        derecha: [
          {id:"judio", texto:"Judíos"},
          {id:"nazi", texto:"Nazis"},
          {id:"polaco", texto:"Polacos"}
        ],
        correcta: {
          raton: "judio",
          gato: "nazi",
          cerdo: "polaco"
        },
        reformulacion_simple: "Une cada animal con el grupo que representa."
      },
      {
        id: "maus_dil_08",
        materialRef: "maus_dil_m3",
        habilidad: "Interpretar",
        tipo: "seleccion_multiple",
        enunciado: "¿Por qué Vladek se disfraza de cerdo en la historia?",
        opciones: [
          {letra:"A", texto:"Porque le gusta disfrazarse."},
          {letra:"B", texto:"Para pasar como polaco y escapar de los nazis."},
          {letra:"C", texto:"Porque quiere ser amigo de los polacos."},
          {letra:"D", texto:"Porque los ratones y cerdos son iguales en la obra."}
        ],
        correcta: "B",
        reformulacion_simple: "¿Para qué se disfraza Vladek de cerdo?"
      },
      {
        id: "maus_dil_09",
        materialRef: "maus_dil_m3",
        habilidad: "Interpretar",
        tipo: "seleccion_multiple",
        enunciado: "¿Qué muestran las máscaras en Maus?",
        opciones: [
          {letra:"A", texto:"Que los personajes quieren ser de otra especie para siempre."},
          {letra:"B", texto:"Que la identidad se puede disfrazar, pero también descubrir."},
          {letra:"C", texto:"Que el autor se equivocó al dibujar a los personajes."},
          {letra:"D", texto:"Que todos los personajes son en realidad humanos disfrazados."}
        ],
        correcta: "B",
        reformulacion_simple: "¿Qué significan las máscaras?"
      },
      {
        id: "maus_dil_10",
        materialRef: "maus_dil_m4",
        habilidad: "Localizar",
        tipo: "seleccion_multiple",
        enunciado: "¿Qué pasó con los diarios que Anja escribió sobre la guerra?",
        opciones: [
          {letra:"A", texto:"Art los publicó en un libro aparte."},
          {letra:"B", texto:"Se perdieron durante la mudanza."},
          {letra:"C", texto:"Vladek los destruyó después de la muerte de Anja."},
          {letra:"D", texto:"Anja los quemó antes de morir."}
        ],
        correcta: "C",
        reformulacion_simple: "¿Qué pasó con los diarios?"
      },
      {
        id: "maus_dil_11",
        materialRef: "maus_dil_m4",
        habilidad: "Interpretar",
        tipo: "seleccion_multiple",
        enunciado: "¿Por qué Art le grita «¡Asesino!» a su padre?",
        opciones: [
          {letra:"A", texto:"Porque Vladek lo golpeó."},
          {letra:"B", texto:"Porque al destruir los diarios, destruyó la voz de Anja para siempre."},
          {letra:"C", texto:"Porque Vladek no quiere contar su historia."},
          {letra:"D", texto:"Porque quiere asustar a Vladek para que hable más."}
        ],
        correcta: "B",
        reformulacion_simple: "¿Por qué Art le dice asesino a Vladek?"
      },
      {
        id: "maus_dil_12",
        materialRef: "maus_dil_m4",
        habilidad: "Evaluar",
        tipo: "seleccion_multiple",
        enunciado: "¿Por qué es tan importante que los diarios de Anja ya no existan?",
        opciones: [
          {letra:"A", texto:"Porque eran muy caros y valiosos."},
          {letra:"B", texto:"Porque sin ellos, solo conocemos la historia a través de Vladek y nunca sabremos la versión de Anja."},
          {letra:"C", texto:"Porque Art necesitaba copiarlos para el cómic."},
          {letra:"D", texto:"Porque contenían un mapa del tesoro."}
        ],
        correcta: "B",
        reformulacion_simple: "¿Por qué importa que ya no existan los diarios?"
      }
    ]
  };
  write('maus_nm4_2026_dil_fuerte.json', v);
})();

console.log('\nAll 6 variants generated successfully.');
