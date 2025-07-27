const { documentToHtmlString } = require('@contentful/rich-text-html-renderer');

module.exports = function(eleventyConfig) {
  // Copia de recursos estáticos (imágenes y sitemap)
  eleventyConfig.addPassthroughCopy("imagenes");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("googlef1002b0f2fdf6e22.html");

  // ==========================================================
  // == AQUÍ ESTÁ LA REPARACIÓN ==
  // ==========================================================
  // En lugar de copiar solo "*.html", ahora copiamos las carpetas
  // y archivos específicos que necesitamos tal como están.
  eleventyConfig.addPassthroughCopy("portafolio.html");
  eleventyConfig.addPassthroughCopy("BINGO.html");
  eleventyConfig.addPassthroughCopy("rosco.html");
  eleventyConfig.addPassthroughCopy("ruleta.html");
  eleventyConfig.addPassthroughCopy("simulador.html");

  // Copiamos las carpetas completas del formulario y contacto
  eleventyConfig.addPassthroughCopy("formulario-contexto");
  eleventyConfig.addPassthroughCopy("contacto"); // (Asegúrate de haber creado esta carpeta también)

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