# 🔧 Solución Deploy Vercel + IA (Groq)

## Problema actual
1. Los cambios no se reflejan en producción (caché o deploy fallido)
2. La IA devuelve 500 (la variable GROQ_API_KEY no está configurada)
3. Tailwind CDN warning (falta compilar tw.css)

---

## ✅ Solución paso a paso

### 1. Verificar nombres EXACTOS de variables en Vercel

**Ve a:** Vercel Dashboard → Tu proyecto → Settings → Environment Variables

**Debe llamarse EXACTAMENTE así:**
- `GROQ_API_KEY` (NO "GROQ" ni "groq_api_key")

**Cómo obtener tu API key:**
1. Ve a: https://console.groq.com/keys
2. Crea tu cuenta gratis (sin tarjeta)
3. Genera una nueva API key
4. Cópiala (formato: `gsk_xxxxxxxxxxxxxx`)

**Configurar en Vercel:**
1. Agrega la variable con el nombre exacto: `GROQ_API_KEY`
2. Pega tu key como valor
3. Scope: **All Environments** (Production, Preview, Development)

---

### 2. Forzar Redeploy

**Opción A: Desde Vercel Dashboard**
1. Ve a: Deployments
2. Encuentra el último deploy (el de hace pocos minutos)
3. Click en los 3 puntos (⋯) → **Redeploy**
4. Confirma el redeploy

**Opción B: Push vacío desde terminal**
```powershell
git commit --allow-empty -m "Force Vercel redeploy"
git push origin main
```

---

### 3. Limpiar caché del navegador

**Después del redeploy:**
1. Abre Chrome/Edge en modo incógnito: `Ctrl+Shift+N`
2. O limpia caché: `Ctrl+Shift+Delete` → Eliminar caché e imágenes
3. Ve a: https://www.profefranciscopancho.com/evaluaciones
4. Deberías ver el nuevo diseño con las 2 ventanas

---

### 4. Verificar que la IA funciona

**Health check (debe responder JSON):**
```
https://www.profefranciscopancho.com/api/gemini-feedback?health=1
```

**Respuesta esperada:**
```json
{
  "ok": true,
  "hasGroq": true,
  "provider": "groq"
}
```

**Si dice `"hasGroq": false`:**
→ La variable `GROQ_API_KEY` no está configurada correctamente en Vercel (volver al paso 1)

---

### 5. Probar botones de IA

1. Ve a: https://www.profefranciscopancho.com/evaluaciones/educacion-basica/estudio/lenguaje-comunicacion/
2. Scroll a cualquier objetivo
3. Click en "🤖 IA: Explicar con ejemplos"
4. **Debe aparecer texto de explicación** (no error 500)

---

## 🚨 Si sigue fallando

**Revisar logs de Vercel:**
1. Vercel Dashboard → Tu proyecto → Deployments
2. Click en el último deploy
3. Tab "Build Logs" → buscar errores
4. Tab "Function Logs" → ver si `/api/gemini-feedback` tiene errores

**Error común:** `"Falta GROQ_API_KEY en variables de entorno"`
→ Significa que la variable NO está en Vercel o está mal escrita

---

## 📋 Checklist rápido

- [ ] Variable con nombre EXACTO: `GROQ_API_KEY`
- [ ] Scope: All Environments marcado
- [ ] API key obtenida desde https://console.groq.com/keys
- [ ] Redeploy forzado desde Vercel
- [ ] Caché del navegador limpiado
- [ ] Health check responde con `hasGroq: true`
- [ ] Botones de IA funcionan sin error 500
- [ ] Página /evaluaciones muestra nuevo diseño (2 ventanas)

---

## 🎯 Resultado esperado

**Después de seguir estos pasos verás:**
1. `/evaluaciones` con título "Temarios de Estudios y Pruebas"
2. Dos ventanas: "Estudio de contenidos" y "Prueba y ejercicios"
3. Botones de IA habilitados y funcionando
4. Sin warning de Tailwind CDN (carga tw.css compilado)
