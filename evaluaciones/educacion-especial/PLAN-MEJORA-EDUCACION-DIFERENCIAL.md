# 📋 PLAN DE MEJORA: EDUCACIÓN DIFERENCIAL / ESPECIAL

**Fecha:** 13 de Noviembre 2025  
**Estado Actual:** Formato inconsistente con el resto del sitio  
**Prioridad:** ALTA 🔴

---

## 🔍 DIAGNÓSTICO ACTUAL

### ✅ LO QUE ESTÁ BIEN

1. **Contenido del Dossier (`nuevo-pie-dosier.html`)**
   - ✅ Contenido completo y detallado por especialidad
   - ✅ Integración con IA (botones para explicaciones pedagógicas)
   - ✅ Estructura: Tronco común + 5 especialidades (DEA, TEL, TEA, DI, DM)
   - ✅ Anexos: Decreto 170, Decreto 83, Batería EVALÚA, teorías del aprendizaje
   - ✅ Tema oscuro moderno con sidebar navegable

2. **Página índice (`index.njk`)**
   - ✅ Integración con Groq/Grok API
   - ✅ Chat funcional con IA especializada en Ed. Especial
   - ✅ Enlaces a dossier y práctica interactiva
   - ✅ Usa layout Tailwind consistente

3. **Temarios oficiales**
   - ✅ 7 PDFs oficiales ECEP 2025 descargados:
     - Dificultades Específicas del Aprendizaje (DEA)
     - Discapacidad Auditiva
     - Discapacidad Intelectual
     - Discapacidad Múltiple
     - Discapacidad Visual
     - Trastorno Específico del Lenguaje (TEL)
     - Trastorno Espectro Autista + Disfasia Severa

---

## ❌ PROBLEMAS DETECTADOS

### 1. **INCONSISTENCIA DE FORMATO** 🚨 CRÍTICO

**Problema:** El dossier (`nuevo-pie-dosier.html`) usa un formato **completamente diferente** al resto del sitio:

| Aspecto | Resto del Sitio | Dossier Actual |
|---------|----------------|----------------|
| **Formato** | `.njk` (Nunjucks/11ty) | `.html` standalone |
| **Tema** | Claro con gradientes coloridos | Oscuro (dark mode) |
| **Layout** | `layout-evaluaciones.njk` | Custom grid con sidebar fijo |
| **Estilos** | Tailwind CDN + clases compartidas | CSS custom inline |
| **Navegación** | Index con cards → contenido | Sidebar izquierdo sticky |
| **Tablas** | Tailwind responsive | Custom CSS white tables |
| **Botones IA** | Gradiente purple-pink con modal | Gradiente green con feedback inline |

**Impacto:**
- ❌ Experiencia de usuario inconsistente
- ❌ Dificulta mantenimiento (2 sistemas de estilos)
- ❌ No usa componentes reutilizables del sitio
- ❌ Tema oscuro no es el estándar del sitio

### 2. **PROBLEMA DE RUTA (404)** 🐛

**Problema resuelto parcialmente:**
- ✅ Redirect agregado: `/NUEVO%20PIE%20DOSIER.HTML` → `/nuevo-pie-dosier.html`
- ⚠️ Pero la URL sigue siendo confusa (mayúsculas en el link del `index.njk`)

### 3. **FALTA CONVERSIÓN DE TEMARIOS**

**Problema:** Los temarios están en PDF pero no hay:
- ❌ Versión JSON estructurada (como Básica/Media)
- ❌ Guías de estudio interactivas por especialidad
- ❌ Práctica con preguntas tipo ECEP por temario

---

## 🎯 PLAN DE ACCIÓN

### FASE 1: ESTANDARIZAR FORMATO (PRIORIDAD ALTA) 🔴

**Objetivo:** Convertir `nuevo-pie-dosier.html` a formato `.njk` consistente con el resto del sitio.

#### Tareas:

1. **Crear `dossier-pie.njk`** (nuevo archivo)
   - Usar `layout-evaluaciones.njk`
   - Tema claro con gradientes (como Básica Generalista)
   - Sidebar de navegación adaptado (colapsable en móvil)
   - Mantener todo el contenido actual

