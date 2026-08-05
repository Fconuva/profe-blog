# NM4 - proteccion de deploy

Aplicar obligatoriamente `../DEPLOY_SEGURO_AREAS_ACADEMICAS.md`.

- Publicar solo con `npm run deploy:prod:safe` desde la raiz de `estudiacest`.
- Registrar todo material esencial nuevo en `scripts/academic-release-manifest.json`.
- La pagina del pitch Capital Semilla, su video de 90 segundos y sus dos portadas son recursos criticos inmutables: no pueden omitirse ni reemplazarse accidentalmente.
- El artefacto debe conservar tambien PAES, NM3, SIMCE y sus API.
