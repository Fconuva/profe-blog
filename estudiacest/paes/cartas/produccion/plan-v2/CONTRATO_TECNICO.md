# Contrato técnico de la colección 2

Diseño `umbral-diseno-2.0`. Documento normativo de construcción, no backend ya implementado. Referencia superior: [plan completo](../PLAN_COLECCION_2_COMPLETO.md), REGLAS.md y CONTRATO_ENTREGA_CLASES.md. No incluir en respuestas estudiantiles los nombres de variantes, claves, semillas, diagnósticos o estos detalles técnicos.

## 1. Arquitectura y archivos propietarios

Mantener navegador JavaScript/HTML/CSS, Firebase Auth/Admin y API `/api/paes`. No agregar un servicio de pago, una base pública o un conector a Roblox/Godot. Motor puro: entrada estado+acción+entropía autorizada; salida nuevo estado+eventos o rechazo sin cambios. El frontend no transmite un estado de partida como si fuera autoridad.

| Superficie a construir | Responsabilidad |
|---|---|
| `paes/cartas/catalogo-v2.js` | Catálogo de cartas y reglas públicas, exportación navegador/CommonJS; no contiene claves académicas. |
| `paes/cartas/motor-v2.js` | Resolver turnos, objetivos y efectos de catálogo; puro, sin red o DOM. |
| `api/_paes-cartas-economy.js` | Cuenta, inventario, premios, sobres, fabricación y recibos. |
| `api/_paes-cartas-game-v2.js` | Autorización, salas, mazos, transiciones y clasificación atómica de curso. |
| `api/_paes-cartas.js` | Despacho autenticado, trabajo académico vigente y derivación de recompensas. |
| `paes/cartas/coleccion.js`, `sobres.js`, `efectos.js` | Editor, apertura y eventos confirmados, sin autoridad económica. |
| `paes/cartas/juego.js`, `cartas.css`, HTML regular/guiado/docente | Navegación, interfaz y enseñanza; conservar flujo y contractos actuales. |
| Auditorías del área | Diseño, motor, economía, ranking, compatibilidad y navegador. |

Mantener `motor.js`/salas v1 disponibles para recuperación. No cambiar el catálogo que usan partidas antiguas cuando se publique v2. No ejecutar `produccion/expandir.cjs` antiguo para reconstruir el nuevo diseño: sus valores son un borrador sustituido.

## 2. Versiones e identidad

Cuatro identidades separadas: `academicVersion=umbral-1`, `catalogVersion=umbral-coleccion-2.0`, `rulesVersion=umbral-duelo-2.0`, `designVersion=umbral-diseno-2.0`. Mantener `sessionId` académico original y su ruta individual; no crear otra evaluación para incorporar sobres.

Cada sala y cada sobre fija catálogo/reglas. Una sala v1 sigue v1 hasta terminar; nuevas salas usan v2. Cada cliente carga módulo por versión devuelta por servidor. Si la versión no es compatible, solicitar recarga, preservar respuestas locales y recuperar sala; nunca aplicar una versión silenciosamente distinta.

Autorizar token actual con Admin Auth, perfil por UID, activo y curso admitido. Seleccionar ruta académica personal mediante el lector canónico actual; no copiar identificadores personales al diseño ni al catálogo público. Solo el profesor autorizado ve nómina real, claves y escritos. No reutilizar credenciales de otro proyecto.

Todas las lecturas de propietario verifican UID del token, no `uid` libre del cuerpo. Curso desde perfil, no URL. Parámetros mode/version nunca conceden acceso a otra identidad. Código de sala no autoriza leerla si no se es participante.

## 3. Datos v2 y límites

Raíz privada: `plataforma_paes/cartas_juego_v2`; las reglas RTDB de raíz siguen cerradas. Todas las nuevas escrituras pasan por API Admin.

