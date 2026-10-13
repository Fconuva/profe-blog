'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const {exams,publicExam}=require('../../api/_simce-u4-catalog');
const dir=__dirname, inverse=JSON.parse(fs.readFileSync(path.join(dir,'INGENIERIA_INVERSA.json'),'utf8'));
const lexical=t=>(t.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)||[]);
const cell=t=>'"'+String(t??'').replaceAll('"','""')+'"';
const csv=(name,rows)=>fs.writeFileSync(path.join(dir,name),'\ufeff'+rows.map(r=>r.map(cell).join(',')).join('\n')+'\n');
const textJudgments=[
 ['media','media','baja','media','Narración cronológica con cambio de juicio, metáfora de la llave y acceso restringido al padre.','La explicación de hacerse responsable queda sugerida por acciones; la contraposición se quebró/lo quebré facilita q3.'],
 ['media','media','baja','media','Tesis, ejemplo, objeción, concesión y propuesta; contrasta presente y futuro.','La postura y varios límites se declaran repetidamente: longitud de 541 palabras no vuelve implícitas las respuestas.'],
 ['media','media','media','media','Tres párrafos más tabla, horarios y dos variables; diferencia entradas/personas y eventos.','Breve pero exige reconocer límites del registro; la tabla tiene apoyos fuertes. Es discontinuo real, no infografía IA.'],
 ['alta','alta','alta','alta','Hipérbaton, sintaxis encadenada, metáforas de estaciones y edad; cuartetos y tercetos.','Glosario reduce obstáculos de cuatro voces; no da el significado de primavera ni nieve. No pedir conocimientos históricos o métrica para resolver estos ítems.'],
 ['media','media','media','media','Noticia con fechas múltiples, fuentes y distinción entre dato, testimonio y valoración.','Metacomentarios explican identidad y límites; algunas respuestas pueden recuperarse de una sola frase.'],
 ['media','media','media','alta','Crónica en primera persona; expectativa frustrada y revisión de la mirada, recuerdos y metáfora.','Vínculos dispersos sostienen interpretación global; otras expresiones se explican en el mismo párrafo.'],
 ['media','alta','media','alta','Contexto, personajes, acotaciones y diálogo de posiciones enfrentadas; deber y autoridad.','La recreación tiene léxico más actual y razones más declaradas que Macbeth. q3 y q4 no tienen su misma demanda implícita.'],
 ['media','media','media','media','Reportaje con conteos, caso concreto, voces y límite técnico.','El caso de la lámpara y el aprendizaje no medido están explicados; recursos y sentido global mantienen mayor demanda.'],
 ['media','media','baja','media','Discurso con convocatoria, objeción, concesión, propuesta y pregunta retórica.','El propio discurso explica la generalización inválida antes de q18: esa pregunta no descubre la falla.'],
 ['media','alta','baja','alta','Relato con recuerdo insertado, mito aludido, objeto simbólico y prejuicio sobre origen.','El narrador explica el estereotipo, pero significado del hilo y cambio de actitud requieren conectar escenas.'],
 ['media','media','baja','media','Carta con horarios competidores, experiencia, concesión y propuesta; imagen de puerta.','Los límites del mapa y la interpretación de la puerta están fuertemente apoyados por frases próximas.'],
 ['media','alta','media','alta','Ensayo con ironía, analogía de cocina, objeción y crítica de un indicador.','La ironía necesita contraste; la tesis se declara varias veces. Comparación con cuento transfiere el criterio a otro género.'],
 ['media','alta','media','alta','Poema con alternancia, paralelismo, hipérbaton, metáforas y contraste entre ciclo y singularidad.','El glosario aclara absorto; reverencia tiene claves potentes. Brevedad no equivale a baja complejidad conceptual.'],
 ['media','media','media','media','Artículo con proceso condicional, ensayo controlado y diferencia función/intención.','Transportistas y límites de brotes se explican directamente. El supuesto diagrama es una tabla verbal, no una imagen.'],
 ['media','media','baja','alta','Afiche transcrito más publicación, cuatro comentarios, respuesta y aviso.','La imagen se describe verbalmente: q16 no prueba lectura visual auténtica. Falacia del primer comentario sí debe identificarse.']
];
const metrics=[],items=[],counts={},changes=[];let ti=0;
const itemRows=[['miniensayo','item','texto','eje_actual','eje_anterior_si_cambio','descriptor_editorial','nivel_demanda_prevista','tipo_informacion','ubicacion_pistas','competencia_ideas','fundamento_individual','paginas_impresas_estandares','clave','evidencia','enunciado_palabras','A_palabras','B_palabras','C_palabras','D_palabras','ratio_clave_mayor_distractor','limite']];
for(const e of exams){const c={};for(const t of e.texts){
 const content=t.paragraphs.join(' '),sentences=content.split(/[.!?…]+(?:[»”"])?\s+/u).filter(s=>lexical(s).length),lens=sentences.map(s=>lexical(s).length),j=textJudgments[ti++];
 const tableText=t.table?[t.table.caption,...t.table.headers,...t.table.rows.flat()].join(' '):'';
 const totalReading=lexical(content+' '+tableText).length;
 metrics.push({exam:e.number,title:t.title,genre:t.genre,paragraph_words_whitespace:content.trim().split(/\s+/u).length,paragraph_words_lexical:lexical(content).length,table_words_lexical:lexical(tableText).length,total_reading_words_lexical:totalReading,sentences_approx:sentences.length,mean_sentence_words:Math.round(lens.reduce((a,b)=>a+b,0)/lens.length*10)/10,max_sentence_words:Math.max(...lens),sentences_over_30:lens.filter(n=>n>30).length,subordination_markers:(content.match(/\b(?:que|aunque|cuando|porque|si|mientras|donde|cuyo|cuya)\b/giu)||[]).length,syntax:j[0],abstraction:j[1],vocabulary:j[2],structure:j[3],judgment:j[4],limitation:j[5],raster_images:0,measurement_note:'Marcadores no son un análisis sintáctico; oraciones son aproximación. Poema segmentado por puntuación, no por verso. Bandas de complejidad son juicio editorial, no niveles oficiales.'});
 for(const q of t.questions){const a=q.demandAudit,k='ABCD'.indexOf(q.key),ns=q.options.map(o=>lexical(o).length),ratio=ns[k]/Math.max(...ns.filter((_,i)=>i!==k));
  assert.ok(a.rationale.length>90);assert.equal(q.skill,a.assessedSkill);assert.ok(!JSON.stringify(publicExam(e.number)).includes('demandAudit'));
  counts[a.level]=(counts[a.level]||0)+1;c[a.level]=(c[a.level]||0)+1;
  const item={exam:e.number,id:q.id,title:t.title,...a,skill:q.skill,previousSkill:q.previousSkill||null,key:q.key,evidence:q.evidence,promptWords:lexical(q.prompt).length,optionWords:ns,keyLengthRatio:Math.round(ratio*100)/100};items.push(item);
  if(q.previousSkill)changes.push(`E${e.number} ${q.id}: ${q.previousSkill} → ${q.skill}`);
  itemRows.push([e.number,q.id,t.title,q.skill,q.previousSkill,a.descriptor,a.level,a.support,a.distance,a.competition,a.rationale,a.sourcePages,q.key,q.evidence,lexical(q.prompt).length,...ns,ratio.toFixed(2),a.calibration]);
 }}e.auditedDemandCounts=c;}
assert.equal(items.length,90);assert.equal(metrics.length,15);assert.equal(inverse.page_inventory.length,56);
csv('AUDITORIA_90_PREGUNTAS.csv',itemRows);
csv('DIFICULTAD_15_TEXTOS.csv',[Object.keys(metrics[0]),...metrics.map(m=>Object.values(m))]);
const families=[
 ['L','Localizar información explícita','apoyos para localizar o sin información similar','sin apoyos o discriminando información similar','47'],
 ['T','Establecer tema, conflicto, propósito o postura','claves evidentes o sin ideas que compiten','integrando implícitos o discriminando ideas que compiten','47'],
 ['I','Realizar inferencias','información próxima o situación familiar','integrar o relacionar información cuando compiten ideas','48'],
 ['C','Inferir causa y consecuencia','información próxima','discriminación entre ideas que compiten','48'],
 ['M','Inferir sentimientos, intenciones o motivaciones','tema o situación familiar','integración de información dispersa','48'],
 ['P','Inferir características de personaje','tema o situación familiar','discriminación entre ideas que compiten','48'],
 ['S','Determinar estereotipos','tema o situación familiar','discriminación entre ideas que compiten','48'],
 ['H','Determinar problema humano','tema o situación familiar','discriminación entre ideas que compiten','48'],
 ['F','Interpretar lenguaje figurado','expresión/situación familiar o claves evidentes','expresión o situación poco familiar','48'],
 ['V','Evaluar y fundamentar','información puntual o conocimientos pertinentes','información referida al sentido global','49'],
 ['R','Determinar propósito o efecto de recursos','recursos y usos familiares','vínculo con la información del texto, incluyendo recursos como preguntas retóricas o ejemplificaciones','49']
];
const requirements=[];
for(const band of ['E','A'])for(const [op,action,elemental,adequate,page]of families){
 const found=items.filter(i=>i.descriptor===`${band}-${op}` || (op==='I' && i.descriptor.startsWith(band+'-') && ['C','M','P','S','H'].includes(i.descriptor.split('-')[1])));
 let strength=found.length?'directa':'ausente',note=found.length?'Presencia de tareas con las condiciones descritas; no demuestra logro del estudiante.':'No hay ítem con esta operación y condiciones de este nivel.';
 if(op==='V' && found.length){strength='parcial';note='Las alternativas permiten reconocer el juicio respaldado; no producir su fundamentación. Complementar con respuesta redactada y revisión docente.';}
 requirements.push({id:`${band}-${op}`,level:band==='E'?'Elemental':'Adecuado',descriptor:`${action}: ${band==='E'?elemental:adequate}.`,printedPages:`15–16 y ${page}`,items:found.map(i=>`E${i.exam} ${i.id}`).join('; '),strength,note});
}
const falls=items.filter(i=>i.descriptor==='A-X');requirements.push({id:'A-X',level:'Adecuado',descriptor:'Identificar fallas evidentes de argumentación.',printedPages:'16 y 49',items:falls.map(i=>`E${i.exam} ${i.id}`).join('; '),strength:'directa',note:'Se exige descubrir el salto de una muestra limitada a una conclusión general; E3 q18 no cuenta aquí porque el estímulo ya explica el error.'});
const ec=[
 ['L','Extraer información en estructuras, organización y sintaxis novedosas o complejas, sin ayudas o con datos similares.','ausente','No hay localización en una estructura novedosa comparable; distinguir fechas o variables no basta.'],
 ['T','Establecer tema/conflicto/propósito/postura entre varios que compiten o contradicen las expectativas del lector.','parcial','E1 q4 y E5 q2/q4 exigen sentido global, pero no varios conflictos principales igualmente plausibles o contrarios a expectativas.'],
 ['I','Inferencias complejas con contenido difícil de localizar o inferir, o integrando dos o más textos con ideas que compiten: expectativas, estados de ánimo poco familiares, actitudes, atmósfera o conclusiones globales.','parcial','E4 q17 compara dos textos, pero ofrece la abstracción como alternativa; no cubre todas las condiciones ni atmósfera o estados de ánimo poco familiares.'],
 ['F','Interpretar lenguaje figurado poco familiar desde el sentido global.','parcial','E2 q2/q3 y E1 q4 integran metáforas; el poema y el glosario dan apoyos. No se demuestra dificultad equivalente a selva de figuras admonitorias del referente.'],
 ['V','Evaluar y comparar textos con sentido global o conocimientos pertinentes, en temas familiares y poco familiares; evaluar relevancia y suficiencia de uno o dos textos.','parcial','E4 q17 es selección de una comparación; cinco consignas redactadas están definidas con rúbrica, pero aún no hay respuestas aplicadas que demuestren fundamentación.'],
 ['R','Determinar efecto o propósito de recursos, como un verso, citas o analogías en argumentación.','parcial','E2 q6/E5 q6 examinan organización poética. Falta evaluar con evidencia redactada una analogía o citas en una comparación de textos.'],
 ['X','Evaluar la argumentación presente en textos.','parcial','E1 q12/E5 q17 reconocen una falla; falta evaluar la suficiencia del conjunto de razones, no solo identificar un error.']
];
for(const [op,descriptor,strength,note]of ec)requirements.push({id:`EC-${op}`,level:'Expectativa curricular',descriptor,printedPages:'17',items:op==='V'?'E4 q17; prácticas redactadas E1–E5':'Véase nota',strength,note});
const insufficient=[['L','Extraer información repetida, destacada o al inicio.'],['T','Reconocer tema/conflicto/propósito familiar, repetido o apoyado por título.'],['I','Inferencias muy evidentes con información adyacente y sin competencia.'],['F','Figuración familiar o reiterada, con claves evidentes.'],['V','Evaluación de temas familiares con conocimiento previo o información fácil de localizar.']];
for(const [op,descriptor]of insufficient)requirements.push({id:`I-${op}`,level:'Insuficiente: descripción, no requisito mínimo',descriptor,printedPages:'14',items:'Solapamiento con ítems Elementales de apoyo fuerte; no es clasificación del estudiante.',strength:'descripción registrada',note:'El nivel Insuficiente carece de requisitos mínimos. Un acierto básico aislado no acredita Elemental; un error aislado tampoco clasifica como Insuficiente.'});
assert.equal(requirements.length,35);
csv('COBERTURA_COMPLETA_NIVELES.csv',[['id_editorial','nivel','descriptor_parafraseado','paginas_impresas','items','cobertura','nota'],...requirements.map(r=>[r.id,r.level,r.descriptor,r.printedPages,r.items,r.strength,r.note])]);
fs.writeFileSync(path.join(dir,'AUDITORIA_DIFICULTAD.json'),JSON.stringify({date:'2026-10-13',pdf:inverse.pdf_source,pdfSha256:inverse.pdf_sha256,sourcePagesReviewed:56,counts,items,texts:metrics,requirements,skillCorrections:changes,notEmpirical:true},null,2)+'\n');
const md=[
 '# Auditoría de dificultad y niveles — SIMCE Unidad 4',
 '**Fecha:** 13 de octubre de 2026. Revisión completa de las 56 páginas del PDF local: definiciones, requisitos, ejemplos de preguntas y respuestas, ficha técnica y páginas en blanco. Fuentes e inventario por página en INGENIERIA_INVERSA.json. Revisión visual de Macbeth, noticia, comentarios y las dos respuestas manuscritas del ejemplo. No es verificación independiente ni pilotaje.',
 '**Dictamen:** hay 50 tareas de demanda Elemental, 39 de demanda Adecuado y una comparación próxima a expectativa curricular. Las etiquetas anteriores, asignadas por habilidad, no acreditaban esa demanda. Este análisis las reemplaza por una justificación individual. No vuelve más difíciles las preguntas ni acredita nivel del estudiante. La serie no cubre todas las condiciones de todos los niveles ni equivale 1:1 a SIMCE.',
 '## Cómo se midió',
 'Cada pregunta se resolvió desde el estímulo, revisando enunciado, clave y las otras tres alternativas. Se registraron información explícita/implícita, proximidad/dispersión, apoyo del texto, ideas que compiten, integración puntual/global/entre textos y descriptor de referencia. Familiaridad es un supuesto contextual, pendiente de observar en ambos cursos. El contenido sofisticado, la palabra inferir o la longitud no asignan nivel por sí solos. Las alternativas descartables por negaciones ya explicadas reducen demanda. La dificultad empírica (proporción de aciertos, discriminación y distractores elegidos) exige aplicación; no hay esas medidas aún.',
 'Las palabras léxicas se cuentan con expresión Unicode, separando signos; se conserva conteo por espacios para comparar con la auditoría anterior. Segmentación por puntuación y marcadores de subordinación son indicadores aproximados: no análisis gramatical automático ni índice validado de dificultad. No se asignan niveles SIMCE a un texto.',
 '## Resultado por miniensayo',
 '| Miniensayo | Elemental | Adecuado | Próximo a expectativa curricular |\n|---|---:|---:|---:|',
 ...exams.map(e=>`| ${e.number} | ${e.auditedDemandCounts.Elemental||0} | ${e.auditedDemandCounts.Adecuado||0} | ${e.auditedDemandCounts['Expectativa curricular']||0} |`),
 'La comparación E4 q17 ofrece opciones; no prueba que el estudiante pueda producir una comparación fundamentada. Por eso se conserva como aproximación editorial a la tarea de expectativa, con cobertura parcial del descriptor completo.',
 '## Medición y juicio de los 15 textos',
 '| E | Texto | Palabras (párrafos / tabla) | Media / máximo por oración aprox. | Sintaxis / abstracción / léxico / estructura |\n|---|---|---:|---:|---|',
 ...metrics.map(m=>`| ${m.exam} | ${m.title} | ${m.paragraph_words_lexical} / ${m.table_words_lexical} | ${m.mean_sentence_words} / ${m.max_sentence_words} | ${m.syntax} / ${m.abstraction} / ${m.vocabulary} / ${m.structure} |`),
 ...metrics.map(m=>`**E${m.exam}, ${m.title}:** ${m.judgment} ${m.limitation}`),
 '## Descomposición de los referentes del PDF',
 '| Texto del PDF | Páginas impresas | Palabras léxicas | Formato |\n|---|---|---:|---|',
 ...inverse.official_examples.map(r=>`| ${r.title} | ${r.printed_pages.join('–')} | ${r.words_lexical} | ${r.format} |`),
 '**Macbeth:** '+inverse.official_examples[2].words_lexical+' palabras contando contexto ('+inverse.official_examples[2].context_words+'), personajes y acotaciones, sin título, folios ni fuente. Dos páginas de lectura; cuerpo de 11 pt, nombres de personaje destacados, encabezado de escena y contexto. No tiene ilustración. Léxico menos familiar (nuncios, clemencia, hado, henchidme, hórrida, columbrar, áspid), metáforas e invocación, y carta dentro del parlamento. La ambición está en contexto y parlamento: su pregunta puede ser Elemental pese al texto complejo. La certeza sobre el trono requiere inferir el plan de asesinato y distinguirlo de la profecía: Adecuado. Los presagios son desencadenante de ambición, no causa del nombramiento ni promesa de ayuda.',
 '**Calvino:** ironía y lecturas equivocadas de bosque/carteles/personas. Un apoyo explícito no asegura baja demanda: prensa para abrigarse compite con usarla para encender la estufa. El lenguaje figurado poco familiar del bosque constituye el ejemplo de expectativa curricular.',
 '**Colosanti:** cuento fantástico con símbolo de rostro/identidad. La búsqueda reiterada facilita una inferencia básica; carga de ausencia exige interpretar una figura menos familiar para inferir el sentimiento.',
 '**Morir de amor:** el artículo usa dos columnas, título, bajada, fecha, fotografía raster de promoción y pie. Texto 2 simula publicación y comentarios con cajas, fechas relativas, hashtags, menciones e indicadores; el asset raster de 87×87 no convierte esos comentarios en una infografía. La fotografía publicitaria contiene fechas distintas de las del cuerpo y pie: no copiar esa discrepancia a un estímulo nuevo. Los ejemplos no hacen de ella una respuesta autónoma. Las muestras manuscritas están trazadas en el PDF; extraer solo texto no permite leerlas: se revisaron en render.',
 '**Fatalidad:** 115 palabras, seis estrofas de cuatro versos. La extensión breve no reduce la abstracción de muerte, alma y dolor. Identificar el temor final tiene claves evidentes; inferir resignación exige el sentido global.',
 'Estas cantidades describen ejemplos de un documento de estándares: no establecen mínimos/máximos oficiales para toda prueba ni la maqueta de SIMCE 2026. El PDF mide aproximadamente '+inverse.official_examples[2].page_size_pt.join(' × ')+' puntos; no se ha supuesto A4 ni trasladado sus tamaños al diseño móvil.',
 '## Inventario de preguntas ejemplificadas',
 'El PDF presenta 17 preguntas de alternativas y una pregunta abierta ilustrada con dos respuestas: Calvino 5, Colosanti 4, Macbeth 3, Morir de amor 4 (una abierta) y Fatalidad 2. Entre las 17 alternativas hay un ejemplo asociado a Insuficiente, ocho a Elemental, siete a Adecuado y uno a expectativa curricular. Son ejemplos graduados, no una cuota de distribución para un miniensayo.',
 '## Cobertura completa por condiciones de nivel',
 'Los 35 identificadores son editoriales: 23 filas descomponen los requisitos Elemental/Adecuado (incluyendo la condición general de inferencia y sus cinco ejemplos), siete filas la expectativa curricular y cinco las descripciones de tareas básicas del nivel Insuficiente. Las filas generales y ejemplos se solapan; no son 35 aprendizajes independientes. No se inventa requisito mínimo para Insuficiente. Se registran también contenido/forma, definición de familiaridad, periodo 7.º básico–2.º medio y el carácter inclusivo de los niveles.',
 '| Código | Nivel | Descriptor | Cobertura | Evidencia / límite |\n|---|---|---|---|',
 ...requirements.map(r=>`| ${r.id} | ${r.level} | ${r.descriptor} (p. ${r.printedPages}) | ${r.strength} | ${r.items}. ${r.note} |`),
 '## Brechas y correcciones necesarias para subir la demanda real',
 '1. No hay tarea Adecuada de característica de personaje o estereotipo con ideas que compitan (A-P y A-S). E1 q3 y E4 q2 tienen claves potentes: no subir su etiqueta. Habría que retirar la explicación anticipada, construir acciones/lecturas rivales plausibles y revisar de nuevo claves y alternativas.',
 '2. En Antígona, q3 y q4 recuperan motivos declarados. Para acercarse a la demanda de Macbeth, habría que inferirlos desde acciones y parlamentos dispersos sin declaración literal. La recreación más larga no basta.',
 '3. Varias tesis y límites están reiterados, y muchos distractores se niegan expresamente. Aumentar competencia con interpretaciones parciales apoyadas en distintos pasajes; conservar una clave inequívoca. No añadir palabras raras ni preguntas de conocimientos externos para simular dificultad.',
 '4. La expectativa curricular queda parcial en casi todas las operaciones y ausente en localización de estructura novedosa. Añadir tareas de atmósfera, estados de ánimo poco familiares, comparación de propósitos/suficiencia y evaluación del conjunto de argumentos. Seleccionar una respuesta no reemplaza producir una fundamentación.',
 '5. Ninguno de los 15 textos tiene imagen IA. E1 biblioteca es tabla; E5 semilla es tabla y el afiche describe sus dibujos. El ítem visual E5 q16 no acredita leer una imagen real. Pendiente generar las piezas raster IA autorizadas, sin SVG, comprobar todos sus datos y reauditar su demanda. No se generaron imágenes en esta auditoría.',
 '6. Hay dependencia temática/pistas compartidas (E1 q2–q4; E2 q2–q5; E5 q2–q4). No son preguntas matemáticamente independientes; una interpretación puede facilitar las siguientes. Se informa sin inventar coeficiente de confiabilidad.',
 '## Cuatro correcciones de habilidad',
 ...changes.map(c=>'- '+c),
 'Cambian etiquetas y justificación, no enunciados, alternativas, claves, identificadores o resultados históricos. La distribución nueva es 21 Localizar / 43 Interpretar / 26 Reflexionar. No se recalculó ninguna entrega real.',
 '## Respuesta redactada: qué mide y cómo se corrige',
 'La abierta oficial de Morir de amor compara qué texto parece mejor y pide información de ambos. La muestra parcial opina con evidencia de uno; la completa compara utilidad según propósito, relevancia y suficiencia de ambos. No exige una postura única. Mide comprensión, evaluación y fundamentación: redactar es el medio de evidencia, no una prueba independiente de ortografía. La muestra Elemental no convierte automáticamente al estudiante en Elemental.',
 'La reproducción local Forma P contiene 38 posiciones: 36 A–D y dos abiertas (10 y 24). La 10 relaciona temas de la reseña con el cuento Medias; la 24 infiere roles de género desde Calima y pide justificar. La vista de referencia en la plataforma omitía ambas; se agregaron, para lectura, como paráfrasis identificadas. Esa reproducción tiene ocho contenedores de lectura en siete unidades y cinco SVG internos: no es un facsímil oficial y no sirve para atribuir origen IA o formato al original.',
 'Se definen cinco prácticas complementarias, una por miniensayo, en el cuaderno después de entregar las 18 alternativas. No cambian el total de 18, la escala CEST ni el guardado digital. Pauta 0–3 CEST, no oficial: 0 sin respuesta válida/evidencia; 1 interpretación respaldada de un texto; 2 evidencia de ambos con comparación incompleta; 3 juicio/interpretación, evidencia de ambos y explicación suficiente. Informar aparte ausencia de respuesta. Ortografía, puntuación y cohesión reciben retroalimentación separada, sin descontar comprensión salvo que el sentido sea ininteligible. No exigir copiar literal: aceptar ejemplos y paráfrasis precisas.',
 ...exams.flatMap(e=>[`### Práctica redactada ${e.number}`,e.writtenPractice.prompt,`**Mide:** ${e.writtenPractice.criterion}`,`**Evidencias posibles:** ${e.writtenPractice.evidence.join(' / ')}`,`**Aplicación:** ${e.writtenPractice.format}`, ...e.writtenPractice.rubric.map(r=>`- ${r.points}: ${r.description}`)]),
 '## Auditoría individual de las 90 preguntas',
 ...items.map(i=>`**E${i.exam} ${i.id} — ${i.level}, ${i.descriptor}:** ${i.rationale} Evidencia: ${i.evidence} Información ${i.support}; pistas ${i.distance}; competencia ${i.competition}.`),
 '## Uso y límites',
 'Los niveles oficiales son del desempeño consistente del estudiante en la prueba calibrada: Insuficiente <250, Elemental 250 a <295, Adecuado ≥295. Expectativa curricular no es cuarto nivel. No se aplican esos cortes al índice lineal CEST. Clasificar tareas ayuda a balancear el instrumento, pero no permite certificar estudiantes. Se requieren pilotaje, tiempo observado, revisión de distractores elegidos y respuestas redactadas antes de estimar dificultad real o fiabilidad.',
 'El PDF completo aporta un marco de evaluación externa, no un temario que agote todas las Bases. Continúan sin cubrirse todos los OA/corpus/casos (romances, comedia teatral, contextos de obras, etc.). La presencia de un ejemplo no prueba cobertura exhaustiva. Las imágenes IA y revisiones de estímulos para mayor demanda siguen pendientes; esta auditoría no las presenta como terminadas.',
 'Reproducir: py -3.12 referencias/simce-unidad4-2026/medir_referentes.py; node referencias/simce-unidad4-2026/auditar_dificultad.cjs. Pauta individual y escrita disponibles para docente autenticado en /estudiantes/simce-unidad4/docente.html. Referencias privadas excluidas del despliegue.',
 'Fuente oficial: https://aprendoenlinea.mineduc.gob.cl/sites/default/files/newtenberg/614/articles-208047_recurso_pdf.pdf — SHA-256 '+inverse.pdf_sha256
];
fs.writeFileSync(path.join(dir,'AUDITORIA_DIFICULTAD.md'),md.join('\n\n').replace(/(\|)\n\n(?=\|)/g,'$1\n')+'\n');
console.log(JSON.stringify({items:items.length,texts:metrics.length,sourcePages:56,counts,requirements:requirements.length,skillCorrections:changes},null,2));
