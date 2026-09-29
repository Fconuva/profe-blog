// Caso especializado de 4°A. El renderer compartido construye las 12 páginas.
(function () {
  window.INFORME_CASO = {
    code: 'MI-PVL-DIA-BP04',
    clientMark: 'PVL',
    serviceMark: 'MIM',
    client: 'Procesos Valle Lircay S.A.',
    service: 'Mantenimiento Industrial del Maule Ltda.',
    title: 'Diagnóstico mecánico de un conjunto motor–bomba',
    subtitle: 'Bomba centrífuga BP-04 · Vibración, temperatura, resguardo y lubricación',
    reportHeader: 'Diagnóstico mecánico · Conjunto BP-04',
    location: 'Planta de procesos Valle Lircay, San Javier, Región del Maule',
    inspectionDate: 'Martes 29 de septiembre de 2026 · 08:10 a 09:15',
    roleSingular: 'Técnico o técnica industrial en formación',
    rolePlural: 'Técnicos o técnicas industriales en formación',
    hints: {
      emision: 'Escribe la fecha de hoy.',
      especialidad: 'Selecciona Mecánica Industrial.',
      resumen: 'Hazlo al final. En 4 a 6 líneas explica qué se revisó, qué muestran las mediciones y qué debe hacer la empresa.',
      obj2: 'Comienza con un verbo: medir, comparar, inspeccionar o proponer.',
      obj3: 'Escribe un objetivo diferente al anterior.',
      vibracionMotor: 'Busca la lectura del motor M-04 en la bitácora.',
      vibracionBomba: 'Busca la lectura tomada en el rodamiento de BP-04.',
      temperaturaRodamiento: 'Usa el máximo medido en el lado del acoplamiento.',
      horasOperacion: 'Revisa el contador de la orden de trabajo.',
      estado: 'Decide según el hallazgo más urgente, no según el promedio.',
      f2Desc: 'Nombra el resguardo, el perno faltante, la abertura y la fuga observada.',
      f3Desc: 'Indica instrumento, punto de medición y valor; no inventes una causa.',
      puntoMedicion: 'Ejemplo: rodamiento de BP-04, lado del acoplamiento.',
      proximaMantencion: 'Calcula desde la fecha del último mantenimiento del caso.',
      h2Criterio: 'Compara 9,6 mm/s y 82 °C con los límites del procedimiento interno.',
      h2Efecto: 'Explica la consecuencia posible para rodamiento, sello y continuidad del proceso.',
      h2Recomendacion: 'Indica aislamiento, revisión mecánica y mediciones de comprobación.',
      h2Riesgo: 'Selecciona alto, medio o bajo.',
      h3Titulo: 'Resume el atraso de mantenimiento y la pérdida de lubricante.',
      h3Riesgo: 'Selecciona alto, medio o bajo.',
      h3Evidencia: 'Elige la evidencia que mejor demuestra el problema.',
      h3Condicion: 'Usa horas acumuladas, intervalo y huella de lubricante.',
      h3Criterio: 'Nombra el plan MP-BP04 y lo que exige.',
      h3Efecto: 'Explica qué puede ocurrir si se mantiene la operación sin intervenir.',
      h3Recomendacion: 'Propón una acción, responsable y comprobación posterior.',
      conclusion: 'Responde al objetivo general y prioriza las decisiones. No agregues datos nuevos.',
      declaracion: 'Confirma solo si todo se basa en la evidencia entregada.'
    },
    notebook: `<p class="lib-head">Bitácora de diagnóstico · Conjunto BP-04<br>29-09-2026 · 08:10 a 09:15 · vibrómetro, termómetro infrarrojo, linterna y cámara</p><ol class="lib">
      <li><b>08:10</b> Operaciones informa aumento de ruido y vibración durante el turno nocturno. Se detuvo, aisló y bloqueó el conjunto antes de inspeccionar.</li>
      <li><b>08:18</b> F1: conjunto BP-04. Bomba centrífuga, motor M-04, base y tuberías sin deformaciones visibles. Contador: 6.470 h.</li>
      <li><b>08:28</b> F2: resguardo del acoplamiento desplazado unos 35 mm. Falta el perno delantero derecho y queda una abertura hacia las piezas móviles. Huella de lubricante bajo el alojamiento: 18 × 6 cm.</li>
      <li><b>08:40</b> F3: vibración en motor M-04, lado acoplamiento: 4,2 mm/s RMS. En rodamiento de BP-04, mismo lado: 9,6 mm/s RMS. Procedimiento PI-BP04: alerta sobre 7,1 y detención sobre 11,0 mm/s.</li>
      <li><b>08:50</b> Temperatura máxima del rodamiento de BP-04: 82 °C. Manual educativo MAN-BP04 fija máximo de 75 °C para este punto durante operación estable.</li>
      <li><b>09:00</b> Plan MP-BP04: mantenimiento cada 1.000 h. Último registro a las 5.400 h, el 18-07-2026. No hay orden cerrada después de esa fecha.</li>
      <li><b>09:08</b> No se desmontó el rodamiento ni se atribuyó una causa. Se requiere revisar alineación, apriete, lubricación y estado del sello con el equipo aislado.</li>
      <li><b>09:15</b> El conjunto quedó detenido y bloqueado a la espera de la orden de trabajo.</li>
    </ol>`,
    glossary: [
      ['BP-04', 'Bomba centrífuga del circuito de lavado'],
      ['M-04', 'Motor eléctrico que acciona la bomba'],
      ['Acoplamiento', 'Elemento que transmite el giro del motor a la bomba'],
      ['Resguardo', 'Protección que impide acceder a piezas móviles'],
      ['mm/s RMS', 'Unidad usada para expresar la velocidad global de vibración'],
      ['Rodamiento', 'Elemento que permite el giro y soporta la carga del eje'],
      ['Aislar y bloquear', 'Separar la energía, impedir reconexión e identificar el bloqueo'],
      ['Mandante', 'Empresa que solicita el informe y decide las acciones']
    ],
    kpis: [
      { value: '1', label: 'conjunto diagnosticado' },
      { value: '3', label: 'hallazgos' },
      { field: 'vibracionBomba', label: 'mm/s RMS en BP-04' },
      { value: '65 min', label: 'de diagnóstico' }
    ],
    introduction: [
      'Procesos Valle Lircay S.A. solicitó diagnosticar el conjunto motor–bomba BP-04 después de que operaciones informara un aumento de ruido y vibración. El equipo impulsa agua del circuito de lavado y su detención afecta la continuidad de la planta.',
      'El diagnóstico se realizó con el conjunto detenido, aislado y bloqueado. Se usaron inspección visual, medición de vibración y temperatura, fotografías y revisión del plan de mantenimiento. No se desmontaron componentes ni se atribuyó una causa sin evidencia.'
    ],
    generalObjective: 'Diagnosticar el estado mecánico y de seguridad del conjunto BP-04 para que la jefatura decida las correcciones necesarias antes de autorizar su operación.',
    objective1: 'Registrar la vibración y la temperatura del motor y de la bomba.',
    methodology: [
      ['Entrevistar a operaciones y revisar la orden de trabajo', 'Bitácora y contador de horas'],
      ['Detener, aislar, bloquear e inspeccionar el conjunto', 'Foto 1 y registro de seguridad'],
      ['Revisar resguardo, fijaciones y huellas de lubricante', 'Foto 2 y medidas observadas'],
      ['Medir vibración y temperatura en puntos definidos', 'Foto 3 y lecturas instrumentales'],
      ['Comparar la evidencia con manuales y plan del caso', 'PI-BP04, MAN-BP04 y MP-BP04']
    ],
    criteria: [
      ['Piezas móviles', '<a href="https://www.bcn.cl/leychile/navegar?idNorma=167766" target="_blank" rel="noopener">DS 594, art. 38</a>', 'Las partes móviles y transmisiones deben contar con protección que impida el acceso durante el funcionamiento.'],
      ['Vibración', 'Procedimiento educativo PI-BP04', 'Alerta sobre 7,1 mm/s RMS y detención sobre 11,0 mm/s RMS en el punto definido.'],
      ['Temperatura', 'Manual educativo MAN-BP04', 'Máximo de 75 °C en el rodamiento de la bomba durante operación estable.'],
      ['Mantenimiento', 'Plan educativo MP-BP04', 'Intervenir el conjunto cada 1.000 horas y cerrar una orden con mediciones posteriores.'],
      ['Hallazgo', 'Guía interna GI-HA-01', 'Relacionar evidencia, condición, criterio, efecto y recomendación comprobable.']
    ],
    measurements: [
      { label: 'Equipo', value: 'BP-04 · bomba centrífuga y motor M-04' },
      { label: 'Horas acumuladas', value: { field: 'horasOperacion', unit: 'h' } },
      { label: 'Vibración del motor', value: { field: 'vibracionMotor', unit: 'mm/s RMS' } },
      { label: 'Vibración de la bomba', value: { field: 'vibracionBomba', unit: 'mm/s RMS' } },
      { label: 'Temperatura del rodamiento', value: { field: 'temperaturaRodamiento', unit: '°C' } },
      { label: 'Próxima mantención', value: { field: 'proximaMantencion' } },
      { label: 'Decisión de estado', value: { field: 'estado' } }
    ],
    registerHeaders: ['Punto', 'Componente', 'Dato', 'Criterio', 'Resultado'],
    registerRows: [
      ['M-04 LA', 'Motor · lado acoplamiento', '4,2 mm/s RMS', 'Alerta > 7,1', 'Bajo alerta'],
      ['BP-04 LA', 'Rodamiento de bomba', '9,6 mm/s RMS', 'Alerta > 7,1', 'En alerta'],
      ['BP-04 LA', 'Rodamiento de bomba', '82 °C', 'Máximo 75 °C', 'Sobre límite'],
      ['Base BP-04', 'Alojamiento/sello', 'Huella 18 × 6 cm', 'Sin pérdida visible', 'No conforme'],
      ['Acoplamiento', 'Resguardo', 'Abertura 35 mm', 'Acceso impedido', 'No conforme']
    ],
    diagram: `<svg class="croquis plano" viewBox="0 0 760 420" role="img" aria-label="Esquema del conjunto motor bomba y sus puntos de medición"><defs><marker id="arr-i" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#0f766e"/></marker></defs><rect width="760" height="420" class="bg"/><rect x="65" y="150" width="205" height="115" rx="16" class="sub"/><text x="168" y="198" text-anchor="middle" class="lb">M-04</text><text x="168" y="228" text-anchor="middle" class="gl">Motor eléctrico</text><rect x="288" y="168" width="118" height="80" rx="12" class="oc"/><text x="347" y="202" text-anchor="middle" class="lb">AC-04</text><text x="347" y="226" text-anchor="middle" class="gl">Acoplamiento</text><path d="M270 208H288" class="ax" marker-end="url(#arr-i)"/><rect x="430" y="132" width="230" height="150" rx="42" class="wall"/><text x="545" y="190" text-anchor="middle" class="lb">BP-04</text><text x="545" y="220" text-anchor="middle" class="gl">Bomba centrífuga</text><path d="M406 208H430" class="ax" marker-end="url(#arr-i)"/><circle cx="470" cy="208" r="12" class="phc"/><text x="470" y="212" text-anchor="middle" class="phn">V</text><circle cx="500" cy="160" r="12" class="phc"/><text x="500" y="164" text-anchor="middle" class="phn">T</text><path d="M660 208H728" class="ax" marker-end="url(#arr-i)"/><text x="682" y="190" class="gl">Descarga</text><path d="M545 132V72" class="ax" marker-end="url(#arr-i)"/><text x="555" y="96" class="gl">Succión</text><text x="379" y="335" text-anchor="middle" class="lb">Base común y puntos de diagnóstico</text></svg>`,
    diagramNote: 'El motor transmite giro a la bomba mediante el acoplamiento. V marca el punto de vibración y T el punto de temperatura en el lado del acoplamiento.',
    diagramLegend: ['M-04: motor', 'AC-04: acoplamiento y resguardo', 'BP-04: bomba', 'V/T: puntos de medición'],
    photos: [
      { number: 1, file: 'i1-conjunto-motor-bomba.png', alt: 'Conjunto industrial de bomba centrífuga y motor eléctrico', position: 'center', caption: 'Vista general del conjunto BP-04, su base, resguardo, motor y conexiones de proceso.', rows: [['Archivo', 'MI_BP04_F01.png'], ['Hora', '08:18'], ['Vista', 'General del conjunto'], ['Estado', 'Equipo aislado']] },
      { number: 2, file: 'i2-acoplamiento-fuga.png', alt: 'Resguardo de acoplamiento desplazado y huella de lubricante', position: 'center', rows: [['Archivo', 'MI_BP04_F02.png'], ['Hora', '08:28'], ['Componente', 'AC-04 y BP-04'], ['Evidencia', 'Abertura y huella de lubricante']] },
      { number: 3, file: 'i3-medicion-vibracion.png', alt: 'Medición de vibración en una bomba centrífuga', position: 'center', rows: [['Archivo', 'MI_BP04_F03.png'], ['Hora', '08:40'], ['Instrumento', 'Vibrómetro'], ['Punto', 'BP-04 · lado acoplamiento']] }
    ],
    extraRegisterTitle: 'Orden de trabajo y mantenimiento',
    extraRegister: [
      ['Orden', 'OT-MI-0426 · diagnóstico de BP-04'],
      ['Último mantenimiento', '18-07-2026 · contador 5.400 h'],
      ['Horas actuales', '6.470 h según orden de trabajo'],
      ['Próxima mantención propuesta', 'Completar en la ficha de mediciones (página 6)'],
      ['Punto de medición descrito', { field: 'puntoMedicion' }]
    ],
    modelFinding: {
      title: 'Resguardo del acoplamiento desplazado y sin una fijación',
      risk: 'Riesgo alto',
      rows: [
        ['Evidencia', 'Foto 2 · bitácora 08:28 · abertura aproximada de 35 mm'],
        ['Condición', 'El resguardo del acoplamiento está desplazado y le falta el perno delantero derecho, por lo que queda una abertura hacia las piezas móviles.'],
        ['Criterio', 'El DS 594, artículo 38, exige proteger transmisiones y partes móviles para impedir el acceso durante el funcionamiento.'],
        ['Causa', 'No determinada. El diagnóstico no registró quién retiró la fijación ni cuándo ocurrió.'],
        ['Efecto', 'Una persona podría entrar en contacto con el acoplamiento en movimiento y sufrir atrapamiento o lesión grave.'],
        ['Recomendación', 'Mantener BP-04 bloqueada, reinstalar y fijar el resguardo, verificar que no exista acceso a piezas móviles y registrar la comprobación antes del arranque.']
      ]
    },
    finding2: {
      title: 'Vibración y temperatura de BP-04 sobre los límites del caso',
      evidence: 'Foto 3 · bitácora 08:40 y 08:50 · 9,6 mm/s RMS y 82 °C',
      condition: 'El rodamiento de BP-04 registró 9,6 mm/s RMS y 82 °C; ambas mediciones superan sus niveles de alerta o límite.'
    },
    finding3Prompt: 'Redacta el hallazgo sobre mantenimiento vencido y pérdida de lubricante',
    followUp: ['Alineación y apriete después de corregir el resguardo.', 'Vibración y temperatura tras la intervención.', 'Origen y caudal de la pérdida de lubricante.', 'Cierre de la orden con fecha, responsable y condición de retorno.'],
    sources: [
      '<a href="https://www.bcn.cl/leychile/navegar?idNorma=167766" target="_blank" rel="noopener">Decreto Supremo 594 del Ministerio de Salud</a>, artículo 38.',
      'PI-BP04 · Procedimiento educativo de medición de vibración.',
      'MAN-BP04 · Manual educativo del conjunto motor–bomba.',
      'MP-BP04 · Plan educativo de mantenimiento cada 1.000 horas.',
      'GI-HA-01 · Guía de redacción de hallazgos técnicos.'
    ],
    finalNote: 'Los valores específicos, la empresa y los documentos internos son ficticios y coherentes entre sí. La referencia legal se usa solo para el criterio general de resguardo. Las tres imágenes fueron generadas con IA para esta actividad.'
  };
})();