| Nodo | Contenido | Alcance transaccional |
|---|---|---|
| `cuentas/{uid}` | `collectionVersion`, copias por ID, oro/esencia, sobres por ID, recibos y créditos concedidos. | Toda economía de esa cuenta. |
| `mazos/{uid}/{mode}/{slot}` | ID, nombre, 18 IDs o borrador, revisión, versión, actualización y copia recuperable. | Un espacio por actualización. |
| `ligas/{year}/{course}` | Alias, clasificación, salas presentes, reserva de sala por UID, eventos de resultados y límites diarios. | Curso completo para crear/unirse/terminar y actualizar ambos Elo juntos. |
| `archivo/{year}/{course}/{roomId}` | Sala final completa, citas y recibos; hash e instante de archivo. | Escritura inmutable del archivo; retirada solo después de verificarlo. |
| `admin_audit/{eventId}` | Corrección autorizada, motivo, actor, antes/después y vínculo al respaldo. | Evento inmutable. |

Reutilizar `cartas_intentos`, `cartas_config` y `cartas_archivo` para evaluación; no trasladar registros existentes. Para sobres y liga no crear un intento académico falso ni otra tarjeta de clase.

Cuenta: números enteros seguros no negativos, hasta 1.000.000.000 oro/esencia; un crédito que exceda el tope aborta y pide revisión, nunca recorta silenciosamente. Máximo 1.000 sobres cerrados por cuenta; compra sobre el límite rechaza sin cobrar. No poner texto académico en nodo económico.

Recibos económicos compactos se conservan mientras exista la colección, con máximo técnico de 20.000 operaciones por cuenta; alcanzar ese límite bloquea nuevas mutaciones económicas y requiere archivo privado verificado antes de continuar, sin impedir lectura/entrega. La operación archivada conserva un índice de resultado para idempotencia permanente. No caducar un ID y volver a conceder su premio.

Curso: máximo 40 salas preparadas/activas (80 jugadores), una por UID; mantener máximo 40 finalizadas completas recientes. Antes de crear la 41.ª finalizada, archivar la más antigua y verificar hash fuera de la transacción; solo después retirar su estado completo en transacción si su hash no cambió. El evento compacto de resultado y deduplicación permanecen. Si falla archivo, no borrar sala; detener creación de nuevas salas con mensaje, dejando jugar/entregar las existentes.

Rango de capacidad probado: cuatro cursos admitidos y hasta 45 estudiantes simultáneos por curso. Tamaño de rama viva de liga ≤4 MiB; si supera, bloquear creación nueva, archivar datos ya finalizados y volver a leer. No bloquear acciones activas solo por ese tope. Ningún proceso elimina evaluaciones para reducir tamaño.

## 4. Esquema de carta y conservación

ID de tipo estable (`guardian`), ID de copia dentro de la partida (`instanceId`) y propiedad de colección son distintos. Al iniciar un mazo, cada copia recibe ID único de esa partida. Guardar objetos de copia en baraja/mano/descarte/campo/adjuntos; una copia cambia de zona sin multiplicarse.

Invariante de partida: las 18 copias originales de cada jugador existen exactamente una vez entre baraja, mano, descarte, aliados, reliquias adjuntas y apoyos. Jugar hechizo lo mueve a descarte; equipar lo mueve a adjunto; caída mueve portador y adjuntos a descarte; apoyo agotado/destruido va a descarte. No usar robo para crear una nueva copia física adicional.

Eventos de estado: ID `roomId:revision:index`, tipo, fuente, destinatario, cambios efectivos, actor y versión. El servidor devuelve eventos de revisiones confirmadas; el cliente recuerda última revisión/IDs y no reproduce una animación repetida. Nunca incluir el orden de baraja, mano enemiga, entropía o explicación de cita rival.

Arrays vacíos RTDB: normalizar baraja, mano, descarte, aliados, adjuntos, apoyos y eventos como arrays, aunque Firebase omita arrays vacíos o los devuelva como objetos. Conservar orden explícito `enteredAtSerial` para disparadores. No depender del orden de claves por accidente.

