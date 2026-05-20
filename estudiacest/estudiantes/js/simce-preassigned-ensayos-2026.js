(function () {
    function textBlock(id, tipo, subtipo, titulo, fuente, parrafos, extras) {
        var block = {
            id: id,
            tipo: tipo,
            subtipo: subtipo,
            titulo: titulo,
            parrafos: parrafos.map(function (texto, index) {
                return { num: index + 1, texto: texto };
            }),
            fuente: fuente
        };

        Object.keys(extras || {}).forEach(function (key) {
            block[key] = extras[key];
        });

        return block;
    }

    function mcq(id, textoRef, habilidad, enunciado, correcta, opciones) {
        var letters = ['A', 'B', 'C', 'D'];
        return {
            id: id,
            textoRef: textoRef,
            habilidad: habilidad,
            enunciado: enunciado,
            opciones: opciones.map(function (texto, index) {
                return { letra: letters[index], texto: texto };
            }),
            correcta: correcta
        };
    }

    function dataPanel(title, summary, headers, rows, bars, note) {
        var html = '<div style="margin-top:16px;padding:14px 16px;border:1px solid #cbd5e1;border-radius:14px;background:linear-gradient(180deg,#f8fbff 0%,#eef6ff 100%);">';
        html += '<div style="font-size:13px;font-weight:800;color:#0f172a;margin-bottom:6px;">' + title + '</div>';
        if (summary) {
            html += '<div style="font-size:12px;color:#475569;line-height:1.5;margin-bottom:10px;">' + summary + '</div>';
        }

        if ((headers || []).length && (rows || []).length) {
            html += '<div style="overflow-x:auto;margin-bottom:' + ((bars || []).length ? '12px' : '0') + ';">';
            html += '<table style="width:100%;border-collapse:collapse;font-size:12px;min-width:460px;">';
            html += '<thead><tr>' + headers.map(function (header) {
                return '<th style="padding:8px 10px;border:1px solid #bfdbfe;background:#1d4ed8;color:#fff;text-align:left;">' + header + '</th>';
            }).join('') + '</tr></thead>';
            html += '<tbody>' + rows.map(function (row, rowIndex) {
                return '<tr style="background:' + (rowIndex % 2 === 0 ? '#ffffff' : '#f8fafc') + ';">' + row.map(function (cell, cellIndex) {
                    return '<td style="padding:8px 10px;border:1px solid #dbeafe;font-weight:' + (cellIndex === 0 ? '600' : '400') + ';color:#1e293b;">' + cell + '</td>';
                }).join('') + '</tr>';
            }).join('') + '</tbody></table></div>';
        }

        if ((bars || []).length) {
            html += '<div style="display:grid;gap:8px;">';
            bars.forEach(function (bar) {
                html += '<div>';
                html += '<div style="display:flex;justify-content:space-between;gap:10px;font-size:11px;color:#334155;margin-bottom:3px;">';
                html += '<span>' + bar.label + '</span>';
                html += '<strong style="color:#0f172a;">' + (bar.display || (bar.value + (bar.suffix || '%'))) + '</strong>';
                html += '</div>';
                html += '<div style="height:10px;background:#dbeafe;border-radius:999px;overflow:hidden;">';
                html += '<div style="height:100%;width:' + bar.value + '%;background:' + (bar.color || '#2563eb') + ';border-radius:999px;"></div>';
                html += '</div>';
                html += '</div>';
            });
            html += '</div>';
        }

        if (note) {
            html += '<div style="margin-top:10px;font-size:11px;color:#475569;line-height:1.45;">' + note + '</div>';
        }

        html += '</div>';
        return html;
    }

    function buildEnsayo(config) {
        return {
            titulo: config.titulo,
            descripcion: config.descripcion,
            orden: config.orden,
            activa: true,
            resultados_visibles: false,
            video_youtube: null,
            programa: 'simce',
            tecnicas: false,
            tiempo_limite: 70,
            notas_evaluadas: false,
            anticopia_activo: true,
            envio_parcial: false,
            barajar_bloques: config.barajarBloques === true,
            panel_seccion: 'ensayo',
            panel_unidad: config.panelUnidad || 'u2',
            panel_orden: config.panelOrden,
            asignados: config.asignados,
            contenido: {
                textos: config.textos,
                preguntas: config.preguntas
            }
        };
    }

    var sessions = {
        'ensayo-simce-miércoles-2a-hc-2026': buildEnsayo({
            titulo: 'Ensayo SIMCE Miércoles - 2A HC',
            descripcion: 'Ensayo preasignado para 2A HC. 6 textos, 35 preguntas y 70 minutos de trabajo. Replica la variedad del formato oficial con textos nuevos y un bloque discontinuo.',
            orden: 11,
            barajarBloques: true,
            panelUnidad: 'u2',
            panelOrden: 2,
            asignados: ['2A-HC'],
            textos: [
                textBlock(
                    'texto-1',
                    'literario',
                    'Poema',
                    'Manual para volver sin ruido',
                    'Poema original para ensayo SIMCE CEST 2026.',
                    [
                        'Guardo en el bolsillo una llave tibia,<br>un boleto doblado y el olor del fierro.<br>No traigo noticias del mundo:<br>traigo el ruido exacto de mis pasos.',
                        'En la micro nadie celebra el regreso.<br>Por eso miro la ventana como quien repasa<br>una lección escrita en vidrios empañados:<br>volver también es un trabajo.',
                        'Al bajar, la calle conoce mis cordones,<br>las persianas que empiezan a cerrarse,<br>el pan que aún respira detrás de la bolsa.<br>Nadie aplaude ese triunfo sin testigos.',
                        'Pero hay casas que no se sostienen con muros.<br>Se sostienen con la costumbre de una llave,<br>con la luz que alguien enciende al entrar,<br>con el cuerpo que vuelve sin hacer ruido.'
                    ]
                ),
                textBlock(
                    'texto-2',
                    'literario',
                    'Cuento',
                    'El turno del kiosco',
                    'Texto original para ensayo SIMCE CEST 2026.',
                    [
                        'A las seis y media, Lucas levanto la cortina del kiosco del liceo antes de que sonara el primer timbre. Su tío, que solía atenderlo, llevaba dos días en reposo por una operacion menor, así que la tía Elba le pidió cubrir el turno de la mañana. Afuera llovía fino y los estudiantes llegaban con las mangas humedas, pidiendo te, pan tostado y cuadernos de último momento. Lucas anotaba cada compra en una libreta escolar de tapas verdes, sobre todo cuando alguien decia en voz baja: "Se lo pago mañana".',
                        'Los días de lluvia el kiosco parecía una estacion breve entre la calle y la sala: unos entraban tiritando, otros pedían fiado con una naturalidad que mezclaba vergüenza y costumbre, y Lucas descubria que en la libreta verde no todas las deudas pesaban igual. Había nombres que sabía de memoria y otros que aparecian solo cuando el mes se alargaba más que la plata en las casas.',
                        'A mitad del recreo una estudiante de primero medio pidió un sandwich y una leche, buscó monedas en todos los bolsillos y terminó negando con la cabeza. Lucas le pasó igual la bolsa y fingió que debía revisar la caja para no mirarla demasiado. La muchacha agradeció sin levantar los ojos y salió casi corriendo hacia la escalera del pabellon norte.',
                        'Durante el segundo recreo Lucas volvíó a mirar la libreta. Junto a varios nombres había montos pequeños, casi siempre repetidos: un te, un pan, una fotocopia, una regla comprada a última hora. Pensó que el kiosco no solo vendia cosas; también sostenía una confianza frágil, hecha de plazos cortos y gestos que nadie anunciaba en voz alta.',
                        'Cuando cerró el kiosco al final de la jornada encontró un sobre bajo la libreta verde. Adentro había el monto exacto de lo que faltaba y un papel doblado en cuatro: "Para lo de ayer. Gracias por abrir igual". No había firma. Lucas sonrió apenas y guardo la nota en el bolsillo del delantal.',
                        'Por la tarde, mientras ordenaban bebidas en la bodega, la tía Elba leyó el papel y dijo: "A veces la confianza vuelve con uniforme y mochila". Lucas no respondio. Solo tomó dos panes, un jugo pequeño y los dejo en el cajon de abajo. Desde el lunes empezó a apartar alli una colación extra, por si alguna mañana llegaba corta otra vez.'
                    ]
                ),
                textBlock(
                    'texto-3',
                    'no-literario',
                    'Columna de opinión',
                    'Tomar apuntes a mano en tiempos de captura',
                    'Columna original para ensayo SIMCE CEST 2026.',
                    [
                        'Cada vez que un profesor termina de explicar y alguien dice "Le saco una foto a la pizarra", se instala una ilusión comoda: creer que guardar la imagen equivale a guardar la idea. No es lo mismo. La fotografia conserva la superficie exacta de lo escrito, pero no registra que parte entendiste, que relación hiciste entre un concepto y otro ni que palabra elegiste para fijar lo importante. Captura señales; no organiza pensamiento.',
                        'En una experiencia realizada con 120 estudiantes de enseñanza media, un grupo fotografió esquemas y otro escribió apuntes breves con sus propias palabras. Una semana despues, quienes habían reformulado recordaban más relaciones entre ideas y cometían menos errores al explicar un procedimiento, incluso cuando el tiempo total de estudio había sido similar. La diferencia no estuvo en la cantidad guardada, sino en el trabajo mental realizado al seleccionar.',
                        'Esto no significa declarar enemigo al telefono. Sacar una imagen puede ser útil despues, cuando ya comprendiste y quieres conservar un respaldo. El problema aparece cuando el dispositivo reemplaza la decision de pensar que vale la pena anotar. Ahí se delega en la cámara una tarea que pertenece a la comprensión.',
                        'Por eso la escuela no debería reducir la discusión a "pantalla si" o "pantalla no". La pregunta más seria es otra: estamos enseñando a distinguir lo central de lo accesorio? Mientras no se enseñe ese gesto intelectual, seguiremos coleccionando fotos de pizarras completas y vaciando cuadernos.'
                    ]
                ),
                textBlock(
                    'texto-4',
                    'literario',
                    'Fragmento dramatico',
                    'La mesa del centro',
                    'Fragmento dramatico original para ensayo SIMCE CEST 2026.',
                    [
                        'TERESA, bibliotecaria, limpia una mesa de madera marcada con iniciales. BRUNO entra con una caja de afiches enrollados. BRUNO.- Si dejamos esta mesa aquí, no va a caber el material de la feria. Mejor la llevamos a la bodega antes de que se siga rayando. TERESA.- Ya esta rayada. Lo que tiene son años encima. Mira estas letras: son nombres de cursos que ya egresaron.',
                        'ELSA entra con una carpeta. ELSA.- Precisamente por eso debería quedar al centro. No para mirarla como reliquia, sino para usarla. Podria ser la mesa de lectura y escritura del patio cubierto. BRUNO.- En el lugar más transitado? A la semana estará llena de vasos, témperas y mochilas ajenas. ELSA.- También de cuadernos abiertos, recomendaciones y borradores. Si la escondemos para que no se gaste, la tratamos como si ya estuviera muerta.',
                        'TERESA pasa la mano por una ranura de la madera. TERESA.- La memoria no se conserva solo cerrando una puerta. A veces se conserva cuando algo sigue sirviendo. BRUNO.- Y la feria? Necesitamos una superficie amplia para exhibir los proyectos de ciencias. ELSA.- La mesa puede quedar en el patio desde hoy y moverse dos días para la feria. No son destinos enemigos.',
                        'BRUNO deja la caja en el suelo y mide la mesa con la vista. BRUNO.- Si va al centro, quiero una condición: que tenga reglas y turnos de cuidado. TERESA.- Hecho. Le ponemos una placa pequeña: "Mesa común. Se usa, se cuida, se comparte". ELSA.- Entonces no la salvamos de la escuela. La devolvemos a la escuela.'
                    ]
                ),
                textBlock(
                    'texto-5',
                    'no-literario',
                    'Articulo informativo + tabla',
                    'Diez minutos para entrar',
                    'Adaptacion periodistica para ensayo SIMCE CEST 2026.',
                    [
                        'En marzo, tres liceos públicos de Curicó iniciaron un piloto de traslado llamado "Diez minutos para entrar". La medida no prohibía conversar, pero suspendia la música por parlantes y pedia guardar el telefono durante los primeros diez minutos del viaje de ida. En ese tramo, los buses ofrecian tarjetas breves con fragmentos de cronicas, acertijos verbales y preguntas de observacion sobre el trayecto. Participaron 184 estudiantes de primero y segundo medio.',
                        'Seis semanas despues, los inspectores compararon los registros de llegada con los del mismo período del año anterior. El número de conflictos reportados al bajar del bus disminuyo un 32%, y la puntualidad de la primera hora aumentó un 18%. Varios estudiantes dijeron que al principio el silencio les parecía extrano, pero que luego el viaje se hacia más corto porque llegaban "ya cambiados de ritmo".',
                        'El equipo de convivencia no midio solo atrasos y conflictos. También registro cuantos recorridos lograban iniciar con telefonos guardados, cuantos estudiantes completaban las tarjetas del trayecto y que tan estable se volvia el ingreso al liceo durante las primeras semanas. Esos datos permitieron distinguir si el cambio respondia a una rutina con sentido o solo a una obediencia pasajera.',
                        'Para la coordinadora del proyecto, el objetivo no era imponer calma por decreto. "Queriamos construir un puente entre la calle y la sala", explico. Un conductor resumio el cambio de manera más simple: "Antes bajaban corriendo y peleando por cualquier cosa; ahora entran hablando más bajo y la primera clase parte sin tanta friccion".',
                        'En uno de los recorridos, por ejemplo, las tarjetas de observacion comenzaron preguntando por detalles del paisaje y terminaron incluyendo preguntas breves sobre hábitos de lectura. Los inspectores observaron que, cuando la actividad se repetia con pequeñas variaciones y no como castigo, la resistencia inicial bajaba con rapidez y el trayecto adquiria una rutina reconocible para los estudiantes.',
                        'Una investigadora de convivencia escolar que observo el piloto advirtio, sin embargo, que la estrategia solo funciona cuando tiene un sentido claro y actividades concretas. "El silencio por sí mismo no educa", señaló. "Lo que educa es ofrecer una rutina de entrada que ayude a concentrarse y que no viva solo como castigo".'
                    ],
                    {
                        imagenFinal: dataPanel(
                            'Seguimiento del piloto por indicador',
                            'Resumen de seis semanas elaborado por el equipo de convivencia de los tres liceos participantes.',
                            ['Indicador', 'Inicio del piloto', 'Seis semanas despues'],
                            [
                                ['Conflictos al bajar del bus', '25 casos', '17 casos'],
                                ['Puntualidad en la primera hora', '61%', '79%'],
                                ['Recorridos con telefonos guardados en los primeros 10 minutos', '12%', '81%'],
                                ['Tarjetas del trayecto completadas por los estudiantes', '18%', '74%']
                            ],
                            [
                                { label: 'Mejora en puntualidad', value: 18, color: '#2563eb' },
                                { label: 'Disminucion de conflictos', value: 32, color: '#0f766e' },
                                { label: 'Aumento de recorridos con telefonos guardados', value: 69, color: '#7c3aed' },
                                { label: 'Aumento de tarjetas completadas', value: 56, color: '#ea580c' }
                            ],
                            'La tabla no reemplaza el artículo: lo complementa con indicadores concretos para evaluar si la rutina genero cambios sostenidos y no solo percepciones aisladas.'
                        )
                    }
                ),
                textBlock(
                    'texto-6',
                    'no-literario',
                    'Reportaje',
                    'El archivo que volvíó en cajas',
                    'Reportaje adaptado para ensayo SIMCE CEST 2026.',
                    [
                        'En el sector San Victor, de la comuna de Rengo, una bodega municipal guardo durante decadas cajas con boletos de tren, cartas familiares, libretas de almacen y fotografias del antiguo barrio ferroviario. Nadie sabía bien cuantas eran ni en que estado estaban, hasta que un taller de patrimonio del Liceo Republica inicio una primera etapa de inventario con apoyo del archivo comunal.',
                        'El trabajo comenzo con 23 estudiantes y cuatro vecinos jubilados. En seis semanas limpiaron polvo, separaron papeles fragiles y registraron 860 documentos. No todo estaba completo: había sobres vacios, páginas partidas y cuadernos mojados en las esquinas. Sin embargo, incluso esos restos permitian reconstruir oficios, recorridos y formas de intercambio que ya no aparecian en la superficie actual del barrio.',
                        'Uno de los hallazgos más comentados fue una libreta de almacen de 1958 donde, junto a las deudas de pan y carbon, aparecian anotados turnos de entrega en bicicleta hacia la estacion. También surgieron cartas enviadas por familiares desde Santiago, boletos marcados con fechas de invierno y una serie de fotografias en que las mujeres del barrio aparecian cargando herramientas y cajas, algo que varios estudiantes no habían visto representado en los relatos más conocidos sobre el ferrocarril.',
                        'Para la archivista Paula Mella, el valor del proyecto esta en que el archivo dejo de verse como un deposito triste. "No sirve de mucho conservar cajas si nadie las vuelve legibles", explica. A su juicio, un archivo escolar no debe funcionar como museo de nostalgia, sino como una herramienta para entender como cambió el trabajo, la organización del barrio y la presencia de mujeres, ninos y migrantes en la vida pública local.',
                        'Benjamin Sepulveda, estudiante de segundo medio, reconoce que al principio pensó que el taller sería solo ordenar papeles viejos. Cambió de idea cuando le tocó clasificar una serie de cartas donde una vecina pedia a su hermana que le guardara puesto en la fila del agua. "Ahí entendí que los documentos no contaban un barrio bonito de postal", dice. "Contaban problemas, trabajos y también formas de ayudarse".',
                        'El proyecto sigue en marcha. Ya se digitalizaron 117 piezas y se preparo una muestra abierta para la junta de vecinos, pero el equipo insiste en que la exposición no es el final. Cada caja revisada abre preguntas nuevas sobre el presente: como se mueve hoy el barrio, que oficios desaparecieron y quienes siguen sosteniendo la memoria cotidiana sin aparecer en los relatos oficiales.'
                    ]
                )
            ],
            preguntas: [
                mcq('q1', 'texto-1', 'LOCALIZAR', 'Qué lleva el hablante en el bolsillo al inicio del poema?', 'B', [
                    'Una libreta, una moneda y una fotografia vieja.',
                    'Una llave tibia, un boleto doblado y el olor del fierro.',
                    'Un pan tibio, una carta y una luz encendida.',
                    'Una ventana abierta, un boleto y el ruido de la calle.'
                ]),
                mcq('q2', 'texto-1', 'INTERPRETAR', 'Qué tono predomina en el poema?', 'C', [
                    'Un tono festivo que celebra el regreso con euforia abierta.',
                    'Un tono ironico que minimiza el esfuerzo de volver.',
                    'Un tono intimo y sobrio que valora un gesto cotidiano.',
                    'Un tono desafiante que enfrenta a quienes observan desde afuera.'
                ]),
                mcq('q3', 'texto-1', 'INTERPRETAR', 'Qué sugiere la frase "volver también es un trabajo"?', 'A', [
                    'Qué regresar exige una forma de esfuerzo y recomposicion personal.',
                    'Qué el hablante desearia recibir pago por regresar a su casa.',
                    'Qué la casa funciona como una extension directa del empleo diario.',
                    'Qué la calle hace imposible distinguir entre descanso y oficio.'
                ]),
                mcq('q4', 'texto-1', 'REFLEXIONAR', 'Cuál es el propósito principal del poema?', 'C', [
                    'Criticar una ciudad que obliga a todos a volver de la misma manera.',
                    'Comparar el regreso diario con una celebracion pública del esfuerzo.',
                    'Dar dignidad a un retorno cotidiano que suele pasar desapercibido.',
                    'Explicar por que el hablante prefiere callar cuando llega a su casa.'
                ]),
                mcq('q5', 'texto-1', 'REFLEXIONAR', 'Qué efecto produce la última estrofa del poema?', 'B', [
                    'Transforma la calle en el verdadero espacio donde se sostiene la vida.',
                    'Define la casa como algo sostenido por gestos repetidos y no solo por muros.',
                    'Anula el valor del regreso y lo convierte en una rutina vacia.',
                    'Sugiere que el hablante quisiera vivir lejos de cualquier costumbre.'
                ]),

                mcq('q6', 'texto-2', 'LOCALIZAR', 'Qué anotaba Lucas en la libreta verde?', 'D', [
                    'Solo las ventas del kiosco hechas durante el primer recreo.',
                    'Los nombres de quienes llegaban mojados desde la calle.',
                    'Un registro de productos vencidos y encargos del proveedor.',
                    'Las compras, sobre todo cuando alguien decia que pagaria despues.'
                ]),
                mcq('q7', 'texto-2', 'INTERPRETAR', 'Qué se puede inferir cuando Lucas piensa que no todas las deudas pesaban igual?', 'B', [
                    'Qué algunas compras eran demasiado pequeñas para anotarlas con cuidado.',
                    'Qué ciertos fiados revelaban necesidades repetidas y situaciones distintas.',
                    'Qué la tía Elba no aceptaba la libreta como un registro valido del kiosco.',
                    'Qué los días de lluvia hacian imposible ordenar correctamente las cuentas.'
                ]),
                mcq('q8', 'texto-2', 'INTERPRETAR', 'Por qué Lucas entrega igual la colación a la estudiante de primero medio?', 'C', [
                    'Porque quiere evitar que la caja del kiosco quede con dinero sobrante.',
                    'Porque sabe que la tía Elba prefiere regalar antes que cobrar tarde.',
                    'Porque reconoce la necesidad y decide ayudar sin exponerla.',
                    'Porque piensa que la estudiante devolvera el dinero antes del segundo recreo.'
                ]),
                mcq('q9', 'texto-2', 'LOCALIZAR', 'Qué encuentra Lucas bajo la libreta verde al final de la jornada?', 'A', [
                    'Un sobre con el monto exacto y una nota de agradecimiento.',
                    'Una lista de nuevos fiados y un mensaje sin destinatario.',
                    'Un cuaderno con nombres repetidos y montos sin cancelar.',
                    'Una fotografia del kiosco y una moneda envuelta en papel.'
                ]),
                mcq('q10', 'texto-2', 'REFLEXIONAR', 'Cuál resume mejor la idea central del cuento?', 'D', [
                    'Los kioscos escolares funcionan mejor cuando solo venden al contado.',
                    'La lluvia vuelve visibles las debilidades economicas de cualquier liceo.',
                    'Los estudiantes prefieren pedir fiado cuando se olvidan del dinero en casa.',
                    'Un espacio cotidiano puede sostener una red silenciosa de confianza y cuidado.'
                ]),
                mcq('q11', 'texto-2', 'REFLEXIONAR', 'Qué función cumple el gesto final de dejar una colación extra en el cajon?', 'B', [
                    'Mostrar que Lucas decide reemplazar a su tío de manera definitiva.',
                    'Convertir una experiencia puntual en una práctica de cuidado sostenido.',
                    'Demostrar que el kiosco puede resolver por sí solo los problemas del liceo.',
                    'Corregir el error de haber anotado mal varias compras durante la mañana.'
                ]),

                mcq('q12', 'texto-3', 'LOCALIZAR', 'Qué ilusión critica la columna al inicio?', 'A', [
                    'Creer que fotografiar una pizarra equivale a comprender y guardar la idea.',
                    'Pensar que escribir apuntes a mano exige demasiado tiempo para ser útil.',
                    'Suponer que la tecnología siempre complica el trabajo dentro del aula.',
                    'Confiar en que los profesores recuerdan mejor que los propios estudiantes.'
                ]),
                mcq('q13', 'texto-3', 'INTERPRETAR', 'Qué función cumple la experiencia realizada con 120 estudiantes?', 'C', [
                    'Mostrar que los esquemas fotografiados se olvidan más rapido por azar.',
                    'Demostrar que el estudio breve es mejor que cualquier forma de escritura.',
                    'Aportar evidencia para sostener que reformular exige un trabajo mental distinto.',
                    'Explicar por que algunos estudiantes ya no quieren usar cuaderno en clases.'
                ]),
                mcq('q14', 'texto-3', 'INTERPRETAR', 'Qué significa que se delega en la cámara una tarea que pertenece a la comprensión?', 'D', [
                    'Qué las camaras modernas organizan mejor los contenidos que la memoria.',
                    'Qué los estudiantes no deberían usar telefono en ningun momento de la clase.',
                    'Qué fotografiar una pizarra siempre impide estudiar despues con calma.',
                    'Qué seleccionar y jerarquizar ideas no puede reemplazarse por una captura mecanica.'
                ]),
                mcq('q15', 'texto-3', 'REFLEXIONAR', 'Cuál es la tesis principal de la columna?', 'A', [
                    'El problema no es la foto en si, sino usarla como sustituto del acto de comprender y seleccionar.',
                    'La escuela debería prohibir cualquier uso de telefonos al tomar apuntes.',
                    'Es mejor copiar palabra por palabra la pizarra que resumirla con ideas propias.',
                    'La memoria escolar depende más del orden visual que de las decisiones del estudiante.'
                ]),
                mcq('q16', 'texto-3', 'LOCALIZAR', 'Según la experiencia citada, en qué no estuvo la diferencia entre los grupos?', 'D', [
                    'En la cantidad de imagenes guardadas al final de la semana.',
                    'En el número de conceptos revisados por el profesor.',
                    'En la frecuencia con que cada estudiante uso su telefono.',
                    'En el tiempo total de estudio, que había sido similar.'
                ]),
                mcq('q17', 'texto-3', 'REFLEXIONAR', 'Qué función cumple la pregunta final sobre distinguir lo central de lo accesorio?', 'B', [
                    'Introducir una duda que debilita la postura del columnista.',
                    'Desplazar la discusión hacia una exigencia pedagogica más profunda.',
                    'Concluir que ninguna forma de tomar apuntes resulta realmente útil.',
                    'Cerrar el texto con una apelacion emotiva contra toda tecnología.'
                ]),

                mcq('q18', 'texto-4', 'LOCALIZAR', 'Qué condición pone Bruno cuando acepta que la mesa quede al centro?', 'C', [
                    'Qué se restaure por completo antes de volver a usarse en el patio cubierto.',
                    'Qué la biblioteca asuma todos los costos de reparacion y mantención del mueble.',
                    'Qué existan reglas y turnos de cuidado para usarla como mesa común.',
                    'Qué la feria de ciencias conserve siempre prioridad sobre cualquier otro uso.'
                ]),
                mcq('q19', 'texto-4', 'INTERPRETAR', 'Qué se puede inferir de Teresa cuando pasa la mano por la madera marcada?', 'A', [
                    'Qué valora la mesa por la historia que contiene, no solo por su utilidad inmediata.',
                    'Qué quiere comprobar si las iniciales fueron hechas por estudiantes del curso actual.',
                    'Qué piensa vender la mesa antes de que aumenten los rayones y daños visibles.',
                    'Qué desconfia de Elsa y Bruno porque cree que ninguno entiende lo que es una biblioteca.'
                ]),
                mcq('q20', 'texto-4', 'INTERPRETAR', 'Cuando Elsa dice que esconder la mesa sería tratarla "como si ya estuviera muerta", sugiere que:', 'B', [
                    'la escuela valora más la utilidad de las ferias que cualquier recuerdo de cursos egresados.',
                    'un objeto deja de pertenecer a la comunidad cuando se conserva sin permitirle un uso vivo.',
                    'Bruno solo piensa en la feria porque no entiende la función de una mesa de lectura compartida.',
                    'los objetos antiguos deben reemplazarse apenas dejan de verse nuevos y vistosos.'
                ]),
                mcq('q21', 'texto-4', 'REFLEXIONAR', 'Cuál es el conflicto principal del fragmento?', 'D', [
                    'Resolver quien debe hacerse responsable de limpiar una mesa antigua y deteriorada.',
                    'Decidir que curso tendra derecho exclusivo a usar el patio cubierto durante la feria.',
                    'Evitar que la bibliotecaria interfiera en las decisiones tomadas por el centro de estudiantes.',
                    'Definir como conservar un objeto con valor simbolico sin apartarlo del uso comunitario.'
                ]),
                mcq('q22', 'texto-4', 'LOCALIZAR', 'Qué frase proponen para la placa de la mesa?', 'C', [
                    'Mesa de lectura. Prohibido moverla durante las actividades del liceo.',
                    'Mesa patrimonial. Se observa con respeto y no se utiliza sin permiso.',
                    'Mesa común. Se usa, se cuida, se comparte.',
                    'Mesa histórica. Solo pueden usarla quienes participen en talleres de lectura.'
                ]),
                mcq('q23', 'texto-4', 'REFLEXIONAR', 'Qué tema resume mejor el fragmento?', 'A', [
                    'La memoria escolar se fortalece cuando los objetos heredados siguen teniendo un uso común.',
                    'Las ferias cientificas terminan imponiendose siempre sobre cualquier proyecto lector del liceo.',
                    'Las decisiones más importantes del colegio deberían quedar exclusivamente en manos de la biblioteca.',
                    'Todo objeto antiguo debe conservarse intacto, aunque ya no responda a las necesidades actuales.'
                ]),

                mcq('q24', 'texto-5', 'LOCALIZAR', 'Cuántos estudiantes participaron en el piloto "Diez minutos para entrar"?', 'B', [
                    'Participaron 132 estudiantes distribuidos en cuatro recorridos escolares.',
                    'Participaron 184 estudiantes de primero y segundo medio.',
                    'Participaron 84 estudiantes que usaban el bus de regreso en la tarde.',
                    'Participaron 218 estudiantes solo de segundo medio durante un mes.'
                ]),
                mcq('q25', 'texto-5', 'INTERPRETAR', 'Qué significa que los estudiantes llegaban "ya cambiados de ritmo"?', 'D', [
                    'Qué el trayecto se volvíó más lento y por eso alcanzaban a descansar mejor.',
                    'Qué la conversacion fue reemplazada por una revisión silenciosa de tareas pendientes.',
                    'Qué los inspectores exigian bajar en fila y eso modifico la velocidad del descenso.',
                    'Qué el viaje les ayudaba a pasar del movimiento de la calle a una disposicion más concentrada.'
                ]),
                mcq('q26', 'texto-5', 'REFLEXIONAR', 'Cuál sintetiza mejor la idea central del texto?', 'A', [
                    'Una rutina breve y con propósito puede mejorar la entrada a clases más que una restriccion sin sentido.',
                    'La puntualidad mejora sobre todo cuando los trayectos escolares se acortan de manera drastica.',
                    'Los conductores escolares deberían decidir libremente que actividades aplicar en cada recorrido.',
                    'Guardar el telefono unos minutos basta por sí solo para resolver los conflictos entre estudiantes.'
                ]),
                mcq('q27', 'texto-5', 'REFLEXIONAR', 'Qué función cumple la tabla de seguimiento incluida al final?', 'C', [
                    'Sustituir el artículo por datos aislados para que el lector ya no necesite interpretar testimonios.',
                    'Contradecir el relato de los conductores mostrando que la mejora fue menor a la esperada.',
                    'Complementar el artículo con indicadores que permiten evaluar si el cambio fue sostenido y concreto.',
                    'Demostrar que el piloto solo funciono en uno de los liceos y no en el conjunto del proyecto.'
                ]),
                mcq('q28', 'texto-5', 'LOCALIZAR', 'Según la tabla de seguimiento, qué indicador mostro el aumento más alto durante el piloto?', 'B', [
                    'Las tarjetas del trayecto completadas por los estudiantes.',
                    'Los recorridos con telefonos guardados en los primeros diez minutos.',
                    'La puntualidad en la primera hora.',
                    'La disminucion de conflictos al bajar del bus.'
                ]),

                mcq('q29', 'texto-6', 'LOCALIZAR', 'Cuántos documentos se inventariaron en la primera etapa del proyecto?', 'A', [
                    '860 documentos.',
                    '117 documentos.',
                    '42 documentos.',
                    '23 documentos.'
                ]),
                mcq('q30', 'texto-6', 'INTERPRETAR', 'Por qué el reportaje afirma que el archivo "volvíó en cajas"?', 'C', [
                    'Porque los estudiantes debieron devolver a la bodega municipal todas las cajas encontradas.',
                    'Porque el proyecto consistio solo en clasificar cajas vacias para una exposición patrimonial.',
                    'Porque la memoria del barrio reaparecio en materiales rescatados que regresaron a la lectura pública.',
                    'Porque las familias exigieron que todos los documentos regresaran a sus casas al final del semestre.'
                ]),
                mcq('q31', 'texto-6', 'INTERPRETAR', 'Cuando la archivista dice que el archivo no debe funcionar "como museo de nostalgia", quiere decir que:', 'D', [
                    'los materiales antiguos carecen de valor si no pueden exhibirse en vitrinas cerradas.',
                    'la comunidad debería dejar atras el pasado para concentrarse solo en los problemas actuales.',
                    'los estudiantes no estan preparados para trabajar con documentos que despiertan emocion personal.',
                    'los documentos deben servir para interpretar procesos del presente y no solo para idealizar el pasado.'
                ]),
                mcq('q32', 'texto-6', 'REFLEXIONAR', 'Cuál resume mejor la idea central del reportaje?', 'B', [
                    'Los archivos barriales valen sobre todo por la cantidad de documentos que logran almacenar.',
                    'Un archivo escolar puede convertir la memoria del barrio en una forma activa de aprendizaje y lectura del territorio.',
                    'Los proyectos patrimoniales funcionan solo cuando los dirige una archivista profesional y no un colegio.',
                    'La digitalizacion es suficiente para recuperar la historia de un barrio aunque nadie la vuelva a interpretar.'
                ]),
                mcq('q33', 'texto-6', 'LOCALIZAR', 'Qué materiales se mencionan entre los hallados en las cajas de la bodega?', 'A', [
                    'Boletos de tren, cartas familiares y libretas de almacen.',
                    'Únicamente fotografias escolares y diplomas deportivos del barrio.',
                    'Mapas ferroviarios modernos impresos por la municipalidad en 2025.',
                    'Herramientas, uniformes y maquinarias completas del antiguo ferrocarril.'
                ]),
                mcq('q34', 'texto-6', 'INTERPRETAR', 'Qué función cumple el testimonio de Benjamin Sepulveda en el reportaje?', 'D', [
                    'Corregir el punto de vista de la archivista sobre el valor pedagogico del proyecto.',
                    'Demostrar que los estudiantes conocian desde antes todos los detalles de la historia local.',
                    'Mostrar que la principal utilidad del archivo fue ensenar tecnicas de limpieza documental.',
                    'Volver concreto el cambio en la mirada estudiantil sobre el barrio y sus documentos.'
                ]),
                mcq('q35', 'texto-6', 'REFLEXIONAR', 'Qué acción sería más coherente con el enfoque del proyecto descrito en el reportaje?', 'C', [
                    'Guardar nuevamente las cajas en una bodega segura para evitar interpretaciones inexactas del pasado.',
                    'Limitar el archivo a una muestra cerrada para especialistas que ya conocen la historia ferroviaria local.',
                    'Seguir catalogando, digitalizando y compartiendo documentos para que la comunidad pueda leer su propia memoria.',
                    'Reemplazar las entrevistas vecinales por textos escolares generales que expliquen la historia nacional.'
                ])
            ]
        }),

        'ensayo-simce-miércoles-2b-hc-2026': buildEnsayo({
            titulo: 'Ensayo SIMCE Miércoles - 2B HC',
            descripcion: 'Ensayo preasignado para 2B HC. 6 textos, 35 preguntas y 70 minutos de trabajo. Replica la variedad del formato oficial con textos nuevos y un bloque discontinuo.',
            orden: 12,
            barajarBloques: true,
            panelUnidad: 'u2',
            panelOrden: 3,
            asignados: ['2B-HC'],
            textos: [
                textBlock(
                    'texto-1',
                    'literario',
                    'Poema',
                    'Instrucciones para esperar el timbre',
                    'Poema original para ensayo SIMCE CEST 2026.',
                    [
                        'Guarda la impaciencia junto a las monedas del vuelto. No la muestres todavía: las manos apuradas dejan caer lo que más cuesta aprender.',
                        'Mira el patio sin contar solo los minutos. También esperan las bancas calientes, la botella a medio llenar y la sombra que cambia de lugar sobre la muralla.',
                        'Hay quien cree que esperar es quedarse quieto. Yo digo lo contrario: mientras el timbre no suena, uno ordena el ruido, amarra los cuadernos y ensaya la pregunta que no se atrevió a hacer.',
                        'Cuando al fin golpee el metal contra el aire, no salgas huyendo de esta pausa. Llevate algo de ella: a veces la salida empieza antes, en la manera de aprender a esperar.'
                    ]
                ),
                textBlock(
                    'texto-2',
                    'literario',
                    'Cuento',
                    'Los cuadernos del pasillo',
                    'Texto original para ensayo SIMCE CEST 2026.',
                    [
                        'El último timbre de la tarde ya había sonado cuando Martina vio tres cuadernos apilados en el alféizar del pasillo frente a la sala 14. La inspectoría estaba cerrada por una reunión y en el patio empezaba una lluvia oblicua que empujaba a todos hacia la salida. Martina pensó en dejarlos sobre la mesa de objetos perdidos del primer piso, pero el agua ya entraba por la ventana entreabierta.',
                        'Tomo el primero solo para mirar la portada. Adentro encontró un horario escrito con lápiz mina, una lista de formulas y, al final, una nota breve: "Buscar a Nico en la basica". En el segundo había un mapa de recorridos de micro y una hoja arrancada con compras para la casa. El tercero guardaba preguntas de historia mezcladas con turnos de cuidado para una abuela.',
                        'Martina no siguió leyendo. Le basto ese vistazo para entender que los cuadernos no eran solo apuntes: también eran una forma de ordenar días apretados, encargos y trayectos que nadie ve cuando mira una mochila cerrada. Los secó con papel absorbente y los puso dentro de un carro de biblioteca vacio.',
                        'Con un carton de embalaje escribió: "Cuadernos encontrados. Si uno es tuyo, describe la portada y di donde lo dejaste". Pegó el letrero junto a la entrada de la biblioteca y avisó a la encargada antes de irse. Esa noche pensó, ya en su casa, que perder un cuaderno podía ser más grave que perder un lápiz: ahí iban las clases, pero también la forma de no olvidar lo urgente.',
                        'A la mañana siguiente aparecio Diego, agitado, preguntando por un cuaderno azul con una cinta negra en el espiral. Dijo que adentro llevaba un resumen para la prueba de biología y el horario del almacen donde trabajaba despues de clases. Cuando Martina se lo devolvio, el no dijo mucho; solo apreto el cuaderno contra el pecho y repitio dos veces "menos mal".',
                        'Desde entonces, el pasillo de la sala 14 tuvo una caja plastica para objetos de estudio extraviados. Los cuadernos empezaron a volver con notas pequeñas: "Hallado en el casino", "Estaba bajo la banca", "Lo guardamos para que no se mojara". Martina siguió pasando por ahí cada tarde, pero ya no miraba el alféizar como un lugar vacio. Lo miraba como un punto donde la escuela aprendía a devolverse cosas.'
                    ]
                ),
                textBlock(
                    'texto-3',
                    'no-literario',
                    'Columna de opinión',
                    'Leer en voz alta también es estudiar',
                    'Columna original para ensayo SIMCE CEST 2026.',
                    [
                        'Todavía hay quienes asocian la lectura en voz alta con la infancia y la repiten como si fuera una etapa superada: primero se lee con sonido, despues en silencio, como si la madurez consistiera en borrar la voz. El problema de esa idea es que confunde silencio con comprensión. Muchas veces uno recorre un párrafo sin tropiezos y solo al intentar decirlo descubre que no entendió donde cambiaba la idea o que palabra sostenía el argumento.',
                        'En un taller con 84 estudiantes de segundo medio se compararon dos formas de preparar un texto argumentativo. Un grupo releyo en silencio dos veces; el otro marco tres fragmentos clave, los leyó en voz alta y luego los parafraseó. Al día siguiente, quienes habían usado la voz explicaron con más precision la postura del autor y omitieron menos conectores decisivos. La diferencia no estuvo en el volumen ni en la memoria mecanica, sino en haber obligado al pensamiento a pasar por el oído.',
                        'Leer en voz alta tampoco significa teatralizar cada página. A veces basta con probar una oración larga, una definición difícil o el cierre de un artículo para advertir si la lógica se sostiene. La voz marca los huecos: ahí donde falta aire, a veces también falta comprensión.',
                        'Por eso sería útil dejar de oponer estudio serio y lectura audible. La escuela enseña a subrayar, resumir y tomar apuntes; también podría ensenar cuando conviene ponerle voz a un texto. No para hacer ruido por costumbre, sino para escuchar mejor lo que de otra manera pasa de largo.'
                    ]
                ),
                textBlock(
                    'texto-4',
                    'literario',
                    'Fragmento dramatico',
                    'La llave del gimnasio',
                    'Fragmento dramatico original para ensayo SIMCE CEST 2026.',
                    [
                        'AMPARO, inspectora, sostiene una llave grande y un cuaderno de registro. DIEGO, profesor de educación física, seca unos conos con una toalla. SOFÍA entra con el uniforme humedo por la lluvia. SOFÍA.- Afuera no se puede estar ni cinco minutos. Los pasillos ya estan llenos y en la escalera del segundo piso casi se forma otra fila de empujones. DIEGO.- Si abrimos el gimnasio en cada recreo de lluvia, en dos semanas no va a quedar un solo balon inflado. Además, despues nadie quiere hacerse cargo de recoger nada.',
                        'AMPARO.- La llave no es un trofeo para tenerla guardada en el bolsillo. Tampoco sirve abrir sin reglas y convertir el gimnasio en otro pasillo ruidoso. SOFÍA.- Nadie esta pidiendo un partido. Se puede usar por zonas: una para sentarse, otra para estirarse, otra para quienes solo quieren esperar secos el siguiente bloque.',
                        'DIEGO.- Las últimas veces terminaron pateando pelotas contra la bodega. Yo no quiero cerrar el espacio; quiero que siga existiendo. AMPARO abre el cuaderno de registro. AMPARO.- Entonces hagamos algo distinto: días de lluvia, apertura de quince minutos, sin futbol y con préstamo anotado de implementos livianos. Si no funciona, lo revisamos; si funciona, deja de ser improvisación.',
                        'SOFÍA.- Yo consigo dos estudiantes por curso para ayudar a ordenar la salida. También hacemos un cartel con las reglas para que no parezca favor ni castigo. DIEGO mira la llave y asiente. DIEGO.- Si el espacio se usa de verdad, vale la pena cuidarlo. Pero la primera regla va grande: el gimnasio no es cancha libre en recreo de lluvia. AMPARO.- Mejor todavía: espacio común, reglas visibles y responsables claros. La llave abre mejor cuando no trabaja sola.'
                    ]
                ),
                textBlock(
                    'texto-5',
                    'no-literario',
                    'Articulo informativo + tabla',
                    'Patios con pausa',
                    'Articulo adaptado para ensayo SIMCE CEST 2026.',
                    [
                        'En octubre, tres liceos de Linares instalaron estaciones de sombra en el recreo largo: toldos livianos, bancas móviles, dispensadores de agua y tarjetas breves de lectura. El plan, llamado "Patios con pausa", incluyo a 212 estudiantes de primero y segundo medio y se aplico durante seis semanas, justo en las jornadas de mayor calor.',
                        'La idea surgió luego de que inspectoría registrara malestares por exposición al sol y aglomeraciones en los pasillos interiores. Hasta entonces, muchos estudiantes se refugiaban bajo una sola techumbre o entraban y salian del edificio buscando un lugar menos caluroso. La coordinacion quiso probar si mejorar el espacio exterior podía distribuir mejor el patio y bajar la friccion de los desplazamientos.',
                        'El piloto no consistio solo en poner sombra. Cada estacion tenia un bebedero cercano y un soporte con tarjetas de lectura breve: microcronicas, tiras comicas y preguntas de observacion del entorno. La apuesta era simple: si el lugar resultaba habitable y ofrecia una actividad corta, el recreo podía ordenarse sin convertirse en una fila de prohibiciones.',
                        'Durante el seguimiento, el equipo comparó consultas por malestar de calor, recargas de agua, uso de tarjetas y conflictos por aglomeración en pasillos. Los resultados mostraron que no bastaba con cambiar la infraestructura; el uso se estabilizaba mejor cuando había una rutina clara y visible para acercarse al espacio.',
                        'La coordinadora del plan explico que la sombra por sí sola no produce convivencia. "Lo que cambia el patio es ofrecer un lugar reconocible, con agua, pausa y algo breve para hacer", dijo. Un inspector agrego que, desde la tercera semana, varios grupos ya iban directo a las estaciones sin esperar instrucciones.',
                        'Una investigadora de vida escolar que observo el piloto fue cauta: advirtio que la mejora depende de mantención y constancia. "Si se rompe el bebedero o desaparecen las tarjetas, el lugar vuelve a ser solo un toldo", señaló. Aún así, considero que la experiencia aporta una lección útil: a veces el orden nace de diseñar mejor el uso y no solo de limitarlo.'
                    ],
                    {
                        imagenFinal: dataPanel(
                            'Seguimiento del plan Patios con pausa',
                            'Comparacion de indicadores levantados durante la primera y la sexta semana del piloto.',
                            ['Indicador', 'Semana 1', 'Semana 6'],
                            [
                                ['Consultas por malestar de calor', '21', '13'],
                                ['Recargas de agua en el patio', '46', '119'],
                                ['Tarjetas de lectura utilizadas', '18', '87'],
                                ['Conflictos por aglomeración en pasillos', '15', '11']
                            ],
                            [
                                { label: 'Disminucion de malestar por calor', value: 38, color: '#0f766e' },
                                { label: 'Aumento de recargas de agua', value: 73, color: '#2563eb' },
                                { label: 'Aumento de tarjetas utilizadas', value: 69, color: '#7c3aed' },
                                { label: 'Disminucion de conflictos en pasillos', value: 27, color: '#ea580c' }
                            ],
                            'La tabla complementa el artículo con cambios observables y permite distinguir si el nuevo espacio genero hábitos de uso y no solo una impresión favorable inicial.'
                        )
                    }
                ),
                textBlock(
                    'texto-6',
                    'no-literario',
                    'Reportaje',
                    'La radio del tercer piso',
                    'Reportaje adaptado para ensayo SIMCE CEST 2026.',
                    [
                        'Durante ocho años, la cabina del tercer piso del Liceo Manuel Plaza quedo cerrada con una cadena delgada y una capa de polvo sobre la consola. Este ciclo, un taller de comunicaciones formado por 17 estudiantes pidió abrirla no para montar una radio de canciones al azar, sino para convertirla en un lugar de reporteo escolar.',
                        'La primera semana no sonaron voces al aire: se limpiaron cables, se revisaron audifonos y se abrieron cajas con cassettes rotulados entre 2004 y 2011. Junto a ellos aparecieron pautas antiguas, listas de turnos y cuadernos donde exalumnos anotaban noticias del barrio, entrevistas y horarios de emisión. "Nos dimos cuenta de que la radio ya había sido una forma de mirar la escuela", dijo Camila Cifuentes, estudiante de segundo medio.',
                        'El grupo decidio conservar esa idea. En vez de llenar los recreos con música continua, preparo microreportajes de noventa segundos sobre oficios y espacios que suelen pasar desapercibidos: la manipuladora que llega antes del amanecer, el auxiliar que abre el porton cuando aún esta oscuro, la bibliotecaria que repara libros con cinta transparente y paciencia. Cada pieza exige pauta, verificación de nombres y dos rondas de edicion antes de salir al parlante central.',
                        'El profesor a cargo insiste en que la radio no se sostiene con entusiasmo suelto. "Si no hay guion, tiempos claros y escucha de prueba, todo termina pareciendo improvisación", explica. Por eso los estudiantes se reparten tareas: una dupla entrevista, otra transcribe, otra revisa datos y una última decide el orden de emisión.',
                        'Para Milagros Sepulveda, una de las participantes, el cambio fue también una forma de escuchar distinto el edificio. "Antes pensaba la radio como chistes o canciones. Ahora, cuando subo a la cabina, siento que el colegio tiene voces que normalmente quedan pegadas al fondo", cuenta. La semana pasada produjo una nota breve sobre el tallerista que arregla sillas en desuso para la biblioteca.',
                        'Luis Araya, auxiliar del establecimiento desde hace quince años, aceptó hablar frente al micrófono con cierta desconfianza. Despues de la emisión, dos estudiantes de primero medio lo saludaron por su nombre en la escalera. "Uno cree que lo ven pasar nomás", dijo despues. "Escucharse ahí hizo que el trabajo dejara de ser puro ruido de fondo".',
                        'Hoy, en un estante junto a la cabina, conviven las cintas antiguas y los archivos nuevos. Los estudiantes no las guardan como reliquia silenciosa: las usan para comparar temas, tonos y preguntas. En ese cruce entre voces viejas y nuevas, la radio del tercer piso volvíó a encenderse como algo más que un parlante: como una manera de que la escuela se oiga a si misma.'
                    ]
                )
            ],
            preguntas: [
                mcq('q1', 'texto-1', 'LOCALIZAR', 'Según el hablante, donde debe guardarse la impaciencia?', 'A', [
                    'Junto a las monedas del vuelto.',
                    'Debajo de la botella a medio llenar.',
                    'Entre los cuadernos ya amarrados.',
                    'En la sombra que cambia sobre la muralla.'
                ]),
                mcq('q2', 'texto-1', 'INTERPRETAR', 'Qué tono predomina en el poema?', 'C', [
                    'Un tono apurado que busca terminar la espera lo antes posible.',
                    'Un tono ironico que ridiculiza a quienes se quedan en el patio.',
                    'Un tono reflexivo e instructivo que resignifica la espera cotidiana.',
                    'Un tono furioso que transforma el timbre en una amenaza constante.'
                ]),
                mcq('q3', 'texto-1', 'INTERPRETAR', 'Cuando el hablante afirma que esperar no es quedarse quieto, sugiere que la espera puede ser:', 'B', [
                    'una perdida inevitable de tiempo antes de la salida.',
                    'un momento activo de orden, preparacion y pensamiento.',
                    'una forma de castigo para quienes no terminan a tiempo.',
                    'un descanso sin relación con lo que ocurrira despues.'
                ]),
                mcq('q4', 'texto-1', 'REFLEXIONAR', 'Cuál es el propósito principal del poema?', 'D', [
                    'Describir el patio como un espacio vacio donde nada importante ocurre.',
                    'Criticar el uso del timbre escolar como una senal demasiado autoritaria.',
                    'Mostrar que la verdadera salida ocurre solo cuando termina la jornada.',
                    'Dar valor a la espera como un tiempo en que también se aprende y se prepara uno.'
                ]),
                mcq('q5', 'texto-1', 'REFLEXIONAR', 'Qué efecto produce el cierre del poema?', 'A', [
                    'Transforma la pausa previa al timbre en una forma de inicio y no solo de terminó.',
                    'Anula lo dicho antes y presenta la espera como un error que debe evitarse.',
                    'Convierte el patio en un lugar peligroso del que conviene escapar rapido.',
                    'Sugiere que solo vale la pena esperar cuando alguien lo observa desde fuera.'
                ]),

                mcq('q6', 'texto-2', 'LOCALIZAR', 'Dónde encuentra Martina los cuadernos al inicio del cuento?', 'D', [
                    'Sobre la mesa de objetos perdidos del primer piso.',
                    'Debajo de una banca humeda junto al patio techado.',
                    'Dentro de un carro de biblioteca que estaba vacio.',
                    'Apilados en el alféizar del pasillo frente a la sala 14.'
                ]),
                mcq('q7', 'texto-2', 'INTERPRETAR', 'Por qué Martina revisa el interior de los cuadernos?', 'B', [
                    'Porque sospecha que alguien escondio mensajes entre las páginas.',
                    'Porque necesita identificar a sus dueños cuando la inspectoría esta cerrada.',
                    'Porque quiere comparar el nivel de los apuntes entre distintos cursos.',
                    'Porque planea entregar solo los cuadernos que esten completos y ordenados.'
                ]),
                mcq('q8', 'texto-2', 'INTERPRETAR', 'Qué se puede inferir de las notas y listas que Martina alcanza a ver?', 'C', [
                    'Qué los cuadernos pertenecian todos a estudiantes del mismo curso.',
                    'Qué la informacion escolar resultaba menos importante que los encargos familiares.',
                    'Qué esos cuadernos también ayudaban a ordenar responsabilidades fuera de la sala.',
                    'Qué Martina debio seguir leyendo para entender completamente cada situacion personal.'
                ]),
                mcq('q9', 'texto-2', 'LOCALIZAR', 'Qué letrero escribe Martina para devolver los cuadernos?', 'A', [
                    '"Cuadernos encontrados. Si uno es tuyo, describe la portada y di donde lo dejaste".',
                    '"Objetos perdidos. Menciona tu curso y espera a la bibliotecaria".',
                    '"Retiro de cuadernos solo con autorizacion de inspectoría".',
                    '"Material hallado. Anota tu nombre y vuelve al final del día".'
                ]),
                mcq('q10', 'texto-2', 'INTERPRETAR', 'Cuando el narrador dice que los cuadernos ayudaban a "ordenar días apretados", se sugiere que:', 'D', [
                    'los estudiantes escribian demasiado porque no entendian bien las clases.',
                    'la escuela obliga a registrar por separado la vida familiar y la escolar.',
                    'Martina exagera el valor de objetos que podían reemplazarse fácilmente.',
                    'esos cuadernos reunian tareas, trayectos y deberes que organizaban la vida diaria.'
                ]),
                mcq('q11', 'texto-2', 'REFLEXIONAR', 'Qué idea resume mejor el cuento?', 'B', [
                    'Perder un cuaderno es un problema menor mientras existan copias digitales.',
                    'Los pequeños gestos de cuidado pueden revelar y sostener una comunidad escolar.',
                    'La biblioteca funciona mejor cuando reemplaza completamente a la inspectoría.',
                    'Los estudiantes deberían evitar llevar informacion personal dentro de sus apuntes.'
                ]),

                mcq('q12', 'texto-3', 'LOCALIZAR', 'Qué idea cuestiona el columnista al inicio del texto?', 'C', [
                    'Qué leer en silencio exige más tiempo que estudiar con un resumen.',
                    'Qué la escuela debería usar solo textos argumentativos al preparar clases.',
                    'Qué leer en voz alta sería una práctica propia de una etapa ya superada.',
                    'Qué los conectores de un texto son menos importantes que sus ejemplos.'
                ]),
                mcq('q13', 'texto-3', 'INTERPRETAR', 'Qué función cumple la experiencia realizada con 84 estudiantes?', 'A', [
                    'Aportar evidencia concreta para sostener la postura del autor.',
                    'Demostrar que todos los textos deben leerse de la misma manera.',
                    'Probar que la memoria mecanica es superior a cualquier comprensión.',
                    'Explicar por que el taller de segundo medio fracasó en silencio.'
                ]),
                mcq('q14', 'texto-3', 'INTERPRETAR', 'Qué significa la expresion "La voz marca los huecos"?', 'D', [
                    'Qué toda lectura en voz alta depende del volumen con que se pronuncian las palabras.',
                    'Qué los textos argumentativos deberían escribirse pensando solo en ser escuchados.',
                    'Qué los estudiantes recuerdan mejor un texto cuando lo repiten sin detenerse.',
                    'Qué al leer en voz alta se hacen visibles partes del texto que aún no se comprenden bien.'
                ]),
                mcq('q15', 'texto-3', 'REFLEXIONAR', 'Cuál es la tesis principal de la columna?', 'B', [
                    'La lectura en silencio debería reemplazarse siempre por actividades orales.',
                    'Leer en voz alta, usado de forma estrategica, también puede favorecer la comprensión.',
                    'Los textos escolares son demasiado complejos para trabajarlos sin ayuda externa.',
                    'La escuela debiera abandonar las prácticas de resumen y subrayado tradicionales.'
                ]),
                mcq('q16', 'texto-3', 'LOCALIZAR', 'Según el autor, leer en voz alta no significa:', 'C', [
                    'probar algunos fragmentos para verificar su lógica.',
                    'usar la voz cuando una idea exige más atencion.',
                    'teatralizar cada página del texto que se estudia.',
                    'escuchar mejor aquello que podía pasar inadvertido.'
                ]),
                mcq('q17', 'texto-3', 'REFLEXIONAR', 'Qué función cumple el último párrafo de la columna?', 'B', [
                    'Reemplazar la tesis del texto por una defensa de los resumos escritos.',
                    'Proponer que la escuela enseñe cuando conviene usar la voz al estudiar.',
                    'Reconocer que leer en voz alta solo sirve para textos muy sencillos.',
                    'Cerrar el texto afirmando que el silencio ya no tiene ningun valor.'
                ]),

                mcq('q18', 'texto-4', 'LOCALIZAR', 'En qué situaciones proponen abrir el gimnasio?', 'B', [
                    'Durante cualquier recreo, aunque haya clases prácticas programadas.',
                    'En los recreos de lluvia y por un tiempo acotado.',
                    'Solo al final de la jornada para guardar materiales humedos.',
                    'Cuando el centro de estudiantes lo pida con una semana de anticipacion.'
                ]),
                mcq('q19', 'texto-4', 'INTERPRETAR', 'Qué sugiere Sofía al describir los pasillos llenos y la escalera con empujones?', 'D', [
                    'Qué los estudiantes prefieren naturalmente los espacios cerrados al patio.',
                    'Qué la lluvia debería obligar a suspender todos los recreos del día.',
                    'Qué el gimnasio solo sería útil para guardar implementos y secar uniformes.',
                    'Qué mantener el gimnasio cerrado también contribuye al problema de circulacion.'
                ]),
                mcq('q20', 'texto-4', 'LOCALIZAR', 'Qué condición concreta se acuerda para usar el gimnasio?', 'C', [
                    'Permitir partidos breves siempre que alguien devuelva los balones.',
                    'Usarlo sin registro mientras la inspectora vigila desde la puerta.',
                    'Abrirlo sin futbol y con préstamo anotado de implementos livianos.',
                    'Destinarlo solo a estudiantes de cursos superiores durante la lluvia.'
                ]),
                mcq('q21', 'texto-4', 'REFLEXIONAR', 'Cuál es el conflicto principal del fragmento?', 'A', [
                    'Decidir como abrir un espacio común sin descuidar su cuidado ni su orden.',
                    'Resolver quien debe quedarse con la llave del gimnasio al final del día.',
                    'Determinar si la lluvia justifica suspender la educación física semanal.',
                    'Elegir que curso tendra prioridad para usar el gimnasio en invierno.'
                ]),
                mcq('q22', 'texto-4', 'INTERPRETAR', 'Qué significa la frase "La llave no es un trofeo"?', 'B', [
                    'Qué la inspectora debería entregar la llave a cualquier estudiante que la solicite.',
                    'Qué guardar el acceso por control no basta si el espacio no cumple una función común.',
                    'Qué el gimnasio ha perdido su utilidad y solo queda conservarlo como simbolo.',
                    'Qué la autoridad del profesor depende de exhibir las llaves del establecimiento.'
                ]),
                mcq('q23', 'texto-4', 'REFLEXIONAR', 'Qué tema resume mejor el fragmento?', 'C', [
                    'Los días de lluvia vuelven inútil cualquier regla de convivencia escolar.',
                    'Los espacios deportivos deben cerrarse para conservar mejor sus implementos.',
                    'Los espacios comunes funcionan mejor cuando acceso y cuidado se organizan juntos.',
                    'La autoridad escolar se fortalece cuando evita negociar con estudiantes.'
                ]),

                mcq('q24', 'texto-5', 'LOCALIZAR', 'Cuántos estudiantes participaron en el plan "Patios con pausa"?', 'B', [
                    'Participaron 172 estudiantes solo durante la última semana del piloto.',
                    'Participaron 212 estudiantes de primero y segundo medio.',
                    'Participaron 312 estudiantes de tres establecimientos municipales.',
                    'Participaron 120 estudiantes seleccionados por inspectoría y convivencia.'
                ]),
                mcq('q25', 'texto-5', 'LOCALIZAR', 'Además de las consultas por calor, qué otros aspectos comparó el seguimiento?', 'D', [
                    'Solo la cantidad de estudiantes que prefería quedarse dentro de la sala.',
                    'Exclusivamente el número de toldos instalados y sus costos de mantención.',
                    'Únicamente la asistencia diaria y la duración promedio del recreo largo.',
                    'Las recargas de agua, el uso de tarjetas y los conflictos por aglomeración.'
                ]),
                mcq('q26', 'texto-5', 'REFLEXIONAR', 'Cuál sintetiza mejor la idea central del artículo?', 'A', [
                    'El recreo puede ordenarse mejor cuando el espacio ofrece condiciones habitables y una rutina breve de uso.',
                    'La sombra basta por sí sola para resolver cualquier problema de convivencia en el patio.',
                    'Los estudiantes prefieren las estaciones de lectura porque ya no necesitan moverse durante el recreo.',
                    'La principal función del plan fue reducir el trabajo del equipo de inspectoría.'
                ]),
                mcq('q27', 'texto-5', 'REFLEXIONAR', 'Qué función cumple la tabla incluida al final del texto?', 'C', [
                    'Sustituir el artículo por una lista de datos para evitar cualquier interpretación.',
                    'Contradecir los testimonios del artículo y demostrar que el plan fracasó.',
                    'Complementar el artículo con indicadores que permiten evaluar cambios concretos en el uso del patio.',
                    'Resumir únicamente los costos materiales del piloto y su mantención semanal.'
                ]),
                mcq('q28', 'texto-5', 'LOCALIZAR', 'Según la tabla, qué indicador aumentó más entre la primera y la sexta semana?', 'B', [
                    'Las tarjetas de lectura utilizadas.',
                    'Las recargas de agua en el patio.',
                    'Los conflictos por aglomeración en pasillos.',
                    'Las consultas por malestar de calor.'
                ]),

                mcq('q29', 'texto-6', 'LOCALIZAR', 'Cuánto tiempo había permanecido cerrada la cabina del tercer piso?', 'C', [
                    'Cuatro años, desde la última remodelación del edificio.',
                    'Seis años, desde que se dañó el sistema de parlantes.',
                    'Ocho años, con una cadena y polvo sobre la consola.',
                    'Doce años, desde la salida del antiguo profesor encargado.'
                ]),
                mcq('q30', 'texto-6', 'INTERPRETAR', 'Por qué el taller decide no llenar la radio con música continua?', 'D', [
                    'Porque el sistema de audio todavía no permite reproducir canciones completas.',
                    'Porque la dirección prohibió emitir música durante cualquier recreo escolar.',
                    'Porque los estudiantes prefieren escuchar solo entrevistas muy extensas.',
                    'Porque quieren recuperar la radio como herramienta de reporteo y escucha de la comunidad.'
                ]),
                mcq('q31', 'texto-6', 'LOCALIZAR', 'Qué materiales aparecieron junto a los cassettes antiguos?', 'A', [
                    'Pautas antiguas, listas de turnos y cuadernos con noticias e entrevistas.',
                    'Uniformes de exalumnos, fotografias de actos y afiches deportivos.',
                    'Balones desinflados, parlantes portatiles y cables sin clasificar.',
                    'Boletines de notas, inventarios de biblioteca y mapas del barrio.'
                ]),
                mcq('q32', 'texto-6', 'INTERPRETAR', 'Qué función cumple el testimonio del profesor a cargo?', 'B', [
                    'Corregir a los estudiantes y proponer volver a una radio solo musical.',
                    'Subrayar que la radio necesita organización, guion y revisión además de entusiasmo.',
                    'Demostrar que el taller funciona sin repartir tareas entre los participantes.',
                    'Explicar que la emisión depende sobre todo de conservar intactas las cintas antiguas.'
                ]),
                mcq('q33', 'texto-6', 'INTERPRETAR', 'Cuando Milagros dice que el colegio tiene voces "pegadas al fondo", se refiere a que:', 'C', [
                    'la radio antigua grababa mal y por eso algunas entrevistas casi no se escuchaban.',
                    'los recreos suelen ser demasiado ruidosos para transmitir cualquier informacion precisa.',
                    'hay personas y trabajos de la escuela que existen, pero suelen pasar desapercibidos.',
                    'la cabina del tercer piso estaba aislada y por eso nadie podía oirla desde abajo.'
                ]),
                mcq('q34', 'texto-6', 'REFLEXIONAR', 'Cuál resume mejor la idea central del reportaje?', 'A', [
                    'La radio escolar puede convertirse en una forma de escuchar, registrar y valorar la vida de la comunidad.',
                    'El principal valor de la radio es conservar objetos antiguos aunque ya no vuelvan a usarse.',
                    'Las emisoras escolares funcionan mejor cuando eliminan toda planificación previa y dejan hablar libremente.',
                    'La tecnología de audio solo resulta útil cuando permite entretener con música durante los recreos.'
                ]),
                mcq('q35', 'texto-6', 'REFLEXIONAR', 'Qué acción sería más coherente con el enfoque descrito en el reportaje?', 'D', [
                    'Guardar las cintas antiguas en una vitrina y limitar las emisiones a fechas conmemorativas.',
                    'Usar la radio solo para anuncios administrativos y evitar entrevistas con trabajadores del liceo.',
                    'Reemplazar los microreportajes por listas musicales para atraer más público en los recreos.',
                    'Seguir produciendo piezas verificadas y archivar nuevas voces junto a los registros anteriores.'
                ])
            ]
        })
    };

    window.calculateSimceScore = function (correct, total) {
        if (typeof correct !== 'number' || typeof total !== 'number' || total <= 0) return 0;
        if (total === 35) {
            var table = [
                100, 110, 120, 130, 140, // 0 to 4
                148, 156, 164, 172, 180, // 5 to 9
                188, 196, 202, 208, 214, // 10 to 14
                220,                      // 15
                226, 232, 238, 244, 250, // 16 to 20
                256, 262, 268, 274,       // 21 to 24
                280, 288, 296, 304, 314, // 25 to 29
                324, 336, 348, 362, 378, // 30 to 34
                400                      // 35
            ];
            return table[correct] || 100;
        }
        var scaledCorrect = Math.round((correct / total) * 35);
        var fallbackTable = [
            100, 110, 120, 130, 140,
            148, 156, 164, 172, 180,
            188, 196, 202, 208, 214,
            220,
            226, 232, 238, 244, 250,
            256, 262, 268, 274,
            280, 288, 296, 304, 314,
            324, 336, 348, 362, 378,
            400
        ];
        return fallbackTable[scaledCorrect] || 100;
    };

    window.getSimceLevelInfo = function (score) {
        if (score >= 276) {
            return { name: 'Adecuado', color: '#22c55e', bg: '#dcfce7', text: '#15803d', emoji: '🟢' };
        } else if (score >= 221) {
            return { name: 'Elemental', color: '#f59e0b', bg: '#fef3c7', text: '#b45309', emoji: '🟡' };
        } else {
            return { name: 'Insuficiente', color: '#ef4444', bg: '#fee2e2', text: '#b91c1c', emoji: '🔴' };
        }
    };

    window.SIMCE_PREASSIGNED_ENSAYOS_2026 = sessions;
    window.getSimcePreassignedEnsayo2026 = function (sessionId) {
        var cleanId = (sessionId || '').replace(/é/g, 'e').replace(/É/g, 'E');
        var withAccent = cleanId.replace('miercoles', 'miércoles');
        var withoutAccent = cleanId.replace('miércoles', 'miercoles');
        var session = sessions[sessionId] || sessions[cleanId] || sessions[withAccent] || sessions[withoutAccent];
        return session ? JSON.parse(JSON.stringify(session)) : null;
    };
}());