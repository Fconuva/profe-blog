# 📋 TODO: Mejoras Guía Básica Generalista ECEP 2025

## 🎯 Objetivo General
Expandir y optimizar la guía de estudio de **Educación Básica Primer Ciclo Generalista** desde coverage actual (~30%) hasta **95%+** siguiendo el temario oficial ECEP 2025.

---

## ✅ BUGS CRÍTICOS A CORREGIR (PRIORIDAD INMEDIATA)

### 🔴 BUG 1: Título incorrecto en Hero Section
- **Problema**: El título dice "Educación Básica - 1° a 6° Básico - Todas las asignaturas"
- **Correcto**: Debe decir "Lenguaje y Comunicación - 1° a 3° Básico - Primer Ciclo Generalista"
- **Ubicación**: Línea ~217 del archivo `basica-generalista.njk`
- **Estado**: ❌ PENDIENTE

### 🔴 BUG 2: Emojis con fondo blanco y letras blancas (invisibles)
- **Problema**: En las 4 cards de asignaturas (📖 Lenguaje, 🔢 Matemática, 🌎 Historia, 🔬 Ciencias) las letras tienen color blanco sobre fondo blanco
- **Ubicación**: Grid de 4 columnas en Hero Section (líneas ~222-241)
- **Solución**: Cambiar `class="font-bold"` por `class="font-bold text-gray-800"` o similar
- **Estado**: ❌ PENDIENTE

### 🔴 BUG 3: Índice de contenidos no navega correctamente
- **Problema**: Los 4 links del índice (`href="#dominio-1"`, `#dominio-2`, etc.) no llevan a las secciones correspondientes
- **Ubicación**: Líneas ~362-400
- **Causa probable**: IDs de las secciones de destino no coinciden o no existen
- **Solución**: Verificar que existan `<div id="dominio-1">`, `<div id="dominio-2">`, etc. exactamente donde comienzan los dominios
- **Estado**: ❌ PENDIENTE

---

## 📚 DOMINIO 1: LENGUAJE Y COMUNICACIÓN

### 1.1 Contenidos Relevantes ⚠️ INCOMPLETO (~40%)

#### ✅ Ya Implementado:
- [x] Textos narrativos literarios (tabla con géneros: cuento, fábula, leyenda, mito)
- [x] Elementos estructura narrativa básica (narrador, personajes, tiempo, espacio)

#### ❌ Falta Agregar:
- [ ] **Tipos de narrador** (tabla detallada):
  - Por grado de conocimiento: omnisciente, conocimiento relativo
  - Por grado de participación: protagonista (1ª persona), testigo, fuera de la historia (3ª persona)
  - Ejemplos con fragmentos de textos de 1° a 3° básico
  - Actividades para identificar narrador
  
- [ ] **Textos no literarios** (tabla comparativa):
  - Expositivos (artículos enciclopedia infantil, informes)
  - Explicativos (cómo hacer algo, instrucciones)
  - Argumentativos (cartas al director infantiles, opiniones)
  - Publicitarios (afiches, anuncios)
  - Dialógicos (entrevistas, conversaciones)
  - Características formales, propósito comunicativo, estructura textual de cada uno
  - Ejemplos contextualizados
  
- [ ] **Ampliar elementos narrativos**:
  - Personajes: protagonista, antagonista, secundarios, redondos vs planos
  - Tiempo: cronológico vs psicológico, flashback (anacronía)
  - Espacio: físico, social, psicológico

### 1.2 Enseñanza-Aprendizaje ⚠️ INCOMPLETO (~30%)

#### ✅ Ya Implementado:
- [x] Momentos de la lectura (antes/durante/después) con algunas estrategias
- [x] Niveles de comprensión lectora (literal, inferencial, crítico) con tabla

#### ❌ Falta Agregar:
- [ ] **Estrategias específicas por momento** (tabla extensa):
  - ANTES: activación conocimientos previos, predicciones, vocabulario clave, propósito lectura
  - DURANTE: visualización, conexiones (texto-texto, texto-mundo, texto-yo), inferencias, monitoreo comprensión, releer
  - DESPUÉS: resumen, organizadores gráficos, discusión, aplicación
  - Ejemplos concretos de cada estrategia en acción (caso práctico)
  
- [ ] **Gramática/Morfosintaxis** (sección completa):
  - Sustantivos, adjetivos, verbos, artículos (clases palabras 1° a 3°)
  - Concordancia gramatical (género, número)
  - Estructura oración simple (sujeto-predicado)
  - Estrategias didácticas: juegos gramaticales, análisis contextualizado (NO ejercicios aislados)
  - Tabla con actividades lúdicas
  
