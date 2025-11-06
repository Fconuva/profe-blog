# 📐 Dossier Matemática Media - Parte 3

## Dominio 3: Probabilidad y Estadística

---

## 1. Estadística Descriptiva

### 1.1 Tablas de Frecuencia

**Terminología:**

- **Dato:** Valor individual observado
- **Frecuencia absoluta (f):** Cantidad de veces que aparece un dato
- **Frecuencia relativa (fr):** Proporción del dato respecto al total → fr = f/n
- **Frecuencia porcentual (%):** Frecuencia relativa × 100
- **Frecuencia acumulada (F):** Suma de frecuencias hasta ese dato

**Ejemplo modelo:**

Notas de 20 estudiantes: 4, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 7, 5, 6, 6, 4, 7, 6, 5, 6

**Tabla de frecuencia:**

| Nota | f | fr | % | F |
|------|---|-----|-----|---|
| 4 | 2 | 0.10 | 10% | 2 |
| 5 | 4 | 0.20 | 20% | 6 |
| 6 | 8 | 0.40 | 40% | 14 |
| 7 | 6 | 0.30 | 30% | 20 |
| **Total** | **20** | **1.00** | **100%** | - |

**Interpretación:**
- El 40% de los estudiantes obtuvo nota 6
- 14 estudiantes obtuvieron nota 6 o menor
- La nota más frecuente es 6

---

### 1.2 Gráficos Estadísticos

**Tipos principales:**

**1. Gráfico de barras**
- Eje X: categorías o valores
- Eje Y: frecuencias
- Ideal para: variables categóricas o discretas

**2. Histograma**
- Similar a barras pero SIN espacio entre ellas
- Ideal para: variables continuas agrupadas en intervalos

**3. Gráfico circular (torta)**
- Cada sector representa un porcentaje del total
- Ángulo del sector = (frecuencia relativa) × 360°
- Ideal para: mostrar proporciones

**4. Gráfico de líneas**
- Muestra evolución en el tiempo
- Ideal para: series temporales

**Ejemplo modelo - Gráfico circular:**

De 40 estudiantes:
- 10 prefieren fútbol (25%)
- 15 prefieren básquetbol (37.5%)
- 8 prefieren voleibol (20%)
- 7 prefieren tenis (17.5%)

**Cálculo de ángulos:**
- Fútbol: 0.25 × 360° = 90°
- Básquetbol: 0.375 × 360° = 135°
- Voleibol: 0.20 × 360° = 72°
- Tenis: 0.175 × 360° = 63°

---

## 2. Medidas de Tendencia Central

### 2.1 Media Aritmética (Promedio)

**Definición:** Suma de todos los datos dividida por la cantidad de datos.

**Fórmula:**
$$\bar{x} = \frac{x_1 + x_2 + ... + x_n}{n} = \frac{\sum x_i}{n}$$

**Con tabla de frecuencia:**
$$\bar{x} = \frac{f_1 \cdot x_1 + f_2 \cdot x_2 + ... + f_k \cdot x_k}{n} = \frac{\sum f_i \cdot x_i}{n}$$

**Ejemplo modelo:**

Calcular la media de: 5, 7, 8, 6, 9, 5, 7

**Paso 1:** Sumar todos los datos
$$5 + 7 + 8 + 6 + 9 + 5 + 7 = 47$$

**Paso 2:** Dividir por n = 7
$$\bar{x} = \frac{47}{7} \approx 6.71$$

**Respuesta:** 6.71

**Propiedades:**
- Sensible a valores extremos (outliers)
- Puede no pertenecer al conjunto de datos
- Suma de desviaciones respecto a la media es cero

---

### 2.2 Mediana

**Definición:** Valor central cuando los datos están ordenados. Divide el conjunto en dos partes iguales.

**Cálculo:**
1. Ordenar datos de menor a mayor
2. Si n es impar: mediana = dato central (posición (n+1)/2)
3. Si n es par: mediana = promedio de los dos datos centrales

**Ejemplo 1 - n impar:**
Datos: 3, 7, 2, 9, 5

**Paso 1:** Ordenar: 2, 3, 5, 7, 9  
**Paso 2:** n = 5 (impar), posición central = (5+1)/2 = 3  
**Paso 3:** Mediana = 5

**Ejemplo 2 - n par:**
Datos: 4, 8, 2, 6, 5, 9

**Paso 1:** Ordenar: 2, 4, 5, 6, 8, 9  
**Paso 2:** n = 6 (par), posiciones centrales: 3 y 4  
**Paso 3:** Mediana = (5 + 6)/2 = 5.5

