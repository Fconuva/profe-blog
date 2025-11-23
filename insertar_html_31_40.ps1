# Script para insertar contextos HTML en preguntas 31-40
$archivo = "evaluaciones\educacion-parvularia\pruebas\parv-nt\index.njk"
$content = Get-Content $archivo -Raw -Encoding UTF8

# Cargar HTML contexts
$contextos = Get-Content "contextos_html_31_40.json" -Raw -Encoding UTF8 | ConvertFrom-Json

# Patrones y enunciados para cada pregunta
$preguntas = @{
    "parv-31" = "¿Cuál actividad enseña mejor el concepto de número?"
    "parv-32" = "¿Cómo introducir clasificación y seriación en NT1?"
    "parv-33" = "¿Qué experiencia fomenta mejor el pensamiento espacial?"
    "parv-34" = "¿Cómo integrar matemáticas en experiencias cotidianas?"
    "parv-35" = "¿Cómo enseñar el método científico en NT2?"
    "parv-36" = "¿Cómo fomentar curiosidad por fenómenos naturales?"
    "parv-37" = "¿Cómo responder preguntas científicas de niños/as?"
    "parv-38" = "¿Qué rol juega la exploración sensorial en ciencias?"
    "parv-39" = "¿Cómo enseñar cuidado del medio ambiente?"
    "parv-40" = "¿Cómo abordar la diversidad de estructuras familiares?"
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
Write-Host "10 contextos HTML insertados (preguntas 31-40)"
