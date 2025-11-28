# Script PowerShell para generar todos los PDFs uno por uno
Write-Host "`n=== GENERADOR SECUENCIAL DE PDFs ECEP 2025 ===" -ForegroundColor Cyan

$dossieres = @(
    @("DOSSIER_MATEMATICA_MEDIA_COMPLETO.html", "DOSSIER_MATEMATICA_MEDIA.pdf"),
    @("DOSSIER_HISTORIA_MEDIA_COMPLETO.html", "DOSSIER_HISTORIA_MEDIA.pdf"),
    @("DOSSIER_CIENCIAS_NATURALES_MEDIA_COMPLETO.html", "DOSSIER_CIENCIAS_NATURALES_MEDIA.pdf"),
    @("DOSSIER_INGLES_MEDIA_COMPLETO.html", "DOSSIER_INGLES_MEDIA.pdf"),
    @("DOSSIER_EDUCACION_FISICA_MEDIA_COMPLETO.html", "DOSSIER_EDUCACION_FISICA_MEDIA.pdf"),
    @("DOSSIER_EDUCACION_BASICA_COMPLETO.html", "DOSSIER_EDUCACION_BASICA.pdf"),
    @("DOSSIER_PIE_EDUCACION_ESPECIAL_COMPLETO.html", "DOSSIER_PIE_EDUCACION_ESPECIAL.pdf")
)

$exitosos = 0
$total = $dossieres.Count

for ($i = 0; $i -lt $dossieres.Count; $i++) {
    $html = $dossieres[$i][0]
    $pdf = $dossieres[$i][1]
    $num = $i + 1
    
    Write-Host "`n[$num/$total] Procesando: $html" -ForegroundColor Yellow
    
    $process = Start-Process -FilePath "node" -ArgumentList "generar-pdf-individual.js", $html, $pdf -Wait -NoNewWindow -PassThru
    
    if ($process.ExitCode -eq 0) {
        Write-Host "   ✓ Exitoso" -ForegroundColor Green
        $exitosos++
    } else {
        Write-Host "   ✗ Falló (código: $($process.ExitCode))" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host "`n=== RESUMEN: $exitosos/$total exitosos ===" -ForegroundColor Cyan

# Mostrar archivos generados
Write-Host "`nArchivos PDF generados:" -ForegroundColor Cyan
Get-ChildItem dossieres-pdf\*.pdf | ForEach-Object {
    $sizeMB = [math]::Round($_.Length / 1MB, 2)
    Write-Host "  - $($_.Name) ($sizeMB MB)" -ForegroundColor White
}

Write-Host ""