## 5. Estados del duelo

`waiting`: creador y mazo reservado, sin mano rival. `preparing`: dos participantes, primer jugador fijado y manos privadas, cambios/confirmación. `active`: mano confirmada por ambos y turno vigente. `ended`: resultado definitivo. `closed`: cierre neutral. No regresar desde ended/closed a active.

Crear fija mazo v2 y modalidad, reserva UID. Unirse fija segundo mazo y reserva su UID atómicamente; no puede ocupar dos salas en carreras paralelas. Repetir unirse como miembro devuelve estado, sin barajar otra vez. Tercer participante: rechazo. Sala expirada esperando/preparando: liberar reserva neutralmente.

Código: seis caracteres del alfabeto `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`, normalizado a mayúsculas, sin espacios; entropía criptográfica de servidor. Reservar solo si no existe en la rama viva del curso; probar hasta cinco candidatos por operación y después responder 503 sin crear sala. No reutilizar un código vivo. Alias: siguiente entero libre de la liga, asignado en su transacción y conservado para esa cuenta; nunca se sortea ni cambia por perder.

Cambiar mano requiere fase preparing, sin cambio previo ni mano ya confirmada; 0–2 IDs propios únicos. Confirmar mano marca solo al propietario. La transición a active ocurre cuando ambos están confirmados, una sola vez.

Acciones activas: `play`, `attack`, `power`, `end`, `concede`. Solo concede se acepta fuera del turno propio; consulta no es mutación. Cerrar neutral es administrativo o por expiración, no un concede del rival. El mismo evento terminal actualiza desenlace y ambas clasificaciones en una transacción de liga.

Desde ended/closed, revancha crea nueva sala/ID, no reabre la anterior. Ambos aceptan, mazos se vuelven a validar y orden se invierte. Si uno editó mazo o cambió modalidad, mostrar una nueva preparación y no asumir consentimiento automático.

## 6. Contrato API

Todas las rutas pasan por `/api/paes?action=...`, bajo identidad canónica. Lecturas GET; mutaciones POST JSON. Cuerpos limitados a 16 KiB, salvo guardado académico vigente con su límite propio. `operationId`: UUID v4 creado una vez por acción; persistir hasta recuperar respuesta. Validar también revisión/versiones.

| Acción | Entrada esencial | Salida autorizada |
|---|---|---|
| `cards-game-profile` GET | Sesión | Saldos, copias propias, sobres, mazos y liga propia. |
| `cards-game-init` POST | operationId/catalogVersion | Bienvenida única o recibo de inicialización previo. |
| `cards-deck-save` POST | operationId/mode/slot/deck/revision | Espacio confirmado y validación. |
| `cards-deck-delete` POST | operationId/mode/slot/revision/confirm | Copia privada recuperable siete días y espacio libre. |
| `cards-deck-restore` POST | operationId/slot/archiveId/revision | Recuperación de borrado propio. |
| `cards-pack-buy` POST | operationId/catalogVersion | Sobre nuevo y saldo confirmado. |
| `cards-pack-open` POST | operationId/packId | Cinco resultados, conversiones y saldos del recibo. |
| `cards-operation` GET | operationId | Recibo propio; 404 si no hubo confirmación. |
| `cards-craft` POST | operationId/cardId/catalogVersion | Copia y esencia confirmadas. |
| `cards-reward-sync` POST | operationId/sessionId | Solo créditos derivados de evidencia canónica; saldo confirmado. |
| `cards-game-create` POST | operationId/mode/deckSlot/deckRevision | Sala propia waiting. |
| `cards-game-join` POST | operationId/code/deckSlot/deckRevision | Preparing privado. |
| `cards-game-hand` POST | operationId/code/revision/selectedIds/confirm | Mano propia y confirmación. |
| `cards-game-act` POST | operationId/code/revision/kind/instance/target/proof | Estado propio, eventos y recibo. |
| `cards-game-state` GET | code/afterRevision | Estado privado actualizado o sin cambios. |
| `cards-game-ranking` GET | curso comprobado/year | Alias y liga de ese curso; historial propio. |
| `admin-cards-game-overview` GET | Identidad administrativa/curso/year | Salas, liga y conciliación del curso. |
| `admin-cards-game-access` POST | operationId/curso/open/revision | Abrir/cerrar creación de salas, sin desentregar clase. |
| `admin-cards-game-close` POST | operationId/curso/code/revision/reason | Cierre neutral, libera reservas, sin Elo. |
| `admin-cards-operation` GET | uid/operationId y alcance comprobado | Recibo privado de consulta. |
| `admin-cards-economy-preview` POST | uid/reason/deltaGold/deltaEssence | Vista previa/hash del cambio y saldo; no escribe. |
| `admin-cards-economy-apply` POST | operationId/uid/previewHash/confirm | Cambio autorizado/auditoría/relectura. |
| `admin-cards-ranking-preview` POST | course/year/eventId/correction/reason | Reproducción de liga y alcance dependiente; no escribe. |
| `admin-cards-ranking-apply` POST | operationId/course/previewHash/confirm | Evento correctivo y proyección reconstruida. |
| `admin-cards-game-archive` POST | operationId/course/roomId/hash | Archivo completo verificado antes de retirar estado vivo. |
| `admin-cards-economy-archive` POST | operationId/uid/receiptRange/hash | Archivo privado de recibos con índice de deduplicación permanente. |

