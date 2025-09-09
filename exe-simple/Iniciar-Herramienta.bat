@echo off
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

pause