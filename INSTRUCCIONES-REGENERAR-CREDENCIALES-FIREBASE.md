# 🔐 INSTRUCCIONES: Regenerar Credenciales Firebase

**FECHA:** 13 de Noviembre 2025  
**MOTIVO:** Credenciales expuestas en GitHub (commit 52fe619) - Google Cloud las deshabilitó automáticamente

---

## ✅ PASOS COMPLETADOS

1. ✅ **Eliminado archivo del repositorio:** `git rm --cached firebase-service-account.json`
2. ✅ **Limpiado historial Git completo:** `git filter-branch` (eliminó de TODOS los commits)
3. ✅ **Push forzado al remoto:** `git push origin --force --all`
4. ✅ **Archivo ya está en .gitignore:** Confirmado que `firebase-service-account.json` está listado

---

## 🚨 ACCIONES PENDIENTES (URGENTES)

### 1. **Acceder a Firebase Console**

Ve a: https://console.firebase.google.com/project/profe-blog/settings/serviceaccounts/adminsdk

### 2. **Rotar la Clave Comprometida**

**Clave deshabilitada por Google:**
- **Email:** `firebase-adminsdk-fbsvc@profe-blog.iam.gserviceaccount.com`
- **ID de clave:** `feb1d541618b812573ba97897811d03074961995`

**Pasos:**

1. En la consola de Firebase, ve a **Project Settings** > **Service Accounts**
2. Haz clic en **Generate New Private Key**
3. Confirma la generación
4. **IMPORTANTE:** Descarga el archivo JSON que se genera
5. Guarda el archivo como `firebase-service-account.json` en la **raíz del proyecto** (local, NO subir a Git)

### 3. **Configurar en Vercel (Variables de Entorno)**

**Opción A: Usar archivo completo en Vercel**
1. Ve a: https://vercel.com/fconuvas-projects/profe-blog/settings/environment-variables
2. Crea una nueva variable:
   - **Name:** `FIREBASE_SERVICE_ACCOUNT`
   - **Value:** Pega el **contenido completo del JSON** (todo el archivo)
   - **Environment:** Production, Preview, Development (selecciona todos)
3. Haz clic en **Save**

**Opción B: Usar variables individuales (más seguro)**
1. Abre el archivo JSON descargado
2. Crea variables de entorno en Vercel para cada campo:
   ```
   FIREBASE_PROJECT_ID = "profe-blog"
   FIREBASE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\n...completa...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL = "firebase-adminsdk-XXXXX@profe-blog.iam.gserviceaccount.com"
   ```

### 4. **Actualizar Código (si usaste Opción B)**

Si usaste variables individuales, actualiza tu código para leer de variables de entorno:

```javascript
// api/groq-feedback/route.js (o donde inicializas Firebase)
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });
}
```

### 5. **Verificar que Funcione**

1. Despliega en Vercel (o espera auto-deploy)
2. Prueba la funcionalidad de Firebase:
   - Autenticación
   - Firestore
   - Cualquier operación que uses
3. Revisa los logs de Vercel si hay errores

---

## 📋 CHECKLIST DE SEGURIDAD

- [x] **Eliminar archivo del repo Git**
- [x] **Limpiar historial de Git**
- [x] **Push forzado al remoto**
- [x] **Confirmar .gitignore actualizado**
- [ ] **Generar nuevas credenciales en Firebase**
- [ ] **Configurar en Vercel (variables de entorno)**
- [ ] **Actualizar código si es necesario**
- [ ] **Verificar que funcione correctamente**
- [ ] **Revisar actividad en Google Cloud Console** (https://console.cloud.google.com/home/activity?project=profe-blog)

---

## 🛡️ MEJORES PRÁCTICAS PARA EL FUTURO

### 1. **NUNCA subir credenciales a Git**
   - Siempre usar variables de entorno
   - Mantener archivos sensibles en `.gitignore`
   - Revisar antes de cada commit: `git status`

### 2. **Usar variables de entorno**
   ```bash
   # .env.local (para desarrollo local - NUNCA subir a Git)
   FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'
   ```

### 3. **Verificar .gitignore**
   ```
   # .gitignore
   .env
   .env.local
   .env.*.local
   firebase-service-account.json
   service-account.json
   *.pem
   *.key
   ```

### 4. **Usar secrets de Vercel/Netlify**
   - Todas las credenciales deben estar en variables de entorno del servicio de hosting
   - NUNCA hardcodear claves en el código

### 5. **Auditar regularmente**
   - Revisar permisos de cuentas de servicio
   - Rotar credenciales periódicamente (cada 3-6 meses)
   - Monitorear actividad sospechosa en Google Cloud Console

---

## 🆘 CONTACTO SOPORTE

Si tienes problemas:

1. **Firebase Support:** https://firebase.google.com/support
2. **Google Cloud Trust & Safety:** cloud-abuse@google.com
3. **GitHub Security:** https://github.com/security/advisories

---

## 📚 RECURSOS ADICIONALES

- [Mejores prácticas IAM Google Cloud](https://cloud.google.com/iam/docs/best-practices-service-accounts)
- [Seguridad de claves de cuentas de servicio](https://cloud.google.com/iam/docs/best-practices-for-managing-service-account-keys)
- [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**⚠️ IMPORTANTE:** NO elimines este archivo. Es un registro de seguridad importante.

**✅ ESTADO:** Limpieza de Git completada. Pendiente: Regenerar credenciales y configurar en Vercel.
