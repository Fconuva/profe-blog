# Subida De Notas A Lirmi

## Script canonico

- Script: `profefconuva/lirmi_upload_notes.js`
- Fuente de notas:
  - `3A` -> `lecturas/adminprofe/reportes/Planilla_Pedro_Paramo_3A_TP_2026.csv`
  - `3B` -> `lecturas/adminprofe/reportes/Planilla_Pedro_Paramo_3B_TP_2026.csv`
  - `3D` -> `lecturas/adminprofe/reportes/Planilla_Pedro_Paramo_3D_TP_2026.csv`
  - `4A` -> `lecturas/adminprofe/reportes/Planilla_Maus_4A_TP_2026.csv`
  - `4B` -> `lecturas/adminprofe/reportes/Planilla_Maus_4B_TP_2026.csv`
  - `4C` -> `lecturas/adminprofe/reportes/Planilla_Maus_4C_TP_2026.csv`
  - `4D` -> `lecturas/adminprofe/reportes/Planilla_Maus_4D_TP_2026.csv`
  - `4E` -> `lecturas/adminprofe/reportes/Planilla_Maus_4E_TP_2026.csv`

## Credenciales locales

- El script lee `LIRMI_EMAIL` y `LIRMI_PASSWORD` desde `profefconuva/.env.local`.
- No guardar credenciales en archivos versionados.
- `profefconuva/.env-Francisco.example` deja solo placeholders.

## Uso

Modo prueba, sin guardar:

```bash
cd profefconuva
npm run lirmi:dry-run -- --course 3A
```

Subida real:

```bash
cd profefconuva
npm run lirmi:upload -- --course 3A
```

Tambien acepta cursos `3B`, `3D`, `4A`, `4B`, `4C`, `4D`, `4E`.

## Comportamiento esperado

- Inicia sesion en `libro.lirmi.com`.
- Abre el curso configurado.
- Detecta la ultima columna `N` visible en la grilla, por ejemplo `N2`.
- Cruza por nombre normalizado con fallback difuso cuando hace falta.
- Deja en blanco a estudiantes ausentes o sin actividad real.
- Guarda en Lirmi al final, salvo que se use `--dry-run`.

## Regla operativa

- Si cambia la UI de Lirmi o la columna objetivo no esta clara, correr primero `--dry-run` en un curso.
- `4A` se carga solo con instruccion explicita del usuario. URL verificada: `https://libro.lirmi.com/?curso_aula_id=258082&periodo_id=1`.
