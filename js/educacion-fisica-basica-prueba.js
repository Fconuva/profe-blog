(function(root) {
  'use strict';

  const preguntas = root.efBasicaPreguntas || [];
  const totalPreguntas = preguntas.length;
  let preguntaActual = 0;
  let respuestas = new Array(totalPreguntas).fill(null);

  if (!totalPreguntas) {
    console.warn('[EF Básica] No se encontraron preguntas para la práctica.');
  }

  function getIntroCard() {
    return document.querySelector('[data-efb-intro]');
  }

  function mostrarSeccionResultados(mostrarResultados) {
    const pruebaContainer = document.getElementById('prueba-container');
    const resultadosContainer = document.getElementById('resultados-container');

    if (pruebaContainer) {
      pruebaContainer.classList.toggle('hidden', mostrarResultados);
    }
    if (resultadosContainer) {
      resultadosContainer.classList.toggle('hidden', !mostrarResultados);
    }
  }

  function renderPregunta(index) {
    if (index < 0 || index >= totalPreguntas) {
      return;
    }

    preguntaActual = index;
    const pregunta = preguntas[index];
    const preguntaContenido = document.getElementById('pregunta-contenido');

    if (!pregunta || !preguntaContenido) {
      return;
    }

    const preguntaActualEl = document.getElementById('pregunta-actual');
    if (preguntaActualEl) {
      preguntaActualEl.textContent = index + 1;
    }

    const dominioActualEl = document.getElementById('dominio-actual');
    if (dominioActualEl) {
      dominioActualEl.textContent = pregunta.dominio || '';
    }

    let html = `
      <div class="mb-6">
        ${pregunta.contexto ? `<div class="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 mb-4 text-sm text-yellow-900 whitespace-pre-line">${pregunta.contexto}</div>` : ''}
        ${pregunta.imagen ? `<div class="mb-4 flex justify-center"><img src="${pregunta.imagen}" alt="Imagen de la pregunta" class="max-w-full h-auto rounded-lg shadow-md"></div>` : ''}
        <p class="text-lg leading-relaxed mb-4" style="color: #1f2937;">${pregunta.enunciado}</p>
        <div class="space-y-3">
    `;

    (pregunta.alternativas || []).forEach((alt, i) => {
      const letra = String.fromCharCode(65 + i);
      const checked = respuestas[index] === i ? 'checked' : '';
      html += `
        <label class="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-red-400 hover:bg-red-50 ${checked ? 'border-red-500 bg-red-100' : 'border-gray-200'}">
          <input type="radio" name="pregunta-${index}" value="${i}" ${checked} onchange="guardarRespuesta(${index}, ${i}); mostrarRetroalimentacion(${index})" class="mt-1 mr-3">
          <span class="flex-1" style="color: #374151;"><strong>${letra})</strong> ${alt}</span>
        </label>
      `;
    });

    html += `
        </div>
        <div id="retroalimentacion-${index}" class="hidden mt-6">
          <div class="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-5 shadow-md">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <i class="bi bi-lightbulb-fill text-green-600 text-2xl"></i>
              </div>
              <div class="ml-4 flex-1">
                <h5 class="text-lg font-bold text-green-800 mb-3">
                  <i class="bi bi-check-circle-fill mr-2"></i>Respuesta Correcta: ${String.fromCharCode(65 + (pregunta.correcta ?? 0))}
                </h5>
                <div class="text-gray-800 leading-relaxed" style="white-space: pre-line;">${pregunta.explicacion || ''}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    preguntaContenido.innerHTML = html;

    if (respuestas[index] !== null) {
      setTimeout(() => mostrarRetroalimentacion(index), 100);
    }

    const btnAnterior = document.getElementById('btn-anterior');
    if (btnAnterior) {
      btnAnterior.disabled = index === 0;
    }

    const btnSiguiente = document.getElementById('btn-siguiente');
    if (btnSiguiente) {
      btnSiguiente.classList.toggle('hidden', index === totalPreguntas - 1);
    }

    const btnFinalizar = document.getElementById('btn-finalizar');
    if (btnFinalizar) {
      btnFinalizar.classList.toggle('hidden', index !== totalPreguntas - 1);
    }

    actualizarProgreso();
  }

  function mostrarRetroalimentacion(index) {
    const retroElement = document.getElementById(`retroalimentacion-${index}`);
    if (retroElement && respuestas[index] !== null) {
      retroElement.classList.remove('hidden');
      retroElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function actualizarProgreso() {
    const respondidas = respuestas.filter((respuesta) => respuesta !== null).length;
    const respondidasEl = document.getElementById('respondidas');
    const barraProgreso = document.getElementById('barra-progreso');

    if (respondidasEl) {
      respondidasEl.textContent = respondidas;
    }
    if (barraProgreso) {
      barraProgreso.style.width = totalPreguntas ? `${(respondidas / totalPreguntas) * 100}%` : '0%';
    }

    updateQuestionJumper();
  }

  function comenzarPrueba() {
    if (!totalPreguntas) {
      return;
    }

    const introCard = getIntroCard();
    if (introCard) {
      introCard.classList.add('hidden');
    }

    const contenedor = document.getElementById('prueba-container');
    if (contenedor) {
      contenedor.classList.remove('hidden');
    }

    createQuestionJumper();
    renderPregunta(0);
  }

  function guardarRespuesta(index, respuesta) {
    respuestas[index] = respuesta;
    actualizarProgreso();
  }

  function anteriorPregunta() {
    if (preguntaActual > 0) {
      renderPregunta(preguntaActual - 1);
    }
  }

  function siguientePregunta() {
    if (preguntaActual < totalPreguntas - 1) {
      renderPregunta(preguntaActual + 1);
    }
  }

  function finalizarPrueba() {
    if (!totalPreguntas) {
      return;
    }

    if (confirm('¿Estás seguro de finalizar la prueba? Se mostrarán los resultados.')) {
      calcularResultados();
    }
  }

  function calcularResultados() {
    let correctas = 0;
    let dom1 = 0;
    let dom2 = 0;
    let dom3 = 0;
    let casos = 0;

    preguntas.forEach((pregunta, index) => {
      if (respuestas[index] === pregunta.correcta) {
        correctas += 1;
        if (index < 15) dom1 += 1;
        else if (index < 30) dom2 += 1;
        else if (index < 40) dom3 += 1;
        else casos += 1;
      }
    });

    const porcentaje = totalPreguntas ? Math.round((correctas / totalPreguntas) * 100) : 0;

    const puntajeTotalEl = document.getElementById('puntaje-total');
    if (puntajeTotalEl) {
      puntajeTotalEl.textContent = correctas;
    }

    const porcentajeTotalEl = document.getElementById('porcentaje-total');
    if (porcentajeTotalEl) {
      porcentajeTotalEl.textContent = porcentaje;
    }

    const dom1El = document.getElementById('dom1-correctas');
    if (dom1El) {
      dom1El.textContent = dom1;
    }

    const dom2El = document.getElementById('dom2-correctas');
    if (dom2El) {
      dom2El.textContent = dom2;
    }

    const dom3El = document.getElementById('dom3-correctas');
    if (dom3El) {
      dom3El.textContent = dom3;
    }

    const casosEl = document.getElementById('casos-correctas');
    if (casosEl) {
      casosEl.textContent = casos;
    }

    let nivel = '';
    let descripcion = '';

    if (porcentaje >= 80) {
      nivel = 'Excelente';
      descripcion = 'Dominio avanzado de contenidos ECEP';
    } else if (porcentaje >= 60) {
      nivel = 'Bueno';
      descripcion = 'Conocimientos sólidos, revisar áreas débiles';
    } else if (porcentaje >= 40) {
      nivel = 'Suficiente';
      descripcion = 'Reforzar contenidos de todos los dominios';
    } else {
      nivel = 'Insuficiente';
      descripcion = 'Requiere estudio profundo del dossier';
    }

    const nivelTextoEl = document.getElementById('nivel-texto');
    if (nivelTextoEl) {
      nivelTextoEl.textContent = nivel;
    }

    const nivelDescripcionEl = document.getElementById('nivel-descripcion');
    if (nivelDescripcionEl) {
      nivelDescripcionEl.textContent = descripcion;
    }

    mostrarSeccionResultados(true);
  }

  function createQuestionJumper() {
    // Check if already exists
    if (document.getElementById('question-jumper')) return;

    const container = document.querySelector('.min-h-screen');
    if (!container) return;

    const jumperHTML = `
      <div class="bg-white rounded-xl shadow-lg p-4 mb-6">
        <p class="text-sm font-semibold text-gray-700 mb-3 text-center">Ir a pregunta:</p>
        <div id="question-jumper" class="flex flex-wrap gap-0.5 justify-center max-w-4xl mx-auto"></div>
      </div>
    `;

    const pruebaContainer = document.getElementById('prueba-container');
    if (pruebaContainer) {
      pruebaContainer.insertAdjacentHTML('afterend', jumperHTML);
      updateQuestionJumper();
    }
  }

  function updateQuestionJumper() {
    const jumper = document.getElementById('question-jumper');
    if (!jumper) return;

    jumper.innerHTML = '';

    for (let i = 0; i < totalPreguntas; i++) {
      const btn = document.createElement('button');
      btn.className = 'w-8 h-8 rounded-full text-xs font-bold border-2 transition-all hover:scale-110';
      btn.textContent = i + 1;

      if (respuestas[i] !== null) {
        if (respuestas[i] === preguntas[i].correcta) {
          btn.classList.add('bg-green-500', 'border-green-500', 'text-white');
        } else {
          btn.classList.add('bg-red-500', 'border-red-500', 'text-white');
        }
      } else if (i === preguntaActual) {
        btn.classList.add('bg-blue-500', 'border-blue-500', 'text-white');
      } else {
        btn.classList.add('bg-white', 'border-gray-300', 'text-black', 'hover:bg-gray-100');
      }

      btn.addEventListener('click', () => renderPregunta(i));
      jumper.appendChild(btn);
    }
  }

  // Exponer funciones para los controladores inline existentes.
  root.comenzarPrueba = comenzarPrueba;
  root.mostrarPregunta = renderPregunta;
  root.mostrarRetroalimentacion = mostrarRetroalimentacion;
  root.guardarRespuesta = guardarRespuesta;
  root.anteriorPregunta = anteriorPregunta;
  root.siguientePregunta = siguientePregunta;
  root.finalizarPrueba = finalizarPrueba;
  root.reiniciarPrueba = reiniciarPrueba;
})(typeof window !== 'undefined' ? window : this);
