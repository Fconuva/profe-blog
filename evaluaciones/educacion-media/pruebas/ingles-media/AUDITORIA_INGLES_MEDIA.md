# 🎧 AUDITORÍA: Prueba de Inglés Media - Sistema de Audios

**Fecha:** 15 de noviembre de 2025  
**Archivo:** `evaluaciones/educacion-media/pruebas/ingles-media/index.njk`  
**Código de prueba:** Inglés Media (50 preguntas)

---

## 📋 RESUMEN EJECUTIVO

### Problema Principal Identificado
La prueba de inglés media está diseñada como **"una prueba de audios en su mayoría"** donde los estudiantes reciben audífonos y pendrive para escuchar audios múltiples veces. Sin embargo, **NO HAY ARCHIVOS DE AUDIO REALES** - solo transcripciones textuales simuladas.

### Hallazgos Críticos

#### ❌ **PROBLEMA 1: Falta de Archivos de Audio Reales**
- **Preguntas 16-25** (Dominio 2: Listening Comprehension) usan el tag `[AUDIO TRANSCRIPT]`
- **No existe ningún archivo .mp3, .wav, u otro formato de audio**
- Los "audios" son solo texto escrito que los estudiantes **leen**, no **escuchan**
- Esto contradice completamente el propósito de una prueba de listening auténtica

#### ⚠️ **PROBLEMA 2: Sin Información de Duración**
Usuario reporta:
> "los audios duran 5 minutos algunos y quedarse atrapado en 1 audio por 1 pregunta no es recomendable"

**Hallazgo:** Ninguna pregunta indica:
- Duración estimada del audio
- Advertencias sobre gestión de tiempo
- Recomendaciones de cuántas veces escuchar

#### ⚠️ **PROBLEMA 3: Textos con Audio Parcial**
Usuario reporta:
> "también en algunos textos dejas audio, pero si eran 3 párrafos dejaste 2 con audio y el tercero no"

**Análisis de textos largos:**

1. **Pregunta 1 (Climate Change):**
   - Texto único en un bloque `<div>` 
   - NO tiene indicación de audio
   - Es texto de lectura (Reading Comprehension)
   - ✅ **CORRECTO** - es Domain 1 (Reading), no debería tener audio

2. **Pregunta 16 (Hikers Conversation):**
   ```html
   [AUDIO TRANSCRIPT] Listen to this conversation between two hikers:
   <div class='bg-purple-50 p-4 rounded-lg my-4 italic text-sm border-l-4 border-purple-500'>
   <strong>Woman:</strong> "I can't believe we've finally made it!..."
   <strong>Man:</strong> "Couldn't agree more!..."
   <strong>Woman:</strong> "Definitely - I'm absolutely famished!..."
   <strong>Man:</strong> "Good thinking. Yeah, it's in my backpack..."
   </div>
   ```
   - **4 turnos de diálogo** en un solo bloque
   - NO indica si cada turno tiene audio separado o si es un audio continuo
   - Sin información de duración

3. **Pregunta 18 (Airport Announcement):**
   ```html
   [AUDIO TRANSCRIPT] Listen to this airport announcement:
   <div class='bg-blue-50 p-4 rounded-lg my-4 italic text-sm border-l-4 border-blue-500'>
   "Good afternoon, passengers. This is a service announcement..."
   </div>
   ```
   - Anuncio en un solo párrafo largo
   - ✅ Estructura coherente para un audio único
   - ❌ Sin duración estimada

#### ❌ **PROBLEMA 4: Inconsistencia en Formato de Audio**

**Preguntas con `[AUDIO TRANSCRIPT]` explícito:**
- ✅ Pregunta 16: Hikers conversation (IELTS Listening Section 2)
- ✅ Pregunta 18: Airport announcement (IELTS Listening Section 1)
- ✅ Pregunta 20: Technician conversation
- ✅ Preguntas 22-25: Paraphrase statements

**Preguntas sin indicador claro:**
- ❓ Pregunta 17: Usa transcripción de pregunta 16 (inferencia)
- ❓ Pregunta 19: Usa transcripción de pregunta 18 (conclusión)
- ❓ Pregunta 21: Usa transcripción de pregunta 20 (inferencia)

**Hallazgo:** Las preguntas de "inferencia" reutilizan transcripciones anteriores, pero esto NO está claro visualmente para el estudiante.

---

## 🔍 ANÁLISIS DETALLADO POR DOMINIO

