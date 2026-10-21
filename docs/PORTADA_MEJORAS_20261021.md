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
| Active Theory | Profundidad e interacción visual | Obra original de Higgsfield con una capa 3D que responde suavemente al puntero |
| Fitosauna | Producto protagonista y acciones comerciales claras | El paquete completo, los módulos y sus precios en un mismo bloque |
| Mubien | Tipografía, espacios y composición editorial | Mensajes breves, navegación pequeña y ritmo visual sobrio |

Dirección: rediseño visual completo, una sola paleta oscura y acento azul hielo. Variación 7, movimiento 5, densidad 3. La referencia es estética: no se copian sus textos, marcas, imágenes ni código.

## Plan aplicado

1. **Oferta**: una cabecera con el Portafolio Docente y dos acciones, inscribirse o consultar precios. Quitar el video y los tres motores GSAP externos de la portada anterior.
2. **Precios**: un paquete destacado y tres módulos breves. Conservar $79.990, $99.990, $79.990; completo $200.000 con cupo confirmado y $240.000 por sobrecupo. Las combinaciones parciales suman sus módulos. Mostrar transferencia y máximo dos cuotas según la regla comercial actual.
3. **Proceso**: confirmar cupo, aportar contexto, recibir y revisar, continuar con apoyo. Explicar qué hacemos nosotros y qué valida el docente.
4. **Confianza**: identidad del profesor y vínculo al certificado existente. Retirar de la portada los carruseles de testimonios, cifras sin fuente y promesas absolutas.
5. **Inscripción**: conservar `/cuenta/crear-cuenta.html`; acceso de clientes a `/dashboard/`. WhatsApp conserva el número publicado. ECEP y Taller IA siguen accesibles desde el pie.
6. **Movimiento**: Three.js y Theatre.js para la obra; Goober para el control interactivo. Carga diferida, límite de resolución y fotogramas, pausa fuera de pantalla, control manual y alternativa estática. Móvil, ahorro de datos y movimiento reducido reciben la imagen sin motor 3D.
7. **Distribución**: imagen Open Graph, manifiesto con iconos e instalación PWA. El service worker solo ofrece una página de desconexión al navegar a la portada; no intercepta ni guarda cuentas, pagos, API o paneles.
8. **Medición**: conservar la integración GA4 ya publicada. Medir precios vistos, clics de registro, WhatsApp e inscripción completada; no confundir un clic con una venta. Estado y pruebas en `METRICAS_WEB_20261021.md`.

## Tecnología seleccionada

Se añaden solo Three.js, Theatre.js, Goober y el empaquetador para la capa visual. No hacen falta WordPress, WooCommerce, PHP, MySQL, Nginx, Backbone, Marionette, Bootstrap, jQuery, Swiper, FancyBox ni Lenis para este resultado. Vercel mantiene alojamiento y transporte; HTTP/3 depende de la infraestructura y de la negociación del navegador. No se afirma haberlo configurado en el código.

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
