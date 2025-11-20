# Plan de Mejora: Ensayo Historia, Geografía y Ciencias Sociales (ECEP/PAES 2025)

## Objetivo
Ampliar la cobertura curricular del ensayo actual (15 preguntas) a una versión completa (40 preguntas) que abarque los 4 Dominios del Marco de la Buena Enseñanza y el Temario ECEP, incorporando recursos visuales y pedagógicos.

## Estructura de la Nueva Prueba

### Dominio 1: Pensamiento Geográfico (15%)
*   **Faltante:** Análisis de climogramas, riesgos naturales específicos (volcanismo/sismicidad), problemas ambientales actuales.
*   **Acción:**
    *   Agregar pregunta con **Climograma** de zona austral o desértica.
    *   Agregar pregunta sobre **Riesgos Naturales** (Aluviones/Tsunamis) y planificación territorial.
    *   Agregar pregunta sobre **Problemas Ambientales** (Zonas de sacrificio).

### Dominio 2: Pensamiento Histórico (40%)
*   **Faltante:** Historiografía, República Liberal (S.XIX), Modelo ISI, Dictadura y DDHH, Pueblos Originarios actuales.
*   **Acción:**
    *   **Historiografía:** Pregunta contrastando visiones (Barros Arana vs. Villalobos).
    *   **Chile S.XIX:** Leyes Laicas y secularización.
    *   **Chile S.XX:** Modelo ISI y CORFO (Gráfico de industrialización).
    *   **Quiebre 1973:** Multicausalidad del golpe.
    *   **Mundo:** Revolución Industrial (impacto social) e Imperialismo (mapa África).

### Dominio 3: Formación Ciudadana (25%)
*   **Faltante:** Instrumentos financieros, Tratados Internacionales, Funcionamiento del Mercado (Colusión/Inflación).
*   **Acción:**
    *   **Economía:** Pregunta sobre **Inflación/UF** y su impacto cotidiano.
    *   **Institucionalidad:** Rol del **SERNAC** o **Banco Central**.
    *   **DDHH:** Tratados internacionales (Convención Americana).

### Dominio 4: Enseñanza-Aprendizaje (20%) - **NUEVO**
*   **Faltante:** Estrategias didácticas, Evaluación, DUA, Errores frecuentes.
*   **Acción:**
    *   **Didáctica:** Uso de fuentes contradictorias en el aula.
    *   **Evaluación:** Retroalimentación formativa vs. sumativa.
    *   **DUA:** Estrategias para estudiantes con NEE en Historia.
    *   **Pensamiento Crítico:** Cómo formular preguntas de orden superior.

## Implementación Técnica
1.  **Generación de Recursos SVG:** Crear gráficos de climogramas y esquemas económicos directamente en código para no depender de imágenes externas.
2.  **Actualización de `index.njk`:** Reemplazar la base de datos de preguntas con la versión extendida.
3.  **Deploy:** Subir cambios al servidor.
