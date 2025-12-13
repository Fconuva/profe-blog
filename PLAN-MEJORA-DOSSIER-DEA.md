# 📋 PLAN DE MEJORA COMPLETA - DOSSIER DEA

## 🎯 Objetivo
Transformar el dossier DEA actual (4,675 líneas, muchas tablas) en una **guía de estudio interactiva, visual y fácil de memorizar**, con cobertura 100% del temario ECEP 2025.

---

## 📊 Diagnóstico Actual

### ❌ Problemas Identificados:
1. **Demasiadas tablas** - Difícil de leer y memorizar
2. **Texto denso** - Bloques largos sin descanso visual
3. **Sin interactividad** - No hay menús desplegables ni acordeones
4. **Sin progreso visual** - No sabe cuánto ha estudiado
5. **Sin flashcards** - Falta método de repaso activo
6. **Sin resúmenes ejecutivos** - Falta "lo esencial" de cada tema
7. **Diseño plano** - Sin efectos modernos ni animaciones

### ✅ Lo que Funciona:
- Contenido completo según temario
- Organizadores gráficos CSS creados
- Estructura de dominios clara

---

## 🏗️ ARQUITECTURA NUEVA

### Estructura Principal (6 módulos):

```
📚 DOSSIER DEA INTERACTIVO
├── 🎯 Panel de Progreso (sticky header)
├── 📋 Navegación por Pestañas
│
├── 📘 MÓDULO 1: FUNDAMENTOS
│   ├── 🎬 Video-resumen (opcional)
│   ├── 📝 Resumen Ejecutivo (bullet points)
│   ├── 🎨 Infografía Principal
│   ├── 📖 Contenido Desplegable (acordeones)
│   ├── 💡 Tips de Estudio
│   └── 🎴 Flashcards del Módulo
│
├── 📗 MÓDULO 2: NORMATIVA
│   └── [misma estructura]
│
├── 📙 MÓDULO 3: CARACTERIZACIÓN DEA
│   └── [misma estructura]
│
├── 📕 MÓDULO 4: EVALUACIÓN
│   └── [misma estructura]
│
├── 📒 MÓDULO 5: INTERVENCIÓN
│   └── [misma estructura]
│
├── 📓 MÓDULO 6: TRABAJO COLABORATIVO
│   └── [misma estructura]
│
└── 🏆 ZONA DE REPASO
    ├── 🎴 Todas las Flashcards
    ├── 📝 Simulador Mini-Quiz
    └── 📋 Checklist de Estudio
```

---

## 🎨 ELEMENTOS DE DISEÑO NUEVOS

### 1. 🔽 Acordeones/Desplegables (details/summary)
```html
<details class="accordion-item">
  <summary class="accordion-header">
    <span class="icon">📚</span>
    <span class="title">Modelo Biopsicosocial</span>
    <span class="badge">Importante</span>
  </summary>
  <div class="accordion-content">
    <!-- Contenido expandible -->
  </div>
</details>
```

### 2. 🎴 Flashcards Interactivas
```html
<div class="flashcard" onclick="this.classList.toggle('flipped')">
  <div class="flashcard-front">
    <p class="question">¿Qué es el modelo biopsicosocial?</p>
  </div>
  <div class="flashcard-back">
    <p class="answer">Enfoque de la OMS que ve la discapacidad como interacción entre salud y contexto.</p>
  </div>
</div>
```

### 3. 📊 Infografías en vez de Tablas
- Usar **diagramas de flujo** CSS
- **Mapas conceptuales** radiales
- **Líneas de tiempo** para normativa
- **Comparativas visuales** lado a lado

### 4. 📈 Barra de Progreso
```html
<div class="progress-bar sticky">
  <div class="progress-fill" style="width: 35%"></div>
  <span>35% completado</span>
</div>
```

### 5. 💡 Cajas de Tips (en vez de text walls)
```html
<div class="tip-box tip-memory">
  <span class="tip-icon">🧠</span>
  <div class="tip-content">
    <strong>Truco para recordar:</strong>
    <p>BIO-PSICO-SOCIAL = Cuerpo-Mente-Entorno</p>
  </div>
</div>
```

### 6. 🏷️ Etiquetas de Importancia
```html
<span class="badge badge-alta">🔴 Alta frecuencia ECEP</span>
<span class="badge badge-media">🟡 Pregunta probable</span>
<span class="badge badge-baja">🟢 Complementario</span>
```

### 7. 📱 Pestañas de Navegación (Tabs)
```html
<div class="tabs-container">
  <button class="tab active" data-tab="resumen">📝 Resumen</button>
  <button class="tab" data-tab="detalle">📖 Detalle</button>
  <button class="tab" data-tab="ejemplos">💡 Ejemplos</button>
  <button class="tab" data-tab="flashcards">🎴 Flashcards</button>
</div>
```

---

## 📋 TEMARIO ECEP 2025 - CHECKLIST DE COBERTURA

### DOMINIO 1: Fundamentos y Normativa

#### 1.1 Fundamentos (4 temas)
- [ ] Modelo Biopsicosocial de la discapacidad (CIF/OMS)
- [ ] Modelo AAIDD (5 dimensiones + apoyos)
- [ ] Enfoque de derechos en educación especial
- [ ] Barreras vs facilitadores para el aprendizaje

