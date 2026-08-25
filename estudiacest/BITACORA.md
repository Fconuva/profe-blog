# Bitácora de Estudia CEST

Registro para retomar el contexto entre sesiones, agentes y máquinas. El bloque más reciente va arriba.

Esto complementa, no reemplaza, a `REGLAS.md`. Aquí va **qué se hizo, qué quedó y qué está pendiente**. Es una bitácora exclusiva de Estudia CEST: no contiene operaciones de portafolios docentes.

No registrar RUT, notas individuales, correos, credenciales, tokens ni información clínica. Una corrección se agrega como entrada nueva; no se borra el antecedente.

---

## 2026-08-24, instrucciones de trabajo para 4DTP

- Se reemplazó el bloque inicial de entrega final de `/4dtp/` por las instrucciones concretas del martes 25 de agosto.
- La portada indica completar cinco entrevistas: tres a compañeros y dos a docentes; cada registro exige nombre, audio y una transcripción de al menos 80 caracteres.
- El último paso visible pide revisar y usar `Entregar avance de Actividad 1` antes de salir.
- En “Las secciones del anuario”, la transcripción quedó marcada para el 25 de agosto y “Aniversarios del colegio” quedó disponible como avance opcional mediante `Textos → Memoria escolar`.
- Se conservan el cronograma, las evaluaciones de avance y la meta final dentro del panel autenticado.
- Validaciones: auditoría 4DTP, build completo y navegador móvil en producción; respuesta HTTP 200, sin errores de consola, recursos fallidos ni desborde horizontal.
- Commit publicado: `f7389417`. Deploy: `dpl_9xqa7PD3Eg71CMMaEL1o6D8t1FdC`.

---

## 2026-08-24, reglas y memoria exclusivas de Estudia CEST

- Se crearon `REGLAS.md` y el `AGENTS.md` propio de esta carpeta para separar la plataforma estudiantil del sistema de portafolios docentes.
- La única fuente editable sigue siendo `C:\dev\profe-blog\estudiacest`; esta bitácora conserva todo el historial operativo previo.
- Las skills y referencias externas pasan a ser puntos de entrada hacia estas reglas, no copias paralelas con instrucciones distintas.
- La nueva regla de cierre exige registrar aquí los cambios de comportamiento, datos, contenido académico, administración o producción.
- No hubo cambios de datos ni de comportamiento productivo en esta separación documental.

---

## 2026-08-20, publicación de resultados PAES hasta la Guía 16

- Se publicaron en Firebase los resultados de las guías 10 a 16 para `3°A HC`, `3°B HC`, `4°A HC` y `4°B HC`. Las guías 17 y 18 continúan sin resultados liberados.
- Las guías anteriores permanecen cerradas para nuevas respuestas. Un estudiante con entrega registrada y resultado publicado conserva un acceso de solo lectura desde el portal y desde Materiales.
- El modo de revisión muestra puntaje, respuesta marcada y clave correcta; además bloquea alternativas, textos y botones de entrega para impedir modificaciones o reenvíos.
- Se corrigió un defecto heredado: las páginas G10–G14 no cargaban `guia-lock.js`, aunque sus tarjetas sí aparecían cerradas. Ahora la URL directa también respeta el bloqueo y el modo de revisión.
- El inicio propio de G14 comunica el RUN validado al candado común, de modo que el acceso directo también queda bloqueado o entra en revisión según corresponda.
- G14 espera la respuesta del candado antes de crear el examen y arrancar su temporizador. Esto evita que un borrador antiguo se autoentregue al abrir una guía cerrada.
- La confirmación de G16 cambia a «Resultados publicados» al mostrar la revisión; ya no conserva el mensaje contradictorio de resultado oculto.
- La API incorporó claves de servidor para G10–G13, recalcula el resultado al leerlo y reconoce entregas históricas anteriores al estado `sent` cuando tienen `submittedAt` y respuestas.
- Se agregó `scripts/audit-paes-release-review.js` al build para verificar claves, liberación, acceso de revisión, bloqueo de edición y sintaxis de los scripts del portal.

---

## 2026-08-20, Guía PAES 18 y secuencia hasta la aplicación oficial

- Se creó `paes/guia18.html`: tres ensayos originales de 532 a 584 palabras, 18 reactivos A–D de dificultad alta y estrategia explícita para seguir tesis, giro, función y alcance.
- La Guía 18 autoguarda, permite entregar con respuestas pendientes, confirma la escritura leyendo la API y mantiene clave, puntaje y retroalimentación ocultos hasta la habilitación docente.
- El portal PAES quedó en orden `16 → 17 → 18`; solo la 18 dice `Sesión actual`. Se añadieron tarjetas grises G19–G31, el receso del 17 de septiembre y el hito PAES Regular del 30 de noviembre al 2 de diciembre.
- `paes/guias.html` ya incluye G17 y G18. En el administrador se agregó G18, el libro de notas llega hasta G18 y G16 fue corregida de 15 a sus 25 preguntas reales.
- Se añadió `scripts/audit-paes-g18.js` al build y se amplió el contrato para reconocer `QUESTIONS.length`. Las pruebas de navegador cubren entrega con una respuesta y sin respuestas.

