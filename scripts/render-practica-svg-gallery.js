'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const puppeteer = require('puppeteer');
const { pathToFileURL } = require('url');

const ROOT = path.resolve(__dirname, '..');
const BANK_DIR = path.join(ROOT, 'js', 'practica');
const OUTPUT_DIR = process.argv[2] ? path.resolve(process.argv[2]) : path.join(os.tmpdir(), 'ecep-svg-gallery');
const PAGE_SIZE = 12;

function loadBank(file) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
  return context.window.PRUEBA;
}

function esc(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const items = [];
for (const filename of fs.readdirSync(BANK_DIR).filter((name) => name.endsWith('.js')).sort()) {
  const bank = filename.replace(/\.js$/, '');
  const prueba = loadBank(path.join(BANK_DIR, filename));
  for (const question of prueba.preguntas) {
    if (question.svg) items.push({ bank, n: question.n, svg: question.svg });
  }
}

const imageBase = pathToFileURL(path.join(ROOT, 'imagenes') + path.sep).href;
const visualCss = fs.readFileSync(path.join(ROOT, 'css', 'ecep-prueba.css'), 'utf8');

(async () => {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const browser = await puppeteer.launch({ headless: true });
  const files = [];
  try {
    for (let start = 0; start < items.length; start += PAGE_SIZE) {
      const pageItems = items.slice(start, start + PAGE_SIZE);
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 });
      const cards = pageItems.map((item) => `
        <article class="card">
          <header><strong>${esc(item.bank)}</strong><span>n${item.n}</span></header>
          <div class="visual">${item.svg.replace(/href=(['"])\/imagenes\//g, `href=$1${imageBase}`)}</div>
        </article>`).join('');
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
        ${visualCss}
        *{box-sizing:border-box}body{margin:0;padding:24px;background:#e8eff0;color:#0c2127;font:14px Inter,Arial,sans-serif}
        main{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
        .card{min-width:0;background:#fff;border:1px solid #cbd8da;border-radius:16px;padding:12px;box-shadow:0 8px 24px rgba(12,33,39,.08)}
        header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #e3eaeb}
        header strong{color:#0a525d}header span{font-weight:800;color:#b9690c}
        .visual{height:255px;display:grid;place-items:center;overflow:hidden;background:#fff}
        .visual svg{display:block;max-width:100%;max-height:245px;width:auto;height:auto}
      </style></head><body><main>${cards}</main><script>
        document.querySelectorAll('.visual svg').forEach(function(svg){svg.classList.add('ecv-svg');svg.setAttribute('data-ecv','1')});
      </script></body></html>`, { waitUntil: 'networkidle0' });
      // Las imágenes incrustadas en SVG no exponen decode(); este margen evita
      // capturarlas mientras Chromium aún está decodificando el archivo local.
      await new Promise((resolve) => setTimeout(resolve, 500));
      const output = path.join(OUTPUT_DIR, `galeria-${String(files.length + 1).padStart(2, '0')}.png`);
      await page.screenshot({ path: output, fullPage: true });
      files.push(output);
      await page.close();
    }
  } finally {
    await browser.close();
  }
  console.log(JSON.stringify({ svg: items.length, paginas: files.length, archivos: files }, null, 2));
})();
