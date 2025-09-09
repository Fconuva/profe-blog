# 🚀 Herramienta de Nota de Proceso - Aplicación de Escritorio

## 📦 Construcción del Ejecutable

### Automática (Recomendado):
```bash
# Ejecutar el script de construcción
build-exe.bat
```

### Manual:
```bash
cd electron-app
npm install
npm run build-win
```

## 📁 Resultado

El archivo .exe se generará en:
`electron-app/dist/Herramienta de Nota de Proceso Setup 1.0.0.exe`

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
1. Reemplazar `assets/icon.ico`
2. Ejecutar `npm run build-win`

Para cambiar la configuración:
- Editar `package.json` sección "build"
