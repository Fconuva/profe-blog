# ================================================================
# Script Maestro para Generar TODOS los Dossieres PDF
# ECEP 2025 - Completo
# ================================================================

Write-Host "🚀 GENERADOR MAESTRO DE DOSSIERES PDF" -ForegroundColor Cyan
Write-Host "=" * 70
Write-Host ""

$scripts = @(
    @{Name="Lengua y Literatura Media"; File="generar-pdf-lengua-literatura.py"; Output="DOSSIER_LENGUA_LITERATURA_MEDIA_COMPLETO.html"; PDF="DOSSIER_LENGUA_LITERATURA_MEDIA.pdf"},
    @{Name="Matemática Media"; File="generar-pdf-matematica-media.py"; Output="DOSSIER_MATEMATICA_MEDIA_COMPLETO.html"; PDF="DOSSIER_MATEMATICA_MEDIA.pdf"},
    @{Name="Historia y Geografía Media"; File="generar-pdf-historia-media.py"; Output="DOSSIER_HISTORIA_MEDIA_COMPLETO.html"; PDF="DOSSIER_HISTORIA_MEDIA.pdf"},
    @{Name="Ciencias Naturales Media"; File="generar-pdf-ciencias-media.py"; Output="DOSSIER_CIENCIAS_NATURALES_MEDIA_COMPLETO.html"; PDF="DOSSIER_CIENCIAS_NATURALES_MEDIA.pdf"},
    @{Name="Inglés Media"; File="generar-pdf-ingles-media.py"; Output="DOSSIER_INGLES_MEDIA_COMPLETO.html"; PDF="DOSSIER_INGLES_MEDIA.pdf"},
    @{Name="Educación Física Media"; File="generar-pdf-edfisica-media.py"; Output="DOSSIER_EDUCACION_FISICA_MEDIA_COMPLETO.html"; PDF="DOSSIER_EDUCACION_FISICA_MEDIA.pdf"},
    @{Name="Educación Básica"; File="generar-pdf-educacion-basica.py"; Output="DOSSIER_EDUCACION_BASICA_COMPLETO.html"; PDF="DOSSIER_EDUCACION_BASICA.pdf"},
    @{Name="PIE - Educación Especial"; File="generar-pdf-pie.py"; Output="DOSSIER_PIE_EDUCACION_ESPECIAL_COMPLETO.html"; PDF="DOSSIER_PIE_EDUCACION_ESPECIAL.pdf"}
)

$generados = 0
$errores = 0
$archivosHTML = @()

foreach ($script in $scripts) {
    Write-Host "`n📄 [$($generados + $errores + 1)/$($scripts.Count)] Generando: $($script.Name)" -ForegroundColor Yellow
    Write-Host "   Script: $($script.File)" -ForegroundColor Gray
    
    if (-not (Test-Path $script.File)) {
        Write-Host "   ❌ Error: Script no encontrado" -ForegroundColor Red
        $errores++
        continue
    }
    
    try {
        # Ejecutar script Python
        $output = python $script.File 2>&1
        
        # Verificar si se generó el HTML
        if (Test-Path $script.Output) {
            $size = (Get-Item $script.Output).Length
            $sizeMB = [math]::Round($size / 1MB, 2)
            Write-Host "   ✅ HTML generado: $($script.Output)" -ForegroundColor Green
            Write-Host "   📊 Tamaño: $sizeMB MB" -ForegroundColor Cyan
            $generados++
            $archivosHTML += $script.Output
        } else {
            Write-Host "   ❌ Error: No se generó el archivo HTML" -ForegroundColor Red
            $errores++
        }
    } catch {
        Write-Host "   ❌ Error ejecutando script: $_" -ForegroundColor Red
        $errores++
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "=" * 70
Write-Host ""
Write-Host "📊 RESUMEN DE GENERACIÓN" -ForegroundColor Cyan
Write-Host "   ✅ Generados exitosamente: $generados" -ForegroundColor Green
Write-Host "   ❌ Errores: $errores" -ForegroundColor Red
Write-Host "   📁 Total: $($scripts.Count)" -ForegroundColor White
Write-Host ""

if ($generados -gt 0) {
    Write-Host "=" * 70
    Write-Host ""
    Write-Host "📋 ARCHIVOS HTML GENERADOS:" -ForegroundColor Cyan
    foreach ($html in $archivosHTML) {
        Write-Host "   • $html" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "=" * 70
    Write-Host ""
    Write-Host "📌 PRÓXIMO PASO: Convertir a PDF" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Para cada archivo HTML:" -ForegroundColor White
    Write-Host "   1. Abre el archivo en Chrome/Edge" -ForegroundColor Gray
    Write-Host "   2. Presiona Ctrl+P" -ForegroundColor Gray
    Write-Host "   3. Destino: 'Guardar como PDF'" -ForegroundColor Gray
    Write-Host "   4. Gráficos de fondo: ✅ ACTIVADO" -ForegroundColor Gray
    Write-Host "   5. Guarda en: dossieres-pdf\" -ForegroundColor Gray
    Write-Host ""
    Write-Host "O ejecuta: .\convertir-todos-a-pdf.ps1" -ForegroundColor Cyan
    Write-Host ""
    
    # Preguntar si desea abrir los HTMLs
    $response = Read-Host "¿Deseas abrir todos los HTMLs ahora para convertirlos? (S/N)"
    if ($response -eq "S" -or $response -eq "s") {
        Write-Host ""
        Write-Host "🌐 Abriendo archivos HTML..." -ForegroundColor Cyan
        foreach ($html in $archivosHTML) {
            Start-Process $html
            Start-Sleep -Milliseconds 1000
        }
        Write-Host "✅ Todos los archivos abiertos" -ForegroundColor Green
        Write-Host ""
        Write-Host "💡 Tip: Usa Ctrl+P en cada pestaña y guarda como PDF" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ PROCESO COMPLETADO" -ForegroundColor Green
Write-Host "=" * 70
