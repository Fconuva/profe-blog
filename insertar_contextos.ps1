# Script PowerShell para insertar contextos pedagógicos en las primeras 10 preguntas

$filePath = "evaluaciones\educacion-parvularia\pruebas\parv-nt\index.njk"
$contextosPath = "contextos_mejorados_1_10.json"

# Leer archivos
$content = Get-Content $filePath -Raw -Encoding UTF8
$contextos = Get-Content $contextosPath -Raw -Encoding UTF8 | ConvertFrom-Json

# Función para escapar caracteres especiales en regex
function Escape-RegexChars {
    param($text)
    return [regex]::Escape($text)
}

# Para cada pregunta (parv-01 a parv-10), agregar el campo contexto
foreach ($key in @("parv-01", "parv-02", "parv-03", "parv-04", "parv-05", "parv-06", "parv-07", "parv-08", "parv-09", "parv-10")) {
    $contexto = $contextos.$key.contexto
    $numero = $contextos.$key.numero
    
    # Buscar el patrón: "id": "parv-XX", seguido de "numero": X,
    # e insertar "contexto": "...", después de numero
    
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
Write-Host "10 contextos pedagogicos insertados" -ForegroundColor Cyan
