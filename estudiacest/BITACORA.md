# Bitácora de Estudia CEST

Registro para retomar el contexto entre sesiones, agentes y máquinas. El bloque más reciente va arriba.

Esto complementa, no reemplaza, a `REGLAS.md`. Aquí va **qué se hizo, qué quedó y qué está pendiente**. Es una bitácora exclusiva de Estudia CEST: no contiene operaciones de portafolios docentes.

No registrar RUT, notas individuales, correos, credenciales, tokens ni información clínica. Una corrección se agrega como entrada nueva; no se borra el antecedente.

---

## 2026-09-10, Mi casa: los visitantes se ven caminar

- Francisco pidió volver a la dinámica tipo Habbo. Lo que faltaba era el
  movimiento en vivo: la posición salía al llegar y cada 20 s, y los demás
  aparecían de golpe en la casilla nueva.
- Ahora el destino se avisa al empezar a caminar (a lo más uno por segundo) y
  cada cliente dibuja a los demás recorriendo la ruta con el mismo buscador de
  camino del propio personaje. Solo cambia `estudiantes/js/mi-espacio.js`; el
  servidor ya limitaba las casillas a 0–4. Commit 0f4245c6, desplegado desde
  worktree limpio después del deploy PAES de 50003aec (producción conserva
  ambos).
- Probado en producción con una cuenta ficticia temporal y un visitante falso:
  el visitante cruzó la casa casilla a casilla en unos 2,5 s. Al hacer clic,
  Firebase tenía el destino a los 412 ms, con el personaje todavía a mitad de
  camino. Consola sin errores. Cuenta, casa y capturas borradas.
- `audit-mi-espacio.js` vigila las piezas del movimiento; siete mutaciones
  detectadas.

## 2026-09-10, PAES 1–9: ampliaciones e imágenes IA publicadas y verificadas

- Publicado el contenido del commit `50003aec` mediante `npm run deploy:prod:safe`, desde la fuente canónica, conservando el cierre paralelo `80192853`. Despliegue `dpl_8g9KYf21KE2TfkNC9QZvMQ2be9b1`: estado Ready y dominio `www.estudiacest.com` comprobados. La CLI perdió la conexión de seguimiento con ECONNRESET; la construcción continuó en Vercel y se confirmó su finalización con una inspección de solo lectura, sin duplicar el despliegue.
- Nueve ilustraciones originales de IA y 5.455 palabras de enseñanza incorporadas en las 18 páginas regulares y acompañadas. Cada imagen tiene texto alternativo, explicación, consigna de observación y crédito; cada ampliación desarrolla conceptos, estrategia razonada, modelado, error frecuente, comprobación y transferencia. Recursos y prompts reproducibles en `paes/imagenes/fundamentos/`.
- Dos rondas completas de ocho pruebas Playwright aprobadas, incluida la comprobación final de teclado y versión acompañada. Build con 203 recursos críticos y 44 contratos aprobado. Guard canónico repetido después de publicar: 203 recursos correctos. Capturas locales y públicas inspeccionadas en 390, 1440 y 3840 px, sin desbordes.
- Verificación pública: 18 páginas HTTP 200; nueve imágenes WebP con hash idéntico al archivo local; nueve bancos sin claves públicas; fuentes privadas y pauta docente protegidas. Flujo real de G1 con identidad ficticia: guardado, recuperación después de eliminar la copia local, entrega persistida con ambas banderas y fechas coherentes, y recarga sin edición ni resultados anticipados. Registro ficticio eliminado y ausencia comprobada. Sin cambios a intentos de estudiantes reales, liberaciones, textos evaluados, preguntas, claves ni versión `foundations-v1`.
- Acceso para Francisco: `https://www.estudiacest.com/paes/#cardGuia1`. Abrir cualquier guía 1–9 y su sección de enseñanza para revisar la imagen y desplegar los conceptos, pasos y ejemplos. Se preservan tarjetas individuales, G10–G21 y planificación G22–G32. Continúa pendiente el pilotaje y cotejo pedagógico docente antes del uso sumativo; no se declara validación editorial independiente.

## 2026-09-10, Datos de estudiantes fuera de la web e ingreso por RUT cerrado

- **Qué se encontró.** Con `"outputDirectory": "."` Vercel publica la carpeta
  completa. Se podían descargar: el registro PIE (nombre completo, RUT,
  categoría de apoyo y notas de 14 estudiantes) y sus 14 archivos por
  estudiante; exportaciones SIMCE con 66 RUT; exportaciones y `_tmp_*.json` con
  nombres, notas y textos de 2A-HC y 2B-HC; una planilla con la lista de 3°D TP;
  los `.md`, scripts y configuración; y el código de la API, que traía un valor
  de respaldo de la clave de administrador que era la vigente, porque Vercel no
  define `ADMIN_PASSWORD`. El repositorio de GitHub es público.
- **Bloqueo (commit 097fd55d, opción a autorizada por Francisco).** Diez
  redirecciones en `vercel.json` hacia `/api/paes?action=private-source` (404),
  que Vercel aplica antes de buscar el archivo. En producción, 17 rutas
  bloqueadas dan 404 sin contenido; portada, panel, ranking, PAES, lecturas,
  revisión de tríptico, 3ATP y recursos siguen en 200.
- **Ingreso por RUT.** `/api/lecturas-login` entregaba sesión con la clave por
  defecto aunque el estudiante ya hubiera elegido la suya. Ahora se niega si
  `password_changed` o `perfil_completo`. Probado con una cuenta ficticia
  temporal (RUT inventado de la serie 30.000.00x, ya borrada). Estudiante nuevo
  con clave por defecto: entra. Tras elegir clave: el atajo se niega y Firebase
  rechaza la clave por defecto (400); la clave nueva entra. Perfil completo sin
  la marca: el atajo se niega. Tras restablecer: el atajo vuelve a servir.
- **admin-login** ya no tiene clave escrita: queda apagado (403) mientras no
  existan `ADMIN_PASSWORD` y `ADMIN_UID`. Ninguna página lo usa. La clave
  anterior sigue en el historial público de Git; Francisco debe cambiarla donde
  la use.
- Restablecer clave y cambiar RUT dejan `perfil_completo` en false, así que el
  estudiante vuelve a elegir clave. No se probó con una cuenta admin; sí el
  estado resultante en el atajo.
- **Guarda.** `scripts/audit-datos-publicos.js` corre en el build: exige los
  bloqueos, falla si un archivo servido trae 3 o más RUT con dígito verificador
  válido y vigila los dos arreglos de la API. Cuatro mutaciones detectadas.
- **Efectos.** El verificador de deploy compara con producción descargando los
  archivos sin commit; ya no puede descargar `api/*.js` ni `.md`, así que un
  deploy con cambios sin commit ahí queda bloqueado aunque sean iguales. Se
  despliega desde worktree limpio. `lecturas/adminprofe/pie.html` ya no carga el
  registro PIE hasta moverlo a `plataforma_lecturas/pie_registro` (opción b).
- **RUT que el sitio todavía entrega** (declarados en la guarda):
  `paes/js/nominas.js` (218 de estudiantes reales), `revision-triptico/index.html`
  (321), `3atp/index.html` (43) y `3atp/informe/index.html` (42). Todas
  identifican por RUT contra una nómina escrita en la página; el arreglo es
  preguntarle a la API. `lecturas/adminprofe/index.html` trae 1 RUT real.
- **Corrección de la entrada anterior.** Los tres perfiles repetidos de 2A-HC
  no comparten RUT: no tienen RUT ni cuenta de ingreso, y guardan resultados
  idénticos de una misma sesión, entregados con un minuto de diferencia. El
  borrado de dos quedó detenido para reconfirmar con Francisco. Aparte, un RUT
  tiene dos perfiles, en 4A-HC y 4B-HC.
- Sin OK todavía: b (registro PIE a Firebase admin), c (sacar los archivos del
  repo), d (reglas del perfil) y f (nóminas con RUT). Recomendado: poner el repo
  en privado; el GitHub Pages de `fconuva.github.io/profe-blog` dejaría de
  funcionar en el plan gratuito.

## 2026-09-10, PAES 1–9: enseñanza ampliada e ilustraciones IA preparadas

