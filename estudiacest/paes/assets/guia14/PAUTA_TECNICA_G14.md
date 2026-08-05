# Pauta técnica y control de calidad - Guía 14

## Uso previsto

- Instrumento: miniensayo de Competencia Lectora para 3° y 4° medio.
- Propósito: práctica diagnóstica y formativa bajo condiciones semejantes a PAES.
- Duración: 113 minutos.
- Composición: 5 lecturas, 49 reactivos A-D, 45 operativos y 4 experimentales.
- Corrección: clave y cálculo exclusivamente en servidor.

## Tabla de especificaciones

| Habilidad | Operativos | Proporción |
|---|---:|---:|
| Localizar | 8 | 17,8 % |
| Interpretar | 28 | 62,2 % |
| Evaluar | 9 | 20,0 % |
| Total operativo | 45 | 100 % |

Los reactivos experimentales son `q08`, `q17`, `q30` y `q48`. No inciden en el puntaje ni en el reporte por habilidad.

## Cobertura textual

1. Texto expositivo de divulgación: sesgo de confirmación (10 reactivos).
2. Texto argumentativo: cultura de la cancelación (10 reactivos).
3. Texto multimodal de divulgación: pantallas y sueño (9 reactivos).
4. Texto literario narrativo: *La caja de cartón* (10 reactivos).
5. Texto literario lírico: *Monólogo del padre* (10 reactivos).

## Revisión de contenido

- Cada reactivo tiene una sola respuesta defendible a partir del texto.
- Las alternativas mantienen paralelismo sintáctico y pertenecen al mismo campo de respuesta.
- Los distractores corresponden a errores plausibles: literalidad parcial, inferencia no autorizada, generalización, inversión causal, cambio de foco o juicio externo.
- Se eliminaron pistas por longitud, tono absoluto y repetición literal exclusiva de la clave cuando estas permitían responder sin comprender.
- La numeración visible cambia con el orden de los textos, pero cada reactivo conserva un identificador estable para corregirlo.
- La forma individual equilibra las claves visibles en 13/12/12/12 y excluye tres claves iguales seguidas y ciclos simples A-B-C-D o D-C-B-A.

## Evidencia de validez y límites

La revisión aporta evidencia de validez de contenido y de relación con el constructo: las tareas exigen localizar, interpretar o evaluar información de lecturas continuas y multimodales. La corrección automática reduce variación entre correctores. El bloqueo de copia, el registro de pérdida de foco y la aleatorización reducen oportunidades de copia, pero no demuestran por sí solos autoría individual.

Este instrumento no debe presentarse como una PAES oficial ni como psicométricamente equivalente a ella. La validación empírica requiere pilotaje: dificultad por ítem, discriminación, funcionamiento de distractores, omisiones, tiempo y consistencia interna. Los cuatro reactivos experimentales permiten reunir esa evidencia sin afectar la calificación.

## Conversión y devolución

- Puntaje base: respuestas correctas entre los 45 reactivos operativos.
- Puntaje mostrado: estimación proporcional a 60 respuestas y consulta de la tabla DEMRE de Invierno, Admisión 2027.
- Etiqueta obligatoria: **puntaje PAES referencial, no oficial**.
- Las respuestas, la pauta y el resultado permanecen ocultos hasta que el docente los publique por curso desde el administrador.

## Pruebas técnicas exigidas antes de publicar

- Sintaxis de API, aplicación y scripts del administrador.
- Generación de al menos 1.000 formas para comprobar equilibrio y ausencia de patrones.
- Inicio con RUT válido, selección, tachado, marcado, recarga y restauración.
- Autoguardado local y remoto; envío irreversible hasta restablecimiento docente.
- Revisión, calificación, publicación/ocultamiento y restablecimiento desde administrador.
- Comprobación visual en escritorio y móvil.
- Smoke test de PAES, NM3, NM4 y SIMCE en la misma publicación.
