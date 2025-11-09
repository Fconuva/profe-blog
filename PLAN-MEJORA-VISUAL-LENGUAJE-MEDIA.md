# 🎨 PLAN DE MEJORA VISUAL - DOSSIER LENGUAJE MEDIA ECEP 2025

**Objetivo:** Elevar la calidad visual del dossier de Lenguaje Media al **nivel profesional de Matemática Media**, con diseño premium, navegación intuitiva y experiencia de usuario excepcional.

**Estado actual:** 5,100+ líneas, contenido 100% completo, estructura sólida con 6 archivos, pero diseño visual básico.

**Referencia:** Replicar estándares visuales del dossier Matemática Media (colores profesionales, cards premium, iconografía, tablas estilizadas).

---

## 🎯 CRITERIOS DE EXCELENCIA VISUAL

Un dossier visualmente superior debe tener:

1. ✅ **Paleta de colores coherente**: Esquema profesional con colores por dominio
2. ✅ **Tipografía jerarquizada**: Fuentes legibles, tamaños consistentes, peso visual correcto
3. ✅ **Cards premium**: Bordes sutiles, sombras elegantes, hover effects
4. ✅ **Iconografía consistente**: Bootstrap Icons en todos los títulos y secciones
5. ✅ **Tablas estilizadas**: Bordes, colores alternados, headers destacados
6. ✅ **Badges informativos**: Contadores, porcentajes, estados (NUEVO, 100%)
7. ✅ **Navegación visual**: Breadcrumbs, botones grandes, enlaces destacados
8. ✅ **Espaciado profesional**: Márgenes, padding, line-height optimizados
9. ✅ **Alerts contextuales**: Info, warning, success con iconos
10. ✅ **Responsive design**: Adaptación perfecta a móvil/tablet/desktop

---

## 🎨 PALETA DE COLORES PROPUESTA

### **Colores por Dominio (Bootstrap 5 + Custom)**

```css
/* DOMINIO 1.1: Textos Literarios */
--literario-primary: #6f42c1 (púrpura - creatividad)
--literario-light: #e7d9ff
--literario-dark: #4a2c7d

/* DOMINIO 1.2: Textos No Literarios */
--no-literario-primary: #0d6efd (azul - razón)
--no-literario-light: #cfe2ff
--no-literario-dark: #084298

/* DOMINIO 2.1: Coherencia y Cohesión */
--coherencia-primary: #198754 (verde - conexión)
--coherencia-light: #d1e7dd
--coherencia-dark: #0a3622

/* DOMINIO 2.2: Adecuación Comunicativa */
--adecuacion-primary: #20c997 (turquesa - precisión)
--adecuacion-light: #d1f4ea
--adecuacion-dark: #0c5e49

/* DOMINIO 3: Enseñanza-Aprendizaje */
--pedagogia-primary: #fd7e14 (naranja - educación)
--pedagogia-light: #ffe5d0
--pedagogia-dark: #984c0c

/* CASOS DE ESTUDIO */
--casos-primary: #dc3545 (rojo - análisis)
--casos-light: #f8d7da
--casos-dark: #721c24

/* GENERAL */
--bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
--shadow-sm: 0 2px 4px rgba(0,0,0,0.08)
--shadow-md: 0 4px 12px rgba(0,0,0,0.12)
--shadow-lg: 0 8px 24px rgba(0,0,0,0.16)
```

---

## 📐 ESTRUCTURA VISUAL MEJORADA

### **ANTES (actual - básico):**
```html
<div class="card">
  <div class="card-header">Título</div>
  <div class="card-body">Contenido</div>
</div>
```

### **DESPUÉS (objetivo - premium):**
```html
<div class="card border-0 shadow-md hover-lift mb-4">
  <div class="card-header bg-gradient-primary text-white py-3">
    <div class="d-flex justify-content-between align-items-center">
      <h5 class="mb-0">
        <i class="bi bi-book-fill me-2"></i>
        Título del Dominio
      </h5>
      <span class="badge bg-light text-primary fs-6">~20%</span>
    </div>
  </div>
  <div class="card-body p-4">
    <div class="row align-items-center mb-3">
      <div class="col-md-8">
        <p class="text-muted mb-0">
          <i class="bi bi-file-text me-2"></i>1,236 líneas | 
          <i class="bi bi-pencil-square me-2"></i>20 ejercicios
        </p>
      </div>
      <div class="col-md-4 text-end">
        <span class="badge bg-success">100% Completo</span>
      </div>
    </div>
    <p class="card-text">Contenido...</p>
  </div>
  <div class="card-footer bg-light border-0">
    <a href="#" class="btn btn-primary btn-lg w-100">
      <i class="bi bi-arrow-right-circle me-2"></i>Estudiar Dossier
    </a>
  </div>
</div>
```

