# 📐 Dossier Matemática Media - Parte 4

## Dominio 4: Funciones

---

## 1. Concepto de Función

### 1.1 Definición

**Función:** Relación entre dos conjuntos (A y B) donde cada elemento de A se relaciona con exactamente UN elemento de B.

**Notación:**
$$f: A \rightarrow B$$
$$f(x) = y$$

Donde:
- **x:** Variable independiente (entrada)
- **y:** Variable dependiente (salida)
- **A:** Dominio (conjunto de partida)
- **B:** Codominio (conjunto de llegada)
- **f:** Regla de correspondencia

**Ejemplo:**
$$f(x) = 2x + 3$$

Si x = 5, entonces $$f(5) = 2(5) + 3 = 13$$

---

### 1.2 Dominio y Recorrido

**Dominio (Dom f):** Conjunto de todos los valores que puede tomar x.

**Recorrido (Rec f):** Conjunto de todos los valores que toma y = f(x).

**Restricciones comunes del dominio:**

| Tipo | Restricción | Ejemplo |
|------|-------------|---------|
| **Fracción** | Denominador ≠ 0 | $$f(x) = \frac{1}{x-2}$$ → Dom: x ≠ 2 |
| **Raíz par** | Radicando ≥ 0 | $$f(x) = \sqrt{x-3}$$ → Dom: x ≥ 3 |
| **Logaritmo** | Argumento > 0 | $$f(x) = \log(x+1)$$ → Dom: x > -1 |

**Ejemplo modelo:**

Determinar dominio y recorrido de $$f(x) = \sqrt{4-x}$$

**Dominio:**
Para que exista la raíz: $$4 - x \geq 0$$
$$4 \geq x$$
$$x \leq 4$$

**Dom f:** $$(-\infty, 4]$$ o $$\{x \in \mathbb{R} : x \leq 4\}$$

**Recorrido:**
Como la raíz cuadrada siempre es ≥ 0:

**Rec f:** $$[0, +\infty)$$ o $$\{y \in \mathbb{R} : y \geq 0\}$$

---

### 1.3 Criterio de la Recta Vertical

**Regla:** Un gráfico representa una función SI Y SOLO SI toda recta vertical corta el gráfico en a lo más un punto.

**Ejemplo:**

✅ **Es función:** Parábola vertical  
❌ **No es función:** Circunferencia (algunas verticales cortan en 2 puntos)

---

## 2. Función Lineal

### 2.1 Definición y Forma General

**Función afín:**
$$f(x) = mx + n$$

Donde:
- **m:** Pendiente (determina la inclinación)
- **n:** Intercepto con el eje Y (donde la recta corta el eje Y)

**Casos especiales:**

- Si n = 0: $$f(x) = mx$$ → **Función lineal** (pasa por el origen)
- Si m = 0: $$f(x) = n$$ → **Función constante** (recta horizontal)

**Gráfico:** Recta

---

### 2.2 Pendiente

**Definición:** Razón de cambio entre y y x. Mide la inclinación de la recta.

**Fórmula (dados dos puntos):**
$$m = \frac{y_2 - y_1}{x_2 - x_1} = \frac{\Delta y}{\Delta x}$$

**Interpretación:**
- **m > 0:** Función creciente (sube de izquierda a derecha)
- **m < 0:** Función decreciente (baja de izquierda a derecha)
- **m = 0:** Función constante (horizontal)
- **|m| grande:** Recta muy empinada
- **|m| pequeño:** Recta poco inclinada

**Ejemplo modelo:**

Encontrar la ecuación de la recta que pasa por A(1, 2) y B(4, 8).

**Paso 1:** Calcular pendiente
$$m = \frac{8 - 2}{4 - 1} = \frac{6}{3} = 2$$

**Paso 2:** Usar punto-pendiente con A(1, 2)
$$y - y_1 = m(x - x_1)$$
$$y - 2 = 2(x - 1)$$
$$y - 2 = 2x - 2$$
$$y = 2x$$

**Respuesta:** $$f(x) = 2x$$

---

### 2.3 Ecuación de la Recta

**Formas principales:**

| Forma | Ecuación | Uso |
|-------|----------|-----|
| **Pendiente-intercepto** | $$y = mx + n$$ | Cuando conoces m y n |
| **Punto-pendiente** | $$y - y_1 = m(x - x_1)$$ | Cuando conoces m y un punto |
| **Dos puntos** | $$\frac{y - y_1}{y_2 - y_1} = \frac{x - x_1}{x_2 - x_1}$$ | Cuando conoces dos puntos |
| **General** | $$Ax + By + C = 0$$ | Forma estándar |

**Ejemplo:**

Ecuación de la recta con pendiente m = -3 que pasa por P(2, 5).

