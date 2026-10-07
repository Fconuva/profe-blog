# Crónicas del Umbral: especificación completa

**Diseño umbral-diseno-2.0 · 7 de octubre de 2026.** Especificación para construir la colección 2. Sustituye el plan preliminar; fija decisiones, cantidades, casos límite y criterios de liberación. No afirma que el motor ampliado esté publicado ni que sus futuras pruebas hayan pasado.

## Documentos de una sola especificación

| Documento | Autoridad |
|---|---|
| Este plan | Producto, reglas, sobres, economía, pantallas y decisiones de alcance. |
| [Catálogo completo](plan-v2/CATALOGO_60.md) | Las 60 fichas y listas exactas de los tres mazos de aula. |
| [Datos de diseño](plan-v2/DISENO_CARTAS_60.json) | Fuente numérica de fichas, límites, probabilidades, economía y mazos; no es código operativo. |
| [Contrato técnico](plan-v2/CONTRATO_TECNICO.md) | Estados, API, transacciones, privacidad, versiones y recuperación. |
| [Balance y pruebas](plan-v2/BALANCE_Y_PRUEBAS.md) | Muestras, escenarios, umbrales y procedimiento de calibración. |
| [Validez y clase](plan-v2/VALIDEZ_Y_CLASE.md) | Habilidades, revisión, mediación individual y clase de 90 minutos. |
| [Auditoría documental](plan-v2/AUDITORIA_DISENO.json) | Comprobaciones realmente ejecutadas sobre cifras y documentos. |

Las reglas canónicas del repositorio prevalecen. Los límites globales prevalecen sobre el texto abreviado de una carta. Una divergencia entre documento y JSON debe corregirse antes de construir; no se interpreta silenciosamente. El catálogo conserva los valores normativos de la primera implementación v2. Cambiar un valor requiere actualizar todos los artefactos y su versión.

## 1. Producto completo y límites

Juego original web en `/paes/cartas/`, para dos estudiantes del mismo curso, sobre motor y APIs de Estudia CEST. Se usa en navegador, sin instalación estudiantil ni cuentas de otro servicio. No se reanuda la aventura 2D cancelada ni se introduce un motor Godot/Roblox.

El lanzamiento incluye: 60 cartas con todos sus efectos, tres mazos de aula, editor, colección persistente, oro, esencia, fabricación, sobres aleatorios, rarezas por color, ranking por curso, entrenamiento, tutorial, revisión docente y recuperación. No quedan como ampliaciones indefinidas.

Decisiones de alcance: sin comercio, dinero real, apuestas, subastas, chat libre, espectadores, campaña RPG o más de dos jugadores. No se pierden cartas de la colección al jugarlas. No se promete una fecha: la secuencia y la aceptación están fijadas. La colección admite crecimiento en un catálogo futuro versionado, sin modificar retroactivamente sobres ni partidas actuales.

Puntuación lectora, colección, saldo y resultado del duelo son registros independientes. Ganar, perder, retirarse, poseer una legendaria o desconectarse nunca modifica la evaluación lectora ni bloquea `Entregar clase`.

## 2. Mundo, continuidad y misiones

**Crónicas del Umbral:** dos lectores representan refugios de un pueblo que debe recuperar un archivo, interpretar testimonios y decidir cómo proteger sus rutas. Las cartas son personas, objetos y estrategias de ese mundo. El duelo es una disputa estratégica entre refugios, no una acusación de que el compañero sea enemigo del pueblo.

| Misión | Personaje distinto | Situación | Producto individual |
|---|---|---|---|
| El archivo perdido | Inés, archivista | Reconstruir un traslado mediante carta, registro y nota. | Seis alternativas, decisión y evidencia. |
| Los testimonios del bosque | Amaya, guardabosques | Comparar relatos y distinguir inferencia de sospecha. | Seis alternativas, decisión y evidencia. |
| El consejo del pueblo | Simón, consejero | Examinar una propuesta y la suficiencia de sus argumentos. | Seis alternativas, decisión y evidencia. |

Fuente de textos/ítems: `api/_paes-cartas-catalog.js`, versión académica `umbral-1`. No duplicar ni alterar su corrección para crear cartas. Sus 18 preguntas: 4 Localizar, 8 Interpretar y 6 Evaluar. La práctica no equivale a una PAES oficial ni convierte resultados en puntaje PAES.

