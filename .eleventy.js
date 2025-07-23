const { documentToHtmlString } = require('@contentful/rich-text-html-renderer');

module.exports = function(eleventyConfig) {
  // Copia archivos estáticos (como la carpeta de imágenes) a la salida final
  eleventyConfig.addPassthroughCopy("imagenes");

  // Filtro para convertir el Rich Text de Contentful a HTML
  eleventyConfig.addShortcode("documentToHtml", (document) => {
    return documentToHtmlString(document);
  });

  // Filtro para formatear fechas
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site" // La carpeta donde se generará el sitio final
    }
  };
};
