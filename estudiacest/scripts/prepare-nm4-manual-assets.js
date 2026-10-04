'use strict';
// Fotografías del fabricante, sin modificar. Los manuales completos se enlazan.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname, '..', 'nm4', 'u3-clase7-manual-ilustrado', 'assets');
const images = [
  ['multimetro.jpg', 'https://media.fluke.com/d230fa52-dc8a-4517-99c3-b10800300020_product_slideshow_main.jpg'],
  ['multimetro-detalle.jpg', 'https://media.fluke.com/ea89618c-e13d-4d4f-8b1f-b10800300240_product_slideshow_main.jpg'],
  ['estacion-soldadura.jpg', 'https://www.hakko.com/upload_e/products_pro/image/image451.jpg'],
  ['estacion-detalle.jpg', 'https://www.hakko.com/assets/upload_e/images/fx888dx/fx888dx_temp_1.jpg'],
  ['taladro.png', 'https://www.bosch-diy.com/imagestorage/es-es/pbd-40-100026579-hires-png-rgb-oneux-80641_w_1600_h_800.png?imgHeight=800&imgWidth=1600'],
  ['taladro-vista.png', 'https://www.bosch-diy.com/imagestorage/es-es/0603b07000-pbd-40-fcp-2000x2000px-386147-png-image-png_w_1600_h_800.png?imgHeight=800&imgWidth=1600'],
  ['gato-dimensiones.png', 'https://pimdatacdn.bahco.com/media/sub475/17448f931c13f73f.png']
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
  if(!fs.existsSync(path.join(root,'gato-detalle.jpg'))){
    const folder=fs.mkdtempSync(path.join(os.tmpdir(),'nm4-bahco-source-'));
    const pdf=path.join(folder,'bahco.pdf');
    const response=await fetch('https://pimdata.bahco.com/media/sub1119/18b418bfc19dc63f.pdf',{signal:AbortSignal.timeout(30000)});
    if(!response.ok)throw new Error(`Manual Bahco: HTTP ${response.status}`);
    fs.writeFileSync(pdf,Buffer.from(await response.arrayBuffer()),{flag:'wx'});
    // Extraer imágenes originales incrustadas: no recortar, redibujar ni recomprimir.
    const result=spawnSync('py',['-3','-c',
      'import fitz, pathlib, sys; d=fitz.open(sys.argv[1]); out=pathlib.Path(sys.argv[2]);\nfor page,name in [(2,"gato-detalle.jpg")]:\n target=out/name\n if target.exists(): continue\n item=d.extract_image(d[page].get_images()[0][0]); assert item["ext"]=="jpeg" and item["width"]>1000; target.open("xb").write(item["image"]); print(name, item["width"], item["height"])',pdf,root],{encoding:'utf8'});
    if(result.status!==0)throw new Error(result.stderr||'No se pudieron extraer las imágenes del manual.');
    console.log(result.stdout.trim());
  }
}
main().catch(error => {console.error(error.message); process.exitCode = 1;});