Cada misión muestra `Lee → Responde → Decide y justifica → Guarda`. Después: `Prepara mazo → Crea o entra a sala → Juega → Revisa y entrega`. `Entregar clase`, `Terminar turno` y `Retirarme` son acciones distintas. Las misiones se resuelven sin rival; el duelo no exige acertar preguntas. Las citas exigen consultar un fragmento real, sin revelar claves mediante su efecto.

## 3. Cantidades y familias

**60 cartas distintas, 116 copias útiles para colección completa.** Las 16 actuales están incluidas, no se suman aparte.

| Familia | Distintas | Comportamiento |
|---|---:|---|
| Aliados | 24 | Fuerza, vida y habilidades; permanecen hasta caer. |
| Hechizos o magias | 18 | Efecto inmediato; descarte. |
| Reliquias | 6 | Adjuntos de aliados; descarte cuando cae el portador. |
| Tótems | 3 | Apoyos con tres activaciones propias. |
| Artefactos | 3 | Apoyos de recursos con tres activaciones propias. |
| Héroes | 3 | Apoyos de poder activable con coste y límite. |
| Lectura | 3 | Fragmento y explicación; efecto inmediato y descarte. |

No hay criaturas adicionales fuera del catálogo ni efectos aleatorios de daño, crítico u objetivo. El tipo determina comportamiento; rareza determina disponibilidad. Solo se sortean primer jugador, barajas/reciclajes y contenido de sobres.

## 4. Rarezas, color y copias

| Rareza | Color exacto | Símbolo | IDs | Copias por ID |
|---|---|---|---:|---:|
| Común | Gris `#9BA5B0` | ● | 24 | 2 |
| Poco común | Verde `#60CF89` | ◆ | 16 | 2 |
| Rara | Azul `#56AAFF` | ✦ | 10 | 2 |
| Épica | Morado `#BD7AFF` | ✶ | 6 | 2 |
| Legendaria | Dorado `#FFBC46`, destellos naranjos | ★ | 4 | 1 |

Mostrar marco, palabra y símbolo; no depender solo del color. Texto principal legible, nunca sobre destellos. Coste: número blanco sobre azul petróleo. Vida: corazón; fuerza: espada; maná: cristal; escudo: rombo; oro: moneda; esencia: polvo luminoso.

No hay variantes doradas con atributos superiores. Una ilustración alternativa conserva ID y efecto. Una legendaria tiene papel singular, no multiplicador de fuerza/vida. `Única` significa una copia por mazo, no una sola persona propietaria: ambos estudiantes pueden usar el mismo héroe.

## 5. Modalidades y equidad

| Modalidad | Cartas | Ranking | Guardado |
|---|---|---|---|
| **Duelo de aula** | Las 60 prestadas a todos; tres mazos listos y editor. | Sí, si la partida es computable. | Duelo, mazos y desenlace. |
| **Duelo de colección** | Solo copias propias; tres mazos iniciales completos. | No, amistoso. | Colección, mazo y duelo. |
| **Entrenamiento** | Las 60 prestadas y rival de práctica del mismo motor. | No. | Ningún intento, moneda, sobre o resultado real. |

El préstamo no incorpora propiedad ni esencia. Marcar `Prestada para aula`. Así el resultado del sobre no concede ventaja en la clasificación escolar. El creador fija modalidad; el segundo la confirma y no puede cambiarla.

## 6. Reglas del mazo y editor

Exactamente 18 cartas; 6–10 aliados; 1–3 lecturas; al menos 6 cartas de coste 0–2; máximo 4 de coste 4 o mayor; máximo 2 legendarias y 1 héroe. Se aplican todos los límites y las copias por ID de la tabla.

Inventario: dos copias normales o una legendaria. Convertir excedentes al obtenerlas; no permitir desarmar voluntariamente cartas iniciales. No retirar propiedad por ajustar balance.

Editor: contador 18/18, cantidades propias/prestadas, filtros de familia/rareza/coste, curva y lista concreta de errores. Acciones: Guardar, Duplicar, Usar y Volver al inicial. Tres espacios por modalidad/cuenta, nombre de 1–30 caracteres. Se guarda un borrador inválido, pero no se usa para entrar en sala. Validación completa también en servidor.

Guardar usa revisión del espacio; otra pestaña desactualizada recibe conflicto y opción de recuperar. Duplicar exige espacio libre. Borrar conserva siete días una copia recuperable privada y pide confirmación. Volver al inicial confirma el reemplazo del espacio; no borra cartas/saldo.

