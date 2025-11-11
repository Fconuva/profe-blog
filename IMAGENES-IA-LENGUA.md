# 🎨 LISTA DE IMÁGENES PARA GENERAR CON IA - TEST LENGUA Y LITERATURA

## 📋 RESUMEN
- **Total imágenes a generar:** 2
- **Herramienta sugerida:** Grok AI, DALL-E, Midjourney, o Stable Diffusion
- **Formato recomendado:** JPG o PNG, 800x600px mínimo
- **Carpeta destino:** `evaluaciones/educacion-media/pruebas/lengua-literatura-media/imagenes/`

---

## 🖼️ IMAGEN 1: RETRATO DE DORIAN GRAY DETERIORADO

### Pregunta asociada:
**Pregunta 8** - Meme sobre intertextualidad y alusión literaria

### Prompt para IA (Español):
```
Pintura al óleo de un retrato victoriano deteriorado y envejecido. 
Un hombre aristocrático del siglo XIX con expresión seria y melancólica.
El retrato muestra signos evidentes de envejecimiento: grietas en la pintura, 
colores oscurecidos, manchas de humedad, rasgaduras en el lienzo.
El rostro del hombre se ve demacrado, con arrugas profundas, ojeras marcadas, 
expresión de sufrimiento moral.
Fondo oscuro victoriano, marco dorado antiguo parcialmente visible.
Estilo: pintura clásica británica del siglo XIX, atmósfera gótica y sombría.
Iluminación tenue y dramática.
NO incluir texto, solo la pintura deteriorada.
```

### Prompt for AI (English - mejor para DALL-E/Midjourney):
```
Oil painting portrait of a Victorian-era aristocratic man, severely aged and deteriorated.
The man has deep wrinkles, dark circles under eyes, gaunt face, expression of moral suffering.
The painting itself shows physical deterioration: cracks in paint, darkened colors, 
water stains, tears in canvas, peeling varnish.
Dark Victorian background, partially visible ornate golden frame.
Art style: 19th century British classical portrait painting, Gothic atmosphere.
Dramatic, dim lighting creating shadows.
High detail, realistic oil painting texture.
NO text, just the deteriorated portrait.
```

### Nombre de archivo:
`dorian-gray-retrato-deteriorado.jpg`

### Tamaño recomendado:
800x600px (horizontal) o 600x800px (vertical)

### Uso en el test:
Ilustrar un meme viral sobre "mi foto de perfil de 2010 vs mi cara cuando reviso publicaciones de esa época"

---

## 🖼️ IMAGEN 2: PORTADA CIEN AÑOS DE SOLEDAD (OPCIONAL)

### Pregunta asociada:
**Pregunta 10** - Análisis de elementos visuales en portadas literarias

### Estado actual:
✅ Ya tiene URL funcionando: `https://images.penguinrandomhouse.com/cover/9780525562443`

### Alternativa si falla:
Generar portada estilizada con IA

### Prompt para IA (si es necesario):
```
Portada de libro estilo editorial latinoamericano.
Diseño minimalista con árbol genealógico estilizado en el centro.
Tres franjas horizontales de colores: amarillo dorado, verde esmeralda, azul cielo.
Las franjas se entrelazan formando un patrón circular infinito.
Símbolos discretos: árbol, péndulo, mariposa amarilla.
Tipografía elegante dorada: "CIEN AÑOS DE SOLEDAD" - "GABRIEL GARCÍA MÁRQUEZ"
Fondo color crema/beige envejecido, textura de papel antiguo.
Sello Premio Nobel Literatura 1982 en esquina inferior.
Estilo: diseño editorial literario clásico, realismo mágico visual.
```

### Nombre de archivo:
`cien-anos-soledad-portada.jpg`

### Tamaño recomendado:
600x900px (vertical, proporción libro)

---

## 📁 ESTRUCTURA DE CARPETAS RECOMENDADA

```
evaluaciones/
└── educacion-media/
    └── pruebas/
        └── lengua-literatura-media/
            ├── index.njk
            └── imagenes/
                ├── dorian-gray-retrato-deteriorado.jpg
                └── cien-anos-soledad-portada.jpg (opcional)
```

---

## 🔧 CÓDIGO PARA IMPLEMENTAR LAS IMÁGENES

### Una vez generadas las imágenes:

