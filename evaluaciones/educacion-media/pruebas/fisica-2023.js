const quizData = [
    {
        id: 1,
        text: "Pregunta 1 - Modelos del Sistema Solar y notación científica",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q01.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "B",
        feedback: "La opción B es correcta porque establecer el radio de la Tierra como unidad de referencia permite a los estudiantes CREAR MODELOS comparativos (objetivo de aprendizaje), facilitando la comprensión de las escalas astronómicas mediante razones numéricas significativas."
    },
    {
        id: 2,
        text: "Pregunta 2 - Conservación de la cantidad de movimiento",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q02.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "D",
        feedback: "La opción D es correcta porque 'anticipar el resultado de una colisión' requiere APLICAR la ley de conservación del momentum, cumpliendo con el objetivo de aprendizaje. Las otras opciones son más pasivas (dar ejemplos) o miden variables sin aplicar la ley."
    },
    {
        id: 3,
        text: "Pregunta 3 - Naturaleza de la Ciencia y aceleración de gravedad",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q03.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "B",
        feedback: "La opción B es correcta porque el énfasis curricular 'Naturaleza de la Ciencia' se refiere a cómo se construye el conocimiento científico a lo largo de la historia. Explicar la evolución histórica del concepto de aceleración de gravedad responde directamente a este énfasis."
    },
    {
        id: 4,
        text: "Pregunta 4 - Relación ciencia, tecnología y sociedad",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q04.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "D",
        feedback: "La opción D es correcta porque reconoce que la ciencia es una actividad social con una cultura particular, lenguaje propio y prácticas que impactan en la sociedad. Esto se alinea con el énfasis CTS que examina cómo las creencias religiosas afectaron el desarrollo de ideas sobre el sistema solar."
    },
    {
        id: 5,
        text: "Pregunta 5 - Modelo ondulatorio de la luz",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q05.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "B",
        feedback: "La opción B es correcta porque una simulación digital que muestra los FRENTES DE ONDA es el recurso más adecuado para explicar el MODELO ONDULATORIO. Las opciones C y D usan rayos de luz, que corresponden al modelo corpuscular o geométrico, no al ondulatorio."
    },
    {
        id: 6,
        text: "Pregunta 6 - Tercera Ley de Newton y gravitación",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q06.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "D",
        feedback: "La opción D es correcta porque aplica la Tercera Ley de Newton (acción y reacción): la fuerza que la Tierra ejerce sobre la Luna es igual en magnitud y opuesta en dirección a la fuerza que la Luna ejerce sobre la Tierra. No es necesario recalcular."
    },
    {
        id: 7,
        text: "Pregunta 7 - Física aristotélica vs moderna",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q07.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "C",
        feedback: "La opción C es correcta porque preguntar si la explicación de Aristóteles responde a la EXPERIMENTACIÓN guía hacia las explicaciones actuales (Newton), que se basan en el método científico experimental, no en observaciones teleológicas."
    },
    {
        id: 8,
        text: "Pregunta 8 - Estaciones del año y distancia al Sol",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q08.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "La opción A es correcta porque presenta un contraejemplo lógico: si la distancia fuera la causa, ambos hemisferios tendrían verano en el perihelio e invierno en el afelio, lo cual contradice la observación de que las estaciones son opuestas en cada hemisferio."
    },
    {
        id: 9,
        text: "Pregunta 9 - Imágenes reales y virtuales en espejos",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q09.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "C",
        feedback: "La opción C es correcta porque explica de manera comprensible y con precisión conceptual la diferencia: las imágenes virtuales parecen estar detrás del espejo (no se pueden proyectar), mientras que las reales se forman delante y pueden proyectarse en una pantalla."
    },
    {
        id: 10,
        text: "Pregunta 10 - Ley de gravitación universal",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q10.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "C",
        feedback: "La opción C es correcta porque muestra la progresión desde una manzana cayendo hasta que orbite la Tierra (aumento de velocidad horizontal), ilustrando cómo la gravedad actúa igualmente sobre objetos pequeños y grandes, conectando la caída de la manzana con el movimiento orbital de la Luna."
    },
    {
        id: 11,
        text: "Pregunta 11 - Conceptos fundamentales de ondas",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q11.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "C",
        feedback: "La opción C es correcta porque 'vibración' y 'frecuencia' son los conceptos fundamentales que deben trabajarse primero. Una onda es una perturbación que se propaga, originada por vibraciones, y la frecuencia define cuántas vibraciones ocurren por unidad de tiempo."
    },
    {
        id: 12,
        text: "Pregunta 12 - Conocimientos previos para ecuación de Bernoulli",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q12.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "B",
        feedback: "La opción B es correcta porque la ecuación de Bernoulli se deriva del principio de conservación de la energía aplicado a fluidos. Es fundamental comprender este principio para entender por qué la presión disminuye cuando la velocidad del fluido aumenta."
    },
    {
        id: 13,
        text: "Pregunta 13 - Fases de la Luna y errores conceptuales",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q13.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "B",
        feedback: "La opción B es correcta. La representación muestra que los estudiantes confunden las fases lunares con eclipses, suponiendo que la Luna recibe parte de la sombra de la Tierra. Las fases se deben a la iluminación variable según la posición orbital de la Luna."
    },
    {
        id: 14,
        text: "Pregunta 14 - Segunda ley de Newton y tensión",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q14.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "D",
        feedback: "La opción D es correcta. Los estudiantes calculan T = mg (200 N) como si el sistema estuviera en equilibrio, pero el objeto tiene aceleración (a = 2 m/s²). Aplican el método de resolución de casos en equilibrio sin analizar que hay aceleración involucrada."
    },
    {
        id: 15,
        text: "Pregunta 15 - Indicadores de evaluación sobre el Universo",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q15.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "C",
        feedback: "La opción C es correcta porque 'comparar las virtudes y limitaciones de diferentes modelos del Universo' demuestra comprensión de que el conocimiento CAMBIA Y AUMENTA a partir de nuevas evidencias, que es exactamente lo que pide el objetivo de aprendizaje."
    },
    {
        id: 16,
        text: "Pregunta 16 - Evaluación formativa sobre efecto Doppler",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q16.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "C",
        feedback: "La opción C es correcta porque explicar 'cómo el movimiento relativo modifica la frecuencia con que llegan los frentes de onda' demuestra comprensión de las CAUSAS del efecto Doppler, no solo su descripción o identificación de ejemplos."
    },
    {
        id: 17,
        text: "Pregunta 17 - Evaluación de estaciones del año",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q17.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "C",
        feedback: "La opción C es correcta porque investigar la relación entre la duración del día y la inclinación del eje terrestre permite recoger evidencia sobre las CAUSAS FÍSICAS de las estaciones, que es la finalidad de la evaluación."
    },
    {
        id: 18,
        text: "Pregunta 18 - Retroalimentación sobre trabajo y energía",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q18.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "C",
        feedback: "La opción C es correcta porque explica claramente el teorema del trabajo-energía: el trabajo realizado por la fuerza neta es igual al cambio de energía cinética. El hermano mayor detiene el carro porque realiza trabajo negativo (fuerza opuesta al desplazamiento)."
    },
    {
        id: 19,
        text: "Pregunta 19 - Variables en Ley de Ohm",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q19.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "B",
        feedback: "La opción B es correcta. Para comprobar la ley de Ohm, se varía el voltaje (variable independiente) y se mide la corriente resultante (variable dependiente). Si R es constante, I será proporcional a V."
    },
    {
        id: 20,
        text: "Pregunta 20 - Diseño experimental aislamiento térmico",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q20.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "D",
        feedback: "La opción D es correcta porque es el único diseño que controla todas las variables (igual volumen, igual temperatura inicial) excepto el material aislante, permitiendo una comparación válida de la capacidad de aislamiento térmico de diferentes materiales."
    },
    {
        id: 21,
        text: "Pregunta 21 - Coeficientes de absorción acústica",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q21.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "B",
        feedback: "La opción B es correcta. Para REFLECTORES de sonido se necesita el material que menos absorba (menor coeficiente). El Material 2 tiene los coeficientes más bajos en el rango de frecuencias de la voz humana (250-3000 Hz), por lo que reflejará mejor el sonido."
    },
    {
        id: 22,
        text: "Pregunta 22 - Consumo de energía eléctrica",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q22.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "B",
        feedback: "La opción B es correcta. Reemplazar 60 lámparas de 50W por LEDs de 7W ahorra: 60 × (50-7)W × 8h = 20.64 kWh/día. Esta es la mayor reducción comparada con desconectar refrigeradores (12 kWh), reducir computadores (16 kWh) o modo eco en proyectores (8 kWh)."
    },
    {
        id: 23,
        text: "Pregunta 23 - Interpretación de datos CO₂ y temperatura",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q23.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "D",
        feedback: "La opción D es correcta porque solo establece una RELACIÓN entre las variables, sin afirmar causalidad. Los datos muestran correlación, pero no permiten determinar qué causa qué o si hay una causa común. Las opciones A, B y C implican relaciones causales no demostradas por los datos."
    },
    {
        id: 24,
        text: "Pregunta 24 - Mejora diseño experimental ondas",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q24.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "C",
        feedback: "La opción C es correcta porque medir varias veces y promediar reduce el error experimental en la medición de la longitud de onda. Los resultados diferentes en la tercera columna probablemente se deben a errores de medición que se minimizan con promedios."
    },
    {
        id: 25,
        text: "Pregunta 25 - Analogía estructural astronómica",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q25.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "La opción A es correcta. '85' es una estrella en la galaxia de Andrómeda, así como el Sol es una estrella en la Vía Láctea. La analogía es estrella-galaxia en ambos casos, manteniendo la misma relación estructural."
    },
    {
        id: 26,
        text: "Pregunta 26 - Fuente de energía del Sol",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q26.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "C",
        feedback: "La opción C es correcta. La fusión nuclear de hidrógeno para formar helio (proceso protón-protón) es la fuente principal de energía del Sol. No es fisión, y el producto principal es helio, no carbono."
    },
    {
        id: 27,
        text: "Pregunta 27 - Escala del sistema solar",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q27.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "C",
        feedback: "La opción C es correcta. El diámetro del Sol es aproximadamente 109 veces el de la Tierra. Si la Tierra tiene 2 cm, el Sol debería tener ~218 cm ≈ 2 metros. Una burbuja de 2 m de diámetro es la escala correcta."
    },
    {
        id: 28,
        text: "Pregunta 28 - Rotación retrógrada de Venus",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q28.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "B",
        feedback: "La opción B es correcta. Venus tiene rotación retrógrada: gira sobre su eje en sentido contrario (horario visto desde el polo norte) al de los demás planetas rocosos, que rotan en sentido antihorario."
    },
    {
        id: 29,
        text: "Pregunta 29 - Velocidad orbital en perihelio y afelio",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q29.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "C",
        feedback: "La opción C es correcta. Por conservación del momento angular, cuando la distancia es 3 veces mayor (afelio), la velocidad es menor que 1/3 de la velocidad en el perihelio. Por tanto vp > v > 3va."
    },
    {
        id: 30,
        text: "Pregunta 30 - Sismos en el Caribe y tectónica de placas",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q30.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "C",
        feedback: "La opción C es correcta. Los sismos forman una línea continua porque ocurren principalmente en los LÍMITES de la placa tectónica caribeña. Las fallas y fracturas en los bordes de placas son zonas de alta actividad sísmica."
    },
    {
        id: 31,
        text: "Pregunta 31 - Modelo de movimiento de placas tectónicas",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q31.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "B",
        feedback: "La opción B es correcta. El modelo aceptado actualmente es que el flujo convectivo del manto rocoso impulsa el movimiento de las placas. La convección del manto y la tectónica de placas son parte del mismo sistema dinámico."
    },
    {
        id: 32,
        text: "Pregunta 32 - Velocidades relativas (sistema de referencia)",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q32.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "B",
        feedback: "La opción B es correcta. Desde el observador externo, la pelotita A (lanzada con velocidad cero relativa al bus) se mueve a la velocidad V del bus. Las otras pelotitas tienen velocidades que dependen de V, pero |v'A| = V necesariamente."
    },
    {
        id: 33,
        text: "Pregunta 33 - Gráfico velocidad-tiempo caída libre",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q33.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "La opción A es correcta. En caída libre con aceleración constante g, la velocidad aumenta linealmente con el tiempo. El gráfico debe ser una línea recta con pendiente positiva, partiendo desde v=0."
    },
    {
        id: 34,
        text: "Pregunta 34 - Velocidad tangencial en disco giratorio",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q34.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "D",
        feedback: "La opción D es correcta. En un disco que gira con velocidad angular constante, la RAPIDEZ tangencial (magnitud) es constante, pero la VELOCIDAD tangencial (vector) cambia continuamente de dirección, por lo que es variable."
    },
    {
        id: 35,
        text: "Pregunta 35 - Movimiento circular uniforme de hermanos",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q35.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "B",
        feedback: "La opción B es correcta. En un cuerpo rígido que rota, todos los puntos tienen la MISMA velocidad angular (ω). La rapidez lineal (v = ωr) depende del radio, pero la rapidez angular es igual para todos los puntos."
    },
    {
        id: 36,
        text: "Pregunta 36 - Tensión en ascensor acelerado",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q36.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "La opción A es correcta. La masa del objeto no cambia (siempre es M). Cuando el ascensor acelera hacia arriba, la tensión aumenta: T' = M(g + a) > Mg = T. La tensión es mayor que cuando se movía con velocidad constante."
    },
    {
        id: 37,
        text: "Pregunta 37 - Rozamiento estático",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q37.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "B",
        feedback: "La opción B es correcta. La fuerza de rozamiento estático se ajusta para igualar la fuerza aplicada hasta un máximo. Si F = 15N y el bloque no se mueve, entonces la fuerza de roce estático es exactamente 15N (en sentido opuesto)."
    },
    {
        id: 38,
        text: "Pregunta 38 - Trabajo y fuerzas no conservativas",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q38.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "C",
        feedback: "La opción C es correcta. El trabajo del roce depende de la trayectoria (fuerza no conservativa). La trayectoria B es más larga que la A (diagonal vs recto), por lo que el trabajo del roce es mayor en B."
    },
    {
        id: 39,
        text: "Pregunta 39 - Potencia y eficiencia",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q39.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "D",
        feedback: "La opción D es correcta. La potencia útil es P = W/t = mgh/t. Si duplica la carga (2m) y la sube en el mismo tiempo, la potencia se duplica (2P). La eficiencia depende de la máquina, no cambia por duplicar la carga."
    },
    {
        id: 40,
        text: "Pregunta 40 - Transformación de energía en resorte",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q40.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "La opción A es correcta. En el punto de equilibrio, toda la energía potencial elástica se ha convertido en energía cinética (velocidad máxima). No hay energía potencial gravitacional ni elástica en ese punto."
    },
    {
        id: 41,
        text: "Pregunta 41 - Impulso y cantidad de movimiento",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q41.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "B",
        feedback: "La opción B es correcta. El impulso es el área bajo la curva F vs t. Para cambiar la cantidad de movimiento de 0 a mv, se requiere el mismo impulso. Una fuerza menor durante más tiempo puede lograr el mismo cambio."
    },
    {
        id: 42,
        text: "Pregunta 42 - Colisiones elásticas e inelásticas",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q42.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "D",
        feedback: "La opción D es correcta. En una colisión perfectamente inelástica, los cuerpos quedan unidos y se conserva el momentum pero no la energía cinética (parte se transforma en energía interna, deformación, sonido, etc.)."
    },
    {
        id: 43,
        text: "Pregunta 43 - Ondas estacionarias en cuerdas",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q43.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "C",
        feedback: "La opción C es correcta. La frecuencia fundamental depende de la longitud de la cuerda (L), la tensión (T) y la densidad lineal (μ). Para el segundo armónico, la frecuencia es el doble de la fundamental."
    },
    {
        id: 44,
        text: "Pregunta 44 - Sonido y medio de propagación",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q44.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "La opción A es correcta. La velocidad del sonido depende del medio (más rápido en sólidos que en gases). Al pasar de un medio a otro, la frecuencia se mantiene constante pero la velocidad y longitud de onda cambian."
    },
    {
        id: 45,
        text: "Pregunta 45 - Intensidad sonora y nivel de decibeles",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q45.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "B",
        feedback: "La opción B es correcta. La intensidad disminuye con el cuadrado de la distancia (ley del inverso cuadrado). Si la distancia se duplica, la intensidad se reduce a 1/4 del valor original."
    },
    {
        id: 46,
        text: "Pregunta 46 - Reflexión y refracción de la luz",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q46.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "B",
        feedback: "La opción B es correcta. Al pasar del agua al aire (menos denso), el ángulo de refracción es mayor que el de incidencia. Si el ángulo de incidencia supera el ángulo crítico, ocurre reflexión interna total."
    },
    {
        id: 47,
        text: "Pregunta 47 - Lentes convergentes y divergentes",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q47.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "C",
        feedback: "La opción C es correcta. Una lente convergente forma una imagen real e invertida cuando el objeto está más allá del foco. La imagen se forma del otro lado de la lente y puede proyectarse en una pantalla."
    },
    {
        id: 48,
        text: "Pregunta 48 - Circuitos eléctricos serie y paralelo",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q48.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "D",
        feedback: "La opción D es correcta. En un circuito en paralelo, el voltaje es el mismo en cada rama, pero la corriente se divide. Al agregar resistencias en paralelo, la resistencia total disminuye y la corriente total aumenta."
    },
    {
        id: 49,
        text: "Pregunta 49 - Potencia eléctrica",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q49.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "La opción A es correcta. La potencia eléctrica es P = V × I = I²R = V²/R. Si se duplica el voltaje y la resistencia es constante, la potencia se cuadruplica (P = V²/R)."
    },
    {
        id: 50,
        text: "Pregunta 50 - Efecto Joule y calentamiento",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q50.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "D",
        feedback: "La opción D es correcta. El efecto Joule ocurre porque los electrones colisionan con los átomos del conductor, transfiriendo energía cinética que se convierte en energía térmica (calor)."
    },
    {
        id: 51,
        text: "Pregunta 51 - Campo magnético de un solenoide",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q51.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "B",
        feedback: "La opción B es correcta. El campo magnético dentro de un solenoide es B = μ₀nI, donde n es el número de espiras por unidad de longitud. Aumentar n (más espiras) o I (corriente) aumenta el campo."
    },
    {
        id: 52,
        text: "Pregunta 52 - Fuerza sobre carga en campo magnético",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q52.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "C",
        feedback: "La opción C es correcta. La fuerza magnética sobre una carga móvil es F = qvBsenθ. La fuerza es máxima cuando v es perpendicular a B (θ = 90°) y cero cuando son paralelos."
    },
    {
        id: 53,
        text: "Pregunta 53 - Inducción electromagnética",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q53.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "B",
        feedback: "La opción B es correcta. Según la ley de Faraday, la fem inducida es proporcional a la tasa de cambio del flujo magnético. Mover el imán más rápido aumenta dΦ/dt y por tanto la fem inducida."
    },
    {
        id: 54,
        text: "Pregunta 54 - Dominios magnéticos y materiales",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q54.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "C",
        feedback: "La opción C es correcta. El material es ferromagnético porque los dominios magnéticos permanecen alineados después de retirar el campo magnético externo (figura 3), conservando la magnetización."
    },
    {
        id: 55,
        text: "Pregunta 55 - Aumentar campo en electroimán",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q55.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "La opción A es correcta. Aumentar el radio de la bobina NO aumenta el campo magnético. Para aumentarlo se debe: aumentar la corriente, aumentar el número de espiras, o reducir la longitud (aumentar n = N/L)."
    },
    {
        id: 56,
        text: "Pregunta 56 - Espectro electromagnético",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q56.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "B",
        feedback: "La opción B es correcta. El orden creciente de frecuencia es: ondas de radio < microondas < infrarrojo < visible < ultravioleta < rayos X < rayos gamma. La opción B (radio, microondas, rayos X) sigue este orden."
    },
    {
        id: 57,
        text: "Pregunta 57 - Temperatura en microprocesadores",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q57.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "D",
        feedback: "La opción D es correcta. El aumento de temperatura se debe al efecto Joule: los electrones colisionan con los átomos del material, transfiriendo energía cinética que se convierte en calor."
    },
    {
        id: 58,
        text: "Pregunta 58 - Átomos e iones",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q58.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "D",
        feedback: "La opción D es correcta. Cuando un átomo neutro se convierte en ion (gana o pierde electrones), cambia su carga neta, lo que modifica su interacción eléctrica con otros átomos. El núcleo no se ve afectado."
    },
    {
        id: 59,
        text: "Pregunta 59 - Refracción de luz monocromática",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q59.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "B",
        feedback: "La opción B es correcta. Al pasar del aire al agua, cambian: la rapidez de propagación (disminuye), la longitud de onda (disminuye) y la dirección (se refracta). La FRECUENCIA permanece constante."
    },
    {
        id: 60,
        text: "Pregunta 60 - Fisión nuclear y energía de enlace",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes-v2/fisica_2023_q60.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "La opción A es correcta. En la fisión, los núcleos medianos resultantes tienen MAYOR energía de enlace por nucleón que el núcleo pesado original, lo que los hace MÁS ESTABLES. La diferencia de energía se libera en el proceso."
    }
];