---

## 🔧 TAREAS DE IMPLEMENTACIÓN (30 ITEMS)

### 🔴 **FASE 1: SISTEMA DE DISEÑO BASE (Prioridad Crítica)**

#### **1. Crear archivo CSS personalizado `lenguaje-premium.css`**
**Ubicación:** `/css/lenguaje-premium.css` (nuevo archivo)  
**Contenido:**
```css
/* ===== VARIABLES CSS ===== */
:root {
  /* Colores dominios */
  --color-literario: #6f42c1;
  --color-no-literario: #0d6efd;
  --color-coherencia: #198754;
  --color-adecuacion: #20c997;
  --color-pedagogia: #fd7e14;
  --color-casos: #dc3545;
  
  /* Sombras */
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.12);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.16);
  --shadow-xl: 0 20px 40px rgba(0,0,0,0.20);
  
  /* Bordes */
  --border-radius-sm: 8px;
  --border-radius-md: 12px;
  --border-radius-lg: 16px;
  
  /* Transiciones */
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== CARDS PREMIUM ===== */
.card-premium {
  border: none;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  transition: var(--transition-smooth);
  overflow: hidden;
}

.card-premium:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.card-header-gradient {
  background: linear-gradient(135deg, var(--bs-primary) 0%, var(--bs-primary-dark) 100%);
  border: none;
  padding: 1.5rem;
}

/* ===== TABLAS ESTILIZADAS ===== */
.table-premium {
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.table-premium thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.table-premium tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

.table-premium tbody tr:hover {
  background-color: #e9ecef;
  transition: var(--transition-smooth);
}

/* ===== ACORDEONES MEJORADOS ===== */
.accordion-premium .accordion-item {
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: var(--border-radius-sm) !important;
  margin-bottom: 0.75rem;
  box-shadow: var(--shadow-sm);
}

.accordion-premium .accordion-button {
  font-weight: 600;
  background-color: #f8f9fa;
  border-radius: var(--border-radius-sm) !important;
}

.accordion-premium .accordion-button:not(.collapsed) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* ===== BADGES MEJORADOS ===== */
.badge-xl {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 50px;
}

.badge-outline {
  border: 2px solid currentColor;
  background: transparent;
}

/* ===== BOTONES PREMIUM ===== */
.btn-premium {
  font-weight: 600;
  border-radius: 50px;
  padding: 0.75rem 2rem;
  box-shadow: var(--shadow-md);
  transition: var(--transition-smooth);
}

.btn-premium:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* ===== ALERTS CON ICONOS ===== */
.alert-icon {
  display: flex;
  align-items-start;
  border-radius: var(--border-radius-md);
  border-left: 4px solid;
}

.alert-icon i {
  font-size: 1.5rem;
  margin-right: 1rem;
}

/* ===== BREADCRUMBS MEJORADOS ===== */
.breadcrumb-premium {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: var(--border-radius-sm);
  padding: 1rem 1.5rem;
  box-shadow: var(--shadow-sm);
}

/* ===== SECCIÓN HEADER ===== */
.section-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 0;
  margin-bottom: 3rem;
  border-radius: var(--border-radius-lg);
}

/* ===== STATS CARDS ===== */
.stat-card {
  text-align: center;
  padding: 2rem;
  border-radius: var(--border-radius-md);
  background: white;
  box-shadow: var(--shadow-md);
  transition: var(--transition-smooth);
}

.stat-card:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-lg);
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #6c757d;
  font-weight: 600;
}

/* ===== EJEMPLOS CON SINTAXIS ===== */
.ejemplo-box {
  background: #f8f9fa;
  border-left: 4px solid var(--bs-primary);
  padding: 1.5rem;
  border-radius: var(--border-radius-sm);
  margin: 1.5rem 0;
}

.ejemplo-numero {
  display: inline-block;
  background: var(--bs-primary);
  color: white;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-radius: 50%;
  font-weight: 700;
  margin-right: 0.5rem;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .card-premium {
    margin-bottom: 1.5rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .section-header {
    padding: 2rem 1rem;
  }
}
```
**Tiempo:** 2 horas  
**Impacto:** Base visual de todo el sistema

