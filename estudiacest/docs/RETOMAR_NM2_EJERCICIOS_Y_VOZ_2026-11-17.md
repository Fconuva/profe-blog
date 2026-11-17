# Retomar NM2 HC: ejercicios y voz · 17 de noviembre de 2026

## Actualización tras la orden «Construye»

La ampliación está construida: v2, 48 alternativas, cuatro lecturas y seis tareas por clase; 192 alternativas y 24 tareas en total. Conserva los originales y la variante acompañada. El cliente muestra cuatro microejercicios por bloque; los históricos v1 conservan 24 preguntas y tres tareas en cliente, panel y calificación. Los borradores continúan en v2 con sus respuestas.

813 comprobaciones del audit y 116 adicionales aprobadas. Navegador ficticio: cuatro clases a 390/1440/3840, numeración 1–48, guardado/recarga de q25/q48/w6, entrega sobre 48 e históricos sobre 24. PDF A4 de 27/27/27/28 páginas sin desbordes. Estado completo: [QA_NM2_AMPLIACION_2026-11-17.md](QA_NM2_AMPLIACION_2026-11-17.md).

**Revisión independiente aprobada por ambos lectores el 17-nov**, con autorización expresa de Francisco. Cada uno resolvió 96 ítems y revisó 12 tareas, sin abrir la pauta. Se corrigieron parentesco, secuencia inmediata y unidades de conteo, además de forma y distractores de seis ítems y claridad de dos consignas. Ambos aprobaron la segunda pasada de los diez ítems modificados. Registro privado: `api/_paes-nm2-review.json`; dictamen sin claves: `docs/QA_NM2_AMPLIACION_2026-11-17.md`. No hay más autorización pendiente para los revisores. Publicación y verificación efectiva se registran en BITACORA.md.

Build integral aprobado: 1.061 recursos críticos, desde `C:/dev/worktrees/nm2-ampliacion-20261117`. Borrador en rama `codex/nm2-ampliacion-20261117`, código `6bf33bfa`, separado de main; no fusionado ni desplegado. Retomar esa rama y consultar su estado remoto antes de editar. El árbol canónico compartido conserva cambios del encargo y cambios ajenos; no limpiarlo ni agregarlos globalmente.

El trabajo incompleto de voz quedó aislado: parche `C:/dev/profe-blog/scratch/nm2-audio-20261117/audio-pendiente.patch` y copias `.audio-pendiente`. Los tres MP3 permanecen sin commit. El cliente de esta ampliación conserva la voz publicada del navegador; no declarar solucionada la queja de voz. El audit nuevo no exige archivos de audio inexistentes porque esa función pendiente no forma parte del cambio.

**Las secciones siguientes conservan el estado previo a la construcción; son antecedentes históricos y no el estado vigente.**

## Encargo vigente

Francisco considera insuficientes los ejercicios de las clases del 18/25 de noviembre y 2/9 de diciembre para 2A-HC y 2B-HC. Ampliar las cuatro clases con aplicación de contenidos MINEDUC de 1.º/2.º medio en definiciones, oraciones, textos tipo PAES y escritura. Conservar las imágenes IA y la navegación visual, sin volver a una página extensa de texto colapsado.

Meta de trabajo anunciada, todavía sin construir: **48 alternativas, cuatro lecturas y seis tareas de escritura por clase** (192 alternativas y 24 tareas en las cuatro fechas). Distribución propuesta: 16 microejercicios + cuatro lecturas de ocho preguntas. Acompañar con pauta privada, evidencia, fundamento y descarte de distractores. El tiempo se estima; no asegurar que todo se domina en 90 minutos. La ruta acompañada mantiene sus seis preguntas adaptadas.

## Estado comprobado al cierre

- Fuente: `C:/dev/profe-blog/estudiacest`. `main` y `origin/main` en `96c47157`, confirmado mediante fetch el 17-nov.
- Publicado previamente: clases con **24 alternativas, tres lecturas y tres tareas de escritura**; 237 fichas; 13 imágenes IA. No existe todavía la ampliación de ejercicios.
- Datos: `paes/nm2/data/clases.json`, versión `nm2-contenidos-2026-v1`. Claves privadas: `api/_paes-nm2-keys.json`.
- No se modificaron respuestas reales ni calificaciones. No se desplegó ningún cambio de este bloque.
- La prueba de ingreso real de estudiantes 2A/2B sigue pendiente; no confundir pruebas ficticias/API con acceso real.

## Continuidad técnica de la ampliación