2. **Adaptar estilos a Tailwind**
   - Reemplazar CSS custom por clases Tailwind
   - Tablas: usar clases `table-modern` del sitio
   - Botones IA: usar estilo gradiente purple-pink estándar
   - Cards de especialidad: similar a Básica Generalista

3. **Restructurar contenido**
   ```
   ESTRUCTURA NUEVA:
   - Hero section (título + descripción)
   - Selector de especialidad (6 cards grandes)
   - Contenido dinámico según especialidad seleccionada:
     * Tronco Común (todos)
     * Especialidad específica (DEA/TEL/TEA/DI/DM/DA)
   - Anexos (Decreto 170, 83, EVALÚA, teorías)
   - Botones IA integrados por sección
   ```

4. **Actualizar navegación**
   - Corregir link en `index.njk`: `/educacion-especial/dossier-pie` (sin mayúsculas)
   - Agregar breadcrumbs: Inicio > Evaluaciones > Ed. Especial > Dossier PIE
   - Index de contenidos interno (como Básica Generalista)

#### Ejemplo de card de especialidad (nuevo formato):
```html
<div class="grid md:grid-cols-3 gap-6">
  <a href="#dea" class="specialty-card bg-gradient-to-br from-blue-50 to-blue-100">
    <div class="icon">🔤</div>
    <h3>DEA</h3>
    <p>Dificultades Específicas del Aprendizaje</p>
  </a>
  <!-- Similar para TEL, TEA, DI, DM, DA -->
</div>
```

---

### FASE 2: CONVERTIR TEMARIOS A JSON (PRIORIDAD MEDIA) 🟡

**Objetivo:** Extraer contenido de PDFs a formato estructurado.

#### Tareas:

1. **Crear archivos JSON por especialidad** (similar a `generalista.json`)
   - `dea-temario.json`
   - `tel-temario.json`
   - `tea-temario.json`
   - `di-temario.json`
   - `dm-temario.json`
   - `da-temario.json`
   - `dv-temario.json` (Discapacidad Visual)

2. **Estructura JSON sugerida:**
```json
{
  "especialidad": "Dificultades Específicas del Aprendizaje",
  "codigo": "DEA",
  "version": "ECEP 2025",
  "dominios": [
    {
      "id": 1,
      "nombre": "Normativa y Marco Legal",
      "temas": [
        {
          "nombre": "Decreto 170/2010",
          "subtemas": [
            "Requisitos de ingreso al PIE",
            "Evaluación diagnóstica integral",
            "Reevaluación..."
          ]
        }
      ]
    },
    {
      "id": 2,
      "nombre": "Caracterización de la DEA",
      "temas": ["Dislexia", "Discalculia", "Disgrafía"]
    }
    // ...más dominios
  ]
}
```

3. **Método de conversión:**
   - Opción A: Extracción manual (lectura PDF + estructuración)
   - Opción B: OCR + IA para extraer estructura
   - Opción C: Herramienta automatizada (pdf2json + post-procesamiento)

---

### FASE 3: CREAR GUÍAS DE ESTUDIO INTERACTIVAS (PRIORIDAD MEDIA) 🟡

**Objetivo:** Crear versiones `.njk` del dossier usando los temarios JSON.

#### Tareas:

1. **Crear archivos por especialidad:**
   - `estudio/dea.njk`
   - `estudio/tel.njk`
   - `estudio/tea.njk`
   - `estudio/di.njk`
   - `estudio/dm.njk`
   - `estudio/da.njk`
   - `estudio/dv.njk`

2. **Formato similar a `basica-generalista.njk`:**
   - Hero section con título especialidad
   - Índice de dominios
   - Secciones expandibles con:
     * Definiciones
     * Tablas comparativas
     * Estrategias de intervención
     * Casos prácticos
     * Botones IA por tema

3. **Integración con temarios JSON:**
   ```njk
   {% set temario = especialidades.dea %}
   {% for dominio in temario.dominios %}
     <section id="dominio-{{ dominio.id }}">
       <h2>{{ dominio.nombre }}</h2>
       <!-- Contenido... -->
     </section>
   {% endfor %}
   ```

---

### FASE 4: BANCO DE PREGUNTAS (PRIORIDAD BAJA) 🟢

**Objetivo:** Crear práctica interactiva por especialidad.

#### Tareas:

