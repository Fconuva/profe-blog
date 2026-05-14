---
name: estudiacest-session-grading
description: 'Review, export, and recalculate Estudia CEST session grades when the score may include written work as well as alternatives. Use when you need to verify real writing storage, prepare course review exports, or apply combined grades safely.'
argument-hint: 'Describe the session id, course, and whether the grade should use alternatives only or combined weighting.'
user-invocable: true
---

# Estudia CEST Session Grading

## When To Use
- Review a session before grading written responses
- Export student evidence for a course review
- Recalculate grades with alternatives plus writing
- Determine whether a retroactive combined grade is possible from stored data

## Mandatory Questions
- Does the final grade use alternatives only or alternatives plus writing?
- If combined, what exact weighting should be used?
- Will the writing grade come from stored Firebase responses or from an external rubric file?

## Rules
- Do not assume admin `1/1 notas`, `notas_evaluadas`, or an existing `nota` means written evidence exists.
- Do not assume every session stores writing in `notes`.
- Find the owner surface for the `sessionId` before exporting or mutating data.
- If written evidence is missing, report that an honest retroactive combined grade needs external input.

## Recommended Workflow
1. Identify the `sessionId`, course, and owner page.
2. Read the owner page and locate the real writing storage path.
3. Export the course with `estudiacest/scripts/export-session-course-review.js`.
4. Inspect whether writing lives in `notes`, `ticket`, `thesisContexts`, or another custom structure.
5. Prepare a CSV or JSON file with `uid` and `escritura_pct` or `escritura_nota`.
6. Run `estudiacest/scripts/apply-session-writing-grades.js` in dry-run mode.
7. Validate the generated report in `estudiacest/exports/session-review/`.
8. Apply the update only after the dry run is correct.

## Verified Case
- `sesion-u2-1` is owned by `estudiacest/estudiantes/guia-u2-s1-columna-opinion.html`.
- That guide stores writing in `plataforma_estudiantes/respuestas/{sessionId}/{uid}.ticket` and `plataforma_estudiantes/respuestas/{sessionId}/{uid}.thesisContexts`.
- Verified data snapshot: `2B-HC` had `28/28` submitted with `ticket` and `26/28` with `thesisContexts`; `2A-HC` had `0` submitted.