- [ ] **Conciencia semántica y vocabulario**:
  - Raíces, prefijos, sufijos (morfología derivativa)
  - Familias de palabras
  - Inferencia significado por contexto (estrategias)
  - Sinónimos, antónimos
  - Tabla de actividades: mapa semántico, organizador gráfico, diccionario personal
  
- [ ] **Producción escrita - Proceso completo** (tabla por etapas):
  - PLANIFICACIÓN: propósito, audiencia, lluvia de ideas, organizador gráfico
  - TEXTUALIZACIÓN: escritura primer borrador, coherencia, cohesión
  - REVISIÓN: contenido, estructura, gramática, ortografía
  - EDICIÓN: versión final, publicación/compartir
  - Rúbrica ejemplo, estrategias de andamiaje
  
- [ ] **Comunicación oral**:
  - Participación en conversaciones (turnos, escucha activa)
  - Fórmulas de cortesía
  - Narración oral (estructura: inicio, desarrollo, cierre)
  - Recitación (poemas, trabalenguas)
  - Expresión dramática
  - Tabla con actividades graduadas 1° a 3°
  
- [ ] **Conciencia fonológica** (tabla detallada):
  - Conciencia silábica: identificar sílabas iniciales/finales, segmentar, omitir, sustituir
  - Conciencia fonémica: identificar fonemas iniciales/finales, segmentar palabras en fonemas, síntesis fonémica, manipulación
  - Secuencia de desarrollo, actividades concretas, juegos
  
- [ ] **Planificaciones y coherencia curricular**:
  - Analizar fragmentos planificaciones (coherencia OA-actividades-evaluación)
  - Enfoque comunicativo del currículum
  - Ejemplos de actividades coherentes vs incoherentes
  
- [ ] **Evaluación en Lenguaje**:
  - Instrumentos pertinentes por OA (rúbricas, listas cotejo, escalas apreciación, pruebas)
  - Indicadores de evaluación (ejemplos concretos para cada OA)
  - Tabla con correspondencia OA-indicador-instrumento
  
- [ ] **Retroalimentación formativa**:
  - Principios (específica, oportuna, accionable)
  - Ejemplos de retroalimentación efectiva vs inefectiva
  - Casos prácticos: muestras de escritura, respuestas comprensión lectora

---

## 🔢 DOMINIO 2: MATEMÁTICA

### 2.1 Contenidos Relevantes ⚠️ INCOMPLETO (~35%)

#### ✅ Ya Implementado:
- [x] Operaciones combinadas (algunos ejemplos)
- [x] Fracciones básicas (representación)

#### ❌ Falta Agregar:
- [ ] **Operaciones combinadas** (tabla completa):
  - Orden de operaciones (paréntesis, multiplicación/división, suma/resta)
  - Ejercicios graduados 1° a 3° básico
  - Problemas aplicados contextualizados
  
- [ ] **Propiedades de la adición y multiplicación** (tabla):
  - Conmutativa: a + b = b + a, a × b = b × a
  - Asociativa: (a + b) + c = a + (b + c)
  - Elemento neutro: a + 0 = a, a × 1 = a
  - Distributiva: a × (b + c) = (a × b) + (a × c)
  - Aplicación a resolución problemas
  - Ejercicios de igualdades
  
- [ ] **Fracciones** (sección extensa):
  - Fracciones de igual valor (equivalencias: 1/2 = 2/4 = 3/6)
  - Comparación de fracciones (mismo denominador, mismo numerador, recta numérica)
  - Simplificación y amplificación
  - Ordenar fracciones
  - Representaciones múltiples (gráfica, concreta, simbólica)
  - Problemas contextualizados
  
- [ ] **Ecuaciones e inecuaciones** (iniciación):
  - Representaciones: balanza, recta numérica, tablas, gráficos
  - Traducir entre representaciones
  - Resolución ecuaciones simples (x + 5 = 12)
  - Inecuaciones (mayor que, menor que)
  
- [ ] **Probabilidades**:
  - Experimentos aleatorios (lanzar dado, moneda, ruleta)
  - Nociones: seguro, posible, imposible
  - Más probable, menos probable, equiprobable
  - Juegos lúdicos contextualizados
  