---

#### **2. Actualizar `index.njk` - Página principal con diseño premium**
**Archivo:** `evaluaciones/educacion-media/estudio/lenguaje-comunicacion-media/index.njk`  
**Cambios:**

**a) Agregar link al CSS personalizado en `<head>`:**
```html
<link rel="stylesheet" href="/css/lenguaje-premium.css">
```

**b) Reemplazar header básico por header gradient:**
```html
<!-- ANTES -->
<div class="text-center mb-5">
  <h1 class="display-4 fw-bold text-primary">📚 Material de Estudio</h1>
  <h2 class="h3 text-secondary">Lenguaje y Comunicación Educación Media</h2>
</div>

<!-- DESPUÉS -->
<div class="section-header text-center shadow-lg">
  <div class="container">
    <div class="mb-3">
      <span class="badge bg-light text-primary badge-xl">ECEP 2025</span>
    </div>
    <h1 class="display-3 fw-bold mb-3">
      <i class="bi bi-book-fill me-3"></i>Material de Estudio
    </h1>
    <h2 class="h2 opacity-90 mb-4">Lenguaje y Comunicación Educación Media</h2>
    <p class="lead mb-0 opacity-75">
      <i class="bi bi-check-circle-fill me-2"></i>100% del Temario Oficial
      <span class="mx-3">|</span>
      <i class="bi bi-file-text me-2"></i>5,100+ líneas
      <span class="mx-3">|</span>
      <i class="bi bi-pencil-square me-2"></i>138 ejercicios
    </p>
  </div>
</div>
```

**c) Convertir cards de dominios a formato premium:**
```html
<!-- Card Dominio 1.1 - ANTES -->
<div class="card h-100 border-primary shadow-sm">
  <div class="card-header bg-primary text-white">
    <h5 class="mb-0">
      <span class="badge bg-light text-primary">~20%</span>
      Textos Literarios
    </h5>
  </div>
  ...
</div>

<!-- Card Dominio 1.1 - DESPUÉS -->
<div class="card card-premium h-100" style="border-left: 4px solid var(--color-literario);">
  <div class="card-header-gradient" style="background: linear-gradient(135deg, var(--color-literario) 0%, #4a2c7d 100%);">
    <div class="d-flex justify-content-between align-items-center">
      <h5 class="mb-0 fw-bold">
        <i class="bi bi-book-fill me-2"></i>Textos Literarios
      </h5>
      <span class="badge bg-light text-dark fs-6">~20%</span>
    </div>
  </div>
  <div class="card-body p-4">
    <div class="row align-items-center mb-3">
      <div class="col-md-8">
        <p class="text-muted small mb-0">
          <i class="bi bi-file-text me-1"></i>1,236 líneas
          <span class="mx-2">|</span>
          <i class="bi bi-pencil-square me-1"></i>20 ejercicios
        </p>
      </div>
      <div class="col-md-4 text-end">
        <span class="badge bg-success badge-xl">
          <i class="bi bi-check-circle-fill me-1"></i>100%
        </span>
      </div>
    </div>
    <p class="card-text mb-3">
      Análisis profundo de figuras literarias, técnicas narrativas, elementos dramáticos, 
      géneros y subgéneros, contextos histórico-literarios y teorías críticas.
    </p>
    <ul class="list-unstyled small text-muted">
      <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>35 figuras literarias con definición y ejemplos</li>
      <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Narradores y focos narrativos (8 tipos)</li>
      <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Elementos dramáticos (tragedia, comedia, conflicto)</li>
      <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Movimientos literarios (Boom, Vanguardia, Romanticismo)</li>
      <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>20 ejercicios de análisis textual resueltos</li>
    </ul>
  </div>
  <div class="card-footer bg-light border-0 p-3">
    <a href="/dossier-lenguaje-media/dominio-1-1-textos-literarios/" class="btn btn-premium w-100" style="background: var(--color-literario); color: white;">
      <i class="bi bi-arrow-right-circle me-2"></i>Estudiar Dossier
    </a>
  </div>
</div>
```

