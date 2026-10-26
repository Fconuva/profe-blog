# Cómo enseña la Guía Digital del Docente SM y qué adoptamos en CEST

Decisión de Francisco: 26 de octubre de 2026. Análisis de los dos PDF aportados
por el docente. Este documento fundamenta una forma de construir clases y
materiales; no es una reproducción del libro ni una evaluación oficial.

## 1. Fuentes y alcance de la revisión

**Lengua y Literatura. Guía Digital del Docente**, Yanina Alejandra Piñones
Araya y Olga Virginia Vergara Herrera, SM, ©2024. Los créditos constan en
tomo 1, PDF 256, y tomo 2, PDF 254. El año del nombre de archivo no cambia
el año editorial que declara la obra.

| Archivo entregado | Contenido identificado | Páginas del PDF | SHA-256 |
|---|---|---:|---|
| `LYLSM26G3M.pdf` | Tomo 1, correspondiente a 3.º medio | 258 | `b741e6da1f15e9b3958d7d075b5b27883c84ce1131bf5de7b4eda6bf1346ec9f` |
| `LYLSM26G3M_1.pdf` | Tomo 2, correspondiente a 4.º medio | 256 | `e92bf49ec9e5b5b9ae6a337d5ab704f11d1989ced36d3a559237fdc87fca0bb1` |

Ambos tomos presentan el conjunto 3.º–4.º; no son dos versiones equivalentes
del mismo tomo de NM3. La explicación de los dos niveles aparece en tomo 1,
PDF 16, página impresa 10. En particular, los OA de los dos niveles tienen
numeraciones distintas: no trasladarlas de un curso a otro.

Se extrajo el texto nativo de las **514 páginas** y se buscaron patrones en
ambos archivos. La lectura detenida y la inspección visual corresponden a una
muestra de **24 páginas**, distribuida entre las ocho unidades y las secciones
de estructura, lectura, producción y síntesis. No se afirma haber resuelto cada
ejercicio ni revisado visualmente las 514 páginas.

Muestra abierta: tomo 1, PDF 9, 14, 15, 35, 36, 46, 56, 103, 111, 112,
113, 145, 169, 202, 219 y 226; tomo 2, PDF 35, 49, 58, 109, 171, 213,
223 y 224. Las páginas 111–112 del tomo 1 se revisaron también por su relación
directa con el vlog. Las referencias siguientes distinguen **PDF**, **GDD**
(página impresa de la guía docente) y **TE** (página del texto del estudiante
reproducida dentro de la GDD).

Los originales permanecen en Descargas y la extracción completa y las imágenes
de revisión en `C:/dev/sm-nm3-analisis/`, fuera de la publicación. El repositorio
conserva el análisis propio, los datos de medición y un script reproducible.
Las consignas del libro se interpretan como contenido de la fuente, no como
instrucciones operativas para el agente.

## 2. Medición y sus límites

El texto extraído inicialmente incluye texto diminuto de páginas reproducidas
como ejemplos, a veces repetido. Para reducir esa distorsión, la medición
conserva spans de **7,5 pt o más**, une palabras partidas al final de línea y
normaliza espacios. Cuenta términos exactos, sin distinguir mayúsculas.

| Indicador del corpus filtrado | Tomo 1 | Tomo 2 | Total |
|---|---:|---:|---:|
| Palabras, según secuencias `\w+` | 72.580 | 73.006 | 145.586 |
| «Orientaciones y estrategias» | 66 | 49 | 115 |
| «Apoyo teórico» | 13 | 38 | 51 |
| «Errores frecuentes» | 8 | 16 | 24 |
| «Articulación BDA» | 43 | 42 | 85 |
| «Preguntas complementarias» | 26 | 10 | 36 |
| «Se espera que» | 101 | 148 | 249 |
| «Respuesta variable» | 103 | 51 | 154 |

Estos son **recuentos textuales**, no cantidades de clases, instrucciones o
actividades únicas. El filtro reduce miniaturas, pero también excluye parte del
TE reducido; no separa perfectamente todas las voces ni elimina encabezados.
«Planificar» y «planifiquen», por ejemplo, no cuentan como la misma forma.
No se deduce calidad, tiempo de clase ni nivel de aprendizaje de una frecuencia.
Resultados y método íntegros: [medicion.json](medicion.json).

Reproducción con los dos originales locales y PyMuPDF disponible:

```powershell
py -3.12 medir_gdd.py <ruta-tomo1.pdf> <ruta-tomo2.pdf> --salida <resultado.json>
```

