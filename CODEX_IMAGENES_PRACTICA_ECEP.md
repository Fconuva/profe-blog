# Codex: imágenes de la sección Práctica ECEP 2026

Documento de encargo. Aquí está todo lo necesario para agregar o mejorar **figuras e ilustraciones**
en las pruebas de práctica, sin romper nada. Léelo completo antes de tocar un banco.

Repo canónico del sitio: `C:\dev\profe-blog` (Eleventy). Deploy = `git push` a `main`,
**nunca** `vercel deploy` (una vez eso revirtió producción a una versión vieja).

---

## 1. Qué es esta sección y dónde vive cada cosa

`/evaluaciones/practica/` son **27 pruebas de práctica de 60 preguntas nuevas** creadas según el
temario oficial ECEP 2026. Se rinden completas y la corrección aparece al finalizar.

| Qué | Dónde |
|---|---|
| Portada con las 27 tarjetas | `evaluaciones/practica/index.njk` |
| Página de cada prueba | `evaluaciones/practica/<id>/index.njk` |
| Banco de preguntas | `js/practica/<id>.js` |
| Motor que las rinde | `js/ecep-practica.js` (modo examen: corrige al final) |
| Análisis que originó cada banco | `2026/EvaluacionDocente2026/ECEP_INGENIERIA_INVERSA_PRUEBAS_2024/ANALISIS_<id>.md` |
| Reglas de construcción de ítems | `..._SPEC_CONSTRUCCION_PRACTICA.md` (misma carpeta) |

Los 27 `<id>`: generalista, lenguaje, matematica, historia, ciencias, ingles-b, ef-basica,
musica-basica, artes-basica, tecnologia, religion, parvularia, dea, di, tea, tel, media-lengua,
media-matematica, media-historia, media-biologia, media-fisica, media-quimica, media-ingles,
media-filosofia, media-edfisica, media-artes, media-musica.

---

## 2. Formato de un ítem (lo único que puedes tocar es la figura)

```js
window.PRUEBA = {
  id: "practica-<id>",
  titulo: "Práctica ECEP 2026 · <Nombre>",
  preguntas: [
    {
      n: 12,
      textoBase: "...",          // opcional: estímulo escrito
      svg: "<svg ...>...</svg>", // opcional: figura vectorial (datos, esquemas)
      imagen: "/imagenes/ecep/practica/<id>/n12.webp",  // opcional: ilustración o foto
      alt: "Descripción de la imagen para quien no la ve",  // OBLIGATORIO si usas imagen
      formula: "\\frac{2}{5}+\\frac{1}{3}", // opcional: figura matemática compuesta con LaTeX
      latex: { "2/5": "\\frac{2}{5}" }, // sustituciones exactas dentro del texto visible
      enunciado: "...",
      alternativas: ["...", "...", "...", "..."],
      correcta: "B"
    }
  ]
};
```

- Un ítem lleva **`svg`, `imagen` o `formula`, nunca más de uno**. Si están combinados, el motor
  prioriza el SVG y luego la imagen.
- `alt` es obligatorio con `imagen` y debe permitir responder sin ver la figura, **sin revelar
  cuál es la alternativa correcta**.
- `formula` también requiere `alt`. El motor la compone con MathJax y permite ampliarla.
- `latex` no cambia las cadenas auditadas: mapea un fragmento literal a su notación TeX y el motor
  lo reemplaza solo al presentar `textoBase`, `enunciado` o `alternativas`.
- Los SVG llevan `role="img"` y `aria-label="..."` con el mismo criterio.
- El motor ya envuelve la figura en un `<figure>` con pie y botón **Ampliar**: no agregues tú
  marcos, títulos ni pies dentro del SVG o la imagen.

---

## 3. Generar imágenes: lo que ya sabemos por evidencia

Herramienta: **Nano Banana (Gemini 3 Pro Image)**, ya configurada con su key.

```bash
py -3.12 "C:/Users/franc/.claude/skills/nano-banana-images/gen_image.py" --check
py -3.12 "C:/Users/franc/.claude/skills/nano-banana-images/gen_image.py" "<prompt>" salida.png --aspect 4:3
```

Piloto ya hecho el 26-ago-2026, **respeta estos resultados y no los repitas**:

| Tipo de imagen | Resultado | Veredicto |
|---|---|---|
| **Objeto real sobre fondo blanco** (probado: siku andino) | Fotorrealista, limpio, sin texto | **Usar** |
| **Pintura original abstracta** (probado: simetría axial, colores análogos) | Excelente, con textura de pincelada | **Usar** |
| **Diagrama científico rotulado** (probado: neurona, dos intentos) | El modelo dibuja **líneas indicadoras que no apuntan a nada**, incluso prohibiéndoselas | **No usar**: en una prueba esas líneas hacen creer que señalan algo |

Regla que sale de ahí: **los datos y los esquemas precisos se redibujan en SVG; las expresiones
matemáticas se componen con LaTeX; las ilustraciones y fotos van en imagen generada**. La instrucción
vigente desde el 26-ago es revisar sistemáticamente también mapas, gráficos, tablas, circuitos,
planos y pentagramas. Eso no significa rasterizarlos: se reemplazan por una versión vectorial más
clara, con una gramática gráfica común, conservando cada valor, rótulo y relación espacial.

