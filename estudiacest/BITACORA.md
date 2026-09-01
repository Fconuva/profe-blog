# Bitácora de Estudia CEST

Registro para retomar el contexto entre sesiones, agentes y máquinas. El bloque más reciente va arriba.

Esto complementa, no reemplaza, a `REGLAS.md`. Aquí va **qué se hizo, qué quedó y qué está pendiente**. Es una bitácora exclusiva de Estudia CEST: no contiene operaciones de portafolios docentes.

No registrar RUT, notas individuales, correos, credenciales, tokens ni información clínica. Una corrección se agrega como entrada nueva; no se borra el antecedente.

---

## 2026-09-01, revisión individual de carpetas del Anuario 4°D TP

- Se inventariaron los 29 registros del curso sin crear avances ficticios. El
  panel ahora considera trabajo solo cuando existen entrevistas, archivos,
  textos o entregas; abrir o guardar una carpeta vacía no cuenta como avance.
- Se revisaron las entrevistas, transcripciones y productos escritos. También
  se descargaron y validaron 78 archivos: 75 medios reproducibles y tres
  fotografías pertinentes. Un WebM no declara duración en su contenedor, pero
  decodifica correctamente.
- El resultado agregado quedó en 21 carpetas con evidencia y ocho sin
  evidencia. Se aplicaron 29 revisiones: seis bien encaminadas, diez con
  ajustes, once de prioridad alta, una fuera del conteo y una con plazo
  especial. Las excepciones no exponen motivos personales en la interfaz.
- Cada estudiante ve retroalimentación, recomendaciones y alerta dentro de su
  carpeta. El admin permite editarlas por separado de las notas internas y de
  las tres calificaciones. La comparación antes/después confirmó que ninguna
  calificación cambió.
- Se agregó una ruta técnica protegida por hash para auditorías autorizadas;
  no entrega RUN ni acepta solicitudes sin credencial. Playwright verificó en
  producción ingreso real, recuperación de carpeta, tarjeta móvil y controles
  del admin, sin errores de JavaScript.
- Commits funcionales: `a608c3c4`, `c8a730b5` y `2d2e51cd`. Deploy final:
  `dpl_HypFsdDHfMNWKtXjWcRhM77EeMYx`.

---

## 2026-08-31, interrogaciones con acceso docente sin contraseña

- Se retiraron el campo de contraseña y el selector público de los paneles de
  interrogación NM3 y NM4. Cada una de las cuatro cuentas entra mediante un
  enlace personal y conserva únicamente los cursos ya asignados.
- El código de acceso viaja en el fragmento privado del enlace, no llega en la
  solicitud inicial ni en los registros web, se elimina de la barra de
  direcciones y queda solo durante la sesión de la pestaña.
- La API dejó de aceptar la contraseña compartida anterior y valida el hash
  sensible correspondiente a cada cuenta. Los hashes quedaron configurados
  como variables cifradas de producción; los enlaces se guardaron fuera de Git
  en una página local de distribución.
- Playwright verificó en producción los ocho accesos: ingreso directo, ausencia
  de campos de contraseña, aislamiento por curso, diseño móvil, lectura de
  nómina y ciclo temporal de escritura, lectura y eliminación en Firebase. Un
  acceso inválido fue rechazado y los registros de auditoría quedaron limpios.
- `npm run build` aprobó 145 recursos críticos. Commit funcional: `12a434c4`.
  Deploy productivo: `dpl_5vZ3czBmwBpYZhQkeNo5s5v1q6d3`.

---

## 2026-08-31, cuatro docentes habilitados en cada panel de interrogación

- Los paneles de `El lugar sin límites` y `Mocha Dick` muestran ahora las
  cuatro cuentas docentes: Francisco Núñez, Alicia Aguilera, Pía Benavides y
  Joselin Díaz.
- En NM3, Francisco conserva 3°A, 3°B y 3°D; las educadoras acceden solo a la
  sección correspondiente: Alicia a 3°A, Pía a 3°B y Joselin a 3°D. En NM4,
  Francisco accede a los cinco cuartos y se conservaron las asignaciones
  vigentes de las educadoras.
- La auditoría automática ahora exige exactamente las cuatro cuentas en ambos
  selectores y comprueba que las cuatro estén configuradas en los dos
  instrumentos. No se modificaron preguntas, nóminas ni calificaciones.