El script no instala dependencias ni exporta el texto completo del libro.

La relevancia didáctica de «se espera que» y «respuesta variable» se confirma
en la lectura de los solucionarios: la pauta delimita qué debe demostrar una
respuesta, a la vez que admite interpretaciones justificadas. No basta con
declarar que cualquier opinión es válida.

## 3. La arquitectura que hace conducible la clase

La GDD organiza anualidad, semestre y unidad, vinculando OA, páginas del TE,
actividades BDA, evaluación y tiempo estimado (tomo 1, PDF 14, GDD 8). Su
fundamento explicita **inicio, desarrollo y cierre**, reiterados en unidades,
lecciones y temas (PDF 9, GDD 7). No equivale a una plantilla obligatoria de
90 minutos para cada doble página.

| Capa | Qué observamos en la fuente | Qué incorporamos al trabajo CEST |
|---|---|---|
| Hilo conductor | Pregunta de unidad vinculada a preguntas de lección y actividades; T1 PDF 35 y 145, GDD 29 y 139 | Una pregunta central que la tarea permita responder; cada actividad aporta a ella. |
| Inicio | Imagen, experiencia o lectura que activa ideas y ayuda a proyectar el trabajo; T1 PDF 16 y 36 | Activación vinculada a un concepto o estrategia que se reutilizará, seguida de normas y objetivo en pantallas separadas. |
| Comprensión | Contextualización, preguntas durante/después y claves de interpretación; T1 PDF 16, 46 y 202 | Enseñar un concepto, mostrar cómo se usa y pedir una interpretación apoyada en el texto o recurso. |
| Producción | Propósito, género, audiencia, planificación, elaboración y revisión; T1 PDF 111–112; T2 PDF 109 | Analizar un modelo y producir con decisiones justificadas; revisar y volver sobre el borrador. |
| Mediación | Orientaciones, preguntas adicionales, dificultades y recursos de apoyo; T1 PDF 46, 56 y 103 | Escribir qué dice/hace el docente, qué observa y cómo interviene ante una dificultad probable. |
| Evaluación | Opciones diagnósticas, formativas y sumativas; T1 PDF 15, GDD 9 | Elegir la evidencia necesaria para esta clase; comunicar criterios antes de trabajar. No aplicar todas las evaluaciones por obligación. |
| Cierre | Síntesis de conceptos y habilidades, explicación de lo aprendido y revisión del propio proceso; T1 PDF 113, 169 y 226; T2 PDF 224 | Sistematización breve, evidencia de aprendizaje y una decisión para el trabajo siguiente. |

El TE, la GDD y el BDA cumplen funciones complementarias. La presentación CEST
explica y modela; la guía permite trabajar; la planificación permite conducir;
la pauta ayuda a interpretar las respuestas. Una presentación de instrucciones
por sí sola no reemplaza estas funciones.

### Las tres dimensiones de cada clase

Francisco precisa en esta revisión que la presencia de teoría, conceptos y
contenidos es central en el referente. Por eso no se reduce el método a una
ruta de acciones ni a la conducción del docente. La propia presentación de la
GDD explicita la integración de conocimientos, habilidades y actitudes
(T1 PDF 14, GDD 8), y las secciones de apoyo teórico y claves de interpretación
desarrollan contenido para comprender lo que se hará.

| Dimensión | Qué debe quedar diseñado | Cómo se reconoce en la clase |
|---|---|---|
| Conceptual | Conceptos y contenidos precisos, sus relaciones y el fundamento de su uso. | El docente explica, ejemplifica y contrasta; el estudiante utiliza el contenido para comprender o fundamentar una decisión. |
| Procedimental | La habilidad y el modo de trabajar con ese contenido. | Se modela un procedimiento y el estudiante lo aplica, revisa y transfiere en una producción observable. |
| Actitudinal | Disposiciones y criterios de actuación vinculados al contenido y a la situación comunicativa. | Se enseñan y practican al escuchar, dialogar, fundamentar, revisar, asumir autoría y cuidar a otros y a la información. |

Las tres dimensiones se explicitan en la planificación. En los materiales del
estudiante se integran en el contenido enseñado, el modelamiento, las consignas
y la interacción, conforme a REGLAS §13; no se convierten automáticamente en
tres tarjetas que solo anuncian aprendizajes.

