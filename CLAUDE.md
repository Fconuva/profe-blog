# CLAUDE.md — profe-blog (profefranciscopancho.com)

## ⚠️ Carpeta de trabajo (CRÍTICO — leer primero)
- Trabaja **SIEMPRE** en este clon local: `C:\dev\profe-blog`.
- **NO** uses la copia dentro de OneDrive (`E:\ONEDRIVE\...\2026\profefconuva`). OneDrive sincroniza la carpeta `.git` y la **CORROMPE**: provoca `fatal: mmap failed: Invalid argument`, commits fantasma y divergencias entre PCs (ya causó pérdida de trabajo). Si te invocan desde la carpeta de OneDrive, **detente** y haz el trabajo en `C:\dev\profe-blog`.
- Commitea con identidad: `git config user.email fconuva@gmail.com`.

## Deploy
- **Sitio** (Eleventy): hacer `git push origin HEAD:main` a GitHub `Fconuva/profe-blog` → Vercel auto-despliega (proyecto `profefconuva`). No hay que correr Vercel a mano.
- **Reglas de Firebase** (`firebase-rules.json`): NO se despliegan por Vercel. Usar `npx firebase deploy --only database --project profe-blog`.

## Pagos (portafolio)
- `paymentStatus`: `approved`/`aprobado` (pago completo), `abono` (1ª cuota fija $100.000, da acceso, calcula `saldoPendiente`), `gratis` (regalado: acceso completo, `paymentAmount=0`, sale en Pagados pero NO suma al monto). El recibo PDF y el panel admin (`admin/index.html`) manejan estos estados.
- Webhook MercadoPago: `api/mercadopago/webhook.js` valida la firma `x-signature` y marca pagos `approved` automáticamente. Requiere en Vercel: `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_WEBHOOK_SECRET`, `FIREBASE_SERVICE_ACCOUNT_BASE64`, y registrar la URL `https://www.profefranciscopancho.com/api/mercadopago/webhook` en el panel de MercadoPago (evento Pagos).
- El servidor usa Firebase Admin SDK, que **ignora** las reglas RTDB.

## Seguridad RTDB
- Las reglas (`firebase-rules.json`) impiden que un usuario se auto-asigne `role=admin` o se auto-apruebe el pago, y restringen la lectura de `users` solo a admin. No relajar esto.

## Otros
- La plataforma de estudiantes (`estudiacest/`) tiene sus propias reglas en `AGENTS.md`.