- [ ] **Geometría** (tabla completa):
  - Figuras 2D: propiedades (lados, vértices, ángulos)
  - Cuerpos 3D: propiedades (caras, aristas, vértices)
  - Cálculo área, perímetro (iniciación 3° básico)
  - Cálculo volumen (concepto inicial con cubos unitarios)
  - Ángulos: rectos, agudos, obtusos

### 2.2 Enseñanza-Aprendizaje ⚠️ INCOMPLETO (~25%)

#### ✅ Ya Implementado:
- [x] Algunas estrategias generales

#### ❌ Falta Agregar:
- [ ] **Sistema de numeración decimal** (tabla estrategias):
  - Lectura y escritura números (hasta 1.000 en 3° básico)
  - Conteo de 1 en 1, de 10 en 10, de 100 en 100
  - Orden y comparación (>, <, =)
  - Descomposición aditiva (346 = 300 + 40 + 6)
  - Composición
  - Valor posicional (centenas, decenas, unidades)
  - Representaciones: bloques base 10, ábacos, recta numérica, tabla posicional
  
- [ ] **Patrones y Álgebra**:
  - Patrones numéricos (crecientes, decrecientes, constantes)
  - Igualdad y desigualdad (balanza, completar)
  - Ecuaciones e inecuaciones simples
  - Representaciones múltiples
  - Actividades: crear patrones, descubrir regla, completar secuencias
  
- [ ] **Geometría - Estrategias**:
  - Localización absoluta (coordenadas en cuadrícula) y relativa (arriba/abajo, izquierda/derecha)
  - Características figuras 2D y 3D (manipulación, clasificación)
  - Transformaciones isométricas: rotación, traslación, reflexión (con material concreto)
  - Líneas de simetría (papel doblado, espejos)
  - Ángulos (uso de escuadras, compás)
  - Tabla con actividades graduadas
  
- [ ] **Datos y Probabilidades**:
  - Construcción pictogramas y gráficos de barra simple
  - Lectura e interpretación (responder preguntas basadas en datos)
  - Recolección datos (encuestas, experimentos)
  - Registro y organización (tablas de conteo, tablas de frecuencia)
  - Actividades contextualizadas (datos del curso, temas de interés)
  
- [ ] **Recursos didácticos**:
  - Tabla completa: Bloques base 10, ábacos, regletas Cuisenaire, geoplanos, tangram, material concreto, software educativo
  - Cuándo usar cada recurso (por OA)
  
- [ ] **Estrategias para dificultades**:
  - Reformular problemas (simplificar lenguaje)
  - Usar representaciones diferentes (concreto → pictórico → simbólico)
  - Problemas más simples primero
  - Modelamiento paso a paso
  - Tabla con dificultades comunes y soluciones
  
- [ ] **Evaluación en Matemática**:
  - Instrumentos por OA
  - Indicadores de evaluación (tabla detallada)
  - Pruebas, trabajos prácticos, observación, portafolio
  
- [ ] **Retroalimentación formativa**:
  - Análisis de errores (conceptuales, procedimentales)
  - Ejemplos de retroalimentación efectiva
  - Casos prácticos
  
- [ ] **Conocimientos previos**:
  - Secuencia aprendizajes (lo que necesito saber ANTES)
  - Tabla por OA con prerrequisitos

---

## 🌎 DOMINIO 3: HISTORIA, GEOGRAFÍA Y CIENCIAS SOCIALES

### 3.1 Contenidos Relevantes ⚠️ INCOMPLETO (~20%)

#### ✅ Ya Implementado:
- [x] Mención básica pueblos originarios

#### ❌ Falta Agregar:
- [ ] **Pueblos Originarios de Chile** (TABLA EXTENSA similar a Parvularia):
  - **Zona Norte**: Atacameños (Lickan Antay), Aymaras, Diaguitas, Changos, Collas
  - **Zona Centro-Sur**: Mapuche (subgrupos: Picunche, Mapuche, Huilliche)
  - **Zona Sur-Austral**: Chonos, Cuncos, Kawésqar (Alacalufes), Yaganes (Yámana), Selk'nam (Onas)
  - **Isla de Pascua**: Rapa Nui
  - Para cada pueblo:
    - Ubicación geográfica
    - Organización política (autoridades: lonko, machi, cacique)
    - Organización económica (agricultura, pesca, caza, ganadería, recolección)
    - Organización cultural (lengua, cosmovisión, ceremonias, artesanía)
    - Transformaciones a lo largo de la historia (pre-hispánico, colonial, republicano, actualidad)
    - Imágenes ilustrativas, mapas
  
