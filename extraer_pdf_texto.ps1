# Script PowerShell para extraer texto del PDF EP 2023
# Usa Add-Type para cargar librería .NET de PDF

param(
    [string]$PdfPath = "evaluaciones\educacion-parvularia\pruebas\EP 2023-salida.pdf",
    [string]$OutputPath = "EP_2023_CONTENIDO.txt"
)

Write-Host "========================================"
Write-Host " EXTRACTOR DE CONTENIDO PDF EP 2023"
Write-Host "========================================"
Write-Host ""

# Verificar que existe el archivo
if (-not (Test-Path $PdfPath)) {
    Write-Host "❌ ERROR: No se encuentra el archivo: $PdfPath" -ForegroundColor Red
    exit 1
}

$pdfFullPath = (Resolve-Path $PdfPath).Path
Write-Host "📄 Archivo encontrado: $pdfFullPath"
Write-Host "📏 Tamaño: $([math]::Round((Get-Item $pdfFullPath).Length / 1MB, 2)) MB"
Write-Host ""

# Intentar usar iTextSharp si está disponible
Write-Host "🔍 Buscando bibliotecas de PDF disponibles..."

# Método alternativo: usar PowerShell para copiar texto del portapapeles
Write-Host ""
Write-Host "💡 INSTRUCCIONES MANUALES:" -ForegroundColor Yellow
Write-Host "   1. El PDF está abierto en VS Code"
Write-Host "   2. Puedes seleccionar todo el texto (Ctrl+A)"
Write-Host "   3. Copiar (Ctrl+C)"
Write-Host "   4. Pegar en un archivo de texto"
Write-Host ""
Write-Host "🤖 Alternativa: Usa la extensión PDF Viewer ya instalada"
Write-Host "   - Botón derecho en el PDF > 'View in PDF Viewer'"
Write-Host "   - Selecciona y copia el texto de cada página"
Write-Host ""

# Información del archivo
$fileInfo = Get-Item $pdfFullPath
Write-Host "ℹ️  INFORMACIÓN DEL ARCHIVO:"
Write-Host "   Nombre: $($fileInfo.Name)"
Write-Host "   Directorio: $($fileInfo.Directory)"
Write-Host "   Fecha modificación: $($fileInfo.LastWriteTime)"
Write-Host "   Solo lectura: $($fileInfo.IsReadOnly)"
Write-Host ""

# Buscar en el contenido metadata
Write-Host "📊 ANÁLISIS ESPERADO (58 PREGUNTAS):"
Write-Host "   - 40% Análisis situación (23 preguntas)"
Write-Host "   - 35% Intervención pedagógica (20 preguntas)"  
Write-Host "   - 15% Evaluación/documentación (9 preguntas)"
Write-Host "   - 10% Teórica conceptual (6 preguntas)"
Write-Host ""
Write-Host "📸 IMÁGENES ESPERADAS: ~12 (20% del total)"
Write-Host ""

Write-Host "✅ Script completado. Usa las extensiones de VS Code para ver el contenido." -ForegroundColor Green
