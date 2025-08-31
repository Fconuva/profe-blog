const { documentToHtmlString } = require('@contentful/rich-text-html-renderer');
let Image;
const path = require('path');
let hasEleventyImg = true;
try {
  Image = require('@11ty/eleventy-img');
} catch (e) {
  // eleventy-img might not be installed in some environments (Netlify if in devDependencies),
  // we fall back to no-op implementations to avoid build-time template errors.
  hasEleventyImg = false;
  // Log a clear message for build logs so you know the fallback was used.
  console.warn('[eleventy] @11ty/eleventy-img not available — registering fallback shortcodes.');
}

module.exports = function(eleventyConfig) {
  // Copia solo recursos estáticos (evitar copiar archivos HTML que Eleventy procesa)
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("main.js");
  eleventyConfig.addPassthroughCopy("imagenes");
  // Ensure the standalone form folder is copied to output
  eleventyConfig.addPassthroughCopy("formulario-contexto");
  // Allow Netlify _redirects file to be copied to output
  eleventyConfig.addPassthroughCopy("_redirects");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("site.webmanifest");

  // Copiar carpetas con páginas individuales
  eleventyConfig.addPassthroughCopy("contacto");
  eleventyConfig.addPassthroughCopy("portafolio");
  eleventyConfig.addPassthroughCopy("rosco");
  eleventyConfig.addPassthroughCopy("ruleta");
  eleventyConfig.addPassthroughCopy("simulador");
  eleventyConfig.addPassthroughCopy("generador-cv");
  eleventyConfig.addPassthroughCopy("tesis");
  eleventyConfig.addPassthroughCopy("bingo");
  eleventyConfig.addPassthroughCopy("googlef1002b0f2fdf6e22");
  eleventyConfig.addPassthroughCopy("tips-carrera-docente");
  eleventyConfig.addPassthroughCopy("informacion-evaluacion");
  eleventyConfig.addPassthroughCopy("galeria");
  eleventyConfig.addPassthroughCopy("deploy");
  eleventyConfig.addPassthroughCopy("success");
  eleventyConfig.addPassthroughCopy("blog");
  eleventyConfig.addPassthroughCopy("Manuales");

  // Evitar procesar archivos HTML raíz que duplican carpetas con index.html
  const duplicates = [
    'contacto.html', 'portafolio.html', 'rosco.html', 'ruleta.html', 'simulador.html',
    'generador-cv.html', 'tesis.html', 'googlef1002b0f2fdf6e22.html', 'BINGO.html'
  ];
  duplicates.forEach(f => eleventyConfig.ignores.add(f));
  // Ignorar la carpeta de salida para evitar que archivos generados previos causen conflictos
  eleventyConfig.ignores.add("_site");
  // Ignorar específicamente cualquier index.html dentro de blog si existe
  eleventyConfig.ignores.add("blog/index.html");
  eleventyConfig.ignores.add("blog/post/index.html");
  // Solo ignorar index.html en carpetas que no queremos procesar
  // PERMITIR que se procesen los index.html de las herramientas
  // eleventyConfig.ignores.add("**/index.html");
  
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

  // Añadir alias 'date' por compatibilidad con plantillas que esperen ese filtro
  eleventyConfig.addFilter("date", (dateObj) => {
    try {
      return new Date(dateObj).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return '';
    }
  });

  // Configuración de Directorios
  // Shortcode para imágenes responsivas
  // params: src, alt, sizes, lcp(boolean)
  if (hasEleventyImg) {
    eleventyConfig.addNunjucksAsyncShortcode("responsiveImage", async function(src, alt = '', sizes = "(min-width: 1024px) 1024px, 100vw", lcp = false) {
      if (!src) return '';
      // Normalize local paths starting with '/'
      let inputSrc = src;
      const isRemote = /^https?:\/\//i.test(src);
      if (!isRemote) {
        // remove leading slashes and resolve relative to project root
        const relative = src.replace(/^\/+/, '');
        inputSrc = path.resolve(process.cwd(), relative);
      }
      let metadata = await Image(inputSrc, {
        widths: [320, 640, 1024, 1600],
        formats: ['avif','webp','jpeg'],
        outputDir: './_site/imagenes/generated',
        urlPath: '/imagenes/generated/'
      });

      const imageAttributes = {
        alt,
        sizes,
        loading: lcp ? 'eager' : 'lazy',
        decoding: lcp ? 'sync' : 'async'
      };
      if (lcp) {
        // Give browser a hint for LCP
        imageAttributes.fetchpriority = 'high';
      }

      return Image.generateHTML(metadata, imageAttributes);
    });

    // Preload helper for the Largest Contentful Paint candidate.
    // Use the best available format (avif > webp > jpeg) and emit a preload link with imagesrcset.
    eleventyConfig.addNunjucksAsyncShortcode("preloadImage", async function(src, sizes = "(min-width: 1024px) 1024px, 100vw") {
      if (!src) return '';
      let inputSrc = src;
      const isRemote = /^https?:\/\//i.test(src);
      if (!isRemote) {
        const relative = src.replace(/^\/+/, '');
        inputSrc = path.resolve(process.cwd(), relative);
      }
      const metadata = await Image(inputSrc, {
        widths: [320, 640, 1024, 1600],
        formats: ['avif','webp','jpeg'],
        outputDir: './_site/imagenes/generated',
        urlPath: '/imagenes/generated/'
      });

      const preferred = metadata.avif ? 'avif' : (metadata.webp ? 'webp' : 'jpeg');
      const set = metadata[preferred].map(item => `${item.url} ${item.width}w`).join(', ');
      const largest = metadata[preferred][metadata[preferred].length - 1].url;

      return `<link rel="preload" as="image" href="${largest}" imagesrcset="${set}" imagesizes="${sizes}">`;
    });
  } else {
    // Fallback registrations so Nunjucks always knows the tags exist.
    // These produce simple HTML and do not generate responsive variants.
    eleventyConfig.addShortcode("responsiveImage", function(src, alt = '', sizes = "(min-width: 1024px) 1024px, 100vw", lcp = false) {
      if (!src) return '';
      const attrs = [];
      attrs.push(`src="${src}"`);
      attrs.push(`alt="${alt.replace(/\"/g, '&quot;')}"`);
      attrs.push(`sizes="${sizes}"`);
      attrs.push(`width="1600" height="533"`);
      if (lcp) attrs.push('loading="eager" decoding="sync" fetchpriority="high"');
      else attrs.push('loading="lazy" decoding="async"');
      return `<img ${attrs.join(' ')}>`;
    });

    eleventyConfig.addShortcode("preloadImage", function(src, sizes = "(min-width: 1024px) 1024px, 100vw") {
      if (!src) return '';
      // Emit a conservative preload to the original src — better than failing the build.
      return `<link rel="preload" as="image" href="${src}" imagesizes="${sizes}">`;
    });
  }
  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