Mazos de aula: listas exactas en `CATALOGO_60.md`, un héroe prestado cada uno. Mazos iniciales de colección: conservar las tres listas originales v1, que cubren los 30 IDs iniciales, pero aplicar valores v2 al iniciar una sala v2. Las salas históricas siguen con valores v1.

## 7. Sala, orden de inicio y mano inicial

1. Cuenta CEST y curso vigente seleccionados por servidor.
2. Modalidad y mazo válido; crear sala o entrar con código de seis caracteres.
3. Segundo participante distinto, mismo curso y aceptación de modalidad. Mostrar compañero/modo antes de confirmar.
4. Fijar fotografías inmutables de ambos mazos y reglas. Editar el mazo después no altera el duelo.
5. Sortear primer jugador 50/50; el creador no comienza automáticamente. Revancha invierte orden, conservando los mazos si ambos aceptan.
6. Barajar y dar cinco cartas a cada uno. Permitir cambiar hasta dos, una sola vez; confirmar sin cambio también es válido.
7. Cambiar: retirar elegidas, robar de las restantes, reintegrar/barajar retiradas después. El rival no ve elecciones ni orden.
8. Ambos confirman y comienza el primero. El segundo recibe dos de escudo inicial, hasta el comienzo de su primer turno.

Sin cuenta regresiva. Sala preparada expira a las 24 horas. Una sala preparada/activa por estudiante; `Reanudar` restaura esa sala. Código no sustituye sesión. Si alguien sale durante preparación, cierre neutral; no se consume un sobre ni se pierde propiedad.

## 8. Límites de batalla

| Recurso | Límite/regla |
|---|---|
| Refugio | 32 de vida máxima; no se amplía. |
| Maná base | 3 primer turno propio, luego 4, 5 y 6; permanece en 6. |
| Maná disponible | Se recupera desde el base en cada turno; bonos temporales hasta 8. |
| Escudo | Máximo 16; suma hasta límite y expira al inicio propio. |
| Mano | Máximo 8. Robo excedente se detiene; la carta queda en baraja, no se quema. |
| Aliados | 3 por jugador. |
| Apoyos | 2 entre tótems, artefactos y héroe. |
| Reliquias | 2 por aliado; máximo una del mismo ID en él. |
| Estadísticas | Fuerza máxima 9; vida máxima ampliada 14 por aliado. |
| Lectura | Una activación entre sus tres IDs por turno propio. |
| Héroe | Uno en campo; un poder por turno propio. |
| Partida | 12 turnos propios completos por jugador, sin derrota por reloj de lectura. |

La previsualización muestra mejoras efectivas después de topes. Carta sin beneficio posible se rechaza sin gastar. Efectos de muerte/inicio de turno sí consumen su activación aunque un tope reduzca su beneficio a cero; se informa. Una habilidad de robo sigue pudiendo reciclar descarte; si baraja y descarte están vacíos no roba.

## 9. Orden exacto del turno

Inicio:

1. Incrementar turno propio; maná base = `min(6, 2 + turnosPropios)`.
2. Eliminar escudo antiguo/maná temporal y recuperar base.
3. Resolver Congelación/Deshielo y preparar aliados permitidos.
4. Desde segundo turno propio, robar cinco adicionales a las cartas obtenidas durante espera, con máximo ocho. Primer turno conserva mano inicial sin segundo robo.
5. Activar apoyos por orden de entrada; resolver sus operaciones y consumir carga. Tercera activación completa antes del descarte.
6. Habilitar acciones. Todo el inicio es una transición atómica.

Acciones: carta, ataque de aliado listo, poder del héroe, consultar lecturas, terminar o retirada confirmada. No hay interrupciones/pila de respuestas ni jugadas fuera de turno. Terminar descarta toda la mano restante, conserva aliados/equipo/apoyos/vida/escudo y expira Deshielo del turno ya disfrutado.

Después del turno propio 12 de ambos, gana mayor vida, sin sumar escudo, fuerza, rarezas o aciertos. Misma vida: empate. No se compara después del turno 12 del primero sin dar el del segundo. Vida cero o retirada terminan inmediatamente.

Cierre docente, 24 horas sin actividad o versión irrecuperable: cierre neutral, sin victoria/derrota/Elo. No desempatar una ronda a medias por vida. Desconexión no descarta mano ni cambia turno; se recupera por revisión.

## 10. Resolución de efectos y casos límite

