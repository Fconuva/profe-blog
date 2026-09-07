---
name: estudiacest-oral-interrogation-grading
description: Revisar audios, proponer y aplicar calificaciones y generar retroalimentaciones A4 para las interrogaciones orales El lugar sin limites y Mocha Dick de Estudia CEST. Usar cuando el docente pida preparar, revisar o calificar estas interrogaciones; no usar para guias escritas PAES o SIMCE.
---

# Corrección De Interrogaciones Orales

## Límite De Autorización

- Trabaja en `C:\dev\profe-blog\estudiacest` y lee primero `AGENTS.md`, `REGLAS.md` y las entradas recientes de `BITACORA.md`.
- Si el docente pide solo verificar o preparar, no escribas notas, no cierres intentos y no cambies audios.
- Aplicar calificaciones, publicar resultados o reemplazar evidencia requiere una instrucción explícita en el turno actual.
- La revisión técnica asistida entrega antecedentes. La calificación final sigue siendo una decisión docente.
- No expongas respuestas esperadas mientras otros estudiantes estén rindiendo.

## Inventario Seguro

1. Identifica el instrumento: `nm3` corresponde a `El lugar sin límites`; `nm4`, a `Mocha Dick`.
2. Lista entregas sin mutarlas:

   ```powershell
   npm run review:interrogaciones -- --instrumento nm4
   ```

3. Filtra por el curso solicitado. Para cuarto A se usa la clave interna `4ATP`.
4. Descarga los audios a una carpeta temporal fuera del repositorio:

   ```powershell
   npm run review:interrogaciones -- --instrumento nm4 --descargar "$env:TEMP\interrogacion-nm4-revision"
   ```

5. Nunca agregues audios, manifiestos con identificadores, transcripciones ni notas individuales a Git.

## Validación De Evidencia

- Una entrega completa debe tener siete posiciones y un audio asociado a cada pregunta sorteada.
- Decodifica todos los archivos con `ffmpeg`; no confíes solo en el tamaño o en la duración informada por el contenedor WebM.
- Confirma que existe señal audible. Un archivo vacío, corrupto o inaudible se marca como incidencia técnica y no recibe `0,0` automáticamente.
- Conserva la relación `posición -> pregunta del banco -> audio`. No califiques una respuesta contra otra pregunta.
- Usa la obra local como fuente primaria. Para `Mocha Dick`, consulta `nm4/pdf/Mocha_Dick_Ortega_Martinez.pdf`; al ser un escaneo, renderiza u obtiene OCR cuando sea necesario y confirma visualmente los pasajes dudosos.
- La transcripción es un apoyo para navegar el audio. Escucha directamente nombres propios, citas, negaciones, autocorrecciones y fragmentos de baja confianza.

## Calibración Predeterminada

- Exigencia interna: `60/100`, donde `100` es muy exigente y `0` es nada exigente.
- Esta cifra no es un puntaje estudiantil y no se incluye en el PDF.
- Acepta paráfrasis correctas, vacilaciones propias de la oralidad, autocorrecciones y un orden no lineal si la idea se comprende.
- No penalices por duración breve, pronunciación, muletillas o timidez cuando la respuesta cumple lo solicitado.
- Exige precisión conceptual y la evidencia concreta pedida por el reactivo. No completes por inferencia lo que el estudiante no dijo.
- Usa la escala vigente por respuesta: `1,0`, `0,8`, `0,6`, `0,4`, `0,2` o `0,0`. Lee `references/calibracion-60.md` antes de proponer puntajes.

## Revisión Y Propuesta

Para cada estudiante prepara primero una hoja interna, sin escribir en producción:

| Campo | Contenido |
|---|---|
| Posición | 1 a 7 |
| Pregunta | Número y formulación exacta del banco |
| Evidencia oída | Síntesis fiel, no una cita inventada |
| Logro | Parte correcta de la respuesta |
| Falta o error | Componente ausente o confusión concreta |
| Puntaje propuesto | Uno de los seis valores permitidos |
| Confianza | Alta, media o baja |
| Incidencia técnica | Sí o no, con motivo |

- En preguntas de varias partes, separa los componentes solicitados antes de puntuar.
- Revisa manualmente toda propuesta de confianza baja.
- No uses duración, velocidad de respuesta o fluidez como reemplazo del contenido.
- Antes de aplicar en lote, informa cuántas entregas están completas, incompletas, con incidencia y listas para calificar.

## Retroalimentación

- Escribe dos o tres oraciones breves y humanas: una fortaleza verificable, una mejora precisa y una acción concreta de estudio.
- Habla de lo que el estudiante mostró en sus respuestas. No menciones IA, motores de transcripción, tokens, rutas, archivos, fotogramas ni herramientas internas.
- Evita frases genéricas como `debes estudiar más`. Nombra el tipo de evidencia, relación causal o precisión que debe mejorar.
- No inventes errores ni logros que no aparezcan en los audios.

## Aplicación Y PDF

Solo después de la autorización explícita:

1. Simula o prepara la escritura y compara la cantidad esperada con la que se aplicará.
2. Guarda la pauta mediante el flujo docente/API existente; no escribas directamente en nodos sin validación.
3. Lee de vuelta cada calificación y confirma los siete puntajes, la nota calculada y la observación.
4. Genera el documento con la acción existente `pdf-retroalimentacion`.
5. Verifica `%PDF`, una sola página, tamaño A4, insignia institucional, estudiante y curso correctos, siete filas, nota y retroalimentación sin cortes.
6. Abre una muestra visual de cada lote antes de darlo por terminado.

## Cierre

- Ejecuta `npm run audit:interrogaciones` y `npm run build` si se modificó código, contenido o reglas de Estudia CEST.
- Si hubo una mutación real, comprueba la lectura posterior en el panel y registra el cierre en `BITACORA.md` sin datos personales.
- Informa por separado: entregas revisadas, incidencias técnicas, calificaciones aplicadas y PDF generados.
