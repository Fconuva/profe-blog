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

## Cierre de publicación

Publicada mediante `npm run deploy:prod:safe`, proceso terminado con código 0.
Despliegue `dpl_F1BgdnApfDMLf9YK2cBTuPJt5Kf8` READY, proyecto
`prj_v2yUaXflcSoBgunqmn1rAEfh0KMR`, commit
`ba6ca16ab1133d3eff2f3184ed3833b801b21905` y alias
`www.estudiacest.com` releídos por API autenticada de Vercel.

213 comprobaciones públicas aprobadas: doce recursos idénticos por SHA-256,
PDF aprobado intacto, tres tarjetas antiguas ausentes y tres nuevas presentes,
ingreso desde NM3 a la presentación, 33 diapositivas en 390/1366/3840 sin
desborde horizontal y sin contenido cortado en escritorio, reloj real,
pausa, conservación entre pantallas, pantalla completa, panel de pizarra,
dibujo, aislamiento de trazos por diapositiva y recuperación al volver,
ampliación de imagen, video original integrado, enlace directo tras recarga y
calendarios actualizados. Referencia interna con 404; cero errores JS.
Captura pública de la portada revisada visualmente. La navegación pública no
requiere sesión; no se usaron datos de estudiantes ni se escribieron registros.

Acceso docente: `https://www.estudiacest.com/nm3/vlog-mi-vida/presentacion.html`.
Seleccionar Pantalla completa y usar Iniciar tiempo al comenzar cada bloque.
