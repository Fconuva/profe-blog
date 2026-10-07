# Reglas canónicas de Estudia CEST

Este archivo es la fuente única de reglas transversales para trabajar en
`estudiacest.com`. Los documentos de una sección pueden agregar requisitos
especializados, pero no contradecir estas reglas.

## 1. Límite del sistema

- Estudia CEST es la plataforma académica de estudiantes: acceso, guías,
  evaluaciones, resultados, paneles docentes y proyectos de aula.
- No es el portafolio DocenteMás/CPEIP, la cartera de clientes ni el sitio
  comercial de servicios docentes.
- En una tarea exclusiva de Estudia CEST no se abren fichas de clientes, no se
  aplican reglas de cobro y no se modifica `EvaluacionDocente2026/`,
  `Boveda/Docentes/`, cartera ni libro de caja.
- No se reutilizan credenciales, Firebase, APIs ni datos del sistema de
  portafolios. El proyecto de datos es `estudiacest`.

## 2. Fuente canónica

- Código editable: `C:\dev\profe-blog\estudiacest`.
- Repositorio: `Fconuva/profe-blog`, rama `main`.
- Producción: `https://www.estudiacest.com/`.
- No son fuentes válidas las copias de OneDrive, descargas de Vercel,
  `scratch/`, worktrees temporales ni respaldos antiguos.
- Nunca se restaura un árbol antiguo completo sobre la fuente vigente. Se
  recuperan archivos puntuales y se integran sobre el `main` actual.

## 3. Entrada y sincronización multiagente

Antes de editar y nuevamente antes de publicar:

1. Ejecutar `git fetch origin main`.
2. Revisar `git log --oneline --decorate -10 origin/main`, `git status --short`
   y los archivos cambiados.
3. Si el remoto avanzó, integrar con `git rebase origin/main` o un método no
   destructivo equivalente.
4. Preservar todas las áreas ajenas a la tarea. Un conflicto no autoriza a
   borrar ni restaurar trabajo de otro agente.
5. Agregar al commit solo rutas explícitas. Se prohíben `git add .`,
   `git add -A`, `git push --force`, `git reset --hard` y despliegues desde una
   rama atrasada.

## 4. Conservación del sitio

- Un cambio debe ser local a su superficie: `paes/`, `estudiantes/`, `nm3/`,
  `nm4/`, `4dtp/`, `api/` u otra ruta dueña.
- No borrar, renombrar, archivar ni ocultar contenido vigente fuera del alcance
  solicitado.
- Antes de tocar una portada o un enrutador, inventariar sus tarjetas y destinos
  actuales. Después del cambio, comprobar que siguen presentes.
- Todo recurso crítico nuevo se registra en
  `scripts/academic-release-manifest.json`.
- No se desactivan auditorías para conseguir que un build pase. Se corrige la
  causa.

## 5. Experiencia del estudiante

- Diseñar primero para celular y verificar también escritorio y pantalla 4K.
- La vista inicial muestra solo identidad, tarea actual, avance, fecha o acción
  principal. El detalle va en pestañas, desplegables o vistas secundarias.
- Evitar instrucciones repetidas, párrafos extensos y datos técnicos visibles.
  El estudiante debe reconocer qué hacer en pocos segundos.
- Mantener jerarquía visual, contraste, foco visible, texto legible y controles
  de tamaño estable. Nada puede quedar cortado, superpuesto o fuera del ancho.
- Una actividad no expone claves, reglas internas de puntaje, diagnósticos,
  nombres de variantes ni detalles de implementación.
- Los bloqueos anticopia son disuasivos; nunca sustituyen la validez del
  instrumento ni pueden impedir responder o entregar.

## 6. Guardado y entrega

- Toda clase que guarda o entrega cumple `CONTRATO_ENTREGA_CLASES.md` y se
  registra en `scripts/class-submission-contract.json`.
- El autoguardado usa una cola serializada. La entrega espera esa cola y no puede
  ser revertida por una escritura tardía.
- La entrega final registra juntas `submitted: true`, `completada: true`, sus
  timestamps y los campos de resultado pertinentes.
- El éxito se muestra solo después de leer la confirmación desde el servidor o
  Firebase. El dashboard debe reflejar `Completada`, no `En progreso`.
