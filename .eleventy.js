module.exports = function(eleventyConfig) {
  // Static assets
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("imagenes");
  eleventyConfig.addPassthroughCopy("_redirects");
  eleventyConfig.addPassthroughCopy("site.webmanifest");

  // App pages (standalone HTML - not processed by Eleventy)
  eleventyConfig.addPassthroughCopy("cuenta");
  eleventyConfig.addPassthroughCopy("dashboard");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("estudiantes");
  eleventyConfig.addPassthroughCopy("publicaciones");
  eleventyConfig.addPassthroughCopy("trivia");

  // Ignore old/irrelevant files
  eleventyConfig.ignores.add("_site");
  eleventyConfig.ignores.add("node_modules");
  eleventyConfig.ignores.add("api/**");
  eleventyConfig.ignores.add("_backup_old_site/**");
  eleventyConfig.ignores.add("*.py");
  eleventyConfig.ignores.add("*.ps1");
  eleventyConfig.ignores.add("*.md");
  eleventyConfig.ignores.add("evaluaciones/**");
  eleventyConfig.ignores.add("comprar/**");
  eleventyConfig.ignores.add("privado/**");
  eleventyConfig.ignores.add("Temporales/**");
  eleventyConfig.ignores.add("netlify/**");
  eleventyConfig.ignores.add("blog/**");
  eleventyConfig.ignores.add("contacto/**");
  eleventyConfig.ignores.add("portafolio/**");
  eleventyConfig.ignores.add("rosco/**");
  eleventyConfig.ignores.add("ruleta/**");
  eleventyConfig.ignores.add("simulador/**");
  eleventyConfig.ignores.add("generador-cv/**");
  eleventyConfig.ignores.add("tesis/**");
  eleventyConfig.ignores.add("bingo/**");
  eleventyConfig.ignores.add("sindicato/**");
  eleventyConfig.ignores.add("galeria/**");
  eleventyConfig.ignores.add("tips-carrera-docente/**");
  eleventyConfig.ignores.add("informacion-evaluacion/**");
  eleventyConfig.ignores.add("formulario-contexto/**");
  eleventyConfig.ignores.add("deploy/**");
  eleventyConfig.ignores.add("success/**");
  eleventyConfig.ignores.add("public/**");
  eleventyConfig.ignores.add("Manuales/**");

  // Ignore standalone HTML files at root
  eleventyConfig.ignores.add("contacto.html");
  eleventyConfig.ignores.add("BINGO.html");
  eleventyConfig.ignores.add("index.html");
  eleventyConfig.ignores.add("crear-usuario-jpoblete.html");
  eleventyConfig.ignores.add("afiche-instagram-dossieres.html");
  eleventyConfig.ignores.add("clasificador-imagenes-ep2023.html");

  // Date filter
  eleventyConfig.addFilter("fecha", (dateObj) => {
    return new Date(dateObj).toLocaleDateString('es-CL', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk"
  };
};
