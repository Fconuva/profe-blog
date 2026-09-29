// Renderer compartido por los informes especializados de Mecánica Industrial
// y Mecánica Automotriz. Cada ruta define window.INFORME_CASO en informe.js.
(function () {
  const C = window.INFORME_CAMPOS;
  const S = window.INFORME_CASO;
  if (!C || !S) throw new Error('Falta la definición del informe especializado.');
  const Q = Object.fromEntries(C.questions.map(question => [question.id, question]));
  const REQUIRED = new Set(C.activity.requiredForSubmit || []);
  const TOTAL_PAGES = 12;
  const esc = value => String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  function makeField(ctx) {
    return function field(id, opts = {}) {
      const question = Q[id];
      if (!question) throw new Error(`Campo desconocido: ${id}`);
      const value = ctx.answers[id] || '';
      const hint = S.hints[id] || '';
      if (!ctx.editable) {
        const shown = value ? esc(value) : '<span class="missing">Sin respuesta</span>';
        return opts.inline
          ? `<span class="fill-ro${value ? '' : ' empty'}">${shown}${opts.unit && value ? ' ' + esc(opts.unit) : ''}</span>`
          : `<div class="fill-ro-block"><span class="fill-label">${esc(opts.label || question.label)}</span><div class="fill-value">${shown}</div></div>`;
      }
      const common = `data-q="${id}" id="q-${id}" aria-describedby="h-${id}"`;
      let control;
      if (question.type === 'textarea') control = `<textarea ${common} rows="${question.rows || 4}" maxlength="${question.max}" spellcheck="true" lang="es">${esc(value)}</textarea>`;
      else if (question.type === 'select') control = `<select ${common}><option value="">Elige…</option>${question.options.map(option => `<option${option === value ? ' selected' : ''}>${esc(option)}</option>`).join('')}</select>`;
      else if (question.type === 'date') control = `<input ${common} type="date" value="${esc(value)}">`;
      else if (question.type === 'number') control = `<input ${common} type="text" inputmode="decimal" autocomplete="off" maxlength="${question.max}" value="${esc(value)}">`;
      else control = `<input ${common} type="text" maxlength="${question.max}" autocomplete="off" value="${esc(value)}">`;
      if (opts.inline) return `<span class="fill-inline" data-wrap="${id}">${control}${opts.unit ? `<span class="unit">${esc(opts.unit)}</span>` : ''}<span class="sr" id="h-${id}">${esc(question.label)}. ${esc(hint)}</span></span>`;
      return `<div class="fill" data-wrap="${id}"><label for="q-${id}"><span class="fill-tag">${REQUIRED.has(id) ? 'Obligatorio' : 'Ampliación'}</span> ${esc(opts.label || question.label)}</label>${control}<span class="fill-help" id="h-${id}">${esc(hint)}</span></div>`;
    };
  }

  const list = items => items.map(item => `<li>${item}</li>`).join('');
  const tableRows = rows => rows.map(row => `<tr>${row.map((cell, index) => `<${index === 0 ? 'th' : 'td'}>${cell}</${index === 0 ? 'th' : 'td'}>`).join('')}</tr>`).join('');
  const bind = (id, fallback = '—') => `<span data-bind="${id}" data-empty="${esc(fallback)}"></span>`;

  function renderValue(value, field) {
    if (value && typeof value === 'object' && value.field) return field(value.field, { inline: true, unit: value.unit || '' });
    return String(value);
  }

  function page(number, id, title, body) {
    return `<article class="page" id="${id}" data-page="${number}"><header class="page-head"><span>${esc(S.code)} · Rev. 0</span><span>${esc(S.reportHeader)}</span></header>${title ? `<h2 class="sec-title">${title}</h2>` : ''}${body}<footer class="page-foot"><span>${esc(S.service)} · Caso educativo</span><span>Página ${number} de ${TOTAL_PAGES}</span></footer></article>`;
  }

  function photoCard(photo, description, assetBase) {
    return `<figure class="photo"><div class="photo-img"><img src="${assetBase + photo.file}" alt="${esc(photo.alt)}" loading="lazy" style="object-position:${esc(photo.position || 'center')}"><span class="stamp">F${photo.number}</span></div><table class="kv photo-kv"><tbody>${photo.rows.map(row => `<tr><th>${esc(row[0])}</th><td>${esc(row[1])}</td></tr>`).join('')}</tbody></table><figcaption><b>Foto ${photo.number}.</b> ${description}</figcaption><p class="credit">Imagen original generada con IA para este caso educativo.</p></figure>`;
  }

  function findingRows(rows) {
    return rows.map(row => `<tr><th>${esc(row[0])}</th><td>${row[1]}</td></tr>`).join('');
  }

  function render(container, options) {
    const ctx = { answers: options.answers || {}, editable: !!options.editable, student: options.student || { nombre: '', curso: '' } };
    const field = makeField(ctx);
    const A = options.assetBase || '../assets/';
    const name = esc(ctx.student.nombre || '—');
    const role = ctx.student.workMode === 'pair' ? S.rolePlural : S.roleSingular;
    const measurements = S.measurements.map(row => [esc(row.label), renderValue(row.value, field)]);
    const finding2Rows = [
      ['Evidencia', esc(S.finding2.evidence)],
      ['Condición', esc(S.finding2.condition)],
      ['Criterio', field('h2Criterio', { label: 'Criterio' })],
      ['Efecto', field('h2Efecto', { label: 'Efecto' })],
      ['Recomendación', field('h2Recomendacion', { label: 'Recomendación' })]
    ];
    if (ctx.editable) finding2Rows.push(['Nivel de riesgo', field('h2Riesgo', { inline: true })]);
    const finding3Rows = [];
    if (ctx.editable) finding3Rows.push(['Título', field('h3Titulo', { inline: true })]);
    finding3Rows.push(
      ['Evidencia', field('h3Evidencia', { inline: true })],
      ['Condición', field('h3Condicion', { label: 'Condición' })],
      ['Criterio', field('h3Criterio', { label: 'Criterio' })],
      ['Efecto', field('h3Efecto', { label: 'Efecto' })],
      ['Recomendación', field('h3Recomendacion', { label: 'Recomendación' })]
    );
    if (ctx.editable) finding3Rows.push(['Nivel de riesgo', field('h3Riesgo', { inline: true })]);

    const pages = [
      `<article class="page cover" id="p1" data-page="1"><div class="cover-brand"><div><span class="brand-mark">${esc(S.clientMark)}</span><span>${esc(S.client)}<small>Empresa mandante</small></span></div><div><span class="brand-mark alt">${esc(S.serviceMark)}</span><span>${esc(S.service)}<small>Servicio de diagnóstico</small></span></div></div><p class="cover-code">${esc(S.code)} · Rev. 0</p><h1 class="cover-title">${esc(S.title)}</h1><p class="cover-sub">${esc(S.subtitle)}</p><div class="cover-img"><img src="${A + S.photos[0].file}" alt="${esc(S.photos[0].alt)}"></div><table class="kv cover-kv"><tbody><tr><th>Ubicación</th><td>${esc(S.location)}</td></tr><tr><th>Diagnóstico</th><td>${esc(S.inspectionDate)}</td></tr><tr><th>Fecha de emisión</th><td>${field('emision', { inline: true })}</td></tr><tr><th>${esc(role)}</th><td>${name}</td></tr><tr><th>Especialidad</th><td>${field('especialidad', { inline: true })}</td></tr></tbody></table><p class="case-note">Caso de estudio con fines educativos. La empresa, el equipo, las mediciones y los documentos internos son ficticios. Las imágenes fueron generadas con IA para representar evidencia técnica.</p><footer class="page-foot"><span>${esc(S.service)} · Caso educativo</span><span>Página 1 de ${TOTAL_PAGES}</span></footer></article>`,

      page(2, 'p2', 'Datos del documento', `<table class="grid"><thead><tr><th>Rev.</th><th>Fecha</th><th>Descripción</th><th>Elaboró</th><th>Revisó</th></tr></thead><tbody><tr><td>0</td><td>${bind('emision')}</td><td>Emisión para revisión de jefatura</td><td>${name}</td><td>Docente de Lengua y Literatura</td></tr></tbody></table><h3>Índice</h3><ol class="toc"><li><span>00 Resumen ejecutivo</span><span>3</span></li><li><span>01 Introducción · 02 Objetivos</span><span>4</span></li><li><span>03 Metodología · 04 Criterios</span><span>5</span></li><li><span>05 Mediciones y registros</span><span>6</span></li><li><span>06 Esquema técnico</span><span>7</span></li><li><span>07 Registro fotográfico</span><span>8</span></li><li><span>08 Hallazgos</span><span>10</span></li><li><span>09 Conclusión y firmas</span><span>12</span></li></ol><h3>Glosario</h3><table class="grid compact"><tbody>${tableRows(S.glossary.map(row => [esc(row[0]), esc(row[1])]))}</tbody></table>`),

      page(3, 'p3', '00 Resumen ejecutivo', `<div class="kpis">${S.kpis.map(kpi => `<div><b>${kpi.field ? bind(kpi.field) : esc(kpi.value)}</b><span>${esc(kpi.label)}</span></div>`).join('')}</div>${field('resumen')}<p class="note">Escríbelo al final, aunque aparece al principio. Debe permitir que la jefatura conozca el estado, la evidencia principal y la acción recomendada.</p>`),

      page(4, 'p4', '01 Introducción', `${S.introduction.map(paragraph => `<p>${paragraph}</p>`).join('')}<h2 class="sec-title">02 Objetivos</h2><p><b>Objetivo general.</b> ${S.generalObjective}</p><p><b>Objetivos específicos.</b></p><ol class="objs"><li>${S.objective1}</li><li>${field('obj2', { inline: true })}</li><li>${field('obj3', { inline: true })}</li></ol>${ctx.editable ? `<p class="fill-help">${esc(S.hints.obj2 || '')}</p>` : ''}`),

      page(5, 'p5', '03 Metodología de diagnóstico', `<table class="grid"><thead><tr><th>Paso</th><th>Qué se hizo</th><th>Evidencia</th></tr></thead><tbody>${S.methodology.map((row, index) => `<tr><td>${index + 1}</td><td>${esc(row[0])}</td><td>${esc(row[1])}</td></tr>`).join('')}</tbody></table><h2 class="sec-title">04 Criterios de evaluación</h2><table class="grid"><thead><tr><th>Tema</th><th>Documento</th><th>Qué exige para este caso</th></tr></thead><tbody>${S.criteria.map(row => `<tr><td>${esc(row[0])}</td><td>${row[1]}</td><td>${esc(row[2])}</td></tr>`).join('')}</tbody></table>`),

      page(6, 'p6', '05 Mediciones y registros', `<table class="kv ficha"><tbody>${tableRows(measurements)}</tbody></table><h3>Registro técnico</h3><div class="scroll-x"><table class="grid catastro"><thead><tr>${S.registerHeaders.map(header => `<th>${esc(header)}</th>`).join('')}</tr></thead><tbody>${S.registerRows.map(row => `<tr>${row.map(cell => `<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`),

      page(7, 'p7', '06 Esquema técnico del diagnóstico', `<div class="croquis-wrap plano-wrap">${S.diagram}<div class="legend"><p><b>Cómo leerlo</b></p><p class="note">${esc(S.diagramNote)}</p><ul>${list(S.diagramLegend.map(item => esc(item)))}</ul></div></div>`),

      page(8, 'p8', '07 Registro fotográfico', `<p class="note">Una fotografía ubica el componente; la medición, la bitácora y el criterio permiten demostrar su estado.</p><div class="photos">${photoCard(S.photos[0], esc(S.photos[0].caption), A)}${photoCard(S.photos[1], field('f2Desc', { label: 'Descripción técnica de la Foto 2' }), A)}</div>`),

      page(9, 'p9', '07 Registro fotográfico (continuación)', `<div class="photos one-photo">${photoCard(S.photos[2], field('f3Desc', { label: 'Descripción técnica de la Foto 3' }), A)}</div><h3>${esc(S.extraRegisterTitle)}</h3><table class="grid"><tbody>${S.extraRegister.map(row => `<tr><th>${esc(row[0])}</th><td>${renderValue(row[1], field)}</td></tr>`).join('')}</tbody></table>`),

      page(10, 'p10', '08 Hallazgos', `<p class="note">El Hallazgo 1 está resuelto. Úsalo como modelo: evidencia, condición, criterio, efecto y una recomendación que pueda comprobarse.</p><section class="hz"><header><span class="hz-n">Hallazgo 1</span><span class="hz-t">${esc(S.modelFinding.title)}</span><span class="risk alto">${esc(S.modelFinding.risk)}</span></header><table class="kv hz-kv"><tbody>${findingRows(S.modelFinding.rows.map(row => [row[0], esc(row[1])]))}</tbody></table></section><div class="howto"><p><b>Cinco preguntas</b></p><ul><li><b>Condición:</b> ¿qué ocurre?</li><li><b>Criterio:</b> ¿qué debería ocurrir?</li><li><b>Causa:</b> ¿por qué ocurrió? Solo si la evidencia lo permite.</li><li><b>Efecto:</b> ¿qué consecuencia produce?</li><li><b>Recomendación:</b> ¿qué se hará y cómo se comprobará?</li></ul></div>`),

      page(11, 'p11', '08 Hallazgos (continuación)', `<section class="hz"><header><span class="hz-n">Hallazgo 2</span><span class="hz-t">${esc(S.finding2.title)}</span>${ctx.editable ? '' : `<span class="risk">${esc(ctx.answers.h2Riesgo || 'Sin nivel')}</span>`}</header><table class="kv hz-kv"><tbody>${findingRows(finding2Rows)}</tbody></table></section><section class="hz"><header><span class="hz-n">Hallazgo 3</span><span class="hz-t">${ctx.editable ? esc(S.finding3Prompt) : esc(ctx.answers.h3Titulo || 'Sin título')}</span>${ctx.editable ? '' : `<span class="risk">${esc(ctx.answers.h3Riesgo || 'Sin nivel')}</span>`}</header><table class="kv hz-kv"><tbody>${findingRows(finding3Rows)}</tbody></table></section>`),

      page(12, 'p12', '09 Conclusión', `${field('conclusion')}<h3>Comprobaciones posteriores</h3><ul class="confirm">${list(S.followUp.map(item => esc(item)))}</ul><h3>Firmas</h3><div class="signs"><div><p class="sign-line">${name}</p><p>${esc(role)}<br>${bind('especialidad', 'Especialidad')} · ${esc(ctx.student.curso || '')}</p></div><div><p class="sign-line">&nbsp;</p><p>Revisión<br>Docente de Lengua y Literatura</p></div></div>${field('declaracion', { label: 'Confirmación final' })}<h3>Anexo · Fuentes y documentos</h3><ul class="sources">${S.sources.map(source => `<li>${source}</li>`).join('')}</ul><p class="note">${esc(S.finalNote)}</p>`)
    ];
    container.innerHTML = pages.join('');
    refreshBindings(container, ctx.answers);
    return ctx;
  }

  function refreshBindings(container, answers) {
    container.querySelectorAll('[data-bind]').forEach(node => {
      const raw = answers[node.dataset.bind];
      let value = raw ? String(raw) : node.dataset.empty;
      if (raw && node.dataset.bind === 'emision') {
        const [year, month, day] = raw.split('-');
        value = `${day}-${month}-${year}`;
      }
      node.textContent = value;
    });
  }

  window.InformeTecnico = { render, refreshBindings, LIBRETA: S.notebook, HINTS: S.hints, TOTAL_PAGES };
})();
