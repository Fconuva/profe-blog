'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {exams}=require('../api/_simce-u4-catalog');
const {measure}=require('./audit-simce-u4');
const dir=path.resolve(__dirname,'../referencias/simce-unidad4-2026');fs.mkdirSync(dir,{recursive:true});
const cell=v=>'"'+String(v??'').replaceAll('"','""')+'"';
const rows=[['miniensayo','fecha','item','texto','genero','habilidad','operacion','demanda_prevista','enunciado','A','B','C','D','clave','evidencia','error_A','error_B','error_C','error_D','palabras_A','palabras_B','palabras_C','palabras_D']];
exams.forEach(e=>e.texts.forEach(t=>t.questions.forEach(q=>rows.push([e.number,e.date,q.id,t.title,t.genre,q.skill,q.operation,q.demand,q.prompt,...q.options,q.key,q.evidence,...q.errors,...q.options.map(o=>o.split(/\s+/u).length)]))));
fs.writeFileSync(path.join(dir,'MATRIZ_90_ITEMS.csv'),'\ufeff'+rows.map(r=>r.map(cell).join(',')).join('\n')+'\n');
const requirements=[
 ['EA-L1','Extraer información explícita discriminando datos semejantes.','E2 q7; E4 q7; E5 q7','direct','Hay fechas/horarios o variables próximas que compiten.'],
 ['EA-I1','Determinar tema, conflicto, propósito o postura integrando información.','E1 q8; E2 q4; E3 q2; E4 q14; E5 q4','direct','La evidencia se busca en el conjunto, no en un dato aislado.'],
 ['EA-I2','Inferir una relación de causa y consecuencia entre ideas que compiten.','E1 q2; E1 q16','direct','Gesto final del padre e hipótesis sobre observación sin eventos.'],
 ['EA-I3','Inferir sentimientos, intenciones o motivaciones con pistas dispersas.','E3 q3–q4; E5 q3','direct','Antígona/Creonte y actitud del hablante ante un amor perdido.'],
 ['EA-I4','Inferir características de un personaje.','E1 q3','direct','Reconocimiento, aviso y aprendizaje respaldan el rasgo inferido.'],
 ['EA-I5','Determinar estereotipos presentes en el texto.','E4 q2','direct','Comentario del entrevistador y reacción de Marina.'],
 ['EA-I6','Determinar un problema humano expresado en el texto.','E4 q5; E3 q2','direct','Reconocimiento ante prejuicio y deber frente a autoridad.'],
 ['EA-I7','Interpretar lenguaje figurado desde el contexto.','E2 q2–q3; E4 q11; E5 q5','direct','Imágenes de tiempo, acceso y entrega amorosa.'],
 ['EA-R1','Evaluar un texto usando su sentido global.','E2 q12; E4 q17–q18','direct','Titular coherente y comparación entre cuento y ensayo.'],
 ['EA-R2','Determinar propósito o efecto de recursos lingüísticos y no lingüísticos.','E1 q6 y q18; E2 q6; E3 q6 y q11; E5 q6','direct','Repetición, tabla, soneto, acotación y fuente especializada.'],
 ['EA-R3','Identificar fallas evidentes de argumentación.','E1 q12; E3 q18; E5 q17–q18','direct','Generalización desde un caso y confusión entre condiciones distintas.']
];
const coverageRows=[['requirement_id','requirement_text','covered_by','bands','evidence_strength','notes'],...requirements.map(([id,t,by,strength,note])=>[id,t,by,'NM1/NM2',strength,note])];
fs.writeFileSync(path.join(dir,'COBERTURA_ESTANDARES.csv'),'\ufeff'+coverageRows.map(r=>r.map(cell).join(',')).join('\n')+'\n');
const table='| ID | Operación de los estándares | Evidencia | Cobertura | Límite |\n|---|---|---|---|---|\n'+requirements.map(([id,t,by,strength,note])=>`| ${id} | ${t} | ${by} | ${strength} | ${note} |`).join('\n');
fs.writeFileSync(path.join(dir,'COBERTURA_ESTANDARES.json'),JSON.stringify({framework_name:'Unidad 4 SIMCE CEST 2026',requirements_source:'Estándares de Aprendizaje Lectura 2.º medio, MINEDUC 2022, ficha técnica pp. 46–49',coverage_table:table,coverage_csv:coverageRows.map(r=>r.map(cell).join(',')).join('\n'),gap_summary:'Las 11 operaciones normalizadas tienen al menos un ítem directo. No se identifica una operación ausente en esta selección de descriptores. Esto no equivale a cubrir todos los OA, ejemplos, niveles de dificultad o condiciones de la prueba oficial. La cantidad por operación es desigual; características de personaje y estereotipos tienen una muestra reducida.',coverage_statistics:{total_requirements:11,directly_covered:11,partially_covered:0,indirectly_covered:0,not_covered:0},classification_note:'Los identificadores EA-* son una descomposición editorial para rastrear evidencia; no son códigos oficiales de MINEDUC.'},null,2)+'\n');
const stats=measure();
fs.writeFileSync(path.join(dir,'MEDICIONES.json'),JSON.stringify({tokenization:'Separación por espacio; incluye vocabulario y contexto, excluye títulos, rótulos, pie de fuente y celdas de tabla. No es una prueba de velocidad lectora.',catalogSHA256:crypto.createHash('sha256').update(JSON.stringify(exams)).digest('hex'),exams:stats},null,2)+'\n');
const metrics='| Miniensayo | Fecha | Palabras de los tres textos | Lecturas: total | Textos + enunciados y alternativas |\n|---|---|---|---:|---:|\n'+stats.map(s=>`| ${s.number} | ${s.date} | ${s.textWords.join(' / ')} | ${s.totalReadingWords} | ${s.allVisibleWords} |`).join('\n');
fs.writeFileSync(path.join(dir,'INFORME_AUDITORIA.md'),`# Auditoría Unidad 4 SIMCE — 13 de octubre de 2026

**Instrumento:** cinco miniensayos digitales, tres unidades de lectura y 18 alternativas A–D por aplicación, para 2.º A HC y 2.º B HC. Primera clase: 14 de octubre; preparación hasta 10 de noviembre. SIMCE inicia el 11 y Lectura se aplica el 12 (calendario Agencia vigente).

**Dictamen:** apto como práctica abreviada de lectura y diagnóstico formativo después de las correcciones descritas. No acredita equivalencia 1:1 de formato, dificultad, cobertura exhaustiva ni escala de puntajes con SIMCE. No asigna nota escolar automática. La revisión de contenido y las pruebas las realizó el mismo agente constructor; no es verificación independiente ni aprobación externa.

## Medición reproducible

${metrics}

Conteo por espacios: incluye vocabulario y contexto; excluye títulos, fuente y tablas. Las preguntas suman también sus cuatro opciones. No sustituye la medición del tiempo real. La referencia local Forma P presenta prosas de aproximadamente 530–885 palabras; esta serie contiene prosas narrativas/informativas en torno a 500–560, poemas más breves y una unidad discontinua de 200 palabras más tabla. El tamaño menor es deliberado por el formato de 18 preguntas: no es la extensión de una prueba completa.

## Alternativas y pautas

- 90/90 ítems tienen cuatro opciones distintas, una clave, evidencia precisa y explicación del error de cada distractor en MATRIZ_90_ITEMS.csv. Revisión editorial: respuesta válida para el enunciado y descarte de las tres opciones desde el texto; sin conocimientos externos exigidos.
- Cada miniensayo: Localizar 4 (22,2 %), Interpretar y relacionar 9 (50 %), Reflexionar 5 (27,8 %). Total: 20/45/25. Es aproximación editorial al peso observado en la reproducción local de Forma P (8/19/9 sobre 36 alternativas), no distribución oficial obligatoria de 2026.
- Cada aplicación tiene A=4, B=5, C=4 y D=5. Orden editorial sin rachas de tres ni ciclos repetidos de dos/cuatro. El balance no certifica calidad del ítem.
- Ninguna clave supera en más de 50 % la extensión de la mayor alternativa incorrecta. En navegador, no se encontró clave única con dos o más líneas adicionales respecto de las otras opciones en las vistas medidas. Palabras por opción quedan en el CSV; líneas reales, en la evidencia privada de navegador.
- Existe reiteración temática deliberada dentro de cada bloque. La pregunta sobre el rasgo del hijo y la lectura simbólica de la llave comparten evidencia, pero no requieren haber marcado otra respuesta. No se modelan soluciones ni se entrega feedback durante el intento.

## Cobertura de estándares NM2

${table}

Cobertura directa significa presencia de la operación en un ítem. No demuestra dificultad observada, profundidad equivalente, confiabilidad ni dominio del estudiante. Los códigos EA-* son editoriales; se descompusieron los descriptores de las páginas 47–49 para rastrear sus operaciones. No se atribuye ese conteo a MINEDUC.

## Contenidos NM1/NM2: cobertura y brechas

| Familia curricular | Evidencia en la serie | Estado y límite |
|---|---|---|
| Narrativa (OA 3) | E1 y E4: perspectiva, conflicto, rasgos, motivación, símbolo, retrospección, prejuicio y alusión a mito | Directa para estas operaciones; parcial respecto de todos los subaspectos del OA. Personajes tipo, caja china e historia paralela no tienen un ítem exclusivo. |
| Poesía (OA 4) | E2: Soneto XXIII; E5: Rima LIII; imágenes, ánimo, tema, repetición y forma/sentido | Directa para estas operaciones; no se mide identificación métrica, sinalefa ni todos los aspectos formales. |
| Drama (OA 5) y tragedia NM1 (OA 6) | E3: recreación rotulada de Antígona, deber/ley, convicciones, coro, diálogo y acotación | Parcial: escena adaptada, no lectura de tragedia completa ni evaluación exhaustiva de contexto y puesta en escena. |
| Romanticismo NM1 (OA 7) | Bécquer y repaso de subjetividad/contexto | Parcial: interpretación de un poema; no historia del movimiento completa. |
| Siglo de Oro NM2 (OA 6) | Garcilaso, soneto y repaso de contexto renacentista | Parcial: una obra y forma; no panorama completo del período. |
| Cuento latinoamericano NM2 (OA 7) | Cuentos originales CEST de contexto chileno | Parcial: transferencia lectora; no reemplaza ni acredita lectura del corpus de autores estudiado durante el año. |
| Interpretación literaria (OA 8) | Selección de interpretaciones respaldadas y comparación cuento/ensayo E4 q17 | Parcial: no producción personal de una crítica ni interpretación abierta extensa. |
| Argumentación (OA 9) | Columna, carta, discurso y ensayo; tesis, ejemplo, objeción, contraargumento, ironía y alcance de la evidencia | Directa para los aspectos muestreados; no cubre todos los subaspectos ni postura escrita personal. |
| Medios (OA 10) | Noticia, reportaje, crónica y afiche/campaña con comentarios; citas, destinatario, persuasión, hecho/opinión, diseño descrito | Directa para los aspectos muestreados; audio y comparación extensa de dos medios sobre un hecho no evaluados. |
| Contextualizar obras con texto no literario (OA 11) | Repaso de períodos e indicaciones docentes | Indirecta: no hay un bloque completo de documentación histórica con preguntas que lo vinculen a una obra. |
| Hábito/selección y experiencia humana (OA 1–2) | Cinco prácticas y reflexión oral posterior prevista | Parcial: no se mide hábito lector ni selección autónoma mediante alternativas. |
| Escritura, oralidad e investigación | Reglas de redacción y devolución oral | Apoyo pedagógico; no forman parte del puntaje de lectura. |

**Conclusión de cobertura:** las tres habilidades y las once operaciones normalizadas están representadas. No corresponde anunciar «100 % de todos los contenidos de NM1/NM2» ni «1:1 oficial» a partir de esta serie. Los repasos nombran conceptos adicionales, pero nombrarlos no significa evaluarlos. El corpus del año y estas brechas deben retomarse en el repaso docente, con la obra correspondiente, sin agregar exigencias de escritura al miniensayo.

## Análisis de validez de la evaluación

**Qué se pretende medir:** comprensión y decisiones lectoras con evidencia, en práctica formativa de 2.º medio.

**Validez de constructo:** el puntaje procede solo de alternativas lectoras; no mezcla decoración, caligrafía, velocidad, exposición oral ni escritura. La pregunta comparativa exige regresar al cuento y al ensayo. Las instrucciones piden una tarea principal y no muestran nombres de habilidades al estudiante.

**Variables ajenas al constructo:** acceso a equipo/red, experiencia con radios y lectura en pantalla; la copia bloqueada puede dificultar estrategias de selección visual. Se conservan foco de teclado, cambio de respuesta, scroll, borrador local y reintento; no se penaliza el uso de teclas de navegación. El control anticopia es disuasivo y no impide fotografías ni Google Lens desde otro dispositivo.

**Subrepresentación:** solo 18 alternativas por aplicación; no respuestas abiertas. Las tareas con escasa muestra no permiten un diagnóstico fino de todas las subhabilidades. Los cinco textos literarios no representan todo el patrimonio ni las obras del año.

**Confiabilidad:** la misma respuesta recibe el mismo acierto por clave de servidor. No se estimó consistencia interna, estabilidad entre días, error de medida, dificultad empírica ni discriminación. No hay pilotaje con estos ítems. Antes de interpretar resultados, revisar omisiones, elección de distractores, tiempo real y posibles ambigüedades de la primera aplicación.

**Consecuencias:** el índice simulado CEST usa 150 + 200 × aciertos/18, redondeado. Es una escala arbitraria de práctica, sin calibración psicométrica. No se aplican cortes de 250/295 ni niveles oficiales al resultado. Puede motivar seguimiento, pero no debe usarse como predicción, calificación escolar ni certificación de nivel SIMCE.

**Cambios derivados de la revisión:** retiro de la explicación de fallas antes de responder el afiche; incorporación de comparación entre dos textos; incorporación de Garcilaso/Bécquer/Antígona por brechas literarias; ampliación de prosas; cambio de una pregunta de motivación explícita a inferencia del gesto final; resecuenciación de alternativas y revisión de todas las claves; corrección del panel docente detectada en navegador; protección de respuestas/resultados U4 ante escrituras directas de Firebase.

## Verificación técnica

Funciones reales con base ficticia: identidad/curso, asignación, cinco instrumentos, clave oculta antes de entrega, puntaje desde servidor, inicio desde servidor, faltantes, guardado y recarga, red caída/reintento, entrega/resultado, concurrencia, inmutabilidad, reapertura del módulo canónico, cola previa rechazada y alcance docente. Panel del estudiante confirma Completada y panel docente lee el resultado. Cierre: 11 de noviembre a las 00:00, hora de Santiago; termina la preparación el 10. No se escribieron respuestas, notas ni datos de estudiantes reales para probar.

Navegador: miniensayo 1 en 320/390/1440/3840 px y los demás en 390 px; sin desbordes ni errores JS; bloqueo de copia, faltantes, recuperación, entrega, relectura y acceso privado comprobados. Las mediciones son digitales; no hay validación física impresa porque la aplicación solicitada es digital.

## Fuentes y reproducción

- Estándares MINEDUC: archivo local articles-208047_recurso_pdf.pdf (2022; decretos 178/2015 y 256/2019), ficha técnica pp. 46–49.
- Bases Curriculares 7.º básico a 2.º medio: copia textual íntegra local Bases_Curriculares_7_Basico_a_2_Medio.txt, secciones de lectura de NM1/NM2. [Currículum Nacional](https://www.curriculumnacional.cl/evaluacion/estandares-indicadores/estandares-aprendizaje/vigente).
- Forma P local 2025: reproducción de contenido SIMCE_2025_NM2_Forma_P.html; ejemplo q33 y matriz de habilidades. No se presenta como prueba 2026 ni como maqueta oficial.
- [Agencia: calendario y aplicación 2026](https://www.agenciaeducacion.cl/simce-2026-orientaciones/).
- Garcilaso: poema en dominio público, cotejado con [antología UNAM, página PDF 18](https://gaceta.cch.unam.mx/sites/default/files/libros/2021-08/siglosdeoro_web.pdf); se omiten notas y diseño editoriales.
- Bécquer: poema en dominio público, cotejado con [Rimas y leyendas, Cervantes](https://www.cervantesvirtual.com/portales/gustavo_adolfo_becquer/obra-visor/rimas-y-leyendas--0/html/00053dfc-82b2-11df-acc7-002185ce6064_2.html), Rima LIII; vocabulario propio.
- Antígona: recreación CEST del conflicto de Sófocles, cotejada con [texto de referencia](https://es.wikisource.org/wiki/Ant%C3%ADgona_(Wikisource_tr.)); no es traducción literal.
- El resto son textos originales y situaciones ficticias CEST, rotulados; no son entrevistas, noticias, datos ni campañas reales.

Regenerar matriz, cobertura y mediciones: node scripts/build-simce-u4-review.js. Archivos internos excluidos del despliegue público. Estado de publicación y verificaciones actuales: BITACORA.md.
`);
console.log('Informe privado, matriz de 90 ítems, cobertura y mediciones generados.');