Secuencia planificada: G19 vocabulario en contexto; G20 relaciones entre textos; G21 simulacro parcial; G22 distractores; G23 evidencia y consistencia; G24 discontinuos avanzados; G25 simulacro 1; G26 retroalimentación; G27 inferencias globales; G28 simulacro 2; G29 plan personal; G30 ensayo final; G31 estrategia final.

---

## Dónde vive todo (leer antes de tocar nada)

| Qué | Dónde |
|---|---|
| Fuente editable | `C:\dev\profe-blog\estudiacest` (repo `Fconuva/profe-blog`, rama `main`) |
| Deploy | `npm run deploy:prod:safe` desde esa carpeta. Vercel directo está prohibido |
| Dominio | `https://www.estudiacest.com` (proyecto Vercel `estudiacest`, root dir `estudiacest`) |
| Base de datos | Firebase `estudiacest`, RTDB `estudiacest-default-rtdb`. NO es `profe-blog` |
| Storage | Bucket `estudiacest.firebasestorage.app`. Reglas en `storage.rules`, se publican con `npx firebase deploy --only storage --project estudiacest` |
| Reglas RTDB | `firebase-rules.json`, se publican con `npm run deploy:rules`. Vercel no las despliega |
| Guardas de release | `scripts/academic-release-manifest.json` (9 áreas, 50 archivos críticos) y `scripts/class-submission-contract.json` |
| Workflow operativo | `00 - Workspace y Soporte/03 - Deploy y Referencia/ESTUDIACEST_WORKFLOW_OPERATIVO_2026.md` en el workspace de OneDrive |

**Carpetas que NO son la fuente.** `C:\Users\franc\profe-blog-work` es un segundo clon del mismo repo y suele estar atrasado. `profefconuva/estudiacest` dentro de OneDrive es una copia espejo. El repo `Fconuva/estudiacest-2026` (clon `C:\Users\franc\estudiacest-2026`) está congelado desde el 27-jul-2026 y solo sirve de archivo histórico. Desplegar desde cualquiera de esas tres borra secciones de producción.

---

## 2026-08-18, tres unidades abiertas y una herramienta de evaluación

Semana de apertura de Unidad 3 en los tres niveles. Veintisiete commits entre el 16 y el 18 de agosto.
Lo que sigue está ordenado por tema, no por commit, con el hash al lado para poder volver.

### NM4 · Unidad 3, Comunicación para el mundo laboral

**La Clase 2 pasó a formato presentación** (`9cba3bd0`). Catorce slides con botones adelante y atrás,
navegación por teclado, deslizamiento con el dedo en teléfono y enlace propio por slide (`#8`). Cada
slide lleva **cronómetro** cargado con los minutos de ese momento, porque las cinco estaciones duran
nueve minutos cada una y el slide marca la rotación. Antes de eso se había rehecho entera con video
propio, y después pasó a **trabajo en parejas sin botones de impresión** (`ed2c556b`).

**La unidad se reordenó y cambió cómo se evalúa** (`15b8d2ca`). Ya no hay prueba: la nota sale de la
**revisión de cuaderno y timbres** el 28 de septiembre. Las clases quedaron así, con su equivalencia
para 4°D, que trabaja los martes:

| # | Clase | Fecha |
|---|---|---|
| 3 | Currículum joven | 24 de agosto |
| 4 | Industria 4.0 · investigación | 31 de agosto |
| 5 | La entrevista de trabajo | 7 de septiembre |
| 6 | Escribir en el trabajo | 21 de septiembre |
| — | Revisión de cuaderno y timbres | 28 de septiembre |

Se agregó además la **interrogación de Mocha Dick** del 31 de agosto al 7 de septiembre, dicha como
tramo y no como día fijo. En el calendario reemplazó al trabajo de libro que estaba el 28 de
septiembre, en las dos tablas: la de 4°A-4°B-4°C-4°E y la de 4°D.

### NM3 · Unidad 3, Análisis crítico de comunidades digitales

**Se abrió la unidad y se publicó la Clase 1** (`b1aa9162`), sobre el caso de la influencer Rawvana
que aparece en el propio programa oficial de 3° medio. La Unidad 2 quedó compactada en un desplegable,
replicando el patrón que ya usaba NM4.

**El encabezado del portal se simplificó** (`ea605b0b`): quedaron solo el logo, el colegio, la
asignatura y el curso. Salieron el título, el párrafo de presentación, las tres etiquetas y el
recuadro lateral. Con eso el manifiesto pasó a verificar el título del documento, que no cambia al
cambiar de unidad, en vez del encabezado que se acababa de quitar.

