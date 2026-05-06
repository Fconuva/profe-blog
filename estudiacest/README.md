# Estudia CEST

Proyecto aislado para mover las rutas `/estudiantes`, `/lecturas`, `/nm4` y `/np` al dominio `estudiacest.com` usando Vercel y Firebase Realtime Database.

## Variables necesarias

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_DATABASE_URL`
- `ALLOWED_ORIGINS`

Usa `.env.example` como plantilla local y deja `.env.local` fuera de git.

## Firebase

1. Realtime Database: `https://estudiacest-default-rtdb.firebaseio.com`
2. Reglas: `firebase deploy --only database`
3. Authentication: habilitar proveedor `Email/Password`
4. Authorized domains: agregar `estudiacest.com`, `www.estudiacest.com` y el dominio preview que entregue Vercel si se necesita probar antes

## Respaldo de base antigua

1. Mantener el `.env.local` del proyecto antiguo en la carpeta padre `profefconuva`
2. Ejecutar `npm run backup:old`
3. El archivo se guarda en `backups/`

## Deploy en Vercel

1. Importar esta carpeta `profefconuva/estudiacest` como proyecto separado
2. Framework preset: `Other`
3. Root directory: `estudiacest`
4. Build command: vacío
5. Output directory: vacío
6. Configurar las variables del `.env.local` en Vercel
