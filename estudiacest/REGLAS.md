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
- En una interrogación oral se sortean siete preguntas. El docente puede cambiar
  exactamente una antes de comenzar a grabarla; el servidor registra ese uso y
  rechaza un segundo cambio, una pregunta repetida o el cambio de una respuesta
  ya iniciada.
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