#### 1.2 Normativa Nacional (8 temas)
- [ ] Ley 20.422 (Igualdad de oportunidades)
- [ ] Decreto 170/2009 (NEE y PIE)
- [ ] Decreto 83/2015 (Diversificación y DUA)
- [ ] Criterios diagnósticos DEA según D170
- [ ] Orientaciones Técnicas PIE
- [ ] Plan de Apoyo Individual (PAI)
- [ ] Rol del educador diferencial en PIE
- [ ] Trabajo colaborativo (co-docencia)

### DOMINIO 2: Respuestas Educativas a las DEA

#### 2.1 Caracterización DEA (6 temas)
- [ ] Definición y tipos de DEA (Dislexia, Disgrafía, Discalculia, Disortografía)
- [ ] Bases neurobiológicas
- [ ] Procesos cognitivos implicados
- [ ] Criterios de exclusión (CI, déficits sensoriales, etc.)
- [ ] Manifestaciones según etapa escolar
- [ ] Impacto emocional y social

#### 2.2 Evaluación Psicopedagógica (8 temas)
- [ ] Evaluación diagnóstica integral (D170)
- [ ] Instrumentos: EVALÚA (todas versiones)
- [ ] Instrumentos: PROLEC-R / PROLEC-SE
- [ ] Instrumentos: TALE / EMLE-TALE 2000
- [ ] Instrumentos: TEDE / WISC-V
- [ ] Informe psicopedagógico
- [ ] Evaluación dinámica
- [ ] Criterio de discrepancia CI-Rendimiento

#### 2.3 Estrategias de Intervención (10 temas)
- [ ] Modelos de lectoescritura (Destrezas, Holístico, Integrado)
- [ ] Método Orton-Gillingham
- [ ] Conciencia fonológica
- [ ] Estrategias para dislexia
- [ ] Estrategias para disgrafía
- [ ] Estrategias para discalculia (Sumo Primero, CPS)
- [ ] Estrategias para disortografía
- [ ] Adaptaciones curriculares (acceso, objetivos, evaluación)
- [ ] Uso de TIC y tecnología asistiva
- [ ] Trabajo con familias

#### 2.4 Colaboración y Contexto (5 temas)
- [ ] Co-docencia (modelos y roles)
- [ ] Plan de Convivencia Escolar
- [ ] Plan de Formación Ciudadana
- [ ] Transición entre niveles educativos
- [ ] Habilidades socioemocionales

---

## 🔧 PLAN DE IMPLEMENTACIÓN

### FASE 1: Estructura Base (2-3 horas)
1. Crear archivo nuevo: `dossier-dea-v2.njk`
2. Implementar estilos CSS para:
   - Acordeones/desplegables
   - Flashcards con flip
   - Pestañas de navegación
   - Barra de progreso
   - Cajas de tips
3. Crear estructura de 6 módulos

### FASE 2: Módulo 1 - Fundamentos (1-2 horas)
1. Resumen ejecutivo en bullets
2. Infografía modelo biopsicosocial
3. Infografía modelo AAIDD
4. Acordeones con contenido
5. 10 flashcards del módulo

### FASE 3: Módulo 2 - Normativa (1-2 horas)
1. Línea de tiempo leyes
2. Acordeones por decreto
3. Diagrama PIE (roles)
4. 10 flashcards

### FASE 4: Módulo 3 - Caracterización (2 horas)
1. Cards visuales por tipo de DEA
2. Comparativas visuales
3. Diagrama procesos cognitivos
4. 15 flashcards

### FASE 5: Módulo 4 - Evaluación (2 horas)
1. Flujo de evaluación visual
2. Cards por instrumento
3. Acordeones con detalles
4. 10 flashcards

### FASE 6: Módulo 5 - Intervención (2-3 horas)
1. Diagrama modelos lectoescritura
2. Estrategias por DEA (acordeones)
3. Diagrama CPS Sumo Primero
4. 15 flashcards

### FASE 7: Módulo 6 - Colaboración (1 hora)
1. Diagrama co-docencia
2. Diagrama convivencia escolar
3. 5 flashcards

### FASE 8: Zona de Repaso (1 hora)
1. Compilar todas las flashcards
2. Mini-quiz de 10 preguntas
3. Checklist imprimible

---

## 📐 ESPECIFICACIONES TÉCNICAS

### CSS Variables:
```css
:root {
  --color-modulo1: #9c27b0; /* Fundamentos - Púrpura */
  --color-modulo2: #3f51b5; /* Normativa - Índigo */
  --color-modulo3: #e91e63; /* Caracterización - Rosa */
  --color-modulo4: #ff9800; /* Evaluación - Naranja */
  --color-modulo5: #4caf50; /* Intervención - Verde */
  --color-modulo6: #00bcd4; /* Colaboración - Cyan */
}
```

### Componentes JS Mínimos:
1. Toggle acordeones (CSS puro con `<details>`)
2. Flip flashcards (CSS + 1 línea JS)
3. Cambio de pestañas (10 líneas JS)
4. Progreso local (localStorage, opcional)

### Responsive:
- Mobile-first
- Flashcards apiladas en móvil
- Menú hamburguesa para navegación

---

## ✅ ENTREGABLES FINALES

1. **dossier-dea-v2.njk** - Archivo principal nuevo
2. **65+ flashcards** organizadas por módulo
3. **12+ infografías/diagramas** CSS
4. **40+ acordeones** desplegables
5. **6 resúmenes ejecutivos** (bullets)
6. **1 mini-quiz** de repaso
7. **1 checklist** de estudio

---

## ⏱️ TIEMPO ESTIMADO TOTAL: 12-15 horas

¿Procedo con la implementación por fases?
