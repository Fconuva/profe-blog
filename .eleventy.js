const { documentToHtmlString } = require('@contentful/rich-text-html-renderer');

module.exports = function(eleventyConfig) {
  // Copia de recursos estáticos
  eleventyConfig.addPassthroughCopy("imagenes");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("googlef1002b0f2fdf6e22.html");

  // Copia de páginas HTML y carpetas que no son procesadas por Nunjucks
  // Estandarizamos a minúsculas para evitar errores
  eleventyConfig.addPassthroughCopy("portafolio.html");
  eleventyConfig.addPassthroughCopy("bingo.html");
  eleventyConfig.addPassthroughCopy("rosco.html");
  eleventyConfig.addPassthroughCopy("ruleta.html");
  eleventyConfig.addPassthroughCopy("simulador.html");
  eleventyConfig.addPassthroughCopy("generador-cv.html"); // Añadido por si falta
  eleventyConfig.addPassthroughCopy("tesis.html"); // Añadido por si falta

  eleventyConfig.addPassthroughCopy("formulario-contexto");
  eleventyConfig.addPassthroughCopy("contacto");
  eleventyConfig.addPassthroughCopy("galeria");
  eleventyConfig.addPassthroughCopy("success");

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
