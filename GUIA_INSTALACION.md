# 📱 Guía de Instalación - Herramienta de Evaluación Docente PWA

## 🚀 Cómo Hacer la Aplicación Instalable

### Opción 1: Servidor Web Local (Recomendado)

Para que la PWA sea completamente funcional e instalable, necesitas servir los archivos desde un servidor web:

#### **Método A: Python (Más Simple)**
```bash
# Si tienes Python 3 instalado:
cd "c:\Users\fconu\OneDrive\Escritorio\herramienta nota de proceso"
python -m http.server 8000

# Si tienes Python 2:
python -m SimpleHTTPServer 8000
```

#### **Método B: Node.js**
```bash
# Instalar servidor simple globalmente:
npm install -g http-server

# Ejecutar en la carpeta del proyecto:
cd "c:\Users\fconu\OneDrive\Escritorio\herramienta nota de proceso"
http-server -p 8000
```

#### **Método C: Live Server (VS Code)**
1. Instala la extensión "Live Server" en VS Code
2. Abre la carpeta del proyecto en VS Code
3. Clic derecho en `index.html` → "Open with Live Server"

### Opción 2: Servidor Web Profesional

#### **XAMPP/WAMP (Windows)**
1. Descarga e instala XAMPP desde https://www.apachefriends.org/
2. Copia la carpeta del proyecto a `C:\xampp\htdocs\herramienta-evaluacion\`
3. Inicia Apache desde el panel de XAMPP
4. Accede a `http://localhost/herramienta-evaluacion/`

## 📲 Proceso de Instalación para Usuarios

### En Navegadores de Escritorio (Chrome, Edge, Firefox)

1. **Abrir la aplicación** en el navegador:
   ```
   http://localhost:8000
   ```

2. **Buscar el ícono de instalación**:
   - Chrome/Edge: Ícono de instalación en la barra de direcciones
   - O en el menú: "Instalar Herramienta de Evaluación Docente"

3. **Confirmar instalación**:
   - Clic en "Instalar"
   - La app se añadirá al escritorio y menú de inicio

### En Dispositivos Móviles

#### **Android (Chrome)**
1. Abrir la URL en Chrome móvil
2. Tocar el menú (⋮) → "Añadir a pantalla de inicio"
3. Confirmar el nombre y tocar "Añadir"

#### **iOS (Safari)**
1. Abrir la URL en Safari
2. Tocar el botón de compartir (□↗)
3. Seleccionar "Añadir a pantalla de inicio"
4. Confirmar el nombre y tocar "Añadir"

## 🌐 Compartir la Aplicación

### Opción 1: Hosting Gratuito

#### **GitHub Pages**
1. Crear repositorio en GitHub
2. Subir todos los archivos del proyecto
3. Ir a Settings → Pages
4. Seleccionar "Deploy from a branch" → main
5. Tu app estará en: `https://tu-usuario.github.io/nombre-repositorio`

#### **Netlify**
1. Ir a https://netlify.com
2. Arrastrar la carpeta del proyecto a Netlify
3. Obtienes una URL como: `https://nombre-aleatorio.netlify.app`

#### **Vercel**
1. Ir a https://vercel.com
2. Conectar con GitHub o subir archivos
3. Deploy automático con URL personalizable

### Opción 2: Crear Instalador Ejecutable

#### **Usando Electron (Avanzado)**
```bash
# Instalar Electron
npm install -g electron

# Crear package.json
npm init -y

# Instalar Electron como dependencia
npm install electron --save-dev

# Crear main.js para Electron
# (Ver código de ejemplo abajo)
```

## 📦 Código para Electron (main.js)

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        icon: path.join(__dirname, 'icons/icon-192x192.png')
    });

    mainWindow.loadFile('index.html');
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
});
```

## 🔧 Verificar Funcionalidad PWA

### Herramientas de Desarrollo
1. Abrir DevTools (F12)
2. Ir a la pestaña "Application" o "Aplicación"
3. Verificar:
   - ✅ Manifest: Debe mostrar todos los datos
   - ✅ Service Worker: Debe estar registrado y activo
   - ✅ Storage: LocalStorage funcionando

### Lighthouse Audit
1. En DevTools → pestaña "Lighthouse"
2. Seleccionar "Progressive Web App"
3. Clic en "Generate report"
4. Debe obtener puntuación alta en PWA

## 📋 Checklist de Instalación

- [ ] Servidor web configurado y funcionando
- [ ] Aplicación accesible via HTTP/HTTPS
- [ ] Manifest.json cargando correctamente
- [ ] Service Worker registrado
- [ ] Iconos de diferentes tamaños disponibles
- [ ] Prompt de instalación aparece en navegadores compatibles
- [ ] App funciona offline después de primera visita
- [ ] Datos se guardan localmente

## 🆘 Solución de Problemas

### Service Worker no se registra
- Verificar que los archivos estén en un servidor web (no file://)
- Revisar la consola del navegador para errores
- Asegurar que sw.js esté en la raíz del proyecto

### No aparece prompt de instalación
- Verificar que manifest.json sea válido
- Asegurar que la app cumpla criterios PWA
- Probar en modo incógnito

### App no funciona offline
- Verificar que Service Worker esté cachando recursos
- Revisar la estrategia de cache en sw.js
- Probar desconectando internet después de primera carga

## 📞 Soporte

Si tienes problemas con la instalación:
1. Revisar la consola del navegador (F12)
2. Verificar que todos los archivos estén presentes
3. Asegurar que el servidor web esté funcionando correctamente

¡Tu Herramienta de Evaluación Docente ya está lista para ser instalada y usada como una aplicación nativa! 🎉
