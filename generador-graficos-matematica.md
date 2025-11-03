# 🎨 GENERADOR DE GRÁFICOS CON IA GROK - MATEMÁTICA BÁSICA

Este documento contiene **prompts optimizados** para generar gráficos SVG interactivos usando **Grok AI** para la guía de estudio de Matemática.

---

## 📋 ÍNDICE DE GRÁFICOS NECESARIOS

### ✅ COMPLETADOS (Ya en matematica.njk)
1. Recta numérica con números primos
2. Gráfico de proporcionalidad directa (y = kx)
3. Representación visual de potencias (cubos)
4. Gráfico de secuencia aritmética

### ❌ FALTANTES (Prioridad Alta)

#### **DOMINIO 2: ÁLGEBRA**
- [ ] Gráfico de función lineal (y = mx + b) con pendiente y intersección
- [ ] Diagrama de balanza para ecuaciones
- [ ] Representación visual de variables y expresiones algebraicas
- [ ] Transformaciones de funciones (traslación, reflexión)

#### **DOMINIO 3: GEOMETRÍA**
- [ ] Clasificación de triángulos (por lados y ángulos)
- [ ] Clasificación de cuadriláteros
- [ ] Círculo con elementos (centro, radio, diámetro, cuerda, arco)
- [ ] Transformaciones isométricas:
  - Traslación (antes/después)
  - Rotación (con centro y ángulo)
  - Reflexión (eje de simetría)
- [ ] Cuerpos geométricos 3D (prismas, pirámides, cilindro, cono, esfera)
- [ ] Desarrollo de cuerpos (red de un cubo, prisma)
- [ ] Sistema de coordenadas cartesianas

#### **DOMINIO 4: DATOS Y AZAR**
- [ ] Gráfico de barras (datos categóricos)
- [ ] Gráfico circular (sectores/porcentajes)
- [ ] Gráfico de líneas (tendencias temporales)
- [ ] Pictograma educativo
- [ ] Diagrama de árbol (probabilidad)
- [ ] Representación de medidas de tendencia central (media, mediana, moda)

#### **DOMINIO 5: ENSEÑANZA-APRENDIZAJE**
- [ ] Material CPA (Concreto-Pictórico-Abstracto):
  - Bloques de base 10
  - Regletas de Cuisenaire
  - Fracciones con círculos/barras
  - Balanza matemática

---

## 🤖 PROMPTS PARA GROK

### 1️⃣ FUNCIÓN LINEAL (y = mx + b)

```
Crea un gráfico SVG educativo de 600x400px para enseñanza básica que muestre:

1. PLANO CARTESIANO:
   - Ejes X e Y centrados con flechas en los extremos
   - Cuadrícula ligera de fondo (líneas grises claras cada 50px)
   - Números en ejes de -5 a 5
   - Etiquetas "x" y "y" en ejes

2. FUNCIÓN LINEAL: y = 2x + 1
   - Línea recta azul (#2196f3) grosor 3px
   - Pasar por al menos 5 puntos visibles
   - Marcar punto de intersección con eje Y (0,1) con círculo rojo

3. ELEMENTOS DIDÁCTICOS:
   - Triángulo rectángulo para mostrar pendiente (rise/run)
   - Etiqueta "m = 2" junto al triángulo
   - Etiqueta "b = 1" en intersección con eje Y
   - Leyenda: "y = 2x + 1" en esquina superior

4. ESTILO:
   - Colores vibrantes pero educativos
   - Texto legible (Arie, sans-serif, 14px)
   - Fondo blanco o transparente

Genera SOLO el código SVG, sin explicaciones adicionales.
```

---

### 2️⃣ TRIÁNGULOS (Clasificación)

```
Crea un gráfico SVG educativo de 800x600px que muestre la CLASIFICACIÓN COMPLETA DE TRIÁNGULOS:

1. SECCIÓN 1 - Por Lados (parte superior):
   - Triángulo EQUILÁTERO (3 lados iguales, marcados con |||)
   - Triángulo ISÓSCELES (2 lados iguales, marcados con ||)
   - Triángulo ESCALENO (todos diferentes, marcados con |, ||, |||)
   - Etiquetas claras bajo cada uno

2. SECCIÓN 2 - Por Ángulos (parte inferior):
   - Triángulo ACUTÁNGULO (3 ángulos agudos < 90°)
   - Triángulo RECTÁNGULO (1 ángulo recto = 90°, marcar con cuadradito)
   - Triángulo OBTUSÁNGULO (1 ángulo obtuso > 90°)
   - Marcar los ángulos con arcos de colores

3. DETALLES:
   - Usar colores diferentes para cada tipo
   - Medidas de ángulos visibles
   - Símbolos de congruencia en lados iguales
   - Título arriba: "Clasificación de Triángulos"

4. ESTILO:
   - Diseño limpio y espaciado
   - Texto Arial 16px
   - Bordes de triángulos grosor 2px

Genera SOLO el código SVG.
```

