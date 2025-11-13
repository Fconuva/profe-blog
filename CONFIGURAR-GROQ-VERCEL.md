# 🔑 Configurar API Key de Groq en Vercel

## ⚠️ IMPORTANTE
La API key de Groq **NO DEBE** subirse al repositorio. Debe configurarse como variable de entorno en Vercel.

## 📋 Pasos para configurar en Vercel

1. **Ir a configuración de variables de entorno:**
   - URL: https://vercel.com/fconuvas-projects/profe-blog/settings/environment-variables

2. **Agregar nueva variable:**
   - **Name:** `GROQ_API_KEY`
   - **Value:** (usar la API key que descargaste de Groq - comienza con `gsk_...`)
   - **Environments:** Seleccionar **ALL** (Production, Preview, Development)
   - ✅ Marcar como **Sensitive**

3. **Guardar y Redeploy:**
   - Click "Save"
   - Vercel triggeará automáticamente un nuevo deployment

## ✅ Verificación

Después del deployment, verifica que funcione:
- Ve a: https://www.profefranciscopancho.com/evaluaciones/educacion-especial/estudio/dossier-dea
- Haz scroll hasta "Botones IA"
- Click en cualquier botón IA
- Debe mostrar respuesta de Groq en lugar del alert de "en desarrollo"

## 🔒 Seguridad

- ✅ `.env` está en `.gitignore`
- ✅ La API key solo existe en Vercel como variable de entorno
- ✅ El código usa `process.env.GROQ_API_KEY`
- ⚠️ Si la API key se expone públicamente, Groq la deshabilitará automáticamente

## 📝 Referencia

El endpoint que usa esta API key:
- `/api/groq-feedback.js`
- `/api/groq-chat.js`