**d) Agregar sección de estadísticas visuales:**
```html
<section class="mb-5">
  <h3 class="text-primary mb-4">
    <i class="bi bi-bar-chart-fill me-2"></i>Estadísticas del Material
  </h3>
  <div class="row g-4">
    <div class="col-md-3">
      <div class="stat-card">
        <div class="stat-number">6</div>
        <div class="stat-label">Archivos</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="stat-card">
        <div class="stat-number">5,100+</div>
        <div class="stat-label">Líneas</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="stat-card">
        <div class="stat-number">138</div>
        <div class="stat-label">Ejercicios</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="stat-card">
        <div class="stat-number">100%</div>
        <div class="stat-label">Completitud</div>
      </div>
    </div>
  </div>
</section>
```

**Tiempo:** 3 horas  
**Impacto:** Transformación visual completa de página principal

---

#### **3. Mejorar Dominio 1.1 - Textos Literarios**
**Archivo:** `evaluaciones/educacion-media/estudio/dossier-lenguaje-media/dominio-1-1-textos-literarios.njk`  
**Cambios:**

**a) Agregar breadcrumb mejorado al inicio:**
```html
<nav aria-label="breadcrumb" class="mb-4">
  <ol class="breadcrumb breadcrumb-premium mb-0">
    <li class="breadcrumb-item">
      <a href="/evaluaciones/"><i class="bi bi-house-door-fill me-1"></i>Evaluaciones</a>
    </li>
    <li class="breadcrumb-item">
      <a href="/evaluaciones/educacion-media/">Educación Media</a>
    </li>
    <li class="breadcrumb-item">
      <a href="/lenguaje-comunicacion-media/">Lenguaje Media</a>
    </li>
    <li class="breadcrumb-item active">
      <i class="bi bi-book-fill me-1"></i>Textos Literarios
    </li>
  </ol>
</nav>
```

**b) Convertir títulos de secciones con iconos:**
```html
<!-- ANTES -->
<h2 class="text-primary border-bottom pb-2 mb-4">Figuras Literarias Fónicas</h2>

<!-- DESPUÉS -->
<div class="d-flex align-items-center mb-4 pb-3 border-bottom border-primary border-3">
  <div class="me-3">
    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, var(--color-literario) 0%, #4a2c7d 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
      <i class="bi bi-music-note-beamed text-white fs-4"></i>
    </div>
  </div>
  <div>
    <h2 class="mb-0" style="color: var(--color-literario);">Figuras Literarias Fónicas</h2>
    <p class="text-muted small mb-0">Recursos basados en el sonido</p>
  </div>
</div>
```

**c) Mejorar acordeones de figuras literarias:**
```html
<div class="accordion accordion-premium" id="accordionFigurasFonicas">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#aliteracion">
        <span class="ejemplo-numero">1</span>
        <strong>Aliteración</strong>
        <span class="badge bg-info ms-auto me-3">Sonido</span>
      </button>
    </h2>
    <div id="aliteracion" class="accordion-collapse collapse show">
      <div class="accordion-body">
        <div class="alert alert-icon alert-info border-info">
          <i class="bi bi-info-circle-fill"></i>
          <div>
            <strong>Definición:</strong> Repetición de sonidos consonánticos al inicio o dentro de palabras cercanas...
          </div>
        </div>
        
        <div class="ejemplo-box mt-3">
          <h6 class="fw-bold mb-3">
            <i class="bi bi-quote me-2"></i>Ejemplo 1: Pablo Neruda
          </h6>
          <blockquote class="fst-italic mb-2">
            "El viento de la noche <mark>gira</mark> en el cielo y canta"
          </blockquote>
          <p class="small text-muted mb-0">
            <i class="bi bi-arrow-right me-2"></i>Análisis: Repetición del sonido /g/ y /r/ genera musicalidad...
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
```

**d) Mejorar tablas de narradores:**
```html
<table class="table table-premium table-hover">
  <thead>
    <tr>
      <th width="30%">
        <i class="bi bi-person-fill me-2"></i>Tipo de Narrador
      </th>
      <th width="40%">
        <i class="bi bi-chat-quote me-2"></i>Características
      </th>
      <th width="30%">
        <i class="bi bi-book me-2"></i>Ejemplo
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="badge bg-primary">Protagonista</span></td>
      <td>1ª persona, cuenta su propia historia...</td>
      <td class="fst-italic">"Yo nací en Santiago..."</td>
    </tr>
    <!-- más filas -->
  </tbody>
</table>
```

