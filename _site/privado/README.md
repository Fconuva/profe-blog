# Sección Privada

Esta carpeta contiene la sección privada del sitio web con autenticación.

## Archivos

- `index.html`: Página de login con autenticación
- `dashboard.html`: Dashboard principal con acceso a las herramientas temporales

## Credenciales de Acceso

- **Usuario**: fconuva
- **Contraseña**: xixo97879375

## Funcionalidades

- Autenticación basada en sessionStorage
- Redirección automática si no está logueado
- Acceso a herramientas temporales:
  - Herramienta de Interrogación: Mocha Dick
  - Herramienta de Nota de Proceso: Metamorfosis

## Seguridad

La autenticación se maneja del lado del cliente usando sessionStorage. Para producción, se recomienda implementar autenticación del lado del servidor.