### **DOMINIO 1: Reading Comprehension (Preguntas 1-15)**

| Pregunta | Texto | ¿Necesita Audio? | Estado Actual |
|----------|-------|------------------|---------------|
| 1 | Climate Change (párrafo único) | ❌ NO (es lectura) | ✅ Correcto |
| 2 | Usa texto de P1 | ❌ NO (inferencia lectora) | ✅ Correcto |
| 3 | Usa texto de P1 | ❌ NO (vocabulario) | ✅ Correcto |
| 4 | Email corporativo | ❌ NO (es lectura) | ✅ Correcto |
| 5 | Usa texto de P4 | ❌ NO (conclusión) | ✅ Correcto |
| 6 | Anuncio publicitario | ❌ NO (es lectura) | ✅ Correcto |
| 7-15 | Varios textos cortos | ❌ NO (análisis escrito) | ✅ Correcto |

**Conclusión Dominio 1:** ✅ **NO requiere audios** - es comprensión lectora pura.

---

### **DOMINIO 2: Listening Comprehension (Preguntas 16-25)**

#### **📍 Pregunta 16-17: Hikers Conversation**

**Estado Actual:**
```javascript
{
  id: 16,
  dominio: "Domain 2: Listening Comprehension",
  enunciado: `[AUDIO TRANSCRIPT] Listen to this conversation between two hikers:
  <div class='bg-purple-50 p-4 rounded-lg my-4 italic text-sm border-l-4 border-purple-500'>
  <strong>Woman:</strong> "I can't believe we've finally made it!..."<br>
  <strong>Man:</strong> "Couldn't agree more!..."<br>
  <strong>Woman:</strong> "Definitely - I'm absolutely famished!..."<br>
  <strong>Man:</strong> "Good thinking. Yeah, it's in my backpack..."<br>
  </div>`
}
```

**Problemas:**
- ❌ Sin archivo de audio real
- ❌ Sin duración estimada (usuario dice "algunos duran 5 minutos")
- ❌ Sin advertencia sobre gestión de tiempo
- ❌ No indica cuántas veces se puede escuchar
- ❌ Pregunta 17 reutiliza audio pero no lo indica claramente

**Duración Estimada:** ~45-60 segundos (4 turnos, conversación natural)

---

#### **📍 Pregunta 18-19: Airport Announcement**

**Estado Actual:**
```javascript
{
  id: 18,
  dominio: "Domain 2: Listening Comprehension",
  enunciado: `[AUDIO TRANSCRIPT] Listen to this airport announcement:
  <div class='bg-blue-50 p-4 rounded-lg my-4 italic text-sm border-l-4 border-blue-500'>
  "Good afternoon, passengers. This is a service announcement..."
  </div>`
}
```

**Problemas:**
- ❌ Sin archivo de audio real
- ❌ Sin duración estimada
- ❌ Pregunta 19 reutiliza audio pero no es obvio

**Duración Estimada:** ~30-40 segundos (anuncio formal corto)

---

#### **📍 Preguntas 20-21: Customer Service Conversation**

**Estado Actual:**
```javascript
{
  id: 20,
  dominio: "Domain 2: Listening Comprehension",
  enunciado: `[AUDIO TRANSCRIPT] Listen to this conversation:
  <div class='bg-yellow-50 p-4 rounded-lg my-4 italic'>
  <strong>Customer:</strong> "The screen keeps freezing..."<br>
  <strong>Technician:</strong> "Have you tried restarting it?..."
  </div>`
}
```

**Duración Estimada:** ~20-30 segundos (diálogo breve)

---

#### **📍 Preguntas 22-25: Short Audio Statements**

**Estado Actual:**
- P22: "I'm afraid I won't be able to make it to the meeting tomorrow."
- P23: "Come on, you can do this. Just pull yourself together and try again."
- P24: Speaker A/B dialogue (2 turnos)
- P25: "If I were you, I'd reconsider that decision."

**Duración Estimada:** ~10-15 segundos cada uno

**Problemas:**
- ❌ Sin archivos de audio
- ❌ Formato inconsistente (algunas tienen `[AUDIO TRANSCRIPT]`, otras no)

---

## 📊 ESTADÍSTICAS DE LA AUDITORÍA

### Distribución de Problemas

