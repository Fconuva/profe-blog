# NM2 HC: voz Diego de Higgsfield · 17-nov-2026

Francisco aprobó expresamente la muestra de 26 segundos con «Usar esta voz». Se reemplaza la voz del navegador por **Diego (es)**, modelo `inworld_text_to_speech` de Higgsfield, en las cuatro clases del 18/25 de noviembre y 2/9 de diciembre. Las explicaciones y ejercicios conservan el contenido revisado; no se modifican respuestas, intentos ni notas reales.

## Archivos y controles

- 37 MP3: 13 explicaciones ilustradas y 24 lecturas con pregunta y sus cuatro alternativas en el recorrido acompañado. Carpeta `paes/nm2/assets/audio/diego/`; procedencia, guion, duración y SHA-256 en `audios.json`. Los WAV originales y las respuestas privadas del proveedor se conservan en scratch, sin publicar sus URL temporales ni datos de cuenta.
- Pausa y continuación desde la misma posición. Una sola narración activa; se detiene al cambiar lámina, sección, pregunta, biblioteca, página o visibilidad de la ventana. Si falla la carga, muestra un mensaje y permite reintentar. Sin reproducción automática ni sustitución por voz del navegador.
- Los 37 archivos pasan decodificación completa con FFmpeg y tienen guiones cotejados exactamente con las explicaciones y preguntas vigentes. El audit comprueba identidad, proveedor, voz, duración, bytes, SHA-256 y ausencia de claves añadidas al guion.
- Transcripción local con faster-whisper de los 37 clips y revisión de tramos dudosos. Se reemplazaron dos clips: una repetición en persuasión y una lectura de alternativas señalada por la transcripción. Las versiones reemplazadas quedan en scratch; los metadatos finales corresponden a los MP3 definitivos. La transcripción automática es apoyo para cotejar contenido, no una evaluación humana de naturalidad ni una garantía fonética palabra por palabra. La preferencia de voz proviene de la muestra aprobada por Francisco.
- Chromium con autenticación y base ficticias: 37 rutas de audio, reproducción MP3 real, pausa, continuación, cambio rápido sin solapamiento, fin del audio, error de archivo inexistente y recuperación, navegación y visibilidad. Cuatro clases a 390/1440/3840 px: 12 vistas sin desbordes ni errores de JavaScript. Prueba final posterior a los reemplazos aprobada.
- Build completo desde worktree aislado aprobado: **1.099 recursos críticos**, incluidos los 37 MP3 y su manifiesto; 813 comprobaciones NM2 más auditoría de audio. No se regeneran los PDF por este cambio de voz.

## Cuenta, coste y alternativas

CLI oficial autenticada, sin instalación ni actualización. Coste consultado antes de generar: dos créditos por clip. Lote inicial: 74; dos reemplazos: 4; muestra: 2. **80 créditos consumidos en este bloque**, coherentes con el saldo observado de 213,45 a 133,45. Sin compras ni cambio de plan. Se conservaron los trabajos existentes y no se duplicó una generación por un fallo local; los rechazos por límite de concurrencia se reintentaron únicamente cuando no se había creado trabajo.

La alternativa gratuita Edge TTS estaba instalada, pero la prueba real de la voz chilena recibió HTTP 403 y no produjo una muestra válida. No se atribuye peor calidad a esa voz ni se intenta eludir el rechazo. Kokoro y ElevenLabs se consultaron como alternativas; no se instalaron modelos ni se abrieron cuentas.

Evidencia local: `C:/dev/profe-blog/scratch/nm2-audio-20261117/`: `guiones.json`, `higgsfield-jobs/`, `higgsfield-correccion/`, `transcripciones-diego.json`, `revision-tramos-2.log`, `revision-tramos-3.log`, `correccion-13-asr.log`, `correccion-g04-asr.log`, `qa-audio.cjs`, `qa-audio.json`, `qa-audio-final.log` y `build-diego.log`. El modelo Whisper small agotó memoria durante el cotejo; se continuó con base local, sin descarga ni servicio externo de transcripción.

## Publicación

Código `f8da9daf` en `main` y `origin/main`; worktree de publicación limpio. `npm run deploy:prod:safe` aprobó fuente, Git y los **1.099 recursos críticos** utilizando un auxiliar local de fetch nativo secuencial tras comprobar 40 respuestas. Solo serializa lecturas públicas: no cambia TLS, URL, estados, plazos, reintentos ni criterios. Log `scratch/nm2-audio-20261117/deploy-diego-secuencial.log`. El intento normal previo se interrumpió durante conexiones sin completar; no se cuenta como aprobado.

La subida posterior termina con código 134: `Committing semi space failed. Allocation failed - JavaScript heap out of memory`. Windows tenía aproximadamente 581 MiB de memoria comprometible libre. No se cierran otras apps ni se cambia la configuración del sistema. **No publicado**: el alias posterior sigue en `dpl_EYu5xEgNxxmLMsw3LNPPpHyx3HWe`, READY, código `502a2f3c`. No hay nueva URL ni ID que acredite publicación. No quedan procesos de este bloque activos. Reanudar desde el handoff tras liberar memoria; no regenerar ni pagar nuevamente el lote. El ingreso con cuentas reales de 2A/2B sigue pendiente; estas pruebas ficticias no lo acreditan.
