# Script para insertar contextos HTML en preguntas 21-30
$archivo = "evaluaciones\educacion-parvularia\pruebas\parv-nt\index.njk"
$content = Get-Content $archivo -Raw -Encoding UTF8

# Cargar HTML contexts
$contextos = Get-Content "contextos_html_21_30.json" -Raw -Encoding UTF8 | ConvertFrom-Json

# Patrones y enunciados para cada pregunta
$preguntas = @{
    "parv-21" = "¿Cuál actividad desarrolla mejor la motricidad gruesa en NT1?"
    "parv-22" = "¿Cuál actividad desarrolla mejor la motricidad fina?"
    "parv-23" = "¿Cómo promover la conciencia corporal en NT1?"
    "parv-24" = "¿Cómo promover hábitos de vida saludable en NT2?"
    "parv-25" = "¿Cuál es la mejor secuencia para enseñar grafomotricidad?"
    "parv-26" = "¿Cómo fomentar comprensión oral en NT1?"
    "parv-27" = "¿Cómo estimular expresión oral en niños tímidos?"
    "parv-28" = "¿Cómo ampliar vocabulario en salidas pedagógicas?"
    "parv-29" = "¿Cómo crear un ambiente letrado efectivo?"
    "parv-30" = "¿Cómo trabajar lectura inicial en NT1?"
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
Write-Host "10 contextos HTML insertados (preguntas 21-30)"
