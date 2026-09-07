window.SIMCE_U3S9_DATA = {
  session: 'sesion-u3-8',
  reviewOf: {
    titulo: 'Unidad 3 · Clase 9 — Corrección del ensayo',
    fuente: 'Ensayo parcial de la Clase 8 (7 textos, 36 preguntas).'
  },
  practica: {
    LOCALIZAR: {
      titulo: 'Localizar y obtener información',
      atencion: 'Busca el dato exacto que pide la pregunta en el texto. No lo deduzcas: si el texto no lo dice con esas palabras o un sinónimo directo, no es la respuesta.',
      texto: {
        titulo: 'Nuevo horario de la biblioteca municipal',
        genre: 'Noticia',
        body: `<p>La biblioteca municipal informó que, a partir del lunes 14 de septiembre, ampliará su horario de atención. Actualmente abre de 9:00 a 18:00 de lunes a viernes. Desde esa fecha, funcionará también los sábados, entre las 10:00 y las 14:00.</p><p>La encargada, Marcela Ibáñez, explicó que la medida responde a solicitudes de estudiantes que preparan pruebas los fines de semana. El nuevo horario sabatino incluirá préstamo de libros, pero no acceso a las salas de estudio grupal, que permanecerán cerradas ese día. La biblioteca solicita a quienes retiren libros el sábado que los devuelvan antes del jueves siguiente.</p>`
      },
      preguntas: [
        { id:'p-loc-1', prompt:'¿Desde qué día comenzará a funcionar el nuevo horario sabatino?', options:{ A:'Desde el lunes 14 de septiembre.', B:'Desde el próximo sábado.', C:'Desde el jueves siguiente.', D:'Desde el 9 de septiembre.' }, correcta:'A',
          why:{ A:'Correcta. El texto lo dice de forma literal: "a partir del lunes 14 de septiembre".',
                B:'Trampa (invención plausible): "el próximo sábado" no es la fecha que declara el texto.',
                C:'Trampa (cambio de foco): el jueves siguiente es el plazo para devolver libros, no la fecha de inicio del horario.',
                D:'Trampa (invención plausible): esa fecha no aparece en el texto; se acerca a la real pero no es la declarada.' },
          cita:'"a partir del lunes 14 de septiembre, ampliará su horario de atención".' },
        { id:'p-loc-2', prompt:'Según el texto, ¿qué servicio NO estará disponible los sábados?', options:{ A:'El préstamo de libros.', B:'Las salas de estudio grupal.', C:'La atención en biblioteca.', D:'La devolución de libros.' }, correcta:'B',
          why:{ A:'Trampa (contrasentido): el texto dice que el préstamo de libros SÍ está incluido el sábado.',
                B:'Correcta. El texto lo aclara explícitamente: "no acceso a las salas de estudio grupal, que permanecerán cerradas ese día".',
                C:'Trampa (invención plausible): la atención general no se menciona como suspendida.',
                D:'Trampa (invención plausible): la devolución se menciona con un plazo, no como servicio no disponible.' },
          cita:'"no acceso a las salas de estudio grupal, que permanecerán cerradas ese día".' }
      ]
    },
    INTERPRETAR: {
      titulo: 'Relacionar e interpretar',
      atencion: 'Pregúntate qué función cumple la parte señalada dentro de todo el texto: no repitas lo que dice, explica para qué está ahí.',
      texto: {
        titulo: 'El semáforo que nadie apuraba',
        genre: 'Relato',
        body: `<p>Cuando instalaron el semáforo en la esquina de la escuela, varios vecinos protestaron: decían que la calle nunca había tenido un accidente y que el nuevo poste solo iba a generar tacos. Doña Elena, que vendía sopaipillas ahí desde hacía veinte años, fue la única que no dijo nada.</p><p>Los primeros días, en efecto, los autos se detenían más de lo necesario, inseguros frente a la luz roja. Pero con las semanas el ritmo cambió: los niños ya no cruzaban corriendo entre los autos, y los conductores empezaron a frenar antes de llegar a la esquina, no después.</p><p>Un mes más tarde, alguien preguntó a doña Elena qué pensaba del semáforo. Ella señaló su carrito, todavía en el mismo lugar de siempre, y respondió: «Antes tenía que estar mirando para todos lados. Ahora solo vendo sopaipillas».</p>`
      },
      preguntas: [
        { id:'p-int-1', prompt:'¿Qué función cumple la última frase de doña Elena en el relato?', options:{ A:'Explica por qué el semáforo generó más accidentes de tránsito.', B:'Muestra, desde su experiencia cotidiana, que la calle se volvió más segura.', C:'Critica a los vecinos que protestaron contra el semáforo.', D:'Describe el proceso técnico de instalación del semáforo.' }, correcta:'B',
          why:{ A:'Trampa (cambio de foco): el relato no habla de causas de accidentes, ni los menciona en ningún momento.',
                B:'Correcta. La frase no habla de tránsito en abstracto, sino de su propia rutina: antes vigilaba, ahora no necesita hacerlo. Es evidencia indirecta de que la calle se volvió más segura.',
                C:'Trampa (invención plausible): la frase no critica a nadie, describe un cambio en su propia vida.',
                D:'Trampa (literalización): no describe ningún proceso técnico de instalación.' },
          cita:'«Antes tenía que estar mirando para todos lados. Ahora solo vendo sopaipillas».' },
        { id:'p-int-2', prompt:'¿Qué idea central se puede extraer del relato?', options:{ A:'Los vecinos siempre tienen razón al oponerse a un cambio.', B:'Una medida cuestionada al principio puede demostrar su utilidad con el tiempo.', C:'Los semáforos son innecesarios en calles sin accidentes previos.', D:'El comercio ambulante depende del tránsito vehicular.' }, correcta:'B',
          why:{ A:'Trampa (sobregeneralización): el relato no sostiene que los vecinos "siempre" tengan razón, solo cuenta un caso.',
                B:'Correcta. El relato muestra un cambio: protesta inicial, incomodidad los primeros días, y después un beneficio real confirmado por el testimonio de doña Elena.',
                C:'Trampa (contrasentido): el relato muestra justamente que el semáforo sí resultó útil.',
                D:'Trampa (cambio de foco): el comercio de doña Elena no es el tema central del relato.' },
          cita:'"con las semanas el ritmo cambió: los niños ya no cruzaban corriendo entre los autos".' }
      ]
    },
    REFLEXIONAR: {
      titulo: 'Reflexionar y evaluar',
      atencion: 'Para detectar una falla de argumentación, pregúntate qué evidencia falta o qué recurso se usa para convencer sin aportar pruebas reales.',
      texto: {
        titulo: '¿Todos lo dicen?',
        genre: 'Columna de opinión',
        body: `<p>Un aviso publicitario asegura: «El 90% de los jóvenes ya cambió a esta marca de zapatillas». La cifra suena contundente, pero no explica de dónde salió: ¿se preguntó a cien personas en una tienda de la marca? ¿A mil estudiantes de un solo colegio? Sin esa información, el dato funciona más como un gancho emocional —nadie quiere ser del 10% que se quedó atrás— que como una prueba real.</p><p>Además, el aviso no menciona el precio, la duración del producto ni comparaciones con otras marcas: solo repite la cifra en letras grandes, tres veces en el mismo afiche. Convencer no debería depender de cuántas veces se repite una frase, sino de la calidad de la evidencia que la respalda.</p>`
      },
      preguntas: [
        { id:'p-ref-1', prompt:'¿Qué falla de argumentación denuncia principalmente el texto sobre el aviso publicitario?', options:{ A:'Que usa un porcentaje sin indicar cómo ni a quiénes se consultó.', B:'Que compara el precio con el de otras marcas.', C:'Que no repite suficientes veces la cifra para convencer.', D:'Que menciona la duración del producto sin pruebas.' }, correcta:'A',
          why:{ A:'Correcta. El texto cuestiona la cifra "90%" precisamente porque no se sabe cómo se obtuvo ni a quiénes se preguntó: una cifra sin respaldo metodológico.',
                B:'Trampa (invención plausible): el aviso no compara precios con otras marcas, el texto lo aclara.',
                C:'Trampa (contrasentido): el problema no es que repita poco la cifra, sino que carece de respaldo.',
                D:'Trampa (invención plausible): el aviso no menciona la duración del producto en ningún momento.' },
          cita:'"no explica de dónde salió: ¿se preguntó a cien personas en una tienda de la marca? ¿A mil estudiantes de un solo colegio?".' },
        { id:'p-ref-2', prompt:'¿Con qué propósito el autor pregunta «¿se preguntó a cien personas en una tienda de la marca?»?', options:{ A:'Para informar el método real que usó la empresa.', B:'Para cuestionar, con un ejemplo, la falta de respaldo de la cifra.', C:'Para proponer una nueva forma de hacer encuestas escolares.', D:'Para explicar por qué el producto sería de mala calidad, sin pruebas.' }, correcta:'B',
          why:{ A:'Trampa (literalización): la pregunta es hipotética, no informa un método que la empresa realmente haya usado.',
                B:'Correcta. Es una pregunta retórica: no describe lo que realmente pasó, sino que plantea un escenario posible para mostrar cuánto se ignora sobre el origen del dato.',
                C:'Trampa (invención plausible): el texto no propone ninguna metodología de encuestas.',
                D:'Trampa (cambio de foco): el texto no evalúa la calidad del producto, evalúa la calidad del argumento.' },
          cita:'"¿se preguntó a cien personas en una tienda de la marca? ¿A mil estudiantes de un solo colegio?".' }
      ]
    }
  },
  items: [
    { id:'q1', correcta:'B', explicacion:'El texto lo dice de forma literal: "la guardó en el bolsillo sin preguntar qué película se había exhibido". No hay fotografía ni comparación con otras entradas; ese dato se inventa.' },
    { id:'q2', correcta:'D', explicacion:'Todo el relato gira en torno al cierre del cine y su transformación en farmacia: la última función es una despedida. La falla técnica (A) es un episodio, no el conflicto completo, y el abuelo no muestra dificultad para aceptar el cambio (C).' },
    { id:'q3', correcta:'A', explicacion:'Cuando se corta el sonido, el público inventa diálogos, imita puertas y marca el ritmo con palmas: convierte la falla en una experiencia compartida y creativa, no en un rechazo ni en una queja hacia don Rafael.' },
    { id:'q4', correcta:'C', explicacion:'El letrero "Estrella" incompleto abre y cierra el relato como símbolo de un lugar deteriorado que igual conserva valor para los vecinos, que se fotografían bajo él y se quedan conversando debajo.' },
    { id:'q5', correcta:'B', explicacion:'Emilia señala el letrero y a la gente que sigue reunida bajo él: la experiencia del cine estuvo también en los vínculos entre las personas, no en la pantalla ni en la calle escuchando la función.' },
    { id:'q6', correcta:'D', explicacion:'"Una despedida que reúne voces" resume el cierre del cine, la última función y el momento en que el público improvisa diálogos juntos; los otros títulos se quedan en un detalle (la entrada, la farmacia, la falla técnica).' },
    { id:'q7', correcta:'A', explicacion:'El artículo completo argumenta que la calidad de la iluminación depende de la orientación, continuidad y distribución de la luz, no solo de su potencia; esa es la idea que organiza todos los párrafos.' },
    { id:'q8', correcta:'C', explicacion:'El texto lo entrega directo: "los puntos oscuros disminuyeron aunque el consumo eléctrico total fue menor". No se afirma una baja sostenida de delitos (A): el propio texto aclara que eso no se puede concluir.' },
    { id:'q9', correcta:'D', explicacion:'La aclaración funciona como un límite explícito a la evidencia: el proyecto piloto no alcanza para probar una reducción de delitos, y el texto lo dice para no exagerar sus propios resultados.' },
    { id:'q10', correcta:'B', explicacion:'Los vecinos identifican árboles, cruces y un paradero con poca luz: información sobre usos y horarios reales del espacio que un plano técnico no registra por sí solo.' },
    { id:'q11', correcta:'A', explicacion:'La conclusión del proyecto es puntual (menos puntos oscuros, menor consumo, mismos pasajes); lo que más la refuerza es medir antes y después en esos mismos lugares, no una encuesta nacional de preferencias.' },
    { id:'q12', correcta:'C', explicacion:'El poema pide no buscar "la casa en la fotografía" sino la piedra, el olor, la voz: reconocer el lugar por huellas cotidianas y aceptar que cambió, no reconstruirlo intacto ni evitarlo.' },
    { id:'q13', correcta:'B', explicacion:'"La puerta aprendió otro color" es una imagen del paso del tiempo: algo que se recordaba de una manera ahora es distinto. No hay ocultamiento deliberado ni reemplazo literal por una ventana.' },
    { id:'q14', correcta:'D', explicacion:'El río que mueve el puente mientras el puente "finge sostenerlo" cuestiona la apariencia de estabilidad frente a un cambio que sigue ocurriendo; no es una descripción literal de una construcción.' },
    { id:'q15', correcta:'A', explicacion:'La primera estrofa busca lo intacto ("no busques la casa en la fotografía") y la última acepta ser reconocido distinto ("algo también te reconoce distinto"): de la búsqueda a la aceptación mutua del cambio.' },
    { id:'q16', correcta:'C', explicacion:'Todo el poema trabaja la tensión entre recordar y aceptar el cambio: el regreso como encuentro entre la memoria y las transformaciones del tiempo, no como la imposibilidad de recordar.' },
    { id:'q17', correcta:'D', explicacion:'El gráfico marca junio con la barra más alta y el valor 630, el máximo del periodo abril–julio.' },
    { id:'q18', correcta:'A', explicacion:'630 (junio) menos 420 (abril) es 210 visitas de diferencia; hay que restar los valores del gráfico, no los de otra columna de la tabla.' },
    { id:'q19', correcta:'B', explicacion:'Calculando con la tabla: 126/420, 153/510, 189/630 y 180/600 dan 30 % cada mes. Los préstamos a domicilio equivalen de forma estable al 30 % de las visitas, no a la mitad de los talleres.' },
    { id:'q20', correcta:'C', explicacion:'La nota metodológica indica que en julio hubo una semana de vacaciones escolares, dato que explica directamente la baja de visitas respecto a junio.' },
    { id:'q21', correcta:'D', explicacion:'La nota metodológica lo advierte: "los registros cuentan ingresos, no personas únicas: un mismo estudiante puede aparecer varias veces". Por eso 630 es un conteo de ingresos, no de estudiantes distintos.' },
    { id:'q22', correcta:'B', explicacion:'La columna propone trazabilidad: declarar el uso, comparar con fuentes y explicar correcciones. No defiende usar IA en todo (A) ni prohibirla (C); busca un término medio con criterios.' },
    { id:'q23', correcta:'C', explicacion:'La autora reconoce primero la objeción ("es cierto, revisar tarda más") y recién después explica por qué esa revisión también enseña: es un movimiento concesivo, no un abandono de su postura.' },
    { id:'q24', correcta:'A', explicacion:'El texto lo enumera de forma explícita: "declarar cuándo se usó una herramienta, comparar su propuesta con fuentes y explicar qué se corrigió".' },
    { id:'q25', correcta:'D', explicacion:'La autora cuestiona dos extremos (prohibir o celebrar sin criterio) y propone una postura intermedia con condiciones de uso: es un tono crítico y propositivo, no alarmista ni nostálgico.' },
    { id:'q26', correcta:'B', explicacion:'Comparar la respuesta generada con fuentes, corregir errores y declarar el apoyo usado es exactamente la trazabilidad que defiende la columna; entregar sin cambios (A) es lo que la autora critica.' },
    { id:'q27', correcta:'A', explicacion:'Elena lo dice directamente: antes de trasladar aves hay que "controlar residuos, recuperar flujos de agua y disminuir perturbaciones"; los animales deberían llegar solos si el hábitat funciona.' },
    { id:'q28', correcta:'D', explicacion:'"Una decoración" se opone a que la presencia de fauna sea consecuencia de un hábitat que realmente funciona, no un adorno para la foto o las visitas.' },
    { id:'q29', correcta:'C', explicacion:'Cada pregunta del periodista (juncos, aves, comerciantes) obliga a Elena a matizar su postura con un caso concreto, precisando su argumento en vez de repetirlo en abstracto.' },
    { id:'q30', correcta:'B', explicacion:'Elena responde "cuidar no equivale a cerrar" y propone horarios y zonas de uso: coincide con los comerciantes en que el uso público importa, pero condicionándolo a no dañar los procesos ecológicos.' },
    { id:'q31', correcta:'A', explicacion:'Elena cierra afirmando que el éxito exige medir calidad del agua, vegetación, especies y comportamiento de las visitas durante varios años; un indicador coherente combina esas variables en el tiempo.' },
    { id:'q32', correcta:'C', explicacion:'El aviso informa las condiciones iniciales y anuncia una revisión final; el correo aporta observaciones para mejorar esa evaluación. Ambos apuntan a orientar el funcionamiento y la evaluación del piloto.' },
    { id:'q33', correcta:'B', explicacion:'El Documento A presenta condiciones de partida (horario, requisitos, duración); el Documento B responde con ajustes y preguntas concretas (horario nocturno, fecha de mantención, recargas vs. botellas).' },
    { id:'q34', correcta:'D', explicacion:'La junta vecinal lo pide explícitamente: "publicar la fecha de cada mantención en la misma estación", porque saber que existe un filtro no dice cuándo fue revisado.' },
    { id:'q35', correcta:'A', explicacion:'El correo lo explica: "una botella puede rellenarse varias veces", así que el número de recargas y la cantidad de botellas evitadas no son la misma cifra.' },
    { id:'q36', correcta:'C', explicacion:'Para saber si el horario (08:00–20:00) responde al uso real hace falta un registro de actividades y recargas por franja horaria, no el precio de otras estaciones ni el diseño visual.' }
  ]
};
