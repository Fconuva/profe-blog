# Continuación: imágenes IA de SIMCE Unidad 4

Fecha: 13 de octubre de 2026.

## Pedido vigente
Francisco pregunta cuáles miniensayos contienen imágenes creadas con IA e instruye que las infografías SIMCE se hagan con IA, no con SVG.

## Estado comprobado
Ninguno de los cinco miniensayos contiene actualmente imágenes creadas con IA. La Unidad 4 está publicada y habilitada; el cierre documentado está en el commit 13a90a00 y el contenido desplegado en 81b66763c303483003325116146f5707f5dd39f0. No se generaron imágenes ni se modificó el contenido en este bloque.

## Trabajo pendiente autorizado
- Miniensayo 1: convertir la tabla Biblioteca abierta en una pieza raster generada con IA. Datos exactos: 9:00–13:00, 60 visitas, 42 préstamos; 13:00–17:00, 80 visitas, 48 préstamos; 17:00–21:00, 90 visitas, 45 préstamos. Cinco días por horario; situación ficticia.
- Miniensayo 5: infografía IA del recorrido condicional de una semilla: animal come fruto, se desplaza y expulsa semillas, algunas llegan a un lugar apropiado, pueden germinar si mantienen su capacidad y existen condiciones adecuadas. No representar germinación garantizada.
- Miniensayo 5: afiche IA La reparación empieza antes de botar. Respetar los datos del catálogo, la revisión gratuita con repuestos no incluidos, doce casos por orden de llegada y las dos alternativas visuales descritas. No inventar información ni explicar las respuestas.
- Guardar originales y versiones publicadas; comprobar legibilidad, fidelidad de datos, correspondencia con preguntas y presentación móvil/escritorio/4K.
- Ampliar la lista pública del catálogo y el renderizador con imágenes y alternativas accesibles, sin exponer claves ni cambiar las respuestas.
- Actualizar manifiesto y auditoría de recursos; desplegar solo mediante npm run deploy:prod:safe y verificar imágenes reales en producción.

## Archivos de entrada
api/_simce-u4-catalog.js; api/_simce-u4-literature.js; estudiantes/simce-unidad4/unidad4.js; estudiantes/simce-unidad4/unidad4.css; scripts/audit-simce-u4.js; scripts/academic-release-manifest.json.

## Guardas para continuar
Leer AGENTS.md, REGLAS.md, BITACORA.md y la skill de plataforma del repositorio propietario. Leer la skill imagegen antes de generar. Preservar cambios ajenos; hay numerosos archivos sucios no relacionados. No usar git add -A. Usar el checkout aislado C:\dev\profe-blog-simce-u4-release para despliegue limpio si corresponde. No usar datos ni cuentas reales de estudiantes para QA.

## Motivo del cierre
Primera compactación de esta sesión. La instrucción AGENTS.md aportada por Francisco exige escribir el estado y pedir una sesión nueva después de una compactación. Continuar en sesión nueva desde este archivo sin rehacer el trabajo ya verificado.
