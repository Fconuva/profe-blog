require('dotenv').config();
const contentful = require('contentful');

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

module.exports = async function() {
  try {
    const entries = await client.getEntries({
      content_type: 'blogPage', // Usa el API ID de tu modelo de contenido
      order: '-fields.fecha' // Ordena los artículos por fecha, del más nuevo al más viejo
    });
    return entries.items.map(item => item.fields);
  } catch (error) {
    console.error("Error al obtener datos de Contentful:", error);
    return [];
  }
};
