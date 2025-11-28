// Version ultra-optimizada para archivos grandes
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function convertir(htmlFile, pdfFile) {
    console.log(`\nGenerando: ${pdfFile}`);
    console.log('Iniciando navegador...');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    });
    
    try {
        const page = await browser.newPage();
        page.setDefaultTimeout(300000); // 5 minutos
        page.setDefaultNavigationTimeout(300000);
        
        const htmlPath = 'file:///' + path.resolve(__dirname, htmlFile).replace(/\\/g, '/');
        
        console.log('Cargando documento...');
        await page.goto(htmlPath, {
            waitUntil: 'domcontentloaded',
            timeout: 300000
        });
        
        console.log('Esperando renderizado...');
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 3000)));
        
        console.log('Exportando a PDF...');
        await page.pdf({
            path: path.join(__dirname, 'dossieres-pdf', pdfFile),
            format: 'Letter',
            printBackground: true,
            margin: { top: '15mm', right: '10mm', bottom: '15mm', left: '10mm' },
            preferCSSPageSize: false
        });
        
        await browser.close();
        
        const sizeMB = (fs.statSync(path.join(__dirname, 'dossieres-pdf', pdfFile)).size / 1024 / 1024).toFixed(2);
        console.log(`✓ EXITOSO: ${pdfFile} (${sizeMB} MB)\n`);
        return true;
        
    } catch (error) {
        await browser.close();
        console.log(`✗ ERROR: ${error.message}\n`);
        return false;
    }
}

const args = process.argv.slice(2);
convertir(args[0], args[1])
    .then(ok => process.exit(ok ? 0 : 1))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
