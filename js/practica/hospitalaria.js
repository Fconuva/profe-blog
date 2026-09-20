/* Práctica transversal 2026 · Pedagogía hospitalaria. */
window.crearPractica2026({
  id: 'practica-hospitalaria',
  titulo: 'Práctica 2026 · Pedagogía Hospitalaria',
  alcance: 'Ensayo propio de formación pedagógica; no corresponde a una forma oficial ECEP independiente.',
  focos: [
    {
      concepto: 'Derecho a continuidad educativa',
      definicion: 'La enfermedad y hospitalización no suspenden el derecho a aprender; la respuesta educativa busca continuidad, pertenencia y desarrollo, adaptándose a condiciones de salud sin reducir al estudiante a su diagnóstico.',
      caso: 'Una escuela de origen decide cerrar la matrícula de un estudiante porque su tratamiento durará varios meses.',
      respuesta: 'Coordinar continuidad con el aula hospitalaria y conservar una trayectoria documentada y articulada.',
      errores: ['Esperar el alta para reiniciar desde cero.', 'Entregar solo tareas sin comunicación entre docentes.', 'Dar por aprobado todo el año sin recoger evidencia.']
    },
    {
      concepto: 'Coordinación salud-educación',
      definicion: 'La planificación pedagógica considera indicaciones del equipo de salud sobre energía, movilidad, aislamiento y procedimientos, mientras el equipo educativo conserva responsabilidad sobre metas y enseñanza.',
      caso: 'La docente recibe una indicación de reposo durante una franja horaria en que había programado una evaluación.',
      respuesta: 'Reprogramar la evidencia y coordinar un momento compatible con el estado de salud y el propósito evaluativo.',
      errores: ['Aplicarla igual para mantener el calendario.', 'Pedir al personal de salud que califique al estudiante.', 'Eliminar definitivamente el aprendizaje evaluado.']
    },
    {
      concepto: 'Indicaciones médicas como condición de acceso',
      definicion: 'Las restricciones de salud delimitan condiciones seguras de participación, pero no definen capacidad intelectual; el docente busca medios alternativos para sostener el aprendizaje posible.',
      caso: 'Un estudiante no puede levantarse de la cama, y alguien concluye que tampoco puede participar en ciencias.',
      respuesta: 'Adaptar materiales y forma de interacción para trabajar el objetivo desde la cama si su estado lo permite.',
      errores: ['Suspender toda actividad cognitiva por la limitación motora.', 'Ignorar la indicación y trasladarlo al aula.', 'Sustituir ciencias por entretenimiento sin propósito.']
    },
    {
      concepto: 'Planificación flexible y modular',
      definicion: 'Las secuencias breves, modulares y con cierres parciales permiten aprender pese a interrupciones, procedimientos o cambios de energía, y facilitan retomar sin perder el sentido global.',
      caso: 'Una actividad requiere noventa minutos continuos, pero el tratamiento interrumpe la jornada cada veinte minutos.',
      respuesta: 'Dividirla en tramos con metas claras, registro de avance y puntos de reinicio.',
      errores: ['Exigir completar los noventa minutos de una vez.', 'Eliminar la actividad sin buscar alternativa.', 'Reducirla a copiar el resultado final.']
    },
    {
      concepto: 'Priorización curricular',
      definicion: 'Priorizar selecciona aprendizajes esenciales y conexiones fértiles considerando trayectoria, tiempo y estado de salud; no consiste en bajar indiscriminadamente la complejidad ni cubrir superficialmente todo.',
      caso: 'Un estudiante tendrá pocas semanas de atención y la docente intenta reproducir cada actividad del curso de origen.',
      respuesta: 'Acordar objetivos esenciales, integrar contenidos y concentrar evidencia en aprendizajes transferibles.',
      errores: ['Avanzar rápidamente por todas las páginas sin comprobar comprensión.', 'Enseñar solo actividades recreativas.', 'Elegir contenidos según lo más fácil de preparar.']
    },
    {
      concepto: 'Plan pedagógico individual',
      definicion: 'El plan individual registra nivel, objetivos priorizados, condiciones de salud pertinentes, apoyos, coordinación, evidencias y revisión; se actualiza con el estudiante, familia y escuelas involucradas.',
      caso: 'El plan fue elaborado al ingreso, pero el tratamiento y la energía disponible cambiaron significativamente.',
      respuesta: 'Revisarlo con información actual, ajustar apoyos y metas y registrar decisiones y responsables.',
      errores: ['Mantenerlo porque ya fue firmado.', 'Rehacerlo sin consultar al estudiante ni a la familia.', 'Agregar información clínica no necesaria para enseñar.']
    },
    {
      concepto: 'Articulación con la escuela de origen',
      definicion: 'La articulación comparte objetivos, materiales, avances y criterios por canales protegidos, evitando duplicar tareas o generar brechas y preparando desde temprano el retorno.',
      caso: 'La escuela de origen envía evaluaciones de contenidos que el aula hospitalaria no sabía que estaban trabajando.',
      respuesta: 'Establecer un referente y calendario de comunicación para acordar prioridades y evidencias antes de evaluar.',
      errores: ['Aplicar todas las pruebas recibidas sin revisión.', 'Cortar comunicación y crear un currículo independiente.', 'Pedir a la familia que coordine sola a ambas instituciones.']
    },
    {
      concepto: 'Aula multigrado y multiedad',
      definicion: 'La diversidad de edades y niveles se aborda con núcleos comunes, tareas escalonadas, estaciones y apoyos diferenciados, preservando objetivos pertinentes para cada trayectoria.',
      caso: 'En una misma sesión participan estudiantes de distintos cursos y la docente dicta una guía idéntica para todos.',
      respuesta: 'Organizar un tema común con desafíos y productos ajustados a los objetivos de cada nivel.',
      errores: ['Trabajar siempre el nivel del estudiante menor.', 'Separar a cada estudiante sin interacción posible.', 'Usar solo actividades de entretención comunes.']
    },
    {
      concepto: 'Pedagogía en habitación',
      definicion: 'La enseñanza junto a la cama requiere consentimiento, higiene, materiales manejables, tiempos breves y lectura continua del estado del estudiante, sin invadir procedimientos ni transformar cuidado en clase forzada.',
      caso: 'La docente llega durante un procedimiento y el estudiante muestra cansancio y dolor.',
      respuesta: 'Coordinar con el equipo, postergar o ofrecer una interacción breve elegida por el estudiante cuando sea seguro.',
      errores: ['Comenzar para no perder la visita programada.', 'Pedir a la familia que lo mantenga despierto.', 'Registrar falta de disposición como incumplimiento.']
    },
    {
      concepto: 'Contención pedagógica',
      definicion: 'El docente ofrece escucha, predictibilidad y un espacio seguro para aprender, reconoce emociones y deriva cuando corresponde; no realiza intervención clínica para la que no está habilitado.',
      caso: 'Una estudiante expresa miedo intenso antes de una intervención médica y no logra concentrarse.',
      respuesta: 'Escuchar, validar, ofrecer elección sobre una actividad breve y coordinar apoyo psicosocial o de salud si se requiere.',
      errores: ['Prometer que nada malo ocurrirá.', 'Obligarla a trabajar para distraerla.', 'Interpretar clínicamente su reacción y comunicar un diagnóstico.']
    },
    {
      concepto: 'Incertidumbre y sentido de normalidad',
      definicion: 'Las rutinas educativas pueden aportar continuidad e identidad más allá de la enfermedad, siempre que sean flexibles y no nieguen incertidumbre, dolor o cambios del tratamiento.',
      caso: 'Un estudiante pide mantener su proyecto de escritura porque le permite pensar en algo distinto al hospital.',
      respuesta: 'Sostener el proyecto con metas adaptables y respetar cuándo desea detenerse o cambiar de actividad.',
      errores: ['Suspenderlo porque todo debe centrarse en la enfermedad.', 'Usarlo como obligación aunque el estado cambie.', 'Prometer una fecha de alta para motivarlo.']
    },
    {
      concepto: 'Fatiga y dosificación cognitiva',
      definicion: 'La fatiga puede fluctuar y afectar atención, velocidad y memoria; dosificar reduce duración, alterna demandas, incorpora pausas y prioriza calidad de evidencia sin asumir falta de capacidad.',
      caso: 'Un estudiante comprende oralmente, pero después de veinte minutos comete errores crecientes y deja tareas incompletas.',
      respuesta: 'Usar bloques breves, pausas y momentos de mayor energía, registrando comprensión con menos producción repetitiva.',
      errores: ['Aumentar ejercicios para desarrollar resistencia.', 'Bajar permanentemente el nivel conceptual.', 'Calificar los errores tardíos como falta de estudio.']
    },
    {
      concepto: 'Prevención y control de infecciones',
      definicion: 'Los materiales y desplazamientos respetan higiene, aislamiento y protocolos del establecimiento; la prevención se integra a la planificación y no se improvisa dentro de áreas clínicas.',
      caso: 'Un recurso manipulativo pasa entre habitaciones sin limpieza ni autorización.',
      respuesta: 'Detener su circulación, aplicar protocolo y preferir materiales individuales o higienizables aprobados.',
      errores: ['Continuar porque es material educativo.', 'Limpiarlo solo al final de la semana.', 'Pedir a estudiantes que decidan si quieren compartirlo.']
    },
    {
      concepto: 'Tecnología para presencia y continuidad',
      definicion: 'La tecnología puede conectar con la escuela, acceder a contenidos y producir evidencia, pero exige privacidad, consentimiento, accesibilidad y una alternativa cuando la conectividad o salud lo impiden.',
      caso: 'Se propone transmitir por videollamada desde una habitación compartida sin consultar a las personas presentes.',
      respuesta: 'Verificar consentimiento y privacidad, ajustar encuadre y horario o usar una alternativa asincrónica segura.',
      errores: ['Transmitir porque la finalidad es educativa.', 'Grabar la habitación completa para verla después.', 'Publicar el enlace en un grupo abierto.']
    },
    {
      concepto: 'Colaboración con la familia',
      definicion: 'La familia aporta información sobre energía, intereses y trayectoria y participa en acuerdos, pero no debe convertirse por defecto en docente ni cargar sola con la continuidad escolar.',
      caso: 'La escuela envía numerosas guías y pide a la madre enseñarlas durante el tratamiento.',
      respuesta: 'Coordinar prioridades, ofrecer enseñanza directa y acordar un rol familiar posible y voluntario.',
      errores: ['Responsabilizarla de cubrir todo el currículum.', 'Excluirla de toda información pedagógica.', 'Calificar al estudiante según la ayuda disponible en casa.']
    },
    {
      concepto: 'Confidencialidad de datos de salud',
      definicion: 'La información clínica se comparte solo con autorización y necesidad educativa, se resguarda y se traduce en apoyos concretos sin divulgar diagnósticos ni detalles innecesarios.',
      caso: 'Para explicar una ausencia, un docente planea enviar al curso el informe médico completo.',
      respuesta: 'Comunicar únicamente la información acordada y necesaria, protegiendo antecedentes clínicos y voluntad del estudiante.',
      errores: ['Enviar el informe porque el curso tiene buenas intenciones.', 'Publicarlo sin nombre pero con detalles identificables.', 'Pedir a compañeros que investiguen la condición.']
    },
    {
      concepto: 'Evaluación flexible y válida',
      definicion: 'La evaluación ajusta momento, extensión, formato y apoyos según salud, manteniendo el constructo y criterios; no penaliza síntomas ni confunde velocidad o escritura con comprensión.',
      caso: 'El objetivo es explicar un fenómeno, pero la prueba escrita extensa coincide con un período de limitación motora temporal.',
      respuesta: 'Permitir explicación oral o digital con los mismos criterios conceptuales y tiempo dosificado.',
      errores: ['Asignar nota mínima por no escribir.', 'Entregar las respuestas para evitar esfuerzo.', 'Cambiar el objetivo a caligrafía simple.']
    },
    {
      concepto: 'Reintegración a la escuela de origen',
      definicion: 'El retorno se prepara gradualmente con información acordada, ajustes, continuidad académica, apoyo social y seguimiento, atendiendo temores y evitando exposición no consentida.',
      caso: 'Un estudiante regresará después de una ausencia prolongada y teme preguntas sobre cambios físicos.',
      respuesta: 'Acordar con él qué comunicar, preparar al equipo, planificar carga gradual y una red de apoyo y seguimiento.',
      errores: ['Contar todos los detalles al curso antes de su regreso.', 'Exigir jornada completa desde el primer día.', 'Ignorar el tema para tratarlo exactamente como si nada hubiera ocurrido.']
    },
    {
      concepto: 'Duelo y pérdidas',
      definicion: 'Ante pérdidas, la comunidad educativa comunica con honestidad adecuada a la edad, respeta creencias y formas de expresión, ofrece apoyo y activa redes; evita rumores, silencios impuestos o exposición.',
      caso: 'Tras el fallecimiento de un integrante, circulan versiones contradictorias y el grupo pide conversar.',
      respuesta: 'Coordinar información confirmada, habilitar un espacio voluntario de expresión y derivar apoyos cuando sean necesarios.',
      errores: ['Inventar una explicación tranquilizadora.', 'Prohibir toda conversación para evitar tristeza.', 'Obligar a cada estudiante a relatar una experiencia personal.']
    },
    {
      concepto: 'Cuidado del equipo educativo',
      definicion: 'La exposición continua a enfermedad, incertidumbre y duelo requiere trabajo colaborativo, supervisión, límites, pausas y apoyo institucional; el autocuidado no reemplaza condiciones laborales responsables.',
      caso: 'Una docente acumula casos complejos, evita pedir ayuda y comienza a cometer errores de coordinación.',
      respuesta: 'Activar apoyo del equipo, revisar carga y responsabilidades y establecer espacios regulares de coordinación y cuidado.',
      errores: ['Pedirle que sea más resiliente sin cambiar condiciones.', 'Mantener confidencial todo error para protegerla.', 'Retirarla de forma punitiva sin ofrecer apoyo.']
    }
  ]
});
