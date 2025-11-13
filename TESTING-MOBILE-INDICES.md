# 📱 Testing Mobile - Índices Rediseñados

## ✅ Puntos de Verificación

### 🎯 **Breakpoints Implementados**
- **Mobile**: `375px` (iPhone SE) → 1 columna
- **Tablet**: `768px` (iPad) → 2 columnas
- **Desktop**: `1024px+` → 3 columnas

---

## 📄 **Páginas a Testear**

### 1. `/evaluaciones/educacion-media/`
**6 Tarjetas**:
- 🧮 Matemática
- 📖 Lengua y Literatura
- 🌍 Historia y Geografía
- 🔬 Ciencias Naturales (deshabilitado)
- 🗣️ Inglés (deshabilitado)
- ⚽ Ed. Física y Salud

### 2. `/evaluaciones/educacion-basica/`
**5 Tarjetas**:
- 📖 Lenguaje y Comunicación
- 🧮 Matemática
- ✝️ Religión Católica
- ⚽ Ed. Física y Salud
- 📚 Básica Generalista

---

## 🔍 **Checklist de Testing**

### **Mobile (375px - iPhone SE)**
- [ ] Grid muestra 1 columna
- [ ] Tarjetas ocupan todo el ancho (no se cortan)
- [ ] Botones táctiles mínimo 44px altura (py-3 = 12px top + 12px bottom + contenido)
- [ ] Texto títulos legible (h3 = text-2xl = 24px) ✅
- [ ] Texto features legible (text-sm = 14px) ✅
- [ ] Iconos emoji visibles (text-5xl = 48px) ✅
- [ ] Sin scroll horizontal
- [ ] Espaciado entre tarjetas adecuado (gap-6 = 1.5rem)
- [ ] Botón "Volver" visible y funcional
- [ ] Header centrado y legible

### **Tablet (768px - iPad)**
- [ ] Grid muestra 2 columnas
- [ ] Tarjetas alineadas correctamente
- [ ] Espaciado proporcional
- [ ] Botones accesibles con touch
- [ ] Sin desbordamiento horizontal

### **Desktop (1440px)**
- [ ] Grid muestra 3 columnas
- [ ] Tarjetas centradas con max-w-7xl
- [ ] Hover effects funcionan
- [ ] Shadow transitions suaves
- [ ] Distribución visual equilibrada

---

## 🎨 **Elementos de Diseño Verificados**

### **Botones** (Target 44x44px)
```css
py-3 px-4    → padding: 0.75rem 1rem (12px 16px)
text-sm      → font-size: 14px
line-height  → Default ~1.5 (21px)
Total height → 12 + 21 + 12 = 45px ✅
```

### **Texto**
```css
H1: text-5xl md:text-6xl → 48px / 60px ✅
H3: text-2xl             → 24px ✅
Features: text-sm        → 14px ✅
Emoji: text-5xl          → 48px ✅
```

### **Colores por Asignatura**
| Asignatura | Gradiente |
|------------|-----------|
| Matemática | blue-500 → indigo-600 |
| Lengua     | purple-500 → pink-600 |
| Historia   | amber-500 → orange-600 |
| Ciencias   | green-500 → teal-600 |
| Inglés     | red-500 → rose-600 |
| Ed. Física | pink-500 → red-600 |
| Religión   | amber-500 → yellow-600 |
| Generalista| teal-500 → cyan-600 |

---

## 🚀 **Cómo Testear**

### **Opción 1: DevTools Chrome**
1. F12 → Toggle device toolbar (Ctrl+Shift+M)
2. Seleccionar:
   - iPhone SE (375x667)
   - iPad (768x1024)
   - Responsive (ajustar a 1440px)
3. Verificar cada breakpoint

### **Opción 2: URL en Producción**
```
https://www.profefranciscopancho.com/evaluaciones/educacion-media/
https://www.profefranciscopancho.com/evaluaciones/educacion-basica/
```

### **Opción 3: Local**
```bash
cd "C:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog"
npx @11ty/eleventy --serve
# Abrir: http://localhost:8080/evaluaciones/educacion-media/
```

---

## ✅ **Resultados Esperados**

### **Mobile (375px)**
```
┌─────────────────┐
│  [Tarjeta 1]    │
├─────────────────┤
│  [Tarjeta 2]    │
├─────────────────┤
│  [Tarjeta 3]    │
└─────────────────┘
```

### **Tablet (768px)**
```
┌────────────┬────────────┐
│ [Tarjeta 1]│ [Tarjeta 2]│
├────────────┼────────────┤
│ [Tarjeta 3]│ [Tarjeta 4]│
└────────────┴────────────┘
```

### **Desktop (1440px)**
```
┌─────────┬─────────┬─────────┐
│[Tarjeta]│[Tarjeta]│[Tarjeta]│
├─────────┼─────────┼─────────┤
│[Tarjeta]│[Tarjeta]│[Tarjeta]│
└─────────┴─────────┴─────────┘
```

---

## 🐛 **Posibles Problemas a Detectar**

- ❌ Tarjetas cortadas en horizontal
- ❌ Botones superpuestos
- ❌ Texto muy pequeño (<14px)
- ❌ Emojis no se ven
- ❌ Gradientes rotos
- ❌ Scroll horizontal innecesario
- ❌ Touch targets <44px
- ❌ Spacing inconsistente

---

## 📊 **Estado del Testing**

### Ed. Media
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1440px)

### Ed. Básica
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1440px)

---

**Última actualización**: 2025-11-13
**Commits relacionados**: 
- `473cb4c` - Ed. Media redesign
- `6911aaa` - Ed. Básica redesign
