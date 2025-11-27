# Abrir todos los dossieres HTML para conversión a PDF
Write-Host "Abriendo todos los dossieres HTML generados..." -ForegroundColor Cyan

$htmls = @(
    "DOSSIER_LENGUA_LITERATURA_MEDIA_COMPLETO.html",
    "DOSSIER_MATEMATICA_MEDIA_COMPLETO.html",
    "DOSSIER_HISTORIA_MEDIA_COMPLETO.html",
    "DOSSIER_CIENCIAS_NATURALES_MEDIA_COMPLETO.html",
    "DOSSIER_INGLES_MEDIA_COMPLETO.html",
    "DOSSIER_EDUCACION_FISICA_MEDIA_COMPLETO.html",
    "DOSSIER_EDUCACION_BASICA_COMPLETO.html",
    "DOSSIER_PIE_EDUCACION_ESPECIAL_COMPLETO.html"
)

foreach ($html in $htmls) {
    if (Test-Path $html) {
        Write-Host "Abriendo: $html" -ForegroundColor Green
        Start-Process $html
        Start-Sleep -Milliseconds 800
    } else {
        Write-Host "No encontrado: $html" -ForegroundColor Yellow
    }
}

Write-Host "`nTodos los archivos abiertos!" -ForegroundColor Green
Write-Host "`nEn cada pestana:" -ForegroundColor Cyan
Write-Host "1. Presiona Ctrl+P" -ForegroundColor White
Write-Host "2. Destino: Guardar como PDF" -ForegroundColor White
Write-Host "3. Graficos de fondo: ACTIVADO" -ForegroundColor White
Write-Host "4. Guarda en: dossieres-pdf\" -ForegroundColor White
