---
name: estudiacest-platform
description: 'Maintain, debug, document, or audit Estudia CEST. Use for shared login routing, NM3/NM4/PAES course rules, adminprofe checks, console-error audits, Vercel deploys, and production validation.'
argument-hint: 'Describe the Estudia CEST route, section, bug, or audit target.'
user-invocable: true
---

# Estudia CEST Platform

## When To Use
- Shared login changes in `estudiacest/lecturas/index.html`
- Root entry and redirect changes in `estudiacest/index.html`
- NM3, NM4, and future PAES route decisions by course
- Lecturas admin panel maintenance and audits
- Production console-error review
- Vercel deploy and post-deploy validation for `estudiacest`
- Session grading reviews when you need to verify where written evidence is stored before recalculating grades

## Current Platform Map
- Public root: `estudiacest/index.html`
- Common login: `estudiacest/lecturas/index.html`
- Student dashboard and profile: `estudiacest/estudiantes/`
- NM4 guided activity: `estudiacest/nm4/`
- Lecturas dashboard: `estudiacest/lecturas/dashboard.html`
- Lecturas admin: `estudiacest/lecturas/adminprofe/index.html`
- Owner admin email: `portafolio.admin@estudiacest.com`

## Mandatory Multi-Agent Publish Gate

Several agents can update different parts of Estudia CEST at the same time. Every agent must preserve the latest published state and build its own change on top of it.

Complete this gate at the start of any task that may be pushed or deployed, and repeat it immediately before publication:

1. Run `git fetch origin main`.
2. Read the latest remote work with `git log --oneline --decorate -10 origin/main` and inspect the files changed between the local branch and `origin/main`.
3. If the remote advanced, integrate it with `git rebase origin/main` or an equivalent non-destructive method. Conflict resolution must preserve all unrelated sections and both agents' intended changes.
4. Review `git status --short` and `git diff --name-status origin/main...HEAD`. Stage only explicit paths that belong to the current task; do not use `git add .` in a shared multi-agent workflow.
5. Fetch `origin/main` again immediately before pushing. If it advanced again, rebase and repeat the scope review.
6. Push or deploy only from a clean worktree that is based on the newest `origin/main` and is not behind it.

Never force-push, hard-reset, restore an older copy over current work, delete another section's files, or deploy a stale branch. If a conflict cannot be resolved confidently while preserving both scopes, stop and inspect it instead of discarding another agent's work.

## Current Routing Rules
- NM3 TP: `3A-TP`, `3B-TP`, `3D-TP` -> `/lecturas/dashboard`
- NM4 TP: `4A-TP`, `4B-TP`, `4C-TP`, `4D-TP`, `4E-TP` -> `/nm4/`
- PAES HC placeholder: `3A-HC`, `3B-HC`, `4A-HC`, `4B-HC` -> `/estudiantes/dashboard.html`
- Remaining students: `/estudiantes/dashboard.html`
- Incomplete profile: `/estudiantes/perfil.html?next=...`

## Procedure
1. Complete the mandatory multi-agent publish gate and read the latest `origin/main` changes.
2. Start from the active surface in `profefconuva/estudiacest`.
3. If the task changes routing or access, update both behavior and documentation in the same turn.
4. Run focused file validation immediately after edits.
5. For UI changes, verify rendered behavior with browser tools.
6. For API or auth behavior, test on deployed production or a real app server, not only a static file server.
7. Repeat the publish gate immediately before pushing or deploying, then verify the live route and at least one real login path after deployment.

## Session Grading Workflow
- Ask whether the final grade is alternatives only or alternatives plus writing, and confirm the exact weighting before touching data.
- Do not trust admin `1/1 notas`, `notas_evaluadas`, or an already visible `nota` as proof that writing exists in Firebase.
- Find the owner surface for the `sessionId` and verify whether writing is stored in `notes`, `ticket`, `thesisContexts`, or another custom key.
- Export first with `estudiacest/scripts/export-session-course-review.js` and inspect the real stored evidence.
- Apply combined grades with `estudiacest/scripts/apply-session-writing-grades.js` only after written review and a dry run.
- If no writing is stored, report that a retroactive combined grade is not honest without external input.

## Admin Audit Checklist
- Open admin gate and check that only the configured owner email is accepted.
- Verify section switching: overview, students, lecturas, reports, planilla.
- Test create student, bulk add, edit student, and direct access link generation.
- Test Lecturas review actions and confirm whether they change UI state or call Firebase without console errors.
- Watch browser console for runtime errors and failed fetches.
- Record findings with severity, path, and reproducible behavior.

## Known Gotchas
- `python -m http.server` or similar static servers will not serve `/api/lecturas-login`; POST checks there will fail with 501.
- `fetch_webpage` can show cached or pre-redirect HTML; browser validation is the source of truth for the live route.
- Some fixes in legacy/duplicate admin surfaces may need syncing between `profefconuva/estudiantes/adminprofe/index.html` and `profefconuva/estudiacest/estudiantes/adminprofe/index.html`.
- The PAES HC section is planned but not built yet. Do not route those courses into NM3 or NM4 by default.
- `sesion-u2-1` is not writing-only through generic `notes`: `estudiacest/estudiantes/guia-u2-s1-columna-opinion.html` stores writing in `ticket` and `thesisContexts`.
- The extra `2A-HC` block inside `estudiacest/estudiantes/guia-u2-s1-columna-opinion.html` is course-gated but should read as two extra opinion columns only.
- Keep the hidden rule in docs and code: Text 2 checks posture + support, Text 3 checks objection + response. Do not expose activation or scoring language in student-facing copy.

## Deploy Command
- From `profefconuva/estudiacest`: `npx vercel deploy --prod --yes --scope fconuvas-projects`
