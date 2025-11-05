# 📐 Proyecto: Prueba de Matemática para Educación Media

## 🎯 Objetivo

Crear una evaluación completa de Matemática para Educación Media basada en el temario ECEP, con dossier de contenidos, casos de estudio, integración de IA, gráficos y fórmulas matemáticas.

---

## 📋 Plan de Trabajo (25 Tareas)

### **FASE 1: Investigación y Análisis (Tareas 1-4)**

#### ✅ Tarea 1: Revisar Planes y Programas de Matemática Media
- **Objetivo:** Obtener estructura curricular oficial MINEDUC
- **Entregable:** Documento con OAs, ejes temáticos, habilidades
- **Archivos:** Buscar en `/recursos/` o descargar de curriculumnacional.cl

#### ✅ Tarea 2: Analizar temario prueba ECEP Matemática
- **Objetivo:** Identificar qué evalúa la prueba oficial
- **Entregable:** Lista de dominios, temas y distribución
- **Referencia:** Documentos ECEP Matemática Media

#### ✅ Tarea 3: Revisar estilo de Básica Generalista
- **Objetivo:** Entender estructura pedagógica exitosa
- **Archivos a revisar:**
  - `evaluaciones/educacion-basica/pruebas/basica-generalista/index.njk`
  - `prueba-basica-generalista-datos.json`
  - Scripts de generación: `generar-basica-generalista-*.py`

#### ✅ Tarea 4: Revisar estilo de Matemática Básica
- **Objetivo:** Entender explicaciones matemáticas, fórmulas, gráficos
- **Archivos a revisar:**
  - Pruebas de matemática básica existentes
  - `casos-estudio-matematica-*.json`
  - Scripts: `casos-estudio-matematica-v2.py`

---

### **FASE 2: Dossier de Contenidos (Tareas 5-9)**

#### ✅ Tarea 5: Dossier Parte 1 - Números y Álgebra
**Contenidos a incluir:**
- Números reales y complejos
- Potencias y raíces
- Ecuaciones y sistemas
- Inecuaciones
- Expresiones algebraicas
- Factorización

**Formato:**
```markdown
## Números y Álgebra

### 1.1 Números Reales
**Definición:** ...
**Propiedades:** ...
**Ejemplos:** ...
**Fórmulas clave:** [con MathJax]

### 1.2 Potencias
**Leyes de exponentes:**
$$a^m \cdot a^n = a^{m+n}$$
[Gráfico explicativo]
[Ejercicio modelo paso a paso]
```

#### ✅ Tarea 6: Dossier Parte 2 - Geometría
**Contenidos a incluir:**
- Congruencia y semejanza
- Teorema de Pitágoras y Thales
- Perímetros, áreas y volúmenes
- Geometría analítica
- Coordenadas cartesianas
- Transformaciones isométricas

#### ✅ Tarea 7: Dossier Parte 3 - Probabilidad y Estadística
**Contenidos a incluir:**
- Medidas de tendencia central
- Medidas de dispersión
- Gráficos estadísticos
- Probabilidad clásica
- Probabilidad condicional
- Permutaciones y combinaciones

#### ✅ Tarea 8: Dossier Parte 4 - Funciones
**Contenidos a incluir:**
- Función lineal y afín
- Función cuadrática
- Función exponencial
- Función logarítmica
- Dominio y recorrido
- Transformaciones de funciones

#### ✅ Tarea 9: Revisar y consolidar dossier completo
**Verificar:**
- ✅ TODO el temario ECEP está cubierto
- ✅ Progresión pedagógica lógica
- ✅ Gráficos claros y precisos
- ✅ Fórmulas correctas y bien formateadas
- ✅ Ejemplos paso a paso
- ✅ Conexiones entre temas
- ✅ No hay límite de caracteres excedido (dividir si es necesario)

---

### **FASE 3: Casos de Estudio (Tareas 10-12)**

#### ✅ Tarea 10: Casos de Estudio - Parte 1
**Basarse en:**
- `casos-estudio-lenguaje-ejemplo.json`
- `casos-estudio-matematica-v2.py`

