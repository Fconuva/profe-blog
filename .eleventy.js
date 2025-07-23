    const { documentToHtmlString } = require('@contentful/rich-text-html-renderer');

    module.exports = function(eleventyConfig) {
      // Copia carpetas y archivos estáticos
      eleventyConfig.addPassthroughCopy("imagenes");
      eleventyConfig.addPassthroughCopy("*.html"); // Copia todos los archivos HTML a la raíz
      eleventyConfig.addPassthroughCopy("sitemap.xml");

      // Filtro para Rich Text de Contentful
      eleventyConfig.addShortcode("documentToHtml", (document) => {
        return documentToHtmlString(document);
      });

      // Filtro para fechas
      eleventyConfig.addFilter("readableDate", (dateObj) => {
        return new Date(dateObj).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
      });

      return {
        dir: {
          input: ".",
          includes: "_includes",
          data: "_data",
          output: "_site"
        }
      };
    };
    