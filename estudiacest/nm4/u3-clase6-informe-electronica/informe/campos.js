// Campos que completa 4°E Electrónica en el informe técnico de diagnóstico
// de la Clase 6 NM4. La página, el panel y el servidor comparten este archivo.
(function (root) {
  const ESPECIALIDADES = ['Electrónica'];
  const RIESGOS = ['Alto', 'Medio', 'Bajo'];
  const ESTADOS = ['Crítico: detener la línea hoy', 'Requiere intervención', 'Operación normal'];
  const EVIDENCIAS = ['Foto 1', 'Foto 2', 'Foto 3', 'Registro HMI', 'Registro de configuración'];

  const questions = [
    { id: 'emision', section: 'portada', type: 'date', label: 'Fecha de emisión', max: 10 },
    { id: 'especialidad', section: 'portada', type: 'select', label: 'Tu especialidad', options: ESPECIALIDADES, max: 40 },
    { id: 'resumen', section: 'resumen', type: 'textarea', label: 'Resumen', max: 1400, rows: 6 },
    { id: 'obj2', section: 'objetivos', type: 'text', label: 'Objetivo específico 2', max: 220 },
    { id: 'obj3', section: 'objetivos', type: 'text', label: 'Objetivo específico 3', max: 220 },
    { id: 'tensionFuente', section: 'ficha', type: 'number', label: 'Fuente PSU-01 · tensión medida (VDC)', max: 8 },
    { id: 'tensionSensor', section: 'ficha', type: 'number', label: 'Sensor S1 con caja presente · salida medida (VDC)', max: 8 },
    { id: 'temperaturaGabinete', section: 'ficha', type: 'number', label: 'Gabinete · temperatura máxima registrada (°C)', max: 8 },
    { id: 'alarmasTemperatura', section: 'ficha', type: 'number', label: 'Alarmas de temperatura de los últimos tres días', max: 4 },
    { id: 'estado', section: 'ficha', type: 'select', label: 'Nivel de atención del sistema', options: ESTADOS, max: 60 },
    { id: 'f2Desc', section: 'fotos', type: 'textarea', label: 'Descripción técnica de la Foto 2', max: 700, rows: 4 },
    { id: 'f3Desc', section: 'fotos', type: 'textarea', label: 'Descripción técnica de la Foto 3', max: 700, rows: 4 },
    { id: 'versionActiva', section: 'fotos', type: 'text', label: 'Versión activa del programa PLC', max: 12 },
    { id: 'versionRespaldo', section: 'fotos', type: 'text', label: 'Última versión respaldada', max: 12 },
    { id: 'h2Criterio', section: 'hallazgos', type: 'textarea', label: 'Hallazgo 2 · criterio', max: 600, rows: 3 },
    { id: 'h2Efecto', section: 'hallazgos', type: 'textarea', label: 'Hallazgo 2 · efecto', max: 600, rows: 3 },
    { id: 'h2Recomendacion', section: 'hallazgos', type: 'textarea', label: 'Hallazgo 2 · recomendación', max: 600, rows: 3 },
    { id: 'h2Riesgo', section: 'hallazgos', type: 'select', label: 'Hallazgo 2 · nivel de riesgo', options: RIESGOS, max: 10 },
    { id: 'h3Titulo', section: 'hallazgos', type: 'text', label: 'Hallazgo 3 · título', max: 160 },
    { id: 'h3Riesgo', section: 'hallazgos', type: 'select', label: 'Hallazgo 3 · nivel de riesgo', options: RIESGOS, max: 10 },
    { id: 'h3Evidencia', section: 'hallazgos', type: 'select', label: 'Hallazgo 3 · evidencia principal', options: EVIDENCIAS, max: 40 },
    { id: 'h3Condicion', section: 'hallazgos', type: 'textarea', label: 'Hallazgo 3 · condición', max: 700, rows: 3 },
    { id: 'h3Criterio', section: 'hallazgos', type: 'textarea', label: 'Hallazgo 3 · criterio', max: 600, rows: 3 },
    { id: 'h3Efecto', section: 'hallazgos', type: 'textarea', label: 'Hallazgo 3 · efecto', max: 600, rows: 3 },
    { id: 'h3Recomendacion', section: 'hallazgos', type: 'textarea', label: 'Hallazgo 3 · recomendación', max: 600, rows: 3 },
    { id: 'conclusion', section: 'conclusiones', type: 'textarea', label: 'Conclusión', max: 1400, rows: 6 },
    { id: 'declaracion', section: 'firma', type: 'select', label: 'Confirmación final', options: ['Declaro que este informe se basa solo en la evidencia registrada'], max: 80 }
  ];

  const activity = {
    sessionId: 'nm4-u3-clase6-informe-electronica',
    code: 'AUT-PVL-DIA-L02',
    requiredForSubmit: [
      'tensionFuente', 'tensionSensor', 'temperaturaGabinete', 'alarmasTemperatura', 'estado',
      'f2Desc', 'f3Desc', 'versionActiva', 'versionRespaldo',
      'h2Criterio', 'h2Efecto', 'h2Recomendacion', 'h2Riesgo',
      'h3Titulo', 'h3Riesgo', 'h3Evidencia', 'h3Condicion', 'h3Criterio', 'h3Efecto', 'h3Recomendacion'
    ],
    questions
  };

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
      value = question.type === 'textarea'
        ? value.replace(/\r\n?/g, '\n').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n')
        : value.replace(/\s+/g, ' ');
      value = value.trim().slice(0, question.max);
      if (question.type === 'select' && value && !question.options.includes(value)) value = '';
      if (question.type === 'number') value = value.replace(/[^\d.,]/g, '');
      if (question.type === 'date' && value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) value = '';
      if (value) clean[question.id] = value;
    });
    return clean;
  }

  function progress(answers) {
    const done = questions.filter(question => isComplete(question, answers && answers[question.id]));
    return { score: done.length, total: questions.length, missing: questions.filter(q => !done.includes(q)) };
  }

  const api = { activity, questions, isComplete, sanitize, progress, ESPECIALIDADES, RIESGOS, ESTADOS, EVIDENCIAS };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.INFORME_CAMPOS = api;
})(typeof window !== 'undefined' ? window : globalThis);