**Propiedades:**
- NO sensible a valores extremos
- Representa el percentil 50
- Siempre existe y es única

---

### 2.3 Moda

**Definición:** Valor que aparece con mayor frecuencia.

**Casos:**
- **Unimodal:** Un solo valor con máxima frecuencia
- **Bimodal:** Dos valores con máxima frecuencia
- **Multimodal:** Más de dos valores con máxima frecuencia
- **Amodal:** Todos los valores tienen la misma frecuencia

**Ejemplo:**
Datos: 2, 5, 5, 7, 8, 5, 3, 7, 5

**Frecuencias:**
- 2 aparece 1 vez
- 3 aparece 1 vez
- 5 aparece **4 veces** ← Mayor frecuencia
- 7 aparece 2 veces
- 8 aparece 1 vez

**Moda:** 5 (unimodal)

**Propiedades:**
- Única medida que tiene sentido para datos cualitativos
- Puede haber varias modas o ninguna
- No siempre es única

---

### 2.4 Comparación de Medidas

| Situación | Media | Mediana | Moda |
|-----------|-------|---------|------|
| Datos simétricos | Igual a mediana | Igual a media | Puede coincidir |
| Datos con outliers | Se distorsiona | Se mantiene | No afecta |
| Datos cualitativos | No aplica | No aplica | **Única opción** |
| Mejor para promedios | ✓ Sí | No | No |
| Mejor para valor típico | Depende | ✓ Sí | ✓ Sí |

**Ejemplo comparativo:**

Sueldos de 7 empleados: $300, $350, $350, $400, $400, $450, $2000

- **Media:** $750 (distorsionada por el sueldo $2000)
- **Mediana:** $400 (valor central, más representativo)
- **Moda:** $350 y $400 (bimodal)

**Conclusión:** En presencia de outliers, la **mediana** es más representativa.

---

## 3. Medidas de Dispersión

### 3.1 Rango

**Definición:** Diferencia entre el valor máximo y mínimo.

**Fórmula:**
$$R = x_{max} - x_{min}$$

**Ejemplo:**
Datos: 12, 15, 18, 20, 25

$$R = 25 - 12 = 13$$

**Ventajas:** Fácil de calcular  
**Desventajas:** Muy sensible a valores extremos

---

### 3.2 Varianza

**Definición:** Promedio de las desviaciones cuadradas respecto a la media.

**Fórmula (poblacional):**
$$\sigma^2 = \frac{\sum (x_i - \bar{x})^2}{n}$$

**Fórmula (muestral):**
$$s^2 = \frac{\sum (x_i - \bar{x})^2}{n - 1}$$

**Ejemplo modelo:**

Calcular la varianza de: 4, 7, 10

**Paso 1:** Calcular media
$$\bar{x} = \frac{4 + 7 + 10}{3} = \frac{21}{3} = 7$$

**Paso 2:** Calcular desviaciones cuadradas
- $$(4 - 7)^2 = (-3)^2 = 9$$
- $$(7 - 7)^2 = 0^2 = 0$$
- $$(10 - 7)^2 = 3^2 = 9$$

**Paso 3:** Sumar y dividir
$$\sigma^2 = \frac{9 + 0 + 9}{3} = \frac{18}{3} = 6$$

**Respuesta:** Varianza = 6

---

### 3.3 Desviación Estándar

**Definición:** Raíz cuadrada de la varianza. Mide dispersión en las mismas unidades que los datos.

**Fórmula:**
$$\sigma = \sqrt{\sigma^2}$$

**Ejemplo:** Siguiendo el ejemplo anterior
$$\sigma = \sqrt{6} \approx 2.45$$

**Interpretación:**
- σ pequeña → datos concentrados cerca de la media
- σ grande → datos dispersos lejos de la media

**Ejemplo comparativo:**

**Conjunto A:** 5, 5, 5, 5, 5 → σ = 0 (sin dispersión)  
**Conjunto B:** 3, 4, 5, 6, 7 → σ ≈ 1.41 (poca dispersión)  
**Conjunto C:** 1, 3, 5, 7, 9 → σ ≈ 2.83 (mayor dispersión)

---

### 3.4 Coeficiente de Variación

**Definición:** Medida de dispersión relativa (porcentual).

**Fórmula:**
$$CV = \frac{\sigma}{\bar{x}} \times 100\%$$

**Utilidad:** Permite comparar dispersión entre conjuntos con diferentes unidades o escalas.

**Ejemplo:**

**Grupo A:**
- Media = 50 kg
- σ = 5 kg
- CV = (5/50) × 100% = 10%

