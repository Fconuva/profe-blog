# Contrato obligatorio para clases interactivas

Este documento define el comportamiento mínimo de toda clase, guía o ensayo de Estudia CEST que permita autoguardar y entregar trabajo. Se aplica a SIMCE, PAES, NM3, NM4 y a cualquier sección nueva.

## 1. Identidad única

- La página, el dashboard, el admin y Firebase deben usar exactamente el mismo `sessionId`.
- La sesión debe tener una ruta pública válida en `link_guia` y estar registrada en `scripts/academic-release-manifest.json` cuando sea un recurso académico crítico.
- Los cursos deben usar la nomenclatura normalizada del sistema, por ejemplo `2A-HC`, `3A-HC` o `3A-TP`.
- Nunca se debe crear una segunda copia de una sesión para corregir su estado. Se corrige la sesión canónica.

## 2. Estados de una entrega

- Sin registro: la tarjeta muestra `Pendiente`.
- Borrador: existe un registro y `completada` no es `true`; la tarjeta muestra `En progreso`.
- Entrega final: el registro contiene simultáneamente `submitted: true` y `completada: true`; la tarjeta muestra `Completada`.
- `completada` es la marca canónica del dashboard y del admin.
- Por compatibilidad histórica, el dashboard también puede reconocer `submitted: true` como entrega, pero todo registro nuevo debe guardar ambas marcas.
- Una entrega final debe incluir `submittedAt`, `completadaAt`, `updatedAt`, `score`, `total` y la identidad básica del estudiante.
- El envío final se realiza en una sola escritura atómica. No se guardan primero las respuestas y después la marca de entrega en operaciones independientes.

## 3. Autoguardado sin pérdida

- Toda actividad extensa debe autoguardar respuestas antes de la entrega.
- El estado visible debe distinguir `Guardando…`, `Avance guardado` y `Error al guardar`.
- Los autoguardados deben ejecutarse en una cola serializada. Dos escrituras no pueden competir entre sí.
- Antes de la entrega final se cancela el temporizador pendiente y se espera a que termine toda escritura de borrador en curso.
- Después de iniciar la entrega no puede arrancar un nuevo autoguardado.
- El autoguardado nunca puede sobrescribir una entrega final con `submitted: false` o `completada: false`.
- Un error de red no borra respuestas ni bloquea definitivamente el botón de entrega.

## 4. Entrega final

- Debe existir un solo botón `Entregar clase`, de tipo `button`, y un solo controlador de envío.
- El primer clic inicia la entrega. No se exige una segunda marcación ni un segundo botón ambiguo.
- Durante la escritura el botón queda deshabilitado y cambia a `Entregando…`.
- La página debe esperar la respuesta de Firebase, directamente o mediante la API oficial de la sección, y leer de vuelta `completada` antes de anunciar éxito.
- Solo después de confirmar `completada: true` se cambia el botón a `Clase entregada`.
- Si Firebase falla, el botón vuelve a estar disponible, conserva las respuestas y muestra un error visible con opción de reintento.
- Una entrega ya confirmada no se vuelve a escribir por accidente. Al abrirla nuevamente se restaura en estado entregado.

## 5. Confirmación visible

- Toda clase con entrega debe mostrar un panel o modal inequívoco con el título `Entrega confirmada`.
- La confirmación debe indicar que el trabajo quedó guardado y que aparecerá como `Completada` en el panel.
- Debe incluir un botón o enlace explícito para volver al dashboard o al inicio de su ruta personal.
- No se redirige automáticamente: el estudiante debe alcanzar a leer la confirmación.
- El cuadro debe ser accesible, con `role="dialog"`, `aria-modal="true"` y título asociado.
- Los mensajes de validación deben usar una región visible con `role="status"` y `aria-live="polite"`.
- No se usan únicamente `alert()` ni retornos silenciosos para informar problemas.

## 6. Validación pedagógica

- La entrega se bloquea solo por respuestas obligatorias faltantes, no por respuestas incorrectas.
- Una actividad formativa puede mostrar retroalimentación si fue diseñada para ello, pero acertar no es requisito para entregar.
- El mensaje debe decir exactamente qué falta y llevar al primer campo incompleto.
- El número de preguntas, el progreso y el total se calculan desde los datos reales; no se duplican cifras escritas manualmente.
- `score` y `total` deben considerar únicamente los reactivos puntuables definidos para esa sesión.
- Si las alternativas cambian por estudiante, la corrección debe usar el mismo mapa determinista aplicado a ese UID.
- Las respuestas correctas, el puntaje y la retroalimentación sumativa permanecen ocultos hasta que el profesor habilite resultados.

