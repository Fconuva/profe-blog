# 🔥 Configuración de Firebase para Paseo de Docentes

## 📋 Credenciales Necesarias

Para que la página de inscripción funcione correctamente, necesitas configurar Firebase con tus credenciales reales.

### 🔑 Paso 1: Obtener Credenciales de Firebase

1. **Ve a la Consola de Firebase:**
   - URL: https://console.firebase.google.com/

2. **Selecciona o crea tu proyecto:**
   - Si no existe, crea un nuevo proyecto llamado "profefranciscopancho-blog"
   - Si ya existe, selecciónalo

3. **Agrega una aplicación web:**
   - Haz clic en el ícono **</>** (Web)
   - Dale un nombre: "Paseo Docentes"
   - **NO marques** "También configura Firebase Hosting"
   - Haz clic en "Registrar app"

4. **Copia las credenciales:**
   - Verás un objeto `firebaseConfig` con tus credenciales
   - Copia TODO el objeto

### 📝 Paso 2: Configurar Firestore Database

1. **En el menú lateral de Firebase, ve a:**
   - "Firestore Database"

2. **Crear la base de datos:**
   - Haz clic en "Crear base de datos"
   - Selecciona **"Modo de producción"**
   - Elige la ubicación: `southamerica-east1` (Chile)
   - Haz clic en "Habilitar"

3. **Configurar Reglas de Seguridad:**
   - Ve a la pestaña "Reglas"
   - Reemplaza el contenido con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Colección para inscripciones del paseo de docentes
    match /paseo-docentes-reservas/{document=**} {
      allow read: if true;  // Permite lectura pública
      allow write: if true; // Permite escritura pública
    }
  }
}
```

   - Haz clic en "Publicar"

⚠️ **NOTA:** Estas reglas son permisivas para desarrollo. En producción considera agregar validaciones.

### 🔧 Paso 3: Actualizar el archivo HTML

1. **Abre el archivo:** `paseo-docentes.html`

2. **Busca las líneas 15-21** (la sección `firebaseConfig`)

3. **Reemplaza los valores** con tus credenciales reales de Firebase:

```javascript
const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "TU_PROJECT_ID.firebaseapp.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_PROJECT_ID.appspot.com",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};
```

### ✅ Paso 4: Verificar la Configuración

1. **Guarda el archivo**

2. **Ejecuta el servidor local:**
   ```bash
   npm run build
   npx @11ty/eleventy --serve
   ```

3. **Abre en el navegador:**
   - http://localhost:8080/paseo-docentes/

4. **Prueba el formulario:**
   - Completa los datos personales
   - Confirma asistencia
   - Selecciona transporte en bus
   - Elige un asiento
   - Confirma la reserva

5. **Verifica en Firebase Console:**
   - Ve a Firestore Database
   - Deberías ver la colección `paseo-docentes-reservas`
   - Deberías ver un documento con los datos de prueba

### 🚀 Paso 5: Desplegar a Netlify

Una vez que todo funcione localmente:

```bash
# Construir el sitio
npm run build

# Si tienes Netlify CLI instalado:
netlify deploy --prod

# O simplemente haz push a tu repositorio:
git add .
git commit -m "feat: Add Firebase configuration for teacher outing form"
git push origin main
```

## 📚 Estructura de Datos en Firestore

Cada reserva se guarda con esta estructura:

```javascript
{
  nombre: "Juan",
  apellido: "Pérez",
  email: "juan@example.com",
  telefono: "+56912345678",
  asistira: "si",
  transporte: "bus",
  asiento: 15,
  fecha: "2024-10-13T12:00:00.000Z",
  id: "1697200000000"
}
```

## 🔒 Mejoras de Seguridad (Opcional)

Para producción, considera implementar:

1. **Reglas de validación más estrictas:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /paseo-docentes-reservas/{reservaId} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll([
        'nombre', 'apellido', 'email', 'telefono', 
        'asistira', 'transporte', 'fecha', 'id'
      ]) && request.resource.data.email.matches('.*@.*\\..*');
      allow update, delete: if false; // No permitir actualizaciones ni eliminaciones
    }
  }
}
```

2. **Límite de reservas por email:**
   - Implementar una función Cloud para verificar duplicados

3. **Captcha o reCAPTCHA:**
   - Prevenir spam y reservas automáticas

## ❓ Solución de Problemas

### Error: "Firebase: Error (auth/invalid-api-key)"
- Verifica que copiaste correctamente el `apiKey`
- Asegúrate de no tener espacios o comillas extra

### Error: "Missing or insufficient permissions"
- Revisa las reglas de Firestore
- Asegúrate de que la colección esté permitida

### Los asientos no se actualizan en tiempo real
- Verifica que Firestore esté configurado correctamente
- Revisa la consola del navegador (F12) para ver errores

### No aparecen datos en Firestore
- Verifica que el `projectId` sea correcto
- Asegúrate de que Firebase Auth esté habilitado (autenticación anónima)

## 📞 Contacto

Si necesitas ayuda adicional, contacta al administrador del sitio.
