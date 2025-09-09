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

function crearAplicacionElectron() {
    log('\n🚀 CREANDO APLICACIÓN ELECTRON (.EXE)', 'cyan');
    log('=' .repeat(60), 'cyan');
    
    // Crear directorio de Electron
    const electronDir = 'electron-app';
    
    if (fs.existsSync(electronDir)) {
        log(`🗑️  Eliminando directorio existente: ${electronDir}`, 'yellow');
        fs.rmSync(electronDir, { recursive: true, force: true });
    }
    
    fs.mkdirSync(electronDir);
    log(`📁 Directorio creado: ${electronDir}`, 'green');
    
    // Crear package.json para Electron
    const electronPackageJson = {
        "name": "herramienta-nota-proceso",
        "version": "1.0.0",
        "description": "Herramienta profesional para registro de notas de proceso y pautas de cotejo",
        "main": "main.js",
        "homepage": "./",
        "author": "Herramienta Educativa",
        "license": "MIT",
        "scripts": {
            "start": "electron .",
            "build": "electron-builder",
            "build-win": "electron-builder --win",
            "dist": "npm run build-win"
        },
        "devDependencies": {
            "electron": "^27.0.0",
            "electron-builder": "^24.6.4"
        },
        "build": {
            "appId": "com.herramienta.notaproceso",
            "productName": "Herramienta de Nota de Proceso",
            "directories": {
                "output": "dist"
            },
            "files": [
                "**/*",
                "!node_modules",
                "!dist"
            ],
            "win": {
                "target": "nsis",
                "icon": "assets/icon.ico"
            },
            "nsis": {
                "oneClick": false,
                "allowToChangeInstallationDirectory": true,
                "createDesktopShortcut": true,
                "createStartMenuShortcut": true,
                "shortcutName": "Herramienta de Nota de Proceso"
            }
        }
    };
    
    fs.writeFileSync(
        path.join(electronDir, 'package.json'), 
        JSON.stringify(electronPackageJson, null, 2)
    );
    log('✅ package.json de Electron creado', 'green');
    
    // Crear main.js (archivo principal de Electron)
    const mainJs = `const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        icon: path.join(__dirname, 'assets', 'icon.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        show: false
    });

    mainWindow.loadFile('index.html');

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    createMenu();
}

function createMenu() {
    const template = [
        {
            label: 'Archivo',
            submenu: [
                {
                    label: 'Salir',
                    accelerator: 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Herramientas',
            submenu: [
                {
                    label: 'Nota de Proceso',
                    click: () => {
                        mainWindow.loadFile('nota de proceso.html');
                    }
                },
                {
                    label: 'Pauta de Cotejo',
                    click: () => {
                        mainWindow.loadFile('pauta de cotejo.html');
                    }
                },
                {
                    label: 'Página Principal',
                    click: () => {
                        mainWindow.loadFile('index.html');
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});`;
    
    fs.writeFileSync(path.join(electronDir, 'main.js'), mainJs);
    log('✅ main.js de Electron creado', 'green');
    
    // Crear directorio de assets
    const assetsDir = path.join(electronDir, 'assets');
    fs.mkdirSync(assetsDir);
    
    // Copiar icono si existe
    if (fs.existsSync('icons/icon.ico')) {
        fs.copyFileSync('icons/icon.ico', path.join(assetsDir, 'icon.ico'));
        log('✅ Icono copiado', 'green');
    } else {
        log('⚠️  Icono no encontrado - se usará icono por defecto', 'yellow');
    }
    
    // Copiar todos los archivos de la aplicación
    log('\n📁 Copiando archivos de la aplicación...', 'blue');
    
    const archivosApp = [
        'index.html',
        'nota de proceso.html', 
        'pauta de cotejo.html',
        'pagina inicio.html',
        'manifest.json',
        'sw.js'
    ];
    
    archivosApp.forEach(archivo => {
        if (fs.existsSync(archivo)) {
            fs.copyFileSync(archivo, path.join(electronDir, archivo));
            log(`   ✅ ${archivo}`, 'green');
        }
    });
    
    // Copiar carpetas
    const carpetas = ['css', 'js', 'icons'];
    carpetas.forEach(carpeta => {
        if (fs.existsSync(carpeta)) {
            copiarCarpetaRecursiva(carpeta, path.join(electronDir, carpeta));
            log(`   ✅ ${carpeta}/`, 'green');
        }
    });
    
    // Crear script de construcción
    const buildScript = [
        '@echo off',
        'echo 🚀 Construyendo aplicación Electron...',
        'echo.',
        '',
        'cd electron-app',
        '',
        'echo 📦 Instalando dependencias de Electron...',
        'npm install',
        '',
        'echo 🔨 Construyendo ejecutable...',
        'npm run build-win',
        '',
        'echo.',
        'echo ✅ ¡Construcción completada!',
        'echo 📁 El archivo .exe está en: electron-app/dist/',
        'echo.',
        'pause'
    ].join('\n');
    
    fs.writeFileSync('build-exe.bat', buildScript);
    log('✅ Script de construcción creado: build-exe.bat', 'green');
    
    log('\n' + '='.repeat(60), 'green');
    log('🎉 ¡APLICACIÓN ELECTRON CREADA!', 'bright');
    log('='.repeat(60), 'green');
    
    log('\n🚀 Para crear el .exe:', 'cyan');
    log('   1. Ejecutar: build-exe.bat', 'yellow');
    log('   2. Esperar a que termine la construcción', 'yellow');
    log('   3. El .exe estará en: electron-app/dist/', 'yellow');
    
    log('\n📦 Características del ejecutable:', 'blue');
    log('   ✅ Instalador profesional tipo NSIS', 'green');
    log('   ✅ Icono personalizado', 'green');
    log('   ✅ Menús nativos de Windows', 'green');
    log('   ✅ Accesos directos automáticos', 'green');
    log('   ✅ Aplicación independiente', 'green');
    
    log('\n💡 El resultado será:', 'cyan');
    log('   "Herramienta de Nota de Proceso Setup 1.0.0.exe"', 'yellow');
    
    log('\n' + '='.repeat(60) + '\n', 'green');
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
    crearAplicacionElectron();
}

module.exports = { crearAplicacionElectron };
