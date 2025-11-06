# 📐 Dossier Matemática Media - Parte 1

## Dominio 1: Números y Álgebra

---

## 1. Números Reales

### 1.1 Conjuntos Numéricos

**Definición:**
Los números reales (ℝ) incluyen todos los números que se pueden representar en la recta numérica.

**Clasificación:**

```
ℝ (Reales)
├── ℚ (Racionales) → Se pueden expresar como fracción a/b con b≠0
│   ├── ℤ (Enteros) → ..., -2, -1, 0, 1, 2, ...
│   │   ├── ℕ (Naturales) → 1, 2, 3, 4, ...
│   │   └── ℤ⁻ (Enteros negativos)
│   └── Fraccionarios → 1/2, -3/4, 0.25
└── 𝕀 (Irracionales) → No se pueden expresar como fracción
    └── Ejemplos: √2, π, e, √5
```

**Propiedades fundamentales:**
- **Clausura:** La suma/producto de dos números reales es otro número real
- **Conmutativa:** a + b = b + a  y  a × b = b × a
- **Asociativa:** (a + b) + c = a + (b + c)
- **Distributiva:** a(b + c) = ab + ac
- **Elemento neutro:** a + 0 = a  y  a × 1 = a
- **Elemento inverso:** a + (-a) = 0  y  a × (1/a) = 1 (con a ≠ 0)

---

### 1.2 Orden en los Números Reales

**Recta numérica:**
```
    -5    -3    -1     0     1     3     5
←---+-----+-----+-----+-----+-----+-----+---→
  menor                              mayor
```

**Reglas de comparación:**
1. **Números positivos:** Mayor el que está más a la derecha (5 > 3)
2. **Números negativos:** Mayor el que está más cerca de cero (-2 > -5)
3. **Negativos vs positivos:** Cualquier positivo es mayor que cualquier negativo

**Ejemplo modelo:**
Ordenar de menor a mayor: -3.5, √2, -π, 0, 5/2

**Paso 1:** Aproximar valores decimales
- √2 ≈ 1.414
- -π ≈ -3.14159
- 5/2 = 2.5

**Paso 2:** Ubicar en la recta
```
-π    -3.5    0    √2    5/2
-3.14  -3.5    0   1.41   2.5
```

**Paso 3:** Ordenar
**-3.5 < -π < 0 < √2 < 5/2**

---

## 2. Potencias y Raíces

### 2.1 Leyes de Exponentes

**Fórmulas clave:**

| Ley | Fórmula | Ejemplo |
|-----|---------|---------|
| Producto de potencias | $$a^m \cdot a^n = a^{m+n}$$ | $$2^3 \cdot 2^5 = 2^8$$ |
| Cociente de potencias | $$\frac{a^m}{a^n} = a^{m-n}$$ | $$\frac{5^7}{5^3} = 5^4$$ |
| Potencia de potencia | $$(a^m)^n = a^{m \cdot n}$$ | $$(3^2)^4 = 3^8$$ |
| Potencia de un producto | $$(ab)^n = a^n \cdot b^n$$ | $$(2 \cdot 5)^3 = 2^3 \cdot 5^3$$ |
| Potencia de un cociente | $$\left(\frac{a}{b}\right)^n = \frac{a^n}{b^n}$$ | $$\left(\frac{3}{4}\right)^2 = \frac{9}{16}$$ |
| Exponente cero | $$a^0 = 1$$ (con a ≠ 0) | $$7^0 = 1$$ |
| Exponente negativo | $$a^{-n} = \frac{1}{a^n}$$ | $$2^{-3} = \frac{1}{8}$$ |
| Exponente fraccionario | $$a^{\frac{m}{n}} = \sqrt[n]{a^m}$$ | $$8^{\frac{2}{3}} = \sqrt[3]{64} = 4$$ |

**Ejercicio modelo paso a paso:**

Simplificar: $$\frac{(2^3 \cdot 2^{-5})^2}{2^{-4}}$$

**Paso 1:** Simplificar el numerador usando producto de potencias
$$2^3 \cdot 2^{-5} = 2^{3+(-5)} = 2^{-2}$$

**Paso 2:** Aplicar potencia de potencia
$$(2^{-2})^2 = 2^{-2 \cdot 2} = 2^{-4}$$

**Paso 3:** Aplicar cociente de potencias
$$\frac{2^{-4}}{2^{-4}} = 2^{-4-(-4)} = 2^0 = 1$$

**Respuesta:** 1

---

### 2.2 Raíces y Radicales