| Categoría | Cantidad | Severidad |
|-----------|----------|-----------|
| **Preguntas sin audio real** | 10/10 listening | 🔴 CRÍTICA |
| **Sin información de duración** | 10/10 listening | 🟡 ALTA |
| **Transcripciones reutilizadas sin indicación** | 3 (17, 19, 21) | 🟡 MEDIA |
| **Formato inconsistente** | 4/10 | 🟡 MEDIA |
| **Sin advertencias de gestión de tiempo** | 10/10 | 🟡 ALTA |

### Duración Total Estimada de Audios

| Audio | Duración Estimada |
|-------|-------------------|
| P16: Hikers | ~50 segundos |
| P18: Airport | ~35 segundos |
| P20: Technician | ~25 segundos |
| P22-25: Statements | ~15 seg c/u = 60 seg |
| **TOTAL** | **~170 segundos = 2.8 minutos** |

**Conclusión:** Si los audios fueran reales y duraran lo estimado, NO hay ninguno de 5 minutos. Posiblemente el usuario se refiere a audios planificados pero no implementados, o a otra versión de la prueba.

---

## 🎯 PLAN DE REPARACIÓN

### **FASE 1: Aclarar Concepto de "Audio"**

**Opciones:**

#### **Opción A: Implementar Audios Reales** (Recomendado si es prueba oficial de listening)
1. Crear archivos de audio profesionales (.mp3)
2. Grabar con hablantes nativos o herramientas TTS de calidad
3. Agregar controles de reproducción en la interfaz
4. Implementar límite de reproducciones (ej. máximo 3 veces)

#### **Opción B: Mantener como "Listening Simulado con Transcripciones"** (Más realista)
1. Renombrar claramente: "Simulated Listening - Read the transcript"
2. Agregar temporizador para simular presión de tiempo
3. Ocultar transcripción después de tiempo límite
4. Mantener estructura de pregunta auténtica

**Recomendación:** Opción B por viabilidad y honestidad académica.

---

### **FASE 2: Agregar Información de Duración y Gestión de Tiempo**

Para cada pregunta de listening, agregar:

```html
<div class="bg-yellow-100 border-l-4 border-yellow-500 p-3 mb-4">
  <p class="font-bold text-sm">⏱️ Audio Information:</p>
  <ul class="text-xs text-gray-700 mt-1">
    <li>• Estimated duration: 45 seconds</li>
    <li>• You can listen up to 3 times</li>
    <li>• ⚠️ Avoid spending more than 2 minutes on this question</li>
  </ul>
</div>
```

---

### **FASE 3: Clarificar Transcripciones Reutilizadas**

**Problema:** Preguntas 17, 19, 21 usan audio de preguntas anteriores sin indicarlo.

**Solución:**

```javascript
{
  id: 17,
  dominio: "Domain 2: Listening Comprehension",
  enunciado: `<div class="bg-blue-100 border-2 border-blue-400 p-3 rounded-lg mb-4">
    <p class="font-bold text-blue-800">🔁 This question uses the SAME AUDIO as Question 16</p>
    <p class="text-sm text-blue-700">Listen again to the hikers' conversation if needed.</p>
  </div>
  
  <strong style="color: #9333ea;">IELTS Listening - Making Inferences</strong>
  
  Based on the hiking conversation, what can be logically inferred...`
}
```

---

### **FASE 4: Estandarizar Formato de Todas las Preguntas de Listening**

**Template estándar:**

```javascript
{
  id: XX,
  dominio: "Domain 2: Listening Comprehension",
  enunciado: `
    <!-- Audio Info Box -->
    <div class="bg-yellow-100 border-l-4 border-yellow-500 p-3 mb-4">
      <p class="font-bold text-sm">⏱️ Audio Information:</p>
      <ul class="text-xs text-gray-700 mt-1">
        <li>• Duration: XX seconds</li>
        <li>• Listen up to 3 times</li>
        <li>• ⚠️ Don't spend more than 2 minutes here</li>
      </ul>
    </div>
    
    <!-- IELTS Context -->
    <strong style="color: #9333ea;">IELTS Listening Section X - Context</strong>
    
    <!-- Transcript Box -->
    <div class='bg-purple-50 p-4 rounded-lg my-4 italic text-sm border-l-4 border-purple-500'>
    [SIMULATED AUDIO TRANSCRIPT]
    ...
    </div>
    
    <!-- Question -->
    <strong>Question XX:</strong> ...
  `
}
```

---

### **FASE 5: Agregar Sección de Instrucciones Generales**

Al inicio de la prueba, antes de comenzar:

