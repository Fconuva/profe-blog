# Portada comercial: análisis y plan de mejora

Encargo de Francisco, 21 de octubre: quitar el video y responder qué ofrecemos, cómo lo hacemos, cuánto cuesta y dónde inscribirse. Referencias elegidas: [Active Theory](https://activetheory.net/), [Fitosauna](https://fitosauna.com/) y [Mubien](https://mubien.com/). Francisco confirmó conservar la plataforma actual; no migrar cuentas, pagos ni paneles a WordPress/WooCommerce.

## Diagnóstico de la portada anterior

- Video automático en la cabecera, numerosas secciones, dos explicaciones del proceso, listados de agentes e implementación, cifras y testimonios desplazándose. Los precios estaban después de este recorrido.
- Navegación con ocho destinos compitiendo y varios productos en la misma cabecera. Inscripción, consulta y acceso de clientes no tenían jerarquías claras.
- Condiciones contradictorias: tres y seis cuotas en la portada, dos en la regla vigente de Portabot. Mensajes absolutos de resultado y riesgo de plagio que no aportan una explicación verificable del servicio.
- Ya había logo, fuentes locales, cuenta, formulario, Drive y panel. Se conservan las rutas y los servicios existentes.

## Qué tomar de las tres referencias

| Referencia | Aporte elegido | Aplicación |
|---|---|---|
| Active Theory | Escena tridimensional que cambia con la interacción | Escultura de hojas independientes, luz, órbita, giro y respuesta al cursor y al avance de la portada |
| Fitosauna | Secciones fijas que presentan una secuencia y llamadas comerciales claras | Recorrido del trabajo fijado durante el desplazamiento; oferta y precios antes de esa secuencia |
| Mubien | Galería espacial, acercamiento de imágenes y transiciones amplias | Cuatro escenas que avanzan horizontalmente, zoom y leve giro de imágenes, títulos con entrada por líneas |

Dirección revisada tras la corrección de Francisco: portada para docentes con lenguaje inmersivo de estudio creativo, paleta oscura y acento azul hielo. Variación 8, movimiento 8, densidad 3. Skills aplicadas: design-taste-frontend, gsap-core, gsap-scrolltrigger y gsap-performance. Se observaron las tres referencias ejecutándose en navegador, con cambios de cursor y desplazamiento; no solo su texto o inventario de tecnologías. La referencia es estética: no se copian sus textos, marcas, imágenes ni código.

## Plan aplicado

1. **Oferta**: una cabecera con el Portafolio Docente y dos acciones, inscribirse o consultar precios. Quitar el video y los tres motores GSAP externos de la portada anterior.
2. **Precios**: un paquete destacado y tres módulos breves. Conservar $79.990, $99.990, $79.990; completo $200.000 con cupo confirmado y $240.000 por sobrecupo. Las combinaciones parciales suman sus módulos. Mostrar transferencia y máximo dos cuotas según la regla comercial actual.
3. **Proceso**: confirmar cupo, aportar contexto, recibir y revisar, continuar con apoyo. Explicar qué hacemos nosotros y qué valida el docente.
4. **Confianza**: identidad del profesor y vínculo al certificado existente. Retirar de la portada los carruseles de testimonios, cifras sin fuente y promesas absolutas.
5. **Inscripción**: conservar `/cuenta/crear-cuenta.html`; acceso de clientes a `/dashboard/`. WhatsApp conserva el número publicado. ECEP y Taller IA siguen accesibles desde el pie.
6. **Movimiento**: Three.js dibuja hojas independientes con geometría curva y GSAP/ScrollTrigger anima títulos, lectura, imágenes y galería. La escultura tiene 17 hojas en escritorio y 11 en móvil; tope de 40/28 fotogramas y resolución 1,5/1,25. Los shaders se preparan asincrónicamente. Pausa al salir de pantalla, con pestaña oculta o botón global. Ahorro de datos y movimiento reducido reciben el contenido estático. La imagen original de Higgsfield funciona si WebGL falla.
7. **Distribución**: imagen Open Graph, manifiesto con iconos e instalación PWA. El service worker solo ofrece una página de desconexión al navegar a la portada; no intercepta ni guarda cuentas, pagos, API o paneles.
8. **Medición**: conservar la integración GA4 ya publicada. Medir precios vistos, clics de registro, WhatsApp e inscripción completada; no confundir un clic con una venta. Estado y pruebas en `METRICAS_WEB_20261021.md`.

## Tecnología seleccionada

La ampliación añade GSAP 3.14.1, versión exacta. Ninguna dependencia existente cambia de versión. La capa actual utiliza Three.js y GSAP; los paquetes Theatre.js y Goober de la primera versión ya no forman parte del JavaScript que descarga la portada. No se migra el sistema de cuentas ni de pagos. Vercel mantiene alojamiento y transporte; HTTP/3 depende de la infraestructura y de la negociación del navegador.

GA4 funciona con su etiqueta oficial directa. Tag Manager mostró una pantalla vacía y no se instaló un contenedor. Clarity, Pixel, Klaviyo y Trustpilot no se añaden solo por aparecer en el inventario de las referencias: no son necesarios para el objetivo aprobado y no se inventan cuentas, campañas, reseñas ni identificadores.

## Recurso de Higgsfield

Modelo `gpt_image_2_5`, alta calidad, 2K, 16:9; trabajo `a552ab89-c323-457c-9ba7-eba5d3991a78`, finalizado y abierto para revisión. Estimación previa: 2,75 créditos. Escultura de páginas de vidrio, fondo oscuro, luz azul y ámbar, sin personas, logotipos ni texto generado. Se publican versiones WebP; original guardado en `C:/dev/artifacts/profefranciscopancho-20261021/obra-higgsfield.png`. La imagen del docente ya existía en el repositorio y se reutiliza como ilustración.

## Medir después de publicar

Comparar durante dos semanas vistas de precios, clics a inscripción y WhatsApp, y registros reales. No hay una línea base previa suficiente para prometer aumento de conversión. Ajustar el texto o la jerarquía según esos resultados, sin sumar secciones por intuición.

## Comprobación previa a publicar

- Compilación completa y nueve pruebas de métricas/registro correctas. Las versiones de paquetes que ya existían no cambiaron.
- Navegador en 320, 390, 800, 1024 y 1440 píxeles: sin desplazamiento horizontal. Menú móvil abre, navega al precio y cierra. Ninguna imagen local rota ni error de JavaScript.
- Seis secciones y ningún video/iframe en la portada. A 1440 píxeles, el título ocupa dos líneas y las acciones quedan visibles. Los textos conservan tildes y ñ.
- Three dibuja y responde al puntero. Instrumentación temporal del navegador: el contador pasó de 85 a 95 llamadas al dibujado; al detener el movimiento quedó en 95 durante la comprobación. Sin instrumentación en producción.
- Movimiento reducido: no se carga el motor y el contenido sigue visible. Las entradas de sección no ocultan contenido si el observador no se ejecuta.
- PWA instalada/activada en localhost; en una prueba aislada con fallo real de red, la navegación a `/` mostró **Sin conexión | Profe Francisco**. El modo offline simulado de DevTools no corta por sí solo las peticiones internas de un service worker, por lo que no se usó como prueba de ese resultado.
- Capturas de escritorio, móvil y página completa en `C:/dev/artifacts/profefranciscopancho-20261021/`.

## Publicado y comprobado

El 21 de octubre quedó publicado el código `2628ec51aa6aa01706cfc9cba16327ea7416ff4e`, despliegue `dpl_DRbCM3GXWzWG8ZngV4PYqJZnDtML`, READY. Se promovió esa versión después de comprobar que un despliegue automático tardío de la documentación de métricas había vuelto a asignar el dominio a una versión anterior. El duplicado automático de las métricas que seguía construyéndose se canceló; la nueva portada conserva toda su integración.

Comprobación en `https://www.profefranciscopancho.com/`: título nuevo, seis secciones, cero videos; enlaces de precios e inscripción correctos y sin errores de JavaScript en Chrome. Los SHA-256 de JavaScript, configuración, imagen, service worker y página offline coinciden con lo revisado. CSS coincide con el blob de Git y con la fuente local al normalizar los finales de línea. Captura de producción: `C:/dev/artifacts/profefranciscopancho-20261021/portada-publicada.jpg`.

21-oct-2026: a petición de Francisco, se corrigió el nombre del logo de cabecera y pie a **Profe Francisco**, con mayúsculas iniciales y sin punto final; el cambio de plantilla se limita a esos dos textos.

## Ampliación solicitada: efectos visibles y revisiones

La observación de Francisco fue correcta: la primera versión apenas deformaba una imagen y no recogía la navegación de las referencias. Se volvió a observar cada sitio en un navegador con JavaScript, puntero y desplazamiento. Las capturas de referencia y comprobación están en `C:/dev/artifacts/profefranciscopancho-20261021/` (prefijos `active-`, `fitosauna-`, `mubien-` y `motion-`).

La nueva escena tiene hojas curvas independientes, apertura con el desplazamiento y giro con el cursor. La galería fija el proceso y desplaza cuatro escenas horizontalmente, con acercamiento de imágenes. En móvil las escenas quedan apiladas y la escultura utiliza menos geometría. Los botones responden al puntero, los módulos se inclinan y los títulos entran por líneas y recuperan opacidad por palabras. Se conserva el cursor nativo. El control global revierte la galería y detiene la escena; movimiento reducido y ahorro de datos conservan el contenido completo.

Se añadieron **revisiones M1 $25.000, M2 $30.000 y M3 $20.000 CLP**, separadas de la elaboración, según la regla y afiche vigentes de Portabot. Incluyen informe, recomendaciones, rúbrica y hoja de niveles estimados. La revisión orienta las correcciones y no escribe el módulo. Su contratación lleva a WhatsApp, ya que no se presupone que el selector actual del panel venda revisiones. La bitácora de Portabot se contrastó para describir contexto, materiales editables, revisión y entrega sin convertir reglas o casos históricos en promesas absolutas; ningún dato ni archivo de clientes se publica.

Comprobación local: compilación de 306 páginas, nueve pruebas de métricas y registro correctas, revisión en 320, 390, 800, 1024 y 1440 píxeles sin desbordamiento ni imágenes rotas. No hay videos ni iframes. La escena dibuja, responde al puntero y se detiene al pulsar pausa; la galería se fija y desplaza. Sin JavaScript y con movimiento reducido se conservan precios y contenidos.

Lighthouse 12.8.2 de la primera ampliación, móvil emulado sobre servidor local: **rendimiento 82, accesibilidad 100**, LCP 3,8 s, CLS 0,002 y bloqueo total 240 ms. Son mediciones de laboratorio, no datos de visitantes ni una medición de producción. La primera prueba dio rendimiento 60 y 1.800 ms de bloqueo; la preparación asíncrona de shaders redujo ese coste. Reporte: `lighthouse-motion-final.json` en la carpeta de evidencias. Los objetivos de campo deben contrastarse con datos reales posteriores.

## Libro de campos y ensamblaje de partículas

Francisco precisó después que prefería un libro giratorio con las plantillas de DocenteMás y los campos que completan los profesores, con efecto de nanobots. Se sustituye la escultura abstracta por un libro con tapas, lomo, hojas curvas y paso real de página en ambos sentidos. Las partículas ensamblan sus superficies y se desprenden durante el cambio de hoja. La lectura queda limpia cuando termina el ensamblaje.

Las cuatro páginas ilustrativas representan contexto propio, planificación M1, ficha de clase grabada M2 y trabajo colaborativo M3. Su aspecto se contrastó con `herramientas/plantilla_docentemas_form.html` de Portabot; los nombres de campos, con ese formato, el texto del Manual 2026 de 7°/8° y Media y los rótulos actuales del panel. [Fuente pública oficial](https://www.docentemas.cl/documentos-descargables/manuales-de-instrumentos/). Son campos abreviados en blanco, sin respuestas, datos personales ni copia de un portafolio. No se presentan como el formulario oficial completo ni universal: la vista indica que cambian según modalidad.

La página del contexto usa los rótulos propios de `dashboard/index.html`; no consulta Firebase ni abre un expediente. Las texturas se dibujan con texto real en canvas, sin texto inventado por un modelo de imágenes. El recurso estático actual procede del mismo libro renderizado; el original previo de Higgsfield se conserva en la carpeta de evidencias.

Flechas accesibles permiten cambiar de hoja, también con el movimiento pausado. Se conservan el proceso horizontal y los efectos de la ampliación anterior, junto con sus precios y métricas. La nueva escena reduce sus partículas en móvil y mantiene preparación asíncrona de shaders, pausa fuera de pantalla y alternativa estática.

La ampliación anterior (`834c87c2`, despliegue `dpl_AxsHATu2W4DXTmEw3H5cTCXkAuBk`) quedó publicada y comprobada antes de este ajuste: siete recursos coincidieron por SHA-256, la galería se fijó y desplazó, la escena dibujó y se detuvo, precios de revisión correctos y cero errores de JavaScript en escritorio/móvil. Prueba: `verificacion-produccion-efectos.json` en la carpeta de evidencias.

Verificación del libro: siguiente/anterior cambian de módulo, la hoja curva gira en pantalla y los controles también cambian la vista con la animación pausada. El foco de teclado queda visible en la galería; en móvil la flecha no está cubierta por la pausa ni por la barra de inscripción. Sin errores de JavaScript, imágenes rotas, desbordamiento o videos en 320, 390, 800, 1024 y 1440 píxeles; sin JavaScript, movimiento reducido y ahorro de datos conservan contenido y precios. Se mantienen las nueve pruebas de métricas y registro aprobadas.

Lighthouse del libro final: **rendimiento 86, accesibilidad 100**, LCP 3,6 s, bloqueo total 140 ms y CLS 0,002 en móvil emulado local. Reporte `lighthouse-libro-final.json`; mismas limitaciones de laboratorio indicadas arriba. Se priorizan imagen y fuentes antes de cargar el motor tridimensional. La vista estática renderizada pesa 28 KB a 1920 píxeles y 11 KB a 960.
