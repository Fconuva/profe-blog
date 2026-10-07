# Balance y aceptación: procedimiento cerrado

Diseño `umbral-diseno-2.0`. La [auditoría de diseño](AUDITORIA_DISENO.json) prueba consistencia de documentos; los escenarios siguientes son exigencias para la construcción futura. No son resultados ya ejecutados sobre un motor v2. No confundir un sorteo estadístico correcto con una carta justa ni simulación con pilotaje humano.

## 1. Qué significa balance en esta versión

No significa cartas idénticas ni 50 % exacto en cada partida. Significa que coste, condición, riesgo y respuestas explican el poder; los tres mazos iniciales ofrecen oportunidades comparables; iniciar no decide el resultado; la colección no compra ventaja en liga y ningún combo evita el turno rival indefinidamente.

Las cuatro legendarias no deben ser obligatorias en todo mazo. Las tres de héroe compiten por un espacio único y zona de apoyo; su inversión inicial no da efecto gratis. El portal es destruible y dura tres activaciones. Raro/épico no multiplica atributos.

## 2. Presupuesto de poder y revisión individual

Base de revisión, no fórmula automática de ganador: aliado sin habilidades, coste 1 ≈5 puntos ataque+vida; coste 2 ≈8; coste 3 ≈11; coste 4 ≈14. Cambiar ataque por vida modifica su papel. Custodia, Prontitud, robo y curación requieren compensar resistencia/fuerza o coste. No sumar vida/fuerza como si su efecto fuera intercambiable en todos los combates.

Ejemplos cerrados: Llama cuesta 1 y daña 3; Réplica cuesta 1 y daña 1 o 4 con cita previa; Hilo cuesta 2 y daña 4 o 6; Síntesis cuesta 3 y daña 6 o 9. Área escala 1/2/3/4 de daño con 1/2/3/4 de coste, con un máximo de tres objetivos. Cura 1/4, Agua 2/8. Sello 1/5, Velo 2/10. Estas curvas evitan el daño de 5 por un maná del primer borrador.

Equipo tiene riesgo concentrado: máximo dos adjuntos, topes de ataque/vida, sin restablecer ataque. Apoyos difieren de hechizos inmediatos: no dan efecto al entrar, ocupan zona y se pueden destruir. Los tres patrones de lectura se compensan con recursos distintos, comparten una sola activación y no califican comprensión.

Para cada par de mismo coste/familia, analizar ambas situaciones con/sin condición, campo lleno/vacío y daño de respuesta. Prohibir dominio estricto: A no puede tener todas las ventajas de B más otra sin compensación. Una excepción aparente debe documentar una situación legal donde B sea preferible; sin esa evidencia, ajustar antes de liberar. Atributos nuevos de Testigo 3/5 evitan que Ballestera 4/4 lo iguale o supere siempre.

## 3. Matriz reproducible de mazos

Tres iniciales exactos en DISENO_CARTAS_60.json. Cada enfrentamiento no espejo: 2.000 semillas × dos órdenes = 4.000 juegos. Tres pares = 12.000 por política. Espejos: mismo tamaño, 12.000 adicionales. Dos políticas = **48.000 partidas iniciales simuladas**.

Políticas sin acceso a mano/baraja rival:

- P1, una acción: enumerar acciones legales por estado; elegir mayor mejora de utilidad y terminar si ninguna supera 0,05. Ataque letal tiene prioridad. Empates por tipo de acción, ID de carta/instancia y objetivo en orden lexicográfico.
- P2, dos acciones propias: para cada primera acción legal calcular la mejor segunda legal de la misma mano/estado; elegir mayor mejora conjunta. Nunca usar la mano real rival ni inventar una respuesta visible. Mismo desempate. Permite medir combinaciones de cita antes de hechizo/equipo.

Utilidad común: `0,7 × diferencia de vida + 0,25 × diferencia de escudo + diferencia de campo + 0,8 × diferencia de tamaño de mano + 0,35 × maná disponible propio`. Campo por aliado: `1,1 × fuerza + 0,35 × vida + 1,2 si Custodia + 0,4 × fuerza si puede atacar ahora`. Apoyo: 0,5 por activación restante multiplicado por valor de recursos (vida 0,7, escudo 0,25, carta 0,8, maná 0,35); héroe: tres activaciones futuras como máximo en esta estimación, pagando su maná. Terminal: +10.000 victoria, −10.000 derrota, 0 empate, que reemplaza la utilidad normal. La utilidad no es puntaje académico ni atributo visible de carta.

Semillas de prueba reproducibles 1–2.000; el motor de fixture usa generador fijo documentado en el informe, separado del crypto de producción. Barajas reflejadas y primer jugador invertido para cada semilla. Cada juego registra versión/hash de catálogo, mazos, política, semilla, orden, resultado, turnos, acciones y motivo de fin. Reporte sin nombres/UID reales.