#### Opción 1: Subir a carpeta local (recomendado para desarrollo)
```javascript
'<img src="/evaluaciones/educacion-media/pruebas/lengua-literatura-media/imagenes/dorian-gray-retrato-deteriorado.jpg" alt="El retrato de Dorian Gray deteriorado" class="w-full h-48 object-cover rounded mb-2" />'
```

#### Opción 2: Subir a servicio de hosting (recomendado para producción)
Servicios sugeridos:
- **Cloudinary** (gratis hasta 25GB)
- **ImgBB** (gratis ilimitado)
- **GitHub Pages** (si el repo es público)
- **Vercel Blob Storage** (integrado con Vercel)

```javascript
'<img src="https://tu-servicio.com/imagenes/dorian-gray-retrato-deteriorado.jpg" alt="El retrato de Dorian Gray deteriorado" class="w-full h-48 object-cover rounded mb-2" />'
```

---

## 🎨 PROMPTS ALTERNATIVOS SEGÚN HERRAMIENTA IA

### Para Grok (X.AI):
```
Create a dark, Gothic oil painting of a Victorian aristocrat's portrait that has severely deteriorated over time. The man's face shows deep moral decay - sunken eyes, wrinkled skin, haunted expression. The painting itself has cracks, peeling paint, and water damage. Ornate golden frame partially visible. Dramatic lighting, 19th century British portrait style.
```

### Para DALL-E 3:
```
A realistic oil painting portrait from the Victorian era showing visible deterioration. 
The subject is an aristocratic man with a gaunt, aged face showing moral suffering. 
The physical painting has cracks, darkened varnish, and damage. 
Dark background, dim dramatic lighting, classical British portrait style from 1890s.
```

### Para Midjourney:
```
Victorian aristocrat oil painting portrait, severely aged and deteriorated, 
deep wrinkles, moral decay, cracked paint, water stains, damaged canvas, 
dark Gothic atmosphere, ornate golden frame, dramatic lighting, 
19th century British classical portrait style, photorealistic --ar 4:3 --v 6
```

### Para Stable Diffusion:
```
(masterpiece, best quality), oil painting portrait, Victorian era aristocrat, 
severely aged face, deep wrinkles, gaunt features, moral suffering expression, 
deteriorated painting, cracks in paint, darkened varnish, water stains, 
damaged canvas, dark background, ornate golden frame, dramatic lighting, 
19th century British portrait style, Gothic atmosphere, high detail
Negative prompt: modern, cartoon, anime, bright colors, smile, healthy
```

---

## ✅ CHECKLIST DESPUÉS DE GENERAR

- [ ] Generar imagen 1: Dorian Gray deteriorado
- [ ] Renombrar archivo a `dorian-gray-retrato-deteriorado.jpg`
- [ ] Optimizar tamaño (máx 500KB para web)
- [ ] Crear carpeta `imagenes/` en ruta correcta
- [ ] Subir imagen a carpeta o servicio hosting
- [ ] Actualizar código en `index.njk` con nueva URL
- [ ] Validar sintaxis con `python validar-sintaxis-js.py`
- [ ] Deploy y verificar en producción

---

## 📊 ESTADO ACTUAL DE IMÁGENES

### ✅ Funcionando con CSS (NO requieren generación):
1. **Pregunta 6** - Cómic con viñetas (diseño CSS)
2. **Pregunta 14** - Afiche político (gradiente CSS)
3. **Pregunta 16** - Campaña agua (gradiente CSS)
4. **Pregunta 17** - Infografía reciclaje (diagrama CSS)
5. **Pregunta 18** - Spot CerealMax (guion visual CSS)
6. **Pregunta 23** - Esquema argumentativo (diagrama CSS)
7. **Pregunta 33** - Posts redes sociales (cards CSS)

### ⚠️ Requieren generación IA:
1. **Pregunta 8** - Dorian Gray (PRIORIDAD ALTA)

### ✅ Ya tienen URL externa funcionando:
1. **Pregunta 10** - Cien años de soledad (Penguin Random House)

---

## 💡 RECOMENDACIÓN FINAL

**Generar SOLO la imagen de Dorian Gray** es suficiente. 

Las demás están perfectamente implementadas con CSS y la portada de Cien años funciona con URL externa.

**Tiempo estimado:** 5-10 minutos con IA + implementación

---

**Creado:** 11 de noviembre de 2025
**Proyecto:** Test ECEP 2025 - Lengua y Literatura Media
