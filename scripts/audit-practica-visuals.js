'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const BANK_DIR = path.join(ROOT, 'js', 'practica');
const MAX_IMAGE_BYTES = 250 * 1024;
const errors = [];
const totals = { bancos: 0, preguntas: 0, svg: 0, imagen: 0, formula: 0, latex: 0 };

function fail(bank, q, message) {
  errors.push(`${bank} · n${q && q.n ? q.n : '?'}: ${message}`);
}

function loadBank(file) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
  return context.window.PRUEBA;
}

for (const filename of fs.readdirSync(BANK_DIR).filter((name) => name.endsWith('.js')).sort()) {
  const bank = filename.replace(/\.js$/, '');
  const prueba = loadBank(path.join(BANK_DIR, filename));
  const questions = prueba && Array.isArray(prueba.preguntas) ? prueba.preguntas : [];
  totals.bancos += 1;
  totals.preguntas += questions.length;

  if (questions.length !== 60) fail(bank, null, `se esperaban 60 preguntas y hay ${questions.length}`);
  const claves = questions.reduce((acc, q) => {
    if (Object.prototype.hasOwnProperty.call(acc, q.correcta)) acc[q.correcta] += 1;
    return acc;
  }, { A: 0, B: 0, C: 0, D: 0 });
  if (Object.values(claves).some((cantidad) => cantidad !== 15)) {
    fail(bank, null, `distribución de claves distinta de 15/15/15/15: ${JSON.stringify(claves)}`);
  }

  questions.forEach((q, index) => {
    if (q.n !== index + 1) fail(bank, q, `numeración fuera de secuencia en la posición ${index + 1}`);
    if (!Array.isArray(q.alternativas) || q.alternativas.length !== 4) fail(bank, q, 'no tiene cuatro alternativas');
    if (!['A', 'B', 'C', 'D'].includes(q.correcta)) fail(bank, q, `clave inválida: ${q.correcta}`);

    const visualTypes = [q.svg && 'svg', q.imagen && 'imagen', q.formula && 'formula'].filter(Boolean);
    if (visualTypes.length > 1) fail(bank, q, `combina tipos visuales incompatibles: ${visualTypes.join(', ')}`);

    if (q.svg) {
      totals.svg += 1;
      if (!/<svg\b/i.test(q.svg)) fail(bank, q, 'el campo svg no contiene una raíz <svg>');
      if (!/role=(['"])img\1/i.test(q.svg)) fail(bank, q, 'el SVG no declara role="img"');
      if (!/aria-label=(['"])[^'"]+\1/i.test(q.svg)) fail(bank, q, 'el SVG no tiene aria-label útil');
    }

    if (q.imagen) {
      totals.imagen += 1;
      if (!q.alt || !String(q.alt).trim()) fail(bank, q, 'la imagen no tiene alt');
      if (!q.imagen.startsWith('/')) fail(bank, q, `la ruta de imagen no es absoluta: ${q.imagen}`);
      const localPath = path.join(ROOT, q.imagen.replace(/^\/+/, ''));
      if (!fs.existsSync(localPath)) fail(bank, q, `no existe el archivo ${q.imagen}`);
      else if (fs.statSync(localPath).size > MAX_IMAGE_BYTES) {
        fail(bank, q, `la imagen pesa ${fs.statSync(localPath).size} bytes; máximo ${MAX_IMAGE_BYTES}`);
      }
    }

    if (q.formula) {
      totals.formula += 1;
      if (!q.alt || !String(q.alt).trim()) fail(bank, q, 'la fórmula no tiene descripción alt');
      if (!String(q.formula).trim()) fail(bank, q, 'el campo formula está vacío');
    }

    if (q.latex) {
      totals.latex += 1;
      const visibleText = [q.textoBase, q.enunciado].concat(q.alternativas || []).filter(Boolean).join('\n');
      Object.entries(q.latex).forEach(([plain, tex]) => {
        if (!plain || !visibleText.includes(plain)) fail(bank, q, `el fragmento LaTeX no aparece en el ítem: ${JSON.stringify(plain)}`);
        if (!tex || !String(tex).trim()) fail(bank, q, `LaTeX vacío para ${JSON.stringify(plain)}`);
      });
    }
  });
}

console.log(JSON.stringify(totals, null, 2));
if (errors.length) {
  console.error(`\n${errors.length} hallazgo(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log('\nAuditoría visual ECEP sin hallazgos.');
}
