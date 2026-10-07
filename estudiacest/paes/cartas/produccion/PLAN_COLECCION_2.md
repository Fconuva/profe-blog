# Crónicas del Umbral: plan de colección y duelos

**Sustituido el 7-oct-2026 por [la especificación completa](PLAN_COLECCION_2_COMPLETO.md).** Este archivo conserva el primer borrador histórico; sus cifras divergentes no se usan para construir. La autoridad de diseño es el plan completo y sus anexos.

Estado: propuesta de diseño para revisión, 7 de octubre de 2026. Francisco indica planificar todo antes de continuar la creación. No representa funciones publicadas ni cartas balanceadas mediante pilotaje. La versión pública conserva sus 16 cartas y tres mazos originales.

## 1. Objetivo y alcance

Crear una colección original de 60 cartas, efectos jugables y visuales, construcción de mazos, sobres aleatorios, progreso y ranking entre dos estudiantes del mismo curso. La Competencia Lectora sigue siendo el objetivo de la clase: localizar, interpretar y evaluar con evidencia. Oro, colección y victorias no cambian la nota, el resultado ni las condiciones de entrega académica.

No reanudar la aventura 2D cancelada. Conservar las lecturas, guardados, identidad, ruta personal guiada, revisión y publicación docente vigentes. No crear registros de prueba en Firebase de producción.

## 2. Tamaño de la colección

| Familia | Cantidad | Función |
|---|---:|---|
| Aliados | 24 | Unidades con fuerza y vida: ataque, defensa, curación o habilidades condicionadas. |
| Magias | 18 | Efectos inmediatos de daño, protección, curación, robo o control. |
| Reliquias | 6 | Mejoras adheridas a un aliado; desaparecen cuando ese aliado cae. |
| Tótems | 3 | Apoyos que activan efectos al inicio de los próximos tres turnos propios. |
| Artefactos | 3 | Apoyos con efectos de recursos, protección o recuperación durante tres activaciones. |
| Héroes | 3 | Apoyos con un poder activable de coste explícito; una vez por turno. |
| Lectura | 3 | Citar un fragmento y explicar su relación con la estrategia; comparten un límite por turno. |
| **Total** | **60** | Las 16 cartas existentes forman parte de estas 60; no se suman aparte. |

Cada carta tendrá ID estable, nombre, familia, rareza, coste, descripción exacta, atributos, objetivos válidos, efecto real, ilustración propia y efecto visual. El mismo catálogo sirve al navegador y al servidor. El servidor decide el resultado de la jugada.

## 3. Rarezas

| Rareza | Color y etiqueta | Cartas distintas |
|---|---|---:|
| Común | Gris | 24 |
| Poco común | Verde | 16 |
| Rara | Azul | 10 |
| Épica | Morado | 6 |
| Legendaria | Dorado, con destellos naranjos | 4 |
| **Total** | | **60** |

La rareza describe disponibilidad y singularidad, no multiplica el daño, la vida ni la curación. Una legendaria aporta una estrategia particular y también tiene coste y respuestas rivales. Las tres cartas de héroe y un artefacto singular conforman las cuatro legendarias iniciales. El nombre de la rareza y un símbolo acompañan el color para no depender solo de la percepción cromática.

## 4. Copias, cartas únicas y mazos

- Mazo de duelo: exactamente 18 cartas. Todos juegan con la misma cantidad.
- Máximo dos copias de un mismo ID común, poco común, raro o épico.
- Legendarias únicas: máximo una copia de cada ID por mazo.
- Máximo dos legendarias en total por mazo y un solo héroe.
- Entre 6 y 10 aliados por mazo; al menos una carta de lectura y máximo tres cartas de lectura en total.
- Al menos seis cartas de coste 0, 1 o 2 y máximo cuatro de coste 4 o superior. Sin restricciones por facción en esta primera colección.
- Los límites se validan en servidor, también al crear o unirse a una sala. No basta con bloquear botones en el editor.
- Colección útil: hasta dos copias por ID normal y una por legendaria. Las copias excedentes de un sobre se transforman en esencia, con registro visible.
- Un héroe es único por mazo, no único en toda la plataforma. Dos estudiantes pueden usar el mismo héroe. Una carta nunca se retira del catálogo porque alguien la obtuvo primero.

Se conservan tres arquetipos: defensa, control/citas y presión con aliados. Todos disponen de mazos iniciales completos. La construcción de mazos debe permitir guardar, restaurar y revisar su curva de costes antes de entrar en sala.

## 5. Recursos y combate