- El estado se interpreta siempre con el lector canónico descrito en
  `CONTRATO_ENTREGA_CLASES.md`: primero se valida `sessionId + uid + curso`,
  luego se leen juntas `completada` y `submitted`, y recién después se usan
  timestamps, resultado y telemetría como evidencia de apoyo. Un resultado,
  una nota o una traza aislados nunca convierten por sí solos un borrador en
  entrega.
- Una sola marca verdadera es compatibilidad histórica, no un registro sano.
  Puede conservar la visualización de `Completada` si existe evidencia de
  confirmación, pero debe quedar informada por la auditoría para reparar ambas
  marcas. Toda escritura nueva debe dejar el par completo. La reconciliación de
  estados heredados se aplica al padrón completo con
  `npm run reconcile:class-submissions`, primero sin `--apply`; no se crean
  excepciones nominales para un error que puede afectar a más estudiantes.
- El nombre sirve para buscar, nunca para decidir identidad ni escribir. Toda
  lectura, reparación o excepción se resuelve por UID autenticado, curso y
  sesión, comprobando antes posibles UID históricos o duplicados.
- Una corrección manual requiere observación explícita del docente, conserva
  toda evidencia existente, no inventa respuestas ni puntajes y registra fuente,
  fecha y motivo de la atestación. Se simula, se aplica al conteo exacto y se
  relee de forma independiente.
- Una respuesta de conflicto o entrega duplicada (`409`) obliga al cliente a
  releer el intento canónico y reconciliar la pantalla; nunca deja al estudiante
  atrapado en `Pendiente` si el servidor ya confirmó la entrega.
- La entrega no exige respuestas completas salvo que la actividad lo indique
  expresamente y el servidor aplique la misma regla.
- Un error de red conserva el avance, explica qué ocurrió y permite reintentar.
- Toda guía SIMCE interactiva carga `estudiantes/js/work-telemetry.js` con su
  `sessionId`. El registro conserva inicio, entrega confirmada, tiempo activo,
  aperturas, interacciones y contadores de copiar, pegar, cortar, atajos,
  selección y cambios de foco. Nunca guarda el texto ni el portapapeles.
- La telemetría es un indicio para revisión docente, no una prueba automática de
  copia. Si una sesión antigua no tiene `startedAt`, no se reconstruye ni se
  sanciona por velocidad.
- Los paneles de calificación de las interrogaciones NM3 y NM4 abren directamente
  desde su URL `/calificar/`, sin contraseña ni código oculto. La ruta base abre
  el panel de Francisco; `?docente=alicia`, `?docente=pia` y `?docente=joselin`
  limitan la nómina a los cursos asignados. Mantener `noindex` y la validación de
  curso, estudiante, preguntas y puntajes en el servidor.
- Las interrogaciones orales guardan un audio independiente por pregunta en
  Firebase Storage. Cada carga usa un token de alcance único para instrumento,
  docente, estudiante, intento, posición, archivo y tamaño; la lectura pública
  permanece cerrada y el panel obtiene enlaces temporales al revisar.
- Antes de grabar se informa que el audio queda para revisión docente y puede
  analizarse con apoyo tecnológico. La IA nunca califica automáticamente ni se
  usa de forma encubierta: entrega antecedentes y la nota la determina el
  docente. El acceso técnico usa `INTERROGACION_REVIEW_AGENT_HASH` y el script
  local `npm run review:interrogaciones`; el token no se guarda en Git.
- La revisión y calificación de estas interrogaciones sigue la skill
  `.github/skills/estudiacest-oral-interrogation-grading`. Su calibración
  predeterminada es exigencia `60/100`: acepta rasgos normales de oralidad, pero
  exige precisión y evidencia cuando el reactivo las solicita. La cifra es
  interna y no se muestra al estudiante.
- Un audio vacío, corrupto o inaudible se registra como incidencia técnica; no
  se convierte automáticamente en puntaje `0,0`. Toda propuesta asistida se
  escucha y valida antes de que el docente autorice su aplicación.
- Si el estudiante declara que no sabe una respuesta, el docente puede usar
  `No sabe · siguiente`. Esa decisión se guarda como una respuesta explícita sin
  audio, permite avanzar y se propone con `0,0` en la revisión. No se confunde
  con un audio vacío, corrupto o inaudible, y el docente puede reemplazarla por
  una grabación antes de calificar.
