# PLAN DE MEJORA: Prueba Parvularia ECEP 2025
## Basado en análisis de EP 2023-salida.pdf

## 📊 ANÁLISIS COMPARATIVO

### Prueba EP 2023 (Oficial)
- **Total preguntas**: 108 preguntas
- **Estructura**: Formato oficial ECEP con casos pedagógicos reales
- **Características detectadas**:
  - Uso extensivo de imágenes en preguntas (aprox. 15-20%)
  - Contextos pedagógicos detallados
  - Casos de estudio con situaciones áulicas reales
  - Alternativas de longitud similar (equilibradas)
  - Nivel de dificultad progresivo

### Nuestra Prueba Actual
- **Total preguntas**: 50 preguntas
- **Estructura**: Básica, sin imágenes
- **Necesita mejorar**:
  - ✗ No tiene imágenes
  - ✗ Contextos pedagógicos limitados
  - ✗ Pocos casos de estudio reales
  - ✗ Menos preguntas que la oficial

## 🎯 OBJETIVOS DE MEJORA

### 1. Aumentar cantidad de preguntas
- **Meta**: Pasar de 50 a 126 preguntas (superando el estándar oficial)
- **Distribución por núcleo**: ~15-16 preguntas por núcleo (8 núcleos)

### 2. Incorporar imágenes
- **Meta**: 25-30 preguntas con imágenes (aprox. 24% del total)
- **Tipos de imágenes necesarias**:
  - Ambientes de aprendizaje (rincones, espacios)
  - Materiales didácticos (juegos, recursos)
  - Situaciones de interacción niño-niño, niño-adulto
  - Producciones infantiles (dibujos, construcciones)
  - Secuencias de actividades
  - Gráficos de observación/evaluación

### 3. Mejorar contextos pedagógicos
- **Características del EP 2023 a replicar**:
  - Casos con nombre de educadora/or
  - Nivel específico (NT1 o NT2)
  - Objetivo de Aprendizaje (OA) citado
  - Descripción detallada de la situación
  - Pregunta centrada en decisión pedagógica

### 4. Tipos de preguntas según EP 2023

#### A. Preguntas de Análisis de Situación (40%)
- Educadora observa situación → ¿Qué núcleo/OA se favorece?
- Niños muestran conducta → ¿Qué nivel de logro?
- Actividad planificada → ¿Qué principio pedagógico se aplica?

#### B. Preguntas de Intervención Pedagógica (35%)
- ¿Cuál es la mejor estrategia para...?
- ¿Cómo debería actuar la educadora?
- ¿Qué recurso es más adecuado?

#### C. Preguntas de Evaluación/Documentación (15%)
- ¿Qué instrumento usar?
- ¿Cómo registrar el aprendizaje?
- ¿Qué evidencia es más relevante?

#### D. Preguntas Teóricas/Conceptuales (10%)
- Definiciones de BCEP 2018
- Principios pedagógicos
- Rol de la familia
- Inclusión y diversidad

## 📝 PLAN DE ACCIÓN

### FASE 1: Extracción de Imágenes del PDF (PRIORITARIO)
1. Extraer todas las imágenes del EP 2023-salida.pdf
2. Clasificarlas por tipo y núcleo
3. Guardarlas en: `evaluaciones/educacion-parvularia/pruebas/parv-nt/imagenes/`
4. Nombrarlas descriptivamente: `nucleo-identidad-autonomia-001.jpg`

### FASE 2: Análisis Detallado de Preguntas
1. Extraer texto completo de las 108 preguntas del EP 2023
2. Clasificar por:
   - Núcleo de aprendizaje
   - Tipo de pregunta (A, B, C, D)
   - Nivel de dificultad
   - Presencia de imagen
   - Longitud de contexto
3. Identificar patrones de redacción

### FASE 3: Creación de Nuevas Preguntas
1. **Reciclar preguntas con imagen del EP 2023** (25-30 preguntas)
   - Adaptar contextos manteniendo la imagen
   - Ajustar alternativas al temario 2025
   - Mantener nivel de dificultad

2. **Crear preguntas nuevas sin imagen** (70 preguntas adicionales)
   - Basadas en estructura del EP 2023
   - Casos pedagógicos reales
   - Distribución equilibrada por núcleo

3. **Mejorar preguntas existentes** (26 preguntas actuales a conservar)
   - Expandir contextos pedagógicos
   - Mejorar retroalimentación
   - Ajustar alternativas

### FASE 4: Implementación Técnica
1. Actualizar `index.njk`:
   - Agregar soporte para imágenes en preguntas
   - Expandir array de preguntas a 126
   - Mejorar sistema de navegación