**Antes de gastar:** participante/curso/modo, versión/revisión, turno, instancia en mano, coste, espacios/límites, objetivo y beneficio. Rechazo deja carta, maná, vida, baraja y revisión intactos. Aceptación retira carta, descuenta coste y resuelve operaciones en el orden de su ficha.

Cita debe ocurrir antes de una carta con bono. Una cita posterior no cambia daño ya hecho. El bono usa turno propio actual, no una cita antigua. Una operación nueva confirmada incrementa revisión y crea eventos; un reintento recupera esa misma operación.

### Aliados y daño

Un aliado espera hasta próximo turno, salvo Prontitud. Un ataque por turno. Custodia restringe ataques y daño dirigido a los custodios vivos, si hay alguno; entre varios se puede elegir. Congelado conserva Custodia y responde al ser atacado.

Ataque entre aliados: ambos dañan simultáneamente con fuerza registrada al empezar. El defensor responde aunque caiga. Magia no recibe daño de respuesta. Daño a refugio consume primero escudo; daño a aliado no usa escudo de refugio. La vida no baja de cero. Daño efectivo = vida realmente reducida, sin contar escudo o exceso.

Vínculo vital solo cuando su portador inicia ataque: cura refugio por daño efectivo infligido. No cura con respuesta defensiva, magia/área ni dos veces por fuentes repetidas. Si portador cae, su vínculo del ataque se resuelve antes de limpieza; no revive refugio ya en cero.

Resolver cambios, vínculo permitido y limpieza simultánea de aliados muertos. Descartar aliado y adjuntos; efectos de muerte en orden de entrada, activo primero/rival después. Muerte no revive refugio cero. Comprobar desenlace antes de otra acción; ambos refugios cero en una resolución = empate.

Área: toda fila rival simultáneamente, atraviesa Custodia, sin dañar refugio/apoyos. Fila vacía no permite una magia de área sin otro beneficio. No hay rebote ni crítico aleatorio.

### Reliquias

Objetivo propio vivo con espacio y sin ese ID equipado. Guardar adjunto, no descartarlo aún. Aumentar ataque y vida actual/máxima por la mejora efectiva. No restablecer ataque usado, no conceder Prontitud ni curar automáticamente hasta máximo. Si se obtiene Vínculo vital que ya existe, la parte repetida no duplica curación; sus estadísticas aún pueden mejorar.

### Apoyos y héroes

Zona distinta de aliados, sin fuerza/vida y sin ataques normales. Disolver el vínculo destruye un apoyo rival, también héroe/legendario, ignora Custodia y no activa muerte. Zona llena rechaza entrada; no hay reemplazo automático.

Tótem/artefacto: tres cargas, primera desde siguiente turno propio; agotar después de resolver tercera. Recarga de página no reactiva. Héroe sin cargas: entrar cuesta tres, no activa poder automáticamente; poder cuesta un maná, una vez por turno, incluso el de entrada si queda maná. Solo uno presente; no se cambia con otra invocación.

### Congelación y Deshielo

Silencio elige aliado rival respetando Custodia, que pierde iniciar ataques en el próximo turno propio. Mantiene respuesta/Custodia. Al siguiente comienzo propio recupera ataque y adquiere Deshielo: inmune a congelación desde ese comienzo hasta terminar ese turno. Durante la espera posterior puede congelarse para el próximo turno. No prolongar ni acumular congelación ya activa. Ambos estados tienen símbolo y explicación.

## 11. Citas y evidencia

Documento y fragmento existentes según identidad; explicación regular de 12–1200 caracteres, personal de 3–1200, sin aceptar solo espacios/puntuación. Validación de presencia no certifica comprensión. El rival ve carta/efecto, no explicación ni alternativas. Docente ve cita y relación en privado.

Cita: +1 maná/+1 escudo/robo 1. Cotejo: +1 maná/+3 escudo. Pregunta: robo 2. Comparten una por turno; no devuelven carta ni generan oro. Topes siempre aplican. Carta de lectura muestra fragmento completo antes de confirmar y permite detener audio.

## 12. Sobres, azar y transparencia

Cinco posiciones; cuatro ordinarias y quinta rara o superior garantizada. Primero rareza, luego ID uniforme dentro de ella.

| Rareza | Cada posición 1–4 | Posición 5 | ID específico, ordinaria | ID específico, quinta |
|---|---:|---:|---:|---:|
| Común, 24 IDs | 60 % | 0 % | 2,5 % | 0 % |
| Poco común, 16 IDs | 25 % | 0 % | 1,5625 % | 0 % |
| Rara, 10 IDs | 10 % | 85 % | 1 % | 8,5 % |
| Épica, 6 IDs | 4 % | 12 % | 0,666666… % | 2 % |
| Legendaria, 4 IDs | 1 % | 3 % | 0,25 % | 0,75 % |