Ninguna ruta recibe saldo, premio, porcentaje, Elo o resultado como valor confiable del cliente. Rechazar propiedades inesperadas de autoridad. El frontend puede mostrar datos previstos, pero el mensaje de éxito usa relectura confirmada.

Respuestas: 200 confirmado/repetición válida; 400 dato/objetivo ilegal; 401 sin sesión; 403 fuera de alcance; 404 sala/operación propia inexistente; 409 revisión/operación incompatible o capacidad de copias; 410 sala expirada; 429 exceso de acciones; 503 servicio/capacidad temporal. Error con código estable y mensaje español concreto, sin stack, identidad ajena o diferencias de existencia sensibles.

`Cache-Control: private, no-store` en todas las rutas privadas; no almacenar token en logs. Catálogo público puede tener cache de versión fija, sin claves académicas. No modificar la sesión/perfil global para habilitar cartas.

## 7. Idempotencia y transacción

ID y hash SHA-256 del cuerpo normalizado se guardan junto al resultado. Mismo ID/mismo cuerpo: devolver recibo 200 sin repetir efectos, antes de comparar revisión antigua. Mismo ID/cuerpo distinto: 409 sin cambio. IDs de diferentes usuarios son espacios distintos.

Un proceso de transacción es puro y reentrante: recibe estado, clona y valida; no llama red, no genera nuevas imágenes ni dispara premios externos dentro del callback. Entropía de esa petición se genera una vez fuera del callback. Reintentos contra el mismo estado producen el mismo resultado.

Manejo de null: leer explícitamente antes de transaccionar; si es inicialización real sin registro puede crear cuenta. En acciones de cuenta/sala existente, un null inicial de caché no se trata como premio nuevo o ausencia definitiva: devolver transición neutra para que SDK relea y reintente, con control de estado esperado. Después de la transacción siempre releer y distinguir committed, ausente verdadero y conflicto. Probar el caso de null inicial aunque hubiera dato remoto.

Economía entera de cuenta en una transacción: oro/esencia/inventario/sobres/recibos/créditos. Liga entera de curso en una transacción para reserva de ambos, revisión de sala, desenlace, dos Elo y límites. No registrar A ganador antes de confirmar B perdedor en otra escritura.

## 8. Entropía y sobres