- A solicitud de Francisco se amplió la enseñanza de G1–G9, manteniendo objetivos, tarjetas individuales, lecturas, reactivos, claves y versión de intentos. Se agregaron 5.455 palabras de contenido didáctico original entre las nueve guías: conceptos, estrategia con razones, ejemplo pensado en voz alta, error frecuente, comprobación y transferencia. La secuencia conserva explica → modela → ejercita → evalúa → analiza.
- Nueve ilustraciones originales creadas con `image_gen`, inspeccionadas e integradas con texto alternativo, pie explicativo, pregunta de observación y contraste. Son escenas ficticias o analogías de enseñanza, no datos ni estímulos evaluados. Los originales permanecen en el directorio de generación; las copias WebP de 1200 × 800 px pesan 1,34 MB en conjunto. Prompts y recursos: `paes/imagenes/fundamentos/`.
- Fuente didáctica pública reproducible en `scripts/paes-foundations-lessons.js`, integrada mediante `scripts/generate-paes-foundations.js` en las 18 páginas. Bloques desplegables, enlace para saltar a las preguntas, dimensiones de imagen reservadas y carga diferida. El apoyo completo permanece fuera de la vista de evaluación independiente. Las respuestas de enseñanza no pertenecen al banco evaluado ni puntúan.
- Se cotejó el encuadre con el temario DEMRE Admisión 2027; G5 sigue siendo complementaria. La skill de instrucción explícita orientó la relación concepto → modelo razonado → comprobación → transferencia; no se modificaron la fórmula recuperada de los libros ni G10–G21 o el backlog G22–G32.
- Build aprobado con 203 recursos críticos y 44 contratos. Primera ronda de ocho pruebas Playwright aprobada: 390/1440/3840 px, guardado y recuperación, entrega, inmutabilidad, privacidad y admin. Capturas de enseñanza e ilustraciones inspeccionadas; sin desborde. Se añadió cobertura de teclado y de ilustraciones en la ruta acompañada para la repetición final.
- Se preserva el cambio de seguridad paralelo `097fd55d`, ya integrado y enviado por su autor. No se tocaron los cambios ajenos de Lirmi ni otras áreas. Publicación y comprobación real de producción pendientes de cierre en una entrada posterior.

## 2026-09-10, PAES 1–9: tarjetas y encuadre de guía publicados y verificados

- Francisco autorizó publicar y apartar temporalmente los dos cambios ajenos de acceso. Se aislaron únicamente `api/estudiantes.js` y `api/lecturas-login.js`; terminado el despliegue se restauraron y se cotejaron sus hashes originales: ambos idénticos. No se incluyeron esos cambios ni se modificaron los demás pendientes del repositorio.
- Publicación canónica mediante `npm run deploy:prod:safe`, código 0 y estado READY: `dpl_5KDs8cKEDAMfuzc6wGxn2yLX6r36`, fuente `38f3e667` con implementación `72042830`, alias `https://www.estudiacest.com`. Predeploy, build local y build del servidor aprobados: 194 recursos críticos, 44 contratos de entrega y auditorías transversales.
- `node scripts/verify-paes-foundations-production.js` terminó con código 0: nueve tarjetas individuales; 18 páginas regulares y acompañadas con objetivo, instrucciones, esquema y cierre; nueve bancos públicos sin claves; pauta privada exige autenticación. Las doce variantes de URL de los cuatro módulos privados terminan en 404.
- Prueba real acotada con identidad ficticia: guardado en línea, recuperación sin copia local, entrega persistida con doble bandera y marcas de tiempo coherentes, recarga inmutable y resultados aún privados. Registro ficticio eliminado y ausencia verificada. No se alteraron estudiantes reales ni liberaciones. Captura móvil pública inspeccionada: objetivo y criterios legibles, instrucciones visibles y sin desborde horizontal.
- Acceso para Francisco: `https://www.estudiacest.com/paes/#cardGuia1`. G1–G9 tienen tarjetas propias y encuadre de aprendizaje; se conservan G10–G21 y la planificación G22–G32. Se mantiene el pendiente pedagógico de revisión docente y pilotaje antes del uso sumativo, sin afirmar validación editorial independiente.

## 2026-09-10, PAES 1–9: mejoras verificadas y publicación detenida por cambios ajenos

- Implementación confirmada y enviada a `origin/main`: `72042830`. Ocho pruebas Playwright aprobadas en la repetición completa (1,1 minutos); inspección de capturas móvil, escritorio y 4K; build completo y auditoría focalizada aprobados.
- `npm run deploy:prod:safe` terminó con código 1 antes de desplegar: hay cambios sin commit, distintos de producción, en `api/estudiantes.js` y `api/lecturas-login.js`. Se preservaron intactos y fuera del commit PAES; no se eludió el guard ni se usó otra fuente.
- Comprobación HTTP del portal: la tarjeta individual G1 todavía no está publicada. La versión pública sigue siendo la anterior. No se ejecutó una prueba de escritura en producción para una versión no desplegada.
- Pendiente: coordinar el cierre o aislamiento autorizado de esos dos cambios, repetir el deploy canónico y ejecutar `node scripts/verify-paes-foundations-production.js`. Las mejoras solicitadas están construidas y probadas, pero aún no visibles en el sitio.

## 2026-09-10, PAES 1–9: tarjetas individuales y encuadre de guía de aprendizaje

- Solicitud adicional de Francisco: separar las nueve tarjetas agrupadas y completar los elementos visuales, objetivos e instrucciones de cada guía.
- Portal: nueve artículos independientes `cardGuia1` a `cardGuia9`, con botón y destino propios; se conserva el ancla histórica `cardFundamentos`, el catálogo y las tarjetas G10–G21.
- Dieciocho páginas, regulares y acompañadas: objetivo observable, tres criterios de logro, instrucciones desplegables, recorrido, activación, esquema conceptual específico y cierre en el cuaderno. El modelado se oculta durante la evaluación independiente. No se alteran textos, claves, intentos ni versión `foundations-v1`.
- Fuentes reproducibles: `scripts/paes-foundations-teaching.js`, generador, integrador y CSS compartido. Auditoría ampliada exige nueve tarjetas y nueve esquemas distintos. Pruebas incluyen sus anchos 390/1440/3840, navegación, guardado, entrega y administración. Build completo aprobado; cierre de pruebas y publicación se registrarán al finalizar.
- Se conservan cambios ajenos pendientes en `api/estudiantes.js` y `api/lecturas-login.js`; no forman parte de esta implementación. La publicación depende del guard canónico de despliegue.

## 2026-09-10, PAES 1–9: comprobación final del bloqueo de bancos

- Tercer despliegue terminado con código 0 y READY: `dpl_3qMucPNoCaZMw837J2mr4UKwJT5a`, commit `b5622eda`, alias `https://www.estudiacest.com`.
- Verificador de producción terminado con código 0: los cuatro módulos privados y sus variantes con barra final y consulta terminan en 404 (doce comprobaciones); 18 páginas HTTP 200; nueve respuestas públicas sin claves; pauta docente protegida.
- Guardado, recuperación sin copia local, entrega persistida y recarga inmutable comprobados con registro ficticio. Limpieza y ausencia del registro verificadas. No se alteraron liberaciones ni estudiantes reales. Queda resuelta la incidencia de URL documentada en las entradas anteriores.

## 2026-09-10, PAES 1–9: bloqueo ampliado a variantes de URL

- Segundo despliegue READY: `dpl_6nRqActXtsawqXRYeMhcACDn3TG6`, commit `91b831bb`. Cuatro descargas directas terminaron en 404; 18 páginas y entrega real volvieron a pasar, con limpieza del registro ficticio comprobada.
- Una comprobación adicional encontró que añadir barra final permitía servir el archivo estático. Se amplía el bloqueo al prefijo completo `/api/_paes-foundations(.*)` y se agrega esa variante al verificador, junto con parámetros de consulta. No se considera cerrado hasta repetir la verificación tras publicar.
- La URL inmutable del primer despliegue exige inicio de sesión Vercel; no entrega públicamente el archivo. Se preserva el historial de comprobaciones y correcciones.

## 2026-09-10, PAES 1–9: comprobación adicional de archivos internos

