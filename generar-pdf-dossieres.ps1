# ================================================================
# Script para generar PDFs de dossieres automáticamente
# Usa wkhtmltopdf portable o navegador Chrome en modo headless
# ================================================================

Write-Host "📄 Generador de PDFs de Dossieres" -ForegroundColor Cyan
Write-Host "=" * 60

# Rutas
$htmlFile = "DOSSIER_LENGUA_LITERATURA_MEDIA_COMPLETO.html"
$pdfOutput = "dossieres-pdf\DOSSIER_LENGUA_LITERATURA_MEDIA.pdf"

# Verificar que existe el HTML
if (-not (Test-Path $htmlFile)) {
    Write-Host "❌ Error: No se encontró el archivo HTML: $htmlFile" -ForegroundColor Red
    Write-Host "   Ejecuta primero: python generar-pdf-lengua-literatura.py" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ HTML encontrado: $htmlFile" -ForegroundColor Green

# ================================================================
# OPCIÓN 1: Usar Chrome/Edge en modo headless
# ================================================================

function ConvertTo-PDFWithBrowser {
    param($HtmlPath, $PdfPath)
    
    Write-Host "`n🌐 Intentando conversión con navegador headless..." -ForegroundColor Cyan
    
    # Buscar Chrome o Edge
    $browsers = @(
        "C:\Program Files\Google\Chrome\Application\chrome.exe",
        "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe",
        "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
    )
    
    $browserPath = $null
    foreach ($path in $browsers) {
        if (Test-Path $path) {
            $browserPath = $path
            break
        }
    }
    
    if (-not $browserPath) {
        Write-Host "⚠️  No se encontró Chrome o Edge instalado" -ForegroundColor Yellow
        return $false
    }
    
    $browserName = if ($browserPath -like "*chrome*") { "Chrome" } else { "Edge" }
    Write-Host "✓ Encontrado: $browserName" -ForegroundColor Green
    
    # Ruta absoluta del HTML
    $absoluteHtmlPath = (Resolve-Path $HtmlPath).Path
    $absolutePdfPath = (Resolve-Path -Path "." | Select-Object -ExpandProperty Path) + "\$PdfPath"
    
    # Crear directorio si no existe
    $pdfDir = Split-Path -Parent $absolutePdfPath
    if (-not (Test-Path $pdfDir)) {
        New-Item -ItemType Directory -Path $pdfDir -Force | Out-Null
    }
    
    Write-Host "🔄 Convirtiendo a PDF con $browserName..." -ForegroundColor Yellow
    
    # Comando para generar PDF
    $chromeArgs = @(
        "--headless",
        "--disable-gpu",
        "--no-margins",
        "--print-to-pdf=$absolutePdfPath",
        "file:///$($absoluteHtmlPath.Replace('\', '/'))"
    )
    
    try {
        $process = Start-Process -FilePath $browserPath -ArgumentList $chromeArgs -Wait -PassThru -WindowStyle Hidden
        
        if ($process.ExitCode -eq 0 -and (Test-Path $absolutePdfPath)) {
            $pdfSize = (Get-Item $absolutePdfPath).Length
            $pdfSizeMB = [math]::Round($pdfSize / 1MB, 2)
            Write-Host "✅ PDF generado exitosamente" -ForegroundColor Green
            Write-Host "   📁 Ubicación: $absolutePdfPath" -ForegroundColor Cyan
            Write-Host "   📊 Tamaño: $pdfSizeMB MB" -ForegroundColor Cyan
            return $true
        } else {
            Write-Host "❌ Error al generar PDF (código: $($process.ExitCode))" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Error ejecutando $browserName : $_" -ForegroundColor Red
        return $false
    }
}

# ================================================================
# OPCIÓN 2: Usar wkhtmltopdf
# ================================================================

function ConvertTo-PDFWithWkhtmltopdf {
    param($HtmlPath, $PdfPath)
    
    Write-Host "`n🔧 Intentando conversión con wkhtmltopdf..." -ForegroundColor Cyan
    
    # Buscar wkhtmltopdf en PATH o en ubicaciones comunes
    $wkCommand = Get-Command wkhtmltopdf -ErrorAction SilentlyContinue
    
    if (-not $wkCommand) {
        # Buscar en ubicaciones comunes
        $commonPaths = @(
            "C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe",
            "C:\Program Files (x86)\wkhtmltopdf\bin\wkhtmltopdf.exe",
            "$env:LOCALAPPDATA\wkhtmltopdf\bin\wkhtmltopdf.exe"
        )
        
        foreach ($path in $commonPaths) {
            if (Test-Path $path) {
                $wkCommand = @{ Source = $path }
                break
            }
        }
    }
    
    if (-not $wkCommand) {
        Write-Host "⚠️  wkhtmltopdf no está instalado" -ForegroundColor Yellow
        Write-Host "   Descarga desde: https://wkhtmltopdf.org/downloads.html" -ForegroundColor Yellow
        return $false
    }
    
    Write-Host "✓ wkhtmltopdf encontrado" -ForegroundColor Green
    
    $wkPath = $wkCommand.Source
    $absoluteHtmlPath = (Resolve-Path $HtmlPath).Path
    $absolutePdfPath = (Resolve-Path -Path "." | Select-Object -ExpandProperty Path) + "\$PdfPath"
    
    # Crear directorio si no existe
    $pdfDir = Split-Path -Parent $absolutePdfPath
    if (-not (Test-Path $pdfDir)) {
        New-Item -ItemType Directory -Path $pdfDir -Force | Out-Null
    }
    
    Write-Host "🔄 Convirtiendo a PDF con wkhtmltopdf..." -ForegroundColor Yellow
    
    try {
        & $wkPath --enable-local-file-access --print-media-type --page-size A4 --margin-top 10mm --margin-bottom 10mm --margin-left 15mm --margin-right 15mm "$absoluteHtmlPath" "$absolutePdfPath"
        
        if (Test-Path $absolutePdfPath) {
            $pdfSize = (Get-Item $absolutePdfPath).Length
            $pdfSizeMB = [math]::Round($pdfSize / 1MB, 2)
            Write-Host "✅ PDF generado exitosamente" -ForegroundColor Green
            Write-Host "   📁 Ubicación: $absolutePdfPath" -ForegroundColor Cyan
            Write-Host "   📊 Tamaño: $pdfSizeMB MB" -ForegroundColor Cyan
            return $true
        } else {
            Write-Host "❌ Error: No se generó el archivo PDF" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Error ejecutando wkhtmltopdf: $_" -ForegroundColor Red
        return $false
    }
}

# ================================================================
# EJECUTAR CONVERSIÓN
# ================================================================

$success = $false

# Intentar primero con navegador (más rápido y confiable)
$success = ConvertTo-PDFWithBrowser -HtmlPath $htmlFile -PdfPath $pdfOutput

# Si falla, intentar con wkhtmltopdf
if (-not $success) {
    $success = ConvertTo-PDFWithWkhtmltopdf -HtmlPath $htmlFile -PdfPath $pdfOutput
}

# Si ninguno funcionó, dar instrucciones manuales
if (-not $success) {
    Write-Host "`n❌ No se pudo generar el PDF automáticamente" -ForegroundColor Red
    Write-Host "`n📋 OPCIÓN MANUAL:" -ForegroundColor Yellow
    Write-Host "   1. Abre el archivo en tu navegador:" -ForegroundColor White
    Write-Host "      $((Resolve-Path $htmlFile).Path)" -ForegroundColor Cyan
    Write-Host "   2. Presiona Ctrl+P" -ForegroundColor White
    Write-Host "   3. Selecciona 'Guardar como PDF'" -ForegroundColor White
    Write-Host "   4. Guarda en: dossieres-pdf\" -ForegroundColor White
    
    # Abrir el HTML en el navegador
    Write-Host "`n🌐 Abriendo archivo en navegador..." -ForegroundColor Cyan
    Start-Process $htmlFile
    
    exit 1
}

Write-Host "`n✅ PROCESO COMPLETADO" -ForegroundColor Green
Write-Host "=" * 60

# Abrir el PDF generado
$response = Read-Host "`n¿Deseas abrir el PDF generado? (S/N)"
if ($response -eq "S" -or $response -eq "s") {
    Start-Process $pdfOutput
}
