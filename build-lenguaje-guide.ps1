# Script para construir la guía de Lenguaje paso a paso
$outputFile = "evaluaciones\educacion-basica\estudio\lenguaje-comunicacion-new.njk"

# Crear archivo con header
@"
---
layout: layout-evaluaciones.njk
title: "Guía de Estudio: Lenguaje y Comunicación"
description: "Guía completa de estudio para Lenguaje y Comunicación en Educación Básica con teoría, ejemplos y casos prácticos interactivos"
---
"@ | Out-File -FilePath $outputFile -Encoding UTF8

Write-Host "✓ Header creado" -ForegroundColor Green
