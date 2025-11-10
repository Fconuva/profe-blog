# 📊 PLAN DE MEJORAS VISUALES - DOMINIOS LENGUAJE MEDIA

**Fecha:** 9 de Noviembre 2025  
**Objetivo:** Transformar 3 dominios clave de Lenguaje Media en recursos altamente visuales, descriptivos y didácticos  
**Nivel de referencia:** Matemática Media (estándar de calidad visual)

---

## 🎯 RESUMEN EJECUTIVO

### Dominios a mejorar:
1. **Dominio 1.2 - Textos No Literarios** (15% evaluación)
2. **Dominio 2.1 - Coherencia y Cohesión** (20% evaluación)
3. **Dominio 2.2 - Adecuación Comunicativa** (25% evaluación)

### Estado actual:
- ✅ Contenido completo y bien estructurado
- ❌ Falta de elementos visuales (imágenes, infografías, diagramas)
- ❌ Explicaciones muy textuales
- ❌ Pocos ejemplos visuales interactivos
- ❌ Sin gráficos comparativos

### Objetivo final:
Transformar cada dominio en un recurso **premium visual** con:
- 🎨 Infografías profesionales
- 📊 Gráficos y diagramas explicativos
- 🖼️ Imágenes conceptuales
- 🎯 Ejemplos visuales paso a paso
- 📈 Esquemas comparativos
- 🔄 Elementos interactivos (acordeones visuales, tabs, tooltips)

---

## 📋 DOMINIO 1.2: TEXTOS NO LITERARIOS

### 🎨 Mejoras visuales propuestas:

#### **1.1 Situación de Enunciación**
**Actual:** Tabla simple de elementos comunicativos  
**Mejora:**
- [ ] **Infografía circular** tipo "Communication Wheel" con 6 segmentos (Emisor, Receptor, Mensaje, Canal, Código, Contexto)
- [ ] **Diagrama de flujo** mostrando el proceso comunicativo con iconos
- [ ] **Ejemplo visual** de noticia real con elementos señalados (colores diferentes para cada componente)
- [ ] **Comparativa visual:** 3 columnas (Noticia / Editorial / Columna de opinión) con características resaltadas

**Código Bootstrap sugerido:**
```html
<!-- Círculo interactivo de elementos comunicativos -->
<div class="row text-center">
  <div class="col-md-4 mb-3">
    <div class="card border-success h-100 hover-lift">
      <div class="card-body">
        <i class="bi bi-person-circle text-success" style="font-size: 3rem;"></i>
        <h5 class="mt-3">Emisor</h5>
        <p class="small">Periodista + Medio</p>
      </div>
    </div>
  </div>
  <!-- Repetir para cada elemento -->
</div>
```

#### **1.2 Discurso Argumentativo**
**Actual:** Lista de definiciones  
**Mejora:**
- [ ] **Pirámide argumentativa visual** (Tesis → Argumentos → Conclusión)
- [ ] **Infografía de estructura:** Base, desarrollo, cierre con iconos
- [ ] **Mapa conceptual** de tipos de argumentos (con ramificaciones)
- [ ] **Ejemplo de ensayo argumentativo** con código de colores:
  - 🟦 Azul: Tesis
  - 🟩 Verde: Argumentos
  - 🟨 Amarillo: Contraargumentos
  - 🟥 Rojo: Conclusión

**Elementos visuales:**
```html
<!-- Pirámide de estructura argumentativa -->
<div class="pyramid-container">
  <div class="pyramid-level level-1 bg-primary text-white p-3 text-center">
    <strong>TESIS</strong><br>
    <small>Postura clara y defendible</small>
  </div>
  <div class="pyramid-level level-2 bg-info text-white p-3 text-center">
    <strong>ARGUMENTOS</strong><br>
    <small>3-5 razones con evidencia</small>
  </div>
  <div class="pyramid-level level-3 bg-secondary text-white p-3 text-center">
    <strong>CONCLUSIÓN</strong><br>
    <small>Reafirmación + cierre</small>
  </div>
</div>
```

#### **1.3 Tipos de Argumentos**
**Actual:** Tabla con tipos  
**Mejora:**
- [ ] **Cards visuales** con iconos únicos para cada tipo
- [ ] **Infografía comparativa:** "Fuerza del argumento" (escala visual)
- [ ] **Ejemplos visuales:** Diálogos en bocadillos de cómic
- [ ] **Gráfico de radar:** Comparar argumentos por categorías (lógico, emocional, autoridad)

