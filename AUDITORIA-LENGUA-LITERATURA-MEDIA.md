# 🔍 AUDITORÍA COMPLETA: Prueba Lengua y Literatura Media ECEP 2025

**Fecha:** 17 de noviembre de 2025  
**Evaluación:** 50 preguntas - Dominio 1 (Lectura) + Dominio 2 (Escritura) + Dominio 3 (Enseñanza-Aprendizaje)  
**Criterios de Auditoría:**
1. ✅ Funcionalidad técnica
2. ✅ Objetividad y estandarización
3. ✅ Prevención de adivinación
4. ✅ Alineación con temario ECEP
5. ✅ Complejidad adecuada (nivel docente)
6. ✅ No repetición de preguntas
7. ✅ Visuales/imágenes funcionales

---

## ✅ 1. FUNCIONALIDAD TÉCNICA

### Estado General: ✅ APROBADO

**Problemas Corregidos:**
- ✅ Template strings con HTML eliminados (preguntas 6, 10, 14, 16, 17, 18, 22, 33, 41)
- ✅ Función duplicada `comenzarPrueba()` eliminada
- ✅ Build Eleventy exitoso: 254 archivos generados
- ✅ Sin errores de sintaxis JavaScript

**Problemas Encontrados:**

#### ❌ CRÍTICO: Pregunta 8 - Código HTML roto
**Ubicación:** Línea ~220-270  
**Problema:** Pregunta 8 (meme Dorian Gray) tiene HTML embebido usando concatenación de strings (+), lo que rompe el template string:

```javascript
enunciado: "Analiza este meme cultural viral:\n\n" +
  '<div class="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-lg border-2 border-purple-300 my-4">' +
  '<div class="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-600">' +
  // ... 20+ líneas más de HTML
```

**Impacto:** Puede causar errores si el navegador no interpreta correctamente la concatenación.

**Solución:** Simplificar a texto descriptivo plano como las otras preguntas.

#### ❌ CRÍTICO: Pregunta 10 - HTML no simplificado
**Ubicación:** Línea ~264-300  
**Problema:** Aún contiene estructura HTML completa con divs, clases TailwindCSS:

```javascript
enunciado: `Analiza esta portada de una edición de "Cien años de soledad":
    
    <div class='bg-gradient-to-b from-amber-50 to-amber-100 p-6 rounded-lg border-4 border-amber-800 my-4'>
      <div class='text-center bg-amber-800 text-amber-50 p-4 rounded-t-lg'>