**Estructura de cada caso:**
```json
{
  "id": "caso_mat_media_01",
  "titulo": "Modelamiento con Funciones Cuadráticas",
  "contexto": "Una empresa quiere optimizar...",
  "problema": "...",
  "desarrollo": {
    "paso1": "Identificar variables...",
    "paso2": "Plantear ecuación...",
    "paso3": "Resolver...",
    "grafico": "[SVG o imagen]",
    "formula": "$$f(x) = ax^2 + bx + c$$"
  },
  "ia_sugerida": {
    "prompt": "Pide a ChatGPT que...",
    "ejemplo_respuesta": "..."
  }
}
```

**Ejemplos de casos:**
1. Optimización con funciones cuadrática
2. Análisis de datos estadísticos reales
3. Modelamiento geométrico de problema real
4. Probabilidad en contexto de salud
5. Análisis de función exponencial (crecimiento poblacional)

#### ✅ Tarea 11: Casos de Estudio - Parte 2
**Más casos para cubrir:**
- Todos los dominios del dossier
- Diferentes niveles de complejidad
- Contextos variados (ciencia, economía, vida cotidiana)
- Conexiones interdisciplinarias

#### ✅ Tarea 12: Integrar IA en casos de estudio
**Componentes de IA:**

```javascript
// Botón de sugerencia IA
<button class="ia-button">
  💡 Sugerencia con IA
</button>

// Modal con prompts
{
  "prompts_pedagogicos": [
    "Pide a ChatGPT que te explique el concepto de...",
    "Solicita a ChatGPT que genere 3 ejercicios similares sobre...",
    "Usa IA para verificar tu procedimiento paso a paso..."
  ],
  "analisis_ia": "Cómo usar IA para analizar este tipo de problemas",
  "verificacion": "Prompts para que IA revise tu trabajo"
}
```

---

### **FASE 4: Generación de Preguntas (Tareas 13-16)**

#### ✅ Tarea 13: Preguntas Dominio 1 - Números y Álgebra
**Estructura por pregunta:**
```json
{
  "id": 1,
  "dominio": "Números y Álgebra",
  "pregunta": "Resuelve la ecuación: $$2x^2 - 5x + 2 = 0$$",
  "alternativas": [
    {
      "letra": "A",
      "texto": "x = 2 o x = 1/2",
      "explicacion": "✅ CORRECTO. Usando la fórmula cuadrática...",
      "desarrollo": "Paso 1: Identificar a=2, b=-5, c=2\nPaso 2: Aplicar fórmula...",
      "es_correcta": true
    },
    {
      "letra": "B",
      "texto": "x = -2 o x = -1/2",
      "explicacion": "❌ Hay un error de signo. Revisa el discriminante...",
      "desarrollo": "Tu error: olvidaste que b = -5, entonces -b = 5...",
      "es_correcta": false
    }
  ],
  "grafico": "path/to/grafico.svg",
  "dificultad": "media",
  "tiempo_estimado": 120
}
```

**Criterios CRÍTICOS:**
- ✅ Distribución equilibrada: A=25%, B=25%, C=25%, D=25%
- ✅ Longitud balanceada: ratio máximo 1.8:1
- ✅ Explicaciones pedagógicas en TODAS las alternativas
- ✅ Desarrollo paso a paso en la correcta
- ✅ Identificación de errores comunes en las incorrectas

#### ✅ Tarea 14: Preguntas Dominio 2 - Geometría
**Incluir:**
- Diagramas y figuras geométricas
- Problemas de cálculo de áreas/volúmenes
- Aplicación de teoremas
- Coordenadas cartesianas

#### ✅ Tarea 15: Preguntas Dominio 3 - Probabilidad y Estadística
**Incluir:**
- Tablas de datos
- Gráficos estadísticos (barras, torta, dispersión)
- Interpretación de información
- Cálculos de probabilidad

#### ✅ Tarea 16: Preguntas Dominio 4 - Funciones
**Incluir:**
- Gráficos de funciones
- Análisis de comportamiento
- Transformaciones
- Dominio y recorrido

---

### **FASE 5: Auditoría de Calidad (Tareas 17-18)**

#### ✅ Tarea 17: Auditar distribución de respuestas
**Script a crear:** `auditar-matematica-media.py`

```python
# Similar a auditar-prueba-generalista.py
def auditar_distribucion():
    # Contar respuestas A, B, C, D
    # Verificar que cada letra tenga ~25%
    # Detectar patrones predecibles
    # Generar reporte
```

