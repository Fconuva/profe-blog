# Créditos y licencia de los muebles

Los sprites isométricos de esta carpeta provienen del **Furniture Kit** de
**Kenney** (https://kenney.nl), publicado bajo **CC0 1.0 Universal (dominio
público)**.

CC0 permite usarlos en cualquier proyecto, incluido uso comercial, sin pedir
permiso y sin obligación de atribuir. Este archivo existe igual porque
corresponde reconocer el trabajo, no porque la licencia lo exija.

- Fuente: https://opengameart.org/content/furniture-kit
- Autor: Kenney
- Licencia: CC0 1.0 Universal

## Lo que NO se usa aquí

Ningún gráfico de Habbo Hotel. Los sprites y furnis de Habbo son propiedad de
Sulake y su uso en un sitio público es infracción de derechos de autor. El
parecido buscado es de **estilo isométrico y de mecánica** (ganar objetos y
decorar una pieza), no de assets.

## Geometría de la grilla

- Tile de piso `floorFull`: 151 × 110 px, con el rombo superior de 151 × 106.
- Paso de la grilla, verificado componiendo un piso de 4 × 4 sin huecos ni
  solapes: **75 px en X y 53 px en Y**.
- Posición de una celda `(col, fila)` respecto del origen:
  `x = (col - fila) * 75`, `y = (col + fila) * 53`.
- Cada mueble se ancla por el centro de su base, no por su esquina superior.
