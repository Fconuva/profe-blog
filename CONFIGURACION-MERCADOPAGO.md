# Configuración Mercado Pago - Sistema de Pagos

## 📋 Resumen
Sistema de pagos integrado con Mercado Pago para venta de acceso al material ECEP.

## 🔑 Variables de entorno necesarias

### En Vercel / Netlify
Configura estas variables en tu panel de administración:

```bash
# Token de Mercado Pago (usa TEST para sandbox, APP para producción)
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890-xxxxxx-xxxxxxxxxxxx-xxxxxxxx

# Firebase Admin (service account en base64)
FIREBASE_SERVICE_ACCOUNT_BASE64=eyJ0eXBlIjoic2VydmljZV9hY2NvdW50Ii...

# Firebase Database URL
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# URL base de tu sitio (importante para webhooks)
BASE_URL=https://tu-sitio.vercel.app
```

## 🌐 URLs que Mercado Pago necesita

### 1. URL de la tienda (para configuración en MP)
```
https://tu-sitio.vercel.app
```

### 2. Webhook URL (notificaciones de pago)
```
https://tu-sitio.vercel.app/api/mercadopago/webhook
```
⚠️ **Importante**: Configura esta URL en tu panel de Mercado Pago en:
- Integraciones → Webhooks → Agregar webhook
- Eventos a suscribir: `payment` (solo necesitas este)

### 3. URLs de retorno (automáticas)
El sistema ya las configura automáticamente:
- Success: `https://tu-sitio.vercel.app/comprar/success/`
- Failure: `https://tu-sitio.vercel.app/comprar/failure/`
- Pending: `https://tu-sitio.vercel.app/comprar/pending/`

## 🔧 Configuración paso a paso

### Paso 1: Obtener credenciales de Mercado Pago
1. Ingresa a https://www.mercadopago.cl/developers/panel
2. Ve a "Tus integraciones" → "Credenciales"
3. Copia el **Access Token** de:
   - **Sandbox (pruebas)**: Empieza con `TEST-`
   - **Producción**: Empieza con `APP-`

### Paso 2: Configurar webhook en Mercado Pago
1. Ve a https://www.mercadopago.cl/developers/panel
2. Click en "Webhooks" (menú lateral)
3. Click en "Crear webhook"
4. Completa:
   - **URL de producción**: `https://tu-sitio.vercel.app/api/mercadopago/webhook`
   - **Eventos**: Selecciona solo `payment`
   - **Modo**: Sandbox (para pruebas) o Producción
5. Guarda

### Paso 3: Configurar variables en Vercel
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Añade cada variable (ver sección anterior)
4. **Importante**: Añádelas para todos los entornos (Production, Preview, Development)

### Paso 4: Desplegar
```bash
git add .
git commit -m "feat(payments): Configurar sistema de pagos Mercado Pago"
git push origin main
```

Vercel desplegará automáticamente.

## 🧪 Probar en Sandbox

### 1. Crear una compra de prueba
1. Ve a `https://tu-sitio.vercel.app/comprar/`
2. Completa el formulario con un email de prueba
3. Selecciona un plan
4. Click en "Pagar con Mercado Pago"

### 2. Completar el pago en sandbox
Mercado Pago te redirigirá a su checkout. Usa estas tarjetas de prueba:

**Tarjeta aprobada:**
- Número: `5031 7557 3453 0604`
- CVV: `123`
- Fecha: Cualquier fecha futura
- Titular: `APRO`

**Tarjeta rechazada:**
- Número: `5031 7557 3453 0604`
- CVV: `123`
- Fecha: Cualquier fecha futura
- Titular: `OCHO`

Más tarjetas de prueba: https://www.mercadopago.cl/developers/es/docs/your-integrations/test/cards

### 3. Verificar creación de usuario
Después de un pago aprobado:
1. Ve a Firebase Console → Realtime Database
2. Busca en `/users/` → Deberías ver un nuevo usuario
3. Busca en `/payment_created_accounts/` → Deberías ver las credenciales generadas

## 📊 Flujo completo

```
Usuario → /comprar/
   ↓
Completa formulario → POST /api/mercadopago/create_preference
   ↓
Redirección → Mercado Pago Checkout
   ↓
Completa pago → Mercado Pago envía notificación
   ↓
POST /api/mercadopago/webhook → Verifica pago
   ↓
Crea usuario en Firebase → Almacena credenciales
   ↓
Usuario redirección → /comprar/success/
   ↓
Usuario recibe credenciales (futuro: email automático)
```

## 🔒 Seguridad

### Actual (sandbox/MVP)
- Contraseñas generadas aleatoriamente
- Almacenadas en Base64 en `/users/`
- Credenciales planas en `/payment_created_accounts/` (solo para admin)

### Recomendado (producción)
- [ ] Usar Firebase Authentication (createUser) en vez de Realtime DB
- [ ] Enviar email automático con link de activación
- [ ] No almacenar contraseñas en texto/base64
- [ ] Implementar rate limiting en endpoints
- [ ] Validar firma de webhook de Mercado Pago
- [ ] Logs de auditoría de transacciones

## 🐛 Troubleshooting

### El webhook no se ejecuta
- Verifica que la URL del webhook sea pública (no localhost)
- Revisa logs de Vercel: `vercel logs`
- Confirma que el webhook esté configurado en Mercado Pago
- Usa ngrok para exponer localhost en desarrollo: `ngrok http 3000`

### Error "access_token inválido"
- Verifica que `MERCADOPAGO_ACCESS_TOKEN` esté configurado
- Usa token TEST para sandbox, APP para producción
- Regenera el token en el panel de Mercado Pago si es necesario

### Usuario no se crea en Firebase
- Verifica `FIREBASE_SERVICE_ACCOUNT_BASE64` y `FIREBASE_DATABASE_URL`
- Revisa permisos de la service account (debe tener acceso a Realtime DB)
- Mira logs del webhook en Vercel

### Redirección incorrecta después del pago
- Verifica que `BASE_URL` apunte a tu dominio de producción
- No uses `http://` en producción, solo `https://`

## 📞 Soporte
Si tienes problemas, revisa:
- Logs de Vercel: https://vercel.com/dashboard
- Panel de Mercado Pago: https://www.mercadopago.cl/developers/panel
- Firebase Console: https://console.firebase.google.com

## 🚀 Siguiente pasos recomendados
1. [ ] Implementar envío de email automático con credenciales
2. [ ] Migrar de Realtime DB a Firebase Auth
3. [ ] Añadir panel de admin para ver transacciones
4. [ ] Implementar sistema de renovación/suscripciones
5. [ ] Añadir más métodos de pago (PayPal, transferencia)
