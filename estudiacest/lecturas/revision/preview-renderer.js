(function() {
  'use strict';

  const config = window.LECTURAS_PREVIEW_CONFIG || {};

  function htmlEscape(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function slugify(text) {
    return String(text || '').replace(/[^a-zA-Z0-9_-]/g, '_');
  }

  function getType(item) {
    return (item.tipo || item.type || 'seleccion_multiple').toLowerCase();
  }

  function getPoints(item) {
    const raw = Number(item && (item.puntaje ?? item.points ?? 1));
    return Number.isFinite(raw) && raw > 0 ? raw : 1;
  }

  function formatPoints(points) {
    return points === 1 ? '1 pt' : points + ' pts';
  }

  function normalizeContent(content) {
    return {
      materials: (content && (content.materiales || content.textos)) || [],
      items: (content && (content.items || content.preguntas)) || []
    };
  }

  function normalizeParagraphs(material) {
    if (Array.isArray(material.parrafos)) return material.parrafos;
    if (Array.isArray(material.fragmentos)) return material.fragmentos;
    if (material.texto) return [material.texto];
    return [];
  }

  function normalizeOptions(item) {
    if (!Array.isArray(item.opciones)) return [];
    return item.opciones.map(function(option, index) {
      if (typeof option === 'string') {
        return { letra: String.fromCharCode(65 + index), texto: option };
      }
      return {
        letra: option.letra || option.id || String.fromCharCode(65 + index),
        texto: option.texto || option.label || option.valor || ''
      };
    });
  }

  function normalizeSide(list) {
    if (!Array.isArray(list)) return [];
    return list.map(function(entry, index) {
      if (typeof entry === 'string') return { id: 'entry_' + index, texto: entry };
      return { id: entry.id || 'entry_' + index, texto: entry.texto || entry.label || entry.valor || '' };
    });
  }

  function renderMaterial(material) {
    const paragraphs = normalizeParagraphs(material);
    const images = material.imagenes || material.images || [];
    let html = '<section class="material-card" id="material-' + slugify(material.id || material.titulo || 'material') + '">';
    html += '<div class="eyebrow">' + htmlEscape(material.subtipo || material.tipo || 'Material') + '</div>';
    html += '<h2>' + htmlEscape(material.titulo || 'Material sin título') + '</h2>';
    if (material.descripcion) html += '<p class="description">' + htmlEscape(material.descripcion) + '</p>';
    paragraphs.forEach(function(paragraph) {
      if (typeof paragraph === 'string') {
        html += '<p>' + htmlEscape(paragraph) + '</p>';
      } else if (paragraph && typeof paragraph === 'object') {
        if (paragraph.html) html += paragraph.html;
        else html += '<p>' + htmlEscape(paragraph.texto || paragraph.text || '') + '</p>';
      }
    });
    images.forEach(function(image) {
      if (typeof image === 'string') {
        html += '<figure><img src="' + htmlEscape(image) + '" alt="Imagen de apoyo"></figure>';
        return;
      }
      if (!image || !image.src) return;
      html += '<figure><img src="' + htmlEscape(image.src) + '" alt="' + htmlEscape(image.alt || 'Imagen de apoyo') + '">';
      if (image.caption) html += '<figcaption>' + htmlEscape(image.caption) + '</figcaption>';
      html += '</figure>';
    });
    if (material.fuente) html += '<div class="source"><strong>Fuente:</strong> ' + htmlEscape(material.fuente) + '</div>';
    html += '</section>';
    return html;
  }

  function renderCorrectAnswer(item) {
    const type = getType(item);
    const expected = item.correcta ?? item.correct ?? item.respuesta_correcta ?? item.solucion;
    if (expected == null) return '';
    if (type === 'ordenamiento' || type === 'ordering' || type === 'puzzle') {
      if (!Array.isArray(expected)) return '';
      return '<div class="correct-answer"><strong>Orden esperado:</strong> ' + expected.map(htmlEscape).join(' → ') + '</div>';
    }
    if (type === 'pareados' || type === 'matching') {
      const left = normalizeSide(item.izquierda || item.left || []);
      const right = normalizeSide(item.derecha || item.right || []);
      if (!expected || typeof expected !== 'object') return '';
      const rows = Object.keys(expected).map(function(key) {
        const leftEntry = left.find(function(entry) { return entry.id === key; });
        const rightEntry = right.find(function(entry) { return entry.id === expected[key]; });
        return '<div class="mapping-row"><strong>' + htmlEscape(leftEntry ? leftEntry.texto : key) + '</strong><span class="mapping-arrow">→</span><span>' + htmlEscape(rightEntry ? rightEntry.texto : expected[key]) + '</span></div>';
      }).join('');
      return '<div class="correct-answer"><strong>Relaciones esperadas</strong><div class="mapping-list">' + rows + '</div></div>';
    }
    return '<div class="correct-answer"><strong>Clave docente:</strong> ' + htmlEscape(expected) + '</div>';
  }

  function renderItem(item, index) {
    const type = getType(item);
    const options = normalizeOptions(item);
    let body = '';

    if (type === 'seleccion_multiple' || type === 'multiple_choice' || type === 'verdadero_falso' || type === 'true_false') {
      body = '<div class="option-list">' + options.map(function(option) {
        const isCorrect = String(option.letra) === String(item.correcta ?? item.correct ?? item.respuesta_correcta ?? '');
        return '<div class="option' + (isCorrect ? ' correct' : '') + '"><div class="row"><span class="letter">' + htmlEscape(option.letra) + '</span><span>' + htmlEscape(option.texto) + '</span></div></div>';
      }).join('') + '</div>';
    } else if (type === 'ordenamiento' || type === 'ordering' || type === 'puzzle') {
      const entries = normalizeSide(item.elementos || item.items || []);
      body = '<div class="mapping-list">' + entries.map(function(entry, entryIndex) {
        return '<div class="mapping-row"><strong>' + (entryIndex + 1) + '.</strong><span>' + htmlEscape(entry.texto) + '</span><span class="mapping-arrow">ordenable</span></div>';
      }).join('') + '</div>';
    } else if (type === 'pareados' || type === 'matching') {
      const left = normalizeSide(item.izquierda || item.left || []);
      const right = normalizeSide(item.derecha || item.right || []);
      body = '<div class="mapping-list">' + left.map(function(entry) {
        return '<div class="mapping-row"><strong>' + htmlEscape(entry.texto) + '</strong><span class="mapping-arrow">↔</span><span>Relacionar con una opción</span></div>';
      }).join('') + '</div>';
      if (right.length) {
        body += '<div class="mapping-list">' + right.map(function(entry, entryIndex) {
          return '<div class="resource-chip"><span><strong>' + htmlEscape(String.fromCharCode(65 + entryIndex)) + '.</strong> ' + htmlEscape(entry.texto) + '</span><span>opción</span></div>';
        }).join('') + '</div>';
      }
    } else {
      body = '<div class="notice"><p>Ítem abierto o de desarrollo. Se muestra aquí completo para revisión docente.</p></div>';
    }

    if (Array.isArray(item.criterios) && item.criterios.length) {
      body += '<div class="criteria-list">' + item.criterios.map(function(criteria) {
        return '<div class="resource-chip"><span>' + htmlEscape(criteria) + '</span><span>criterio</span></div>';
      }).join('') + '</div>';
    }

    let html = '<section class="item-card" id="item-' + slugify(item.id || ('item_' + index)) + '">';
    html += '<div class="eyebrow">Ítem ' + (index + 1) + '</div>';
    html += '<div class="item-head"><h3>' + htmlEscape(item.enunciado || 'Ítem sin enunciado') + '</h3><div class="tags"><span class="tag">' + htmlEscape(item.habilidad || 'Lectura') + '</span><span class="tag type">' + htmlEscape(type) + '</span><span class="tag score">' + htmlEscape(formatPoints(getPoints(item))) + '</span></div></div>';
    if (item.materialRef) html += '<p class="description"><strong>Material asociado:</strong> ' + htmlEscape(item.materialRef) + '</p>';
    html += body;
    html += renderCorrectAnswer(item);
    if (item.reformulacion_simple) html += '<div class="simple-prompt"><strong>Versión simplificada:</strong> ' + htmlEscape(item.reformulacion_simple) + '</div>';
    html += '</section>';
    return html;
  }

  function renderSidebar(materials, items, mount) {
    const materialList = materials.map(function(material, index) {
      return '<div class="resource-chip"><span><strong>M' + (index + 1) + '.</strong> ' + htmlEscape(material.titulo || material.id || 'Material') + '</span><span>' + htmlEscape(material.id || 'sin-id') + '</span></div>';
    }).join('');
    const itemList = items.map(function(item, index) {
      const shortText = (item.enunciado || 'Ítem').slice(0, 74);
      return '<a href="#item-' + slugify(item.id || ('item_' + index)) + '"><strong>' + (index + 1) + '.</strong> ' + htmlEscape(shortText) + '</a>';
    }).join('');
    mount.innerHTML = '<div class="panel"><h2>Revisión rápida</h2><p>Vista continua de la prueba completa para correcciones docentes antes de publicar o reseedear.</p></div><div class="panel"><h3>Materiales</h3><div class="resource-list">' + materialList + '</div></div><div class="panel"><h3>Preguntas</h3><div class="toc">' + itemList + '</div></div>';
  }

  function renderSummary(materials, items, mount, meta) {
    const totalPoints = items.reduce(function(sum, item) { return sum + getPoints(item); }, 0);
    const itemTypes = new Set(items.map(getType));
    const profile = meta && meta.perfil ? meta.perfil : (config.profile || 'Revisión');
    mount.innerHTML = '<div class="summary-card"><div class="label">Perfil</div><div class="value">' + htmlEscape(profile) + '</div></div>'
      + '<div class="summary-card"><div class="label">Materiales</div><div class="value">' + materials.length + '</div></div>'
      + '<div class="summary-card"><div class="label">Ítems</div><div class="value">' + items.length + '</div></div>'
      + '<div class="summary-card"><div class="label">Puntaje</div><div class="value">' + totalPoints + '</div></div>'
      + '<div class="summary-card"><div class="label">Tipos</div><div class="value">' + itemTypes.size + '</div></div>';
  }

  async function init() {
    const shell = document.getElementById('previewShell');
    const sidebar = document.getElementById('previewSidebar');
    const summary = document.getElementById('previewSummary');
    const title = document.getElementById('previewTitle');
    const subtitle = document.getElementById('previewSubtitle');
    const sourcePath = document.getElementById('previewSourcePath');

    title.textContent = config.title || 'Vista de revisión';
    subtitle.textContent = config.subtitle || 'Prueba completa para revisión docente';
    sourcePath.textContent = config.jsonPath || 'Sin origen';

    try {
      const response = await fetch(config.jsonPath, { cache: 'no-store' });
      if (!response.ok) throw new Error('No se pudo cargar el JSON');
      const data = await response.json();
      const normalized = normalizeContent(data);
      renderSummary(normalized.materials, normalized.items, summary, data.meta || {});
      renderSidebar(normalized.materials, normalized.items, sidebar);

      let html = '';
      normalized.materials.forEach(function(material) {
        html += renderMaterial(material);
      });
      normalized.items.forEach(function(item, index) {
        html += renderItem(item, index);
      });
      shell.innerHTML = html;
    } catch (error) {
      console.error('[lecturas/revision]', error);
      shell.innerHTML = '<section class="notice"><p>No se pudo cargar esta vista de revisión. Verifica la ruta del JSON.</p></section>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();