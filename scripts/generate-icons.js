const fs = require('fs');
const path = require('path');

// Script para generar iconos básicos si no existen
function generateBasicIcons() {
    const iconsDir = path.join(__dirname, '..', 'icons');
    
    // Crear directorio si no existe
    if (!fs.existsSync(iconsDir)) {
        fs.mkdirSync(iconsDir, { recursive: true });
    }
    
    // SVG básico para el icono
    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="512" height="512" rx="80" fill="url(#grad1)"/>
        <g fill="white" transform="translate(128, 128)">
            <!-- Icono de documento con check -->
            <path d="M48 0C21.5 0 0 21.5 0 48v160c0 26.5 21.5 48 48 48h64v48c0 26.5 21.5 48 48 48h160c26.5 0 48-21.5 48-48V144c0-26.5-21.5-48-48-48h-64V48c0-26.5-21.5-48-48-48H48z"/>
            <path d="M208 240c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zm0-64c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zm0-64c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16z"/>
            <!-- Check mark -->
            <path d="M173.9 301.1L224 251l-22.6-22.6-28.1 28.1-11.3-11.3L139.4 268l34.5 33.1z" fill="#10b981"/>
        </g>
        <text x="256" y="420" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="48" font-weight="bold">NOTA</text>
    </svg>`;
    
    // Crear archivo SVG
    const svgPath = path.join(iconsDir, 'icon.svg');
    fs.writeFileSync(svgPath, svgIcon);
    
    console.log('✅ Icono SVG básico generado');
    
    // Crear un archivo de información sobre los iconos
    const iconInfo = `# Iconos de la Aplicación

## Iconos Requeridos

Para una PWA completa, se necesitan los siguientes tamaños de iconos:

- icon-72x72.png
- icon-96x96.png  
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## Generar Iconos

1. **Opción 1: Usar herramientas online**
   - Sube el archivo icon.svg a https://realfavicongenerator.net/
   - Descarga todos los tamaños necesarios

2. **Opción 2: Usar Sharp (Node.js)**
   \`\`\`bash
   npm install sharp
   node scripts/convert-icons.js
   \`\`\`

3. **Opción 3: Usar herramientas de diseño**
   - Adobe Illustrator
   - Figma
   - Canva

## Personalización

Puedes reemplazar el archivo icon.svg con tu propio diseño y regenerar los iconos.
`;
    
    fs.writeFileSync(path.join(iconsDir, 'README.md'), iconInfo);
    console.log('✅ Documentación de iconos creada');
}

if (require.main === module) {
    generateBasicIcons();
}

module.exports = { generateBasicIcons };