Posiciones independientes antes de convertir excedentes; repetición dentro/entre sobres permitida. Sin rerroll por propiedad, cambio por estudiante/nota/racha, garantía oculta o pity timer. Fabricación permite elegir sin sorteo.

Al menos una legendaria: `1 − 0,99^4 × 0,97 = 6,82218703 %` por sobre. No garantiza una cada quince. Mostrar probabilidades/versiones antes de abrir. La animación no decide resultado.

Comprar y abrir son operaciones distintas: compra de 100 oro crea sobre cerrado con ID y catálogo/distribución fijados. Apertura verifica propiedad, consulta operación previa, consume un sobre, añade copias/esencia y guarda recibo atómicamente. Doble clic/caída/reintento recupera el mismo resultado; no descuenta oro otra vez.

Selección criptográfica uniforme de servidor, sin sesgo modular. No retirar cartas de catálogo que aún tiene sobres cerrados ni modificar sus pesos retroactivamente. Fallo de recursos para animar conserva el recibo y permite verlo como lista.

## 13. Economía completa

Bienvenida única por cuenta/colección v2: 60 copias de 30 IDs, tres sobres cerrados, cero oro/esencia. IDs: 24 comunes más cronista, bibliotecario, replica, faro, relacion y contraste, dos cada uno. No repetir por pestaña, curso, ruta personal o reinicio académico.

| Acción | Oro | Condición |
|---|---:|---|
| Cada una de tres misiones | +30 | Respuestas/decisión/evidencia válidas de esa ruta; una vez por misión/sesión/cuenta. |
| Entrega final | +60 | Entrega canónica confirmada; una vez por sesión/cuenta. |
| Comprar sobre | −100 | Saldo suficiente, creación de sobre cerrado y recibo. |
| Abrir sobre | 0 | Consume solo sobre propio. |
| Victoria, derrota, cita, entrenamiento | 0 | No producen moneda. |

Se recompensa completar trabajo, no acertar ni revelar claves. Regular: seis alternativas y evidencia por misión; guiada: sus dos alternativas y decisión, sin exigir evidencia extensa ausente de su contrato. Reabrir no vuelve a pagar. Tres misiones/entrega dan 150: un sobre y 50 restantes. Sesión repetida no genera oro diario. Nueva sesión exige ID/contenido propios.

| Rareza | Esencia por excedente | Fabricar una copia elegida |
|---|---:|---:|
| Común | 5 | 20 |
| Poco común | 10 | 40 |
| Rara | 25 | 100 |
| Épica | 60 | 240 |
| Legendaria | 150 | 600 |

Dentro del sobre procesar posiciones 1→5, comparando inventario actualizado: las copias que caben se conservan, resto se convierte. Fabricar confirma coste, verifica ID/saldo/capacidad y resta/suma atómicamente. Recibo por operación. Sin venta, fabricación por oro, préstamo convertido o saldo negativo.

Con colección completa, media matemática de 80,55 esencia/sobre, mínimo 45. No usar esta expectativa para un inventario incompleto: puede conservar cartas y recibir menos esencia. Todos los saldos vienen de servidor; navegador conserva solo intentos de operación, no autoridad de premios.

## 14. Ranking exacto

Liga por año escolar y curso, autenticada; alias automático estable `Lector/a 001`, sin nombre libre. Docente puede ver identidad privada. No nómina pública. Historial v1 no se reconstruye como ranking v2.

Columnas: posición, alias, Elo, victorias, derrotas, empates, partidas y porcentaje = `(V + 0,5E)/N × 100`, una cifra decimal. Cero partidas: `Sin partidas`. Menos de cinco: `En colocación`, sin posición oficial.

Elo inicial 1000, K=24: `EA=1/(1+10^((RB−RA)/400))`; `SA=1/0,5/0`; delta = redondear `24(SA−EA)` al entero, mitades alejadas de cero. Sumar delta a A y restarlo a B, conservando suma. Sin piso artificial. Orden: Elo, porcentaje, victorias descendentes; alias numérico ascendente desempata. Sin premios por clasificación ni reinicio automático; nuevo año/curso empieza liga nueva, preserva archivo.

