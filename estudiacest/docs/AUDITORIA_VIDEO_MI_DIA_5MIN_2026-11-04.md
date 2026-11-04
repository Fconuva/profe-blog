# Auditoría del video modelo · Mi día en imágenes y voz

Versión del 4 de noviembre de 2026. Archivo: `Mi dia - modelo 5 minutos.mp4`.

## Resultado técnico

- Duración de imagen y audio: **300,000 segundos**, incluidos título y créditos.
- Imagen: **1280 × 720, 30 fps, 9.000 fotogramas**; H.264 / AAC.
- **48 segmentos de montaje**, con duraciones de 4, 5, 6, 7, 8, 9 y 10 segundos. Algunos clips conservan cambios de encuadre internos.
- Diez imágenes nuevas: ojos, mochila cenital, caminata, entrada en contrapicado, techo del gimnasio, ping pong en picado, Inglés sobre el hombro, Matemática inclinada, mano levantada y celebración con camisa blanca.
- Decodificación del archivo completo sin errores. Corregido el redondeo que inicialmente hacía terminar la imagen antes del audio.
- Sonoridad medida sobre el MP4 final: **−17,03 LUFS integrados; pico real −1,89 dBTP**. Música ambiental original suave bajo la voz; sin saturación medida.
- Voz nueva con pensamientos, duda interna, pregunta y reflexión final; duración hablada aproximada: 277 s. Aceleración base 1,05× con ajustes de hasta 1,214× para encajar las partes. No se ralentizó la voz para llenar cinco minutos.
- Subtítulos VTT con texto del libreto y tiempos derivados del reconocimiento local. La transcripción automática sirve como contraste y puede diferir en nombres o puntuación. También se transcribió el MP4 final completo: 57 fragmentos, con la última frase reconocida hasta 297,98 s.

## Revisión visual y pedagógica

Se abrieron las diez imágenes nuevas, los contactos con el centro de los 48 segmentos y los 96 extremos de los cortes. Se corrigieron rótulos, transiciones cortadas y el cambio de chaqueta durante la celebración. Se conservaron los originales en la carpeta del proyecto.

- Planos: general, conjunto, entero, medio, medio largo/corto, primer plano, primerísimo primer plano y detalle. Los rótulos describen el encuadre; no se etiqueta la caminata recortada como americano.
- Ángulos: normal, picado, contrapicado, cenital e inclinado; con variaciones de intensidad. La vista del techo se presenta como contrapicado acentuado, sin llamarla nadir.
- Matemática, 2:10–2:40: se excluye el tramo defectuoso del original. El estudiante aparece pensando, levantando la mano, escribiendo y trabajando en el cuaderno; la toma de la pregunta coincide con la frase de la voz.
- El taller conserva máscara de soldar bajada, guantes y supervisión. El baño escolar aparece desde fuera.
- Hilo interior: expectativa al despertar → duda y pregunta en Matemática → persistencia en taller → comprensión al conversar con la mamá. Hay un breve flujo de asociaciones durante el regreso.
- Rótulos con plano, ángulo y segundos. La guía, página 9, permite localizar ocho ejemplos con tiempos exactos.
- Recreación ilustrada: combina clips animados existentes con fotogramas nuevos y movimiento de cámara. Los espacios son representaciones, no una filmación documental del colegio ni una cartografía exacta de Talca.

## Navegador y guía

Reproducción inicial, salto a Matemática y reproducción hasta el final aprobados en Chromium a 390, 1366 y 3840 px. Sin excepciones JS, errores HTTP ni desbordes en el recorrido comprobado. El servidor local básico sin soporte de rangos impedía buscar en el MP4; la prueba se completó en un servidor con respuestas HTTP 206.

Guía de 19 páginas: PDF abierto, páginas 6 y 9 revisadas visualmente; ninguna página invade su pie. Tres documentos revisados en nueve vistas; ingreso habitual disponible. Build integral aprobado, incluidos 915 recursos del manifiesto. La publicación se acredita por separado tras verificar producción.

Alcance: auditoría técnica completa y revisión visual por muestreo de cortes; no es un dictamen humano independiente ni una observación en aula.

SHA-256 del MP4: `a3c30503d4a9b2a3891f35bae36624dc1b9ff8ce6a984b78a8706f03661aed30`.

## Publicación verificada

Commit de contenido: `51c7b8eacc0ba1cf19600643d5f59f0d60b680a0`. Despliegue seguro: `dpl_9SGsheLuxAcbvX99q8gLqXvmd29E`, READY, proyecto `prj_v2yUaXflcSoBgunqmn1rAEfh0KMR`, alias `www.estudiacest.com`; datos consultados al terminar.

Los seis archivos públicos (tres HTML, PDF, MP4 y VTT) coinciden por SHA-256 con la fuente final, normalizando CRLF en texto. El MP4 público pesa 67.733.380 bytes. Reproducción, salto a 2:20 y reproducción hasta terminar aprobados en 390/1366/3840; capturas de Matemática y cierre abiertas. Nueve vistas públicas de los documentos sin desbordes ni excepciones JS; ingreso habitual accesible. La transcripción del MP4 completo conserva la reflexión final, reconocida hasta 297,98 s.

Entrega: https://www.estudiacest.com/nm3/mi-dia-en-imagenes/ ; conserva la tarjeta de NM3 y el acceso a la guía actualizada. Evidencia en `docs/evidencias/nm3-video-5min-2026-11-04.json`. Cierre documental y corrección del nombre del campo viewport en el control; sin segundo despliegue de contenido.