**Método:** Punto-pendiente
$$y - 5 = -3(x - 2)$$
$$y - 5 = -3x + 6$$
$$y = -3x + 11$$

**Respuesta:** $$f(x) = -3x + 11$$

---

### 2.4 Rectas Paralelas y Perpendiculares

**Paralelas:** Tienen la misma pendiente
$$m_1 = m_2$$

**Perpendiculares:** Producto de pendientes = -1
$$m_1 \cdot m_2 = -1$$ o $$m_2 = -\frac{1}{m_1}$$

**Ejemplo:**

Ecuación de la recta paralela a $$y = 2x + 1$$ que pasa por (3, 4).

**Paso 1:** Identificar pendiente → m = 2 (igual para paralela)

**Paso 2:** Punto-pendiente
$$y - 4 = 2(x - 3)$$
$$y = 2x - 2$$

**Respuesta:** $$f(x) = 2x - 2$$

---

## 3. Función Cuadrática

### 3.1 Definición y Forma General

**Función cuadrática:**
$$f(x) = ax^2 + bx + c$$ con $$a \neq 0$$

Donde:
- **a:** Determina abertura (a > 0 → abre hacia arriba; a < 0 → abre hacia abajo)
- **b y c:** Determinan la posición
- **Gráfico:** Parábola

**Forma canónica (vértice):**
$$f(x) = a(x - h)^2 + k$$

Donde V(h, k) es el vértice de la parábola.

---

### 3.2 Elementos de la Parábola

**Vértice:** Punto máximo o mínimo de la parábola

**Fórmulas del vértice:**
$$h = -\frac{b}{2a}$$
$$k = f(h) = f\left(-\frac{b}{2a}\right)$$

**Eje de simetría:** Recta vertical $$x = h$$

**Intersecciones con eje X (raíces):**
Resolver $$ax^2 + bx + c = 0$$ usando fórmula cuadrática:
$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

**Intersección con eje Y:**
$$f(0) = c$$ → Punto (0, c)

**Ejemplo modelo completo:**

Analizar $$f(x) = x^2 - 4x + 3$$

**Paso 1:** Identificar a = 1, b = -4, c = 3

**Paso 2:** Como a > 0, la parábola abre hacia arriba (tiene mínimo)

**Paso 3:** Calcular vértice
$$h = -\frac{-4}{2(1)} = \frac{4}{2} = 2$$
$$k = f(2) = 2^2 - 4(2) + 3 = 4 - 8 + 3 = -1$$

**Vértice:** V(2, -1)

**Paso 4:** Raíces (intersecciones con eje X)
$$x^2 - 4x + 3 = 0$$
$$(x - 1)(x - 3) = 0$$
$$x = 1 \text{ o } x = 3$$

**Paso 5:** Intersección con eje Y
$$f(0) = 3$$ → Punto (0, 3)

**Resumen:**
- Vértice: (2, -1) (mínimo)
- Raíces: x = 1, x = 3
- Intercepto Y: (0, 3)
- Eje de simetría: x = 2
- Dominio: $$\mathbb{R}$$
- Recorrido: $$[-1, +\infty)$$

---

### 3.3 Discriminante

**Discriminante:** $$\Delta = b^2 - 4ac$$

**Interpretación:**

- **Δ > 0:** Dos raíces reales distintas (parábola corta eje X en 2 puntos)
- **Δ = 0:** Una raíz real doble (parábola es tangente al eje X)
- **Δ < 0:** No tiene raíces reales (parábola no corta el eje X)

**Ejemplo:**

$$f(x) = x^2 + 2x + 5$$

$$\Delta = 2^2 - 4(1)(5) = 4 - 20 = -16 < 0$$

**Conclusión:** No tiene raíces reales, la parábola está completamente por encima del eje X.

---

### 3.4 Traslaciones de Parábolas

**Función básica:** $$f(x) = x^2$$

**Transformaciones:**

| Transformación | Función | Efecto |
|----------------|---------|--------|
| Traslación vertical | $$f(x) = x^2 + k$$ | Sube k unidades (k>0) o baja |k| unidades (k<0) |
| Traslación horizontal | $$f(x) = (x - h)^2$$ | Derecha h unidades (h>0) o izquierda |h| unidades (h<0) |
| Ambas traslaciones | $$f(x) = (x - h)^2 + k$$ | Vértice en (h, k) |
| Reflexión | $$f(x) = -x^2$$ | Abre hacia abajo |
| Dilatación/compresión | $$f(x) = ax^2$$ | |a|>1: más angosta; 0<|a|<1: más ancha |

**Ejemplo:**

$$f(x) = -(x + 2)^2 + 3$$

**Interpretaciones:**
- Vértice: (-2, 3)
- Abre hacia abajo (por el signo negativo)
- Misma abertura que $$x^2$$ (coeficiente = -1)

