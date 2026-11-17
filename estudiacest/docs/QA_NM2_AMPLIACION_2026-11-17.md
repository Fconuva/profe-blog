# Ampliación NM2 HC · 17 de noviembre de 2026

**Estado: construido, verificado técnicamente y aprobado por dos revisores independientes; publicación bloqueada por conectividad.** Código `e3bc464b` integrado y respaldado en `origin/main`. Francisco autorizó expresamente a los dos revisores el 17-nov. Trabajaron por separado, a ciegas y solo con material público; no abrieron las claves ni editaron o publicaron archivos. No se modificaron intentos ni notas reales. La ampliación no está publicada: el alias verificado conserva el código `502a2f3c`.

## Material construido

| Fecha | Foco | Alternativas | Lecturas | Escritura | Páginas PDF |
|---|---|---:|---:|---:|---:|
| 18-nov | Narrador, tiempo y construcción del relato | 48 | 4 | 6 | 27 |
| 25-nov | Lenguaje figurado, poesía y sentido | 48 | 4 | 6 | 27 |
| 2-dic | Argumentación, evidencia y alcance de las razones | 48 | 4 | 6 | 27 |
| 9-dic | Teatro, medios, persuasión y lectura de datos | 48 | 4 | 6 | 28 |

Por clase: 16 microejercicios y cuatro textos con ocho preguntas cada uno. Se añadieron 96 alternativas, cuatro textos originales y 12 tareas escritas; total 192 alternativas y 24 tareas. Se conservan 237 fichas, 13 ilustraciones IA y los ejemplos explicados. Los microejercicios aparecen en bloques de cuatro; ninguna consigna depende de desplegar texto oculto.

Las lecturas nuevas son «Dos páginas para una maleta», «Otra llave sobre la mesa», «Un punto de préstamo a prueba» y «Qué cuenta cada número». Textos y datos originales/ficticios, identificados como tales; no son material oficial PAES ni reproducción de actividades MINEDUC. La tabla distingue personas que pasan, consultas y ejemplares prestados, sin inferir lectores únicos o causalidad.

En 90 minutos se priorizan 16 microejercicios, una lectura y dos tareas; el resto constituye continuidad hasta el 9 de diciembre. Es una estimación a calibrar con el curso, sin reloj ni promesa de dominio de las 237 entradas.

## Criterios editoriales aplicados

Se leyeron las skills canónicas `estudiacest-material-docente` y `ensayos-impresos-lectura`, con `reactivos-y-analisis.md` y `paes.md`. La segunda excluye las guías de enseñanza de su formato de ensayo: se aplican aquí sus controles de reactivos, junto con la secuencia didáctica del material docente. No se presenta este banco como un ensayo oficial completo ni se trasladan mecánicamente sus cuotas.

Cada nuevo ítem tiene clave privada, evidencia, razonamiento, descarte específico de sus tres distractores, operación y versión. Autorrevisión: consigna única, límite de inferencia, opciones comparables, separación entre observación y causa, autor y hablante, opinión y evidencia. Se redujeron pistas de longitud en tres opciones. Las 24 claves nuevas de cada clase tienen seis A, seis B, seis C y seis D, sin ciclos breves reiterados ni rachas de cuatro. Esto comprueba estructura; **no sustituye la resolución independiente ni acredita dificultad empírica**.

La revisión exigida por `paes/PLAN_CONSTRUCCION_32_GUIAS.md`, §9, criterio 6, está completada. Cada lector resolvió los 96 ítems nuevos y revisó las 12 tareas, leyendo las 16 lecturas. Ambos mapas coinciden con las 96 claves previstas, pero los dictámenes iniciales exigieron precisiones. Coincidir con la clave no bastó para aprobar.

| Localización | Hallazgo | Corrección del autor |
|---|---|---|
| 18-nov q43/q46 | Se añadía un parentesco no acreditado | Mantener abuelo de Clara; no inferir padre de Rosa |
| 25-nov q29 | Dos acciones precedían a la risa | Preguntar por la acción inmediatamente anterior |
| 2-dic q42 | Se cambiaba personas consultantes por interacciones | Conservar personas en la alternativa y el fundamento |
| 25-nov q25; 9-dic q29 | Opciones desiguales en forma/extensión | Homogeneizar nombre y explicación o ubicaciones |
| 2-dic q27/q36; 9-dic q40/q48 | Distractores demasiado ajenos o errores manifiestos | Incorporar errores de lectura plausibles; precisar el resultado de ampliar la colección |
| 18-nov w4; 25-nov w6 | Extensión ambigua o corrección artificial | 4–6 líneas cada versión; corregir una frase si hace falta |

Segunda pasada: ambos lectores resolvieron de nuevo los diez ítems modificados y revisaron las dos consignas aclaradas. **Dos dictámenes finales: APROBAR**, sin claves modificadas ni ambigüedades pendientes. Las observaciones opcionales de 25-nov q28/q48 no bloquean la aprobación de esta clase de enseñanza, según confirmación explícita de ambos lectores. No se atribuye dificultad empírica ni pilotaje.

