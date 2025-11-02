const path = require('path');

module.exports = async function() {
  try {
    const data = require('./lenguaje-comunicacion.json');
    // Exponer con la misma clave usada en la plantilla (temario: 'lenguaje-comunicacion')
    return {
      temarios: {
        'lenguaje-comunicacion': data
      }
    };
  } catch (e) {
    // Si falla, retornar objeto vacío para que la página muestre el aviso de error
    return { temarios: {} };
  }
};