**Resultado esperado:**
```
✅ Distribución equilibrada
A: 25% (7-8 preguntas)
B: 25% (7-8 preguntas)
C: 25% (7-8 preguntas)
D: 25% (7-8 preguntas)
```

#### ✅ Tarea 18: Auditar longitud de alternativas
**Script a crear:** `equilibrar-matematica-media.py`

```python
# Similar a equilibrar-longitud-prueba.py
def verificar_longitudes():
    for pregunta in preguntas:
        longitudes = [len(alt['texto']) for alt in pregunta['alternativas']]
        ratio = max(longitudes) / min(longitudes)
        if ratio > 1.8:
            # Expandir alternativas cortas
            expandir_alternativas(pregunta)
```

---

### **FASE 6: Implementación Web (Tareas 19-23)**

#### ✅ Tarea 19: Crear template .njk
**Archivo:** `evaluaciones/educacion-media/pruebas/matematica-media/index.njk`

**Basarse en:**
- `evaluaciones/educacion-basica/pruebas/basica-generalista/index.njk`

**Funcionalidades:**
- Auto-corrección instantánea
- Feedback pedagógico
- Scroll a resultados (no al tope)
- Tracking de progreso (0/30 → 30/30)
- Score por dominio
- Diseño responsive
- Accesibilidad

#### ✅ Tarea 20: Integrar gráficos
**Opciones:**
1. **SVG inline:** Para gráficos simples
2. **Imágenes optimizadas:** PNG/WebP para gráficos complejos
3. **Canvas/D3.js:** Para gráficos interactivos
4. **Desmos API:** Para funciones matemáticas

**Carpeta:** `evaluaciones/educacion-media/assets/graficos/`

**Ejemplo SVG:**
```html
<svg viewBox="0 0 400 300" class="responsive-graphic">
  <!-- Ejes coordenados -->
  <line x1="0" y1="150" x2="400" y2="150" stroke="black"/>
  <line x1="200" y1="0" x2="200" y2="300" stroke="black"/>
  <!-- Función cuadrática -->
  <path d="M..." fill="none" stroke="blue"/>
</svg>
```

#### ✅ Tarea 21: Integrar fórmulas matemáticas
**Opción 1: MathJax**
```html
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

<!-- En el texto -->
<p>La fórmula cuadrática es: $$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$</p>
```

**Opción 2: KaTeX (más rápido)**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>

<!-- En el script -->
katex.render("x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}", element);
```

#### ✅ Tarea 22: Crear JSON de datos
**Archivo:** `prueba-matematica-media-datos.json`

**Estructura:**
```json
{
  "metadata": {
    "titulo": "Prueba de Matemática - Educación Media",
    "nivel": "media",
    "asignatura": "matematica",
    "total_preguntas": 30,
    "tiempo_sugerido": 90,
    "dominios": [
      {"nombre": "Números y Álgebra", "preguntas": 8},
      {"nombre": "Geometría", "preguntas": 7},
      {"nombre": "Probabilidad y Estadística", "preguntas": 8},
      {"nombre": "Funciones", "preguntas": 7}
    ],
    "distribucion_respuestas": {
      "A": 8, "B": 7, "C": 8, "D": 7
    }
  },
  "preguntas": [
    {
      "id": 1,
      "dominio": "Números y Álgebra",
      "pregunta": "...",
      "formula": "$$...$$",
      "grafico": "assets/graficos/pregunta_01.svg",
      "alternativas": [...],
      "respuesta_correcta": "A",
      "explicacion_detallada": "...",
      "tiempo_estimado": 120,
      "dificultad": "media",
      "oa_relacionado": "OA3"
    }
  ]
}
```

#### ✅ Tarea 23: Implementar sistema de casos de estudio
**Componentes:**

1. **Botón de acceso a casos:**
```html
<button class="btn-casos">
  📚 Ver casos de estudio relacionados
</button>
```

2. **Modal con casos:**
```javascript
function mostrarCasos(dominio) {
  const casosRelevantes = casos.filter(c => c.dominio === dominio);
  // Mostrar en modal
}
```

3. **Integración con IA:**
```html
<div class="caso-ia">
  <h4>💡 Sugerencias con IA</h4>
  <ul>
    <li>Prompt 1: "Explícame cómo resolver..."</li>
    <li>Prompt 2: "Genera 3 ejercicios similares..."</li>
  </ul>