let currentQuestion = 0;
let score = 0;
let answers = new Array(quizData.length).fill(null);
let showingFeedback = false;

function loadQuestion(index) {
    const q = quizData[index];
    document.getElementById('question-number').textContent = `Pregunta ${index + 1} de ${quizData.length}`;
    
    // Mostrar imagen de la pregunta
    document.getElementById('question-text').innerHTML = `
        <img src="${q.image}" alt="Pregunta ${q.id}" class="max-w-full mx-auto rounded-lg shadow-lg mb-4" style="max-height: 600px;">
    `;
    
    // Mostrar botones A, B, C, D
    const optionsHtml = q.options.map(opt => `
        <button onclick="selectAnswer('${opt.id}')" 
                id="opt-${opt.id}"
                class="w-full p-4 text-left rounded-lg border-2 transition-all duration-200
                       ${answers[index] === opt.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'}
                       ${showingFeedback && opt.id === q.correct ? 'border-green-500 bg-green-50' : ''}
                       ${showingFeedback && answers[index] === opt.id && opt.id !== q.correct ? 'border-red-500 bg-red-50' : ''}">
            <span class="font-bold text-lg">${opt.id}</span>
        </button>
    `).join('');
    document.getElementById('options-container').innerHTML = optionsHtml;
    
    // Feedback
    const feedbackEl = document.getElementById('feedback');
    if (showingFeedback && answers[index] !== null) {
        const isCorrect = answers[index] === q.correct;
        feedbackEl.className = `mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`;
        feedbackEl.innerHTML = `
            <p class="font-bold">${isCorrect ? '✅ ¡Correcto!' : `❌ Incorrecto. La respuesta correcta es ${q.correct}.`}</p>
            <p class="mt-2">${q.feedback}</p>
        `;
        feedbackEl.classList.remove('hidden');
    } else {
        feedbackEl.classList.add('hidden');
    }
    
    updateNav();
    updateButtons();
}

