# 🔥 SOLUCIÓN RÁPIDA: Configurar Firebase en Vercel

## ⚡ Pasos Rápidos (5 minutos)

### 1️⃣ Obtener Credenciales de Firebase

1. **Abrir:** https://console.firebase.google.com/project/profe-blog/settings/serviceaccounts/adminsdk

2. **Click en:** "Generate new private key" (botón rojo)

3. **Confirmar** y descargar el archivo JSON

4. **Guardar** el archivo como `firebase-service-account.json` en la raíz del proyecto

5. **Ejecutar:**
   ```bash
   python obtener-credenciales-firebase.py
   ```

Esto actualizará automáticamente tu `.env` local con las credenciales correctas.

---

### 2️⃣ Configurar en Vercel (CRÍTICO)

1. **Abrir:** https://vercel.com/dashboard

2. **Seleccionar** tu proyecto `profefranciscopancho-blog`

3. **Ir a:** Settings → Environment Variables (menú izquierdo)

4. **Agregar estas 7 variables** (copiar desde tu `.env` actualizado):

   | Variable | Dónde está |
   |----------|------------|
   | `FIREBASE_PROJECT_ID` | Línea 8 del .env |
   | `FIREBASE_PRIVATE_KEY` | Línea 9 del .env (incluir comillas) |
   | `FIREBASE_PRIVATE_KEY_ID` | Línea 10 del .env |
   | `FIREBASE_CLIENT_EMAIL` | Línea 11 del .env |
   | `FIREBASE_CLIENT_ID` | Línea 12 del .env |
   | `FIREBASE_CLIENT_CERT_URL` | Línea 13 del .env |
   | `FIREBASE_DATABASE_URL` | Línea 14 del .env |

5. **Para cada variable:**
   - Click "Add New"
   - Pegar nombre de variable
   - Pegar valor (copiar desde .env)
   - Seleccionar: ✅ Production, ✅ Preview, ✅ Development
   - Click "Save"

6. **Redeploy:**
   - Ir a "Deployments"
   - Click en el último deployment
   - Click "⋯" → "Redeploy"

---

### 3️⃣ Verificar que Funciona

Esperar 2-3 minutos y abrir:
```
https://www.profefranciscopancho.com/privado/registro-notas?docente=francisco
```

**Debería ver:**
- ✅ Sin errores 500
- ✅ Cursos cargando desde Firebase
- ✅ Sincronización funcionando

---

## 🆘 Si No Tienes Acceso a Firebase Console

Si no puedes acceder a Firebase Console, necesitas:

1. **Credenciales del proyecto** (solicitar a quien tiene acceso)
2. O crear un **nuevo Service Account** desde:
   - Google Cloud Console → IAM & Admin → Service Accounts
   - Para proyecto: `profe-blog`

---

## 📝 Notas Importantes

- El archivo `.env` **NO se sube a GitHub** (está en .gitignore)
- Las variables **DEBEN** configurarse manualmente en Vercel
- La `FIREBASE_PRIVATE_KEY` debe tener `\n` (no saltos de línea reales)
- Formato correcto: `"-----BEGIN PRIVATE KEY-----\n....\n-----END PRIVATE KEY-----\n"`

---

## ✅ Checklist Final

- [ ] Descargado `firebase-service-account.json`
- [ ] Ejecutado `obtener-credenciales-firebase.py`
- [ ] Archivo `.env` actualizado localmente
- [ ] 7 variables agregadas en Vercel
- [ ] Proyecto redeployado
- [ ] Registro de notas funciona sin error 500

**Tiempo total estimado:** 5-10 minutos
