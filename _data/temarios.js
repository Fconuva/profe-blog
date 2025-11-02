const fs = require('fs');
const path = require('path');

function readJson(p) {
  try {
    const raw = fs.readFileSync(p, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

module.exports = function() {
  // Carga explícita del temario de Lenguaje y Comunicación
  const base = path.resolve(process.cwd(), 'evaluaciones', 'educacion-basica', 'temarios');
  const lenguajePath = path.join(base, 'lenguaje-comunicacion.json');
  const lenguaje = readJson(lenguajePath);

  return {
    'lenguaje-comunicacion': lenguaje || { dominios: [] }
  };
};
