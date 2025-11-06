# 📐 Dossier Matemática Media - Parte 2

## Dominio 2: Geometría

---

## 1. Triángulos

### 1.1 Clasificación de Triángulos

**Por sus lados:**

- **Equilátero:** 3 lados iguales
- **Isósceles:** 2 lados iguales
- **Escaleno:** 3 lados diferentes

**Por sus ángulos:**

- **Acutángulo:** 3 ángulos agudos (< 90°)
- **Rectángulo:** 1 ángulo recto (= 90°)
- **Obtusángulo:** 1 ángulo obtuso (> 90°)

**Propiedades fundamentales:**

- La suma de ángulos interiores es 180°: $$\alpha + \beta + \gamma = 180°$$
- La suma de dos lados siempre es mayor que el tercer lado (desigualdad triangular)
- El lado más largo está opuesto al ángulo más grande

---

### 1.2 Congruencia de Triángulos

**Definición:** Dos triángulos son congruentes si tienen la misma forma y tamaño (lados y ángulos correspondientes iguales).

**Criterios de congruencia:**

| Criterio | Descripción | Notación |
|----------|-------------|----------|
| **LAL** | Lado-Ángulo-Lado | Dos lados y el ángulo entre ellos |
| **ALA** | Ángulo-Lado-Ángulo | Dos ángulos y el lado entre ellos |
| **LLL** | Lado-Lado-Lado | Los tres lados |
| **LLA** | Lado-Lado-Ángulo recto | En triángulos rectángulos: catetos o hipotenusa-cateto |

**Ejemplo modelo:**

Dados dos triángulos:
- Triángulo ABC: lados AB = 5 cm, BC = 7 cm, ángulo B = 60°
- Triángulo DEF: lados DE = 5 cm, EF = 7 cm, ángulo E = 60°

**Conclusión:** Son congruentes por criterio **LAL**

---

### 1.3 Semejanza de Triángulos

**Definición:** Dos triángulos son semejantes si tienen la misma forma pero no necesariamente el mismo tamaño (ángulos iguales, lados proporcionales).

**Criterios de semejanza:**

| Criterio | Descripción |
|----------|-------------|
| **AA** | Dos ángulos correspondientes iguales |
| **LAL~** | Dos lados proporcionales y el ángulo entre ellos igual |
| **LLL~** | Los tres lados proporcionales |

**Razón de semejanza:**

Si dos triángulos son semejantes con razón k, entonces:

