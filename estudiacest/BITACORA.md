# Bitácora de Estudia CEST

## 2026-10-04, NM4: espacios reales de escritura en el borrador

- Francisco advirtió que el borrador imprimible tenía líneas y cuadros mal resueltos y poco espacio para responder. La validación anterior de dos páginas y ausencia de desbordes no comprobaba la suficiencia del espacio de escritura ni la impresión sin fondos. Se reemplazan guiones bajos, renglones de fondo y respuestas estrechas junto a imágenes por bordes reales y áreas de escritura con medidas físicas.
- El borrador pasa de dos a tres páginas A4, sin cambiar las siete actividades, cuatro cursos, proyecto de cuatro sesiones ni manual final de seis páginas. Hoja 1: función e indicaciones; hoja 2: plano y tabla de seis partes; hoja 3: seguridad, imágenes y fuente. Se conserva el membrete y los dos logos oficiales en las tres hojas. Se sincronizan las referencias a hojas y páginas en presentación, lectura, proyecto y planificación docente.
- Sesenta renglones de 7 mm, sin depender de imprimir gráficos de fondo. Respuestas de función, indicaciones, seguridad e imágenes a todo el ancho; cada función de la tabla dispone de tres renglones y más de 10 cm de ancho útil. Curso, fecha y grupo alineados; las imágenes tienen sus explicaciones fuera de cuadros estrechos. No se cambian fuentes técnicas, equipos, imágenes, datos ni notas.
- Se amplían las pruebas para exigir altura mínima de renglón, ancho útil, seis funciones, bordes visibles, tres membretes, PDF de tres páginas con y sin fondos y ausencia de referencias al borrador de dos hojas. Auditoría y build integral aprobados: 625 recursos críticos y panel de pizarra en 57 páginas. Prueba integral local: 472 comprobaciones sin fallas; evidencias `%TEMP%/nm4-manual-qa-cZNZhp`.
- Prueba local focalizada: 16 combinaciones de curso/ancho, ocho PDF (cuatro cursos, fondos activados y desactivados), 60 renglones por versión, altura mínima 26,45 px y ancho mínimo de función 413,78 px; tres páginas y cero cortes en todos los casos. Evidencias: `%TEMP%/nm4-escritura-qa-xYSlyo`. Se rasterizan los PDF reales sin fondos con Poppler a 140 dpi y se inspeccionan páginas de 4°A y 4°E, incluyendo identificación, tabla y respuestas de seguridad. No se afirma una prueba física en impresora.
- Publicación y verificación pública pendientes del despliegue seguro.

## 2026-10-04, NM4: borrador imprimible con formato institucional

- Francisco pidió que el borrador tenga los elementos de una guía, membrete del colegio y sus logos. Se modifica únicamente la plantilla de dos hojas del manual ilustrado; las presentaciones, lecturas, modelo, manual final y datos académicos se conservan.
- Ambas hojas llevan el membrete del Centro Educativo Salesianos Talca, Departamento de Lengua y Literatura, docente, año e imágenes oficiales existentes de la insignia institucional y Salesianos Don Bosco. No se recrean los logos con IA. La primera hoja incorpora tres líneas de integrantes, curso que responde al selector, fecha y grupo, unidad, clase, duración, objetivo, OA 5 y OA 6 e instrucciones breves. La segunda identifica la continuidad del grupo. Se numeran las siete actividades y se conserva la indicación de mostrar y guardar el borrador.
- El plano y la leyenda se organizan lado a lado en impresión para mantener espacio de escritura y dos páginas A4; en celular se apilan. Los estilos nuevos usan clases específicas de la guía, sin alterar las otras plantillas. Los dos logos se incorporan al manifiesto crítico y se refuerzan las auditorías de membrete, imágenes, identificación, campos, curso y número de páginas.
- Prueba preliminar de los cuatro cursos: dos páginas por PDF y sin cortes; evidencias en `%TEMP%/nm4-guia-membrete-n8AakU`, inspección visual de 4°A aprobada. Build integral aprobado con 625 recursos críticos y panel táctil en 57 páginas. Prueba integral local: `node scripts/test-nm4-u3-class7.js`, 464 comprobaciones sin fallas en 320, 390, 1440 y 3840 px para los cuatro cursos, incluidos membrete, dos logos por hoja, curso, campos de la guía, imágenes, descargas y PDF sin cortes. Evidencias: `%TEMP%/nm4-manual-qa-VyUyud`.
- Publicado `521e66437ce8e55e9b1d2556860061ca7634202c` mediante `npm run deploy:prod:safe`: `dpl_EjKT5VTCuzMo1CichC5qL56ZYSr9`, READY, alias `https://www.estudiacest.com`. La consulta del alias confirma proyecto y SHA exactos. Los 33 archivos del proyecto, portada NM4 y dos logos responden 200 y coinciden en SHA-256 con los locales (36/36). /paes/, /nm3/, /nm4/, /estudiantes/, /3atp/, /4dtp/ y /lecturas/ responden 200.
- Verificación pública focalizada aprobada: 16 combinaciones de curso y ancho (320, 390, 1440 y 3840 px), membretes, logos, campos, curso, imágenes y botón de impresión; cuatro PDF, todos de dos páginas A4 sin cortes, sin errores de JavaScript ni solicitudes fallidas. Evidencias: `%TEMP%/nm4-guia-publica-pHloo7`; inspección visual móvil de 4°C aprobada. La primera ejecución se interrumpió por `ERR_NETWORK_CHANGED`; la repetición completa pasó. Se entrega al docente el enlace directo al borrador y se indica elegir el curso y usar «Imprimir o guardar como PDF».

## 2026-10-04, NM4: nueve ilustraciones de IA para el manual

- Francisco pidió reemplazar la mayor cantidad de imágenes, incluidos los SVG. Se sustituyen las cinco ilustraciones SVG activas y las cuatro vistas generales por nueve imágenes generadas con `image_gen`, modo integrado: cuatro equipos, cuatro esquemas de seis partes y la linterna del ejemplo con cuatro partes. Se revisa visualmente la correspondencia entre números, flechas y piezas de cada equipo.
- Las imágenes de IA se identifican como ilustraciones didácticas, no fotografías reales ni planos de instalación. Se conservan las cuatro imágenes de detalle originales, las fuentes oficiales y un acceso plegado a la referencia real del fabricante. Los SVG y las vistas generales originales se conservan para recuperación, sin usarlos como ilustraciones activas. No se cambian las lecturas, consignas, currículo, sesiones, notas, cuentas ni datos de estudiantes.
- Nueve WebP de 1536 × 1024 px, 921.956 bytes en total. La conversión de formato mantiene tamaño y contenido, sin recortar ni redibujar; los PNG originales permanecen en la carpeta local del generador. `assets/imagenes-ia.json` registra proveedor, modo, nueve prompts, referencias y números esperados; `scripts/prepare-nm4-manual-ai.js` prepara los WebP y conserva los archivos existentes.
- Validación local: auditoría focalizada y build integral aprobados, 623 recursos críticos y panel de pizarra en 57 páginas. Prueba en navegador: 448 comprobaciones sin fallas para los cuatro cursos, en 320, 390, 1440 y 3840 px, incluidas imágenes, referencias, descargas y PDF A4 de dos y seis páginas sin cortes. Evidencias: `%TEMP%/nm4-manual-qa-WnWjFA`; inspección visual del móvil de 4°E aprobada. Se corrige una expectativa de enlaces relativos en la prueba, sin debilitar la comprobación del archivo original correspondiente al curso.
- Publicado `aecdd39acacdb54db8f24812895f5df3ebf1ea31` mediante `npm run deploy:prod:safe`: `dpl_4mW3Dn2TxuiDZCsHQx9yBCNVnb7t`, READY, alias `https://www.estudiacest.com`. La consulta del alias mediante la API de Vercel confirma el proyecto y el SHA exactos. Los 33 archivos del proyecto y la portada NM4 responden 200 y coinciden en SHA-256 con los locales (34/34). /paes/, /nm3/, /nm4/, /estudiantes/, /3atp/, /4dtp/ y /lecturas/ responden 200.
- Prueba pública aprobada: `node scripts/test-nm4-u3-class7.js --origin=https://www.estudiacest.com`, 448 comprobaciones, cero fallas para los cuatro cursos y tamaños. Evidencias: `%TEMP%/nm4-manual-qa-JY02gZ`; imágenes IA, referencias reales, navegación, descargas exactas y PDF A4 de dos y seis páginas sin cortes verificados. Inspección visual pública de 4°B en escritorio aprobada. Se entrega al docente el enlace a la clase y al registro local de archivos y prompts.

## 2026-10-04, NM4: consignas directas y currículo del manual ilustrado

- Francisco pidió quitar el exceso de texto y usar acciones concretas. Se abrevia la presentación y la consigna de `/nm4/u3-clase7-manual-ilustrado/`: lean, respondan en sus hojas, completen, revisen y muestren el avance. Se conserva el proyecto de cuatro sesiones de 90 minutos, grupos de tres y manual final de seis páginas para 4°A, 4°B, 4°C y 4°E; no se modifican informes, notas ni datos de estudiantes.
- Se separan INICIO (10), DESARROLLO (70) y CIERRE (10), con objetivo y comprobación por clase. Modelo breve, reescritura conjunta y trabajo del grupo. La guía docente identifica OA 5 y OA 6 de Lengua y Literatura, formación general de 4° medio, con enlaces oficiales; el tema técnico corresponde a la especialidad y la Unidad 3 CEST se identifica como secuencia local, no título oficial del programa.
- Se indica dónde escribir: dos hojas o plantilla impresa en la clase 1 y seis páginas desde la clase 2. El borrador se muestra y conserva; la entrega final se hace al docente en la clase 4. Se incorpora ejemplo individual de cambio, ejemplo de ruta de consulta y cuarto término de vocabulario por curso, basado en las partes ya documentadas. Se conserva la atribución y la información técnica del fabricante; no se operan equipos ni se agregan cuentas o formularios.
- Se reduce el texto fijo de la presentación de 666 a 499 palabras (25 %) y de la consigna de 836 a 497 (41 %), contando el HTML sin etiquetas, cabecera ni scripts; la lectura técnica dinámica no forma parte de ese conteo. Se ajusta el mínimo de bytes del proyecto abreviado y se refuerza la auditoría de cuatro etapas, resultados, fases, ejemplos, OA y glosario; no se eliminan verificaciones.
- Validación local: auditoría focalizada y build integral aprobados, 613 recursos críticos y panel canónico en 57 páginas. `node scripts/test-nm4-u3-class7.js`: 336 comprobaciones, cero fallas, en 320, 390, 1440 y 3840 px. Verificados curso, fases, enlace a clase 2 con curso y ancla, imágenes, cuatro consignas y resultados, vocabulario, conservación del borrador, descargas y PDF A4 de dos y seis páginas sin cortes. Evidencias: `%TEMP%/nm4-manual-qa-KDTqRO`; inspección visual de 4°C en escritorio y 4°A en móvil aprobada.
- Publicado `ccb30442e551cf163054b0b84a53035714c1ea82` mediante `npm run deploy:prod:safe`: `dpl_D9czf8cjfprm6seGCaH9x2vn4bdr`, READY, alias `https://www.estudiacest.com`. Consulta del alias por la API de Vercel mediante su CLI confirma el proyecto y el SHA exactos. Los 23 recursos del proyecto y la portada NM4 responden 200 y coinciden en SHA-256 con los locales (24/24). /paes/, /nm3/, /nm4/, /estudiantes/, /3atp/, /4dtp/ y /lecturas/ responden 200.
- Prueba pública: `node scripts/test-nm4-u3-class7.js --origin=https://www.estudiacest.com`, 336 comprobaciones, cero fallas para los cuatro cursos y tamaños. Evidencias: `%TEMP%/nm4-manual-qa-2NKtzD`; navegación, consignas, fases, glosario, curso/ancla, imágenes, descargas y PDF A4 sin cortes verificados. Inspección visual pública de 4°A en 1440 px aprobada. Se entrega al docente el enlace y se indica seleccionar el curso y usar «Las cuatro clases» para las etapas siguientes.

## 2026-10-04, NM4: manual también operativo para 4°A y 4°B

- Francisco pidió habilitar de inmediato el mismo proyecto para 4°A y 4°B. Se incorporan Mecánica Industrial y Mecánica Automotriz, sin sustituir ni modificar los informes, entregas o notas anteriores; las versiones de 4°C y 4°E se conservan.
- Material diferenciado: taladro de columna Bosch PBD 40 para 4°A y gato hidráulico Bahco BH12000 para 4°B. Lecturas adaptadas, vocabulario, seis partes, ejemplo de reescritura y fuentes oficiales del fabricante. Se agregan seis recursos: dos imágenes Bosch, dibujo dimensional y una ilustración original del manual Bahco, y dos esquemas propios de identificación sin escala. Las imágenes del fabricante mantienen su atribución; no se reproducen los manuales completos.
- Los siete documentos permiten seleccionar cualquiera de los cuatro cursos. La portada NM4 tiene accesos directos para todos. Se mantienen grupos de tres, cuatro sesiones de 90 minutos, avances, revisión, borrador inicial de dos páginas y manual final de seis páginas. La actividad sigue siendo documental, sin operar equipos, login, recepción de archivos ni calificación automática.
- Validación local: auditoría focalizada aprobada, build integral aprobado con 613 recursos críticos y panel canónico en 57 páginas. Navegador real en 320, 390, 1440 y 3840 px: 240 comprobaciones, cero fallas; evidencias en `%TEMP%/nm4-manual-qa-yBkS3Y`. Verificados curso, navegación, imágenes, documentos, descarga exacta del plano y PDF A4 de dos y seis páginas sin cortes. Inspección visual de 4°B en 1440 px aprobada.
- Publicado `d2d1c91c4fda1e59745a0cb4c1fef86731fe7b00` mediante `npm run deploy:prod:safe`: `dpl_DBEHCfB5Q7EwpabWHVMBBphuEsex`, READY, alias `https://www.estudiacest.com`. Los 23 recursos del proyecto y la portada NM4 responden 200 y coinciden en SHA-256 con los archivos locales (24/24). /paes/, /nm3/, /nm4/, /estudiantes/, /3atp/, /4dtp/ y /lecturas/ responden 200.
- Prueba pública aprobada: `node scripts/test-nm4-u3-class7.js --origin=https://www.estudiacest.com`, 240 comprobaciones, cero fallas; evidencias en `%TEMP%/nm4-manual-qa-4rVJyH`. Verificados navegación, cambio y persistencia del curso, imágenes, documentos, descargas y PDF A4 en 320, 390, 1440 y 3840 px. También se inspeccionan visualmente las capturas públicas de 4°A en escritorio y 4°B en móvil. Accesos directos: `?curso=4A` y `?curso=4B` en la nueva ruta.

## 2026-10-04, NM4: manual ilustrado para 4°C y 4°E

- Francisco autorizó dejar operativo un proyecto de manual con imágenes y planos para 4°C y 4°E, no una actividad limitada a una clase. 4°A y 4°B continúan con el informe existente. La primera implementación redujo erróneamente el alcance; se corrige a cuatro sesiones de 90 minutos y manual final de seis páginas, en grupos de tres.
- Nueva ruta `/nm4/u3-clase7-manual-ilustrado/`, con selección de curso y ocho pantallas que suman 90 minutos. Secuencia de modelo docente, práctica guiada, lectura, escritura de las dos páginas, revisión entre grupos y cierre individual en cuaderno. Integra el panel táctil canónico.
- Materiales: lecturas adaptadas del multímetro Fluke 101 (4°C) y la estación HAKKO FX-888DX (4°E), cuatro fotografías locales de los fabricantes con atribución, dos esquemas originales de identificación sin escala, modelo completo de una linterna, plantilla imprimible y planificación docente. No se reproducen los manuales completos: se enlazan las fuentes oficiales.
- La modalidad conserva la entrega al docente en clase. No hay login, formulario, guardado, recepción de archivos ni nota automática; no se escriben datos de estudiantes. Los esquemas no son planos de instalación y la actividad no requiere operar equipos.
- Portada NM4 actualizada en la tarjeta del 5 de octubre, con acceso directo por curso y conservación de todos los enlaces a los informes. Auditoría de la Clase 5 actualizada para comprobar las dos actividades actuales diferenciadas y las dos fechas restantes por planificar; no se retiran comprobaciones.
- Primera versión local: auditoría focalizada, build integral (605 recursos críticos), navegador real en 320, 390, 1440 y 3840 px, 104 comprobaciones sin fallas tras corregir el desborde móvil de la plantilla. Publicada como `3f669a42`, `dpl_2tgMxtGbAcFigdQYKuaGnNVJq1C8`, READY; esta versión se sustituye por la corrección del alcance antes del cierre.
- Corrección: consigna completa con cuatro etapas y avances, investigación de tres afirmaciones en la fuente, diseño, revisión de lectores, presentación individual dentro del grupo y dos correcciones justificadas. La presentación de ocho pantallas corresponde únicamente a la sesión inicial; la plantilla de dos páginas es un borrador. Se agrega plantilla final de seis páginas, planificación de cuatro sesiones y comprobaciones que impiden volver a reducirlo a una sola clase.
- Validación de la corrección: build integral aprobado con 607 recursos críticos y panel canónico en 57 páginas; 120 comprobaciones de navegador en 320, 390, 1440 y 3840 px sin fallas, tras corregir el ancho de la tabla docente en móvil. Borrador y modelo imprimen dos páginas A4; plantilla final imprime seis páginas, sin contenido cortado, en ambos cursos.
- Publicado el proyecto corregido `a6c52885b6e44954d65d3e70b16a3cccd22c0794`, mediante `npm run deploy:prod:safe`: `dpl_EPg7Z1UtGBSsrcWvfawDH8DbsfP1`, READY, alias `https://www.estudiacest.com`. Los 17 recursos del proyecto y la portada NM4 responden 200 y coinciden en SHA-256 con los archivos locales (18/18). /paes/, /nm3/, /nm4/, /estudiantes/, /3atp/, /4dtp/ y /lecturas/ responden 200.
- Prueba pública: `node scripts/test-nm4-u3-class7.js --origin=https://www.estudiacest.com`, 120 comprobaciones, cero fallas; evidencias en `%TEMP%/nm4-manual-qa-9wZS0L`. Navegación, selección y persistencia del curso, imágenes, documentos, plano descargado y PDF A4 verificados en los cuatro tamaños. Vercel conserva el nombre original del SVG mediante Content-Disposition; se corrige esa expectativa en la prueba y se valida el contenido binario exacto del plano correspondiente al curso. No cambió el sitio para resolver ese falso positivo.

## 2026-10-02, regla: panel para anotar en todas las páginas de NM3 y NM4

- Francisco decidió que todas las páginas de NM3 y NM4 en Estudia CEST tengan el panel para anotar sobre la pizarra táctil (lápiz, destacador y goma).
- **Módulo único `assets/anotar-pizarra.js`.** Reemplaza a `nm3/u3-anotar.js`, que se elimina. Es genérico y funciona en dos modos:
  - **presentación:** si `.deck` tiene varias `.slide` y la deck es fija o muestra una diapositiva a la vez, guarda los trazos por diapositiva visible (la detecta por estilo calculado, no por nombre de clase) y sigue el contenedor que se desplaza;
  - **página:** en el resto, los trazos siguen el desplazamiento de la página.
- **Botón:** donde hay `.nav-bar` va como ✏️ en la barra; en el resto, como pestaña en el borde izquierdo.
- **Mientras se dibuja:** un toque sobre un botón de una barra fija o adherida (Siguiente, Atrás, zoom) llega al botón, y deslizar el dedo no cambia de diapositiva.
- **Alcance:** 50 páginas cargan `<script src="/assets/anotar-pizarra.js" defer></script>` antes de `</body>`. Se exceptúan 9 paneles docentes: `calificar/`, `revisar/` y `*admin.html`.
- **Para que la regla se cumpla sola:**
  - REGLAS.md, sección 12;
  - `scripts/audit-anotar-pizarra.js` en `npm run build` (en las dos claves `build` de package.json) y exceptuado en `.vercelignore`; falla si una página de NM3 o NM4 no carga el panel;
  - manifiesto con `assets/anotar-pizarra.js`.
- **Validación en navegador real:**
  - las 50 páginas a 1920×1080 muestran el botón, abren el panel y dibujan, sin errores de JavaScript;
  - con dedo real (CDP) en NM3 Clase 1, NM4 Clase 4 y NM4 Clase 6: dibujar no cambia de diapositiva, cada diapositiva guarda lo suyo y lo recupera, «Siguiente» se toca a través del lienzo y con el panel cerrado el deslizamiento funciona;
  - en modo página (tríptico de NM3, y NM4 Clase 4 a 900 px) el trazo sigue el desplazamiento;
  - la batería de NM3 Clase 4 se repite idéntica;
  - `npm run build` OK, con 590 recursos críticos.
- Publicado `378f0a83` con `npm run deploy:prod:safe` desde un worktree limpio: `dpl_23BshQtSCib85xqKNdwXLcdo4s8F`, READY; el build remoto también pasó la auditoría nueva. `assets/anotar-pizarra.js` coincide en SHA-256 con Git, y la batería de las 50 páginas, repetida contra producción, dio 0 fallas. /nm3/, /nm4/, /paes/, /estudiantes/ y /termas/ responden 200.
## 2026-10-02, Termas: inscripción libre y administración completa

- Por decisión posterior de Francisco, la inscripción queda libre: se retiraron del servidor las 97 huellas de la nómina, la validación de pertenencia y los avisos que podían sugerir un padrón previo. Esta entrada reemplaza la regla operativa de la entrada «inscripción limitada a la nómina docente vigente» del mismo día. La organización revisará y corregirá los registros después desde el panel.
- La página conserva el aviso de acceso, pero con lenguaje inequívoco: la lista de personas inscritas se entrega en recepción y quien no se haya inscrito en el formulario no podrá asistir. Se mantienen visibles el sábado 14 de noviembre de 2026, el botón «Confirmar inscripción» y la elección obligatoria entre «Con desayuno», «Con once» o «Solo almuerzo»; las tres incluyen almuerzo.
- Se amplió `/termas/admin` para administrar el evento con autenticación de administrador: totales y porcentajes de asistencia, transporte y alimentación; búsqueda y filtros; exportación CSV; alta manual; edición completa; eliminación con confirmación; papelera recuperable durante 30 días y restauración. El servidor protege correos y asientos duplicados mediante transacciones y no entrega datos privados al público.
- Auditoría automatizada integrada al prebuild: autenticación, inscripción libre, alta, edición, conflictos de correo y asiento, eliminación, papelera, restauración y presencia del panel aprobadas. Build integral aprobado con 590 recursos críticos.
- Publicados `ad91c972` y la corrección definitiva `cdc790e5` mediante `npm run deploy:prod:safe`. La versión final es `dpl_3jeezikg8HBYQvJf4Lyd1VnVrx1B`, READY y asociada a `www.estudiacest.com`; reemplazó inmediatamente el despliegue transitorio que aún conservaba el control de nómina.
- Verificación de producción: los HTML público y administrativo coinciden en SHA-256 con la fuente; no aparece la restricción por nómina; una persona ficticia con nombres válidos avanza hasta la validación de correo y recibe 400 sin escribir; los tres endpoints administrativos responden 401 sin sesión. El estado real permaneció sin cambios en 1 asistente y 44 asientos libres. Revisión visual móvil y escritorio sin desborde; no se envió ningún formulario ni se alteró una inscripción real.

---


---

## 2026-10-02, Termas: inscripción limitada a la nómina docente vigente

- La nómina recibida contiene 97 registros completos de docentes titulares y suplentes. La fila final, que traía solo un apellido, se excluyó por estar incompleta; un cero final evidentemente tipográfico se normalizó como letra «o».
- El control se ejecuta en el servidor antes de validar correo, teléfono o guardar datos. Solo admite la combinación completa de nombres y apellidos de la nómina; tolera mayúsculas, minúsculas, tildes y separadores como espacios o guiones. Una identidad ajena recibe 403 y no alcanza la escritura en Firebase.
- Para no exponer el listado en el HTML ni dejar los nombres legibles en la fuente del servidor, se conservaron 97 huellas SHA-256 de las formas normalizadas. La página explica junto a los datos personales que deben escribirse todos los nombres y apellidos tal como aparecen en la nómina y que quien no esté en ella no podrá inscribirse.
- Pruebas locales: 97 huellas únicas, casos con tildes y guion, rechazo de identidad ajena, aceptación de identidad vigente hasta el siguiente control, sintaxis, `git diff --check` y build integral con 590 recursos críticos, todo aprobado. La nómina no aparece como texto legible en el archivo del servidor.
- Publicado el cambio `11a6d3c8` con `npm run deploy:prod:safe`: despliegue `dpl_Cy6EGyHa667EuajQYFD6HFYGSqcS`, READY y alias `www.estudiacest.com` confirmado. El HTML público coincide exactamente en SHA-256 con la fuente. En la API pública, una identidad ajena devuelve 403 y una identidad vigente sin correo avanza al control de correo y devuelve 400; ambas pruebas omiten los datos necesarios para guardar. El estado real permaneció en 1 asistente y 44 asientos libres antes y después. Revisión pública responsive en perfiles de 320 y 1440 px: aviso, fecha, tres opciones y botón fijo visibles, sin desborde.

---

## 2026-10-02, NM3: panel para anotar sobre la pizarra táctil

- Francisco pidió un panel desplegable para destacar, anotar y escribir encima de las diapositivas con el dedo, porque la pizarra de la sala es táctil. Herramientas pedidas: goma, destacador y lápiz.
- Módulo nuevo y reutilizable `/nm3/u3-anotar.js`, cargado en la Clase 4. Agrega un botón ✏️ en la barra inferior que despliega el panel:
  - lápiz con 4 colores, destacador translúcido (35 %) con 4 colores y goma real, que borra pixeles;
  - tres grosores, deshacer y «Borrar página», que pide un segundo toque;
  - ✋ «Página», para tocar botones, el video o bajar en el texto sin dibujar;
  - ⇄ para cambiar el panel de lado; ✕ o Escape lo cierran y los trazos quedan visibles.
- Funcionamiento:
  - dos lienzos fijos sobre la presentación, con Pointer Events y `touch-action:none`, que reciben dedo, lápiz óptico y mouse;
  - mientras se dibuja, el deslizamiento no cambia de diapositiva (se detiene la propagación de `touch*`); con el panel cerrado o en ✋, la página funciona igual que antes;
  - los trazos se guardan por diapositiva en la sesión, se redibujan al volver y se mueven con el contenido al desplazar; la rueda del mouse sigue bajando la diapositiva.
- Registrado en el manifiesto (`nm3/u3-anotar.js`).
- Validación en navegador real a 1920×1080, con mouse y toques reales por CDP:
  - lápiz con mouse y con dedo, sin cambio de diapositiva al deslizar dibujando;
  - destacador con alfa 89/255; deshacer y goma restauran exactamente el estado anterior;
  - otra diapositiva aparece limpia y al volver el trazo es idéntico; borrar con doble toque deja 0;
  - en ✋ el lienzo no recibe eventos; con el panel cerrado, deslizar cambia de diapositiva;
  - al bajar 200 px el trazo se mueve con el texto.
  - Pasada completa a 390, 1440 y 3840 px: 0 errores.
- Publicado `61cd7e86` con `npm run deploy:prod:safe` desde un worktree limpio: `dpl_AZokoJj2dqgS7HQLwyrVrXJqhCRz`, READY. La Clase 4 y `u3-anotar.js` coinciden en SHA-256 con Git. La misma batería del panel, repetida contra producción, dio resultados idénticos. /nm3/, /paes/, /estudiantes/ y /nm4/ responden 200.