```html
<!-- Listening Instructions Modal -->
<div class="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-xl border-2 border-purple-300 mb-6">
  <h3 class="font-bold text-xl text-purple-900 mb-3 flex items-center">
    <i class="bi bi-headphones-fill text-3xl mr-3"></i>
    Important: Listening Section Instructions
  </h3>
  
  <div class="space-y-3 text-gray-800">
    <div class="flex items-start">
      <span class="text-2xl mr-3">🎧</span>
      <div>
        <p class="font-semibold">Audio Format:</p>
        <p class="text-sm">This is a simulated listening test. Read transcripts carefully as if you were listening once.</p>
      </div>
    </div>
    
    <div class="flex items-start">
      <span class="text-2xl mr-3">⏱️</span>
      <div>
        <p class="font-semibold">Time Management:</p>
        <p class="text-sm">Each audio question shows estimated duration. Avoid spending excessive time on single questions.</p>
      </div>
    </div>
    
    <div class="flex items-start">
      <span class="text-2xl mr-3">⚠️</span>
      <div>
        <p class="font-semibold">Strategy:</p>
        <p class="text-sm text-red-700">Don't get stuck! If an audio seems long (~5 min), move on after 2 minutes and return later if time permits.</p>
      </div>
    </div>
    
    <div class="flex items-start">
      <span class="text-2xl mr-3">🔁</span>
      <div>
        <p class="font-semibold">Multiple Questions Per Audio:</p>
        <p class="text-sm">Some questions reuse the same audio transcript. Look for 🔁 indicators.</p>
      </div>
    </div>
  </div>
</div>
```

---

## ✅ CHECKLIST DE VALIDACIÓN POST-REPARACIÓN

- [ ] **Todas las preguntas de listening (16-25) tienen:**
  - [ ] Caja de información de audio con duración
  - [ ] Advertencia de gestión de tiempo
  - [ ] Formato consistente de transcripción
  - [ ] Indicador claro de `[SIMULATED AUDIO TRANSCRIPT]`

- [ ] **Transcripciones reutilizadas tienen:**
  - [ ] Indicador visual 🔁 "Uses same audio as Question X"
  - [ ] Referencia clara al audio original

- [ ] **Instrucciones generales agregadas:**
  - [ ] Modal/sección visible antes de comenzar
  - [ ] Explicación de formato simulado
  - [ ] Estrategias de gestión de tiempo
  - [ ] Advertencia sobre no quedarse atrapado

- [ ] **Consistencia de formato:**
  - [ ] Todos los audios usan misma estructura de `<div>`
  - [ ] Colores coherentes por tipo (conversación=purple, anuncio=blue, etc.)
  - [ ] Tipografía italic para transcripciones

---

## 📌 RECOMENDACIONES FUTURAS

### **Corto Plazo (Implementar YA)**
1. ✅ Agregar información de duración a TODAS las preguntas de listening
2. ✅ Aclarar transcripciones reutilizadas (P17, P19, P21)
3. ✅ Agregar instrucciones generales sobre gestión de tiempo
4. ✅ Estandarizar formato de transcripciones

### **Mediano Plazo (Próxima versión)**
1. 🎙️ Considerar implementar audios reales con TTS de calidad (Google TTS, Amazon Polly)
2. 🎵 Agregar controles de reproducción interactivos
3. ⏱️ Implementar temporizador automático por pregunta
4. 📊 Agregar estadísticas de tiempo empleado por pregunta

### **Largo Plazo (Mejora continua)**
1. 🎬 Grabar audios con hablantes nativos profesionales
2. 🔊 Incluir variedad de acentos (británico, americano, australiano)
3. 🎧 Implementar calidad de audio variable (buena/regular/mala) para simular condiciones reales
4. 📱 Desarrollar app móvil con audios descargables offline

---

## 🎯 PRIORIDADES DE CORRECCIÓN

### **🔴 CRÍTICO (Hacer HOY)**
1. Agregar advertencias de gestión de tiempo
2. Aclarar que NO hay audios reales (evitar confusión)
3. Indicar transcripciones reutilizadas

### **🟡 IMPORTANTE (Esta semana)**
1. Estandarizar formato de todas las preguntas listening
2. Agregar duraciones estimadas
3. Crear instrucciones generales

### **🟢 DESEABLE (Próximo mes)**
1. Implementar sistema de temporizador
2. Generar audios TTS
3. Mejorar interfaz de usuario

---

**Auditoría realizada por:** GitHub Copilot Agent  
**Estado:** ✅ COMPLETA - Lista para aplicar correcciones