- La comprobación directa posterior detectó que `outputDirectory: "."` servía los cuatro módulos auxiliares nuevos como JavaScript estático. La API pública sí ocultaba las claves, pero esa comprobación no bastaba para afirmar privacidad del banco.
- Corrección: cuatro redirecciones explícitas de Vercel interceptan la descarga antes del sistema de archivos y terminan en 404 desde la API, sin afectar la importación interna. No se usan rewrites, cuya precedencia no bloquea archivos existentes (documentación: https://vercel.com/docs/project-configuration/vercel-json). Auditoría de build exige las reglas y verificador de producción exige 404 antes de iniciar su prueba de entrega.
- Pendiente al escribir esta entrada: nuevo despliegue seguro y repetición completa de la comprobación en producción. Se conserva el antecedente del primer despliegue abajo; la comprobación posterior manda sobre la afirmación inicial de privacidad.

## 2026-09-10, PAES 1–9: primera publicación y entrega verificadas

- Implementación guardada y enviada a `origin/main`: `ff486d1b`. Despliegue mediante `npm run deploy:prod:safe`, terminado con código 0 y estado READY: `dpl_EaXNu7v5C7NbWLsEnnyLDJo9iE6Z`, asociado a `https://www.estudiacest.com`.
- Build de producción aprobado: 108 reactivos iniciales, 18 páginas, 44 contratos de clase y 194 recursos críticos, además de las auditorías transversales existentes.
- `node scripts/verify-paes-foundations-production.js` terminó con código 0: las 18 páginas responden HTTP 200; los nueve bancos públicos no entregan claves; la pauta docente exige autenticación.
- Prueba real y acotada en G1 con identidad ficticia: guardado en Firebase, recuperación después de borrar la copia local, entrega con pendientes, doble bandera y marcas de tiempo coherentes, versión correcta y recarga sin edición ni resultados anticipados. Registro ficticio eliminado y ausencia comprobada. No se cambiaron bloqueos, liberaciones ni datos de estudiantes reales.
- Captura móvil de producción inspeccionada: texto legible, tildes correctas y sin desborde horizontal. Acceso para Francisco: `https://www.estudiacest.com/paes/#cardFundamentos`; pautas en `https://www.estudiacest.com/paes/admin/`, seleccionar guía y usar «Pauta G1–9».
- Se conservan G10–G21, PDF históricos y planificación G22–G32. Pendiente pedagógico explícito: revisión docente de las pautas y pilotaje antes de uso sumativo; no se declara revisión editorial independiente.

## 2026-09-10, PAES: reconstrucción interactiva de las guías 1–9

- Autorización: Francisco pidió construir G1–G9 y corregir las existentes para unificar el formato actual. Se preservan los PDF históricos y G10–G21; G22–G32 permanecen planificadas.
- Nueve guías regulares, 18 textos originales y 108 reactivos A–D; nueve rutas acompañadas de seis preguntas con acceso individual centralizado. G2 corrige el foco no literario; G5 es poesía complementaria, sin atribuirla como unidad obligatoria PAES.
- Fórmula recuperada: explica, modela, práctica con retiro gradual de ayudas, evaluación independiente y análisis/transferencia tras liberación. Claves, evidencia y distractores en API privada; botón «Pauta G1–9» en el panel docente. Resumen del estudiante separa práctica y evaluación.
- Guardado serializado, recuperación, entrega con pendientes y lectura posterior de las dos banderas/marcas de tiempo. Versión `foundations-v1`: no sobrescribe ni recalifica intentos de versiones distintas. Lectura agregada previa en producción: cero registros en G1–G9; sin cambios en estudiantes reales.
- Integrados portada, catálogo, admin, API, contrato de entrega, manifiesto y auditoría de build. Plan anual actualizado y ficha `paes/GUIAS1_9_VALIDACION.md` con extensión, tareas, decisiones y límites. No se declara pilotaje ni revisión editorial independiente: corresponde cotejo docente antes de uso sumativo.
- Validación: auditoría de 108 reactivos y 18 páginas; siete pruebas Playwright aprobadas (390/1440/3840 px, entregas, publicación, rutas acompañadas, fallo de red, versiones y panel docente). Repetición focalizada de rutas acompañadas tras ajustes: aprobada. Build completo aprobado: 44 contratos de clase y 194 recursos críticos. Inspección visual de celular y escritorio sin desbordes.
- Siguiente paso de esta entrega: commit acotado, push y deploy seguro; comprobación pública y prueba acotada con registro ficticio, seguida de limpieza verificada. El resultado se agregará como nueva entrada al terminar.

## 2026-09-10, Cerrada la exposición de RUT y arreglado el aviso de mensajes

- **Qué pasaba.** La regla del nodo `plataforma_estudiantes/estudiantes` dejaba
  que cualquier estudiante registrado lo leyera completo. Ranking, arena y
  arena-gato lo descargaban en el navegador, y cada perfil trae RUT, correo,
  teléfono y apoderado. Como el usuario es el RUT y la clave inicial son sus seis
  primeros dígitos (780 de 882 perfiles nunca la cambiaron), cualquier estudiante
  podía entrar a la cuenta de otro. Francisco autorizó el arreglo inmediato.
- **Arreglo (commit 284587f8).** Nueva acción `perfiles-publicos` en
  `/api/estudiantes` (`api/_perfiles-publicos.js`): verifica el token, exige
  estudiante registrado o admin y devuelve solo nombre visible, curso y programa
  (sin admins ni la cuenta demo, caché de 3 min). `ranking.html`,
  `ranking-FranciscoJavier.html`, `arena.html` y `arena-gato.html` la usan en vez
  de leer el nodo, y escapan los nombres antes de ponerlos en el HTML.
- **Reglas.** El nodo completo lo lee solo un admin; cada perfil, solo su dueño
  o un admin. Antes de publicar se comparó la regla viva con la del repo; se
  publicó con `npm run deploy:rules` y la regla viva quedó idéntica al repo. La
  copia de `estudiacest-2026` se igualó (sin commit en ese repo).
  `verify-firebase-rules.js` exige ahora esas dos cadenas exactas y recorre el
  sitio: falla si una página de estudiante vuelve a leer el nodo completo.
- **Pruebas con cuenta de estudiante ficticia y temporal** (sin RUT, datos
  inventados). Nodo completo: 401 (antes 200). Perfil ajeno: 401 (antes 200).
  Perfil propio: 200. Guardar `lastLogin`/correo: 200. Avatar: 200.
  `perfiles-publicos`: 200 con 882 perfiles y solo curso, nombre y programa.
  `salas-lista`: 200 con uid, nombre y conteo. En navegador real: panel cargado,
  ranking con 882 filas sin nombres en formato nómina, arena y arena-gato con
  rivales, sin PERMISSION_DENIED. La cuenta de prueba se borró (perfil, avatar
  y autenticación) y no dejó rastro en 24 nodos revisados.
- **Aviso de mensajes del profesor (commit 77da014f).** Encontrado al revisar la
  consola: desde bd6b7eaf (9-sep), `setMessageContent` en `dashboard.html`
  llamaba a `toLocaleString` con `dateStyle` junto con `hour`/`minute`, lo que
  lanza "Invalid option" en todos los navegadores. El error cortaba la función
  antes de encender `bellDot` y mostrar `msgPopup`, así que ningún mensaje avisaba.
  Se reemplazó por día, mes, año, hora y minuto separados. `audit-mi-espacio.js`
  falla si vuelve la combinación (probado rompiéndolo a propósito). En producción,
  la función real corre en Chromium sin error y muestra "10-09-26, 11:53 a. m.".
- Despliegue con `npm run deploy:prod:safe` desde un worktree limpio de
  `origin/main`, porque la carpeta compartida tiene trabajo sin commit de otro
  agente (`api/_paes-foundations-*.js`, que ningún archivo del repo usa todavía).
  `npm run build` aprobó todas las auditorías y los 173 recursos críticos.
- **Pendiente, sin OK de Francisco:** (1) limitar lo que un estudiante puede
  escribir en su propio perfil; hoy puede sobrescribir nombre, curso, RUT y
  programa, y lo legítimo es solo `lastLogin`, `email`, `email_institucional`,
  `perfil_completo`, `password_changed`, `perfil_completado_at`, `telefono` y
  `nombre_apoderado`. (2) Obligar el cambio de la clave inicial. (3) Un
  estudiante de 2A-HC tiene tres perfiles con el mismo RUT; limpiarlo desde el
  panel admin (salas ya lo deduplica).

## 2026-09-10, PAES: planificación reutilizable de 32 guías y fórmula recuperada

- Por indicación de Francisco, las guías ausentes quedan planificadas, no
  construidas ni publicadas. Se conserva G10–G21 y se documenta la continuidad
  G22–G31 con los títulos/fechas de portada; G32 queda reservada sin fecha.
- Se creó `paes/PLAN_CONSTRUCCION_32_GUIAS.md` y se agregó su entrada en
  `REGLAS.md`. Incluye recuperación digital de G1–G9, objetivos observables,
  secuencia futura, tiempos, backlog y condiciones de aceptación/publicación.
- Se recuperó la fórmula del proyecto, contrastando la extracción metodológica
  con las presentaciones OCR de Moraleja 6/7 y la organización de Puntaje
  Nacional: explica, modela, ejercita graduado, evalúa y analiza el error.
  Las reglas actuales de liberación docente prevalecen sobre la retroalimentación
  inmediata descrita en antecedentes antiguos.
- Corrección de antecedentes: G3 y G5 existen como originales de aula; su
  ausencia del catálogo web no autoriza a sustituir sus objetivos. Se conservan
  los simulacros de tres cuartos (49 preguntas/113 minutos), sujetos a una
  ventana extendida; no se los reemplaza por instrumentos de 65 preguntas.
- Se consultó el temario oficial de Admisión 2027. La matriz asigna 14 tareas y
  30 entradas de conocimientos a oportunidades de enseñanza/retorno. Es cobertura
  planificada: queda pendiente certificar cada correspondencia con ítems reales.
- Validación focal: 32 guías, 14 tareas, 17 entradas no literarias y 13 narrativas;
  enlaces locales y UTF-8 correctos. `npm run build` aprobó todas sus auditorías
  y los 173 recursos críticos. No se modificaron flujos, HTML, claves ni datos:
  no corresponde prueba de interacción ni despliegue para este cambio documental.
- Respaldo mediante commit acotado de este bloque, el plan y REGLAS, y push a
  `origin/main`; el hash queda en el historial Git. Próxima construcción: G22,
  cuando se retome su implementación; no se ejecutó dentro de esta tarea.

## 2026-09-10, PAES: secuencia regular completa y operativa hasta la Guía 21

- Se corrigió el salto visible entre las guías 19 y 21. La Guía 20 ahora tiene
  una versión regular propia con tres pares de textos originales, 18 preguntas
  y foco en acuerdos, tensiones, matices y alcance. La ruta individual guiada
  existente se conservó y su estudiante asignado sigue siendo derivado a ella.
- Portada, catálogo de materiales, panel docente, API de entrega, contrato de
  persistencia y manifiesto de publicación quedaron alineados para G20. La
  clave y la retroalimentación permanecen solo en el servidor y los resultados
  no se muestran antes de la liberación docente.
- Se ajustaron las auditorías de G18, G19 y G21 para la nueva continuidad. El
  build completo aprobó 173 recursos críticos. Playwright verificó G17–G18 y
  19 pruebas de G20–G21; la prueba focal de G20 cubrió 390, 1440 y 3840 px,
  guardado, recarga, entrega, liberación y derivación guiada.
- Commit `64cb48a6` enviado a `origin/main`. Despliegue seguro de producción
  `dpl_2hQHUv4G1YWHqvv1Xtc4i2qqASQi` en estado `READY` y alias aplicado a
  `www.estudiacest.com`. Se verificaron por HTTP la portada, el catálogo, G20,
  sus datos/estilos/lógica y G21; una navegación real en Chrome confirmó cinco
  tarjetas consecutivas, 18 reactivos, seis lecturas y ausencia de desborde o
  errores en móvil.
- Se simuló y verificó el cambio de acceso antes de retirar el bloqueo `g20` en
  Firebase. La lectura pública posterior confirmó `g20: false` y `g21: false`
  para un alumno sin excepción.

## 2026-09-10, Salas: "Nombre Apellido" y fuera los perfiles del navegador

- Pedido de Francisco: que en las casas se vea primer nombre y primer apellido.
  `api/_nombre-visible.js` resuelve el orden de nómina (PATERNO MATERNO
  NOMBRES) con apellidos compuestos (DE LA FUENTE, DEL RÍO, SAN MARTÍN) y
  desempata dentro del curso con la inicial del materno. Medido sobre los 882
  perfiles sin imprimir nombres: 0 resultados vacíos o anómalos; los 10 con
  apellido compuesto al inicio antes salían con un pedazo del apellido.
- Al revisarlo aparecieron dos exposiciones del chat, ya corregidas:
  `presentes` y `chat` guardaban el nombre completo (nodos que leen todos los
  estudiantes), y la lista "¿A quién visitas?" descargaba el nodo `estudiantes`
  entero, con RUT, en el navegador. Ahora la lista la arma el servidor
  (`salas-lista`) y solo devuelve nombre visible y ocupación; el nombre completo
  queda solo en `bloqueados_chat` y `alertas_chat`, de lectura exclusiva del
  profesor. En la base había una sola sala de prueba y ningún nombre de nómina:
  no alcanzó a exponerse nada por el chat.
- El navegador tiene una copia de la función; `audit-mi-espacio.js` corre ambas
  con los mismos casos. Probado con mutaciones: el build se detiene si divergen
  o si la sala vuelve a guardar el nombre completo.
- Deploy desde un worktree limpio de `origin/main`: la carpeta compartida tenía
  la Guía 20 de PAES a medio hacer (sin commit) y el deploy seguro la bloqueó,
  como corresponde. Se verificó antes que la carpeta no tuviera nada publicado
  fuera de Git (solo los cinco archivos de la Guía 20, que daban 404).
- Commit `ba7ae9db`. Producción verificada: el `mi-espacio.js` servido usa
  `salas-lista` y no lee `/estudiantes`; dashboard, Guía 21, rutas guiadas e
  interrogaciones responden 200.

**Pendiente grave, anterior al chat, esperando decisión de Francisco:**
`ranking.html`, `arena.html` y `arena-gato.html` descargan el nodo `estudiantes`
completo en el navegador de cualquier estudiante, y la regla `.read` de ese
nodo lo permite. Cada perfil trae el RUT, el usuario es el RUT y la clave
inicial son sus seis primeros dígitos; 780 de 882 estudiantes no la han
cambiado. Propuesta: un endpoint que devuelva solo nombre visible y curso para
esas tres páginas, y después cerrar la regla (`.read` del nodo solo admin;
cada `$uid` solo para sí mismo o admin), comparando antes las reglas vivas.
También hay un estudiante de 2°A HC con tres perfiles con el mismo RUT.

## 2026-09-10, Mi espacio: visitas, chat con filtro, teclado, terreno y asientos

- Chat y visitas dentro de la pestaña Mi casa del panel: hasta 30 personas por
  casa, presencia con latido cada 20 s y caída a los 60 s sin señal, últimos
  100 mensajes por casa. El cliente solo lee el nodo `salas`; todo lo que se
  escribe pasa por el servidor (`api/_salas.js`), que identifica por token,
  limita a un mensaje cada 1,5 s y revisa cada texto con
  `api/_filtro-garabatos.js`.
- El filtro compara por palabra normalizada, no por "contiene" (computador,
  disputa, diputado y "las 3 y pico" pasan), entiende deletreos, leet y las
  formas chilenas (weón, ql, ctm, conchetumare pegado o separado), y NO
  bloquea lo que indica riesgo: "me quiero morir" se publica y llega como
  alerta. Lo bloqueado no se publica pero queda registrado. La auditoría corre
  35 casos (bloquear, dejar pasar, alertar). Nueva sección "Chat de casas" en
  `adminprofe/` con alertas, intentos bloqueados y casas con gente; marcar una
  alerta como vista pasa por la API con token de admin.
- Movilidad sin mouse: flechas o WASD y un pad en pantalla; Tab elige muebles y
  las flechas los mueven; R gira, Supr guarda, Esc suelta. El personaje se
  sienta en sillas, sofás y camas. Terreno: 8 pisos (variantes teñidas del
  sprite) y 8 colores de muro, desbloqueables por XP. Corregido el orden de
  dibujo: las alfombras se pintan antes que todo lo demás y ya no tapan las
  piernas del personaje.
- Las salas van como módulo interno enrutado desde `api/estudiantes.js` con
  acciones `salas-*`: Vercel Hobby admite 12 funciones y estaban ocupadas; la
  auditoría de la Sesión 7 lo detectó y la de Mi espacio ahora exige que
  `api/salas.js` no exista.
- Reglas de RTDB: tres nodos nuevos bajo `plataforma_estudiantes` (`salas` con
  lectura para registrados, `alertas_chat` y `bloqueados_chat` solo admin),
  los tres con escritura cerrada al cliente. Publicadas con
  `npm run deploy:rules` y releídas desde producción: idénticas al repo. La
  copia de `estudiacest-2026` se sincronizó antes, como exige la guarda.
- Bloqueos de deploy encontrados y resueltos en el camino, sin tocar código
  ajeno: el guard exigía en producción los recursos de la Guía 21 que otro
  agente acababa de sumar al manifiesto (lo resolvió su propio flag
  `allowMissingInProduction`), y después el build remoto murió porque
  `scripts/audit-paes-g21.js` estaba en el build pero no en la lista blanca de
  `.vercelignore` (regla 10). Se agregó esa línea.
- Verificación pública tras el deploy: `mi-espacio.js` trae las acciones
  `salas-`, el CSS trae el pad, una llamada sin token a `salas-latido` responde
  401 con el mensaje nuevo, pisos y admin responden 200 y `paes/guia21.html`
  quedó publicada. Commits `2ed3d254` y `b9581813`; deploy
  `dpl_6TEtq62rFtVEP2g6QweFoNfTTZZ1`.
- Pendiente de decisión docente: el nombre que se muestra en el chat toma la
  tercera palabra del nombre registrado (formato APELLIDO APELLIDO NOMBRE); si
  algún curso tiene otro formato, se verá el apellido.

## 2026-09-10, PAES Guía 21: Simulacro parcial 1, sesión del 10 de septiembre

Codex la estaba construyendo y se cayó a medio camino; el trabajo quedó sin commit en el árbol y se retomó desde ahí en esta sesión. Francisco la llama «clase 20 de PAES HC»; en la numeración del portal y del admin es la Guía N°21.

**Qué quedó publicado.**

- `/paes/guia21.html`: tres lecturas originales (626, 556 y 571 palabras; la segunda con tabla y gráfico de barras), 24 preguntas A-D, ocho por lectura, con habilidades Localizar 4, Interpretar 15 y Evaluar 5. Tiempo sugerido 50 minutos. Tres pestañas de lectura más una de revisión y entrega, con mapa de respuestas, marcas «para revisar» y dos reflexiones breves.
- Clave (6 por letra) y retroalimentación por ítem en `api/_paes-g21.js`, cargadas por `api/paes.js`. El JSON público `paes/data/guia21.json` no contiene claves ni retroalimentación.
- Se puede entregar con preguntas pendientes y el servidor aplica la misma regla, porque `21` figura en el catálogo guiado y por eso entra en `INCOMPLETE_SUBMISSION_GUIDES`.
- Ruta individual: `guia21-guiada.html` existía desde el 28 de agosto; el portal la enruta para el estudiante con acceso guiado y la página regular lo redirige por RUT.
- Portal: la Guía 19 pasa a «Sesión anterior», la 21 es «Sesión actual» y desaparece de la fila de futuras; el bloqueo de guías cubre hasta g21. Admin: g21 pasa de «Ruta individual» a «Interactiva» con 24 ítems, mapa de habilidades y clave que llega desde el servidor; el panel abre por defecto en la 21.
- Contrato de entrega: `paes/guia21.html` con storage api. Manifiesto de release: siete recursos nuevos de G21.

**Correcciones sobre lo que dejó Codex.**

1. Un borrador que estaba encolado se seguía enviando después de que un 409 reconciliara la entrega hecha desde otra pestaña. Ahora la cola descarta ese envío si la guía ya está entregada, pero sigue vaciándose completa antes de una entrega en curso.
2. Las dos reflexiones no se bloqueaban mientras la entrega estaba en curso; ahora se deshabilitan junto con las alternativas.
3. Las tres ilustraciones pesaban 8,2 MB en total; se dejaron en PNG de 256 colores, mismo nombre y mismas dimensiones 1536×1024, 2,3 MB en total.

**Verificación.** `scripts/paes-g21-flow.spec.js` corre 14 de 14 con Playwright contra un servidor local que no expone nómina ni API real. Nueva auditoría `npm run audit:paes-g21` (lecturas, reactivos, clave en servidor, coherencia JSON-admin, portal, contrato y manifiesto), enganchada a `build`. Auditorías g18, g19, guiadas, release-review, contrato de entrega (25 clases), reglas de Firebase y `verify-academic-release --artifact` en verde.

**Pendiente.** Publicar resultados desde el admin cuando Francisco lo decida (PAES no muestra puntaje hasta entonces). La Guía 20 del 3 de septiembre quedó solo como ruta individual; no hubo versión regular. Probar la sesión en un celular real al inicio de la clase.

**Publicación y dos trampas.** Commits `066e392c`, `98fd96e5`, `e660fc84`, `b9581813` y el cierre del manifiesto; desplegado con `npm run deploy:prod:safe` y verificado en vivo (página, datos, lógica, estilos, tres ilustraciones, ruta guiada, portal, admin y API respondiendo para la guía 21).

1. El `.gitignore` de la raíz de profe-blog tiene `GUIA*.html` (línea 78) y en Windows eso atrapa cada `paes/guiaNN.html` nueva: el primer commit salió sin la página y hubo que forzarla con `git add -f`. Antes de dar por publicada una guía, confirmar con `git ls-files` que la página está trackeada.
2. `.vercelignore` excluye `scripts/*` salvo una lista blanca. Toda auditoría nueva que entre a `build` necesita su línea `!scripts/audit-...js`; sin ella el build de Vercel falla con `MODULE_NOT_FOUND` aunque local pase.

El proyecto Vercel no está conectado a GitHub: un push a main no publica nada. Los recursos nuevos entraron con `allowMissingInProduction: true` y, una vez verificados en producción, el manifiesto volvió a protegerlos sin la excepción.

**Bloqueo de guías.** La Guía 21 quedó publicada y verificada con `g21` todavía en `plataforma_paes/guias_config/blocked`, herencia del bloqueo masivo de guías futuras del 20 de agosto. Se quitó solo esa clave con `firebase database:remove` (lectura antes, 32 claves; después, 31; relectura por la API pública). Mientras tanto la cuenta admin guardaba la misma configuración desde el panel y quitó `g17`; el panel reemplaza el mapa completo al guardar, así que hay que recargarlo antes de volver a guardar para no rebloquear la 21. Lección: publicar la guía del día no la habilita; hay que leer `get-guias-config` y quitar su id.

---

## 2026-09-09, regularización general de entregas y reapertura SIMCE U3

- Se definió un contrato único para clasificar todas las entregas: una clase se
  considera entregada solo por confirmación final verificable, por evidencia
  digital legada suficiente o por una atestación manual explícita. Una nota,
  un resultado aislado, telemetría o un borrador no bastan por sí solos.
- La reconciliación general revisó en simulación 946 pares de estudiante y
  sesión. Detectó 342 entregas legadas normalizables y 22 estados de nota
  desactualizados; los casos parciales o contradictorios quedan señalados para
  revisión y nunca se marcan automáticamente como entregados.
- Se preparó la reapertura de las 11 actividades SIMCE de Unidad 3 para los 86
  estudiantes de los dos cursos, hasta el 23 de septiembre, junto con un aviso
  persistente y dirigido en el panel. La simulación validó 69 rutas atómicas.
- La Sesión 7 exige ahora confirmación final completa y reconcilia respuestas
  interrumpidas. La Sesión 10 mantiene ocultas las respuestas correctas y la
  retroalimentación hasta que el docente las libere desde la configuración.
- La escritura y su relectura confirmaron 11 sesiones abiertas, 86 estudiantes
  y el aviso del panel. La reconciliación normalizó 342 entregas históricas y
  corrigió 22 estados de nota; una auditoría independiente dejó cero marcas
  legadas y cero notas desactualizadas entre los 946 pares revisados.
- `npm run build` aprobó contratos, auditorías de reconciliación, Sesiones 7 y
  10, reapertura y los 162 recursos críticos. El dominio público respondió 200
  y coincidió con los cuatro archivos desplegados. Commits `bd6b7eaf` y
  `1ebdef96`; deploy productivo `dpl_AsSnwU2FT9UrvmMyXkuvZmsJrYVp`.

## 2026-09-09, ruta personal SIMCE de sesiones 2 a 10

- Se reemplazó la estrategia de excepciones individuales en las guías estándar
  por nueve sesiones exclusivas dentro de la ruta personal ya habilitada. Esta
  entrada corrige y deja sin efecto los 11 desbloqueos descritos en la entrada
  anterior; la entrega existente de la Sesión 1 se conservó sin cambios.
- Cada sesión presenta un estímulo breve, apoyo visual, tres pasos, seis
  preguntas A-D de una en una, lectura en voz alta y trabajo sin temporizador.
  Incluye autoguardado, entrega atómica, lectura final de confirmación y claves
  y retroalimentación alojadas solo en el servidor.
- La lectura posterior de Firebase confirmó nueve de nueve sesiones personales
  asignadas y diez de diez accesos estándar ausentes. La Sesión 7 general quedó
  activa para su aplicación regular, sin incorporarla a la cuenta especial.
- `npm run build` aprobó 24 contratos y 162 recursos críticos. La prueba de
  navegador aprobó móvil y escritorio, navegación entre preguntas y ausencia
  de desbordamiento. Producción respondió 200 para la ruta y sus recursos, y la
  API rechazó correctamente el acceso sin sesión con 401.
- Commits funcionales `4a3bc2ad`, `cb90d04d` y `4f00b8b1`. Deploy productivo
  `dpl_B1hXypnbeHdy7KboVSTmXvuKwiW6`.

## 2026-09-09, habilitación individual de todas las guías SIMCE de Unidad 3

- Se resolvió una única cuenta del curso solicitado contra la nómina vigente y
  se confirmó que tenía perfil completo y correo institucional registrado.
- La simulación reunió las clases 1 a 10 y el ensayo de la unidad. Se
  escribieron 11 excepciones individuales de acceso, sin abrir las sesiones
  para el resto del curso ni modificar respuestas o resultados existentes.
- Una lectura posterior independiente confirmó 11 de 11 permisos. El aviso se
  envió desde la cuenta institucional y quedó verificado en la carpeta de
  enviados. La Clase 9 se informó como material sin entrega y no pendiente.
- Fue una mutación de datos y una notificación; no requirió cambios de
  aplicación ni despliegue.

## 2026-09-09, cierre QA de las clases SIMCE 9 y 10

- La Clase 9 quedó declarada explícitamente como informativa mediante
  `requiere_entrega: false`: el panel muestra `Informativa`, no `Pendiente`, y
  la excluye del total de clases obligatorias. La guía no pertenece al contrato
  de entregas ni escribe respuestas del estudiante.
- La propiedad se persistió en Firebase y su lectura posterior devolvió
  `false`. La Clase 10 mantiene su flujo evaluativo con 14 preguntas,
  desarrollo, producción escrita, guardado automático, entrega confirmada y
  recuperación del estado al reingresar.
- Se corrigió el ancho de las ilustraciones de ambas guías para evitar
  desbordamiento horizontal en móvil. `npm run build` aprobó las auditorías de
  las dos clases y los 158 recursos académicos críticos.
- La prueba de navegador contra producción aprobó panel, Clase 9 y Clase 10 en
  escritorio y móvil, sin errores de consola, página, red ni respuestas HTTP
  fallidas. Commit funcional `d0d451c6`. Deploy productivo
  `dpl_4ZLTtKihpRDTFNQb54RC9VofLtSF`.

## 2026-09-08, registro de interrogaciones manuales NM3 en 3°B

- Se registraron ocho calificaciones finales informadas por el docente para
  interrogaciones orales realizadas manualmente de *El lugar sin límites*.
- La simulación previa resolvió ocho números de lista únicos contra la nómina
  vigente y confirmó que ninguno tenía nota ni grabación previa.
- La escritura y la lectura posterior coincidieron en ocho de ocho registros,
  con origen manual declarado, sin preguntas o puntajes inventados y sin crear
  audios. Fue una mutación de datos; no requirió cambios de aplicación ni
  despliegue.

## 2026-09-08, pauta visible en la interrogación manual de *El lugar sin límites*

- El panel docente NM3 muestra ahora una respuesta esperada bajo cada una de
  las siete preguntas sorteadas. Se incorporó una pauta sustantiva para las 50
  preguntas y se conserva la correspondencia cuando se cambia una pregunta.
- La pauta quedó solo en la vista docente de calificación manual; no se expone
  en la página del estudiante ni forma parte de la configuración del flujo de
  audio.
- `npm run audit:interrogaciones` y `npm run build` aprobaron. La verificación
  en producción confirmó siete preguntas y siete respuestas en escritorio y
  móvil, sin desbordamiento horizontal.
- Commit funcional `c4eb4a37`. Deploy productivo
  `dpl_8nNJ3Fa6fibYouD5cVrCUThCj9M3`.

## 2026-09-08, cuota general de 3 GB por estudiante en Anuario 4DTP

- La carpeta privada de cada estudiante admite ahora 3 GB acumulados entre
  audios, fotografías, documentos y otros aportes. La cuota corresponde al
  total de la carpeta y no se aplica como un límite fijo por archivo.
- La API descuenta el audio anterior al reemplazar una entrevista y cuenta las
  reservas activas antes de autorizar una subida, por lo que las cargas
  simultáneas tampoco pueden superar los 3 GB. Storage mantiene la validación
  del propietario, la ruta y el tamaño exacto autorizado por la API.
- `npm run audit:anuario-4dtp`, `npm run verify:rules` y `npm run build`
  aprobaron. Las pruebas de borde aceptaron exactamente 3 GB y rechazaron un
  byte adicional; producción respondió con `maxStudentStorage: 3221225472`.
  La página se abrió en móvil y escritorio sin errores de consola ni desborde.
- Commit funcional `7383d963`. Deploy productivo
  `dpl_72DGEjpmdg2zpNu72zjBdCa5YkPN`. Reglas de Storage publicadas en el
  ruleset `e827b647-bf9b-42f8-97c3-034700d8f00d`.

## 2026-09-08, sincronización entre docentes en las interrogaciones orales

- Los paneles de `Mocha Dick` y `El lugar sin límites` consultan nuevamente la
  nómina cada 30 segundos, actualizan pendientes, notas y grabaciones sin
  recargar la página y conservan el estudiante seleccionado mientras siga
  disponible.
- Antes de iniciar una interrogación manual o con audio se exige una consulta
  fresca. Si otro panel ya tomó al estudiante, la interfaz lo informa y evita
  comenzar. La API también rechaza una grabación o calificación manual tardía,
  por lo que un panel no puede sobrescribir silenciosamente al otro.
- `npm run audit:interrogaciones` y `npm run build` aprobaron. En producción se
  abrieron ambos paneles simultáneamente: cada uno hizo una nueva consulta al
  cumplirse los 30 segundos, mantuvo su selección y no registró errores de
  consola ni respuestas fallidas.
- Commit funcional `d3abae21`. Deploy productivo
  `dpl_B5d4g1bCH25hz8tPZGH6D8n4jfx7`.

## 2026-09-08, avance `No sabe` y cierre de calificaciones orales pendientes

- Las interrogaciones orales NM3 y NM4 incorporan la acción explícita
  `No sabe · siguiente`. El servidor guarda una marca sin audio asociada a la
  pregunta y posición exactas, permite avanzar y exige igualmente siete
  posiciones antes de entregar. En la revisión aparece diferenciada de una
  falla técnica, propone `0,0` y puede reemplazarse por una grabación.
- La descarga técnica ya no intenta reproducir ni transcribir esas posiciones:
  las omite como archivos de audio y las enumera por separado en el manifiesto.
- La prueba simulada de navegador recorrió las siete preguntas, confirmó una
  sola entrega, siete marcas visibles y siete puntajes iniciales `0,0`, sin
  errores de consola. También se corrigió NM3 para habilitar el inicio de audio
  y excluir de la nómina inicial a quienes ya tienen un registro.
- Se revisaron las tres entregas completas nuevas de NM4: 21 audios, 21
  puntajes y 21 evidencias. La simulación previa, la aplicación y la lectura
  posterior coincidieron; los tres PDF institucionales resultantes aprobaron
  cabecera, tamaño A4 y una sola página.
- Se dejó documentado además el lote inmediatamente anterior de 14 entregas
  completas NM4: 98 audios revisados, 14 calificaciones leídas de vuelta y 14
  PDF A4 de una página validados, sin incidencias técnicas.
- `npm run audit:interrogaciones` y `npm run build` aprobaron. Commit funcional:
  `fb96503b`. Deploy productivo: `dpl_By4DSikJByJ5eVagyAw2ZFCc4b9o`.

## 2026-09-07, corrección del flujo Continuar grabación

- Se corrigió `Continuar grabación` en el panel de interrogaciones orales: ahora
  recupera directamente el intento incompleto y avanza a la primera respuesta
  pendiente, sin intentar seleccionar al estudiante en una nómina que lo excluye
  precisamente por tener una grabación iniciada.
- Se corrigió una condición de carrera al cargar el panel NM4. La actualización
  compartida ya no intenta repintar estudiantes antes de que la nómina principal
  haya recibido sus cursos; con ello la tabla deja de quedar detenida en
  `Cargando grabaciones…` por una respuesta de red que llega en distinto orden.
- La auditoría de interrogaciones incorpora regresiones para ambos contratos.
  `npm run audit:interrogaciones` y `npm run build` aprobaron antes del despliegue.
- Producción confirmó en NM4 y NM3 que las tablas cargan sin aviso de error y
  que `Continuar grabación` abre el mismo intento en su primera respuesta
  pendiente, sin iniciar el micrófono ni modificar los datos. Commit funcional:
  `9f9a8d5c`. Deploy: `dpl_4sBfm1WWH7fjdnk9ZDEZRYkBJvfX`.

---

## 2026-09-07, Unidad 3 Clases 9 y 10: corrección del ensayo, crónica y carta, imágenes IA e integridad

- **Clase 9** (`sesion-u3-9`, 9-sep, `guia-u3-s9-correccion-ensayo.html`): corrige las 36 preguntas
  del ensayo de la Clase 8, con % real de acierto por pregunta calculado en el servidor
  (`api/estudiantes.js`, acción `simce-u3s9-classstats`, agregado por curso, sin exponer
  identidad). Es **solo informativa**: no tiene botón de entrega ni está en
  `class-submission-contract.json`. Al final trae una sección de práctica dirigida (6
  reactivos nuevos, 2 por habilidad) que se abre por defecto en la habilidad con menor %
  del propio curso. El orden correcto es: revisar las 36 respuestas primero, practicar
  después — no al revés.
- **Clase 10** (`sesion-u3-10`, 23-sep, `guia-u3-s10-cronica-carta.html`): clase de enseñanza
  (no ensayo) sobre crónica y carta, con dos textos originales sobre el mismo hecho, 14
  reactivos, un desarrollo con respuesta modelo, y una tarea de producción nueva —**escribir
  una noticia propia** sobre un hecho real del curso, sin opinión— que se guarda en
  `resultados/sesion-u3-10/<uid>.noticia`. Guarda directo a Firebase (patrón de la Clase 6:
  clave visible, corrección al responder cada bloque), sí está en el contrato de entrega
  (`storage: firebase-client`).
- **Reglas de construcción de reactivos**, aplicadas por primera vez como chequeo automático
  (`scripts/audit-simce-u3s9.js`, `scripts/audit-simce-u3s10.js`): 4 alternativas sin
  duplicados, cada distractor con una falla técnica explícita y etiquetada, clave resuelta
  por cita textual, y clave nunca notoriamente más larga que los distractores (conteo real
  de caracteres). La auditoría encontró y corrigió 6 reactivos de la Clase 10 donde la clave
  era 18 a 48 caracteres más larga que el distractor más largo.
- **7 ilustraciones generadas con Nano Banana** (Gemini, `gen_image.py`), paleta navy/dorado
  del sitio, sin rostros identificables: hero e infografía de habilidades en la Clase 9;
  hero de la crónica, ilustración de la carta, infografía comparativa crónica-vs-carta e
  ícono de la caja ATENCIÓN en la Clase 10. Registradas en el manifiesto.
- **Integridad de la Clase 10**: `work-telemetry.js` ya registra tiempo activo, copiar/pegar
  y cambios de foco por estudiante (no hacía falta agregarlo). Se sumó `startedAt`/`elapsedMs`
  propios en el payload de entrega, y un script nuevo de revisión manual,
  `scripts/audit-simce-u3s10-integridad.js` (`npm run review:simce-u3s10-integridad`), que
  cruza tiempo de entrega vs. puntaje, uso de copiar/pegar, y similitud de 8-gramas entre los
  textos libres (`desarrollo`, `noticia`) de estudiantes del mismo curso. Es un barrido para
  revisar caso por caso, no un veredicto automático; hay que correrlo después de que cierren
  las entregas de la Clase 10 (23-sep) con las credenciales reales de Firebase.
- Deploys: `dpl_ARSFGLvW1tQmLaS6Au9G92UNCi7r`, `dpl_GmcNg9gsBCoi1XaQNZ9johxHQo1a`,
  `dpl_EGc1rAzbep1pMK5rfSMYx9WibGcW`, `dpl_BvTYgM5ND9jtfJRbvAu8boS2Kxhr` y el pendiente de
  este cierre. Commits: `3513c062`, `c0d2cd4d`, `57928b17`, `b61c08f3`, `16bf1d47`.
- Pendiente: correr `npm run review:simce-u3s10-integridad` después del 23-sep y revisar los
  casos que arroje antes de tomar cualquier acción sobre un estudiante.

---

## 2026-09-07, nómina pendiente y filtros en la interrogación de Mocha Dick

- Se aplicó y leyó de vuelta la calificación máxima de la entrega oral que el
  docente definió expresamente como referencia de desempeño. El registro quedó
  asociado a sus siete audios, con siete puntajes, siete síntesis de evidencia
  y una retroalimentación específica. El PDF resultante fue validado como una
  página A4.
- La nómina para iniciar una interrogación ahora excluye a quienes ya tienen
  una grabación iniciada, entregada o calificada, y muestra el total disponible
  del curso. Esos estudiantes siguen accesibles en las tablas de notas y
  grabaciones para revisar, continuar, descargar o eliminar su registro.
- Las tablas de notas y grabaciones incorporan filtros independientes por
  curso. El filtro no modifica datos y conserva el acceso a todos los registros
  cuando se selecciona "Todos los cursos".
- `npm run audit:interrogaciones` y `npm run build` aprobaron. La verificación
  productiva confirmó los dos filtros, la exclusión de la entrega de referencia
  de la nómina disponible, la nota, los siete audios y las siete evidencias.
  Commit funcional: `13f248d7`. Deploy productivo:
  `dpl_4TnBioQUFA47n3i2ynwPeVUxV9md`.

---

## 2026-09-07, preguntas autosuficientes en el sorteo de Mocha Dick

- Se reescribieron trece preguntas del banco que dependían de un referente
  implícito o de una pregunta anterior. Cada reactivo sorteado ahora nombra la
  obra, el personaje, el barco, el periodo o la escena necesarios para
  comprenderlo de manera independiente.
- Se conservaron la numeración, la habilidad evaluada y las respuestas
  esperadas; los registros de interrogaciones ya realizadas no cambian.
- La auditoría exige referentes explícitos en los casos de Caleb, el Dauphin,
  Nathan Coffin, el cambio tecnológico de 1870 y el desenlace de Macys.

## 2026-09-07, pauta visible en la interrogación manual de Mocha Dick

- El modo `Interrogar manual` muestra, debajo de cada pregunta sorteada, una
  respuesta esperada breve para orientar la calificación docente en vivo.
- La pauta tiene cincuenta respuestas alineadas uno a uno con el banco y señala
  criterios de aceptación en los reactivos interpretativos. No se incorpora a
  la configuración ni a la interfaz del modo `Interrogar con audio`.
- La pauta se contrastó con la obra. Se fijó, entre otros datos, que el Essex
  naufragó el 20 de noviembre de 1820 y que los sobrevivientes llevaban casi
  ochenta días a la deriva.
- Se corrigió y leyó de vuelta el único registro ya calificado que había sido
  penalizado por responder correctamente ese dato; se recalcularon el puntaje,
  la nota y la retroalimentación sin alterar los audios ni las demás respuestas.
- La auditoría específica y el build completo verificaron el banco, las claves,
  el aislamiento del modo de audio y los 148 recursos críticos.

## 2026-09-07, corrección y evidencia de las interrogaciones orales NM4

- Se corrigió la conversión de logro a nota para que la escala comience en
  `1,0` y llegue a `7,0`, conservando los avances parciales de cada respuesta.
- La interrogación con audio permite cambiar exactamente una pregunta antes de
  grabarla. El servidor rechaza un segundo cambio, una pregunta repetida y el
  reemplazo después de iniciar el audio de esa posición.
- Ocho entregas completas fueron revisadas con la calibración `60/100` y leídas
  de vuelta desde producción. Cada calificación conserva siete puntajes, siete
  síntesis fieles de las respuestas y el intento de audio correspondiente.
- Se eliminó la corrupción de tildes y eñes en las retroalimentaciones. El
  detalle y el PDF muestran `Respuesta registrada` cuando existe una síntesis
  revisada; no se presenta como transcripción literal si alguna palabra del audio
  es dudosa.
- Se verificó en producción un PDF institucional de una página A4, sin
  caracteres sustituidos, con siete filas, nota, evidencias y retroalimentación
  sin cortes. El inventario final no mostró nuevas entregas completas pendientes.
- Commits funcionales: `e728eee0` y `e8de02c4`. Deploy productivo vigente:
  `dpl_49BUh2E6TgBUm1rPbGADE8Ai1dCP`.

## 2026-09-07, preparación de revisión oral Mocha Dick en 4°A

- Se verificó en producción, sin modificar registros, que la interrogación de
  `Mocha Dick` está guardando evidencia durante su aplicación: tres entregas
  completas con siete respuestas cada una; el panel mostraba además registros
  en curso. Ningún objeto informado por el servidor tenía tamaño cero.
- Se descargaron temporalmente los veintiún audios de las entregas completas y
  todos fueron decodificables como WebM/Opus y presentaron señal medible. El
  contenedor de Chrome no siempre declara duración, por lo que la validación se
  realizó decodificando el contenido y no leyendo solo ese metadato.
- Se creó la skill
  `.github/skills/estudiacest-oral-interrogation-grading` para inventariar,
  escuchar, contrastar con la obra, proponer puntajes, aplicar solo con orden
  explícita y generar una retroalimentación institucional de una página A4.
- La exigencia interna quedó fijada en `60/100`. No se aplicaron notas, no se
  publicaron resultados y no se alteraron audios mientras la evaluación sigue
  en curso.

## 2026-09-03, revisión de consultas y reaperturas individuales SIMCE

- Se contrastaron dos consultas recibidas por correo con las entregas, las
  calificaciones publicadas y los controles de integridad registrados en
  Firebase. Se respondió en los hilos originales explicando la escala de
  laboriosidad y diferenciando coincidencia textual de rapidez de respuesta.
- Se confirmó una actividad antigua sin entrega y una actividad vigente en
  progreso. Ambas quedaron con acceso individual en Firebase para completarse
  hasta el domingo 6 de septiembre; no se modificaron respuestas ni notas.
- La lectura posterior confirmó los dos permisos en `true`. El panel SIMCE y
  las dos guías involucradas respondieron HTTP 200 en producción.

---

## 2026-09-03, rúbrica institucional descargable de las interrogaciones

- Las interrogaciones de `El lugar sin límites` y `Mocha Dick` muestran la
  opción `Descargar PDF` automáticamente después de guardar una calificación,
  tanto en la tabla de calificaciones manuales como en el detalle de respuestas
  grabadas.
- El documento incluye insignia institucional, identificación del instrumento,
  estudiante, curso, nota, resultado de las siete respuestas, escala aplicada,
  retroalimentación y nota de seguimiento. Se genera al solicitarlo y queda
  ajustado a una sola página A4, listo para enviar o imprimir.
- Se probó en producción el ciclo completo: calificación temporal, aparición del
  botón, descarga de un PDF válido de 79.273 bytes, verificación de una página
  A4 y eliminación posterior del registro. Firebase quedó sin el dato temporal.
- NM3 y NM4 aprobaron la revisión en escritorio y móvil, sin desborde, errores
  de consola, solicitudes fallidas ni respuestas HTTP 5xx. El build completo
  aprobó 148 recursos críticos.
- La auditoría de dependencias no reporta vulnerabilidades altas ni críticas.
  Permanecen ocho avisos moderados transitivos de `uuid`; la corrección
  automática disponible requiere una actualización mayor de Firebase Admin y
  se deja para una migración independiente.
- Commit funcional: `e7ad2aff`. Deploy productivo:
  `dpl_CdzwbdhWtq1Jy2m3mKQRHgB5BEyN`.

---

## 2026-09-03, detalle y corrección de respuestas grabadas

- `Continuar grabación` quedó reservado para retomar una interrogación incompleta
  desde la primera respuesta faltante. Cada registro dispone además de `Ver
  detalle`, incluso mientras todavía está en curso.
- El detalle permite escuchar cada audio, identificar respuestas pendientes,
  volver a grabar una posición específica y guardar una nota docente de
  seguimiento independiente de la retroalimentación de la calificación.
- Reemplazar una respuesta ya calificada conserva los demás audios y la nota de
  seguimiento, elimina la calificación que dejó de corresponder y devuelve el
  registro al estado `Por revisar`. Una carga fallida no elimina el audio previo.
- La auditoría focalizada y el build completo aprobaron 148 recursos críticos.
  En producción se verificaron el registro incompleto, detalle de siete
  posiciones, persistencia de la nota tras recargar, reemplazo y reproducción
  del audio, invalidación de una calificación previa, limpieza de los registros
  técnicos, vistas móvil y escritorio, y cero errores de consola.
- Commit funcional: `e9b13c36`. Deploy productivo:
  `dpl_7NVgUWF2TxrtnsJpBS2dJr1jXw71`.

---

## 2026-09-03, nombres claros para los modos de interrogación

- En los paneles NM3 y NM4, `Grabar para revisar` pasó a llamarse
  `Interrogar con audio` y `Calificar ahora` pasó a `Interrogar manual`.
- La auditoría específica y el build completo aprobaron 148 recursos críticos.
  La comprobación HTTP confirmó ambos textos en las dos rutas productivas.
- Commit funcional: `8ac94564`. Deploy productivo:
  `dpl_821ejn9fEEjSNgFQg4KDdTaTgzct`.

---

## 2026-09-03, selección explícita de micrófono y prueba de 20 segundos

- La inspección del archivo reportado confirmó que la carga funcionaba, pero la
  entrada entregada por el navegador estaba muda: el WebM tenía pista Opus mono,
  5,6 segundos, 1.693 bytes y nivel máximo de -91 dB.
- Se retiraron las solicitudes de cancelación de eco, supresión de ruido y
  ganancia automática para evitar incompatibilidades con controladores de
  audio. La captura usa ahora la entrada sin procesamiento obligatorio.
- Después de conceder permiso, el panel enumera los micrófonos disponibles,
  identifica cuál está en uso y permite elegir otra entrada antes de repetir.
  El medidor advierte si no recibió voz, pero no bloquea el guardado.
- Una prueba productiva en navegador aislado grabó 21 segundos, detectó señal,
  mostró el micrófono seleccionado, creó un archivo de 124.941 bytes, obtuvo
  respuesta HTTP 200 al leerlo y no produjo errores de consola ni desborde en
  390 píxeles. El intento y el audio técnicos fueron eliminados al terminar;
  también se retiraron los intentos vacíos anteriores.
- Commit funcional: `d08fc30b`. Deploy productivo confirmado y alias vigente:
  `dpl_EGeP4i3wa7hvxJFCcNG9G7MA4kPP`.

---

## 2026-09-02, grabación oral y corrección del audio vacío

- Las interrogaciones de NM3 y NM4 incorporaron un flujo de siete respuestas
  grabadas, una pregunta por vez, con escucha previa, reemplazo y guardado
  privado en Firebase Storage.
- Se corrigió la asociación del archivo después de una transacción RTDB con
  caché inicial vacía. También se agregó un medidor visible de micrófono para
  advertir si el navegador recibe señal, sin bloquear el guardado.
- Por decisión docente se retiró el límite temporal y cualquier rechazo por
  duración o nivel de voz. El sistema solo exige que el navegador haya generado
  un archivo; el docente decide mediante la escucha previa si debe repetirse.
- La revisión usa enlaces temporales y la calificación final continúa siendo
  docente. La lectura pública de Storage permanece cerrada y el acceso técnico
  protegido no asigna notas automáticamente.
- Se probó en producción el ciclo de siete cargas, entrega, reproducción y
  eliminación. Los siete WebM descargados fueron decodificables y presentaron
  señal de audio; después se eliminó el registro técnico y no quedaron
  entregas de prueba. Las vistas NM3 y NM4 cargaron sin errores ni desborde en
  390 píxeles.
- Commits funcionales: `4a9b1784`, `d0c5a46f`, `4cb4387d`, `32bb598a` y
  `4950fa78`. Deploy final: `dpl_99Yo2tYrkrrrQGdkFtKMKswB6ZPU`. Reglas de
  Storage vigentes: `b84737cf-82c8-4eca-8bf4-e18fc14c5ce7`.

---

## 2026-09-02, acceso docente directo a las interrogaciones NM3 y NM4

- Los paneles de calificación de `El lugar sin límites` y `Mocha Dick` abren
  directamente desde su URL, sin contraseña, código ni pantalla intermedia.
- La ruta base corresponde a Francisco Núñez y muestra todos sus cursos. Las
  educadoras conservan enlaces propios mediante el parámetro `docente`, con el
  acceso limitado a los cursos que tienen asignados.
- El servidor mantiene la validación del docente declarado, del curso, del
  estudiante, de las siete preguntas y de los puntajes antes de escribir en
  Firebase. Las páginas continúan excluidas de indexación pública mediante
  `noindex,nofollow`.
- `npm run build` aprobó 147 recursos críticos. La auditoría específica validó
  NM3 y NM4, 100 preguntas y 249 estudiantes. Playwright verificó en producción
  ambos paneles y un enlace de educadora: respuestas API 200 y cero errores de
  consola.
- Commit funcional: `db4a28f4`. Deploy: `dpl_4bXCtu8kn1Rnx2UHiJAdwtsc3YfN`.

---

## 2026-09-02, ensayo parcial SIMCE de la Unidad 3, Clase 8

- Se reemplazó la versión breve de la Clase 8 por un ensayo parcial para 2°A
  HC y 2°B HC: siete textos de formatos diversos, 36 reactivos y dos preguntas
  metacognitivas que no alteran el puntaje.
- Las claves quedaron exclusivamente en el servidor. La distribución es
  A9/B9/C9/D9 y las habilidades se reparten en seis reactivos de localizar,
  18 de interpretar y 12 de reflexionar. El orden de los textos y las
  alternativas cambia por estudiante sin separar cada texto de sus preguntas.
- La clase permite entregar aun con respuestas pendientes, guarda el avance de
  forma serializada y confirma la entrega mediante lectura posterior del
  registro. Al finalizar muestra puntaje, total y porcentaje, pero no revela
  respuestas correctas mientras la aplicación continúa.
- El panel estudiantil y el admin incluyen la sesión `sesion-u3-8`, la fecha de
  aplicación y la ruta vigente. Se retiró el cargador antiguo que escribía por
  error en otra sesión y se incorporaron el contrato de entrega, el manifiesto
  protegido y una auditoría específica.
- `npm run build` aprobó 147 recursos críticos. Playwright verificó producción
  en 390, 1440 y 3840 píxeles: siete textos, 36 preguntas, 144 alternativas,
  marcado, confirmación, acceso protegido y ausencia de errores o desbordes.
  Una prueba técnica temporal comprobó estado inicial, autoguardado, recarga,
  entrega atómica y estado `Completada`; luego eliminó cuenta, respuestas y
  resultados, con cero registros temporales restantes.
- Commits funcionales: `ed9c7232`, `c2547ffe` y `ee451076`. Deploy final:
  `dpl_9Xcy9FtE7GoAr34uojyFHaaoYqZV`.

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
