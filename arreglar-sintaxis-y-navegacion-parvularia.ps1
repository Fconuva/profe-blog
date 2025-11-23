# Script para corregir errores de sintaxis y agregar navegación entre preguntas

$filePath = "evaluaciones\educacion-parvularia\pruebas\parv-nt\index.njk"

Write-Host "`n=== ARREGLANDO EXAMEN PARVULARIA ===" -ForegroundColor Cyan
Write-Host "Archivo: $filePath" -ForegroundColor White

# Leer archivo
$content = Get-Content $filePath -Raw -Encoding UTF8

# 1. CORREGIR ERRORES DE SINTAXIS: reemplazar `n por salto de línea normal
Write-Host "`n[1/3] Corrigiendo errores de sintaxis..." -ForegroundColor Yellow
$before = $content
$content = $content -replace '",`n        "explicacion":', '",\n        "explicacion":'
$changesCount = ([regex]::Matches($before, '`n')).Count
Write-Host "  ✓ Corregidos $changesCount errores de template string" -ForegroundColor Green

# 2. AGREGAR ESTILOS CSS PARA NAVEGACIÓN
Write-Host "`n[2/3] Agregando estilos de navegación..." -ForegroundColor Yellow

$cssNavegacion = @'
<style>
  /* Ocultar todas las preguntas por defecto */
  .pregunta-container {
    display: none;
  }
  
  /* Mostrar solo la pregunta activa */
  .pregunta-container.active {
    display: block;
  }
  
  /* Navegador de preguntas */
  .quiz-navigator {
    position: sticky;
    top: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
    margin-bottom: 2rem;
    z-index: 100;
  }
  
  .question-number {
    font-size: 2rem;
    font-weight: bold;
    color: white;
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .nav-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1rem;
  }
  
  .nav-btn {
    background: white;
    color: #667eea;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }
  
  .nav-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  }
  
  .nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .question-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .question-dot {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(255,255,255,0.3);
    color: white;
    border: 2px solid rgba(255,255,255,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .question-dot:hover {
    background: rgba(255,255,255,0.5);
    transform: scale(1.1);
  }
  
  .question-dot.answered {
    background: #10b981;
    border-color: #059669;
  }
  
  .question-dot.current {
    background: #f59e0b;
    border-color: #d97706;
    transform: scale(1.2);
  }
  
  .progress-section {
    background: rgba(255,255,255,0.2);
    border-radius: 8px;
    padding: 1rem;
    margin-top: 1rem;
  }
  
  .progress-bar-container {
    background: rgba(255,255,255,0.3);
    border-radius: 10px;
    height: 10px;
    overflow: hidden;
  }
  
  .progress-bar-fill {
    background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
    height: 100%;
    width: 0%;
    transition: width 0.5s ease;
  }
</style>
'@

# Buscar dónde insertar los estilos (antes del cierre de head)
$headClosingTag = "</head>"
if ($content -match [regex]::Escape($headClosingTag)) {
    $content = $content -replace [regex]::Escape($headClosingTag), ($cssNavegacion + "`n" + $headClosingTag)
    Write-Host "  ✓ Estilos CSS agregados" -ForegroundColor Green
} else {
    Write-Host "  ⚠ No se encontró cierre de head, estilos no agregados" -ForegroundColor Yellow
}

# 3. AGREGAR SCRIPT DE NAVEGACIÓN
Write-Host "`n[3/3] Agregando script de navegación..." -ForegroundColor Yellow

$scriptNavegacion = @'

<!-- Sistema de Navegación entre Preguntas -->
<div class="quiz-navigator">
  <div class="question-number" id="current-question-number">
    Pregunta <span id="current-num">1</span> de 58
  </div>
  
  <div class="nav-buttons">
    <button class="nav-btn" id="btn-prev" onclick="navigateQuestion(-1)" disabled>
      ← Anterior
    </button>
    <button class="nav-btn" id="btn-next" onclick="navigateQuestion(1)">
      Siguiente →
    </button>
  </div>
  
  <div class="progress-section">
    <div class="flex justify-between text-white text-sm mb-2">
      <span id="answered-count">0/58 respondidas</span>
      <span id="correct-count">0 correctas</span>
    </div>
    <div class="progress-bar-container">
      <div class="progress-bar-fill" id="progress-fill"></div>
    </div>
  </div>
  
  <div class="question-grid" id="question-grid">
    <!-- Se genera dinámicamente con JavaScript -->
  </div>
</div>

<script>
// Estado global del quiz
const quizNavigation = {
  currentQuestion: 1,
  totalQuestions: 58,
  answeredQuestions: new Set(),
  correctAnswers: new Set()
};

// Inicializar navegación
function initQuizNavigation() {
  console.log('[QUIZ NAV] Inicializando navegación...');
  
  // Ocultar todas las preguntas excepto la primera
  const allQuestions = document.querySelectorAll('.pregunta-container');
  allQuestions.forEach((q, index) => {
    if (index === 0) {
      q.classList.add('active');
    } else {
      q.classList.remove('active');
    }
  });
  
  // Generar grid de navegación
  generateQuestionGrid();
  
  // Actualizar UI
  updateNavigationUI();
  
  console.log('[QUIZ NAV] Navegación inicializada correctamente');
}

// Generar grid de botones de navegación
function generateQuestionGrid() {
  const grid = document.getElementById('question-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  for (let i = 1; i <= quizNavigation.totalQuestions; i++) {
    const dot = document.createElement('div');
    dot.className = 'question-dot';
    dot.textContent = i;
    dot.id = `dot-${i}`;
    dot.onclick = () => goToQuestion(i);
    grid.appendChild(dot);
  }
}

// Navegar entre preguntas
function navigateQuestion(direction) {
  const newQuestion = quizNavigation.currentQuestion + direction;
  if (newQuestion >= 1 && newQuestion <= quizNavigation.totalQuestions) {
    goToQuestion(newQuestion);
  }
}

// Ir a pregunta específica
function goToQuestion(questionNum) {
  if (questionNum < 1 || questionNum > quizNavigation.totalQuestions) return;
  
  console.log(`[QUIZ NAV] Navegando a pregunta ${questionNum}`);
  
  // Ocultar pregunta actual
  const currentContainer = document.querySelector('.pregunta-container.active');
  if (currentContainer) {
    currentContainer.classList.remove('active');
  }
  
  // Mostrar nueva pregunta
  const allQuestions = document.querySelectorAll('.pregunta-container');
  if (allQuestions[questionNum - 1]) {
    allQuestions[questionNum - 1].classList.add('active');
  }
  
  // Actualizar estado
  quizNavigation.currentQuestion = questionNum;
  
  // Actualizar UI
  updateNavigationUI();
  
  // Scroll al top suave
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Actualizar UI de navegación
function updateNavigationUI() {
  const current = quizNavigation.currentQuestion;
  
  // Actualizar número actual
  const currentNumSpan = document.getElementById('current-num');
  if (currentNumSpan) {
    currentNumSpan.textContent = current;
  }
  
  // Habilitar/deshabilitar botones
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  
  if (btnPrev) {
    btnPrev.disabled = (current === 1);
  }
  
  if (btnNext) {
    btnNext.disabled = (current === quizNavigation.totalQuestions);
  }
  
  // Actualizar dots
  const allDots = document.querySelectorAll('.question-dot');
  allDots.forEach((dot, index) => {
    const questionNum = index + 1;
    dot.classList.remove('current');
    
    if (questionNum === current) {
      dot.classList.add('current');
    }
    
    if (quizNavigation.answeredQuestions.has(questionNum)) {
      dot.classList.add('answered');
    } else {
      dot.classList.remove('answered');
    }
  });
  
  // Actualizar contadores
  updateProgressCounters();
}

// Actualizar contadores de progreso
function updateProgressCounters() {
  const answeredCount = quizNavigation.answeredQuestions.size;
  const correctCount = quizNavigation.correctAnswers.size;
  const percentage = (answeredCount / quizNavigation.totalQuestions) * 100;
  
  const answeredSpan = document.getElementById('answered-count');
  const correctSpan = document.getElementById('correct-count');
  const progressFill = document.getElementById('progress-fill');
  
  if (answeredSpan) {
    answeredSpan.textContent = `${answeredCount}/58 respondidas`;
  }
  
  if (correctSpan) {
    correctSpan.textContent = `${correctCount} correctas`;
  }
  
  if (progressFill) {
    progressFill.style.width = percentage + '%';
  }
}

// Marcar pregunta como respondida
function markQuestionAnswered(questionNum, isCorrect) {
  quizNavigation.answeredQuestions.add(questionNum);
  
  if (isCorrect) {
    quizNavigation.correctAnswers.add(questionNum);
  }
  
  updateNavigationUI();
}

// Modificar la función showImmediateFeedback existente para integrar navegación
const originalShowFeedback = window.showImmediateFeedback;
window.showImmediateFeedback = function(questionNum, userAnswer) {
  // Llamar función original
  if (originalShowFeedback) {
    originalShowFeedback(questionNum, userAnswer);
  }
  
  // Obtener datos de la pregunta
  const pregunta = planData.exam.preguntas[questionNum - 1];
  if (!pregunta) return;
  
  const isCorrect = userAnswer === pregunta.respuesta_correcta;
  
  // Marcar como respondida
  markQuestionAnswered(questionNum, isCorrect);
  
  console.log(`[QUIZ NAV] Pregunta ${questionNum} respondida. Correcta: ${isCorrect}`);
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Esperar un poco para asegurar que todo esté cargado
  setTimeout(initQuizNavigation, 500);
  
  console.log('[QUIZ NAV] Listener DOM cargado');
});
</script>
'@

# Buscar dónde insertar el script (antes del cierre del body o al final)
$bodyClosingTag = "</body>"
if ($content -match [regex]::Escape($bodyClosingTag)) {
    $content = $content -replace [regex]::Escape($bodyClosingTag), ($scriptNavegacion + "`n" + $bodyClosingTag)
    Write-Host "  ✓ Script de navegación agregado" -ForegroundColor Green
} else {
    # Si no hay body, agregar al final del archivo
    $content = $content + "`n" + $scriptNavegacion
    Write-Host "  ✓ Script de navegación agregado al final" -ForegroundColor Green
}

# Guardar archivo
$content | Out-File $filePath -Encoding UTF8 -NoNewline

Write-Host "`n=== COMPLETADO ===" -ForegroundColor Green
Write-Host "✓ Errores de sintaxis corregidos: $changesCount" -ForegroundColor White
Write-Host "✓ Sistema de navegación agregado" -ForegroundColor White
Write-Host "✓ Preguntas ahora se muestran de una en una" -ForegroundColor White
Write-Host "✓ Navegador con botones y grid de 58 preguntas" -ForegroundColor White
Write-Host "`nPrueba el sitio con: npm run build && npm start" -ForegroundColor Cyan
