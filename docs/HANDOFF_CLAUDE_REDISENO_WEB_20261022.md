# Traspaso a Claude: referencias y rediseño de Profe Francisco

Preparado por Codex el **22 de octubre de 2026**, a petición de Francisco. Sitio: <https://www.profefranciscopancho.com/>. Este es el punto de entrada vigente para continuar el encargo; los documentos del 21 de octubre conservan etapas anteriores.

La última implementación de portada es `43c058c683c2153a6efe09f6aa7d7872a0855df2`. Está publicada y comprobada técnicamente. Francisco todavía no ha dado una valoración del acabado visual posterior a esa publicación; no confundir la comprobación técnica con su aprobación estética. El encargo de este bloque fue dejar este reporte, sin otra modificación visual.

## 1. Qué pidió Francisco y qué decisiones siguen vigentes

- Reducir la información innecesaria y responder, en este orden: **qué ofrecemos, cómo trabajamos, cuánto cuesta y dónde inscribirse**.
- Retirar el video de la portada y mantener la plataforma actual. Confirmó expresamente no migrar cuentas, pagos o paneles a WordPress/WooCommerce.
- Tomar referencias de Active Theory, Fitosauna y Mubien, observando sus efectos reales, no solo sus bibliotecas.
- Explicar servicios y entregables según el trabajo real con docentes en Portabot; incorporar los precios de revisión que faltaban.
- Corregir el nombre a **Profe Francisco**. Se corrigieron las mayúsculas en cabecera y pie; se conservó el símbolo SVG existente. No se hizo una identidad gráfica nueva completa.
- Preferir un **libro de hojas que giran con los campos de DocenteMás**, en lugar de una escultura abstracta.
- Darle un ensamblaje inspirado en nanobots, al estilo Tony Stark. Rechazó la primera solución de cuadraditos porque parecía «Windows 98».
- Hacer que el libro cambie de hoja **automáticamente**, quitar flechas y botón de detener movimiento, y añadir siluetas sutiles a un fondo que encontraba demasiado negro y plano.

La ausencia de pausa visible es una decisión expresa del usuario. Se mantiene la preferencia de movimiento reducido del sistema y la suspensión de la animación cuando no se ve.

## 2. Páginas vistas: qué tenía cada una

El 21 de octubre se abrieron las tres referencias en Chrome con JavaScript, a 1440 × 900, esperando su carga y probando puntero y desplazamiento. El procedimiento está en `C:/dev/artifacts/profefranciscopancho-20261021/audit-references.cjs`. Las capturas seleccionadas se incluyen en este repositorio para que el traspaso no dependa de esa carpeta local.

El 22 se reabrieron sus URLs con el lector web: Active Theory y Mubien dependen del renderizado con JavaScript y no entregan allí una representación útil de sus efectos. La descripción visual siguiente procede de la observación y capturas del 21, revisadas al preparar este reporte. No es una auditoría completa de todas sus rutas o de sus versiones actuales.

### Active Theory — <https://activetheory.net/>

**Observado:** escena inmersiva oscura que ocupa la pantalla, formas y trazos luminosos, elementos orbitales, profundidad, movimiento continuo y respuesta a la interacción. La composición cambia durante el recorrido; la navegación ocupa poco espacio. Su identidad está en la escena interactiva, más que en una sucesión de tarjetas.

**Aporte aplicado:** un objeto tridimensional protagonista, luces, superficies curvas y respuesta al cursor y al avance de la portada. La traducción final es el libro docente, conservando oferta y acciones visibles.

**Límite:** no se reprodujo su motor, escena completa ni grado de producción artística. Las hojas iniciales abstractas se sustituyeron por el libro pedido por Francisco.

Evidencia: [inicio](evidencias-portada-20261021/active-start.jpg) y [escena tras desplazarse](evidencias-portada-20261021/active-scroll2.jpg).

### Fitosauna — <https://fitosauna.com/>

**Observado:** fotografía protagonista, tonos cálidos, tipografía grande, poco texto por escena y llamadas comerciales claras. Al desplazarse, un bloque de explicación permanece como referencia mientras cambian imágenes y beneficios; hay secuencias numeradas. Menú, consulta y tienda tienen accesos visibles.

**Aporte aplicado:** jerarquía comercial, precios antes del recorrido visual y explicación del servicio por etapas. El proceso propio se presenta como una secuencia fijada durante el desplazamiento en escritorio.

**Límite:** se tomó su organización comercial y ritmo; Francisco descartó migrar a su plataforma de comercio.

