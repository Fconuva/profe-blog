/**
 * Asistente IA para Dossiers de Lenguaje y Comunicación
 * Usa Groq API (LLaMA 3.1) para responder dudas sobre contenido
 */

class AIAssistantLenguaje {
  constructor(dominio, contenido) {
    this.dominio = dominio;
    this.contenido = contenido;
    this.isLoading = false;
    this.conversationHistory = [];
    this.init();
  }

  init() {
    this.createWidget();
    this.attachEventListeners();
  }

  createWidget() {
    const widget = document.createElement('div');
    widget.id = 'ai-assistant-widget';
    widget.className = 'ai-assistant-widget';
    widget.innerHTML = `
      <div class="ai-widget-header">
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <i class="bi bi-robot me-2"></i>
            <strong>Asistente IA</strong>
            <span class="badge bg-light text-dark ms-2">Groq LLaMA 3.1</span>
          </div>
          <button class="btn btn-sm btn-link text-white" id="toggle-ai-widget">
            <i class="bi bi-chevron-down"></i>
          </button>
        </div>
        <small class="text-white-50 d-block mt-1">${this.dominio}</small>
      </div>
      <div class="ai-widget-body" id="ai-widget-body">
        <div class="ai-chat-container" id="ai-chat-container">
          <div class="ai-welcome-message">
            <i class="bi bi-lightbulb-fill text-warning mb-2" style="font-size: 2rem;"></i>
            <p class="mb-2"><strong>¡Hola! Soy tu asistente de estudio.</strong></p>
            <p class="small text-muted mb-0">
              Puedo ayudarte con dudas sobre:
              <ul class="small mt-2 mb-0">
                <li>Figuras literarias y ejemplos</li>
                <li>Técnicas narrativas</li>
                <li>Análisis de textos</li>
                <li>Ejercicios y aplicaciones</li>
              </ul>
            </p>
          </div>
        </div>
        <div class="ai-input-container">
          <div class="ai-suggestions mb-2" id="ai-suggestions"></div>
          <div class="input-group">
            <input 
              type="text" 
              class="form-control" 
              id="ai-question-input" 
              placeholder="Escribe tu pregunta sobre el contenido..."
              aria-label="Pregunta para el asistente IA"
            />
            <button 
              class="btn btn-primary" 
              id="ai-send-btn"
              disabled
            >
              <i class="bi bi-send-fill"></i>
            </button>
          </div>
          <small class="text-muted d-block mt-1">
            <i class="bi bi-shield-check me-1"></i>Respuestas generadas por IA - verifica la información
          </small>
        </div>
      </div>
    `;

    document.body.appendChild(widget);
    this.loadSuggestions();
  }