Registro privado de los dos mapas, relecturas, alcance y SHA-256 del material: `api/_paes-nm2-review.json`. No se publican las letras en este documento ni en el catálogo del estudiante.

## Compatibilidad y validación

- q01–q24, los doce textos originales, w1–w3 y las rutas acompañadas se compararon con v1 y permanecen idénticos. Las entregas v1 conservan total 24, tres tareas y su revisión original. Los borradores continúan en v2 preservando respuestas; el cliente anterior recibe solicitud de recarga. La ruta acompañada mantiene seis preguntas.
- `node scripts/audit-paes-nm2.js`: 813 comprobaciones aprobadas, más controles estructurales de las claves nuevas. Prueba adicional `qa-compat.cjs`: 116 comprobaciones aprobadas sobre las cuatro clases, historial, continuidad, guardado de w6 y entrega sobre 48.
- Chromium con autenticación y base ficticias: 12 recorridos completos (cuatro clases a 390/1440/3840 px), numeración continua 1–48, cuatro bloques micro, cuatro lecturas, seis tareas, guardado/recarga y entrega confirmada. Entregas históricas: tres bloques micro, tres textos y tres tareas cerradas. Sin errores de JavaScript ni desbordes.
- Guías A4 de 27/27/27/28 páginas: 109 páginas sin invasión del pie. Contactos de las cuatro guías abiertos visualmente y páginas nuevas ampliadas, incluida la tabla. Cada texto permanece seguido por sus preguntas; escritura con renglones de 7 mm. Las hojas de ruta caben en una página.
- Evidencias locales reproducibles: `C:/dev/profe-blog/scratch/nm2-audio-20261117/qa.cjs`, `qa.json`, `qa-navegacion.cjs`, `qa-navegacion.json`, `qa-compat.cjs`, capturas y contactos PDF. Usan datos ficticios; no acreditan ingreso con credenciales de estudiantes reales.
- Build integral aprobado desde el worktree aislado `C:/dev/worktrees/nm2-ampliacion-20261117`: todas las auditorías de `prebuild`/`build` y 1.061 recursos críticos. Se conserva el contrato de total dinámico ligado a la versión del intento. Log: `scratch/nm2-audio-20261117/build-ampliacion.log`.

## Respaldo y publicación pendiente

Construcción inicial `6bf33bfa`; correcciones, registro privado y dictámenes finales `e3bc464b`, integrados por fast-forward en `main` y respaldados en `origin/main`. Build final aprobado después de las correcciones: `scratch/nm2-audio-20261117/build-revisado.log`. El árbol compartido contiene cambios ajenos: no usar un `git add` global. Los MP3 pendientes y juegos/videos ajenos quedan fuera del lote de publicación.

Se ejecutó `npm run deploy:prod:safe` desde el worktree limpio, sin modificar el verificador ni el inventario para aceptar fallos. Las pasadas completas se bloquearon por errores de conexión en recursos ya publicados, diferentes entre ejecuciones. Una pasada solo falló en `verificar-documentos-original.png`, que respondió 200 al consultar nuevamente; otra falló en cuatro recursos distintos. Diagnóstico posterior: `UND_ERR_CONNECT_TIMEOUT` y conexiones TCP que no se completan. También falló una consulta independiente con `curl.exe`; no se acredita una caída general de Vercel ni un defecto del contenido.

Se probaron ajustes locales de transporte (concurrencia, reutilización de conexiones y reintentos dentro del mismo plazo) conservando URL, TLS, respuestas y criterios de aceptación. La prueba acotada de 100 HEAD obtuvo 100 respuestas 200, pero no resolvió la inestabilidad de la comprobación integral. No se guardó ningún ajuste de red en el código del sitio. Logs: `scratch/nm2-audio-20261117/deploy-revisado*.log`; auxiliar local `transporte-predeploy.cjs`. Las ejecuciones de diagnóstico interrumpidas no se consideran aprobadas.

Último alias inspeccionado: `dpl_EYu5xEgNxxmLMsw3LNPPpHyx3HWe`, READY, código `502a2f3c`. No hay despliegue nuevo acreditado ni verificación pública de v2. Al recuperar conectividad: consultar de nuevo `origin/main` y el alias, ejecutar el despliegue seguro sin auxiliares de diagnóstico y después `scratch/nm2-audio-20261117/production-v2.cjs` contra el checkout publicado. El script público está preparado, no ejecutado contra v2. Mantener pendiente el ingreso con cuentas reales de ambos cursos.

## Audio separado

Actualización posterior: Francisco aprobó Diego (es), de Higgsfield. Los 37 MP3 están completos e integrados, con pausa/continuación y detención al navegar; desaparece speechSynthesis del cliente. Audit, reproducción real en Chromium y build con 1.099 recursos críticos aprobados. El estado anterior de HeyGen y del parche incompleto se conserva solo como antecedente en el handoff. Véase [QA_NM2_VOZ_DIEGO_2026-11-17.md](QA_NM2_VOZ_DIEGO_2026-11-17.md). El resultado de publicación se registra en la última entrada de BITACORA.md.
