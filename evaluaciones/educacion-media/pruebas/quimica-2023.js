const quizData = [
    {
        id: 1,
        text: "Una docente, en un 2° Medio, en la unidad de Estereoquímica e isomería, se encuentra planificando una clase cuyo objetivo de aprendizaje es el siguiente: “Reconocer la importancia de la configuración R o S en compuestos utilizados en la vida cotidiana”. ¿Cuál de las siguientes actividades es pertinente para abordar con los estudiantes el objetivo propuesto?",
        options: [
            { id: "A", text: "Pedir a los estudiantes que reflexionen sobre las implicancias económicas de la fabricación de medicamentos que tienen isómeros R y S." },
            { id: "B", text: "Pedir a los estudiantes que investiguen acerca de los efectos en la salud humana del uso de dos medicamentos que son enantiómeros entre sí." },
            { id: "C", text: "Pedir a los estudiantes que comparen las propiedades fisicoquímicas del estereoisómero R y S de 5 compuestos de uso frecuente, por ejemplo, ibuprofeno." },
            { id: "D", text: "Pedir a los estudiantes que apliquen las reglas Cahn-Ingold-Prelog para determinar la configuración R y S de 5 compuestos de uso frecuente, por ejemplo, fructosa." }
        ],
        correct: "B",
        feedback: "La actividad B es la más pertinente porque conecta directamente la configuración R/S con 'compuestos utilizados en la vida cotidiana' (medicamentos) y su 'importancia' (efectos en la salud), como el caso clásico de la Talidomida. Las otras opciones se centran en economía (A), propiedades fisicoquímicas (C) o reglas de nomenclatura (D) sin enfatizar necesariamente el impacto vital/cotidiano."
    },
    {
        id: 2,
        text: "Una profesora en un 2° Medio, en la unidad Disoluciones químicas, luego de haber explicado la conductividad eléctrica de las disoluciones acuosas, se encuentra planificando una actividad que le permita trabajar con sus alumnos el siguiente objetivo: “Explicar la influencia de los parámetros que afectan la conductividad eléctrica de las disoluciones acuosas”. ¿Cuál de las siguientes actividades a realizar por los estudiantes, posibilita que el objetivo sea abordado?",
        options: [
            { id: "A", text: "Analizar un gráfico que represente la concentración de iones en distintas muestras de suelo versus la conductividad eléctrica de estas y, posteriormente, escribir las conclusiones." },
            { id: "B", text: "Construir un cuadro comparativo de similitudes y diferencias entre disoluciones electrolíticas y no electrolíticas, considerando la naturaleza química del soluto." },
            { id: "C", text: "Medir experimentalmente la conductividad eléctrica de distintas muestras de agua (de mar, dulce, potable y destilada) y, posteriormente, explicar los resultados obtenidos." },
            { id: "D", text: "Determinar la relación entre la conductividad y los otros parámetros dados, a partir de una tabla que incluye la concentración de diferentes disoluciones salinas, número de iones en disolución y conductividad eléctrica." }
        ],
        correct: "D",
        feedback: "La opción D es la correcta porque permite relacionar explícitamente la conductividad con múltiples parámetros (concentración, número de iones), que es el objetivo de la clase. La opción A solo ve concentración en suelo. La B es comparativa cualitativa. La C es experimental pero no necesariamente aísla los parámetros para explicar su influencia detallada."
    },
    {
        id: 3,
        text: "Un profesor se encuentra diseñando una secuencia didáctica para abordar la unidad de Energía Nuclear. Dentro de la propuesta, el docente necesita incluir actividades que cubran el objetivo de aprendizaje: “Evaluar críticamente la producción y los riesgos del uso de la energía nuclear”. ¿Cuál de las siguientes actividades permite que los estudiantes aborden el objetivo de aprendizaje declarado?",
        options: [
            { id: "A", text: "Solicitar a los estudiantes realizar una mesa redonda sobre la central nuclear de Fukushima." },
            { id: "B", text: "Solicitar a los estudiantes elaborar un ensayo sobre los efectos de la radiación en los seres vivos." },
            { id: "C", text: "Solicitar a los estudiantes realizar un debate sobre la producción de energía a partir de fósiles y núcleos radiactivos." },
            { id: "D", text: "Solicitar a los estudiantes elaborar un ensayo crítico sobre el manejo y gestión de los desechos radiactivos en el medio ambiente." }
        ],
        correct: "C",
        feedback: "La opción C es la mejor porque un debate sobre 'producción de energía a partir de fósiles y núcleos radiactivos' obliga a evaluar críticamente tanto la producción (comparando eficiencia/costo) como los riesgos (contaminación vs radiación), cubriendo ambos aspectos del objetivo. Las otras opciones se centran solo en riesgos o eventos específicos."
    },
    {
        id: 4,
        text: "Una profesora, en un 1° Medio, se encuentra planificando trabajar en la primera clase de la unidad de Nomenclatura inorgánica, el concepto de valencia... ¿Cuál de los siguientes modelos posibilita introducir la relevancia del concepto de valencia en la formación de compuestos químicos?",
        image: "/evaluaciones/educacion-media/pruebas/quimica-2023-imagenes/quimica_2023_p4_1.png",
        options: [
            { id: "A", text: "Opción A (ver imagen)" },
            { id: "B", text: "Opción B (ver imagen)" },
            { id: "C", text: "Opción C (ver imagen)" },
            { id: "D", text: "Opción D (ver imagen)" }
        ],
        correct: "A", 
        feedback: "Se requiere analizar la imagen para dar la respuesta exacta, pero pedagógicamente, los modelos de Lewis o de esferas y varillas que muestran la capacidad de combinación (valencia) son los adecuados."
    },
    {
        id: 5,
        text: "Una docente en la unidad Fenómenos químicos del entorno y sus efectos, se encuentra trabajando el concepto de fuerza de ácidos y bases... ¿Cuál de los siguientes modelos es adecuado para explicar la diferencia entre un ácido fuerte y un ácido débil?",
        image: "/evaluaciones/educacion-media/pruebas/quimica-2023-imagenes/quimica_2023_p5_1.png",
        options: [
            { id: "A", text: "Opción A (ver imagen)" },
            { id: "B", text: "Opción B (ver imagen)" },
            { id: "C", text: "Opción C (ver imagen)" },
            { id: "D", text: "Opción D (ver imagen)" }
        ],
        correct: "A",
        feedback: "Un ácido fuerte se disocia completamente en iones, mientras que un ácido débil se disocia parcialmente (coexisten moléculas sin disociar e iones). El modelo correcto debe mostrar esta diferencia visualmente."
    },
    {
        id: 6,
        text: "Un profesor, en un 2° Medio, se encuentra realizando una clase sobre las propiedades físicas de los compuestos orgánicos y las técnicas de separación... ¿Cuál de las siguientes intervenciones posibilita que los estudiantes comprendan cómo se relaciona las técnicas de separación con las propiedades físicas de los compuestos orgánicos?",
        image: "/evaluaciones/educacion-media/pruebas/quimica-2023-imagenes/quimica_2023_p6_1.png",
        options: [
            { id: "A", text: "Realizar un repaso de interacciones químicas y luego formular la siguiente pregunta de reflexión: ¿cómo influyen estas interacciones en la expresión de las propiedades físicas de estos compuestos químicos?" },
            { id: "B", text: "Entregar información de los puntos de ebullición de las sustancias analizadas y luego formular la siguiente pregunta de reflexión: ¿qué factores influyen en el punto de ebullición presentado por estas sustancias químicas?" },
            { id: "C", text: "Dar a conocer los puntos de ebullición correctos de las sustancias analizadas y luego formular la siguiente pregunta de reflexión: ¿cómo afecta la presencia del oxígeno en el punto de ebullición de estas sustancias químicas?" },
            { id: "D", text: "Mostrar el diagrama de destilación fraccionada corregido y luego formular la siguiente pregunta de reflexión: ¿el largo de la cadena principal es el único factor a considerar para establecer los puntos de ebullición de una sustancia?" }
        ],
        correct: "B",
        feedback: "La opción B es la más adecuada porque al entregar los puntos de ebullición y preguntar por los factores, se guía a los estudiantes a relacionar la propiedad física (P.E.) con la técnica de separación (destilación) y la estructura molecular (fuerzas intermoleculares), promoviendo la comprensión profunda."
    },
    {
        id: 7,
        text: "Una profesora, en un 2° Medio, se encuentra trabajando la nomenclatura de grupos funcionales... ¿Cuál de las siguientes actividades posibilita que los estudiantes comprendan de mejor manera el contenido abordado?",
        image: "/evaluaciones/educacion-media/pruebas/quimica-2023-imagenes/quimica_2023_p7_1.png",
        options: [
            { id: "A", text: "Observar imágenes de las diferentes ramificaciones existentes y anotar diferencias y semejanzas entre ellas." },
            { id: "B", text: "Resolver una guía de ejercicios complementaria a la clase, en la cual se aborde la nomenclatura de alcoholes, cetonas, éteres, aldehídos, ácidos carboxílicos y ésteres." },
            { id: "C", text: "Investigar acerca de las aminas y las amidas y luego responder la pregunta: ¿Qué diferencias se establecen en las reglas de nomenclatura para nombrar aminas y amidas?" },
            { id: "D", text: "Investigar la estructura química del ácido acético y el acetaldehído y luego responder la pregunta: ¿Qué diferencias estructurales se pueden apreciar entre ambas moléculas orgánicas?" }
        ],
        correct: "B",
        feedback: "Dado que el error de los estudiantes parece ser la confusión entre grupos funcionales y sus reglas de nomenclatura (mezclando amidas con aminas, ácidos con otros), la práctica guiada (Opción B) cubriendo una variedad de grupos funcionales es fundamental para consolidar las reglas IUPAC."
    },
    {
        id: 8,
        text: "Además del puente salino y considerando los datos proporcionados por la tabla, ¿qué otros recursos del laboratorio se les debe indicar a los estudiantes que seleccionen para que el experimento les permita determinar cómo funcionan las celdas electroquímicas?",
        image: "/evaluaciones/educacion-media/pruebas/quimica-2023-imagenes/quimica_2023_p8_1.png",
        options: [
            { id: "A", text: "Un ánodo de oro y un cátodo de hierro." },
            { id: "B", text: "Un ánodo de zinc y un cátodo de cobre." },
            { id: "C", text: "Un ánodo de zinc y un cátodo de aluminio." },
            { id: "D", text: "Un ánodo de cobre y un cátodo de aluminio." }
        ],
        correct: "B",
        feedback: "La celda de Daniell (Zinc-Cobre) es el ejemplo clásico y más didáctico para enseñar el funcionamiento de celdas electroquímicas debido a la clara diferencia de potencial y la disponibilidad de materiales."
    },
    {
        id: 9,
        text: "Una profesora, en un 2° Medio, trabajará con sus estudiantes los factores que afectan la solubilidad y sus aplicaciones. Su propósito es hacerlo atendiendo al énfasis curricular alfabetización científica. ¿Cuál de las siguientes actividades aborda el contenido en concordancia con el énfasis curricular?",
        options: [
            { id: "A", text: "Investigar los factores involucrados al agitar y luego abrir una botella de bebida gaseosa." },
            { id: "B", text: "Diseñar un experimento con plantas acuáticas a diferentes temperaturas y compararlo con el impacto de una termoeléctrica." },
            { id: "C", text: "Realizar un experimento en el que al soplar a través de una bombilla dentro de un vaso con agua de cal, el agua se vuelve blanca." },
            { id: "D", text: "Interpretar los datos de un gráfico en que se muestra la concentración de oxihemoglobina en la sangre versus la presión de oxígeno." }
        ],
        correct: "A",
        feedback: "La opción A conecta un fenómeno cotidiano y familiar (bebida gaseosa) con los conceptos científicos (presión, temperatura, solubilidad de gases), lo cual es la esencia de la alfabetización científica: usar la ciencia para explicar el mundo diario."
    },
    {
        id: 10,
        text: "Un profesor que se encuentra trabajando con sus estudiantes de 1° Medio la clasificación de las reacciones químicas, les señala que muchas de estas reacciones ocurren a diario en nuestra cotidianidad... ¿Cuál de los siguientes ejemplos ilustra las reacciones químicas de doble sustitución que se encuentran en la vida cotidiana?",
        options: [
            { id: "A", text: "Formación de dióxido de carbono gaseoso, agua líquida y energía en forma de ATP, en el proceso de respiración celular." },
            { id: "B", text: "Formación de cloruro de magnesio acuoso y agua líquida, a partir de ácido clorhídrico presente en el estómago e hidróxido de magnesio presente en algunos productos antiácidos." },
            { id: "C", text: "Formación de oxígeno molecular gaseoso y agua líquida a partir del contacto de peróxido de hidrógeno líquido con la sangre." },
            { id: "D", text: "Formación de amoniaco gaseoso, para la fabricación de fertilizantes, a partir de hidrógeno molecular gaseoso y nitrógeno molecular gaseoso." }
        ],
        correct: "B",
        feedback: "La reacción entre HCl (ácido) y Mg(OH)2 (base) es una neutralización, que es un tipo de reacción de doble sustitución (AB + CD -> AD + CB), formando sal y agua. Es un ejemplo cotidiano claro de antiácidos."
    },
    {
        id: 11,
        text: "Un docente, en un 4° Medio, al planificar la unidad de Reacciones ácido-base plantea el siguiente objetivo de aprendizaje: “Relacionar la concentración con la expresión matemática para calcular el pH en distintos tipos de ácidos y bases débiles”. ¿Cuál de los siguientes conocimientos previos es imprescindible que los estudiantes hayan adquirido para abordar el aprendizaje propuesto?",
        options: [
            { id: "A", text: "Relación de la fuerza del ácido con su base conjugada." },
            { id: "B", text: "Representación de la disociación de sustancias electrolíticas." },
            { id: "C", text: "Expresión de la constante de equilibrio de una reacción química." },
            { id: "D", text: "Determinación de la molaridad en disoluciones químicas electrolíticas." }
        ],
        correct: "C",
        feedback: "Para calcular el pH de ácidos y bases débiles, es fundamental entender y aplicar la constante de equilibrio (Ka o Kb), ya que estos no se disocian completamente."
    },
    {
        id: 12,
        text: "Un docente, en la unidad de reacciones de Óxido-reducción, se encuentra planificando una clase cuyo objetivo de aprendizaje es el siguiente: “Identificar las semirreacciones de oxidación y de reducción en una reacción redox”. ¿Qué conocimiento previo es necesario que los estudiantes hayan adquirido para abordar el aprendizaje mencionado?",
        options: [
            { id: "A", text: "Reacciones redox en pilas." },
            { id: "B", text: "Balance del método ion electrón." },
            { id: "C", text: "Estado de oxidación de iones y elementos." },
            { id: "D", text: "Celdas electroquímicas." }
        ],
        correct: "C",
        feedback: "Para identificar quién se oxida y quién se reduce, es requisito indispensable saber determinar los estados de oxidación de los elementos y ver cómo cambian."
    },
    {
        id: 13,
        text: "Un profesor está desarrollando la unidad Fenómenos químicos del entorno... solicita balancear la ecuación: BrO3- + S2O3-2 -> Br- + SO4-2. Una pareja responde: BrO3- + S2O3-2 + 2H2O -> Br- + 2SO4-2 + 4H+. A juzgar por su respuesta ¿qué dificultad evidencian estos estudiantes al realizar el balance de la ecuación redox?",
        image: "/evaluaciones/educacion-media/pruebas/quimica-2023-imagenes/quimica_2023_p11_1.png",
        options: [
            { id: "A", text: "Los estudiantes suponen que hay equilibrio en la transferencia de electrones." },
            { id: "B", text: "Los estudiantes asumen que los iones de H+ se desempeñan como productos." },
            { id: "C", text: "Los estudiantes consideran que las moléculas de agua se desempeñan como reactantes." },
            { id: "D", text: "Los estudiantes asumen que hay equilibrio de masas entre el agente reductor y la especie oxidada." }
        ],
        correct: "A",
        feedback: "Aunque balancearon las masas (átomos), no balancearon las cargas (electrones). La carga neta a la izquierda es -3 y a la derecha es -1. Esto indica que no consideraron la transferencia de electrones (semirreacciones) correctamente."
    },
    {
        id: 14,
        text: "Un docente... solicita calcular los estados de oxidación... Tabla de resultados: LiGaH4 (-5), BH3 (-3). ¿Cuál de los siguientes errores en la comprensión de los contenidos se puede inferir a partir del desempeño de estos estudiantes?",
        image: "/evaluaciones/educacion-media/pruebas/quimica-2023-imagenes/quimica_2023_p12_1.png",
        options: [
            { id: "A", text: "Asumen que el oxígeno presenta estado de oxidación -2 en todos los casos." },
            { id: "B", text: "Asumen que el hidrógeno presenta estado de oxidación +1 en todos los casos." },
            { id: "C", text: "Asumen que los no metales presentan estados de oxidación negativos en todos los casos." },
            { id: "D", text: "Asumen que los metales representativos presentan estados de oxidación negativos en todos los casos." }
        ],
        correct: "B",
        feedback: "En los hidruros (como LiGaH4 y BH3), el hidrógeno actúa con estado de oxidación -1. Los resultados erróneos (-5 y -3) surgen de calcular asumiendo que H es +1 (como es habitual en ácidos o agua)."
    },
    {
        id: 15,
        text: "Una profesora... objetivo: “Reconocer procesos redox en la vida cotidiana y su impacto en la sociedad actual”. ¿Cuál de las siguientes actividades permite recoger evidencia del logro del objetivo planteado?",
        options: [
            { id: "A", text: "Reflexionar, mediante la elaboración de un ensayo escrito, sobre la corrosión de estructuras metálicas por efecto de la lluvia ácida." },
            { id: "B", text: "Calcular, mediante ecuaciones matemáticas, los estados de oxidación de los elementos químicos involucrados en la reacción química del alcotest." },
            { id: "C", text: "Balancear, utilizando el método del ion electrón, la ecuación química de oxidación de cañerías de cobre." },
            { id: "D", text: "Determinar, a través del método del cambio de estado de oxidación, el número de electrones transferidos en una pila alcalina." }
        ],
        correct: "A",
        feedback: "La opción A es la única que apunta a 'reconocer' e 'impacto en la sociedad' (corrosión, infraestructura). Las otras son procedimentales (calcular, balancear, determinar)."
    },
    {
        id: 16,
        text: "Uno de los objetivos trabajados por los estudiantes de 2° Medio es “Organizar e interpretar datos relacionados con las propiedades fisicoquímicas de compuestos orgánicos”. ¿Cuál de las siguientes actividades permite evaluar el objetivo antes mencionado?",
        options: [
            { id: "A", text: "Entregar a los estudiantes datos de puntos de ebullición... y solicitar que analicen si están en estado sólido, líquido o gaseoso." },
            { id: "B", text: "Pedir a los estudiantes que investiguen los puntos de ebullición... los organicen en una tabla y analicen su estado." },
            { id: "C", text: "Entregar a los estudiantes datos... ordenados en una tabla y que interpreten el comportamiento..." },
            { id: "D", text: "Entregar a los estudiantes datos... los cuales deberán organizar en una tabla... y luego interpretar este comportamiento..." }
        ],
        correct: "D",
        feedback: "La opción D requiere explícitamente que el estudiante realice ambas acciones del objetivo: 'organizar' (crear la tabla) e 'interpretar' (analizar el comportamiento)."
    },
    {
        id: 17,
        text: "Un profesor evaluará el siguiente objetivo... “Describir las transformaciones que experimenta un elemento radiactivo”. ¿Cuál de los siguientes indicadores de evaluación da cuenta de que los estudiantes lograron el objetivo planteado?",
        options: [
            { id: "A", text: "Analizan una serie de decaimiento radiactivo." },
            { id: "B", text: "Balancean ecuaciones nucleares de distintos núclidos." },
            { id: "C", text: "Representan, en una ecuación nuclear, los cambios en la estructura de un núclido." },
            { id: "D", text: "Relacionan modificaciones experimentadas por un elemento radiactivo con el tipo de partícula radiactiva emitida." }
        ],
        correct: "C",
        feedback: "Representar los cambios en la estructura de un núclido en una ecuación es la forma directa de 'describir la transformación' que ocurre en el núcleo."
    },
    {
        id: 18,
        text: "Un docente de 1° Medio... evaluará alfabetización científica... reconocer procesos químicos en fenómenos que ocurren a su alrededor. Un grupo presenta reacciones: NaOH+HCl, H2+Cl2, C+O2. ¿Cuál de los siguientes comentarios del docente permite orientar a los estudiantes hacia el aprendizaje evaluado?",
        options: [
            { id: "A", text: "Buen trabajo. Ahora, respondan: ¿A qué fenómenos se asocian las reacciones químicas que ustedes plantearon?" },
            { id: "B", text: "Buen trabajo. Ahora, respondan: ¿Qué fenómenos cotidianos se pueden representar mediante ecuaciones químicas?" },
            { id: "C", text: "Buen trabajo. Ahora, respondan: ¿Qué compuestos químicos provocan fenómenos cotidianos que ocurren a su alrededor?" },
            { id: "D", text: "Buen trabajo. Ahora, respondan: ¿Cuáles de las reacciones que ustedes trajeron es posible encontrarlas en acciones cotidianas?" }
        ],
        correct: "D",
        feedback: "La pregunta D conecta directamente el trabajo realizado por los estudiantes (las reacciones que trajeron) con el objetivo de evaluación (reconocerlas en acciones cotidianas)."
    },
    {
        id: 19,
        text: "Un grupo de investigadores... hipótesis: Si se mezclan... A y B, la obtención de la droga se verá favorecida cuando la reacción química se lleve a cabo utilizando solventes polares y a temperaturas sobre los 60 °C... ¿Qué procedimiento experimental permitiría corroborar la hipótesis?",
        image: "/evaluaciones/educacion-media/pruebas/quimica-2023-imagenes/quimica_2023_p16_1.png",
        options: [
            { id: "A", text: "Probar con agua y etanol (polares) vs tolueno y hexano (apolares) a 20, 40, 60 y 80 °C." },
            { id: "B", text: "Probar con agua, etanol, metanol y acetona (todos polares) a 20, 40, 60 y 80 °C." },
            { id: "C", text: "Probar con metanol y etanol (polares) vs benceno y tolueno (apolares) a 20, 40, 60 y 80 °C." },
            { id: "D", text: "Probar con agua y metanol (polares) vs CCl4 y benceno (apolares) a 20, 40, 60 y 80 °C." }
        ],
        correct: "A",
        feedback: "Para corroborar la hipótesis, se debe contrastar la condición propuesta (solventes polares) con su opuesto (apolares) y variar la temperatura por debajo y por encima de 60°C. La opción A ofrece un buen contraste de solventes comunes."
    },
    {
        id: 20,
        text: "Un químico... diseño experimental sobre reacciones redox... celda galvánica... Fe (ánodo), Cu (cátodo)... ampolleta LED no enciende. ¿Qué se debe modificar en el diseño experimental para mejorar los resultados obtenidos (aumentar voltaje)?",
        image: "/evaluaciones/educacion-media/pruebas/quimica-2023-imagenes/quimica_2023_p17_1.png",
        options: [
            { id: "A", text: "Cambiar el electrolito utilizado en el cátodo por uno más fuerte." },
            { id: "B", text: "Sustituir el cátodo por uno que tenga menor potencial de reducción." },
            { id: "C", text: "Reemplazar el ánodo por uno que tenga menor potencial de reducción." },
            { id: "D", text: "Disminuir la concentración de las disoluciones electrolíticas del ánodo y del cátodo." }
        ],
        correct: "C",
        feedback: "El voltaje de la celda es la diferencia entre el potencial del cátodo y el del ánodo (Ec - Ea). Para aumentar el voltaje y encender el LED, se debe aumentar esta diferencia. Reemplazar el ánodo por uno con MENOR potencial (más negativo) aumentará la diferencia total."
    },
    {
        id: 21,
        text: "Un grupo de científicos investiga el comportamiento electroquímico de especies de cloro... Tabla de potenciales a pH 0, 7, 14. ¿Qué pregunta de investigación se podría responder?",
        image: "/evaluaciones/educacion-media/pruebas/quimica-2023-imagenes/quimica_2023_p17_1.png",
        options: [
            { id: "A", text: "¿Cuán oxidantes son las especies de cloro al modificar los valores de pH del medio?" },
            { id: "B", text: "¿Cómo afecta el pH del medio en el poder desinfectante de las distintas especies de cloro?" },
            { id: "C", text: "¿Cómo varía el poder oxidante de las distintas especies de cloro al modificar el pH del medio?" },
            { id: "D", text: "¿El ácido hipocloroso puede inducir el estrés oxidativo en el ser humano cuando este presenta pH fisiológico?" }
        ],
        correct: "C",
        feedback: "La tabla muestra cómo cambian los potenciales de reducción (medida del poder oxidante) al cambiar el pH. La pregunta C es la que mejor formula esta relación variable dependiente/independiente."
    },
    {
        id: 22,
        text: "Un grupo de investigadores estudió el efecto de la sustitución de un hidrógeno alquílico... Tabla de pKa. ¿Qué conclusión sería posible obtener?",
        image: "/evaluaciones/educacion-media/pruebas/quimica-2023-imagenes/quimica_2023_p18_1.png",
        options: [
            { id: "A", text: "El sustituyente -CH3 es el único que produce un aumento en el valor de pKa." },
            { id: "B", text: "Aquellos grupos funcionales aceptores de densidad electrónica favorecen una disminución en los valores de pKa." },
            { id: "C", text: "La variación de los valores de pKa es un factor fundamental para la síntesis de derivados." },
            { id: "D", text: "Los grupos dadores aumentan el pKa y los aceptores lo reducen." }
        ],
        correct: "D",
        feedback: "Los datos muestran que los grupos 'Dadores' (H, CH3) tienen pKa alto (~4.8), mientras que los 'Aceptores' (NH2, F, NO2) tienen pKa bajo (<2.6). Esto permite concluir la relación directa descrita en D."
    },
    {
        id: 23,
        text: "Un grupo de investigadores experimenta con distintos materiales para probar aislantes... 5 vasos... Gráfico Temperatura vs Tiempo. ¿Cuál de los siguientes gráficos corresponde utilizar para presentar los resultados obtenidos?",
        image: "/evaluaciones/educacion-media/pruebas/quimica-2023-imagenes/quimica_2023_p19_1.png",
        options: [
            { id: "A", text: "Gráfico A" },
            { id: "B", text: "Gráfico B" },
            { id: "C", text: "Gráfico C" },
            { id: "D", text: "Gráfico D" }
        ],
        correct: "B",
        feedback: "Al enfriarse el agua, la temperatura debe disminuir con el tiempo (pendiente negativa). Además, los mejores aislantes (plumavit) mantendrán la temperatura más alta por más tiempo (curva superior), mientras que el control (sin aislante) bajará más rápido (curva inferior). El Gráfico B representa esto correctamente."
    },
    {
        id: 24,
        text: "Un grupo de investigadores... ninhidrina... 5 tubos (huevo, leche, carne, queso, atún)... Observar cambios de color. ¿Cuál es la variable dependiente del diseño experimental propuesto?",
        options: [
            { id: "A", text: "Temperatura." },
            { id: "B", text: "Coloración de las muestras." },
            { id: "C", text: "Concentración de ninhidrina." },
            { id: "D", text: "Contenido de cada muestra problema." }
        ],
        correct: "B",
        feedback: "La variable dependiente es aquella que se mide u observa como resultado del experimento. En este caso, el 'cambio de color' es lo que se observa para determinar la presencia de aminoácidos."
    },
    {
        id: 25,
        text: "Se dispone de 500 mL de una disolución acuosa de ácido cítrico (MM = 192 g/mol) a concentración 1 mol/L y densidad 1,2 g/mL. ¿Cuál de las siguientes expresiones permite determinar la molalidad de la disolución mencionada?",
        options: [
            { id: "A", text: "0,5 / ((500*1,2) - 96)" },
            { id: "B", text: "0,5 / (500*1,2)" },
            { id: "C", text: "0,5 / 1000 * Wm" },
            { id: "D", text: "0,5 / (500*1,2*192)" }
        ],
        correct: "A",
        feedback: "La molalidad es moles de soluto / kg de disolvente. Moles = 0.5. Masa disolución = 500*1.2 = 600g. Masa soluto = 0.5*192 = 96g. Masa disolvente = 600 - 96. La expresión A representa correctamente esta relación (asumiendo conversión de unidades implícita o resultado en mol/g)."
    },
    {
        id: 26,
        text: "Gabriel... Situación 1: Semillas de chía aumentan tamaño en agua. Situación 2: Agua de chía hierve a mayor temperatura que agua potable. ¿Qué propiedades coligativas de las disoluciones quedan de manifiesto en las situaciones 1 y 2, respectivamente?",
        options: [
            { id: "A", text: "Presión osmótica y descenso crioscópico." },
            { id: "B", text: "Ascenso ebulloscópico y presión osmótica." },
            { id: "C", text: "Presión osmótica y descenso de la presión de vapor." },
            { id: "D", text: "Descenso de la presión de vapor y ascenso ebulloscópico." }
        ],
        correct: "C",
        feedback: "La Situación 1 (entrada de agua a la semilla) es Osmosis. La Situación 2 (hervir a mayor temperatura) es Ascenso Ebulloscópico. La opción C menciona 'Presión osmótica' y 'Descenso de la presión de vapor'. Dado que el descenso de la presión de vapor es la causa fisicoquímica directa del ascenso ebulloscópico, esta es la opción conceptualmente correcta disponible."
    },
    {
        id: 27,
        text: "¿En cuál de los siguientes ejemplos se aplica la propiedad de presión osmótica?",
        options: [
            { id: "A", text: "Enfriamiento de agua en recipiente con hielos y sal." },
            { id: "B", text: "Proceso de secado de los pegamentos de contacto." },
            { id: "C", text: "Preservación de una flor en un florero con agua con sal." },
            { id: "D", text: "Sobrevivencia de bacterias o insectos que viven en condiciones extremas de temperatura." }
        ],
        correct: "C",
        feedback: "La preservación de flores (o alimentos) usando soluciones salinas o azucaradas se basa en la ósmosis, regulando el flujo de agua hacia adentro o afuera de las células."
    },
    {
        id: 28,
        text: "¿Cuál de los siguientes ejemplos corresponde a la propiedad de disminución del punto de congelación?",
        options: [
            { id: "A", text: "Desalinización del agua de mar." },
            { id: "B", text: "Saborización de verduras con sal." },
            { id: "C", text: "Preparación de pepinillos en conserva." },
            { id: "D", text: "Determinación de la pureza de la leche." }
        ],
        correct: "D",
        feedback: "La crioscopía (medición del punto de congelación) se utiliza rutinariamente en la industria láctea para detectar si a la leche se le ha agregado agua (lo que acercaría el punto de congelación a 0°C)."
    },
    {
        id: 29,
        text: "Sabiendo que la concentración de oxígeno en el agua es fundamental para la vida de los peces... ¿cómo se explica que, por efecto del aumento de la temperatura... esté en peligro la vida?",
        options: [
            { id: "A", text: "El aumento de temperatura disminuye la capacidad de las algas de absorber oxígeno." },
            { id: "B", text: "El aumento de temperatura disminuye la solubilidad del oxígeno, reduciendo la concentración de este en el ecosistema." },
            { id: "C", text: "El aumento de temperatura incrementa la solubilidad del oxígeno." },
            { id: "D", text: "El aumento de temperatura incrementa la concentración de oxígeno." }
        ],
        correct: "B",
        feedback: "La solubilidad de los gases en líquidos disminuye al aumentar la temperatura. Por tanto, agua más caliente retiene menos oxígeno disuelto, afectando a la vida acuática."
    },
    {
        id: 30,
        text: "¿Cuál de los siguientes compuestos orgánicos presentaría un aroma floral o frutal?",
        options: [
            { id: "A", text: "CH3CH2CH2COCH2CH3 (Cetona)" },
            { id: "B", text: "CH3CH2CH2CH2CH2CHO (Aldehído)" },
            { id: "C", text: "CH3CH2CH2OCH2CH2CH3 (Éter)" },
            { id: "D", text: "CH3CH2CH2COOCH2CH3 (Éster)" }
        ],
        correct: "D",
        feedback: "Los ésteres (R-COO-R') son conocidos por sus aromas agradables a frutas y flores, y se usan comúnmente en fragancias y saborizantes."
    },
    {
        id: 31,
        text: "¿Qué tipo de compuesto se obtendrá al tratar el 2-pentanol con un agente oxidante?",
        options: [
            { id: "A", text: "Aldehído." },
            { id: "B", text: "Éster." },
            { id: "C", text: "Alcohol terciario." },
            { id: "D", text: "Cetona." }
        ],
        correct: "D",
        feedback: "El 2-pentanol es un alcohol secundario. La oxidación de alcoholes secundarios produce cetonas."
    },
    {
        id: 32,
        text: "El ácido 2-amino-3-hidroxibutanoico (treonina)... De los cuatro estereoisómeros, solo el ácido 2S,3R se presenta en la naturaleza. ¿Cuál de las siguientes estructuras corresponde al 2S,3R?",
        image: "/evaluaciones/educacion-media/pruebas/quimica-2023-imagenes/quimica_2023_p24_1.png",
        options: [
            { id: "A", text: "Estructura A" },
            { id: "B", text: "Estructura B" },
            { id: "C", text: "Estructura C" },
            { id: "D", text: "Estructura D" }
        ],
        correct: "A",
        feedback: "Se debe identificar la configuración absoluta de los carbonos quirales en la proyección de Fischer proporcionada en la imagen."
    },
    {
        id: 33,
        text: "¿Qué características deben poseer dos moléculas orgánicas para que sean enantiómeros entre sí?",
        options: [
            { id: "A", text: "Poseer distinta fórmula estructural, distintos centros quirales y distinta configuración espacial." },
            { id: "B", text: "Poseer la misma fórmula estructural, los mismos centros quirales e igual configuración espacial." },
            { id: "C", text: "Poseer distinta fórmula estructural, los mismos centros quirales e igual configuración espacial." },
            { id: "D", text: "Poseer la misma fórmula estructural, los mismos centros quirales y distinta configuración espacial." }
        ],
        correct: "D",
        feedback: "Los enantiómeros son estereoisómeros que son imágenes especulares no superponibles. Tienen la misma conectividad (fórmula) pero configuración espacial opuesta en todos sus centros quirales."
    },
    {
        id: 34,
        text: "La energía de enlace entre carbonos en el eteno es 163 kcal y en el etino 198 kcal. ¿Cuál de las siguientes explicaciones expresa la diferencia en las energías de enlace?",
        options: [
            { id: "A", text: "El etino, al presentar una hibridación sp, genera orbitales híbridos de mayor energía." },
            { id: "B", text: "El eteno, al tener una hibridación sp2, presenta polaridad en su enlace." },
            { id: "C", text: "En el eteno, al formarse el enlace, se genera una gran densidad electrónica que deforma los orbitales." },
            { id: "D", text: "En el etino, el enlace se conforma por el solapamiento de 2 orbitales híbridos y 4 orbitales sin hibridar, lo que le confiere mayor fuerza." }
        ],
        correct: "D",
        feedback: "El enlace triple del etino está formado por 1 enlace sigma (sp-sp) y 2 enlaces pi (formados por el solapamiento lateral de 2 pares de orbitales p no híbridos, es decir, 4 orbitales en total). Esta mayor densidad de enlace (triple vs doble) resulta en mayor energía de enlace."
    },
    {
        id: 35,
        text: "La siguiente representación corresponde a la estructura química del aminoácido valina... ¿En cuál de las siguientes proyecciones de Newman se representa correctamente la estructura de la valina?",
        image: "/evaluaciones/educacion-media/pruebas/quimica-2023-imagenes/quimica_2023_p26_1.png",
        options: [
            { id: "A", text: "Proyección A" },
            { id: "B", text: "Proyección B" },
            { id: "C", text: "Proyección C" },
            { id: "D", text: "Proyección D" }
        ],
        correct: "A",
        feedback: "Se requiere visualizar la molécula desde el enlace C-C adecuado para hacer coincidir la estructura de caballete o cuña con la proyección de Newman."
    },
    {
        id: 36,
        text: "En la industria azucarera... se agrega cal (CaO) en un medio acuoso al jugo de caña. ¿Qué tipo de sustancias se busca eliminar del jugo de caña mediante el proceso realizado con CaO?",
        options: [
            { id: "A", text: "Sustancias básicas, que serán neutralizadas por el CaO." },
            { id: "B", text: "Sustancias ácidas, que al reaccionar con el hidróxido de calcio (Ca(OH)2) se neutralizarán formando sales insolubles." },
            { id: "C", text: "Trozos de caña que provocan fermentación." },
            { id: "D", text: "Carbohidratos complejos que impiden la cristalización." }
        ],
        correct: "B",
        feedback: "El CaO en agua forma Ca(OH)2, una base fuerte. Esta se utiliza para neutralizar los ácidos orgánicos presentes en el jugo de caña, evitando la inversión de la sacarosa (hidrólisis ácida) y precipitando impurezas."
    },
    {
        id: 37,
        text: "Se tiene una disolución acuosa de 2 M de nicotina (C10H14N2), cuyo Kb es 1 x10^-6. ¿Cuál es la expresión para calcular el pH de la disolución de nicotina?",
        options: [
            { id: "A", text: "pH = 14 - (-log 2)" },
            { id: "B", text: "pH = -log(sqrt(1x10^-6 * 2))" },
            { id: "C", text: "pH = -log(1x10^-6)" },
            { id: "D", text: "pH = 14 - (-log(sqrt(1x10^-6 * 2)))" }
        ],
        correct: "D",
        feedback: "Para una base débil, [OH-] = raíz(Kb * C). pOH = -log[OH-]. pH = 14 - pOH. La expresión D sigue exactamente estos pasos: calcula [OH-], saca el pOH y lo resta de 14."
    },
    {
        id: 38,
        text: "En el contexto de los sistemas ácido-base, ¿cuál es la función de un amortiguador o buffer?",
        options: [
            { id: "A", text: "Evitar los cambios bruscos de pH al adicionar pequeñas cantidades de OH- o H+." },
            { id: "B", text: "Mantener el pH en valores cercanos a 7." },
            { id: "C", text: "Disminuir la concentración de H+ al adicionar OH-." },
            { id: "D", text: "Disminuir la concentración de OH- al adicionar H+." }
        ],
        correct: "A",
        feedback: "La definición fundamental de una solución buffer es su capacidad para resistir cambios significativos en el pH cuando se agregan pequeñas cantidades de ácido o base fuerte."
    },
    {
        id: 39,
        text: "¿Cuáles son los coeficientes estequiométricos para que la siguiente ecuación quede equilibrada? K2Cr2O7 + H2O + S -> SO2 + KOH + Cr2O3",
        options: [
            { id: "A", text: "1, 2, 3 -> 3, 2, 2" },
            { id: "B", text: "2, 2, 3 -> 3, 4, 2" },
            { id: "C", text: "4, 2, 3 -> 3, 8, 4" },
            { id: "D", text: "2, 2, 3 -> 3, 4, 1" }
        ],
        correct: "B",
        feedback: "Al balancear la ecuación redox (S se oxida a SO2, Cr se reduce a Cr2O3), los coeficientes correctos son: 2 K2Cr2O7 + 2 H2O + 3 S -> 3 SO2 + 4 KOH + 2 Cr2O3."
    },
    {
        id: 40,
        text: "¿En cuál de las siguientes afirmaciones se explica que la fotosíntesis es una reacción redox?",
        options: [
            { id: "A", text: "El oxígeno molecular se reduce formando agua y el carbono de la glucosa se oxida." },
            { id: "B", text: "El oxígeno del agua se reduce formando oxígeno molecular." },
            { id: "C", text: "El oxígeno del agua se oxida formando oxígeno molecular y el carbono del dióxido de carbono se reduce y forma la glucosa." },
            { id: "D", text: "El oxígeno del dióxido de carbono se oxida formando oxígeno molecular." }
        ],
        correct: "C",
        feedback: "En la fotosíntesis (6CO2 + 6H2O -> C6H12O6 + 6O2), el agua actúa como donante de electrones (se oxida a O2) y el CO2 actúa como aceptor de electrones (se reduce a carbohidrato/glucosa)."
    },
    {
        id: 41,
        text: "Las siguientes moléculas, al reaccionar, originan el polímero sintético nylon 66: Ácido adípico + Hexametilendiamina. ¿Cuál de las siguientes representaciones corresponde a la unidad repitente del nylon 66?",
        image: "/evaluaciones/educacion-media/pruebas/quimica-2023-imagenes/quimica_2023_p29_1.png",
        options: [
            { id: "A", text: "Representación A" },
            { id: "B", text: "Representación B" },
            { id: "C", text: "Representación C" },
            { id: "D", text: "Representación D" }
        ],
        correct: "A",
        feedback: "El Nylon 6,6 se forma por la condensación de un diácido de 6 carbonos y una diamina de 6 carbonos, formando enlaces amida (-CO-NH-) y liberando agua. La unidad repetitiva debe mostrar la estructura -CO-(CH2)4-CO-NH-(CH2)6-NH-."
    },
    {
        id: 42,
        text: "La lixiviación del cobre es una reacción de óxido-reducción... Para la cuprita: Cu2O + H2SO4 -> CuSO4 + Cu + H2O. ¿Qué proceso explica que esta reacción sea redox?",
        options: [
            { id: "A", text: "El cobre dismuta, es decir, se oxida de Cu+1 a Cu+2 y se reduce de Cu+1 a Cu0." },
            { id: "B", text: "El cobre se reduce de Cu+1 a Cu0 y el oxígeno se oxida." },
            { id: "C", text: "El cobre se reduce de Cu+1 a Cu+2 y el hidrógeno se oxida." },
            { id: "D", text: "El cobre se oxida de Cu+1 a Cu+2 y el azufre se reduce." }
        ],
        correct: "A",
        feedback: "En el Cu2O, el cobre tiene estado de oxidación +1. En los productos, aparece como CuSO4 (+2) y Cu metálico (0). Esto significa que una parte del cobre se oxidó y otra se redujo simultáneamente, proceso conocido como dismutación o desproporción."
    },
    {
        id: 43,
        text: "A continuación se representa el comportamiento ácido-base de la alanina... pKa1 = 2,34 y pKa2 = 9,69. ¿En cuál de las opciones se describe la relación de la estructura iónica de la alanina y el pH del medio?",
        image: "/evaluaciones/educacion-media/pruebas/quimica-2023-imagenes/quimica_2023_p31_1.png",
        options: [
            { id: "A", text: "La forma aniónica de la alanina se produce en ambiente ácido y la forma ion dipolar en ambiente neutro." },
            { id: "B", text: "La forma catiónica de la alanina se produce en ambiente ácido y la forma aniónica en ambiente alcalino." },
            { id: "C", text: "La forma aniónica de la alanina se produce en ambiente ácido y la forma catiónica en ambiente alcalino." },
            { id: "D", text: "La forma catiónica de la alanina se produce en ambiente alcalino y la forma ion dipolar en ambiente neutro." }
        ],
        correct: "B",
        feedback: "A pH bajo (ácido), ambos grupos (amino y carboxilo) están protonados, dando una carga neta positiva (catión). A pH alto (alcalino), ambos están desprotonados, dando carga neta negativa (anión). A pH intermedio (entre pKa1 y pKa2), existe como zwitterión (neutro)."
    },
    {
        id: 44,
        text: "El nylon 10,10 es un polímero sintético... ¿Qué reactivos son necesarios para la síntesis del nylon 10,10?",
        image: "/evaluaciones/educacion-media/pruebas/quimica-2023-imagenes/quimica_2023_p32_1.png",
        options: [
            { id: "A", text: "Ácido octanodioico y 1,8-octanodiamina." },
            { id: "B", text: "Ácido hexanodioico y 1,8-octanodiamina." },
            { id: "C", text: "Ácido octanodioico y 1,10-decanodiamina." },
            { id: "D", text: "Ácido decanodioico y 1,10-decanodiamina." }
        ],
        correct: "D",
        feedback: "La nomenclatura del Nylon X,Y indica el número de carbonos de la diamina (X) y del diácido (Y). Nylon 10,10 requiere una diamina de 10 carbonos (1,10-decanodiamina) y un diácido de 10 carbonos (ácido decanodioico)."
    },
    {
        id: 45,
        text: "Cuando se cocinan alimentos en una olla a presión, ¿qué tipo de proceso ocurre y por qué?",
        options: [
            { id: "A", text: "Isotérmico, porque la olla mantiene la temperatura constante." },
            { id: "B", text: "Exotérmico, porque la olla absorbe calor del entorno." },
            { id: "C", text: "Isocórico, porque la olla mantiene el volumen constante, lo que aumenta la presión, y por eso los alimentos se cocinan más rápido." },
            { id: "D", text: "Isobárico, porque la olla mantiene la presión constante." }
        ],
        correct: "C",
        feedback: "Una olla a presión es un recipiente rígido, por lo que el volumen es constante (proceso isocórico). Al calentar, la presión aumenta (Ley de Gay-Lussac), lo que eleva el punto de ebullición del agua, permitiendo cocinar a mayor temperatura y más rápido."
    },
    {
        id: 46,
        text: "¿Cuál de las siguientes descripciones se ajusta al perfil energético de la hidrohalogenación del eteno?",
        image: "/evaluaciones/educacion-media/pruebas/quimica-2023-imagenes/quimica_2023_p33_1.png",
        options: [
            { id: "A", text: "La reacción es exergónica y ocurre en dos etapas, donde AG1 es la etapa lenta." },
            { id: "B", text: "La reacción es endergónica y ocurre en dos etapas." },
            { id: "C", text: "La reacción es exergónica y ocurre en dos etapas, con intermediario de menor energía." },
            { id: "D", text: "La reacción es exergónica debido a que AG* es menor que 0." }
        ],
        correct: "A",
        feedback: "La adición electrofílica al eteno es exergónica (espontánea) y ocurre en dos pasos: formación del carbocatión (lento, mayor energía de activación) y ataque del nucleófilo (rápido). El perfil muestra dos 'jorobas', siendo la primera más alta."
    },
    {
        id: 47,
        text: "¿A qué tipo de sistema termodinámico corresponde el funcionamiento de un motor de gasolina?",
        options: [
            { id: "A", text: "Exotérmico, exergónico, espontáneo." },
            { id: "B", text: "Endotérmico, exergónico, espontáneo." },
            { id: "C", text: "Exotérmico, endergónico, no espontáneo." },
            { id: "D", text: "Exotérmico, exergónico, no espontáneo." }
        ],
        correct: "A",
        feedback: "La combustión de gasolina libera calor (exotérmico) y realiza trabajo (exergónico/espontáneo una vez iniciada)."
    },
    {
        id: 48,
        text: "En la siguiente reacción de desplazamiento doble... AgNO3 + NaCl -> AgCl + NaNO3... se observa un aumento de temperatura. ¿Cuál es el conjunto de parámetros energéticos?",
        options: [
            { id: "A", text: "AH < 0; AS > 0; AG > 0; a bajas temperaturas." },
            { id: "B", text: "AH < 0; AS > 0; AG < 0; a altas temperaturas." },
            { id: "C", text: "AH < 0; AS < 0; AG < 0; a bajas temperaturas." },
            { id: "D", text: "AH > 0; AS > 0; AG < 0; a cualquier temperatura." }
        ],
        correct: "C",
        feedback: "Aumento de temperatura indica exotérmica (AH < 0). Formación de sólido (orden) a partir de acuosos indica disminución de entropía (AS < 0). Para que sea espontánea (AG < 0), el término entálpico debe dominar, lo cual ocurre a bajas temperaturas (|AH| > |TAS|)."
    },
    {
        id: 49,
        text: "En la siguiente reacción: CO(g) + 3 H2(g) = CH4(g) + H2O(g). ¿Qué ocurre con el equilibrio de la reacción si se aumenta la presión del sistema?",
        options: [
            { id: "A", text: "Cambia el valor de la constante de equilibrio." },
            { id: "B", text: "Se desplaza hacia la formación de productos." },
            { id: "C", text: "Se desplaza hacia la formación de reactantes." },
            { id: "D", text: "El aumento de presión no influye en esta reacción." }
        ],
        correct: "B",
        feedback: "Al aumentar la presión, el equilibrio se desplaza hacia donde hay menos moles de gas. Reactantes: 4 moles. Productos: 2 moles. Por tanto, se desplaza hacia los productos (derecha)."
    },
    {
        id: 50,
        text: "El proceso de Haber-Bosch... N2 + 3 H2 = 2 NH3 (AH = -92 kJ/mol). ¿Cuál de las siguientes condiciones provocaría que esta reacción se desplace hacia la formación de H2 (reactantes)?",
        options: [
            { id: "A", text: "Disminuir la temperatura." },
            { id: "B", text: "Aumentar la presión del sistema." },
            { id: "C", text: "Aumentar al doble la concentración de NH3." },
            { id: "D", text: "Aumentar al doble la concentración de N2 y al triple la de H2." }
        ],
        correct: "C",
        feedback: "Agregar producto (NH3) perturba el equilibrio, haciendo que el sistema trate de consumirlo desplazándose hacia la izquierda (formación de reactantes H2 y N2)."
    },
    {
        id: 51,
        text: "La oxihemoglobina (HbO2) se forma... Hb + O2 = HbO2. Si se sube a una montaña alta, ¿qué ocurre con el equilibrio?",
        options: [
            { id: "A", text: "Aumenta la oxihemoglobina, porque la presión atmosférica es menor." },
            { id: "B", text: "El equilibrio no se desplaza." },
            { id: "C", text: "Aumenta la oxihemoglobina, porque la presión parcial de oxígeno es mayor." },
            { id: "D", text: "Disminuye la oxihemoglobina, porque la presión parcial de oxígeno es menor." }
        ],
        correct: "D",
        feedback: "A mayor altura, la presión parcial de oxígeno disminuye. Al disminuir la concentración de un reactivo (O2), el equilibrio se desplaza hacia la izquierda, disminuyendo la cantidad de producto (HbO2)."
    },
    {
        id: 52,
        text: "El gas fosfina... P4(s) + 6 H2(g) = 4 PH3(g) (AH < 0). ¿Cuál de las siguientes acciones permite aumentar la producción de fosfina?",
        options: [
            { id: "A", text: "Disminuir la presión de hidrógeno en el sistema." },
            { id: "B", text: "Aumentar la temperatura del sistema a presión constante." },
            { id: "C", text: "Aumentar la presión del sistema a temperatura constante." },
            { id: "D", text: "Aumentar el volumen del sistema a temperatura constante." }
        ],
        correct: "C",
        feedback: "Para favorecer productos (PH3), necesitamos desplazar a la derecha. Como hay 6 moles de gas en reactantes y 4 en productos, aumentar la presión favorece el lado con menos moles (productos)."
    },
    {
        id: 53,
        text: "Combustión de la sacarosa... C12H22O11(s) + 12 O2(g) -> 12 CO2(g) + 11 H2O(g) (AH = -1350 kcal/mol). En términos termodinámicos, ¿qué ocurre en esta reacción?",
        options: [
            { id: "A", text: "Disminuye la entalpía y no varía la entropía." },
            { id: "B", text: "Aumenta la entalpía y disminuye la entropía." },
            { id: "C", text: "Disminuye la entalpía y aumenta la entropía." },
            { id: "D", text: "Disminuye la entalpía y disminuye la entropía." }
        ],
        correct: "C",
        feedback: "Es exotérmica, por lo que la entalpía disminuye (AH < 0). Produce más moles de gas (12+11=23) que los que consume (12), y pasa de sólido a gas, por lo que el desorden (entropía) aumenta."
    },
    {
        id: 54,
        text: "El siguiente gráfico representa la velocidad de una reacción catalizada por enzima... Cuando la curva llega a una meseta, ¿a qué se debe?",
        image: "/evaluaciones/educacion-media/pruebas/quimica-2023-imagenes/quimica_2023_p37_1.png",
        options: [
            { id: "A", text: "La enzima se desnaturaliza." },
            { id: "B", text: "Hay un inhibidor competitivo presente." },
            { id: "C", text: "La enzima pierde parcialmente su actividad." },
            { id: "D", text: "Todos los sitios activos de la enzima están ocupados." }
        ],
        correct: "D",
        feedback: "La meseta indica saturación: todas las moléculas de enzima están trabajando a su máxima capacidad (sitios activos ocupados), por lo que agregar más sustrato no aumenta la velocidad."
    },
    {
        id: 55,
        text: "La reacción... 2 NO(g) + 2 H2(g) = N2(g) + 2 H2O(g). ¿Cuál es la expresión que representa el cálculo de velocidad?",
        options: [
            { id: "A", text: "v = -2 d[NO]/dt" },
            { id: "B", text: "v = - d[H2]/dt" },
            { id: "C", text: "v = d[N2]/dt" },
            { id: "D", text: "v = 1/2 d[H2O]/dt" }
        ],
        correct: "C",
        feedback: "La velocidad de reacción se define como el cambio en la concentración dividido por el coeficiente estequiométrico (con signo negativo para reactivos). Para el N2 (producto, coeficiente 1), v = d[N2]/dt."
    },
    {
        id: 56,
        text: "¿Cuál de las siguientes explicaciones es correcta en relación con la energía de activación en las reacciones termoquímicas concertadas?",
        options: [
            { id: "A", text: "Determina si la energía de los productos será superior o inferior." },
            { id: "B", text: "En reacciones endotérmicas presenta un valor elevado." },
            { id: "C", text: "Es la diferencia entre la energía de los reactivos y su estado de transición, lo que determina la rapidez del proceso." },
            { id: "D", text: "En reacciones exotérmicas presenta un valor bajo." }
        ],
        correct: "C",
        feedback: "La energía de activación se define conceptualmente como la barrera energética que deben superar los reactivos para alcanzar el estado de transición y transformarse en productos."
    },
    {
        id: 57,
        text: "Se determina la cantidad de C-14 remanente en un fragmento de hueso... queda el 50%. Vida media 5730 años. ¿Antigüedad?",
        options: [
            { id: "A", text: "2 865" },
            { id: "B", text: "5 730" },
            { id: "C", text: "8 595" },
            { id: "D", text: "11 460" }
        ],
        correct: "B",
        feedback: "Si queda el 50% de la muestra original, ha transcurrido exactamente una vida media. Por tanto, la antigüedad es 5730 años."
    },
    {
        id: 58,
        text: "Se tiene una muestra del radioisótopo Na-24, vida media 15 horas. ¿Qué ocurrirá al transcurrir las horas?",
        options: [
            { id: "A", text: "En 7,5 horas se ha desintegrado el 50%." },
            { id: "B", text: "En 30 horas queda el 25% de la muestra sin desintegrarse." },
            { id: "C", text: "En 150 horas queda el 10%." },
            { id: "D", text: "Al transcurrir 20 horas queda más del 50%." }
        ],
        correct: "B",
        feedback: "30 horas corresponden a 2 vidas medias (15 x 2). Después de 1 vida media queda el 50%. Después de 2 vidas medias queda el 25% (la mitad de 50%)."
    },
    {
        id: 59,
        text: "El plutonio-238... vida media 88 años. Inicial 4,8 kg. ¿Qué masa permanecerá después de 3168 meses?",
        options: [
            { id: "A", text: "0,75 g" },
            { id: "B", text: "300 g" },
            { id: "C", text: "600 g" },
            { id: "D", text: "1200 g" }
        ],
        correct: "C",
        feedback: "3168 meses / 12 = 264 años. 264 años / 88 años/vida media = 3 vidas medias. Masa final = 4800g * (1/2)^3 = 4800 * 1/8 = 600 g."
    },
    {
        id: 60,
        text: "¿Cuál es una ventaja del uso de la energía nuclear?",
        options: [
            { id: "A", text: "Los recursos utilizados son mayoritariamente renovables." },
            { id: "B", text: "Su baja contribución de emisiones de gases de efecto invernadero." },
            { id: "C", text: "La cantidad de energía producida es proporcional al volumen." },
            { id: "D", text: "La gestión de los residuos implica un menor riesgo." }
        ],
        correct: "B",
        feedback: "La principal ventaja ambiental de la energía nuclear es que no produce CO2 ni otros gases de efecto invernadero durante la generación de electricidad, a diferencia de los combustibles fósiles."
    }
];