**Video de apertura de la unidad, de 4:02** (`87ee8990`). Explica qué es una comunidad digital, cómo
se fabrica y cómo se verifica una noticia falsa, y por qué la unidad termina en un podcast. Se armó
con **veinte imágenes generadas y zoom lento**, no con clips de Veo: Veo cobra por cada ocho segundos
y cuatro minutos habrían sido treinta clips.

**La unidad ya no cierra con prueba escrita.** La nota es el **podcast** y ese mismo día se hace
**revisión de cuaderno** como nota de proceso. Se corrigió también en los dos calendarios del semestre,
que anunciaban "Prueba escrita de la Unidad 3" el 23 de octubre.

**La Clase 1 se decoró** (`44004457`): marco por lámina con filete azul, entrada escalonada por
elemento y nueve imágenes generadas. Dos láminas quedaron sin imagen a propósito, la tabla de
conceptos y la noticia, porque ahí la figura caía bajo el pliegue y no se veía al proyectar.

### SIMCE NM2 · Clase 6

**Poesía y lenguaje figurado, con Siglo de Oro** (`bf04d2cd`). La primera versión usaba dos poemas
inventados y cuatro figuras; Francisco pidió rehacerla. Quedó con **veintidós figuras agrupadas en
cinco familias**, los tópicos literarios, la estructura del soneto y **dos sonetos de dominio público
que el anexo de lecturas de las Bases Curriculares nombra**: Garcilaso, Soneto XXIII, y Lope de Vega,
Soneto 126. Cuatro ilustraciones generadas en estilo pictórico de época.

Los catorce ítems se midieron antes de publicar: claves repartidas A3 B3 C4 D4 y la clave es la más
larga en 2 de 14, por debajo del 25% que daría el azar. Son los dos sesgos que la auditoría de julio
encontró en las guías anteriores.

### Anuario 4°D

**Se anunciaron las nueve secciones** (`159f135a`), todas en gris y sin formulario todavía, para que
cada estudiante sepa qué material juntar: transcripción de entrevistas, aniversarios, profesores jefe
de primero y segundo, profesor jefe actual, el curso con fotos, algo creado en la especialidad, una
asignatura del plan común, la asignatura favorita y fotos con amigos. La entrega pasó de "fines de
octubre" a la fecha exacta: **martes 27 de octubre**.

### Disertación técnica 3°ATP

**Se arregló el cálculo de nota** (`b66297cd`) y se cargaron los puntajes del Grupo 1.

### Mocha Dick · plan lector NM4

Se leyó el libro completo, página por página, desde un PDF escaneado de 145 páginas sin texto
extraíble. De ahí salieron tres cosas:

- Un **análisis con banco de 50 preguntas y respuestas**, en PDF, para el profesor.
- La **página de estudio** con las 50 preguntas sin respuesta, la mecánica y la escala de evaluación
  (`d54e0ab0`), más el PDF del libro para descargar.
- La **herramienta para calificar** (`b885f93b`), en `/nm4/interrogacion-mocha-dick/calificar/`.

**Sobre la herramienta.** Entra cada docente con su nombre y una clave compartida, y ve solo sus
cursos: Alicia Aguilera 4°A, Joselin Díaz 4°D y 4°E, Pía Benavides 4°B y 4°C. Sortea 7 preguntas de
las 50, permite cambiar una sola —y la nueva la elige el sorteo, no el docente—, puntúa de 0 a 1,0 en
décimas y guarda. La nota es la suma, con piso 1,0.

Cuatro decisiones que conviene no deshacer:

1. **La clave se valida en el servidor**, nunca viaja al navegador. En el código solo vive su hash
   SHA-256, reemplazable con la variable `INTERROGACION_HASH` en Vercel sin tocar el repositorio.
2. La comparación de la clave es **en tiempo constante**.
3. **El servidor rechaza guardar en un curso ajeno**, no solo la interfaz. Está probado en producción:
   con Alicia intentando escribir en 4°C, responde "Ese curso no le corresponde".
4. La nómina entrega curso, número de lista y nombre. **El RUN no se envía al navegador**, igual que
   en la página de asistencia.

### Lecciones técnicas de la semana

**Una sección vacía no dice dónde está la falla.** La Clase 6 se publicó y las preguntas no aparecían.
La causa no estaba en las preguntas: al reescribir el cuerpo se perdieron siete elementos que el
script necesitaba, y el primero que buscaba —`warmupZone`— lanzaba una excepción que mataba el script
antes de pintar nada (`3eb6183e`). **El chequeo que lo detecta en un segundo es comparar los
`getElementById` del script contra los `id` del HTML.** Correrlo siempre después de reescribir el
cuerpo de una guía.

**En ese mismo arreglo apareció un error silencioso peor:** el textarea del desarrollo había quedado
con otro `id`, así que lo que escribiera el estudiante no se habría guardado nunca. No daba error
visible; simplemente se perdía.

