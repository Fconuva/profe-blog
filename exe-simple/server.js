const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "blob:"],
            connectSrc: ["'self'"]
        }
    }
}));

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname), {
    maxAge: '1d',
    etag: true,
    lastModified: true
}));

// Rutas principales
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/nota-proceso', (req, res) => {
    res.sendFile(path.join(__dirname, 'nota de proceso.html'));
});

app.get('/pauta-cotejo', (req, res) => {
    res.sendFile(path.join(__dirname, 'pauta de cotejo.html'));
});

// Ruta para el manifest
app.get('/manifest.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(path.join(__dirname, 'manifest.json'));
});

// Ruta para el service worker
app.get('/sw.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, 'sw.js'));
});

// API para información del sistema
app.get('/api/info', (req, res) => {
    res.json({
        name: 'Herramienta de Nota de Proceso',
        version: '1.0.0',
        description: 'Herramienta profesional para registro de notas de proceso y pautas de cotejo',
        features: [
            'Gestión de cursos y estudiantes',
            'Múltiples tipos de evaluación',
            'Exportación a PDF',
            'Funcionamiento offline',
            'Interfaz responsive'
        ],
        status: 'running',
        timestamp: new Date().toISOString()
    });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Manejo de errores del servidor
app.use((err, req, res, next) => {
    console.error('Error del servidor:', err.stack);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
🚀 Herramienta de Nota de Proceso iniciada exitosamente!

📍 Servidor ejecutándose en: http://localhost:${PORT}
🌐 Acceso desde la red local: http://[tu-ip]:${PORT}

📱 Funcionalidades disponibles:
   • Página principal: http://localhost:${PORT}
   • Nota de proceso: http://localhost:${PORT}/nota-proceso
   • Pauta de cotejo: http://localhost:${PORT}/pauta-cotejo

💡 Para instalar como PWA:
   1. Abre la aplicación en Chrome/Edge
   2. Busca el ícono de "Instalar" en la barra de direcciones
   3. Haz clic en "Instalar"

🔧 Para detener el servidor: Ctrl+C
    `);
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
    console.log('\n🛑 Cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n🛑 Cerrando servidor...');
    process.exit(0);
});

module.exports = app;