**Definición:**
$$\sqrt[n]{a} = b \Leftrightarrow b^n = a$$

**Propiedades:**

| Propiedad | Fórmula | Ejemplo |
|-----------|---------|---------|
| Raíz de un producto | $$\sqrt[n]{a \cdot b} = \sqrt[n]{a} \cdot \sqrt[n]{b}$$ | $$\sqrt{4 \cdot 9} = \sqrt{4} \cdot \sqrt{9} = 2 \cdot 3 = 6$$ |
| Raíz de un cociente | $$\sqrt[n]{\frac{a}{b}} = \frac{\sqrt[n]{a}}{\sqrt[n]{b}}$$ | $$\sqrt{\frac{25}{4}} = \frac{5}{2}$$ |
| Raíz de raíz | $$\sqrt[m]{\sqrt[n]{a}} = \sqrt[m \cdot n]{a}$$ | $$\sqrt{\sqrt[3]{8}} = \sqrt[6]{8}$$ |
| Racionalización | $$\frac{1}{\sqrt{a}} = \frac{\sqrt{a}}{a}$$ | $$\frac{1}{\sqrt{2}} = \frac{\sqrt{2}}{2}$$ |

**Ejercicio modelo:**

Simplificar: $$\sqrt{50} + \sqrt{8} - \sqrt{18}$$

**Paso 1:** Descomponer en factores primos
- $$\sqrt{50} = \sqrt{25 \cdot 2} = \sqrt{25} \cdot \sqrt{2} = 5\sqrt{2}$$
- $$\sqrt{8} = \sqrt{4 \cdot 2} = 2\sqrt{2}$$
- $$\sqrt{18} = \sqrt{9 \cdot 2} = 3\sqrt{2}$$

**Paso 2:** Sumar términos semejantes
$$5\sqrt{2} + 2\sqrt{2} - 3\sqrt{2} = (5 + 2 - 3)\sqrt{2} = 4\sqrt{2}$$

**Respuesta:** $$4\sqrt{2}$$

---

## 3. Expresiones Algebraicas

### 3.1 Terminología

**Ejemplo:** $$3x^2 - 5xy + 7$$

- **Términos:** $$3x^2$$, $$-5xy$$, $$7$$
- **Coeficientes:** 3, -5, 7
- **Variables:** x, y
- **Exponentes:** 2, 1
- **Término independiente:** 7

**Tipos de expresiones:**
- **Monomio:** Un solo término → $$5x^3$$
- **Binomio:** Dos términos → $$x^2 + 3$$
- **Trinomio:** Tres términos → $$x^2 + 5x + 6$$
- **Polinomio:** Varios términos → $$2x^4 - 3x^3 + x^2 - 5x + 1$$

---

### 3.2 Operaciones con Expresiones Algebraicas

**Suma y resta:** Combinar términos semejantes

**Ejemplo:**
$$(3x^2 + 5x - 2) + (x^2 - 3x + 7)$$
$$= 3x^2 + x^2 + 5x - 3x - 2 + 7$$
$$= 4x^2 + 2x + 5$$

**Multiplicación:** Aplicar propiedad distributiva

**Ejemplo:**
$$(2x + 3)(x - 4)$$
$$= 2x \cdot x + 2x \cdot (-4) + 3 \cdot x + 3 \cdot (-4)$$
$$= 2x^2 - 8x + 3x - 12$$
$$= 2x^2 - 5x - 12$$

**Productos notables:**

| Nombre | Fórmula | Desarrollo |
|--------|---------|------------|
| Cuadrado de binomio | $$(a + b)^2$$ | $$a^2 + 2ab + b^2$$ |
| Cuadrado de binomio | $$(a - b)^2$$ | $$a^2 - 2ab + b^2$$ |
| Suma por diferencia | $$(a + b)(a - b)$$ | $$a^2 - b^2$$ |
| Cubo de binomio | $$(a + b)^3$$ | $$a^3 + 3a^2b + 3ab^2 + b^3$$ |

**Ejemplo modelo:**
Desarrollar: $$(3x - 2)^2$$

**Método 1:** Aplicar fórmula
$$(a - b)^2 = a^2 - 2ab + b^2$$
donde a = 3x, b = 2
$$= (3x)^2 - 2(3x)(2) + (2)^2$$
$$= 9x^2 - 12x + 4$$

**Método 2:** Multiplicar
$$(3x - 2)(3x - 2)$$
$$= 9x^2 - 6x - 6x + 4$$
$$= 9x^2 - 12x + 4$$

---

### 3.3 Factorización

**Técnicas principales:**

