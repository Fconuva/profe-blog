import json

# Cargar el plan.json existente
with open(r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\biologia-ecep-2025\plan.json", 'r', encoding='utf-8') as f:
    plan = json.load(f)

# Banco de preguntas adicionales (3-52)
nuevas_preguntas = [
    # PREGUNTA 3: Genética - Genealogía
    {
        "id": 3,
        "domain": "genetica",
        "difficulty": "hard",
        "stem": "Una profesora de 2° Medio presenta a sus estudiantes la siguiente genealogía de una familia con una enfermedad genética:\n\n<div class='text-center my-4'><img src='/evaluaciones/educacion-media/pruebas/paes-biologia-2023-imagenes/pregunta_3_img_1.png' alt='Genealogía herencia genética' class='max-w-full h-auto mx-auto shadow-lg rounded'/></div>\n\nUn estudiante analiza el pedigrí y concluye: 'Es herencia recesiva ligada al cromosoma X, porque afecta más a hombres que a mujeres'.\n\n¿Cuál de las siguientes intervenciones del docente es más efectiva para que el estudiante identifique su error?",
        "options": [
            {
                "id": "a",
                "text": "Formular la pregunta: '¿Todas las mujeres portadoras (heterocigotas) transmiten la enfermedad a sus hijos varones?' y solicitar que analice la generación III.",
                "isCorrect": false,
                "feedback": "❌ <strong>Respuesta parcialmente correcta pero no óptima.</strong><br><br><strong>Limitación:</strong><br>• La pregunta es pertinente, pero se enfoca solo en un aspecto (transmisión madre-hijo)<br>• No aborda el patrón COMPLETO que descarta herencia ligada al X<br>• El estudiante podría responder correctamente esta pregunta específica sin rectificar su conclusión general<br><br><strong>Patrón clave que falta analizar:</strong> En herencia recesiva ligada al X, un padre afectado (X^r Y) NO puede transmitir la enfermedad a sus hijos varones (solo transmite Y), pero SÍ a todas sus hijas (X^r X). Si en el pedigrí hay padre afectado con hijos varones sanos, se descarta este patrón."
            },
            {
                "id": "b",
                "text": "Solicitar que compare el pedigrí con un ejemplo de herencia autosómica recesiva, identificando similitudes en el patrón de afectados (saltos generacionales, padres sanos con hijos afectados).",
                "isCorrect": true,
                "feedback": "✅ <strong>Respuesta correcta.</strong><br><br><strong>Por qué es más efectiva:</strong><br>• <strong>Comparación sistemática:</strong> Al contrastar con herencia autosómica recesiva, el estudiante identificará:<br>&nbsp;&nbsp;✓ Saltos generacionales (gen I → gen III, saltando gen II)<br>&nbsp;&nbsp;✓ Padres sanos con hijos afectados (portadores Aa × Aa → 25% aa)<br>&nbsp;&nbsp;✓ Afecta ambos sexos (aunque puede haber predominio masculino por azar)<br><br>• <strong>Refuta herencia ligada al X:</strong> Si fuera ligada al X:<br>&nbsp;&nbsp;× Padre afectado (X^r Y) tendría TODAS las hijas portadoras obligadas<br>&nbsp;&nbsp;× NO podría haber hijos varones afectados de padre afectado<br><br><strong>Concepto clave:</strong> 'Más hombres afectados' NO implica automáticamente herencia ligada al X; puede ser variación estadística en herencia autosómica."
            },
            {
                "id": "c",
                "text": "Explicar que en herencia ligada al X, los hombres afectados no pueden tener hijos varones afectados (solo transmiten el cromosoma Y), y solicitar que verifique si este patrón se cumple en la genealogía.",
                "isCorrect": false,
                "feedback": "❌ <strong>Respuesta incorrecta pedagógicamente.</strong><br><br><strong>Por qué es menos efectiva:</strong><br>• Proporciona la REGLA directamente (transmisión Y en hombres) sin que el estudiante la deduzca<br>• Aprendizaje pasivo: recibe la información en lugar de construirla mediante análisis comparativo<br>• Puede memorizar la regla sin comprender el mecanismo genético subyacente<br><br><strong>Mejor estrategia (opción B):</strong> Comparar con herencia autosómica recesiva permite al estudiante:<br>1. Identificar patrones que SÍ coinciden con el pedigrí<br>2. Descubrir por sí mismo que NO coincide con ligada al X<br>3. Desarrollar habilidad de análisis de pedigríes (competencia transferible)"
            },
            {
                "id": "d",
                "text": "Realizar un cuadro de Punnett simulando un cruzamiento de la generación I (I₁ y I₂) asumiendo herencia ligada al X, y comparar los resultados teóricos con los observados en la generación II.",
                "isCorrect": false,
                "feedback": "❌ <strong>Respuesta incorrecta.</strong><br><br><strong>Limitación técnica:</strong><br>• Para hacer el cuadro de Punnett, primero necesitamos SABER los genotipos de I₁ y I₂<br>• Si asumimos herencia ligada al X, tendríamos que deducir genotipos (I₁: X^R Y o X^r Y?, I₂: X^R X^R o X^R X^r?)<br>• Esta deducción requiere PRIMERO analizar el patrón completo del pedigrí (lo que la pregunta intenta enseñar)<br>• Problema circular: para verificar si es ligada al X mediante Punnett, ya necesitamos haber analizado el pedigrí<br><br><strong>Mejor enfoque (opción B):</strong> Comparar el patrón observado con patrones conocidos (autosómico vs ligado al X) es más directo y didáctico."
            }
        ],
        "image": "/evaluaciones/educacion-media/pruebas/paes-biologia-2023-imagenes/pregunta_3_img_1.png",
        "pedagogy": {
            "objective": "Analizar patrones de herencia en genealogías",
            "misconception": "Confundir 'más hombres afectados' con 'herencia ligada al X'",
            "level": "2° Medio",
            "strategy": "Comparación de patrones de herencia"
        }
    },
    
    # PREGUNTA 4: Genética - Codominancia con Punnett
    {
        "id": 4,
        "domain": "genetica",
        "difficulty": "medium",
        "stem": "Un profesor de 2° Medio está explicando el mecanismo de codominancia y un estudiante solicita un ejemplo concreto para comprender mejor el concepto.\n\n¿Cuál de los siguientes cruzamientos ilustra de manera más clara el fenómeno de codominancia?",
        "options": [
            {
                "id": "a",
                "text": "Cruzamiento de flores Boca de Dragón: Roja (RR) × Blanca (BB) → F1: 100% Rosadas (RB), donde ambos alelos se expresan parcialmente generando un fenotipo intermedio.",
                "isCorrect": false,
                "feedback": "❌ <strong>Respuesta incorrecta.</strong><br><br><strong>Error conceptual:</strong> Este ejemplo corresponde a <strong>DOMINANCIA INCOMPLETA</strong>, NO codominancia.<br><br><strong>Diferencia clave:</strong><br>• <strong>Dominancia incompleta:</strong> Los alelos se 'mezclan' → fenotipo INTERMEDIO (rosado)<br>• <strong>Codominancia:</strong> Ambos alelos se expresan COMPLETAMENTE y SIMULTÁNEAMENTE → fenotipo con AMBAS características visibles<br><br><strong>Analogía:</strong><br>• Dominancia incompleta = mezclar pintura roja + blanca = rosado (nuevo color)<br>• Codominancia = flores rojas Y blancas en la misma planta (ambos colores distinguibles)<br><br><strong>Ejemplo correcto de codominancia:</strong> Grupos sanguíneos AB (opción correcta usa este principio)."
            },
            {
                "id": "b",
                "text": "Cruzamiento de grupos sanguíneos: I^A I^A (tipo A) × I^B I^B (tipo B) → F1: 100% I^A I^B (tipo AB), donde ambos antígenos A y B se expresan simultáneamente en los glóbulos rojos.",
                "isCorrect": true,
                "feedback": "✅ <strong>Respuesta correcta.</strong><br><br><strong>Por qué es el mejor ejemplo de codominancia:</strong><br>• <strong>Expresión simultánea:</strong> En genotipo I^A I^B, AMBOS alelos producen sus antígenos:<br>&nbsp;&nbsp;- Alelo I^A → Antígeno A en membrana eritrocitaria<br>&nbsp;&nbsp;- Alelo I^B → Antígeno B en membrana eritrocitaria<br>• <strong>Fenotipo distinguible:</strong> Tipo AB ≠ 'mezcla' de A y B; es la presencia SIMULTÁNEA de ambos<br>• <strong>Nivel molecular:</strong> Cada alelo codifica una glicosiltransferasa funcional diferente<br><br><strong>Comparación con herencia 'normal':</strong><br>• Dominancia completa: Aa → fenotipo A (alelo a no se expresa)<br>• Codominancia: I^A I^B → fenotipo AB (ambos alelos se expresan)<br><br><strong>Aplicación clínica:</strong> Persona AB puede recibir sangre A, B, AB u O (receptor universal), pero solo puede donar a AB."
            },
            {
                "id": "c",
                "text": "Cruzamiento de arvejas: Semilla Lisa (RR) × Semilla Rugosa (rr) → F1: 100% Lisa (Rr), donde el alelo dominante R oculta completamente al recesivo r.",
                "isCorrect": false,
                "feedback": "❌ <strong>Respuesta incorrecta.</strong><br><br><strong>Error conceptual:</strong> Este ejemplo corresponde a <strong>DOMINANCIA COMPLETA</strong> (Leyes de Mendel), NO codominancia.<br><br><strong>Características de dominancia completa:</strong><br>• Genotipo Rr → Fenotipo LISO (solo se expresa el alelo R)<br>• El alelo recesivo r NO se expresa en heterocigosis<br>• Relación dominante-recesivo clásica<br><br><strong>Comparación con codominancia:</strong><br>• Dominancia completa (Rr): fenotipo = dominante (liso)<br>• Codominancia (I^A I^B): fenotipo = AMBOS expresados (AB)<br><br><strong>Si fuera codominancia en arvejas:</strong> El fenotipo Rr tendría características VISIBLES tanto de lisa como de rugosa simultáneamente (lo cual NO ocurre en la naturaleza para este carácter)."
            },
            {
                "id": "d",
                "text": "Cruzamiento de cobayos: Pelo Negro (NN) × Pelo Blanco (BB) → F1: 100% Pelo Negro (NB), demostrando que el alelo Negro es completamente dominante sobre Blanco.",
                "isCorrect": false,
                "feedback": "❌ <strong>Respuesta incorrecta.</strong><br><br><strong>Error conceptual:</strong> Este ejemplo corresponde a <strong>DOMINANCIA COMPLETA</strong>, NO codominancia.<br><br><strong>Análisis del cruzamiento:</strong><br>• Genotipo NB → Fenotipo NEGRO (100%)<br>• Esto indica que N es dominante sobre B<br>• El alelo B no se expresa en heterocigosis NB<br>• Patrón de dominancia/recesividad clásico<br><br><strong>Si fuera codominancia:</strong> El fenotipo NB debería mostrar AMBOS colores simultáneamente, como:<br>• Pelos negros Y blancos mezclados (mosaico)<br>• Patrón bicolor distinguible<br><br><strong>Ejemplo real de codominancia en color pelaje:</strong> Ganado vacuno Shorthorn (rojo × blanco → ruano, con pelos rojos y blancos mezclados visibles)."
            }
        ],
        "image": "/evaluaciones/educacion-media/pruebas/paes-biologia-2023-imagenes/pregunta_4_img_1.png",
        "pedagogy": {
            "objective": "Distinguir codominancia de otros patrones de herencia",
            "misconception": "Confundir codominancia con dominancia incompleta",
            "level": "2° Medio",
            "concept": "Codominancia: expresión simultánea de ambos alelos"
        }
    }
]

# Agregar nuevas preguntas al plan
plan['questions'].extend(nuevas_preguntas)

# Guardar plan actualizado
with open(r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\biologia-ecep-2025\plan.json", 'w', encoding='utf-8') as f:
    json.dump(plan, f, ensure_ascii=False, indent=2)

print(f"✅ Plan actualizado con {len(plan['questions'])} preguntas")
print(f"Pendientes: {52 - len(plan['questions'])} preguntas")
