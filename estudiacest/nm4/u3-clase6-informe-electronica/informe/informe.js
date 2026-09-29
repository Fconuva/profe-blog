// Informe técnico prediseñado para 4°E Electrónica. Dibuja las 12 páginas del
// diagnóstico de una línea automatizada. La página del estudiante y el panel
// docente comparten este renderer. Requiere campos.js.
(function () {
  const C = window.INFORME_CAMPOS;
  const Q = Object.fromEntries(C.questions.map(q => [q.id, q]));
  const TOTAL_PAGES = 12;
  const CODE = 'AUT-PVL-DIA-L02';

  const esc = value => String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const HINTS = {
    emision: 'Escribe la fecha de hoy.',
    especialidad: 'Selecciona Electrónica.',
    resumen: 'Hazlo al final. En 4 a 6 líneas explica qué se diagnosticó, qué se encontró y qué se recomienda. Incluye mediciones.',
    obj2: 'Comienza con un verbo: comprobar, comparar, diagnosticar o registrar.',
    obj3: 'Escribe otro objetivo distinto, también comenzando con un verbo.',
    tensionFuente: 'Busca la medición de PSU-01 en la bitácora.',
    tensionSensor: 'Usa la salida de S1 cuando la caja está presente.',
    temperaturaGabinete: 'Busca el valor máximo registrado durante la prueba.',
    alarmasTemperatura: 'Cuenta las alarmas de los días 26, 27 y 28.',
    estado: 'Elige según el problema que requiere la acción más urgente.',
    f2Desc: 'Indica componente, ubicación, estado observado y medición asociada.',
    f3Desc: 'Describe el filtro, el ventilador y la temperatura; no inventes una causa.',
    versionActiva: 'Está en el registro de configuración del PLC.',
    versionRespaldo: 'Es la versión más reciente guardada fuera del PLC.',
    h2Criterio: 'Busca el límite de temperatura y la frecuencia de limpieza en la sección 04.',
    h2Efecto: 'Explica qué puede ocurrir si el gabinete continúa sobre su límite.',
    h2Recomendacion: 'Indica quién debe hacer qué y qué valor debe comprobar después.',
    h2Riesgo: 'Alto, medio o bajo.',
    h3Titulo: 'Resume la diferencia entre el programa activo y su respaldo.',
    h3Riesgo: 'Alto, medio o bajo.',
    h3Evidencia: 'Elige el registro que demuestra la diferencia de versiones.',
    h3Condicion: 'Compara la versión activa, la respaldada y la fecha del último cambio.',
    h3Criterio: 'Nombra el procedimiento PR-AUT-02 y lo que exige después de un cambio.',
    h3Efecto: 'Explica el problema que tendría la empresa si debe restaurar el sistema.',
    h3Recomendacion: 'Propón respaldar, identificar y comprobar la versión vigente.',
    conclusion: 'Responde al objetivo general: estado del sistema, problemas principales y decisiones recomendadas. No agregues datos nuevos.',
    declaracion: 'Confirma solo si todo lo escrito sale de la evidencia del caso.'
  };

  const LIBRETA = `
    <p class="lib-head">Bitácora de diagnóstico · Línea L-02 · Planta Valle Lircay<br>Lunes 28-09-2026 · 08:15 a 09:20 · multímetro, cámara, HMI y software de programación</p>
    <ol class="lib">
      <li><b>08:15</b> El operador informa detenciones intermitentes cuando una caja pasa por el sensor S1. La línea se aisló antes de abrir el gabinete.</li>
      <li><b>08:22</b> F1: vista general de L-02. Transportador, motor M1, sensor S1, gabinete TAB-02 y resguardos instalados.</li>
      <li><b>08:32</b> F2: S1 en el costado de la cinta, a 180 mm de la caja. Lente con polvo y soporte inclinado. Con caja presente: LED apagado, salida 0,0 VDC y entrada I0.0 del PLC en 0. Alimentación del sensor: 24,2 VDC.</li>
      <li><b>08:42</b> Después de limpiar y alinear S1, la salida subió a 23,8 VDC y la entrada I0.0 cambió a 1 en diez pruebas seguidas. El sensor volvió a detectar las cajas.</li>
      <li><b>08:53</b> F3: gabinete TAB-02. Filtro inferior cubierto de polvo y ventilador FAN-01 sin giro. Temperatura interior máxima: 46,8 °C. El manual fija de 0 a 40 °C. Última limpieza registrada: 12-08; el plan exige cada 30 días.</li>
      <li><b>09:02</b> Historial HMI: 26-09, dos alarmas de temperatura; 27-09, tres; 28-09, una. Total del período: seis.</li>
      <li><b>09:12</b> Registro de configuración: PLC-01 ejecuta el programa L02 versión 1.8. El último respaldo externo es la versión 1.5, del 04-09. El 25-09 se cambió el retardo de detección de 250 a 400 ms y no aparece un respaldo posterior.</li>
      <li><b>09:20</b> No se modificó el programa ni se energizó el gabinete abierto. Se dejó recomendación de intervención por personal autorizado.</li>
    </ol>`;

  function makeField(ctx) {
    return function field(id, opts = {}) {
      const q = Q[id];
      const value = ctx.answers[id] || '';
      const hint = HINTS[id] || '';
      if (!ctx.editable) {
        const shown = value ? esc(value) : '<span class="missing">Sin respuesta</span>';
        return opts.inline ? `<span class="fill-ro${value ? '' : ' empty'}">${shown}${opts.unit && value ? ' ' + opts.unit : ''}</span>`
          : `<div class="fill-ro-block"><span class="fill-label">${esc(opts.label || q.label)}</span><div class="fill-value">${shown}</div></div>`;
      }
      let control;
      const common = `data-q="${id}" id="q-${id}" aria-describedby="h-${id}"`;
      if (q.type === 'textarea') control = `<textarea ${common} rows="${q.rows || 4}" maxlength="${q.max}" spellcheck="true" lang="es">${esc(value)}</textarea>`;
      else if (q.type === 'select') control = `<select ${common}><option value="">Elige…</option>${q.options.map(o => `<option${o === value ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
      else if (q.type === 'date') control = `<input ${common} type="date" value="${esc(value)}">`;
      else if (q.type === 'number') control = `<input ${common} type="text" inputmode="decimal" autocomplete="off" maxlength="${q.max}" value="${esc(value)}">`;
      else control = `<input ${common} type="text" maxlength="${q.max}" autocomplete="off" value="${esc(value)}">`;
      if (opts.inline) return `<span class="fill-inline" data-wrap="${id}">${control}${opts.unit ? `<span class="unit">${opts.unit}</span>` : ''}<span class="sr" id="h-${id}">${esc(q.label)}. ${esc(hint)}</span></span>`;
      return `<div class="fill" data-wrap="${id}"><label for="q-${id}"><span class="fill-tag">Completa</span> ${esc(opts.label || q.label)}</label>${control}<span class="fill-help" id="h-${id}">${esc(hint)}</span></div>`;
    };
  }

  const page = (n, id, title, body) => `
    <article class="page" id="${id}" data-page="${n}">
      <header class="page-head"><span>${CODE} · Rev. 0</span><span>Diagnóstico electrónico · Línea automatizada L-02</span></header>
      ${title ? `<h2 class="sec-title">${title}</h2>` : ''}
      ${body}
      <footer class="page-foot"><span>Automatización Valle Lircay Ltda. · Caso de estudio</span><span>Página ${n} de ${TOTAL_PAGES}</span></footer>
    </article>`;

  const bind = (id, fallback = '—') => `<span data-bind="${id}" data-empty="${esc(fallback)}"></span>`;

  function photoCard(num, src, rows, descHtml, position) {
    return `<figure class="photo">
      <div class="photo-img"><img src="${src}" alt="Fotografía ${num} del registro de la línea automatizada" loading="lazy" style="object-position:${position || 'center'}"><span class="stamp">F${num}</span></div>
      <table class="kv photo-kv"><tbody>${rows.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</tbody></table>
      <figcaption><b>Foto ${num}.</b> ${descHtml}</figcaption>
      <p class="credit">Imagen original generada con IA para este caso educativo.</p>
    </figure>`;
  }

  function diagram() {
    return `<svg class="croquis plano" viewBox="0 0 760 440" role="img" aria-label="Diagrama funcional de la línea L-02 con fuente, sensor, PLC, HMI, variador y motor">
      <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#0f766e"/></marker></defs>
      <rect width="760" height="440" class="bg"/>
      <rect x="24" y="55" width="150" height="76" rx="10" class="sub"/><text x="99" y="85" text-anchor="middle" class="lb">PSU-01</text><text x="99" y="108" text-anchor="middle" class="gl">Fuente 24 VDC</text>
      <rect x="24" y="250" width="150" height="76" rx="10" class="oc"/><text x="99" y="280" text-anchor="middle" class="lb">S1</text><text x="99" y="303" text-anchor="middle" class="gl">Sensor fotoeléctrico</text>
      <rect x="282" y="155" width="184" height="110" rx="12" class="wall"/><text x="374" y="196" text-anchor="middle" class="lb">PLC-01</text><text x="374" y="222" text-anchor="middle" class="gl">Programa L02 · I0.0 / Q0.0</text>
      <rect x="305" y="24" width="138" height="72" rx="10" class="sub"/><text x="374" y="53" text-anchor="middle" class="lb">HMI-01</text><text x="374" y="76" text-anchor="middle" class="gl">Alarmas y estado</text>
      <rect x="566" y="85" width="160" height="78" rx="10" class="oc"/><text x="646" y="116" text-anchor="middle" class="lb">VFD-01</text><text x="646" y="139" text-anchor="middle" class="gl">Variador 35 Hz</text>
      <rect x="566" y="255" width="160" height="78" rx="10" class="sub"/><text x="646" y="286" text-anchor="middle" class="lb">M1</text><text x="646" y="309" text-anchor="middle" class="gl">Motor de la cinta</text>
      <rect x="282" y="342" width="184" height="68" rx="10" class="oc"/><text x="374" y="370" text-anchor="middle" class="lb">TAB-02</text><text x="374" y="393" text-anchor="middle" class="gl">Gabinete · FAN-01</text>
      <path d="M174 93H250V186H282" class="ax" marker-end="url(#arr)"/><text x="205" y="80" class="gl">24 VDC</text>
      <path d="M174 288H230V236H282" class="ax" marker-end="url(#arr)"/><text x="180" y="272" class="gl">I0.0</text>
      <path d="M374 96V155" class="ax" marker-end="url(#arr)"/><text x="385" y="130" class="gl">Ethernet</text>
      <path d="M466 190H520V124H566" class="ax" marker-end="url(#arr)"/><text x="485" y="177" class="gl">Q0.0</text>
      <path d="M646 163V255" class="ax" marker-end="url(#arr)"/><text x="656" y="216" class="gl">3~</text>
      <path d="M374 265V342" class="ax" marker-end="url(#arr)"/><text x="385" y="307" class="gl">Temperatura</text>
    </svg>`;
  }

  function render(container, options) {
    const ctx = { answers: options.answers || {}, editable: !!options.editable, student: options.student || { nombre: '', curso: '' } };
    const field = makeField(ctx);
    const A = options.assetBase || '../assets/';
    const nombre = esc(ctx.student.nombre || '—');
    const row = (k, v) => `<tr><th>${k}</th><td>${v}</td></tr>`;

    const pages = [
      `<article class="page cover" id="p1" data-page="1">
        <div class="cover-brand"><div><span class="brand-mark">PVL</span><span>Planta Valle Lircay S.A.<small>Empresa mandante</small></span></div><div><span class="brand-mark alt">AVL</span><span>Automatización Valle Lircay Ltda.<small>Servicio de diagnóstico</small></span></div></div>
        <p class="cover-code">${CODE} · Rev. 0</p>
        <h1 class="cover-title">Diagnóstico electrónico de una línea automatizada</h1>
        <p class="cover-sub">Línea de envasado L-02 · Sensores, control y respaldo del PLC</p>
        <div class="cover-img"><img src="${A}e1-linea-automatizada.jpg" alt="Línea automatizada de envasado de fruta"></div>
        <table class="kv cover-kv"><tbody>
          <tr><th>Ubicación</th><td>Planta Valle Lircay, comuna de San Clemente, Región del Maule</td></tr>
          <tr><th>Diagnóstico en terreno</th><td>Lunes 28 de septiembre de 2026 · 08:15 a 09:20</td></tr>
          <tr><th>Fecha de emisión</th><td>${field('emision', { inline: true })}</td></tr>
          <tr><th>Técnico o técnica en formación</th><td>${nombre}</td></tr>
          <tr><th>Especialidad</th><td>${field('especialidad', { inline: true })}</td></tr>
        </tbody></table>
        <p class="case-note">Caso de estudio con fines educativos. La empresa, los equipos, las mediciones y los documentos internos son ficticios. Las imágenes fueron generadas con IA para representar la evidencia.</p>
        <footer class="page-foot"><span>Automatización Valle Lircay Ltda. · Caso de estudio</span><span>Página 1 de ${TOTAL_PAGES}</span></footer>
      </article>`,

      page(2, 'p2', 'Datos del documento', `
        <table class="grid"><thead><tr><th>Rev.</th><th>Fecha</th><th>Descripción</th><th>Elaboró</th><th>Revisó</th></tr></thead><tbody><tr><td>0</td><td>${bind('emision')}</td><td>Emisión para revisión del jefe de mantenimiento</td><td>${nombre}</td><td>Docente de Lengua y Literatura</td></tr></tbody></table>
        <h3>Índice</h3><ol class="toc">
          <li><span>00 Resumen</span><span>3</span></li><li><span>01 Introducción · 02 Objetivos</span><span>4</span></li><li><span>03 Metodología · 04 Criterios</span><span>5</span></li><li><span>05 Mediciones y registros</span><span>6</span></li><li><span>06 Diagrama funcional</span><span>7</span></li><li><span>07 Registro fotográfico y configuración</span><span>8</span></li><li><span>08 Hallazgos</span><span>10</span></li><li><span>09 Conclusión y firmas</span><span>12</span></li>
        </ol>
        <h3>Abreviaturas y glosario</h3>
        <table class="grid compact"><tbody>
          <tr><th>PLC</th><td>Controlador lógico programable que coordina la secuencia de la línea</td></tr><tr><th>HMI</th><td>Pantalla donde el operador observa estados y alarmas</td></tr><tr><th>VDC</th><td>Voltios de corriente continua</td></tr><tr><th>Entrada I0.0</th><td>Señal que recibe el PLC desde el sensor S1</td></tr><tr><th>Salida Q0.0</th><td>Orden que envía el PLC para poner en marcha el variador</td></tr><tr><th>VFD</th><td>Variador de frecuencia que controla la velocidad del motor</td></tr><tr><th>Respaldo</th><td>Copia identificada del programa y sus parámetros para recuperarlos</td></tr><tr><th>Mandante</th><td>Empresa que solicita el informe y decide las acciones</td></tr>
        </tbody></table>`),

      page(3, 'p3', '00 Resumen', `
        <div class="kpis"><div><b>6</b><span>equipos revisados</span></div><div><b>3</b><span>hallazgos</span></div><div><b>${bind('temperaturaGabinete')} °C</b><span>máximo del gabinete</span></div><div><b>65 min</b><span>de diagnóstico</span></div></div>
        ${field('resumen')}
        <p class="note">El resumen se escribe al final, pero va al principio: permite que la jefatura conozca el estado de la línea y las acciones recomendadas.</p>`),

      page(4, 'p4', '01 Introducción', `
        <p>Planta Valle Lircay S.A. solicitó diagnosticar la línea automatizada L-02 después de registrar detenciones intermitentes durante el paso de cajas. La línea utiliza un sensor fotoeléctrico, un PLC, una HMI y un variador para detectar cada caja y mover el transportador.</p>
        <p>El diagnóstico se realizó con la línea aislada, a partir de observación, mediciones de 24 VDC, registros de alarmas y revisión de las versiones del programa. No se modificó el programa ni se trabajó con el gabinete energizado y abierto.</p>
        <h2 class="sec-title">02 Objetivos</h2>
        <p><b>Objetivo general.</b> Diagnosticar el estado electrónico y de control de la línea L-02 para que la empresa decida las correcciones necesarias antes de reiniciar la producción.</p>
        <p><b>Objetivos específicos.</b></p><ol class="objs"><li>Comprobar la alimentación y la respuesta del sensor fotoeléctrico S1.</li><li>${field('obj2', { inline: true })}</li><li>${field('obj3', { inline: true })}</li></ol>
        ${ctx.editable ? `<p class="fill-help">${esc(HINTS.obj2)}</p>` : ''}`),

      page(5, 'p5', '03 Metodología de diagnóstico', `
        <table class="grid"><thead><tr><th>Paso</th><th>Qué se hizo</th><th>Evidencia</th></tr></thead><tbody>
          <tr><td>1</td><td>Entrevista breve al operador y revisión de las alarmas de la HMI</td><td>Bitácora e historial HMI</td></tr><tr><td>2</td><td>Aislamiento de la línea e inspección visual del sensor y del gabinete</td><td>Fotos 1, 2 y 3</td></tr><tr><td>3</td><td>Medición de la fuente, alimentación y salida del sensor</td><td>Multímetro y estado I0.0</td></tr><tr><td>4</td><td>Comparación de temperatura y mantención con sus límites</td><td>Manual TAB-02 y plan MP-AUT-04</td></tr><tr><td>5</td><td>Comparación entre el programa activo y el último respaldo</td><td>Registro de configuración</td></tr>
        </tbody></table>
        <h2 class="sec-title">04 Criterios de evaluación</h2>
        <table class="grid"><thead><tr><th>Tema</th><th>Documento del caso</th><th>Qué exige</th></tr></thead><tbody>
          <tr><td>Sensor S1</td><td>Ficha FT-S1, apartados 2 y 4</td><td>Con una caja a 100–600 mm, la salida debe activarse entre 20 y 30 VDC; la lente debe estar limpia y el soporte alineado.</td></tr><tr><td>Gabinete TAB-02</td><td>Manual MAN-TAB-02, apartado 3.1</td><td>Temperatura interior de operación: 0 a 40 °C.</td></tr><tr><td>Ventilación</td><td>Plan MP-AUT-04</td><td>Revisar ventilador y limpiar o cambiar el filtro cada 30 días.</td></tr><tr><td>Respaldo del PLC</td><td>Procedimiento PR-AUT-02, paso 6</td><td>Después de cada cambio se debe exportar la versión, identificarla con fecha y comprobar que pueda restaurarse.</td></tr><tr><td>Intervención segura</td><td>Procedimiento PS-LOTO-01</td><td>Aislar, bloquear, identificar y verificar ausencia de energía antes de abrir el gabinete.</td></tr><tr><td>Hallazgo</td><td>Guía interna GI-HA-01</td><td>Comparar evidencia y criterio; explicar condición, efecto y recomendación.</td></tr>
        </tbody></table>`),

      page(6, 'p6', '05 Mediciones y registros del sistema', `
        <table class="kv ficha"><tbody>
          <tr><th>Línea</th><td>L-02 · envasado de fruta</td></tr><tr><th>Controlador</th><td>PLC-01 · 24 VDC · programa L02</td></tr><tr><th>Fuente PSU-01</th><td>${field('tensionFuente', { inline: true, unit: 'VDC' })}</td></tr><tr><th>Salida de S1 con caja presente</th><td>${field('tensionSensor', { inline: true, unit: 'VDC' })}</td></tr><tr><th>Temperatura máxima de TAB-02</th><td>${field('temperaturaGabinete', { inline: true, unit: '°C' })}</td></tr><tr><th>Alarmas de temperatura</th><td>${field('alarmasTemperatura', { inline: true })}</td></tr><tr><th>Nivel de atención</th><td>${field('estado', { inline: true })}</td></tr>
        </tbody></table>
        <h3>Inventario funcional</h3>
        <div class="scroll-x"><table class="grid catastro"><thead><tr><th>Código</th><th>Equipo</th><th>Función</th><th>Dato observado</th><th>Estado inicial</th></tr></thead><tbody>
          <tr><td>PSU-01</td><td>Fuente 24 VDC</td><td>Alimentar control y sensores</td><td>24,2 VDC</td><td>Dentro del valor esperado</td></tr><tr><td>S1</td><td>Sensor fotoeléctrico</td><td>Detectar cada caja</td><td>0,0 VDC antes de limpiar; 23,8 VDC después</td><td>Falla corregible</td></tr><tr><td>PLC-01</td><td>Controlador lógico</td><td>Ejecutar la secuencia L-02</td><td>Programa activo v1.8</td><td>Operativo; respaldo pendiente</td></tr><tr><td>HMI-01</td><td>Pantalla de operación</td><td>Mostrar estados y alarmas</td><td>Seis alarmas térmicas</td><td>Operativa</td></tr><tr><td>VFD-01</td><td>Variador de frecuencia</td><td>Controlar el motor M1</td><td>35 Hz; sin alarma propia</td><td>Operativo</td></tr><tr><td>FAN-01</td><td>Ventilador de gabinete</td><td>Extraer aire caliente</td><td>Sin giro</td><td>Fuera de servicio</td></tr>
        </tbody></table></div>`),

      page(7, 'p7', '06 Diagrama funcional de la línea L-02', `
        <div class="croquis-wrap plano-wrap">${diagram()}<div class="legend"><p><b>Cómo leerlo</b></p><p class="note">La fuente alimenta el control. S1 envía la señal I0.0 al PLC. El PLC muestra estados en la HMI y ordena al variador mover el motor. TAB-02 contiene el control y necesita ventilación.</p><ul><li><i class="lg ph"></i>Señal o alimentación</li><li><i class="lg oc"></i>Componente revisado</li><li><i class="lg tw"></i>Controlador</li></ul></div></div>`),

      page(8, 'p8', '07 Registro fotográfico', `
        <p class="note">Cada fotografía se relaciona con un dato de la bitácora. La imagen ayuda a ubicar el componente; la medición y el registro demuestran su estado.</p>
        <div class="photos">
          ${photoCard(1, A + 'e1-linea-automatizada.jpg', [['Archivo', 'AUT_L02_F01.jpg'], ['Fecha y hora', '28-09-2026 · 08:22'], ['Ubicación', 'Vista general de L-02'], ['Equipos', 'Transportador, S1, M1 y TAB-02']], 'Vista general de la línea de envasado L-02 con resguardos instalados y gabinete de control cerrado.', 'center')}
          ${photoCard(2, A + 'e2-sensor-fotoelectrico.jpg', [['Archivo', 'AUT_L02_F02.jpg'], ['Fecha y hora', '28-09-2026 · 08:32'], ['Ubicación', 'Costado de la cinta'], ['Componente', 'S1 · sensor fotoeléctrico'], ['Medición', 'Salida 0,0 VDC con caja presente']], field('f2Desc', { label: 'Descripción técnica de la Foto 2' }), 'center')}
        </div>`),

      page(9, 'p9', '07 Fotografía y registro de configuración', `
        <div class="photos one-photo">
          ${photoCard(3, A + 'e3-gabinete-ventilacion.jpg', [['Archivo', 'AUT_L02_F03.jpg'], ['Fecha y hora', '28-09-2026 · 08:53'], ['Ubicación', 'Gabinete TAB-02'], ['Componentes', 'PLC-01, VFD-01, FAN-01 y filtro'], ['Temperatura', '46,8 °C']], field('f3Desc', { label: 'Descripción técnica de la Foto 3' }), 'center')}
        </div>
        <h3>Registro de configuración</h3>
        <table class="grid"><thead><tr><th>Elemento</th><th>Versión</th><th>Fecha</th><th>Observación</th></tr></thead><tbody>
          <tr><td>Programa activo en PLC-01</td><td>${field('versionActiva', { inline: true })}</td><td>28-09-2026</td><td>Incluye el cambio de retardo del 25-09</td></tr><tr><td>Último respaldo externo</td><td>${field('versionRespaldo', { inline: true })}</td><td>04-09-2026</td><td>No incluye el cambio de retardo</td></tr><tr><td>Registro de cambio</td><td>Retardo S1: 250 → 400 ms</td><td>25-09-2026</td><td>Sin respaldo posterior registrado</td></tr>
        </tbody></table>`),

      page(10, 'p10', '08 Hallazgos', `
        <p class="note">El Hallazgo 1 está completo: úsalo como modelo para redactar con evidencia, criterio y una acción comprobable.</p>
        <section class="hz"><header><span class="hz-n">Hallazgo 1</span><span class="hz-t">Sensor S1 sin detección por suciedad y desalineación</span><span class="risk alto">Riesgo alto</span></header><table class="kv hz-kv"><tbody>
          ${row('Evidencia', 'Foto 2 · bitácora 08:32 y 08:42 · salida S1 e I0.0')}${row('Condición', 'Con una caja a 180 mm, el sensor S1 tenía la lente cubierta de polvo y el soporte desalineado. Su salida permanecía en 0,0 VDC y la entrada I0.0 del PLC no se activaba, aunque el sensor recibía 24,2 VDC.')}${row('Criterio', 'La ficha FT-S1 exige lente limpia, soporte alineado y salida activa entre 20 y 30 VDC cuando el objeto se encuentra dentro del rango de 100 a 600 mm.')}${row('Causa', 'Acumulación de polvo y desplazamiento del soporte. Después de limpiar y alinear, S1 entregó 23,8 VDC y detectó diez cajas consecutivas.')}${row('Efecto', 'El PLC no recibe la presencia de la caja, por lo que la secuencia se detiene o deja pasar productos sin contabilizar.')}${row('Recomendación', 'Mantener la línea aislada hasta limpiar y fijar el soporte de S1; luego comprobar al menos diez detecciones, registrar el valor de salida e incorporar esta revisión al mantenimiento semanal.')}
        </tbody></table></section>
        <div class="howto"><p><b>Cinco preguntas</b></p><ul><li><b>Condición:</b> ¿qué ocurre?</li><li><b>Criterio:</b> ¿qué debería ocurrir?</li><li><b>Causa:</b> ¿por qué ocurrió? Solo si la evidencia lo permite.</li><li><b>Efecto:</b> ¿qué consecuencia produce?</li><li><b>Recomendación:</b> ¿qué acción se propone y cómo se comprobará?</li></ul></div>`),

      page(11, 'p11', '08 Hallazgos (continuación)', `
        <section class="hz"><header><span class="hz-n">Hallazgo 2</span><span class="hz-t">Gabinete sobre su temperatura máxima y sin ventilación efectiva</span>${ctx.editable ? '' : `<span class="risk">${esc(ctx.answers.h2Riesgo || 'Sin nivel')}</span>`}</header><table class="kv hz-kv"><tbody>
          ${row('Evidencia', 'Foto 3 · bitácora 08:53 · historial HMI del 26 al 28 de septiembre')}${row('Condición', 'TAB-02 alcanzó 46,8 °C. El filtro inferior está cubierto de polvo, FAN-01 no gira y la HMI registró seis alarmas de temperatura en tres días. La última limpieza fue el 12-08.')}${row('Criterio', field('h2Criterio', { label: 'Criterio' }))}${row('Efecto', field('h2Efecto', { label: 'Efecto' }))}${row('Recomendación', field('h2Recomendacion', { label: 'Recomendación' }))}${ctx.editable ? row('Nivel de riesgo', field('h2Riesgo', { inline: true })) : ''}
        </tbody></table></section>
        <section class="hz"><header><span class="hz-n">Hallazgo 3</span><span class="hz-t">${ctx.editable ? 'Redacta el problema del respaldo del PLC' : esc(ctx.answers.h3Titulo || 'Sin título')}</span>${ctx.editable ? '' : `<span class="risk">${esc(ctx.answers.h3Riesgo || 'Sin nivel')}</span>`}</header><table class="kv hz-kv"><tbody>
          ${ctx.editable ? row('Título', field('h3Titulo', { inline: true })) : ''}${row('Evidencia', field('h3Evidencia', { inline: true }))}${row('Condición', field('h3Condicion', { label: 'Condición' }))}${row('Criterio', field('h3Criterio', { label: 'Criterio' }))}${row('Efecto', field('h3Efecto', { label: 'Efecto' }))}${row('Recomendación', field('h3Recomendacion', { label: 'Recomendación' }))}${ctx.editable ? row('Nivel de riesgo', field('h3Riesgo', { inline: true })) : ''}
        </tbody></table></section>`),

      page(12, 'p12', '09 Conclusión', `
        ${field('conclusion')}
        <h3>Datos que faltarían comprobar en la intervención</h3><ul class="confirm"><li>Corriente y giro de FAN-01 después de su reparación.</li><li>Temperatura de TAB-02 durante un ciclo completo de producción.</li><li>Restauración controlada de la versión 1.8 desde el respaldo nuevo.</li></ul>
        <h3>Firmas</h3><div class="signs"><div><p class="sign-line">${nombre}</p><p>Técnico o técnica en formación<br>${bind('especialidad', 'Especialidad')} · ${esc(ctx.student.curso || '')}</p></div><div><p class="sign-line">&nbsp;</p><p>Revisión<br>Docente de Lengua y Literatura</p></div></div>
        ${field('declaracion', { label: 'Confirmación final' })}
        <h3>Anexo · Documentos del caso</h3><ul class="sources"><li>FT-S1 · Ficha técnica educativa del sensor fotoeléctrico.</li><li>MAN-TAB-02 · Manual educativo del gabinete de automatización.</li><li>MP-AUT-04 · Plan de mantenimiento preventivo de la línea.</li><li>PR-AUT-02 · Procedimiento de respaldo y restauración del PLC.</li><li>PS-LOTO-01 · Procedimiento de aislamiento, bloqueo y verificación de energía.</li><li>GI-HA-01 · Guía de redacción de hallazgos técnicos.</li></ul>
        <p class="note">Todos los documentos, equipos y datos del caso son ficticios y coherentes entre sí. Las tres imágenes fueron generadas con IA exclusivamente para esta actividad.</p>`)
    ];

    container.innerHTML = pages.join('');
    refreshBindings(container, ctx.answers);
    return ctx;
  }

  function refreshBindings(container, answers) {
    container.querySelectorAll('[data-bind]').forEach(node => {
      const raw = answers[node.dataset.bind];
      let text = raw ? String(raw) : node.dataset.empty;
      if (raw && node.dataset.bind === 'emision') { const [y, m, d] = raw.split('-'); text = `${d}-${m}-${y}`; }
      node.textContent = text;
    });
  }

  window.InformeTecnico = { render, refreshBindings, LIBRETA, HINTS, TOTAL_PAGES };
})();
