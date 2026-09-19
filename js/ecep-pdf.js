/* ECEP · versión unificada, ordenada e imprimible de cada dossier. */
(function () {
  'use strict';

  var PDF_QUERY = 'formato';
  var PDF_VALUE = 'pdf';

  function pdfUrl(href) {
    var url = new URL(href, window.location.href);
    url.searchParams.set(PDF_QUERY, PDF_VALUE);
    url.hash = '';
    return url.href;
  }

  function readableText(node, separator) {
    if (!node) return '';
    var clone = node.cloneNode(true);
    Array.prototype.slice.call(clone.querySelectorAll('br')).forEach(function (br) {
      br.replaceWith(document.createTextNode(separator || ' · '));
    });
    return clone.textContent.replace(/\s+/g, ' ').trim();
  }

  function isStudyDossierUrl(href) {
    try {
      var url = new URL(href, window.location.href);
      return url.origin === window.location.origin &&
        /\/evaluaciones\/[^?#]*\/estudio\//.test(url.pathname) &&
        !/\/prueba\//.test(url.pathname);
    } catch (_) {
      return false;
    }
  }

  function enhanceDashboard() {
    var tiles = Array.prototype.slice.call(document.querySelectorAll('a.ecp-tile.link[href]'))
      .filter(function (tile) { return isStudyDossierUrl(tile.href); });

    tiles.forEach(function (tile) {
      if (tile.parentElement && tile.parentElement.classList.contains('ecep-pdf-tile-wrap')) return;
      var title = (tile.querySelector('h3') || {}).textContent || 'este dossier';
      var wrap = document.createElement('div');
      wrap.className = 'ecep-pdf-tile-wrap';
      tile.parentNode.insertBefore(wrap, tile);
      wrap.appendChild(tile);

      var link = document.createElement('a');
      link.className = 'ecep-pdf-tile-link';
      link.href = pdfUrl(tile.href);
      link.target = '_blank';
      link.rel = 'noopener';
      link.setAttribute('aria-label', 'Abrir versión PDF de ' + title.trim());
      link.innerHTML = '<i class="bi bi-file-earmark-pdf-fill" aria-hidden="true"></i> PDF';
      wrap.appendChild(link);
    });
  }

  function dossierChapterLinks() {
    var base = new URL('.', window.location.href);
    var seen = {};
    return Array.prototype.slice.call(document.querySelectorAll('.ec .ec-navcard[href]'))
      .map(function (link) {
        var url = new URL(link.getAttribute('href'), base);
        return { url: url, label: ((link.querySelector('b') || link).textContent || '').trim() };
      })
      .filter(function (item) {
        var sameFolder = item.url.origin === window.location.origin && item.url.pathname.indexOf(base.pathname) === 0;
        var isChapter = sameFolder && item.url.pathname !== base.pathname && !/\/prueba\//.test(item.url.pathname);
        if (!isChapter || seen[item.url.pathname]) return false;
        seen[item.url.pathname] = true;
        return true;
      });
  }

  function enhanceDossierIndex() {
    var links = dossierChapterLinks();
    if (!links.length) return;
    var meta = document.querySelector('.ec > .ec-hero .meta');
    if (!meta || meta.querySelector('.ecep-pdf-index-link')) return;
    var link = document.createElement('a');
    link.className = 'ecep-pdf-index-link';
    link.href = pdfUrl(window.location.href);
    link.target = '_blank';
    link.rel = 'noopener';
    link.innerHTML = '<i class="bi bi-file-earmark-pdf-fill" aria-hidden="true"></i> Abrir versión PDF completa';
    meta.appendChild(link);
  }

  function absoluteResourceUrls(root, pageUrl) {
    ['src', 'poster', 'href'].forEach(function (attr) {
      Array.prototype.slice.call(root.querySelectorAll('[' + attr + ']')).forEach(function (node) {
        var value = node.getAttribute(attr);
        if (!value || value.charAt(0) === '#' || /^(data:|mailto:|tel:|javascript:)/i.test(value)) return;
        try { node.setAttribute(attr, new URL(value, pageUrl).href); } catch (_) {}
      });
    });
    Array.prototype.slice.call(root.querySelectorAll('[srcset]')).forEach(function (node) {
      var value = node.getAttribute('srcset');
      if (!value) return;
      var normalized = value.split(',').map(function (part) {
        var bits = part.trim().split(/\s+/);
        try { bits[0] = new URL(bits[0], pageUrl).href; } catch (_) {}
        return bits.join(' ');
      }).join(', ');
      node.setAttribute('srcset', normalized);
    });
    Array.prototype.slice.call(root.querySelectorAll('img[loading]')).forEach(function (image) {
      image.removeAttribute('loading');
    });
  }

  function cleanChapter(documentNode, pageUrl, number, fallbackLabel) {
    var source = documentNode.querySelector('.ec');
    if (!source) throw new Error('El capítulo no contiene la estructura del dossier.');
    var clone = source.cloneNode(true);
    absoluteResourceUrls(clone, pageUrl);

    Array.prototype.slice.call(clone.querySelectorAll(
      '.ec-toc, .ec-foot, .ec-progress, .ec-cta-portafolio, .ecep-watermark, script, style, button.reveal, .ec-done, .ec-caso-hint, .veredicto'
    )).forEach(function (node) { node.remove(); });
    Array.prototype.slice.call(clone.querySelectorAll('.ec-check, .ec-caso')).forEach(function (node) {
      node.classList.add('open');
    });

    var hero = clone.querySelector('.ec-hero');
    var titleNode = hero && hero.querySelector('h1');
    var ledeNode = hero && hero.querySelector('p');
    var chapter = document.createElement('article');
    chapter.className = 'ecep-pdf-chapter';

    var head = document.createElement('header');
    head.className = 'ecep-pdf-chapter-head';
    var badge = document.createElement('span');
    badge.className = 'number';
    badge.textContent = 'Capítulo ' + number;
    var title = document.createElement('h2');
    title.textContent = titleNode ? readableText(titleNode) : fallbackLabel || ('Capítulo ' + number);
    head.appendChild(badge);
    head.appendChild(title);
    if (ledeNode) {
      var lede = document.createElement('p');
      lede.textContent = readableText(ledeNode, ' ');
      head.appendChild(lede);
    }
    chapter.appendChild(head);

    Array.prototype.slice.call(clone.querySelectorAll(':scope > .ec-section')).forEach(function (section) {
      chapter.appendChild(section);
    });
    return chapter;
  }

  function makeCover(chapters) {
    var sourceHero = document.querySelector('.ec > .ec-hero');
    var sourceTitle = sourceHero && sourceHero.querySelector('h1');
    var sourceLede = sourceHero && sourceHero.querySelector('p');
    var cover = document.createElement('section');
    cover.className = 'ecep-pdf-cover';

    var brand = document.createElement('p');
    brand.className = 'brand';
    brand.textContent = 'Preparación ECEP · Prof. Francisco';
    var title = document.createElement('h1');
    title.textContent = sourceTitle ? readableText(sourceTitle) : document.title;
    var lede = document.createElement('p');
    lede.className = 'lede';
    lede.textContent = readableText(sourceLede, ' ');
    var edition = document.createElement('p');
    edition.className = 'edition';
    edition.textContent = 'Temario 2026 · Versión completa para lectura e impresión';
    var contents = document.createElement('div');
    contents.className = 'contents';
    contents.innerHTML = '<h2>Contenido</h2>';
    var list = document.createElement('ol');
    chapters.forEach(function (chapter) {
      var item = document.createElement('li');
      item.textContent = chapter.label;
      list.appendChild(item);
    });
    contents.appendChild(list);
    cover.appendChild(brand);
    cover.appendChild(title);
    cover.appendChild(lede);
    cover.appendChild(edition);
    cover.appendChild(contents);
    return cover;
  }

  function showStatus(title, message, value, max) {
    var status = document.getElementById('ecepPdfStatus');
    if (!status) {
      status = document.createElement('div');
      status.id = 'ecepPdfStatus';
      status.className = 'ecep-pdf-status';
      document.body.appendChild(status);
    }
    status.classList.remove('is-error');
    status.innerHTML = '<h1></h1><p></p><progress></progress>';
    status.querySelector('h1').textContent = title;
    status.querySelector('p').textContent = message;
    var progress = status.querySelector('progress');
    progress.max = max || 1;
    progress.value = value || 0;
    return status;
  }

  function showError(error) {
    var status = showStatus('No se pudo preparar el PDF', error.message || String(error), 0, 1);
    status.classList.add('is-error');
    var progress = status.querySelector('progress');
    if (progress) progress.remove();
    var retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = 'Reintentar';
    retry.addEventListener('click', function () { window.location.reload(); });
    status.appendChild(retry);
  }

  function waitForImages(root) {
    var images = Array.prototype.slice.call(root.querySelectorAll('img'));
    return Promise.all(images.map(function (image) {
      if (image.complete) return Promise.resolve();
      return new Promise(function (resolve) {
        var timer = window.setTimeout(resolve, 12000);
        function done() { window.clearTimeout(timer); resolve(); }
        image.addEventListener('load', done, { once: true });
        image.addEventListener('error', done, { once: true });
      });
    }));
  }

  function removeBrokenImages(root) {
    Array.prototype.slice.call(root.querySelectorAll('img')).forEach(function (image) {
      if (image.naturalWidth > 0) return;
      var figure = image.closest('figure');
      (figure || image).remove();
    });
  }

  async function buildPrintableDossier() {
    var chapters = dossierChapterLinks();
    if (!chapters.length) throw new Error('No se encontraron capítulos para este dossier.');
    document.body.classList.add('ecep-pdf-view');
    document.documentElement.classList.remove('ecep-protected');
    document.body.classList.remove('ecep-noselect');
    showStatus('Preparando el dossier completo', 'Reuniendo portada y capítulos en orden…', 0, chapters.length);

    var parsed = [];
    for (var i = 0; i < chapters.length; i += 1) {
      showStatus('Preparando el dossier completo', 'Cargando ' + (i + 1) + ' de ' + chapters.length + ': ' + chapters[i].label, i, chapters.length);
      var response = await fetch(chapters[i].url.href, { credentials: 'same-origin' });
      if (!response.ok) throw new Error('No fue posible cargar “' + chapters[i].label + '” (HTTP ' + response.status + ').');
      var html = await response.text();
      parsed.push(new DOMParser().parseFromString(html, 'text/html'));
    }

    var status = document.getElementById('ecepPdfStatus');
    if (status) status.remove();
    var toolbar = document.createElement('div');
    toolbar.className = 'ecep-pdf-toolbar';
    toolbar.innerHTML = '<span class="label">Dossier completo · A4</span>' +
      '<button type="button"><i class="bi bi-printer-fill" aria-hidden="true"></i> Imprimir / guardar PDF</button>' +
      '<a href="' + new URL('.', window.location.href).href + '"><i class="bi bi-arrow-left" aria-hidden="true"></i> Volver al dossier</a>';
    toolbar.querySelector('button').addEventListener('click', function () { window.print(); });

    var watermark = document.createElement('div');
    watermark.className = 'ecep-pdf-watermark';
    watermark.setAttribute('aria-hidden', 'true');
    watermark.innerHTML = '<span>profefranciscopancho.com · ECEP</span>';

    var documentShell = document.createElement('div');
    documentShell.className = 'ecep-pdf-document';
    var ec = document.querySelector('.ec');
    var printable = document.createElement('div');
    printable.className = ec ? ec.className : 'ec dom-ecep';
    printable.appendChild(makeCover(chapters));
    parsed.forEach(function (doc, index) {
      printable.appendChild(cleanChapter(doc, chapters[index].url.href, index + 1, chapters[index].label));
    });
    documentShell.appendChild(printable);
    document.body.appendChild(toolbar);
    document.body.appendChild(watermark);
    document.body.appendChild(documentShell);
    document.title = 'PDF · ' + (document.querySelector('.ecep-pdf-cover h1') || {}).textContent;

    await waitForImages(documentShell);
    removeBrokenImages(documentShell);
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      try { await window.MathJax.typesetPromise([documentShell]); } catch (_) {}
    }
    document.body.classList.add('ecep-pdf-ready');
  }

  function init() {
    var isPdf = new URLSearchParams(window.location.search).get(PDF_QUERY) === PDF_VALUE;
    var indexHasChapters = dossierChapterLinks().length > 0;
    if (isPdf && indexHasChapters) {
      buildPrintableDossier().catch(showError);
      return;
    }
    enhanceDashboard();
    enhanceDossierIndex();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
