const chapters = [
  [
    "El hijo del brahmán",
    "Explica qué impulsa a Siddhartha a cuestionar la vida que se espera de él."
  ],
  [
    "Con los samanas",
    "Explica una práctica que aprende y por qué esa experiencia no resuelve toda su búsqueda."
  ],
  [
    "Gotama",
    "Compara las decisiones de Siddhartha y Govinda ante las enseñanzas de Gotama."
  ],
  [
    "Despertar",
    "Explica qué cambia en la forma en que Siddhartha se mira a sí mismo y observa el mundo."
  ],
  [
    "Kamala",
    "Relaciona su encuentro con Kamala con la nueva etapa que comienza."
  ],
  [
    "Entre los hombres niños",
    "Explica cómo se relaciona con la vida material y con quienes lo rodean."
  ],
  [
    "Sansara",
    "Explica una señal de su transformación y la crisis que atraviesa."
  ],
  [
    "En el río",
    "Interpreta por qué este encuentro con el río representa un momento decisivo."
  ],
  [
    "El barquero",
    "Explica cómo la escucha y su relación con Vasudeva modifican su búsqueda."
  ],
  [
    "El hijo",
    "Relaciona el vínculo con su hijo con un aprendizaje o conflicto del protagonista."
  ],
  [
    "Om",
    "Explica cómo se relacionan las voces del río con su transformación."
  ],
  [
    "Govinda",
    "Interpreta lo que comunica el encuentro final entre Siddhartha y Govinda."
  ]
];
const body = document.getElementById('chapters-body');
chapters.forEach(([title, question], index) => {
  const row = document.createElement('tr');
  [String(index + 2).padStart(2, '0'), `${index + 1}. ${title}`, question].forEach(value => {
    const cell = document.createElement('td'); cell.textContent = value; row.appendChild(cell);
  }); body.appendChild(row);
});
const projection = document.getElementById('proyectar');
if (!document.fullscreenEnabled) projection.hidden = true;
projection.addEventListener('click', async () => {
  if (document.fullscreenElement) await document.exitFullscreen();
  else await document.documentElement.requestFullscreen();
});
document.addEventListener('fullscreenchange', () => {
  projection.textContent = document.fullscreenElement ? 'Salir de pantalla completa' : 'Pantalla completa';
});