---

## 4. Función Exponencial

### 4.1 Definición

**Función exponencial:**
$$f(x) = a \cdot b^x$$

Donde:
- **a:** Valor inicial (cuando x = 0)
- **b:** Base (b > 0, b ≠ 1)
- **x:** Exponente variable

**Propiedades:**

- **Dominio:** $$\mathbb{R}$$ (todos los reales)
- **Recorrido:** $$(0, +\infty)$$ (siempre positiva si a > 0)
- **Asíntota horizontal:** y = 0 (eje X)

**Comportamiento:**

- Si **b > 1:** Función creciente (crecimiento exponencial)
- Si **0 < b < 1:** Función decreciente (decrecimiento exponencial)

---

### 4.2 Crecimiento Exponencial

**Modelo:** $$f(t) = P_0 \cdot (1 + r)^t$$

Donde:
- $$P_0$$: Cantidad inicial
- **r:** Tasa de crecimiento (en decimal)
- **t:** Tiempo

**Ejemplo modelo:**

Una población de bacterias tiene 1000 individuos y crece 20% por hora. ¿Cuántas habrá después de 5 horas?

**Paso 1:** Identificar valores
- $$P_0 = 1000$$
- $$r = 0.20$$ (20%)
- $$t = 5$$ horas

**Paso 2:** Aplicar fórmula
$$P(5) = 1000 \cdot (1 + 0.20)^5$$
$$= 1000 \cdot (1.20)^5$$
$$= 1000 \cdot 2.48832$$
$$\approx 2488 \text{ bacterias}$$

---

### 4.3 Decrecimiento Exponencial

**Modelo:** $$f(t) = P_0 \cdot (1 - r)^t$$

**Aplicación:** Desintegración radiactiva, depreciación, enfriamiento.

**Ejemplo:**

Un auto vale $10,000,000 y se deprecia 15% anual. ¿Cuánto valdrá en 3 años?

$$V(3) = 10,000,000 \cdot (1 - 0.15)^3$$
$$= 10,000,000 \cdot (0.85)^3$$
$$= 10,000,000 \cdot 0.614125$$
$$\approx \$6,141,250$$

---

## 5. Función Logarítmica (Introducción)

### 5.1 Definición

**Logaritmo:** Operación inversa de la exponenciación.

$$\log_b(x) = y \Leftrightarrow b^y = x$$

Donde:
- **b:** Base del logaritmo (b > 0, b ≠ 1)
- **x:** Argumento (x > 0)
- **y:** Logaritmo

**Ejemplo:**

$$\log_2(8) = 3$$ porque $$2^3 = 8$$

$$\log_{10}(100) = 2$$ porque $$10^2 = 100$$

---

### 5.2 Propiedades de Logaritmos

| Propiedad | Fórmula |
|-----------|---------|
| Logaritmo de un producto | $$\log_b(xy) = \log_b(x) + \log_b(y)$$ |
| Logaritmo de un cociente | $$\log_b\left(\frac{x}{y}\right) = \log_b(x) - \log_b(y)$$ |
| Logaritmo de una potencia | $$\log_b(x^n) = n \cdot \log_b(x)$$ |
| Cambio de base | $$\log_b(x) = \frac{\log_a(x)}{\log_a(b)}$$ |
| Logaritmo de 1 | $$\log_b(1) = 0$$ |
| Logaritmo de la base | $$\log_b(b) = 1$$ |

**Ejemplo:**

Simplificar: $$\log_2(16) + \log_2(4) - \log_2(32)$$

**Paso 1:** Expresar como potencias de 2
$$= \log_2(2^4) + \log_2(2^2) - \log_2(2^5)$$

**Paso 2:** Aplicar propiedad de potencia
$$= 4\log_2(2) + 2\log_2(2) - 5\log_2(2)$$

**Paso 3:** Como $$\log_2(2) = 1$$
$$= 4(1) + 2(1) - 5(1)$$
$$= 4 + 2 - 5 = 1$$

---

## 6. Interpretación de Gráficos

### 6.1 Lectura de Información

**Del gráfico se puede determinar:**

- Dominio y recorrido
- Crecimiento y decrecimiento
- Máximos y mínimos
- Intersecciones con los ejes
- Simetría
- Asíntotas

**Ejemplo:**

Dada la gráfica de una parábola que:
- Abre hacia abajo
- Vértice en (3, 5)
- Corta el eje X en x = 1 y x = 5

**Análisis:**
- **Dom:** $$\mathbb{R}$$
- **Rec:** $$(-\infty, 5]$$
- **Máximo:** 5 (en x = 3)
- **Crece en:** $$(-\infty, 3]$$
- **Decrece en:** $$[3, +\infty)$$
- **Raíces:** x = 1, x = 5

