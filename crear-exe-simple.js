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

function crearEjecutableSimple() {
    log('\n🚀 CREANDO EJECUTABLE SIMPLE', 'cyan');
    log('=' .repeat(50), 'cyan');
    
    // Crear directorio para el ejecutable simple
    const exeDir = 'exe-simple';
    
    if (fs.existsSync(exeDir)) {
        log(`🗑️  Eliminando directorio existente: ${exeDir}`, 'yellow');
        fs.rmSync(exeDir, { recursive: true, force: true });
    }
    
    fs.mkdirSync(exeDir);
    log(`📁 Directorio creado: ${exeDir}`, 'green');
    
    // Crear un ejecutable batch que lance la aplicación
    const launcherBat = `@echo off
title Herramienta de Nota de Proceso
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                HERRAMIENTA DE NOTA DE PROCESO                ║
echo ║                        Version 1.0.0                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🚀 Iniciando aplicación...
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Node.js no está instalado
    echo.
    echo 📥 Por favor instala Node.js desde: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Verificar si las dependencias están instaladas
if not exist "node_modules" (
    echo 📦 Instalando dependencias por primera vez...
    echo    Esto puede tomar unos minutos...
    echo.
    npm install
    if errorlevel 1 (
        echo ❌ Error al instalar dependencias
        pause
        exit /b 1
    )
)

REM Iniciar el servidor
echo ✅ Iniciando servidor...
echo.
echo 🌐 La aplicación se abrirá en tu navegador
echo 📍 URL: http://localhost:3000
echo.
echo ⚠️  IMPORTANTE: No cierres esta ventana mientras uses la aplicación
echo.

REM Abrir navegador después de un breve delay
timeout /t 3 /nobreak >nul
start http://localhost:3000

REM Iniciar servidor Node.js
node server.js

pause`;

    fs.writeFileSync(path.join(exeDir, 'Iniciar-Herramienta.bat'), launcherBat);
    log('✅ Launcher batch creado', 'green');
    
    // Copiar archivos necesarios
    log('\n📁 Copiando archivos...', 'blue');
    
    const archivosCopiar = [
        'package.json',
        'server.js',
        'index.html',
        'nota de proceso.html',
        'pauta de cotejo.html',
        'pagina inicio.html',
        'manifest.json',
        'sw.js'
    ];
    
    archivosCopiar.forEach(archivo => {
        if (fs.existsSync(archivo)) {
            fs.copyFileSync(archivo, path.join(exeDir, archivo));
            log(`   ✅ ${archivo}`, 'green');
        }
    });
    
    // Copiar carpetas
    const carpetas = ['css', 'js', 'icons'];
    carpetas.forEach(carpeta => {
        if (fs.existsSync(carpeta)) {
            copiarCarpetaRecursiva(carpeta, path.join(exeDir, carpeta));
            log(`   ✅ ${carpeta}/`, 'green');
        }
    });
    
    // Crear README para el ejecutable simple
    const readmeEje = `# 🚀 Herramienta de Nota de Proceso - Ejecutable Simple

## 📦 Contenido

Este paquete contiene una versión "ejecutable" de la Herramienta de Nota de Proceso.

## 🚀 Instalación y Uso

### 1️⃣ Requisitos
- Node.js 16+ (descargar desde: https://nodejs.org/)

### 2️⃣ Uso
1. **Doble clic** en \`Iniciar-Herramienta.bat\`
2. La primera vez instalará dependencias automáticamente
3. Se abrirá tu navegador con la aplicación
4. ¡Listo para usar!

### 3️⃣ Características
- ✅ Instalación automática de dependencias
- ✅ Apertura automática del navegador
- ✅ Servidor local integrado
- ✅ Todas las funcionalidades incluidas

## 📋 Archivos Incluidos

- \`Iniciar-Herramienta.bat\` - Ejecutable principal
- \`server.js\` - Servidor Node.js
- \`package.json\` - Configuración
- Aplicación web completa
- Recursos y documentación

## 🔧 Ventajas

- ✅ Fácil de usar (doble clic)
- ✅ Instalación automática
- ✅ No requiere conocimientos técnicos
- ✅ Funciona como "ejecutable"
- ✅ Tamaño pequeño (solo código fuente)

## 📞 Soporte

Si tienes problemas:
1. Asegúrate de tener Node.js instalado
2. Ejecuta como administrador si es necesario
3. Verifica que no haya antivirus bloqueando

---
**Versión**: 1.0.0 | **Tipo**: Ejecutable Simple
`;
    
    fs.writeFileSync(path.join(exeDir, 'README.md'), readmeEje);
    
    // Crear instrucciones simples
    const instrucciones = `🚀 HERRAMIENTA DE NOTA DE PROCESO
================================

📥 INSTALACIÓN:
1. Asegúrate de tener Node.js instalado (https://nodejs.org/)
2. Doble clic en "Iniciar-Herramienta.bat"
3. Esperar a que se abra el navegador
4. ¡Listo!

🎯 PRIMERA VEZ:
- La primera ejecución instalará dependencias automáticamente
- Puede tomar 2-3 minutos
- Las siguientes veces será instantáneo

🌐 USO:
- Se abre automáticamente en tu navegador
- URL: http://localhost:3000
- No cierres la ventana negra mientras uses la app

❓ PROBLEMAS:
- Si no funciona, instala Node.js primero
- Ejecuta como administrador si es necesario

================================
¡Disfruta tu herramienta! 🎓`;
    
    fs.writeFileSync(path.join(exeDir, 'INSTRUCCIONES.txt'), instrucciones);
    
    log('\n' + '='.repeat(50), 'green');
    log('🎉 ¡EJECUTABLE SIMPLE CREADO!', 'bright');
    log('='.repeat(50), 'green');
    
    log(`\n📦 Ubicación: ${exeDir}/`, 'cyan');
    log('\n🚀 Para usar:', 'yellow');
    log('   1. Ir a la carpeta: exe-simple/', 'yellow');
    log('   2. Doble clic en: Iniciar-Herramienta.bat', 'yellow');
    log('   3. ¡Se abre automáticamente!', 'yellow');
    
    log('\n📋 Para distribuir:', 'blue');
    log('   1. Comprimir la carpeta "exe-simple"', 'green');
    log('   2. Enviar el ZIP', 'green');
    log('   3. El usuario descomprime y hace doble clic', 'green');
    
    log('\n💡 Ventajas de esta versión:', 'cyan');
    log('   ✅ Muy fácil de usar (doble clic)', 'green');
    log('   ✅ Instalación automática', 'green');
    log('   ✅ Tamaño pequeño', 'green');
    log('   ✅ Funciona como "ejecutable"', 'green');
    log('   ✅ No requiere conocimientos técnicos', 'green');
    
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
    crearEjecutableSimple();
}

module.exports = { crearEjecutableSimple };
