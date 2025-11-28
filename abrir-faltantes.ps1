# Abrir los 3 dossieres faltantes para conversion manual
Write-Host "`n=== ABRIR DOSSIERES FALTANTES PARA CONVERSION MANUAL ===" -ForegroundColor Cyan
Write-Host "Los siguientes archivos NO se pudieron generar automaticamente." -ForegroundColor Yellow
Write-Host "Se abriran en tu navegador para que los conviertas manualmente.`n" -ForegroundColor Yellow

$faltantes = @(
    "DOSSIER_MATEMATICA_MEDIA_COMPLETO.html",
    "DOSSIER_CIENCIAS_NATURALES_MEDIA_COMPLETO.html",
    "DOSSIER_EDUCACION_BASICA_COMPLETO.html"
)

foreach ($archivo in $faltantes) {
    if (Test-Path $archivo) {
        Write-Host "Abriendo: $archivo" -ForegroundColor Green
        Start-Process $archivo
        Start-Sleep -Milliseconds 800
    }
}

Write-Host "`n=== INSTRUCCIONES ===" -ForegroundColor Cyan
Write-Host "En cada pestana del navegador:" -ForegroundColor White
Write-Host "1. Presiona Ctrl+P" -ForegroundColor Yellow
Write-Host "2. Destino: Guardar como PDF" -ForegroundColor Yellow
Write-Host "3. Graficos de fondo: ACTIVADO" -ForegroundColor Yellow
Write-Host "4. Guarda en: dossieres-pdf\" -ForegroundColor Yellow
Write-Host "5. Nombres:" -ForegroundColor Yellow
Write-Host "   - DOSSIER_MATEMATICA_MEDIA.pdf" -ForegroundColor Gray
Write-Host "   - DOSSIER_CIENCIAS_NATURALES_MEDIA.pdf" -ForegroundColor Gray
Write-Host "   - DOSSIER_EDUCACION_BASICA.pdf`n" -ForegroundColor Gray

Write-Host "Presiona Enter cuando hayas terminado..." -ForegroundColor Cyan
Read-Host

Write-Host "`nVerificando PDFs finales..." -ForegroundColor Cyan
$total = (Get-ChildItem dossieres-pdf\*.pdf).Count
Write-Host "`nTotal de PDFs generados: $total de 8" -ForegroundColor $(if ($total -eq 8) {"Green"} else {"Yellow"})

if ($total -eq 8) {
    Write-Host "`n¡COMPLETADO! Todos los dossieres fueron convertidos." -ForegroundColor Green
    Write-Host "`nArchivos generados:" -ForegroundColor Cyan
    Get-ChildItem dossieres-pdf\*.pdf | ForEach-Object {
        $mb = [math]::Round($_.Length/1MB,2)
        Write-Host "  - $($_.Name) ($mb MB)" -ForegroundColor White
    }
}