- Una interrogación oral completa puede contener audios y respuestas explícitas
  `No sabe`; deben existir siete posiciones registradas antes de entregar. La
  herramienta local omite estas posiciones al descargar audios y las informa
  por separado en su manifiesto.
- En una interrogación oral se sortean siete preguntas. Desde el 22-sep-2026, por
  decisión de Francisco, el docente puede cambiar preguntas **sin tope**, siempre
  antes de comenzar a grabar esa posición. El servidor cuenta los cambios
  (`cambiosPregunta`), guarda las preguntas descartadas para que el sorteo no
  las devuelva mientras haya otras, y rechaza una pregunta repetida o el cambio
  de una respuesta ya iniciada.
- Desde el 24-sep-2026 los dos paneles ofrecen la casilla **Evaluación PIE**:
  el sorteo y los cambios de pregunta, manuales o con audio, salen solo de las
  25 preguntas que eligió la educadora diferencial Alicia Aguilera, y el panel
  muestra su redacción. Son números del mismo banco de 50, así que la pauta, el
  PDF y la revisión no cambian. El registro guarda `bancoPie: true` y el
  servidor rechaza una pregunta fuera de la selección (`preguntasPie` en
  `api/interrogacion.js`, que debe coincidir con `BANCO_PIE` de cada panel;
  lo comprueba `npm run audit:interrogaciones`).
- En el panel docente, la nómina para iniciar una interrogación muestra solo a
  estudiantes sin grabación ni calificación. Quienes ya comenzaron, entregaron
  o fueron evaluados se gestionan desde las tablas de registros, con filtro por
  curso; al eliminar deliberadamente su registro vuelven a quedar disponibles.
- Cuando dos docentes interrogan en paralelo, ambos paneles actualizan la nómina
  desde el servidor cada 30 segundos y vuelven a comprobarla inmediatamente
  antes de iniciar. La actualización conserva la selección si sigue disponible;
  si otro panel ya tomó al estudiante, lo retira de pendientes. El servidor
  rechaza cualquier intento tardío de sobrescribir su registro.
- La suma de logro de las siete respuestas va de `0,0` a `7,0`, pero no es la
  nota. La calificación se calcula con `1 + (logro / 7) × 6`, redondeada a un
  decimal: cero puntos equivale a `1,0` y siete puntos a `7,0`.
- Cuando exista una transcripción revisada, la calificación guarda una síntesis
  fiel de cada respuesta y la muestra en `Ver detalle` y en el PDF A4. No se
  presenta como cita literal si el audio contiene una palabra dudosa.

## 7. Evaluaciones y resultados

- Las claves y el cálculo de puntaje permanecen en servidor. No confiar en
  `score`, `correct` o `total` enviados por el navegador.
- PAES no muestra puntaje, respuestas ni retroalimentación hasta que el docente
  los publique desde el admin para el curso o estudiante correspondiente.
- Un intento enviado es inmutable hasta que el docente lo restablezca.
- Al recalcular notas, identificar primero la sesión y la ubicación real de la
  evidencia. La escritura puede vivir en `notes`, `ticket`,
  `thesisContexts` u otra estructura.
- Toda mutación masiva de resultados se ejecuta primero en simulación, se revisa
  y luego se aplica. La cantidad esperada y aplicada debe coincidir.
- Las adecuaciones individuales conservan el objetivo lector, no exhiben datos
  clínicos y permanecen aisladas del intento regular.
- Toda nueva guía, sesión, miniensayo o ensayo PAES debe publicarse el mismo día
  con la ruta individual guiada del estudiante registrado para este apoyo. La
  adaptación conserva el objetivo lector y usa un estímulo breve, seis preguntas
  A-D, pasos visuales explícitos, una pregunta a la vez, lectura en voz alta y sin
  temporizador. Su acceso es exclusivo; las claves y la retroalimentación quedan
  en servidor con `variant: guided-access-2026`, integración en Firebase y admin,
  y pruebas de celular, guardado, entrega, lectura de vuelta y redirección. La
  interfaz nunca muestra diagnósticos ni el nombre técnico de la variante.

