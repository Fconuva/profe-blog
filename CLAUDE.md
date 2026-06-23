# CLAUDE.md — profe-blog (profefranciscopancho.com)

## ⚠️ Carpeta de trabajo (CRÍTICO — leer primero)
- Trabaja **SIEMPRE** en este clon local: `C:\Users\franc\profe-blog-work`.
- **NO** uses la copia dentro de OneDrive. OneDrive sincroniza la carpeta `.git` y la **CORROMPE**: provoca `fatal: mmap failed: Invalid argument`, commits fantasma y divergencias entre PCs (ya causó pérdida de trabajo). Si te invocan desde la carpeta de OneDrive, **detente** y haz el trabajo en `C:\Users\franc\profe-blog-work`.
- **Antes de cualquier cambio: `git pull`.** Este repo mezcla VARIOS productos (sitio de portafolios + plataforma de estudio ECEP `/evaluaciones/` + estudiacest). Desplegar desde un clon desactualizado **ARRASTRA/regresa** lo de otro producto. Pull primero, commitea SOLO tus archivos, revisa el `git diff` antes de pushear.
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

## Plataforma de estudio ECEP (`/evaluaciones/`) — ⚠️ EN PRODUCCIÓN Y MONETIZADA, NO romper
- Producto APARTE del portafolio: dossiers de estudio para la prueba ECEP (Carrera Docente). Publicados y en vivo: **Generalista, Lenguaje, Matemática, Parvularia** (Historia en curso, sin publicar).
- **Cobro por dossier = $20.000** (link Mercado Pago `https://mpago.la/1wxtybe`). Gate de pago en `js/ecep-auth.js`: el dossier se detecta por URL; sin `ecep_accesos/{uid}/{dossierId}=true` en RTDB → **paywall** (no contenido). Login solo Google. Admin = email `fconuva@gmail.com` (ve todo + otorga acceso manual en `/evaluaciones/admin/`). **Este pago es MANUAL** (NO usa el webhook de MercadoPago de portafolios — son flujos separados, no los mezcles).
- **Protección de contenido** (derechos de autor): marca de agua con el correo + bloqueo copiar/seleccionar/imprimir, en `ecep-auth.js` + `css/ecep-portal.css`. No quitar.
- **Archivos del producto** (NO sobrescribir desde trabajo de portafolios): `evaluaciones/**`, `js/ecep-auth.js`, `js/ecep-dossier.js`, `css/ecep-dossier.css`, `css/ecep-portal.css`, `imagenes/ecep/**`, reglas RTDB `ecep_usuarios`/`ecep_accesos`. Al tocar los `ecep-*.js/.css` hay que **subir `?v=N`** en TODAS las `evaluaciones/**/*.njk` (loop sed) o el navegador sirve el cacheado (actual: **v8**).
- Contexto completo del proyecto: `Portabot-2026/ECEP_2026/` (CONTEXTO, PLAYBOOK, PLAN). Memorias `ecep-plataforma-estudio`, `ecep-pago-acceso-proteccion`.

## Otros
- La plataforma de estudiantes (`estudiacest/`) tiene sus propias reglas en `AGENTS.md`.
