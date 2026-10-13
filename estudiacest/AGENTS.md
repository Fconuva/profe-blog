# Alcance exclusivo: Estudia CEST

Este subárbol contiene la plataforma de estudiantes `estudiacest.com`. No es el
servicio de portafolios docentes ni su sitio comercial.

Antes de modificar cualquier archivo bajo esta carpeta:

1. Leer `REGLAS.md`.
2. Leer las últimas entradas de `BITACORA.md`.
3. Revisar el estado más reciente de `origin/main` y conservar cambios de otros
   agentes.

Las secciones del `AGENTS.md` superior sobre docentes clientes, cobros,
portafolios, cartera o WhatsApp no se aplican a una tarea limitada a
`estudiacest/**`. Para este subárbol mandan `REGLAS.md`, los contratos técnicos
locales y las instrucciones especializadas de PAES, SIMCE, NM3 o NM4 cuando
corresponda.

Para las próximas planificaciones, presentaciones y guías de todos los cursos,
aplicar el estándar de `REGLAS.md`, sección 13, basado en el formato NM4 aprobado.
La planificación de cada sesión abre con una hoja de ruta de una página, y el
lenguaje y la limpieza de lo que ve el estudiante se revisan con la sección 15.

Al cerrar una tarea que cambie comportamiento, datos, contenido académico,
administración o producción, agregar una entrada a `BITACORA.md`. No registrar
RUT, notas individuales, correos, credenciales ni otros datos personales.

SIMCE Unidad 4 usa `/estudiantes/simce-unidad4/`, las acciones `simce-u4-*`
de la API y claves solo en servidor. Su panel docente exige admin y alcance de
curso. El puntaje simulado CEST no asigna niveles oficiales de SIMCE.

Los paneles `/nm3/interrogacion-un-lugar-sin-limites/calificar/` y
`/nm4/interrogacion-mocha-dick/calificar/` son accesos docentes directos sin
contraseña ni código de enlace. La ruta base corresponde a Francisco y el
parámetro `?docente=` conserva los alcances de las educadoras.

Los audios de estas interrogaciones se revisan desde los mismos paneles. Para
una revisión técnica asistida se usa `npm run review:interrogaciones --
--instrumento nm3` o `--instrumento nm4`; el token vive únicamente en el archivo
local indicado por `REGLAS.md`. Ningún análisis asistido asigna la nota final.
