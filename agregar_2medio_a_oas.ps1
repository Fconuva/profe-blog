# Leer el plan de 2° Medio
$plan2Medio = Get-Content "Datos\MARCO TEORICO\PLANES Y PROGRAMAS\plan_2Medio_Lenguaje_Unidad4.json" -Raw | ConvertFrom-Json

# Leer el archivo de OAs actual
$oasData = Get-Content "privado\objetivos-aprendizaje-lenguaje-NUEVO.json" -Raw | ConvertFrom-Json

# Convertir la unidad de 2° Medio al formato correcto
$unidad4 = $plan2Medio.unidades[0]

# Crear array de OAs convertidos
$oasConvertidos = @()
foreach ($obj in $unidad4.objetivos) {
    $oaConvertido = @{
        codigo = "OA$($obj.numero)"
        texto = $obj.descripcion
        indicadores = $obj.indicadores
    }
    $oasConvertidos += $oaConvertido
}

# Crear la estructura de unidad
$unidadConvertida = @{
    numero = $unidad4.numero
    nombre = $unidad4.nombre
    tiempo_estimado = "10 semanas"
    oas = $oasConvertidos
}

# Crear la estructura de 2° Medio
$nivel2Medio = @{
    nombre = "2° Medio"
    unidades = @($unidadConvertida)
}

# Agregar 2° Medio al archivo de OAs
$oasData.niveles | Add-Member -MemberType NoteProperty -Name "2M" -Value $nivel2Medio -Force

# Guardar el archivo actualizado
$oasData | ConvertTo-Json -Depth 10 | Set-Content "privado\objetivos-aprendizaje-lenguaje-NUEVO.json" -Encoding UTF8

Write-Host "✅ 2° Medio agregado exitosamente al archivo de OAs" -ForegroundColor Green
Write-Host "Total de OAs de 2° Medio Unidad 4: $($oasConvertidos.Count)" -ForegroundColor Cyan