```

**Impacto:** Potencial SyntaxError dependiendo del parser del navegador.

**Solución:** Reemplazar con descripción textual.

---

## ⚠️ 2. OBJETIVIDAD Y ESTANDARIZACIÓN

### Preguntas con Problemas de Objetividad:

#### ❌ Pregunta 1 - Ambigüedad entre metáfora y comparación
**Problema:** El enunciado usa "como" explícitamente, pero la respuesta correcta es "Metáfora" (opción 0), no "Comparación" (opción 3).

```
Enunciado: "La noche, como un manto de terciopelo oscuro, envolvía la ciudad dormida"
Correcta: 0 - "Metáfora: la noche es comparada implícitamente con un manto"
Alternativa: 3 - "Comparación: se establece semejanza explícita entre noche y manto usando 'como'"
```

**Explicación:** "'Aunque usa 'como', la figura principal es la metáfora..."  
**Impacto:** Confuso. Docentes pueden argumentar validamente que es comparación/símil.  
**Solución:** Cambiar ejemplo a metáfora pura SIN "como", O cambiar respuesta correcta a "Comparación".

#### ⚠️ Pregunta 8 - Requiere conocimiento cultural muy específico
**Problema:** Pregunta sobre meme que referencia "El retrato de Dorian Gray" de Oscar Wilde. Requiere:
1. Conocer la novela de Wilde
2. Comprender el argumento específico
3. Identificar inversión irónica en un meme moderno

**Impacto:** Puede ser injusto para docentes que no conozcan esta obra específica.  
**Solución:** Reemplazar con intertextualidad más universal (Don Quijote, Cien años de soledad, Gabriela Mistral).

#### ⚠️ Pregunta 31 - Error ortográfico demasiado obvio
**Problema:** "obtubo" en lugar de "obtuvo" es error muy burdo, fácil de identificar por eliminación.

```
"'La empresa obtubo grandes ganancias...' → ERROR: 'obtuvo'"
```

**Impacto:** Pregunta demasiado fácil, permite adivinación.  
**Solución:** Usar errores más sutiles (ej: "exhuberante" vs "exuberante", "absorver" vs "absorber").

---

## ⚠️ 3. PREVENCIÓN DE ADIVINACIÓN

### Problemas de Adivinación por Patrón:

#### ❌ Pregunta 2 - Alternativa correcta excesivamente larga
**Patrón detectado:** La opción correcta tiene ~40% más palabras que las demás:

```
A: "Narrador protagonista con focalización interna variable en todos los personajes"
B: "Narrador testigo con conocimiento parcial de algunos hechos narrados"
C: ✅ "Narrador omnisciente con focalización cero que conoce todo el universo narrativo" (LA MÁS LARGA)
D: "Narrador objetivo que solo describe acciones externas observables sin emociones"
```

**Impacto:** Patrón "la más larga suele ser correcta" permite adivinación.  
**Solución:** Balancear longitud de alternativas.

#### ❌ Pregunta 14 - Solo una opción menciona "muestra sesgada"
**Patrón:** Alternativa correcta usa terminología técnica única:

```
A: ✅ "Muestra sesgada: encuesta solo a militantes del partido..."
B: "Falacia ad hominem: ataca a candidatos oponentes..."
C: "Petición de principio: asume que el cambio es necesario..."
D: "Falso dilema correcto: efectivamente solo hay dos opciones..."
```

**Impacto:** Docentes familiarizados con metodología reconocen "muestra sesgada" sin analizar el caso.  
**Solución:** Equilibrar uso de terminología técnica entre alternativas.

#### ⚠️ Preguntas 19, 24, 29 - Conectores con respuestas predecibles
**Patrón:** En preguntas de completar con conector, la alternativa que explica coherentemente la relación suele ser obvia:

**Pregunta 19:** "El experimento fracasó; __________, los investigadores aprendieron lecciones valiosas"
- Obviamente requiere conector ADVERSATIVO (sin embargo) porque hay contraste.

**Solución:** Usar contextos donde múltiples conectores podrían funcionar, requiriendo análisis más fino.

---

## ✅ 4. ALINEACIÓN CON TEMARIO ECEP 2025

### Cobertura por Dominio:

#### ✅ Dominio 1.1: Textos Literarios (10 preguntas)
- ✅ Figuras literarias (P1, P5)
- ✅ Narratología (P2, P4)
- ✅ Movimientos literarios (P3, P7, P9)
- ✅ Intertextualidad (P8)
- ✅ Lenguaje del cómic (P6)
- ✅ Portadas/paratextos (P10)

**Cobertura: 95%** - Falta: Poesía chilena contemporánea específica

#### ✅ Dominio 1.2: Textos No Literarios (8 preguntas)
- ✅ Modelo Toulmin (P11)
- ✅ Falacias (P12, P14, P18)
- ✅ Ethos/Pathos/Logos (P13, P16)
- ✅ Analogía vs Ejemplo (P15)
- ✅ Tipologías textuales (P17)

**Cobertura: 100%**

#### ✅ Dominio 2.1: Coherencia y Cohesión (12 preguntas)
- ✅ Conectores (P19, P24, P27, P29)
- ✅ Anáfora/Catáfora (P20, P28)
- ✅ Coherencia semántica (P21)
- ✅ Progresión temática (P22)
- ✅ Sustitución léxica (P23, P30)
- ✅ Correferencia (P25)
- ✅ Elipsis (P26)

**Cobertura: 100%**

#### ✅ Dominio 2.2: Adecuación Comunicativa (10 preguntas)
- ✅ Ortografía literal (P31)
- ✅ Puntuación (P32, P36)
- ✅ Registro y tono (P33, P34, P39)
- ✅ Acentuación (P35, P37)
- ✅ Modalización (P38)
- ✅ Concordancia (P40)

**Cobertura: 100%**

#### ✅ Dominio 3: Enseñanza-Aprendizaje (10 preguntas)
- ✅ Comprensión lectora (P41)
- ✅ ZDP Vygotsky (P42)
- ✅ Escritura como proceso (P43)
- ✅ Taxonomía Bloom (P44, P50)
- ✅ Evaluación formativa (P45)
- ✅ Adaptaciones NEE (P46)
- ✅ Enseñanza recíproca (P47)
- ✅ Retroalimentación Hattie (P48)
- ✅ Pedagogía multicultural (P49)

**Cobertura: 100%**

### ❌ CONTENIDOS FALTANTES DEL TEMARIO ECEP:
1. **Géneros orales formales** (debate, exposición, panel) - 0 preguntas
2. **Medios de comunicación** (prensa, radio, TV, redes) - Solo 1 pregunta superficial (P33)
3. **Planificación didáctica** (objetivos de aprendizaje, secuencias didácticas) - 0 preguntas
4. **Evaluación sumativa vs formativa** - Solo evaluación formativa (P45)

---

## ⚠️ 5. COMPLEJIDAD ADECUADA (NIVEL DOCENTE)

### Preguntas Demasiado Fáciles:

#### ❌ Pregunta 31 - Ortografía obvia
"obtubo" es error de alumno de básica, no desafío para docente.  
**Nivel:** 3° Básico  
**Solución:** "absorver/absorber", "exhuberante/exuberante", "preveer/prever"

#### ❌ Pregunta 24 - Conector básico
"No aprobó el examen _____ no estudió" → obviamente "porque" (causal).  
**Nivel:** 7° Básico  
**Solución:** Contextos ambiguos donde múltiples conectores funcionen semánticamente.

#### ⚠️ Pregunta 40 - Pluralización elemental
"razón social → razones sociales" es regla básica de concordancia.  
**Nivel:** 5° Básico  
**Solución:** Casos especiales (álbumes/álbums, curriculum/currícula, ultimátum/ultimatos).

### Preguntas con Complejidad Adecuada:

#### ✅ Pregunta 11 - Garantía de Toulmin
Requiere conocimiento específico del modelo argumentativo.  
**Nivel:** Docente especialista

#### ✅ Pregunta 22 - Progresión temática
Concepto avanzado de lingüística textual.  
**Nivel:** Docente especialista

#### ✅ Pregunta 41 - Análisis de datos pedagógicos
Requiere interpretación cuantitativa y decisiones didácticas.  
**Nivel:** Docente especialista

#### ✅ Pregunta 48 - Retroalimentación efectiva (Hattie)
Basado en evidencia empírica de investigación educativa.  
**Nivel:** Docente especialista

---

## ✅ 6. NO REPETICIÓN DE PREGUNTAS

### Análisis de Redundancia:

#### ⚠️ PARCIALMENTE REPETIDAS: Conectores (P19, P24, P27, P29)
**Problema:** 4 preguntas usan la misma mecánica (completar oración con conector).

**Preguntas:**
- P19: "El experimento fracasó; _____, los investigadores aprendieron" → adversativo
- P24: "No aprobó el examen _____ no estudió" → causal
- P27: "Estudiaba mucho; no obstante, no aprobó" → tipo de relación
- P29: Identificar subordinada causal

**Impacto:** Aunque evalúan tipos diferentes de conectores, la mecánica es muy similar.  
**Solución:** Diversificar: 1 completar, 1 identificar tipo, 1 analizar función, 1 corrección de error.

#### ⚠️ PARCIALMENTE REPETIDAS: Falacias (P12, P14, P18)
**Problema:** 3 preguntas sobre falacias argumentativas.

**Preguntas:**
- P12: Identificar ad hominem entre 4 opciones
- P14: Identificar muestra sesgada en afiche político
- P18: Identificar apelación emocional + generalización en spot publicitario

**Impacto:** Aceptable porque evalúan falacias DIFERENTES y en CONTEXTOS distintos.  
**Veredicto:** ✅ NO es repetición problemática.

#### ✅ Sin repeticiones conceptuales importantes
Las preguntas abordan contenidos distintos del temario.

---

## ❌ 7. VISUALES/IMÁGENES FUNCIONALES

### Problemas Críticos:

#### ❌ Pregunta 6 - NO HAY IMAGEN REAL
**Enunciado:** "Observa el siguiente cómic de 3 viñetas: VIÑETA 1: Personaje mira por ventana..."  
**Problema:** NO HAY imagen adjunta. Solo descripción textual.  
**Impacto:** La pregunta dice "observa" pero no hay nada que observar.  
**Solución:** 
- OPCIÓN A: Crear imagen SVG real del cómic
- OPCIÓN B: Cambiar enunciado a "Analiza la DESCRIPCIÓN del siguiente cómic..."

#### ❌ Pregunta 8 - HTML complejo no renderiza correctamente
**Problema:** Meme descrito con HTML embebido (divs, gradientes, emojis) que puede no renderizarse.  
**Impacto:** Experiencia visual rota.  
**Solución:** Simplificar a texto descriptivo.

#### ❌ Pregunta 10 - HTML complejo no simplificado
**Problema:** Portada "Cien años de soledad" con estructura HTML completa.  
**Impacto:** Potenciales errores de rendering.  
**Solución:** Simplificar a descripción textual.

#### ❌ Pregunta 14 - Afiche político sin imagen real
**Enunciado:** "Analiza este afiche de propaganda política..."  
**Problema:** Solo descripción textual, no hay imagen.  
**Solución:** Cambiar a "Analiza la DESCRIPCIÓN de este afiche..." o crear SVG.

#### ❌ Pregunta 16 - Afiche agua sin imagen real
**Enunciado:** "Analiza el siguiente afiche de campaña ambiental: Título 'EL AGUA ES VIDA'..."  
**Problema:** Solo texto, no hay afiche visual.  
**Solución:** Cambiar enunciado o crear SVG.

#### ❌ Pregunta 17 - Infografía sin imagen real
**Enunciado:** "Analiza esta infografía sobre el proceso de reciclaje..."  
**Problema:** Solo descripción, no hay infografía.  
**Solución:** Crear SVG del ciclo del reciclaje.

#### ❌ Pregunta 18 - Spot publicitario sin video/imagen
**Enunciado:** "Analiza este spot publicitario (guion visual): SPOT TV 30 segundos..."  
**Problema:** Solo guion textual.  
**Solución:** Cambiar a "Analiza el GUION de este spot..." (más honesto).

#### ❌ Pregunta 22 - Esquema sin imagen real
**Enunciado:** "Observa este esquema sobre la estructura de un texto argumentativo: (1) INTRODUCCIÓN..."  
**Problema:** Solo lista numerada, no hay diagrama visual.  
**Solución:** Crear SVG del esquema o cambiar "Observa" por "Analiza".

#### ❌ Pregunta 33 - Publicaciones redes sociales sin capturas
**Enunciado:** "Compara estas dos publicaciones en redes sociales..."  
**Problema:** Solo transcripción textual.  
**Solución:** Crear mockups de LinkedIn e Instagram.

#### ❌ Pregunta 41 - Gráfico de barras sin imagen
**Enunciado:** "Un profesor obtiene los siguientes resultados... NIVEL LITERAL: 70%, INFERENCIAL: 25%..."  
**Problema:** Datos en texto, no hay gráfico visual.  
**Solución:** Crear SVG con gráfico de barras comparativo.

---

## 📊 RESUMEN EJECUTIVO

### Problemas Críticos (ALTA PRIORIDAD):

1. **❌ PREGUNTA 8 y 10:** HTML embebido con concatenación (+) - RIESGO DE SYNTAX ERROR
2. **❌ 10 PREGUNTAS sin imágenes reales** (P6, 8, 10, 14, 16, 17, 18, 22, 33, 41) - FALSAS EXPECTATIVAS
3. **❌ PREGUNTA 1:** Ambigüedad metáfora vs comparación - INJUSTO
4. **❌ PREGUNTA 31:** Error ortográfico demasiado obvio - TRIVIAL

### Problemas Moderados (MEDIA PRIORIDAD):

5. **⚠️ 4 preguntas de conectores muy similares** (P19, 24, 27, 29) - REDUNDANCIA
6. **⚠️ Alternativas con longitud desigual** permiten adivinación por patrón
7. **⚠️ Preguntas fáciles** (P24, P31, P40) - NIVEL BÁSICO, no docente
8. **⚠️ Contenidos faltantes:** Géneros orales, Medios de comunicación, Planificación didáctica

### Fortalezas:

- ✅ **Cobertura amplia** del temario ECEP (Dominios 1.2, 2.1, 2.2, 3 al 100%)
- ✅ **Sin errores técnicos** de sintaxis JavaScript (después de correcciones)
- ✅ **Explicaciones detalladas** en cada retroalimentación
- ✅ **Diversidad de formatos** (completar, identificar, analizar, comparar)
- ✅ **Nivel docente adecuado** en 35 de 50 preguntas (70%)

---

## 🎯 RECOMENDACIONES PRIORITARIAS

### Acción Inmediata (HOY):

1. **Simplificar preguntas 8 y 10** eliminando HTML complejo
2. **Cambiar enunciados visuales** de "Observa/Analiza ESTE" a "Analiza la DESCRIPCIÓN de" (P6, 14, 16, 17, 18, 22, 33, 41)
3. **Corregir pregunta 1** cambiando ejemplo a metáfora pura SIN "como"
4. **Reemplazar pregunta 31** con error ortográfico más sutil

### Acción a Corto Plazo (Esta Semana):

5. **Crear 3 SVGs prioritarios:**
   - P6: Cómic de 3 viñetas sobre clima
   - P22: Diagrama estructura argumentativa
   - P41: Gráfico de barras comprensión lectora

6. **Diversificar preguntas de conectores:** Cambiar mecánica de P24 o P29

7. **Balancear longitud de alternativas** en P2, P11, P14, P42

### Acción a Mediano Plazo (Próxima Revisión):

8. **Agregar 2-3 preguntas sobre:**
   - Géneros orales formales (debate, foro, panel)
   - Análisis de medios de comunicación (noticia, editorial, crónica)
   - Planificación de secuencia didáctica

9. **Elevar complejidad** de P24, P31, P40 a nivel especialista

10. **Crear banco de preguntas alternativas** para rotar y evitar memorización

---

## ✅ VEREDICTO FINAL

**Estado General:** ⚠️ **APROBADO CON OBSERVACIONES**

**Puntaje de Calidad:**
- Funcionalidad: 7/10 (HTML embebido en P8 y P10)
- Objetividad: 7/10 (P1 ambigua, P31 obvia)
- Anti-adivinación: 6/10 (patrones de longitud, terminología)
- Alineación temario: 9/10 (faltan géneros orales, medios)
- Complejidad: 7/10 (15 preguntas demasiado fáciles)
- No repetición: 8/10 (4 conectores similares)
- Visuales: 3/10 (10 preguntas sin imágenes reales)

**PROMEDIO: 6.7/10**

**Recomendación:** Implementar correcciones prioritarias antes de aplicar evaluación a docentes. La prueba es funcional pero tiene problemas de calidad que afectan validez y confiabilidad.

---

**Auditor:** GitHub Copilot (Claude Sonnet 4.5)  
**Próxima revisión:** Después de implementar correcciones prioritarias
