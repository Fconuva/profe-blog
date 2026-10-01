# Set de terraza, paredes y experiencia docente

Lote solicitado el 1 de octubre de 2026. Arte original generado con la herramienta integrada de imágenes IA; hojas RGBA con cuatro vistas SE/SW/NE/NW. Los prompts y fuentes se conservan aquí y los sprites se extraen mecánicamente, sin redibujarlos ni sustituir la transparencia.

Objetos: tres tamaños de piscina, cascada, pasto, árboles variados y mecedoras; se completa la terraza con tumbona, mesa y sombrilla. Todos son premios manuales del profesor, fuera del kit automático PAES G15–G21.

Implementado: seis acabados regalables (piedra, madera, ladrillo blanco, jardín vertical, azulejo azul y muros bajos de terraza). El profesor los entrega desde el admin PAES, individualmente o en sets por estudiante, curso y tarea entregada. El estudiante los aplica en «Muros»; regalar pasto también habilita el piso de jardín.

«Dar experiencia o subir de nivel» consulta el XP actual, muestra una vista previa y exige confirmación. El servidor conserva el XP académico y registra el regalo aparte, con motivo e identificador de operación; no se duplica al reintentar ni se pierde cuando el estudiante termina otra tarea. «Subir de nivel» solo permite aumentar, hasta el nivel 200.

Piscinas de 2 × 2, 3 × 2 y 4 × 3 casillas, con agua animada. Cascada animada en las vistas frontales. Se validan huella, rotación, solapamientos, bordes y reducción de habitación. La mecedora permite sentarse y la tumbona acostarse. Las visitas ven la decoración del dueño y no pueden modificarla. Los efectos respetan la preferencia de movimiento reducido.

Fuentes RGBA: `source/`. Prompt de cada objeto: `prompts.json`. Sprites publicados: `estudiantes/assets/pieza/terrace*_{SE,SW,NE,NW}.png`. Los previews de paredes se construyen por código nativo (`build-finishes.js`) para coincidir con el Canvas; no son imágenes IA.

Validaciones: `node scripts/audit-house-terrace-xp.js`, `node scripts/preview-house-terrace-xp.js`, auditorías anteriores de muebles/ropa y `npm run build`. Pruebas de navegador real con funciones y datos ficticios a 390/1200/3840 px. El cierre en `BITACORA.md` registra publicación y comprobación remota.

No se otorgan premios ni XP reales arbitrariamente durante las pruebas. No se modifican notas, entregas ni credenciales.
