/**
 * Script para convertir automáticamente todos los dossieres HTML a PDF
 * Usa Puppeteer para renderizar y exportar cada HTML como PDF
 * 
 * Uso: node convertir-todos-dossieres-pdf.js
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Lista de archivos HTML a convertir
const dossieres = [
    {
        html: 'DOSSIER_LENGUA_LITERATURA_MEDIA_COMPLETO.html',
        pdf: 'DOSSIER_LENGUA_LITERATURA_MEDIA.pdf',
        nombre: 'Lengua y Literatura Media'
    },
    {
        html: 'DOSSIER_MATEMATICA_MEDIA_COMPLETO.html',
        pdf: 'DOSSIER_MATEMATICA_MEDIA.pdf',
        nombre: 'Matemática Media'
    },
    {
        html: 'DOSSIER_HISTORIA_MEDIA_COMPLETO.html',
        pdf: 'DOSSIER_HISTORIA_MEDIA.pdf',
        nombre: 'Historia y Geografía Media'
    },
    {
        html: 'DOSSIER_CIENCIAS_NATURALES_MEDIA_COMPLETO.html',
        pdf: 'DOSSIER_CIENCIAS_NATURALES_MEDIA.pdf',
        nombre: 'Ciencias Naturales Media'
    },
    {
        html: 'DOSSIER_INGLES_MEDIA_COMPLETO.html',
        pdf: 'DOSSIER_INGLES_MEDIA.pdf',
        nombre: 'Inglés Media'
    },
    {
        html: 'DOSSIER_EDUCACION_FISICA_MEDIA_COMPLETO.html',
        pdf: 'DOSSIER_EDUCACION_FISICA_MEDIA.pdf',
        nombre: 'Educación Física Media'
    },
    {
        html: 'DOSSIER_EDUCACION_BASICA_COMPLETO.html',
        pdf: 'DOSSIER_EDUCACION_BASICA.pdf',
        nombre: 'Educación Básica'
    },
    {
        html: 'DOSSIER_PIE_EDUCACION_ESPECIAL_COMPLETO.html',
        pdf: 'DOSSIER_PIE_EDUCACION_ESPECIAL.pdf',
        nombre: 'PIE / Educación Especial'
    }
];

// Crear carpeta de destino si no existe
const outputDir = path.join(__dirname, 'dossieres-pdf');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
    console.log('✓ Carpeta dossieres-pdf/ creada\n');
}

async function convertirDossierAPDF(dossier, index, total) {
    const htmlPath = path.join(__dirname, dossier.html);
    const pdfPath = path.join(outputDir, dossier.pdf);
    
    // Verificar que el archivo HTML existe
    if (!fs.existsSync(htmlPath)) {
        console.log(`✗ [${index + 1}/${total}] ${dossier.nombre}`);
        console.log(`  Error: No se encontró ${dossier.html}\n`);
        return false;
    }

    console.log(`⏳ [${index + 1}/${total}] Convirtiendo ${dossier.nombre}...`);
    
    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Cargar el archivo HTML
        await page.goto(`file://${htmlPath}`, {
            waitUntil: 'networkidle0',
            timeout: 60000
        });
        
        // Esperar un poco más para asegurar que todo el contenido se cargó
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generar PDF con configuración optimizada
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
            displayHeaderFooter: false,
            preferCSSPageSize: true
        });
        
        await browser.close();
        
        // Verificar tamaño del PDF generado
        const stats = fs.statSync(pdfPath);
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        
        console.log(`✓ [${index + 1}/${total}] ${dossier.nombre}`);
        console.log(`  PDF generado: ${dossier.pdf} (${sizeMB} MB)\n`);
        
        return true;
    } catch (error) {
        console.log(`✗ [${index + 1}/${total}] ${dossier.nombre}`);
        console.log(`  Error: ${error.message}\n`);
        return false;
    }
}

async function convertirTodos() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  CONVERTIDOR AUTOMÁTICO DE DOSSIERES HTML → PDF');
    console.log('  ECEP 2025 - ProfefranciscoPancho');
    console.log('═══════════════════════════════════════════════════════\n');
    
    const startTime = Date.now();
    let exitosos = 0;
    let fallidos = 0;
    
    for (let i = 0; i < dossieres.length; i++) {
        const resultado = await convertirDossierAPDF(dossieres[i], i, dossieres.length);
        if (resultado) {
            exitosos++;
        } else {
            fallidos++;
        }
    }
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('  RESUMEN DE CONVERSIÓN');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`✓ Exitosos: ${exitosos}/${dossieres.length}`);
    console.log(`✗ Fallidos:  ${fallidos}/${dossieres.length}`);
    console.log(`⏱ Tiempo total: ${duration} segundos`);
    console.log(`📁 Archivos en: ${outputDir}\n`);
    
    if (exitosos === dossieres.length) {
        console.log('🎉 ¡Todos los dossieres convertidos exitosamente!\n');
        console.log('Próximos pasos:');
        console.log('1. Revisa los PDFs en dossieres-pdf/');
        console.log('2. Sube los PDFs al servidor de producción');
        console.log('3. Los enlaces de descarga ya están configurados en el panel admin\n');
    }
}

// Ejecutar conversión
convertirTodos().catch(console.error);
