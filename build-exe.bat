@echo off
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
pause