**1. Factor común**
$$6x^2 + 9x = 3x(2x + 3)$$

**2. Diferencia de cuadrados**
$$x^2 - 16 = (x + 4)(x - 4)$$

**3. Trinomio cuadrado perfecto**
$$x^2 + 6x + 9 = (x + 3)^2$$

**4. Trinomio de la forma x² + bx + c**
$$x^2 + 5x + 6 = (x + 2)(x + 3)$$
Buscar dos números que sumen 5 y multipliquen 6 → 2 y 3

**5. Trinomio de la forma ax² + bx + c (a ≠ 1)**
$$2x^2 + 7x + 3$$

**Método:** Buscar dos números que multipliquen (2)(3) = 6 y sumen 7 → 6 y 1
$$= 2x^2 + 6x + x + 3$$
$$= 2x(x + 3) + 1(x + 3)$$
$$= (2x + 1)(x + 3)$$

**Ejercicio modelo completo:**
Factorizar: $$3x^2 - 12$$

**Paso 1:** Factor común
$$= 3(x^2 - 4)$$

**Paso 2:** Diferencia de cuadrados
$$= 3(x + 2)(x - 2)$$

**Respuesta:** $$3(x + 2)(x - 2)$$

---

## 4. Ecuaciones

### 4.1 Ecuaciones Lineales

**Forma general:** $$ax + b = c$$

**Estrategia de resolución:**
1. Eliminar paréntesis (distributiva)
2. Agrupar términos con x en un lado
3. Agrupar términos independientes en el otro lado
4. Despejar x

**Ejemplo modelo:**
Resolver: $$3(x - 2) + 5 = 2x + 7$$

**Paso 1:** Distributiva
$$3x - 6 + 5 = 2x + 7$$

**Paso 2:** Simplificar
$$3x - 1 = 2x + 7$$

**Paso 3:** Agrupar términos con x
$$3x - 2x = 7 + 1$$

**Paso 4:** Resolver
$$x = 8$$

**Verificación:** $$3(8 - 2) + 5 = 3(6) + 5 = 23$$ y $$2(8) + 7 = 23$$ ✓

---

### 4.2 Ecuaciones Cuadráticas

**Forma general:** $$ax^2 + bx + c = 0$$ (con a ≠ 0)

**Métodos de resolución:**

**1. Factorización**
$$x^2 + 5x + 6 = 0$$
$$(x + 2)(x + 3) = 0$$
$$x = -2 \text{ o } x = -3$$

**2. Fórmula cuadrática**
$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

**Discriminante:** $$\Delta = b^2 - 4ac$$
- Si Δ > 0 → dos soluciones reales distintas
- Si Δ = 0 → una solución real (raíz doble)
- Si Δ < 0 → no tiene soluciones reales

**Ejemplo modelo completo:**
Resolver: $$2x^2 - 5x + 2 = 0$$

**Identificar:** a = 2, b = -5, c = 2

**Paso 1:** Calcular discriminante
$$\Delta = (-5)^2 - 4(2)(2) = 25 - 16 = 9$$

**Paso 2:** Como Δ > 0, hay dos soluciones

**Paso 3:** Aplicar fórmula
$$x = \frac{-(-5) \pm \sqrt{9}}{2(2)} = \frac{5 \pm 3}{4}$$

**Paso 4:** Calcular ambas soluciones
$$x_1 = \frac{5 + 3}{4} = \frac{8}{4} = 2$$
$$x_2 = \frac{5 - 3}{4} = \frac{2}{4} = \frac{1}{2}$$

**Respuesta:** $$x = 2 \text{ o } x = \frac{1}{2}$$

---

### 4.3 Sistemas de Ecuaciones Lineales

**Forma general:**
$$\begin{cases} ax + by = c \\ dx + ey = f \end{cases}$$

**Métodos de resolución:**

**1. Sustitución**
**2. Igualación**
**3. Reducción (eliminación)**

**Ejemplo modelo - Método de reducción:**

Resolver:
$$\begin{cases} 2x + 3y = 13 \\ 5x - 2y = 4 \end{cases}$$

**Paso 1:** Eliminar una variable (elegimos y)
Multiplicar la primera ecuación por 2 y la segunda por 3:
$$\begin{cases} 4x + 6y = 26 \\ 15x - 6y = 12 \end{cases}$$

**Paso 2:** Sumar ambas ecuaciones
$$4x + 6y + 15x - 6y = 26 + 12$$
$$19x = 38$$
$$x = 2$$

