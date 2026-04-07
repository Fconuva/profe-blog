// api/preload-sesion3.js — Force preload sesion-3 data via serverless function
const admin = require('firebase-admin');

let initError = null;
try {
    if (!admin.apps.length) {
        const pk = process.env.FIREBASE_PRIVATE_KEY || '';
        if (!pk) {
            initError = 'FIREBASE_PRIVATE_KEY no configurada';
        } else {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: pk.replace(/\\n/g, '\n')
                }),
                databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://profe-blog-default-rtdb.firebaseio.com'
            });
        }
    }
} catch (e) { initError = e.message; }

const BASE = 'plataforma_estudiantes';
function getDb() { return admin.database(); }

module.exports = async (req, res) => {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.status(204).end();
    }
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
    if (initError) return res.status(500).json({ error: initError });

    // Verify Firebase admin auth
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Token requerido' });
    try {
        const decoded = await admin.auth().verifyIdToken(token);
        const snap = await getDb().ref(`${BASE}/admins/${decoded.uid}`).once('value');
        if (!snap.val()) return res.status(403).json({ error: 'No autorizado' });
    } catch (e) {
        return res.status(403).json({ error: 'Token inválido' });
    }

    const sesData = {
        titulo: 'Sesión 3: El Cuento — "La cicatriz" (S5)',
        descripcion: 'Clase S5 SIMCE — El Cuento. Lee "La cicatriz" y responde 11 preguntas: 5 sobre elementos narrativos (figura literaria, vocabulario, conflicto, simbolismo, perspectiva temporal) y 6 de práctica SIMCE (Localizar, Interpretar, Reflexionar).',
        orden: 3, activa: true, resultados_visibles: false, video_youtube: null, programa: 'simce', tecnicas: false,
        link_guia: '/estudiantes/guia-s5-cuento.html',
        createdAt: Date.now(),
        contenido: {
            textos: [
                {
                    id: 'texto-1', tipo: 'Literario', subtipo: 'Cuento', titulo: 'La cicatriz',
                    parrafos: [
                        { num: 1, texto: 'Cada vez que mi abuela levantaba las manos para amasar el pan, yo no podía dejar de mirar la cicatriz que cruzaba su muñeca izquierda, delgada y plateada como un río dibujado sobre un mapa antiguo.' },
                        { num: 2, texto: '—Abuela, ¿cómo te hiciste eso? —le pregunté una tarde de invierno, mientras el olor a masa cruda llenaba la cocina.' },
                        { num: 3, texto: 'Ella sonrió sin mirarme, hundiendo los nudillos en la masa con una fuerza que desmentía sus setenta y tres años.' },
                        { num: 4, texto: '—Fue por una promesa —respondió.' },
                        { num: 5, texto: 'Yo tenía doce años y las promesas me parecían cosas de películas. Me senté en el banco de madera y esperé, porque había aprendido que mi abuela contaba las historias a su propio ritmo, como quien desenrolla un ovillo de lana.' },
                        { num: 6, texto: '—Cuando yo era joven, más joven que tú —comenzó—, vivíamos cerca del río Maule. Mi hermano Rodrigo y yo éramos inseparables. Un verano, el río creció por las lluvias y arrastró el puente viejo. Al otro lado quedó atrapada la señora Carmen con sus tres hijos pequeños, sin comida ni manera de cruzar.' },
                        { num: 7, texto: 'Hizo una pausa para espolvorear harina sobre la mesa. Yo contuve la respiración.' },
                        { num: 8, texto: '—Tu bisabuelo dijo que era imposible cruzar. El agua estaba helada y la corriente era brutal. Pero Rodrigo y yo nos miramos y supimos, sin decirnos nada, que teníamos que intentarlo.' },
                        { num: 9, texto: '—¿Cruzaron el río? —pregunté, con los ojos abiertos de asombro.' },
                        { num: 10, texto: '—Amarramos una cuerda al sauce viejo de la orilla. Rodrigo iba primero, yo le sujetaba la cuerda desde atrás. A mitad del cruce, un tronco que venía con la corriente me golpeó el brazo y la cuerda me cortó la muñeca. Pero no la solté.' },
                        { num: 11, texto: 'Sus ojos brillaron con algo que no era tristeza, sino algo más firme, como el orgullo de quien sabe que tomó la decisión correcta.' },
                        { num: 12, texto: '—¿Y Rodrigo? —susurré.' },
                        { num: 13, texto: '—Llegó al otro lado. Ayudó a la señora Carmen y a sus hijos a cruzar con la cuerda. Todos sobrevivieron.' },
                        { num: 14, texto: 'Mi abuela levantó la muñeca y la giró lentamente bajo la luz amarillenta de la cocina.' },
                        { num: 15, texto: '—Yo me quedé con esto —dijo, tocando la cicatriz—. Y con la certeza de que hay momentos en la vida en que soltar es más fácil, pero sostener es lo correcto.' },
                        { num: 16, texto: 'Terminó de dar forma al pan y lo puso en la bandeja. Antes de meterlo al horno, me miró con esos ojos oscuros que parecían contener todas las tormentas y todas las calmas del mundo.' },
                        { num: 17, texto: '—Algún día, mi niño, algo te va a pedir que no sueltes. Y cuando eso pase, acuérdate de esta cicatriz.' },
                        { num: 18, texto: 'Han pasado quince años desde esa tarde. Mi abuela ya no está, pero cada vez que la vida me pide soltar, cierro los ojos y siento su mano firme, sosteniendo la cuerda.' }
                    ], fuente: 'Texto original creado para fines pedagógicos — SIMCE S5, El Cuento.'
                }
            ],
            preguntas: [
                { id: 1, textoRef: 'texto-1', habilidad: 'INTERPRETAR', enunciado: 'La cicatriz de la abuela es descrita "como un río dibujado sobre un mapa antiguo". ¿Qué figura literaria se utiliza en esa expresión?', opciones: [{ letra: 'A', texto: 'Metáfora, porque sustituye la cicatriz por la imagen de un río de forma directa.' }, { letra: 'B', texto: 'Comparación, porque conecta la cicatriz con un río usando la palabra "como".' }, { letra: 'C', texto: 'Hipérbole, porque agranda la apariencia real de la marca en la muñeca.' }, { letra: 'D', texto: 'Personificación, porque le atribuye al río la capacidad de dibujarse solo.' }], correcta: 'B' },
                { id: 2, textoRef: 'texto-1', habilidad: 'INTERPRETAR', enunciado: 'El texto señala que la abuela amasaba "con una fuerza que desmentía sus setenta y tres años". ¿Qué significa que su fuerza "desmentía" su edad?', opciones: [{ letra: 'A', texto: 'Que intentaba disimular los efectos de la vejez para no preocupar a su nieto.' }, { letra: 'B', texto: 'Que amasaba de forma mecánica y repetitiva, sin energía real, solo por costumbre.' }, { letra: 'C', texto: 'Que la expresión indica que su edad era un dato inexacto dentro del relato.' }, { letra: 'D', texto: 'Que su fuerza física contradecía lo que se espera de alguien de esa edad.' }], correcta: 'D' },
                { id: 3, textoRef: 'texto-1', habilidad: 'INTERPRETAR', enunciado: '¿Qué tipo de conflicto enfrenta la abuela cuando joven al intentar cruzar el río para rescatar a la familia atrapada?', opciones: [{ letra: 'A', texto: 'Personaje vs. naturaleza, porque lucha contra la corriente y el río crecido.' }, { letra: 'B', texto: 'Personaje vs. sí mismo, porque duda internamente antes de tomar la decisión.' }, { letra: 'C', texto: 'Personaje vs. sociedad, porque el bisabuelo y su entorno se oponen al cruce.' }, { letra: 'D', texto: 'Personaje vs. destino, porque estaba predeterminado que ella se lastimaría.' }], correcta: 'A' },
                { id: 4, textoRef: 'texto-1', habilidad: 'INTERPRETAR', enunciado: 'La abuela dice: "Soltar es más fácil, pero sostener es lo correcto". En este contexto, la cuerda que ella sostuvo representa:', opciones: [{ letra: 'A', texto: 'La relación fraternal que mantenía con su hermano Rodrigo desde la infancia.' }, { letra: 'B', texto: 'El miedo que experimentó durante el cruce y que nunca pudo superar del todo.' }, { letra: 'C', texto: 'El compromiso y la responsabilidad que uno asume al proteger a los demás.' }, { letra: 'D', texto: 'Un objeto práctico de rescate que no tiene un significado más profundo.' }], correcta: 'C' },
                { id: 5, textoRef: 'texto-1', habilidad: 'INTERPRETAR', enunciado: '¿Desde qué perspectiva temporal se organiza la narración del cuento "La cicatriz"?', opciones: [{ letra: 'A', texto: 'Solo desde el pasado, como un recuerdo distante y difuso de la infancia.' }, { letra: 'B', texto: 'Solo desde el presente, de forma directa y sin saltos temporales relevantes.' }, { letra: 'C', texto: 'Desde el futuro, anticipando hechos que le ocurrirán al narrador más adelante.' }, { letra: 'D', texto: 'Desde el presente, evocando el pasado mediante un doble flashback al ayer.' }], correcta: 'D' },
                { id: 6, textoRef: 'texto-1', habilidad: 'LOCALIZAR', enunciado: 'Según el texto, ¿qué provocó que el puente viejo fuera arrastrado por el agua?', opciones: [{ letra: 'A', texto: 'El crecimiento del río causado por las lluvias que cayeron ese verano.' }, { letra: 'B', texto: 'La acumulación de troncos y escombros que debilitaron su estructura.' }, { letra: 'C', texto: 'Un desborde provocado por el deshielo de la cordillera cercana al Maule.' }, { letra: 'D', texto: 'La fuerza habitual de la corriente del río Maule durante esa época.' }], correcta: 'A' },
                { id: 7, textoRef: 'texto-1', habilidad: 'LOCALIZAR', enunciado: '¿Cuántos años tenía el narrador cuando la abuela le contó la historia de la cicatriz?', opciones: [{ letra: 'A', texto: 'Quince años, pues el texto menciona que han pasado quince años desde entonces.' }, { letra: 'B', texto: 'Era un niño pequeño, porque las promesas le parecían "cosas de películas".' }, { letra: 'C', texto: 'Doce años, según se señala de forma directa y explícita en el relato.' }, { letra: 'D', texto: 'No se indica una edad exacta, solo que era menor que la abuela cuando joven.' }], correcta: 'C' },
                { id: 8, textoRef: 'texto-1', habilidad: 'INTERPRETAR', enunciado: 'Cuando el narrador pregunta por la cicatriz, la abuela "sonrió sin mirarme". ¿Qué se puede inferir de esa reacción?', opciones: [{ letra: 'A', texto: 'Que no quería hablar del tema y trataba de evitar la conversación con su nieto.' }, { letra: 'B', texto: 'Que el recuerdo le provocaba nostalgia y orgullo, y se ensimismó un momento.' }, { letra: 'C', texto: 'Que estaba concentrada en amasar el pan y no prestó atención a la pregunta.' }, { letra: 'D', texto: 'Que sentía vergüenza por la marca y prefería no mostrar lo que le provocaba.' }], correcta: 'B' },
                { id: 9, textoRef: 'texto-1', habilidad: 'INTERPRETAR', enunciado: 'El narrador compara la forma de contar historias de su abuela con "quien desenrolla un ovillo de lana". ¿Qué sugiere esa comparación?', opciones: [{ letra: 'A', texto: 'Que la abuela narraba con calma y a su propio ritmo, sin apuros ni presiones.' }, { letra: 'B', texto: 'Que la abuela solía tejer mientras relataba historias a su nieto en la cocina.' }, { letra: 'C', texto: 'Que el hilo del relato era tan frágil que se rompería si alguien la interrumpía.' }, { letra: 'D', texto: 'Que narraba de forma desordenada, mezclando tiempos y personajes distintos.' }], correcta: 'A' },
                { id: 10, textoRef: 'texto-1', habilidad: 'INTERPRETAR', enunciado: 'El texto dice que la abuela y Rodrigo "se miraron y supieron, sin decirnos nada, que teníamos que intentarlo". ¿Qué se infiere de esa frase?', opciones: [{ letra: 'A', texto: 'Que Rodrigo era mayor y asumió la decisión por ambos como hermano protector.' }, { letra: 'B', texto: 'Que ambos sentían miedo pero no querían reconocerlo frente al otro en ese instante.' }, { letra: 'C', texto: 'Que entre ellos existía una conexión profunda que les permitía entenderse sin hablar.' }, { letra: 'D', texto: 'Que ya habían planificado cruzar el río con anticipación y solo confirmaron la señal.' }], correcta: 'C' },
                { id: 11, textoRef: 'texto-1', habilidad: 'REFLEXIONAR', enunciado: '¿Cuál es la función principal del último párrafo ("Han pasado quince años...") en relación con el sentido global del texto?', opciones: [{ letra: 'A', texto: 'Informar sobre la muerte de la abuela para cerrar el relato con un tono de despedida.' }, { letra: 'B', texto: 'Mostrar que la enseñanza de la abuela sigue guiando las decisiones del narrador adulto.' }, { letra: 'C', texto: 'Volver al presente para contrastar la juventud de la abuela con la vejez del narrador.' }, { letra: 'D', texto: 'Revelar que el narrador lamenta no haber valorado lo suficiente a su abuela en vida.' }], correcta: 'B' }
            ]
        }
    };

    try {
        const db = getDb();
        await db.ref(BASE + '/sesiones/sesion-3').set(sesData);
        const snap = await db.ref(BASE + '/sesiones/sesion-3/titulo').once('value');
        res.json({ ok: true, titulo: snap.val(), preguntas: sesData.contenido.preguntas.length, textos: sesData.contenido.textos.length });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