  loadSuggestions() {
    const suggestionsContainer = document.getElementById('ai-suggestions');
    const suggestions = this.getSuggestionsForDominio();
    
    if (suggestions.length > 0) {
      suggestionsContainer.innerHTML = `
        <div class="d-flex gap-2 flex-wrap">
          ${suggestions.map(s => `
            <button class="btn btn-sm btn-outline-primary ai-suggestion-btn" data-question="${s}">
              ${s}
            </button>
          `).join('')}
        </div>
      `;

      // Event listeners para sugerencias
      document.querySelectorAll('.ai-suggestion-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const question = e.currentTarget.dataset.question;
          document.getElementById('ai-question-input').value = question;
          this.sendQuestion(question);
        });
      });
    }
  }

  getSuggestionsForDominio() {
    const suggestions = {
      'Textos Literarios': [
        '¿Qué es una metáfora?',
        'Diferencia entre símil y metáfora',
        '¿Qué es el narrador omnisciente?'
      ],
      'Textos No Literarios': [
        '¿Qué es un argumento lógico?',
        'Tipos de falacias',
        '¿Qué es el discurso público?'
      ],
      'Coherencia y Cohesión': [
        '¿Qué son los conectores?',
        'Diferencia entre anáfora y catáfora',
        'Tipos de conectores'
      ],
      'Adecuación Comunicativa': [
        'Reglas de acentuación',
        'Uso de la coma',
        '¿Qué es la modalización?'
      ]
    };

    return suggestions[this.dominio] || [];
  }

  attachEventListeners() {
    const input = document.getElementById('ai-question-input');
    const sendBtn = document.getElementById('ai-send-btn');
    const toggleBtn = document.getElementById('toggle-ai-widget');

    // Toggle widget
    toggleBtn.addEventListener('click', () => {
      const body = document.getElementById('ai-widget-body');
      const icon = toggleBtn.querySelector('i');
      body.classList.toggle('collapsed');
      icon.classList.toggle('bi-chevron-down');
      icon.classList.toggle('bi-chevron-up');
    });

    // Enable/disable send button
    input.addEventListener('input', (e) => {
      sendBtn.disabled = e.target.value.trim().length === 0;
    });

    // Send on Enter
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !sendBtn.disabled) {
        this.sendQuestion(input.value);
      }
    });

    // Send on button click
    sendBtn.addEventListener('click', () => {
      this.sendQuestion(input.value);
    });
  }

  async sendQuestion(question) {
    if (this.isLoading || !question.trim()) return;

    this.isLoading = true;
    const input = document.getElementById('ai-question-input');
    const sendBtn = document.getElementById('ai-send-btn');
    const chatContainer = document.getElementById('ai-chat-container');

    // Clear welcome message
    const welcomeMsg = chatContainer.querySelector('.ai-welcome-message');
    if (welcomeMsg) welcomeMsg.remove();

    // Add user message
    this.addMessage('user', question);
    input.value = '';
    sendBtn.disabled = true;

    // Show loading
    const loadingId = this.addMessage('assistant', '...', true);

    try {
      const systemPrompt = this.buildSystemPrompt();
      
      const response = await fetch('/api/groq-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          systemPrompt,
          pregunta: question
        })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Remove loading message
      document.getElementById(loadingId)?.remove();

      // Add AI response
      this.addMessage('assistant', data.respuesta);

      // Save to history
      this.conversationHistory.push({
        question,
        answer: data.respuesta,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al consultar IA:', error);
      
      // Remove loading message
      document.getElementById(loadingId)?.remove();

      // Show error
      this.addMessage('assistant', `
        ⚠️ No pude procesar tu pregunta. 
        
        **Posibles causas:**
        - Problema de conexión
        - API temporalmente no disponible
        
        **Sugerencia:** Intenta de nuevo en unos segundos o consulta directamente el contenido de esta página.
      `, false, true);
    } finally {
      this.isLoading = false;
    }
  }

  buildSystemPrompt() {
    return `Eres un profesor experto en Lenguaje y Comunicación para Educación Media en Chile.

**Tu especialidad:** ${this.dominio}

**Contexto del contenido disponible:**
${this.contenido}

**Instrucciones:**
1. Responde SOLO sobre el contenido de ${this.dominio}
2. Usa ejemplos concretos del currículum chileno
3. Si la pregunta no está relacionada con ${this.dominio}, redirige amablemente al tema
4. Sé claro, pedagógico y motivador
5. Usa formato Markdown para estructurar tu respuesta
6. Menciona figuras literarias, autores chilenos o ejemplos del temario cuando sea relevante
7. Si no sabes algo, admítelo y sugiere consultar fuentes oficiales

**Tono:** Cercano pero profesional, como un profesor que ayuda a estudiar para la PAES.`;
  }

  addMessage(role, content, isLoading = false, isError = false) {
    const chatContainer = document.getElementById('ai-chat-container');
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const messageDiv = document.createElement('div');
    messageDiv.id = messageId;
    messageDiv.className = `ai-message ai-message-${role} ${isLoading ? 'ai-loading' : ''}`;
    
    if (role === 'user') {
      messageDiv.innerHTML = `
        <div class="ai-message-avatar">
          <i class="bi bi-person-circle"></i>
        </div>
        <div class="ai-message-content">
          <div class="ai-message-text">${this.escapeHtml(content)}</div>
        </div>
      `;
    } else {
      const formattedContent = isLoading ? 
        '<span class="typing-indicator"><span></span><span></span><span></span></span>' : 
        this.formatMarkdown(content);

      messageDiv.innerHTML = `
        <div class="ai-message-avatar ${isError ? 'bg-warning' : ''}">
          <i class="bi ${isError ? 'bi-exclamation-triangle' : 'bi-robot'}"></i>
        </div>
        <div class="ai-message-content">
          <div class="ai-message-text">${formattedContent}</div>
          ${!isLoading && !isError ? `
            <div class="ai-message-actions">
              <button class="btn btn-sm btn-link" onclick="navigator.clipboard.writeText(\`${this.escapeHtml(content).replace(/`/g, '\\`')}\`)">
                <i class="bi bi-clipboard"></i> Copiar
              </button>
            </div>
          ` : ''}
        </div>
      `;
    }

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    return messageId;
  }

  formatMarkdown(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.+)$/gm, '<p>$1</p>')
      .replace(/<p><ul>/g, '<ul>')
      .replace(/<\/ul><\/p>/g, '</ul>');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Auto-inicializar en dossiers
document.addEventListener('DOMContentLoaded', () => {
  const dominioMeta = document.querySelector('meta[name="dominio-lenguaje"]');
  const contenidoMeta = document.querySelector('meta[name="contenido-resumen"]');

  if (dominioMeta && contenidoMeta) {
    new AIAssistantLenguaje(
      dominioMeta.content,
      contenidoMeta.content
    );
  }
});
