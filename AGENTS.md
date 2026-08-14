# Profefconuva Workspace Guidelines

## ⚠️ Carpeta de trabajo y deploy (CRÍTICO)

- Trabaja SIEMPRE en el clon local `C:\dev\profe-blog`. NO uses la copia dentro de OneDrive: OneDrive corrompe el `.git` (errores `mmap`, commits fantasma, divergencias entre PCs). Ver `CLAUDE.md`.
- Deploy de Estudia CEST: confirmar primero los cambios en Git y, desde `C:\dev\profe-blog\estudiacest`, ejecutar exclusivamente `npm run deploy:prod:safe`. Reglas de Firebase: `npx firebase deploy --only database --project estudiacest`.

## Regla obligatoria de sincronización multiagente (CRÍTICO)

Este repositorio puede recibir cambios simultáneos de varios agentes. Cada agente debe continuar desde el último estado publicado y preservar íntegramente el trabajo ajeno.

Antes de comenzar una tarea que pueda terminar en un `push` o despliegue, y nuevamente justo antes de publicarla:

1. Ejecutar `git fetch origin main`.
2. Leer los últimos cambios con `git log --oneline --decorate -10 origin/main` y revisar qué archivos cambiaron respecto del trabajo local.
3. Si `origin/main` avanzó, integrar esos cambios con `git rebase origin/main` o un mecanismo equivalente que conserve ambos trabajos. Ante un conflicto, mantener los cambios de todas las secciones; si no es posible determinarlo con seguridad, detenerse y revisar antes de continuar.
4. Comprobar `git status --short` y `git diff --name-status origin/main...HEAD`. El commit debe contener únicamente archivos de la tarea o sección asignada.
5. Agregar archivos por rutas explícitas. En trabajo multiagente está prohibido usar `git add .` o incluir cambios incidentales.
6. Inmediatamente antes del `push`, repetir `git fetch origin main`; si el remoto volvió a avanzar, rebasar y repetir la revisión de alcance.
7. Publicar o desplegar solo desde un árbol limpio, basado en el `origin/main` más reciente y que no esté detrás del remoto.

Está prohibido usar `git push --force`, `git reset --hard`, restaurar versiones antiguas, borrar archivos de otras secciones o desplegar desde una copia desactualizada. La presencia de cambios de otro agente nunca autoriza a revertirlos: se conservan y el nuevo trabajo se construye sobre ellos.

## Scope

- The active production student site for this migration is `profefconuva/estudiacest`.
- Prefer editing `profefconuva/estudiacest/**` for public site changes.
- Do not change legacy `profefconuva/estudiantes`, `profefconuva/lecturas`, or root-site flows unless the task explicitly requires syncing or backporting a fix.

## Architecture

- Common public entry: `estudiacest/index.html` redirects to `estudiacest/lecturas/index.html`.
- Shared login UI lives in `estudiacest/lecturas/index.html` and decides the destination after authentication.
- Student data lives under `plataforma_estudiantes`.
- Lecturas data lives under `plataforma_lecturas`.
- NM4 guided work lives at `estudiacest/nm4/`.
- Private admin panel for Lecturas lives at `estudiacest/lecturas/adminprofe/index.html`.

## Current Routing Rules

- `3A-TP`, `3B-TP`, `3D-TP` default to Lecturas.
- `4A-TP`, `4B-TP`, `4C-TP`, `4D-TP`, `4E-TP` default to NM4.
- `3A-HC`, `3B-HC`, `4A-HC`, `4B-HC` use the active PAES section under `estudiacest/paes/` and must not be treated as NM3 or NM4 defaults.
- If a student profile is incomplete, redirect through `estudiacest/estudiantes/perfil.html` with a `next` path.

## Validation And Deploy

