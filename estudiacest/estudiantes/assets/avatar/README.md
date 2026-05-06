# Avatar Assets

Este directorio alimenta el renderer por capas definido en `js/avatar-look.js`.

## Estructura actual

- `masks/body.svg`: base comun del avatar.
- `eyes/*.svg`: variantes de ojos.
- `mouth/*.svg`: variantes de boca.
- `hair/*.svg`: siluetas de peinados.
- `outfit/*.svg`: siluetas de ropa.
- `accessory/*.svg`: accesorios equipables.

## Contrato del renderer

El renderer usa mascaras SVG negras con fondo transparente.
La forma visible la aporta la mascara y el color lo inyecta `avatar-look.js`.

Reglas para reemplazar piezas con arte nuevo:

1. Mantener `viewBox="0 0 128 128"`.
2. Mantener fondo transparente.
3. Dibujar la forma en negro puro (`#000`) si sera usada como mascara.
4. Mantener el encuadre centrado para que el apilado no se desaline.
5. Si una pieza necesita color propio fijo, seguir usando la mascara y ajustar el color en `avatar-look.js`.

## Batch sugerido para Gemini

### Prompt 1: cabello

Crea 4 peinados frontales para un avatar 2D juvenil estilo videojuego escolar, vista frontal, solo cabeza y hombros, fondo totalmente transparente, composicion centrada, alto contraste, sin sombras complejas, silueta limpia, sin texto, sin marco, consistencia total entre las 4 variantes. Entrega una hoja con 4 opciones separadas: ondulado, puntas, bob y rizo. Importante: cada peinado debe estar aislado visualmente y ser facil de vectorizar como capa independiente.

### Prompt 2: ojos

Crea una hoja de expresiones de ojos para avatar 2D vista frontal, fondo totalmente transparente, estilo limpio y consistente, trazos simples, sin texto. Entrega 4 variantes: amables, enfocados, con chispa y en calma. Los ojos deben quedar alineados en la misma posicion y escala para usarse como capas intercambiables.

### Prompt 3: bocas

Crea una hoja de bocas para avatar 2D escolar vista frontal, fondo totalmente transparente, trazos simples, sin texto, sin sombras complejas. Entrega 4 variantes: sonrisa, media sonrisa, seria y asombro. Todas deben quedar centradas y a la misma escala para uso como capas independientes.

### Prompt 4: outfits

Crea 4 torsos de ropa para avatar 2D juvenil vista frontal, fondo totalmente transparente, estilo consistente, sin texto. Entrega: uniforme escolar, hoodie, ropa deportiva y armadura ligera fantastica. Cada torso debe encajar sobre la misma base corporal y quedar listo para separacion por capas.

### Prompt 5: accesorios

Crea 3 accesorios frontales para avatar 2D con fondo transparente, estilo consistente con videojuego escolar, sin texto. Entrega: lentes, audifonos y corona. Deben estar centrados y alineados para colocarse como capa superior sobre el rostro.

## Flujo recomendado

1. Generar una sola categoria por vez en Gemini.
2. Exportar PNG o SVG con fondo transparente.
3. Redibujar o limpiar la silueta final para usarla como mascara si se requiere recoloracion dinamica.
4. Reemplazar el archivo correspondiente manteniendo el mismo nombre.
5. Si se agrega una opcion nueva, actualizar `js/avatar-look.js`.