**Escribir con `open(f,'w')` trunca antes de fallar.** Un `UnicodeEncodeError` a mitad de escritura
dejó un HTML de 43 KB en cero bytes. Se recuperó desde git. Desde ahora: escribir a `.tmp` y
`os.replace`.

**Los emojis fuera del BMP rompen la escritura en Python** si quedan como pares surrogate. Costó tres
intentos. Si no son esenciales, no ponerlos.

**Los guardianes hicieron su trabajo dos veces.** El auditor del anuario bloqueó el build porque
exigía la frase de la fecha que se acababa de cambiar (`190eb58d`), y el verificador de release
bloqueó un deploy por un fallo de red al comprobar una URL. En el segundo caso se comprobó que la URL
respondía 200 en tres intentos antes de reintentar, en vez de saltarse el guardián.

### Los veintisiete commits, en orden

| Fecha | Hash | Qué |
|---|---|---|
| 18-08 20:33 | `b885f93b` | Herramienta para calificar la interrogación de Mocha Dick |
| 18-08 20:17 | `d54e0ab0` | Publicar el banco de 50 preguntas y la mecánica de Mocha Dick |
| 18-08 16:55 | `15b8d2ca` | Ordenar la Unidad 3 de NM4 y cambiar cómo se evalúa |
| 18-08 16:24 | `44004457` | Decorar la Clase 1 de NM3 y corregir el cuadro de conceptos |
| 18-08 15:26 | `87ee8990` | NM3 Unidad 3: video de apertura y cambio de evaluación |
| 18-08 15:08 | `190eb58d` | Actualizar el auditor del anuario a la fecha nueva |
| 18-08 15:03 | `159f135a` | Anunciar las nueve secciones del anuario de 4°D y fijar la fecha |
| 18-08 14:55 | `3eb6183e` | Arreglar la Clase 6: no se veían las preguntas |
| 18-08 11:56 | `d257db4f` | Reparar la Clase 6: faltaban elementos y se quedaba sin preguntas |
| 18-08 11:15 | `bf04d2cd` | Rehacer la Clase 6 con Siglo de Oro, figuras ampliadas e imágenes |
| 18-08 10:46 | `978befff` | Publicar la Clase 6 de SIMCE para los cursos |
| 18-08 10:11 | `cc99c1a9` | Proteger la Clase 6 de SIMCE en el manifiesto |
| 18-08 10:07 | `f909d166` | SIMCE NM2: Clase 6 de poesía y plan de la unidad a la vista |
| 17-08 14:57 | `ca28c050` | Corregir el título de la novela en la tarjeta del calendario |
| 17-08 14:53 | `72c7e8ad` | Mover la interrogación de *El lugar sin límites* al 4 de septiembre |
| 17-08 14:37 | `ea605b0b` | Simplificar el encabezado del portal NM3 |
| 17-08 10:22 | `2c5088ca` | Proteger la Clase 1 de NM3 en el manifiesto |
| 17-08 10:18 | `b1aa9162` | Abrir la Unidad 3 de NM3 y publicar la Clase 1 |
| 17-08 08:44 | `b66297cd` | Arreglar el cálculo de nota en la disertación técnica |
| 16-08 18:14 | `9cba3bd0` | Clase 2 de NM4 U3 en formato presentación |
| 16-08 17:28 | `ed2c556b` | Clase 2 de NM4 U3: trabajo en parejas y sin botones de impresión |
| 16-08 17:15 | `c0986c9e` | Registrar en bitácora la Clase 2 rehecha |
| 16-08 17:13 | `bb2bf795` | Proteger los recursos de la Clase 2 en el manifiesto |
| 16-08 17:08 | `f279607d` | Rehacer la Clase 2 de NM4 U3 con video propio y estaciones extensas |
| 16-08 16:32 | `f96f3584` | Quitar la tarjeta de liquidación del portal, se llega desde las clases |
| 16-08 16:22 | `19753ccc` | Proteger la Clase 2 de U3 en producción |
| 16-08 16:17 | `293a7eaf` | Clase 2 de U3 con cinco estaciones de casos laborales |

Ocho de los veintisiete son de manifiesto y auditores, no de contenido. Es el costo fijo de publicar:
cada recurso nuevo entra primero como `allowMissingInProduction`, y recién después de verlo responder
200 en producción pasa a protegido.

---

## 2026-08-16, Clase 2 de NM4 Unidad 3 rehecha

La versión anterior de `/nm4/u3-clase2-derechos-y-seguridad/` abría pidiendo recordar la Actividad 2 de la Clase 1. Francisco avisó que en algunos cursos esa actividad se hizo y en otros no alcanzó el tiempo, así que la clase no puede depender de ella. Se rehízo entera para que funcione sola.

**Video de apertura, `assets/video-rodrigo.mp4`.** Dura 2:02 y cuenta un caso ficticio: Rodrigo, 19 años, dos meses en su primer trabajo, pasa por las cinco situaciones que después se trabajan en las estaciones. Reemplaza la activación que dependía de la clase anterior. Sobre él se responden las tres preguntas en el cuaderno.

