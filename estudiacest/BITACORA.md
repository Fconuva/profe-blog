# Bitácora de Estudia CEST

Registro para retomar el contexto entre sesiones, agentes y máquinas. El bloque más reciente va arriba.

Esto complementa, no reemplaza, a los documentos de reglas. Aquí va **qué se hizo, qué quedó y qué está pendiente**. Las reglas de cómo trabajar están en `.github/workflows/README.md`, `AGENTS.md`, `.github/skills/estudiacest-platform/SKILL.md` y `CONTRATO_ENTREGA_CLASES.md`.

---

## Dónde vive todo (leer antes de tocar nada)

| Qué | Dónde |
|---|---|
| Fuente editable | `C:\dev\profe-blog\estudiacest` (repo `Fconuva/profe-blog`, rama `main`) |
| Deploy | `npm run deploy:prod:safe` desde esa carpeta. Vercel directo está prohibido |
| Dominio | `https://www.estudiacest.com` (proyecto Vercel `estudiacest`, root dir `estudiacest`) |
| Base de datos | Firebase `estudiacest`, RTDB `estudiacest-default-rtdb`. NO es `profe-blog` |
| Storage | Bucket `estudiacest.firebasestorage.app`. Reglas en `storage.rules`, se publican con `npx firebase deploy --only storage --project estudiacest` |
| Reglas RTDB | `firebase-rules.json`, se publican con `npm run deploy:rules`. Vercel no las despliega |
| Guardas de release | `scripts/academic-release-manifest.json` (9 áreas, 50 archivos críticos) y `scripts/class-submission-contract.json` |
| Workflow operativo | `00 - Workspace y Soporte/03 - Deploy y Referencia/ESTUDIACEST_WORKFLOW_OPERATIVO_2026.md` en el workspace de OneDrive |

**Carpetas que NO son la fuente.** `C:\Users\franc\profe-blog-work` es un segundo clon del mismo repo y suele estar atrasado. `profefconuva/estudiacest` dentro de OneDrive es una copia espejo. El repo `Fconuva/estudiacest-2026` (clon `C:\Users\franc\estudiacest-2026`) está congelado desde el 27-jul-2026 y solo sirve de archivo histórico. Desplegar desde cualquiera de esas tres borra secciones de producción.

---

## 2026-08-06, estado del día

### Lo que se construyó

**Bitácora móvil de La Odisea (NM3).** Ruta `/nm3/odisea-antes-del-cine/`, API `api/odisea-cine.js`, panel docente en `nm3/odisea-antes-del-cine/admin.html`. Los estudiantes entran con su RUN y responden desde el celular durante y después de la película. Tiene 24 imágenes generadas con IA y un checklist de 18 acontecimientos con distractores falsos. Padrón de 131 estudiantes vigentes: 45 de 3°A, 48 de 3°B y 38 de 3°D. Los retirados quedaron fuera.

A pedido de la educadora diferencial (Pía Natalia, 6-ago) la actividad quedó separada en dos bloques: **Durante la película** solo el checklist de acontecimientos, y **Después de la película** la descripción de tres personajes, la escena más impactante y la interpretación sobre Penélope y Telémaco. La razón es que nadie escribe descripciones mientras mira la película.

**Proyecto Anuario 4°D TP.** Ruta `/4dtp/`, API `api/anuario-4dtp.js`, administración en `/4dtp/admin.html`. Los 29 estudiantes del curso están cargados por RUN. Cada uno tiene su carpeta con documentos editables, autoguardado y subida de audios, fotos y documentos. La Actividad 1 son cinco entrevistas: tres a compañeros y dos a docentes, grabadas en audio y transcritas. El anuario se imprime en la especialidad, se entregan tres copias cosidas a fines de octubre, y se califica por avance y por entrega final.

**3°ATP quedó archivado, no eliminado.** Su micrositio sigue publicado y protegido por el manifiesto.

**NM3 ordena las fichas desde la más reciente.**

**Guía 16 de PAES publicada**, textos discontinuos, 15 reactivos, con video propio despues de reemplazar uno que estaba reutilizado de la guía 15.

### Storage quedó habilitado hoy

Francisco vinculó el plan Blaze y creó el bucket. Las reglas de `storage.rules` se publicaron el 6-ago y ya están activas. Antes de eso los documentos escritos funcionaban pero las subidas de audio y foto no.

El límite es de **100 MB por estudiante**, unos 2,9 GB para el curso completo. Ojo: en `api/anuario-4dtp.js` las constantes `MAX_FILE_SIZE` y `MAX_STUDENT_STORAGE` valen las dos 100 MB, así que **un solo archivo puede consumir la carpeta entera** de un estudiante. Está pendiente decidir si eso es lo que se quiere.

### Commits del 5 y 6 de agosto

Todos en `main`, desplegados y verificados en vivo.

