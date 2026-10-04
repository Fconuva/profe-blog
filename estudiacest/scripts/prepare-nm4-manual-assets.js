'use strict';
// Fotografías del fabricante, sin modificar. Los manuales completos se enlazan.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..', 'nm4', 'u3-clase7-manual-ilustrado', 'assets');
const images = [
  ['multimetro.jpg', 'https://media.fluke.com/d230fa52-dc8a-4517-99c3-b10800300020_product_slideshow_main.jpg'],
  ['multimetro-detalle.jpg', 'https://media.fluke.com/ea89618c-e13d-4d4f-8b1f-b10800300240_product_slideshow_main.jpg'],
  ['estacion-soldadura.jpg', 'https://www.hakko.com/upload_e/products_pro/image/image451.jpg'],
  ['estacion-detalle.jpg', 'https://www.hakko.com/assets/upload_e/images/fx888dx/fx888dx_temp_1.jpg']
];
async function main() {
  fs.mkdirSync(root, { recursive: true });
  for (const [name, url] of images) {
    const destination = path.join(root, name);
    if (fs.existsSync(destination)) { console.log(`${name}: conservada`); continue; }
    const response = await fetch(url, {signal: AbortSignal.timeout(30000)});
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`${name}: respuesta no válida (${response.status})`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < 1000) throw new Error(`${name}: imagen vacía`);
    fs.writeFileSync(destination, bytes, {flag:'wx'});
    console.log(`${name}: ${bytes.length} bytes`);
  }
}
main().catch(error => {console.error(error.message); process.exitCode = 1;});
