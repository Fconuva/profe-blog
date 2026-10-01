# Lote gimnasio, Navidad y Halloween — 1 de octubre de 2026

Arte propio generado con la herramienta integrada de imágenes IA. Se pide una hoja transparente de cuatro orientaciones del mismo objeto, con cámara isométrica y diseño coherente. Los prompts exactos quedan en `prompts.json` y las hojas originales en `source/`.

`node scripts/furniture-october/import-sheets.js` extrae mecánicamente los cuadrantes SE, SW, NE y NW, comprueba alfa real y produce PNG con escala común y borde transparente en `estudiantes/assets/pieza/`. No redibuja ni elimina fondos por aproximación.

Objetos: banca, mancuernas con soporte, trotadora, bicicleta estática, árbol navideño, calabaza, caldero, fantasma, espantapájaros, canasto de dulces y farol. Los once son premios docentes, no elementos libres del inventario inicial.

Las habitaciones nuevas conservan el Canvas y usan geometría compatible con Tiled: 9×7, 9×9, 11×11 y L 9×9. Fuentes editables en `estudiantes/assets/mapas/`; la auditoría compara las casillas publicadas con el JSON y comprueba conectividad, bordes, colocación e ingreso de visitas.

No se importan muebles de otros juegos ni se modifican notas, intentos o premios de estudiantes reales durante las pruebas.

Validación local: build integral con 459 recursos críticos; auditorías de cuatro vistas RGBA distintas, escala, sets, regalos docentes no transferibles y bordes del mapa. Tiled 1.12.2 abrió y exportó `salon-l-9x9.json` sin cambiar el suelo. Dos sesiones ficticias comprobaron guardado/recarga, banca utilizable, visitas y cambio de tamaño; reducir a 5×5 o a la L se rechaza si un mueble quedaría fuera. Se conserva el Canvas y no se instala otro motor.

`preview-server.js` y `preview.html` son auxiliares locales, con identidades y base en memoria: las peticiones usan el módulo real `api/_salas.js`, nunca Firebase de producción. Estas fuentes y las hojas originales no se sirven públicamente.