Cómo se armó, por si hay que rehacerlo:

- Siete clips de 8 s con Veo 3.1 (`veo-3.1-fast-generate-preview`), estirados a 10 s con `setpts=1.25*PTS`. Los prompts van sin personas en primer plano y con «Silent scene, no dialogue»: el filtro de audio de Veo rechaza lo demás.
- Faltaron dos clips porque se agotaron los créditos de Google AI Studio a mitad de la generación. Se reemplazaron con las propias imágenes de las estaciones en zoom lento.
- Narración con Gemini TTS, voz Charon, 121 s. Devuelve PCM de 24 kHz sin cabecera: hay que escribir el WAV a mano.
- Los subtítulos de `video-rodrigo.vtt` salen de transcribir la narración con Whisper, no de estimar. Así calzan de verdad, y de paso se confirmó que el modelo no leyó en voz alta la instrucción de estilo del prompt.
- **Trampa de ffmpeg que costó un ciclo completo:** en `-loop 1 -t 8 -i imagen.jpg`, el `-t` limita la entrada, no la salida, y `zoompan` emite `d` cuadros por cada cuadro que entra. Cada foto duró 1920 s en vez de 8. Se corta con `-frames:v`, no con `-t`.
- El montaje se ajustó contra los tiempos reales de la transcripción para que cada imagen entre cuando la voz habla de esa situación.
- Salida a 720p: a 1080p pesaba 71 MB y se proyecta en sala y se ve en tablet.

**Las cinco estaciones** pasaron de un párrafo suelto a casos de 110 a 145 palabras, cada una con su imagen generada. Se quitó el recuadro «Dicho en simple», que adelantaba la conclusión que los estudiantes tienen que sacar solos.

Tiempos por momento: 10 + 4 + 10 + 8 + 45 + 10 + 3 = 90 minutos.

Commits `f279607d` y `bb2bf795`. Los ocho archivos nuevos entraron al manifiesto en dos pasos, como corresponde: primero con `allowMissingInProduction`, y después de verificar que responden 200 se les quitó la marca.

**Queda pendiente:** tres imágenes de estación salieron fotorrealistas (`e3`, `e4`, `e5`) y dos como ilustración (`e1`, `e2`). Se intentó rehacerlas pidiendo fotografía documental explícita, pero los créditos estaban agotados. Cuando se repongan, rehacer `e1-horas.jpg` y `e2-liquidacion.jpg` con el prompt que ya está probado.

---

## 2026-08-06, estado del día

### Lo que se construyó

**Bitácora móvil de La Odisea (NM3).** Ruta `/nm3/odisea-antes-del-cine/`, API `api/odisea-cine.js`, panel docente en `nm3/odisea-antes-del-cine/admin.html`. Los estudiantes entran con su RUN y responden desde el celular durante y después de la película. Tiene 24 imágenes generadas con IA y un checklist de 18 acontecimientos con distractores falsos. Padrón de 131 estudiantes vigentes: 45 de 3°A, 48 de 3°B y 38 de 3°D. Los retirados quedaron fuera.

A pedido de la educadora diferencial (Pía Natalia, 6-ago) la actividad quedó separada en dos bloques: **Durante la película** solo el checklist de acontecimientos, y **Después de la película** la descripción de tres personajes, la escena más impactante y la interpretación sobre Penélope y Telémaco. La razón es que nadie escribe descripciones mientras mira la película.

**Proyecto Anuario 4°D TP.** Ruta `/4dtp/`, API `api/anuario-4dtp.js`, administración en `/4dtp/admin.html`. Los 29 estudiantes del curso están cargados por RUN. Cada uno tiene su carpeta con documentos editables, autoguardado y subida de audios, fotos y documentos. La Actividad 1 son cinco entrevistas: tres a compañeros y dos a docentes, grabadas en audio y transcritas. El anuario se imprime en la especialidad, se entregan tres copias cosidas a fines de octubre, y se califica por avance y por entrega final.

**3°ATP quedó archivado, no eliminado.** Su micrositio sigue publicado y protegido por el manifiesto.

**NM3 ordena las fichas desde la más reciente.**

**Guía 16 de PAES publicada**, textos discontinuos, 15 reactivos, con video propio despues de reemplazar uno que estaba reutilizado de la guía 15.

### Storage quedó habilitado hoy

Francisco vinculó el plan Blaze y creó el bucket. Las reglas de `storage.rules` se publicaron el 6-ago y ya están activas. Antes de eso los documentos escritos funcionaban pero las subidas de audio y foto no.

El límite es de **100 MB por estudiante**, unos 2,9 GB para el curso completo. Ojo: en `api/anuario-4dtp.js` las constantes `MAX_FILE_SIZE` y `MAX_STUDENT_STORAGE` valen las dos 100 MB, así que **un solo archivo puede consumir la carpeta entera** de un estudiante. Está pendiente decidir si eso es lo que se quiere.