2. Optimizar carga de imágenes:
   - Usar lazy loading
   - Comprimir imágenes (WebP)
   - Agregar alt text descriptivo

3. Actualizar estadísticas:
   - Cambiar "50 preguntas" → "126 preguntas"
   - Actualizar distribución por núcleo

## 🎨 ESTRUCTURA DE PREGUNTA MEJORADA (Estilo EP 2023)

```javascript
{
  id: 1,
  nucleo: "Identidad y Autonomía",
  ambito: "Desarrollo Personal y Social",
  
  // CONTEXTO PEDAGÓGICO DETALLADO (150-300 palabras)
  contexto: `
    La educadora Carla trabaja con un grupo de NT2 y se propone favorecer 
    el Objetivo de Aprendizaje N°6: "Planificar proyectos y juegos, en función 
    de sus ideas e intereses, proponiendo actividades, organizando los recursos, 
    incorporando los ajustes necesarios e iniciándose en la apreciación de sus 
    resultados".
    
    Durante la mañana, observa que un grupo de niños está construyendo una 
    "casa para los dinosaurios" en el rincón de bloques. Los niños discuten 
    sobre cómo hacer el techo y qué materiales usar...
  `,
  
  // IMAGEN (si aplica)
  imagen: "/evaluaciones/educacion-parvularia/pruebas/parv-nt/imagenes/identidad-autonomia-001.jpg",
  descripcion_imagen: "Niños construyendo con bloques en rincón de juego",
  
  // PREGUNTA ESPECÍFICA
  enunciado: "¿Cuál de las siguientes acciones de la educadora Carla favorece 
              de mejor manera el logro del OA N°6?",
  
  // ALTERNATIVAS EQUILIBRADAS
  alternativas: [
    "Observar sin intervenir, permitiendo que los niños resuelvan autónomamente 
     sus diferencias y tomen todas las decisiones sobre la construcción.",
    
    "Preguntar a los niños qué necesitan para hacer el techo, ofreciendo 
     materiales diversos y apoyando con preguntas que los ayuden a planificar 
     y anticipar los pasos a seguir.",
    
    "Mostrarles cómo hacer el techo correctamente y darles instrucciones paso 
     a paso para que logren un resultado exitoso.",
    
    "Proponer que dibujen primero el plano de la casa antes de construir, 
     asegurando que todos sigan el mismo modelo."
  ],
  
  correcta: 1, // índice B
  
  // RETROALIMENTACIÓN DETALLADA (200-400 palabras)
  explicacion: `
    La respuesta correcta es B...
    
    **Análisis de alternativas:**
    - A) Insuficiente: Si bien la autonomía es importante, el OA requiere 
      que la educadora MEDIE el proceso...
    - C) Directivista: Contradice el enfoque de protagonismo infantil...
    - D) Restrictiva: Limita la creatividad y flexibilidad...
  `,
  
  // METADATA
  dificultad: "media",
  tipo_pregunta: "intervencion_pedagogica",
  oa_relacionado: "OA 6 - Identidad y Autonomía",
  palabra_clave: "planificación infantil, autonomía progresiva, mediación"
}
```

## ⏱️ CRONOGRAMA

### Semana 1: Extracción y Análisis
- Día 1-2: Extraer imágenes del PDF
- Día 3-4: Analizar estructura de preguntas
- Día 5: Clasificar preguntas por tipo

### Semana 2: Creación de Contenido
- Día 1-3: Crear 30 preguntas con imagen (recicladas)
- Día 4-5: Crear 40 preguntas nuevas sin imagen

### Semana 3: Creación y Mejora
- Día 1-3: Crear 36 preguntas adicionales
- Día 4-5: Mejorar 20 preguntas existentes

### Semana 4: Implementación
- Día 1-2: Actualizar código (soporte imágenes)
- Día 3: Integrar todas las preguntas
- Día 4: Testing y ajustes
- Día 5: Deploy y documentación

## 🎯 MÉTRICAS DE ÉXITO

- ✅ 126 preguntas totales (vs 50 actuales)
- ✅ 25-30 preguntas con imágenes (vs 0 actuales)
- ✅ Promedio 300 palabras por contexto pedagógico
- ✅ 100% de preguntas con retroalimentación >200 palabras
- ✅ Distribución equilibrada: 15-16 preguntas por núcleo
- ✅ 40% análisis situación, 35% intervención, 15% evaluación, 10% teórica
- ✅ Estilo y dificultad equivalente a EP 2023 oficial