---

### 3️⃣ TRANSFORMACIONES ISOMÉTRICAS

```
Crea un gráfico SVG educativo de 900x700px que muestre 3 TRANSFORMACIONES ISOMÉTRICAS con un triángulo:

1. TRASLACIÓN (fila superior):
   - Triángulo original azul en cuadrícula
   - Flecha de desplazamiento (vector)
   - Triángulo trasladado azul punteado
   - Etiqueta: "Traslación (5, 3)"
   - Coordenadas de vértices antes/después

2. ROTACIÓN (fila media):
   - Triángulo original verde
   - Centro de rotación marcado con punto rojo
   - Arco indicando ángulo de rotación (90°)
   - Triángulo rotado verde punteado
   - Etiqueta: "Rotación 90° horario"

3. REFLEXIÓN (fila inferior):
   - Triángulo original naranja
   - Eje de simetría (línea punteada roja vertical)
   - Triángulo reflejado naranja punteado
   - Etiqueta: "Reflexión (eje Y)"

4. CARACTERÍSTICAS:
   - Cuadrícula de fondo en cada sección
   - Figuras "antes" sólidas, "después" punteadas
   - Flechas y símbolos matemáticos claros
   - Título general arriba

Genera SOLO el código SVG.
```

---

### 4️⃣ CÍRCULO CON ELEMENTOS

```
Crea un gráfico SVG educativo de 600x600px que muestre todos los ELEMENTOS DEL CÍRCULO:

1. CÍRCULO PRINCIPAL:
   - Centro en (300, 300)
   - Radio = 150px
   - Borde azul grosor 3px
   - Relleno celeste claro

2. ELEMENTOS A MOSTRAR:
   - CENTRO (punto rojo con etiqueta "O")
   - RADIO (línea roja desde centro a borde, etiqueta "r")
   - DIÁMETRO (línea verde pasando por centro, etiqueta "d = 2r")
   - CUERDA (línea amarilla que no pasa por centro, etiqueta "cuerda")
   - ARCO (porción del borde resaltada en morado, etiqueta "arco")
   - SECTOR CIRCULAR (región sombreada, etiqueta "sector")
   - SEGMENTO CIRCULAR (región entre cuerda y arco, sombreado diferente)

3. ESTILO:
   - Cada elemento con color único
   - Etiquetas con flechas apuntando al elemento
   - Leyenda en esquina con símbolos
   - Título: "Elementos del Círculo"

Genera SOLO el código SVG.
```

---

### 5️⃣ GRÁFICOS ESTADÍSTICOS (3 en 1)

```
Crea un gráfico SVG educativo de 900x400px con 3 TIPOS DE GRÁFICOS ESTADÍSTICOS usando los mismos datos:

DATOS: Frutas favoritas en 6° Básico
- Manzanas: 15 estudiantes
- Plátanos: 10 estudiantes
- Naranjas: 8 estudiantes
- Uvas: 7 estudiantes

1. GRÁFICO DE BARRAS (izquierda 300px):
   - Eje X: frutas
   - Eje Y: cantidad de estudiantes (0-20)
   - Barras verticales de colores
   - Valores en la cima de cada barra

2. GRÁFICO CIRCULAR (centro 300px):
   - Círculo dividido en 4 sectores
   - Colores correspondientes a barras
   - Porcentajes en cada sector
   - Leyenda con nombres

3. GRÁFICO DE LÍNEAS (derecha 300px):
   - Ejes como barras
   - Puntos conectados por líneas
   - Marcadores circulares en puntos
   - Valores junto a cada punto

4. DETALLES:
   - Título arriba de cada gráfico
   - Mismos colores en los 3
   - Escala y etiquetas claras
   - Diseño profesional educativo

Genera SOLO el código SVG.
```

---

### 6️⃣ DIAGRAMA DE ÁRBOL (Probabilidad)