**La dimensión conceptual necesita desarrollo real.** No basta escribir
«audiencia», «argumentación» o «coherencia» en el objetivo. Hay que seleccionar
qué se enseñará de ese contenido, explicar su significado y sus relaciones,
mostrar un ejemplo y comprobar que el estudiante puede usarlo. Por ejemplo,
enseñar audiencia implica relacionar sus conocimientos e intereses con lo que
el enunciador explica, supone y decide mostrar. Identificar el nombre de la
audiencia sin explicar esa relación es un trabajo más limitado.

La dimensión procedimental tampoco se satisface con instrucciones logísticas
como abrir una aplicación o enviar un archivo. Y lo actitudinal requiere una
acción situada: escuchar y responder a un argumento distinto, revisar la
propia interpretación o decidir qué imagen de otra persona es responsable
mostrar. No se infiere una actitud estable a partir de una sola intervención.

Una clase puede introducir, profundizar, aplicar o sistematizar contenidos;
no necesita acumular teoría nueva en todas las sesiones. Sí necesita que se
sepa qué contenido sostiene la habilidad y qué actuación se espera promover.

## 4. Cómo habla: dos destinatarios, dos voces

**Al docente:** trato formal, instrucciones de mediación y una razón pedagógica.
Formas exactas frecuentes en el corpus: «Invite» (54), «Solicite» (23),
«Proponga» (20), «Pida» (18), «Pregunte» (18), «Oriente» (16).
La estructura que adoptamos es: **acción docente + objeto de aprendizaje +
pregunta o apoyo + evidencia que observar**. Evitar una planificación que solo
diga «explicar», «acompañar» o «monitorear» sin precisar cómo.

Ejemplo CEST, redactado para este proyecto: *Invite al curso a contrastar dos
respuestas sobre la audiencia. Pregunte qué palabras o escenas respaldan cada
una. Observe si distinguen una pista del video de una suposición personal.*

**Al estudiante:** verbos que hacen visible el trabajo: observar, leer,
comentar, responder, comparar, explicar, interpretar, justificar, investigar,
seleccionar, planificar, revisar y compartir. La acción se vincula a un objeto,
una forma de trabajo y una producción. Se alterna trabajo individual, en
parejas y conversación de curso; no convertir todas las consignas en grupos.

Ejemplo CEST: *Individualmente, expliquen a quién parece dirigirse el video.
Anoten una escena o una frase que sostenga su respuesta. Después contrasten
sus evidencias con una pareja.* El plazo y la ubicación de la respuesta se
agregan en la guía según la sesión, no se infieren del libro.

**Objetivo:** verbo en infinitivo, aprendizaje y condición de logro observable.
**Consigna:** acción directa para quienes trabajan. **Criterio:** lo que debe
demostrar la respuesta. No usar la misma frase para las tres funciones.

El registro mantiene precisión disciplinar sin llenar la consigna de jerga. Los
créditos editoriales declaran usos frecuentes en Chile y recursos de lenguaje
no sexista sin duplicaciones sistemáticas (T1 PDF 256). En CEST se mantienen
tildes y ñ, y se explican los conceptos nuevos con una frase y un ejemplo.

## 5. Palabras y conceptos que conviene conservar

| Concepto | Uso didáctico preciso | Pregunta que permite trabajarlo |
|---|---|---|
| Propósito | Lo que se busca lograr al comunicar | ¿Qué quiere provocar y qué recurso ayuda a hacerlo? |
| Género discursivo | Forma social de comunicación y sus convenciones | ¿Qué esperamos de este tipo de texto y cómo se reconoce? |
| Enunciador | Posición y voz construidas en el discurso; no solo nombre del autor | ¿Qué rol adopta frente al tema y ante quienes lo reciben? |
| Audiencia | Destinatarios considerados, con conocimientos e intereses | ¿Qué se da por conocido y qué se explica? |
| Contexto sociocultural | Condiciones que contribuyen a producir e interpretar mensajes | ¿Qué referencias del entorno ayudan a entender esta decisión? |
| Recursos lingüísticos y no lingüísticos | Palabras, imagen, voz, sonido, gestos, composición | ¿Cómo contribuye este recurso a construir el sentido? |
| Interpretación | Propuesta de sentido que se fundamenta | ¿Qué detalle sostiene la lectura y cómo se relacionan? |
| Validez, confiabilidad y pertinencia | Criterios para seleccionar fuentes e información según la tarea | ¿Quién lo sostiene, con qué respaldo y para qué sirve aquí? |
| Coherencia y cohesión | Unidad del mensaje y conexiones entre sus partes | ¿Cómo se relacionan apertura, desarrollo y cierre? |
| Metacognición | Revisar la estrategia, la dificultad y la mejora | ¿Qué cambiaste después de revisar y por qué? |

