# Configuración de Variables de Entorno - Registro de Notas

## Variables Requeridas en Vercel

Para que las APIs de registro de notas funcionen correctamente, configura estas variables de entorno en Vercel:

### 1. FIREBASE_SERVICE_ACCOUNT_BASE64
**Descripción:** Credenciales de Firebase Admin SDK en formato base64

**Cómo obtenerla:**
```bash
# Lee el archivo firebase-service-account-base64.txt que ya tienes
cat firebase-service-account-base64.txt
```

**Valor:** El contenido completo del archivo `firebase-service-account-base64.txt`

### 2. FIREBASE_DATABASE_URL
**Descripción:** URL de tu Firebase Realtime Database

**Valor:** `https://profe-blog-default-rtdb.firebaseio.com/`

## Pasos para Configurar en Vercel

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto `profefranciscopancho-blog`
3. Ve a **Settings** → **Environment Variables**
4. Agrega las siguientes variables:

   ```
   FIREBASE_SERVICE_ACCOUNT_BASE64 = [contenido del archivo firebase-service-account-base64.txt]
   FIREBASE_DATABASE_URL = https://profe-blog-default-rtdb.firebaseio.com/
   ```

5. Asegúrate de seleccionar **Production, Preview, Development** para que funcione en todos los ambientes

6. Haz un nuevo deploy (automático con el último push)

## Verificación

Después de configurar las variables:

1. Las APIs estarán disponibles en:
   - `https://profefranciscopancho.com/api/save-courses-Francisco`
   - `https://profefranciscopancho.com/api/get-courses-Francisco`

2. El sistema de registro de notas sincronizará automáticamente con Firebase

3. Los errores 404 desaparecerán

## Solución Temporal

Si no puedes configurar Firebase inmediatamente, el sistema funcionará con localStorage únicamente (modo offline).

## Archivos Creados

✅ `/api/save-courses-Francisco.js` - Guarda cursos en Firebase
✅ `/api/get-courses-Francisco.js` - Obtiene cursos desde Firebase
✅ `/privado/registro-notas.html` - Ahora usa Tailwind local en lugar de CDN

## Warnings Resueltos

✅ **Tailwind CDN Warning** - Reemplazado por versión local `/css/tailwind.css`
✅ **APIs 404** - APIs creadas, solo falta configurar variables de entorno en Vercel