Computable: modo aula, dos cuentas vigentes del mismo curso, manos confirmadas y ambos con al menos una acción real de carta/ataque/poder; cierre por vida cero, retirada o límite de doce. No exigir un número mínimo de turnos: excluir victorias tempranas sesgaría la clasificación contra la presión y según quién comienza. Una retirada antes de actuar ambos queda amistosa. Cierre docente/error/expiración es neutral.

Máximo tres partidas por pareja/día Chile y diez por estudiante/día. Revalidar al terminar atómicamente; extras son amistosas con motivo visible. Desconectar no causa derrota automática. Una sala termina/proyecta ranking una sola vez. Cambiar cartas después no recalcula Elo histórico.

## 15. Pantallas y acciones

| Pantalla | Mostrar primero | Acción | Recuperación |
|---|---|---|---|
| Entrada | Premisa/acceso. | Entrar o entrenamiento. | Sesión inválida, curso o red. |
| Inicio restaurado | Identidad/tarea/avance. | Continuar o reanudar. | No reiniciar entrega. |
| Lecturas | Texto y preguntas inmediatamente debajo. | Responder, decidir y justificar. | Copia local/cola serializada. |
| Mazo | Contador/curva/límites. | Guardar/usar. | Errores exactos y revisión. |
| Colección | Propias/prestadas/cantidades. | Inspeccionar/fabricar. | Capacidad/saldo. |
| Sobres | Sobres cerrados/oro/probabilidades. | Comprar/abrir. | Recuperar recibo. |
| Preparación | Modo/mazo/compañero. | Crear/entrar/mano. | Código/curso/sala llena. |
| Tablero | Turno/vida/maná/campo/mano. | Carta/ataque/poder/fin. | Recuperar revisión. |
| Final | Desenlace y motivo de ranking. | Revancha/lecturas/entrega. | Rival ausente no bloquea clase. |
| Ranking | Curso/alias/clasificación. | Ver historial propio. | Sin partidas/red. |
| Cierre académico | Faltantes y tres reflexiones. | Entregar clase. | Ir al primer faltante. |
| Confirmación | Entrega confirmada/Completada. | Portal o juego. | Solo tras relectura. |
| Docente | Curso/entregas/duelos/citas. | Revisar/publicar. | Autorización y auditoría. |

Barra: Duelo, Lecturas, Colección, Sobres, Ranking y acceso permanente a Revisar y entregar. Editor dentro de Colección. En móvil barra desplazable internamente, sin desbordar página. Inspección de carta presenta coste/rareza/efecto y objetivos legales. Elegir objetivo previsualiza consecuencia y botón Confirmar; cerrar no gasta. Teclado/toque bastan; arrastrar no es obligatorio.

Terminar con mano avisa `Se descartarán N cartas` y confirma; puede desactivarse solo como preferencia propia recuperable. Retirada y borrado de mazo siempre confirman. Un solo controlador por acción, sin doble confirmación del mismo envío académico.

## 16. Tutorial y entrenamiento

Seis pasos con escenarios prefijados, sin azar que impida demostración: refugio/corazones/escudo; coste/atributos/condición; invocación/Prontitud/respuesta simultánea; Custodia/área; cita y evidencia; descarte/apoyos/final frente a entrega.

Cada escenario reinicia sus datos locales; no arrastra ventajas del anterior. Maná 6, campos/adjuntos vacíos, refugios 32 y mano exacta del ejercicio, salvo cambio indicado:

| Paso | Estado y acción prefijados | Resultado que debe mostrar |
|---|---|---|
| 1, refugio | Refugio rival 32 con escudo 2; mano Llama reveladora. Jugarla al refugio. | Pagar 1; daño 3 consume escudo 2 y reduce vida a 31; distinguir absorción de pérdida de vida. |
| 2, invocación | Mano Guardiana del umbral y Rastreador de huellas. Invocar ambas. | Pagar 2 por cada uno; Guardiana espera; Rastreador con Prontitud puede atacar; explicar fuerza/vida. |
| 3, respuesta | Aliado propio Rastreador de huellas 3/2 listo, rival Aprendiz de runas 3/2, sin otros aliados. Atacar Aprendiz. | Daño simultáneo, ambos caen, ninguna copia desaparece de la colección. |
| 4, objetivo | Rival Vigía 1/4 con Custodia y Mensajera 1/2; mano Llama y Chispa del debate. | Llama al refugio se impide por Custodia; Chispa daña 1 a ambos aliados, no al refugio. |
| 5, lectura | Mano Cita viva y Réplica fundada; fragmento de entrenamiento ajeno a las preguntas calificadas. | Escribir relación, activar Cita y luego Réplica: bono 4 total, no 1; intentar segunda lectura explica el límite. |
| 6, fin y entrega | Tótem del roble con una carga, mano Luz reparadora y refugio lleno. Simular terminar y avanzar al comienzo propio. | Cura sin beneficio rechaza; mano se descarta; inicio activa escudo 2 y agota tótem. Mostrar botones distintos de Fin del duelo y Revisar y entregar. |