- [ ] **Recursos Naturales de Chile** (tabla por zona):
  - Recursos renovables: bosques, recursos hídricos, energías renovables (solar, eólica, hidroeléctrica)
  - Recursos no renovables: minería (cobre, litio, oro, plata, hierro), petróleo, gas
  - Relación con actividades económicas:
    - Minería (Norte Grande)
    - Agricultura y ganadería (Zona Central y Sur)
    - Pesca y acuicultura (todo el litoral)
    - Forestal (Zona Sur)
    - Turismo
  - Desarrollo sostenible: uso responsable, conservación, impacto ambiental
  - Efectos en medio ambiente: sobreexplotación, contaminación, pérdida biodiversidad
  - Tabla con ejemplos concretos, imágenes
  
- [ ] **Conceptos Democráticos** (tabla con definiciones y ejemplos):
  - Libertad (de expresión, de reunión, de culto)
  - Fraternidad (solidaridad, ayuda mutua)
  - Igualdad ante la ley (todos los ciudadanos tienen mismos derechos)
  - Respeto a derechos fundamentales (vida, educación, salud, no discriminación)
  - Democracia (gobierno del pueblo, elecciones, participación)
  - Discriminación (qué es, tipos, por qué es negativa)
  - Participación ciudadana (votar, organizarse, opinar, proponer)
  - Situaciones concretas aplicadas a contexto escolar y comunal

### 3.2 Enseñanza-Aprendizaje ⚠️ CASI VACÍO (~10%)

#### ❌ Falta Agregar TODO:
- [ ] **Estrategias Formación Ciudadana**:
  - Actividades: Asambleas de curso, elección de directiva, resolución conflictos, proyectos de mejora escolar
  - Representaciones: dramatizaciones, juegos de roles, simulaciones
  - Metáforas y ejemplos: comparar democracia con juego limpio, igualdad con justicia
  - Modelamiento: educador como modelo de conducta democrática
  - Preguntas desafiantes: dilemas morales, casos de discriminación
  - Tabla con estrategias graduadas 1° a 3°
  
- [ ] **Habilidades de la asignatura** (tabla detallada):
  - **Pensamiento temporal**: líneas de tiempo, secuencias, antes/después, cambios y continuidades
  - **Pensamiento espacial**: mapas, croquis, planos, ubicación relativa/absoluta, orientación
  - **Análisis y trabajo con fuentes**: fuentes primarias (fotografías antiguas, objetos, testimonios), secundarias (libros, videos). Extraer información, comparar fuentes, evaluar confiabilidad
  - **Pensamiento crítico**: formular preguntas, comparar diferentes perspectivas, fundamentar opiniones con evidencia, identificar causas y consecuencias
  - **Comunicación**: presentar información (oral, escrita, visual), usar vocabulario disciplinar
  - Actividades concretas para cada habilidad
  
- [ ] **Recursos didácticos**:
  - Ilustraciones (mapas históricos, pinturas de época)
  - Textos multimodales (infografías, videos, cómics históricos)
  - Demostraciones (reproducción objetos antiguos)
  - Explicación y descripción (narración histórica)
  - Flujos y diagramas (causas-consecuencias, procesos)
  - Tabla con recursos por OA
  
- [ ] **Dificultades y errores comunes**:
  - Ideas preconcebidas (ej: "los indígenas ya no existen")
  - Teorías implícitas (ej: "el progreso siempre es bueno")
  - Representaciones sociales (estereotipos sobre pueblos originarios)
  - Patrones de pensamiento (presentismo: juzgar pasado con valores actuales)
  - Prejuicios
  - Estrategias para abordarlas: contraejemplos, fuentes diversas, discusión
  - Tabla con ejemplos de respuestas erradas y cómo retroalimentar
  
- [ ] **Indicadores de evaluación**:
  - Por OA de cada eje (Historia, Geografía, Formación Ciudadana)
  - Tabla completa con desempeños observables
  
- [ ] **Retroalimentación formativa**:
  - Ejemplos ante muestras de desempeño (mapas, líneas de tiempo, ensayos)
  - Retroalimentación efectiva vs inefectiva
  - Casos prácticos

---

## 🔬 DOMINIO 4: CIENCIAS NATURALES

### 4.1 Contenidos Relevantes ⚠️ INCOMPLETO (~30%)

