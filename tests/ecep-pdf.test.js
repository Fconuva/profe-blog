const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

function studyLinks(html) {
  return [...html.matchAll(/href="(\/evaluaciones\/[^"?#]*\/estudio\/[^"?#]*)"/g)]
    .map(match => match[1])
    .filter(href => href.endsWith('/'));
}

function chapterLinks(html) {
  return [...html.matchAll(/<a\s+class="[^"]*\bec-navcard\b[^"]*"\s+href="([^"]+)"/g)]
    .map(match => match[1].split(/[?#]/)[0])
    .filter(href => !/^(?:https?:|\/|\.\.)/.test(href) && !href.includes('/prueba/'));
}

test('cada dossier publicado ofrece una versión PDF completa', () => {
  const landing = read('evaluaciones/index.njk');
  const links = [...new Set(studyLinks(landing))];
  assert.ok(links.length >= 39, `Se esperaban al menos 39 dossiers y se encontraron ${links.length}.`);

  for (const url of links) {
    const indexPath = path.join(root, url.replace(/^\//, ''), 'index.njk');
    assert.ok(fs.existsSync(indexPath), `No existe el índice fuente de ${url}.`);
    const chapters = chapterLinks(fs.readFileSync(indexPath, 'utf8'));
    assert.ok(chapters.length >= 3, `${url} no expone al menos tres capítulos imprimibles.`);

    for (const href of chapters) {
      const slug = href.replace(/\/$/, '');
      const flatTemplate = path.join(path.dirname(indexPath), `${slug}.njk`);
      const nestedTemplate = path.join(path.dirname(indexPath), slug, 'index.njk');
      assert.ok(
        fs.existsSync(flatTemplate) || fs.existsSync(nestedTemplate),
        `El capítulo ${href} de ${url} no tiene plantilla fuente.`
      );
    }
  }
});

test('el layout carga la interfaz PDF y conserva contenido seleccionable', () => {
  const layout = read('_includes/layout-evaluaciones.njk');
  const script = read('js/ecep-pdf.js');
  const styles = read('css/ecep-pdf.css');

  assert.match(layout, /\/css\/ecep-pdf\.css\?v=1/);
  assert.match(layout, /\/js\/ecep-pdf\.js\?v=1/);
  assert.match(script, /fetch\(chapters\[i\]\.url\.href/);
  assert.match(script, /window\.print\(\)/);
  assert.match(script, /MathJax\.typesetPromise/);
  assert.match(script, /\.ec-check, \.ec-caso/);
  assert.match(styles, /@page\s*{[\s\S]*size:\s*A4/);
  assert.doesNotMatch(styles, /user-select:\s*none/);
});
