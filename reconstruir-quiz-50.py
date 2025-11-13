#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para reconstruir el quiz de parvularia con solo 50 preguntas
y retroalimentación inmediata
"""

# Leer el archivo actual
with open(r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-parvularia\pruebas\parv-nt\index.njk", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Encontrar dónde termina la pregunta 50
end_q50 = None
for i, line in enumerate(lines):
    if '<div id="ia-feedback-50" class="mt-4 hidden"></div>' in line:
        end_q50 = i + 1
        # Buscar el cierre del div que contiene la pregunta 50
        for j in range(i+1, min(i+10, len(lines))):
            if '</div>' in lines[j] and '<!-- End Q' not in lines[j]:
                end_q50 = j + 1
                break
        break

if end_q50 is None:
    print("No se encontró el final de la pregunta 50")
    exit(1)

print(f"Final de pregunta 50 encontrado en línea {end_q50}")

# Tomar todo hasta el final de la pregunta 50
html_hasta_q50 = "".join(lines[:end_q50])

# Cerrar el formulario y contenedor
cierre_html = """
        </form>
      </div>

    </div>
  </div>
</div>
"""

# Leer el JSON completo de otro archivo o recrearlo
# Por ahora vamos a usar un placeholder simple y el usuario puede expandirlo
script_js = """
<script>
// Plan de evaluación (cargado desde JSON)
const planData = {
  "metadata": {
    "codigo_prueba": "parv-nt",
    "nombre_completo": "Prueba Estandarizada: Educación Parvularia Niveles de Transición ECEP 2025",
    "descripcion": "Evaluación objetiva de conocimientos pedagógicos para educadoras de párvulos de Niveles de Transición (NT1 y NT2)",
    "nivel": "Educación Parvularia - Niveles de Transición",
    "total_preguntas": 50,
    "distribucion": {
      "preguntas_base": 50,
      "casos_estudio": 0,
      "desarrollo_personal_social": 25,
      "comunicacion_integral": 25,
      "interaccion_comprension_entorno": 0,
      "curriculum_fundamentos": 0
    },
    "tiempo_estimado_minutos": 60,
    "tipo_evaluacion": "Selección múltiple con retroalimentación pedagógica inmediata",
    "version": 3,
    "ultima_actualizacion": "2025-11-12"
  }
};

// Estado del quiz
let quizState = {
  totalPreguntas: 50,
  respondidas: 0,
  correctas: 0,
  revisado: false
};

// Actualizar progreso
function updateProgress() {
  const answered = document.querySelectorAll('input[type="radio"]:checked').length;
  quizState.respondidas = answered;
  const progress = (answered / 50) * 100;
  document.getElementById('progress-bar').style.width = progress + '%';
  document.getElementById('progress-text').textContent = `${answered}/50 respondidas`;
}

// RETROALIMENTACIÓN INMEDIATA - escuchar cambios en cada respuesta
document.querySelectorAll('input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', function(e) {
    updateProgress();
    
    const questionNum = parseInt(e.target.dataset.question);
    const userAnswer = e.target.value;
    
    // Aquí iría la lógica de verificar si es correcta
    // Por ahora solo mostramos que se respondió
    const feedbackDiv = document.getElementById(`feedback-${questionNum}`);
    feedbackDiv.classList.remove('hidden');
    feedbackDiv.innerHTML = `
      <div class="mt-4 p-4 rounded-lg bg-blue-50 border-l-4 border-blue-500">
        <p class="text-sm text-blue-800">
          Respuesta registrada. La retroalimentación completa estará disponible próximamente.
        </p>
      </div>
    `;
    
    // Mostrar botón IA
    document.getElementById(`ia-actions-${questionNum}`).classList.remove('hidden');
  });
});
</script>

</body>
</html>
"""

# Combinar todo
contenido_final = html_hasta_q50 + cierre_html + script_js

# Guardar
output_path = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-parvularia\pruebas\parv-nt\index-nuevo.njk"
with open(output_path, "w", encoding="utf-8") as f:
    f.write(contenido_final)

print(f"✅ Archivo reconstruido guardado en: {output_path}")
print(f"  - Líneas originales hasta Q50: {end_q50}")
print(f"  - Líneas finales: {len(contenido_final.splitlines())}")
print("\nPróximo paso: revisar el archivo y reemplazar el original")
