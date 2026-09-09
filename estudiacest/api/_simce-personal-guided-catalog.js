'use strict';

const GUIDED_VARIANT = 'guided-access-2026';

const GUIDED_SESSIONS = {
    '2': {
        id: 'personal-u3-2-teatro',
        key: { q1:'B', q2:'D', q3:'A', q4:'C', q5:'B', q6:'D' },
        skills: { q1:'LOCALIZAR', q2:'INTERPRETAR', q3:'INTERPRETAR', q4:'REFLEXIONAR', q5:'INTERPRETAR', q6:'REFLEXIONAR' },
        feedback: {
            q1:'El conflicto aparece cuando el grupo debe decidir si continúa o detiene el ensayo.',
            q2:'Los paréntesis describen una acción escénica y no una intervención hablada.',
            q3:'La respuesta se apoya en la decisión de buscar una solución compartida.',
            q4:'La pausa aumenta la tensión antes de que el personaje comunique su decisión.',
            q5:'La frase citada muestra que el personaje considera lo que necesita el grupo.',
            q6:'El cierre resuelve el conflicto mediante una propuesta de colaboración.'
        }
    },
    '3': {
        id: 'personal-u3-3-reportaje',
        key: { q1:'C', q2:'A', q3:'D', q4:'B', q5:'C', q6:'A' },
        skills: { q1:'LOCALIZAR', q2:'INTERPRETAR', q3:'LOCALIZAR', q4:'INTERPRETAR', q5:'REFLEXIONAR', q6:'REFLEXIONAR' },
        feedback: {
            q1:'La entrada resume de inmediato el cambio de horario y su propósito.',
            q2:'El texto informa sobre una medida escolar y explica sus primeros resultados.',
            q3:'La fuente identificada es la encargada de la biblioteca entrevistada en el texto.',
            q4:'Las cifras comparan préstamos anteriores y posteriores al cambio de horario.',
            q5:'La conclusión debe limitarse a la experiencia observada en esa biblioteca.',
            q6:'Una fuente adicional de estudiantes permitiría contrastar la explicación institucional.'
        }
    },
    '4': {
        id: 'personal-u3-4-campana-visual',
        key: { q1:'D', q2:'B', q3:'C', q4:'A', q5:'D', q6:'B' },
        skills: { q1:'LOCALIZAR', q2:'INTERPRETAR', q3:'LOCALIZAR', q4:'INTERPRETAR', q5:'REFLEXIONAR', q6:'REFLEXIONAR' },
        feedback: {
            q1:'El llamado central solicita llevar una botella reutilizable durante la semana.',
            q2:'La campaña se dirige a estudiantes y funcionarios que usan botellas en el colegio.',
            q3:'La tabla muestra que el miércoles tuvo el menor número de botellas desechables.',
            q4:'El lema y la tabla se complementan: uno invita a actuar y la otra muestra resultados.',
            q5:'Los datos describen una semana específica y no permiten afirmar un cambio permanente.',
            q6:'Agregar la cantidad de participantes permitiría interpretar mejor la variación diaria.'
        }
    },
    '5': {
        id: 'personal-u3-5-integrar-evidencia',
        key: { q1:'A', q2:'C', q3:'B', q4:'D', q5:'A', q6:'C' },
        skills: { q1:'LOCALIZAR', q2:'INTERPRETAR', q3:'INTERPRETAR', q4:'REFLEXIONAR', q5:'INTERPRETAR', q6:'REFLEXIONAR' },
        feedback: {
            q1:'La afirmación sostiene que abrir antes facilitó el uso de la biblioteca.',
            q2:'El dato de asistencia antes de clases es la evidencia más directa para esa afirmación.',
            q3:'La explicación debe mostrar cómo el dato apoya la idea, no repetirlo solamente.',
            q4:'La opinión sobre la decoración no informa si aumentó el uso de la biblioteca.',
            q5:'La respuesta completa integra afirmación, evidencia precisa y explicación.',
            q6:'Una comparación con semanas anteriores permitiría evaluar mejor el cambio observado.'
        }
    },
    '6': {
        id: 'personal-u3-6-lenguaje-figurado',
        key: { q1:'B', q2:'A', q3:'D', q4:'C', q5:'B', q6:'A' },
        skills: { q1:'INTERPRETAR', q2:'INTERPRETAR', q3:'LOCALIZAR', q4:'INTERPRETAR', q5:'REFLEXIONAR', q6:'REFLEXIONAR' },
        feedback: {
            q1:'El verso identifica la mañana con una llave para expresar que abre el día.',
            q2:'La ventana recibe una acción humana cuando se afirma que despierta.',
            q3:'El hablante escucha pasos y observa cómo cambia la luz del patio.',
            q4:'Las imágenes construyen un tono sereno de comienzo y movimiento gradual.',
            q5:'La idea central relaciona los pequeños cambios con el inicio de una nueva jornada.',
            q6:'La interpretación más sólida cita una imagen y explica el efecto que produce.'
        }
    },
    '7': {
        id: 'personal-u3-7-discurso',
        key: { q1:'C', q2:'D', q3:'A', q4:'B', q5:'C', q6:'D' },
        skills: { q1:'LOCALIZAR', q2:'INTERPRETAR', q3:'INTERPRETAR', q4:'INTERPRETAR', q5:'REFLEXIONAR', q6:'REFLEXIONAR' },
        feedback: {
            q1:'La vocera habla ante el centro de estudiantes reunido en asamblea.',
            q2:'Su propósito es convencer a la audiencia de probar un recreo con menos residuos.',
            q3:'La cifra de residuos funciona como evidencia para justificar la propuesta.',
            q4:'La pregunta retórica invita a pensar y compromete a quienes escuchan.',
            q5:'La concesión reconoce una dificultad antes de defender que el cambio es posible.',
            q6:'El cierre moviliza porque propone una acción concreta, acotada y evaluable.'
        }
    },
    '8': {
        id: 'personal-u3-8-mini-ensayo',
        key: { q1:'D', q2:'C', q3:'B', q4:'A', q5:'D', q6:'C' },
        skills: { q1:'LOCALIZAR', q2:'INTERPRETAR', q3:'INTERPRETAR', q4:'LOCALIZAR', q5:'REFLEXIONAR', q6:'REFLEXIONAR' },
        feedback: {
            q1:'El aviso informa que la feria se realizará el jueves en el patio techado.',
            q2:'La finalidad principal es invitar a participar e indicar cómo hacerlo.',
            q3:'La frase sobre reparar antes de reemplazar resume la idea central.',
            q4:'Cada equipo debe inscribirse con un objeto y una propuesta de reparación.',
            q5:'El texto no asegura que todos los objetos puedan repararse, por eso esa inferencia es excesiva.',
            q6:'El aviso sería más completo si indicara el horario de inicio y término.'
        }
    },
    '9': {
        id: 'personal-u3-9-correccion',
        key: { q1:'A', q2:'B', q3:'C', q4:'D', q5:'A', q6:'B' },
        skills: { q1:'INTERPRETAR', q2:'REFLEXIONAR', q3:'LOCALIZAR', q4:'INTERPRETAR', q5:'REFLEXIONAR', q6:'REFLEXIONAR' },
        feedback: {
            q1:'La alternativa elegida confunde un detalle verdadero con el propósito global del texto.',
            q2:'Volver al verbo de la pregunta ayuda a reconocer exactamente qué se solicita.',
            q3:'La evidencia está en la frase que invita a llevar un objeto para repararlo.',
            q4:'El distractor agrega la idea de obligación, que no aparece en el aviso.',
            q5:'Corregir exige comparar cada alternativa con una evidencia concreta del texto.',
            q6:'La mejor nota de corrección explica el error y registra una acción para evitarlo.'
        }
    },
    '10': {
        id: 'personal-u3-10-cronica-carta',
        key: { q1:'B', q2:'D', q3:'A', q4:'C', q5:'B', q6:'D' },
        skills: { q1:'LOCALIZAR', q2:'INTERPRETAR', q3:'LOCALIZAR', q4:'INTERPRETAR', q5:'REFLEXIONAR', q6:'REFLEXIONAR' },
        feedback: {
            q1:'La crónica ordena los hechos desde el corte de luz hasta el cierre de la actividad.',
            q2:'La expresión citada comunica la impresión personal de quien narra.',
            q3:'La carta se dirige a la dirección del establecimiento.',
            q4:'Su propósito es agradecer y proponer una mejora para futuras actividades.',
            q5:'Ambos textos mencionan el mismo hecho, pero lo organizan con propósitos diferentes.',
            q6:'La crónica permite reconstruir la secuencia; la carta formula una petición directa.'
        }
    }
};

function getGuidedSession(number) {
    return GUIDED_SESSIONS[String(number)] || null;
}

module.exports = { GUIDED_VARIANT, GUIDED_SESSIONS, getGuidedSession };