---

## 7. Modelamiento con Funciones

### 7.1 Proceso de Modelamiento

**Pasos:**

1. **Identificar variables:** Dependiente e independiente
2. **Determinar tipo de función:** Lineal, cuadrática, exponencial
3. **Establecer ecuación:** Usando datos del problema
4. **Resolver:** Aplicar la función
5. **Interpretar:** Resultado en contexto del problema

**Ejemplo modelo completo:**

Una empresa de taxis cobra $500 fijo más $300 por kilómetro. Modelar el costo.

**Paso 1:** Variables
- x = kilómetros recorridos (independiente)
- C(x) = costo total (dependiente)

**Paso 2:** Tipo de función → Lineal (tasa constante)

**Paso 3:** Ecuación
$$C(x) = 300x + 500$$

**Paso 4:** Calcular costo de 15 km
$$C(15) = 300(15) + 500 = 4500 + 500 = \$5000$$

**Paso 5:** Interpretación
"Un viaje de 15 km cuesta $5000"

---

## 8. Errores Conceptuales Comunes

### ❌ ERROR 1: Confundir f(x) con f·x

**Incorrecto:** f(3) = f·3 (multiplicación)
**Correcto:** f(3) significa "evaluar la función en x = 3"
*f(x) es notación funcional, no multiplicación*

### ❌ ERROR 2: Dominio de función cuadrática

**Incorrecto:** "El dominio de $$f(x) = x^2$$ es $$x \geq 0$$"
**Correcto:** Dominio = $$\mathbb{R}$$ (todos los reales)
*El recorrido es $$[0, +\infty)$$, no el dominio*

### ❌ ERROR 3: Pendiente con orden de puntos

**Incorrecto:** $$m = \frac{x_2 - x_1}{y_2 - y_1}$$ (invertir x e y)
**Correcto:** $$m = \frac{y_2 - y_1}{x_2 - x_1}$$ (cambio en y sobre cambio en x)
*Recordar: "rise over run" (subida sobre avance)*

### ❌ ERROR 4: Vértice de parábola

**Incorrecto:** "El vértice de $$f(x) = x^2 + 4x + 3$$ es x = 2"
**Correcto:** El vértice es un PUNTO → V(-2, -1), no solo la coordenada x
*h = -b/(2a) = -4/2 = -2, luego calcular k = f(-2)*

### ❌ ERROR 5: Crecimiento exponencial

**Incorrecto:** "Si algo crece 50% cada año, en 2 años crece 100%"
**Correcto:** Crece (1.5)² = 2.25, es decir, 125%
*El crecimiento se multiplica, no se suma*

---

## 9. Conexiones con Otros Dominios

**Con Álgebra:**
- Resolución de ecuaciones para encontrar raíces
- Factorización para analizar funciones cuadráticas

**Con Geometría:**
- Gráficos de funciones en plano cartesiano
- Pendiente relacionada con ángulo de inclinación

**Con Probabilidad:**
- Funciones para modelar distribuciones
- Crecimiento exponencial en problemas de combinatoria

---

## ✅ Autoevaluación

**Deberías poder:**

- [ ] Determinar si una relación es función
- [ ] Calcular dominio y recorrido de funciones
- [ ] Encontrar ecuación de recta (3 métodos)
- [ ] Identificar rectas paralelas y perpendiculares
- [ ] Analizar función cuadrática completa (vértice, raíces, dominio, recorrido)
- [ ] Interpretar el discriminante
- [ ] Aplicar transformaciones a parábolas
- [ ] Modelar situaciones con crecimiento exponencial
- [ ] Aplicar propiedades básicas de logaritmos
- [ ] Interpretar y analizar gráficos de funciones

**Indicador de dominio:**

- ✅ **8-10 marcados:** Excelente dominio, listo para aplicaciones avanzadas
- ⚠️ **5-7 marcados:** Buen nivel, repasar conceptos débiles
- ❌ **0-4 marcados:** Repasar teoría fundamental y practicar más

---

**Anterior:** [Dossier Parte 3 - Probabilidad y Estadística](./03-probabilidad-estadistica.md)

---

## 🎓 Dossier Completo Matemática Media

Has completado los 4 dominios fundamentales:

1. ✅ **Números y Álgebra** - Operaciones, ecuaciones, sistemas
2. ✅ **Geometría** - Figuras, teoremas, coordenadas, transformaciones
3. ✅ **Probabilidad y Estadística** - Datos, gráficos, medidas, probabilidad
4. ✅ **Funciones** - Lineal, cuadrática, exponencial, logarítmica

**Próximos pasos:**
- Practicar con casos de estudio
- Resolver prueba de práctica con 30 preguntas
- Integrar conocimientos en problemas complejos
- Utilizar IA para profundizar en áreas débiles
