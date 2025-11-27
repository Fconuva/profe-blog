# Script simple para generar PDF usando Chrome
Write-Host "Generando PDF del dossier..." -ForegroundColor Cyan

$htmlFile = "DOSSIER_LENGUA_LITERATURA_MEDIA_COMPLETO.html"
$pdfOutput = "dossieres-pdf\DOSSIER_LENGUA_LITERATURA_MEDIA.pdf"

# Verificar HTML
if (-not (Test-Path $htmlFile)) {
    Write-Host "Error: No se encontró $htmlFile" -ForegroundColor Red
    exit 1
}

# Buscar Chrome
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}
if (-not (Test-Path $chromePath)) {
    $chromePath = "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
}

if (-not (Test-Path $chromePath)) {
    Write-Host "Chrome no encontrado. Abriendo HTML para imprimir manualmente..." -ForegroundColor Yellow
    Start-Process $htmlFile
    Write-Host "Usa Ctrl+P y guarda como PDF en: dossieres-pdf\" -ForegroundColor Yellow
    exit 1
}

Write-Host "Chrome encontrado: $chromePath" -ForegroundColor Green

# Rutas absolutas
$htmlPath = (Resolve-Path $htmlFile).Path
$pdfPath = Join-Path (Get-Location) $pdfOutput

# Crear directorio
New-Item -ItemType Directory -Path "dossieres-pdf" -Force | Out-Null

Write-Host "Convirtiendo a PDF..." -ForegroundColor Yellow

# Ejecutar Chrome en modo headless
$url = "file:///$($htmlPath.Replace('\', '/'))"
& $chromePath --headless --disable-gpu --print-to-pdf="$pdfPath" "$url"

Start-Sleep -Seconds 3

if (Test-Path $pdfPath) {
    $size = [math]::Round((Get-Item $pdfPath).Length / 1MB, 2)
    Write-Host "PDF generado exitosamente!" -ForegroundColor Green
    Write-Host "Ubicación: $pdfPath" -ForegroundColor Cyan
    Write-Host "Tamaño: $size MB" -ForegroundColor Cyan
    Start-Process $pdfPath
} else {
    Write-Host "Error al generar PDF" -ForegroundColor Red
}
