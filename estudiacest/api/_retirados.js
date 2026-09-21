// Estudiantes retirados del colegio que todavia figuran en las nominas de los
// paneles de interrogacion. La nomina de esta plataforma es estatica: no se
// eliminan filas, porque el identificador de cada alumno se calcula con su
// numero de lista y borrarlo correria a los demas y dejaria huerfanas sus notas.
// Aqui solo se marcan: el panel no los ofrece para interrogar y, si alguno
// tuviera nota registrada, se sigue viendo.
//
// La fecha de retiro es la que informa el libro de clases (campo `fecha_retiro`
// de la matricula). Revisado el 21-09-2026 contra los ocho cursos; de los once
// retirados del libro, estos cuatro son los unicos que aparecen en estas
// nominas. Para agregar a alguien: su nombre tal como esta en el roster.
const RETIRADOS = {
  '4BTP': [
    { nombre: 'BERMUDEZ BALZA LUIS SANTIAGO', retiro: '2026-04-01' },
    { nombre: 'LOBOS FUENTES JUAN SEBASTIAN', retiro: '2026-04-17' }
  ],
  '3B': [
    { nombre: 'OVIEDO RODRIGUEZ FRANCISCO GABRIEL', retiro: '2026-08-14' }
  ],
  '3D': [
    { nombre: 'VALENZUELA ESCOBAR SEBASTIAN ANTONIO', retiro: '2026-08-20' }
  ]
};

const normalizar = (valor) => String(valor || '')
  .toUpperCase()
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/[^A-Z ]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const indice = {};
for (const [curso, lista] of Object.entries(RETIRADOS)) {
  indice[curso] = new Map(lista.map((r) => [normalizar(r.nombre), r.retiro]));
}

// Devuelve la fecha de retiro si ese estudiante esta retirado, o null.
function retiroDe(curso, nombre) {
  const porCurso = indice[curso];
  if (!porCurso) return null;
  return porCurso.get(normalizar(nombre)) || null;
}

module.exports = { RETIRADOS, retiroDe };
