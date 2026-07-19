# Estudia CEST Workflow

This folder already contains disabled deploy automation. The operational workflow for the current student site is manual and should be followed consistently.

## Mandatory Multi-Agent Sync Before Push or Deploy

Every agent must continue from the latest `origin/main` so changes from NM3, NM4, PAES, SIMCE, and other sections remain intact.

At the beginning of publishable work and again immediately before every push or deployment:

1. Run `git fetch origin main` and read `git log --oneline --decorate -10 origin/main`.
2. Inspect the difference between the local branch and the remote. If `origin/main` advanced, use `git rebase origin/main` or an equivalent non-destructive integration.
3. Resolve conflicts by preserving both scopes. Never replace the current remote state with an older local copy.
4. Check `git status --short` and `git diff --name-status origin/main...HEAD`.
5. Stage only explicit files from the assigned task; do not use `git add .` in the shared workflow.
6. Fetch once more immediately before pushing. If the remote advanced, integrate it and repeat the scope check.
7. Push or deploy only from a clean branch that contains the latest remote changes and is not behind `origin/main`.

Force pushes, hard resets, stale deployments, and deletion or rollback of another agent's files are prohibited. If preserving both sets of changes is uncertain, stop and inspect the conflict rather than discarding work.

## Change Workflow

1. Complete the mandatory multi-agent sync and read the latest remote changes.
2. Work in `profefconuva/estudiacest` unless the task explicitly targets the legacy site.
3. If routing changes, confirm the current course map before editing.
4. Apply the smallest patch possible.
5. Run focused validation on touched files.
6. Test browser behavior on the real route.
7. If the change touches auth or API, validate on production or a real app server.
8. Repeat the sync gate and deploy with Vercel.
9. Re-check the live site and at least one real user flow.
10. Update `AGENTS.md` and `.github/skills/estudiacest-platform/SKILL.md` when behavior changes.

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