- `npm run build` aprobó las auditorías y 145 recursos críticos. Playwright
  verificó en producción las dos rutas en 390 y 1920 píxeles, sin errores ni
  desbordes, y confirmó el rechazo protegido de accesos inválidos en la API.
  Commit funcional: `9e71fe9e`. Deploy productivo:
  `dpl_3QcMEAiqz2vjHPu9eUQvPxDRipPy`.

---

## 2026-08-31, paneles docentes de interrogación NM3 y NM4 auditados

- Se creó el panel docente de `El lugar sin límites` para NM3, con acceso
  protegido, los tres cursos vigentes, sorteo de siete preguntas, un cambio,
  escala de 0 a 1,0, observación, cálculo inmediato y tabla de calificaciones.
- NM3 y `Mocha Dick` comparten una sola función de servidor para respetar el
  límite de Vercel, pero mantienen separados sus docentes, nóminas y nodos de
  Firebase. La compatibilidad del panel NM4 se preservó sin migrar sus notas.
- El servidor ahora comprueba que el estudiante exista y corresponda al curso,
  deriva su nombre desde la nómina y valida siete preguntas distintas, rango de
  banco, posiciones y valores de puntaje. El navegador no recibe RUN.
- La auditoría común comparó los dos bancos públicos con los paneles y detectó
  dos formulaciones abreviadas en NM4; fueron igualadas a las preguntas
  publicadas. En total se verificaron 100 preguntas y 249 estudiantes.
- Playwright probó celular y escritorio: ingreso simulado, sorteo sin
  repetidos, un único cambio, siete puntajes, cálculo, guardado y tabla, sin
  errores de consola ni desborde. En producción se ejecutó un ciclo aislado de
  escritura, lectura y eliminación en ambos nodos Firebase; los registros
  técnicos quedaron eliminados y el acceso de un solo uso fue retirado.
- `npm run build` aprobó las auditorías completas y 145 recursos críticos.
  Commit funcional: `72612b29`. Primer deploy productivo:
  `dpl_4rLadYa2y7xWsR7bdY1fAGeVD8WR`. Cierre de seguridad: commit
  `6ba73921` y deploy `dpl_Cc4xg3DssE6HEErgtsteQYSUMnxd`.

---

## 2026-08-30, clase NM4 de Industria 4.0 e inteligencia artificial

- Se publicó la Clase 4 de la Unidad 3 para 4°A, 4°B, 4°C y 4°E. 4°D mantiene
  su trabajo independiente en el proyecto Anuario y no aparece asignado a esta
  sesión.
- La presentación reúne 15 pantallas para 90 minutos: video inicial, conceptos,
  caso modelado, investigación guiada, decisión técnica y defensa. Incluye
  cuatro casos diferenciados para Mecánica Industrial, Mecánica Automotriz,
  Electricidad y Electrónica, respaldados por ocho fuentes oficiales.
- Se incorporó un bloque específico sobre inteligencia artificial y empleo:
  distingue automatización de tareas y reemplazo completo de ocupaciones,
  explica el riesgo de rezago profesional y presenta ejemplos en agricultura,
  medicina y mantenimiento predictivo. El producto final exige separar lo que
  puede hacer la IA de la decisión que debe verificar y asumir una persona.
- Se generaron seis apoyos visuales 2K con Nano Banana y un video explicativo
  de 1 minuto 40 segundos, en 1920 × 1080, con narración y 19 subtítulos
  inferiores. Los archivos originales quedaron guardados dentro de la ruta de
  la clase para su reutilización.
- Playwright verificó la ruta y el portal en producción: respuesta 200,
  navegación de 1 a 15, video y subtítulos cargados, tarjeta de clase activa,
  imágenes completas, ausencia de errores de consola y diseño sin desborde en
  390 × 844, 1920 × 1080 y 3840 × 2160.
- `npm run build` aprobó Firebase, 21 contratos de entrega y 144 recursos
  críticos. Commit funcional: `1b83457c`. Primer deploy productivo:
  `dpl_Ffi6KabJmcHwaKdXAJbZVKZtHEGH`. Protección final: commit `4018c9bc` y
  deploy `dpl_5dKy3KmyYfMfHeskGzUywJKyLdkC`.

---

## 2026-08-28, rutas individuales PAES preparadas hasta noviembre

- Se construyeron las rutas guiadas 20 a 31 para el estudiante que ya tenía
  este apoyo registrado. Cubren la secuencia completa desde relaciones entre
  textos hasta estrategia final, conservan el objetivo lector de cada sesión y
  reúnen 12 estímulos, 72 preguntas A-D y retroalimentación específica.
