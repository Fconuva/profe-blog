# 🎯 GUÍA RÁPIDA: Migración a Firebase

## ✅ LO QUE YA ESTÁ LISTO

- ✅ `firebase-admin` instalado
- ✅ 4 funciones serverless Firebase creadas
- ✅ Script de migración `migrate-neon-to-firebase.js`
- ✅ Módulo de configuración `firebase-config.js`
- ✅ Reglas de Firebase actualizadas
- ✅ Documentación completa en `MIGRACION-FIREBASE.md`
- ✅ Todo commiteado y pusheado a GitHub

---

## 📋 PASOS INMEDIATOS (Debes hacer tú)

### 1️⃣ Obtener Credenciales de Firebase (5 minutos)

1. Ve a: https://console.firebase.google.com/project/profe-blog/settings/serviceaccounts/adminsdk
2. Click en **"Generate New Private Key"**
3. Se descargará un archivo JSON (ejemplo: `profe-blog-firebase-adminsdk.json`)

### 2️⃣ Configurar Variables en Netlify (5 minutos)

1. Ve a: https://app.netlify.com/sites/profefranciscopancho-blog/settings/env
2. Click en **"Add a variable"** y agrega estas 7 variables:

```bash
FIREBASE_PROJECT_ID=profe-blog
FIREBASE_PRIVATE_KEY_ID=[del JSON: private_key_id]
FIREBASE_PRIVATE_KEY=[del JSON: private_key - copiar TODO incluyendo -----BEGIN/END-----]
FIREBASE_CLIENT_EMAIL=[del JSON: client_email]
FIREBASE_CLIENT_ID=[del JSON: client_id]
FIREBASE_CLIENT_CERT_URL=[del JSON: client_x509_cert_url]
FIREBASE_DATABASE_URL=https://profe-blog-default-rtdb.firebaseio.com
```

**⚠️ IMPORTANTE para FIREBASE_PRIVATE_KEY:**
- Copia TODO el texto incluyendo `-----BEGIN PRIVATE KEY-----` y `-----END PRIVATE KEY-----`
- Mantén los saltos de línea como `\n`
- Ejemplo: `"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANB...\n-----END PRIVATE KEY-----\n"`

### 3️⃣ Ejecutar Migración (10 minutos)

```powershell
# Crear archivo .env local con las credenciales
cp .env.firebase.example .env

# Editar .env con tus credenciales del JSON
notepad .env

# Ejecutar migración
node migrate-neon-to-firebase.js
```

Deberías ver:
```
✅ Firebase inicializado
📊 1/3 Migrando usuarios...
   ✅ X usuarios migrados
📚 2/3 Migrando cursos...
   ✅ X cursos migrados
🎫 3/3 Migrando reservaciones...
   ✅ X reservaciones migradas
🎉 ¡Migración completada exitosamente!
```

### 4️⃣ Activar Funciones Firebase (2 minutos)

```powershell
# Eliminar funciones viejas de Neon
Remove-Item netlify/functions/get-courses-Francisco.js
Remove-Item netlify/functions/save-courses-Francisco.js
Remove-Item netlify/functions/delete-course-Francisco.js
Remove-Item netlify/functions/check-updates-Francisco.js

# Renombrar funciones Firebase
Rename-Item netlify/functions/get-courses-Francisco-firebase.js get-courses-Francisco.js
Rename-Item netlify/functions/save-courses-Francisco-firebase.js save-courses-Francisco.js
Rename-Item netlify/functions/delete-course-Francisco-firebase.js delete-course-Francisco.js
Rename-Item netlify/functions/check-updates-Francisco-firebase.js check-updates-Francisco.js
```

### 5️⃣ Deploy Final

```powershell
git add .
git commit -m "Migration: Activar funciones Firebase en produccion"
git push origin main
```

Espera 2-3 minutos a que Netlify despliegue.

### 6️⃣ Verificar (5 minutos)

1. Abre: https://www.profefranciscopancho.com/privado/registro-notas?docente=francisco
2. ✅ Los cursos deben aparecer
3. ✅ Intenta guardar cambios
4. ✅ Ve a Firebase Console: https://console.firebase.google.com/project/profe-blog/database/profe-blog-default-rtdb/data
5. ✅ Verifica que los datos se actualizan en tiempo real

---

## 🎉 BENEFICIOS INMEDIATOS

✅ **Sin errores de Neon** - Adiós a los problemas de conexión  
✅ **Datos unificados** - Todo en Firebase  
✅ **Tiempo real** - Los cambios se sincronizan instantáneamente  
✅ **Más estable** - Firebase tiene 99.95% uptime  
✅ **Gratis** - 10GB de almacenamiento incluido  

---

## 🆘 SI ALGO SALE MAL

### Rollback rápido:

```powershell
git revert HEAD
git push origin main
```

Esto restaurará las funciones de Neon.

---

## 📱 CONTACTO

Si tienes dudas durante el proceso:
1. Lee `MIGRACION-FIREBASE.md` (documentación completa)
2. Revisa los logs en Netlify: https://app.netlify.com/sites/profefranciscopancho-blog/deploys
3. Consulta Firebase Console para ver los datos

---

**Tiempo total estimado:** ~30 minutos  
**Dificultad:** Media  
**Estado:** ✅ LISTO PARA EJECUTAR