### Reglas duras al generar

1. **La imagen no puede regalar la respuesta.** Si el ítem pregunta "¿a qué instrumento
   corresponde esta descripción?", mostrar el instrumento anula la pregunta.
2. **No falsificar obras reales.** Si el ítem describe una obra existente de un artista real,
   NO generes una imitación. Solo imágenes originales para preguntar por elementos del lenguaje
   visual (color, línea, textura, composición, encuadre) o por procedimientos.
3. **Sin texto en la imagen.** Incluye siempre en el prompt: "sin texto, sin letras, sin números,
   sin rótulos, sin líneas indicadoras, sin marcas de agua". Aun así, revisa.
4. **Mirar cada imagen antes de aceptarla.** Ábrela y compruébala: correcta para el contenido,
   sin texto, sin artefactos, sin personas identificables. Si tiene un defecto, se regenera; no
   se publica "porque casi está bien".
5. Nada de estudiantes reales ni de rostros reconocibles.

### Peso y formato

- Convertir a **webp** y dejarla **bajo 250 KB** (las de Nano Banana salen entre 300 KB y 1,2 MB).
- Guardar en `imagenes/ecep/practica/<id>/n<NN>.webp` y referenciar con ruta absoluta
  `/imagenes/ecep/practica/<id>/n<NN>.webp`.
- Ancho útil máximo del contenedor: unos 900 px. No subas nada sobre 1600 px de ancho.

---

## 4. Antes de dar por buena una edición: los validadores

Corre los tres desde `C:\dev\profe-blog`:

```bash
# 1) integridad del banco (60 ítems, claves, guion largo, SVG balanceados)
node -e "global.window={};require('./js/practica/<id>.js');const P=window.PRUEBA;const qs=P.preguntas;
const d={A:0,B:0,C:0,D:0};qs.forEach(q=>d[q.correcta]++);
console.log(qs.length, JSON.stringify(d), qs.every((q,i)=>q.n===i+1), qs.every(q=>q.alternativas.length===4));"

# 2) que el sitio compile
npx @11ty/eleventy

# 3) prueba real en el navegador, sin login
npx http-server _site -p 8141 -s
# abrir /evaluaciones/practica/<id>/ , rendir, finalizar y revisar que la figura se vea
```

**Regla del proyecto: verificar es abrir y medir, no mirar.** Sin evidencia citable no hay
hallazgo ni entrega.

---

## 5. Lo que NO debes tocar

- `enunciado`, `alternativas`, `correcta`, `textoBase`: son contenido auditado. Si crees que hay
  un error, **anótalo y avisa**; no lo corrijas por tu cuenta dentro de una tarea de imágenes.
- El orden de las preguntas y el campo `n`.
- `js/ecep-practica.js` (el motor) salvo que la tarea sea explícitamente del motor.
- Nunca `git add -A` (hay agentes trabajando en paralelo): commit con rutas explícitas.

---

## 6. Cola de trabajo sugerida

1. **Ilustraciones nuevas donde faltan**: Artes Visuales (Básica y Media) tienen solo 3 figuras
   entre las dos y muchos ítems que describen obras con palabras. Sirven imágenes originales para
   los ítems de lenguaje visual (ver regla 2).
2. **Instrumentos musicales latinoamericanos** (trompe, siku, guitarrón chileno, tormento) como
   fotografía de objeto sobre fondo blanco, solo en ítems que no pregunten cuál es el instrumento.
3. **Optimización**: revisar que ninguna figura pase de 250 KB y que todas tengan `alt` o
   `aria-label` útil.
4. **Reemplazo sistemático de SVG**: unificar paleta, tipografía, grosores, jerarquía y espacio en
   mapas, gráficos, tablas, circuitos, planos y pentagramas. Comparar antes/después y comprobar que
   no cambió ningún valor ni rótulo.
5. **Lenguaje matemático**: registrar expresiones en `latex` o usar `formula` cuando la figura sea
   puramente algebraica. Nunca dibujar fracciones o ecuaciones a mano con líneas y textos SVG.

### Sistema común de SVG

Desde el 26-ago-2026, los 83 SVG pasan por `polishSvgs` en `js/ecep-practica.js` y reciben la clase
`ecv-svg`. La gramática visual está en `css/ecep-prueba.css`: Inter, números tabulares, trazos
redondeados y una normalización restringida de los antiguos negros, grises y azules. No se cambian
colores con significado disciplinar ni la geometría del recurso.

Para revisar el conjunto completo:

```bash
npm run gallery:ecep-svgs   # siete láminas comparables en la carpeta temporal
npm run verify:ecep-svgs    # abre y mide los 83 SVG en navegador a 390 px
npm run audit:ecep-visuals  # integridad de los 27 bancos y sus recursos
```

La capa común no reemplaza el redibujo cuando una figura está mal compuesta. Lenguaje Básica n33
y n34, y Lengua Media n32 y n46, son ejemplos de estímulos redibujados individualmente sobre este
sistema.

Cuando termines una tarea: deja la evidencia (qué mediste y con qué número), commitea con rutas
explícitas y avisa. El detalle del estado de la sección está en la bitácora
`C:\Users\franc\Portabot-2026\BITACORA.md`, entradas del 26-ago-2026.
