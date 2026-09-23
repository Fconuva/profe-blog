// Informe técnico mecánico prediseñado de la Clase 6 NM4 (4°A y 4°B). Dibuja las
// 12 páginas del informe de inspección del taller y sus campos. Lo usan la página
// del estudiante (editable) y el panel docente (solo lectura). Requiere campos.js.
(function () {
  const C = window.INFORME_CAMPOS;
  const Q = Object.fromEntries(C.questions.map(q => [q.id, q]));
  const TOTAL_PAGES = 12;
  const CODE = 'ITM-AVL-INS-T01';

  const esc = value => String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // Ayuda breve bajo cada campo. No entrega la respuesta.
  const HINTS = {
    emision: 'Escribe la fecha de hoy.',
    especialidad: 'Elige tu especialidad.',
    resumen: 'Hazlo al final. En 4 a 6 líneas explica qué se revisó, qué se encontró y qué se recomienda. Incluye cifras.',
    obj2: 'Comienza con un verbo: registrar, revisar, comparar o proponer.',
    obj3: 'Escribe otro objetivo distinto, también comenzando con un verbo.',
    superficie: 'Multiplica largo × ancho. Los datos están en la libreta.',
    cp01Proxima: 'Suma a la última mantención los días que indica el plan.',
    cp01Estado: 'Compara esa fecha con el día de la inspección (21-09-2026).',
    equipoCritico: 'El equipo que puede causar la lesión más grave hoy, con su código.',
    estado: 'Elige según el problema más grave.',
    f3Desc: 'Explica qué se ve, dónde está y por qué importa. Usa los datos de la libreta.',
    f4Eje: 'Busca en la libreta desde qué eje se tomó la foto. Se escribe como A-1.',
    f4Desc: 'Explica qué se ve, dónde está y por qué importa. Sin opiniones.',
    h2Criterio: 'Busca en la sección 04 las reglas que no se cumplen: hay dos. Escribe la norma y su artículo.',
    h2Efecto: '¿Qué puede pasar si hay un incendio en ese momento?',
    h2Recomendacion: 'Una acción concreta: quién debe hacer qué.',
    h2Riesgo: 'Alto, medio o bajo.',
    h3Tema: 'Elige el equipo de tu especialidad.',
    h3Titulo: 'Qué se encontró, en pocas palabras. Mira el título del Hallazgo 1.',
    h3Riesgo: 'Alto, medio o bajo.',
    h3Foto: 'La foto donde se ve ese equipo.',
    h3Condicion: 'Lo que ocurre, con medidas, fechas y ubicación. Solo hechos de la libreta.',
    h3Criterio: 'La regla que no se cumple y su fuente (sección 04).',
    h3Efecto: 'La consecuencia o el riesgo que produce.',
    h3Recomendacion: 'Una acción concreta para la empresa.',
    conclusion: 'Responde al objetivo general: qué se encontró, qué tan grave es y qué debe decidir la empresa. Sin información nueva.',
    declaracion: 'Solo si todo lo que escribiste sale de la evidencia del caso.'
  };

  // ---------- Plano del taller: 20 × 15 m, ejes A–E (x) y 1–4 (y), cada 5 m ----------
  function plano() {
    const S = 26, X0 = 46, Y0 = 34;                 // 26 px por metro
    const x = m => X0 + m * S, y = m => Y0 + m * S;
    const ejeX = ['A', 'B', 'C', 'D', 'E'], ejeY = ['1', '2', '3', '4'];
    const g = [];
    ejeX.forEach((e, i) => g.push(`<line x1="${x(i * 5)}" y1="${y(0) - 16}" x2="${x(i * 5)}" y2="${y(15) + 6}" class="g"/><circle cx="${x(i * 5)}" cy="${y(0) - 24}" r="10" class="eje"/><text x="${x(i * 5)}" y="${y(0) - 20}" class="ejet">${e}</text>`));
    ejeY.forEach((e, i) => g.push(`<line x1="${x(0) - 16}" y1="${y(i * 5)}" x2="${x(20) + 6}" y2="${y(i * 5)}" class="g"/><circle cx="${x(0) - 26}" cy="${y(i * 5)}" r="10" class="eje"/><text x="${x(0) - 26}" y="${y(i * 5) + 4}" class="ejet">${e}</text>`));
    const photo = (mx, my, num, deg) => {
      const cx = x(mx), cy = y(my), r = 34;
      const a1 = (deg - 28 - 90) * Math.PI / 180, a2 = (deg + 28 - 90) * Math.PI / 180;
      return `<g><path d="M${cx},${cy}L${cx + r * Math.cos(a1)},${cy + r * Math.sin(a1)}A${r},${r} 0 0 1 ${cx + r * Math.cos(a2)},${cy + r * Math.sin(a2)}Z" class="cone"/><circle cx="${cx}" cy="${cy}" r="9" class="phc"/><text x="${cx}" y="${cy + 3.5}" class="phn">${num}</text></g>`;
    };
    const eq = (mx, my, w, h, code, cls = 'eq') => `<rect x="${x(mx) - w * S / 2}" y="${y(my) - h * S / 2}" width="${w * S}" height="${h * S}" class="${cls}"/><text x="${x(mx)}" y="${y(my) + h * S / 2 + 13}" class="lb">${code}</text>`;
    const W = x(20) + 40, H = y(15) + 40;
    return `<svg class="croquis plano" viewBox="0 0 ${W} ${H}" role="img" aria-label="Plano del taller con ejes A a E y 1 a 4, equipos y puntos fotográficos">
      <rect width="${W}" height="${H}" class="bg"/>
      <rect x="${x(0)}" y="${y(0)}" width="${20 * S}" height="${15 * S}" class="wall"/>
      <rect x="${x(1.5)}" y="${y(0) - 3}" width="${4 * S}" height="6" class="door"/><text x="${x(3.5)}" y="${y(0) + 16}" class="lb sm">Portón norte</text>
      <rect x="${x(20) - 3}" y="${y(8.5)}" width="6" height="${4.5 * S}" class="door"/><text x="${x(19.6)}" y="${y(14.2)}" class="lb sm" style="text-anchor:end">Portón oriente</text>
      ${g.join('')}
      <rect x="${x(0.3)}" y="${y(6.8)}" width="${19.4 * S}" height="${1.4 * S}" class="walk"/><text x="${x(0.6)}" y="${y(6.8) - 4}" class="lb sm" style="text-anchor:start">Pasillo peatonal demarcado</text>
      ${eq(5, 5, 1.2, 0.7, 'EB-01')}
      ${eq(18.8, 1.4, 2.2, 1.2, 'CP-01')}
      <rect x="${x(8.4) - 6}" y="${y(10) - 6}" width="12" height="12" class="col"/><rect x="${x(11.6) - 6}" y="${y(10) - 6}" width="12" height="12" class="col"/>
      <rect x="${x(8.9)}" y="${y(8)}" width="${2.2 * S}" height="${4.2 * S}" class="veh"/><text x="${x(10)}" y="${y(12.9)}" class="lb">EL-01</text>
      <ellipse cx="${x(8.1)}" cy="${y(11.1)}" rx="16" ry="9" class="oil"/>
      <circle cx="${x(15)}" cy="${y(5)}" r="7" class="ext"/><text x="${x(15) - 11}" y="${y(5) + 4}" class="lb" style="text-anchor:end">EX-02</text>
      <rect x="${x(15.5)}" y="${y(4.1)}" width="${1.6 * S}" height="${1.4 * S}" class="box"/><rect x="${x(14.9)}" y="${y(6.8)}" width="${1.4 * S}" height="${1.2 * S}" class="box"/>
      ${photo(1, 1, 1, 135)}${photo(5, 3, 2, 180)}${photo(15, 1.6, 3, 90)}${photo(5, 10, 4, 90)}
      <g transform="translate(${W - 26},${y(15) + 22})"><path d="M0,-16L7,6L0,1L-7,6Z" class="na"/></g>
      <g transform="translate(${x(0)},${y(15) + 24})"><rect width="${5 * S}" height="5" class="sc"/><text x="0" y="-4" class="gl">0</text><text x="${5 * S - 18}" y="-4" class="gl">5 m</text></g>
    </svg>`;
  }

  // ---------- Libreta del inspector: notas rápidas de terreno ----------
  const LIBRETA = `
    <p class="lib-head">Libreta · Taller de mantenimiento · Planta Valle Lircay<br>Lunes 21-09 · 08:30 a 09:45 · con el jefe de taller · huincha, pie de metro, linterna</p>
    <ol class="lib">
      <li><b>08:30</b> Taller de 20 x 15 m, portón norte y portón oriente. Pasillo pintado de amarillo, pero con cajas en el eje D.</li>
      <li><b>08:40</b> F1 desde el portón, eje A-1, mirando al sureste. Vista general.</li>
      <li><b>08:45</b> EB-01 esmeril (eje B-2). Medí con pie de metro: apoyo como a 9 mm de la piedra, protector de arriba a 15 mm. Sin visor. El maestro lo estaba usando sin lentes. Dijo que desde que cambiaron la piedra nadie lo ajustó. F2 desde B-1 mirando al sur.</li>
      <li><b>09:05</b> CP-01 compresor (eje E-1), estanque de 300 L. Placa: mantención cada 90 días. Última: 12-06. La correa sin tapa, se ve girando. Válvula de seguridad sin sello. El agua del estanque la botan "cuando se acuerdan". F3 desde D-1 mirando al este.</li>
      <li><b>09:20</b> EL-01 elevador 2 columnas, 4 t (eje C-3). Camioneta arriba. El seguro del brazo trasero derecho no engancha, se salta. Mancha de aceite hidráulico bajo la columna izquierda, como de 40 cm. Sticker de revisión anual: 15-03-2025. F4 a las 09:24, tomada desde B-3 mirando al este.</li>
      <li><b>09:35</b> Extintor EX-02 (eje D-2) tapado con cajas y un tambor. Carga al día (vence 07-2027). La señal no se ve desde el pasillo.</li>
      <li><b>09:40</b> Grúa horquilla GH-02 en el patio. Todo bien: lista de chequeo del día firmada y el operador mostró su licencia clase D.</li>
    </ol>`;

  // ---------- Piezas de interfaz ----------
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
      <header class="page-head"><span>${CODE} · Rev. 0</span><span>Inspección técnica · Taller de mantenimiento</span></header>
      ${title ? `<h2 class="sec-title">${title}</h2>` : ''}
      ${body}
      <footer class="page-foot"><span>Inspecciones Técnicas del Maule Ltda. · Caso de estudio</span><span>Página ${n} de ${TOTAL_PAGES}</span></footer>
    </article>`;

  const bind = (id, fallback = '—') => `<span data-bind="${id}" data-empty="${esc(fallback)}"></span>`;

  function photoCard(num, src, credit, rows, descHtml, position) {
    return `<figure class="photo">
      <div class="photo-img"><img src="${src}" alt="Fotografía ${num} del registro" loading="lazy" style="object-position:${position || 'center'}"><span class="stamp">F${num}</span></div>
      <table class="kv photo-kv"><tbody>${rows.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</tbody></table>
      <figcaption><b>Foto ${num}.</b> ${descHtml}</figcaption>
      <p class="credit">${credit}</p>
    </figure>`;
  }

  // Fuentes de las fotos: se completan en assets/creditos (ver anexo).
  const PHOTOS = window.INFORME_FOTOS || {};
  const credit = key => (PHOTOS[key] && PHOTOS[key].credit) || '';
  const src = (A, key) => A + ((PHOTOS[key] && PHOTOS[key].file) || key + '.jpg');

  function render(container, options) {
    const ctx = { answers: options.answers || {}, editable: !!options.editable, student: options.student || { nombre: '', curso: '' } };
    const field = makeField(ctx);
    const A = options.assetBase || '../assets/';
    const nombre = esc(ctx.student.nombre || '—');
    const row = (k, v) => `<tr><th>${k}</th><td>${v}</td></tr>`;

    const pages = [
      // 1 · Portada
      `<article class="page cover" id="p1" data-page="1">
        <div class="cover-brand"><div><span class="brand-mark">AVL</span><span>Agroindustrial Valle Lircay S.A.<small>Empresa mandante</small></span></div><div><span class="brand-mark alt">ITM</span><span>Inspecciones Técnicas del Maule Ltda.<small>Empresa consultora</small></span></div></div>
        <p class="cover-code">${CODE} · Rev. 0</p>
        <h1 class="cover-title">Inspección técnica de seguridad y mantenimiento</h1>
        <p class="cover-sub">Taller de mantenimiento mecánico · Planta procesadora de fruta</p>
        <div class="cover-img"><img src="${src(A, 'm1')}" alt="Taller de mantenimiento mecánico"></div>
        <table class="kv cover-kv"><tbody>
          <tr><th>Ubicación</th><td>Planta Valle Lircay, comuna de San Clemente, Región del Maule</td></tr>
          <tr><th>Inspección en terreno</th><td>Lunes 21 de septiembre de 2026 · 08:30 a 09:45</td></tr>
          <tr><th>Fecha de emisión</th><td>${field('emision', { inline: true })}</td></tr>
          <tr><th>Inspector o inspectora</th><td>${nombre}</td></tr>
          <tr><th>Especialidad</th><td>${field('especialidad', { inline: true })}</td></tr>
        </tbody></table>
        <p class="case-note">Caso de estudio con fines educativos. La empresa, el taller y los datos son ficticios; la estructura es la de un informe real de inspección técnica.</p>
        <footer class="page-foot"><span>Inspecciones Técnicas del Maule Ltda. · Caso de estudio</span><span>Página 1 de ${TOTAL_PAGES}</span></footer>
      </article>`,

      // 2 · Datos del documento
      page(2, 'p2', 'Datos del documento', `
        <table class="grid"><thead><tr><th>Rev.</th><th>Fecha</th><th>Descripción</th><th>Elaboró</th><th>Revisó</th></tr></thead>
        <tbody><tr><td>0</td><td>${bind('emision')}</td><td>Emisión para revisión del mandante</td><td>${nombre}</td><td>Docente de Lengua y Literatura</td></tr></tbody></table>
        <h3>Índice</h3>
        <ol class="toc">
          <li><span>00 Resumen</span><span>3</span></li>
          <li><span>01 Introducción · 02 Objetivos</span><span>4</span></li>
          <li><span>03 Metodología · 04 Criterios</span><span>5</span></li>
          <li><span>05 Ficha del taller e inventario de equipos</span><span>6</span></li>
          <li><span>06 Plano del taller</span><span>7</span></li>
          <li><span>07 Registro fotográfico</span><span>8</span></li>
          <li><span>08 Hallazgos</span><span>10</span></li>
          <li><span>09 Conclusión y firmas · Anexo</span><span>12</span></li>
        </ol>
        <h3>Abreviaturas</h3>
        <table class="grid compact"><tbody>
          <tr><th>EB-01</th><td>Esmeril de banco N.º 1</td></tr>
          <tr><th>CP-01</th><td>Compresor de aire N.º 1</td></tr>
          <tr><th>EL-01</th><td>Elevador de vehículos N.º 1</td></tr>
          <tr><th>EX-02</th><td>Extintor N.º 2</td></tr>
          <tr><th>GH-02</th><td>Grúa horquilla N.º 2</td></tr>
          <tr><th>B-2</th><td>Cruce de los ejes B y 2 en el plano del taller</td></tr>
          <tr><th>EPP</th><td>Elementos de protección personal</td></tr>
        </tbody></table>`),

      // 3 · Resumen
      page(3, 'p3', '00 Resumen', `
        <div class="kpis">
          <div><b>5</b><span>equipos inspeccionados</span></div>
          <div><b>3</b><span>hallazgos de riesgo</span></div>
          <div><b>${bind('superficie')} m²</b><span>superficie del taller</span></div>
          <div><b>75 min</b><span>de inspección</span></div>
        </div>
        ${field('resumen')}
        <p class="note">El resumen se escribe al final, pero va al principio: es lo primero que lee el jefe de planta.</p>`),

      // 4 · Introducción y objetivos
      page(4, 'p4', '01 Introducción', `
        <p>Agroindustrial Valle Lircay S.A. encargó a Inspecciones Técnicas del Maule Ltda. una inspección de seguridad y mantenimiento de su taller mecánico, antes del inicio de la temporada de cosecha. En el taller se mantienen los equipos de la planta y los vehículos de la flota.</p>
        <p>Este informe registra lo observado el 21 de septiembre de 2026, lo compara con la normativa y con los manuales de los equipos, y propone acciones. La inspección fue visual y con mediciones simples; no incluyó ensayos ni desarme de equipos.</p>
        <h2 class="sec-title">02 Objetivos</h2>
        <p><b>Objetivo general.</b> Revisar el estado de seguridad y mantenimiento de los equipos del taller, para que la empresa decida qué corregir antes de la temporada.</p>
        <p><b>Objetivos específicos.</b></p>
        <ol class="objs"><li>Identificar cada equipo en el plano del taller y registrar su última mantención.</li><li>${field('obj2', { inline: true })}</li><li>${field('obj3', { inline: true })}</li></ol>
        ${ctx.editable ? `<p class="fill-help">${esc(HINTS.obj2)}</p>` : ''}`),

      // 5 · Metodología y criterios
      page(5, 'p5', '03 Metodología', `
        <table class="grid"><thead><tr><th>Paso</th><th>Qué se hizo</th><th>Con qué</th></tr></thead><tbody>
          <tr><td>1</td><td>Revisión del plan de mantenimiento y de las placas de los equipos</td><td>Plan de la empresa, manuales</td></tr>
          <tr><td>2</td><td>Recorrido del taller con el jefe de taller y ubicación de cada equipo en el plano</td><td>Plano con ejes A–E y 1–4</td></tr>
          <tr><td>3</td><td>Medición de distancias y revisión de protecciones</td><td>Pie de metro, huincha, linterna</td></tr>
          <tr><td>4</td><td>Fotografías con fecha, hora, punto de toma y orientación</td><td>Cámara del teléfono</td></tr>
          <tr><td>5</td><td>Comparación con los criterios y redacción de hallazgos</td><td>Sección 04</td></tr>
        </tbody></table>
        <h2 class="sec-title">04 Criterios de evaluación</h2>
        <table class="grid"><thead><tr><th>Tema</th><th>Fuente</th><th>Qué exige</th></tr></thead><tbody>
          <tr><td>Protección de máquinas</td><td>DS 594, art. 38</td><td>Deben estar protegidas todas las partes móviles, transmisiones y puntos de operación de máquinas y equipos.</td></tr>
          <tr><td>Extintores</td><td>DS 594, art. 47</td><td>Ubicados en sitios de fácil acceso y clara identificación, libres de cualquier obstáculo, a 1,30 m de altura máxima y señalizados.</td></tr>
          <tr><td>Pasillos</td><td>DS 594, art. 7</td><td>Pisos y pasillos libres de todo obstáculo.</td></tr>
          <tr><td>Protección personal</td><td>DS 594, art. 53</td><td>El empleador entrega sin costo los elementos de protección personal; el trabajador debe usarlos mientras esté expuesto al riesgo.</td></tr>
          <tr><td>Uso seguro de máquinas</td><td>DS 44/2024, art. 10</td><td>El empleador informa cómo usar las máquinas de forma segura y el contenido de sus manuales.</td></tr>
          <tr><td>Esmeril de banco</td><td>OSHA 1910.215 (referencia internacional)</td><td>Apoyo de pieza a 3 mm o menos de la muela; protector superior ajustable a 6 mm o menos. En Chile no hay una cifra oficial.</td></tr>
          <tr><td>Compresor CP-01</td><td>Placa y manual del fabricante; OSHA 1910.169</td><td>Mantención cada 90 días; purga del estanque; válvula de seguridad operativa y probada con frecuencia.</td></tr>
          <tr><td>Elevador EL-01</td><td>Manual del fabricante; ALI (EE. UU.) y HSE (Reino Unido)</td><td>Inspección al menos anual por un inspector calificado; trabas mecánicas automáticas de los brazos revisadas a diario.</td></tr>
          <tr><td>Grúa horquilla</td><td>DFL 1/2007 (Ley de Tránsito), art. 12</td><td>Licencia clase D para conducir maquinaria automotriz.</td></tr>
          <tr><td>Hallazgo</td><td>ISO 19011:2018, 3.10</td><td>Resultado de comparar la evidencia con el criterio; indica conformidad o no conformidad.</td></tr>
        </tbody></table>`),

      // 6 · Ficha e inventario
      page(6, 'p6', '05 Ficha del taller', `
        <table class="kv ficha"><tbody>
          <tr><th>Instalación</th><td>Taller de mantenimiento mecánico</td></tr>
          <tr><th>Dimensiones</th><td>20,0 × 15,0 m</td></tr>
          <tr><th>Superficie</th><td>${field('superficie', { inline: true, unit: 'm²' })}</td></tr>
          <tr><th>Coordenadas del acceso (GPS)</th><td>E 271.850 / N 6.076.310 · huso 19H · WGS-84</td></tr>
          <tr><th>Equipo más crítico</th><td>${field('equipoCritico', { inline: true })}</td></tr>
          <tr><th>Nivel de atención</th><td>${field('estado', { inline: true })}</td></tr>
        </tbody></table>
        <h3>Inventario de equipos inspeccionados</h3>
        <div class="scroll-x"><table class="grid catastro"><thead><tr><th>Código</th><th>Equipo</th><th>Eje</th><th>Última mantención</th><th>Plan</th><th>Próxima</th><th>Estado</th></tr></thead><tbody>
          <tr><td>EB-01</td><td>Esmeril de banco 8"</td><td>B-2</td><td>03-08-2026</td><td>Cada 60 días</td><td>02-10-2026</td><td>Al día</td></tr>
          <tr><td>CP-01</td><td>Compresor de pistón, estanque 300 L</td><td>E-1</td><td>12-06-2026</td><td>Cada 90 días</td><td>${field('cp01Proxima', { inline: true })}</td><td>${field('cp01Estado', { inline: true })}</td></tr>
          <tr><td>EL-01</td><td>Elevador de dos columnas, 4 t</td><td>C-3</td><td>15-03-2025</td><td>Cada 12 meses</td><td>15-03-2026</td><td>Vencida</td></tr>
          <tr><td>EX-02</td><td>Extintor de polvo químico, 6 kg</td><td>D-2</td><td>07-2026</td><td>Anual</td><td>07-2027</td><td>Al día</td></tr>
          <tr><td>GH-02</td><td>Grúa horquilla a gas, 2,5 t</td><td>Patio</td><td>05-09-2026</td><td>Cada 250 h</td><td>Según horómetro</td><td>Al día</td></tr>
        </tbody></table></div>
        ${ctx.editable ? `<p class="fill-help">${esc(HINTS.cp01Proxima)} ${esc(HINTS.cp01Estado)}</p>` : ''}`),

      // 7 · Plano
      page(7, 'p7', '06 Plano del taller', `
        <div class="croquis-wrap plano-wrap">${plano()}
          <div class="legend">
            <p><b>Cómo ubicar un equipo</b></p>
            <p class="note">El plano tiene ejes con letras (A a E, de oeste a este) y números (1 a 4, de norte a sur), cada 5 m. «B-2» es el cruce del eje B con el eje 2. En un taller, esta es la forma de dar una ubicación exacta.</p>
            <ul>
              <li><i class="lg oc"></i>Equipo</li>
              <li><i class="lg tw"></i>Columna del elevador</li>
              <li><i class="lg ph"></i>Punto de la foto y dirección</li>
              <li><i class="lg walk"></i>Pasillo peatonal</li>
              <li><i class="lg box"></i>Cajas y tambor</li>
              <li><i class="lg oil"></i>Mancha de aceite</li>
            </ul>
          </div>
        </div>`),

      // 8 · Fotos 1 y 2
      page(8, 'p8', '07 Registro fotográfico', `
        <p class="note">Cada foto lleva su ficha: archivo, fecha y hora, punto de toma en el plano, orientación y equipo. Luego, una descripción técnica.</p>
        <div class="photos">
        ${photoCard(1, src(A, 'm1'), credit('m1'), [['Archivo', 'ITM_T01_F01.jpg'], ['Fecha y hora', '21-09-2026 · 08:40'], ['Punto de toma', 'Eje A-1, portón norte'], ['Orientación', 'Sureste'], ['Equipo', 'Vista general']],
          'Vista general del taller desde el portón norte. Se observan los puestos de trabajo y el pasillo peatonal demarcado en amarillo.')}
        ${photoCard(2, src(A, 'm2'), credit('m2'), [['Archivo', 'ITM_T01_F02.jpg'], ['Fecha y hora', '21-09-2026 · 08:45'], ['Punto de toma', 'Eje B-1'], ['Orientación', 'Sur'], ['Equipo', 'EB-01 · esmeril de banco']],
          'Esmeril de banco EB-01 en el eje B-2. El apoyo de pieza está a 9 mm de la muela y el protector superior a 15 mm. No tiene visor instalado.')}
        </div>`),

      // 9 · Fotos 3 y 4
      page(9, 'p9', '07 Registro fotográfico (continuación)', `
        <div class="photos">
        ${photoCard(3, src(A, 'm3'), credit('m3'), [['Archivo', 'ITM_T01_F03.jpg'], ['Fecha y hora', '21-09-2026 · 09:05'], ['Punto de toma', 'Eje D-1'], ['Orientación', 'Este'], ['Equipo', 'CP-01 · compresor']],
          field('f3Desc', { label: 'Descripción técnica de la Foto 3' }))}
        ${photoCard(4, src(A, 'm4'), credit('m4'), [['Archivo', 'ITM_T01_F04.jpg'], ['Fecha y hora', '21-09-2026 · 09:24'], ['Punto de toma', `Eje ${field('f4Eje', { inline: true })}`], ['Orientación', 'Este'], ['Equipo', 'EL-01 · elevador de vehículos']],
          field('f4Desc', { label: 'Descripción técnica de la Foto 4' }))}
        </div>`),

      // 10 · Hallazgo 1 (modelo)
      page(10, 'p10', '08 Hallazgos', `
        <p class="note">Cada hallazgo compara lo que se vio con una regla. El Hallazgo 1 está completo: úsalo como modelo.</p>
        <section class="hz">
          <header><span class="hz-n">Hallazgo 1</span><span class="hz-t">Esmeril de banco sin ajuste de apoyo ni protector, usado sin protección ocular</span><span class="risk alto">Riesgo alto</span></header>
          <table class="kv hz-kv"><tbody>
            ${row('Evidencia', 'Foto 2 · EB-01 · eje B-2')}
            ${row('Condición', 'El esmeril de banco EB-01 tiene el apoyo de pieza a 9 mm de la muela y el protector superior a 15 mm. No tiene visor. Durante la inspección se observó a un operador usándolo sin protección ocular.')}
            ${row('Criterio', 'El DS 594 (art. 38) exige proteger los puntos de operación de las máquinas. Como referencia técnica, la norma OSHA 1910.215 fija el apoyo a 3 mm o menos y el protector a 6 mm o menos. El DS 594 (art. 53) exige entregar y usar la protección personal.')}
            ${row('Causa', 'Según el operador, el esmeril no se ajustó después del último cambio de muela.')}
            ${row('Efecto', 'La pieza puede quedar atrapada entre el apoyo y la muela, romper la muela y proyectar fragmentos. Hay riesgo de lesiones graves en manos y ojos.')}
            ${row('Recomendación', 'Dejar EB-01 fuera de servicio con tarjeta de bloqueo hasta ajustar el apoyo a 3 mm y el protector a 6 mm, instalar el visor y exigir lentes de seguridad. Incluir el ajuste en el procedimiento de cambio de muela.')}
          </tbody></table>
        </section>
        <div class="howto">
          <p><b>Cómo se lee un hallazgo</b></p>
          <ul><li><b>Condición:</b> ¿qué ocurre? Solo hechos medidos.</li><li><b>Criterio:</b> ¿qué debería ser? La regla y su fuente.</li><li><b>Causa:</b> ¿por qué ocurrió? Solo si se sabe.</li><li><b>Efecto:</b> ¿qué consecuencia tiene?</li><li><b>Recomendación:</b> ¿qué acción se propone?</li></ul>
        </div>`),

      // 11 · Hallazgos 2 y 3
      page(11, 'p11', '08 Hallazgos (continuación)', `
        <section class="hz">
          <header><span class="hz-n">Hallazgo 2</span><span class="hz-t">Extintor obstruido y sin señal visible</span>${ctx.editable ? '' : `<span class="risk">${esc(ctx.answers.h2Riesgo || 'Sin nivel')}</span>`}</header>
          <table class="kv hz-kv"><tbody>
            ${row('Evidencia', 'Libreta de terreno, 09:35 · EX-02 · eje D-2')}
            ${row('Condición', 'El extintor EX-02, con carga vigente hasta julio de 2027, está rodeado de cajas y un tambor. Su señal no se ve desde el pasillo. El pasillo peatonal está obstruido en el eje D.')}
            ${row('Criterio', field('h2Criterio', { label: 'Criterio' }))}
            ${row('Efecto', field('h2Efecto', { label: 'Efecto' }))}
            ${row('Recomendación', field('h2Recomendacion', { label: 'Recomendación' }))}
            ${ctx.editable ? row('Nivel de riesgo', field('h2Riesgo', { inline: true })) : ''}
          </tbody></table>
        </section>
        <section class="hz">
          <header><span class="hz-n">Hallazgo 3</span><span class="hz-t">${ctx.editable ? 'Elige el equipo de tu especialidad y redacta el hallazgo completo' : esc(ctx.answers.h3Titulo || 'Sin título')}</span>${ctx.editable ? '' : `<span class="risk">${esc(ctx.answers.h3Riesgo || 'Sin nivel')}</span>`}</header>
          <table class="kv hz-kv"><tbody>
            ${row('Equipo', field('h3Tema', { inline: true }))}
            ${ctx.editable ? row('Título', field('h3Titulo', { inline: true })) : ''}
            ${row('Evidencia', field('h3Foto', { inline: true }))}
            ${row('Condición', field('h3Condicion', { label: 'Condición' }))}
            ${row('Criterio', field('h3Criterio', { label: 'Criterio' }))}
            ${row('Efecto', field('h3Efecto', { label: 'Efecto' }))}
            ${row('Recomendación', field('h3Recomendacion', { label: 'Recomendación' }))}
            ${ctx.editable ? row('Nivel de riesgo', field('h3Riesgo', { inline: true })) : ''}
          </tbody></table>
        </section>`),

      // 12 · Conclusión, firmas y anexo
      page(12, 'p12', '09 Conclusión', `
        ${field('conclusion')}
        <h3>Sin observaciones</h3>
        <p>La grúa horquilla GH-02 tiene su lista de chequeo diaria firmada y su operador presentó licencia clase D. Este resultado también es un hallazgo: indica conformidad.</p>
        <h3>Firmas</h3>
        <div class="signs">
          <div><p class="sign-line">${nombre}</p><p>Inspector o inspectora en formación<br>${bind('especialidad', 'Especialidad')} · ${esc(ctx.student.curso || '')}</p></div>
          <div><p class="sign-line">&nbsp;</p><p>Revisión<br>Docente de Lengua y Literatura</p></div>
        </div>
        ${field('declaracion', { label: 'Confirmación final' })}
        <h3>Anexo · Fuentes y créditos</h3>
        <ul class="sources">
          <li><a href="https://www.bcn.cl/leychile/navegar?idNorma=167766" target="_blank" rel="noopener">DS 594/1999, Reglamento sobre condiciones sanitarias y ambientales básicas en los lugares de trabajo</a>, arts. 7, 38, 47 y 53.</li>
          <li><a href="https://www.bcn.cl/leychile/navegar?idNorma=1205298" target="_blank" rel="noopener">DS 44/2024, Reglamento sobre gestión preventiva de los riesgos laborales</a>, art. 10.</li>
          <li><a href="https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1910/subpart-O/section-1910.215" target="_blank" rel="noopener">OSHA 29 CFR 1910.215</a> (esmeriles) y <a href="https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1910/subpart-M/section-1910.169" target="_blank" rel="noopener">1910.169</a> (recipientes de aire comprimido), Estados Unidos.</li>
          <li><a href="https://www.autolift.org/get-your-lift-inspected/" target="_blank" rel="noopener">Automotive Lift Institute</a> y <a href="https://www.hse.gov.uk/pUbns/priced/hsg261.pdf" target="_blank" rel="noopener">HSE, guía HSG261</a>, elevadores de vehículos.</li>
          <li><a href="https://www.bcn.cl/leychile/navegar?idNorma=1007469" target="_blank" rel="noopener">DFL 1/2007, Ley de Tránsito</a>, art. 12.</li>
          <li>ISO 19011:2018, Directrices para la auditoría de los sistemas de gestión, apartado 3.10.</li>
          <li>Consejo de Auditoría Interna General de Gobierno. <a href="https://www.auditoriainternadegobierno.gob.cl/wp-content/upLoads/2020/11/DOCUMENTO-TECNICO-N%C2%B0-85-EJECUCION-DEL-TRABAJO-DE-AUDITORIA-V0.2.pdf" target="_blank" rel="noopener">Documento Técnico N.º 85</a>, partes del hallazgo.</li>
          ${['m1', 'm2', 'm3', 'm4'].map((k, i) => PHOTOS[k] ? `<li>Foto ${i + 1}: ${PHOTOS[k].credit}</li>` : '').join('')}
        </ul>
        <p class="note">La empresa, el taller, los equipos y la libreta son ficticios. Las fotografías son ilustrativas.</p>`)
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
