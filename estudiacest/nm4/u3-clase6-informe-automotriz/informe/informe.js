// Caso especializado de 4°B. El renderer compartido construye las 12 páginas.
(function () {
  window.INFORME_CASO = {
    code: 'MA-FLM-DIA-V17',
    clientMark: 'FLM',
    serviceMark: 'TAM',
    client: 'Flota Logística del Maule Ltda.',
    service: 'Taller Automotriz del Maule Ltda.',
    title: 'Diagnóstico de frenos y suspensión de un vehículo de flota',
    subtitle: 'Vehículo V-17 · Frenos delanteros, líquido y amortiguación',
    reportHeader: 'Diagnóstico automotriz · Vehículo V-17',
    location: 'Taller de flota, Talca, Región del Maule',
    inspectionDate: 'Martes 29 de septiembre de 2026 · 08:10 a 09:15',
    roleSingular: 'Técnico o técnica automotriz en formación',
    rolePlural: 'Técnicos o técnicas automotrices en formación',
    hints: {
      emision: 'Escribe la fecha de hoy.',
      especialidad: 'Selecciona Mecánica Automotriz.',
      resumen: 'Hazlo al final. En 4 a 6 líneas explica qué se revisó, qué fallas se encontraron y si el vehículo puede circular.',
      obj2: 'Comienza con un verbo: medir, comparar, inspeccionar o determinar.',
      obj3: 'Escribe un objetivo distinto al anterior.',
      kilometraje: 'Busca el odómetro anotado en la orden de trabajo.',
      espesorPastilla: 'Usa la pastilla más delgada de la rueda delantera izquierda.',
      espesorDisco: 'Busca la medición del disco delantero izquierdo.',
      humedadLiquido: 'Usa el valor registrado por el comprobador.',
      estado: 'Decide según la seguridad del vehículo y el hallazgo más urgente.',
      f2Desc: 'Nombra rueda, pastillas, disco, mediciones y diferencia observada.',
      f3Desc: 'Describe ubicación y huella de aceite del amortiguador sin inventar la causa.',
      ruedaInspeccionada: 'Ejemplo: delantera izquierda.',
      proximaMantencion: 'Usa la propuesta de la orden de trabajo del caso.',
      h2Criterio: 'Compara 3,5 % con el criterio de cambio del procedimiento del taller.',
      h2Efecto: 'Explica cómo puede afectar la respuesta del sistema de frenos.',
      h2Recomendacion: 'Indica cambio, purga, inspección y comprobación posterior.',
      h2Riesgo: 'Selecciona alto, medio o bajo.',
      h3Titulo: 'Resume la fuga del amortiguador delantero izquierdo.',
      h3Riesgo: 'Selecciona alto, medio o bajo.',
      h3Evidencia: 'Elige la evidencia que demuestra la condición.',
      h3Condicion: 'Describe huella, ubicación y comportamiento informado.',
      h3Criterio: 'Usa el manual educativo y la guía CONASET citada.',
      h3Efecto: 'Explica el efecto posible sobre estabilidad, oscilación y frenado.',
      h3Recomendacion: 'Propón intervención y una prueba posterior concreta.',
      conclusion: 'Responde si el vehículo está apto y prioriza las reparaciones. No agregues datos nuevos.',
      declaracion: 'Confirma solo si todo se basa en la evidencia entregada.'
    },
    notebook: `<p class="lib-head">Bitácora de diagnóstico · Vehículo V-17<br>29-09-2026 · 08:10 a 09:15 · elevador, pie de metro, comprobador de líquido y cámara</p><ol class="lib">
      <li><b>08:10</b> Conductor informa que el vehículo se desvía levemente a la izquierda al frenar y rebota más de una vez después de pasar un resalto. Se recibe con 128.450 km.</li>
      <li><b>08:20</b> F1: vehículo V-17 elevado en sus puntos de apoyo. Sin daños visibles en los brazos del elevador ni en la carrocería.</li>
      <li><b>08:32</b> F2: rueda delantera izquierda desmontada. Pastilla interior: 2,5 mm; exterior: 5,0 mm. Disco: 21,4 mm. Manual educativo MM-V17: cambiar pastillas al llegar a 3,0 mm; mínimo del disco 21,0 mm.</li>
      <li><b>08:42</b> Rueda delantera derecha: pastillas 4,8 y 5,1 mm; disco 21,8 mm. No se observa fuga en mangueras ni uniones.</li>
      <li><b>08:50</b> Comprobador del líquido de frenos: 3,5 % de humedad. Procedimiento TA-FR-03: reemplazar y purgar cuando el valor es igual o superior a 3,0 %.</li>
      <li><b>09:00</b> F3: amortiguador delantero izquierdo con huella húmeda continua desde la zona del sello y polvo adherido. Resorte sin fisuras. Manguera de freno intacta y bien guiada.</li>
      <li><b>09:08</b> No se realizó prueba en ruta por la pastilla bajo el mínimo y la fuga del amortiguador. Se propone mantener el vehículo fuera de servicio.</li>
      <li><b>09:15</b> Se dejó la orden abierta para reparar, purgar, verificar espesores y realizar prueba de frenado y estabilidad.</li>
    </ol>`,
    glossary: [
      ['V-17', 'Vehículo liviano de carga del caso'],
      ['Pastilla', 'Material de fricción que presiona el disco para disminuir la velocidad'],
      ['Disco', 'Elemento giratorio sobre el que actúan las pastillas'],
      ['Pinza', 'Conjunto que aplica las pastillas contra el disco'],
      ['Purga', 'Procedimiento para renovar el fluido y retirar aire del circuito'],
      ['Amortiguador', 'Elemento que controla las oscilaciones de la suspensión'],
      ['Aptitud', 'Decisión documentada sobre si el vehículo puede volver al servicio'],
      ['Mandante', 'Empresa que solicita el diagnóstico y decide las acciones']
    ],
    kpis: [
      { value: '1', label: 'vehículo diagnosticado' },
      { value: '3', label: 'hallazgos' },
      { field: 'espesorPastilla', label: 'mm en pastilla mínima' },
      { value: '65 min', label: 'de diagnóstico' }
    ],
    introduction: [
      'Flota Logística del Maule Ltda. solicitó diagnosticar el vehículo V-17 después de que su conductor informara desvío durante el frenado y oscilación excesiva al pasar resaltos. El vehículo se utiliza para reparto urbano.',
      'La revisión se efectuó en elevador, con inspección visual, medición de pastillas y discos, comprobación del líquido de frenos y registro fotográfico. No se realizó prueba en ruta porque la inspección encontró condiciones que requieren reparación previa.'
    ],
    generalObjective: 'Diagnosticar el estado de los frenos delanteros y la suspensión del vehículo V-17 para determinar si puede volver al servicio y qué reparaciones necesita.',
    objective1: 'Medir y comparar los espesores de pastillas y discos delanteros.',
    methodology: [
      ['Recibir el síntoma y revisar la orden de trabajo', 'Bitácora y kilometraje'],
      ['Elevar el vehículo en sus puntos de apoyo', 'Foto 1 y control visual'],
      ['Desmontar ruedas delanteras y medir frenos', 'Foto 2 y pie de metro'],
      ['Comprobar líquido, mangueras y uniones', 'Lectura del comprobador'],
      ['Inspeccionar suspensión y comparar con criterios', 'Foto 3, MM-V17 y TA-FR-03']
    ],
    criteria: [
      ['Seguridad activa', '<a href="https://www.conaset.cl/area-vehiculos/elementos-de-seguridad/" target="_blank" rel="noopener">CONASET · Elementos de seguridad</a>', 'El sistema de frenos permite reducir la velocidad, detener o mantener inmóvil el vehículo; debe mantenerse según el fabricante.'],
      ['Pastillas y disco', 'Manual educativo MM-V17', 'Cambiar pastillas al llegar a 3,0 mm; el disco no debe quedar bajo 21,0 mm.'],
      ['Líquido de frenos', 'Procedimiento educativo TA-FR-03', 'Reemplazar y purgar cuando la humedad es igual o superior a 3,0 %.'],
      ['Suspensión', '<a href="https://www.conaset.cl/wp-content/uploads/2019/12/LIBRO-DEL-NUEVO-CONDUCTOR-PROFESIONAL-F17-12-2019_opt.pdf" target="_blank" rel="noopener">CONASET · Mantenimiento</a>', 'Comprobar fijaciones y pérdidas de líquido en amortiguadores, porque pueden provocar oscilaciones excesivas.'],
      ['Hallazgo', 'Guía interna GI-HA-01', 'Relacionar evidencia, condición, criterio, efecto y recomendación comprobable.']
    ],
    measurements: [
      { label: 'Vehículo', value: 'V-17 · furgón liviano de carga' },
      { label: 'Kilometraje', value: { field: 'kilometraje', unit: 'km' } },
      { label: 'Pastilla delantera mínima', value: { field: 'espesorPastilla', unit: 'mm' } },
      { label: 'Disco delantero izquierdo', value: { field: 'espesorDisco', unit: 'mm' } },
      { label: 'Humedad del líquido', value: { field: 'humedadLiquido', unit: '%' } },
      { label: 'Próxima mantención', value: { field: 'proximaMantencion' } },
      { label: 'Decisión de aptitud', value: { field: 'estado' } }
    ],
    registerHeaders: ['Posición', 'Componente', 'Medición', 'Criterio', 'Resultado'],
    registerRows: [
      ['Delantera izquierda', 'Pastilla interior', '2,5 mm', 'Mínimo 3,0 mm', 'Bajo mínimo'],
      ['Delantera izquierda', 'Pastilla exterior', '5,0 mm', 'Mínimo 3,0 mm', 'Sobre mínimo'],
      ['Delantera izquierda', 'Disco', '21,4 mm', 'Mínimo 21,0 mm', 'Sobre mínimo'],
      ['Delantera derecha', 'Pastillas', '4,8 / 5,1 mm', 'Mínimo 3,0 mm', 'Sobre mínimo'],
      ['Depósito', 'Líquido de frenos', '3,5 % humedad', 'Cambio ≥ 3,0 %', 'Requiere cambio']
    ],
    diagram: `<svg class="croquis plano" viewBox="0 0 760 420" role="img" aria-label="Esquema del vehículo V-17 con puntos de diagnóstico"><defs><marker id="arr-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#0f766e"/></marker></defs><rect width="760" height="420" class="bg"/><rect x="175" y="80" width="410" height="260" rx="80" class="wall"/><rect x="245" y="120" width="270" height="180" rx="36" class="sub"/><text x="380" y="205" text-anchor="middle" class="lb">V-17</text><text x="380" y="235" text-anchor="middle" class="gl">Vista superior</text><circle cx="205" cy="125" r="34" class="oc"/><circle cx="555" cy="125" r="34" class="sub"/><circle cx="205" cy="295" r="34" class="sub"/><circle cx="555" cy="295" r="34" class="sub"/><text x="205" y="130" text-anchor="middle" class="lb">DI</text><text x="555" y="130" text-anchor="middle" class="lb">DD</text><text x="205" y="300" text-anchor="middle" class="lb">TI</text><text x="555" y="300" text-anchor="middle" class="lb">TD</text><path d="M112 70L178 104" class="ax" marker-end="url(#arr-a)"/><text x="42" y="55" class="gl">Frenos DI</text><path d="M92 354L180 315" class="ax" marker-end="url(#arr-a)"/><text x="30" y="378" class="gl">Suspensión DI</text><path d="M380 45V80" class="ax" marker-end="url(#arr-a)"/><text x="395" y="55" class="gl">Frente</text></svg>`,
    diagramNote: 'DI significa delantera izquierda. Allí se registran la pastilla bajo mínimo y la fuga del amortiguador; la comparación con DD ayuda a describir la diferencia.',
    diagramLegend: ['DI: delantera izquierda', 'DD: delantera derecha', 'TI/TD: ruedas traseras', 'Flechas: puntos revisados'],
    photos: [
      { number: 1, file: 'a1-vehiculo-elevador.png', alt: 'Vehículo de flota elevado en un taller automotriz', position: 'center', caption: 'Vista general del vehículo V-17 elevado de manera estable para la inspección de frenos y suspensión.', rows: [['Archivo', 'MA_V17_F01.png'], ['Hora', '08:20'], ['Vista', 'General del vehículo'], ['Estado', 'Elevado en cuatro apoyos']] },
      { number: 2, file: 'a2-freno-medicion.png', alt: 'Medición de pastillas del freno delantero', position: 'center', rows: [['Archivo', 'MA_V17_F02.png'], ['Hora', '08:32'], ['Posición', 'Delantera izquierda'], ['Evidencia', 'Pastillas y disco']] },
      { number: 3, file: 'a3-amortiguador-fuga.png', alt: 'Amortiguador delantero con pérdida de aceite', position: 'center', rows: [['Archivo', 'MA_V17_F03.png'], ['Hora', '09:00'], ['Posición', 'Delantera izquierda'], ['Evidencia', 'Huella húmeda en amortiguador']] }
    ],
    extraRegisterTitle: 'Orden de trabajo y control del vehículo',
    extraRegister: [
      ['Orden', 'OT-MA-1719 · diagnóstico de frenos y suspensión'],
      ['Kilometraje', '128.450 km según orden de trabajo'],
      ['Rueda descrita', { field: 'ruedaInspeccionada' }],
      ['Último cambio de líquido', 'Sin registro comprobable en la orden'],
      ['Próxima mantención propuesta', 'Completar en la ficha de mediciones (página 6)']
    ],
    modelFinding: {
      title: 'Pastilla delantera izquierda bajo el espesor mínimo',
      risk: 'Riesgo alto',
      rows: [
        ['Evidencia', 'Foto 2 · bitácora 08:32 · pastilla interior de 2,5 mm'],
        ['Condición', 'La pastilla interior delantera izquierda mide 2,5 mm, mientras la exterior mide 5,0 mm. El desgaste del mismo conjunto es desigual.'],
        ['Criterio', 'El manual educativo MM-V17 exige cambiar las pastillas al llegar a 3,0 mm.'],
        ['Causa', 'No determinada. El informe no atribuye el desgaste a la pinza sin desmontarla y comprobar su movimiento.'],
        ['Efecto', 'La pastilla puede perder capacidad de fricción y dañar el disco; el desgaste desigual también puede relacionarse con el desvío informado al frenar.'],
        ['Recomendación', 'Mantener V-17 fuera de servicio, sustituir las pastillas del eje, revisar pinza y guías, medir nuevamente y efectuar una prueba de frenado controlada.']
      ]
    },
    finding2: {
      title: 'Líquido de frenos con humedad sobre el criterio de cambio',
      evidence: 'Bitácora 08:50 · comprobador de líquido · 3,5 % de humedad',
      condition: 'El líquido de frenos registró 3,5 % de humedad y la orden no contiene un cambio anterior comprobable.'
    },
    finding3Prompt: 'Redacta el hallazgo sobre la fuga del amortiguador delantero izquierdo',
    followUp: ['Espesores y movimiento de pinzas después de la reparación.', 'Ausencia de aire y fugas tras cambiar y purgar el líquido.', 'Estanqueidad y respuesta del amortiguador nuevo o reparado.', 'Prueba controlada de frenado, dirección y estabilidad.'],
    sources: [
      '<a href="https://www.conaset.cl/area-vehiculos/elementos-de-seguridad/" target="_blank" rel="noopener">CONASET · Elementos de seguridad vehicular</a>.',
      '<a href="https://www.conaset.cl/wp-content/uploads/2019/12/LIBRO-DEL-NUEVO-CONDUCTOR-PROFESIONAL-F17-12-2019_opt.pdf" target="_blank" rel="noopener">CONASET · Libro del conductor profesional, mantenimiento de suspensión</a>.',
      'MM-V17 · Manual educativo de frenos del vehículo del caso.',
      'TA-FR-03 · Procedimiento educativo de comprobación y cambio de líquido.',
      'GI-HA-01 · Guía de redacción de hallazgos técnicos.'
    ],
    finalNote: 'Los espesores límite, la empresa, el vehículo y los documentos internos son ficticios y coherentes entre sí. CONASET se usa como fuente general de seguridad y mantenimiento. Las tres imágenes fueron generadas con IA para esta actividad.'
  };
})();
