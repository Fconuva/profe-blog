#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Colores para la consola
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function crearPaqueteDistribuible() {
    log('\n🎁 CREANDO PAQUETE DISTRIBUIBLE', 'cyan');
    log('=' .repeat(50), 'cyan');
    
    // Archivos esenciales para distribución
    const archivosEsenciales = [
        'installer.js',
        'package.json', 
        'server.js',
        'start-windows.bat',
        'start-unix.sh',
        'index.html',
        'nota de proceso.html',
        'pauta de cotejo.html',
        'pagina inicio.html',
        'manifest.json',
        'sw.js',
        'INSTRUCCIONES.txt',
        'INICIO_RAPIDO.md',
        'README.md',
        'LICENSE'
    ];
    
    const carpetasEsenciales = [
        'css',
        'js',
        'icons',
        'scripts'
    ];
    
    // Crear directorio de distribución
    const dirDistribucion = 'herramienta-nota-proceso-v1.0';
    
    if (fs.existsSync(dirDistribucion)) {
        log(`🗑️  Eliminando directorio existente: ${dirDistribucion}`, 'yellow');
        fs.rmSync(dirDistribucion, { recursive: true, force: true });
    }
    
    fs.mkdirSync(dirDistribucion);
    log(`📁 Directorio creado: ${dirDistribucion}`, 'green');
    
    // Copiar archivos esenciales
    log('\n📄 Copiando archivos esenciales...', 'blue');
    let archivosCopiadosCount = 0;
    
    archivosEsenciales.forEach(archivo => {
        if (fs.existsSync(archivo)) {
            fs.copyFileSync(archivo, path.join(dirDistribucion, archivo));
            log(`   ✅ ${archivo}`, 'green');
            archivosCopiadosCount++;
        } else {
            log(`   ⚠️  ${archivo} - No encontrado`, 'yellow');
        }
    });
    
    // Copiar carpetas esenciales
    log('\n📁 Copiando carpetas...', 'blue');
    let carpetasCopiadas = 0;
    
    carpetasEsenciales.forEach(carpeta => {
        if (fs.existsSync(carpeta)) {
            copiarCarpetaRecursiva(carpeta, path.join(dirDistribucion, carpeta));
            log(`   ✅ ${carpeta}/`, 'green');
            carpetasCopiadas++;
        } else {
            log(`   ⚠️  ${carpeta}/ - No encontrada`, 'yellow');
        }
    });
    
    // Crear archivo de versión
    const infoVersion = {
        version: '1.0.0',
        fecha: new Date().toISOString().split('T')[0],
        descripcion: 'Herramienta de Nota de Proceso - Versión completa',
        archivos: archivosCopiadosCount,
        carpetas: carpetasCopiadas,
        instalacion: 'Ejecutar: node installer.js'
    };
    
    fs.writeFileSync(
        path.join(dirDistribucion, 'VERSION.json'), 
        JSON.stringify(infoVersion, null, 2)
    );
    
    // Crear README específico para distribución
    const readmeDistribucion = `# 🚀 Herramienta de Nota de Proceso v1.0.0

## ⚡ INSTALACIÓN RÁPIDA

### 1️⃣ Requisitos
- Node.js 16+ (descargar desde: https://nodejs.org/)

### 2️⃣ Instalación Automática
\`\`\`bash
node installer.js
\`\`\`

### 3️⃣ Inicio Rápido
**Windows:**
- Doble clic en \`start-windows.bat\`

**Linux/Mac:**
- Ejecutar: \`./start-unix.sh\`

### 4️⃣ Acceso
- 🌐 Navegador: http://localhost:3000
- 📱 Instalar PWA: Buscar ícono "Instalar" en navegador

## 📋 Contenido del Paquete

- ✅ ${archivosCopiadosCount} archivos esenciales
- ✅ ${carpetasCopiadas} carpetas de recursos
- ✅ Instalador automático
- ✅ Scripts de inicio
- ✅ Documentación completa

## 🎯 Características

- 📊 **Nota de Proceso**: Gestión completa de evaluaciones
- ✅ **Pauta de Cotejo**: Evaluaciones binarias con escalas
- 📱 **PWA**: Instalable como aplicación nativa
- 🔄 **Offline**: Funciona sin conexión
- 📄 **PDF**: Exportación profesional

## 📞 Soporte

Ver archivos:
- \`INSTRUCCIONES.txt\` - Guía básica
- \`INICIO_RAPIDO.md\` - Guía detallada
- \`README.md\` - Documentación completa

---
**Versión**: ${infoVersion.version} | **Fecha**: ${infoVersion.fecha}
`;
    
    fs.writeFileSync(path.join(dirDistribucion, 'LEEME.md'), readmeDistribucion);
    
    // Resumen final
    log('\n' + '='.repeat(50), 'green');
    log('🎉 ¡PAQUETE CREADO EXITOSAMENTE!', 'bright');
    log('='.repeat(50), 'green');
    
    log(`\n📦 Paquete: ${dirDistribucion}`, 'cyan');
    log(`📄 Archivos: ${archivosCopiadosCount}`, 'cyan');
    log(`📁 Carpetas: ${carpetasCopiadas}`, 'cyan');
    
    log('\n🚀 Para distribuir:', 'yellow');
    log(`   1. Comprimir la carpeta: ${dirDistribucion}`, 'yellow');
    log(`   2. Compartir el archivo ZIP/RAR`, 'yellow');
    log(`   3. El usuario ejecuta: node installer.js`, 'yellow');
    
    log('\n💡 Archivos incluidos:', 'blue');
    log('   ✅ Instalador automático (installer.js)', 'green');
    log('   ✅ Servidor Node.js (server.js)', 'green');
    log('   ✅ Scripts de inicio (.bat y .sh)', 'green');
    log('   ✅ Aplicación completa (HTML, CSS, JS)', 'green');
    log('   ✅ Documentación (README, guías)', 'green');
    
    log('\n' + '='.repeat(50) + '\n', 'green');
}

function copiarCarpetaRecursiva(origen, destino) {
    if (!fs.existsSync(destino)) {
        fs.mkdirSync(destino, { recursive: true });
    }
    
    const elementos = fs.readdirSync(origen);
    
    elementos.forEach(elemento => {
        const rutaOrigen = path.join(origen, elemento);
        const rutaDestino = path.join(destino, elemento);
        
        if (fs.statSync(rutaOrigen).isDirectory()) {
            copiarCarpetaRecursiva(rutaOrigen, rutaDestino);
        } else {
            fs.copyFileSync(rutaOrigen, rutaDestino);
        }
    });
}

// Ejecutar si se llama directamente
if (require.main === module) {
    crearPaqueteDistribuible();
}

module.exports = { crearPaqueteDistribuible };