- Cada ruta presenta tres pasos estables, glosario breve, lectura segmentada,
  palabras clave resaltadas, una pregunta por pantalla, lectura en voz alta,
  ausencia de temporizador y entrega aunque queden preguntas pendientes. Se
  generaron 12 apoyos visuales 4:3 con Nano Banana, optimizados en WebP y sin
  recortes.
- Las claves y explicaciones quedaron en un módulo exclusivo del servidor. El
  admin autenticado recibe la clave solo al revisar una entrega y distingue la
  variante individual; el HTML público no expone claves ni etiquetas clínicas.
- El portal muestra las futuras rutas únicamente dentro del acceso individual.
  Firebase se actualizó primero en simulación y luego en aplicación: G20 a G31
  quedaron bloqueadas por defecto y se preservaron los 20 estados anteriores.
  El docente podrá habilitarlas por sesión o mediante excepción individual.
- `REGLAS.md` incorpora como regla dura que toda nueva sesión PAES debe salir el
  mismo día con esta ruta. El contrato de entrega ahora audita correctamente
  páginas que comparten lógica y backend, sin exigir duplicar código dentro de
  cada HTML.
- `npm run build` aprobó Firebase, 21 contratos de entrega, PAES, SIMCE, Odisea,
  Anuario y 134 recursos críticos. Playwright verificó escritorio y celular,
  recursos visuales, tabla, autoguardado, entrega, lectura posterior, bloqueo y
  cero errores de consola. La comprobación final usó la API real sin escribir
  respuestas.
- Commit funcional: `dc08ec5d`. Deploy productivo:
  `dpl_Drm2Fn3MSHD1V8xZgsjtGxjFk3D8`.

---

## 2026-08-27, contacto institucional para estudiantes en la portada

- Se incorporó al pie de la portada un bloque visible de consultas para
  estudiantes, enlazado al correo institucional del profesor mediante
  `mailto:`. El dato de contacto no se replica en esta bitácora.
- El enlace mantiene 44 px de alto, contraste claro sobre el pie azul y
  alineación adaptativa: a la derecha en escritorio y a la izquierda en
  celular.
- La auditoría completa pasó con 107 recursos críticos. Playwright verificó en
  producción anchos de 1440 px y 390 px, respuesta 200, enlace visible, destino
  correcto, cero desborde y cero errores de página o red.
- Commit funcional: `ca25895f`. Deploy productivo:
  `dpl_CRMQNuF4wx5egH2afuGrfs9XYPDF`.

---

## 2026-08-27, rediseño institucional de portada y acceso PAES

- La portada principal se rediseñó como portal educativo institucional sobre
  fondo blanco, con jerarquía centrada en las tareas, navegación breve y
  tarjetas simples. El criterio se contrastó con los patrones oficiales de
  GOV.UK, USWDS y W3C para identidad del servicio, acciones claras, contraste y
  superficies táctiles.
- Se conservaron sin cambios los accesos a SIMCE, NM3, NM4, PAES, Anuario 4DTP
  y el archivo 3ATP. Los botones ahora indican explícitamente a qué plataforma
  ingresan y mantienen una altura táctil mínima de 44 px.
- Se generaron cinco ilustraciones institucionales con Nano Banana para las
  tarjetas del portal. Quedaron optimizadas en WebP, con fondo claro,
  `object-fit: contain` y márgenes internos para evitar recortes en escritorio
  y celular.
- El acceso PAES adoptó la misma paleta azul, verde y dorada. Se corrigió el
  selector que dejaba el saludo blanco sobre fondo blanco, se oscureció el
  texto informativo, se simplificó la recomendación inicial y se eliminó la
  animación de entrada que podía mostrar contenido lavado durante la carga.
- Playwright verificó la portada a 1440 px y 390 px: cinco imágenes cargadas,
  cinco destinos correctos, controles de 46 px, cero desborde horizontal y
  contraste de 6,65:1 en los botones. También comprobó el ingreso con la cuenta
  técnica PAES, el nombre del curso, el contenido visible y cero errores de
  página o solicitudes fallidas.
- `npm run build` aprobó Firebase, contratos de entrega, PAES, SIMCE, Odisea,
  Anuario y 107 recursos críticos. Todas las rutas preservadas respondieron
  200 en producción. Commits funcionales: `388803f6` y `0d5c9d6b`. Deploy
  productivo final: `dpl_ArGdR55ipNfp3AhfcZC5o1ALPUBU`.

---

## 2026-08-27, cuenta técnica permanente de prueba PAES

