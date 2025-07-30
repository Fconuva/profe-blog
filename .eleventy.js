const { documentToHtmlString } = require('@contentful/rich-text-html-renderer');

module.exports = function(eleventyConfig) {
  // --- Copia de recursos estáticos ---
  // Añade la nueva carpeta de CSS y el JS
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("main.js");
  
  eleventyConfig.addPassthroughCopy("imagenes");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("googlef1002b0f2fdf6e22.html");

  // --- Copia de páginas HTML y carpetas ---
  // Se estandarizan nombres a minúsculas para evitar errores en servidores
  eleventyConfig.addPassthroughCopy("portafolio.html");
  eleventyConfig.addPassthroughCopy("bingo.html"); // Corregido de BINGO.html
  eleventyConfig.addPassthroughCopy("rosco.html");
  eleventyConfig.addPassthroughCopy("ruleta.html");
  eleventyConfig.addPassthroughCopy("simulador.html");
  eleventyConfig.addPassthroughCopy("generador-cv.html");
  eleventyConfig.addPassthroughCopy("tesis.html");
  
  eleventyConfig.addPassthroughCopy("formulario-contexto");
  eleventyConfig.addPassthroughCopy("contacto");
  eleventyConfig.addPassthroughCopy("galeria");
  eleventyConfig.addPassthroughCopy("success");

  // --- Filtros para Plantillas ---
  // Filtro para renderizar Rich Text de Contentful
  eleventyConfig.addShortcode("documentToHtml", (document) => {
    if (!document) {
      return '';
    }
    return documentToHtmlString(document);
  });

  // Filtro para formatear fechas
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
  });

  // --- Configuración de Directorios ---
  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
