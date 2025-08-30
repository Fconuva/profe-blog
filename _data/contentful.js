const { createClient } = require('contentful');
require('dotenv').config();

module.exports = async function() {
  const space = process.env.CONTENTFUL_SPACE_ID;
  const deliveryToken = process.env.CONTENTFUL_ACCESS_TOKEN;
  const previewToken = process.env.CONTENTFUL_PREVIEW_TOKEN;

  if (!space || (!deliveryToken && !previewToken)) {
    // No hay credenciales, devolver vacío para no romper la build
    return [];
  }

  const usePreview = process.env.CONTENTFUL_USE_PREVIEW === 'true';
  const accessToken = usePreview && previewToken ? previewToken : deliveryToken;
  const host = usePreview && previewToken ? 'preview.contentful.com' : 'cdn.contentful.com';

  try {
    const client = createClient({
      space,
      accessToken,
      host
    });

    const entries = await client.getEntries();
    // Mapear a un formato simple para templates
    return entries.items.map(item => ({
      ...item.fields,
      sys: item.sys
    }));
  } catch (err) {
    // Si falla, loguear y devolver vacío para no interrumpir el build
    console.error('Error fetching Contentful entries:', err.message || err);
    return [];
  }
};
