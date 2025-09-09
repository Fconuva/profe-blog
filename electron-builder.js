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
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function crearAplicacionElectron() {
    log('\n🚀 CREANDO APLICACIÓN ELECTRON (.EXE)', 'cyan');
    log('='.repeat(60), 'cyan');
    
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
            "build-all": "electron-builder --win --mac --linux",
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
                "!dist",
                "!*.md"
            ],
            "win": {
                "target": "nsis",
                "icon": "assets/icon.ico",
                "requestedExecutionLevel": "asInvoker"
            },
            "nsis": {
                "oneClick": false,
                "allowToChangeInstallationDirectory": true,
                "createDesktopShortcut": true,
                "createStartMenuShortcut": true,
                "shortcutName": "Herramienta de Nota de Proceso",
                "installerIcon": "assets/icon.ico",
                "uninstallerIcon": "assets/icon.ico",
                "installerHeaderIcon": "assets/icon.ico",
                "deleteAppDataOnUninstall": true
            },
            "mac": {
                "target": "dmg",
                "icon": "assets/icon.icns"
            },
            "linux": {
                "target": "AppImage",
                "icon": "assets/icon.png"
            }
        }
    };
    
    fs.writeFileSync(
        path.join(electronDir, 'package.json'), 
        JSON.stringify(electronPackageJson, null, 2)
    );
    log('✅ package.json de Electron creado', 'green');
    
    // Crear main.js (archivo principal de Electron)
    const mainJs = `const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Mantener referencia global de la ventana
let mainWindow;

function createWindow() {
    // Crear la ventana del navegador
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        icon: path.join(__dirname, 'assets', 'icon.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            webSecurity: true
        },
        show: false, // No mostrar hasta que esté listo
        titleBarStyle: 'default'
    });

    // Cargar la aplicación
    mainWindow.loadFile('index.html');

    // Mostrar cuando esté listo
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        
        // Mostrar mensaje de bienvenida
        setTimeout(() => {
            dialog.showInfoBox(mainWindow, {
                type: 'info',
                title: 'Herramienta de Nota de Proceso',
                message: '¡Bienvenido!',
                detail: 'La aplicación se ha iniciado correctamente.\\n\\nPuedes comenzar creando un nuevo curso o pauta de cotejo.',
                buttons: ['Entendido']
            });
        }, 1000);
    });

    // Abrir enlaces externos en el navegador por defecto
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    // Evento cuando la ventana se cierra
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Crear menú personalizado
    createMenu();
}

function createMenu() {
    const template = [
        {
            label: 'Archivo',
            submenu: [
                {
                    label: 'Nueva Pauta',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(\`
                            if (typeof openNewPautaModal === 'function') {
                                openNewPautaModal();
                            }
                        \`);
                    }
                },
                { type: 'separator' },
                {
                    label: 'Exportar PDF',
                    accelerator: 'CmdOrCtrl+E',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(\`
                            if (typeof exportToPDF === 'function') {
                                exportToPDF();
                            }
                        \`);
                    }
                },
                { type: 'separator' },
                {
                    label: 'Salir',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
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
                { type: 'separator' },
                {
                    label: 'Página Principal',
                    accelerator: 'CmdOrCtrl+H',
                    click: () => {
                        mainWindow.loadFile('index.html');
                    }
                }
            ]
        },
        {
            label: 'Ver',
            submenu: [
                { role: 'reload', label: 'Recargar' },
                { role: 'forceReload', label: 'Forzar Recarga' },
                { role: 'toggleDevTools', label: 'Herramientas de Desarrollador' },
                { type: 'separator' },
                { role: 'resetZoom', label: 'Zoom Normal' },
                { role: 'zoomIn', label: 'Acercar' },
                { role: 'zoomOut', label: 'Alejar' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: 'Pantalla Completa' }
            ]
        },
        {
            label: 'Ayuda',
            submenu: [
                {
                    label: 'Acerca de',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'Acerca de',
                            message: 'Herramienta de Nota de Proceso v1.0.0',
                            detail: 'Aplicación profesional para registro de evaluaciones educativas.\\n\\nDesarrollado con ❤️ para la comunidad educativa.',
                            buttons: ['Cerrar']
                        });
                    }
                },
                {
                    label: 'Guía de Uso',
                    click: () => {
                        shell.openExternal('https://github.com/tu-usuario/herramienta-nota-proceso');
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// Este método se llamará cuando Electron haya terminado la inicialización
app.whenReady().then(createWindow);

// Salir cuando todas las ventanas estén cerradas
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Prevenir navegación no autorizada
app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (navigationEvent, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);
        
        if (parsedUrl.origin !== 'file://') {
            navigationEvent.preventDefault();
        }
    });
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
    const buildScript = `@echo off
echo 🚀 Construyendo aplicación Electron...
echo.

cd electron-app

echo 📦 Instalando dependencias de Electron...
npm install

echo 🔨 Construyendo ejecutable...
npm run build-win

echo.
echo ✅ ¡Construcción completada!
echo 📁 El archivo .exe está en: electron-app/dist/
echo.
pause`;
    
    fs.writeFileSync('build-exe.bat', buildScript);
    log('✅ Script de construcción creado: build-exe.bat', 'green');
    
    // Crear README para Electron
    const electronReadme = `# 🚀 Herramienta de Nota de Proceso - Aplicación de Escritorio

## 📦 Construcción del Ejecutable

### Automática (Recomendado):
\`\`\`bash
# Ejecutar el script de construcción
build-exe.bat
\`\`\`

### Manual:
\`\`\`bash
cd electron-app
npm install
npm run build-win
\`\`\`

## 📁 Resultado

El archivo .exe se generará en:
\`electron-app/dist/Herramienta de Nota de Proceso Setup 1.0.0.exe\`

## 🎯 Características del Ejecutable

- ✅ Instalador NSIS profesional
- ✅ Icono personalizado
- ✅ Menús nativos de Windows
- ✅ Accesos directos en escritorio y menú inicio
- ✅ Desinstalador incluido
- ✅ Funciona sin navegador
- ✅ Aplicación completamente independiente

## 🔧 Personalización

Para cambiar el icono:
1. Reemplazar \`assets/icon.ico\`
2. Ejecutar \`npm run build-win\`

Para cambiar la configuración:
- Editar \`package.json\` sección "build"
`;
    
    fs.writeFileSync(path.join(electronDir, 'README.md'), electronReadme);
    
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
    log('   ✅ Desinstalador incluido', 'green');
    log('   ✅ Aplicación independiente', 'green');
    
    log('\n💡 El resultado será similar a:', 'cyan');
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
