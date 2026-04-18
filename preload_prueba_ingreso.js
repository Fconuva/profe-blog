// Preload the Prueba de Ingreso session into Firebase
// (Equivalent to clicking "Precargar Prueba de Ingreso" in adminprofe)
require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

const sa = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8'));
if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(sa), databaseURL: process.env.FIREBASE_DATABASE_URL });

const db = admin.database();
const BASE = 'plataforma_estudiantes';

async function main() {
    const sesData = {
        titulo: 'Prueba de Ingreso — Diagnóstico de Comprensión Lectora',
        descripcion: 'Evaluación diagnóstica inicial para determinar tu nivel de comprensión lectora. 3 textos · 10 preguntas de Localizar, Interpretar y Reflexionar.',
        orden: 0, activa: true, resultados_visibles: false, video_youtube: null,
        programa: 'simce',
        createdAt: Date.now(),
        contenido: {
            textos: [
                { id: 'texto-1', tipo: 'literario', subtipo: 'Microcuento', titulo: 'El regalo',
                  parrafos: [
                    { num: 1, texto: 'La mañana del cumpleaños de Sofía, su madre dejó sobre la mesa de la cocina una caja envuelta en papel de diario. No tenían dinero para papel de regalo, pero la mujer había dibujado pequeñas estrellas con un plumón dorado sobre cada página, transformando las noticias viejas en algo que parecía un cielo nocturno.' },
                    { num: 2, texto: 'Sofía, que acababa de cumplir once años, abrió la caja con cuidado, como si temiera que el contenido pudiera escapar. Adentro encontró un cuaderno de tapas duras, con hojas gruesas color crema. En la primera página, su madre había escrito con letra redonda y firme: "Para que guardes todas las historias que llevas dentro. Con amor, mamá".' },
                    { num: 3, texto: 'La niña pasó los dedos por las hojas en blanco y sintió una emoción difícil de explicar. No era exactamente alegría, sino algo más hondo, como descubrir una habitación secreta en una casa que creías conocer por completo.' },
                    { num: 4, texto: 'Esa misma tarde, Sofía escribió su primera historia. Trataba de una niña que recibía un cuaderno mágico: cada vez que escribía algo en él, las palabras cobraban vida al caer la noche. Cuando su madre le preguntó de qué trataba, Sofía la miró y respondió: "De nosotras, mamá. Trata de nosotras".' }
                  ], fuente: 'Texto original para fines diagnósticos — Plataforma Estudiantes (2026).' },
                { id: 'texto-2', tipo: 'no-literario', subtipo: 'Artículo Informativo', titulo: 'La importancia de leer en voz alta',
                  parrafos: [
                    { num: 1, texto: 'Un estudio de la Universidad de Waterloo, publicado en 2020, demostró que las personas retienen un 15% más de información cuando leen un texto en voz alta en comparación con la lectura silenciosa. Los investigadores denominaron este fenómeno "efecto de producción": al articular las palabras, el cerebro crea una doble codificación —visual y auditiva— que fortalece el recuerdo.' },
                    { num: 2, texto: 'La práctica de la lectura en voz alta tiene además beneficios comprobados en el desarrollo del vocabulario y la comprensión de estructuras gramaticales complejas. Según la fonoaudióloga chilena Marcela Orrego, "leer en voz alta obliga al cerebro a procesar la puntuación, las pausas y la entonación, lo que mejora significativamente la comprensión de textos extensos". Esto resulta especialmente relevante para estudiantes de enseñanza media que enfrentan evaluaciones estandarizadas como el SIMCE o la PAES.' },
                    { num: 3, texto: 'A pesar de estos beneficios, la lectura en voz alta es una práctica que disminuye drásticamente a medida que los niños crecen. En promedio, los padres chilenos dejan de leer en voz alta a sus hijos a los siete años, justo cuando ingresan a la educación básica. "Es una paradoja", señala la investigadora. "Abandonamos la herramienta precisamente cuando más la necesitan, porque las exigencias de comprensión aumentan año a año".' },
                    { num: 4, texto: 'En países como Finlandia y Japón, la lectura en voz alta se mantiene como parte del currículo hasta la enseñanza secundaria. En Finlandia, los estudiantes dedican al menos 20 minutos semanales a la lectura compartida en voz alta, y su rendimiento en las pruebas PISA de comprensión lectora se ubica consistentemente entre los cinco mejores del mundo.' }
                  ], fuente: 'Adaptación de estudios sobre lectura y cognición, Universidad de Waterloo y OECD (2024). Para fines educativos.' },
                { id: 'texto-3', tipo: 'no-literario', subtipo: 'Afiche Informativo', titulo: 'Campaña escolar: "Apaga el celular, enciende tu mente"',
                  parrafos: [
                    { num: 1, texto: 'CENTRO EDUCATIVO SALESIANOS TALCA — CAMPAÑA DE CONVIVENCIA DIGITAL 2026. "Apaga el celular, enciende tu mente". Durante las horas de clase, tu teléfono debe permanecer en tu mochila apagado o en silencio. Esta medida busca proteger tu concentración, mejorar la convivencia y respetar el espacio de aprendizaje de todos.' },
                    { num: 2, texto: '¿Por qué esta campaña? Según datos internos del Departamento de Convivencia Escolar, en 2025 se registraron 134 incidentes de distracción por uso de celular en clases, un 45% más que el año anterior. Además, el 62% de los estudiantes encuestados reconoció que el celular les dificulta concentrarse durante las explicaciones del profesor.' },
                    { num: 3, texto: '¿Qué pasa si no cumplo? Primera vez: el profesor te pedirá guardar el celular. Segunda vez: el celular será retirado y devuelto al final de la jornada. Tercera vez: se citará al apoderado y el celular será entregado solo a un adulto responsable.' },
                    { num: 4, texto: 'Espacios libres para usar tu celular: recreos, hora de almuerzo y después de la jornada escolar. Recuerda: tu celular es una herramienta. Tú decides si te ayuda o te distrae. #EnciendetTuMente #ConvivenciaDigital' }
                  ], fuente: 'Afiche informativo ficticio basado en políticas reales de convivencia escolar (2026).' }
            ],
            preguntas: [
                { id: 1, textoRef: 'texto-1', habilidad: 'LOCALIZAR', enunciado: '¿Qué encontró Sofía dentro de la caja que le dejó su madre?', opciones: [
                    { letra: 'A', texto: 'Un libro de cuentos infantiles con ilustraciones hechas a mano por su madre.' },
                    { letra: 'B', texto: 'Un cuaderno de tapas duras con hojas gruesas color crema y una dedicatoria.' },
                    { letra: 'C', texto: 'Un diario personal que su madre había escrito durante toda su infancia.' },
                    { letra: 'D', texto: 'Un set de plumones dorados para que pudiera dibujar estrellas como su madre.' }
                ], correcta: 'B' },
                { id: 2, textoRef: 'texto-1', habilidad: 'INTERPRETAR', enunciado: 'El texto dice que Sofía sintió algo "como descubrir una habitación secreta en una casa que creías conocer por completo". ¿Qué sugiere esta comparación?', opciones: [
                    { letra: 'A', texto: 'Que Sofía no conocía bien su propia casa y el regalo le recordó ese desconocimiento.' },
                    { letra: 'B', texto: 'Que la emoción que sintió era confusa y no podía entender por qué le gustaba el regalo.' },
                    { letra: 'C', texto: 'Que su madre le había ocultado el regalo en una habitación que Sofía nunca había visitado.' },
                    { letra: 'D', texto: 'Que el cuaderno le reveló una capacidad o un mundo interior que no sabía que tenía.' }
                ], correcta: 'D' },
                { id: 3, textoRef: 'texto-1', habilidad: 'INTERPRETAR', enunciado: 'Cuando Sofía dice que su historia "trata de nosotras", se puede inferir que:', opciones: [
                    { letra: 'A', texto: 'Sofía copió una historia que su madre le había contado antes de dormir.' },
                    { letra: 'B', texto: 'La niña inventó una historia completamente ajena a su propia experiencia personal.' },
                    { letra: 'C', texto: 'El regalo de su madre inspiró una historia que refleja el vínculo entre ambas.' },
                    { letra: 'D', texto: 'Sofía escribió una autobiografía detallada de su vida junto a su madre.' }
                ], correcta: 'C' },
                { id: 4, textoRef: 'texto-1', habilidad: 'REFLEXIONAR', enunciado: '¿Cuál es el propósito comunicativo principal de este texto?', opciones: [
                    { letra: 'A', texto: 'Narrar una experiencia que muestra cómo un gesto sencillo puede despertar la creatividad.' },
                    { letra: 'B', texto: 'Informar sobre los beneficios de regalar cuadernos a los niños para estimular la escritura.' },
                    { letra: 'C', texto: 'Argumentar que los regalos hechos a mano son mejores que los comprados en tiendas.' },
                    { letra: 'D', texto: 'Describir con detalle las características físicas de un cuaderno de tapas duras.' }
                ], correcta: 'A' },
                { id: 5, textoRef: 'texto-2', habilidad: 'LOCALIZAR', enunciado: 'Según el estudio de la Universidad de Waterloo, ¿cuánta más información retienen las personas al leer en voz alta?', opciones: [
                    { letra: 'A', texto: 'Un 15% más en comparación con la lectura silenciosa, gracias a la doble codificación.' },
                    { letra: 'B', texto: 'Un 20% más, según los resultados publicados por investigadores finlandeses en 2020.' },
                    { letra: 'C', texto: 'El doble de información, especialmente en textos con vocabulario técnico complejo.' },
                    { letra: 'D', texto: 'No se menciona un porcentaje específico, solo que la diferencia es significativa.' }
                ], correcta: 'A' },
                { id: 6, textoRef: 'texto-2', habilidad: 'LOCALIZAR', enunciado: '¿A qué edad promedio los padres chilenos dejan de leer en voz alta a sus hijos?', opciones: [
                    { letra: 'A', texto: 'A los once años, cuando ingresan a la enseñanza media y las exigencias aumentan.' },
                    { letra: 'B', texto: 'No existe un dato específico sobre la edad en que se abandona esta práctica.' },
                    { letra: 'C', texto: 'A los siete años, justo cuando ingresan a la educación básica.' },
                    { letra: 'D', texto: 'A los cinco años, antes de que aprendan a leer por sí mismos en el colegio.' }
                ], correcta: 'C' },
                { id: 7, textoRef: 'texto-2', habilidad: 'INTERPRETAR', enunciado: 'La fonoaudióloga califica la situación de la lectura en voz alta como "una paradoja". ¿A qué se refiere con esa expresión?', opciones: [
                    { letra: 'A', texto: 'A que los padres creen que leer en voz alta es perjudicial, cuando en realidad es beneficioso.' },
                    { letra: 'B', texto: 'A que los estudiantes finlandeses leen mejor que los chilenos a pesar de estudiar menos horas.' },
                    { letra: 'C', texto: 'A que leer en voz alta y en silencio producen exactamente los mismos resultados cognitivos.' },
                    { letra: 'D', texto: 'A que se abandona la lectura en voz alta justo cuando los niños más la necesitan.' }
                ], correcta: 'D' },
                { id: 8, textoRef: 'texto-2', habilidad: 'REFLEXIONAR', enunciado: 'El autor menciona el caso de Finlandia al final del texto. ¿Cuál es la función de ese ejemplo en la argumentación?', opciones: [
                    { letra: 'A', texto: 'Demostrar que la lectura en voz alta es una práctica exclusiva de los países nórdicos.' },
                    { letra: 'B', texto: 'Respaldar la idea de que mantener esta práctica en secundaria se asocia con mejores resultados.' },
                    { letra: 'C', texto: 'Criticar el sistema educativo chileno por no copiar el modelo finlandés de forma exacta.' },
                    { letra: 'D', texto: 'Mostrar que las pruebas PISA miden competencias diferentes a las del SIMCE en Chile.' }
                ], correcta: 'B' },
                { id: 9, textoRef: 'texto-3', habilidad: 'LOCALIZAR', enunciado: 'Según los datos del Departamento de Convivencia Escolar, ¿cuántos incidentes de distracción por celular se registraron en 2025?', opciones: [
                    { letra: 'A', texto: 'Más de 200 incidentes graves que motivaron la expulsión de varios estudiantes.' },
                    { letra: 'B', texto: 'No se entrega un número exacto, solo se menciona que aumentaron significativamente.' },
                    { letra: 'C', texto: 'Un total de 134 incidentes, cifra que representa un 45% más que el año anterior.' },
                    { letra: 'D', texto: 'El 62% de todos los incidentes disciplinarios del establecimiento durante el año.' }
                ], correcta: 'C' },
                { id: 10, textoRef: 'texto-3', habilidad: 'REFLEXIONAR', enunciado: '¿Cuál es el propósito comunicativo principal de este afiche?', opciones: [
                    { letra: 'A', texto: 'Prohibir completamente el uso de celulares dentro del establecimiento educativo durante todo el día.' },
                    { letra: 'B', texto: 'Informar a los estudiantes sobre las normas de uso del celular y persuadirlos de cumplirlas.' },
                    { letra: 'C', texto: 'Convencer a los apoderados de que no les compren celulares a sus hijos adolescentes.' },
                    { letra: 'D', texto: 'Narrar una experiencia personal de un estudiante que mejoró sus notas al dejar el celular.' }
                ], correcta: 'B' }
            ]
        }
    };

    console.log('Precargando sesión prueba-ingreso...');
    await db.ref(BASE + '/sesiones/prueba-ingreso').set(sesData);
    console.log('✅ Prueba de Ingreso precargada con 3 textos y 10 preguntas');
    process.exit(0);
}

main().catch(e => { console.error('Error:', e); process.exit(1); });