**Tipos de argumentos a ilustrar:**
1. 🎓 **Por Autoridad** → Ícono: Diploma/Experto
2. 📊 **Por Datos** → Ícono: Gráfico de barras
3. 🤝 **Por Ejemplificación** → Ícono: Casos reales
4. ❤️ **Por Emoción** → Ícono: Corazón
5. 📐 **Por Analogía** → Ícono: Comparación A/B
6. ⚖️ **Por Causa-Efecto** → Ícono: Flechas enlazadas

#### **1.4 Falacias Argumentativas**
**Actual:** Lista textual  
**Mejora:**
- [ ] **Tarjetas interactivas** con ejemplos (flip cards)
- [ ] **Infografía "Las 10 falacias más comunes"** tipo póster educativo
- [ ] **Ejemplos visuales tipo cómic:** Diálogos mostrando la falacia
- [ ] **Quiz visual interactivo:** "¿Es válido este argumento?"

**Falacias a ilustrar:**
1. 🔴 Ad Hominem → Ataque personal (ícono: persona tachada)
2. 🍎🍊 Falsa Analogía → Comparación inválida
3. 🔄 Círculo Vicioso → Argumento circular
4. 🎯 Hombre de Paja → Distorsión del argumento
5. ⚫⚪ Falso Dilema → Solo dos opciones

#### **1.5 Discurso Público**
**Actual:** Tabla de características  
**Mejora:**
- [ ] **Timeline visual:** Evolución del discurso público (Grecia → Actualidad)
- [ ] **Infografía de estructura:** Introducción, desarrollo, conclusión con % de tiempo
- [ ] **Video embebido:** Análisis de discurso de MLK "I Have a Dream"
- [ ] **Checklist visual:** Elementos de un buen discurso público
- [ ] **Comparativa:** Discurso político vs. académico vs. ceremonial

#### **1.6 Medios de Comunicación**
**Actual:** Texto descriptivo  
**Mejora:**
- [ ] **Infografía tipo periódico:** Secciones de un diario con etiquetas
- [ ] **Comparativa visual:** Prensa vs. TV vs. Radio vs. Digital
- [ ] **Diagrama de flujo:** Cómo se produce una noticia (6 pasos)
- [ ] **Galería de géneros periodísticos:** Cards con ejemplos reales
  - Noticia
  - Reportaje
  - Entrevista
  - Crónica
  - Editorial
  - Columna de opinión

---

## 🔗 DOMINIO 2.1: COHERENCIA Y COHESIÓN

### 🎨 Mejoras visuales propuestas:

#### **2.1.1 Mecanismos de Correferencia**
**Actual:** Tablas con ejemplos textuales  
**Mejora:**
- [ ] **Diagrama de flechas:** Conectar referentes con sus pronombres (visual)
- [ ] **Infografía "El viaje de la referencia":** Seguir un sustantivo a través de un párrafo
- [ ] **Mapa conceptual:** Tipos de correferencia (Anáfora, Catáfora, Elipsis)
- [ ] **Ejemplos con código de colores:**
  - 🟦 Azul: Sustantivo original
  - 🟩 Verde: Pronombre anafórico
  - 🟨 Amarillo: Sustitución léxica
  - 🟥 Rojo: Elipsis (elemento omitido)

**Ejemplo visual:**
```html
<div class="card mb-4">
  <div class="card-body">
    <p class="lead">Ejemplo de Anáfora:</p>
    <p class="fs-5">
      <span class="badge bg-primary">María</span> llegó tarde. 
      <span class="badge bg-success">Ella</span> se disculpó con todos.
    </p>
    <div class="text-center">
      <i class="bi bi-arrow-down text-primary" style="font-size: 2rem;"></i>
      <p class="text-muted small">María = Ella (Correferencia anafórica)</p>
    </div>
  </div>
</div>
```

#### **2.1.2 Conectores Textuales**
**Actual:** Lista de conectores por categoría  
**Mejora:**
- [ ] **Tabla visual interactiva:** Conectores con iconos y colores por función
  - ➕ **Aditivos** (además, también) → Verde
  - ⚡ **Causales** (porque, ya que) → Amarillo
  - 📊 **Consecutivos** (por lo tanto, así que) → Naranja
  - 🔄 **Adversativos** (pero, sin embargo) → Rojo
  - ⏱️ **Temporales** (luego, después) → Azul
  - 📌 **De orden** (primero, finalmente) → Morado
  
