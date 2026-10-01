# Kit de avatar de 50 imágenes

Solicitud del 1 de octubre de 2026. Estética pixel art isométrica inspirada en las referencias del docente, con personajes originales, no sprites extraídos de Habbo.

50 recursos: 10 ojos, 10 bocas, 10 peinados, 10 gestos y 10 vistas/poses. Una generación IA independiente por recurso, con fondo transparente. Los archivos originales se conservarán en `source/`; derivados optimizados, en `estudiantes/assets/avatar-kit/`.

El kit complementa el personaje personalizable; no reemplaza ni borra su ropa, camisetas, regalos o XP. Los gestos reales se dibujan en la habitación con su propio look. Las vistas de caminar, sentarse y acostarse se usan como referencias y previews, no conceden muebles ni permiten saltarse colisiones.

Creado: 50 originales RGBA y 50 derivados optimizados (menos de 1 MB en conjunto). Generación con la herramienta integrada, una llamada por imagen; referencia común de identidad conservada. Los prompts exactos están en `prompts.json` y los originales en `source/`.

Integración: previews reales en ojos/boca/peinados, diez controles de gestos compartidos con el servidor y diez poses de prueba con la ropa propia. El Canvas nativo mejora silueta, mechones, volumen facial, iris, párpados, nariz, costuras y calzado; usa raster pequeño, caché acotada y escalado sin suavizado. Cuatro orientaciones, paso alternado, parpadeo y reducción de movimiento. Se conservan la ropa, los regalos y los umbrales de XP existentes.

Validación local: cincuenta hashes distintos, alfa y márgenes comprobados, treinta previews y variantes nativas distintas, selección/guardado/recarga, diez latidos de gestos aceptados y valores extraños descartados, tres tamaños de pantalla, auditorías previas de ropa/muebles/XP y build integral con 589 recursos. Datos exclusivamente ficticios. Cierre y publicación en la bitácora canónica.
