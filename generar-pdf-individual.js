// Generar PDFs uno por uno con manejo robusto de errores
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function convertirUno(htmlFile, pdfFile) {
    console.log(`\nConvirtiendo: ${htmlFile}`);
    
    const htmlPath = path.resolve(__dirname, htmlFile);
    const pdfPath = path.resolve(__dirname, 'dossieres-pdf', pdfFile);
    
    if (!fs.existsSync(htmlPath)) {
        console.log('ERROR: Archivo HTML no existe');
        return false;
    }
    
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu'
            ]
        });
        
        const page = await browser.newPage();
        
        console.log('Cargando HTML...');
        await page.goto(`file://${htmlPath}`, {
            waitUntil: 'load',
            timeout: 180000
        });
        
        // Esperar 5 segundos adicionales
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        console.log('Generando PDF...');
        await page.pdf({
            path: pdfPath,
            format: 'Letter',
            printBackground: true,
            margin: {
                top: '20mm',
                right: '15mm',
                bottom: '20mm',
                left: '15mm'
            },
            preferCSSPageSize: false
        });
        
        await browser.close();
        
        const sizeMB = (fs.statSync(pdfPath).size / 1024 / 1024).toFixed(2);
        console.log(`✓ OK: ${pdfFile} (${sizeMB} MB)`);
        return true;
        
    } catch (error) {
        if (browser) await browser.close();
        console.log(`✗ ERROR: ${error.message}`);
        return false;
    }
}

// Obtener archivo desde argumentos de línea de comandos
const args = process.argv.slice(2);
if (args.length < 2) {
    console.log('Uso: node generar-pdf-individual.js <archivo.html> <salida.pdf>');
    console.log('\nEjemplo:');
    console.log('node generar-pdf-individual.js DOSSIER_MATEMATICA_MEDIA_COMPLETO.html DOSSIER_MATEMATICA_MEDIA.pdf');
    process.exit(1);
}

convertirUno(args[0], args[1])
    .then(exito => process.exit(exito ? 0 : 1))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