$$\frac{a'}{a} = \frac{b'}{b} = \frac{c'}{c} = k$$

**Ejemplo modelo:**

Triángulo ABC con lados 3, 4, 5 cm
Triángulo DEF con lados 6, 8, 10 cm

**Paso 1:** Verificar proporcionalidad
$$\frac{6}{3} = 2, \quad \frac{8}{4} = 2, \quad \frac{10}{5} = 2$$

**Paso 2:** Como todas las razones son iguales, son semejantes por **LLL~**

**Razón de semejanza:** k = 2 (DEF es el doble de ABC)

---

## 2. Teoremas Fundamentales

### 2.1 Teorema de Pitágoras

**Enunciado:** En todo triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos.

$$c^2 = a^2 + b^2$$

Donde:
- c = hipotenusa (lado opuesto al ángulo recto)
- a, b = catetos

**Ejemplo modelo:**

Un triángulo rectángulo tiene catetos de 6 cm y 8 cm. Calcular la hipotenusa.

**Paso 1:** Aplicar fórmula
$$c^2 = 6^2 + 8^2$$

**Paso 2:** Calcular
$$c^2 = 36 + 64 = 100$$

**Paso 3:** Sacar raíz
$$c = \sqrt{100} = 10 \text{ cm}$$

**Respuesta:** La hipotenusa mide 10 cm

**Aplicaciones:**

1. **Calcular distancia entre dos puntos en el plano:**
$$d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$

2. **Verificar si un triángulo es rectángulo:**
Si $$c^2 = a^2 + b^2$$, entonces el triángulo es rectángulo

**Ejemplo:** ¿Es rectángulo un triángulo de lados 5, 12, 13?
$$13^2 = 169$$ y $$5^2 + 12^2 = 25 + 144 = 169$$ ✓
**Sí, es rectángulo**

---

### 2.2 Teorema de Thales

**Enunciado:** Si varias rectas paralelas son cortadas por dos transversales, los segmentos determinados en una transversal son proporcionales a los correspondientes segmentos en la otra.

$$\frac{AB}{BC} = \frac{A'B'}{B'C'}$$

**Aplicación: División de segmento en partes iguales**

**Ejemplo modelo:**

Dividir un segmento AB de 7 cm en 3 partes iguales usando Thales.

**Paso 1:** Trazar una recta auxiliar desde A
**Paso 2:** Marcar 3 segmentos iguales (por ejemplo, 1 cm cada uno)
**Paso 3:** Unir el último punto con B
**Paso 4:** Trazar paralelas desde los otros puntos

**Resultado:** El segmento AB queda dividido en 3 partes iguales de 7/3 cm cada una

---

## 3. Perímetros y Áreas

### 3.1 Figuras Planas

**Fórmulas esenciales:**

| Figura | Perímetro | Área |
|--------|-----------|------|
| **Triángulo** | $$P = a + b + c$$ | $$A = \frac{b \cdot h}{2}$$ |
| **Cuadrado** | $$P = 4a$$ | $$A = a^2$$ |
| **Rectángulo** | $$P = 2(a + b)$$ | $$A = a \cdot b$$ |
| **Paralelogramo** | $$P = 2(a + b)$$ | $$A = b \cdot h$$ |
| **Rombo** | $$P = 4a$$ | $$A = \frac{D \cdot d}{2}$$ |
| **Trapecio** | $$P = a + b + c + d$$ | $$A = \frac{(B + b) \cdot h}{2}$$ |
| **Círculo** | $$P = 2\pi r$$ | $$A = \pi r^2$$ |

**Leyenda:**
- a, b, c = lados
- h = altura
- r = radio
- D, d = diagonales (mayor y menor)
- B, b = bases (mayor y menor)

**Ejemplo modelo completo:**

Calcular el área de un trapecio con base mayor 10 cm, base menor 6 cm y altura 5 cm.

**Paso 1:** Identificar valores
- B = 10 cm (base mayor)
- b = 6 cm (base menor)
- h = 5 cm (altura)

**Paso 2:** Aplicar fórmula
$$A = \frac{(B + b) \cdot h}{2}$$

**Paso 3:** Sustituir
$$A = \frac{(10 + 6) \cdot 5}{2}$$

**Paso 4:** Calcular
$$A = \frac{16 \cdot 5}{2} = \frac{80}{2} = 40 \text{ cm}^2$$

**Respuesta:** 40 cm²

---

### 3.2 Relaciones entre Perímetro y Área

**Concepto clave:** Perímetro y área son magnitudes INDEPENDIENTES

**Error común:**
❌ "Si duplico el lado, duplico el área"

**Correcto:**
✓ Si duplico el lado de un cuadrado, el área se CUADRUPLICA

**Ejemplo:**
- Cuadrado A: lado = 2 cm → Área = 4 cm²
- Cuadrado B: lado = 4 cm → Área = 16 cm²
- El área de B es 4 veces la de A (no el doble)

**Regla general:**
Si escalamos una figura por factor k:
- Perímetro se multiplica por k
- Área se multiplica por k²

---

## 4. Volúmenes de Cuerpos Geométricos

### 4.1 Fórmulas de Volumen

| Cuerpo | Fórmula | Ejemplo |
|--------|---------|---------|
| **Cubo** | $$V = a^3$$ | a = 3 cm → V = 27 cm³ |
| **Paralelepípedo** | $$V = a \cdot b \cdot c$$ | 2×3×4 → V = 24 cm³ |
| **Prisma** | $$V = A_{base} \cdot h$$ | Base triangular 6 cm², h=5 → V=30 cm³ |
| **Cilindro** | $$V = \pi r^2 \cdot h$$ | r=2, h=5 → V=20π cm³ |
| **Pirámide** | $$V = \frac{A_{base} \cdot h}{3}$$ | Base 12 cm², h=6 → V=24 cm³ |
| **Cono** | $$V = \frac{\pi r^2 \cdot h}{3}$$ | r=3, h=4 → V=12π cm³ |
| **Esfera** | $$V = \frac{4\pi r^3}{3}$$ | r=3 → V=36π cm³ |

**Regla mnemotécnica:**
- Cuerpos RECTOS (prisma, cilindro): V = Área_base × altura
- Cuerpos con PUNTA (pirámide, cono): V = (Área_base × altura) / 3

**Ejemplo modelo completo:**

Una pirámide cuadrangular tiene base de lado 6 cm y altura 8 cm. Calcular su volumen.

**Paso 1:** Calcular área de la base (cuadrado)
$$A_{base} = 6^2 = 36 \text{ cm}^2$$

**Paso 2:** Aplicar fórmula de pirámide
$$V = \frac{A_{base} \cdot h}{3}$$

**Paso 3:** Sustituir
$$V = \frac{36 \cdot 8}{3}$$

**Paso 4:** Calcular
$$V = \frac{288}{3} = 96 \text{ cm}^3$$

**Respuesta:** 96 cm³

---

## 5. Geometría Analítica

### 5.1 Plano Cartesiano

**Coordenadas:** Todo punto se representa como par ordenado (x, y)

- x = abscisa (eje horizontal)
- y = ordenada (eje vertical)

**Cuadrantes:**

```text
    II  |  I
   (-,+)|(+,+)
  ------+------
   (-,-)|(+,-)
   III  |  IV
```

**Ejemplo:**
- A(3, 4) está en el cuadrante I
- B(-2, 5) está en el cuadrante II
- C(-1, -3) está en el cuadrante III
- D(4, -2) está en el cuadrante IV

---

### 5.2 Distancia entre Dos Puntos

**Fórmula:**
$$d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$

Esta fórmula proviene del Teorema de Pitágoras aplicado al plano.

**Ejemplo modelo:**

Calcular la distancia entre A(1, 2) y B(5, 5)

**Paso 1:** Identificar coordenadas
- $$(x_1, y_1) = (1, 2)$$
- $$(x_2, y_2) = (5, 5)$$

**Paso 2:** Aplicar fórmula
$$d = \sqrt{(5 - 1)^2 + (5 - 2)^2}$$

**Paso 3:** Calcular
$$d = \sqrt{4^2 + 3^2} = \sqrt{16 + 9} = \sqrt{25} = 5$$

**Respuesta:** 5 unidades

---

### 5.3 Punto Medio

**Fórmula:**
$$M = \left(\frac{x_1 + x_2}{2}, \frac{y_1 + y_2}{2}\right)$$

**Ejemplo:**
Encontrar el punto medio entre A(2, 3) y B(8, 7)

$$M = \left(\frac{2 + 8}{2}, \frac{3 + 7}{2}\right) = \left(\frac{10}{2}, \frac{10}{2}\right) = (5, 5)$$

**Respuesta:** M(5, 5)

---

## 6. Transformaciones Isométricas

**Definición:** Transformaciones que conservan la forma y el tamaño (distancias y ángulos).

### 6.1 Traslación

**Definición:** Desplazar una figura en línea recta una distancia determinada.

**Vector de traslación:** $$\vec{v} = (a, b)$$

**Fórmula:**
Si P(x, y) se traslada por $$\vec{v} = (a, b)$$, entonces:
$$P'(x + a, y + b)$$

**Ejemplo:**
Trasladar A(2, 3) por vector $$\vec{v} = (4, -1)$$

$$A' = (2 + 4, 3 + (-1)) = (6, 2)$$

---

### 6.2 Reflexión (Simetría)

**Tipos:**

**1. Reflexión respecto al eje X:**
$$P(x, y) \rightarrow P'(x, -y)$$

**2. Reflexión respecto al eje Y:**
$$P(x, y) \rightarrow P'(-x, y)$$

**3. Reflexión respecto al origen:**
$$P(x, y) \rightarrow P'(-x, -y)$$

**Ejemplo:**
Reflejar A(3, 5) respecto al eje X

$$A' = (3, -5)$$

---

### 6.3 Rotación

**Rotación de 90° en sentido antihorario respecto al origen:**
$$P(x, y) \rightarrow P'(-y, x)$$

**Rotación de 180° respecto al origen:**
$$P(x, y) \rightarrow P'(-x, -y)$$

**Ejemplo:**
Rotar A(4, 2) en 90° antihorario

$$A' = (-2, 4)$$

---

## 7. Razones Trigonométricas (Introducción)

### 7.1 Definiciones en Triángulo Rectángulo

Dado un triángulo rectángulo con ángulo α:

$$\sin(\alpha) = \frac{\text{cateto opuesto}}{\text{hipotenusa}}$$

$$\cos(\alpha) = \frac{\text{cateto adyacente}}{\text{hipotenusa}}$$

$$\tan(\alpha) = \frac{\text{cateto opuesto}}{\text{cateto adyacente}}$$

**Mnemotecnia:** SOH-CAH-TOA

**Ejemplo modelo:**

Un triángulo rectángulo tiene cateto opuesto = 3, cateto adyacente = 4, hipotenusa = 5.
Calcular sen(α), cos(α), tan(α).

$$\sin(\alpha) = \frac{3}{5} = 0.6$$

$$\cos(\alpha) = \frac{4}{5} = 0.8$$

$$\tan(\alpha) = \frac{3}{4} = 0.75$$

---

### 7.2 Ángulos Notables

| Ángulo | sen | cos | tan |
|--------|-----|-----|-----|
| **30°** | 1/2 | √3/2 | √3/3 |
| **45°** | √2/2 | √2/2 | 1 |
| **60°** | √3/2 | 1/2 | √3 |

**Aplicación:**

Calcular la altura de un triángulo equilátero de lado 6 cm.

**Paso 1:** En triángulo equilátero, la altura divide la base en dos partes iguales formando dos triángulos rectángulos con ángulos 30°, 60°, 90°.

**Paso 2:** Usar sen(60°)
$$\sin(60°) = \frac{h}{6}$$

**Paso 3:** Despejar h
$$h = 6 \cdot \sin(60°) = 6 \cdot \frac{\sqrt{3}}{2} = 3\sqrt{3} \approx 5.2 \text{ cm}$$

---

## 8. Errores Conceptuales Comunes

### ❌ ERROR 1: Confundir perímetro con área

**Incorrecto:** "El perímetro de un cuadrado de lado 4 es 16 m²"
**Correcto:** P = 16 m (unidades lineales), A = 16 m² (unidades cuadradas)
*Perímetro se mide en unidades lineales (m, cm), área en unidades cuadradas (m², cm²)*

### ❌ ERROR 2: Teorema de Pitágoras en triángulos NO rectángulos

**Incorrecto:** Aplicar c² = a² + b² en cualquier triángulo
**Correcto:** Solo en triángulos rectángulos
*Verificar que hay un ángulo de 90° antes de aplicar*

### ❌ ERROR 3: Sumar lados para calcular área

**Incorrecto:** "Área de rectángulo 4×5 = 4+5 = 9"
**Correcto:** A = 4 × 5 = 20
*Área siempre involucra multiplicación o fórmulas específicas, no suma simple*

### ❌ ERROR 4: Duplicar lado = duplicar volumen

**Incorrecto:** Si duplico la arista de un cubo, su volumen se duplica
**Correcto:** Si a → 2a, entonces V → 8V (se multiplica por 2³ = 8)
*El volumen aumenta con el cubo del factor de escala*

### ❌ ERROR 5: Confundir radio con diámetro

**Incorrecto:** "Un círculo de diámetro 10 cm tiene área π(10)² = 100π"
**Correcto:** Radio = 5 cm, entonces A = π(5)² = 25π cm²
*La fórmula usa el radio, no el diámetro*

---

## 9. Conexiones con Otros Dominios

**Con Álgebra:**
- Fórmulas geométricas son expresiones algebraicas
- Teorema de Pitágoras es una ecuación cuadrática

**Con Funciones:**
- Razones trigonométricas son funciones
- Gráficos de funciones usan plano cartesiano

**Con Datos:**
- Gráficos estadísticos usan geometría (barras, sectores circulares)
- Dispersión de datos se visualiza en plano cartesiano

---

## ✅ Autoevaluación

**Deberías poder:**

- [ ] Clasificar triángulos por lados y ángulos
- [ ] Aplicar los 4 criterios de congruencia
- [ ] Aplicar los 3 criterios de semejanza
- [ ] Usar Teorema de Pitágoras en ambos sentidos (calcular lado y verificar si es rectángulo)
- [ ] Aplicar Teorema de Thales para proporcionalidad
- [ ] Calcular perímetro y área de 7 figuras planas
- [ ] Calcular volumen de 7 cuerpos geométricos
- [ ] Calcular distancia y punto medio en el plano
- [ ] Aplicar las 3 transformaciones isométricas
- [ ] Calcular las 3 razones trigonométricas básicas

**Indicador de dominio:**

- ✅ **8-10 marcados:** Excelente dominio, listo para problemas complejos
- ⚠️ **5-7 marcados:** Buen nivel, revisar fórmulas débiles
- ❌ **0-4 marcados:** Repasar teoría y practicar más ejercicios

---

**Anterior:** [Dossier Parte 1 - Números y Álgebra](./01-numeros-algebra.md)  
**Siguiente:** [Dossier Parte 3 - Probabilidad y Estadística](./03-probabilidad-estadistica.md)