Generar 1.024 palabras uniformes de 32 bits con Node crypto por petición que pueda barajar/sortear; nunca usar palabras enviadas por cliente. Callback usa una copia del mismo buffer y reinicia índice en cada reintento. Si agotara buffer, abortar sin mutación y error recuperable; no caer a Math.random.

Selección uniforme en [0,n): calcular `limit=floor(2^32/n)*n`; rechazar muestras ≥limit; retornar muestra módulo n. Barajado Fisher–Yates con este selector. Semillas/entropía no se publican ni se graban en logs.

Rareza ordinaria: entero 0–99: [0,60) común, [60,85) poco común, [85,95) rara, [95,99) épica, [99,100) legendaria. Quinta: [0,85) rara, [85,97) épica, [97,100) legendaria. ID uniforme sobre grupo ordenado por ID del catálogo fijado. Registrar IDs/rareza/versiones, no entropía.

Recibo conserva las cinco posiciones originales, conservadas/conversiones e importes efectivos. Un nuevo intento de apertura del mismo packId con distinto operationId devuelve `alreadyOpened` y vínculo al recibo original, sin premiar nuevamente. Pack nunca vuelve a cerrado tras abrirse.

## 9. Recompensa académica sin doble pago

Fuentes: intento canónico, identidad, sessionId y reglas de ruta correspondientes. Nunca confiar en respuestas o `missionComplete` que llegaron solo a reward-sync. Tras guardar borrador/entrega, intentar sincronizar créditos confirmados; un fallo de premio no revierte una entrega académica válida.

IDs económicos estables `sessionId:mission:missionId` y `sessionId:submit`; el sufijo de ruta no crea dos derechos para la misma cuenta/sesión educativa. La identidad exacta solo tiene su variante correspondiente. Guardar condición, fuente canónica y timestamp de concesión sin exponer aciertos.

Lectura de intención → validar evidencia → transacción de cuenta: si crédito ya existe, no sumar; si no existe, sumar una vez y guardar crédito. Reinicio académico conserva los créditos antiguos. No retirar una recompensa porque el docente reabrió para corregir, no clonar sessionId para pagar otra vez.

Al cargar perfil, al confirmar guardado/entrega y al pulsar Recuperar saldo, reward-sync reconcilia solo las tres misiones y entrega de esa sesión. Son cuatro créditos máximos, no un barrido de todos los cursos. Una operación tiene un resultado confirmado aunque luego se editen respuestas.

## 10. Liga y resultado atómico

Estado de liga conserva alias/ratings/stats, contadores por fecha de Chile/pareja, room revision y resultado único por roomId. Fecha computable = instante de cierre del servidor convertido con `Intl.DateTimeFormat` en America/Santiago; no offset fijo ni día UTC. Pareja ordenada por UID para que A/B no altere el contador.

Al terminar, validar elegibilidad, leer ratings vigentes, calcular delta, incrementar ambos stats/límites y registrar `rankEventId=roomId:terminalRevision` con ratings antes/después, resultado, fórmula y motivo. Concurrencia de finales se serializa en la rama del curso y sus Elo quedan aplicados en orden de commits, reflejado en revision/evento. No recomputar con rating de cliente.

Cambio de curso: no habilita nuevo welcome/monedas, sí otra liga. Antes de habilitar una sala del nuevo curso, cerrar neutralmente cualquier reserva anterior y comprobar su liberación. Si falla, mostrar Recuperar sala y no crear otra; no sumar Elo ni permitir acceso del nuevo curso a la sala vieja. Clasificación vieja archivada; no mostrar al estudiante la nómina del curso anterior tras cambiar perfil. Alias nuevo por liga, propio visible desde antes de primera partida. Liga con 45 estudiantes soporta listas privadas completas sin paginar datos ajenos fuera del curso.

Corrección administrativa no edita un evento original: evento compensatorio con motivo y respaldo, reconstrucción determinista de la proyección desde eventos elegibles por orden, previsualización y confirmación; al corregir un evento viejo recomputar posteriores de ambos y todas las cuentas dependientes en esa liga, no aplicar únicamente un delta inverso si hubo juegos siguientes. Verificar alcance y relectura, sin modificar evaluación.