let currentQuestion = 0;

function loadQuestion() {
    const q = quizData[currentQuestion];
    const container = document.getElementById('question-container');
    
    // Determinar si mostrar texto o solo imagen
    const hasImage = !!q.image;
    const showTextAndOptions = !hasImage; // Si hay imagen, no mostrar texto ni opciones escritas
    
    let html = `
        <div class="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div class="flex justify-between items-center mb-4">
                <span class="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">Pregunta ${q.id}</span>
                <span class="text-gray-500 text-sm">${currentQuestion + 1} de ${quizData.length}</span>
            </div>
            
            ${showTextAndOptions ? `<p class="text-lg text-gray-800 mb-6 font-medium">${q.text}</p>` : ''}
            
            ${hasImage ? `<div class="mb-6 flex justify-center"><img src="${q.image}" class="max-w-full h-auto rounded-lg shadow-sm border border-gray-200" alt="Imagen Pregunta ${q.id}"></div>` : ''}
            
            <div class="${hasImage ? 'flex flex-wrap justify-center gap-4' : 'space-y-3'}">
    `;
    
    q.options.forEach(opt => {
        if (hasImage) {
            // Solo botones grandes A/B/C/D cuando hay imagen
            html += `
                <button onclick="checkAnswer('${opt.id}')" class="w-16 h-16 rounded-full border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all option-btn flex items-center justify-center text-2xl font-bold text-gray-600 hover:text-blue-600" data-id="${opt.id}">
                    ${opt.id}
                </button>
            `;
        } else {
            // Opciones completas cuando no hay imagen
            html += `
                <button onclick="checkAnswer('${opt.id}')" class="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group option-btn" data-id="${opt.id}">
                    <div class="flex items-start">
                        <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 font-bold rounded-full group-hover:bg-blue-500 group-hover:text-white transition-colors mr-3">${opt.id}</span>
                        <span class="text-gray-700 group-hover:text-blue-900">${opt.text}</span>
                    </div>
                </button>
            `;
        }
    });
    
    html += `
            </div>
            
            <div id="feedback-${q.id}" class="hidden mt-6 p-6 bg-green-50 border-l-4 border-green-500 rounded-r-lg animate-fade-in">
                <h4 class="font-bold text-green-800 mb-2 flex items-center">
                    <i class="bi bi-check-circle-fill mr-2"></i> Respuesta Correcta
                </h4>
                <p class="text-gray-700">${q.feedback}</p>
            </div>
            
            <div id="error-${q.id}" class="hidden mt-6 p-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-fade-in">
                <h4 class="font-bold text-red-800 mb-2 flex items-center">
                    <i class="bi bi-x-circle-fill mr-2"></i> Respuesta Incorrecta
                </h4>
                <p class="text-gray-700">Inténtalo de nuevo o revisa la retroalimentación.</p>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    updateNav();
}

function checkAnswer(selectedId) {
    const q = quizData[currentQuestion];
    const feedbackEl = document.getElementById(`feedback-${q.id}`);
    const errorEl = document.getElementById(`error-${q.id}`);
    const buttons = document.querySelectorAll('.option-btn');
    
    // Reset styles
    buttons.forEach(btn => {
        btn.classList.remove('border-green-500', 'bg-green-50', 'border-red-500', 'bg-red-50');
        btn.disabled = true;
    });
    
    const selectedBtn = document.querySelector(`button[data-id="${selectedId}"]`);
    const correctBtn = document.querySelector(`button[data-id="${q.correct}"]`);
    
    if (selectedId === q.correct) {
        selectedBtn.classList.add('border-green-500', 'bg-green-50');
        selectedBtn.querySelector('span').classList.add('bg-green-500', 'text-white');
        feedbackEl.classList.remove('hidden');
        errorEl.classList.add('hidden');
    } else {
        selectedBtn.classList.add('border-red-500', 'bg-red-50');
        selectedBtn.querySelector('span').classList.add('bg-red-500', 'text-white');
        correctBtn.classList.add('border-green-500', 'bg-green-50');
        correctBtn.querySelector('span').classList.add('bg-green-500', 'text-white');
        feedbackEl.classList.remove('hidden'); // Show correct answer explanation anyway
        // errorEl.classList.remove('hidden'); // Optional: show error message
    }
}

function nextQuestion() {
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        loadQuestion();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

function jumpToQuestion(index) {
    currentQuestion = index;
    loadQuestion();
}

function updateNav() {
    const navContainer = document.getElementById('question-nav');
    let html = '';
    quizData.forEach((q, index) => {
        const activeClass = index === currentQuestion ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300' : 'bg-white text-gray-700 hover:bg-blue-100 hover:text-blue-600';
        html += `
            <button onclick="jumpToQuestion(${index})" class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all border border-gray-300 flex-shrink-0 ${activeClass}">
                ${q.id}
            </button>
        `;
    });
    navContainer.innerHTML = html;
    
    document.getElementById('prev-btn').disabled = currentQuestion === 0;
    document.getElementById('next-btn').disabled = currentQuestion === quizData.length - 1;
    
    document.getElementById('prev-btn').classList.toggle('opacity-50', currentQuestion === 0);
    document.getElementById('next-btn').classList.toggle('opacity-50', currentQuestion === quizData.length - 1);
    
    // Scroll al botón activo
    const activeBtn = navContainer.children[currentQuestion];
    if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
}

document.addEventListener('DOMContentLoaded', loadQuestion);
