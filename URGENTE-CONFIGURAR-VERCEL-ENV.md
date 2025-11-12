# 🚨 URGENTE: Configurar Variables de Entorno en Vercel

## Problema Actual
Las funciones API están fallando con error **500** porque **faltan las variables de entorno de Firebase en Vercel**.

## Solución Inmediata

### 1. Ir al Dashboard de Vercel
1. Abrir: https://vercel.com/dashboard
2. Seleccionar proyecto: `profefranciscopancho-blog`
3. Click en **Settings** (arriba derecha)
4. Click en **Environment Variables** (menú izquierda)

### 2. Agregar las siguientes variables:

**IMPORTANTE:** Copiar estos valores desde el archivo `.env` local:

| Variable | Valor | Fuente |
|----------|-------|--------|
| `FIREBASE_PROJECT_ID` | `profe-blog` | Firebase Console → Project Settings |
| `FIREBASE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...` | Service Account JSON |
| `FIREBASE_PRIVATE_KEY_ID` | `abc123...` | Service Account JSON |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-xxx@profe-blog.iam.gserviceaccount.com` | Service Account JSON |
| `FIREBASE_CLIENT_ID` | `123456789...` | Service Account JSON |
| `FIREBASE_CLIENT_CERT_URL` | `https://www.googleapis.com/robot/v1/metadata/x509/...` | Service Account JSON |
| `FIREBASE_DATABASE_URL` | `https://profe-blog-default-rtdb.firebaseio.com` | Firebase Console → Realtime Database |

### 3. Formato Correcto para FIREBASE_PRIVATE_KEY

⚠️ **CRÍTICO:** La clave privada debe incluir `\n` literales (no saltos de línea reales):

```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BA...\n-----END PRIVATE KEY-----\n
```

**NO usar:**
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BA...
-----END PRIVATE KEY-----
```

### 4. Aplicar a todos los entornos

En cada variable, seleccionar:
- ✅ Production
- ✅ Preview
- ✅ Development

### 5. Redeploy

Después de agregar las variables:
1. Ir a **Deployments**
2. Click en el último deployment
3. Click en **⋯ More** → **Redeploy**

## Verificación

Una vez configurado, probar:
```
https://www.profefranciscopancho.com/api/get-courses-Francisco?username=francisco_fconuva
```

Debe retornar:
```json
{
  "success": true,
  "courses": [...],
  "userId": "...",
  "username": "francisco_fconuva"
}
```

## Obtener las Credenciales de Firebase

Si no tienes el archivo `.env`, obtener credenciales:

1. Ir a Firebase Console: https://console.firebase.google.com/
2. Seleccionar proyecto: **profe-blog**
3. Click en **⚙️ Settings** → **Project settings**
4. Ir a pestaña **Service accounts**
5. Click en **Generate new private key**
6. Guardar el archivo JSON
7. Copiar los valores al formato arriba indicado

## Archivo .env Local (Referencia)

Tu archivo `.env` local debe verse así:

```env
FIREBASE_PROJECT_ID=profe-blog
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BA...\n-----END PRIVATE KEY-----\n"
FIREBASE_PRIVATE_KEY_ID=abc123...
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@profe-blog.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789...
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
FIREBASE_DATABASE_URL=https://profe-blog-default-rtdb.firebaseio.com
```

## ¿Por qué falló?

Las variables de entorno **NO se suben automáticamente** a Vercel cuando haces `git push`. Debes configurarlas manualmente en el dashboard de Vercel.

## Siguiente Paso

Una vez configuradas las variables en Vercel:
1. Las funciones API funcionarán correctamente
2. El registro de notas se conectará a Firebase
3. Los cursos se sincronizarán automáticamente

---

**Tiempo estimado:** 5-10 minutos
**Prioridad:** 🔴 CRÍTICA