## 8. Administración y datos

- Todo panel con información de estudiantes requiere autenticación y autorización
  verificadas en servidor; una URL difícil de adivinar no protege datos.
- El admin debe permitir filtrar por curso y sesión, revisar evidencia, habilitar
  excepciones individuales, restablecer intentos y publicar resultados según el
  contrato de cada área.
- Las acciones destructivas requieren confirmación y una ruta clara de
  recuperación.
- No escribir RUT, notas, correos, tokens ni credenciales en logs, capturas,
  bitácoras o commits. En pruebas usar datos ficticios o consultas de solo
  lectura siempre que sea posible.
- Una página nueva escribe mediante una API validada si el nodo no tiene regla
  cliente. No se abre una regla de Firebase solo para facilitar una escritura.
- Las reglas de Firebase y el sitio se despliegan por separado. Cambiar Vercel no
  actualiza Firebase.

## 9. Verificación obligatoria

Antes de declarar una tarea terminada:

1. Ejecutar la auditoría focalizada de la sección.
2. Ejecutar `npm run build`.
3. Probar la ruta en un navegador real, en celular y escritorio.
4. Revisar consola, solicitudes fallidas, desbordes y recursos rotos.
5. Si hay guardado: escribir, recargar, leer de vuelta, entregar y confirmar el
   estado en la vista del estudiante y en el admin.
6. Si hay login, API o Firebase: probar en un entorno que sirva funciones; un
   servidor estático local no valida `/api/*`.
7. Comprobar además las portadas de las áreas protegidas por el manifiesto.

## 10. Commit, deploy y cierre

- Confirmar en Git antes de desplegar. El commit contiene solo archivos de la
  tarea.
- El único deploy autorizado es, desde esta carpeta:

  ```powershell
  npm run deploy:prod:safe
  ```

- Se prohíben `vercel deploy --prod` y `npx vercel deploy --prod` directos.
- Todo script nuevo invocado por `npm run build` debe quedar respaldado en Git y
  exceptuado explícitamente en `.vercelignore`; que el build pase localmente no
  demuestra que Vercel haya recibido ese archivo.
- Esperar a que el proceso termine; no dejar sesiones de deploy activas.
- Verificar la URL pública y el flujo modificado después de la promoción.
- Registrar el cierre en `BITACORA.md`: fecha, área, cambio, archivos o rutas,
  validaciones, commit y deploy. La bitácora es exclusiva de Estudia CEST y no
  reemplaza ni se mezcla con historiales de docentes o portafolios.

## 11. Planificación y metodología PAES

- Todas las guías tienen una apertura didáctica antes de practicar: objetivo,
  instrucciones, conceptos definidos, estrategia por pasos, ejemplo razonado
  ATENCIÓN y comprobación formativa. Aplicación y límites en el apartado 2.1
  de `paes/PLAN_CONSTRUCCION_32_GUIAS.md`; también rige para futuras G22–G32.
- La continuidad y el backlog de las 32 guías se mantienen en
  `paes/PLAN_CONSTRUCCION_32_GUIAS.md` (decisión del 10-sep-2026).
- Conservar lo publicado; las guías ausentes quedan planificadas hasta su
  construcción y validación. No renumerar ni sustituir objetivos históricos.
- Excepción autorizada el 10-sep-2026: reconstruir y corregir G1–G9 para unificar
  el formato interactivo actual. Conservar PDF y registros anteriores como
  históricos; corregir el foco mal descrito de G2. G10–G21 y el backlog posterior
  no se sustituyen por esta autorización.
- Respetar la fórmula recuperada de los libros y los formatos acordados,
  documentados en ese plan. Antes de reutilizar la serie otro año, revisar el
  temario oficial del proceso correspondiente y el calendario real.

## 12. Panel para anotar en NM3 y NM4

- Por decisión de Francisco (2-oct-2026), toda página de `nm3/` y `nm4/` carga el
  panel para anotar sobre la pizarra táctil de la sala:
  `<script src="/assets/anotar-pizarra.js" defer></script>` antes de `</body>`.
  Vale también para toda página nueva de esas áreas.
