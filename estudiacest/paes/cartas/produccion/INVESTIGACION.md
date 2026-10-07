# Crónicas del Umbral · decisiones del 7 de octubre de 2026

El proyecto de aventura 2D fue cancelado por Francisco. Sus archivos locales permanecen conservados y quedan excluidos de esta publicación. Francisco pide continuar con cartas y elige **duelo entre dos estudiantes**, en lugar de campaña contra rivales.

## Bases investigadas

- [Slay The Robot](https://github.com/DesirePathGames/Slay-The-Robot): framework de roguelike de cartas en Godot, licencia MIT declarada; acciones, condiciones, campañas y recompensas. Su estructura de campaña es una referencia para una futura modalidad individual, no corresponde al duelo pedido.
- [Deckbuilder Framework](https://github.com/insideout-andrew/deckbuilder-framework): mano, mazo, robo, barajado y arrastre en Godot; [licencia MIT revisada](https://raw.githubusercontent.com/insideout-andrew/deckbuilder-framework/main/LICENSE). Es una base de interacción, no incluye la autoridad del servidor, la identidad de Estudia CEST ni su evaluación.
- [Deck Builder Tutorial](https://github.com/guladam/deck_builder_tutorial): referencia de arquitectura para Godot 4; MIT declarada, sin importación ni ejecución en esta entrega.
- [Godot Card Game Framework 4](https://github.com/kptmn/godot-card-game-framework4): reglas, cartas animadas y biblioteca, licencia AGPL-3.0 revisada. No se incorpora en esta entrega.

Estado: fuentes primarias y licencias revisadas; **ninguno de estos repositorios se presenta como instalado o adaptado**. El motor entregado es original. La interfaz web conserva las cartas y lecturas como controles accesibles, y el mismo motor se ejecuta en el servidor para arbitrar el duelo. No depende del proyecto Godot 2D cancelado.

## Referencias de diseño

[Mitos y Leyendas](https://blog.myl.cl/primeros-pasos-en-myl-manual-de-juego-basico/): diversidad de aliados, armas y recursos, con vínculo narrativo. [Magic](https://magic.wizards.com/en/how-to-play): condiciones explícitas y combinaciones. [Hearthstone](https://hearthstone.blizzard.com/en-us/): claridad de turnos, energía y objetivos. Son referentes; no se utilizan sus cartas, arte, marcas ni código.

## Implementación propia

Dos cuentas del mismo curso comparten una sala de seis caracteres. El servidor conserva la mano privada y valida turno, energía, objetivos, Custodia y revisión de estado. Transacciones impiden aplicar dos veces una jugada y rechazan una ventana desactualizada. No se abren reglas cliente de Firebase.

Tres mazos de 18 cartas, 16 tipos de carta. Refugios con 32 de vida, tres aliados por fila, mano máxima de ocho, energía de tres a seis, ataques a partir del turno siguiente, descarte y reciclaje del mazo. Escudo temporal, cura, reliquias, daño dirigido y daño de fila. Cita viva pide un fragmento real y una explicación; sus combinaciones no califican automáticamente la calidad de esa relación.

Trabajo individual: tres lecturas originales, 18 alternativas, tres decisiones con evidencias y tres reflexiones. Ruta personal: seis preguntas, textos reducidos, una pregunta a la vez, audio y sin cuenta regresiva; acceso seleccionado por la identidad registrada en servidor. Ganar, perder o sufrir una desconexión no cambia el resultado académico ni impide entregarlo. Claves y resultados solo se muestran tras entrega confirmada y publicación docente.

La distribución de 90 minutos está en `docente.html`. Su suma y las pruebas técnicas no sustituyen pilotaje ni validación pedagógica con estudiantes. El balance de mazos también necesita partidas humanas.

Skills aplicadas: estudiacest-platform, paes-competencia-lectora, crear-imagenes, higgsfield y computer-use para verificación de navegador. No se encontró una skill instalada especializada en TCG/Godot y no se instaló un paquete de terceros.

## Ampliaciones consultadas

Francisco pregunta por cantidad variable de cartas, oro/maná, aliados/héroes, tótems, artefactos, magia, sobres y ranking. El catálogo y los mazos pueden ampliarse; el lanzamiento base mantiene 16 tipos y tres mazos de 18. La energía actual funciona como recurso por turno. Los personajes representan mazos, sin poderes de héroe. Las reliquias actuales son mejoras inmediatas, no artefactos persistentes.

Propuesta posterior, todavía sin implementar: héroes con habilidad, tótems con efecto por turno, artefactos persistentes, oro por misiones, sobres ganados mediante aprendizaje y ranking de victorias/derrotas por curso. Mantener mazos iniciales completos, separar clasificación de duelo y resultados de comprensión lectora, y probar el balance con personas antes de ampliar la colección.