Evidencia: [cabecera](evidencias-portada-20261021/fitosauna-start.jpg) y [secuencia comercial](evidencias-portada-20261021/fitosauna-scroll2.jpg).

### Mubien — <https://mubien.com/>

**Observado:** galería espacial sobre fondo claro, imágenes de proyectos en distintas escalas, deformación o curvatura aparente, respuesta al puntero y transiciones amplias. Durante el desplazamiento, una imagen puede crecer hasta ocupar casi toda la pantalla. Navegación flotante compacta e indicador de proyecto.

**Aporte aplicado:** cuatro escenas del proceso con avance horizontal, acercamientos y leve rotación de imágenes, entradas amplias de títulos e interacción del puntero. Se conserva el cursor nativo y se añade un halo discreto.

**Límite:** la galería propia usa GSAP sobre elementos HTML; no es una reproducción de la galería WebGL de Mubien.

Evidencia: [galería espacial](evidencias-portada-20261021/mubien-start.jpg) y [proyecto ampliado](evidencias-portada-20261021/mubien-scroll2.jpg).

### Profe Francisco antes del rediseño

Según el diagnóstico registrado el 21: video automático, demasiadas secciones, proceso explicado dos veces, listados de agentes y detalles de implementación, cifras y testimonios en movimiento antes de llegar a precios. Ocho destinos competían en la navegación. Había condiciones de cuotas contradictorias con la fuente comercial vigente.

Se conservaron cuentas, registro, panel, rutas y servicios existentes. El objetivo fue ordenar la oferta, facilitar la inscripción y dar movimiento a una identidad docente reconocible.

## 3. Tecnologías que Francisco compartió de las referencias

Este inventario procede de los resultados de Wappalyzer pegados por Francisco en la conversación. **No se verificaron independientemente todas las detecciones ni sus versiones.** No significa que esas tecnologías estén instaladas en Profe Francisco ni que deban añadirse todas.

| Referencia | Inventario aportado por Francisco |
| --- | --- |
| Active Theory | GA4, Google Tag Manager, PWA, Open Graph, HTTP/3, Theatre.js y Goober. |
| Fitosauna: contenido y tienda | WordPress, WooCommerce 11.1.2, PHP, MySQL, Yoast SEO, Ninja Forms 3.15.5 y blog WordPress. |
| Fitosauna: movimiento e interfaz | GSAP 3.14.1, Swiper, FancyBox 5.0.36, Bootstrap 5, Marionette.js 2.4.2, Backbone.js 1.6.1, Underscore.js 1.13.8, jQuery 3.7.1, jQuery Migrate 3.4.1 y core-js 3.36.0. |
| Fitosauna: medición y marketing | GA4, GTM, Microsoft Clarity 0.8.72, Facebook Pixel 2.9.426, Cloudflare Browser Insights, Klaviyo y Trustpilot. |
| Fitosauna: infraestructura y metadatos | Cloudflare, jsDelivr, Amazon S3, AWS, Open Graph y HTTP/3. |
| Mubien | Three.js 182, anime.js, Lenis 1.3.26, PWA, Open Graph, Nginx y HTTP/3. |

**Selección real de nuestra portada:** Three.js `0.182.0`, GSAP `3.14.1` y ScrollTrigger, integrados con esbuild `0.25.11`, sobre Eleventy y la plataforma existente. `@theatre/core 0.7.2` y `goober 2.1.16` permanecen como dependencias de la primera versión, pero no forman parte de los bundles actuales. No se añadieron anime.js, Lenis ni el ecosistema WordPress de Fitosauna.

HTTP/3 depende del alojamiento y la negociación de red; no se programó como un efecto de la página. Tampoco se añadieron Clarity, Pixel, Klaviyo o Trustpilot ni se inventaron sus cuentas o reseñas.

## 4. Qué quedó hecho en Profe Francisco

### Contenido y contratación

Seis secciones principales: cabecera, servicios/precios, proceso, identidad del profesor, preguntas frecuentes y llamada final a la acción. Se retiraron el video, repeticiones, mensajes técnicos para clientes y promesas absolutas. Los otros productos siguen accesibles desde el pie.

| Servicio | Precio publicado CLP |
| --- | ---: |
| Elaboración M1 | $79.990 |
| Elaboración M2 | $99.990 |
| Elaboración M3 | $79.990 |
| Completo con cupo confirmado por WhatsApp | $200.000 |
| Completo por sobrecupo | $240.000 |
| Revisión M1 | $25.000 |
| Revisión M2 | $30.000 |
| Revisión M3 | $20.000 |

