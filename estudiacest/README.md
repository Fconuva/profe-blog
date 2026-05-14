# Estudia CEST

Proyecto aislado para mover las rutas `/estudiantes`, `/lecturas`, `/nm4` y `/np` al dominio `estudiacest.com` usando Vercel y Firebase Realtime Database.

## Arquitectura vigente

- La raiz `index.html` redirige a `/lecturas/`.
- `lecturas/index.html` es el login compartido del sitio.
- `lecturas/index.html` incluye acceso `Administrador` hacia `/admin/`.
- `admin/index.html` es el pre-admin docente para elegir entre el panel SIMCE/Estudiantes y el panel Lecturas.
- El destino tras login se resuelve por curso, `target`, asignaciones Lecturas y perfil completo.
- Las sesiones de la plataforma estudiantes viven en `plataforma_estudiantes/sesiones/{sesionId}` y sus respuestas/resultados en `respuestas/{sesionId}/{uid}` y `resultados/{sesionId}/{uid}`.
- NM4 es solo para cursos TP (`4A-TP` a `4E-TP`).
- PAES actual (`3A-HC`, `3B-HC`, `4A-HC`, `4B-HC`) queda fuera de NM4 mientras la seccion PAES no exista.

## Referencia operativa

- Ver `../../00 - Workspace y Soporte/03 - Deploy y Referencia/ESTUDIACEST_WORKFLOW_OPERATIVO_2026.md` para flujo de auditoria, validacion y deploy.

## Calificacion de sesiones

- Antes de recalcular una sesion, confirmar si la nota final usa solo alternativas o alternativas + escritura, y con que ponderacion exacta.
- No usar `1/1 notas`, `notas_evaluadas` o una `nota` ya visible como prueba suficiente de escritura almacenada.
- Verificar primero el archivo dueño de la sesion: la escritura puede guardarse en `notes`, `ticket`, `thesisContexts` u otra estructura custom.
- Export de revision: `node scripts/export-session-course-review.js --session <id> --course <CURSO> [--submitted-only]`.
- Recalculo combinado: `node scripts/apply-session-writing-grades.js --session <id> --course <CURSO> --input <archivo>` y luego `--apply` solo despues del `dry-run`.
- Hallazgo verificado: `sesion-u2-1` depende de `estudiantes/guia-u2-s1-columna-opinion.html` y guarda escritura en `ticket` y `thesisContexts`; `2B-HC` tuvo `28/28` enviados con `ticket` y `26/28` con `thesisContexts`.

## Variables necesarias

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_DATABASE_URL`
- `ALLOWED_ORIGINS`

Usa `.env.example` como plantilla local y deja `.env.local` fuera de git.

## Firebase

1. Realtime Database: `https://estudiacest-default-rtdb.firebaseio.com`
2. Reglas: `firebase deploy --only database`
3. Authentication: habilitar proveedor `Email/Password`
4. Authorized domains: agregar `estudiacest.com`, `www.estudiacest.com` y el dominio preview que entregue Vercel si se necesita probar antes

## Respaldo de base antigua

1. Mantener el `.env.local` del proyecto antiguo en la carpeta padre `profefconuva`
2. Ejecutar `npm run backup:old`
3. El archivo se guarda en `backups/`

## Deploy en Vercel

1. Importar esta carpeta `profefconuva/estudiacest` como proyecto separado
2. Framework preset: `Other`
3. Root directory: `estudiacest`
4. Build command: vacío
5. Output directory: vacío
6. Configurar las variables del `.env.local` en Vercel
