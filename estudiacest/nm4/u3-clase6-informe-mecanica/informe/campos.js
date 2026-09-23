// Campos que completa el estudiante en el informe técnico mecánico de la Clase 6
// (NM4, 4°A Mecánica Industrial y 4°B Mecánica Automotriz). Un solo archivo para
// la página, el panel docente y el servidor (api/_informe-tecnico-nm4.js).
(function (root) {
  const ESPECIALIDADES = ['Mecánica Industrial', 'Mecánica Automotriz'];
  const RIESGOS = ['Alto', 'Medio', 'Bajo'];
  const ESTADOS = ['Crítico: detener equipos hoy', 'Requiere corrección', 'Sin observaciones'];
  const AL_DIA = ['Al día', 'Vencida'];
  const TEMAS = ['CP-01 · compresor (Mecánica Industrial)', 'EL-01 · elevador de vehículos (Mecánica Automotriz)'];
  const FOTOS = ['Foto 1', 'Foto 2', 'Foto 3', 'Foto 4', 'Sin registro fotográfico'];

  // type: text | textarea | select | date | number
  const questions = [
    { id: 'emision', section: 'portada', type: 'date', label: 'Fecha de emisión', max: 10 },
    { id: 'especialidad', section: 'portada', type: 'select', label: 'Tu especialidad', options: ESPECIALIDADES, max: 40 },
    { id: 'resumen', section: 'resumen', type: 'textarea', label: 'Resumen', max: 1400, rows: 6 },
    { id: 'obj2', section: 'objetivos', type: 'text', label: 'Objetivo específico 2', max: 220 },
    { id: 'obj3', section: 'objetivos', type: 'text', label: 'Objetivo específico 3', max: 220 },
    { id: 'superficie', section: 'ficha', type: 'number', label: 'Superficie del taller (m²)', max: 8 },
    { id: 'cp01Proxima', section: 'ficha', type: 'date', label: 'CP-01 · próxima mantención según el plan', max: 10 },
    { id: 'cp01Estado', section: 'ficha', type: 'select', label: 'CP-01 · estado de la mantención', options: AL_DIA, max: 10 },
    { id: 'equipoCritico', section: 'ficha', type: 'text', label: 'Equipo más crítico', max: 120 },
    { id: 'estado', section: 'ficha', type: 'select', label: 'Nivel de atención del taller', options: ESTADOS, max: 60 },
    { id: 'f3Desc', section: 'fotos', type: 'textarea', label: 'Descripción técnica de la Foto 3', max: 700, rows: 4 },
    { id: 'f4Eje', section: 'fotos', type: 'text', label: 'Foto 4 · punto de toma en el plano', max: 20 },
    { id: 'f4Desc', section: 'fotos', type: 'textarea', label: 'Descripción técnica de la Foto 4', max: 700, rows: 4 },
    { id: 'h2Criterio', section: 'hallazgos', type: 'textarea', label: 'Hallazgo 2 · criterio', max: 600, rows: 3 },
    { id: 'h2Efecto', section: 'hallazgos', type: 'textarea', label: 'Hallazgo 2 · efecto', max: 600, rows: 3 },
    { id: 'h2Recomendacion', section: 'hallazgos', type: 'textarea', label: 'Hallazgo 2 · recomendación', max: 600, rows: 3 },
    { id: 'h2Riesgo', section: 'hallazgos', type: 'select', label: 'Hallazgo 2 · nivel de riesgo', options: RIESGOS, max: 10 },
    { id: 'h3Tema', section: 'hallazgos', type: 'select', label: 'Hallazgo 3 · equipo de tu especialidad', options: TEMAS, max: 60 },
    { id: 'h3Titulo', section: 'hallazgos', type: 'text', label: 'Hallazgo 3 · título', max: 160 },
    { id: 'h3Riesgo', section: 'hallazgos', type: 'select', label: 'Hallazgo 3 · nivel de riesgo', options: RIESGOS, max: 10 },
    { id: 'h3Foto', section: 'hallazgos', type: 'select', label: 'Hallazgo 3 · foto que lo demuestra', options: FOTOS, max: 30 },
    { id: 'h3Condicion', section: 'hallazgos', type: 'textarea', label: 'Hallazgo 3 · condición', max: 700, rows: 3 },
    { id: 'h3Criterio', section: 'hallazgos', type: 'textarea', label: 'Hallazgo 3 · criterio', max: 600, rows: 3 },
    { id: 'h3Efecto', section: 'hallazgos', type: 'textarea', label: 'Hallazgo 3 · efecto', max: 600, rows: 3 },
    { id: 'h3Recomendacion', section: 'hallazgos', type: 'textarea', label: 'Hallazgo 3 · recomendación', max: 600, rows: 3 },
    { id: 'conclusion', section: 'conclusiones', type: 'textarea', label: 'Conclusión', max: 1400, rows: 6 },
    { id: 'declaracion', section: 'firma', type: 'select', label: 'Confirmación final', options: ['Declaro que este informe se basa solo en la evidencia registrada'], max: 80 }
  ];

  const activity = {
    sessionId: 'nm4-u3-clase6-informe-mecanica',
    code: 'ITM-AVL-INS-T01',
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

  const api = { activity, questions, isComplete, sanitize, progress, ESPECIALIDADES, RIESGOS, ESTADOS, FOTOS, TEMAS };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.INFORME_CAMPOS = api;
})(typeof window !== 'undefined' ? window : globalThis);