</div>
```

---

### **FASE 7: Testing y Documentación (Tareas 24-25)**

#### ✅ Tarea 24: Testing completo
**Checklist:**
- ✅ Funcionalidad en Chrome, Firefox, Safari, Edge
- ✅ Responsive en desktop (1920px, 1366px)
- ✅ Responsive en tablet (768px)
- ✅ Responsive en móvil (375px, 414px)
- ✅ Fórmulas se renderizan correctamente
- ✅ Gráficos son legibles en todos los tamaños
- ✅ Auto-corrección funciona
- ✅ Scroll a resultados funciona
- ✅ Tracking de progreso actualiza
- ✅ Casos de estudio se cargan
- ✅ Botones de IA funcionan
- ✅ Performance < 3s carga inicial
- ✅ Accesibilidad: contraste, alt text, ARIA

#### ✅ Tarea 25: Documentar
**Archivos a crear:**

1. **README-MATEMATICA-MEDIA.md**
   - Estructura de archivos
   - Cómo agregar preguntas
   - Cómo actualizar contenidos
   - Guía de mantenimiento

2. **GRAFICOS-MATEMATICA-MEDIA.md**
   - Cómo crear gráficos SVG
   - Estándares de diseño
   - Herramientas recomendadas
   - Ejemplos de cada tipo

3. **FORMULAS-MATEMATICA-MEDIA.md**
   - Sintaxis de LaTeX
   - Ejemplos de fórmulas comunes
   - Troubleshooting

---

## 📊 Progreso Actual

**Fase 1:** ⬜⬜⬜⬜ (0/4)  
**Fase 2:** ⬜⬜⬜⬜⬜ (0/5)  
**Fase 3:** ⬜⬜⬜ (0/3)  
**Fase 4:** ⬜⬜⬜⬜ (0/4)  
**Fase 5:** ⬜⬜ (0/2)  
**Fase 6:** ⬜⬜⬜⬜⬜ (0/5)  
**Fase 7:** ⬜⬜ (0/2)  

**TOTAL:** 0/25 tareas completadas

---

## 🚨 Estrategia para evitar límite de caracteres

### **Dividir en archivos separados:**

```
dossier-matematica-media/
├── 01-numeros-algebra.md (< 8000 caracteres)
├── 02-geometria.md (< 8000 caracteres)
├── 03-probabilidad-estadistica.md (< 8000 caracteres)
├── 04-funciones.md (< 8000 caracteres)
└── index.md (índice con links)

casos-estudio-matematica-media/
├── caso-01-funciones-cuadraticas.json
├── caso-02-estadistica-descriptiva.json
├── caso-03-geometria-analitica.json
├── caso-04-probabilidad-condicional.json
└── caso-05-modelamiento-exponencial.json

preguntas-matematica-media/
├── dominio-1-numeros-algebra.json (8 preguntas)
├── dominio-2-geometria.json (7 preguntas)
├── dominio-3-probabilidad-estadistica.json (8 preguntas)
└── dominio-4-funciones.json (7 preguntas)
```

### **Scripts con output progresivo:**

```python
# Generar en múltiples pasos
def generar_dossier_parte1():
    """Solo Números y Álgebra"""
    pass

def generar_dossier_parte2():
    """Solo Geometría"""
    pass

# Llamar uno por uno
if __name__ == "__main__":
    parte = input("¿Qué parte generar? (1-4): ")
    if parte == "1":
        generar_dossier_parte1()
    elif parte == "2":
        generar_dossier_parte2()
    # etc.
```

---

## 🎯 Referencias de estilo

### **Para estructura general:**
- `evaluaciones/educacion-basica/pruebas/basica-generalista/`
- `generar-basica-generalista-*.py`

### **Para matemáticas:**
- `casos-estudio-matematica-v2.py`
- Pruebas de matemática básica existentes

### **Para integración de IA:**
- `agregar-ia-basica-generalista.py`
- `agregar-botones-ia-basica.py`

---

## ✅ Siguiente paso

**Comenzar con Tarea 1:** Revisar Planes y Programas de Matemática Media

Una vez completado el análisis curricular, proceder con el dossier parte por parte, evitando exceder límites de caracteres.
