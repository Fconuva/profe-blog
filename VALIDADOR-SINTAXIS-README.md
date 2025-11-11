# 🔍 Validador de Sintaxis JavaScript para archivos .njk

## 📖 Descripción

Este script valida la sintaxis JavaScript dentro de archivos Nunjucks (`.njk`) **ANTES** de hacer deploy, evitando errores en producción y ahorrando tiempo.

## 🚀 Uso

```bash
python validar-sintaxis-js.py <ruta-archivo.njk>
```

### Ejemplos:

```bash
# Validar prueba de Lengua
python validar-sintaxis-js.py evaluaciones/educacion-media/pruebas/lengua-literatura-media/index.njk

# Validar prueba de Matemática
python validar-sintaxis-js.py evaluaciones/educacion-media/pruebas/matematica-media/index.njk

# Validar prueba de Historia
python validar-sintaxis-js.py evaluaciones/educacion-media/pruebas/historia-geografia-media/index.njk
```

## ✅ Salida Exitosa

```
🔎 Validando JavaScript en: evaluaciones/educacion-media/pruebas/lengua-literatura-media/index.njk
------------------------------------------------------------
📊 Total de líneas JavaScript: 1084
✅ Sintaxis JavaScript CORRECTA en evaluaciones/educacion-media/pruebas/lengua-literatura-media/index.njk

✨ ¡Todo correcto! El archivo está listo para deploy.
```

## ❌ Salida con Error

```
🔎 Validando JavaScript en: evaluaciones/educacion-media/pruebas/lengua-literatura-media/index.njk
------------------------------------------------------------
📊 Total de líneas JavaScript: 1087

❌ ERROR DE SINTAXIS en evaluaciones/educacion-media/pruebas/lengua-literatura-media/index.njk:
============================================================
📍 Línea aproximada en el bloque <script>: 650

📄 Contexto del error:
     648 |     explicacion: "REGISTRO Y TONO..."
     649 |   },
>>>  650 |     correcta: 0,
     651 |     explicacion: "Modalización epistémica..."
     652 |   },
     653 |   {

🔍 Error completo de Node.js:
SyntaxError: Unexpected token ':'
    at wrapSafe (node:internal/modules/cjs/loader:1620:18)
============================================================

⚠️  Corrige los errores antes de hacer deploy.
```

## 🛠️ Errores Comunes Detectados

### 1. Comillas mixtas en HTML
```javascript
// ❌ INCORRECTO
<p class='text-sm">"Texto"</p>  // comilla simple + doble

// ✅ CORRECTO
<p class='text-sm'>Texto</p>    // consistente
```

### 2. Falta propiedad `enunciado:`
```javascript
// ❌ INCORRECTO
{
  id: 8,
  dominio: "...",
  `Observa este meme...`  // falta enunciado:
}

// ✅ CORRECTO
{
  id: 8,
  dominio: "...",
  enunciado: `Observa este meme...`
}
```

### 3. Objetos incompletos/duplicados
```javascript
// ❌ INCORRECTO
{
  correcta: 0,  // objeto sin id, dominio, alternativas
  explicacion: "..."
}

// ✅ CORRECTO
{
  id: 10,
  dominio: "...",
  enunciado: "...",
  alternativas: [...],
  correcta: 0,
  explicacion: "..."
}
```

### 4. Template strings con comillas anidadas
```javascript
// ❌ PROBLEMÁTICO (puede causar errores)
enunciado: `Texto con "comillas" y 'apóstrofos'`

// ✅ MEJOR (usar concatenación para HTML complejo)
enunciado: "Texto..." +
  '<div class="clase">contenido</div>' +
  "Más texto..."
```

## 🔄 Workflow Recomendado

1. **Editar archivo .njk**
2. **Validar sintaxis ANTES de commit:**
   ```bash
   python validar-sintaxis-js.py evaluaciones/.../index.njk
   ```
3. **Si hay errores:** corregir y volver al paso 2
4. **Si está OK:** hacer commit y push
   ```bash
   git add .
   git commit -m "fix: descripción del cambio"
   git push origin main
   ```

## 💡 Beneficios

- ✅ **Detecta errores localmente** antes de deploy
- ✅ **Muestra línea exacta** del error con contexto
- ✅ **Ahorra tiempo** (no más deploys innecesarios)
- ✅ **Ahorra costos** (menos builds en Vercel)
- ✅ **Más confianza** al hacer cambios

## 📋 Requisitos

- Python 3.x
- Node.js (para validación con `node -c`)

## 🐛 Resolución de Problemas

### Error: "No se encontraron bloques <script>"
- El archivo no tiene código JavaScript
- Verifica que sea un archivo de prueba con `<script>...</script>`

### Error: "node: command not found"
- Node.js no está instalado
- Instalar desde: https://nodejs.org/

---

**Creado por:** Sistema de validación automática
**Fecha:** Noviembre 2025
**Versión:** 1.0