- After route or UI edits, run focused validation on the touched files.
- For static-only checks, a local HTTP server is fine; local static servers will not serve `/api/*` and will return 501 for POST requests.
- For login, admin, API, and console checks, validate against the deployed site.
- Production deploy command from `C:\dev\profe-blog\estudiacest`: `npm run deploy:prod:safe`. Direct `vercel deploy --prod` is prohibited because it bypasses the academic inventory gate.

## PAES Interactive Sessions

- The server computes scores for interactive PAES guides; never trust `correct`, `total`, or `score` sent by the browser.
- A final submission stores `submitted: true`, `completada: true`, both timestamps, and becomes immutable until the teacher resets it.
- Correct answers, feedback, and scores remain hidden until the teacher publishes results for the selected guide and course in `/paes/admin/`.
- A guide may accept an incomplete final submission only when its ID is explicitly listed in the server allowlist. Guide 17 intentionally accepts 0 to 24 answers; this exception must not weaken completion rules for other PAES guides.
- The API may return an interactive guide answer key only when the attempt is complete and the teacher release is active for that student or course.
- Normalize PAES answer collections read from Realtime Database before returning them. Numeric keys can be serialized by RTDB as sparse arrays; null array slots are not answers and must never affect progress counts or admin review.
- New PAES sessions must be registered in `estudiacest/scripts/class-submission-contract.json` and `estudiacest/scripts/academic-release-manifest.json`.
- Any audit script invoked by the production `build` command must also be explicitly included in `estudiacest/.vercelignore`; a local-only audit file will make the Vercel build fail.
- Visual assessment resources must preserve exactly the information used by the items. Inspect generated images at original resolution before publication.

## Session Grading

- Ask first whether the final grade is alternatives only or alternatives plus writing, and confirm the exact weights.
- Do not treat admin `1/1 notas`, `notas_evaluadas`, or an existing `nota` as proof that written evidence is stored.
- Verify the owner surface for the `sessionId` and inspect the real storage path before exporting or recalculating.
- For Estudia CEST student sessions, written evidence may live in `notes`, `ticket`, or `thesisContexts`.
- Use `estudiacest/scripts/export-session-course-review.js` to inspect the stored evidence before applying combined grades.
- Use `estudiacest/scripts/apply-session-writing-grades.js` only after review and a dry run.

## Documentation Rule

- When routing, admin behavior, or deployment workflow changes, update `AGENTS.md`, `.github/skills/estudiacest-platform/SKILL.md`, and `.github/workflows/README.md` in the same task.
- When the session grading workflow changes, update those files plus `estudiacest/README.md` and `.github/skills/estudiacest-session-grading/SKILL.md` in the same task.

## Audit Expectations

- Audits must check browser behavior and console output, not only code inspection.
- For admin audits, verify login gate, section navigation, create/edit flows, direct-access link generation, review actions, and report/export actions.

## Portfolio Registration Safeguards

- A portfolio account requires a non-blank normalized name in both the public form and the admin API. HTML `required` alone is insufficient because whitespace passes browser validation.
- When an archived pre-registration changes to a contracted plan, the admin save clears only its portfolio archive fields. It must not unarchive cancellations, blocked users, or already contracted portfolios that were archived intentionally.
- Reattaching an existing authentication account through the admin create flow also clears stale portfolio archive fields and synchronizes the normalized name in Firebase Auth and `/users`.

## Portfolio Admin Financial Contract

- Cash received is the greatest valid total among `abonos`, `paymentAmount`, `abonoAcumulado`, and `montoPagado`; mirrored migration fields must never be added together.
- A later benefit or free status removes the plan from receivables, but any prior payment remains real cash received.
- Collection timing comes from `portafolios/{uid}/cartera`: apply the 30-day rule after the last abono unless WhatsApp records a later agreement. A class-recording date is never a collection date.
- `esperar_m1` is visible as work-dependent debt and must not enter “Cobrar ahora”. Display people as unique clients even when one balance has multiple agreed movements.
- After changing these rules, verify the deployed admin against the live Firebase totals, filters, and browser console.
