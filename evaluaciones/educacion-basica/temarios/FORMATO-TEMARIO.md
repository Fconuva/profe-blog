# Formato estructurado de temarios

## Estructura JSON

```json
{
  "metadata": {
    "asignatura": "",
    "fuente_pdf": "",
    "anio_referencia": 2020,
    "ultima_revision": "2025-10-27",
    "notas": ""
  },
  "ejes": [
    {
      "nombre": "",
      "objetivos": [
        { "codigo": "", "descripcion": "" }
      ],
      "habilidades": [
        { "codigo": "", "descripcion": "" }
      ],
      "observaciones": ""
    }
  ],
  "orientaciones_evaluacion": {
    "tipos_pregunta": [
      { "tipo": "", "descripcion": "" }
    ],
    "conexiones_pruebas": [
      {
        "codigo_prueba": "",
        "notas": ""
      }
    ]
  }
}
```

## Pautas de llenado

- **metadata**: indicar asignatura según Mineduc, fuente exacta y fecha de la última revisión manual.
- **ejes**: agrupar contenidos por eje curricular; cada objetivo u habilidad debe citar el código oficial cuando exista.
- **orientaciones_evaluacion**: describir tipos de ítems esperados y vincular secciones de pruebas publicadas.
- Utilizar arrays vacíos cuando aún no se dispone de información; evitar eliminar claves para mantener consistencia.
