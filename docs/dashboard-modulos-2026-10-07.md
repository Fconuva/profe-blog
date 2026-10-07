# Guardado de preferencias según módulos contratados

El cuestionario exigía duración y sala de la clase grabada, además de colaborador,
aunque M2 o M3 estuvieran fuera del contrato. Los registros antiguos sin indicadores
`contratado` también mostraban los tres módulos aunque tuvieran un plan parcial.

Ahora los indicadores explícitos determinan el alcance. Si faltan, se toma el plan
registrado: módulo individual, combinación de dos o completo. Una preinscripción
sin alcance definido conserva las preferencias de los tres módulos. Los indicadores
explícitos falsos se respetan. El validador exige las respuestas de M2/M3 únicamente
cuando esos módulos pertenecen al alcance.

La corrección conserva la recolección, recuperación local, autoguardado y confirmación
del guardado existentes. No cambia contratos ni registros de docentes.

Validación: 41 pruebas de alcance, guardado y pagos aprobadas; compilación Eleventy
aprobada. En navegador aislado, con Firebase simulado y sin credenciales ni escrituras
reales: M1 finaliza con indicadores actuales o con plan antiguo; el borrador más reciente
se recupera; un fallo conserva el borrador y el reintento conserva respuestas ocultas de
M2/M3; un plan completo vacío mantiene sus errores de validación. Cero errores de
consola inesperados. No se reprodujo una sesión autenticada de una docente.

Publicación: el repositorio raíz usa el despliegue automático de Vercel mediante push
a `main`, proyecto `profefconuva`. La comprobación pública posterior debe confirmar
que `/dashboard/` contiene la versión corregida antes de declarar publicado el cambio.
