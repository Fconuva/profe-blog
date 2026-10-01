# Mi casa: plan de expansión visual e interactiva

Estado: trabajo local, **no publicar ni asignar a estudiantes todavía**. La casa actual 5 × 5/7 × 7, muebles, premios, chat y guardado siguen siendo la referencia funcional.

## Decisión técnica

Usar **Tiled como editor de habitaciones**, no como motor del juego. Un adaptador pequeño lee su JSON isométrico, valida las casillas y entrega al Canvas actual suelo, huecos, objetos y rutas. Evita migrar ahora el inventario, Firebase, chat y permisos a otro framework. El primer experimento está en `scripts/mi-espacio-lab/` y no se carga en el panel del estudiante.

## Etapas y pruebas de salida

| Etapa | Trabajo | Prueba para avanzar |
|---|---|---|
| 1. Mapa irregular | Importar JSON Tiled 7 × 7, dibujar salón en L, conservar huecos y calcular rutas alrededor de muebles. | Clic en hueco rechazado; recorrido entre alas confirmado; sin errores ni desborde a 390, 1200 y 3840 px. |
| 2. Integración segura | Ofrecer el salón en L como opción de casa, con migración desde 5 × 5/7 × 7; adaptar paredes, muebles de muro, cámara, visitas, colocación y reducción. | Guardar y releer en Firebase; dos usuarios ven la misma geometría; ningún mueble queda fuera; casas antiguas sin cambios. |
| 3. Interacciones | Declarar acciones por tipo de mueble (sentarse, acostarse, encender, tocar, bailar, mirar) y animaciones por fotogramas. | Cada acción inicia y termina sin atascar movimiento, persiste solo si corresponde y respeta el bloqueo docente. |
| 4. Personaje y ropa | Reemplazar gradualmente el dibujo rígido por capas de sprites para peinado, rostro, camiseta, pantalón y accesorios; conservar los looks guardados. | Todas las 94 opciones actuales siguen visibles y las seis camisetas no desaparecen; gestos coherentes en cuatro orientaciones. |
| 5. Espacios sociales | Puertas entre habitaciones, aforo, presencia, chat moderado y efectos compartidos. Evaluar otro servidor solo si Firebase deja de cubrir latencia y costo. | Prueba con varios usuarios, reconexión, permisos, moderación y carga móvil; sin datos personales en recursos públicos. |

No se incorporan sprites ni código de otros juegos sin permiso de uso. Tiled define la geometría; el arte sigue siendo propio o con licencia comprobada. PixiJS se vuelve candidato solo si las mediciones de Canvas muestran un límite real de rendimiento; Colyseus solo si el multijugador necesita un servidor persistente.

## Resultado del primer experimento

El laboratorio `scripts/mi-espacio-lab/` ya prueba la etapa 1 sin cuentas ni Firebase. Tiled 1.12.2 abrió y reexportó el archivo `sala-en-l.json`; el adaptador volvió a leer ese export con 40 casillas de suelo, tres muebles y entrada en (1,1). En el navegador se hizo clic en un hueco y fue rechazado; otro clic recorrió una ruta de 11 casillas hasta (6,6). Zoom, arrastre y centrado funcionaron a 390, 1200 y 3840 px sin errores de consola, solicitudes fallidas ni desborde horizontal. Ejecutar `node scripts/mi-espacio-lab/probar.js` para repetir la prueba de navegador.

## Avance de la etapa 2 (solo local)

La geometría de Tiled se compiló en `estudiantes/js/mapas-casa.js` y se añadió «Salón en L 7 × 7» a la selección de `Mi casa`. El panel pinta únicamente las 40 baldosas, dibuja muros por borde expuesto, limita rutas/clics/colocación al suelo y rechaza el cambio de forma si algún mueble quedaría fuera; el avatar se recoloca en la entrada cuando corresponde. La API de presencia también valida coordenadas según la casa del dueño. Las visitas observan en tiempo real los cambios de casa y pieza sin leer el perfil escolar.

Prueba automática del panel real con Firebase y API simulados: habitación 5 × 5 conservada, paso a 7 × 7, cambio a L guardado y releído, mueble fuera que bloquea el cambio, hueco que no mueve al avatar ni coloca muebles, recorrido hasta (6,6), y actualización de la geometría al visitar a otro dueño. Capturas e inspección a 390 y 1200 px, sin errores ni desborde; `npm run build` aprobó 407 recursos críticos. **Pendiente antes de publicar:** probar con dos cuentas reales y Firebase autenticado la persistencia, las visitas simultáneas y la reconexión. Los muebles del mapa de laboratorio son solo ejemplos: no se importan a la casa ni evaden los premios.

Límite deliberado del adaptador: solo mapas finitos de 5 a 12 casillas por lado, baldosa 151 × 106, GID 1 para suelo y 0 para hueco, y objetos puntuales `entrada`/`mueble`. Todavía no procesa atlas múltiples, alturas, puertas ni exportaciones comprimidas; cualquiera de ellas requiere prueba y validación propia antes de integrarse.
