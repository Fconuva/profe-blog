# Configuración de GROQ API KEY

## 🔑 Variable de Entorno Requerida

Para que el sistema de retroalimentación pedagógica con IA funcione correctamente, necesitas configurar la siguiente variable de entorno:

### Nombre de la variable
```
GROQ_API_KEY
```

### Valor esperado
Una API key de Groq con el formato:
```
gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 📋 Pasos para Obtener tu API Key

### 1. Crear cuenta en Groq (100% gratis)
- Ve a: **https://console.groq.com/**
- Regístrate con tu email (sin tarjeta de crédito)
- Confirma tu correo

### 2. Generar tu API Key
- Inicia sesión en: **https://console.groq.com/keys**
- Click en **"Create API Key"**
- Asigna un nombre descriptivo (ej: "Profe Francisco Blog")
- **Copia la key inmediatamente** (solo se muestra una vez)

### 3. Configurar en Vercel (Producción)
1. Ve a tu proyecto en Vercel: **https://vercel.com/dashboard**
2. Selecciona tu proyecto `profefranciscopancho-blog`
3. Ve a **Settings → Environment Variables**
4. Agrega nueva variable:
   - **Name:** `GROQ_API_KEY`
   - **Value:** `gsk_tu_key_aqui`
   - **Environments:** Production, Preview, Development
5. Click en **Save**
6. **Redeploy** el proyecto (Deployments → Latest → Redeploy)

### 4. Configurar en Local (Desarrollo)
Crea un archivo `.env` en la raíz del proyecto:
```bash
GROQ_API_KEY=gsk_tu_key_aqui
```

⚠️ **IMPORTANTE:** Nunca subas el archivo `.env` a Git (ya está en `.gitignore`)

---

## 🚀 Modelo Utilizado

El sistema usa el modelo **Llama 3.1 8B Instant** de Groq:
- **Modelo:** `llama-3.1-8b-instant`
- **Velocidad:** Ultra-rápida (10-20x más rápido que otras APIs gratuitas)
- **Calidad:** Excelente en español de Chile
- **Límites gratuitos:** Muy generosos para aplicaciones educativas
- **Parámetros:**
  - `temperature`: 0.3 (respuestas más consistentes)
  - `max_tokens`: 800 (retroalimentación completa)
  - `top_p`: 0.9 (buena diversidad)

---

## 🧪 Verificar Configuración

### Test de salud del API
```bash
curl https://tu-dominio.vercel.app/api/gemini-feedback?health=1
```

Respuesta esperada:
```json
{
  "ok": true,
  "hasGroq": true,
  "provider": "groq"
}
```

### Test de retroalimentación
```bash
curl -X POST https://tu-dominio.vercel.app/api/gemini-feedback \
  -H "Content-Type: application/json" \
  -d '{
    "pregunta": "¿Qué tipo de narrador se observa?",
    "respuestaDocente": "Es narrador omnisciente",
    "tema": ["Tipos de narrador"]
  }'
```

Respuesta esperada:
```json
{
  "feedback": "1) Refuerzo de aciertos...",
  "provider": "groq"
}
```

---

## ⚠️ Solución de Problemas

### Error: "Falta GROQ_API_KEY en variables de entorno"
**Causa:** La variable no está configurada en Vercel
**Solución:** Sigue el paso 3 de arriba

### Error: "Groq API error: 401"
**Causa:** API key inválida o expirada
**Solución:** Genera una nueva key en https://console.groq.com/keys

### Error: "Groq API error: 429"
**Causa:** Límite de tasa excedido (demasiadas solicitudes)
**Solución:** Espera 1 minuto y reintenta. El tier gratuito tiene límites generosos pero no ilimitados.

### Error: "TIMEOUT"
**Causa:** La generación tardó más de 20 segundos
**Solución:** Groq es muy rápido, este error es raro. Verifica tu conexión a internet.

---

## 📊 Límites del Tier Gratuito

Groq ofrece límites muy generosos para uso educativo:
- ✅ **Requests por minuto:** ~30
- ✅ **Requests por día:** ~14,400
- ✅ **Tokens por minuto:** ~6,000
- ✅ **Sin tarjeta de crédito**
- ✅ **Sin fecha de expiración**

Para una plataforma educativa con ~100 profesores activos, estos límites son más que suficientes.

---

## 🔄 Migración desde Hugging Face / OpenAI

Si vienes de otra implementación:

### Desde Hugging Face:
- **Ventaja:** Groq es 10-20x más rápido
- **Cambio:** Solo necesitas cambiar la variable `HUGGINGFACE_API_KEY` → `GROQ_API_KEY`
- **Eliminar:** Ya no necesitas el token de Hugging Face

### Desde OpenAI:
- **Ventaja:** Groq es gratis (OpenAI requiere tarjeta)
- **Cambio:** Solo necesitas cambiar la variable `OPENAI_API_KEY` → `GROQ_API_KEY`
- **Eliminar:** Ya no necesitas configurar billing en OpenAI

---

## 📞 Soporte

- **Documentación oficial:** https://console.groq.com/docs
- **Playground:** https://console.groq.com/playground (para probar prompts)
- **Status:** https://status.groq.com/ (para verificar si hay problemas de servicio)

---

## ✅ Checklist de Configuración

- [ ] Cuenta creada en https://console.groq.com
- [ ] API Key generada en https://console.groq.com/keys
- [ ] Variable `GROQ_API_KEY` agregada en Vercel → Settings → Environment Variables
- [ ] Environments seleccionados: Production, Preview, Development
- [ ] Redeploy realizado en Vercel
- [ ] Test de salud ejecutado: `/api/gemini-feedback?health=1` → `{ "ok": true, "hasGroq": true }`
- [ ] Test de retroalimentación funcional en la plataforma

---

**Última actualización:** Noviembre 2024  
**Versión del API:** v1  
**Modelo:** llama-3.1-8b-instant