- Se incorporó una cuenta sintética de prueba a la nómina PAES. El portal la
  identifica como `Cuenta de prueba PAES` y curso `PRUEBA PAES`, sin mezclarla
  con estudiantes reales.
- La cuenta puede ingresar aunque la guía elegida esté cerrada para los cursos
  y puede volver a guardar o enviar una guía ya utilizada, sin depender de un
  restablecimiento manual desde el admin.
- Quedó excluida de las métricas de ensayos, de la publicación del libro de
  notas y de los promedios del segundo semestre. En administración aparece con
  la etiqueta `Prueba` para distinguirla de las nóminas oficiales.
- `npm run build` pasó las auditorías de Firebase, contratos de entrega, PAES,
  SIMCE y 102 recursos críticos. En producción se comprobó el ingreso real, la
  apertura de la Guía 17, dos autoguardados consecutivos y la ausencia de
  errores de página o solicitudes fallidas. El borrador técnico se eliminó al
  terminar y Firebase quedó sin libro de notas para esta cuenta.
- Commit funcional: `c923c2d2`. Deploy productivo:
  `dpl_3mNvi4h1ToHono86UvMZJ1c44Vu8`.

---

## 2026-08-27, publicación privada de notas PAES del segundo semestre

- Se reconstruyeron y publicaron las calificaciones PAES de las guías 11 a 17
  para 153 estudiantes. La conversión conserva la escala histórica chilena de
  1,0 a 7,0 con 60 % de exigencia y mantiene las correcciones manuales vigentes
  de la Guía 11.
- La Guía 14 quedó expresamente excluida para `4°A HC`: aparece como `No aplica`
  y no interviene en el promedio parcial. Las guías sin calificación aparecen
  como `Sin nota` y tampoco se promedian.
- El portal `/paes/` incorpora una tarjeta compacta y plegable, cerrada por
  defecto, con las siete guías, el promedio parcial, simbología y el canal
  institucional de consulta. En celular se reduce a las tres columnas
  necesarias; en escritorio conserva el detalle completo.
- La API pública de notas dejó de devolver el registro completo del libro:
  limita la respuesta al curso, las notas 11 a 17 y las omisiones del período.
  No libera claves, aciertos, respuestas ni retroalimentación.
- La actualización masiva se ejecutó primero en simulación, calculó dos veces el
  mismo resultado, respaldó el libro anterior y releyó Firebase después de
  aplicar. Cantidad esperada y aplicada: 153 registros; checksum exacto
  `966e23f91c56685d7139672c30631d3d79273be49021f5270b6eeda1e9b18b5b`.
- La auditoría completa, el build y Playwright pasaron en celular y escritorio.
  En producción se comprobó ingreso real, panel cerrado por defecto, siete
  filas, promedio, exclusión de G14 en 4°A, ausencia de desborde y cero errores
  o solicitudes fallidas. Las portadas PAES, SIMCE, NM3 y NM4 continúan en 200.
- Un primer build remoto falló antes de promoción porque `.vercelignore` no
  incluía el módulo auxiliar de la auditoría; se corrigió y se repitió mediante
  el flujo seguro. Commits: `5cdd367f` y `1a59d8d4`. Deploy productivo:
  `dpl_FAoCPWBcLtZ1iTDdNfvFCPZ79HYk`.

---

## 2026-08-26, PAES Guía 19: vocabulario en contexto

- Se publicó `/paes/guia19.html` como sesión actual del 27 de agosto. Contiene
  tres textos originales de 641, 631 y 630 palabras, 18 reactivos A–D y una
  estrategia visual de inferencia por rol, pistas, sustitución y sentido global.
- El instrumento distribuye las claves `A5 / B4 / C5 / D4`, sin ciclos, y las
  habilidades `Localizar 3 / Interpretar 12 / Evaluar 3`. La clave y la
  retroalimentación permanecen en la API y solo se muestran después de la
  liberación docente.
- Se agregó `/paes/guia19-guiada.html` a la ruta individual ya vigente: un
  texto breve, seis reactivos, una pregunta por pantalla, instrucciones directas
  y la misma habilidad con menor carga. El portal, la API y el admin distinguen
  la variante sin exponer etiquetas diagnósticas.
- El admin incorpora G19 en resultados, calificación, restablecimiento, libro de
  notas, bloqueo por curso y excepción individual. La entrada directa vuelve a
  comprobar el candado después de identificar al estudiante.
- Playwright comprobó selección, autoguardado, entrega con preguntas pendientes,
  lectura posterior de confirmación, mensaje visible, bloqueo desde enlace
  directo, ruta guiada de seis preguntas y ausencia de desborde.