- Se exceptúan solo los paneles docentes de corrección y administración: las
  carpetas `calificar/` y `revisar/` y los archivos `*admin.html`.
- El panel ofrece lápiz, destacador, goma, tres grosores, deshacer, borrar página
  y ✋ «Página», para usar la página sin dibujar. En las presentaciones con
  `.nav-bar` el botón ✏️ va en la barra; en el resto aparece como pestaña en el
  borde izquierdo. Mientras se dibuja, deslizar el dedo no cambia de diapositiva.
- No se copia el módulo dentro de las páginas ni se crean variantes: cualquier
  mejora se hace en `assets/anotar-pizarra.js`.
- `npm run build` ejecuta `scripts/audit-anotar-pizarra.js` y falla si alguna
  página de NM3 o NM4 no carga el panel.

## 13. Estándar de planificación, clases y guías imprimibles

Por decisión de Francisco (4-oct-2026), el estilo aprobado del manual ilustrado
NM4 se usa como patrón para las siguientes clases, planificaciones,
presentaciones y guías de todos los cursos. Se reutiliza el formato, no el tema,
la cantidad de integrantes, las cinco páginas ni los 90 minutos de ese proyecto.
Las reglas específicas de PAES, SIMCE y cada nivel siguen vigentes. Una excepción
al estilo requiere una indicación explícita de Francisco. Esta decisión no
autoriza a rehacer automáticamente materiales o evaluaciones ya publicados.

### Planificación y presentación de la clase

- Por decisión de Francisco (6-oct-2026), toda clase incluye **contenido
  disciplinar enseñado**: conceptos, definiciones, partes o relaciones que
  permiten comprender el tema, con ejemplos breves y organización visual
  pertinente. Un objetivo, una ruta de pasos o una lista de «qué aprenderás»
  no reemplazan ese contenido. Seleccionarlo desde el currículo chileno del
  nivel y los OA trabajados; no confundir un concepto didáctico elegido con
  una exigencia literal del OA.
- Integrar lo procedimental en el modelamiento y las acciones de la actividad,
  y lo actitudinal en las normas, la interacción y el uso responsable de la
  información. **No mostrarlos como bloques separados «Conceptual»,
  «Procedimental» y «Actitudinal»**, ni duplicar el objetivo con tarjetas de
  promesas. La planificación deja trazable qué se enseña y qué observa el
  docente dentro de la secuencia.
- En guías de lectura con varios textos, ubicar las preguntas de cada texto
  **inmediatamente después de su lectura**, antes de comenzar la siguiente.
  Conservar numeración, identificadores y guardado al reordenar. Si Francisco
  retira una actividad, quitar también su requisito de entrega sin borrar
  respuestas históricas. En SIMCE U3S12 se mantienen tres entrevistas,
  24 alternativas y un cierre; no se exige el taller de seis productos retirado.

- Por indicación reiterada de Francisco (5-oct-2026), las clases de lectura
  SIMCE NM2 no se sostienen en una única lectura breve. Incluir varios textos
  completos y trabajo de transferencia o comparación con evidencia. Ajustar
  la cantidad y extensión al objetivo; no presentar un cronograma que suma
  90 minutos como prueba de duración real. Medir la carga de lectura, decisiones
  y productos escritos, declarar los supuestos de tiempo y calibrarlos con la
  aplicación en aula. No llenar el tiempo con espera obligatoria.

- **Inicio:** activación de conocimientos previos, normas y objetivo, en ese
  orden. En la presentación ocupan **tres diapositivas distintas**; no reunirlos
  en una sola pantalla.
- **Desarrollo:** modelamiento con un ejemplo concreto, actividad del estudiante
  y monitoreo docente. Indicar qué hacen, dónde responden, qué producto elaboran
  y qué evidencia revisa el docente durante el trabajo.
- **Cierre:** revisión o plenario, seguido de sistematización o metacognición.
  Explicitar una conclusión o pregunta de reflexión vinculada al objetivo.
- El objetivo comienza con un verbo **en infinitivo**, se alinea con el OA y el
  currículo chileno correspondiente y coincide entre planificación,
  presentación y guía. No redactarlo como una orden («Reescriban»).
