# Script PowerShell para insertar contextos pedagógicos en preguntas 11-20

$filePath = "evaluaciones\educacion-parvularia\pruebas\parv-nt\index.njk"
$contextosPath = "contextos_mejorados_11_20.json"

# Leer archivos
$content = Get-Content $filePath -Raw -Encoding UTF8
$contextos = Get-Content $contextosPath -Raw -Encoding UTF8 | ConvertFrom-Json

# Para cada pregunta (parv-11 a parv-20), agregar el campo contexto
foreach ($key in @("parv-11", "parv-12", "parv-13", "parv-14", "parv-15", "parv-16", "parv-17", "parv-18", "parv-19", "parv-20")) {
    $contexto = $contextos.$key.contexto
    $numero = $contextos.$key.numero
    
    # Buscar el patrón e insertar contexto
    $pattern = "`"id`": `"$key`",\s+`"numero`": $numero,"
    $replacement = "`"id`": `"$key`",`n        `"numero`": $numero,`n        `"contexto`": `"$contexto`","
    
    if ($content -match $pattern) {
        $content = $content -replace $pattern, $replacement
        Write-Host "Contexto agregado a $key" -ForegroundColor Green
    } else {
        Write-Host "No se encontro patron para $key" -ForegroundColor Red
    }
}

# Guardar archivo
$content | Out-File $filePath -Encoding UTF8 -NoNewline

Write-Host "`nArchivo actualizado exitosamente" -ForegroundColor Cyan
Write-Host "10 contextos pedagogicos insertados (preguntas 11-20)" -ForegroundColor Cyan
