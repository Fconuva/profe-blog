# Profefconuva Workspace Guidelines

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
- `3A-HC`, `3B-HC`, `4A-HC`, `4B-HC` belong to the future PAES section and must not be treated as NM3 or NM4 defaults.
- Until the PAES section exists, those HC PAES courses fall back to `estudiacest/estudiantes/dashboard.html`.
- If a student profile is incomplete, redirect through `estudiacest/estudiantes/perfil.html` with a `next` path.

## Validation And Deploy

- After route or UI edits, run focused validation on the touched files.
- For static-only checks, a local HTTP server is fine; local static servers will not serve `/api/*` and will return 501 for POST requests.
- For login, admin, API, and console checks, validate against the deployed site.
- Production deploy command from `profefconuva/estudiacest`: `npx vercel deploy --prod --yes --scope fconuvas-projects`.

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
