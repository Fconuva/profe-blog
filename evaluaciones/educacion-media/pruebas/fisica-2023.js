const quizData = [
    {
        id: 1,
        text: "Pregunta 1 - Modelos del Sistema Solar",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p1_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 2,
        text: "Pregunta 2 - Conservación del Momentum",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p2_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 3,
        text: "Pregunta 3 - Concepción de Ciencia",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p3_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "D",
        feedback: "La ciencia es una actividad social que implica una cultura particular, caracterizada por un lenguaje y un conjunto de prácticas e intereses que impactan en la sociedad."
    },
    {
        id: 4,
        text: "Pregunta 4 - Modelo Ondulatorio de la Luz",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p4_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "B",
        feedback: "Una simulación digital que muestra en detalle el efecto sobre los frentes de onda es el recurso más adecuado para explicar el modelo ondulatorio."
    },
    {
        id: 5,
        text: "Pregunta 5 - Ley de Gravitación Universal",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p5_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "D",
        feedback: "La atracción gravitacional consiste en una acción recíproca (Tercera Ley de Newton), ambos objetos ejercen uno al otro una fuerza de igual magnitud en sentidos opuestos."
    },
    {
        id: 6,
        text: "Pregunta 6 - Movimiento Aristotélico vs Newton",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p6_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "C",
        feedback: "La pregunta sobre experimentación guía hacia las explicaciones actuales basadas en el método científico."
    },
    {
        id: 7,
        text: "Pregunta 7 - Estaciones del Año y Distancia al Sol",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p7_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Si la distancia al Sol fuese la causa, en ambos hemisferios sería verano en el perihelio, lo cual contradice la observación."
    },
    {
        id: 8,
        text: "Pregunta 8 - Física del Movimiento",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p8_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 9,
        text: "Pregunta 9 - Cinemática y Dinámica",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p9_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 10,
        text: "Pregunta 10 - Leyes de Newton",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p10_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 11,
        text: "Pregunta 11 - Energía y Trabajo",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p11_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 12,
        text: "Pregunta 12 - Conservación de la Energía",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p12_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 13,
        text: "Pregunta 13 - Ondas Mecánicas",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p13_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 14,
        text: "Pregunta 14 - Propiedades de las Ondas",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p14_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 15,
        text: "Pregunta 15 - Sonido y Acústica",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p15_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 16,
        text: "Pregunta 16 - Luz y Óptica",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p16_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 17,
        text: "Pregunta 17 - Reflexión y Refracción",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p17_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 18,
        text: "Pregunta 18 - Electrostática",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p18_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 19,
        text: "Pregunta 19 - Circuitos Eléctricos",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p19_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 20,
        text: "Pregunta 20 - Ley de Ohm",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p20_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 21,
        text: "Pregunta 21 - Magnetismo",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p21_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 22,
        text: "Pregunta 22 - Electromagnetismo",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p22_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 23,
        text: "Pregunta 23 - Inducción Electromagnética",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p23_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 24,
        text: "Pregunta 24 - Termodinámica",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p24_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 25,
        text: "Pregunta 25 - Calor y Temperatura",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p25_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 26,
        text: "Pregunta 26 - Transferencia de Calor",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p26_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 27,
        text: "Pregunta 27 - Leyes de la Termodinámica",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p27_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 28,
        text: "Pregunta 28 - Fluidos",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p28_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 29,
        text: "Pregunta 29 - Presión y Densidad",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p29_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 30,
        text: "Pregunta 30 - Principio de Arquímedes",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p30_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 31,
        text: "Pregunta 31 - Física Moderna",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p31_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 32,
        text: "Pregunta 32 - Relatividad",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p32_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 33,
        text: "Pregunta 33 - Física Cuántica",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p33_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 34,
        text: "Pregunta 34 - Modelo Atómico",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p34_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 35,
        text: "Pregunta 35 - Espectro Electromagnético",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p35_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 36,
        text: "Pregunta 36 - Radiación",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p36_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 37,
        text: "Pregunta 37 - Temperatura y Microprocesadores",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p37_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "D",
        feedback: "El aumento de colisiones entre electrones y átomos en los microprocesadores explica el alza de temperatura (efecto Joule)."
    },
    {
        id: 38,
        text: "Pregunta 38 - Dominios Magnéticos",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p38_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "C",
        feedback: "Los materiales ferromagnéticos mantienen la magnetización después de interactuar con un imán (dominios permanentemente alineados)."
    },
    {
        id: 39,
        text: "Pregunta 39 - Electroimán",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p39_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    },
    {
        id: 40,
        text: "Pregunta 40 - Física Nuclear",
        image: "/evaluaciones/educacion-media/pruebas/fisica-2023-imagenes/fisica_2023_p40_1.png",
        options: [
            { id: "A", text: "Opción A" },
            { id: "B", text: "Opción B" },
            { id: "C", text: "Opción C" },
            { id: "D", text: "Opción D" }
        ],
        correct: "A",
        feedback: "Revisa la imagen para ver la explicación completa de la pregunta y las opciones."
    }
];