### Ampliación de la Guía 16 de PAES (tarde del 6-ago)

La guía estaba demasiado breve. Se agregó una **cuarta lectura** con cinco preguntas nuevas, unos 20 minutos más de trabajo. Nada de lo anterior se modificó: las tres lecturas originales y sus 15 preguntas quedaron intactas.

La Lectura 4 es un **gráfico de barras junto a una tabla** sobre cómo llegan al liceo los estudiantes de 3° y 4° medio. Es el cuarto tipo de texto discontinuo que faltaba y se conecta con el instructivo de la TNE de la Lectura 3. Está construida en HTML y CSS dentro de la propia página, sin archivo de imagen nuevo, así que es accesible, responsiva y no agrega peso al deploy. Tiene su transcripción accesible y su caja ATENCIÓN, igual que las otras tres.

Las cinco preguntas nuevas mantienen los invariantes del auditor: enunciado interrogativo, cuatro alternativas de extensión pareja, sin distractores globales, retroalimentación que nombra la clave y sin tres claves iguales seguidas. La guía quedó en **20 reactivos** con claves perfectamente balanceadas, cinco de cada letra.

| Antes | Después |
|---|---|
| 15 reactivos | 20 reactivos |
| Claves A:4 B:3 C:4 D:4 | Claves A:5 B:5 C:5 D:5 |
| LOCALIZAR 3, INTERPRETAR 3, EVALUAR 9 | LOCALIZAR 4, INTERPRETAR 5, EVALUAR 11 |
| Niveles 1:3, 2:9, 3:3 | Niveles 1:4, 2:12, 3:4 |

Se actualizaron en el mismo commit las tres piezas que dependen del total: la clave del servidor `G16_KEY` en `api/paes.js`, las expectativas de `scripts/audit-paes-g16.js` y los contadores visibles de la página. El auditor no se debilitó, se movió al nuevo estado esperado y conserva todas sus reglas de calidad.

Commit `1e109cea`, desplegado y verificado en vivo. Las otras nueve rutas siguen respondiendo 200.

### Quinta lectura de la Guía 16: gráfico de dispersión con cálculo

Segunda ampliación del mismo día, a pedido de Francisco: un texto más, con dispersión, muestra sobre 2.000 estudiantes y preguntas que obliguen a calcular.

La Lectura 5 cruza **horas de estudio semanal contra puntaje promedio del ensayo**. Cada punto es un curso. La muestra es de **2.220 estudiantes en 43 cursos**. Dos líneas de referencia, una vertical en 6 horas y otra horizontal en 700 puntos, parten el gráfico en cuatro cuadrantes, y una tabla entrega los estudiantes y los cursos de cada uno. Está dibujada en SVG dentro de la página, sin archivo de imagen, con `title` y `desc` para lectores de pantalla más su transcripción completa.

Las cinco preguntas no se responden mirando: hay que operar.

| Pregunta | Operación | Resultado |
|---|---|---|
| 21 | Suma de dos cuadrantes | 735 + 245 = 980 |
| 22 | Porcentaje sobre el total | 812 / 2.220 = 36,6 % |
| 23 | División exacta entre grupos | 735 / 245 = 3, un tercio |
| 24 | Fracción más suma proyectada | 428 / 4 = 107, luego 980 + 107 = 1.087 |
| 25 | Juicio sobre la evidencia | correlación no es causalidad |

Los distractores son errores de procedimiento reales, no números al azar. En la 21, la alternativa C suma los cuadrantes I y IV, que es lo que pasa cuando se cruzan los ejes. En la 22, la C calcula sobre los 43 cursos en vez de sobre los 2.220 estudiantes, que es el error más caro de este gráfico y por eso la caja ATENCIÓN lo modela explícitamente.

Se verificó por script que los 43 puntos dibujados en el SVG caen en los cuadrantes que declara la tabla: 15, 5, 15 y 8. Gráfico y tabla no pueden contradecirse.

La guía quedó en **25 reactivos**, con 8 de nivel 3 contra los 4 que tenía. Claves A:6 B:7 C:6 D:6, dentro del margen que exige el auditor.

Commit `3de7fd96`, desplegado y verificado. Las lecturas 1 a 4 y sus 20 preguntas quedaron intactas.

### NM4 abre la Unidad 3 «Comunicación para el mundo laboral»

El portal `/nm4/` se reorganizó. Arriba queda la Unidad 3, del 10 de agosto al 7 de septiembre, con la clase 1 abierta y las otras tres en gris, con solo el título y la fecha, sin enlace. Todo el material anterior de Capital Semilla y de la Unidad 2 quedó agrupado en una sección plegable llamada «Unidades anteriores». No se movió ningún archivo de disco y no se perdió ninguna URL: se comparó el conjunto de enlaces antes y después, y la única diferencia es la ruta nueva.

