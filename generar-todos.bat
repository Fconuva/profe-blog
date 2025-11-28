@echo off
echo.
echo === GENERADOR DE PDFs DOSSIERES ECEP 2025 ===
echo.

node generar-pdf-individual.js DOSSIER_MATEMATICA_MEDIA_COMPLETO.html DOSSIER_MATEMATICA_MEDIA.pdf
node generar-pdf-individual.js DOSSIER_HISTORIA_MEDIA_COMPLETO.html DOSSIER_HISTORIA_MEDIA.pdf
node generar-pdf-individual.js DOSSIER_CIENCIAS_NATURALES_MEDIA_COMPLETO.html DOSSIER_CIENCIAS_NATURALES_MEDIA.pdf
node generar-pdf-individual.js DOSSIER_INGLES_MEDIA_COMPLETO.html DOSSIER_INGLES_MEDIA.pdf
node generar-pdf-individual.js DOSSIER_EDUCACION_FISICA_MEDIA_COMPLETO.html DOSSIER_EDUCACION_FISICA_MEDIA.pdf
node generar-pdf-individual.js DOSSIER_EDUCACION_BASICA_COMPLETO.html DOSSIER_EDUCACION_BASICA.pdf
node generar-pdf-individual.js DOSSIER_PIE_EDUCACION_ESPECIAL_COMPLETO.html DOSSIER_PIE_EDUCACION_ESPECIAL.pdf

echo.
echo === COMPLETADO ===
echo.
dir dossieres-pdf\*.pdf
echo.
pause
