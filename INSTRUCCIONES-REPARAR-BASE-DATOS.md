# 🔧 REPARACIÓN BASE DE DATOS - REGISTRO DE NOTAS

## ✅ Estado Actual

La credencial de Firebase ha sido **regenerada correctamente** en formato Base64.

- **Archivo generado**: `firebase-service-account-base64.txt`
- **Tamaño**: 3176 caracteres
- **Copiado al portapapeles**: ✅ SÍ

---

## 📋 PASOS PARA CONFIGURAR EN VERCEL

### **Paso 1: Acceder a Configuración de Variables de Entorno**

Abre este enlace en tu navegador:

```
https://vercel.com/fconuvas-projects/profefranciscopancho-blog/settings/environment-variables
```

### **Paso 2: Configurar FIREBASE_SERVICE_ACCOUNT_BASE64**

1. **Busca** si ya existe la variable `FIREBASE_SERVICE_ACCOUNT_BASE64`
   
   - ✅ **Si existe**: Haz clic en los **3 puntos (⋮)** → **Edit**
   - ❌ **Si NO existe**: Haz clic en **Add New** (botón azul)

2. **Completa los campos**:

   | Campo | Valor |
   |-------|-------|
   | **Name** | `FIREBASE_SERVICE_ACCOUNT_BASE64` |
   | **Value** | *Pega el contenido del portapapeles (Ctrl+V)* |
   | **Environment** | ☑️ Production<br>☑️ Preview<br>☑️ Development |

3. **Guarda** haciendo clic en **Save**

---

### **Paso 3: Configurar FIREBASE_DATABASE_URL**

1. **Agrega otra variable** haciendo clic en **Add New**

2. **Completa los campos**:

   | Campo | Valor |
   |-------|-------|
   | **Name** | `FIREBASE_DATABASE_URL` |
   | **Value** | `https://profe-blog-default-rtdb.firebaseio.com` |
   | **Environment** | ☑️ Production<br>☑️ Preview<br>☑️ Development |

3. **Guarda** haciendo clic en **Save**

---

### **Paso 4: Redeploy (Redesplegar)**

**Opción A - Automático** (recomendado):
```powershell
git add .
git commit -m "Actualizar configuración Firebase"
git push origin main
```

**Opción B - Manual**:
1. Ve a: https://vercel.com/fconuvas-projects/profefranciscopancho-blog/deployments
2. Haz clic en los **3 puntos (⋮)** del último deployment
3. Selecciona **Redeploy**
4. Confirma con **Redeploy**

---

## 🧪 VERIFICACIÓN

Una vez completado el deploy (tarda ~30 segundos), verifica que funciona:

### **Test 1: API de Lectura**

Abre este enlace en tu navegador:

```
https://www.profefranciscopancho.com/api/get-courses-Francisco?username=francisco_fconuva
```

**Respuesta esperada** (JSON):
```json
{
  "success": true,
  "courses": [],
  "message": "No hay cursos guardados"
}
```

✅ **Si ves este JSON**: La configuración está **correcta**  
❌ **Si ves un error**: Revisa que las variables estén bien configuradas

---

### **Test 2: Sistema de Registro de Notas**

1. Abre: https://www.profefranciscopancho.com/privado/registro-notas?docente=francisco

2. En la página, ve a la pestaña **"Configuración"**

3. Haz clic en **"Ejecutar Diagnóstico"**

4. Verifica que todos los tests pasen:
   - ✅ Conexión a Base de Datos
   - ✅ LocalStorage
   - ✅ Sincronización

---

## 🔍 TROUBLESHOOTING

### Problema: API devuelve error 500

**Solución**:
1. Ve a Vercel → Deployments → Último deployment → **Functions**
2. Haz clic en `/api/get-courses-Francisco`
3. Revisa los logs para ver el error específico
4. Verifica que `FIREBASE_SERVICE_ACCOUNT_BASE64` esté copiado **completo** (3176 caracteres)

### Problema: "FIREBASE_SERVICE_ACCOUNT_BASE64 no está configurada"

**Solución**:
1. Asegúrate de haber guardado las variables en Vercel
2. Espera 1-2 minutos para que se apliquen
3. Haz un nuevo deploy (git push o Redeploy manual)

### Problema: Variables no se aplican

**Solución**:
1. Verifica que seleccionaste **Production, Preview, Development**
2. Haz clic en **Save** después de cada variable
3. Haz un redeploy completo (no solo refresh)

---

## 📁 ARCHIVOS IMPORTANTES

- ✅ `firebase-service-account-base64.txt` - Credencial regenerada (3176 caracteres)
- ✅ `regenerar-firebase-service-account.ps1` - Script de regeneración
- ✅ `.env` - Variables locales (NO subir a Git)
- ✅ `/api/get-courses-Francisco.js` - API de lectura
- ✅ `/api/save-courses-Francisco.js` - API de escritura

---

## 🎯 RESULTADO ESPERADO

Una vez completados todos los pasos:

1. ✅ El sistema de registro de notas sincronizará con Firebase automáticamente
2. ✅ Los datos serán compartidos entre todos los dispositivos
3. ✅ No habrá errores 404 en las APIs
4. ✅ El indicador de "Modo Colaborativo" mostrará conexión verde
5. ✅ Los cambios se guardarán en la nube automáticamente cada 30 segundos

---

## 📞 SOPORTE

Si encuentras problemas:

1. Ejecuta el diagnóstico en **Configuración → Ejecutar Diagnóstico**
2. Copia el resultado completo
3. Revisa los logs en Vercel: https://vercel.com/fconuvas-projects/profefranciscopancho-blog/logs

---

**Última actualización**: 25 de noviembre de 2025  
**Script ejecutado**: ✅ `regenerar-firebase-service-account.ps1`  
**Credencial generada**: ✅ 3176 caracteres en Base64
