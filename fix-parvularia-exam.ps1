# Script para corregir examen de parvularia

$file = "evaluaciones\educacion-parvularia\pruebas\parv-nt\index.njk"

Write-Host "`n=== ARREGLANDO EXAMEN PARVULARIA ===" -ForegroundColor Cyan

# Leer archivo
$content = Get-Content $file -Raw -Encoding UTF8

# 1. Corregir errores de sintaxis (backtick+n)
Write-Host "`n[1/2] Corrigiendo errores de template string..." -ForegroundColor Yellow
$count = 0
$content = $content -replace '",`n        "explicacion":', { $count++; '",\n        "explicacion":' }.GetNewClosure()
Write-Host "  ✓ Corregidos $count errores" -ForegroundColor Green

# 2. Guardar archivo corregido
Write-Host "`n[2/2] Guardando cambios..." -ForegroundColor Yellow
$content | Out-File $file -Encoding UTF8 -NoNewline
Write-Host "  ✓ Archivo guardado" -ForegroundColor Green

Write-Host "`n=== COMPLETADO ===" -ForegroundColor Green
Write-Host "Ahora compila el sitio: npm run build" -ForegroundColor Cyan