**Tiempo:** 4 horas  
**Impacto:** Transformación visual del archivo más extenso (1,236 líneas)

---

#### **4. Mejorar Dominio 1.2 - Textos No Literarios**
**Archivo:** `evaluaciones/educacion-media/estudio/dossier-lenguaje-media/dominio-1-2-textos-no-literarios.njk`  
**Cambios similares:**

**a) Header con iconografía:**
```html
<div class="section-header text-center shadow-lg mb-5">
  <h1 class="display-4 fw-bold mb-3">
    <i class="bi bi-newspaper me-3"></i>Textos No Literarios
  </h1>
  <p class="lead opacity-75">
    Argumentación, discurso público y medios de comunicación
  </p>
  <div class="mt-3">
    <span class="badge bg-light text-primary badge-xl me-2">
      <i class="bi bi-file-text me-1"></i>1,412 líneas
    </span>
    <span class="badge bg-light text-primary badge-xl">
      <i class="bi bi-pencil-square me-1"></i>28 ejercicios
    </span>
  </div>
</div>
```

**b) Tablas de argumentos estilizadas:**
```html
<table class="table table-premium">
  <thead>
    <tr>
      <th colspan="2" class="text-center">
        <i class="bi bi-diagram-3-fill me-2"></i>15 Tipos de Argumentos Clasificados
      </th>
    </tr>
  </thead>
  <tbody>
    <tr class="table-info">
      <td colspan="2" class="fw-bold">
        <i class="bi bi-bar-chart-fill me-2"></i>Basados en Datos y Hechos
      </td>
    </tr>
    <tr>
      <td width="30%">
        <span class="badge bg-info">Ejemplificación</span>
      </td>
      <td>Casos concretos que ilustran un punto general...</td>
    </tr>
    <!-- más filas -->
  </tbody>
</table>
```

**Tiempo:** 3 horas  
**Impacto:** Archivo intermedio (1,412 líneas)

---

#### **5. Mejorar Casos de Discurso Público Chile**
**Archivo:** `evaluaciones/educacion-media/estudio/dossier-lenguaje-media/casos-discurso-publico-chile.njk`  
**Cambios:**

**a) Cards diferenciadas por tipo de discurso:**
```html
<!-- Discurso Presidencial -->
<div class="card card-premium mb-4" style="border-left: 4px solid #28a745;">
  <div class="card-header" style="background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%); color: white;">
    <div class="d-flex justify-content-between align-items-center">
      <h2 class="mb-0 h4">
        <i class="bi bi-megaphone-fill me-2"></i>Caso 1: Discurso Presidencial
      </h2>
      <span class="badge bg-light text-dark">21 de Mayo</span>
    </div>
  </div>
  <div class="card-body p-4">
    <!-- contenido -->
  </div>
</div>

<!-- Discurso Conmemorativo -->
<div class="card card-premium mb-4" style="border-left: 4px solid #dc3545;">
  <div class="card-header" style="background: linear-gradient(135deg, #dc3545 0%, #a71d2a 100%); color: white;">
    <div class="d-flex justify-content-between align-items-center">
      <h2 class="mb-0 h4">
        <i class="bi bi-peace me-2"></i>Caso 2: Discurso Conmemorativo
      </h2>
      <span class="badge bg-light text-dark">11 de Septiembre</span>
    </div>
  </div>
  <div class="card-body p-4">
    <!-- contenido -->
  </div>
</div>

<!-- Discurso Académico -->
<div class="card card-premium mb-4" style="border-left: 4px solid #0d6efd;">
  <div class="card-header" style="background: linear-gradient(135deg, #0d6efd 0%, #084298 100%); color: white;">
    <div class="d-flex justify-content-between align-items-center">
      <h2 class="mb-0 h4">
        <i class="bi bi-mortarboard-fill me-2"></i>Caso 3: Discurso Académico
      </h2>
      <span class="badge bg-light text-dark">Academia Chilena</span>
    </div>
  </div>
  <div class="card-body p-4">
    <!-- contenido -->
  </div>
</div>
```

