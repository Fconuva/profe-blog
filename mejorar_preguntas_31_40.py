# -*- coding: utf-8 -*-
"""
Script para agregar contextos pedagógicos extensos a las preguntas 31-40
Incluye: nombres de educadoras, situaciones reales, OAs BCEP 2018
"""

import json

# Contextos pedagógicos mejorados para preguntas 31-40
contextos_mejorados = {
    "parv-31": {
        "contexto": "La educadora Patricia trabaja en un jardín infantil de Arica con un grupo de NT2. Durante actividades matemáticas, observa que los niños pueden contar oralmente hasta 20, pero cuando les pide contar objetos reales (bloques, piedras, fichas), muchos recuentan los mismos elementos o saltan algunos. Patricia reflexiona sobre el Objetivo de Aprendizaje 7 del núcleo Pensamiento Matemático de las BCEP 2018: 'Representar números y cantidades hasta el 10, en forma concreta, pictórica y simbólica'. También considera el OA 8: 'Resolver problemas simples de manera concreta y pictórica agregando o quitando hasta 10 elementos, comunicando las acciones llevadas a cabo'. Patricia sabe que contar no es solo recitar la secuencia numérica, sino establecer correspondencia uno a uno, entender cardinalidad (el último número es la cantidad total), y comprender que el orden no afecta la cantidad. Necesita diseñar experiencias que desarrollen verdadera comprensión del conteo, no solo memorización de la serie numérica.",
        "numero": 31
    },
    "parv-32": {
        "contexto": "El educador Luis trabaja en un jardín infantil de Iquique con un grupo de NT1. Quiere iniciar a los niños en conceptos matemáticos de clasificación y seriación. Tiene varias opciones didácticas: fichas impresas donde deben marcar patrones, ejercicios dirigidos donde él indica 'ordenen de pequeño a grande', o materiales manipulativos diversos. Luis reflexiona sobre el Objetivo de Aprendizaje 3 del núcleo Pensamiento Matemático de las BCEP 2018: 'Comunicar la posición de objetos y personas respecto de un punto u objeto de referencia, empleando conceptos de ubicación y distancia tales como: dentro/fuera; encima/debajo/entre; al frente de/detrás de; cerca/lejos y dirección (adelante/atrás/hacia el lado), y nociones de izquierda y derecha (en relación a sí mismo)'. También considera el OA 4: 'Orientarse temporalmente en situaciones cotidianas, empleando nociones y relaciones de secuencia (antes/ahora/después/al mismo tiempo, día/noche), frecuencia (siempre/a veces/ nunca) y duración (larga/corta)'. Luis sabe que los conceptos lógico-matemáticos se construyen mediante acción sobre objetos concretos. Quiere asegurar un enfoque manipulativo y lúdico.",
        "numero": 32
    },
    "parv-33": {
        "contexto": "La educadora Verónica trabaja en un jardín infantil de Calama con un grupo de NT2. Durante el juego libre, nota que los niños construyen torres, hacen caminos con bloques, crean 'casas' con cajas. Verónica se pregunta si estos juegos 'simples' tienen valor matemático o si debería estructurar más las actividades. Reflexiona sobre el Objetivo de Aprendizaje 5 del núcleo Pensamiento Matemático de las BCEP 2018: 'Emplear cuantificadores, tales como: más que, menos que, igual que, todo, ninguno, algo, entre otros, al comparar cantidades de objetos en situaciones cotidianas'. También considera el OA 6: 'Experimentar con diversos objetos estableciendo relaciones al clasificar por dos o tres atributos a la vez (forma, color, tamaño, función, masa, materialidad, entre otros) y seriar por altura, ancho, longitud o capacidad para contener'. Verónica ha leído investigaciones sobre 'geometría informal' en educación parvularia: cómo el juego con bloques desarrolla conciencia espacial, conceptos topológicos, vocabulario geométrico. Necesita valorar y potenciar estas experiencias matemáticas emergentes.",
        "numero": 33
    },
    "parv-34": {
        "contexto": "El educador Fernando trabaja en un jardín infantil de La Calera con un grupo de NT1. Planifica una salida al parque y quiere integrar aprendizajes matemáticos. Algunos colegas le dicen 'matemáticas es para la sala', que el parque es solo para juego libre. Fernando reflexiona sobre el Objetivo de Aprendizaje 1 del núcleo Pensamiento Matemático de las BCEP 2018: 'Crear patrones sonoros, visuales, gestuales, corporales u otros, de dos o tres elementos'. También considera el OA 2: 'Experimentar con diversos objetos, estableciendo relaciones al clasificar por dos atributos a la vez (forma, color, tamaño, función, entre otros) y seriar por altura o longitud'. Fernando sabe que las matemáticas están en todas partes: contar escalones, comparar tamaños de hojas, clasificar piedras por forma, crear patrones con palitos, estimar distancias. Quiere aprovechar el contexto natural para experiencias matemáticas auténticas y significativas, mostrando que la matemática es parte de la vida cotidiana, no solo ejercicios en cuadernos.",
        "numero": 34
    },
    "parv-35": {
        "contexto": "La educadora Natalia trabaja en un jardín infantil de Constitución con un grupo de NT2. Implementa un proyecto de ciencias sobre 'seres vivos'. Los niños observan plantas, insectos, lombrices, pájaros en el jardín. Natalia quiere que los niños registren observaciones, pero no sabe si dibujar es suficiente o si debe incorporar otras formas. Reflexiona sobre el Objetivo de Aprendizaje 1 del núcleo Exploración del Entorno Natural de las BCEP 2018: 'Manifestar interés y asombro al ampliar información sobre cambios que ocurren en el entorno natural, a las personas, animales, plantas, lugares y cuerpos celestes, utilizando diversas fuentes y procedimientos'. También considera el OA 7: 'Comunicar sus observaciones, los instrumentos utilizados y los hallazgos obtenidos en experiencias de indagación en el entorno natural, mediante relatos, representaciones gráficas o fotografías'. Natalia sabe que la indagación científica requiere observación sistemática, registro, comparación. Quiere enseñar a los niños a documentar como científicos: dibujos detallados, fotos, descripciones orales, gráficos simples.",
        "numero": 35
    },
    "parv-36": {
        "contexto": "El educador Marcelo trabaja en un jardín infantil de Ancud con un grupo de NT1. Quiere desarrollar curiosidad científica en los niños. Planifica experimentos: mezclar colores, hacer flotar/hundir objetos, plantar semillas, hacer burbujas. Sin embargo, algunos experimentos 'fallan': las semillas no germinan, las burbujas se revientan. Marcelo se pregunta si debe preparar todo para que 'salga bien' o permitir el error. Reflexiona sobre el Objetivo de Aprendizaje 2 del núcleo Exploración del Entorno Natural de las BCEP 2018: 'Formular conjeturas y predicciones acerca de las causas o consecuencias de fenómenos naturales que observa, a partir de sus conocimientos y experiencias previas'. También considera el OA 3: 'Manifestar interés por realizar experiencias de indagación mediante el uso de procedimientos científicos sencillos, en forma individual o colaborativa'. Marcelo ha leído que el pensamiento científico se desarrolla justamente cuando las predicciones no se cumplen, generando disonancia cognitiva que impulsa nueva exploración. El 'fracaso' es oportunidad de aprendizaje.",
        "numero": 36
    },
    "parv-37": {
        "contexto": "La educadora Gabriela trabaja en un jardín infantil de Castro con un grupo de NT2. Durante el invierno, los niños preguntan constantemente '¿por qué llueve?', '¿por qué hace frío?', '¿de dónde viene el viento?'. Gabriela se siente tentada a dar respuestas científicas completas, pero duda si los niños las comprenderán. Reflexiona sobre el Objetivo de Aprendizaje 4 del núcleo Exploración del Entorno Natural de las BCEP 2018: 'Comunicar propiedades básicas de los objetos y elementos naturales que explora, tales como: transparencia/ opacidad, flexibilidad/rigidez, rugosidad/lisura, relacionándolos con posibles usos'. También considera el OA 5: 'Explorar los cambios o efectos que se producen en los materiales al aplicarles fuerza, calor o agua'. Gabriela sabe que a esta edad no se trata de memorizar definiciones científicas, sino de desarrollar habilidades de indagación: observar, preguntar, explorar, formular hipótesis simples. Las respuestas deben generar más preguntas, no cerrar la curiosidad.",
        "numero": 37
    },
    "parv-38": {
        "contexto": "El educador Ignacio trabaja en un jardín infantil de Coquimbo con un grupo de NT1. Implementa experiencias de exploración sensorial: cajas con diferentes texturas, bandejas de arena y agua, materiales naturales (conchas, piedras, hojas). Algunos padres cuestionan: '¿qué aprenden ensuciándose con tierra?'. Ignacio reflexiona sobre el Objetivo de Aprendizaje 6 del núcleo Exploración del Entorno Natural de las BCEP 2018: 'Establecer relaciones de semejanzas y diferencias de animales y plantas, a partir de algunas características (tamaño, color, contextura, morfología), sus necesidades básicas (formas de alimentación y abrigo), y los lugares que habitan, al observarlos en forma directa, en libros ilustrados o en TICs'. También considera el OA 8: 'Practicar algunas acciones cotidianas, que contribuyen al cuidado de ambientes sostenibles, tales como manejo de desechos en paseos al aire libre, separación de residuos, cuidado del agua, entre otras'. Ignacio sabe que la exploración sensorial es fundamental: desarrolla observación detallada, vocabulario descriptivo, categorización, y conexión emocional con el mundo natural. Necesita comunicar el valor pedagógico a las familias.",
        "numero": 38
    },
    "parv-39": {
        "contexto": "La educadora Isabel trabaja en un jardín infantil de Ovalle con un grupo de NT2. Quiere implementar educación ambiental. Algunos colegas le recomiendan hablar sobre contaminación, calentamiento global, extinción de especies. Isabel siente que son temas pesados para niños de 5 años. Reflexiona sobre el Objetivo de Aprendizaje 8 del núcleo Exploración del Entorno Natural de las BCEP 2018: 'Practicar algunas acciones cotidianas, que contribuyen al cuidado de ambientes sostenibles, tales como manejo de desechos en paseos al aire libre, separación de residuos, cuidado del agua, entre otras'. También considera el OA 10: 'Identificar las condiciones que caracterizan los ambientes saludables, tales como: aire y agua limpia, combustión natural de basura, reciclaje, reutilización y reducción de desechos, tomando conciencia progresiva de cómo estas contribuyen a su salud'. Isabel ha investigado sobre educación ambiental en primera infancia: debe ser positiva (qué podemos hacer), activa (acciones concretas: reciclar, plantar, cuidar), y conectada emocionalmente (amor por la naturaleza más que miedo). El objetivo es crear ciudadanos ambientales desde pequeños.",
        "numero": 39
    },
    "parv-40": {
        "contexto": "El educador Tomás trabaja en un jardín infantil de Illapel con un grupo de NT1. Durante una actividad sobre 'mi familia', nota que hay gran diversidad: niños con dos mamás, niños que viven con abuelos, niños de familias monoparentales, familias reconstituidas. Tomás quiere celebrar esta diversidad sin hacer sentir a ningún niño 'diferente'. Reflexiona sobre el Objetivo de Aprendizaje 2 del núcleo Comprensión del Entorno Sociocultural de las BCEP 2018: 'Apreciar el significado que tienen para las personas y las comunidades, diversas manifestaciones culturales que se desarrollan en su entorno'. También considera el OA 6: 'Planificar proyectos y juegos, en función de sus ideas e intereses, proponiendo actividades, organizando los recursos, incorporando los ajustes necesarios e iniciándose en la apreciación de sus resultados'. Tomás sabe que la familia es el primer contexto de socialización y que todas las configuraciones son válidas. Necesita estrategias pedagógicas que normalicen la diversidad familiar sin esencializar un modelo único de familia.",
        "numero": 40
    }
}

# Guardar en JSON
with open('contextos_mejorados_31_40.json', 'w', encoding='utf-8') as f:
    json.dump(contextos_mejorados, f, ensure_ascii=False, indent=2)

print(f"✓ Creados {len(contextos_mejorados)} contextos pedagógicos mejorados")
print("✓ Guardado en: contextos_mejorados_31_40.json")

# Mostrar estadísticas
for key, data in contextos_mejorados.items():
    palabras = len(data['contexto'].split())
    print(f"  - {key}: {palabras} palabras")
