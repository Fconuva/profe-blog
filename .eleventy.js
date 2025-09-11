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
  eleventyConfig.addPassthroughCopy("sw.js");
  eleventyConfig.addPassthroughCopy("manifest.json");
  eleventyConfig.addPassthroughCopy("site.webmanifest");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("logo-small.png");
  eleventyConfig.addPassthroughCopy("logo.png");
  eleventyConfig.addPassthroughCopy("*.ico");

  // Copiar archivos HTML específicos como estáticos (solo los que no están en conflicto)
  eleventyConfig.addPassthroughCopy("bingo.html");
  eleventyConfig.addPassthroughCopy("generador-cv.html");
  eleventyConfig.addPassthroughCopy("nota de proceso.html");

  // Ignorar archivos HTML que tienen equivalentes en subdirectorios
  eleventyConfig.ignores.add("portafolio.html");
  eleventyConfig.ignores.add("rosco.html");
  eleventyConfig.ignores.add("simulador.html");
  eleventyConfig.ignores.add("tesis.html");
  eleventyConfig.ignores.add("pauta de cotejo.html");
  eleventyConfig.ignores.add("ruleta.html");

  // Ignorar archivos .njk que entran en conflicto con index.html en subdirectorios
  eleventyConfig.ignores.add("tips-carrera-docente/checklist-general.njk");
  eleventyConfig.ignores.add("tips-carrera-docente/evaluacion-formativa.njk");
  eleventyConfig.ignores.add("tips-carrera-docente/modulo-1.njk");
  eleventyConfig.ignores.add("tips-carrera-docente/trabajo-colaborativo.njk");

  // Configuración básica
  return {
    dir: {
      input: ".",
      output: "_site"
    },
    templateFormats: ["html", "njk", "md"]
  };
};