- Maná: paga cartas y poderes durante el duelo. Inicio con 3, crecimiento hasta 6; se recupera al comenzar el turno propio. Bonificaciones temporales tienen un máximo explícito de 8.
- Vida del refugio: 32. Mano máxima: 8. Fila: máximo 3 aliados. Zona de apoyo: máximo 2 cartas, incluyendo el héroe.
- Aliados atacan desde el siguiente turno propio, una vez por turno. Prontitud permite atacar al entrar a cambio de menor resistencia o mayor coste.
- Combate entre aliados: daño simultáneo y limpieza de derrotados antes de otra acción. Custodia restringe ataques y daño dirigido; daño de área y destrucción de apoyos tienen reglas separadas y explícitas.
- Escudo permanece durante el turno rival y se elimina al inicio del turno propio, antes de activar nuevos apoyos. Curación nunca supera la vida máxima.
- Congelación impide atacar en el siguiente turno propio y luego expira. No elimina al aliado.
- Vínculo vital cura solo el daño efectivo realizado por el ataque, sin contar daño absorbido por escudo ni daño que excede la vida del objetivo.
- Los tótems y artefactos tienen tres activaciones propias; no activan gratis al entrar. Al agotarse van al descarte. Se pueden destruir con una magia específica, también si son legendarios.
- Poder de héroe: paga maná, una activación por turno; no puede usarse fuera de turno ni después de su destrucción.
- Las tres cartas de lectura comparten un máximo de una activación por turno. El fragmento y la explicación quedan disponibles solo para revisión docente. El juego no asigna un acierto lector por escribir cualquier explicación.
- Al terminar el turno se descarta la mano restante; se roba una nueva mano en el siguiente turno propio. Se mantiene la regla actual y se explica antes de jugar.
- Partida acotada: propuesta de máximo 12 turnos por jugador. Si nadie llegó a cero, gana el refugio con más vida; igualdad de vida es empate. No se usa la cantidad de aciertos PAES para desempatar. El primer y segundo jugador reciben el mismo número de turnos antes de esta comparación.

## 6. Sobres y probabilidad

Cada sobre contiene cinco cartas. Cuatro posiciones ordinarias sortean rareza con la primera distribución; la quinta garantiza rara o superior. Después de elegir rareza se elige uniformemente una carta de ese grupo. Las posiciones permiten duplicados, que se explican y convierten cuando exceden el límite de colección.

| Rareza | Cada una de las primeras 4 posiciones | Quinta posición |
|---|---:|---:|
| Común | 60 % | 0 % |
| Poco común | 25 % | 0 % |
| Rara | 10 % | 85 % |
| Épica | 4 % | 12 % |
| Legendaria | 1 % | 3 % |
| **Total** | **100 %** | **100 %** |

Estas son probabilidades por posición, no una garantía de obtener exactamente esos porcentajes en un conjunto pequeño de sobres. La probabilidad de al menos una legendaria en un sobre es `1 - 0,99^4 × 0,97 = 6,822187 %`. No hay garantía oculta ni cambio según alumno, nota, victorias o saldo.

Sorteo criptográfico en servidor, nunca Math.random del navegador. La apertura usa un identificador de operación, transacción de inventario y relectura. Doble clic, caída de red, reintento y caché fría no pueden consumir dos sobres, repetir premios ni generar un saldo negativo. El cliente anima las cinco cartas que ya confirmó el servidor; recargar recupera la misma apertura. Historial privado con rarezas y conversión de duplicados, sin respuestas académicas.

## 7. Oro, esencia y progreso

- Oro: moneda ganada por tareas verificadas por servidor; no se utiliza durante la batalla.
- Sobre: coste propuesto de 100 de oro. Tres sobres de bienvenida por cuenta, concedidos una sola vez.
- Colección inicial: dos copias de las 24 comunes y de las seis cartas adicionales necesarias para conservar los tres mazos actuales; son 30 IDs y 60 copias útiles. Los sobres permiten ampliar los otros 30 IDs. El catálogo inicial concreto se revisa contra los tres mazos antes de publicarlo.
- Recompensas lectoras: 30 de oro por cada una de las tres misiones con respuestas, decisión y evidencia válidas; 60 al confirmar la entrega completa. Una recompensa por cuenta, misión y sesión; restablecer un intento no vuelve a concederla. La ruta guiada usa sus requisitos propios y recibe los mismos importes.
- La recompensa reconoce completar el trabajo, sin anticipar claves ni depender de respuestas correctas antes de la publicación docente.
- Duplicados excedentes: común 5, poco común 10, rara 25, épica 60 y legendaria 150 de esencia.
- Fabricación de carta concreta: 20/40/100/240/600 de esencia respectivamente. Permite progresar hacia una carta elegida, sin depender solamente del azar.
- Validar importes, capacidad y propiedad en servidor. Una fabricación que supera la capacidad de copias se rechaza sin consumir esencia. No añadir un botón de borrar cartas en esta primera versión.

## 8. Ranking

Tabla por curso con victorias, derrotas, empates, partidas y porcentaje de victorias. Usar alias del juego, acceso autenticado y ninguna nómina pública. El ranking académico permanece separado.

