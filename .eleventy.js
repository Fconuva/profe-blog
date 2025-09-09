module.exports = function(eleventyConfig) {
  // Trigger deploy
  // Copiar archivos estáticos
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("icons");
  eleventyConfig.addPassthroughCopy("imagenes");
  eleventyConfig.addPassthroughCopy("herramienta-interrogacion");
  eleventyConfig.addPassthroughCopy("rosco");
  eleventyConfig.addPassthroughCopy("simulador");
  eleventyConfig.addPassthroughCopy("tesis");
  eleventyConfig.addPassthroughCopy("tips-carrera-docente");
  eleventyConfig.addPassthroughCopy("ruleta.html");
  eleventyConfig.addPassthroughCopy("bingo.html");
  eleventyConfig.addPassthroughCopy("generador-cv.html");
  eleventyConfig.addPassthroughCopy("sw.js");
  eleventyConfig.addPassthroughCopy("manifest.json");
  eleventyConfig.addPassthroughCopy("site.webmanifest");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("logo-small.png");
  eleventyConfig.addPassthroughCopy("logo.png");
  eleventyConfig.addPassthroughCopy("*.ico");
  eleventyConfig.addPassthroughCopy("*.html"); // Copiar todos los archivos HTML como estáticos

  // Configuración básica
  return {
    dir: {
      input: ".",
      output: "_site"
    },
    templateFormats: ["html", "njk", "md"]
  };
};
