# Script para insertar contextos en planData (preguntas 41-50)
$archivo = "evaluaciones\educacion-parvularia\pruebas\parv-nt\index.njk"
$content = Get-Content $archivo -Raw -Encoding UTF8

# Cargar contextos
$contextos = Get-Content "contextos_mejorados_41_50.json" -Raw -Encoding UTF8 | ConvertFrom-Json

foreach ($key in $contextos.PSObject.Properties.Name) {
    $numero = $contextos.$key.numero
    $contextoTexto = $contextos.$key.contexto -replace '"', '\"'
    
    $pattern = "(`"id`": `"$key`",\s*`"numero`": $numero,)"
    $replacement = "`$1`n      `"contexto`": `"$contextoTexto`","
    
    $content = $content -replace $pattern, $replacement
    Write-Host "Contexto agregado a $key"
}

$content | Out-File $archivo -Encoding UTF8 -NoNewline
Write-Host "`n10 contextos pedagógicos insertados (preguntas 41-50)"
