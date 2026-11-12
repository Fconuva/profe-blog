'use strict';
// Guía 27 · Repaso 1: diez contenidos de comprensión lectora (del tema del texto al resumen).
// Clave y retroalimentación viven solo en servidor; cada retroalimentación cita la pista del texto.
const key = {
    1: 'B', 2: 'A', 3: 'C', 4: 'D', 5: 'B',
    6: 'A', 7: 'D', 8: 'C', 9: 'A', 10: 'B',
    11: 'C', 12: 'A', 13: 'B', 14: 'D', 15: 'C',
    16: 'A', 17: 'C', 18: 'B', 19: 'D', 20: 'D',
    // 12-nov-2026: ampliación a 10 contenidos (propósito implícito, hechos y opiniones,
    // conectores, secuencias textuales, afijos y resumen). Lo enviado con 20 se corrige sobre 20.
    21: 'C', 22: 'A', 23: 'D', 24: 'B',
    25: 'A', 26: 'D', 27: 'B', 28: 'C',
    29: 'B', 30: 'D', 31: 'A', 32: 'C',
    33: 'C', 34: 'B', 35: 'A', 36: 'D',
    37: 'D', 38: 'C', 39: 'B', 40: 'A',
    41: 'B', 42: 'D', 43: 'C', 44: 'A'
};

