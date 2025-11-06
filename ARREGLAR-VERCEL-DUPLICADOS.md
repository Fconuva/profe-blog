# 🔧 Arreglar Deploys Duplicados en Vercel

## Problema
Hay 3 deploys duplicados del mismo repositorio:
- ❌ profe-blog
- ❌ profefranciscopancho-blog  
- ✅ profefconuva (mantener este)

## Solución

### Paso 1: Ir a Vercel Dashboard
https://vercel.com/fconuvas-projects

### Paso 2: Eliminar Proyectos Duplicados

#### A. Eliminar "profe-blog"
1. Click en el proyecto **profe-blog**
2. Ve a **Settings** (⚙️)
3. Scroll hasta el final
4. Click en **Delete Project**
5. Escribe el nombre del proyecto para confirmar
6. Click en **Delete**

#### B. Eliminar "profefranciscopancho-blog"
1. Click en el proyecto **profefranciscopancho-blog**
2. Ve a **Settings** (⚙️)
3. Scroll hasta el final
4. Click en **Delete Project**
5. Escribe el nombre del proyecto para confirmar
6. Click en **Delete**

### Paso 3: Verificar "profefconuva" (Mantener)

**Este proyecto debe tener:**

✅ **Repository**: `Fconuva/profe-blog`  
✅ **Branch**: `main`  
✅ **Domains**:
- www.profefranciscopancho.com (primary)
- profefranciscopancho.com
- profefconuva.vercel.app

### Paso 4: Verificar Settings del Proyecto

1. Ve a **Settings** en profefconuva
2. En **Git** verifica:
   - Production Branch: `main` ✅
   - Install Command: (dejar por defecto o vacío)
   - Build Command: (dejar por defecto o vacío)
   - Output Directory: `_site`

3. En **Environment Variables** verifica si hay alguna configurada (debería estar vacío)

### Paso 5: Verificar Deploy

Después de eliminar duplicados:
1. El próximo push a `main` debería hacer **1 solo deploy**
2. Verifica en: https://vercel.com/fconuvas-projects/profefconuva/deployments

## ✅ Resultado Esperado

Después de esto:
- ✅ 1 solo proyecto en Vercel: **profefconuva**
- ✅ 1 solo deploy por push a main
- ✅ Dominio principal funcionando: www.profefranciscopancho.com

## 🚀 Verificar que Funciona

Después de eliminar duplicados, haz un cambio pequeño:

```bash
# En tu terminal local
echo "# Test deploy" >> README.md
git add README.md
git commit -m "test: Verificar deploy único"
git push origin main
```

Deberías ver **solo 1 deploy** en Vercel.

---

**Fecha**: 6 de noviembre, 2025  
**Commit actual**: `6ff42e7`  
**Sistema**: Acceso total simplificado + límite 2 dispositivos