```
Crea un gráfico SVG educativo de 600x500px de un DIAGRAMA DE ÁRBOL para este problema:

PROBLEMA: Lanzar una moneda 2 veces

1. ESTRUCTURA:
   - Inicio (círculo central izquierda)
   - Primera rama: CARA / SELLO
   - Segunda rama desde cada resultado: CARA / SELLO
   - 4 resultados finales: CC, CS, SC, SS

2. ELEMENTOS:
   - Ramas como líneas diagonales
   - Etiquetas en cada rama (C/S)
   - Probabilidades en cada rama (1/2 o 0.5)
   - Recuadros al final con resultados
   - Probabilidades finales calculadas (1/4 cada uno)

3. CÁLCULOS VISIBLES:
   - Mostrar multiplicación de probabilidades
   - Ejemplo: P(CC) = 1/2 × 1/2 = 1/4
   - Destacar que suma total = 1

4. ESTILO:
   - Colores: azul para CARA, rojo para SELLO
   - Líneas grosor 2px
   - Texto Arial 14px
   - Título: "Diagrama de Árbol - 2 Lanzamientos"

Genera SOLO el código SVG.
```

---

### 7️⃣ MATERIAL CPA (Bloques Base 10)

```
Crea un gráfico SVG educativo de 800x400px mostrando BLOQUES DE BASE 10 para representar el número 243:

1. UNIDADES (derecha):
   - 3 cubitos pequeños (20x20px)
   - Amarillos, borde negro
   - Etiqueta "3 unidades"

2. DECENAS (centro):
   - 4 barras de 10 cubitos (20x200px)
   - Verdes, con líneas divisorias para cubitos
   - Etiqueta "4 decenas = 40"

3. CENTENAS (izquierda):
   - 2 placas de 10x10 cubitos (200x200px)
   - Azules, con cuadrícula 10x10
   - Etiqueta "2 centenas = 200"

4. REPRESENTACIÓN COMPLETA:
   - Agrupar claramente por posición
   - Flechas apuntando a cada grupo
   - Suma al final: 200 + 40 + 3 = 243
   - Título: "Representación Concreta del Número 243"

5. ESTILO:
   - Perspectiva 3D ligera en bloques
   - Sombras sutiles
   - Colores pastel educativos

Genera SOLO el código SVG.
```

---

### 8️⃣ PLANO CARTESIANO (Coordenadas)

```
Crea un gráfico SVG educativo de 600x600px de un PLANO CARTESIANO completo para enseñanza básica:

1. EJES:
   - Eje X e Y centrados, grosor 2px negro
   - Flechas en extremos
   - Cuadrícula de fondo gris claro (cada 50px)
   - Números de -5 a 5 en ambos ejes

2. CUADRANTES:
   - Sombrear ligeramente los 4 cuadrantes con colores pastel diferentes
   - Etiquetar: I, II, III, IV en cada cuadrante

3. PUNTOS EJEMPLO:
   - A(3, 2) - círculo rojo en Cuadrante I
   - B(-2, 4) - círculo azul en Cuadrante II
   - C(-4, -1) - círculo verde en Cuadrante III
   - D(1, -3) - círculo naranja en Cuadrante IV
   - Cada punto con su etiqueta y coordenadas

4. ELEMENTOS DIDÁCTICOS:
   - Líneas punteadas desde puntos a ejes
   - Valores de coordenadas resaltados
   - Leyenda: "Par ordenado (x, y)"
   - Indicar "Eje de las abscisas (X)" y "Eje de las ordenadas (Y)"

5. ESTILO:
   - Profesional pero colorido
   - Texto Arial 14px
   - Título: "Plano Cartesiano"

Genera SOLO el código SVG.
```

---

### 9️⃣ CUERPOS GEOMÉTRICOS 3D

```
Crea un gráfico SVG educativo de 1000x700px mostrando 6 CUERPOS GEOMÉTRICOS 3D con perspectiva:

1. FILA SUPERIOR (3 cuerpos):
   - CUBO: perspectiva isométrica, aristas visibles sólidas, ocultas punteadas
   - PRISMA RECTANGULAR: similar al cubo, proporciones diferentes
   - CILINDRO: con bases circulares y líneas laterales

2. FILA INFERIOR (3 cuerpos):
   - PIRÁMIDE CUADRANGULAR: base cuadrada, 4 caras triangulares, vértice arriba
   - CONO: base circular, vértice arriba, línea generatriz visible
   - ESFERA: círculo con líneas de latitud/longitud para dar volumen

3. PARA CADA CUERPO:
   - Nombre debajo en negrita
   - Elementos destacados (vértices, aristas, caras)
   - Colores diferentes para cada cara visible
   - Medidas de ejemplo (altura, base)

4. DETALLES:
   - Usar sombreado para dar sensación 3D
   - Perspectiva consistente
   - Escala similar entre cuerpos
   - Título general: "Cuerpos Geométricos"

Genera SOLO el código SVG.
```

---

### 🔟 FRACCIONES VISUALES (CPA)