**b) Ejercicios con diseño distintivo:**
```html
<div class="alert alert-warning alert-icon border-warning shadow-sm mb-3">
  <i class="bi bi-question-circle-fill"></i>
  <div>
    <p class="fw-bold mb-2">1. ¿Cuál es la finalidad comunicativa principal del discurso presidencial?</p>
    <div class="ms-4">
      <div class="form-check">
        <input class="form-check-input" type="radio" name="p1" id="p1a">
        <label class="form-check-label" for="p1a">
          A) Entretener a la audiencia con anécdotas personales
        </label>
      </div>
      <!-- más opciones -->
    </div>
    <details class="mt-3">
      <summary class="btn btn-sm btn-outline-success">
        <i class="bi bi-lightbulb me-1"></i>Ver respuesta
      </summary>
      <div class="alert alert-success mt-2 mb-0">
        <strong>Respuesta correcta: B</strong><br>
        El discurso presidencial tiene doble finalidad...
      </div>
    </details>
  </div>
</div>
```

**Tiempo:** 2 horas  
**Impacto:** Archivo nuevo con casos de estudio (550 líneas)

---

### 🟡 **FASE 2: COMPONENTES INTERACTIVOS (Prioridad Alta)**

#### **6. Crear índice flotante de navegación**
**Implementación:** JavaScript para scroll spy
```html
<div class="sticky-top" style="top: 80px; z-index: 100;">
  <div class="card card-premium">
    <div class="card-header bg-primary text-white">
      <h6 class="mb-0">
        <i class="bi bi-list-ul me-2"></i>Índice de Contenidos
      </h6>
    </div>
    <div class="card-body p-0">
      <nav class="nav flex-column">
        <a class="nav-link active" href="#figuras-fonicas">
          <i class="bi bi-chevron-right me-1"></i>Figuras Fónicas
        </a>
        <a class="nav-link" href="#figuras-sintacticas">
          <i class="bi bi-chevron-right me-1"></i>Figuras Sintácticas
        </a>
        <!-- más links -->
      </nav>
    </div>
  </div>
</div>
```
**Tiempo:** 2 horas  
**Impacto:** Mejora navegación en archivos extensos

---

#### **7. Agregar progress bar de lectura**
**Implementación:** JavaScript para tracking de scroll
```html
<div class="progress-reading" style="position: fixed; top: 0; left: 0; width: 0%; height: 4px; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); z-index: 9999; transition: width 0.2s;"></div>

<script>
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.querySelector('.progress-reading').style.width = scrolled + '%';
});
</script>
```
**Tiempo:** 1 hora  
**Impacto:** Feedback visual de progreso

---

#### **8. Tooltips para términos técnicos**
**Implementación:** Bootstrap 5 tooltips
```html
<span data-bs-toggle="tooltip" data-bs-placement="top" 
      title="Repetición de sonidos consonánticos para crear efecto sonoro">
  aliteración
</span>

<script>
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})
</script>
```
**Tiempo:** 2 horas  
**Impacto:** Ayuda contextual inmediata

---

#### **9. Modal de visualización de ejemplos**
**Implementación:** Modals Bootstrap para ejemplos literarios completos
```html
<button class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalNeruda">
  <i class="bi bi-eye me-1"></i>Ver análisis completo
</button>

<div class="modal fade" id="modalNeruda" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header bg-primary text-white">
        <h5 class="modal-title">
          <i class="bi bi-book me-2"></i>Análisis: "Poema 20" - Pablo Neruda
        </h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <!-- análisis completo con anotaciones -->
      </div>
    </div>
  </div>
</div>
```
**Tiempo:** 3 horas  
**Impacto:** Análisis profundos sin saturar página principal

---

#### **10. Filtros interactivos de ejercicios**
**Implementación:** JavaScript para filtrado por nivel
```html
<div class="btn-group mb-3" role="group">
  <button type="button" class="btn btn-outline-primary" data-filter="basico">
    <i class="bi bi-star me-1"></i>Básico
  </button>
  <button type="button" class="btn btn-outline-primary" data-filter="intermedio">
    <i class="bi bi-star-fill me-1"></i>Intermedio
  </button>
  <button type="button" class="btn btn-outline-primary" data-filter="avanzado">
    <i class="bi bi-star-fill me-1"></i><i class="bi bi-star-fill"></i>Avanzado
  </button>
</div>

<div class="ejercicio" data-nivel="basico">...</div>
<div class="ejercicio" data-nivel="intermedio">...</div>
```
**Tiempo:** 2 horas  
**Impacto:** Personalización de práctica