- [ ] **Infografía de uso:** "Cómo elegir el conector correcto" (diagrama de decisión)
- [ ] **Ejercicio visual:** Párrafo con espacios en blanco + banco de conectores
- [ ] **Gráfico circular:** Frecuencia de uso de conectores en textos académicos

**Tabla visual de conectores:**
```html
<div class="table-responsive">
  <table class="table table-hover">
    <thead class="table-primary">
      <tr>
        <th>Función</th>
        <th>Conectores</th>
        <th>Ejemplo</th>
        <th>Icono</th>
      </tr>
    </thead>
    <tbody>
      <tr class="table-success">
        <td><strong>Aditivos</strong></td>
        <td>además, también, asimismo, igualmente</td>
        <td>"Me gusta leer, <strong>además</strong> escribo poesía."</td>
        <td><i class="bi bi-plus-circle-fill text-success"></i></td>
      </tr>
      <!-- Repetir para cada tipo -->
    </tbody>
  </table>
</div>
```

#### **2.1.3 Progresión Temática**
**Actual:** Explicación textual  
**Mejora:**
- [ ] **Diagrama de flujo visual:** 3 tipos de progresión
  1. **Lineal** → Tema 1 → Rema 1 se convierte en Tema 2 → Rema 2...
  2. **De tema constante** → Tema único → Remas diferentes
  3. **De temas derivados** → Hipertema → Temas secundarios
  
- [ ] **Infografía comparativa:** 3 columnas con ejemplos visuales
- [ ] **Ejemplo de texto marcado:** Resaltar tema y rema con colores
- [ ] **Quiz interactivo:** Identificar tipo de progresión en párrafos

**Diagrama de progresión lineal:**
```html
<div class="progression-diagram">
  <div class="d-flex align-items-center justify-content-between mb-3">
    <div class="progression-box bg-primary text-white p-3 rounded">
      <strong>TEMA 1:</strong> El perro
    </div>
    <i class="bi bi-arrow-right" style="font-size: 2rem;"></i>
    <div class="progression-box bg-info text-white p-3 rounded">
      <strong>REMA 1:</strong> ladró fuerte
    </div>
  </div>
  <div class="d-flex align-items-center justify-content-between">
    <div class="progression-box bg-primary text-white p-3 rounded">
      <strong>TEMA 2:</strong> El ladrido
    </div>
    <i class="bi bi-arrow-right" style="font-size: 2rem;"></i>
    <div class="progression-box bg-info text-white p-3 rounded">
      <strong>REMA 2:</strong> despertó a todos
    </div>
  </div>
</div>
```

#### **2.1.4 Oraciones Coordinadas y Subordinadas**
**Actual:** Definiciones y ejemplos  
**Mejora:**
- [ ] **Árbol sintáctico visual:** Diagrama de relaciones entre oraciones
- [ ] **Infografía comparativa:** Coordinadas vs. Subordinadas
- [ ] **Cards interactivas:** Click para ver análisis sintáctico
- [ ] **Tabla de nexos:** Con colores según tipo de relación
- [ ] **Ejemplos visuales:** Oraciones desglosadas con flechas y cajas

**Árbol de oración compuesta:**
```html
<div class="syntax-tree">
  <div class="main-clause bg-primary text-white p-3 text-center rounded">
    ORACIÓN PRINCIPAL<br>
    "María estudia"
  </div>
  <div class="connector text-center my-2">
    <i class="bi bi-arrow-down-short" style="font-size: 2rem;"></i>
    <span class="badge bg-warning">PORQUE</span>
  </div>
  <div class="sub-clause bg-secondary text-white p-3 text-center rounded">
    ORACIÓN SUBORDINADA<br>
    "quiere aprobar"
  </div>
</div>
```

---

## ✍️ DOMINIO 2.2: ADECUACIÓN COMUNICATIVA

### 🎨 Mejoras visuales propuestas:

#### **2.2.1 Modalización del Discurso**
**Actual:** Tabla de tipos  
**Mejora:**
- [ ] **Infografía "El termómetro de certeza":** Escala visual de modalización epistémica
  - 🔴 Definitivamente (100% certeza)
  - 🟠 Probablemente (75% certeza)
  - 🟡 Posiblemente (50% certeza)
  - 🟢 Tal vez (25% certeza)
  - 🔵 Quizás (10% certeza)

