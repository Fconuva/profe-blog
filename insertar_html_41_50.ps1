# Script para insertar contextos HTML en preguntas 41-50
$archivo = "evaluaciones\educacion-parvularia\pruebas\parv-nt\index.njk"
$content = Get-Content $archivo -Raw -Encoding UTF8

# Cargar HTML contexts
$contextos = Get-Content "contextos_html_41_50.json" -Raw -Encoding UTF8 | ConvertFrom-Json

# Patrones y enunciados para cada pregunta
$preguntas = @{
    "parv-41" = "¿Cómo enseñar sobre roles comunitarios y oficios?"
    "parv-42" = "¿Cómo abordar identidad cultural sin caer en estereotipos?"
    "parv-43" = "¿Qué estrategia fomenta mejor la participación democrática?"
    "parv-44" = "¿Cuál enfoque es mejor para enseñar artes plásticas?"
    "parv-45" = "¿Qué caracteriza una experiencia artística de calidad?"
    "parv-46" = "¿Cómo integrar música de forma significativa?"
    "parv-47" = "¿Qué rol tiene el juego dramático en el desarrollo?"
    "parv-48" = "¿Cómo promover expresión corporal en niños/as inhibidos?"
    "parv-49" = "¿Cómo exponer niños/as a diferentes expresiones artísticas?"
    "parv-50" = "¿Cómo manejar la diversidad de niveles en un grupo mixto?"
}

foreach ($key in $contextos.PSObject.Properties.Name) {
    $enunciado = $preguntas[$key]
    $contextoHTML = $contextos.$key
    
    # Buscar y reemplazar: insertar HTML ANTES del enunciado
    $patron = "<!-- Enunciado -->\s*<p class=`"text-lg font-semibold text-gray-900 mb-6 leading-relaxed`">\s*$enunciado"
    $reemplazo = "$contextoHTML`n`n            <!-- Enunciado -->`n            <p class=`"text-lg font-semibold text-gray-900 mb-6 leading-relaxed`">`n              $enunciado"
    
    $content = $content -replace $patron, $reemplazo
    Write-Host "Contexto HTML insertado para $key"
}

$content | Out-File $archivo -Encoding UTF8 -NoNewline
Write-Host ""
Write-Host "10 contextos HTML insertados (preguntas 41-50)"