#### ✅ Ya Implementado:
- [x] Clasificación animales (tabla básica vertebrados/invertebrados)

#### ❌ Falta Ampliar:
- [ ] **Clasificación animales COMPLETA** (tabla extensa):
  - **Vertebrados**: mamíferos, aves, reptiles, anfibios, peces
    - Morfología (estructura corporal)
    - Hábitos alimentarios (carnívoros, herbívoros, omnívoros)
    - Refugio/hábitat
    - Cubierta corporal (piel, escamas, plumas, pelo)
    - Forma de desplazamiento (caminar, volar, nadar, reptar)
    - Reproducción (ovíparos, vivíparos, ovovivíparos)
    - Ciclo de vida (metamorfosis en anfibios, crecimiento directo)
  - **Invertebrados**: insectos, arácnidos, crustáceos, moluscos, equinodermos, anélidos
    - Mismas categorías que vertebrados
  - Imágenes, ejemplos chilenos (huemul, cóndor, rana chilena, araucaria)
  
- [ ] **Componentes del Universo** (tabla detallada):
  - **Estrellas**: qué son (esferas de gas incandescente), tamaños, colores, temperatura, ciclo de vida
  - **Planetas**: diferencia con estrellas (no emiten luz propia, orbitan estrella), rocosos vs gaseosos
  - **Galaxias**: agrupaciones de estrellas, Vía Láctea (nuestra galaxia), formas (espiral, elíptica, irregular)
  - **Satélites**: naturales (Luna) vs artificiales, órbita alrededor de planetas
  - **Sistema Solar**: Sol (estrella central), 8 planetas (orden, características), cinturón de asteroides, cometas
  - Modelos, imágenes, comparaciones de tamaños y distancias
  - Tabla comparativa de los 8 planetas

### 4.2 Enseñanza-Aprendizaje ⚠️ INCOMPLETO (~20%)

#### ✅ Ya Implementado:
- [x] Mención básica investigación científica escolar

#### ❌ Falta Agregar:
- [ ] **Reflexión crítica sobre situaciones de aula**:
  - Casos de clases reales (fragmentos)
  - Decisiones docente que favorecen aprendizaje (preguntas abiertas, fomentar predicciones, validar errores como aprendizaje, promover indagación)
  - Intervenciones efectivas vs inefectivas
  - Tabla con ejemplos
  
- [ ] **Estrategias para dificultades**:
  - Reformular ejemplos (usar contextos cercanos)
  - Simplificar problemas (pasos más pequeños)
  - Representaciones alternativas (dibujos, modelos 3D, videos, experimentos)
  - Tabla con dificultades comunes (ej: confusión seres vivos/inertes, fases de la Luna)
  
- [ ] **Investigación Científica Escolar - ETAPAS DETALLADAS** (tabla):
  - **1. OBSERVAR Y PREGUNTAR**:
    - Observación guiada y libre
    - Formular preguntas investigables (vs no investigables)
    - Ejemplos: "¿Por qué las plantas crecen hacia la luz?" (investigable) vs "¿Cuál es la planta más bonita?" (opinión)
    - Actividades: salida a terreno, observación con lupa, registro dibujos
  - **2. EXPERIMENTAR / PLANIFICAR Y CONDUCIR INVESTIGACIÓN**:
    - Formular hipótesis (predicciones)
    - Identificar variables (independiente, dependiente, controladas)
    - Diseñar experimento simple (con/sin comparación grupo control)
    - Seguir procedimiento
    - Usar instrumentos (lupa, termómetro, regla)
    - Registrar datos (tablas, dibujos, fotografías)
    - Ejemplos de experimentos 1° a 3°: germinación semillas, mezclas, imanes, luz y sombra
  - **3. ANALIZAR EVIDENCIA Y COMUNICAR**:
    - Organizar datos (tablas, gráficos simples)
    - Identificar patrones
    - Comparar resultados con hipótesis
    - Sacar conclusiones basadas en evidencia
    - Comunicar (informe simple, afiche, presentación oral)
  - Tabla completa con actividades por eje (Ciencias de la Vida, Tierra y Universo, Física, Química)
  
- [ ] **Actividades por Eje**:
  - **Ciencias de la Vida**: observar ciclo vida planta, clasificar animales, investigar hábitats, cadenas alimentarias
  - **Ciencias Tierra y Universo**: observar cielo diurno/nocturno, modelo fases Luna, modelo sistema solar a escala
  - Tabla con OA - estrategia - actividad - materiales
  
