# Configuración Firebase + Vercel

## 📋 Estado Actual (28 de octubre de 2025)

### ✅ Decisión técnica

- **Hosting**: Vercel (Eleventy build → `_site`)
- **Base de datos**: Firebase (Realtime Database + Authentication anon)
- **Funciones serverless**: Se migran a Vercel Edge/Serverless Functions o directamente al SDK de Firebase; los antiguos endpoints de Netlify quedan en desuso.

### 🔧 Configuración en Vercel

Las credenciales de Firebase se cargan como variables de entorno en: **Project Settings → Environment Variables**.

Variables esenciales:

| Variable | Descripción |
| --- | --- |
| `FIREBASE_PROJECT_ID` | ID del proyecto Firebase |
| `FIREBASE_CLIENT_EMAIL` | Cuenta de servicio |
| `FIREBASE_PRIVATE_KEY` | Clave privada (recordar conservar los saltos de línea) |
| `FIREBASE_DATABASE_URL` | URL de la Realtime Database |

Todas las builds utilizan **Node 18** y ejecutan `npm run build`, publicando `_site` según `vercel.json`.

### 📦 Dependencias relevantes

- `firebase-admin`: scripts backend (cargas masivas, CLI personal).
- SDKs web de Firebase (importados en vistas privadas para formularios y sincronización).

> Nota: el paquete `@neondatabase/serverless` puede eliminarse cuando finalice la migración de scripts que aún lo referencian (`cargar-cursos-francisco.js`, funciones Legacy). Mantenerlo solo si necesitas conectarte temporalmente a la BD PostgreSQL antigua para exportaciones.

### �️ Migración de funciones

1. **Antiguo flujo**: `/.netlify/functions/*` → consultaban Neon a través de `DATABASE_URL`.
2. **Nuevo flujo**: consumir Firebase directamente desde el frontend (SDK) o exponer helpers en Vercel (`api/*.js`) que utilicen `firebase-admin`.
3. **Acción inmediata**: evitar nuevos llamados a `/.netlify/functions/*` y refactorizar las vistas (`privado/registro-notas.html`, paneles administrativos) para que utilicen Firebase.

### � Buenas prácticas de seguridad

- Nunca publiques la `FIREBASE_PRIVATE_KEY` en el repositorio; solo en Vercel o en tu `.env` local ignorado.
- Limita los permisos de la Realtime Database con reglas (`database.rules.json`).
- Registra una clave API pública si necesitas utilizar Firebase Authentication desde el cliente.

### � Documentación relacionada

- `.env.example` y `.env-Francisco.example`: Plantillas actualizadas con variables de Firebase.
- `cargar-cursos-firebase.js`: Script Node para cargar cursos usando `firebase-admin`.
- `DEPLOY.md`: Guía de despliegue en Vercel.

### 🔄 Flujo de despliegue

1. Push a la rama `main` en GitHub.
2. Vercel detecta el cambio y ejecuta la build (`npm install` → `npm run build`).
3. El resultado se publica automáticamente.
4. Si se necesitan ajustes manuales, ejecutar `vercel --prod` desde CLI con las mismas variables definidas.

### 🧹 Limpieza realizada

- Eliminado `netlify.toml` y el workflow `.github/workflows/netlify-deploy.yml`.
- Renombrado este documento para reflejar la arquitectura Firebase + Vercel.
- Actualizados ejemplos de variables de entorno.

### � Próximos pasos

1. Refactorizar los scripts y vistas que aún dependen de Neon/PostgreSQL.
2. Implementar endpoints en `api/` (Vercel Functions) si se requiere lógica server-side adicional.
3. Documentar el proceso de autenticación y backups sobre Firebase.

**Última verificación:** 28 de octubre de 2025
**Estado:** 🔄 Migración en curso hacia Firebase + Vercel