- `npm run build` y la verificación postpublicación pasaron con 102 recursos
  críticos. Producción responde 200 para la guía general, la guiada y su CSS,
  sin errores de consola. Deploy: `dpl_CjiJQFfTZgJnYQJJ5kypsJaNdwPY`.
- Un primer build remoto falló porque la auditoría nueva no estaba exceptuada en
  `.vercelignore`; no fue promovido. Se corrigió el inventario y se añadió la
  regla permanente correspondiente en `REGLAS.md`.

---

## 2026-08-26, publicación privada de notas de trabajo SIMCE y alineación de Lirmi

- Se publicaron 498 calificaciones privadas de laboriosidad correspondientes a
  83 estudiantes de `2A-HC` y `2B-HC`, en las clases 1 a 6 de la Unidad 3. La
  escala aplicada es `1 / 3 / 5 / 7` y conserva los ajustes ya auditados por
  escritura incompleta y coincidencia textual superior al 90 %.
- El panel del estudiante incorpora una tabla compacta y plegable con la nota
  de cada clase, el promedio parcial y una leyenda para entrega confirmada,
  ausencia de entrega, borrador, escritura incompleta y nota ajustada. También
  incluye el canal institucional de contacto sin exponer datos de otros
  estudiantes.
- Las notas viven en `plataforma_estudiantes/calificaciones_clase/{uid}`. Las
  reglas permiten que cada estudiante lea solo su propio nodo y reservan la
  escritura a administración. La publicación no libera claves, respuestas ni
  retroalimentación académica.
- La escritura masiva se simuló, respaldó y releyó: 498 registros aplicados y
  checksum exacto
  `fb3e2ec26cc50fb2fef1a82681d7818205bd5e56bf14c0b4857f2e5f515397bb`.
- La prueba productiva comprobó panel cerrado por defecto, promedio, seis
  filas, leyenda, vista móvil sin desborde, lectura propia permitida, lectura
  cruzada denegada, escritura estudiantil denegada y cero errores de consola.
- Se auditaron en Lirmi las planificaciones vigentes de 14 cursos de SIMCE,
  PAES, NM3 y NM4. Se corrigieron únicamente seis diferencias verificadas: dos
  objetivos omitidos de la clase SIMCE de textos visuales y cuatro sesiones
  PAES que aún describían vocabulario en vez de la Guía 18 sobre arquitectura
  del ensayo. NM3 y NM4 se conservaron porque sus fechas y actividades
  vigentes coincidían con Estudia CEST.
- Las seis correcciones de Lirmi se aplicaron desde una simulación con respaldo
  temporal y fueron releídas desde Planifica. Checksum esperado y obtenido:
  `3747c0436a5537b7eb1d386f62d2c6db027a42b21fb0b00fa66aa4052ae9bf60`.
- Deploy productivo del panel: `dpl_5Ve6Qkw9kWRNU25jGND1y9BR1v5G`.

---

## 2026-08-26, ajuste privado por coincidencias textuales

- A solicitud docente, toda respuesta escrita con coincidencia superior al
  90 % respecto de otro estudiante deja la nota de esa clase con máximo 5,0
  para ambos involucrados.
- El motivo queda visible en el detalle y como comentario de la celda:
  `Coincidencia textual superior al 90 %; posible uso no autorizado de IA o copia`.
- El nuevo cálculo detectó 132 pares y afectó 73 combinaciones estudiante/clase,
  correspondientes a 40 estudiantes. Los 73 casos quedaron en 5,0.
- Se generó una segunda versión del informe porque el archivo anterior estaba
  abierto y Windows impidió reemplazarlo. La versión ajustada termina en
  `_AJUSTADA_90.xlsx`.
- Las notas siguen siendo privadas: no se modificaron resultados ni
  calificaciones en Firebase.

---

## 2026-08-26, revisión privada de laboriosidad y telemetría SIMCE

- Se auditaron en solo lectura las clases 1 a 6 de la Unidad 3 para `2A-HC` y
  `2B-HC`: 83 estudiantes y 498 combinaciones estudiante/clase. No se
  publicaron ni modificaron notas.
- El informe privado quedó fuera del repositorio, en la carpeta de evaluaciones
  de NM2 del workspace. Aplica la escala acordada `1 / 3 / 5 / 7`, rebaja una
  banda cuando falta escritura obligatoria y separa ausencias, borradores y
  coincidencias para revisión manual.
