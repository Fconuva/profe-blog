# Presentación espejo de la guía aprobada

Solicitud de Francisco, 26-oct-2026: proyectar en pantalla grande y completar
la guía con el curso, con tiempos, publicada en Estudia CEST. Las tres tarjetas
pendientes del podcast se reemplazan por las etapas del vlog; solo la primera
clase se publica como material listo en esta entrega.

- Destino: `/nm3/vlog-mi-vida/`, presentación en `presentacion.html`.
- Fuente académica: `guia.html` de esta referencia. El generador extrae sus
  preguntas, lectura y tablas; el mapa está en
  `CORRESPONDENCIA_PRESENTACION.json`.
- PDF copiado sin cambios, SHA-256:
  `843c1c7a6a3334f16adf9de8ab626d7081215d8526529eecc82e80af20d99d42`.
- 33 diapositivas y ocho bloques continuos, 90 minutos previstos. La pantalla
  señala página de la guía, tiempo del bloque y lugar de respuesta. Los
  estudiantes trabajan en papel y cuaderno; no hay entrega web ni escrituras
  académicas.
- Reloj manual, pausa/reinicio, conservación entre diapositivas del mismo
  bloque; el bloque anterior se pausa al cambiar. No avanza diapositivas al
  vencer. Navegación por botones, selector, teclado y enlaces directos;
  ampliación de imágenes, pantalla completa y módulo compartido de pizarra.
- Libro original, pauta detallada, prompts y esta referencia permanecen fuera
  del despliegue. La versión pública contiene la guía aprobada y cuatro
  ilustraciones didácticas; el video se integra desde el original de YouTube,
  con enlace alternativo. No se aloja una copia del video de terceros.

## Verificación local

351 comprobaciones de navegador: todas las preguntas y la lectura coinciden
con su página de la guía; definiciones y preguntas de tablas conservadas;
PDF idéntico, fases continuas, tiempo, pausa, reinicio, finalización sin avance,
navegación, recarga por enlace, imagen ampliada y video correcto. 320/390 y
1366/1920/3840 sin desborde horizontal; ninguna diapositiva con contenido
cortado en escritorio. Cero errores JS y cero recursos locales rotos.
Las 33 capturas se abrieron en contactos visuales y se leyó la presentación
completa como estudiante, conservando preguntas en pantalla y respuestas
en papel. Los controles y las notas de uso docente no sustituyen el contenido.

`npm run build` aprobado, 857 recursos críticos. Portada NM3: todos sus enlaces
y medios históricos conservados; introducción antigua archivada en un
desplegable para distinguirla del proyecto actual. Calendarios NM3 alineados
con el inicio del 30-octubre, sin atribuir aplicación ni entrega a esa fecha.

Publicación y comprobaciones públicas se registran tras el despliegue seguro.