**Grupo B:**
- Media = 150 cm
- σ = 10 cm
- CV = (10/150) × 100% = 6.67%

**Conclusión:** Aunque σ de B es mayor, el Grupo B es MENOS variable relativamente (CV menor).

---

## 4. Probabilidad

### 4.1 Conceptos Básicos

**Experimento aleatorio:** Proceso cuyo resultado no se puede predecir con certeza.

**Espacio muestral (Ω):** Conjunto de todos los resultados posibles.

**Evento:** Subconjunto del espacio muestral.

**Ejemplo:**
- Experimento: Lanzar un dado
- Espacio muestral: Ω = {1, 2, 3, 4, 5, 6}
- Evento A: "Obtener número par" = {2, 4, 6}

---

### 4.2 Regla de Laplace (Probabilidad Clásica)

**Definición:** En experimentos con resultados equiprobables:

$$P(A) = \frac{\text{Casos favorables}}{\text{Casos posibles}} = \frac{n(A)}{n(\Omega)}$$

**Propiedades:**
- $$0 \leq P(A) \leq 1$$
- $$P(\Omega) = 1$$ (evento seguro)
- $$P(\emptyset) = 0$$ (evento imposible)

**Ejemplo modelo:**

En una bolsa hay 3 bolas rojas, 5 azules y 2 verdes. Calcular:

**a) P(sacar roja)**
$$P(R) = \frac{3}{3 + 5 + 2} = \frac{3}{10} = 0.3 = 30\%$$

**b) P(sacar azul)**
$$P(A) = \frac{5}{10} = 0.5 = 50\%$$

**c) P(NO sacar verde)**
$$P(\overline{V}) = 1 - P(V) = 1 - \frac{2}{10} = \frac{8}{10} = 80\%$$

---

### 4.3 Operaciones con Eventos

**Unión de eventos (A ∪ B):** Ocurre A o B o ambos

$$P(A \cup B) = P(A) + P(B) - P(A \cap B)$$

**Intersección de eventos (A ∩ B):** Ocurren A y B simultáneamente

**Eventos mutuamente excluyentes:** No pueden ocurrir ambos a la vez

Si A y B son mutuamente excluyentes:
$$P(A \cup B) = P(A) + P(B)$$

**Ejemplo modelo:**

En un curso de 30 estudiantes:
- 18 practican fútbol (F)
- 12 practican básquetbol (B)
- 5 practican ambos deportes (F ∩ B)

**Calcular P(practicar al menos un deporte):**

$$P(F \cup B) = P(F) + P(B) - P(F \cap B)$$
$$= \frac{18}{30} + \frac{12}{30} - \frac{5}{30}$$
$$= \frac{25}{30} = \frac{5}{6} \approx 83.3\%$$

---

### 4.4 Probabilidad Condicional

**Definición:** Probabilidad de que ocurra A dado que ya ocurrió B.

**Fórmula:**
$$P(A|B) = \frac{P(A \cap B)}{P(B)}$$

**Ejemplo modelo:**

En una fábrica:
- 60% de los productos pasan control de calidad (C)
- 40% de los productos tienen defectos (D)
- 5% pasan control pero tienen defectos menores

**Calcular P(producto defectuoso | no pasó control):**

**Datos:**
- P(C) = 0.60 → P(no C) = 0.40
- P(D) = 0.40
- P(D ∩ C) = 0.05

**Razonamiento:**
De los que NO pasan control (40%), queremos saber qué porcentaje es defectuoso.

Los defectuosos son: 40%
Los que NO pasan control son: 40%

Si 5% pasan control y son defectuosos, entonces los que NO pasan control y son defectuosos son:
P(D ∩ no C) = P(D) - P(D ∩ C) = 0.40 - 0.05 = 0.35

$$P(D | \text{no C}) = \frac{P(D \cap \text{no C})}{P(\text{no C})} = \frac{0.35}{0.40} = 0.875 = 87.5\%$$

---

### 4.5 Eventos Independientes

**Definición:** A y B son independientes si la ocurrencia de uno NO afecta la probabilidad del otro.

**Condición:**
$$P(A \cap B) = P(A) \cdot P(B)$$

o equivalentemente:
$$P(A|B) = P(A)$$

**Ejemplo:**

Lanzar un dado y una moneda son eventos independientes:
- P(obtener 5 en el dado) = 1/6
- P(obtener cara en la moneda) = 1/2
- P(5 y cara) = (1/6) × (1/2) = 1/12

---

## 5. Combinatoria

### 5.1 Principio Multiplicativo

**Regla:** Si hay m formas de hacer una cosa y n formas de hacer otra, hay m × n formas de hacer ambas.