---

## 2026-10-02, NM3 Clase 4: cierre directo con preguntas para el cuaderno

- Francisco dijo que no se entendía el cierre entre las pantallas 10 y 11, y pidió algo directo: «respondan estas preguntas de cierre en su cuaderno».
- **Pantalla 10, plenario en voz alta (8 min):** quedan solo tres pasos (un grupo del texto 1 explica las cuatro piezas; uno del texto 2 cuenta la funa a Neruda; cada grupo lee su conclusión, pregunta 8) y el aviso «Después: preguntas de cierre en el cuaderno →». Se quitó el recuadro «Conclusión del curso», que repetía el contenido del cuaderno. Las respuestas esperadas siguen plegadas para el docente.
- **Pantalla 11, preguntas de cierre (7 min):** la orden «📓 Respondan estas preguntas de cierre en su cuaderno» y cinco preguntas numeradas: desinformación y error; dos piezas y cómo se descubren; qué aprendió del texto del otro grupo; qué parte de la clase le ayudó más y por qué; qué revisará antes de compartir. Reemplaza los tres paneles de qué, cómo y para qué y el ticket. Tiene zoom y ajuste automático: 158 % en 1366×768, 175 % en 1920×1080 (letra de 47 px) y 368 % en 4K, sin scroll.
- Validación en navegador real a 390, 1440 y 3840 px: 11 pantallas, 0 errores y sin desborde. Auditoría de lenguaje: 0 regionalismos. En OneDrive, la planificación y la pauta (criterios de las 5 preguntas de cierre) quedaron regeneradas y aprobadas.
- Publicado `2c57b627` con `npm run deploy:prod:safe` desde un worktree limpio: `dpl_2LnXTvTtUyY5nZsyFK7hp2oSKyV2`, READY. La página pública coincide en SHA-256 con Git; el plenario y las preguntas de cierre se comprobaron en producción. /nm3/, /paes/, /estudiantes/, /nm4/ y /termas/ responden 200.

---

## 2026-10-02, Termas: confirmación visible y tres opciones de alimentación

- Francisco indicó que faltaba un botón de confirmación claro, el día del paseo y una elección inequívoca entre tres alternativas. El cierre del formulario deja de verse como una barra pegada al fondo y pasa a ser un último bloque visible, con resumen y botón de ancho completo en móvil: «Confirmar inscripción».
- La fecha se presenta como «Día del paseo: Sábado 14 de noviembre de 2026» tanto en el encabezado como en el pase. Alimentación ahora exige exactamente una de tres tarjetas: **Con desayuno**, **Con once** o **Solo almuerzo**; las tres explicitan que incluyen almuerzo. Se retiraron «Me da lo mismo» y el carácter opcional.
- La validación existe en cliente y servidor; el panel y su CSV usan los mismos nombres. Los valores históricos se siguen mostrando como anteriores, pero una inscripción nueva o modificada debe escoger una de las tres opciones vigentes.
- Build integral aprobado con 589 recursos críticos. Navegador real local y público a 320, 390, 1440 y 3840 px: botón visible, tres opciones exactas, validación sin elección, cambio de resumen al escoger y 0 desborde.
- Publicado el cambio `77d15945` dentro de la fuente sincronizada `f2b1a391` mediante `npm run deploy:prod:safe`: `dpl_AfrAUV53APVAwvwEw5Pj8HUKxt9z` READY y alias `www.estudiacest.com` confirmado. `termas/index.html` y `termas/admin.html` coinciden byte por byte con producción. El estado público real se releyó sin escribir: 1 asistente y 44 asientos libres; no se enviaron inscripciones de prueba. El trabajo concurrente de NM3 y los cambios ajenos del repositorio padre quedaron preservados.
- Ajuste posterior por verificación visual: al desplegar transporte y alimentación, el cierre quedaba a más de 2.600 px en móvil. El commit `4d642fd8` convierte el bloque de confirmación en una barra fija inferior durante todo el formulario y anuncia las tres alternativas también en el encabezado. Publicado con `npm run deploy:prod:safe`: `dpl_26qMoSAN3F7kwnsZRHHo2A6KsCTs` READY. HTML público idéntico a la fuente; botón completamente visible y 0 desborde en 320, 390, 1440 y 3840 px, sin enviar formularios de prueba.

---

## 2026-10-02, NM3 Clase 4: contenido para copiar en el cuaderno

- Francisco pidió, pensando en 3°D (curso difícil y con 45 minutos más), agregar después del objetivo el contenido para que lo escriban en el cuaderno, visible y con la mecánica de zoom.
- Pantalla nueva «Contenido para el cuaderno» después de C:
  - título para copiar: «Noticias falsas: cómo se fabrican y cómo se descubren»;
  - cinco bloques numerados: desinformación y error; las cuatro piezas con la pregunta que descubre cada una; la emoción como motor; funa; y las cinco preguntas antes de compartir.
- Formato de hoja de cuaderno con margen rojo y dos columnas desde 1100 px. Tiene barra de zoom y ajuste automático al entrar (atributo `data-autofit`, que ahora comparte con la pantalla de preguntas): 110 % en 1366×768, 124 % en 1920×1080 y 263 % en 4K, sin scroll.
- La clase pasa a 11 pantallas. Validación en navegador real a 390, 1440 y 3840 px: 0 errores y sin desborde. Auditoría de lenguaje: 0 regionalismos. La planificación de OneDrive suma el paso «Contenido para el cuaderno (15 min)».
- Publicado `3839e38b` con `npm run deploy:prod:safe` desde un worktree limpio: `dpl_4LtZsfcPu8re4QHnUY8t4to9qC82`, READY. La página pública coincide en SHA-256 con Git, y el ajuste automático de contenido y preguntas se comprobó en producción. /nm3/, /paes/, /estudiantes/ y /nm4/ responden 200.

---

## 2026-10-02, NM3 Clase 4: preguntas divididas por texto y visibles en una pantalla

- Francisco cambió la organización: 4 o 5 grupos responden solo el texto 1 y los otros 4 o 5, solo el texto 2. Pidió que la pantalla de preguntas las separe (solo texto 1, solo texto 2 y de ambos) y que se puedan proyectar todas a la vez.
- La pantalla G tiene tres columnas de colores:
  - **Grupos del texto 1:** 1, las cuatro piezas; 2, el reportaje; 3, robots o personas.
  - **Grupos del texto 2:** 4, fechas; 5, lo falso y lo verdadero del hilo; 6, nueva: los 3 «me gusta» de la corrección contra los miles de la funa.
  - **Todos los grupos:** 7, la cadena de WhatsApp con lo aprendido en su texto; 8, la conclusión.
  - Cada grupo responde 5 preguntas.
- La pantalla G tiene barra de zoom y se ajusta sola al entrar en pantallas de 1100 px o más. Si el docente usa A−, A+ o «Volver al tamaño normal», se respeta. Ajuste automático medido: 84 % en 1366×768, 97 % en 1920×1080 y 233 % en 4K, con las 8 preguntas visibles sin scroll.
- Lectura en paralelo: D y E duran 15 minutos al mismo tiempo; las preguntas, 40 minutos. Se ajustaron la portada y el objetivo («uno de dos textos»), los avisos de lectura por grupo, el plenario (cada mitad cuenta su texto a la otra; conclusión = pregunta 8) y las respuestas esperadas, rotuladas por grupo.
- Material impreso de OneDrive regenerado: guía grupal y de acceso con secciones por texto y logro sobre 5; pauta con 8 filas; planificación con lectura en paralelo. Validador aprobado: «D y E. Lectura» activaba el detector de alternativas E y se cambió a «D y E · Lectura».
- Navegador real a 390, 1440 y 3840 px: 10 pantallas, 0 errores y sin desborde.
- Publicado `b8b3af02` con `npm run deploy:prod:safe` desde un worktree limpio: `dpl_6qbfV7KxENoEBrxu6d3fqjHfiMY8`, READY. La página pública coincide en SHA-256 con Git; el ajuste automático se comprobó en producción (84 % en 1366×768 y 97 % en 1920×1080, sin scroll). /nm3/, /paes/, /estudiantes/ y /nm4/ responden 200.

---

## 2026-10-01, Mi espacio: movilidad y dos habitaciones conectadas