```
41186501  06-ago 10:39  feat(4dtp): explorar carpetas y habilitar acceso PIE
daff9cf9  06-ago 10:18  fix(4dtp): completar registro de archivos en Firebase
81d877de  06-ago 10:15  fix(4dtp): compatibilizar regla de tamaño de Storage
cc4ac9d2  06-ago 09:48  chore(release): proteger recursos 4dtp en produccion
48bc9d81  06-ago 09:44  chore(release): permitir alta inicial de 4dtp
3a909da0  06-ago 09:43  feat(4dtp): crear proyecto anuario con carpetas cloud
4073134a  06-ago 09:00  feat(nm3): crear bitacora movil de La Odisea
1b7701a4  06-ago 07:53  chore(release): enforce guide 16 production assets
9fb1a0a8  06-ago 07:43  fix(deploy): include PAES guide audit
4837ecc9  05-ago 20:27  chore(release): protect current SIMCE unit files
abb0da50  05-ago 20:22  fix(paes): replace reused guide 16 video
bfd181da  05-ago 17:12  feat(estudiacest): preserve academic baseline and publish PAES guide 16
```

`bfd181da` es el commit que devolvió la fuente a este repo. Entre el 22 y el 27 de julio el trabajo había vivido en `Fconuva/estudiacest-2026`, y ese commit reincorporó aquí la Guía 14 de PAES, el 3ATP con sus informes y presentaciones, el video pitch de NM4 y las guías de la Unidad 3 de SIMCE.

### Verificaciones corridas hoy, todas en verde

```
npm run verify:class-submission   -> contrato verificado en 3 clases
npm run audit:paes-g16            -> 15 reactivos, claves y habilidades correctas
npm run audit:odisea-cine         -> 131 estudiantes, 24 imágenes, flujo completo
npm run audit:anuario-4dtp        -> 29 estudiantes, documentos, archivos, admin y reglas
npm run verify:academic-release   -> fuente canónica, Git y 50 recursos críticos correctos
```

Las nueve rutas públicas responden 200: raíz, `/nm3/`, `/nm3/odisea-antes-del-cine/`, `/4dtp/`, `/4dtp/admin.html`, `/3atp/`, `/paes/`, `/estudiantes/` y `/nm4/`.

### Estado de los datos en Firebase

- `plataforma_estudiantes/nm3/odisea_cine_2026/respuestas`: 1 registro, el RUN de prueba `23.132.082-2`.
- `plataforma_estudiantes/nm4/4dtp/anuario_2026/students`: 1 registro.
- `plataforma_estudiantes/admin_scopes/anuario4dtp`: 1 UID habilitado.
- `plataforma_estudiantes/sesiones`: 23 sesiones, incluidas `sesion-u3-1` a `sesion-u3-4`, los dos ensayos SIMCE de miércoles y `ensayo-simce-n3-nm2-2026`.
- `plataforma_paes/guias_config/blocked`: 16 guías bloqueadas, con una excepción individual en `g13`.

---

## Pendientes abiertos

1. **Tope por archivo igual al tope total en el Anuario.** Decidir si un solo archivo puede llenar los 100 MB de un estudiante o si conviene un tope por archivo más bajo.
2. **Correo institucional como alternativa a Storage.** Francisco planteó que los estudiantes tienen cuenta `@alumnosalesiano.cl` y él `frnunez@salesianostalca.cl`. Quedó como opción no explorada frente a guardar todo en Firebase.
3. **Documentos tipo Google Docs en las carpetas.** Francisco lo mencionó como idea. Hoy los documentos son editables dentro de la plataforma, no archivos de Google.
4. **Revisión de la actividad de La Odisea por la educadora diferencial** una vez que esté terminada. Idea de Francisco, aún sin hacer.
5. **`class-submission-contract.json` solo registra 3 archivos**: `estudiantes/guia-u3-s4-infografias.html`, `estudiantes/apoyo-personal/index.html` y `paes/guia16.html`. La Odisea y el Anuario entregan trabajo pero no están ahí. Tienen sus propios auditores (`audit-odisea-cine.js` y `audit-anuario-4dtp.js`), así que la cobertura existe, pero por otra vía. Conviene decidir si se unifican.
6. **Dos secciones se perdieron al volver de `estudiacest-2026`.** `/nm3/clase-conclusion-ensayo/` (visor web con 14 diapositivas en 4K y 8K, más el PPTX, del 24-jul) y `/nm1/` (portal NM1, del 22-jul). Las dos dan 404 en producción y no están en este repo. No hay enlaces rotos apuntando a ellas. Siguen completas en el historial de `Fconuva/estudiacest-2026` si se quieren recuperar. No se encontró ninguna nota que diga que fue una decisión.

---

## Historial anterior

El trabajo entre el 22 y el 27 de julio quedó registrado en el `BITACORA.md` del repo `Fconuva/estudiacest-2026`, que se congeló el 22-jul. Ahí están la auditoría de bugs en vivo del 14-jul, la reconciliación de contenidos del 19 al 21 de julio y el detalle de las clases de la Unidad 3.