Métrica de victoria usa empate como 0,5. Reportar también porcentaje de empate, intervalo Wilson 95 % y ventaja por inicio. Para los tres pares iniciales, aceptación: victoria puntual por mazo entre 45 % y 55 % con ambas políticas; intervalo dentro de 40–60; brecha por comenzar ≤5 puntos porcentuales; empates ≤15 %; cero bucles o rechazos inesperados. Mediana de 4–9 turnos propios y percentil 90 ≤12. No anunciar equilibrio si uno falla.

## 4. Mazos adversariales exactos

No son mazos recomendados para principiantes. Exploran extremos para detectar combinaciones dominantes. Todas sus listas deben pasar las mismas reglas del editor.

| ID | Lista de 18 cartas por ID y copias |
|---|---|
| S01, daño directo | exploradora×2, aprendiz×2, mensajera×2, cita×2, cotejo×1, fuego×2, replica×2, relacion×2, sintesis×2, chispa×1 |
| S02, resistencia | guardian×2, defensora×2, medica×2, cotejo×2, pregunta×1, mareas×1, totemroble×1, heroGuardiana×1, escudo×2, purificar×2, cura×2 |
| S03, recursos/apoyos | exploradora×2, vigia×2, guardian×2, cita×2, pregunta×1, heroCronista×1, umbral×1, lente×2, reloj×2, fuente×2, brisa×1 |
| S04, control | golem×2, defensora×2, sabia×2, cita×2, cotejo×1, silencio×2, desvincular×2, contraste×2, tormenta×2, fuego×1 |
| S05, equipo/vínculo | exploradora×2, herbolaria×2, rastreador×2, cita×2, pregunta×1, armadura×2, botas×2, cristal×2, lanza×2, braceros×1 |
| S06, Prontitud | rastreador×2, arquero×2, aprendiz×2, ballestera×2, cita×2, heroExploradora×1, fuego×2, replica×2, chispa×2, botas×1 |
| S07, área | guardian×2, cartografa×2, mensajera×2, cita×2, pregunta×1, heroExploradora×1, oraculo×1, chispa×2, contraste×2, tormenta×2, eclipse×1 |
| S08, cita/aliados | testigo×2, duelista×2, cronista×2, lector×2, cita×2, cotejo×1, replica×2, relacion×2, sintesis×2, fuente×1 |

Cada adversarial contra cada inicial: 2.000 semillas × dos órdenes × dos políticas = 8.000 juegos; 24 cruces = **192.000**. Con iniciales: **240.000 juegos automatizados**. No lanzar datos ficticios contra Firebase real.

Aceptación: ningún adversarial supera 60 % promedio contra los tres iniciales con ambas políticas ni 70 % contra un inicial; ningún inicial pierde a todos los adversariales por encima de 60 %. No exigir 45–55 en cada extremo: se admite especialización y respuestas. Revisar empates/fin por doce turnos en S02, ventaja por coste cero en S01/S08, equipos apilados en S05 y maná de apoyos en S03.

Casos forzados: máximo daño posible en los dos primeros turnos usando las cartas disponibles; no aceptar eliminación de 32 de vida antes de que el rival pueda completar su segundo turno, sin que este haya aceptado retirada. No confundir victoria pronta legal posterior con trampa. Enumerar combos de lectura, cartas baratas y Prontitud en una búsqueda acotada por mano/maná/campo; guardar la secuencia máxima como evidencia.

## 5. Ajuste cuando un umbral falla

No cambiar probabilidades para corregir combate ni ajustar según alumno. Procedimiento:

1. Reproducir con la misma semilla y política; identificar si es bug, regla o valor de carta.
2. Bug: corregir implementación, conservar cifras del catálogo y repetir afectadas + matriz inicial.
3. Valor dominante: probar un cambio por vez, primero coste +1 si no excede 4; después reducir daño/ataque/vida o bono en 1. Si es combinación, limitar la fuente abusiva, no debilitar toda una familia sin evidencia.
4. Carta inútil: probar coste −1 si no crea otro coste cero, o elevar en 1 el recurso principal. No tocar cartas de lectura para compensar una política deficiente.
5. Elegir el menor cambio que cumpla métricas y preserve el papel descrito. Si hay varios, orden fijo: conservar coste, conservar familia, menor suma de cambios absolutos, ID lexicográfico.
6. Cada candidato modifica catálogo de calibración separado, lleva hash y ejecuta matriz inicial completa; ganador ejecuta también adversariales completos. Sin ganador, continuar nuevas iteraciones; no declarar APTO por agotar tiempo.
7. Integrar candidato en versión de diseño nueva antes de release, actualizar textos, fotos de mazos, casos y documentos juntos. Partidas anteriores permanecen con versión vieja.

