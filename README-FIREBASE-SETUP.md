# 🔥 Reparación Base de Datos Firebase - Registro de Notas

## 📊 Estado Actual

| ✅ Completado | Descripción |
|--------------|-------------|
| ✅ | Credencial Firebase regenerada correctamente |
| ✅ | Archivo `firebase-service-account-base64.txt` creado (3176 caracteres) |
| ✅ | Valor copiado al portapapeles automáticamente |
| ✅ | Scripts de verificación creados |

---

## 🚀 Configuración en Vercel (3 pasos)

### Paso 1️⃣: Acceder a Variables de Entorno

Haz clic aquí → [**Configuración Vercel**](https://vercel.com/fconuvas-projects/profefranciscopancho-blog/settings/environment-variables)

---

### Paso 2️⃣: Agregar Variable FIREBASE_SERVICE_ACCOUNT_BASE64

1. Haz clic en **"Add New"** (botón azul) o **edita** la variable existente

2. Completa:
   ```
   Name:  FIREBASE_SERVICE_ACCOUNT_BASE64
   Value: [Presiona CTRL+V para pegar desde el portapapeles]
   
   Environments:
   ☑️ Production
   ☑️ Preview  
   ☑️ Development
   ```

3. Haz clic en **"Save"**

---

### Paso 3️⃣: Agregar Variable FIREBASE_DATABASE_URL

1. Haz clic en **"Add New"** nuevamente

2. Completa:
   ```
   Name:  FIREBASE_DATABASE_URL
   Value: https://profe-blog-default-rtdb.firebaseio.com
   
   Environments:
   ☑️ Production
   ☑️ Preview
   ☑️ Development
   ```

3. Haz clic en **"Save"**

---

## 🔄 Redesplegar

### Opción A - Automático (Git Push):

```powershell
git add .
git commit -m "Configurar Firebase en Vercel"
git push origin main
```

### Opción B - Manual en Vercel:

1. Ve a [Deployments](https://vercel.com/fconuvas-projects/profefranciscopancho-blog/deployments)
2. Haz clic en **⋮** (3 puntos) del último deployment
3. Selecciona **"Redeploy"**
4. Espera ~30-60 segundos

---

## ✅ Verificación

### Después del Deploy, Ejecuta:

```powershell
.\verificar-firebase-produccion.ps1
```

### O Prueba Manualmente:

Abre este link en tu navegador:

```
https://www.profefranciscopancho.com/api/get-courses-Francisco?username=francisco_fconuva
```

**Respuesta esperada:**
```json
{
  "success": true,
  "courses": [],
  "message": "No hay cursos guardados"
}
```

✅ **Si ves este JSON** → ¡TODO CORRECTO!  
❌ **Si ves un error** → Ver sección "Troubleshooting" abajo

---

## 🧪 Diagnóstico en la Aplicación

1. Abre: https://www.profefranciscopancho.com/privado/registro-notas?docente=francisco

2. Ve a la pestaña **"Configuración"**

3. Haz clic en **"Ejecutar Diagnóstico"**

4. Verifica que todos pasen:
   - ✅ Conexión a Base de Datos
   - ✅ LocalStorage  
   - ✅ Sincronización

---

## 🔧 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `regenerar-firebase-service-account.ps1` | Regenera la credencial desde `.env` |
| `verificar-firebase-produccion.ps1` | Verifica que la API funciona en producción |

---

## ⚠️ Troubleshooting

### Error 404: API no encontrada

**Causa**: Los archivos `/api/*.js` no están en producción

**Solución**:
```powershell
git add api/
git commit -m "Agregar APIs de Firebase"
git push origin main
```

### Error 500: Internal Server Error

**Causas posibles**:
1. Variable `FIREBASE_SERVICE_ACCOUNT_BASE64` incompleta
2. No seleccionaste los 3 ambientes (Production/Preview/Development)
3. La credencial no está en formato Base64 correcto

**Solución**:
1. Verifica que pegaste los **3176 caracteres completos**
2. Asegúrate de seleccionar todos los ambientes
3. Revisa los logs en Vercel: [Ver Logs](https://vercel.com/fconuvas-projects/profefranciscopancho-blog/logs)

### Error: No sincroniza con la base de datos

**Solución**:
1. Ejecuta el diagnóstico en la app (Configuración → Ejecutar Diagnóstico)
2. Haz clic en **"Sincronización Manual"**
3. Verifica tu conexión a internet
4. Revisa que las variables en Vercel estén correctas

---

## 📁 Archivos Importantes

| Archivo | Descripción | ¿Subir a Git? |
|---------|-------------|---------------|
| `firebase-service-account-base64.txt` | Credencial regenerada | ❌ NO (gitignore) |
| `.env` | Variables locales | ❌ NO (gitignore) |
| `INSTRUCCIONES-REPARAR-BASE-DATOS.md` | Instrucciones completas | ✅ SÍ |
| `regenerar-firebase-service-account.ps1` | Script de regeneración | ✅ SÍ |
| `verificar-firebase-produccion.ps1` | Script de verificación | ✅ SÍ |
| `/api/get-courses-Francisco.js` | API de lectura | ✅ SÍ |
| `/api/save-courses-Francisco.js` | API de escritura | ✅ SÍ |

---

## 🎯 Resultado Final

Una vez configurado correctamente:

- ✅ Sistema de registro de notas sincroniza automáticamente con Firebase
- ✅ Datos compartidos entre todos los dispositivos en tiempo real
- ✅ No más errores 404 en las APIs
- ✅ Indicador "Modo Colaborativo" muestra conexión verde
- ✅ Auto-guardado cada 30 segundos en la nube
- ✅ Backup automático en localStorage (modo offline)

---

## 🆘 Soporte

Si después de seguir todos los pasos aún tienes problemas:

1. **Ejecuta diagnóstico**:
   ```powershell
   .\verificar-firebase-produccion.ps1
   ```

2. **Revisa logs de Vercel**:  
   [Ver Logs en Tiempo Real](https://vercel.com/fconuvas-projects/profefranciscopancho-blog/logs)

3. **Verifica configuración**:  
   [Variables de Entorno](https://vercel.com/fconuvas-projects/profefranciscopancho-blog/settings/environment-variables)

---

**Última actualización**: 25 de noviembre de 2025  
**Estado**: ✅ Credencial regenerada y lista para configurar  
**Acción requerida**: Configurar variables en Vercel (ver Paso 2️⃣ arriba)
