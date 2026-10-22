# Cierre: rediseño «luz y partículas» de la portada (22-oct-2026)

Rama `mejora/portada-clara-20261021`. Reemplaza el rediseño del 21-oct (commit 0320e30a y
`HANDOFF_CLAUDE_REDISENO_WEB_20261022.md`), que Francisco rechazó: «parece windows 98».

## Qué pidió Francisco

- Algo más cercano a sus referencias (Active Theory, Fitosauna, Mubien), mejorado con HyperFrames.
- Eligió la dirección **«Luz y partículas (Active Theory)»** y el alcance **«Inicio + estilo de toda
  la página»**: un loop mudo hecho con HyperFrames en el inicio y el estilo nuevo en toda la portada.
- Sabe que este loop mudo no es el video que pidió quitar el 21-oct.

## Qué cambió

| Archivo | Cambio |
|---|---|
| `index.njk` | El inicio usa `.hero-media`: un póster en `<picture>` (escritorio 16:9, celular 9:16) y un `<video>` mudo que se carga después. El resto del contenido, los precios, los IDs y los atributos `data-event`/`data-location` quedan iguales. |
| `_includes/layout-home.njk` | `theme-color` #04090b, precarga de los dos pósters por media query y `?v=20261022a`. Se quitó `home-motion.css`. |
| `css/home.css` | Hoja única y legible, con el estilo nuevo: fondo #04090b, cian #5fe0d0, hielo #bef8ff, ámbar #f0b46a; Poppins 400 en los títulos y Inter en el texto; nav y botones en píldora. Los precios de los módulos van en filas, no en tarjetas. El panel de consentimiento usa la misma paleta. |
| `js/home.js` | `loadVideo()` elige `luz-movil` o `luz-escritorio`, inyecta WebM y MP4, y parte tras `decode()` del póster + 300 ms + idle. No se carga con movimiento reducido ni con ahorro de datos. Se pausa fuera de pantalla y en una pestaña oculta. |
| `scripts/home-interactions.js` | El parallax ahora apunta a `.hero-media`. |
| `scripts/build-site.js` | Ya no compila `home-motion`. |
| `css/home-motion.css`, `scripts/home-motion.js` | Eliminados (escena Three.js). |
| `imagenes/portada-2026/luz-*` | Pósters WebP (23 kB y 15 kB) y loops WebM/MP4: escritorio 2,1/2,7 MB, celular 1,0/1,3 MB. |

Fuente del loop: proyectos HyperFrames v0.8.185 en
`C:/dev/artifacts/profefranciscopancho-20261022/hero-luz/` y `hero-luz-movil/` (escena en canvas:
libro de luz con partículas).

## Verificación (servidor local de `_site`, Playwright)

- **1440, 1024, 390 y 320 px**: sin desplazamiento horizontal (`scrollWidth` = `clientWidth`,
  `scrollX` queda en 0). La barra horizontal de las capturas en 1440 es de la ventana de Playwright,
  que mide 1280 y emula 1440; no es de la página.
- **Video**: carga `luz-escritorio.webm` en escritorio y `luz-movil.webm` en celular; avanza y queda
  con `is-playing`.
- **Movimiento reducido**: video oculto y sin fuentes; queda solo el póster.
- **Foco con teclado**: contorno sólido de 2 px #bef8ff.
- **Consola**: 0 errores; solo el aviso informativo de `beforeinstallprompt`.
- **LCP local**, con 4G lenta simulada (150 ms, 1,6 Mbps): ~0,5 s, y el elemento LCP es el titular.
  No es un puntaje de Lighthouse: Lighthouse no está instalado en este PC y no se instaló.
- **Pruebas**: `node --test tests/marketing-metrics.test.js tests/marketing-registration.test.js`
  da 9/9.

### Ajustes hechos durante la verificación

- El precio grande del plan completo no se aplicaba: el selector era `p.price` y el elemento es un
  `div`. Ahora es `.complete-plan>.price`.
- En 320 px «CLP» se caía a otra línea: el precio va con `nowrap` y baja a 2,55rem bajo 360 px.
- El menú abierto en el celular dejaba ver el titular detrás: ahora tiene fondo opaco y sombra.

## Publicado

El rediseño está en producción desde el commit 15a8095a, con el OK de Francisco («Hazlo tiene smi ok»).

## Segunda vuelta: figura 3D en «Así trabajamos contigo» (22-oct-2026)

Francisco: «me gusto , la primera parte me encanta , pero siento que podriamos agregar algo en 3D , el
asi trabajmos contigo». Eligió **«Partículas que cambian»**.

- `js/home-process3d.js`: una figura de partículas de luz en WebGL puro, sin Three.js. Usa 6.000
  puntos en escritorio y 3.500 en celular. La forma cambia con el scroll:
  1. Globo de WhatsApp con tres puntos.
  2. Libro abierto con cinta ámbar.
  3. Rúbrica con visto bueno ámbar.
  4. Escalera con el último peldaño encendido.
- **En escritorio**, la figura queda fija a la derecha y los pasos pasan por la izquierda. El paso
  activo va en opacidad plena y los demás en 0,38. **En celular**, la figura ocupa la franja entre la
  barra y la tarjeta del paso; la tarjeta tiene fondo opaco.
- **Cuándo carga**: el script se pide a 600 px de la sección y solo dibuja mientras la sección está
  visible y la pestaña abierta.
- **Cuándo no carga**, y quedan las tarjetas con sus ilustraciones:
  - con movimiento reducido o ahorro de datos;
  - en equipos con menos de 4 núcleos o menos de 3 GB de memoria;
  - si WebGL no parte o pierde el contexto.
- **Lo que se quitó**: la galería horizontal fijada de escritorio (GSAP), el contador «01 / 04» y la
  barra de avance. La figura ocupa su lugar.
- **Lo que no cambió**: textos, enlaces, `data-event`/`data-location`, imágenes y precios.

### Verificación

Se verificó con Puppeteer sin ventana, con gráficos por software, en cuatro tamaños: 1440×900,
1024×768, 390×844 y 320×640.
- Las cuatro figuras se reconocen. El paso activo coincide con la figura.
- No hay desborde horizontal ni errores de consola.
- Con movimiento reducido, el script no se descarga y quedan las ilustraciones.
- Las pruebas de marketing dan 9/9.

### Publicación

Francisco dio el OK el 22-oct («publica , ok»). Se publicó con el merge 2e05de15 en `main`, que
incluye el ajuste de Estudia CEST que ya estaba en `main` (8d6b5748, solo `estudiacest/`). En
producción, con capturas a 1440 y 390 px, la figura carga, el paso activo calza, no hay desborde y no
hay errores.

## Pendiente

- `three` 0.182.0 sigue en `package.json`, aunque la portada ya no lo usa. Quitarlo solo si Francisco
  lo aprueba y tras revisar que ninguna otra página lo importe.
- `css/tw.css` queda modificado localmente porque el build lo regenera. No se sube: Vercel lo
  genera al publicar.
