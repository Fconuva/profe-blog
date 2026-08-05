(function () {
  const text = (id, tipo, subtipo, titulo, fuente, contenido, preguntas, extra) => ({
    id, tipo, subtipo, titulo, fuente, contenido, preguntas, ...(extra || {})
  });

  const option = (l, t, tipo) => ({ l, t, tipo });
  const item = (id, n, texto, hab, nivel, enun, correcta, ops, evidencia, justificacion) => ({
    id, n, texto, hab, nivel, enun, correcta, ops, evidencia, justificacion
  });

  const TEXTS = [
    text(
      't1',
      'Literario',
      'Poema',
      'Todavía hay luz',
      'Poema original elaborado para fines evaluativos.',
      `
        <div class="poema">
          <p>Traigo la tarde doblada en los hombros,<br>
          polvo del bus, dos monedas, una llave.<br>
          Abro despacio: la casa no pregunta<br>
          por qué regreso con los pasos tarde.</p>

          <p>Dejo el día colgado en un clavo,<br>
          junto a la chaqueta que huele a calle.<br>
          Detrás del muro un vecino cierra un cajón<br>
          y alguien revuelve una sopa en otra parte.</p>

          <p>Todavía hay luz, dice la ventana,<br>
          aunque el invierno borre los tejados.<br>
          Todavía hay luz en la taza despareja,<br>
          en el mantel que guarda antiguas manchas.</p>

          <p>No es una fiesta. Nadie alza banderas.<br>
          Solo la llave cumple con su oficio,<br>
          la mesa recibe mis manos frías<br>
          y el silencio se sienta sin hacer ruido.</p>

          <p>Todavía hay luz, repite la ventana.<br>
          Yo no le discuto. Dejo que la noche<br>
          encuentre cada cosa en su lugar<br>
          y me encuentre a mí, por fin, adentro.</p>
        </div>`,
      [1, 2, 3, 4, 5]
    ),
    text(
      't2',
      'Literario y no literario',
      'Cuento y reseña',
      'La lista del ascensor',
      'Cuento y reseña originales elaborados para fines evaluativos.',
      `
        <article class="subtexto">
          <h4>La lista del ascensor</h4>
          <p><span class="pnum">1</span>La tormenta había cortado la electricidad poco antes de las siete. Cuando Mauro entró al edificio, las puertas del ascensor permanecían abiertas y oscuras, como una boca que hubiera olvidado cerrarse. Su madre, encargada del inmueble, estaba junto al mesón de conserjería con una linterna entre los dientes y una hoja apoyada sobre el libro de visitas.</p>

          <p><span class="pnum">2</span>En la hoja había anotado los números de los departamentos y, al lado, pequeñas tareas: avisar que la luz de emergencia duraría pocas horas, confirmar que nadie hubiese quedado esperando el ascensor y preguntar si en los pisos altos necesitaban bajar algo. Mauro dejó su mochila en el suelo. Había quedado de ver el segundo tiempo del partido en la casa de Julián, donde sí funcionaba un generador.</p>

          <p><span class="pnum">3</span>Su madre le entregó la lista. Le pidió que comenzara por el duodécimo piso y descendiera por la escalera. Mauro miró la hora y calculó cuánto demoraría si golpeaba cada puerta una sola vez. Subió alumbrándose con el teléfono, más pendiente de los minutos que de los nombres escritos junto a cada número.</p>

          <p><span class="pnum">4</span>En el piso doce encontró a don Álvaro tratando de leer el aviso pegado junto al ascensor. No había oído el mensaje que dieron por el citófono antes del corte y había salido con una bolsa de basura pensando que la máquina aún funcionaba. Mauro le explicó la situación. El hombre volvió a su departamento y reapareció con una lámpara a pilas que podía prestar al pasillo.</p>

          <p><span class="pnum">5</span>En el décimo, una niña sostenía la puerta mientras su padre bajaba dos bidones vacíos. En el octavo, la señora Nora preguntó si la bomba de agua seguiría funcionando durante la noche. Mauro no sabía la respuesta, así que escribió la duda al margen. En el séptimo, dos vecinos ya habían instalado una mesa en el descanso con velas, vasos y un termo. Le ofrecieron té. Él dijo que no, pero dejó de mirar la hora.</p>

          <p><span class="pnum">6</span>La lista empezó a llenarse con indicaciones que su madre no había previsto: una radio disponible en el 63, pilas en el 52, una familia que podía calentar agua en una cocina a gas y un coche de guagua que debía quedar abajo antes de que la escalera se oscureciera más. Mauro comprendió que la hoja no servía solo para registrar problemas. También mostraba lo que cada persona podía aportar.</p>

          <p><span class="pnum">7</span>En el cuarto piso se cruzó con Julián, que bajaba acompañado de su hermano. Le dijo que el partido ya había comenzado y que todavía alcanzaban a verlo. Mauro miró la lista, luego el tramo de escalera que faltaba. Respondió que iría después. Cuando llegó al primer piso, ya se escuchaba la radio del departamento 63 transmitiendo el encuentro para quienes se habían reunido en los descansos.</p>

          <p><span class="pnum">8</span>Su madre leyó las nuevas anotaciones y comenzó a organizar los apoyos. Mauro tomó el lápiz antes de devolverle la hoja. En el último espacio libre escribió: “12, Mauro: le falta aprender los nombres”. Luego pegó la lista junto al ascensor. Aunque la electricidad regresó una hora más tarde, nadie la retiró esa noche.</p>
        </article>

        <article class="subtexto resena">
          <h4>Reseña: Un edificio dibujado desde adentro</h4>
          <p><span class="pnum">1</span>En “La lista del ascensor”, un corte de electricidad altera una rutina mínima y obliga al protagonista a recorrer un edificio que conocía solo por sus números. El cuento evita convertirlo en un héroe. Mauro empieza con una tarea sencilla y bastante impaciencia; su transformación ocurre mientras descubre trabajos, necesidades y recursos que habitualmente permanecen detrás de las puertas.</p>

          <p><span class="pnum">2</span>La lista funciona como un segundo plano del edificio. El primero ordena pisos y departamentos; el nuevo registra vínculos: quién necesita información, quién puede prestar una lámpara, quién dispone de una radio. Así, la oscuridad cumple una función paradójica, pues vuelve visibles relaciones que la normalidad mantenía ocultas.</p>

          <p><span class="pnum">3</span>Entre los temas del relato destacan el trabajo cotidiano que suele pasar inadvertido, el aprendizaje de mirar a quienes comparten un espacio y la pertenencia entendida como responsabilidad. El cierre no afirma que Mauro ya conozca a todos. Su anotación reconoce precisamente lo contrario y, por eso, resulta convincente: el cambio comienza cuando identifica aquello que todavía le falta aprender.</p>
        </article>`,
      [6, 7, 8, 9, 10]
    ),
    text(
      't3',
      'No literario',
      'Columna de opinión',
      'El recreo también necesita lugares tranquilos',
      'Columna original elaborada para fines evaluativos.',
      `
        <p class="bajada">Una escuela que ofrece distintas maneras de descansar no reduce la convivencia. La vuelve posible para más estudiantes.</p>
        <p><span class="pnum">1</span>Durante mucho tiempo hemos imaginado el recreo como el momento en que todo el mundo debe correr, conversar en grupo o participar en algún juego. Quien se sienta a mirar, dibuja en una libreta o busca un rincón silencioso suele recibir una pregunta que parece inocente: “¿Por qué estás solo?”. La pregunta supone que existe una única forma correcta de descansar y que apartarse por unos minutos equivale necesariamente a quedar excluido.</p>

        <p><span class="pnum">2</span>Las escuelas deberían ofrecer, junto a las canchas y los patios activos, espacios donde sea posible pasar el recreo con menos ruido. Puede ser un sector de la biblioteca, un corredor con bancos o un pequeño patio sin balones. Las canchas y los juegos deben mantenerse disponibles. Al sumar otras opciones, más estudiantes pueden usar la pausa de acuerdo con lo que necesitan para volver a clases.</p>

        <p><span class="pnum">3</span>Hay estudiantes que llegan al recreo buscando conversación y movimiento. Otros necesitan bajar la intensidad antes de volver a concentrarse. También están quienes disfrutan alternar: un día juegan, otro día conversan y otro prefieren leer. Si todos deben usar la pausa del mismo modo, el recreo deja de ser una pausa y se convierte en una actividad obligatoria más.</p>

        <p><span class="pnum">4</span>El argumento contrario suele afirmar que habilitar zonas tranquilas fomentaría el aislamiento. Sin embargo, esa conclusión confunde silencio con desconexión. Dos estudiantes pueden compartir una mesa de ajedrez sin gritar; cuatro pueden intercambiar historietas; alguien puede sentarse a solas y volver después a su curso con más disposición para conversar. ¿Por qué llamar antisocial a una persona solo porque no participa del juego más visible?</p>

        <p><span class="pnum">5</span>En una escuela que visité, un grupo pidió usar durante los recreos un pasillo que terminaba en un ventanal. Al principio colocaron tres bancos y una caja con revistas. Semanas después, el lugar reunía a estudiantes de cursos distintos que antes no se conocían. Algunos conversaban; otros reparaban cartas de un juego o simplemente miraban el patio. El espacio tranquilo no eliminó la convivencia. Creó una forma diferente de ella.</p>

        <p><span class="pnum">6</span>Por supuesto, una zona de calma necesita reglas: no puede transformarse en castigo, escondite para evitar conflictos ni privilegio de un grupo. Debe ser accesible, estar acompañada por adultos y convivir con las demás alternativas. Esas condiciones, lejos de invalidar la propuesta, muestran que cualquier espacio escolar requiere cuidado y propósito.</p>

        <p><span class="pnum">7</span>Diseñar patios diversos transmite una idea sencilla: las personas recuperan energía de maneras distintas. Una escuela que reconoce esa diferencia enseña también a observar las necesidades ajenas. Descansar, cuando permite regresar mejor al encuentro con otros, también es una forma de participar.</p>`,
      [11, 12, 13, 14, 15, 16, 17]
    ),
    text(
      't4',
      'Literario',
      'Obra dramática',
      'El andén',
      'Fragmento dramático original elaborado para fines evaluativos.',
      `
        <div class="acotacion">Antigua estación ferroviaria de un pueblo. El edificio está siendo acondicionado como biblioteca comunitaria. Al centro permanece un mesón de madera con pequeñas marcas y fechas grabadas. Sobre él hay una campana de bronce. Por una puerta lateral entran polvo y luz.</div>

        <p><strong>PERSONAJES:</strong> JULIA, antigua encargada de la estación; SAMUEL, carpintero e hijo de Julia; INÉS, estudiante voluntaria; MARCO, arquitecto municipal.</p>

        <p><strong>SAMUEL.</strong> <span class="acotacion">(Midiendo el espacio entre el mesón y la pared.)</span> Noventa y cuatro centímetros. Con las cajas puestas, va a quedar menos.</p>
        <p><strong>MARCO.</strong> La ruta accesible necesita un paso continuo. Si el mesón se queda entero, una silla de ruedas no podrá llegar a la sala del fondo.</p>
        <p><strong>JULIA.</strong> Durante cuarenta años todo el mundo llegó hasta aquí.</p>
        <p><strong>MARCO.</strong> Llegó hasta la ventanilla, Julia. La biblioteca necesita que las personas puedan cruzar al otro lado.</p>
        <p><strong>JULIA.</strong> Eso dicen ahora: “al otro lado”. Como si este lado no hubiera servido nunca.</p>

        <p><strong>INÉS.</strong> Encontré otra caja de horarios. Hay uno de 1987 y otro escrito a mano.</p>
        <p><strong>JULIA.</strong> El escrito a mano es mío. Cuando se atrasaba el tren de la costa, cambiábamos la hora con tiza.</p>
        <p><strong>SAMUEL.</strong> Mamá, nadie está botando los horarios. Estamos hablando del mesón.</p>
        <p><strong>JULIA.</strong> El mesón es la estación.</p>
        <p><strong>SAMUEL.</strong> No. La estación es el edificio, la gente que pasó por aquí, el pueblo que creció alrededor. Ese mueble es pesado y está comido por la humedad.</p>
        <p><strong>JULIA.</strong> También tú estás más pesado y no te saco por la puerta.</p>

        <div class="acotacion">Inés contiene una risa. Samuel deja la huincha de medir sobre el mesón.</div>

        <p><strong>MARCO.</strong> Podemos guardar una sección en la sala histórica. El resto de la madera se reutiliza en repisas.</p>
        <p><strong>JULIA.</strong> Una sección. Como guardar una oreja y decir que conservamos a la persona.</p>
        <p><strong>SAMUEL.</strong> Lo que no podemos hacer es convertir la memoria en un obstáculo.</p>
        <p><strong>JULIA.</strong> Y lo que no pueden hacer ustedes es llamar obstáculo a todo lo que estaba antes.</p>

        <div class="acotacion">Julia toma la campana y la hace sonar. El golpe metálico se prolonga en la sala vacía. Los otros guardan silencio.</div>

        <p><strong>JULIA.</strong> Sonaba cinco minutos antes de cada salida. La gente recogía bolsos, despedidas, gallinas, lo que trajera. Después quedaba este mismo silencio, pero era distinto. Era un silencio que esperaba.</p>
        <p><strong>INÉS.</strong> ¿Y si el mesón también pudiera esperar otra cosa?</p>
        <p><strong>JULIA.</strong> Los muebles no esperan.</p>
        <p><strong>INÉS.</strong> Usted acaba de decir que la sala sí.</p>

        <p><strong>SAMUEL.</strong> <span class="acotacion">(A Inés.)</span> ¿Qué propones?</p>
        <p><strong>INÉS.</strong> Abrir un paso aquí, donde la madera ya está dañada. Con el tramo que saquemos se puede construir una mesa baja. El resto queda en su lugar, pero la ventanilla se transforma en mesón de préstamo.</p>
        <p><strong>MARCO.</strong> Si el corte tiene un metro veinte, funciona. También podemos redondear los bordes y reforzar la base.</p>
        <p><strong>SAMUEL.</strong> La madera alcanza para la mesa y dos bancos pequeños.</p>
        <p><strong>JULIA.</strong> Todos muy rápidos para repartirse un cadáver.</p>

        <p><strong>INÉS.</strong> No sería un cadáver si la gente vuelve a usarlo.</p>
        <p><strong>JULIA.</strong> Una estación muere cuando nadie espera nada.</p>
        <p><strong>INÉS.</strong> Entonces que aquí esperen un libro, una conversación, que deje de llover. No será un tren, pero tampoco será nada.</p>

        <div class="acotacion">Julia recorre con el dedo las marcas de la cubierta. Se detiene en una fecha encerrada en un círculo.</div>

        <p><strong>JULIA.</strong> Esta no se corta.</p>
        <p><strong>SAMUEL.</strong> ¿Cuál?</p>
        <p><strong>JULIA.</strong> La del ochenta y nueve. Ese día tu padre llegó con una maleta que no era suya y la devolvió antes de saludarme. Pensé que era el hombre más serio del mundo.</p>
        <p><strong>SAMUEL.</strong> Después lo conociste mejor.</p>
        <p><strong>JULIA.</strong> Bastante mejor.</p>

        <p><strong>MARCO.</strong> Podemos mover el corte veinte centímetros. La marca queda completa.</p>
        <p><strong>JULIA.</strong> Y la campana se queda sobre el mesón.</p>
        <p><strong>SAMUEL.</strong> Siempre que no la hagas sonar cada vez que alguien se atrase con un libro.</p>
        <p><strong>JULIA.</strong> No prometo nada.</p>

        <div class="acotacion">Samuel marca con lápiz una línea sobre la zona húmeda. Antes de que continúe, Julia toma la huincha y corrige uno de los extremos. Inés coloca un libro abierto junto al antiguo horario de trenes.</div>

        <p><strong>INÉS.</strong> Así caben los dos tiempos.</p>
        <p><strong>JULIA.</strong> <span class="acotacion">(Observa el libro y el horario.)</span> Veremos si la gente aprende a esperar sin mirar las vías.</p>
      `,
      [18, 19, 20, 21, 22, 23, 24]
    ),
    text(
      't5',
      'No literario',
      'Campaña de interés público',
      'Antes de compartir, verifica',
      'Campaña escolar original basada en orientaciones de alfabetización mediática de UNESCO.',
      `
        <div class="campana" aria-label="Campaña Antes de compartir, verifica">
          <div class="campana-arte">
            <img src="campana_verifica_ia.png" alt="Un teléfono rodeado por flechas de reenvío que son detenidas por una lupa" />
            <div class="post-viral">
              <span>PUBLICACIÓN VIRAL</span>
              <strong>“Lo compartieron miles.<br>Debe ser verdad”.</strong>
            </div>
          </div>
          <div class="campana-copy">
            <p class="campana-kicker">PAUSA LA CADENA</p>
            <h4>Antes de compartir,<br><em>verifica</em></h4>
            <p>Una publicación repetida muchas veces puede seguir siendo falsa. Antes de reenviarla, revisa:</p>
            <ol>
              <li><strong>Quién</strong> la publica.</li>
              <li><strong>Cuándo</strong> apareció.</li>
              <li><strong>Qué fuente</strong> presenta.</li>
            </ol>
            <p>Si el mensaje busca asustarte o apurarte para que lo compartas, esa urgencia también merece revisión.</p>
            <div class="llamada">Comparte información, no impulsos.</div>
          </div>
        </div>
        <p class="fuente-campana">Campaña escolar de ciudadanía digital. Orientaciones consultadas: UNESCO, alfabetización mediática e informacional.</p>`,
      [25, 26, 27, 28],
      { visual: true }
    ),
    text(
      't6',
      'Literario',
      'Cuento',
      'La pieza de repuesto',
      'Cuento original elaborado para fines evaluativos.',
      `
        <p><span class="pnum">1</span>Los sábados, Matías abría el taller antes que su tío Efraín terminara el primer café. Levantaba la cortina metálica, barría las hojas que se juntaban junto a la cuneta y ordenaba las bicicletas según el problema: frenos, cámaras, cadenas. Efraín decía que un taller empezaba a funcionar cuando cada ruido tenía un lugar.</p>

        <p><span class="pnum">2</span>A media mañana llegó Darío, un repartidor que Matías había visto varias veces cruzando el barrio con una caja cuadrada en la espalda. Caminaba junto a la bicicleta. El pedal derecho colgaba torcido y rozaba el suelo a cada paso.</p>

        <p><span class="pnum">3</span>Efraín examinó la pieza. La rosca de la biela seguía intacta, pero el eje del pedal se había partido. Explicó que podía instalar un par nuevo. Darío contó las monedas y los billetes que llevaba. Le alcanzaban para la revisión y una cámara barata, no para los pedales. Su turno comenzaba en menos de una hora y sin bicicleta no podía aceptar encargos.</p>

        <p><span class="pnum">4</span>“El lunes completo”, propuso. Efraín negó con la cabeza. En una libreta guardaba varias promesas parecidas, algunas tan antiguas que el lápiz empezaba a borrarse. No podía seguir abriendo cuentas. Darío asintió sin discutir y comenzó a empujar la bicicleta hacia la salida.</p>

        <p><span class="pnum">5</span>Matías recordó una caja bajo el banco de trabajo. Allí guardaban piezas retiradas de bicicletas que nadie había vuelto a buscar. Encontró un pedal derecho de aluminio, raspado y sin reflector, pero con la rosca en buen estado. Lo hizo girar entre los dedos: el rodamiento avanzaba parejo y no tenía juego.</p>

        <p><span class="pnum">6</span>Efraín lo observó desde la puerta. Dijo que una pieza usada también costaba trabajo: alguien debía revisarla, limpiarla e instalarla. Matías respondió que podía hacer esas tres cosas. Su tío le pasó un paño, grasa y la llave correspondiente. No dijo que sí, pero tampoco guardó el pedal.</p>

        <p><span class="pnum">7</span>Mientras Matías trabajaba, Darío sostuvo la bicicleta para que no se moviera. El pedal gris no combinaba con el izquierdo, que era negro y llevaba una franja naranja. Aun así, quedó firme. Efraín comprobó el apriete y le pidió a Darío que diera una vuelta corta por la vereda. La bicicleta regresó sin crujidos.</p>

        <p><span class="pnum">8</span>Darío se quitó la chaqueta impermeable y la dejó sobre el mesón. “Para que sepa que vuelvo”, dijo. Efraín tomó la prenda, pero la colgó inmediatamente en el manubrio. Le recordó que el cielo estaba oscureciendo y que una garantía no servía de mucho si dejaba al dueño empapado.</p>

        <p><span class="pnum">9</span>Luego abrió la libreta. Matías alcanzó a leer la palabra “deuda” antes de que su tío la tachara. En la línea siguiente escribió: “pedal recuperado, pago pendiente para el lunes”. Darío guardó el lápiz que Efraín le prestó, corrigió la hora de regreso y salió pedaleando.</p>

        <p><span class="pnum">10</span>Cuando la calle volvió a quedar vacía, Efraín empujó hacia Matías la caja de repuestos. Le pidió separar lo que todavía podía usarse de lo que ya era chatarra. “Hazlo con calma”, añadió. Matías escuchó girar entre sus manos cada pieza antes de decidir en qué montón dejarla.</p>`,
      [29, 30, 31, 32]
    ),
    text(
      't7',
      'No literario',
      'Reportaje',
      'Cuando la biblioteca aprende el camino',
      'Texto adaptado a partir de información del Servicio Nacional del Patrimonio Cultural y del Sistema Nacional de Bibliotecas Públicas, consultada el 21 de julio de 2026.',
      `
        <p class="bajada">Una nueva flota de bibliomóviles busca llevar lectura, conectividad y actividades culturales a territorios donde una biblioteca fija no siempre queda cerca.</p>

        <p><span class="pnum">1</span>El 16 de enero de 2026, una fila poco habitual ocupó parte de la Plaza de la Constitución, en Santiago. Los vehículos estacionados allí eran bibliotecas móviles preparadas para partir hacia distintas regiones del país. La nueva flota fue presentada por el Ministerio de las Culturas y el Servicio Nacional del Patrimonio Cultural como parte de una política destinada a ampliar el acceso a la lectura sin exigir que todas las personas lleguen primero a un edificio.</p>

        <p><span class="pnum">2</span>La iniciativa incorporó vehículos destinados a quince regiones y busca que exista al menos una biblioteca móvil de última generación en cada región. La elección no se hizo con un único modelo. Cada territorio participó en la selección del vehículo más conveniente para su clima y sus caminos. Por eso la flota incluye furgones y camiones con tracción 4x2 y 4x4, capaces de enfrentar recorridos donde aparecen nieve, barro o largas distancias entre localidades.</p>

        <p><span class="pnum">3</span>La ruta también forma parte de la biblioteca. Un vehículo que funciona bien en una ciudad no necesariamente sirve para llegar a una escuela cordillerana o a un poblado conectado por caminos de ripio. Adaptar el transporte permite que el servicio mantenga horarios y recorridos más estables, una condición decisiva para que el préstamo de libros no dependa de una visita excepcional.</p>

        <p><span class="pnum">4</span>Los nuevos móviles cuentan con paneles fotovoltaicos y baterías que permiten operar hasta ocho horas sin conexión eléctrica externa. Los camiones incorporan rampas plegables o elevadores hidráulicos para personas con movilidad reducida. También existen diferencias de capacidad: los furgones pueden transportar cerca de 1.500 ejemplares y los camiones, alrededor de 2.000, además de disponer de climatización, áreas de trabajo y conectividad.</p>

        <p><span class="pnum">5</span>Cada unidad comienza con una colección cercana a 380 libros. La selección considera distintas edades e intereses e incluye narrativa, poesía chilena, divulgación científica, patrimonio natural, memoria de pueblos originarios, manuales y textos informativos. Se agregan materiales para la mediación lectora, como láminas para contar historias mediante kamishibai. La intención es que el vehículo no sea únicamente un estante con ruedas, sino un lugar donde también ocurran conversaciones y actividades.</p>

        <p><span class="pnum">6</span>El modelo tiene una historia anterior a esta flota. A fines de la década de 1960 comenzó a funcionar el bibliobús de la Universidad de Chile, que se mantuvo operativo durante casi treinta años. En 1998 se crearon los Dibamóviles y, desde 2017, Chile celebra el Día del Bibliomóvil. La continuidad muestra que trasladar libros no ha sido una solución provisoria, sino una estrategia que ha cambiado junto con los territorios y la tecnología.</p>

        <p><span class="pnum">7</span>Al momento de presentarse la nueva etapa existían 53 servicios activos en la Red de Bibliomóviles. Cincuenta dependían administrativamente de municipios, lo que revela la importancia de la coordinación local para definir paradas, días y horarios. La red se conecta además con un sistema bibliotecario que en 2024 alcanzó presencia en 338 de las 346 comunas del país, equivalente a una cobertura comunal del 97,7 %.</p>

        <p><span class="pnum">8</span>No todos los servicios móviles han usado carreteras. En distintos momentos han existido bibliobuses, cajas viajeras, carros de préstamo, puestos instalados en ferias libres y una bibliolancha que recorre islas de Chiloé. También se ha utilizado una carretela en Rauco, en la Región del Maule. La variedad de medios responde a una misma pregunta: cómo acercar libros y actividades culturales a personas que viven lejos de una biblioteca o que no suelen ingresar a ella.</p>

        <p><span class="pnum">9</span>Durante la presentación de la flota se afirmó que “estos bibliomóviles no solo transportan libros”. La frase resume el desafío. El número de ejemplares importa, pero el servicio se vuelve biblioteca cuando construye una relación reconocible con sus usuarios: vuelve a la misma localidad, conoce sus intereses, recibe devoluciones y abre un espacio para leer, preguntar o encontrarse. En este modelo, el camino no separa a la biblioteca de la comunidad. Es el medio por el cual ambas llegan a reunirse.</p>`,
      [33, 34, 35, 36, 37, 38],
      {
        referencias: [
          'https://www.patrimoniocultural.gob.cl/noticias/ministerio-de-las-culturas-inaugura-moderna-flota-de-bibliomoviles-para-garantizar-el',
          'https://www.patrimoniocultural.gob.cl/servicios-moviles',
          'https://www.bibliotecaspublicas.gob.cl/publicaciones/informe-de-gestion-2024-sistema-nacional-de-bibliotecas-publicas'
        ]
      }
    )
  ];

  const QUESTIONS = [
    item('q1', 1, 't1', 'INTERPRETAR', 'Adecuado', '¿Qué sugiere el verso “Dejo el día colgado en un clavo”?', 'C', [
      option('A', 'Que la tarde permanece inmóvil dentro de la casa.', 'Literalización'),
      option('B', 'Que la hablante desea que la tarde avance con mayor lentitud.', 'Sobregeneralización'),
      option('C', 'Que la hablante deja atrás el cansancio al llegar.', 'Clave'),
      option('D', 'Que la hablante ordena sus pertenencias antes de dormir.', 'Dato cercano')
    ], 'Estrofa 2: el día queda junto a la chaqueta que “huele a calle”.', 'La acción figurada representa el abandono momentáneo de la carga acumulada durante la jornada.'),

    item('q2', 2, 't1', 'INTERPRETAR', 'Adecuado', '¿Qué estado de ánimo predomina en el poema?', 'A', [
      option('A', 'Una serenidad que se construye después del cansancio.', 'Clave'),
      option('B', 'Una tristeza causada por regresar a una casa vacía.', 'Inferencia parcial'),
      option('C', 'Una inquietud producida por los sonidos de los vecinos.', 'Cambio de foco'),
      option('D', 'Una alegría intensa por reencontrarse con otras personas.', 'Intensificación')
    ], 'La casa recibe a la hablante y al final ella se reconoce “por fin, adentro”.', 'La voz pasa del peso de la jornada a una calma doméstica sobria, sin celebración intensa.'),

    item('q3', 3, 't1', 'REFLEXIONAR', 'Adecuado', '¿Cuál es el tema principal del poema?', 'B', [
      option('A', 'La dificultad de convivir con ruidos ajenos al terminar el día.', 'Cambio de foco'),
      option('B', 'El hogar cotidiano como refugio frente al desgaste diario.', 'Clave'),
      option('C', 'La necesidad de conservar objetos antiguos dentro de una casa.', 'Literalización'),
      option('D', 'El paso del invierno como causa de la soledad de la hablante.', 'Causalidad falsa')
    ], 'Las imágenes de la llave, la mesa, la taza y la luz construyen el regreso como amparo.', 'El sentido global relaciona el cansancio exterior con la acogida sencilla del espacio doméstico.'),

    item('q4', 4, 't1', 'LOCALIZAR', 'Elemental', '¿Qué sonido escucha la hablante detrás del muro?', 'A', [
      option('A', 'El cierre de un cajón en la vivienda vecina.', 'Clave'),
      option('B', 'El hervor de una sopa sobre una cocina cercana.', 'Dato vecino'),
      option('C', 'El movimiento de una llave dentro de una puerta.', 'Asociación textual'),
      option('D', 'El ruido del bus que se aleja por la calle.', 'Invención plausible')
    ], 'Estrofa 2: “Detrás del muro un vecino cierra un cajón”.', 'La información aparece explícita y compite con otros sonidos u objetos mencionados en el poema.'),

    item('q5', 5, 't1', 'REFLEXIONAR', 'Adecuado', '¿Qué función cumple la repetición de “Todavía hay luz”?', 'D', [
      option('A', 'Precisar el momento aproximado del día en que la hablante regresó a su casa.', 'Función parcial'),
      option('B', 'Sugerir que la ventana continuará encendida durante la noche.', 'Literalización'),
      option('C', 'Contrastar la casa iluminada con la oscuridad de los vecinos.', 'Comparación inexistente'),
      option('D', 'Reforzar la persistencia de un amparo modesto en medio del desgaste.', 'Clave')
    ], 'La frase aparece junto a objetos cotidianos y vuelve antes del reconocimiento final.', 'La repetición sostiene el motivo de una luz pequeña que resiste al invierno y al cansancio.'),

    item('q6', 6, 't2', 'LOCALIZAR', 'Elemental', '¿Qué tarea le entrega la madre a Mauro al comienzo del cuento?', 'C', [
      option('A', 'Reunir velas y termos para instalarlos en cada descanso.', 'Dato posterior'),
      option('B', 'Acompañar a don Álvaro hasta el primer piso del edificio.', 'Acción posterior'),
      option('C', 'Recorrer los pisos para informar y comprobar necesidades.', 'Clave'),
      option('D', 'Buscar un generador que permitiera encender el ascensor.', 'Invención plausible')
    ], 'Párrafos 2 y 3: recibe una lista y debe comenzar por el duodécimo piso.', 'La tarea combina avisar sobre el corte, revisar el ascensor y preguntar por necesidades.'),

    item('q7', 7, 't2', 'INTERPRETAR', 'Adecuado', '¿Por qué Mauro agrega su propio departamento al final de la lista?', 'C', [
      option('A', 'Porque quiere recibir una lámpara antes del próximo corte.', 'Motivo inventado'),
      option('B', 'Porque descubre que su madre olvidó registrar el piso doce.', 'Literalización'),
      option('C', 'Porque reconoce que él también desconocía a sus vecinos.', 'Clave'),
      option('D', 'Porque desea dejar constancia de que completó el recorrido.', 'Cambio de propósito')
    ], 'Párrafo 8: “12, Mauro: le falta aprender los nombres”.', 'La anotación expresa autocrítica y muestra el cambio desde la prisa hacia el reconocimiento de los demás.'),

    item('q8', 8, 't2', 'REFLEXIONAR', 'Adecuado', '¿Qué función cumple la oscuridad en el desarrollo del cuento?', 'D', [
      option('A', 'Explicar por qué los vecinos deciden abandonar el edificio.', 'Consecuencia inexistente'),
      option('B', 'Convertir el recorrido de Mauro en una experiencia peligrosa.', 'Sobredramatización'),
      option('C', 'Demostrar que el edificio no contaba con medidas de emergencia.', 'Conclusión parcial'),
      option('D', 'Hacer visibles vínculos que la rutina mantenía ocultos.', 'Clave')
    ], 'Reseña, párrafo 2: la oscuridad “vuelve visibles relaciones”.', 'El corte obliga a recorrer, preguntar y descubrir apoyos que ya existían, pero no eran percibidos.'),

    item('q9', 9, 't2', 'INTERPRETAR', 'Adecuado', 'Según la reseña, ¿por qué la lista funciona como un “segundo plano” del edificio?', 'C', [
      option('A', 'Porque corrige la numeración equivocada de varios departamentos.', 'Invención plausible'),
      option('B', 'Porque indica las salidas que deben usarse durante una emergencia.', 'Cambio de foco'),
      option('C', 'Porque representa necesidades y apoyos, además de ubicaciones.', 'Clave'),
      option('D', 'Porque reemplaza el plano que dejó de funcionar con la electricidad.', 'Literalización')
    ], 'Reseña, párrafo 2: el nuevo plano registra “vínculos”.', 'La metáfora contrapone la distribución física con una red social de necesidades y aportes.'),

    item('q11', 11, 't3', 'LOCALIZAR', 'Elemental', '¿Qué espacio tranquilo se menciona como ejemplo en la columna?', 'A', [
      option('A', 'Un corredor con bancos para pasar el recreo.', 'Clave'),
      option('B', 'Una sala cerrada para trabajar sin compañía.', 'Distorsión'),
      option('C', 'Una cancha reservada para actividades silenciosas.', 'Combinación falsa'),
      option('D', 'Un comedor usado para leer revistas durante la pausa.', 'Invención plausible')
    ], 'Párrafo 2: “un sector de la biblioteca, un corredor con bancos o un pequeño patio”.', 'La alternativa reproduce uno de los espacios propuestos de manera explícita.'),

    item('q12', 12, 't3', 'INTERPRETAR', 'Adecuado', '¿Cuál es la tesis principal de la columna?', 'D', [
      option('A', 'Las bibliotecas escolares deberían abrir sectores de lectura en los recreos.', 'Propuesta parcial'),
      option('B', 'Los juegos ruidosos suelen dificultar la convivencia entre estudiantes.', 'Generalización'),
      option('C', 'Cada estudiante debería escoger un solo modo de usar sus recreos.', 'Inversión'),
      option('D', 'Las escuelas deberían ofrecer formas diversas de descansar en el recreo.', 'Clave')
    ], 'Párrafos 2 y 7: se propone ampliar opciones y reconocer diferentes formas de recuperar energía.', 'La tesis no elimina el juego activo, sino que defiende la coexistencia de alternativas.'),

    item('q13', 13, 't3', 'INTERPRETAR', 'Adecuado', '¿Qué función cumple el ejemplo del pasillo con bancos y revistas?', 'D', [
      option('A', 'Mostrar una preferencia general por las actividades silenciosas.', 'Sobregeneralización'),
      option('B', 'Mostrar que los patios escolares suelen estar mal construidos.', 'Cambio de foco'),
      option('C', 'Explicar por qué el ajedrez debe reemplazar a los juegos de pelota.', 'Falsa sustitución'),
      option('D', 'Mostrar que un espacio tranquilo también puede generar convivencia.', 'Clave')
    ], 'Párrafo 5: el lugar reunió a estudiantes de distintos cursos.', 'El caso concreto respalda la tesis y refuta la idea de que tranquilidad equivale a aislamiento.'),

    item('q14', 14, 't3', 'INTERPRETAR', 'Elemental', '¿Para qué la autora aclara que “Las canchas y los juegos deben mantenerse disponibles”?', 'A', [
      option('A', 'Para precisar que propone sumar opciones y no eliminar las existentes.', 'Clave'),
      option('B', 'Para admitir que los espacios tranquilos podrían resultar innecesarios.', 'Concesión exagerada'),
      option('C', 'Para defender que cada recreo tenga actividades dirigidas por adultos.', 'Cambio de propuesta'),
      option('D', 'Para afirmar que el silencio favorece más que el movimiento al aprendizaje.', 'Jerarquía inexistente')
    ], 'Párrafo 2: “Las canchas y los juegos deben mantenerse disponibles. Al sumar otras opciones...”.', 'La aclaración anticipa una objeción y delimita el alcance real de la propuesta.'),

    item('q15', 15, 't3', 'INTERPRETAR', 'Adecuado', '¿Qué sostiene la autora al distinguir silencio de desconexión?', 'A', [
      option('A', 'Que una interacción puede ser social aunque no sea ruidosa.', 'Clave'),
      option('B', 'Que la conversación impide descansar durante los recreos.', 'Inversión'),
      option('C', 'Que permanecer a solas suele mejorar la disposición para aprender.', 'Generalización'),
      option('D', 'Que los juegos visibles producen aislamiento entre distintos cursos.', 'Causalidad falsa')
    ], 'Párrafo 4: se describen actividades compartidas y momentos individuales compatibles con la convivencia.', 'La autora cuestiona que solo las conductas visibles o ruidosas cuenten como participación.'),

    item('q16', 16, 't3', 'REFLEXIONAR', 'Adecuado', '¿Qué falla presenta la idea de que quien no juega durante el recreo necesariamente se aísla?', 'D', [
      option('A', 'Usa una experiencia individual como si fuera una medición estadística.', 'Falla distinta'),
      option('B', 'Cita una fuente cuya autoridad no se relaciona con el tema escolar.', 'Falla inexistente'),
      option('C', 'Confunde el orden temporal de dos acontecimientos independientes.', 'Falla distinta'),
      option('D', 'Reduce las posibilidades a jugar activamente o quedar desconectado.', 'Clave')
    ], 'Párrafos 1 y 4: el texto muestra formas de convivencia que no dependen del juego visible.', 'La afirmación construye una falsa disyuntiva al excluir alternativas intermedias.'),

    item('q17', 17, 't3', 'REFLEXIONAR', 'Adecuado', '¿Qué función cumple la afirmación final de que descansar “también es una forma de participar”?', 'C', [
      option('A', 'Presentar una excepción que limita la propuesta desarrollada.', 'Cambio de función'),
      option('B', 'Repetir el ejemplo del pasillo tranquilo descrito anteriormente.', 'Reiteración parcial'),
      option('C', 'Cerrar la columna vinculando el descanso con la convivencia posterior.', 'Clave'),
      option('D', 'Sustituir la tesis por una defensa del aislamiento individual.', 'Contrasentido')
    ], 'Párrafo 7: descansar permite “regresar mejor al encuentro con otros”.', 'La frase cierra la columna vinculando el cuidado personal con una participación posterior más disponible.'),

    item('q18', 18, 't4', 'LOCALIZAR', 'Elemental', '¿Por qué el mesón debe ser retirado o modificado?', 'D', [
      option('A', 'Porque la madera no puede reutilizarse en una biblioteca.', 'Negación falsa'),
      option('B', 'Porque impide observar la antigua ventanilla de la estación.', 'Invención plausible'),
      option('C', 'Porque Julia quiere trasladarlo completo a la sala histórica.', 'Inversión'),
      option('D', 'Porque obstaculiza la ruta accesible hacia la sala del fondo.', 'Clave')
    ], 'Inicio: Marco explica que una silla de ruedas no podría cruzar al otro lado.', 'La necesidad explícita de accesibilidad origina la discusión sobre el mueble.'),

    item('q19', 19, 't4', 'INTERPRETAR', 'Adecuado', '¿Qué revela Julia cuando hace sonar la campana?', 'B', [
      option('A', 'Que desconfía de la capacidad técnica de Samuel y Marco.', 'Motivo inventado'),
      option('B', 'Que mantiene un vínculo emocional con la vida anterior del lugar.', 'Clave'),
      option('C', 'Que quiere reiniciar el servicio ferroviario antes de abrir la biblioteca.', 'Literalización'),
      option('D', 'Que recuerda con molestia los atrasos del antiguo tren de la costa.', 'Cambio emocional')
    ], 'La campana da paso al recuerdo de salidas, equipajes y un “silencio que esperaba”.', 'La acción trae el pasado al presente y muestra por qué Julia resiste una modificación puramente funcional.'),

    item('q20', 20, 't4', 'LOCALIZAR', 'Elemental', '¿Qué condición pone Julia antes de aceptar la modificación del mesón?', 'B', [
      option('A', 'Que la madera retirada se use para construir repisas en la biblioteca.', 'Condición ajena'),
      option('B', 'Que una fecha grabada permanezca completa y la campana se conserve.', 'Clave'),
      option('C', 'Que la ventanilla vuelva a usarse para vender pasajes.', 'Inversión'),
      option('D', 'Que la mesa baja se instale dentro de la sala histórica.', 'Ubicación inventada')
    ], 'Julia señala la fecha de 1989 y luego exige que la campana quede sobre el mesón.', 'Ambos elementos condensan recuerdos personales y el uso ferroviario del espacio.'),

    item('q21', 21, 't4', 'INTERPRETAR', 'Adecuado', '¿Cuál es el conflicto principal del fragmento?', 'A', [
      option('A', 'Cómo conservar la memoria del lugar sin impedir su nuevo uso.', 'Clave'),
      option('B', 'Quién debe dirigir la biblioteca una vez terminadas las obras.', 'Invención plausible'),
      option('C', 'Dónde guardar los horarios ferroviarios encontrados por Inés.', 'Problema secundario'),
      option('D', 'Cómo reparar la madera sin modificar la antigua ventanilla.', 'Reducción técnica')
    ], 'La discusión contrapone la preservación íntegra con la accesibilidad y culmina en una transformación acordada.', 'El conflicto integra la dimensión afectiva de Julia y la necesidad práctica del proyecto comunitario.'),

    item('q22', 22, 't4', 'INTERPRETAR', 'Adecuado', '¿Qué significa la frase “Una estación muere cuando nadie espera nada”?', 'C', [
      option('A', 'Que los trenes deberían regresar para justificar la restauración.', 'Literalización'),
      option('B', 'Que los recuerdos desaparecen cuando se cambia un mueble antiguo.', 'Generalización'),
      option('C', 'Que un espacio pierde sentido cuando deja de vincularse con las personas.', 'Clave'),
      option('D', 'Que la biblioteca fracasará si sus usuarios deben esperar libros.', 'Contrasentido')
    ], 'Inés responde proponiendo nuevas esperas: un libro, una conversación o el fin de la lluvia.', 'La frase permite pasar de la función ferroviaria a una función comunitaria sin eliminar la memoria.'),

    item('q23', 23, 't4', 'REFLEXIONAR', 'Adecuado', '¿Qué función cumple el gesto final de colocar un libro junto al horario de trenes?', 'B', [
      option('A', 'Demostrar que los horarios antiguos serán usados para ordenar préstamos.', 'Relación falsa'),
      option('B', 'Representar la convivencia entre la memoria y el nuevo uso del edificio.', 'Clave'),
      option('C', 'Indicar que Inés desconoce cuál de los objetos debe conservarse.', 'Inversión'),
      option('D', 'Anunciar que la biblioteca tendrá una sección dedicada a los ferrocarriles.', 'Proyección no sustentada')
    ], 'Inés afirma: “Así caben los dos tiempos”.', 'La disposición visual sintetiza el acuerdo alcanzado y el tema global del fragmento.'),

    item('q25', 25, 't5', 'LOCALIZAR', 'Elemental', '¿Qué tres elementos recomienda revisar la campaña?', 'C', [
      option('A', 'La imagen, el número de reenvíos y los comentarios.', 'Datos del ejemplo'),
      option('B', 'El título, la extensión del mensaje y su popularidad.', 'Criterios inventados'),
      option('C', 'La persona o entidad autora, la fecha y la fuente.', 'Clave'),
      option('D', 'La emoción producida, el formato y la cantidad de lectores.', 'Cambio de foco')
    ], 'La lista numerada indica: quién publica, cuándo apareció y qué fuente presenta.', 'La respuesta integra los tres pasos explícitos de verificación.'),

    item('q26', 26, 't5', 'INTERPRETAR', 'Adecuado', '¿Cuál es la postura central de la campaña?', 'D', [
      option('A', 'Las publicaciones muy compartidas deberían eliminarse de las redes.', 'Medida extrema'),
      option('B', 'Los mensajes urgentes constituyen el principal origen de la información falsa.', 'Generalización'),
      option('C', 'La forma más segura de informarse es evitar el contenido reenviado.', 'Sobregeneralización'),
      option('D', 'La información debe verificarse antes de volver a compartirla.', 'Clave')
    ], 'El título, los tres pasos y la llamada final convergen en la verificación previa.', 'La postura promueve una pausa crítica, no la eliminación de redes ni la desconfianza absoluta.'),

    item('q27', 27, 't5', 'REFLEXIONAR', 'Adecuado', '¿Qué efecto produce la lupa que detiene las flechas de reenvío?', 'A', [
      option('A', 'Representa una revisión crítica que interrumpe la difusión automática.', 'Clave'),
      option('B', 'Sugiere que la información digital debe mantenerse en secreto.', 'Sobregeneralización'),
      option('C', 'Muestra que las publicaciones falsas desaparecen al ser ampliadas.', 'Lectura literal'),
      option('D', 'Indica que los teléfonos bloquean mensajes cuando detectan urgencia.', 'Causalidad técnica falsa')
    ], 'La imagen combina una cadena de flechas con el instrumento visual de examen.', 'El recurso no solo ilustra el tema, sino que vuelve visible la idea de pausar y comprobar.'),

    item('q28', 28, 't5', 'REFLEXIONAR', 'Adecuado', '¿Qué falla argumentativa contiene la frase “Lo compartieron miles. Debe ser verdad”?', 'C', [
      option('A', 'Presenta una causa después de la consecuencia que intenta explicar.', 'Falla distinta'),
      option('B', 'Usa una palabra con dos significados incompatibles entre sí.', 'Falla distinta'),
      option('C', 'Considera la popularidad como prueba suficiente de veracidad.', 'Clave'),
      option('D', 'Recurre a una fuente experta que no posee autoridad en el tema.', 'Falla inexistente')
    ], 'La cantidad de reenvíos no informa sobre autoría, fecha, fuente ni exactitud.', 'La afirmación apela a la popularidad y reemplaza la evidencia por el número de personas que difundieron el contenido.'),

    item('q29', 29, 't6', 'LOCALIZAR', 'Elemental', '¿Por qué Darío necesita reparar la bicicleta ese mismo día?', 'B', [
      option('A', 'Porque había prometido devolverla al taller antes de la lluvia.', 'Invención plausible'),
      option('B', 'Porque la utiliza para realizar los encargos de su turno.', 'Clave'),
      option('C', 'Porque debía venderla para completar un pago pendiente.', 'Cambio de propósito'),
      option('D', 'Porque quería reemplazar ambos pedales antes del lunes.', 'Dato distorsionado')
    ], 'Párrafo 3: su turno comenzaba pronto y sin bicicleta no podía aceptar encargos.', 'La urgencia depende directamente de que la bicicleta es su herramienta de trabajo.'),

    item('q30', 30, 't6', 'INTERPRETAR', 'Adecuado', '¿Qué muestra Efraín al reemplazar “deuda” por “pedal recuperado”?', 'B', [
      option('A', 'Que ha decidido renunciar al pago pendiente por el arreglo.', 'Conclusión extrema'),
      option('B', 'Que reformula la ayuda para reconocer el trabajo y la pieza utilizada.', 'Clave'),
      option('C', 'Que considera más importante la libreta que la reparación del pedal.', 'Cambio de foco'),
      option('D', 'Que sospecha que Darío no regresará al taller durante la semana.', 'Motivo opuesto')
    ], 'Párrafo 9: mantiene el pago pendiente, pero cambia la forma de registrar la operación.', 'La nueva expresión evita reducir el encuentro a una deuda y valora la recuperación de una pieza útil.'),

    item('q31', 31, 't6', 'INTERPRETAR', 'Adecuado', '¿Qué representa la chaqueta que Darío deja sobre el mesón?', 'A', [
      option('A', 'Su compromiso de regresar y su deseo de ofrecer una garantía.', 'Clave'),
      option('B', 'Su intención de intercambiar una prenda personal por el pedal recién instalado.', 'Transacción falsa'),
      option('C', 'Su molestia por la primera negativa del dueño del taller.', 'Emoción inventada'),
      option('D', 'Su decisión de abandonar el trabajo debido al mal tiempo.', 'Contrasentido')
    ], 'Párrafo 8: Darío dice “Para que sepa que vuelvo”.', 'La prenda funciona como señal de responsabilidad, aunque Efraín rechaza una garantía que lo dejaría expuesto a la lluvia.'),

    item('q32', 32, 't6', 'REFLEXIONAR', 'Adecuado', '¿Cuál de las siguientes ideas resume mejor el cuento?', 'B', [
      option('A', 'Las promesas de pago perjudican el funcionamiento de los talleres.', 'Generalización'),
      option('B', 'La solidaridad puede ejercerse sin desconocer la dignidad ni el trabajo.', 'Clave'),
      option('C', 'Las piezas recuperadas suelen superar la calidad de los repuestos nuevos.', 'Generalización técnica'),
      option('D', 'La experiencia práctica tiene mayor valor que el aprendizaje formal.', 'Tema ajeno')
    ], 'El arreglo combina el trabajo de Matías, la decisión de Efraín y el compromiso de Darío.', 'La ayuda no se presenta como lástima: reconoce aportes, mantiene reciprocidad y protege a la persona.'),

    item('q33', 33, 't7', 'LOCALIZAR', 'Elemental', '¿Cuánto tiempo pueden operar los nuevos bibliomóviles sin conexión eléctrica externa?', 'D', [
      option('A', 'Cerca de cuatro horas de funcionamiento continuo.', 'Cifra cercana'),
      option('B', 'Hasta seis horas de funcionamiento continuo.', 'Cifra plausible'),
      option('C', 'Alrededor de diez horas de funcionamiento continuo.', 'Cifra plausible'),
      option('D', 'Hasta ocho horas de funcionamiento continuo.', 'Clave')
    ], 'Párrafo 4: las baterías permiten operar “hasta ocho horas”.', 'El dato aparece explícitamente entre otras características técnicas.'),

    item('q34', 34, 't7', 'LOCALIZAR', 'Elemental', '¿Qué diferencia de capacidad existe entre furgones y camiones?', 'B', [
      option('A', 'Los furgones llevan 2.000 libros y los camiones, 1.500.', 'Inversión'),
      option('B', 'Los furgones llevan 1.500 libros y los camiones, 2.000.', 'Clave'),
      option('C', 'Los furgones llevan 380 libros y los camiones, 1.500.', 'Cruce de datos'),
      option('D', 'Los furgones llevan 1.500 libros y los camiones, 380.', 'Cruce de datos')
    ], 'Párrafo 4: 1.500 ejemplares en furgones y 2.000 en camiones.', 'La pregunta exige discriminar entre cifras cercanas y el tamaño de la colección inicial.'),

    item('q35', 35, 't7', 'LOCALIZAR', 'Adecuado', '¿Qué dato muestra la importancia de la gestión municipal en la red?', 'B', [
      option('A', 'Quince regiones participaron en la elección de los vehículos.', 'Dato regional'),
      option('B', 'Cincuenta de los 53 servicios activos dependían de municipios.', 'Clave'),
      option('C', 'La red bibliotecaria estaba presente en 338 comunas del país.', 'Dato de cobertura'),
      option('D', 'Cada unidad recibió una colección inicial de unos 380 libros.', 'Dato de colección')
    ], 'Párrafo 7: 50 de los 53 servicios dependían administrativamente de municipios.', 'El dato se vincula directamente con la coordinación local de rutas y horarios.'),

    item('q36', 36, 't7', 'INTERPRETAR', 'Adecuado', '¿Qué significa que “la ruta también forma parte de la biblioteca”?', 'D', [
      option('A', 'Que los libros deben explicar los caminos de cada región.', 'Literalización'),
      option('B', 'Que el vehículo presta servicio mientras permanece en movimiento.', 'Condición falsa'),
      option('C', 'Que los usuarios prefieren leer durante viajes de larga distancia.', 'Invención plausible'),
      option('D', 'Que el servicio debe adaptarse al territorio para llegar con regularidad.', 'Clave')
    ], 'Párrafos 2 y 3: cada territorio selecciona el vehículo y la estabilidad de los recorridos es decisiva.', 'La frase integra transporte, geografía y continuidad del servicio, no solo traslado de libros.'),

    item('q37', 37, 't7', 'INTERPRETAR', 'Adecuado', '¿Qué función cumple el párrafo sobre la historia de los bibliomóviles?', 'C', [
      option('A', 'Demostrar que los vehículos antiguos tenían mayor duración.', 'Comparación inexistente'),
      option('B', 'Explicar por qué la flota nueva podría reemplazar las bibliotecas fijas.', 'Conclusión falsa'),
      option('C', 'Mostrar que la iniciativa actual continúa una estrategia de larga trayectoria.', 'Clave'),
      option('D', 'Probar que la Universidad de Chile administra la red vigente.', 'Confusión institucional')
    ], 'Párrafo 6: se conectan el bibliobús de fines de los sesenta, los Dibamóviles de 1998 y la etapa actual.', 'La secuencia histórica presenta continuidad y transformación, no una solución improvisada.'),

    item('q38', 38, 't7', 'REFLEXIONAR', 'Adecuado', '¿Para qué se incluye la frase “estos bibliomóviles no solo transportan libros”?', 'A', [
      option('A', 'Para destacar que el servicio crea vínculos y actividades además de prestar ejemplares.', 'Clave'),
      option('B', 'Para cuestionar que la capacidad de los vehículos sea suficiente.', 'Cambio de foco'),
      option('C', 'Para afirmar que la conectividad es más importante que la lectura.', 'Jerarquía inexistente'),
      option('D', 'Para anunciar que los bibliomóviles dejarán de trasladar colecciones.', 'Contrasentido')
    ], 'Párrafo 9: la frase se desarrolla mediante la relación estable con usuarios y comunidades.', 'La cita condensa el propósito global del reportaje y amplía la idea de biblioteca más allá del transporte físico.'),
  ];

  const OPEN_QUESTIONS = [
    {
      id: 'q10', n: 10, texto: 't2', hab: 'REFLEXIONAR', nivel: 'Adecuado',
      enun: 'La reseña identifica tres temas del cuento: el trabajo cotidiano que pasa inadvertido, el aprendizaje de mirar a quienes comparten un espacio y la pertenencia como responsabilidad. ¿Cuál de estos temas se desarrolla con mayor claridad en “La lista del ascensor”? Fundamenta tu respuesta con dos evidencias del cuento.',
      puntaje: 3,
      pauta: [
        '1 punto por seleccionar uno de los tres temas de manera coherente.',
        '1 punto por una primera evidencia pertinente y explicada.',
        '1 punto por una segunda evidencia pertinente y distinta.'
      ],
      respuestaModelo: 'El aprendizaje de mirar a quienes comparten un espacio se desarrolla con mayor claridad. Al inicio, Mauro recorre el edificio pensando en la hora y apenas considera los nombres de la lista. Después descubre necesidades y aportes de distintos vecinos. Al final escribe que le falta aprender sus nombres, lo que muestra que reconoce su desconocimiento y comienza a cambiar.'
    },
    {
      id: 'q24', n: 24, texto: 't4', hab: 'REFLEXIONAR', nivel: 'Adecuado',
      enun: '¿Qué papel cumple Inés en la resolución del conflicto entre Julia y los responsables de la remodelación? Fundamenta tu respuesta con dos intervenciones o acciones del personaje.',
      puntaje: 3,
      pauta: [
        '1 punto por reconocer a Inés como mediadora o creadora de una solución que integra ambas posturas.',
        '1 punto por explicar su propuesta de abrir un paso y reutilizar la madera.',
        '1 punto por integrar otra evidencia, como reinterpretar la espera o reunir el libro con el horario.'
      ],
      respuestaModelo: 'Inés actúa como mediadora porque no se limita a escoger entre conservar o retirar el mesón. Propone abrir el paso en la parte dañada y reutilizar esa madera, con lo que responde a la necesidad de accesibilidad sin borrar el objeto. También transforma la idea de esperar: plantea que el edificio puede recibir nuevas esperas vinculadas con libros y conversaciones.'
    }
  ];

  window.ENSAYO_N3_DATA = {
    meta: {
      titulo: 'Ensayo SIMCE N.º 3',
      subtitulo: 'Lectura, 2.º medio, 2026',
      forma: 'Forma única',
      tiempo: '90 minutos',
      totalPreguntas: 38,
      preguntasSeleccion: 36,
      preguntasDesarrollo: 2,
      institucion: 'Centro Educativo Salesianos Talca',
      codigo: 'ES3C26-LECT-NM2'
    },
    texts: TEXTS,
    questions: QUESTIONS,
    openQuestions: OPEN_QUESTIONS,
    fuentes: [
      {
        uso: 'Campaña de alfabetización mediática',
        titulo: 'UNESCO campaigns on media and information literacy empower millions in Ukraine to think critically',
        url: 'https://www.unesco.org/en/articles/unescos-campaigns-media-and-information-literacy-empower-millions-ukraine-think-critically'
      },
      {
        uso: 'Reportaje sobre bibliomóviles',
        titulo: 'Ministerio de las Culturas inaugura moderna flota de bibliomóviles para garantizar el acceso a la lectura en todo Chile',
        url: 'https://www.patrimoniocultural.gob.cl/noticias/ministerio-de-las-culturas-inaugura-moderna-flota-de-bibliomoviles-para-garantizar-el'
      },
      {
        uso: 'Tipos de servicios móviles',
        titulo: 'Servicios móviles',
        url: 'https://www.patrimoniocultural.gob.cl/servicios-moviles'
      },
      {
        uso: 'Cobertura del sistema bibliotecario',
        titulo: 'Informe de Gestión 2024 Sistema Nacional de Bibliotecas Públicas',
        url: 'https://www.bibliotecaspublicas.gob.cl/publicaciones/informe-de-gestion-2024-sistema-nacional-de-bibliotecas-publicas'
      }
    ]
  };
}());