Texto de entrenamiento, no puntuable: «La biblioteca abre de lunes a viernes. El miércoles abre a las diez porque antes se realiza inventario». Pregunta de modelamiento: «¿Puede alguien asumir que abrirá a la hora habitual el miércoles?». Mostrar vínculo entre condición y conclusión; no revela claves de las tres misiones. En la ruta personal se puede oír/detener y explicar brevemente el mismo ejemplo.

Cada paso permite Repetir/Siguiente/Salir y no escribe datos reales. Ayuda define localizar, inferir, evaluar, tesis, argumento y suficiencia con el ejemplo vigente del horario. El entrenamiento libre usa el mismo motor v2 y mazos de aula, pero ninguna moneda/resultado académico. La política del rival se fija en el contrato técnico, sin trampas de mano oculta.

Ayuda fija: localizar = identificar un dato escrito; inferir = relacionar pistas para una conclusión compatible; evaluar = examinar si la evidencia basta; tesis = afirmación defendida; argumento = razón que la sostiene; suficiencia = cuánto respaldo permite esa conclusión. La ayuda no señala alternativas correctas del trabajo evaluado.

## 17. Arte, rendimiento y efectos

60 imágenes distintas: 16 existentes revisadas, 44 nuevas; tres variantes locales/hoja por nueva = 132 variantes mínimas. La primera generación detenida se conserva como antecedente, no como selección aprobada. Añadir tres retratos diferenciados de Inés/Amaya/Simón y un sobre sellado con tres variantes cada sujeto: 12 variantes adicionales mínimas.

Estilo pictórico de fantasía, piedra antigua, sombra azul petróleo, luz ámbar, silueta clara y sujeto individual. Rostros/ropa/edades/roles distintos. Sin textos/marcos/cifras generados dentro de imagen: HTML aporta datos. Prompts ingleses, originales/modelo/semilla/selección conservados. Fondo: tableros propios de Higgsfield ya existentes. Sobre único de cuero/metal sin letras, distribución fija.

Revisar concepto, anatomía, ausencia de texto/logos, legibilidad a 160 px, paleta y diferencia. Hasta tres rondas locales por sujeto; si ninguna pasa, generación alternativa del mismo sujeto con registro. No presentar una imagen fallida como aprobada ni comprar créditos/cambiar plan durante planificación.

WebP carta 640×840 objetivo ≤150 KB; fondo 1920×1080 ≤350 KB; retrato 320×320 ≤45 KB. Sin deformar/cortar sujetos. Carga diferida de colección, precarga tablero/mano visibles; originales/prompts/herramientas excluidos de sitio. Efectos vectoriales/CSS, no un video externo por jugada.

| Evento | Señal | Máximo |
|---|---|---:|
| Invocar | Entrada/halo del aliado. | 350 ms |
| Atacar | Trayectoria al objetivo/número efectivo. | 450 ms |
| Área | Onda de fila/números simultáneos. | 500 ms |
| Escudo | Arco/refugio/rombo. | 400 ms |
| Curación | Luz verde/vida restaurada. | 400 ms |
| Congelar | Cristal/símbolo; Deshielo distinto. | 350 ms |
| Caída | Desvanecer al descarte. | 300 ms |
| Apoyo/poder | Pulso de fuente y destino. | 400 ms |
| Cita | Línea luminosa propia. | 350 ms |
| Abrir sobre | Sello/cinco reversos. | 700 ms |
| Revelar carta | Marco/símbolo de rareza. | 450 ms |

Sonido opcional apagado por defecto, volumen propio persistente, sin voz ni instrucción dependiente de audio. Movimiento reducido: actualización sin trayectorias/giros/partículas; ningún destello rápido. Eventos confirmados una vez por ID, no por cada polling. Animación nunca bloquea guardado/entrega.

## 18. Apertura visible y recuperación