---

### 🟢 **FASE 3: OPTIMIZACIÓN Y PULIDO (Prioridad Media)**

#### **11. Optimizar imágenes y assets**
- Comprimir iconos SVG
- Lazy loading de imágenes
- WebP format para screenshots
**Tiempo:** 1 hora

#### **12. Implementar dark mode toggle**
- Variables CSS para tema oscuro
- Switch en navbar
- LocalStorage para preferencia
**Tiempo:** 3 horas

#### **13. Agregar animaciones sutiles**
- Fade-in al hacer scroll
- Slide-in para cards
- Bounce para badges
**Tiempo:** 2 horas

#### **14. Mejorar impresión/PDF**
- Media query @print
- Ocultar elementos interactivos
- Ajustar márgenes
**Tiempo:** 1 hora

#### **15. Accesibilidad WCAG 2.1**
- Contraste de colores AA
- Alt text en iconos
- ARIA labels
- Navegación por teclado
**Tiempo:** 2 horas

---

## 📊 RESUMEN DE IMPACTO

| Fase | Items | Tiempo Total | Impacto Visual |
|------|-------|--------------|----------------|
| **Fase 1: Base** | 5 tareas | 14 horas | ⭐⭐⭐⭐⭐ Crítico |
| **Fase 2: Interactivos** | 5 tareas | 10 horas | ⭐⭐⭐⭐ Alto |
| **Fase 3: Pulido** | 5 tareas | 9 horas | ⭐⭐⭐ Medio |
| **TOTAL** | **15 tareas** | **33 horas** | **100%** |

---

## 🎯 PRIORIZACIÓN RECOMENDADA

### **Sprint 1 (8 horas) - Máximo impacto:**
1. ✅ Crear CSS personalizado (2h)
2. ✅ Actualizar index.njk (3h)
3. ✅ Mejorar Dominio 1.1 (3h parcial)

### **Sprint 2 (8 horas) - Completar dominios:**
4. ✅ Terminar Dominio 1.1 (1h restante)
5. ✅ Mejorar Dominio 1.2 (3h)
6. ✅ Mejorar Casos Discurso Público (2h)
7. ✅ Mejorar Dominios 2.1, 2.2, 3 (2h)

### **Sprint 3 (8 horas) - Interactividad:**
8. ✅ Índice flotante (2h)
9. ✅ Progress bar (1h)
10. ✅ Tooltips (2h)
11. ✅ Modals (3h)

### **Sprint 4 (9 horas) - Pulido final:**
12. ✅ Filtros interactivos (2h)
13. ✅ Dark mode (3h)
14. ✅ Animaciones (2h)
15. ✅ Accesibilidad (2h)

---

## 📝 CHECKLIST DE IMPLEMENTACIÓN

- [ ] **Fase 1 completada** - Sistema de diseño base operativo
- [ ] **Fase 2 completada** - Componentes interactivos funcionando
- [ ] **Fase 3 completada** - Optimización y accesibilidad verificada
- [ ] **Testing cross-browser** - Chrome, Firefox, Safari, Edge
- [ ] **Testing responsive** - Mobile (320px), Tablet (768px), Desktop (1920px)
- [ ] **Performance audit** - Lighthouse score >90
- [ ] **Accesibilidad audit** - WAVE/axe sin errores críticos
- [ ] **Deploy en staging** - Verificación en entorno de prueba
- [ ] **Feedback usuarios** - Ajustes basados en testing real
- [ ] **Deploy producción** - Publicación final

---

## 🚀 RESULTADO ESPERADO

Al completar este plan, el dossier de Lenguaje Media tendrá:

✅ **Diseño profesional** al nivel de Matemática Media  
✅ **Navegación intuitiva** con índices y breadcrumbs  
✅ **Componentes interactivos** (tooltips, modals, filtros)  
✅ **Experiencia premium** con animaciones y gradients  
✅ **Accesibilidad completa** WCAG 2.1 AA  
✅ **Responsive design** perfecto en todos los dispositivos  
✅ **Performance optimizado** con lazy loading y compresión  
✅ **Coherencia visual** con paleta de colores y tipografía profesional  

**Meta final:** Convertir el dossier de Lenguaje Media en **referencia visual** para el resto de evaluaciones ECEP.