- [ ] **Cards visuales por tipo de modalización:**
  1. **Epistémica** → Ícono: Cerebro pensante
  2. **Deóntica** → Ícono: Señal de obligación
  3. **Apreciativa** → Ícono: Estrella de valoración
  4. **Volitiva** → Ícono: Corazón de deseo

- [ ] **Comparativa visual:** Textos objetivos vs. subjetivos (destacar marcas)
- [ ] **Ejercicio interactivo:** "Identifica la modalización" con colores

**Termómetro visual:**
```html
<div class="modalization-scale">
  <div class="scale-item bg-danger text-white p-3 mb-2 rounded">
    <strong>100%</strong> - Sin duda, definitivamente, ciertamente
  </div>
  <div class="scale-item bg-warning p-3 mb-2 rounded">
    <strong>75%</strong> - Probablemente, es probable que
  </div>
  <div class="scale-item bg-info text-white p-3 mb-2 rounded">
    <strong>50%</strong> - Posiblemente, puede que
  </div>
  <div class="scale-item bg-primary text-white p-3 mb-2 rounded">
    <strong>25%</strong> - Tal vez, quizás
  </div>
</div>
```

#### **2.2.2 Ortografía Literal (b/v, c/s/z, g/j, h)**
**Actual:** Listas de reglas  
**Mejora:**
- [ ] **Infografías por letra:** Una infografía visual para cada par conflictivo
  - **B/V:** Árbol de decisión con ejemplos
  - **C/S/Z:** Mapa de regiones (seseo/ceceo) + reglas
  - **G/J:** Tabla visual con terminaciones
  - **H:** Lista de palabras homófonas visuales

- [ ] **Mnemotecnias visuales:** Ilustraciones para recordar reglas
  - Ejemplo: "**B**urro con **B**ota" (se escribe con B)
  
- [ ] **Quiz visual interactivo:** "Completa la palabra" con retroalimentación
- [ ] **Flashcards animadas:** Voltear para ver la regla
- [ ] **Galería de errores comunes:** Con corrección visual

**Infografía B/V:**
```html
<div class="row">
  <div class="col-md-6">
    <div class="card border-primary h-100">
      <div class="card-header bg-primary text-white">
        <h5><i class="bi bi-check-circle"></i> Se escribe con B</h5>
      </div>
      <div class="card-body">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">✓ Terminaciones -bir (escribir, recibir)</li>
          <li class="list-group-item">✓ Prefijo bi- (bicicleta, bilateral)</li>
          <li class="list-group-item">✓ Después de m (cambio, tambor)</li>
          <li class="list-group-item">✓ Pretérito -aba (cantaba, jugaba)</li>
        </ul>
      </div>
    </div>
  </div>
  <div class="col-md-6">
    <div class="card border-success h-100">
      <div class="card-header bg-success text-white">
        <h5><i class="bi bi-check-circle"></i> Se escribe con V</h5>
      </div>
      <div class="card-body">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">✓ Después de n (enviar, invitar)</li>
          <li class="list-group-item">✓ Adjetivos -ava, -ave, -avo (octava, suave)</li>
          <li class="list-group-item">✓ Pretérito -uve (estuve, anduve)</li>
          <li class="list-group-item">✓ Palabras con vice- (vicepresidente)</li>
        </ul>
      </div>
    </div>
  </div>
</div>
```

#### **2.2.3 Acentuación (General + Diacríticos RAE 2010)**
**Actual:** Tablas de reglas  
**Mejora:**
- [ ] **Infografía "El mapa de la tilde":** Esquema completo de acentuación
- [ ] **Pirámide de acentuación:**
  - Base: Agudas
  - Medio: Graves
  - Cima: Esdrújulas
  - Extra: Sobreesdrújulas

- [ ] **Tabla interactiva de diacríticos:** Hover para ver la diferencia
  - él/el, tú/tu, sí/si, más/mas, té/te, dé/de, sé/se, mí/mi

- [ ] **Ejemplos visuales con sílabas separadas:** Co-ra-ZÓN (aguda)
- [ ] **Quiz visual:** "¿Lleva tilde?" con feedback inmediato
- [ ] **Infografía de excepciones:** Casos especiales RAE 2010