- Dar instrucciones breves, numeradas y directas: «Lean», «Respondan»,
  «Observen», «Escriban», «Revisen». Evitar exceso de texto, tarjetas, etiquetas,
  rutas o información administrativa que distraiga de la tarea.
- Distribuir tiempos según la duración real de la sesión. Adaptar contenido,
  ejemplos y vocabulario al nivel, curso y especialidad; no copiar una actividad
  técnica a otro curso sin revisar su pertinencia curricular.
- En las clases presenciales, mantener la norma «No se permite el uso de
  celular», salvo autorización explícita de Francisco. Las advertencias de
  seguridad de equipos o fuentes se conservan por separado.
- En proyectos de varias clases, distinguir el avance de cada sesión del
  producto final e indicar qué se muestra, conserva o entrega. No convertir un
  borrador en entrega final por cambiar el formato.

### Guía lista para imprimir

- La **primera página** lleva identificación en un cuadro: nombre y apellido,
  curso y fecha; si es grupal, espacio para cada integrante y número de grupo.
  No dejar la identificación únicamente en una hoja posterior. Las hojas
  siguientes llevan una identificación breve para reconocerlas si se separan.
- Incluir al comienzo el **objetivo** y las **instrucciones**, en cuadros
  separados, antes de la lectura o las actividades.
