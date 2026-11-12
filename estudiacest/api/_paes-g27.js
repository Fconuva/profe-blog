'use strict';
// Guía 27 · Repaso 1: tema e ideas, propósito comunicativo, inferencias y vocabulario en contexto.
// Clave y retroalimentación viven solo en servidor; cada retroalimentación cita la pista del texto.
const key = {
    1: 'B', 2: 'A', 3: 'C', 4: 'D', 5: 'B',
    6: 'A', 7: 'D', 8: 'C', 9: 'A', 10: 'B',
    11: 'C', 12: 'A', 13: 'B', 14: 'D', 15: 'C',
    16: 'A', 17: 'C', 18: 'B', 19: 'D', 20: 'D'
};

const feedback = {
    1: 'El asunto que se repite en todos los párrafos son las funciones de los humedales: el párrafo 1 anuncia que «cumplen funciones que ninguna obra de ingeniería reemplaza con facilidad» y los siguientes las desarrollan una por una. La ley, las aves y las inundaciones aparecen en un solo párrafo: son detalles.',
    2: 'El párrafo parte con su idea principal: «La primera de esas funciones es regular el agua». Lo que sigue (la esponja, las inundaciones, las napas) explica cómo lo hace: son ideas secundarias.',
    3: 'La idea principal del párrafo es que «los humedales son refugio de vida». Los nombres de aves («taguas, garzas y siete colores») son ejemplos que la apoyan: una idea secundaria que ejemplifica.',
    4: 'El párrafo 1 lo dice de forma explícita: los humedales «fueron vistos como terrenos inútiles: sitios húmedos, llenos de totoras y mosquitos, que convenía rellenar para construir».',
    5: 'La idea principal del párrafo 4 es que «estos espacios benefician directamente a las personas». La ley aparece al final como consecuencia («Por estas razones»): el resumen conserva ese dato de cierre y deja fuera lo esencial.',
    6: 'El texto 1 da a conocer hechos y datos: «habilitó esta semana 2,4 kilómetros de ciclovía», «60 estacionamientos para bicicletas», «unas 900 personas al día». No pide actuar ni comunica emociones: su propósito es informar.',
    7: 'El texto 2 se dirige al lector y lo mueve a actuar: «Deja el auto en casa», «súmate: ven en bicicleta y trae a alguien más». Esos verbos que piden una acción son la marca de la persuasión; además entrega razones («no contamina y no gasta un peso en bencina»).',
    8: 'El texto 3 comunica una vivencia y lo que hizo sentir: «Me temblaban las manos», «se me apretó la garganta de pura alegría», «No sabía cuánto la echaba de menos». El texto 4 también está en primera persona, pero exagera para hacer reír.',
    9: 'En el texto 3 predomina la emoción («se me apretó la garganta de pura alegría»); en el 4, la exageración humorística («me adelantó una señora con bolsas de feria», «iba ocupado respirando»). Usar la primera persona no define el propósito: hay que mirar qué busca provocar el texto.',
    10: 'Lo que se busca es convencer y mover a actuar, es decir, persuadir. El texto 2 es el único construido para eso: interpela al lector («¿Vives a menos de veinte minutos del liceo?») y le pide una acción concreta («ven en bicicleta y trae a alguien más»).',
    11: 'El texto lo dice directamente: el torno estaba «cubierto con la sábana que ella misma le había puesto en marzo». Las otras afirmaciones pueden parecer razonables, pero el texto no las declara: habría que inferirlas a partir de pistas.',
    12: 'Dos pistas apuntan al mismo mes: la sábana que Rosa «le había puesto en marzo» al torno y «el calendario seguía en la hoja de marzo». Al unirlas con lo que sabemos (un calendario detenido indica que la rutina se interrumpió), se infiere que en marzo ocurrió algo que detuvo la vida de la casa.',
    13: 'Un pasaje «solo de ida» indica un viaje sin regreso planificado. Otras pistas apuntan a lo mismo: deja las llaves «donde su hermano las vería al llegar» y se lleva el calendario. El texto no habla de dinero ni de un acompañante.',
    14: 'El narrador aclara que «en la casa ya no quedaba nadie a quien despertar»: el cuidado ya no hace falta, es una costumbre de cuando la casa estaba habitada. El gesto muestra el apego de Rosa, no miedo ni apuro: cierra «despacio».',
    15: 'Es una inferencia global: se unen pistas de todo el texto. Rosa deja las llaves, no levanta la sábana del torno «de su padre», guarda el calendario detenido en marzo, lleva un pasaje «solo de ida» y la casa queda sin «nadie a quien despertar». Todo apunta a una despedida después de una pérdida.',
    16: 'Las palabras vecinas dan la pista: después de «terreno fértil», el texto explica que la mente «combina ideas que parecían no tener relación» y que de ahí «salen muchas de las ocurrencias que después llamamos buenas ideas». «Fértil» se usa en sentido figurado: productivo para las ideas.',
    17: 'Después de los dos puntos, el texto explica cuál es ese «costo»: «una atención cada vez más frágil, que se quiebra ante el primer aviso luminoso». Es una consecuencia negativa, por eso «perjuicio» mantiene el sentido. «Presupuesto» e «inversión» corresponden al sentido de dinero, que aquí no se usa.',
    18: 'Una tregua es una pausa temporal. El contexto lo confirma: la propuesta es hacerlo «durante media hora al día» y los ejemplos son momentos breves («caminar sin audífonos, esperar sin hacer nada»), no un abandono definitivo.',
    19: 'Una gotera es una molestia que se arregla sin demora. Con esa comparación el texto muestra cómo reaccionamos ante un minuto vacío: «lo tapamos con el teléfono». No habla de casas reales: la gotera es una imagen de la urgencia con que evitamos el silencio.',
    20: 'El texto explica enseguida qué hace la mente cuando vaga: «revisa recuerdos, ensaya conversaciones, combina ideas que parecían no tener relación». No se trata de caminar ni de flojear: aquí «vagar» es moverse libremente entre pensamientos.'
};

module.exports = { key, feedback };