const feedback = {
    1: 'El asunto que se repite en todos los párrafos son las funciones de los humedales: el párrafo 1 anuncia que «cumplen funciones que ninguna obra de ingeniería reemplaza con facilidad» y los siguientes las desarrollan una por una. La ley, las aves y las inundaciones aparecen en un solo párrafo: son detalles.',
    2: 'El párrafo parte con su idea principal: «La primera de esas funciones es regular el agua». Lo que sigue (la esponja, las inundaciones, las napas) explica cómo lo hace: son ideas secundarias.',
    3: 'La idea principal del párrafo es que «los humedales son refugio de vida». Los nombres de aves («taguas, garzas y siete colores») son ejemplos que la apoyan: una idea secundaria que ejemplifica.',
    4: 'El párrafo 1 lo dice de forma explícita: los humedales «fueron vistos como terrenos inútiles: sitios húmedos, llenos de totoras y mosquitos, que convenía rellenar para construir».',
    5: 'La idea principal del párrafo 4 es que «estos espacios benefician directamente a las personas». La ley aparece al final como consecuencia («Por estas razones»): el resumen conserva ese dato de cierre y deja fuera lo esencial.',
    6: 'El texto 1 da a conocer hechos y datos: «habilitó esta semana 2,4 kilómetros de ciclovía», «60 estacionamientos para bicicletas», «unas 900 personas al día». No pide actuar ni comunica emociones: su propósito es informar.',
    7: 'El texto 2 se dirige al lector y lo mueve a actuar: «Deja el auto en casa», «súmate: ven en bicicleta y trae a alguien más». Esos verbos que piden una acción son la marca de la persuasión; además entrega razones («no contamina y no gasta un peso en bencina»).',
    8: 'El texto 3 comunica una vivencia y lo que hizo sentir: «Me temblaban las manos», «se me apretó la garganta de pura alegría», «No sabía cuánto la echaba de menos». El texto 4 también está en primera persona, pero exagera para hacer reír.',
    9: 'En el texto 3 predomina la emoción («se me apretó la garganta de pura alegría»); en el 4, la exageración humorística («me adelantó una señora con bolsas de feria», «iba ocupado respirando»). Usar la primera persona no define el propósito: hay que mirar qué busca provocar el texto.',
    10: 'Lo que se busca es convencer y mover a actuar, es decir, persuadir. El texto 2 es el único construido para eso: interpela al lector («¿Vives a menos de veinte minutos del liceo?») y le pide una acción concreta («ven en bicicleta y trae a alguien más»).',
    11: 'El texto lo dice directamente: el torno estaba «cubierto con la sábana que ella misma le había puesto en marzo». Las otras afirmaciones pueden parecer razonables, pero el texto no las declara: habría que inferirlas a partir de pistas.',
    12: 'Dos pistas apuntan al mismo mes: la sábana que Rosa «le había puesto en marzo» al torno y «el calendario seguía en la hoja de marzo». Al unirlas con lo que sabemos (un calendario detenido indica que la rutina se interrumpió), se infiere que en marzo ocurrió algo que detuvo la vida de la casa.',
    13: 'Un pasaje «solo de ida» indica un viaje sin regreso planificado. Otras pistas apuntan a lo mismo: deja las llaves «donde su hermano las vería al llegar» y se lleva el calendario. El texto no habla de dinero ni de un acompañante.',
    14: 'El narrador aclara que «en la casa ya no quedaba nadie a quien despertar»: el cuidado ya no hace falta, es una costumbre de cuando la casa estaba habitada. El gesto muestra el apego de Rosa, no miedo ni apuro: cierra «despacio».',
    15: 'Es una inferencia global: se unen pistas de todo el texto. Rosa deja las llaves, no levanta la sábana del torno «de su padre», guarda el calendario detenido en marzo, lleva un pasaje «solo de ida» y la casa queda sin «nadie a quien despertar». Todo apunta a una despedida después de una pérdida.',
    16: 'Las palabras vecinas dan la pista: después de «terreno fértil», el texto explica que la mente «combina ideas que parecían no tener relación» y que de ahí «salen muchas de las ocurrencias que después llamamos buenas ideas». «Fértil» se usa en sentido figurado: productivo para las ideas.',
    17: 'Después de los dos puntos, el texto explica cuál es ese «costo»: «una atención cada vez más frágil, que se quiebra ante el primer aviso luminoso». Es una consecuencia negativa, por eso «perjuicio» mantiene el sentido. «Presupuesto» e «inversión» corresponden al sentido de dinero, que aquí no se usa.',
    18: 'Una tregua es una pausa temporal. El contexto lo confirma: la propuesta es hacerlo «durante media hora al día» y los ejemplos son momentos breves («caminar sin audífonos, esperar sin hacer nada»), no un abandono definitivo.',
    19: 'Una gotera es una molestia que se arregla sin demora. Con esa comparación el texto muestra cómo reaccionamos ante un minuto vacío: «lo tapamos con el teléfono». No habla de casas reales: la gotera es una imagen de la urgencia con que evitamos el silencio.',
    20: 'El texto explica enseguida qué hace la mente cuando vaga: «revisa recuerdos, ensaya conversaciones, combina ideas que parecían no tener relación». No se trata de caminar ni de flojear: aquí «vagar» es moverse libremente entre pensamientos.',
    21: 'El texto 1 dice lo que busca: «les escribimos para pedirles que apoyen la campaña» y, al final, «Les pedimos inscribir a su curso antes del viernes». No informa sobre los efectos de los celulares, no agradece ni explica reglas: pide una acción concreta.',
    22: 'Un propósito es explícito cuando el emisor declara abiertamente lo que busca. La frase «les escribimos para pedirles que apoyen la campaña» lo hace: nombra la acción (pedir) y lo pedido. Las otras frases entregan detalles de la campaña: materiales, fechas y lugar.',
    23: 'El texto 2 parte como una nota informativa, pero todo conduce a un producto: «Una de ellas es la lámpara Luna Calma», «Sus usuarios cuentan que se duermen antes» y «con un 20 % de descuento por lanzamiento». Los datos sobre el sueño preparan al lector para la oferta: el propósito implícito es promover la compra.',
    24: 'Un texto que solo informa no necesita vender. Aquí aparecen el nombre del producto («la lámpara Luna Calma»), el lugar de compra («en las principales tiendas») y una oferta («20 % de descuento por lanzamiento»). Esas pistas delatan la intención comercial; los estudios y el dato sobre las pantallas son el apoyo, no la meta.',
    25: 'Un hecho se puede comprobar: basta revisar el acta del consejo escolar para saber si la medida se aprobó «por nueve votos contra tres». Las otras alternativas son juicios personales y los delatan sus marcas: «Me parece», «Es injusto», «Yo creo».',
    26: 'Es un deseo y un juicio del autor: «Ojalá» expresa lo que él quisiera y «admirable» valora la medida. Nadie puede comprobar que un ejemplo sea admirable: se puede estar de acuerdo o no. Las otras tres afirmaciones se pueden verificar en el kiosco o en la encuesta.',
    27: 'Las tres palabras valoran: dicen qué le parece la medida al autor, no cómo es. Por eso el párrafo 2 es opinión: «la mejor decisión», «Es injusto», «francamente deliciosos». Otra persona podría decir lo contrario sin faltar a la verdad.',
    28: 'Un hecho no depende de si le conviene o no a quien escribe: depende de que se pueda comprobar. La baja de las ventas se verifica en los registros del kiosco. Tampoco basta con que lleve una cifra: un porcentaje inventado no es un hecho. Que el autor la incluya aunque no lo favorece muestra que un texto de opinión también se apoya en hechos.',
    29: '«Porque» introduce una causa: leemos más en pantallas debido a que «los teléfonos nos acompañan a todas partes». La segunda ventaja la agrega otro conector, «Además», que es de adición.',
    30: '«Sin embargo» es un conector de contraste. El párrafo 1 presenta ventajas de la pantalla y el párrafo 2 cambia de dirección: «leer en pantalla no es lo mismo que leer en papel». El conector avisa al lector que viene una idea opuesta.',
    31: '«Por lo tanto» indica consecuencia: como «llegan avisos y mensajes a cada rato», entonces «cuesta más mantener la atención». «Por ende» expresa la misma relación. «No obstante» es de contraste, «ya que» es de causa y «asimismo» es de adición.',
    32: '«En suma» es un conector de conclusión: anuncia que el autor va a cerrar reuniendo lo dicho. Lo que sigue es su idea final: «ningún formato es mejor para todo».',
    33: 'El fragmento 1 cuenta acciones que se suceden en el tiempo: «salimos de Talca antes del amanecer», «A las nueve llegamos», «Al mediodía alcanzamos el mirador», «después de almorzar, bajamos». Las marcas de tiempo y los verbos de acción son propios de la secuencia narrativa.',
    34: 'En el fragmento 2 no ocurre nada: se muestra cómo es la laguna. Abundan los adjetivos y las ubicaciones: «pequeña y casi redonda», «de un verde oscuro», «rocas cubiertas de musgo», «En la orilla norte». Eso es describir.',
    35: 'El fragmento 2 muestra los rasgos de una laguna concreta («pequeña y casi redonda»): es descriptivo. El fragmento 3 explica un proceso que vale para muchas lagunas: «se forma cuando un glaciar retrocede y deja una depresión en el terreno». Explicar un tema es propio de la secuencia expositiva.',
    36: 'El fragmento 4 defiende una opinión: «El parque debería limitar el número de visitantes por día». Luego la apoya con razones: «los senderos se erosionan y la basura se acumula». Una postura más sus razones es la base de la secuencia argumentativa.',
    37: 'El prefijo «sub-» significa debajo y la raíz «terr-» remite a la tierra: «subterráneas» son las aguas que están bajo la tierra. El texto lo confirma al empezar: «Bajo nuestros pies corre agua que casi nunca vemos».',
    38: 'El prefijo in- niega y el sufijo -able indica posibilidad: «inagotable» es lo que no se puede agotar. El texto corrige esa creencia enseguida: «Hoy sabemos que no lo es», porque se extrae más agua de la que se repone.',
    39: 'El prefijo re- indica repetición: «reutilizar» es volver a usar. En el texto, el agua que ya pasó por «duchas y lavamanos» se ocupa otra vez «para regar plazas».',
    40: 'La palabra se descompone en im- (negación), pre- (antes), la raíz vis- (ver) y -ible (que se puede): lo «imprevisible» es lo que no se puede ver antes de que ocurra, es decir, anticipar. La oración siguiente lo retoma: «Prever con exactitud cuánto lloverá no es posible». La alternativa B corresponde a «invisible», que no lleva el prefijo pre-.',
    41: 'El párrafo 1 parte con su idea principal: «la ciencia todavía discute para qué». Después presenta la explicación antigua y la descarta con «Sin embargo»: la frecuencia de los bostezos «no cambiaba». La alternativa A repite justamente la creencia que el párrafo desmiente.',
    42: 'El conector «Por ejemplo» avisa que lo que sigue ilustra la idea. Al resumir se conserva la hipótesis (bostezar ayuda a «enfriar el cerebro») y se elimina el caso de la «compresa fría en la frente». Las otras alternativas son la hipótesis y su explicación.',
    43: 'Un buen resumen es fiel, breve y claro. La alternativa C reúne las ideas del párrafo: el bostezo «se contagia», ese contagio es más frecuente «entre familiares y amigos» y por eso se lo relaciona «con la empatía». A se queda con un detalle, B cambia lo que dice el texto y D habla de otro asunto.',
    44: 'El resumen fiel recoge la idea principal de cada párrafo, en orden: no hay certeza y la explicación del oxígeno se descartó (párrafo 1), se estudia la hipótesis de enfriar el cerebro (párrafo 2) y el bostezo se contagia más entre cercanos (párrafo 3). B afirma como cierto lo que el texto descarta, C se queda en un ejemplo y agrega información que no está, y D nombra los experimentos, pero no dice qué se averiguó con ellos.'
};

module.exports = { key, feedback };