- Las sesiones 1 a 5 estaban cerradas para el curso y la sesión 6 activa. Las
  clases antiguas no guardaron una hora inicial confiable; por eso no se aplicó
  ninguna rebaja por velocidad ni se reconstruyeron tiempos.
- Se agregó `estudiantes/js/work-telemetry.js` a las siete clases actuales de la
  Unidad 3. Registra inicio, entrega confirmada, tiempo total, tiempo activo,
  aperturas, interacciones, intervalos rápidos y eventos de copiar, pegar,
  cortar, atajos, menú contextual, selección y pérdida de foco. No almacena el
  texto ni el contenido del portapapeles.
- El admin muestra la telemetría al abrir las respuestas de un estudiante y la
  identifica expresamente como un indicador de revisión, no como prueba
  automática de copia.
- Se añadió el nodo protegido `telemetria_clases` a las reglas de Firebase y una
  guarda obliga a las futuras guías SIMCE registradas en el contrato de entrega
  a cargar el registrador común.
- Prueba productiva con una cuenta ficticia temporal: escritura y lectura propia
  permitidas; lectura y escritura de otro UID denegadas; inicio, entrega, tiempo
  activo, interacción, copia, atajo, menú contextual y pérdida de foco
  persistidos; cero errores de consola. La cuenta y todos sus datos se borraron
  al terminar.
- Validaciones: reglas Firebase, contrato de entrega, build completo, scripts
  del admin, 9 rutas productivas HTTP 200 y libro Excel sin errores de fórmula.
- Commit funcional: `c7a61dbe`. Deploy productivo:
  `dpl_2NMLYFaYQab2pd4KNDUD86h6GFUP`.

---

## 2026-08-26, Unidad 3 Clase 7 SIMCE: el discurso

- Se publicó `/estudiantes/guia-u3-s7-discurso.html` para `2A-HC` y `2B-HC`: ocho lecturas, 50 reactivos de selección múltiple, dos respuestas de desarrollo y tres preguntas metacognitivas escritas.
- La dificultad se construyó mediante inferencia, integración de evidencias, evaluación de propósito, audiencia, tono y suficiencia; no mediante vocabulario innecesariamente complejo.
- La clave y el cálculo quedaron solo en la API. Al entregar, el estudiante ve el puntaje sobre 50 y el porcentaje, pero no las alternativas correctas ni el desglose por reactivo.
- El flujo usa autoguardado serializado, espera las escrituras pendientes, relee Firebase antes de confirmar y muestra un popup persistente de entrega exitosa.
- La sesión `sesion-u3-7` quedó activa para ambos cursos, con resultados y retroalimentación detallada ocultos.
- Para respetar el máximo de Vercel Hobby, las rutas de esta clase se integraron en `api/estudiantes.js`; la auditoría impide volver a superar las 12 funciones desplegables.
- Pruebas productivas con cuenta temporal: ingreso por RUT, borrador recuperado después de recargar, 50 respuestas guardadas, entrega atómica, puntaje persistente después de otra recarga, vista móvil y escritorio sin desborde y cero errores JavaScript. La cuenta y sus datos se eliminaron al terminar.
- Commit de integración: `b058fe38`. Deploy productivo: `dpl_7GeM6hSrWvmdXjk8fcmScW9HAgjW`.

---

## 2026-08-24, instrucciones de trabajo para 4DTP

- Se reemplazó el bloque inicial de entrega final de `/4dtp/` por las instrucciones concretas del martes 25 de agosto.
- La portada indica completar cinco entrevistas: tres a compañeros y dos a docentes; cada registro exige nombre, audio y una transcripción de al menos 80 caracteres.
- El último paso visible pide revisar y usar `Entregar avance de Actividad 1` antes de salir.
- En “Las secciones del anuario”, la transcripción quedó marcada para el 25 de agosto y “Aniversarios del colegio” quedó disponible como avance opcional mediante `Textos → Memoria escolar`.
- Se conservan el cronograma, las evaluaciones de avance y la meta final dentro del panel autenticado.
- Validaciones: auditoría 4DTP, build completo y navegador móvil en producción; respuesta HTTP 200, sin errores de consola, recursos fallidos ni desborde horizontal.
- Instrucciones iniciales: commit `f7389417`, deploy `dpl_9xqa7PD3Eg71CMMaEL1o6D8t1FdC`.
- Apertura de las dos primeras secciones: commit `a057c134`, deploy `dpl_AEjNhHr3rP2zfFzYBHXj4aapJ95Q`.

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
