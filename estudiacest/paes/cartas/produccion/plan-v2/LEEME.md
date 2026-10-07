# Entrega de planificación: Crónicas del Umbral

La ampliación se encuentra especificada, no implementada. La versión pública anterior conserva 16 cartas. No ejecutar el generador antiguo `expandir.cjs`: no corresponde al diseño definitivo.

## Consultar

Abrir `PLAN_COMPLETO.html` con el navegador: funciona sin Internet ni instalar dependencias. Incluye los cinco documentos íntegros, las 60 fichas filtrables y la calculadora de probabilidades. Los anexos JSON se descargan desde contenido incluido en el HTML, sin depender de rutas de servidor.

También se puede ejecutar desde esta carpeta:

```powershell
node servir-plan.cjs
```

Visor local: `http://127.0.0.1:8772/`. No conecta cuentas CEST, Firebase ni el juego publicado. El único formulario auxiliar `/captura` guarda evidencia JPEG local en esta carpeta.

## Artefactos normativos

- `../PLAN_COLECCION_2_COMPLETO.md`: 22 secciones, reglas, economía, pantallas, arte y entregables.
- `CATALOGO_60.md`: 60 fichas y seis listas iniciales exactas, tres para aula y tres para colección.
- `DISENO_CARTAS_60.json`: datos de diseño, no catálogo de ejecución.
- `CONTRATO_TECNICO.md`: autorización, datos, versiones, operaciones y recuperación.
- `BALANCE_Y_PRUEBAS.md`: procedimiento reproducible y umbrales de liberación.
- `VALIDEZ_Y_CLASE.md`: secuencia de 90 minutos, enseñanza, revisión y contingencias.
- `CARTAS_60.csv`: tabla con punto y coma y BOM UTF-8 para abrir en Excel.
- `CASOS_CARTAS_480.csv` y `MAZOS_ADVERSARIALES.json`: requisitos futuros de construcción.

## Regenerar y verificar el diseño

```powershell
node compilar-diseno.cjs
node presentar-plan.cjs
```

Primero se regenera catálogo/datos/auditoría; después HTML/CSV/anexos/auditoría documental. No invertir el orden ni editar manualmente los derivados. Editar cifras en `compilar-diseno.cjs` y actualizar los documentos normativos en la misma revisión. Cambiar reglas liberadas exige una versión nueva y compatibilidad de salas/sobres anteriores.

Comprobado en esta entrega: 509 comprobaciones numéricas/de catálogo; ocho mazos adversariales válidos; nueve enlaces documentales existentes; visor con filtros, búsqueda sin tildes, seis vistas, calculadora y anexo incluido. Evidencia separada en `VERIFICACION_VISOR.json`.

Las 480 pruebas del motor v2, las 240.000 simulaciones, la muestra de un millón de sobres y el pilotaje humano son exigencias de D1–D5. **No se presentan como ejecutados.** La consistencia del diseño no demuestra equilibrio real de un motor que todavía no se ha construido.
