# Guías 1–9: reconstrucción y validación

Fecha: 10 de septiembre de 2026. Versión de contenido: `foundations-v1`.

## Alcance y decisiones

Reconstrucción autorizada por Francisco para unificar el formato actual. Se mantienen los focos útiles de los originales de aula y se corrigen rótulos, afirmaciones sin respaldo y reactivos. No se modifican las lecturas, claves ni resultados de G10–G21. G22–G32 siguen en el plan de continuidad.

Los PDF antiguos quedan rotulados «PDF histórico». Los textos nuevos son originales y los casos informativos se identifican como ficticios. No se reutilizan fragmentos protegidos de autores ni bancos de los libros metodológicos. G2 corrige el rótulo narrativo: sus materiales de partida eran no literarios. G5 conserva poesía como formación complementaria, sin declararla una unidad obligatoria de PAES.

## Diseño del tramo

| Guía | Prerrequisito y objetivo | Tareas presentes (cantidad) | Palabras por lectura regular |
|---|---|---|---|
| 1 | Leer un párrafo completo; distinguir dato, paráfrasis e inferencia. | a×2, b, c, d×3, f×2, g, j×2 | 443 / 466 |
| 2 | Recuperar información; sintetizar y conservar relaciones y alcance. | b×2, c×2, e, f×2, g, h, j, n×2 | 423 / 402 |
| 3 | Separar dato e inferencia; interpretar narrador, tiempo y conflicto. | a, b, d×3, e×2, f, h×2, k, l | 445 / 446 |
| 4 | Distinguir tesis de ejemplo; evaluar razones y evidencia. | b, c, f, g, h, i, j×3, l×2, n | 411 / 403 |
| 5 | Inferir con pistas; interpretar imágenes y totalidad poética. | a, b, c×2, d, e×2, f×2, h, k, l | 130 / 133 |
| 6 | Reconocer afirmación y respaldo; explicar fallas del razonamiento. | a, b, f, j×6, l×2, n | 392 / 404 |
| 7 | Reconstruir propósito; explicar función y pertinencia de recursos. | b, e×2, h×3, i, k×2, m×2, n | 399 / 410 |
| 8 | Relacionar episodios; contrastar hipótesis narrativas con indicios. | b, c×2, d×4, e, h, j, k, l | 441 / 441 |
| 9 | Evaluar alcance y respaldo; contrastar sesgos y perspectivas. | b, c×2, h, j×4, l×2, n×2 | 401 / 436 |

Códigos a–n: tareas del temario DEMRE referenciado en el [plan anual](PLAN_CONSTRUCCION_32_GUIAS.md). La clasificación se hace según la operación solicitada; una actitud de un personaje no se clasifica automáticamente como postura del emisor. La aparición de los catorce códigos no certifica cobertura de los treinta conocimientos subyacentes ni dominio del estudiante.

Son sesiones de enseñanza, no simulacros de extensión PAES. Se documenta la excepción al rango orientativo histórico de 500 palabras: lecturas iniciales de unas 400–466 palabras y poemas breves por su género. Cada lectura tiene seis preguntas. Volumen regular: 18 textos, 108 reactivos. Tiempo propuesto: 70 minutos efectivos dentro del bloque formal de 90, ajustable tras pilotaje: explicación/modelado 15, práctica 20, evaluación 20, revisión/entrega 5 y análisis 10. Si el docente libera resultados después, trasladar el análisis al siguiente encuentro. Sin cronómetro ni fecha rígida.

## Fórmula y evaluación

Explica → Modela (ATENCIÓN, ejemplo distinto) → Ejercita N1/N2/N3 → Evalúa → Analiza el error y transfiere.

- Preguntas 1–2: procedimiento específico; 3–4: apoyo general; 5–6: resolución autónoma dentro de la práctica. Son niveles de apoyo previstos, no dificultad psicométrica medida.
- Preguntas 7–12: otro texto, sin pistas de procedimiento. El resumen del estudiante separa práctica y evaluación independiente y muestra aciertos/cantidad por habilidad.
- Dos reflexiones opcionales conservadas en el panel docente: evidencia de una decisión y revisión de un distractor.
- Tras liberación docente: clave, respaldo, descarte de A–D y tarea nueva de transferencia en el cuaderno. Esta última no altera el intento entregado ni se presenta como respuesta guardada en línea.
- La pauta completa regular y acompañada está en el panel docente, botón «Pauta G1–9», con autenticación obligatoria. El banco editorial vive en módulos privados de la API. No hay claves de reactivos evaluados en los archivos públicos.
- Ruta individual acompañada: mismo foco, texto abreviado, seis preguntas, apoyos de procedimiento, una pregunta visible, lectura en voz alta y sin temporizador. La API aplica la asignación existente sin publicar identidades. Su resultado no equivale al bloque independiente de doce preguntas.

## Verificación técnica reproducible

- `node scripts/audit-paes-foundations.js`: nueve bancos, dos lecturas y seis preguntas por lectura; alternativas únicas A–D, razones para las cuatro y ninguna clave como alternativa más larga; dieciocho páginas y datos públicos sin claves.
- `npx playwright test scripts/paes-foundations-flow.spec.js --workers=1 --reporter=line`: navegador real con la API real ejecutada contra almacenamiento y autenticación aislados. Casos regulares G1–G9 en 390/1440/3840 px; acompañadas G1–G9; red fallida y borrador en vuelo; inmutabilidad, versión, puntaje de servidor y autorización; panel docente y pautas. No equivale a una conexión local con Firebase de producción.
- `npm run build`: auditorías transversales, contrato de entrega y manifiesto de recursos críticos.
- Lectura agregada de Firebase antes de publicar: cero registros anteriores en G1–G9; no se alteraron datos de estudiantes. Aun así, la API impide sobrescribir o recalificar un intento de otra versión.
- La entrega conserva `submitted`, `completada` y sus marcas de tiempo, espera la cola de borradores y lee el registro persistido antes de confirmar. Un fallo de red mantiene la copia local.

## Revisión y límites

Se hizo revisión editorial del banco, corrección de etiquetas y auditoría técnica. No se atribuye una validación editorial independiente ni un pilotaje que no hayan ocurrido. Antes de usar resultados como evidencia sumativa, corresponde revisión docente de la pauta y aplicación piloto: registrar ambigüedades, distractores elegidos y tiempo real. Los pocos ítems por tarea producen indicios, no diagnósticos concluyentes ni puntajes PAES.

No cambiar silenciosamente `foundations-v1` después de su primera aplicación. Si se modifica una lectura o clave con entregas existentes, conservar la versión anterior y definir una migración explícita; la protección actual rechaza versiones distintas, no sustituye ese trabajo.

El estado de publicación, commit y comprobación de producción se registra en la [bitácora canónica](../BITACORA.md).
