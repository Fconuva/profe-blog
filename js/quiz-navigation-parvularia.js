// Sistema de Navegación para Quiz de Parvularia

(function() {
  'use strict';
  
  // Estado del navegador
  const navState = {
    currentQuestion: 1,
    totalQuestions: 50,
    answeredQuestions: new Set(),
    correctAnswers: new Set()
  };
  
  // Inicializar navegación cuando el DOM esté listo
  function initNavigation() {
    console.log('[QUIZ NAV] Inicializando navegación de preguntas...');
    
    // Crear navegador
    createNavigator();
    
    // Ocultar todas las preguntas excepto la primera
    hideAllQuestionsExceptFirst();
    
    // Configurar listeners de respuestas
    setupAnswerListeners();
    
    // Actualizar UI
    updateUI();
    
    console.log('[QUIZ NAV] Sistema de navegación activo');
  }
  
  // Crear el HTML del navegador
  function createNavigator() {
    const container = document.querySelector('.max-w-7xl.mx-auto');
    if (!container) return;
    
    const navigatorHTML = `
      <div class="quiz-navigator sticky top-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-2xl p-6 mb-8 z-50">
        <div class="text-center mb-4">
          <h3 class="text-2xl font-bold text-white">
            Pregunta <span id="current-q">1</span> de ${navState.totalQuestions}
          </h3>
        </div>
        
        <div class="flex gap-4 justify-center mb-4">
          <button id="btn-prev" class="bg-white text-purple-600 px-6 py-2 rounded-lg font-bold hover:bg-purple-100 transition disabled:opacity-50 disabled:cursor-not-allowed">
            ← Anterior
          </button>
          <button id="btn-next" class="bg-white text-purple-600 px-6 py-2 rounded-lg font-bold hover:bg-purple-100 transition disabled:opacity-50 disabled:cursor-not-allowed">
            Siguiente →
          </button>
        </div>
        
        <div class="bg-white bg-opacity-20 rounded-lg p-4">
          <div class="flex justify-between text-white text-sm mb-2">
            <span id="answered-count">0/${navState.totalQuestions} respondidas</span>
            <span id="correct-count">0 correctas</span>
          </div>
          <div class="bg-white bg-opacity-30 rounded-full h-3 overflow-hidden">
            <div id="progress-bar" class="bg-green-400 h-full transition-all duration-500" style="width: 0%"></div>
          </div>
        </div>
        
        <div class="mt-4">
          <p class="text-white text-xs text-center mb-2">Ir a pregunta:</p>
          <div id="question-dots" class="grid grid-cols-10 gap-2"></div>
        </div>
      </div>
    `;
    
    const firstQuestion = document.querySelector('.pregunta-container');
    if (firstQuestion) {
      firstQuestion.insertAdjacentHTML('beforebegin', navigatorHTML);
      createQuestionDots();
      setupNavigationButtons();
    }
  }
  
  // Crear los botones individuales para cada pregunta
  function createQuestionDots() {
    const dotsContainer = document.getElementById('question-dots');
    if (!dotsContainer) return;
    
    for (let i = 1; i <= navState.totalQuestions; i++) {
      const dot = document.createElement('button');
      dot.className = 'question-dot w-10 h-10 rounded-full bg-white bg-opacity-30 text-white font-bold hover:bg-opacity-50 transition text-sm';
      dot.textContent = i;
      dot.dataset.question = i;
      dot.addEventListener('click', () => goToQuestion(i));
      dotsContainer.appendChild(dot);
    }
  }
  
  // Configurar botones de navegación
  function setupNavigationButtons() {
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    
    if (btnPrev) {
      btnPrev.addEventListener('click', () => navigateQuestion(-1));
    }
    
    if (btnNext) {
      btnNext.addEventListener('click', () => navigateQuestion(1));
    }
  }
  
  // Ocultar todas las preguntas excepto la primera
  function hideAllQuestionsExceptFirst() {
    const questions = document.querySelectorAll('.pregunta-container');
    questions.forEach((q, index) => {
      if (index === 0) {
        q.style.display = 'block';
      } else {
        q.style.display = 'none';
      }
    });
  }
  
  // Navegar entre preguntas
  function navigateQuestion(direction) {
    const newQuestion = navState.currentQuestion + direction;
    if (newQuestion >= 1 && newQuestion <= navState.totalQuestions) {
      goToQuestion(newQuestion);
    }
  }
  
  // Ir a una pregunta específica
  function goToQuestion(questionNum) {
    if (questionNum < 1 || questionNum > navState.totalQuestions) return;
    
    console.log(`[QUIZ NAV] Navegando a pregunta ${questionNum}`);
    
    // Ocultar pregunta actual
    const questions = document.querySelectorAll('.pregunta-container');
    questions.forEach((q, index) => {
      q.style.display = (index + 1 === questionNum) ? 'block' : 'none';
    });
    
    // Actualizar estado
    navState.currentQuestion = questionNum;
    
    // Actualizar UI
    updateUI();
    
    // Scroll al top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // Actualizar UI del navegador
  function updateUI() {
    // Número actual
    const currentQ = document.getElementById('current-q');
    if (currentQ) {
      currentQ.textContent = navState.currentQuestion;
    }
    
    // Botones prev/next
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    
    if (btnPrev) {
      btnPrev.disabled = (navState.currentQuestion === 1);
    }
    
    if (btnNext) {
      btnNext.disabled = (navState.currentQuestion === navState.totalQuestions);
    }
    
    // Actualizar dots
    const dots = document.querySelectorAll('.question-dot');
    dots.forEach((dot, index) => {
      const questionNum = index + 1;
      
      // Remover todas las clases de estado
      dot.classList.remove('bg-green-500', 'bg-yellow-500', 'ring-4', 'ring-white', 'bg-opacity-30');
      
      // Pregunta actual
      if (questionNum === navState.currentQuestion) {
        dot.classList.add('bg-yellow-500', 'ring-4', 'ring-white', 'scale-110');
      }
      // Pregunta respondida
      else if (navState.answeredQuestions.has(questionNum)) {
        dot.classList.add('bg-green-500');
      }
      // No respondida
      else {
        dot.classList.add('bg-white', 'bg-opacity-30');
      }
    });
    
    // Actualizar contadores
    updateCounters();
  }
  
  // Actualizar contadores de progreso
  function updateCounters() {
    const answered = navState.answeredQuestions.size;
    const correct = navState.correctAnswers.size;
    const percentage = (answered / navState.totalQuestions) * 100;
    
    const answeredCount = document.getElementById('answered-count');
    const correctCount = document.getElementById('correct-count');
    const progressBar = document.getElementById('progress-bar');
    
    if (answeredCount) {
      answeredCount.textContent = `${answered}/${navState.totalQuestions} respondidas`;
    }
    
    if (correctCount) {
      correctCount.textContent = `${correct} correctas`;
    }
    
    if (progressBar) {
      progressBar.style.width = percentage + '%';
    }
  }
  
  // Configurar listeners para las respuestas
  function setupAnswerListeners() {
    document.addEventListener('change', function(e) {
      if (e.target.type === 'radio' && e.target.dataset.question) {
        const questionNum = parseInt(e.target.dataset.question);
        const userAnswer = e.target.value;
        
        // Marcar como respondida
        navState.answeredQuestions.add(questionNum);
        
        // Verificar si es correcta
        const pregunta = window.planData?.exam?.preguntas?.[questionNum - 1];
        if (pregunta && userAnswer === pregunta.respuesta_correcta) {
          navState.correctAnswers.add(questionNum);
        }
        
        // Actualizar UI
        updateUI();
        
        console.log(`[QUIZ NAV] P${questionNum} respondida: ${userAnswer}`);
      }
    });
  }
  
  // Mostrar resultado final cuando se completen todas
  function checkCompletion() {
    if (navState.answeredQuestions.size === navState.totalQuestions) {
      const percentage = (navState.correctAnswers.size / navState.totalQuestions) * 100;
      
      setTimeout(() => {
        const modalHTML = `
          <div id="result-modal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999]">
            <div class="bg-white rounded-2xl p-8 max-w-md shadow-2xl transform scale-100 transition-all">
              <div class="text-center">
                <div class="text-6xl mb-4">🎉</div>
                <h3 class="text-3xl font-bold mb-4 text-gray-800">¡Quiz Completado!</h3>
                <p class="text-5xl font-bold mb-2 ${percentage >= 60 ? 'text-green-600' : 'text-orange-600'}">
                  ${navState.correctAnswers.size}/${navState.totalQuestions}
                </p>
                <p class="text-2xl font-semibold mb-6 text-gray-600">${percentage.toFixed(1)}%</p>
                <div class="text-xl mb-6">
                  ${percentage >= 80 ? '🌟 ¡Excelente dominio!' : 
                    percentage >= 60 ? '👍 Buen trabajo, sigue así' : 
                    '📚 Revisa el material de estudio'}
                </div>
                <button onclick="document.getElementById('result-modal').remove()" 
                        class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        `;
        
        if (!document.getElementById('result-modal')) {
          document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
      }, 500);
    }
  }
  
  // Verificar completitud periódicamente
  setInterval(checkCompletion, 2000);
  
  // Iniciar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }
  
})();
