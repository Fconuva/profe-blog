# Script PowerShell para informacion del PDF EP 2023
param(
    [string]$PdfPath = "evaluaciones\educacion-parvularia\pruebas\EP 2023-salida.pdf"
)

Write-Host "========================================"
Write-Host " INFORMACION PDF EP 2023"
Write-Host "========================================"
Write-Host ""

# Verificar que existe el archivo
if (-not (Test-Path $PdfPath)) {
    Write-Host "ERROR: No se encuentra el archivo: $PdfPath"
    exit 1
}

$pdfFullPath = (Resolve-Path $PdfPath).Path
Write-Host "Archivo encontrado: $pdfFullPath"

$fileInfo = Get-Item $pdfFullPath
$sizeMB = [math]::Round($fileInfo.Length / 1MB, 2)

Write-Host "Tamano: $sizeMB MB"
Write-Host "Fecha modificacion: $($fileInfo.LastWriteTime)"
Write-Host ""

Write-Host "ANALISIS ESPERADO (58 PREGUNTAS):"
Write-Host "   - 40 porciento Analisis situacion (23 preguntas)"
Write-Host "   - 35 porciento Intervencion pedagogica (20 preguntas)"  
Write-Host "   - 15 porciento Evaluacion/documentacion (9 preguntas)"
Write-Host "   - 10 porciento Teorica conceptual (6 preguntas)"
Write-Host ""
Write-Host "IMAGENES ESPERADAS: ~12 (20 porciento del total)"
Write-Host ""

Write-Host "SIGUIENTE PASO:"
Write-Host "   Usa la extension PDF Viewer de VS Code para ver el contenido"
Write-Host "   El PDF ya esta abierto en el editor"
Write-Host ""