Los módulos sueltos se suman. Pago por transferencia, máximo dos cuotas. Crear la cuenta es gratis y no confirma un cupo. Se preserva `/cuenta/crear-cuenta.html`; clientes ingresan por `/cuenta/login.html` o `/dashboard/`.

La revisión está separada de la elaboración: informe, recomendaciones, rúbrica y hoja de niveles estimados; el docente realiza las correcciones. Su CTA lleva a WhatsApp, sin atribuir al selector del panel una contratación de revisiones que no se verificó. No se inventó un paquete de revisión con descuento ni se prometió un resultado oficial.

El proceso publicado explica antecedentes reales del curso, preparación de materiales, revisión/entrega por Drive y continuidad según módulos contratados. Para M2 se describen libreto, presentación editable y guía; la grabación la hace el docente.

Las fuentes se contrastaron en Portabot el 21, especialmente `_gestion/REGLA_LA_REVISION_ENTREGA_LO_QUE_PROMETE_EL_AFICHE.md`, su bitácora y el formato de trabajo. Este reporte no reaudita expedientes individuales ni publica sus datos.

### Libro y movimiento actual

- Libro Three.js con tapas, lomo, bloques de papel y hojas curvas. Flota suavemente y gira con el puntero.
- Cuatro páginas ilustrativas en blanco: contexto docente, planificación M1, clase grabada M2 y trabajo colaborativo M3. Texturas con texto real dibujado en canvas, sin respuestas ni datos de clientes.
- Campos contrastados con `Portabot-2026/herramientas/plantilla_docentemas_form.html`, rótulos del panel propio y el Manual 2026 de 7°/8° y Media. [Fuente oficial de manuales](https://www.docentemas.cl/documentos-descargables/manuales-de-instrumentos/). No es el formulario oficial completo para todas las modalidades.
- Ensamblaje inicial de unos 2,8 segundos: frente orgánico, cintas metálicas tridimensionales y pequeñas formas alargadas con reflejos. Durante el giro, los trazos acompañan la curvatura.
- Primer cambio tras 4,5 segundos de animación; siguientes tras 4,5 segundos de reposo. Cada giro dura 1,85 segundos. No hay flechas, botón de pausa ni interacción necesaria para avanzar.
- La primera versión de nanobots usaba puntos cuadrados; Francisco la rechazó. Fue retirada. La actual es una interpretación gráfica fluida, no una simulación cinematográfica de nanorrobots.
- Títulos entran por líneas; otras cabeceras recuperan opacidad por palabras. Botones responden al puntero y módulos se inclinan ligeramente.
- Galería de cuatro pasos fijada con avance horizontal en escritorio; acercamiento y leve giro de imágenes. En móvil se apila para conservar la lectura.
- Fondo azul pizarra con siluetas sutiles de libros, hojas y lápices, conservando contraste para texto y acciones.

La escena limita resolución y fotogramas en móvil, prepara shaders de forma asíncrona y se suspende fuera de pantalla o con pestaña oculta. Movimiento reducido o ahorro de datos conservan contenido estático. La leyenda del libro es decorativa y no anuncia cada giro al lector de pantalla.

### Higgsfield y recursos visuales

Se utilizaron dos imágenes GPT Image 2.5, con preflight de **2,75 créditos por generación**; es el coste presupuestado observado, no una conciliación de consumo de la cuenta:

| Recurso | Trabajo y destino |
| --- | --- |
| Primera escultura de hojas de vidrio | `a552ab89-c323-457c-9ba7-eba5d3991a78`. Original `obra-higgsfield.png`, conservado en la carpeta local de evidencias. Sustituido en la portada al elegir el libro. |
| Ambiente docente actual | `14767667-5c4f-4657-8648-c726c66cb4ec`. Original `ambiente-higgsfield.png`; versión pública `imagenes/portada-2026/ambiente-docente.webp`, unos 56 KB. |

La alternativa estática `obra-1920.webp`/`obra-960.webp` procede del propio libro renderizado, no de la primera imagen de vidrio. Las imágenes de contexto/clase/colaboración/docente se reutilizaron desde el repositorio; no atribuirlas como nuevas generaciones de este bloque. No se generó un video para el fondo. El [MP4 incluido](evidencias-portada-20261021/libro-fluido.mp4) es una captura de la web funcionando, de 8 segundos, H.264, 960 × 600.

### Métricas, distribución y acceso

GA4 directo: medición `G-TPX8R8EP26`, propiedad `559976412`, flujo `16174928880`. Se configuró en la cuenta de Francisco, separada de Estudia CEST. Detalle en [METRICAS_WEB_20261021.md](METRICAS_WEB_20261021.md).

| Evento | Qué significa |
| --- | --- |
| `page_view` | Vista pública con consentimiento. |
| `pricing_viewed` | Precios entraron en pantalla. |
| `registration_clicked` | Clic hacia crear cuenta. |
| `whatsapp_clicked` | Clic hacia WhatsApp; no acredita un mensaje enviado. |
| `sign_up` | Registro nuevo guardado, por correo o Google; un acceso de usuario existente no cuenta. |

Consentimiento antes de descargar Analytics y opción de retirarlo. No se envían nombres, RUT, teléfono, correo, UID, campos de formulario, consulta o fragmento de URL. No se mide admin, dashboard o estudiantes. El registro sigue funcionando si falla Analytics. `sign_up` es evento clave sin valor monetario; no hay compra medida sin pago comprobado.

GA4 recibió las pruebas propias de `page_view` y `pricing_viewed` en tiempo real el 21. Eso no demuestra tráfico comercial ni ventas. **GTM no está instalado:** su interfaz quedó en blanco y se optó por la etiqueta directa de GA4. No duplicar etiquetas al retomarlo.

Open Graph y PWA preparados, con manifiesto, iconos y página sin conexión. El service worker solo ofrece alternativa al fallar una navegación a `/`; no convierte cuentas, formularios, pagos o paneles en una aplicación operativa sin conexión.

## 5. Archivos y herramientas para continuar

Repositorio propietario: `C:/dev/profe-blog`, remoto `Fconuva/profe-blog`. Worktree de este encargo: `C:/dev/profe-blog-portada-20261021`, rama `mejora/portada-clara-20261021`. No trabajar desde la copia de OneDrive. El 22 se incorporó por fast-forward `origin/main` hasta `7a533d9b`, preservando los cambios de Estudia CEST.

| Archivo | Responsabilidad |
| --- | --- |
| `index.njk` | Oferta, precios, proceso, libro y acciones de la portada. |
| `_includes/layout-home.njk` | Cabecera/pie, nombre, metadatos, fuentes y carga de recursos. |
| `css/home.css`, `css/home-motion.css` | Diseño base, capas, fondo, galería y ajustes móviles. |
| `js/home.js` | Menú, sesión existente, carga diferida de efectos y PWA. |
| `scripts/home-motion.js` | Libro, texturas, ensamblaje fluido y giro automático Three.js. |
| `scripts/home-interactions.js` | GSAP/ScrollTrigger, galería, textos, puntero y respuesta de botones. |
| `scripts/build-site.js` | Bundles de esbuild, Tailwind y Eleventy. |
| `js/marketing-config.js`, `js/marketing-metrics.js` | Configuración pública y medición consentida. |
| `cuenta/crear-cuenta.html` | Registro y medición posterior a persistir, en sus scripts internos; las pruebas de registro leen ese HTML. |
| `imagenes/portada-2026/` | Fondo, alternativa estática, imágenes de proceso e iconos. |
| `site.webmanifest`, `sw-home.js`, `offline.html` | Instalación y alternativa sin conexión de la portada. |

`js/home-motion.bundle.js`, `js/home-interactions.bundle.js` y `_site/` son salidas generadas; modificar las fuentes, no esos bundles. Compilación de portada: `npm run build` en la raíz. Pruebas de métricas/registro, si se cambia su código: `node --test tests/marketing-metrics.test.js tests/marketing-registration.test.js`.

Skills utilizadas durante el rediseño: `design-taste-frontend`, `gsap-core`, `gsap-scrolltrigger`, `gsap-performance` y `higgsfield`. La animación web es código Three.js/GSAP; Higgsfield produjo imágenes. No se instalaron todas las herramientas de las referencias ni se actualizaron dependencias ajenas por iniciativa propia.

Proyecto Vercel de esta web: `profefconuva`, `prj_ULOviRGBpTxI89BrZKBxNFcFOtvu`, scope `fconuvas-projects`, equipo `team_Ms8W5hULEgWu5E3sfx9SSd8X`. Es distinto del despliegue de Estudia CEST. Antes de cualquier cambio/push: leer `AGENTS.md`, hacer fetch, integrar el remoto y agregar solo rutas explícitas. Hubo despliegues tardíos que reasignaron el dominio: comprobar alias y contenido real además de READY.

## 6. Estado publicado y evidencia

### Publicación del 21 de octubre

Código `43c058c683c2153a6efe09f6aa7d7872a0855df2`, despliegue `dpl_7RTpVPid6tn25euJwNhxQoCKyweV`, READY. Se comprobaron siete recursos por SHA-256 y comportamiento real del dominio.

La prueba de navegador confirmó avance **M1 → M2 → M3 sin clics**, galería fijada y desplazándose, ausencia de flechas/pausa/video, precios de revisión correctos y cero errores JavaScript. Revisión en 320, 390, 800, 1024 y 1440 píxeles, sin desbordamiento ni imágenes rotas. Se comprobaron contenido sin JavaScript, ahorro de datos y movimiento reducido. Nueve pruebas de métricas/registro aprobadas.

Lighthouse 12.8.2, móvil emulado **local**, última versión: rendimiento **81**, accesibilidad **100**, LCP **4,05 s**, TBT **218 ms**, CLS **0,002**. No son métricas de visitantes ni un ensayo de producción. El mapa de reflejos inicial causaba mucho bloqueo y se sustituyó por reflejos analíticos. El antiguo resultado 86/100 corresponde al libro anterior, no a la versión fluida actual.

### Relectura al preparar este traspaso, 22 de octubre

El alias público apunta ahora a `dpl_2Dzhy4topXU9opzbeLiqNMoAV1i7`, READY, código `7a533d9b1230077dca2338fa51f777038ebf92a9`. Los commits posteriores al rediseño contienen trabajo de Estudia CEST y conservan la portada de `43c058c6`.

Se volvió a comprobar el HTML público y los **siete hashes** de CSS, JavaScript y recursos visuales: coinciden con la implementación entregada. Continúan el libro automático, los tres precios de revisión y la ausencia de video, flechas y pausa. Esta relectura no repitió la batería de navegador ni volvió a entrar a la cuenta GA4; sus resultados anteriores están fechados arriba. Los identificadores de despliegue son una fotografía de la consulta, no una garantía permanente del alias.

| Evidencia incluida en Git | Contenido |
| --- | --- |
| [Captura de escritorio](evidencias-portada-20261021/fluid-desktop.jpg) / [móvil](evidencias-portada-20261021/fluid-mobile.jpg) | Versión fluida publicada. |
| [Demostración MP4](evidencias-portada-20261021/libro-fluido.mp4) | Ensamblaje y cambio de hoja capturados de la web. |
| [Prueba de navegador del 21](evidencias-portada-20261021/verificacion-produccion-fluida.json) | Estados, anchos, precios, galería y consola. |
| [Hashes de publicación del 21](evidencias-portada-20261021/verificacion-recursos-fluidos.json) | Código, despliegue y siete SHA-256. |
| [Relectura pública del 22](evidencias-portada-20261021/verificacion-traspaso-20261022.json) | Alias consultado, HTML y siete hashes. |

Las seis capturas de referencias están enlazadas en el apartado 2. Son material de análisis; no se integraron como imágenes de la web. La carpeta completa local sigue en `C:/dev/artifacts/profefranciscopancho-20261021/`: incluye originales Higgsfield, capturas históricas, scripts y reportes Lighthouse. `libro-nanobots.mp4` representa la versión cuadrada descartada; no mostrarlo como el resultado actual. Usar `libro-fluido.mp4`.

## 7. Qué queda para una continuación

1. **Acabado visual:** recoger la valoración de Francisco sobre la versión fluida antes de asumir que el parecido buscado con sus referencias está resuelto. No restaurar cuadraditos, flechas o pausa visible por tratar documentos viejos como instrucciones actuales.
2. **Rendimiento:** mejorar el LCP y coste de arranque si se abre otro bloque de optimización; el último resultado fue 81/100 con LCP 4,05 s, no un objetivo de rendimiento ya cumplido.
3. **Medición real:** comparar vistas de precios, clics y registros durante unas dos semanas de tráfico. No existe evidencia de mejora comercial atribuible al rediseño. No leer pruebas propias como conversiones de clientes.
4. **GTM:** pendiente técnico si se decide retomarlo; GA4 directo ya funciona. No es necesario instalar herramientas de marketing de las referencias para cerrar este reporte.
5. **Posibles limpiezas:** Theatre.js/Goober siguen en `package.json` sin descargarse en la portada actual. Una limpieza de dependencias sería otro cambio con revisión de usos en el repositorio.

La web descrita está implementada y publicada. Las tarifas, corrección del nombre, libro automático y retiro de video/controles no están pendientes. Para contexto histórico: [plan y bitácora](PORTADA_MEJORAS_20261021.md) y [métricas](METRICAS_WEB_20261021.md). El antiguo `HANDOFF_PORTADA_REVISIONES_20261021.md` precede esas terminaciones y queda sustituido por este traspaso.
