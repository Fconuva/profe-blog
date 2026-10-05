'use strict';

const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

async function main() {
  const root = path.resolve(__dirname, '..');
  const source = path.join(root, 'estudiantes', 'simce-u3-clase12-entrevista', 'guia-imprimible.html');
  const output = path.join(root, 'estudiantes', 'simce-u3-clase12-entrevista', 'guia-imprimible.pdf');
  const browser = await chromium.launch({ headless:true });
  try {
    const page = await browser.newPage({ viewport:{ width:1440, height:1000 } });
    await page.goto(pathToFileURL(source).href, { waitUntil:'networkidle' });
    await page.emulateMedia({ media:'print' });
    await page.pdf({ path:output, format:'A4', printBackground:true, preferCSSPageSize:true });
    console.log(output);
  } finally {
    await browser.close();
  }
}

if (require.main === module) main().catch(error => { console.error(error); process.exit(1); });
