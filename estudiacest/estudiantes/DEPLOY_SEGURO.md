# SIMCE / Plataforma Estudiantes - proteccion de deploy

Aplicar obligatoriamente `../DEPLOY_SEGURO_AREAS_ACADEMICAS.md`.

- Publicar solo con `npm run deploy:prod:safe` desde la raiz de `estudiacest`.
- Registrar cada sesion o recurso esencial nuevo en `scripts/academic-release-manifest.json`.
- No omitir contenidos, resultados, nominas, recursos, login ni panel docente.
- El artefacto debe conservar tambien PAES, NM3 y NM4.
- Toda clase con entrega debe cumplir `../CONTRATO_ENTREGA_CLASES.md` y estar registrada en `../scripts/class-submission-contract.json`.
- Ejecutar `npm run verify:class-submission` antes de publicar y probar en producción que la confirmación se refleje como `Completada` en el dashboard.
- No publicar una guía cuyo autoguardado pueda competir con la entrega final.
