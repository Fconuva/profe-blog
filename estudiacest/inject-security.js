const fs = require('fs');
const path = require('path');

const estudiantesDir = path.join(__dirname, 'estudiantes');

if (!fs.existsSync(estudiantesDir)) {
    console.error(`La carpeta estudiantes no existe en: ${estudiantesDir}`);
    process.exit(1);
}

const files = fs.readdirSync(estudiantesDir);
const htmlFiles = files.filter(f => f.endsWith('.html'));

console.log(`Encontrados ${htmlFiles.length} archivos HTML en ${estudiantesDir}. Procediendo a inyectar seguridad...`);

const securityScriptTag = '\n    <!-- Sistema de Protección Anticopia y Seguridad -->\n    <script src="js/security-protection.js"></script>\n';

htmlFiles.forEach(file => {
    const filePath = path.join(estudiantesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Evitar duplicados
    if (content.includes('security-protection.js')) {
        console.log(`- ${file} ya tiene el script de seguridad inyectado.`);
        return;
    }

    // Insertar justo antes de </head> o al final del archivo si no hay head
    if (content.includes('</head>')) {
        content = content.replace('</head>', `${securityScriptTag}</head>`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`[+] Seguridad inyectada de manera exitosa en: ${file}`);
    } else if (content.includes('</body>')) {
        content = content.replace('</body>', `${securityScriptTag}</body>`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`[+] Seguridad inyectada (en el body) en: ${file}`);
    } else {
        console.warn(`[!] No se pudo encontrar head ni body en ${file}, skippeando.`);
    }
});

console.log('Inyección de protección completada con éxito.');