Estas son reglas de calibración definidas, no cifras abiertas del catálogo. Los resultados finales se informan al profesor; una estadística no sustituye su observación de claridad y carga lectora.

## 6. Sobres: fronteras y distribución

Probar fronteras 0/59/60/84/85/94/95/98/99 ordinarias y 0/84/85/96/97/99 quinta; las probabilidades suman exactamente 100. Para cada grupo, las 60 fichas deben poder aparecer y los índices fuera de rango deben rechazarse.

Muestra de 1.000.000 sobres de fixture con entropía reproducible: 4.000.000 posiciones ordinarias y 1.000.000 quintas. Comparar cada categoría con peso exacto e intervalo de seis desviaciones estándar `6 × sqrt(Np(1−p))`; aceptación dentro de ese margen. Para carta específica, mismo margen y prueba de que ninguna está inaccesible. Reportar media y límites de esencia para inventario vacío, inicial y completo. No hacer llamadas de apertura real para esta muestra.

Pruebas de uniforme por rechazo: muestra igual/alrededor del umbral; valor n=1, n=4, n=6, n=10, n=16, n=24 y límite técnico permitido; n=0 rechaza. Buffer agotado no produce resultado parcial ni fallback Math.random.

Propiedades: cada sobre cinco cartas; quinta nunca común/verde; original receipt inmutable; repetir ID normal tercera vez convierte solo excedente; repetir legendaria segunda vez convierte; duplicados del mismo sobre consultan inventario actualizado. No exigir una legendaria en un conjunto corto como criterio: esa garantía no existe.

## 7. Casos por cada una de las 60 cartas

Cada ficha tiene ID CARD-01…CARD-60; derivar ocho casos mínimos por ficha:

| Sufijo | Preparación/acción | Resultado exigido |
|---|---|---|
| EFFECT | Carta en mano y campo apropiado, maná suficiente, sin tope accidental. | Operaciones exactas, destino de copia correcto y cambios efectivos. |
| COST | Maná coste−1; carta de coste cero con cita ausente/inválida. | Rechazo sin carta/maná/vida/orden/revisión cambiados. |
| TURN | Actor fuera de turno. | 409 sin mutación. |
| REVISION | Revisión antigua. | 409; lectura recupera estado vigente. |
| REPLAY | Misma operación dos veces, una concurrente. | Un efecto/recibo/revisión. |
| INSTANCE | ID de copia inventado o del rival. | Rechazo, sin manipulación de autoridad. |
| VISIBILITY | Recuperar estado de ambos y espectador. | Mano propia, conteo rival; ningún campo privado; tercero rechazado. |
| EVENT | Efecto confirmado y recibido repetido por polling. | Texto/cambio efectivo coinciden; animación solo una vez. |

Son 480 verificaciones de cartas, además de casos especializados y de plataforma. Ally con muerte exige atacar/eliminar para comprobar death; apoyo exige tres inicios y cuarto sin disparador; héroe exige poder, repetición ilegal y destrucción; equipo exige portador propio y caída; lectura exige fragmento regular/guiado y límite compartido.

## 8. Matriz de integración: aceptación obligatoria