- Se aplica el primer lote autorizado: movimiento de ocho direcciones con rutas ponderadas, sin cortar esquinas; cambio de destino al completar la casilla actual, parada y ruta/destino visibles. «Caminar» es el modo inicial; «Decorar» muestra la grilla y la huella completa verde/roja. La selección respeta la transparencia del sprite.
- Puerta nativa y botón accesible conectan Principal y Estudio, también durante una visita, sin otro ingreso. La sala principal conserva sus campos históricos; el estudio empieza vacío y se guarda de forma aditiva. Recarga conserva la sala elegida. Cada habitación tiene terreno, muebles, posición, presencia y chat separados; los controles docentes y el tope de treinta personas siguen cubriendo toda la casa.
- Un premio no puede colocarse en las dos salas: la validación corre sobre el avatar completo en una transacción. Transferir un regalo autorizado lo retira de ambas salas; los premios docentes y por tarea siguen sin poder transferirse. El guardado captura campo y habitación, espera su cola antes de cruzar y relee. Un fallo impide la transición; una respuesta perdida después de cruzar recupera la presencia confirmada.
- RTDB: se protege `avatar/$uid/habitaciones` contra escrituras directas del estudiante; la copia histórica se sincroniza únicamente tras comprobar que no había otra diferencia. La comparación con las reglas remotas encontró exclusivamente esta protección nueva. No se migra masivamente ni se modifican notas, XP, regalos, perfiles o tareas reales.
- Validación con identidades ficticias: `audit-house-rooms`, `preview-house-rooms`, regresiones de terraza/XP, kit de avatar y premios/camisetas, 390/1200/3840 sin desbordes ni errores inesperados. Se comprueban ida/vuelta, visitas sin edición ajena, chat, traslado de una PS5, recarga, fallo/reintento, respuesta perdida y conservación de registros académicos. Auditoría nueva incorporada al prebuild y exceptuada en `.vercelignore`. Build integral final local y remoto aprobado con 589 recursos críticos.
- Publicado el commit `5b460b45cdeded2055fc40263fa570303d9ecc11` mediante `npm run deploy:prod:safe`: `dpl_72BZ1MTbQ5bfsvcJXrRpPbZG66Ad` READY, proyecto y alias `www.estudiacest.com` contrastados. Cinco archivos públicos coinciden en SHA-256 con la fuente; seis portadas responden 200; tres acciones nuevas responden 401 sin sesión. `preview-house-rooms-public` prueba los recursos publicados en Chromium, puertas y recarga con funciones ficticias, en 390/1200/3840. No se usan cuentas reales para las escrituras de QA. Reglas Firebase desplegadas y releídas exactamente iguales; habilitación docente existente conservada. No quedan procesos propios de QA o deploy activos; cambios ajenos del repositorio padre preservados.
- Se entrega al docente [Mi espacio PAES](https://www.estudiacest.com/paes/mi-espacio.html) → Mi casa: recargar sin cerrar sesión, tocar la puerta o «Ir al estudio». La fuente común también aplica a SIMCE. Alcance pendiente para otros lotes: salas comunes de curso, mecanismos/desafíos y más interacciones; no se declaran construidos.

---

## 2026-10-01, NM3 Clase 4: el texto 2 pasa a ser un hilo viral de X

- Francisco pidió mejorar el texto sobre Neruda, con formato de X: alguien publica el poema, se hace viral, todos comentan y funan a Neruda, su obra y su vida por algo que no fue real.
- Texto 2, «La funa a Neruda por un poema que nunca escribió»:
  - **Hilo de X** hecho en HTML y CSS con el formato de la app: barra «Post», cuenta inventada con check azul (`@verdadsinfiltro_cl`), cuatro publicaciones unidas por la línea del hilo, hora, visualizaciones, totales y fila de íconos.
  - **Respuestas «Más relevantes»** en una tarjeta aparte: tres cuentas inventadas se suman a la funa y la cuarta corrige con el dato real, con tres «me gusta».
  - Ambas tarjetas llevan el sello «inventado para la clase».
- **Crónica «Lo que pasó en realidad»** (5 párrafos): el caso real de Martha Medeiros (2000) y la aclaración de la Fundación Pablo Neruda. Explica la mezcla de la cita falsa con un dato verdadero (las tres casas de Neruda) y la corrección que nadie ve. Cierra con que criticar a un autor es legítimo con datos verificables y que lo dañino es funar sin verificar.
- Preguntas modificadas y sus respuestas esperadas:
  - 3: robots o personas, y cómo se ve en las respuestas del hilo;
  - 5: lo falso y lo verdadero del hilo, y por qué la mezcla convence;
  - 7: compartir o comentar una noticia o una funa.
- Pantalla para la sala:
  - en modo lectura, desde 1400 px, hilo, respuestas y crónica van en tres columnas; se ocultan los totales repetidos y «Respondiendo a», y el interlineado baja a 1,6;
  - en 1920×1080, «Ajustar» deja el texto 2 completo sin scroll (80 %); en 4K, el texto 1 al 200 % y el texto 2 al 182 %;
  - en 1366×768 el texto 2 no cabe a tamaño legible: se usa A+ y desplazamiento.
- El material impreso de OneDrive se regeneró con el hilo en formato de X: guía grupal (4 páginas), guía de acceso, guías adaptadas, pauta y planificación. Validador y auditoría de lenguaje: aprobados, 0 regionalismos.
- Publicado `2c2ad189` con `npm run deploy:prod:safe` desde un worktree limpio: `dpl_82iFyvo1pnAJdLzi2ah97WXSud4D`, READY. La página pública coincide en SHA-256 con Git; en navegador real a 390 y 1440 px: 10 pantallas, 0 errores, 0 recursos fallidos. Las portadas /nm3/, /paes/, /estudiantes/ y /nm4/ responden 200.

---

## 2026-10-01, kit de avatar de cincuenta imágenes y gestos

- Cincuenta generaciones IA independientes: diez ojos, diez bocas, diez peinados, diez gestos y diez vistas/poses. Personaje original de pixel art inspirado en las referencias entregadas, sin extraer sprites oficiales. Originales RGBA y prompts en `scripts/avatar-kit/`; cincuenta derivados con transparencia en `estudiantes/assets/avatar-kit/`, menos de 1 MB en conjunto. El importador solo recorta margen y reduce sin suavizado.
- Mi personaje integra treinta previews y un desplegable de poses con su propia ropa. El Canvas nativo añade silueta y mechones, volumen facial, iris/párpados/nariz, detalles de prendas/calzado, raster pixelado y caché acotada. Cuatro orientaciones, pasos alternados, parpadeo y diez gestos reales; controles y servidor comparten el catálogo. Se conserva la personalización, camisetas, premios, XP y datos académicos. Las poses de prueba no permiten saltarse colisiones ni conceden muebles.
- Auditoría de cincuenta PNG únicos, alfa y márgenes transparentes; servidor probado con identidades ficticias, diez gestos y orientaciones válidos, entradas extrañas descartadas. Navegador real: treinta opciones persistidas/releídas, diez gestos visualmente distintos, poses con ropa propia, marcha, movimiento reducido, 390/1200/3840 sin errores ni desbordes. Regresiones de logros, camisetas, premios y terraza/XP aprobadas. Build integral: 589 recursos críticos. No se modifican notas, regalos ni XP de estudiantes reales.
- Publicado el commit `43f81a0827173aa3a1bb6cecb018a9708e3d7093` mediante `npm run deploy:prod:safe`: `dpl_81kCX72473DybaUU7ggcrUwPpAFs` READY y alias `www.estudiacest.com` confirmado. Build remoto aprobado con 589 recursos. Los 56 archivos públicos contrastados respondieron 200 y coincidieron en SHA-256 con el commit; entrar, latido e inventario respondieron 401 sin sesión. Navegador sobre el sitio público: catálogo de cincuenta recursos y diez gestos, render publicado y vistas 390/1200/3840 sin errores/desbordes. Guardado, gestos autenticados y regresiones se probaron con funciones reales sobre datos ficticios, no cuentas reales. No quedan procesos propios de generación o deploy activos. Se entrega al docente Mi espacio → Mi personaje, la vista del kit y sus originales/prompts. Cambios ajenos del repositorio padre preservados.

---

## 2026-10-01, terraza, muros regalables y experiencia manual docente

- Se añaden doce piezas propias: piscinas 2×2, 3×2 y 4×3, cascada, pasto, palmera, roble, pino, mecedora, tumbona, mesa y sombrilla. Arte RGBA generado con la herramienta integrada de IA; originales y prompts conservados en `scripts/furniture-terrace/`, 48 sprites y cuatro baldosas de pasto integrados. Los seis previews de muros se construyen con código nativo coherente con el Canvas.
- Seis acabados regalables: piedra, madera, ladrillo blanco, jardín vertical, azulejo azul y paredes bajas de terraza. Admin PAES ofrece sets de muros, terraza completa, jardín, piscinas/cascada y muebles de patio. Se usan las entregas validadas existentes por estudiante, curso y tarea; todo este lote sigue siendo manual, fuera de los premios automáticos G15–G21.
- Control «Dar experiencia o subir de nivel» junto al selector: consulta, motivo, simulación sin escritura, confirmación, autorización por docente/curso, identificador único, transacción y relectura. El bonus vive en regalos protegidos y se suma al XP académico sin modificarlo. Ranking, arena, logros y paneles muestran el XP efectivo; las tareas conservan el bonus sin duplicarlo. No se cambiaron notas, entregas ni XP reales en las pruebas.
- Casa y pieza comparten cola serial y API validada. Los muros/pasto no recibidos quedan bloqueados; se valida la huella completa al colocar, girar o reducir la habitación. Agua y cascada animadas, movimiento reducido respetado, mecedora sentable y tumbona acostable. Se corrige el orden de dibujo del avatar sobre muebles de varias casillas.
- Auditorías de terraza/XP, muebles, premios automáticos y ropa aprobadas; build integral aprobado. Navegador real contra funciones actuales y cuentas ficticias comprueba XP/nivel, doble clic sin duplicación, recarga, sets por curso/tarea, muros/pasto persistentes y piscinas animadas a 390/1200/3840 sin desbordes ni errores. Las comprobaciones finales de visitas y producción se registran al publicar.
- Reglas remotas contrastadas: la única diferencia preparada es proteger `avatar/$uid/casa` contra escritura cliente directa, como ya ocurre con pieza/regalos. La copia histórica de reglas se sincroniza con la fuente canónica tras comparar esa única diferencia. Sitio y reglas requieren despliegues separados; no se considera publicado antes de confirmarlos.
- Primer despliegue de este lote (`dpl_3Ees8cxWKU23qpujwY7HJFZtGyXN`, fuente `bb3d7b19`) terminó ERROR, sin promoción: Vercel omitió la especificación anidada de sprites requerida por la auditoría nueva. Se elimina esa dependencia de empaquetado usando el catálogo compartido y comprobando la lista exacta de doce piezas y todos sus sprites; no se quita ni debilita la auditoría. Originales y prompts permanecen privados en Git. Se vuelve a construir antes del segundo despliegue.
- Cierre confirmado: fuente `75280448`, despliegue seguro `dpl_H8Q1fHMDNpiWWzruBCEkaJD5WQF4` READY y alias `www.estudiacest.com` comprobado. Build local y remoto aprobados con 539 recursos críticos. Los 145 archivos públicos contrastados respondieron 200 y coincidieron en SHA-256 con el commit; cinco acciones privadas, incluidas experiencia y guardado de casa, respondieron 401 sin sesión. Admin público conserva los controles de muros, terraza y XP/nivel; sin desbordes ni errores en 390/1200/3840. Clase NM3 concurrente conservada.
- Después de confirmar el sitio nuevo se ejecutó `npm run deploy:rules`; Firebase terminó correctamente. Relectura independiente de `.settings/rules` idéntica al JSON canónico completo, con casa, pieza y regalos protegidos. Prueba local final de visitas y retorno, muros bajos sin ventana flotante, avatar sentado en mecedora y acostado sobre tumbona aprobada. Las sesiones de despliegue terminaron; no queda ninguna propia activa. Se entrega al docente el enlace `/paes/admin/#casas` y la ruta del lote/prompt set. Cambios ajenos de Lirmi y del repositorio padre preservados.

---

## 2026-10-01, comprobación del ingreso PAES con ruta guiada

- Ante un aviso de contraseña/cuenta rechazada, se contrastaron nómina, Auth y perfil por identidad exacta: una cuenta activa, un perfil único y curso concordante. La clave inicial vigente obtuvo sesión desde el endpoint publicado; no fue necesario restablecerla ni crear otra cuenta.
- Navegador real en producción a 390 px: ingreso confirmado, tarjetas de la ruta individual presentes y Mi espacio abierto sin un segundo login, sin errores ni solicitudes fallidas. No se respondieron ni entregaron tareas, ni se modificaron calificaciones o perfiles. Se informó al docente cómo volver a ingresar.
- Se retoma la publicación pendiente del acceso plegable a logros/ropa y del conteo concurrente de premios, conservando los cambios NM3 integrados en `640fe642`. La confirmación pública se agrega después del despliegue seguro.

---

## 2026-10-01, cierre de premios y ajuste visual no publicado

- La versión operativa de muebles/logros/ropa sigue siendo `b96011c2`, despliegue READY `dpl_Ht8pdYSD9phkKfPHUkhi5i7Wfsn6`. El admin publicado permite todos los premios pedidos; «Regalar logros y ropa» está al final del catálogo. Recargar una vez el admin actualiza sus controles sin borrar caché ni cerrar otras sesiones.
- Relectura independiente final en 4°B HC: 36 perfiles, 35 con entregas, cero premios pendientes de G15–G21, después de los 142 nuevos entregados. Las nuevas entregas también siguen recibiendo sus premios automáticos.
- El segundo despliegue `dpl_A2rovAuLsFszmN9vTcHL894bDNEP` se canceló y se verificó CANCELED: durante la subida apareció una edición de la Clase 4 NM3 todavía sin commit. Se preservó esa edición y no se promovió una fuente académica incompleta. No hubo rollback de producción ni pérdida de los premios.
- Pendiente **solo de publicación**: el acceso plegable a logros/ropa junto al selector de estudiante y el conteo exacto de premios recibidos concurrentemente, preparados en `aaf53340` e integrados con el registro NM3 mediante `76dd8d01`. Publicar main cuando finalice la edición concurrente, exclusivamente con `npm run deploy:prod:safe`; no restaurar ni descartar el archivo NM3 modificado.

---

## 2026-10-01, NM3 Clase 4: sin roles, textos justificados y zoom para la pantalla de la sala

- Francisco pidió quitar de la pantalla C los cuatro roles de grupo y el recuadro «¿Cómo vamos a demostrar…?», y de la pantalla G el aviso «El profe va a pasar por los grupos preguntando…». La pantalla C queda solo con el objetivo. Las menciones restantes a «lector» y «vocero» pasan a «un integrante» y «cada grupo».
- Textos 1 y 2: justificados, a todo el ancho y con separación en sílabas (`hyphens:auto`, `lang="es"`).
- Barra de zoom fija en los dos textos:
  - A− y A+ con porcentaje; el texto se reacomoda al ancho, sin scroll lateral;
  - «Ajustar a la pantalla» oculta los rótulos de la diapositiva y calcula por búsqueda binaria el tamaño máximo con que el texto completo cabe sin scroll; desde 1200 px usa dos columnas y se recalcula al cambiar el tamaño o la pantalla completa;
  - «Volver al tamaño normal»;
  - teclas + y −.
  En celular se oculta «Ajustar».
- Validación en navegador real, sin desborde lateral en ningún caso y con 0 errores en 390, 1440 y 3840 px:
  - 1366×768: el Texto 2 ajusta al 113 %;
  - 1920×1080: el Texto 2 ajusta al 126 %;
  - 4K: los textos ajustan al 195 % y al 281 %.
- El material impreso de OneDrive se regeneró sin los roles: guía grupal y planificación.

---

## 2026-10-01, publicación y entrega confirmada de premios en 4°B HC

- Publicado el commit `b96011c2` con `npm run deploy:prod:safe`: despliegue `dpl_Ht8pdYSD9phkKfPHUkhi5i7Wfsn6`, READY y alias público confirmado. Incluye los once muebles nuevos, cuatro tamaños/mapas de casa, premios PAES y diez logros/ropa, conservando la clase NM3 creada en paralelo. Los 59 archivos públicos contrastados respondieron 200 y coincidieron en SHA-256; las tres acciones de inventario/premios rechazaron acceso sin sesión con 401. La regla Firebase vigente mantiene `regalos` protegido. Navegador público sin desbordes en 390/1200/3840 y sin errores.
- Revisión inicial de 4°B: 166 pendientes. Mientras se verificaba, los estudiantes comenzaron a recibir premios al abrir sus casas. Se canceló una aplicación cuyo conteo había cambiado, sin escribir. El conciliador valida ahora la misma nómina y guías mediante una revisión estable, tolerando que premios simulados ya hayan sido recibidos; conserva cada regalo previo con ETag/CAS y no admite agregar objetos fuera de la lista nativa.
- Aplicación real: 142 muebles nuevos para completar los pendientes del curso; 35 cuentas con entregas y cero premios pendientes en la relectura. No se entregaron personalizados, ropa ni logros reales arbitrarios, ni se modificaron notas/respuestas. Las pruebas de estos últimos premios usaron únicamente datos ficticios.
- Mejora de acceso: «Regalar logros y ropa del avatar» pasa a un desplegable junto al selector de estudiante, antes del catálogo de 190 muebles. Se añade una prueba de conteo para un premio recibido concurrentemente: no cuenta como nuevo y no se reemplaza. Build integral y navegador local nuevamente aprobados. Esta mejora final requiere un segundo deploy seguro, cuya confirmación se registra después.
- Se retiró exclusivamente el worktree temporal `scratch/release-muebles-octubre-20261001` y sus archivos de publicación fallida; fuentes e imágenes originales conservadas en main/Git. No se tocaron otros worktrees.

---

## 2026-10-01, NM3 Clase 4 publicada (corrige «deploy aplazado»)

- La Clase 4 de NM3 ya está en producción. Salió en el release que otro agente publicó sobre `b96011c2`, que contiene los commits `16113fc4`, `c87165ca` y `4eb0d2d3`. No hubo deploy aparte.
- Verificación pública:
  - `/nm3/u3-clase4-noticias-falsas/`, su imagen y `/nm3/` coinciden en SHA-256 con Git;
  - la tarjeta 4 enlaza a la clase;
  - en navegador real a 390 y 1440 px: 10 pantallas, 0 errores, 0 recursos fallidos y sin desborde; el video de 24 Horas carga insertado desde youtube-nocookie.

---

## 2026-10-01, premios PAES, ropa y diez logros docentes

- Francisco pidió muebles automáticos desde la guía 15, comenzando por 4°B HC, sin entregar sus muebles personalizados; además, diez logros manuales y ropa del avatar con las camisetas de equipos visibles en el admin. G15–G21 usan exclusivamente siete objetos nativos: silla, escritorio, monitor, sofá básico, lámpara de pie, planta y televisor. Los once objetos nuevos de gimnasio, Navidad y Halloween del commit `3cfca7ea` permanecen manuales, junto con los demás personalizados. Las guías futuras no construidas no se habilitan.
- `api/_premios-paes.js` verifica envío final, identidad única por RUT/UID y curso; excluye borradores y una nota sin entrega. Entrega al envío y recupera al abrir Mi espacio. El admin simula por curso antes de confirmar con firma de nómina; conserva regalos anteriores, verifica inventarios y permite reintento sin duplicación. Los premios automáticos no se transfieren para impedir que regalar y reabrir la casa los duplique. No se modifican notas ni respuestas.
- Admin `paes/admin/#casas`: diez logros docentes, catálogo de ropa/accesorios y seis camisetas (Real Madrid, Barcelona, Colo-Colo, Católica, U. de Chile y Rangers), con vista previa, confirmación individual y «Ya recibido». Una prenda regalada habilita su uso sin exigir XP. Los logros aparecen en Logros y pueden equiparse como placas. Se guardan bajo `avatar/UID/regalos`, ya protegido contra escritura estudiantil; no se abren reglas Firebase ni se permite transferirlos como muebles.
- Auditorías focales y build integral aprobados con 461 recursos críticos. Navegador real y funciones locales: solo identidades ficticias; regalo, relectura y recarga marcadas, camiseta y placa equipadas persistentes, vistas 390/1200/3840 sin desbordes ni errores. Capturas locales `scratch/premios-avatar-*.png`. El servidor y navegador de esta prueba se cerraron.
- El primer intento de publicar los muebles falló en Vercel por conversión de saltos de línea en un checkout aislado; no se promovió. No se publica ese árbol atrasado. Se corrigió el guard para comparar recursos con el commit del alias de producción READY, verificado por Vercel y proyecto, y exigir que sea antecesor del main actual. Un 404 de recurso ya publicado sigue bloqueando; los nuevos de un lote de varios commits pueden publicarse sin desactivar auditorías. Se conserva la clase NM3 incorporada en paralelo.
- Simulación real de solo lectura en 4°B HC: 36 cuentas visibles, 35 con entregas y 166 muebles pendientes. La aplicación y publicación todavía quedan pendientes de confirmación; cierre con despliegue y relectura se agrega después.

---

## 2026-10-01, NM3 Unidad 3 Clase 4: cómo se fabrica una noticia falsa

- Francisco pidió para el viernes 2 de octubre (3°A, 3°B y 3°D TP) la clase de noticias falsas en formato **grupal**: un video de YouTube, dos textos en la página, preguntas en grupo y plenario de conclusiones.
- Ruta nueva `/nm3/u3-clase4-noticias-falsas/`: portada y 9 pantallas, 90 min.
  - **Inicio (15'):** reportaje «Fake News: Vinculan a famosos con falsas inversiones», de 24 Horas TVN (YouTube `fW-FiJFWvCE`, 3:35, inserción permitida según oEmbed y `playableInEmbed`), con enlace de respaldo. Después, activación con desinformación y error, y objetivo con cuatro roles de grupo.
  - **Desarrollo (60'):** texto expositivo «Anatomía de una noticia falsa» (7 párrafos) y crónica «El poema que Neruda nunca escribió» (5 párrafos). Luego, modelado con la fórmula Respuesta + Evidencia + Explicación, 7 preguntas en grupo y un desafío extra con tres publicaciones inventadas.
  - **Cierre (15'):** plenario con las respuestas esperadas plegadas, metacognición y ticket en el cuaderno.
- No guarda ni entrega: el trabajo va al cuaderno (revisión del 23 de octubre), así que no aplica `CONTRATO_ENTREGA_CLASES.md`.
- Datos verificados:
  - estudio de Vosoughi, Roy y Aral (2018, *Science*);
  - autoría de Martha Medeiros (2000) y aclaración de la Fundación Pablo Neruda;
  - contenido del reportaje, leído en sus subtítulos.
- Cada publicación inventada lleva el sello «Ejemplo inventado para la clase».
- El caso de imagen fuera de contexto reutiliza la sala de lectura de la Clase 3 (letreros en inglés), comprimida a 1200 px: `img/biblioteca-fuera-de-contexto.jpg`.
- `nm3/index.html`: la tarjeta 4 queda activa («Clase lista», viernes 2 de octubre). El manifiesto suma una entrada crítica.
- Validación:
  - navegador real a 390, 1440 y 3840 px: 10 pantallas, 0 errores de consola, 0 recursos fallidos, sin desborde, y pestañas del desafío funcionando;
  - `npm run build` OK, con 460 recursos críticos;
  - `auditar_lenguaje_chile.py`: 0 regionalismos. «Evidencia» se mantiene porque la clase la define y la modela.
- Commits `16113fc4` y `c87165ca`.
- Deploy aplazado. El guard bloqueó el primer intento porque `3cfca7ea` (muebles de gimnasio, Navidad y Halloween, de otro agente) está en `main` sin publicar, y ese agente prepara su release. Publicar antes habría sacado su trabajo, y su deploy posterior habría borrado esta clase. Además, a las 12:40 este PC perdió conexión con GitHub y Vercel. Se publica después de ese release con `npm run deploy:prod:safe` desde un worktree limpio en LF.
- Material impreso fuera de este repositorio, en la carpeta de OneDrive `Lengua y Literatura 2026/NM3 - Lengua y Literatura/03 - Material de Clase/Unidad 3/Clase 4 - Noticias falsas/`: planificación, guía grupal, guía de acceso, tres guías adaptadas y pauta docente, en HTML y PDF.
- Pendiente para Francisco: las tarjetas 5 a 8 de `/nm3/` todavía muestran fechas de septiembre ya pasadas, y el calendario de la unidad hasta el 23 de octubre se debe reordenar.

---

## 2026-10-01, pestaña PAES con admin anterior

- Ante la reiteración de que faltaban vistas previas y selección por curso/tarea, se compararon las dos pestañas abiertas de `/paes/admin/#casas`. Una tenía el catálogo y los controles publicados; la otra no tenía `housePreview`, `houseMode` ni imágenes del catálogo. La URL pública conservaba los recursos nuevos.
- Se recargó únicamente la pestaña anterior, sin borrar caché ni cerrar sesiones. Quedaron disponibles los 172 muebles, la vista ampliada de PS5 con imagen cargada y las opciones de curso, tarea G1–G21 y sets. No se confirmó ningún premio ni se alteró el set preparado en la otra pestaña. Auditoría focal aprobada; no hubo cambios funcionales ni un despliegue adicional.

---

## 2026-10-01, vistas previas y entrega de sets PAES por curso y tarea

- `paes/admin/#casas` muestra el catálogo antes de seleccionar una cuenta, miniaturas mayores y una vista ampliada girable en cuatro ángulos, incluso para muebles obtenidos. Permite armar un set de hasta doce muebles o elegir sets gamer, música y sala.
- Entrega individual o por curso HC, con filtro opcional por guía 1–21 enviada. «Revisar destinatarios» consulta el servidor y muestra la nómina, regalos nuevos y muebles ya obtenidos sin escribir. La confirmación valida nuevamente alcance docente, curso, entrega y nómina exacta. Excluye borradores y perfiles ocultos; los duplicados ambiguos impiden premiar por tarea. Transacciones y relectura por inventario conservan premios previos y permiten reintentar entregas parciales sin duplicación. No se crean nuevas funciones ni reglas Firebase.
- Archivos: `paes/admin/index.html`, `paes/admin/casas.js`, `api/_salas.js`, `scripts/audit-paes-house-admin.js`. Auditoría ampliada: vistas y giros, selección individual, curso/tarea, simulación sin escritura, permisos, cambio de nómina, rechazo de borradores, fallo de confirmación y reintento. Build integral aprobado con 410 recursos críticos.
- Navegador real y funciones locales con datos ficticios: set gamer por curso/G17, exclusión del borrador, conservación del premio existente, relectura y recarga; set música con fallo parcial y reintento. Vista ampliada y ausencia de desbordes a 390, 1200 y 3840 px; consola final limpia y ninguna imagen rota. No se entregaron premios ni se modificaron respuestas reales durante estas pruebas. Servidor y pestañas ficticias cerrados.
- Publicado `82fdb331` con `npm run deploy:prod:safe`, despliegue `dpl_3k5CX454pvASHGfB7PG1bRRgMjCG`, READY y alias público confirmado. Admin, módulo y portal: HTTP 200 y SHA-256 idéntico a la fuente; endpoint sin credenciales rechazado con 401. Navegador público autenticado sin un nuevo login: 172 muebles visibles antes de elegir estudiante, vista ampliada y giros cargados, simulación de set por curso/G17 con nómina y exclusiones del servidor, cero errores de consola o imágenes rotas y sin desbordes en los tres tamaños. No se confirmó ningún regalo real. Se dejó limpio el set para evitar una entrega preparada accidentalmente.

---

Registro para retomar el contexto entre sesiones, agentes y máquinas. El bloque más reciente va arriba.

Esto complementa, no reemplaza, a `REGLAS.md`. Aquí va **qué se hizo, qué quedó y qué está pendiente**. Es una bitácora exclusiva de Estudia CEST: no contiene operaciones de portafolios docentes.

No registrar RUT, notas individuales, correos, credenciales, tokens ni información clínica. Una corrección se agrega como entrada nueva; no se borra el antecedente.

---

## 2026-10-01, administración de casas dentro de PAES

- Francisco pidió entregar personalmente los muebles conforme revisa las tareas y diferenciar «Mi espacio» por color. Nueva pestaña «Casas y muebles» en `/paes/admin/#casas`: filtro de los cuatro cursos HC, estudiante por UID, entregas finales G1–G21 con botón para abrir sus respuestas, búsqueda y filtros de muebles, selección y confirmación de regalo. Los muebles ya obtenidos se marcan y no se pueden volver a seleccionar.
- `paes/admin/casas.js` utiliza las mismas acciones autenticadas de inventario y regalo docente de SIMCE, sin abrir reglas Firebase ni alterar tareas, calificaciones o premios automáticos. Antes de comunicar éxito relee el inventario; bloquea los controles y el doble clic durante la entrega y descarta respuestas antiguas de otra selección. La lista nueva `admin-house-students` se valida en servidor, limita los cursos del docente, excluye perfiles ocultos y no incluye correos ni otros campos del perfil.
- El admin PAES comparte la app administrativa persistente `estudiacest-admin` con el admin SIMCE. Recupera una sesión administrativa heredada únicamente mediante `admin-session-token`; no confunde ni cierra una sesión de estudiante durante una recuperación rechazada. «Mi espacio» cambia a verde petróleo con contraste blanco y foco visible, sin mover las fichas de guías.
- Auditoría nueva de comportamiento incorporada al prebuild y exceptuada en `.vercelignore`: alcance docente, recuperación autenticada, exclusión de borradores, selección, rechazo, doble clic, relectura, persistencia y fallo de confirmación. Auditorías focales e integral aprobaron con 410 recursos críticos. Navegador real en servidor de funciones aislado con datos ficticios: revisión de G17, regalo, recarga marcada y fallo de confirmación; cero errores de consola, imágenes rotas o desbordes a 390, 1200 y 3840 px. No se entregaron muebles reales durante estas pruebas. Servidor de prueba detenido.
- Publicado el commit `1c151f29` con `npm run deploy:prod:safe`, despliegue `dpl_9jjYgF6Vx2A2qzXPFPhFJJ8VMqah`, READY y alias de producción confirmado. Portal, admin y módulo nuevo respondieron 200 y coincidieron en SHA-256. Navegador real autenticado abrió el admin sin formulario adicional, cargó las 153 cuentas HC, filtró un curso y consultó las entregas e inventario reales de solo lectura (172 muebles premiables). El botón estudiantil verde se confirmó visible. No hubo errores de consola ni recursos rotos. No se enviaron regalos reales ni se cambiaron respuestas o notas durante la comprobación.
- La repetición completa de la navegación detectó un conflicto adicional que la vista inicial no mostraba: había una pestaña previa de `/admin/` con Auth predeterminada; al entrar un estudiante, su verificador lo rechazaba y ejecutaba `signOut()` sobre la sesión compartida, haciendo que Mi espacio volviera a PAES. Se aisló también el gateway general en `estudiacest-admin`, con la misma recuperación autenticada y auditoría de migración. El navegador confirmó el mensaje de rechazo en esa pestaña; al retirar el verificador antiguo, la misma cuenta abrió la casa y otra pestaña directa sin repetir credenciales.
- Cierre del conflicto: commit `9793a273`, despliegue seguro `dpl_8PX6JoCftLR3EcHCjKTkUVUv6xef`, READY. Gateway público 200 y SHA-256 idéntico a la fuente, build remoto y 410 recursos aprobados. Se recargó el gateway existente con la versión aislada: sesión docente conservada, PAES recuperado en una pestaña nueva sin formulario, y admin de casas simultáneamente conectado. La pestaña del gateway anterior debe recargarse una vez si sigue abierta en otro equipo; no se borra caché ni se eliminan sesiones de otras cuentas.

---

## 2026-10-01, corrección del ingreso entre PAES y Mi espacio

- Se reprodujo el bloqueo real: una cuenta autenticada que abría Mi espacio en otra pestaña recibía «Primero ingresa a PAES» porque no tenía la selección en `sessionStorage`. Además, el portal reconocía solo el RUT y la casa redirigía a un segundo formulario en Lecturas.
- Commit funcional `60dc04d0`: `paes/js/student-session.js` comparte la sesión Firebase persistente, valida perfil, nómina y curso, y reconstruye la selección desde la identidad autenticada. PAES pide RUT y contraseña en un único formulario para los cuatro cursos HC habilitados; las contraseñas propias siguen vigentes. Mi espacio vuelve solo al ingreso de PAES cuando no hay sesión y conserva el destino. Las tarjetas y accesos a guías permanecen.
- Auditoría focal incorporada al prebuild y exceptuada en `.vercelignore`: recuperación sin selección previa, selección antigua de otra cuenta, ingreso con clave inicial o propia, rechazo de credenciales y perfil de curso cruzado, y cierre. `npm run build` aprobó con 409 recursos críticos.
- Navegador real con una cuenta existente y funciones de producción desde la vista local: ingresar una vez, abrir la casa, volver, recargar, abrir una pestaña nueva, cerrar la sesión e ingresar desde el enlace directo a la casa. Sin errores de consola ni desbordes a 390 px, escritorio y 3840 px. No se respondieron tareas ni se modificaron notas o muebles. El servidor temporal de prueba se detuvo y retiró.
- Primera publicación `dpl_FPMgaPUKPyCBwPE7JbHj6QR89NQk`, estado READY: portal, casa y sesión compartida respondieron 200 y coincidieron en SHA-256. La cuenta que antes quedaba detenida abrió la casa y volvió al portal sin repetir el ingreso. La prueba de navegación reveló además que algunas guías volvían a pedir RUT.
- Ampliación `e59982db`: las guías 1–9, 18, 19, 20 y 21 recuperan la selección del portal; G20/G21 esperan la carga de sus lecturas. G14 oculta la identificación repetida y conserva «Comenzar miniensayo» para no iniciar el tiempo automáticamente. Los enlaces directos G1–G21 vuelven al ingreso único y recuperan su destino; «Cerrar sesión» desde una guía cierra también Firebase en PAES. Navegador real y funciones de producción: G1, G18–G21, preparación de G14 sin iniciar tiempo, entrada directa y cierre completo aprobados; las pruebas locales bloquearon las escrituras de respuestas. Auditoría focal y build integral aprobados.
- Segunda publicación `dpl_9Rv1NEn3pi8wXBCvTF2B4PRXzgYj`, estado READY: los nueve recursos modificados respondieron 200 y coincidieron en SHA-256. Navegador en la G1 publicada confirmó la guía abierta y el formulario de ingreso oculto tras recuperar la sesión.

---

## 2026-10-01, publicación PAES Mi espacio, reenvíos y reconciliación de notas

- Francisco autorizó publicar el lote local completo y la clave inicial de seis dígitos del RUT para las cuentas que no habían cambiado su contraseña. Se publicó el commit `3e84c1a5` en `main` y se desplegó Vercel producción `dpl_GJLE9f1TJA7Eoc7orbTSi2vv2s2F`; la compilación remota aprobó los 408 recursos críticos. Sitio, API y archivos de muestra (Mi espacio, portal, mapa, parlante y estatua) respondieron 200 y coincidieron en SHA-256 con la fuente. También se desplegaron las reglas RTDB y su relectura coincidió con `firebase-rules.json`.
- Mi espacio PAES quedó enlazado discretamente desde el portal para 3°A, 3°B, 4°A y 4°B HC. Se corrigieron condicionalmente 81 cursos invertidos, se crearon y activaron cuatro cuentas faltantes y se ocultó reversiblemente un perfil fantasma duplicado de 4°B sin borrar datos. Auditoría Auth+RTDB: las 153 personas tienen cuenta y perfil utilizable, cero cursos cruzados, cero cuentas deshabilitadas y cero casas fantasma visibles. Prueba autenticada de solo lectura con una cuenta nueva: inicio, inventario y casas del curso respondieron correctamente; no se probó una visita visual en navegador con sesión estudiantil.
- Los regalos entre estudiantes se transfieren: el mueble sale del inventario y pieza del donante en la misma actualización en que entra al receptor; las reglas impiden escrituras directas de `pieza` y `regalos`. Los muebles docentes siguen bajo las restricciones vigentes. Se verificó que las PS5 existentes no estaban colocadas sin regalo ni duplicadas en una misma casa.
- Se recuperaron 20 notas faltantes de G10 con marca de entrega y autoguardado antiguo ocurrido hasta 10 segundos después, más entregas nuevas de G1, G12, G13, G15 y G19; se releyeron intento y libro tras cada lote. Una edición de G10 26 segundos después de la entrega no acredita reenvío final y quedó sin recalificar. Las correcciones manuales se preservaron; la calificación manual del admin ahora guarda intento y libro juntos.
- G1–G21 quedaron visibles y G22–G36 bloqueadas. Se abrió solo el reenvío G10–G19 hasta el 8 de octubre inclusive (`reenvio_cierra=2026-10-09`), con G20/G21 cerradas. La API pública confirmó que una entrega G10 histórica conserva su envío previo y ofrece un borrador editable. `npm run build`, auditorías focales, simulaciones con checksum, ETag y relecturas aprobaron.
- Pendiente funcional: las guías PAES aún no son fuentes configurables de recompensa de muebles; los muebles gratuitos y regalos docentes sí funcionan. Para asignar premios automáticos PAES se debe definir la correspondencia guía→mueble/set. Las nuevas entregas posteriores a esta revisión no se autocalifican: volver a ejecutar el conciliador autorizado o acordar una política de calificación automática antes de prometer actualización inmediata.

---

## 2026-10-01, bloqueo PAES: abiertas solo G1–G21 (datos de producción)

- Se contrastó la configuración real antes de escribir: 19 de G1–G21 estaban bloqueadas y dos abiertas; las 15 guías posteriores/especiales estaban bloqueadas. Había un bloqueo programado vencido y sin marcar como aplicado, que podía volver a cerrar guías en la siguiente lectura.
- Se habilitaron G1–G21 mediante escritura condicional con respaldo y relectura; se marcó el bloqueo programado como aplicado. Una edición posterior, ajena a ese script, dejó 36 guías abiertas. Francisco confirmó que quería **solo G1–G21**; se restauraron exactamente los 15 bloqueos restantes, preservando excepciones, reenvíos y notas.
- Verificación independiente: API pública con G1–G21 sin bloqueo, G22–G31 y cinco especiales bloqueadas (21 abiertas, 15 bloqueadas). La consola del admin no mostró errores actuales al recargar con conexión. Los errores aportados (`ERR_INTERNET_DISCONNECTED`, `ERR_NETWORK_CHANGED`, `Failed to fetch` y cierre de WebSocket) corresponden al corte/cambio de red del navegador; el panel no puede guardar durante ese corte y muestra una alerta genérica. `node --check` del script y `npm run build` aprobaron. No se desplegó código ni se publicó el lote local de Mi casa/PAES avatar.

---

## 2026-10-01, Mi espacio para PAES (preparado en local; no publicado)

- Se preparó `paes/mi-espacio.html` y una entrada desde el portal PAES. Reutiliza avatar, casa y muebles de `estudiantes/` con cuenta Firebase autenticada y perfil de la nómina PAES; un RUT escrito en el portal no autoriza por sí solo a editar una casa. Se añadió auditoría focalizada y el recurso crítico al manifiesto.
- Auditoría agregada de producción: 221 registros de nómina PAES; cuatro sin perfil estudiantil coincidente, 81 perfiles de 3°A/3°B con el curso intercambiado respecto de nómina y libro, y una identidad con perfiles duplicados. La mayoría de los perfiles coincidentes no ha completado el cambio de contraseña.
- **No publicar todavía:** la contraseña inicial de las cuentas sin activar es previsible a partir de un identificador público; antes de abrir avatar, casa y chat hay que acordar acceso individual seguro. También falta decisión sobre la corrección de cursos y prueba real autenticada. El lote local de muebles sigue sin autorización para commit, push o despliegue.
- `node scripts/audit-paes-mi-espacio-page.js` y `npm run build` aprobaron; la prueba de navegador y la verificación de producción quedan pendientes.

---

## 2026-10-01, calificación PAES tras reapertura (datos de producción)

- Se interpretaron como «últimas dos» las guías regulares G20 y G21; ambas quedaron sin calificar. G1–G9 no tenían entregas actuales pendientes; sus notas históricas y borradores se conservaron.
- Se corrigieron 774 registros de entregas confirmadas de G10–G19 y 283 casillas del libro (272 altas y 11 cambios por reenvío). La segunda lectura encontró 26 entregas G14 vigentes sin campo de versión; se calificaron sin alterar las notas que ya constaban en el libro. La exclusión de G14 para 4°A HC se respetó.
- Relectura independiente de Firebase: cero entregas confirmadas elegibles sin calificación ni casilla de libro en G10–G19; G20 y G21 siguen sin notas. Quedó una discrepancia preexistente entre calificación manual y libro, preservada para revisión docente, sin sobrescritura automática.
- El calificador exige simulación con checksum, respaldos locales temporales y escritura condicional por registro; las pruebas sintéticas y `npm run build` pasaron. La portada pública PAES cargó sin errores de consola. No se abrió la publicación estudiantil de G18–G19 ni se desplegó código de la plataforma.
- El lote local de Mi casa sigue excluido de commit, push y despliegue por instrucción vigente de Francisco.

---

## 2026-09-30, salón en L integrado en Mi casa (solo local)

- Se conectó el mapa Tiled de 7 × 7 y 40 baldosas al panel de `Mi casa` como tercera forma, conservando las habitaciones 5 × 5 y 7 × 7. Muros, piso, ruta del avatar, clics y muebles respetan los huecos; no se importaron los muebles de muestra del laboratorio ni se modificó el esquema de premios.
- Al cambiar de forma se impide dejar muebles o visitas fuera. La API valida la posición de presencia según la casa del dueño; las visitas observan cambios de casa y pieza en tiempo real. El mapa compilado se compara casilla por casilla con el JSON original de Tiled.
- Pruebas locales: auditoría de 179 muebles y 407 recursos críticos, `npm run build`, panel real con API/Firebase simulados a 390 y 1200 px, recorrido y rechazo del hueco, paso por 5 × 5/7 × 7/L, bloqueo por mueble fuera y cambio de geometría durante una visita. Sin errores de consola ni desborde. Falta verificar dos cuentas reales, Firebase y reconexión antes de publicar.
- Se mantiene el lote local por instrucción de Francisco: **sin commit, push ni despliegue** hasta autorización expresa.

---

## 2026-09-30, laboratorio Tiled y plan de expansión de Mi casa (solo local)

- Se añadió `scripts/mi-espacio-lab/hoja-de-ruta.md` con cinco etapas: mapas irregulares, integración con casas guardadas, interacciones, avatar por capas y espacios sociales. Cada etapa tiene una prueba de salida; la casa estudiantil vigente no se modificó en esta iteración.
- Se instaló Tiled 1.12.2 en el equipo de desarrollo y se creó `scripts/mi-espacio-lab/`: mapa isométrico JSON de 7 × 7 en forma de L, importador validado, vista Canvas y prueba automatizada. El editor reexportó el mapa y el adaptador conservó 40 casillas, tres muebles, entrada y ruta de 11 pasos.
- Navegador real con clics a 390, 1200 y 3840 px: el hueco se rechaza, se camina entre las dos zonas, zoom/arrastre/centrado responden y no hay errores de consola, recursos fallidos ni desborde. El laboratorio no lee ni escribe Firebase y no está enlazado al dashboard.
- El resultado confirma la viabilidad del **formato de mapas**, no la etapa de migración de habitaciones ni la concurrencia real. No hacer commit, push ni despliegue de este lote hasta autorización de Francisco.

---

## 2026-09-30, parlante RGB y primera ampliación de Mi casa (lote local, sin publicar)

- Se añadió un parlante RGB de cuatro orientaciones como premio docente. Se puede seleccionar y encender/apagar; las luces laten mientras está encendido y el estado se guarda en la pieza.
- La casa admite ahora 5 × 5 o 7 × 7 casillas. La API de presencia acepta las nuevas coordenadas; al reducir, la interfaz impide dejar muebles, al propietario o a las visitas fuera del piso. Para usar el salón en celular se agregaron zoom, arrastre de cámara y centrado.
- Se añadieron tres gestos temporales visibles para quienes estén en la sala: saludar, aplaudir y bailar. El servidor valida los IDs y su duración; la animación no altera el atuendo guardado.
- La carga de sprites pasó a demanda: se cargan las cuatro vistas de los muebles colocados y del que se elige, mientras los demás usan miniaturas diferidas. En la vista de prueba se solicitaron 53 imágenes de muebles, frente a las 716 que habría pedido la precarga completa del catálogo de 179.
- Prueba local aislada en escritorio (1200 px) y celular (390 px): sentarse, acostarse, pasar a salón 7 × 7, sincronizar gesto, encender parlante, acercar, arrastrar y centrar; sin errores de JavaScript, recursos rotos ni desborde horizontal. Auditoría de 179 muebles y 406 recursos críticos; `npm run build` aprobado.
- No se instaló un motor externo: la casa actual es Canvas 2D y una importación de PixiJS/Phaser sería una migración, no una mejora automática. Tiled con exportación JSON isométrica queda como candidato para una siguiente etapa de habitaciones no rectangulares; Colyseus requeriría un servicio multijugador persistente distinto de la presencia actual en Firebase.
- Se mantiene la instrucción explícita de Francisco: **no hacer commit, push ni despliegue** de este lote hasta que autorice publicarlo.

---

## 2026-09-30, lote local de muebles temáticos y camisetas (sin publicar)

- Se prepararon en local 23 muebles con cuatro orientaciones: estación y silla gamer, torre blanca, sofá de tres cuerpos, pecera, cinco mascotas, seis instrumentos/estaciones musicales, cinco alfombras temáticas y dos estatuas doradas simbólicas (CR7 y Messi). Se añadieron seis camisetas de clubes al editor de personaje.
- El personaje puede usar sillas/sofás y camas con una postura visible; las mascotas se desplazan dentro de su baldosa y la pecera muestra peces animados cuando las casas están habilitadas.
- Los muebles nuevos tienen requisito de recompensa/regalo docente, no desbloqueo automático por XP. La estatua CR7 reproduce en cuatro vistas el modelo que Francisco señaló como claramente reconocible; la de Messi se rehízo en el mismo estilo dorado, con rostro, el 10 y la copa levantada.
- Auditoría de Mi espacio: 178 muebles con cuatro sprites; release local: 402 recursos críticos presentes. Prueba aislada de navegador en escritorio y celular: sin errores ni desbordes, mascotas/peces animados, sentarse y acostarse confirmados; seis camisetas inspeccionadas visualmente. `npm run build` pasó con todo el lote integrado.
- Por instrucción explícita de Francisco, este lote permanece solo en el árbol local: no hacer commit, push ni deploy hasta que autorice subirlo. Las dos conservadoras preparadas previamente siguen sin comprobarse publicadas.

---

## 2026-09-30, sesión administrativa persistente y regalos manuales de muebles

- La autenticación del panel docente quedó aislada de la sesión estudiantil
  mediante una aplicación Firebase con nombre propio. Iniciar o cerrar una
  cuenta de estudiante ya no reemplaza la sesión administrativa; la sesión
  anterior se migra una vez y el formulario no se muestra durante la
  recuperación. Cambio base: `4da680d5`.
- En la misma sección `Admin profesor > Chat de casas` se añadió **Regalar
  mueble a un estudiante**: permite elegir estudiante y mueble, pide
  confirmación y, después de entregarlo, lo marca en verde como `Ya lo tiene`,
  indicando si provino del profesor o de una tarea. El servidor limita cada
  docente a sus cursos y los premios manuales del profesor no son transferibles
  entre estudiantes.
- Se incorporó **PlayStation 5** como mueble decorativo con cuatro orientaciones
  isométricas transparentes, creado con generación de imagen y ajustado al
  lenguaje pixel art del catálogo. Cambio funcional: `eb817898`.
- Pasaron la auditoría de Mi espacio, la auditoría de creación y acceso del
  admin, `check:api`, el build integral y una prueba real de navegador: selección
  del estudiante, confirmación, relectura marcada, login oculto y cero errores
  de consola. En producción se comprobaron el panel, el catálogo, la protección
  HTTP 401 sin token y los SHA-256 idénticos de las cuatro imágenes.
- Despliegue `dpl_AzHwNDxi1jGFJKCwCqoh9xuUCoYy`, estado `READY`, asociado a
  `https://www.estudiacest.com`.

---

## 2026-09-30, SIMCE NM2 Unidad 3: la Clase 8 queda sin evaluar en ambos cursos (r4)

- Francisco confirmó que la Clase 8 tampoco se hizo en 2°B HC. La regla quedó
  en `NOT_EVALUATED = { 'sesion-u3-8': ['2A-HC', '2B-HC'] }` en el exportador y
  en el publicador, y la auditoría la exige. El publicador ahora admite que una
  clase completa quede fuera: espera 8 clases con nota y rechaza cualquier nota
  de la Clase 8.
- Publicación `laboriosidad-u3-c1-c10-2026-09-30-r4`: 664 registros; se
  retiraron los 40 de 2°B HC (39 notas y el pendiente de la ruta personal). Sube
  1 nota por un borrador nuevo y las otras 663 no cambian. Relectura
  independiente: 0 notas de Clase 8 en los dos cursos y checksum
  `e86bb74aa10fda6f116a1ea946f14896b79196b3ec7b52e07115887c77281bf7`.
  Respaldo previo local e informe privado de NM2 regenerado.
- `scripts/firebase-maintenance-db.js`: la CLI de Firebase empezó a terminar
  con código 2 después de imprimir una respuesta `success` completa. Ahora se
  acepta esa respuesta; cualquier otra salida con error sigue rechazándose. Aun
  así, la CLI falló de forma intermitente: la relectura interna del publicador
  no alcanzó a correr y la verificación se hizo por separado.
- **Estado encontrado a las 12:30:** las clases 1 a 10 y el Ensayo N.º 3 estaban
  otra vez con `activa: true` y `respuestas_bloqueadas: false`, conservando
  `cerrada_at` de las 09:33, y con excepciones individuales nuevas para cuatro
  estudiantes de 2°A HC. No hubo commits de SIMCE de otra sesión: parece una
  reapertura hecha desde el admin. No se revirtió. Si se vuelve a cerrar, hay
  que recalificar con `close-simce-u3-classes.js` y el publicador.

---

## 2026-09-30, SIMCE NM2 Unidad 3: la Clase 8 queda sin evaluar en 2°A HC (r3)

- Francisco informó que en 2°A HC la Clase 8 (ensayo parcial) no se hizo, así
  que queda sin evaluar para todo el curso, también para quienes alcanzaron a
  responderla. 2°B HC conserva sus notas de esa clase.
- La regla quedó en el exportador y en el publicador
  (`NOT_EVALUATED = { 'sesion-u3-8': ['2A-HC'] }`), y la auditoría de notas
  exige que ambos la tengan, para que una nueva publicación no la vuelva a
  crear. El publicador retira esas notas en la misma escritura multirruta y
  comprueba en la relectura que no quede ninguna.
- Publicación `laboriosidad-u3-c1-c10-2026-09-30-r3`: 704 registros, 43
  retirados y ninguna otra nota cambió. Relectura independiente: 0 notas de
  Clase 8 en 2°A HC, 40 registros en 2°B HC (39 con nota y uno pendiente de la
  ruta personal), checksum
  `86345723c8ffdaba6081f079901adb2ad886215b844d16b01e518a1ce2c23859`. Respaldo
  previo local. Informe privado de NM2 regenerado.
- La sesión sigue asignada a 2°A HC y cerrada: el panel la muestra bloqueada y
  sin nota. Las respuestas de quienes la hicieron se conservan.

---

## 2026-09-30, muebles desbloqueables por tareas y vista unificada de la casa

- Se implementó un inventario de muebles validado por el servidor: los muebles
  asociados a una tarea aparecen bloqueados y solo se habilitan cuando la
  entrega figura canónicamente como enviada y completada. No pueden regalarse
  para eludir el requisito.
- En `Admin profesor > Chat de casas` se agregó el panel **Muebles por tareas
  completadas**, que permite asociar un mueble, un set predefinido o una
  selección personalizada a una o más sesiones equivalentes.
- **Casa y muebles quedaron en una sola ventana:** el catálogo se muestra bajo
  la habitación, sin una pestaña separada. Mientras el bloqueo global está
  activo, el estudiante puede ver los premios y sus requisitos, pero no puede
  caminar, decorar, visitar, conversar ni usar muebles.
- Se publicó el primer premio para la Tarea 11, **Set de escritura**, compuesto
  por libros, monitor, teclado, mouse y lámpara de mesa. Reconoce tanto la guía
  común como su versión personal guiada; la relectura de producción encontró
  17 estudiantes que ya cumplen el requisito.
- Los cambios quedaron en los commits `9432f2b8` y `ccc609f1`. Pasaron la
  auditoría específica de Mi espacio, las validaciones sintácticas, el build
  completo y la revisión pública de la vista unificada y del bloqueo de uso.
  Despliegue final `dpl_9ucsY8caEnAFzDFnJXNRzdfZ4VHy`, estado READY.

---

## 2026-09-30, SIMCE NM2 Unidad 3: cierre real y recalificación ajustada (r2)

Francisco pidió arreglar todo lo pendiente de la Unidad 3 y dejar sin revisar la
Clase 11, que se trabaja hoy. La Clase 11 y su versión personal no se tocaron.

- **Cierre real en las guías.** `estudiantes/js/simce-session-gate.js` lee
  `sesiones/{id}` y, si la clase está cerrada (`activa: false` o
  `respuestas_bloqueadas: true`) y el estudiante no tiene excepción, muestra
  «Clase cerrada» con enlace al panel antes de cargar o guardar respuestas. Si
  la lectura falla, deja trabajar. Se incorporó a las guías 1, 2, 3, 4, 6 y 10
  y al Ensayo N.º 3; las clases 5, 7 y 8 ya cerraban por su cuenta. Probado en
  navegador real a 390 × 844 y 1440 × 900 con sesiones simuladas (cerrada,
  bloqueada, excepción, abierta y falla de red): capa visible, foco en el
  botón, sin desborde ni errores.
- **Panel:** el total del plan ahora cuenta las clases cerradas tras aplicarse
  (`cerrada_at`) o ya completadas; antes podía mostrar «10 de 1».
- **Ensayo N.º 3 cerrado** con el mismo script, que ahora conserva la hora de
  cierre original de las 9 clases (09:33). La Clase 9 sigue abierta.
- **Ruta personal adaptada:** cada clase se califica con la mejor evidencia
  entre la guía estándar y la sesión personal (6 preguntas, sin escritura). Lo
  que todavía no aborda queda `Pendiente`, sin nota y fuera del promedio,
  mientras su ruta siga abierta. Al cerrarla hay que volver a correr la
  publicación. Hoy: clases 1 a 4 calificadas y 5, 6, 7, 8 y 10 pendientes.
- **Copia tardía:** si un texto se entregó 24 h o más antes que otro casi
  idéntico, el tope 5,0 alcanza solo a la entrega posterior. Se revisaron las
  fechas de los 27 pares con desfase y ninguno depende de una reentrega. Ocho
  autores originales dejan de estar ajustados (86 → 78), incluido el que el
  primer cálculo había bajado de 7,0 a 5,0.
- **Publicación** (modelo `laboriosidad-u3-c1-c10-2026-09-30-r2`): 83
  estudiantes × 9 clases = 747 registros, 742 con nota y 5 pendientes. Frente
  a la publicación anterior: 11 suben, ninguna baja. Firebase no guarda
  valores `null`: la primera relectura difirió solo en esas 5 claves `grade`;
  el publicador ahora las omite (`87f1085b`) y la verificación independiente
  coincidió en 747 de 747, con checksum
  `db34cc9540f1fe52c73e892b13b3f57e5bd4c3e4b0d7302b147176c5d1fabc72`.
- **Clase 8:** se mantiene 1,0 para quien no entregó, porque todos tuvieron la
  regularización del 9 al 23-sep y la reapertura del docente.
- **No se pudo hacer en esta sesión:** el borrado de las tres «Cuenta técnica
  temporal» (base y Auth) y el despliegue con `npm run deploy:prod:safe`
  quedaron bloqueados por permisos. Las cuentas siguen fuera de toda nota. Hasta
  que se despliegue `c4301787`, el cierre en las guías y el arreglo del
  contador del panel no están en producción; las sesiones ya figuran cerradas en
  el panel y las notas ya son visibles. Después del despliegue, verificar el
  script en producción y quitarle `allowMissingInProduction` en el manifiesto.
- Build completo aprobado (298 recursos críticos). Informe privado regenerado
  en la carpeta de evaluaciones de NM2, fuera de Git.

---

## 2026-09-30, accesos SIMCE, ruta personal 11, entregas y bloqueo de casas

- Se corrigió el destino posterior al cambio de contraseña: los perfiles SIMCE
  de 2° medio ya no caen en el panel vacío de Lecturas. La ruta personal se
  respeta antes que el destino general y el panel antiguo también redirige los
  perfiles SIMCE al dashboard correcto. Commit `26ccaba3`.
- La ruta personal recibió una versión guiada de la Clase 11, con texto breve,
  seis preguntas y clave privada. La sesión quedó activa y asignada al único
  perfil que usa esa ruta; la escritura se releyó después de aplicarla. Commit
  `bf23ba0a`.
- El barrido de entregas se actualizó al padrón vivo de 87 estudiantes y a las
  once clases de la Unidad 3. Se normalizaron 9 confirmaciones heredadas, 11
  estados de nota obsoletos y una entrega cuya telemetría demostraba que la
  plataforma había observado la confirmación antes de que un guardado posterior
  dejara las marcas en falso. Los casos con solo borrador, nota o telemetría de
  trabajo permanecieron sin inventar entrega.
- El panel docente ahora resuelve el estado desde las marcas canónicas de la
  respuesta, no solo por la existencia de un resultado, y distingue Entregado,
  Trabajando y Por revisar. Forzar envío escribe respuesta, resultado y ranking
  de forma atómica; reabrir limpia las dos marcas y sus fechas. Las clases 5 y
  10 también escriben respuesta y resultado juntas para impedir estados a
  medias. Commit `63dd0201`, despliegue
  `dpl_CmB9XLA9LW8bhMgHxVDQVg5uxhmn`, estado `READY`.
- Casas y decoración quedaron deshabilitadas globalmente en la base real. El
  servidor rechaza entradas, visitas, chat, movimiento y regalos mientras el
  estado está cerrado; el cliente parte cerrado y solo habilita las pestañas al
  recibir autorización del servidor. El admin, en Chat de casas, tiene botones
  para habilitar o deshabilitar todo y al cerrar elimina presencias activas.
  Los muebles no iniciales ya no se desbloquean por XP: requieren una asignación
  registrada, preparada para premios por tareas completadas. Commit `d89ea490`,
  despliegue `dpl_C3fsnWQXrek3UH5HS94BrJ2G2wLS`, estado `READY`.
- Auditorías focalizadas, contrato de 50 clases, auditoría de Mi espacio y build
  completo aprobados. Los archivos públicos del admin y Mi espacio se releyeron
  desde producción y contienen el interruptor, el estado seguro y la nueva
  regla de inventario.
- Cierre adicional: las páginas abiertas consultan el estado cada 15 segundos,
  por lo que un bloqueo docente se aplica sin cerrar sesión. Se desplegó desde
  un worktree limpio para no mezclar ediciones simultáneas de otras clases.
  Despliegue final `dpl_21YG8ZQ6LRS5aMzHokecSvr244ZC`, estado `READY`; la
  relectura pública confirmó el sondeo, los botones del admin y el estado real
  `enabled: false`.

---

## 2026-09-30, SIMCE NM2 Unidad 3: cierre y recalificación de las clases 1 a 10

- Por indicación de Francisco, terminado el plazo que él dio para volver a
  responder, se cerraron las clases evaluadas de la Unidad 3 y se recalificó
  a todo el curso con el modelo de laboriosidad `1 / 3 / 5 / 7` ya publicado
  el 26-ago, ahora extendido a las clases 7, 8 y 10. La Clase 9 sigue
  informativa, sin nota y abierta como material. No se tocaron la Clase 11 ni
  el Ensayo N.º 3, que siguen abiertos.
- **Cierre** (`scripts/close-simce-u3-classes.js`): `sesion-u3-1` a `8` y
  `sesion-u3-10` quedaron con `activa: false`, `respuestas_bloqueadas: true`
  y `cerrada_at`, y sin `excepciones_desbloqueo` (la regularización terminó).
  Una sola escritura de 36 rutas, respaldo previo local y relectura de las 9
  sesiones. Se aplicó a las 09:34, tras comprobar que 2°B HC, en clase en ese
  momento, llevaba más de ocho minutos sin escribir en esas sesiones.
- **Límite conocido:** el panel y las API de las clases 5, 7 y 8 respetan el
  cierre, pero las guías 1, 2, 3, 4, 6 y 10 no consultan el estado de la
  sesión: desde una URL directa todavía guardan borradores y entregas. Las
  notas se calcularon con la lectura posterior al cierre; una escritura tardía
  no las cambia salvo que se vuelva a calificar.
- **Calificación** (`scripts/export-simce-labor-review.js` y
  `scripts/publish-simce-labor-grades.js`, modelo
  `laboriosidad-u3-c1-c10-2026-09-30`). Mínimos de escritura de las clases
  nuevas: los de la propia guía en la 7 (180, 220 y tres de 25 caracteres),
  15 caracteres en las dos metacognitivas de la 8, y 60 en el desarrollo y 300
  en la noticia de la 10. Se mantienen la baja de banda por escritura ausente
  o incompleta y el máximo 5,0 por coincidencia textual superior al 90 %. No
  se aplicó rebaja por velocidad.
- **Exclusiones por UID y dato, no por nombre:** tres «Cuenta técnica
  temporal» de 2°A HC que quedaron de la prueba del 2-sep (inflan la nómina a
  46), una incorporación a 2°B HC creada el 30-sep y el estudiante con ruta
  personal adaptada, cuya nota decide el docente. Sus registros quedaron
  intactos.
- **Publicación:** 82 estudiantes × 9 clases = 738 notas en una escritura
  multirruta. 246 nuevas (clases 7, 8 y 10), 35 suben por entregas tardías,
  456 sin cambio y 1 baja de 7,0 a 5,0: en la Clase 2 un compañero entregó el
  9-sep un texto 98 % igual al que ese estudiante había entregado el 22-jul, y
  la regla alcanza a ambos. 86 notas quedan ajustadas por coincidencia.
  Checksum simulado, aplicado y releído de forma independiente:
  `bb55a47988b09fb8b6e4b7ba7be3932c5a875eabe05a6feda484d43b7602585e`.
- **Revisión:** se abrieron el caso que baja, las coincidencias nuevas de la
  Clase 7 (idénticas o con las mismas faltas) y una muestra por nota de las
  clases 7, 8 y 10 contra los datos crudos. El barrido de integridad de la
  Clase 10 (27 entregas con resultado) no encontró respuestas rápidas con
  logro alto ni pares de desarrollo o noticia similares en el mismo curso; hay
  copiar/pegar en 18, esperable porque la tarea pide citar la frase.
- **Para decidir el docente:** en la Clase 8 no entregaron 66 de 82
  estudiantes (31 de 43 en 2°A, 35 de 39 en 2°B), y solo 23 abrieron la guía;
  no hay respuestas de esa clase en otro nodo. En 2°B HC tampoco entregaron
  32 de 39 la Clase 10 y 27 de 39 la Clase 5. Si alguna de esas clases no se
  aplicó en la plataforma, se excluye y se republica desde la misma
  simulación.
- La reconciliación de entregas ya estaba aplicada por el commit `63dd0201`;
  su simulación no dejó reparaciones pendientes. Informe privado con RUN en la
  carpeta de evaluaciones de NM2 del workspace (fuera de Git):
  `Revision_privada_laboriosidad_U3_C1-C10_2A-2B_2026-09-30.xlsx`.
- Validaciones: auditoría de notas SIMCE, reconciliación en simulación,
  datos públicos, reenvío PAES y release académico (297 recursos) aprobados.
  Un primer `npm run build` se detuvo en `audit-mi-espacio.js` por un cambio
  ajeno aún sin confirmar en `api/_salas.js`; después de integrar `d89ea490`
  el build completo pasó. Sin cambios de sitio: no requirió despliegue.

---

## 2026-09-30, alta y primer acceso de estudiantes reparados

- El alta individual y masiva del panel docente dejó de crear cuentas desde el
  navegador. Ahora usa la API administrativa autenticada, recupera una cuenta
  de Firebase Auth si el correo derivado del RUT ya existía y reconstruye o
  actualiza su perfil canónico sin producir el error `email-already-in-use`.
- Se corrigió el primer ingreso: el login enviaba a `/lecturas/perfil`, que
  respondía 404, aunque la página real era `/lecturas/perfil.html`. El enlace
  nuevo apunta al archivo existente y Vercel conserva compatibilidad con la
  ruta antigua para quienes ya habían quedado en esa pantalla.
- Se verificó en producción, antes del cambio, un estudiante recién inscrito
  en su curso correcto y con perfil pendiente. No se registraron datos
  personales en esta bitácora ni se alteraron respuestas académicas.
- Auditoría focalizada y build completo aprobados. Commit `bc965551` publicado
  mediante el despliegue `dpl_DP9j6R7kx2sjPMupKRz69qbszv33`, estado `READY` y
  alias confirmado en `www.estudiacest.com`. Las rutas antigua y nueva del
  perfil respondieron 200, y el login público contiene el destino corregido.

---

## 2026-09-30, ajuste final SIMCE NM2: noticia y diálogo dramático

- Por indicación de Francisco se eliminó por completo el bloque `4. Planifica`
  de la Clase 11, incluidos sus cuatro campos y su incorporación al registro de
  entrega. La página quedó reducida a cuatro bloques visuales.
- Se mantuvo la transformación de `El puente de cartón` en noticia y se agregó
  el relato original `La última página`, que debe reescribirse como diálogo
  dramático de 100 a 160 palabras, con personajes, parlamentos, al menos dos
  acotaciones y sin narrador.
- La clase ahora registra dos productos: noticia y diálogo dramático. Conserva
  tres preguntas breves de revisión, autoguardado, entrega atómica, relectura de
  las marcas canónicas y carácter formativo sin nota ni ranking. El admin puede
  leer ambos productos con rótulos diferenciados.
- Se incorporó la infografía IA `partes-dialogo-dramatico-ia.webp`, con
  personaje, parlamento y acotación, además de la infografía ya existente sobre
  titular, entrada y cuerpo de la noticia. Ambas se verificaron a 1122 × 1402.
- Auditoría focalizada, contrato de 50 clases y build completo aprobados. En
  navegador real móvil se verificaron cuatro bloques, ocho campos, validación
  del primer pendiente, avance `2 de 2 productos listos`, las dos imágenes y
  ausencia de desborde o errores; el modo local impidió cualquier entrega real.
- Commit `acedb491` en `origin/main`. Despliegue
  `dpl_Fuh4MtWBeVY3gjPXgSA9FHw9xK2T`, estado `READY`, con alias en
  `www.estudiacest.com`. Página y dos infografías respondieron 200 y coincidieron
  exactamente con la fuente local en bytes y SHA-256; el HTML público quedó en
  `a85725b787e87a5ca43503d9cefff68e853a7fa60859f410a82cf600513234e4`.

---

## 2026-09-29 (noche), corrección SIMCE NM2: Clase 11 de transformación textual

- Por indicación de Francisco se reemplazó, en la misma ruta y sesión, la clase
  de dos respuestas A–E–E por una tarea de producción completa: leer el relato
  original `El puente de cartón` y transformarlo en una noticia. No se duplicó
  la Clase 11 ni cambió su fecha del 30 de septiembre o su asignación a 2°A HC
  y 2°B HC.
- La nueva secuencia conserva 90 minutos: propósito, lectura, modelo de
  transformación, planificación, escritura y revisión. Enseña explícitamente
  qué cambia en propósito, orden, lenguaje y estructura, y qué hechos deben
  conservarse sin inventar nombres, fechas, lugares, causas ni declaraciones.
- El producto final es una noticia de 140 a 220 palabras con titular, entrada y
  cuerpo. La plataforma guarda además cuatro campos de planificación y tres de
  revisión metacognitiva. Sigue siendo una actividad formativa, sin nota ni
  ranking, con autoguardado, escritura atómica de respuesta/resultado y
  relectura de `submitted` y `completada`.
- Se actualizaron dashboard, admin, rótulos de revisión, publicador de sesión,
  manifiesto y auditoría. Se conservaron los rótulos de la versión anterior para
  poder leer cualquier borrador legado. No se creó ni envió una entrega de
  estudiante durante las pruebas.
- Validaciones: auditoría focalizada, contrato de 50 clases y build completo
  aprobados local y remotamente. En navegador real, 1440 × 900 y 390 × 844 no
  presentaron desborde; se verificaron 10 campos, foco en el primer pendiente,
  contador, vista previa y producto único. La página pública autenticada mostró
  el nuevo título y el mensaje de autoguardado.
- Commits `74e42961` y `89ede072` en `origin/main`. Despliegue final
  `dpl_8BUDZEwuJX7V6tfQneHxteZM5qxm`, estado `READY`, con alias en
  `www.estudiacest.com`. Página, dashboard y admin respondieron 200; el HTML
  público coincidió exactamente con la fuente local en SHA-256
  `7151167d4c7d863f2b556387c63d5a66b8635b5ec9a22dc79ed8151696eaf071`.

---

## 2026-09-29 (noche), SIMCE NM2: Clase 11 sobre evidencia en dos tipos de texto

- Se publicó para 2°A HC y 2°B HC, con fecha 30 de septiembre, la ruta
  `/estudiantes/guia-u3-s11-evidencia-dos-textos.html`. La clase dura 90
  minutos y enseña la cadena afirmación–evidencia–explicación primero en un
  microcuento y después en una columna de opinión, ambos textos originales y
  declarados como tales.
- Cada género incluye una explicación de qué cuenta como evidencia, errores
  frecuentes y un modelo razonado distinto de la tarea. El producto individual
  son dos respuestas escritas, una por género, más tres preguntas de cierre
  metacognitivo. Los nueve campos se validan, autoguardan y se ensamblan en una
  vista previa antes de entregar.
- La entrega escribe de forma atómica `submitted` y `completada`, relee ambas
  marcas, carga telemetría y deja los dos productos disponibles en el admin.
  Está declarada como formativa y fue excluida de promedios, niveles, reportes
  y exportaciones evaluativas; no asigna una nota automática.
- La sesión `sesion-u3-11` quedó integrada en los respaldos estáticos de dashboard
  y admin. El script `scripts/publish-session-u3s11.js` permite persistir la
  misma definición en Firebase cuando estén disponibles las credenciales administrativas,
  sin que la visibilidad ni la entrega de la clase dependan de esa redundancia.
- Validaciones: auditoría focalizada y contrato de 50 clases aprobados; build
  local y remoto completos; navegador real en 390 × 844 y 1440 × 900 sin
  desborde ni errores de consola; validación de nueve pendientes, vista previa
  de los dos productos y modo local sin escritura comprobados. Portada,
  Estudiantes, PAES, NM4, dashboard, admin y la clase nueva respondieron 200.
  El HTML público coincidió con la fuente local en tamaño (34.670 bytes) y
  SHA-256.
- Commits `dba3fcce` (implementación) y `65cb7a87` (protección del manifiesto).
  Despliegues `dpl_FRzQh1gcZxGAVRiNA4SdtEmn5ekH` (alta inicial) y
  `dpl_C25vJxTo4i3y1HDuVBbUDDacKeCN` (protección final), ambos `READY`, con
  alias confirmado en `www.estudiacest.com`. No se creó ninguna entrega
  ficticia ni se modificaron datos de estudiantes.

---

## 2026-09-29 (tarde), /termas: jerarquía tipográfica y responsive publicadas

- Se reemplazó la dupla Fraunces/Plus Jakarta Sans por una sola familia Plus
  Jakarta Sans alojada localmente. Títulos, etiquetas, ayudas, controles y pase
  de abordar quedaron con una escala más legible; el coral del CTA se oscureció
  y alcanza contraste AA de 4,84:1 con texto blanco.
- El hero ahora concentra marca, destino, explicación breve y acción. La fecha,
  el estado en vivo y los conteos pasaron a una franja separada. Los números de
  paso se integraron a cada título y las leyendas de las imágenes salieron de la
  fotografía para mantener su lectura en celular.
- Se agregaron recortes móviles 4:3 para las tres escenas, un escudo CEST de
  4,3 KB y la fuente WOFF2 local. El escudo anterior descargaba 679 KB dos veces.
  También se quitó la animación continua del recurso LCP; se conservan el vapor,
  los estados en vivo, el destello único y la retroalimentación de los asientos,
  todos reducidos por `prefers-reduced-motion`.
- No cambiaron la API, los nombres ni el orden de los campos, la validación ni
  los datos guardados. El flujo ficticio completo se probó en 320, 390, 1440 y
  3840 px: 45 asientos, selección, comida y pase final, sin errores de consola
  ni desborde. `npm run build` verificó 294 recursos críticos.
- Lighthouse móvil en producción: rendimiento 99, accesibilidad 100, buenas
  prácticas 100, LCP 2,0 s, CLS 0, TBT 0 ms y 183 KiB transferidos. El informe
  quedó completo; la CLI solo informó `EPERM` al limpiar su carpeta temporal de
  Windows.
- Commit `84e2b531` en `origin/main`. Despliegue
  `dpl_JDTXpo3pwjoiCNEC6cRvv2k6niq9`, estado `READY`, con alias en
  `www.estudiacest.com`.
- En producción, el HTML y los cinco recursos nuevos coinciden en bytes y
  SHA-256 con la fuente local. `/termas` conserva `noindex, nofollow`; portada,
  PAES, NM4, estudiantes y el admin de termas responden 200. La lectura real
  mostró 0 asistentes y 45 asientos libres. No se escribió ningún dato.

---

## 2026-09-29 (tarde), /termas: ambientación con imágenes IA publicada

- El encabezado dejó la ilustración SVG embebida y ahora usa una escena termal
  panorámica creada con IA. Los pasos de transporte y almuerzo incorporan otras
  dos ilustraciones, marcadas como referenciales o ambientacionales.
- Se agregaron movimiento lento del paisaje, vapor y un destello suave en las
  escenas. `prefers-reduced-motion` reduce todas las animaciones a `0,01 ms`.
  Los tres WebP pesan entre 277 y 285 KB y quedaron protegidos por
  `scripts/academic-release-manifest.json`.
- Probado en navegador real a 320, 390, 1440 y 3840 px: sin errores de consola
  ni desborde horizontal; las tres imágenes cargan y el flujo conserva los 45
  asientos. `npm run build` verificó 289 recursos críticos.
- Commit `c98fa5da` en `origin/main`. Despliegue
  `dpl_GqLeEAL771g6cyqASHcmtAaFMXuL`, estado `Ready`, con alias en
  `www.estudiacest.com`. El despliegue publicó también el almuerzo y el aviso de
  nómina que habían quedado pendientes en `9c096e9f`.
- En producción, el HTML y los tres WebP coinciden byte a byte y por SHA-256 con
  la fuente local; `/termas` conserva `noindex, nofollow`. La lectura real mostró
  0 asistentes y 45 asientos libres. No se escribió ni creó ningún dato de prueba.

---

## 2026-09-29 (tarde), /termas: almuerzo incluido y aviso de nómina (sin desplegar)

- Quienes asisten ven la tarjeta «El almuerzo va incluido», con el almuerzo
  buffet de 13:00 a 15:00 y lo que incluye según la página 2 de la cotización.
  El pase de abordar agrega la línea «Almuerzo 13:00 a 15:00».
- En el paso de asistencia hay un aviso: la nómina se entrega en la recepción de
  las termas, y quien no esté inscrito no podrá asistir. El pase lo repite.
- Probado en local con iPhone 13, sin errores ni desborde. `npm run build` en
  verde. Commit `9c096e9f` en `origin/main`.
- **NO desplegado.** Francisco cerró la sesión para pedirle imágenes a Codex.
  Producción sigue en `8c1c055d`. El próximo `npm run deploy:prod:safe` publica
  este cambio junto con lo que agregue Codex.
- El nodo de prueba `eventos_docentes/termas_prueba_local` quedó borrado.
  `eventos_docentes/termas_2026` no tiene inscripciones de prueba.

---

## 2026-09-29 (tarde), /termas: detalle de desayuno y once

- Francisco entregó la cotización en PDF: Hotel Termas de Panimávida, 09-mar-2026.
  Ahora la página muestra qué incluye el **desayuno buffet (08:30 a 10:00)** y la
  **once continental (17:00 a 18:00)**, sin valores, por decisión de Francisco.
  También agrega la política de la cotización: si se contrata, se paga por todo
  el grupo reservado.
- Francisco considera que la oferta no es muy llamativa. La página presenta el
  detalle en tono neutro, para que cada docente juzgue. Su preferencia opcional
  queda en el admin.
- Commit `8c1c055d`. En el deploy `dpl_A9NT1yZsr4cp5FCtGegTjwg5pMeb` la CLI
  terminó con `ECONNRESET` en la consulta final. Según `vercel inspect`, quedó
  Ready y con alias en www, y la página publicada mide lo mismo que la local.
  Las portadas protegidas y `/termas/admin` responden 200.
- Queda cerrado el pendiente 1 de la entrada del mediodía. Siguen abiertos la
  capacidad del bus, cuando el colegio responda, y el cruce con la nómina.

---

## 2026-09-29 (tarde), /termas: cualquier correo, teléfono y contacto de emergencia

Cambios por decisión de Francisco, sobre la entrada de abajo:

- Se acepta **cualquier correo**. Ya no se exige `@salesianostalca.cl`, así que
  ese filtro ya no deja fuera a los estudiantes. Lo que queda para depurar es
  «Quitar» en el admin.
- Todos deben entregar nombres, apellidos, correo, teléfono y contacto de
  emergencia (nombre y parentesco, más teléfono), también quienes marcan «No
  asisto». El servidor valida cada campo: el teléfono debe tener entre 8 y 15
  dígitos.
- Esos datos solo salen por el admin, en la tabla y el CSV, y por `termas-mia`
  para quien tiene la llave de su propia inscripción. El mapa público sigue
  mostrando solo el nombre corto de cada asiento.
- Se agregó la fecha: **sábado 14 de noviembre**. Francisco la confirmó el mismo
  29-sep en el chat de la directiva.
- Validado con 8 casos de API contra el nodo de prueba, ya borrado. En el
  navegador, iPhone 13, 320 px y escritorio quedaron sin errores ni desborde.
  En producción se hizo un recorrido real con un gmail ficticio: se guardaron el
  teléfono y el contacto de emergencia, y después se borró.
- `npm run build` en verde. Commit `7b900732`, deploy
  `dpl_Be2jq9MPzWNqTiUobSBBHyrugHaH`.
- **Sigue pendiente** el detalle del desayuno y la once. La cotización no está
  en el correo del colegio ni en WhatsApp. Las dos imágenes del 25-sep en el
  chat de la directiva eran otro documento.

---

## 2026-09-29, /termas: inscripción docente al paseo a las Termas de Panimávida

Página interna para docentes, no para estudiantes: `estudiacest.com/termas`.
No aparece en ninguna portada ni menú, lleva `noindex` en la página y
`X-Robots-Tag: noindex, nofollow` en `vercel.json`. Francisco la comparte por su
cuenta.

**Qué hace**

- Nombre, apellido y correo institucional. Solo se aceptan correos
  `@salesianostalca.cl`, lo que también deja fuera las cuentas de estudiantes.
- Asisto o No asisto. Si asiste, elige bus o transporte propio.
- Si elige bus, ve un bus de 45 asientos (10 filas de 2+2 y una última fila
  de 5) y toca su asiento. Los tomados muestran iniciales, y al tocarlos se ve
  el nombre y primer apellido. El mapa se actualiza cada 5 segundos, y si
  alguien toma el asiento que la persona estaba mirando, se le avisa.
- Aviso visible: el bus está en gestión con el colegio. El correo a la
  administración se envió el 29-sep.
- Sección «Desayuno u once» con preferencia opcional. **El detalle de lo que
  incluye cada opción y su horario sigue pendiente**: la cotización está en el
  Gmail personal de Francisco y no se pudo abrir en esta sesión. Se completa en
  el objeto `COMIDAS` de `termas/index.html`, sin valores ni precios, por
  decisión de Francisco.
- Al confirmar aparece un pase de abordar. La inscripción se puede modificar
  desde el mismo navegador.
- Admin en `/termas/admin`: la misma cuenta administrativa de Estudia CEST
  (`plataforma_estudiantes/admins`). Muestra totales, preferencias de comida,
  tabla con correos, CSV y «Quitar», que borra la inscripción y libera el
  asiento.

**Cómo está hecha**

- `api/_termas.js`, enrutado desde `api/estudiantes.js` con las acciones
  `termas-estado`, `termas-mia`, `termas-inscribir`, `termas-admin-lista` y
  `termas-admin-quitar`. No es función propia porque las 12 de Vercel Hobby
  están ocupadas.
- Datos en `eventos_docentes/termas_2026/inscripciones`, fuera de
  `plataforma_estudiantes`. La raíz de `firebase-rules.json` ya niega lectura y
  escritura, así que **no se tocaron ni desplegaron reglas**. Sondeado: lectura
  y escritura anónimas dan 401.
- El asiento se decide en una transacción sobre todas las inscripciones, y el
  mapa se deduce de ellas, así que no hay nodo de asientos que pueda quedar
  huérfano. Al inscribirse, el navegador recibe una llave; en el servidor se
  guarda solo su hash. Sin esa llave, otra persona no puede cambiar una
  inscripción ajena, aunque escriba el mismo correo. Si alguien pierde el acceso,
  se le quita desde el admin y se vuelve a inscribir.
- `termas/index.html` y `termas/admin.html` quedaron en
  `scripts/academic-release-manifest.json`.

**Validación**

- Contra un nodo de prueba con datos ficticios, ya borrado: inscripción,
  asiento ocupado (409), correo ajeno sin llave (409), cambio de asiento con
  llave, lectura de vuelta, correo de estudiante (400) y asiento fuera de rango
  (400). En la prueba de carrera, seis pedidos simultáneos al mismo asiento: uno
  lo obtiene y cinco reciben 409.
- Navegador: iPhone 13, 320 px y escritorio de 1440 px, sin errores de consola
  ni desborde horizontal. La inscripción se recuerda al recargar.
- `npm run build` en verde. Deploy con `npm run deploy:prod:safe` del commit
  `30202ecf` (`dpl_HZhobrE4AnP9LX6xBAcX1vGGaboC`).
- Producción: `/termas`, `/termas/`, `/termas/admin`, la raíz, `/paes/`,
  `/nm4/` y `/estudiantes/` responden 200, y `/api/_termas.js` queda bloqueado.
  Se hizo un recorrido real con una inscripción ficticia en el asiento 45: se
  leyó de vuelta, se borró y el nodo real quedó vacío.
- **No probado:** el ingreso al admin con la cuenta real. Sin sesión, el
  endpoint responde 401.

**Pendiente**

1. Completar desayuno y once (qué incluye cada uno y su horario) desde la
   cotización, y volver a desplegar.
2. Si el colegio confirma un bus de otra capacidad, cambiar `CAPACIDAD` en
   `api/_termas.js`. La distribución del bus se ajusta sola.
3. Cuando llegue la nómina docente, cruzarla con las inscripciones del admin.

---

## 2026-09-29, NM4 4°A Industrial y 4°B Automotriz: clases e informes especializados

Se reemplazó en el portal la actividad mecánica compartida por dos experiencias
independientes y coherentes con cada especialidad. La ruta mecánica anterior y
sus datos permanecen disponibles como historial; no se eliminaron ni migraron
entregas existentes.

**Diseño de las clases**

- 4°A Mecánica Industrial trabaja el diagnóstico del conjunto motor–bomba
  BP-04: resguardo, vibración, temperatura, pérdida de lubricante y plan de
  mantenimiento. La clase tiene 14 pantallas y una secuencia explícita de 90
  minutos.
- 4°B Mecánica Automotriz trabaja el vehículo V-17: pastillas y discos,
  humedad del líquido de frenos, fuga del amortiguador y decisión de aptitud.
  También tiene 14 pantallas y 90 minutos.
- Cada caso integra tres imágenes originales generadas con IA, QR propio,
  libreta de evidencias, modelo de hallazgo y un informe técnico de 12 páginas.
  Los prompts quedaron archivados junto a los recursos.
- Cada informe contiene 27 campos, de los cuales 20 son obligatorios para
  entregar. La interfaz indica el orden exacto de trabajo y distingue las
  casillas obligatorias de las de ampliación.

**Guardado, parejas y gestión docente**

- Las bases nuevas son independientes:
  `plataforma_nm4/informe_industrial_2026` y
  `plataforma_nm4/informe_automotriz_2026`.
- 4°A y 4°B pueden trabajar individualmente o en pareja. Es posible agregar al
  compañero después de comenzar; la migración conserva y combina ambos
  borradores. Cada navegador envía solo sus campos modificados y consulta la
  versión compartida cada 2,5 segundos.
- Cada especialidad tiene panel protegido propio y una sección para registrar
  manualmente parejas por curso y número de lista, sin solicitar ni exponer RUN.
- La entrega se cierra una sola vez para ambos integrantes; cualquier escritura
  posterior es rechazada hasta que el docente la reabra.

**Pruebas y publicación**

- Auditoría especializada: 14 pantallas, 90 minutos, 12 páginas, 27 controles
  únicos, 20 obligatorios y recursos integrados en ambas versiones.
- API aislada y Playwright local: fusión de borradores individuales, dos
  escrituras simultáneas conservadas, actualización cruzada, recarga, entrega,
  bloqueo posterior y alta manual administrativa aprobados para ambas rutas.
- Producción real: Firebase conservó los aportes de dos sesiones, devolvió la
  misma entrega compartida a ambos integrantes, confirmó 20/20 y rechazó una
  escritura tardía con HTTP `409`. El panel sin autenticación respondió `401`.
- Navegador móvil público: presentación, seis imágenes, informe, autoguardado y
  relectura aprobados en 4°A y 4°B. Diecinueve recursos públicos coincidieron
  byte a byte por SHA-256 con la fuente local.
- Build integral y control posterior aprobados con 284 recursos críticos. La
  API pública informó 50 identidades habilitadas para Industrial y 47 para
  Automotriz, con 27 campos en cada actividad.
- Implementación: `7fba77e0`. Despliegue:
  `dpl_FESyYkNBNjejJZQcLvFx7GQ5nMLu`, estado `READY` y alias
  `https://www.estudiacest.com` verificado.

---

## 2026-09-29, NM4 4°C: parejas, sincronización segura y alta manual

Se aplicaron al informe de Electricidad todas las mejoras colaborativas ya
incorporadas en Electrónica, sin reemplazar ni eliminar respuestas existentes.
La habilitación de parejas en la versión eléctrica queda restringida a 4° C y
a la nómina ficticia de prueba: los registros históricos de 4° E que aún se
leen desde esa base conservan su modalidad individual.

**Experiencia estudiantil y conservación de avances**

- Al ingresar, 4° C puede elegir trabajo individual o en pareja. Quien ya
  comenzó individualmente puede usar `Agregar compañero` sin perder lo escrito.
- La migración a pareja es transaccional: respalda los borradores individuales,
  conserva el avance y combina los campos disponibles en un borrador compartido.
- Cada navegador envía solo las casillas modificadas. El servidor las fusiona
  mediante una transacción, por lo que dos integrantes que escriben en campos
  distintos no se sobrescriben. Si editan la misma casilla, prevalece el último
  guardado confirmado.
- Las sesiones consultan el estado cada 2,5 segundos y muestran los cambios
  guardados del compañero sin recargar. La entrega vacía la cola local, relee
  el borrador canónico y cierra una sola entrega para ambos integrantes.
- La presentación de la clase explica explícitamente la elección de modalidad,
  el RUT del compañero, el borrador compartido y qué debe completarse.

**Gestión docente**

- El panel protegido `/nm4/u3-clase6-informe-tecnico/revisar/` contiene
  `Registrar una pareja de 4°C manualmente`, con curso y dos selectores por
  número de lista y nombre; no solicita ni expone RUN.
- `admin-pair` exige autenticación administrativa, integrantes diferentes del
  mismo curso y usa la misma migración con respaldo y combinación de avances.

**Pruebas y publicación**

- Prueba aislada de API: unión de dos borradores, respaldo de ambos, escrituras
  concurrentes conservadas, entrega compartida y ausencia de RUN almacenado.
- Playwright local: dos navegadores, actualización cruzada, recarga con ambos
  campos, informe en plural, formulario docente y vista móvil sin desborde.
- Prueba en producción con una pareja ficticia: dos sesiones escribieron campos
  distintos simultáneamente, ambas pantallas recibieron los dos textos, la
  recarga los conservó y ambos integrantes leyeron la misma entrega canónica.
  La edición posterior fue rechazada con HTTP `409`; `admin-pair` sin sesión
  administrativa fue rechazado con HTTP `401`.
- Build integral, auditoría de Clase 6 y verificación de 261 recursos críticos
  aprobados. La API pública informó 89 identidades habilitadas en la versión
  eléctrica y 27 campos. Los cuatro recursos públicos modificados respondieron
  `200` y coincidieron por SHA-256 con la fuente local.
- Implementación: `85a99c6a`. Despliegue seguro:
  `dpl_AyU34yn1LckeG3UqtRVimccXRGWr`, estado `READY` y alias
  `https://www.estudiacest.com` verificado.

---

## 2026-09-29, NM4 4°E: edición simultánea y registro manual de parejas

Se convirtió el informe compartido de Electrónica en una experiencia
colaborativa segura para dos equipos distintos y se agregó al panel docente una
sección para registrar manualmente a quienes no pudieron formar su pareja desde
la vista estudiantil.

**Colaboración sin pérdida de contenido**

- El navegador guarda únicamente las casillas que esa persona modificó; ya no
  reemplaza el formulario completo en cada autoguardado.
- El servidor fusiona esos cambios mediante una transacción y recalcula el
  avance sobre el borrador canónico. Si cada integrante edita un campo distinto,
  ambos se conservan aunque guarden simultáneamente. Si editan exactamente la
  misma casilla, prevalece el último guardado confirmado.
- Las parejas consultan el servidor cada 2,5 segundos. Los cambios guardados
  aparecen automáticamente en la otra pantalla sin recargar, salvo el campo que
  esa persona esté editando en ese instante.
- La entrega primero vacía la cola local, relee el borrador compartido y pide al
  servidor cerrar la versión canónica sin reenviar una copia completa obsoleta.
- La conversión individual a pareja conserva además los dos borradores
  originales en el respaldo transaccional creado anteriormente.

**Gestión docente**

- El panel protegido `/nm4/u3-clase6-informe-electronica/revisar/` incorpora
  `Registrar una pareja manualmente`, con curso y dos selectores por número de
  lista y nombre. No solicita ni expone RUN.
- La API `admin-pair` vuelve a comprobar autenticación y autorización, exige
  integrantes distintos del mismo curso, rechaza otras parejas y utiliza la
  misma migración que conserva y combina avances. Después de registrarla, el
  panel pide a ambos estudiantes actualizar la página.

**Pruebas y publicación**

- Prueba aislada de API: pareja creada por administrador, dos escrituras
  concurrentes en campos distintos, ambos campos conservados, entrega desde el
  borrador canónico, dos respaldos y ningún RUN almacenado.
- Playwright local: dos navegadores, sincronización bidireccional, envío solo de
  campos modificados y vista móvil sin desborde. El formulario administrativo
  también se probó en móvil con autenticación y API simuladas.
- Prueba completa en producción con una pareja ficticia: dos navegadores
  escribieron al mismo tiempo, ambos textos aparecieron en las dos pantallas,
  sobrevivieron a la recarga y las dos identidades recuperaron el mismo
  borrador. La acción administrativa sin token fue rechazada con HTTP `401`.
- Build integral y auditoría de Clase 6 aprobados. La API pública informó 44
  registros habilitados y 27 campos. Los HTML públicos del informe y del panel
  respondieron `200` y coincidieron por SHA-256 con la fuente local.
- Implementación: `ae0c0079`. Despliegue seguro:
  `dpl_DEpWKUSyxiYWw4vFUTEA66b8m9hw`, estado `READY` y alias público verificado.

---

## 2026-09-29, NM4 4°E: trabajo individual o en pareja sin perder borradores

El informe de Electrónica permite trabajar individualmente o en pareja. Cada
integrante se valida contra la nómina del mismo curso y la pareja comparte un
solo borrador, una sola entrega y el mismo estado en el panel docente. No se
guarda ningún RUN: después de validar, la asociación usa curso y número de
lista.

Se añadió compatibilidad especial para estudiantes que ya habían comenzado
individualmente antes de habilitar las parejas:

- Al recargar un borrador individual aparece `Agregar compañero` dentro del
  informe. Antes de abrir el selector, la página fuerza el autoguardado.
- La conversión a pareja es transaccional. Conserva intactos los borradores
  individuales como respaldo y crea el compartido con los campos ya escritos;
  si ambos habían avanzado, prioriza los campos del solicitante y completa los
  que faltan con el trabajo del compañero.
- No permite asociar a alguien que ya integra otra pareja ni convertir una
  entrega individual cerrada sin que el profesor la reabra.
- Una vez formada la pareja, cualquiera puede continuar y entregar. La entrega
  final bloquea escrituras tardías para ambos.

**Pruebas y publicación**

- Prueba aislada de API: dos borradores individuales conservados, campos
  combinados, respaldo de ambos, lectura compartida y ausencia de RUN en la
  base simulada.
- Prueba Playwright local a 390 px: borrador existente, guardado forzado,
  selección de compañero, contenido intacto, recarga compartida y sin desborde.
- Prueba completa en producción con identidades ficticias: borrador individual
  guardado y recuperado tras recargar; conversión a pareja; lectura y edición
  desde el segundo integrante; entrega compartida con `20 de 20`; ambos
  recuperaron las mismas respuestas y una escritura posterior fue rechazada
  con HTTP `409`.
- Build completo y auditoría de Clase 6 aprobados. API pública: actividad
  correcta, 42 registros habilitados y 27 campos. El HTML público incluye el
  nuevo control y coincide por SHA-256 con la fuente local.
- Se robusteció el verificador seguro con tres intentos ante fallos transitorios
  de red; sigue bloqueando recursos ausentes o respuestas HTTP inválidas.
- Implementación inicial de parejas: `79e18d80`. Migración segura de borradores:
  `9527e0a2`. Despliegue seguro: `dpl_DUTbRn825yjjNT1NRDnWH3hTSjmE`, estado
  `READY` y alias `https://www.estudiacest.com` verificado.

---

## 2026-09-29, 4°D TP: taller accesible desde la portada pública

Se trasladó el acceso principal al taller de productos escritos desde el inicio
de la carpeta del estudiante a una tarjeta destacada en la portada pública
`/4dtp/`, antes del ingreso. La tarjeta abre
`/4dtp/taller-productos-escritos/?slide=1` sin RUN ni inicio de sesión. Se conserva
el enlace de consulta junto al editor de Textos y todos los demás destinos.

- Archivos: `4dtp/index.html` y `4dtp/styles.css`.
- Auditoría del anuario y build completos aprobados; 261 recursos críticos.
- Navegador local y público: acceso sin sesión, apertura en 1/10, avance y
  regreso al inicio; sin errores de consola ni solicitudes fallidas. Portada
  sin desborde a 390, 1440 y 3840 píxeles CSS, con tarjeta dentro del ancho.
- HTML, CSS y presentación públicos: HTTP 200 y SHA-256 idéntico al local.
  Portadas PAES, NM3, NM4, 3ATP y Estudiantes: HTTP 200.
- Implementación: `7ef76ec5`. Despliegue seguro:
  `dpl_EFDVWbutBycHt9ZLdmWPx7FM2Cie`, estado READY y alias público verificado.

---

## 2026-09-29, NM4 Clase 6: versión propia para 4°E Electrónica

Se creó una tercera versión completa de la tarea «Escribir en el trabajo: el
informe técnico», destinada exclusivamente a 4°E. La versión eléctrica
histórica de 4°C/4°E se conserva sin borrar sus borradores ni entregas, pero la
portada de NM4 ahora dirige 4°E al caso nuevo de Electrónica.

**Caso y secuencia didáctica**
- Caso ficticio `AUT-PVL-DIA-L02`: diagnóstico de una línea automatizada de
  embalaje de fruta con sensor fotoeléctrico, PLC, HMI, variador, motor y
  gabinete de control.
- Presentación propia de 14 pantallas y 90 minutos. El foco es seguir una señal,
  registrar mediciones, interpretar alarmas y documentar versiones del programa,
  no inspeccionar infraestructura eléctrica de alta tensión.
- Informe prediseñado de 12 páginas y 27 campos: mediciones de 24 VDC,
  temperatura del gabinete, evidencia fotográfica, configuración y respaldo del
  PLC, hallazgos y conclusión.
- El mínimo de entrega son 20 campos de las páginas 6, 8, 9 y 11. El navegador y
  la API aplican la misma regla; una entrega confirmada queda bloqueada contra
  sobrescrituras posteriores.
- Tres fotografías originales generadas con IA: vista general de la línea,
  sensor sucio y desalineado, y gabinete con ventilación obstruida. Los prompts
  quedaron archivados junto a los recursos.

**Persistencia y compatibilidad**
- Nueva versión API `electronica`, curso canónico `4ETP`, sesión propia y nodo
  independiente `plataforma_nm4/informe_electronica_2026`.
- El caso eléctrico anterior y el mecánico mantienen sus rutas, sesiones y bases.
- Se agregó el panel docente, el contrato de entrega, el manifiesto académico y
  la auditoría de la Clase 6 para las tres versiones.

**Validación local**
- Build completo: aprobado con 261 recursos críticos.
- Auditoría de Clase 6: 14 pantallas y 90 minutos en cada versión; Electrónica
  tiene 27 campos dibujados una sola vez y cinco datos técnicos verificables.
- Prueba Playwright: escritorio y móvil sin desborde horizontal; ingreso,
  bloqueo de 20 campos incompletos y entrega confirmada con los 20 completos.
- Prueba aislada de API: entrega incompleta `400`, completa `200` y segundo envío
  bloqueado con `409`.

**Claridad y publicación final**
- Después de recorrer la versión pública como estudiante, se hizo explícita la
  diferencia entre `Obligatorio` y `Ampliación`. La pantalla de trabajo indica
  exactamente las páginas y los tiempos; el informe rotula las ampliaciones y
  el progreso confirmado muestra `20 de 20 mínimos`, no `20 de 27`.
- Se efectuó una entrega real con la cuenta de prueba: el servidor la confirmó,
  la recarga recuperó las respuestas en solo lectura y un segundo envío fue
  rechazado con `409`. El panel del estudiante informa que el profesor recibió
  el informe.
- La prueba pública recorrió las 14 pantallas, abrió la libreta, comprobó las
  instrucciones y verificó móvil sin desborde; no registró errores de consola ni
  recursos fallidos.
- La API pública respondió con la actividad correcta, 40 registros habilitados
  para 4°E más prueba y 27 campos. Los HTML y JavaScript publicados coincidieron
  por SHA-256 con la fuente local; las rutas eléctrica y mecánica anteriores
  continuaron respondiendo `200`.
- Implementación: `2bde3abc`. Ajuste de claridad: `9902028a`.
- Despliegue seguro final: `dpl_8iEhViaqdg1mUAMAamL34nCRb6CT`, estado `READY`,
  asociado a `https://www.estudiacest.com`.

---

## 2026-09-28, 4°D TP: presentación de tres productos escritos

Se publicó una presentación nativa de 10 diapositivas en
`/4dtp/taller-productos-escritos/`, accesible desde el inicio del Anuario 4°D TP
y desde la sección Productos escritos. Explica tres alternativas de escritura:
memoria escolar, proyecto de especialidad y cierre personal. La tarea final pide
elegir y terminar solo uno de esos productos dentro del Anuario.

La presentación no incluye pauta común, puntaje ni rúbrica. Incorpora modelos de
inicio, extensiones sugeridas, estructura de cada producto y recordatorios
breves para redactar. Se puede controlar con botones, flechas del teclado,
gestos táctiles, enlace por diapositiva y pantalla completa.

**Validación y publicación**
- `audit:anuario-4dtp` y el build completo aprobaron con 251 recursos críticos.
- La prueba local y la prueba pública recorrieron las 10 diapositivas; las cuatro
  imágenes cargaron, no hubo errores de consola ni desborde horizontal en 390 px.
- La página pública respondió 200 y su SHA-256 coincidió exactamente con el
  archivo local.
- Implementación: `ffdf94c5`.
- Despliegue seguro de Vercel: `7tcoNKyRdCieyjfA6jdGkBWdoMNp`, estado Ready,
  asociado a `https://www.estudiacest.com`.

---

## 2026-09-28, NM4 Clase 6: correcciones de la auditoría antes de la clase

Francisco pidió auditar la Clase 6 (informe técnico), en sus dos versiones, el día de la clase.

**Resultado de la auditoría**
- Las instrucciones son entendibles.
- Los 27 campos de cada versión se pueden responder con los datos del caso.
- La clase es pertinente al currículo, verificado en fuentes del Mineduc:
  - OA 5 de 4° medio FG (producir textos adecuados al género y a la audiencia), el verbo que mejor evalúa el producto;
  - OA 6 (recursos lingüísticos: léxico, verbos, construcciones);
  - Programa 4° medio, pág. 32 y Anexo 1: géneros del ámbito laboral;
  - OAG 1 de la Formación TP: comunicarse por escrito con registros pertinentes a la situación laboral;
  - Electricidad: la especialidad declara «informes técnicos» entre sus productos esperados.

**Correcciones aplicadas en las dos versiones**
- **Objetivo:** ahora nombra al destinatario («dirigido a la empresa que lo solicita»), como pide el OA 5.
- **Mínimo para entregar:** páginas 6, 9 y 11 (datos, fotos 3 y 4, hallazgos 2 y 3). Aparece en la pantalla «Trabajo y monitoreo» y en el aviso del informe; el resumen y la conclusión, si alcanza el tiempo. 27 campos en 42 minutos en tablet era demasiado para muchos estudiantes.
- **Glosario** junto a las abreviaturas:
  - eléctrica: mandante, vano, eje de la línea, servidumbre, acometida y catastro;
  - mecánica: mandante, muela, purga y horómetro.
- **Especialidades:** la versión eléctrica ofrecía también Mecánica y Gráfica en el selector; ahora solo Electricidad y Electrónica.

**Pendiente de decisión de Francisco**
- Mostrar o no una pauta de evaluación. Depende de si la clase suma a la nota.

**Validación**
- `audit-nm4-u3-class6` y el contrato de entrega (46 clases) aprobados.
- Playwright local de ambas versiones: ingreso, autoguardado, recarga, «Entrega confirmada», 409 tardío, solo lectura y panel. Sin desbordes en celular ni tablet.

---

## 2026-09-28, Interrogaciones: una grabación NM3 corregida y sincronización final con Lirmi

Se revisó una interrogación NM3 que estaba entregada con siete audios, pero aún
sin calificación. Los siete archivos decodificaron correctamente y tenían señal
audible. La corrección aplicó la pauta de exigencia 60/100, guardó siete
puntajes, siete síntesis de evidencia y una retroalimentación docente. La
relectura confirmó la nota calculada y el cambio de la grabación desde
`pendiente` a `calificada`.

El PDF de retroalimentación generado por la API se verificó como `%PDF`, una
página A4 de 595,28 × 841,89 puntos, con las siete filas, la nota y la
retroalimentación completas y sin cortes visibles.

La calificación se copió después a la celda vacía correspondiente de Lirmi y se
releyó. Durante el cruce final aparecieron cuatro calificaciones nuevas de NM4
en 4°A, creadas en paralelo desde el panel docente; también se copiaron a sus
cuatro celdas vacías sin sobrescribir valores anteriores. Una de esas notas
había sido cerrada en el panel con dos de siete posiciones puntuadas; se respetó
el valor final de la plataforma y no se recalculó ni completó por inferencia.

Estado final comparado por identidad, curso e instrumento: **286 notas en
Estudia CEST y 286 en Lirmi, 0 faltantes y 0 diferencias**. La auditoría
`npm run audit:interrogaciones` quedó aprobada.

## 2026-09-25, NM3 Clase 3: el docente elimina o reemplaza videos del plenario

Francisco preguntó si un estudiante puede borrar su video y subir una versión mejor. No podía: cada subida crea un archivo nuevo y las reglas de Storage prohíben borrar y modificar. Francisco decidió que él mismo borra o cambia los videos.

**Cómo quedó**
- **Sesión docente:** en el plenario (diapositiva I), el docente inicia sesión con su cuenta de administrador de Estudia CEST.
- **Botones:** con la sesión abierta, cada video muestra **Eliminar** y **Reemplazar**. Los estudiantes no ven esos botones.
- **Eliminar:** pide confirmación y borra en el servidor.
- **Reemplazar:** sube el archivo nuevo con los mismos datos del grupo (curso, tema, versión e integrantes, más `reemplazaA` en los metadatos). Solo después de que la subida termina bien, elimina el anterior. Si la subida falla, el video anterior no se toca.

**Servidor**
- `api/_videos-nm3.js`, servido por `api/odisea-cine.js?modulo=videos-nm3`, porque el tope es de 12 funciones.
- Verifica el token y que el usuario esté en `plataforma_estudiantes/admins`.
- Solo acepta rutas `videos_nm3/u3_clase3/{curso}/{archivo}`, sin subcarpetas ni `..`.
- Borra con el Admin SDK.
- Las reglas de Storage siguen sin permitir borrar desde el navegador.

**`storage.rules` del repositorio**
- Tenía dos `match` anidados y una línea repetida en el bloque de videos.
- Quedó un solo `match /videos_nm3/u3_clase3/{allPaths=**}`: lectura pública, creación de videos de hasta 1 GB, sin actualizar ni borrar.
- **No se desplegó a Firebase** (`npm run deploy:storage`): el comportamiento en producción ya funciona y esa publicación va aparte.

**Validación**
- Prueba del módulo del servidor:
  - sin token: 401;
  - ruta válida con administrador: se elimina;
  - ruta con `..` o fuera de la carpeta: 400.
- Prueba en navegador con sesión y Storage simulados:
  - sin sesión: 0 botones;
  - con sesión: 2 botones por video;
  - Eliminar envía la ruta correcta con Bearer;
  - Reemplazar sube primero y después borra el anterior;
  - 0 errores JS.
- Queda pendiente probar un borrado real con la cuenta de Francisco en producción.

---

## 2026-09-24, NM3 Clase 3: secuencia de inicio, desarrollo y cierre

Francisco pidió ordenar la clase para que tenga un inicio, un desarrollo y un cierre claros. No sabía si mostrar los videos al inicio o en el desarrollo.

Se decidió usar un solo video al inicio y los tres en el desarrollo:
- **Inicio:** el video del vlogger funciona como gancho, con preguntas abiertas: «¿le creerían?», «¿irían a la sala?», «¿y si lo contara el inspector?». No adelanta el análisis.
- **Desarrollo:** los tres videos, con su radiografía, sirven para modelar el análisis justo antes del rodaje.

Mostrar los tres al comienzo gastaba el modelado en los primeros minutos y dejaba el desarrollo repitiéndolo.

**Secuencia nueva:** portada + 10 diapositivas, 90 min. Cada fase muestra sus minutos en la etiqueta.
- **Inicio (15 min):**
  - A. Motivación, solo con el video del vlogger (5 min).
  - B. Objetivo (3 min).
  - C. Activación con las tres preguntas clave (7 min).
- **Desarrollo (55 min):**
  - D. Conceptos clave, se anotan en el cuaderno (8 min).
  - E. Modelado con los 3 videos y su radiografía (12 min).
  - F. Qué cambia y qué se mantiene, con los 4 datos (5 min).
  - G. Rodaje en terreno (25 min).
  - H. Carga del video (5 min).
- **Cierre (20 min):**
  - I. Plenario con los videos de los estudiantes (13 min).
  - J. Sistematización y ticket de salida (7 min).

**Otros cambios**
- La portada muestra la agenda por fase.
- Los conceptos clave pasaron del inicio al desarrollo.
- `u3-deck.js`, que se comparte con la Clase 2, no se tocó: cuenta las diapositivas solo.

**Validación**
- Recorrido con el botón «Siguiente» por las 11 pantallas: título y contador correctos.
- El video de la motivación reproduce el del vlogger; el selector del modelado alterna los tres videos.
- 0 errores JS y sin desborde en 390 px ni en 1440 px.

---

## 2026-09-24, NM3 Clase 3: limpieza de secciones duplicadas y exceso de videos

Francisco informó que en `/nm3/u3-clase3-enunciador-audiencia/` algunas secciones quedaron malas, duplicadas, con exceso de videos y sin sentido. Las ediciones sucesivas habían dejado dos versiones mezcladas en varias diapositivas.

**Diapositiva A (motivación)**
- La cita y la radiografía del video 1 aparecían dos veces, con `<div>` sin cerrar: las fichas 2 y 3 quedaban anidadas dentro de la primera.
- El reproductor cargaba dos `<source>` y dos `<track>`.
- Quedó una ficha por video. Las citas ahora son idénticas a la narración de HeyGen.

**Diapositiva B**
- El objetivo decía que se grababa solo la versión oficial o testigo, pero la actividad permite las tres. Quedó coherente.

**Diapositiva E**
- Tenía dos títulos, dos introducciones, dos encabezados de tabla y 6 filas contradictorias para 3 versiones.
- Quedó con un título, los 4 datos del hecho y una sola tabla de 3 filas.

**Coherencia de la actividad (E y F)**
- Los grupos graban sobre otro tema (baños, casino, gimnasio…), pero el plenario les pedía «conservar los 4 datos del hecho base» de la sala de lectura.
- Ahora cada grupo anota en el cuaderno los 4 datos de *su* tema antes de salir (E y F), y el plenario pregunta por esos datos.

**Diapositiva H (plenario)**
- Volvía a proyectar los 3 videos modelo con tarjetas y botones duplicados.
- Ahora muestra solo los videos de los estudiantes.
- El JS tenía un botón sin cerrar y líneas repetidas.

**Cursos**
- El formulario de carga y el filtro ofrecían 3°C, 3°E HC y 3°F HC, con especialidades no verificadas.
- Quedaron solo los cursos reales de NM3: 3°A, 3°B y 3°D TP. Se conservan las claves `3A_TP`, `3B_TP` y `3D_TP` de Storage.

**Otros**
- Las etiquetas del teléfono se acortaron (VLOG, TESTIGO, OFICIAL) porque quedaban bajo la muesca.

**Validación**
- 10 diapositivas con etiquetas balanceadas; las pestañas muestran una ficha y un video con una pista.
- 0 errores JS; sin desborde en 390 px ni en 1440 px. `npm run build` OK.

**Pendiente**
- En Storage, 3°A tiene dos archivos de prueba del desarrollo (`…_Oficial_video_prueba.mp4` y `test_….mp4`) que aparecen en el plenario. No se borraron: la eliminación es irreversible y requiere la decisión de Francisco.

---

## 2026-09-24, NM3 Clase 3: los tres videos modelo con voces de HeyGen

Francisco encontró que la narración de los videos de NM3 sonaba muy robótica. Venía de edge-tts: `es-CL-LorenzoNeural` y `es-CL-CatalinaNeural`. Comparó muestras de edge-tts, Kokoro y HeyGen. OpenAI quedó fuera porque la key no tiene saldo. Eligió estas voces de HeyGen:

- Situación 1 · vlogger: **Energetic Male 20s**.
- Situación 2 · testigo: **Trendy Influencer**. Es femenina porque la imagen muestra a una estudiante.
- Situación 3 · comunicado oficial: **Sarcastic LatAm Male**.

`scripts/build-nm3-u3-videos.py` se reescribió para producir los tres videos con el CLI `heygen` (locale `es-CL`).

- **Sincronía.** HeyGen devuelve el tiempo de cada palabra; con eso se calculan los cortes de cámara y los subtítulos. La alineación se hace por letras y descarta los marcadores `<start>` y `<end>` que agrega HeyGen.
- **Fallas.** Si HeyGen falla, se reintenta.
- **Subtítulos.** Ningún subtítulo se monta sobre el siguiente.
- **Error corregido.** El VTT de la Situación 1 tenía dos guiones superpuestos, uno antiguo y uno nuevo, y mostraba dos frases a la vez. Quedó uno solo.
- **Duraciones.** Situación 1: 29,4 s (antes 22,5). Situación 2: 18,4 s. Situación 3: 22,6 s.
- **Revisión.** Se revisó un cuadro por toma y el nivel de audio: media de −17 a −19 dB, sin saturar.

**HeyGen en este PC**
- El CLI de HeyGen tiene binario oficial para Windows, aunque su documentación diga que no; se verificó contra `checksums.txt`.
- Está instalado en `C:\Users\franc\bin\heygen.exe` (v0.8.1).
- Sesión OAuth con la cuenta gratuita de Francisco.

---

## 2026-09-24, Interrogaciones NM3 y NM4: opción de evaluación PIE

Alicia Aguilera, educadora diferencial, mandó dos listas de 25 preguntas, una por
libro, elegidas del banco oficial de 50 para evaluar a estudiantes PIE. Francisco
pidió que quedaran como opción en las dos interrogaciones y que se pudieran
cambiar sin límite durante la interrogación, como ya ocurre con el banco
completo.

**Cambio**

- Casilla `Evaluación PIE` en el paso 1 de `/nm3/interrogacion-un-lugar-sin-limites/calificar/`
  y `/nm4/interrogacion-mocha-dick/calificar/`, desmarcada por defecto y disponible
  en todos los paneles (`?docente=`).
- Con la casilla marcada, el sorteo de 7 y cada cambio de pregunta, manual o con
  audio, salen solo de las 25. Se muestra la redacción de Alicia, que en NM3
  simplifica varias preguntas; la referencia sigue siendo el número del banco y
  la pauta esperada es la misma.
- Selección NM3: 2, 3, 5, 6, 8, 9, 12, 13, 14, 15, 19, 22, 24, 25, 26, 27, 32,
  36, 40, 43, 44, 46, 47, 49 y 50. Selección NM4: 1, 3, 5, 6, 8, 10, 11, 13, 15,
  17, 20, 21, 22, 23, 25, 27, 28, 30, 33, 38, 40, 41, 43, 46 y 49.
- El registro guarda `bancoPie: true`; la tabla de notas lo marca `PIE` y
  `Editar respuestas` conserva la selección. El servidor rechaza con 400 una
  pregunta fuera de la selección al iniciar, cambiar, guardar o editar.

**Verificación**

- `npm run audit:interrogaciones`: aprobado, con la nueva comprobación de que la
  selección del panel y la de la API coinciden.
- Prueba local con la API real sobre un Firebase en memoria y Playwright, en los
  dos libros: 40 comprobaciones aprobadas (sorteo manual y con audio dentro de la
  selección, 15 cambios manuales y 6 con audio seguidos sin salir de ella, nota y
  grabación con `bancoPie`, rechazos del servidor, banco completo intacto sin la
  casilla, 0 errores JS y 390 px sin desborde).

---

## 2026-09-24, NM3: pauta Word para revisar y calificar el ensayo argumentativo

Se consolidó en un documento docente la evaluación aplicada al ensayo argumentativo de NM3. La pauta conserva la rúbrica original de 28 puntos y sus siete criterios con niveles 4, 3, 2 y 0; además incorpora la guía vigente para pasar el borrador en limpio y la clase histórica de conclusión.

**Archivo creado**

- `nm3/documentos-docente/Pauta_revision_y_calificacion_ensayo_argumentativo_NM3_CEST.docx`
- Tres páginas A4 apaisadas con insignia CEST y logo SDB: rúbrica analítica, hoja operativa de corrección y conversión completa a nota 1,0–7,0 con 60 % de exigencia.
- La revisión del formato comprueba título propio, texto continuo sin etiquetas de planificación, sangría, separación de párrafos, uso de renglones, partición silábica, legibilidad y corrección final.
- La calibración aclara que el respaldo podía ser inventado si era creíble y pertinente, que no se evalúa la cantidad de páginas y que laboriosidad depende del registro de clases, no del aspecto del producto final.

**Verificación**

- Validación estructural DOCX: aprobada.
- Apertura con Microsoft Word y exportación a PDF: tres páginas A4, encabezados y pies repetidos, sin cortes ni desbordes.
- Extracción completa con Pandoc: sin campos vacíos accidentales ni texto de plantilla.
- `npm run build`: aprobado con 250 recursos críticos.
- Commit del documento: `a26b8610`.

No se modificó ni desplegó la plataforma: es un documento docente no enlazado desde el sitio.

## 2026-09-23, NM4 Clase 6: las dos versiones verificadas en producción

La Clase 6 quedó en producción con el deploy del calendario NM4 (`bdf78121`/`49c9b62f`). Ese deploy incluyó el commit `cb993ddf`, así que no se hizo un deploy aparte.

Verificado contra Firebase real:
- Las rutas y la API responden 200. `health`: eléctrica con 85 estudiantes (4°C y 4°E) y mecánica con 88 (4°A y 4°B).
- Con el RUT de prueba 11.111.111-1, en las dos versiones: autoguardado, recarga con datos, «Entrega confirmada», solo lectura al reabrir y 0 errores JS.
- La separación de cursos funciona en ambos sentidos, probada con RUN reales de 4°B y 4°E sin imprimirlos: responde 403 con el enlace al informe correcto.

El registro PRUEBA quedó entregado en ambas versiones; se reabre desde `/revisar/`. Se avisó a la sesión que ordena `/nm4/` que conserve el bloque de la tarjeta 6.

---

## 2026-09-23, NM4: informe técnico habilitado desde ahora

Francisco pidió conservar el calendario ordenado y dejar disponible de inmediato el informe técnico ya creado.

**Cambio publicado**

- La entrevista de trabajo quedó como clase anterior.
- El informe técnico quedó como actividad actual, con el aviso `Disponible ahora`.
- Se eliminó el bloqueo que ocultaba los accesos hasta el 28 de septiembre.
- Quedaron visibles los cuatro accesos: clase e informe para Electricidad/Electrónica y para Mecánica.
- Las fechas del calendario no cambiaron.

**Verificación**

- Auditorías NM4 de las clases 5 y 6: aprobadas.
- `npm run build`: aprobado, con 250 recursos críticos.
- Portada revisada en 390 px y 1440 px, sin desborde.
- Las dos clases y los dos informes responden en producción; ambos informes muestran el ingreso por RUT.
- Producción revisada en `https://www.estudiacest.com/nm4/#u3-clases`.
- Commit funcional: `dca48124`.

---

## 2026-09-23, NM4: calendario de cierre ordenado y publicado

Francisco corrigió las fechas de la Unidad 3. La portada tenía un bloque de cierre que repetía información e incluía actividades que no estaban confirmadas.

**Calendario publicado**

- 22 de septiembre: entrevista de trabajo.
- 28 de septiembre: informe técnico.
- 5, 12 y 19 de octubre: fechas reservadas, todavía por planificar.
- 26 y 27 de octubre: revisión de cuaderno.
- 2 y 9 de noviembre: trabajo PAES.

Se eliminó el bloque contradictorio y sus estilos sin uso. La portada quedó con una sola secuencia de 13 tarjetas y explicaciones breves. Las fechas no planificadas no incluyen contenido inventado.

**Verificación**

- Auditoría NM4 Clase 5: aprobada.
- `npm run build`: aprobado, con 250 recursos críticos.
- Móvil de 390 px y escritorio de 1440 px: sin desborde horizontal.
- Producción revisada en `https://www.estudiacest.com/nm4/#u3-clases`: 13 tarjetas, fechas correctas, dos enlaces PAES y sin el bloque antiguo.
- Commit funcional: `bdf78121`.

---

## 2026-09-23, NM4 Clase 6: versión mecánica del informe técnico para 4°A y 4°B

Francisco decidió que el informe de la línea de 500 kV queda para 4°C (Electricidad) y 4°E (Electrónica). Para 4°A (Mecánica Industrial) y 4°B (Mecánica Automotriz) se pidió otra versión, porque ese caso no les sirve.

**Rutas nuevas**
- `/nm4/u3-clase6-informe-mecanica/`: 14 pantallas, 90 minutos. Mantiene el lenguaje simple de la versión eléctrica.
- `/nm4/u3-clase6-informe-mecanica/informe/`: 12 páginas, 27 campos.
- `/nm4/u3-clase6-informe-mecanica/revisar/`: panel docente.

**El caso**
- Inspección de seguridad y mantenimiento del taller de una planta procesadora de fruta del Maule (ficticia), antes de la temporada.
- Equipos: esmeril EB-01, compresor CP-01, elevador de dos columnas EL-01, extintor EX-02 y grúa horquilla GH-02. La grúa queda como hallazgo de conformidad.
- Inventario con cálculo de la próxima mantención: CP-01 venció el 10-09.
- Plano con ejes A–E × 1–4 en vez de coordenadas UTM.
- Hallazgos:
  - H1 (esmeril) redactado como modelo.
  - H2 (extintor obstruido) a medio completar.
  - H3 lo elige el estudiante según su especialidad: CP-01 para Industrial, EL-01 para Automotriz.
- Fotos ilustrativas de Wikimedia Commons con licencia libre. Los créditos están en `assets/fotos.js`.

**Criterios verificados en la fuente**
- DS 594: arts. 7, 38, 47 y 53.
- DS 44/2024: art. 10, vigente desde el 1-feb-2025.
- DFL 1/2007: art. 12, licencia clase D.

**Sin cifra oficial chilena** (se citan como referencia internacional, y así se declara)
- Los 3 mm y 6 mm del esmeril: OSHA 1910.215.
- Compresor: OSHA 1910.169. El DS 10/2012 no aplica, porque solo cubre vapor.
- Elevador: ALI y HSE HSG261.

**API**
- `api/_informe-tecnico-nm4.js` ahora tiene versiones (`?version=electrica|mecanica`).
- Cursos por versión:
  - eléctrica: 4CTP, 4ETP y PRUEBA;
  - mecánica: 4ATP, 4BTP y PRUEBA.
- Un RUT de otro curso recibe 403 con el enlace a su propio informe. Probado en ambos sentidos con RUN reales, sin imprimirlos.
- Datos en `plataforma_nm4/informe_mecanica_2026/{curso}/{n}`.
- El 4°D no entra en ninguna versión: sigue con el Anuario.

**Tarjeta 6 del portal**
- Ofrece las dos versiones por curso.
- Solo se confirmó ese bloque de la tarjeta. La reorganización cronológica de `nm4/index.html` y de `audit-nm4-u3-class5.js` que otro agente tenía en curso se dejó sin tocar en su copia de trabajo.

**Validación**
- `audit-nm4-u3-class6` cubre las dos versiones.
- Contrato de entrega: 46 clases. `npm run build`: 250 recursos.
- Playwright local con base en memoria: ingreso, autoguardado, recarga, entrega confirmada, 409 tardío, solo lectura y panel.
- Sin desbordes en 390 px ni en tablet.
- Deploy pendiente de autorización.

---

## 2026-09-23, auditoría de la Clase 6 NM4: lenguaje simple y publicación pendiente

Se revisó la Clase 6 y el informe técnico después de que Francisco advirtiera que la experiencia se había roto y que las explicaciones eran demasiado complejas.

**Causa comprobada del quiebre en producción**

- La presentación publicada sí coincidía con la fuente, pero `informe/index.html`, `informe/informe.js` e `informe/informe.css` seguían en una versión anterior.
- El RUT ficticio de prueba devolvía 404 en producción. Por eso la validación descrita en la entrada anterior no representaba lo que realmente recibía el estudiante.
- La publicación final del commit `477117bc` no había quedado documentada ni verificada por comparación de archivos.

**Mejoras confirmadas en el commit `d7340eef`**

- Se simplificaron el objetivo, la definición, los ejemplos y las instrucciones. El informe ahora se explica con tres preguntas: qué se observó, con qué regla se comparó y qué se recomienda.
- Las doce partes se agruparon en cuatro bloques: identificación, propósito, evidencia y decisión.
- Se reemplazó jerga innecesaria por indicaciones directas y se acortaron ayudas, lista de revisión, mensajes de guardado y nombres de páginas.
- En celular, el índice de trece páginas pasó a una fila horizontal compacta para que el informe aparezca antes y no quede empujado hacia abajo.

**Validación local**

- `npm run audit:nm4-u3-class6`: aprobado antes de la aparición del cambio concurrente.
- `npm run build`: aprobado, con 245 recursos críticos.
- Navegador real: 14 pantallas sin recortes en 1440 × 900; navegación completa y sin errores; sin desborde horizontal en 390 px.
- Informe: 13 páginas, 27 campos, índice móvil compacto y autoguardado comprobado con servidor simulado.

**Publicación pendiente.** El commit `d7340eef` está en `origin/main`, pero no se ejecutó el deploy. Durante esta auditoría apareció otro trabajo activo y sin commit para una variante mecánica del mismo informe. Ese trabajo modifica la API y las rutas compartidas, y su propia auditoría todavía falla porque faltan cuatro imágenes y `fotos.js`. El guard de publicación debe seguir bloqueando hasta que ese cambio quede completo y confirmado. Después corresponde ejecutar nuevamente `npm run build`, `npm run deploy:prod:safe` y repetir en producción el ingreso con el RUT ficticio, el autoguardado y la comparación de archivos.

---

## 2026-09-23, NM4 Unidad 3 Clase 6: el informe técnico, método de caso con informe prediseñado en tablet

Pedido de Francisco: la Clase 6 del lunes 28 de septiembre (4°D martes 29) es la del informe técnico. Primero se explica qué es un informe con el método de caso de un informe de auditoría o inspección, usando como referencia los informes que se hicieron para Celeo desde REC. Después, en la tablet, los estudiantes completan un informe prediseñado con páginas: algunas partes listas y otras por redactar. Tablas, imágenes y fotos georreferenciadas incluidas. Los de NM4 no tienen cuenta, así que ingresan con su RUT.

**Rutas nuevas**
- `/nm4/u3-clase6-informe-tecnico/`: presentación de 14 pantallas, 90 minutos.
- `/nm4/u3-clase6-informe-tecnico/informe/`: informe de 13 páginas con 27 campos. Ingreso con RUT, autoguardado en cola, libreta de terreno informal y entrega.
- `/nm4/u3-clase6-informe-tecnico/revisar/`: panel docente con login de administrador de Firebase. Filtra por curso, muestra el informe tal como se entregó, imprime y reabre sin borrar lo escrito.

**El caso.** Se usa la estructura del levantamiento real de construcciones bajo la línea de 500 kV Charrúa–Ancoa, hecho para Celeo desde REC: ficha por sector, tabla de estructuras con UTM, registro fotográfico georreferenciado con ficha por foto, catastro, conclusiones y anexos. Empresas, estructuras, ocupaciones y libreta son ficticias, y la página lo declara. No se publicaron fotos ni datos del informe real, porque muestran viviendas de particulares. Solo aparecen cifras generales en una diapositiva: 19 sectores, 1.940 m², 0,90 m y 280 páginas. Las fotos 1 y 2 son reales de Wikimedia Commons, tomadas en Charrúa, con sus coordenadas reales convertidas a UTM 18H. Las fotos 3 y 4 son ilustrativas. Todas tienen licencia CC y crédito en el anexo. Nano Banana no se usó: la cuenta prepago está sin saldo (429).

**Fuentes verificadas en el anexo**
- Pliego RPTD N.º 07 de la SEC, numerales 3.2, 4.9 y 4.13.
- DFL 4, art. 57.
- SMA, Res. Ex. 2.875/2025 (WGS-84 y huso).
- CAIGG, Documento Técnico N.º 85 (condición, criterio, causa, efecto y recomendación).
- ISO 19011:2018, apartado 3.10.
- Enlace al informe público de auditoría técnica de la S/E Valdivia (Coordinador Eléctrico Nacional).

**Técnica**
- API sin función nueva, por el tope de 12 del plan Hobby. `api/economista.js` deriva a `api/_informe-tecnico-nm4.js` cuando llega `?modulo=informe-tecnico`.
- El RUN viaja solo en el cuerpo del POST y no se guarda en ninguna parte. `api/_roster_nm4_informe.js` tiene únicamente el hash SHA-256 del RUN, además de curso, número de lista y nombre. Son 200 estudiantes vigentes, sin retirados, más la identidad ficticia `PRUEBA` (RUT 11.111.111-1) para verificar.
- Datos en `plataforma_nm4/informe_tecnico_2026/{curso}/{n}`. La entrega es una transacción que escribe juntos `submitted` y `completada` con sus timestamps, `score` (partes completas) y `total` (27). Un borrador tardío recibe 409 y no revierte la entrega.
- Los campos se definen en un solo archivo, `informe/campos.js`, que comparten la página, el panel y el servidor.
- La tarjeta 6 de `/nm4/` se abre sola el 28-09 (hora de Chile) y pasa la 5 a «Clase anterior».
- Quedó registrada en `class-submission-contract.json`, en el manifiesto (con `allowMissingInProduction` en el primer deploy) y en el build, con `scripts/audit-nm4-u3-class6.js`.

**Validación**
- Auditoría propia OK. `verify:class-submission` OK (45 clases). `npm run build` OK (245 recursos).
- Playwright local con la lógica real del servidor sobre una base en memoria:
  - rechaza un RUT ajeno;
  - confirma el nombre;
  - autoguarda y recupera tras recargar;
  - la entrega muestra «Entrega confirmada»;
  - el registro queda completo;
  - el borrador tardío recibe 409;
  - el informe reabierto queda en solo lectura;
  - el panel lista y muestra el informe.
- Sin desborde en 390 px, 820 px (tablet) ni 1920 px. Presentación sin scroll interno en escritorio.

**Incidente.** Durante el trabajo, otro proceso hizo `git stash` («WIP: NM4 clase 6 informe tecnico»). Ese stash se llevó también cambios ajenos que no se tocaron: `LIRMI_UPLOAD.md`, `css/tw.css`, `lirmi_upload_notes.js`, `package.json` de la raíz y `test-results/`. De ahí se recuperaron solo los archivos de esta clase. Esos cambios ajenos siguen guardados en `stash@{0}` y los debe recuperar quien los estaba haciendo.

---

## 2026-09-23, NM3 Unidad 3 Clase 3: 3 videos modelo reproducibles, rodaje con 5 temas escolares y plenario interactivo

- Por requerimiento de Francisco se actualizó integralmente la Clase 3 de 3° Medio («Quién habla y para quién», `nm3/u3-clase3-enunciador-audiencia/index.html`):
  1. **Los 3 videos de ejemplo en la motivación (Slide 1):**
     - Se generaron los 3 videos modelados con cortes dinámicos, uniforme oficial de Salesianos Talca (vestón azul marino con insignia bordada, corbata, suéter y pantalón gris) y locución chilena natural (`es-CL-LorenzoNeural` y `es-CL-CatalinaNeural`) a 720x1280 (30 fps) con subtítulos WebVTT y pósters correspondientes:
       - **Modelo 1 (Vlogger Escolar):** Multicámara estilo Reels/TikTok (`video-situacion1-vlogger.mp4`, 22 seg), lenguaje juvenil coloquial («cabros», «bacán») y B-roll de la sala.
       - **Modelo 2 (Estudiante Testigo):** Plano medio íntimo en sillón puff del CRA (`video-situacion2-testigo.mp4`, 19 seg), tono reflexivo y vivencial («por fin un lugar sin bulla»).
       - **Modelo 3 (Comunicado Oficial):** Plano formal en pasillo de Inspectoría General (`video-situacion3-oficial.mp4`, 21 seg), tono institucional, solemne y protocolar.
     - Switcher interactivo de pestañas en Slide 1 (`#tab-btn-1`, `#tab-btn-2`, `#tab-btn-3`) que actualiza dinámicamente el reproductor de video en el smartphone mockup, la etiqueta en vivo y la radiografía del enunciador correspondiente.
  2. **Rodaje en terreno con los 5 temas escolares (Slide 6):**
     - Cada grupo (individual, parejas o tríos) elige **1 de los 5 temas del colegio**:
       - 1. 🚽 **Baños:** Higiene, insumos (jabón y toallas) y cuidado de instalaciones.
       - 2. 🍲 **JUNAEB:** Casino escolar, horarios de almuerzo y convivencia en el comedor.
       - 3. 🏀 **Gimnasio:** Canchas techadas en recreos, préstamo de balones y deportes.
       - 4. ⚙️ **Talleres General:** Seguridad TP, EPP obligatorio, herramientas y pañol.
       - 5. 🤝 **PIE:** Inclusión escolar, sala de apoyo, tutorías y empatía.
     - Y eligen **1 de las 3 versiones de enunciador** (Oficial, Vlogger o Testigo) para grabar un video de 15 a 45 segundos en terreno escolar durante 20 minutos.
  3. **Módulo de subida de video grupal (Slide 7):**
     - Admite grabaciones de hasta 1 GB (1024 MB) en MP4/MOV/WEBM.
     - Selector de tema (`tema-select`) y de versión (`version-select`).
     - Almacenamiento directo en Firebase Storage (`videos_nm3/u3_clase3/{curso}/{timestamp}__{tema}__{version}__{integrantes}__{safeName}`) con metadata personalizada y retroalimentación inmediata.
  4. **Plenario Docente en vivo (Slide 8):**
     - Dispone desde el primer instante de los **3 modelos base** listos para ser proyectados en pantalla completa en el proyector del aula.
     - Renderiza en tiempo real los videos recibidos de los estudiantes mostrando el badge verde de tema (`badge-tema`), el badge de versión y el botón de proyección directa.
  5. **Verificación técnica:**
     - `npm run build`: APROBADO (27 auditorías pasando, 237 recursos críticos presentes).
     - Validación Playwright completa en servidor local: 10 diapositivas, navegación limpia, cambio de pestañas de video y sin errores de consola.
     - Cumplimiento de diseño responsive sin desbordes horizontales en 390px y 1440px.

---

## 2026-09-23, NM4: planificación de cierre, 4 tareas de octubre y semanas PAES de noviembre

- Solicitud de Francisco: en NM4 figuraba una sola tarjeta disponible para los estudiantes; restan 4 tareas evaluativas para el cierre de año y en noviembre las semanas 1 y 2 se destinan íntegra y exclusivamente para Ensayos PAES de Competencia Lectora.
- Se diseñó y desplegó en el portal de NM4 (`nm4/index.html`) una sección destacada con la hoja de ruta completa para 4°A, 4°B, 4°C, 4°D y 4°E:
  - **Banner PAES Noviembre:**
    - Semana 1 (2 al 6 de noviembre): Ensayo Intensivo 1 · Rastreo e Interpretación (65 preguntas, taller de distractores DEMRE).
    - Semana 2 (9 al 13 de noviembre): Ensayo Intensivo 2 · Simulación Oficial de Egreso (gestión de tiempo, evaluación y reflexión crítica, cierre definitivo de actas y notas en Lirmi antes de la Licenciatura).
    - Botón de acceso directo hacia `/paes/`.
  - **Las 4 Tareas Evaluativas de Cierre (Octubre):**
    - Tarea 1 (28 sep al 5 oct / 4°D 29 sep al 6 oct): Escribir en el trabajo (correo formal, solicitud y reporte de faena) + Revisión y timbre puesto por puesto de las 6 evidencias de la Unidad 3 en el cuaderno. (Para 4°D: mesa editorial y cierre de inventario de páginas del Anuario).
    - Tarea 2 (Lunes 19 de octubre, feriado 12-oct trasladado; 4°D martes 13-oct versión digital 2): Informe Técnico de Especialidad TP (diagnóstico, procedimiento seguro, normativa y propuesta técnica).
    - Tarea 3 (Lunes 26 de octubre; 4°D martes 27-oct): Plan Lector · «Camanchaca» de Diego Zúñiga (guía de análisis e interpretación literaria).
    - Tarea 4 (26 al 31 de octubre; 4°D martes 27-oct): Portafolio de Inserción Laboral / Cierre NM4 (CV técnico definitivo, autoevaluación STAR y síntesis de seguridad; para 4°D: entrega obligatoria del ejemplar físico del Anuario al profesor).
- Validación y preservación:
  - La grilla `<div class="u3-grid">` de la Unidad 3 conserva sus 8 tarjetas y una sola activa para estricto cumplimiento de `scripts/audit-nm4-u3-class5.js`.
  - `node scripts/audit-nm4-u3-class5.js`: APROBADO.
  - `npm run build`: APROBADO (27 auditorías y 237 recursos críticos verificados).
  - Playwright: 0 desbordes horizontales comprobados en 390px (móvil) y 1440px (escritorio).

---

## 2026-09-23, NM3 Unidad 3 Clase 3: reestructuración pedagógica canónica e ilustraciones IA
## 2026-09-23, NM3 Unidad 3 Clase 3: taller audiovisual «1 hecho, 3 versiones», video modelo Salesianos Talca y carga de hasta 1 GB
## 2026-09-23, NM3 Unidad 3 Clase 3: video multicámara con jump-cuts, voz humanizada y panel docente en vivo

- Reestructuración completa de la presentación de la Clase 3 («Quién habla y para quién») siguiendo la estructura pedagógica de aula:
  - INICIO: Motivación con 3 publicaciones de redes sociales ilustradas con imágenes IA (cuenta personal, creador de contenido y comunicado institucional), Presentación de objetivo de clase limpio, Activación de conocimientos previos con tres preguntas clave («¿Quién habla?», «¿A quién se dirige?», «¿Qué espera que ocurra?») y Conceptos clave (Autor real, Enunciador, Audiencia, Propósito, Registro) con etiqueta destacada «Anotar en el cuaderno».
  - DESARROLLO: Explicación de la actividad con ejemplo modelado de muestra técnica escolar (4 datos objetivos invariables) y actividad en parejas con matriz para el cuaderno y pauta de monitoreo docente.
  - CIERRE: Revisión en parejas mediante prueba a ciegas con justificación de 2 marcas lingüísticas, retroalimentación en plenario y sistematización con transferencia laboral técnica (diferenciación de registro con compañeros de faena, clientes y jefatura técnica) con ticket de salida de 3 líneas.
- Generadas e integradas 3 imágenes fotográficas de alta resolución con IA para las publicaciones de la motivación en `nm3/u3-clase3-enunciador-audiencia/img/`.
- Verificación: `npm run build` aprobado sin errores, pruebas visuales en 1440x900 y 390x844 (móvil) con 0 desbordes horizontales comprobados.
- Transformación de la Clase 3 («Quién habla y para quién») en un taller audiovisual dinámico e interactivo:
  - **INICIO:**
    - **A. Motivación (Situación 1 lista):** Video vertical estilo vlog grabado por un estudiante vistiendo el uniforme fidedigno del Colegio Salesianos Talca (vestón azul marino con escudo bordado TALCA ST, corbata y pantalón gris marengo en el patio del colegio), con voz chilena natural (`es-CL-LorenzoNeural`), subtítulos WebVTT y reproductor en mockup de smartphone (`video-situacion1-vlogger.mp4`, poster y track VTT).
    - **B. Objetivo:** Analizar la construcción del enunciador y registrar versiones contrastantes.
    - **C. Activación:** Tres preguntas clave ante cualquier mensaje («¿Quién habla?», «¿A quién se dirige?», «¿Qué espera que ocurra?»).
    - **D. Conceptos clave:** Autor real, Enunciador, Audiencia, Propósito, Registro con etiqueta «📓 Anotar en el cuaderno».
  - **DESARROLLO:**
    - **Explicación y modelamiento:** Hecho base invariable escolar (apertura de la sala de lectura en el 2° piso, lunes, para toda la comunidad).
    - **Actividad de rodaje en terreno:** Trabajo individual, en parejas o tríos (máximo 3). Salida de 20 min por el colegio a grabar la Versión Oficial (Director/Inspector) o la Versión Testigo (vivencial/compañero) en videos breves de 15 a 45 segundos.
    - **Módulo de carga de video:** Componente interactivo que soporta archivos de hasta 1 GB (1024 MB) para grabaciones en 4K/1080p, con subida directa y fragmentada a Firebase Storage (`videos_nm3/u3_clase3/{curso}/{timestamp}_{version}_{safeFileName}`), barra de progreso en tiempo real con % y MB transferidos, y vista previa inmediata.
  - **CIERRE:**
    - **Plenario con proyector en vivo:** Visor dinámico que lista los videos subidos por los cursos y permite proyectarlos a pantalla completa en la pizarra del aula para la retroalimentación del grupo.
    - **Sistematización laboral:** Transferencia al entorno técnico profesional (diferenciación de registro con compañeros en faena, clientes y jefatura/orden de trabajo) y ticket de salida de 3 líneas para timbre en el cuaderno.
- **Firebase Storage:** Reglas actualizadas y desplegadas exitosamente (`npm run deploy:storage`) habilitando `videos_nm3/u3_clase3/{curso}/{fileName}` con límite de 1 GB y validación de tipo de contenido `video/*`.
- **Video multicámara dinámico del Vlogger escolar (Situación 1):**
  - Superada la toma fija: compilado video vertical en 4 planos reales con jump-cuts estilo TikTok/Reels:
    1. Plano 1 (0.0s - 4.0s): Estudiante saludando a la cámara con la mano y sonrisa enérgica (`vlogger-saludo.jpg`).
    2. Plano 2 (4.0s - 9.5s): Salto a plano medio señalando con el dedo hacia el segundo piso (`vlogger-senala.jpg`).
    3. Plano 3 (9.5s - 14.5s): Inserto dinámico / B-roll cinematográfico de la sala de lectura con libros y sillones.
    4. Plano 4 (14.5s - 22.5s): Cierre en primer plano con gesto de pulgar arriba y guiño de complicidad (`vlogger-pulgar.jpg`).
  - Audio humanizado con cadencia juvenil, pausas naturales de respiración y modismos chilenos («¡Buena, cabros de Salesianos! ... ¿Vale la pena? ¡La recorrí completa y quedó bacán! ... ¡Nos vemos!»). Subtítulos WebVTT sincronizados a cada frase.
- **Panel Docente en tiempo real (Diapositiva 8 - Plenario):**
  - Integrada consulta asíncrona a Firebase Storage mediante prefijo de curso (`videos_nm3/u3_clase3/{curso}/`).
  - El profesor en el proyector del aula selecciona el curso (`3°A TP`, `3°B TP`, etc.) y la plataforma carga al instante todos los videos enviados por los estudiantes desde sus celulares, mostrando nombres de integrantes, versión, hora y tamaño en MB.
  - Botón de proyección con pantalla completa inmediata para debate en plenario con todo el curso.
- **Firebase Storage:** Reglas actualizadas y desplegadas exitosamente (`npm run deploy:storage`) habilitando `videos_nm3/u3_clase3/{allPaths=**}` con límite de 1 GB, lectura pública y consulta de listado para el panel docente.
- **Verificación:** `npm run build` aprobado sin errores (26 auditorías pasando), prueba de subida de video verificada en producción (200 OK con URL pública generada).

---

## 2026-09-22, interrogaciones NM3 y NM4: cambio de pregunta sin tope

Francisco pidió que el cambio de pregunta en `/nm3/interrogacion-un-lugar-sin-limites/calificar/`
deje de estar limitado a una vez. Como NM3 y NM4 comparten API y controlador, el cambio aplica a
las dos interrogaciones.

- `api/interrogacion.js`: `cambiar-pregunta-grabacion` ya no rechaza el segundo cambio. Sigue
  rechazando una pregunta repetida y el cambio de una posición que ya empezó a grabarse. El
  registro suma `cambiosPregunta` y guarda `descartadas`; `cambiada` conserva la última posición
  cambiada, por compatibilidad. La edición de una nota en vivo ya no exige que difiera una sola
  pregunta.
- `assets/interrogacion-audio.js` y los dos paneles `calificar/`: el botón queda siempre
  disponible antes de grabar, y el sorteo evita las preguntas descartadas mientras quede otra.
- `REGLAS.md` y `scripts/audit-interrogaciones.js` quedaron con la regla nueva.
  `node scripts/audit-interrogaciones.js` pasa.

## 2026-09-22, NM4 Unidad 3 Clase 5: retiro del video generado

- Por indicación de Francisco se retiró la recreación audiovisual creada para
  la entrevista laboral: pantalla, MP4, subtítulos, póster, guion generado y
  script de construcción. También se quitaron sus entradas del manifiesto.
- La entrevista escrita de 16 intercambios permanece como lectura dramatizada
  en parejas (6 min) y análisis (9 min). La clase pasa a 19 pantallas y conserva
  los 90 minutos, los seis casos y el video de Comedy Central en la motivación.
- Auditoría focal y `npm run build` aprobados. Navegación de los seis casos y
  ausencia de desborde comprobadas en 390, 1440 y 3840 px. Commit `28fac78f`
  enviado a `origin/main`; deploy seguro `dpl_CCzcQ6stcdPmA7maxVxtJzsXcsBm`
  en estado `READY`. El HTML público coincide en SHA-256 con la fuente local;
  MP4, VTT y póster retirados responden HTTP 404 en producción.

---

## 2026-09-22, NM4 Unidad 3 Clase 5: motivación, entrevista y casos TP

- Se incorporó en la motivación el video «Entrevista Laboral - Presta a la
  Comedy Central» (3 min 26 s) mediante portada y enlace directo a YouTube.
  La reproducción incrustada mostró «video no disponible» en la prueba real;
  el enlace directo evita dejar un reproductor fallido en la clase.
- El guion y el video de entrevista modelo ahora tienen 16 preguntas y
  respuestas (5 min 24 s). Se añadieron fortaleza con ejemplo, aspecto por
  mejorar, pretensiones de sueldo y una respuesta honesta sobre experiencia
  de taller sin presentarla como empleo formal. Se regeneraron MP4, VTT,
  guion y póster desde `scripts/build-nm4-u3-class5-video.py`.
- Electricidad suma un caso de circuito de mando y retención de motor,
  alineado con el módulo 05 de 4° medio TP; Electrónica suma diagnóstico de
  sensor digital y entrada PLC, alineado con el módulo 06. La práctica en
  parejas exige dos rondas, cambio de roles, repregunta, evidencia, comentario
  del compañero y revisión individual. La secuencia tiene 20 pantallas y
  conserva 90 minutos.
- Auditoría focal, `npm run build` y prueba de navegación en 390, 1440 y
  3840 px aprobadas. La portada del video, HTML, VTT y MP4 públicos tienen
  SHA-256 idéntico al archivo local. Commit `6fc7239b` enviado a `origin/main`.
  Deploy seguro `dpl_9Q4HnkaTvHrS6bbniPv3zjV1TjAe` en estado `READY`,
  alias `https://www.estudiacest.com/nm4/u3-clase5-entrevista-laboral/` activo.

---

## 2026-09-21, NM4 Unidad 3 Clase 5: video de entrevista completa

- Se publicó una recreación audiovisual de los 13 intercambios de la entrevista
  para ayudante de mantenimiento. Aparecen dos hombres reales en una toma de
  archivo; el entrevistador y el postulante tienen voces sintéticas masculinas
  diferenciadas. La pantalla, el guion y la clase avisan que los actores no
  pronunciaron esas palabras. Duración: 4 min 27 s, con texto en pantalla y
  subtítulos VTT opcionales.
- La toma procede de
  https://mixkit.co/free-stock-video/two-office-men-approving-data-with-a-handshake-30010/
  y su página indica licencia Mixkit Stock Video Free para uso personal o
  comercial. El guion completo se lee de la clase al construir el video; el
  script reproducible es `scripts/build-nm4-u3-class5-video.py`.
- La secuencia ahora tiene 18 pantallas: video primero, cuatro pantallas de
  transcripción y análisis después. El bloque conjunto conserva 15 minutos y
  la clase completa, 90 minutos. Los cuatro saltos a casos y el paso al trabajo
  en cuaderno se actualizaron; al avanzar, la reproducción se pausa.
- `node scripts/audit-nm4-u3-class5.js` y `npm run build` aprobados. El MP4 se
  audita como contenedor H.264/AAC de 267 segundos sin depender de `ffprobe` en
  Vercel. Prueba local en celular, escritorio y 4K: sin errores de página ni
  desborde; reproducción y pausa al avanzar comprobadas.
- Commits `7c403ec1` y `6cb8b111` enviados a `origin/main`. Deploy seguro
  `dpl_B2cWVKGeBW9VxMbHod6ce3GhKoBE` en estado `READY`, alias público activo.
  La clase, el MP4, el VTT y la portada devolvieron HTTP 200 y SHA-256 idéntico
  a la fuente publicada. La ruta pública cargó el video y mostró 7/18 en móvil.

---

## 2026-09-21, interrogaciones NM3 y NM4: los retirados salen de la lista

- Los paneles de calificación ofrecían para interrogar a estudiantes que ya no
  están en el colegio, porque la nómina de esta plataforma es estática y no
  conoce los retiros del libro de clases.
- Se agrega `api/_retirados.js` con los retiros informados por el libro (campo
  `fecha_retiro` de la matrícula). De los once retiros vigentes en los ocho
  cursos, **cuatro** aparecían en estas nóminas: dos en 4°B TP, uno en 3°B y uno
  en 3°D. Los otros siete no figuran en los rosters y nunca se ofrecían.
- **No se elimina ninguna fila del roster.** El identificador de cada estudiante
  se calcula con su número de lista, así que borrar una correría a las
  siguientes y dejaría huérfanas sus calificaciones. La acción `nomina` marca
  `retirado: true` y los paneles no los listan; si alguno tuviera nota, se
  sigue viendo.
- El servidor también los rechaza: `iniciar-grabacion` y `guardar-nota-manual`
  responden 409 para un estudiante retirado, de modo que la restricción no
  depende del navegador.
- El contador de la nómina informa cuántos quedaron fuera por retiro, para que
  la diferencia entre el curso y la lista sea visible y no parezca un error.
- Archivos: `api/_retirados.js` (nuevo), `api/interrogacion.js`,
  `nm3/interrogacion-un-lugar-sin-limites/calificar/index.html`,
  `nm4/interrogacion-mocha-dick/calificar/index.html`.
- Validaciones: `npm run audit:interrogaciones` y `npm run build` aprobados;
  ocho comprobaciones de la función de retiro, incluidas tildes y un curso que
  no corresponde.
- Commit `a91d97f5` en `origin/main`. **Deploy pendiente**: el entorno del
  agente bloqueó `npm run deploy:prod:safe`, así que el cambio está en la
  fuente pero todavía no en producción. Hasta que se despliegue, los paneles
  siguen ofreciendo a los cuatro retirados.

## 2026-09-21, NM4 Unidad 3 Clase 5: entrevista laboral completa

- Por solicitud de Francisco, la clase incorpora una entrevista ficticia completa
  para un cargo inicial de mantenimiento: presentación, experiencia de taller,
  repregunta sobre el aporte propio, seguridad, error y aprendizaje, trabajo en
  equipo, presión de plazo, preguntas del postulante y despedida. Son 13
  intervenciones con respuesta, distribuidas en cuatro pantallas nuevas.
- La secuencia conserva los cuatro casos por especialidad y el producto en
  cuaderno. Ahora tiene 17 pantallas; la lectura guiada ocupa 15 minutos y el
  trabajo individual/en pareja 30. Los tiempos visibles suman 90 minutos.
- `scripts/audit-nm4-u3-class5.js` comprueba diálogo, navegación, contador y
  tiempo. Auditoría focalizada y `npm run build` aprobados. En navegador local:
  lectura y navegación correctas en celular, escritorio y 4K, sin desborde
  horizontal ni errores de consola; el salto del caso al trabajo llega a 16/17.
- Commit `7114c646` enviado a `origin/main`. Deploy seguro
  `dpl_BNSPh5oNaq5sh2vz56JoboL555wG` en estado `READY` y alias público activo.
  La URL pública devolvió HTTP 200; el SHA-256 del HTML coincide exactamente
  con la fuente local publicada (17 pantallas y 13 intercambios comprobados).

---

## 2026-09-21, 4°D TP: plantilla e ilustraciones publicadas

- Commit de contenido `abbd02cd`, enviado a `origin/main`. Deploy seguro
  `dpl_HTjtQAaCJQWH4xZ45pvmJ57GEkJc`, estado `READY`, alias público activo.
- Diecisiete archivos públicos verificados por HTTP 200 y SHA-256 coincidente:
  portada, estilos, modelo web y PDF, guía, metadatos, vista previa, ocho
  ilustraciones de Gemini, PDF de plantilla y ZIP completo de 50.455.549 bytes.
  PAES, NM3, NM4, 3ATP y estudiantes continúan respondiendo HTTP 200; la pauta
  retirada mantiene su redirección al modelo.
- Navegador en producción: instrucciones desplegables, enlaces de descarga,
  vista previa cargada, 32 páginas y ocho ilustraciones de Gemini presentes;
  contraportada nueva cargada, consola limpia y sin desborde horizontal.
- Se entrega el enlace de descarga y se indica abrir `EMPIEZA_AQUI.html` tras
  extraer el paquete. El PDF y los SVG fueron comprobados en Inkscape; el JSX
  para Illustrator se entrega con la limitación de ejecución nativa informada.

---

## 2026-09-21, 4°D TP: plantilla editable e imágenes de Gemini

- Se instaló Inkscape 1.4.4 desde el paquete oficial de winget, con verificación
  del hash del instalador. Illustrator no está instalado en este equipo.
- Plantilla A4 de 32 páginas con los colores y el recorrido del modelo, títulos,
  ilustraciones y espacios guiados para completar. Se retiraron los relatos y
  personajes del ejemplo de sus campos. Los ocho capítulos a elección siguen
  señalados y se pueden combinar o quitar.
- Descargas: `4dtp/plantilla-anuario-4d.pdf` y `plantilla-anuario-4d.zip`.
  El ZIP incluye PDF, SVG de 32 páginas, 32 SVG individuales, imágenes,
  instrucciones y un JSX que crea mesas y cuadros de párrafo en Illustrator.
  El JSX pasó revisión sintáctica; su ejecución nativa en Illustrator no se
  pudo verificar y se informa expresamente en la guía. No se presenta como
  archivo AI/AIT nativo ya generado.
- Las ocho imágenes de Gemini entregadas por el docente se revisaron e
  integraron en modelo web, PDF y plantilla. El modelo usa 16 ilustraciones;
  créditos y procedencia distinguen las ocho de OpenAI y las ocho de Gemini.
  Los prompts propuestos se conservan sin atribuirles un historial no recibido.
- La portada incorpora una tarjeta de descarga y ayuda desplegable. Se conserva
  el ingreso y todos los destinos anteriores. El PDF resuelto conserva sus
  textos y 32 páginas, con el lote nuevo; los generadores quedan en Git.
- Verificaciones: ZIP íntegro, referencias de imágenes completas, texto y formas
  conservados en 32 páginas; Inkscape abrió el SVG multipágina y exportó las 32.
  Se editó una respuesta de prueba y se comprobó su texto al exportar. PDF y
  plantilla renderizados y revisados; control de límites aprobado. Auditoría
  y build correctos, 239 recursos críticos. Navegador: descargas e instrucciones
  disponibles, sin desborde en celular, escritorio y medición 4K; consola limpia.
  La captura 4K volvió a fallar en la conexión del navegador.
- El resultado de la publicación segura se registra al cerrar.

---

## 2026-09-21, 4°D TP: cierre de portada y retiro de pauta

- Contenido confirmado y enviado en `3bfcb1b3`. Deploy seguro
  `dpl_yYYQz7RNCfR1E5pWBhMy31Ehf7ym` finalizado en `READY`, alias público activo.
- `/4dtp/pauta.html` responde HTTP 308 hacia `/4dtp/modelo.html`; el navegador
  confirma ese destino y conserva las 32 entradas del modelo.
- Portada, estilos, administración y modelo responden HTTP 200 y coinciden por
  SHA-256 con la fuente local. PDF y portadas PAES, NM3, NM4, 3ATP y estudiantes
  responden HTTP 200.
- Navegador en producción: seis grupos de contenidos, ninguna referencia a la
  pauta retirada, imágenes visibles cargadas, sin desborde ni errores de consola.
  Se entrega al docente el enlace de la portada actualizada.

---

## 2026-09-21, 4°D TP: portada unificada con el modelo final

- Por solicitud del docente se retira `4dtp/pauta.html`. Su dirección conserva
  acceso mediante redirección permanente a `4dtp/modelo.html`; portada, editor
  y administración apuntan al modelo final como referencia única.
- La portada muestra la ilustración vigente, ingreso a la carpeta, descarga
  del PDF, seis grupos desplegables y tres pasos de trabajo. Se conservan los
  nueve destinos de contenido originales dentro de 28 enlaces válidos al modelo.
  Se retiran maquetas anteriores, calendarios repetidos y cantidades fijas de
  páginas. Los ocho capítulos personales se presentan como opciones.
- El plan interno y las orientaciones de escritura se alinean con esa misma
  referencia. Se conservan fechas de revisión, entrega final, formularios,
  guardado y datos existentes. El PDF de 32 páginas permanece sin cambios.
- Auditoría del anuario, API aislada y build aprobados: 228 recursos críticos.
  Navegador con identidad ficticia: ingreso, pestañas, escritura, recarga y
  lectura docente correctos. Portada revisada visualmente en celular y
  escritorio; medición en 4K sin desborde. Imágenes cargadas y consola limpia.
  La captura 4K no terminó; no se presenta como inspección visual realizada.
- Publicación y comprobación del enlace retirado se registrarán al finalizar
  el deploy seguro.

---

## 2026-09-21, 4°D TP: edición visual publicada y verificada

- Contenido confirmado en `bb2b6f4b`, con push. Deploy seguro
  `dpl_9KHts8ZhdCyu4RYKCh24t8hJqjSh`, estado `READY`, alias público activo.
  Un primer proceso terminó sin confirmación; el reintento aprobó íntegramente
  los 229 recursos antes de publicar, sin desactivar verificaciones.
- Nueve archivos públicos comprobados por HTTP 200 y SHA-256 coincidente con
  la fuente: modelo, estilos, PDF, guía, metadatos y las cuatro imágenes nuevas.
  PAES, NM3, NM4, 3ATP y estudiantes continúan respondiendo HTTP 200.
- Navegador: 32 páginas, ocho fondos de color, sin desbordes ni errores de
  consola. El selector acompaña el capítulo activo y el desplazamiento reserva
  la altura real de la barra; en celular el título ya no queda tapado.
  `Imprimir PDF` abre el archivo final publicado en el visor del navegador.
- Se entrega enlace al modelo, documento con ocho prompts completos para
  Gemini y ZIP local del lote de cuatro ilustraciones. Las imágenes de Gemini
  siguen pendientes de recepción e integración.

---

## 2026-09-21, 4°D TP: modelo a todo color y encargos de imágenes

- A petición del docente, las 32 páginas del modelo web y PDF tienen fondos
  coloridos. Se añadieron paletas compartidas, títulos amplios, citas destacadas,
  índice en columnas, trayectoria visual, preguntas jerarquizadas, fichas y
  cartas; la portada del PDF usa una ilustración de gran formato.
- Lote propio de cuatro ilustraciones nuevas: portada, comunidad, viaje de
  papel e intereses. Originales conservados y copias en `4dtp/assets/`; ocho
  ilustraciones distintas en total. Prompts y procedencia registrados en
  `modelo-imagenes.json`. No se utilizan retratos ni materiales de estudiantes.
- `4dtp/imagenes-gemini.md` entrega ocho prompts completos, archivos y destinos
  previstos para imágenes complementarias. Se incorporarán cuando el docente
  las comparta; no se atribuyen a Gemini las imágenes actuales de OpenAI.
- Validación: PDF de 32 páginas renderizadas y revisadas, control de desbordes;
  navegador en celular, escritorio y 4K; contraste de texto superior a 4,5:1;
  auditoría del anuario y build aprobados, 229 recursos críticos. La publicación
  y comprobación de producción se registran en el cierre siguiente.

---

## 2026-09-21, 4°D TP: avances recibidos y posibilidades del anuario ampliadas

### Cierre de publicación

- Commit de contenido `e82070c1`, enviado a `origin/main`. Deploy seguro
  `dpl_BnT75VuRHcDQmZ4gPRFMcv6iTjsJ` completado en estado `READY`, con alias
  `https://www.estudiacest.com`. Un primer intento se detuvo por fallas
  transitorias de red; el segundo superó las verificaciones sin excepciones.
- Los once archivos públicos comprobados, incluidos PDF, pauta e ilustración
  nueva, responden HTTP 200 y coinciden por SHA-256 con la fuente local. PAES,
  NM3, NM4, 3ATP y estudiantes también responden HTTP 200.
- Navegador en producción: 32 páginas e índice de 32 entradas, ocho capítulos
  a elección, imágenes cargadas y sin errores de consola ni desborde horizontal.
  La pauta muestra las ocho posibilidades y el reconocimiento del avance.
- Nómina privada entregada al docente, fuera de Git. Sigue pendiente definir
  el destino del registro de calificaciones; no se han cargado en panel ni Lirmi.

- **Alcance:** seis entregas localizadas en la etiqueta escolar indicada por el
  docente. Se revisaron los PDF, los textos compartidos y la carpeta de trabajo;
  un editable de Illustrator quedó sin lectura interna por falta de vista previa
  y descarga bloqueada. Su recepción se reconoce igualmente. La nómina privada
  de revisión permanece fuera del repositorio y del sitio público.
- **Criterio docente:** reconocimiento de todas las entregas de esta revisión,
  incluidas maquetas parciales. La pauta distingue esa valoración de la evaluación
  final. No se modificaron calificaciones individuales en el panel ni en Lirmi;
  se consultó en qué registro deben incorporarse.
- **Pauta:** `/4dtp/pauta.html` unifica una base compartida y ocho posibilidades
  a elección: identidad, trayectoria, anécdotas, participación, salidas,
  intereses, creaciones y futuro. Permite organizar por años, temas o relato
  visual, combinar secciones y conservar el trabajo ya enviado. Las entrevistas
  admiten adultos de la comunidad educativa y la memoria incluye otras
  experiencias además del aniversario.
- **Editor y modelo:** 21 campos de partes del libro, con las ocho opciones
  identificadas y sin mostrarlas como obligaciones pendientes. El modelo web y
  PDF crecen a 32 páginas resueltas, con cuatro ilustraciones originales de IA y
  galería sin imágenes repetidas. No reproduce contenido personal de las entregas.
- **Verificación:** API aislada conserva campos antiguos y nuevos; escritura,
  recarga y lectura docente comprobadas con identidad ficticia. Pauta y modelo
  probados en celular, escritorio y 4K; sin errores de consola. PDF completo
  renderizado y revisado, sin desbordes. Auditoría del anuario y build aprobados,
  225 recursos críticos. El resultado del deploy seguro se registra al cerrar.

---

## 2026-09-21, 4°D TP: publicación verificada y bloqueo externo de audios

- **Publicado:** commit `3c70b48c`, push a `origin/main`, deploy seguro
  `dpl_CANv78bdA2Y5RuqWnsbYJvb79vo1`, estado `READY` y alias público confirmado.
  Los doce archivos principales, PDF e ilustraciones responden HTTP 200 y
  coinciden por SHA-256 con la fuente. Portadas PAES, NM3, NM4, 3ATP y estudiantes
  continúan disponibles.
- **Hallazgo en producción:** el administrador autentica y muestra los nuevos
  controles y las 13 partes. Al abrir una grabación real, Google Storage responde
  `UserProjectAccountProblem`: cuenta de facturación del proyecto cerrada
  (`The project to be billed is associated with a closed billing account`).
  El reproductor funciona en el entorno aislado, pero los audios de producción
  permanecen bloqueados por Google. No confundir publicación de la interfaz con
  recuperación de los archivos, ni afirmar que estos fueron eliminados.
- **Pendiente externo:** reactivar la cuenta de facturación vinculada a
  `estudiacest` y volver a comprobar reproducción y duración. Se informó a
  Francisco y se solicitó autorización antes de cualquier cambio financiero.
  No se modificaron cuentas de facturación ni medios de pago durante el diagnóstico.
- **Confirmación en consola:** «Reabrir cuenta de facturación» está deshabilitado
  y su descripción informa «No puedes volver a abrir esta cuenta de facturación
  porque no se encuentra en regla». La revisión de configuración no identificó
  una causa más específica; no se atribuye el cierre a deuda, tarjeta o identidad
  sin evidencia. La consola quedó abierta para la gestión de Francisco.

---

## 2026-09-21, 4°D TP: audios visibles y anuario completo

- **Audios:** el administrador mostraba solo «Audio registrado» y abría enlaces
  después de una espera, susceptible al bloqueo de ventanas. Ahora hay controles
  de reproducción dentro de cada entrevista y de «Abrir carpeta», también para
  estudiantes. Los enlaces privados se solicitan al escuchar, pueden renovarse
  y tienen alternativa de apertura/descarga y explicación de errores.
- **Escritura:** acceso y panel docente más amplios, áreas de texto de 380–500 px
  y botón «Ampliar escritura». Límite de transcripción aumentado a 60.000
  caracteres; textos largos y nuevas partes, a 20.000, coincidiendo con la API.
- **Anuario:** nueve secciones disponibles; nueva pestaña «Anuario completo»
  con 13 partes iniciales, personales y finales, pasos y ejemplos resueltos.
  Conserva entrevistas, productos escritos y archivos existentes. Guardado
  serializado y revisión docente de todas las partes mediante `bookSections`.
- **Modelo:** `/4dtp/modelo.html` y `/4dtp/modelo-completo.pdf`, 24 páginas desde
  portada hasta contraportada, cinco entrevistas ficticias completas, nueve
  secciones, despedida, agradecimientos y créditos. Tres ilustraciones originales
  con IA, identificadas como tales; prompts en `4dtp/assets/modelo-imagenes.json`.
  El modelo no atribuye declaraciones ni imágenes ficticias a personas reales.
- **Validación local:** auditoría focalizada y `npm run build` aprobados, 223
  recursos críticos. API real con Firebase simulado en memoria: conservación,
  guardado, lectura, entregas, límites y permisos comprobados sin escribir datos
  de estudiantes reales. Navegador: guardado/recarga, recuperación de tildes,
  reproducción con duración válida, admin y editor móvil sin desbordes,
  escritorio y 4K. PDF de 24 páginas revisado visualmente y sin texto desbordado.
- **Publicación:** implementación preparada para el deploy seguro; el resultado
  de producción se registra en la entrada de cierre posterior.

---

## 2026-09-20, NM4: Clase 5 rediseñada según la secuencia pedagógica solicitada

- **Corrección visual:** se retiraron de la presentación la infografía STAR y
  el video que rompían la continuidad del diseño. Se amplió la composición de
  las diapositivas, las tarjetas y la tipografía para proyección, manteniendo
  una versión móvil legible. La motivación ahora usa una imagen nueva, generada
  para la clase, con una reacción progresiva y una escala visual del 1 al 10.
- **Inicio:** motivación «¿Qué tan preparado te sientes para entrar a
  trabajar?», activación de experiencias y conocimientos sobre la entrevista,
  distinción entre preguntas relacionadas con el cargo y condiciones
  discriminatorias con enlaces oficiales de la Dirección del Trabajo, y
  objetivo de un solo verbo para copiar en el cuaderno: «Practicar respuestas
  claras, concretas y seguras para una entrevista laboral».
- **Desarrollo en el cuaderno:** instrucciones en cuatro pasos, ejemplo
  modelado con la estructura situación–tarea–acción–resultado, casos por las
  cuatro especialidades, redacción de 8 a 10 líneas, ensayo entre pares y pauta
  de monitoreo docente.
- **Cierre:** plenario con dos lecturas, pregunta de sistematización escrita en
  el cuaderno y revisión con timbre. La clase quedó en 13 diapositivas.
- **Prevención y validación:** se actualizó
  `scripts/audit-nm4-u3-class5.js` para exigir la secuencia completa y rechazar
  las referencias antiguas; el recurso nuevo quedó fijado por hash en la
  auditoría y registrado en el manifiesto académico. `npm run build` aprobó
  los 214 recursos críticos. Playwright comprobó las 13 diapositivas en móvil,
  escritorio y 4K localmente, y repitió 26 comprobaciones en producción sin
  desborde horizontal, errores de consola ni solicitudes fallidas. El HTML
  público coincide exactamente con Git y el hash remoto de la imagen coincide
  con el local.
- **Publicación:** implementación `b0148def`; inventario estricto cerrado en
  `ab03d523`; despliegue seguro final `dpl_Dkpo7NokVceExivo8yNn612xwaiK`,
  estado `READY`, alias `https://www.estudiacest.com` verificado.

---

## 2026-09-19, NM4: portada reparada e infografía STAR localizada al español

- **Problema confirmado:** producción conservaba la versión defectuosa de
  `nm4/index.html`, con tarjetas `<article>` anidadas, dos rangos de la unidad,
  estados incompatibles y fechas repetidas. La Clase 5 también mostraba una
  infografía STAR completamente en inglés.
- **Corrección:** se publicó la reparación de la portada ya contenida en
  `66d3fde4`; `metodo-star.jpg` se reemplazó por una infografía 4K con solo los
  rótulos españoles «Método STAR para entrevistas técnicas», «Situación»,
  «Tarea», «Acción» y «Resultado».
- **Prevención:** `scripts/audit-nm4-u3-class5.js` ahora exige ocho tarjetas de
  primer nivel, una sola clase actual, un solo rango vigente, ausencia de las
  fechas antiguas y el hash de la infografía española aprobada. El manifiesto
  dejó de tolerar que falten en producción los diez recursos de la Clase 5.
- **Validación:** auditoría focalizada y `npm run build` aprobados; 214 recursos
  críticos verificados. Playwright comprobó la portada en 390, 1440 y 3840 px:
  ocho tarjetas directas, una activa, sin desborde, errores de consola ni
  solicitudes fallidas. La diapositiva 4 cargó la imagen 3840 × 2160 sin
  desborde. Tras publicar se repitieron las pruebas móvil y escritorio; el HTML
  público coincidió con Git y el hash remoto de la imagen coincidió con el
  local.
- **Publicación:** commit `4a41064c`; despliegue seguro
  `dpl_C1m81oPxFasD2aQyGPAtx18GNA2i`, estado `READY`, alias
  `https://www.estudiacest.com` verificado.

---

## 2026-09-18, NM4: Despliegue de Clase 5 «La entrevista de trabajo» y reprogramación del calendario

- **Qué se hizo:**
  - Se creó y desplegó la **Clase 5: La entrevista de trabajo** en `nm4/u3-clase5-entrevista-laboral/index.html` con sistema de 14 diapositivas interactivo, adaptado a resoluciones desde celular hasta 4K, con controles de teclado y gestos táctiles.
  - Se reprogramó el calendario de la Unidad 3 de NM4 en `nm4/index.html`:
    - Clase 5: lunes 21 de septiembre (4°D martes 22 de septiembre) · 90 min (marcada como clase actual).
    - Clase 6 (Escribir en el trabajo): lunes 28 de septiembre (4°D martes 29) · 90 min.
    - Cierre de Unidad 3 (Revisión de cuadernos y timbres): lunes 5 de octubre (4°D martes 6).
    - Rango general de la unidad: del 10 de agosto al 5 de octubre.
  - Se generaron 6 imágenes fotorrealistas con IA (estilo documental de especialidades técnicas salesianas) para la portada general, método STAR y los 4 casos por especialidad (4°A Mecánica Industrial, 4°B Mecánica Automotriz, 4°C Electricidad, 4°E Electrónica).
  - Se produjo el video introductorio `video-entrevista.mp4` (99s, H.264/AAC, 1080p), con locución chilena (`es-CL-LorenzoNeural`), guion pedagógico `video-entrevista-guion.txt`, póster HD y subtítulos WebVTT (`video-entrevista.vtt`).
  - Se incorporó el método STAR técnico, el modelado comparativo de respuestas (débil vs. profesional), las 4 preguntas clave de entrevista, la pauta de simulación en parejas (15 min por rol con rúbrica de 5 criterios) y el ticket de salida en el cuaderno.
  - Se registraron los 10 recursos críticos en `scripts/academic-release-manifest.json` y se creó el script de auditoría `scripts/audit-nm4-u3-class5.js`, integrado en el build general de `package.json`.
- **Verificación:**
  - `node scripts/audit-nm4-u3-class5.js`: OK.
  - `node scripts/audit-nm4-u3-class4.js`: OK.
  - `npm run build`: OK (214 recursos críticos verificados en el release académico).
- **Estado y pendientes:**
  - La Clase 5 queda lista y activa en el portal de NM4 para su ejecución el 21 de septiembre.
  - Pendiente para la semana del 28-sep: preparación de la Clase 6 («Escribir en el trabajo»).

---

## 2026-09-18, Firebase quedó en Spark: la cuenta de facturación existe pero no está vinculada

- **Qué pasó.** De madrugada Google Cloud canceló dos cuentas de facturación
  (03:55) y, en cadena, Firebase bajó `estudiacest` y `profe-blog` al plan
  **Spark** (04:00 y 04:01). Mismo origen que la caída de
  profefranciscopancho.com ese día: la tarjeta que respaldaba los servicios.
- **Estado verificado el 18-sep a las 09:40.** `estudiacest` sigue en
  **Spark**. Hay una cuenta de facturación **activa** en Google Cloud, «Mi
  cuenta de facturación» (`016A0B-EF1A80-ED192E`, gasto $0), pero **el
  proyecto no está vinculado a ella**. El flujo de Blaze quedó a medias en
  «Configurar el perfil de facturación» de una segunda cuenta
  (`016826-8BA235-272903`).
- **El sitio está arriba**: `https://www.estudiacest.com` responde HTTP 200.
  No se detectó nada roto todavía, pero no se probó el guardado ni los límites
  de Realtime Database bajo Spark.
- **Pendiente, por decisión de Francisco (lo dejó para después).** Vincular
  `estudiacest` a la cuenta activa para volver a Blaze, o confirmar que Spark
  alcanza. Antes de decidir conviene medir qué del proyecto necesitaba Blaze:
  las APIs corren en Vercel, no en Cloud Functions, así que puede que Spark
  baste. Revisar también `profe-blog`, que quedó igual.
- No se modificó ningún plan en esta sesión.
- La consola de Firebase y Google Cloud de estos proyectos vive en la cuenta
  personal: hay que entrar con `/u/1`, no con la del colegio, que da «este
  proyecto no existe o no tienes permiso».

## 2026-09-10, PAES: cuenta regresiva y bloqueo programado de las guías hasta la 19

- Pedido de Francisco: un contador en PAES HC que avise que las guías hasta la
  19 se bloquean el 23 de septiembre.
- **Bloqueo real (commit 6b9dab73):** `guias_config/bloqueo_programado =
  { fecha: '2026-09-23', guias: g12…g19 }`. `readGuiasConfig` lo aplica una
  sola vez, la primera vez que alguien lee la configuración desde las 00:00 de
  Chile del 23 (escribe `blocked/gNN` y marca `aplicado`); después el docente
  puede desbloquear desde el admin sin que se vuelva a bloquear. La 20 y la 21
  no están en la lista. El reenvío de todas (12–21) cierra el mismo día.
- **Aviso:** `paes/js/aviso-cierre.js`, franja ámbar arriba con la fecha y
  cuenta regresiva (días, horas, minutos, segundos). Toma fecha y guías del
  servidor (nunca escritas en el cliente). Carga en `paes/index.html`,
  `paes/guias.html` y, desde `guia-lock.js`, en cada guía; dentro de una guía
  solo aparece si esa guía se bloquea. Al llegar la hora cambia a "ya están
  bloqueadas"; una vez aplicado el bloqueo el servidor deja de informarlo.
- **Verificado en producción:** la API pública informa g12–g19 con límite
  2026-09-23T03:00Z (00:00 de Chile, miércoles). Aviso visible en portal,
  listado, G12 y G19; no en G20. A 400 px no desborda. Consola limpia.
  `audit-paes-reenvio` prueba la medianoche de Chile en verano e invierno,
  cuándo se aplica y que no se reaplique (4 mutaciones detectadas).

## 2026-09-10, PAES: el reenvío se cierra solo el 23 de septiembre

- Francisco aprobó cerrar el reenvío el 23-sep-2026, antes de recalcular
  notas, para que ese día nadie cambie respuestas.
- `guias_config/reenvio_cierra = '2026-09-23'` (primer día cerrado, hora de
  Chile). `reenvioVigente()` decide con la marca de cada guía y esa fecha;
  desde las 00:00 del 23 las guías 12–21 vuelven a mostrar lo enviado como
  entregado y no aceptan un segundo envío. Commit 231a9449, desplegado desde
  worktree en LF. `audit-paes-reenvio` prueba la regla de fechas tal como está
  en el código (3 mutaciones, incluida cerrar un día tarde).
- Verificado: la fecha quedó en la base; hoy, pasado el aviso de 5 minutos,
  una entrega de prueba en G17 vuelve editable (RUT ficticio, borrado).
- El cierre no bloquea a quien nunca entregó: la guía sigue habilitada para
  una primera entrega. Para cortar también eso, bloquear las guías en el admin.
- Para mover la fecha: cambiar `reenvio_cierra`; para cerrar ya una guía,
  borrar `reenvio/gNN`.

## 2026-09-10, PAES: "No se confirmó la entrega" en 16–21 con el reenvío abierto

- **Reporte de Francisco:** en la 18, al entregar salía "No se confirmó la
  entrega: no quedó confirmada en el registro".
- **Causa (mía):** las guías 16–21 releen el estado justo después de entregar
  y exigen `completada` (20 y 21 también `submitted`). Con el reenvío abierto,
  `get-guia-state` devolvía lo enviado como editable, así que la relectura
  fallaba aunque la entrega sí quedaba guardada. En la prueba anterior se
  probó el servidor por API y la G12 (que no relee), no una entrega en 16–21.
- **Contención:** reenvío cerrado en g16–g21 mientras se arreglaba (g12–g15
  siguieron abiertas).
- **Arreglo (commit 9b6412e2):** una entrega de los últimos 5 minutos se
  informa como entregada; pasado ese plazo vuelve a ser editable. Probado en
  producción con la cuenta de prueba y el reenvío abierto: G18 entrega y
  confirma, a los 10 minutos simulados vuelve editable con su respuesta y el
  reenvío confirma; G21 y G16 entregan y confirman. Consola sin errores.
  Reenvío reabierto en g12–g21. `audit-paes-reenvio` vigila la ventana y la
  relectura de las seis páginas.
- **Datos:** desde las 12:25, 17 entregas en 16–21, todas guardadas como
  enviadas; ninguna se perdió. Ya hay reenvíos en 13, 14, 15, 17, 18 y 19.
- Francisco confirma que todos pueden volver a entrar y responder hasta el
  recálculo de notas del 23-sep-2026; la nota se toma de la última entrega y
  las anteriores quedan en `intentosAnteriores`.

## 2026-09-10, PAES: guías 12–21 habilitadas con reenvío y botón de enviar arreglado

- **Pedido de Francisco:** dejar habilitadas desde la 12 para volver a
  responder y enviar, y revisar errores (la 12 "no enviaba").
- **El fallo de la 12.** El botón sí enviaba, pero el servidor exige todas las
  preguntas (400) y la página mostraba cualquier rechazo como "sin conexión".
  Por eso 113 de 131 registros de la G12 y 100 de 122 de la G13 quedaron en
  borrador. Las guías 11–13 (misma plantilla) ahora dicen qué preguntas faltan
  antes de enviar y muestran el motivo real del servidor. La G10 tiene otra
  versión de esa función y sigue bloqueada; no se tocó.
- **Reenvío (commit 1f167e1d).** Marca por guía `guias_config/reenvio/gNN`.
  Con la marca, lo enviado vuelve editable y sin pauta; el autoguardado va a
  `reenvioBorrador` (abrir la guía no deshace la entrega) y al reenviar el
  intento anterior queda en `intentosAnteriores` con su nota. Cubre las tres
  rutas: guías antiguas (10–13), nuevas (15–21) y el ensayo de la 14. Sin la
  marca, lo enviado sigue inmutable (REGLAS §7). `audit-paes-reenvio.js` en el
  build. Se mantuvieron textuales las condiciones de la cuenta de prueba que
  exige `audit-paes-semester-grades.js`.
- **Configuración en producción:** quitadas `g20` y `g21` de `blocked`
  (g12–g19 ya estaban habilitadas) y `reenvio` en g12…g21, releído en la API
  pública. El resto del bloqueo quedó igual.
- **Pruebas en producción.** RUT ficticio fuera de nómina, en G17, G12 y G14:
  envío, vuelta editable sin pauta, autoguardado sin deshacer la entrega,
  reenvío con el intento anterior archivado; registros borrados. Navegador con
  la cuenta de prueba: la G12 avisa "Te faltan 5 preguntas: 11…15", envía,
  recupera las 15 respuestas y reenvía. Consola limpia en G12–G21, el portal y
  `guias.html`; ninguna tarjeta 12–21 bloqueada. En G18–G21 cargan preguntas y
  "Entregar" tras ingresar.
- **Ojo docente:** las pautas de G12–G16 ya estaban publicadas a 4 cursos;
  con reenvío abierto no se muestran, pero quien las vio puede recordarlas.
  Para cerrar el reenvío de una guía basta borrar `guias_config/reenvio/gNN`.
- **Despliegue desde worktree:** crear la copia con
  `git -c core.autocrlf=false worktree add`. Con CRLF, `audit-paes-teaching.js`
  falla en el build de Vercel (así se cayó el deploy de 12bb5121). Este deploy
  llevó también placas y regalos de Mi espacio: verificados en producción con
  cuenta ficticia (aviso de regalo, mueble en "Tengo" con 🎁, placas 1→2 de 3,
  placas junto al nombre); cuenta borrada.

## 2026-09-10, PAES 1–21: apertura didáctica homogeneizada

- Se conservaron las ampliaciones e imágenes IA de G1–G9 y se añadieron doce desarrollos específicos (6.319 palabras de contenido editorial, más consignas comunes) a G10–G21 y las cinco versiones guiadas disponibles G17–G21. Las 35 páginas regulares/guiadas de G1–G21 tienen objetivo, instrucciones, conceptos, estrategia por pasos, ejemplo razonado ATENCIÓN y comprobación formativa con respuesta inicialmente cerrada. Capítulos desplegables y navegación por teclado, sin exigir su apertura para entregar.
- Fuentes: `scripts/paes-continuity-teaching.js` y generador idempotente `scripts/generate-paes-teaching.js`; estilo acotado `paes/css/guia-teaching.css`. G14 clona la preparación dentro del ingreso; G21 la contiene en el ingreso existente. Al entrar al instrumento deja de mostrarse; no se alteran temporizadores, lecturas, preguntas ni claves. Recursos y videos anteriores se conservan. Se precisaron en la enseñanza de G17 las condiciones de la doble evidencia y en G18 el giro de objeción posterior a una concesión.
- Preservación: comparadas las 17 páginas modificadas con Git, todo el contenido previo permanece salvo esas tres correcciones textuales declaradas. Los controladores y bancos inline son idénticos normalizando CRLF; el único cambio del controlador externo G14 es la inserción del bloque preparatorio. No se escribieron intentos reales, liberaciones ni bancos privados.
- Validación local: generador idempotente; auditoría de las 35 aperturas incorporada a `prebuild` con sus dependencias exceptuadas en `.vercelignore`; build completo aprobado con 204 recursos críticos y 44 contratos. Tres pruebas de apertura aprobadas y luego suite de 25 pruebas Playwright aprobada: 390/1440/3840 px, teclado, explicación y modelo, preparación separada, flujos G1–G9/G21, recuperación sin copia local, errores de red, concurrencia, entrega con pendientes y publicación privada. Capturas inspeccionadas. En pruebas se sustituye la identidad de la ruta guiada únicamente en memoria.
- `REGLAS.md` y apartado 2.1 del plan de 32 guías fijan esta apertura para futuras construcciones G22–G32, sin publicarlas anticipadamente. La homogeneización es de estructura didáctica, no una sustitución de los instrumentos ni una declaración de validación editorial independiente. Se conserva el pilotaje docente pendiente.
- Publicación y comprobación pública pendientes en esta entrada; se registrarán al completar el deploy seguro y `scripts/verify-paes-teaching-production.js`.

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
