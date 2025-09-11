# Iconos de la Aplicación

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
   ```bash
   npm install sharp
   node scripts/convert-icons.js
   ```

3. **Opción 3: Usar herramientas de diseño**
   - Adobe Illustrator
   - Figma
   - Canva

## Personalización

Puedes reemplazar el archivo icon.svg con tu propio diseño y regenerar los iconos.
