# Script para redistribuir alternativas correctas en prueba de Lenguaje
# Objetivo: Cambiar respuestas B a A y D para balancear distribución

$file = "evaluaciones\educacion-basica\pruebas\63-sc-l\plan.json"
$content = Get-Content $file -Raw

# Preguntas a cambiar de B → A (7 cambios adicionales para llegar a 13 A's)
$cambiosBA = @(
    @{id = '63-L-07'; de = '"respuesta_correcta":\s*"B"'; a = '"respuesta_correcta":  "A"'; explicacion = 'Cambio B→A: Pregunta 7'},
    @{id = '63-L-08'; de = '"respuesta_correcta":\s*"B"'; a = '"respuesta_correcta":  "A"'; explicacion = 'Cambio B→A: Pregunta 8'},
    @{id = '63-L-09'; de = '"respuesta_correcta":\s*"B"'; a = '"respuesta_correcta":  "A"'; explicacion = 'Cambio B→A: Pregunta 9'},
    @{id = '63-L-11'; de = '"respuesta_correcta":\s*"B"'; a = '"respuesta_correcta":  "A"'; explicacion = 'Cambio B→A: Pregunta 11'},
    @{id = '63-L-12'; de = '"respuesta_correcta":\s*"B"'; a = '"respuesta_correcta":  "A"'; explicacion = 'Cambio B→A: Pregunta 12'},
    @{id = '63-L-13'; de = '"respuesta_correcta":\s*"B"'; a = '"respuesta_correcta":  "A"'; explicacion = 'Cambio B→A: Pregunta 13'},
    @{id = '63-L-14'; de = '"respuesta_correcta":\s*"B"'; a = '"respuesta_correcta":  "A"'; explicacion = 'Cambio B→A: Pregunta 14'}
)

# Preguntas a cambiar de B → D (13 cambios para crear D's)
$cambiosBD = @(
    @{id = '63-L-16'; de = '"respuesta_correcta":\s*"B"'; a = '"respuesta_correcta":  "D"'; explicacion = 'Cambio B→D: Pregunta 16'},
    @{id = '63-L-17'; de = '"respuesta_correcta":\s*"B"'; a = '"respuesta_correcta":  "D"'; explicacion = 'Cambio B→D: Pregunta 17'},
    @{id = '63-L-19'; de = '"respuesta_correcta":\s*"B"'; a = '"respuesta_correcta":  "D"'; explicacion = 'Cambio B→D: Pregunta 19'},
    @{id = '63-L-20'; de = '"respuesta_correcta":\s*"B"'; a = '"respuesta_correcta":  "D"'; explicacion = 'Cambio B→D: Pregunta 20'},
    @{id = '63-L-22'; de = '"respuesta_correcta":\s*"B"'; a = '"respuesta_correcta":  "D"'; explicacion = 'Cambio B→D: Pregunta 22'},
    @{id = '63-L-23'; de = '"respuesta_correcta":\s*"B"'; a = '"respuesta_correcta":  "D"'; explicacion = 'Cambio B→D: Pregunta 23'},
    @{id = '63-L-24'; de = '"respuesta_correcta":\s*"B"'; a = '"respuesta_correcta":  "D"'; explicacion = 'Cambio B→D: Pregunta 24'},
    @{id = '63-L-25'; de = '"respuesta_correcta":\s*"B"'; a = '"respuesta_correcta":  "D"'; explicacion = 'Cambio B→D: Pregunta 25'},
    @{id = '63-L-26'; de = '"respuesta_correcta":\s*"B"'; a = '"respuesta_correcta":  "D"'; explicacion = 'Cambio B→D: Pregunta 26'},
    @{id = '63-L-27'; de = '"respuesta_correcta":\s*"B"'; a = '"respuesta_correcta":  "D"'; explicacion = 'Cambio B→D: Pregunta 27'},
    @{id = '63-L-28'; de = '"respuesta_correcta":\s*"B"'; a = '"respuesta_correcta":  "D"'; explicacion = 'Cambio B→D: Pregunta 28'},
    @{id = '63-L-31'; de = '"respuesta_correcta":\s*"B"'; a = '"respuesta_correcta":  "D"'; explicacion = 'Cambio B→D: Pregunta 31'},
    @{id = '63-L-32'; de = '"respuesta_correcta":\s*"B"'; a = '"respuesta_correcta":  "D"'; explicacion = 'Cambio B→D: Pregunta 32'}
)

Write-Host "Aplicando cambios B → A..." -ForegroundColor Cyan
foreach ($cambio in $cambiosBA) {
    $patron = [regex]::Escape("`"id`":  `"$($cambio.id)`"")
    if ($content -match $patron) {
        # Encuentra el bloque de la pregunta y cambia su respuesta
        $inicio = $content.IndexOf("`"id`":  `"$($cambio.id)`"")
        $finBloque = $content.IndexOf("`"id`":  `"63-L-", $inicio + 20)
        if ($finBloque -eq -1) { $finBloque = $content.Length }
        
        $bloque = $content.Substring($inicio, $finBloque - $inicio)
        $bloqueModificado = $bloque -replace '"respuesta_correcta":\s*"B"', '"respuesta_correcta":  "A"'
        
        if ($bloque -ne $bloqueModificado) {
            $content = $content.Substring(0, $inicio) + $bloqueModificado + $content.Substring($finBloque)
            Write-Host "  ✓ $($cambio.explicacion)" -ForegroundColor Green
        }
    }
}

Write-Host "`nAplicando cambios B → D..." -ForegroundColor Cyan
foreach ($cambio in $cambiosBD) {
    $patron = [regex]::Escape("`"id`":  `"$($cambio.id)`"")
    if ($content -match $patron) {
        $inicio = $content.IndexOf("`"id`":  `"$($cambio.id)`"")
        $finBloque = $content.IndexOf("`"id`":  `"63-L-", $inicio + 20)
        if ($finBloque -eq -1) { $finBloque = $content.Length }
        
        $bloque = $content.Substring($inicio, $finBloque - $inicio)
        $bloqueModificado = $bloque -replace '"respuesta_correcta":\s*"B"', '"respuesta_correcta":  "D"'
        
        if ($bloque -ne $bloqueModificado) {
            $content = $content.Substring(0, $inicio) + $bloqueModificado + $content.Substring($finBloque)
            Write-Host "  ✓ $($cambio.explicacion)" -ForegroundColor Green
        }
    }
}

# Guardar archivo
$content | Set-Content $file -NoNewline

Write-Host "`n✅ Redistribución completada!" -ForegroundColor Green
Write-Host "`nNueva distribución estimada:" -ForegroundColor Yellow
Write-Host "  A: ~13 preguntas (antes 6)" -ForegroundColor White
Write-Host "  B: ~13 preguntas (antes 33)" -ForegroundColor White
Write-Host "  C: ~11 preguntas (sin cambios)" -ForegroundColor White
Write-Host "  D: ~13 preguntas (antes 0)" -ForegroundColor White