let currentQuestion = 0;
let score = 0;
let answers = new Array(quizData.length).fill(null);
let showingFeedback = false;

function loadQuestion(index) {
    const q = quizData[index];
    document.getElementById('question-number').textContent = `Pregunta ${index + 1} de ${quizData.length}`;
    
    // Si tiene imagen, mostrar solo la imagen (la pregunta está en la imagen)
    if (q.image) {
        document.getElementById('question-text').innerHTML = `
            <img src="${q.image}" alt="Pregunta ${q.id}" class="max-w-full mx-auto rounded-lg shadow-lg mb-4" style="max-height: 600px;">
        `;
        
        // Mostrar solo botones A, B, C, D
        const optionsHtml = q.options.map(opt => `
            <button onclick="selectAnswer('${opt.id}')" 
                    id="opt-${opt.id}"
                    class="w-full p-4 text-left rounded-lg border-2 transition-all duration-200
                           ${answers[index] === opt.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}
                           ${showingFeedback && opt.id === q.correct ? 'border-green-500 bg-green-50' : ''}
                           ${showingFeedback && answers[index] === opt.id && opt.id !== q.correct ? 'border-red-500 bg-red-50' : ''}">
                <span class="font-bold text-lg">${opt.id}</span>
            </button>
        `).join('');
        document.getElementById('options-container').innerHTML = optionsHtml;
    } else {
        // Sin imagen, mostrar texto completo
        document.getElementById('question-text').innerHTML = `<p class="text-lg text-gray-700">${q.text}</p>`;
        
        const optionsHtml = q.options.map(opt => `
            <button onclick="selectAnswer('${opt.id}')" 
                    id="opt-${opt.id}"
                    class="w-full p-4 text-left rounded-lg border-2 transition-all duration-200
                           ${answers[index] === opt.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}
                           ${showingFeedback && opt.id === q.correct ? 'border-green-500 bg-green-50' : ''}
                           ${showingFeedback && answers[index] === opt.id && opt.id !== q.correct ? 'border-red-500 bg-red-50' : ''}">
                <span class="font-bold">${opt.id}.</span> ${opt.text}
            </button>
        `).join('');
        document.getElementById('options-container').innerHTML = optionsHtml;
    }
    
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
            bgClass += ' ring-2 ring-blue-500 ring-offset-2';
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
        currentQuestion === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
    }`;
    document.getElementById('next-btn').className = `px-6 py-2 rounded-lg font-medium transition-all ${
        currentQuestion === quizData.length - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
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
        colorClass = 'text-blue-600';
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
                <a href="/evaluaciones/educacion-media/pruebas/" 
                   class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all">
                    Volver a Pruebas
                </a>
                <button onclick="location.reload()" 
                        class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
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