| Grupo | Casos concretos |
|---|---|
| AUTH | Sin token 401; token inválido 401; perfil inactivo/curso ajeno 403; petición uid ajeno no cambia cuenta; admin estudiantil 403. |
| VERSION | Recuperar v1 sin stats v2; sala v2 exige versión; sobre viejo usa distribución original; academicVersion/sessionId sin duplicación. |
| DECK | 17/19 cartas; tercera copia; segunda misma legendaria; tres legendarias; dos héroes; menos/seis/diez/más de diez aliados; cero/cuatro lecturas; curva inválida; propiedad insuficiente; préstamo solo aula. |
| ROOM | Crear/unirse/mismo curso; tercero; dos salas simultáneas de mismo UID; código inválido; revancha/orden invertido; sala expirada; guardar mazo después no altera fotografía. |
| HAND | Cinco propias; rival solo conteo; cambio 0/1/2; tres rechaza; ID repetido; retirada reintegra después; segunda elección rechaza; ambos confirman una activación inicial. |
| TURN | Maná 3/4/5/6 y bono máximo 8; segundo no roba doble; descarte de mano; escudo expira antes de apoyo; mano cap 8 no quema; vacío normalizado. |
| COMBAT | Custodia única/múltiple; área ignora; respuesta simultánea con ambos muertos; escudo absorbe; sobre-daño no cura; vínculo activo vs defensivo; terminal simultáneo; copia/adjuntos conservados. |
| STATUS | Congelación siguiente turno, respuesta/Custodia conservadas; repetir rechaza; Deshielo permite actuar y no recongelar; inmunidad expira después de turno disfrutado. |
| SUPPORT | Zona llena; una carga por inicio; tercera completa y descarta; hero poder al entrar pagado/solo uno; Disolver elige apoyo sin Custodia; no afecta equipo. |
| END | Ambos doce turnos; no cierre asimétrico; vida igual empate; escudo no desempata; retirada; neutral por profesor/expiración; completar lectura sin duelo. |
| ECONOMY | Bienvenida una vez/cambio de curso/ruta/pestaña; costo exacto; no saldo negativo; cap/ID; fabricar propiedad prestada no cuenta; créditos solo evidencia canónica. |
| PACK | Quinta rara+; conversión exacta posición por posición; mismo pack distinto operationId recupera recibo; compra/apertura separadas; abrir sin propiedad rechaza; caída tras commit recupera. |
| RACE | Dos compras con oro para una; dos fabricaciones con esencia para una; dos aperturas del mismo sobre; mismo ID/cuerpo diferente; null de caché fría; dos partidas finalizando límites/Elo. |
| RANK | Ganar/perder/empatar sumas exactas; ratings suman igual; límites 3 pareja/10 persona; fecha Chile y cambio DST; colocación cinco; cero partidas; cierre neutral; corrección vieja reconstruye posteriores. |
| ACADEMIC | Cola/autoguardado vs entrega; alternativa incorrecta sí entrega; ambos flags/timestamps; 409 ya entregado recupera; claves solo tras publicación; reset archiva y no paga de nuevo. |
| GUIDED | Gate/restauración exactos, seis ítems, audio detener, un ítem por vez, mismo catálogo/recompensas, cita propia y sin diagnóstico expuesto. |
| NETWORK | Desconectar antes/después del commit; dos pestañas; cuenta cambiada; polling anterior detenido; revisión menor ignorada; acción offline no anunciada como éxito. |
| ADMIN | Curso/sesión correctos, cierre neutral, publicación/ocultamiento, recibos, corrección con respaldo/motivo, confirmación y relectura; sin datos en logs públicos. |
| UI | 320/390/1440/3840 CSS px, teclado/foco/diálogos, no imagen rota/overflow, todas las pantallas, movimiento reducido, sonido apagado, lector detenido al cambiar vista. |
| RELEASE | Git incluye guiada/scripts/manifiesto, build limpio/remoto, alias/hash/versión, rutas protegidas 200, privadas 401/403/404, entrenamiento público sin registros reales. |

Cada caso obtiene evidencia (fixture, respuesta HTTP, estado reread o captura), versión y pass/fail real al construirse. Un conteo de assertions no elimina la necesidad de cobertura de casos. P0/P1: datos perdidos, premios duplicados, fuga de claves/identidad, acción no autorizada, reglas incorrectas o duelo irrecuperable. Todos bloquean liberación. P2: redacción/jerarquía/efecto visual que impide entender también se corrige antes de aula. Solo imperfección cosmética P3 documentada puede seguir, si no afecta contraste/objetivos y no contradice la ficha.

## 9. Pilotaje humano y duración

Ocho duelos de prueba como mínimo con cuentas ficticias, cuatro parejas de adultos o participantes autorizados: principiantes/experimentados y uso regular/guiado. No usar estudiantes reales como fixtures ni registrar diagnósticos. Dos sesiones de observación: antes de corregir y recheck de la causa concreta después.

Medir sin inventar: tiempo de ingreso/preparación, localizar entrega, costo/objetivo/Custodia, porcentaje de acciones rechazadas por incomprensión, duración del duelo, lectura real/decisiones y explicación del estudiante. Objetivo: al menos 7/8 personas ubican dónde crear/unirse/entregar sin intervención tras tutorial; ninguna confunde descarte con perder propiedad; al menos 7/8 aplican Custodia y objetivo correctamente; mediana del duelo 12–20 min, percentil 90 ≤25. Si un texto/gesto confunde a dos personas, corregir y volver a probar ese flujo.

Si turno sin reloj extiende duelo, cerrar neutral en aula y recoger lectura; no penalizar la adecuación con auto-derrota. La secuencia de 90 min se calibra por carga y observación, no porque una tabla sume 90. No hay examen oficial completo dentro de una partida.

## 10. Criterio final de liberación

Todos los 60 efectos, matriz de integración, build y navegador pasan; simulaciones cumplen umbrales y su informe es reproducible; imágenes completas abiertas/revisadas; pilotaje sin problemas de comprensión críticos; datos/versión/alias/hash públicos coinciden. El docente recibe enlace e instrucciones de crear, revisar y publicar.

Si falta una comprobación necesaria, no se llama terminado el lanzamiento. Esta regla no deja una decisión de diseño abierta: define qué evidencia debe producir el trabajo de construcción. No se ejecuta una prueba destructiva sobre cuenta real para poder marcar una casilla.
