# Configuración de Neon Database en Netlify

## Problema
El formulario de paseo docentes no guarda datos porque falta la variable de entorno `NETLIFY_DATABASE_URL` en Netlify.

## Solución

### Paso 1: Obtener el Connection String de Neon
1. Ve a https://console.neon.tech/app/projects
2. Selecciona tu proyecto
3. En la sección "Connection string", copia el URL que dice:
   ```
   postgresql://[user]:[password]@[host]/[dbname]?sslmode=require
   ```

### Paso 2: Configurar en Netlify
1. Ve a tu sitio en Netlify
2. Abre **Site Settings** → **Build & Deploy** → **Environment**
3. Haz clic en **Edit variables**
4. Agrega una nueva variable:
   - **Key**: `NETLIFY_DATABASE_URL`
   - **Value**: Pega el connection string de Neon
5. Haz clic en **Save**

### Paso 3: Re-deploy
1. Ve a **Deploys** en Netlify
2. Haz clic en **Trigger deploy** → **Deploy site**
3. Espera a que termine el deployment

## Verificación
Después del deployment:
- El formulario en `/paseo-docentes/` guardará datos nuevamente
- Los asientos del bus se mostrarán correctamente
- Las reservas nuevas se guardarán en Neon

## Alternativa: Usar `.env` local (solo para desarrollo)
```
NETLIFY_DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

## Notas importantes
- ⚠️ NO agregues `.env` a Git (usa `.env.example` como referencia)
- ✅ `NETLIFY_DATABASE_URL` debe estar en Netlify, no en el repositorio
- ✅ La URL debe terminar con `?sslmode=require` para Neon
- ✅ Las funciones Netlify accederán automáticamente a esta variable

## Functions que usan NETLIFY_DATABASE_URL
- `netlify/functions/create-reservation.js` - Guardar nueva reserva
- `netlify/functions/get-reservations.js` - Obtener lista de asientos ocupados
- `netlify/functions/delete-reservation.js` - Eliminar una reserva
- `netlify/functions/check-reservation.js` - Verificar reserva existente