**Paso 3:** Sustituir x = 2 en la primera ecuación original
$$2(2) + 3y = 13$$
$$4 + 3y = 13$$
$$3y = 9$$
$$y = 3$$

**Respuesta:** $$x = 2, y = 3$$ o par ordenado $$(2, 3)$$

**Verificación en ambas ecuaciones:**
- $$2(2) + 3(3) = 4 + 9 = 13$$ ✓
- $$5(2) - 2(3) = 10 - 6 = 4$$ ✓

---

## 5. Inecuaciones

### 5.1 Inecuaciones Lineales

**Forma general:** $$ax + b < c$$ (también >, ≤, ≥)

**Reglas importantes:**
1. Sumar/restar el mismo número a ambos lados NO cambia el sentido
2. **Multiplicar/dividir por número negativo INVIERTE el sentido**

**Ejemplo modelo:**
Resolver: $$-3x + 5 \leq 14$$

**Paso 1:** Restar 5 a ambos lados
$$-3x \leq 9$$

**Paso 2:** Dividir por -3 (INVERTIR el sentido)
$$x \geq -3$$

**Representación gráfica:**
```
     [-3 ========>
←----+----+----+----+----→
    -4   -3   -2   -1    0
```

**Respuesta:** $$x \geq -3$$ o en intervalo: $$[-3, +\infty)$$

---

## 6. Errores Conceptuales Comunes

### ❌ ERROR 1: Sumar exponentes en la suma
**Incorrecto:** $$2^3 + 2^5 = 2^8$$
**Correcto:** $$2^3 + 2^5 = 8 + 32 = 40$$
*Solo se suman exponentes en el PRODUCTO, no en la suma*

### ❌ ERROR 2: Distributiva incorrecta
**Incorrecto:** $$(x + 3)^2 = x^2 + 9$$
**Correcto:** $$(x + 3)^2 = x^2 + 6x + 9$$
*No olvidar el término del medio: 2ab*

### ❌ ERROR 3: Cambio de signo al transponer
**Incorrecto:** $$3x + 5 = 20 \Rightarrow 3x = 20 + 5$$
**Correcto:** $$3x + 5 = 20 \Rightarrow 3x = 20 - 5$$
*Al pasar al otro lado, el signo se invierte*

### ❌ ERROR 4: División por variable sin considerar cero
**Peligroso:** $$x^2 = 3x \Rightarrow x = 3$$ (dividiendo por x)
**Correcto:** $$x^2 - 3x = 0 \Rightarrow x(x - 3) = 0 \Rightarrow x = 0 \text{ o } x = 3$$
*Nunca dividir por una variable que podría ser cero*

### ❌ ERROR 5: Raíz cuadrada de suma
**Incorrecto:** $$\sqrt{a + b} = \sqrt{a} + \sqrt{b}$$
**Correcto:** $$\sqrt{a + b} \neq \sqrt{a} + \sqrt{b}$$
*Ejemplo: $$\sqrt{9 + 16} = \sqrt{25} = 5 \neq 3 + 4 = 7$$*

---

## 7. Conexiones con otros dominios

**Con Geometría:**
- Teorema de Pitágoras usa potencias y raíces: $$c = \sqrt{a^2 + b^2}$$
- Áreas y volúmenes requieren operaciones algebraicas

**Con Funciones:**
- Resolver ecuaciones es encontrar raíces de funciones
- Inecuaciones determinan dominio de funciones

**Con Probabilidad:**
- Combinatoria usa factorización y potencias
- Estadística descriptiva usa expresiones algebraicas

---

## ✅ Autoevaluación

**Deberías poder:**
- [ ] Clasificar números reales en racionales e irracionales
- [ ] Aplicar las 8 leyes de exponentes correctamente
- [ ] Simplificar expresiones con radicales
- [ ] Realizar las 4 operaciones con expresiones algebraicas
- [ ] Aplicar los 5 productos notables
- [ ] Factorizar usando las 5 técnicas principales
- [ ] Resolver ecuaciones lineales en 4 pasos
- [ ] Resolver ecuaciones cuadráticas por factorización y fórmula
- [ ] Resolver sistemas de ecuaciones por 3 métodos
- [ ] Resolver inecuaciones respetando las reglas de signos

**Indicador de dominio:**
- ✅ **8-10 marcados:** Excelente dominio, listo para aplicaciones
- ⚠️ **5-7 marcados:** Buen nivel, revisar temas débiles
- ❌ **0-4 marcados:** Repasar fundamentos antes de continuar

---

**Siguiente:** [Dossier Parte 2 - Geometría](./02-geometria.md)