La **clase del 10 de agosto** vive en `/nm4/u3-clase1-oferta-y-contrato/`. Tiene siete momentos que suman los 90 minutos: activación, objetivo, video, conceptos clave, dos actividades y plenario. Es material para proyectar e imprimir, sin login ni entrega digital, porque la evidencia es el cuaderno, que se revisa y se timbra al cierre.

Las ofertas de empleo son **reales y verificables**: Sugal Group, PF Alimentos y Scania en Talca, más Antofagasta Minerals para el norte. El gancho de la activación es el programa **CAUCE 2026**, donde 24 estudiantes del propio colegio de Mecánica Industrial, Electricidad y Electrónica trabajan dentro de PF Alimentos junto a INACAP. El aviso y el contrato del caso de Camila sí son inventados, y la página lo declara.

El video de motivación se hizo con **Veo 3.1** desde la API de Google AI Studio, y la narración en español con **Gemini TTS** (`gemini-2.5-flash-preview-tts`, voz Charon), con la misma key. Dura 28 segundos, pesa 10,5 MB y lleva subtítulos. Dos gotchas nuevos: Veo bloquea por filtro de audio los prompts con personas en primer plano, y se resuelve pidiendo escenas sin gente y agregando «silent scene, no dialogue, no voices»; y el guard de release exige que el archivo ya exista en producción, así que un recurso nuevo entra en dos pasos con `allowMissingInProduction: true` y después se protege.

Commits `3ccaa74a`, `82095a4e`, `16ebbad4` y `c8a00b40`.

### Dos datos que confirmó Francisco el 6-ago

- **La prueba de plan lector de *El economista callejero* se tomó el 20 de julio.** Queda cerrado que la carpeta `02 - Pruebas y Evaluaciones/Unidad 3/` está rotulada por número de unidad, pero esa evaluación pertenece a la clase del 20 de julio y no a la apertura de la Unidad 3 del 10 de agosto. No volver a levantarlo como inconsistencia.
- **Llegó un estudiante nuevo a 3°D.** El padrón de La Odisea ya lo tiene: 3°A 45, 3°B 48, 3°D 38, total **131**, y el auditor exige ese número. El gráfico de asientos del cine todavía muestra 130, con 3°D en 37, así que **falta un asiento**.

### Commits del 5 y 6 de agosto

Todos en `main`, desplegados y verificados en vivo.

```
41186501  06-ago 10:39  feat(4dtp): explorar carpetas y habilitar acceso PIE
daff9cf9  06-ago 10:18  fix(4dtp): completar registro de archivos en Firebase
81d877de  06-ago 10:15  fix(4dtp): compatibilizar regla de tamaño de Storage
cc4ac9d2  06-ago 09:48  chore(release): proteger recursos 4dtp en produccion
48bc9d81  06-ago 09:44  chore(release): permitir alta inicial de 4dtp
3a909da0  06-ago 09:43  feat(4dtp): crear proyecto anuario con carpetas cloud
4073134a  06-ago 09:00  feat(nm3): crear bitacora movil de La Odisea
1b7701a4  06-ago 07:53  chore(release): enforce guide 16 production assets
9fb1a0a8  06-ago 07:43  fix(deploy): include PAES guide audit
4837ecc9  05-ago 20:27  chore(release): protect current SIMCE unit files
abb0da50  05-ago 20:22  fix(paes): replace reused guide 16 video
bfd181da  05-ago 17:12  feat(estudiacest): preserve academic baseline and publish PAES guide 16
```

`bfd181da` es el commit que devolvió la fuente a este repo. Entre el 22 y el 27 de julio el trabajo había vivido en `Fconuva/estudiacest-2026`, y ese commit reincorporó aquí la Guía 14 de PAES, el 3ATP con sus informes y presentaciones, el video pitch de NM4 y las guías de la Unidad 3 de SIMCE.

### Verificaciones corridas hoy, todas en verde

```
npm run verify:class-submission   -> contrato verificado en 3 clases
npm run audit:paes-g16            -> 15 reactivos, claves y habilidades correctas
npm run audit:odisea-cine         -> 131 estudiantes, 24 imágenes, flujo completo
npm run audit:anuario-4dtp        -> 29 estudiantes, documentos, archivos, admin y reglas
npm run verify:academic-release   -> fuente canónica, Git y 50 recursos críticos correctos
```

Las nueve rutas públicas responden 200: raíz, `/nm3/`, `/nm3/odisea-antes-del-cine/`, `/4dtp/`, `/4dtp/admin.html`, `/3atp/`, `/paes/`, `/estudiantes/` y `/nm4/`.

### Estado de los datos en Firebase

