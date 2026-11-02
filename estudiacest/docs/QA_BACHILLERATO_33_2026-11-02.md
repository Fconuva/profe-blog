# Prueba de Bachillerato lector con 33 alumnos

Encargo de Francisco: verificar ingresos, flujo completo, bugs y consola.
Fecha: 2 de noviembre de 2026. Sitio: https://www.estudiacest.com/.

## Alcance

33 contextos Chromium independientes, cada uno con su cuenta ficticia, más
docente y proyección. Los alumnos entran por la portada y el formulario habitual
de RUT y contraseña; unen la sala y envían desde los controles de la página.
Se cotejan los datos guardados en la base real y los resultados visibles.
Es una simulación desde este equipo, no una medición del wifi ni de 33 equipos
físicos del colegio. No se usan cuentas, respuestas ni notas reales.

## Errores encontrados y corregidos

| Error reproducido | Efecto | Corrección |
|---|---|---|
| Respuesta de guardado anterior recibida después de comenzar otra ronda | Contamina la versión y puede impedir enviar la ronda nueva | Colas por generación de sala/ronda; ignorar resultados anteriores; conservar el envío en su generación |
| Entrega desde otra pestaña de la misma cuenta | La primera pantalla confirma pero sigue mostrando texto anterior | Mostrar las respuestas confirmadas por el servidor y actualizar la copia local |
| Borrador local ya sincronizado frente a una versión remota nueva | Al recargar se muestra la copia vieja | Preferir el servidor; recuperar la copia local solo cuando aún está pendiente |
| Ñ normalizada como N | Palabras con N reciben puntos en una ronda Ñ | Conservar la ñ al normalizar, en cliente y servidor |
| Descarga fallida de las librerías de conexión | Excepción `firebase is not defined` y acceso oculto | Mismos módulos 10.12.0 desde Estudia CEST, hashes y licencia oficial; aviso y botón de recarga si falta un módulo |

Los cuatro primeros casos fallaron antes del parche y pasaron después. El
quinto se observó durante el ensayo en producción y se comprobó localmente
simulando la ausencia de aplicación y autenticación. Cinco regresiones sin
hallazgos después del arreglo; 53 controles existentes de navegador aprobados.

## Flujo del ensayo final

1. Crear 33 identidades de alumno y una docente, todas ficticias y aisladas.
2. Autenticar los 33 alumnos por el formulario habitual, desde la portada.
3. Entrar concurrentemente a una misma sala y confirmar 33 participantes.
4. Enviar una ronda de palabras desde las 33 interfaces; cotejar las 33 entregas.
5. Corregir puntos desde el panel y publicarlos; ver la tabla en la proyección.
6. Resolver lectura, recargar, interrumpir y recuperar la red, revisar doble
   pestaña y cambios desde otro dispositivo; revisar los 33 registros.
7. Comprobar Ñ/N y una respuesta final anterior retenida mientras cambia la
   ronda; entregar la nueva ronda sin contaminación.
8. Terminar y recargar; cotejar puntos propios exactos en los 33 navegadores.
9. Revisar 320, 390, 1366 y 3840 píxeles, consola, excepciones, HTTP y recursos.
10. Simular librerías ausentes y recuperar el acceso con el botón de recarga.
11. Eliminar solo las cuentas y salas creadas y releer su ausencia en Auth y base.

Se separan los errores de red provocados y las cancelaciones al cerrar páginas
de los errores inesperados del flujo. El registro conserva todos los casos.

## Incidencias del equipo de prueba

El primer intento llegó a 33 ingresos y entregas: 2559 ms y 682 ms,
respectivamente. Se interrumpió antes de revisar al suspenderse Windows:
Kernel-Power 42/107, 14:00:35–14:00:38. Chromium registró
`ERR_NETWORK_IO_SUSPENDED`; no hubo excepciones JS ni HTTP de error. Limpieza
de 34 cuentas y la sala confirmada.

El segundo intento registró `ERR_NETWORK_CHANGED` al descargar módulos CDN,
lo que expuso el quinto bug. También se limpiaron sus 34 cuentas y la sala.
Los siguientes ensayos usan una solicitud temporal por proceso para mantener
despierto el equipo; no se modifica el plan de energía.

## Verificación final

**Aprobado: 35 comprobaciones sobre producción, con 33 alumnos, docente y
proyección.** Dos rondas completas con 33 respuestas y dos rondas adicionales
para probar Ñ/N y la recepción tardía de una respuesta anterior.

| Comprobación | Resultado |
|---|---|
| Ingresos concurrentes a la sala desde 33 interfaces | 33; 2419 ms |
| Primera entrega concurrente desde las interfaces | 33 confirmadas; 731 ms |
| Revisión docente de lectura | 33 registros revisados y publicados |
| Resultado propio final en los 33 navegadores | Exacto: 40, 45 o 105 puntos según las acciones de la prueba |
| Errores inesperados de consola | 0 |
| Excepciones JavaScript | 0 |
| Solicitudes fallidas inesperadas | 0 |
| Respuestas HTTP de error inesperadas | 0 |
| Advertencias de consola | 0 |
| Eventos de red provocados | 2, correspondientes a la interrupción deliberada de un alumno |
| Vistas alumno, docente y proyección | 320/390/1366/3840, sin desbordes |
| Librerías ausentes y botón de recarga | Recupera el ingreso, sin excepción JS |
| Limpieza en Auth y base, con relectura | 34 cuentas/perfiles y una sala ausentes |

La publicación final corresponde a `e5ac2d2e9a2d49670608cd66314236718c2772a4`,
despliegue `dpl_2kCy3xJFEbpayg5qcD7bvoccPNY8`, READY en el proyecto
`prj_v2yUaXflcSoBgunqmn1rAEfh0KMR`, con alias `www.estudiacest.com` verificado.
Se publicó exclusivamente mediante `npm run deploy:prod:safe` desde el snapshot
limpio del código canónico, conservando el trabajo compartido ajeno.
Los dos módulos Firebase servidos coinciden por SHA-256 con sus originales.

Registro estructurado: [resultado del ensayo](evidencias/bachillerato-33-2026-11-02.json).
Capturas de alumno y docente abiertas y revisadas; los originales, la proyección
y el diario de limpieza permanecen en
`test-results/bachillerato-33/qa-bach33-9cf3d1c8-30d/` del clon canónico.

Comandos: `node scripts/audit-simce-bachillerato-races.js`,
`node scripts/audit-simce-bachillerato.js --browser`, `npm run build` y
`node scripts/check-simce-bachillerato-classroom.js`.
Las cuentas y la sala son efímeras: no se conserva una partida ficticia abierta.
