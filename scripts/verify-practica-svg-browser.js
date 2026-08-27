'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const vm = require('vm');
const puppeteer = require('puppeteer');

const ROOT = path.resolve(__dirname, '..');
const SITE = path.join(ROOT, '_site');
const BANK_DIR = path.join(ROOT, 'js', 'practica');
const MIME = { '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.html': 'text/html' };

function loadBank(file) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
  return context.window.PRUEBA;
}

const banks = fs.readdirSync(BANK_DIR).filter((name) => name.endsWith('.js')).sort().map((filename) => {
  const prueba = loadBank(path.join(BANK_DIR, filename));
  return {
    id: filename.replace(/\.js$/, ''),
    questions: prueba.preguntas.filter((q) => q.svg).map((q) => q.n)
  };
}).filter((bank) => bank.questions.length);

function createServer() {
  return http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    const target = path.resolve(SITE, `.${pathname}`);
    if (!target.toLowerCase().startsWith(SITE.toLowerCase()) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
      res.writeHead(404).end('No encontrado');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(target).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(target).pipe(res);
  });
}

(async () => {
  if (!fs.existsSync(path.join(SITE, 'js', 'ecep-practica.js'))) throw new Error('Falta _site. Ejecuta primero la compilación de Eleventy.');
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await puppeteer.launch({ headless: true });
  const errors = [];
  let verified = 0;
  try {
    for (const bank of banks) {
      const page = await browser.newPage();
      page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`${bank.id}: ${msg.text()}`); });
      page.on('pageerror', (error) => errors.push(`${bank.id}: ${error.message}`));
      await page.setViewport({ width: 390, height: 900, deviceScaleFactor: 1 });
      await page.setContent(`<!doctype html><html><head>
        <base href="${origin}/"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
        <link rel="stylesheet" href="/css/ecep-prueba.css?v=37">
      </head><body><div id="ec-prueba"></div>
        <script src="/js/practica/${bank.id}.js"></script><script src="/js/ecep-practica.js?v=3"></script>
      </body></html>`, { waitUntil: 'networkidle0' });
      await page.click('#ecq-go');
      for (const question of bank.questions) {
        await page.click('.ecq-grid-btn');
        await page.waitForSelector(`.ecq-grid .g[data-i="${question - 1}"]`);
        await page.click(`.ecq-grid .g[data-i="${question - 1}"]`);
        await page.waitForSelector('.ecv-svg[data-ecv="1"]');
        const result = await page.evaluate(() => {
          const svg = document.querySelector('.ecv-svg[data-ecv="1"]');
          const figure = document.querySelector('.ecq-fig');
          return {
            role: svg.getAttribute('role'),
            label: svg.getAttribute('aria-label'),
            width: svg.getBoundingClientRect().width,
            height: svg.getBoundingClientRect().height,
            figureWidth: figure.getBoundingClientRect().width,
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
          };
        });
        if (result.role !== 'img' || !result.label || result.width <= 0 || result.height <= 0 || result.width > result.figureWidth + 1 || result.overflow > 0) {
          errors.push(`${bank.id} n${question}: ${JSON.stringify(result)}`);
        }
        await page.click('.ecq-figzoom');
        const opened = await page.$eval('.ecq-fig', (node) => node.classList.contains('zoom'));
        await page.evaluate(() => document.querySelector('.ecq-figzoom').click());
        const closed = await page.$eval('.ecq-fig', (node) => !node.classList.contains('zoom'));
        if (!opened || !closed) errors.push(`${bank.id} n${question}: el zoom no abrió y cerró correctamente`);
        verified += 1;
      }
      await page.close();
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
  console.log(JSON.stringify({ bancos: banks.length, svgVerificados: verified, anchoMovil: 390, hallazgos: errors }, null, 2));
  if (errors.length) process.exit(1);
})();
