# -*- coding: utf-8 -*-
"""
Script para agregar contextos pedagógicos extensos a las preguntas 21-30
Incluye: nombres de educadoras, situaciones reales, OAs BCEP 2018
"""

import json

# Contextos pedagógicos mejorados para preguntas 21-30
contextos_mejorados = {
    "parv-21": {
        "contexto": "La educadora Alejandra trabaja en un jardín infantil de Chillán con un grupo de NT2. Durante una actividad de educación física, implementa un circuito motriz con diferentes estaciones: caminar sobre una viga, saltar aros, lanzar pelotas, trepar una estructura. Observa que Tomás (5 años) completa todo rápidamente y con gran destreza, mientras que Javiera avanza con cautela y necesita más tiempo. Al terminar, escucha a Tomás decir 'yo soy el más rápido' y nota que Javiera baja la cabeza. Alejandra reflexiona sobre el Objetivo de Aprendizaje 1 del núcleo Corporalidad y Movimiento de las BCEP 2018: 'Manifestar iniciativa para resguardar el autocuidado de su cuerpo y su confortabilidad, en función de su propio bienestar'. También considera el OA 4: 'Comunicar el bienestar que le produce el movimiento, al ejercitar y recrear su cuerpo en forma habitual, con y sin implementos u obstáculos'. Alejandra quiere promover el desarrollo motriz de todos valorando el progreso individual, evitando comparaciones que dañen la autoestima, y celebrando que cada niño tiene su propio ritmo y fortalezas únicas.",
        "numero": 21
    },
    "parv-22": {
        "contexto": "El educador Sergio trabaja en un jardín infantil de Valdivia con un grupo de NT1. Durante el período de juego al aire libre, organiza actividades motrices. Nota que varios niños de 4 años aún tienen dificultades con habilidades como saltar en un pie, atrapar pelotas, o mantener equilibrio en superficies elevadas. Sergio reflexiona sobre el Objetivo de Aprendizaje 3 del núcleo Corporalidad y Movimiento de las BCEP 2018: 'Tomar conciencia de su cuerpo, de algunas de sus características internas (tales como: ritmo cardíaco, de respiración), de su esquema y progresivamente de su tono corporal y lateralidad, por medio de juegos'. También considera el OA 5: 'Perfeccionar su coordinación visomotriz fina, a través del uso de diversos objetos, juguetes y utensilios'. Sergio sabe que el desarrollo motor grueso es fundamental para aprendizajes posteriores y que requiere experiencias sistemáticas, variadas y lúdicas. Quiere diseñar actividades que desarrollen equilibrio, coordinación, fuerza, y conciencia corporal de manera integrada y divertida, respetando ritmos individuales.",
        "numero": 22
    },
    "parv-23": {
        "contexto": "La educadora Beatriz trabaja en un jardín infantil de Curicó con un grupo de NT1. Durante el recreo, observa que la mayoría de los niños corren, trepan y exploran activamente el patio, pero hay un grupo de 5 niños que prefieren quedarse sentados en un rincón conversando o jugando con pequeños objetos. Beatriz se pregunta si debe 'obligarlos' a moverse más. Reflexiona sobre el Objetivo de Aprendizaje 4 del núcleo Corporalidad y Movimiento de las BCEP 2018: 'Comunicar el bienestar que le produce el movimiento, al ejercitar y recrear su cuerpo en forma habitual, con y sin implementos u obstáculos'. También considera el OA 1: 'Manifestar iniciativa para resguardar el autocuidado de su cuerpo y su confortabilidad, en función de su propio bienestar'. Beatriz ha leído sobre la importancia del movimiento para la salud, la oxigenación cerebral, la regulación emocional y el desarrollo integral. Sin embargo, también valora respetar las preferencias infantiles. Necesita encontrar estrategias para promover vida activa sin coartar la autonomía, haciendo del movimiento una experiencia placentera, no una obligación.",
        "numero": 23
    },
    "parv-24": {
        "contexto": "El educador Hernán trabaja en un jardín infantil de Los Ángeles con un grupo de NT2. Planifica experiencias de educación física y observa que muchas actividades tradicionales son competitivas: carreras a ver quién llega primero, juegos de eliminación donde los 'lentos' salen rápido, circuitos con cronómetro. Nota que siempre ganan los mismos niños y que otros comienzan a evitar participar diciendo 'yo no soy bueno para esto'. Hernán reflexiona sobre el Objetivo de Aprendizaje 1 del núcleo Identidad y Autonomía de las BCEP 2018: 'Comunicar a los demás, emociones y sentimientos tales como: amor, miedo, alegría, ira, que le provocan diversas narraciones o situaciones observadas en forma directa o a través de TICs'. También considera el OA 6 del núcleo Corporalidad y Movimiento: 'Coordinar con precisión y eficiencia sus habilidades psicomotrices finas en función de sus intereses de exploración y juego'. Hernán quiere rediseñar sus experiencias motrices para que sean inclusivas, que todos participen activamente, que celebren el esfuerzo y la superación personal más que la victoria sobre otros.",
        "numero": 24
    },
    "parv-25": {
        "contexto": "La educadora Mónica trabaja en un jardín infantil de Linares con un grupo de NT2. Está planificando experiencias para desarrollar coordinación visomotora fina, habilidad fundamental para la escritura futura. Tiene varias opciones: hacer que los niños tracen líneas punteadas en hojas, colorear sin salirse de bordes, copiar figuras geométricas, o practicar con letras. Mónica reflexiona sobre el Objetivo de Aprendizaje 5 del núcleo Corporalidad y Movimiento de las BCEP 2018: 'Perfeccionar su coordinación visomotriz fina, a través del uso de diversos objetos, juguetes y utensilios'. También considera el OA 6: 'Coordinar con precisión y eficiencia sus habilidades psicomotrices finas en función de sus intereses de exploración y juego'. Mónica ha estudiado sobre progresión en grafomotricidad: primero movimientos amplios y libres (pintar en caballete, dibujar en pizarra vertical), luego movimientos más controlados (caminos anchos, laberintos), finalmente trazos precisos (líneas, curvas, pre-letras). Quiere asegurar una secuencia respetuosa del desarrollo madurativo.",
        "numero": 25
    },
    "parv-26": {
        "contexto": "El educador Raúl trabaja en un jardín infantil de Rancagua con un grupo de NT1. Durante la lectura del cuento 'Donde viven los monstruos', hace pausas para conversar. Pregunta '¿qué creen que pasará ahora?' y '¿por qué Max se enojó?'. Observa que algunos niños responden con ideas complejas, mientras otros parecen no seguir la historia o responden cosas no relacionadas. Raúl reflexiona sobre el Objetivo de Aprendizaje 1 del núcleo Lenguaje Verbal de las BCEP 2018: 'Expresarse oralmente en forma clara y comprensible, empleando estructuras oracionales completas, conjugaciones verbales adecuadas y precisas con los tiempos, personas e intenciones comunicativas'. También considera el OA 7: 'Comprender contenidos explícitos de textos literarios y no literarios, a partir de la escucha atenta, describiendo información y realizando progresivamente inferencias y predicciones'. Raúl sabe que la comprensión oral se desarrolla mediante interacción activa con textos, no solo escuchando pasivamente. Necesita estrategias efectivas para andamiar la comprensión de todos los niños.",
        "numero": 26
    },
    "parv-27": {
        "contexto": "La educadora Claudia trabaja en un jardín infantil de Melipilla con un grupo de NT2. Implementa un 'círculo de conversación' diario donde cada niño puede compartir experiencias, ideas o inquietudes. Sin embargo, nota que siempre hablan los mismos 5-6 niños (muy verbales, seguros), mientras 10-12 niños casi nunca participan voluntariamente. Cuando les pregunta directamente, algunos responden con monosílabos o dicen 'no sé'. Claudia reflexiona sobre el Objetivo de Aprendizaje 1 del núcleo Lenguaje Verbal de las BCEP 2018: 'Expresarse oralmente en forma clara y comprensible, empleando estructuras oracionales completas, conjugaciones verbales adecuadas y precisas con los tiempos, personas e intenciones comunicativas'. También considera el OA 3: 'Descubrir en contextos lúdicos, atributos fonológicos de palabras conocidas, tales como conteo de palabras, segmentación y conteo de sílabas, identificación de sonidos finales e iniciales'. Claudia quiere que todos los niños desarrollen confianza y competencia oral, no solo los naturalmente extrovertidos. Necesita estrategias inclusivas.",
        "numero": 27
    },
    "parv-28": {
        "contexto": "El educador Esteban trabaja en un jardín infantil de San Fernando con un grupo de NT1. Durante una salida pedagógica al mercado local, quiere aprovechar para ampliar vocabulario. Los niños observan verduras, frutas, pescados, flores. Esteban se pregunta: ¿es suficiente con nombrar las cosas ('esto es una berenjena')? ¿O hay formas más efectivas? Reflexiona sobre el Objetivo de Aprendizaje 2 del núcleo Lenguaje Verbal de las BCEP 2018: 'Comprender textos orales como preguntas, explicaciones, relatos, instrucciones y algunos conceptos abstractos en distintas situaciones comunicativas, identificando la intencionalidad comunicativa de diversos interlocutores'. También considera el OA 8: 'Representar gráficamente algunos trazos, letras, signos, palabras significativas y mensajes simples legibles, utilizando diferentes recursos y soportes en situaciones auténticas'. Esteban sabe que el vocabulario no se aprende por repetición mecánica, sino en contextos ricos donde las palabras tienen significado, uso y conexión emocional. Quiere maximizar el aprendizaje léxico de esta experiencia.",
        "numero": 28
    },
    "parv-29": {
        "contexto": "La educadora Ximena trabaja en un jardín infantil de Talcahuano con un grupo de NT2. Quiere crear un 'ambiente letrado' que promueva la iniciación a la lectura. Algunos colegas le recomiendan llenar las paredes con textos, carteles, abecedarios grandes, palabras escritas. Ximena se pregunta si más texto es necesariamente mejor o si puede ser abrumador. Reflexiona sobre el Objetivo de Aprendizaje 6 del núcleo Lenguaje Verbal de las BCEP 2018: 'Comprender que los textos escritos ofrecen oportunidades tales como: informar, entretener, enriquecer la fantasía y brindar nuevos conocimientos'. También considera el OA 9: 'Comunicar mensajes simples en la lengua indígena pertinente a la comunidad donde habita'. Ximena ha investigado sobre textos funcionales (carteles de rincones, lista de responsabilidades, recetas ilustradas), libros accesibles, y la importancia de que el texto tenga propósito real. Quiere crear un ambiente que invite genuinamente a la lectura, no que solo decore paredes con letras que los niños ignoran.",
        "numero": 29
    },
    "parv-30": {
        "contexto": "El educador Rodrigo trabaja en un jardín infantil de Puerto Varas con un grupo de NT1. Durante actividades de iniciación a la lectura, algunos padres preguntan ansiosamente '¿cuándo aprenderán a leer?' y presionan para que enseñe letras y palabras formalmente. Rodrigo explica que a los 4 años el foco es el lenguaje oral, la conciencia fonológica, el amor por los libros. Pero los padres insisten: 'en kínder ya leen'. Rodrigo reflexiona sobre el Objetivo de Aprendizaje 4 del núcleo Lenguaje Verbal de las BCEP 2018: 'Comunicar oralmente temas de su interés, empleando un vocabulario variado e incorporando palabras nuevas y pertinentes a las distintas situaciones comunicativas e interlocutores'. También considera el OA 5: 'Manifestar interés por descubrir el contenido y algunos propósitos de diferentes textos escritos (manipulando, explorando, realizando descripciones y conjeturas) a través del contacto cotidiano con algunos de ellos, o del uso de TICs'. Rodrigo sabe que forzar lectura temprana puede ser contraproducente. Necesita comunicar claramente a las familias qué experiencias son apropiadas para NT1.",
        "numero": 30
    }
}

# Guardar en JSON
with open('contextos_mejorados_21_30.json', 'w', encoding='utf-8') as f:
    json.dump(contextos_mejorados, f, ensure_ascii=False, indent=2)

print(f"✓ Creados {len(contextos_mejorados)} contextos pedagógicos mejorados")
print("✓ Guardado en: contextos_mejorados_21_30.json")

# Mostrar estadísticas
for key, data in contextos_mejorados.items():
    palabras = len(data['contexto'].split())
    print(f"  - {key}: {palabras} palabras")