No contar entrenamiento, salas sin segundo estudiante o cierres antes de una acción de cada jugador. Una sala terminada se registra una sola vez. La repetición de la misma pareja se muestra como amistosa tras un límite diario propuesto de tres partidas computables. No conceder oro por victorias en esta versión: reduce incentivos a fabricar resultados.

## 9. Efectos visuales y experiencia

- Invocación, ataque dirigido, daño de área, escudo, curación, congelación, caída, activación de apoyo y poder de héroe tienen señales distintas.
- Los efectos acompañan los cambios confirmados por servidor y no alteran el estado del juego. No repetir animaciones al recibir la misma revisión por polling.
- Apertura de sobres: sello cerrado, revelación individual, marco por rareza, botón de revelar todas y resumen de cartas/cantidades/esencia. Se puede omitir la animación y recuperar el resultado después de recargar.
- Sonido opcional y apagado por defecto. Respetar movimiento reducido; no destellos rápidos ni instrucciones dependientes de sonido.
- Vistas: Duelo, Lecturas, Colección/Mazo, Sobres y Ranking. Mostrar primero la acción actual y colocar probabilidades, reglas y explicaciones en paneles de consulta.
- Verificar móvil de 320/390 CSS px, escritorio y 4K. La ruta guiada conserva fragmentos breves, una pregunta por vez y control para detener lectura en voz alta.
- Ilustraciones propias con fuentes, prompts y variantes conservadas fuera del sitio público. Revisar visualmente todas las nuevas imágenes antes de integrarlas.

## 10. Balance: criterios antes de publicar

El catálogo preliminar no demuestra balance. Primero ajustar atributos, costes y texto; después aplicar estas comprobaciones:

1. Toda carta funciona, tiene al menos una situación útil y una respuesta rival; ninguna promete un efecto ausente del motor.
2. Comparar cartas del mismo coste y papel. No permitir que una carta sea superior en todos los atributos sin condición o compensación. Rareza no justifica dominio directo.
3. Auditar curva de maná, número de aliados, robo, curación, protección, control y daño de cada mazo. Límite de campo y costes impiden bucles infinitos y acumulaciones sin respuesta.
4. Simular los tres mazos iniciales con el mismo agente de decisión, semillas reproducibles y ambos órdenes de inicio. Objetivo preliminar: cada enfrentamiento entre 45 % y 55 % de victorias, contando empates como media victoria; diferencia por comenzar menor de cinco puntos porcentuales. Un incumplimiento obliga a ajustar y repetir, no a ocultar la muestra.
5. Probar mazos personalizados, acumulación de apoyos y combos de legendarias. Comparar contra los iniciales y buscar daño letal temprano, bloqueo permanente o robos sin coste efectivo.
6. Sorteos: comprobar fronteras exactas de pesos y hacer una muestra grande reproducible para detectar errores de distribución. Una muestra no garantiza el resultado individual de un sobre.
7. Pilotaje humano: primeras partidas para medir duración, claridad, decisiones y ventaja por experiencia. Las simulaciones no permiten declarar equilibrio definitivo ni duración de 90 minutos validada.

## 11. Clase de 90 minutos y ruta de construcción

Propuesta: 10 minutos de activación, normas y objetivo; 15 de explicación y modelamiento; 25 de lecturas y preparación; 20 de duelo; 10 de revisión de decisiones y 10 de cierre y entrega. Ajustar tras pilotaje. Abrir sobres no sustituye el trabajo lector y puede quedar fuera del tiempo de evaluación.

Orden de implementación una vez cerrado el diseño:

1. Catálogo definitivo de 60 cartas y reglas de balance, sin generar el resto de ilustraciones antes de fijarlo.
2. Motor de efectos y validación de mazos, con pruebas de todas las familias y conservación de duelos existentes.
3. Colección, oro, esencia, fabricación y sobres con transacciones/idempotencia.
4. Editor de mazo, apertura de sobres, rarezas accesibles, efectos y ranking.
5. Ilustraciones finales, revisión y compresión; registrar recursos nuevos en el manifiesto.
6. Auditorías de cartas y guardado, simulaciones de balance y pruebas de funciones reales con cuentas ficticias.
7. Build completo y publicación segura, verificación pública y entrega de enlaces al profesor. Mantener las ampliaciones sin aprobar como propuestas, no como funciones disponibles.

## 12. Estado del trabajo al recibir la corrección

Antes de la indicación de planificar se creó un borrador local de catálogo de 60 cartas y el script de expansión; se iniciaron ilustraciones de la primera carta nueva. Se detuvo la generación al recibir la corrección. Los borradores y originales se conservan localmente como antecedentes, sin integrar en motor, sin commit de código y sin despliegue. Los costes, atributos y efectos de ese borrador deben revisarse según este plan antes de reutilizarlo.
