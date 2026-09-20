/* Práctica ECEP 2026 · Tecnología · Educación Media. */
window.crearPractica2026({
  id: 'practica-media-tecnologia',
  titulo: 'Práctica ECEP 2026 · Educación Media · Tecnología',
  alcance: 'Alineada con los dominios disciplinarios y pedagógicos del temario oficial 2026 de Enseñanza Media Tecnología.',
  focos: [
    {
      concepto: 'Tecnología como sistema sociotécnico',
      definicion: 'Una solución tecnológica articula personas, conocimientos, materiales, energía, información, procesos y normas; sus efectos no dependen solo del artefacto aislado.',
      caso: 'El curso analiza una aplicación de reparto considerando únicamente su interfaz y omite trabajadores, datos, logística y regulación.',
      respuesta: 'Ampliar el análisis a los actores, flujos, infraestructura, decisiones y consecuencias del sistema completo.',
      errores: ['Evaluar solo el color y tamaño de los botones.', 'Concluir que la aplicación es neutral porque es digital.', 'Describir únicamente el teléfono donde se instala.']
    },
    {
      concepto: 'Identificación de necesidades',
      definicion: 'Un problema de diseño se define mediante usuarios, contexto, necesidad verificable y causas, evitando confundir una solución anticipada con el problema que debe resolverse.',
      caso: 'Un equipo declara: “el problema es que falta construir una aplicación”, sin investigar qué dificultad enfrentan las personas.',
      respuesta: 'Observar y entrevistar usuarios para formular la necesidad antes de elegir el tipo de solución.',
      errores: ['Comenzar a programar porque toda necesidad actual requiere una aplicación.', 'Copiar una solución popular sin estudiar el contexto.', 'Definir el problema según el material disponible en el taller.']
    },
    {
      concepto: 'Proceso de diseño iterativo',
      definicion: 'Diseñar implica comprender, idear, representar, construir, probar y mejorar en ciclos; los resultados de una prueba pueden obligar a volver a decisiones anteriores.',
      caso: 'El prototipo no soporta la carga especificada y el grupo quiere entregarlo porque ya terminó la etapa de construcción.',
      respuesta: 'Analizar la falla, modificar diseño o materiales y volver a probar contra la especificación.',
      errores: ['Entregarlo y explicar que el proceso de diseño es lineal.', 'Cambiar la especificación para que coincida con el prototipo.', 'Ocultar la prueba que produjo el resultado desfavorable.']
    },
    {
      concepto: 'Requisitos y restricciones',
      definicion: 'Los requisitos describen lo que la solución debe lograr y las restricciones fijan límites como costo, tiempo, seguridad, recursos, ambiente y normativa.',
      caso: 'Un refugio debe alojar a cuatro personas, resistir lluvia y costar menos de cierto monto. El equipo evalúa solo su apariencia.',
      respuesta: 'Convertir capacidad, impermeabilidad y costo en criterios medibles junto con los demás requisitos.',
      errores: ['Elegir el diseño más llamativo sin realizar mediciones.', 'Eliminar el límite de costo una vez construido.', 'Usar opiniones del equipo como único criterio de éxito.']
    },
    {
      concepto: 'Investigación para diseñar',
      definicion: 'La búsqueda tecnológica combina observación, fuentes confiables, antecedentes de soluciones, datos de usuarios y pruebas; la información se evalúa por pertinencia, evidencia y actualidad.',
      caso: 'Para seleccionar un material, el grupo usa la primera recomendación de una publicación sin autor ni datos técnicos.',
      respuesta: 'Contrastar fichas técnicas, fuentes identificables y ensayos propios vinculados con los requisitos.',
      errores: ['Aceptar la publicación porque aparece primero en el buscador.', 'Elegir el material más conocido sin medir propiedades.', 'Usar solo la opinión de un integrante del grupo.']
    },
    {
      concepto: 'Ideación divergente y convergente',
      definicion: 'La ideación divergente produce alternativas variadas sin cerrarse prematuramente; la convergente compara opciones con criterios para seleccionar o combinar una propuesta.',
      caso: 'El líder presenta su primera idea y pide al equipo limitarse a mejorarla.',
      respuesta: 'Generar varias alternativas primero y después compararlas mediante criterios acordados.',
      errores: ['Aceptar la primera idea para evitar pérdida de tiempo.', 'Elegir mediante votación sin criterios.', 'Prohibir combinar elementos de propuestas distintas.']
    },
    {
      concepto: 'Representación técnica',
      definicion: 'Bocetos, diagramas, planos, modelos y especificaciones comunican aspectos distintos de una solución; deben incluir la información necesaria para construir, operar o evaluar.',
      caso: 'El fabricante recibe un dibujo en perspectiva sin medidas, materiales ni detalles de unión.',
      respuesta: 'Completar la representación con vistas, cotas, especificaciones y detalles coherentes con la fabricación.',
      errores: ['Aumentar el sombreado artístico del dibujo.', 'Pedir que el fabricante estime todas las dimensiones.', 'Reemplazar el plano por una descripción oral.']
    },
    {
      concepto: 'Selección de materiales',
      definicion: 'La selección compara propiedades, proceso de fabricación, disponibilidad, costo, seguridad, mantenimiento e impacto ambiental respecto de la función requerida.',
      caso: 'Para una pieza expuesta a humedad se elige el material más barato sin revisar corrosión ni mantenimiento.',
      respuesta: 'Construir una matriz de decisión que incluya resistencia al ambiente y costo del ciclo de vida.',
      errores: ['Mantener la elección porque el precio inicial es el único dato objetivo.', 'Elegir el material más pesado suponiendo que siempre es más resistente.', 'Aplicar pintura sin verificar compatibilidad ni condiciones de uso.']
    },
    {
      concepto: 'Prototipo',
      definicion: 'Un prototipo es una representación construida para aprender y comprobar hipótesis sobre forma, función, interacción o fabricación; su fidelidad depende de la pregunta que se quiere resolver.',
      caso: 'El equipo necesita comprobar si los controles de un dispositivo se entienden, pero planea fabricar primero toda la electrónica definitiva.',
      respuesta: 'Usar un prototipo simple de interfaz y observar a usuarios antes de invertir en el sistema completo.',
      errores: ['Construir el producto final y llamarlo prototipo después.', 'Preguntar al propio equipo sin permitir que nadie use el modelo.', 'Evaluar solo el costo estimado de componentes.']
    },
    {
      concepto: 'Prueba e iteración',
      definicion: 'Una prueba válida define criterio, procedimiento y evidencia; la iteración usa los resultados para modificar la solución y volver a comprobar, registrando decisiones.',
      caso: 'Tres integrantes empujan una estructura de modos distintos y concluyen que “parece resistente”.',
      respuesta: 'Diseñar una prueba repetible con carga definida, medición y umbral de aceptación.',
      errores: ['Conservar la impresión del grupo como evidencia suficiente.', 'Probar hasta obtener un resultado favorable y descartar los demás.', 'Cambiar el criterio después de conocer el resultado.']
    },
    {
      concepto: 'Ciclo de vida del producto',
      definicion: 'El análisis de ciclo de vida considera extracción, fabricación, distribución, uso, mantenimiento y fin de vida para evitar trasladar impactos de una etapa a otra.',
      caso: 'Dos productos consumen igual energía en uso, pero uno requiere material escaso y no puede repararse.',
      respuesta: 'Comparar también origen de materiales, durabilidad, reparación y disposición final.',
      errores: ['Declararlos equivalentes porque consumen lo mismo durante el uso.', 'Considerar solo el empaque visible.', 'Elegir el más nuevo sin examinar sus etapas.']
    },
    {
      concepto: 'Ecodiseño y economía circular',
      definicion: 'El ecodiseño previene impactos desde la concepción y favorece durabilidad, reparación, modularidad, reducción de materiales, reutilización y recuperación al final de la vida útil.',
      caso: 'Un aparato falla por una batería sellada que cuesta más reemplazar que el producto completo.',
      respuesta: 'Rediseñar con batería reemplazable, acceso de reparación e información de repuestos.',
      errores: ['Añadir una etiqueta verde sin modificar el diseño.', 'Reducir la garantía para acelerar el reemplazo.', 'Usar más adhesivo para impedir que el usuario abra el equipo.']
    },
    {
      concepto: 'Evaluación ética de impactos',
      definicion: 'Una decisión tecnológica examina beneficios, riesgos, distribución de efectos, derechos, accesibilidad, ambiente y posibilidad de daño, incluyendo voces de grupos afectados.',
      caso: 'Un sistema escolar de reconocimiento facial agiliza el ingreso, pero no se han evaluado sesgos ni tratamiento de datos biométricos.',
      respuesta: 'Analizar necesidad, proporcionalidad, privacidad, seguridad, sesgos y alternativas menos invasivas antes de implementarlo.',
      errores: ['Implementarlo porque la rapidez compensa cualquier riesgo.', 'Evaluar solo la precisión promedio informada por el proveedor.', 'Suponer consentimiento por el hecho de pertenecer a la escuela.']
    },
    {
      concepto: 'Sistema con retroalimentación',
      definicion: 'Un sistema recibe entradas, realiza procesos y produce salidas; la retroalimentación compara el resultado con una referencia y modifica el funcionamiento para regularlo.',
      caso: 'Un calefactor usa un sensor para comparar temperatura ambiente con la programada y encenderse o apagarse.',
      respuesta: 'Reconocer un sistema de control con retroalimentación basada en la diferencia de temperatura.',
      errores: ['Clasificarlo como sistema sin entradas.', 'Afirmar que el sensor es la salida principal.', 'Concluir que no existe control porque interviene electricidad.']
    },
    {
      concepto: 'Automatización y control',
      definicion: 'La automatización integra sensores, lógica de decisión y actuadores para ejecutar procesos; su diseño debe contemplar estados, excepciones, seguridad e intervención humana.',
      caso: 'Una barrera automática baja con temporizador sin verificar si todavía pasa una persona.',
      respuesta: 'Agregar detección de presencia y una lógica de seguridad que impida o revierta el cierre.',
      errores: ['Reducir el tiempo de cierre para que el riesgo dure menos.', 'Aumentar la fuerza del motor.', 'Eliminar todo mecanismo manual de emergencia.']
    },
    {
      concepto: 'Algoritmo',
      definicion: 'Un algoritmo es una secuencia finita y precisa de instrucciones que transforma entradas en resultados; puede incluir decisiones, repeticiones y manejo de casos excepcionales.',
      caso: 'El programa calcula un promedio, pero falla cuando la lista está vacía.',
      respuesta: 'Incorporar una condición que detecte la ausencia de datos antes de dividir.',
      errores: ['Repetir la división hasta obtener un número.', 'Ocultar el mensaje de error sin cambiar la lógica.', 'Usar siempre un divisor fijo aunque cambie la cantidad de datos.']
    },
    {
      concepto: 'Datos y planillas de cálculo',
      definicion: 'Las planillas permiten organizar, calcular, filtrar y visualizar datos; las fórmulas, unidades, referencias y fuentes deben validarse para que el gráfico no oculte errores.',
      caso: 'Un gráfico muestra un gran aumento porque el eje vertical comienza muy cerca de los valores observados.',
      respuesta: 'Revisar escala y contexto, mostrar los datos y justificar una representación que no exagere la diferencia.',
      errores: ['Mantenerlo porque todo gráfico generado automáticamente es neutral.', 'Eliminar las etiquetas para hacerlo más limpio.', 'Cambiar los datos hasta que el gráfico parezca equilibrado.']
    },
    {
      concepto: 'Ciudadanía y seguridad digital',
      definicion: 'El uso responsable de tecnología protege datos, identidad, autoría y convivencia; distingue permisos, minimiza información recolectada y verifica fuentes antes de compartir.',
      caso: 'Una aplicación escolar solicita ubicación permanente y acceso a contactos aunque solo registra tareas.',
      respuesta: 'Cuestionar esos permisos, limitar la recolección a lo necesario y buscar una alternativa proporcional.',
      errores: ['Aceptar todos los permisos porque la aplicación es educativa.', 'Publicar las credenciales para que el curso use una sola cuenta.', 'Compartir los datos con terceros para financiar el servicio.']
    },
    {
      concepto: 'Gestión de proyectos tecnológicos',
      definicion: 'Gestionar un proyecto implica definir alcance, tareas, responsables, secuencia, recursos, riesgos, hitos y evidencias, revisando el plan cuando cambia la información.',
      caso: 'El equipo descubre a mitad del proyecto que una pieza tiene seis semanas de demora y nunca registró riesgos ni dependencias.',
      respuesta: 'Actualizar ruta crítica, evaluar alternativas y comunicar el impacto sobre alcance y plazo.',
      errores: ['Ocultar la demora hasta la fecha de entrega.', 'Mantener el cronograma original aunque sea imposible.', 'Asignar más personas a una tarea que depende exclusivamente de la pieza.']
    },
    {
      concepto: 'Evaluación auténtica en Tecnología',
      definicion: 'La evaluación recoge evidencia del proceso y del producto mediante problema, bitácora, prototipos, pruebas, decisiones justificadas e iteraciones, con criterios conocidos desde el inicio.',
      caso: 'La unidad pide diseñar una solución, pero la nota se basa solo en la apariencia del producto terminado.',
      respuesta: 'Evaluar también investigación, criterios, pruebas, mejoras y argumentación mediante rúbrica y evidencias de proceso.',
      errores: ['Mantener solo la apariencia porque facilita comparar productos.', 'Calificar la cantidad de materiales utilizados.', 'Asignar la misma nota grupal sin revisar aportes ni decisiones.']
    }
  ]
});
