# Ensayo final de Competencia Lectora · 4.º A y B HC

Ruta `/paes/ensayo-final-4hc/`, sesión `paes-ensayo-final-4hc-20261105`, versión `2026-11-05-v1`.

## Contenido
- Cinco lecturas del `Cuadernillo_4HC_CEST_Carta.pdf` (lecturas originales 1, 3, 5, 6 y 7), con su tabla (lectura 1) y sus preguntas justo después de cada lectura. Ítems originales 1–7, 18–25, 39–48, 49–56 y 57–65 = 42 preguntas, renumeradas 1–42 (7, 8, 10, 8 y 9 por lectura).
- Las 42 puntúan. Los controles internos originales 7, 20, 33, 48 y 61 no existen en esta versión.
- Clave 1–42 en servidor: `CADBCBAACDBADCBDBACDABCADBCDABDCACDBACBDAB` (A 11, B 11, C 10, D 10). No viaja al cliente; las opciones se mezclan por UID.
- Texto y preguntas comparados con el PDF (`pdftotext`): coinciden; solo difieren pies de página y celdas de tabla ajustadas en varias líneas.

## Reglas
- 90 minutos desde Comenzar, con plazo en servidor, persistente al recargar y entrega automática al vencer (`endedBy: time`).
- Integridad con `paes/mini-invierno-2027/integridad.js`: tres strikes entregan el avance; el docente puede quitarlos sin perder respuestas ni reloj.
- Nota con exigencia 60 %: 0 % = 1,0; 60 % = 4,0; 100 % = 7,0; un decimal.
- Resultado, claves y retroalimentación privados hasta que el docente publica por curso (4A-HC / 4B-HC).
- Solo 4A-HC y 4B-HC; otros cursos reciben 403.
- No se conecta a `api/_paes-nota-auto.js`: el promedio final se calcula aparte.
- Ruta acompañada (`variant: guided-access-2026`) para 4.º A: extracto literal de la lectura 5, seis preguntas A–D una a la vez, lectura en voz alta, sin temporizador ni nota.

## Validación local (5-nov-2026)
- `node scripts/audit-paes-ensayo-final-4hc.js`: 69 comprobaciones.
- `node scripts/check-paes-ensayo-final-4hc.js`: 39 comprobaciones en Chrome real a 390 y 1440 px con base simulada (ingreso, guardado, red caída, recarga, reloj, strike, tercer strike, entrega, relectura, panel docente, publicación, vencimiento, ruta acompañada, ausencia de claves, consola y red sin fallos).
- `npm run build` en verde.
- Pendiente: despliegue y prueba contra Firebase de producción (no hechos).
