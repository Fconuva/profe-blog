# Auditoría de Links - Evaluaciones

**Fecha**: 14 Nov 2025
**Estado**: Revisión completa de estructura

## Estructura Actual

### `/evaluaciones/` (Principal)
- ✅ `index.html` - Página principal estática
- ✅ `login.html` - Login funcional con Firebase

### `/evaluaciones/educacion-parvularia/`
- ✅ `index.njk` existe - **OK**

### `/evaluaciones/educacion-basica/`
- ✅ `index.njk` existe - **OK**

#### Pruebas Básica:

**63-sc-l (Lenguaje)**
- ✅ `index.html` - Redirect a practica/
- ✅ `practica.njk` - Prueba interactiva
- ✅ Link funcional: `/evaluaciones/educacion-basica/pruebas/63-sc-l/`

**66-sc-m (Matemática)**
- ✅ `index.html` - Redirect a practica/
- ✅ `index.njk` - Página info (IGNORADA en .eleventy.js)
- ✅ `practica.njk` - Prueba interactiva
- ✅ Link funcional: `/evaluaciones/educacion-basica/pruebas/66-sc-m/`

**71-sc-cs (Ciencias Sociales)**
- ✅ `index.njk` - Página info
- ❌ NO tiene `practica.njk`
- ⚠️ Carpeta IGNORADA en `.eleventy.js` (línea 83)
- **ACCIÓN**: Crear `practica.njk` o eliminar de sistema

**basica-generalista**
- ✅ `index.njk` - Página info
- ❌ NO tiene `practica.njk`
- **ACCIÓN**: Crear `practica.njk` o dejar solo info

**educacion-fisica-basica**
- ✅ `index.njk` - Página info CON prueba integrada
- ✅ NO necesita practica.njk separada (tiene 50 preguntas incluidas en index)
- ❌ Link roto en index.html principal (apunta a `/practica/` que no existe)
- **ACCIÓN**: Corregir link a `/evaluaciones/educacion-basica/pruebas/educacion-fisica-basica/`

### `/evaluaciones/educacion-media/`
- ✅ `index.njk` existe - **OK**

## Problemas Identificados

### 1. ❌ Ed. Física - Link Roto
**Problema**: `index.html` no tiene link directo a Ed. Física
**Solución**: Agregar Ed. Física a la lista de asignaturas disponibles

### 2. ⚠️ 71-sc-cs (Religión)
**Status**: Carpeta ignorada en Eleventy
**Tiene**: Solo `index.njk` info, NO tiene práctica
**Solución**: Crear práctica o mantener solo como info

### 3. ⚠️ basica-generalista
**Status**: Solo tiene `index.njk`
**Solución**: Crear práctica o mantener solo como info

## Recomendaciones

### Opción 1: Simplificar (Recomendado)
- Mantener solo pruebas COMPLETAS con práctica:
  - ✅ 63-sc-l (Lenguaje) - COMPLETA
  - ✅ 66-sc-m (Matemática) - COMPLETA
  - ✅ educacion-fisica-basica - COMPLETA (integrada)
  
- Ocultar o marcar como "En desarrollo":
  - 🚧 71-sc-cs (Religión) - Solo info
  - 🚧 basica-generalista - Solo info

### Opción 2: Completar Todas
- Crear `practica.njk` para:
  - 71-sc-cs (Religión)
  - basica-generalista
- Actualizar `.eleventy.js` para procesarlas

## Estado de Links en `/evaluaciones/index.html`

```
/evaluaciones/educacion-parvularia/     ✅ OK
/evaluaciones/educacion-basica/          ✅ OK  
/evaluaciones/educacion-media/           ✅ OK
```

**Nota**: Los botones van a páginas índice de cada nivel, que tienen sub-links a pruebas específicas.

## Acciones Inmediatas

1. ✅ Agregar Ed. Física como asignatura visible en index.html
2. ⚠️ Decidir qué hacer con 71-sc-cs y basica-generalista
3. ✅ Verificar que todas las pruebas listadas funcionen

## Testing Checklist

- [ ] `/evaluaciones/` carga correctamente
- [ ] Login funciona y redirige
- [ ] Links a Parvularia, Básica, Media funcionan
- [ ] Prueba 63-sc-l (Lenguaje) accesible
- [ ] Prueba 66-sc-m (Matemática) accesible
- [ ] Prueba Ed. Física accesible
- [ ] Overlays de login se muestran sin sesión
- [ ] Con sesión, overlays desaparecen
