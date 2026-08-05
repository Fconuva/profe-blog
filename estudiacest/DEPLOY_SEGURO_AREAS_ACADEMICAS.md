# Regla obligatoria de deploy - areas academicas

Aplica a `paes/`, `nm3/`, `nm4/`, `estudiantes/` (SIMCE) y `api/`, incluidos administradores, recursos y archivos vinculados.

## Causa del incidente

Vercel no agrega archivos a la version anterior: cada deploy reemplaza produccion con una fotografia completa del directorio enviado. El video y la pagina del pitch desaparecieron porque estaban en un deployment anterior, pero no en la fuente canonica usada por el deployment siguiente.

## Regla dura

- El unico comando autorizado para produccion es `npm run deploy:prod:safe`, ejecutado desde `profefconuva/estudiacest`.
- Queda prohibido ejecutar directamente `vercel deploy --prod`, `npx vercel deploy --prod` o publicar desde una copia parcial, antigua o temporal.
- No se elimina, desactiva ni omite `scripts/verify-academic-release.js` ni `scripts/academic-release-manifest.json`.
- Toda pagina, video, imagen o archivo esencial nuevo debe registrarse en `scripts/academic-release-manifest.json` antes de publicarse.
- El deploy se bloquea si falta un recurso critico, cambia un archivo inmutable, existe un enlace local roto, el proyecto Vercel no coincide o hay cambios sin commit en `paes/`, `nm3/`, `nm4/`, `estudiantes/` o `api/`.
- El script de build ejecuta tambien la verificacion del artefacto. Un deploy directo o iniciado por integracion sigue fallando si el paquete esta incompleto.

## Fuente canonica

La unica fuente editable es `profefconuva/estudiacest/`. Un directorio bajo `scratch/`, una descarga de Vercel, un worktree temporal o un snapshot de reparacion no reemplaza la fuente canonica.

## Flujo obligatorio

1. Incorporar el cambio a la fuente canonica completa.
2. Registrar en el manifiesto cada recurso esencial nuevo.
3. Confirmar en Git todos los cambios terminados de las areas protegidas.
4. Ejecutar `npm run build`.
5. Ejecutar `npm run verify:academic-release`.
6. Ejecutar exclusivamente `npm run deploy:prod:safe`.
7. Abrir las portadas de PAES, NM3, NM4 y Estudiantes, ademas del recurso modificado.

Ante una perdida, se recupera el archivo puntual desde el deployment inmutable anterior y se integra a la fuente canonica. No se restaura sobre produccion un arbol antiguo completo, porque borraria trabajo vigente de otras areas.
