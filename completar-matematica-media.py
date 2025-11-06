"""
COMPLETAR: Preguntas faltantes Matemática Media ECEP 2025
Genera preguntas de alta calidad para alcanzar 100% de cobertura temática
"""

import json

def cargar_plan():
    """Carga plan.json actual"""
    with open('evaluaciones/educacion-media/pruebas/67-cm-m/plan.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def guardar_plan(plan):
    """Guarda plan actualizado"""
    with open('evaluaciones/educacion-media/pruebas/67-cm-m/plan.json', 'w', encoding='utf-8') as f:
        json.dump(plan, f, indent=2, ensure_ascii=False)

# NUEVAS PREGUNTAS PARA COMPLETAR TEMARIO
nuevas_preguntas = [
    # DOMINIO 1: NÚMEROS COMPLEJOS - Conjugado y Módulo
    {
        "id": "67-M-51",
        "numero": 51,
        "dominio": "Números",
        "habilidad": "Aplicar concepto de conjugado y módulo de números complejos",
        "enunciado": "Dado el número complejo z = 3 + 4i, ¿cuál es el valor de |z| · |z̄| donde z̄ es el conjugado de z?",
        "alternativas": [
            {"letra": "A", "texto": "7"},
            {"letra": "B", "texto": "25"},
            {"letra": "C", "texto": "49"},
            {"letra": "D", "texto": "625"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "El conjugado de z = 3 + 4i es z̄ = 3 - 4i. El módulo es |z| = √(3² + 4²) = √25 = 5. Como |z| = |z̄|, entonces |z| · |z̄| = 5 · 5 = 25. Propiedad: |z|² = z · z̄ = (3+4i)(3-4i) = 9 - 16i² = 9 + 16 = 25.",
        "temas_relacionados": ["Números complejos", "Conjugado", "Módulo", "Propiedades"]
    },
    
    # DOMINIO 2: ÁLGEBRA - Asíntotas
    {
        "id": "67-M-52",
        "numero": 52,
        "dominio": "Álgebra",
        "habilidad": "Identificar y determinar asíntotas verticales y horizontales",
        "enunciado": "¿Cuáles son las asíntotas de la función f(x) = (2x + 1)/(x - 3)?",
        "alternativas": [
            {"letra": "A", "texto": "Vertical: x = 3; Horizontal: y = 2"},
            {"letra": "B", "texto": "Vertical: x = -1/2; Horizontal: y = 3"},
            {"letra": "C", "texto": "Vertical: x = 3; Horizontal: y = 1/2"},
            {"letra": "D", "texto": "Vertical: x = -3; Horizontal: y = -2"}
        ],
        "respuesta_correcta": "A",
        "explicacion": "Asíntota vertical: denominador = 0 → x - 3 = 0 → x = 3. Asíntota horizontal: lim(x→∞) (2x+1)/(x-3) = lim(x→∞) 2x/x = 2 (grado numerador = grado denominador, entonces y = 2/1 = 2).",
        "temas_relacionados": ["Funciones racionales", "Asíntotas", "Límites"]
    },
    
    # DOMINIO 2: Función Inversa
    {
        "id": "67-M-53",
        "numero": 53,
        "dominio": "Álgebra",
        "habilidad": "Determinar función inversa",
        "enunciado": "Si f(x) = (x - 2)/3, ¿cuál es f⁻¹(x)?",
        "alternativas": [
            {"letra": "A", "texto": "f⁻¹(x) = 3x + 2"},
            {"letra": "B", "texto": "f⁻¹(x) = 3x - 2"},
            {"letra": "C", "texto": "f⁻¹(x) = (x + 2)/3"},
            {"letra": "D", "texto": "f⁻¹(x) = 3/(x - 2)"}
        ],
        "respuesta_correcta": "A",
        "explicacion": "Para hallar f⁻¹: 1) y = (x-2)/3, 2) Despejar x: 3y = x - 2 → x = 3y + 2, 3) Intercambiar: f⁻¹(x) = 3x + 2. Verificación: f(f⁻¹(x)) = f(3x+2) = ((3x+2)-2)/3 = 3x/3 = x ✓.",
        "temas_relacionados": ["Función inversa", "Función afín", "Composición"]
    },
    
    # DOMINIO 2: Discriminante
    {
        "id": "67-M-54",
        "numero": 54,
        "dominio": "Álgebra",
        "habilidad": "Relacionar raíces con discriminante",
        "enunciado": "¿Para qué valor de k la ecuación x² - 6x + k = 0 tiene una sola solución real?",
        "alternativas": [
            {"letra": "A", "texto": "k = 3"},
            {"letra": "B", "texto": "k = 6"},
            {"letra": "C", "texto": "k = 9"},
            {"letra": "D", "texto": "k = 12"}
        ],
        "respuesta_correcta": "C",
        "explicacion": "Para una sola solución (raíz doble), el discriminante debe ser cero: Δ = b² - 4ac = 0. Aquí: (-6)² - 4(1)(k) = 0 → 36 - 4k = 0 → 4k = 36 → k = 9. Entonces x² - 6x + 9 = (x - 3)² = 0 tiene solución doble x = 3.",
        "temas_relacionados": ["Discriminante", "Ecuación cuadrática", "Raíces"]
    },
    
    # DOMINIO 2: Inecuaciones con valor absoluto
    {
        "id": "67-M-55",
        "numero": 55,
        "dominio": "Álgebra",
        "habilidad": "Resolver inecuaciones con valor absoluto",
        "enunciado": "¿Cuál es el conjunto solución de |x - 2| < 3?",
        "alternativas": [
            {"letra": "A", "texto": "x ∈ (-1, 5)"},
            {"letra": "B", "texto": "x ∈ (-5, 1)"},
            {"letra": "C", "texto": "x ∈ (-∞, -1) ∪ (5, ∞)"},
            {"letra": "D", "texto": "x ∈ [-1, 5]"}
        ],
        "respuesta_correcta": "A",
        "explicacion": "|x - 2| < 3 equivale a -3 < x - 2 < 3. Sumando 2: -3 + 2 < x < 3 + 2 → -1 < x < 5. Conjunto solución: x ∈ (-1, 5). Interpretación geométrica: números cuya distancia a 2 es menor que 3.",
        "temas_relacionados": ["Valor absoluto", "Inecuaciones", "Intervalos"]
    },
    
    # DOMINIO 2: Ecuación exponencial/logarítmica
    {
        "id": "67-M-56",
        "numero": 56,
        "dominio": "Álgebra",
        "habilidad": "Resolver problemas con funciones exponencial y logarítmica",
        "enunciado": "Si log₂(x) + log₂(x + 6) = 4, ¿cuál es el valor de x?",
        "alternativas": [
            {"letra": "A", "texto": "x = 2"},
            {"letra": "B", "texto": "x = 4"},
            {"letra": "C", "texto": "x = 8"},
            {"letra": "D", "texto": "x = 10"}
        ],
        "respuesta_correcta": "A",
        "explicacion": "Usando log(a) + log(b) = log(ab): log₂(x(x+6)) = 4 → x(x+6) = 2⁴ = 16 → x² + 6x - 16 = 0. Factorizando: (x+8)(x-2) = 0 → x = -8 o x = 2. Como x debe ser positivo (dominio del logaritmo), x = 2. Verificación: log₂(2) + log₂(8) = 1 + 3 = 4 ✓.",
        "temas_relacionados": ["Logaritmos", "Propiedades logarítmicas", "Ecuaciones"]
    },
    
    # DOMINIO 3: GEOMETRÍA - Ángulos en circunferencia
    {
        "id": "67-M-57",
        "numero": 57,
        "dominio": "Geometría",
        "habilidad": "Relacionar propiedades de ángulos en circunferencia",
        "enunciado": "En una circunferencia, un ángulo inscrito mide 40°. ¿Cuánto mide el ángulo del centro que subtiende el mismo arco?",
        "alternativas": [
            {"letra": "A", "texto": "20°"},
            {"letra": "B", "texto": "40°"},
            {"letra": "C", "texto": "80°"},
            {"letra": "D", "texto": "160°"}
        ],
        "respuesta_correcta": "C",
        "explicacion": "Teorema del ángulo inscrito: el ángulo del centro mide el doble que el ángulo inscrito que subtiende el mismo arco. Entonces: ángulo central = 2 × 40° = 80°. Este es un teorema fundamental de geometría circular.",
        "temas_relacionados": ["Ángulos en circunferencia", "Ángulo inscrito", "Ángulo central"]
    },
    
    # DOMINIO 3: Razones trigonométricas
    {
        "id": "67-M-58",
        "numero": 58,
        "dominio": "Geometría",
        "habilidad": "Resolver problemas con razones trigonométricas",
        "enunciado": "Desde un punto en el suelo a 20 m de un edificio, se observa su cima con un ángulo de elevación de 60°. ¿Cuál es la altura del edificio?",
        "alternativas": [
            {"letra": "A", "texto": "10 m"},
            {"letra": "B", "texto": "20 m"},
            {"letra": "C", "texto": "20√3 m"},
            {"letra": "D", "texto": "40 m"}
        ],
        "respuesta_correcta": "C",
        "explicacion": "Usando tangente: tan(60°) = altura/20. Como tan(60°) = √3, entonces: √3 = h/20 → h = 20√3 m ≈ 34.64 m. La razón trigonométrica relaciona el ángulo con los catetos del triángulo rectángulo formado.",
        "temas_relacionados": ["Razones trigonométricas", "Tangente", "Aplicaciones", "Ángulos de elevación"]
    },
    
    # DOMINIO 3: Teorema de Euclides
    {
        "id": "67-M-59",
        "numero": 59,
        "dominio": "Geometría",
        "habilidad": "Aplicar teorema de Euclides sobre trazos proporcionales",
        "enunciado": "En un triángulo rectángulo, la altura h relativa a la hipotenusa la divide en segmentos de 4 cm y 9 cm. ¿Cuánto mide h?",
        "alternativas": [
            {"letra": "A", "texto": "5 cm"},
            {"letra": "B", "texto": "6 cm"},
            {"letra": "C", "texto": "6.5 cm"},
            {"letra": "D", "texto": "13 cm"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "Teorema de Euclides: h² = p · q, donde p y q son las proyecciones. Entonces: h² = 4 · 9 = 36 → h = 6 cm. Este teorema relaciona la altura con las proyecciones de los catetos sobre la hipotenusa.",
        "temas_relacionados": ["Teorema de Euclides", "Triángulo rectángulo", "Proporcionalidad"]
    },
    
    # DOMINIO 3: Volúmenes por rotación
    {
        "id": "67-M-60",
        "numero": 60,
        "dominio": "Geometría",
        "habilidad": "Calcular volúmenes de cuerpos por rotación",
        "enunciado": "Al rotar un rectángulo de base 3 cm y altura 4 cm alrededor de su base, se genera un cilindro. ¿Cuál es su volumen?",
        "alternativas": [
            {"letra": "A", "texto": "12π cm³"},
            {"letra": "B", "texto": "36π cm³"},
            {"letra": "C", "texto": "48π cm³"},
            {"letra": "D", "texto": "144π cm³"}
        ],
        "respuesta_correcta": "C",
        "explicacion": "Al rotar el rectángulo alrededor de la base (3 cm), la altura (4 cm) se convierte en el radio. Volumen del cilindro: V = πr²h = π(4)²(3) = π·16·3 = 48π cm³. La rotación genera un cilindro con radio 4 y altura 3.",
        "temas_relacionados": ["Volúmenes", "Rotación", "Cilindro", "Sólidos de revolución"]
    },
    
    # DOMINIO 3: Sectores circulares
    {
        "id": "67-M-61",
        "numero": 61,
        "dominio": "Geometría",
        "habilidad": "Determinar área de sectores circulares",
        "enunciado": "Un sector circular de radio 6 cm tiene un ángulo central de 60°. ¿Cuál es su área?",
        "alternativas": [
            {"letra": "A", "texto": "3π cm²"},
            {"letra": "B", "texto": "6π cm²"},
            {"letra": "C", "texto": "9π cm²"},
            {"letra": "D", "texto": "12π cm²"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "Área del sector = (θ/360°) · πr². Con θ = 60° y r = 6: A = (60/360) · π(6)² = (1/6) · 36π = 6π cm². El sector es 1/6 del círculo completo.",
        "temas_relacionados": ["Sector circular", "Ángulo central", "Área", "Proporcionalidad"]
    },
    
    # DOMINIO 3: Vectores
    {
        "id": "67-M-62",
        "numero": 62,
        "dominio": "Geometría",
        "habilidad": "Representar homotecias vectorialmente",
        "enunciado": "Si el vector v⃗ = (2, 3) se multiplica por el escalar k = -2, ¿cuál es el resultado?",
        "alternativas": [
            {"letra": "A", "texto": "(-4, -6)"},
            {"letra": "B", "texto": "(4, 6)"},
            {"letra": "C", "texto": "(-2, -3)"},
            {"letra": "D", "texto": "(0, 1)"}
        ],
        "respuesta_correcta": "A",
        "explicacion": "Producto de vector por escalar: k·v⃗ = k(x, y) = (kx, ky). Entonces: -2·(2, 3) = (-2·2, -2·3) = (-4, -6). El signo negativo invierte la dirección, y |k|=2 duplica la magnitud.",
        "temas_relacionados": ["Vectores", "Producto por escalar", "Homotecia", "Transformaciones"]
    },
    
    # DOMINIO 4: ESTADÍSTICA - Medidas de dispersión
    {
        "id": "67-M-63",
        "numero": 63,
        "dominio": "Datos y Azar",
        "habilidad": "Comparar muestras usando desviación estándar",
        "enunciado": "Dos grupos tienen la misma media (50). Grupo A tiene desviación estándar 5; Grupo B tiene 15. ¿Qué afirmación es correcta?",
        "alternativas": [
            {"letra": "A", "texto": "Grupo A tiene datos más dispersos"},
            {"letra": "B", "texto": "Grupo B tiene datos más homogéneos"},
            {"letra": "C", "texto": "Grupo A tiene datos menos variables"},
            {"letra": "D", "texto": "Ambos tienen la misma variabilidad"}
        ],
        "respuesta_correcta": "C",
        "explicacion": "La desviación estándar mide dispersión: menor valor indica datos más concentrados alrededor de la media. Grupo A (σ=5) tiene datos menos variables y más homogéneos que Grupo B (σ=15), cuyos datos están más dispersos.",
        "temas_relacionados": ["Desviación estándar", "Dispersión", "Variabilidad", "Comparación de datos"]
    },
    
    # DOMINIO 4: Cuartiles
    {
        "id": "67-M-64",
        "numero": 64,
        "dominio": "Datos y Azar",
        "habilidad": "Interpretar cuartiles",
        "enunciado": "En un conjunto de notas, el tercer cuartil (Q₃) es 5.8. ¿Qué significa esto?",
        "alternativas": [
            {"letra": "A", "texto": "75% de las notas son menores o iguales a 5.8"},
            {"letra": "B", "texto": "25% de las notas son menores o iguales a 5.8"},
            {"letra": "C", "texto": "La nota promedio es 5.8"},
            {"letra": "D", "texto": "La nota más frecuente es 5.8"}
        ],
        "respuesta_correcta": "A",
        "explicacion": "El tercer cuartil Q₃ (percentil 75) indica que el 75% de los datos son menores o iguales a ese valor, y el 25% son mayores. Es una medida de posición que divide los datos ordenados en cuatro partes iguales.",
        "temas_relacionados": ["Cuartiles", "Medidas de posición", "Percentiles", "Estadística descriptiva"]
    },
    
    # DOMINIO 4: Variables aleatorias
    {
        "id": "67-M-65",
        "numero": 65,
        "dominio": "Datos y Azar",
        "habilidad": "Interpretar variables aleatorias",
        "enunciado": "Se lanza un dado justo. Si X = 'número obtenido', ¿cuál es E(X), el valor esperado?",
        "alternativas": [
            {"letra": "A", "texto": "2.5"},
            {"letra": "B", "texto": "3"},
            {"letra": "C", "texto": "3.5"},
            {"letra": "D", "texto": "4"}
        ],
        "respuesta_correcta": "C",
        "explicacion": "E(X) = Σ(x · P(X=x)) = 1·(1/6) + 2·(1/6) + 3·(1/6) + 4·(1/6) + 5·(1/6) + 6·(1/6) = (1+2+3+4+5+6)/6 = 21/6 = 3.5. El valor esperado representa el promedio a largo plazo.",
        "temas_relacionados": ["Variables aleatorias", "Valor esperado", "Probabilidad", "Distribución discreta"]
    },
    
    # DOMINIO 4: Probabilidad condicionada
    {
        "id": "67-M-66",
        "numero": 66,
        "dominio": "Datos y Azar",
        "habilidad": "Calcular probabilidad condicionada",
        "enunciado": "En un curso, 60% son mujeres y 40% hombres. El 70% de las mujeres y 50% de los hombres aprobaron. Si se elige un estudiante aprobado al azar, ¿cuál es la probabilidad de que sea mujer?",
        "alternativas": [
            {"letra": "A", "texto": "42/62"},
            {"letra": "B", "texto": "50/100"},
            {"letra": "C", "texto": "60/100"},
            {"letra": "D", "texto": "70/100"}
        ],
        "respuesta_correcta": "A",
        "explicacion": "P(Mujer|Aprobado) = P(Mujer ∩ Aprobado) / P(Aprobado). P(Mujer ∩ Aprobado) = 0.6 × 0.7 = 0.42. P(Aprobado) = 0.6×0.7 + 0.4×0.5 = 0.42 + 0.20 = 0.62. Entonces P(Mujer|Aprobado) = 0.42/0.62 = 42/62 ≈ 67.7%.",
        "temas_relacionados": ["Probabilidad condicionada", "Teorema de Bayes", "Probabilidad total"]
    },
    
    # DOMINIO 4: Distribución binomial
    {
        "id": "67-M-67",
        "numero": 67,
        "dominio": "Datos y Azar",
        "habilidad": "Identificar distribución binomial",
        "enunciado": "¿Cuál situación NO se puede modelar con distribución binomial?",
        "alternativas": [
            {"letra": "A", "texto": "Lanzar una moneda 10 veces y contar caras"},
            {"letra": "B", "texto": "Extraer 5 cartas sin reemplazo y contar ases"},
            {"letra": "C", "texto": "Lanzar un dado 20 veces y contar seises"},
            {"letra": "D", "texto": "Responder 15 preguntas de V/F al azar"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La distribución binomial requiere: ensayos independientes, probabilidad constante y dos resultados. En B), sin reemplazo, la probabilidad cambia en cada extracción (no es constante), por lo que NO es binomial. Las demás cumplen todos los requisitos.",
        "temas_relacionados": ["Distribución binomial", "Independencia", "Probabilidad constante"]
    },
    
    # DOMINIO 4: Distribución normal
    {
        "id": "67-M-68",
        "numero": 68,
        "dominio": "Datos y Azar",
        "habilidad": "Aplicar distribución normal",
        "enunciado": "Si X~N(100, 15), ¿aproximadamente qué porcentaje de datos está entre 85 y 115?",
        "alternativas": [
            {"letra": "A", "texto": "50%"},
            {"letra": "B", "texto": "68%"},
            {"letra": "C", "texto": "95%"},
            {"letra": "D", "texto": "99.7%"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "X~N(μ=100, σ=15). El intervalo [85, 115] = [μ-σ, μ+σ]. Por la regla empírica 68-95-99.7, aproximadamente 68% de los datos está dentro de 1 desviación estándar de la media.",
        "temas_relacionados": ["Distribución normal", "Regla empírica", "Desviación estándar"]
    },
    
    # DOMINIO 5: DIDÁCTICA - Estrategias metodológicas
    {
        "id": "67-M-69",
        "numero": 69,
        "dominio": "Enseñanza-Aprendizaje",
        "habilidad": "Determinar estrategias metodológicas apropiadas",
        "enunciado": "Para enseñar el concepto de función cuadrática, ¿cuál estrategia es más efectiva según principios didácticos?",
        "alternativas": [
            {"letra": "A", "texto": "Memorizar la fórmula general y aplicarla mecánicamente"},
            {"letra": "B", "texto": "Partir de situaciones contextualizadas (tiro parabólico, área de rectángulos)"},
            {"letra": "C", "texto": "Dictar definiciones y propiedades del libro de texto"},
            {"letra": "D", "texto": "Resolver 50 ejercicios repetitivos sin variación"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La didáctica moderna privilegia el aprendizaje significativo: partir de contextos reales permite que los estudiantes construyan el concepto de parábola desde problemas auténticos (optimización, movimiento), conectando matemática con la realidad y favoreciendo la comprensión profunda.",
        "temas_relacionados": ["Didáctica", "Aprendizaje significativo", "Contextualización", "Funciones"]
    },
    
    # DOMINIO 5: Representaciones múltiples
    {
        "id": "67-M-70",
        "numero": 70,
        "dominio": "Enseñanza-Aprendizaje",
        "habilidad": "Usar representaciones múltiples",
        "enunciado": "Un estudiante no comprende fracciones. ¿Qué representación ayudaría mejor inicialmente?",
        "alternativas": [
            {"letra": "A", "texto": "Sólo notación simbólica algebraica"},
            {"letra": "B", "texto": "Modelos concretos (pizzas divididas, barras fraccionarias)"},
            {"letra": "C", "texto": "Definiciones formales con axiomas de cuerpos"},
            {"letra": "D", "texto": "Ejercicios abstractos sin contexto visual"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "Según Bruner y el principio de representaciones múltiples, el aprendizaje progresa de concreto (manipulativos) → pictórico (dibujos) → abstracto (símbolos). Los modelos concretos construyen intuición visual antes de la formalización algebraica.",
        "temas_relacionados": ["Representaciones", "Didáctica", "Fracciones", "Aprendizaje progresivo"]
    },
    
    # DOMINIO 5: Recursos didácticos
    {
        "id": "67-M-71",
        "numero": 71,
        "dominio": "Enseñanza-Aprendizaje",
        "habilidad": "Seleccionar recursos didácticos apropiados",
        "enunciado": "Para explorar transformaciones isométricas, ¿qué recurso digital es más apropiado?",
        "alternativas": [
            {"letra": "A", "texto": "Hoja de cálculo Excel para sumar números"},
            {"letra": "B", "texto": "GeoGebra para manipular figuras dinámicamente"},
            {"letra": "C", "texto": "Procesador de texto Word para escribir definiciones"},
            {"letra": "D", "texto": "PowerPoint con diapositivas estáticas"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "GeoGebra es software especializado en geometría dinámica: permite manipular, rotar, reflejar y trasladar figuras interactivamente, visualizando en tiempo real propiedades invariantes (longitudes, ángulos). Es ideal para exploración de transformaciones isométricas.",
        "temas_relacionados": ["Recursos digitales", "GeoGebra", "Geometría", "Transformaciones"]
    },
    
    # DOMINIO 5: Análisis de errores
    {
        "id": "67-M-72",
        "numero": 72,
        "dominio": "Enseñanza-Aprendizaje",
        "habilidad": "Inferir dificultades en el aprendizaje",
        "enunciado": "Un estudiante afirma que √(a + b) = √a + √b. ¿Cuál es la dificultad conceptual subyacente?",
        "alternativas": [
            {"letra": "A", "texto": "Error de cálculo aritmético puntual"},
            {"letra": "B", "texto": "Generalización indebida de la propiedad distributiva"},
            {"letra": "C", "texto": "Falta de conocimiento de la tabla de multiplicar"},
            {"letra": "D", "texto": "Confusión entre suma y multiplicación"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "El error conceptual es aplicar distribución donde no corresponde. El estudiante sobregeneraliza (a+b)² = a² + b² incorrectamente (falta 2ab) o √(a·b) = √a · √b (sí válido) a √(a+b) ≠ √a + √b. Contraejemplo: √(9+16) = √25 = 5 ≠ √9 + √16 = 3 + 4 = 7.",
        "temas_relacionados": ["Errores conceptuales", "Propiedad distributiva", "Raíces", "Diagnóstico"]
    },
    
    # DOMINIO 5: Evaluación formativa
    {
        "id": "67-M-73",
        "numero": 73,
        "dominio": "Enseñanza-Aprendizaje",
        "habilidad": "Retroalimentar formativamente",
        "enunciado": "Un estudiante resolvió incorrectamente 3/4 + 2/3. ¿Cuál retroalimentación es más formativa?",
        "alternativas": [
            {"letra": "A", "texto": "'Está mal. La respuesta correcta es 17/12'"},
            {"letra": "B", "texto": "'Revisa el MCM de los denominadores y recalcula'"},
            {"letra": "C", "texto": "'Nota: 2.0. Estudia más para la próxima prueba'"},
            {"letra": "D", "texto": "'Ignora el error y avanza al siguiente ejercicio'"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La retroalimentación formativa orienta hacia la estrategia correcta (hallar MCM) sin dar directamente la respuesta, promoviendo que el estudiante identifique su error y autocorrija. Wiliam: feedback efectivo cierra la brecha entre desempeño actual y esperado.",
        "temas_relacionados": ["Retroalimentación", "Evaluación formativa", "Fracciones", "Aprendizaje"]
    }
]

def main():
    """Actualizar plan.json con nuevas preguntas"""
    
    print("="*70)
    print("📝 COMPLETANDO TEMARIO MATEMÁTICA MEDIA ECEP 2025")
    print("="*70)
    
    plan = cargar_plan()
    
    preguntas_actuales = plan['exam']['preguntas']
    total_actual = len(preguntas_actuales)
    
    print(f"\n📊 Estado actual:")
    print(f"   - Preguntas existentes: {total_actual}")
    print(f"   - Preguntas nuevas a agregar: {len(nuevas_preguntas)}")
    print(f"   - Total final: {total_actual + len(nuevas_preguntas)}")
    
    # Agregar nuevas preguntas
    plan['exam']['preguntas'].extend(nuevas_preguntas)
    
    # Actualizar metadata
    plan['metadata']['total_preguntas'] = total_actual + len(nuevas_preguntas)
    plan['metadata']['version'] = 2
    plan['metadata']['ultima_actualizacion'] = "2025-11-06"
    plan['metadata']['distribucion']['dominio_numeros'] = 8
    plan['metadata']['distribucion']['dominio_algebra'] = 15
    plan['metadata']['distribucion']['dominio_geometria'] = 13
    plan['metadata']['distribucion']['dominio_datos_azar'] = 15
    plan['metadata']['distribucion']['dominio_didactica'] = 5
    plan['metadata']['notas'] += " | ACTUALIZADO: Cobertura completa 100% temario ECEP 2025 con 23 preguntas nuevas cubriendo números complejos, asíntotas, función inversa, discriminante, inecuaciones complejas, ángulos en circunferencia, trigonometría, Euclides, volúmenes, vectores, estadística avanzada, probabilidad condicionada, binomial/normal, y didáctica."
    
    # Agregar prompts IA especializados
    plan['metadata']['prompts_ia']['numeros_complejos'] = "Explica números complejos usando plano de Argand, forma binómica y polar. Destaca propiedades de conjugado (z·z̄ = |z|²) y módulo. Relaciona con aplicaciones en ingeniería eléctrica (corriente alterna) y física cuántica."
    plan['metadata']['prompts_ia']['trigonometria'] = "Enfatiza interpretación geométrica del triángulo rectángulo y círculo unitario. Conecta razones trigonométricas con aplicaciones prácticas: navegación, topografía, arquitectura. Verifica que los ángulos estén en el cuadrante correcto."
    plan['metadata']['prompts_ia']['probabilidad_avanzada'] = "Usa diagramas de árbol para probabilidad condicionada. Explica diferencias entre distribuciones binomial (discreta, n ensayos) y normal (continua, simétrica). Verifica independencia y probabilidad constante."
    plan['metadata']['prompts_ia']['didactica'] = "Fundamenta en teorías de aprendizaje (Piaget, Vygotsky, Bruner). Privilegia aprendizaje significativo, representaciones múltiples (concreto-pictórico-abstracto), retroalimentación formativa y diagnóstico de errores conceptuales. Conecta con Bases Curriculares."
    
    # Guardar
    guardar_plan(plan)
    
    print(f"\n✅ Plan actualizado exitosamente!")
    print(f"   - Nuevas preguntas agregadas: {len(nuevas_preguntas)}")
    print(f"   - Total preguntas: {plan['metadata']['total_preguntas']}")
    print(f"   - Versión: {plan['metadata']['version']}")
    print(f"\n📋 Distribución por dominio:")
    for dominio, cantidad in plan['metadata']['distribucion'].items():
        if 'dominio_' in dominio:
            print(f"   - {dominio.replace('dominio_', '').replace('_', ' ').title()}: {cantidad}")
    
    print(f"\n🎯 Prompts IA: {len(plan['metadata']['prompts_ia'])} temas")
    print("\n💾 Archivo guardado: evaluaciones/educacion-media/pruebas/67-cm-m/plan.json")
    print("="*70)

if __name__ == "__main__":
    main()
