# 🗄️ Configuración de Firebase (Realtime Database) con Vercel

Guía rápida para configurar la infraestructura actual basada en **Firebase** y **Vercel**, reemplazando la antigua dependencia de Netlify + Neon.

---

## ✅ Ventajas de Firebase

- ⚡ **Realtime Database**: sincronización inmediata entre dispositivos sin escribir SQL.
- � **Reglas de seguridad**: control granular del acceso por usuario/rol.
- 🧩 **SDK multiplataforma**: mismo backend para web, móvil y scripts Node.
- ☁️ **Escalado automático**: administrado por Google Cloud.

---

## 📋 Pasos para Configurar

### 1️⃣ Crear/usar un proyecto Firebase

1. Ingresa a [Firebase Console](https://console.firebase.google.com/).
2. Crea o selecciona el proyecto `profe-blog`.
3. Habilita **Realtime Database** (modo bloqueado recomendado).
4. Genera un **Service Account** (Settings → Service accounts → Generate new private key).

### 2️⃣ Variables de entorno en Vercel

Agrega en **Project Settings → Environment Variables**:

```bash
FIREBASE_PROJECT_ID=profe-blog
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@profe-blog.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://profe-blog-default-rtdb.firebaseio.com
```

> Consejo: respeta los saltos de línea (`\n`) en la clave privada.

### 3️⃣ Inicializar datos (opcional)

- Usa `cargar-cursos-firebase.js` para poblar la base de datos desde un CSV/JSON.
- Para ejecutar localmente: `node cargar-cursos-firebase.js` (requiere archivo `.env` con los mismos valores).

### 4️⃣ Reglas de seguridad recomendadas

Archivo `database.rules.json` (crear si no existe):

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "courses": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

Actualiza según los nodos que utilice tu aplicación.

### 5️⃣ Uso desde el frontend

- Importa los SDK web (`firebase-app-compat`, `firebase-database-compat`, etc.).
- Inicializa con la configuración pública del proyecto web.
- Utiliza `firebase.database()` para leer/escribir datos en tiempo real.

### 6️⃣ Uso desde scripts/serverless

- Importa `firebase-admin` y construye la app con las variables de entorno.
- Ejemplo base:

```javascript
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const db = admin.database();
```

---

## 🏗️ Estructura recomendada

```text
firebase/
  database.rules.json
scripts/
  cargar-cursos-firebase.js
  export-backup.js
```

Los formularios públicos (por ejemplo, `paseo-docentes.html`) pueden leer/escribir directamente en Realtime Database o hacerlo a través de funciones de Vercel si necesitas lógica adicional.

---

## 🔄 Deploy en Vercel

1. Push a `main`.
2. Vercel ejecuta `npm run build` y publica `_site`.
3. Los formularios consumirán Firebase sin necesidad de funciones externas.

> Si necesitas endpoints protegidos, crea archivos en `api/*.js` que utilicen `firebase-admin`.

---

## 🔧 Desarrollo local

1. Crea `.env.local` copiando de `.env.example`.
2. Ejecuta `npm install` y `npm run dev` (si usas un servidor local) o simplemente `npx @11ty/eleventy --serve`.
3. Para scripts Node (`cargar-cursos-firebase.js`) ejecuta `node scripts/<archivo>.js`.

---

## 🔒 Seguridad

- Guarda el service account en un gestor seguro.
- Usa reglas estrictas de la Realtime Database.
- Habilita logs de auditoría en Firebase si necesitas trazabilidad.

---

## ❓ Troubleshooting

| Problema | Solución |
| --- | --- |
| `Error: FIREBASE_PRIVATE_KEY invalid` | Verifica que los `\n` estén presentes en la variable |
| El frontend no conecta | Comprueba que la app web tenga la configuración correcta (`firebaseConfig`) |
| Faltan datos en producción | Confirma que las reglas permitan lectura/escritura para los nodos utilizados |

---

## 📞 Soporte rápido

1. Revisar la consola de Firebase (Database → Data) para validar cambios en tiempo real.
2. Verificar logs del navegador (F12) si el frontend no sincroniza.
3. Revisar los logs de Vercel (`Deployments → View Functions Logs`) para scripts serverless.

---

## 📌 Próximos pasos

- Documentar los endpoints o nodos usados por cada módulo (registro de notas, eventos, etc.).
- Automatizar backups usando Cloud Functions o scripts programados.
- Eliminar dependencias de Neon una vez completada la exportación histórica.

**Estado:** 🔄 Migración a Firebase en progreso

