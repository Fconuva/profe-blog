const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
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
            webSecurity: true,
            preload: path.join(__dirname, 'preload.js')
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
            dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'Herramienta de Nota de Proceso',
                message: '¡Bienvenido!',
                detail: 'La aplicación se ha iniciado correctamente.\n\nPuedes comenzar creando un nuevo curso o pauta de cotejo.',
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
                        mainWindow.webContents.executeJavaScript(`
                            if (typeof openNewPautaModal === 'function') {
                                openNewPautaModal();
                            }
                        `);
                    }
                },
                { type: 'separator' },
                {
                    label: 'Exportar PDF',
                    accelerator: 'CmdOrCtrl+E',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            if (typeof exportToPDF === 'function') {
                                exportToPDF();
                            }
                        `);
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
                            detail: 'Aplicación profesional para registro de evaluaciones educativas.\n\nDesarrollado con ❤️ para la comunidad educativa.',
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
});

// IPC handlers for navigation
ipcMain.handle('navigate-to', (event, tool) => {
    if (tool === 'nota-proceso') {
        mainWindow.loadFile('nota de proceso.html');
    } else if (tool === 'pauta-cotejo') {
        mainWindow.loadFile('pauta de cotejo.html');
    }
});

ipcMain.handle('minimize-window', () => {
    mainWindow.minimize();
});

ipcMain.handle('maximize-window', () => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
});

ipcMain.handle('close-window', () => {
    mainWindow.close();
});