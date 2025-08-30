Deploy a Netlify
================

Pasos rápidos:

1. Crear un sitio en Netlify y conectar el repo (opcional) o usar deploy vía Netlify CLI.
2. En Netlify, Settings → Build & deploy → Environment → Add variables:
   - CONTENTFUL_SPACE_ID = (tu space id)
   - CONTENTFUL_ACCESS_TOKEN = (Content Delivery API token)
   - CONTENTFUL_PREVIEW_TOKEN = (opcional, preview token)

3. En GitHub, ve a Settings → Secrets → Actions y añade:
   - NETLIFY_AUTH_TOKEN = (Netlify personal access token)
   - NETLIFY_SITE_ID = (Site ID que Netlify te entrega)

4. Push a la rama `main`. El workflow correrá y deployará a Netlify automáticamente.

Notas:
- El build command es `npm run build` y el directorio publicado es `_site`.
- Si prefieres no usar Actions, en Netlify puedes conectar el repo y Netlify correrá builds automáticamente.