- `plataforma_estudiantes/nm3/odisea_cine_2026/respuestas`: 1 registro, el RUN de prueba `23.132.082-2`.
- `plataforma_estudiantes/nm4/4dtp/anuario_2026/students`: 1 registro.
- `plataforma_estudiantes/admin_scopes/anuario4dtp`: 1 UID habilitado.
- `plataforma_estudiantes/sesiones`: 23 sesiones, incluidas `sesion-u3-1` a `sesion-u3-4`, los dos ensayos SIMCE de miércoles y `ensayo-simce-n3-nm2-2026`.
- `plataforma_paes/guias_config/blocked`: 16 guías bloqueadas, con una excepción individual en `g13`.

---

## Pendientes abiertos

1. **Tope por archivo igual al tope total en el Anuario.** Decidir si un solo archivo puede llenar los 100 MB de un estudiante o si conviene un tope por archivo más bajo.
2. **Correo institucional como alternativa a Storage.** Francisco planteó que los estudiantes tienen cuenta `@alumnosalesiano.cl` y él `frnunez@salesianostalca.cl`. Quedó como opción no explorada frente a guardar todo en Firebase.
3. **Documentos tipo Google Docs en las carpetas.** Francisco lo mencionó como idea. Hoy los documentos son editables dentro de la plataforma, no archivos de Google.
4. **Revisión de la actividad de La Odisea por la educadora diferencial** una vez que esté terminada. Idea de Francisco, aún sin hacer.
5. **`class-submission-contract.json` solo registra 3 archivos**: `estudiantes/guia-u3-s4-infografias.html`, `estudiantes/apoyo-personal/index.html` y `paes/guia16.html`. La Odisea y el Anuario entregan trabajo pero no están ahí. Tienen sus propios auditores (`audit-odisea-cine.js` y `audit-anuario-4dtp.js`), así que la cobertura existe, pero por otra vía. Conviene decidir si se unifican.
6. **Dos secciones se perdieron al volver de `estudiacest-2026`.** `/nm3/clase-conclusion-ensayo/` (visor web con 14 diapositivas en 4K y 8K, más el PPTX, del 24-jul) y `/nm1/` (portal NM1, del 22-jul). Las dos dan 404 en producción y no están en este repo. No hay enlaces rotos apuntando a ellas. Siguen completas en el historial de `Fconuva/estudiacest-2026` si se quieren recuperar. No se encontró ninguna nota que diga que fue una decisión.


### Abiertos al 18 de agosto

**Clases anunciadas y todavía sin construir.** Las tarjetas ya están publicadas y los estudiantes ven
la fecha, así que la deuda es visible:

| Nivel | Clase | Fecha |
|---|---|---|
| NM4 | Clase 3, Currículum joven | 24 de agosto |
| NM4 | Clase 4, Industria 4.0 | 31 de agosto |
| NM4 | Clase 5, La entrevista de trabajo | 7 de septiembre |
| NM4 | Clase 6, Escribir en el trabajo | 21 de septiembre |
| NM3 | Clase 2, memes | semana del 25 de agosto |
| NM3 | Clases 3 a 8 de la Unidad 3 | septiembre y octubre |

7. **Grabador de podcast para NM3.** La unidad cierra en podcast y la nota es esa. Tiene que existir
   antes del 6 de octubre.
8. **Instrumento de la interrogación de *El lugar sin límites*** (NM3, 4 de septiembre). Falta definir
   si es oral o escrita.
9. **El PDF del libro de Mocha Dick quedó público.** Se subió tal como se pidió, y quedó dicho que es
   obra protegida. Si conviene, se mueve detrás del login o se saca.
10. **La tabla de conceptos de la Clase 2 de NM4 ahora se copia al cuaderno.** Los diez minutos de ese
    momento se calcularon cuando no se copiaba. Revisar si los 90 minutos siguen alcanzando.
11. **`matriz.html` de la Clase 2 de NM4 quedó huérfano**: existe pero no lo enlaza nadie.
12. **Dos imágenes de la Clase 2 de NM4 por rehacer** (`e1-horas`, `e2-liquidacion`), que queden como
    fotografía y no como ilustración.
13. **SIMCE: no está confirmado si el Ensayo N°3 se aplicó.** Faltan credenciales de Firebase en esta
    máquina para mirarlo. Además los resultados de la Clase 5 siguen cerrados para los estudiantes
    desde el 12 de agosto, y las guías S3, S4 y S5 no tienen habilidad marcada por ítem.
14. **Capital Semilla.** El informe está fechado el 11 de agosto y `_nomina_completa.json` lo
    contradice: hay que regenerarlo. El video de Torres Zúñiga (4°E, entregado el 12 de agosto) está
    descargado y sin calificar, y hay 21 estudiantes que aparecen en los correos y siguen sin nota.

---

## Historial anterior

El trabajo entre el 22 y el 27 de julio quedó registrado en el `BITACORA.md` del repo `Fconuva/estudiacest-2026`, que se congeló el 22-jul. Ahí están la auditoría de bugs en vivo del 14-jul, la reconciliación de contenidos del 19 al 21 de julio y el detalle de las clases de la Unidad 3.
