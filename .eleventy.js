const { documentToHtmlString } = require('@contentful/rich-text-html-renderer');

module.exports = function(eleventyConfig) {
  // Copia de recursos estáticos
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("main.js");
  eleventyConfig.addPassthroughCopy("imagenes");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("googlef1002b0f2fdf6e22.html");

  // Copia de páginas HTML y carpetas ESTATICAS
  eleventyConfig.addPassthroughCopy("portafolio.html");
  eleventyConfig.addPassthroughCopy("bingo.html");
  eleventyConfig.addPassthroughCopy("rosco.html");
  eleventyConfig.addPassthroughCopy("ruleta.html");
  eleventyConfig.addPassthroughCopy("simulador.html");
  eleventyConfig.addPassthroughCopy("generador-cv.html");
  eleventyConfig.addPassthroughCopy("tesis.html");
  
  eleventyConfig.addPassthroughCopy("formulario-contexto");
  eleventyConfig.addPassthroughCopy("contacto");
  eleventyConfig.addPassthroughCopy("success");
  
  // La línea incorrecta para "tips-carrera-docente" ha sido eliminada.
  // Eleventy procesará los archivos .njk de esa carpeta automáticamente.

  // Filtros para Plantillas
  eleventyConfig.addShortcode("documentToHtml", (document) => {
    if (!document) { return ''; }
    return documentToHtmlString(document);
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
  });

  // Configuración de Directorios
  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