1. **Crear archivos JSON de preguntas:**
   - `pruebas/dea/preguntas.json`
   - `pruebas/tel/preguntas.json`
   - etc.

2. **Estructura pregunta:**
```json
{
  "preguntas": [
    {
      "id": 1,
      "especialidad": "DEA",
      "dominio": "Normativa",
      "tema": "Decreto 170",
      "pregunta": "Según el Decreto 170...",
      "alternativas": ["A", "B", "C", "D"],
      "correcta": "B",
      "explicacion": "...",
      "nivel_dificultad": "medio"
    }
  ]
}
```

3. **Interfaz de práctica:**
   - Similar a `/evaluaciones/educacion-basica/pruebas/basica-generalista/practica/`
   - Filtro por especialidad
   - Retroalimentación con IA
   - Estadísticas de progreso

---

## 📅 CRONOGRAMA ESTIMADO

| Fase | Duración | Deploy |
|------|----------|--------|
| **FASE 1: Estandarizar formato** | 2-3 horas | Deploy inmediato |
| **FASE 2: Convertir temarios** | 4-6 horas | No requiere deploy (JSON local) |
| **FASE 3: Guías interactivas** | 6-8 horas | Deploy por especialidad |
| **FASE 4: Banco preguntas** | 8-10 horas | Deploy final |
| **TOTAL** | ~20-27 horas | 8-10 deploys |

---

## 🚀 INICIO INMEDIATO RECOMENDADO

### Opción 1: CONVERSIÓN RÁPIDA (1-2 horas)

**Convertir solo el dossier actual a formato `.njk` estándar:**

1. Crear `evaluaciones/educacion-especial/estudio/dossier-pie.njk`
2. Migrar todo el contenido HTML actual
3. Aplicar estilos Tailwind estándar
4. Actualizar links en `index.njk`
5. Deploy

**Beneficio inmediato:** Consistencia visual + URL limpia

### Opción 2: MIGRACIÓN COMPLETA (20+ horas)

**Ejecutar FASE 1 + 2 + 3:**

1. Convertir formato (FASE 1)
2. Extraer temarios a JSON (FASE 2)
3. Crear guías por especialidad (FASE 3)

**Beneficio:** Sitio completamente profesional y escalable

---

## ❓ DECISIÓN NECESARIA

**¿Qué enfoque prefieres?**

1. **🔥 URGENTE**: Solo FASE 1 (estandarizar formato) → 1-2 horas
2. **⚡ BALANCEADO**: FASE 1 + 2 (formato + temarios JSON) → 6-8 horas
3. **🎯 COMPLETO**: Todas las fases → 20-27 horas
4. **🤔 MANTENER**: Dejar como está (tema oscuro standalone)

**Recomendación:** Opción 1 (URGENTE) para tener consistencia inmediata, luego hacer las otras fases gradualmente.

---

## 📊 COMPARACIÓN: ANTES vs DESPUÉS

| Aspecto | ANTES (Actual) | DESPUÉS (Propuesto) |
|---------|----------------|---------------------|
| Formato | `.html` standalone | `.njk` con layout compartido |
| Tema | Oscuro exclusivo | Claro (estándar del sitio) |
| Navegación | Sidebar izquierdo | Index + secciones (como Básica) |
| Estilos | CSS inline custom | Tailwind clases reutilizables |
| URL | `/NUEVO%20PIE%20DOSIER.HTML` | `/educacion-especial/estudio/dossier-pie` |
| Temarios | 7 PDFs separados | JSON estructurado + guías interactivas |
| Práctica | Link genérico | Banco por especialidad con IA |
| Mantenibilidad | Difícil (código duplicado) | Fácil (componentes reutilizables) |

---

## ✅ SIGUIENTES PASOS

**Si decides proceder con FASE 1 (URGENTE):**

1. Crear `evaluaciones/educacion-especial/estudio/dossier-pie.njk`
2. Copiar contenido de `nuevo-pie-dosier.html`
3. Adaptar a layout estándar con Tailwind
4. Actualizar `index.njk` con nuevo link
5. Eliminar `nuevo-pie-dosier.html` (o renombrar a `.backup`)
6. Deploy

**¿Comenzamos? Dime qué opción prefieres (1, 2, 3 o 4)** 🚀
