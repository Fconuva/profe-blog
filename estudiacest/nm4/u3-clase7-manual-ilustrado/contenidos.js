'use strict';
window.MANUAL_COURSES = {
  '4C': {
    name:'4°C · Electricidad', equipment:'Multímetro digital Fluke 101',
    photo:'assets/multimetro.jpg', detail:'assets/multimetro-detalle.jpg', diagram:'assets/plano-multimetro.svg',
    alt:'Multímetro digital Fluke 101, fotografía del fabricante', detailAlt:'Otra vista del multímetro Fluke 101',
    credit:'Fotografías: Fluke. Esquema de identificación: Estudia CEST, basado en el equipo y su manual; sin escala.',
    source:'https://assets.fluke.com/manuals/101_____umspa0000.pdf',
    sourceName:'Fluke 101 · Manual de uso en español',
    reference:'Fluke, Manual de uso del 101 (2013), pp. 1–2, 7–9 y 17–18.',
    sections:[
      ['Identificación','Este instrumento presenta magnitudes eléctricas en una pantalla digital. El selector rotatorio permite escoger una función y la posición OFF lo apaga. HOLD conserva una lectura visible; no detiene el circuito examinado. El botón amarillo cambia opciones de la función elegida. COM es el terminal común y el otro terminal recibe la entrada de medición.'],
      ['Antes de utilizarlo','Es necesario consultar el manual completo y trabajar dentro de sus límites. Primero se inspeccionan la carcasa y el aislamiento de las puntas; si hay deterioro, se suspende el uso. El equipo no debe utilizarse en lugares mojados ni con gases inflamables.'],
      ['Lectura y cuidado','Se comprueba la función y la unidad indicadas antes de interpretar un valor. El aviso de batería baja requiere atención. Tras veinte minutos sin actividad, el equipo se apaga automáticamente. La limpieza exterior se realiza con el instrumento apagado y las puntas retiradas; se usa un paño húmedo y detergente suave.'],
      ['Límite de esta lectura','Este resumen apoya la escritura: no autoriza mediciones ni sustituye la capacitación y las advertencias del fabricante.']
    ],
    parts:['Pantalla: muestra valores, unidades e indicadores.','HOLD: conserva la lectura visible.','Botón amarillo: cambia opciones de la función seleccionada.','Selector rotatorio: elige la función y OFF.','COM: terminal común.','Terminal de entrada: recibe la señal de medición.'],
    vocabulary:[['Terminal','Punto de conexión de una punta de prueba.'],['Unidad','Indicación que permite interpretar qué representa el valor.'],['Aislamiento','Material protector que separa las partes conductoras del contacto exterior.']],
    guidedOriginal:'La activación de la retención de datos mantiene el valor indicado, sin implicar la desenergización del circuito.',
    guidedQuestion:'¿Cómo explicarías HOLD a un principiante sin hacerle creer que el circuito queda apagado?',
    guidedAnswer:'HOLD mantiene el número en la pantalla. No corta la energía del circuito.'
  },
  '4E': {
    name:'4°E · Electrónica', equipment:'Estación de soldadura HAKKO FX-888DX',
    photo:'assets/estacion-soldadura.jpg', detail:'assets/estacion-detalle.jpg', diagram:'assets/plano-estacion.svg',
    alt:'Estación HAKKO FX-888DX, cautín y soporte, fotografía del fabricante', detailAlt:'Pantalla y perilla de la estación HAKKO FX-888DX',
    credit:'Fotografías: HAKKO. Esquema de identificación: Estudia CEST, basado en el equipo y su manual; sin escala.',
    source:'https://www.hakko.com/english/support/doc/result.php?mode=download&seq=7300',
    sourceName:'HAKKO FX-888DX · Manual de instrucciones en español',
    reference:'HAKKO, FX-888DX, Manual de instrucciones en español (rev. 2024), secciones 1, 3 y 4.',
    sections:[
      ['Identificación','La estación controla el calentamiento del cautín. La pantalla informa la temperatura y el estado del equipo. La perilla permite seleccionar ajustes y confirmarlos al presionarla. El conjunto incluye un soporte, una esponja y lana metálica para la limpieza de la punta.'],
      ['Preparación del puesto','Se identifica cada componente y se revisan cables y enchufes. El soporte debe quedar disponible para dejar el cautín cuando no se esté utilizando. El área necesita ventilación y debe estar libre de materiales inflamables. Los ajustes se realizan siguiendo el manual y las indicaciones de la persona a cargo.'],
      ['Advertencias y cuidado','La punta y las piezas metálicas próximas pueden causar quemaduras. Antes de conectar o desconectar el cautín, se apaga la estación. La limpieza con esponja requiere que esté húmeda. Al terminar, se apaga y desconecta el equipo; se espera que enfríe antes de manipularlo. Un cable deteriorado requiere atención de personal calificado.'],
      ['Límite de esta lectura','Esta adaptación sirve para redactar el manual de clase, no para operar o reparar el equipo. No sustituye las precauciones completas del fabricante.']
    ],
    parts:['Estación: controla el calentamiento del cautín.','Pantalla: informa temperatura y estado.','Perilla: permite seleccionar y confirmar ajustes.','Cautín: herramienta cuya punta transmite calor.','Soporte: mantiene el cautín en una posición segura.','Elementos de limpieza: esponja y lana metálica.'],
    vocabulary:[['Cautín','Herramienta que aporta calor en el proceso de soldadura.'],['Temperatura establecida','Valor configurado para el control del equipo.'],['Ventilación','Renovación del aire del puesto de trabajo.']],
    guidedOriginal:'La permanencia del cautín fuera de operación requiere su disposición en el soporte previsto, debido a la temperatura de sus partes metálicas.',
    guidedQuestion:'¿Cómo explicarías dónde dejar el cautín y por qué, sin omitir el riesgo?',
    guidedAnswer:'Cuando no uses el cautín, déjalo en su soporte. Su punta puede estar caliente y causar quemaduras.'
  }
};
