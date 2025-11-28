# Script PowerShell para convertir dossieres HTML a PDF
# Usa Chrome/Edge en modo headless

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  CONVERTIDOR AUTOMÁTICO DE DOSSIERES HTML → PDF" -ForegroundColor Cyan
Write-Host "  ECEP 2025 - ProfefranciscoPancho" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════`n" -ForegroundColor Cyan

# Buscar Chrome o Edge
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

$browser = ""
if (Test-Path $chromePath) {
    $browser = $chromePath
    Write-Host "✓ Chrome encontrado" -ForegroundColor Green
} elseif (Test-Path $edgePath) {
    $browser = $edgePath
    Write-Host "✓ Edge encontrado" -ForegroundColor Green
} else {
    Write-Host "✗ No se encontró Chrome ni Edge" -ForegroundColor Red
    Write-Host "  Por favor instala Chrome o usa: npm run convertir-dossieres`n" -ForegroundColor Yellow
    exit 1
}

# Crear carpeta de destino
$outputDir = "dossieres-pdf"
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
    Write-Host "✓ Carpeta dossieres-pdf/ creada`n" -ForegroundColor Green
}

# Lista de dossieres
$dossieres = @(
    @{ html = "DOSSIER_LENGUA_LITERATURA_MEDIA_COMPLETO.html"; pdf = "DOSSIER_LENGUA_LITERATURA_MEDIA.pdf"; nombre = "Lengua y Literatura Media" },
    @{ html = "DOSSIER_MATEMATICA_MEDIA_COMPLETO.html"; pdf = "DOSSIER_MATEMATICA_MEDIA.pdf"; nombre = "Matemática Media" },
    @{ html = "DOSSIER_HISTORIA_MEDIA_COMPLETO.html"; pdf = "DOSSIER_HISTORIA_MEDIA.pdf"; nombre = "Historia y Geografía Media" },
    @{ html = "DOSSIER_CIENCIAS_NATURALES_MEDIA_COMPLETO.html"; pdf = "DOSSIER_CIENCIAS_NATURALES_MEDIA.pdf"; nombre = "Ciencias Naturales Media" },
    @{ html = "DOSSIER_INGLES_MEDIA_COMPLETO.html"; pdf = "DOSSIER_INGLES_MEDIA.pdf"; nombre = "Inglés Media" },
    @{ html = "DOSSIER_EDUCACION_FISICA_MEDIA_COMPLETO.html"; pdf = "DOSSIER_EDUCACION_FISICA_MEDIA.pdf"; nombre = "Educación Física Media" },
    @{ html = "DOSSIER_EDUCACION_BASICA_COMPLETO.html"; pdf = "DOSSIER_EDUCACION_BASICA.pdf"; nombre = "Educación Básica" },
    @{ html = "DOSSIER_PIE_EDUCACION_ESPECIAL_COMPLETO.html"; pdf = "DOSSIER_PIE_EDUCACION_ESPECIAL.pdf"; nombre = "PIE / Educación Especial" }
)

$exitosos = 0
$fallidos = 0
$total = $dossieres.Count
$startTime = Get-Date

Write-Host "Iniciando conversión de $total dossieres...`n" -ForegroundColor Cyan

for ($i = 0; $i -lt $dossieres.Count; $i++) {
    $dossier = $dossieres[$i]
    $num = $i + 1
    
    $htmlPath = Join-Path $PWD $dossier.html
    $pdfPath = Join-Path $PWD "$outputDir\$($dossier.pdf)"
    
    if (!(Test-Path $htmlPath)) {
        Write-Host "✗ [$num/$total] $($dossier.nombre)" -ForegroundColor Red
        Write-Host "  Error: No se encontró $($dossier.html)`n" -ForegroundColor Yellow
        $fallidos++
        continue
    }
    
    Write-Host "⏳ [$num/$total] Convirtiendo $($dossier.nombre)..." -ForegroundColor Yellow
    
    try {
        # Convertir ruta de archivo a URL
        $fileUrl = "file:///$($htmlPath.Replace('\', '/'))"
        
        # Ejecutar Chrome/Edge en modo headless para generar PDF
        $args = @(
            "--headless",
            "--disable-gpu",
            "--print-to-pdf=$pdfPath",
            "--print-to-pdf-no-header",
            "--no-margins",
            $fileUrl
        )
        
        Start-Process -FilePath $browser -ArgumentList $args -Wait -NoNewWindow
        
        # Verificar si se creó el PDF
        if (Test-Path $pdfPath) {
            $sizeMB = [math]::Round((Get-Item $pdfPath).Length / 1MB, 2)
            Write-Host "✓ [$num/$total] $($dossier.nombre)" -ForegroundColor Green
            Write-Host "  PDF generado: $($dossier.pdf) ($sizeMB MB)`n" -ForegroundColor Gray
            $exitosos++
        } else {
            Write-Host "✗ [$num/$total] $($dossier.nombre)" -ForegroundColor Red
            Write-Host "  Error: No se pudo generar el PDF`n" -ForegroundColor Yellow
            $fallidos++
        }
    }
    catch {
        Write-Host "✗ [$num/$total] $($dossier.nombre)" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)`n" -ForegroundColor Yellow
        $fallidos++
    }
    
    Start-Sleep -Milliseconds 500
}

$endTime = Get-Date
$duration = [math]::Round(($endTime - $startTime).TotalSeconds, 2)

Write-Host "`n═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  RESUMEN DE CONVERSIÓN" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✓ Exitosos: $exitosos/$total" -ForegroundColor Green
Write-Host "✗ Fallidos:  $fallidos/$total" -ForegroundColor $(if ($fallidos -gt 0) { "Red" } else { "Gray" })
Write-Host "⏱ Tiempo total: $duration segundos" -ForegroundColor Cyan
Write-Host "📁 Archivos en: $outputDir`n" -ForegroundColor Cyan

if ($exitosos -eq $total) {
    Write-Host "🎉 ¡Todos los dossieres convertidos exitosamente!`n" -ForegroundColor Green
    Write-Host "Próximos pasos:" -ForegroundColor Yellow
    Write-Host "1. Revisa los PDFs en dossieres-pdf/" -ForegroundColor White
    Write-Host "2. Sube los PDFs al servidor de producción" -ForegroundColor White
    Write-Host "3. Los enlaces de descarga ya están configurados en el panel admin`n" -ForegroundColor White
}
