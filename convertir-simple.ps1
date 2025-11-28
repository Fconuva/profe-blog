# Convertidor simple de HTML a PDF usando Chrome
Write-Host "CONVERTIDOR DE DOSSIERES HTML A PDF" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Buscar Chrome
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (!(Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

if (!(Test-Path $chromePath)) {
    Write-Host "ERROR: Chrome no encontrado" -ForegroundColor Red
    exit 1
}

Write-Host "Chrome encontrado: OK`n" -ForegroundColor Green

# Crear carpeta
if (!(Test-Path "dossieres-pdf")) {
    New-Item -ItemType Directory -Path "dossieres-pdf" | Out-Null
}

# Lista de archivos
$archivos = @(
    "DOSSIER_LENGUA_LITERATURA_MEDIA_COMPLETO.html",
    "DOSSIER_MATEMATICA_MEDIA_COMPLETO.html",
    "DOSSIER_HISTORIA_MEDIA_COMPLETO.html",
    "DOSSIER_CIENCIAS_NATURALES_MEDIA_COMPLETO.html",
    "DOSSIER_INGLES_MEDIA_COMPLETO.html",
    "DOSSIER_EDUCACION_FISICA_MEDIA_COMPLETO.html",
    "DOSSIER_EDUCACION_BASICA_COMPLETO.html",
    "DOSSIER_PIE_EDUCACION_ESPECIAL_COMPLETO.html"
)

$exitosos = 0
$total = $archivos.Count

foreach ($html in $archivos) {
    $num = $archivos.IndexOf($html) + 1
    $pdfName = $html.Replace("_COMPLETO.html", ".pdf")
    $pdfPath = Join-Path (Get-Location) "dossieres-pdf\$pdfName"
    $htmlPath = Join-Path (Get-Location) $html
    
    if (!(Test-Path $htmlPath)) {
        Write-Host "[$num/$total] SKIP: $html (no existe)" -ForegroundColor Yellow
        continue
    }
    
    Write-Host "[$num/$total] Procesando: $html" -ForegroundColor Cyan
    
    $fileUrl = "file:///" + $htmlPath.Replace("\", "/")
    
    $args = "--headless", "--disable-gpu", "--print-to-pdf=$pdfPath", $fileUrl
    
    try {
        Start-Process -FilePath $chromePath -ArgumentList $args -Wait -NoNewWindow -ErrorAction Stop
        
        # Esperar un momento para asegurar que el archivo se escribio
        Start-Sleep -Milliseconds 1500
        
        if (Test-Path $pdfPath) {
            $sizeMB = [math]::Round((Get-Item $pdfPath).Length / 1MB, 2)
            Write-Host "   OK: $pdfName ($sizeMB MB)`n" -ForegroundColor Green
            $exitosos++
        } else {
            Write-Host "   ERROR: No se creo el PDF`n" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "   ERROR: $_`n" -ForegroundColor Red
    }
}

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "RESUMEN: $exitosos/$total convertidos" -ForegroundColor $(if ($exitosos -eq $total) {"Green"} else {"Yellow"})
Write-Host "=====================================" -ForegroundColor Cyan
