const { createClient } = require('contentful');
require('dotenv').config();

module.exports = async function() {
  const space = process.env.CONTENTFUL_SPACE_ID;
  const deliveryToken = process.env.CONTENTFUL_ACCESS_TOKEN;
  const previewToken = process.env.CONTENTFUL_PREVIEW_TOKEN;

  if (!space || (!deliveryToken && !previewToken)) {
    // No hay credenciales, devolver vacío para no romper la build
    console.log('[Contentful] No credentials found, skipping Contentful data fetch');
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

    // Add timeout to prevent hanging builds
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Contentful fetch timeout after 10s')), 10000)
    );

    const entriesPromise = client.getEntries();
    const entries = await Promise.race([entriesPromise, timeoutPromise]);
    
    // Mapear a un formato simple para templates
    console.log(`[Contentful] Successfully fetched ${entries.items.length} entries`);
    return entries.items.map(item => ({
      ...item.fields,
      sys: item.sys
    }));
  } catch (err) {
    // Si falla, loguear y devolver vacío para no interrumpir el build
    console.error('[Contentful] Error fetching entries:', err.message || err);
    return [];
  }
};