## 7. Cierre metacognitivo

- El cierre debe pedir respuestas escritas, no solo selecciones.
- Se prefieren tres consignas directas: qué comprendió, qué evidencia usó y qué mejorará.
- Cada consigna debe poder entenderse sin una explicación oral adicional.
- Se evita nombrar únicamente una técnica abstracta como “escalera metacognitiva”. La acción concreta debe estar escrita.
- La extensión mínima debe comprobar reflexión real sin transformar el cierre en una barrera desproporcionada.

## 8. Dashboard y admin

- El dashboard debe leer el registro de la misma ruta que escribe la guía: `plataforma_estudiantes/respuestas/{sessionId}/{uid}`.
- Los estados deben ser mutuamente excluyentes: `Pendiente`, `En progreso` o `Completada`.
- Una entrega confirmada debe aparecer como completada al regresar o recargar el dashboard.
- El admin debe distinguir borrador de entrega final y no inferir entrega a partir de una nota manual.
- Restablecer una actividad debe ser una acción deliberada del profesor y no debe ocurrir al editar una calificación.
- El acceso individual por licencia médica debe alterar la disponibilidad, no el estado ni las respuestas del estudiante.
- La publicación de resultados es independiente de la entrega y solo la controla el profesor.

## 9. Recuperación de inconsistencias

- Antes de calificar se auditan registros con `submitted: true` y `completada` ausente o falsa.
- También se revisan entregas completas sin `score`, con `total` incorrecto, puntaje fuera de rango o identidad faltante.
- Un borrador solo se recupera como entrega cuando contiene toda la estructura obligatoria de la sesión.
- Toda reparación se ejecuta primero en modo de simulación y luego con `--apply`.
- La reparación conserva respuestas, calcula con la clave individual correcta y agrega marcas de tiempo sin borrar evidencia.
- El control final debe informar cero inconsistencias pendientes.
- Para la Clase 4 se usa `node scripts/check-preassigned-ensayos.js --repair-session sesion-u3-4`.

## 10. Pruebas obligatorias

- Validar la sintaxis de todos los scripts embebidos de la página y del dashboard.
- Ejecutar `npm run verify:class-submission` antes de desplegar.
- Probar una entrega completa con una cuenta controlada: responder, entregar, ver la confirmación, volver al panel y comprobar `Completada`.
- Probar el caso de error de red: las respuestas permanecen y el botón permite reintentar.
- Probar el caso de autoguardado activo: la entrega final debe quedar como completada.
- Revisar consola y solicitudes fallidas durante carga, autoguardado, entrega y regreso al panel.
- Verificar en Firebase las dos marcas, los tiempos, `score`, `total` y la identidad.
- Después del despliegue comprobar el HTML servido desde `https://www.estudiacest.com`, no solo el archivo local.
- Ejecutar un segundo barrido de inconsistencias cuando la clase ya está siendo usada.

## 11. Despliegue y preservación

- Publicar únicamente desde la fuente canónica con `npm run deploy:prod:safe`.
- Nunca usar un snapshot parcial ni `vercel deploy --prod` directamente.
- No eliminar ni reemplazar áreas vigentes de PAES, SIMCE, NM3, NM4 o 3ATP al publicar una clase.
- El proyecto 3ATP Mecánica Industrial está archivado: se conserva íntegro, accesible en `/3atp/` y protegido por el manifiesto aunque deje de ser una sección activa de portada.
- Toda sección nueva debe sumarse al portal y al administrador sin sustituir tarjetas, archivos, rutas, datos ni funciones existentes.
- Toda página con entrega debe agregarse a `scripts/class-submission-contract.json`.
- El build debe fallar si una página registrada incumple el contrato técnico.
- Los cambios se confirman en Git antes del despliegue y se verifica la URL pública después.

## 12. Definición de terminado

Una clase no está terminada hasta que cumple simultáneamente lo siguiente:

- Autoguarda sin competir con la entrega final.
- Valida campos faltantes con mensajes visibles.
- Permite entregar aunque existan respuestas incorrectas.
- Guarda `submitted: true` y `completada: true` en una única operación final.
- Confirma la escritura leyendo Firebase.
- Muestra `Entrega confirmada` y un regreso claro al dashboard.
- El dashboard la muestra como `Completada`.
- El admin recibe la entrega en la sesión y curso correctos.
- Los resultados permanecen ocultos hasta autorización docente.
- Las verificaciones local, de datos y de producción terminan sin errores.
