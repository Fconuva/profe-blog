Deploy a Vercel
===============

Pasos rápidos:

1. Crea un proyecto en [Vercel](https://vercel.com) y conéctalo a este repositorio (importar desde GitHub → seleccionar `profe-blog`).
2. En la configuración del proyecto, define las variables de entorno necesarias (por ejemplo credenciales de Firebase y tokens de servicios externos). Las builds usan Node 18 y ejecutan `npm run build`, publicando la carpeta `_site`.
3. Cada push a la rama `main` dispara automáticamente un deploy en Vercel. Puedes lanzar un preview manual desde la interfaz si necesitas validar una rama distinta.

Notas:
- Para ajustes manuales usa `vercel --prod` con la CLI si requieres un deploy inmediato desde tu máquina.
- Revisa el dashboard de Vercel para logs de build y estado de las funciones Edge/Serverless.
