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
Para crear o revisar contenido de clases, guías, presentaciones y pautas,
aplicar también `../.github/skills/estudiacest-material-docente/SKILL.md`,
que remite al análisis y la plantilla de las guías docentes SM en la sección 16.

Al cerrar una tarea que cambie comportamiento, datos, contenido académico,
administración o producción, agregar una entrada a `BITACORA.md`. No registrar
RUT, notas individuales, correos, credenciales ni otros datos personales.

Termas: `/termas/admin` registra bajas e invitado opcional mediante `termas-admin-baja`, solo con sesión administrativa. Conserva la inscripción y la respuesta anterior, marca no asistencia y libera el asiento; anotar un invitado no crea una inscripción. Reconfirmar asistencia desde Editar anula la baja conservando su antecedente.

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


## PAES TP · 26 de octubre de 2026

4A-TP, 4B-TP, 4C-TP, 4D-TP y 4E-TP tienen entrada por defecto
en `/paes/tp/` desde el acceso general. `/nm4/` sigue accesible por enlace
explícito. Tres sesiones independientes en `plataforma_paes/tp_intentos`,
con ingreso habitual por RUT y contraseña. Resultados, retroalimentación y nota
con exigencia del 60 % al entregar por instrucción expresa del docente.
El diagnóstico usa una selección de la prueba oficial de junio de 2026;
no se convierte a puntaje oficial PAES. Orden estable por UID y versión de
lecturas y preguntas dentro de cada lectura; opciones A-D conservadas.
Recorrido acompañado aislado y panel docente autenticado en `/paes/tp/panel.html`.
No se cambian los intentos ni las publicaciones HC históricas.

PAES TP, ajuste del mismo 26-oct: las tres actividades son sin límite de tiempo. El alta manual y la recuperación de contraseña usan /estudiantes/adminprofe/index.html, con cursos 4A–E TP; el panel TP enlaza esa administración. Reiniciar desde cero archiva el intento anterior.
