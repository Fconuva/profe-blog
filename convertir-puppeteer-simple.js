// Convertidor simple y robusto de HTML a PDF usando Puppeteer
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const dossieres = [
    { html: 'DOSSIER_LENGUA_LITERATURA_MEDIA_COMPLETO.html', pdf: 'DOSSIER_LENGUA_LITERATURA_MEDIA.pdf' },
    { html: 'DOSSIER_MATEMATICA_MEDIA_COMPLETO.html', pdf: 'DOSSIER_MATEMATICA_MEDIA.pdf' },
    { html: 'DOSSIER_HISTORIA_MEDIA_COMPLETO.html', pdf: 'DOSSIER_HISTORIA_MEDIA.pdf' },
    { html: 'DOSSIER_CIENCIAS_NATURALES_MEDIA_COMPLETO.html', pdf: 'DOSSIER_CIENCIAS_NATURALES_MEDIA.pdf' },
    { html: 'DOSSIER_INGLES_MEDIA_COMPLETO.html', pdf: 'DOSSIER_INGLES_MEDIA.pdf' },
    { html: 'DOSSIER_EDUCACION_FISICA_MEDIA_COMPLETO.html', pdf: 'DOSSIER_EDUCACION_FISICA_MEDIA.pdf' },
    { html: 'DOSSIER_EDUCACION_BASICA_COMPLETO.html', pdf: 'DOSSIER_EDUCACION_BASICA.pdf' },
    { html: 'DOSSIER_PIE_EDUCACION_ESPECIAL_COMPLETO.html', pdf: 'DOSSIER_PIE_EDUCACION_ESPECIAL.pdf' }
];

async function convertir() {
    console.log('\n=== CONVERTIDOR DE DOSSIERES ===\n');
    
    if (!fs.existsSync('dossieres-pdf')) {
        fs.mkdirSync('dossieres-pdf');
    }
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    let exitosos = 0;
    
    for (let i = 0; i < dossieres.length; i++) {
        const dossier = dossieres[i];
        const num = i + 1;
        const htmlPath = path.resolve(__dirname, dossier.html);
        const pdfPath = path.resolve(__dirname, 'dossieres-pdf', dossier.pdf);
        
        if (!fs.existsSync(htmlPath)) {
            console.log(`[${num}/8] SKIP: ${dossier.html}`);
            continue;
        }
        
        console.log(`[${num}/8] Procesando: ${dossier.html}`);
        
        try {
            const page = await browser.newPage();
            await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle2', timeout: 120000 });
            await page.pdf({
                path: pdfPath,
                format: 'Letter',
                printBackground: true,
                margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' }
            });
            await page.close();
            
            const sizeMB = (fs.statSync(pdfPath).size / 1024 / 1024).toFixed(2);
            console.log(`   OK: ${dossier.pdf} (${sizeMB} MB)\n`);
            exitosos++;
        } catch (error) {
            console.log(`   ERROR: ${error.message}\n`);
        }
    }
    
    await browser.close();
    
    console.log(`\n=== RESUMEN: ${exitosos}/8 convertidos ===\n`);
}

convertir().catch(console.error);
