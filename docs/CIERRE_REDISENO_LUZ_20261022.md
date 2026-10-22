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

## Pendiente

- **Publicar en producción**: pasar la rama a `main` despliega en Vercel. Solo con el OK de
  Francisco, después de que vea las capturas.
- `three` 0.182.0 sigue en `package.json`, aunque la portada ya no lo usa. Quitarlo solo si Francisco
  lo aprueba y tras revisar que ninguna otra página lo importe.
- `css/tw.css` queda modificado localmente porque el build lo regenera. No se sube: Vercel lo
  genera al publicar.
