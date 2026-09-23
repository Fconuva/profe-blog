// Informe técnico prediseñado de la Clase 6 NM4. Dibuja las 13 páginas del
// informe de inspección y sus campos. Lo usan la página del estudiante
// (editable) y el panel docente (solo lectura). Requiere campos.js.
(function () {
  const C = window.INFORME_CAMPOS;
  const Q = Object.fromEntries(C.questions.map(q => [q.id, q]));
  const TOTAL_PAGES = 13;

  const esc = value => String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const miles = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Orientación breve bajo cada campo. No entrega la respuesta.
  const HINTS = {
    emision: 'La fecha en que entregas el informe.',
    especialidad: 'Tu especialidad técnica.',
    resumen: 'Escríbelo al final. En 4 a 6 líneas: qué se inspeccionó, qué se encontró, cuál es el hallazgo más grave y qué se recomienda. Con cifras.',
    obj2: 'Empieza con un verbo en infinitivo: registrar, evaluar, comparar, proponer…',
    obj3: 'Otro verbo en infinitivo. Un objetivo por línea, sin repetir el 1.',
    o1Superficie: 'Largo × ancho, con los datos de la libreta.',
    construccion: 'La ocupación más importante del sector, con su código (O-1, O-2 u O-3).',
    superficieTotal: 'Suma solo construcciones. Una plantación no es superficie construida.',
    distanciaMin: 'La ocupación más cercana al eje de la línea.',
    estado: 'Decide según el hallazgo más grave.',
    f3Desc: 'Qué se ve, dónde está y qué importancia tiene. Con datos medidos de la libreta, en registro formal.',
    f4Este: 'La coordenada de una foto es el punto desde donde se tomó.',
    f4Norte: 'Revisa la libreta: son 7 cifras.',
    f4Desc: 'Qué se ve, dónde está y qué importancia tiene. Con datos medidos, sin opiniones.',
    h2Criterio: 'Busca en la sección 04 la regla que se incumple. Cita la fuente y su numeral.',
    h2Efecto: '¿Qué puede pasar si esto sigue así? Consecuencias concretas.',
    h2Recomendacion: 'Una acción para el mandante: quién hace qué.',
    h2Riesgo: 'Alto, medio o bajo.',
    h3Titulo: 'Qué se encontró, en pocas palabras. Como el título del Hallazgo 1.',
    h3Riesgo: 'Alto, medio o bajo.',
    h3Foto: 'La fotografía que respalda el hallazgo.',
    h3Condicion: 'Lo que realmente ocurre, con medidas y ubicación. Solo hechos.',
    h3Criterio: 'Qué debería ser: la regla y su fuente.',
    h3Efecto: 'La consecuencia o el riesgo que produce.',
    h3Recomendacion: 'Una acción concreta para el mandante.',
    conclusion: 'Responde al objetivo general: qué se encontró en el vano, qué tan grave es y qué debe decidir el mandante. Sin información nueva.',
    declaracion: 'Solo si todo lo que escribiste sale de la evidencia del caso.'
  };

  // ---------- Geometría del caso (UTM WGS-84, huso 18H) ----------
  const E21 = [737905, 5891700];
  const E22 = [738160, 5891330];
  const L = Math.hypot(E22[0] - E21[0], E22[1] - E21[1]);
  const U = [(E22[0] - E21[0]) / L, (E22[1] - E21[1]) / L];
  const N = [-U[1], U[0]];
  const onAxis = (t, off) => [E21[0] + U[0] * t + N[0] * off, E21[1] + U[1] * t + N[1] * off];

  function croquis() {
    const minE = 737820, maxE = 738260, minN = 5891260, maxN = 5891990;
    const W = 440, H = 730;
    const x = e => (e - minE) * W / (maxE - minE);
    const y = n => (maxN - n) * H / (maxN - minN);
    const pt = p => `${x(p[0]).toFixed(1)},${y(p[1]).toFixed(1)}`;
    const franja = [onAxis(-240, -30), onAxis(L + 90, -30), onAxis(L + 90, 30), onAxis(-240, 30)].map(pt).join(' ');
    const grid = [];
    for (let e = 737900; e <= 738200; e += 100) {
      grid.push(`<line x1="${x(e)}" y1="0" x2="${x(e)}" y2="${H}" class="g"/><text x="${x(e) + 3}" y="${H - 6}" class="gl">${miles(e)} E</text>`);
    }
    for (let n = 5891300; n <= 5891900; n += 100) {
      grid.push(`<line x1="0" y1="${y(n)}" x2="${W}" y2="${y(n)}" class="g"/><text x="4" y="${y(n) - 4}" class="gl">${miles(n)} N</text>`);
    }
    const tower = (p, label, dx) => `<g><rect x="${x(p[0]) - 7}" y="${y(p[1]) - 7}" width="14" height="14" class="tw"/><path d="M${x(p[0]) - 7},${y(p[1]) - 7}l14,14M${x(p[0]) + 7},${y(p[1]) - 7}l-14,14" class="twx"/><text x="${x(p[0]) + dx}" y="${y(p[1]) + 4}" class="lb">${label}</text></g>`;
    const photo = (p, num, deg) => {
      const cx = x(p[0]), cy = y(p[1]);
      const a1 = (deg - 28 - 90) * Math.PI / 180, a2 = (deg + 28 - 90) * Math.PI / 180, r = 34;
      return `<g class="ph"><path d="M${cx},${cy}L${cx + r * Math.cos(a1)},${cy + r * Math.sin(a1)}A${r},${r} 0 0 1 ${cx + r * Math.cos(a2)},${cy + r * Math.sin(a2)}Z" class="cone"/><circle cx="${cx}" cy="${cy}" r="9" class="phc"/><text x="${cx}" y="${cy + 3.5}" class="phn">${num}</text></g>`;
    };
    const o1 = [738023, 5891538], o2 = [738063, 5891445];
    const o3a = onAxis(100, 18), o3b = onAxis(170, 18);
    const trees = [];
    for (let t = 100; t <= 170; t += 10) { const p = onAxis(t, 18); trees.push(`<circle cx="${x(p[0])}" cy="${y(p[1])}" r="4.2" class="tree"/>`); }
    const sub = [[737925, 5891935], [738010, 5891935], [738010, 5891985], [737925, 5891985]].map(pt).join(' ');
    const road = [[737975, 5891990], [737982, 5891760], [737990, 5891590], [738001, 5891420], [738012, 5891260]].map(pt).join(' ');
    const lineStart = onAxis(-240, 0), lineEnd = onAxis(L + 90, 0);
    return `<svg class="croquis" viewBox="0 0 ${W} ${H}" role="img" aria-label="Croquis georreferenciado del vano E-21 a E-22 con cuadrícula UTM, franja de seguridad, ocupaciones y puntos fotográficos">
      <rect width="${W}" height="${H}" class="bg"/>
      ${grid.join('')}
      <polygon points="${franja}" class="fr"/>
      <polyline points="${road}" class="rd"/>
      <polygon points="${sub}" class="sub"/><text x="${x(737930)}" y="${y(5891955)}" class="lb sm">Subestación</text>
      <line x1="${x(lineStart[0])}" y1="${y(lineStart[1])}" x2="${x(lineEnd[0])}" y2="${y(lineEnd[1])}" class="ax"/>
      ${trees.join('')}
      <text x="${x(o3a[0]) + 10}" y="${y(o3a[1]) - 8}" class="lb">O-3</text>
      <rect x="${x(o1[0]) - 6}" y="${y(o1[1]) - 4}" width="12" height="8" class="oc"/><text x="${x(o1[0]) + 10}" y="${y(o1[1]) + 4}" class="lb">O-1</text>
      <rect x="${x(o2[0]) - 8}" y="${y(o2[1]) - 5}" width="16" height="10" class="oc"/><text x="${x(o2[0]) - 36}" y="${y(o2[1]) + 4}" class="lb">O-2</text>
      ${tower(E21, 'E-21', -38)}${tower(E22, 'E-22', 12)}
      ${photo([737921, 5891739], 1, 190)}${photo([737951, 5891909], 2, 0)}${photo([737990, 5891590], 3, 0)}${photo([738008, 5891541], 4, 90)}
      <g transform="translate(${W - 34},34)"><path d="M0,-22L9,8L0,2L-9,8Z" class="na"/><text x="0" y="22" class="lb" text-anchor="middle">N</text></g>
      <g transform="translate(${W - 150},${H - 34})"><rect width="${100 * W / (maxE - minE)}" height="6" class="sc"/><text x="0" y="-5" class="gl">0</text><text x="${100 * W / (maxE - minE) - 22}" y="-5" class="gl">100 m</text></g>
    </svg>`;
  }

  // ---------- Libreta del inspector: notas informales de terreno ----------
  const LIBRETA = `
    <p class="lib-head">Libreta de terreno · Sector 4 · Vano E-21 → E-22<br>Lunes 14-09 · despejado · GPS (WGS-84, huso 18H), distanciómetro láser, huincha</p>
    <ol class="lib">
      <li><b>10:35</b> Llegamos por camino de tierra desde Charrúa. Portón abierto, el dueño nos dejó pasar.</li>
      <li><b>10:40</b> F1 desde el camino, al norte de la E-21, mirando pal sur. Se ven las torres bien.</li>
      <li><b>10:48</b> F2 al lado de la subestación, mirando al norte (referencia de inicio).</li>
      <li><b>10:52</b> F3 · 737 990 E / 5 891 590 N · 121 msnm · mirando al N. Camino de tierra con cerco a los dos lados. A la izq. una hilera de eucaliptos (O-3) como de 9-10 m de alto, a unos 18 m del eje (distanciómetro). Ojo: las ramas de arriba ya van pa' los cables. La hilera tiene como 70 m de largo.</li>
      <li><b>11:05</b> F4 · tomada desde 738 008 E / 5 891 541 N · 118 msnm · mirando al E. Mediagua de madera (O-1). Medí con huincha: 6,0 x 3,5. Techo de zinc. Queda casi debajo del conductor, a 5,2 m del eje. Parece que vive alguien: ropa tendida, un perro. Hay un cable que viene de un poste y entra por el techo. El caballero dijo que no sabía que no se podía construir ahí. Punto de la mediagua: 738 023 E / 5 891 538 N.</li>
      <li><b>11:20</b> Bodega de tablas y zinc (O-2), 8 x 4, a 14,8 m del eje. Adentro leña y un tambor azul como de 200 L con olor a parafina. No nos dejó sacar fotos adentro.</li>
      <li><b>11:30</b> Ojo: no se pudo ver si hay pozo o fosa. Pedir el plano de servidumbre oficial.</li>
    </ol>`;

  // ---------- Piezas de interfaz ----------
  function makeField(ctx) {
    return function field(id, opts = {}) {
      const q = Q[id];
      const value = ctx.answers[id] || '';
      const hint = HINTS[id] || '';
      const inline = opts.inline;
      if (!ctx.editable) {
        const shown = value ? esc(value) : '<span class="missing">Sin respuesta</span>';
        return inline ? `<span class="fill-ro${value ? '' : ' empty'}">${shown}${opts.unit && value ? ' ' + opts.unit : ''}</span>`
          : `<div class="fill-ro-block"><span class="fill-label">${esc(opts.label || q.label)}</span><div class="fill-value">${shown}</div></div>`;
      }
      let control;
      const common = `data-q="${id}" id="q-${id}" aria-describedby="h-${id}"`;
      if (q.type === 'textarea') control = `<textarea ${common} rows="${q.rows || 4}" maxlength="${q.max}" spellcheck="true" lang="es">${esc(value)}</textarea>`;
      else if (q.type === 'select') control = `<select ${common}><option value="">Elige…</option>${q.options.map(o => `<option${o === value ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
      else if (q.type === 'date') control = `<input ${common} type="date" value="${esc(value)}">`;
      else if (q.type === 'number') control = `<input ${common} type="text" inputmode="decimal" autocomplete="off" maxlength="${q.max}" value="${esc(value)}">`;
      else control = `<input ${common} type="text" maxlength="${q.max}" autocomplete="off" value="${esc(value)}">`;
      if (inline) return `<span class="fill-inline" data-wrap="${id}">${control}${opts.unit ? `<span class="unit">${opts.unit}</span>` : ''}<span class="sr" id="h-${id}">${esc(q.label)}. ${esc(hint)}</span></span>`;
      return `<div class="fill" data-wrap="${id}"><label for="q-${id}"><span class="fill-tag">Completa</span> ${esc(opts.label || q.label)}</label>${control}<span class="fill-help" id="h-${id}">${esc(hint)}</span></div>`;
    };
  }

  const page = (n, id, title, body) => `
    <article class="page" id="${id}" data-page="${n}">
      <header class="page-head"><span>ITM-TSA-INS-S04 · Rev. 0</span><span>Inspección técnica · Sector N.º 4 · Vano E-21 a E-22</span></header>
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

  // ---------- Render ----------
  function render(container, options) {
    const ctx = {
      answers: options.answers || {},
      editable: !!options.editable,
      student: options.student || { nombre: '', curso: '' }
    };
    const field = makeField(ctx);
    const A = options.assetBase || '../assets/';
    const nombre = esc(ctx.student.nombre || '—');
    const hallazgoRow = (k, v) => `<tr><th>${k}</th><td>${v}</td></tr>`;

    const pages = [
      // 1 · Portada
      `<article class="page cover" id="p1" data-page="1">
        <div class="cover-brand"><div><span class="brand-mark">TSA</span><span>Transmisora Sur Andes S.A.<small>Empresa mandante</small></span></div><div><span class="brand-mark alt">ITM</span><span>Inspecciones Técnicas del Maule Ltda.<small>Empresa consultora</small></span></div></div>
        <p class="cover-code">ITM-TSA-INS-S04 · Rev. 0</p>
        <h1 class="cover-title">Inspección técnica de ocupaciones en la franja de seguridad</h1>
        <p class="cover-sub">Línea de transmisión 2×500 kV · Sector N.º 4 · Vano E-21 a E-22</p>
        <div class="cover-img"><img src="${A}f1-torres-charrua.jpg" alt="Estructuras de alta tensión cerca de Charrúa" style="object-position:center 30%"></div>
        <table class="kv cover-kv"><tbody>
          <tr><th>Ubicación</th><td>Charrúa, comuna de Cabrero, Región del Biobío</td></tr>
          <tr><th>Inspección en terreno</th><td>Lunes 14 de septiembre de 2026</td></tr>
          <tr><th>Fecha de emisión</th><td>${field('emision', { inline: true })}</td></tr>
          <tr><th>Inspector o inspectora</th><td>${nombre}</td></tr>
          <tr><th>Especialidad</th><td>${field('especialidad', { inline: true })}</td></tr>
        </tbody></table>
        <p class="case-note">Caso de estudio con fines educativos. Sigue la estructura de un informe real de inspección bajo una línea de 500 kV; las empresas y los datos del sector son ficticios.</p>
        <footer class="page-foot"><span>Inspecciones Técnicas del Maule Ltda. · Caso de estudio</span><span>Página 1 de ${TOTAL_PAGES}</span></footer>
      </article>`,

      // 2 · Control del documento
      page(2, 'p2', 'Control del documento', `
        <table class="grid"><thead><tr><th>Rev.</th><th>Fecha</th><th>Descripción</th><th>Elaboró</th><th>Revisó</th></tr></thead>
        <tbody><tr><td>0</td><td>${bind('emision')}</td><td>Emisión para revisión del mandante</td><td>${nombre}</td><td>Docente de Lengua y Literatura</td></tr></tbody></table>
        <h3>Distribución</h3>
        <p>Transmisora Sur Andes S.A., una copia digital. Archivo de Inspecciones Técnicas del Maule Ltda.</p>
        <h3>Índice</h3>
        <ol class="toc">
          <li><span>00 Resumen ejecutivo</span><span>3</span></li>
          <li><span>01 Introducción y antecedentes</span><span>4</span></li>
          <li><span>02 Objetivos</span><span>4</span></li>
          <li><span>03 Alcance y metodología</span><span>5</span></li>
          <li><span>04 Criterios de evaluación</span><span>5</span></li>
          <li><span>05 Ficha técnica y catastro del sector</span><span>6</span></li>
          <li><span>06 Ubicación y estructuras</span><span>7</span></li>
          <li><span>07 Registro fotográfico georreferenciado</span><span>8</span></li>
          <li><span>08 Hallazgos</span><span>10</span></li>
          <li><span>09 Conclusiones y firmas</span><span>12</span></li>
          <li><span>Anexo A · Fuentes, créditos y mapa de ubicación</span><span>13</span></li>
        </ol>
        <h3>Abreviaturas</h3>
        <table class="grid compact"><tbody>
          <tr><th>E-21</th><td>Estructura (torre) N.º 21 de la línea</td></tr>
          <tr><th>O-1</th><td>Ocupación N.º 1 detectada en el sector</td></tr>
          <tr><th>UTM</th><td>Sistema de coordenadas en metros (Este, Norte y huso)</td></tr>
          <tr><th>WGS-84</th><td>Sistema de referencia geodésico que usan los GPS</td></tr>
          <tr><th>msnm</th><td>Metros sobre el nivel del mar</td></tr>
          <tr><th>RPTD</th><td>Pliego técnico normativo de la Superintendencia de Electricidad y Combustibles (SEC)</td></tr>
        </tbody></table>`),

      // 3 · Resumen ejecutivo
      page(3, 'p3', '00 Resumen ejecutivo', `
        <div class="kpis">
          <div><b>3</b><span>ocupaciones detectadas</span></div>
          <div><b>${bind('distanciaMin')} m</b><span>distancia mínima al eje</span></div>
          <div><b>${bind('superficieTotal')} m²</b><span>superficie construida</span></div>
          <div><b>449 m</b><span>longitud del vano</span></div>
        </div>
        ${field('resumen')}
        <p class="note">El resumen ejecutivo se escribe al final, pero va al principio: es lo único que muchos lectores del mandante alcanzan a leer.</p>`),

      // 4 · Introducción y objetivos
      page(4, 'p4', '01 Introducción y antecedentes', `
        <p>Transmisora Sur Andes S.A. encargó a Inspecciones Técnicas del Maule Ltda. la inspección visual de las ocupaciones existentes en la franja de seguridad de la línea de transmisión 2×500 kV, en el tramo comprendido entre las estructuras E-21 y E-22, sector de Charrúa, comuna de Cabrero.</p>
        <p>La franja de seguridad es el área de exclusión de una línea eléctrica: dentro de ella no se permiten edificios, construcciones ni plantaciones. El presente informe registra lo observado en terreno el 14 de septiembre de 2026, lo compara con la normativa vigente y propone acciones al mandante. No constituye una mensura ni un estudio de títulos de dominio.</p>
        <table class="grid"><thead><tr><th>Antecedente</th><th>Dato</th><th>Fuente</th></tr></thead><tbody>
          <tr><td>Tensión nominal</td><td>500 kV, doble circuito</td><td>Ficha técnica de la línea (mandante)</td></tr>
          <tr><td>Ancho de la franja en el vano</td><td>30 m a cada lado del eje</td><td>Plano de servidumbre del proyecto</td></tr>
          <tr><td>Longitud del vano E-21 a E-22</td><td>449 m</td><td>Cálculo con coordenadas UTM</td></tr>
          <tr><td>Tipo de estructuras</td><td>Suspensión, altura útil 32,0 m</td><td>Ficha de estructuras (mandante)</td></tr>
        </tbody></table>
        <h2 class="sec-title">02 Objetivos</h2>
        <p><b>Objetivo general.</b> Identificar, caracterizar y registrar las ocupaciones existentes en la franja de seguridad del vano E-21 a E-22, para que el mandante decida las acciones que correspondan.</p>
        <p><b>Objetivos específicos.</b></p>
        <ol class="objs"><li>Georreferenciar cada ocupación y medir su distancia al eje de la línea.</li><li>${field('obj2', { inline: true })}</li><li>${field('obj3', { inline: true })}</li></ol>
        ${ctx.editable ? `<p class="fill-help">${esc(HINTS.obj2)}</p>` : ''}`),

      // 5 · Alcance, metodología y criterios
      page(5, 'p5', '03 Alcance y metodología', `
        <table class="grid"><thead><tr><th>Etapa</th><th>Actividad</th><th>Instrumento</th><th>Producto</th></tr></thead><tbody>
          <tr><td>1 · Gabinete</td><td>Revisión del plano de servidumbre y de las coordenadas de las estructuras</td><td>Plano del proyecto, sistema de información geográfica</td><td>Tabla de estructuras</td></tr>
          <tr><td>2 · Terreno</td><td>Recorrido a pie del vano; medición de dimensiones y distancias al eje</td><td>GPS (WGS-84, huso 18H), distanciómetro láser, huincha</td><td>Libreta de terreno</td></tr>
          <tr><td>3 · Registro</td><td>Fotografías con fecha, hora, coordenadas y orientación</td><td>Cámara con GPS</td><td>Registro fotográfico</td></tr>
          <tr><td>4 · Análisis</td><td>Comparación de lo observado con los criterios de evaluación</td><td>Pliego RPTD N.º 07, DFL 4</td><td>Hallazgos</td></tr>
          <tr><td>5 · Informe</td><td>Redacción, revisión y emisión</td><td>Plantilla del mandante</td><td>Informe Rev. 0</td></tr>
        </tbody></table>
        <p class="note"><b>Limitaciones.</b> Inspección visual, sin ingreso a las construcciones sin autorización del ocupante. Las distancias al eje son horizontales y se midieron con distanciómetro láser (±0,1 m).</p>
        <h2 class="sec-title">04 Criterios de evaluación</h2>
        <table class="grid"><thead><tr><th>Criterio</th><th>Fuente</th><th>Qué exige</th></tr></thead><tbody>
          <tr><td>Franja de seguridad</td><td>Pliego Técnico RPTD N.º 07, SEC, numerales 3.2 y 4.9</td><td>Es un área de exclusión: dentro de ella no se permiten edificios, construcciones, obras ni plantaciones.</td></tr>
          <tr><td>Actividades prohibidas</td><td>Pliego Técnico RPTD N.º 07, SEC, numeral 4.13</td><td>Dentro de la franja no se permite almacenar combustibles, excavar ni maniobrar grúas o camiones tolva.</td></tr>
          <tr><td>Servidumbre eléctrica</td><td>DFL 4/2006, Ley General de Servicios Eléctricos, art. 57</td><td>El dueño del predio no puede hacer plantaciones, construcciones ni obras que perturben el ejercicio de la servidumbre.</td></tr>
          <tr><td>Coordenadas</td><td>SMA, Res. Ex. N.º 2.875 de 2025</td><td>Sistema de referencia WGS-84; en UTM se informan Este, Norte y huso (18 o 19 en Chile continental).</td></tr>
          <tr><td>Hallazgo</td><td>ISO 19011:2018, apartado 3.10</td><td>Resultado de comparar la evidencia con el criterio: indica conformidad o no conformidad.</td></tr>
        </tbody></table>`),

      // 6 · Ficha técnica y catastro
      page(6, 'p6', '05 Ficha técnica del sector', `
        <table class="kv ficha"><tbody>
          <tr><th>Sector</th><td>Sector N.º 4</td></tr>
          <tr><th>Vano</th><td>E-21 a E-22</td></tr>
          <tr><th>Comuna y región</th><td>Cabrero · Región del Biobío</td></tr>
          <tr><th>Fecha de inspección</th><td>14-09-2026</td></tr>
          <tr><th>Construcción principal</th><td>${field('construccion', { inline: true })}</td></tr>
          <tr><th>Superficie construida total</th><td>${field('superficieTotal', { inline: true, unit: 'm²' })}</td></tr>
          <tr><th>Distancia mínima al eje</th><td>${field('distanciaMin', { inline: true, unit: 'm' })}</td></tr>
          <tr><th>Estado general</th><td>${field('estado', { inline: true })}</td></tr>
        </tbody></table>
        <h3>Catastro de ocupaciones</h3>
        <div class="scroll-x"><table class="grid catastro"><thead><tr><th>N.º</th><th>Ocupación</th><th>Dimensiones</th><th>Superficie</th><th>Distancia al eje</th><th>Materialidad</th><th>Evidencia</th></tr></thead><tbody>
          <tr><td>O-1</td><td>Vivienda liviana (mediagua)</td><td>6,0 × 3,5 m</td><td>${field('o1Superficie', { inline: true, unit: 'm²' })}</td><td>5,2 m</td><td>Madera; techumbre de zinc</td><td>Foto 4</td></tr>
          <tr><td>O-2</td><td>Bodega</td><td>8,0 × 4,0 m</td><td>32,0 m²</td><td>14,8 m</td><td>Madera y zinc</td><td>Sin foto: no autorizada</td></tr>
          <tr><td>O-3</td><td>Hilera de eucaliptos</td><td>70 m de largo; 9 a 10 m de alto</td><td>No aplica</td><td>18 m</td><td>Vegetación</td><td>Foto 3</td></tr>
        </tbody></table></div>
        ${ctx.editable ? `<p class="fill-help">${esc(HINTS.o1Superficie)} ${esc(HINTS.superficieTotal)}</p>` : ''}`),

      // 7 · Ubicación y croquis
      page(7, 'p7', '06 Ubicación y estructuras', `
        <div class="scroll-x"><table class="grid"><thead><tr><th>Estructura</th><th>Coordenada UTM WGS-84 · huso 18H</th><th>Tipo y altura útil</th><th>Relación con el sector</th></tr></thead><tbody>
          <tr><td>E-21</td><td>E ${miles(E21[0])} / N ${miles(E21[1])}</td><td>Suspensión · 32,0 m</td><td>Inicio del vano</td></tr>
          <tr><td>E-22</td><td>E ${miles(E22[0])} / N ${miles(E22[1])}</td><td>Suspensión · 32,0 m</td><td>Fin del vano</td></tr>
        </tbody></table></div>
        <div class="croquis-wrap">${croquis()}
          <div class="legend">
            <p><b>Croquis georreferenciado</b> (cuadrícula UTM cada 100 m)</p>
            <ul>
              <li><i class="lg ax"></i>Eje de la línea 2×500 kV</li>
              <li><i class="lg fr"></i>Franja de seguridad: 30 m a cada lado</li>
              <li><i class="lg tw"></i>Estructura (torre)</li>
              <li><i class="lg oc"></i>Ocupación construida</li>
              <li><i class="lg tree"></i>Plantación</li>
              <li><i class="lg ph"></i>Punto fotográfico y dirección de la toma</li>
              <li><i class="lg rd"></i>Camino vecinal</li>
            </ul>
            <p class="note">Las ocupaciones y los puntos se dibujan en su coordenada. Los símbolos no están a escala.</p>
          </div>
        </div>`),

      // 8 · Fotos 1 y 2
      page(8, 'p8', '07 Registro fotográfico georreferenciado', `
        <p class="note">Cada fotografía lleva su ficha: archivo, fecha y hora, coordenadas del punto de toma, altitud, orientación y ubicación. Luego, una descripción técnica.</p>
        <div class="photos">
        ${photoCard(1, A + 'f1-torres-charrua.jpg', 'Foto: Matías y Yordan Garrido González · Wikimedia Commons · CC BY-SA 4.0. Ubicación real de la toma.', [
          ['Archivo', 'ITM_S04_F01.jpg'], ['Fecha y hora', '14-09-2026 · 10:40'], ['UTM WGS-84', 'E 737.921 / N 5.891.739 · 18H'], ['Altitud', '124 msnm'], ['Orientación', 'Sur'], ['Ubicación', 'Camino vecinal, al norte de E-21']],
          'Vista general de las estructuras de la línea desde el camino vecinal. En primer plano, el cerco perimetral de hormigón de la subestación. No se observan ocupaciones en este punto.', 'center 35%')}
        ${photoCard(2, A + 'f2-subestacion-charrua.jpg', 'Foto: Matías y Yordan Garrido González · Wikimedia Commons · CC BY-SA 4.0. Ubicación real de la toma.', [
          ['Archivo', 'ITM_S04_F02.jpg'], ['Fecha y hora', '14-09-2026 · 10:48'], ['UTM WGS-84', 'E 737.951 / N 5.891.909 · 18H'], ['Altitud', '122 msnm'], ['Orientación', 'Norte'], ['Ubicación', 'Acceso norte, junto a la subestación']],
          'Patio de la subestación y estructuras de salida de la línea, tomados como punto de referencia para el inicio del recorrido. Sin observaciones.')}
        </div>`),

      // 9 · Fotos 3 y 4
      page(9, 'p9', '07 Registro fotográfico georreferenciado (continuación)', `
        <div class="photos">
        ${photoCard(3, A + 'f3-camino-plantacion.jpg', 'Foto ilustrativa: Monteaguilino1 · Wikimedia Commons · CC BY-SA 4.0.', [
          ['Archivo', 'ITM_S04_F03.jpg'], ['Fecha y hora', '14-09-2026 · 10:52'], ['UTM WGS-84', 'E 737.990 / N 5.891.590 · 18H'], ['Altitud', '121 msnm'], ['Orientación', 'Norte'], ['Ubicación', 'Camino de acceso bajo el vano']],
          field('f3Desc', { label: 'Descripción técnica de la Foto 3' }))}
        ${photoCard(4, A + 'f4-vivienda-liviana.jpg', 'Foto ilustrativa: Municipalidad de Talcahuano · Wikimedia Commons · CC BY-SA 2.0.', [
          ['Archivo', 'ITM_S04_F04.jpg'], ['Fecha y hora', '14-09-2026 · 11:05'],
          ['UTM WGS-84', `E ${field('f4Este', { inline: true })} / N ${field('f4Norte', { inline: true })} · 18H`],
          ['Altitud', '118 msnm'], ['Orientación', 'Este'], ['Ubicación', 'Frente a la ocupación O-1']],
          field('f4Desc', { label: 'Descripción técnica de la Foto 4' }))}
        </div>
        ${ctx.editable ? `<p class="fill-help">${esc(HINTS.f4Este)}</p>` : ''}`),

      // 10 · Hallazgo 1 (modelo)
      page(10, 'p10', '08 Hallazgos', `
        <p class="note">Cada hallazgo compara la evidencia (lo que se vio) con un criterio (lo que debería ser). El Hallazgo 1 está redactado completo: úsalo como modelo.</p>
        <section class="hz">
          <header><span class="hz-n">Hallazgo 1</span><span class="hz-t">Vivienda liviana habitada dentro de la franja de seguridad</span><span class="risk alto">Riesgo alto</span></header>
          <table class="kv hz-kv"><tbody>
            ${hallazgoRow('Evidencia', 'Foto 4 · ocupación O-1 · E 738.023 / N 5.891.538')}
            ${hallazgoRow('Condición', 'En el vano E-21 a E-22 se identifica una vivienda liviana de madera con techumbre de zinc (O-1), de 6,0 × 3,5 m, ubicada a 5,2 m del eje de la línea, dentro de la franja de seguridad. Se observan señales de uso habitacional, y una acometida eléctrica de baja tensión llega a la techumbre desde un poste cercano.')}
            ${hallazgoRow('Criterio', 'El Pliego Técnico RPTD N.º 07 de la SEC (numeral 4.9) no permite edificios ni construcciones dentro de la franja de seguridad. El artículo 57 del DFL 4/2006 prohíbe al dueño del predio levantar construcciones que perturben la servidumbre.')}
            ${hallazgoRow('Causa', 'No determinada en terreno. El ocupante declaró desconocer la existencia de la servidumbre.')}
            ${hallazgoRow('Efecto', 'Las personas que habitan la vivienda quedan expuestas a riesgo eléctrico y de incendio, y la construcción dificulta la inspección y el mantenimiento de la línea.')}
            ${hallazgoRow('Recomendación', 'Informar al mandante para que gestione con el propietario la reubicación de la vivienda fuera de la franja. Mientras tanto, no intervenir la construcción, señalizar el riesgo y priorizar este sector en la próxima inspección.')}
          </tbody></table>
        </section>
        <div class="howto">
          <p><b>Cómo se lee un hallazgo</b></p>
          <ul><li><b>Condición:</b> ¿qué ocurre realmente? Solo hechos medidos.</li><li><b>Criterio:</b> ¿qué debería ser? La regla y su fuente.</li><li><b>Causa:</b> ¿por qué ocurrió? Solo si se sabe.</li><li><b>Efecto:</b> ¿qué consecuencia produce?</li><li><b>Recomendación:</b> ¿qué acción se propone?</li></ul>
          <p class="credit">Estructura según el Documento Técnico N.º 85 del Consejo de Auditoría Interna General de Gobierno.</p>
        </div>`),

      // 11 · Hallazgos 2 y 3
      page(11, 'p11', '08 Hallazgos (continuación)', `
        <section class="hz">
          <header><span class="hz-n">Hallazgo 2</span><span class="hz-t">Acopio de combustible y leña en una bodega dentro de la franja</span>${ctx.editable ? '' : `<span class="risk">${esc(ctx.answers.h2Riesgo || 'Sin nivel')}</span>`}</header>
          <table class="kv hz-kv"><tbody>
            ${hallazgoRow('Evidencia', 'Sin registro fotográfico: el ocupante no autorizó fotografías del interior. Ocupación O-2 · E 738.063 / N 5.891.445')}
            ${hallazgoRow('Condición', 'A 14,8 m del eje se ubica una bodega de madera y zinc (O-2), de 8,0 × 4,0 m. En su interior se observa acopio de leña y un tambor azul de aproximadamente 200 L con olor a combustible.')}
            ${hallazgoRow('Criterio', field('h2Criterio', { label: 'Criterio' }))}
            ${hallazgoRow('Efecto', field('h2Efecto', { label: 'Efecto' }))}
            ${hallazgoRow('Recomendación', field('h2Recomendacion', { label: 'Recomendación' }))}
            ${ctx.editable ? hallazgoRow('Nivel de riesgo', field('h2Riesgo', { inline: true })) : ''}
          </tbody></table>
        </section>
        <section class="hz">
          <header><span class="hz-n">Hallazgo 3</span><span class="hz-t">${ctx.editable ? 'Redáctalo completo a partir de la libreta y la Foto 3' : esc(ctx.answers.h3Titulo || 'Sin título')}</span>${ctx.editable ? '' : `<span class="risk">${esc(ctx.answers.h3Riesgo || 'Sin nivel')}</span>`}</header>
          <table class="kv hz-kv"><tbody>
            ${ctx.editable ? hallazgoRow('Título', field('h3Titulo', { inline: true })) : ''}
            ${hallazgoRow('Evidencia', field('h3Foto', { inline: true }))}
            ${hallazgoRow('Condición', field('h3Condicion', { label: 'Condición' }))}
            ${hallazgoRow('Criterio', field('h3Criterio', { label: 'Criterio' }))}
            ${hallazgoRow('Efecto', field('h3Efecto', { label: 'Efecto' }))}
            ${hallazgoRow('Recomendación', field('h3Recomendacion', { label: 'Recomendación' }))}
            ${ctx.editable ? hallazgoRow('Nivel de riesgo', field('h3Riesgo', { inline: true })) : ''}
          </tbody></table>
        </section>`),

      // 12 · Conclusiones y firmas
      page(12, 'p12', '09 Conclusiones', `
        ${field('conclusion')}
        <h3>Condiciones a confirmar</h3>
        <ul class="confirm">
          <li>Existencia de pozo o fosa séptica asociada a la ocupación O-1.</li>
          <li>Propiedad, ocupante y uso actual de O-1 y O-2, contrastados con el plano de servidumbre oficial.</li>
          <li>Contenido del tambor de la bodega O-2, con autorización del ocupante.</li>
        </ul>
        <h3>Firmas</h3>
        <div class="signs">
          <div><p class="sign-line">${nombre}</p><p>Inspector o inspectora en formación<br>${bind('especialidad', 'Especialidad')} · ${esc(ctx.student.curso || '')}</p></div>
          <div><p class="sign-line">&nbsp;</p><p>Revisión<br>Docente de Lengua y Literatura</p></div>
        </div>
        ${field('declaracion', { label: 'Declaración de veracidad' })}`),

      // 13 · Anexo
      page(13, 'p13', 'Anexo A · Fuentes, créditos y mapa de ubicación', `
        <h3>Mapa de ubicación</h3>
        <div class="map">
          <iframe title="Mapa de ubicación del sector en OpenStreetMap" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=-72.3400%2C-37.1030%2C-72.3060%2C-37.0800&amp;layer=mapnik&amp;marker=-37.09047%2C-72.32311"></iframe>
          <p class="credit">Punto: toma de la Foto 1 (latitud −37,09047; longitud −72,32311 = E 737.921 / N 5.891.739, huso 18H). Mapa © colaboradores de OpenStreetMap. <a href="https://www.openstreetmap.org/?mlat=-37.09047&amp;mlon=-72.32311#map=16/-37.09047/-72.32311" target="_blank" rel="noopener">Abrir en OpenStreetMap</a></p>
        </div>
        <h3>Normativa y fuentes</h3>
        <ul class="sources">
          <li>Superintendencia de Electricidad y Combustibles. <a href="https://www.sec.cl/sitio-web/wp-content/uploads/2020/09/Pliego-T%C3%A9cnico-Normativo-RPTD-N%C2%B007-Franja-y-distancia-seguridad.pdf" target="_blank" rel="noopener">Pliego Técnico Normativo RPTD N.º 07, Franja y distancias de seguridad</a> (Res. Ex. 33.277, 2020).</li>
          <li><a href="https://www.bcn.cl/leychile/navegar?idNorma=258171" target="_blank" rel="noopener">DFL 4/2006, Ley General de Servicios Eléctricos</a>, artículo 57.</li>
          <li>Superintendencia del Medio Ambiente. <a href="https://www.diariooficial.interior.gob.cl/publicaciones/2026/01/06/44341/01/2747468.pdf" target="_blank" rel="noopener">Res. Ex. N.º 2.875 de 2025</a>, sistema de referencia y coordenadas.</li>
          <li>Consejo de Auditoría Interna General de Gobierno. <a href="https://www.auditoriainternadegobierno.gob.cl/wp-content/upLoads/2020/11/DOCUMENTO-TECNICO-N%C2%B0-85-EJECUCION-DEL-TRABAJO-DE-AUDITORIA-V0.2.pdf" target="_blank" rel="noopener">Documento Técnico N.º 85</a>, atributos del hallazgo.</li>
          <li>ISO 19011:2018, Directrices para la auditoría de los sistemas de gestión, apartado 3.</li>
        </ul>
        <h3>Créditos de las fotografías</h3>
        <table class="grid compact"><thead><tr><th>Foto</th><th>Autor y licencia</th><th>Uso en el caso</th></tr></thead><tbody>
          <tr><td>1 y portada</td><td><a href="https://commons.wikimedia.org/wiki/File:Torres_Charr%C3%BAa_(1).jpg" target="_blank" rel="noopener">Matías y Yordan Garrido González, CC BY-SA 4.0</a></td><td>Real, con sus coordenadas</td></tr>
          <tr><td>2</td><td><a href="https://commons.wikimedia.org/wiki/File:Torres_Charr%C3%BAa_(2).jpg" target="_blank" rel="noopener">Matías y Yordan Garrido González, CC BY-SA 4.0</a></td><td>Real, con sus coordenadas</td></tr>
          <tr><td>3</td><td><a href="https://commons.wikimedia.org/wiki/File:Puentes_Negros,_Biob%C3%ADo,_Chile.jpg" target="_blank" rel="noopener">Monteaguilino1, CC BY-SA 4.0</a></td><td>Ilustrativa; datos del caso</td></tr>
          <tr><td>4</td><td><a href="https://commons.wikimedia.org/wiki/File:Mediagua.jpg" target="_blank" rel="noopener">Municipalidad de Talcahuano, CC BY-SA 2.0</a></td><td>Ilustrativa; datos del caso</td></tr>
        </tbody></table>
        <p class="note">Las empresas, las estructuras E-21 y E-22, las ocupaciones y la libreta de terreno son ficticias. La estructura del informe sigue la de un informe real de inspección de ocupaciones bajo una línea de 500 kV.</p>`)
    ];

    container.innerHTML = pages.join('');
    refreshBindings(container, ctx.answers);
    return ctx;
  }

  function refreshBindings(container, answers) {
    container.querySelectorAll('[data-bind]').forEach(node => {
      const raw = answers[node.dataset.bind];
      let text = raw ? String(raw) : node.dataset.empty;
      if (raw && node.dataset.bind === 'emision') {
        const [y, m, d] = raw.split('-');
        text = `${d}-${m}-${y}`;
      }
      node.textContent = text;
    });
  }

  window.InformeTecnico = { render, refreshBindings, LIBRETA, HINTS, TOTAL_PAGES };
})();
