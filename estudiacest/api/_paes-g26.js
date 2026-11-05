// Clave y evidencia de la Guía 26 (3.º A y B HC, 5 de noviembre de 2026).
// 5-nov: ampliada de 8 a 24 preguntas; las 8 primeras no cambian.
const key = {1:'B',2:'D',3:'A',4:'C',5:'A',6:'C',7:'D',8:'B',9:'C',10:'A',11:'D',12:'B',13:'A',14:'D',15:'C',16:'B',17:'D',18:'B',19:'A',20:'C',21:'B',22:'C',23:'D',24:'A'};
const feedback = {
  1:'El párrafo 2 lo dice: «cuatro seguían pendientes al cerrar el mes». Las ocho son devoluciones tardías que sí se hicieron.',
  2:'La segunda encargada responde que la compra «no resolvería por sí sola el incumplimiento del plazo». Las otras opciones atribuyen a la compra efectos que el texto no menciona.',
  3:'Se conoce el horario de retiro, pero «no preguntaron a los usuarios cuál era su ocupación». B y D convierten una coincidencia en identificación; C invierte la misma inferencia.',
  4:'«Nadie contó cuántas solicitudes quedaron sin atender»: el registro no permite medir cuántos paraguas faltaron. A inventa un número; B da por probada la compra; D mezcla dos datos.',
  5:'El párrafo 2 indica: «Antes de tocarla, desenchufó la lámpara». Levantar la base, probar el interruptor y revisar el cable ocurrieron en otros momentos.',
  6:'La marca señalaba una intervención anterior, pero Inés «no sabía si aquella marca señalaba la falla actual». A exagera la certeza; B cambia al autor; D deduce pruebas inexistentes.',
  7:'El abuelo dejaba señales «para no olvidar lo que había aprendido»; Inés no marca la lámpara y dibuja el punto en su cuaderno, junto a lo que aprendió. A confunde el soporte; B y C generalizan.',
  8:'«No sabía si aquella marca señalaba la falla actual»: la marca motivó la revisión, pero no era un conocimiento seguro. A y C atribuyen información que el texto no da; D invierte el orden.',
  9:'El párrafo 1 indica: «71 % a favor, 21 % en contra y 8 % sin opinión». 21 % y 8 % son las otras respuestas; 92 % suma a favor y en contra.',
  10:'La autora dice: «Propongo un piloto de cuatro domingos, en enero, antes de un cierre permanente», con conteos y consultas a los catorce locales. Descarta «repetir la encuesta ni postergar la decisión indefinidamente».',
  11:'«Me gusta la idea. Por eso mismo me preocupa que se decida con un número que dice menos de lo que parece». No rechaza el cierre (A, C) ni todas las encuestas (B): critica esta encuesta.',
  12:'«Desde un mismo teléfono se podía contestar más de una vez»: por eso se sabe cuántas respuestas hubo, pero no cuántas personas. Los diez días y las respuestas sin opinión no impiden contar personas.',
  13:'El párrafo 5 recoge la objeción («Algunos dirán que pedir más estudios es una forma elegante de no hacer nada») y responde con el piloto. La autora la llama «razonable», pero no renuncia a su propuesta.',
  14:'La autora advierte que no se sabe «cuántas de ellas viven en Los Olmos» y que «un 71 % de las respuestas no equivale, entonces, a un 71 % de los vecinos». A y C repiten el error; B inventa una consulta a los locales.',
  15:'La crítica central es que la encuesta «no pedía dirección» y permitía contestar «más de una vez». Si pidiera dirección y aceptara una respuesta por persona, esa crítica perdería fuerza. A, B y D no tocan ese punto.',
  16:'La autora usa la ciclovía como advertencia, pero aclara: «No digo que en Los Olmos vaya a pasar lo mismo: son calles distintas». A exagera; C contradice el texto («consulta en línea muy apoyada»); D le atribuye un rechazo que no hace.',
  17:'La tabla registra 540 litros para «Goteo con paja». 720 corresponde al goteo, 1.260 a la manguera y 180 es la diferencia entre ambos goteos.',
  18:'En la columna «Horas de trabajo», la manguera suma 9; el goteo, 4, y el goteo con paja, 5.',
  19:'El párrafo 4 dice: «dos fueron dañadas por caracoles, que encontraron refugio bajo la paja». La sombra del aromo era de la cama con manguera, y la cama con paja cosechó menos lechugas.',
  20:'El párrafo 5 concluye que «el resultado de la manguera no depende solo del método de riego». La sombra es un factor no controlado: no explica el mayor uso de agua ni prueba efectos en el peso.',
  21:'Según la profesora, la paja «reduce la evaporación», y esa cama usó menos agua (540 litros). El texto no dice que permita dejar de regar ni que haya aumentado la cosecha: esa cama cosechó 21.',
  22:'Hubo «una sola cama por método y una sola temporada», y el curso «no declaró un método ganador». A usa datos ciertos para una conclusión excesiva; B es falsa (cosechó menos y trabajó más que el goteo); D generaliza al revés.',
  23:'El curso propuso «calcular cuánto dinero ahorra el liceo con el agua que deja de usar, para saber en cuánto tiempo se recupera el valor del kit». Las otras opciones no comparan costo y ahorro.',
  24:'La tabla muestra 720 litros con goteo frente a 1.260 con manguera, y 23 lechugas en ambas. La manguera dio el menor peso (310 g); el ahorro con paja (720 L) no duplica el del goteo (540 L); las horas varían.'
};
module.exports = { key, feedback };
