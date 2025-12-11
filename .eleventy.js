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
  // Force complete rebuild - Phase 2 deployment (Nov 14, 2025 - 13:30)
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("main.js");
  eleventyConfig.addPassthroughCopy("main-premium.js");
  eleventyConfig.addPassthroughCopy("imagenes");
  // Copiar recursos visuales de educación física básica
  eleventyConfig.addPassthroughCopy("imagenes/educacion-fisica");
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
  eleventyConfig.addPassthroughCopy("sindicato");
  // Copiar carpetas de la sección privada y herramientas temporales
  eleventyConfig.addPassthroughCopy("privado");
  eleventyConfig.addPassthroughCopy("Temporales");
  // Copiar carpeta de funciones de Netlify
  eleventyConfig.addPassthroughCopy("netlify");

  // Copiar archivos HTML estáticos de evaluaciones (sin procesar por Eleventy)
  eleventyConfig.addPassthroughCopy("evaluaciones/index.html");
  eleventyConfig.addPassthroughCopy("evaluaciones/login.html");
  eleventyConfig.addPassthroughCopy("evaluaciones/educacion-basica/pruebas/63-sc-l/index.html");
  eleventyConfig.addPassthroughCopy("evaluaciones/educacion-basica/pruebas/66-sc-m/index.html");

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
  // Ignorar archivos en carpetas que se copian tal cual
  // eleventyConfig.ignores.add("privado/**"); // DESHABILITADO - necesitamos servir dashboard.html
  eleventyConfig.ignores.add("Temporales/**");
  eleventyConfig.ignores.add("netlify/**");
  // Ocultar formatos crudos en Evaluaciones (archivos de trabajo internos)
  eleventyConfig.ignores.add("evaluaciones/**/*.pdf");
  eleventyConfig.ignores.add("evaluaciones/**/*.txt");
  // eleventyConfig.ignores.add("evaluaciones/**/*.json"); // DESHABILITADO - necesitamos copiar plan.json
  
  // Copiar archivos plan.json necesarios para las pruebas interactivas
  eleventyConfig.addPassthroughCopy("evaluaciones/educacion-basica/pruebas/63-sc-l/plan.json");
  eleventyConfig.addPassthroughCopy("evaluaciones/educacion-basica/pruebas/66-sc-m/plan.json");
  eleventyConfig.addPassthroughCopy("evaluaciones/educacion-basica/pruebas/71-sc-cs/plan.json");
  eleventyConfig.addPassthroughCopy("evaluaciones/educacion-basica/pruebas/basica-generalista/plan.json");
  eleventyConfig.addPassthroughCopy("evaluaciones/educacion-media/pruebas/educacion-fisica-media/plan.json");
  eleventyConfig.addPassthroughCopy("evaluaciones/educacion-media/pruebas/67-cm-m/plan.json");
  eleventyConfig.addPassthroughCopy("evaluaciones/educacion-media/pruebas/biologia-ecep-2025/plan.json");
  eleventyConfig.addPassthroughCopy("evaluaciones/educacion-parvularia/pruebas/parv-nt/plan.json");
  eleventyConfig.addPassthroughCopy("evaluaciones/educacion-especial/pruebas/plan.json");
  // Copiar archivos de audio MP3 para prueba de inglés media
  eleventyConfig.addPassthroughCopy("evaluaciones/educacion-media/pruebas/ingles-media/audios");
  // Copiar archivos de audio MP3 para dossier de inglés media
  eleventyConfig.addPassthroughCopy("evaluaciones/educacion-media/estudio/audios-dossier");
  // Copiar imágenes de PAES Biología 2023 para prueba ECEP Biología 2025
  eleventyConfig.addPassthroughCopy("evaluaciones/educacion-media/pruebas/paes-biologia-2023-imagenes");
  // Copiar imágenes y JS de Química 2023
  eleventyConfig.addPassthroughCopy("evaluaciones/educacion-media/pruebas/quimica-2023-imagenes");
  eleventyConfig.addPassthroughCopy("evaluaciones/educacion-media/pruebas/quimica-2023.js");
  // Copiar imágenes y JS de Física 2023
  eleventyConfig.addPassthroughCopy("evaluaciones/educacion-media/pruebas/fisica-2023-imagenes");
  eleventyConfig.addPassthroughCopy("evaluaciones/educacion-media/pruebas/fisica-2023.js");
  // Copiar carpetas de imágenes de las pruebas
  eleventyConfig.addPassthroughCopy("evaluaciones/**/imagenes/**/*.png");
  eleventyConfig.addPassthroughCopy("evaluaciones/**/imagenes/**/*.jpg");
  eleventyConfig.addPassthroughCopy("evaluaciones/**/imagenes/**/*.jpeg");
  eleventyConfig.addPassthroughCopy("evaluaciones/**/imagenes/**/*.gif");
  eleventyConfig.addPassthroughCopy("evaluaciones/**/imagenes/**/*.svg");
  // Ocultar secciones no implementadas
  // eleventyConfig.ignores.add("evaluaciones/educacion-media/**"); // REMOVIDO - Media ahora activa
  eleventyConfig.ignores.add("evaluaciones/educacion-media-tecnico-profesional/**");
  // eleventyConfig.ignores.add("evaluaciones/educacion-parvularia/**"); // REMOVIDO - Parvularia ahora activa
  eleventyConfig.ignores.add("evaluaciones/educacion-jovenes-adultos/**");
  eleventyConfig.ignores.add("evaluaciones/lengua-indigena/**");
  // Dentro de Educación Básica, permitir 63-sc-l (Lenguaje) y 66-sc-m (Matemática)
  // eleventyConfig.ignores.add("evaluaciones/educacion-basica/pruebas/66-sc-m/**"); // REMOVIDO - Matemática ahora activa
  eleventyConfig.ignores.add("evaluaciones/educacion-basica/pruebas/71-sc-cs/**");
  // Ignorar index.njk que tienen index.html estático (evitar conflictos)
  eleventyConfig.ignores.add("evaluaciones/educacion-basica/pruebas/66-sc-m/index.njk");
  eleventyConfig.ignores.add("**/63.SC-L(20).pdf");
  // Ocultar toda la sección Temarios
  eleventyConfig.ignores.add("evaluaciones/educacion-basica/temarios/**");
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
