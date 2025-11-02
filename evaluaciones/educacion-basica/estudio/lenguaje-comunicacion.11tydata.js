module.exports = () => {
  const plan = require('../pruebas/63-sc-l/plan.json');
  const casosPorTema = {};
  try {
    const preguntas = plan?.exam?.preguntas || [];
    for (const q of preguntas) {
      const temas = q.temas_relacionados || [];
      for (const t of temas) {
        const key = String(t || '').toLowerCase();
        if (!casosPorTema[key]) casosPorTema[key] = [];
        casosPorTema[key].push(q);
      }
    }
  } catch {}
  return { plan, casosPorTema };
};