function selectAnswer(optionId) {
    if (showingFeedback) return;
    
    answers[currentQuestion] = optionId;
    const q = quizData[currentQuestion];
    
    if (optionId === q.correct) {
        score++;
    }
    
    showingFeedback = true;
    loadQuestion(currentQuestion);
    
    document.getElementById('score').textContent = score;
}

function nextQuestion() {
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        showingFeedback = answers[currentQuestion] !== null;
        loadQuestion(currentQuestion);
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showingFeedback = answers[currentQuestion] !== null;
        loadQuestion(currentQuestion);
    }
}

function goToQuestion(index) {
    currentQuestion = index;
    showingFeedback = answers[currentQuestion] !== null;
    loadQuestion(currentQuestion);
}

function updateNav() {
    const nav = document.getElementById('question-nav');
    nav.innerHTML = quizData.map((_, i) => {
        let bgClass = 'bg-gray-200 hover:bg-gray-300';
        if (answers[i] !== null) {
            bgClass = answers[i] === quizData[i].correct ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
        }
        if (i === currentQuestion) {
            bgClass += ' ring-2 ring-purple-500 ring-offset-2';
        }
        return `<button onclick="goToQuestion(${i})" 
                        class="w-9 h-9 rounded-full ${bgClass} text-sm font-medium flex items-center justify-center transition-all">
                    ${i + 1}
                </button>`;
    }).join('');
    
    // Auto-scroll to current question
    const buttons = nav.querySelectorAll('button');
    if (buttons[currentQuestion]) {
        buttons[currentQuestion].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

function updateButtons() {
    document.getElementById('prev-btn').disabled = currentQuestion === 0;
    document.getElementById('next-btn').disabled = currentQuestion === quizData.length - 1;
    
    document.getElementById('prev-btn').className = `px-6 py-2 rounded-lg font-medium transition-all ${
        currentQuestion === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-purple-500 text-white hover:bg-purple-600'
    }`;
    document.getElementById('next-btn').className = `px-6 py-2 rounded-lg font-medium transition-all ${
        currentQuestion === quizData.length - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-purple-500 text-white hover:bg-purple-600'
    }`;
}

function finishQuiz() {
    const percentage = Math.round((score / quizData.length) * 100);
    let message = '';
    let colorClass = '';
    
    if (percentage >= 80) {
        message = '¡Excelente! Tienes un gran dominio de la física.';
        colorClass = 'text-green-600';
    } else if (percentage >= 60) {
        message = 'Buen trabajo. Sigue practicando para mejorar.';
        colorClass = 'text-purple-600';
    } else if (percentage >= 40) {
        message = 'Necesitas repasar algunos temas de física.';
        colorClass = 'text-yellow-600';
    } else {
        message = 'Te recomendamos estudiar más los contenidos de física.';
        colorClass = 'text-red-600';
    }
    
    document.getElementById('quiz-container').innerHTML = `
        <div class="text-center py-12">
            <h2 class="text-3xl font-bold mb-4">¡Prueba Completada!</h2>
            <div class="text-6xl font-bold ${colorClass} mb-4">${percentage}%</div>
            <p class="text-xl mb-2">Obtuviste ${score} de ${quizData.length} respuestas correctas</p>
            <p class="text-lg text-gray-600 mb-8">${message}</p>
            <div class="flex justify-center gap-4">
                <a href="/evaluaciones/educacion-media/" 
                   class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all">
                    Volver a Educación Media
                </a>
                <button onclick="location.reload()" 
                        class="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all">
                    Reintentar
                </button>
            </div>
        </div>
    `;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadQuestion(0);
});
