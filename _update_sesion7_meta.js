require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8'));

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
    });
}

const db = admin.database();
const BASE = 'plataforma_estudiantes';

const sessionUpdate = {
    titulo: 'Clase 8 — Evidencia y Distractores',
    descripcion: 'Clase SIMCE — Evidencia y distractores. Experiencia guiada con 5 textos, organizador, taller de evidencia y 14 preguntas objetivas. Incluye 2 textos cuantitativos con suma, resta y porcentaje simple.',
    prefer_guia: true,
    link_guia: '/estudiantes/guia-s8-evidencia-distractores.html',
    contenido: {
        textos: [
            {
                id: 'texto-1',
                tipo: 'No literario',
                subtipo: 'Reportaje',
                titulo: 'Patio compartido',
                parrafos: [
                    { num: 1, texto: 'Reportaje sobre un liceo que reorganiza el recreo para reducir la dependencia del teléfono y recuperar la conversación, el juego y la observación del entorno.' }
                ],
                fuente: 'Resumen breve para sesión enlazada a guía.'
            },
            {
                id: 'texto-2',
                tipo: 'Literario',
                subtipo: 'Cuento',
                titulo: 'El taller pendiente',
                parrafos: [
                    { num: 1, texto: 'Cuento sobre Tomás, un estudiante que vuelve al taller de tecnología y descubre que el verdadero legado del profesor no era un objeto, sino un trabajo pendiente para hacer con otros.' }
                ],
                fuente: 'Resumen breve para sesión enlazada a guía.'
            },
            {
                id: 'texto-3',
                tipo: 'No literario',
                subtipo: 'Columna',
                titulo: 'Cuando el resumen ocupa el lugar de la lectura',
                parrafos: [
                    { num: 1, texto: 'Columna que cuestiona la cultura del resumen extremo y defiende la necesidad de sostener ideas complejas en vez de reducirlas a fórmulas rápidas.' }
                ],
                fuente: 'Resumen breve para sesión enlazada a guía.'
            },
            {
                id: 'texto-4',
                tipo: 'No literario',
                subtipo: 'Informe con tabla',
                titulo: 'Boletín de préstamos de biblioteca',
                parrafos: [
                    { num: 1, texto: 'Informe escolar con tabla semanal de préstamos por categoría. Exige sumar registros y calcular qué porcentaje representa una parte del total mensual o semanal.' }
                ],
                fuente: 'Resumen breve para sesión enlazada a guía.'
            },
            {
                id: 'texto-5',
                tipo: 'No literario',
                subtipo: 'Infografía con gráfico',
                titulo: 'Encuesta de movilidad para llegar al liceo',
                parrafos: [
                    { num: 1, texto: 'Infografía con gráfico de barras sobre cómo llegan 120 estudiantes al liceo. Exige comparar cantidades, restar y convertir una fracción simple en porcentaje.' }
                ],
                fuente: 'Resumen breve para sesión enlazada a guía.'
            }
        ],
        preguntas: [
            { id: 1, textoRef: 'texto-1', habilidad: 'LOCALIZAR', enunciado: 'Según el reportaje, ¿qué debían hacer los estudiantes durante el recreo largo?', opciones: [{ letra: 'A', texto: 'Entregar el teléfono al inicio de la jornada.' }, { letra: 'B', texto: 'Guardar el teléfono en bolsillos numerados a la entrada del patio.' }, { letra: 'C', texto: 'Dejarlo en la sala durante actividades deportivas.' }, { letra: 'D', texto: 'Apagarlo y mantenerlo en la mochila todo el recreo.' }], correcta: 'B' },
            { id: 2, textoRef: 'texto-1', habilidad: 'INTERPRETAR', enunciado: '¿Qué sugiere la frase “el conflicto se había mudado del pasillo al grupo de mensajería”?', opciones: [{ letra: 'A', texto: 'Que los conflictos ya no ocurrían en el liceo.' }, { letra: 'B', texto: 'Que las redes reemplazaron todo contacto presencial.' }, { letra: 'C', texto: 'Que los conflictos se iniciaban o intensificaban en mensajes digitales.' }, { letra: 'D', texto: 'Que los inspectores ya no podían vigilar los pasillos.' }], correcta: 'C' },
            { id: 3, textoRef: 'texto-1', habilidad: 'REFLEXIONAR', enunciado: '¿Cuál sintetiza mejor la idea central del reportaje?', opciones: [{ letra: 'A', texto: 'Los teléfonos explican por sí solos los conflictos escolares.' }, { letra: 'B', texto: 'El piloto funcionó porque castigó con firmeza.' }, { letra: 'C', texto: 'El recreo mejora cuando hay alternativas y sentido compartido para limitar el teléfono.' }, { letra: 'D', texto: 'La biblioteca hizo innecesaria cualquier otra medida.' }], correcta: 'C' },
            { id: 4, textoRef: 'texto-2', habilidad: 'INTERPRETAR', enunciado: '¿Qué se puede inferir sobre Tomás cuando vuelve al taller?', opciones: [{ letra: 'A', texto: 'Que solo quería quedarse con un recuerdo del profesor.' }, { letra: 'B', texto: 'Que comienza a ver el taller como un trabajo pendiente y no como un espacio muerto.' }, { letra: 'C', texto: 'Que esperaba encontrar un regalo escondido.' }, { letra: 'D', texto: 'Que sospechaba que la llave no servía para nada.' }], correcta: 'B' },
            { id: 5, textoRef: 'texto-2', habilidad: 'REFLEXIONAR', enunciado: '¿Qué representa mejor la llave en el cuento?', opciones: [{ letra: 'A', texto: 'Una entrada a una responsabilidad compartida que seguía abierta.' }, { letra: 'B', texto: 'Un premio simbólico por la cercanía con el profesor.' }, { letra: 'C', texto: 'La prueba de que el profesor desconfiaba de otros cursos.' }, { letra: 'D', texto: 'Un objeto sin función simbólica mayor.' }], correcta: 'A' },
            { id: 6, textoRef: 'texto-2', habilidad: 'INTERPRETAR', enunciado: '¿Por qué el hallazgo final no es sentimental ni grandilocuente?', opciones: [{ letra: 'A', texto: 'Porque el profesor había planeado un homenaje secreto.' }, { letra: 'B', texto: 'Porque lo importante es el trabajo pendiente con estudiantes y no una despedida solemne.' }, { letra: 'C', texto: 'Porque Tomás no siente nada especial al abrir el cajón.' }, { letra: 'D', texto: 'Porque la caja estaba vacía y no había ningún mensaje.' }], correcta: 'B' },
            { id: 7, textoRef: 'texto-3', habilidad: 'REFLEXIONAR', enunciado: '¿Cuál es el problema central que denuncia la columna?', opciones: [{ letra: 'A', texto: 'Que los resúmenes siempre son engañosos.' }, { letra: 'B', texto: 'Que convertir todo en cápsulas rápidas reduce la tolerancia a la complejidad.' }, { letra: 'C', texto: 'Que los docentes ya no quieren leer textos largos.' }, { letra: 'D', texto: 'Que las instituciones deberían prohibir los microvideos.' }], correcta: 'B' },
            { id: 8, textoRef: 'texto-3', habilidad: 'LOCALIZAR', enunciado: '¿Para qué sirvió el experimento con microvideos y lectura extendida?', opciones: [{ letra: 'A', texto: 'Para mostrar la diferencia entre sentir dominio del tema y comprenderlo de verdad.' }, { letra: 'B', texto: 'Para demostrar que siete páginas son mejores que cualquier video.' }, { letra: 'C', texto: 'Para probar que los estudiantes prefieren la lectura en papel.' }, { letra: 'D', texto: 'Para obligar a los docentes a abandonar recursos breves.' }], correcta: 'A' },
            { id: 9, textoRef: 'texto-3', habilidad: 'INTERPRETAR', enunciado: '¿Con qué idea estaría más de acuerdo el autor?', opciones: [{ letra: 'A', texto: 'El resumen puede servir para abrir, pero no para reemplazar el desarrollo completo de una idea.' }, { letra: 'B', texto: 'Las instituciones deberían evitar toda comunicación breve.' }, { letra: 'C', texto: 'La lentitud siempre es mejor que la rapidez.' }, { letra: 'D', texto: 'Comprender un tema depende solo del esfuerzo individual.' }], correcta: 'A' },
            { id: 10, textoRef: 'texto-3', habilidad: 'REFLEXIONAR', enunciado: '¿Qué propone la columna sobre el tiempo de la escuela?', opciones: [{ letra: 'A', texto: 'Que debe competir con la velocidad del scroll.' }, { letra: 'B', texto: 'Que puede ofrecer una experiencia distinta del tiempo para pensar mejor.' }, { letra: 'C', texto: 'Que debe reducir todos los textos a ideas clave.' }, { letra: 'D', texto: 'Que debería eliminar actividades introductorias breves.' }], correcta: 'B' },
            { id: 11, textoRef: 'texto-4', habilidad: 'CALCULAR', enunciado: 'Según la tabla, ¿cuántos préstamos se registraron en total durante la Semana 2?', opciones: [{ letra: 'A', texto: '48 préstamos.' }, { letra: 'B', texto: '50 préstamos.' }, { letra: 'C', texto: '52 préstamos.' }, { letra: 'D', texto: '54 préstamos.' }], correcta: 'C' },
            { id: 12, textoRef: 'texto-4', habilidad: 'CALCULAR', enunciado: 'En la Semana 4 hubo 60 préstamos en total. Si 24 fueron de cuentos, ¿qué porcentaje representan los cuentos esa semana?', opciones: [{ letra: 'A', texto: '24%' }, { letra: 'B', texto: '36%' }, { letra: 'C', texto: '40%' }, { letra: 'D', texto: '60%' }], correcta: 'C' },
            { id: 13, textoRef: 'texto-5', habilidad: 'CALCULAR', enunciado: 'Según el gráfico, ¿cuántos estudiantes más llegan caminando que en auto compartido?', opciones: [{ letra: 'A', texto: '24 estudiantes.' }, { letra: 'B', texto: '30 estudiantes.' }, { letra: 'C', texto: '36 estudiantes.' }, { letra: 'D', texto: '48 estudiantes.' }], correcta: 'C' },
            { id: 14, textoRef: 'texto-5', habilidad: 'CALCULAR', enunciado: 'Si 36 de los 120 estudiantes encuestados llegan en bus, ¿qué porcentaje del total representa ese grupo?', opciones: [{ letra: 'A', texto: '20%' }, { letra: 'B', texto: '25%' }, { letra: 'C', texto: '30%' }, { letra: 'D', texto: '36%' }], correcta: 'C' }
        ]
    }
};

async function main() {
    const sessionRef = db.ref(`/${BASE}/sesiones/sesion-7`);
    const beforeSnap = await sessionRef.once('value');
    if (!beforeSnap.exists()) {
        throw new Error('sesion-7 no existe en Firebase');
    }

    const before = beforeSnap.val() || {};
    await sessionRef.update(sessionUpdate);

    const afterSnap = await sessionRef.once('value');
    const after = afterSnap.val() || {};

    console.log(JSON.stringify({
        before: {
            titulo: before.titulo,
            textos: Array.isArray(before.contenido?.textos) ? before.contenido.textos.length : 0,
            preguntas: Array.isArray(before.contenido?.preguntas) ? before.contenido.preguntas.length : 0,
            activa: before.activa,
            resultados_visibles: before.resultados_visibles,
            asignados: before.asignados
        },
        after: {
            titulo: after.titulo,
            textos: Array.isArray(after.contenido?.textos) ? after.contenido.textos.length : 0,
            preguntas: Array.isArray(after.contenido?.preguntas) ? after.contenido.preguntas.length : 0,
            activa: after.activa,
            resultados_visibles: after.resultados_visibles,
            asignados: after.asignados
        }
    }, null, 2));
}

main().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
});