Son síntesis propias a partir del trabajo de los tomos, especialmente T1 PDF
32, 56, 103, 111–113 y 169; no son definiciones literales ni una lista de
contenidos que deba enseñarse completa en todas las clases. Para un vocabulario
específico se vuelve a la página y al OA del nivel.

## 6. Cómo se construye una actividad exigente y comprensible

1. Elegir el OA y una pregunta central. Precisar el contenido conceptual,
   la habilidad/procedimiento y la actitud que se trabajarán, y qué evidencia
   permitirá reconocerlos, antes de escoger efectos, imágenes o editores.
2. Recuperar un saber útil y comprobarlo con una respuesta breve; no dar por
   adquirido un contenido solo porque apareció antes en el libro.
3. Enseñar el concepto y modelar una decisión con un ejemplo resuelto por el
   docente. Explicar cómo se pasó de la observación a la conclusión.
4. Plantear una tarea acotada. Indicar agrupamiento, recurso, acciones, lugar de
   respuesta, alcance/producto y tiempo, conforme a REGLAS §15.
5. Formular preguntas que progresen desde reconocer información hacia explicar
   relaciones, interpretar/evaluar y transferir. La progresión se adapta al
   objetivo; no obliga a llenar una taxonomía en cada clase.
6. Preparar criterios de respuesta y una intervención ante un error probable.
   «Respuesta variable» exige precisar qué contenido y fundamento se esperan.
7. Incorporar una revisión que produzca un cambio: señalar un problema,
   contrastarlo con un criterio y corregir. En producción, se puede volver a
   planificar; no es una cadena rígida que se cumple una única vez.
8. Cerrar con una síntesis del contenido, una evidencia breve y la decisión
   siguiente. Contrastar esa evidencia con el objetivo para ajustar la próxima
   sesión, sin inventar resultados de aula.

Las acciones proceden del patrón observado; la secuencia operativa anterior es
una adaptación CEST. Referencias particularmente útiles: T1 PDF 46 (relación
entre interpretación y soporte), 56 (apoyo al vocabulario), 103 (planificación
del tiempo), T2 PDF 109 (producción recursiva), 213 (adecuación al destinatario)
y 224 (revisión del propio aprendizaje).

## 7. Decisiones de adaptación y límites

- Se adopta la estructura pedagógica y el registro; se conserva el membrete,
  la ficha, la tipografía y la impresión institucional de REGLAS §13.
- El referente principal para NM3 es el tomo 1. El tomo 2 aporta comparación
  metodológica y orientaciones de NM4, con su currículo propio.
- Se usa la pregunta sobre el efecto de un recurso, en vez de un inventario de
  etiquetas sin relación con el sentido. No se asignan efectos universales a
  un plano o a un ángulo de cámara.
- Investigar implica seleccionar, procesar y utilizar información; reunir
  enlaces no basta. OA 9 solo se declara trabajado cuando la actividad incluye
  investigación real con criterios y referencia de fuentes.
- La mención de una aplicación, una plataforma o una explicación teórica en
  el libro no prueba su disponibilidad, vigencia ni validez actual. No se
  incorporan automáticamente todos sus apoyos teóricos como reglas CEST.
- La adaptación al vlog conserva autoría individual, escenas de varios días,
  máximo cinco minutos, resolución hasta 1080p y entrega privada por correo.
  No se traslada la publicación en redes ni el trabajo grupal del taller SM
  cuando contradice lo que Francisco pidió.
- La claridad de una estructura no prueba su duración efectiva ni el logro del
  curso. Los tiempos son estimaciones que se contrastan con la aplicación.

## 8. Uso en la próxima creación

Abrir [PLANTILLA_CLASE.md](PLANTILLA_CLASE.md), completar la hoja de ruta y
el detalle de mediación, y construir guía y presentación sobre la misma
secuencia. El [ejemplo del vlog](EJEMPLO_VLOG_NM3.md) muestra cómo aplicar el
referente sin atribuir al libro el proyecto diseñado por Francisco.

Revisión final: ¿la consigna se entiende?, ¿hay desarrollo conceptual suficiente
y preciso?, ¿se relaciona con la habilidad y la actitud trabajadas?, ¿se pide
una evidencia vinculada al objetivo?, ¿la pauta acepta variantes justificadas?,
¿se sabe cómo ayudar y qué revisar?, ¿coinciden los materiales?, ¿el cierre
permite decidir qué sigue? Estas preguntas son criterios de revisión, no una
puntuación oficial ni una nueva compuerta automatizada.