- Usar el **formato institucional oficial**, fijado por Francisco el
  **6-oct-2026**: la referencia visual es
  `Guia_Clase2_NM2_SIMCE_2026_SOLUCIONARIO.html`, en
  `C:\Users\franc\OneDrive\Desktop\2026\2026\Lengua y Literatura 2026\NM2 - SIMCE\04 - Guias y Material de Apoyo\`.
  Su plantilla vacía canónica está en
  [`referencias/formato-institucional/plantilla-guia.html`](referencias/formato-institucional/plantilla-guia.html).
  Esta referencia manda sobre las aproximaciones de membrete de las guías NM3
  y NM4: reutilizar su estructura, distribución, tipografías y ficha; no
  rediseñar, abreviar ni reconstruir de memoria el encabezado.
- El membrete y el pie conservan su formato institucional exacto, incluso
  cuando el docente pide otra letra o tamaño para el contenido. No aplicar
  reglas globales de tipografía, interlineado o espaciado a esos bloques.
  Verificar sus medidas y fuentes contra la referencia; la adaptación
  académica y la numeración no autorizan rediseñar su distribución.
- El membrete oficial tiene una tabla de tres columnas: insignia CEST a la
  izquierda, nombre del colegio y contactos centrados, logo SDB a la derecha;
  logos originales de 60 px, celdas laterales de 75 px y línea inferior de
  2,5 px. Conservar literalmente las dos sedes, teléfonos, web, correo y
  «TALCA - REGIÓN DEL MAULE - CHILE». La descripción académica se adapta a la
  asignatura y nivel e identifica a **Prof. Francisco Javier Núñez Valenzuela**.
  Los logos canónicos de `estudiantes/assets/` coinciden en SHA-256 con los
  originales de `Lengua y Literatura 2026/FORMATO INSTITUCIONAL/`.
- Conservar el título centrado y la ficha institucional con sus campos:
  Nombre/RUT; Profesor/Curso/N° Lista; Asignatura/Guía N°/Revisado;
  Semestre/Fecha/Puntaje; Objetivo; Habilidades. Adaptar valores y, cuando un
  campo no corresponda al instrumento, indicarlo sin inventar puntajes,
  calificaciones, datos personales o fechas. Dejar espacio para escribir;
  siguen vigentes los mínimos de 8 mm para nombres y 7 mm para renglones.
- Usar Inter para membrete, identificación y consignas y Merriweather para
  lecturas, según el modelo. Las fuentes y sus licencias se conservan en
  `assets/fonts/cest/`, para imprimir sin depender de servicios externos.
  Mantener A4 con márgenes de referencia de 10 mm
  arriba/abajo y 12 mm a los lados; revisar el PDF real y ajustar la paginación
  al contenido. El formato debe conservar su jerarquía, bordes y legibilidad
  con tinta negra y sin fondos de impresión. Mantener lema y numeración en el
  pie y las instrucciones en cuadro separado antes de las actividades.
- El archivo aprobado es un **solucionario**: se reutiliza solo su formato.
  Sus respuestas, claves, ejemplos de corrección, «PAUTA DE CORRECCIÓN»,
  «15 / 15» y aviso de uso exclusivo docente no se copian a una guía para
  estudiantes. La plantilla canónica queda vacía y es una referencia interna,
  excluida del despliegue. Esta decisión rige las próximas guías y correcciones
  de formato solicitadas; no autoriza rehacer automáticamente materiales
  publicados.
- Ordenar lectura, recursos, vocabulario, consignas y respuestas en cuadros o
  tablas de bordes reales, con jerarquía clara y buena impresión en blanco y
  negro. Tomar como referencia el orden visual de los ensayos PAES y SIMCE,
  sin copiar preguntas, claves ni condiciones de evaluación ajenas.
- Incluir lo que deben **leer** y lo que deben **completar**, junto con imágenes,
  planos y fuentes cuando correspondan. Distinguir ejemplos, borradores y
  producto final para que el estudiante no confunda lo que debe entregar.
- En casos de comunidades digitales, el formato es parte del análisis:
  representar los recursos de la plataforma (perfil, fecha, imagen, enlace,
  comentario, reacciones o reenvíos) e incluir preguntas sobre su efecto en
  la credibilidad. Identificar las publicaciones inventadas con un rótulo
  breve de recreación y conservar las fuentes reales en el expediente.
  Para la guía NM3 de verificación, Francisco solicita retirar las leyendas
  visibles de las ilustraciones de acompañamiento; sus originales, prompts y
  procedencia permanecen guardados y no se usan como evidencia documental.
- Reservar espacio suficiente para la respuesta esperada: renglones de al
  menos **7 mm** y campos de nombres de al menos **8 mm** de alto. Usar bordes
  imprimibles, no fondos rayados ni largas cadenas de guiones bajos. No reducir
  letra o escritura para forzar una cantidad de páginas; ajustar la distribución.
- Preparar PDF A4 al 100 %, sin depender de activar fondos ni encabezados del
  navegador. Mantener bloques y tablas sin cortes, imágenes legibles, márgenes
  útiles, pie dentro de la página y numeración continua. La cantidad de páginas
  se determina por el contenido, no se fija en cinco para todas las guías.
- Comprobar consistencia entre la vista imprimible y el PDF descargable, curso
  correcto y enlaces vigentes. Abrir las páginas renderizadas antes de decir
  «listo para imprimir»; revisar identificación, objetivo, instrucciones,
  espacios, bordes, saltos y pies. Una revisión digital no es una prueba física
  de impresora ni una validación automática de Evaluación Docente.

### Referencia editable aprobada

- `referencias/formato-institucional/plantilla-guia.html`: patrón oficial de
  membrete, título y ficha institucional; tiene prioridad para el formato de
  los documentos imprimibles. Fuente y hashes en
  `referencias/formato-institucional/PROCEDENCIA.md`.
- `nm4/u3-clase7-manual-ilustrado/index.html`: secuencia de clase y tres
  diapositivas independientes de inicio.
- `nm4/u3-clase7-manual-ilustrado/docente.html`: planificación por sesión.
- `scripts/generate-nm4-manual-pdfs.js` y
  `nm4/u3-clase7-manual-ilustrado/manual.css`: identificación inicial, cuadros y
  distribución de las guías completas.
- `nm4/u3-clase7-manual-ilustrado/assets/guia-4*-completa.pdf`: muestra aprobada
  de lectura y respuestas por curso; reutilizar su estilo, no sus contenidos.

## 14. Mapas de memoria y vigencia de instrucciones

- Neuromapa y los puntos de entrada de otros workspaces ayudan a localizar
  estas reglas, los contratos y las skills canónicas. Una nota histórica no
  sustituye la fuente actual ni demuestra el estado de producción.
- Las entradas de agentes remiten a `.github/skills/estudiacest-platform` del
  repositorio raíz y a las reglas de este subárbol. No mantener recetas
  paralelas de login, cursos, entrega o despliegue en una memoria antigua.
- Reparar enlaces contra archivos existentes y el árbol vigente, conservando
  la historia y marcando instrucciones sustituidas. Una reorganización del
  mapa no autoriza recalcular notas, escribir datos ni desplegar.
