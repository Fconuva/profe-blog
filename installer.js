#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colores para la consola
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function showBanner() {
    log('\n' + '='.repeat(60), 'cyan');
    log('🚀 INSTALADOR HERRAMIENTA NOTA DE PROCESO 🚀', 'bright');
    log('='.repeat(60), 'cyan');
    log('📚 Herramienta profesional para evaluación educativa', 'blue');
    log('✨ Incluye: Nota de Proceso + Pauta de Cotejo', 'blue');
    log('='.repeat(60) + '\n', 'cyan');
}

function checkNodeVersion() {
    log('🔍 Verificando versión de Node.js...', 'yellow');
    
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 16) {
        log('❌ Error: Se requiere Node.js versión 16 o superior', 'red');
        log(`   Versión actual: ${nodeVersion}`, 'red');
        log('   Descarga Node.js desde: https://nodejs.org/', 'yellow');
        process.exit(1);
    }
    
    log(`✅ Node.js ${nodeVersion} - Compatible`, 'green');
}

function installDependencies() {
    log('\n📦 Instalando dependencias...', 'yellow');
    
    try {
        // Verificar si package.json existe
        if (!fs.existsSync('package.json')) {
            log('❌ Error: package.json no encontrado', 'red');
            process.exit(1);
        }
        
        log('   Ejecutando: npm install', 'blue');
        execSync('npm install', { stdio: 'inherit' });
        log('✅ Dependencias instaladas correctamente', 'green');
        
    } catch (error) {
        log('❌ Error al instalar dependencias:', 'red');
        log(`   ${error.message}`, 'red');
        log('\n💡 Soluciones posibles:', 'yellow');
        log('   1. Ejecutar: npm cache clean --force', 'yellow');
        log('   2. Eliminar node_modules y ejecutar: npm install', 'yellow');
        log('   3. Verificar conexión a internet', 'yellow');
        process.exit(1);
    }
}

function generateIcons() {
    log('\n🎨 Generando iconos de la aplicación...', 'yellow');
    
    const iconsDir = path.join(__dirname, 'icons');
    
    // Crear directorio de iconos si no existe
    if (!fs.existsSync(iconsDir)) {
        fs.mkdirSync(iconsDir, { recursive: true });
        log('   📁 Directorio icons/ creado', 'blue');
    }
    
    // Verificar si ya existen iconos
    const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
    let iconsExist = true;
    
    for (const size of iconSizes) {
        const iconPath = path.join(iconsDir, `icon-${size}x${size}.png`);
        if (!fs.existsSync(iconPath)) {
            iconsExist = false;
            break;
        }
    }
    
    if (iconsExist) {
        log('✅ Iconos ya existen', 'green');
    } else {
        log('⚠️  Iconos no encontrados - usando iconos por defecto', 'yellow');
        log('   💡 Puedes reemplazar los iconos en la carpeta icons/', 'blue');
    }
}

function validateFiles() {
    log('\n🔍 Validando archivos de la aplicación...', 'yellow');
    
    const requiredFiles = [
        'index.html',
        'nota de proceso.html',
        'pauta de cotejo.html',
        'manifest.json',
        'sw.js',
        'server.js'
    ];
    
    let allFilesExist = true;
    
    for (const file of requiredFiles) {
        if (fs.existsSync(file)) {
            log(`   ✅ ${file}`, 'green');
        } else {
            log(`   ❌ ${file} - NO ENCONTRADO`, 'red');
            allFilesExist = false;
        }
    }
    
    if (!allFilesExist) {
        log('\n❌ Faltan archivos requeridos', 'red');
        process.exit(1);
    }
    
    log('✅ Todos los archivos requeridos están presentes', 'green');
}

function createStartupScripts() {
    log('\n📝 Creando scripts de inicio...', 'yellow');
    
    // Script para Windows
    const windowsScript = `@echo off
echo Iniciando Herramienta de Nota de Proceso...
echo.
node server.js
pause`;
    
    fs.writeFileSync('start-windows.bat', windowsScript);
    log('   ✅ start-windows.bat creado', 'green');
    
    // Script para Linux/Mac
    const unixScript = `#!/bin/bash
echo "Iniciando Herramienta de Nota de Proceso..."
echo
node server.js`;
    
    fs.writeFileSync('start-unix.sh', unixScript);
    
    // Hacer ejecutable en sistemas Unix
    try {
        execSync('chmod +x start-unix.sh');
        log('   ✅ start-unix.sh creado y configurado', 'green');
    } catch (error) {
        log('   ✅ start-unix.sh creado', 'green');
    }
}

function showCompletionMessage() {
    log('\n' + '='.repeat(60), 'green');
    log('🎉 ¡INSTALACIÓN COMPLETADA EXITOSAMENTE! 🎉', 'bright');
    log('='.repeat(60), 'green');
    
    log('\n🚀 Para iniciar la aplicación:', 'cyan');
    log('   Opción 1: npm start', 'yellow');
    log('   Opción 2: node server.js', 'yellow');
    
    if (process.platform === 'win32') {
        log('   Opción 3: Doble clic en start-windows.bat', 'yellow');
    } else {
        log('   Opción 3: ./start-unix.sh', 'yellow');
    }
    
    log('\n🌐 Acceso a la aplicación:', 'cyan');
    log('   • Navegador: http://localhost:3000', 'yellow');
    log('   • Nota de Proceso: http://localhost:3000/nota-proceso', 'yellow');
    log('   • Pauta de Cotejo: http://localhost:3000/pauta-cotejo', 'yellow');
    
    log('\n📱 Para instalar como PWA:', 'cyan');
    log('   1. Abre la aplicación en Chrome/Edge', 'yellow');
    log('   2. Busca el ícono "Instalar" en la barra de direcciones', 'yellow');
    log('   3. Haz clic en "Instalar"', 'yellow');
    
    log('\n💡 Características principales:', 'cyan');
    log('   ✅ Funciona offline después de la primera carga', 'green');
    log('   ✅ Exportación a PDF', 'green');
    log('   ✅ Importación/Exportación de datos', 'green');
    log('   ✅ Interfaz responsive', 'green');
    log('   ✅ Múltiples escalas de calificación', 'green');
    
    log('\n📚 Documentación adicional:', 'cyan');
    log('   • README.md - Información general', 'yellow');
    log('   • GUIA_INSTALACION.md - Guía detallada', 'yellow');
    
    log('\n' + '='.repeat(60), 'green');
    log('¡Gracias por usar la Herramienta de Nota de Proceso!', 'bright');
    log('='.repeat(60) + '\n', 'green');
}

// Función principal
async function main() {
    try {
        showBanner();
        checkNodeVersion();
        validateFiles();
        installDependencies();
        generateIcons();
        createStartupScripts();
        showCompletionMessage();
        
    } catch (error) {
        log('\n❌ Error durante la instalación:', 'red');
        log(`   ${error.message}`, 'red');
        log('\n💡 Para obtener ayuda:', 'yellow');
        log('   • Revisa el archivo README.md', 'yellow');
        log('   • Verifica que Node.js esté instalado correctamente', 'yellow');
        log('   • Asegúrate de tener conexión a internet', 'yellow');
        process.exit(1);
    }
}

// Ejecutar instalador
if (require.main === module) {
    main();
}

module.exports = { main };