**Tabla diacríticos visual:**
```html
<div class="table-responsive">
  <table class="table table-bordered table-hover">
    <thead class="table-warning">
      <tr>
        <th>CON TILDE</th>
        <th>Función</th>
        <th>Ejemplo</th>
        <th>SIN TILDE</th>
        <th>Función</th>
        <th>Ejemplo</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="fw-bold text-danger">él</td>
        <td>Pronombre personal</td>
        <td>"<strong>Él</strong> viene."</td>
        <td class="fw-bold text-primary">el</td>
        <td>Artículo</td>
        <td>"<strong>El</strong> libro."</td>
      </tr>
      <tr>
        <td class="fw-bold text-danger">tú</td>
        <td>Pronombre personal</td>
        <td>"<strong>Tú</strong> sabes."</td>
        <td class="fw-bold text-primary">tu</td>
        <td>Posesivo</td>
        <td>"<strong>Tu</strong> casa."</td>
      </tr>
      <!-- Continuar para todos los diacríticos -->
    </tbody>
  </table>
</div>
```

#### **2.2.4 Puntuación (Coma, Punto y Coma, Dos Puntos)**
**Actual:** Reglas textuales  
**Mejora:**
- [ ] **Infografía "La jerarquía de las pausas":** Escala visual
  - Coma (,) → Pausa breve → 1 segundo
  - Punto y coma (;) → Pausa media → 2 segundos
  - Punto (.) → Pausa larga → 3 segundos

- [ ] **Ejemplos visuales animados:** Texto con pausas marcadas
- [ ] **Comparativa:** Mismo texto con diferentes puntuaciones (cambia el significado)
  - Clásico: "No espere" vs. "No, espere"
  
- [ ] **Diagrama de decisión:** ¿Qué signo usar? (árbol de preguntas)
- [ ] **Casos especiales:** Coma vocativa, coma enumerativa, etc. (con iconos)
- [ ] **Quiz interactivo:** Colocar las comas correctamente

**Infografía de la coma:**
```html
<div class="row">
  <div class="col-md-4">
    <div class="card h-100 text-center">
      <div class="card-body">
        <i class="bi bi-pause-circle text-primary" style="font-size: 3rem;"></i>
        <h5 class="mt-3">Coma Enumerativa</h5>
        <p class="small">"Compré manzanas<strong>,</strong> peras<strong>,</strong> uvas y plátanos."</p>
        <span class="badge bg-primary">Separa elementos de una lista</span>
      </div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card h-100 text-center">
      <div class="card-body">
        <i class="bi bi-person-circle text-success" style="font-size: 3rem;"></i>
        <h5 class="mt-3">Coma Vocativa</h5>
        <p class="small">"María<strong>,</strong> ven aquí."</p>
        <span class="badge bg-success">Separa el nombre de la persona a quien se habla</span>
      </div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card h-100 text-center">
      <div class="card-body">
        <i class="bi bi-arrow-return-right text-warning" style="font-size: 3rem;"></i>
        <h5 class="mt-3">Coma Explicativa</h5>
        <p class="small">"Santiago<strong>,</strong> capital de Chile<strong>,</strong> es hermosa."</p>
        <span class="badge bg-warning">Encierra aclaraciones</span>
      </div>
    </div>
  </div>
</div>
```

---

## 🛠️ RECURSOS TÉCNICOS NECESARIOS

### Herramientas de diseño:
1. **Canva Pro** → Infografías y pósters
2. **Figma** → Diagramas y wireframes
3. **Draw.io** → Mapas conceptuales y árboles
4. **Chart.js** → Gráficos interactivos
5. **Bootstrap Icons** → Iconografía consistente
6. **Unsplash/Pexels** → Imágenes de stock

### Librerías JavaScript:
1. **AOS (Animate On Scroll)** → Animaciones al hacer scroll
2. **Chart.js** → Gráficos de barras, torta, radar
3. **Swiper.js** → Carruseles de ejemplos
4. **Tippy.js** → Tooltips explicativos
5. **Highlight.js** → Resaltado de texto en ejemplos

