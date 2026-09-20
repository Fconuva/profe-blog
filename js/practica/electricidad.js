/* Práctica ECEP 2026 · Electricidad TP. */
window.crearPractica2026({
  id: 'practica-electricidad',
  titulo: 'Práctica ECEP 2026 · Educación Media TP · Electricidad',
  alcance: 'Alineada con los seis dominios del temario oficial 2026 de EMTP Electricidad.',
  focos: [
    {
      concepto: 'Levantamiento de requerimientos eléctricos',
      definicion: 'La evaluación preliminar de un proyecto identifica uso del recinto, cargas, demanda, condiciones ambientales, suministro disponible, riesgos y restricciones antes de dimensionar la solución.',
      caso: 'Un taller solicita “más enchufes”. El técnico comienza a dibujar canalizaciones sin registrar máquinas, potencias, simultaneidad ni condiciones del lugar.',
      respuesta: 'Levantar cargas y condiciones de uso, estimar demanda y documentar restricciones antes de diseñar circuitos.',
      errores: ['Copiar el plano de otro taller de superficie similar.', 'Elegir primero las protecciones disponibles en bodega.', 'Instalar enchufes y medir la corriente solo después de energizar.']
    },
    {
      concepto: 'Plano y simbología eléctrica',
      definicion: 'Un proyecto comunicable representa circuitos, tableros, protecciones, canalizaciones y puntos mediante símbolos normalizados, leyenda, escalas y referencias coherentes.',
      caso: 'Dos instaladores interpretan de manera distinta un símbolo dibujado a mano en el plano y ejecutan conexiones incompatibles.',
      respuesta: 'Corregir el plano con simbología normalizada y una leyenda inequívoca antes de continuar la ejecución.',
      errores: ['Mantener el dibujo y explicar oralmente su significado a cada turno.', 'Dejar que cada instalador use la convención que conoce.', 'Reemplazar todo el plano por una lista de materiales.']
    },
    {
      concepto: 'Cubicación y presupuesto',
      definicion: 'La cubicación cuantifica materiales, equipos y mano de obra a partir del diseño; el presupuesto agrega precios, pérdidas razonables, impuestos y condiciones de ejecución sin duplicar partidas.',
      caso: 'El listado considera metros de conductor, pero omite terminales, fijaciones, protecciones y horas de montaje.',
      respuesta: 'Revisar el proyecto por partidas e incorporar todos los recursos y rendimientos necesarios con trazabilidad.',
      errores: ['Aumentar arbitrariamente en 50 % solo el valor del conductor.', 'Esperar la obra terminada para registrar los costos reales.', 'Cobrar una suma global sin relacionarla con el diseño.']
    },
    {
      concepto: 'Eficiencia de iluminación',
      definicion: 'Una solución eficiente satisface nivel y uniformidad de iluminación con potencia y control adecuados, considerando eficacia luminosa, horas de uso, mantenimiento y aprovechamiento de luz natural.',
      caso: 'Se propone reemplazar luminarias de 120 W por LED de 40 W con flujo luminoso equivalente y el mismo patrón de distribución.',
      respuesta: 'Comparar iluminancia requerida, consumo anual y condiciones de montaje antes de aprobar el reemplazo.',
      errores: ['Elegir siempre la luminaria de menor potencia sin medir iluminación.', 'Mantener las antiguas porque toda reducción de potencia disminuye necesariamente la luz útil.', 'Comparar solo el precio de compra e ignorar consumo y vida útil.']
    },
    {
      concepto: 'Desenergización y verificación de ausencia de tensión',
      definicion: 'Antes de intervenir se debe identificar la fuente, seccionar, impedir la reconexión, verificar ausencia de tensión con instrumento comprobado y controlar energías residuales.',
      caso: 'Un estudiante baja el interruptor del circuito y comienza a retirar la tapa del tablero sin medir.',
      respuesta: 'Detener la tarea, bloquear o señalizar la maniobra y verificar ausencia de tensión antes de tocar conductores.',
      errores: ['Continuar porque el interruptor en posición abierta garantiza por sí solo seguridad.', 'Usar guantes y trabajar energizado para ahorrar tiempo.', 'Tocar brevemente un conductor con el dorso de la mano para comprobarlo.']
    },
    {
      concepto: 'Ley de Ohm',
      definicion: 'En un elemento resistivo, tensión, corriente y resistencia se relacionan mediante V = I·R; el cálculo debe acompañarse de unidades y de condiciones del circuito.',
      caso: 'Una resistencia de 24 ohm se conecta a una fuente de 12 V. Un estudiante afirma que circularán 2 A.',
      respuesta: 'Corregir el cálculo: la corriente es 0,5 A porque I = 12 V / 24 ohm.',
      errores: ['Aceptar 2 A porque se multiplican tensión y resistencia.', 'Concluir 12 A porque la corriente siempre coincide con la tensión.', 'Indicar 288 A porque basta calcular V·R.']
    },
    {
      concepto: 'Circuitos serie y paralelo',
      definicion: 'En serie circula la misma corriente y se reparten las tensiones; en paralelo todas las ramas comparten tensión y la corriente total es la suma de las corrientes de rama.',
      caso: 'Dos cargas domiciliarias deben operar de manera independiente a tensión nominal. Un estudiante propone conectarlas en serie.',
      respuesta: 'Conectarlas en paralelo para que cada carga reciba la tensión de alimentación y funcione independientemente.',
      errores: ['Conectarlas en serie para que ambas reciban siempre la tensión completa.', 'Unir solo sus conductores de protección para formar el circuito.', 'Conectarlas sin considerar tensión porque la potencia corrige la conexión.']
    },
    {
      concepto: 'Leyes de Kirchhoff',
      definicion: 'La ley de corrientes expresa conservación de carga en un nodo y la ley de tensiones expresa conservación de energía en una trayectoria cerrada.',
      caso: 'En un nodo ingresan 8 A; por dos ramas salen 3 A y 2 A. Se busca la corriente de la tercera rama.',
      respuesta: 'Determinar 3 A de salida, porque la suma de corrientes que entra debe igualar la que sale.',
      errores: ['Determinar 13 A sumando todas las corrientes mencionadas.', 'Determinar 8 A porque cada rama recibe la corriente total.', 'Determinar 1 A restando solo las dos corrientes de salida.']
    },
    {
      concepto: 'Potencia en corriente alterna',
      definicion: 'En corriente alterna se distinguen potencia activa, reactiva y aparente; el factor de potencia relaciona la activa con la aparente e incide en el uso de la instalación.',
      caso: 'Un motor consume 10 kVA y entrega una lectura de 8 kW. El encargado afirma que su factor de potencia es 1,25.',
      respuesta: 'Corregirlo a 0,8, obtenido como 8 kW dividido por 10 kVA.',
      errores: ['Aceptar 1,25 porque se divide potencia aparente por activa.', 'Informar 18 porque se suman ambas potencias.', 'Indicar que el factor de potencia no se aplica a motores.']
    },
    {
      concepto: 'Selección de instrumentos de medición',
      definicion: 'El instrumento y su conexión se eligen según magnitud, rango, categoría de seguridad y estado del circuito: tensión en paralelo, corriente según método apropiado y resistencia con el circuito desenergizado.',
      caso: 'Para medir resistencia de aislamiento, un estudiante conecta el multímetro en ohmios mientras el circuito permanece energizado.',
      respuesta: 'Desenergizar, aislar el circuito y utilizar un medidor de aislamiento con tensión de prueba adecuada.',
      errores: ['Mantener el circuito energizado para obtener una lectura realista.', 'Usar una pinza amperométrica alrededor de fase y neutro juntos.', 'Medir continuidad con el voltímetro conectado en serie.']
    },
    {
      concepto: 'Diagnóstico sistemático de fallas',
      definicion: 'Diagnosticar implica confirmar el síntoma, revisar información, formular hipótesis, medir con seguridad, aislar la causa, corregir y verificar funcionamiento, sin sustituir componentes al azar.',
      caso: 'Un motor no parte y el estudiante propone cambiarlo inmediatamente sin revisar alimentación ni circuito de mando.',
      respuesta: 'Comprobar primero tensión, protecciones, mando y continuidad para localizar la falla antes de reemplazar equipos.',
      errores: ['Cambiar motor, contactor y relé térmico simultáneamente.', 'Rearmar repetidamente la protección hasta que el motor arranque.', 'Puentear los contactos de seguridad para descartar el mando.']
    },
    {
      concepto: 'Sistema fotovoltaico',
      definicion: 'Un sistema fotovoltaico convierte radiación solar en electricidad e integra módulos, estructura, conductores, protecciones y, según configuración, regulador, baterías e inversor.',
      caso: 'Se necesita alimentar una carga de corriente alterna desde módulos fotovoltaicos que entregan corriente continua.',
      respuesta: 'Incorporar un inversor dimensionado y las protecciones correspondientes entre el lado continuo y la carga.',
      errores: ['Conectar la carga alterna directamente a los módulos.', 'Instalar solo un transformador, que convierte por sí mismo continua en alterna.', 'Aumentar la cantidad de módulos sin equipo de conversión.']
    },
    {
      concepto: 'Transformador eléctrico',
      definicion: 'El transformador transfiere energía por inducción electromagnética en corriente alterna y modifica niveles de tensión y corriente de acuerdo con la relación de espiras, manteniendo aproximadamente la potencia ideal.',
      caso: 'Un transformador ideal reduce de 220 V a 22 V. Se afirma que su relación de espiras secundario/primario es 10.',
      respuesta: 'Corregirla a 0,1, porque 22/220 corresponde también a Ns/Np en el caso ideal.',
      errores: ['Aceptar 10 porque toda reducción aumenta la relación secundaria/primaria.', 'Indicar que la relación depende solo de la corriente de carga.', 'Concluir que un transformador no puede reducir tensión.']
    },
    {
      concepto: 'Motor de inducción',
      definicion: 'En un motor de inducción, el campo magnético giratorio del estator induce corrientes en el rotor y produce torque; el deslizamiento permite esa inducción durante la operación.',
      caso: 'Para invertir el giro de un motor trifásico, un estudiante propone cambiar simultáneamente las tres fases por otras tres en el mismo orden.',
      respuesta: 'Intercambiar dos fases de alimentación, aplicando el procedimiento seguro y verificando el sentido de giro.',
      errores: ['Cambiar las tres fases manteniendo su secuencia original.', 'Unir dos fases para forzar el giro contrario.', 'Reducir la frecuencia a cero y volver a aumentarla sin cambiar secuencia.']
    },
    {
      concepto: 'Mantenimiento preventivo y predictivo',
      definicion: 'El preventivo se programa por tiempo o uso para reducir fallas; el predictivo observa condición mediante variables como temperatura, vibración o aislamiento para intervenir según tendencia.',
      caso: 'La planta registra mensualmente vibración y temperatura de rodamientos y programa una intervención cuando ambas muestran una tendencia anormal.',
      respuesta: 'Clasificar la estrategia como mantenimiento predictivo basado en condición.',
      errores: ['Clasificarla como correctivo porque aún no se detiene la máquina.', 'Clasificarla como limpieza rutinaria sin finalidad diagnóstica.', 'Esperar la falla completa para confirmar que la tendencia era válida.']
    },
    {
      concepto: 'Arquitectura de un PLC',
      definicion: 'Un controlador lógico programable integra fuente, CPU, memoria y módulos de entradas y salidas; recibe señales de campo, ejecuta el programa y gobierna actuadores.',
      caso: 'Un sensor de proximidad debe informar al programa que una pieza llegó a la estación.',
      respuesta: 'Conectarlo a una entrada compatible del PLC y asignar su dirección en el programa.',
      errores: ['Conectarlo directamente a una salida del PLC.', 'Conectarlo a la CPU sin módulo ni referencia eléctrica.', 'Sustituirlo por una bobina interna sin señal física.']
    },
    {
      concepto: 'Ciclo de escaneo del PLC',
      definicion: 'El PLC actualiza entradas, ejecuta la lógica y actualiza salidas de manera cíclica; comprender este orden permite interpretar respuestas, temporizaciones y cambios entre escaneos.',
      caso: 'Una entrada cambia justo después de que el PLC tomó su imagen de entradas y un alumno espera que la salida cambie en el mismo instante lógico.',
      respuesta: 'Explicar que el cambio será considerado en el siguiente ciclo de escaneo, según la arquitectura y el programa.',
      errores: ['Afirmar que las salidas se actualizan antes de leer entradas.', 'Concluir que la entrada quedó perdida para siempre.', 'Modificar el cableado para que la entrada se conecte a la salida.']
    },
    {
      concepto: 'Lógica Ladder y enclavamiento',
      definicion: 'El lenguaje Ladder representa condiciones mediante contactos y órdenes mediante bobinas; un enclavamiento mantiene un estado bajo condiciones definidas y debe incorporar parada y seguridades efectivas.',
      caso: 'Un circuito de marcha-parada mantiene el motor encendido, pero el contacto de parada quedó programado de modo que su falla de cable no detiene el proceso.',
      respuesta: 'Rediseñar con criterio de falla segura y verificar que parada y protecciones interrumpan la orden ante pérdida de señal.',
      errores: ['Eliminar la parada para simplificar el programa.', 'Mantener el programa y confiar solo en el botón de marcha.', 'Usar una memoria permanente que no pueda ser restablecida.']
    },
    {
      concepto: 'Gestión sustentable de materiales eléctricos',
      definicion: 'La sustentabilidad prioriza prevenir, reducir y reutilizar antes de reciclar o disponer; residuos eléctricos, baterías y materiales peligrosos requieren segregación, trazabilidad y manejo autorizado.',
      caso: 'Tras una práctica quedan cables reutilizables, cobre limpio, luminarias dañadas y baterías mezclados en un contenedor común.',
      respuesta: 'Separar por condición y tipo, reutilizar lo seguro, recuperar materiales y derivar residuos peligrosos por un canal autorizado.',
      errores: ['Enviar todo a basura domiciliaria para evitar acumulación.', 'Quemar los cables para recuperar rápidamente el cobre.', 'Guardar indefinidamente todos los residuos sin inventario.']
    },
    {
      concepto: 'Evaluación de desempeño en TP',
      definicion: 'Una competencia técnica se evalúa con tareas auténticas y criterios observables que integran planificación, ejecución segura, calidad del resultado, explicación técnica y uso responsable de recursos.',
      caso: 'El objetivo exige diagnosticar una falla eléctrica, pero la evaluación final consiste solo en definir conceptos por escrito.',
      respuesta: 'Plantear una falla controlada, observar el procedimiento con rúbrica y pedir que el estudiante justifique mediciones y decisión.',
      errores: ['Mantener solo definiciones porque son más fáciles de corregir.', 'Calificar únicamente si el equipo volvió a funcionar.', 'Evaluar rapidez sin considerar seguridad ni razonamiento.']
    }
  ]
});