1. Leer `AGENTS.md`, `REGLAS.md`, entradas recientes de `BITACORA.md` y las skills canónicas de plataforma y material docente. Revisar `referencias/metodo-gdd-sm/ANALISIS.md` y `PLANTILLA_CLASE.md`.
2. Conservar literalmente q01–q24 y w1–w3. Agregar q25–q28 a micro; q29–q32 a lectura 1; q33–q36 a lectura 2; q37–q40 a lectura 3; q41–q48 a la lectura nueva; w4–w6. Numerar en pantalla por orden visible, no por sufijo del ID.
3. Versionar el material. `api/_paes-nm2.js` actualmente califica con la lista vigente: requiere compatibilidad para que una entrega anterior conserve denominador 24, claves y vista originales. Los borradores pueden continuar con los nuevos ejercicios preservando respuestas. No recalificar entregas históricas sobre 48.
4. El servidor permite notas w1–w3 mediante lista fija: derivar IDs de `lesson.writing` para admitir w4–w6. Revisar cliente, panel docente y resultados publicados.
5. Actualizar `scripts/generate-paes-nm2-material.py`: el bucle micro está fijado en 12; las preguntas de cada lectura necesitan paginación de cuatro por hoja. Actualizar guía, presentación, hoja de ruta docente, cobertura y auditorías coherentemente.
6. Revisar `paes/PLAN_CONSTRUCCION_32_GUIAS.md:270`: exige revisión independiente antes de publicar nuevos ítems. No hay autorización actual para subagentes; no iniciarlos ni afirmar que la autorrevisión es independiente. Construir el borrador concreto antes de solicitar ese paso si hace falta.
7. Probar preservación de entregas antiguas, guardado/recarga, entrega y publicación de las nuevas, lectura móvil/escritorio, PDF final y correspondencia de numeración. Registrar recursos en el manifiesto. Publicar únicamente con `npm run deploy:prod:safe` desde fuente limpia y actualizada; verificar producción.

## Voz: decisión y trabajo incompleto que debe conservarse

Francisco rechazó la voz robótica del navegador. Eligió **mantener HeyGen y recargar saldo**; no ha confirmado la recarga. Después preguntó si Higgsfield tiene voces. Sí: se comprobaron TTS y modelos de audio en la CLI autenticada; la cuenta tenía 293,45 créditos, dato que debe revalidarse. No se generó audio ni se consumieron créditos en Higgsfield. No asumir cambio de proveedor ni comprar saldo.

- Voz HeyGen previamente aprobada: `CtOQZfX9jwJIP9IVgjFs`. CLI `C:/Users/franc/bin/heygen.exe`; funciona `--language es`; `--locale es-CL` fue rechazado para esta voz.
- Se generaron tres MP3 válidos en `paes/nm2/assets/audio/`: `01-narradores.mp3` (45,61 s), `02-tiempo.mp3` (43,49 s), `03-personajes.mp3` (46,13 s). HeyGen rechazó el resto por crédito insuficiente; quedaban 22 segundos de voz gratuita. No repetir la tanda sin recarga confirmada o saldo suficiente.
- Guiones y generador de 37 clips (13 explicaciones + 24 preguntas acompañadas): `C:/dev/profe-blog/scratch/nm2-audio-20261117/generar.py` y `guiones.json`. El generador conserva respuestas y archivos ya generados. Validó decodificación y alineación del texto de los tres clips. **No existe aún `audios.json`.**
- Cambios sin commit: `paes/nm2/common.js` y `lesson.js` reemplazan speechSynthesis por audio MP3 con pausa/continuar y detención al navegar. Falta probar reproducción real, errores y ausencia de solapamiento.
- `scripts/audit-paes-nm2.js` tiene seis líneas nuevas que exigen los 37 clips y `audios.json`. **Actualmente ese audit fallará por el archivo ausente.** No desplegar este trabajo incompleto ni desactivar el control para aprobar el build.
- Higgsfield: skill `C:/Users/franc/.codex/skills/higgsfield/SKILL.md`; CLI `C:/Users/franc/.local/bin/higgsfield.exe`. Modelos `elevenlabs_v4`, `elevenlabs_v4_turbo`, `inworld_text_to_speech`, `qwen_audio_tts`, `seed_audio`, `text2speech_v2`. Consultar workflow y costo antes de generar. Catálogos locales en scratch: `higgs-modelos.json` (UTF-16 LE), `higgs-workflows.json` y `higgs-voces.json` (UTF-8 BOM). No se ha elegido ni escuchado una voz Higgsfield.
- Fuente oficial verificada: https://higgsfield.ai/text-to-speech .

## Evidencias y límites

Pruebas anteriores, generadores de PDF y capturas: `C:/dev/profe-blog/scratch/nm2-20261116/`. Revisar scripts antes de reutilizar: algunos regeneran PDF y otros reanudan un registro de producción antiguo. En Chromium usar `--disable-http2` ante los fallos de red conocidos; esperar contenido e imágenes visibles, no `networkidle`.

Hay numerosos cambios ajenos en el árbol compartido, incluidos juegos, videos y archivos de la raíz. Conservarlos. Agregar únicamente rutas explícitas. No commit del código de audio incompleto, no `git add -A`, reset, force ni publicación desde árbol compartido sucio.

Este documento cierra la sesión por la regla de ritmo de Francisco: después de compactación se guarda el estado y se continúa en sesión nueva. Mensaje de reanudación sugerido: «Continúa la ampliación de NM2 desde docs/RETOMAR_NM2_EJERCICIOS_Y_VOZ_2026-11-17.md». El encargo pedagógico sigue pendiente.
