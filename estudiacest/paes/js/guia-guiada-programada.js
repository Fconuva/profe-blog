(async function loadScheduledGuidedGuide() {
  'use strict';

  const guideId = String(window.GUIDED_GUIDE_ID || '').trim();
  const $ = (id) => document.getElementById(id);

  function fail(message) {
    const loading = $('guideLoading');
    if (loading) {
      loading.classList.add('loading-error');
      loading.textContent = message;
    }
  }

  function appendTextWithMarks(host, text, terms) {
    const safeTerms = (terms || []).filter(Boolean).sort((a, b) => b.length - a.length);
    if (!safeTerms.length) {
      host.textContent = text;
      return;
    }
    const escaped = safeTerms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const matcher = new RegExp(`(${escaped.join('|')})`, 'gi');
    const exact = new Set(safeTerms.map((term) => term.toLocaleLowerCase('es')));
    text.split(matcher).filter(Boolean).forEach((part) => {
      if (exact.has(part.toLocaleLowerCase('es'))) {
        const mark = document.createElement('mark');
        mark.className = 'signal';
        mark.textContent = part;
        host.appendChild(mark);
      } else {
        host.appendChild(document.createTextNode(part));
      }
    });
  }

  function renderSteps(steps) {
    const host = $('routeSteps');
    host.innerHTML = '';
    steps.forEach((step, index) => {
      const item = document.createElement('div');
      item.className = 'route-step';
      const number = document.createElement('span');
      number.className = 'number';
      number.textContent = String(index + 1);
      const title = document.createElement('strong');
      title.textContent = step.title;
      const text = document.createElement('span');
      text.textContent = step.text;
      item.append(number, title, text);
      host.appendChild(item);
    });
  }

  function renderGlossary(items) {
    const host = $('guideGlossary');
    host.innerHTML = '';
    items.forEach((item) => {
      const row = document.createElement('div');
      const term = document.createElement('strong');
      term.textContent = `${item.term}: `;
      row.append(term, document.createTextNode(item.definition));
      host.appendChild(row);
    });
  }

  function renderVisual(visual) {
    const image = $('guideVisual');
    image.src = visual.src;
    image.alt = visual.alt;
    $('visualCaption').textContent = visual.caption;
    const legend = $('visualLegend');
    legend.innerHTML = '';
    visual.legend.forEach((label) => {
      const chip = document.createElement('span');
      chip.textContent = label;
      legend.appendChild(chip);
    });
  }

  function renderDataPanel(panel) {
    const section = $('dataPanel');
    if (!panel) {
      section.hidden = true;
      return;
    }
    section.hidden = false;
    $('dataPanelTitle').textContent = panel.title;
    const table = $('dataTable');
    table.innerHTML = '';
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    panel.columns.forEach((column) => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = column;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    const tbody = document.createElement('tbody');
    panel.rows.forEach((values) => {
      const row = document.createElement('tr');
      values.forEach((value, index) => {
        const cell = document.createElement(index === 0 ? 'th' : 'td');
        if (index === 0) cell.scope = 'row';
        cell.textContent = value;
        row.appendChild(cell);
      });
      tbody.appendChild(row);
    });
    table.append(thead, tbody);
    const notes = $('dataNotes');
    notes.innerHTML = '';
    panel.notes.forEach((note) => {
      const item = document.createElement('li');
      item.textContent = note;
      notes.appendChild(item);
    });
  }

  function renderTexts(texts) {
    const host = $('readingsHost');
    host.innerHTML = '';
    texts.forEach((text) => {
      const label = document.createElement('div');
      label.className = 'reading-label';
      const labelStrong = document.createElement('strong');
      labelStrong.textContent = text.label;
      const type = document.createElement('span');
      type.textContent = text.type;
      label.append(labelStrong, type);

      const article = document.createElement('article');
      article.className = 'reading';
      const title = document.createElement('h2');
      title.textContent = text.title;
      const readingType = document.createElement('div');
      readingType.className = 'reading-type';
      readingType.textContent = text.type;
      article.append(title, readingType);
      text.paragraphs.forEach((paragraph, index) => {
        const block = document.createElement('div');
        block.className = 'paragraph';
        const number = document.createElement('span');
        number.className = 'paragraph-number';
        number.textContent = String(index + 1);
        const body = document.createElement('p');
        appendTextWithMarks(body, paragraph, text.focusWords);
        block.append(number, body);
        article.appendChild(block);
      });
      const source = document.createElement('p');
      source.className = 'source';
      source.textContent = 'Texto original elaborado para esta ruta de trabajo.';
      article.appendChild(source);
      host.append(label, article);
    });
  }

  function startSharedFlow(config) {
    window.GUIDED_GUIDE_CONFIG = {
      guideId,
      questions: config.questions,
      respectGuideLock: true
    };
    const shared = document.createElement('script');
    shared.src = 'js/guia-guiada.js';
    shared.addEventListener('error', () => fail('No fue posible iniciar la guía. Vuelve al portal e inténtalo nuevamente.'));
    document.body.appendChild(shared);
  }

  try {
    if (!/^(?:2[0-9]|3[01])$/.test(guideId)) throw new Error('Identificador de guía inválido.');
    const response = await fetch('data/guias-guiadas-20-31.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('No fue posible cargar el material.');
    const catalog = await response.json();
    const config = catalog.guides && catalog.guides[guideId];
    if (!config) throw new Error('La guía solicitada no está disponible.');

    document.title = `Guía ${guideId} · Ruta guiada | Estudia CEST PAES`;
    document.querySelector('meta[name="description"]').content = config.summary;
    document.querySelectorAll('[data-guide-number]').forEach((node) => { node.textContent = guideId; });
    $('guideEyebrow').textContent = `Guía ${guideId} · Ruta guiada`;
    $('guideTitle').textContent = config.title;
    $('guideSummary').textContent = config.summary;
    $('guideObjective').textContent = config.objective;
    $('guideDate').textContent = config.date;
    $('submitGuide').textContent = `Entregar Guía ${guideId}`;
    $('dialogText').textContent = `La Guía ${guideId} quedó registrada. Ya puedes volver al portal PAES.`;

    renderSteps(config.steps);
    renderGlossary(config.glossary);
    renderVisual(config.visual);
    renderDataPanel(config.dataPanel);
    renderTexts(config.texts);
    $('guideLoading').hidden = true;
    $('guideContent').hidden = false;
    startSharedFlow(config);
  } catch (error) {
    fail(error.message || 'No fue posible cargar la guía.');
  }
}());