### CSS Custom:
```css
/* Pirámide visual */
.pyramid-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.pyramid-level {
  border-radius: 8px;
  transition: transform 0.3s;
}

.pyramid-level.level-1 { width: 80%; }
.pyramid-level.level-2 { width: 90%; }
.pyramid-level.level-3 { width: 100%; }

.pyramid-level:hover {
  transform: scale(1.05);
}

/* Diagrama de flujo */
.flow-diagram {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
}

.flow-box {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  min-width: 150px;
  text-align: center;
  transition: all 0.3s;
}

.flow-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.25);
}

/* Tarjetas flip */
.flip-card {
  perspective: 1000px;
  height: 300px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  padding: 2rem;
}

.flip-card-back {
  transform: rotateY(180deg);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

---

## 📊 CRONOGRAMA DE IMPLEMENTACIÓN

### Fase 1: Diseño de Infografías (Semana 1-2)
- [ ] Diseñar 15 infografías principales en Canva
- [ ] Crear 20 diagramas de flujo en Draw.io
- [ ] Preparar 10 gráficos con Chart.js
- [ ] Seleccionar 30 iconos de Bootstrap Icons

### Fase 2: Desarrollo HTML/CSS (Semana 3-4)
- [ ] Implementar Dominio 1.2 (Textos No Literarios)
- [ ] Implementar Dominio 2.1 (Coherencia y Cohesión)
- [ ] Implementar Dominio 2.2 (Adecuación Comunicativa)
- [ ] Añadir animaciones con AOS

### Fase 3: Contenido Interactivo (Semana 5)
- [ ] Crear 30 ejercicios interactivos
- [ ] Implementar quizzes con feedback visual
- [ ] Añadir tooltips explicativos
- [ ] Configurar carruseles de ejemplos

### Fase 4: Optimización y Testing (Semana 6)
- [ ] Optimizar imágenes (WebP, lazy loading)
- [ ] Testing responsive (móvil, tablet, desktop)
- [ ] Validar accesibilidad (WCAG 2.1)
- [ ] Performance audit (Lighthouse)

---

## 🎯 MÉTRICAS DE ÉXITO

### KPIs visuales:
1. **Engagement:** Tiempo promedio en página +50%
2. **Comprensión:** Tasa de aprobación en quizzes +30%
3. **Interacción:** Clicks en elementos interactivos +200%
4. **Retención:** Bounce rate -40%

### Checklist de calidad:
- [ ] Mínimo 5 elementos visuales por sección
- [ ] Máximo 3 párrafos consecutivos sin imagen/gráfico
- [ ] Todas las tablas convertidas a formatos visuales
- [ ] 100% de conceptos clave con infografía
- [ ] Responsive en todos los dispositivos
- [ ] Tiempo de carga < 3 segundos

---

## 📝 EJEMPLOS DE IMPLEMENTACIÓN

### Ejemplo 1: Card visual con ícono (Tipos de Argumentos)
```html
<div class="row g-4">
  <div class="col-md-4">
    <div class="card h-100 border-0 shadow-sm hover-lift">
      <div class="card-body text-center">
        <div class="icon-circle bg-primary-subtle mb-3 mx-auto" style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
          <i class="bi bi-mortarboard-fill text-primary" style="font-size: 2.5rem;"></i>
        </div>
        <h5 class="card-title fw-bold">Por Autoridad</h5>
        <p class="card-text small text-muted">
          Apela a la opinión de expertos o instituciones reconocidas.
        </p>
        <div class="alert alert-primary mb-0 small">
          <strong>Ejemplo:</strong> "Según la OMS, el ejercicio mejora la salud."
        </div>
      </div>
    </div>
  </div>
  <!-- Repetir para otros tipos -->
</div>
```

### Ejemplo 2: Timeline de Discurso Público
```html
<div class="timeline">
  <div class="timeline-item">
    <div class="timeline-marker bg-primary"></div>
    <div class="timeline-content card shadow-sm">
      <div class="card-body">
        <h6 class="card-subtitle text-muted">Grecia Antigua (500 a.C.)</h6>
        <h5 class="card-title">Retórica Clásica</h5>
        <p class="card-text small">
          Aristóteles define las bases: ethos, pathos, logos.
        </p>
      </div>
    </div>
  </div>
  <!-- Más eventos históricos -->
