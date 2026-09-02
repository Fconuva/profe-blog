# Estudia CEST Workflow

This folder already contains disabled deploy automation. The operational workflow for the current student site is manual and should be followed consistently.

The canonical cross-cutting rules are `estudiacest/REGLAS.md`; operational
history is recorded only in `estudiacest/BITACORA.md`. This workflow applies to
the student platform and excludes portfolio, client, payment, and collection
operations.

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
2. Work in `C:\dev\profe-blog\estudiacest` unless the task explicitly targets the legacy site.
3. If routing changes, confirm the current course map before editing.
4. Apply the smallest patch possible.
5. Run focused validation on touched files.
6. Test browser behavior on the real route.
7. If the change touches auth or API, validate on production or a real app server.
8. Repeat the sync gate, commit the exact source state, and deploy with `npm run deploy:prod:safe`.
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
- PAES HC: `3A-HC`, `3B-HC`, `4A-HC`, `4B-HC` under `/paes/`.
- Every new interactive PAES instrument must include Dylan Abaca's guided companion route for normalized RUN `229327739` in the same commit. Verify isolated Firebase state, admin support, restored-session redirection, mobile layout, and hidden results before release; never expose diagnosis labels in the student UI.
- PAES results remain hidden until the teacher publishes them for the selected guide and course.
- PAES answer keys are server-only and may be returned only for completed attempts covered by a teacher release. Any incomplete-submission exception must be an explicit per-guide server allowlist entry; Guide 17 accepts 0 to 24 answers and Guide 18 accepts 0 to 18 answers.
- In PAES readback tests, verify that RTDB sparse arrays are normalized to answer objects and that null index slots do not inflate the marked-response count.
- Interrogation grading: the NM3 and NM4 `/calificar/` URLs open directly as Francisco; educator-specific access uses `?docente=alicia`, `?docente=pia`, or `?docente=joselin`, without passwords or hidden link codes.

## Audit Workflow

1. Open the public root and confirm it reaches the shared login.
2. Test at least one student login and confirm automatic redirection.
3. Inspect console output during login, dashboard load, and any write action.
4. Open admin and verify the gate, data load, section navigation, and action buttons.
5. Test create, edit, and bulk flows only with reversible or controlled data.
6. Record findings with page, action, console evidence, and impact.

Every audit script called by `npm run build` must be explicitly allowed through `estudiacest/.vercelignore`; otherwise Vercel receives `package.json` without the required script and fails remotely.

## Deploy Command

- From `C:\dev\profe-blog\estudiacest`: `npm run deploy:prod:safe`. Direct production deployment is prohibited.

## Local Testing Note

- Plain static servers will fail on `/api/*` POST requests. Use them only for static rendering checks.
- For grading tasks, a static preview does not prove where writing is stored; the owner code path and Firebase data are the source of truth.
