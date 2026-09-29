// Campos del informe técnico de 4°B Mecánica Automotriz. Este archivo es la
// única definición de preguntas para la página, el panel y la API.
(function (root) {
  const ESPECIALIDADES = ['Mecánica Automotriz'];
  const RIESGOS = ['Alto', 'Medio', 'Bajo'];
  const ESTADOS = ['No apto para circular', 'Requiere reparación antes de servicio', 'Apto con seguimiento'];
  const EVIDENCIAS = ['Foto 1 · vehículo en elevador', 'Foto 2 · freno delantero', 'Foto 3 · amortiguador', 'Orden de trabajo y bitácora'];
  const questions = [
    { id: 'emision', section: 'portada', type: 'date', label: 'Fecha de emisión', max: 10 },
    { id: 'especialidad', section: 'portada', type: 'select', label: 'Especialidad', options: ESPECIALIDADES, max: 40 },
    { id: 'resumen', section: 'resumen', type: 'textarea', label: 'Resumen ejecutivo', max: 1400, rows: 6 },
    { id: 'obj2', section: 'objetivos', type: 'text', label: 'Objetivo específico 2', max: 220 },
    { id: 'obj3', section: 'objetivos', type: 'text', label: 'Objetivo específico 3', max: 220 },
    { id: 'kilometraje', section: 'mediciones', type: 'number', label: 'Kilometraje del vehículo (km)', max: 9 },
    { id: 'espesorPastilla', section: 'mediciones', type: 'number', label: 'Espesor mínimo de pastilla delantera (mm)', max: 8 },
    { id: 'espesorDisco', section: 'mediciones', type: 'number', label: 'Espesor del disco delantero izquierdo (mm)', max: 8 },
    { id: 'humedadLiquido', section: 'mediciones', type: 'number', label: 'Humedad del líquido de frenos (%)', max: 8 },
    { id: 'estado', section: 'mediciones', type: 'select', label: 'Decisión de aptitud del vehículo', options: ESTADOS, max: 60 },
    { id: 'f2Desc', section: 'fotos', type: 'textarea', label: 'Descripción técnica de la Foto 2', max: 700, rows: 4 },
    { id: 'f3Desc', section: 'fotos', type: 'textarea', label: 'Descripción técnica de la Foto 3', max: 700, rows: 4 },
    { id: 'ruedaInspeccionada', section: 'fotos', type: 'text', label: 'Rueda y posición inspeccionada', max: 80 },
    { id: 'proximaMantencion', section: 'mediciones', type: 'date', label: 'Próxima mantención planificada', max: 10 },
    { id: 'h2Criterio', section: 'hallazgos', type: 'textarea', label: 'Hallazgo 2 · criterio', max: 650, rows: 3 },
    { id: 'h2Efecto', section: 'hallazgos', type: 'textarea', label: 'Hallazgo 2 · efecto', max: 650, rows: 3 },
    { id: 'h2Recomendacion', section: 'hallazgos', type: 'textarea', label: 'Hallazgo 2 · recomendación', max: 650, rows: 3 },
    { id: 'h2Riesgo', section: 'hallazgos', type: 'select', label: 'Hallazgo 2 · nivel de riesgo', options: RIESGOS, max: 10 },
    { id: 'h3Titulo', section: 'hallazgos', type: 'text', label: 'Hallazgo 3 · título', max: 170 },
    { id: 'h3Riesgo', section: 'hallazgos', type: 'select', label: 'Hallazgo 3 · nivel de riesgo', options: RIESGOS, max: 10 },
    { id: 'h3Evidencia', section: 'hallazgos', type: 'select', label: 'Hallazgo 3 · evidencia principal', options: EVIDENCIAS, max: 60 },
    { id: 'h3Condicion', section: 'hallazgos', type: 'textarea', label: 'Hallazgo 3 · condición', max: 700, rows: 3 },
    { id: 'h3Criterio', section: 'hallazgos', type: 'textarea', label: 'Hallazgo 3 · criterio', max: 650, rows: 3 },
    { id: 'h3Efecto', section: 'hallazgos', type: 'textarea', label: 'Hallazgo 3 · efecto', max: 650, rows: 3 },
    { id: 'h3Recomendacion', section: 'hallazgos', type: 'textarea', label: 'Hallazgo 3 · recomendación', max: 650, rows: 3 },
    { id: 'conclusion', section: 'conclusiones', type: 'textarea', label: 'Conclusión técnica', max: 1400, rows: 6 },
    { id: 'declaracion', section: 'firma', type: 'select', label: 'Confirmación final', options: ['Declaro que el informe se basa solo en la evidencia del caso'], max: 90 }
  ];
  const requiredForSubmit = [
    'emision', 'especialidad', 'resumen', 'obj2',
    'kilometraje', 'espesorPastilla', 'espesorDisco', 'estado',
    'f2Desc', 'f3Desc',
    'h2Criterio', 'h2Efecto', 'h2Recomendacion', 'h2Riesgo',
    'h3Condicion', 'h3Criterio', 'h3Efecto', 'h3Recomendacion',
    'conclusion', 'declaracion'
  ];
  const activity = { sessionId: 'nm4-u3-clase6-informe-automotriz', code: 'MA-FLM-DIA-V17', questions, requiredForSubmit };
  function isComplete(question, value) {
    const text = String(value == null ? '' : value).trim();
    if (!text) return false;
    if (question.type === 'select') return question.options.includes(text);
    if (question.type === 'number') return /^\d+(?:[.,]\d+)?$/.test(text);
    if (question.type === 'date') return /^\d{4}-\d{2}-\d{2}$/.test(text);
    if (question.type === 'textarea') return text.length >= 20;
    return text.length >= 2;
  }
  function sanitize(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const clean = {};
    questions.forEach(question => {
      let value = String(source[question.id] == null ? '' : source[question.id]);
      value = question.type === 'textarea' ? value.replace(/\r\n?/g, '\n').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n') : value.replace(/\s+/g, ' ');
      value = value.trim().slice(0, question.max);
      if (question.type === 'select' && value && !question.options.includes(value)) value = '';
      if (question.type === 'number') value = value.replace(/[^\d.,]/g, '');
      if (question.type === 'date' && value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) value = '';
      if (value) clean[question.id] = value;
    });
    return clean;
  }
  function progress(answers) {
    const clean = sanitize(answers);
    const required = new Set(requiredForSubmit);
    const minimumQuestions = questions.filter(question => required.has(question.id));
    const done = minimumQuestions.filter(question => isComplete(question, clean[question.id]));
    return { score: done.length, total: minimumQuestions.length, missing: minimumQuestions.filter(question => !done.includes(question)) };
  }
  const api = { activity, questions, requiredForSubmit, isComplete, sanitize, progress, ESPECIALIDADES, RIESGOS, ESTADOS, EVIDENCIAS };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.INFORME_CAMPOS = api;
})(typeof window !== 'undefined' ? window : globalThis);