**Ejemplo:**

Un restaurante ofrece:
- 4 entradas
- 5 platos principales
- 3 postres

**Cantidad de menús diferentes:**
$$4 \times 5 \times 3 = 60 \text{ menús}$$

---

### 5.2 Permutaciones

**Definición:** Ordenaciones de n elementos.

**Fórmula:**
$$P_n = n!$$

donde $$n! = n \times (n-1) \times (n-2) \times ... \times 2 \times 1$$

**Ejemplo:**

¿De cuántas formas se pueden ordenar 5 libros en un estante?

$$P_5 = 5! = 5 \times 4 \times 3 \times 2 \times 1 = 120 \text{ formas}$$

---

### 5.3 Combinaciones

**Definición:** Selección de r elementos de n, SIN importar el orden.

**Fórmula:**
$$C(n, r) = \binom{n}{r} = \frac{n!}{r!(n-r)!}$$

**Ejemplo:**

De 10 estudiantes, ¿de cuántas formas se puede elegir un comité de 3?

$$C(10, 3) = \frac{10!}{3! \cdot 7!} = \frac{10 \times 9 \times 8}{3 \times 2 \times 1} = \frac{720}{6} = 120$$

**Diferencia clave:**
- **Permutación:** El orden importa (ABC ≠ BAC)
- **Combinación:** El orden NO importa (ABC = BAC)

---

## 6. Errores Conceptuales Comunes

### ❌ ERROR 1: Confundir media con mediana

**Incorrecto:** "La media siempre está en el centro"
**Correcto:** La **mediana** es el valor central; la media puede estar alejada por valores extremos
*Ejemplo: {1, 2, 3, 100} → Media = 26.5, Mediana = 2.5*

### ❌ ERROR 2: Sumar probabilidades sin considerar intersección

**Incorrecto:** P(A o B) = P(A) + P(B) siempre
**Correcto:** P(A ∪ B) = P(A) + P(B) - P(A ∩ B)
*Solo si son mutuamente excluyentes: P(A ∪ B) = P(A) + P(B)*

### ❌ ERROR 3: Confundir permutación con combinación

**Incorrecto:** Elegir 3 de 5 personas para un comité = 5!/(5-3)! = 60
**Correcto:** Es combinación (orden no importa) = C(5,3) = 10
*Permutación se usa cuando el orden importa (presidente, secretario, tesorero)*

### ❌ ERROR 4: Confundir frecuencia con probabilidad

**Incorrecto:** "Salió 3 veces cara en 10 lanzamientos, entonces P(cara) = 3"
**Correcto:** Frecuencia relativa = 3/10 = 0.3 (aproxima la probabilidad con más datos)
*La probabilidad teórica de cara es 0.5, no 3*

### ❌ ERROR 5: Calcular mal la varianza

**Incorrecto:** σ² = Σ(xi - x̄)² (olvidar dividir por n)
**Correcto:** σ² = Σ(xi - x̄)² / n
*No olvidar el paso final de promediar las desviaciones cuadradas*

---

## 7. Conexiones con Otros Dominios

**Con Álgebra:**
- Fórmulas estadísticas usan operaciones algebraicas
- Varianza y desviación involucran potencias y raíces

**Con Funciones:**
- Gráficos estadísticos son representaciones funcionales
- Probabilidad condicional similar a función compuesta

**Con Geometría:**
- Gráficos circulares usan ángulos y sectores
- Dispersión de datos se visualiza geométricamente

---

## ✅ Autoevaluación

**Deberías poder:**

- [ ] Construir tabla de frecuencias completa (f, fr, %, F)
- [ ] Interpretar los 4 tipos de gráficos estadísticos
- [ ] Calcular media, mediana y moda
- [ ] Elegir la medida de tendencia central apropiada
- [ ] Calcular rango, varianza y desviación estándar
- [ ] Interpretar el significado de la desviación estándar
- [ ] Aplicar regla de Laplace para calcular probabilidades
- [ ] Calcular probabilidad de unión e intersección de eventos
- [ ] Calcular probabilidad condicional
- [ ] Distinguir y aplicar permutaciones y combinaciones

**Indicador de dominio:**

- ✅ **8-10 marcados:** Excelente dominio, listo para análisis complejos
- ⚠️ **5-7 marcados:** Buen nivel, repasar cálculos débiles
- ❌ **0-4 marcados:** Repasar teoría y practicar más ejercicios

---

**Anterior:** [Dossier Parte 2 - Geometría](./02-geometria.md)  
**Siguiente:** [Dossier Parte 4 - Funciones](./04-funciones.md)