Cantidad/probabilidades antes de abrir. Clic genera ID de operación y petición; botón deshabilitado. Caída permite recuperar ese ID, no inventar otra apertura. Tras confirmación, revelar individualmente o todas; mostrar nombre/rareza/copia/esencia. Resumen de saldo real y acceso a colección. Cerrar/recargar conserva premios sin exigir ver la animación. No fingir legendaria antes de conocer resultado ni decidir premios con ruleta visual.

## 19. Administración y reparación

Autoridad administrativa actual validada en servidor; filtros por curso/sesión. Añadir abrir/cerrar nuevas salas, cierre neutral de duelo, actividad/citas, ranking, consulta de recibos y reparación documentada. El resultado académico mantiene su publicación/restablecimiento independiente.

Corrección económica: cuenta concreta, motivo, antes/después, actor e ID de operación; previsualización/confirmación, respaldo y relectura. No facultad estudiantil ni cambio por victoria. Corrección de ranking conserva historia con evento compensatorio y reconstrucción de proyección; no elimina resultados ni toca evaluación.

Restablecer intento archiva evidencia y no vuelve a pagar. Ocultar resultados no desentrega. Cerrar nuevas salas no oculta resultados académicos ya publicados. Cada acción administrativa deja auditabilidad privada, sin datos personales en logs públicos.

## 20. Clase, accesibilidad y validez

Conservar tres lecturas, conceptos/modelamiento/decisiones/cierre. Sobres fuera de tiempo principal de evaluación. Secuencia completa y análisis en `VALIDEZ_Y_CLASE.md`. La ruta personal conserva seis preguntas, texto breve, pregunta a la vez, audio con detener y sin temporizador. Mismos catálogo, probabilidades, oro equivalente y acceso a héroes/ranking; no mostrar diagnósticos.

No afirmar tratamiento o predicción de puntaje. Rúbrica de explicaciones es formativa, no asigna nota de curso. Las claves/fundamentos permanecen privados hasta entrega y publicación. Objetivo: Comprender textos para localizar información, elaborar inferencias y evaluar afirmaciones con evidencia.

## 21. Construcción por entregables

| Etapa | Entregable | Condición para pasar |
|---|---|---|
| D0 | Especificación, 60 fichas, datos, contratos/pruebas. | Sin cifras divergentes, IDs faltantes o decisiones abiertas. |
| D1 | Motor v2/adaptador v1. | Casos por carta/efecto, conservación y compatibilidad. |
| D2 | Inventario/economía/sobres/mazos/liga. | Concurrencia, idempotencia y recuperación. |
| D3 | Pantallas/tutorial/efectos. | Recorrido, teclado, móvil/4K, movimiento reducido. |
| D4 | Arte completo/procedencia. | Revisión de todas las imágenes y límites de carga. |
| D5 | Balance/calibración/pilotaje. | Umbrales definidos, resultados reales reproducibles. |
| D6 | Commit/build/deploy seguro. | Remoto/alias/hash/rutas y flujo real comprobados. |
| D7 | Entrega docente. | Enlace/instrucciones/evidencia para iniciar y revisar. |

Este encargo termina D0; no ejecuta D1–D7 ni simula sus resultados como publicados. Los valores no se ajustan silenciosamente por cuenta o partida. Si una implementación falla balance, se aplica el procedimiento definido, versiona el ajuste y repite pruebas. Diseño completo no equivale a motor ya validado.

## 22. Fuentes y decisiones que sustituyen el borrador

[DEMRE, descripción oficial de Competencia Lectora](https://portaldemre.demre.cl/paes/factores-seleccion/pruebas-acceso-paes) fundamenta orientar práctica hacia comprensión de textos; los estímulos originales del juego no se presentan como textos auténticos de PAES oficial. Consulta 7-oct-2026; no atribuir el diseño a un temario 2027 no verificado.

[Firebase, escritura y transacciones Admin](https://firebase.google.com/docs/database/admin/save-data) fundamenta probar reintentos/concurrencia y datos inicialmente nulos; no demuestra implementación nuestra. Contratos locales: REGLAS.md, CONTRATO_ENTREGA_CLASES.md y APIs/catálogos vigentes, leídos al planificar. No se importa un modelo de sobres/licencias de franquicias.

Sustituciones: poder de héroe cuesta 1, no 2; cita da 1 escudo, no 3; atributos/daños se redistribuyen con coste explícito; ranking usa préstamo y Elo; escudo/equipo/estadísticas tienen topes; congelación tiene Deshielo; apertura/compra/premios/recuperación tienen recibos y criterios. El lote de creación permanece detenido durante esta tarea de especificación.