```
Crea un gráfico SVG educativo de 800x900px mostrando REPRESENTACIÓN CPA DE FRACCIONES para 3/4:

1. CONCRETO (arriba):
   - Barra de chocolate dividida en 4 partes
   - 3 partes sombreadas (comidas)
   - 1 parte sin sombrear
   - Etiqueta: "3 de 4 partes = 3/4"

2. PICTÓRICO (medio):
   - Círculo dividido en 4 sectores
   - 3 sectores pintados de azul
   - 1 sector blanco
   - Líneas divisorias claras

3. ABSTRACTO (abajo):
   - Fracción escrita: 3/4
   - Partes etiquetadas:
     * Numerador (arriba): "Partes que tengo"
     * Denominador (abajo): "Partes totales"
   - Equivalencias decimales y porcentaje:
     * 3/4 = 0,75 = 75%

4. LÍNEA NUMÉRICA (base):
   - De 0 a 1
   - Marcas en 1/4, 2/4, 3/4, 4/4
   - Flecha apuntando a 3/4
   - Etiquetas en cada marca

5. ESTILO:
   - Colores educativos (azul, naranja)
   - Separadores claros entre secciones
   - Título: "Representaciones de 3/4"
   - Flechas conectando las 3 representaciones

Genera SOLO el código SVG.
```

---

## 📝 INSTRUCCIONES DE USO

### Opción 1: Generar con Grok directamente

1. Ve a **Grok en X.com** (https://x.com/i/grok)
2. Copia uno de los prompts de arriba
3. Pégalo en Grok y envía
4. Grok generará el código SVG
5. Copia el código SVG generado
6. Pégalo en el archivo `matematica.njk` en la sección correspondiente

### Opción 2: Usar API de Grok (requiere clave)

```javascript
// Archivo: generar-grafico-grok.js
const GROK_API_KEY = process.env.GROK_API_KEY; // Desde .env

async function generarGraficoConGrok(promptName) {
  const prompts = {
    'funcion-lineal': `${promptFuncionLineal}`,
    'triangulos': `${promptTriangulos}`,
    // ... más prompts
  };

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: [{
        role: 'user',
        content: prompts[promptName]
      }]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

// Uso:
const svgFuncion = await generarGraficoConGrok('funcion-lineal');
console.log(svgFuncion);
```

### Opción 3: Generación Manual (para probar)

Para probar localmente sin IA:
1. Usa los prompts como guía
2. Crea SVG manualmente en https://svg-editor.online
3. Exporta y pega en `matematica.njk`

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Gráficos Críticos (Esta semana)
- [ ] Función lineal (y = mx + b)
- [ ] Triángulos clasificación
- [ ] Círculo con elementos
- [ ] Gráfico de barras

### Fase 2: Transformaciones (Próxima semana)
- [ ] Transformaciones isométricas (3 tipos)
- [ ] Plano cartesiano
- [ ] Diagrama de árbol

### Fase 3: Material CPA (Semana 3)
- [ ] Bloques base 10
- [ ] Fracciones visuales
- [ ] Cuerpos geométricos 3D

---

## 💡 TIPS PARA MEJORES RESULTADOS CON GROK

1. **Sé específico con medidas**: Indica siempre dimensiones exactas (600x400px)
2. **Colores en hexadecimal**: Usa códigos como #2196f3 en lugar de "azul"
3. **Pide SOLO SVG**: Evita explicaciones adicionales que contaminen el código
4. **Itera si es necesario**: Si el primer resultado no es perfecto, pide ajustes específicos
5. **Valida el SVG**: Pega en https://www.svgviewer.dev/ antes de agregar al sitio

---

## 🎨 PALETA DE COLORES EDUCATIVOS

```css
/* Colores consistentes para el sitio */
--azul-primario: #2196f3;
--verde-success: #4caf50;
--rojo-error: #f44336;
--naranja-warning: #ff9800;
--morado-info: #9c27b0;
--cyan-highlight: #00bcd4;

/* Fondos */
--fondo-claro: #f5f5f5;
--fondo-tarjeta: #ffffff;

/* Texto */
--texto-principal: #333333;
--texto-secundario: #666666;
```

---

## 📞 SOPORTE

Si necesitas ayuda generando los gráficos:
1. Verifica que la API key de Grok esté configurada
2. Revisa los logs en consola del navegador
3. Prueba los prompts individualmente
4. Ajusta parámetros según necesites

---

**Última actualización:** 3 de Noviembre, 2025
**Autor:** Profesor Francisco Pancho
**Proyecto:** Guía de Estudio Matemática Educación Básica