- [ ] **Instrumentos de evaluación**:
  - Informes de investigación (rúbrica)
  - Cuadernos de ciencias (lista de cotejo)
  - Presentaciones orales
  - Pruebas (preguntas de comprensión, aplicación)
  - Tabla con instrumentos pertinentes por OA
  
- [ ] **Retroalimentación formativa**:
  - Ejemplos ante muestras de desempeño (diseño experimental, conclusiones, clasificaciones)
  - Casos prácticos con respuestas de estudiantes

---

## 🎨 ELEMENTOS VISUALES Y OPTIMIZACIÓN

### ❌ Pendientes:
- [ ] Revisar todas las tablas para diseño responsive (especialmente en móvil)
- [ ] Agregar más SVG ilustrativos:
  - Diagrama Venn para clasificaciones (animales, textos)
  - Línea de tiempo visual (desarrollo histórico pueblos originarios)
  - Mapa de Chile con ubicación pueblos originarios y recursos naturales
  - Diagrama sistema solar a escala
  - Organizadores gráficos (mapas conceptuales, esquemas)
- [ ] Verificar coherencia de colores entre dominios (paleta actual: rosa-azul-naranja-verde)
- [ ] Índice interactivo mejorado (sticky, scroll suave, indicador sección activa)
- [ ] Validación HTML completa
- [ ] Revisión ortografía y consistencia terminológica
- [ ] Agregar más casos prácticos interactivos (mini-evaluaciones por dominio)
- [ ] Sección de recursos descargables (planificaciones ejemplo, rúbricas, instrumentos)

---

## 📊 ESTIMACIÓN DE COVERAGE

### Estado Actual (~25-30% total):
- DOMINIO 1: ~35% (faltan muchas estrategias y contenidos)
- DOMINIO 2: ~30% (faltan secciones completas)
- DOMINIO 3: ~15% (casi todo por desarrollar)
- DOMINIO 4: ~25% (falta investigación científica completa)

### Meta: 95%+ Coverage
**Líneas estimadas a agregar**: ~3,000-4,000 líneas
**Tablas nuevas**: ~25-30 tablas detalladas
**Casos prácticos**: ~15-20 nuevos
**SVG/Diagramas**: ~8-10 nuevos

---

## ⚡ ESTRATEGIA DE IMPLEMENTACIÓN

### Fase 1: CORRECCIÓN BUGS CRÍTICOS (1 commit)
1. Arreglar título Hero Section
2. Arreglar colores emojis/texto cards
3. Corregir navegación índice

### Fase 2: DOMINIO POR DOMINIO (4 commits)
1. Completar DOMINIO 1 (Lenguaje) - commit 1
2. Completar DOMINIO 2 (Matemática) - commit 2
3. Completar DOMINIO 3 (Historia) - commit 3
4. Completar DOMINIO 4 (Ciencias) - commit 4

### Fase 3: OPTIMIZACIÓN VISUAL (1 commit)
- Tablas responsive
- SVG y diagramas
- Validación y revisión

**TOTAL ESTIMADO: 6 deploys** (dentro del límite diario de 100)

---

## 📝 NOTAS IMPORTANTES

- Seguir mismo estilo pedagógico que Parvularia: **tablas detalladas, ejemplos concretos, cajas de actividades, casos prácticos**
- **Enfoque ECEP 2025**: Situaciones contextualizadas, no teoría abstracta
- **Bases Curriculares 2012/2018**: Alinear todo contenido con OA oficiales
- Mantener coherencia visual (colores por dominio, íconos, gradientes)
- Incluir botones IA estratégicamente (ya implementados, verificar funcionamiento)
- Validar que cada tabla tenga clase `table-modern` para responsive

---

## ✅ CRITERIOS DE COMPLETITUD

Una sección se considera COMPLETA cuando tiene:
1. ✅ Todos los contenidos del temario oficial cubiertos
2. ✅ Al menos 1 tabla detallada por subsección
3. ✅ 2-3 ejemplos concretos contextualizados
4. ✅ Actividades/estrategias didácticas específicas
5. ✅ Casos prácticos o situaciones de aula
6. ✅ Botón IA funcional (donde corresponda)
7. ✅ Sin errores HTML
8. ✅ Responsive en móvil

---

**Fecha creación**: 13 noviembre 2025  
**Archivo base**: `basica-generalista.njk` (2,283 líneas actuales)  
**Meta final**: ~5,500-6,500 líneas (coverage 95%+)