</div>
```

### Ejemplo 3: Quiz interactivo de Conectores
```html
<div class="quiz-container card shadow">
  <div class="card-header bg-gradient text-white">
    <h5><i class="bi bi-question-circle"></i> Quiz: Elige el conector correcto</h5>
  </div>
  <div class="card-body">
    <p class="lead">
      "Me gusta el fútbol, <span class="blank">_______</span> no soy muy bueno jugando."
    </p>
    <div class="btn-group-vertical w-100" role="group">
      <button type="button" class="btn btn-outline-primary text-start" onclick="checkAnswer(this, false)">
        <i class="bi bi-circle me-2"></i> además
      </button>
      <button type="button" class="btn btn-outline-primary text-start" onclick="checkAnswer(this, false)">
        <i class="bi bi-circle me-2"></i> por lo tanto
      </button>
      <button type="button" class="btn btn-outline-primary text-start" onclick="checkAnswer(this, true)">
        <i class="bi bi-circle me-2"></i> pero
      </button>
      <button type="button" class="btn btn-outline-primary text-start" onclick="checkAnswer(this, false)">
        <i class="bi bi-circle me-2"></i> luego
      </button>
    </div>
    <div id="feedback" class="mt-3"></div>
  </div>
</div>

<script>
function checkAnswer(btn, isCorrect) {
  const feedback = document.getElementById('feedback');
  if (isCorrect) {
    feedback.innerHTML = '<div class="alert alert-success"><i class="bi bi-check-circle"></i> ¡Correcto! "Pero" es un conector adversativo.</div>';
    btn.classList.add('btn-success');
  } else {
    feedback.innerHTML = '<div class="alert alert-danger"><i class="bi bi-x-circle"></i> Incorrecto. Intenta de nuevo.</div>';
    btn.classList.add('btn-danger');
  }
}
</script>
```

---

## 🎨 PALETA DE COLORES POR DOMINIO

### Dominio 1.2 - Textos No Literarios
- **Color principal:** `#198754` (Verde Bootstrap)
- **Gradiente:** `linear-gradient(135deg, #198754 0%, #0a3622 100%)`
- **Acento:** `#d1e7dd` (Verde claro)

### Dominio 2.1 - Coherencia y Cohesión
- **Color principal:** `#0d6efd` (Azul Bootstrap)
- **Gradiente:** `linear-gradient(135deg, #0d6efd 0%, #084298 100%)`
- **Acento:** `#cfe2ff` (Azul claro)

### Dominio 2.2 - Adecuación Comunicativa
- **Color principal:** `#ffc107` (Amarillo Bootstrap)
- **Gradiente:** `linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)`
- **Acento:** `#fff3cd` (Amarillo claro)

---

## 📚 REFERENCIAS DE ESTILO

### Inspiración visual:
1. **Khan Academy** → Explicaciones paso a paso con ilustraciones
2. **Duolingo** → Gamificación y feedback visual inmediato
3. **Crash Course** → Infografías dinámicas y coloridas
4. **Notion** → Cards limpias y organizadas
5. **Material Design** → Uso de elevación y sombras

### Estándares de diseño:
- **Tipografía:** Inter (cuerpo), Poppins (títulos)
- **Espaciado:** Sistema de 8px (múltiplos de 8)
- **Bordes:** Border-radius de 8px-16px
- **Sombras:** Box-shadow suaves (0 4px 12px rgba(0,0,0,0.12))
- **Animaciones:** Transiciones de 0.3s con ease-in-out

---

## ✅ CHECKLIST FINAL DE IMPLEMENTACIÓN

### Por cada sección:
- [ ] Header con ícono y badge de porcentaje
- [ ] Navegación interna visual (cards o tabs)
- [ ] Mínimo 3 infografías originales
- [ ] Mínimo 2 diagramas/gráficos
- [ ] Ejemplos con código de colores
- [ ] Tabla comparativa visual
- [ ] Quiz o ejercicio interactivo
- [ ] Cards con hover effects
- [ ] Responsive en móvil
- [ ] Optimización de imágenes

### Accesibilidad:
- [ ] Alt text en todas las imágenes
- [ ] Contraste de colores WCAG AA
- [ ] Navegación por teclado
- [ ] Tooltips con aria-labels
- [ ] Textos descriptivos en gráficos

---

## 🚀 PRÓXIMOS PASOS

1. **Aprobar plan** → Revisar y validar propuestas
2. **Priorizar elementos** → Definir qué implementar primero
3. **Crear mockups** → Diseñar 3-5 infografías de prueba
4. **Implementar piloto** → Elegir 1 sección para probar
5. **Iterar y escalar** → Aplicar feedback y expandir

---

**Fin del Plan de Mejoras Visuales**  
*Versión 1.0 - 9 de Noviembre 2025*