## 11. Frontend, red y pestañas

Una cola serializada por economía/mazo y otra por duelo; un bloqueo visual por mutación. Cola académica existente independiente y prioritaria al entregar. Bloquear botones mientras pendiente no sustituye idempotencia de servidor.

Polling: 2,2 s en primer plano, 8 s en segundo, después de error 4/8/16/30 s y máximo 30; al volver a foco recuperar inmediatamente. Solo una cadena por sala. Ignorar respuestas de sala anterior o revisión menor. Sin repetir una mutación de resultado desconocido: consultar operationId primero.

Límite de acción de servidor: cuatro nuevas mutaciones de duelo por segundo por UID; economía dos por segundo; lectura tres por segundo. Un reintento del mismo ID no consume otro cupo; no aplicar 429 a la entrega académica por abrir sobres. Límite almacenado en transacción/servidor, no solo memoria de función efímera.

Offline: se puede leer recursos cargados, escribir borrador local y consultar recibos ya visibles. No se simula compra/jugada económica o PvP como exitosa. Al volver red: recuperar estado canónico y operación; no enviar un historial inventado de acciones offline.

Dos pestañas: UID/sala/revisión compartidos por servidor. Una gana la transacción, la otra recupera; misma operación en ambas solo cuenta una. BroadcastChannel puede mejorar avisos, pero no es necesario para la corrección. Cambio de cuenta limpia solo su estado local y detiene polling anterior, sin borrar datos ajenos.

## 12. Entrenamiento y tutorial

Entrenamiento local no usa Auth, RTDB ni premios. Misma lógica de reglas; entropía local propia o semilla de escenario reproducible, nunca simulada como sorteo de un sobre real.

Rival de práctica ve solo su propia mano y campo público. Orden de decisión determinista: cita si disponible; evitar morir este turno; eliminar Custodia peligrosa; desplegar aliado con mayor valor `(ataque+vida)/coste` respetando espacio; daño letal al refugio si legal; equipo útil; poder; resto de acciones con mayor beneficio efectivo; atacar legalmente y terminar. Empates por ID/copia. Nunca leer mano/baraja oculta del estudiante ni cambiar vida/maná para ganar.

Tope por turno de bot: 32 acciones confirmadas; todas consumen maná/carta/preparación conforme motor. Si no hay acción útil, terminar. Si falla una regla, detener entrenamiento con opción Recuperar escenario, sin afectar respuestas académicas ni declarar victoria ficticia.

## 13. Migración y release

No escribir migración masiva a cuentas reales: welcome-v2 lazy por cuenta autenticada al entrar, transacción única. Conservar intentos/salas v1 y no convertir sus resultados en liga. No ejecutar reset sobre nodos viejos. Las reglas de datos siguen privadas.

Antes de integrar: fetch/revisión de origin/main y preservación del trabajo ajeno. Commit con rutas explícitas. Probar fixtures con funciones reales, no servidor estático para API. Registrar todo recurso público crítico, compañero guiado y scripts de build en manifiesto/contrato y .vercelignore. `guiada.html` debe estar en Git pese a la regla global GUIA*.html; verificar checkout limpio.

Build integral, checkout aislado basado en último remoto y deploy exclusivamente `npm run deploy:prod:safe`. Esperar finalización; verificar alias/proyecto/commit/hash y entradas de portal. Pruebas públicas de autenticación/recursos/entrenamiento sin crear alumnos o premios ficticios en Firebase real. Flujo completo de guardado/economía y dos estudiantes probado con entorno de funciones aislado.

Rollback: código de versión previa en nuevo release preservando datos/versiones de sobres/salas. Deshabilitar solo creación v2/economía nueva si incidencia; lectura/entrega y recuperación v1 siguen operativas. No invertir saldos confirmados ni borrar recibos como forma de rollback.
