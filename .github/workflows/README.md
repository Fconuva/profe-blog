# Estudia CEST Workflow

This folder already contains disabled deploy automation. The operational workflow for the current student site is manual and should be followed consistently.

## Change Workflow

1. Work in `profefconuva/estudiacest` unless the task explicitly targets the legacy site.
2. If routing changes, confirm the current course map before editing.
3. Apply the smallest patch possible.
4. Run focused validation on touched files.
5. Test browser behavior on the real route.
6. If the change touches auth or API, validate on production or a real app server.
7. Deploy with Vercel.
8. Re-check the live site and at least one real user flow.
9. Update `AGENTS.md` and `.github/skills/estudiacest-platform/SKILL.md` when behavior changes.

## Session Grading Workflow

1. Ask whether the final grade uses alternatives only or alternatives plus writing, and confirm the exact weights before starting.
2. Find the owner surface for the `sessionId`; do not assume the generic session page owns the stored writing.
3. Verify the real storage path for written evidence in code.
4. Export the course review first with `estudiacest/scripts/export-session-course-review.js`.
5. Review writing from the exported evidence and prepare the writing score input.
6. Run `estudiacest/scripts/apply-session-writing-grades.js` in dry-run mode first.
7. Apply only after validating the generated report.
8. Update `AGENTS.md`, `.github/skills/estudiacest-platform/SKILL.md`, `.github/skills/estudiacest-session-grading/SKILL.md`, and `estudiacest/README.md` if the grading workflow changes.

## Current Course Map

- NM3 TP: `3A-TP`, `3B-TP`, `3D-TP`
- NM4 TP: `4A-TP`, `4B-TP`, `4C-TP`, `4D-TP`, `4E-TP`
- PAES HC placeholder: `3A-HC`, `3B-HC`, `4A-HC`, `4B-HC`
- Do not route PAES HC into Lecturas or NM4 until the PAES section exists.

## Audit Workflow

1. Open the public root and confirm it reaches the shared login.
2. Test at least one student login and confirm automatic redirection.
3. Inspect console output during login, dashboard load, and any write action.
4. Open admin and verify the gate, data load, section navigation, and action buttons.
5. Test create, edit, and bulk flows only with reversible or controlled data.
6. Record findings with page, action, console evidence, and impact.

## Deploy Command

- `npx vercel deploy --prod --yes --scope fconuvas-projects`

## Local Testing Note

- Plain static servers will fail on `/api/*` POST requests. Use them only for static rendering checks.
- For grading tasks, a static preview does not prove where writing is stored; the owner code path and Firebase data are the source of truth.
