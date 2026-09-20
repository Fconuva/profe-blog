/* Práctica ECEP 2026 · Contabilidad TP. Los porcentajes se entregan dentro de cada caso. */
window.crearPractica2026({
  id: 'practica-contabilidad',
  titulo: 'Práctica ECEP 2026 · Educación Media TP · Contabilidad',
  alcance: 'Alineada con los dominios técnicos y pedagógicos del temario oficial 2026 de EMTP Contabilidad.',
  focos: [
    {
      concepto: 'Ecuación contable',
      definicion: 'La situación financiera se representa mediante la igualdad Activo = Pasivo + Patrimonio; cada hecho económico debe mantenerla mediante variaciones coherentes en sus componentes.',
      caso: 'Una empresa compra al contado un computador por $800.000. Un estudiante registra solo un aumento del activo Equipos.',
      respuesta: 'Registrar el aumento de Equipos y la disminución de Caja o Banco por el mismo monto.',
      errores: ['Aumentar Equipos y Patrimonio por el mismo monto.', 'Disminuir Equipos y aumentar Caja.', 'Registrar únicamente un gasto sin reconocer el activo.']
    },
    {
      concepto: 'Partida doble',
      definicion: 'Todo asiento registra al menos un cargo y un abono cuya suma monetaria es igual, reflejando el doble efecto de una transacción sin que ello implique usar dos veces la misma cuenta.',
      caso: 'La empresa compra mercaderías a crédito y el estudiante carga Mercaderías, pero no registra la obligación con el proveedor.',
      respuesta: 'Completar el asiento abonando Proveedores por el total correspondiente.',
      errores: ['Volver a cargar Mercaderías para cuadrar.', 'Abonar Caja aunque no se realizó pago.', 'Esperar al pago para registrar también la compra.']
    },
    {
      concepto: 'Libro diario y libro mayor',
      definicion: 'El diario registra cronológicamente los asientos y el mayor acumula los movimientos por cuenta, permitiendo determinar saldos y preparar comprobaciones y estados.',
      caso: 'Se necesita conocer el saldo y todos los movimientos de la cuenta Clientes durante el mes.',
      respuesta: 'Revisar la cuenta Clientes en el libro mayor, respaldada por los asientos del diario.',
      errores: ['Buscar solo la última factura emitida.', 'Revisar el inventario físico de mercaderías.', 'Consultar exclusivamente el estado de resultados.']
    },
    {
      concepto: 'IVA débito y crédito fiscal',
      definicion: 'En el caso general planteado, las ventas gravadas generan débito fiscal y las compras respaldadas que dan derecho generan crédito fiscal; la diferencia determina el impuesto del período según los datos del ejercicio.',
      caso: 'En un ejercicio, el débito fiscal es $950.000 y el crédito fiscal aceptado es $570.000, sin remanentes ni ajustes.',
      respuesta: 'Determinar $380.000 por pagar, restando crédito fiscal al débito fiscal.',
      errores: ['Sumar ambos montos y declarar $1.520.000.', 'Declarar solo el crédito fiscal de $570.000.', 'Dividir el débito por el crédito para obtener el impuesto.']
    },
    {
      concepto: 'Documento tributario electrónico',
      definicion: 'Los documentos tributarios electrónicos respaldan operaciones y deben emitirse, recibirse, registrarse y conservarse con datos consistentes; el tipo de documento depende de la operación y del receptor.',
      caso: 'Una venta facturada se anula completamente porque la operación no se realizará.',
      respuesta: 'Emitir el documento de ajuste que corresponda, relacionándolo con la factura original y registrando su efecto.',
      errores: ['Borrar la factura del sistema sin dejar trazabilidad.', 'Emitir una segunda factura con monto negativo.', 'Ignorar la anulación hasta el cierre anual.']
    },
    {
      concepto: 'Control de inventarios',
      definicion: 'El control de existencias registra entradas, salidas y saldos por producto, concilia registros con conteos físicos y analiza diferencias, deterioro y rotación.',
      caso: 'El kardex indica 120 unidades, pero el conteo físico encuentra 112.',
      respuesta: 'Verificar documentos y movimientos, investigar la diferencia y registrar el ajuste autorizado con respaldo.',
      errores: ['Cambiar el conteo físico a 120 para que coincida.', 'Eliminar la ficha del producto y crear una nueva.', 'Registrar ocho unidades como venta sin evidencia.']
    },
    {
      concepto: 'Costo de ventas',
      definicion: 'En un sistema periódico simplificado, el costo de ventas se obtiene como inventario inicial más compras netas menos inventario final, según los antecedentes del caso.',
      caso: 'El inventario inicial es $2.000.000, las compras netas $7.000.000 y el inventario final $2.500.000.',
      respuesta: 'Calcular un costo de ventas de $6.500.000.',
      errores: ['Calcular $11.500.000 sumando también el inventario final.', 'Calcular $4.500.000 restando las compras al inventario final.', 'Calcular $7.000.000 usando solo las compras.']
    },
    {
      concepto: 'Estados financieros',
      definicion: 'El estado de situación presenta activos, pasivos y patrimonio a una fecha; el estado de resultados informa ingresos, costos y gastos de un período y explica utilidad o pérdida.',
      caso: 'La gerencia quiere saber si las operaciones del trimestre produjeron utilidad y qué partidas la explican.',
      respuesta: 'Analizar el estado de resultados del trimestre y sus ingresos, costos y gastos.',
      errores: ['Revisar solo el saldo de Caja del último día.', 'Usar únicamente el inventario físico de cierre.', 'Consultar el estado de situación sin examinar resultados.']
    },
    {
      concepto: 'Análisis financiero',
      definicion: 'Los indicadores relacionan partidas para interpretar liquidez, endeudamiento, actividad o rentabilidad; deben compararse con períodos, metas y contexto, no leerse como cifras aisladas.',
      caso: 'Una empresa tiene activo corriente de $12 millones y pasivo corriente de $8 millones.',
      respuesta: 'Calcular una razón corriente de 1,5 y analizarla junto con composición y vencimientos.',
      errores: ['Informar 4 millones como razón corriente.', 'Concluir solvencia perfecta sin revisar ninguna otra información.', 'Dividir pasivo corriente por patrimonio y llamarlo liquidez.']
    },
    {
      concepto: 'Depreciación de activos',
      definicion: 'La depreciación distribuye sistemáticamente el monto depreciable de un activo durante su vida útil estimada; no representa necesariamente una salida de efectivo del período.',
      caso: 'Una máquina cuesta $9.000.000, tiene valor residual de $1.000.000 y vida útil de cuatro años en el ejercicio lineal.',
      respuesta: 'Reconocer una depreciación anual de $2.000.000.',
      errores: ['Reconocer $2.250.000 ignorando el valor residual.', 'Registrar los $9.000.000 completos como depreciación anual.', 'No depreciar porque la máquina sigue funcionando.']
    },
    {
      concepto: 'Haberes imponibles y no imponibles',
      definicion: 'La liquidación distingue remuneraciones que integran la base imponible de asignaciones que, según los antecedentes normativos del caso, no la integran; los descuentos se calculan sobre la base que corresponda.',
      caso: 'El caso indica sueldo base de $800.000, bono imponible de $100.000 y movilización no imponible de $50.000.',
      respuesta: 'Usar $900.000 como base imponible y sumar la movilización después de calcular descuentos.',
      errores: ['Usar $950.000 como base imponible.', 'Usar solo $800.000 e ignorar el bono.', 'Descontar la movilización del sueldo base.']
    },
    {
      concepto: 'Descuentos previsionales',
      definicion: 'Los descuentos se calculan aplicando los porcentajes y topes entregados por el caso a la base correspondiente, separando aportes del trabajador, del empleador y otros descuentos autorizados.',
      caso: 'Una base imponible de $1.000.000 está afecta, según el ejercicio, a 11 % de AFP y 7 % de salud, sin otros descuentos.',
      respuesta: 'Calcular descuentos del trabajador por $180.000.',
      errores: ['Calcular $18.000 porque los porcentajes se expresan en centésimos.', 'Aplicar 18 % también a asignaciones no imponibles no incluidas en la base.', 'Sumar esos porcentajes como aportes exclusivos del empleador.']
    },
    {
      concepto: 'Contrato de trabajo',
      definicion: 'La relación laboral se caracteriza por prestación personal de servicios, remuneración y subordinación o dependencia; el documento contractual formaliza condiciones esenciales y sus modificaciones.',
      caso: 'Una persona cumple horario, recibe instrucciones, usa medios de la empresa y es supervisada, pero emite honorarios mensuales.',
      respuesta: 'Analizar la realidad de subordinación y dependencia, pues el nombre del documento no elimina por sí solo una relación laboral.',
      errores: ['Concluir automáticamente que nunca existe relación laboral porque emite honorarios.', 'Considerar únicamente si usa uniforme.', 'Definir la relación según la preferencia unilateral de la empresa.']
    },
    {
      concepto: 'Cálculo de horas extraordinarias',
      definicion: 'El cálculo debe seguir la jornada, valor hora y recargo definidos por la normativa o por los datos del ejercicio, documentando base y cantidad de horas efectivamente autorizadas.',
      caso: 'El ejercicio entrega valor hora ordinaria de $5.000, recargo de 50 % y cuatro horas extraordinarias autorizadas.',
      respuesta: 'Calcular $30.000, porque cada hora extraordinaria vale $7.500.',
      errores: ['Calcular $10.000 considerando solo el recargo.', 'Calcular $20.000 sin aplicar recargo.', 'Calcular $40.000 duplicando el valor hora.']
    },
    {
      concepto: 'Término de la relación laboral',
      definicion: 'El finiquito debe identificar causal, haberes y descuentos procedentes, indemnizaciones cuando correspondan y feriado pendiente, todo respaldado y calculado con los datos vigentes del caso.',
      caso: 'Un estudiante calcula un finiquito sin revisar causal de término ni antigüedad y aplica la misma indemnización a todos los casos.',
      respuesta: 'Determinar primero causal, fechas, remuneración base y derechos asociados antes de calcular cada partida.',
      errores: ['Usar una suma fija idéntica para cualquier causal.', 'Considerar solo el último sueldo líquido.', 'Excluir el feriado pendiente porque el contrato terminó.']
    },
    {
      concepto: 'Declaración tributaria periódica',
      definicion: 'La preparación de una declaración exige conciliar registros de compras y ventas, documentos de ajuste, bases e impuestos antes de ingresar datos y conservar respaldos de revisión.',
      caso: 'La planilla de declaración no coincide con el registro de compras porque falta una nota de crédito recibida.',
      respuesta: 'Investigar y conciliar la diferencia antes de presentar, incorporando el documento con su efecto correcto.',
      errores: ['Modificar el registro hasta igualar la declaración sin revisar el documento.', 'Presentar y corregir solo si la autoridad observa.', 'Eliminar una compra de igual monto para forzar la cuadratura.']
    },
    {
      concepto: 'Ética y confidencialidad contable',
      definicion: 'El trabajo contable exige integridad, objetividad, confidencialidad y trazabilidad; no se alteran registros para favorecer intereses ni se divulga información sin autorización o deber legal.',
      caso: 'Un superior pide postergar el registro de una factura para mostrar mejores resultados al banco.',
      respuesta: 'Rechazar la alteración, explicar su efecto y mantener el registro fiel y documentado del período.',
      errores: ['Aceptar porque la instrucción proviene de una jefatura.', 'Eliminar definitivamente la factura.', 'Registrar solo una parte y ocultar el respaldo.']
    },
    {
      concepto: 'Controles en planillas contables',
      definicion: 'Una planilla confiable usa validaciones, fórmulas protegidas, referencias trazables, controles de totales y revisión de excepciones; automatizar no reemplaza comprobar datos y lógica.',
      caso: 'Una fórmula fue arrastrada con referencia relativa incorrecta y altera varias liquidaciones sin mostrar error de software.',
      respuesta: 'Auditar referencias, contrastar una muestra con cálculo independiente y proteger las fórmulas corregidas.',
      errores: ['Confiar en el resultado porque la planilla no mostró advertencias.', 'Convertir todas las fórmulas en valores sin revisar.', 'Corregir solo la última celda visible.']
    },
    {
      concepto: 'Integración de competencias TP',
      definicion: 'Una tarea auténtica integra saber técnico con uso de TIC, comunicación, colaboración, calidad, ética y cumplimiento de plazos en un proceso semejante al entorno laboral.',
      caso: 'La docente quiere evaluar procesamiento contable y competencias genéricas en una misma experiencia.',
      respuesta: 'Usar una empresa simulada con documentos, roles, software, controles cruzados y entrega argumentada en plazo.',
      errores: ['Aplicar una prueba de definiciones separada de toda ejecución.', 'Calificar trabajo en equipo solo por asistencia.', 'Evaluar el software sin revisar exactitud contable.']
    },
    {
      concepto: 'Evaluación de desempeño contable',
      definicion: 'La evaluación pertinente solicita producir registros o informes con antecedentes de un caso y usa criterios para exactitud, procedimiento, respaldo, interpretación y comunicación del resultado.',
      caso: 'El objetivo exige elaborar una liquidación de remuneraciones, pero la prueba solo pregunta nombres de descuentos.',
      respuesta: 'Entregar antecedentes laborales, pedir la liquidación completa y evaluar proceso y resultado con criterios explícitos.',
      errores: ['Mantener solo preguntas de memoria porque son objetivas.', 'Calificar únicamente el diseño visual de la liquidación.', 'Entregar la liquidación resuelta y pedir que la copien.']
    }
  ]
});
