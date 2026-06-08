# Subida de adjuntos del portafolio (hasta 3 archivos)

Permite que el docente suba, desde su panel (`/dashboard/`), hasta **3 archivos**
del trabajo colaborativo (Módulo 3): el **medio de verificación** (acta, minuta,
correo, registro de asistencia) y la **evidencia del problema**.

- **Formatos:** PDF, Word (`.doc`/`.docx`), PNG, JPG/JPEG, WEBP, HEIC/HEIF.
- **Máximo:** 3 archivos, **20 MB cada uno**.
- **Dónde aparece:** sección Módulo 3 del dashboard, bloque "Adjuntar archivos del trabajo colaborativo".

## Cómo funciona (arquitectura)

A diferencia de la lista de estudiantes (que se sube en base64 por
`/api/portafolio-lista-upload`, limitada a ~3 MB por el límite de cuerpo de
Vercel), los adjuntos se suben **directo del navegador a Firebase Storage** con
el SDK web (`firebase-storage-compat`). Esto evita el límite de Vercel y soporta
archivos grandes como un acta escaneada de varias páginas.

- **Ruta en Storage:** `portafolio-adjuntos/{uid}/{timestamp}-{nombre}`.
- **Metadatos en DB:** `portafolios/{uid}/datosPortafolio/adjuntosM3` (array con
  `name`, `size`, `contentType`, `storagePath`, `downloadUrl`, `uploadedAt`).
- El equipo descarga cada archivo con el `downloadUrl` (enlace con token, no
  requiere permisos extra).

## ⚠️ Paso único de configuración: reglas de Storage

Para que el navegador del docente pueda escribir en su carpeta, hay que publicar
las reglas de `storage.rules` (en la raíz de este repo). **Se hace una sola vez.**

### Opción A — Consola de Firebase (recomendada, sin instalar nada)

1. Entrar a <https://console.firebase.google.com/> → proyecto **profe-blog**.
2. Menú **Build → Storage → pestaña Rules (Reglas)**.
3. Pegar el contenido de `storage.rules` y pulsar **Publicar**.

### Opción B — Firebase CLI

Si usas la CLI de Firebase, añade a `firebase.json`:

```json
{ "storage": { "rules": "storage.rules" } }
```

y luego:

```bash
firebase deploy --only storage
```

> Si las reglas no están publicadas, la subida falla con `storage/unauthorized`
> y el docente verá el mensaje: *"No tienes permiso para subir todavía. Avísale
> al equipo (falta activar el permiso de Storage)."*

## Verificar

1. Iniciar sesión en `/dashboard/` como un docente.
2. Ir a Módulo 3 → "Adjuntar archivos del trabajo colaborativo" → **Subir archivos**.
3. Subir un PDF (p. ej. el acta). Debe aparecer en la lista con su tamaño y un
   enlace **ver**, y persistir al recargar la página.
4. En Firebase: `portafolios/{uid}/datosPortafolio/adjuntosM3` debe tener el
   registro, y el archivo debe estar en Storage bajo `portafolio-adjuntos/{uid}/`.
